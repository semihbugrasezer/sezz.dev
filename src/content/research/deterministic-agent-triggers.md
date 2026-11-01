---
title: Deterministic triggers for agent work
description: Should a language model decide whether there is work to do? Notes from Seerxo OS, where a rule-based reconciler creates tasks and a model is only called when a task already exists.
created: 2026-10-31
type: Architecture Study
status: In progress
project: seerxo-os
tags: [agents, orchestration, postgresql, reliability]
l10n:
  tr:
    title: "Ajan işleri için deterministik tetikleyiciler"
    description: "Ortada yapılacak iş olup olmadığına bir dil modeli mi karar vermeli? Seerxo OS’ten notlar: görevleri kural tabanlı bir uzlaştırıcı oluşturuyor, model yalnızca görev zaten varsa çağrılıyor."
  de:
    title: "Deterministische Auslöser für Agentenarbeit"
    description: "Sollte ein Sprachmodell entscheiden, ob es Arbeit gibt? Notizen aus Seerxo OS, wo ein regelbasierter Reconciler Aufgaben anlegt und ein Modell nur aufgerufen wird, wenn bereits eine Aufgabe existiert."
---

## Research question

In a system where AI agents act for a small company, which decisions must stay deterministic — and
what does the system look like when "is there work?" is answered without a model call?

## Background

Agent frameworks often run a model in a loop and let it choose the next action, including whether
to do anything at all. That makes cost and behaviour depend on the model's judgement at the least
observable point in the system. Seerxo OS takes the opposite position: *no work means no model
call.*

## Method

Separate the system into three layers and keep the model out of the first one:

1. **Detection (deterministic).** A cron-driven reconciler compares goals with measured metrics and
   emits tasks from a fixed rule set (`GOAL_BEHIND`, `GOAL_UNMEASURED`, `GOAL_NO_WORK`,
   `GOAL_CONFIG_INVALID`, `GOAL_ACHIEVED`). At most one open task per goal and rule, enforced by a partial
   unique index over open tasks (`uq_tasks_open_dedupe`).
2. **Execution (model-driven, bounded).** A worker claims tasks with
   `SELECT … FOR UPDATE SKIP LOCKED` and calls a model CLI in an isolated container.
3. **Authorisation (deterministic + human).** Signed policy, an allow-list of low-risk paths and a
   human signature decide what reaches production.

## Implementation

See the [Seerxo OS case study](/projects/seerxo-os/) for the architecture. The relevant pieces are
`app/business_reconciler.py`, `app/worker.py` and the migration that adds partial unique indexes
for open work (`migrations/versions/b8e41d0c7a52_open_work_unique_indexes.py`).

## Observations (so far)

- **No model calls when idle.** With no tasks, the worker sleeps; there is nothing for a model to be
  asked.
- **Deduplication belongs in the database.** A partial unique index over *open* tasks is a stronger guarantee than asking a
  model or a scheduler not to create duplicates.
- **Crash recovery needs checkpoints at the model boundary.** Storing the result of a completed
  model call means recovery never repeats it — important when calls are slow, quota-limited or not
  idempotent.
- **Infrastructure failures are not task failures.** Quota, rate-limit and metered-key refusals are
  provider *health states* with a cool-down, not task outcomes.

These are design observations from building and operating one system, not measured comparisons
against an alternative design.

## Limitations

- One system, one company, one host. No controlled comparison with a model-driven planner.
- Fixed rules only find the kinds of work someone anticipated.
- The unattended code-change path is not yet enabled, so the execution layer has mostly run
  attended.

## Next steps

- Record, per rule, how often a created task led to an accepted change.
- Run an unattended pilot of the code-change stage with recorded evidence.

## References

- Seerxo OS repository: [github.com/Seerxo/seerxo-os](https://github.com/Seerxo/seerxo-os)
  — see `README.md`, `docs/AUTONOMOUS_AGENT_ARCHITECTURE.md`, `docs/operations/DECISIONS.md`
