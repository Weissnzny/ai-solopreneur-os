// Boundary policy for 军师 — the HARD enforcement layer (independent of the model).
// 军师 may freely edit ONLY inside the user's data dir (the "editable root", set at
// runtime by the server) + its own app dir. Writes anywhere else are hard-denied.
// The AIS-OS / "Claude Code - 2nd Brain" tree is additionally always read-only.
// There is NO approval gate.
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const APP_L = __dirname.toLowerCase().replace(/\//g, "\\");
const FORBIDDEN_MARK = "claude code - 2nd brain"; // AIS-OS lives under here (always read-only)

// The editable root is the user's data dir; the server sets it via setEditableRoot().
let EDIT_ROOT = (process.env.JUNSHI_VAULT || "").toLowerCase().replace(/\//g, "\\");
export function setEditableRoot(dir) { EDIT_ROOT = String(dir || "").toLowerCase().replace(/\//g, "\\"); }

const READONLY_TOOLS = new Set([
  "Read", "Grep", "Glob", "WebSearch", "WebFetch", "TodoWrite", "Task",
  "BashOutput", "NotebookRead", "ListMcpResources", "ReadMcpResource",
]);
// tokens that mean a shell command would CREATE / CHANGE / DELETE something
const MUTATE = /(^|\s)(rm|rmdir|del|erase|rd|move|mv|cp|copy|ren|rename|md|mkdir|touch|tee|new-item|set-content|add-content|clear-content|out-file|remove-item|copy-item|move-item)(\s|$)|>>?/i;

const normPath = (p) => String(p || "").replace(/\//g, "\\").toLowerCase();
const isAbs = (p) => /^[a-z]:\\/.test(p);
const resolveP = (p) => { const n = normPath(p); return isAbs(n) ? n : ((EDIT_ROOT || APP_L) + "\\" + n.replace(/^\\+/, "")); };
const inEditableScope = (p) => { const n = resolveP(p); return (EDIT_ROOT && n.startsWith(EDIT_ROOT)) || n.startsWith(APP_L); };
const touchesForbidden = (text) => normPath(text).includes(FORBIDDEN_MARK) || /\bais[-_ ]?os\b/i.test(String(text));

// returns { allow: bool, reason: string }
export function decide(tool, input = {}) {
  const t = tool || "";
  if (READONLY_TOOLS.has(t)) return { allow: true, reason: "" };

  // file-mutating tools → only inside the vault, NEVER AIS-OS / outside
  if (["Write", "Edit", "MultiEdit", "NotebookEdit"].includes(t)) {
    const fp = input.file_path || input.notebook_path || "";
    if (touchesForbidden(fp)) return { allow: false, reason: "AIS-OS / 第二大脑只读 — 军师绝不在此写入。" };
    if (!inEditableScope(fp)) return { allow: false, reason: "军师只可编辑主公的数据目录内的文件;此路径在其之外,拒绝。" };
    return { allow: true, reason: "" };
  }

  // command tools → run freely, EXCEPT a command that would MUTATE the AIS-OS tree
  if (/bash|powershell|shell|exec|\bcmd\b|terminal|command|^run/i.test(t) || "command" in input || "script" in input) {
    const cmd = String(input.command ?? input.script ?? "");
    if (touchesForbidden(cmd) && MUTATE.test(cmd)) {
      return { allow: false, reason: "命令试图改动 AIS-OS / 第二大脑 — 该处只读,拒绝。" };
    }
    return { allow: true, reason: "" }; // no approval gate within the research scope
  }

  // KillShell / unknown tools → allowed (no gate); file writes are already bounded above
  return { allow: true, reason: "" };
}
