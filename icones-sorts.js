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
const ar=(x1,y1,x2,y2)=>{const a=Math.atan2(y2-y1,x2-x1)*180/Math.PI,L=Math.hypot(x2-x1,y2-y1);return T(x1,y1,1,a,`<path d="M0 0H${L}" stroke="${INK}" stroke-opacity=".75" stroke-width="4" stroke-linecap="round"/><path d="M0 0H${L}" stroke="${CR}" stroke-width="2" stroke-linecap="round"/><path d="M${L+3} 0l-5-3.6v7.2z" fill="${CR}" ${ST}/><path d="M0 0l-3-3M0 0l-3 3M3 0l-3-3M3 0l-3 3" stroke="${CR}" stroke-width="1.5" stroke-linecap="round"/>`)};
const star=(x,y,s)=>T(x,y,s,0,`<path d="M0-4L1.2-1.2 4 0 1.2 1.2 0 4-1.2 1.2-4 0-1.2-1.2z" fill="#fff4b8" ${ST}/>`);
const bird=(x,y,s,r)=>T(x,y,s,r,`<path d="M-7 0Q-3.5-5 0 0Q3.5-5 7 0Q3.5-2 0 3Q-3.5-2-7 0z" fill="${CR}" ${ST}/>`);
const sun=(x,y,r)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="#ffe08a" ${ST}/>`+lines([[x,y-r-3,x,y-r-1],[x,y+r+1,x,y+r+3],[x-r-3,y,x-r-1,y],[x+r+1,y,x+r+3,y]]);
const moonc=(x,y)=>`<path d="M${x+3} ${y-5}a6 6 0 1 0 3 9 5 5 0 0 1-3-9z" fill="${CR}" ${ST}/>`;
const cloud=(x,y,s)=>T(x,y,s,0,`<path d="M-9 5a4.5 4.5 0 0 1 1-8.5A6 6 0 0 1 3-6a5 5 0 0 1 6 4.5A4 4 0 0 1 9 5z" fill="${CR}" ${ST}/>`);
const flm=(x,y,s)=>T(x,y,s,0,`<path d="M0-11c1 5 7 8 7 14a7 7 0 0 1-14 0c0-3 2-4 3-7 1 2 2 3 3 3 0-3-1-6 1-10z" fill="#ffb04a" ${ST}/>`);
const spi=(x,y,s)=>T(x,y,s,0,`<path d="M0 0a2 2 0 0 1 4 0a4 4 0 0 1-8 0a6.5 6.5 0 0 1 13 0a9 9 0 0 1-18 0" fill="none" stroke="${INK}" stroke-opacity=".75" stroke-width="4.4" stroke-linecap="round"/><path d="M0 0a2 2 0 0 1 4 0a4 4 0 0 1-8 0a6.5 6.5 0 0 1 13 0a9 9 0 0 1-18 0" fill="none" stroke="${CR}" stroke-width="2.2" stroke-linecap="round"/>`);
const dots=a=>a.map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${CR}" ${ST}/>`).join('');
const shov=(x,y,s,r)=>T(x,y,s,r,`<path d="M0-12v14" stroke="${INK}" stroke-opacity=".75" stroke-width="4" stroke-linecap="round"/><path d="M0-12v14" stroke="${CR}" stroke-width="2" stroke-linecap="round"/><path d="M-4-13h8" stroke="${CR}" stroke-width="2.4" stroke-linecap="round"/><path d="M-5 2h10l-1 8Q0 14-4 10z" fill="${CR}" ${ST}/>`);
const skl=(x,y,s)=>T(x,y,s,0,`<path d="M0-8c-6 0-9 4-9 9 0 3 1 4 3 5v4h12v-4c2-1 3-2 3-5 0-5-3-9-9-9z" fill="${CR}" ${ST}/><circle cx="-3.5" cy="0" r="2.2" fill="${INK}"/><circle cx="3.5" cy="0" r="2.2" fill="${INK}"/><path d="M-2 9v3M0 9v3M2 9v3" stroke="${INK}" stroke-width="1"/>`);
const gho=(x,y,s)=>T(x,y,s,0,`<path d="M-8 9V-1a8 8 0 0 1 16 0v10l-3-3-2.5 3-2.5-3-2.5 3-2.5-3z" fill="${CR}" ${ST}/><circle cx="-3" cy="-1" r="1.8" fill="${INK}"/><circle cx="3" cy="-1" r="1.8" fill="${INK}"/>`);
const mound=`<path d="M3 27Q16 10 29 27z" fill="#8a6240" ${ST}/>`;
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
aube:()=>`<path d="M7 21a9 9 0 0 1 18 0z" fill="#ffe08a" ${ST}/>`+lines([[16,6,16,9],[7,10,9,12],[25,10,23,12],[3,17,6,17],[26,17,29,17]])+`<path d="M3 22h26" stroke="${CR}" stroke-width="2" stroke-linecap="round"/>`+lan(16,25.5,.42,0),
// lot 2 : Archer Farceur
tir:()=>`<circle cx="22" cy="10" r="6" fill="none" stroke="${CR}" stroke-width="1.5"/><circle cx="22" cy="10" r="2.6" fill="${CR}" ${ST}/>`+ar(5,26,20,12),
tir2:()=>ar(5,19,21,5)+ar(9,26,25,12),
retrait:()=>ar(10,21,25,9)+`<path d="M4 26h8m-3-3.5L4 26l5 3.5" fill="none" stroke="${CR}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
repoussant:()=>ar(3,16,16,16)+`<circle cx="21" cy="16" r="4.5" fill="${CR}" ${ST}/>`+lines([[25,12,29,10],[26,16,30,16],[25,20,29,22]]),
flecheclair:()=>ar(5,25,21,9)+bolt(22,21,.85,10),
perforant:()=>`<circle cx="16" cy="16" r="7" fill="none" stroke="${CR}" stroke-width="2.4"/>`+ar(4,16,26,16),
flechesolaire:()=>sun(22,10,3.6)+ar(5,26,19,14),
flecheombre:()=>moonc(21,10)+ar(5,26,19,14),
pluie:()=>ar(8,5,8,15)+ar(16,11,16,23)+ar(24,5,24,15),
pluienuit:()=>moonc(8,9)+ar(15,7,15,18)+ar(23,12,23,24),
ricochet:()=>`<path d="M4 24L13 13L19 21L25 11" fill="none" stroke="${INK}" stroke-opacity=".75" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 24L13 13L19 21L25 11" fill="none" stroke="${CR}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`+T(26.5,9,1,-55,`<path d="M3 0l-5-3.6v7.2z" fill="${CR}" ${ST}/>`),
tonnerre:()=>ar(4,26,15,15)+bolt(21,14,1.35,12),
averse:()=>star(9,8,1)+star(21,7,.8)+star(15,16,1.3)+star(8,23,.8)+star(24,22,1)+lines([[9,12,9,15],[21,10,21,13],[24,26,24,28]]),
corbeaux:()=>bird(11,10,1.2,-10)+bird(22,15,1.1,8)+bird(10,23,1,5),
dernierrayon:()=>`<path d="M5 27L22 10" stroke="#ffe08a" stroke-opacity=".55" stroke-width="7" stroke-linecap="round"/>`+ar(5,27,20,12)+sun(23,8,4),
// lot 3 : Mage Distrait
eclair:()=>bolt(16,16,1.3,0),
cendres:()=>cloud(16,12,1.1)+dots([[9,22,1.6],[15,25,1.3],[21,21,1.6],[24,26,1.2],[12,27,1]]),
flaque:()=>`<ellipse cx="16" cy="23" rx="10.5" ry="4" fill="#ff7a3c" ${ST}/>`+flm(16,15,.95),
fumee:()=>`<path d="M16 5l8 3v7c0 5-4 8-8 10-4-2-8-5-8-10V8z" fill="${CR}" fill-opacity=".9" ${ST}/>`+cloud(16,19,.95),
chaine:()=>`<path d="M9 11L16 16L23 21" stroke="${CR}" stroke-width="1.6" stroke-dasharray="2 2" fill="none"/>`+bolt(8,9,.75,0)+bolt(16,15,.9,0)+bolt(24,22,.75,0),
rafale:()=>`<path d="M4 11h13a3.2 3.2 0 1 0-3.2-3.2M4 17h20a3.5 3.5 0 1 1-3.5 3.5M4 23h10" fill="none" stroke="${INK}" stroke-opacity=".75" stroke-width="4.4" stroke-linecap="round"/><path d="M4 11h13a3.2 3.2 0 1 0-3.2-3.2M4 17h20a3.5 3.5 0 1 1-3.5 3.5M4 23h10" fill="none" stroke="${CR}" stroke-width="2.2" stroke-linecap="round"/>`,
rayon:()=>`<path d="M3 16h19" stroke="#ffe08a" stroke-opacity=".55" stroke-width="9" stroke-linecap="round"/><path d="M3 16h19" stroke="${CR}" stroke-width="3" stroke-linecap="round"/>`+sun(24,16,3.4),
tempete:()=>cloud(16,10,1.15)+lines([[8,19,5,26],[14,20,11,27],[20,20,17,27],[26,19,23,26]])+dots([[27,25,1.3],[8,27,1.2]]),
foudroiement:()=>cloud(16,10,.9)+bolt(16,20,1.1,0),
tourbillon:()=>spi(16,16,.95),
orage:()=>cloud(16,10,.95)+bolt(8,22,.58,0)+bolt(16,23,.7,0)+bolt(24,22,.58,0),
maree:()=>`<path d="M3 17Q8 8 14 15T25 14Q29 13 30 16V29H3z" fill="${CR}" ${ST}/>`+dots([[9,22,1.3],[16,24,1.6],[23,21,1.2],[20,26,1]]),
cyclone:()=>spi(16,16,1.25)+lines([[3,6,8,8],[29,26,24,24]]),
lance:()=>`<path d="M4 28L21 11" stroke="#ffe08a" stroke-opacity=".55" stroke-width="7" stroke-linecap="round"/><path d="M5 27L21 11" stroke="${INK}" stroke-opacity=".75" stroke-width="4" stroke-linecap="round"/><path d="M5 27L21 11" stroke="${CR}" stroke-width="2" stroke-linecap="round"/><g transform="translate(21 11) rotate(-45)"><path d="M8 0L-1-3.8-1 3.8z" fill="${CR}" ${ST}/></g>`+star(26,22,.9),
eclipsep:()=>`<circle cx="16" cy="16" r="9.5" fill="none" stroke="#ffe08a" stroke-width="2.2"/><circle cx="16" cy="16" r="7.5" fill="${INK}" ${ST}/>`+lines([[16,2.5,16,5],[16,27,16,29.5],[2.5,16,5,16],[27,16,29.5,16],[6,6,8,8],[24,24,26,26],[26,6,24,8],[6,26,8,24]]),
// lot 4 : Fossoyeur
pelle:()=>shov(16,16,1.25,38),
squelette:()=>skl(16,13,1.1)+`<path d="M6 25l20 4M6 29l20-4" stroke="${CR}" stroke-width="2.4" stroke-linecap="round"/>`,
spectre:()=>gho(16,15,1.3),
terre:()=>mound+shov(21,13,.8,22),
pelletee:()=>shov(11,19,1.05,-40)+dots([[19,9,1.7],[23,13,1.3],[25,8,1.2],[21,5,1],[27,12,1]]),
heure:()=>`<path d="M10 5h12c0 7-4 9-6 11 2 2 6 4 6 11H10c0-7 4-9 6-11-2-2-6-4-6-11z" fill="${CR}" ${ST}/><path d="M12 24h8l-2-3h-4z" fill="#ffd678"/><path d="M8 5h16M8 27h16" stroke="${CR}" stroke-width="2.6" stroke-linecap="round"/>`,
sacrifice:()=>`<path d="M16 3l2.6 6.8 7.2-.9-4.6 5.7 4.6 5.7-7.2-.9L16 26l-2.6-6.8-7.2.9 4.6-5.7-4.6-5.7 7.2.9z" fill="#ff7a8a" ${ST}/>`+skl(16,15,.85),
renfort:()=>mound+`<rect x="13" y="9" width="6" height="15" rx="3" fill="#9ac86a" ${ST}/><rect x="11.5" y="5" width="2.6" height="6" rx="1.3" fill="#9ac86a" ${ST}/><rect x="14.7" y="3" width="2.6" height="7" rx="1.3" fill="#9ac86a" ${ST}/><rect x="17.9" y="5" width="2.6" height="6" rx="1.3" fill="#9ac86a" ${ST}/>`,
malediction:()=>`<rect x="6" y="7" width="20" height="19" rx="2" fill="${CR}" ${ST}/><rect x="6" y="7" width="20" height="5" fill="#d05a5a" ${ST}/><path d="M11 16l5 6m0-6l-5 6" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>`+bolt(23,21,.9,0),
appel:()=>mound+skl(11,15,.7)+skl(21,16,.7),
benediction:()=>`<ellipse cx="16" cy="6" rx="6" ry="2" fill="none" stroke="#ffe08a" stroke-width="2"/><path d="M13 9h6v7h7v5h-7v7h-6v-7H6v-5h7z" fill="${CR}" ${ST}/>`,
cercueil:()=>`<path d="M12 4h8l5 8-3 16H10L7 12z" fill="#9a6a3a" ${ST}/><path d="M16 9v13M12 13h8" stroke="${CR}" stroke-width="1.8" stroke-linecap="round"/>`+bolt(24,23,.75,0),
vent_large:()=>`<path d="M3 22q3-4 6 0t6 0t6 0t6 0M3 27q3-4 6 0t6 0t6 0t6 0" fill="none" stroke="${CR}" stroke-width="2.2" stroke-linecap="round"/><path d="M5 11h13a3.2 3.2 0 1 0-3.2-3.2M5 16h18" fill="none" stroke="${CR}" stroke-width="2.2" stroke-linecap="round"/>`,
legion:()=>`<rect x="10" y="6" width="12" height="17" rx="3" fill="#cfc6b8" ${ST}/><path d="M12 12l3 1.5M20 12l-3 1.5" stroke="${INK}" stroke-width="1.6" stroke-linecap="round"/><circle cx="13.5" cy="15" r="1.6" fill="${INK}"/><circle cx="18.5" cy="15" r="1.6" fill="${INK}"/><path d="M13 20h6" stroke="${INK}" stroke-width="1.6"/>`+skl(6,25,.5)+skl(26,25,.5),
dernier:()=>`<path d="M5 23a11 11 0 0 1 22 0z" fill="${CR}" ${ST}/><circle cx="16" cy="10" r="2" fill="${CR}" ${ST}/><path d="M3 25h26" stroke="${CR}" stroke-width="2.6" stroke-linecap="round"/>`+lines([[7,10,9,12],[25,10,23,12],[16,3,16,6]])};
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
