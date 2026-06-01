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

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
let errors = 0, warnings = 0;
const fail = (m) => { console.error("  [FAIL] " + m); errors++; };
const warn = (m) => { console.warn("  [warn] " + m); warnings++; };
const ok   = (m) => console.log("  [ok]   " + m);

// ---- walk the repo, skipping noise ----
const SKIP = new Set(["node_modules", ".git", "output", "tmp"]);
function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const p = join(dir, name);
    const s = statSync(p);
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

// ---- summary ----
console.log(`\n${errors ? "FAILED" : "PASSED"} - ${errors} error(s), ${warnings} warning(s).`);
process.exit(errors ? 1 : 0);
