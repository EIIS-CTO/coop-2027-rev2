(function(){
  const COS = Math.cos(Math.PI / 6);

  function makeIso(U){
    const P = (x, y, z = 0) => [(x - y) * U * COS, (x + y) * U * 0.5 - z * U];
    const pts = arr => arr.map(p => P(p[0], p[1], p[2] || 0).map(n => n.toFixed(1)).join(',')).join(' ');
    return {
      U, P, pts,
      /* box: draws top, front-left (+y) and front-right (+x) faces */
      box(x, y, z, w, d, h, col, extra = ''){
        const top = pts([[x,y,z+h],[x+w,y,z+h],[x+w,y+d,z+h],[x,y+d,z+h]]);
        const left = pts([[x,y+d,z],[x+w,y+d,z],[x+w,y+d,z+h],[x,y+d,z+h]]);
        const right = pts([[x+w,y,z],[x+w,y+d,z],[x+w,y+d,z+h],[x+w,y,z+h]]);
        const s = shade(col, -0.32);
        return `<g ${extra} stroke="${s}" stroke-width=".8" stroke-linejoin="round">` +
          `<polygon points="${left}" fill="${shade(col, -0.06)}"/>` +
          `<polygon points="${right}" fill="${shade(col, -0.2)}"/>` +
          `<polygon points="${top}" fill="${shade(col, 0.1)}"/>` +
          `<polyline points="${pts([[x,y+d,z+h],[x+w,y+d,z+h],[x+w,y,z+h]])}" fill="none" stroke="${shade(col, 0.42)}" stroke-width="1" opacity=".75"/></g>`;
      },
      /* flat box with no bevel, for very thin or very small parts */
      slab(x, y, z, w, d, h, col){
        const top = pts([[x,y,z+h],[x+w,y,z+h],[x+w,y+d,z+h],[x,y+d,z+h]]);
        const left = pts([[x,y+d,z],[x+w,y+d,z],[x+w,y+d,z+h],[x,y+d,z+h]]);
        const right = pts([[x+w,y,z],[x+w,y+d,z],[x+w,y+d,z+h],[x+w,y,z+h]]);
        return `<g><polygon points="${left}" fill="${shade(col, -0.06)}"/><polygon points="${right}" fill="${shade(col, -0.2)}"/><polygon points="${top}" fill="${shade(col, 0.1)}"/></g>`;
      },
      onX(x0, y1, z1, y2, z2){ return pts([[x0,y1,z1],[x0,y2,z1],[x0,y2,z2],[x0,y1,z2]]); },
      onY(y0, x1, z1, x2, z2){ return pts([[x1,y0,z1],[x2,y0,z1],[x2,y0,z2],[x1,y0,z2]]); },
      onZ(z0, x1, y1, x2, y2){ return pts([[x1,y1,z0],[x2,y1,z0],[x2,y2,z0],[x1,y2,z0]]); }
    };
  }

  function shade(hex, amt){
    let c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map(ch => ch + ch).join('');
    const n = parseInt(c, 16);
    let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    const f = v => Math.max(0, Math.min(255, Math.round(amt >= 0 ? v + (255 - v) * amt : v * (1 + amt))));
    return '#' + [f(r), f(g), f(b)].map(v => v.toString(16).padStart(2, '0')).join('');
  }

  const SKIN = ['#F6D3B8', '#E9B48F', '#C98E66', '#9C6644', '#6B4430'];
  const HAIRC = ['#2E211B', '#6B4226', '#B7792F', '#D9B26A', '#B9B3AC'];
  const OUTFIT = ['#D9734E', '#7FA37A', '#5F8FB4', '#E9B44C', '#A66BA6', '#E2001A'];
  const HAIRS = ['corti', 'lunghi', 'raccolti', 'ricci', 'rasati'];

  function hairBack(style, hc){
    if (style === 'lunghi') return `<path d="M-19 -112 Q-21 -84 -15 -76 L15 -76 Q21 -84 19 -112 Z" fill="${hc}"/>`;
    if (style === 'raccolti') return `<circle cx="0" cy="-128" r="9" fill="${hc}"/>`;
    if (style === 'coda') return `<path d="M12 -120 Q24 -116 22 -98 Q21 -88 17 -84 Q18 -96 13 -106 Z" fill="${hc}"/>`;
    if (style === 'mossi') return `<path d="M-19 -116 Q-24 -104 -21 -94 Q-18 -88 -14 -92 Q-12 -88 -9 -91 L9 -91 Q12 -88 14 -92 Q18 -88 21 -94 Q24 -104 19 -116 Z" fill="${hc}"/>`;
    if (style === 'calvo') return `<path d="M-15 -112 Q-17 -100 -12 -96 L12 -96 Q17 -100 15 -112 Z" fill="${hc}"/>`;
    return '';
  }
  function hairFront(style, hc, o = {}){
    const cap = `<path d="M-16.5 -106 Q-18 -127 0 -128 Q18 -127 16.5 -106 Q14 -117 4 -118 Q-2 -113 -9 -116 Q-14 -114 -16.5 -106 Z" fill="${hc}"/>`;
    if (style === 'ricci'){
      let s = '';
      [[-14,-114],[-9,-122],[-1,-126],[7,-124],[13,-117],[-16,-105],[16,-106],[3,-119],[-6,-117]]
        .forEach(([x, y]) => s += `<circle cx="${x}" cy="${y}" r="6.2" fill="${hc}"/>`);
      return s;
    }
    if (style === 'rasati') return `<path d="M-15.5 -108 Q-16 -125 0 -126 Q16 -125 15.5 -108 Q8 -118 0 -118 Q-8 -118 -15.5 -108 Z" fill="${hc}" opacity=".75"/>`;
    if (style === 'coda') return `<path d="M-16.3 -107 Q-17 -127 0 -127.5 Q17 -127 16.3 -107 Q13 -119 0 -120 Q-12 -119 -16.3 -107 Z" fill="${hc}"/>` +
      (o.streak ? `<path d="M-11 -116 Q-6 -124 2 -125 M-4 -119 Q2 -124 9 -122" fill="none" stroke="${o.streak}" stroke-width="1.1" stroke-linecap="round" opacity=".7"/>` : '');
    if (style === 'chignon') return cap + `<circle cx="-2" cy="-129" r="7.5" fill="${hc}"/><circle cx="5" cy="-131" r="5.5" fill="${hc}"/>` +
      `<path d="M-15 -110 Q-18 -101 -15 -95" fill="none" stroke="${hc}" stroke-width="2" stroke-linecap="round"/>`;
    if (style === 'mossi') return [[-13,-120],[-6,-125],[2,-127],[10,-124],[15,-117]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6.5" fill="${hc}"/>`).join('') +
      `<path d="M-16.5 -106 Q-17 -124 -2 -125 Q-6 -118 -11 -116 Q-14 -113 -16.5 -106 Z" fill="${hc}"/><path d="M16.5 -106 Q17 -124 2 -125 Q9 -119 12 -115 Q15 -112 16.5 -106 Z" fill="${hc}"/>` +
      `<path d="M-16 -110 Q-21 -101 -17 -92 Q-16 -100 -14 -106 Z" fill="${hc}"/><path d="M16 -110 Q21 -101 17 -92 Q16 -100 14 -106 Z" fill="${hc}"/>`;
    if (style === 'calvo') return `<path d="M-16 -104 Q-17 -114 -12 -119 Q-13 -112 -13 -104 Z" fill="${hc}"/><path d="M16 -104 Q17 -114 12 -119 Q13 -112 13 -104 Z" fill="${hc}"/>`;
    return cap;
  }

  function torso(o, out, inner){
    let s = `<path d="M-16 -88 Q0 -93 16 -88 L14 -46 Q0 -42 -14 -46 Z" fill="${out}"/>`;
    if (o.open && inner){
      s += `<path d="M-5.5 -90 L5.5 -90 L5 -44 L-5 -44 Z" fill="${inner}"/>`;
      if (o.stripes) for (let y = -86; y < -46; y += 5) s += `<rect x="-5.4" y="${y}" width="10.8" height="1.8" fill="${o.stripes}"/>`;
      s += `<path d="M-5.5 -90 L-1 -78 L-5 -46" fill="none" stroke="${shade(out,-0.25)}" stroke-width="1.4"/><path d="M5.5 -90 L1 -78 L5 -46" fill="none" stroke="${shade(out,-0.25)}" stroke-width="1.4"/>`;
    } else if (inner){
      s += `<path d="M-7 -90 L0 -76 L7 -90 Z" fill="${inner}"/><path d="M-7 -90 L-2 -84 L0 -88 L2 -84 L7 -90" fill="${shade(inner,0.25)}"/>`;
    } else {
      s += `<path d="M-6 -90 L0 -84 L6 -90" fill="none" stroke="${shade(out,0.35)}" stroke-width="2" stroke-linecap="round"/>`;
    }
    if (o.hood) s += `<path d="M-10 -91 Q0 -84 10 -91" fill="none" stroke="${shade(out,-0.2)}" stroke-width="3" stroke-linecap="round"/><path d="M-3 -86 L-4 -74 M3 -86 L4 -74" stroke="#E8E4DE" stroke-width="1.3" stroke-linecap="round"/>`;
    if (o.apron) s += `<path d="M-11 -80 L11 -80 L12 -40 Q0 -37 -12 -40 Z" fill="${o.apron}"/><path d="M-11 -80 L-6 -92 M11 -80 L6 -92" stroke="${shade(o.apron,-0.2)}" stroke-width="1.5"/><rect x="-6" y="-66" width="12" height="8" rx="1.5" fill="${shade(o.apron,-0.08)}"/>`;
    return s;
  }

  function avatar(o){
    const skin = o.skinC || SKIN[o.skin], hc = o.hairC || HAIRC[o.hairColor], out = o.outfitC || OUTFIT[o.outfit];
    const pants = o.pantsC || '#3E4A5C', outD = shade(out, -0.18);
    const browC = o.browC || shade(hc, -0.1);
    return `
      <ellipse cx="0" cy="0" rx="24" ry="7" fill="rgba(40,25,15,.2)"/>
      <g class="leg leg-l"><rect x="-11" y="-48" width="9" height="44" rx="4.5" fill="${pants}"/><ellipse cx="-7" cy="-3" rx="7" ry="4" fill="#2B211C"/><ellipse cx="-9" cy="-4.6" rx="2.6" ry="1.1" fill="#fff" opacity=".22"/></g>
      <g class="leg leg-r"><rect x="2" y="-48" width="9" height="44" rx="4.5" fill="${shade(pants,-0.12)}"/><ellipse cx="7" cy="-3" rx="7" ry="4" fill="#2B211C"/><ellipse cx="5" cy="-4.6" rx="2.6" ry="1.1" fill="#fff" opacity=".18"/></g>
      <g class="body">
        ${hairBack(o.hair, hc)}
        <g class="arm arm-l"><rect x="-22" y="-86" width="8.5" height="34" rx="4.2" fill="${outD}"/><circle cx="-17.8" cy="-50" r="4.6" fill="${skin}"/></g>
        <g class="arm arm-r"><rect x="13.5" y="-86" width="8.5" height="34" rx="4.2" fill="${outD}"/><circle cx="17.8" cy="-50" r="4.6" fill="${skin}"/></g>
        ${torso(o, out, o.innerC)}
        <path d="M6 -90 Q15 -89 16 -88 L14 -46 Q10 -44.5 6 -44.2 Z" fill="#3A1E10" opacity=".1"/>
        <rect x="-4" y="-96" width="8" height="8" rx="3" fill="${shade(skin,-0.08)}"/>
        ${o.neckGlasses ? `<g stroke="${o.neckGlasses}" stroke-width="1.1" fill="rgba(255,255,255,.2)"><path d="M-6 -90 Q-3 -80 -4 -76 M6 -90 Q3 -80 4 -76" fill="none"/><ellipse cx="-3.6" cy="-74" rx="2.6" ry="2"/><ellipse cx="3.6" cy="-74" rx="2.6" ry="2"/></g>` : ''}
        ${o.headphones ? `<path d="M-10 -92 Q0 -82 10 -92" fill="none" stroke="#2B2B30" stroke-width="2.6"/><rect x="-13.5" y="-96" width="6" height="8" rx="2.5" fill="#2B2B30"/><rect x="7.5" y="-96" width="6" height="8" rx="2.5" fill="#2B2B30"/>` : ''}
        <ellipse cx="0" cy="-108" rx="15.5" ry="17" fill="${skin}"/>
        <path d="M0 -125 Q13 -123 15 -106 Q15 -95 8 -92 Q14 -100 13 -110 Q11 -121 0 -125 Z" fill="#3A1E10" opacity=".08"/>
        <g class="eyes"><circle cx="-5.5" cy="-106" r="1.9" fill="#2B211C"/><circle cx="5.5" cy="-106" r="1.9" fill="#2B211C"/><circle cx="-4.9" cy="-106.6" r=".6" fill="#fff"/><circle cx="6.1" cy="-106.6" r=".6" fill="#fff"/></g>
        ${o.brows ? `<path d="M-8.5 -111 Q-5.5 -113 -2.5 -111.5 M2.5 -111.5 Q5.5 -113 8.5 -111" fill="none" stroke="${browC}" stroke-width="1.5" stroke-linecap="round"/>` : ''}
        ${o.old ? `<path d="M-10.5 -104.5 l-1.8 1 M10.5 -104.5 l1.8 1 M-10.5 -103 l-1.6 1.4 M10.5 -103 l1.6 1.4" fill="none" stroke="${shade(skin,-0.25)}" stroke-width=".9" stroke-linecap="round"/>` : ''}
        <circle cx="-9" cy="-100" r="2.6" fill="#E88B7A" opacity=".35"/><circle cx="9" cy="-100" r="2.6" fill="#E88B7A" opacity=".35"/>
        <path d="M-4 -99 Q0 -96 4 -99" fill="none" stroke="#7A3E2E" stroke-width="1.6" stroke-linecap="round"/>
        ${o.glasses ? `<g fill="rgba(255,255,255,.18)" stroke="${o.glasses}" stroke-width="1.3"><circle cx="-5.5" cy="-106" r="4.3"/><circle cx="5.5" cy="-106" r="4.3"/></g><path d="M-1.2 -106 L1.2 -106 M-9.8 -107 L-14.5 -108.5 M9.8 -107 L14.5 -108.5" stroke="${o.glasses}" stroke-width="1.2"/>` : ''}
        ${hairFront(o.hair, hc, o)}
        ${o.hair === 'calvo' ? `<ellipse cx="-4" cy="-121" rx="5" ry="2.2" fill="#fff" opacity=".25"/>` : `<path d="M-10 -121 Q-4 -126 4 -125" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".2"/>`}
      </g>`;
  }

  /* the 2026 cast, drawn in the game style */
  const PERSONAS = {
    Maria:   { skinC:'#D6A07A', hair:'coda', hairC:'#4A3428', streak:'#9C928A', outfitC:'#8A9A6E', innerC:'#7A2E3A', open:true, neckGlasses:'#3A2E28', pantsC:'#4A4A55', brows:true, bg:'#F3D9C4' },
    Paola:   { skinC:'#E2AA82', hair:'chignon', hairC:'#3B2A22', outfitC:'#CDB89A', innerC:'#F4EEE6', stripes:'#C0563A', open:true, apron:'#E3D6C0', pantsC:'#5A4A40', brows:true, bg:'#F6E3C3' },
    Luca:    { skinC:'#F2D0B5', hair:'mossi', hairC:'#6B4A30', outfitC:'#9EA1A6', hood:true, headphones:true, pantsC:'#3E4A5C', brows:true, bg:'#DCE7EE' },
    Roberto: { skinC:'#F0C6A8', hair:'calvo', hairC:'#E4E0DA', browC:'#BDB6AE', outfitC:'#2E3A5C', innerC:'#BFD3E6', glasses:'#6B5A4E', pantsC:'#6B6B70', brows:true, old:true, bg:'#E2E4EE' }
  };
  const portrait = name => { const p = PERSONAS[name];
    return `<svg class="pf" viewBox="-27 -137 54 54" aria-label="${name}" role="img"><circle cx="0" cy="-110" r="27" fill="${p.bg}"/>${avatar(p)}</svg>`; };

  const I = {
    home:'<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
    tv:'<rect x="3" y="5" width="18" height="12" rx="2"/><path d="M8 21h8M12 17v4"/>',
    leaf:'<path d="M5 19c0-9 6-14 15-14 0 9-5 15-14 15"/><path d="M5 19c3-4 6-7 10-9"/>',
    bolt:'<path d="M13 3L5 14h6l-1 7 8-11h-6z"/>',
    drop:'<path d="M12 3c4 5 6 8 6 11a6 6 0 0 1-12 0c0-3 2-6 6-11z"/>',
    recycle:'<path d="M7 19H4l3-5"/><path d="M17 19h3l-3-5"/><path d="M9 6l3-3 3 3"/><path d="M12 3v6M5.5 15.5L9 9.5M18.5 15.5L15 9.5M8 19h8"/>',
    cart:'<path d="M3 4h2l2.5 11h10.5l2-8H6.5"/><circle cx="9" cy="19" r="1.5"/><circle cx="17" cy="19" r="1.5"/>',
    book:'<path d="M4 5c3-1 6-1 8 1 2-2 5-2 8-1v14c-3-1-6-1-8 1-2-2-5-2-8-1z"/><path d="M12 6v14"/>',
    sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5"/>',
    thermo:'<path d="M10 14V5a2 2 0 0 1 4 0v9a4 4 0 1 1-4 0z"/><path d="M12 9v7"/>',
    plug:'<path d="M9 3v5M15 3v5"/><path d="M6 8h12v3a6 6 0 0 1-12 0z"/><path d="M12 17v4"/>',
    sprout:'<path d="M12 21v-9"/><path d="M12 12c0-4-3-6-7-6 0 4 3 6 7 6z"/><path d="M12 10c0-3 3-5 7-5 0 3-3 5-7 5z"/>',
    lock:'<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    check:'<path d="M5 12l4 4 10-10"/>',
    star:'<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
    washer:'<rect x="4" y="3" width="16" height="18" rx="2"/><circle cx="12" cy="13" r="5"/><path d="M7 6h2"/>',
    bath:'<path d="M3 12h18v3a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5z"/><path d="M6 12V6a2 2 0 0 1 4 0"/>',
    phone:'<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
    play:'<path d="M8 5l11 7-11 7z"/>',
    x:'<path d="M6 6l12 12M18 6L6 18"/>',
    users:'<circle cx="9" cy="8" r="3.5"/><path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M21 20c0-3-1.7-5.3-4-5.8"/>',
    cloud:'<path d="M7 18a5 5 0 0 1-.5-10A6 6 0 0 1 18 9a4.5 4.5 0 0 1-.5 9z"/>',
    target:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r=".8"/>',
    door:'<path d="M5 21V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v17"/><path d="M3 21h18"/><circle cx="15" cy="12" r="1"/>'
  };
  const icon = (name, sw = 2) =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[name] || ''}</svg>`;

  window.CL = { makeIso, shade, avatar, icon, SKIN, HAIRC, OUTFIT, HAIRS, COS, PERSONAS, portrait };
})();
