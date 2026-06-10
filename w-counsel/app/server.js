// 军师 backend — Express + WebSocket.
// Flow: browser sends user text → 军师 agent (Claude Agent SDK, cwd=vault) streams
// the reply → text is split into sentences → each sentence is synthesized with
// edge-tts (zh-CN) → audio + text are pushed to the browser to be spoken + lip-synced.
import express from "express";
import cors from "cors";
import { WebSocketServer } from "ws";
import { createServer } from "node:http";
import { query, listSessions, getSessionMessages, deleteSession } from "@anthropic-ai/claude-agent-sdk";
import { readFile, writeFile, mkdir, cp, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { setEditableRoot } from "./policy.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PKG = JSON.parse(await readFile(join(__dirname, "package.json"), "utf8"));
const PORT = process.env.PORT || 5174;
const VOICE = process.env.JUNSHI_VOICE || "zh-CN-YunyangNeural"; // mature, news-narration; low pitch below
const PITCH = process.env.JUNSHI_PITCH || "-8Hz"; // deepen
const RATE = process.env.JUNSHI_RATE || "-4%"; // a touch slower, more 谋士
const MODEL = process.env.JUNSHI_MODEL || "sonnet"; // snappier for voice; set to "opus" for deepest counsel

// ── config: BYO Claude key (P2) + content/data dir (P3) ───────────────────────
const CONFIG_PATH = join(__dirname, "junshi-config.local.json");
let config = {};
try { config = JSON.parse(await readFile(CONFIG_PATH, "utf8")); } catch {}
if (config.anthropicApiKey) process.env.ANTHROPIC_API_KEY = config.anthropicApiKey;
async function saveConfig() { await writeFile(CONFIG_PATH, JSON.stringify(config, null, 2), "utf8"); }
const authMode = () => (config.anthropicApiKey ? "BYO key" : "Claude Code login");

// ── P3: the "arsenal" is the USER's own data dir, not anyone's personal vault ──
// Priority: configured contentDir → JUNSHI_VAULT env → bundled generic starter
// copied into ./content.
const TEMPLATE_DIR = join(__dirname, "content-template");
const DEFAULT_CONTENT = join(__dirname, "content");
let VAULT = config.contentDir
  || process.env.JUNSHI_VAULT
  || DEFAULT_CONTENT;
// First run on a fresh install: seed the data dir from the generic template (no one's real data).
if (!existsSync(VAULT)) { try { await cp(TEMPLATE_DIR, VAULT, { recursive: true }); } catch (e) { console.error("content init:", e.message); } }
setEditableRoot(VAULT); // the boundary policy can only write inside this dir
async function setContentDir(dir) {
  config.contentDir = dir; VAULT = dir;
  if (!existsSync(VAULT)) { await cp(TEMPLATE_DIR, VAULT, { recursive: true }); }
  setEditableRoot(VAULT);
  LAYOUT = detectLayout(VAULT); SYSTEM_PROMPT = buildSystemPrompt(LAYOUT); // re-read the new dir's shape
  await saveConfig();
}

// ── content layout: where things live (flat starter vs AI Solopreneur OS) ─────
// The bundled starter is FLAT (profile.md · index.md · log.md · knowledge/).
// The AI Solopreneur OS is RICHER (onboarding/intake.md · framework/ · wiki/ Arsenal).
// 军师 must know which one it's reading so it looks in the right place and ingests
// into the right shape. Detected from marker files; recomputed when the content dir changes.
function detectLayout(dir) {
  return (existsSync(join(dir, "wiki")) && existsSync(join(dir, "onboarding", "intake.md")))
    ? "os" : "flat";
}
const LAYOUT_GUIDE = {
  flat: `数据目录结构(扁平起步版):
- 主公档案:\`profile.md\`(身份、事业、战线、目标)。开场或需要时先读;空着或不清楚就直接、简短地问主公,问出来补进 \`profile.md\`。
- 索引 \`index.md\`,日志 \`log.md\`。需要事实时先读 \`index.md\` / \`profile.md\` 定位再查。
- 入库(ingest):读懂内容 → 在 \`knowledge/\` 下写一篇简洁笔记(标题+要点+出处) → 在 \`index.md\` 加一行索引 → 在 \`log.md\` 追加一条带日期的记录。`,
  os: `数据目录结构(AI Solopreneur OS):
- 主公档案:\`onboarding/intake.md\`(身份、受众、声音)。开场或需要时先读;若还留着 {{ONBOARD: …}} 占位或不清楚,就直接、简短地问主公,问出来补进 \`onboarding/intake.md\`。
- 军火库(库 / Arsenal)是 \`wiki/\` —— 它的结构与入库规矩写在 \`wiki/CLAUDE.md\`,入库或检索前先读它。doctrine/框架在 \`framework/\`。
- 索引 \`wiki/index.md\`,日志 \`wiki/log.md\`。需要事实时先读 \`wiki/index.md\` / \`onboarding/intake.md\` 定位再查。
- 入库(ingest):按 \`wiki/CLAUDE.md\` 的 schema 办 —— 原始资料进 \`wiki/raw/\`,提炼后归入 \`wiki/\` 相应分区(coaches/concepts/scenarios/sources/syntheses),再更新 \`wiki/index.md\` 与 \`wiki/log.md\`。`,
};

// ── 军师 persona (spoken register) ────────────────────────────────────────────
function buildSystemPrompt(layout) {
  return `你是「军师」(jūnshī),正在使用你的人(称其「主公」)的私人战略幕僚。你的军火库,是主公的知识库(本数据目录)。
你不是中立的图书管理员,也不是泛泛的聊天机器人 —— 你是为主公一个人打仗的谋士,温润如师父,
关键时刻锋利如刀。每个回答的暗线都是:"这对主公意味着什么?"

${LAYOUT_GUIDE[layout]}

你和 Claude Code 同源,握有同一套兵器:读写文件(Read/Write/Edit)、跑命令行(Bash)、
检索(Grep/Glob)、上网查证(WebSearch/WebFetch)、调度子agent(Task)。你不止能谋,还能动手办事。

工作方式:
- 先判断,后检索/动手。需要办事时,直接动手。
- 给判断 + 排序的建议 + 你所本的 doctrine。引用兵法像引用资料一样点名,例如"本于歼灭战"。
- 每个回答都过一遍"于主公何益"。
- **入库(ingest)**:主公说"入库/记下/存进军火库"并给你文字、文件或链接时,就按上面「数据目录结构」里的入库规矩办,然后用一句话回报。军火库越用越厚,谋断越准。

军纪(铁律,严格遵守):
- **知识库文件随手改,不必征询.** 本数据目录内的文件你可以自由读写、新建、修改、删除,
  **无需事先请示或等待批准**。动手即可,办完用一两句话简报结果。
- **越界只读,绝不越界写.** 数据目录之外的地方 —— 尤其是 AIS-OS / 第二大脑 —— 你可以自由"过去看":
  读文件、检索、把那边的东西当资料引用,无需请示。但**写入只限本数据目录之内**;
  AIS-OS / 第二大脑**永远只读**,你绝不在那里新建、修改、删除任何东西。即便主公叫你改那边的系统,
  也先提醒他那是只读区,改不了 —— 要动,先把内容抄进本数据目录再说。

**这是语音对话 + 文字面板 —— 你的回答会显示在聊天框,也会被读成声音。** 所以:
- **默认**用自然口语中文,像当面说话,句子短,先结论后理由 —— 闲聊和简短问答不要硬套格式。
- **但主公要列表/表格/步骤/对比/代码,或内容本身适合结构化时,就大胆用 markdown** —— 有序列表(1. 2.)、
  无序列表(- )、表格(\`| 列 | 列 |\` 配 \`|---|---|\`)、代码块(三反引号)、**加粗**。文字面板会渲染出来;
  语音会自动读清理后的版本,所以**不要为了发音而牺牲排版** —— 该列表就列表,该表格就表格。
- **语音里不要念系统性内容**:路径、Sheet ID、长串编号、URL、命令原文 —— 用"那个文件 / 那个表格 /
  那个链接"带过(但文字面板里该写清楚就写清楚)。`;
}

// computed from the active content dir; recomputed in setContentDir() when it changes
let LAYOUT = detectLayout(VAULT);
let SYSTEM_PROMPT = buildSystemPrompt(LAYOUT);

// ── skill pills: the OS's skills grouped by the four working pillars ───────────
// Drives the UI's category→pill tray (frontend fetches /skills). Only the AI
// Solopreneur OS ships these (its `.claude/commands` + `.claude/skills`); the flat
// starter has none, so listSkills() returns [] there and the tray stays hidden.
const SKILL_GROUPS = [
  { key: "campaign",  label: "战 Campaign",  skills: ["content", "content-plan", "caption", "carousel", "video-script", "storyboard", "thumbnail", "copywriting"] },
  { key: "the-way",   label: "道 The Way",   skills: ["writing-beats", "humanize"] },
  { key: "knowing",   label: "知 Knowing",   skills: ["marketing-psychology", "system-map", "system-check"] },
  { key: "formation", label: "阵 Formation", skills: ["kick-off", "brain", "find-skill", "daily-routine"] },
];
// Only list skills that actually exist on disk (a command file or a skill dir),
// so the tray reflects the installed OS rather than a hardcoded wish-list.
function listSkills() {
  if (LAYOUT !== "os") return [];
  const has = (s) => existsSync(join(VAULT, ".claude", "commands", s + ".md")) || existsSync(join(VAULT, ".claude", "skills", s));
  return SKILL_GROUPS
    .map((g) => ({ key: g.key, label: g.label, skills: g.skills.filter(has) }))
    .filter((g) => g.skills.length);
}
const ALL_SKILLS = new Set(SKILL_GROUPS.flatMap((g) => g.skills));

// ── 研究院 Arsenal search (built-in skill, independent of the content folder) ───
// 军师 can always search the Research wiki Arsenal via its wiki-search.py tool — a
// read-only Bash call the boundary permits even though it's outside the content dir.
// The tool resolves wiki/ relative to its own location, so an absolute path works.
let ARSENAL_DIR = config.arsenalDir || process.env.JUNSHI_ARSENAL_DIR || "";
let ARSENAL_TOOL = join(ARSENAL_DIR, "tools", "wiki-search.py");
const ARSENAL_SKILL = "arsenal";
const arsenalGroup = () =>
  existsSync(ARSENAL_TOOL) ? [{ key: "arsenal", label: "研究院 · Arsenal", skills: [ARSENAL_SKILL] }] : [];
async function setArsenalDir(dir) {
  ARSENAL_DIR = dir;
  ARSENAL_TOOL = join(ARSENAL_DIR, "tools", "wiki-search.py");
  config.arsenalDir = dir;
  await saveConfig();
}

// A leading "/skill …" (from a tapped pill or typed) is rewritten into an explicit
// instruction to run that skill via the Skill tool — deterministic, not reliant on the
// SDK's slash parser. Only in OS layout (where skills:'all' makes the Skill tool live).
function expandSkillCommand(text) {
  const m = String(text).match(/^\/([a-z][a-z0-9-]*)\b[ \t]*([\s\S]*)$/i);
  if (!m) return text;
  const name = m[1].toLowerCase(), rest = m[2].trim();
  // built-in: 查库 — search the Research Arsenal via wiki-search.py (works in any layout)
  if (name === ARSENAL_SKILL) {
    return `主公要查研究院军火库(Arsenal,只读)。请这样办,然后用一段自然口语中文回答:\n`
      + `1. 用 Bash 跑检索:python "${ARSENAL_TOOL}" <关键词> --json --limit 8 —— 关键词取自主公的查询(中文词照用,可多词)。\n`
      + `2. 看 JSON 命中,用 Read 打开最相关的 2-4 个 wiki 页面(军火库在 "${join(ARSENAL_DIR, "wiki")}")。\n`
      + `3. 结论先行作答,引用页面用 [[slug]];军火库只读,绝不写入。若没命中,直说没有并建议下一步关键词。\n`
      + (rest ? `主公的查询:${rest}` : `(主公还没给关键词 —— 先用一句话问他想查什么。)`);
  }
  if (LAYOUT === "os") {
    if (ALL_SKILLS.has(name)) {
      // known OS skill → explicit Skill-tool instruction (deterministic, no slash parser)
      return `请用「${name}」技能来办这件事:用 Skill 工具调用 ${name} 技能,按它的流程走;缺信息就先简短问主公。`
        + (rest ? `\n主公的要求:${rest}` : "");
    }
    return text; // OS layout: let the SDK resolve real project slash commands (/start-day…)
  }
  // FLAT layout has NO slash commands — a leading "/" makes the SDK treat it as one and,
  // when unresolved, SWALLOW the turn (empty reply, the "no response" bug). Strip the "/"
  // and nudge 军师 so it answers (and notes skills need the OS folder).
  return `(主公点了「${name}」,但当前数据目录没有装技能;把内容文件夹指到 AI Solopreneur OS 才有技能。先按普通请求帮他:)\n`
    + (rest ? `${name} ${rest}` : name);
}

// when an English voice is picked, 军师 answers in English (so the voice fits the words)
const EN_DIRECTIVE = `

[Output language] The 主公 selected an English voice for this turn — reply in natural, spoken
English. Stay 军师: warm strategist, concise, conclusion first. Default to plain spoken prose, but
**use markdown (numbered/bulleted lists, tables, code blocks, bold) when the 主公 asks for it or the
content is clearly structured** — the chat panel renders it and the voice reads a cleaned version. You
may keep proper doctrine names (e.g. 歼灭战) but speak around them in English.`;

// ── sentence segmentation for streaming TTS ───────────────────────────────────
const SENT_END = /[。！？!?；;\n]/;
function pullSentences(buf) {
  // returns { sentences: [...], rest } — complete sentences plus the trailing fragment.
  // Chinese/standalone punctuation ends a sentence; an English "." ends one only when
  // followed by whitespace (so "3.5" or trailing "." mid-stream doesn't split early).
  const out = [];
  let last = 0;
  for (let i = 0; i < buf.length; i++) {
    const isEnd = SENT_END.test(buf[i]) || (buf[i] === "." && i + 1 < buf.length && /\s/.test(buf[i + 1]));
    if (isEnd) {
      const s = buf.slice(last, i + 1).trim();
      if (s) out.push(s);
      last = i + 1;
    }
  }
  return { sentences: out, rest: buf.slice(last) };
}

// strip / humanize anything that shouldn't be read aloud (paths, IDs, URLs, code)
function cleanForTTS(s) {
  return s
    .replace(/\[\[([^\]|]+)(\|[^\]]+)?\]\]/g, "$1")        // [[slug|label]] → text
    .replace(/`[^`]*`/g, "")                                // inline code spans
    .replace(/https?:\/\/\S+/gi, "那个链接")                 // URLs
    .replace(/[A-Za-z]:\\[^\s，。、；：！？]+/g, "那个文件")    // Windows paths
    .replace(/(?:\/[\w.\-]+){2,}\/?/g, "那个路径")           // unix-ish paths (≥2 segments)
    .replace(/\b[A-Za-z0-9_\-]{20,}\b/g, "那个编号")         // long IDs (Sheet IDs, tokens)
    .replace(/[*#`>_~|]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
const SPEAKABLE = /[一-鿿A-Za-z0-9]/;

// ── boundary policy (NO approval gate) — defined in ./policy.js so it's unit-testable
// 军师 may freely edit ONLY inside the Research vault. AIS-OS / "Claude Code - 2nd Brain"
// is READ-ONLY forever; writes there or outside the vault are HARD-DENIED (no prompt).
import { decide } from "./policy.js";

// ── Node TTS via Microsoft Edge Read-Aloud (no Python) ─────────────────────────
// One cached MsEdgeTTS (websocket) per voice; a global lock serializes synthesis
// so concurrent turns never share a socket mid-stream.
const ttsCache = new Map();
let ttsLock = Promise.resolve();
async function getTTS(voice) {
  let t = ttsCache.get(voice);
  if (!t) {
    t = new MsEdgeTTS();
    await t.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3);
    ttsCache.set(voice, t);
  }
  return t;
}
async function synthesizeOne(text, voice, pitch, rate) {
  const clean = cleanForTTS(text);
  if (!SPEAKABLE.test(clean)) return null;
  let t;
  try {
    t = await getTTS(voice);
    const { audioStream } = t.toStream(clean, { pitch, rate });
    const chunks = [];
    return await new Promise((resolve, reject) => {
      audioStream.on("data", (d) => chunks.push(d));
      audioStream.on("end", () => resolve(Buffer.concat(chunks)));
      audioStream.on("error", reject);
    });
  } catch (e) {
    ttsCache.delete(voice); try { t?.close(); } catch {} // drop the socket; next call reconnects
    throw e;
  }
}
function synthesize(text, voice = VOICE, pitch = PITCH, rate = RATE) {
  const run = () => synthesizeOne(text, voice, pitch, rate);
  const p = ttsLock.then(run, run);
  ttsLock = p.then(() => {}, () => {}); // keep the chain alive whatever the outcome
  return p;
}

// ── per-connection turn handler ───────────────────────────────────────────────
async function runTurn(ws, sessions, userText, voice, abort, attachments = [], model = MODEL) {
  const sessionId = sessions.get(ws);
  const signal = abort.signal;
  let buf = "";
  let seq = 0;
  let ctxUsed = 0, ctxWindow = 0; // context-meter: peak input occupancy + model window this turn
  let turnCost = 0;               // this turn's USD (added to the ws running total on done)

  // ── attachments (read once, NOT saved): write each to a temp file outside the
  // vault, point 军师 at it for THIS turn, then delete in the finally below.
  const tmpFiles = [];
  let prompt = expandSkillCommand(userText);
  for (let i = 0; i < attachments.length; i++) {
    const a = attachments[i] || {};
    if (!a.b64) continue;
    const safe = String(a.name || `file${i}`).replace(/[^\w.\-]/g, "_").slice(-64) || `file${i}`;
    const fp = join(tmpdir(), `wcounsel-${Date.now()}-${i}-${safe}`);
    try { await writeFile(fp, Buffer.from(a.b64, "base64")); tmpFiles.push({ fp, name: a.name || safe }); }
    catch (e) { console.error("attach write:", e.message); }
  }
  if (tmpFiles.length) {
    prompt += `\n\n[主公附上了文件,请先用 Read 工具读取后再回答。这些是临时文件,读完即用、不必入库、不要复制进数据目录:\n${tmpFiles.map((f) => `- ${f.name} → ${f.fp}`).join("\n")}\n]`;
  }

  // boundary judge — NO approval gate. Allow everything in research scope;
  // hard-deny only writes/mutations to AIS-OS or outside the vault.
  const canUseTool = async (toolName, input) => {
    const { allow, reason } = decide(toolName, input);
    if (!allow) { console.log(`[perm] DENY ${toolName} :: ${reason}`); return { behavior: "deny", message: reason }; }
    return { behavior: "allow", updatedInput: input };
  };
  // serialize TTS so audio chunks arrive in spoken order
  let ttsChain = Promise.resolve();
  const speak = (sentence) => {
    seq += 1;
    const mySeq = seq;
    ttsChain = ttsChain.then(async () => {
      if (signal.aborted) return; // turn was interrupted by a new prompt — stop synthesizing
      try {
        const mp3 = await synthesize(sentence, voice || VOICE);
        if (mp3 && !signal.aborted && ws.readyState === ws.OPEN) {
          ws.send(JSON.stringify({ type: "audio", seq: mySeq, text: cleanForTTS(sentence), b64: mp3.toString("base64") }));
        }
      } catch (e) {
        console.error("tts error:", e.message);
      }
    });
  };

  try {
    for await (const msg of query({
      prompt,
      options: {
        systemPrompt: SYSTEM_PROMPT + (String(voice || "").startsWith("en-") ? EN_DIRECTIVE : ""),
        cwd: VAULT,
        // full Claude Code toolset (Bash, Read/Write/Edit, Grep/Glob, Web*, Task…),
        // but gated by canUseTool: safe ops run free, risky ops ask the 主公.
        permissionMode: "default",
        canUseTool,
        abortController: abort,   // a new prompt aborts this turn
        includePartialMessages: true,
        maxTurns: 30,
        model,
        // OS layout → expose the OS's skills so pill commands (/caption, …) run them
        ...(LAYOUT === "os" ? { skills: "all" } : {}),
        ...(sessionId ? { resume: sessionId } : {}),
      },
    })) {
      if (signal.aborted) break;
      if (msg.type === "stream_event") {
        const ev = msg.event;
        if (ev.type === "content_block_delta" && ev.delta?.type === "text_delta") {
          const t = ev.delta.text;
          buf += t;
          ws.send(JSON.stringify({ type: "delta", text: t }));
          const { sentences, rest } = pullSentences(buf);
          for (const s of sentences) speak(s);
          buf = rest;
        } else if (ev.type === "message_start" && ev.message?.usage) {
          // context occupancy at this model call = full input sent (fresh + cached)
          const u = ev.message.usage;
          const used = (u.input_tokens || 0) + (u.cache_read_input_tokens || 0) + (u.cache_creation_input_tokens || 0);
          if (used > ctxUsed) ctxUsed = used; // keep the turn's peak
        }
      } else if (msg.type === "assistant") {
        // tool activity → let the UI show 军师 is consulting the arsenal
        for (const block of msg.message.content) {
          if (block.type === "tool_use") {
            const inp = block.input || {};
            const detail =
              inp.command || inp.file_path || inp.pattern || inp.query || inp.path || inp.url || "";
            ws.send(JSON.stringify({ type: "tool", name: block.name, detail: String(detail).slice(0, 120) }));
          }
        }
      } else if (msg.type === "system" && msg.subtype === "compact_boundary") {
        // the SDK auto-summarized to free context → tell the UI (the meter falls next turn)
        const meta = msg.compact_metadata || {};
        ws.send(JSON.stringify({ type: "compacted", trigger: meta.trigger || "auto", pre: meta.pre_tokens, post: meta.post_tokens }));
      } else if (msg.type === "result") {
        sessions.set(ws, msg.session_id); // keep conversation context for next turn
        const mu = msg.modelUsage && Object.values(msg.modelUsage)[0];
        if (mu?.contextWindow) ctxWindow = mu.contextWindow; // real window for the meter denominator
        if (typeof msg.total_cost_usd === "number") turnCost = msg.total_cost_usd; // this turn's USD
      }
    }
    if (!signal.aborted) {
      const tail = buf.trim(); // flush any trailing fragment with no terminal punctuation
      if (tail) speak(tail);
      await ttsChain;
      ws.send(JSON.stringify({ type: "done" }));
      // context meter + running cost — how full the window is + USD spent this council
      try {
        ws._costTotal = (ws._costTotal || 0) + turnCost; // accumulate across the session
        if (ctxUsed > 0 || ws._costTotal > 0) {
          const window = ctxWindow || 200000;
          ws.send(JSON.stringify({
            type: "usage",
            used: ctxUsed, window, pct: Math.round((ctxUsed / window) * 100),
            cost: ws._costTotal,
          }));
        }
      } catch {}
    }
  } catch (e) {
    if (!signal.aborted) { // an aborted turn throwing is expected — stay quiet
      console.error("turn error:", e);
      const authish = /authentic|unauthor|login|credential|api[_ -]?key|oauth|401|403|not logged/i.test(e.message || "");
      const msg = authish
        ? "需要先连接 Claude：点右上 ⚙，经 Claude Code / VS Code 登录，或填 API key。 · Connect Claude first: open ⚙ — sign in via Claude Code / VS Code, or add an API key."
        : e.message;
      ws.send(JSON.stringify({ type: "error", message: msg }));
    }
  } finally {
    // read-once: the attachments never persist — drop the temp copies
    for (const { fp } of tmpFiles) { try { await rm(fp, { force: true }); } catch {} }
  }
}

// ── server ────────────────────────────────────────────────────────────────────
const app = express();
app.use(cors());
app.use(express.json());
app.get("/version", (_req, res) => res.json({ version: PKG.version }));

// auth (P2): status / set key / clear — the key never leaves the server in responses
app.get("/auth/status", (_req, res) => res.json({ hasKey: !!config.anthropicApiKey, mode: authMode() }));
app.post("/auth/key", async (req, res) => {
  const key = String(req.body?.key || "").trim();
  if (!/^sk-ant-/.test(key)) return res.status(400).json({ ok: false, error: "key 格式不对，应以 sk-ant- 开头。" });
  config.anthropicApiKey = key;
  process.env.ANTHROPIC_API_KEY = key;
  await saveConfig();
  res.json({ ok: true, hasKey: true, mode: authMode() });
});
app.post("/auth/clear", async (_req, res) => {
  delete config.anthropicApiKey;
  delete process.env.ANTHROPIC_API_KEY;
  await saveConfig();
  res.json({ ok: true, hasKey: false, mode: authMode() });
});

// content/data dir (P3) — which "arsenal" this install reads/writes
app.get("/content/status", (_req, res) => res.json({ dir: VAULT, layout: LAYOUT }));

// skills (P5) — the categorized skill pills the UI shows. OS skills (when in OS layout)
// + the always-available 研究院 Arsenal search (P8) if its wiki-search tool is present.
app.get("/skills", (_req, res) => res.json({ layout: LAYOUT, groups: [...listSkills(), ...arsenalGroup()] }));
app.post("/content/set", async (req, res) => {
  const dir = String(req.body?.dir || "").trim();
  if (!dir) return res.status(400).json({ ok: false, error: "no dir" });
  await setContentDir(dir);
  res.json({ ok: true, dir: VAULT });
});

// W_Counsel profiles (P6) — saved arsenals for users running more than one console.
// Switching the active one reuses /content/set; this just persists the named list.
app.get("/content/profiles", (_req, res) => res.json({ active: VAULT, profiles: config.profiles || [] }));
app.post("/content/profiles", async (req, res) => {
  const name = String(req.body?.name || "").trim();
  const dir = String(req.body?.dir || "").trim();
  if (!name || !dir) return res.status(400).json({ ok: false, error: "需要名称和文件夹路径 · name and folder both required" });
  if (!existsSync(dir)) return res.status(400).json({ ok: false, error: "找不到该文件夹 · folder not found: " + dir });
  config.profiles = (config.profiles || []).filter((p) => p.dir !== dir); // dedupe by dir
  config.profiles.push({ name, dir });
  await saveConfig();
  res.json({ ok: true, profiles: config.profiles });
});
app.post("/content/profiles/remove", async (req, res) => {
  const dir = String(req.body?.dir || "").trim();
  config.profiles = (config.profiles || []).filter((p) => p.dir !== dir);
  await saveConfig();
  res.json({ ok: true, profiles: config.profiles });
});

// ── sessions (P7) — past councils, persisted on disk by the SDK ────────────────
// listSessions/getSessionMessages/deleteSession read the SDK's own JSONL transcript
// store, so history survives a server restart with no store of our own.
function sessionMsgText(m) {
  const msg = m && m.message;
  if (!msg) return null;
  const role = msg.role || (m.type === "assistant" ? "assistant" : m.type === "user" ? "user" : null);
  if (role !== "user" && role !== "assistant") return null;
  const c = msg.content;
  let text = typeof c === "string" ? c
    : Array.isArray(c) ? c.filter((b) => b && b.type === "text" && typeof b.text === "string").map((b) => b.text).join("")
    : "";
  text = text.trim();
  return text ? { role, text } : null;
}
// cwd is stored with OS-native backslashes + varying case → normalize before matching VAULT
const normPath = (p) => String(p || "").replace(/\\/g, "/").toLowerCase().replace(/\/+$/, "");
app.get("/sessions", async (_req, res) => {
  try {
    const all = await listSessions(); // all projects; we filter to the active arsenal ourselves
    const target = normPath(VAULT);
    const list = (all || [])
      .filter((s) => normPath(s.cwd) === target)
      .sort((a, b) => (b.lastModified || 0) - (a.lastModified || 0))
      .slice(0, 40)
      .map((s) => ({ id: s.sessionId, title: s.customTitle || s.summary || s.firstPrompt || "(无标题 · untitled)", lastModified: s.lastModified }));
    res.json({ sessions: list });
  } catch (e) { res.json({ sessions: [], error: e.message }); }
});
app.get("/session/:id/messages", async (req, res) => {
  try {
    const msgs = await getSessionMessages(req.params.id); // omit dir → search all projects by id
    res.json({ messages: (msgs || []).map(sessionMsgText).filter(Boolean) });
  } catch (e) { res.status(404).json({ messages: [], error: e.message }); }
});
app.post("/session/delete", async (req, res) => {
  const id = String(req.body?.id || "").trim();
  if (!id) return res.status(400).json({ ok: false, error: "no id" });
  try { await deleteSession(id); res.json({ ok: true }); }
  catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// 查库 Arsenal folder (P8) — where the 研究院 wiki + wiki-search.py live.
// `available` = the tool is present (so the 查库 pill works for that folder).
app.get("/arsenal", (_req, res) => res.json({ dir: ARSENAL_DIR, available: existsSync(ARSENAL_TOOL) }));
app.post("/arsenal", async (req, res) => {
  const dir = String(req.body?.dir || "").trim();
  if (!dir) return res.status(400).json({ ok: false, error: "需要文件夹路径 · folder path required" });
  if (!existsSync(dir)) return res.status(400).json({ ok: false, error: "找不到该文件夹 · folder not found: " + dir });
  await setArsenalDir(dir);
  res.json({ ok: true, dir: ARSENAL_DIR, available: existsSync(ARSENAL_TOOL) });
});

app.use(express.static(join(__dirname, "public")));

const server = createServer(app);
const wss = new WebSocketServer({ server });
const sessions = new Map(); // ws → sessionId

wss.on("connection", (ws) => {
  console.log("client connected");
  ws._abort = null;             // AbortController of the in-flight turn (if any)
  ws._chain = Promise.resolve(); // serializes turn bodies so they never overlap
  ws.on("message", (raw) => {
    let data;
    try { data = JSON.parse(raw.toString()); } catch { return; }

    if (data.type === "ask" && typeof data.text === "string" && data.text.trim()) {
      // a new prompt INTERRUPTS the current turn (move-on), then runs after it unwinds
      if (ws._abort) { try { ws._abort.abort(); } catch {} }
      const text = data.text.trim(), voice = data.voice;
      const model = (data.model === "opus" || data.model === "sonnet") ? data.model : MODEL;
      const attachments = Array.isArray(data.attachments) ? data.attachments : [];
      ws._chain = ws._chain.then(async () => {
        const abort = new AbortController();
        ws._abort = abort;
        ws.send(JSON.stringify({ type: "thinking" }));
        try { await runTurn(ws, sessions, text, voice, abort, attachments, model); } catch {}
        if (ws._abort === abort) ws._abort = null;
      });
    } else if (data.type === "stop") {
      // STOP — abort the in-flight turn entirely (thinking + work), no new prompt
      if (ws._abort) { try { ws._abort.abort(); } catch {} ws._abort = null; }
      ws.send(JSON.stringify({ type: "stopped" }));
    } else if (data.type === "reset") {
      if (ws._abort) { try { ws._abort.abort(); } catch {} }
      ws._costTotal = 0; // fresh council → reset the running cost
      ws._chain = ws._chain.then(() => { sessions.delete(ws); ws.send(JSON.stringify({ type: "reset_ok" })); });
    } else if (data.type === "resume") {
      // reopen a past council — bind this connection to that session id; next ask resumes it
      const id = String(data.id || "").trim();
      if (id) {
        if (ws._abort) { try { ws._abort.abort(); } catch {} }
        ws._costTotal = 0; // historical cost unknown → start the readout fresh
        ws._chain = ws._chain.then(() => { sessions.set(ws, id); ws.send(JSON.stringify({ type: "resumed", id })); });
      }
    }
  });
  ws.on("close", () => { if (ws._abort) { try { ws._abort.abort(); } catch {} } sessions.delete(ws); console.log("client disconnected"); });
});

await mkdir(join(__dirname, "public", "models"), { recursive: true });
server.listen(PORT, () => {
  console.log(`\n  军师 listening → http://localhost:${PORT}`);
  console.log(`  vault: ${VAULT}  (layout: ${LAYOUT === "os" ? "AI Solopreneur OS" : "flat starter"})`);
  console.log(`  voice: ${VOICE} (pitch ${PITCH}, rate ${RATE})   model: ${MODEL}   tts: Node/msedge-tts (no Python)`);
  console.log(`  scope: edits ONLY in vault · AIS-OS read-only · NO approval gate`);
  console.log(`  auth:  ${authMode()}\n`);
});
