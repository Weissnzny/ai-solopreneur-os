// Deterministic proof of the HARD boundary layer (the real decide() from policy.js).
import { decide, setEditableRoot } from "./policy.js";

const ROOT = "C:\\path\\to\\your-vault"; // pretend this is the user's data dir
setEditableRoot(ROOT);
const AIS = "C:\\path\\to\\AIS-OS";

const cases = [
  ["Write", { file_path: AIS + "\\x.txt" }, false, "Write into AIS-OS → DENY"],
  ["Write", { file_path: ROOT + "\\raw\\note.txt" }, true, "Write inside data dir → ALLOW"],
  ["Write", { file_path: "raw\\rel.txt" }, true, "Write relative (→data dir) → ALLOW"],
  ["Edit", { file_path: ROOT + "\\wiki\\overview.md" }, true, "Edit inside data dir → ALLOW"],
  ["Write", { file_path: "C:\\some\\other-dir\\x.txt" }, false, "Write outside data dir → DENY"],
  ["Bash", { command: 'rm -rf "' + AIS + '\\y"' }, false, "Bash delete in AIS-OS → DENY"],
  ["PowerShell", { command: 'Remove-Item -Recurse "' + AIS + '\\z"' }, false, "PowerShell delete in AIS-OS → DENY"],
  ["Bash", { command: 'cat "' + AIS + '\\read-me.md"' }, true, "Bash READ from AIS-OS → ALLOW"],
  ["Bash", { command: 'echo hi > raw\\note.txt' }, true, "Bash write in data dir → ALLOW"],
  ["Read", { file_path: AIS + "\\anything" }, true, "Read AIS-OS → ALLOW"],
];

let pass = 0, fail = 0;
for (const [tool, input, exp, note] of cases) {
  const { allow } = decide(tool, input);
  const ok = allow === exp;
  ok ? pass++ : fail++;
  console.log(`${ok ? "✓" : "✗ FAIL"}  ${note}  (allow=${allow})`);
}
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
