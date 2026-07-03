# Log — 库 The Arsenal

Chronological, append-only, **newest at the bottom**. Each entry: `## [YYYY-MM-DD] <op> | <title>`
where `<op>` is `ingest | query | lint | setup`. `grep "^## \[" log.md | tail -5` gives the recent timeline.

## [2026-06-01] setup | Arsenal seeded with one example per department
- Shipped the schema (`CLAUDE.md`), the 5 templates, and one wired EXAMPLE per department.
- Example chain: `example-source` → `example-coach` + `example-concept` + `example-scenario` + `example-synthesis`.
- Next: delete the `example-*` pages once you ingest your first real source.
