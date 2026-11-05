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

// Motifs (dessinés dans une boîte -6..6) posés sur la forme de base : un motif + deux couleurs propres à chaque objet.
const MO={
flame:'M0 -6Q5 -1 4 3Q3 6 0 6Q-3 6 -4 3Q-5 -1 0 -6Z',leaf:'M-5 5Q-6 -4 5 -5Q6 4 -5 5ZM-4 4L3 -3',star:'M0 -6L1.6 -1.6L6 0L1.6 1.6L0 6L-1.6 1.6L-6 0L-1.6 -1.6Z',moon:'M2 -6Q-6 -3 -4 3Q0 7 5 4Q-1 3 2 -6Z',
drop:'M0 -6Q5 1 4 3Q3 6 0 6Q-3 6 -4 3Q-5 1 0 -6Z',bolt:'M2 -6L-4 1H0L-2 6L4 -1H0Z',cloud:'M-5 4Q-7 -1 -2 -1Q-1 -6 3 -3Q7 -3 5 4Z',eye:'M-6 0Q0 -6 6 0Q0 6 -6 0ZM-1.8 0A1.8 1.8 0 1 0 1.8 0A1.8 1.8 0 1 0 -1.8 0Z',
skull:'M-4 1Q-5 -6 0 -6Q5 -6 4 1L2 2V5H-2V2ZM-2.6 -1.6A.9.9 0 1 0 -.8 -1.6A.9.9 0 1 0 -2.6 -1.6ZM.8 -1.6A.9.9 0 1 0 2.6 -1.6A.9.9 0 1 0 .8 -1.6Z',feather:'M-4 6Q-6 -2 4 -6Q6 2 -4 6ZM-4 6L2 -3',hex:'M0 -6L5 -3V3L0 6L-5 3V-3ZM0 -2.4L2 -1.2V1.2L0 2.4L-2 1.2V-1.2Z',
crown:'M-6 4L-5 -3L-2 0L0 -5L2 0L5 -3L6 4Z',flower:'M0 -6Q3 -3 0 0Q-3 -3 0 -6ZM6 -1Q3 3 0 0Q3 -3 6 -1ZM-6 -1Q-3 -3 0 0Q-3 3 -6 -1ZM3 6Q0 3 0 0Q3 1 3 6ZM-3 6Q-3 1 0 0Q0 3 -3 6Z',sock:'M-2 -6H3V1Q6 2 5 5H-3Q-4 2 -2 0Z',
wave:'M-6 -1Q-3 -5 0 -1T6 -1M-6 4Q-3 0 0 4T6 4',horn:'M-5 6Q-6 -4 3 -6Q-2 -2 0 6Z',shell:'M0 6L-6 -1Q0 -8 6 -1ZM0 6V-4M-3 4L-3.6 -3M3 4L3.6 -3',sun:'M-3 0A3 3 0 1 0 3 0A3 3 0 1 0 -3 0ZM0 -6V-4.5M0 6V4.5M-6 0H-4.5M6 0H4.5M-4.2 -4.2L-3.2 -3.2M4.2 4.2L3.2 3.2M4.2 -4.2L3.2 -3.2M-4.2 4.2L-3.2 3.2',
mush:'M-6 0Q-6 -6 0 -6Q6 -6 6 0ZM-2 0H2V6H-2Z',ink:'M-1.6 -6H1.6V-3H3.5L4 6H-4L-3.5 -3H-1.6Z',bell:'M-4 4Q-3 -5 0 -5Q3 -5 4 4ZM-1.2 5.4A1.2 1.2 0 1 0 1.2 5.4A1.2 1.2 0 1 0 -1.2 5.4Z',key:'M-6 -3A3 3 0 1 0 0 -3A3 3 0 1 0 -6 -3ZM-1.5 -1L5 5M3 3L5 1',
shield:'M-5 -5H5V1Q5 5 0 6Q-5 5 -5 1Z',ash:'M-5 3A1.6 1.6 0 1 0 -1.8 3A1.6 1.6 0 1 0 -5 3ZM1 4A1.4 1.4 0 1 0 3.8 4A1.4 1.4 0 1 0 1 4ZM-2 -2A1.8 1.8 0 1 0 1.6 -2A1.8 1.8 0 1 0 -2 -2ZM2 -5A1.2 1.2 0 1 0 4.4 -5A1.2 1.2 0 1 0 2 -5Z',sand:'M-6 5Q-2 -3 0 -2Q3 -4 6 5Z',
book:'M-5 -5H5V5H-5ZM-3 -5V5',lantern:'M-3 -5H3V-3H4V4H-4V-3H-3ZM-1.5 -1Q0 -4 1.5 -1Q1.5 2 0 2Q-1.5 2 -1.5 -1Z',anchor:'M-1 -6H1V4H-1ZM-4 -2H4M-5 1Q-4 6 0 6Q4 6 5 1',seal:'M0 -6L5 -3V3L0 6L-5 3V-3ZM-2 -1H2M-2 2H2'};
const motif=(m,x,y,k,f)=>`<g transform="translate(${x} ${y}) scale(${k})"><path d="${MO[m]}" fill="${f}" stroke="${INK}" stroke-opacity=".75" stroke-width="${(1.1/k).toFixed(2)}" stroke-linejoin="round" stroke-linecap="round" fill-rule="evenodd"/></g>`;
const SM={livreur:['lantern'],marais:['leaf'],dunes:['sand'],soleil:['sun'],orage:['bolt'],lucioles:['star'],brumes:['cloud'],greffe:['book'],nenuphars:['flower'],orgues:['hex'],mirages:['eye'],marees:['drop'],cierges:['lantern'],etoiles:['star']};
const SC2={livreur:['#b8763a','#f0d090'],marais:['#6a8a5a','#c8e0a8'],dunes:['#d8b060','#fff0b8'],soleil:['#f0b840','#fff4c0'],orage:['#5a68c8','#f4e860'],lucioles:['#98b830','#f0f890'],brumes:['#8898a8','#e8eef4'],greffe:['#7a5a3a','#e8d4a0'],nenuphars:['#d070a8','#fadcec'],orgues:['#5a5a68','#b8b8cc'],mirages:['#38b8b8','#c0f4f4'],marees:['#2a60b0','#90ccf4'],cierges:['#d8c890','#fff4c0'],etoiles:['#8a58d8','#e8d4ff']};
// Objets hors panoplie : nom -> [motif, couleur principale, couleur secondaire]
const LK={
'Tisonnier':['flame','#5a4a40','#e8541e'],'Épée de braise':['flame','#c8502a','#ffb040'],'Sceptre-champignon':['mush','#c85a4a','#e8d8b8'],'Plume du Chambellan':['feather','#e8e0d0','#6a5a8a'],'Lance de libellule':['bolt','#4ab0c8','#2a6a8a'],'Baguette de la Duchesse':['ash','#8a7a88','#5a4a68'],'Pancarte du Général':['star','#c84a3a','#8a2a2a'],'Lame d’éclipse':['moon','#3a2a5a','#8a6ac0'],'Cimeterre des dunes':['sun','#d89a40','#a06a20'],'Bâton de pèlerin':['shell','#8a6a4a','#c8a878'],'Épée de la Garde':['shield','#6a7a8a','#aab4c0'],'Sceptre des cendres rallumées':['flame','#5a5a68','#ff8a3a'],'Marotte du Bouffon':['bell','#c84a8a','#f0c040'],'Sceptre de la Mère':['mush','#7a5a8a','#d8b0e8'],'Houlette du Recenseur':['horn','#9a7a50','#e8d8a8'],'Règle du Greffier':['ink','#5a4a3a','#d8c8a0'],'Plume de l’Insomnie':['eye','#3a3a6a','#a8a8e8'],'Sceptre du Sphinx':['sock','#c8a050','#e8d8a0'],'Veilleuse du Gardien':['lantern','#8a7a5a','#ffd870'],'Sabre de marée':['wave','#3a78c8','#a8d8f0'],
'Chapeau-champi':['mush','#c8503a','#f0e0c8'],'Capuche luminescente':['star','#3a8a6a','#a8f0c8'],'Capuchon de cendre':['ash','#6a6a72','#a8a8b0'],'Voile de brume':['cloud','#98a8c0','#e8f0f8'],'Couronne de cendre':['ash','#5a5260','#c8a0a0'],'Casque du Négociateur':['key','#6a8a9a','#e0d0a0'],'Diadème d’éclats':['star','#f0c040','#fff0a0'],'Couronne éteinte':['skull','#4a4650','#8a8690'],'Casque de piquet':['shield','#8a6a4a','#c8b090'],'Heaume de la Garde':['shield','#5a6a82','#b0bcd0'],'Masque du Bouffon':['bell','#c84a8a','#f0e070'],'Coiffe de mycélium':['mush','#7a5a8a','#d0b0e0'],'Bonnet de brume':['cloud','#a8b8d0','#f0f4fa'],'Visière de clerc':['book','#6a5a4a','#e0d0b0'],'Bonnet de nuit':['moon','#3a3a7a','#c0c0f0'],'Coiffe de pharaon':['eye','#d8a830','#2a6ab0'],'Capuche de veilleur':['lantern','#4a4a5a','#ffd870'],'Tricorne d’amiral':['anchor','#2a4a7a','#e0c860'],
'Gilet de laine':['cloud','#e8e0d0','#b8a898'],'Manteau douillet':['sun','#c87a5a','#f0c8a8'],'Cape du mouton-fantôme':['cloud','#c0c8e0','#f0f4ff'],'Manteau de brume':['cloud','#8898b0','#d0d8e8'],'Robe de la Duchesse':['ash','#6a4a78','#d8b0d8'],'Cape du marchand':['sock','#4a8a6a','#e8d080'],'Tunique de prêtre':['lantern','#e0d8c0','#c8a040'],'Manteau d’ombre':['moon','#2a2a3a','#6a5a8a'],'Armure du Gardien':['shield','#7a7a88','#e8c860'],'Manteau de mycélium':['mush','#6a4a7a','#d8b8e8'],'Pelisse du Bouc':['horn','#8a6a48','#e8d8b8'],'Robe du Greffier':['ink','#4a3a2a','#d8c898'],'Robe de nuit':['moon','#2a2a6a','#a0a0e8'],'Bandelettes de sable':['sand','#d8c898','#a88848'],'Habit de pénitent':['lantern','#6a5a4a','#d8d0b8'],'Veste d’amiral':['anchor','#2a4a8a','#e8c860'],
'Chaussons de laine':['cloud','#e8e0d0','#b8a888'],'Bottes du Chambellan':['key','#4a4a6a','#d0c090'],'Bottes de vase':['drop','#6a7a4a','#a8b878'],'Bottes de chameau':['sand','#b8905a','#e0c890'],'Sandales de pèlerin':['shell','#a8885a','#e0d0a8'],'Bottes d’éclipse':['moon','#3a2a5a','#8a6ac0'],'Bottes sporées':['mush','#c8603a','#f0d8b8'],'Guêtres de berger':['cloud','#8a8a60','#d8d8a8'],'Chaussons feutrés':['cloud','#a89888','#e0d4c8'],'Pantoufles de rêve':['star','#8a70c8','#e0d0ff'],'Sandales de momie':['sand','#d8c8a0','#a89868'],'Sandales du cloître':['lantern','#8a7a5a','#e8d8a0'],'Bottes de marée':['wave','#3a68a8','#a0c8e8'],
'Amulette de champi':['mush','#c85a4a','#f0e0c8'],'Écharpe de laine':['cloud','#c8503a','#f0d0b8'],'Bague de braise':['flame','#c8502a','#ffb040'],'Clochette du berger':['bell','#c8a040','#f0e0a0'],'Lanterne du Chambellan':['lantern','#6a6a8a','#ffd870'],'Perle du marais':['drop','#5a8a6a','#c8e8d0'],'Éventail de cendre':['ash','#8a8890','#d0ccd4'],'Amulette du mirage':['eye','#38b8b8','#b8f0f0'],'Brassard de gréviste':['star','#c84a3a','#f0c0a0'],'Étendard de grève':['star','#b83a3a','#f0d0b0'],'Collier du parvis':['key','#c8b890','#6a5a3a'],'Tampon du Chambellan':['seal','#6a5a8a','#d8d0e8'],'Lanterne du Gardien':['lantern','#c8a840','#fff0b0'],'Bague de luciole':['star','#a8c840','#f0f8a0'],'Clochette de brume':['cloud','#98a8c0','#e8f0f8'],'Encrier noir':['ink','#2a2a3a','#8a8aa8'],'Amulette du dormeur':['moon','#3a3a8a','#c0c0f0'],'Scarabée doré':['sun','#d8a830','#2a6ab0'],'Cierge de poche':['lantern','#e8d8a0','#ffb838'],'Pince de crabe colossal':['shell','#c8503a','#f0a888'],'Ancre dorée':['anchor','#d8a830','#fff0b0'],'Verrue porte-bonheur':['leaf','#6a8a4a','#c8e098']};
// Lames de panoplie : même motif que la panoplie ; ancrage du motif par forme [x,y,échelle]
const AN={sword:[24,23,.9],staff:[24,23,.9],sceptre:[24,23,.9],spear:[24,23,.9],sign:[24,23,.9],poker:[24,23,.9],saber:[24,23,.9],helm:[16,14,1.25],crown:[16,17,1],hat:[16,12,1],hood:[16,19,1.1],mask:[16,17,1],tunic:[16,19,1.5],armor:[16,22,1.2],cape:[16,18,1.5],robe:[16,20,1.4],boot:[14,11,.8],sandal:[16,22,.8],slipper:[16,21,.9],ring:[16,7.5,.6],amulet:[16,21,1],bell:[16,16,.9],lantern:[16,16,.75],bracelet:[16,10.5,.7],scarf:[16,9,.8],stamp:[16,19,.9],anchor:[16,6,.5],claw:[16,18,.9]};
const spec=o=>{const k=LK[o.n];if(k)return k;if(o.set&&SM[o.set])return[SM[o.set][0],...SC2[o.set]];const c=PAL[hash(o.n)%PAL.length];return['star',c,shade(c,1.6)]};
const obj2=o=>{try{const kind=kindOf2(o),[m,c1,c2]=spec(o),a=AN[kind],halo=o.r>=2?`<circle cx="16" cy="16" r="15" fill="${RAR[o.r]}" opacity=".28"/>`:'',badge=a[0]==24?`<circle cx="24" cy="23" r="7" fill="${c1}" stroke="${INK}" stroke-opacity=".7" stroke-width="1.2"/>`:'';
return svg(halo+W[kind](c1,shade(c1,.62))+badge+motif(m,a[0],a[1],a[2],c2))}catch(e){return o.e||''}};
const kindOf2=o=>/cimeterre|sabre/i.test(o.n)?'saber':kindOf(o);
W.saber=(c,d)=>P('M14 3Q26 8 22 22L19 22Q22 10 14 6Z',c)+P('M9 21H23V24H9Z',d)+P('M14.5 24H17.5V29H14.5Z',shade(d,.7));
const REL={rel3:['seal','#6a5a8a','#e0d8f0'],rel6:['ash','#8a5a88','#f0d0e8'],rel10:['shield','#a84a3a','#f0c8a8'],rel13:['moon','#2a2a5a','#a0a0f0'],rel16:['bell','#c84a8a','#f8e070'],rel17:['crown','#6a5a30','#f0d870'],rel22:['mush','#7a5a8a','#e8d0f0'],rel27:['horn','#8a6a48','#f0e0b8'],rel32:['ink','#4a3a2a','#e0d0a0'],rel37:['eye','#3a3a6a','#c0c0f4'],rel42:['sock','#c8a050','#f4e4a8'],rel47:['lantern','#7a7a88','#ffe080'],rel50:['anchor','#2a4a8a','#f0d070']};
const relic2=k=>{const [m,c1,c2]=REL[k];return svg(P('M16 2L25 9L22 28H10L7 9Z',c1)+P('M7 9L16 14L25 9','#ffffff','fill-opacity="0" stroke-opacity=".4"')+motif(m,16,19,1.35,c2))};

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
const res=k=>{try{if(RS[k])return svg(RS[k]());if(REL[k])return relic2(k);return ''}catch(e){return ''}};
const SPM={mousse:'leaf',laine:'cloud',tampon:'seal',vase:'drop',basalte:'hex',sable:'sand','écume':'wave',cierge:'lantern',rempart:'shield','poussière':'ash',cendre:'flame','grève':'bell',suie:'moon',veille:'eye',mirage:'sun','mémoire':'flower',chasse:'feather',atelier:'key',journal:'book'};
const spark=e=>{try{const c=PAL[hash(e.n)%PAL.length],w=e.n.toLowerCase().replace('étincelle d','').replace(/^[’' e]+/,'').trim(),m=SPM[w]||'star';return svg(`<circle cx="16" cy="16" r="14" fill="${c}" opacity=".3"/>`+P('M16 2L20 12L30 16L20 20L16 30L12 20L2 16L12 12Z','#ffe68a')+motif(m,16,16,1.15,c))}catch(x){return '✨'}};
const CO={tisane:['#e8a050','#fff0c0'],baume:['#6aa84f','#e0f4c8'],elixir:['#9a8aa8','#e8e0f0'],fiole:['#ffd84a','#fffbe0']};
const conso=k=>{try{const [a,b]=CO[k];return svg(`<circle cx="16" cy="16" r="15" fill="${a}" opacity=".22"/>`+P('M13 3H19V9L25 24Q26 29 21 29H11Q6 29 7 24L13 9Z','#cfe4ec','fill-opacity=".55"')+P('M9.4 19H22.6L25 24Q26 29 21 29H11Q6 29 7 24Z',a)+P('M12.5 3H19.5V6H12.5Z','#8a6a4a')+C(14,23.5,1.6,b))}catch(e){return ''}};
return{obj:obj2,conso,res,spark,kindOf:kindOf2,W,RS,spec,REL}})();
