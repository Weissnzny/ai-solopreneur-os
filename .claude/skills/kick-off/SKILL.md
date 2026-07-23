---
name: kick-off
description: First-run onboarding for a new user of the AI Solopreneur OS. Use on Day 1, when someone says "onboard me", "set me up", "kick off", "let's get started", or has just installed the OS. Conducts a short interview, fills onboarding/intake.md, and captures a real voice sample — so every skill speaks in the user's voice to their audience. Idempotent — re-run any time after editing the intake.
---

# /kick-off — first-run onboarding (令 The Morning Command, day one)

The door into the OS. Runs a short interview, writes the answers into `onboarding/intake.md`, and
captures a real writing sample so the OS sounds like the user — not like generic AI. Re-runnable any
time.

## Output Standard
The output **is** the scaffold: a filled `onboarding/intake.md` + a `voice.md` at the OS root. No
separate branded artifact. No `.env` writes — connectors come later (`connectors/README.md`).

## When NOT to add steps
The interview is capped. Don't invent extra questions; the OS grows by the user editing the intake and
re-running, or adding skills via `/find-skill`.

## Execution

### Step 1 — Read the intake
Read `onboarding/intake.md`. Check which fields still hold unfilled `ONBOARD` placeholders.
- **All filled** → skip to Step 3 (confirm + wow).
- **Some filled** → say which are answered; ask whether to fill the rest now.
- **None filled (fresh install)** → run Step 2 conversationally.

### Step 2 — The interview (ask one at a time; write each answer into the intake as you go)

**Part A — the work (ask these first; they decide what the OS guards every morning).**
Press for a concrete answer here. "Marketing" is not an answer; "I rebuild every quote from scratch"
is. If they give you an abstraction, ask "what did that look like last Tuesday?"

1. **The work** — name/brand, what you do in one line, and **what your day actually looks like**
   (the real work, not the positioning). Then the **after-state** you sell.
2. **Where you're heading** — what would make the next 90 days a win (one concrete outcome), and why
   it matters to them. Not the LinkedIn reason.
3. **What's grinding you down** — the thing they keep redoing that a system should have held, and what
   it costs (hours, or what it makes them drop). This is 阵 Formation's own question, asked on day one.
4. **What it should carry** — *"What's the one thing you push forward every day?"* Resolve to exactly
   one of **content · clients · product · delivery**, and say plainly what it decides:
   > "This sets what `/start-day` won't let you close the morning without. Pick the one that, if it
   > moved every day, would change your year. You can change it later by editing the intake."

   If they hesitate, ask what they'd be most upset to look back on after a month of nothing. Do not
   default to `content` — that's the author's business, not necessarily theirs.
   Then: **what they'd hand over first if they could.**

**Part B — the voice and the shape.**

5. **Voice sample (hard rule)** — *paste* 1-2 things they've actually written recently (an email, a
   post). **Don't type fresh prose.** If they type a sample mid-conversation, refuse:
   > "Stop — paste it raw. If you type it here while we talk, it's already shaped by our conversation.
   > Open your last real email or post and paste the unedited text. This is the one rule I can't bend."

   This applies even if they never publish. It's how their emails and proposals stop sounding generic.
6. **Audience** — who they serve (role, stage, market, language) and their **2am moment**.
7. **Voice in words** — what they sound like (2-3 words) and what they never sound like.
8. **Platforms & languages** — where they post, and the language per platform. **If their daily push
   isn't `content`, offer the exit:** "Do you publish anywhere? If not, say none and we skip this."
   Record `none` and move on. Never talk someone into a content habit they didn't ask for.
9. **Rhythm** — working days, and the **hard constraint they protect** (the 道 / Way — school pickup,
   no work after dinner).
10. **Brand color** (optional) — a primary hex.

### Step 3 — Write the files
1. Fill every field in `onboarding/intake.md` from the answers (replace the unfilled `ONBOARD` tokens).
2. Write `voice.md` at the OS root: paste the samples verbatim under a short header — *"Match this
   register when drafting. Don't fake this voice on external content without showing me first."*
   `/humanize`, `/caption`, `/content`, and `/writing-beats` all read this.
3. If a brand hex was given, remind the user to set `--brand` in `design-system/tokens.css`.
Back up any existing intake/voice to `output/kick-off-backup-{date}/` before overwriting.

### Step 4 — The closing screen
Read their **daily push** back to them, in their own words, so it lands as a commitment rather than a
setting. Fill the middle line from what they answered:

```
✓ Kick-off done. The OS knows your work, where you're heading, what's grinding you down,
  how you sound, and the line you won't cross.

Every morning: /start-day won't let you close it until <their daily push> moves.
This week:     read framework/ai-solopreneur-os.md — the four loops you'll run.
Anytime:       /system-check to score your OS and see what to wire next.
```

Then name the one thing they said grinds them down, and say it out loud:
> "You said <the grind>. That's a 阵 Formation problem, and it's what we wire next — not more content."

## Critical rules
1. The interview is capped — don't add questions in conversation.
2. **Never default the daily push to `content`.** It must be chosen out loud. Content is the author's
   business model, not a universal one; assuming it is the fastest way to lose a member in week two.
3. **Voice paste cannot be skipped or typed** — refuse and ask for a real paste.
4. Write the files in one batch after the interview; the user iterates by editing the intake and re-running.
5. Idempotent — re-running with an edited intake refreshes the files and backs up the originals.
6. No `.env` writes, no paid calls, no publishing.
