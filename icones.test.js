const test=require('node:test'),assert=require('node:assert'),fs=require('fs'),vm=require('vm');
const c=vm.createContext({});for(const f of['donnees.js'])vm.runInContext(fs.readFileSync(f,'utf8'),c);
vm.runInContext(fs.readFileSync('icones.js','utf8').replace('const ICO=','var ICO='),c);
const D=vm.runInContext('DATA',c),I=c.ICO;
const ok=s=>s.startsWith('<svg')&&s.endsWith('</svg>')&&!/NaN|undefined/.test(s);
test('chaque objet, ressource et étincelle a une icône SVG valide',()=>{
for(const [id,o] of Object.entries(D.objets))assert.ok(ok(I.obj(o)),id);
for(const k of Object.keys(D.res))assert.ok(ok(I.res(k)),k);
for(const e of Object.values(D.etin))assert.ok(ok(I.spark(e)),e.n)});
test('pas d\'attribut dupliqué dans une balise path',()=>{const all=[...Object.values(D.objets).map(o=>I.obj(o)),...Object.keys(D.res).map(k=>I.res(k))].join('');
for(const m of all.matchAll(/<(?:path|circle|ellipse)\s[^>]*>/g)){const a=[...m[0].matchAll(/\s([a-z-]+)="/g)].map(x=>x[1]);assert.equal(new Set(a).size,a.length,m[0].slice(0,90))}});
test('chaque objet a une apparence unique (forme + motif + couleurs), chaque relique aussi',()=>{const seen=new Map();
for(const [id,o] of Object.entries(D.objets)){const sig=I.kindOf(o)+'|'+I.spec(o).join('|'),prev=seen.get(sig);assert.ok(!prev,id+' = '+prev);seen.set(sig,id)}
const rel=Object.keys(D.res).filter(k=>/^rel\d+$/.test(k));assert.equal(new Set(rel.map(k=>I.REL[k].join('|'))).size,rel.length);for(const k of rel)assert.ok(I.REL[k],k)});
test('chaque étincelle a un motif propre',()=>{const m=Object.values(D.etin).map(e=>I.spark(e));assert.equal(new Set(m).size,m.length)});
test('chaque potion a une icône',()=>{for(const k of Object.keys(D.conso))assert.ok(ok(I.conso(k)),k)});
