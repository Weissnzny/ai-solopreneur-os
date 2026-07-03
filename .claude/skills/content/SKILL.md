---
name: content
description: Use when creating content for any platform. Routes a topic or idea through up to 8 specialized content departments — you pick which ones to run, review each output before moving to the next. Trigger on "create content", "run content", "I need a hook", "write a caption", "video script", "carousel", "lead magnet", or any department name. One topic = one content session.
---

# /content — 战 The Campaign (router)

The front door to the **战 (Campaign)** loop: take one topic and run it through an 8-department
content system. You select which departments to run each session. Each produces a specialized output;
AI drafts, you review, you approve before the next runs. **Human stays in the loop at every step by
design.**

## What `/content` is NOT
- Not an auto-publisher. The review step is non-negotiable.
- Not a scheduler. This produces content; publishing is a separate manual step.

## Inputs this skill reads
- Topic/idea from you (in chat).
- Your voice register — short sentences, scene-first, no em dashes, no hustle clichés. (Keep a
  `voice.md` in your OS and read it here if you have one; otherwise use `framework/operating-principles.md`.)
- Your audience — who this content is for.

## The 8 Departments
| # | Department | Produces |
|---|---|---|
| 1 | Content Ideas | 5 content angle ideas |
| 2 | Hook | 3 attention-grabbing opening lines |
| 3 | Caption | Platform-optimized caption (FB / LinkedIn / TikTok / IG) |
| 4 | Video Script | Short-form script (30s / 60s / 90s) |
| 5 | Storytelling | Narrative arc: Scene → Tension → Insight → Step |
| 6 | Storyboard | Scene-by-scene visual breakdown |
| 7 | Lead Magnet | Concept + title + 5-point outline |
| 8 | Carousel | Slide-by-slide breakdown |

## Execution

### Phase 1 — Topic input
Ask three things: (1) the topic, (2) who it's for, (3) which department(s) to run. Show the menu:
```
1 — Content Ideas   2 — Hook   3 — Caption   4 — Video Script
5 — Storytelling    6 — Storyboard   7 — Lead Magnet   8 — Carousel
Type the number(s) (e.g. "2", "1, 3, 7", or "all")
```

### Phase 2 — Run selected departments (in numbered order)
**Step 1 — Run it.** Generate the output. Apply your voice (short sentences, scene first, no em
dashes, no corporate language, warm but direct). Display under a clear header `## Department [#]: [Name]`.

**Step 2 — Human review.** Ask: "Good to move on, or refine this?" If refine → ask what to change,
regenerate, loop. **Never skip this review step.**

### Department specifics
- **1 Content Ideas** — exactly 5: `[Angle] — [one sentence on why it resonates]`.
- **2 Hook** — exactly 3, each on its own line, no numbering. Vary style: question / bold claim / pattern interrupt.
- **3 Caption** — for a quick one-platform caption, ask which platform and write to its contract (FB: conversational, ends with a question · LinkedIn: authority-first, 1-sentence lines, CTA at end · TikTok: punchy, hashtag block · IG: visual-first, 2-3 lines above the fold). For a full multi-platform package, hand off to `/caption`.
- **4 Video Script** — ask length (30/60/90s). Format `[HOOK 3s] / [BODY] / [CTA 5s]` with (on-screen text) cues. For the full W Founder Notes format + save, hand off to `/video-script`.
- **5 Storytelling** — Scene → Tension → Insight → Step. 4 short paragraphs. End on one concrete step.
- **6 Storyboard** — a table: `Scene # | Shot | On-screen text | Action/VO`. 6-10 scenes for 60s.
- **7 Lead Magnet** — `TYPE / TITLE / HOOK / 5-point OUTLINE`.
- **8 Carousel** — `SLIDE 1 (Cover) … LAST SLIDE (CTA)`, 7-10 slides. For the full visual build, hand off to `/carousel`.

### Phase 3 — Package
After all selected departments run, output a clean summary (each department under a header). Then ask:
"Want to save this package? I'll write `output/content/[YYYY-MM-DD]-[topic-slug].md`." Save only if yes.

## Critical rules
1. Never skip the human review between departments.
2. Always apply your voice — no generic AI-sounding content (run the result through `/humanize` if unsure).
3. One topic per session. Two topics → run twice.
4. The save step is optional — never auto-save.
5. Read-only except the optional content package file.
6. No fabrication — every factual claim traces to something real (`framework/operating-principles.md`).

## Output Standard
Orchestrator produces chat output + an optional package at `output/content/`. Per-department deep
builds follow their own skill's Output Standard.
