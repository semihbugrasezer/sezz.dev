---
title: Seerxo
summary: A live product that drafts, audits and optimises Etsy listings. One account and credit pool behind a CLI, a stdio MCP server, a remote MCP endpoint, a Claude Code skill and a web app — with a deterministic audit kept separate from metered AI generation.
order: 3
featured: true
disciplines: [Autonomous AI, Backend & Infrastructure, Security & Tools]
stack: [Node.js, JSON-RPC / MCP, REST, HMAC-SHA256, node:test, semantic-release, GitHub Actions OIDC, React]
status: Live product · npm seerxo 1.13.0
problem: An Etsy listing has hard rules (≤140-character title, exactly 13 tags of ≤20 characters) and soft ones (lead with the main keywords). Sellers need drafts that respect the rules and an honest explanation of what is wrong with listings they already have — ideally inside the AI assistant they already use.
repo: https://github.com/semihbugrasezer/seerxo
site: https://seerxo.com
package: { name: seerxo, url: 'https://www.npmjs.com/package/seerxo' }
measured: 2026-10-31
facts:
  - 30 GitHub releases; 33 npm versions
  - 5 MCP tools, 2 runtime dependencies
  - 103 test cases, CI on Node 18 / 20 / 22
  - 28 GitHub stars (not a user count)
---

## Overview

Seerxo helps Etsy sellers write listings. Describe a product and it drafts a full listing — title,
A/B title variants, description, 13 tags and Etsy attributes. Give it an existing listing and it
scores it, explains each finding, rewrites it, or suggests keywords.

The same account and credit pool is reachable from several surfaces: a terminal CLI, a local MCP
server for Claude Desktop, Claude Code and other MCP clients, a remote MCP endpoint, a Claude Code
skill/plugin, and the web app at [seerxo.com](https://seerxo.com). The client is open source (MIT,
published to npm as `seerxo`); the business logic runs in a hosted backend that is not public.

## The problem

Etsy listings have strict structural rules, and most advice about "SEO" for them is vague. I wanted
two things that are often conflated to stay separate:

- **Checking** a listing against explicit rules should be deterministic, explainable and free.
- **Writing** a listing is a generative task and costs real money per call.

And it should work where sellers increasingly already are: inside an AI assistant.

## System architecture

```mermaid
flowchart LR
  subgraph client["Open-source client (npm: seerxo)"]
    CLI["seerxo CLI"]
    MCP["seerxo-mcp<br/>stdio JSON-RPC"]
    SK["Claude Code skill"]
  end
  Hosts["Claude Desktop / Claude Code<br/>other MCP clients"] --> MCP
  Hosts -->|"Streamable HTTP"| RMCP["remote MCP endpoint"]
  SK --> CLI
  CLI -->|"HMAC-signed /v1/*"| API["Seerxo API"]
  MCP -->|"HMAC-signed /v1/*"| API
  RMCP --> API
  Web["seerxo.com"] --> API
  API --> LLM["LLM provider"]
  API --> Store[("datastore")]
  API --> AS["Etsy search autosuggest"]
```

Only the client side of this diagram is public. Backend internals are shown at the level the
public repository documents them.

## Core components

**CLI.** `login` (browser approval, then an API key is stored locally), `generate`,
`analyze`/`audit`, `optimize`, `keywords`, `skill add`, an interactive shell and `--json` output
for scripting.

**Local MCP server.** A stdio server speaking newline-delimited JSON-RPC with five tools:
`generate_etsy_seo`, `seerxo_analyze_listing`, `seerxo_optimize_listing`,
`seerxo_suggest_keywords` and `seerxo_quota`.

**Remote MCP.** A Streamable HTTP endpoint listed in the MCP Registry as
`io.github.semihbugrasezer/seerxo`, so hosts can connect without installing anything.

**Claude Code skill.** Uses the MCP tools when they are connected and falls back to the CLI
otherwise. It instructs the agent not to hand-write listings or invent metrics.

**Versioned API.** The client calls `/v1/generate`, `/v1/analyze`, `/v1/optimize` and
`/v1/keywords`. The backend owns business rules, quota and persistence; clients never hold
model-provider keys.

## Design decisions

- **Thin client, server-owned logic.** Quota and rules live in one place and clients hold no AI
  keys. The cost is that nothing works offline.
- **Hand-written MCP over a framework.** The client has two runtime dependencies (`chalk`,
  `open`) and no MCP SDK. That keeps the install and the supply-chain surface small, at the price
  of maintaining protocol-version negotiation by hand.
- **No automatic retry on metered calls.** Retrying a `generate` or `optimize` POST could charge a
  user twice. Instead there is a 120-second timeout, overridable with `SEERXO_TIMEOUT_MS`.
- **stdout is a contract.** While serving MCP, logs go to stderr only. CLI output, tool schemas
  and exit codes are treated as compatibility contracts; deprecated fields such as `seoScore` are
  kept as aliases.
- **Deterministic audit, metered generation.** `analyze` is rule-based, returns versioned rule IDs
  with a severity and a fix for each finding, and is unlimited on the free tier. Its schema carries
  a `limitations` field and states that the 0–100 score is *not a rank or sales prediction*, so
  agents relaying it cannot overclaim.

## Security and reliability

- Each API request is signed with HMAC-SHA256 over the JSON payload and a timestamp.
- The local credentials file is written with `0700` directory and `0600` file permissions; the
  README states plainly that it is plaintext.
- CI actions are pinned by SHA; `npm audit` gates high-severity production advisories; OSV-Scanner
  and OpenSSF Scorecard run weekly; Dependabot is enabled.

## Testing and validation

`node --test` with `esmock`: 103 test cases in 18 files (static count), including an end-to-end
test of the stdio MCP server and fixed HMAC signature fixtures. CI runs tests, syntax checks and a
package-contents check on Node 18, 20 and 22.

Releases are automated: semantic-release publishes to npm and GitHub Releases on every merge to
`main`, then updates the MCP Registry entry through GitHub OIDC with no long-lived secret.

## Results and evidence

- Live at [seerxo.com](https://seerxo.com); the API health endpoint responded on 2026-10-31.
- 30 GitHub releases, 33 npm versions, 28 GitHub stars and 7 forks (measured 2026-10-31).

I do not publish user, revenue or conversion figures here. Stars and download counts are not user
counts.

## Limitations

- The backend and web frontend are closed source; only the client is open.
- The most recent weekly OSV-Scanner run (2026-10-26) failed and needs attention.
- The committed `server.json` lags the published version; CI rewrites it only at release time.
- The public Git history begins in July 2026, although the repository was created in October 2025.

## Future directions

- Fix the failing dependency-scan run and keep the registry manifest in sync with releases.
- Extend the deterministic audit with more versioned rules before adding more generation.

## References

- Repository: [github.com/semihbugrasezer/seerxo](https://github.com/semihbugrasezer/seerxo)
- Package: [npmjs.com/package/seerxo](https://www.npmjs.com/package/seerxo)
- Product: [seerxo.com](https://seerxo.com)
