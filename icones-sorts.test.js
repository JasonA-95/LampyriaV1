const test=require('node:test'),assert=require('node:assert/strict'),fs=require('fs'),vm=require('vm');
const ctx=vm.createContext({});
vm.runInContext(fs.readFileSync(__dirname+'/donnees.js','utf8'),ctx);vm.runInContext(fs.readFileSync(__dirname+'/icones-sorts.js','utf8'),ctx);
const all=vm.runInContext(`(()=>{const o=[];for(const c of Object.keys(DATA.classes))for(const s of DATA.classes[c].sorts)o.push([c+'.'+s.id,ICOS.sort(s)]);for(const k of Object.keys(DATA.lueurs))o.push(['lueur.'+k,ICOS.lueur(k,DATA.lueurs[k].sort)]);return o})()`,ctx);
test('une icône SVG valide pour chaque sort et chaque sort de Lueur',()=>{assert.ok(all.length>=67);for(const [n,svg] of all){assert.match(svg,/^<svg [^>]*viewBox="0 0 32 32"/,n);assert.ok(svg.endsWith('</svg>'),n);assert.equal((svg.match(/<g[ >]/g)||[]).length,(svg.match(/<\/g>/g)||[]).length,n);assert.ok(!/undefined|NaN/.test(svg),n);for(const t of svg.match(/<[^>]+>/g)){const a=(t.match(/ ([a-z-]+)=/g)||[]).map(x=>x.trim());assert.equal(new Set(a).size,a.length,n+' attribut en double: '+t)}}});
test('chaque icône est unique',()=>{assert.equal(new Set(all.map(a=>a[1])).size,all.length)});
test('les éléments ont des couleurs différentes',()=>{const col=e=>vm.runInContext(`ICOS.PAL['${e}'][0]`,ctx);assert.equal(new Set(['n','vent','foudre','lumiere','tenebres'].map(col)).size,5)});
