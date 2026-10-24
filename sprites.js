// SPRITES : personnages et monstres vectoriels (SVG) convertis en images au chargement.
// Chaque sprite est dessiné face à droite (trois-quarts) ; la vue de dos sert quand la cible est en haut de l'écran ; le miroir donne la gauche.
const SPR=(()=>{
const O='stroke="#1a1218" stroke-opacity=".6" stroke-width="1.1" stroke-linejoin="round"';
const sh=()=>'';
const DEFS=`
<filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="2" seed="7"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .45 0"/></filter>
<filter id="b2"><feGaussianBlur stdDeviation="2"/></filter>
<filter id="bump" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".05 .08" numOctaves="4" seed="3" result="n"/><feDiffuseLighting in="n" lighting-color="#ffffff" surfaceScale="2.4" result="l"><feDistantLight azimuth="225" elevation="52"/></feDiffuseLighting><feComposite in="SourceGraphic" in2="l" operator="arithmetic" k1="1.25" k2="0" k3="0" k4="0"/></filter>
<linearGradient id="cl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#27325e"/><stop offset=".5" stop-color="#46589a"/><stop offset="1" stop-color="#7a8fd0"/></linearGradient>
<linearGradient id="hd" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5a6cae"/><stop offset="1" stop-color="#26305c"/></linearGradient>
<linearGradient id="sk" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f0c8a0"/><stop offset="1" stop-color="#b88460"/></linearGradient>
<radialGradient id="glow"><stop offset="0" stop-color="#ffd890" stop-opacity=".8"/><stop offset=".4" stop-color="#ffb060" stop-opacity=".25"/><stop offset="1" stop-color="#ff9a45" stop-opacity="0"/></radialGradient>
<linearGradient id="fog" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity=".16"/></linearGradient>
<linearGradient id="cape" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2a1c36"/><stop offset="1" stop-color="#4a3258"/></linearGradient><linearGradient id="scarf" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#a8501e"/><stop offset="1" stop-color="#e8903a"/></linearGradient>`;
const face=(x,y,tint)=>`<g transform="translate(${x},${y})"><path d="M1 4Q13-3 25 4L24 17Q13 27 2 17Z" fill="url(#sk)" ${O}/><path d="M1 4Q8 0 13 0L11 26Q5 22 2 17Z" fill="#2a1418" opacity=".22"/><ellipse cx="20" cy="13" rx="5" ry="7" fill="${tint}" opacity=".28" filter="url(#b2)"/><path d="M1 4Q13-3 25 4L25 10Q13 5 1 10Z" fill="#2a1418" opacity=".5" filter="url(#b2)"/><ellipse cx="7.5" cy="10" rx="2.6" ry="1.7" fill="#f2e8da"/><ellipse cx="18.5" cy="10" rx="2.6" ry="1.7" fill="#f2e8da"/><circle cx="7.8" cy="10" r="1.5" fill="#4a6a5a"/><circle cx="18.8" cy="10" r="1.5" fill="#4a6a5a"/><circle cx="7.8" cy="10" r=".7" fill="#0a0a10"/><circle cx="18.8" cy="10" r=".7" fill="#0a0a10"/><path d="M5 8.6Q7.5 7.4 10.4 8.6M16 8.6Q18.6 7.4 21.4 8.6" stroke="#3a2418" stroke-width=".9" fill="none"/><path d="M4.6 6.4Q7.5 5 10.6 6.4M15.6 6.4Q18.6 5 21.6 6.4" stroke="#4a2e1c" stroke-width="1.3" fill="none" stroke-linecap="round"/><path d="M13 10.4Q12 14 11.4 15.8Q13 17 14.8 15.8" stroke="#9a6a50" stroke-width=".9" fill="none"/><path d="M9.6 20.4Q13 22 16.8 20.4" stroke="#8a4a3c" stroke-width="1.1" fill="none" stroke-linecap="round"/></g>`;
function porte(){  return `<g>${sh(48,128,24,6,34)}
  <circle cx="88" cy="96" r="64" fill="url(#glow)"/>
  <ellipse cx="86" cy="112" rx="30" ry="14" fill="#ffd890" opacity=".22" filter="url(#b2)"/>
  <path d="M36 128l1-26h9l1 26zM52 128l1-26h9l2 26z" fill="#2e211a" ${O}/><path d="M33 128h15v4H33zM51 128h16v4H51z" fill="#1a1210"/>
  <path d="M30 106L34 56Q48 40 64 56L68 106Q48 114 30 106Z" fill="url(#cl)" ${O}/>
  <path d="M38 60Q40 92 36 108M48 58Q51 96 48 112M58 60Q62 94 60 108" stroke="#1a2250" stroke-opacity=".55" stroke-width="1.3" fill="none"/>
  <path d="M60 60Q68 80 66 104" stroke="#a0b4ee" stroke-opacity=".5" stroke-width="2" fill="none"/>
  <path d="M32 80Q48 86 66 80l1 6Q48 92 31 86Z" fill="#8a5a28" ${O}/><rect x="45" y="80" width="8" height="9" rx="1.5" fill="#e8b860" ${O}/><path d="M30 84q-6 6-4 14l8-2z" fill="#6a4420" ${O}/>
  ${face(36,44,"#ffd890")}
  <path d="M32 58Q34 24 49 22Q66 24 66 58Q58 50 49 52Q40 50 32 58Z" fill="url(#hd)" ${O}/>
  <path d="M38 32Q46 24 58 28" stroke="#a0b4ee" stroke-opacity=".5" stroke-width="2" fill="none"/>
  <path d="M64 66Q76 74 84 84" stroke="#2c3868" stroke-width="9" stroke-linecap="round" fill="none"/><path d="M64 66Q76 74 84 84" stroke="#7a8fd0" stroke-opacity=".55" stroke-width="3" stroke-linecap="round" fill="none"/>
  <ellipse cx="85" cy="85" rx="5" ry="4.5" fill="#5a3a22" ${O}/>
  <path d="M85 70v10" stroke="#2a2420" stroke-width="2"/><path d="M76 82h18l-3 24H79z" fill="#ffe8b0" fill-opacity=".85" ${O}/><path d="M79 86h12l-2 16H81z" fill="#fff6d0"/><ellipse cx="85" cy="96" rx="3" ry="5" fill="#ffb040"/><path d="M76 82h18M79 106h12" stroke="#2a2420" stroke-width="2.4"/><path d="M80 82v24M90 82v24" stroke="#2a2420" stroke-opacity=".5" stroke-width="1"/></g>`;
}
function archer(){return `<g>${sh(48,128,24,6,34)}
  <circle cx="14" cy="92" r="56" fill="url(#glow)" opacity=".5"/>
  <path d="M36 128l1-26h9l1 26zM52 128l1-26h9l2 26z" fill="#3a2a1c" ${O}/><path d="M33 128h15v4H33zM51 128h16v4H51z" fill="#1a1210"/>
  <path d="M34 104l2-24h10l1 24zM50 104l1-24h10l3 24z" fill="#4a3a28" ${O}/>
  <path d="M60 52L78 40 82 46 66 62Z" fill="#6a4420" ${O}/><path d="M64 46L76 36M68 50L80 40" stroke="#c8b070" stroke-width="2"/><path d="M62 38l4 6M70 34l4 6M76 32l3 6" stroke="#d8c890" stroke-width="2.4"/><path d="M62 38 60 30M70 34 70 26M76 32 78 24" stroke="#c84a28" stroke-width="2"/>
  <path d="M30 100L33 56Q48 42 64 56L66 100Q48 108 30 100Z" fill="url(#grn)" ${O}/>
  <path d="M40 60Q42 90 38 104M52 62Q56 94 52 106" stroke="#142a14" stroke-opacity=".55" stroke-width="1.3" fill="none"/><path d="M60 60Q68 80 64 98" stroke="#d0f0a0" stroke-opacity=".5" stroke-width="2" fill="none"/>
  <path d="M30 80Q48 86 66 80l1 6Q48 92 29 86Z" fill="#6a4a20" ${O}/><rect x="45" y="80" width="7" height="8" rx="1.5" fill="#d8b050" ${O}/>
  <path d="M31 68L66 90L64 98L30 76Z" fill="#8a5a28" ${O}/>
  ${face(36,47,"#ffe0a0")}
  <path d="M32 58Q34 26 49 24Q66 26 66 58Q58 50 49 52Q40 50 32 58Z" fill="url(#grnh)" ${O}/>
  <path d="M38 34Q46 26 58 30" stroke="#d0f0a0" stroke-opacity=".5" stroke-width="2" fill="none"/>
  <path d="M44 42Q56 30 72 32Q66 42 50 46Z" fill="#8a3a24" ${O}/><path d="M48 42Q60 34 70 33" stroke="#e8b080" stroke-width="1.2" fill="none"/><path d="M44 42L40 46" stroke="#3a2a18" stroke-width="1.4"/><path d="M34 50Q49 44 64 50" stroke="#1a2c14" stroke-opacity=".6" stroke-width="2.4" fill="none"/><path d="M34 54Q49 48 64 54" stroke="#d0f0a0" stroke-opacity=".35" stroke-width="1" fill="none" stroke-dasharray="3 3"/>
  <path d="M62 58 Q74 66 84 60" stroke="#3a5a2a" stroke-width="8" stroke-linecap="round" fill="none"/><path d="M62 58 Q74 66 84 60" stroke="#8ab85a" stroke-opacity=".55" stroke-width="3" stroke-linecap="round" fill="none"/>
  <circle cx="86" cy="60" r="4.4" fill="#5a3a22" ${O}/>
  <path d="M82 22 Q104 66 82 112" stroke="#6a4420" stroke-width="4.4" fill="none" stroke-linecap="round"/><path d="M82 22 Q104 66 82 112" stroke="#d8a860" stroke-opacity=".6" stroke-width="1.6" fill="none"/><path d="M82 22L82 112" stroke="#e8e0c8" stroke-width="1.2" opacity=".9"/><path d="M90 66h-8" stroke="#e8e0c8" stroke-width="1.6"/><path d="M86 62l-8 4 8 4" fill="#d8c890" stroke="none"/></g>`}
function mage(){return `<g>${sh(48,128,26,6,34)}
  <circle cx="86" cy="62" r="40" fill="url(#glow)" opacity=".0"/><circle cx="88" cy="28" r="48" fill="#9af0ff" opacity=".18" filter="url(#b8)"/>
  <path d="M26 128 L32 54 Q48 40 66 54 L74 128 Q48 134 26 128Z" fill="url(#pur)" ${O}/>
  <path d="M38 60Q36 100 30 126M50 58Q50 104 48 132M62 60Q66 100 70 128" stroke="#1c1038" stroke-opacity=".55" stroke-width="1.4" fill="none"/>
  <path d="M64 58Q72 90 74 124" stroke="#d8c4ff" stroke-opacity=".5" stroke-width="2" fill="none"/>
  <path d="M26 124Q48 134 74 124" stroke="#e8c870" stroke-width="3" fill="none"/><path d="M28 118Q48 128 72 118" stroke="#a88830" stroke-width="1.2" stroke-dasharray="5 4" fill="none"/>
  <path d="M32 78Q48 86 66 78l1 7Q48 94 31 86Z" fill="#e8c870" ${O}/><circle cx="49" cy="86" r="3.6" fill="#9af0ff" ${O}/>
  ${face(36,50,"#9af0ff")}
  <path d="M36 67Q40 80 49 88Q58 80 62 67Q54 73 49 72Q44 73 36 67Z" fill="#e6dccb" ${O}/><path d="M42 74Q49 82 56 74" stroke="#a89c88" stroke-width="1" fill="none"/>
  <path d="M12 49Q30 38 50 40Q72 40 88 52Q70 57 50 57Q28 57 12 49Z" fill="url(#purh)" ${O}/><path d="M16 49Q32 42 50 44" stroke="#d8c4ff" stroke-opacity=".4" stroke-width="2" fill="none"/>
  <path d="M28 47Q30 26 44 14Q52 8 60 6Q70 4 78 10Q82 14 80 19Q74 12 68 17Q62 32 72 47Q50 52 28 47Z" fill="url(#purh)" ${O}/>
  <path d="M42 16Q50 30 44 48M56 10Q60 30 62 48" stroke="#1c1038" stroke-opacity=".5" stroke-width="1.4" fill="none"/><path d="M34 34Q40 20 52 12" stroke="#d8c4ff" stroke-opacity=".5" stroke-width="2" fill="none"/>
  <path d="M28 44Q50 52 71 44" stroke="#5a3a18" stroke-width="3.6" fill="none"/><path d="M28 43Q50 50 71 43" stroke="#c8a850" stroke-width="1.2" fill="none"/><rect x="45" y="46" width="8" height="6" rx="1" fill="#d8b860" ${O}/>
  <path d="M64 62Q76 70 84 76" stroke="#4a2c80" stroke-width="8" stroke-linecap="round" fill="none"/><path d="M64 62Q76 70 84 76" stroke="#c8b0f0" stroke-opacity=".55" stroke-width="3" stroke-linecap="round" fill="none"/>
  <ellipse cx="85" cy="78" rx="4.6" ry="4.2" fill="#e8c8a0" ${O}/>
  <path d="M86 4 L88 132" stroke="#6a4420" stroke-width="4" stroke-linecap="round"/><path d="M86 4L88 132" stroke="#c8a060" stroke-opacity=".5" stroke-width="1.4"/>
  <path d="M80 12Q86 2 94 12Q94 22 88 24Q80 22 80 12Z" fill="#8a6a30" ${O}/>
  <circle cx="88" cy="14" r="18" fill="url(#orb)"/><circle cx="88" cy="14" r="6.4" fill="#e8ffff"/></g>`}

const legs=()=>`<path d="M36 128l1-26h9l1 26zM52 128l1-26h9l2 26z" fill="#2e211a" ${O}/><path d="M33 128h15v4H33zM51 128h16v4H51z" fill="#1a1210"/>`;
function porteD(){return `<g>${sh(48,128,24,6,34)}
  <circle cx="88" cy="96" r="60" fill="url(#glow)"/>${legs()}
  <path d="M30 106L33 56Q48 42 65 56L69 108Q48 116 30 106Z" fill="url(#cl)" ${O}/>
  <path d="M26 112Q24 80 32 56L66 56Q74 84 72 114Q48 124 26 112Z" fill="url(#cape)" ${O}/>
  <path d="M38 60Q36 96 34 114M48 60Q48 100 48 118M58 60Q60 96 62 114" stroke="#120a18" stroke-opacity=".55" stroke-width="1.4" fill="none"/>
  <path d="M64 62Q72 88 70 112" stroke="#c8b0f0" stroke-opacity=".4" stroke-width="2" fill="none"/>
  <path d="M30 88Q48 94 68 88l1 6Q48 100 29 94Z" fill="#8a5a28" ${O}/><path d="M34 60L66 96" stroke="#6a4420" stroke-width="5" ${O}/>
  <path d="M30 112Q48 120 70 112" stroke="#e8c870" stroke-width="2" fill="none" stroke-dasharray="5 4"/>
  <path d="M34 54Q48 62 62 54L60 62Q48 70 36 62Z" fill="url(#scarf)" ${O}/>
  <path d="M30 56Q30 20 48 18Q68 20 68 56Q58 48 48 50Q40 48 30 56Z" fill="url(#hd)" ${O}/>
  <path d="M48 20Q50 40 48 52" stroke="#141a38" stroke-opacity=".7" stroke-width="1.6" fill="none"/><path d="M36 30Q44 22 58 26" stroke="#a0b4ee" stroke-opacity=".5" stroke-width="2" fill="none"/>
  <path d="M64 64Q76 70 84 80" stroke="#3a4a88" stroke-width="8" stroke-linecap="round" fill="none"/><ellipse cx="85" cy="81" rx="4.6" ry="4.2" fill="#5a3a22" ${O}/>
  <path d="M85 74v6" stroke="#2a2420" stroke-width="2"/><path d="M77 84h16l-3 22H80z" fill="#ffe8b0" fill-opacity=".85" ${O}/><ellipse cx="85" cy="96" rx="3" ry="5" fill="#ffb040"/><path d="M77 84h16M80 106h10" stroke="#2a2420" stroke-width="2.2"/></g>`}
function archerD(){return `<g>${sh(48,128,24,6,34)}${legs()}
  <path d="M34 104l2-24h10l1 24zM50 104l1-24h10l3 24z" fill="#4a3a28" ${O}/>
  <path d="M30 108L33 56Q48 44 65 56L68 108Q48 116 30 108Z" fill="url(#grn)" ${O}/>
  <path d="M38 60Q36 96 34 110M48 60Q48 100 48 114M58 60Q60 96 62 110" stroke="#142a14" stroke-opacity=".55" stroke-width="1.4" fill="none"/><path d="M62 62Q68 86 66 106" stroke="#d0f0a0" stroke-opacity=".45" stroke-width="2" fill="none"/>
  <path d="M32 82Q48 88 66 82l1 6Q48 94 31 88Z" fill="#6a4a20" ${O}/>
  <path d="M28 52L46 82L40 90L24 60Z" fill="#6a4420" ${O}/><path d="M24 56L16 36M28 54L22 32M32 56L28 34" stroke="#d8c890" stroke-width="2.2"/><path d="M16 36l-2-8M22 32l-1-8M28 34l1-8" stroke="#c84a28" stroke-width="2.4"/>
  <path d="M34 66L68 92" stroke="#8a5a28" stroke-width="5" ${O}/>
  <path d="M32 58Q34 22 49 20Q66 22 66 58Q58 50 49 52Q40 50 32 58Z" fill="url(#grnh)" ${O}/>
  <path d="M49 22Q50 40 49 52" stroke="#142a14" stroke-opacity=".7" stroke-width="1.6" fill="none"/><path d="M38 32Q46 24 58 28" stroke="#d0f0a0" stroke-opacity=".5" stroke-width="2" fill="none"/>
  <path d="M44 38Q56 28 72 30Q66 40 50 44Z" fill="#8a3a24" ${O}/><path d="M48 38Q60 32 70 31" stroke="#e8b080" stroke-width="1.2" fill="none"/>
  <path d="M62 62Q74 68 82 62" stroke="#3a5a2a" stroke-width="8" stroke-linecap="round" fill="none"/><circle cx="84" cy="62" r="4.4" fill="#5a3a22" ${O}/>
  <path d="M82 22Q104 66 82 112" stroke="#6a4420" stroke-width="4.4" fill="none" stroke-linecap="round"/><path d="M82 22L82 112" stroke="#e8e0c8" stroke-width="1.2" opacity=".9"/></g>`}
function mageD(){return `<g>${sh(48,128,26,6,34)}
  <circle cx="88" cy="28" r="48" fill="#9af0ff" opacity=".18" filter="url(#b8)"/>
  <path d="M26 128L32 54Q48 42 66 54L74 128Q48 134 26 128Z" fill="url(#pur)" ${O}/>
  <path d="M38 60Q36 100 30 126M48 58Q48 104 46 132M58 60Q62 100 68 128" stroke="#1c1038" stroke-opacity=".55" stroke-width="1.4" fill="none"/><path d="M64 58Q72 90 74 124" stroke="#d8c4ff" stroke-opacity=".45" stroke-width="2" fill="none"/>
  <path d="M26 124Q48 134 74 124" stroke="#e8c870" stroke-width="3" fill="none"/>
  <path d="M32 82Q48 90 66 82l1 7Q48 98 31 90Z" fill="#e8c870" ${O}/><path d="M44 90q-4 12-8 20M52 91q2 12 6 22" stroke="#e8c870" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  <path d="M34 54Q48 62 64 54L62 60Q48 68 36 60Z" fill="#d8c8a0" ${O}/>
  <path d="M34 46Q48 62 64 46L60 40Q48 48 38 40Z" fill="#5a4a38" ${O}/>
  <path d="M12 49Q30 38 50 40Q72 40 88 52Q70 57 50 57Q28 57 12 49Z" fill="url(#purh)" ${O}/>
  <path d="M28 47Q30 26 44 14Q52 8 60 6Q70 4 78 10Q82 14 80 19Q74 12 68 17Q62 32 72 47Q50 52 28 47Z" fill="url(#purh)" ${O}/>
  <path d="M42 16Q50 30 44 48M56 10Q60 30 62 48" stroke="#1c1038" stroke-opacity=".5" stroke-width="1.4" fill="none"/><path d="M34 34Q40 20 52 12" stroke="#d8c4ff" stroke-opacity=".5" stroke-width="2" fill="none"/>
  <path d="M28 44Q50 52 71 44" stroke="#5a3a18" stroke-width="3.6" fill="none"/>
  <path d="M64 62Q76 70 84 76" stroke="#4a2c80" stroke-width="8" stroke-linecap="round" fill="none"/><ellipse cx="85" cy="78" rx="4.6" ry="4.2" fill="#e8c8a0" ${O}/>
  <path d="M86 4L88 132" stroke="#6a4420" stroke-width="4" stroke-linecap="round"/><path d="M80 12Q86 2 94 12Q94 22 88 24Q80 22 80 12Z" fill="#8a6a30" ${O}/><circle cx="88" cy="14" r="18" fill="url(#orb)"/><circle cx="88" cy="14" r="6.4" fill="#e8ffff"/></g>`}

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
const VB='-16 -36 130 180',IW=260,IH=360,AN={mouche:[48,100],champignon:[48,90]};
const make={porte:[porte,porteD],archer:[archer,archerD],mage:[mage,mageD],mouche:[mouche,mouche],champignon:[champignon,champignon]};
const MON={'🪰':'mouche','🍄':'champignon'};
const cache={};
function img(key,back){const k=key+(back?'D':'F');if(cache[k])return cache[k];const fn=make[key][back?1:0];
const svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="'+VB+'" width="'+IW+'" height="'+IH+'"><defs>'+DEFS+'</defs>'+fn()+'</svg>';
const im=new Image();im.onload=()=>{im.ready=true;setTimeout(()=>{try{if(typeof C!='undefined'&&C&&typeof combatLive!='undefined'&&combatLive)draw()}catch(e){}},0)};im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);return cache[k]=im}
function keyOf(u,hero){if(u===hero)return make[cfg.classe]?cfg.classe:null;return MON[u.e]||null}
function drawKey(g,key,right,back,tw,th){const im=img(key,back);if(!im.ready)return false;
const s=tw/100,w=130*s,hh=180*s,A=AN[key]||[48,128],ax=(A[0]+16)*s,ay=(A[1]+36)*s;
g.save();if(!right)g.scale(-1,1);g.drawImage(im,-ax,-ay,w,hh);g.restore();return true}
// Combat : l'unité u se tourne vers sa cible (le héros vise le monstre le plus proche, les monstres visent le héros).
function draw(g,u,hero,foes,tw,th){const key=keyOf(u,hero);if(!key)return false;
let tgt=hero;if(u===hero){let best=1e9;for(const f of foes){if(f.hp<=0)continue;const d=Math.abs(f.x-u.x)+Math.abs(f.y-u.y);if(d<best){best=d;tgt=f}}}
const right=tgt===u?true:(tgt.x-tgt.y)>=(u.x-u.y),back=tgt!==u&&(tgt.x+tgt.y)<(u.x+u.y);
return drawKey(g,key,right,back,tw,th)}
const has=(u,hero)=>{const k=keyOf(u,hero);return !!k};
for(const k in make){img(k,false);img(k,true)}
const heroKey=()=>make[cfg.classe]?cfg.classe:null,monKey=e=>MON[e]||null;
return{draw,drawKey,has,heroKey,monKey}})();
