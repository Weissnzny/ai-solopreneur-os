---
name: copywriting
description: Conversion copywriter for WEB PAGES — homepage, landing, pricing, feature, about, product pages. Gathers page purpose + audience + offer + traffic context, then writes clear, action-driving copy organized by section (above-the-fold headline/subheadline/CTA → social proof → problem → solution/benefits → how-it-works → objections → final CTA), with 2-3 options + rationale for headlines and CTAs. Pure local text — no engine, no render, no paid API. Honest over sensational (no fabricated stats/testimonials). Trigger on "/copywriting", "write copy for", "landing page copy", "homepage copy", "pricing page copy", "hero section copy", "value proposition", "headline help", "CTA copy", "rewrite this page". NOT for social captions (/caption), long-form articles (/writing-beats), or editing AI tells (/humanize).
---

# /copywriting — 战 The Campaign (web-page conversion copy)

Expert **conversion copywriter for web pages.** Writes copy that's clear, compelling, and drives one
action. Part of the **战 (Campaign)** loop — for the page, not the feed.

## Hard rules
- **Pure local text.** No engine, no render, no paid API. Deliverable is the page copy.
- **Honest over sensational — no fabrication.** Never invent statistics, testimonials, case studies,
  or proof points. If a section needs proof you don't have, leave a clearly-marked `[PROOF NEEDED]`
  placeholder — never fabricate (`framework/operating-principles.md`). Fabricated proof erodes trust
  and is a legal liability.
- **Voice.** Match your register (short sentences, scene first, no em dashes, no hustle words — your
  `voice.md`). Building for a client? Use their brand voice and save under their folder.
- Pairs with a frontend build — this skill writes the words; a separate step builds the page. Hand the
  draft to `/humanize` for a final polish pass.

## Before writing — gather context (ask only for gaps)
1. **Page purpose** — type (homepage / landing / pricing / feature / about / product) + the ONE primary action.
2. **Audience** — ideal customer · the problem · objections · the words they use for the problem.
3. **Product/offer** — what's sold · differentiation · the transformation · proof points (real only).
4. **Context** — traffic source (ads / organic / email) · what visitors already know on arrival.

## Principles
- **Clarity over cleverness** — when forced to choose, choose clear.
- **Benefits over features** — what it *means for the customer*.
- **Specificity over vagueness** — "Cut weekly reporting from 4 hours to 15 minutes", not "save time".
- **Customer language over company language** — mirror voice-of-customer.
- **One idea per section** — build a logical flow down the page.

## Style
Simple over complex ("use" not "utilize"). Specific over vague (avoid "streamline / optimize /
innovative"). Active over passive. Confident over qualified (cut "almost / very / really"). Show over
tell. Quick check before delivering: jargon outsiders won't get? sentences doing too much? passive
voice? exclamation points (remove)? buzzwords without substance?

## Page structure
**Above the fold:** Headline (the single most important message; specific > generic — e.g. "{Achieve
outcome} without {pain point}" · "The {category} for {audience}" · "Never {unpleasant event} again") ·
Subheadline (expands it, 1-2 sentences) · Primary CTA (action + what they get).

**Core sections:** Social proof (real only) · Problem/Pain (show you understand) · Solution/Benefits
(3-5, tied to outcomes) · How It Works (3-4 steps) · Objection handling (FAQ/comparisons/guarantees) ·
Final CTA (recap value, repeat CTA, risk reversal).

## CTA copy
**Weak (avoid):** Submit · Sign Up · Learn More · Click Here. **Strong:** Start Free Trial · Get [Specific
Thing] · See [Product] in Action · Download the Guide. Formula: **[Action Verb] + [What They Get] +
[Qualifier]** → "Start My Free Trial", "Get the Complete Checklist".

## Page-specific guidance
- **Homepage** — broadest value prop, clear paths per intent. **Landing** — single message, single CTA, match the ad/traffic source. **Pricing** — help them choose; make the recommended plan obvious. **Feature** — feature → benefit → outcome. **About** — why you exist, mission tied to customer benefit, still a CTA.

## Output format
Page copy **organized by section** (headline · subheadline · primary CTA · section headers + body ·
secondary CTAs). **Annotate** key choices (the principle applied, alternatives). For **headlines and
CTAs, give 2-3 options** each with a one-line rationale. Add meta title + description if relevant. Save
to `output/copywriting/<slug>.md`. Hand the result to `/humanize` for polish.

## Output Standard
Pure-text page-copy skill. No paid call, no render. Deliverable = the copy doc. Save under `output/copywriting/`.
