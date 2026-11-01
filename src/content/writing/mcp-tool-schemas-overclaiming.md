---
title: 'Designing MCP tool schemas that keep agents from overclaiming'
description: 'An agent relays whatever a tool returns. In Seerxo the tool output itself carries its limitations, a versioned scoring rule and a plain statement of what the score is not.'
slug: mcp-tool-schemas-that-keep-agents-honest
created: 2026-11-01
topic: Developer Tools
kind: article
tags: [mcp, tool-calling, llm, seerxo]
draft: true
---

<!--
DRAFT prepared from the public Seerxo client repository (commit 8c52984). Semih: rewrite in your own
words, check every claim against the code, and set `draft: false` only when you are happy to defend it.
-->

When an AI assistant calls a tool, the user rarely sees the raw output. They see the assistant's
summary of it. If the tool returns a bare number, the assistant will happily turn "72" into "your
listing will rank well". So in Seerxo I treated the **tool schema as part of the product's honesty**.

## Put the caveat in the data

The listing audit (`seerxo_analyze_listing`) returns more than a score. The output schema in
`src/mcp/tools.js` requires:

- `overallScore` — described as a *deterministic Listing Readiness score from 0 to 100; not a rank
  or sales prediction*;
- `scoringVersion` and `scoreType` — fixed constants, so a result can be traced to the rules that
  produced it;
- `limitations` — what the audit cannot measure or predict;
- `weakPoints` — each with a versioned `ruleId`, a severity, an explanation and a concrete fix.

An assistant that relays the result has the limitation in front of it, in the same object as the
number.

## Separate checking from generating

The audit is rule-based and free. Generation, optimisation and keyword suggestions use a model and
cost credits. Keeping them apart means the part users trust as a measurement is reproducible, and
the generative part is clearly labelled as such.

## Tell the agent what not to do

The Claude Code skill that ships with the client is explicit: do not hand-write a replacement
listing or invent metrics when a Seerxo tool is available; do not invent search volume; if the audit
returns no weak points, say the listing passed instead of manufacturing work; never call a paid tool
speculatively.

## Keep the contract stable

`stdout` is the MCP transport, so logs go to stderr. Renamed fields stay as deprecated aliases
(`seoScore` for `overallScore`). An end-to-end test drives the stdio server like a real client.

## Source

- [`src/mcp/tools.js`](https://github.com/semihbugrasezer/seerxo/blob/8c529841efc37ebb999500bd1b7e5bbfaba9e985/src/mcp/tools.js)
- [`skills/seerxo-etsy-seo/SKILL.md`](https://github.com/semihbugrasezer/seerxo/blob/8c529841efc37ebb999500bd1b7e5bbfaba9e985/skills/seerxo-etsy-seo/SKILL.md)
- [`tests/stdio-mcp.test.js`](https://github.com/semihbugrasezer/seerxo/blob/8c529841efc37ebb999500bd1b7e5bbfaba9e985/tests/stdio-mcp.test.js)
- [Seerxo case study](/projects/seerxo/)
