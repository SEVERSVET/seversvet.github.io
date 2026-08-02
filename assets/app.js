/* СЕВЕРСВЕТ × MONOLITH7 — общая логика страниц */

/* ── корзина (живёт между страницами) ── */
let cart = [];
try { cart = JSON.parse(localStorage.getItem('sv-cart') || '[]'); } catch (e) {}
const cartCount = document.getElementById('cart-count');
const toast = document.getElementById('toast');
let toastTimer;

function showToast(msg) {
  if (!toast) return;
  toast.textContent = msg; toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}
function saveCart() { localStorage.setItem('sv-cart', JSON.stringify(cart)); renderCartUI(); }
function renderCartUI() {
  if (cartCount) cartCount.textContent = cart.length;
  const list = document.getElementById('cart-list');
  const empty = document.getElementById('cart-empty');
  if (!list) return;
  list.innerHTML = '';
  if (empty) empty.style.display = cart.length ? 'none' : 'block';
  cart.forEach((c, i) => {
    const li = document.createElement('li');
    li.innerHTML = `<span>${c.name}</span><button class="rm" aria-label="Убрать">✕</button>`;
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
const CAT_ICONS = ['cam','lens','adapter','card','light','grip','rig','gimbal','monitor','filter','sound','power','comm','misc'];
const catalogRoot = document.getElementById('catalog-root');

if (catalogRoot && typeof CATALOG !== 'undefined') {
  const catNav = document.getElementById('cat-nav');
  let totalItems = 0;

  CATALOG.forEach((group, gi) => {
    const idx = String(gi + 1).padStart(2, '0');
    if (catNav) {
      const a = document.createElement('a');
      a.href = '#cat-' + idx;
      a.innerHTML = `<span class="n">${idx}</span>${group.cat}`;
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
        <div class="i-pic" aria-hidden="true"><svg><use href="#ic-${CAT_ICONS[gi] || 'misc'}"/></svg></div>
        <div class="i-top"><h4>${it.n}</h4><span class="qty">${it.q}</span></div>
        <p>${it.d}</p>
        <div class="i-foot">
          <span class="price">цена — по запросу</span>
          <button class="add" data-id="${id}" data-name="${it.n.replace(/"/g, '&quot;')}" aria-label="Добавить в заявку: ${it.n.replace(/"/g, '&quot;')}">В заявку</button>
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
    const id = b.dataset.id, name = b.dataset.name;
    const idx = cart.findIndex(c => c.id === id);
    if (idx >= 0) { cart.splice(idx, 1); showToast('Убрано из заявки'); }
    else { cart.push({ id, name }); showToast('Добавлено в заявку: ' + name); }
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
if (buildBtn) {
  buildBtn.onclick = async () => {
    const name = document.getElementById('f-name').value.trim();
    const contact = document.getElementById('f-contact').value.trim();
    if (!name || !contact) { showToast('Заполните имя и контакт — иначе не сможем ответить'); return; }
    const dates = document.getElementById('f-dates').value.trim();
    const type = document.getElementById('f-type').value;
    const need = document.getElementById('f-need').value;
    const msg = document.getElementById('f-msg').value.trim();
    let text = `ЗАЯВКА · СЕВЕРСВЕТ × MONOLITH7\n`;
    text += `\nИмя: ${name}\nКонтакт: ${contact}\nЗадача: ${type}\nФормат: ${need}`;
    if (dates) text += `\nДаты: ${dates}`;
    if (msg) text += `\nО проекте: ${msg}`;
    if (cart.length) {
      text += `\n\nТехника (${cart.length} поз.):`;
      cart.forEach(c => text += `\n— ${c.name}`);
    }
    text += `\n\n(заявка собрана на сайте СЕВЕРСВЕТ × MONOLITH7)`;
    const out = document.getElementById('req-out');
    document.getElementById('req-text').value = text;
    out.classList.add('show');
    try { await navigator.clipboard.writeText(text); showToast('Заявка скопирована — вставьте её в Telegram'); }
    catch (e) { showToast('Заявка собрана — скопируйте текст вручную'); }
    out.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };
  document.getElementById('copy-req').onclick = async () => {
    const t = document.getElementById('req-text');
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
