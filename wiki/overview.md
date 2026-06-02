# Overview — 库 The Arsenal (the front door)

This is the front door to your knowledge vault and the current state of your thinking. Rewrite it in
your own words as the Arsenal fills up.

## What this is
The **库 (Arsenal)** pillar of the AI Solopreneur OS — a **personal LLM knowledge base**: you drop raw
sources in `raw/`, and the OS *compiles* them into a living wiki of linked `.md` pages, keeps an
`index.md` + summaries current, answers questions against it, and health-checks itself. You rarely
edit the wiki by hand — that's the OS's job. The pattern follows Andrej Karpathy's
[LLM knowledge bases](https://x.com/karpathy/status/2039805659525644595) (raw → compile → index → ask
→ lint); the Arsenal adds the part he leaves open: **how to route what you learn into action** — build
a system, tell a story, make content. (See `CLAUDE.md` §0 for the routing.)

## How to use it
- Drop a raw source in `raw/`, then tell the OS: **`ingest <source>`**.
- Ask it anything: **`ask <question>`** — it answers with citations and offers to file the answer.
- Keep it healthy: **`lint`** — it flags contradictions, stale claims, orphans, and gaps.

## Current state
Seeded 2026-06-01 with one worked example per department (`example-*`). Nothing real yet — your first
real ingest replaces the examples. Start with a source you already trust.
