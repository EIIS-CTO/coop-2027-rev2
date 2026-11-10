/* Casa Sostenibile — flat illustrations for the mini-games (48×48, game palette) */
(function(){
  const S = inner => `<svg viewBox="0 0 48 48" aria-hidden="true"><ellipse cx="24" cy="42" rx="15" ry="3" fill="#3A1E10" opacity=".1"/>${inner}</svg>`;
  const ART = {
    // ---- fridge
    zucchine: S(`<g transform="rotate(-28 24 26)"><rect x="6" y="20" width="34" height="11" rx="5.5" fill="#5E8459"/><rect x="8" y="22" width="30" height="2.5" rx="1.2" fill="#7FA37A"/>
      <rect x="38" y="23" width="5" height="5" rx="1.5" fill="#8A9A6E"/><circle cx="16" cy="28" r="1" fill="#B9CDA2"/><circle cx="26" cy="27" r="1" fill="#B9CDA2"/></g>
      <g transform="rotate(-8 24 32)"><rect x="9" y="29" width="28" height="9" rx="4.5" fill="#4E7349"/><rect x="11" y="30.5" width="24" height="2" rx="1" fill="#6E9566"/></g>`),
    pomodorini: S(`<circle cx="17" cy="29" r="8" fill="#D9473A"/><circle cx="30" cy="27" r="9" fill="#E2574A"/><circle cx="24" cy="36" r="7" fill="#C93E32"/>
      <circle cx="27" cy="23" r="2.2" fill="#fff" opacity=".35"/><circle cx="14" cy="26" r="1.6" fill="#fff" opacity=".3"/>
      <path d="M30 18l-2 3 3-1 1 3 1-3 3 1-2-3" fill="#5E8459"/><path d="M17 21l-1.6 2.4 2.4-.8.8 2.4.8-2.4 2.4.8-1.6-2.4" fill="#5E8459"/>`),
    spinaci: S(`<path d="M10 14h28l-2 26H12z" fill="#E7F0E3" stroke="#B9CDA2" stroke-width="1.2"/><path d="M10 14h28v4H10z" fill="#7FA37A"/>
      <ellipse cx="19" cy="29" rx="6" ry="8" fill="#4E7349"/><ellipse cx="28" cy="27" rx="6" ry="9" fill="#5E8459"/><ellipse cx="24" cy="34" rx="7" ry="5" fill="#6E9566"/>
      <path d="M28 20v14M19 23v12" stroke="#B9CDA2" stroke-width="1"/>`),
    riso: S(`<path d="M8 26h32c0 9-7 14-16 14S8 35 8 26z" fill="#5F9BBE"/><path d="M8 26h32" stroke="#4A87AA" stroke-width="2"/>
      <ellipse cx="24" cy="25" rx="15" ry="6" fill="#FBF6EA"/>${[[18,23],[22,22],[26,23],[30,24],[20,26],[25,26],[29,26],[16,25]].map(([x,y]) => `<ellipse cx="${x}" cy="${y}" rx="1.6" ry=".8" fill="#E8DFC8"/>`).join('')}
      <path d="M20 31q4 2 8 0" stroke="#fff" stroke-width="1.4" fill="none" opacity=".5"/>`),
    uova: S(`<path d="M7 30h34l-3 9H10z" fill="#C9B79C"/><path d="M7 30h34" stroke="#B5A285" stroke-width="2"/>
      <ellipse cx="15" cy="26" rx="5.5" ry="7" fill="#F6E9D6"/><ellipse cx="24" cy="25" rx="5.5" ry="7.5" fill="#FBF3E6"/><ellipse cx="33" cy="26" rx="5.5" ry="7" fill="#F0DDC2"/>
      <ellipse cx="22.5" cy="22" rx="1.6" ry="2.4" fill="#fff" opacity=".7"/>`),
    formaggio: S(`<path d="M6 30l26-14 10 8v12H6z" fill="#E9B44C"/><path d="M6 30l26-14 10 8-26 14z" fill="#F2CC74"/><path d="M6 30h10v6H6z" fill="#D9A13A"/>
      <circle cx="26" cy="24" r="2.4" fill="#D9A13A"/><circle cx="33" cy="26" r="1.6" fill="#D9A13A"/><circle cx="30" cy="31" r="2" fill="#C99230"/><circle cx="21" cy="33" r="1.4" fill="#C99230"/>`),
    latte: S(`<path d="M15 14h18v26H15z" fill="#FFFDF8" stroke="#CFC3B2" stroke-width="1.2"/><path d="M15 14l4-6h10l4 6z" fill="#EEE6DA" stroke="#CFC3B2" stroke-width="1.2"/>
      <rect x="21" y="5" width="6" height="4" rx="1" fill="#5F9BBE"/><rect x="15" y="22" width="18" height="9" fill="#5F9BBE"/><path d="M18 27c2-2 4 2 6 0s4 2 6 0" stroke="#fff" stroke-width="1.4" fill="none"/>`),
    carote: S(`<path d="M27 13c5-1 9 3 8 8L15 39c-2 1-4 0-3-2z" fill="#E07A3A"/><path d="M27 13c5-1 9 3 8 8l-4 3c1-4-2-8-6-8z" fill="#EE9550"/>
      <path d="M22 24l3 2M18 29l3 2M15 34l2 1.5" stroke="#C0563A" stroke-width="1.4" stroke-linecap="round"/>
      <path d="M31 13c-1-5 1-8 4-9 0 3-1 6-2 9M33 15c2-4 6-6 9-5-2 3-5 5-8 6M32 14c3-2 7-1 8 1" fill="#7FA37A" stroke="#5E8459" stroke-width=".8"/>`),
    // ---- shopping
    bottiglie: S(`${[10, 19, 28].map((x, i) => `<path d="M${x + 2} 12h4v4l2 3v20h-8V19l2-3z" fill="#CFE6F2" stroke="#8FB7CE" stroke-width="1"/><rect x="${x + 2}" y="10" width="4" height="3" fill="#5F9BBE"/><rect x="${x}" y="24" width="8" height="6" fill="#5F9BBE" opacity="${.7 + i * .1}"/>`).join('')}
      <path d="M7 29h31v10H7z" fill="none" stroke="#9AA3A8" stroke-width="1.4"/>`),
    borraccia: S(`<path d="M34 8c4 2 6 6 4 10" stroke="#9AA3A8" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M8 12h8v6H8z" fill="#A9B4BA"/><path d="M12 18v6" stroke="#A9B4BA" stroke-width="3"/><path d="M12 25c-1 3 0 5 0 7" stroke="#9CC5D9" stroke-width="2" stroke-linecap="round" fill="none"/>
      <rect x="22" y="10" width="10" height="5" rx="1.5" fill="#5E8459"/><rect x="20" y="14" width="14" height="26" rx="6" fill="#7FA37A"/><rect x="22" y="22" width="10" height="9" rx="2" fill="#F3F7F0"/><rect x="23" y="16" width="3" height="20" rx="1.5" fill="#fff" opacity=".25"/>`),
    fragole: S(`${[[16, 28], [30, 27], [23, 33]].map(([x, y]) => `<path d="M${x - 7} ${y - 4}c0-3 14-3 14 0 0 6-4 11-7 11s-7-5-7-11z" fill="#D9473A"/><path d="M${x - 5} ${y - 6}l2 2 3-3 3 3 2-2-1 3h-8z" fill="#5E8459"/>${[[-3, 0], [2, 1], [-1, 4], [3, 5], [0, 7]].map(([a, b]) => `<ellipse cx="${x + a}" cy="${y + b}" rx=".7" ry="1" fill="#F6D58C"/>`).join('')}`).join('')}`),
    arance: S(`<circle cx="18" cy="29" r="10" fill="#E99A3C"/><circle cx="31" cy="27" r="9" fill="#F0AA4C"/><circle cx="28" cy="23" r="2.2" fill="#fff" opacity=".3"/><circle cx="15" cy="25" r="2" fill="#fff" opacity=".25"/>
      <path d="M31 18c2-3 6-4 8-3-2 3-5 4-8 3z" fill="#5E8459"/><circle cx="31" cy="18.5" r="1" fill="#7A5236"/>`),
    monodose: S(`<rect x="8" y="12" width="32" height="26" rx="2" fill="#E9B44C"/><rect x="8" y="12" width="32" height="7" fill="#D9A13A"/>
      ${[[13, 24], [22, 24], [31, 24], [13, 32], [22, 32], [31, 32]].map(([x, y]) => `<rect x="${x - 3.5}" y="${y - 3}" width="7" height="6" rx="1.5" fill="#FFFDF8" stroke="#CFC3B2" stroke-width=".8"/><circle cx="${x}" cy="${y}" r="1.6" fill="#5F9BBE"/>`).join('')}`),
    ricarica: S(`<path d="M14 40V18c0-4 2-6 5-6h2v-3h6v3h2c3 0 5 2 5 6v22z" fill="#9CC5D9" stroke="#5F9BBE" stroke-width="1.2"/><rect x="18" y="22" width="12" height="10" rx="2" fill="#FFFDF8"/>
      <path d="M21 27a3 3 0 1 0 3-3M24 22.5l1.6 1.6L24 25.6" stroke="#5E8459" stroke-width="1.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`),
    rubinetto: S(`<path d="M8 12h18v6H8z" fill="#A9B4BA"/><path d="M26 15h8v7h-4v-3h-4" fill="#A9B4BA"/><rect x="14" y="8" width="6" height="4" rx="1" fill="#8C96A0"/>
      <path d="M32 24c0 5 1 8 1 12M30 24c0 5-1 8-1 12M34 24c0 5 2 8 2 11" stroke="#7FB8D6" stroke-width="2" stroke-linecap="round" fill="none"/><ellipse cx="32" cy="40" rx="7" ry="2" fill="#9CC5D9"/>`),
    bacinella: S(`<path d="M6 24h36l-4 14H10z" fill="#E8E5DE" stroke="#CFC3B2" stroke-width="1.2"/><ellipse cx="24" cy="24" rx="18" ry="5" fill="#9CC5D9"/><ellipse cx="24" cy="24" rx="18" ry="5" fill="none" stroke="#CFC3B2" stroke-width="1.2"/>
      <ellipse cx="19" cy="22" rx="5" ry="3" fill="#5E8459"/><ellipse cx="28" cy="23" rx="4" ry="2.4" fill="#7FA37A"/><circle cx="24" cy="21" r="2.2" fill="#D9473A"/>`),
    // ---- waste
    giornale: S(`<path d="M9 13h26v25H12a3 3 0 0 1-3-3z" fill="#F3EEE4" stroke="#CFC3B2" stroke-width="1.2"/><path d="M35 18h4v17a3 3 0 0 1-3 3h-1z" fill="#E6DCCB"/>
      <rect x="12" y="16" width="20" height="4" fill="#3A2E28"/><path d="M12 24h9M12 27h9M12 30h9M12 33h20" stroke="#B5A898" stroke-width="1.4"/><rect x="23" y="23" width="9" height="8" fill="#9CC5D9"/>`),
    bottiglia: S(`<path d="M21 6h6v5l3 5v23a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2V16l3-5z" fill="#CFE6F2" stroke="#8FB7CE" stroke-width="1.2"/><rect x="20.5" y="4" width="7" height="4" rx="1" fill="#5F9BBE"/>
      <rect x="18" y="22" width="12" height="8" fill="#5F9BBE"/><rect x="20" y="17" width="2" height="20" rx="1" fill="#fff" opacity=".5"/>`),
    lattina: S(`<rect x="15" y="10" width="18" height="30" rx="3" fill="#C0563A"/><ellipse cx="24" cy="10" rx="9" ry="2.5" fill="#B9C0C5"/><ellipse cx="24" cy="10" rx="5" ry="1.2" fill="#9AA3A8"/>
      <rect x="15" y="20" width="18" height="10" fill="#E9B44C"/><rect x="17" y="12" width="2.4" height="26" rx="1.2" fill="#fff" opacity=".28"/>`),
    vasetto: S(`<rect x="15" y="8" width="18" height="6" rx="1.5" fill="#D9734E"/><path d="M16 14h16l1 4v18a4 4 0 0 1-4 4H19a4 4 0 0 1-4-4V18z" fill="#E8F1F2" opacity=".9" stroke="#AEC7CC" stroke-width="1.2"/>
      <path d="M16 24h16v12a4 4 0 0 1-4 4h-8a4 4 0 0 1-4-4z" fill="#C93E32" opacity=".85"/><rect x="18" y="16" width="2" height="20" rx="1" fill="#fff" opacity=".6"/>`),
    bucce: S(`<path d="M16 11h16c0 5-3 7-3 10 0 3 3 5 3 9 0 6-4 9-8 9s-8-3-8-9c0-4 3-6 3-9 0-3-3-5-3-10z" fill="#F6E9D6" stroke="#E6D3BA" stroke-width="1"/>
      <path d="M16 11h16c0 3-2 5-4 6H20c-2-1-4-3-4-6z" fill="#D9473A"/><path d="M16.5 33c1 4 4 6 7.5 6s6.5-2 7.5-6c-2 1.5-5 2-7.5 2s-5.5-.5-7.5-2z" fill="#D9473A"/>
      <ellipse cx="22.5" cy="25" rx="1.2" ry="2" fill="#5A3B26"/><ellipse cx="25.5" cy="25" rx="1.2" ry="2" fill="#5A3B26"/>
      <path d="M24 11V6" stroke="#7A5236" stroke-width="2" stroke-linecap="round"/><path d="M24 8c2-3 5-3 7-2-2 2-4 3-7 2z" fill="#7FA37A"/>`),
    scontrino: S(`<path d="M15 6h18v34l-3-2-3 2-3-2-3 2-3-2-3 2z" fill="#FFFDF8" stroke="#CFC3B2" stroke-width="1.2"/><path d="M18 12h12M18 16h8M18 20h12M18 24h10" stroke="#B5A898" stroke-width="1.3"/>
      <path d="M18 30h12" stroke="#3A2E28" stroke-width="1.6"/><path d="M18 34h5" stroke="#B5A898" stroke-width="1.3"/>`),
    tazzina: S(`<path d="M11 20h22l-2 13a5 5 0 0 1-5 4h-8a5 5 0 0 1-5-4z" fill="#FFFDF8" stroke="#CFC3B2" stroke-width="1.2"/><path d="M33 23c5 0 5 7 0 7" stroke="#CFC3B2" stroke-width="2.2" fill="none"/>
      <path d="M20 20l3 6-2 4 3 7" stroke="#8A5A3C" stroke-width="1.4" fill="none"/><path d="M8 38l4-3 3 2" fill="#FFFDF8" stroke="#CFC3B2" stroke-width="1.2"/><ellipse cx="22" cy="20" rx="11" ry="2" fill="#8A5A3C" opacity=".5"/>`)
  };
  window.CLArt = ART;
})();
