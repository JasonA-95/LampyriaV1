// OPTIONS : réglages propres à cet appareil, indépendants de la sauvegarde.
const OPT_KEY='lampyria_opts',FX_MODES=['eleve','reduit','off'];
const SOUND_LEVELS=[0,30,60];
function defaultFx(){let reduced=false;
try{reduced=matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){}
const nav=typeof navigator=='undefined'?{}:navigator;
return reduced||nav.deviceMemory<=2||nav.hardwareConcurrency<=4?'reduit':'eleve'}
function readOptions(){let saved={};try{saved=JSON.parse(localStorage.getItem(OPT_KEY)||'{}')||{}}catch(e){}
return{fx:FX_MODES.includes(saved.fx)?saved.fx:defaultFx(),son:Number.isFinite(saved.son)?Math.max(0,Math.min(100,Math.round(saved.son))):50}}
const OPT=readOptions();
function storeOptions(){try{localStorage.setItem(OPT_KEY,JSON.stringify(OPT))}catch(e){}}
storeOptions();
function cycleFx(){OPT.fx=FX_MODES[(FX_MODES.indexOf(OPT.fx)+1)%FX_MODES.length];storeOptions()}
function cycleSon(){const i=SOUND_LEVELS.indexOf(OPT.son);OPT.son=SOUND_LEVELS[(i+1)%SOUND_LEVELS.length];storeOptions()}