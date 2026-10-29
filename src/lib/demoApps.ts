import type { FolioMeta } from "./types";

/* ------------------------------------------------------------------ */
/* The Offline Scribe's repertoire — fully working single-file pages.  */
/* Inner scripts deliberately avoid backticks & template interpolation */
/* ------------------------------------------------------------------ */

export interface DemoOpts {
  dark: boolean;
  accent: string;
  motion?: boolean;
  topic?: string;
}

const ACCENTS: Record<string, string> = {
  crimson: "#c0392b", red: "#c0392b", scarlet: "#c0392b",
  ember: "#d35400", orange: "#d35400",
  gold: "#c9962b", golden: "#c9962b", amber: "#c9962b", yellow: "#c9962b",
  emerald: "#2e8b62", green: "#2e8b62",
  azure: "#2e6fb3", blue: "#2e6fb3", navy: "#2e6fb3",
  violet: "#7d4fc0", purple: "#7d4fc0",
  rose: "#c2497d", pink: "#c2497d",
  teal: "#2b8a8a", cyan: "#2b8a8a",
};

function base(title: string, width: number, css: string, body: string, js: string, o: DemoOpts): string {
  const pal = o.dark
    ? { bg: "#171310", card: "#221c15", ink: "#f0e6d0", mut: "#a3906c", line: "rgba(240,230,208,0.12)", paper: "#221c15" }
    : { bg: "#f5eedd", card: "#fffdf4", ink: "#2c2013", mut: "#7d6b4b", line: "rgba(44,32,19,0.14)", paper: "#fffdf4" };
  const stagger = o.motion
    ? ".wrap>*{animation:rise .7s ease both}.wrap>*:nth-child(2){animation-delay:.12s}.wrap>*:nth-child(3){animation-delay:.24s}.wrap>*:nth-child(4){animation-delay:.36s}.wrap>*:nth-child(5){animation-delay:.48s}"
    : "";
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<style>
:root{--bg:${pal.bg};--card:${pal.card};--ink:${pal.ink};--mut:${pal.mut};--line:${pal.line};--acc:${o.accent};--paper:${pal.paper}}
*{box-sizing:border-box;margin:0}
html{scroll-behavior:smooth}
body{font-family:Georgia,'Times New Roman',serif;background:var(--bg);color:var(--ink);min-height:100vh;padding:36px 16px;
background-image:radial-gradient(900px 420px at 50% -8%,color-mix(in srgb,var(--acc) 14%,transparent),transparent 70%)}
.wrap{max-width:${width}px;margin:0 auto;animation:rise .6s ease both}
h1{font-size:clamp(26px,4.5vw,38px);letter-spacing:.02em;font-weight:600}
h1 em{color:var(--acc);font-style:normal}
.sub{color:var(--mut);margin-top:6px;font-size:16px;font-style:italic}
.card{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:22px;box-shadow:0 14px 34px rgba(0,0,0,${o.dark ? "0.45" : "0.10"})}
button{font:inherit;cursor:pointer;border-radius:10px;border:1px solid var(--line);background:var(--card);color:var(--ink);padding:9px 16px;transition:transform .15s ease,box-shadow .2s ease,background .2s ease}
button:hover{transform:translateY(-1px);box-shadow:0 6px 16px rgba(0,0,0,.16)}
button:active{transform:scale(.97)}
button.pri{background:var(--acc);border-color:transparent;color:#fff;font-weight:600}
input,select{font:inherit;color:var(--ink);background:var(--paper);border:1px solid var(--line);border-radius:10px;padding:10px 12px;outline:none}
input:focus,select:focus{border-color:var(--acc);box-shadow:0 0 0 3px color-mix(in srgb,var(--acc) 25%,transparent)}
.toast{position:fixed;left:50%;bottom:26px;transform:translateX(-50%) translateY(20px);background:var(--ink);color:var(--bg);padding:9px 18px;border-radius:99px;opacity:0;transition:all .3s ease;pointer-events:none;font-size:14px}
.toast.on{opacity:1;transform:translateX(-50%) translateY(0)}
@keyframes rise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
${stagger}
${css}
</style>
</head>
<body>
<div class="wrap">
${body}
</div>
<div class="toast" id="toast"></div>
<script>
function say(m){var t=document.getElementById('toast');t.textContent=m;t.classList.add('on');clearTimeout(t._h);t._h=setTimeout(function(){t.classList.remove('on')},1600)}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
${js}
</script>
</body>
</html>`;
}

/* ------------------------------- TODO ------------------------------- */
function todo(o: DemoOpts) {
  const css = `.bar{height:8px;border-radius:99px;background:var(--line);overflow:hidden;margin:14px 0 4px}
.bar i{display:block;height:100%;background:var(--acc);border-radius:99px;transition:width .4s ease}
form{display:flex;gap:10px;margin-top:16px}form input{flex:1}
ul{list-style:none;padding:0;margin:14px 0 0}
li{display:flex;align-items:center;gap:12px;padding:12px 6px;border-bottom:1px solid var(--line);animation:rise .3s ease both}
li .tick{width:24px;height:24px;border-radius:50%;border:2px solid var(--acc);background:transparent;padding:0;flex:none;color:#fff;font-size:13px;line-height:1}
li.done .tick{background:var(--acc)}
li.done span{text-decoration:line-through;color:var(--mut)}
li span{flex:1;font-size:17px}
li .del{border:none;background:none;color:var(--mut);padding:4px 8px;font-size:18px}
li .del:hover{color:var(--acc);box-shadow:none}
.filters{display:flex;gap:8px;margin-top:16px;align-items:center;flex-wrap:wrap}
.filters button{padding:5px 14px;font-size:14px;border-radius:99px}
.filters button.on{background:var(--acc);color:#fff;border-color:transparent}
.count{margin-left:auto;color:var(--mut);font-size:14px;font-style:italic}
.empty{text-align:center;color:var(--mut);padding:26px 0;font-style:italic}`;
  const body = `<h1>The To-Do <em>Grimoire</em></h1>
<p class="sub">Every task inscribed is a task half-done.</p>
<div class="card" style="margin-top:18px">
<div class="bar"><i id="prog" style="width:0%"></i></div>
<form id="f"><input id="inp" placeholder="Inscribe a new task…" autocomplete="off"><button class="pri" type="submit">✦ Add</button></form>
<ul id="list"></ul>
<div class="filters">
<button data-f="all" class="on">All</button><button data-f="active">Active</button><button data-f="done">Done</button>
<span class="count" id="count"></span>
</div>
</div>`;
  const js = `var KEY='grimoire-tasks';var items=null;
try{items=JSON.parse(localStorage.getItem(KEY))}catch(e){}
if(!items){items=[{id:1,text:'Speak thy next wish to the Scriptorium',done:false}]}
var filter='all';var nid=Date.now();
function save(){try{localStorage.setItem(KEY,JSON.stringify(items))}catch(e){}}
function render(){
var list=document.getElementById('list');var shown=items.filter(function(t){return filter==='all'||(filter==='done')===t.done});
list.innerHTML=shown.length?shown.map(function(t){return '<li class="'+(t.done?'done':'')+'" data-id="'+t.id+'"><button class="tick" data-act="tick">'+(t.done?'✓':'')+'</button><span>'+esc(t.text)+'</span><button class="del" data-act="del" title="Remove">×</button></li>'}).join(''):'<div class="empty">All is quiet. Add a task above ✦</div>';
var done=items.filter(function(t){return t.done}).length;
document.getElementById('prog').style.width=(items.length?Math.round(done/items.length*100):0)+'%';
document.getElementById('count').textContent=done+' of '+items.length+' complete';
}
document.getElementById('f').addEventListener('submit',function(e){e.preventDefault();var v=document.getElementById('inp').value.trim();if(!v)return;items.unshift({id:++nid,text:v,done:false});document.getElementById('inp').value='';save();render()});
document.getElementById('list').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;var id=+e.target.closest('li').dataset.id;var t=items.find(function(x){return x.id===id});
if(b.dataset.act==='tick'){t.done=!t.done}else{items=items.filter(function(x){return x.id!==id})}save();render()});
document.querySelector('.filters').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;filter=b.dataset.f;
document.querySelectorAll('.filters button').forEach(function(x){x.classList.toggle('on',x===b)});render()});
render();`;
  return { title: "The To-Do Grimoire", code: base("The To-Do Grimoire", 620, css, body, js, o), id: "todo" };
}

/* ----------------------------- POMODORO ----------------------------- */
function pomodoro(o: DemoOpts) {
  const css = `.dial{display:flex;flex-direction:column;align-items:center;gap:18px;margin-top:18px}
.modes{display:flex;gap:8px}.modes button{border-radius:99px;padding:6px 16px;font-size:14px}
.modes button.on{background:var(--acc);color:#fff;border-color:transparent}
svg{transform:rotate(-90deg)}
.ring-bg{stroke:var(--line)}.ring-fg{stroke:var(--acc);transition:stroke-dashoffset .3s linear;stroke-linecap:round}
.clock{position:relative;width:260px;height:260px}
.clock .t{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center}
.clock .t b{font-size:56px;font-weight:600;letter-spacing:.03em;font-variant-numeric:tabular-nums}
.clock .t i{color:var(--mut);font-size:14px}
.ctrl{display:flex;gap:10px}.ctrl button{min-width:110px}
.dots{display:flex;gap:8px}.dots i{width:12px;height:12px;border-radius:50%;background:var(--line)}.dots i.on{background:var(--acc)}`;
  const body = `<h1 style="text-align:center">The Focus <em>Hourglass</em></h1>
<p class="sub" style="text-align:center">Twenty-five minutes of undivided attention.</p>
<div class="card dial">
<div class="modes"><button data-m="focus" class="on">Focus</button><button data-m="short">Short rest</button><button data-m="long">Long rest</button></div>
<div class="clock">
<svg width="260" height="260" viewBox="0 0 260 260"><circle class="ring-bg" cx="130" cy="130" r="112" fill="none" stroke-width="10"/><circle class="ring-fg" id="ring" cx="130" cy="130" r="112" fill="none" stroke-width="10" stroke-dasharray="703.7" stroke-dashoffset="0"/></svg>
<div class="t"><b id="time">25:00</b><i id="phase">ready when thou art</i></div>
</div>
<div class="ctrl"><button class="pri" id="go">Begin</button><button id="reset">Reset</button></div>
<div class="dots" id="dots"><i></i><i></i><i></i><i></i></div>
</div>`;
  const js = `var DUR={focus:1500,short:300,long:900};var mode='focus',left=DUR.focus,endAt=0,timer=null,sessions=0;
var C=703.7;
function fmt(s){var m=Math.floor(s/60),x=s%60;return (m<10?'0':'')+m+':'+(x<10?'0':'')+x}
function paint(){document.getElementById('time').textContent=fmt(left);
document.getElementById('ring').style.strokeDashoffset=C*(1-left/DUR[mode]);
document.title=fmt(left)+' — Focus';}
function tick(){left=Math.max(0,Math.round((endAt-Date.now())/1000));paint();
if(left<=0){stop();sessions++;var d=document.getElementById('dots').children;for(var i=0;i<d.length;i++)d[i].classList.toggle('on',i<sessions%5);
document.getElementById('phase').textContent='the hour is complete ✦';say('Session complete — well done!')}}
function stop(){clearInterval(timer);timer=null;document.getElementById('go').textContent='Begin'}
document.getElementById('go').addEventListener('click',function(){
if(timer){stop();document.getElementById('phase').textContent='paused';return}
endAt=Date.now()+left*1000;timer=setInterval(tick,250);this.textContent='Pause';document.getElementById('phase').textContent='deep in '+mode});
document.getElementById('reset').addEventListener('click',function(){stop();left=DUR[mode];paint();document.getElementById('phase').textContent='ready when thou art'});
document.querySelector('.modes').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;mode=b.dataset.m;
document.querySelectorAll('.modes button').forEach(function(x){x.classList.toggle('on',x===b)});stop();left=DUR[mode];paint()});
paint();`;
  return { title: "The Focus Hourglass", code: base("The Focus Hourglass", 520, css, body, js, o), id: "pomodoro" };
}

/* ---------------------------- CALCULATOR ---------------------------- */
function calculator(o: DemoOpts) {
  const css = `.calc{max-width:340px;margin:18px auto 0}
.screen{background:var(--paper);border:1px solid var(--line);border-radius:12px;padding:16px;text-align:right;margin-bottom:14px;min-height:86px}
.screen .expr{color:var(--mut);font-size:15px;min-height:20px;word-break:break-all}
.screen .res{font-size:36px;font-weight:600;font-variant-numeric:tabular-nums;word-break:break-all}
.keys{display:grid;grid-template-columns:repeat(4,1fr);gap:9px}
.keys button{padding:15px 0;font-size:19px;border-radius:12px}
.keys button.op{color:var(--acc);font-weight:700}
.keys button.eq{background:var(--acc);color:#fff;border-color:transparent}
.keys button.wide{grid-column:span 2}
.hint{text-align:center;color:var(--mut);font-size:13px;margin-top:12px;font-style:italic}`;
  const body = `<h1 style="text-align:center">The Reckoning <em>Stone</em></h1>
<div class="card calc">
<div class="screen"><div class="expr" id="expr">&nbsp;</div><div class="res" id="res">0</div></div>
<div class="keys" id="keys">
<button data-k="C" class="op">C</button><button data-k="B" class="op">⌫</button><button data-k="%" class="op">%</button><button data-k="/" class="op">÷</button>
<button data-k="7">7</button><button data-k="8">8</button><button data-k="9">9</button><button data-k="*" class="op">×</button>
<button data-k="4">4</button><button data-k="5">5</button><button data-k="6">6</button><button data-k="-" class="op">−</button>
<button data-k="1">1</button><button data-k="2">2</button><button data-k="3">3</button><button data-k="+" class="op">+</button>
<button data-k="0" class="wide">0</button><button data-k=".">.</button><button data-k="=" class="eq">=</button>
</div>
<p class="hint">Thy keyboard may also serve — digits, operators, Enter.</p>
</div>`;
  const js = `var expr='';
function show(){document.getElementById('expr').innerHTML=expr?esc(expr.replace(/\\*/g,'×').replace(/\\//g,'÷')):'&nbsp;';}
function calc(){try{var e=expr.replace(/%/g,'/100');if(!/^[0-9+\\-*/.() ]+$/.test(e))throw 0;
var v=Function('return ('+e+')')();if(typeof v!=='number'||!isFinite(v))throw 0;
v=Math.round(v*1e10)/1e10;document.getElementById('res').textContent=v;expr=String(v)}catch(err){document.getElementById('res').textContent='—'}show()}
function press(k){var r=document.getElementById('res');
if(k==='C'){expr='';r.textContent='0'}
else if(k==='B'){expr=expr.slice(0,-1)}
else if(k==='='){calc();return}
else{expr+=k;r.textContent=expr.replace(/\\*/g,'×').replace(/\\//g,'÷')}
show()}
document.getElementById('keys').addEventListener('click',function(e){var b=e.target.closest('button');if(b)press(b.dataset.k)});
window.addEventListener('keydown',function(e){
if(/^[0-9+\\-*/.%()]$/.test(e.key))press(e.key);
else if(e.key==='Enter'){e.preventDefault();press('=')}
else if(e.key==='Backspace')press('B');else if(e.key==='Escape')press('C')});`;
  return { title: "The Reckoning Stone", code: base("The Reckoning Stone", 420, css, body, js, o), id: "calculator" };
}

/* ---------------------------- TIC TAC TOE ---------------------------- */
function game(o: DemoOpts) {
  const css = `.board{display:grid;grid-template-columns:repeat(3,88px);gap:10px;justify-content:center;margin:20px 0}
.board button{width:88px;height:88px;font-size:40px;border-radius:14px;font-family:Georgia,serif;padding:0}
.board button.x{color:var(--acc)}.board button.oo{color:var(--mut)}
.board button.win{background:color-mix(in srgb,var(--acc) 22%,var(--card));border-color:var(--acc)}
.status{text-align:center;font-size:18px;font-style:italic;min-height:28px}
.score{display:flex;justify-content:center;gap:22px;margin-top:14px;color:var(--mut)}
.score b{color:var(--ink);font-size:20px;display:block;text-align:center}
.mid{text-align:center;margin-top:16px}`;
  const body = `<h1 style="text-align:center">Three <em>Crosses</em></h1>
<p class="sub" style="text-align:center">Thee (✕) against the Scribe (◯). Outwit it, if thou canst.</p>
<div class="card" style="margin-top:18px">
<div class="status" id="status">Thy move — place a cross.</div>
<div class="board" id="board"></div>
<div class="score"><span><b id="sx">0</b>thee</span><span><b id="sd">0</b>draws</span><span><b id="so">0</b>scribe</span></div>
<div class="mid"><button class="pri" id="again">New round</button></div>
</div>`;
  const js = `var b,over,score={x:0,d:0,o:0};
var LINES=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
function winner(x){for(var i=0;i<LINES.length;i++){var l=LINES[i];if(x[l[0]]&&x[l[0]]===x[l[1]]&&x[l[1]]===x[l[2]])return{m:x[l[0]],l:l}}
return x.every(Boolean)?{m:'d',l:[]}:null}
function paint(win){var el=document.getElementById('board');el.innerHTML='';
b.forEach(function(v,i){var btn=document.createElement('button');btn.textContent=v==='x'?'✕':v==='o'?'◯':'';
btn.className=v==='x'?'x':v==='o'?'oo':'';if(win&&win.l.indexOf(i)>=0)btn.classList.add('win');
btn.disabled=!!v||over;btn.addEventListener('click',function(){move(i)});el.appendChild(btn)})}
function end(w){over=true;var s=document.getElementById('status');
if(w.m==='d'){score.d++;s.textContent='A draw — honour is shared.'}
else if(w.m==='x'){score.x++;s.textContent='Victory! The crosses prevail ✦'}
else{score.o++;s.textContent='The Scribe prevails. Another round?'}
document.getElementById('sx').textContent=score.x;document.getElementById('so').textContent=score.o;document.getElementById('sd').textContent=score.d;paint(w)}
function tryFind(m){for(var i=0;i<9;i++){if(!b[i]){b[i]=m;var w=winner(b);b[i]=null;if(w&&w.m===m)return i}}return -1}
function ai(){var i=tryFind('o');if(i<0)i=tryFind('x');
if(i<0&&!b[4])i=4;
if(i<0){var c=[0,2,6,8].filter(function(x){return !b[x]});if(c.length)i=c[Math.floor(Math.random()*c.length)]}
if(i<0){var f=[];b.forEach(function(v,j){if(!v)f.push(j)});i=f[Math.floor(Math.random()*f.length)]}
b[i]='o';var w=winner(b);if(w)end(w);else{paint();document.getElementById('status').textContent='Thy move.'}}
function move(i){if(over||b[i])return;b[i]='x';var w=winner(b);if(w){end(w);return}
paint();document.getElementById('status').textContent='The Scribe ponders…';setTimeout(ai,420)}
function reset(){b=Array(9).fill(null);over=false;paint();document.getElementById('status').textContent='Thy move — place a cross.'}
document.getElementById('again').addEventListener('click',reset);reset();`;
  return { title: "The Game of Three Crosses", code: base("Three Crosses", 460, css, body, js, o), id: "game" };
}

/* ------------------------------ QUOTES ------------------------------ */
function quotes(o: DemoOpts) {
  const css = `.qcard{margin-top:20px;position:relative;padding:44px 30px 30px;text-align:center;overflow:hidden}
.qcard:before{content:'“';position:absolute;top:-28px;left:14px;font-size:150px;color:var(--acc);opacity:.22;font-family:Georgia,serif}
.q{font-size:clamp(20px,3.4vw,27px);line-height:1.5;font-style:italic;transition:opacity .3s ease,transform .3s ease}
.a{margin-top:16px;color:var(--acc);letter-spacing:.08em;transition:opacity .3s ease}
.fade .q,.fade .a{opacity:0;transform:translateY(8px)}
.row{display:flex;gap:10px;justify-content:center;margin-top:22px}`;
  const body = `<h1 style="text-align:center">The Oracle of <em>Quotes</em></h1>
<p class="sub" style="text-align:center">Wisdom of the ages, drawn at random.</p>
<div class="card qcard" id="card">
<p class="q" id="q"></p>
<p class="a" id="a"></p>
<div class="row"><button class="pri" id="next">✦ Another wisdom</button><button id="copy">Copy</button></div>
</div>`;
  const js = `var Q=[
['Simplicity is the ultimate sophistication.','Leonardo da Vinci'],
['The journey of a thousand miles begins with a single step.','Lao Tzu'],
['Well begun is half done.','Aristotle'],
['Fortune favours the bold.','Virgil'],
['What we know is a drop; what we do not know is an ocean.','Isaac Newton'],
['The scariest moment is always just before you start.','Stephen King'],
['It always seems impossible until it is done.','Nelson Mandela'],
['Make it work, make it right, make it fast.','Kent Beck'],
['Talk is cheap. Show me the code.','Linus Torvalds'],
['Creativity is intelligence having fun.','Albert Einstein']];
var last=-1;
function draw(){var i;do{i=Math.floor(Math.random()*Q.length)}while(i===last);last=i;
var c=document.getElementById('card');c.classList.add('fade');
setTimeout(function(){document.getElementById('q').textContent=Q[i][0];document.getElementById('a').textContent='— '+Q[i][1];c.classList.remove('fade')},300)}
document.getElementById('next').addEventListener('click',draw);
document.getElementById('copy').addEventListener('click',function(){
var t=document.getElementById('q').textContent+' '+document.getElementById('a').textContent;
if(navigator.clipboard){navigator.clipboard.writeText(t).then(function(){say('Copied to thy clipboard')})}else{say(t)}});
document.getElementById('q').textContent=Q[0][0];document.getElementById('a').textContent='— '+Q[0][1];last=0;`;
  return { title: "The Oracle of Quotes", code: base("The Oracle of Quotes", 640, css, body, js, o), id: "quotes" };
}

/* ------------------------------ DRAWING ------------------------------ */
function draw(o: DemoOpts) {
  const css = `.tools{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin:16px 0}
.sw{width:28px;height:28px;border-radius:50%;border:2px solid var(--line);padding:0}
.sw.on{outline:3px solid color-mix(in srgb,var(--acc) 55%,transparent);outline-offset:2px}
canvas{width:100%;border-radius:12px;border:1px solid var(--line);touch-action:none;cursor:crosshair;display:block;background:var(--paper)}
.tools label{font-size:14px;color:var(--mut);display:flex;gap:8px;align-items:center}
.tools .onEr{background:var(--acc);color:#fff;border-color:transparent}`;
  const body = `<h1>The Illuminator's <em>Canvas</em></h1>
<p class="sub">Draw thy marginalia. Save it as a keepsake.</p>
<div class="tools" id="tools">
<button class="sw on" data-c="${o.accent}" style="background:${o.accent}"></button>
<button class="sw" data-c="#2c2013" style="background:#2c2013"></button>
<button class="sw" data-c="#c0392b" style="background:#c0392b"></button>
<button class="sw" data-c="#2e6fb3" style="background:#2e6fb3"></button>
<button class="sw" data-c="#2e8b62" style="background:#2e8b62"></button>
<button class="sw" data-c="#c9962b" style="background:#c9962b"></button>
<input type="color" id="pick" value="${o.accent}" title="Custom ink" style="padding:2px;width:40px;height:32px">
<label>Nib <input type="range" id="size" min="2" max="42" value="6"></label>
<button id="er">Eraser</button><button id="clear">Clear</button><button class="pri" id="save">Save PNG</button>
</div>
<canvas id="cv" height="420"></canvas>`;
  const js = `var cv=document.getElementById('cv'),ctx=cv.getContext('2d');
var color='${o.accent}',size=6,erasing=false,down=false,last=null;
var paper=getComputedStyle(document.documentElement).getPropertyValue('--paper').trim()||'#fff';
function fit(){var d=window.devicePixelRatio||1;var w=cv.clientWidth;
var old=document.createElement('canvas');old.width=cv.width;old.height=cv.height;old.getContext('2d').drawImage(cv,0,0);
cv.width=w*d;cv.height=420*d;ctx.fillStyle=paper;ctx.fillRect(0,0,cv.width,cv.height);
ctx.drawImage(old,0,0,old.width,old.height,0,0,cv.width,cv.height);
ctx.lineCap='round';ctx.lineJoin='round'}
fit();window.addEventListener('resize',fit);
function pos(e){var r=cv.getBoundingClientRect();var d=window.devicePixelRatio||1;return{x:(e.clientX-r.left)*d,y:(e.clientY-r.top)*d}}
cv.addEventListener('pointerdown',function(e){down=true;last=pos(e);cv.setPointerCapture(e.pointerId);stroke(e)});
cv.addEventListener('pointermove',function(e){if(down)stroke(e)});
cv.addEventListener('pointerup',function(){down=false;last=null});
function stroke(e){var p=pos(e);var d=window.devicePixelRatio||1;
ctx.strokeStyle=erasing?paper:color;ctx.lineWidth=size*d;
ctx.beginPath();ctx.moveTo(last?last.x:p.x,last?last.y:p.y);ctx.lineTo(p.x,p.y);ctx.stroke();last=p}
document.getElementById('tools').addEventListener('click',function(e){var b=e.target.closest('.sw');if(!b)return;
color=b.dataset.c;erasing=false;document.getElementById('er').classList.remove('onEr');
document.querySelectorAll('.sw').forEach(function(x){x.classList.toggle('on',x===b)})});
document.getElementById('pick').addEventListener('input',function(){color=this.value;erasing=false;document.getElementById('er').classList.remove('onEr')});
document.getElementById('size').addEventListener('input',function(){size=+this.value});
document.getElementById('er').addEventListener('click',function(){erasing=!erasing;this.classList.toggle('onEr',erasing)});
document.getElementById('clear').addEventListener('click',function(){ctx.fillStyle=paper;ctx.fillRect(0,0,cv.width,cv.height)});
document.getElementById('save').addEventListener('click',function(){var a=document.createElement('a');a.download='illumination.png';a.href=cv.toDataURL('image/png');a.click();say('Saved to thy downloads')});`;
  return { title: "The Illuminator's Canvas", code: base("The Illuminator's Canvas", 760, css, body, js, o), id: "draw" };
}

/* ------------------------------ PALETTE ------------------------------ */
function palette(o: DemoOpts) {
  const css = `.pal{display:flex;gap:0;margin-top:18px;border-radius:16px;overflow:hidden;border:1px solid var(--line);min-height:340px}
.slot{flex:1;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;padding:16px 6px;gap:8px;transition:flex .3s ease}
.slot:hover{flex:1.25}
.hex{font-family:ui-monospace,Menlo,monospace;font-size:13px;background:rgba(0,0,0,.28);color:#fff;border:none;padding:6px 10px;border-radius:8px}
.lock{font-size:12px;background:rgba(255,255,255,.22);color:#fff;border:none;padding:4px 10px;border-radius:8px}
.row{display:flex;gap:10px;justify-content:center;margin-top:18px;flex-wrap:wrap}
.hint{text-align:center;color:var(--mut);font-size:13px;margin-top:12px;font-style:italic}`;
  const body = `<h1 style="text-align:center">The Alchemist's <em>Palette</em></h1>
<p class="sub" style="text-align:center">Five harmonious hues, transmuted at thy word.</p>
<div class="pal" id="pal"></div>
<div class="row"><button class="pri" id="gen">✦ Transmute</button><button id="css">Copy as CSS</button></div>
<p class="hint">Press Space to transmute · click a hue to copy it · lock the ones thou lovest.</p>`;
  const js = `var slots=[];for(var i=0;i<5;i++)slots.push({h:0,s:60,l:50,locked:false});
var OFF=[0,28,55,180,208];
function hsl2hex(h,s,l){s/=100;l/=100;var k=function(n){return(n+h/30)%12};var a=s*Math.min(l,1-l);
var f=function(n){return l-a*Math.max(-1,Math.min(k(n)-3,Math.min(9-k(n),1)))};
var to=function(x){return Math.round(255*x).toString(16).padStart(2,'0')};
return '#'+to(f(0))+to(f(8))+to(f(4))}
function gen(){var baseH=Math.floor(Math.random()*360);
slots.forEach(function(sl,i){if(sl.locked)return;sl.h=(baseH+OFF[i])%360;sl.s=52+Math.floor(Math.random()*26);sl.l=34+i*9+Math.floor(Math.random()*8)});paint()}
function paint(){var el=document.getElementById('pal');el.innerHTML='';
slots.forEach(function(sl,i){var hex=hsl2hex(sl.h,sl.s,sl.l);var d=document.createElement('div');d.className='slot';
d.style.background='hsl('+sl.h+' '+sl.s+'% '+sl.l+'%)';
d.innerHTML='<button class="lock" data-i="'+i+'">'+(sl.locked?'Locked':'Lock')+'</button><button class="hex" data-i="'+i+'">'+hex+'</button>';
el.appendChild(d)})}
document.getElementById('pal').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;var i=+b.dataset.i;
if(b.classList.contains('lock')){slots[i].locked=!slots[i].locked;paint()}
else{var hex=b.textContent;if(navigator.clipboard){navigator.clipboard.writeText(hex).then(function(){say(hex+' copied')})}else say(hex)}});
document.getElementById('gen').addEventListener('click',gen);
document.getElementById('css').addEventListener('click',function(){
var t=':root{'+slots.map(function(sl,i){return '--hue-'+(i+1)+':'+hsl2hex(sl.h,sl.s,sl.l)}).join(';')+'}';
if(navigator.clipboard){navigator.clipboard.writeText(t).then(function(){say('CSS variables copied')})}else say(t)});
window.addEventListener('keydown',function(e){if(e.code==='Space'&&e.target.tagName!=='BUTTON'){e.preventDefault();gen()}});
gen();`;
  return { title: "The Alchemist's Palette", code: base("The Alchemist's Palette", 760, css, body, js, o), id: "palette" };
}

/* ------------------------------ LEDGER ------------------------------ */
function ledger(o: DemoOpts) {
  const css = `.sum{text-align:center;padding:26px}
.sum b{font-size:44px;font-weight:600;display:block;font-variant-numeric:tabular-nums}
.sum i{color:var(--mut)}
.bars{display:flex;height:10px;border-radius:99px;overflow:hidden;background:var(--line);margin-top:16px}
.bars .in{background:#2e8b62}.bars .out{background:#c0392b}
.legend{display:flex;justify-content:space-between;font-size:14px;color:var(--mut);margin-top:8px}
form{display:flex;gap:8px;margin-top:16px;flex-wrap:wrap}
form input[type=text]{flex:2;min-width:140px}form input[type=number]{flex:1;min-width:90px}
ul{list-style:none;padding:0;margin:14px 0 0}
li{display:flex;align-items:center;gap:10px;padding:11px 4px;border-bottom:1px solid var(--line);animation:rise .3s ease both}
li .amt{margin-left:auto;font-weight:600;font-variant-numeric:tabular-nums}
li .amt.pos{color:#2e8b62}li .amt.neg{color:#c0392b}
li .del{border:none;background:none;color:var(--mut);font-size:17px;padding:2px 8px}
li .del:hover{color:#c0392b;box-shadow:none}
.empty{text-align:center;color:var(--mut);padding:22px 0;font-style:italic}`;
  const body = `<h1 style="text-align:center">The Merchant's <em>Ledger</em></h1>
<p class="sub" style="text-align:center">Know where thy gold flows.</p>
<div class="card sum" style="margin-top:18px">
<i>Balance</i><b id="bal">0.00</b>
<div class="bars"><div class="in" id="bin" style="width:50%"></div><div class="out" id="bout" style="width:50%"></div></div>
<div class="legend"><span id="lin">Income 0.00</span><span id="lout">Expense 0.00</span></div>
</div>
<div class="card" style="margin-top:14px">
<form id="f"><input type="text" id="label" placeholder="For what cause?" autocomplete="off">
<input type="number" id="amt" placeholder="0.00" step="0.01" min="0">
<select id="kind"><option value="-">Expense</option><option value="+">Income</option></select>
<button class="pri" type="submit">Record</button></form>
<ul id="list"></ul>
</div>`;
  const js = `var KEY='merchant-ledger';var rows=[];try{rows=JSON.parse(localStorage.getItem(KEY)||'[]')}catch(e){}
function save(){try{localStorage.setItem(KEY,JSON.stringify(rows))}catch(e){}}
function money(n){return n.toFixed(2)}
function render(){var inc=0,out=0;rows.forEach(function(r){if(r.a>0)inc+=r.a;else out-=r.a});
document.getElementById('bal').textContent=money(inc-out);
document.getElementById('lin').textContent='Income '+money(inc);
document.getElementById('lout').textContent='Expense '+money(out);
var tot=inc+out||1;document.getElementById('bin').style.width=(inc/tot*100)+'%';
document.getElementById('bout').style.width=(out/tot*100)+'%';
var l=document.getElementById('list');
l.innerHTML=rows.length?rows.map(function(r){return '<li data-id="'+r.id+'"><span>'+(r.a>0?'▲':'▼')+'</span><span>'+esc(r.t)+'</span><span class="amt '+(r.a>0?'pos':'neg')+'">'+(r.a>0?'+':'−')+money(Math.abs(r.a))+'</span><button class="del" title="Strike out">×</button></li>'}).join(''):'<div class="empty">The ledger is blank. Record thy first entry ✦</div>'}
document.getElementById('f').addEventListener('submit',function(e){e.preventDefault();
var t=document.getElementById('label').value.trim();var a=parseFloat(document.getElementById('amt').value);
if(!t||!(a>0)){say('A cause and a sum, if you please');return}
var sign=document.getElementById('kind').value==='+'?1:-1;
rows.unshift({id:Date.now(),t:t,a:sign*a});
document.getElementById('label').value='';document.getElementById('amt').value='';save();render()});
document.getElementById('list').addEventListener('click',function(e){if(!e.target.closest('.del'))return;
var id=+e.target.closest('li').dataset.id;rows=rows.filter(function(r){return r.id!==id});save();render()});
render();`;
  return { title: "The Merchant's Ledger", code: base("The Merchant's Ledger", 620, css, body, js, o), id: "ledger" };
}

/* ------------------------- LANDING (fallback) ------------------------ */
function landing(o: DemoOpts, prompt: string) {
  const stop = new Set(["make", "create", "build", "a", "an", "the", "me", "for", "please", "design", "generate", "i", "want", "we", "need", "website", "web", "site", "page", "landing", "app", "about", "with", "that", "of", "some", "cool", "nice", "simple", "beautiful", "modern", "my", "can", "you", "write", "code", "called", "named", "cosy", "cozy"]);
  const words = prompt.toLowerCase().replace(/[^a-z0-9\s-]/g, " ").split(/\s+/).filter((w) => w && !stop.has(w));
  const topicRaw = words.slice(0, 5).join(" ") || "thy wondrous idea";
  const topic = topicRaw.replace(/\b\w/g, (c) => c.toUpperCase());
  const wish = prompt.length > 110 ? prompt.slice(0, 110) + "…" : prompt;
  const css = `nav{display:flex;justify-content:space-between;align-items:center;padding:6px 2px}
nav .brand{font-size:20px;font-weight:700;letter-spacing:.04em}
nav a{color:var(--mut);text-decoration:none;margin-left:18px;font-size:15px}nav a:hover{color:var(--acc)}
.hero{text-align:center;padding:74px 10px 58px}
.hero h1{font-size:clamp(34px,6.5vw,58px);line-height:1.12}
.hero p{max-width:560px;margin:18px auto 0;color:var(--mut);font-size:18px;line-height:1.6}
.cta{margin-top:30px;display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:16px;margin-top:14px}
.feat{text-align:center;padding:30px 20px}
.feat .glyph{font-size:34px;color:var(--acc)}
.feat h3{margin:12px 0 8px;font-size:19px}
.feat p{color:var(--mut);font-size:15px;line-height:1.55}
.quote{text-align:center;padding:44px 24px;margin-top:16px;font-style:italic;font-size:19px;line-height:1.6}
.quote small{display:block;margin-top:12px;color:var(--mut);font-style:normal;letter-spacing:.1em}
footer{text-align:center;color:var(--mut);padding:34px 0 8px;font-size:14px}
.reveal{opacity:0;transform:translateY(22px);transition:all .7s ease}
.reveal.vis{opacity:1;transform:none}`;
  const body = `<nav><span class="brand">✦ ${topic}</span><span><a href="#craft">Craft</a><a href="#wish">The Wish</a></span></nav>
<header class="hero">
<h1>${topic},<br><em>made real by a single wish.</em></h1>
<p>This page was inscribed by the Scriptorium's offline scribe from plain words alone. Bind a cloud or local AI scribe, and any vision — however wild — can take this page's place.</p>
<div class="cta"><button class="pri" onclick="document.getElementById('craft').scrollIntoView()">Discover the craft</button><button onclick="document.getElementById('wish').scrollIntoView()">Read the wish</button></div>
</header>
<section class="grid" id="craft">
<div class="card feat reveal"><div class="glyph">✦</div><h3>Swift as thought</h3><p>From spoken idea to living page in the time it takes to sip thy tea.</p></div>
<div class="card feat reveal"><div class="glyph">❖</div><h3>Fair on every screen</h3><p>Phone, tablet, or grand display — the layout bends gracefully to each.</p></div>
<div class="card feat reveal"><div class="glyph">☙</div><h3>Yours to refine</h3><p>Say “make it darker” or “add a section” and watch the ink rearrange itself.</p></div>
</section>
<section class="card quote reveal" id="wish">“${escHtml(wish)}”<small>— THE WISH THAT STARTED IT ALL</small></section>
<footer>Inscribed in the Scriptorium · <span id="yr"></span></footer>`;
  const js = `document.getElementById('yr').textContent=new Date().getFullYear();
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('vis');io.unobserve(e.target)}})},{threshold:.15});
document.querySelectorAll('.reveal').forEach(function(el){io.observe(el)});`;
  return { title: topic + " — A Living Page", code: base(topic, 860, css, body, js, o), id: "landing" };
}

function escHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/* ----------------------------- selection ----------------------------- */
const KEYWORDS: [string, RegExp][] = [
  ["todo", /\b(todo|to-do|task|checklist|to do|grocery|remind)/i],
  ["pomodoro", /\b(pomodoro|timer|focus|stopwatch|countdown|study)/i],
  ["calculator", /\b(calc|calculator|arithmet|math|reckon)/i],
  ["game", /\b(game|tic|tac|toe|nought|crosses|play)/i],
  ["quotes", /\b(quote|quotes|wisdom|inspiration|oracle|affirmation)/i],
  ["draw", /\b(draw|paint|sketch|canvas|doodle|art)/i],
  ["palette", /\b(palette|color|colour|swatch|hue|scheme)/i],
  ["ledger", /\b(expense|budget|money|ledger|finance|spend|income|coin)/i],
  ["landing", /\b(landing|portfolio|website|homepage|home page|startup|business|shop|bakery|cafe|restaurant|product)/i],
];

const DEFAULT_ACCENT: Record<string, string> = {
  todo: ACCENTS.emerald, pomodoro: ACCENTS.crimson, calculator: ACCENTS.violet,
  game: ACCENTS.azure, quotes: ACCENTS.gold, draw: ACCENTS.rose,
  palette: ACCENTS.teal, ledger: ACCENTS.emerald, landing: ACCENTS.gold,
};

export function pickTemplate(prompt: string): string | null {
  let best: string | null = null;
  let bestIdx = Infinity;
  for (let i = 0; i < KEYWORDS.length; i++) {
    if (KEYWORDS[i][1].test(prompt) && i < bestIdx) { best = KEYWORDS[i][0]; bestIdx = i; }
  }
  return best;
}

export interface DemoResult {
  title: string;
  code: string;
  meta: FolioMeta;
  refined: boolean;
}

export function buildDemo(prompt: string, prev?: FolioMeta): DemoResult {
  const lower = prompt.toLowerCase();
  const matched = pickTemplate(prompt);
  const isRefine = !matched && !!prev?.templateId;
  const id = matched ?? prev?.templateId ?? "landing";

  const o: DemoOpts = {
    dark: prev?.dark ?? false,
    accent: prev?.accent ?? DEFAULT_ACCENT[id] ?? ACCENTS.gold,
    motion: prev?.motion ?? false,
  };
  if (!matched) { /* refinement keeps previous defaults */ } else { o.dark = false; o.accent = DEFAULT_ACCENT[id]; }
  if (/\b(dark|night|black|midnight|shadow)\b/.test(lower)) o.dark = true;
  if (/\b(light|bright|day|white|cream|parchment)\b/.test(lower)) o.dark = false;
  for (const name of Object.keys(ACCENTS)) {
    if (new RegExp("\\b" + name + "\\b").test(lower)) { o.accent = ACCENTS[name]; break; }
  }
  if (/\b(animat|motion|lively|alive|dance|fade|stagger)\w*/.test(lower)) o.motion = true;

  const builders: Record<string, (o: DemoOpts) => { title: string; code: string; id: string }> = {
    todo, pomodoro, calculator, game, quotes, draw, palette, ledger,
  };
  const r = id === "landing" ? landing(o, prompt) : builders[id](o);
  return { title: r.title, code: r.code, meta: { templateId: id, dark: o.dark, accent: o.accent, motion: o.motion }, refined: isRefine };
}