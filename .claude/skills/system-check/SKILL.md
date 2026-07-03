---
name: system-check
description: Use when someone asks to "check my OS", "score my setup", "is my OS working", "audit my system", "find gaps". Scores the installed AI Solopreneur OS against the 4 Loops (知 Knowing · 阵 Formation · 战 Campaign · 道 The Way), out of 100, and surfaces the top 3 fixes ranked by leverage.
---

# /system-check — 知 Knowing (the OS health check)

Scores **this installed OS** against the **4 Loops (四谋)** out of 100, and surfaces the top 3
leverage-ranked gaps with concrete next steps. Read-only except the optional report it offers to save.
First run is your baseline; re-run to watch the score climb.

> Scope is structural — *is the OS set up right?* — not *what could it do.* Read-only: never modify the
> framework, skills, agents, or any source file (`framework/operating-principles.md` §6).

## The 4 Loops (25 each = 100)
Each loop asks one question. The check measures whether your install can actually answer it.

| Loop | Question it answers | What's tested |
|---|---|---|
| **知 Knowing** | *Does the OS know you and your field?* | `onboarding/intake.md` filled, `voice.md` present, framework read, the Arsenal (`wiki/`) stocked beyond examples |
| **阵 Formation** | *Are the structures built to hold the line?* | skills + loop-agents present and matched by command shims, at least one connector wired, clean `.env` |
| **战 Campaign** | *Are you shipping real work into the arena?* | a daily rhythm in use, recent shipped activity, a second-brain board with recent entries |
| **道 The Way** | *Will this still feel like yours — sustainable and honest?* | operating-principles installed, your "why" captured, a `/shutdown` close, no-fabrication discipline intact |

## Execution
### Step 1 — Discover the shape (Glob + targeted Read, frontmatter only — fast)
- **Prior check (for the trend line):** glob `output/system-check/check-*.md`; if any exist, read the **newest** one and lift its `total` + four loop scores from its frontmatter. None yet → this run is the baseline.
- **知 Knowing:** is `onboarding/intake.md` filled (no `{{ONBOARD}}` left)? does `voice.md` exist with a real sample? are `framework/` + `glossary.md` present? does `wiki/` hold real entries beyond the `example-*` files? **and** does `wiki/log.md` record a recent `lint` op — or is the Arsenal stocked but never health-checked?
- **阵 Formation:** count `.claude/skills/*/SKILL.md`; count `.claude/agents/*.md` (the 4 loop-agents: knowing · formation · campaign · the-way); confirm each skill has a command shim; does `.env` hold any non-empty key, and which connectors in `connectors/README.md` are actually wired?
- **战 Campaign:** recent files under `output/` or a recent `brain/board.json` `updated`; whether a daily routine (`/start-day` / `/shutdown`) is in use.
- **道 The Way:** is `framework/operating-principles.md` present and unmodified? does the intake capture your *why* / non-negotiables (values, boundaries — not just what you sell)? is `/shutdown` part of the rhythm? does `voice.md` anchor a true voice?

### Step 2 — Score each loop (25 pts)
**知 Knowing (25):** intake filled, no `{{ONBOARD}}` (8) · `voice.md` present with a real sample (5) · framework + glossary present (4) · the Arsenal (`wiki/`) has real entries beyond the examples (8).
**阵 Formation (25):** 3+ skills (6) · every skill has a command shim (4) · the 4 loop-agents present (5) · at least one connector wired (6) · clean `.env` from template, no secrets in the repo (4).
**战 Campaign (25):** you run a daily rhythm — `/start-day` / `/shutdown` (10) · shipped activity in `output/` or the board within ~30 days (10) · a second-brain board (`brain/board.json`) exists with recent entries (5).
**道 The Way (25):** `framework/operating-principles.md` present & unmodified — the 军纪 are installed (8) · your *why* / non-negotiables captured in intake (7) · a `/shutdown` close is in the rhythm — you actually stop, evenings protected (5) · no-fabrication discipline intact — `voice.md` anchors a true voice, content traces to real sources (5).

### Step 3 — Top 3 gaps by leverage
leverage = (points lost) × (impact multiplier). Multipliers: intake unfilled — Knowing is blind **3×** · no connector wired — Formation can't reach **3×** · 0 skills or missing loop-agents — no Formation **2×** · no daily rhythm — no Campaign **2×** · operating-principles missing or *why* uncaptured — the Way unguarded **2×** · all-read-only connections **2×** · Arsenal still just examples — Knowing under-armed **1.5×** · everything else **1×**. Sort descending, take top 3, write a one-line concrete next step for each (e.g. "run `/kick-off`", "wire a connector per `connectors/README.md`", "run `/start-day` tomorrow").

### Step 4 — Output the report (chat, Markdown)
```
# OS Check — {date}
**Score: {total}/100** ({stage}){ · ▲+{Δ} since {prevdate} | first baseline}
Stages: 0-39 Foundation · 40-69 Built · 70-89 Compounding · 90-100 Autonomous

## Scoreboard
知 Knowing    {bar}  {n}/25  {Δtag}
阵 Formation  {bar}  {n}/25  {Δtag}
战 Campaign   {bar}  {n}/25  {Δtag}
道 The Way    {bar}  {n}/25  {Δtag}
(bar = ## per 5 pts · Δtag = ▲+3 / ▼-2 / – vs last check; omit the whole column on first run)

## Strengths
- {1-3 bullets}

## Top 3 Gaps (by leverage)
1. {gap} (-{pts} × {mult}) → {next step}
2. ...
3. ...

## Keep it healthy
{Only when the Arsenal is stocked but wiki/log.md shows no recent `lint`:}
- Your Arsenal has real entries but hasn't been linted lately — run `lint` in `wiki/` to catch contradictions, stale claims, and orphans before they compound.
{If a recent lint exists, omit this section (or one line: "Arsenal linted {date} — clean").}

## Suggested next: {single most leveraged action}
```
**Trend line:** if a prior check was found, append `· ▲+{Δ} since {prevdate}` (or `▼{Δ}` / `· level since {prevdate}`) to the Score line, and a per-loop `{Δtag}`. First run: write `first baseline` and omit the Δ column — then say one line: "Re-run after your next fixes to watch it move."

### Step 5 — Offer to save
Ask: "Save this to `output/system-check/check-{date}.md` to track over time?" Save only if yes. That's the only write.
Save with a small **frontmatter block first**, so the next run can read the trend deterministically:
```
---
date: {YYYY-MM-DD}
total: {total}
knowing: {n}
formation: {n}
campaign: {n}
the_way: {n}
---
{the report body from Step 4}
```
(Step 1 reads exactly these keys from the newest file. Filename `check-{YYYY-MM-DD}.md` keeps "newest" sortable.)

## Notes
- Read-only by default; honest, not generous (most fresh installs land 40-70).
- Don't suggest skills that aren't installed.
- The four loops are a cycle, not a ladder — a healthy OS scores across all four, not 100 on one.
- **Trend:** deltas compare against the *newest* saved check only (not an average). No prior file → this run is the baseline, no Δ shown. Reading the prior file stays within the frontmatter-only, read-only budget.
- **Lint nudge ≠ a scored gap.** It's maintenance, not points — a stocked Arsenal that's never linted is a silent quality risk the structural score can't catch. Only raise it when `wiki/` is stocked beyond examples and `wiki/log.md` shows no recent `lint`.
- Speed: frontmatter reads only, under ~60s.

## Output Standard
Format: Markdown report in chat + optional saved file under `output/system-check/`. No paid API, no external sync.
