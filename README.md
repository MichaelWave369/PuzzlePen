# Puzzle Pen · React Revival R1

**If we show it in the ad, you can play it.**

Puzzle Pen is an MIT-licensed, local-first React/Vite playground and a preservation home for an independently playable original game.

## Two editions

1. **React Edition** is deployed at `/PuzzlePen/`: the modern responsive bookshelf with 18 playable samples, local ink, hints, audited sample claims, JSON backup, and accessibility-oriented controls.
2. **Original Classic v2** belongs at `/PuzzlePen/classic/index.html`: the owner-recovered original HTML/JS application with all **144 standalone activities, 3 mystery cases, Puzzle Trails, Gatebreaker, the original ad contract engine, and its original save format**. Because the ZIP came from a conversation upload, its actual game assets must be staged in `public/classic` before they appear in a GitHub build. R1 introduces an honest availability-aware launcher, checks, and migration support without mislabeling the hosted v1.2.1 beta as v2.

## Install the exact classic game (owner-supplied ZIP)

Get the original `Puzzle_Pen_Executable_Ad_Arcade_v2.0.zip` from your local recovery kit (SHA-256 `f286c2ecf5ce72f464c28e76dac9c5b7f593d861b71cb5c8a71c0e65e23360ec`). From the repo root:

```sh
python3 scripts/import_v2.py /path/to/Puzzle_Pen_Executable_Ad_Arcade_v2.0.zip
npm install
npm test
npm run build
git add public/classic
git commit -m "feat: include preserved classic v2 engine"
git push
```

The importer extracts only the fourteen `app/` runtime files; private continuity records from the ZIP are intentionally excluded. It scopes classic service-worker cache deletion to its own cache namespace. No third-party hosted data or build-time fetch is required. **To get the public classic link working, these game files must actually be present in the repository's main branch.** React v2 launcher automatically distinguishes a real installed engine from a missing path.

## Data and progress

- React uses `puzzlepen_react_r0`; classic uses `puzzle_pen_executable_ad_arcade_v2`.
- R1 validates all 144 canonical puzzle IDs on import, so completion data for not-yet-ported puzzles is preserved.
- **Classic and React are separate editions.** On the same GitHub Pages origin, the My Ink page offers a preview-before-apply read from the classic save. Imported classic ad claims are not verified or paid again in React.
- Local browser storage is scoped to origin, not shared with the old Netlify beta. Use JSON export/import for cross-origin migration.
- Export a backup before applying an import: it replaces the React save, rather than merging silently.
- A React PASS is an audit of the sample mechanics, not a cryptographically tamperproof award.

## Verify

```sh
npm install
npm test
npm run build
node scripts/verify_classic.mjs
```

When the classic source exists, the verifier checks that its fourteen assets are present, all nine JavaScript scripts parse under Node, and its canonical data has **144 puzzles / 3 cases / 8 books**. Without the game files, it explicitly reports `not staged` and exits successfully, because React must remain independently deployable.

GitHub Pages: repository Settings → Pages → Source: **GitHub Actions**. `vite.config.js` uses the fixed `/PuzzlePen/` base. Classic v2 uses path-relative files and a separately scoped service worker.

## Roadmap

After staging the complete classic runtime: screenshot and keyboard/touch smoke tests; preserve v2 audit contracts and progression; migrate the content engines to React one-by-one with parity tests. Do not claim real-device or screen-reader certification from static checks alone.

License: MIT. The original archive was provided by the owner; review rights before redistributing any third-party contributions.
