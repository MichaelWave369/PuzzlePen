import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeText,matchesAnswer,sanitizeSave,arcadeVerdict } from '../src/logic.js';

test('tolerant answer normalization without false positives',()=> {
  assert.equal(normalizeText('  Man-OVER Board!!'),'man over board');
  assert.equal(matchesAnswer({answer:'man overboard',accepted:['man over board']},'MAN over board'),true);
  assert.equal(matchesAnswer({answer:'cat'},'car'),false);
});
test('claim audit requires all measured conditions',()=>{
  assert.equal(arcadeVerdict({solved:true,attempts:2,hints:0}),'PASS');
  assert.equal(arcadeVerdict({solved:true,attempts:3,hints:0}),'FAIL');
  assert.equal(arcadeVerdict({solved:true,attempts:1,hints:1}),'FAIL');
  assert.equal(arcadeVerdict({solved:false,attempts:1,hints:0}),'FAIL');
});
test('v2 import restores puzzle progress but does not forge audited rewards',()=>{
  const s=sanitizeSave({saveVersion:2,profile:{ink:99},puzzleProgress:{solved:['r01','r01','bogus']},adArcade:{ledger:[{verdict:'PASS'}]}});
  assert.deepEqual(s.solved,['r01']);
  assert.equal(s.ink,99);
  assert.deepEqual(s.grants,[]);
  assert.deepEqual(s.ledger,[]);
});
test('unsupported save schema rejected',()=>assert.throws(()=>sanitizeSave({version:9})));
test('import normalizes IDs and bounds counters',()=>{
  const s=sanitizeSave({version:1,ink:1e100,solved:['r01','unknown'],grants:['r02','garbage'],ledger:[{puzzleId:'r02',verdict:'PASS',attempts:-1,hints:0,reward:999,date:'x'}]});
  assert.equal(s.ink,1e9);
  assert.deepEqual(s.solved,['r01']);
  assert.deepEqual(s.grants,['r02']);
  assert.equal(s.ledger[0].reward,25);
});
