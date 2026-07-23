# Learn the OS — the path from installed to shipping

**In plain English:** the OS is on your machine. Now what? This is the order to learn it in, and it is
the same order as the classroom, so the two never contradict each other. About a week if you do one
step a day. Every step ends with something real you made, not a lesson you watched.

Recorded walkthroughs live in the free classroom at
[skool.com/ai-solopreneur-os](https://www.skool.com/ai-solopreneur-os). **This file is the map. The
classroom is someone walking it with you.** You can do the whole thing from this file alone.

---

## The shape of it

| | Step | You walk out with |
|---|---|---|
| **M0** | Start here | a decision that this is worth your hour a day |
| **P** | Prerequisites | Claude Pro + VS Code + Claude Code, signed in |
| **S1** | Download and open the OS | `/system-map` printing on your screen |
| **S2** | Onboard it | an `intake.md` in your voice |
| **S3** | Get your day's plan | one small thing shipped on day one |
| **S4** | How the system maps | you can name the 5 pillars and 4 loops |
| **S5** | The commands | you know what to reach for, without memorising |
| **A1-A3** | Track A: content | one idea turned into a week of posts, in your voice |

---

## M0 — Start here

Before you install anything, know what you are agreeing to.

Read [`README.md`](./README.md) for what this is, then
[`framework/operating-principles.md`](./framework/operating-principles.md) for what it will never do
to you. No fabrication. No anxiety, no hype. Family first. Plain language. It asks before it spends,
sends, publishes, or deletes. It edits its own folder and treats the rest of your machine as read-only.

**The honest cost:** about an hour a day, and about US$20 a month for Claude Pro. That is the whole
bill. There is no upsell hiding in step nine.

**Done when:** you have written down, privately, the one reason you are doing this. You will need it
again in S2, and the OS will hold it as your 道.

---

## Prerequisites — what to install first

Two things, both about 30 minutes total, no coding:

1. **A Claude Pro account** (about US$20/month) at [claude.ai](https://claude.ai). This is the engine.
2. **VS Code** (free) at [code.visualstudio.com](https://code.visualstudio.com), plus the **Claude Code**
   extension inside it, signed in with that Pro account.

You do not need an API key for normal use.

**Done when:** you can open VS Code and see Claude Code signed in.

---

## S1 — Download the OS and open it

Follow [`INSTALL.md`](./INSTALL.md) end to end. It has a screenshot per step.

The one step people get wrong: **open the folder level that directly contains `README.md` and the
hidden `.claude` folder.** One level too high and no `/` commands appear, and it looks like the OS is
broken when you have simply opened the wrong door.

**Done when:** `/system-map` prints a map of your OS. Post that screenshot in the community. It is how
anyone quietly stuck gets caught early.

---

## S2 — Onboard it

Say **"onboard me"** in Claude Code, or fill [`onboarding/intake.md`](./onboarding/intake.md) by hand.

It asks what your work actually is, where you are heading, what keeps grinding you down, how you
sound, your rhythm, and the one line you will not cross. The reason you wrote down in M0 goes in here.
That is the moment it stops being a tool and starts being *your* tool.

**The question that changes everything:** *what is the one thing you push forward every day?*
**Content · clients · product · delivery** — pick one. It is what `/start-day` will refuse to let you
close the morning without. Pick the one that, if it moved every single day, would change your year.

Do not pick content because this OS was built by someone who sells content. If your business moves on
client conversations, pick clients. You can change it any time by editing the intake.

**Done when:** no `{{ONBOARD}}` placeholders are left in `intake.md`, and you have chosen your one thing.

---

## S3 — Get your day's plan

```
/start-day        issue the day's orders
/shutdown         close the day honestly
```

Run `/start-day`. It reads the one thing you chose in S2 and will not let you close the morning until
that thing has moved — a post if you chose content, a real conversation if you chose clients, a visible
increment if you chose product, something in a client's hands if you chose delivery.

It prepares; you send. Same rule in all four lanes.

**Done when:** one real thing moved today. Ugly and real beats polished and unshipped.

---

## S4 — How the system maps

Read [`framework/ai-solopreneur-os.md`](./framework/ai-solopreneur-os.md) once, properly, and
[`framework/glossary.md`](./framework/glossary.md) when a term stops you.

**五柱 (five pillars)** are the surfaces you operate from: 势 Terrain · 律 Rhythm · 令 Morning Command ·
谋 Grand Strategy · 库 Arsenal.

**四谋 (four loops)** live inside 谋, and you run all four every week. A cycle, not a ladder:

- **知 Knowing** — what is actually worth my effort this week?
- **阵 Formation** — what did I redo this week that a system should have held?
- **战 Campaign** — what did I put into the world that someone could react to?
- **道 The Way** — will this business still feel like mine in five years?

Four agents mirror the loops and route your plain-language request to the right skill, so you are never
picking commands off a list.

**Done when:** you can answer all four questions about your own week, and you know which loop is your
weakest.

---

## S5 — The commands

The full list is in [`README.md`](./README.md) under *What you can run*. Do not memorise it. Ask in
plain language and the agents route it.

The ones you will actually live in:

```
/start-day  /shutdown         your daily cadence
/content-plan  /content       plan a week · route one topic
/caption  /carousel  /video-script   the assets
/humanize                     the quality gate, every time
/brain                        a board you talk to
/find-skill                   borrow before you build
/system-check                 score your OS, get the top 3 fixes
```

**Done when:** you have run `/system-check` once and know your weakest loop by number, not by feeling.

---

## Track A — turn one idea into a week of content

This is where the OS pays for itself.

**A1 — one idea, a week of posts.** `/content-plan` plans the week and writes a doc per day under
`output/`. It works with nothing connected. A calendar connector is optional and comes much later.

**A2 — teach it your voice.** Create a `voice.md` and paste two or three things you have actually
written. Then run `/humanize` on a caption and compare before and after. That gap is the whole point.

**A3 — the weekly rhythm.** Plan once a week, ship daily. Keep it boring and repeatable. The
**Saturday flagship** is the one piece a week that compounds; a year of them is an archive nobody can
speed-run.

**Done when:** a week of content exists, in your voice, and you did it in one sitting.

---

## Keep going

**库 The Arsenal** ([`wiki/`](./wiki/)) is your personal knowledge base, built on the pattern Andrej
Karpathy described: raw sources compiled into a linked set of pages with an index that maintains
itself. Say **ingest** to feed it, **ask** to query it, **lint** to check its health. The 库 pillar
routes what you feed it three ways: **build** something, tell a **story**, make **content**.

See [`wiki/CLAUDE.md`](./wiki/CLAUDE.md) for how it governs itself.

---

## When you want to go faster

The path above is the whole free system, and it genuinely finishes. Nothing is held back to sell you
something later.

What is on the other side is **speed and company**: someone watching your first week instead of you
guessing, and **W_Counsel (军师)**, the version of this OS with a face and a voice that you talk to
instead of type at. See [`w-counsel/`](./w-counsel/).

<!-- WEISS: paid exit not yet decided (2026-07-21). Options on the table: the Sprint (live), the
     W_Counsel waitlist, or both. This block deliberately carries no price and no purchase link.
     Same placeholder sits at the bottom of README.md. -->
