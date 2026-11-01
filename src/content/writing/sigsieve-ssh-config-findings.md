---
title: 'Filtering an SSH agent: the hard part was not the protocol'
description: 'SigSieve parses only three SSH agent messages. Its three hardest bugs were elsewhere: in how OpenSSH configuration can forward the unfiltered agent around the filter.'
slug: filtering-an-ssh-agent-the-hard-part-was-not-the-protocol
created: 2026-11-01
topic: Security Engineering
kind: article
tags: [ssh, security, rust, threat-modeling, sigsieve]
draft: false
---

SigSieve is a small Rust proxy that sits in front of your SSH agent and forwards only allow-listed
keys. I expected the risky part to be parsing the agent protocol. The parser handles three message
types, rejects everything else, and is fuzzed. The serious findings came from somewhere else:
**SSH client configuration that sends the unfiltered agent around the filter.**

Every finding is recorded in the repository's findings register. Three of the seven rated HIGH show
the pattern.

## F-01: a shared connection forwards the wrong agent

With connection sharing (`ControlMaster`), a new session can ride on an existing master connection.
If that master was started with `ssh -A`, the new session asks it to forward *its* agent: the
unfiltered one. SigSieve's own check passed, because `ssh -G` reports what the client would forward,
not what an existing master would.

**Fix:** start every session with `-o ControlPath=none -o ControlMaster=no` and verify that no
sharing remains in the effective configuration. A regression test reproduces the attack against a
real `sshd`.

## F-02: a `ProxyCommand` can hide a second ssh

A `ProxyCommand` such as `/usr/bin/env ssh -A …` or `sh -c '…'` starts a nested ssh that forwards
the full agent to the bastion. Recognising "safe" proxy commands by their words turned out to be
bypassable.

**Fix:** stop recognising and start refusing. Every `ProxyCommand` except a plain `ssh … -W …` relay
without shell syntax is rejected; `ProxyJump` remains available.

## F-29: the jump host has its own configuration

The F-02 check ran on the destination's configuration. But each `ProxyJump` hop runs its own ssh,
which reads its own `ssh_config`, inherits the session environment (including the login agent) and
does not receive SigSieve's options. A wrapper on a jump host could still forward the unfiltered
agent.

**Fix:** verify every hop, not only the destination.

## The rule that came out of it

All three bugs are the same mistake: trusting a description of what ssh *should* do instead of
constraining what it *can* do. The resulting rule is in the design: refuse configurations that
cannot be verified (`Match exec`, `PermitLocalCommand yes`, `StrictHostKeyChecking=no`, X11
forwarding and non-relay proxy commands) rather than try to analyse them.

SigSieve remains experimental and has not been independently audited. These findings came from
internal, AI-assisted reviews run in separate contexts, and each fix has a regression test.

## Source (commit 269cf91)

- [`docs/FINDINGS.md`](https://github.com/semihbugrasezer/sigsieve/blob/269cf91dd2ae006a0f3aa557659b87f5ec0f543c/docs/FINDINGS.md): F-01, F-02, F-29 with root cause, fix commit and tests
- [`docs/LIMITATIONS.md`](https://github.com/semihbugrasezer/sigsieve/blob/269cf91dd2ae006a0f3aa557659b87f5ec0f543c/docs/LIMITATIONS.md)
- [`docs/THREAT_MODEL.md`](https://github.com/semihbugrasezer/sigsieve/blob/269cf91dd2ae006a0f3aa557659b87f5ec0f543c/docs/THREAT_MODEL.md)
- [SigSieve case study](/projects/sigsieve/)

---

*Written with AI assistance from the project's source code and documentation; every claim was checked against the linked commit.*
