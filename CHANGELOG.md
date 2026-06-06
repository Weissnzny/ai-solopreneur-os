# Changelog

All notable changes to the **AI Solopreneur OS** are recorded here. Newest on top.
Versioning is semantic (`MAJOR.MINOR.PATCH`); the current version lives in `VERSION`.

---

## 0.4.5 — 2026-06-06 — W_Counsel doc current with the v0.43 shell (history, model toggle, 查库)

Documentation-only: refreshed `w-counsel/README.md` again as the shell moved from v0.37 → **v0.43**.
No OS skill/framework/Arsenal change.

- **Added to the controls doc:** ⚡ Sonnet / 🧠 Opus **model toggle** + a **$ cost** readout; **📜 past
  councils** (every conversation saved on disk, reopen with transcript repainted, survives restarts);
  **formatted (markdown) replies**; **skill search + recently-used**; and the context meter now notes
  **auto-compaction** (summarize-and-continue) instead of a hard reset.
- **🏯 查库 / Arsenal search:** documented the new built-in — if the content folder (or a settings-configured
  **Arsenal folder**) carries a `wiki-search` tool, a 查库 pill lets 军师 search that wiki and answer with
  `[[page]]` citations, read-only.

## 0.4.4 — 2026-06-06 — W_Counsel doc brought current with the v0.37.0 shell

Documentation-only: refreshed `w-counsel/README.md` (the canonical description of the optional W_Counsel
shell) to match the shipped app, which had moved several versions ahead of the doc. No OS skill, framework,
or Arsenal change.

- **New in the doc:** an "In the app — the controls" section (composer + `Alt+V` voice, 📎 read-once
  attachments, 🔇/`Esc` mute-voice vs ⏹ STOP vs ↺ new-round, the ⚔ skills tray with the four pillars and
  **hover descriptions**, and the **context-window meter** that warns at ~50% / ~80%).
- **Profiles:** documented the **multiple-W_Counsel profile switcher** — save named arsenals and switch the
  active content folder from ⚙ settings (re-reads layout, refreshes the tray, starts a fresh round).
- **Caught up:** voice picker + language-driven default voice; flat ↔ OS **layout auto-detect**.
- Keeps the deliberate "this folder does not vendor the heavy app" design — the shell's code still lives in
  its own app folder; this is the canonical *description*, now accurate to **W_Counsel v0.37.0**.

Two additive upgrades to the OS health check (`/system-check`, 知 Knowing). Scoring rubric (4 loops ×
25) and read-only discipline are unchanged; still frontmatter-only, under ~60s.

- **Trend on re-run.** It now reads the newest saved check in `output/system-check/` and shows the
  **±delta per loop and total** (e.g. `72/100 · ▲+8 since 2026-05-20`); first run reads `first baseline`.
  Saved reports carry a small frontmatter block (`total` · `knowing` · `formation` · `campaign` ·
  `the_way`) so the next run reads the trend deterministically. Delivers the skill's standing promise —
  *"re-run to watch the score climb"* — which until now it never actually measured.
- **Lint nudge.** When the Arsenal (`wiki/`) is stocked beyond examples but `wiki/log.md` shows no
  recent `lint`, the report adds a **"Keep it healthy"** line suggesting `lint` in `wiki/`. It's
  maintenance, not a scored gap — a stocked-but-unlinted Arsenal is a quality risk the structural score
  can't see. Ties the structural OS check to the Arsenal's own content health-check.

Files: **`skills/system-check/SKILL.md`** (Steps 1, 4, 5 + Notes), **`agents/knowing.md`** (the
`/system-check` line now mentions tracking across runs). No new API, key, or sync.

---

## 0.4.2 — 2026-06-02 — two solopreneur-benefit callouts (Arsenal graph · content command center)

Docs only — surface two payoffs that already existed in the OS but weren't sold. No behaviour change,
no new API, key, or sync.

- **`wiki/CLAUDE.md`** (§0) — new **"📖 Read your Arsenal however you like"** callout: the Arsenal is
  plain markdown with `[[backlinks]]`, so any markdown editor (Obsidian / VS Code / plain text) renders
  it as a second brain you can *see*. Ships **`wiki/wiki-knowledge-graph.png`** as proof, and ties the
  graph back to the campaign skills (`/content` · `/caption` · `/carousel` · `/video-script`) — every
  node is raw material those skills already know how to fire. Knowledge as ammunition, not decoration.
- **`README.md`** — new **"🗓️ Your calendar becomes the content command center"** callout under the
  "What you can run" table: with the `gws` connector, `/content-plan` plans a week, then (approval-gated)
  pushes each topic onto your own Google Calendar as a dated, filterable `[CONTENT]` event linked to its
  script Doc. Framed honestly — Calendar + Docs *are* the command center here, **not** a Sheet; no
  auto-run claim.

---

## 0.4.1 — 2026-06-02 — name + credit the LLM-knowledge-base pattern (库 Arsenal)

Reframed the **库 Arsenal** (`wiki/`) as what it already is — a **personal LLM knowledge base** in the
sense Andrej Karpathy described (raw sources → an LLM-compiled `.md` wiki with backlinks → an
auto-maintained `index.md` + summaries for Q&A → periodic health-check linting). The OS's existing
`ingest` / `ask` / `lint` ops *are* that loop; what the Arsenal adds is the routing layer (build ·
story · content). Docs/attribution only — no behaviour change.

- **`wiki/overview.md`** — "What this is" now names the LLM-knowledge-base pattern and links the source.
- **`wiki/CLAUDE.md`** — added a **Lineage** note (§0) mapping `ingest`/`ask`/`lint` to the pattern.
- **`README.md`** — new **Acknowledgements** section backlinks
  [@karpathy's post](https://x.com/karpathy/status/2039805659525644595); Arsenal table row reworded.
- Honest framing throughout: *inspired by, not affiliated with or endorsed by.*

---

## 0.4.0 — 2026-06-02 — /system-check now scores the 4 Loops

The OS health check (`/system-check`, 知 Knowing) now grades your install against the **four loops
(四谋)** the rest of the doctrine already runs on — **知 Knowing · 阵 Formation · 战 Campaign · 道 The
Way**, 25 points each — instead of the old, separate **Four Cs** (Context · Connections · Capabilities
· Cadence). One vocabulary across the whole OS: the loop you score is the loop you run.

- **`system-check/SKILL.md`** — rubric, discovery steps, scoring weights, gap multipliers, and the
  scoreboard relabelled to the four loops. Each loop now maps to the question it answers (e.g. 道 The
  Way → *"will this still feel like mine?"* → operating-principles installed, your *why* captured, a
  `/shutdown` close, no-fabrication discipline). Scoring stays out of 100; stages unchanged.
- **`commands/system-check.md`** — shim description updated ("score your OS against the 4 Loops").
- **`agents/knowing.md`** — rewritten in the W_Counsel (军师) voice; the `/system-check` line now
  reads "scores the OS against the 4 Loops."
- **`README.md`** — the "What you can run" table now says "score your OS against the 4 Loops."

No behavioural change to any other skill; read-only health check, no new API or sync.

---

## 0.3.1 — 2026-06-01 — initial public release

The first public, source-available cut of the AI Solopreneur OS — a weekly operating system for a
one-person AI business, run inside Claude Code. Released under the AI Solopreneur OS License v1.0
(use and adapt for your own business; no redistribution, resale, or rebranding).

- **Framework** — the **W_Counsel (军师)** doctrine: five pillars **势 · 律 · 令 · 谋 · 库**
  (Terrain · Rhythm · Morning Command · Grand Strategy · Arsenal) holding four loops
  **知 · 阵 · 战 · 道** (Knowing · Formation · Campaign · the Way), plus the **军纪** operating rules
  (no fabrication · anti-hype · family-first · plain language · approval gates).
- **Skills & agents** — **17 skills** (a curated, sanitized subset of a private workspace — no personal
  IDs, secrets, or client data; every external resource is `.env`-keyed or optional), **19 command
  shims**, and **4 loop-agents** (knowing · formation · campaign · the-way). Paid renders are gated
  behind an optional key; nothing auto-publishes.
- **库 Arsenal** (`wiki/`) — the knowledge-base schema + templates + one worked example per department.
- **Connectors / design / onboarding** — optional Google Workspace (`gws`) guide (no keys shipped),
  brand-agnostic design tokens, first-run `/kick-off` onboarding, and a `scripts/verify.mjs` publish gate.
- **Optional W_Counsel shell** — docs for connecting the optional voice + 3D strategist app (a portable,
  no-install Windows build) to this OS.
