// HÉROS : style « dark fantasy » (proportions adultes, ombres à bord net, liseré lumineux côté droit).
// Trois classes, vue de face (F) et de dos (D). Dessinés dans une grille 300x460 (pieds y=438), réduits dans la boîte du sprite (pieds y=128).
// Chargé avant sprites.js : sprites.js lit HEROE dans son registre `make`.
const HEROE=(()=>{
const INK='#0c0a12',L=`stroke="${INK}" stroke-width="6.5" stroke-linejoin="round" stroke-linecap="round"`;
const P={face:'M133 58Q135 40 150 38Q166 40 168 58L166 78Q160 94 150 96Q140 94 134 78Z',neck:'M142 92L141 112L160 112L158 92Z',
armL:'M104 112Q82 172 90 242L106 240Q108 182 122 132Z',armR:'M196 112Q228 172 224 226L208 228Q204 182 186 132Z',
legL:'M114 292L119 422H145L151 296Z',legR:'M150 296L155 422H183L187 292Z',bootL:'M111 418H147V438H105Z',bootR:'M153 418H189L197 438H153Z'};
const COAT={s:'M108 108Q150 98 192 108L204 196L198 306Q150 320 100 306L96 196Z',l:'M108 108Q150 98 192 108L206 220L220 432Q150 448 80 432L94 220Z'};
const SH={s:'M96 196L100 306Q128 316 150 314L148 106Q120 104 108 108Z',l:'M94 220L80 432Q120 444 150 442L148 106Q122 104 108 108Z'};
const RIM={s:'M186 110L204 196L198 306L184 308L190 200Z',l:'M188 110L206 220L220 432L204 436L194 224Z'};
const eyes=(c,slit)=>`<path d="M138 63Q144 ${slit?60:59} 149 63Q144 65.5 138 63Z M152 63Q158 ${slit?60:59} 164 63Q158 65.5 152 63Z" fill="${c}"/><path d="M136 57L148 59M164 57L152 59" stroke="${INK}" stroke-width="3" fill="none"/><path d="M144 85Q150 86.5 156 85" stroke="${INK}" stroke-width="2.4" fill="none"/>`;
const head=(o,back)=>{let s='';
 if(back)return '';
 s+=`<path d="${P.face}" fill="#c8a088" ${L}/><path d="M133 58Q135 40 150 38L148 96Q140 94 134 78Z" fill="#8a6a58" opacity=".85"/><path d="M162 50Q168 56 167 70L165 80Q164 66 162 50Z" fill="${o.rim}" opacity=".75"/>`+eyes(o.eye||'#e8c870')+`<path d="M150 66L148 76L152 76" stroke="#6a4a3a" stroke-width="1.6" fill="none" opacity=".6"/>`;return s};
const hair=(o,back)=>{if(o.hat||o.hood)return'';const h=o.hair||'#2a2230';
 return back?`<path d="M127 70Q120 26 152 24Q184 26 174 72Q172 94 150 100Q130 94 127 70Z" fill="${h}" ${L}/><path d="M150 30Q156 60 150 98" stroke="#6a6a8a" stroke-width="3" fill="none" opacity=".7"/>`
 :`<path d="M129 66Q124 28 152 26Q182 28 172 68Q170 50 160 46L156 58L148 44L140 58Q134 52 129 66Z M130 60L122 84L134 74Z" fill="${h}" ${L}/><path d="M146 32Q154 30 160 36" stroke="#6a6a8a" stroke-width="3" fill="none"/>`};
const hood=(o,back)=>{if(!o.hood)return'';
 return back?`<path d="M116 96Q104 26 152 18Q200 26 186 96Q150 116 116 96Z" fill="${o.hood}" ${L}/><path d="M116 96Q104 26 140 20Q122 50 126 100Z" fill="${o.coatSh}" opacity=".7"/><path d="M180 60Q190 80 186 96" stroke="${o.rim}" stroke-width="4" fill="none" opacity=".8"/>`
 :`<path d="M118 94Q106 28 152 20Q198 28 184 94Q178 62 152 54Q126 62 118 94Z" fill="${o.hood}" ${L}/><path d="M118 94Q106 28 140 22Q124 54 128 92Z" fill="${o.coatSh}" opacity=".7"/><path d="M178 50Q188 70 184 92" stroke="${o.rim}" stroke-width="4" fill="none" opacity=".8"/><path d="M134 46Q152 40 168 48L166 54Q150 48 136 54Z" fill="#000" opacity=".28"/>`};
const hat=(o,back)=>{if(!o.hat)return'';
 const h=o.hat;return `<path d="M112 50Q150 66 192 50Q192 40 150 36Q110 40 112 50Z" fill="${h}" ${L}/><path d="M122 46Q132 28 138 6Q148 -6 168 2Q180 8 184 24Q168 14 162 26Q168 40 180 46Q150 54 122 46Z" fill="${h}" ${L}/><path d="M124 46Q132 30 138 8Q146 -2 156 0Q140 20 140 46Z" fill="${o.hatSh}" opacity=".8"/><path d="M122 44Q150 54 182 44" stroke="${o.trim}" stroke-width="5" fill="none"/><path d="M176 22Q182 34 180 44" stroke="${o.rim}" stroke-width="4" fill="none" opacity=".85"/>`};
const beard=o=>o.beard?`<path d="M132 78Q150 154 168 78Q150 96 132 78Z" fill="#e6dccb" ${L}/><path d="M150 96Q146 120 150 140" stroke="#a89c88" stroke-width="2.4" fill="none"/>`:'';
const props={
lantern:o=>`<path d="M214 232V262" stroke="${INK}" stroke-width="3"/><path d="M203 262H225L228 312H200Z" fill="#ffe4a8" ${L}/><path d="M214 270Q204 288 214 304Q224 288 214 270Z" fill="#ff8a30" stroke="${INK}" stroke-width="2"/><path d="M200 262H228M200 312H228" stroke="${INK}" stroke-width="7"/><circle cx="214" cy="290" r="26" fill="#ffd890" opacity=".35"/>`,
bow:o=>`<path d="M226 110Q276 250 226 390" stroke="${INK}" stroke-width="14" fill="none" stroke-linecap="round"/><path d="M226 110Q276 250 226 390" stroke="#8a5a2c" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M250 150Q264 250 250 350" stroke="${o.rim}" stroke-width="2.6" fill="none" opacity=".7"/><path d="M226 110L226 390" stroke="#e8e0c8" stroke-width="2.4"/>`,
staff:o=>`<path d="M220 56L222 432" stroke="${INK}" stroke-width="13" stroke-linecap="round"/><path d="M220 56L222 432" stroke="#7a5a30" stroke-width="7" stroke-linecap="round"/><path d="M208 44Q204 24 220 20Q236 24 232 44Q226 36 220 38Q214 36 208 44Z" fill="#8a6a30" ${L}/><circle cx="220" cy="30" r="34" fill="${o.rim}" opacity=".3" filter="url(#b8)"/><circle cx="220" cy="30" r="13" fill="#bff6ff" stroke="${INK}" stroke-width="4"/><circle cx="220" cy="30" r="6" fill="#fff"/>`};
const extra={
quiver:(o,back)=>back?`<path d="M126 104L172 116L164 226L120 212Z" fill="#6a4a2c" ${L}/><path d="M130 110L168 120" stroke="${o.rim}" stroke-width="3" opacity=".6"/><path d="M134 102L128 80M146 106L146 82M158 110L164 86" stroke="#e8e0c8" stroke-width="5" stroke-linecap="round"/><path d="M134 102L128 80M146 106L146 82M158 110L164 86" stroke="#c0402a" stroke-width="2" stroke-linecap="round"/>`
 :`<path d="M96 100L118 80L128 92L106 120Z" fill="#6a4a2c" ${L}/><path d="M100 90L94 70M108 84L106 64M116 82L120 62" stroke="#e8e0c8" stroke-width="5" stroke-linecap="round"/><path d="M122 112L184 232" stroke="${INK}" stroke-width="14" stroke-linecap="round"/><path d="M122 112L184 232" stroke="#7a5a38" stroke-width="8" stroke-linecap="round"/>`,
scarf:o=>`<path d="M184 110Q232 128 230 204Q226 262 242 334L204 322Q208 246 192 204Z" fill="${o.scarf}" ${L}/><path d="M184 110Q232 128 230 204L214 204Q212 140 184 110Z" fill="${o.scarfLt}"/>`};
const build=(o,back)=>{const k=o.long?'l':'s';let s=`<clipPath id="cE"><path d="${COAT[k]}"/></clipPath><circle cx="${o.gx||214}" cy="${o.gy||290}" r="150" fill="${o.rim}" opacity=".14" filter="url(#b8)"/>`;
 if(o.scarf)s+=extra.scarf(o);
 if(!o.long)s+=`<path d="${P.legL}" fill="${o.legs}" ${L}/><path d="${P.legR}" fill="${o.legs2}" ${L}/><path d="${P.bootL}" fill="#1a1620" ${L}/><path d="${P.bootR}" fill="#1a1620" ${L}/>`;
 else s+=`<path d="M92 424Q150 444 214 424L218 438Q150 454 86 438Z" fill="#1a1620"/>`;
 s+=`<path d="${COAT[k]}" fill="${o.coat}" ${L}/><g clip-path="url(#cE)"><path d="${SH[k]}" fill="${o.coatSh}"/><path d="${RIM[k]}" fill="${o.rim}" opacity=".8"/><path d="M80 ${o.long?360:300}Q150 ${o.long?390:330} 220 ${o.long?360:300}L220 450H80Z" fill="#000" opacity=".22"/></g>`;
 if(o.long)s+=`<path d="M92 ${o.long?418:0}Q150 436 214 418" stroke="${o.trim}" stroke-width="6" fill="none"/>`;
 s+=`<path d="M99 ${o.long?236:222}H201V${o.long?246:232}H99Z" fill="${o.belt||'#2a1e1a'}"/><rect x="143" y="${o.long?235:221}" width="14" height="12" fill="${o.trim}" stroke="${INK}" stroke-width="3"/>`;
 if(o.quiver)s+=extra.quiver(o,back);
 s+=`<path d="${P.armL}" fill="${o.sleeve||o.coat}" ${L}/><path d="M104 112Q82 172 90 242L96 241Q92 180 108 120Z" fill="${o.coatSh}"/><circle cx="98" cy="246" r="8" fill="#a88068" stroke="${INK}" stroke-width="4"/>`;
 s+=`<path d="${P.armR}" fill="${o.sleeve||o.coat}" ${L}/><path d="M222 140Q228 180 224 226L218 226Q220 180 212 150Z" fill="${o.rim}" opacity=".85"/>`;
 if(o.prop)s+=props[o.prop](o);
 s+=`<circle cx="${o.hx||214}" cy="${o.hy||232}" r="8" fill="#c8a088" stroke="${INK}" stroke-width="4"/>`;
 s+=`<path d="${P.neck}" fill="#a88068" ${L}/>`;
 s+=`<path d="${back?'M122 104Q150 94 178 104L184 114Q150 124 116 114Z':'M126 100L150 124L174 100L184 112L150 138L116 112Z'}" fill="${o.collar}" ${L}/>`;
 // ordre : cheveux arrière / capuche, visage, barbe, cheveux avant, chapeau
 let h=`<g transform="translate(150,98) scale(1.13) translate(-150,-98)">`;
 if(back){h+=(o.hood?hood(o,true):hair(o,true))+hat(o,true)}
 else{h+=(o.hood?hood(o,false):'')+head(o,false)+(o.hood?'':hair(o,false))+beard(o)+hat(o,false)}
 h+='</g>';
 return s+h};
const wrap=(o,back)=>`<g transform="translate(48,128) scale(.285) translate(-150,-438)">${build(o,back)}</g>`;
const LOOK={
porte:{coat:'#4a647e',coatSh:'#2a3a4e',rim:'#ffb060',scarf:'#a04040',scarfLt:'#c85a50',legs:'#2e3444',legs2:'#3a4254',trim:'#c8a050',collar:'#2a1e26',prop:'lantern'},
archer:{coat:'#4a6a48',coatSh:'#2a4030',rim:'#ffd890',hood:'#3c5c3e',legs:'#4a3a28',legs2:'#5a4830',trim:'#c8a050',collar:'#2a3a28',belt:'#5a3a1c',quiver:1,prop:'bow',sleeve:'#4a6a48'},
mage:{coat:'#5c4c9c',coatSh:'#382c6a',rim:'#8af0ff',long:1,hat:'#4a3a88',hatSh:'#2c2060',trim:'#e8c870',collar:'#382c6a',beard:1,prop:'staff',gx:220,gy:80,hx:220,hy:236,eye:'#9af0ff'}
};
const out={};for(const k in LOOK)out[k]=[()=>wrap(LOOK[k],false),()=>wrap(LOOK[k],true)];
return out})();
