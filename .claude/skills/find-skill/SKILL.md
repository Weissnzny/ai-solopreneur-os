---
name: find-skill
description: >
  Find and recommend Claude Code skills from trusted marketplaces for a given
  task, before building one from scratch. Trigger on "install skills",
  "research skills", "find me a skill for X", "what's a good skill for Y",
  "is there a skill that does Z", "/find-skill". NEVER auto-installs. Filters
  by a 4-rule quality gate, returns a shortlist of 3-5 candidates with
  stars/installs/source/risk-flags, waits for explicit approval, then emits the
  install command for you to run.
user-invocable: true
---

# /find-skill — 阵 Formation (extend your own OS)

Part of the **阵 (Formation)** loop: when you need a new capability, first check whether a good skill
already exists before building one. This skill **researches trusted marketplaces**, applies a 4-rule
quality filter, and **presents a shortlist of 3-5 candidates** for you to pick from. It is research +
recommendation, never auto-install.

## 1. Trusted sources (default)
1. **[claudemarketplaces.com](https://claudemarketplaces.com/skills)** — large curated catalog, daily-refreshed from GitHub. Best signal-to-noise. **Primary.**
2. **[skillsmp.com](https://skillsmp.com/)** — largest raw catalog scraped from public GitHub. Higher noise — use only when the primary has no match, and filter harder.

Already-trusted fallbacks (mention, pull only if asked): [github.com/anthropics/skills] (official) · [skills.sh] (npm-style standard).

## 2. The 4-rule quality gate (hard)
| # | Rule | Check |
|---|---|---|
| 1 | **Avoid risky / random** | DROP if: obscure/unverified author, <3 stars, <10 installs, no description, vague triggers, no source repo, generic name with no clear purpose. |
| 2 | **Top-rated / most stars** | RANK by stars · install count · featured/favorite badge · ratings. |
| 3 | **Reliable** | PREFER official orgs, known indie authors with multiple skills, recent updates (<6 months), clean README. |
| 4 | **Comment / review check** | READ the reviews. DROP on "doesn't work", "fake", "scam", "broken", "AI slop", "couldn't install", or all-negative patterns. |

Rules 1 and 4 are hard drops; 2 and 3 are ranking signals.

## 3. Process
1. **Restate the job** in one sentence. If ambiguous, ask one clarifying question and stop.
2. **Search the primary source** (WebSearch with `allowed_domains`), casting wide with verb + noun + 2-3 synonyms. Fall back to the secondary only if <3 viable candidates. If a site's search UI needs it, browse via the Playwright MCP.
3. **Open each candidate's detail page** — capture name + `/invocation`, one-line description, author, stars/installs/featured, source repo, recent-update date, and the reviews block.
4. **Apply the 4-rule filter** — drop on rule 1 or 4; rank survivors by 2 then 3. Cap at 3-5; if fewer pass, say so.
5. **Present the shortlist** as a markdown table:

   | # | Skill | Source | Stars / Installs | Reliability | Why it fits |
   |---|---|---|---|---|---|

   Include each row's install command (`npx skills add <repo> --skill <name>`) but **don't run it**. End with: *"Install which one? (number, or 'none', or 'all')"*
6. **Install only after approval** — echo verbatim *"About to run: `npx skills add …`. Are you sure?"*, then on "yes" run it via Bash.
7. **If nothing passes**, say so plainly and offer: (a) expand to the fallback sources, (b) lower the bar if the author is known, (c) build a new skill via `/skill-creator` (the right call when the task is specific to you).

## 4. Hard rules
- **NEVER auto-install.** Shortlist → explicit pick → verbatim confirmation → run.
- **NEVER pull from sources other than the two defaults** unless the user names another in the same run.
- **NEVER skip rule 1 or 4** to fill the shortlist. Two good candidates beat five risky ones.
- **NEVER duplicate** a skill you already have — cross-check `Glob .claude/skills/*/SKILL.md` first; if a match exists, name it and ask before recommending an alternative.
- **NEVER recommend a paid skill** without flagging the cost upfront.

## Output Standard
Output is the shortlist + install command in chat. No artifact required for a research-only run.
