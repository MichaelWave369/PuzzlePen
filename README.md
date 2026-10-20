# Puzzle Pen · React Revival R0

**If we show it in the ad, you can play it.**

Puzzle Pen was recovered from three owner-supplied archives. This repo begins a clean MIT-licensed, local-first React + Vite GitHub Pages edition without pretending that the full v2 runtime has already been ported.

## In this first pull request

- Responsive accessible bookshelf for the eight original activity books.
- **18 playable, locally implemented sample puzzles**, selected from the archived content.
- Real answer checking, hints, one-time solve ink, and local progress storage.
- A runnable arcade claim with machine-checked **PASS/FAIL** and one reward per puzzle.
- Backup export, validated preview-before-apply import, reset, and v2 puzzle-progress migration.
- Automated Node tests and a GitHub Pages deployment workflow.
- Link to the still-hosted v1.2.1 beta while v2 is migrated.

**Current limits:** This is NOT the complete 144-puzzle runtime. Canvas mazes, hidden pictures, three linked cases, and Gatebreaker are preserved in the supplied v2.0 archive but not imported into the React build yet. All source is local to this repo except an optional Google Fonts stylesheet, which falls back to system fonts offline. Browser persistence is per origin: Netlify and GitHub Pages do not automatically share localStorage.

## Run locally

Node.js 22+:

```sh
npm install
npm test
npm run dev
npm run build
```

Vite uses `base: '/PuzzlePen/'` for `https://michaelwave369.github.io/PuzzlePen/`. GitHub Pages must be enabled in repository Settings → Pages → Source: **GitHub Actions**. A successful workflow is required before calling the Pages URL live.

## Restore the actual full v2 runtime

The owner supplied `Puzzle_Pen_Executable_Ad_Arcade_v2.0.zip` (SHA-256: `f286c2ecf5ce72f464c28e76dac9c5b7f593d861b71cb5c8a71c0e65e23360ec`). It contains the 144-activity game, Gatebreaker, contracts, ledger, offline assets, and source docs. Keep the archive outside the Git repo, then:

```sh
python3 scripts/import_v2.py /path/to/Puzzle_Pen_Executable_Ad_Arcade_v2.0.zip
npm run build
```

This copies the verified classic static game to `public/classic/` (served at `/PuzzlePen/classic/`), leaving its classic JS script order unchanged. This is an explicit *next integration step*, not part of R0. Test the classic engine in a real browser and manually commit imported assets in a follow-up PR. Do not ship the multi-stage internal continuity receipts without reviewing publication rights/scope.

## Privacy and integrity

- No user account, ads, tracker, backend or analytics.
- `puzzlepen_react_r0` holds local progress; export a backup before changing domains.
- Legacy v2 imports only known puzzle IDs and numeric ink, **not** claimed verified audit receipts.
- Arcade PASS requires the disclosed challenge mechanics. Duplicate reward grants are blocked for a given puzzle ID. A canceled run never grants rewards.
- Accessibility helpers are present; no formal WCAG or real-device certification is claimed.

## Next

Import the verified classic v2 runtime, then incrementally replace its DOM engine with React adapters while preserving exact puzzle mechanics, its receipts and the safe legacy-migration path.

MIT licensed. See `LICENSE`.
