(function(){
  const ART = window.CLArt || {};
  const $$ = (el, s) => [...el.querySelectorAll(s)];
  const fact = (G, txt, warn) => `<div class="fact${warn ? ' warn' : ''}">${G.icon(warn ? 'target' : 'leaf', 2.2)}<span>${txt}</span></div>`;

  function tv(G){
    const caps = [
      'Molti apparecchi consumano energia anche quando sembrano spenti.',
      'Luci, riscaldamento e stand-by: in casa sono le prime cose su cui agire.',
      'In questa stanza trovi tre gesti per cominciare. Pronti?'
    ];
    const chap = ['L\'energia invisibile', 'Dove si spreca', 'Tre gesti'];
    G.modal({
      title:'L\'energia che non vedi', sub:'Video lezione · Modulo 1', ico:'tv', col:'#D9734E',
      body:`<div class="vid">
          <svg class="scene" viewBox="0 0 320 180">
            <defs><linearGradient id="vbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3D5A6C"/><stop offset="1" stop-color="#22303A"/></linearGradient></defs>
            <rect width="320" height="180" fill="url(#vbg)"/>
            <path class="vh" d="M100 120 V78 L160 40 L220 78 V120 Z" fill="none" stroke="#FFE2A8" stroke-width="3" stroke-linejoin="round"/>
            <rect x="148" y="92" width="24" height="28" fill="none" stroke="#FFE2A8" stroke-width="3"/>
            <circle class="vp p1" cx="118" cy="104" r="5" fill="#FF3B30"/><circle class="vp p2" cx="200" cy="104" r="5" fill="#FF3B30"/><circle class="vp p3" cx="160" cy="66" r="5" fill="#FF3B30"/>
            <text x="250" y="40" font-family="Fredoka" font-size="14" fill="#FFE2A8" id="vKwh">0 kWh</text>
          </svg>
          <button class="vplay" id="vPlay" aria-label="Riproduci">${G.icon('play', 2.4)}</button>
          <div class="cap" id="vCap"></div>
          <div class="prog"><i id="vProg"></i></div>
        </div>
        <div class="chapters">${chap.map((c, i) => `<span data-c="${i}">${i + 1}. ${c}</span>`).join('')}</div>
        <p class="small-note">Nel gioco completo: video lezioni EIIS di 2-4 minuti.</p>
        <style>.vid .vh{stroke-dasharray:400;stroke-dashoffset:400}.vid.run .vh{animation:vdraw 2.5s ease forwards}
        @keyframes vdraw{to{stroke-dashoffset:0}}.vid .vp{opacity:0}.vid.run .vp{animation:vpop 1s ease infinite alternate}
        .vid.run .p2{animation-delay:.4s}.vid.run .p3{animation-delay:.8s}@keyframes vpop{from{opacity:.2}to{opacity:1}}</style>`,
      onMount: el => {
        const play = el.querySelector('#vPlay'), cap = el.querySelector('#vCap'), prog = el.querySelector('#vProg');
        const kwh = el.querySelector('#vKwh'), vid = el.querySelector('.vid');
        play.onclick = () => {
          play.remove(); vid.classList.add('run');
          const T = 9000, t0 = performance.now();
          const tick = now => {
            if (!el.isConnected) return;
            const k = Math.min(1, (now - t0) / T), c = Math.min(2, Math.floor(k * 3));
            prog.style.width = k * 100 + '%';
            cap.textContent = caps[c];
            kwh.textContent = Math.round(k * 120) + ' kWh';
            $$(el, '.chapters span').forEach((s, i) => s.classList.toggle('on', i === c));
            if (k < 1) return requestAnimationFrame(tick);
            cap.textContent = 'Lezione completata';
            G.complete('tv', { meters:{ energia:5 }, points:30, badge:{ t:'Prima lezione', ico:'tv', col:'#D9734E' },
              who:'Roberto', say:'Visto? Adesso cerchiamo gli stand-by nascosti: parti dalla ciabatta vicino alla TV.' });
            el.querySelector('.m-body').insertAdjacentHTML('beforeend', `<div style="text-align:right;margin-top:.8em"><button class="gbtn green" id="vOk">Fatto</button></div>`);
            el.querySelector('#vOk').onclick = () => G.closeModal();
          };
          requestAnimationFrame(tick);
        };
      }
    });
  }

  const DOCS = [
    { t:'Leggere la bolletta della luce', tag:'Energia', pts:[
      'Quanta energia hai consumato (in kWh) e in quale periodo.',
      'Se i consumi sono effettivi o stimati: controlla le letture del contatore.',
      'Le fasce orarie F1, F2 e F3, se hai una tariffa a fasce.',
      'La potenza impegnata: nelle case è spesso di 3 kW.' ] },
    { t:'Il calendario della raccolta', tag:'Rifiuti', pts:[
      'Ogni comune ha le sue regole: il riferimento è il gestore locale.',
      'Svuota e sciacqua i contenitori prima di buttarli.',
      'Gli scontrini in carta termica di solito vanno nell\'indifferenziato.',
      'Ceramica e pirex non vanno nel vetro.' ] },
    { t:'Come si legge l\'etichetta energetica', tag:'Energia', pts:[
      'Le classi vanno dalla A alla G: per molti elettrodomestici la scala è stata aggiornata nel 2021.',
      'Il consumo annuo in kWh è il dato più utile per confrontare due modelli.',
      'Il QR code porta alla scheda del prodotto nel database europeo EPREL.',
      'Una classe migliore può costare di più all\'acquisto e meno in bolletta.' ] }
  ];
  function libreria(G){
    const list = () => `<p>Le dispense restano sempre in libreria: puoi leggerle ora o tornare quando vuoi.</p>
      <div class="docs">${DOCS.map((d, i) => `<button class="doc" data-d="${i}"><span class="dt">PDF</span><b>${d.t}</b><small>${d.tag} · 2 pagine</small></button>`).join('')}</div>`;
    G.modal({
      title:'La libreria di casa', sub:'Dispense e guide', ico:'book', col:'#A66BA6', body:list(),
      onMount: el => {
        const body = el.querySelector('.m-body');
        const bind = () => $$(body, '.doc').forEach(b => b.onclick = () => open(+b.dataset.d));
        const open = i => {
          const d = DOCS[i];
          body.innerHTML = `<div class="paper"><h4>${d.t}</h4><ul>${d.pts.map(p => `<li>${p}</li>`).join('')}</ul></div>
            <p class="small-note">Nel gioco completo la dispensa si apre e si scarica in PDF.</p>
            <div style="display:flex;justify-content:space-between;margin-top:.9em">
              <button class="gbtn sec" id="dBack">Altre dispense</button><button class="gbtn green" id="dRead">${G.icon('check')} Letta</button></div>`;
          body.querySelector('#dBack').onclick = () => { body.innerHTML = list(); bind(); };
          body.querySelector('#dRead').onclick = () => {
            G.complete('libreria', { meters:{ energia:5 }, points:20, badge:{ t:'Lettore curioso', ico:'book', col:'#A66BA6' } });
            G.closeModal();
          };
        };
        bind();
      }
    });
  }

  function ciabatta(G){
    const devs = [['tv','Televisore'],['tv','Decoder'],['phone','Caricabatterie']];
    G.modal({
      title:'Caccia allo stand-by', sub:'Energia', ico:'plug', col:'#D9734E',
      body:`<p>Tre apparecchi hanno la spia rossa accesa: stanno consumando anche se nessuno li usa. Spegnili uno a uno, poi stacca la ciabatta.</p>
        <div class="devs">${devs.map(([ic, n], i) => `<button class="dev" data-i="${i}"><span class="led"></span>${G.icon(ic, 1.8)}${n}</button>`).join('')}
          <button class="dev" data-i="x" disabled style="opacity:.5"><span class="led"></span>${G.icon('plug', 1.8)}Ciabatta</button></div>
        <div id="cOut"></div>`,
      onMount: el => {
        let off = 0;
        const strip = el.querySelector('[data-i="x"]');
        $$(el, '.dev').forEach(b => b.onclick = () => {
          if (b.classList.contains('off')) return;
          if (b === strip){
            b.classList.add('off'); b.disabled = true;
            el.querySelector('#cOut').innerHTML =
              fact(G, 'Secondo diverse stime, gli apparecchi in stand-by possono arrivare a circa il 10% dei consumi elettrici di una casa. Una ciabatta con interruttore li spegne tutti con un clic.') +
              `<div style="text-align:right"><button class="gbtn green" id="cOk">Fatto</button></div>`;
            G.complete('ciabatta', { meters:{ energia:20 }, points:30, badge:{ t:'Cacciatore di stand-by', ico:'plug', col:'#D9734E' },
              who:'Roberto', say:'Anch\'io lasciavo tutto acceso. Adesso la sera un clic sulla ciabatta e buonanotte.' });
            el.querySelector('#cOk').onclick = () => G.closeModal();
            return;
          }
          b.classList.add('off'); off++;
          if (off === devs.length){ strip.disabled = false; strip.style.opacity = 1; strip.classList.add('dev'); }
        });
      }
    });
  }

  function lampadina(G){
    const bulb = (c, glow) => `<svg class="bulb" viewBox="0 0 48 48"><circle cx="24" cy="20" r="16" fill="${glow}" opacity=".35"/>
      <path d="M24 6a12 12 0 0 0-7 21.8V33h14v-5.2A12 12 0 0 0 24 6z" fill="${c}" stroke="#8C7B6A" stroke-width="1.5"/>
      <rect x="18" y="34" width="12" height="7" rx="2" fill="#A9A49B"/></svg>`;
    const opts = [
      { k:'inc', n:'Incandescenza', s:'Luce calda, scalda molto', b:bulb('#FFD27A', '#FFB347'),
        why:'Le lampadine a incandescenza trasformano gran parte dell\'energia in calore. Nell\'Unione europea non si producono più per l\'uso domestico.' },
      { k:'alo', n:'Alogena', s:'Simile all\'incandescenza', b:bulb('#FFF0B8', '#FFD27A'),
        why:'Un po\' meglio dell\'incandescenza, ma consuma comunque molto più di un LED. Anche le alogene sono state ritirate quasi del tutto.' },
      { k:'led', n:'LED', s:'Calda o fredda, a scelta', b:bulb('#FFFBEF', '#FFF2C4'), why:'' }
    ];
    G.modal({
      title:'Che luce scegli?', sub:'Energia', ico:'sun', col:'#E9B44C',
      body:`<p>La lampadina del salotto si è fulminata. Quale compri?</p>
        <div class="choices">${opts.map(o => `<button class="choice" data-k="${o.k}">${o.b}<b>${o.n}</b><small>${o.s}</small></button>`).join('')}</div><div id="lOut"></div>`,
      onMount: el => {
        const out = el.querySelector('#lOut');
        $$(el, '.choice').forEach(b => b.onclick = () => {
          const o = opts.find(x => x.k === b.dataset.k);
          if (o.k !== 'led'){ b.classList.add('wrong'); out.innerHTML = fact(G, o.why, true); return; }
          $$(el, '.choice').forEach(x => x.disabled = true);
          b.classList.add('right');
          G.S.lamp = 'led';
          out.innerHTML = fact(G, 'Un LED consuma circa l\'80% in meno di una lampadina a incandescenza e dura molti anni. Scegli la tonalità "luce calda" per un salotto accogliente.') +
            `<div style="text-align:right"><button class="gbtn green" id="lOk">Avvita il LED</button></div>`;
          G.complete('lampadina', { meters:{ energia:15 }, points:20, badge:{ t:'Luce efficiente', ico:'sun', col:'#E9B44C' } });
          el.querySelector('#lOk').onclick = () => G.closeModal();
        });
      }
    });
  }

  function termostato(G){
    const fb = t => t >= 22 ? ['Fa caldo come d\'estate: ogni grado in più pesa sui consumi e sulla bolletta.', '#D9734E']
      : t === 21 ? ['Ci siamo quasi. Prova a scendere ancora di un grado o due.', '#E9B44C']
      : t >= 19 ? ['Perfetto: 19-20 °C è la temperatura consigliata in casa d\'inverno.', '#7FA37A']
      : ['Così si risparmia, ma si sta al freddo. Un buon equilibrio è 19-20 °C.', '#5F9BBE'];
    G.modal({
      title:'Il termostato', sub:'Energia · Riscaldamento', ico:'thermo', col:'#C0563A',
      body:`<p>È gennaio e in casa ci sono ${G.S.temp} °C. Imposta la temperatura giusta.</p>
        <div class="thermo"><div class="dial" id="tDial"><div><span><b id="tVal"></b><br><small>°C</small></span></div></div>
          <div style="flex:1"><input type="range" min="15" max="25" step="1" id="tIn" value="${G.S.temp}" aria-label="Temperatura">
          <div style="display:flex;justify-content:space-between;font-weight:800;font-size:.8em;color:var(--ink-3)"><span>15 °C</span><span>25 °C</span></div>
          <div class="tfb" id="tFb"></div></div></div><div id="tOut"></div>`,
      foot:`<button class="gbtn" id="tOk">Conferma</button>`,
      onMount: el => {
        const inp = el.querySelector('#tIn'), dial = el.querySelector('#tDial');
        const paint = () => {
          const t = +inp.value, [txt, col] = fb(t);
          el.querySelector('#tVal').textContent = t;
          el.querySelector('#tFb').textContent = txt;
          dial.style.setProperty('--tp', (t - 15) * 10); dial.style.setProperty('--tc', col);
        };
        inp.oninput = paint; paint();
        el.querySelector('#tOk').onclick = () => {
          const t = +inp.value, out = el.querySelector('#tOut');
          if (t < 19 || t > 20){ out.innerHTML = fact(G, 'Non ancora: cerca la temperatura tra 19 e 20 °C.', true); return; }
          G.S.temp = t;
          out.innerHTML = fact(G, 'Ogni grado in meno può far risparmiare indicativamente il 5-10% sul riscaldamento. In Italia, d\'inverno, la norma indica 20 °C con 2 gradi di tolleranza.');
          const ok = el.querySelector('#tOk'); ok.textContent = 'Fatto'; ok.classList.add('green');
          ok.onclick = () => G.closeModal();
          G.complete('termostato', { meters:{ energia:20 }, points:25, badge:{ t:'Clima giusto', ico:'thermo', col:'#C0563A' } });
        };
      }
    });
  }

  const BINS = [
    { k:'carta', n:'Carta', col:'#4F86B8', ico:'book' },
    { k:'plastica', n:'Plastica e metalli', col:'#D9A13A', ico:'recycle' },
    { k:'vetro', n:'Vetro', col:'#5E8459', ico:'drop' },
    { k:'organico', n:'Organico', col:'#8A5A3C', ico:'leaf' },
    { k:'indiff', n:'Indifferenziato', col:'#7D7D7D', ico:'x' }
  ];
  const WASTE_ART = { 'Giornale':'giornale', "Bottiglia d'acqua":'bottiglia', 'Lattina':'lattina', 'Vasetto di marmellata':'vasetto', 'Torsolo di mela':'bucce', 'Scontrino':'scontrino', 'Tazzina rotta':'tazzina' };
  const WASTE = [
    { n:'Giornale', b:'carta' }, { n:'Bottiglia d\'acqua', b:'plastica' }, { n:'Lattina', b:'plastica',
      hint:'Lattine e barattoli di metallo di solito vanno con la plastica, o nel contenitore dei metalli.' },
    { n:'Vasetto di marmellata', b:'vetro' }, { n:'Torsolo di mela', b:'organico' },
    { n:'Scontrino', b:'indiff', hint:'Gli scontrini sono quasi sempre in carta termica: non si riciclano con la carta.' },
    { n:'Tazzina rotta', b:'indiff', hint:'La ceramica non va nel vetro: fonde a temperature diverse e rovina il riciclo.' }
  ];
  function cestino(G){
    G.modal({
      title:'Il bidone giusto', sub:'Rifiuti · Raccolta differenziata', ico:'recycle', col:'#7FA37A',
      body:`<p>Trascina ogni rifiuto nel contenitore giusto, oppure toccalo e poi tocca il contenitore.</p>
        <div class="sort-items">${WASTE.map((w, i) => `<button class="item" data-i="${i}">${ART[WASTE_ART[w.n]] || ''}${w.n}</button>`).join('')}</div>
        <div class="bins">${BINS.map(b => `<button class="bin" data-b="${b.k}" style="background:${b.col}">${G.icon(b.ico, 2.2)}${b.n}<div class="cnt"></div></button>`).join('')}</div>
        <div class="sort-fb" id="sFb"></div>
        <p class="small-note">Le regole cambiano da comune a comune: nel gioco completo si imposta il proprio.</p>`,
      onMount: el => {
        let sel = null, errors = 0, left = WASTE.length, drag = null;
        const fbEl = el.querySelector('#sFb');
        const drop = (item, binEl) => {
          const w = WASTE[+item.dataset.i];
          if (w.b === binEl.dataset.b){
            binEl.querySelector('.cnt').insertAdjacentHTML('beforeend', `<span>${w.n}</span>`);
            item.remove(); left--; sel = null;
            fbEl.style.color = 'var(--sage-d)'; fbEl.textContent = 'Giusto, ben fatto.';
            if (!left) finish();
          } else {
            errors++;
            item.classList.remove('shake'); void item.offsetWidth; item.classList.add('shake');
            fbEl.style.color = 'var(--terra-d)'; fbEl.textContent = w.hint || 'Quasi! Prova un altro contenitore.';
          }
          $$(el, '.bin').forEach(b => b.classList.remove('target', 'over'));
        };
        const finish = () => {
          const gain = Math.max(20, 40 - errors * 5);
          fbEl.innerHTML = '';
          el.querySelector('.sort-items').outerHTML = fact(G, errors ? `Fatto, con ${errors} ${errors === 1 ? 'errore' : 'errori'}. Gli inciampi più comuni sono proprio scontrini, ceramica e metalli.` : 'Perfetto, nessun errore! Scontrini, ceramica e metalli ingannano quasi tutti.') +
            `<div style="text-align:right;margin-bottom:.8em"><button class="gbtn green" id="sOk">Fatto</button></div>`;
          el.querySelector('#sOk').onclick = () => G.closeModal();
          G.complete('cestino', { meters:{ rifiuti:gain }, points:30, badge:{ t:'Il bidone giusto', ico:'recycle', col:'#7FA37A' },
            who:'Luca', say:'Lo scontrino nell\'indifferenziato? Anch\'io lo buttavo nella carta!' });
        };
        const endDrag = (e, cancelled) => {
          const d = drag; drag = null;
          if (!d) return;
          d.item.style.opacity = '';
          if (d.clone) d.clone.remove();
          $$(el, '.bin').forEach(b => b.classList.remove('over'));
          if (cancelled) return;
          if (d.clone){
            const bin = document.elementFromPoint(e.clientX, e.clientY)?.closest('.bin');
            if (bin) drop(d.item, bin);
          } else {
            $$(el, '.item').forEach(x => x.classList.toggle('sel', x === d.item && sel !== d.item));
            sel = sel === d.item ? null : d.item;
            $$(el, '.bin').forEach(b => b.classList.toggle('target', !!sel));
          }
        };
        $$(el, '.item').forEach(item => {
          item.addEventListener('pointerdown', e => {
            if (e.button !== 0) return;
            if (drag) endDrag(e, true);
            drag = { item, x:e.clientX, y:e.clientY, clone:null };
            try { item.setPointerCapture(e.pointerId); } catch (_) {}
          });
          item.addEventListener('pointerup', e => { if (drag && drag.item === item) endDrag(e, false); });
          item.addEventListener('pointercancel', e => { if (drag && drag.item === item) endDrag(e, true); });
          item.addEventListener('lostpointercapture', e => { if (drag && drag.item === item) endDrag(e, true); });
          item.addEventListener('pointermove', e => {
            if (!drag || drag.item !== item) return;
            if (!drag.clone && Math.hypot(e.clientX - drag.x, e.clientY - drag.y) > 6){
              drag.clone = item.cloneNode(true);
              drag.clone.classList.add('drag');
              drag.clone.style.fontSize = getComputedStyle(item).fontSize;
              document.body.append(drag.clone);
              item.style.opacity = .3;
            }
            if (drag.clone){
              drag.clone.style.left = e.clientX - drag.clone.offsetWidth / 2 + 'px';
              drag.clone.style.top = e.clientY - drag.clone.offsetHeight / 2 + 'px';
              const over = document.elementFromPoint(e.clientX, e.clientY)?.closest('.bin');
              $$(el, '.bin').forEach(b => b.classList.toggle('over', b === over));
            }
          });
        });
        $$(el, '.bin').forEach(b => b.onclick = () => { if (sel) drop(sel, b); });
      }
    });
  }

  const FOOD = [
    { e:'zucchine', n:'Zucchine', s:'Molto mature', u:true }, { e:'pomodorini', n:'Pomodorini', s:'Da usare oggi', u:true },
    { e:'spinaci', n:'Spinaci in busta', s:'Da consumarsi entro domani', u:true }, { e:'riso', n:'Riso avanzato', s:'Cucinato ieri', u:true },
    { e:'uova', n:'Uova', s:'Preferibilmente entro 12 giorni' }, { e:'formaggio', n:'Formaggio stagionato', s:'Preferibilmente entro 20 giorni' },
    { e:'latte', n:'Latte UHT chiuso', s:'Preferibilmente entro 2 mesi' }, { e:'carote', n:'Carote', s:'Fresche, durano una settimana' }
  ];
  function frigo(G){
    G.modal({
      title:'Svuota-frigo', sub:'Cucina · Spreco alimentare', ico:'leaf', col:'#D9A13A',
      body:`<p>Paola ti aiuta con la cena. Scegli <b>4 ingredienti</b>, dando la precedenza a quello che rischia di andare buttato.</p>
        <div class="fridge">${FOOD.map((f, i) => `<button class="food" data-i="${i}"><span class="fe">${ART[f.e]}</span><b>${f.n}</b><small>${f.s}</small></button>`).join('')}</div>
        <div id="fOut"></div>`,
      foot:`<button class="gbtn" id="fGo" disabled>Cucina (0/4)</button>`,
      onMount: el => {
        const picked = new Set(), go = el.querySelector('#fGo'), out = el.querySelector('#fOut');
        $$(el, '.food').forEach(b => b.onclick = () => {
          const i = +b.dataset.i;
          if (picked.has(i)) picked.delete(i); else if (picked.size < 4) picked.add(i);
          $$(el, '.food').forEach(x => x.classList.toggle('sel', picked.has(+x.dataset.i)));
          go.textContent = `Cucina (${picked.size}/4)`; go.disabled = picked.size < 4;
        });
        go.onclick = () => {
          const good = [...picked].filter(i => FOOD[i].u).length;
          $$(el, '.food').forEach(x => {
            const f = FOOD[+x.dataset.i];
            x.classList.remove('sel');
            if (f.u) x.classList.add(picked.has(+x.dataset.i) ? 'right' : 'miss');
            x.disabled = true;
          });
          if (good < 3){
            out.innerHTML = fact(G, `Hai salvato ${good} ingredienti su 4 a rischio. Quelli in giallo andavano usati prima.`, true);
            go.textContent = 'Riprova'; go.disabled = false;
            go.onclick = () => { G.closeModal(true); frigo(G); };
            return;
          }
          const veg = [...picked].filter(i => FOOD[i].u && i !== 3).map(i => FOOD[i].n.split(' ')[0].toLowerCase());
          const list = veg.length > 1 ? veg.slice(0, -1).join(', ') + ' e ' + veg[veg.length - 1] : veg[0];
          const withRice = picked.has(3);
          const dish = withRice ? `Riso saltato con ${list}` : `Frittata con ${list}`;
          const line = withRice ? 'Quindici minuti in padella e il riso di ieri torna come nuovo.' : 'Le uova tengono insieme tutto: dieci minuti e la cena è pronta.';
          out.innerHTML = `<div class="recipe">${G.face('Paola')}<div><b>${dish}</b>
            <p>"${line} Non si butta niente!"</p></div></div>` +
            fact(G, '"Da consumarsi entro" è una data di sicurezza: dopo, il prodotto non va mangiato. "Da consumarsi preferibilmente entro" riguarda la qualità: se ben conservato, spesso il prodotto è buono anche dopo.');
          go.textContent = 'Fatto'; go.classList.add('green');
          go.onclick = () => G.closeModal();
          G.complete('frigo', { meters:{ spesa:30, rifiuti:10 }, points:30, badge:{ t:'Salva-avanzi', ico:'leaf', col:'#D9A13A' } });
        };
      }
    });
  }

  const ROUNDS = [
    { q:'Acqua da bere', a:{ e:'bottiglie', n:'Cassa da 6 bottiglie', s:'Plastica da smaltire ogni settimana' },
      b:{ e:'borraccia', n:'Borraccia e acqua di casa', s:'Riempi quando serve' }, ok:'b',
      why:'In Italia l\'acqua di rete è controllata: dove è buona, la borraccia evita molta plastica e costa molto meno.' },
    { q:'Frutta a gennaio', a:{ e:'fragole', n:'Fragole', s:'Arrivano da lontano o da serra' },
      b:{ e:'arance', n:'Arance', s:'In piena stagione' }, ok:'b',
      why:'La frutta di stagione di solito viaggia meno, costa meno e ha più sapore.' },
    { q:'Detersivo per i piatti', a:{ e:'monodose', n:'Monodose', s:'Ogni pastiglia incartata' },
      b:{ e:'ricarica', n:'Ricarica concentrata', s:'Riusi il flacone' }, ok:'b',
      why:'Le ricariche e i prodotti concentrati riducono imballaggi e trasporti.' },
    { q:'Lavare la verdura', a:{ e:'rubinetto', n:'Sotto l\'acqua corrente', s:'Il rubinetto resta aperto' },
      b:{ e:'bacinella', n:'In una bacinella', s:'Poi l\'acqua va alle piante' }, ok:'b',
      why:'Con la bacinella si usa molta meno acqua, e quella avanzata si può riusare per innaffiare.' }
  ];
  function dispensa(G){
    let r = 0, score = 0;
    G.modal({
      title:'La spesa consapevole', sub:'Cucina · Spesa', ico:'cart', col:'#E2001A', body:'<div id="pBox"></div>',
      onMount: el => {
        const box = el.querySelector('#pBox');
        const show = () => {
          const R = ROUNDS[r];
          box.innerHTML = `<div class="round">Scelta ${r + 1} di ${ROUNDS.length} · ${R.q}<span class="steps">${ROUNDS.map((_, j) => `<i class="${j <= r ? 'on' : ''}"></i>`).join('')}</span></div>
            <div class="pair">${['a', 'b'].map(k => `<button class="prod" data-k="${k}"><span class="pe">${ART[R[k].e]}</span><span><b>${R[k].n}</b><small>${R[k].s}</small></span></button>`).join('')}</div>
            <div id="pOut"></div>
            <div class="coop-strip"><img src="imgs/logo_coop.png" alt="Coop">Nel gioco completo qui trovi i prodotti Coop, per esempio la linea Vivi Verde, con le loro schede.</div>`;
          $$(box, '.prod').forEach(b => b.onclick = () => {
            const right = b.dataset.k === R.ok;
            if (right) score++;
            $$(box, '.prod').forEach(x => { x.disabled = true; x.classList.add(x.dataset.k === R.ok ? 'right' : 'wrong'); });
            const last = r === ROUNDS.length - 1;
            box.querySelector('#pOut').innerHTML = fact(G, R.why, !right) +
              `<div style="text-align:right"><button class="gbtn${last ? ' green' : ''}" id="pNext">${last ? 'Alla cassa' : 'Avanti'}</button></div>`;
            box.querySelector('#pNext').onclick = () => {
              if (!last){ r++; return show(); }
              box.innerHTML = fact(G, `Carrello completato: ${score} scelte sostenibili su ${ROUNDS.length}. Meno plastica, meno acqua sprecata, più stagionalità.`) +
                `<div style="text-align:right"><button class="gbtn green" id="pOk">Fatto</button></div>`;
              box.querySelector('#pOk').onclick = () => G.closeModal();
              G.complete('dispensa', { meters:{ spesa:25, acqua:25, rifiuti:10 }, points:30, badge:{ t:'Spesa consapevole', ico:'cart', col:'#E2001A' },
                who:'Paola', say:'Brava squadra! Con la lista giusta, al punto vendita ci metti anche meno tempo.' });
            };
          });
        };
        show();
      }
    });
  }

  window.CLGames = { tv, libreria, ciabatta, lampadina, termostato, cestino, frigo, dispensa };
})();
