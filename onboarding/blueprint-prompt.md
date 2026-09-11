# The blueprint prompt — run this straight after `/kick-off`

In plain English: `/kick-off` told the OS who you are. This turns that into a plan you can actually
work from. It writes `context/blueprint.md` — your next 90 days, written as your four loops.

## Do `/kick-off` first, properly

This prompt reads your answers. It does not invent them.

If `context/who-i-am.md` still has `ONBOARD` placeholders in it, the prompt will stop and send you
back — on purpose. A blueprint built on blanks is a blueprint for somebody else's business. Run
`/kick-off`, answer it honestly, then come back here.

## What it writes, and who reads it

- **Writes:** `context/blueprint.md`
- **Read by:** the OS, every session. `CLAUDE.md` tells Claude to read `context/` before planning
  anything with you, so the plan you make here is the plan it works from tomorrow.
- **Shaped as:** the four loops from `framework/ai-solopreneur-os.md` — 知 what's true · 阵 what to
  build · 战 what ships · 道 who it's for.

## The prompt — paste this into Claude Code

```
Read context/who-i-am.md, context/voice.md and framework/ai-solopreneur-os.md first.

If context/who-i-am.md still has any ONBOARD placeholders in it, stop there and tell me to
run /kick-off first. Do not guess my answers.

Then be my W_Counsel and build my 90 day blueprint.

1. Say back in one line what you understood: what I do, who I serve, and the ONE thing I push
   forward daily (content, clients, product or delivery). Wait for me to confirm.
2. Ask me up to five questions, ONE at a time, and show me an example answer with each one.
   Only ask what context/who-i-am.md does not already tell you.
3. Write it to context/blueprint.md, shaped as my four loops:
   知 Knowing      what is true about my business right now
   阵 Formation    the three structures to build first, in order
   战 Campaign     what I ship each week for the next 90 days, for MY daily push
   道 The Way      who this is for, and why me, in my own words
4. Finish with ONE thing I do tomorrow.

Use only what I have told you. Never invent a number, a client or a result. Short sentences,
plain words. If something is missing, ask me for it instead of filling it in.
```

## 中文版

先跑 `/kick-off`，认真答完。这个提示词是读你的答案的，它不会帮你编。
`context/who-i-am.md` 里还留着 `ONBOARD` 空位的话，它会停下来叫你回去先做完。
写出来的东西放在 `context/blueprint.md`，OS 每次开工都会读它。

```
先读 context/who-i-am.md、context/voice.md 和 framework/ai-solopreneur-os.md。

如果 context/who-i-am.md 里面还留着 ONBOARD 的空位，就停在那里，叫我先去跑 /kick-off。
不要帮我猜答案。

然后当我的军师，帮我做一份 90 天的作战蓝图。

1. 用一句话讲回你理解到的：我做什么、我服务谁，还有我每天推的那一件事是什么
   （内容、客户、产品，还是交付）。等我确认。
2. 最多问我五个问题，一次一个，每一个都给我一个示范答案。
   context/who-i-am.md 里已经写了的，就不要再问。
3. 写进 context/blueprint.md，照我的四谋来排：
   知    我这盘生意现在的真实情况
   阵    最先要建的三个结构，照顺序
   战    接下来 90 天我每个星期出什么，配合我每天推的那件事
   道    这是做给谁的，为什么是我，用我自己的话
4. 最后给我明天要做的那一件事。

只用我告诉过你的东西。不准编数字、编客户、编成绩。句子要短，用大白话。
少了什么就问我，不要自己填。
```

## After this

`/start-day` runs your blueprint every morning. `/system-check` scores what you have wired so far.
When your business changes, edit `context/who-i-am.md` and run this prompt again — it overwrites
`context/blueprint.md` with the current picture.
