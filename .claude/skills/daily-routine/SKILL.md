---
name: daily-routine
description: >
  Your daily operating routine — the morning kickoff and evening shutdown that
  sequence the whole day. Two modes. `start` (via /start-day, "good morning",
  "start my day", "kick off my day"): orient → scan today → produce one postable
  asset → check the community → client/sales follow-ups. `shutdown` (via
  /shutdown, "end my day", "wrap up my day"): review what shipped, set tomorrow's
  top 3, hand the board update to /brain. This is an ORCHESTRATOR — it invokes
  other skills via the Skill tool and never re-implements their logic.
---

# /daily-routine — 律 The Rhythm · 令 The Morning Command

Two pillars in one routine. **令 (Morning Command)** issues the day's orders; **律 (Rhythm)** is the
cadence you keep. Run `/start-day` when you sit down and `/shutdown` at the end. The skill walks a
fixed sequence, doing the work at each step and pausing only where your decision is required.

It is an **orchestrator** — it owns the sequence and hands the real work to the skill that owns it:
content production → the content skills (`content`, `video-script`, `carousel`, `caption`); board
planning → `brain`. Never re-implement those here; invoke them via the Skill tool and let each run
its own gates (`framework/operating-principles.md`).

## Mode: start  (/start-day)

Greet briefly. Then run these steps in order. After each, give a tight summary — what you found,
what it means for today. Keep one step active at a time.

### Step 0 — First-run kick-off (new users only)
Before anything else, check whether the user is onboarded: read `onboarding/intake.md`. If it still
holds unfilled `ONBOARD` placeholders (a fresh install), **don't run the normal routine yet** — the OS
doesn't know who they are. Instead, run `/kick-off` via the Skill tool: it asks the short interview
(who you are, who you serve, your voice + a real writing sample, platforms, posting days, the hard
constraint you protect), fills the intake, and captures `voice.md`. Once the intake is filled, continue
to Step 1. On every later run the intake is already filled, so skip straight to Step 1.

### Step 1 — Orient
Pull whatever daily inputs you keep: a morning briefing file if you generate one, and your calendar
(`gws calendar +agenda --today` if the Google Workspace connector is wired — see `connectors/`).
Hand over **the 3 things that actually matter today**, not a full recap.

### Step 2 — Scan today
Read-only. Reconcile your sources into one picture: what's planned to ship today, what's still open
from earlier, what touchpoints (calls, meetings) are on the calendar. If you keep a content board or
calendar, read it here (header-resolved if it's a sheet — never hardcode columns).

### Step 3 — Produce one postable asset (the 战 Campaign guarantee)
**Do not close this step on a working day until at least one postable asset is genuinely prepared** —
a caption, a carousel, a short-form script, or a filmed-video prep pack. Ending a working morning
with nothing is the exact failure this step prevents.

Pick the format (default to whatever's planned), then invoke the matching skill:

| Format | Speed | Invoke |
|---|---|---|
| Caption (text post) | fast, same-day | `caption` |
| Carousel (slides) | same-day | `carousel` |
| Short-form video (script to film) | prep today, film later | `video-script` |
| A planned piece, end-to-end | per its format | `content` router → the format's skill |

A fast same-day format beats an unfinished video. If time is short, steer to a caption or carousel.
If the day genuinely can't carry one, **say so and log it as a missed slot** — never pretend a slot
was filled. Let the invoked skill run its own gates. **"Post daily content" means prepared and
publish-ready — you publish manually. This skill never publishes to any platform.**

Build every hook from a real angle, pressure-tested UGC-style: "does this sound like a real person
talking, or like copywriting?" Never freelance a fake-sounding slogan.

### Step 4 — Community check-in
If you run a community, surface what moved and what's next, and offer to draft the next piece (the
weekly flagship, an engagement prompt). **Never auto-post to the community** — same gate as any
publish. Prepare; you publish.

### Step 5 — Client & sales follow-ups
Read your pipeline (calendar + whatever board you keep). Surface who sits at each stage, what's done,
what's waiting on you. If there's a new client meeting today, offer the post-meeting capture flow.

Close the morning with a one-paragraph recap of what's set for the day.

## Mode: shutdown  (/shutdown)
A short end-of-day wrap. Do not re-run the morning scan.
1. **Review the day** — what shipped, what slipped against the morning plan.
2. **Set tomorrow's top 3** — three priorities for tomorrow.
3. **Hand off the board** — the actual board update is owned by `brain`. Offer to invoke `brain` in
   evening-shutdown mode to write tomorrow's priorities and close today. Don't write the board here.

## Approval gates (local echo of `framework/operating-principles.md`)
This skill only reads and opens files. But the skills it invokes can touch gated actions — never let
an invoked skill skip its gate: paid AI calls → approve first; calendar changes → show the plan
first; any publish/send → explicit per-action approval.

## Must not
- Re-implement content or `brain` logic — invoke them.
- Publish to any platform. "Post content" = prepare it; you publish.
- Write to your calendar or board from this skill.
- Spawn subagents.

## Output Standard
Format: text walkthrough in chat — this is an operating routine, not a deliverable. Downstream skills
save to their own paths. No files written here.
