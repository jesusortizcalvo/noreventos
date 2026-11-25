/* Desvelo · scripts */

/* ====== CONFIGURACIÓN: rellenar cuando estén los datos ====== */
const CONFIG = {
  whatsapp: '',     // ej. '34600000000' (sin + ni espacios)
  phone: '',        // ej. '600 000 000'
  email: '',        // ej. 'hola@desvelo.es'
  instagram: '',    // ej. 'desvelo'
  zone: 'Santander · Cantabria'
};

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const B = document.body.dataset;
const U = p => (B.base || '/') + p + (B.idx ? (p ? B.idx : 'index.html') : '');
const IMG = f => (B.base || '/') + 'img/' + f;
const SS = {get(k){ try { return JSON.parse(sessionStorage.getItem(k)); } catch(e){ return null; } }, set(k,v){ try { sessionStorage.setItem(k, JSON.stringify(v)); } catch(e){} }, del(k){ try { sessionStorage.removeItem(k); } catch(e){} }};
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

/* ===================== INTRO: la novia se levanta el velo ===================== */
const hero = $('#hero'), intro = $('#intro');
if (hero) {
  const open = () => hero.classList.add('open');
  if (!intro || reduce || SS.get('dv-intro')) { intro && intro.remove(); open(); }
  else {
    document.documentElement.classList.add('intro-on');
    let done = false;
    const finish = () => {
      if (done) return; done = true; SS.set('dv-intro', 1);
      intro.classList.add('out'); open();
      document.documentElement.classList.remove('intro-on');
      setTimeout(() => intro.remove(), 1500);
    };
    requestAnimationFrame(() => intro.classList.add('play'));
    const t = setTimeout(finish, 4600);
    $('#intro-skip').addEventListener('click', () => { clearTimeout(t); finish(); });
    intro.addEventListener('click', e => { if (e.target.id !== 'intro-skip') { clearTimeout(t); finish(); } });
  }
}

/* ===================== LA BODA, HORA A HORA ===================== */
const night = $('#night');
if (night) {
  const H = (h, m = 0) => h * 60 + m;
  const MODES = {
    dia: {min:H(12,30), max:H(26), start:H(13), party:H(19), label:'Ver el día entero',
      sky:[[H(12,30),[239,233,223]],[H(18),[234,216,192]],[H(20,30),[214,150,104]],[H(21,30),[120,62,40]],[H(22,30),[24,18,15]],[H(26),[12,11,10]]],
      sunset:true,
      mom:[[H(13),'Ceremonia.','Micros para quien oficia y para las lecturas. La entrada, los anillos y la salida, cada uno con su música.'],
           [H(14),'Cóctel.','Lista a medida o DJ en directo. Que se note la fiesta sin tener que levantar la voz.'],
           [H(15,30),'Banquete.','Entrada al salón con vuestra canción. Discursos que se oyen hasta en la última mesa.'],
           [H(18,30),'Primer baile.','Un foco para vosotros, humo a ras de suelo y chispas en el momento justo.'],
           [H(19),'La fiesta.','Empieza la sesión. La pista se llena y ya no se vacía.'],
           [H(21,45),'Se hace de noche.','Se encienden las luces del escenario. La boda cambia de piel.'],
           [H(25,30),'La última.','La elegís vosotros.']]},
    noche: {min:H(18), max:H(30,30), start:H(19), party:H(0+24,15), label:'Ver la noche entera',
      sky:[[H(18),[214,150,104]],[H(19,30),[120,62,40]],[H(21),[34,20,16]],[H(22,30),[12,11,10]],[H(28,30),[12,11,10]],[H(29,30),[52,36,40]],[H(30,30),[226,176,138]]],
      sunset:false,
      mom:[[H(19),'Ceremonia.','Al atardecer. Micros abiertos y la entrada que lleváis meses imaginando.'],
           [H(20),'Cóctel.','La música acompaña la conversación. Todavía no manda.'],
           [H(21,30),'Banquete.','Entrada al salón, discursos y algún que otro llanto. Cada momento, a tiempo.'],
           [H(24),'Primer baile.','Se apaga el salón. Solo vosotros, un foco y humo a ras de suelo.'],
           [H(24,15),'La fiesta.','Empieza la sesión. Desde aquí, la noche es de la pista.'],
           [H(28,30),'La última.','La elegís vosotros.'],
           [H(30),'Amanece.','Y todavía queda alguien en la pista.']]}
  };
  let M = MODES.dia;
  const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
  const sky = m => { const S = M.sky; for (let i = 1; i < S.length; i++) if (m <= S[i][0]) { const [a, ca] = S[i-1], [b, cb] = S[i]; return mix(ca, cb, (m - a) / (b - a)); } return S[S.length-1][1]; };
  const inp = $('#n-range'), clk = $('#n-clock'), mom = $('#n-moment'), sub = $('#n-sub'), hrs = $('#n-hours'), pbtn = $('#n-play');
  const fmt = m => String(Math.floor(m / 60) % 24).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0');
  function render(){
    const m = +inp.value, c = sky(m), lum = (c[0]*299 + c[1]*587 + c[2]*114) / 1000, light = lum > 150;
    night.style.setProperty('--sky', `rgb(${c})`);
    night.style.setProperty('--fg', light ? '#0C0B0A' : '#EFE9DF');
    night.style.setProperty('--fg2', light ? '#3A342D' : '#CFC7BA');
    night.style.setProperty('--stars', clamp((140 - lum) / 120, 0, 1).toFixed(2));
    night.style.setProperty('--sun', (M.sunset ? clamp((m - H(17)) / H(4,30), 0, 1) : clamp(1 - (m - H(29)) / 90, 0, 1)).toFixed(2));
    clk.textContent = fmt(m);
    let cur = M.mom[0]; M.mom.forEach(x => { if (m >= x[0]) cur = x; });
    if (mom.dataset.k !== cur[1]) { mom.dataset.k = cur[1]; mom.textContent = cur[1]; sub.textContent = cur[2]; }
    hrs.textContent = String(Math.round(Math.max(0, m - M.party) / 30) / 2).replace('.', ',');
    inp.style.setProperty('--p', ((m - inp.min) / (inp.max - inp.min) * 100) + '%');
    inp.setAttribute('aria-valuetext', `${clk.textContent}. ${cur[1]}`);
  }
  function setMode(k){
    stop(); M = MODES[k]; inp.min = M.min; inp.max = M.max; inp.value = M.start;
    $('#n-ticks').innerHTML = M.mom.map(x => `<button type="button" data-m="${x[0]}">${fmt(x[0])}</button>`).join('');
    $$('#n-ticks button').forEach(b => b.addEventListener('click', () => { stop(); inp.value = b.dataset.m; render(); }));
    $$('.daynight button').forEach(b => b.setAttribute('aria-pressed', b.dataset.mode === k));
    $('label[for="n-range"]').textContent = k === 'dia' ? 'Arrastrad el día' : 'Arrastrad la noche';
    pbtn.textContent = M.label; render();
  }
  let raf = 0;
  function stop(){ cancelAnimationFrame(raf); raf = 0; pbtn.textContent = M.label; }
  inp.addEventListener('input', () => { stop(); render(); });
  $$('.daynight button').forEach(b => b.addEventListener('click', () => setMode(b.dataset.mode)));
  pbtn.addEventListener('click', () => {
    if (raf) return stop();
    if (+inp.value >= +inp.max) inp.value = inp.min;
    pbtn.textContent = 'Pausa';
    let last = performance.now();
    const tick = t => { const v = +inp.value + (t - last) * .06; last = t; inp.value = Math.min(v, +inp.max); render(); if (+inp.value < +inp.max) raf = requestAnimationFrame(tick); else stop(); };
    raf = requestAnimationFrame(tick);
  });
  setMode('dia');
}

/* ===================== ESCENARIOS ===================== */
const SETUPS = {
  velada:{name:'Velada', tag:'Para empezar bien', for:'Fiestas, cumpleaños y bodas pequeñas. Sonido limpio y luz con ritmo.',
    sonido:['2 altavoces RCF ART 715 · 15″','Soportes y micrófono inalámbrico'], luz:['2 cabezas móviles beam','2 barras LED','Máquina de humo','Luz sincronizada con la música'], est:['Cabina DJ','Puente de luces 3 m']},
  madrugada:{name:'Madrugada', tag:'Hasta que se haga de día', for:'Hasta 150 invitados. Entra el subgrave y la pista empieza a temblar.',
    sonido:['2 altavoces RCF ART 715 · 15″','Subwoofer RCF 708 · 18″','Micrófono inalámbrico'], luz:['4 cabezas móviles beam','2 paneles matrix','Láser','4 barras LED','Máquina de humo','Técnico de luces'], est:['Cabina DJ','Puente de luces 3 m']},
  amanecer:{name:'Amanecer', tag:'Todo, a la vez', for:'Más de 150 invitados y espacios grandes. Todo nuestro equipo, encendido.',
    sonido:['2 altavoces RCF ART 715 · 15″','Subwoofer RCF 708 · 18″','Micrófono inalámbrico'], luz:['2 beams de 230 W + 4 beams','2 paneles matrix','Láser','4 barras LED','Máquina de humo','Técnico de luces'], est:['Cabina DJ con tótem','Tarima 2 × 2 m','Puente de luces 3 m']}
};
const SMALL = ['velada'], MID = ['velada','madrugada'], BIG = ['amanecer'];
const VISUAL = [
  ['bolas','Bolas de espejos','Brillo clásico sobre la pista. Elegantes y muy fotogénicas.'],
  ['laser','Láser','Haces finos sincronizados con la música para los momentos altos.'],
  ['chispas','Fuego frío','Chispas para la entrada o el primer baile. Todo el impacto, sin humo ni riesgo.'],
  ['reel','Aftermovie','Lo mejor de la noche en un vídeo de un minuto, listo para compartir.']
];
const OTHERS = [
  ['co2','Cañón de CO₂','Chorros blancos en lo más alto de la fiesta.'],
  ['grupo','Sonido para grupo en directo','Según el rider técnico de la banda.'],
  ['proy','Proyector y pantalla','Para vídeos, fotos o discursos con apoyo.'],
  ['palos','Palos LED','Para repartir en la pista cuando todo sube.'],
  ['tarima','Tarima','Para elevar al grupo, la cabina o los discursos.'],
  ['km','Vamos donde estéis','En Cantabria y fuera. Contadnos dónde es.'],
  ['bengala','Humo de color','Para las fotos de salida.'],
  ['pausa','Pausa de cabina','Si actúa un grupo, os dejamos el escenario.'],
  ['dj-ext','Técnico para DJ externo','Si pincha alguien de fuera, nosotros nos ocupamos del equipo.']
];
const ADDONS = [['laserbar','Láser','El láser de Madrugada y Amanecer, también en Velada.','Para Velada'],['beams','Beams de 230 W','Haces más potentes y nítidos que cruzan todo el salón.','Velada · Madrugada'],['led','Pantallas LED','Módulos de 0,5 × 0,5 m, de 2 a 7 m², a la medida del espacio.','Amanecer']];

function stageHTML(text){
  let sp = ''; for (let i = 0; i < 14; i++) sp += `<i style="--sx:${(Math.random()*40-20).toFixed(0)}px;animation-delay:${(Math.random()*1.1).toFixed(2)}s"></i>`;
  const lz = side => [...Array(6)].map((_,i) => `<i style="--a:${side * (8 + i * 9)}deg;animation-delay:${-i*.3}s"></i>`).join('');
  const beams = [12,30,58,76].map((x,i) => `<div class="st-beam b${i}" style="left:${x}%;animation-delay:${-i*.7}s"></div>`).join('');
  return `<div class="st-dots"></div><div class="st-ball"></div>
    <div class="st-truss"></div>${beams}<div class="st-blinder l"></div><div class="st-blinder r"></div>
    <div class="st-screen l"><span class="txt"></span></div><div class="st-screen c"><span class="txt">${esc(text)}</span></div><div class="st-screen r"><span class="txt"></span></div>
    <div class="st-floor"></div><div class="st-tarima"></div><div class="st-bars">${[8,18,76,86].map(x => `<i style="left:${x}%"></i>`).join('')}</div><div class="st-sub"></div><div class="st-totem l"></div><div class="st-totem r"></div>
    <div class="st-laser l">${lz(-1)}</div><div class="st-laser r">${lz(1)}</div>
    <div class="st-speaker l"></div><div class="st-speaker r"></div>
    <div class="st-dj"><svg viewBox="0 0 60 70" aria-hidden="true"><g fill="#070605"><circle cx="30" cy="14" r="10"/><path d="M12 70c0-22 6-40 18-40s18 18 18 40z"/><path d="M14 44 4 30M46 44l10-14" stroke="#070605" stroke-width="7" stroke-linecap="round"/></g></svg></div><div class="st-booth"><span class="bt"></span></div><div class="st-mic"></div>
    <div class="st-proj"><span></span></div><div class="st-cock"><svg viewBox="0 0 60 60" aria-hidden="true"><path d="M8 28h44M30 28v30M18 58h24" stroke="#5A544C" stroke-width="3" fill="none"/><path d="M14 10l6 10 6-10z" fill="#EFE9DF"/><path d="M20 20v8" stroke="#ccc" stroke-width="1.5"/><path d="M34 6l6 12 6-12z" fill="#E1261C"/><path d="M40 18v10" stroke="#ccc" stroke-width="1.5"/></svg></div><div class="st-spark l">${sp}</div><div class="st-spark r">${sp}</div>
    <div class="st-co2 l"></div><div class="st-co2 r"></div>
    <div class="st-photo"></div><div class="st-fog"></div><div class="st-glow"></div>`;
}
function miniStage(el, cls, text){ el.innerHTML = `<div class="stage ${cls}" style="position:absolute;inset:0;border:0">${stageHTML(text || 'DESVELO')}</div>`; }

const li = a => a.map(x => `<li>${x}</li>`).join('');
if ($('#setups')) {
  $('#setups').innerHTML = Object.entries(SETUPS).map(([k,s]) => `
  <article class="pack"><div class="mini" data-mini="p-${k}"></div><div class="body">
    <span class="tag">${s.tag}</span><h3>${s.name}</h3><p class="for">${s.for}</p>
    <div class="spec"><div><h4>Sonido</h4><ul>${li(s.sonido)}</ul></div><div><h4>Luz</h4><ul>${li(s.luz)}</ul></div><div><h4>Estructura</h4><ul>${li(s.est)}</ul></div></div>
    <div class="foot-p"><p>Transporte, montaje y desmontaje incluidos.</p><a class="btn btn-line" href="${U('tu-noche/')}?pack=${k}" aria-label="Diseñar mi noche con ${s.name}">Elegir</a></div>
  </div></article>`).join('');
  $$('[data-mini]').forEach(m => miniStage(m, m.dataset.mini + ' x-dj' + (m.dataset.mini === 'p-amanecer' ? ' x-pantallas' : '')));
  $('#addons').innerHTML = ADDONS.map(([k,t,d,f]) => `<article class="ex"><span class="for">${f}</span><h3>${t}</h3><p>${d}</p></article>`).join('');
  $('#visual').innerHTML = VISUAL.map(([k,t,d]) => `<article class="ex"><h3>${t}</h3><p>${d}</p></article>`).join('');
  $('#others').innerHTML = OTHERS.map(([k,t,d]) => `<article class="ex"><h3>${t}</h3><p>${d}</p></article>`).join('');
}

/* ===================== TU NOCHE (configurador) ===================== */
const TYPES = {boda:['Boda','VUESTROS NOMBRES'], cumple:['Cumpleaños','FELIZ 30'], empresa:['Evento de empresa','TU MARCA'], fiesta:['Fiesta','DESVELO']};
const st = {type:'boda', pack:'madrugada', sesion:true, ceremonia:true, coctel:'', hours:0, laserbar:false, beams:false, led:0, extras:new Set(['chispas']), place:'', text:''};
const CFG_EX = [...VISUAL.map(([k,t]) => [k,t]), ['co2','Cañón de CO₂'], ['palos','Palos LED'], ['proy','Proyector y pantalla']];
const stage = $('#stage');
if (stage) {
  stage.innerHTML = stageHTML('');
  $('#g-pack').innerHTML = `<button type="button" data-v="none" aria-pressed="false">Sin escenario<small>Solo DJ</small></button>` + Object.entries(SETUPS).map(([k,s]) => `<button type="button" data-v="${k}" aria-pressed="false">${s.name}<small>${s.tag}</small></button>`).join('');
  $('#g-music').innerHTML = `<button type="button" class="tog" data-m="sesion"><span>La Sesión Desvelo<small>DJ · 4 h</small></span><i aria-hidden="true"></i></button><button type="button" class="tog" data-m="ceremonia"><span>Ceremonia<small>Micros y música</small></span><i aria-hidden="true"></i></button>`;
  $('#g-addon').innerHTML = `<button type="button" class="tog" data-a="laserbar"><span>Láser<small>Para Velada</small></span><i aria-hidden="true"></i></button><button type="button" class="tog" data-a="beams"><span>Beams de 230 W<small>Velada y Madrugada</small></span><i aria-hidden="true"></i></button>`;
  $('#g-extras').innerHTML = CFG_EX.map(([k,t]) => `<button type="button" class="tog" data-x="${k}"><span>${t}</span><i aria-hidden="true"></i></button>`).join('');

  const calc = () => {
    const L = [];
    if (st.sesion) L.push(`La Sesión Desvelo · ${4 + st.hours} h`);
    if (st.ceremonia) L.push('Música y micros para la ceremonia');
    if (st.coctel) L.push(st.coctel === 'dj' ? 'Cóctel con DJ' : 'Cóctel con lista a medida');
    if (st.pack !== 'none') L.push(`Escenario ${SETUPS[st.pack].name}`);
    if (st.laserbar && SMALL.includes(st.pack)) L.push('Láser');
    if (st.beams && MID.includes(st.pack)) L.push('Beams de 230 W');
    if (st.led && BIG.includes(st.pack)) L.push(`Pantallas LED · ${st.led} m²`);
    CFG_EX.forEach(([k,t]) => { if (st.extras.has(k)) L.push(t); });
    return L;
  };
  const renderStage = () => {
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
    $('.bt', stage).textContent = st.text || 'DESVELO';
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
    $('#bill').innerHTML = `<h4>Vuestra noche</h4>` + (L.length ? L.map(t => `<div><span>${esc(t)}</span></div>`).join('') : '<div><span>Elegid algo para empezar</span></div>')
      + `<p class="note">Os preparamos la propuesta a medida, sin compromiso.</p>`;
    renderStage.ready = true;
    stage.setAttribute('aria-label', `Vista previa: ${TYPES[st.type][0]}, ${st.pack === 'none' ? 'sin escenario' : 'escenario ' + SETUPS[st.pack].name}`);
  };
  $$('#g-type button').forEach(b => b.addEventListener('click', () => { st.type = b.dataset.v; renderStage(); }));
  $('#g-pack').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; st.pack = b.dataset.v; renderStage(); });
  $$('#g-coctel button').forEach(b => b.addEventListener('click', () => { st.coctel = b.dataset.v; renderStage(); }));
  $$('#g-music .tog').forEach(b => b.addEventListener('click', () => { st[b.dataset.m] = !st[b.dataset.m]; if (!st.sesion) st.hours = 0; renderStage(); }));
  $$('#g-addon .tog').forEach(b => b.addEventListener('click', () => { const k = b.dataset.a; st[k] = !st[k]; renderStage(); }));
  $$('#g-extras .tog').forEach(b => b.addEventListener('click', () => { const x = b.dataset.x; st.extras.has(x) ? st.extras.delete(x) : st.extras.add(x); renderStage(); }));
  $$('#q-hours button').forEach(b => b.addEventListener('click', () => { if (!st.sesion) return; st.hours = clamp(st.hours + +b.dataset.d, 0, 6); renderStage(); }));
  $$('#q-led button').forEach(b => b.addEventListener('click', () => { if (!BIG.includes(st.pack)) return; let v = st.led + +b.dataset.d; v = v < 2 ? (b.dataset.d > 0 ? 2 : 0) : Math.min(7, v); st.led = v; renderStage(); }));
  $('#b-text').addEventListener('input', e => { st.text = e.target.value.trim(); renderStage(); });
  $('#b-place').addEventListener('input', e => { st.place = e.target.value.trim(); });
  const q = new URLSearchParams(location.search);
  if (TYPES[q.get('tipo')]) st.type = q.get('tipo');
  if (SETUPS[q.get('pack')]) st.pack = q.get('pack');
  const fromQuiz = SS.get('dv-build');
  if (fromQuiz){ Object.assign(st, fromQuiz, {extras:new Set(fromQuiz.extras || [])}); if (st.text) $('#b-text').value = st.text; SS.del('dv-build'); }
  renderStage();
  $('#ask').addEventListener('click', () => {
    const L = calc();
    SS.set('dv-form', {type:TYPES[st.type][0], place:st.place, msg:`Nos interesa esta noche:\n${L.map(t => `· ${t}`).join('\n')}${st.text ? `\nTexto en pantallas: ${st.text}` : ''}`});
  });
}

/* ===================== BODAS: vuestro cartel ===================== */
const W = {a:'', b:'', date:'', place:'', style:'noche'};
const wNames = () => `${W.a || 'Ana'} & ${W.b || 'Javi'}`;
const fmtDate = d => new Date(d + 'T12:00:00').toLocaleDateString('es-ES', {weekday:'long', day:'numeric', month:'long', year:'numeric'});
const poster = $('#poster');
if (poster) {
  const ctx = poster.getContext('2d'), PW = 1080, PH = 1350;
  const pics = {};
  ['escena-luces.jpg','escena-amanecer.jpg'].forEach(f => { const i = new Image(); i.onload = draw; i.src = IMG(f); pics[f] = i; });
  function fitText(txt, font, max, start){ let s = start; do { ctx.font = font.replace('#', s); s -= 4; } while (ctx.measureText(txt).width > max && s > 40); return s + 4; }
  function cover(img, a = 1){ if (!img.complete || !img.naturalWidth) return; const r = Math.max(PW / img.naturalWidth, PH / img.naturalHeight), w = img.naturalWidth * r, h = img.naturalHeight * r; ctx.globalAlpha = a; ctx.drawImage(img, (PW - w) / 2, (PH - h) / 2, w, h); ctx.globalAlpha = 1; }
  function draw(){
    const S = W.style, dark = S !== 'velo';
    const bg = S === 'velo' ? '#EFE9DF' : '#0C0B0A', fg = dark ? '#EFE9DF' : '#0C0B0A', red = '#E1261C';
    ctx.fillStyle = bg; ctx.fillRect(0, 0, PW, PH);
    if (S === 'noche') { cover(pics['escena-luces.jpg'], .55); const g = ctx.createLinearGradient(0, 0, 0, PH); g.addColorStop(0, 'rgba(12,11,10,.2)'); g.addColorStop(.55, 'rgba(12,11,10,.55)'); g.addColorStop(1, 'rgba(12,11,10,.95)'); ctx.fillStyle = g; ctx.fillRect(0, 0, PW, PH); }
    if (S === 'alba') { cover(pics['escena-amanecer.jpg'], .95); const g = ctx.createLinearGradient(0, 0, 0, PH); g.addColorStop(0, 'rgba(12,11,10,.65)'); g.addColorStop(.5, 'rgba(12,11,10,.1)'); g.addColorStop(1, 'rgba(12,11,10,.85)'); ctx.fillStyle = g; ctx.fillRect(0, 0, PW, PH); }
    if (S === 'velo') { ctx.strokeStyle = 'rgba(120,100,80,.08)'; ctx.lineWidth = 1; for (let x = 0; x < PW; x += 6) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + 30, PH); ctx.stroke(); } }
    // marco
    ctx.strokeStyle = dark ? 'rgba(239,233,223,.35)' : 'rgba(12,11,10,.3)'; ctx.lineWidth = 2; ctx.strokeRect(48, 48, PW - 96, PH - 96);
    ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    // cabecera
    ctx.fillStyle = fg; ctx.font = '400 30px "Instrument Sans", sans-serif'; ctx.letterSpacing = '9px';
    ctx.fillText('DESVELO PRESENTA', PW / 2, 128); ctx.letterSpacing = '0px';
    // nombres
    const a = (W.a || 'Ana').toUpperCase(), b = (W.b || 'Javi').toUpperCase();
    const top = S === 'alba' ? 330 : 470;
    ctx.fillStyle = red;
    let s1 = fitText(a, '400 #px Anton, Impact, sans-serif', PW - 180, 300), s2 = fitText(b, '400 #px Anton, Impact, sans-serif', PW - 180, 300), s = Math.min(s1, s2);
    ctx.font = `400 ${s}px Anton, Impact, sans-serif`;
    ctx.fillText(a, PW / 2, top);
    ctx.fillStyle = fg; ctx.font = `italic 400 ${Math.round(s * .55)}px "Instrument Serif", Georgia, serif`;
    ctx.fillText('&', PW / 2, top + s * .62);
    ctx.fillStyle = red; ctx.font = `400 ${s}px Anton, Impact, sans-serif`;
    ctx.fillText(b, PW / 2, top + s * .62 + s * .92);
    // fecha y lugar
    const y0 = PH - 330;
    ctx.fillStyle = fg; ctx.font = 'italic 400 62px "Instrument Serif", Georgia, serif';
    ctx.fillText(W.date ? fmtDate(W.date) : 'La fecha, por decidir', PW / 2, y0, PW - 160);
    ctx.font = '600 28px "Instrument Sans", sans-serif'; ctx.letterSpacing = '7px';
    if (W.place) ctx.fillText(W.place.toUpperCase(), PW / 2, y0 + 64, PW - 160);
    ctx.letterSpacing = '0px';
    // pie
    ctx.fillStyle = dark ? 'rgba(239,233,223,.35)' : 'rgba(12,11,10,.3)'; ctx.fillRect(PW / 2 - 60, PH - 196, 120, 2);
    ctx.fillStyle = fg; ctx.font = 'italic 400 40px "Instrument Serif", Georgia, serif';
    ctx.fillText('La noche en la que nadie quiere irse a dormir.', PW / 2, PH - 130, PW - 160);
    ctx.font = '400 30px Anton, Impact, sans-serif'; ctx.letterSpacing = '10px'; ctx.fillStyle = red;
    ctx.fillText('DESVELO', PW / 2 + 5, PH - 76); ctx.letterSpacing = '0px';
    poster.setAttribute('aria-label', `Cartel: ${wNames()}${W.date ? ', ' + fmtDate(W.date) : ''}`);
  }
  function count(){
    const c = $('#w-count');
    if (!W.date){ c.textContent = (W.a || W.b) ? 'Ahora, vuestra fecha.' : 'Escribid vuestros nombres y vuestra fecha.'; return; }
    const d = Math.ceil((new Date(W.date + 'T12:00:00') - new Date()) / 864e5);
    if (d > 0) c.innerHTML = `Faltan <b>${d}</b> días. ${d > 120 ? 'Tiempo de sobra.' : d > 30 ? 'Aún llegáis. Reservad la fecha.' : 'Escribidnos hoy.'}`;
    else if (d === 0) c.innerHTML = 'Es hoy. <b>Enhorabuena.</b>';
    else c.textContent = 'Esa fecha ya ha pasado. ¿Seguro que es esa?';
  }
  const upd = () => { draw(); count(); };
  [['#w-a','a'],['#w-b','b'],['#w-date','date'],['#w-place','place']].forEach(([id,k]) => $(id).addEventListener('input', e => { W[k] = e.target.value.trim(); upd(); }));
  $$('#w-style button').forEach(b => b.addEventListener('click', () => { W.style = b.dataset.s; $$('#w-style button').forEach(x => x.setAttribute('aria-pressed', x === b)); draw(); }));
  $('#w-dl').addEventListener('click', () => {
    draw();
    const a = document.createElement('a');
    a.download = `desvelo-${(W.a || 'ana')}-${(W.b || 'javi')}.png`.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9.-]+/g, '-');
    try { a.href = poster.toDataURL('image/png'); a.click(); } catch (e) {}
  });
  const reserve = () => SS.set('dv-form', {type:'Boda', date:W.date, name:W.a, place:W.place, msg:`Hola, somos ${wNames()} y nos casamos${W.date ? ' el ' + fmtDate(W.date) : ''}${W.place ? ' en ' + W.place : ''}. Queremos reservar fecha.`});
  $$('[data-reserve]').forEach(x => x.addEventListener('click', reserve));
  (document.fonts ? Promise.all(['400 100px Anton','italic 400 60px "Instrument Serif"','600 28px "Instrument Sans"'].map(f => document.fonts.load(f))).catch(() => {}) : Promise.resolve()).then(upd);
  upd();
}

/* ===================== BODAS: test ===================== */
if ($('#quiz')) (function(){
  const Q = [
    ['¿Cómo os imagináis el final de la noche?', [['Sobremesa larga con los nuestros','calma'],['Bailando hasta que nos echen','fiesta'],['Que se hable de ella durante años','show']]],
    ['¿Cuántos invitados seréis?', [['Pocos y de verdad','s'],['Hasta unos 150','m'],['Más de 150','l']]],
    ['¿Qué momento os hace más ilusión?', [['La ceremonia','cer'],['La entrada al banquete','ent'],['El primer baile','baile'],['La fiesta','fiesta']]]
  ];
  const box = $('#quiz'); const a = [];
  function step(i){
    if (i >= Q.length) return result();
    box.innerHTML = `<p class="q-step">${i+1} / ${Q.length}</p><h3 class="q-q">${Q[i][0]}</h3><div class="q-opts">${Q[i][1].map(([t,v]) => `<button type="button" data-v="${v}">${t}</button>`).join('')}</div>`;
    $$('button', box).forEach(b => b.addEventListener('click', () => { a[i] = b.dataset.v; step(i + 1); }));
    if (i) $('.q-opts button', box).focus({preventScroll:true});
  }
  function result(){
    let pack = a[0] === 'calma' ? 'velada' : a[0] === 'fiesta' ? 'madrugada' : 'amanecer';
    if (a[1] === 'l') pack = 'amanecer';
    if (a[1] === 's' && pack === 'amanecer') pack = 'madrugada';
    const ex = new Set(({cer:[], ent:['chispas'], baile:['chispas'], fiesta:['bolas','co2']})[a[2]]);
    if (a[0] === 'show') ex.add('laser');
    const s = {sesion:true, ceremonia:a[2] === 'cer' || a[0] === 'calma', coctel:a[0] === 'calma' ? 'playlist' : 'dj', hours:a[0] === 'show' ? 1 : 0, led:BIG.includes(pack) && a[0] === 'show' ? 4 : 0};
    const name = {velada:'Sois <span class="it">velada</span>', madrugada:'Sois <span class="it">madrugada</span>', amanecer:'Sois <span class="it">amanecer</span>'}[pack];
    const desc = {velada:'Cuidáis cada detalle. La música acompaña sin robar protagonismo, y la fiesta llega cuando tiene que llegar.', madrugada:'Lo vuestro es la pista. Una cena bonita y después, que no se siente nadie.', amanecer:'Mucha gente y muchas ganas. Vuestra boda va a terminar con luz de día.'}[pack];
    const items = ['La Sesión Desvelo' + (s.hours ? ` + ${s.hours} h` : ''), s.ceremonia ? 'Ceremonia' : '', s.coctel === 'dj' ? 'Cóctel con DJ' : 'Cóctel con lista a medida', `Escenario ${SETUPS[pack].name}`, s.led ? `Pantallas LED ${s.led} m²` : '', ...CFG_EX.filter(([k]) => ex.has(k)).map(([,t]) => t)].filter(Boolean);
    box.innerHTML = `<div class="q-res"><div><p class="q-step">Vuestro resultado</p><h3>${name}</h3><p>${desc}</p><ul>${items.map(t => `<li>${t}</li>`).join('')}</ul>
      <div class="acts2"><a class="btn btn-red" href="${U('tu-noche/')}" id="q-go">Ver vuestra noche</a><button class="btn btn-line" type="button" id="q-again">Repetir</button></div></div>
      <div class="stage" id="q-stage" role="img" aria-label="Vista previa de la noche recomendada"></div></div>`;
    const qs = $('#q-stage'); qs.innerHTML = stageHTML(W.a || W.b ? wNames().toUpperCase() : 'SÍ, QUIERO');
    qs.className = `stage p-${pack} x-dj ` + [...ex].map(x => 'x-' + x).join(' ') + (s.led ? ' x-pantallas' : '');
    $('#q-again').addEventListener('click', () => step(0));
    $('#q-go').addEventListener('click', () => SS.set('dv-build', Object.assign({}, s, {type:'boda', pack, extras:[...ex], laserbar:false, beams:false, text:(W.a || W.b) ? wNames().toUpperCase() : ''})));
  }
  step(0);
})();

/* ===================== CONTACTO ===================== */
const CARD_IC = {wa:'<path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2.1-5.4A8.4 8.4 0 1 1 21 11.5z"/>', tel:'<path d="M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7l.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4l2.7.7a2 2 0 0 1 1.7 2z"/>', mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>', ig:'<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/>', pin:'<path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>'};
const ci = k => `<span class="ic"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${CARD_IC[k]}</svg></span>`;
if ($('#form')) {
  const cards = [
    ['wa','WhatsApp', CONFIG.whatsapp ? '+' + CONFIG.whatsapp : '[Vuestro WhatsApp]', CONFIG.whatsapp ? `https://wa.me/${CONFIG.whatsapp}` : ''],
    ['tel','Teléfono', CONFIG.phone || '[Vuestro teléfono]', CONFIG.phone ? 'tel:' + CONFIG.phone.replace(/\s/g,'') : ''],
    ['mail','Email', CONFIG.email || '[Vuestro email]', CONFIG.email ? 'mailto:' + CONFIG.email : ''],
    ['ig','Instagram', CONFIG.instagram ? '@' + CONFIG.instagram : '[Vuestro Instagram]', CONFIG.instagram ? `https://instagram.com/${CONFIG.instagram}` : ''],
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
    const text = `Hola, Desvelo. Queremos propuesta:\nNombre: ${v('#c-n')}\nTeléfono: ${v('#c-t')}\nEvento: ${v('#c-type')}${v('#c-d') ? `\nFecha: ${v('#c-d')}` : ''}${v('#c-l') ? `\nLugar: ${v('#c-l')}` : ''}${v('#c-g') ? `\nInvitados: ${v('#c-g')}` : ''}${v('#c-m') ? `\n${v('#c-m')}` : ''}`;
    if (CONFIG.whatsapp) return show('ok', `Todo listo. <a href="https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}" target="_blank" rel="noopener">Pulsa aquí para enviarlo por WhatsApp</a>.`);
    if (CONFIG.email) return show('ok', `Todo listo. <a href="mailto:${CONFIG.email}?subject=${encodeURIComponent('Propuesta Desvelo')}&body=${encodeURIComponent(text)}">Pulsa aquí para enviarlo por email</a>.`);
    show('ok', 'Solicitud preparada. (Falta conectar el WhatsApp o el email de Desvelo para enviarla.)');
  });
  const pre = SS.get('dv-form');
  if (pre){
    if (pre.type) $('#c-type').value = pre.type;
    if (pre.date) $('#c-d').value = pre.date;
    if (pre.name) $('#c-n').value = pre.name;
    if (pre.place) $('#c-l').value = pre.place;
    if (pre.msg) $('#c-m').value = pre.msg;
    SS.del('dv-form');
  }
}

/* ===================== común ===================== */
$$('[data-nav]').forEach(a => a.dataset.nav === B.page ? a.setAttribute('aria-current','page') : a.removeAttribute('aria-current'));
$$('.year').forEach(el => el.textContent = new Date().getFullYear());
const fab = $('.fab');
if (fab && (B.page === 'contacto' || B.page === 'monta')) fab.remove();
else if (fab && hero) { const f = () => fab.classList.toggle('off', !hero.classList.contains('open')); f(); new MutationObserver(f).observe(hero, {attributes:true, attributeFilter:['class']}); }
