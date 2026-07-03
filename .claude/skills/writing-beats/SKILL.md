---
name: writing-beats
description: Assemble a long-form article as a journey of "beats" — choose-your-own-adventure style. The user provides raw material (a markdown file or pasted notes); the skill offers 2-3 candidate starting beats, the user picks one, it writes ONLY that beat to the article file, then offers 2-3 next-beat pivots, looping until a natural end. Pure local text — no engine, no render, no paid API. Grounded in the user's raw material (no fabrication). Trigger on "/writing-beats", "writing beats", "beat by beat article", "choose your own adventure article", "assemble this as a narrative", "turn my notes into an article", "shape this as a journey not an argument".
---

# /writing-beats — 道 (The Way)

Part of the **道 (The Way)** loop: telling the true story, one honest move at a time. Shape an
article as a **journey of beats**, not an argument. The user picks a starting beat from their raw
material; you write only that beat, then offer where to pivot next — beat by beat — until the
article reaches a natural end.

## Hard rules
- **Pure local text.** No engine, no render, no paid API. Nothing to approve — it just writes a markdown file.
- **Grounded — no fabrication.** Pull every beat from the user's raw material. Paraphrase, split,
  recombine, or quote — but never invent facts, stories, numbers, or quotes that aren't in the pile.
  The pile is a quarry. If the journey needs something the pile doesn't have, ask the user, don't
  invent. (See `framework/operating-principles.md`.)
- **Voice.** Short sentences, scene-first, no em dashes, no hustle words. Match a provided sample if there is one.
- **Re-read before every write. Preserve user edits absolutely.** Read the article file from disk
  before each new beat; never overwrite or "tidy" what the user changed.
- **Append one beat at a time. Never write ahead.**

## Inputs
- **Raw material** — a markdown file path or pasted notes. If none yet, ask for it.
- **Save path** — where the article file lives. If unspecified, ask once and remember it for the
  session. Default: `output/writing/<slug>.md`.

## The beat-by-beat journey
1. **Offer 2-3 candidate STARTING beats** drawn from the raw material — each a different entry point.
   Show them *before* writing anything. For each, preview a little way down the path. The user picks one.
2. **Write ONLY that beat** to the article file. A beat may be one sentence or several paragraphs —
   whatever the move naturally is. Stop there.
3. **Re-read the article file from disk.** Then offer **2-3 candidate NEXT beats** — different
   directions the journey could pivot to from where the article now stands.
4. **Loop 2-3** until the article reaches a natural end.

## What is a beat
One move in the journey — it does one thing (sets a scene, lands a point, asks a question, drops an
aside, twists the angle), then stops, leaving the reader where the next beat can pivot. Sized by what
it needs:
- **A single sentence** if that's the whole move ("And then nothing happened for three weeks.").
- **A short paragraph** if the move needs setup.
- **Multiple paragraphs** if the beat is a self-contained vignette, argument, or example.

If a "beat" needs five paragraphs and three subheadings, it's not a beat — it's two beats glued
together. Split it.

## Ending the journey
The article ends when the **journey is complete**, not when the pile is empty. Most piles leave
leftover fragments — that's fine, that's the point of having more raw material than you need.

## Writing rhythm
- Append one beat at a time. Never write ahead.
- Re-read the article file from disk before every write. Preserve user edits absolutely.
- If the user edits a previous beat substantially, let it change what comes next.
- If the user says "rewrite that beat" or "go back and try a different beat 3", do it — edit in
  place, leave the rest alone.

## Output Standard
Pure-text long-form writing skill. Deliverable = the article markdown at the chosen path. No paid
call. Save to `output/writing/` unless the user gives a path.
