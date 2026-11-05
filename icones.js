// ICÔNES : objets, ressources et étincelles dessinés en SVG (viewBox 32x32), sans ressource externe. Emoji conservés en secours.
const ICO=(()=>{
const INK='#1a1218',ST=`stroke="${INK}" stroke-opacity=".7" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round"`;
const SETC={livreur:'#b8763a',dunes:'#d8b060',soleil:'#f0b840',marais:'#6a8a5a',orage:'#6a7ad8',lucioles:'#c8e060',brumes:'#a8b8c8',greffe:'#8a6a4a',nenuphars:'#e090c0',orgues:'#6a6a7c',mirages:'#50c8c8',marees:'#3a78c8',cierges:'#e8d8a0',etoiles:'#b080f0'};
const PAL=['#c9573a','#6a9a4a','#d8a43a','#5a7ac8','#9a6ac0','#4aa8a0','#b85a7a','#8a8a96'],RAR=['#9a948a','#6aa84f','#4a90d8','#b070e0'];
const hash=s=>{let h=7;for(const c of s)h=(h*31+c.charCodeAt(0))>>>0;return h};
const shade=(c,f)=>{const n=parseInt(c.slice(1),16);return '#'+[16,8,0].map(s=>Math.max(0,Math.min(255,Math.round(((n>>s)&255)*f))).toString(16).padStart(2,'0')).join('')};
const svg=b=>`<svg class="ico" viewBox="0 0 32 32" aria-hidden="true">${b}</svg>`,P=(d,f,x='')=>`<path d="${d}" fill="${f}" ${ST.replace(/(stroke-[a-z]+)="[^"]*"\s?/g,(m,a)=>x.includes(a+'=')?'':m)} ${x}/>`,C=(x,y,r,f)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${f}" ${ST}/>`;
const has=(n,...k)=>k.some(w=>n.toLowerCase().includes(w));
const W={
sword:(c,d)=>P('M16 3L19 7V21H13V7Z',c)+P('M9 21H23V24H9Z',d)+P('M14.5 24H17.5V29H14.5Z',shade(d,.7)),
staff:(c,d)=>P('M15 9H17V30H15Z',d)+C(16,7,5,c)+`<circle cx="14.4" cy="5.4" r="1.4" fill="#fff" opacity=".6"/>`,
sceptre:(c,d)=>P('M15 12H17V30H15Z',d)+P('M16 2L22 8L16 14L10 8Z',c)+P('M12 14H20V16H12Z',d),
spear:(c,d)=>P('M15 8H17V30H15Z',d)+P('M16 1L21 9H11Z',c),
sign:(c,d)=>P('M15 4H17V30H15Z',d)+P('M6 6H26V17H6Z',c)+`<path d="M10 10H22M10 13.5H19" stroke="${INK}" stroke-width="1.6" stroke-linecap="round"/>`,
poker:(c,d)=>P('M15 5H17V30H15Z',d)+P('M17 5Q25 4 24 11',c,'fill-opacity="0"')+P('M12 27H20V30H12Z',c),
helm:(c,d)=>P('M6 22V15Q6 5 16 5Q26 5 26 15V22H20V16H12V22Z',c)+P('M15 3H17V9H15Z',d)+P('M12 16H20V19H12Z',d),
crown:(c,d)=>P('M5 24L6 9L12 16L16 6L20 16L26 9L27 24Z',c)+C(16,18,2.4,d)+C(8,20,1.2,d)+C(24,20,1.2,d),
hat:(c,d)=>P('M3 22Q16 26 29 22Q27 17 21 17Q21 6 16 6Q11 6 11 17Q5 17 3 22Z',c)+P('M11 17Q16 19 21 17V20Q16 22 11 20Z',d),
hood:(c,d)=>P('M5 28Q3 8 16 4Q29 8 27 28Q22 24 21 17Q16 21 11 17Q10 24 5 28Z',c)+P('M11 17Q16 21 21 17Q20 12 16 11Q12 12 11 17Z',shade(d,.45)),
mask:(c,d)=>P('M5 10Q16 4 27 10Q27 24 16 28Q5 24 5 10Z',c)+P('M9 13Q12 11 14 14Q12 16 9 15Z M18 14Q20 11 23 13Q23 16 20 16Z',INK)+P('M11 21Q16 25 21 21',d,'fill-opacity="0"'),
tunic:(c,d)=>P('M11 5L16 8L21 5L28 11L24 16L22 14V28H10V14L8 16L4 11Z',c)+P('M13 5Q16 10 19 5',d,'fill-opacity="0"'),
armor:(c,d)=>P('M8 5L16 8L24 5L29 10L25 16L23 14V28H9V14L7 16L3 10Z',c)+P('M16 8V28M12 16H20',d,'fill-opacity="0"')+C(16,17,2.2,d),
cape:(c,d)=>P('M10 4H22L28 28H4Z',c)+P('M10 4Q16 11 22 4',d)+C(16,7,1.6,'#e8c860'),
robe:(c,d)=>P('M12 3H20L23 10L27 30H5L9 10Z',c)+P('M12 3Q16 9 20 3',d)+P('M9 17H23',d,'fill-opacity="0"'),
boot:(c,d)=>P('M10 3H19V18Q27 19 27 26V28H8V3Z',c)+P('M8 24H27V28H8Z',d),
sandal:(c,d)=>P('M4 24Q4 18 12 18H24Q29 18 29 24V26H4Z',c)+P('M12 18V8M20 18V10',d,'fill-opacity="0" stroke-width="2.4"')+P('M10 11H22',d,'fill-opacity="0" stroke-width="2.4"'),
slipper:(c,d)=>P('M4 26Q4 15 14 15Q18 15 20 19Q29 19 29 26V27H4Z',c)+P('M4 24H29',d,'fill-opacity="0"')+C(12,15,3.2,d),
ring:(c,d)=>`<circle cx="16" cy="19" r="9" fill="none" stroke="${INK}" stroke-opacity=".7" stroke-width="5"/><circle cx="16" cy="19" r="9" fill="none" stroke="${c}" stroke-width="3"/>`+P('M12 8L16 3L20 8L16 12Z',d),
amulet:(c,d)=>P('M7 3Q16 18 25 3',d,'fill-opacity="0" stroke-width="2"')+C(16,21,8,c)+C(16,21,3.4,d),
bell:(c,d)=>P('M7 24Q9 6 16 6Q23 6 25 24Z',c)+P('M5 24H27V27H5Z',d)+C(16,29,2.2,d)+P('M15 2H17V6H15Z',d),
lantern:(c,d)=>P('M12 3H20V7H12Z',d)+P('M8 7H24V25H8Z',c)+P('M12 11H20V21H12Z','#ffe6a0')+P('M6 25H26V28H6Z',d),
bracelet:(c,d)=>`<ellipse cx="16" cy="18" rx="11" ry="8" fill="none" stroke="${INK}" stroke-opacity=".7" stroke-width="6"/><ellipse cx="16" cy="18" rx="11" ry="8" fill="none" stroke="${c}" stroke-width="3.6"/>`+C(16,10.5,2.8,d),
scarf:(c,d)=>P('M5 6H27V12H5Z',c)+P('M21 12H27V28L24 25L21 28Z',c)+P('M8 6V12M12 6V12',d,'fill-opacity="0"'),
stamp:(c,d)=>P('M12 3H20V16H12Z',d)+P('M6 16H26V22H6Z',c)+P('M5 22H27V28H5Z',shade(c,.7)),
anchor:(c,d)=>C(16,6,3,d)+P('M15 8H17V25H15Z',c)+P('M9 14H23',c,'fill-opacity="0" stroke-width="2.6"')+P('M5 19Q8 27 16 27Q24 27 27 19',c,'fill-opacity="0" stroke-width="2.6"'),
claw:(c,d)=>P('M6 28Q4 10 14 4Q10 12 14 16Q18 8 26 8Q20 14 22 20Q18 18 16 24Q14 28 6 28Z',c)
};
const kindOf=(o)=>{const n=o.n.toLowerCase(),s=o.slot;
if(s=='arme')return has(n,'bâton','houlette','veilleuse')?'staff':has(n,'sceptre','baguette','marotte','plume')?'sceptre':has(n,'lance')?'spear':has(n,'pancarte','règle')?'sign':has(n,'tisonnier')?'poker':'sword';
if(s=='tete')return has(n,'casque','heaume')?'helm':has(n,'couronne','diadème')?'crown':has(n,'chapeau','tricorne','casquette','visière','turban','bonnet')?'hat':has(n,'masque')?'mask':'hood';
if(s=='corps')return has(n,'cuirasse','armure')?'armor':has(n,'cape','manteau','pelisse')?'cape':has(n,'robe','habit','bandelettes')?'robe':'tunic';
if(s=='bottes')return has(n,'sandales')?'sandal':has(n,'chaussons','pantoufles')?'slipper':'boot';
return has(n,'anneau','bague')?'ring':has(n,'clochette')?'bell':has(n,'lanterne','cierge')?'lantern':has(n,'bracelet','brassard')?'bracelet':has(n,'écharpe')?'scarf':has(n,'tampon','étendard')?'stamp':has(n,'ancre')?'anchor':has(n,'pince')?'claw':'amulet'};
const color=o=>o.set&&SETC[o.set]||PAL[hash(o.n)%PAL.length];
const obj=o=>{try{const c=color(o),d=shade(c,.62),halo=o.r>=2?`<circle cx="16" cy="16" r="15" fill="${RAR[o.r]}" opacity=".28"/>`:'';return svg(halo+W[kindOf(o)](c,d))}catch(e){return o.e||''}};
// Ressources : une icône par ressource de base ; reliques = éclat teinté par boss
const RS={
braise:()=>P('M16 3Q26 12 24 21Q22 29 16 29Q9 29 8 21Q7 14 16 3Z','#e8541e')+P('M16 13Q21 19 19 24Q17 27 14 25Q11 22 16 13Z','#ffc04a'),
champi:()=>P('M4 16Q4 5 16 5Q28 5 28 16Z','#d8c8a8')+P('M13 16H19V28H13Z','#f0e8d0')+C(10,11,2,'#fff')+C(20,10,1.6,'#fff')+C(16,13,1.4,'#fff'),
laine:()=>C(10,16,6,'#f4f0e8')+C(20,14,6,'#f4f0e8')+C(15,21,6,'#f4f0e8')+C(15,12,5,'#f4f0e8'),
cendre:()=>P('M4 24Q4 14 12 14Q14 8 20 10Q26 10 26 16Q30 18 28 24Z','#8a8890')+P('M8 24Q10 20 14 22M18 22Q22 19 25 23','#5a5860','fill-opacity="0"'),
roseau:()=>P('M8 29Q6 14 9 3','#6a8a3a','fill-opacity="0" stroke-width="2.4"')+P('M15 29Q14 14 15 5','#8aa84a','fill-opacity="0" stroke-width="2.4"')+P('M22 29Q22 16 20 7','#6a8a3a','fill-opacity="0" stroke-width="2.4"')+P('M13 3Q15 0 17 3Q17 8 15 9Q13 8 13 3Z','#8a5a30'),
sable:()=>P('M3 27Q10 10 16 12Q23 10 29 27Z','#e0c070')+P('M9 27Q13 19 16 20','#b89040','fill-opacity="0"'),
fil:()=>C(16,17,10,'#c85a5a')+P('M8 12Q16 18 24 12M7 17Q16 23 25 17M9 22Q16 27 23 22','#7a2a2a','fill-opacity="0"')+P('M24 8Q29 4 28 9','#c85a5a','fill-opacity="0" stroke-width="1.6"'),
chaussette:()=>P('M10 3H20V17Q28 20 27 26Q26 29 20 28L10 22Z','#d8a0d0')+P('M10 8H20','#8a4a88','fill-opacity="0" stroke-width="2.4"'),
eclat:()=>P('M16 2L19 12L30 16L19 20L16 30L13 20L2 16L13 12Z','#ffd84a')+C(16,16,2.4,'#fff6c0'),
gravat:()=>P('M4 14H15V22H4Z','#9a8a7a')+P('M17 10H28V18H17Z','#8a7a6a')+P('M9 22H22V29H9Z','#7a6a5a'),
mousse:()=>P('M4 24Q3 14 11 12Q12 6 18 8Q26 8 27 16Q30 22 24 25Z','#a8c8b0')+P('M10 22Q14 16 20 20','#6a8a78','fill-opacity="0"'),
toison:()=>C(10,17,6,'#d0d8e8')+C(20,15,7,'#e0e8f4')+C(15,21,6,'#d0d8e8'),
encre:()=>P('M10 14H22L24 28H8Z','#2a2a4a')+P('M13 8H19V14H13Z','#caa86a')+P('M14 3L18 3L17 8H15Z','#e8e0d0')+C(16,21,2.4,'#6a6a9a'),
nenuphar:()=>P('M3 22Q16 30 29 22Q16 26 3 22Z','#5a8a5a')+P('M16 20Q10 16 12 8Q16 12 16 20Q16 12 20 8Q22 16 16 20Z','#f4c8e0')+C(16,17,1.6,'#ffd860'),
tuyau:()=>P('M9 4H15V28H9Z M17 7H23V28H17Z','#6a6a7c')+P('M9 10H15M17 14H23','#3a3a48','fill-opacity="0"'),
verre:()=>C(16,15,11,'#7ad8e0')+`<path d="M9 11Q12 7 17 8" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" opacity=".8"/>`+P('M10 27H22L20 24H12Z','#4a6a78'),
perle:()=>P('M4 18Q4 6 16 6Q28 6 28 18Q28 27 16 27Q4 27 4 18Z','#d8ccd8')+C(16,17,5,'#fff8ff')+`<circle cx="14.4" cy="15.4" r="1.4" fill="#fff"/>`,
cire:()=>P('M11 10H21V28H11Z','#f0e4b0')+P('M16 2Q20 7 16 10Q12 7 16 2Z','#ffb838')+P('M11 14Q16 17 21 14','#b8a860','fill-opacity="0"'),
os:()=>P('M4 9Q1 6 5 5Q7 3 9 6L22 19Q26 18 27 22Q30 24 27 27Q24 29 22 26Q19 27 18 23L6 12Q3 12 4 9Z','#f0ead8')
};
const relic=(k,name)=>{const c=PAL[hash(k+name)%PAL.length];return svg(P('M16 2L25 9L22 28H10L7 9Z',c)+P('M16 2V28M7 9L16 14L25 9','#ffffff','fill-opacity="0" stroke-opacity=".4"')+C(16,17,3,'#ffe8a0'))};
const res=k=>{try{if(RS[k])return svg(RS[k]());if(/^rel\d+$/.test(k))return relic(k,k);return ''}catch(e){return ''}};
const spark=(e)=>{try{const c=PAL[hash(e.n)%PAL.length];return svg(`<circle cx="16" cy="16" r="14" fill="${c}" opacity=".25"/>`+P('M16 3L19.5 12.5L29 16L19.5 19.5L16 29L12.5 19.5L3 16L12.5 12.5Z','#ffe68a')+C(16,16,2.6,'#fff'))}catch(x){return '✨'}};
return{obj,res,spark,kindOf,W,RS}})();
