---
title: Bridge
summary: A small Go gateway that accepts Anthropic Messages API requests and forwards them to any OpenAI-compatible Chat Completions provider, so AI coding agents can run against other models.
order: 4
disciplines: [Autonomous AI, Backend & Infrastructure]
stack: [Go (stdlib), Server-Sent Events, Node.js launcher, GitHub Actions]
status: Early compatibility layer · v0.3.0
problem: Coding agents built for one model API cannot talk to providers that only expose OpenAI-compatible endpoints.
repo: https://github.com/Seerxo/bridge
measured: 2026-10-31
facts:
  - Translates tool_use / tool_result blocks to and from tool_calls
  - Re-emits upstream streams as Anthropic-style SSE events
  - Launcher verifies release checksums; keys go to the OS keychain
l10n:
  tr:
    summary: "Anthropic Messages API isteklerini kabul edip OpenAI uyumlu herhangi bir Chat Completions sağlayıcısına ileten küçük bir Go ağ geçidi; böylece AI kodlama ajanları başka modellerle çalışabilir."
    problem: "Tek bir model API'si için yazılmış kodlama ajanları, yalnızca OpenAI uyumlu uç noktalar sunan sağlayıcılarla konuşamaz."
    status: "Erken uyumluluk katmanı · v0.3.0"
  de:
    summary: "Ein kleines Go-Gateway, das Anfragen im Format der Anthropic Messages API entgegennimmt und an beliebige OpenAI-kompatible Chat-Completions-Anbieter weiterleitet, sodass KI-Coding-Agenten auch mit anderen Modellen arbeiten können."
    problem: "Coding-Agenten, die für eine Modell-API gebaut sind, können nicht mit Anbietern sprechen, die nur OpenAI-kompatible Endpunkte bereitstellen."
    status: "Frühe Kompatibilitätsschicht · v0.3.0"
---

## What it does

Bridge translates Anthropic Messages requests — system prompts, `tool_use` and `tool_result`
blocks — into OpenAI Chat Completions requests, and maps responses back, including `tool_calls`
to `tool_use` stop reasons. Streaming responses are re-emitted as Anthropic-style SSE events
(`content_block_start` and friends).

## Engineering notes

- Binds to `127.0.0.1` by default.
- A configurable first-byte timeout (`BRIDGE_FIRST_BYTE_TIMEOUT`, default 60 s) has a regression
  test for upstreams that never send response headers.
- The `npx` launcher downloads the platform binary from GitHub Releases, verifies its SHA-256
  checksum, and stores the provider key in macOS Keychain or the Linux Secret Service.
- Tag-triggered releases cross-compile macOS, Linux and Windows binaries with a checksum file.
- CI runs `go test`, `go vet` and `node --test` with SHA-pinned actions.

## Limitations

The README describes it as an early compatibility layer: images, prompt caching and extended
thinking are not translated yet. The public history is a single squashed commit.
