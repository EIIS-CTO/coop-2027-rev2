(function(){
  const { makeIso, shade } = window.CL;
  const iso = makeIso(44);
  const { box, slab, pts, P, onX, onY, onZ } = iso;

  // deterministic pseudo-random (stable book colours, plank tones, etc.)
  let seed = 7;
  const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;

  const hot = (id, inner, hit = '') =>
    `<g class="hot" data-hot="${id}">${inner}${!hit ? '' : hit[0] === '<' ? hit : `<polygon class="hit" points="${hit}"/>`}</g>`;
  const hitCircle = (x, y, z, r) => { const [cx, cy] = P(x, y, z); return `<circle class="hit" cx="${cx}" cy="${cy}" r="${r}"/>`; };
  const at = (x, y, z) => P(x, y, z).map(n => n.toFixed(1));
  const poly = (arr, fill, extra = '') => `<polygon points="${pts(arr)}" fill="${fill}" ${extra}/>`;

  // local 2D drawing on a wall: 1 unit = 1px, x to the right, y down
  const onWallY = (x, z, inner, y0 = 0) => { const [sx, sy] = P(x, y0, z); return `<g transform="matrix(.866,.5,0,1,${sx.toFixed(1)},${sy.toFixed(1)})">${inner}</g>`; };
  const onWallX = (y, z, inner) => { const [sx, sy] = P(0, y, z); return `<g transform="matrix(.866,-.5,0,1,${sx.toFixed(1)},${sy.toFixed(1)})">${inner}</g>`; };
  const textOnY = (x, z, str, size, col, y0 = 0) => onWallY(x, z, `<text font-family="Fredoka,Nunito,sans-serif" font-weight="600" font-size="${size}" fill="${col}">${str}</text>`, y0);
  const textOnX = (y, z, str, size, col) => onWallX(y, z, `<text font-family="Fredoka,Nunito,sans-serif" font-weight="600" font-size="${size}" fill="${col}">${str}</text>`);

  const shadow = (x, y, w, d, k = 1) =>
    poly([[x - .06, y + .04, 0], [x + w + .12 * k, y + .04, 0], [x + w + .2 * k, y + d + .32 * k, 0], [x - .02, y + d + .32 * k, 0]], 'rgba(74,40,18,.26)');

  function shell(W, D, H, o){
    let s = '';
    s += poly([[-.3,D,-.45],[W,D,-.45],[W,D,0],[-.3,D,0]], o.slabL);
    s += poly([[W,-.3,-.45],[W,D,-.45],[W,D,0],[W,-.3,0]], o.slabR);
    s += `<polyline points="${pts([[-.3,D,0],[W,D,0],[W,-.3,0]])}" fill="none" stroke="${shade(o.slabL, .3)}" stroke-width="1.2"/>`;
    s += o.floor;
    s += `<polygon points="${onX(0, 0, 0, D, H)}" fill="${o.wallL}"/>`;
    if (o.stripes) for (let y = 0.4; y < D; y += 0.9) s += `<polygon points="${onX(0, y, 0.22, y + 0.14, H - .2)}" fill="#fff" opacity=".14"/>`;
    s += `<polygon points="${onY(0, 0, 0, W, H)}" fill="${o.wallR}"/>`;
    if (o.texture) for (let x = .5; x < W; x += .9) for (let z = .6; z < H - .3; z += .7)
      s += `<circle cx="${at(x + (z * 3 % 1) * .3, 0, z)[0]}" cy="${at(x + (z * 3 % 1) * .3, 0, z)[1]}" r="1.1" fill="${shade(o.wallR, -0.06)}"/>`;
    // ambient occlusion: walls darken towards the floor and into the corner
    s += `<polygon points="${onX(0, 0, 0, D, 1.2)}" fill="url(#aoV)"/><polygon points="${onY(0, 0, 0, W, 1.2)}" fill="url(#aoV)"/>`;
    s += `<polygon points="${onY(0, 0, 0, 1.1, H)}" fill="url(#aoH)"/>`;
    // skirting boards and crown moulding
    s += `<polygon points="${onX(0, 0, 0, D, 0.22)}" fill="${o.base}"/><polygon points="${onY(0, 0, 0, W, 0.22)}" fill="${o.base}"/>`;
    s += `<polygon points="${onX(0, 0, .2, D, .24)}" fill="${shade(o.base, .35)}"/><polygon points="${onY(0, 0, .2, W, .24)}" fill="${shade(o.base, .35)}"/>`;
    s += `<polygon points="${onX(0, 0, H - .16, D, H)}" fill="${shade(o.wallL, .25)}"/><polygon points="${onY(0, 0, H - .16, W, H)}" fill="${shade(o.wallR, .3)}"/>`;
    s += `<polygon points="${onX(0, 0, H - .18, D, H - .16)}" fill="${shade(o.wallL, -0.12)}"/><polygon points="${onY(0, 0, H - .18, W, H - .16)}" fill="${shade(o.wallR, -0.1)}"/>`;
    // cut wall tops
    s += poly([[-.3,-.3,H],[0,-.3,H],[0,D,H],[-.3,D,H]], '#6B4E3D');
    s += poly([[-.3,-.3,H],[W,-.3,H],[W,0,H],[-.3,0,H]], '#6B4E3D');
    s += `<polyline points="${pts([[0,D,H],[0,0,H],[W,0,H]])}" fill="none" stroke="#8A6A55" stroke-width="1"/>`;
    s += poly([[-.3,D,0],[0,D,0],[0,D,H],[-.3,D,H]], shade(o.wallL, -0.14));
    s += poly([[W,-.3,0],[W,0,0],[W,0,H],[W,-.3,H]], shade(o.wallR, -0.22));
    return s;
  }

  function woodFloor(W, D){
    const tones = ['#DDB283', '#D7AA7A', '#E2B98B', '#D9AE7F', '#E0B486'];
    let f = `<polygon points="${onZ(0, 0, 0, W, D)}" fill="#DDB283"/>`;
    for (let i = 0; i < W * 2; i++){
      const x = i / 2;
      let y = -(rnd() * 2);
      while (y < D){
        const len = 1.6 + rnd() * 1.8, y1 = Math.max(0, y), y2 = Math.min(D, y + len);
        if (y2 > y1) f += `<polygon points="${onZ(0, x, y1, x + .5, y2)}" fill="${tones[Math.floor(rnd() * tones.length)]}" stroke="#A9764A" stroke-opacity=".22" stroke-width=".8"/>`;
        if (rnd() < .35){ const gy = y1 + (y2 - y1) * (.3 + rnd() * .4); f += `<line x1="${at(x + .12, gy, 0)[0]}" y1="${at(x + .12, gy, 0)[1]}" x2="${at(x + .38, gy + .25, 0)[0]}" y2="${at(x + .38, gy + .25, 0)[1]}" stroke="#B8875A" stroke-opacity=".25" stroke-width=".8"/>`; }
        y += len;
      }
    }
    return f;
  }

  function windowY(x1, x2, z1, z2, o = {}){
    const xm = (x1 + x2) / 2, zm = (z1 + z2) / 2;
    let s = '';
    if (o.curtain){
      // curtain rod and folded panels
      const c = o.curtain;
      [[x1 - .75, x1 - .08], [x2 + .08, x2 + .75]].forEach(([a, b]) => {
        const n = 5, w = (b - a) / n;
        for (let i = 0; i < n; i++) s += `<polygon points="${onY(.03, a + i * w, .85, a + (i + 1) * w, z2 + .38)}" fill="${i % 2 ? shade(c, -0.1) : c}"/>`;
        s += `<polygon points="${onY(.031, a, .85, b, .95)}" fill="${shade(c, -0.18)}"/>`;
      });
      s += `<polygon points="${onY(.035, x1 - .9, z2 + .36, x2 + .9, z2 + .44)}" fill="#7A5236"/>`;
      [x1 - .92, x2 + .92].forEach(x => { const [cx, cy] = P(x, .035, z2 + .4); s += `<circle cx="${cx}" cy="${cy}" r="3.4" fill="#5E3E28"/>`; });
    }
    s += `<polygon points="${onY(0, x1 - .12, z1 - .12, x2 + .12, z2 + .12)}" fill="#FFFFFF" stroke="#D9C8B3" stroke-width=".8"/>`;
    s += `<polygon points="${onY(0, x1 + .05, z1 + .05, x2 - .05, z2 - .05)}" fill="url(#sky)"/>`;
    // tuscan hills and cypresses
    const zb = z1 + .05, w = x2 - x1;
    s += poly([[x1 + .05, 0, zb], [x1 + .05, 0, zb + .55], [x1 + w * .35, 0, zb + .85], [x1 + w * .7, 0, zb + .5], [x2 - .05, 0, zb + .7], [x2 - .05, 0, zb]], '#B9CDA2');
    s += poly([[x1 + .05, 0, zb], [x1 + .05, 0, zb + .3], [x1 + w * .5, 0, zb + .45], [x2 - .05, 0, zb + .25], [x2 - .05, 0, zb]], '#9DBB7E');
    [[x1 + w * .22, .75], [x1 + w * .3, .55], [x1 + w * .78, .7]].forEach(([cx, hgt]) =>
      s += poly([[cx, 0, zb + .2], [cx - .07, 0, zb + .2 + hgt * .45], [cx, 0, zb + .2 + hgt], [cx + .07, 0, zb + .2 + hgt * .45]], '#5E7F4E'));
    s += `<g class="cloud">${poly([[x1 + .4, 0, zm + .55], [x1 + .75, 0, zm + .75], [x1 + 1.15, 0, zm + .62], [x1 + .9, 0, zm + .5]], '#fff', 'opacity=".85"')}</g>`;
    s += `<polygon points="${onY(0, x1 + .2, z2 - .55, x1 + .5, z2 - .1)}" fill="#fff" opacity=".22"/>`;
    s += `<polygon points="${onY(0, xm - .05, z1, xm + .05, z2)}" fill="#fff"/><polygon points="${onY(0, x1, zm - .05, x2, zm + .05)}" fill="#fff"/>`;
    s += box(x1 - .28, 0, z1 - .22, x2 - x1 + .56, .3, .1, '#FFFFFF');
    return s;
  }

  function plant(x, y, sc = 1, pot = '#C0704A', z = 0){
    let s = box(x, y, z, .6 * sc, .6 * sc, .62 * sc, pot);
    s += box(x - .03 * sc, y - .03 * sc, z + .58 * sc, .66 * sc, .66 * sc, .08 * sc, shade(pot, .1));
    s += `<polygon points="${onZ(z + .66 * sc, x + .05 * sc, y + .05 * sc, x + .55 * sc, y + .55 * sc)}" fill="#5A3B26"/>`;
    const [cx, cy] = P(x + .3 * sc, y + .3 * sc, z + .62 * sc);
    const leaves = [[-14,-22,9,20,-25],[12,-24,9,20,25],[0,-34,8,22,0],[-20,-8,8,16,-55],[20,-10,8,16,55],[-6,-18,7,15,-10],[8,-16,7,15,15],[-10,-30,6,13,-15],[11,-33,6,13,18]];
    s += `<g class="sway" style="transform-origin:${cx}px ${cy}px">` + leaves.map(([dx, dy, rx, ry, r], i) => {
      const ex = cx + dx * sc, ey = cy + dy * sc;
      return `<ellipse cx="${ex}" cy="${ey}" rx="${rx * sc}" ry="${ry * sc}" transform="rotate(${r} ${ex} ${ey})" fill="${['#5E8459','#7FA37A','#4E7349'][i % 3]}"/>` +
        `<line x1="${ex}" y1="${ey + ry * sc * .8}" x2="${ex}" y2="${ey - ry * sc * .7}" transform="rotate(${r} ${ex} ${ey})" stroke="#3E5E3A" stroke-width=".8" opacity=".45"/>`;
    }).join('') + `</g>`;
    return s;
  }

  function clockX(y, z, r = 15){
    const d = new Date(), sec = d.getSeconds(), min = d.getMinutes() + sec / 60, hr = (d.getHours() % 12) + min / 60;
    let t = '';
    for (let i = 0; i < 12; i++){ const a = i * Math.PI / 6; t += `<line x1="${(Math.sin(a) * r * .78).toFixed(1)}" y1="${(-Math.cos(a) * r * .78).toFixed(1)}" x2="${(Math.sin(a) * r * .9).toFixed(1)}" y2="${(-Math.cos(a) * r * .9).toFixed(1)}" stroke="#6B5A4E" stroke-width="${i % 3 ? .8 : 1.6}"/>`; }
    const hand = (len, w, col, deg, dur) => `<line x1="0" y1="2" x2="0" y2="${-len}" stroke="${col}" stroke-width="${w}" stroke-linecap="round"><animateTransform attributeName="transform" type="rotate" from="${deg} 0 0" to="${deg + 360} 0 0" dur="${dur}s" repeatCount="indefinite"/></line>`;
    return onWallX(y, z, `<circle r="${r + 2.5}" fill="#8A5A3C"/><circle r="${r}" fill="#FFFDF6"/>${t}` +
      hand(r * .5, 2.2, '#3A2E28', hr * 30, 43200) + hand(r * .75, 1.5, '#3A2E28', min * 6, 3600) + hand(r * .82, .8, '#D9734E', sec * 6, 60) + `<circle r="1.6" fill="#3A2E28"/>`);
  }

  const steam = (x, y, z) => { const [cx, cy] = P(x, y, z);
    return `<g class="steam" transform="translate(${cx.toFixed(1)},${cy.toFixed(1)})"><path d="M0 0 q-4 -6 0 -12 q4 -6 0 -12" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/><path class="s2" d="M5 -2 q-4 -6 0 -12 q4 -6 0 -12" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/></g>`; };

  function lightBeam(x1, x2, ztop, zbot, fx1, fx2, fy){
    let s = `<polygon class="beam" points="${pts([[x1, 0, ztop], [x2, 0, ztop], [fx2, fy, 0], [fx1, fy, 0]])}" fill="url(#beam)"/>`;
    for (let i = 0; i < 9; i++){
      seed += 3;
      const t = rnd(), u = rnd(), xa = x1 + (x2 - x1) * u, x = xa + (fx1 + (fx2 - fx1) * u - xa) * t, y = fy * t, z = ztop * (1 - t) * .9 + .2;
      const [cx, cy] = P(x, y, z);
      s += `<circle class="mote" style="animation-delay:${(-rnd() * 9).toFixed(1)}s" cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${(1 + rnd() * 1.3).toFixed(1)}" fill="#FFF6D8"/>`;
    }
    return s;
  }

  /* =================== LIVING ROOM =================== */
  function living(st){
    seed = 7;
    const W = 9, D = 8, H = 4.6;
    let s = shell(W, D, H, { floor: woodFloor(W, D), wallL:'#EBCFAE', wallR:'#F6E5CC', base:'#D8BC98', slabL:'#A57B55', slabR:'#8C6544', stripes:true });

    // left wall: gallery, shelf over the TV, clock, socket
    s += `<polygon points="${onX(.01, 1.2, 2.2, 2.65, 3.55)}" fill="#fff" stroke="#8A5A3C" stroke-width="2.4"/>`;
    s += poly([[.02,1.35,2.35],[.02,1.85,3.0],[.02,2.15,2.65],[.02,2.5,3.15],[.02,2.5,2.35]], '#7FA37A');
    s += poly([[.02,1.35,2.35],[.02,1.7,2.7],[.02,2.0,2.35]], '#5E8459');
    s += `<circle cx="${at(.02,1.75,3.22)[0]}" cy="${at(.02,1.75,3.22)[1]}" r="6" fill="#E9B44C"/>`;
    s += `<polygon points="${onX(.01, 2.85, 3.05, 3.3, 3.55)}" fill="#fff" stroke="#8A5A3C" stroke-width="1.6"/><polygon points="${onX(.012, 2.92, 3.12, 3.23, 3.48)}" fill="#E9B44C" opacity=".7"/>`;
    s += `<polygon points="${onX(.01, 2.85, 2.3, 3.3, 2.85)}" fill="#fff" stroke="#8A5A3C" stroke-width="1.6"/><polygon points="${onX(.012, 2.92, 2.37, 3.23, 2.78)}" fill="#9CC5D9" opacity=".8"/>`;
    s += box(0, 3.45, 3.28, .42, 2.1, .08, '#9B6B47');
    s += box(.08, 3.65, 3.36, .26, .26, .26, '#F3EBDD') + `<g class="sway">${(() => { const [cx, cy] = P(.21, 3.78, 3.62); return `<ellipse cx="${cx - 5}" cy="${cy - 4}" rx="4" ry="8" transform="rotate(-25 ${cx - 5} ${cy - 4})" fill="#7FA37A"/><ellipse cx="${cx + 5}" cy="${cy - 4}" rx="4" ry="8" transform="rotate(25 ${cx + 5} ${cy - 4})" fill="#5E8459"/><ellipse cx="${cx}" cy="${cy - 8}" rx="3.5" ry="8" fill="#7FA37A"/>`; })()}</g>`;
    [['#D9734E', .32], ['#5F9BBE', .28], ['#E9B44C', .36]].forEach(([c, hh], i) => s += slab(.06, 4.5 + i * .16, 3.36, .3, .13, hh, c));
    s += box(.06, 5.1, 3.36, .32, .3, .18, '#3A3A40');
    s += clockX(6.55, 3.7, 15);
    s += `<polygon points="${onX(.01, 6.3, .3, 6.55, .55)}" fill="#FBFAF6" stroke="#CFC3B2" stroke-width=".8"/>`;

    // right wall: window with curtains, radiator, door
    s += windowY(4.9, 7.3, 1.75, 3.85, { curtain:'#9DBB7E' });
    s += box(5.1, .02, .35, 2.0, .22, .95, '#FBFBF8');
    for (let x = 5.22; x < 7.05; x += .2) s += `<polygon points="${onY(.245, x, .42, x + .09, 1.22)}" fill="#E8E5DE"/><polygon points="${onY(.246, x + .06, .42, x + .09, 1.22)}" fill="#D6D2C9"/>`;
    s += hot('door', doorY(7.6, 8.7, st.doorOpen), '');

    // floor: rug, doormat, pouf area
    s += `<polygon points="${onZ(.01, 2.2, 2.6, 6.9, 6.6)}" fill="#E9B44C"/>`;
    s += `<polygon points="${onZ(.012, 2.42, 2.82, 6.68, 6.38)}" fill="none" stroke="#F7DC98" stroke-width="3"/>`;
    s += `<polygon points="${onZ(.012, 2.7, 3.1, 6.4, 6.1)}" fill="none" stroke="#D99A35" stroke-width="1.4"/>`;
    for (let i = 0; i < 4; i++){ const cx = 3.3 + i * 1.05, cy = 4.6;
      s += poly([[cx, cy - .45, .013], [cx + .38, cy, .013], [cx, cy + .45, .013], [cx - .38, cy, .013]], '#D99A35', 'opacity=".55"'); }
    for (let y = 2.7; y < 6.55; y += .16){ s += `<line x1="${at(2.2, y, .01)[0]}" y1="${at(2.2, y, .01)[1]}" x2="${at(2.05, y, .01)[0]}" y2="${at(2.05, y, .01)[1]}" stroke="#E9C77A" stroke-width="1.2"/>`; }
    s += `<polygon points="${onZ(.01, 7.55, .2, 8.75, .85)}" fill="#8C6E52"/><polygon points="${onZ(.012, 7.65, .28, 8.65, .77)}" fill="none" stroke="#A88B6E" stroke-width="1.2"/>`;
    s += `<polygon class="sunpatch" points="${pts([[4.6,.3,0],[7.1,.3,0],[8.8,3.6,0],[6.3,3.6,0]])}" fill="#FFF4C9" opacity=".33"/>`;

    // contact shadows
    s += `<g filter="url(#soft)">` + shadow(.55, .55, .5, .5, .6) + shadow(1.4, .02, 2.8, .85) + shadow(4.3, .15, .55, .55, .6) +
      shadow(.05, 2.9, .95, 3.2) + shadow(1.15, 5.0, .28, 1.0, .3) + shadow(.35, 6.6, .7, .7) + shadow(2.9, 3.7, 1.3, 1.6, .8) +
      shadow(2.4, 6.0, .55, .55, .6) + shadow(5.4, 2.9, 1.55, 3.3) + shadow(5.55, 6.4, .6, .55, .6) + `</g>`;

    // floor lamp (hotspot)
    const led = st.lamp === 'led';
    const [lx, ly] = P(.8, .8, 3.05);
    let lamp = `<ellipse cx="${at(.8,.8,0)[0]}" cy="${at(.8,.8,0)[1]}" rx="14" ry="7" fill="#3E3E44"/>` + slab(.77, .77, .02, .06, .06, 2.95, '#4A4A50');
    lamp += `<circle class="glow" cx="${lx}" cy="${ly + 4}" r="${led ? 54 : 66}" fill="url(#${led ? 'gLed' : 'gInc'})"/>`;
    const sh1 = at(.8, .8, 3.65), sh2 = at(.8, .8, 2.95);
    lamp += `<path d="M${+sh1[0] - 13} ${sh1[1]} L${+sh1[0] + 13} ${sh1[1]} L${+sh2[0] + 21} ${sh2[1]} L${+sh2[0] - 21} ${sh2[1]} Z" fill="${led ? '#FFF8EA' : '#FFE2B0'}" stroke="#D9B98A" stroke-width=".8"/>`;
    lamp += `<ellipse cx="${sh2[0]}" cy="${sh2[1]}" rx="21" ry="5" fill="${led ? '#FFFDF2' : '#FFD58A'}"/><ellipse cx="${sh1[0]}" cy="${sh1[1]}" rx="13" ry="3" fill="#F3E2C2"/>`;
    s += hot('lampadina', lamp, pts([[.4,.4,0],[1.2,.4,0],[1.2,1.2,0],[1.2,1.2,3.7],[.4,1.2,3.7],[.4,.4,3.7]]));

    // bookshelf (hotspot)
    let shelf = box(1.4, .02, 0, 2.8, .85, 4.0, '#9B6B47');
    const bookCols = ['#D9734E','#5F9BBE','#E9B44C','#7FA37A','#A66BA6','#F3E6D3','#C0563A','#3E4A5C','#8A5A3C'];
    for (let k = 0; k < 4; k++){
      const z0 = .25 + k * .95;
      shelf += `<polygon points="${onY(.872, 1.55, z0, 4.05, z0 + .78)}" fill="#6E4A31"/><polygon points="${onY(.873, 1.55, z0 + .68, 4.05, z0 + .78)}" fill="#5A3B27"/>`;
      let x = 1.6;
      while (x < 3.9){
        const w = .1 + rnd() * .13, hh = .45 + rnd() * .27;
        if (k === 2 && x > 2.4 && x < 3.35){ x = 3.35; continue; }
        if (rnd() < .1){ // decor: small vase or stacked books
          if (rnd() < .5) shelf += `<polygon points="${onY(.874, x, z0, x + .22, z0 + .3)}" fill="#E8DCC8"/><polygon points="${onY(.875, x + .05, z0 + .3, x + .17, z0 + .4)}" fill="#E8DCC8"/>`;
          else for (let j = 0; j < 3; j++) shelf += `<polygon points="${onY(.874, x, z0 + j * .07, x + .3, z0 + j * .07 + .06)}" fill="${bookCols[(j + k) % bookCols.length]}"/>`;
          x += .34; continue;
        }
        const c = bookCols[Math.floor(rnd() * bookCols.length)];
        shelf += `<polygon points="${onY(.873, x, z0, Math.min(x + w, 4.0), z0 + hh)}" fill="${c}"/>`;
        shelf += `<polygon points="${onY(.874, x, z0 + hh * .72, Math.min(x + w, 4.0), z0 + hh * .78)}" fill="${shade(c, .35)}" opacity=".8"/>`;
        x += w + .018;
      }
    }
    shelf += `<polygon points="${onY(.874, 2.5, 2.15, 3.3, 2.75)}" fill="#E2001A"/><polygon points="${onY(.875, 2.5, 2.15, 2.56, 2.75)}" fill="#B80015"/>` + textOnY(2.66, 2.32, 'PDF', 13, '#fff', .876);
    shelf += plant(2.35, .25, .45, '#F3EBDD', 4.0);
    s += hot('libreria', shelf);

    // bin (hotspot)
    let bin = box(4.3, .15, 0, .55, .55, .72, '#7FA37A') + box(4.27, .12, .72, .61, .61, .07, '#5E8459');
    bin += box(4.45, .3, .79, .22, .05, .18, '#F7F2E6');
    bin += `<polygon points="${pts([[4.3, .701, .3], [4.85, .701, .3], [4.85, .701, .44], [4.3, .701, .44]])}" fill="#F3F7F0" opacity=".9"/>`;
    bin += `<polygon points="${pts([[4.851, .15, .3], [4.851, .7, .3], [4.851, .7, .44], [4.851, .15, .44]])}" fill="#DCE6D7" opacity=".85"/>`;
    s += hot('cestino', bin, '');

    // TV + cabinet (hotspot)
    const watched = st.done.tv;
    let tv = box(.05, 2.9, .08, .95, 3.2, .87, '#8A5A3C');
    [[.1, 2.95], [.1, 6.0], [.9, 2.95], [.9, 6.0]].forEach(([x, y]) => tv += slab(x, y, 0, .06, .06, .08, '#5A3B27'));
    tv += `<polygon points="${onX(1.001, 3.05, .2, 4.45, .85)}" fill="none" stroke="#6E4A31" stroke-width="1.2"/>`;
    tv += `<polygon points="${onX(1.001, 4.55, .2, 5.95, .85)}" fill="none" stroke="#6E4A31" stroke-width="1.2"/>`;
    [4.3, 4.7].forEach(y => tv += `<line x1="${at(1.002, y, .45)[0]}" y1="${at(1.002, y, .45)[1]}" x2="${at(1.002, y, .62)[0]}" y2="${at(1.002, y, .62)[1]}" stroke="#D9B98A" stroke-width="2" stroke-linecap="round"/>`);
    tv += slab(.38, 4.3, .95, .14, .4, .14, '#2E2C34');
    tv += box(.25, 3.15, 1.09, .18, 2.7, 1.62, '#2E2C34');
    tv += `<polygon class="screen" points="${onX(.432, 3.27, 1.18, 5.73, 2.62)}" fill="${watched ? 'url(#scrDone)' : 'url(#scrIdle)'}"/>`;
    tv += `<polygon points="${pts([[.433, 3.3, 2.58], [.433, 4.1, 2.58], [.433, 3.5, 1.5], [.433, 3.3, 1.5]])}" fill="#fff" opacity=".07"/>`;
    const [px, py] = P(.43, 4.5, 1.9);
    tv += watched
      ? `<path d="M${px - 10} ${py} l7 7 13-14" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`
      : `<circle cx="${px + 1}" cy="${py - 2}" r="13" fill="#fff" opacity=".14"/><path d="M${px - 4} ${py - 9} l12 7 -12 7z" fill="#fff" opacity=".92"/>`;
    tv += slab(.2, 5.4, .95, .6, .5, .14, '#3A3A40') + `<circle cx="${at(.8, 5.65, 1.02)[0]}" cy="${at(.8, 5.65, 1.02)[1]}" r="1.6" fill="${st.done.ciabatta ? '#7D8A7D' : '#FF3B30'}"/>`;
    s += hot('tv', tv);

    // power strip (hotspot)
    const standby = !st.done.ciabatta;
    const [ledX, ledY] = P(1.29, 5.12, .1);
    let strip = `<path d="M${at(1.29,5.0,.05).join(' ')} Q ${at(1.1,4.9,.2).join(' ')} ${at(1.0,4.6,.35).join(' ')}" fill="none" stroke="#333" stroke-width="2"/>`;
    strip += `<path d="M${at(1.29,6.0,.04).join(' ')} Q ${at(1.4,6.3,.02).join(' ')} ${at(.6,6.4,.3).join(' ')}" fill="none" stroke="#333" stroke-width="1.6"/>`;
    strip += box(1.15, 5.0, 0, .28, 1.0, .1, '#F2F2EE');
    [5.35, 5.6, 5.85].forEach(y => { const [cx, cy] = P(1.29, y, .1); strip += `<ellipse cx="${cx}" cy="${cy}" rx="3.2" ry="1.9" fill="#D9D6CE"/>`; });
    strip += `<circle cx="${ledX}" cy="${ledY}" r="3.6" fill="${standby ? '#FF3B30' : '#9AA39A'}" class="${standby ? 'blink' : ''}"/>`;
    if (standby) strip += `<circle cx="${ledX}" cy="${ledY}" r="7" fill="#FF3B30" opacity=".25" class="blink"/>`;
    s += hot('ciabatta', strip, hitCircle(1.29, 5.5, .05, 30));

    // round smart thermostat on the left wall (hotspot)
    const ok = st.done.termostato;
    const therm = onWallX(7.27, 2.5,
      `<circle r="15" fill="#FFFDF8" stroke="#CFC3B2" stroke-width="1"/>` +
      `<circle r="11.5" fill="none" stroke="#EEE6DA" stroke-width="2.6"/>` +
      `<circle r="11.5" fill="none" stroke="${ok ? '#5E8459' : '#D9734E'}" stroke-width="2.6" stroke-linecap="round" stroke-dasharray="${((st.temp - 15) / 10 * 72).toFixed(1)} 72.3" transform="rotate(-90)"/>` +
      `<text y="3.5" text-anchor="middle" font-family="Nunito" font-weight="800" font-size="9" fill="#3A2E28">${st.temp}°</text>`);
    s += hot('termostato', therm, hitCircle(0, 7.27, 2.5, 26));

    // plant, coffee table, pouf, sofa, side table
    s += plant(.35, 6.6, 1.15);
    s += box(2.9, 3.7, .38, 1.3, 1.6, .1, '#B98256');
    [[2.95, 3.75], [2.95, 5.2], [4.1, 3.75], [4.1, 5.2]].forEach(([x, y]) => s += slab(x, y, 0, .06, .06, .38, '#8A5A3C'));
    s += slab(2.98, 3.78, .12, 1.14, 1.44, .04, '#A87146');
    s += box(3.15, 4.05, .48, .5, .38, .06, '#5F9BBE') + box(3.18, 4.08, .54, .44, .34, .05, '#E9B44C');
    s += box(3.6, 4.65, .48, .17, .17, .2, '#FFFFFF') + steam(3.69, 4.73, .72);
    s += slab(3.85, 4.15, .48, .1, .3, .03, '#2E2C34');
    s += box(2.4, 6.0, 0, .55, .55, .38, '#5F8FB4') + `<polygon points="${onZ(.381, 2.5, 6.1, 2.85, 6.45)}" fill="none" stroke="${shade('#5F8FB4', .3)}" stroke-width="1.2"/>`;
    [[5.45, 2.95], [5.45, 6.1], [6.85, 2.95], [6.85, 6.1]].forEach(([x, y]) => s += slab(x, y, 0, .06, .06, .1, '#3A2416'));
    s += box(5.4, 2.9, .1, 1.5, 3.3, .6, '#D9734E');
    s += box(5.4, 2.9, .7, 1.05, .35, .45, '#C9603C');
    s += box(5.45, 3.25, .7, 1.0, 1.25, .17, '#E58A64') + box(5.45, 4.55, .7, 1.0, 1.25, .17, '#E58A64');
    s += box(6.45, 2.9, .7, .5, 3.3, 1.0, '#C9603C');
    s += box(6.2, 3.3, .87, .22, .62, .55, '#E9B44C') + box(6.18, 5.3, .87, .24, .55, .5, '#7FA37A');
    s += poly([[5.4, 5.85, 1.15], [6.45, 5.85, 1.15], [6.45, 6.2, 1.15], [6.45, 6.2, .55], [5.95, 6.2, .3], [5.95, 6.2, .9], [5.4, 6.2, 1.15]], '#F3E6D3');
    s += box(5.4, 5.85, .7, 1.05, .35, .45, '#C9603C');
    s += poly([[5.5, 6.2, 1.15], [6.0, 6.2, 1.15], [6.05, 6.21, .45], [5.65, 6.21, .55]], '#F3E6D3', 'opacity=".95"');
    [.7, .85, 1.0].forEach(z => s += `<line x1="${at(5.52, 6.215, z)[0]}" y1="${at(5.52, 6.215, z)[1]}" x2="${at(6.01, 6.215, z)[0]}" y2="${at(6.01, 6.215, z)[1]}" stroke="#D9734E" stroke-width="1.6" opacity=".7"/>`);
    s += box(5.55, 6.4, .5, .6, .55, .06, '#B98256') + slab(5.82, 6.64, 0, .07, .07, .5, '#8A5A3C') + `<ellipse cx="${at(5.85, 6.67, 0)[0]}" cy="${at(5.85, 6.67, 0)[1]}" rx="10" ry="5" fill="#8A5A3C"/>`;
    s += box(5.65, 6.5, .56, .2, .2, .2, '#F3EBDD') + steam(5.75, 6.6, .8);

    s += lightBeam(4.95, 7.25, 3.8, 1.8, 6.3, 8.8, 3.6);

    return {
      svg: s,
      markers: [
        { id:'tv', p:P(.35, 4.5, 3.2), ico:'tv', label:'Video lezione' },
        { id:'libreria', p:P(2.8, .45, 4.75), ico:'book', label:'Dispense' },
        { id:'lampadina', p:P(.8, .8, 4.1), ico:'sun', label:'Luce' },
        { id:'ciabatta', p:P(1.29, 5.5, .95), ico:'plug', label:'Stand-by' },
        { id:'termostato', p:P(0, 7.27, 3.25), ico:'thermo', label:'Termostato' },
        { id:'cestino', p:P(4.58, .42, 1.6), ico:'recycle', label:'Rifiuti' },
        { id:'door', p:P(8.15, 0, 4.0), ico:'door', label:'Cucina', door:true }
      ],
      spawn:[4.2, 7.0],
      toDoor:[[4.2,7.0],[7.95,7.0],[8.15,1.1],[8.15,.35]],
      fromDoor:[[8.15,.35],[8.15,1.4],[7.2,7.2]]
    };
  }

  function doorY(x1, x2, open){
    let s = `<polygon points="${onY(0, x1 - .14, 0, x2 + .14, 3.45)}" fill="#B98256"/><polygon points="${onY(.001, x1 - .14, 3.38, x2 + .14, 3.45)}" fill="#D4A577"/>`;
    if (open){
      s += `<polygon points="${onY(.001, x1, 0, x2, 3.3)}" fill="#FFE9B8"/>`;
      s += `<polygon points="${onY(.0015, x1, 0, x2, .9)}" fill="#F3D9A0"/>`;
      s += poly([[x1,0,0],[x1 + .55,.75,0],[x1 + .55,.75,3.3],[x1,0,3.3]], '#8A5A3C', 'stroke="#6E4A31"');
      s += `<polygon class="doorglow" points="${onY(.002, x1, 0, x2, 3.3)}" fill="none" stroke="#E9B44C" stroke-width="3"/>`;
    } else {
      s += `<polygon points="${onY(.001, x1, 0, x2, 3.3)}" fill="#8A5A3C"/>`;
      s += `<polygon points="${onY(.002, x1 + .14, 1.9, x2 - .14, 3.08)}" fill="${shade('#8A5A3C', -0.08)}" stroke="#6E4A31" stroke-width="1"/>`;
      s += `<polygon points="${onY(.002, x1 + .14, .2, x2 - .14, 1.65)}" fill="${shade('#8A5A3C', -0.08)}" stroke="#6E4A31" stroke-width="1"/>`;
      const [hx, hy] = P(x2 - .2, 0, 1.6);
      s += `<rect x="${hx - 2}" y="${hy - 4}" width="4" height="9" rx="2" fill="#C9A15A"/><circle cx="${hx + 2}" cy="${hy - 1}" r="3" fill="#E9B44C"/>`;
    }
    s += `<polygon points="${onY(.001, x1 + .05, 3.55, x2 - .05, 4.0)}" fill="#FFFDF8" stroke="#D9C8B3"/>`;
    s += textOnY(x1 + .15, 3.68, 'Cucina', 12, '#8A5A3C');
    return s;
  }

  /* =================== KITCHEN =================== */
  function kitchen(st){
    seed = 21;
    const W = 8, D = 7, H = 4.6;
    let floor = '';
    for (let i = 0; i < W; i++) for (let j = 0; j < D; j++){
      const c = (i + j) % 2 ? '#E7D6BC' : '#F3E8D6';
      floor += `<polygon points="${onZ(0, i, j, i + 1, j + 1)}" fill="${shade(c, (rnd() - .5) * .04)}" stroke="#D8C6A8" stroke-width=".7"/>`;
    }
    let s = shell(W, D, H, { floor, wallL:'#E6D8C2', wallR:'#F4EBDC', base:'#D2C1A8', slabL:'#A57B55', slabR:'#8C6544', texture:true });

    // backsplash and wall pieces
    s += `<polygon points="${onY(0, 1.6, 1.08, 6.4, 2.25)}" fill="#D6E6EA"/>`;
    for (let x = 1.6; x <= 6.41; x += .4) s += `<polygon points="${onY(.001, x, 1.08, x + .014, 2.25)}" fill="#fff"/>`;
    for (let z = 1.08; z <= 2.26; z += .39) s += `<polygon points="${onY(.001, 1.6, z, 6.4, z + .014)}" fill="#fff"/>`;
    s += windowY(3.1, 4.7, 2.4, 3.95, {});
    [3.3, 3.75, 4.2].forEach((x, i) => s += plant(x, .02, .32, ['#E9B44C', '#D9734E', '#F3EBDD'][i], 2.28));
    s += box(1.6, .02, 2.45, 1.3, .6, 1.3, '#F7F0E3');
    s += `<polygon points="${onY(.621, 1.68, 2.55, 2.21, 3.65)}" fill="none" stroke="#DCCFB9" stroke-width="1"/><polygon points="${onY(.621, 2.29, 2.55, 2.82, 3.65)}" fill="none" stroke="#DCCFB9" stroke-width="1"/>`;
    // extractor hood over the stove
    s += poly([[5.0, .02, 2.55], [6.2, .02, 2.55], [6.2, .75, 2.55], [5.0, .75, 2.55]], '#C9CFD3');
    s += poly([[5.0, .75, 2.55], [6.2, .75, 2.55], [5.95, .45, 2.95], [5.25, .45, 2.95]], '#DDE2E5');
    s += poly([[6.2, .02, 2.55], [6.2, .75, 2.55], [5.95, .45, 2.95], [5.95, .02, 2.95]], '#B9C0C5');
    s += box(5.35, .02, 2.95, .5, .35, 1.6, '#D3D9DC');
    // utensil rail
    s += `<polygon points="${onY(.03, 1.8, 2.02, 3.0, 2.06)}" fill="#8C8C90"/>`;
    [[1.95, 'spoon'], [2.3, 'ladle'], [2.65, 'whisk']].forEach(([x, t]) => {
      const [cx, cy] = P(x, .04, 2.04);
      s += `<line x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy + 22}" stroke="#7A5236" stroke-width="2"/>`;
      s += t === 'whisk' ? `<ellipse cx="${cx}" cy="${cy + 27}" rx="4" ry="7" fill="none" stroke="#A9B4BA" stroke-width="1.4"/>`
        : `<ellipse cx="${cx}" cy="${cy + 26}" rx="${t === 'ladle' ? 5 : 3.5}" ry="${t === 'ladle' ? 4 : 5}" fill="#A9B4BA"/>`;
    });
    // wall clock and a calendar
    s += onWallY(7.15, 3.6, `<circle r="17" fill="#8A5A3C"/><circle r="14.5" fill="#FFFDF6"/><line x1="0" y1="0" x2="0" y2="-9" stroke="#3A2E28" stroke-width="2" stroke-linecap="round"><animateTransform attributeName="transform" type="rotate" from="${(new Date().getHours() % 12) * 30} 0 0" to="${(new Date().getHours() % 12) * 30 + 360} 0 0" dur="43200s" repeatCount="indefinite"/></line><line x1="0" y1="0" x2="0" y2="-12" stroke="#3A2E28" stroke-width="1.4" stroke-linecap="round"><animateTransform attributeName="transform" type="rotate" from="${new Date().getMinutes() * 6} 0 0" to="${new Date().getMinutes() * 6 + 360} 0 0" dur="3600s" repeatCount="indefinite"/></line><circle r="1.6" fill="#3A2E28"/>`);
    s += `<polygon points="${onX(.01, 2.45, 2.2, 3.0, 3.15)}" fill="#FFFDF8" stroke="#CFC3B2" stroke-width=".8"/><polygon points="${onX(.012, 2.45, 2.95, 3.0, 3.15)}" fill="#D9734E"/>`;
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) s += `<polygon points="${onX(.013, 2.52 + c * .12, 2.3 + r * .15, 2.6 + c * .12, 2.39 + r * .15)}" fill="${r === 1 && c === 2 ? '#7FA37A' : '#E6DCCB'}"/>`;

    // runner rug and contact shadows
    s += `<polygon points="${onZ(.01, 2.0, 1.25, 6.1, 1.95)}" fill="#7FA37A"/><polygon points="${onZ(.012, 2.12, 1.33, 5.98, 1.87)}" fill="none" stroke="#A9C6A4" stroke-width="1.6"/>`;
    s += `<g filter="url(#soft)">` + shadow(1.6, .02, 4.8, .95, .6) + shadow(.05, .9, 1.0, 1.3) + shadow(.05, 3.3, .8, 2.2) +
      shadow(1.15, 4.75, .7, .32, .5) + shadow(3.4, 3.4, 1.8, 1.4) + shadow(3.0, 3.75, .45, .55, .5) + shadow(5.35, 3.8, .45, .55, .5) +
      shadow(4.05, 5.0, .55, .45, .5) + shadow(6.9, 5.9, .55, .55, .6) + `</g>`;

    // counters, sink, stove
    s += box(1.6, .02, .1, 4.8, .95, .9, '#F2EBDD') + slab(1.62, .9, 0, 4.76, .06, .1, '#C9BCA7');
    for (let x = 1.75; x < 6.3; x += 1.2){
      s += `<polygon points="${onY(.971, x, .2, x + 1.05, .9)}" fill="none" stroke="#CDBFAC" stroke-width="1.2"/>`;
      const [hx, hy] = P(x + .52, .972, .78); s += `<line x1="${hx - 6}" y1="${hy - 3.5}" x2="${hx + 6}" y2="${hy + 3.5}" stroke="#A9B4BA" stroke-width="2.2" stroke-linecap="round"/>`;
    }
    s += box(1.55, 0, 1.0, 4.9, 1.0, .08, '#9C8A78');
    s += `<polygon points="${onZ(1.081, 3.35, .2, 4.45, .75)}" fill="#C3CED4" stroke="#9AA8AF"/><polygon points="${onZ(1.079, 3.45, .28, 4.35, .67)}" fill="#AEBBC2"/>`;
    s += slab(3.86, .06, 1.08, .07, .07, .5, '#A9B4BA') + slab(3.86, .06, 1.55, .07, .35, .05, '#A9B4BA');
    s += box(4.55, .2, 1.08, .4, .5, .18, '#D3D9DC');
    [[4.62, .28], [4.75, .3], [4.86, .26]].forEach(([x, y]) => s += slab(x, y, 1.26, .03, .35, .22, '#FFFFFF'));
    s += `<polygon points="${onZ(1.081, 5.0, .18, 6.2, .82)}" fill="#3A3A40"/>`;
    [[5.3,.35],[5.85,.35],[5.3,.65],[5.85,.65]].forEach(([x, y]) => { const [cx, cy] = P(x, y, 1.082); s += `<ellipse cx="${cx}" cy="${cy}" rx="9" ry="5" fill="none" stroke="#777"/>`; });
    [5.2, 5.5, 5.8, 6.1].forEach(x => { const [cx, cy] = P(x, .973, .82); s += `<circle cx="${cx}" cy="${cy}" r="2.6" fill="#3A3A40"/>`; });
    s += box(5.12, .17, 1.08, .5, .5, .35, '#D9734E') + box(5.1, .15, 1.43, .54, .54, .04, '#C0563A') + steam(5.37, .42, 1.5);
    s += box(2.0, .2, 1.08, .75, .5, .05, '#C79A6B');
    [[2.15, .35, '#D9734E'], [2.32, .42, '#7FA37A'], [2.5, .33, '#E9B44C']].forEach(([x, y, c]) => { const [cx, cy] = P(x, y, 1.15); s += `<circle cx="${cx}" cy="${cy}" r="4.6" fill="${c}"/>`; });
    s += slab(2.55, .55, 1.13, .3, .05, .02, '#C9CED1');

    // fridge (hotspot)
    let fr = box(.05, .9, .04, 1.0, 1.3, 3.36, '#E8EEF0') + slab(.08, .93, 0, .94, 1.24, .05, '#9AA3A8');
    fr += `<polygon points="${onX(1.051, .9, 2.28, 2.2, 2.31)}" fill="#B9C4C9"/>`;
    fr += slab(1.05, 1.95, 2.45, .06, .06, .55, '#A9B4BA') + slab(1.05, 1.95, 1.2, .06, .06, .7, '#A9B4BA');
    fr += `<polygon points="${onX(1.052, 1.12, 2.62, 1.62, 3.08)}" fill="#FFF7D6"/>`;
    for (let i = 0; i < 4; i++) fr += `<line x1="${at(1.053, 1.18, 2.98 - i * .09)[0]}" y1="${at(1.053, 1.18, 2.98 - i * .09)[1]}" x2="${at(1.053, 1.52, 2.98 - i * .09)[0]}" y2="${at(1.053, 1.52, 2.98 - i * .09)[1]}" stroke="#CFC3A8" stroke-width=".8"/>`;
    fr += `<circle cx="${at(1.054,1.38,3.1)[0]}" cy="${at(1.054,1.38,3.1)[1]}" r="3" fill="#E2001A"/>`;
    fr += `<circle cx="${at(1.053,1.75,3.0)[0]}" cy="${at(1.053,1.75,3.0)[1]}" r="4" fill="#E9B44C"/>`;
    fr += `<polygon points="${onX(1.052, 1.15, 1.4, 1.55, 1.8)}" fill="#fff" stroke="#9CC5D9"/><circle cx="${at(1.053,1.35,1.62)[0]}" cy="${at(1.053,1.35,1.62)[1]}" r="3.5" fill="#7FA37A"/>`;
    s += hot('frigo', fr);

    // pantry + shopping bag (hotspot)
    let pa = box(.05, 3.3, 0, .8, 2.2, 3.0, '#B98256');
    const prod = ['#E2001A','#7FA37A','#E9B44C','#F3E6D3','#5F9BBE','#D9734E'];
    for (let k = 0; k < 3; k++){
      const z0 = .3 + k * .9;
      pa += `<polygon points="${onX(.851, 3.42, z0, 5.38, z0 + .72)}" fill="#7A5236"/><polygon points="${onX(.852, 3.42, z0 + .62, 5.38, z0 + .72)}" fill="#654229"/>`;
      for (let y = 3.5; y < 5.2; y += .32){
        const hh = .35 + rnd() * .3, c = prod[Math.floor(rnd() * prod.length)];
        if (k === 1 && rnd() < .55){ // glass jars with lids
          pa += `<polygon points="${onX(.853, y, z0, y + .24, z0 + hh * .8)}" fill="#EAF2F2" opacity=".9"/><polygon points="${onX(.854, y + .02, z0, y + .22, z0 + hh * .5)}" fill="${c}" opacity=".7"/><polygon points="${onX(.855, y - .01, z0 + hh * .8, y + .25, z0 + hh * .8 + .07)}" fill="#8A5A3C"/>`;
        } else {
          pa += `<polygon points="${onX(.853, y, z0, y + .24, z0 + hh)}" fill="${c}"/><polygon points="${onX(.854, y, z0 + hh * .55, y + .24, z0 + hh * .7)}" fill="#fff" opacity=".55"/>`;
        }
      }
    }
    pa += box(1.15, 4.75, 0, .7, .32, .8, '#F3EBDD');
    pa += `<path d="M${at(1.3, 4.9, .8).join(' ')} Q ${at(1.5, 4.9, 1.05).join(' ')} ${at(1.7, 4.9, .8).join(' ')}" fill="none" stroke="#D9CBB3" stroke-width="2"/>`;
    const [bx, by] = P(1.22, 5.071, .62);
    pa += `<image href="imgs/logo_coop.png" x="0" y="0" width="1280" height="498" transform="matrix(${.866 * .042},${.5 * .042},0,.042,${bx},${by})"/>`;
    const [vx, vy] = P(1.5, 4.9, .95);
    pa += `<circle cx="${vx - 6}" cy="${vy}" r="7" fill="#7FA37A"/><circle cx="${vx + 6}" cy="${vy - 3}" r="6" fill="#E9B44C"/><ellipse cx="${vx}" cy="${vy - 8}" rx="3" ry="9" fill="#5E8459"/><ellipse cx="${vx + 3}" cy="${vy - 12}" rx="2" ry="6" fill="#7FA37A"/>`;
    s += hot('dispensa', pa);

    s += hot('door', doorX(5.8, 6.9));

    // table with cloth, chairs
    const chair = (x, y, back) => { let c = box(x, y, .45, .45, .55, .06, '#9B6B47');
      [[x + .03, y + .03], [x + .36, y + .03], [x + .03, y + .46], [x + .36, y + .46]].forEach(([a, b]) => c = slab(a, b, 0, .06, .06, .45, '#7A5236') + c);
      if (back === 'x0') c = box(x, y, .51, .08, .55, .7, '#9B6B47') + c;
      if (back === 'x1') c += box(x + .37, y, .51, .08, .55, .7, '#9B6B47') + `<polygon points="${onX(x + .451, y + .1, .7, y + .45, .78)}" fill="${shade('#9B6B47', -0.25)}"/>`;
      if (back === 'y1') c += box(x, y + .47, .51, .45, .08, .7, '#9B6B47');
      return c; };
    s += chair(3.0, 3.75, 'x0');
    [[3.45, 3.45], [3.45, 4.75], [5.15, 3.45], [5.15, 4.75]].forEach(([x, y]) => s += slab(x, y, 0, .07, .07, .78, '#8A5A3C'));
    s += box(3.4, 3.4, .78, 1.8, 1.4, .07, '#B98256');
    s += poly([[3.55, 3.4, .851], [5.05, 3.4, .851], [5.05, 4.8, .851], [3.55, 4.8, .851]], '#FFFDF8') + poly([[3.55, 4.8, .851], [5.05, 4.8, .851], [5.05, 4.81, .5], [3.55, 4.81, .5]], '#F3EBDD');
    for (let i = 0; i < 6; i++) s += poly([[3.55 + i * .25, 4.81, .85], [3.68 + i * .25, 4.81, .85], [3.68 + i * .25, 4.815, .5], [3.55 + i * .25, 4.815, .5]], '#D9734E', 'opacity=".5"');
    const [fx, fy] = P(4.3, 4.1, .86);
    s += `<ellipse cx="${fx}" cy="${fy}" rx="20" ry="9" fill="#F3EBDD" stroke="#D8C6A8"/><circle cx="${fx - 7}" cy="${fy - 5}" r="6" fill="#E9B44C"/><circle cx="${fx + 6}" cy="${fy - 6}" r="6" fill="#D9734E"/><circle cx="${fx}" cy="${fy - 10}" r="5.5" fill="#7FA37A"/><circle cx="${fx + 2}" cy="${fy - 4}" r="2" fill="#fff" opacity=".35"/>`;
    s += box(4.75, 3.65, .86, .16, .16, .32, '#9CC5D9') + `<circle cx="${at(4.83, 3.73, 1.3)[0]}" cy="${at(4.83, 3.73, 1.3)[1]}" r="5" fill="#E9B44C"/><circle cx="${at(4.83, 3.73, 1.3)[0] - 5}" cy="${at(4.83, 3.73, 1.3)[1] - 3}" r="4" fill="#fff"/>`;
    s += chair(5.35, 3.8, 'x1');
    s += chair(4.05, 5.0, 'y1');
    s += plant(6.9, 5.9, .9);

    return {
      svg: s,
      markers: [
        { id:'frigo', p:P(.55, 1.55, 4.05), ico:'leaf', label:'Svuota-frigo' },
        { id:'dispensa', p:P(.45, 4.4, 3.6), ico:'cart', label:'La spesa' },
        { id:'door', p:P(0, 6.35, 4.0), ico:'door', label:'Salotto', door:true }
      ],
      spawn:[3.9, 6.4],
      toDoor:[[3.9,6.4],[.6,6.35],[.25,6.35]],
      fromDoor:[[.25,6.35],[1.0,6.35],[3.9,6.4]]
    };
  }

  function doorX(y1, y2){
    let s = `<polygon points="${onX(0, y1 - .14, 0, y2 + .14, 3.45)}" fill="#B98256"/>`;
    s += `<polygon points="${onX(.001, y1, 0, y2, 3.3)}" fill="#FFE9B8"/><polygon points="${onX(.0015, y1, 0, y2, .9)}" fill="#F3D9A0"/>`;
    s += poly([[0,y2,0],[.6,y2 - .5,0],[.6,y2 - .5,3.3],[0,y2,3.3]], '#8A5A3C', 'stroke="#6E4A31"');
    s += `<polygon points="${onX(.001, y1 + .05, 3.55, y2 - .05, 4.0)}" fill="#FFFDF8" stroke="#D9C8B3"/>`;
    s += textOnX(y2 - .14, 3.68, 'Salotto', 12, '#8A5A3C');
    return s;
  }

  window.CLRooms = { living, kitchen, P, VIEW:'-360 -250 740 680' };
})();
