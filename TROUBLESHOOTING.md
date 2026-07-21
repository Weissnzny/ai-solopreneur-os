# Troubleshooting

**In plain English:** the things that actually go wrong, in the order they usually go wrong. Find your
symptom, not your error message.

If nothing here matches, ask in the community at
[skool.com/ai-solopreneur-os](https://www.skool.com/ai-solopreneur-os) and say **which step of
[`INSTALL.md`](./INSTALL.md) you are on**. That one detail saves everyone ten messages.

---

## Install problems

### Claude Code does not see any `/` commands

This is the number one issue, and it is almost always the folder level.

Claude Code reads the folder you opened. The OS only works if you opened the folder that **directly
contains** `README.md` and the hidden `.claude` folder.

**Check:** look at the file list in VS Code's sidebar. Do you see `README.md`, `framework`,
`onboarding`, `wiki` at the top level? If instead you see a single folder like
`ai-solopreneur-os-main`, you are one level too high.

**Fix:** File → Open Folder, and go one level deeper.

### I opened the right folder and still no commands

Reload the window. `Ctrl+Shift+P` (Mac: `Cmd+Shift+P`) → type **Developer: Reload Window** → Enter.

If they still do not appear, confirm the Claude Code extension actually finished installing and that
you are signed in.

### Unzipping gave me a folder inside a folder

Normal for GitHub ZIPs. Go into the nested folder until you can see `README.md`. That is the one to
open. If you like, drag that inner folder somewhere clean and delete the empty wrapper.

### It is asking me for an API key

You do not need one for normal use. Choose the **sign in** option instead and use the account your
Claude Pro subscription is on.

### Mac: macOS blocked VS Code the first time I opened it

Open **Applications**, right-click **Visual Studio Code**, choose **Open**, then confirm. macOS only
asks once. Only do this for the copy you downloaded from `code.visualstudio.com`.

### Windows: I cannot see the `.claude` folder in File Explorer

Correct, it is hidden. You do not need to see it there. VS Code shows it in the sidebar, which is the
only place it matters.

### `git clone` is asking me to log in

Skip git. Use the **Download ZIP** path in [`INSTALL.md`](./INSTALL.md) Step 4. Nothing in the OS
depends on git being set up.

---

## Running problems

### It writes in a voice that is not mine

Your `onboarding/intake.md` is probably still full of `{{ONBOARD}}` placeholders. Say **"onboard me"**
in Claude Code and answer the questions, or fill the file yourself.

Still not close enough? Create a `voice.md` in the OS folder and paste two or three things you have
actually written. `/humanize` and `/caption` read it and match you.

### `/content-plan` mentions a calendar connector I do not have

Expected, and fine. Say you have none, or skip. You still get the full week's plan and a doc per day
under `output/`. The connector only adds an automatic push to your calendar. It is optional and always
was. See [`connectors/README.md`](./connectors/README.md) if you ever want it.

### Where did my output go?

Everything a skill makes lands under `output/` in the OS folder. That folder is deliberately ignored
by git, so your work is yours and never gets published by accident.

### I want it to answer me in 中文

Just talk to it in 中文, and say so in your intake under language. It follows the language you set per
platform, so an English LinkedIn post and a 中文 Xiaohongshu post can come out of the same plan.

### I hit my Claude usage limit halfway through

That is a Claude plan limit, not the OS. Wait for the reset and pick up where you stopped. Nothing is
lost. The OS keeps its state in files on your disk, not in the conversation.

### It changed a file I did not want changed

The OS is bound to edit only its own folder and to treat the rest of your machine as read-only, and it
is supposed to ask before it spends, sends, publishes, or deletes. See
[`framework/operating-principles.md`](./framework/operating-principles.md).

If something still went sideways, tell it plainly to undo the change. If the folder is a git clone,
`git status` shows you exactly what moved.

---

## Still stuck

Post in the community with three things:

1. Which step number you are on
2. What you expected to happen
3. A screenshot of the screen you are looking at

Do not paste your `.env` or anything with keys in it.
