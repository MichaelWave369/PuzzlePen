#!/usr/bin/env node
// Optional classic-v2 archive verification. Does not require browser or network.
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';

const dir=new URL('../public/classic/',import.meta.url).pathname;
if (!existsSync(join(dir,'index.html'))) {
 console.log('Classic v2 archive not staged. React R1 validation still applies.');
 process.exit(0);
}
const required=[
 'index.html','manifest.webmanifest','service-worker.js','styles/main.css','data/puzzle-data.js',
 'scripts/core.js','scripts/save.js','scripts/contracts.js','scripts/audit.js','scripts/app.js',
 'engines/puzzles/puzzle-engine.js','engines/gatebreaker/gatebreaker-engine.js',
 'assets/icons/icon-192.png','assets/icons/icon-512.png'
];
for(const relative of required) if(!existsSync(join(dir,relative))) throw Error('Missing classic asset: '+relative);
for(const f of required.filter(x=>x.endsWith('.js'))){
 execFileSync(process.execPath,['--check',join(dir,f)],{stdio:'pipe'});
}
const w={};
vm.runInNewContext(readFileSync(join(dir,'data/puzzle-data.js'),'utf8'),{window:w},{timeout:1500});
if(w.PUZZLES?.length!==144||w.CASES?.length!==3||Object.keys(w.BOOKS||{}).length!==8)
 throw Error('Classic content count did not match the verified archive.');
const html=readFileSync(join(dir,'index.html'),'utf8');
for(const file of required.filter(x=>x.endsWith('.js')&&!x.includes('service-worker.js'))) {
 if(!html.includes(file)) throw Error('Missing classic HTML script reference: '+file);
}
const sw=readFileSync(join(dir,'service-worker.js'),'utf8');
if(!sw.includes('puzzle-pen-eaa-v2')) throw Error('Unexpected classic service-worker cache identifier.');
console.log('Classic v2 validated: 144 puzzles, 3 cases, 8 books, 9 checked scripts.');
