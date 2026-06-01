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
1. **You** — name/brand, what you do in one line, and the **after-state** you sell (the relief on the other side).
2. **Voice sample (hard rule)** — *paste* 1-2 things you've actually written recently (an email, a post). **Don't type fresh prose.** If the user types a sample mid-conversation, refuse:
   > "Stop — paste it raw. If you type it here while we talk, it's already shaped by our conversation. Open your last real email or post and paste the unedited text. This is the one rule I can't bend."
3. **Audience** — who you serve (role, stage, market, language) and their **2am moment** (the pain that keeps them up).
4. **Voice in words** — what you sound like (2-3 words) and what you never sound like (words/registers to avoid).
5. **Platforms & languages** — where you post, and the language per platform.
6. **Rhythm** — posting days, and the **hard constraint you protect** (the 道 / Way — e.g. school pickup, no work after dinner).
7. **Brand color** (optional) — a primary hex.

### Step 3 — Write the files
1. Fill every field in `onboarding/intake.md` from the answers (replace the unfilled `ONBOARD` tokens).
2. Write `voice.md` at the OS root: paste the samples verbatim under a short header — *"Match this
   register when drafting. Don't fake this voice on external content without showing me first."*
   `/humanize`, `/caption`, `/content`, and `/writing-beats` all read this.
3. If a brand hex was given, remind the user to set `--brand` in `design-system/tokens.css`.
Back up any existing intake/voice to `output/kick-off-backup-{date}/` before overwriting.

### Step 4 — The closing screen (three lines)
```
✓ Kick-off done. The OS knows who you are, who you serve, how you sound, and the line you won't cross.

Today:    run /start-day and ship one piece (战 The Campaign).
This week: read framework/ai-solopreneur-os.md — the four loops you'll run.
Anytime:  /system-check to score your OS and see what to wire next.
```

## Critical rules
1. The interview is capped — don't add questions in conversation.
2. **Voice paste cannot be skipped or typed** — refuse and ask for a real paste.
3. Write the files in one batch after the interview; the user iterates by editing the intake and re-running.
4. Idempotent — re-running with an edited intake refreshes the files and backs up the originals.
5. No `.env` writes, no paid calls, no publishing.
