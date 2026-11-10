(function(){
  const { makeIso, icon, avatar, PERSONAS } = window.CL;
  const $ = s => document.querySelector(s);

  const ROOMS = [
    { n:1, name:'Soggiorno', theme:'Energia e lezioni', col:'#D9734E', ico:'tv',
      text:'La TV per le video lezioni e la libreria con le dispense. Stand-by, luci e riscaldamento.' },
    { n:2, name:'Cucina', theme:'Spesa e spreco', col:'#D9A13A', ico:'cart',
      text:'Frigo, dispensa e lista della spesa: scadenze, avanzi, stagionalità e prodotti Coop.' },
    { n:3, name:'Bagno', theme:'Acqua', col:'#5F9BBE', ico:'drop',
      text:'Docce, rubinetti e detersivi: quanta acqua usiamo e come consumarne meno.' },
    { n:4, name:'Balcone', theme:'Rifiuti', col:'#7FA37A', ico:'recycle',
      text:'Raccolta differenziata con le regole del proprio comune, compostaggio e riuso.' },
    { n:5, name:'Lavanderia', theme:'Elettrodomestici', col:'#A66BA6', ico:'washer',
      text:'Etichette energetiche, lavaggi a bassa temperatura, orari e carichi pieni.' },
    { n:6, name:'Orto', theme:'Stagioni e biodiversità', col:'#5E8459', ico:'sprout',
      text:'Aromatiche sul davanzale, frutta e verdura di stagione, piante amiche degli insetti.' }
  ];

  const MODS = [
    { room:'Soggiorno · Energia', title:'Caccia allo stand-by', col:'#D9734E', ico:'plug', demo:true,
      learn:'Quali apparecchi consumano anche quando sembrano spenti.',
      play:'Trova le spie rosse nella stanza, spegnile una a una e poi stacca la ciabatta.',
      win:'Badge "Cacciatore di stand-by" e barra Energia in salita.' },
    { room:'Balcone · Rifiuti', title:'Il bidone giusto', col:'#7FA37A', ico:'recycle', demo:true,
      learn:'Gli errori più comuni: scontrini, ceramica, contenitori sporchi.',
      play:'Trascina ogni rifiuto nel contenitore giusto. Le regole si adattano al proprio comune.',
      win:'Calendario della raccolta da stampare e barra Rifiuti.' },
    { room:'Cucina · Spesa', title:'Svuota-frigo', col:'#D9A13A', ico:'leaf', demo:true,
      learn:'La differenza tra "da consumarsi entro" e "preferibilmente entro".',
      play:'Scegli cosa usare prima. Paola propone una ricetta con quello che hai salvato.',
      win:'Ricetta salvata nel ricettario di casa.' },
    { room:'Soggiorno · Energia', title:'Bolletta detective', col:'#C0563A', ico:'bolt',
      learn:'Leggere una bolletta: consumi, fasce orarie, potenza impegnata.',
      play:'Su una bolletta interattiva, trova le 5 voci che contano davvero.',
      win:'Nuova dispensa sbloccata nella libreria.' },
    { room:'Bagno · Acqua', title:'Doccia da 5 minuti', col:'#5F9BBE', ico:'drop',
      learn:'Quanta acqua usano doccia e vasca, e come ridurla con piccoli accorgimenti.',
      play:'Mini-gioco a ritmo, poi una missione reale di 7 giorni da spuntare.',
      win:'Una pianta per il bagno e la barra Acqua.' },
    { room:'Cucina · Coop', title:'Spesa consapevole', col:'#E2001A', ico:'cart', demo:true,
      learn:'Stagionalità, imballaggi, ricariche e prodotti Coop a minor impatto.',
      play:'Riempi il carrello scegliendo tra coppie di prodotti, con budget e impronta.',
      win:'Lista della spesa sostenibile da portare al punto vendita.' }
  ];

  const GAMI = [
    { title:'Le barre della casa', text:'Energia, Acqua, Rifiuti e Spesa raccontano l\'impronta della casa. Ogni gesto giusto le fa salire.', vis:'meters' },
    { title:'Eco-punti e livelli', text:'Si guadagnano con lezioni e sfide. Ogni livello apre una nuova stanza e allarga la casa.', vis:'levels' },
    { title:'Badge da collezionare', text:'Piccoli riconoscimenti per i traguardi: il primo stand-by spento, la prima ricetta salvata.', vis:'badges' },
    { title:'Missioni nel mondo reale', text:'"Questa settimana spegni la ciabatta ogni sera." Si spuntano i giorni e il gioco lo ricorda con garbo.', vis:'week' },
    { title:'Sfide di squadra', text:'Obiettivi collettivi per cooperativa o territorio, invece delle classifiche individuali.', vis:'team' },
    { title:'Una casa tutta tua', text:'Piante, arredi e decorazioni come ricompensa. La casa cambia aspetto insieme a te.', vis:'deco' }
  ];

  const PEOPLE = [
    { name:'Maria', img:'maria', role:'Ti dà il benvenuto', text:'Ti accoglie in salotto e spiega come funziona la casa. Pragmatica, niente giri di parole.' },
    { name:'Paola', img:'paola', role:'Cucina e spesa', text:'Ti insegna a salvare gli avanzi, a leggere le scadenze e a fare una spesa più consapevole.' },
    { name:'Luca', img:'luca', role:'Rifiuti e riuso', text:'Sulla differenziata sa quasi tutto. Il "quasi" lo scopre insieme a te.' },
    { name:'Roberto', img:'roberto', role:'Energia e bollette', text:'Ha imparato a leggere le bollette e adesso le spiega a tutto il condominio.' }
  ];

  const VALUE = [
    { ico:'users', col:'#D9734E', t:'Coinvolge davvero', p:'Un gioco si apre per curiosità e si riprende con piacere. I Soci tornano per sbloccare la stanza successiva, non per dovere.' },
    { ico:'target', col:'#7FA37A', t:'Cambia le abitudini', p:'Ogni modulo si chiude con una missione da fare a casa propria: spegnere gli stand-by, regolare il termostato, salvare gli avanzi.' },
    { ico:'cart', col:'#E2001A', t:'Rafforza il marchio', p:'Coop è presente nella dispensa, nella spesa e nei premi: il gioco racconta i valori della cooperativa con i suoi prodotti.' },
    { ico:'star', col:'#E9B44C', t:'Risultati visibili', p:'Iscritti, moduli completati e missioni svolte diventano numeri da raccontare nel bilancio di sostenibilità.' }
  ];

  const TECH = [
    { t:'Nessuna installazione', p:'Si gioca dal browser. Si entra con il proprio account e si riprende da dove ci si era fermati.' },
    { t:'Per tutte le età', p:'Solo click, testi grandi e nessun timer: pensato anche per chi non ha mai giocato a un videogioco.' },
    { t:'Computer e smartphone', p:'Funziona da computer e da smartphone in orizzontale, a casa o in pausa pranzo.' },
    { t:'Sempre aggiornato', p:'Nuove stanze, lezioni e sfide si aggiungono nel tempo senza che i Soci debbano fare nulla.' }
  ];

  document.querySelectorAll('.p-ico').forEach(el => el.innerHTML = icon(el.dataset.ico));

  $('#roomList').innerHTML = ROOMS.map(r => `
    <div class="room reveal">
      <div class="room-ico" style="background:${r.col}">${icon(r.ico)}</div>
      <div>
        <div class="step">Stanza ${r.n}</div>
        <h4>${r.name}</h4>
        <div class="theme" style="color:${r.col}">${r.theme}</div>
        <p>${r.text}</p>
      </div>
    </div>`).join('');

  $('#modList').innerHTML = MODS.map(m => `
    <article class="mod reveal">
      <div class="mod-top" style="background:${m.col}">
        <div class="room-tag">${m.room}</div>
        <h3>${m.title}</h3>
        ${icon(m.ico)}
      </div>
      <div class="mod-body">
        <div class="mod-row"><b>Cosa impari</b><p>${m.learn}</p></div>
        <div class="mod-row"><b>Come si gioca</b><p>${m.play}</p></div>
        <div class="mod-row"><b>Ricompensa</b><p>${m.win}</p></div>
        ${m.demo ? '<div class="mod-play">● Giocabile nella demo</div>' : ''}
      </div>
    </article>`).join('');

  const VIS = {
    meters: `<div class="meters-demo">
      <div class="md"><span>Energia</span><i style="--v:78%;--c:#E9B44C"></i></div>
      <div class="md"><span>Acqua</span><i style="--v:55%;--c:#5F9BBE"></i></div>
      <div class="md"><span>Rifiuti</span><i style="--v:66%;--c:#7FA37A"></i></div></div>`,
    levels: `<div class="lvl"><b>Livello 3</b><i><u style="width:64%"></u></i><small>640 / 1000 eco-punti</small></div>`,
    badges: `<div class="badges">
      <div class="badge" style="background:#D9734E">${icon('plug')}</div>
      <div class="badge" style="background:#7FA37A">${icon('recycle')}</div>
      <div class="badge" style="background:#D9A13A">${icon('leaf')}</div>
      <div class="badge" style="background:#C9BBAA">${icon('lock')}</div></div>`,
    week: `<div class="week">${['L','M','M','G','V','S','D'].map((d,i)=>`<span class="${i<4?'on':''}">${d}</span>`).join('')}</div>`,
    team: `<div class="team"><b>7.420</b><span>/ 10.000 ciabatte spente<br>dai Soci della tua cooperativa</span></div>`,
    deco: `<div class="badges">
      <div class="badge" style="background:#5E8459">${icon('sprout')}</div>
      <div class="badge" style="background:#E9B44C">${icon('sun')}</div>
      <div class="badge" style="background:#5F9BBE">${icon('home')}</div></div>`
  };
  $('#gamiList').innerHTML = GAMI.map(g => `
    <div class="g-card reveal"><div class="g-vis">${VIS[g.vis]}</div><h4>${g.title}</h4><p>${g.text}</p></div>`).join('');

  $('#peopleList').innerHTML = PEOPLE.map(p => `
    <div class="person reveal"><div class="p-art" style="background:${PERSONAS[p.name].bg}">
      <svg viewBox="-48 -138 96 146" role="img" aria-label="${p.name}"><ellipse cx="0" cy="1" rx="32" ry="8" fill="rgba(255,255,255,.6)"/><g>${avatar(PERSONAS[p.name])}</g></svg></div>
      <div><h4>${p.name}</h4><div class="role">${p.role}</div><p>${p.text}</p></div></div>`).join('');

  $('#valueList').innerHTML = VALUE.map(v => `
    <div class="v-card reveal"><div class="room-ico" style="background:${v.col}">${icon(v.ico)}</div><h4>${v.t}</h4><p>${v.p}</p></div>`).join('');

  $('#techList').innerHTML = TECH.map(t => `<div class="t-card reveal"><b>${t.t}</b><p>${t.p}</p></div>`).join('');

  const iso = makeIso(34);
  const { box, pts, P, onY, onX, onZ } = iso;
  const HR = [
    { id:'sog', name:'Soggiorno', x:0, y:0, w:5, d:5, floor:'#E3B98A', col:'#D9734E', ico:'tv' },
    { id:'cuc', name:'Cucina', x:5, y:0, w:4, d:5, floor:'#EFE3CF', col:'#D9A13A', ico:'cart' },
    { id:'bag', name:'Bagno', x:9, y:0, w:3, d:3, floor:'#CFE3EC', col:'#5F9BBE', ico:'drop' },
    { id:'bal', name:'Balcone', x:0, y:5, w:5, d:2, floor:'#D8CBB9', col:'#7FA37A', ico:'recycle' },
    { id:'lav', name:'Lavanderia', x:9, y:3, w:3, d:2, floor:'#E6DAEA', col:'#A66BA6', ico:'washer' },
    { id:'ort', name:'Orto', x:5, y:5, w:7, d:2, floor:'#9DBB7E', col:'#5E8459', ico:'sprout' }
  ];

  function heroRoom(r){
    let s = box(r.x, r.y, -0.35, r.w, r.d, 0.35, r.floor);
    const WH = 2.6, T = 0.18;
    if (r.x === 0 && r.id !== 'bal') s += box(r.x - T, r.y, 0, T, r.d, WH, '#F3E6D3');
    if (r.y === 0) s += box(r.x, r.y - T, 0, r.w, T, WH, '#F8EEDF');
    if (r.id === 'bal') s += box(r.x - T, r.y, 0, T, r.d, 0.7, '#CDBBA4');
    if (r.x > 0) s += box(r.x, r.y, 0, 0.12, r.d, 0.45, '#E8D7C0');
    if (r.y > 0) s += box(r.x, r.y, 0, r.w, 0.12, 0.45, '#E8D7C0');
    s += heroProps[r.id](r);
    return s;
  }
  const heroProps = {
    sog: () =>
      `<polygon points="${onZ(0.01, 1.3, 1.2, 4, 4.2)}" fill="#E9B44C" opacity=".85"/>` +
      box(0.1, 1.2, 0, 0.5, 2.4, 0.6, '#8A5A3C') + box(0.2, 1.5, 0.6, 0.1, 1.8, 1.0, '#33313B') +
      `<polygon points="${onX(0.31, 1.6, 0.7, 3.2, 1.5)}" fill="#7FC1D9"/>` +
      box(3.2, 1.4, 0, 0.9, 2.2, 0.5, '#D9734E') + box(3.8, 1.4, 0.5, 0.3, 2.2, 0.55, '#C9603C') +
      box(1.2, 0.05, 0, 1.6, 0.45, 2.2, '#9B6B47') +
      box(4.3, 0.4, 0, 0.4, 0.4, 0.45, '#C0704A') +
      `<circle cx="${P(4.5,0.6,0.85)[0]}" cy="${P(4.5,0.6,0.85)[1]}" r="11" fill="#6E9E5E"/>`,
    cuc: r =>
      box(r.x + 0.4, 0.05, 0, 3.2, 0.7, 1.0, '#F2EBDD') + box(r.x + 0.4, 0.05, 1.0, 3.2, 0.7, 0.06, '#8C7B6A') +
      box(r.x + 0.1, 3.2, 0, 0.7, 0.8, 2.1, '#E9EEF0') +
      box(r.x + 1.6, 2.0, 0, 1.4, 1.1, 0.75, '#B98256'),
    bag: r =>
      box(r.x + 0.3, 0.1, 0, 1.6, 0.8, 0.6, '#FFFFFF') + `<polygon points="${onZ(0.55, r.x + 0.45, 0.25, r.x + 1.75, 0.75)}" fill="#9FD0E6"/>` +
      box(r.x + 2.2, 0.1, 0, 0.6, 0.5, 0.9, '#F4F4F2'),
    bal: r =>
      box(0.5, 5.6, 0, 0.6, 0.6, 0.8, '#5F9BBE') + box(1.3, 5.6, 0, 0.6, 0.6, 0.8, '#E9B44C') +
      box(2.1, 5.6, 0, 0.6, 0.6, 0.8, '#7FA37A') + box(2.9, 5.6, 0, 0.6, 0.6, 0.8, '#8D8D8D') +
      box(0, r.y + r.d - 0.08, 0, r.w, 0.08, 0.75, '#B49A7C'),
    lav: r =>
      box(r.x + 0.3, 3.3, 0, 0.8, 0.8, 1.0, '#FBFBF8') + box(r.x + 1.3, 3.3, 0, 0.8, 0.8, 1.0, '#FBFBF8') +
      `<ellipse cx="${P(r.x+0.7,4.1,0.5)[0]}" cy="${P(r.x+0.7,4.1,0.5)[1]}" rx="8" ry="9" fill="#BFD3DC" stroke="#8FA6B0"/>` +
      `<ellipse cx="${P(r.x+1.7,4.1,0.5)[0]}" cy="${P(r.x+1.7,4.1,0.5)[1]}" rx="8" ry="9" fill="#BFD3DC" stroke="#8FA6B0"/>`,
    ort: r => {
      let s = '';
      for (let i = 0; i < 3; i++) s += box(r.x + 0.5 + i * 2.1, 5.4, 0, 1.6, 1.1, 0.3, '#8A5A3C');
      for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++){
        const [cx, cy] = P(r.x + 0.8 + i * 2.1 + j * 0.5, 5.95, 0.45);
        s += `<circle cx="${cx}" cy="${cy}" r="${5 + (i + j) % 2 * 2}" fill="${['#5E8459','#7FA37A','#D9734E'][(i+j)%3]}"/>`;
      }
      return s;
    }
  };

  function heroLabel(r){
    const [cx, cy] = P(r.x + r.w / 2, r.y + r.d / 2, r.id === 'sog' ? 3.4 : 2.2);
    const w = r.name.length * 8.4 + 46;
    return `<g class="hl" transform="translate(${cx.toFixed(1)},${cy.toFixed(1)})">
      <rect x="${-w/2}" y="-16" width="${w}" height="32" rx="16" fill="#fff" stroke="${r.col}" stroke-width="2"/>
      <g transform="translate(${-w/2 + 10},-9) scale(.75)" style="color:${r.col}">${icon(r.ico, 2.4).replace('<svg','<svg width="24" height="24"')}</g>
      <text x="${-w/2 + 34}" y="5" font-family="Nunito" font-weight="800" font-size="14" fill="#3A2E28">${r.name}</text></g>`;
  }

  const order = [...HR].sort((a, b) => (a.x + a.w / 2 + a.y + a.d / 2) - (b.x + b.w / 2 + b.y + b.d / 2));
  const appear = ['sog', 'cuc', 'bag', 'bal', 'lav', 'ort'];
  let svg = `<defs><radialGradient id="hglow" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#FFE2A8" stop-opacity=".9"/><stop offset="1" stop-color="#FFE2A8" stop-opacity="0"/></radialGradient></defs>
    <ellipse cx="320" cy="300" rx="300" ry="170" fill="url(#hglow)"/>
    <g transform="translate(262,128)">`;
  order.forEach(r => {
    const i = appear.indexOf(r.id);
    svg += `<g class="hr" style="--d:${0.3 + i * 0.55}s">${heroRoom(r)}</g>`;
  });
  const [ax, ay] = P(2.2, 3.6, 0);
  svg += `<g class="hr" style="--d:.6s"><g transform="translate(${ax},${ay}) scale(.42)">${avatar({ skin:1, hair:'corti', hairColor:1, outfit:1 })}</g></g>`;
  order.forEach(r => { const i = appear.indexOf(r.id); svg += `<g class="hr hr-l" style="--d:${0.6 + i * 0.55}s">${heroLabel(r)}</g>`; });
  svg += `</g>`;
  $('#heroHouse').innerHTML = svg;

  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
})();
