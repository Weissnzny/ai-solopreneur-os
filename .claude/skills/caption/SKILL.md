---
name: caption
description: Generate the platform post-captions for one piece of content as a primary deliverable (TikTok / Instagram / Facebook / LinkedIn, plus optional Xiaohongshu). Grounds the captions in the actual filmed/designed piece when you point it at one. Picks the hook from 6 canonical brand patterns, writes to each platform's contract, runs every caption through the /humanize anti-AI pass, and never fabricates. Never publishes to any platform, no paid API. Trigger on "/caption", "caption", "write a caption", "post copy", "captions for this", "TikTok caption", "IG caption", "LinkedIn caption".
---

# /caption — 战 The Campaign (multi-platform caption engine)

Treats post captions as the **primary deliverable**, not a side product. One run produces caption copy
for your platforms — TikTok, Instagram, Facebook, LinkedIn (Xiaohongshu opt-in) — grounded in your
voice, one of 6 brand hook patterns, and the actual piece you're posting.

## What this skill is NOT
- **NOT** a publisher. It never posts. Output is copy only — you publish manually.
- **NOT** a content generator for a topic that doesn't exist. Captions are derivative; they need a real piece or a clearly-defined standalone topic + hook.
- **NOT** a hashtag farm. Pillar-locked base + 3-5 topic-tuned tags per platform, never a wall of 30.

## Read first
- Your voice register — short sentences, scene first, no em dashes, no hustle clichés (`framework/operating-principles.md`, or your own `voice.md`).
- `framework/operating-principles.md` — **never fabricate.** Every client story / result / number must trace to something real. An upstream script is not proof a story is real — if it carries an unverified claim, don't amplify it; flag it and interview the human.

## STEP 0 — Intake gate (never skip)
Produce nothing until you know: (1) **Mode** — `piece` (caption an existing filmed/designed piece you point me at) or `standalone` (a fresh topic); (2) **Topic / angle / hook** (or "you pick"); (3) **Platforms** (default TikTok + IG + FB + LinkedIn; XHS opt-in); (4) **Audience** (who this is for — never assume); (5) **CTA** — `link-in-bio` / `follow-save` / `comment-keyword` (name the keyword) / `custom`.

## STEP 1 — Authenticity check (mandatory)
Before writing, check every factual claim (a client story, a result, a number, a quote). Each must
trace to a real source. If a claim isn't verified, **STOP and interview** for the real material, or
reframe honestly (a pattern with no invented specifics, a first-person experience, a labelled
hypothetical). Interview first, draft second.

## STEP 2 — Decide the caption system (review before writing)
Write the per-piece skeleton and show it as a compact table; wait for approval:
- **One core message** — the single thing the piece says.
- **Hook pattern** — pick ONE of the 6 brand hooks (below); justify against audience + format.
- **Hook line** — the actual opener, in your voice. 1 primary + 2 alternates.
- **Body shape per platform** (the contract below).
- **CTA** — from Step 0.
- **Hashtag base** — the pillar-locked core + 3-5 topic tags per platform.

### The 6 canonical brand hook patterns
1. **Secret Fear Named** — say out loud the quiet fear they won't admit.
2. **Scene Drop** — open inside a concrete moment, no preamble.
3. **Uncomfortable Contradiction** — two true things that shouldn't both be true.
4. **Proof Opener** — lead with the real result/number, then the story.
5. **Inversion** — flip the common advice on its head.
6. **Permission Statement** — give them permission to stop doing the thing.

If none fit, say so and propose the closest — never freelance a fake-sounding slogan.

## STEP 3 — Write the captions (per platform, after approval)
Apply the platform contract:

| Platform | Tone | Structure | Hashtags |
|---|---|---|---|
| **TikTok** | Casual + energetic, friend-to-friend | Hook + 2-3 short paragraphs + CTA + hashtag line | 3-5 |
| **Instagram** | Warm + aspirational, save-trigger | 2-3 lines above the fold + body + hashtags last | up to 5 |
| **Facebook** | Less hype, more heart | 3-5 short paragraphs, ends on a question | ≤2 |
| **LinkedIn** | Casual-corporate, insight-led | Hook → context (1-sentence lines) → insight → CTA | 0-2 |
| **XHS** (opt-in) | Peer-to-peer, lifestyle, non-promotional | 3-4 short paragraphs, soft CTA | inline `#` tags |

**Language:** default each platform to your audience's language. If you serve a bilingual market,
set a per-platform language policy (e.g. EN on TikTok/IG/FB/LinkedIn, Simplified Chinese on XHS) and
keep hashtags in the caption's language. Bilingual stacking belongs in video overlays, not feed captions.

**Rules for every platform:** short sentences, scene first, no em dashes, no corporate-speak, no
hustle words. The hook may differ per platform but the underlying pattern stays the same. Never lead
with hashtags. Anchor the audience in one concrete example, never abstract "small business owners".
Show a character count under each caption.

## STEP 3.5 — Humanize pass (mandatory)
Run each caption body through the `/humanize` 29-pattern scan + audit pass (see
[`../humanize/SKILL.md`](../humanize/SKILL.md) — canonical, don't duplicate the catalogue). The CTA
template, hashtag line, and any @handle/link are exempt (structural). Absolutes after the pass: zero
em dashes, zero curly quotes, zero decorative emojis in the prose. Record a one-line audit
(`Humanize: patterns N,M removed`) — don't dump the full 4-block output unless asked.

## STEP 4 — Render + save
Write the captions to `output/captions/{YYYY-MM-DD}-{slug}.md` in clean per-platform sections (one
`##` heading per platform, with the character count under each). That file is the deliverable — copy
ready to paste.

## STEP 5 — Final summary (chat)
Report: hook pattern used, platforms produced, character counts, the artifact path. End with: *"These
are copy ready to paste. Publishing to any platform is manual — never done by this skill."*

## Critical rules
1. Never produce anything before the Step 0 gate.
2. No paid API. Text only. No platform publish.
3. Hook patterns come from the canonical 6 — surface "no pattern fits" rather than freelance one.
4. Pillar base + topic tags only; respect platform caps.
5. Never fabricate (Step 1) — interview, don't invent.
6. Humanize pass is mandatory (Step 3.5).
7. Output to `output/captions/`, never the repo root.

> If you later wire a content calendar, Drive, or a scheduler, add those as your own sync steps —
> and keep the no-fabrication + per-post approval gates. The public OS ships caption *creation*; the
> publishing rail is yours to add.
