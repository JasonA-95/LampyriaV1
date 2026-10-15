// MOTEUR : les règles du combat. Aucun affichage ici (réutilisable côté serveur plus tard).
const DIRS=[[1,0],[-1,0],[0,1],[0,-1]];
class Combat{
constructor(D,cfg){const c=D.classes[cfg.classe],G={pv:0,dmg:0,res:0,pm:0,...(cfg.gear||{})};this.res=G.res;this.N=D.taille;this.rocks=new Set(D.rochers.map(r=>r.join(',')));
this.S=[...c.sorts,...cfg.lueurs.map(id=>D.lueurs[id].sort)];
this.hero={x:D.heros.x,y:D.heros.y,hp:c.hp+8*(cfg.niv-1)+G.pv,max:c.hp+8*(cfg.niv-1)+G.pv,e:c.e,rage:false,mur:0};
this.foes=D.rencontres[cfg.renc].m.map(m=>({...m,sortCd:0}));this.bonus=cfg.niv-1+G.dmg;this.PA=D.heros.pa;this.PM=D.heros.pm+G.pm;this.pa=this.PA;this.pm=this.PM;
this.ash=new Set(this.foes.filter(f=>f.cendre).map(f=>f.x+','+f.y));this.turn=1;this.cd=this.S.map(()=>0);this.result=null;this.noMove=0;this.malus=0;this.vuln=0}
shield(f){return !!f.boss&&f.hp>0&&(f.cendre?this.ash.has(f.x+','+f.y):this.foes.some(g=>g.form&&g.hp>0))}
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
if(s.tp&&u)continue;if(((s.dmg&&s.aoe==null)||s.sleep||s.swap)&&!(u&&u!==h))continue;r.push([x,y])}return r}
move(x,y){const d=this.reach()[x+','+y];if(!(d>0))return{ok:false,tag:'loin'};
this.pm-=d;this.hero.x=x;this.hero.y=y;return{ok:true,tag:''}}
cast(i,x,y){const s=this.S[i],h=this.hero;if(this.pa<s.pa||this.cd[i]>0)return{ok:false,tag:'cout'};
if(!this.ranged(i).some(t=>t[0]==x&&t[1]==y))return{ok:false,tag:'cible'};
this.pa-=s.pa;this.cd[i]=s.cd||0;const r={ok:true,tag:s.say||'',dmg:0,hit:[],effects:[]},inv0=this.foes.some(g=>g.form&&g.hp>0),sh=new Set(this.foes.filter(f=>this.shield(f)));
if(s.dmg){const m=h.rage?2:1;h.rage=false;
const T=s.aoe!=null?this.foes.filter(f=>f.hp>0&&this.dist(f,{x,y})<=s.aoe):[this.at(x,y)];
const dm=s.dmg+this.bonus,alive=new Set(T.filter(f=>f.hp>0));for(const f of T){if(sh.has(f)){r.blocked=1;continue}f.hp-=dm*m;f.sleep=false;r.hit.push(f)}r.dmg=dm*m;for(const k of [...this.ash]){const [ax,ay]=k.split(',').map(Number);if(this.dist({x:ax,y:ay},{x,y})<=(s.aoe??0)){this.ash.delete(k);r.ashCleared=1}}
for(const f of T)if(alive.has(f)&&f.hp<=0&&f.mort&&this.dist(f,h)<=f.mort.r){const amount=this.hurtHero(f.mort.dmg);r.mortEvents=r.mortEvents||[];r.mortEvents.push({text:f.n+' explose : -'+amount+' PV.',dmg:amount});if(amount)r.effects.push({cible:h,texte:'-'+amount,couleur:'#e5564a'})}
if(s.push)for(const f of T){if(f.boss||f.hp<=0)continue;const ax=f.x-h.x,ay=f.y-h.y,dx=Math.abs(ax)>=Math.abs(ay)?Math.sign(ax):0,dy=dx?0:Math.sign(ay);
for(let i=0;i<s.push;i++){const nx=f.x+dx,ny=f.y+dy;if(nx<0||ny<0||nx>=this.N||ny>=this.N){if(f.form){f.hp=0;r.out=1}break}if(this.free(nx,ny)){f.x=nx;f.y=ny}else break}}}
if(s.drain)h.hp=Math.min(h.max,h.hp+Math.round(s.dmg*(1-h.hp/h.max))+2);
if(s.heal)h.hp=Math.min(h.max,h.hp+s.heal);
if(s.tp){h.x=x;h.y=y}
if(s.rage){h.rage=true;this.malus=Math.min(2,this.malus+1)}
if(s.mur){h.mur=2;this.noMove=1;this.pm=0}
if(s.sleep){const t=this.at(x,y);if(t.boss)r.resist=1;else t.sleep=true}
if(s.swap){const f=this.at(x,y);[f.x,h.x]=[h.x,f.x];[f.y,h.y]=[h.y,f.y]}
if(inv0&&!this.foes.some(g=>g.form&&g.hp>0)){this.vuln=2;r.formDown=1}
if(h.hp>0&&this.foes.filter(f=>!f.form).every(f=>f.hp<=0))this.result='win';return r}
path(x,y){const h=this.hero,p={},d={[h.x+','+h.y]:0},q=[[h.x,h.y]];
while(q.length){const [a,b]=q.shift();if(a==x&&b==y)break;const k=d[a+','+b];if(k>=this.pm)continue;
for(const [i,j] of DIRS){const nx=a+i,ny=b+j,n=nx+','+ny;if(this.free(nx,ny)&&d[n]==null){d[n]=k+1;p[n]=[a,b];q.push([nx,ny])}}}
const r=[];let c=[x,y];while(c&&(c[0]!=h.x||c[1]!=h.y)){r.push(c);c=p[c[0]+','+c[1]]}return r}
hurtHero(raw){if(raw<=0)return 0;const h=this.hero,amount=Math.max(1,Math.round((h.mur>0?Math.ceil(raw/2):raw)*(1-this.res/100)));h.hp=Math.max(0,h.hp-amount);if(h.hp<=0)this.result='lose';return amount}
moveToRange(f,target,range,o={}){const start=f.x+','+f.y,steps={[start]:0},previous={},q=[[f.x,f.y]];
while(q.length){const [x,y]=q.shift(),k=x+','+y;if(steps[k]>=this.N*this.N)continue;
for(const [dx,dy] of DIRS){const nx=x+dx,ny=y+dy,n=nx+','+ny,u=this.at(nx,ny);if(steps[n]!=null||!this.ok(nx,ny)||(u&&u!==f))continue;steps[n]=steps[k]+1;previous[n]=k;q.push([nx,ny])}}
let choices=Object.keys(steps).map(k=>{const [x,y]=k.split(',').map(Number),p={x,y};return{k,p,cost:steps[k],d:this.dist(p,target)}}).filter(v=>v.d>=range[0]&&v.d<=range[1]&&(!o.los||this.los(v.p,target)));
if(o.safeHero){const safe=choices.filter(v=>this.dist(v.p,this.hero)>=o.safeHero);if(safe.length)choices=safe}
if(!choices.length)return false;const mid=(range[0]+range[1])/2;choices.sort((a,b)=>a.cost-b.cost||Math.abs(a.d-mid)-Math.abs(b.d-mid));let k=choices[0].k,path=[];
while(k!==start){path.unshift(k.split(',').map(Number));k=previous[k]}for(const [x,y] of path.slice(0,f.pm)){if(!this.free(x,y))break;f.x=x;f.y=y}return true}
inSpellRange(f,target,s){const d=this.dist(f,target);return d>=s.r[0]&&d<=s.r[1]&&(!s.los||this.los(f,target))}
injuredAlly(f){return this.foes.filter(g=>g!==f&&!g.form&&g.hp>0&&g.hp/g.max<.7).sort((a,b)=>a.hp/a.max-b.hp/b.max)[0]}
moveHero(f,kind,count){const h=this.hero;let moved=0;for(let i=0;i<count;i++){if(kind=='pull'&&this.dist(h,f)<=1)break;const ax=kind=='pull'?f.x-h.x:h.x-f.x,ay=kind=='pull'?f.y-h.y:h.y-f.y,dx=Math.abs(ax)>=Math.abs(ay)?Math.sign(ax):0,dy=dx?0:Math.sign(ay),nx=h.x+dx,ny=h.y+dy;if(!this.free(nx,ny))break;h.x=nx;h.y=ny;moved++}return moved}
castFoe(f,s,target){f.sortCd=s.cd||0;const effects=[];let amount=0,text;
if(s.heal){amount=Math.min(s.heal,target.max-target.hp);target.hp+=amount;text=f.n+' soigne '+target.n+' : +'+amount+' PV.';if(amount)effects.push({cible:target,texte:'+'+amount,couleur:'#7fd18b'})}
else{text=s.pull?f.n+' t\'attire avec sa langue':s.push?f.n+' te repousse avec '+s.n:f.n+' lance '+s.n;const raw=s.dmg==null?f.d:s.dmg;amount=this.hurtHero(raw);if(amount)effects.push({cible:this.hero,texte:'-'+amount,couleur:'#e5564a'});
if(s.pm){this.malus=Math.min(2,this.malus+s.pm);effects.push({cible:this.hero,texte:'-'+s.pm+' PM',couleur:'#9ecbff'})}
if(s.pull||s.push){const moved=this.moveHero(f,s.pull?'pull':'push',s.pull||s.push);if(moved)effects.push({cible:this.hero,texte:s.pull?'Attiré !':'Repoussé !',couleur:'#ffe08a'})}
const extra=[];if(amount)extra.push('-'+amount+' PV');if(s.pm)extra.push('-'+s.pm+' PM au prochain tour');if(extra.length)text+=' : '+extra.join(', ')+'.';else text+='.'}
return{dmg:s.heal?0:amount,text,tag:s.heal?'heal':'spell',cible:target,effects}}
followForm(b){const fm=this.foes.find(g=>g.form&&g.hp>0);if(!fm)return;const h=this.hero,db=this.dist(b,h);
const c=DIRS.map(([a,d])=>({x:b.x+a,y:b.y+d})).filter(p=>(p.x==fm.x&&p.y==fm.y)||this.free(p.x,p.y));
if(!c.length||c.some(p=>p.x==fm.x&&p.y==fm.y&&this.dist(p,b)==1))return;
c.sort((p,q)=>Math.abs(this.dist(p,h)-db)-Math.abs(this.dist(q,h)-db));fm.x=c[0].x;fm.y=c[0].y}
foeTurn(f){const h=this.hero;if(f.form||f.hp<=0)return{skip:true,text:'',effects:[]};if(f.sortCd>0)f.sortCd--;if(f.sleep){f.sleep=false;return{sleep:true,text:f.n+' dort et passe son tour.',effects:[{cible:f,texte:'Zzz',couleur:'#9ecbff'}]}}
let ally=f.ia=='soin'?this.injuredAlly(f):null;
if(f.ia=='dist'&&f.sort){const low=Math.max(f.garde?.[0]??f.sort.r[0],f.sort.r[0]),high=Math.min(f.garde?.[1]??f.sort.r[1],f.sort.r[1]);if(!this.moveToRange(f,h,low<=high?[low,high]:f.sort.r,{los:!!f.sort.los}))this.moveToRange(f,h,[1,1])}
else if(f.ia=='soin'&&ally){const ready=f.sort&&f.sortCd===0&&this.inSpellRange(f,ally,f.sort),safe=this.dist(f,h)>=3;if(!ready||!safe){const toSafe=this.moveToRange(f,ally,f.sort.r,{los:!!f.sort.los,safeHero:3});if(!toSafe&&!this.moveToRange(f,ally,f.sort.r,{los:!!f.sort.los}))this.moveToRange(f,h,[1,1])}}
else this.moveToRange(f,h,[1,1]);
if(f.boss)this.followForm(f);if(f.cendre)this.ash.add(f.x+','+f.y);
let action=null;if(f.sort&&f.sortCd===0){if(f.ia=='soin'){ally=this.injuredAlly(f);if(ally&&this.inSpellRange(f,ally,f.sort))action=this.castFoe(f,f.sort,ally)}else if(this.inSpellRange(f,h,f.sort))action=this.castFoe(f,f.sort,h)}
if(!action&&this.dist(f,h)==1){const amount=this.hurtHero(f.d);action={dmg:amount,text:f.n+' te frappe : -'+amount+' PV.',tag:'contact',cible:h,effects:amount?[{cible:h,texte:'-'+amount,couleur:'#e5564a'}]:[]}}
return action||{skip:true,text:'',effects:[]}}
newTurn(){const h=this.hero;this.turn++;this.pa=this.PA;this.pm=this.noMove>0?0:Math.max(1,this.PM-this.malus);this.malus=0;
if(this.vuln>0&&--this.vuln==0){const b=this.foes.find(f=>f.boss&&f.hp>0),fm=this.foes.find(f=>f.form);
if(b&&fm)for(const [a,c] of DIRS)if(this.free(b.x+a,b.y+c)){fm.x=b.x+a;fm.y=b.y+c;fm.hp=fm.max;break}}
if(this.noMove>0)this.noMove--;h.mur=Math.max(0,h.mur-1);this.cd=this.cd.map(c=>Math.max(0,c-1))}
}
