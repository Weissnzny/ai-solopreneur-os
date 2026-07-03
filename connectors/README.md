# Connectors

The OS runs fine with **nothing connected** — every skill works on your Claude Code login alone. These
are optional integrations that let the OS reach your own accounts. **You install and authenticate
them; the OS ships no keys.** Put every secret in `.env` (copied from `.env.example`, gitignored).

> Honour `framework/operating-principles.md`: the OS edits its own folder freely and treats everything
> else as read-only unless you point it there. Any send / publish / paid call is approval-gated.

---

## 1. Google Calendar (recommended) — a calendar MCP server

This is what turns `/content-plan` into a command center and lets `/start-day` and `/brain` read your
day. The OS is **calendar-connector-agnostic**: it works with any MCP server that exposes read/create
calendar tools to Claude Code. You don't need a special build from the author — install a public one.

**The easy path — a public Google Calendar MCP**

A well-maintained open-source option is
[**nspady/google-calendar-mcp**](https://github.com/nspady/google-calendar-mcp), runnable straight from
npm with no compile step:

1. **Google Cloud (one time):** in [Google Cloud Console](https://console.cloud.google.com/), create a
   project, enable the **Google Calendar API**, and create an **OAuth client (Desktop app)** — you get a
   credentials JSON. (This OAuth step is unavoidable: it's how Google lets *your own* app touch *your
   own* calendar. Do it once.)
2. **Wire the server** into your Claude Code MCP config, pointing it at that credentials file — see the
   project's README for the exact `npx @cocal/google-calendar-mcp` command and config block.
3. **First run** opens a browser to approve scopes; grant read-only if you only want the OS to *read*.

**Smoke test:** ask Claude Code "what's on my calendar today?" — if it answers from your real calendar,
`/start-day`, `/brain`, and `/content-plan`'s calendar push are live.

> The OS never mutates your calendar without explicit per-action approval — a calendar write always
> stops for your "confirm" first (`framework/operating-principles.md`).

**Advanced — your own CLI (optional).** If you'd rather drive Google from a command line, the author uses
a private `gws` CLI (Client ID / Secret / refresh token in `.env`, the three `GOOGLE_*` keys in
`.env.example`). That CLI isn't shipped here; the skills only assume *some* calendar connector is wired,
so a public MCP is the recommended route. Bring your own if you have one.

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
