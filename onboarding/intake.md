# Onboarding intake — make this OS yours (≈4 minutes)

Fill in the blanks below, then save. The OS reads this file to learn **what your work actually is** and
**who you are**, so it pushes the right thing forward every morning and speaks in your voice. Nothing
here is sent anywhere — it's a local file in your OS folder.

> Tip: you can also just open the OS folder in Claude Code and say **"onboard me"** — it'll ask these
> questions and fill this file for you.

---

## Your work

- **Name / brand:** {{ONBOARD: your name or brand}}
- **What you do in one line:** {{ONBOARD: e.g. "I help SME owners run their business on AI without burning out"}}
- **What your day actually looks like:** {{ONBOARD: the real work — e.g. "quoting jobs and chasing suppliers", "teaching 3 classes then editing clips", "coding, then support tickets"}}
- **The after-state you sell** (the relief on the other side — see `wiki/concepts/example-concept.md`): {{ONBOARD: what changes for someone who works with you}}

## Where you're heading

- **What would make the next 90 days a win:** {{ONBOARD: one concrete outcome — e.g. "3 retainer clients", "the shop runs a week without me", "500 people on the list"}}
- **Why it matters to you:** {{ONBOARD: the real reason, not the LinkedIn reason}}

## What's grinding you down

- **The thing you keep redoing** (阵 Formation's own question — what should a system have held?): {{ONBOARD: e.g. "I rebuild every quote from scratch", "I lose what clients told me last month"}}
- **What it costs you:** {{ONBOARD: hours per week, or what it makes you drop}}

## What you need it to carry

- **The one thing you push forward daily** — pick ONE, this decides what `/start-day` guards:
  {{ONBOARD: content | clients | product | delivery — see the note below}}

  | If you pick | Your daily win is | `/start-day` will guard |
  |---|---|---|
  | **content** | something publishable exists | a caption, carousel, or script — ready to post |
  | **clients** | one real conversation moved | an outreach or follow-up, drafted for you to send |
  | **product** | the thing is visibly further along | one increment someone could look at |
  | **delivery** | a client can see progress | one thing that lands in their hands |

- **What you'd hand over first if you could:** {{ONBOARD: the task you'd give away tomorrow}}

## Your audience

- **Who you serve:** {{ONBOARD: be specific — role, stage, market, language}}
- **Their 2am moment** (the pain they feel): {{ONBOARD: the concrete worry that keeps them up}}

## Your voice

- **Sounds like:** {{ONBOARD: short + warm? sharp + funny? calm + plain? give 2-3 words}}
- **Never sounds like:** {{ONBOARD: words/registers to avoid — e.g. "guru", "hustle", corporate-speak}}
- *(Important)* paste 2-3 things you've **actually written** into `voice.md` so `/humanize`, `/caption`
  and `/writing-beats` can match you. Paste them raw — don't type fresh prose. This matters even if you
  never post publicly; it's how your emails and proposals stop sounding like a robot.

## Your platforms & languages

*If you don't publish anywhere, write "none" and skip to Your rhythm. The OS won't nag you for content
you never agreed to make.*

- **Where you post:** {{ONBOARD: e.g. TikTok, Instagram, LinkedIn, Xiaohongshu — or "none"}}
- **Language per platform:** {{ONBOARD: e.g. English everywhere, Simplified Chinese on XHS}}

## Your rhythm

- **Working days:** {{ONBOARD: e.g. Tuesday to Saturday}}
- **A hard constraint to protect** (the 道 / Way — e.g. school pickup at 4:30, no work after dinner): {{ONBOARD: the line you won't cross}}

## Your brand color (optional)

- **Primary hex:** {{ONBOARD: e.g. #236345 — change `--brand` in design-system/tokens.css to match}}

---

When this is filled, run **`/start-day`** (令 The Morning Command) and push your one thing forward.
