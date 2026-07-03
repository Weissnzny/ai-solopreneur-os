---
name: storyboard
description: Convert a video script into AI-ready visual prompts per shot, routed to the right model (image vs motion vs character vs hero), marking which shots you film yourself and which AI fills. Default mode is hybrid (you film human shots, AI fills cinematic/surreal/transition gaps) and outputs PROMPTS ONLY. Optional `cheatcode` mode runs a previs-first pipeline (concept → storyboard sheet → optional preview → hero render) — the one mode that can render, each render approval-gated with a cost check. Trigger on "/storyboard", "storyboard", "visual prompts", "ai b-roll prompts", "shot list for AI", "storyboard cheatcode", "previs sheet".
---

# /storyboard — 战 The Campaign (AI-ready visual prompts)

Takes a video script (e.g. a `/video-script` Founder Notes table, free text, or a doc) and produces a
**storyboard** with a per-shot decision:

- **FILM-IT** — you film this yourself (real location, real props, real face). References the script's B-roll item.
- **AI-GEN** — a full copy-paste prompt for the right kind of model.

By default the skill **writes prompts only — it never renders.** Generation happens later through your
own image/video engine, under its own approval gate (`framework/operating-principles.md`).

## What this skill is NOT
- **NOT** an image/video generator (except the opt-in `cheatcode` mode below). It writes prompts.
- **NOT** a replacement for filming. Default is hybrid — you still film yourself; AI only fills gaps.

## Read first
- Your `voice.md` — short sentences, scene first, no em dashes.
- *(Optional)* if the brief names an aesthetic ("cottagecore", "cyberpunk", "Y2K"), weave real style
  vocabulary (colours → palette · motifs → props · values → mood) into the prompt. Opt-in; no fabrication.

## Modes
| Trigger | Mode | What it does |
|---|---|---|
| `/storyboard` (default) | Hybrid | script → mark FILM-IT vs AI-GEN → write prompts for the AI shots only |
| `/storyboard cheatcode` | Previs → render | concept → storyboard **sheet** → optional cheap preview → hero render. **The one mode that renders**, each step approval-gated with a cost check. |

## Default (hybrid) flow

### Phase 1 — Per-shot decision
For each shot/beat in the script:
1. Read the beat (overlay text, shot description).
2. **Can you film this yourself?** (real location, real props, real face) → mark **FILM-IT** + reference the B-roll item. Otherwise → route the AI shot:
   - **Static frame** (cover, end card, mockup, surreal still) → an **image** model.
   - **Character keyframe** (your face required) → a **character/reference** image model + your face reference. **Face gate:** if a face-on AI shot is needed and you have no trained identity/reference, HALT and tell the user to set one up first.
   - **Motion clip** (3-8s, no dialogue) → a **video** model.
   - **Hero / dialogue / audio-heavy shot** → a **premium video** model.
The skill *proposes* the routing; the user can override per shot ("I'll film shot 4", "use motion for shot 3").

### Phase 2 — Write the prompts
For each AI-GEN shot, a self-contained, copy-paste prompt block with:
- The kind of model it's for (image / character / motion / hero) — keep it engine-neutral so it works with whatever engine the user has wired.
- **Aspect ratio** (default 9:16 vertical, 1080×1920).
- A reference note (your face reference if it's a character shot; none otherwise).
- The full prompt body.
- A one-line "how to fire" note: *render this with your image/video engine — that step costs money and needs explicit approval.*

### Phase 3 — Save
Write the storyboard to `output/storyboards/{YYYY-MM-DD}-{slug}.md`: the per-shot table (beat · FILM-IT/AI-GEN ·
model kind · prompt) + the FILM-IT B-roll checklist. Report the path and which shots are yours to film.

## `cheatcode` mode (opt-in, can render — gated)
One-line concept → a multi-panel **storyboard sheet** (single image) → optional **cheap preview** clip → a
**hero render**. Engine-flexible (sheet via your image engine; video via your video engine). **Each render
step is approval-gated with a cost check** — present the engine + estimated cost and wait for a yes before
any paid call. Without an image/video key wired, this mode stops at the prompt/sheet-spec stage.

## Critical rules
1. Default mode writes **prompts only** — no render, no paid call.
2. `cheatcode` renders only with an explicit per-step approval + cost check.
3. Face-on AI shots need a real identity/reference you've set up — HALT if missing, never invent a face.
4. No fabrication in any on-screen claim.
5. Output to `output/storyboards/`, never the repo root.

## Output Standard
Format: a storyboard markdown (per-shot prompts + FILM-IT checklist) under `output/storyboards/`. Default =
no paid API. `cheatcode` renders are separately, per-step approval-gated.
