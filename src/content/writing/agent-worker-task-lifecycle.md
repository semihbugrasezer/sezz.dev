---
title: 'Why my agent worker does not close its own tasks'
description: 'The worker in Seerxo OS can claim, run, retry and recover tasks unattended. What it cannot do by default is mark one done. Notes on the lifecycle and the race conditions behind it.'
slug: why-my-agent-worker-does-not-close-its-own-tasks
created: 2026-11-01
topic: Agentic AI
kind: article
tags: [agents, orchestration, postgresql, reliability, seerxo-os]
draft: false
---

An agent that can finish its own work can also declare its own work finished. In Seerxo OS I split
those two things apart. The unattended worker runs tasks; a person closes them.

## The lifecycle

A task is `READY` when the reconciler or a person has created it and its dependencies are done. The
worker moves it to `IN_PROGRESS`, runs a model CLI, and hands the result to a supervisor. If the
supervisor approves, the task goes to **`REVIEW`**, not `DONE`:

```python
if verdict == enums.SupervisorVerdict.APPROVED:
    run.status = enums.AgentRunStatus.SUCCEEDED
    task.status = enums.TaskStatus.REVIEW  # never DONE: the founder closes tasks
```

There is one deliberate exception: an opt-in policy, `AUTO_CLOSE_GOAL_NO_WORK`, off by default. It
can close a low-risk internal planning task created by the reconciler, and only when that task has
produced a linked follow-up task. Everything else waits for a human.

## Claiming without a queue

There is no message queue. Two workers can look at the same `READY` row, so the claim is a
conditional update:

```python
update(models.Task)
    .where(models.Task.id == task.id, models.Task.status == enums.TaskStatus.READY)
    .values(status=enums.TaskStatus.IN_PROGRESS, ...)
```

If another worker got there first, this updates zero rows and the second worker walks away. The same
transaction writes an audit row for the claim, recording the newest run id at that moment.

## The ABA problem

Status alone cannot tell you whether a run still owns its task. A task can be cancelled, set back to
`READY` and claimed again: it is `IN_PROGRESS` once more, but for a newer attempt. If the old run
then writes its result, it would overwrite work it no longer owns.

So before any write, `holds_attempt()` checks, with the task row locked, that the newest claim
belongs to this run, that no founder or operator action followed that claim, that the run is still
running, and that it is the task's newest run.

## When the worker dies

A run that stays `STARTED` longer than the run timeout plus five minutes is treated as lost.
`recover_stale()` fails it and requeues the task once. If the model call had already returned, its
result is stored as a **checkpoint** on the run, and recovery resumes from it instead of calling the
model again. Model calls are slow, quota-limited and not idempotent; repeating one is not free.

## Failing in a bounded way

Retries wait 1, 5 and then 30 minutes, with three attempts by default. If every attempt failed with
the same error, the failure is reported as a loop rather than as bad luck. Quota, rate-limit and
authentication errors are treated as provider health: that provider cools down for 30 minutes and
the next zero-cost provider is tried, never a paid fallback.

## What I would not claim

These mechanisms are tested, including crash-recovery tests against a real PostgreSQL. They do not
show how often a model completes a task well; that needs measurements I have not published yet.

## Source (commit 43f000c)

- [`app/worker.py`](https://github.com/Seerxo/seerxo-os/blob/43f000caf43d67fd1fca001d0cf88dc44b06d7c2/app/worker.py): `claim`, `holds_attempt`, `recover_stale`, retries
- [`tests/test_worker_crash_recovery_postgres.py`](https://github.com/Seerxo/seerxo-os/blob/43f000caf43d67fd1fca001d0cf88dc44b06d7c2/tests/test_worker_crash_recovery_postgres.py)
- [`docs/AUTONOMOUS_AGENT_ARCHITECTURE.md`](https://github.com/Seerxo/seerxo-os/blob/43f000caf43d67fd1fca001d0cf88dc44b06d7c2/docs/AUTONOMOUS_AGENT_ARCHITECTURE.md)
- [Seerxo OS case study](/projects/seerxo-os/)

---

*Written with AI assistance from the project's source code and documentation; every claim was checked against the linked commit.*
