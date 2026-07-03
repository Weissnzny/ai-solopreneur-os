---
name: brain
description: >
  Your Second Brain — a single local board you talk to. Three modes:
  talk-to-edit (add/move/reprioritize tasks, rituals, notes), morning planning
  (reconcile the board against today's calendar and surface 1-3 focus items),
  and evening shutdown (mark what shipped, set tomorrow's top 3). Trigger on
  "open my brain", "second brain", "brain status", "what's on my plate",
  "plan my morning", "evening shutdown", "wrap up my day", "add to my brain",
  "update my board", "/brain".
---

# /brain — your Second Brain (建 Formation)

Part of the **建/阵 (Formation)** loop: the structure that holds your priorities so you don't carry
them in your head. The brain is **one local file the OS owns** — a board of lanes, tasks, rituals,
weekly priorities, and notes. You talk to it; it edits the file. Because the board lives inside your
OS folder (the vault), the OS may read and write it directly (`framework/operating-principles.md` §6).

## The board file
Default: `brain/board.json` inside your OS folder. If it doesn't exist, offer to create it from this
shape on first run:

```json
{
  "updated": "YYYY-MM-DDTHH:MM",
  "month_outcomes": ["..."],
  "week_priorities": ["..."],
  "lanes": { "backlog": [], "doing": [], "blocked": [], "done": [] },
  "tasks": [ { "id": "t1", "title": "...", "lane": "backlog", "due": "", "urgent": false } ],
  "rituals": [ { "name": "...", "ticks": [] } ],
  "notes": []
}
```

`due` is free text ("before Fri", "2026-06-10"). Treat it as a hard deadline only if it's
`YYYY-MM-DD`; otherwise echo it verbatim, never "fix" it. Never invent task `id`s — read them from
the file and match by `id`.

## Mode 1 — Talk-to-edit
Trigger: "add to my brain", "move X to doing", "make Y urgent", "set due…", "reword my week".
1. Read `brain/board.json`.
2. Translate the request into a **plain-English plan**, one line per change, using real task titles.
3. **Approval gate** — show the plan and wait for a yes before any destructive change (deleting a
   task, removing a ritual, or replacing more than one existing item). Single non-destructive edits
   can proceed once the plan is shown.
4. Apply the edits to the file. Bump `updated`. Back up the previous version to `brain/backups/`
   (keep the last ~20) before writing.
5. Report what changed.

## Mode 2 — Morning planning
Trigger: "plan my morning", "what should I focus on".
1. Read the board.
2. Read today's calendar (read-only) if the Google Workspace connector is wired:
   `gws calendar +agenda --today` (or `--days 3`).
3. Reconcile and surface: overdue (real dates only), free-text-due items verbatim, lane overload
   (>5 in `doing`), and calendar conflicts. Propose **1-3 focus** items, each tied to a month outcome.
4. *Offer* (don't auto-apply) to write the chosen focus back (mark urgent / re-slot). If yes, go via
   the Mode-1 edit path.

## Mode 3 — Evening shutdown
Trigger: "evening shutdown", "wrap up my day".
1. Read the board.
2. Walk the open lanes: ask what got **done**, what **slipped**, which **rituals** to tick today.
   Only tick what's confirmed — never pad.
3. Build the edits: done tasks → `done` lane; slips → re-slot; tick confirmed rituals at today's
   date; append a one-line recap to `notes`.
4. Show the plan, approval-gate any deletes, then write the file.

## Notes
- `status`/morning read is instant and read-only — lead with it, talk in your own voice.
- Last-write-wins: this is one file, edited in place. Back up before every write.
- This skill only *reads* Calendar. Any calendar **write** is a separate, explicitly-approved action.

## Output Standard
Format: text dashboard in chat. State file: `brain/board.json` (+ dated backups). No paid API, no
external sync, no publish.
