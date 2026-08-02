/* СЕВЕРСВЕТ — предметные иллюстрации техники.
   Спрайт вставляется в DOM из app.js до рендера каталога (внешние <use href="file.svg#id">
   не работают в Safari, поэтому спрайт живёт строкой в JS и кэшируется отдельным файлом).
   Все символы 64×48, единый «продуктовый» стиль: графитовый корпус, стальные рёбра,
   стекло/экран — аврора-градиент. */

const GEAR_SPRITE = `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
<linearGradient id="gg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#38BDF8" stop-opacity=".85"/><stop offset=".55" stop-color="#1E4E6E"/><stop offset="1" stop-color="#0C1826"/></linearGradient>
<linearGradient id="gm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4B5B72"/><stop offset="1" stop-color="#232E3D"/></linearGradient>
<linearGradient id="gl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FDF6E3" stop-opacity=".95"/><stop offset="1" stop-color="#8FA6B8" stop-opacity=".35"/></linearGradient>
<linearGradient id="gv" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2DD4A7"/><stop offset="1" stop-color="#38BDF8"/></linearGradient>
<linearGradient id="gk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3FD9A0"/><stop offset="1" stop-color="#188A63"/></linearGradient>

<symbol id="g-cam-cine" viewBox="0 0 64 48" fill="#2C3849" stroke="#5F6E86" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round">
<rect x="20" y="7" width="17" height="4" rx="1.5" fill="#1B2432"/><path d="M14 11h30v3H14z" fill="#1B2432"/>
<rect x="11" y="14" width="30" height="24" rx="2.5" fill="url(#gm)"/>
<rect x="14.5" y="18" width="13" height="11" rx="1.5" fill="url(#gg)" stroke="none"/>
<circle cx="34" cy="19.5" r="1.6" fill="#F87171" stroke="none"/><path d="M31 33h8" stroke="#44546B"/>
<rect x="41" y="19" width="11" height="14" rx="2" fill="#242F3E"/><ellipse cx="52.5" cy="26" rx="3.2" ry="7" fill="url(#gg)"/>
<path d="M9 16v20M9 16h4M9 36h4" stroke="#44546B"/></symbol>

<symbol id="g-cam-box" viewBox="0 0 64 48" fill="#2C3849" stroke="#5F6E86" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round">
<rect x="22" y="8" width="14" height="4" rx="1.5" fill="#1B2432"/>
<rect x="14" y="12" width="26" height="26" rx="3" fill="url(#gm)"/>
<path d="M18 16h6M18 20h6M18 24h6" stroke="#44546B"/>
<circle cx="33" cy="16" r="1.5" fill="#F87171" stroke="none"/>
<rect x="27" y="28" width="9" height="6" rx="1.5" fill="url(#gg)" stroke="none"/>
<rect x="40" y="17" width="10" height="16" rx="2" fill="#242F3E"/><ellipse cx="50" cy="25" rx="3" ry="8" fill="url(#gg)"/></symbol>

<symbol id="g-cam-hybrid" viewBox="0 0 64 48" fill="#2C3849" stroke="#5F6E86" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round">
<path d="M23 13h9l2 4H21z" fill="#1B2432"/>
<path d="M12 17h34a3 3 0 0 1 3 3v13a3 3 0 0 1-3 3H12a3 3 0 0 1-3-3v-6c0-1 1-1.6 1-2.6V20a3 3 0 0 1 2-3z" fill="url(#gm)"/>
<circle cx="30" cy="27" r="8" fill="#242F3E"/><circle cx="30" cy="27" r="5" fill="url(#gg)"/><circle cx="30" cy="27" r="1.8" fill="#0B1119" stroke="none"/>
<rect x="13" y="21" width="7" height="5" rx="1" fill="#1B2432"/><circle cx="43" cy="22" r="1.4" fill="#2DD4A7" stroke="none"/></symbol>

<symbol id="g-lens-prime" viewBox="0 0 64 48" fill="#2C3849" stroke="#5F6E86" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round">
<rect x="14" y="15" width="34" height="18" rx="2" fill="url(#gm)"/>
<path d="M20 15v18M28 15v18M36 15v18" stroke="#44546B"/>
<rect x="46" y="17" width="4" height="14" rx="1" fill="#1B2432"/>
<ellipse cx="14" cy="24" rx="4" ry="9" fill="url(#gg)"/><ellipse cx="14" cy="24" rx="2" ry="4.6" fill="#0B1119" stroke="none" opacity=".6"/></symbol>

<symbol id="g-lens-set" viewBox="0 0 64 48" fill="#2C3849" stroke="#5F6E86" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round">
<rect x="8" y="18" width="13" height="18" rx="2" fill="url(#gm)"/><ellipse cx="14.5" cy="18" rx="6.5" ry="2.6" fill="url(#gg)"/>
<rect x="25" y="13" width="14" height="23" rx="2" fill="url(#gm)"/><ellipse cx="32" cy="13" rx="7" ry="2.8" fill="url(#gg)"/>
<rect x="43" y="20" width="13" height="16" rx="2" fill="url(#gm)"/><ellipse cx="49.5" cy="20" rx="6.5" ry="2.6" fill="url(#gg)"/>
<path d="M8 26h13M25 22h14M43 27h13" stroke="#44546B"/></symbol>

<symbol id="g-lens-anam" viewBox="0 0 64 48" fill="#2C3849" stroke="#5F6E86" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round">
<rect x="16" y="14" width="32" height="20" rx="2" fill="url(#gm)"/><path d="M24 14v20M34 14v20" stroke="#44546B"/>
<rect x="46" y="17" width="4" height="14" rx="1" fill="#1B2432"/>
<ellipse cx="16" cy="24" rx="4.5" ry="10" fill="#151F2C"/><ellipse cx="16" cy="24" rx="2.6" ry="8" fill="url(#gg)" stroke="#38BDF8" stroke-width=".8"/>
<path d="M20 20h22" stroke="#38BDF8" stroke-width="1.4" opacity=".55"/></symbol>

<symbol id="g-lens-zoom" viewBox="0 0 64 48" fill="#2C3849" stroke="#5F6E86" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round">
<rect x="30" y="16" width="18" height="16" rx="2" fill="url(#gm)"/><rect x="14" y="13" width="17" height="22" rx="2" fill="#33415400"/>
<rect x="14" y="13" width="17" height="22" rx="2" fill="url(#gm)"/>
<path d="M18 13v22M24 13v22M36 16v16M42 16v16" stroke="#44546B"/>
<rect x="46" y="18" width="4" height="12" rx="1" fill="#1B2432"/>
<ellipse cx="14" cy="24" rx="4" ry="11" fill="url(#gg)"/></symbol>

<symbol id="g-lens-tele" viewBox="0 0 64 48" fill="#2C3849" stroke="#5F6E86" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round">
<path d="M11 12l6 3v18l-6 3z" fill="#1B2432"/>
<rect x="17" y="15" width="28" height="18" rx="2" fill="url(#gm)"/><path d="M25 15v18M33 15v18" stroke="#44546B"/>
<rect x="45" y="18" width="4" height="12" rx="1" fill="#1B2432"/>
<path d="M27 33h9v5h-9z" fill="#242F3E"/><ellipse cx="11" cy="24" rx="3.4" ry="12" fill="url(#gg)"/></symbol>

<symbol id="g-lens-wide" viewBox="0 0 64 48" fill="#2C3849" stroke="#5F6E86" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round">
<path d="M18 10l4 5v18l-4 5-2-14z" fill="#1B2432"/>
<rect x="22" y="16" width="24" height="16" rx="2" fill="url(#gm)"/><path d="M30 16v16M38 16v16" stroke="#44546B"/>
<rect x="46" y="18" width="4" height="12" rx="1" fill="#1B2432"/>
<ellipse cx="18" cy="24" rx="4.5" ry="13" fill="url(#gg)"/><ellipse cx="18" cy="24" rx="2.4" ry="7" fill="#0B1119" stroke="none" opacity=".55"/></symbol>

<symbol id="g-adapter" viewBox="0 0 64 48" fill="#2C3849" stroke="#5F6E86" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round">
<rect x="22" y="14" width="20" height="20" rx="2" fill="url(#gm)"/>
<rect x="18" y="12" width="5" height="24" rx="1.5" fill="#1B2432"/><rect x="41" y="12" width="5" height="24" rx="1.5" fill="#1B2432"/>
<circle cx="32" cy="24" r="6" fill="#151F2C"/><circle cx="32" cy="24" r="3" fill="url(#gg)"/>
<circle cx="32" cy="16.5" r="1.2" fill="#F87171" stroke="none"/></symbol>

<symbol id="g-card-cfe" viewBox="0 0 64 48" fill="#2C3849" stroke="#5F6E86" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round">
<path d="M24 10h13l4 4v24a2 2 0 0 1-2 2H24a2 2 0 0 1-2-2V12a2 2 0 0 1 2-2z" fill="url(#gm)"/>
<path d="M26 15h12v9H26z" fill="url(#gg)" stroke="none"/>
<path d="M26 30v7M30 30v7M34 30v7M38 30v7" stroke="#44546B" stroke-width="1.6"/></symbol>

<symbol id="g-card-sd" viewBox="0 0 64 48" fill="#2C3849" stroke="#5F6E86" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round">
<path d="M25 11h10l5 5v22a2 2 0 0 1-2 2H25a2 2 0 0 1-2-2V13a2 2 0 0 1 2-2z" fill="url(#gm)"/>
<path d="M27 30h11v8H27z" fill="url(#gg)" stroke="none" opacity=".7"/>
<path d="M27 15v7M30.5 15v7M34 15v7M37.5 15v7" stroke="#44546B" stroke-width="1.6"/></symbol>

<symbol id="g-reader" viewBox="0 0 64 48" fill="#2C3849" stroke="#5F6E86" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round">
<rect x="14" y="17" width="28" height="15" rx="2.5" fill="url(#gm)"/>
<path d="M18 21h10v3H18z" fill="#0B1119" stroke="none"/><circle cx="36" cy="27" r="1.4" fill="#2DD4A7" stroke="none"/>
<path d="M42 24h7a4 4 0 0 1 4 4v6" stroke="#5F6E86" fill="none"/><rect x="50" y="34" width="6" height="4" rx="1" fill="#1B2432"/></symbol>

<symbol id="g-light-flex" viewBox="0 0 64 48" fill="#2C3849" stroke="#5F6E86" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round">
<rect x="14" y="10" width="27" height="21" rx="2" fill="url(#gm)"/>
<rect x="17" y="13" width="21" height="15" rx="1" fill="url(#gl)" stroke="none"/>
<path d="M27.5 31v9M22 40h11" stroke="#5F6E86"/><rect x="41" y="16" width="5" height="9" rx="1.5" fill="#1B2432"/>
<path d="M48 13l6-3M48 20h7M48 27l6 3" stroke="#FDF6E3" opacity=".55"/></symbol>

<symbol id="g-light-tube" viewBox="0 0 64 48" fill="#2C3849" stroke="#5F6E86" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round">
<rect x="9" y="19" width="46" height="10" rx="5" fill="url(#gm)"/>
<rect x="13" y="21.5" width="38" height="5" rx="2.5" fill="url(#gv)" stroke="none"/>
<path d="M13 19v10M51 19v10" stroke="#44546B"/><circle cx="55" cy="24" r="1.3" fill="#2DD4A7" stroke="none"/></symbol>

<symbol id="g-light-fresnel" viewBox="0 0 64 48" fill="#2C3849" stroke="#5F6E86" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round">
<rect x="14" y="16" width="14" height="16" rx="2" fill="url(#gm)"/>
<path d="M28 14l8 4v12l-8 4z" fill="#242F3E"/><path d="M36 18v12" stroke="#FDF6E3" stroke-width="2.4" opacity=".8"/>
<path d="M36 18l6-5M36 30l6 5M36 18h0" stroke="#5F6E86"/>
<path d="M42 11l3-2M42 37l3 2M46 24h7" stroke="#FDF6E3" opacity=".5"/>
<path d="M21 32v8M16 40h10" stroke="#5F6E86"/></symbol>

<symbol id="g-cstand" viewBox="0 0 64 48" fill="none" stroke="#5F6E86" stroke-width="1.4" stroke-linejoin="round" stroke-linecap="round">
<path d="M24 40v-28" stroke="#7A8AA3"/><path d="M24 12h14" stroke="#7A8AA3"/>
<circle cx="24" cy="20" r="2.6" fill="#2C3849"/><circle cx="38" cy="12" r="2.2" fill="#2C3849"/>
<path d="M24 40l-10 4M24 40l10 4M24 40v4" /><path d="M20 17l4-3 4 3" stroke="#44546B"/></symbol>

<symbol id="g-stand" viewBox="0 0 64 48" fill="none" stroke="#5F6E86" stroke-width="1.4" stroke-linejoin="round" stroke-linecap="round">
<path d="M32 40V10" stroke="#7A8AA3"/><path d="M28 18h8M29 26h6" stroke="#44546B"/>
<rect x="29" y="7" width="6" height="4" rx="1" fill="#2C3849"/>
<path d="M32 40l-11 4M32 40l11 4M32 40v4"/></symbol>

<symbol id="g-boom" viewBox="0 0 64 48" fill="none" stroke="#5F6E86" stroke-width="1.4" stroke-linejoin="round" stroke-linecap="round">
<path d="M22 40V16" stroke="#7A8AA3"/><path d="M10 30l30-14" stroke="#7A8AA3"/>
<circle cx="22" cy="21" r="2.4" fill="#2C3849"/><circle cx="10" cy="30" r="2.6" fill="#1B2432"/>
<rect x="38" y="12" width="6" height="6" rx="1.5" fill="#2C3849"/>
<path d="M22 40l-9 4M22 40l9 4M22 40v4"/></symbol>

<symbol id="g-griphead" viewBox="0 0 64 48" fill="#2C3849" stroke="#5F6E86" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round">
<circle cx="30" cy="24" r="9" fill="url(#gm)"/><circle cx="30" cy="24" r="3" fill="#151F2C"/>
<path d="M18 20h6v8h-6zM36 20h6v8h-6z" fill="#242F3E"/>
<path d="M39 24h9" stroke="#5F6E86" stroke-width="2"/><circle cx="50" cy="24" r="2.6" fill="#1B2432"/></symbol>

<symbol id="g-clamp" viewBox="0 0 64 48" fill="#2C3849" stroke="#5F6E86" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round">
<path d="M22 12h16v5H27v14h11v5H22z" fill="url(#gm)"/>
<path d="M38 22h6M44 20v6" stroke="#5F6E86" stroke-width="1.6"/><circle cx="46" cy="23" r="2.4" fill="#1B2432"/></symbol>

<symbol id="g-superclamp" viewBox="0 0 64 48" fill="#2C3849" stroke="#5F6E86" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round">
<path d="M14 13h9v7h-4a5 5 0 0 0 0 8h4v7h-9z" fill="url(#gm)"/>
<path d="M31 13h9v22h-9z" fill="url(#gm)"/>
<path d="M23 16h8M23 32h8" stroke="#5F6E86" stroke-width="2.4"/>
<circle cx="27" cy="24" r="4.6" fill="#151F2C"/>
<path d="M40 24h8" stroke="#7A8AA3" stroke-width="2.4"/><path d="M48 19v10" stroke="#7A8AA3" stroke-width="3"/></symbol>

<symbol id="g-magicarm" viewBox="0 0 64 48" fill="#2C3849" stroke="#5F6E86" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round">
<path d="M14 34l10-10" stroke="#7A8AA3" stroke-width="4"/><path d="M28 20l10-10" stroke="#7A8AA3" stroke-width="4"/>
<circle cx="26" cy="22" r="4" fill="url(#gm)"/><circle cx="12" cy="36" r="3.4" fill="#1B2432"/><circle cx="40" cy="8" r="3.4" fill="#1B2432"/>
<path d="M26 22l8 12" stroke="#5F6E86"/><circle cx="35" cy="36" r="3" fill="#242F3E"/></symbol>

<symbol id="g-sandbag" viewBox="0 0 64 48" fill="#2C3849" stroke="#5F6E86" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round">
<path d="M18 34c0-8 4-12 8-13l6-2 6 2c4 1 8 5 8 13a3 3 0 0 1-3 3H21a3 3 0 0 1-3-3z" fill="url(#gm)"/>
<path d="M32 19v18" stroke="#44546B"/><path d="M26 24c2 2 10 2 12 0" stroke="#44546B"/>
<rect x="28" y="13" width="8" height="4" rx="2" fill="#1B2432"/></symbol>

<symbol id="g-screw" viewBox="0 0 64 48" fill="#2C3849" stroke="#5F6E86" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round">
<path d="M26 15l6-3 6 3v6l-6 3-6-3z" fill="url(#gm)"/>
<rect x="29" y="24" width="6" height="12" rx="1" fill="#242F3E"/>
<path d="M29 27h6M29 30h6M29 33h6" stroke="#5F6E86" stroke-width=".9"/></symbol>

<symbol id="g-rod" viewBox="0 0 64 48" fill="#2C3849" stroke="#5F6E86" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round">
<rect x="8" y="16" width="48" height="6" rx="3" fill="url(#gm)"/><rect x="8" y="26" width="48" height="6" rx="3" fill="url(#gm)"/>
<path d="M14 16v6M14 26v6M50 16v6M50 26v6" stroke="#44546B"/></symbol>

<symbol id="g-baseplate" viewBox="0 0 64 48" fill="#2C3849" stroke="#5F6E86" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round">
<rect x="12" y="14" width="40" height="8" rx="2" fill="url(#gm)"/>
<path d="M18 22h28v5H18z" fill="#242F3E"/>
<rect x="10" y="29" width="44" height="5" rx="2.5" fill="url(#gm)"/><rect x="10" y="36" width="44" height="5" rx="2.5" fill="url(#gm)"/>
<circle cx="22" cy="18" r="1.6" fill="#151F2C"/><circle cx="42" cy="18" r="1.6" fill="#151F2C"/>
<path d="M32 22v5" stroke="#5F6E86"/></symbol>

<symbol id="g-shoulder" viewBox="0 0 64 48" fill="#2C3849" stroke="#5F6E86" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round">
<path d="M10 34c0-9 7-14 16-14h26v6H28c-6 0-10 3-10 8z" fill="url(#gm)"/>
<path d="M14 22c2-3 6-4 9-4" stroke="#44546B" fill="none"/>
<rect x="8" y="34" width="12" height="6" rx="3" fill="#1B2432"/>
<rect x="10" y="14" width="44" height="5" rx="2.5" fill="url(#gm)"/>
<circle cx="46" cy="23" r="2" fill="#151F2C"/></symbol>

<symbol id="g-vplate" viewBox="0 0 64 48" fill="#2C3849" stroke="#5F6E86" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round">
<rect x="18" y="9" width="28" height="30" rx="3" fill="url(#gm)"/>
<path d="M23 13v10l9 6 9-6V13" fill="#151F2C" stroke="#7A8AA3" stroke-width="1.6"/>
<rect x="26" y="31" width="12" height="4" rx="1.5" fill="#1B2432"/>
<circle cx="32" cy="20" r="2" fill="#38BDF8" stroke="none" opacity=".8"/></symbol>

<symbol id="g-riser" viewBox="0 0 64 48" fill="#2C3849" stroke="#5F6E86" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round">
<rect x="22" y="14" width="20" height="8" rx="1.5" fill="url(#gm)"/><rect x="22" y="26" width="20" height="8" rx="1.5" fill="url(#gm)"/>
<path d="M27 22v4M37 22v4" stroke="#5F6E86" stroke-width="2"/></symbol>

<symbol id="g-nato" viewBox="0 0 64 48" fill="#2C3849" stroke="#5F6E86" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round">
<path d="M12 20h40l-3 4h-34z" fill="url(#gm)"/><rect x="15" y="24" width="34" height="5" rx="1" fill="#242F3E"/>
<path d="M20 24v5M28 24v5M36 24v5M44 24v5" stroke="#44546B" stroke-width=".9"/></symbol>

<symbol id="g-lenssupport" viewBox="0 0 64 48" fill="#2C3849" stroke="#5F6E86" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round">
<path d="M20 12h5v7a7 7 0 0 0 14 0v-7h5v7a12 12 0 0 1-24 0z" fill="url(#gm)"/>
<rect x="26" y="27" width="12" height="6" rx="2" fill="#242F3E"/>
<rect x="10" y="34" width="44" height="5" rx="2.5" fill="url(#gm)"/>
<path d="M32 33v1" stroke="#5F6E86"/></symbol>

<symbol id="g-cage" viewBox="0 0 64 48" fill="#2C3849" stroke="#5F6E86" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round">
<rect x="16" y="12" width="32" height="26" rx="3" fill="none" stroke="#7A8AA3" stroke-width="2"/>
<rect x="21" y="17" width="22" height="16" rx="2" fill="url(#gm)"/>
<path d="M25 12v-3h6v3M39 12v-3h6v3" stroke="#7A8AA3"/>
<circle cx="25" cy="21" r="1.2" fill="#5F6E86" stroke="none"/><circle cx="25" cy="29" r="1.2" fill="#5F6E86" stroke="none"/>
<circle cx="39" cy="21" r="1.2" fill="#5F6E86" stroke="none"/><circle cx="39" cy="29" r="1.2" fill="#5F6E86" stroke="none"/></symbol>

<symbol id="g-tripodhead" viewBox="0 0 64 48" fill="#2C3849" stroke="#5F6E86" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round">
<rect x="20" y="14" width="24" height="5" rx="1.5" fill="url(#gm)"/>
<path d="M26 19h12v8H26z" fill="url(#gm)"/><path d="M38 22l12 10" stroke="#7A8AA3" stroke-width="2"/>
<path d="M28 27h8v6h-8z" fill="#242F3E"/><path d="M24 33h16" stroke="#5F6E86" stroke-width="2"/></symbol>

<symbol id="g-qrplate" viewBox="0 0 64 48" fill="#2C3849" stroke="#5F6E86" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round">
<path d="M16 20h32l-2 8H18z" fill="url(#gm)"/>
<circle cx="26" cy="24" r="2" fill="#151F2C"/><circle cx="38" cy="24" r="2" fill="#151F2C"/>
<path d="M20 28v4h24v-4" stroke="#44546B" fill="none"/></symbol>

<symbol id="g-gimbal" viewBox="0 0 64 48" fill="#2C3849" stroke="#5F6E86" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round">
<path d="M32 40V30" stroke="#7A8AA3" stroke-width="3"/><rect x="27" y="40" width="10" height="5" rx="2" fill="#1B2432"/>
<circle cx="32" cy="27" r="3.4" fill="url(#gm)"/>
<path d="M32 24V16h12" stroke="#7A8AA3" stroke-width="2.4" fill="none"/><circle cx="44" cy="16" r="3.4" fill="url(#gm)"/>
<rect x="30" y="7" width="16" height="10" rx="2" fill="url(#gm)"/><circle cx="35" cy="12" r="3" fill="url(#gg)"/></symbol>

<symbol id="g-ring" viewBox="0 0 64 48" fill="none" stroke="#7A8AA3" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round">
<circle cx="32" cy="24" r="14"/>
<rect x="10" y="20" width="6" height="9" rx="2.5" fill="#2C3849" stroke="#5F6E86" stroke-width="1.2"/>
<rect x="48" y="20" width="6" height="9" rx="2.5" fill="#2C3849" stroke="#5F6E86" stroke-width="1.2"/>
<circle cx="32" cy="10" r="2" fill="#2DD4A7" stroke="none"/></symbol>

<symbol id="g-steadicam" viewBox="0 0 64 48" fill="#2C3849" stroke="#5F6E86" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round">
<rect x="22" y="8" width="20" height="6" rx="1.5" fill="url(#gm)"/>
<path d="M32 14v20" stroke="#7A8AA3" stroke-width="2.4"/>
<rect x="34" y="17" width="7" height="9" rx="2.5" fill="#1B2432"/>
<circle cx="32" cy="19" r="3" fill="url(#gm)"/>
<path d="M24 38h16" stroke="#7A8AA3" stroke-width="2"/><circle cx="24" cy="38" r="3.4" fill="#242F3E"/><circle cx="40" cy="38" r="3.4" fill="#242F3E"/></symbol>

<symbol id="g-vest" viewBox="0 0 64 48" fill="#2C3849" stroke="#5F6E86" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round">
<path d="M20 10h8l4 4 4-4h8v26a2 2 0 0 1-2 2H22a2 2 0 0 1-2-2z" fill="url(#gm)"/>
<path d="M32 18v20" stroke="#44546B"/><path d="M24 22h4M36 22h4M24 30h4M36 30h4" stroke="#44546B"/>
<path d="M44 20l8 6-4 8" stroke="#7A8AA3" stroke-width="2" fill="none"/><circle cx="52" cy="26" r="2.4" fill="#242F3E"/></symbol>

<symbol id="g-gyro" viewBox="0 0 64 48" fill="none" stroke="#5F6E86" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round">
<rect x="24" y="16" width="16" height="16" rx="3" fill="url(#gm)"/><circle cx="32" cy="24" r="3" fill="url(#gg)" stroke="none"/>
<ellipse cx="32" cy="24" rx="19" ry="8" stroke="#7A8AA3"/><ellipse cx="32" cy="24" rx="8" ry="19" stroke="#44546B"/></symbol>

<symbol id="g-monitor" viewBox="0 0 64 48" fill="#2C3849" stroke="#5F6E86" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round">
<rect x="12" y="11" width="40" height="26" rx="2.5" fill="url(#gm)"/>
<rect x="15" y="14" width="34" height="20" rx="1.5" fill="url(#gg)" stroke="none"/>
<path d="M28 37v4M22 41h20" stroke="#5F6E86"/><circle cx="49" cy="35" r="1.1" fill="#2DD4A7" stroke="none"/></symbol>

<symbol id="g-monitor-big" viewBox="0 0 64 48" fill="#2C3849" stroke="#5F6E86" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round">
<rect x="6" y="8" width="52" height="28" rx="2.5" fill="url(#gm)"/>
<rect x="9" y="11" width="46" height="22" rx="1.5" fill="url(#gg)" stroke="none"/>
<path d="M32 36v5M22 44h20l-2-3H24z" fill="#242F3E"/></symbol>

<symbol id="g-recorder" viewBox="0 0 64 48" fill="#2C3849" stroke="#5F6E86" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round">
<rect x="13" y="12" width="34" height="24" rx="2.5" fill="url(#gm)"/>
<rect x="16" y="15" width="28" height="18" rx="1.5" fill="url(#gg)" stroke="none"/>
<rect x="47" y="16" width="6" height="16" rx="1.5" fill="#1B2432"/>
<circle cx="20" cy="31" r="1.6" fill="#F87171" stroke="none"/><path d="M11 18v12" stroke="#44546B"/></symbol>

<symbol id="g-module" viewBox="0 0 64 48" fill="#2C3849" stroke="#5F6E86" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round">
<rect x="14" y="16" width="30" height="16" rx="2" fill="url(#gm)"/>
<circle cx="48" cy="20" r="3" fill="#242F3E"/><circle cx="48" cy="28" r="3" fill="#242F3E"/>
<path d="M18 20h8M18 24h12M18 28h6" stroke="#44546B"/><circle cx="38" cy="28" r="1.3" fill="#2DD4A7" stroke="none"/></symbol>

<symbol id="g-switcher" viewBox="0 0 64 48" fill="#2C3849" stroke="#5F6E86" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round">
<path d="M10 32l3-14h38l3 14a2 2 0 0 1-2 2H12a2 2 0 0 1-2-2z" fill="url(#gm)"/>
<rect x="16" y="22" width="6" height="4" rx="1" fill="#38BDF8" stroke="none"/><rect x="24" y="22" width="6" height="4" rx="1" fill="#2DD4A7" stroke="none"/>
<rect x="32" y="22" width="6" height="4" rx="1" fill="#44546B" stroke="none"/><rect x="40" y="22" width="6" height="4" rx="1" fill="#44546B" stroke="none"/>
<rect x="16" y="28" width="30" height="3" rx="1.5" fill="#1B2432"/><circle cx="24" cy="29.5" r="2" fill="#7A8AA3" stroke="none"/></symbol>

<symbol id="g-wireless" viewBox="0 0 64 48" fill="#2C3849" stroke="#5F6E86" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round">
<rect x="18" y="18" width="28" height="18" rx="2.5" fill="url(#gm)"/>
<rect x="22" y="22" width="12" height="10" rx="1.5" fill="url(#gg)" stroke="none"/>
<path d="M24 18v-8M40 18v-8" stroke="#7A8AA3" stroke-width="2"/>
<path d="M42 22a5 5 0 0 1 0 8" stroke="#38BDF8"/><circle cx="40" cy="26" r="1.2" fill="#38BDF8" stroke="none"/></symbol>

<symbol id="g-followfocus" viewBox="0 0 64 48" fill="#2C3849" stroke="#5F6E86" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round">
<circle cx="30" cy="24" r="12" fill="url(#gm)"/><circle cx="30" cy="24" r="7" fill="#1B2432"/>
<path d="M30 12v3M42 24h-3M30 36v-3M18 24h3" stroke="#7A8AA3"/>
<circle cx="30" cy="24" r="2" fill="#38BDF8" stroke="none"/>
<path d="M40 30l6 5" stroke="#7A8AA3" stroke-width="2"/><circle cx="47" cy="36" r="2.4" fill="#242F3E"/></symbol>

<symbol id="g-ffmotor" viewBox="0 0 64 48" fill="#2C3849" stroke="#5F6E86" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round">
<rect x="12" y="16" width="14" height="16" rx="2.5" fill="url(#gm)"/><circle cx="26" cy="24" r="5" fill="#1B2432"/>
<path d="M18 16v-4" stroke="#38BDF8" stroke-width="1.6"/>
<circle cx="44" cy="26" r="9" fill="url(#gm)"/><circle cx="44" cy="26" r="4.6" fill="#1B2432"/>
<rect x="40" y="12" width="8" height="6" rx="2" fill="#242F3E"/><path d="M44 12V9" stroke="#38BDF8" stroke-width="1.6"/></symbol>

<symbol id="g-mattebox" viewBox="0 0 64 48" fill="#2C3849" stroke="#5F6E86" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round">
<path d="M18 30l10-6 22-8v24l-22-4z" fill="#1B2432"/>
<rect x="26" y="10" width="26" height="6" rx="1" fill="url(#gm)"/>
<rect x="30" y="18" width="8" height="12" rx="1" fill="url(#gg)" stroke="none" opacity=".8"/>
<circle cx="18" cy="27" r="4" fill="#242F3E"/><path d="M22 34h22" stroke="#5F6E86"/></symbol>

<symbol id="g-filter-sq" viewBox="0 0 64 48" fill="#2C3849" stroke="#5F6E86" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round">
<rect x="19" y="10" width="26" height="28" rx="1.5" fill="url(#gg)" opacity=".85"/>
<rect x="19" y="10" width="26" height="28" rx="1.5" fill="none" stroke="#7A8AA3" stroke-width="1.6"/>
<path d="M22 34l20-20" stroke="#E9EEF5" opacity=".28" stroke-width="2"/></symbol>

<symbol id="g-filter-round" viewBox="0 0 64 48" fill="#2C3849" stroke="#5F6E86" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round">
<circle cx="32" cy="24" r="14" fill="url(#gg)" opacity=".85"/>
<circle cx="32" cy="24" r="14" fill="none" stroke="#7A8AA3" stroke-width="2"/>
<circle cx="32" cy="24" r="10.5" fill="none" stroke="#44546B"/>
<path d="M24 32l16-16" stroke="#E9EEF5" opacity=".25" stroke-width="2"/></symbol>

<symbol id="g-rec-audio" viewBox="0 0 64 48" fill="#2C3849" stroke="#5F6E86" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round">
<rect x="18" y="12" width="28" height="26" rx="3" fill="url(#gm)"/>
<rect x="21" y="15" width="22" height="9" rx="1.5" fill="url(#gg)" stroke="none"/>
<circle cx="25" cy="30" r="2.6" fill="#1B2432"/><circle cx="32" cy="30" r="2.6" fill="#1B2432"/><circle cx="39" cy="30" r="2.6" fill="#1B2432"/>
<path d="M24 12V8M40 12V8" stroke="#7A8AA3" stroke-width="2"/></symbol>

<symbol id="g-mixer-audio" viewBox="0 0 64 48" fill="#2C3849" stroke="#5F6E86" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round">
<rect x="10" y="13" width="44" height="24" rx="3" fill="url(#gm)"/>
<path d="M17 18v12M24 18v12M31 18v12M38 18v12" stroke="#1B2432" stroke-width="2.6"/>
<circle cx="17" cy="26" r="2" fill="#7A8AA3" stroke="none"/><circle cx="24" cy="22" r="2" fill="#7A8AA3" stroke="none"/>
<circle cx="31" cy="27" r="2" fill="#7A8AA3" stroke="none"/><circle cx="38" cy="23" r="2" fill="#7A8AA3" stroke="none"/>
<rect x="44" y="18" width="6" height="5" rx="1" fill="#2DD4A7" stroke="none"/><rect x="44" y="26" width="6" height="5" rx="1" fill="#38BDF8" stroke="none"/></symbol>

<symbol id="g-mic-lav" viewBox="0 0 64 48" fill="#2C3849" stroke="#5F6E86" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round">
<rect x="30" y="14" width="16" height="22" rx="2.5" fill="url(#gm)"/>
<rect x="33" y="17" width="10" height="7" rx="1.5" fill="url(#gg)" stroke="none"/>
<path d="M38 14v-5" stroke="#7A8AA3" stroke-width="1.6"/><circle cx="38" cy="29" r="2" fill="#1B2432"/>
<circle cx="14" cy="18" r="4" fill="url(#gm)"/><path d="M17 21c4 5 6 9 11 11" stroke="#5F6E86" fill="none"/></symbol>

<symbol id="g-mic-hand" viewBox="0 0 64 48" fill="#2C3849" stroke="#5F6E86" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round">
<circle cx="22" cy="16" r="7" fill="#1B2432"/><path d="M18 12l8 8M18 16l4 4M22 12l4 4" stroke="#7A8AA3" stroke-width=".9"/>
<path d="M26 21l14 14a3 3 0 0 1-4 4L22 25z" fill="url(#gm)"/>
<circle cx="38" cy="37" r="1.3" fill="#2DD4A7" stroke="none"/></symbol>

<symbol id="g-mic-shotgun" viewBox="0 0 64 48" fill="#2C3849" stroke="#5F6E86" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round">
<rect x="8" y="20" width="40" height="8" rx="4" fill="url(#gm)"/>
<path d="M14 22.5v3M19 22.5v3M24 22.5v3M29 22.5v3M34 22.5v3" stroke="#0F1620" stroke-width="1.6"/>
<rect x="46" y="19" width="8" height="10" rx="2" fill="#1B2432"/>
<path d="M22 28v6M17 34h10" stroke="#5F6E86"/></symbol>

<symbol id="g-headset" viewBox="0 0 64 48" fill="#2C3849" stroke="#5F6E86" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round">
<path d="M18 26v-4a14 14 0 0 1 28 0v4" fill="none" stroke="#7A8AA3" stroke-width="2"/>
<rect x="14" y="24" width="8" height="12" rx="3" fill="url(#gm)"/><rect x="42" y="24" width="8" height="12" rx="3" fill="url(#gm)"/>
<path d="M22 34c4 4 8 5 10 5" fill="none" stroke="#5F6E86"/><circle cx="33" cy="39" r="2" fill="#1B2432"/></symbol>

<symbol id="g-earpiece" viewBox="0 0 64 48" fill="#2C3849" stroke="#5F6E86" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round">
<circle cx="26" cy="20" r="6" fill="url(#gm)"/><circle cx="26" cy="20" r="2.4" fill="#1B2432"/>
<path d="M30 24c4 6 4 10 2 14" fill="none" stroke="#5F6E86"/>
<rect x="28" y="38" width="8" height="4" rx="2" fill="#242F3E"/></symbol>

<symbol id="g-cable-xlr" viewBox="0 0 64 48" fill="#2C3849" stroke="#5F6E86" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round">
<rect x="10" y="18" width="14" height="12" rx="3" fill="url(#gm)"/>
<circle cx="15" cy="22" r="1.2" fill="#7A8AA3" stroke="none"/><circle cx="19" cy="22" r="1.2" fill="#7A8AA3" stroke="none"/><circle cx="17" cy="27" r="1.2" fill="#7A8AA3" stroke="none"/>
<path d="M24 24c8 0 6 12 14 12s10-12 4-12" fill="none" stroke="#44546B" stroke-width="2.4"/>
<rect x="40" y="18" width="12" height="12" rx="3" fill="#1B2432"/></symbol>

<symbol id="g-batt-np" viewBox="0 0 64 48" fill="#2C3849" stroke="#5F6E86" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round">
<rect x="16" y="16" width="32" height="17" rx="2" fill="url(#gm)"/>
<path d="M20 20h5v9h-5z" fill="#1B2432"/>
<path d="M30 24h12" stroke="#2DD4A7" stroke-width="2"/><path d="M30 28h8" stroke="#44546B" stroke-width="2"/></symbol>

<symbol id="g-batt-v" viewBox="0 0 64 48" fill="#2C3849" stroke="#5F6E86" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round">
<rect x="15" y="11" width="34" height="27" rx="3" fill="url(#gm)"/>
<path d="M22 15l10 8 10-8" fill="none" stroke="#7A8AA3" stroke-width="2.4"/>
<rect x="22" y="27" width="20" height="6" rx="1.5" fill="#1B2432"/>
<path d="M25 30h3M30 30h3M35 30h3" stroke="#2DD4A7" stroke-width="2"/></symbol>

<symbol id="g-batt-cam" viewBox="0 0 64 48" fill="#2C3849" stroke="#5F6E86" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round">
<rect x="20" y="14" width="24" height="20" rx="2" fill="url(#gm)"/>
<path d="M24 18h6v4h-6z" fill="#1B2432"/><path d="M34 18h6M34 22h6M34 26h4" stroke="#44546B"/>
<path d="M24 27l4 5h-3l2 3" stroke="#2DD4A7" fill="none"/></symbol>

<symbol id="g-charger" viewBox="0 0 64 48" fill="#2C3849" stroke="#5F6E86" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round">
<rect x="16" y="15" width="32" height="18" rx="2.5" fill="url(#gm)"/>
<rect x="20" y="19" width="11" height="10" rx="1.5" fill="#1B2432"/><rect x="33" y="19" width="11" height="10" rx="1.5" fill="#1B2432"/>
<circle cx="25.5" cy="24" r="1.4" fill="#2DD4A7" stroke="none"/><circle cx="38.5" cy="24" r="1.4" fill="#F87171" stroke="none"/>
<path d="M32 33v5" stroke="#5F6E86"/></symbol>

<symbol id="g-charger-4" viewBox="0 0 64 48" fill="#2C3849" stroke="#5F6E86" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round">
<rect x="8" y="16" width="48" height="18" rx="2.5" fill="url(#gm)"/>
<rect x="12" y="20" width="9" height="10" rx="1.5" fill="#1B2432"/><rect x="23" y="20" width="9" height="10" rx="1.5" fill="#1B2432"/>
<rect x="34" y="20" width="9" height="10" rx="1.5" fill="#1B2432"/><rect x="45" y="20" width="9" height="10" rx="1.5" fill="#1B2432"/>
<circle cx="16.5" cy="25" r="1.2" fill="#2DD4A7" stroke="none"/><circle cx="27.5" cy="25" r="1.2" fill="#2DD4A7" stroke="none"/>
<circle cx="38.5" cy="25" r="1.2" fill="#F87171" stroke="none"/><circle cx="49.5" cy="25" r="1.2" fill="#2DD4A7" stroke="none"/></symbol>

<symbol id="g-dtap" viewBox="0 0 64 48" fill="#2C3849" stroke="#5F6E86" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round">
<rect x="24" y="18" width="16" height="14" rx="2.5" fill="url(#gm)"/>
<rect x="27" y="21" width="10" height="5" rx="1" fill="url(#gg)" stroke="none"/>
<path d="M24 25H12M40 21c8 0 8-6 14-6M40 29c8 0 8 6 14 6" fill="none" stroke="#44546B" stroke-width="2"/>
<rect x="6" y="22" width="6" height="6" rx="1.5" fill="#1B2432"/></symbol>

<symbol id="g-inverter" viewBox="0 0 64 48" fill="#2C3849" stroke="#5F6E86" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round">
<rect x="12" y="12" width="40" height="26" rx="3" fill="url(#gm)"/>
<circle cx="24" cy="25" r="7" fill="#1B2432"/><path d="M20 21l8 8M28 21l-8 8" stroke="#5F6E86"/>
<circle cx="42" cy="21" r="4.6" fill="#151F2C"/><circle cx="40" cy="21" r="1" fill="#7A8AA3" stroke="none"/><circle cx="44" cy="21" r="1" fill="#7A8AA3" stroke="none"/>
<rect x="36" y="29" width="12" height="4" rx="1" fill="#38BDF8" stroke="none" opacity=".7"/></symbol>

<symbol id="g-powerstrip" viewBox="0 0 64 48" fill="#2C3849" stroke="#5F6E86" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round">
<rect x="10" y="19" width="42" height="12" rx="3" fill="url(#gm)"/>
<circle cx="18" cy="25" r="2.8" fill="#1B2432"/><circle cx="27" cy="25" r="2.8" fill="#1B2432"/><circle cx="36" cy="25" r="2.8" fill="#1B2432"/><circle cx="45" cy="25" r="2.8" fill="#1B2432"/>
<path d="M10 25H4" stroke="#44546B" stroke-width="2"/></symbol>

<symbol id="g-reel" viewBox="0 0 64 48" fill="#2C3849" stroke="#5F6E86" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round">
<circle cx="30" cy="24" r="15" fill="none" stroke="#7A8AA3" stroke-width="2"/>
<circle cx="30" cy="24" r="10" fill="none" stroke="#44546B" stroke-width="2"/>
<circle cx="30" cy="24" r="5" fill="url(#gm)"/>
<path d="M45 24h6M42 34l6 4" fill="none" stroke="#44546B" stroke-width="2"/>
<rect x="50" y="21" width="6" height="6" rx="1.5" fill="#1B2432"/></symbol>

<symbol id="g-radio" viewBox="0 0 64 48" fill="#2C3849" stroke="#5F6E86" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round">
<rect x="24" y="12" width="17" height="28" rx="3" fill="url(#gm)"/>
<rect x="27" y="15" width="11" height="7" rx="1.5" fill="url(#gg)" stroke="none"/>
<circle cx="30" cy="27" r="1.6" fill="#1B2432"/><circle cx="35.5" cy="27" r="1.6" fill="#1B2432"/>
<circle cx="30" cy="32" r="1.6" fill="#1B2432"/><circle cx="35.5" cy="32" r="1.6" fill="#1B2432"/>
<path d="M28 12V6" stroke="#7A8AA3" stroke-width="2"/><path d="M43 18a6 6 0 0 1 0 8" fill="none" stroke="#38BDF8"/></symbol>

<symbol id="g-laptop" viewBox="0 0 64 48" fill="#2C3849" stroke="#5F6E86" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round">
<path d="M16 12h32v20H16z" fill="url(#gm)"/><rect x="19" y="15" width="26" height="14" rx="1" fill="url(#gg)" stroke="none"/>
<path d="M10 32h44l-3 5H13z" fill="#242F3E"/><path d="M28 34h8" stroke="#5F6E86"/></symbol>

<symbol id="g-capture" viewBox="0 0 64 48" fill="#2C3849" stroke="#5F6E86" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round">
<rect x="22" y="18" width="20" height="12" rx="2.5" fill="url(#gm)"/>
<path d="M14 21h8v6h-8z" fill="#1B2432"/><path d="M42 22h8v4h-8z" fill="#1B2432"/>
<circle cx="32" cy="24" r="1.6" fill="#2DD4A7" stroke="none"/></symbol>

<symbol id="g-colorpanel" viewBox="0 0 64 48" fill="#2C3849" stroke="#5F6E86" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round">
<rect x="8" y="14" width="48" height="22" rx="3" fill="url(#gm)"/>
<circle cx="19" cy="26" r="5.4" fill="#151F2C" stroke="#7A8AA3"/><circle cx="32" cy="26" r="5.4" fill="#151F2C" stroke="#7A8AA3"/><circle cx="45" cy="26" r="5.4" fill="#151F2C" stroke="#7A8AA3"/>
<path d="M13 18h6M26 18h12M39 18h6" stroke="#38BDF8" opacity=".7"/></symbol>

<symbol id="g-ssd" viewBox="0 0 64 48" fill="#2C3849" stroke="#5F6E86" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round">
<rect x="14" y="16" width="36" height="17" rx="2.5" fill="url(#gm)"/>
<rect x="18" y="20" width="16" height="9" rx="1" fill="#1B2432"/>
<path d="M38 22h8M38 26h6" stroke="#44546B"/><circle cx="46" cy="29" r="1.3" fill="#2DD4A7" stroke="none"/></symbol>

<symbol id="g-hdd" viewBox="0 0 64 48" fill="#2C3849" stroke="#5F6E86" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round">
<rect x="16" y="12" width="32" height="24" rx="3" fill="url(#gm)"/>
<circle cx="32" cy="24" r="8" fill="#151F2C"/><circle cx="32" cy="24" r="2.4" fill="#44546B"/>
<path d="M32 16l6 10" stroke="#7A8AA3"/><circle cx="42" cy="32" r="1.3" fill="#38BDF8" stroke="none"/></symbol>

<symbol id="g-reflector" viewBox="0 0 64 48" fill="#2C3849" stroke="#5F6E86" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round">
<ellipse cx="30" cy="24" rx="17" ry="15" fill="url(#gl)" opacity=".5"/>
<ellipse cx="30" cy="24" rx="17" ry="15" fill="none" stroke="#7A8AA3" stroke-width="1.8"/>
<path d="M30 9v30" stroke="#5F6E86"/><path d="M13 24h34" stroke="#5F6E86" opacity=".5"/>
<path d="M47 14c4 4 4 16 0 20" fill="none" stroke="#44546B"/></symbol>

<symbol id="g-backdrop" viewBox="0 0 64 48" fill="#2C3849" stroke="#5F6E86" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round">
<path d="M14 10h36v28c-6 2-12-2-18 0s-12 2-18 0z" fill="#161C26"/>
<path d="M23 10v27M32 10v29M41 10v27" stroke="#2A3444"/>
<path d="M12 10h40" stroke="#7A8AA3" stroke-width="2"/></symbol>

<symbol id="g-chroma" viewBox="0 0 64 48" fill="#2C3849" stroke="#5F6E86" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round">
<path d="M14 10h36v28c-6 2-12-2-18 0s-12 2-18 0z" fill="url(#gk)"/>
<path d="M23 10v27M32 10v29M41 10v27" stroke="#0F5F45" opacity=".6"/>
<path d="M12 10h40" stroke="#7A8AA3" stroke-width="2"/></symbol>

<symbol id="g-tripod" viewBox="0 0 64 48" fill="#2C3849" stroke="#5F6E86" stroke-width="1.3" stroke-linejoin="round" stroke-linecap="round">
<rect x="25" y="8" width="14" height="5" rx="1.5" fill="url(#gm)"/>
<path d="M32 13v9" stroke="#7A8AA3" stroke-width="2"/><path d="M34 16l9 9" stroke="#7A8AA3"/>
<path d="M32 22l-12 18M32 22l12 18M32 22v18" fill="none" stroke="#7A8AA3"/>
<path d="M24 32h16" stroke="#44546B"/></symbol>

<symbol id="g-suction" viewBox="0 0 64 48" fill="#2C3849" stroke="#5F6E86" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round">
<ellipse cx="30" cy="32" rx="15" ry="6" fill="#1B2432"/>
<path d="M15 32c0-7 7-11 15-11s15 4 15 11" fill="url(#gm)"/>
<rect x="26" y="12" width="8" height="10" rx="2" fill="#242F3E"/>
<path d="M34 18h10" stroke="#7A8AA3" stroke-width="2"/><circle cx="30" cy="32" r="3" fill="#151F2C"/></symbol>

<symbol id="g-extension" viewBox="0 0 64 48" fill="#2C3849" stroke="#5F6E86" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round">
<rect x="12" y="21" width="38" height="6" rx="3" fill="url(#gm)"/>
<circle cx="52" cy="24" r="4" fill="#1B2432"/><path d="M12 21v6" stroke="#44546B"/>
<path d="M18 27v5M18 32h-3M18 32h3" stroke="#44546B"/></symbol>

<symbol id="g-misc" viewBox="0 0 64 48" fill="#2C3849" stroke="#5F6E86" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round">
<path d="M14 18h36v18a2 2 0 0 1-2 2H16a2 2 0 0 1-2-2z" fill="url(#gm)"/>
<path d="M14 18l4-6h28l4 6" fill="#242F3E"/>
<rect x="27" y="24" width="10" height="5" rx="1.5" fill="#1B2432"/>
<path d="M14 30h36" stroke="#44546B"/></symbol>
</defs></svg>`;
