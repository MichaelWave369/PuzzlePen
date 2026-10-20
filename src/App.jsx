import React, {useEffect,useMemo,useRef,useState} from 'react';
import { BOOKS, PUZZLES } from './catalog.js';
import { SAVE_KEY, blankSave, matchesAnswer, readSave, sanitizeSave, arcadeVerdict } from './logic.js';

const BETA = 'https://puzzle-pen-beta.netlify.app/';
const REPO = 'https://github.com/MichaelWave369/PuzzlePen';
const formatDate = () => new Date().toISOString();

export default function App() {
  const [page,setPage]=useState('home');
  const [save,setSave]=useState(readSave);
  const [puzzle,setPuzzle]=useState(null);
  const [mode,setMode]=useState('book');
  const [guess,setGuess]=useState('');
  const [attempts,setAttempts]=useState(0);
  const [hints,setHints]=useState(0);
  const [hintOpen,setHintOpen]=useState(false);
  const [result,setResult]=useState(null);
  const [notice,setNotice]=useState('');
  const [importPreview,setImportPreview]=useState(null);
  const fileRef=useRef(null);
  useEffect(()=>{try{localStorage.setItem(SAVE_KEY,JSON.stringify({...save,updatedAt:formatDate()}));}catch{/* Storage may be disabled. */}},[save]);
  const counts=useMemo(()=>BOOKS.map(b=>({...b,playable:PUZZLES.filter(p=>p.book===b.id).length,done:PUZZLES.filter(p=>p.book===b.id && save.solved.includes(p.id)).length})),[save.solved]);
  const start=(next,kind='book')=>{setPuzzle(next);setMode(kind);setGuess('');setAttempts(0);setHints(0);setHintOpen(false);setResult(null);setNotice('');setPage('play');};
  const go=(next)=>{setPage(next);setNotice('');};
  const record=(p,verdict,n,h)=>{
    const eligible=verdict==='PASS'&&!save.grants.includes(p.id);
    const reward=eligible?25:0;
    setSave(old=>({...old,ink:old.ink+reward,grants:eligible?[...old.grants,p.id]:old.grants,
      ledger:[...old.ledger.slice(-59),{puzzleId:p.id,verdict,attempts:n,hints:h,reward,date:formatDate()}]}));
    return {verdict,reward};
  };
  const submit=(event)=>{
    event?.preventDefault();
    if(!puzzle||result||!guess.trim())return;
    const n=attempts+1;
    const correct=matchesAnswer(puzzle,guess);
    setAttempts(n);
    if(!correct){
      if(mode==='arcade'&&n>=2){const audit=record(puzzle,'FAIL',n,hints);setResult({correct:false,closed:true,audit,text:'Two misses. This claim did not pass, but you can try another puzzle.'});}
      else setNotice('Not quite. Try a different answer.');
      return;
    }
    const newSolve=!save.solved.includes(puzzle.id);
    let audit=null;
    if(mode==='arcade'){audit=record(puzzle,arcadeVerdict({solved:true,attempts:n,hints}),n,hints);}
    setSave(old=>({...old,ink:old.ink+(newSolve?10:0),solved:newSolve?[...old.solved,puzzle.id]:old.solved}));
    setResult({correct:true,closed:true,audit,text:puzzle.explanation});
    setNotice('');
  };
  const reveal=()=>{
    if(!puzzle||result)return;
    const audit=mode==='arcade'?record(puzzle,'FAIL',attempts,hints):null;
    setResult({correct:false,closed:true,audit,text:'Answer: '+puzzle.answer+'. '+puzzle.explanation});
  };
  const nextPuzzle=()=>{
    if(!puzzle)return go('books');
    const inBook=PUZZLES.filter(p=>p.book===puzzle.book);
    const index=inBook.findIndex(p=>p.id===puzzle.id);
    start(inBook[(index+1)%inBook.length]);
  };
  const startBook=(b)=>{
    const collection=PUZZLES.filter(p=>p.book===b.id);
    if(!collection.length){setNotice(b.name+' is preserved in the archive and queued for React migration.');return;}
    start(collection.find(p=>!save.solved.includes(p.id))||collection[0]);
  };
  const startArcade=()=>start(PUZZLES.find(p=>p.id==='r02'),'arcade');
  const exportSave=()=>{
    const blob=new Blob([JSON.stringify({...save,updatedAt:formatDate()},null,2)],{type:'application/json'});
    const url=URL.createObjectURL(blob),anchor=document.createElement('a');
    anchor.href=url;anchor.download='puzzlepen-backup.json';anchor.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  };
  const readFile=async e=>{
    const file=e.target.files?.[0];if(!file)return;
    try{if(file.size>1024*1024)throw new Error('Backup exceeds 1 MB.');
      const raw=JSON.parse(await file.text());
      const parsed=sanitizeSave(raw);
      setImportPreview({data:parsed,isLegacy:raw.saveVersion===2});
      setNotice('Review the preview below before applying.');
    }catch(error){setNotice('Import rejected: '+error.message);setImportPreview(null);}
    e.target.value='';
  };
  const applyImport=()=>{
    if(!importPreview)return;
    setSave(importPreview.data);setNotice(importPreview.isLegacy?'Restored legacy puzzle progress. Historic arcade claims were intentionally not transferred.':'Backup restored.');
    setImportPreview(null);
  };
  const reset=()=>{
    if(!window.confirm('Delete Puzzle Pen React progress on this browser? Export a backup first if you need it.'))return;
    setSave(blankSave());setImportPreview(null);setNotice('Local progress reset.');
  };
  return <div className="site">
    <a className="skip" href="#content">Skip to content</a>
    <header className="header">
      <button className="brand" onClick={()=>go('home')} aria-label="Puzzle Pen home"><span className="logo">P<span>✎</span></span><span><strong>PUZZLE PEN</strong><small>THE ACTIVITY ARCADE</small></span></button>
      <nav aria-label="Primary navigation">
        <button className={page==='home'?'active':''} onClick={()=>go('home')}>Home</button>
        <button className={page==='books'?'active':''} onClick={()=>go('books')}>Bookshelf</button>
        <button className={page==='arcade'?'active':''} onClick={()=>go('arcade')}>Arcade</button>
        <button className={page==='progress'?'active':''} onClick={()=>go('progress')}>My Ink</button>
      </nav>
      <div className="wallet"><span>✦</span> {save.ink} <small>INK</small></div>
    </header>
    <main id="content">
    {page==='home'&&<><section className="hero">
      <div className="hero-text"><p className="eyebrow"><span className="spark">✦</span> A NEW CHAPTER FOR AN OLD FAVORITE</p>
        <h1>Curiosity looks <em>good on you.</em></h1>
        <p>Unfold a puzzle, decode a secret, or take an arcade challenge whose promises actually mean something. No accounts. No tracking. Just brains having fun.</p>
        <div className="hero-actions"><button className="cta" onClick={()=>go('books')}>Explore the bookshelf <span>↗</span></button><button className="ghost" onClick={()=>go('arcade')}>Try the honest arcade →</button></div>
        <p className="subtle">React revival R0 · {PUZZLES.length} playable samples · 144 activities in the preserved v2 archive</p>
      </div>
      <div className="cover-art" aria-hidden="true"><div className="cover-circle"></div><div className="cover-letter one">P</div><div className="cover-letter two">?</div><div className="cover-pencil">✎</div><div className="cover-label">THINK<br/>SIDEWAYS.</div></div>
    </section>
    <div className="stat-row"><div><strong>08</strong><span>original activity books</span></div><div><strong>{save.solved.length.toString().padStart(2,'0')}</strong><span>samples solved here</span></div><div><strong>{save.ledger.filter(x=>x.verdict==='PASS').length.toString().padStart(2,'0')}</strong><span>audited wins</span></div></div>
    <section className="section"><div className="section-heading"><div><p className="eyebrow">OPEN A NEW PAGE</p><h2>Choose your kind of clever</h2></div><button className="textlink" onClick={()=>go('books')}>All eight books ↗</button></div><div className="book-grid">{counts.slice(0,4).map(b=><BookCard key={b.id} b={b} onClick={()=>{go('books');startBook(b);}}/>)}</div></section>
    <section className="banner"><div><p className="eyebrow">FROM THE ORIGINAL ARCHIVE</p><h2>The full beta is still alive.</h2><p>Play the preserved hosted v1.2.1 while we migrate the original v2 engine into this repository.</p></div><a href={BETA} target="_blank" rel="noreferrer">Open original beta ↗</a></section></>}
    {page==='books'&&<section className="section books-page"><p className="eyebrow">THE PUZZLE PEN LIBRARY</p><h1>Pick a book. Start wondering.</h1><p className="lede">Each book below belongs to the original collection. Books without migrated samples are marked Archive Only. Their full games still live in the supplied v2.0 source.</p><div className="book-grid">{counts.map(b=><BookCard key={b.id} b={b} onClick={()=>startBook(b)}/>)}</div>{notice&&<p className="notice" role="status">{notice} <a href={BETA} target="_blank" rel="noreferrer">Try the hosted beta ↗</a></p>}</section>}
    {page==='arcade'&&<section className="section arcade-page"><p className="eyebrow">THE HONEST AD ARCADE</p><h1>If we show it in the ad, you can play it.</h1><p className="lede">This R0 demonstration uses an executable rule, not a decorative claim. Play, measure the result, and write a receipt. A reward is granted only once per puzzle.</p><div className="claim"><div className="claim-sticker">REAL CLAIM · REAL TEST</div><h2>Three cycles. One answer.</h2><p>Decode the rebus in <strong>two attempts or fewer</strong>, use <strong>zero hints</strong>, and earn <strong>25 ink</strong>. Each puzzle's claim can pay once.</p><div className="claim-doodle">CYCLE  CYCLE  CYCLE</div><button className="cta" onClick={startArcade}>Play the claim →</button></div><div className="rules"><h3>What gets checked?</h3><p>The result records the puzzle ID, attempt count and hint count. The verifier returns PASS or FAIL. The reward ledger refuses duplicate grants. Cancelled play never creates a winning receipt.</p></div></section>}
    {page==='play'&&puzzle&&<section className="play-wrap">
      <button className="back" onClick={()=>go(mode==='arcade'?'arcade':'books')}>← Leave puzzle</button>
      <div className="play-panel"><div className="play-head"><span className="eyebrow">{mode==='arcade'?'ARCADE CLAIM':'ACTIVITY BOOK'} · {BOOKS.find(x=>x.id===puzzle.book)?.name}</span><span className="difficulty">{puzzle.difficulty}</span></div>
        <h1>{puzzle.prompt||'What does this picture say?'}</h1><div className="puzzle-display" aria-label={'Puzzle: '+puzzle.display}>{puzzle.display}</div>
        {mode==='arcade'&&<p className="contract">CONTRACT: Solve within 2 attempts and without hints. Reward: 25 ink, once per puzzle.</p>}
        <form onSubmit={submit}><label htmlFor="answer">Your answer</label><input id="answer" autoComplete="off" spellCheck={false} autoFocus value={guess} onChange={e=>setGuess(e.target.value)} disabled={!!result} placeholder="Type your answer..." />
          <div className="actions"><button className="cta" type="submit" disabled={!!result||!guess.trim()}>Check answer ↗</button><button type="button" className="outline" onClick={()=>{setHintOpen(true);setHints(x=>x+(!hintOpen?1:0));}} disabled={!!result||hintOpen}>Need a hint?</button><button type="button" className="outline" onClick={reveal} disabled={!!result}>Reveal</button></div>
        </form>
        <p className="counter" aria-live="polite">Attempts: {attempts} {mode==='arcade'?'· Hints: '+hints:''}</p>
        {hintOpen&&!result&&<p className="hint">Hint: {puzzle.hint}</p>}
        {notice&&!result&&<p className="notice" role="status">{notice}</p>}
        {result&&<div className={'outcome '+(result.correct?'win':'loss')} role="status"><h2>{result.correct?'Solved!':'Puzzle revealed / claim closed'}</h2><p>{result.text}</p>{result.audit&&<p><strong>AUDIT {result.audit.verdict}</strong>{result.audit.reward? ' · +'+result.audit.reward+' ink awarded':' · no claim reward'}</p>}<div className="actions"><button className="cta" onClick={nextPuzzle}>Next puzzle →</button><button className="outline" onClick={()=>go('books')}>Back to books</button></div></div>}
      </div></section>}
    {page==='progress'&&<section className="section progress-page"><p className="eyebrow">YOUR PERSONAL NOTEBOOK</p><h1>Your ink. Your discoveries.</h1><p className="lede">Progress lives in this browser only. Save a backup before clearing site data or changing domains.</p>
      <div className="stat-row progress-stats"><div><strong>{save.ink}</strong><span>ink collected</span></div><div><strong>{save.solved.length}/{PUZZLES.length}</strong><span>samples solved</span></div><div><strong>{save.grants.length}</strong><span>claim rewards granted</span></div></div>
      <div className="two-col"><div className="paper"><h2>Backup and restore</h2><p>Export a JSON backup, or preview a Puzzle Pen React / original v2 save before restoring. Legacy imports restore puzzle progress, not unverified arcade receipts.</p><div className="actions"><button className="cta" onClick={exportSave}>Export backup ↓</button><button className="outline" onClick={()=>fileRef.current?.click()}>Import backup ↑</button><input hidden ref={fileRef} type="file" accept=".json,application/json" onChange={readFile}/></div>{importPreview&&<div className="preview"><strong>Import preview</strong><p>{importPreview.data.solved.length} known puzzles, {importPreview.data.ink} ink, {importPreview.data.ledger.length} receipts {importPreview.isLegacy?'(v2 migration)':''}</p><div className="actions"><button className="cta" onClick={applyImport}>Apply imported save</button><button className="outline" onClick={()=>setImportPreview(null)}>Cancel</button></div></div>}<button className="danger" onClick={reset}>Reset local progress</button></div>
      <div className="paper"><h2>Claim audit ledger</h2>{save.ledger.length===0?<p>No arcade attempts recorded yet. An empty ledger beats an invented receipt.</p>:<ul className="ledger">{[...save.ledger].reverse().slice(0,12).map((r,i)=><li key={i}><strong>{r.verdict}</strong><span>{r.puzzleId} · {r.attempts} tries · {r.hints} hints</span><small>{r.reward? '+'+r.reward+' ink':'0 ink'}</small></li>)}</ul>}</div></div>
      {notice&&<p className="notice" role="status">{notice}</p>}</section>}
    </main>
    <footer><div><strong>PUZZLE PEN</strong><p>Small puzzles. Big curiosity. No tracking.</p></div><div><a href={BETA} target="_blank" rel="noreferrer">Original beta ↗</a><a href={REPO} target="_blank" rel="noreferrer">Source code ↗</a><span>R0 · MIT · Local-first</span></div></footer>
  </div>;
}
function BookCard({b,onClick}) {return <button className={'book '+b.tint} onClick={onClick} aria-label={b.playable?'Play '+b.name:'Archive only: '+b.name}><span className="book-top"><span className="book-icon">{b.icon}</span><span className="book-count">{b.playable?b.done+'/'+b.playable+' solved':'ARCHIVE ONLY'}</span></span><span className="book-name">{b.name}</span><span className="book-desc">{b.about}</span><span className="book-bottom">{b.archived} original activities <b>↗</b></span></button>}
