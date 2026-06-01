---
name: system-map
description: Use when you want to "see the whole system", "what's going on across the OS", "system map", "show me the OS at a glance", or a one-glance picture of the entire AI Solopreneur OS. Scans the installed OS markdown and renders a live, layered node-diagram readable in under 2 minutes.
---

# /system-map — 势 The Terrain

The **势 (Terrain)** pillar: see the whole board in one glance. Produces **one glanceable map** of
your installed OS — every run is a **live snapshot**, re-scanned from the OS's own files so the
picture reflects reality the day it runs.

It is a *map*, not a report. No prose. Nodes, chains, states. The reader should understand the state
of the whole OS in **under 2 minutes**.

This is **read-only** except for the single HTML artifact it writes. Never modify the framework,
skills, agents, or any source file (see `framework/operating-principles.md` §6).

## Scope (hard boundary)
- **In scope:** everything inside this OS folder — `framework/`, `.claude/skills/`, `.claude/agents/`,
  `.claude/commands/`, `connectors/`, `wiki/`, `design-system/`, `CLAUDE.md`.
- **Out of scope:** anything outside this OS folder (your other projects, client data, system files).
- Read **markdown only**. Don't open `.css`/`.py`/`.js` to derive structure — markdown is the source of truth.

## Execution

### Step 1 — Scan the OS (markdown only, fast)
Use Glob + targeted Read. Count, don't deep-read. Gather:

| Signal | Where | Extract |
|---|---|---|
| Pillars | `framework/ai-solopreneur-os.md` | The 5 pillars (势 律 令 谋 库) + the 4 loops (知 阵 战 道). |
| Skills | `.claude/skills/*/SKILL.md` | Count folders; read only frontmatter `name` + first description line. |
| Commands | `.claude/commands/*.md` | Confirm each skill has a shim (note orphans). |
| Agents | `.claude/agents/*.md` | Count + name + which loop each serves. |
| Connectors | `connectors/README.md` | Which integrations are documented and whether keys are present (`.env`). |
| Arsenal | `wiki/` | Whether the knowledge base has real entries beyond the examples. |
| Cadence | `CLAUDE.md` | What runs as a daily rhythm vs on-demand. |

Group skills under the **four loops** (知 Knowing · 阵 Formation · 战 Campaign · 道 The Way) plus the
spine pillars (势 律 令). A skill that doesn't fit goes in a clearly-named cluster — never drop it.

### Step 2 — Derive the live values
- `skills` = skill folder count.
- `loops` = the four loops, each with the skills mapped under it.
- `connectors` = which integrations are wired (key present) vs documented-only.
- `cadence` = one word: `Daily` (you run a routine), `Ad-hoc` (on demand), or `Dormant`.
- `summary` = ONE plain sentence stating the OS's state today.

### Step 3 — Render the map
Produce a single self-contained HTML one-pager (inline CSS, no external assets) laid out by the five
pillars, with each node carrying a state:
- `live` — present / wired / active
- `pending` — planned or documented but not wired
- `off` — absent or parked

Use the design tokens in `design-system/` for colors so it matches the OS brand. Keep node counts
tight enough to read in under 2 minutes — summarize a long tail as a `+N more` node.

### Step 4 — Save and report
1. Write to `output/system-map/system-map-{date}.html` (create the folder if needed). This is the only write.
2. In chat, give a 3-5 line digest: skill count, connectors wired/total, cadence, and the single most
   notable gap you saw.
3. End with the artifact path.

## Notes
- **Speed matters.** Glob + frontmatter reads only. Whole run under ~60s.
- **Live, never stale.** Always overwrite from the scan; never ship placeholder nodes.
- **Honest states.** A connector is `live` only if its key is actually present. Documented ≠ wired.
- **No prose creep.** This is a map. Resist turning nodes into sentences.
- **2-minute test.** Before finishing: could someone glance at this and know the OS's state in two minutes?

## Output Standard
Format: HTML one-pager (node diagram). Variant: OS default tokens (`design-system/`). Save to
`output/system-map/`. No paid API, no external sync.
