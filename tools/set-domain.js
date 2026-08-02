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
  }
}

if (target) {
  /* адрес зашит ещё и в разметке каталога — пересобираем сразу, иначе она разойдётся */
  require('child_process').execFileSync(process.execPath, [path.join(__dirname, 'build-offers.js')],
    { stdio: 'inherit' });
}

if (cname) {
  /* Файл CNAME переключает Pages на кастомный домен: если DNS домена ещё не смотрит
     на GitHub, сайт станет недоступен и по новому, и по старому адресу. Поэтому проверяем. */
  const GH = ['185.199.108.153', '185.199.109.153', '185.199.110.153', '185.199.111.153'];
  const write = () => {
    fs.writeFileSync(path.join(ROOT, 'CNAME'), cname + '\n');
    console.log('Создан CNAME:', cname, '— GitHub Pages подхватит его после пуша');
  };
  require('dns').promises.resolve4(cname).then(ips => {
    const ok = ips.some(ip => GH.includes(ip));
    if (ok) return write();
    console.error(`\nСТОП: ${cname} сейчас указывает на ${ips.join(', ')}, а не на GitHub Pages.`);
    console.error('Сначала пропиши в DNS домена четыре A-записи:\n  ' + GH.join('\n  '));
    console.error('Потом повтори команду. Принудительно: добавь --force.');
    if (args.includes('--force')) write(); else process.exitCode = 2;
  }).catch(() => {
    console.error(`\nСТОП: домен ${cname} не резолвится — похоже, он ещё не куплен или DNS не настроен.`);
    console.error('Пуш с этим CNAME положит сайт: старый адрес начнёт редиректить в никуда.');
    console.error('Купи домен, пропиши A-записи GitHub Pages, повтори команду. Принудительно: --force.');
    if (args.includes('--force')) write(); else process.exitCode = 2;
  });
}
