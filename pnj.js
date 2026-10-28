// PNJ : personnages non-joueurs en style « dark fantasy » (même grille 300x460 et mêmes tracés que les héros, voir heros.js).
// Ajouter un PNJ = une ligne dans LOOKS (nom exact dans DATA.cartes[].npcs[].n). Les objets vivants (sablier, lanternes) ont leur propre dessin.
(()=>{
const {INK,L,P,COAT,SH,RIM,props:HP}=HEROE.kit;
const dk=(c,f)=>{const n=parseInt(c.slice(1),16);return '#'+[16,8,0].map(s=>Math.max(0,Math.min(255,Math.round(((n>>s)&255)*f))).toString(16).padStart(2,'0')).join('')};
const arm=(d,c,w=14)=>`<path d="${d}" fill="${c}" ${L}/>`;
const eyes=(m,c)=>{const open=m!='sleep';return (open?`<path d="M138 63Q144 59 149 63Q144 65.5 138 63Z M152 63Q158 59 164 63Q158 65.5 152 63Z" fill="${c}"/>`:`<path d="M138 63Q144 66 149 63M152 63Q158 66 164 63" stroke="${INK}" stroke-width="2.6" fill="none"/>`)+
`<path d="M136 ${m=='sad'||m=='fear'?'55':'57'}L148 ${m=='sad'||m=='fear'?'57':'59'}M164 ${m=='sad'||m=='fear'?'55':'57'}L152 ${m=='sad'||m=='fear'?'57':'59'}" stroke="${INK}" stroke-width="3" fill="none"/>`+
`<path d="${{smile:'M143 85Q150 89 157 85',flat:'M144 86H156',sad:'M143 88Q150 83 157 88',fear:'M145 86Q150 82 155 86Q150 92 145 86Z',open:'M144 84Q150 92 156 84Z',sleep:'M144 86Q150 88 156 86'}[m]||'M143 85Q150 89 157 85'}" stroke="${INK}" stroke-width="2.4" fill="${m=='open'||m=='fear'?'#4a1a20':'none'}"/>`};
const hairBack=p=>{const h=p.h||'#2a2230';return (p.hs=='long'||p.hs=='braid')?`<path d="M126 70Q118 28 152 24Q186 28 176 72Q182 112 168 128L134 128Q120 112 126 70Z" fill="${h}" ${L}/>`:''};
const hairFront=p=>{const h=p.h||'#2a2230',fr=`<path d="M129 66Q124 28 152 26Q182 28 172 68Q170 50 160 46L156 58L148 44L140 58Q134 52 129 66Z" fill="${h}" ${L}/>`;
switch(p.hs){case'bald':return `<path d="M131 68Q126 52 134 44L136 66Z M170 68Q176 52 168 44L166 66Z" fill="${h}" ${L}/>`;case'none':return'';
case'bun':return fr+`<circle cx="152" cy="20" r="13" fill="${h}" ${L}/>`;
case'curly':return fr+[132,142,152,162,172].map((x,i)=>`<circle cx="${x}" cy="${i%2?32:38}" r="10" fill="${h}" ${L}/>`).join('');
case'braid':return fr+`<path d="M130 78Q116 120 132 160M172 78Q186 120 170 160" stroke="${INK}" stroke-width="17" fill="none" stroke-linecap="round"/><path d="M130 78Q116 120 132 160M172 78Q186 120 170 160" stroke="${h}" stroke-width="10" fill="none" stroke-linecap="round"/>`;
default:return fr}};
const beard=p=>{const b=p.bc||p.h||'#2a2230';
if(p.b=='long')return `<path d="M132 76Q148 170 168 76Q150 94 132 76Z" fill="${b}" ${L}/><path d="M140 82Q150 78 160 82Q150 88 140 82Z" fill="${dk(b,.7)}"/>`;
if(p.b=='short')return `<path d="M134 76Q150 112 166 76Q168 90 150 98Q132 90 134 76Z" fill="${b}" ${L}/><path d="M140 80Q150 76 160 80Q150 85 140 80Z" fill="${dk(b,.7)}"/>`;
if(p.b=='mus')return `<path d="M138 80Q150 74 162 80Q150 86 138 80Z" fill="${b}" ${L}/>`;return''};
const hats={
wiz:p=>`<path d="M112 50Q150 66 192 50Q192 40 150 36Q110 40 112 50Z" fill="${p.hc}" ${L}/><path d="M122 46Q132 28 138 6Q148 -6 168 2Q180 8 184 24Q168 14 162 26Q168 40 180 46Q150 54 122 46Z" fill="${p.hc}" ${L}/><path d="M122 44Q150 54 182 44" stroke="${p.tr||'#e8c870'}" stroke-width="5" fill="none"/>`,
cap:p=>`<path d="M124 56Q126 26 152 24Q178 26 178 56Q150 46 124 56Z" fill="${p.hc}" ${L}/><circle cx="152" cy="24" r="5" fill="${p.tr||'#c8a050'}" stroke="${INK}" stroke-width="3"/>`,
helm:p=>`<path d="M120 66Q118 20 150 16Q182 20 180 66L170 56Q150 46 130 56Z" fill="${p.hc}" ${L}/><path d="M150 18V50" stroke="${INK}" stroke-opacity=".5" stroke-width="4"/>${p.star?`<path d="M150 24l5 12h13l-10 8 4 13-12-8-12 8 4-13-10-8h13z" fill="#ffd24a" stroke="${INK}" stroke-width="3"/>`:''}`,
chef:p=>`<circle cx="134" cy="30" r="16" fill="#f6f2ea" ${L}/><circle cx="152" cy="18" r="17" fill="#f6f2ea" ${L}/><circle cx="170" cy="30" r="16" fill="#f6f2ea" ${L}/><path d="M130 38H174V54H130Z" fill="#f6f2ea" ${L}/>`,
kepi:p=>`<path d="M132 54L134 6H170L172 54Z" fill="${p.hc}" ${L}/><path d="M131 50H173" stroke="${p.tr||'#c8a050'}" stroke-width="7"/>`,
jester:p=>`<path d="M130 52Q102 46 90 12Q116 22 136 38Z" fill="${p.hc}" ${L}/><path d="M172 52Q200 46 212 12Q186 22 166 38Z" fill="${p.hc2||'#3a6ac8'}" ${L}/><path d="M128 54Q152 34 174 54Q152 46 128 54Z" fill="${p.hc}" ${L}/><circle cx="90" cy="12" r="7" fill="#ffd24a" stroke="${INK}" stroke-width="3"/><circle cx="212" cy="12" r="7" fill="#ffd24a" stroke="${INK}" stroke-width="3"/>`,
veil:p=>`<path d="M120 112Q112 34 152 26Q192 34 184 112Q170 70 152 66Q134 70 120 112Z" fill="${p.hc}" ${L}/><path d="M128 44Q152 32 176 44" stroke="${p.tr||'#3a4a7a'}" stroke-width="8" fill="none"/>`,
straw:p=>`<ellipse cx="152" cy="48" rx="56" ry="12" fill="${p.hc}" ${L}/><path d="M124 48Q124 20 152 20Q180 20 180 48Q152 56 124 48Z" fill="${p.hc}" ${L}/><path d="M126 44Q152 54 178 44" stroke="${p.tr||'#a8501e'}" stroke-width="7" fill="none"/>`,
turban:p=>`<path d="M122 58Q120 20 152 16Q184 20 182 58Q152 46 122 58Z" fill="${p.hc}" ${L}/><path d="M126 38Q152 26 178 38M124 48Q152 36 180 48" stroke="${INK}" stroke-opacity=".35" stroke-width="3" fill="none"/><circle cx="152" cy="28" r="6" fill="${p.tr||'#d83a5a'}" stroke="${INK}" stroke-width="3"/>`,
fez:p=>`<path d="M132 54L138 14H168L174 54Z" fill="${p.hc}" ${L}/><path d="M152 14Q176 10 184 36" stroke="#e8b860" stroke-width="4" fill="none"/>`,
tri:p=>`<path d="M100 58Q152 38 204 58Q182 20 152 24Q122 20 100 58Z" fill="${p.hc}" ${L}/><path d="M104 56Q152 42 200 56" stroke="${p.tr||'#c8a050'}" stroke-width="5" fill="none"/><path d="M184 34Q214 18 208 46" stroke="#f0f0f0" stroke-width="6" fill="none" stroke-linecap="round"/>`,
shroom:p=>`<path d="M92 58Q94 8 152 6Q210 8 212 58Q152 40 92 58Z" fill="${p.hc||'#c83a3a'}" ${L}/><circle cx="124" cy="30" r="8" fill="#f6f2ea"/><circle cx="156" cy="20" r="9" fill="#f6f2ea"/><circle cx="184" cy="38" r="7" fill="#f6f2ea"/>`};
const props={staff:p=>HP.staff({rim:p.pc||'#8af0ff'}),lantern:p=>HP.lantern(p),
crook:()=>`<path d="M222 70L224 432" stroke="${INK}" stroke-width="13" stroke-linecap="round"/><path d="M222 70L224 432" stroke="#7a5a30" stroke-width="7" stroke-linecap="round"/><path d="M222 74Q220 40 244 44Q258 48 252 70" stroke="${INK}" stroke-width="13" fill="none" stroke-linecap="round"/><path d="M222 74Q220 40 244 44Q258 48 252 70" stroke="#7a5a30" stroke-width="7" fill="none" stroke-linecap="round"/>`,
cane:()=>`<path d="M212 190L232 432" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="M212 190L232 432" stroke="#f0f0f0" stroke-width="5" stroke-linecap="round"/>`,
bucket:()=>`<path d="M198 250Q216 220 236 250" stroke="${INK}" stroke-width="5" fill="none"/><path d="M196 252H238L230 304H204Z" fill="#8a8a98" ${L}/><ellipse cx="217" cy="252" rx="21" ry="5" fill="#6ab0e8" stroke="${INK}" stroke-width="3"/>`,
rod:()=>`<path d="M212 240L300 20" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="M212 240L300 20" stroke="#7a5a30" stroke-width="4.5" stroke-linecap="round"/><path d="M300 20Q318 130 290 230" stroke="#e8e8f0" stroke-width="2" fill="none"/><path d="M290 230q-8 8 0 14" stroke="#c0c8d0" stroke-width="3" fill="none"/>`,
shears:()=>`<path d="M204 236L242 286M242 236L204 286" stroke="${INK}" stroke-width="11" stroke-linecap="round"/><path d="M204 236L242 286M242 236L204 286" stroke="#c0c8d4" stroke-width="5.5" stroke-linecap="round"/><circle cx="203" cy="290" r="8" fill="none" stroke="#a83a2a" stroke-width="5"/><circle cx="243" cy="290" r="8" fill="none" stroke="#a83a2a" stroke-width="5"/>`,
quill:()=>`<rect x="194" y="236" width="40" height="52" rx="3" fill="#f2e8c8" ${L}/><path d="M202 248H226M202 258H226M202 268H216" stroke="#6a5a3a" stroke-width="3"/><path d="M244 206L214 252" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="M244 206L214 252" stroke="#f6f2ea" stroke-width="4.5" stroke-linecap="round"/>`,
sack:p=>`<path d="M196 252Q188 296 208 310H238Q256 296 240 252Q218 244 196 252Z" fill="${p.pc||'#a8905a'}" ${L}/><path d="M200 254Q218 264 238 254" stroke="${INK}" stroke-width="4" fill="none"/>`,
basket:()=>`<path d="M194 252H240L234 302H202Z" fill="#b8884a" ${L}/><path d="M198 266H238M200 282H236" stroke="#7a5a2c" stroke-width="3"/><circle cx="204" cy="244" r="8" fill="#f6f2ea" stroke="${INK}" stroke-width="3"/><circle cx="218" cy="238" r="8" fill="#ff8aa8" stroke="${INK}" stroke-width="3"/><circle cx="232" cy="244" r="8" fill="#ffd24a" stroke="${INK}" stroke-width="3"/>`,
sign:()=>`<path d="M222 130L224 432" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M222 130L224 432" stroke="#6a4420" stroke-width="6" stroke-linecap="round"/><rect x="186" y="84" width="76" height="52" rx="4" fill="#e8d8b0" ${L}/><path d="M198 94L250 126M250 94L198 126" stroke="#c8402a" stroke-width="7"/>`,
keys:()=>`<circle cx="214" cy="248" r="12" fill="none" stroke="${INK}" stroke-width="8"/><circle cx="214" cy="248" r="12" fill="none" stroke="#e8b860" stroke-width="4"/><path d="M214 260V300M214 284h12M214 298h9" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="M214 260V300M214 284h12M214 298h9" stroke="#e8b860" stroke-width="4.5" stroke-linecap="round"/>`,
book:()=>`<rect x="194" y="240" width="44" height="34" rx="3" fill="#6a4a8a" ${L}/><path d="M202 250H230M202 260H224" stroke="#e8d8f0" stroke-width="3"/>`};
const person=p=>{const robe=p.r||'#5a4a7a',sh=dk(robe,.58),lg=p.long,k=lg?'l':'s',sk=p.s||'#c8a088',skSh=dk(sk,.72),rim=p.rim||'#ffb060',cid='c'+Math.abs([...(p.r||'x')].reduce((a,c)=>a*31+c.charCodeAt(0)|0,7));let s='';
 if(p.aura)s+=`<circle cx="150" cy="240" r="170" fill="${p.aura}" opacity=".22" filter="url(#b8)"/>`;
 else s+=`<circle cx="214" cy="290" r="150" fill="${rim}" opacity=".1" filter="url(#b8)"/>`;
 if(p.wing)s+=`<ellipse cx="86" cy="190" rx="46" ry="92" fill="#d8f4ff" fill-opacity=".55" ${L} transform="rotate(-22 86 190)"/><ellipse cx="214" cy="190" rx="46" ry="92" fill="#d8f4ff" fill-opacity=".55" ${L} transform="rotate(22 214 190)"/>`;
 if(p.tail)s+=`<path d="M100 112Q70 260 100 330Q120 400 150 340Q180 400 200 330Q232 260 200 112Q150 98 100 112Z" fill="${robe}" ${p.g?'fill-opacity=".78"':''} ${L}/><path d="M188 112Q232 260 200 330Q196 220 188 112Z" fill="${rim}" opacity=".5"/>`;
 else{if(!lg)s+=`<path d="${P.legL}" fill="${p.lg||'#2e3444'}" ${L}/><path d="${P.legR}" fill="${dk(p.lg||'#2e3444',1.25)}" ${L}/><path d="${P.bootL}" fill="#1a1620" ${L}/><path d="${P.bootR}" fill="#1a1620" ${L}/>`;
  s+=`<clipPath id="${cid}"><path d="${COAT[k]}"/></clipPath><path d="${COAT[k]}" fill="${robe}" ${L}/><g clip-path="url(#${cid})"><path d="${SH[k]}" fill="${sh}"/><path d="${RIM[k]}" fill="${rim}" opacity=".75"/><path d="M80 ${lg?360:300}Q150 ${lg?390:330} 220 ${lg?360:300}L220 450H80Z" fill="#000" opacity=".2"/></g>`;
  s+=lg?`<path d="M90 422Q150 442 214 422" stroke="${p.t||'#c8a050'}" stroke-width="6" fill="none"/>`:'';
  s+=`<path d="M99 ${lg?236:222}H201V${lg?246:232}H99Z" fill="${p.t?dk(p.t,.5):'#2a1e1a'}"/><rect x="143" y="${lg?235:221}" width="14" height="12" fill="${p.t||'#c8a050'}" stroke="${INK}" stroke-width="3"/>`;
  if(p.frill)s+=`<path d="M98 304Q112 320 126 304Q140 320 154 304Q168 320 182 304Q190 316 200 304" stroke="${INK}" stroke-width="5" fill="none"/>`}
 s+=`<path d="${P.armL}" fill="${p.sl||robe}" ${L}/><path d="M104 112Q82 172 90 242L96 241Q92 180 108 120Z" fill="${sh}"/><circle cx="98" cy="246" r="8" fill="${sk}" stroke="${INK}" stroke-width="4"/>`;
 s+=`<path d="${P.armR}" fill="${p.sl||robe}" ${L}/><path d="M222 140Q228 180 224 226L218 226Q220 180 212 150Z" fill="${rim}" opacity=".85"/>`;
 if(p.prop)s+=props[p.prop](p);
 s+=`<circle cx="214" cy="232" r="8" fill="${sk}" stroke="${INK}" stroke-width="4"/>`;
 s+=`<path d="${P.neck}" fill="${skSh}" ${L}/><path d="M126 100L150 124L174 100L184 112L150 138L116 112Z" fill="${p.col||dk(robe,.45)}" ${L}/>`;
 let h=`<g transform="translate(150,98) scale(${p.hs2||1.13}) translate(-150,-98)">`+hairBack(p);
 if(p.hood)h+=`<path d="M116 106Q104 28 152 18Q200 28 188 106Q178 66 152 58Q126 66 116 106Z" fill="${p.hood}" ${L}/>`;
 h+=`<path d="${P.face}" fill="${sk}" ${L}/><path d="M133 58Q135 40 150 38L148 96Q140 94 134 78Z" fill="${skSh}" opacity=".85"/><path d="M162 50Q168 56 167 70L165 80Q164 66 162 50Z" fill="${rim}" opacity=".7"/>`+eyes(p.mood||'smile',p.eye||'#e8c870');
 if(p.old)h+=`<path d="M138 70Q142 72 146 70M154 70Q158 72 162 70M142 50Q150 47 158 50" stroke="${INK}" stroke-opacity=".4" stroke-width="2" fill="none"/>`;
 h+=(p.hood?'':hairFront(p))+beard(p)+(p.hat?hats[p.hat](p):'')+'</g>';
 return `<g${p.hover?` transform="translate(0,${p.hover})"`:''}>${s+h}</g>`};
const lanternF=o=>`<g><circle cx="150" cy="260" r="170" fill="${o.glow}" opacity=".26" filter="url(#b8)"/><path d="M104 150Q104 92 150 92Q196 92 196 150" stroke="${INK}" stroke-width="9" fill="none"/><ellipse cx="150" cy="134" rx="44" ry="14" fill="#2a2420" ${L}/>
<path d="M92 150H208L224 380H76Z" fill="${o.glass}" fill-opacity=".8" ${L}/><path d="M92 150H208L224 380H76Z" fill="${o.glow}" fill-opacity=".2"/><path d="M196 150L224 380H200Z" fill="${o.rim}" opacity=".5"/>
<path d="M124 150L112 380M150 150V380M176 150L188 380" stroke="${o.bars}" stroke-width="${o.cage?11:6}" opacity=".9"/><path d="M82 270H218" stroke="${o.bars}" stroke-width="${o.cage?11:5}" opacity=".7"/>
<path d="M150 352Q112 336 120 296Q132 262 146 232Q156 262 176 296Q186 336 150 352Z" fill="${o.fl}" ${L}/><path d="M150 342Q132 330 136 304Q144 288 150 274Q156 290 166 306Q168 330 150 342Z" fill="${o.fl2}"/>
<ellipse cx="138" cy="312" rx="4.4" ry="6.4" fill="#1a1020"/><ellipse cx="162" cy="312" rx="4.4" ry="6.4" fill="#1a1020"/><path d="M142 336Q150 ${o.sad?'328':'342'} 158 336" stroke="#1a1020" stroke-width="3" fill="none"/>
<rect x="64" y="378" width="172" height="28" rx="5" fill="#3a3028" ${L}/>${o.cage?`<rect x="132" y="190" width="36" height="30" rx="4" fill="#c8a040" ${L}/><path d="M138 190Q138 170 150 170Q162 170 162 190" stroke="#c8a040" stroke-width="8" fill="none"/>`:''}</g>`;
const sablier=()=>`<g><circle cx="150" cy="250" r="170" fill="#ffd890" opacity=".2" filter="url(#b8)"/>
<path d="M96 120Q96 220 134 246Q96 272 96 372H204Q204 272 166 246Q204 220 204 120Z" fill="#cfeaff" fill-opacity=".5" ${L}/><path d="M196 124Q198 210 170 240Q200 218 204 124Z" fill="#ffb060" opacity=".6"/>
<path d="M102 124H198Q196 186 160 224Q150 232 140 224Q104 186 102 124Z" fill="#e8c070" opacity=".92"/><path d="M148 244h4V312" stroke="#e8c070" stroke-width="4"/><path d="M100 372Q100 308 150 300Q200 308 200 372Z" fill="#e8c070" ${L}/>
<ellipse cx="132" cy="160" rx="8" ry="10" fill="#fff"/><ellipse cx="168" cy="160" rx="8" ry="10" fill="#fff"/><circle cx="133" cy="163" r="4.4" fill="#2a2030"/><circle cx="169" cy="163" r="4.4" fill="#2a2030"/><path d="M134 192Q150 202 166 192" stroke="#7a4a20" stroke-width="3.6" fill="none"/>
<rect x="76" y="96" width="148" height="28" rx="8" fill="#7a5028" ${L}/><rect x="76" y="368" width="148" height="28" rx="8" fill="#7a5028" ${L}/><path d="M86 124V368M214 124V368" stroke="${INK}" stroke-width="14"/><path d="M86 124V368M214 124V368" stroke="#7a5028" stroke-width="8"/></g>`;
const LOOKS={
'Maître Lampiste':{old:1,r:'#6a4a8a',t:'#e8b860',h:'#eceaf2',hs:'bald',b:'long',bc:'#eceaf2',prop:'lantern',long:1,mood:'smile'},
'Le marchand':{r:'#8a5a2a',t:'#d8b070',h:'#4a3020',b:'short',hat:'cap',hc:'#a0522d',prop:'sack'},
'Pipelette':{r:'#d86a8a',t:'#f6f2ea',h:'#d89a30',hs:'braid',mood:'open',s:'#f6d0b0',sc:.84},
'Ermite Champignac':{old:1,r:'#6a7a4a',t:'#a8b878',h:'#d8d0c0',b:'long',hat:'shroom',prop:'staff',pc:'#ff9ab0',long:1},
'Berger Laine-de-Nuit':{old:1,r:'#5a6a9a',t:'#e8e8ff',h:'#d0d4e0',hat:'cap',hc:'#3a4670',tr:'#e8e8ff',prop:'crook',b:'mus'},
'La Passeuse':{r:'#2a5a5a',t:'#8ad8c8',hood:'#2a5a5a',h:'#1a1a2a',hs:'none',s:'#d8b090',prop:'staff',pc:'#8ad8c8',long:1},
'Marchande de Rubans':{r:'#b04a7a',t:'#ffe0f0',h:'#5a2a40',hs:'braid',s:'#f0cdb0'},
'Marchand d’Éclats':{r:'#4a6aa0',t:'#e0f0ff',h:'#2a2a3a',b:'mus',s:'#e8c0a0'},
'Crieur des Lanternes':{r:'#8a3a2a',t:'#ffe8b0',h:'#3a2a20',hat:'kepi',hc:'#8a3a2a',s:'#f0cdb0'},
'Pique-Chaussette':{r:'#4a4a4a',t:'#d0d0d0',h:'#2a2020',hat:'kepi',hc:'#3a3a3a',s:'#e8c0a0'},
'Aubergiste Tisonnier':{r:'#a05a2a',t:'#ffe0b0',h:'#5a3a20',b:'mus',s:'#f0cdb0'},
'Barde Sans-Voix':{r:'#5a3a8a',t:'#e8d8ff',h:'#2a1a40',hs:'braid',s:'#f0cdb0'},
'Voyageuse Éteinte':{r:'#5a6a5a',t:'#d8e8d0',h:'#4a4a4a',hs:'braid',s:'#e8c0a0'},
'Sentinelle Mollette':{r:'#2a3a6a',t:'#c8d8f0',h:'#3a2a20',hat:'kepi',hc:'#2a3a6a',s:'#f0cdb0'},
'Jardinière Pétale':{r:'#4a8a4a',t:'#f0ffe0',h:'#6a3a20',hs:'braid',s:'#f0cdb0'},
'Vieux Veilleur':{r:'#6a6a7a',t:'#e8e8f0',h:'#d8d8d8',b:'mus',s:'#e8c0a0'},
'Contremaître Rivet':{r:'#6a4a2a',t:'#ffd890',h:'#3a2a20',b:'mus',hat:'kepi',hc:'#6a4a2a',s:'#e8c0a0'},
'Apprenti Étincelle':{r:'#8a6a2a',t:'#fff0b0',h:'#5a3a20',s:'#f0cdb0'},
'Maître Braisard':{r:'#8a2a1a',t:'#ffb080',h:'#2a1a10',b:'mus',s:'#d8a888'},
'Apprenti Suie':{r:'#3a3a3a',t:'#c0c0c0',h:'#1a1a1a',s:'#e0c0a0'},
'Armurière Tôle':{r:'#6a7a8a',t:'#e8f0ff',h:'#3a3a4a',hs:'braid',s:'#f0cdb0'},
'Mannequin Fidèle':{r:'#8a7a5a',t:'#f0e0b8',h:'#8a7a5a',s:'#d8c098'},
'Cordonnier Talon':{r:'#7a4a2a',t:'#ffd8b0',h:'#4a2a1a',b:'mus',s:'#e8c0a0'},
'Client Pied-Plat':{r:'#5a7a8a',t:'#e0f0f8',h:'#3a3a3a',s:'#f0cdb0'},
'Bijoutière Éclat':{r:'#8a4a9a',t:'#f8e0ff',h:'#2a1a30',hs:'braid',s:'#f0cdb0'},
'Garde Sourcilleux':{r:'#3a3a5a',t:'#c0c0e0',h:'#1a1a2a',hat:'kepi',hc:'#3a3a5a',s:'#e0b898'},
'Apothicaire Alambic':{r:'#3a8a6a',t:'#d8ffe8',h:'#4a4a3a',hs:'braid',s:'#f0cdb0'},
'Bourgmestre Cendrier':{r:'#5a4a4a',t:'#e8d0c0',h:'#2a2020',b:'mus',hat:'kepi',hc:'#5a4a4a',s:'#e8c0a0'},
'Cantinière Braisette':{r:'#a0502a',t:'#ffd8a0',h:'#5a3a20',hs:'braid',s:'#f0cdb0'},
'Gamin Suie-Pouce':{r:'#5a5a6a',t:'#d8d8e8',h:'#2a2a2a',s:'#e8c0a0'},
'Veuve Cendreuse':{r:'#3a3a4a',t:'#b8b8c8',h:'#c8c8c8',hs:'braid',s:'#f0cdb0'},
'Fondeur Refroidi':{r:'#8a3a1a',t:'#ffb070',h:'#2a1a10',b:'mus',s:'#d8a888'},
'Souffleuse Muette':{r:'#6a4a3a',t:'#f0d8c0',h:'#3a2a20',hs:'braid',s:'#f0cdb0'},
'Tavernier Pelle':{r:'#7a5a3a',t:'#f0d8a8',h:'#4a3a2a',b:'mus',s:'#e8c0a0'},
'Joueur de Dés Éteint':{r:'#4a4a5a',t:'#d0d0e0',h:'#1a1a2a',hat:'kepi',hc:'#4a4a5a',s:'#e0c0a0'},
'Colporteur Cendré':{r:'#6a6a5a',t:'#e8e8d0',h:'#4a4a4a',b:'mus',s:'#e8c0a0'},
'Chaudronnier Bosse':{r:'#6a5a4a',t:'#e8d0b0',h:'#3a2a20',b:'mus',s:'#d8a888'},
'Apprentie Rivette':{r:'#8a6a4a',t:'#fff0d0',h:'#5a3a20',hs:'braid',s:'#f0cdb0'},
'Gardienne Cyprès':{r:'#3a5a4a',t:'#c8e8d8',h:'#1a2a20',hs:'braid',s:'#f0cdb0'},
'Fossoyeur Distrait':{r:'#4a4a3a',t:'#d8d8b8',h:'#3a3a2a',hat:'kepi',hc:'#4a4a3a',s:'#e0c0a0'},
'Doyen Cierge':{r:'#e8d8a0',t:'#fff8d8',h:'#d8d8d8',b:'mus',s:'#e8c0a0'},
'Veilleuse Insomnieuse':{r:'#3a3a6a',t:'#c8c8f0',h:'#1a1a2a',hs:'braid',s:'#f0cdb0'},
'Enfant Chandelle':{r:'#c8a040',t:'#fff0b0',h:'#5a3a20',s:'#f0cdb0'},
'Pèlerin Troqueur':{r:'#7a6a4a',t:'#e8e0c0',h:'#3a2a20',b:'mus',s:'#e8c0a0'},
'Prieur Murmure':{r:'#d8c890',t:'#fff0c8',h:'#8a8a8a',b:'mus',hat:'kepi',hc:'#d8c890',s:'#e8c0a0'},
'Sacristain Mèche':{r:'#6a4a3a',t:'#f0d8b8',h:'#2a2a2a',s:'#e0c0a0'},
'Pèlerine Sans-Vœu':{r:'#7a7a8a',t:'#e8e8f0',h:'#6a4a30',hs:'braid',s:'#f0cdb0'},
'Copiste Pâlot':{r:'#5a4a7a',t:'#e0d0f8',h:'#2a1a30',s:'#f0e0d0'},
'Archiviste Encre':{r:'#2a2a4a',t:'#c0c0e0',h:'#1a1a2a',hs:'braid',s:'#f0cdb0'},
'Infirmière Camomille':{r:'#5a9a6a',t:'#e0ffe8',h:'#5a3a20',hs:'braid',s:'#f0cdb0'},
'Pèlerin Grelot':{r:'#6a8aaa',t:'#e0f0ff',h:'#3a3a3a',s:'#e8c0a0'},
'Jardinier Cirier':{r:'#9a7a3a',t:'#ffe8b0',h:'#4a3a20',b:'mus',s:'#e8c0a0'},
'Veilleur Égaré':{r:'#4a4a5a',t:'#d0d0e0',h:'#2a2a3a',s:'#e0c0a0'},
'Passeur de Lanternes':{r:'#b07a2a',t:'#ffe8a0',h:'#3a2a20',hat:'kepi',hc:'#b07a2a',prop:'keys',s:'#e8c0a0'},
'Herboriste Brindille':{r:'#5a8a4a',t:'#e8ffd8',h:'#5a3a20',hs:'braid',s:'#f0cdb0'},
'Bûcheron Mousse':{r:'#8a4a2a',t:'#f0d0a0',h:'#3a2a20',b:'mus',hat:'kepi',hc:'#8a4a2a',s:'#e8c0a0'},
'Fermier Guenille':{r:'#7a6a3a',t:'#f0e0b0',h:'#4a3a20',b:'mus',hat:'kepi',hc:'#7a6a3a',s:'#e8c0a0'},
'Meunière Farine':{r:'#c8b890',t:'#fff8e8',h:'#7a5a3a',hs:'braid',s:'#f0cdb0'},
'Caravanier Perdu':{r:'#b8884a',t:'#ffe0a8',h:'#3a2a20',b:'mus',hat:'kepi',hc:'#b8884a',s:'#d8a888'},
'Nomade Sablier':{r:'#a87a3a',t:'#f8d890',h:'#2a1a10',hs:'braid',s:'#d8a888'},
'Pêcheur Sans-Ligne':{r:'#3a6a8a',t:'#d8f0ff',h:'#4a3a2a',b:'mus',hat:'kepi',hc:'#3a6a8a',s:'#e8c0a0'},
'Gardienne du Phare Brisé':{r:'#5a7a9a',t:'#e8f4ff',h:'#2a2a3a',hs:'braid',s:'#f0cdb0'},
'Insomniaque Mirette':{r:'#6a7ab0',t:'#e0e6ff',h:'#4a3a60',hs:'braid',mood:'sleep',s:'#f0cdb0'},
'Jardinier Sans-Pousse':{r:'#5a6a4a',t:'#c8d8b0',h:'#b8b0a0',b:'short',hat:'straw',hc:'#8a7a50',prop:'shears'},
'Mémé Lumignon':{old:1,r:'#a85a7a',t:'#f0d8e0',h:'#eeeef4',hs:'bun',s:'#f0cdb0',mood:'smile',sc:.92},
'Tonton Zébulon':{r:'#4a7a4a',t:'#e8d070',h:'#6a4a2a',b:'mus',hat:'straw',hc:'#e0c070',prop:'sack',pc:'#ffd24a'},
'Pétoche':{r:'#b02a2a',t:'#e8b860',h:'#4a3020',hat:'kepi',hc:'#1a1a22',mood:'fear'},
'Vieux Sablier':null,
'Marchand de chaussettes':{r:'#7a5aa8',t:'#ffd24a',h:'#2a2020',b:'long',hat:'fez',hc:'#a02a2a',prop:'sack',pc:'#58a0d8'},
'Chamelier':{r:'#c89a4a',t:'#e8e0c8',s:'#c89a70',h:'#2a1a14',hs:'curly',hat:'turban',hc:'#e8d8b0',prop:'crook'},
"Hôtelier de l'oasis":{r:'#e8e0d0',t:'#d8c8a8',h:'#3a2a20',hs:'none',b:'mus',hat:'chef',mood:'open'},
'Délégué des Chaussettes':{r:'#5a5a6a',t:'#c83a3a',s:'#8ab070',h:'#3a4a30',hs:'bald',mood:'flat',frill:1,eye:'#b83a3a'},
'Général Gréviste':{r:'#4a5a30',t:'#ffd24a',h:'#9a9a9a',b:'short',hat:'helm',hc:'#5a6a3a',star:1,prop:'sign',mood:'flat'},
'La lanterne-prison':'prison',
'Pèlerin Cendré':{old:1,r:'#8a8a92',t:'#c8c8d0',hood:'#8a8a92',h:'#c8c8d0',hs:'none',b:'long',prop:'staff',pc:'#d0d0d8',long:1,s:'#cfc4b8'},
'Gardien du Parvis':{r:'#d8d0b0',t:'#c8a860',h:'#f0f0f0',hs:'none',hat:'turban',hc:'#f6f2ea',tr:'#c8a860',prop:'cane',mood:'sleep',long:1},
'La lanterne d’ombre':'ombre',
'Capitaine fantôme':{r:'#8a98b8',t:'#d8e0f0',s:'#e0eaf8',h:'#cfd8ec',b:'short',hat:'tri',hc:'#46506a',tail:1,g:1,aura:'#bcd0ff',eye:'#7ad0ff'},
'Bouffon Sans Rire':{r:'#c83a6a',t:'#ffd24a',sl:'#3a6ac8',h:'#2a2030',hat:'jester',hc:'#c83a6a',mood:'sad'},
'Gardienne des lucioles':{r:'#7ac88a',t:'#e8ffd0',h:'#f0e0a0',hs:'long',wing:1,aura:'#ffe890',hover:-40,sc:.8,s:'#f8e0c8'},
'Cueilleuse Pâquerette':{r:'#e8a0b0',t:'#fff0c8',h:'#7a4a2a',hs:'long',hat:'straw',hc:'#f0d890',tr:'#ff8aa8',prop:'basket'},
'Bergère Brume':{r:'#8aa0c8',t:'#f0f4ff',h:'#e8c890',hs:'braid',hat:'cap',hc:'#6a80b0',tr:'#f0f4ff',prop:'crook'},
'Tondeur Mérinos':{r:'#d0c0a0',t:'#f6f2ea',h:'#8a5a3a',b:'short',hat:'cap',hc:'#8a6a4a',prop:'shears'},
'Concierge Ficelle':{r:'#2a3a6a',t:'#e8b860',h:'#3a2a20',b:'mus',hat:'kepi',hc:'#2a3a6a',prop:'keys'},
'Stagiaire Pochoir':{r:'#4a3a6a',t:'#c8b8e8',h:'#5a3a2a',hat:'cap',hc:'#3a2a50',prop:'quill',s:'#f0cdb0',sc:.9},
'Copiste Rature':{r:'#3a2a4a',t:'#8a7aaa',h:'#2a2a3a',hat:'cap',hc:'#2a2040',tr:'#8a7aaa',prop:'quill',s:'#e8d0b8'},
'Naufragé Barnabé':{r:'#8a7a5a',t:'#d8c8a0',h:'#6a4a2a',b:'short',hat:'straw',hc:'#c8b070',tr:'#8a7a5a',prop:'rod'},
'Vieux Fanal':{old:1,r:'#5a6a7a',t:'#d8e0e8',h:'#e8e8ee',b:'short',hat:'cap',hc:'#2a3a5a',prop:'rod'},
'Mousse Cuivré':{r:'#3a5a8a',t:'#e8f0ff',s:'#d8e8f0',h:'#c07a3a',hat:'cap',hc:'#2a3a6a',tr:'#e8f0ff',tail:1,g:1,aura:'#bcd8ff',eye:'#7ad0ff',sc:.85},
'Pêcheur de Brume':{r:'#4a6a7a',t:'#a8c8d0',h:'#b8bcc0',b:'short',hat:'straw',hc:'#7a8a6a',tr:'#4a6a7a',prop:'rod'},
'Vieille Berceuse':{old:1,r:'#7a6a9a',t:'#d8d0f0',h:'#f0f0f6',hs:'long',mood:'sleep',s:'#f0cdb0',long:1,sc:.92},
'Guide du Mirage':{r:'#3a7ab8',t:'#ffd24a',s:'#6ab0d8',h:'#1a2a4a',b:'short',hat:'turban',hc:'#e8d8f8',tr:'#ffd24a',tail:1,aura:'#8ad0ff',mood:'smile'},
'Porteur d’eau':{r:'#a0784a',t:'#e8d8b0',s:'#b88a60',h:'#2a1a14',hat:'turban',hc:'#e8e0c8',tr:'#6a4a2a',prop:'bucket',b:'mus'},
'Sœur Veilleuse':{r:'#3a4a7a',t:'#e8e8ff',hat:'veil',hc:'#f6f2ea',tr:'#3a4a7a',prop:'lantern',long:1,mood:'sleep',hs:'none'},
'Jardinier de cire':{r:'#d8c070',t:'#a89040',s:'#e8d098',h:'#a89040',hat:'straw',hc:'#e8d8a0',tr:'#a89040',prop:'shears',mood:'flat'}
};
const key=n=>'pnj_'+n.toLowerCase().replace(/[^a-z0-9]+/g,'_');
const wrap=g=>`<g transform="translate(48,128) scale(.285) translate(-150,-438)">${g}</g>`;
const maker=(n,l)=>{if(l==null)return()=>wrap(sablier());if(l=='prison')return()=>wrap(lanternF({glow:'#ffcf80',glass:'#ffe8b0',bars:'#4a4a58',fl:'#ffb040',fl2:'#fff0b0',rim:'#ffb060',cage:1,sad:1}));if(l=='ombre')return()=>wrap(lanternF({glow:'#b080ff',glass:'#2a2040',bars:'#6a5a8a',fl:'#6a3aa8',fl2:'#b890ff',rim:'#b080ff',sad:1}));return()=>wrap(person(l))};
for(const n of Object.keys(LOOKS)){const l=LOOKS[n],k=key(n),sc=1.2*(l&&typeof l=='object'&&l.sc?l.sc:1);SPR.reg(k,maker(n,l),{s:sc});SPR.map(n,k)}
SPR.pnjNames=Object.keys(LOOKS);
SPR.preload();
})();
