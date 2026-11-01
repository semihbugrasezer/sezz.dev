---
title: Threat-modelling SSH agent forwarding for non-exportable keys
description: Can a forwarded agent be narrowed to specific keys and specific destinations when the private key cannot leave the Secure Enclave? An architecture study behind SigSieve, with its assumptions and gaps written down.
created: 2026-10-31
type: Architecture Study
status: Observation
project: sigsieve
tags: [ssh, security, threat-modeling, rust]
l10n:
  tr:
    title: "Dışa aktarılamayan anahtarlar için SSH agent yönlendirmesinin tehdit modeli"
    description: "Özel anahtar Secure Enclave’den çıkamıyorken, iletilen bir agent belirli anahtarlar ve belirli hedeflerle sınırlandırılabilir mi? SigSieve’in arkasındaki mimari inceleme; varsayımlar ve açıklar yazılı olarak."
  de:
    title: "Bedrohungsmodell für SSH-Agent-Forwarding mit nicht exportierbaren Schlüsseln"
    description: "Lässt sich ein weitergeleiteter Agent auf bestimmte Schlüssel und Ziele beschränken, wenn der private Schlüssel die Secure Enclave nicht verlassen kann? Die Architekturstudie hinter SigSieve – mit dokumentierten Annahmen und Lücken."
---

## Research question

When the signing key is non-exportable (a Secure Enclave key managed by Secretive), can the
identities exposed through SSH agent forwarding be restricted — by key, and optionally by
destination host — **without** replacing the agent or moving the key?

## Background

A forwarded agent lets any process that reaches the socket on the remote host request signatures
with every loaded identity. OpenSSH already offers destination constraints (`ssh-add -h`), but
they apply to keys added to an agent; a Secure Enclave key cannot be added to a second agent. The
alternative studied here is a filtering proxy in front of the existing agent.

## Method

1. Write down assets, attackers and trust assumptions **before** implementation
   (`docs/THREAT_MODEL.md`).
2. Express the security goal as numbered invariants (`docs/SECURITY_MODEL.md`) — for example,
   *every message type other than 11, 13 and 27 is answered locally and never forwarded*.
3. Map each invariant to named tests; check some by mutation.
4. Treat parsing as the main attack surface: own bounds-checked parser, byte-exact forwarding of
   authorised requests, and four fuzz targets for the parsers.
5. Record every finding — including rejected or accepted ones — in a findings register.

## Implementation

The resulting design is described in the [SigSieve case study](/projects/sigsieve/): a synchronous
Rust proxy that filters `REQUEST_IDENTITIES`, authorises each `SIGN_REQUEST` by the fingerprint of
the key in that request, and optionally verifies `session-bind@openssh.com` host-key signatures so
that a key only signs `publickey-hostbound` authentication to an approved destination.

## Observations

- **The useful boundary is narrow.** Filtering protects *hidden* keys well. It does not protect an
  *allowed* key from misuse while forwarding is active — in filtering mode anywhere, in binding mode
  at the allowed destinations. The threat model says so explicitly.
- **Destination binding depends on the server.** Binding requires the server to support hostbound
  authentication. When measured on 2026-10-27, GitLab.com and Bitbucket Cloud did not advertise it,
  and GitHub's end-to-end behaviour had not been verified.
- **Retries are a security property.** With hardware keys, an automatic retry can mean a second
  Touch ID prompt for one user action, so the proxy never retries upstream.
- **Fail-closed has usability costs.** Binding mode refuses non-authentication signatures, which
  rules out `git commit -S` through the filtered socket.

## Evidence

- Local test run on 2026-10-31: 159 passed, 0 failed, 2 ignored; 11 `sshd` end-to-end tests passed
  with missing prerequisites treated as failures.
- One hour of fuzzing per target on the release commit: about 313 million executions without a
  crash or sanitizer report — evidence of robustness, not proof of absence of bugs.
- One owner-assisted real Secretive test (one P-256 key, two local SSH servers).

## Limitations

- No independent audit. All reviews to date were internal and AI-assisted.
- Hardware coverage is a single key type on a single machine.
- Timing side channels, a compromised local machine and a compromised upstream agent are out of
  scope.

## Next steps

- External review before any non-experimental release.
- Verify binding mode end-to-end against a hosted Git provider that supports hostbound auth.
- Record Secretive versions and prompt counts in a repeatable test protocol.

## References

- SigSieve repository: [github.com/semihbugrasezer/sigsieve](https://github.com/semihbugrasezer/sigsieve)
  — see `docs/THREAT_MODEL.md`, `docs/SECURITY_MODEL.md`, `docs/LIMITATIONS.md`, `docs/FINDINGS.md`
- OpenSSH agent protocol and extensions: [PROTOCOL.agent](https://github.com/openssh/openssh-portable/blob/master/PROTOCOL.agent)
