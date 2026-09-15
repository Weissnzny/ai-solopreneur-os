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

### Step 3 — Fill the template (never hand-write the HTML)
The look lives in **`.claude/skills/system-map/template.html`** so every run looks the same. Do not
restyle it, rewrite it, or build your own page. Fill exactly two slots and change nothing else:

1. **Tokens.** Replace the line `/*__TOKENS__*/` with the full contents of `design-system/tokens.css`.
   That is how a rebrand reaches the map.
2. **Data.** Replace `__MAP_DATA__` (inside `<script type="application/json" id="map-data">`) with the
   scan as JSON, in this shape. Escape every `</` in the JSON as `<\/`.

```json
{
  "date": "YYYY-MM-DD",
  "os_version": "contents of VERSION",
  "summary": "ONE plain sentence: the state of the OS today",
  "stats": { "skills": 17, "commands": 19, "agents": 4,
             "connectors_wired": 0, "connectors_total": 3, "cadence": "Daily | Ad-hoc | Dormant" },
  "next_move": { "gap": "the single most notable gap, one sentence",
                 "command": "/the-command-that-closes-it",
                 "why": "one short line: what running it changes" },
  "context": { "ready": 0, "total": 3,
               "files": [ { "name": "who-i-am.md", "state": "live|pending|off", "note": "e.g. 19 blanks left" } ] },
  "loops": [ { "zh": "知", "en": "Knowing", "agent": "knowing", "line": "the loop's one line from CLAUDE.md",
               "skills": [ { "cmd": "/system-map", "state": "live", "desc": "first sentence of its description" } ] } ],
  "spine": [ { "zh": "势", "en": "The Terrain", "state": "live", "line": "short line",
               "items": [ { "label": "/system-map", "state": "live", "note": "short note" } ] } ],
  "connectors": [ { "name": "Google Calendar", "state": "live|pending|off",
                    "what": "what it gives you, one sentence", "how": "how to switch it on, one sentence" } ],
  "wiring": { "skills": 17, "shimmed": 17, "aliases": ["start-day", "shutdown"], "orphans": [] }
}
```

Rules for the data (the template shows long text behind a click, so keep the page scannable):
- **Loops** follow the four-loops list in `CLAUDE.md`, in order 知 阵 战 道. A skill may sit in two loops.
  The page shows five per loop and folds the rest behind `+N more`; list them all, never drop one.
- **`desc`** is the first sentence of the skill's own `description`, at most ~200 characters. Replace
  any em dash with a comma. Never invent what a skill does.
- **Spine** is 势 The Terrain · 律 The Rhythm · 令 The Morning Command · 库 The Arsenal, each with what
  is really there (e.g. wiki templates vs real entries).
- **Context** lists `who-i-am.md`, `voice.md`, `blueprint.md`: `live` = filled, `pending` = exists with
  blanks (count the `ONBOARD` markers), `off` = missing. `ready` counts only `live`.
- **States are honest.** `live` = present and working · `pending` = there but not switched on ·
  `off` = missing. A connector is `live` only if its key is actually present in `.env` (read key NAMES,
  never print a value). Documented is `pending`, not `live`.
- Plain words, no em dashes, no jargon. Everything must come from the scan; never ship example data.

### Step 4 — Save and report
1. Write to `output/system-map/system-map-{date}.html` (create the folder if needed). This is the only write.
2. In chat, give a 3-5 line digest: skill count, connectors wired/total, cadence, and the single most
   notable gap you saw.
3. End with the artifact path.

## Notes
- **Speed matters.** Glob + frontmatter reads only. Whole run under ~60s.
- **Live, never stale.** Always overwrite from the scan; never ship placeholder nodes.
- **Honest states.** A connector is `live` only if its key is actually present. Documented ≠ wired.
- **No prose creep.** This is a map. Short labels on the page; the longer text lives behind a click
  (the command drawer, `+N more`, and the fold-outs), which the template already handles.
- **Same look every run.** If the page looks wrong, fix `template.html` once; never restyle a single run.
- **2-minute test.** Before finishing: could someone glance at this and know the OS's state in two minutes?

## Output Standard
Format: HTML one-pager, filled from `template.html`. Variant: OS default tokens (`design-system/`). Save to
`output/system-map/`. No paid API, no external sync.
