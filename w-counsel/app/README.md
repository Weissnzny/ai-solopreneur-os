# 军师 · 研究院 — talking 诸葛亮 interface

A web interface where a Live2D 诸葛亮 figure **listens, thinks against the 研究院 arsenal, and
speaks back** — the same 军师 you talk to in Claude Code, now with a face and a voice.

```
你说话 (mic, zh-CN)  ──►  Claude Agent SDK  ──►  reads the vault (Read/Grep/Glob)
   or 打字                  (cwd = Research vault)        │
                                                          ▼
   Live2D 诸葛亮  ◄── edge-tts 中文语音 ◄── 军师 streams cited counsel (本于 doctrine)
   (口型随声音动)
```

## Install / Run — three ways

**1 · Desktop app (easiest)** — double-click **`军师.app`** on the Desktop. (First time, double-click
`Install W_Counsel shortcut.cmd` once to create that desktop icon.) It installs deps if needed,
starts the server, and opens a clean app window.

**2 · VS Code** — open the `junshi-app` folder in VS Code → **Terminal ▸ Run Task… ▸ "Launch W_Counsel"**
(installs + runs + opens the window). Or just run `npm install` then `npm start` in the integrated
terminal and open http://localhost:5174.

**3 · Claude Code** — open the folder in Claude Code and say **"run W_Counsel"** (it runs
`W_Counsel.cmd` / `node server.js`), or paste `npm install; node server.js` in its terminal. Bonus:
since you're already logged into Claude Code, W_Counsel uses **that Claude subscription** automatically —
nothing else to connect.

```powershell
# manual / any terminal:
cd "<your-folder>\junshi-app"
npm start    # → http://localhost:5174
```

…or just **double-click `军师.app`** on the Desktop — it starts the server and opens a clean
standalone app window. In **Chrome/Edge**: **press `Alt`+`V` to start talking, press again to
stop & send**, or click 🎙️, or type (Enter sends, Shift+Enter newline). Pick a voice from the
声线 dropdown (Chinese voices + an English narrator). 🔇 / `Esc` stops the **voice only** (军师
keeps working); double-click a message to edit it (editing your own message re-sends it).

> First interaction unlocks audio (browser autoplay rule) — that's why 军师 is silent until you
> click/press once.

## Connect your Claude (API key)

军师's brain runs on Claude. Each install uses **its own** Claude — two ways:

**A · Bring your own API key (for distributing / no Claude Code installed)**
1. Get a key at **https://console.anthropic.com/settings/keys** — it looks like `sk-ant-…`.
2. Launch the app. On **first run** a **「连接 Claude」** window appears (or click the **⚙** gear in
   the panel header anytime).
3. **Paste the key** into the `sk-ant-…` field → click **连接**. Done — it shows "已连接：自带 key".
4. To remove it later: **⚙ → 清除** (reverts to Claude Code login).

**B · Use your local Claude Code login (default)**
- If you're already logged into Claude Code on this machine, just click **跳过(用 Claude Code)** —
  no key needed. This is the current default; nothing to set up.

**Where the key lives / is it safe?**
- Stored **locally** in `junshi-config.local.json` (next to the app), **gitignored** (never committed),
  and **never sent to the browser**. Same safety level as a `.env` file: plaintext, on your machine,
  protected by your OS account.
- Caveat: it's plaintext (not encrypted) — fine for personal/dev use, same as `.env`. The packaged
  product (Tauri build) will move it to the **OS secure store** (Windows Credential Manager / macOS
  Keychain) for distribution.

## Feed it your knowledge (the arsenal)

军师 reasons over **your own data dir** (the "arsenal") — not anyone else's. A fresh install is
seeded from `content-template/` (generic scaffold; **no one's private data ships**). Each user then
fills it with their own knowledge. Three ways (full guide ships as `HOW-TO-INGEST.md` in the data dir):

1. **Tell 军师 to ingest** — "**Ingest this: …**" / "**入库这段：…**" + paste text/link → it writes a
   note in `knowledge/`, adds an `index.md` entry, logs it in `log.md`.
2. **Drop files** into `knowledge/` (`.md/.txt/.pdf/images`), then say "organize the new files".
3. **Save as you talk** — "save this" / "这条记下来".

Start by filling **`profile.md`** (who you are, your fronts) — 军师 reads it to understand you.
Data dir resolution: configured `contentDir` → `JUNSHI_VAULT` env → existing Research vault →
bundled starter at `./content`. (Set it via `POST /content/set`; native folder-picker in the Tauri build.)

## How it works

| Layer | Tech | Notes |
|---|---|---|
| 脑 Brain | `@anthropic-ai/claude-agent-sdk`, `cwd` = the Research vault | Uses your existing Claude Code login — **no API key needed**. **Full Claude Code toolset** (Bash/Write/Edit/Web/Task…), gated by a permission judge (see below). Session continuity across turns. |
| 嘴 Mouth | `edge-tts` voice `zh-CN-YunyangNeural`, pitch −8Hz | Free. Mature/low narration voice. Streamed sentence-by-sentence so 军师 starts speaking before the full answer finishes. Switchable live in the UI. |
| 耳 Ear | Browser Web Speech API (`zh-CN`) | Free, built into Chrome/Edge. Toggle **Alt+V** to start/stop. |
| 脸 Face | **3D turnaround billboard** of the actual Character Board Kit renders | The four turnaround views (`turn_front/right/back/left.png` in `public/models/zhuge/`, sliced from `junshi-board-kit.png` with background removed) are mapped onto a camera-facing plane in Three.js. As you orbit, it shows whichever real render matches the angle — so every frame is the board's own art (high fidelity to the reference), while still rotating in a lit 3D scene with a contact shadow. Idle breathing + audio-driven swell while speaking. Masthead avatar swaps expression by state: **neutral**→**thinking**→**focused**→**confident**. |

## Permission model (军纪) — two layers

You chose **"risky ops require confirmation."** 军师 has the full toolset but is gated:

1. **Verbal layer** — the system prompt tells 军师 to *announce* any destructive/irreversible/
   outward action and wait for your nod before acting.
2. **Hard gate** (`canUseTool` in `server.js`) — the real enforcement, independent of the model:
   - **Run free:** Read, Grep, Glob, WebSearch/WebFetch, Task, TodoWrite, and writes/edits
     **inside the vault or this app dir**.
   - **Confirm first:** Bash/PowerShell/any shell command matching the destructive denylist
     (`rm`, `del`, `Remove-Item`, `format`, `git push`, `git reset --hard`, `mv`, pipe-to-shell,
     outbound `curl -d`/POST, …), writes **outside** the safe dirs, `KillShell`, **and any
     unrecognized tool** (safe-list design — nothing slips through an un-enumerated tool).
   - A denied action holds across retries: 军师 trying PowerShell after a denied Bash gets gated
     again. Verified end-to-end.

> **Residual limitation (be honest):** command gating is denylist-based, so a deliberately
> obfuscated destructive command (e.g. `node -e "fs.rmSync(...)"`) could evade the pattern match.
> The verbal layer + your eyes on each command are the backstop. For maximum safety, switch to a
> read-only posture by removing shell tools (set `allowedTools` to Read/Grep/Glob/Write/Edit in
> `server.js` and drop Bash/PowerShell).

## Config (env vars)

- `JUNSHI_MODEL` — `sonnet` (default, snappy) or `opus` (deepest counsel)
- `JUNSHI_VOICE` — default `zh-CN-YunyangNeural`. Options: `YunyangNeural` (成熟播报), `YunjianNeural`
  (浑厚解说), `YunxiNeural` (阳光), `zh-HK-WanLungNeural` (粤语), `zh-TW-YunJheNeural` (台湾)
- `JUNSHI_PITCH` — default `-8Hz` (lower = deeper)
- `JUNSHI_RATE` — default `-4%` (lower = slower/steadier)
- `JUNSHI_VAULT` — path to the Research vault (default set)
- `PORT` — default 5174

## Re-slicing the figure / upgrading the model

The figure is a **turnaround billboard** built from `junshi-board-kit.png`. To re-slice (e.g. a new
board), edit the crop boxes in the Python slicer (see git history / the `turn_*` crops) — it crops
the 4 turnaround views, flood-fills the paper background to transparent, and keeps the largest
connected shape. Output to `public/models/zhuge/turn_{front,right,back,left}.png`.

**Currently active:** a real `.glb` is in place at `public/models/zhuge/zhuge.glb`, so the app loads
the **true volumetric 3D model** (auto-fit + centered + feet-on-ground, breathing + audio swell);
the billboard is the fallback if that file is removed. To replace it, just drop a new `zhuge.glb`.

For a genuine free-rotation **`.glb`/`.gltf`** 3D model (so it's smooth at every angle, not 4 stops)
(commissioned, or made in Blender/from the turnaround views):

1. Add the GLTFLoader script in `index.html`:
   `https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js`
2. Drop the model at `public/models/zhuge/zhuge.glb`.
3. In `initThree()`, replace `junshi = buildJunshi(); scene.add(junshi)` with a
   `new THREE.GLTFLoader().load("/models/zhuge/zhuge.glb", gltf => { junshi = gltf.scene; scene.add(junshi); })`.
4. If the model is rigged with a mouth/jaw bone or visemes, drive it from `mouthValue` in the
   `animate()` loop (same signal currently driving the head-nod).

## Verified

- ✅ Brain runs on Claude Code auth, reads the vault, answers as 军师 with doctrine + 于主公何益.
- ✅ Session continuity across turns.
- ✅ edge-tts produces valid zh-CN audio; delivered to browser and decoded for playback + lip-sync.
- ✅ Permission gate: safe ops run free; risky ops (Bash `rm`, PowerShell `Remove-Item`) raise a
  confirm card; **deny blocks execution and holds across alternate-tool retries**; approve executes.
  The "route around the gate via an un-enumerated tool" hole was found during testing and closed.
- ⏳ Audible sound + visible mouth motion: confirm by opening it yourself and using 🎙️/Alt+V
  (a headless test browser has no speaker).

## Files

- `server.js` — Express + WebSocket; runs the agent, streams text, synthesizes TTS.
- `public/` — `index.html`, `app.js` (WS + STT + audio + Live2D), `style.css`.
- `smoke-brain.js` — proves the Agent SDK auth + vault read.
- `probe-ws.js` — headless WS client; proves the server emits audio packets.
