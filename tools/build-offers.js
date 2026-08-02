/* Пересобирает JSON-LD каталога в tech.html из assets/catalog.js.
   Запускать после любой правки цен или состава парка:  node tools/build-offers.js
   Блок вставляется между маркерами OFFERS:START / OFFERS:END. */
const fs = require('fs'), vm = require('vm'), path = require('path');
const ROOT = path.join(__dirname, '..');
const BASE = 'https://hazzy3525-create.github.io/seversvet/';

const CATALOG = vm.runInNewContext(
  fs.readFileSync(path.join(ROOT, 'assets/catalog.js'), 'utf8') + '\n;CATALOG');

/* описания позиций в разметку не кладём: они и так есть в тексте страницы,
   а вес JSON-LD вырастает вчетверо */
const offer = it => {
  const o = {
    '@type': 'Offer',
    name: it.n,
    businessFunction: 'http://purl.org/goodrelations/v1#LeaseOut',
    availability: 'https://schema.org/InStock',
  };
  if (it.p) {
    o.priceSpecification = {
      '@type': 'UnitPriceSpecification',
      price: it.p, priceCurrency: 'RUB', unitText: 'смена 12 часов',
    };
  }
  return o;
};

const total = CATALOG.reduce((n, g) => n + g.items.length, 0);
const data = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Аренда съёмочной техники',
  name: 'Аренда съёмочной техники — СЕВЕРСВЕТ',
  description: `Прокат кинокамер, оптики, света, звука, грипа и эфирного тракта в Москве и Московской области. ${total} позиций, выдача поэлементно или комплектом, смена 12 часов.`,
  url: BASE + 'tech.html',
  image: BASE + 'assets/og-tech.jpg',
  provider: {
    '@type': 'LocalBusiness',
    '@id': BASE + '#business',
    name: 'СЕВЕРСВЕТ',
    telephone: '+7-996-445-81-75',
    areaServed: 'Москва и Московская область',
    priceRange: '₽₽',
  },
  areaServed: [
    { '@type': 'City', name: 'Москва' },
    { '@type': 'AdministrativeArea', name: 'Московская область' },
    { '@type': 'Country', name: 'Россия' },
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Парк техники',
    numberOfItems: total,
    itemListElement: CATALOG.map(g => ({
      '@type': 'OfferCatalog',
      name: g.cat,
      description: g.desc,
      numberOfItems: g.items.length,
      itemListElement: g.items.map(offer),
    })),
  },
};

const file = path.join(ROOT, 'tech.html');
const html = fs.readFileSync(file, 'utf8');
const block = `<!-- OFFERS:START (собрано tools/build-offers.js — руками не править) -->
<script type="application/ld+json">
${JSON.stringify(data)}
</script>
<!-- OFFERS:END -->`;

const re = /<!-- OFFERS:START[\s\S]*?<!-- OFFERS:END -->/;
if (!re.test(html)) { console.error('Маркеры OFFERS не найдены в tech.html'); process.exit(1); }
fs.writeFileSync(file, html.replace(re, block));
console.log(`JSON-LD обновлён: ${total} позиций в ${CATALOG.length} ветках, ${(block.length / 1024).toFixed(1)} КБ`);
