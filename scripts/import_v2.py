#!/usr/bin/env python3
"""Import the ORIGINAL owner's v2 ZIP into the Vite public/classic subtree.

Usage: python3 scripts/import_v2.py /path/to/Puzzle_Pen_Executable_Ad_Arcade_v2.0.zip

This script is intentionally not run by CI. It does not download anything,
and it leaves the original archive unmodified.
"""
from pathlib import Path
import hashlib
import sys
import zipfile

EXPECTED_SHA256 = 'f286c2ecf5ce72f464c28e76dac9c5b7f593d861b71cb5c8a71c0e65e23360ec'
EXPECTED_FILES = {'index.html', 'scripts/app.js', 'data/puzzle-data.js', 'engines/gatebreaker/gatebreaker-engine.js'}
DEST = Path(__file__).resolve().parents[1] / 'public' / 'classic'

def main():
    if len(sys.argv) != 2:
        raise SystemExit('Usage: python3 scripts/import_v2.py /path/to/original-v2.zip')
    src = Path(sys.argv[1])
    payload = src.read_bytes()
    if hashlib.sha256(payload).hexdigest() != EXPECTED_SHA256:
        raise SystemExit('Archive SHA-256 differs from the inspected v2 copy. Import aborted.')
    with zipfile.ZipFile(src) as z:
        safe = []
        for item in z.infolist():
            if not item.filename.startswith('app/') or item.is_dir():
                continue
            tail = Path(item.filename[len('app/'):])
            if tail.is_absolute() or '..' in tail.parts or not tail.parts:
                raise SystemExit('Unsafe archive member: ' + item.filename)
            safe.append((item,tail))
        if not EXPECTED_FILES.issubset({str(t) for _,t in safe}):
            raise SystemExit('Missing expected game assets in ZIP.')
        for member,tail in safe:
            target = DEST / tail
            target.parent.mkdir(parents=True,exist_ok=True)
            target.write_bytes(z.read(member))
    # Do not let the classic SW delete unrelated origin CacheStorage entries.
    sw = DEST / 'service-worker.js'
    original = sw.read_text(encoding='utf8')
    if 'key !== CACHE;' in original:
        # A service worker shares CacheStorage with the modern React shell.
        patched = original.replace('key !== CACHE;', 'key !== CACHE && key.startsWith("puzzle-pen-eaa-");')
        sw.write_text(patched, encoding='utf8')
    else:
        # The original uses the same expression without a trailing semicolon in its lambda.
        patched = original.replace('key !== CACHE', 'key !== CACHE && key.startsWith("puzzle-pen-eaa-")')
        if patched == original:
            raise SystemExit('Unexpected upstream service-worker cache cleanup expression.')
        sw.write_text(patched, encoding='utf8')
    print(f'Imported {len(safe)} classic runtime files into {DEST}')
    print('Now run npm run build, inspect dist/classic, and commit public/classic files.')

if __name__ == '__main__':
    main()
