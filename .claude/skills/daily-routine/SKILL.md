---
name: daily-routine
description: >
  Your daily operating routine — the morning kickoff and evening shutdown that
  sequence the whole day. Two modes. `start` (via /start-day, "good morning",
  "start my day", "kick off my day"): orient → scan today → push your one thing
  forward (content, clients, product, or delivery — whichever you chose at
  kick-off) → check the community → client/sales follow-ups. `shutdown` (via
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
doesn't know what their work is. Instead, run `/kick-off` via the Skill tool: it asks the interview
(what their work actually is, where they're heading, what keeps grinding them down, **the one thing
they push forward daily**, their voice + a real writing sample, platforms, working days, the hard
constraint they protect), fills the intake, and captures `voice.md`. Once the intake is filled, continue
to Step 1. On every later run the intake is already filled, so skip straight to Step 1.

Read the intake at the top of every run, not just the first — Step 3 branches on the **daily push**
recorded there, and the user can change it any time by editing the file.

### Step 1 — Orient
Pull whatever daily inputs you keep: a morning briefing file if you generate one, and your calendar
(read it via a calendar connector if one is wired — a Google Calendar MCP, or the author's `gws` CLI
with `gws calendar +agenda --today`; see `connectors/`).
Hand over **the 3 things that actually matter today**, not a full recap.

### Step 2 — Scan today
Read-only. Reconcile your sources into one picture: what's planned to ship today, what's still open
from earlier, what touchpoints (calls, meetings) are on the calendar. If you keep a content board or
calendar, read it here (header-resolved if it's a sheet — never hardcode columns).

### Step 3 — Push the one thing forward (the 战 Campaign guarantee)

The doctrine says ship *"content, a product, a post, a small win"* into the arena — **four kinds of
visible work, not one.** Read **the one thing you push forward daily** from `onboarding/intake.md` and
guard *that*. Never assume content; that's one business model out of four.

**Do not close this step on a working day until that one thing has genuinely moved.** Ending a working
morning with nothing is the exact failure this step prevents.

| Their daily push | The morning is done when | Invoke |
|---|---|---|
| **content** | something publishable exists | `caption` (fast) · `carousel` (same-day) · `video-script` (prep to film) · `content` router for a planned piece |
| **clients** | one real conversation has moved | draft the outreach or follow-up. Use `copywriting` for a page, `humanize` on anything that reads stiff. **Drafted, not sent.** |
| **product** | the thing is visibly further along | name the one increment someone could look at today, then help build it. Small and real beats a plan. |
| **delivery** | a client can see progress | prepare the one thing that lands in their hands — a summary, a milestone, a working piece. **Prepared, not sent.** |

Whatever the lane: **a fast, finished small thing beats an unfinished big one.** If time is short,
steer smaller, never to nothing.

If the day genuinely can't carry one, **say so and log it as a missed slot** — never pretend a slot was
filled. Let every invoked skill run its own gates.

**Prepared, never sent or published.** Whatever the lane, this skill readies the work and you release
it — a post, an email, a client update, a deploy. Same gate for all four.

When the work involves words that reach another human, pressure-test them the same way regardless of
lane: "does this sound like a real person talking, or like copywriting?" Never freelance a
fake-sounding slogan. Read `voice.md` before drafting.

> **Fresh install with an unfilled daily push?** Don't guess and don't default to content. Ask once —
> "what's the one thing that has to move today?" — guard that for the session, and offer to run
> `/kick-off` so the answer sticks.

### Step 4 — Community check-in *(skip if you don't run one)*
If you run a community, surface what moved and what's next, and offer to draft the next piece (the
weekly flagship, an engagement prompt). **Never auto-post to the community** — same gate as any
publish. Prepare; you publish.

No community? Say so once and move on. Don't invent one to fill the step.

### Step 5 — Client & sales follow-ups
Read your pipeline (calendar + whatever board you keep). Surface who sits at each stage, what's done,
what's waiting on you. If there's a new client meeting today, offer the post-meeting capture flow.

Close the morning with a one-paragraph recap of what's set for the day.

## Mode: shutdown  (/shutdown)
A short end-of-day wrap. Do not re-run the morning scan.
1. **Review the day** — what shipped, what slipped against the morning plan. Say plainly whether the
   one thing moved. A week of misses is a signal worth naming out loud, not a scolding.
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
