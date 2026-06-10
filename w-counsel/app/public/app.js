/* 军师 frontend — sprite 诸葛亮 + Web Speech STT + streamed TTS playback w/ audio-driven motion */

const $ = (id) => document.getElementById(id);
const transcript = $("transcript");
const chip = $("status-chip");

function setChip(text, cls) {
  chip.textContent = text;
  chip.className = cls || "";
}
// keyed status chip — remembers the current state so a language switch can repaint it
let booted = false;
let chipState = { key: null, cls: "" };
function setChipK(key, cls) { chipState = { key, cls: cls || "" }; setChip(T(key), cls); }
function repaintChip() { if (chipState.key) setChip(T(chipState.key), chipState.cls); }

// ── context-window meter — how full the model's context is (reset reminder) ──────
// Visual only: amber ≥50%, red+pulse ≥80%. The 主公 presses ↺ to start a fresh局.
let lastCtxPct = null; // remembered so a language switch can repaint the label/title
function updateCtxMeter(pct) {
  const m = $("ctx-meter"); if (!m) return;
  pct = Math.max(0, Math.min(100, pct | 0));
  lastCtxPct = pct;
  m.classList.remove("hidden");
  m.dataset.pct = pct;
  const lvl = pct >= 80 ? "danger" : pct >= 50 ? "warn" : "ok";
  m.className = "ctx-meter " + lvl;
  const fill = m.querySelector(".ctx-fill"); if (fill) fill.style.width = pct + "%";
  const lab = m.querySelector(".ctx-label"); if (lab) lab.textContent = T("ctx_label") + pct + "%";
  m.title = pct >= 80
    ? T("ctx_title_full")
    : T("ctx_title_used_pre") + pct + T("ctx_title_used_suf");
}
function repaintCtxMeter() { if (lastCtxPct != null) updateCtxMeter(lastCtxPct); }
function resetCtxMeter() {
  const m = $("ctx-meter"); if (!m) return;
  lastCtxPct = null;
  m.className = "ctx-meter hidden"; m.dataset.pct = 0;
  const fill = m.querySelector(".ctx-fill"); if (fill) fill.style.width = "0%";
}

// ── running cost — USD spent in this council (resets on a fresh round) ───────────
function updateCost(usd) {
  const e = $("cost-readout"); if (!e || typeof usd !== "number") return;
  e.classList.remove("hidden");
  e.textContent = "$" + (usd < 1 ? usd.toFixed(3) : usd.toFixed(2));
  e.title = T("cost_title");
}
function resetCost() {
  const e = $("cost-readout"); if (!e) return;
  e.textContent = "$0.000"; e.classList.add("hidden");
}
function addMsg(text, who) {
  const div = document.createElement("div");
  div.className = `msg ${who}`;
  const txt = document.createElement("span");
  txt.className = "msg-text";
  txt.textContent = text;
  div.appendChild(txt);
  div._text = txt; // content lives here; streaming/tool html target this node
  if (who === "me" || who === "junshi") {
    const btn = document.createElement("button");
    btn.className = "edit-btn"; btn.title = T("edit_t"); btn.textContent = "✎";
    btn.onclick = (e) => { e.stopPropagation(); beginEdit(div); };
    div.appendChild(btn);
  }
  transcript.appendChild(div);
  transcript.scrollTop = transcript.scrollHeight;
  return div;
}

// edit a message in place. Saving a 'me' message re-sends it (军师 re-answers);
// saving a 军师 message just keeps the corrected text.
function beginEdit(div) {
  const txt = div._text; if (!txt) return;
  const isMe = div.classList.contains("me");
  // edit the RAW text (markdown source for 军师 bubbles), not the rendered HTML
  const original = div._raw != null ? div._raw : txt.textContent;
  const restore = (text) => { if (!isMe && div._raw != null) { div._raw = text; txt.innerHTML = renderMarkdown(text); } else { txt.textContent = text; } };
  txt.textContent = original; // show plain source while editing
  div.classList.add("editing");
  txt.setAttribute("contenteditable", "true");
  txt.focus();
  const sel = getSelection(); sel.selectAllChildren(txt); sel.collapseToEnd();
  let settled = false;
  const finish = (commit) => {
    if (settled) return; settled = true;
    txt.setAttribute("contenteditable", "false");
    div.classList.remove("editing");
    txt.removeEventListener("blur", onBlur);
    txt.removeEventListener("keydown", onKey);
    const next = txt.textContent.trim();
    if (!commit) { restore(original); return; }
    if (!next) { restore(original); return; }
    if (isMe && next !== original) ask(next, true); // re-send corrected question (no dup bubble)
    else restore(next); // 军师 edit (or unchanged me) → keep corrected text, re-rendered
  };
  const onBlur = () => finish(true);
  const onKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); finish(true); }
    else if (e.key === "Escape") { e.preventDefault(); finish(false); }
  };
  txt.addEventListener("blur", onBlur);
  txt.addEventListener("keydown", onKey);
}

// ── light markdown for 军师 bubbles (XSS-safe, dependency-free) ──────────────────
// Voice is unaffected (cleanForTTS is server-side). Streaming stays plain text;
// the finished bubble is re-rendered on `done`. We escape HTML FIRST, then apply a
// small, safe subset (bold/italic/code/links/lists/headings), so injected markup
// can never execute.
function escapeHtml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function inlineMd(s) {
  // s is already HTML-escaped. Protect inline code, then format, then restore.
  const codes = [];
  s = s.replace(/`([^`]+)`/g, (_m, c) => { codes.push(c); return "" + (codes.length - 1) + ""; });
  s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (_m, t, u) => `<a href="${u}" target="_blank" rel="noopener">${t}</a>`);
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/__([^_]+)__/g, "<strong>$1</strong>");
  s = s.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, "$1<em>$2</em>");
  s = s.replace(/(\d+)/g, (_m, i) => `<code>${codes[i]}</code>`);
  return s;
}
function renderMarkdown(text) {
  const lines = escapeHtml(text == null ? "" : text).split("\n");
  const out = [];
  let inFence = false, fence = [], listType = null, items = [];
  const closeList = () => {
    if (!listType) return;
    out.push(`<${listType}>` + items.map((li) => `<li>${inlineMd(li)}</li>`).join("") + `</${listType}>`);
    listType = null; items = [];
  };
  const cells = (row) => row.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());
  for (let i = 0; i < lines.length; i++) {
    const ln = lines[i];
    if (/^```/.test(ln)) {
      if (inFence) { out.push(`<pre><code>${fence.join("\n")}</code></pre>`); fence = []; inFence = false; }
      else { closeList(); inFence = true; }
      continue;
    }
    if (inFence) { fence.push(ln); continue; }
    // table: a |…| row immediately followed by a |---|---| separator row
    if (/^\s*\|.*\|\s*$/.test(ln) && i + 1 < lines.length && /^[\s|:\-]+$/.test(lines[i + 1]) && lines[i + 1].includes("-")) {
      closeList();
      const head = cells(ln);
      const body = [];
      i += 2; // skip header + separator
      while (i < lines.length && /^\s*\|.*\|\s*$/.test(lines[i])) { body.push(cells(lines[i])); i++; }
      i--; // step back; the for-loop will ++
      out.push(
        `<table class="md-table"><thead><tr>${head.map((c) => `<th>${inlineMd(c)}</th>`).join("")}</tr></thead>`
        + `<tbody>${body.map((r) => `<tr>${r.map((c) => `<td>${inlineMd(c)}</td>`).join("")}</tr>`).join("")}</tbody></table>`
      );
      continue;
    }
    const h = ln.match(/^(#{1,6})\s+(.*)$/);
    const ul = ln.match(/^\s*[-*]\s+(.*)$/);
    const ol = ln.match(/^\s*\d+\.\s+(.*)$/);
    if (h) { closeList(); out.push(`<div class="md-h">${inlineMd(h[2])}</div>`); continue; }
    if (ul) { if (listType !== "ul") { closeList(); listType = "ul"; } items.push(ul[1]); continue; }
    if (ol) { if (listType !== "ol") { closeList(); listType = "ol"; } items.push(ol[1]); continue; }
    closeList();
    if (ln.trim() === "") { out.push("<br>"); continue; }
    out.push(`<div>${inlineMd(ln)}</div>`);
  }
  if (inFence) out.push(`<pre><code>${fence.join("\n")}</code></pre>`);
  closeList();
  return out.join("");
}
// render a finished 军师 bubble as markdown, keeping the raw text for editing
function renderBubble(div) {
  if (!div || !div._text) return;
  const raw = div._raw != null ? div._raw : div._text.textContent;
  div._raw = raw;
  div._text.innerHTML = renderMarkdown(raw);
}

// ── 3D voxel 军师 (Three.js) — palette from the Character Board Kit ──────────────
let mouthTarget = 0; // 0..1 loudness from audio (drives head-nod / energy)
let mouthValue = 0;  // smoothed
const avatarEl = $("avatar");

const MOODS = ["neutral", "thinking", "focused", "confident"];
let moodResetTimer = null;
function setMood(m) {
  if (!avatarEl) return; // masthead now shows the brand logo; mood is carried by the 3D figure
  if (!MOODS.includes(m)) m = "neutral";
  avatarEl.src = `/models/zhuge/expr_${m}.png`;
}

// 3D figure: directional billboard built from the board's 4 turnaround renders.
// The plane always faces the camera and shows whichever real render matches the
// orbit angle → every frame is the board's own art (≈ the reference, not a remake).
let scene, camera, renderer, controls, figureMesh, figureB;
let usingModel = null, modelFeetY = 0, modelBaseScale = 1; // set when a real .glb is loaded
const VIEW_ORDER = ["front", "right", "back", "left"];
const views = {};
let curView = "front";
let fading = false, fadeT = 0, incomingView = null;
const FADE = 0.22; // seconds — crossfade between turnaround views

function makeBlobShadow() {
  const c = document.createElement("canvas"); c.width = c.height = 128;
  const g = c.getContext("2d");
  const grd = g.createRadialGradient(64, 64, 3, 64, 64, 62);
  grd.addColorStop(0, "rgba(0,0,0,0.5)"); grd.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = grd; g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c); return t;
}

function viewForAzimuth(az) {
  // az in radians; 0 = camera directly in front (+Z). Going CCW.
  const d = (az * 180 / Math.PI + 360) % 360;
  if (d <= 45 || d > 315) return "front";
  if (d <= 135) return "right";
  if (d <= 225) return "back";
  return "left";
}

function initThree() {
  const wrap = $("stage-wrap");
  const canvas = $("three3d");
  if (!window.THREE) { console.warn("three.js not loaded"); return; }

  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

  camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(0, 2.7, 12.5);

  // lights (ignored by the unlit billboard; used when a real .glb model loads)
  scene.add(new THREE.AmbientLight(0xc4cede, 0.85));
  const key = new THREE.DirectionalLight(0xfff1da, 1.05);
  key.position.set(4, 9, 7); scene.add(key);
  const rim = new THREE.DirectionalLight(0xc9a227, 0.6);
  rim.position.set(-6, 5, -6); scene.add(rim);

  // load the 4 turnaround renders as textures
  const loader = new THREE.TextureLoader();
  for (const v of VIEW_ORDER) {
    const t = loader.load(`/models/zhuge/turn_${v}.png`);
    t.magFilter = THREE.NearestFilter; // crisp voxel edges
    t.minFilter = THREE.LinearMipmapLinearFilter;
    views[v] = t;
  }

  // figure billboard — two stacked planes so views can crossfade (no hard pop).
  // textures are pre-shaded → unlit MeshBasic; depthWrite off so the pair blends.
  const ASPECT = 116 / 273, Hf = 5.0, Wf = Hf * ASPECT;
  const geo = new THREE.PlaneGeometry(Wf, Hf);
  figureMesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: views.front, transparent: true, depthWrite: false }));
  figureMesh.position.set(0, Hf / 2, 0);
  scene.add(figureMesh);
  figureB = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: views.front, transparent: true, depthWrite: false, opacity: 0 }));
  figureB.position.set(0, 0, 0.02); // slightly in front, inherits transform as a child
  figureB.visible = false;
  figureMesh.add(figureB);

  // If a real 3D model is present at /models/zhuge/zhuge.glb, use it instead of
  // the billboard — true volumetric figure, smooth at every angle.
  if (THREE.GLTFLoader) {
    new THREE.GLTFLoader().load(
      "/models/zhuge/zhuge.glb",
      (gltf) => {
        const model = gltf.scene;
        const b1 = new THREE.Box3().setFromObject(model);
        const size = b1.getSize(new THREE.Vector3());
        modelBaseScale = 5.2 / size.y;
        model.scale.setScalar(modelBaseScale); // fit to ~5.2 units tall
        const b2 = new THREE.Box3().setFromObject(model);
        const c = b2.getCenter(new THREE.Vector3());
        model.position.x -= c.x; model.position.z -= c.z;
        model.position.y -= b2.min.y; // feet on the ground
        model.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
        scene.add(model);
        figureMesh.visible = false; figureB.visible = false;
        usingModel = model; modelFeetY = model.position.y;
        controls.target.set(0, 2.6, 0);
        console.log("GLB model loaded → true 3D 军师.");
      },
      undefined,
      () => { /* no zhuge.glb yet → keep the turnaround billboard */ }
    );
  }

  // soft contact shadow on the ground
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(Wf * 1.6, Wf * 1.0),
    new THREE.MeshBasicMaterial({ map: makeBlobShadow(), transparent: true, depthWrite: false })
  );
  shadow.rotation.x = -Math.PI / 2; shadow.position.y = 0.02;
  scene.add(shadow);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 2.6, 0);
  controls.enableDamping = true; controls.dampingFactor = 0.08;
  controls.enablePan = false;
  controls.minDistance = 7; controls.maxDistance = 16;
  controls.maxPolarAngle = Math.PI * 0.56; controls.minPolarAngle = Math.PI * 0.30;
  controls.autoRotate = true; controls.autoRotateSpeed = 0.9;
  controls.addEventListener("start", () => { controls.autoRotate = false; });

  const resize = () => {
    const w = wrap.clientWidth, h = wrap.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
  };
  resize();
  window.addEventListener("resize", resize);

  const baseH = Hf / 2;
  let lastT = 0;
  function animate(t) {
    requestAnimationFrame(animate);
    const time = t * 0.001;
    const dt = Math.min(0.05, (t - lastT) / 1000 || 0); lastT = t;
    mouthValue += (mouthTarget - mouthValue) * 0.3;

    if (usingModel) {
      // real 3D model: gentle breathing bob + speaking swell; camera orbits it
      usingModel.position.y = modelFeetY + Math.sin(time * 1.6) * 0.045 + mouthValue * 0.10;
      usingModel.scale.setScalar(modelBaseScale * (1 + Math.sin(time * 1.6) * 0.008 + mouthValue * 0.025));
    } else {
      // turnaround billboard
      figureMesh.position.y = baseH + Math.sin(time * 1.6) * 0.05 + mouthValue * 0.12;
      const s = 1 + Math.sin(time * 1.6) * 0.006 + mouthValue * 0.03;
      figureMesh.scale.set(s, s, 1);
      // face the camera (upright)
      const dx = camera.position.x - figureMesh.position.x;
      const dz = camera.position.z - figureMesh.position.z;
      figureMesh.rotation.set(0, Math.atan2(dx, dz), 0);
      // pick matching turnaround view → crossfade in
      const want = viewForAzimuth(Math.atan2(dx, dz));
      if (want !== curView && !fading) {
        incomingView = want;
        figureB.material.map = views[want]; figureB.material.opacity = 0;
        figureB.visible = true; fading = true; fadeT = 0;
      }
      if (fading) {
        fadeT += dt;
        const k = Math.min(1, fadeT / FADE);
        figureB.material.opacity = k;
        figureMesh.material.opacity = 1 - k;
        if (k >= 1) {
          figureMesh.material.map = views[incomingView]; figureMesh.material.opacity = 1;
          figureB.visible = false; figureB.material.opacity = 0;
          curView = incomingView; fading = false;
        }
      }
    }
    controls.update();
    renderer.render(scene, camera);
  }
  requestAnimationFrame(animate);
  window.__three = { camera, controls, get view() { return curView; } };
  console.log("3D 军师 (turnaround billboard) ready.");
}

// ── audio playback queue with lip-sync ─────────────────────────────────────────
let audioCtx = null;
let analyser = null;
const playQueue = [];
let playing = false;
let currentSource = null;   // the AudioBufferSource now playing
let speechStopped = false;  // 主公 hit "stop speech" → mute rest of this turn (agent keeps working)

// Stop the VOICE only — clears the queue, halts current playback, ignores further
// audio this turn. Does NOT touch the WebSocket / agent: 军师 keeps thinking & working.
function stopSpeech() {
  speechStopped = true;
  playQueue.length = 0;
  if (currentSource) { try { currentSource.onended = null; currentSource.stop(); } catch {} currentSource = null; }
  playing = false; mouthTarget = 0;
  document.getElementById("stage-wrap")?.classList.remove("speaking");
  document.getElementById("hush")?.classList.add("active");
}

function ensureAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 512;
    analyser.connect(audioCtx.destination);
  }
  if (audioCtx.state === "suspended") audioCtx.resume();
}

function b64ToArrayBuffer(b64) {
  const bin = atob(b64);
  const len = bin.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = bin.charCodeAt(i);
  return bytes.buffer;
}

async function enqueueAudio(b64) {
  if (speechStopped) return; // voice muted for this turn
  ensureAudio();
  try {
    const buf = await audioCtx.decodeAudioData(b64ToArrayBuffer(b64));
    window.__audioOk = (window.__audioOk || 0) + 1;
    if (speechStopped) return;
    playQueue.push(buf);
    if (!playing) playNext();
  } catch (e) {
    console.error("decode error:", e);
  }
}

function playNext() {
  if (speechStopped || playQueue.length === 0) {
    playing = false; mouthTarget = 0; currentSource = null;
    document.getElementById("stage-wrap")?.classList.remove("speaking");
    return;
  }
  playing = true;
  document.getElementById("stage-wrap")?.classList.add("speaking");
  setMood("focused"); // 军师 speaking
  const buf = playQueue.shift();
  const src = audioCtx.createBufferSource();
  currentSource = src;
  src.buffer = buf;
  src.connect(analyser);
  src.onended = () => { if (currentSource === src) currentSource = null; playNext(); };
  src.start();
}

// continuously sample loudness → mouth target while audio flows
const td = new Uint8Array(256);
function mouthLoop() {
  if (analyser && playing) {
    analyser.getByteTimeDomainData(td);
    let sum = 0;
    for (let i = 0; i < td.length; i++) { const v = (td[i] - 128) / 128; sum += v * v; }
    const rms = Math.sqrt(sum / td.length); // ~0..0.5
    mouthTarget = Math.min(1, rms * 3.2);
  } else if (!playing) {
    mouthTarget = 0;
  }
  requestAnimationFrame(mouthLoop);
}
requestAnimationFrame(mouthLoop);

// ── WebSocket to 军师 ──────────────────────────────────────────────────────────
let ws = null;
let currentReplyDiv = null;

// 军师 "thinking" indicator — spinning taiji + ink dots + cycling strategy phase
let thinkingEl = null, thinkingTimer = null;
function addThinking() {
  removeThinking();
  const el = document.createElement("div");
  el.className = "thinking";
  const phases = T("think_phases");
  el.innerHTML = `<span class="taiji">☯</span><span>${T("think_pre")}<span class="ph">${phases[0]}</span>${T("think_suf")}<span class="dots"><span>·</span><span>·</span><span>·</span></span></span>`;
  transcript.appendChild(el);
  transcript.scrollTop = transcript.scrollHeight;
  let i = 0; const ph = el.querySelector(".ph");
  thinkingTimer = setInterval(() => { i = (i + 1) % phases.length; if (ph) ph.textContent = phases[i]; }, 1400);
  thinkingEl = el;
}
function removeThinking() {
  if (thinkingTimer) { clearInterval(thinkingTimer); thinkingTimer = null; }
  if (thinkingEl) { thinkingEl.remove(); thinkingEl = null; }
}

function connect() {
  ws = new WebSocket(`ws://${location.host}`);
  ws.onopen = () => setChipK("chip_live", "live");
  ws.onclose = () => { setChipK("chip_reconnect"); setTimeout(connect, 1500); };
  ws.onerror = () => setChipK("chip_connerr");
  ws.onmessage = (ev) => {
    const m = JSON.parse(ev.data);
    switch (m.type) {
      case "thinking":
        setChipK("chip_thinking", "thinking");
        clearTimeout(moodResetTimer);
        setMood("thinking");
        addThinking();
        showStop(true);
        currentReplyDiv = null;
        break;
      case "delta":
        if (!currentReplyDiv) { removeThinking(); currentReplyDiv = addMsg("", "junshi"); }
        currentReplyDiv._text.textContent += m.text;
        transcript.scrollTop = transcript.scrollHeight;
        break;
      case "tool": {
        const verb = T("verbs")[m.name] || T("verb_default");
        const div = addMsg("", "tool");
        div._text.innerHTML = `⚙ ${verb} · ${m.name}` + (m.detail ? ` <span class="det">${m.detail.replace(/</g, "&lt;")}</span>` : "");
        if (thinkingEl) transcript.appendChild(thinkingEl); // keep the spinner at the bottom
        transcript.scrollTop = transcript.scrollHeight;
        break;
      }
      case "audio":
        window.__audioRecv = (window.__audioRecv || 0) + 1;
        enqueueAudio(m.b64);
        break;
      case "confirm":
        renderConfirm(m);
        break;
      case "confirm_timeout":
        document.getElementById("cf-" + m.id)?.remove();
        break;
      case "done":
        removeThinking();
        setChipK("chip_live", "live");
        showStop(false);
        if (currentReplyDiv) renderBubble(currentReplyDiv); // markdown-render the finished reply
        currentReplyDiv = null;
        setMood("confident"); // a beat of confidence, then settle
        clearTimeout(moodResetTimer);
        moodResetTimer = setTimeout(() => setMood("neutral"), 3000);
        break;
      case "stopped":
        removeThinking();
        setChipK("chip_live", "live");
        showStop(false);
        currentReplyDiv = null;
        clearTimeout(moodResetTimer); setMood("neutral");
        break;
      case "usage":
        updateCtxMeter(m.pct);
        updateCost(m.cost);
        break;
      case "resumed":
        repaintSession(m.id); // server bound this connection to the council → repaint its transcript
        break;
      case "compacted":
        addMsg(T("msg_compacted"), "tool");
        break;
      case "reset_ok":
        removeThinking();
        showStop(false);
        transcript.innerHTML = "";
        resetCtxMeter(); resetCost(); // fresh局 → empty context + zeroed cost
        addMsg(T("msg_reset"), "junshi");
        break;
      case "error":
        removeThinking();
        setChipK("chip_live", "live");
        showStop(false);
        addMsg("⚠ " + m.message, "tool");
        break;
    }
  };
}

function renderConfirm(m) {
  setChipK("chip_await", "thinking");
  const card = document.createElement("div");
  card.className = "confirm";
  card.id = "cf-" + m.id;
  const reply = (approved) => {
    if (ws?.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ type: "confirm_result", id: m.id, approved }));
    card.querySelectorAll("button").forEach((b) => (b.disabled = true));
    card.classList.add(approved ? "approved" : "denied");
    card.querySelector(".verdict").textContent = approved ? T("cf_yes_v") : T("cf_no_v");
  };
  card.innerHTML = `
    <div class="cf-head">⚠ ${T("cf_head")} · <b>${m.tool}</b> <span class="verdict"></span></div>
    <div class="cf-body"></div>
    <div class="cf-btns"><button class="ok">${T("cf_ok")}</button><button class="no">${T("cf_no")}</button></div>`;
  card.querySelector(".cf-body").textContent = m.summary || "";
  card.querySelector(".ok").onclick = () => reply(true);
  card.querySelector(".no").onclick = () => reply(false);
  transcript.appendChild(card);
  transcript.scrollTop = transcript.scrollHeight;
  // keyboard: Y / N while a confirm is pending
  const onKey = (e) => {
    if (card.querySelector(".ok").disabled) { window.removeEventListener("keydown", onKey); return; }
    if (e.key === "y" || e.key === "Y") { reply(true); window.removeEventListener("keydown", onKey); }
    if (e.key === "n" || e.key === "N") { reply(false); window.removeEventListener("keydown", onKey); }
  };
  window.addEventListener("keydown", onKey);
}

function ask(text, silent = false) {
  text = text.trim();
  if (!text || !ws || ws.readyState !== WebSocket.OPEN) return;
  ensureAudio(); // unlock audio on user gesture
  speechStopped = false; // a new turn → voice un-muted
  document.getElementById("hush")?.classList.remove("active");
  const atts = pendingAttachments.slice(); // read-once: attached only to this turn
  if (!silent) {
    const div = addMsg(text, "me"); // silent = re-send from an edited bubble (no duplicate)
    if (atts.length) {
      const note = document.createElement("div");
      note.className = "msg-attach";
      note.textContent = "📎 " + atts.map((a) => a.name).join("、");
      div.appendChild(note);
    }
  }
  const voice = document.getElementById("voice")?.value;
  ws.send(JSON.stringify({ type: "ask", text, voice, model: curModel, attachments: atts.map((a) => ({ name: a.name, b64: a.b64 })) }));
  pendingAttachments = []; renderAttachBar(); // files are not kept after sending
}

// ── text input (multi-line, auto-grow) ──────────────────────────────────────────
const input = $("text-input");
function autoGrow() { input.style.height = "46px"; input.style.height = Math.min(160, input.scrollHeight) + "px"; }
function clearInput() { input.value = ""; autoGrow(); }
function sendInput() { ask(input.value); clearInput(); }

$("send").onclick = sendInput;
input.addEventListener("input", autoGrow);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendInput(); } // Shift+Enter = newline
});
$("reset").onclick = () => { ensureAudio(); ws?.send(JSON.stringify({ type: "reset" })); };

// ── stop-speech-only (does NOT stop 军师 thinking/working) ───────────────────────
$("hush").onclick = stopSpeech;
window.addEventListener("keydown", (e) => { if (e.key === "Escape") stopSpeech(); });

// ── STOP (does stop 军师 thinking/working) — aborts the whole in-flight turn ──────
const stopBtn = $("stop");
function showStop(on) { stopBtn?.classList.toggle("hidden", !on); }
function doStop() {
  if (ws?.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ type: "stop" }));
  stopSpeech();            // also halt any queued/playing voice for this turn
  removeThinking();
  setChipK("chip_live", "live");
  showStop(false);
  currentReplyDiv = null;
  clearTimeout(moodResetTimer); setMood("neutral");
}
if (stopBtn) stopBtn.onclick = doStop;

// ── attachments (read once, not saved) — 📎 → file picker → chips → sent with ask ──
let pendingAttachments = []; // [{ name, b64, size }]
const fileInput = $("file-input");
function fileToB64(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(",")[1] || "");
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}
function renderAttachBar() {
  const bar = $("attach-bar"); if (!bar) return;
  bar.innerHTML = "";
  if (!pendingAttachments.length) { bar.classList.add("hidden"); return; }
  bar.classList.remove("hidden");
  pendingAttachments.forEach((a, i) => {
    const chip = document.createElement("span");
    chip.className = "attach-chip";
    chip.innerHTML = `📎 <span class="an"></span> <button class="x" title="${T("attach_remove_t")}">✕</button>`;
    chip.querySelector(".an").textContent = a.name;
    chip.querySelector(".x").onclick = () => { pendingAttachments.splice(i, 1); renderAttachBar(); };
    bar.appendChild(chip);
  });
}
if (fileInput) {
  $("attach").onclick = () => fileInput.click();
  fileInput.onchange = async () => {
    for (const f of Array.from(fileInput.files || [])) {
      if (f.size > 15 * 1024 * 1024) { alert(T("file_too_big") + f.name); continue; }
      try { pendingAttachments.push({ name: f.name, b64: await fileToB64(f), size: f.size }); }
      catch { alert(T("file_read_fail") + f.name); }
    }
    fileInput.value = ""; // allow re-picking the same file later
    renderAttachBar();
  };
}

// ── editable conversation: double-click a message (or its ✎ button) to edit ──────
transcript.addEventListener("dblclick", (e) => {
  const msg = e.target.closest(".msg");
  if (msg && (msg.classList.contains("me") || msg.classList.contains("junshi"))) beginEdit(msg);
});

// ── Web Speech STT (zh-CN) — true toggle: listen through pauses, send only on toggle-off ──
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
const micBtn = $("mic");
let recog = null;
let listening = false;   // user has toggled talk ON
let manualStop = false;  // user toggled OFF (vs. browser auto-ending on a pause)
let committed = "";      // finalized text accumulated across auto-restarts
let sessionFinal = "";   // finalized text within the current recognition session

function toggleTalk() {
  if (!recog) return;
  ensureAudio();
  if (listening) stopTalk();
  else startTalk();
}
function startTalk(seed = "") {
  // seed lets a tapped skill pill keep its "/command " prefix while you speak the rest
  committed = seed || ""; sessionFinal = ""; manualStop = false; listening = true;
  // immediate feedback the instant the key is pressed (don't wait for onstart)
  micBtn.classList.add("recording");
  setChipK("chip_listening", "thinking");
  $("text-input").value = committed;
  $("text-input").placeholder = T("composer_ph_listening");
  autoGrow();
  try { recog.lang = sttLang(); } catch {} // ensure the current language before this dictation
  try { recog.start(); }
  catch { try { recog.stop(); } catch {}; setTimeout(() => { try { recog.start(); } catch {} }, 150); }
}
function stopTalk() {
  if (!listening) return;
  manualStop = true; listening = false; // onend finalizes & sends; clearing here avoids a stuck state
  micBtn.classList.remove("recording");
  setChipK("chip_live", "live");
  try { recog.stop(); } catch {}
}

if (SR) {
  recog = new SR();
  recog.lang = "zh-CN";
  recog.interimResults = true;
  recog.continuous = true; // keep going through short pauses

  recog.onstart = () => { micBtn.classList.add("recording"); $("text-input").placeholder = T("composer_ph_listening"); };

  recog.onresult = (e) => {
    sessionFinal = ""; let interim = "";
    for (let i = 0; i < e.results.length; i++) {
      const r = e.results[i];
      if (r.isFinal) sessionFinal += r[0].transcript;
      else interim += r[0].transcript;
    }
    $("text-input").value = (committed + sessionFinal + interim).trim();
    autoGrow();
  };

  recog.onerror = (e) => {
    console.warn("STT error:", e.error);
    if (e.error === "not-allowed" || e.error === "service-not-allowed" || e.error === "audio-capture") {
      listening = false; manualStop = true; // unrecoverable → don't loop-restart
      micBtn.classList.remove("recording");
      setChipK("chip_mic_unavail", "");
      addMsg(T("msg_mic_fail"), "tool");
    }
    // 'no-speech' / 'aborted' are normal; onend handles continuation
  };

  recog.onend = () => {
    committed += sessionFinal; sessionFinal = "";
    if (listening && !manualStop) {
      // browser auto-stopped on a pause/time-limit — keep the session alive
      try { recog.start(); } catch {}
      return;
    }
    // user actually toggled off → finalize & send. Use the visible box text
    // (committed + any trailing interim already rendered there) so nothing is lost.
    listening = false; manualStop = false;
    micBtn.classList.remove("recording");
    $("text-input").placeholder = T("composer_ph_or");
    const t = ($("text-input").value || committed).trim(); committed = "";
    if (t) { ask(t); clearInput(); }
  };

  micBtn.onclick = toggleTalk;
  window.__stt = { recog, startTalk, stopTalk, get listening() { return listening; }, get committed() { return committed; } };
} else {
  micBtn.onclick = () => alert(T("mic_unsupported"));
  micBtn.style.opacity = 0.5;
}

// ── Alt+V toggle-to-talk (press once to start, press again to stop & send) ───────
window.addEventListener("keydown", (e) => {
  if (e.altKey && (e.key === "v" || e.key === "V")) {
    if (!recog) return;
    e.preventDefault();
    toggleTalk();
  }
});

// ── connect-your-Claude (P2): account login (Pro/Max) primary; user picks language ──
const I18N = {
  zh: {
    // ── settings / connect-Claude modal ──
    title: "连接 Claude", desc: "军师用你自己的 Claude 运行。两种干净的接入方式，选一个：",
    login: "经 Claude Code / VS Code 登录", done: "完成", adv: "改用 API key", save: "用此 key", clear: "清除", link: "→ 获取 API key",
    guideSum: "如何登录? · 指引",
    guide: "<b>方式一(推荐)：用你自己的 Claude 登录</b><br>1. 安装 <b>Claude Code</b>(claude.ai/code)，或 VS Code 的 Claude 扩展。<br>2. 在其中用你自己的 Claude 账号登录：终端运行 <code>claude</code> 再输 <code>/login</code>。<br>3. 回到这里 —— 军师即借该登录运行，用你的订阅，不另计费。<br><br><b>方式二：用 API key</b> —— 见下方“改用 API key”。",
    st_account: "用你自己的 Claude 登录运行(经 Claude Code / VS Code)", st_key: "已连接：API key", st_set: "✓ 将用你 Claude Code / VS Code 的登录",
    st_setting: "设置中…", st_connecting: "连接中…", st_connected: "已连接：API key ✓", st_needkey: "请先粘贴 key",
    st_cleared: "已清除，回到账号登录", st_fail: "连接失败",
    profSum: "W_Counsel 档案 · 切换军火库", profAdd: "添加档案", profNeed: "请填名称和文件夹路径",
    profSwitching: "切换中…", profSwitched: "✓ 已切到", profAdded: "✓ 已添加", profActive: "当前：",
    arsenalSum: "🏯 查库路径 · Arsenal folder", arsenalSave: "指向此处", arsenalSaving: "保存中…",
    arsenalOk: "✓ 已指向", arsenalNoTool: "已保存,但此文件夹没有 wiki-search.py(查库不可用)", arsenalNow: "当前查库：",
    prof_remove_t: "移除此档案 · remove", prof_name_ph: "名称 · name (e.g. Brand A)", prof_dir_ph: "文件夹路径 · folder path",
    arsenal_dir_ph: "研究院 wiki 文件夹 · Arsenal folder", prof_current: "（当前 · current）",
    // ── masthead / chrome ──
    sub: "研究院 · 军火库已就位",
    lang_btn_t: "语言 · switch to English", hist_btn_t: "历史军议 · past councils", settings_btn_t: "设置 · 连接 Claude",
    skills_toggle: "⚔ 技能", skills_toggle_t: "技能 / Skills", skill_search: "搜索技能 · search",
    orbit_hint: "拖动旋转 · 滚轮缩放", voice_label: "声线",
    attach_t: "附上文件 — 文档 / PDF / 图片(只读这一轮,不保存)", mic_t: "点击说话 · 或按 Alt+V 开始/结束",
    composer_ph: "对军师说话…", stop_t: "停止 — 打断军师思考办事(Ctrl/Esc·Esc 只停语音)",
    hush_t: "只停语音 — 军师继续思考办事(Esc)", send_t: "发送 (Enter)", reset_t: "新的一局",
    hint: "<kbd>Alt</kbd>+<kbd>V</kbd> 说话(再按结束) · <kbd>Enter</kbd> 发送 · 📎 附文件(只读一轮) · ⏹ 停止思考 · 🔇/<kbd>Esc</kbd> 只停语音 · ✎ 编辑(改我的话会重发)",
    hist_title: "历史军议 · Past councils", hist_close_t: "关闭 · close",
    // ── status chip states ──
    chip_connecting: "连接中…", chip_live: "军师在席", chip_reconnect: "连接断开,重连中…", chip_connerr: "连接错误",
    chip_thinking: "军师沉思中…", chip_await: "军师候令…", chip_listening: "聆听中… 再按 Alt+V 结束",
    chip_mic_unavail: "麦克风不可用 — 请允许权限或直接打字",
    // ── 军师 thinking indicator ──
    think_pre: "军师", think_suf: "中", think_phases: ["运筹", "推演", "权衡", "谋断", "调阅"],
    // ── tool verbs ──
    verbs: { Bash: "执行", Write: "落笔", Edit: "修订", Read: "研读", Grep: "搜检", Glob: "查列", WebSearch: "上网查", WebFetch: "取页", Task: "调度" },
    verb_default: "调阅军火库",
    // ── confirm card ──
    cf_head: "军师请示", cf_ok: "准 (Y)", cf_no: "否 (N)", cf_yes_v: "✓ 已准", cf_no_v: "✕ 已否",
    // ── transcript system messages ──
    msg_compacted: "（军师整理了这局军议,腾出上下文继续。 · Compacted — context freed, continuing.）",
    msg_reset: "（新的一局。主公请讲。）",
    msg_resumed: "（已接上这局军议,主公请继续。 · Resumed this council.）",
    msg_greeting: "主公,军师在此。按 Alt+V 对我说话(再按一次结束),或打字 —— 我不止能调阅研究院的军火库为你谋断,也能动手办事(写文件、跑命令、上网查证)。",
    msg_mic_fail: "⚠ 麦克风无法启动(权限被拒或无录音设备)。点浏览器地址栏的 🔒 允许麦克风,或直接打字。",
    // ── misc runtime ──
    edit_t: "编辑", attach_remove_t: "移除", recent_lbl: "最近 · recent",
    composer_ph_listening: "聆听中…(再按 Alt+V 结束并发送)", composer_ph_or: "对军师说话,或在此输入… (Enter 发送)",
    file_too_big: "文件过大(上限 15MB)：", file_read_fail: "读取失败：", mic_unsupported: "此浏览器不支持语音识别,请用 Chrome / Edge,或直接打字。",
    ctx_label: "上下文 ", ctx_title_full: "上下文将满 — 军师会自动整理(压缩)续谈,或按 ↺ 开新局 · Filling — auto-compacts to continue, or ↺ for a fresh start",
    ctx_title_used_pre: "已用上下文 ", ctx_title_used_suf: "% · context used", cost_title: "本局累计花费 · spent this council",
    model_opus_title: "深谋 Opus — 更深的推演(较慢)。点击切回 ⚡ Sonnet", model_sonnet_title: "快议 Sonnet — 更快的语音对话。点击切到 🧠 Opus 深谋",
    ago_min: " 分钟前", ago_hr: " 小时前", ago_day: " 天前",
    hist_loading: "载入中… · loading", hist_failed: "加载失败 · failed", hist_empty: "暂无历史军议 · no past councils",
    hist_untitled: "(无标题 · untitled)", hist_del_t: "删除 · delete",
  },
  en: {
    // ── settings / connect-Claude modal ──
    title: "Connect Claude", desc: "W_Counsel runs on your own Claude. Two clean ways — pick one:",
    login: "Sign in via Claude Code / VS Code", done: "Done", adv: "Use an API key instead", save: "Use key", clear: "Clear", link: "→ Get an API key",
    guideSum: "How to sign in? · Guide",
    guide: "<b>Option 1 (recommended): use your own Claude login</b><br>1. Install <b>Claude Code</b> (claude.ai/code), or the Claude extension in VS Code.<br>2. Sign in there with your own Claude account: run <code>claude</code>, then <code>/login</code>.<br>3. Come back — W_Counsel uses that sign-in; your subscription, no extra billing.<br><br><b>Option 2: API key</b> — see “Use an API key” below.",
    st_account: "Using your own Claude login (via Claude Code / VS Code)", st_key: "Connected via API key", st_set: "✓ Will use your Claude Code / VS Code sign-in",
    st_setting: "Setting up…", st_connecting: "Connecting…", st_connected: "Connected via API key ✓", st_needkey: "Paste a key first",
    st_cleared: "Cleared — back to account login", st_fail: "Connection failed",
    profSum: "W_Counsel profiles · switch arsenal", profAdd: "Add profile", profNeed: "Enter a name and a folder path",
    profSwitching: "Switching…", profSwitched: "✓ Switched to", profAdded: "✓ Added", profActive: "Active: ",
    arsenalSum: "🏯 Arsenal folder (查库)", arsenalSave: "Point here", arsenalSaving: "Saving…",
    arsenalOk: "✓ Pointed to", arsenalNoTool: "Saved, but this folder has no wiki-search.py (查库 unavailable)", arsenalNow: "Current: ",
    prof_remove_t: "Remove this profile", prof_name_ph: "Name (e.g. Brand A)", prof_dir_ph: "Folder path",
    arsenal_dir_ph: "Arsenal folder (research wiki)", prof_current: "(current) ",
    // ── masthead / chrome ──
    sub: "Academy · arsenal in place",
    lang_btn_t: "Language · 切换到中文", hist_btn_t: "Past councils", settings_btn_t: "Settings · connect Claude",
    skills_toggle: "⚔ Skills", skills_toggle_t: "Skills / 技能", skill_search: "Search skills",
    orbit_hint: "Drag to rotate · scroll to zoom", voice_label: "Voice",
    attach_t: "Attach a file — doc / PDF / image (read this turn only, not saved)", mic_t: "Tap to talk · or press Alt+V to start/stop",
    composer_ph: "Speak to W_Counsel…", stop_t: "Stop — interrupt W_Counsel's thinking/work (Ctrl/Esc · Esc stops voice only)",
    hush_t: "Stop voice only — W_Counsel keeps thinking/working (Esc)", send_t: "Send (Enter)", reset_t: "New council",
    hint: "<kbd>Alt</kbd>+<kbd>V</kbd> talk (press again to end) · <kbd>Enter</kbd> send · 📎 attach (one turn only) · ⏹ stop thinking · 🔇/<kbd>Esc</kbd> stop voice only · ✎ edit (editing your line re-sends)",
    hist_title: "Past councils · 历史军议", hist_close_t: "Close",
    // ── status chip states ──
    chip_connecting: "Connecting…", chip_live: "Counsel in session", chip_reconnect: "Disconnected, reconnecting…", chip_connerr: "Connection error",
    chip_thinking: "W_Counsel is deliberating…", chip_await: "Awaiting your word…", chip_listening: "Listening… press Alt+V to end",
    chip_mic_unavail: "Mic unavailable — allow permission or just type",
    // ── 军师 thinking indicator ──
    think_pre: "Counsel ", think_suf: "…", think_phases: ["planning", "wargaming", "weighing", "deciding", "consulting"],
    // ── tool verbs ──
    verbs: { Bash: "Run", Write: "Write", Edit: "Edit", Read: "Read", Grep: "Search", Glob: "List", WebSearch: "Web search", WebFetch: "Fetch", Task: "Dispatch" },
    verb_default: "Consult arsenal",
    // ── confirm card ──
    cf_head: "W_Counsel asks", cf_ok: "Approve (Y)", cf_no: "Deny (N)", cf_yes_v: "✓ Approved", cf_no_v: "✕ Denied",
    // ── transcript system messages ──
    msg_compacted: "(Compacted — context freed, continuing. · 军师整理了这局军议,腾出上下文继续。)",
    msg_reset: "(New council. Speak, my lord.)",
    msg_resumed: "(Resumed this council — continue, my lord. · 已接上这局军议。)",
    msg_greeting: "My lord — W_Counsel is here. Press Alt+V to speak to me (press again to end), or just type. I can not only consult the arsenal to advise you, but also act: write files, run commands, and verify things online.",
    msg_mic_fail: "⚠ Mic could not start (permission denied or no recording device). Click the 🔒 in the address bar to allow the mic, or just type.",
    // ── misc runtime ──
    edit_t: "Edit", attach_remove_t: "Remove", recent_lbl: "Recent",
    composer_ph_listening: "Listening… (press Alt+V to end and send)", composer_ph_or: "Speak to W_Counsel, or type here… (Enter to send)",
    file_too_big: "File too large (max 15MB): ", file_read_fail: "Failed to read: ", mic_unsupported: "This browser doesn't support speech recognition — use Chrome / Edge, or just type.",
    ctx_label: "Context ", ctx_title_full: "Context filling — W_Counsel auto-compacts to continue, or press ↺ for a fresh start",
    ctx_title_used_pre: "Context ", ctx_title_used_suf: "% used", cost_title: "Spent this council",
    model_opus_title: "Opus — deeper reasoning (slower). Click to switch back to ⚡ Sonnet", model_sonnet_title: "Sonnet — faster voice chat. Click to switch to 🧠 Opus for deeper counsel",
    ago_min: " min ago", ago_hr: " h ago", ago_day: " d ago",
    hist_loading: "Loading…", hist_failed: "Failed to load", hist_empty: "No past councils yet",
    hist_untitled: "(untitled)", hist_del_t: "Delete",
  },
};
let lang = localStorage.getItem("junshi-lang") || ((navigator.language || "").toLowerCase().startsWith("zh") ? "zh" : "en");
let lastAuth = "account"; // 'account' | 'key'
const T = (k) => (I18N[lang] || I18N.zh)[k];
const keyModal = $("key-modal");
const showKeyModal = () => keyModal.classList.remove("hidden");
const hideKeyModal = () => keyModal.classList.add("hidden");
function setKeyStatus(t, cls) { const e = $("key-status"); e.textContent = t || ""; e.className = cls || ""; }
function renderAuthStatus() { setKeyStatus(lastAuth === "key" ? T("st_key") : T("st_account"), lastAuth === "key" ? "ok" : ""); }
// default speaking voice per UI language; a manual pick (saved) overrides this.
const LANG_VOICE = { zh: "zh-CN-YunyangNeural", en: "en-US-GuyNeural" };
// speech-recognition language follows the UI language (was hardcoded zh-CN → EN dictation mis-heard)
const sttLang = () => (lang === "en" ? "en-US" : "zh-CN");
function setVoice(v) {
  const s = $("voice"); if (!s || !v) return;
  if ([...s.options].some((o) => o.value === v)) { s.value = v; localStorage.setItem("junshi-voice", v); }
}
function applyLang(l, fromUser = false) {
  lang = l === "en" ? "en" : "zh";
  localStorage.setItem("junshi-lang", lang);
  document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  document.querySelectorAll(".lang-toggle button").forEach((b) => b.classList.toggle("on", b.dataset.lang === lang));
  const lb = $("lang-btn"); if (lb) lb.textContent = lang === "zh" ? "EN" : "中文";
  if (fromUser) setVoice(LANG_VOICE[lang]); // picking a language at setup sets the default voice
  // sweep: every element tagged with a data-i18n* attribute is repainted from the dictionary
  document.querySelectorAll("[data-i18n]").forEach((el) => { const v = T(el.dataset.i18n); if (v != null) el.textContent = v; });
  document.querySelectorAll("[data-i18n-html]").forEach((el) => { const v = T(el.dataset.i18nHtml); if (v != null) el.innerHTML = v; });
  document.querySelectorAll("[data-i18n-ph]").forEach((el) => { const v = T(el.dataset.i18nPh); if (v != null) el.setAttribute("placeholder", v); });
  document.querySelectorAll("[data-i18n-title]").forEach((el) => { const v = T(el.dataset.i18nTitle); if (v != null) el.setAttribute("title", v); });
  // dynamic surfaces the sweep can't reach
  try { if (recog) recog.lang = sttLang(); } catch {} // dictation language follows the UI language
  renderAuthStatus();                                  // key-status line (depends on auth state)
  if (typeof renderModelToggle === "function") renderModelToggle(); // ⚡/🧠 tooltip
  repaintChip();                                       // current status chip
  repaintCtxMeter();                                   // context meter label/title if shown
  const cost = $("cost-readout"); if (cost) cost.title = T("cost_title");
  if (booted && loadedGroups.length) loadSkills();     // rebuild skill-tray labels/tooltips in the new language
}
document.querySelectorAll(".lang-toggle button").forEach((b) => (b.onclick = () => applyLang(b.dataset.lang, true)));
$("lang-btn") && ($("lang-btn").onclick = () => applyLang(lang === "zh" ? "en" : "zh", true));
$("voice")?.addEventListener("change", (e) => localStorage.setItem("junshi-voice", e.target.value));

// ── model depth toggle: ⚡ Sonnet (fast voice) ↔ 🧠 Opus (deep counsel) — sent per ask ──
const MODEL_LABEL = { sonnet: "⚡ Sonnet", opus: "🧠 Opus" };
let curModel = localStorage.getItem("junshi-model");
if (curModel !== "opus" && curModel !== "sonnet") curModel = "sonnet";
function renderModelToggle() {
  const b = $("model-toggle"); if (!b) return;
  b.textContent = MODEL_LABEL[curModel];
  b.dataset.model = curModel;
  b.title = curModel === "opus" ? T("model_opus_title") : T("model_sonnet_title");
}
$("model-toggle") && ($("model-toggle").onclick = () => {
  curModel = curModel === "opus" ? "sonnet" : "opus";
  localStorage.setItem("junshi-model", curModel);
  renderModelToggle();
});
renderModelToggle();

async function refreshAuth() {
  try {
    const s = await (await fetch("/auth/status")).json();
    lastAuth = s.hasKey ? "key" : "account";
    renderAuthStatus();
    if (!s.hasKey && !localStorage.getItem("junshi-auth-seen")) { showKeyModal(); localStorage.setItem("junshi-auth-seen", "1"); } // first run only
  } catch {}
}
$("settings-btn").onclick = showKeyModal;
$("key-skip").onclick = hideKeyModal;
// Primary — use your own Claude account (Pro/Max): clears any API key → account login.
$("key-login").onclick = async () => {
  setKeyStatus(T("st_setting"), "");
  try { await fetch("/auth/clear", { method: "POST" }); } catch {}
  lastAuth = "account";
  setKeyStatus(T("st_set"), "ok");
  setTimeout(hideKeyModal, 1200);
};
// Advanced — bring your own API key
$("key-save").onclick = async () => {
  const key = $("key-input").value.trim();
  if (!key) { setKeyStatus(T("st_needkey"), "err"); return; }
  setKeyStatus(T("st_connecting"), "");
  try {
    const r = await fetch("/auth/key", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key }) });
    const d = await r.json();
    if (d.ok) { lastAuth = "key"; setKeyStatus(T("st_connected"), "ok"); $("key-input").value = ""; setTimeout(hideKeyModal, 800); }
    else setKeyStatus(d.error || T("st_fail"), "err");
  } catch { setKeyStatus(T("st_fail"), "err"); }
};
$("key-clear").onclick = async () => {
  try { await fetch("/auth/clear", { method: "POST" }); lastAuth = "account"; setKeyStatus(T("st_cleared"), ""); $("key-input").value = ""; } catch {}
};
applyLang(lang); // populate the modal text in the chosen language

// ── skill pills (OS layout only): ⚔ toggle → category tabs → pixel pills ─────────
// Closed by default (a ⚔ 技能 toggle summons the tray). Tap a category to reveal its
// pills; tap a pill to drop "/command " into the composer, focus it, and tidy up —
// then 主公 types or speaks (Alt+V) the rest and hits Enter.
const SKILL_EMOJI = {
  content: "📝", "content-plan": "🗓️", caption: "✍️", carousel: "🎠",
  "video-script": "🎬", storyboard: "🎞️", thumbnail: "🖼️", copywriting: "🖊️",
  "writing-beats": "📖", humanize: "💬",
  "marketing-psychology": "🎯", "system-map": "🗺️", "system-check": "🩺",
  "kick-off": "🚀", brain: "🧠", "find-skill": "🔍", "daily-routine": "☀️",
  arsenal: "🏯",
};
// display label override (pill text); the command slug stays in `s`. Bilingual → resolved by current lang.
const SKILL_LABEL_I18N = { arsenal: { zh: "查库", en: "Arsenal" } };
const SKILL_LABEL = new Proxy(SKILL_LABEL_I18N, { get: (o, k) => (o[k] ? (o[k][lang] || o[k].zh) : undefined) });
// short hover blurbs — what each pillar / skill is for (shown as a tooltip on hover)
const GROUP_DESC_I18N = {
  campaign: { zh: "战 · 出内容、打仗的技能 — 脚本、轮播、文案、封面", en: "Campaign · content & battle skills — scripts, carousels, copy, covers" },
  "the-way": { zh: "道 · 把字写成人话、立住声音的技能", en: "The Way · make words human, hold your voice" },
  knowing: { zh: "知 · 看清局面、给系统体检的技能", en: "Knowing · read the situation, health-check the system" },
  formation: { zh: "阵 · 搭系统、排日程、入门上手的技能", en: "Formation · build systems, schedule, get started" },
  arsenal: { zh: "研究院 · 搜索你的知识军火库(wiki),带出处回答", en: "Arsenal · search your knowledge wiki, answer with sources" },
};
const SKILL_DESC_I18N = {
  content: { zh: "一个主题，跑过内容部门，产出各平台成品", en: "One topic → run the content dept → finished pieces per platform" },
  "content-plan": { zh: "规划一周内容主题，可推上日历", en: "Plan a week of content topics, push to the calendar" },
  caption: { zh: "为一条内容写各平台贴文（TT/IG/FB/LinkedIn/小红书）", en: "Write platform posts for a piece (TT/IG/FB/LinkedIn/RED)" },
  carousel: { zh: "把脚本或主题做成 8 张 4:5 轮播图", en: "Turn a script or topic into an 8-slide 4:5 carousel" },
  "video-script": { zh: "40 秒竖屏短视频脚本（创始人笔记式）", en: "40-sec vertical video script (Founder-Notes style)" },
  storyboard: { zh: "把脚本拆成逐镜头的 AI 出图提示", en: "Break a script into shot-by-shot AI image prompts" },
  thumbnail: { zh: "封面设计简报 + 各版位提示词", en: "Thumbnail design brief + prompts per placement" },
  copywriting: { zh: "网页文案 — 首页、落地页、定价页", en: "Web copy — homepage, landing, pricing" },
  "writing-beats": { zh: "把素材拼成一篇“逐拍”长文", en: "Assemble material into a beat-by-beat long-form piece" },
  humanize: { zh: "去掉 AI 腔，改成你的声音", en: "Strip the AI tone, rewrite in your voice" },
  "marketing-psychology": { zh: "用心理学与思维模型拆营销难题", en: "Crack marketing problems with psychology & mental models" },
  "system-map": { zh: "一眼看清整套 OS 的节点图", en: "See the whole OS at a glance — node map" },
  "system-check": { zh: "给 OS 体检打分，给出前三个修补点", en: "Health-check the OS, score it, top-3 fixes" },
  "kick-off": { zh: "首次上手 — 填档案、采集你的声音样本", en: "First-time setup — fill profile, capture your voice sample" },
  brain: { zh: "第二大脑面板 — 任务、晨规划、晚收工", en: "Second-brain panel — tasks, morning plan, evening shutdown" },
  "find-skill": { zh: "从可信市场找现成的技能装上", en: "Find & install a ready-made skill from trusted markets" },
  "daily-routine": { zh: "每日开工/收工的编排：晨起→出货→社群→跟进", en: "Daily start/shutdown: morning → ship → community → follow-ups" },
  arsenal: { zh: "查库 — 搜索研究院军火库(wiki),用 wiki-search 带出处回答", en: "Arsenal — search the wiki via wiki-search, answer with sources" },
};
const GROUP_DESC = new Proxy(GROUP_DESC_I18N, { get: (o, k) => (o[k] ? (o[k][lang] || o[k].zh) : undefined) });
const SKILL_DESC = new Proxy(SKILL_DESC_I18N, { get: (o, k) => (o[k] ? (o[k][lang] || o[k].zh) : undefined) });
function closeSkillTray() {
  document.querySelectorAll(".skill-tab").forEach((t) => t.classList.remove("on"));
  $("skill-pills")?.classList.add("hidden");
  $("skill-recent")?.classList.add("hidden");
  const search = $("skill-search"); if (search) search.value = "";
  $("skilltray")?.classList.add("hidden");
  $("skills-toggle")?.classList.remove("on");
}
function runSkill(skill) {
  const cmd = "/" + skill + " ";
  const inp = $("text-input");
  inp.value = cmd; autoGrow(); inp.focus();
  try { inp.setSelectionRange(cmd.length, cmd.length); } catch {}
  recordRecent(skill);
  closeSkillTray(); // tidy: collapse after picking so the box is clearly ready
}

// shared pill factory (used by category tabs, search results, and the recent row)
let loadedGroups = [];
function makePill(s) {
  const p = document.createElement("button");
  p.className = "skill-pill";
  const tip = "/" + s + (SKILL_DESC[s] ? " — " + SKILL_DESC[s] : "");
  p.title = tip; p.dataset.tip = tip;
  p.textContent = (SKILL_EMOJI[s] || "⚙️") + " " + (SKILL_LABEL[s] || s);
  p.onclick = () => runSkill(s);
  return p;
}
function recordRecent(skill) {
  let r = []; try { r = JSON.parse(localStorage.getItem("junshi-recent-skills") || "[]"); } catch {}
  r = [skill, ...r.filter((x) => x !== skill)].slice(0, 5);
  localStorage.setItem("junshi-recent-skills", JSON.stringify(r));
}
function renderRecent() {
  const row = $("skill-recent"); if (!row) return;
  const all = new Set(loadedGroups.flatMap((g) => g.skills));
  let r = []; try { r = JSON.parse(localStorage.getItem("junshi-recent-skills") || "[]"); } catch {}
  r = r.filter((s) => all.has(s));
  row.innerHTML = "";
  if (!r.length) { row.classList.add("hidden"); return; }
  const lbl = document.createElement("span"); lbl.className = "skill-recent-lbl"; lbl.textContent = T("recent_lbl");
  row.appendChild(lbl);
  r.forEach((s) => row.appendChild(makePill(s)));
  row.classList.remove("hidden");
}
function filterSkills(q) {
  const pills = $("skill-pills"); if (!pills) return;
  q = (q || "").trim().toLowerCase();
  document.querySelectorAll(".skill-tab").forEach((t) => t.classList.remove("on"));
  if (!q) { pills.innerHTML = ""; pills.classList.add("hidden"); return; }
  const all = [...new Set(loadedGroups.flatMap((g) => g.skills))];
  const hits = all.filter((s) => s.includes(q) || (SKILL_DESC[s] || "").toLowerCase().includes(q));
  pills.innerHTML = "";
  hits.forEach((s) => pills.appendChild(makePill(s)));
  pills.classList.toggle("hidden", hits.length === 0);
}
async function loadSkills() {
  let data; try { data = await (await fetch("/skills")).json(); } catch { return; }
  const groups = data?.groups || [];
  const toggle = $("skills-toggle"), tray = $("skilltray"), tabs = $("skill-tabs"), pills = $("skill-pills");
  if (!toggle || !tray) return;
  // idempotent: a profile switch re-runs this — clear any prior tabs/pills first
  if (tabs) tabs.innerHTML = ""; if (pills) { pills.innerHTML = ""; pills.classList.add("hidden"); }
  if (!groups.length) { closeSkillTray(); toggle.classList.add("hidden"); return; } // flat layout → hide tray
  if (!tabs || !pills) return;
  loadedGroups = groups; // shared with search + recent
  const search = $("skill-search"); if (search) search.value = "";
  groups.forEach((g) => {
    const tab = document.createElement("button");
    tab.className = "skill-tab"; tab.dataset.key = g.key; tab.textContent = g.label;
    if (GROUP_DESC[g.key]) { tab.dataset.tip = GROUP_DESC[g.key]; tab.title = GROUP_DESC[g.key]; }
    tab.onclick = () => {
      const wasOpen = tab.classList.contains("on");
      if (search) search.value = ""; // a category pick clears any active search
      tabs.querySelectorAll(".skill-tab").forEach((t) => t.classList.remove("on"));
      if (wasOpen) { pills.classList.add("hidden"); return; } // toggle the same tab closed
      tab.classList.add("on");
      pills.innerHTML = "";
      g.skills.forEach((s) => pills.appendChild(makePill(s)));
      pills.classList.remove("hidden");
    };
    tabs.appendChild(tab);
  });
  if (search) search.oninput = (e) => filterSkills(e.target.value); // live filter across all categories
  // a ⚔ toggle summons the tray; it is NOT shown on load
  toggle.classList.remove("hidden");
  toggle.onclick = () => {
    const open = tray.classList.toggle("hidden") === false;
    toggle.classList.toggle("on", open);
    if (open) { renderRecent(); } // surface recently-used pills when the tray opens
    else {
      document.querySelectorAll(".skill-tab").forEach((t) => t.classList.remove("on"));
      pills.classList.add("hidden");
      if (search) search.value = "";
    }
  };
}

// ── W_Counsel profiles: switch which arsenal (content folder) the 军师 reads ──────
function setProfStatus(t, cls) { const e = $("prof-status"); if (e) { e.textContent = t || ""; e.className = "prof-status " + (cls || ""); } }
async function loadProfiles() {
  const sel = $("prof-select"); if (!sel) return;
  let data; try { data = await (await fetch("/content/profiles")).json(); } catch { return; }
  const active = data?.active || "", profiles = data?.profiles || [];
  const act = $("prof-active"); if (act) act.textContent = T("profActive") + active;
  sel.innerHTML = "";
  // ensure the active dir is selectable even if not yet saved as a named profile
  const hasActive = profiles.some((p) => p.dir === active);
  if (!hasActive && active) { const o = document.createElement("option"); o.value = active; o.textContent = T("prof_current") + active; sel.appendChild(o); }
  profiles.forEach((p) => { const o = document.createElement("option"); o.value = p.dir; o.textContent = p.name + " — " + p.dir; if (p.dir === active) o.selected = true; sel.appendChild(o); });
}
async function switchProfile(dir) {
  if (!dir) return;
  setProfStatus(T("profSwitching"));
  try {
    const r = await fetch("/content/set", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ dir }) });
    const d = await r.json();
    if (!d.ok) { setProfStatus(d.error || T("st_fail"), "err"); return; }
    setProfStatus(T("profSwitched") + " " + d.dir, "ok");
    await loadSkills();      // layout may flip flat↔os → rebuild the tray
    await loadProfiles();    // refresh active marker
    ws?.send(JSON.stringify({ type: "reset" })); // fresh session so 军师 re-reads the new arsenal
  } catch { setProfStatus(T("st_fail"), "err"); }
}
$("prof-select")?.addEventListener("change", (e) => switchProfile(e.target.value));
$("prof-add") && ($("prof-add").onclick = async () => {
  const name = $("prof-name").value.trim(), dir = $("prof-dir").value.trim();
  if (!name || !dir) { setProfStatus(T("profNeed"), "err"); return; }
  try {
    const r = await fetch("/content/profiles", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, dir }) });
    const d = await r.json();
    if (!d.ok) { setProfStatus(d.error || T("st_fail"), "err"); return; }
    setProfStatus(T("profAdded") + " " + name, "ok");
    $("prof-name").value = ""; $("prof-dir").value = "";
    await loadProfiles();
  } catch { setProfStatus(T("st_fail"), "err"); }
});
$("prof-remove") && ($("prof-remove").onclick = async () => {
  const sel = $("prof-select"); const dir = sel?.value; if (!dir) return;
  try { await fetch("/content/profiles/remove", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ dir }) }); await loadProfiles(); } catch {}
});

// ── past councils (history) — reopen a previous session, transcript repainted ────
function fmtAgo(ms) {
  if (!ms) return "";
  const d = Date.now() - ms, MIN = 60000, H = 3600000, DAY = 86400000;
  if (d < H) return Math.max(1, Math.floor(d / MIN)) + T("ago_min");
  if (d < DAY) return Math.floor(d / H) + T("ago_hr");
  if (d < 7 * DAY) return Math.floor(d / DAY) + T("ago_day");
  const dt = new Date(ms); return (dt.getMonth() + 1) + "/" + dt.getDate();
}
async function loadHistory() {
  const list = $("hist-list"); if (!list) return;
  list.innerHTML = `<div class='hist-empty'>${T("hist_loading")}</div>`;
  let data; try { data = await (await fetch("/sessions")).json(); } catch { list.innerHTML = `<div class='hist-empty'>${T("hist_failed")}</div>`; return; }
  const sessions = data?.sessions || [];
  if (!sessions.length) { list.innerHTML = `<div class='hist-empty'>${T("hist_empty")}</div>`; return; }
  list.innerHTML = "";
  sessions.forEach((s) => {
    const row = document.createElement("div"); row.className = "hist-row";
    const open = document.createElement("button"); open.className = "hist-open";
    open.innerHTML = `<span class="hist-title"></span><span class="hist-time"></span>`;
    open.querySelector(".hist-title").textContent = s.title || T("hist_untitled");
    open.querySelector(".hist-time").textContent = fmtAgo(s.lastModified);
    open.onclick = () => openCouncil(s.id);
    const del = document.createElement("button"); del.className = "hist-del"; del.title = T("hist_del_t"); del.textContent = "✕";
    del.onclick = (e) => { e.stopPropagation(); deleteCouncil(s.id, row); };
    row.appendChild(open); row.appendChild(del);
    list.appendChild(row);
  });
}
function openCouncil(id) {
  ws?.send(JSON.stringify({ type: "resume", id })); // server acks "resumed" → repaintSession runs
  $("history-modal")?.classList.add("hidden");
}
async function repaintSession(id) {
  let data; try { data = await (await fetch(`/session/${id}/messages`)).json(); } catch { return; }
  transcript.innerHTML = ""; resetCtxMeter(); resetCost();
  (data?.messages || []).forEach((m) => {
    const who = m.role === "user" ? "me" : "junshi";
    const div = addMsg(m.text, who);
    if (who === "junshi") renderBubble(div);
  });
  addMsg(T("msg_resumed"), "junshi");
}
async function deleteCouncil(id, row) {
  try { await fetch("/session/delete", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) }); row.remove(); } catch {}
}
$("history-btn") && ($("history-btn").onclick = () => { $("history-modal")?.classList.remove("hidden"); loadHistory(); });
$("hist-close") && ($("hist-close").onclick = () => $("history-modal")?.classList.add("hidden"));

// ── 查库 Arsenal folder — point the wiki-search at your research wiki ─────────────
function setArsenalStatus(t, cls) { const e = $("arsenal-status"); if (e) { e.textContent = t || ""; e.className = "prof-status " + (cls || ""); } }
async function loadArsenal() {
  const a = $("arsenal-active"); if (!a) return;
  let d; try { d = await (await fetch("/arsenal")).json(); } catch { return; }
  a.textContent = (d.available ? "🏯 " : "⚠ ") + T("arsenalNow") + d.dir;
  const inp = $("arsenal-dir"); if (inp) inp.placeholder = d.dir;
}
$("arsenal-save") && ($("arsenal-save").onclick = async () => {
  const dir = $("arsenal-dir").value.trim(); if (!dir) return;
  setArsenalStatus(T("arsenalSaving"));
  try {
    const r = await fetch("/arsenal", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ dir }) });
    const d = await r.json();
    if (!d.ok) { setArsenalStatus(d.error || T("st_fail"), "err"); return; }
    setArsenalStatus(d.available ? T("arsenalOk") + " " + d.dir : T("arsenalNoTool"), d.available ? "ok" : "err");
    $("arsenal-dir").value = "";
    await loadArsenal(); await loadSkills(); // refresh the 查库 pill availability for the new path
  } catch { setArsenalStatus(T("st_fail"), "err"); }
});

// ── boot ──────────────────────────────────────────────────────────────────────
setVoice(localStorage.getItem("junshi-voice") || LANG_VOICE[lang]); // saved pick, else language default
loadSkills();
loadProfiles();
loadArsenal();
refreshAuth();
fetch("/version").then(r => r.json()).then(d => {
  const v = "v" + d.version;
  const el = $("ver"); if (el) el.textContent = v;
  document.title = "军师 · W_Counsel " + v;   // shows in the Windows app-window title/taskbar
}).catch(() => {});
setChipK("chip_connecting");
setMood("neutral");
initThree();
connect();
addMsg(T("msg_greeting"), "junshi");
booted = true; // from here on, a language switch may rebuild the skill tray
