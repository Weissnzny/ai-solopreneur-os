---
name: video-script
description: Generate a 40-second vertical short-form video script in "Founder Notes" format — silent B-roll + text overlay, one clear hook, one CTA. Trigger on "/video-script", "video script", "shoot script", "脚本", or any short-form video script request. One topic = one full script. Optional bilingual output (main language + small subtitle line).
---

# /video-script — 战 The Campaign (Founder Notes Generator)

Produces a **40-second vertical video script** in the Founder Notes format: you film silent B-roll of
your real life/work, and the story is carried by text overlay. Calm, honest, no talking-head
required. Part of the **战 (Campaign)** loop.

## Required input
- **Topic.**
- **Pillar** — Educational / Storytelling / Mindset / Entertainment / Promotional (infer if missing).
- **Format angle** (Educational only) — How-to · Step-by-step · Tips · Mistakes to Avoid · Explainer · FAQ. Propose the best fit if not given.
- **Bilingual?** — default off (single language). If on, main language large + a small subtitle line.

## Read first
- Your voice register — short sentences, warmth + a real admission, family lens, one CTA only, no em
  dashes, no hustle clichés (`framework/operating-principles.md`, or your own `voice.md`).

## Output structure (always)
1. **Header** — Topic · Pillar · Day · Length (40s).
2. **Time-coded table** — rows `0–2s / 2–6s / 6–15s / 15–30s / 30–40s`. Columns: `Beat · Shot · Overlay text (main) · Subtitle (small, if bilingual)`.
3. **Captions** — one per platform you post to (e.g. TikTok / IG / FB / LinkedIn).
4. **B-roll checklist** — a `☐` list of the real clips to shoot.

## The 40-second shape
- **0–2s Hook** — name the secret fear, drop a scene, or state an uncomfortable truth. Built from a
  real angle, never a fake slogan. Pressure-test: "does this sound like talking, or like copywriting?"
- **2–6s Turn** — the contradiction or the "here's what I noticed".
- **6–15s Body** — the one idea, shown not told.
- **15–30s Proof / Story** — a real moment (no fabrication — `framework/operating-principles.md`).
- **30–40s Step** — one CTA. Not "follow for more". One concrete next move.

## Voice rules
- Short sentences. Warmth + vulnerability + a real lens.
- One CTA only.
- Avoid the lazy hook: ✗ "Here are 5 AI tools" → ✓ "You're not short on time. You're short on a system."
- No em dashes. No fabricated stories or numbers.

## Save flow
1. Render the script as a clean local file: `output/video-scripts/{YYYY-MM-DD}-{slug}.md`
   (or HTML if you want a filming-friendly doc with a jump-to-shot outline).
2. Confirm the path in chat.
3. **Suggest next step:** `/storyboard` (if you ship one) for any shot that isn't trivial to film;
   `/caption` to write the post copy; `/capcut-scaffold` (optional add-on) to set up the edit.

> No external sync in the public OS — the script is a local working file. If you wire a content
> calendar or Drive later, add the sync as your own step; keep the no-fabrication + approval gates.

## Output Standard
Format: local markdown (or HTML) script. No paid API, no publish, no external sync. Save under
`output/video-scripts/`.
