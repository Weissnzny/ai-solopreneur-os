# Install the AI Solopreneur OS

**In plain English:** you are installing two things you already need (a code editor and Claude Code),
then dropping this folder onto your machine and opening it. There is no installer to run and nothing
to configure. About 20 minutes, most of it downloads.

Follow the pictures. Every step below has a screenshot, and the full walkthrough is recorded in the
community classroom at [skool.com/ai-solopreneur-os](https://www.skool.com/ai-solopreneur-os).

> Windows and Mac are the same five steps. Where the screens differ, both are shown.

---

## Before you start

You need three things:

| | What | Why |
|---|---|---|
| 1 | A **Claude account, Pro minimum** | The OS runs on your Claude Code sign-in. No API key for normal use. |
| 2 | **VS Code** (free) | The window everything happens in. |
| 3 | About **2 GB free space** and 20 minutes | Mostly downloads. |

You do **not** need: a paid API key, a server, Node, Python, a GitHub account, or any coding.

---

## Step 1 — Install VS Code

Go to [code.visualstudio.com](https://code.visualstudio.com/) and download the version for your
computer. Run the installer and accept the defaults.

![Step 1 — download VS Code](docs/images/01-download-vscode.png)

**Windows:** during setup, leave "Add to PATH" ticked if you are asked.
**Mac:** drag **Visual Studio Code** into your **Applications** folder, then open it from there.

---

## Step 2 — Install the Claude Code extension

Open VS Code. Click the **Extensions** icon in the left bar (or press `Ctrl+Shift+X`, on Mac
`Cmd+Shift+X`). Search for **Claude Code**. Click **Install**.

![Step 2 — install the Claude Code extension](docs/images/02-install-claude-code.png)

---

## Step 3 — Sign in with your Claude account

Open the Claude Code panel and sign in when it asks. Use the account your **Claude Pro** subscription
sits on.

![Step 3 — sign in to Claude Code](docs/images/03-sign-in.png)

If it asks you to choose between signing in and pasting an API key, choose **sign in**. The OS is built
to run on your subscription.

---

## Step 4 — Get the OS onto your machine

Two ways. Pick one.

**The simple way (no git needed):**

1. Open [github.com/Weissnzny/ai-solopreneur-os](https://github.com/Weissnzny/ai-solopreneur-os)
2. Click the green **Code** button, then **Download ZIP**
3. Unzip it somewhere you own and will find again. `Documents` is a good home.
   Avoid a folder that a cloud drive is actively syncing, and avoid spaces-heavy nested paths.

![Step 4 — download the OS as a ZIP](docs/images/04-download-zip.png)

**The git way:**

```bash
git clone https://github.com/Weissnzny/ai-solopreneur-os.git
```

> **Watch the folder level.** Unzipping often gives you a folder inside a folder
> (`ai-solopreneur-os-main/ai-solopreneur-os-main/`). The folder you want is the one that **directly
> contains** `README.md` and a hidden `.claude` folder. Open the wrong level and Claude Code will not
> see any commands.

---

## Step 5 — Open the folder and wake it up

In VS Code: **File → Open Folder**, and pick the OS folder from Step 4.

![Step 5 — open the OS folder in VS Code](docs/images/05-open-folder.png)

Open the Claude Code panel and type:

```
onboard me
```

It interviews you for about two minutes and fills in `onboarding/intake.md` so the OS speaks in your
voice, to your audience. Nothing is sent anywhere. That file stays on your machine.

Prefer to type it yourself? Open [`onboarding/intake.md`](./onboarding/intake.md) and fill the blanks.

---

## Step 6 — Prove it works

In the Claude Code panel, run:

```
/system-map
```

You should get a one-glance map of the whole OS. That is your green light.

![Step 6 — /system-map output](docs/images/06-system-map.png)

Then run your first real day:

```
/start-day
```

**Post your `/system-map` screenshot in the community.** It is how we catch anyone quietly stuck.

---

## Optional: the `.env` file

You only touch this if you later wire an optional connector, like pushing your content plan to Google
Calendar. For normal use, skip it entirely.

When you do need it: make a copy of `.env.example`, rename the copy to `.env`, and fill only the keys
the connector asks for. See [`connectors/README.md`](./connectors/README.md).

Your `.env` is ignored by git and never leaves your machine.

---

## Stuck?

Read [`TROUBLESHOOTING.md`](./TROUBLESHOOTING.md) first. It covers the things that actually go wrong,
in the order they usually go wrong. If it is not there, ask in the community and say which step number
you are on.

**Working? Go to [`LEARN.md`](./LEARN.md)** for the path from here to your first shipped piece.
