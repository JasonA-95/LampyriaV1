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
