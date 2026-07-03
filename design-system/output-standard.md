# Output Standard

The rule every skill follows for what it produces and where it saves.

## 1. Every skill produces a real artifact
Not just chat text. A skill that renders a visual produces a branded file; a skill that writes text
produces a clean markdown (or Doc) file. Each skill declares its format + save path in its own
`## Output Standard` section.

## 2. Save under `output/`, never the repo root
- Visuals (carousels, maps) → `output/<skill>/…`
- Text (captions, scripts, articles) → `output/<skill>/…`
- The repo root stays clean.

## 3. Brand comes from `design-system/tokens.css`
Anything visual reads the tokens — colors, type, radius — so the whole OS looks like one brand. To
rebrand, change the three `--brand*` values in `tokens.css`; don't hardcode colors in a skill.

## 4. Bilingual, if you serve a bilingual market
Stack languages **vertically** (primary on top, the other below) — never side by side. Latin in
`--font-sans`, Chinese in `--font-cjk`.

## 5. Visual deliverables should be frontend-design grade
A polished, presented deliverable (a deck, a one-pager, a lead magnet) should be real visual design —
cards, icons, structure — not a text dump. If you keep a `frontend-design` skill, invoke it for
net-new visual templates.

## 6. Client work uses the client's brand, not yours
If you ever build for a client, load their brand tokens and save under a client folder — never
silently fall back to your own brand. If their kit is missing, halt and ask.

## 7. The guardrails always apply
No fabrication, plain language, and the approval gates (paid API, publish, send, calendar, delete)
bind every artifact. See `framework/operating-principles.md`.
