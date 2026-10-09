// Hämtar Karins röstljud från din ElevenLabs-historik och lägger dem i audio/.
//
// Så funkar det:
//  1. Du genererar fraserna på elevenlabs.io (Text till tal, rösten Karin) – en i taget.
//  2. Kör:  node tools/voice.js
//     Skriptet läser din historik, letar upp varje fras via texten och laddar ner ljudet.
//     Har du gjort samma fras flera gånger används den senaste.
//  3. Skriptet skriver audio/voices.js (listan appen använder) och tools/fraser.html
//     (checklistan med vad som är klart och vad som saknas).
//
// Nyckeln läses från elevenlabs.env och behöver behörigheten "Historik – läs".
const fs = require('fs'), path = require('path'), vm = require('vm');
const root = path.join(__dirname, '..');
const audioDir = path.join(root, 'audio');
const VOICE_ID = '2z4pujvcLHrr5ilDhLnD'; // Karin
const MODEL = 'eleven_v4';              // bara ljud från den här modellen används
// Ljud som ska klippas: filnamn → hur stor del av början som behålls (0.5 = första halvan)
const TRIM = { aa: 0.5 };               // Å – konstigt ljud på slutet
// Ljud där version 2 (den andra varianten ElevenLabs gör varje gång) lät bäst
const VERSION2 = { 'ljud-tttt': 1 };

// Läs fraslistan från content.js – samma lista som appen använder
const ctx = {}; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(root, 'content.js'), 'utf8'), ctx);
const phrases = ctx.voicePhrases();
const norm = t => String(t).toLowerCase().replace(/[!?.,]/g, '').replace(/\s+/g, ' ').trim();

fs.mkdirSync(audioDir, { recursive: true });
const sourcesFile = path.join(audioDir, 'sources.json'); // vilken historikpost varje fil kom från
const sources = fs.existsSync(sourcesFile) ? JSON.parse(fs.readFileSync(sourcesFile, 'utf8')) : {};

async function main() {
  const envFile = path.join(root, 'elevenlabs.env');
  const key = fs.existsSync(envFile) && (fs.readFileSync(envFile, 'utf8').match(/ELEVENLABS_API_KEY\s*=\s*(\S+)/) || [])[1];
  if (!key) console.log('Ingen nyckel i elevenlabs.env – hoppar över hämtningen, uppdaterar bara listorna.');
  else await download(key);
  writeOutputs();
}

async function download(key) {
  // Hämta hela historiken för Karin (nyast först)
  const items = []; let after = null;
  do {
    const url = `https://api.elevenlabs.io/v1/history?page_size=1000` + (after ? `&start_after_history_item_id=${after}` : '');
    const res = await fetch(url, { headers: { 'xi-api-key': key } });
    if (!res.ok) {
      const body = await res.text();
      if (body.includes('speech_history_read')) console.error('Nyckeln saknar behörigheten "Historik – läs". Slå på den under Utvecklare → API-nycklar.');
      else console.error(`Kunde inte läsa historiken (${res.status}): ${body}`);
      return;
    }
    const j = await res.json();
    items.push(...j.history);  // v4 sparar text och röst i "dialogue" i stället för "text"/"voice_id"
    after = j.has_more ? j.last_history_item_id : null;
  } while (after);
  items.sort((a, b) => b.date_unix - a.date_unix);
  const textOf = it => it.text || (it.dialogue || []).map(d => d.text).join(' ');
  const voiceOf = it => it.voice_id || ((it.dialogue || [])[0] || {}).voice_id;
  const mine = items.filter(it => it.model_id === MODEL && voiceOf(it) === VOICE_ID && textOf(it));
  const mine2 = items.filter(it => it.model_id === MODEL + '_exp' && voiceOf(it) === VOICE_ID && textOf(it));
  const byExact2 = {}; for (const it of mine2) { const t = textOf(it).trim(); if (!byExact2[t]) byExact2[t] = it; }

  // Para ihop historiken med fraserna via texten – den nyaste vinner
  // Exakt text först (så att "D" och "d" hålls isär), annars utan stora bokstäver och skiljetecken
  const byText = {}, byExact = {};
  for (const it of mine) {
    const t = textOf(it);
    if (!byExact[t.trim()]) byExact[t.trim()] = it;
    if (!byText[norm(t)]) byText[norm(t)] = it;
  }
  const normCount = {}; phrases.forEach(p => normCount[norm(p.say)] = (normCount[norm(p.say)] || 0) + 1);
  let fetched = 0;
  for (const p of phrases) {
    const it = (VERSION2[p.key] && byExact2[p.say]) || byExact[p.say] || (normCount[norm(p.say)] === 1 ? byText[norm(p.say)] : null);
    const file = path.join(audioDir, p.key + '.mp3');
    if (!it || (sources[p.key] === it.history_item_id + (TRIM[p.key] ? '@' + TRIM[p.key] : '') && fs.existsSync(file))) continue;
    const res = await fetch(`https://api.elevenlabs.io/v1/history/${it.history_item_id}/audio`, { headers: { 'xi-api-key': key } });
    if (!res.ok) { console.error(`${p.say}: kunde inte hämtas (${res.status})`); continue; }
    let buf = Buffer.from(await res.arrayBuffer());
    buf = trimMp3(buf, TRIM[p.key] || 1); // tar alltid bort ID3-etiketten (~17 KB) och klipper vid behov
    fs.writeFileSync(file, buf);
    sources[p.key] = it.history_item_id + (TRIM[p.key] ? '@' + TRIM[p.key] : '');
    console.log(`  ✓ ${p.say}`);
    fetched++;
  }
  fs.writeFileSync(sourcesFile, JSON.stringify(sources, null, 1));
  const unknown = Object.keys(byText).filter(t => !phrases.some(p => norm(p.say) === t));
  console.log(`\nHämtade ${fetched} nya ljud.`);
  if (unknown.length) console.log(`(${unknown.length} saker i historiken matchade ingen fras, t.ex. "${unknown[0]}" – kolla stavningen om det var meningen)`);
}

// Klipp en mp3: behåll de första `keep` (0–1) av ljudramarna. En mp3 är en följd av små ramar
// (~26 ms var) som var och en börjar med ett sidhuvud som talar om hur lång ramen är.
function trimMp3(buf, keep) {
  let pos = 0;
  if (buf.slice(0, 3).toString() === 'ID3') pos = 10 + ((buf[6] << 21) | (buf[7] << 14) | (buf[8] << 7) | buf[9]);
  const start = pos, frames = [];
  const RATES = [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320], HZ = [44100, 48000, 32000];
  while (pos + 4 <= buf.length && buf[pos] === 0xff && (buf[pos + 1] & 0xe0) === 0xe0) {
    const kbps = RATES[buf[pos + 2] >> 4], hz = HZ[(buf[pos + 2] >> 2) & 3], pad = (buf[pos + 2] >> 1) & 1;
    if (!kbps || !hz) break;
    const len = Math.floor(144000 * kbps / hz) + pad;
    frames.push([pos, len]); pos += len;
  }
  if (!frames.length) return buf;
  const n = Math.max(1, Math.round(frames.length * keep)), end = frames[n - 1][0] + frames[n - 1][1];
  return buf.slice(start, end); // utan ID3-etiketten i början – den behövs inte för uppspelning
}

// Ta bort ID3-etiketten från filer som hämtats tidigare (gör inget med filer som redan saknar den)
// och städa bort ljud som inte längre finns i fraslistan (t.ex. efter en ändrad stavning)
function stripOld() {
  const keys = new Set(phrases.map(p => p.key + '.mp3'));
  for (const f of fs.readdirSync(audioDir)) if (f.endsWith('.mp3')) {
    const file = path.join(audioDir, f);
    if (!keys.has(f)) { fs.unlinkSync(file); delete sources[f.slice(0, -4)]; console.log(`  (tog bort gammal fil ${f})`); continue; }
    const buf = fs.readFileSync(file);
    if (buf.slice(0, 3).toString() === 'ID3') fs.writeFileSync(file, trimMp3(buf, 1));
  }
}

function writeOutputs() {
  stripOld();
  fs.writeFileSync(sourcesFile, JSON.stringify(sources, null, 1));
  const done = phrases.filter(p => fs.existsSync(path.join(audioDir, p.key + '.mp3')));
  const files = {}; done.forEach(p => files[p.key] = 1);
  fs.writeFileSync(path.join(audioDir, 'voices.js'),
    '// Skapas automatiskt av tools/voice.js – ändra inte för hand.\n// Röstljud som finns inspelade (Karin, ElevenLabs).\nvar VOICE_FILES=' + JSON.stringify(files) + ';\n');

  // Checklistan
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  let html = `<!doctype html><html lang="sv"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Fraser att spela in</title>
<style>
body{font-family:system-ui,sans-serif;max-width:720px;margin:0 auto;padding:16px;background:#faf8ff;color:#222}
h1{font-size:1.4rem;margin:0 0 4px}.sub{color:#666;margin:0 0 16px;font-size:.95rem}
.bar{position:sticky;top:0;background:#faf8ff;padding:8px 0;z-index:2}.prog{height:10px;background:#e5e0f5;border-radius:5px;overflow:hidden}
.prog i{display:block;height:100%;background:#7c5cff}
h2{font-size:1.05rem;margin:22px 0 8px;color:#5b42c9}
.p{display:flex;align-items:center;gap:10px;padding:9px 12px;margin:5px 0;background:#fff;border:1px solid #e3def2;border-radius:10px;cursor:pointer;font-size:1.05rem}
.p:hover{border-color:#7c5cff}.p.done{opacity:.45;background:#f1fbf3;border-color:#bfe5c6}.p.done .say{text-decoration:line-through}
.p .st{width:1.4em;text-align:center}.p .say{flex:1;font-weight:600}.p .k{color:#999;font-size:.8rem}
.p.copied{outline:3px solid #7c5cff}.p.made:not(.done){background:#fffbe6;border-color:#f0dc8a}
label{font-size:.9rem;color:#444}
footer{margin:32px 0 8px;text-align:center;font-size:.75rem;color:#aaa}
</style>
<h1>Fraser att spela in med Karin</h1>
<p class="sub">Klicka på en fras → den kopieras. Klistra in i <b>Text till tal</b> på ElevenLabs och tryck <b>Generera</b>.
Kör sedan <code>node tools/voice.js</code> så hämtas ljuden. 🟡 = kopierad (troligen gjord), ✅ = finns i appen.</p>
<div class="bar"><div><b id="cnt"></b> &nbsp; <label><input type="checkbox" id="hide"> Dölj klara</label></div><div class="prog"><i id="pg"></i></div></div>
`;
  let group = '';
  for (const p of phrases) {
    if (p.group !== group) { group = p.group; html += `<h2>${esc(group)}</h2>\n`; }
    const ok = !!files[p.key];
    html += `<div class="p${ok ? ' done' : ''}" data-say="${esc(p.say).replace(/"/g, '&quot;')}"><span class="st">${ok ? '✅' : '⬜'}</span><span class="say">${esc(p.say)}</span><span class="k">${p.key}.mp3</span></div>\n`;
  }
  html += `<footer>Made by: David Hefner</footer>
<script>
var all=document.querySelectorAll('.p'),done=document.querySelectorAll('.p.done').length;
document.getElementById('cnt').textContent=done+' av '+all.length+' klara';
document.getElementById('pg').style.width=(100*done/all.length)+'%';
var hide=document.getElementById('hide');
try{hide.checked=localStorage.getItem('hideDone')==='1'}catch(e){}
function apply(){all.forEach(function(el){if(el.classList.contains('done'))el.style.display=hide.checked?'none':''})}
hide.onchange=function(){try{localStorage.setItem('hideDone',hide.checked?'1':'0')}catch(e){}apply()};apply();
var made={};try{made=JSON.parse(localStorage.getItem('made')||'{}')}catch(e){}
all.forEach(function(el){if(made[el.dataset.say]&&!el.classList.contains('done')){el.classList.add('made');el.querySelector('.st').textContent='🟡'}});
all.forEach(function(el){el.onclick=function(){
  navigator.clipboard.writeText(el.dataset.say);
  made[el.dataset.say]=1;try{localStorage.setItem('made',JSON.stringify(made))}catch(e){}
  if(!el.classList.contains('done')){el.classList.add('made');el.querySelector('.st').textContent='🟡'}
  document.querySelectorAll('.copied').forEach(function(c){c.classList.remove('copied')});
  el.classList.add('copied');
}});
</script>
</html>`;
  fs.writeFileSync(path.join(__dirname, 'fraser.html'), html);
  console.log(`${done.length} av ${phrases.length} fraser klara. Checklistan: tools/fraser.html`);
}

main();
