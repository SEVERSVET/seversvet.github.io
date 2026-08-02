/* Сторож условий аренды: тарифы живут в assets/app.js, а текстом продублированы
   в tech.html (блок «Как устроена аренда», вопросы и разметка FAQ).
   Скрипт сверяет цифры и падает, если тексты разъехались с расчётом.
   Запускать после любой правки цен:  node tools/check-terms.js */
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const app = fs.readFileSync(path.join(ROOT, 'assets/app.js'), 'utf8');
/* в тексте страницы числа набраны с неразрывными пробелами — сравниваем по обычным */
const html = fs.readFileSync(path.join(ROOT, 'tech.html'), 'utf8')
  .replace(/&nbsp;/g, ' ').replace(/[  ]/g, ' ');

const grab = (re, what) => {
  const m = app.match(re);
  if (!m) { console.error(`Не нашёл в app.js: ${what}`); process.exit(1); }
  return m.slice(1).map(Number);
};
/* в коде доли (.7, .20) — на странице проценты */
const pct = (re, what) => grab(re, what).map(n => Math.round(Number('0.' + n) * 100));
const [half] = pct(/HALF_RATE = \.(\d+)/, 'HALF_RATE');
const [d7, d3] = pct(/shifts >= 7 \? \.(\d+) : shifts >= 3 \? \.(\d+)/, 'скидки за срок');
const [mskFree, mskFee] = grab(/msk:\s*\{ n: '[^']*', free: (\d+), fee: (\d+) \}/, 'тариф Москвы');
const [moFree, moFee] = grab(/mo:\s*\{ n: '[^']*', free: (\d+), fee: (\d+) \}/, 'тариф области');

const ru = n => n.toLocaleString('ru-RU').replace(/[  ]/g, ' ');
const must = [
  [`${half}% от суточной`, 'условия: цена шестичасовой смены'],
  [`−${d3}% на всю технику`, 'условия: скидка от 3 суток'],
  [`−${d7}% на всю технику`, 'условия: скидка от 7 суток'],
  [`От 3 суток — минус ${d3}%`, 'вопросы: скидка от 3 суток'],
  [`от 7 суток — минус ${d7}%`, 'вопросы: скидка от 7 суток'],
  [`${half}% от суточной цены`, 'вопросы: шестичасовая смена'],
  [`бесплатно от ${ru(mskFree)} ₽, иначе ${ru(mskFee)} ₽`, 'условия: подача по Москве'],
  [`бесплатно от ${ru(moFree)} ₽, иначе ${ru(moFee)} ₽`, 'условия: подача по области'],
  [`${ru(mskFee)} ₽ Москва · ${ru(moFee)} ₽ область`, 'условия: забор с площадки'],
  [`бесплатно от ${ru(mskFree)} ₽</span>`, 'карточка в шапке: подача'],
  [`−${d3}%</span>`, 'карточка в шапке: скидка от 3 суток'],
  [`−${d7}%</span>`, 'карточка в шапке: скидка от 7 суток'],
  [`от 3 суток −${d3}%, от 7 −${d7}%`, 'пустая корзина: скидки'],
  [`от ${ru(mskFee)} ₽ по Москве и от ${ru(moFee)} ₽ по области`, 'вопросы: логистика на 6 часов'],
  [`${ru(mskFee)} ₽ по Москве, ${ru(moFee)} ₽ по области`, 'вопросы: тариф забора'],
  [`от ${ru(mskFree)} ₽ по Москве, от ${ru(moFree)} ₽`, 'вопросы: бесплатный порог только на подачу'],
];
const lost = must.filter(([s]) => !html.includes(s));
if (lost.length) {
  console.error('Текст на странице разошёлся с расчётом в app.js:');
  lost.forEach(([s, where]) => console.error(`  · ${where} — ждали «${s}»`));
  process.exit(1);
}
console.log(`Условия сходятся: смена — сутки, 6 часов = ${half}%, скидки ${d3}/${d7}%, доставка ${mskFee}/${moFee} ₽`);
