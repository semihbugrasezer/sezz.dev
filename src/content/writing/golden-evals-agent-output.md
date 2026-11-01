---
title: 'Golden evals for agent output: testing what the system does with a claim'
description: 'Model evals ask whether an answer is good. These ask what my agent system does when an answer is bad — a "done" with no evidence, a result for the wrong task, a smuggled approval request.'
slug: golden-evals-for-agent-output
created: 2026-11-01
topic: Agentic AI
kind: article
tags: [agents, evaluation, testing, seerxo-os]
draft: false
---

Most agent evaluation asks whether the model did the job well. In Acthelm I needed a different
question answered first: **when an agent reports a result, what does the system do with it?** A
model will sometimes say it finished when it did not. The rest of the system must not believe it.

## The supervisor contract

Every worker run ends with a structured result: task id, status, summary, evidence, and optional
fields such as an approval request. A supervisor function turns that result into one verdict:
`APPROVED`, `REVISION_REQUIRED`, `FAILED` or `ESCALATE`. An approved result moves the task to
review, not done; by default only a human closes it.

## Scenarios, not samples

`evals/test_supervisor_evals.py` is a table of claims a worker might make and the verdict each must
produce. A few rows:

| Claim the worker makes | Verdict |
| --- | --- |
| Verified result with the required evidence | `APPROVED` |
| `"Done."` with no evidence | `REVISION_REQUIRED` |
| Evidence missing the required token | `REVISION_REQUIRED` |
| "All tests passed, task complete" — but not the token the task asked for | `REVISION_REQUIRED` |
| A result for a different task | `FAILED` |
| Unknown status, empty summary, missing fields, not an object | `FAILED` |
| Status `completed`, but carrying an approval request | `ESCALATE` |

The last row is the one I care about most: a "completed" result is not allowed to quietly include a
request to deploy.

## Why deterministic

No model is called in these tests. The agent is replaced by fixed inputs, so the tests pin the
behaviour of the control plane, not the quality of a model. That makes them cheap enough to run on
every change — CI runs them in the "Python tests and golden evaluations" step — and stable enough
that a failure always means the system changed.

The same idea covers prompt injection (`evals/test_trust_evals.py`): text from an external page that
says "ignore all previous instructions" is data inside an envelope, never an instruction.

## What this does not measure

It says nothing about how often a real model completes a task, how accurate its tool calls are, or
what a task costs. A live injection eval against a real provider exists in the repository but has no
published run yet. Those numbers need a separate harness with recorded runs.

## Source

- [`evals/test_supervisor_evals.py`](https://github.com/Seerxo/seerxo-os/blob/43f000caf43d67fd1fca001d0cf88dc44b06d7c2/evals/test_supervisor_evals.py)
- [`evals/test_trust_evals.py`](https://github.com/Seerxo/seerxo-os/blob/43f000caf43d67fd1fca001d0cf88dc44b06d7c2/evals/test_trust_evals.py)
- [Acthelm case study](/projects/seerxo-os/)

---

*Written with AI assistance from the project's source code and documentation; every claim was checked against the linked commit.*
