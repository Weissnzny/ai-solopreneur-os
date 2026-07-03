---
name: humanize
description: Edit text to remove AI writing patterns and add genuine voice. Based on Wikipedia's "Signs of AI writing" (WikiProject AI Cleanup) — scans for the 29 documented AI tells and rewrites them. Accepts an optional writing sample for voice calibration. Runs the full 6-step process — identify → rewrite → preserve meaning → match voice → add soul → final anti-AI audit pass. Output is a Draft rewrite + brief audit of remaining tells + Final rewrite + change summary. Brief/text-only — no Drive write, no paid API. Trigger on "/humanize", "humanize this", "make this sound human", "make this less AI", "remove AI patterns", "scrub the AI tells", "this reads AI-generated", "make it sound like me".
---

# /humanize — Anti-AI Writing Editor (战 · Campaign quality gate)

## What this skill does

Takes a block of text and rewrites it to remove the 29 documented AI tells from
[Wikipedia: Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing)
(WikiProject AI Cleanup), while preserving meaning, matching the intended voice, and injecting
actual personality. Output is a 4-block deliverable: **Draft rewrite → Audit → Final rewrite →
Changes summary.**

The core insight from the source: *LLMs guess the most statistically likely next token, which tends
toward the blandest result that fits the widest range of cases.* Sterile, voiceless writing is as
obvious as slop — removing AI patterns is only half the job. The other half is adding a real voice.

## What this skill is NOT
- **NOT** a content generator. It edits text the user already has. No text → ask for it first.
- **NOT** a publisher, translator, or fact-checker. If a claim looks fabricated, flag it (see
  `framework/operating-principles.md`) — do not amplify it in the rewrite.
- **NOT** a length-changer by default. Same length as input unless asked.

## Read first (every run)
- The text the user pasted or pointed at.
- A voice sample if one was provided (inline or file path).
- Your voice register — short sentences, real pauses, fragments OK, scene first, no em dashes, no
  hustle clichés. (Drop a `voice.md` next to your project and read it here if you keep one.)

## Step 0 — Intake (one-line ack)
Confirm before editing: source text · voice mode (sample or default) · target tone · length budget
(same ± 15%) · file output? (default no, chat only). If no source text at all, ask once, then halt.

## Step 1 — Voice Calibration
**If a sample was provided**, read it and note six dimensions before drafting: sentence-length
pattern · word-choice level · paragraph openings · punctuation habits · recurring phrases/tics ·
transitions. Then **match the sample** — don't just remove AI patterns, replace them with the
sample's patterns. If they write short, don't produce long.

**If no sample**, fall back to the default register (short sentences, scene first, no em dashes, no
hustle, warm but never soft) for first-person work, or the **personality-and-soul** rules below for
neutral third-party text.

## Step 2 — Scan the 29 AI Patterns
Run the input against the catalogue. Mark every hit. Most edits resolve 4-8 of these at once — the
goal is the rewrite, not a report.

### Content patterns
| # | Pattern | Watch-for | Fix |
|---|---|---|---|
| 1 | Significance inflation | *stands/serves as · testament · pivotal/crucial moment · underscores its importance · evolving landscape · setting the stage* | State the fact. Drop the legacy framing. |
| 2 | Notability puffing | *cited in NYT/BBC/FT · active social-media presence · written by a leading expert* | One concrete citation with context, not a name list. |
| 3 | Superficial -ing tails | *highlighting · underscoring · emphasizing · ensuring · reflecting · showcasing · contributing to* | Cut the tail. End the sentence. |
| 4 | Promotional language | *boasts · vibrant · rich · profound · nestled · in the heart of · groundbreaking · renowned · breathtaking · must-visit · commitment to* | Use the noun for what it is. No brochure adjectives. |
| 5 | Vague attributions | *industry reports · observers have cited · experts argue · some critics argue · several sources* | Name the source, year, study. Or drop the claim. |
| 6 | "Challenges and Future Prospects" | *Despite its X, faces several challenges · Future Outlook* (as a section head) | Cite the specific challenge with a date and a specific response. |

### Language and grammar patterns
| # | Pattern | Watch-for | Fix |
|---|---|---|---|
| 7 | AI vocabulary | *additionally · align with · crucial · delve · enhance · fostering · garner · interplay · intricate · landscape (abstract) · pivotal · showcase · tapestry · testament · underscore · valuable · vibrant* | Replace with the plain word. "Crucial"→"matters". "Showcase"→"shows". |
| 8 | Copula avoidance | *serves as · stands as · marks · represents · boasts · features · offers* | Use *is / are / has*. |
| 9 | Negative parallelisms + tailing negations | *Not only X but Y · It's not just X, it's Y · no guessing · no wasted motion* (as a fragment) | Pick one clause. Write the negation as a real clause. |
| 10 | Rule of three overuse | Manufactured noun-noun-noun trios ("innovation, inspiration, and insights") | Cut to one or two. Real trios from the source are fine. |
| 11 | Elegant variation | The same noun cycled through synonyms ("protagonist · main character · central figure · hero") | Pick one name and repeat it. |
| 12 | False ranges | *from X to Y* where X-Y aren't on a scale | List the items plainly. |
| 13 | Passive / subjectless fragments | *No configuration file needed. The results are preserved automatically.* | Name the actor. |

### Style patterns
| # | Pattern | Watch-for | Fix |
|---|---|---|---|
| 14 | Em dash overuse | `—` more than once or twice per paragraph | Convert most to commas, periods, or parentheses. In the default register: none at all. |
| 15 | Boldface overuse | Inline **bold** on phrases that aren't true keywords | Strip it. Bold only for genuine emphasis. |
| 16 | Inline-header vertical lists | `**Header:** content. **Header:** content.` | Rewrite as prose. Lists are for *parallel items*. |
| 17 | Title Case in headings | `Strategic Negotiations And Global Partnerships` | Sentence case. |
| 18 | Emojis as decoration | 🚀 💡 ✅ in headings/bullets | Strip them from prose. |
| 19 | Curly quotation marks | `"…"` from chat tools | Replace with straight `"…"`. |

### Communication patterns
| # | Pattern | Watch-for | Fix |
|---|---|---|---|
| 20 | Chatbot artifacts | *I hope this helps · Of course! · Certainly! · Would you like… · let me know · here is a…* | Delete entirely. |
| 21 | Knowledge-cutoff disclaimers | *as of [date] · up to my last training update · while specific details are limited* | Delete. State the fact or drop it. |
| 22 | Sycophantic tone | *Great question! · You're absolutely right · That's an excellent point* | Delete. |

### Filler and hedging
| # | Pattern | Watch-for | Fix |
|---|---|---|---|
| 23 | Filler phrases | *In order to · Due to the fact that · At this point in time · has the ability to · It is important to note that* | Compress: *to · because · now · can · the data shows*. |
| 24 | Excessive hedging | *could potentially possibly · might have some effect · it could be argued that* | One hedge, not three: *may affect*. |
| 25 | Generic positive conclusions | *The future looks bright · Exciting times lie ahead · a step in the right direction* | End on a concrete next step or number. |
| 26 | Hyphenated word-pair overuse | *third-party · cross-functional · data-driven · decision-making · high-quality · real-time · end-to-end* — all perfectly consistent | Drop hyphens on common pairs; keep them on technical compounds. Inconsistency is human. |
| 27 | Persuasive-authority tropes | *The real question is · at its core · in reality · what really matters · fundamentally · the heart of the matter* | Drop the ceremony. Say the thing. |
| 28 | Signposting / announcements | *Let's dive in · let's explore · here's what you need to know · without further ado* | Just do the thing. |
| 29 | Fragmented headers | Heading + one-line restatement + real content | Delete the restatement line. |

## Step 3 — Draft Rewrite
Apply Step 2 fixes in one pass. Aim for natural read-aloud rhythm (sentence lengths vary on
purpose), specific details over vague claims, simple constructions (*is/are/has*), same length ± 15%.

### PERSONALITY AND SOUL — apply unless the sample says otherwise
- **Have opinions.** React to facts, don't just report them.
- **Vary rhythm.** Short punchy sentences. Then longer ones that take their time.
- **Acknowledge complexity.** "This is impressive but also kind of unsettling."
- **Use "I" when it fits.** First person isn't unprofessional.
- **Let some mess in.** Tangents, asides, half-formed thoughts. Perfect structure feels algorithmic.
- **Be specific about feelings.** Not "this is concerning" but the concrete thing that unsettles you.

## Step 4 — Final Audit Pass (non-optional)
1. Ask yourself: **"What makes the below so obviously AI generated?"** Answer in 2-5 honest bullets
   (rhythm too tidy, suspect attributions, slogan-y closer, etc.).
2. Then: **"Now make it not obviously AI generated."** Produce one more revision addressing those
   bullets specifically.

Skipping the audit pass is the most common way a draft ships still reading as AI.

## Step 5 — Output
Output **four blocks in the chat**, in this order:
```
DRAFT REWRITE
─────────────
[Step 3 output]

WHAT MAKES THE BELOW SO OBVIOUSLY AI GENERATED?
───────────────────────────────────────────────
- [remaining tell 1]
- [...]

FINAL REWRITE
─────────────
[Step 4 output]

CHANGES (optional)
──────────────────
- Removed [pattern N]: [example]
```
If the user asked for a file, also write `output/humanize/{YYYY-MM-DD}-{slug}.md` with the four blocks.

## Definition of done
- Four-block output in the chat.
- Final rewrite has zero of patterns 14 / 18 / 19 (em dashes, decorative emojis, curly quotes) — absolute.
- Patterns 1-13, 15-17, 20-29 reduced; residual tells surfaced in the audit.
- Voice matches the sample (if given) or the default register.
- No fabrication amplified.
