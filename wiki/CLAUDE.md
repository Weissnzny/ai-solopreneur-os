# CLAUDE.md — 库 The Arsenal (the knowledge vault's operating manual)

This file is the schema for **库 (The Arsenal)** — the fifth pillar of the AI Solopreneur OS. It tells
the OS how this knowledge base is structured and exactly what to do when ingesting a source, answering
a question, or routing knowledge into action. When working inside `wiki/`, **this file governs
behaviour.** It does not replace the root `CLAUDE.md` (the *operating* brain — skills, pillars,
loops). This is the *knowledge* brain.

---

## 0. What the Arsenal is for

A persistent, compounding knowledge base of **what you're learning — from coaches, operators, books,
talks, your own notes — and how to apply it to your real situations.** Raw sources go in once; the OS
reads them, extracts the teaching, and integrates it into living pages. Knowledge is compiled once and
kept current — never re-derived from scratch on every question.

**Your job:** curate sources, direct the analysis, ask good questions, decide what it means.
**The OS's job:** everything else — summarising, cross-referencing, filing, flagging contradictions.

> **Lineage.** The Arsenal follows the *personal LLM knowledge base* pattern Andrej Karpathy described
> ([x.com/karpathy/status/2039805659525644595](https://x.com/karpathy/status/2039805659525644595)):
> raw sources in `raw/` → an LLM *compiles* a `.md` wiki with backlinks → an auto-maintained `index.md`
> + per-source summaries make Q&A work without heavy RAG → periodic "health checks" keep it clean. The
> OS's `ingest` / `ask` / `lint` ops (§5) are that loop. What the Arsenal adds on top is **routing**
> (§0, build / story / content) — the knowledge doesn't just sit in a vault, it arms the other pillars.

![The Arsenal compiled into a knowledge graph — Karpathy's pattern made visible: every page a node, every `[[backlink]]` a line](wiki-knowledge-graph.png)

### The Arsenal routes three ways (the 库 pillar's purpose)
The Arsenal is not a library you let gather dust. Its whole point is to **arm the other pillars**.
Every useful thing in here should be ready to route into one of three outcomes — ask the W_Counsel
("route this from the Arsenal"):

1. **Build** — turn a captured framework into a system, an automation, an agent, an offer (→ 阵 Formation).
2. **Story** — turn a teaching + your real experience into a true narrative (→ 道 The Way, `/writing-beats`).
3. **Content** — turn an insight into a post, a carousel, a script (→ 战 The Campaign, `/content` · `/caption` · `/carousel` · `/video-script`).

The **scenario page** is where this lands: not just "what does coach X teach" but "given everything
I've read, here's the play for *this real situation*."

---

> ### 📖 Read your Arsenal however you like
>
> This whole folder is plain markdown with `[[backlinks]]`. Nothing proprietary, nothing locked in.
> The OS reads and writes it, but so can any markdown editor you already trust.
>
> Point **[Obsidian](https://obsidian.md)** (or VS Code, or plain Notepad) at this folder and the same
> files become a second brain you can *see* — that graph above is your own Arsenal rendered live. Every
> ingest adds a node; the `[[links]]` between your pages draw themselves.
>
> That's the lineage made tangible: the durable asset isn't the tool, it's the knowledge you keep in
> files you own.
>
> **Why it pays off for a one-person business:** every node on that graph is raw material your campaign
> skills already know how to fire. Say "route this from the Arsenal" and a teaching becomes a post,
> a carousel, or a script in seconds — the same `/content`, `/caption`, `/carousel`, and `/video-script`
> you run daily, now pulling from a base that compounds instead of a blank page. The more you ingest,
> the more you have to ship.

---

## 1. The three layers
1. **Raw sources** (`raw/`) — immutable. Notes, transcripts, clipped articles, threads, call notes. Read these; **never** edit them. Source of truth.
2. **The wiki** (`coaches/`, `concepts/`, `scenarios/`, `sources/`, `syntheses/`) — markdown pages the OS owns entirely.
3. **The schema** (this file) — how the wiki is structured and how the OS behaves.

---

## 2. Folder conventions
```
wiki/
├── CLAUDE.md          ← this schema
├── index.md           ← content catalogue: every page, one line each, by category
├── log.md             ← append-only timeline: ingests, queries, lint passes
├── overview.md        ← the front door / current state of your thinking
├── raw/               ← IMMUTABLE source documents
├── coaches/           ← entity pages: one per coach / operator / author
├── concepts/          ← framework / tactic / principle pages (cross-coach)
├── scenarios/         ← application playbooks: how to apply concepts to YOUR real situation
├── sources/           ← one summary page per ingested source
├── syntheses/         ← big-picture pages that connect many concepts
└── _templates/        ← page skeletons to copy (don't link these into the graph)
```
**Slugs:** lowercase-kebab-case, descriptive, stable once created (renaming breaks `[[links]]`).

---

## 3. Page types
Every page starts with YAML frontmatter, then the body. Copy the matching `_templates/` file.

| Type | Folder | One-liner | Key frontmatter |
|---|---|---|---|
| **coach** | `coaches/` | Who they are, their worldview, signature frameworks | `type, tags, also_known_for, first_seen, sources` |
| **concept** | `concepts/` | A framework/tactic/principle, who teaches it, how to apply | `type, tags, taught_by, confidence, sources` |
| **scenario** | `scenarios/` | The play for a real situation you face | `type, tags, uses_concepts, status, sources` |
| **source** | `sources/` | Summary of one ingested source + what it changed | `type, source_type, coach, date_ingested, url, raw` |
| **synthesis** | `syntheses/` | Connects many concepts | `type, tags, related, confidence` |

> **Link-property format.** Any frontmatter field whose value is a wikilink MUST be a **quoted
> string**, and a list of them a YAML list of quoted strings: `sources: ["[[example-source]]"]`,
> `coach: "[[example-coach]]"`. Body wikilinks are the opposite: plain `[[slug]]`, never quoted.

Other fields: `confidence: high | medium | low | contested` · `status (scenarios): idea | drafting |
active | parked | done` · `date_ingested / first_seen: YYYY-MM-DD` · `source_type: book | course |
video | podcast | article | thread | call | other`.

---

## 4. Linking & citation
- **Link liberally** with `[[slug]]`. A coach links to every concept they teach; a concept links to every coach who teaches it and every scenario that applies it.
- A `[[slug]]` that doesn't exist yet is fine — a TODO marking a page worth writing.
- **Cite everything.** Every factual claim traces to a `[[source-slug]]`. No source, no claim.
- **Bridge into the OS.** Scenario/concept pages may link out to your real context (the framework, your offers) with a relative markdown link (e.g. `[the doctrine](../framework/ai-solopreneur-os.md)`).

---

## 5. Operations
### INGEST — `ingest <source>`
1. **Read** the full raw source. 2. **Discuss** the 3-6 key takeaways before filing. 3. **Write the
source page.** 4. **Update the coach page** (create if new). 5. **Update concept pages** (create new;
flag contradictions with what others teach). 6. **Update/create scenario pages** where this changes
how you should act. 7. **Update `index.md`.** 8. **Append to `log.md`.** 9. **Report back** what you
touched + 1-2 questions worth chasing. A single source touches many pages — that compounding is the point.

### QUERY — `ask <question>`
1. Read `index.md` first; drill into candidate pages and their `[[links]]`. 2. Synthesise an answer
**with `[[citations]]`.** 3. **File good answers back** as a new concept/scenario/synthesis page;
update `index.md` + `log.md`. 4. If the answer is actionable, **offer to route it** (build / story /
content — see §0).

### LINT — `lint`
Health-check and report (don't auto-fix big changes without a nod): contradictions not yet flagged ·
stale claims a newer source superseded · orphans (no inbound links) · missing pages (concepts
mentioned a lot but lacking a page) · missing cross-references · data gaps. Suggest next sources + questions.

---

## 6 & 7. index.md / log.md
`index.md` — content catalogue by category; each line `- [[slug]] — one-line summary`. Updated on
every ingest and whenever a query files a page. `log.md` — chronological, append-only, **newest at the
bottom**; each entry `## [YYYY-MM-DD] <op> | <title>` where `<op>` is `ingest | query | lint | setup`.

---

## 8. Hard rules
- **Raw is immutable.** Read it, never edit it.
- **No fabrication.** Never invent a teaching, quote, number, or "what coach X said." Missing a real
  fact → STOP and ask, or mark `[unverified]`. (Inherits `framework/operating-principles.md`.)
- **Cite or don't claim.** Every teaching links to its `[[source]]`.
- **Flag, don't smooth over, contradictions.** Name both sides; note which you lean on and why.
- **Plain language.** Short sentences. Scene first. No jargon.
- **Bookkeeping is not optional.** Every ingest updates `index.md` and `log.md`. An un-indexed,
  un-logged page is a half-done ingest.

---

## 9. What ships publicly
This repo ships the **schema + templates + one worked EXAMPLE per department** (`example-*.md`) so you
see the wiring. Your real, compounding knowledge lives in these folders too, but is gitignored — the
Arsenal you build is yours and stays private. Delete the `example-*` pages once you've added your own.
