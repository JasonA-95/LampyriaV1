// PNJ : sprites vectoriels des personnages non-joueurs (même boîte et même style que le héros, pieds sur y=128).
// Ajouter un PNJ = une ligne dans LOOKS (nom exact dans DATA.cartes[].npcs[].n). Les objets vivants (sablier, lanternes) ont leur propre dessin.
(()=>{
const O='stroke="#1a1218" stroke-opacity=".6" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round"';
const arm=(d,c,w=9)=>`<path d="${d}" stroke="#1a1218" stroke-opacity=".6" stroke-width="${w+2.2}" stroke-linecap="round" fill="none"/><path d="${d}" stroke="${c}" stroke-width="${w}" stroke-linecap="round" fill="none"/>`;
const hand=(x,y,c)=>`<circle cx="${x}" cy="${y}" r="4.6" fill="${c}" ${O}/>`;
const face=p=>{const sk=p.s||'#f0c8a0',m=p.mood||'smile',ey=p.eye||'#3a4a5a',hc=p.h||'#4a3020',lid=m=='sleep'?.5:1.8;
const mouth={smile:'M45 63Q49 66.5 53 63',flat:'M45.5 64.5H52.5',sad:'M45 66Q49 62 53 66',fear:'M46 65Q49 62 52 65Q49 69 46 65Z',open:'M46 63Q49 69 52 63Z'}[m]||'M45 63Q49 66.5 53 63';
return `<path d="M37 48Q49 41 61 48L60 61Q49 71 38 61Z" fill="${sk}" ${O}/><path d="M37 48Q44 44 49 44L47 70Q41 66 38 61Z" fill="#2a1418" opacity=".14"/>
<ellipse cx="40" cy="60" rx="2.6" ry="1.6" fill="#e8806a" opacity=".3"/><ellipse cx="58" cy="60" rx="2.6" ry="1.6" fill="#e8806a" opacity=".3"/>
<ellipse cx="43.5" cy="54" rx="2.6" ry="${lid}" fill="#f2e8da"/><ellipse cx="54.5" cy="54" rx="2.6" ry="${lid}" fill="#f2e8da"/>
${m=='sleep'?`<path d="M41 54Q43.5 56 46 54M52 54Q54.5 56 57 54" stroke="#2a1418" stroke-width="1.2" fill="none"/>`:`<circle cx="44" cy="54" r="1.4" fill="${ey}"/><circle cx="55" cy="54" r="1.4" fill="${ey}"/>`}
<path d="M41 50Q43.5 ${m=='sad'||m=='fear'?'47.5':'49'} 46 50M52 50Q54.5 ${m=='sad'||m=='fear'?'47.5':'49'} 57 50" stroke="${hc}" stroke-width="1.3" fill="none" opacity=".85"/>
<path d="M49 56Q51.5 59 49 60" stroke="#8a5a40" stroke-width="1" fill="none" opacity=".6"/><path d="${mouth}" stroke="#7a3a30" stroke-width="1.4" fill="${m=='open'||m=='fear'?'#5a2024':'none'}"/>`};
const hairBack=p=>{const h=p.h||'#4a3020';if(p.hs=='long'||p.hs=='braid')return `<path d="M34 50Q30 84 40 90L58 90Q68 84 64 50Q49 16 34 50Z" fill="${h}" ${O}/>`;return ''};
const hairFront=p=>{const h=p.h||'#4a3020',fr=`<path d="M35 52Q36 30 49 29Q62 30 63 52Q56 42 49 43Q41 42 35 52Z" fill="${h}" ${O}/>`;
switch(p.hs){case'bald':return `<path d="M35 52Q33 44 38 41L38.5 52Z M63 52Q65 44 60 41L59.5 52Z" fill="${h}" ${O}/>`;case'none':return'';
case'bun':return fr+`<circle cx="49" cy="25" r="6.5" fill="${h}" ${O}/>`;
case'curly':return fr+[37,43,49,55,61].map((x,i)=>`<circle cx="${x}" cy="${i%2?32:35}" r="5.4" fill="${h}" ${O}/>`).join('');
case'braid':return fr+`<path d="M36 56Q30 78 36 96M62 56Q68 78 62 96" stroke="${h}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
default:return fr}};
const beard=p=>{const b=p.bc||p.h||'#4a3020';if(p.b=='long')return `<path d="M38 60Q36 86 49 98Q62 86 60 60Q49 71 38 60Z" fill="${b}" ${O}/><path d="M43 62Q49 59 55 62Q49 65 43 62Z" fill="${b}"/>`;
if(p.b=='short')return `<path d="M38 59Q49 76 60 59Q61 67 49 72Q37 67 38 59Z" fill="${b}" ${O}/><path d="M43 62Q49 59 55 62Q49 65 43 62Z" fill="${b}"/>`;
if(p.b=='mus')return `<path d="M42 62Q49 58 56 62Q49 66 42 62Z" fill="${b}" ${O}/>`;return''};
const hats={
wiz:p=>`<ellipse cx="49" cy="41" rx="26" ry="6" fill="${p.hc}" ${O}/><path d="M33 41Q40 24 45 8Q51 0 58 10Q62 26 65 41Q49 46 33 41Z" fill="${p.hc}" ${O}/><path d="M34 40Q49 46 64 40" stroke="${p.tr||'#e8b860'}" stroke-width="3" fill="none"/>`,
cap:p=>`<path d="M33 42Q35 25 50 25Q65 26 65 42Q49 35 33 42Z" fill="${p.hc}" ${O}/><circle cx="50" cy="24.5" r="2.6" fill="${p.tr||'#e8b860'}"/>`,
helm:p=>`<path d="M32 46Q31 21 49 19Q67 21 66 46L60 41Q49 37 38 41Z" fill="${p.hc}" ${O}/><path d="M49 19V38" stroke="#0004" stroke-width="2"/>${p.star?`<path d="M49 24l2 5h5l-4 3 1.6 5-4.6-3-4.6 3 1.6-5-4-3h5z" fill="#ffd24a"/>`:''}`,
chef:p=>`<circle cx="40" cy="30" r="10" fill="#f6f2ea" ${O}/><circle cx="49" cy="23" r="11" fill="#f6f2ea" ${O}/><circle cx="58" cy="30" r="10" fill="#f6f2ea" ${O}/><path d="M37 34h24l-1 10H38z" fill="#f6f2ea" ${O}/>`,
kepi:p=>`<path d="M36 42L37 19H61L62 42Z" fill="${p.hc}" ${O}/><path d="M35 41H63" stroke="${p.tr||'#e8b860'}" stroke-width="3.5"/><path d="M37 19H61" stroke="#0004" stroke-width="2"/>`,
jester:p=>`<path d="M35 42Q24 38 20 20Q32 26 40 34Z" fill="${p.hc}" ${O}/><path d="M63 42Q74 38 78 20Q66 26 58 34Z" fill="${p.hc2||'#3a6ac8'}" ${O}/><path d="M35 43Q49 32 63 43Q49 39 35 43Z" fill="${p.hc}" ${O}/><circle cx="20" cy="20" r="3.6" fill="#ffd24a" ${O}/><circle cx="78" cy="20" r="3.6" fill="#ffd24a" ${O}/>`,
veil:p=>`<path d="M32 66Q29 28 49 25Q69 28 66 66Q60 49 49 47Q38 49 32 66Z" fill="${p.hc}" ${O}/><path d="M34 40Q49 30 64 40" stroke="${p.tr||'#3a4a7a'}" stroke-width="4" fill="none"/>`,
straw:p=>`<ellipse cx="49" cy="41" rx="30" ry="7" fill="${p.hc}" ${O}/><path d="M37 41Q37 24 49 24Q61 24 61 41Q49 45 37 41Z" fill="${p.hc}" ${O}/><path d="M37 38Q49 43 61 38" stroke="${p.tr||'#a8501e'}" stroke-width="3.2" fill="none"/>`,
turban:p=>`<path d="M32 44Q31 21 49 20Q67 21 66 44Q49 37 32 44Z" fill="${p.hc}" ${O}/><path d="M34 36Q49 28 64 36M33 41Q49 33 65 41" stroke="#0003" stroke-width="1.6" fill="none"/><circle cx="49" cy="29" r="3.2" fill="${p.tr||'#d83a5a'}" ${O}/>`,
fez:p=>`<path d="M38 44L40 24H58L60 44Z" fill="${p.hc}" ${O}/><path d="M49 24Q60 22 62 36" stroke="#e8b860" stroke-width="2" fill="none"/>`,
tri:p=>`<path d="M28 42Q49 30 70 42Q60 24 49 26Q38 24 28 42Z" fill="${p.hc}" ${O}/><path d="M30 41Q49 33 68 41" stroke="${p.tr||'#e8b860'}" stroke-width="2.4" fill="none"/><path d="M62 30Q76 22 74 34" stroke="#f0f0f0" stroke-width="3" fill="none"/>`,
shroom:p=>`<path d="M26 44Q27 18 49 17Q71 18 72 44Q49 36 26 44Z" fill="${p.hc||'#c83a3a'}" ${O}/><circle cx="38" cy="28" r="3.4" fill="#f6f2ea"/><circle cx="52" cy="23" r="3.8" fill="#f6f2ea"/><circle cx="62" cy="33" r="3" fill="#f6f2ea"/>`
};
const props={
staff:p=>`<path d="M74 34V128" stroke="#6a4420" stroke-width="4.4" stroke-linecap="round"/><circle cx="74" cy="31" r="6" fill="${p.pc||'#ffd890'}" ${O}/><circle cx="74" cy="31" r="12" fill="${p.pc||'#ffd890'}" opacity=".25" filter="url(#b2)"/>`,
crook:()=>`<path d="M74 40V128" stroke="#7a5a2c" stroke-width="4.4" stroke-linecap="round"/><path d="M74 42Q74 28 84 30Q90 32 86 40" stroke="#7a5a2c" stroke-width="4.4" fill="none" stroke-linecap="round"/>`,
cane:()=>`<path d="M72 76L80 128" stroke="#f0f0f0" stroke-width="3.2" stroke-linecap="round"/><path d="M72 76Q70 70 76 70" stroke="#f0f0f0" stroke-width="3.2" fill="none" stroke-linecap="round"/>`,
lantern:()=>`<path d="M72 84v8" stroke="#2a2420" stroke-width="2"/><path d="M63 94h18l-3 22H66z" fill="#ffe8b0" fill-opacity=".85" ${O}/><path d="M66 98h12l-2 14H68z" fill="#fff6d0"/><ellipse cx="72" cy="106" rx="3" ry="5" fill="#ffb040"/><path d="M63 94h18M66 116h12" stroke="#2a2420" stroke-width="2.4"/><circle cx="72" cy="104" r="18" fill="#ffd890" opacity=".2" filter="url(#b2)"/>`,
bucket:()=>`<path d="M65 92Q72 82 79 92" stroke="#6a6a78" stroke-width="2" fill="none"/><path d="M62 96h20l-3 20H65z" fill="#8a8a98" ${O}/><path d="M62 100h20" stroke="#5a5a68" stroke-width="2"/><ellipse cx="72" cy="96" rx="10" ry="2.4" fill="#6ab0e8"/>`,
rod:()=>`<path d="M68 96L100 26" stroke="#6a4420" stroke-width="3" stroke-linecap="round"/><path d="M100 26Q106 60 96 92" stroke="#e8e8f0" stroke-width="1" fill="none"/><path d="M96 92q-4 4 0 6" stroke="#c0c8d0" stroke-width="1.6" fill="none"/>`,
shears:()=>`<path d="M66 92L84 116M84 92L66 116" stroke="#c0c8d4" stroke-width="3.4" stroke-linecap="round"/><circle cx="66" cy="117" r="3.4" fill="none" stroke="#a83a2a" stroke-width="2.2"/><circle cx="84" cy="117" r="3.4" fill="none" stroke="#a83a2a" stroke-width="2.2"/>`,
quill:()=>`<rect x="62" y="88" width="18" height="24" rx="1.5" fill="#f2e8c8" ${O}/><path d="M65 94h12M65 99h12M65 104h8" stroke="#6a5a3a" stroke-width="1.2"/><path d="M84 78L72 98" stroke="#f6f2ea" stroke-width="3.4" stroke-linecap="round"/><path d="M84 78L72 98" stroke="#2a2a3a" stroke-width="1" stroke-linecap="round"/>`,
sack:p=>`<path d="M62 98Q58 116 66 122L80 122Q88 116 82 98Q72 94 62 98Z" fill="${p.pc||'#a8905a'}" ${O}/><path d="M64 99Q72 104 80 99" stroke="#5a4a2a" stroke-width="2" fill="none"/>`,
basket:()=>`<path d="M62 98h20l-2 18H64z" fill="#b8884a" ${O}/><path d="M63 102h18M63 108h18" stroke="#7a5a2c" stroke-width="1.2"/><circle cx="67" cy="95" r="3" fill="#f6f2ea"/><circle cx="73" cy="93" r="3" fill="#ff8aa8"/><circle cx="78" cy="95" r="3" fill="#ffd24a"/>`,
sign:()=>`<path d="M74 54V128" stroke="#6a4420" stroke-width="4" stroke-linecap="round"/><rect x="58" y="42" width="32" height="22" rx="2" fill="#e8d8b0" ${O}/><path d="M64 48L84 58M84 48L64 58" stroke="#c8402a" stroke-width="2.6"/>`,
keys:()=>`<circle cx="70" cy="98" r="5" fill="none" stroke="#e8b860" stroke-width="2"/><path d="M70 103V116M70 110h5M70 115h4" stroke="#e8b860" stroke-width="2.4" stroke-linecap="round"/>`,
book:()=>`<rect x="61" y="90" width="20" height="16" rx="1.5" fill="#6a4a8a" ${O}/><path d="M64 94h14M64 99h10" stroke="#e8d8f0" stroke-width="1.2"/>`
};
// personnage : jambes, robe, bras, tête, cheveux, barbe, chapeau, accessoire
const person=p=>{const robe=p.r||'#6a4a8a',trim=p.t||'#e8b860',sk=p.s||'#f0c8a0',lg=p.long;let s='';
 if(p.wing)s+=`<ellipse cx="30" cy="72" rx="16" ry="26" fill="#d8f4ff" fill-opacity=".6" ${O} transform="rotate(-25 30 72)"/><ellipse cx="68" cy="72" rx="16" ry="26" fill="#d8f4ff" fill-opacity=".6" ${O} transform="rotate(25 68 72)"/>`;
 if(p.aura)s+=`<circle cx="49" cy="80" r="58" fill="${p.aura}" opacity=".25" filter="url(#b8)"/>`;
 if(p.tail)s+=`<path d="M30 62Q22 98 34 112Q40 126 49 114Q58 126 64 112Q76 98 68 62Z" fill="${robe}" ${p.g?'fill-opacity=".8"':''} ${O}/>`;
 else{if(!lg)s+=`<path d="M36 128l1-26h9l1 26zM52 128l1-26h9l2 26z" fill="${p.lg||'#2e211a'}" ${O}/><path d="M33 128h15v4H33zM51 128h16v4H51z" fill="#1a1210"/>`;
  s+=lg?`<path d="M28 124L33 58Q49 46 65 58L70 124Q49 131 28 124Z" fill="${robe}" ${O}/>`:`<path d="M30 110L34 58Q49 46 64 58L68 110Q49 118 30 110Z" fill="${robe}" ${O}/>`;
  s+=`<path d="M34 60Q40 90 36 112L30 110L34 58Z" fill="#000" opacity=".16"/><path d="M58 62Q63 86 61 106" stroke="#fff" stroke-opacity=".22" stroke-width="2" fill="none"/>`;
  s+=lg?`<path d="M29 118Q49 126 69 118" stroke="${trim}" stroke-width="3" fill="none"/>`:`<path d="M31 88Q49 96 67 88l1 6Q49 102 30 94Z" fill="${trim}" ${O}/>`;
  if(p.frill)s+=`<path d="M30 110Q36 116 42 110Q48 116 54 110Q60 116 68 110" stroke="#0005" stroke-width="2" fill="none"/>`}
 if(p.hood)s+=`<path d="M31 64Q28 24 49 21Q70 24 67 64Q58 48 49 47Q40 48 31 64Z" fill="${p.hood}" ${O}/>`;
 s+=hairBack(p);
 s+=arm('M36 64Q26 78 31 94',p.sl||robe)+hand(31,95,sk);
 s+=face(p)+(p.hood?'':hairFront(p))+beard(p);
 if(p.hat)s+=hats[p.hat](p);
 s+=arm('M62 64Q72 78 69 94',p.sl||robe);
 if(p.prop)s+=props[p.prop](p);
 s+=hand(69,95,sk);
 return `<g${p.hover?` transform="translate(0,${p.hover})"`:''}>${s}</g>`};
// objets vivants
const lantern=o=>`<g><circle cx="49" cy="84" r="52" fill="${o.glow}" opacity=".28" filter="url(#b8)"/><path d="M36 58Q36 40 49 40Q62 40 62 58" stroke="#2a2420" stroke-width="3" fill="none"/><ellipse cx="49" cy="52" rx="14" ry="5" fill="#2a2420"/>
<path d="M30 62h38l5 56H25z" fill="${o.glass}" fill-opacity=".72" ${O}/><path d="M30 62h38l5 56H25z" fill="${o.glow}" fill-opacity=".18"/>
<path d="M40 62L37 118M49 62V118M58 62L61 118" stroke="${o.bars}" stroke-width="${o.cage?3.4:2}" opacity=".9"/><path d="M27 90H71" stroke="${o.bars}" stroke-width="${o.cage?3.4:1.4}" opacity=".7"/>
<path d="M49 112Q38 108 40 94Q44 84 48 74Q52 84 58 94Q60 108 49 112Z" fill="${o.fl}" ${O}/><path d="M49 110Q43 106 45 98Q48 92 49 88Q51 94 54 98Q55 106 49 110Z" fill="${o.fl2}"/>
<ellipse cx="45.4" cy="99" rx="1.6" ry="2.2" fill="#1a1020"/><ellipse cx="53" cy="99" rx="1.6" ry="2.2" fill="#1a1020"/><path d="M46 106Q49 ${o.sad?'103':'109'} 52 106" stroke="#1a1020" stroke-width="1.4" fill="none"/>
<rect x="22" y="118" width="54" height="9" rx="2" fill="#3a3028" ${O}/>${o.cage?`<rect x="43" y="68" width="12" height="10" rx="2" fill="#c8a040" ${O}/><path d="M46 68Q46 62 49 62Q52 62 52 68" stroke="#c8a040" stroke-width="2.4" fill="none"/>`:''}</g>`;
const sablier=()=>`<g><circle cx="49" cy="82" r="50" fill="#ffd890" opacity=".18" filter="url(#b8)"/>
<path d="M30 40Q30 74 44 82Q30 90 30 120H68Q68 90 54 82Q68 74 68 40Z" fill="#cfeaff" fill-opacity=".45" ${O}/>
<path d="M33 42H65Q64 62 52 74Q49 77 46 74Q34 62 33 42Z" fill="#e8c070" opacity=".9"/><path d="M48 80h2V102" stroke="#e8c070" stroke-width="1.6"/><path d="M32 120Q32 100 49 98Q66 100 66 120Z" fill="#e8c070" ${O}/>
<ellipse cx="43.5" cy="54" rx="2.6" ry="3.2" fill="#fff"/><ellipse cx="54.5" cy="54" rx="2.6" ry="3.2" fill="#fff"/><circle cx="44" cy="55" r="1.4" fill="#2a2030"/><circle cx="55" cy="55" r="1.4" fill="#2a2030"/><path d="M45 63Q49 66 53 63" stroke="#7a4a20" stroke-width="1.4" fill="none"/>
<rect x="24" y="32" width="50" height="9" rx="3" fill="#7a5028" ${O}/><rect x="24" y="119" width="50" height="9" rx="3" fill="#7a5028" ${O}/><path d="M28 41V119M70 41V119" stroke="#7a5028" stroke-width="3.4"/></g>`;
const LOOKS={
'Maître Lampiste':{r:'#6a4a8a',t:'#e8b860',h:'#eceaf2',hs:'bald',b:'long',bc:'#eceaf2',prop:'lantern',long:1,mood:'smile'},
'Le marchand':{r:'#8a5a2a',t:'#d8b070',h:'#4a3020',b:'short',hat:'cap',hc:'#a0522d',prop:'sack'},
'Pipelette':{r:'#d86a8a',t:'#f6f2ea',h:'#d89a30',hs:'braid',mood:'open',s:'#f6d0b0',hover:6,sc:.82},
'Ermite Champignac':{r:'#6a7a4a',t:'#a8b878',h:'#d8d0c0',b:'long',hat:'shroom',prop:'staff',pc:'#ff9ab0',long:1},
'Berger Laine-de-Nuit':{r:'#5a6a9a',t:'#e8e8ff',h:'#d0d4e0',hat:'cap',hc:'#3a4670',tr:'#e8e8ff',prop:'crook',b:'mus'},
'La Passeuse':{r:'#2a5a5a',t:'#8ad8c8',hood:'#2a5a5a',h:'#1a1a2a',hs:'none',s:'#d8b090',prop:'staff',pc:'#8ad8c8',long:1},
'Mémé Lumignon':{r:'#a85a7a',t:'#f0d8e0',h:'#eeeef4',hs:'bun',s:'#f0cdb0',mood:'smile',sc:.92},
'Tonton Zébulon':{r:'#4a7a4a',t:'#e8d070',h:'#6a4a2a',b:'mus',hat:'straw',hc:'#e0c070',prop:'sack',pc:'#ffd24a'},
'Pétoche':{r:'#b02a2a',t:'#e8b860',h:'#4a3020',hat:'kepi',hc:'#1a1a22',mood:'fear'},
'Vieux Sablier':null,
'Marchand de chaussettes':{r:'#7a5aa8',t:'#ffd24a',h:'#2a2020',b:'long',hat:'fez',hc:'#a02a2a',prop:'sack',pc:'#58a0d8'},
'Chamelier':{r:'#c89a4a',t:'#e8e0c8',s:'#c89a70',h:'#2a1a14',hs:'curly',hat:'turban',hc:'#e8d8b0',prop:'crook'},
"Hôtelier de l'oasis":{r:'#e8e0d0',t:'#d8c8a8',h:'#3a2a20',hs:'none',b:'mus',hat:'chef',mood:'open'},
'Délégué des Chaussettes':{r:'#5a5a6a',t:'#c83a3a',s:'#8ab070',h:'#3a4a30',hs:'bald',mood:'flat',frill:1,eye:'#b83a3a'},
'Général Gréviste':{r:'#4a5a30',t:'#ffd24a',h:'#9a9a9a',b:'short',hat:'helm',hc:'#5a6a3a',star:1,prop:'sign',mood:'flat'},
'La lanterne-prison':'prison',
'Pèlerin Cendré':{r:'#8a8a92',t:'#c8c8d0',hood:'#8a8a92',h:'#c8c8d0',hs:'none',b:'long',prop:'staff',pc:'#d0d0d8',long:1,s:'#cfc4b8'},
'Gardien du Parvis':{r:'#d8d0b0',t:'#c8a860',h:'#f0f0f0',hs:'none',hat:'turban',hc:'#f6f2ea',tr:'#c8a860',prop:'cane',mood:'sleep',long:1},
'La lanterne d’ombre':'ombre',
'Capitaine fantôme':{r:'#8a98b8',t:'#d8e0f0',s:'#e0eaf8',h:'#cfd8ec',b:'short',hat:'tri',hc:'#46506a',tail:1,g:1,aura:'#bcd0ff',eye:'#7ad0ff'},
'Bouffon Sans Rire':{r:'#c83a6a',t:'#ffd24a',sl:'#3a6ac8',h:'#2a2030',hat:'jester',hc:'#c83a6a',mood:'sad'},
'Gardienne des lucioles':{r:'#7ac88a',t:'#e8ffd0',h:'#f0e0a0',hs:'long',wing:1,aura:'#ffe890',hover:-12,sc:.78,s:'#f8e0c8'},
'Cueilleuse Pâquerette':{r:'#e8a0b0',t:'#fff0c8',h:'#7a4a2a',hs:'long',hat:'straw',hc:'#f0d890',tr:'#ff8aa8',prop:'basket'},
'Bergère Brume':{r:'#8aa0c8',t:'#f0f4ff',h:'#e8c890',hs:'braid',hat:'cap',hc:'#6a80b0',tr:'#f0f4ff',prop:'crook'},
'Tondeur Mérinos':{r:'#d0c0a0',t:'#f6f2ea',h:'#8a5a3a',b:'short',hat:'cap',hc:'#8a6a4a',prop:'shears'},
'Concierge Ficelle':{r:'#2a3a6a',t:'#e8b860',h:'#3a2a20',b:'mus',hat:'kepi',hc:'#2a3a6a',prop:'keys'},
'Copiste Rature':{r:'#3a2a4a',t:'#8a7aaa',h:'#2a2a3a',hat:'cap',hc:'#2a2040',tr:'#8a7aaa',prop:'quill',s:'#e8d0b8'},
'Pêcheur de Brume':{r:'#4a6a7a',t:'#a8c8d0',h:'#b8bcc0',b:'short',hat:'straw',hc:'#7a8a6a',tr:'#4a6a7a',prop:'rod'},
'Vieille Berceuse':{r:'#7a6a9a',t:'#d8d0f0',h:'#f0f0f6',hs:'long',mood:'sleep',s:'#f0cdb0',long:1,sc:.92},
'Guide du Mirage':{r:'#3a7ab8',t:'#ffd24a',s:'#6ab0d8',h:'#1a2a4a',b:'short',hat:'turban',hc:'#e8d8f8',tr:'#ffd24a',tail:1,aura:'#8ad0ff',mood:'smile'},
'Porteur d’eau':{r:'#a0784a',t:'#e8d8b0',s:'#b88a60',h:'#2a1a14',hat:'turban',hc:'#e8e0c8',tr:'#6a4a2a',prop:'bucket',b:'mus'},
'Sœur Veilleuse':{r:'#3a4a7a',t:'#e8e8ff',hat:'veil',hc:'#f6f2ea',tr:'#3a4a7a',prop:'lantern',long:1,mood:'sleep',hs:'none'},
'Jardinier de cire':{r:'#d8c070',t:'#a89040',s:'#e8d098',h:'#a89040',hat:'straw',hc:'#e8d8a0',tr:'#a89040',prop:'shears',mood:'flat'}
};
const key=n=>'pnj_'+n.toLowerCase().replace(/[^a-z0-9]+/g,'_');
const maker=(n,l)=>{if(l==null)return sablier;if(l=='prison')return()=>lantern({glow:'#ffcf80',glass:'#ffe8b0',bars:'#4a4a58',fl:'#ffb040',fl2:'#fff0b0',cage:1,sad:1});if(l=='ombre')return()=>lantern({glow:'#b080ff',glass:'#2a2040',bars:'#6a5a8a',fl:'#6a3aa8',fl2:'#b890ff',sad:1});return()=>person(l)};
for(const n of Object.keys(LOOKS)){const l=LOOKS[n],k=key(n),sc=1.22*(l&&typeof l=='object'&&l.sc?l.sc:1);SPR.reg(k,maker(n,l),{s:sc});SPR.map(n,k)}
SPR.pnjNames=Object.keys(LOOKS);
SPR.preload();
})();
