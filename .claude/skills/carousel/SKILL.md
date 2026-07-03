---
name: carousel
description: Generate an 8-slide 4:5 portrait carousel (1080×1350, Instagram-optimal; 1:1 square 1080×1080 available) from a video script, topic, or free text. Every slide gets its own hook (drawn from the 6 brand hook patterns). Renders from your design-system tokens (HTML → screenshot to PNG) — zero stock photos, zero required paid API. Optional AI image fills are gated behind an explicit key. Never auto-publishes. Trigger on "/carousel", "carousel", "轮播", "IG carousel", "slide deck for social", "turn this script into a carousel".
---

# /carousel — 战 The Campaign (carousel generator)

Takes a video script, a topic, or free text and outputs a complete **8-slide carousel**: a hook on
every slide, text overlays, brand-rendered PNGs, and platform captions. Part of the **战 (Campaign)** loop.

**Core rule: every slide has a hook** — not just slide 1. Each leverages one of the 6 brand hook
patterns to keep the reader swiping.

**No stock photos, $0 to render.** Slides render from your `design-system/` tokens for 100% brand
consistency. An optional AI image fill exists but is gated behind a paid key (see Phase 4).

## What this skill is NOT
- **NOT** an auto-publisher. No carousel goes to any platform without your manual upload.
- **NOT** a paid-by-default image generator. The brand render costs nothing; the AI image fill is opt-in and gated.

## Interaction discipline — phase-gated (never run end-to-end)
Every phase is a stop-and-propose gate: propose, show it in full, **wait for explicit approval**
before the next phase. **Phase 2 leads with the hooks** — you personally pick every hook from a menu
before you see anything else. Never assume approval from an earlier "yes".

## Phase 0 — Intake (ask first, every run)
One question batch: (1) **Input mode** — A. video script · B. topic only · C. free text; (2) **Promotional?** — selling/launching vs educating; (3) **Audience** — who it's for. If promotional, lock the Problem → Solution → Result skeleton (slide 6 = the product slide, slide 7 CTA carries the product).

## Read first
- Your voice register — short sentences, scene first, no em dashes, no hustle words (`framework/operating-principles.md`).
- The 6 brand hook patterns (below).
- `design-system/` — brand tokens. Don't rebuild; the render reads them.
- *(Optional)* if the brief **names an aesthetic** ("cottagecore", "cyberpunk", "Y2K"), pull real style vocabulary from your aesthetic library if you keep one, and weave **colours → palette · motifs → props · values → mood** into the prompt. Opt-in only; skip for clean B2B; never override a client brand kit. No fabrication — use only fields the record has.

## Format — 4:5 portrait default
Defaults to **4:5 portrait, 1080×1350** (Instagram-optimal). Surface once as a one-line confirm:
*"This carousel renders 4:5 portrait (1080×1350) — ok? (say '1:1' for square instead)"*. Store
`aspectRatio` at the top of `slides.json` (`"4:5"` default · `"1:1"` = 1080×1080).

## The 6 brand hook patterns (use these — don't invent)
| Pattern | Best slide role |
|---|---|
| Secret Fear Named | Cover, slide 1 |
| Scene Drop | Cover or storytelling slide |
| Uncomfortable Contradiction | Reframe slide (slide 2) |
| Proof Opener | Cover or proof slide |
| Inversion | Insight slide |
| Permission Statement | CTA slide |

**Hooks must read UGC-style** — first person, a real moment, a genuine reaction. Never a scripted
tagline or slogan. Pressure-test each: *does this sound like talking, or like copywriting?* Rewrite if
it reads as copywriting.

## Slide structure (8 slides)
| Slide | Role | Locked because |
|---|---|---|
| 1 | **Cover** | The 2-second hook. Heaviest-crafted — it carries the deck. |
| 2-6 | **Body** | Vary by content shape (story / step-by-step / problem→solution→result / framework). Where a pattern has a **Recap** slide, it's the save-bait. |
| 7 | **CTA** | One real action only. Never two CTAs. |
| 8 | **Brand end-card** | The transparent brand logo + a brand slogan line + a thin accent rule. No stats, no platform rows. |

## Phases
- **Phase 1 — Extract + pick pattern.** From the input mode, extract hook / insight / CTA (script), or build the 8-slide shape (topic/free text). Confirm the aspect ratio.
- **Phase 2 — Review gate (hooks first).** 2A: hook menu — pick every slide's hook from 2-3 options each. 2B: full outline. 2C: visual direction per slide. Nothing builds until 2A + 2B sign off, in order.
- **Phase 3 — Write `slides.json` (the spec).** The structured spec — per slide: `role`, `hook`, `body`, optional `icon`, and (if using image fills) an `image_prompt`. **This spec is written and reviewed BEFORE any paid image step.** It's the source of truth the renderer reads.
- **Phase 4 — Render.** Default: render the slides from `design-system/` tokens (HTML → headless screenshot to PNG at 2× scale). **$0, no API.** *Optional AI image fill:* only if `KIE_API_KEY` (or your image engine) is set AND you explicitly approve the spend — feed each slide's `image_prompt` to the engine. Without a key, slides render with brand backgrounds / labelled placeholders and the carousel still ships.
- **Phase 5 — Captions.** Hand off to `/caption` (or write inline) for the platform post copy.

## Output
Save the package to `output/carousels/{YYYY-MM-DD}-{slug}/`: `slides.json`, `carousel.html` (source),
the PNG slides, and `captions.md`. Show the preview and the folder path. **You upload manually** — this
skill never publishes.

## Critical rules
1. Phase-gated — never run end-to-end; hooks are picked first.
2. `slides.json` spec is written and reviewed **before** any paid image call.
3. Default render is $0 (brand tokens → screenshot). AI image fill is opt-in + key-gated + approval-gated.
4. Hooks from the canonical 6, UGC-style, never freelanced slogans.
5. No fabrication — every claim traces to something real (`framework/operating-principles.md`).
6. No auto-publish. Output to `output/carousels/`, never the repo root.

## Output Standard
Format: 8 PNG slides + `slides.json` + `carousel.html` + `captions.md`. Variant: your `design-system/`
tokens (or a client brand kit if building for a client). Save under `output/carousels/`.
