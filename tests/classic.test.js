import test from 'node:test';
import assert from 'node:assert/strict';
import { classicRelativeUrl, looksLikeClassic, probeClassic } from '../src/classic.js';
import { CANONICAL_IDS, sanitizeSave } from '../src/logic.js';

test('canonical inventory covers exactly 144 distinct v2 puzzle IDs', () => {
 assert.equal(CANONICAL_IDS.length,144);
 assert.equal(new Set(CANONICAL_IDS).size,144);
 for (const id of ['r50','c25','m12','h10','w20','l15','o12']) assert.ok(CANONICAL_IDS.includes(id));
});
test('v2 backup imports full canonical solved history but never self-validates claims', () => {
 const s=sanitizeSave({saveVersion:2,profile:{ink:70},puzzleProgress:{solved:['r50','m12','h10','w20','l15','o12','bogus']},adArcade:{ledger:[{verdict:'PASS'}],rewardGrantIds:['fake']}});
 assert.deepEqual(s.solved,['r50','m12','h10','w20','l15','o12']);
 assert.deepEqual(s.ledger,[]);
 assert.deepEqual(s.grants,[]);
 assert.equal(s.ink,70);
});
test('React backup preserves canonical progress while blocking forged unknown IDs',()=>{
 const s=sanitizeSave({version:1,ink:14,solved:['c25','r50','bogus'],grants:['c25','r02','fake'],ledger:[{puzzleId:'c25',verdict:'PASS',attempts:1,hints:0,reward:25}]});
 assert.deepEqual(s.solved,['c25','r50']);
 assert.deepEqual(s.grants,['r02']);
 assert.deepEqual(s.ledger,[]);
});
test('classic link is under Pages base path',()=>assert.equal(classicRelativeUrl('/PuzzlePen/'),'/PuzzlePen/classic/index.html'));
test('probe only accepts the real classic application document', async()=>{
 assert.equal(looksLikeClassic('<html>not found</html>'),false);
 assert.equal(await probeClassic('/classic/',async()=>({ok:true,text:async()=>'<title>app</title>'})),false);
 assert.equal(await probeClassic('/classic/',async()=>({ok:true,text:async()=>'<title>Puzzle Pen: Executable Ad Arcade</title><script src="engines/gatebreaker/gatebreaker-engine.js"></script><script src="data/puzzle-data.js"></script>'})),true);
 assert.equal(await probeClassic('/classic/',async()=>{throw Error('network offline');}),false);
});
