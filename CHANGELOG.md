# Changelog

All notable changes to the **AI Solopreneur OS** are recorded here. Newest on top.
Versioning is semantic (`MAJOR.MINOR.PATCH`); the current version lives in `VERSION`.

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
