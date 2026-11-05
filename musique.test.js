const test=require('node:test'),assert=require('node:assert'),fs=require('fs');
function ctx(){const n=()=>({connect(){},start(){},stop(){},frequency:{setValueAtTime(){}},gain:{value:0,setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){},setTargetAtTime(){},cancelScheduledValues(){}}});
return{currentTime:0,state:'running',destination:{},createOscillator:n,createGain:n}}
function load(son){const g=globalThis;g.OPT={son};g.AudioContext=ctx;g.soundUnlocked=false;
const code=fs.readFileSync('son.js','utf8')+fs.readFileSync('musique.js','utf8')+';return {MUS,MUS_T,playMusic,musTick,unlockSound}';
return new Function(code)()}
test('tous les thèmes démarrent sans erreur et planifient des notes',()=>{const m=load(60);m.unlockSound();
for(const k of Object.keys(m.MUS_T)){m.playMusic(k);assert.equal(m.MUS.theme,k)}
clearInterval(m.MUS.timer);assert.ok(m.MUS.step>0)});
test('son coupé : aucun thème lancé',()=>{const m=load(0);m.unlockSound();m.playMusic('foret');assert.equal(m.MUS.theme,null);clearInterval(m.MUS.timer)});
