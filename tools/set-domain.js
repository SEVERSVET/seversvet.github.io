/* Меняет базовый адрес сайта во всех местах, где он зашит:
   canonical, og:url, og:image, twitter:image, JSON-LD, sitemap.xml, robots.txt.

   node tools/set-domain.js https://seversvet.pro/
   node tools/set-domain.js https://seversvet.github.io/        (без подпапки)
   node tools/set-domain.js --cname seversvet.pro               (+ файл CNAME для GitHub Pages)

   Текущий адрес определяется автоматически по canonical в index.html. */
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const FILES = ['index.html', 'tech.html', 'team.html', 'works.html', 'sitemap.xml', 'robots.txt'];

const args = process.argv.slice(2);
const cnameIdx = args.indexOf('--cname');
const cname = cnameIdx >= 0 ? args[cnameIdx + 1] : null;
const target = args.find(a => a.startsWith('http'));
if (!target && !cname) {
  console.error('Укажите новый адрес: node tools/set-domain.js https://seversvet.pro/');
  process.exit(1);
}

if (target) {
  const to = target.endsWith('/') ? target : target + '/';
  const from = (fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8')
    .match(/<link rel="canonical" href="([^"]+)"/) || [])[1];
  if (!from) { console.error('Не нашёл canonical в index.html'); process.exit(1); }
  if (from === to) { console.log('Адрес уже такой:', to); }
  else {
    let n = 0;
    for (const f of FILES) {
      const p = path.join(ROOT, f);
      const src = fs.readFileSync(p, 'utf8');
      const out = src.split(from).join(to);
      if (out !== src) { fs.writeFileSync(p, out); n++; }
    }
    console.log(`Адрес заменён в ${n} файлах: ${from} → ${to}`);
    console.log('Не забудь: node tools/build-offers.js (в разметке каталога тоже зашит адрес)');
  }
}

if (cname) {
  fs.writeFileSync(path.join(ROOT, 'CNAME'), cname + '\n');
  console.log('Создан CNAME:', cname, '— GitHub Pages подхватит его после пуша');
}
