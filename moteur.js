// MOTEUR : les règles du combat. Aucun affichage ici (réutilisable côté serveur plus tard).
const DIRS=[[1,0],[-1,0],[0,1],[0,-1]];
class Combat{
constructor(D,cfg){const c=D.classes[cfg.classe],G={pv:0,dmg:0,res:0,pm:0,...(cfg.gear||{})};this.res=G.res;this.N=D.taille;this.rocks=new Set(D.rochers.map(r=>r.join(',')));
this.S=[...(cfg.sorts||c.sorts),...cfg.lueurs.map(id=>D.lueurs[id].sort)];
this.hero={x:D.heros.x,y:D.heros.y,hp:c.hp+8*(cfg.niv-1)+G.pv,max:c.hp+8*(cfg.niv-1)+G.pv,e:c.e,rage:false,mur:0,garde:0,etats:[]};
this.foes=D.rencontres[cfg.renc].m.map(m=>({...m,sortCd:0,etats:[]}));this.bonus=cfg.niv-1+G.dmg;this.PA=D.heros.pa;this.PM=D.heros.pm+G.pm;this.pa=this.PA;this.pm=this.PM;
this.ash=new Set(this.foes.filter(f=>f.cendre).map(f=>f.x+','+f.y));this.turn=1;this.cd=this.S.map(()=>0);this.result=null;this.noMove=0;this.malus=0;this.vuln=0;this.warn=new Set()}
addEtat(u,e){if(!u||u.form||!e||!DATA.etats[e.id]||(e.id=='etourdi'&&u.boss))return false;
u.etats=u.etats||[];const old=u.etats.find(x=>x.id==e.id);if(old){old.t=Math.max(old.t,e.t||0);if(e.v!=null)old.v=Math.max(old.v||0,e.v)}else u.etats.push({id:e.id,t:e.t||0,...(e.v==null?{}:{v:e.v})});return true}
hasEtat(u,id){return !!u&&!!u.etats&&u.etats.some(e=>e.id==id&&e.t>0)}
event(events,u,texte,couleur,text){events.push({cible:u,texte,couleur,text})}
applyEtats(u,list,events){for(const e of list||[]){if(e.id=='etourdi'&&u&&u.boss){this.event(events,u,'Résiste','#c9b8ff',u.n+' résiste à l’étourdissement.');continue}
if(this.addEtat(u,e)){const d=DATA.etats[e.id],value=e.v==null?'':' '+e.v,label=e.id=='bouclier'?'+bouclier':d.e+' '+d.n;this.event(events,u,label,'#ffe08a',u.n+' reçoit '+d.n.toLowerCase()+(value?' ('+e.v+')':'')+' pour '+e.t+' tour(s).')}}}
applyDamage(u,raw,bypassDefense){if(raw<=0)return{damage:0,absorbed:0};let amount=Math.round(raw);
if(u===this.hero&&!bypassDefense){const h=this.hero;amount=Math.max(1,Math.round((h.mur>0||h.garde>0?Math.ceil(amount/2):amount)*(1-this.res/100)))}
const shield=u.etats&&u.etats.find(e=>e.id=='bouclier'&&e.t>0),absorbed=shield?Math.min(shield.v,amount):0;if(shield){shield.v-=absorbed;amount-=absorbed;if(shield.v<=0)u.etats=u.etats.filter(e=>e!==shield)}
u.hp=Math.max(0,u.hp-amount);if(u===this.hero&&u.hp<=0)this.result='lose';return{damage:amount,absorbed}}
damageFrom(u,raw){const weak=u.etats&&u.etats.find(e=>e.id=='affaibli'&&e.t>0);return weak?Math.max(1,Math.round(raw*(1-weak.v/100))):raw}
heal(u,raw){let amount=Math.max(0,Math.round(raw));if(this.hasEtat(u,'poison'))amount=Math.max(1,Math.ceil(amount/2));const actual=Math.min(amount,u.max-u.hp);u.hp+=actual;return actual}
tickEtats(u){const events=[],result={events,blocked:false,slow:0};if(!u||u.hp<=0||u.form)return result;
for(const id of ['brule','poison']){const e=u.etats&&u.etats.find(s=>s.id==id&&s.t>0);if(!e)continue;const hit=this.applyDamage(u,e.v,true),d=DATA.etats[id];this.event(events,u,d.e+' -'+e.v,d.couleur,u.n+' subit '+hit.damage+' dégâts de '+d.n.toLowerCase()+'.');
if(hit.absorbed)this.event(events,u,'Bouclier absorbé -'+hit.absorbed,'#9ecbff','Le bouclier absorbe '+hit.absorbed+' dégâts.');if(u.hp<=0)return result}
result.blocked=this.hasEtat(u,'etourdi');const slow=u.etats&&u.etats.find(e=>e.id=='ralenti'&&e.t>0);if(slow)result.slow=slow.v||0;
for(const e of [...(u.etats||[])]){e.t--;if(e.t<=0){u.etats=u.etats.filter(s=>s!==e);if(e.id=='bouclier')this.event(events,u,'Bouclier expiré','#9ecbff','Le bouclier disparaît.')}}
if(result.blocked)this.event(events,u,'Étourdi !','#ffe08a',u.n+' est étourdi et passe son tour.');if(result.slow)this.event(events,u,'Ralenti','#9ecbff',u.n+' est ralenti : -'+result.slow+' PM.');return result}
checkWin(){if(this.hero.hp>0&&this.foes.filter(f=>!f.form).every(f=>f.hp<=0))this.result='win';return this.result}
resolveTickDeath(f,events){if(f.hp<=0&&!f.deathHandled){f.deathHandled=true;if(f.mort&&this.dist(f,this.hero)<=f.mort.r){const hit=this.applyDamage(this.hero,f.mort.dmg,false);this.event(events,this.hero,'-'+hit.damage,'#e5564a',f.mort.n+' : -'+hit.damage+' PV.');if(hit.absorbed)this.event(events,this.hero,'Bouclier absorbé -'+hit.absorbed,'#9ecbff','Le bouclier absorbe '+hit.absorbed+' dégâts.')}}this.checkWin()}
nuit(f){const a=f.cycle.a,b=f.cycle.b;return (this.turn-1)%(a+b)<a}
escorted(f){return this.foes.some(g=>g!==f&&!g.boss&&!g.form&&g.hp>0&&this.dist(g,f)<=f.escorte)}
shield(f){if(!f.boss||f.hp<=0)return false;if(f.cendre)return this.ash.has(f.x+','+f.y);if(f.cycle)return this.nuit(f);if(f.escorte)return this.escorted(f);return this.foes.some(g=>g.form&&g.hp>0)}
weak(f){return !!f.boss&&(this.vuln>0||(f.cycle&&!this.nuit(f)))}
bossInv(){return this.foes.some(f=>this.shield(f))}
zone(i){const s=this.S[i],r=[];for(let x=0;x<this.N;x++)for(let y=0;y<this.N;y++){const m=this.dist(this.hero,{x,y});if(m>=s.r[0]&&m<=s.r[1]&&this.ok(x,y))r.push([x,y])}return r}
ok(x,y){return x>=0&&y>=0&&x<this.N&&y<this.N&&!this.rocks.has(x+','+y)}
at(x,y){const h=this.hero;return x==h.x&&y==h.y?h:this.foes.find(f=>f.hp>0&&f.x==x&&f.y==y)}
free(x,y){return this.ok(x,y)&&!this.at(x,y)}
dist(a,b){return Math.abs(a.x-b.x)+Math.abs(a.y-b.y)}
reach(){const h=this.hero,d={[h.x+','+h.y]:0},q=[[h.x,h.y]];
while(q.length){const [x,y]=q.shift(),k=d[x+','+y];if(k>=this.pm)continue;
for(const [a,b] of DIRS){const nx=x+a,ny=y+b;if(this.free(nx,ny)&&d[nx+','+ny]==null){d[nx+','+ny]=k+1;q.push([nx,ny])}}}return d}
los(a,b){let x=a.x,y=a.y;const dx=Math.abs(b.x-x),dy=Math.abs(b.y-y),sx=x<b.x?1:-1,sy=y<b.y?1:-1;let e=dx-dy;
while(x!=b.x||y!=b.y){const e2=2*e;if(e2>-dy){e-=dy;x+=sx}if(e2<dx){e+=dx;y+=sy}
if((x!=b.x||y!=b.y)&&this.rocks.has(x+','+y))return false}return true}
ranged(i){const s=this.S[i],h=this.hero,r=[];
for(let x=0;x<this.N;x++)for(let y=0;y<this.N;y++){const m=this.dist(h,{x,y}),u=this.at(x,y);
if(m<s.r[0]||m>s.r[1]||!this.ok(x,y)||(s.los&&!this.los(h,{x,y})))continue;
if(s.tp&&u)continue;if(((s.dmg&&s.aoe==null)||s.sleep||s.swap||s.charge||(s.etats&&s.etats.length&&s.aoe==null))&&!(u&&u!==h))continue;
if(s.charge&&!DIRS.some(([dx,dy])=>this.free(u.x+dx,u.y+dy)))continue;r.push([x,y])}return r}
move(x,y){const d=this.reach()[x+','+y];if(!(d>0))return{ok:false,tag:'loin'};
this.pm-=d;this.hero.x=x;this.hero.y=y;return{ok:true,tag:''}}
cast(i,x,y){const s=this.S[i],h=this.hero;if(this.pa<s.pa||this.cd[i]>0)return{ok:false,tag:'cout'};
if(!this.ranged(i).some(t=>t[0]==x&&t[1]==y))return{ok:false,tag:'cible'};
this.pa-=s.pa;this.cd[i]=s.cd||0;const target=this.at(x,y),r={ok:true,tag:s.say||'',dmg:0,hit:[],effects:[],events:[]},inv0=this.foes.some(g=>g.form&&g.hp>0),sh=new Set(this.foes.filter(f=>this.shield(f))),targets=s.aoe!=null?this.foes.filter(f=>f.hp>0&&this.dist(f,{x,y})<=s.aoe):[target];
if(s.charge){const cells=DIRS.map(([dx,dy])=>({x:target.x+dx,y:target.y+dy})).filter(p=>this.free(p.x,p.y));cells.sort((a,b)=>this.dist(h,a)-this.dist(h,b));if(!cells.length)return{ok:false,tag:'cible'};h.x=cells[0].x;h.y=cells[0].y;r.charge=1}
if(s.dmg){const m=h.rage?2:1;h.rage=false;
const T=s.aoe!=null?this.foes.filter(f=>f.hp>0&&this.dist(f,{x,y})<=s.aoe):[this.at(x,y)];
const dm=this.damageFrom(h,(s.dmg+this.bonus)*m),alive=new Set(T.filter(f=>f.hp>0));for(const f of T){if(sh.has(f)){r.blocked=1;this.applyEtats(f,(s.etats||[]).filter(e=>e.id=='etourdi'),r.events);continue}const hit=this.applyDamage(f,this.weak(f)?Math.round(dm*1.5):dm,false);f.sleep=false;r.hit.push(f);r.dmg+=hit.damage;if(hit.damage)r.effects.push({cible:f,texte:'-'+hit.damage,couleur:'#ff6b5e'});if(hit.absorbed)this.event(r.events,f,'Bouclier absorbé -'+hit.absorbed,'#9ecbff','Le bouclier absorbe '+hit.absorbed+' dégâts.')}
for(const f of r.hit)if(f.hp>0)this.applyEtats(f,s.etats,r.events);for(const k of [...this.ash]){const [ax,ay]=k.split(',').map(Number);if(this.dist({x:ax,y:ay},{x,y})<=(s.aoe??0)){this.ash.delete(k);r.ashCleared=1}}if(r.ashCleared){const bc=this.foes.find(f=>f.cendre&&f.hp>0);if(bc&&!this.ash.has(bc.x+','+bc.y))this.vuln=2}
for(const f of T)if(alive.has(f)&&f.hp<=0&&f.mort&&this.dist(f,h)<=f.mort.r){const hit=this.applyDamage(h,f.mort.dmg,false),amount=hit.damage;r.mortEvents=r.mortEvents||[];r.mortEvents.push({text:f.n+' explose : -'+amount+' PV.',dmg:amount});if(amount)r.effects.push({cible:h,texte:'-'+amount,couleur:'#e5564a'});if(hit.absorbed)this.event(r.events,h,'Bouclier absorbé -'+hit.absorbed,'#9ecbff','Le bouclier absorbe '+hit.absorbed+' dégâts.')}
if(s.push)for(const f of T){if(f.boss||f.hp<=0)continue;const ax=f.x-h.x,ay=f.y-h.y,dx=Math.abs(ax)>=Math.abs(ay)?Math.sign(ax):0,dy=dx?0:Math.sign(ay);
for(let i=0;i<s.push;i++){const nx=f.x+dx,ny=f.y+dy;if(nx<0||ny<0||nx>=this.N||ny>=this.N){if(f.form){f.hp=0;r.out=1}break}if(this.free(nx,ny)){f.x=nx;f.y=ny}else break}}}
if(!s.dmg&&s.etats)for(const f of targets){if(!f||f.hp<=0)continue;if(sh.has(f)){r.blocked=1;this.applyEtats(f,s.etats.filter(e=>e.id=='etourdi'),r.events);continue}this.applyEtats(f,s.etats,r.events)}
if(s.drain)this.heal(h,Math.round(s.dmg*(1-h.hp/h.max))+2);
if(s.heal)this.heal(h,s.heal);
if(s.recul&&target&&target!==h){const ax=h.x-target.x,ay=h.y-target.y,dx=Math.abs(ax)>=Math.abs(ay)?Math.sign(ax):0,dy=dx?0:Math.sign(ay),nx=h.x+dx,ny=h.y+dy;if(this.free(nx,ny)){h.x=nx;h.y=ny;r.recul=1}}
if(s.garde){h.garde=Math.max(h.garde||0,s.garde);r.garde=1}
if(s.tp){h.x=x;h.y=y}
if(s.rage){h.rage=true;this.malus=Math.min(2,this.malus+1)}
if(s.mur){h.mur=2;this.noMove=1;this.pm=0}
if(s.sleep){const t=this.at(x,y);if(t.boss)r.resist=1;else t.sleep=true}
if(s.swap){const f=this.at(x,y);[f.x,h.x]=[h.x,f.x];[f.y,h.y]=[h.y,f.y]}
{const mk=this.foes.find(g=>g.form&&g.hp>0&&g.mock);if(mk&&['farce','sommeil','mur','fuite','rage','ombre'].includes(s.say)){mk.hp=Math.max(0,mk.hp-Math.ceil(mk.max*mk.mock));r.mocked=1}}
if(inv0&&!this.foes.some(g=>g.form&&g.hp>0)){this.vuln=this.p2?2:3;r.formDown=1}
this.applyEtats(h,s.etatsSoi,r.events);if(h.hp>0)this.checkWin();return r}
path(x,y){const h=this.hero,p={},d={[h.x+','+h.y]:0},q=[[h.x,h.y]];
while(q.length){const [a,b]=q.shift();if(a==x&&b==y)break;const k=d[a+','+b];if(k>=this.pm)continue;
for(const [i,j] of DIRS){const nx=a+i,ny=b+j,n=nx+','+ny;if(this.free(nx,ny)&&d[n]==null){d[n]=k+1;p[n]=[a,b];q.push([nx,ny])}}}
const r=[];let c=[x,y];while(c&&(c[0]!=h.x||c[1]!=h.y)){r.push(c);c=p[c[0]+','+c[1]]}return r}
hurtHero(raw){return this.applyDamage(this.hero,raw,false).damage}
moveToRange(f,target,range,o={}){const start=f.x+','+f.y,steps={[start]:0},previous={},q=[[f.x,f.y]];
while(q.length){const [x,y]=q.shift(),k=x+','+y;if(steps[k]>=this.N*this.N)continue;
for(const [dx,dy] of DIRS){const nx=x+dx,ny=y+dy,n=nx+','+ny,u=this.at(nx,ny);if(steps[n]!=null||!this.ok(nx,ny)||(u&&u!==f))continue;steps[n]=steps[k]+1;previous[n]=k;q.push([nx,ny])}}
let choices=Object.keys(steps).map(k=>{const [x,y]=k.split(',').map(Number),p={x,y};return{k,p,cost:steps[k],d:this.dist(p,target)}}).filter(v=>v.d>=range[0]&&v.d<=range[1]&&(!o.los||this.los(v.p,target)));
if(o.safeHero){const safe=choices.filter(v=>this.dist(v.p,this.hero)>=o.safeHero);if(safe.length)choices=safe}
if(!choices.length)return false;const mid=(range[0]+range[1])/2;choices.sort((a,b)=>a.cost-b.cost||Math.abs(a.d-mid)-Math.abs(b.d-mid));let k=choices[0].k,path=[];
while(k!==start){path.unshift(k.split(',').map(Number));k=previous[k]}for(const [x,y] of path.slice(0,f.pmActif??f.pm)){if(!this.free(x,y))break;f.x=x;f.y=y}return true}
inSpellRange(f,target,s){const d=this.dist(f,target);return d>=s.r[0]&&d<=s.r[1]&&(!s.los||this.los(f,target))}
injuredAlly(f){return this.foes.filter(g=>g!==f&&!g.form&&g.hp>0&&g.hp/g.max<.7).sort((a,b)=>a.hp/a.max-b.hp/b.max)[0]}
moveHero(f,kind,count){const h=this.hero;let moved=0;for(let i=0;i<count;i++){if(kind=='pull'&&this.dist(h,f)<=1)break;const ax=kind=='pull'?f.x-h.x:h.x-f.x,ay=kind=='pull'?f.y-h.y:h.y-f.y,dx=Math.abs(ax)>=Math.abs(ay)?Math.sign(ax):0,dy=dx?0:Math.sign(ay),nx=h.x+dx,ny=h.y+dy;if(!this.free(nx,ny))break;h.x=nx;h.y=ny;moved++}return moved}
castFoe(f,s,target){f.sortCd=s.cd||0;const effects=[],events=[];let amount=0,text;
if(s.heal){amount=this.heal(target,s.heal);text=f.n+' soigne '+target.n+' : +'+amount+' PV.';if(amount)effects.push({cible:target,texte:'+'+amount,couleur:'#7fd18b'})}
else{text=s.pull?f.n+' t\'attire avec sa langue':s.push?f.n+' te repousse avec '+s.n:f.n+' lance '+s.n;const raw=this.damageFrom(f,s.dmg==null?f.d:s.dmg),hit=this.applyDamage(this.hero,raw,false);amount=hit.damage;if(amount)effects.push({cible:this.hero,texte:'-'+amount,couleur:'#e5564a'});if(hit.absorbed){this.event(events,this.hero,'Bouclier absorbé -'+hit.absorbed,'#9ecbff','Le bouclier absorbe '+hit.absorbed+' dégâts.');effects.push(events[events.length-1])}
if(s.pm){this.malus=Math.min(2,this.malus+s.pm);effects.push({cible:this.hero,texte:'-'+s.pm+' PM',couleur:'#9ecbff'})}
if(s.pull||s.push){const moved=this.moveHero(f,s.pull?'pull':'push',s.pull||s.push);if(moved)effects.push({cible:this.hero,texte:s.pull?'Attiré !':'Repoussé !',couleur:'#ffe08a'})}
if(this.hero.hp>0)this.applyEtats(this.hero,s.etats,events);const extra=[];if(amount)extra.push('-'+amount+' PV');if(s.pm)extra.push('-'+s.pm+' PM au prochain tour');if(extra.length)text+=' : '+extra.join(', ')+'.';else text+='.'}
this.applyEtats(f,s.etatsSoi,events);return{dmg:s.heal?0:amount,text,tag:s.heal?'heal':'spell',cible:target,effects,events}}
followForm(b){const fm=this.foes.find(g=>g.form&&g.hp>0);if(!fm)return;const h=this.hero,db=this.dist(b,h);
const c=DIRS.map(([a,d])=>({x:b.x+a,y:b.y+d})).filter(p=>(p.x==fm.x&&p.y==fm.y)||this.free(p.x,p.y));
if(!c.length||c.some(p=>p.x==fm.x&&p.y==fm.y&&this.dist(p,b)==1))return;
c.sort((p,q)=>Math.abs(this.dist(p,h)-db)-Math.abs(this.dist(q,h)-db));fm.x=c[0].x;fm.y=c[0].y}
foeTurn(f){const h=this.hero;if(f.form||f.hp<=0)return{skip:true,text:'',effects:[],events:[]};const tick=this.tickEtats(f),events=tick.events;if(f.hp<=0){this.resolveTickDeath(f,events);return{skip:true,text:events.map(e=>e.text).filter(Boolean).join(' '),effects:events,events}}
if(tick.blocked){this.checkWin();return{skip:true,text:events.map(e=>e.text).filter(Boolean).join(' '),effects:events,events}}
if(f.alerte){const A=f.alerte;if(f.pre){const hit=f.pre.some(c=>c.x==h.x&&c.y==h.y);f.pre=null;this.warn=new Set();if(hit){const d=this.applyDamage(h,Math.round(f.d*A.mult),false).damage;return{dmg:d,text:f.n+' : '+A.n+' ! -'+d+' PV.',tag:'contact',cible:h,effects:d?[{cible:h,texte:'-'+d,couleur:'#e5564a'}]:[],events}}if(A.vul)this.vuln=Math.max(this.vuln,2);this.checkWin();return{skip:true,text:f.n+' rate son coup'+(A.vul?' et se fatigue : vulnérable !':'.'),effects:events,events}}
if(this.turn%A.every==0){const cs=[];for(let dx=-A.r;dx<=A.r;dx++)for(let dy=-A.r;dy<=A.r;dy++){const x=h.x+dx,y=h.y+dy;if(x>=0&&y>=0&&x<this.N&&y<this.N)cs.push({x,y})}f.pre=cs;this.warn=new Set(cs.map(c=>c.x+','+c.y));this.checkWin();return{skip:true,text:f.n+' prépare « '+A.n+' » ! Quitte les cases rouges.',effects:events,events}}}
f.pmActif=Math.max(1,f.pm-tick.slow);if(f.sortCd>0)f.sortCd--;if(f.sleep){f.sleep=false;return{sleep:true,text:f.n+' dort et passe son tour.'+(events.length?' '+events.map(e=>e.text).filter(Boolean).join(' '):''),effects:[...events,{cible:f,texte:'Zzz',couleur:'#9ecbff'}],events}}
let ally=f.ia=='soin'?this.injuredAlly(f):null;
if(f.ia=='dist'&&f.sort){const low=Math.max(f.garde?.[0]??f.sort.r[0],f.sort.r[0]),high=Math.min(f.garde?.[1]??f.sort.r[1],f.sort.r[1]);if(!this.moveToRange(f,h,low<=high?[low,high]:f.sort.r,{los:!!f.sort.los}))this.moveToRange(f,h,[1,1])}
else if(f.ia=='soin'&&ally){const ready=f.sort&&f.sortCd===0&&this.inSpellRange(f,ally,f.sort),safe=this.dist(f,h)>=3;if(!ready||!safe){const toSafe=this.moveToRange(f,ally,f.sort.r,{los:!!f.sort.los,safeHero:3});if(!toSafe&&!this.moveToRange(f,ally,f.sort.r,{los:!!f.sort.los}))this.moveToRange(f,h,[1,1])}}
else this.moveToRange(f,h,[1,1]);
if(f.boss)this.followForm(f);if(f.cendre){this.ash.add(f.x+','+f.y);if(f.spread){const A=[...this.ash];for(let i=0;i<f.spread;i++){const bs=A[(this.turn*7+i*3)%A.length].split(',').map(Number),d=DIRS[(this.turn+i)%4],nx=bs[0]+d[0],ny=bs[1]+d[1];if(this.ok(nx,ny))this.ash.add(nx+','+ny)}}}
let action=null;if(f.sort&&f.sortCd===0){if(f.ia=='soin'){ally=this.injuredAlly(f);if(ally&&this.inSpellRange(f,ally,f.sort))action=this.castFoe(f,f.sort,ally)}else if(this.inSpellRange(f,h,f.sort))action=this.castFoe(f,f.sort,h)}
if(!action&&this.dist(f,h)==1){const hit=this.applyDamage(h,this.damageFrom(f,f.d),false),amount=hit.damage;if(hit.absorbed)this.event(events,h,'Bouclier absorbé -'+hit.absorbed,'#9ecbff','Le bouclier absorbe '+hit.absorbed+' dégâts.');action={dmg:amount,text:f.n+' te frappe : -'+amount+' PV.',tag:'contact',cible:h,effects:amount?[{cible:h,texte:'-'+amount,couleur:'#e5564a'}]:[]}}
if(action){events.push(...(action.events||[]));action.events=events;action.effects=[...events,...(action.effects||[]).filter(e=>!events.includes(e))];const tickText=events.map(e=>e.text).filter(Boolean).join(' ');if(tickText)action.text=(action.text?action.text+' ':'')+tickText;delete f.pmActif;this.checkWin();return action}
delete f.pmActif;this.checkWin();return{skip:true,text:events.map(e=>e.text).filter(Boolean).join(' '),effects:events,events}}
newTurn(){const h=this.hero;this.turn++;const tick=this.tickEtats(h);if(h.hp<=0)return tick;this.pa=this.PA;this.pm=this.noMove>0?0:Math.max(1,this.PM-this.malus-tick.slow);this.malus=0;h.garde=Math.max(0,(h.garde||0)-1);
{const cb=this.foes.find(f=>f.boss&&f.cycle&&f.hp>0);if(cb){const n0=((this.turn-2)%(cb.cycle.a+cb.cycle.b))<cb.cycle.a,n1=this.nuit(cb);if(n0!==n1)this.notice=n1?cb.n+' replonge dans l’ombre : elle est protégée.':'La lumière revient ! '+cb.n+' est vulnérable (dégâts ×1,5).'}
const rb=this.foes.find(f=>f.boss&&f.renfort&&f.hp>0);if(rb&&this.turn%rb.renfort.every==0&&this.foes.filter(g=>g.renfortNe&&g.hp>0).length<rb.renfort.max){for(const [a,c] of DIRS){const x=rb.x+a,y=rb.y+c;if(this.free(x,y)){const n={...rb.renfort.m,x,y,renfortNe:1,hp:rb.renfort.m.max,sortCd:0,etats:[]};this.foes.push(n);this.notice=rb.n+' appelle du renfort : '+n.n+' !';break}}}}
{const bb=this.foes.find(f=>f.boss&&f.hp>0),f2=this.foes.find(f=>f.form&&f.hp>0);if(bb&&f2&&!this.p2&&bb.hp<=bb.max/2){this.p2=true;this.notice=bb.n+' s’énerve : sa protection se reforme plus vite !'}if(f2&&f2.regen&&f2.hp<f2.max&&!(this.vuln>0))f2.hp=Math.min(f2.max,f2.hp+Math.ceil(f2.max*f2.regen*(this.p2?2:1)))}
if(this.vuln>0&&--this.vuln==0){const b=this.foes.find(f=>f.boss&&f.hp>0),fm=this.foes.find(f=>f.form);
if(b&&fm)for(const [a,c] of DIRS)if(this.free(b.x+a,b.y+c)){fm.x=b.x+a;fm.y=b.y+c;fm.hp=Math.ceil(fm.max*(this.p2?.8:.6));break}}
if(this.noMove>0)this.noMove--;h.mur=Math.max(0,h.mur-1);this.cd=this.cd.map(c=>Math.max(0,c-1));if(tick.blocked){this.pa=0;this.pm=0}return tick}
}
