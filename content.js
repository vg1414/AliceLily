// =====================================================================
// content.js – gemensamt innehåll för alla teman (Klassisk, Papper, Squishy, Turbo)
// Ändra ord, meningar, födelsedagar och svårighet HÄR så gäller det överallt.
// =====================================================================

// ---------- Temaväljare ----------
// Sparar valt tema i webbläsaren så appen öppnar samma tema nästa gång.
var THEMES={classic:'index.html',paper:'paper.html',clay:'clay.html',turbo:'turbo.html'};
function setTheme(t){
  try{localStorage.setItem('abcTheme',t)}catch(e){}
  if(THEMES[t]&&location.pathname.indexOf(THEMES[t])<0)location.href=THEMES[t];
}

// ---------- Alltid liggande läge ----------
// 1) manifest.json säger "orientation: landscape" – det gäller när appen öppnas via ikonen.
// 2) Vid första trycket försöker vi dessutom låsa skärmen i liggande läge. Android tillåter bara
//    låsning i helskärm, så misslyckas det går vi över till helskärm och låser sedan.
// 3) Hålls plattan ändå stående visas en "Vänd plattan!"-skylt över hela appen.
(function(){
  function lockLandscape(){
    var so=screen.orientation;
    if(!so||!so.lock)return;
    so.lock('landscape').catch(function(){
      var el=document.documentElement,fs=el.requestFullscreen||el.webkitRequestFullscreen;
      if(fs&&!document.fullscreenElement){
        try{Promise.resolve(fs.call(el,{navigationUI:'hide'})).then(function(){return so.lock('landscape')}).catch(function(){})}catch(e){}
      }
    });
  }
  // försök vid varje tryck tills skärmen är liggande (t.ex. efter temabyte, då helskärmen släpps)
  document.addEventListener('pointerdown',function(){
    if(!matchMedia('(hover:none)').matches)return; // bara surfplattor/mobiler, aldrig datorer
    if(!screen.orientation||screen.orientation.type.indexOf('landscape')<0||!document.fullscreenElement)lockLandscape();
  },true);

  // "Vänd plattan!"-skylten. Visas bara på pekskärmar (hover:none) som hålls stående,
  // så att en vanlig datorskärm aldrig får den.
  var css='#rotate-overlay{display:none;position:fixed;inset:0;z-index:99999;background:linear-gradient(160deg,#2d1b69,#1a1035);color:#fff;'+
    'flex-direction:column;align-items:center;justify-content:center;gap:28px;text-align:center;font-family:Fredoka,"Lilita One",Nunito,sans-serif}'+
    '@media (orientation:portrait) and (hover:none){#rotate-overlay{display:flex}}'+
    '#rotate-overlay svg{width:42vw;max-width:260px;height:auto;animation:rotTablet 2.4s ease-in-out infinite}'+
    '#rotate-overlay b{font-size:clamp(2rem,8vw,3.4rem);font-weight:700}'+
    '#rotate-overlay span{font-size:clamp(1rem,4vw,1.5rem);opacity:.75;font-weight:600}'+
    '@keyframes rotTablet{0%,20%{transform:rotate(0)}55%,85%{transform:rotate(-90deg)}100%{transform:rotate(0)}}';
  var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
  function addOverlay(){
    if(document.getElementById('rotate-overlay'))return;
    var d=document.createElement('div');d.id='rotate-overlay';
    d.innerHTML='<svg viewBox="0 0 120 170"><rect x="10" y="6" width="100" height="158" rx="16" fill="#ffd23f" stroke="#fff" stroke-width="6"/>'+
      '<rect x="22" y="20" width="76" height="118" rx="6" fill="#3b82ff"/><circle cx="60" cy="151" r="6" fill="#fff"/>'+
      '<circle cx="46" cy="70" r="6" fill="#fff"/><circle cx="74" cy="70" r="6" fill="#fff"/><path d="M44,94 q16,14 32,0" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round"/></svg>'+
      '<b>Vänd plattan! 🔄</b><span>Håll den liggande så funkar appen</span>';
    document.body.appendChild(d);
  }
  if(document.body)addOverlay();else document.addEventListener('DOMContentLoaded',addOverlay);
})();

// ---------- Födelsedagar & ålder ----------
// OBS: Bos födelsedag är ungefärlig (samma år som Lily) – byt till rätt datum när du vet det,
// annars hamnar födelsedagsfirandet på fel dag.
var BIRTHDAYS={alice:'2020-01-29',lily:'2021-09-10',bo:'2021-06-15'};
function ageOf(key){
  var b=new Date(BIRTHDAYS[key]+'T00:00:00'),n=new Date(),a=n.getFullYear()-b.getFullYear();
  if(n.getMonth()<b.getMonth()||(n.getMonth()===b.getMonth()&&n.getDate()<b.getDate()))a--;
  return a;
}
function isBirthday(key){
  var b=new Date(BIRTHDAYS[key]+'T00:00:00'),n=new Date();
  return b.getMonth()===n.getMonth()&&b.getDate()===n.getDate();
}
function ageLabel(key){return isBirthday(key)?'🎂 '+ageOf(key)+' år idag!':ageOf(key)+' år'}
// Svårighetsnivå väljs från åldern: 5 år (och yngre) = nivå 5, 6 år och äldre = nivå 6.
// När Lily fyller 6 får hon alltså automatiskt de svårare uppgifterna.
function levelFor(key){return ageOf(key)>=6?6:5}

// ---------- Uppgifter ----------
var CONTENT={
  // Nivå 5 – förskola: hela alfabetet, korta ljudenliga ord, plus upp till 10 och lite minus
  5:{
    letters:"ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ".split(""),
    words:[
      {word:"SOL",hint:"☀️"},{word:"KO",hint:"🐄"},{word:"BIL",hint:"🚗"},{word:"HUS",hint:"🏠"},
      {word:"IS",hint:"🧊"},{word:"MUS",hint:"🐭"},{word:"ÄGG",hint:"🥚"},{word:"BÅT",hint:"⛵"},
      {word:"FÅR",hint:"🐑"},{word:"GRIS",hint:"🐷"},{word:"ORM",hint:"🐍"},{word:"APA",hint:"🐒"},
      {word:"KAKA",hint:"🍪"},{word:"TÅG",hint:"🚂"},{word:"BOK",hint:"📖"},{word:"SKO",hint:"👟"},
      {word:"ROS",hint:"🌹"},{word:"ANKA",hint:"🦆"},{word:"FISK",hint:"🐟"},{word:"KATT",hint:"🐱"},
      {word:"HUND",hint:"🐶"},{word:"BOLL",hint:"⚽"},{word:"BUSS",hint:"🚌"},{word:"MÅNE",hint:"🌙"},
      {word:"NALLE",hint:"🧸"},{word:"GLASS",hint:"🍦"},{word:"LEJON",hint:"🦁"},{word:"HATT",hint:"🎩"}
    ],
    sentences:[
      {text:"JAG ÄR GLAD",emoji:"😊"},{text:"EN RÖD BIL",emoji:"🚗"},{text:"SE EN KO",emoji:"🐄"},
      {text:"EN FIN SOL",emoji:"☀️"},{text:"MIN KATT",emoji:"🐱"},{text:"EN STOR HUND",emoji:"🐶"},
      {text:"FISKEN SIMMAR",emoji:"🐟"},{text:"JAG GILLAR GLASS",emoji:"🍦"},{text:"EN LITEN MUS",emoji:"🐭"},
      {text:"BOLLEN ÄR RUND",emoji:"⚽"},{text:"VI LEKER UTE",emoji:"🌳"},{text:"APAN ÄR GLAD",emoji:"🐒"}
    ]
  },
  // Nivå 6 – förskoleklass: längre ord, längre meningar, tal upp till 20.
  // Inga sje- eller tje-ljud (SJ, STJ, CH, TJ, KJ, SK/K före E I Y Ä Ö …) – de är för svåra att stava än.
  6:{
    letters:"ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ".split(""),
    words:[
      {word:"BJÖRN",hint:"🐻"},{word:"HÄST",hint:"🐴"},{word:"FÅGEL",hint:"🐦"},{word:"ÄPPLE",hint:"🍎"},
      {word:"PÄRON",hint:"🍐"},{word:"TÅRTA",hint:"🎂"},{word:"BLOMMA",hint:"🌺"},{word:"KROKODIL",hint:"🐊"},
      {word:"HJÄRTA",hint:"❤️"},{word:"GRODA",hint:"🐸"},{word:"KANIN",hint:"🐰"},{word:"SKOLA",hint:"🏫"},
      {word:"DELFIN",hint:"🐬"},{word:"PRINSESSA",hint:"👸"},{word:"HELIKOPTER",hint:"🚁"},{word:"FLYGPLAN",hint:"✈️"},
      {word:"FJÄRIL",hint:"🦋"},{word:"ENHÖRNING",hint:"🦄"},{word:"REGNBÅGE",hint:"🌈"},{word:"SNÖGUBBE",hint:"⛄"},
      {word:"JORDGUBBE",hint:"🍓"},{word:"GIRAFF",hint:"🦒"},{word:"ELEFANT",hint:"🐘"},{word:"PINGVIN",hint:"🐧"},
      {word:"RAKET",hint:"🚀"},{word:"CYKEL",hint:"🚲"},{word:"PANNKAKA",hint:"🥞"},{word:"SPINDEL",hint:"🕷️"},
      {word:"PAPEGOJA",hint:"🦜"},{word:"BLÄCKFISK",hint:"🐙"},{word:"VULKAN",hint:"🌋"},{word:"KRONA",hint:"👑"}
    ],
    sentences:[
      {text:"KATTEN SOVER PÅ SOFFAN",emoji:"🐱"},
      {text:"FJÄRILEN FLYGER ÖVER ÄNGEN",emoji:"🦋"},
      {text:"VI ÅKTE TILL STRANDEN IGÅR",emoji:"🏖️"},
      {text:"MIN KOMPIS HAR EN HAMSTER",emoji:"🐹"},
      {text:"REGNBÅGEN LYSER PÅ HIMLEN",emoji:"🌈"},
      {text:"JAG VILL LÄSA EN BOK OM DRAKAR",emoji:"🐉"},
      {text:"PRINSESSAN BOR I ETT SLOTT",emoji:"🏰"},
      {text:"SNÖFLINGORNA FALLER SAKTA NER",emoji:"❄️"},
      {text:"VI BAKADE KANELBULLAR TILLSAMMANS",emoji:"🍩"},
      {text:"ENHÖRNINGEN SPRINGER GENOM SKOGEN",emoji:"🦄"},
      {text:"PINGVINEN GLIDER PÅ ISEN",emoji:"🐧"},
      {text:"VI BYGGER EN STOR SNÖGUBBE",emoji:"⛄"},
      {text:"RAKETEN FLYGER TILL MÅNEN",emoji:"🚀"},
      {text:"DELFINEN HOPPAR I HAVET",emoji:"🐬"},
      {text:"MORMOR BAKAR PANNKAKOR",emoji:"🥞"}
    ]
  }
};

var MATH_EMOJIS=["🍎","🌟","🍪","🐱","🌸","💎","🍓","🐶","🦋","🎈","🍭","⭐","🐸","🌈","🎀"];

// ---------- Mattetal ----------
// Returnerar ett färdigt tal: {a, b, op, answer, missing, total, options, hint, say, sayAnswer}
// missing=true betyder "a + ? = total" – då är svaret b.
function makeMathTask(level,emoji){
  function r(lo,hi){return lo+Math.floor(Math.random()*(hi-lo+1))}
  function pk(arr){return arr[Math.floor(Math.random()*arr.length)]}
  var t={missing:false},kind;
  if(level<=5){
    kind=pk(['+','+','+','-']);
    if(kind==='+'){t.a=r(1,6);t.b=r(1,10-t.a);t.op='+';t.answer=t.a+t.b}
    else{t.a=r(3,7);t.b=r(1,t.a-1);t.op='-';t.answer=t.a-t.b}
  }else{
    kind=pk(['+','+','-','-','×','?']);
    if(kind==='+'){t.a=r(3,12);t.b=r(2,20-t.a);t.op='+';t.answer=t.a+t.b}
    else if(kind==='-'){t.a=r(6,20);t.b=r(1,t.a-1);t.op='-';t.answer=t.a-t.b}
    else if(kind==='×'){t.a=r(2,4);t.b=pk([2,3,5]);t.op='×';t.answer=t.a*t.b}
    else{t.a=r(2,9);t.b=r(1,15-t.a);t.op='+';t.missing=true;t.answer=t.b}
  }
  t.total=t.op==='+'?t.a+t.b:(t.op==='-'?t.a-t.b:t.a*t.b);
  var word={'+':'plus','-':'minus','×':'gånger'}[t.op];
  if(t.missing){
    t.hint='Hur många fattas?';
    t.say=t.a+' plus hur många blir '+t.total;
    t.sayAnswer=t.a+' plus '+t.b+' är lika med '+t.total;
  }else{
    t.hint=t.op==='×'?(t.a+' grupper med '+t.b+' '+emoji+' – hur många?'):(level<=5?(t.op==='+'?'Räkna ihop!':'Hur många blir kvar?'):'Vad blir det?');
    t.say=t.a+' '+word+' '+t.b;
    t.sayAnswer=t.a+' '+word+' '+t.b+' är lika med '+t.answer;
  }
  // fyra svarsalternativ nära det rätta svaret
  var opts=[t.answer],spread=level<=5?2:4;
  while(opts.length<4){var w=Math.max(0,t.answer+r(-spread,spread));if(opts.indexOf(w)<0)opts.push(w)}
  t.options=opts;
  return t;
}
