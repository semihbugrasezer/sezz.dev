---
title: Self-hosted DevOps platform
summary: A minimal self-hosted PaaS. An API clones a repository, builds an image, health-checks a candidate container and promotes it behind Traefik, recording every deployment in PostgreSQL, with an optional metrics and logging stack.
order: 5
disciplines: [Backend & Infrastructure]
stack: [Node.js 22, Express, Docker Compose, Traefik, PostgreSQL, Redis, Prometheus, Grafana, Loki]
status: Learning project · no automated tests
problem: Understanding what a deployment platform actually has to do — build, verify, route, record and observe — by building a small one end to end.
repo: https://github.com/semihbugrasezer/self-hosted-devops
measured: 2026-10-31
facts:
  - Candidate container is health-checked before promotion
  - Deployments and ordered events stored in PostgreSQL
  - Docker API reached only through a socket proxy
---

## What it does

An Express control plane exposes `/health`, `/ready` and `/deploy`. A deployment runs
`git clone` → `docker build` → start a candidate container → health check → promote it with
Traefik routing labels → remove the previous release. Every deployment and its ordered events are
written to PostgreSQL (`deployments`, `deployment_events`); Redis holds status and is a readiness
dependency.

## Engineering notes

- `/deploy` requires a bearer token, is rate-limited and only accepts allow-listed repositories.
- The Docker API is reached through a socket proxy; shell-outs use `execFile`, never a shell
  string; the API runs as a non-root user.
- An optional observability profile adds Prometheus with alert rules, a provisioned Grafana
  dashboard, Loki/Promtail logs, and cAdvisor/node-exporter host telemetry.

## Limitations

There are no automated tests (`npm test` only performs a syntax check). The Trivy image scan is
informational, not blocking. Terraform and Kubernetes files are scaffolding and are not part of the
deploy path. Promotion is a candidate swap, not weighted canary routing.
