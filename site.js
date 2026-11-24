/* NOR Eventos · scripts */

/* ====== CONFIGURACIÓN: rellenar cuando estén los datos ====== */
const CONFIG = {
  whatsapp: '',     // ej. '34600000000' (sin + ni espacios)
  phone: '',        // ej. '600 000 000'
  email: '',        // ej. 'hola@noreventos.com'
  instagram: '',    // ej. 'noreventos'
  zone: 'Santander · Cantabria'
};

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const root = document.documentElement;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

const SETUPS = {
  brisa:{name:'Brisa', tag:'Esencial', for:'Fiestas, cumpleaños y bodas pequeñas. Sonido RCF y luz con ritmo.',
    sonido:['2 altavoces RCF ART 715 · 15″','Soportes y micrófono inalámbrico'], luz:['2 cabezas móviles beam 100 W','2 barras LED de color','Máquina de humo','Luces sincronizadas con la música'], est:['Cabina DJ','Puente de luces 3 m']},
  levante:{name:'Levante', tag:'Completo', for:'Hasta 150 invitados. Aquí entra el subwoofer y la pista empieza a temblar.',
    sonido:['2 altavoces RCF ART 715 · 15″','Subwoofer RCF 708 · 18″','Micrófono inalámbrico'], luz:['4 cabezas móviles beam 100 W','2 paneles matrix 5 × 5','Láser RGB','4 barras LED de color','Máquina de humo','Control DMX con técnico de luces'], est:['Cabina DJ','Puente de luces 3 m']},
  tramontana:{name:'Tramontana', tag:'Todo', for:'Más de 150 invitados y espacios grandes. Todo nuestro equipo, a la vez.',
    sonido:['2 altavoces RCF ART 715 · 15″','Subwoofer RCF 708 · 18″','Micrófono inalámbrico'], luz:['2 cabezas beam 230 W + 4 beam 100 W','2 paneles matrix 5 × 5','Láser RGB','4 barras LED de color','Máquina de humo','Control DMX con técnico de luces'], est:['Cabina DJ grande con tótem','Tarima 2 × 2 m','Puente de luces 3 m']}
};
const SMALL = ['brisa'], MID = ['brisa','levante'], BIG = ['tramontana'];
const VISUAL = [
  ['bolas','Bolas de discoteca','Brillo clásico sobre la pista: elegantes, festivas y muy fotogénicas. Si el espacio lo permite, dan profundidad a todo.'],
  ['laser','Show láser','Láseres RGB de alta potencia sincronizados con la música para los subidones. La pista, en modo club.'],
  ['chispas','Fuego frío','Dos máquinas de chispas para la entrada o el momento épico. Todo el impacto, sin humo ni riesgo.'],
  ['reel','Aftermovie','Un videógrafo graba lo mejor de la fiesta y os entrega un vídeo de 60–75 segundos para compartir.']
];
const OTHERS = [
  ['co2','Cañón de CO₂','Un cañón con bombona de 37 kg. Chorros blancos en lo más alto de la fiesta.'],
  ['grupo','Equipo para grupo en directo','Según el rider técnico de la banda.'],
  ['proy','Proyector + pantalla','Pantalla de 60″ sobre trípode, para vídeos o fotos.'],
  ['palos','Palos LED','Lote de 50 unidades para repartir en la pista.'],
  ['tarima','Tarima de escenario','Para elevar al grupo, la cabina o los discursos.'],
  ['km','Vamos donde estéis','Toda Cantabria y alrededores. Más lejos, consúltanos.'],
  ['bengala','Bengalas de colores','Humo de color para fotos y salidas.'],
  ['pausa','Pausa del DJ','Si actúa un grupo (unos 90 minutos).'],
  ['dj-ext','Técnico para DJ externo','Obligatorio si el DJ no es de NOR.']
];
const ADDONS = [['laserbar','Láser RGB','El láser de Levante y Tramontana, también en vuestro escenario Brisa.','Brisa'],['beams','2 cabezas beam 230 W','Haces más potentes y nítidos que atraviesan todo el salón.','Brisa · Levante'],['led','Pantallas LED','Módulos de 0,5 × 0,5 m. De 2 a 7 m², adaptadas a vuestro espacio.','Tramontana']];

const IC = {
  bolas:'<circle cx="12" cy="13" r="7"/><path d="M12 2v4M5 13h14M12 6c-3 3-3 11 0 14M12 6c3 3 3 11 0 14"/>',
  laser:'<path d="M12 21 4 3M12 21 9 3M12 21l3-18M12 21l8-18"/>',
  chispas:'<path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8"/>',
  reel:'<rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3"/>',
  co2:'<path d="M8 21h8M10 21V9h4v12M12 9V3M9 5l3-2 3 2"/>',
  grupo:'<circle cx="7" cy="7" r="3"/><circle cx="17" cy="7" r="3"/><path d="M2 21c0-4 2-7 5-7s5 3 5 7M12 21c0-4 2-7 5-7s5 3 5 7"/>',
  proy:'<rect x="3" y="4" width="18" height="12" rx="1"/><path d="M12 16v5M8 21h8"/>',
  palos:'<path d="M6 21 14 3M10 21l8-18"/>',
  tarima:'<path d="M3 10h18v4H3zM5 14v6M19 14v6"/>',
  km:'<path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>',
  bengala:'<path d="M12 22V11M9 8c0-3 3-5 3-5s3 2 3 5a3 3 0 0 1-6 0z"/>',
  pausa:'<circle cx="12" cy="12" r="9"/><path d="M10 9v6M14 9v6"/>',
  'dj-ext':'<path d="M3 14v-2a9 9 0 0 1 18 0v2"/><rect x="2" y="14" width="5" height="7" rx="1"/><rect x="17" y="14" width="5" height="7" rx="1"/>',
  beams:'<path d="M12 3v3M6 21l4-15h4l4 15"/><path d="M9 3h6"/>',
  laserbar:'<path d="M3 20h18M6 20 4 4M10 20 9 4M14 20l1-16M18 20l2-16"/>',
  led:'<rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M3 10h18M9 4v12M15 4v12"/>'
};
const svg = k => `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[k] || ''}</svg>`;

/* ---------- Escenario (dibujo) ---------- */
function stageHTML(text){
  let sp = ''; for (let i = 0; i < 14; i++) sp += `<i style="--sx:${(Math.random()*40-20).toFixed(0)}px;animation-delay:${(Math.random()*1.1).toFixed(2)}s"></i>`;
  const lz = side => [...Array(6)].map((_,i) => `<i style="--a:${side * (8 + i * 9)}deg;animation-delay:${-i*.3}s"></i>`).join('');
  const beams = [12,30,58,76].map((x,i) => `<div class="st-beam b${i}" style="left:${x}%;--dh:${i*35};animation-delay:${-i*.7}s"></div>`).join('');
  return `<div class="st-dots"></div><div class="st-ball"></div>
    <div class="st-truss"></div>${beams}<div class="st-blinder l"></div><div class="st-blinder r"></div>
    <div class="st-screen l"><span class="txt"></span></div><div class="st-screen c"><span class="txt">${esc(text)}</span></div><div class="st-screen r"><span class="txt"></span></div>
    <div class="st-floor"></div><div class="st-tarima"></div><div class="st-bars">${[[8,0],[18,60],[76,120],[86,180]].map(([x,h]) => `<i style="left:${x}%;--bh:${h}"></i>`).join('')}</div><div class="st-sub"></div><div class="st-totem l"></div><div class="st-totem r"></div>
    <div class="st-laser l">${lz(-1)}</div><div class="st-laser r">${lz(1)}</div>
    <div class="st-speaker l"></div><div class="st-speaker r"></div>
    <div class="st-dj"><svg viewBox="0 0 60 70" aria-hidden="true"><g fill="#07070A"><circle cx="30" cy="14" r="10"/><path d="M14 13a16 16 0 0 1 32 0" stroke="#07070A" stroke-width="4" fill="none"/><rect x="10" y="10" width="6" height="10" rx="2"/><rect x="44" y="10" width="6" height="10" rx="2"/><path d="M12 70c0-22 6-40 18-40s18 18 18 40z"/><path d="M14 44 4 30M46 44l10-14" stroke="#07070A" stroke-width="7" stroke-linecap="round"/></g></svg></div><div class="st-booth"><span class="bt"></span></div><div class="st-mic"></div>
    <div class="st-proj"><span></span></div><div class="st-cock"><svg viewBox="0 0 60 60" aria-hidden="true"><path d="M8 28h44M30 28v30M18 58h24" stroke="#5A5A66" stroke-width="3" fill="none"/><path d="M14 10l6 10 6-10z" fill="#F7A9B8"/><path d="M20 20v8" stroke="#ccc" stroke-width="1.5"/><path d="M34 6l6 12 6-12z" fill="#F3C77B"/><path d="M40 18v10" stroke="#ccc" stroke-width="1.5"/></svg></div><div class="st-spark l">${sp}</div><div class="st-spark r">${sp}</div>
    <div class="st-co2 l"></div><div class="st-co2 r"></div>
    <div class="st-photo"></div><div class="st-fog"></div><div class="st-glow"></div>`;
}
function miniStage(el, cls, text){ el.innerHTML = `<div class="stage ${cls}" style="position:absolute;inset:0;border:0;border-radius:0">${stageHTML(text || 'NOR')}</div>`; }

/* ---------- Catálogo ---------- */
const li = a => a.map(x => `<li>${x}</li>`).join('');
$('#setups').innerHTML = Object.entries(SETUPS).map(([k,s],i) => `
  <article class="pack${k === 'levante' ? ' feat' : ''}"><div class="mini" data-mini="p-${k}"></div><div class="body">
    <h3>${s.name}</h3><span class="for">${s.for}</span>
    <div class="spec"><div><h4>Sonido</h4><ul>${li(s.sonido)}</ul></div><div><h4>Luz y efectos</h4><ul>${li(s.luz)}</ul></div><div><h4>Estructura</h4><ul>${li(s.est)}</ul></div></div>
    <div class="foot-p"><p class="iva">Transporte, montaje y desmontaje incluidos.</p><a class="btn ${k === 'levante' ? 'btn-light' : 'btn-line'}" href="#monta" data-pack="${k}" aria-label="Elegir ${s.name}">Elegir</a></div>
  </div></article>`).join('');
$$('[data-mini]').forEach(m => miniStage(m, m.dataset.mini + (m.dataset.mini === 'p-tramontana' ? ' x-pantallas' : '')));
$('#addons').innerHTML = ADDONS.map(([k,t,d,f]) => `<article class="ex"><span class="ic">${svg(k)}</span><div><span class="for">${f}</span><h3>${t}</h3><p>${d}</p></div></article>`).join('');
$('#visual').innerHTML = VISUAL.map(([k,t,d]) => `<article class="ex" style="flex-direction:column"><span class="ic">${svg(k)}</span><div><h3>${t}</h3><p>${d}</p></div></article>`).join('');
$('#others').innerHTML = OTHERS.map(([k,t,d]) => `<article class="ex"><span class="ic">${svg(k)}</span><div><h3>${t}</h3><p>${d}</p></div></article>`).join('');

/* ---------- Configurador ---------- */
const TYPES = {boda:['Boda','VUESTROS NOMBRES'], cumple:['Cumpleaños','FELIZ 30'], empresa:['Evento de empresa','TU MARCA'], fiesta:['Fiesta','NOR EVENTOS']};
const st = {type:'boda', pack:'levante', sesion:true, ceremonia:true, coctel:'', hours:0, laserbar:false, beams:false, led:0, extras:new Set(['chispas']), place:'', text:''};
const stage = $('#stage'); stage.innerHTML = stageHTML('');
$('#g-pack').innerHTML = `<button type="button" data-v="none" aria-pressed="false">Sin escenario<small>—</small></button>` + Object.entries(SETUPS).map(([k,s]) => `<button type="button" data-v="${k}" aria-pressed="false">${s.name}<small>${s.tag}</small></button>`).join('');
$('#g-music').innerHTML = `<button type="button" class="tog" data-m="sesion"><span>Sesión NOR<small>DJ · 4 h</small></span><i aria-hidden="true"></i></button><button type="button" class="tog" data-m="ceremonia"><span>Ceremonia<small>Micros + música</small></span><i aria-hidden="true"></i></button>`;
$('#g-addon').innerHTML = `<button type="button" class="tog" data-a="laserbar"><span>Láser RGB<small>Para Brisa</small></span><i aria-hidden="true"></i></button><button type="button" class="tog" data-a="beams"><span>2 beams 230 W<small>Brisa y Levante</small></span><i aria-hidden="true"></i></button>`;
const CFG_EX = [...VISUAL.map(([k,t]) => [k,t]), ['co2','Cañón de CO₂'], ['palos','Palos LED'], ['proy','Proyector + pantalla']];
$('#g-extras').innerHTML = CFG_EX.map(([k,t]) => `<button type="button" class="tog" data-x="${k}"><span>${t}</span><i aria-hidden="true"></i></button>`).join('');

function calc(){
  const L = [];
  if (st.sesion) L.push(`Sesión NOR · ${4 + st.hours} h`);
  if (st.ceremonia) L.push('Música y micros para la ceremonia');
  if (st.coctel) L.push(st.coctel === 'dj' ? 'Cóctel con DJ' : 'Cóctel con playlist');
  if (st.pack !== 'none') L.push(`Escenario ${SETUPS[st.pack].name}`);
  if (st.laserbar && SMALL.includes(st.pack)) L.push('Láser RGB');
  if (st.beams && MID.includes(st.pack)) L.push('2 cabezas beam 230 W');
  if (st.led && BIG.includes(st.pack)) L.push(`Pantallas LED · ${st.led} m²`);
  CFG_EX.forEach(([k,t]) => { if (st.extras.has(k)) L.push(t); });
  return L;
}
function renderStage(){
  const vis = [...st.extras].filter(x => ['bolas','laser','chispas','reel','co2','palos'].includes(x));
  if (st.laserbar && SMALL.includes(st.pack)) vis.push('laserrgb');
  if (st.beams && MID.includes(st.pack)) vis.push('beams230');
  if (st.led && BIG.includes(st.pack)) vis.push('pantallas');
  if (st.sesion) vis.push('dj');
  if (st.ceremonia) vis.push('mic');
  if (st.coctel) vis.push('cock');
  if (st.extras.has('proy')) vis.push('proy');
  const before = new Set(stage.className.split(' '));
  stage.className = `stage p-${st.pack} ` + vis.map(x => 'x-' + x).join(' ');
  if (renderStage.ready && (vis.some(x => !before.has('x-' + x)) || !before.has('p-' + st.pack))){ stage.classList.remove('pop'); void stage.offsetWidth; stage.classList.add('pop'); }
  $('.bt', stage).textContent = st.text || 'NOR';
  const t = st.text || TYPES[st.type][1];
  $$('.st-screen .txt', stage).forEach((e,i) => e.textContent = i === 1 ? t : '');
  $('#b-text').placeholder = 'Ej. ' + TYPES[st.type][1];
  $$('#g-type button').forEach(b => b.setAttribute('aria-pressed', b.dataset.v === st.type));
  $$('#g-pack button').forEach(b => b.setAttribute('aria-pressed', b.dataset.v === st.pack));
  $$('#g-coctel button').forEach(b => b.setAttribute('aria-pressed', b.dataset.v === st.coctel));
  $$('#g-music .tog').forEach(b => b.setAttribute('aria-pressed', !!st[b.dataset.m]));
  $$('#g-extras .tog').forEach(b => b.setAttribute('aria-pressed', st.extras.has(b.dataset.x)));
  const lb = $('[data-a="laserbar"]'); lb.disabled = !SMALL.includes(st.pack); lb.setAttribute('aria-pressed', st.laserbar && !lb.disabled);
  const bm = $('[data-a="beams"]'); bm.disabled = !MID.includes(st.pack); bm.setAttribute('aria-pressed', st.beams && !bm.disabled);
  const ledOk = BIG.includes(st.pack); $('#q-led').setAttribute('aria-disabled', !ledOk); $('#q-led output').textContent = ledOk ? st.led : '—';
  $('#q-hours output').textContent = st.hours; $('#q-hours').setAttribute('aria-disabled', !st.sesion);
  const L = calc();
  $('#bill').innerHTML = `<h4>Tu montaje</h4>` + (L.length ? L.map(t => `<div><span>${esc(t)}</span></div>`).join('') : '<div><span>Elige algo para empezar</span></div>')
    + `<p class="note">Te preparamos presupuesto a medida, sin compromiso.</p>`;
  renderStage.ready = true;
  stage.setAttribute('aria-label', `Vista previa: ${TYPES[st.type][0]}, ${st.pack === 'none' ? 'sin escenario' : 'escenario ' + SETUPS[st.pack].name}`);
}
$$('#g-type button').forEach(b => b.addEventListener('click', () => { st.type = b.dataset.v; renderStage(); }));
$('#g-pack').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; st.pack = b.dataset.v; if (BIG.includes(st.pack) && !st.led) st.led = 0; renderStage(); });
$$('#g-coctel button').forEach(b => b.addEventListener('click', () => { st.coctel = b.dataset.v; renderStage(); }));
$$('#g-music .tog').forEach(b => b.addEventListener('click', () => { st[b.dataset.m] = !st[b.dataset.m]; if (!st.sesion) st.hours = 0; renderStage(); }));
$$('#g-addon .tog').forEach(b => b.addEventListener('click', () => { const k = b.dataset.a; st[k] = !st[k]; renderStage(); }));
$$('#g-extras .tog').forEach(b => b.addEventListener('click', () => { const x = b.dataset.x; st.extras.has(x) ? st.extras.delete(x) : st.extras.add(x); renderStage(); }));
$$('#q-hours button').forEach(b => b.addEventListener('click', () => { if (!st.sesion) return; st.hours = Math.max(0, Math.min(6, st.hours + +b.dataset.d)); renderStage(); }));
$$('#q-led button').forEach(b => b.addEventListener('click', () => { if (!BIG.includes(st.pack)) return; let v = st.led + +b.dataset.d; v = v < 2 ? (b.dataset.d > 0 ? 2 : 0) : Math.min(7, v); st.led = v; renderStage(); }));
$('#b-text').addEventListener('input', e => { st.text = e.target.value.trim(); renderStage(); });
$('#b-place').addEventListener('input', e => { st.place = e.target.value.trim(); });
$$('[data-type]').forEach(a => a.addEventListener('click', () => { st.type = a.dataset.type; renderStage(); }));
document.addEventListener('click', e => { const a = e.target.closest('[data-pack]'); if (a){ st.pack = a.dataset.pack; renderStage(); } });
renderStage();
$('#ask').addEventListener('click', () => {
  const L = calc();
  $('#c-type').value = TYPES[st.type][0];
  if (st.place) $('#c-l').value = st.place;
  $('#c-m').value = `Me interesa este montaje:\n${L.map(t => `· ${t}`).join('\n')}${st.text ? `\nTexto en pantallas: ${st.text}` : ''}`;
});

/* ---------- Hero: focos, brújula, faders y DROP ---------- */
const hero = $('#hero'), beams = $('#beams');
const BX = [8, 26, 50, 74, 92];
beams.innerHTML = BX.map((x,i) => `<div class="beam" style="--x:calc(${x}% - 60px);--dh:${(i-2)*25}"></div>`).join('');
const beamEls = $$('.beam', beams), rose = $('#rose');
function aim(cx, cy){
  const r = hero.getBoundingClientRect();
  beamEls.forEach((b, i) => {
    const bx = r.left + r.width * BX[i] / 100;
    const ang = Math.atan2(cx - bx, Math.max(60, cy - r.top)) * 180 / Math.PI;
    b.style.setProperty('--r', (-ang).toFixed(1) + 'deg');
  });
  const c = $('#compass').getBoundingClientRect();
  rose.style.rotate = (Math.atan2(cx - (c.left + c.width/2), -(cy - (c.top + c.height/2))) * 180 / Math.PI).toFixed(1) + 'deg';
}
if (!reduce){
  hero.addEventListener('pointermove', e => aim(e.clientX, e.clientY));
  let t = 0;
  (function idle(){ if (!hero.matches(':hover') && !hero.closest('[data-view]').hidden){ t += .012 * (parseFloat(getComputedStyle(root).getPropertyValue('--spd')) || 1); const r = hero.getBoundingClientRect(); if (r.bottom > 0 && r.height) aim(r.left + r.width * (.5 + .4 * Math.sin(t)), r.top + r.height * (.75 + .15 * Math.cos(t * 1.3))); } requestAnimationFrame(idle); })();
}
$('#f-color').addEventListener('input', e => root.style.setProperty('--h', e.target.value));
$('#f-int').addEventListener('input', e => root.style.setProperty('--int', e.target.value / 100));
$('#f-spd').addEventListener('input', e => root.style.setProperty('--spd', e.target.value / 100));
let actx;
function kick(when){
  const o = actx.createOscillator(), g = actx.createGain();
  o.frequency.setValueAtTime(150, when); o.frequency.exponentialRampToValueAtTime(40, when + .18);
  g.gain.setValueAtTime(.9, when); g.gain.exponentialRampToValueAtTime(.001, when + .3);
  o.connect(g).connect(actx.destination); o.start(when); o.stop(when + .32);
}
$('#drop').addEventListener('click', () => {
  if (hero.classList.contains('drop')) return;
  try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); const n = actx.currentTime; for (let i = 0; i < 8; i++) kick(n + i * .25); } catch (e) {}
  if (reduce) return;
  hero.classList.add('drop');
  const h0 = +$('#f-color').value; let k = 0;
  const iv = setInterval(() => root.style.setProperty('--h', (h0 + (++k) * 47) % 360), 250);
  setTimeout(() => { hero.classList.remove('drop'); clearInterval(iv); root.style.setProperty('--h', h0); }, 2000);
});

/* ===================== BODAS ===================== */
const W = {a:'', b:'', date:''};
const wNames = () => `${W.a || 'Ana'} & ${W.b || 'Javi'}`;
function renderSign(){
  $('#w-names').textContent = wNames().toUpperCase();
  const c = $('#w-count');
  if (!W.date){ c.textContent = (W.a || W.b) ? 'Ahora, vuestra fecha.' : 'Escribid vuestros nombres y vuestra fecha.'; return; }
  const d = Math.ceil((new Date(W.date + 'T12:00:00') - new Date()) / 864e5);
  if (d > 0) c.innerHTML = `Faltan <b>${d}</b> días. ${d > 120 ? 'Tiempo de sobra para montarla bien.' : d > 30 ? 'Aún llegáis: reservad ya vuestra fecha.' : '¡Queda nada! Escribidnos hoy.'}`;
  else if (d === 0) c.innerHTML = '<b>¡Es hoy!</b> Enhorabuena.';
  else c.textContent = 'Esa fecha ya ha pasado. ¿Seguro que es esa?';
}
$('#w-a').addEventListener('input', e => { W.a = e.target.value.trim(); renderSign(); });
$('#w-b').addEventListener('input', e => { W.b = e.target.value.trim(); renderSign(); });
$('#w-date').addEventListener('input', e => { W.date = e.target.value; renderSign(); });
renderSign();
function reserve(){
  $('#c-type').value = 'Boda';
  if (W.date) $('#c-d').value = W.date;
  if (W.a) $('#c-n').value = W.a;
  if (!$('#c-m').value) $('#c-m').value = `Hola, somos ${wNames()} y nos casamos${W.date ? ' el ' + new Date(W.date + 'T12:00:00').toLocaleDateString('es-ES', {day:'numeric', month:'long', year:'numeric'}) : ''}. Queremos reservar fecha.`;
}
$('#w-reserve').addEventListener('click', reserve);
$('#w-reserve2').addEventListener('click', reserve);
$$('#moments .mo').forEach(m => m.addEventListener('click', () => m.setAttribute('aria-expanded', m.getAttribute('aria-expanded') !== 'true')));

(function(){
  const d = $('#dance');
  let sp = ''; for (let i = 0; i < 16; i++) sp += `<i style="--sx:${(Math.random()*40-20).toFixed(0)}px;animation-delay:${(Math.random()*1.1).toFixed(2)}s"></i>`;
  d.innerHTML = `<div class="st-spot"></div><div class="st-floor"></div><div class="st-pool"></div>
    <svg class="st-couple" viewBox="0 0 120 160" aria-hidden="true"><g fill="#0A0809">
      <circle cx="48" cy="22" r="11"/><path d="M36 38h24l4 50-6 66h-8l-4-50-4 50h-8l-4-66z"/>
      <circle cx="76" cy="28" r="10"/><path d="M68 42h16l3 30 22 82H46l20-82z"/><path d="M60 46 70 58M52 44l18 14" stroke="#0A0809" stroke-width="7" stroke-linecap="round"/></g></svg>
    <div class="st-spark l">${sp}</div><div class="st-spark r">${sp}</div><div class="st-co2 l"></div><div class="st-co2 r"></div><div class="st-fog"></div>`;
  const map = {spot:'x-spot', humo:'x-humo', chispas:'x-chispas', co2:'x-co2'};
  $$('#fx .tog').forEach(b => b.addEventListener('click', () => {
    const on = b.getAttribute('aria-pressed') !== 'true'; b.setAttribute('aria-pressed', on);
    d.classList.toggle(map[b.dataset.fx], on);
  }));
})();

(function(){
  const Q = [
    ['¿Cómo os imagináis el final de la noche?', [['Cenando y charlando con los nuestros','calma'],['Bailando hasta que nos echen','fiesta'],['Un fiestón que se recuerde años','show']]],
    ['¿Cuántos invitados seréis?', [['Íntima, solo los de verdad','s'],['Hasta unos 150','m'],['Más de 150','l']]],
    ['¿Qué momento os hace más ilusión?', [['La ceremonia','cer'],['La entrada al banquete','ent'],['El primer baile','baile'],['La fiesta','fiesta']]]
  ];
  const box = $('#quiz'); const a = [];
  function step(i){
    if (i >= Q.length) return result();
    box.innerHTML = `<p class="q-step">Pregunta ${i+1} de ${Q.length}</p><h3 class="q-q">${Q[i][0]}</h3><div class="q-opts">${Q[i][1].map(([t,v]) => `<button type="button" data-v="${v}">${t}</button>`).join('')}</div>`;
    $$('button', box).forEach(b => b.addEventListener('click', () => { a[i] = b.dataset.v; step(i + 1); }));
  }
  function result(){
    let pack = a[0] === 'calma' ? 'brisa' : a[0] === 'fiesta' ? 'levante' : 'tramontana';
    if (a[1] === 'l') pack = 'tramontana';
    if (a[1] === 's' && pack === 'tramontana') pack = 'levante';
    const ex = new Set(({cer:[], ent:['chispas'], baile:['chispas'], fiesta:['bolas','co2']})[a[2]]);
    if (a[0] === 'show') ex.add('laser');
    const s = {sesion:true, ceremonia:a[2] === 'cer' || a[0] === 'calma', coctel:a[0] === 'calma' ? 'playlist' : 'dj', hours:a[0] === 'show' ? 1 : 0, led:BIG.includes(pack) && a[0] === 'show' ? 4 : 0};
    const name = a[0] === 'show' ? 'La boda festival' : {brisa:'La boda elegante', levante:'La boda fiestera', tramontana:'La boda a lo grande'}[pack];
    const desc = {brisa:'Cuidáis cada detalle y queréis que la música acompañe sin robar protagonismo.', levante:'Lo vuestro es la pista. Una cena bonita y después, que no se siente nadie.', tramontana:'Mucha gente y muchas ganas: sonido con pegada y un escenario que se nota.'}[pack];
    const descF = a[0] === 'show' ? 'Queréis que vuestra boda sea EL evento del año. Modo festival.' : desc;
    const items = ['Sesión NOR' + (s.hours ? ` + ${s.hours} h extra` : ''), s.ceremonia ? 'Ceremonia' : '', s.coctel === 'dj' ? 'Cóctel con DJ' : 'Cóctel playlist', `Escenario ${SETUPS[pack].name}`, s.led ? `Pantallas LED ${s.led} m²` : '', ...CFG_EX.filter(([k]) => ex.has(k)).map(([,t]) => t)].filter(Boolean);
    box.innerHTML = `<div class="q-res"><div><p class="q-step">Vuestro resultado</p><h3>${name}</h3><p>${descF}</p><ul>${items.map(t => `<li>${t}</li>`).join('')}</ul>
      <div class="acts"><a class="btn btn-gold" href="#monta" id="q-go">Ver mi montaje</a><button class="btn btn-line" type="button" id="q-again">Repetir test</button></div></div>
      <div class="stage" id="q-stage" role="img" aria-label="Vista previa de la boda recomendada"></div></div>`;
    const qs = $('#q-stage'); qs.innerHTML = stageHTML(W.a || W.b ? wNames().toUpperCase() : 'LOVE');
    qs.className = `stage p-${pack} ` + [...ex].map(x => 'x-' + x).join(' ') + (s.led ? ' x-pantallas' : '');
    $('#q-again').addEventListener('click', () => step(0));
    $('#q-go').addEventListener('click', () => { Object.assign(st, s, {type:'boda', pack, extras:new Set(ex), laserbar:false, beams:false}); if (W.a || W.b){ st.text = wNames().toUpperCase(); $('#b-text').value = st.text; } renderStage(); });
  }
  step(0);
})();

/* ---------- Contacto ---------- */
const CARD_IC = {wa:'<path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2.1-5.4A8.4 8.4 0 1 1 21 11.5z"/>', tel:'<path d="M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7l.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4l2.7.7a2 2 0 0 1 1.7 2z"/>', mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>', ig:'<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/>', pin:'<path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>'};
const ci = k => `<span class="ic"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${CARD_IC[k]}</svg></span>`;
const cards = [
  ['wa','WhatsApp', CONFIG.whatsapp ? '+' + CONFIG.whatsapp : '[Tu WhatsApp]', CONFIG.whatsapp ? `https://wa.me/${CONFIG.whatsapp}` : ''],
  ['tel','Teléfono', CONFIG.phone || '[Tu teléfono]', CONFIG.phone ? 'tel:' + CONFIG.phone.replace(/\s/g,'') : ''],
  ['mail','Email', CONFIG.email || '[Tu email]', CONFIG.email ? 'mailto:' + CONFIG.email : ''],
  ['ig','Instagram', CONFIG.instagram ? '@' + CONFIG.instagram : '[Tu Instagram]', CONFIG.instagram ? `https://instagram.com/${CONFIG.instagram}` : ''],
  ['pin','Zona', CONFIG.zone, '']
];
$('#cards').innerHTML = cards.map(([k,l,v,h]) => h ? `<a class="cc" href="${h}" target="_blank" rel="noopener">${ci(k)}<span><small>${l}</small><b>${esc(v)}</b></span></a>` : `<div class="cc">${ci(k)}<span><small>${l}</small><b>${esc(v)}</b></span></div>`).join('');
$('#form').addEventListener('submit', e => {
  e.preventDefault();
  const v = id => $(id).value.trim(), box = $('#c-msg');
  const show = (cls, html) => box.innerHTML = `<div class="msg ${cls}">${html}</div>`;
  if (!v('#c-n')) return show('err', 'Escribe tu nombre.');
  if (!v('#c-t')) return show('err', 'Déjanos un teléfono para contactarte.');
  if (!$('#c-ok').checked) return show('err', 'Marca la casilla para poder responderte.');
  const text = `Hola NOR Eventos, quiero presupuesto:\nNombre: ${v('#c-n')}\nTeléfono: ${v('#c-t')}\nEvento: ${v('#c-type')}${v('#c-d') ? `\nFecha: ${v('#c-d')}` : ''}${v('#c-l') ? `\nLugar: ${v('#c-l')}` : ''}${v('#c-g') ? `\nInvitados: ${v('#c-g')}` : ''}${v('#c-m') ? `\n${v('#c-m')}` : ''}`;
  if (CONFIG.whatsapp) return show('ok', `Todo listo. <a href="https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}" target="_blank" rel="noopener">Pulsa aquí para enviarlo por WhatsApp</a>.`);
  if (CONFIG.email) return show('ok', `Todo listo. <a href="mailto:${CONFIG.email}?subject=${encodeURIComponent('Presupuesto evento')}&body=${encodeURIComponent(text)}">Pulsa aquí para enviarlo por email</a>.`);
  show('ok', 'Solicitud preparada. (Falta conectar el WhatsApp o email de NOR para enviarla.)');
});

/* ---------- Páginas ---------- */
const views = $$('[data-view]');
const TITLES = {inicio:'NOR Eventos', catalogo:'Catálogo · NOR Eventos', bodas:'Bodas · NOR Eventos', monta:'Monta tu evento · NOR Eventos', contacto:'Contacto · NOR Eventos'};
function route(){
  let id = location.hash.slice(1);
  if (!views.some(v => v.dataset.view === id)) id = 'inicio';
  views.forEach(v => v.hidden = v.dataset.view !== id);
  $$('[data-nav]').forEach(a => a.dataset.nav === id ? a.setAttribute('aria-current','page') : a.removeAttribute('aria-current'));
  document.title = TITLES[id];
  scrollTo({top:0, behavior:'instant'});
}
addEventListener('hashchange', route); route();
$$('.year').forEach(el => el.textContent = new Date().getFullYear());
