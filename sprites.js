// SPRITES : personnages et monstres vectoriels (SVG) convertis en images au chargement.
// Chaque sprite est dessiné face à droite (trois-quarts) ; la vue de dos sert quand la cible est en haut de l'écran ; le miroir donne la gauche.
const SPR=(()=>{
const O='stroke="#1a1218" stroke-opacity=".6" stroke-width="1.1" stroke-linejoin="round"';
const sh=()=>'';
const DEFS=`<filter id="b8"><feGaussianBlur stdDeviation="9"/></filter><linearGradient id="grn" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2a4a2a"/><stop offset=".55" stop-color="#4a7a3a"/><stop offset="1" stop-color="#8ab85a"/></linearGradient><linearGradient id="grnh" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5a8a44"/><stop offset="1" stop-color="#2a4a2a"/></linearGradient><linearGradient id="pur" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3a2060"/><stop offset=".55" stop-color="#6a42a8"/><stop offset="1" stop-color="#a888e0"/></linearGradient><linearGradient id="purh" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7a58b8"/><stop offset="1" stop-color="#34205a"/></linearGradient><radialGradient id="orb"><stop offset="0" stop-color="#fff"/><stop offset=".4" stop-color="#9af0ff"/><stop offset="1" stop-color="#3a90d0" stop-opacity="0"/></radialGradient><linearGradient id="cap" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#b04a9a"/><stop offset="1" stop-color="#4a1c5a"/></linearGradient>
<filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="2" seed="7"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .45 0"/></filter>
<filter id="b2"><feGaussianBlur stdDeviation="2"/></filter>
<filter id="bump" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".05 .08" numOctaves="4" seed="3" result="n"/><feDiffuseLighting in="n" lighting-color="#ffffff" surfaceScale="2.4" result="l"><feDistantLight azimuth="225" elevation="52"/></feDiffuseLighting><feComposite in="SourceGraphic" in2="l" operator="arithmetic" k1="1.25" k2="0" k3="0" k4="0"/></filter>
<linearGradient id="cl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#27325e"/><stop offset=".5" stop-color="#46589a"/><stop offset="1" stop-color="#7a8fd0"/></linearGradient>
<linearGradient id="hd" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5a6cae"/><stop offset="1" stop-color="#26305c"/></linearGradient>
<linearGradient id="sk" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f0c8a0"/><stop offset="1" stop-color="#b88460"/></linearGradient>
<radialGradient id="glow"><stop offset="0" stop-color="#ffd890" stop-opacity=".8"/><stop offset=".4" stop-color="#ffb060" stop-opacity=".25"/><stop offset="1" stop-color="#ff9a45" stop-opacity="0"/></radialGradient>
<linearGradient id="fog" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity=".16"/></linearGradient>
<filter id="celE" x="-12%" y="-12%" width="124%" height="124%" color-interpolation-filters="sRGB"><feColorMatrix in="SourceGraphic" type="saturate" values=".88" result="sat"/><feComponentTransfer in="sat" result="post"><feFuncR type="discrete" tableValues=".05 .15 .26 .37 .48 .59 .7 .82 .92 1"/><feFuncG type="discrete" tableValues=".05 .15 .26 .37 .48 .59 .7 .82 .92 1"/><feFuncB type="discrete" tableValues=".05 .15 .26 .37 .48 .59 .7 .82 .92 1"/></feComponentTransfer><feComponentTransfer in="SourceAlpha" result="solid"><feFuncA type="discrete" tableValues="0 0 1 1"/></feComponentTransfer><feMorphology in="solid" operator="dilate" radius="1.5" result="d"/><feFlood flood-color="#0c0a12"/><feComposite in2="d" operator="in" result="ol"/><feOffset in="solid" dx="-3.5" dy="0" result="o"/><feComposite in="solid" in2="o" operator="out" result="ra"/><feFlood flood-color="#ffb060" flood-opacity=".7"/><feComposite in2="ra" operator="in" result="rim"/><feOffset in="solid" dx="4" dy="2" result="o2"/><feComposite in="solid" in2="o2" operator="out" result="la"/><feFlood flood-color="#10081a" flood-opacity=".3"/><feComposite in2="la" operator="in" result="sh"/><feMerge><feMergeNode in="ol"/><feMergeNode in="post"/><feMergeNode in="sh"/><feMergeNode in="rim"/></feMerge></filter>
<linearGradient id="cape" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2a1c36"/><stop offset="1" stop-color="#4a3258"/></linearGradient><linearGradient id="scarf" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#a8501e"/><stop offset="1" stop-color="#e8903a"/></linearGradient>`;
const face=(x,y,tint)=>`<g transform="translate(${x},${y})"><path d="M1 4Q13-3 25 4L24 17Q13 27 2 17Z" fill="url(#sk)" ${O}/><path d="M1 4Q8 0 13 0L11 26Q5 22 2 17Z" fill="#2a1418" opacity=".22"/><ellipse cx="20" cy="13" rx="5" ry="7" fill="${tint}" opacity=".28" filter="url(#b2)"/><path d="M1 4Q13-3 25 4L25 10Q13 5 1 10Z" fill="#2a1418" opacity=".5" filter="url(#b2)"/><ellipse cx="7.5" cy="10" rx="2.6" ry="1.7" fill="#f2e8da"/><ellipse cx="18.5" cy="10" rx="2.6" ry="1.7" fill="#f2e8da"/><circle cx="7.8" cy="10" r="1.5" fill="#4a6a5a"/><circle cx="18.8" cy="10" r="1.5" fill="#4a6a5a"/><circle cx="7.8" cy="10" r=".7" fill="#0a0a10"/><circle cx="18.8" cy="10" r=".7" fill="#0a0a10"/><path d="M5 8.6Q7.5 7.4 10.4 8.6M16 8.6Q18.6 7.4 21.4 8.6" stroke="#3a2418" stroke-width=".9" fill="none"/><path d="M4.6 6.4Q7.5 5 10.6 6.4M15.6 6.4Q18.6 5 21.6 6.4" stroke="#4a2e1c" stroke-width="1.3" fill="none" stroke-linecap="round"/><path d="M13 10.4Q12 14 11.4 15.8Q13 17 14.8 15.8" stroke="#9a6a50" stroke-width=".9" fill="none"/><path d="M9.6 20.4Q13 22 16.8 20.4" stroke="#8a4a3c" stroke-width="1.1" fill="none" stroke-linecap="round"/></g>`;
function mouche(){return `<g><ellipse cx="48" cy="88" rx="20" ry="5" fill="#0a0610" opacity=".45" filter="url(#b2)"/><circle cx="48" cy="58" r="40" fill="url(#glow)"/>
  <path d="M46 46Q8 14 6 44Q10 62 44 56Z" fill="#e0e8f8" opacity=".6" ${O}/><path d="M50 46Q88 14 90 44Q86 62 52 56Z" fill="#e0e8f8" opacity=".6" ${O}/>
  <path d="M44 48Q22 30 10 42M44 52Q24 48 14 54M52 48Q74 30 86 42M52 52Q72 48 82 54" stroke="#fff" stroke-width="1" fill="none" opacity=".8"/>
  <path d="M40 44Q48 36 56 44L58 62Q48 70 38 62Z" fill="#3a2a30" ${O}/><path d="M38 62Q36 80 48 86Q60 80 58 62Q48 68 38 62Z" fill="#d8501f" ${O}/><path d="M42 68Q48 80 54 68Q48 72 42 68Z" fill="#ffb454"/><ellipse cx="48" cy="76" rx="6" ry="7" fill="#fff4c0"/>
  <circle cx="43" cy="46" r="3" fill="#ffb060"/><circle cx="53" cy="46" r="3" fill="#ffb060"/><path d="M42 40Q38 30 32 28M54 40Q58 30 64 28" stroke="#1a1218" stroke-width="2" fill="none"/></g>`}
function champignon(){return `<g>${sh(48,90,30,7,26)}
  <path d="M34 50Q30 76 26 90L68 90Q62 76 62 50Z" fill="#d8ccae" ${O}/><path d="M34 50Q31 76 28 90L42 90Q42 70 44 50Z" fill="#b4a684" opacity=".7"/>
  <path d="M8 54Q6 12 48 10Q90 12 88 54Q70 62 48 58Q26 62 8 54Z" fill="#7a4fa8" ${O}/><path d="M48 10Q90 12 88 54Q80 58 66 58Q80 36 48 10Z" fill="#5b3a86" opacity=".6"/><path d="M14 40Q20 16 48 14" stroke="#c4a0f0" stroke-width="2.4" fill="none" opacity=".7"/>
  <circle cx="30" cy="30" r="5" fill="#ecdcff"/><circle cx="58" cy="24" r="3.5" fill="#ecdcff"/><circle cx="72" cy="38" r="4" fill="#ecdcff"/>
  <path d="M14 54q6 10 10 2q4 10 10 2M60 58q6 10 10 2q4 8 10 0" fill="#f0e6cc" stroke="#1a1218" stroke-width="1.4"/>
  <ellipse cx="42" cy="64" rx="3" ry="4.5" fill="#1a1218"/><ellipse cx="54" cy="64" rx="3" ry="4.5" fill="#1a1218"/><circle cx="42" cy="63" r="1.2" fill="#9aff9a"/><circle cx="54" cy="63" r="1.2" fill="#9aff9a"/><path d="M40 74Q48 80 56 74" stroke="#1a1218" stroke-width="2" fill="none"/></g>`}

function mouton(){return `<g>
  <ellipse cx="48" cy="60" rx="46" ry="38" fill="url(#glow)" opacity=".5"/>
  <path d="M20 66Q10 50 24 42Q22 26 40 28Q48 16 62 26Q80 24 80 42Q92 52 78 66Q80 84 70 88Q62 80 56 90Q48 82 40 90Q34 80 26 88Q16 82 20 66Z" fill="#dfe8f4" fill-opacity=".92" ${O}/>
  <path d="M24 44Q34 36 44 44M52 36Q62 30 72 40M26 62Q36 56 46 64M54 60Q66 54 76 62" stroke="#a8b8d4" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M60 30Q72 34 74 46Q74 58 62 62Q54 56 54 44Q54 34 60 30Z" fill="#46506a" ${O}/>
  <path d="M60 30Q66 22 74 28" stroke="#8a96b4" stroke-width="3.4" fill="none" stroke-linecap="round"/><path d="M56 40Q48 36 46 44" stroke="#46506a" stroke-width="6" fill="none" stroke-linecap="round"/>
  <ellipse cx="63" cy="42" rx="3" ry="3.6" fill="#e8ffff"/><ellipse cx="72" cy="44" rx="2.6" ry="3.2" fill="#e8ffff"/><circle cx="63" cy="42" r="1.2" fill="#2a3048"/><circle cx="72" cy="44" r="1.1" fill="#2a3048"/>
  <path d="M64 54Q69 57 73 53" stroke="#1a1c2c" stroke-width="1.6" fill="none"/>
  <path d="M30 40Q36 34 46 36" stroke="#fff" stroke-opacity=".7" stroke-width="2.4" fill="none"/></g>`}
function mycelium(){return `<g>
  <ellipse cx="48" cy="78" rx="52" ry="14" fill="#06040a" opacity=".35" filter="url(#b2)"/>
  <circle cx="48" cy="46" r="52" fill="#d8a0ff" opacity=".16" filter="url(#b8)"/>
  <path d="M16 90Q4 84 2 74M24 92Q14 98 6 94M72 90Q84 84 94 76M66 92Q78 98 88 94" stroke="#6a4a38" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M30 90Q34 66 32 50L66 50Q62 66 68 90Z" fill="#e0d4b4" ${O}/><path d="M32 52Q34 70 32 90L44 90Q46 70 44 52Z" fill="#b8a888" opacity=".6"/>
  <path d="M30 80Q40 86 48 80Q58 86 68 80" stroke="#5a7a3a" stroke-width="5" fill="none" stroke-linecap="round" opacity=".85"/>
  <path d="M-2 52Q-6 4 48 2Q102 4 98 52Q76 62 48 58Q20 62 -2 52Z" fill="url(#cap)" ${O}/>
  <path d="M6 44Q10 14 48 8" stroke="#d8a8ff" stroke-width="3" fill="none" opacity=".6" stroke-linecap="round"/>
  <circle cx="22" cy="28" r="6" fill="#f0d8ff"/><circle cx="52" cy="16" r="5" fill="#f0d8ff"/><circle cx="76" cy="30" r="7" fill="#f0d8ff"/><circle cx="40" cy="38" r="3.4" fill="#f0d8ff"/><circle cx="64" cy="44" r="3" fill="#f0d8ff"/>
  <path d="M6 54q8 12 14 2q6 12 14 2q6 10 14 2q8 10 14 0q8 12 14 2q8 10 14 -2q6 8 8-2" fill="#ece0c8" stroke="#1a1218" stroke-opacity=".6" stroke-width="1.1"/>
  <path d="M38 66Q43 62 47 66M52 66Q57 62 62 66" stroke="#1a1218" stroke-width="2.4" fill="none"/><ellipse cx="42" cy="70" rx="2.6" ry="3.4" fill="#1a1218"/><ellipse cx="58" cy="70" rx="2.6" ry="3.4" fill="#1a1218"/><circle cx="42" cy="69" r="1" fill="#b8ff9a"/><circle cx="58" cy="69" r="1" fill="#b8ff9a"/>
  <path d="M40 80Q50 86 60 80" stroke="#1a1218" stroke-width="2.4" fill="none"/>
  <circle cx="14" cy="14" r="2.2" fill="#d8ffb8"/><circle cx="88" cy="12" r="2.6" fill="#d8ffb8"/><circle cx="98" cy="36" r="2" fill="#d8ffb8"/><circle cx="2" cy="34" r="2" fill="#d8ffb8"/></g>`}
const VB='-16 -36 130 180',IW=260,IH=360,AN={mouche:[48,100],champignon:[48,90],mouton:[48,92],mycelium:[48,86]};
const make={porte:HEROE.porte,archer:HEROE.archer,mage:HEROE.mage,mouche:[mouche,mouche],champignon:[champignon,champignon],mouton:[mouton,mouton],mycelium:[mycelium,mycelium]};
// Registre : nom exact du monstre (DATA.rencontres[].m[].n) -> sprite. Ajouter un monstre = une ligne ici + une fonction de dessin.
const MON={'La mouche à braise':'mouche','Le champignon bavard':'champignon','Le mouton-fantôme':'mouton','Mère Mycélium':'mycelium','Le moustique d’ombre':'mouche','Le blaireau de brume':'mouton'};
const SC={mycelium:1.55,porte:1.2,archer:1.2,mage:1.2};
const cache={};
const cel=(key,g)=>/^(porte|archer|mage|pnj_)/.test(key)?g:'<g filter="url(#celE)">'+g+'</g>';
function raw(key,back){const fn=make[key][back?1:0];return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="'+VB+'" width="'+IW+'" height="'+IH+'"><defs>'+DEFS+'</defs>'+cel(key,fn())+'</svg>'}
function img(key,back){if(make[key][0]===make[key][1])back=false;const k=key+(back?'D':'F');if(cache[k])return cache[k];const fn=make[key][back?1:0];
const svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="'+VB+'" width="'+IW+'" height="'+IH+'"><defs>'+DEFS+'</defs>'+cel(key,fn())+'</svg>';
const im=new Image();im.onload=()=>{try{const c=document.createElement('canvas');c.width=IW;c.height=IH;c.getContext('2d').drawImage(im,0,0,IW,IH);im.bmp=c}catch(e){im.bmp=null}im.ready=true;setTimeout(()=>{try{if(typeof C!='undefined'&&C&&typeof combatLive!='undefined'&&combatLive)draw()}catch(e){}},0)};im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);return cache[k]=im}
function keyOf(u,hero){if(u===hero)return make[cfg.classe]?cfg.classe:null;return MON[u.n]||null}
function drawKey(g,key,right,back,tw,th){let im=img(key,back);if(!im.ready){const alt=img(key,!back);if(!alt.ready)return false;im=alt}
const s=tw/100*(SC[key]||1),w=130*s,hh=180*s,A=AN[key]||[48,128],ax=(A[0]+16)*s,ay=(A[1]+36)*s;
g.save();if(!right)g.scale(-1,1);g.drawImage(im.bmp||im,-ax,-ay,w,hh);g.restore();return true}
// Combat : l'unité u se tourne vers sa cible (le héros vise le monstre le plus proche, les monstres visent le héros).
function draw(g,u,hero,foes,tw,th){const key=keyOf(u,hero);if(!key)return false;
let tgt=hero;if(u===hero){let best=1e9;for(const f of foes){if(f.hp<=0)continue;const d=Math.abs(f.x-u.x)+Math.abs(f.y-u.y);if(d<best){best=d;tgt=f}}}
let right=tgt===u?true:(tgt.x-tgt.y)>=(u.x-u.y),back=tgt!==u&&(tgt.x+tgt.y)<(u.x+u.y);
if(u===hero&&hero.face){right=hero.face.right;back=hero.face.back}
return drawKey(g,key,right,back,tw,th)}
const has=(u,hero)=>{const k=keyOf(u,hero);return !!k};
const lift=(u,hero,th)=>{const k=keyOf(u,hero);return k?th*1.3*(SC[k]||1):0};

const reg=(key,fn,o={})=>{make[key]=[fn,fn];if(o.a)AN[key]=o.a;if(o.s)SC[key]=o.s},map=(n,k)=>{MON[n]=k};
const preload=()=>{Object.keys(make).forEach((k,i)=>setTimeout(()=>{img(k,false);if(make[k][0]!==make[k][1])img(k,true)},i*25))};
const heroKey=()=>make[cfg.classe]?cfg.classe:null,monKey=n=>MON[n]||null;
preload();
return{draw,drawKey,has,lift,heroKey,monKey,reg,map,preload,raw,get keys(){return Object.keys(make)},get names(){return Object.keys(MON)}}})();
