# journal/ — one note per session

One conversation = one file: `journal/YYYY-MM-DD-<topic>.md` (topic = 2 to 4 kebab-case words).
`/shutdown` writes it. If a session ended without `/shutdown`, write its note at the start of the
next session, before new work.

**Front matter:** `date` · `title` · `touched` (the files this session changed).
**Body:** under 300 words. What was decided, what changed, what surprised. Point to the file that
holds the detail; never copy the detail here. A trivial session gets an honest one-liner.

This folder is a map, not a store. Facts live in the file that owns them (`memory/`, `wiki/`,
`onboarding/intake.md`). An entry here says where to look.

Template: `_template.md`. Your real notes are yours: `.gitignore` keeps them out of any repo you push.
