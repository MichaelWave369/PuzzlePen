// Safe same-origin bridge between the React sample and the original classic v2.
export const classicRelativeUrl = (base = '/PuzzlePen/') => base.replace(/\/?$/, '/') + 'classic/index.html';

// GitHub Pages may return a generic fallback HTML page for missing files.
// Confirm a distinctive signature, not merely HTTP 200.
export function looksLikeClassic(html) {
  return typeof html === 'string' &&
    html.includes('Puzzle Pen: Executable Ad Arcade') &&
    html.includes('engines/gatebreaker/gatebreaker-engine.js') &&
    html.includes('data/puzzle-data.js');
}
export async function probeClassic(url, fetcher = fetch) {
  try {
    const response = await fetcher(url, { cache: 'no-store' });
    if (!response.ok) return false;
    return looksLikeClassic(await response.text());
  } catch { return false; }
}
