/* СЕВЕРСВЕТ × MONOLITH7 — общая логика страниц */

/* ── заявка: позиции + параметры расчёта, живут между страницами ── */
let cart = [];
let order = { shifts: 1, ship: 'msk', from: '', to: '', mode: 'day' };
try { cart = JSON.parse(localStorage.getItem('sv-cart') || '[]'); } catch (e) {}
try { Object.assign(order, JSON.parse(localStorage.getItem('sv-order') || '{}')); } catch (e) {}
cart.forEach(c => { c.qty = c.qty || 1; c.max = c.max || 1; });

const cartCount = document.getElementById('cart-count');
const toast = document.getElementById('toast');
let toastTimer;

function showToast(msg) {
  if (!toast) return;
  toast.textContent = msg; toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}
const money = n => Math.round(n).toLocaleString('ru-RU');
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const plural = (n, f) => f[n % 10 === 1 && n % 100 !== 11 ? 0
  : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2];
const shiftWord = n => plural(n, ['смена', 'смены', 'смен']);
/* «4 шт.» / «2 компл.» → сколько единиц реально есть в парке */
const stockOf = q => clamp(parseInt(q, 10) || 1, 1, 99);

/* условия доставки продублированы в разделе «Как устроена аренда» — менять надо в обоих местах */
const SHIP = {
  pickup: { n: 'Самовывоз', free: 0, fee: 0 },
  msk:    { n: 'Москва', free: 10000, fee: 1000 },
  mo:     { n: 'Московская область', free: 30000, fee: 2000 },
};
/* смена — сутки; полусмена 6 часов идёт за 70% суточной, скидка за срок на неё не действует */
const HALF_RATE = .7;
function calcOrder() {
  const base = cart.reduce((s, c) => s + (c.price || 0) * c.qty, 0);
  const half = order.mode === 'half';
  const shifts = half ? 1 : clamp(+order.shifts || 1, 1, 60);
  const rate = half ? Math.round(base * HALF_RATE) : base;
  const disc = half ? 0 : shifts >= 7 ? .20 : shifts >= 3 ? .10 : 0;
  const full = rate * shifts;
  const rent = Math.round(full * (1 - disc));
  const s = SHIP[order.ship] || SHIP.msk;
  /* порог считается по аренде за смену — так же, как написано в условиях;
     на шестичасовой аренде доставка и забор платные всегда */
  const delivery = s.fee && (half || base < s.free) ? s.fee : 0;
  return { base, half, rate, shifts, disc, full, rent, delivery, total: rent + delivery, ship: s };
}

function saveCart() {
  localStorage.setItem('sv-cart', JSON.stringify(cart));
  localStorage.setItem('sv-order', JSON.stringify(order));
  renderCartUI();
}
function renderTotals() {
  const box = document.getElementById('cart-total');
  if (!box) return;
  if (!cart.length) { box.innerHTML = ''; return; }
  const t = calcOrder();
  const row = (k, v, cls = '') => `<div class="tr ${cls}"><span>${k}</span><b>${v}</b></div>`;
  box.innerHTML =
    row('Аренда за сутки', money(t.base) + ' ₽') +
    (t.half ? row('Смена 6 часов — 70%', money(t.rate) + ' ₽', 'off') : '') +
    (t.shifts > 1 ? row(`${t.shifts} ${shiftWord(t.shifts)}`, money(t.full) + ' ₽') : '') +
    (t.disc ? row(`Скидка за срок −${t.disc * 100 | 0}%`, '−' + money(t.full - t.rent) + ' ₽', 'off') : '') +
    row((t.half ? 'Доставка и забор · ' : 'Доставка · ') + t.ship.n, t.delivery ? money(t.delivery) + ' ₽' : 'бесплатно') +
    `<div class="tr sum"><span>Ориентир по заявке</span><b>${money(t.total)} ₽</b></div>` +
    `<p class="t-note">Предварительный расчёт, не оферта: комплектом считаем отдельно и обычно дешевле.
     Залог не берём, техника оформляется договором.</p>`;
}
function renderCartUI() {
  if (cartCount) cartCount.textContent = cart.reduce((n, c) => n + c.qty, 0);
  const list = document.getElementById('cart-list');
  const empty = document.getElementById('cart-empty');
  const calc = document.getElementById('rc-calc');
  if (calc) calc.hidden = !cart.length;
  renderTotals();
  if (!list) return;
  list.innerHTML = '';
  if (empty) empty.hidden = !!cart.length;
  cart.forEach((c, i) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span class="nm">${c.name}</span>
      <span class="qty-box">
        <button class="qb" data-d="-1" aria-label="Убавить количество">−</button>
        <i class="q">${c.qty}</i>
        <button class="qb" data-d="1" aria-label="Прибавить количество"${c.qty >= c.max ? ' disabled' : ''}>+</button>
      </span>
      ${c.price ? `<i class="pr">${money(c.price * c.qty)} ₽</i>` : ''}
      <button class="rm" aria-label="Убрать позицию">✕</button>`;
    li.querySelectorAll('.qb').forEach(b => b.onclick = () => {
      c.qty = clamp(c.qty + +b.dataset.d, 1, c.max);
      saveCart();
    });
    li.querySelector('.rm').onclick = () => { cart.splice(i, 1); saveCart(); syncButtons(); };
    list.appendChild(li);
  });
}
function syncButtons() {
  document.querySelectorAll('.add').forEach(b => {
    const inCart = cart.some(c => c.id === b.dataset.id);
    b.classList.toggle('in', inCart);
    b.textContent = inCart ? 'В заявке ✓' : 'В заявку';
  });
}

/* ── каталог (только на странице техники) ── */
/* предметная иллюстрация позиции: правила читаются сверху вниз, первое совпадение выигрывает.
   Именно поэтому «Картридер CFexpress» стоит выше «CFexpress», а «Плата питания для Ronin» — выше гимбала. */
const GEAR_RULES = [
  [/анаморф|anamorphic/i, 'lens-anam'],
  [/кино-сет|spectrum|dulens|apo cf prime/i, 'lens-set'],
  [/70-200/i, 'lens-tele'],
  [/24-70|35-150/i, 'lens-zoom'],
  [/samyang|14mm/i, 'lens-wide'],
  [/50mm f\/1\.4/i, 'lens-prime'],
  [/адаптер (viltrox|pl|nikon ftz)|pl[–-]e/i, 'adapter'],
  [/картридер/i, 'reader'],
  [/cfexpress|карты памяти/i, 'card-cfe'],
  [/sd-карта/i, 'card-sd'],
  [/f200bi/i, 'light-flex'],
  [/tl60|tube/i, 'light-tube'],
  [/s60bi|focusing/i, 'light-fresnel'],
  [/extension/i, 'extension'],
  [/c-stand/i, 'cstand'],
  [/miniboom|бумом/i, 'boom'],
  [/grip head/i, 'griphead'],
  [/струбцин|mathellini/i, 'clamp'],
  [/super clamp/i, 'superclamp'],
  [/magic arm/i, 'magicarm'],
  [/sandbag|мешок/i, 'sandbag'],
  [/combo steel|стойк/i, 'stand'],
  [/переходник|адаптер neewer/i, 'screw'],
  [/род smallrig|15-мм родов/i, 'rod'],
  [/площадка smallrig dbc/i, 'baseplate'],
  [/плечев/i, 'shoulder'],
  [/крепление v-mount|v-lock/i, 'vplate'],
  [/увеличитель высоты/i, 'riser'],
  [/nato/i, 'nato'],
  [/lws|поддержка объектива/i, 'lenssupport'],
  [/штативная головка/i, 'tripodhead'],
  [/быстросъёмная площадка|501pl/i, 'qrplate'],
  [/cineback/i, 'cage'],
  [/tilta ring|кольцо/i, 'ring'],
  [/d-tap|плата питания/i, 'dtap'],
  [/rs4|гимбал|ronin/i, 'gimbal'],
  [/glidecam|стедикам/i, 'steadicam'],
  [/жилет|vest/i, 'vest'],
  [/гироскоп/i, 'gyro'],
  [/ninja v/i, 'recorder'],
  [/atem|atomx cast/i, 'switcher'],
  [/atomx|exh-8/i, 'module'],
  [/shimbol|mars 300|видеосендер/i, 'wireless'],
  [/playback-монитор|32"/i, 'monitor-big'],
  [/feelworld|lut/i, 'monitor'],
  [/nucleus/i, 'ffmotor'],
  [/follow focus|фоллоу-фокус/i, 'followfocus'],
  [/компендиум|matte box/i, 'mattebox'],
  [/4×5\.65|поляризатор/i, 'filter-sq'],
  [/фильтр/i, 'filter-round'],
  [/zoom h8/i, 'rec-audio'],
  [/zoom p4|подкаст/i, 'mixer-audio'],
  [/пушка|sm89|vm40/i, 'mic-shotgun'],
  [/ручной радиомикрофон|wh-m1/i, 'mic-hand'],
  [/петличк|movelink|boomx|lark|tx3|радиосистема/i, 'mic-lav'],
  [/телесного|скрыт/i, 'earpiece'],
  [/гарнитур|headset|интерком/i, 'headset'],
  [/кабель.*xlr|xlr.*кабель|2×xlr/i, 'cable-xlr'],
  [/аккумуляторы для sony|np-fz/i, 'batt-cam'],
  [/зарядная станция|swit/i, 'charger-4'],
  [/зарядное/i, 'charger'],
  [/np-f/i, 'batt-np'],
  [/v-mount smallrig vb/i, 'batt-v'],
  [/инвертор/i, 'inverter'],
  [/удлинитель/i, 'powerstrip'],
  [/катушка/i, 'reel'],
  [/рация|quansheng/i, 'radio'],
  [/macbook/i, 'laptop'],
  [/карта захвата|ezcap/i, 'capture'],
  [/color panel|davinci/i, 'colorpanel'],
  [/ssd/i, 'ssd'],
  [/hdd/i, 'hdd'],
  [/отражатель|рассеиватель/i, 'reflector'],
  [/хромакей|зелёная/i, 'chroma'],
  [/ткань|фон/i, 'backdrop'],
  [/штатив/i, 'tripod'],
  [/присоск/i, 'suction'],
  [/nikon zr/i, 'cam-cine'],
  [/fx3/i, 'cam-box'],
  [/z6iii/i, 'cam-hybrid'],
];
/* если правило не сработало — предмет по ветке каталога */
const CAT_FALLBACK = ['cam-cine','lens-prime','adapter','card-cfe','light-flex','stand','rod','gimbal','monitor','filter-sq','mic-lav','batt-v','ssd','misc'];
const gearOf = (name, gi) => (GEAR_RULES.find(r => r[0].test(name)) || [])[1] || CAT_FALLBACK[gi] || 'misc';
/* короткие имена для чипов якорной навигации — полные остаются в заголовках веток */
const CAT_SHORT = {
  'Адаптеры и переходники оптики': 'Адаптеры',
  'Носители и картридеры': 'Носители',
  'Световое оборудование': 'Свет',
  'Грип, стойки, крепёж': 'Грип и стойки',
  'Риг (15-мм система)': 'Риг',
  'Стабилизация и операторская оснастка': 'Стабилизация',
  'Мониторы, рекордеры, видеоассистенты': 'Мониторы и эфир',
  'Фокусировка, компендиум, фильтры': 'Фокус и фильтры',
  'Звуковое оборудование': 'Звук',
  'Электропитание и батареи': 'Питание',
  'Связь, DIT-станция, хранение данных': 'Связь и DIT',
  'Специальное оборудование и аксессуары': 'Спецоборудование',
};
const catalogRoot = document.getElementById('catalog-root');

if (catalogRoot && typeof GEAR_SPRITE !== 'undefined') document.body.insertAdjacentHTML('afterbegin', GEAR_SPRITE);

if (catalogRoot && typeof CATALOG !== 'undefined') {
  const catNav = document.getElementById('cat-nav');
  let totalItems = 0;

  CATALOG.forEach((group, gi) => {
    const idx = String(gi + 1).padStart(2, '0');
    if (catNav) {
      const a = document.createElement('a');
      a.href = '#cat-' + idx;
      a.innerHTML = `<span class="n">${idx}</span>${CAT_SHORT[group.cat] || group.cat}`;
      a.title = group.cat;
      catNav.appendChild(a);
    }
    const g = document.createElement('div');
    g.className = 'cat-group'; g.id = 'cat-' + idx;
    const count = group.items.length; totalItems += count;
    g.innerHTML = `
      <div class="cat-head">
        <span class="idx">${idx}</span>
        <h3>${group.cat}</h3>
        <span class="cnt">${count} поз.</span>
      </div>
      <p class="cat-desc">${group.desc}</p>
      <div class="grid"></div>`;
    const grid = g.querySelector('.grid');
    group.items.forEach((it, ii) => {
      const id = gi + '-' + ii;
      const card = document.createElement('div');
      card.className = 'item'; card.dataset.id = id;
      card.innerHTML = `
        <div class="i-pic" aria-hidden="true">${it.img
          ? `<img src="assets/gear/${it.img}" alt="" loading="lazy">`
          : `<svg viewBox="0 0 64 48"><use href="#g-${gearOf(it.n, gi)}"/></svg>`}</div>
        <div class="i-top"><h4>${it.n}</h4><span class="qty">${it.q}</span></div>
        <p>${it.d}</p>
        <div class="i-foot">
          <span class="price">${it.p ? `от <b>${money(it.p)} ₽</b> / сутки` : 'цена — по запросу'}</span>
          <button class="add" data-id="${id}" data-name="${it.n.replace(/"/g, '&quot;')}" data-price="${it.p || 0}" data-max="${stockOf(it.q)}" aria-label="Добавить в заявку: ${it.n.replace(/"/g, '&quot;')}">В заявку</button>
        </div>`;
      grid.appendChild(card);
    });
    catalogRoot.appendChild(g);
  });

  const statItems = document.getElementById('stat-items');
  if (statItems) statItems.textContent = totalItems + '+';
  const statCats = document.getElementById('stat-cats');
  if (statCats) statCats.textContent = CATALOG.length;

  document.addEventListener('click', e => {
    const b = e.target.closest('.add'); if (!b) return;
    const id = b.dataset.id, name = b.dataset.name, price = +b.dataset.price || 0;
    const idx = cart.findIndex(c => c.id === id);
    if (idx >= 0) { cart.splice(idx, 1); showToast('Убрано из заявки'); }
    else { cart.push({ id, name, price, qty: 1, max: +b.dataset.max || 1 }); showToast('Добавлено в заявку: ' + name); }
    saveCart(); syncButtons();
  });
  syncButtons();
}

/* ── статы на главной (без каталога на странице) ── */
if (!catalogRoot && typeof CATALOG !== 'undefined') {
  const statItems = document.getElementById('stat-items');
  if (statItems) statItems.textContent = CATALOG.reduce((n, g) => n + g.items.length, 0) + '+';
  const statCats = document.getElementById('stat-cats');
  if (statCats) statCats.textContent = CATALOG.length;
}

/* ── форма заявки ── */
const buildBtn = document.getElementById('build-req');
const $ = id => document.getElementById(id);
const FORM_FIELDS = ['f-name', 'f-contact', 'f-from', 'f-to', 'f-type', 'f-need', 'f-msg'];
const ruDate = s => {
  const d = new Date(s + 'T00:00');
  return isNaN(d) ? s : d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
};

if (buildBtn) {
  /* черновик: заявку часто собирают в несколько заходов, между вкладками каталога */
  let draft = {};
  try { draft = JSON.parse(localStorage.getItem('sv-form') || '{}'); } catch (e) {}
  FORM_FIELDS.forEach(id => {
    const el = $(id);
    if (draft[id]) el.value = draft[id];
    el.addEventListener('input', () => {
      draft[id] = el.value;
      localStorage.setItem('sv-form', JSON.stringify(draft));
      el.classList.remove('invalid');
      if (id === 'f-from' || id === 'f-to') syncShiftsFromDates();
    });
  });

  const shiftsEl = $('f-shifts'), shipEl = $('f-ship'), modeEl = $('f-mode');
  shiftsEl.value = order.shifts || 1;
  shipEl.value = order.ship || 'msk';
  modeEl.value = order.mode || 'day';
  $('f-from').value = order.from || draft['f-from'] || '';
  $('f-to').value = order.to || draft['f-to'] || '';

  /* шесть часов берут разово: счётчик суток на это время не работает */
  function syncMode() {
    order.mode = modeEl.value;
    const half = order.mode === 'half';
    shiftsEl.disabled = half;
    shiftsEl.value = half ? 1 : order.shifts;
    saveCart();
  }
  /* даты ведут число смен: две даты подряд = двое суток */
  function syncShiftsFromDates() {
    const from = $('f-from').value, to = $('f-to').value;
    order.from = from; order.to = to;
    if (from && to) {
      const days = Math.round((new Date(to) - new Date(from)) / 86400000) + 1;
      if (days >= 1) {
        order.shifts = clamp(days, 1, 60);
        if (order.mode !== 'half') shiftsEl.value = order.shifts;
      }
    }
    saveCart();
  }
  shiftsEl.addEventListener('input', () => { order.shifts = clamp(+shiftsEl.value || 1, 1, 60); saveCart(); });
  shipEl.addEventListener('change', () => { order.ship = shipEl.value; saveCart(); });
  modeEl.addEventListener('change', syncMode);
  syncMode();
  syncShiftsFromDates();

  buildBtn.onclick = async () => {
    const name = $('f-name').value.trim();
    const contact = $('f-contact').value.trim();
    const bad = [!name && 'f-name', !contact && 'f-contact'].filter(Boolean);
    if (bad.length) {
      bad.forEach(id => $(id).classList.add('invalid'));
      $(bad[0]).focus();
      showToast('Заполните имя и контакт — иначе не сможем ответить');
      return;
    }
    const from = $('f-from').value, to = $('f-to').value;
    const t = calcOrder();
    let text = `ЗАЯВКА · СЕВЕРСВЕТ × MONOLITH7\n`;
    text += `\nИмя: ${name}\nКонтакт: ${contact}\nЗадача: ${$('f-type').value}\nФормат: ${$('f-need').value}`;
    /* на шестичасовой смене вторая дата только путает: техника уходит и возвращается в один день */
    if (from) text += `\nДаты: ${ruDate(from)}${to && to !== from && !t.half ? ' — ' + ruDate(to) : ''} (${t.half ? 'смена 6 часов' : `${t.shifts} ${shiftWord(t.shifts)} по суткам`})`;
    const msg = $('f-msg').value.trim();
    if (msg) text += `\nО проекте: ${msg}`;
    if (cart.length) {
      text += `\n\nТехника (${cart.length} поз.):`;
      cart.forEach(c => text += `\n— ${c.name}${c.qty > 1 ? ` ×${c.qty}` : ''}${c.price ? ` — ${money(c.price * c.qty)} ₽/сутки` : ''}`);
      text += `\n\nРАСЧЁТ (ориентир)`;
      text += `\nАренда за сутки: ${money(t.base)} ₽`;
      if (t.half) text += `\nСмена 6 часов — 70%: ${money(t.rate)} ₽`;
      if (t.shifts > 1) text += `\nСуток: ${t.shifts} → ${money(t.full)} ₽`;
      // скидка и доставка ниже — порядок строк повторяет расчёт на сайте
      if (t.disc) text += `\nСкидка за срок −${t.disc * 100 | 0}%: −${money(t.full - t.rent)} ₽`;
      text += `\n${t.half ? 'Доставка и забор' : 'Доставка'} (${t.ship.n}): ${t.delivery ? money(t.delivery) + ' ₽' : 'бесплатно'}`;
      text += `\nИТОГО ориентир: ${money(t.total)} ₽`;
    }
    text += `\n\n(заявка собрана на сайте СЕВЕРСВЕТ × MONOLITH7)`;
    const out = $('req-out');
    $('req-text').value = text;
    out.classList.add('show');
    try { await navigator.clipboard.writeText(text); showToast('Заявка скопирована — вставьте её в Telegram'); }
    catch (e) { showToast('Заявка собрана — скопируйте текст вручную'); }
    out.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };
  $('copy-req').onclick = async () => {
    const t = $('req-text');
    try { await navigator.clipboard.writeText(t.value); showToast('Скопировано'); }
    catch (e) { t.select(); document.execCommand('copy'); showToast('Скопировано'); }
  };
}

/* ── кадры портфолио (данные в assets/portfolio.js) ── */
function shotEl(s) {
  const d = document.createElement('div');
  d.className = 'bts-shot' + (s.tall ? ' tall' : '') + (s.wide ? ' wide' : '');
  d.innerHTML = `<img src="assets/work/${s.id}.webp" alt="${s.cap || 'Кадр со смены'}" loading="lazy"><div class="cap">${s.cap || ''}</div>`;
  return d;
}

/* галерея на главной — только избранное (home) */
const btsGrid = document.getElementById('bts-grid');
if (btsGrid && typeof SHOTS !== 'undefined') {
  const picks = SHOTS.filter(s => s.home);
  if (!picks.length) {
    const sec = document.getElementById('bts-section');
    if (sec) sec.style.display = 'none';
  } else {
    picks.forEach(s => btsGrid.appendChild(shotEl(s)));
  }
}

/* ── страница «Работы» ── */
const shotsRoot = document.getElementById('shots-root');
if (shotsRoot && typeof SHOTS !== 'undefined') {
  SHOT_GROUPS.forEach(g => {
    const items = SHOTS.filter(s => s.g === g.g);
    if (!items.length) return;
    const box = document.createElement('div');
    box.className = 'cat-group';
    box.innerHTML = `
      <div class="cat-head">
        <span class="idx">${g.n}</span>
        <h3>${g.t}</h3>
        <span class="cnt">${items.length} кадр.</span>
      </div>
      <p class="cat-desc">${g.d}</p>
      <div class="bts-grid" style="margin-top:0"></div>`;
    const grid = box.querySelector('.bts-grid');
    items.forEach(s => grid.appendChild(shotEl(s)));
    shotsRoot.appendChild(box);
  });
}

/* окно просмотра ролика */
const player = document.getElementById('player');
const playerVideo = document.getElementById('player-video');
function openFilm(id, title) {
  if (!player) return;
  document.getElementById('player-title').textContent = title;
  playerVideo.src = `assets/film/${id}.mp4`;
  playerVideo.poster = `assets/film/${id}.webp`;
  player.hidden = false;
  document.body.style.overflow = 'hidden';
  playerVideo.play().catch(() => {});
}
function closeFilm() {
  if (!player || player.hidden) return;
  playerVideo.pause();
  playerVideo.removeAttribute('src');
  playerVideo.load();
  player.hidden = true;
  document.body.style.overflow = '';
}
if (player) {
  document.getElementById('player-close').onclick = closeFilm;
  player.addEventListener('click', e => { if (e.target === player) closeFilm(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeFilm(); });
}

function filmCard(f) {
  const a = document.createElement('article');
  a.className = 'film';
  a.innerHTML = `
    <button class="film-pic" aria-label="Смотреть: ${f.t}">
      <img src="assets/film/${f.id}.webp" alt="${f.t}" loading="lazy">
      <video src="assets/film/${f.id}-loop.mp4" muted loop playsinline preload="none" aria-hidden="true"></video>
      ${f.len ? `<span class="film-len">${f.len}</span>` : ''}
      <span class="film-play"><span class="tri">▶</span>Смотреть</span>
    </button>
    <div class="film-meta">
      <div class="f-sub">${f.s}</div>
      <h3>${f.t}</h3>
      <p>${f.d}</p>
    </div>`;
  const pic = a.querySelector('.film-pic');
  const loop = a.querySelector('video');
  pic.onclick = () => openFilm(f.id, f.t);
  /* немой отрывок — только на устройствах с курсором, чтобы не жечь мобильный трафик */
  if (matchMedia('(hover:hover)').matches) {
    pic.addEventListener('mouseenter', () => {
      pic.classList.add('playing');
      loop.play().catch(() => {});
    });
    pic.addEventListener('mouseleave', () => {
      pic.classList.remove('playing');
      loop.pause(); loop.currentTime = 0;
    });
  }
  return a;
}

const reelBox = document.getElementById('reel-box');
if (reelBox && typeof FILMS !== 'undefined') {
  const reel = FILMS.find(f => f.g === 'reel');
  if (reel) {
    reelBox.innerHTML = `<video controls playsinline preload="none"
      poster="assets/film/${reel.id}.webp" src="assets/film/${reel.id}.mp4"></video>`;
  } else {
    reelBox.closest('section').style.display = 'none';
  }
}

const filmsRoot = document.getElementById('films-root');
if (filmsRoot && typeof FILMS !== 'undefined') {
  FILM_GROUPS.forEach(g => {
    const items = FILMS.filter(f => f.g === g.g);
    if (!items.length) return;
    const box = document.createElement('div');
    box.className = 'cat-group';
    box.innerHTML = `
      <div class="cat-head">
        <span class="idx">${g.n}</span>
        <h3>${g.t}</h3>
        <span class="cnt">${items.length} рол.</span>
      </div>
      <p class="cat-desc">${g.d}</p>
      <div class="film-grid"></div>`;
    const grid = box.querySelector('.film-grid');
    items.forEach(f => grid.appendChild(filmCard(f)));
    filmsRoot.appendChild(box);
  });
}

/* ── меню ── */
const burger = document.getElementById('burger');
const navLinks = document.getElementById('nav-links');
if (burger && navLinks) {
  burger.onclick = () => navLinks.classList.toggle('open');
  navLinks.addEventListener('click', e => { if (e.target.tagName === 'A') navLinks.classList.remove('open'); });
}

/* ── появление секций ── */
if (!matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: .1, rootMargin: '0px 0px -6% 0px' });
  document.querySelectorAll('.svc,.kit,.duo-card,.duo-plus,.dept,.term,.contact,.cycle,.crew-note,.cat-group,.feature,.gate,.bts-shot').forEach((el, i) => {
    el.classList.add('rv');
    el.style.transitionDelay = (i % 4) * 60 + 'ms';
    io.observe(el);
  });
}

renderCartUI();
