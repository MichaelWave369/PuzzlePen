export const SAVE_KEY = 'puzzlepen_react_r0';
export const V2_KEY = 'puzzle_pen_executable_ad_arcade_v2';
// Canonical v2 ranges were verified against the 144 activities in the owner archive.
const GROUPS = Object.freeze({r:50,c:25,m:12,h:10,w:20,l:15,o:12});
export const CANONICAL_IDS = Object.freeze(Object.entries(GROUPS).flatMap(([prefix,n]) => Array.from({length:n},(_,i)=>prefix+String(i+1).padStart(2,'0'))));
const ids = new Set(CANONICAL_IDS);
const arcadeIds = new Set(['r01','r02','r03','r04','r05','r06','c01','c02','c03','c04','c05','w01','w02','w03','w04','o01','o02','l05']);
const bounded = (v, max=1000000000) => Number.isFinite(Number(v)) ? Math.max(0,Math.min(max,Math.floor(Number(v)))) : 0;
export const normalizeText = (v) => String(v || '').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim().replace(/\s+/g,' ');
export const matchesAnswer = (puzzle, guess) => [puzzle.answer,...(puzzle.accepted || [])].some(ans => normalizeText(ans) === normalizeText(guess));
export const blankSave = () => ({ version:1, ink:0, solved:[], grants:[], ledger:[], updatedAt:null });
export function sanitizeSave(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('Expected a save object.');
  if (raw.saveVersion === 2) {
    // Legacy puzzle progress is portable. Imported claims are not treated as verified evidence.
    return { ...blankSave(), ink:bounded(raw.profile?.ink ?? raw.profile?.score), solved:[...new Set((Array.isArray(raw.puzzleProgress?.solved) ? raw.puzzleProgress.solved : []).filter(x=>ids.has(x)))], updatedAt:new Date().toISOString() };
  }
  if (raw.version !== 1) throw new Error('Unknown save version.');
  return {
    version:1, ink:bounded(raw.ink), solved:[...new Set((Array.isArray(raw.solved)?raw.solved:[]).filter(x=>ids.has(x)))],
    grants:[...new Set((Array.isArray(raw.grants)?raw.grants:[]).filter(x=>typeof x==='string'&&arcadeIds.has(x)))],
    ledger:(Array.isArray(raw.ledger)?raw.ledger:[]).filter(x=>x && typeof x === 'object' && arcadeIds.has(x.puzzleId) && ['PASS','FAIL'].includes(x.verdict)).slice(-60).map(x=>({puzzleId:x.puzzleId,verdict:x.verdict,attempts:bounded(x.attempts,500),hints:bounded(x.hints,500),reward:bounded(x.reward,25),date:typeof x.date==='string'?x.date.slice(0,32):''})),
    updatedAt:typeof raw.updatedAt==='string'?raw.updatedAt.slice(0,32):null
  };
}
export const arcadeVerdict = ({ solved, attempts, hints }) => solved && attempts <= 2 && hints === 0 ? 'PASS' : 'FAIL';
export function readSave() {
  try {
    const current=localStorage.getItem(SAVE_KEY);
    if(current) return sanitizeSave(JSON.parse(current));
    const v2=localStorage.getItem(V2_KEY);
    if(v2) return sanitizeSave(JSON.parse(v2));
  } catch { /* Corrupt or blocked storage gets a fresh in-memory save. */ }
  return blankSave();
}
