# W_Counsel (军师) — the optional face

The **AI Solopreneur OS is the product; W_Counsel is the mascot** — your 军师 (jūnshī, "war-counsel").
Everything in this repo works in plain Claude Code with no mascot at all. W_Counsel is an **optional
shell**: a voice + 3D talking-strategist (诸葛 / Zhuge Liang) that you *speak to*, running the same OS
underneath. ("W" is for Weiss; 军师 is the Chinese name.)

This folder does **not** vendor the heavy app (a 3D model + a local server are large and change often).
It documents how the optional W_Counsel shell connects to **this installed OS**.

---

## What W_Counsel is
- A small local app: you talk (mic), it thinks against your data folder, and a 3D figure speaks back.
- **Brain:** the Claude Agent SDK. **Voice:** Edge Read-Aloud voices via Node (`msedge-tts`) — no Python.
- **Look:** the Weiss design system — brand greens on black, Apple-glass panels, the transparent Weiss logo.
- **Boundary (hard):** it may freely edit **only inside its data folder** (your content dir); everything
  else on your machine is read-only. This mirrors `framework/operating-principles.md` §6.

## Connecting Claude (how the brain authenticates) — ToS-clean
The shell uses **your own Claude**, authenticated through Anthropic's own official client (no embedded
OAuth). The ⚙ "Connect Claude" panel opens in your choice of **中文 or English** and leads with:

1. **Sign in via Claude Code / VS Code** — the primary path. The app walks you through it: install
   Claude Code (or the VS Code extension) → run `claude` → `/login` → come back. W_Counsel then reads
   those local credentials via the Agent SDK. (If you're already signed in, it just works.)
2. **API key (clean alternate)** — paste an `sk-ant-…` key. Stored locally on your machine
   (gitignored, never sent to the browser).

> This is the deliberate, ToS-clean design: you authenticate through Anthropic's official client or your
> own API key — the app only provides guidance, it never embeds a consumer-subscription OAuth flow.

## Your content — it points at *your* data, not anyone's vault
W_Counsel reads from a **content folder you own**, resolved in this order: an in-app setting → an env-var
fallback → a bundled **generic Solopreneur-OS starter** copied in on first run (so it works out of the
box). The starter ships `index.md · profile.md · log.md · knowledge/ · HOW-TO-INGEST.md` — it asks who
you are and fills `profile.md`; no one's private data is shipped.

**To make it run *this* OS:** in the app's settings, point its content folder at this installed OS
folder (the packaged build has a native folder-picker). The app also honors an environment-variable
fallback if you prefer to set it that way — the exact variable name is documented in the W_Counsel
app's own README. Set it in the *app's* environment, not in this OS's `.env`.

## Feed it your knowledge (库 The Arsenal)
W_Counsel can **ingest on command**: say **`入库` / "ingest"** with text, a file, or a link and it writes
a note into `knowledge/`, an `index.md` entry, and a `log.md` line — the same compounding loop as this
OS's **库 Arsenal** (`wiki/`). See the shell's `HOW-TO-INGEST.md`.

## Install & run (Windows)
Three ways, no build step:
1. **Desktop app** — double-click **`军师.app`** (a shortcut to the launcher) → standalone Edge `--app` window.
2. **VS Code** — Run Task → "Launch W_Counsel".
3. **Claude Code** — open the app folder and say "run W_Counsel" (reuses your Claude Code login).

**The distributable (P4, shipped as a portable zip — not Tauri):** `build-dist.ps1` produces
**`W_Counsel-Setup.zip`** (~130 MB) bundling a portable `node.exe` + dependencies. End users:
**unzip → run "Install W_Counsel shortcut.cmd" → desktop `军师.app` → double-click.** Nothing to install
(no Node, Python, or Rust). A true **Tauri** native `.exe` is a planned later upgrade — it needs the
Rust/MSVC toolchain set up, so the current shipped installer is the no-Rust portable build.

## The avatar (`zhuge.glb`)
The 3D model is a heavy binary and is **gitignored** (`w-counsel/models/*.glb`) — bring your own, or use
the shell's turnaround-image fallback. If you own a model you may redistribute, drop it at
`w-counsel/models/zhuge.glb`; otherwise the shell renders the 2D fallback.

> W_Counsel / 诸葛 is the persona and mascot of this OS. You don't need it to run the OS — but if you
> want a war-counsel with a face and a voice, this is the door.
