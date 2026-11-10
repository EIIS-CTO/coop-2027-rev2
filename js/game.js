(function(){
  const { avatar, icon, portrait, SKIN, HAIRC, OUTFIT, HAIRS } = window.CL;
  const R = window.CLRooms;
  const root = document.getElementById('game');
  if (!root) return;

  const METERS = [
    { k:'energia', name:'Energia', ico:'bolt', col:'#E9B44C' },
    { k:'acqua', name:'Acqua', ico:'drop', col:'#5F9BBE' },
    { k:'rifiuti', name:'Rifiuti', ico:'recycle', col:'#7FA37A' },
    { k:'spesa', name:'Spesa', ico:'cart', col:'#D9734E' }
  ];
  const QUESTS = {
    living: [
      { id:'tv', ico:'tv', t:'Guarda la video lezione' },
      { id:'libreria', ico:'book', t:'Sfoglia una dispensa' },
      { id:'ciabatta', ico:'plug', t:'Caccia allo stand-by' },
      { id:'lampadina', ico:'sun', t:'Scegli la lampadina giusta' },
      { id:'termostato', ico:'thermo', t:'Regola il termostato' },
      { id:'cestino', ico:'recycle', t:'Il bidone giusto' }
    ],
    kitchen: [
      { id:'frigo', ico:'leaf', t:'Svuota-frigo con Paola' },
      { id:'dispensa', ico:'cart', t:'La spesa consapevole' }
    ]
  };
  const ROOMS = { living:{ name:'Salotto', theme:'Energia e lezioni' }, kitchen:{ name:'Cucina', theme:'Spesa e spreco' } };
  const START_METERS = { energia:30, acqua:35, rifiuti:25, spesa:30 };
  const UNLOCK_AT = 4, LEVEL_PTS = 120;

  const S = {
    name:'', skin:1, hair:'corti', hairColor:1, outfit:0,
    room:'living', pos:[4.2, 7.0], facing:1,
    meters:{ ...START_METERS }, points:0, done:{}, lamp:'inc', temp:23, doorOpen:false, badges:[], busy:false, finished:false, t0:0
  };

  const h = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
  const iconAt = (name, x, y, size, sw = 2.4) =>
    icon(name, sw).replace('<svg ', `<svg x="${x}" y="${y}" width="${size}" height="${size}" `);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ================= START ================= */
  function startScreen(){
    root.innerHTML = '';
    const el = h(`<div class="start">
      <div class="st-card">
        <div class="st-house" aria-hidden="true">${miniHouse()}</div>
        <div class="st-kicker">Demo giocabile</div>
        <h3>Casa Sostenibile</h3>
        <p class="st-sub">Salotto e cucina · circa 5 minuti</p>
        <ul class="st-how">
          <li>${icon('target', 2.2)}<span>Clicca sugli oggetti con il segnaposto</span></li>
          <li>${icon('star', 2.2)}<span>Completa le missioni e guadagna eco-punti</span></li>
          <li>${icon('door', 2.2)}<span>Sblocca la cucina dopo 4 missioni</span></li>
        </ul>
        <div class="st-load"><i></i></div>
        <button class="gbtn" id="gStart" disabled>${icon('play')} Inizia</button>
      </div></div>`);
    root.append(el);
    root.append(toolbar());
    const bar = el.querySelector('.st-load i'), go = el.querySelector('#gStart');
    let k = 0;
    const tick = () => { k = Math.min(1, k + .045 + Math.random() * .05); bar.style.transform = `scaleX(${k})`;
      if (k < 1) setTimeout(tick, reduced ? 0 : 55); else { el.querySelector('.st-load').classList.add('done'); go.disabled = false; go.focus({ preventScroll:true }); } };
    tick();
    go.onclick = creator;
  }

  function miniHouse(){
    return `<svg viewBox="-60 -62 120 92"><polygon points="0,-10 52,16 0,42 -52,16" fill="#E3B98A"/><polygon points="-52,16 0,-10 0,-58 -52,-32" fill="#EBCFAE"/><polygon points="0,-10 52,16 52,-32 0,-58" fill="#F6E5CC"/>
      <polygon points="14,-3 30,5 30,-14 14,-22" fill="#9CC5D9" stroke="#fff" stroke-width="2"/><polygon points="-38,9 -26,3 -26,-6 -38,0" fill="#2E2C34"/>
      <polygon points="-8,18 14,29 26,23 4,12" fill="#E9B44C"/><polygon points="8,20 24,28 24,18 8,10" fill="#D9734E"/></svg>`;
  }

  function toolbar(){
    const el = h(`<div class="tools">
      <button class="tool" data-t="help" aria-label="Come si gioca" title="Come si gioca">${icon('book', 2.2)}</button>
      <button class="tool" data-t="restart" aria-label="Ricomincia" title="Ricomincia">${icon('home', 2.2)}</button>
      <button class="tool" data-t="fs" aria-label="Schermo intero" title="Schermo intero">${fsIcon(false)}</button></div>`);
    el.onclick = e => {
      const b = e.target.closest('[data-t]'); if (!b) return;
      if (b.dataset.t === 'fs') toggleFs();
      if (b.dataset.t === 'help') helpModal();
      if (b.dataset.t === 'restart') { if (!root.querySelector('.stage')) return; confirmRestart(); }
    };
    return el;
  }
  const fsIcon = on => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${on
    ? '<path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/>' : '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>'}</svg>`;
  function toggleFs(){
    const frame = root.closest('.game-frame') || root;
    if (document.fullscreenElement) document.exitFullscreen();
    else if (frame.requestFullscreen) frame.requestFullscreen().catch(() => {});
  }
  document.addEventListener('fullscreenchange', () => {
    const b = root.querySelector('[data-t="fs"]'); if (b) b.innerHTML = fsIcon(!!document.fullscreenElement);
    (root.closest('.game-frame') || root).classList.toggle('is-fs', !!document.fullscreenElement);
  });

  /* ================= CREATOR ================= */
  function creator(){
    root.innerHTML = '';
    const el = h(`<div class="creator">
      <div class="cr-title">${icon('users', 2.2)} Crea il tuo personaggio</div>
      <div class="cr-prev">
        <svg viewBox="-110 -215 220 275" id="crSvg"></svg>
        <div class="cr-name" id="crName">&nbsp;</div>
      </div>
      <div class="cr-panel">
        <h3>Chi abita qui?</h3>
        <p>Cinque scelte e sei pronto a entrare.</p>
        <div class="cr-row"><label>Carnagione</label><div class="sw" data-k="skin"></div></div>
        <div class="cr-row"><label>Capelli</label><div class="sw txt" data-k="hair"></div></div>
        <div class="cr-row"><label>Colore dei capelli</label><div class="sw" data-k="hairColor"></div></div>
        <div class="cr-row"><label>Colore dei vestiti</label><div class="sw" data-k="outfit"></div></div>
        <div class="cr-row"><label for="crIn">Nome</label><input id="crIn" maxlength="14" placeholder="Come ti chiami?" autocomplete="off"></div>
        <div class="cr-foot"><button class="gbtn sec" id="crRnd">${icon('star', 2.2)} A caso</button><button class="gbtn" id="crGo" disabled>Entra in casa ${icon('door')}</button></div>
      </div></div>`);
    root.append(el);
    root.append(toolbar());
    const opts = { skin:SKIN, hairColor:HAIRC, outfit:OUTFIT };
    el.querySelectorAll('.sw').forEach(sw => {
      const k = sw.dataset.k;
      if (k === 'hair') sw.innerHTML = HAIRS.map(v => `<button data-v="${v}" aria-pressed="false">${v}</button>`).join('');
      else sw.innerHTML = opts[k].map((c, i) => `<button data-v="${i}" style="background:${c}" aria-label="${k} ${i + 1}" aria-pressed="false"></button>`).join('');
      sw.onclick = e => {
        const b = e.target.closest('button'); if (!b) return;
        S[k] = k === 'hair' ? b.dataset.v : +b.dataset.v;
        paint(true);
      };
    });
    const input = el.querySelector('#crIn'), go = el.querySelector('#crGo');
    input.value = S.name;
    input.oninput = () => { S.name = input.value.trim(); paint(); };
    input.onkeydown = e => { if (e.key === 'Enter' && S.name) enterHouse(); };
    go.onclick = enterHouse;
    el.querySelector('#crRnd').onclick = () => {
      const pick = n => Math.floor(Math.random() * n);
      Object.assign(S, { skin:pick(SKIN.length), hair:HAIRS[pick(HAIRS.length)], hairColor:pick(HAIRC.length), outfit:pick(OUTFIT.length) });
      paint(true);
    };
    function paint(bounce){
      el.querySelectorAll('.sw').forEach(sw => sw.querySelectorAll('button').forEach(b => {
        const on = String(S[sw.dataset.k]) === b.dataset.v;
        b.classList.toggle('on', on); b.setAttribute('aria-pressed', on);
      }));
      el.querySelector('#crSvg').innerHTML =
        `<ellipse cx="0" cy="0" rx="98" ry="50" fill="#FFE2A8" opacity=".5"/>
         <polygon points="0,-30 95,18 0,66 -95,18" transform="translate(0,-18)" fill="#E3B98A" stroke="#C99A6A" stroke-width="2"/>
         <polygon points="0,-18 70,17 0,52 -70,17" transform="translate(0,-18)" fill="none" stroke="#F0CFA4" stroke-width="2"/>
         <g class="av${bounce && !reduced ? ' hop' : ''}" transform="translate(0,4) scale(1.55)">${avatar(S)}</g>`;
      el.querySelector('#crName').textContent = S.name || ' ';
      go.disabled = !S.name;
    }
    paint();
    setTimeout(() => input.focus({ preventScroll:true }), 50);
  }

  /* ================= PLAY ================= */
  let stage, world, sceneG, avG, mkG, room, tip;

  function enterHouse(){
    if (!S.name) return;
    S.t0 = Date.now();
    root.innerHTML = '';
    root.append(h(`<svg class="stage" viewBox="${R.VIEW}" preserveAspectRatio="xMidYMid meet" role="application" aria-label="La casa: usa Tab per scegliere un oggetto e Invio per aprirlo">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8FBBD3"/><stop offset=".7" stop-color="#DCEBE9"/><stop offset="1" stop-color="#F6EBD3"/></linearGradient>
        <linearGradient id="scrIdle" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3D5A6C"/><stop offset="1" stop-color="#22303A"/></linearGradient>
        <linearGradient id="scrDone" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7FA37A"/><stop offset="1" stop-color="#4E7349"/></linearGradient>
        <linearGradient id="aoV" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5A3418" stop-opacity="0"/><stop offset="1" stop-color="#5A3418" stop-opacity=".16"/></linearGradient>
        <linearGradient id="aoH" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5A3418" stop-opacity=".14"/><stop offset="1" stop-color="#5A3418" stop-opacity="0"/></linearGradient>
        <linearGradient id="beam" x1="0" y1="0" x2=".35" y2="1"><stop offset="0" stop-color="#FFF3CC" stop-opacity=".34"/><stop offset="1" stop-color="#FFF3CC" stop-opacity=".02"/></linearGradient>
        <radialGradient id="gInc"><stop offset="0" stop-color="#FFB347" stop-opacity=".75"/><stop offset="1" stop-color="#FFB347" stop-opacity="0"/></radialGradient>
        <radialGradient id="gLed"><stop offset="0" stop-color="#FFF6DD" stop-opacity=".8"/><stop offset="1" stop-color="#FFF6DD" stop-opacity="0"/></radialGradient>
        <radialGradient id="pinGlow"><stop offset="0" stop-color="#FFFFFF" stop-opacity=".9"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></radialGradient>
        <filter id="soft" x="-20%" y="-40%" width="140%" height="180%"><feGaussianBlur stdDeviation="3.2"/></filter>
        <filter id="pinShadow" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#2B160A" flood-opacity=".35"/></filter>
      </defs>
      <g id="world"><ellipse cx="0" cy="210" rx="420" ry="120" fill="#000" opacity=".22" filter="url(#soft)"/><g id="sceneG"></g><g id="dustG"></g><g id="avG"></g><g id="mkG"></g></g></svg>`));
    root.append(h(`<div class="vignette" aria-hidden="true"></div>`));
    root.append(h(`<div class="hud">
      <div class="who"><div class="face" id="hFace"></div><div><b id="hName"></b><small><span id="hLvl"></span> · <span class="num" id="hPts">0</span> eco-punti</small></div></div>
      <div class="room-name" id="hRoom"></div>
      <div class="meters" id="hMeters"></div></div>`));
    root.append(h(`<div class="quests" id="hQuests"></div>`));
    root.append(h(`<div class="msgs" id="hMsgs" aria-live="polite"></div>`));
    root.append(h(`<div class="tip" id="hTip" role="tooltip"></div>`));
    root.append(h(`<div class="fade" id="hFade"><div class="room-card"><small id="hCardT"></small><b id="hCardN"></b></div></div>`));
    root.append(toolbar());
    stage = root.querySelector('.stage');
    world = stage.querySelector('#world');
    sceneG = stage.querySelector('#sceneG'); avG = stage.querySelector('#avG'); mkG = stage.querySelector('#mkG');
    tip = root.querySelector('#hTip');
    stage.addEventListener('click', onStageClick);
    stage.addEventListener('keydown', e => {
      if ((e.key === 'Enter' || e.key === ' ') && e.target.closest('[data-mk]')){ e.preventDefault(); activate(e.target.closest('[data-mk]').dataset.mk); }
    });
    stage.addEventListener('pointermove', onHover);
    stage.addEventListener('pointerleave', () => { tip.classList.remove('on'); world.style.transform = ''; });
    stage.addEventListener('focusin', e => { const m = e.target.closest('[data-mk]'); if (m) showTipFor(m.dataset.mk, m.getBoundingClientRect()); });
    stage.addEventListener('focusout', () => tip.classList.remove('on'));
    root.querySelector('#hQuests').addEventListener('click', e => {
      if (e.target.closest('.q-toggle')) return root.querySelector('#hQuests').classList.toggle('min');
      const li = e.target.closest('li[data-id]'); if (li) activate(li.dataset.id);
    });
    S.room = 'living';
    renderRoom(true);
    renderHud(true);
    if (!reduced){ world.classList.add('intro'); setTimeout(() => world.classList.remove('intro'), 1200); }
    setTimeout(() => msg('Maria', `Ciao ${esc(S.name)}, eccoti a casa. Clicca sugli oggetti con il segnaposto: ognuno nasconde un piccolo gesto che fa bene alla casa e al portafoglio.`), 900);
    setTimeout(() => msg('Roberto', 'Comincia dalla TV: c\'è la prima lezione. Dura meno di un caffè.'), 7500);
  }

  function renderRoom(placeAtSpawn){
    room = S.room === 'living' ? R.living(S) : R.kitchen(S);
    sceneG.innerHTML = room.svg;
    if (placeAtSpawn) S.pos = room.spawn.slice();
    drawAvatar();
    drawMarkers();
    root.querySelector('#hRoom').innerHTML = `<b>${ROOMS[S.room].name}</b><span>${ROOMS[S.room].theme}</span>`;
    renderQuests();
  }

  function drawAvatar(walking){
    const [x, y] = R.P(S.pos[0], S.pos[1], 0);
    avG.innerHTML = `<g class="av${walking ? ' walking' : ''}" transform="translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${S.facing},1)">${avatar(S)}</g>`;
  }

  function drawMarkers(){
    const next = nextQuest();
    mkG.innerHTML = room.markers.map(m => {
      const [x, y] = m.p;
      let col = '#D9734E', ic = m.ico, cls = '';
      if (m.door){
        const open = S.room === 'kitchen' || S.doorOpen;
        col = open ? '#E9B44C' : '#9A8676'; ic = open ? 'door' : 'lock'; cls = open ? ' door' : ' locked';
      } else if (S.done[m.id]){ col = '#5E8459'; ic = 'check'; cls = ' done'; }
      if (next && next.id === m.id) cls += ' next';
      const r = cls.includes('done') ? 13 : 17;
      const state = m.door ? (cls.includes('locked') ? 'chiusa' : 'aperta') : S.done[m.id] ? 'completata' : 'da fare';
      return `<g class="marker${cls}" data-mk="${m.id}" transform="translate(${x.toFixed(1)},${y.toFixed(1)})" tabindex="0" role="button" aria-label="${m.label}, ${state}">
        <g class="mk">
          ${cls.includes('done') || cls.includes('locked') ? '' : `<circle class="ripple" r="${r}" fill="none" stroke="${col}" stroke-width="2"/>`}
          <g filter="url(#pinShadow)"><path d="M-7 ${r - 4} L0 ${r + 5} L7 ${r - 4} Z" fill="${col}"/>
          <circle r="${r}" fill="${col}" stroke="#fff" stroke-width="3"/></g>
          <circle cx="-5" cy="-6" r="${r * .45}" fill="url(#pinGlow)" opacity=".35"/>
          ${iconAt(ic, -r * .6, -r * .6, r * 1.2)}
          <circle class="focus" r="${r + 6}" fill="none" stroke="#fff" stroke-width="2.5" stroke-dasharray="4 4"/>
        </g></g>`;
    }).join('');
    mkG.querySelectorAll('.marker svg').forEach(s => s.style.color = '#fff');
  }

  function nextQuest(){ return (QUESTS[S.room] || []).find(q => !S.done[q.id]); }

  function onStageClick(e){
    const mk = e.target.closest('[data-mk]');
    const hot = e.target.closest('[data-hot]');
    const id = mk ? mk.dataset.mk : hot ? hot.dataset.hot : null;
    if (id){ tip.classList.remove('on'); activate(id); }
  }

  /* ---------- hover: tooltip, gaze, parallax ---------- */
  function onHover(e){
    const rect = root.getBoundingClientRect();
    if (!reduced && !S.busy){
      const dx = (e.clientX - rect.left) / rect.width - .5, dy = (e.clientY - rect.top) / rect.height - .5;
      world.style.transform = `translate(${(-dx * 10).toFixed(1)}px, ${(-dy * 6).toFixed(1)}px)`;
    }
    const t = e.target.closest('[data-mk]') || e.target.closest('[data-hot]');
    if (!t){ tip.classList.remove('on'); stage.classList.remove('pointing'); return; }
    stage.classList.add('pointing');
    const id = t.dataset.mk || t.dataset.hot;
    showTipFor(id, { left:e.clientX, top:e.clientY, width:0, height:0 }, true);
    const m = room.markers.find(x => x.id === id);
    if (m && !S.busy){
      const [ax] = R.P(S.pos[0], S.pos[1], 0), f = m.p[0] < ax ? -1 : 1;
      if (f !== S.facing){ S.facing = f; drawAvatar(); }
    }
  }
  function showTipFor(id, r, follow){
    const m = room && room.markers.find(x => x.id === id); if (!m) return;
    let state, cta;
    if (m.door){
      const open = S.room === 'kitchen' || S.doorOpen;
      state = open ? 'Porta aperta' : `Chiusa · ancora ${Math.max(0, UNLOCK_AT - countDone('living'))} missioni`;
      cta = open ? 'Clicca per entrare' : 'Completa le missioni del salotto';
    } else if (S.done[id]){ state = 'Completata'; cta = 'Clicca per rigiocare'; }
    else { state = 'Da fare'; cta = 'Clicca per iniziare'; }
    tip.innerHTML = `<b>${m.label}</b><span class="st ${S.done[id] ? 'ok' : ''}">${state}</span><small>${cta}</small>`;
    const box = root.getBoundingClientRect();
    const x = (follow ? r.left : r.left + r.width / 2) - box.left, y = (follow ? r.top : r.top) - box.top;
    tip.style.transform = `translate(${Math.min(box.width - 190, Math.max(10, x + 16)).toFixed(0)}px, ${Math.max(10, y - 70).toFixed(0)}px)`;
    tip.classList.add('on');
  }

  function activate(id){
    if (S.busy || root.querySelector('.mback')) return;
    if (id === 'door') return useDoor();
    const fn = window.CLGames && window.CLGames[id];
    if (fn) fn(API);
  }

  /* ---------- rooms & walking ---------- */
  function useDoor(){
    if (S.room === 'living' && !S.doorOpen){
      const left = UNLOCK_AT - countDone('living');
      msg('Maria', `La cucina è ancora chiusa. Completa ${left} ${left === 1 ? 'missione' : 'missioni'} del salotto per aprirla.`);
      const d = mkG.querySelector('[data-mk="door"]'); if (d){ d.classList.remove('nope'); void d.getBBox(); d.classList.add('nope'); }
      return;
    }
    S.busy = true; tip.classList.remove('on'); world.style.transform = '';
    walk([S.pos.slice(), ...room.toDoor.slice(1)], () => {
      const fade = root.querySelector('#hFade');
      const nextRoom = S.room === 'living' ? 'kitchen' : 'living';
      root.querySelector('#hCardT').textContent = ROOMS[nextRoom].theme;
      root.querySelector('#hCardN').textContent = ROOMS[nextRoom].name;
      world.classList.add('zoom'); fade.classList.add('on');
      setTimeout(() => {
        S.room = nextRoom;
        room = S.room === 'living' ? R.living(S) : R.kitchen(S);
        S.pos = room.fromDoor[0].slice();
        renderRoom(false);
        world.classList.remove('zoom');
        setTimeout(() => fade.classList.remove('on'), reduced ? 0 : 650);
        setTimeout(() => walk(room.fromDoor, () => {
          S.busy = false;
          if (S.room === 'kitchen' && !S.done._kitchenHi){
            S.done._kitchenHi = true;
            msg('Paola', `Eccoti in cucina, ${esc(S.name)}. Apriamo il frigo e vediamo cosa possiamo salvare per stasera.`);
          }
        }), reduced ? 0 : 700);
      }, reduced ? 0 : 520);
    });
  }

  function walk(path, done){
    const speed = 3.0;
    let i = 0, t0 = null, lastPuff = 0;
    S.pos = path[0].slice();
    const seg = () => { const a = path[i], b = path[i + 1]; return { a, b, len: Math.hypot(b[0] - a[0], b[1] - a[1]) }; };
    let cur = seg();
    const ease = k => (i === 0 && path.length === 2) ? k * k * (3 - 2 * k) : i === 0 ? k * k * .5 + k * .5 : i === path.length - 2 ? 1 - (1 - k) * (1 - k) * .5 - (1 - k) * .5 : k;
    const step = ts => {
      if (t0 === null) t0 = ts;
      const raw = Math.min(1, (ts - t0) / 1000 * speed / Math.max(cur.len, .001)), k = ease(raw);
      S.pos = [cur.a[0] + (cur.b[0] - cur.a[0]) * k, cur.a[1] + (cur.b[1] - cur.a[1]) * k];
      const sa = R.P(cur.a[0], cur.a[1]), sb = R.P(cur.b[0], cur.b[1]);
      if (Math.abs(sb[0] - sa[0]) > 1) S.facing = sb[0] > sa[0] ? 1 : -1;
      drawAvatar(true);
      if (!reduced && ts - lastPuff > 260){ lastPuff = ts; puff(); }
      if (raw >= 1){
        i++;
        if (i >= path.length - 1){ drawAvatar(false); done && done(); return; }
        cur = seg(); t0 = ts;
      }
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  function puff(){
    const [x, y] = R.P(S.pos[0], S.pos[1], 0), g = stage.querySelector('#dustG');
    const c = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
    c.setAttribute('cx', (x - S.facing * 8).toFixed(1)); c.setAttribute('cy', (y - 1).toFixed(1));
    c.setAttribute('rx', 5); c.setAttribute('ry', 2.4); c.setAttribute('class', 'puff');
    g.append(c); setTimeout(() => c.remove(), 700);
  }

  /* ---------- HUD ---------- */
  let shownPts = 0;
  function renderHud(first){
    const lvl = 1 + Math.floor(S.points / LEVEL_PTS), prog = (S.points % LEVEL_PTS) / LEVEL_PTS;
    root.querySelector('#hFace').innerHTML = `<svg viewBox="-24 -134 48 48">${avatar(S)}</svg>
      <svg class="ring" viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="none" stroke="#EEE2D2" stroke-width="3"/><circle cx="20" cy="20" r="18" fill="none" stroke="#E9B44C" stroke-width="3" stroke-linecap="round" stroke-dasharray="${(prog * 113).toFixed(1)} 113" transform="rotate(-90 20 20)"/></svg>`;
    root.querySelector('#hName').textContent = S.name;
    root.querySelector('#hLvl').textContent = `Livello ${lvl}`;
    countTo(root.querySelector('#hPts'), first ? 0 : shownPts, S.points); shownPts = S.points;
    const box = root.querySelector('#hMeters');
    if (!box.children.length){
      box.innerHTML = METERS.map(m => `<div class="meter" data-m="${m.k}" title="${m.name}">
        <div class="mi" style="color:${m.col}">${icon(m.ico, 2.4)}<span>${m.name}</span><em class="num" data-v>0</em></div>
        <div class="bar"><i style="background:${m.col}"></i></div></div>`).join('');
    }
    requestAnimationFrame(() => METERS.forEach(m => {
      const el = box.querySelector(`[data-m="${m.k}"]`);
      el.querySelector('i').style.transform = `scaleX(${S.meters[m.k] / 100})`;
      el.querySelector('[data-v]').textContent = S.meters[m.k];
    }));
  }
  function countTo(el, from, to){
    if (reduced || from === to){ el.textContent = to; return; }
    const t0 = performance.now(), d = 900;
    const f = now => { const k = Math.min(1, (now - t0) / d), e = 1 - Math.pow(1 - k, 3); el.textContent = Math.round(from + (to - from) * e); if (k < 1) requestAnimationFrame(f); };
    requestAnimationFrame(f);
  }
  function floatDelta(k, v){
    const m = root.querySelector(`[data-m="${k}"]`); if (!m) return;
    const r = m.getBoundingClientRect(), b = root.getBoundingClientRect();
    const el = h(`<div class="delta" style="left:${r.left - b.left + r.width / 2}px;top:${r.bottom - b.top + 4}px">+${v}</div>`);
    root.append(el); setTimeout(() => el.remove(), 1400);
  }

  function renderQuests(){
    const list = QUESTS[S.room];
    const n = list.filter(q => S.done[q.id]).length, next = nextQuest();
    const sub = S.room === 'living'
      ? (S.doorOpen ? 'Cucina sbloccata: clicca sulla porta' : `Completane ${UNLOCK_AT} per aprire la cucina`)
      : 'Due sfide per chiudere la demo';
    const box = root.querySelector('#hQuests');
    box.innerHTML = `
      <div class="q-head"><h4>Missioni · ${ROOMS[S.room].name}</h4><span class="q-count num">${n}/${list.length}</span>
        <button class="q-toggle" aria-label="Riduci o espandi le missioni">${icon('x', 2.4)}</button></div>
      <div class="qsub">${sub}</div>
      <ul>${list.map(q => `<li data-id="${q.id}" class="${S.done[q.id] ? 'done' : ''}${next && next.id === q.id ? ' next' : ''}" tabindex="0" role="button">
        <span class="qi">${icon(S.done[q.id] ? 'check' : q.ico, 2.4)}</span><span class="qt">${q.t}</span>${next && next.id === q.id ? '<span class="q-next">Prossima</span>' : ''}</li>`).join('')}</ul>
      <div class="qbar"><i style="transform:scaleX(${n / list.length})"></i></div>`;
    box.querySelectorAll('li[data-id]').forEach(li => li.onkeydown = e => { if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); activate(li.dataset.id); } });
  }

  const countDone = r => QUESTS[r].filter(q => S.done[q.id]).length;

  /* ---------- messages, toasts, confetti ---------- */
  function msg(who, text){
    const box = root.querySelector('#hMsgs'); if (!box) return;
    while (box.children.length >= 2) box.firstElementChild.remove();
    const el = h(`<div class="msg">${portrait(who)}<div><b>${who}</b><p class="typing"><i></i><i></i><i></i></p></div></div>`);
    const kill = () => { el.classList.add('out'); setTimeout(() => el.remove(), 350); };
    el.onclick = kill;
    box.append(el);
    setTimeout(() => { const p = el.querySelector('p'); p.classList.remove('typing'); p.textContent = ''; p.innerHTML = text; }, reduced ? 0 : 750);
    setTimeout(kill, 9500);
  }

  function toast(title, sub, ico, col){
    const el = h(`<div class="toast"><div class="tb" style="background:${col}">${icon(ico, 2.4)}</div><div><b>${title}</b><small>${sub}</small></div></div>`);
    root.append(el);
    if (!reduced) confetti(el, col);
    setTimeout(() => el.remove(), 3300);
  }
  function confetti(anchor, col){
    const cols = [col, '#E9B44C', '#7FA37A', '#D9734E', '#5F9BBE', '#FFFDF8'];
    const layer = h(`<div class="confetti" aria-hidden="true"></div>`);
    for (let i = 0; i < 26; i++){
      const a = Math.random() * Math.PI * 2, d = 50 + Math.random() * 90;
      layer.append(h(`<i style="--x:${(Math.cos(a) * d).toFixed(0)}px;--y:${(Math.sin(a) * d * .6 - 20).toFixed(0)}px;--r:${(Math.random() * 540 - 270).toFixed(0)}deg;background:${cols[i % cols.length]};animation-delay:${(Math.random() * .12).toFixed(2)}s"></i>`));
    }
    root.append(layer); setTimeout(() => layer.remove(), 1500);
  }

  /* ---------- modal ---------- */
  function modal({ title, sub = '', ico = 'star', col = '#D9734E', body = '', foot = '', onMount, onClose }){
    closeModal(true);
    const el = h(`<div class="mback"><div class="modal" role="dialog" aria-modal="true" aria-label="${title}">
      <div class="m-head" style="--mc:${col}"><div class="m-ico" style="background:${col}">${icon(ico, 2.4)}</div>
        <div><small>${sub}</small><h3>${title}</h3></div>
        <button class="m-x" aria-label="Chiudi">${icon('x', 2.6)}</button></div>
      <div class="m-body">${body}</div>
      ${foot ? `<div class="m-foot">${foot}</div>` : ''}</div></div>`);
    el._onClose = onClose;
    el._prevFocus = document.activeElement;
    el.querySelector('.m-x').onclick = () => closeModal();
    el.addEventListener('click', e => { if (e.target === el) closeModal(); });
    el.addEventListener('keydown', e => {
      if (e.key !== 'Tab') return;
      const f = [...el.querySelectorAll('button:not([disabled]), input, [tabindex="0"]')].filter(x => x.offsetParent);
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]){ e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]){ e.preventDefault(); f[0].focus(); }
    });
    root.append(el);
    onMount && onMount(el);
    setTimeout(() => { const f = el.querySelector('.m-body button:not([disabled]), .m-body input, .m-foot button:not([disabled])') || el.querySelector('.m-x'); f && f.focus({ preventScroll:true }); }, 60);
    return el;
  }
  function closeModal(silent){
    const el = root.querySelector('.mback'); if (!el) return;
    const cb = el._onClose, prev = el._prevFocus; el.remove();
    document.querySelectorAll('body > .item.drag').forEach(n => n.remove());
    if (prev && prev.isConnected && prev.focus) prev.focus({ preventScroll:true });
    if (!silent && cb) cb();
    if (!silent) afterClose();
  }
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && root.querySelector('.mback')) closeModal(); });

  function helpModal(){
    modal({ title:'Come si gioca', sub:'Comandi', ico:'book', col:'#A66BA6',
      body:`<ul class="help">
        <li><b>Mouse</b><span>Clicca sui segnaposto o direttamente sugli oggetti.</span></li>
        <li><b>Tastiera</b><span>Tab per spostarti tra gli oggetti, Invio per aprirli, Esc per chiudere.</span></li>
        <li><b>Missioni</b><span>L'elenco a sinistra indica la prossima missione. Puoi cliccarle anche da lì.</span></li>
        <li><b>Barre della casa</b><span>Energia, Acqua, Rifiuti e Spesa salgono con ogni gesto giusto.</span></li>
        <li><b>Schermo intero</b><span>Il pulsante in alto a destra allarga la demo a tutto lo schermo.</span></li></ul>`,
      foot:`<button class="gbtn" id="hOk">Ho capito</button>`, onMount: el => el.querySelector('#hOk').onclick = () => closeModal(true) });
  }
  function confirmRestart(){
    modal({ title:'Ricominciare?', sub:'La demo riparte dalla creazione del personaggio', ico:'home', col:'#9A8676',
      body:`<p>I progressi di questa partita andranno persi.</p>`,
      foot:`<button class="gbtn sec" id="rNo">Annulla</button><button class="gbtn" id="rYes">Ricomincia</button>`,
      onMount: el => { el.querySelector('#rNo').onclick = () => closeModal(true); el.querySelector('#rYes').onclick = () => { closeModal(true); reset(); }; } });
  }

  /* ---------- progress ---------- */
  const pending = [];
  function complete(id, { meters = {}, points = 20, badge, who, say } = {}){
    if (S.done[id]) return false;
    S.done[id] = true;
    S.points += points;
    Object.entries(meters).forEach(([k, v]) => {
      const before = S.meters[k];
      S.meters[k] = Math.max(0, Math.min(100, S.meters[k] + v));
      const m = root.querySelector(`[data-m="${k}"]`);
      if (m){ m.classList.remove('pulse'); void m.offsetWidth; m.classList.add('pulse'); }
      if (S.meters[k] > before) floatDelta(k, S.meters[k] - before);
    });
    if (badge){ S.badges.push(badge); toast(badge.t, `Badge sbloccato · +${points} eco-punti`, badge.ico, badge.col); }
    renderHud();
    refresh();
    if (who && say) pending.push([who, say]);
    if (S.room === 'living' && !S.doorOpen && countDone('living') >= UNLOCK_AT){
      S.doorOpen = true;
      pending.push(['Maria', 'Ottimo lavoro. La porta della cucina è aperta: Paola ti aspetta di là.']);
      pending.push(['_toast']);
    }
    if (countDone('kitchen') === QUESTS.kitchen.length && !S.finished){ S.finished = true; pending.push(['_final']); }
    return true;
  }

  function afterClose(){
    let delay = 300;
    while (pending.length){
      const [who, text] = pending.shift();
      if (who === '_toast') setTimeout(() => { refresh(); toast('Nuova stanza sbloccata', 'La cucina ti aspetta', 'door', '#E9B44C'); }, delay);
      else if (who === '_final') setTimeout(finalScreen, delay + 900);
      else setTimeout(() => msg(who, text), delay);
      delay += 1400;
    }
  }

  function refresh(){
    room = S.room === 'living' ? R.living(S) : R.kitchen(S);
    sceneG.innerHTML = room.svg; drawMarkers(); renderQuests();
  }

  function finalScreen(){
    const mins = Math.max(1, Math.round((Date.now() - S.t0) / 60000));
    const done = Object.keys(S.done).filter(k => !k.startsWith('_')).length;
    modal({
      title:'Demo completata', sub:`Casa di ${esc(S.name)}`, ico:'star', col:'#E9B44C',
      body:`<div class="final">
        <div class="f-stats">
          <div><b class="num">${S.points}</b><span>eco-punti</span></div>
          <div><b class="num">${1 + Math.floor(S.points / LEVEL_PTS)}</b><span>livello</span></div>
          <div><b class="num">${done}</b><span>missioni</span></div>
          <div><b class="num">${mins}′</b><span>di gioco</span></div>
        </div>
        <div class="f-meters">${METERS.map(m => `<div class="f-m"><span style="color:${m.col}">${icon(m.ico, 2.4)}</span><em>${m.name}</em>
          <div class="f-bar"><i class="was" style="width:${START_METERS[m.k]}%"></i><i class="now" style="width:${S.meters[m.k]}%;background:${m.col}"></i></div>
          <b class="num">+${S.meters[m.k] - START_METERS[m.k]}</b></div>`).join('')}</div>
        <div class="f-badges">${S.badges.map(b => `<div><span style="background:${b.col}">${icon(b.ico, 2.4)}</span><small>${b.t}</small></div>`).join('')}</div>
        <p class="f-next">Nel gioco completo la casa continua a crescere:</p>
        <div class="next-rooms">
          <span>${icon('drop')} Bagno · Acqua</span><span>${icon('recycle')} Balcone · Rifiuti</span>
          <span>${icon('washer')} Lavanderia · Elettrodomestici</span><span>${icon('sprout')} Orto · Stagioni</span></div>
        </div>`,
      foot:`<button class="gbtn sec" id="fAgain">Rigioca</button><button class="gbtn" id="fBack">Scopri i moduli</button>`,
      onMount: el => {
        el.querySelector('#fAgain').onclick = () => { reset(); };
        el.querySelector('#fBack').onclick = () => { closeModal(true); const t = document.getElementById('moduli'); if (document.fullscreenElement) document.exitFullscreen(); t && t.scrollIntoView({ behavior:'smooth' }); };
        if (!reduced) confetti(el.querySelector('.final'), '#E9B44C');
      }
    });
  }

  function reset(){
    Object.assign(S, { room:'living', meters:{ ...START_METERS }, points:0, done:{}, lamp:'inc', temp:23, doorOpen:false, badges:[], busy:false, finished:false });
    pending.length = 0; shownPts = 0;
    creator();
  }

  function esc(s){ return String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c])); }

  const API = { S, modal, closeModal, complete, msg, toast, refresh, icon, esc, face: portrait };
  window.CLGame = API;
  startScreen();
})();
