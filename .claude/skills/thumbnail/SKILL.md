---
name: thumbnail
description: Engineer a golden-rule thumbnail design brief plus GPT-Image-style prompts across canonical surfaces (YouTube 16:9 + Carousel 4:5 + Short-form 9:16 + LinkedIn 4:5 + Facebook 1:1 + community 16:9) + N A/B variants. ALWAYS asks before producing anything. Brief + prompts only — never renders, never a paid API call (rendering is a separate, gated step). Trigger on "thumbnail", "/thumbnail", "make a thumbnail", "thumbnail brief", "thumbnail prompt", "cover image for this video/post".
---

# /thumbnail — 战 The Campaign (golden thumbnail brief + prompts)

Produces a **design brief + copy-paste image prompts** for one piece of content, grounded in golden
thumbnail rules. It **never renders and never spends** — rendering is a separate manual step you trigger
later with your image engine (and approve the spend). The deliverable is the thinking + the prompts.

**70/30 rule:** 70% of thumbnail quality is the design decision, 30% is the render. This skill owns the 70%.

## STEP 1 — Interactive gate (never skip, never auto-produce)
Produce nothing until you have:
1. **Topic / title / hook** — the topic, working title, one-line angle.
2. **Emotion + face** — target emotion (thoughtful tension · curiosity · realization · mild concern · aha · fatigue · calm confidence) and whether a real face is in it. Face is ON by default (people follow people). If ON, use a **reference photo the user provides** (image-to-image at render) and name it.
3. **A/B count + references** — how many YouTube A/B variants (default 2), and any competitor thumbnails to beat.
4. **Effects** — `neon` · `glow` · `shadow` · `outline` · `backdrop` · `none/clean`. Default = clean + neon on the title's key word only.
5. **Surface set** — `YouTube only` · `community only` · `cross-platform set` · `community + YouTube` (default) · `all canonical surfaces`.

## STEP 2 — Design the thumbnail system
Decide and write down (this becomes the brief):
- **One core story** — the single thing it says. Force a choice if there's more than one.
- **Primary keyword** — pick ONE emotional spine: SIMPLIFY / TRANSFORMATION / FUTURE / HUMAN / OPPORTUNITY. A second may support; never more than two. Justify against the audience.
- **Hook text** — 3-5 words, one word larger, in your voice. 1 primary + 2 alternates.
- **3-zone composition** — Face (left, 35-50%) → Object/AI element (center/right) → Text (zone 3). Eye path FACE → OBJECT → TEXT.
- **Color** — from `design-system/tokens.css`: one dominant brand color + one accent (`--brand` + `--brand-accent`), near-black ground, warm light only on the face. ≤2 dominant colors.
- **Font** — your brand font for body; a heavier display face for the headline. Name the exact font in every prompt.
- **Three required elements** (every face-bearing prompt must hit all three, or justify text-only fallback):
  1. a candid face with **one dominant emotion** (editorial, not posed stock);
  2. a **neon-glow treatment on the title's key word** (accent color, green-family bloom, restrained);
  3. a **thematic visual element** that articulates the topic (e.g. receipts + calculator for "audit", sticky-note wall for "validation").

## STEP 3 — Write the prompts
Lead with subject + composition, then environment, then light, then mood, then **exact on-image text in
quotes**, then aspect ratio + "photographic, cinematic depth, single clear focal point".

| # | Surface | Aspect | Register |
|---|---|---|---|
| 1 | YouTube | 16:9 | cold-audience clickbait, exaggerated expression, ≤5 words, max contrast |
| 2 | Carousel / post cover | 4:5 | warm + human |
| 3 | Short-form cover | 9:16 | thumb-size, fewer words |
| 4 | LinkedIn | 4:5 | executive — credible, composed, candid-but-not-stressed |
| 5 | Facebook | 1:1 | warm + conversational |
| 6 | Community cover | 16:9 | **peer-warm, member-trusted** — calm half-smile, conversational sub-line, restrained objects, softer bloom |
| 7-8 | YouTube A/B | 16:9 | alternate angle / keyword of #1 |

Produce only the surfaces in the selected set; note which were skipped. Every prompt must literally name
(a) the brand colors as hex (from `tokens.css`), (b) the exact font, (c) each chosen effect in brand terms.
If a face is used, cite the user's reference filename and note it's supplied at render (image-to-image). If
an AI-tool/LLM logo appears, use a **real logo file the user provides** — never redraw a brand mark from memory.

## STEP 4 — Brief artifact
Save a brief + the raw prompts: `output/thumbnails/{YYYY-MM-DD}-{slug}/brief.md` (or a frontend-design HTML
one-pager) + `prompts.md`. The brief shows: core story, primary keyword + why, the 3-zone diagram, color
swatches, font, hook text at size, the 3-required-elements check, and all prompts in copy blocks.

## Critical rules
1. Never produce anything before the Step 1 gate.
2. **No paid API.** Brief + prompts only; rendering is a separate, approval-gated step.
3. One core story, ≤2 dominant colors, ≤5 words on YouTube.
4. Brand palette + font from `design-system/tokens.css`.
5. Faces and tool logos come from real reference files the user provides — never invented.
6. Output to `output/thumbnails/`, never the repo root.

## Output Standard
Format: brief (markdown or HTML) + `prompts.md` + the prompts in chat. Variant: `design-system/` tokens.
No paid API. The downstream render is separately gated.
