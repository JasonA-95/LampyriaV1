const test=require('node:test'),assert=require('node:assert'),fs=require('fs');
function ctx(){const n=()=>({connect(){},start(){},stop(){},frequency:{setValueAtTime(){},linearRampToValueAtTime(){}},gain:{value:0,setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){},setTargetAtTime(){},cancelScheduledValues(){}}});
return{currentTime:0,state:'running',destination:{},createOscillator:n,createGain:n}}
function load(son){const g=globalThis;g.OPT={son};g.AudioContext=ctx;g.soundUnlocked=false;
const code=fs.readFileSync('son.js','utf8')+fs.readFileSync('musique.js','utf8')+';return {MUS,MUS_T,playMusic,musTick,unlockSound,musCompose}';
return new Function(code)()}
test('tous les thèmes démarrent sans erreur et planifient des notes',()=>{const m=load(60);m.unlockSound();
for(const k of Object.keys(m.MUS_T)){m.playMusic(k);assert.equal(m.MUS.theme,k)}
clearInterval(m.MUS.timer);assert.ok(m.MUS.step>0)});
test('son coupé : aucun thème lancé',()=>{const m=load(0);m.unlockSound();m.playMusic('foret');assert.equal(m.MUS.theme,null);clearInterval(m.MUS.timer)});
test('composition : 8 mesures, mélodie répétée, finit sur la tonique, notes finies',()=>{const m=load(60);
for(const k of Object.keys(m.MUS_T)){const ev=m.musCompose(k),mel=ev.filter(e=>e[3]=='m');assert.ok(ev.every(e=>e[0]>=0&&e[0]<64&&isFinite(e[1])&&e[2]>=1));
const sig=a=>mel.filter(e=>e[0]>=a&&e[0]<a+24).map(e=>(e[0]-a)+':'+e[1].toFixed(2)).join();assert.equal(sig(0),sig(32),k);
const r=m.MUS_T[k].r,f=mel[mel.length-1][1];assert.ok(Math.abs(Math.log2(f/(r*2)))<.001,k+' tonique')}});
test('bruitages : tous les types connus de playSound',()=>{const m=load(60);m.unlockSound();const f=new Function('return playSound');
const play=new Function(fs.readFileSync('son.js','utf8')+';soundUnlocked=true;soundAudio=globalThis.__ctx;return playSound')
globalThis.__ctx=ctx();globalThis.OPT={son:60};globalThis.soundNoiseSeed=1;const ps=play();ctx2=null;
const mk=()=>{const c=ctx();c.sampleRate=8000;c.createBuffer=(a,l)=>({getChannelData:()=>new Float32Array(l)});c.createBufferSource=()=>({connect(){},start(){},stop(){}});c.createBiquadFilter=()=>({connect(){},frequency:{setValueAtTime(){},linearRampToValueAtTime(){}}});return c};globalThis.__ctx=mk();const ps2=play();
for(const t of['click','step','shot','magic','melee','heal','zone','hit','death','harvest','level','victory','defeat','state','stun','dialogue','succes','quete','quete_fin','invoque','boss','coffre','foudre','lumiere','tenebres','vent'])assert.equal(ps2(t),true,t);assert.equal(ps2('inconnu'),false)});
