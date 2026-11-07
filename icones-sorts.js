// ICÔNES DE SORTS : une icône SVG (viewBox 32x32) par sort, sans ressource externe.
// Forme du sort (flèche, éclat, cœur...) + marque d'élément + modificateurs (état, zone, poussée, drain) + détails propres à l'identifiant.
const ICOS=(()=>{
const INK='#1a1218',ST=`stroke="${INK}" stroke-opacity=".75" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round"`,CR='#fff6e0';
const PAL={n:['#e3bd84','#7a5230'],vent:['#9af0dc','#1f7a78'],foudre:['#ffe872','#6a3ad0'],lumiere:['#fff4b8','#e0902a'],tenebres:['#b496f5','#25103f']};
const LUE={colerique:['#ff9a6a','#8a2010'],peureuse:['#a8dcff','#2a5a9a'],gourmande:['#ffd080','#a85a10'],reveuse:['#aab4ff','#303a9a'],tetue:['#d0c4b0','#5a4a3a'],farceuse:['#ff9ad8','#8a2a70'],melancolique:['#9a8ae8','#2a1a5a']};
const hash=s=>{let h=7;for(const c of String(s))h=(Math.imul(h,31)+c.charCodeAt(0))>>>0;return h};
const G={
arrow:`<path d="M8 23L22 9" stroke="${INK}" stroke-opacity=".75" stroke-width="4" stroke-linecap="round" fill="none"/><path d="M8 23L22 9" stroke="${CR}" stroke-width="2" stroke-linecap="round" fill="none"/><path d="M24 7l-1 7-6-6z" fill="${CR}" ${ST}/><path d="M8 23l-2-4 4 2zM11 20l-3-1 2-2z" fill="${CR}" ${ST}/>`,
slash:`<path d="M8 24Q10 9 24 8Q15 12 8 24z" fill="${CR}" ${ST}/>`,
burst:`<path d="M16 5l2.4 6.2 6.6-.8-4.2 5.2 4.2 5.2-6.6-.8L16 27l-2.4-6.2-6.6.8 4.2-5.2L7 11.4l6.6.8z" fill="${CR}" ${ST}/>`,
heart:`<path d="M16 25C6 18 7 9 12.5 9c2 0 3.5 1.2 3.5 3 0-1.8 1.5-3 3.5-3C25 9 26 18 16 25z" fill="${CR}" ${ST}/>`,
shield:`<path d="M16 6l8 3v7c0 5-4 8-8 10-4-2-8-5-8-10V9z" fill="${CR}" ${ST}/><path d="M16 9v14" ${ST} fill="none" opacity=".5"/>`,
chev:`<path d="M8 9l7 7-7 7M16 9l7 7-7 7" fill="none" stroke="${CR}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`,
chevb:`<path d="M24 9l-7 7 7 7M16 9l-7 7 7 7" fill="none" stroke="${CR}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`,
swap:`<path d="M7 12h16l-4-4M25 20H9l4 4" fill="none" stroke="${CR}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`,
wall:`<rect x="6" y="8" width="9" height="6" fill="${CR}" ${ST}/><rect x="17" y="8" width="9" height="6" fill="${CR}" ${ST}/><rect x="11" y="16" width="9" height="6" fill="${CR}" ${ST}/><rect x="6" y="16" width="4" height="6" fill="${CR}" ${ST}/><rect x="21" y="16" width="5" height="6" fill="${CR}" ${ST}/>`,
moon:`<path d="M20 7a10 10 0 1 0 5 15 8 8 0 0 1-5-15z" fill="${CR}" ${ST}/><path d="M22 8h5l-5 5h5" fill="none" ${ST}/>`,
flame:`<path d="M16 5c1 5 7 8 7 14a7 7 0 0 1-14 0c0-3 2-4 3-7 1 2 2 3 3 3 0-3-1-6 1-10z" fill="${CR}" ${ST}/>`,
drop:`<path d="M16 5C12 12 8 15 8 20a8 8 0 0 0 16 0c0-5-4-8-8-15z" fill="${CR}" ${ST}/>`,
ghost:`<path d="M8 25V14a8 8 0 0 1 16 0v11l-3-3-2.5 3-2.5-3-2.5 3-2.5-3z" fill="${CR}" ${ST}/><circle cx="13" cy="14" r="1.8" fill="${INK}"/><circle cx="19" cy="14" r="1.8" fill="${INK}"/>`,
skull:`<path d="M16 6c-5 0-8 3-8 8 0 3 1 4 3 5v4h10v-4c2-1 3-2 3-5 0-5-3-8-8-8z" fill="${CR}" ${ST}/><circle cx="12.5" cy="14" r="2" fill="${INK}"/><circle cx="19.5" cy="14" r="2" fill="${INK}"/>`};
const MARK={
vent:`<path d="M20 25h6a2.5 2.5 0 1 0-2.5-2.5M19 28h4" fill="none" stroke="${CR}" stroke-width="1.8" stroke-linecap="round"/>`,
foudre:`<path d="M25 18l-4 6h3l-2 5 6-7h-3z" fill="${CR}" ${ST}/>`,
lumiere:`<circle cx="24" cy="24" r="2.6" fill="${CR}" ${ST}/><path d="M24 18.5v2M24 27.5v2M18.5 24h2M27.5 24h2" stroke="${CR}" stroke-width="1.6" stroke-linecap="round"/>`,
tenebres:`<path d="M26 19a5 5 0 1 0 2 8 4 4 0 0 1-2-8z" fill="${CR}" ${ST}/>`};

// --- dessins propres à chaque sort (clé = id du sort), lot 1 : Porte-Lanterne ---
const BR='#c9a45c',FL='#ff9a3c',FY='#ffd678';
const T=(x,y,s,r,c)=>`<g transform="translate(${x} ${y}) rotate(${r||0}) scale(${s})">${c}</g>`;
const lan=(x,y,s,r,fl)=>T(x,y,s,r,`<path d="M-3 -9Q0 -14 3 -9" fill="none" ${ST}/><path d="M-6 -8h12l-2-3h-8z" fill="${BR}" ${ST}/><path d="M-5 -8h10l1.5 14h-13z" fill="${fl=='off'?'#b9b2c4':'#ffeab0'}" ${ST}/>`+(fl=='off'?`<path d="M-2 -2h4M-2 2h4" stroke="${INK}" stroke-opacity=".4" stroke-width="1" fill="none"/>`:`<path d="M0 -4c2 2.5 3.4 4.5 3.4 6.5a3.4 3.4 0 0 1-6.8 0c0-2 3.4-4 3.4-6.5z" fill="${FL}" ${ST}/><path d="M0 0c1 1 1.6 2 1.6 3a1.6 1.6 0 0 1-3.2 0c0-1 1.6-2 1.6-3z" fill="${FY}"/>`)+`<rect x="-6.5" y="6" width="13" height="3.2" rx="1" fill="${BR}" ${ST}/>`);
const fist=(x,y,s,r)=>T(x,y,s,r,`<path d="M-7-4h11a3 3 0 0 1 3 3v8a4 4 0 0 1-4 4h-8a3 3 0 0 1-3-3v-9a3 3 0 0 1 3-3z" fill="${CR}" ${ST}/><path d="M-4-4v5M0-4v5M4-4v5" fill="none" ${ST} opacity=".55"/>`);
const bolt=(x,y,s,r,f)=>T(x,y,s,r,`<path d="M3-11L-6 1h5l-3 11 10-13h-5z" fill="${f||'#ffe872'}" ${ST}/>`);
const lines=(a)=>a.map(([x1,y1,x2,y2])=>`<path d="M${x1} ${y1}L${x2} ${y2}" stroke="${CR}" stroke-width="1.8" stroke-linecap="round" fill="none"/>`).join('');
const foot=(x,y,r)=>T(x,y,1,r,`<ellipse cx="0" cy="0" rx="2.6" ry="4" fill="${CR}" ${ST}/><ellipse cx="0" cy="6" rx="2" ry="2.2" fill="${CR}" ${ST}/>`);
const GS={
coup:()=>`<path d="M5 24Q8 8 22 6" fill="none" stroke="${CR}" stroke-width="1.6" stroke-dasharray="2 2.5" stroke-linecap="round"/>`+lan(19,17,.95,-38),
balayage:()=>`<path d="M4 22Q16 2 28 22Q16 12 4 22z" fill="${CR}" ${ST}/>`+lines([[6,25,11,22],[16,26,16,21],[26,25,21,22]]),
charge:()=>lines([[2,12,9,12],[1,17,9,17],[3,22,10,22]])+lan(19,17,.95,90),
garde:()=>`<path d="M16 5l9 3v8c0 5-4.5 8.5-9 10.5-4.5-2-9-5.5-9-10.5V8z" fill="${CR}" ${ST}/>`+lan(16,16.5,.62,0),
boutoir:()=>`<path d="M16 3l2 5 5-2-2 5 6 1-5 3 4 4-6-1 0 6-4-4-4 4 0-6-6 1 4-4-5-3 6-1-2-5 5 2z" fill="#ffe08a" ${ST}/>`+fist(15,17,.8,-18),
bourrasque:()=>lan(14,17,.8,0)+`<path d="M18 9h6a2.5 2.5 0 1 0-2.5-2.5M19 15h8a2.8 2.8 0 1 1-2.8 2.8M18 22h5" fill="none" stroke="${CR}" stroke-width="2" stroke-linecap="round"/>`,
eteinte:()=>lan(16,19,.85,0,'off')+`<path d="M16 4c-3 2 3 3 0 5s3 3 0 5" fill="none" stroke="${CR}" stroke-width="1.8" stroke-linecap="round" opacity=".85"/>`,
poing:()=>bolt(20,13,1.1,12,'#ffe872')+fist(13,19,.85,-10),
ardente:()=>`<path d="M16 2c2 4 7 6 7 11a7 7 0 0 1-14 0c0-3 2-3 3-6 1.5 1.5 2 2 3 2 0-2-1-4 1-7z" fill="${FL}" ${ST}/>`+lan(16,19,.7,0),
voile:()=>lan(16,17,.68,0)+`<path d="M5 8Q16 3 27 8l-2 17q-4 3-9 0-5 3-9 0z" fill="#8a6ad0" fill-opacity=".8" ${ST}/><path d="M11 9l-1 14M16 8v16M21 9l1 14" fill="none" stroke="${CR}" stroke-opacity=".5" stroke-width="1"/>`,
rempart:()=>`<rect x="5" y="15" width="9" height="6" fill="${CR}" ${ST}/><rect x="16" y="15" width="9" height="6" fill="${CR}" ${ST}/><rect x="10" y="22" width="9" height="5" fill="${CR}" ${ST}/><rect x="5" y="22" width="4" height="5" fill="${CR}" ${ST}/><rect x="20" y="22" width="5" height="5" fill="${CR}" ${ST}/>`+[[8,12,.8],[16,9,1],[23,12,.75]].map(([x,y,s])=>T(x,y,s,0,`<path d="M0-6c1.5 2.5 3 3.5 3 5.5a3 3 0 0 1-6 0c0-2 3-3 3-5.5z" fill="${FL}" ${ST}/>`)).join(''),
fracas:()=>`<circle cx="16" cy="16" r="11" fill="none" stroke="${CR}" stroke-width="1.5" stroke-dasharray="3 3" opacity=".8"/>`+bolt(16,16,1.3,0,'#ffe872')+lines([[4,16,8,16],[24,16,28,16]]),
sillage:()=>lines([[3,9,12,9],[2,16,10,16],[4,23,12,23]])+foot(19,10,35)+foot(24,20,35),
linceul:()=>lan(16,18,.8,0,'off')+`<path d="M8 12Q16 3 24 12l1 14-3-3-3 3-3-3-3 3-3-3-3 3z" fill="${CR}" fill-opacity=".92" ${ST}/><circle cx="13" cy="16" r="1.5" fill="${INK}"/><circle cx="19" cy="16" r="1.5" fill="${INK}"/>`,
aube:()=>`<path d="M7 21a9 9 0 0 1 18 0z" fill="#ffe08a" ${ST}/>`+lines([[16,6,16,9],[7,10,9,12],[25,10,23,12],[3,17,6,17],[26,17,29,17]])+`<path d="M3 22h26" stroke="${CR}" stroke-width="2" stroke-linecap="round"/>`+lan(16,25.5,.42,0)};
const VAR=['arrow','slash','burst'];
function kind(s){if(s.invoque)return'ghost';if(s.sacrifice)return'skull';if(s.healA||s.healAll||s.heal)return'heart';if(s.garde)return'shield';if(s.charge)return'chev';if(s.recul)return'chevb';if(s.tp||s.swap)return'swap';if(s.mur)return'wall';if(s.sleep)return'moon';if(s.rage)return'flame';if(s.parAllie)return'ghost';if(s.drain&&!s.aoe)return'drop';if(s.aoe)return'burst';if(s.los)return'arrow';return'slash'}
function make(id,s,pal){const h=hash(id),k=kind(s),e=s.elem||'n',n=1+h%4,a0=h%360,uid='s'+h.toString(36);
let dots='';for(let i=0;i<n;i++){const a=(a0+i*(360/n)*0.8)*Math.PI/180;dots+=`<circle cx="${(16+13.3*Math.cos(a)).toFixed(1)}" cy="${(16+13.3*Math.sin(a)).toFixed(1)}" r="1.5" fill="${CR}" fill-opacity=".9"/>`}
let mod='';if(s.etats||s.etatsSoi)mod+=`<path d="M6 5l1.1 2.6 2.8.3-2.1 1.8.6 2.7L6 11l-2.4 1.4.6-2.7L2.1 7.9l2.8-.3z" transform="translate(1 -1)" fill="#ffe872" ${ST}/>`;
if(s.push)mod+=`<path d="M3 26h7m-3-3l3 3-3 3" fill="none" stroke="${CR}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`;
if(s.drain&&k!='drop')mod+=`<path d="M27 5c-2 3-3 4-3 6a3 3 0 0 0 6 0c0-2-1-3-3-6z" fill="#ff7a8a" ${ST}/>`;
if(s.aoe&&k!='burst')mod+=`<circle cx="16" cy="16" r="11" fill="none" stroke="${CR}" stroke-width="1.2" stroke-dasharray="2 3" opacity=".8"/>`;
return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><defs><radialGradient id="${uid}" cx=".35" cy=".3" r=".9"><stop offset="0" stop-color="${pal[0]}"/><stop offset="1" stop-color="${pal[1]}"/></radialGradient></defs><circle cx="16" cy="16" r="15" fill="url(#${uid})" ${ST}/>${dots}${mod}<g transform="translate(0 ${GS[s.id]?0:-1})${(!GS[s.id]&&VAR.includes(k))?` rotate(${(h%9-4)*7} 16 16)${k!=='burst'&&h%2?' translate(32 0) scale(-1 1)':''}`:''}">${GS[s.id]?GS[s.id]():G[k]}</g>${MARK[e]||''}</svg>`}
// s = sort de DATA.classes[x].sorts ; pour un sort de Lueur : ICOS.lueur(cle, DATA.lueurs[cle].sort)
const sort=s=>make(s.id,s,PAL[s.elem||'n']||PAL.n);
const lueur=(cle,s)=>make('lu_'+cle,Object.assign({los:0},s,{elem:null,drain:s.drain||s.dmg&&s.drain}),LUE[cle]||PAL.n);
return{sort,lueur,PAL,LUE,kind}})();
