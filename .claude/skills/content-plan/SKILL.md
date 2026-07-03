---
name: content-plan
description: Plan ONE week of content topics, get approval, then (optionally) push them to your Google Calendar and generate a per-day script doc. One topic per day; all platform outputs derive from that one topic. Pushing to Calendar is approval-gated and needs the gws connector. Trigger on "plan content", "content calendar", "plan my week", "plan next week", "schedule content".
---

# /content-plan — 战 The Campaign (one-week planner)

Takes your topics for **one week**, presents a plan for approval, then — only after explicit approval —
optionally pushes events to your Google Calendar and writes a per-day script doc.

**Core rule: one topic per day.** All platform outputs (TikTok, IG, LinkedIn, Facebook…) derive from that
one topic. No platform gets a different topic on the same date.

## Read first
- `onboarding/intake.md` — your posting days, platforms, languages, and audience.
- Your `voice.md` — tone for the script bodies.

## Pillar rhythm (default — adjust to your intake)
A simple weekly spine; swap to fit your market:

| Day | Pillar | Focus |
|---|---|---|
| Mon | Educational | how-to, framework, tool breakdown |
| Tue | Mindset / Personal brand | a reframe, a point of view |
| Wed | Storytelling | a real journey / behind-the-scenes (no fabrication) |
| Thu | Entertainment | relatable, lighter format |
| Fri | Educational (actionable) | a prompt, a workflow, a resource |

Vary the **format** inside Educational slots (How-to · Framework · Checklist · Case Study · Mistakes to
Avoid · Explainer · FAQ) — never the same format on consecutive Educational days.

## Execution

### Phase 1 — Collect topics
Ask: "Give me your topics for the coming week — one per day is enough. I'll map them to days and pillars."
Map a raw list onto the next available days in pillar order.

### Phase 1.5 — Pre-plan availability check (before any approval)
**Never double-book.** If the `gws` connector is wired, read the week's calendar to see what's already there:
```bash
gws calendar events list --params '{"calendarId":"primary","timeMin":"<weekStart>T00:00:00","timeMax":"<weekEnd>T23:59:59","q":"[CONTENT]","singleEvents":true,"orderBy":"startTime"}'
```
Classify each target day **FREE** (nothing there) or **TAKEN** (a `[CONTENT]` event exists). If `gws` isn't
wired, skip the read and just ask the user what's already booked. Show the full week map (every day, FREE
included) before approval. For any TAKEN day, ask: skip it · push the topic to another day · or replace
(you delete the old event yourself first).

### Phase 2 — Present the plan for approval (per-day cards)
**Never touch Calendar or write any doc before approval.** One card per day:
```
CONTENT PLAN — week of [date] · [N] days · all Pending

─ TUE [date] · Mindset ─────────────
 Topic   [topic]
 Hook    "[hook line]"
 Type    Video (script) · or Post (carousel)
 Plats   TikTok · IG · FB · LinkedIn
 Why     [1-line reason it lands]
────────────────────────────────────
One topic per day. All Pending until you confirm.
Approve all? Reply "yes", or "change <day>".
```
Build every hook from a real angle, pressure-tested UGC-style. No fabrication.

### Phase 3 — After "yes": write a per-day script doc
Each day gets one doc at `output/content-plan/{YYYY-MM-DD}-{slug}.md` (or a Google Doc if `gws` is wired).
Per platform inside it: **Mission · Hook (title/visual/verbal) · Story (Problem → Promise → Credibility →
Delivery → CTA) · Footage needed · Caption.** Post days get a carousel outline + FB + LinkedIn copy instead
of a verbal script. Show the user the docs.

### Phase 4 — Review, then confirm before Calendar
Show a review table (day · topic + hook · type · doc link). **Do not create calendar events until the user
replies "confirm".** (Content-calendar changes are an approval gate — `framework/operating-principles.md`.)

### Phase 5 — After "confirm": push to Google Calendar (optional, gws required)
Only if the user confirmed AND `gws` is wired:
```bash
gws calendar +insert \
  --summary "[CONTENT] [Topic]" \
  --start "[YYYY-MM-DD]T09:00:00" \
  --end "[YYYY-MM-DD]T09:30:00" \
  --description "PILLAR: [Pillar]
TYPE: [Video|Post]
SCRIPT: [doc link]"
```
Title prefix `[CONTENT]` makes the events filterable. If `gws` isn't wired, skip this — the plan + docs are
still a complete outcome; tell the user to add events manually.

### Phase 6 — Summary
Report: days planned · docs written (+ paths/links) · calendar events created (or "skipped — no connector").
Suggest next steps: `/video-script` for the filming script, `/caption` for the post copy, `/carousel` for slides.

## Rules
1. Never create calendar events without explicit "confirm".
2. One topic per day — if the user gives different topics per platform for one day, flag it and make them pick one.
3. One doc per day, all platform scripts inside.
4. Apply the user's voice; no em dashes, no fabrication.
5. Pushing to Calendar needs the `gws` connector (`connectors/README.md`); without it, plan + docs only.

## Output Standard
Format: per-day script docs under `output/content-plan/` + optional Google Calendar events. Variant: your
`design-system/` voice. Calendar push is approval-gated and connector-dependent.
