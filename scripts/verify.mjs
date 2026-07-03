#!/usr/bin/env node
// ============================================================
//  AI Solopreneur OS - publish gate
//  Run:  node scripts/verify.mjs
//  Checks, before you publish:
//   1. No leaked secrets / private IDs / personal absolute paths
//   2. No orphaned {{ONBOARD: ...}} placeholders outside onboarding/intake.md
//   3. Every command shim maps to a shipped skill, and vice versa
//  Exits non-zero if any hard check fails.
// ============================================================
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
let errors = 0, warnings = 0;
const fail = (m) => { console.error("  [FAIL] " + m); errors++; };
const warn = (m) => { console.warn("  [warn] " + m); warnings++; };
const ok   = (m) => console.log("  [ok]   " + m);

// ---- walk the repo, skipping noise ----
// Skip build/runtime dirs and browser-debug artifacts. Some (like .gstack) throw
// EPERM on scandir, so the walk is guarded — a skipped/unreadable dir must never
// crash the gate before the leak scan runs.
const SKIP = new Set(["node_modules", ".git", "output", "tmp", ".gstack", ".playwright-mcp", ".cache"]);
function walk(dir, acc = []) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    warn(`could not read ${relative(ROOT, dir) || dir} — skipped`);
    return acc;
  }
  for (const name of entries) {
    if (SKIP.has(name)) continue;
    const p = join(dir, name);
    let s;
    try { s = statSync(p); } catch { continue; }
    if (s.isDirectory()) walk(p, acc);
    else acc.push(p);
  }
  return acc;
}
// this scanner necessarily contains the leak patterns + the {{ONBOARD}} token, so it skips itself
const SELF = join(ROOT, "scripts", "verify.mjs");
const files = walk(ROOT)
  .filter(p => p !== SELF)
  .filter(p => /\.(md|mjs|js|json|css|cmd|ps1|txt|html?|svg|yml|yaml)$/i.test(p) || p.endsWith("LICENSE"));

// ---- 1. secret / private-leak scan ----
console.log("\n1. Secret & private-data scan");
const LEAKS = [
  [/\bAKIA[0-9A-Z]{16}\b/, "AWS access key"],
  [/\bsk-[A-Za-z0-9]{20,}\b/, "OpenAI-style secret key"],
  [/\bsk-ant-[A-Za-z0-9-]{20,}\b/, "Anthropic API key"],
  [/\bghp_[A-Za-z0-9]{30,}\b/, "GitHub token"],
  [/\bya29\.[A-Za-z0-9_-]{20,}\b/, "Google OAuth token"],
  [/1Z473ybLY3Kp9QYJ3aWbxlZ1LVdrvDg3qqKSdZHIAzVQ/, "private Command Center sheet ID"],
  [/d5a28a35-?26da-?4654/, "private Notion DB ID"],
  [/C:\\\\Users\\\\Weiss/i, "personal absolute path (C:\\Users\\Weiss)"],
  [/C:\/Users\/Weiss/i, "personal absolute path (C:/Users/Weiss)"],
  [/\bclients\//, "reference to a private clients/ folder"],
  [/Claude Code - 2nd Brain/, "reference to the private workspace"],
  [/\bAIS-OS\b/, "reference to the private AIS-OS workspace"],
  [/\.\.\/AIS-OS/, "relative path escaping into the private workspace"],
];
let leakHits = 0;
for (const f of files) {
  const rel = relative(ROOT, f);
  const text = readFileSync(f, "utf8");
  for (const [re, label] of LEAKS) {
    if (re.test(text)) { fail(`${label} found in ${rel}`); leakHits++; }
  }
}
if (!leakHits) ok("no secrets, private IDs, or personal paths found");

// ---- 2. orphaned placeholders ----
console.log("\n2. Placeholder coverage");
let ph = 0;
for (const f of files) {
  const rel = relative(ROOT, f);
  if (rel.replace(/\\/g, "/") === "onboarding/intake.md") continue; // intended to hold {{ONBOARD}}
  if (/\{\{ONBOARD:/.test(readFileSync(f, "utf8"))) { warn(`{{ONBOARD}} placeholder left in ${rel}`); ph++; }
}
if (!ph) ok("no stray {{ONBOARD}} placeholders outside onboarding/intake.md");

// ---- 3. command <-> skill parity ----
console.log("\n3. Command <-> skill parity");
const skillsDir = join(ROOT, ".claude", "skills");
const cmdDir = join(ROOT, ".claude", "commands");
const skills = existsSync(skillsDir)
  ? readdirSync(skillsDir).filter(d => existsSync(join(skillsDir, d, "SKILL.md")))
  : [];
const cmds = existsSync(cmdDir)
  ? readdirSync(cmdDir).filter(f => f.endsWith(".md")).map(f => f.replace(/\.md$/, ""))
  : [];
// aliases that intentionally map onto another skill
const ALIAS = { "start-day": "daily-routine", "shutdown": "daily-routine" };
for (const c of cmds) {
  const target = ALIAS[c] || c;
  if (!skills.includes(target)) fail(`command /${c} has no shipped skill (expected skills/${target}/SKILL.md)`);
}
for (const s of skills) {
  if (!cmds.includes(s)) warn(`skill /${s} has no command shim in .claude/commands/`);
}
ok(`${skills.length} skills, ${cmds.length} command shims checked`);

// ---- 4. no debug / junk artifacts tracked by git ----
// The publish surface is what git TRACKS, not what's on disk. This is the check
// that would have caught the .playwright-mcp logs + root calendar-status.png that
// once shipped. Skipped silently if git isn't available (e.g. a downloaded ZIP).
console.log("\n4. Tracked-file hygiene (git)");
let tracked = [];
try {
  tracked = execSync("git ls-files", { cwd: ROOT, encoding: "utf8" })
    .split("\n").map(s => s.trim()).filter(Boolean);
} catch { tracked = null; }
if (tracked === null) {
  ok("git not available — skipped (nothing to check in a ZIP download)");
} else {
  const JUNK = [
    [/(^|\/)\.playwright-mcp\//, "browser-debug artifact (.playwright-mcp/)"],
    [/(^|\/)\.gstack\//, "gstack scratch dir"],
    [/(^|\/)console-\d.*\.log$/, "browser console log"],
    [/^[^/]+\.png$/, "stray image at repo root (belongs in an assets folder)"],
    [/(^|\/)\.env$/, "committed .env (secrets must never ship)"],
  ];
  // known-good root images the OS intentionally ships
  const ROOT_PNG_OK = new Set([]);
  let junk = 0;
  for (const rel of tracked) {
    for (const [re, label] of JUNK) {
      if (re.test(rel)) {
        if (ROOT_PNG_OK.has(rel)) continue;
        fail(`${label}: ${rel}`); junk++;
      }
    }
  }
  if (!junk) ok(`${tracked.length} tracked files clean — no debug/junk artifacts`);
}

// ---- summary ----
console.log(`\n${errors ? "FAILED" : "PASSED"} - ${errors} error(s), ${warnings} warning(s).`);
process.exit(errors ? 1 : 0);
