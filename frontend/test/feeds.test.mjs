import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const compiled = ts.transpileModule(fs.readFileSync('src/lib/earthquakes.ts','utf8'), { compilerOptions: { module:ts.ModuleKind.CommonJS, target:ts.ScriptTarget.ES2020 } }).outputText;
const mod = { exports:{} };
let sourceResponse;
vm.runInNewContext(compiled,{ exports:mod.exports, module:mod, URL, Date, Set, TextDecoder, fetch:async () => sourceResponse });
const { normalizeFeed, isStale, fetchObservations } = mod.exports;
const generated = Date.parse('2026-11-23T00:00:00Z');
const event = { id:'test-id', properties:{mag:3.1, place:'A source location', time:generated-1000, url:'https://earthquake.usgs.gov/earthquakes/eventpage/test-id',status:'reviewed'},geometry:{coordinates:[0,0,5]} };
const feed = features => ({type:'FeatureCollection',metadata:{generated},features});
test('normalizes measured values and official review status without prophecy labels',()=>{
 const result=normalizeFeed(feed([event]));assert.equal(result.observations[0].magnitude,3.1);assert.equal(result.observations[0].depth,5);assert.equal(result.observations[0].review,'USGS reviewed');assert.equal(result.skipped,0);
});
test('malformed top-level data never looks like an empty successful feed',()=>{
 for(const value of [null,{},feed(null),{...feed([]),metadata:{generated:'yesterday'}}])assert.throws(()=>normalizeFeed(value));
});
test('untrusted source links and invalid measurements are excluded',()=>{
 for(const properties of [{...event.properties,url:'javascript:alert(1)'},{...event.properties,url:'https://earthquake.usgs.gov.attacker.test/'},{...event.properties,url:'https://user:pass@earthquake.usgs.gov/'},{...event.properties,mag:null},{...event.properties,time:Infinity}])assert.throws(()=>normalizeFeed(feed([{...event,properties}])));
});
test('duplicate and malformed records are counted, not rendered',()=>{
 const result=normalizeFeed(feed([event,event,null]));assert.equal(result.observations.length,1);assert.equal(result.skipped,2);
});
test('unreviewed source status is explicit and events sort newest first',()=>{
 const result=normalizeFeed(feed([event,{...event,id:'newer',properties:{...event.properties,time:generated,status:'automatic'}}]));assert.equal(result.observations[0].id,'newer');assert.match(result.observations[0].review,/unreviewed/);
});
test('staleness and impossible future snapshots are visible',()=>{
 const snapshot=normalizeFeed(feed([]));assert.equal(isStale(snapshot,generated+1000),false);assert.equal(isStale(snapshot,generated+16*60*1000),true);assert.equal(isStale(snapshot,generated-6*60*1000),true);
});
test('network errors and malformed source bodies are not successful empty snapshots',async()=>{
 sourceResponse=new Response('unavailable',{status:503});await assert.rejects(()=>fetchObservations(new AbortController().signal));
 sourceResponse=new Response('not JSON');await assert.rejects(()=>fetchObservations(new AbortController().signal));
 sourceResponse=new Response(JSON.stringify(feed([event])));assert.equal((await fetchObservations(new AbortController().signal)).observations.length,1);
});
test('the response size cap cancels oversized source streams',async()=>{
 let cancelled=false;
 sourceResponse=new Response(new ReadableStream({pull(controller){controller.enqueue(new Uint8Array(1024*1024+1));},cancel(){cancelled=true;}}));
 await assert.rejects(()=>fetchObservations(new AbortController().signal),/allowed size/);assert.equal(cancelled,true);
});
