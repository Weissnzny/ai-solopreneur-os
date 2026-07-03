# Connectors

The OS runs fine with **nothing connected** — every skill works on your Claude Code login alone. These
are optional integrations that let the OS reach your own accounts. **You install and authenticate
them; the OS ships no keys.** Put every secret in `.env` (copied from `.env.example`, gitignored).

> Honour `framework/operating-principles.md`: the OS edits its own folder freely and treats everything
> else as read-only unless you point it there. Any send / publish / paid call is approval-gated.

---

## 1. Google Workspace — `gws` (recommended)

A command-line tool that lets the OS read and write **your own** Gmail, Drive, Calendar, Sheets, and
Docs. This is what powers the calendar reads in `/start-day` and `/brain`, and any Doc/Sheet export
you wire later.

**Install**
- Get the `gws` CLI (a standalone Google Workspace CLI) and put it on your PATH.
- Confirm it runs: `gws --help`.

**Authenticate (one time)**
1. In [Google Cloud Console](https://console.cloud.google.com/), create a project and enable the APIs
   you want (Gmail, Drive, Calendar, Sheets, Docs).
2. Create an **OAuth client** (Desktop app). Note the **Client ID** and **Client Secret**.
3. Run the CLI's auth flow to mint a **refresh token** (it opens a browser, you approve scopes).
4. Put all three in `.env`:
   ```
   GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...
   GOOGLE_REFRESH_TOKEN=...
   ```

**Smoke test:** `gws calendar +agenda --today` should print today's events. If it does, `/start-day`
and `/brain` can read your calendar.

> Scopes are yours to choose. Grant read-only where you only need reads. The OS never sends email or
> mutates your calendar without explicit per-action approval.

---

## 2. Image generation (optional, paid)

Only needed if you want skills like `/carousel` to render **AI images** instead of the default $0
brand render. Put a key in `.env` (e.g. `KIE_API_KEY=...`) for your image engine. **Every paid render
is approval-gated** — without a key, image-bearing skills run in brief/placeholder mode and still ship.

---

## 3. Browser automation (optional) — Playwright MCP

Some skills (e.g. `/find-skill`) can browse JS-rendered marketplace pages. If you want that, install
the Playwright MCP server in your Claude Code MCP config. Read-only browsing; nothing is published.

---

## Adding your own
The OS is yours — wire a content calendar, a scheduler, a CRM, whatever. Two rules when you do:
1. Secrets go in `.env`, never in a skill file or the repo.
2. Keep the approval gates: paid calls, sends, publishes, and calendar writes all pause for you first.
