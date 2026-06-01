---
name: system-check
description: Use when someone asks to "check my OS", "score my setup", "is my OS working", "audit my system", "find gaps". Scores the installed AI Solopreneur OS against the Four Cs (Context, Connections, Capabilities, Cadence), out of 100, and surfaces the top 3 fixes ranked by leverage.
---

# /system-check — 知 Knowing (the OS health check)

Scores **this installed OS** against the **Four Cs** out of 100, and surfaces the top 3 leverage-ranked
gaps with concrete next steps. Read-only except the optional report it offers to save. First run is your
baseline; re-run to watch the score climb.

> Scope is structural — *is the OS set up right?* — not *what could it do.* Read-only: never modify the
> framework, skills, agents, or any source file (`framework/operating-principles.md` §6).

## The Four Cs (25 each = 100)
| Layer | Test |
|---|---|
| **Context** | Does the OS know you? — `onboarding/intake.md` filled, `voice.md` present, framework read |
| **Connections** | Can it reach your stuff? — `.env` keys present, connectors wired (`connectors/README.md`) |
| **Capabilities** | Can it do work? — skills + agents present and matched by command shims |
| **Cadence** | Does it run as a rhythm? — you're using `/start-day`, the board (`brain/`) has recent entries |

## Execution
### Step 1 — Discover the shape (Glob + targeted Read, frontmatter only — fast)
- **Context:** is `onboarding/intake.md` filled (no `{{ONBOARD}}` left)? does `voice.md` exist? does `brain/board.json` exist?
- **Connections:** does `.env` exist with any non-empty key? which connectors in `connectors/README.md` are actually wired?
- **Capabilities:** count `.claude/skills/*/SKILL.md`; count `.claude/agents/*.md`; confirm each skill has a command shim.
- **Cadence:** recent files under `output/` or recent `brain/board.json` `updated`; whether a daily routine is in use.

### Step 2 — Score each C (25 pts)
**Context (25):** intake filled (8) · `voice.md` present with a real sample (7) · framework present & read (5) · a second-brain board exists (5).
**Connections (25):** at least one connector wired (10) · `.env` from template, no secrets in the repo (5) · each wired connector documented (5) · at least one read-AND-write reach, e.g. calendar (5).
**Capabilities (25):** 3+ skills (10) · all skills have command shims (5) · 1+ agent (5) · the 4 loops each have at least one skill mapped (5).
**Cadence (25):** you've run `/start-day` / use a daily rhythm (10) · activity in `output/` or the board within ~30 days (10) · the Arsenal (`wiki/`) has real entries beyond the examples (5).

### Step 3 — Top 3 gaps by leverage
leverage = (points lost) × (impact multiplier). Multipliers: no connector wired **3×** · intake unfilled **3×** · 0 skills **2×** · no daily rhythm **2×** · all-read-only connections **2×** · Arsenal still just examples **1.5×** · everything else **1×**. Sort descending, take top 3, write a one-line concrete next step for each (e.g. "run `/kick-off`", "wire `gws` per `connectors/README.md`", "run `/start-day` tomorrow").

### Step 4 — Output the report (chat, Markdown)
```
# OS Check — {date}
**Score: {total}/100** ({stage})
Stages: 0-39 Foundation · 40-69 Built · 70-89 Compounding · 90-100 Autonomous

## Scoreboard
Context       {bar}  {n}/25
Connections   {bar}  {n}/25
Capabilities  {bar}  {n}/25
Cadence       {bar}  {n}/25
(bar = ## per 5 pts)

## Strengths
- {1-3 bullets}

## Top 3 Gaps (by leverage)
1. {gap} (-{pts} × {mult}) → {next step}
2. ...
3. ...

## Suggested next: {single most leveraged action}
```

### Step 5 — Offer to save
Ask: "Save this to `output/system-check/check-{date}.md` to track over time?" Save only if yes. That's the only write.

## Notes
- Read-only by default; honest, not generous (most fresh installs land 40-70).
- Don't suggest skills that aren't installed.
- Speed: frontmatter reads only, under ~60s.

## Output Standard
Format: Markdown report in chat + optional saved file under `output/system-check/`. No paid API, no external sync.
