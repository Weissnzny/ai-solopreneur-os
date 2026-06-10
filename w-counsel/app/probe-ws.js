import { WebSocket } from "ws";
const ws = new WebSocket("ws://localhost:5174");
const counts = {};
ws.on("open", () => {
  console.log("probe connected; asking…");
  ws.send(JSON.stringify({ type: "ask", text: "用十个字以内回答:你是谁?" }));
});
ws.on("message", (raw) => {
  const m = JSON.parse(raw.toString());
  counts[m.type] = (counts[m.type] || 0) + 1;
  if (m.type === "audio") console.log(`  audio seq=${m.seq} bytes(b64)=${m.b64.length} text="${m.text}"`);
  if (m.type === "error") console.log("  ERROR:", m.message);
  if (m.type === "done") {
    console.log("counts:", JSON.stringify(counts));
    ws.close(); process.exit(0);
  }
});
ws.on("error", (e) => { console.error("probe err:", e.message); process.exit(1); });
setTimeout(() => { console.log("timeout. counts:", JSON.stringify(counts)); process.exit(1); }, 40000);
