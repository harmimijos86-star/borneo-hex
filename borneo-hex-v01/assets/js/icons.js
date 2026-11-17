/* Ilustrasi produk (sementara sehingga foto sebenar dimuat naik).
   Warna jenama: Navy #13294B, Oren #F26B1D, Kuning #FFC533, Off-White #FAF7F0 */
(function () {
  const N = "#13294B", O = "#F26B1D", Y = "#FFC533", G = "#D9D3C4";
  const leg = (x, y1, y2) => `<line x1="${x}" y1="${y1}" x2="${x}" y2="${y2}" stroke="${N}" stroke-width="4" stroke-linecap="round"/>`;
  const ground = `<ellipse cx="80" cy="104" rx="64" ry="7" fill="${G}" opacity=".6"/>`;

  const ICONS = {
    kanopi: `${ground}
      <path d="M80 14 22 52h116z" fill="${O}"/><path d="M80 14 52 52h56z" fill="${Y}"/>
      <path d="M22 52h116v8H22z" fill="${N}"/>
      <path d="M22 60q7 7 14 0 7 7 15 0 7 7 14 0 7 7 15 0 7 7 14 0 7 7 15 0 7 7 14 0 7 7 15 0" fill="none" stroke="${O}" stroke-width="3"/>
      ${leg(26, 60, 102)}${leg(134, 60, 102)}${leg(60, 60, 98)}${leg(100, 60, 98)}`,
    kanopiKecil: `${ground}
      <path d="M80 26 46 56h68z" fill="${O}"/><path d="M80 26 66 56h28z" fill="${Y}"/>
      <path d="M46 56h68v7H46z" fill="${N}"/>${leg(50, 63, 102)}${leg(110, 63, 102)}`,
    kanopiPanjang: `${ground}
      <path d="M50 22h60l28 32H22z" fill="${O}"/><path d="M62 22h36l10 32H52z" fill="${Y}"/>
      <path d="M22 54h116v8H22z" fill="${N}"/>${leg(26, 62, 102)}${leg(80, 62, 100)}${leg(134, 62, 102)}`,
    arabian: `${ground}
      <path d="M22 56q18-8 22-34 18 22 36 22 18 0 36-22 4 26 22 34z" fill="${O}"/>
      <path d="M44 22q4 26 36 22 32 4 36-22" fill="none" stroke="${Y}" stroke-width="4"/>
      <path d="M22 56h116v7H22z" fill="${N}"/>${leg(26, 63, 102)}${leg(134, 63, 102)}${leg(80, 63, 100)}`,
    kerusi: `${ground}
      <rect x="58" y="18" width="44" height="40" rx="8" fill="${O}"/>
      <rect x="54" y="58" width="52" height="10" rx="4" fill="${N}"/>${leg(60, 68, 102)}${leg(100, 68, 102)}`,
    kerusiBanquet: `${ground}
      <rect x="58" y="14" width="44" height="46" rx="10" fill="${N}"/><rect x="63" y="19" width="34" height="36" rx="7" fill="${Y}"/>
      <rect x="54" y="60" width="52" height="10" rx="4" fill="${O}"/>${leg(60, 70, 102)}${leg(100, 70, 102)}`,
    meja: `${ground}
      <rect x="22" y="44" width="116" height="10" rx="3" fill="${N}"/><rect x="22" y="54" width="116" height="6" fill="${O}"/>
      ${leg(30, 60, 102)}${leg(130, 60, 102)}`,
    mejaBulat: `${ground}
      <ellipse cx="80" cy="52" rx="54" ry="14" fill="${O}"/><ellipse cx="80" cy="49" rx="54" ry="14" fill="${N}"/>
      ${leg(80, 62, 98)}<path d="M64 100h32" stroke="${N}" stroke-width="5" stroke-linecap="round"/>`,
    kipasSiling: `<line x1="80" y1="6" x2="80" y2="44" stroke="${N}" stroke-width="4"/>
      <ellipse cx="44" cy="52" rx="32" ry="6" fill="${O}"/><ellipse cx="116" cy="52" rx="32" ry="6" fill="${O}"/>
      <circle cx="80" cy="52" r="11" fill="${N}"/><circle cx="80" cy="74" r="8" fill="${Y}"/>`,
    kipas: `${ground}
      <circle cx="80" cy="46" r="34" fill="none" stroke="${N}" stroke-width="5"/>
      <path d="M80 46 72 18q8-4 16 0zM80 46l26 12q-2 8-9 12zM80 46 54 58q-1-9 4-15z" fill="${O}"/>
      <circle cx="80" cy="46" r="6" fill="${Y}"/>${leg(80, 80, 100)}<path d="M62 101h36" stroke="${N}" stroke-width="5" stroke-linecap="round"/>`,
    cooler: `${ground}
      <rect x="50" y="12" width="60" height="86" rx="10" fill="${N}"/>
      <rect x="58" y="20" width="44" height="40" rx="5" fill="${Y}"/>
      <path d="M62 28h36M62 36h36M62 44h36M62 52h36" stroke="${N}" stroke-width="3"/>
      <rect x="62" y="70" width="36" height="8" rx="4" fill="${O}"/>`,
    lampu: `<line x1="80" y1="6" x2="80" y2="34" stroke="${N}" stroke-width="4"/>
      <path d="M58 34h44l10 26H48z" fill="${N}"/><circle cx="80" cy="66" r="12" fill="${Y}"/>
      <path d="M80 86v10M60 80l-7 7M100 80l7 7" stroke="${O}" stroke-width="4" stroke-linecap="round"/>`,
    kabel: `${ground}
      <circle cx="66" cy="58" r="30" fill="none" stroke="${N}" stroke-width="9"/>
      <circle cx="66" cy="58" r="16" fill="none" stroke="${O}" stroke-width="5"/>
      <path d="M96 58h16" stroke="${N}" stroke-width="6"/><rect x="110" y="44" width="30" height="28" rx="5" fill="${Y}"/>
      <circle cx="120" cy="58" r="3" fill="${N}"/><circle cx="131" cy="58" r="3" fill="${N}"/>`,
    pa: `${ground}
      <rect x="18" y="20" width="40" height="78" rx="6" fill="${N}"/><circle cx="38" cy="42" r="9" fill="${Y}"/><circle cx="38" cy="74" r="14" fill="${O}"/>
      <rect x="102" y="20" width="40" height="78" rx="6" fill="${N}"/><circle cx="122" cy="42" r="9" fill="${Y}"/><circle cx="122" cy="74" r="14" fill="${O}"/>
      <rect x="64" y="66" width="32" height="20" rx="3" fill="${O}"/><path d="M70 73h20M70 79h12" stroke="${N}" stroke-width="3"/>`,
    speaker: `${ground}
      <rect x="54" y="12" width="52" height="88" rx="8" fill="${N}"/><circle cx="80" cy="36" r="11" fill="${Y}"/><circle cx="80" cy="72" r="18" fill="${O}"/><circle cx="80" cy="72" r="6" fill="${N}"/>`,
    mikrofon: `<rect x="68" y="10" width="24" height="40" rx="12" fill="${N}"/>
      <path d="M72 22h16M72 30h16M72 38h16" stroke="${Y}" stroke-width="3"/>
      <path d="M58 44q0 22 22 22t22-22" fill="none" stroke="${O}" stroke-width="5"/>${leg(80, 66, 98)}
      <path d="M64 100h32" stroke="${N}" stroke-width="5" stroke-linecap="round"/>`
  };

  window.BH_ICON = function (nama) {
    const body = ICONS[nama] || ICONS.kanopi;
    return `<svg viewBox="0 0 160 112" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">${body}</svg>`;
  };
})();
