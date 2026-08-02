/* Скриншоты живых страниц без телефона: поднимает headless Edge по CDP,
   скроллит к нужной секции и снимает вьюпорт.
   node tools/shots.js <url> <ширина> <папка> имя=селектор ...
   Пример: node tools/shots.js http://localhost:8451/tech.html 1440 shots terms=#terms hero=top
   Ширина < 600 включает мобильную эмуляцию. Переменная SEED — JS, который выполняется
   до повторной загрузки (например, положить позиции в localStorage). */
const { spawn } = require('child_process');
const fs = require('fs');

const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const PORT = 9333;
const [url, wRaw, outDir, ...targets] = process.argv.slice(2);
const W = +wRaw || 1440, H = W < 600 ? 844 : 900;
fs.mkdirSync(outDir, { recursive: true });

const edge = spawn(EDGE, ['--headless=new', '--disable-gpu', '--hide-scrollbars',
  `--remote-debugging-port=${PORT}`, `--window-size=${W},${H}`, '--force-device-scale-factor=1',
  '--no-first-run', '--user-data-dir=' + outDir + '/profile', 'about:blank'], { stdio: 'ignore' });

const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  let ws, list;
  for (let i = 0; i < 40 && !list; i++) {
    await sleep(250);
    try { list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json(); } catch (e) {}
  }
  const page = list.find(t => t.type === 'page');
  ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise(r => ws.addEventListener('open', r));

  let id = 0;
  const waiters = new Map();
  ws.addEventListener('message', e => {
    const m = JSON.parse(e.data);
    if (m.id && waiters.has(m.id)) { waiters.get(m.id)(m.result); waiters.delete(m.id); }
  });
  const send = (method, params = {}) => new Promise(res => {
    const myId = ++id; waiters.set(myId, res);
    ws.send(JSON.stringify({ id: myId, method, params }));
  });

  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: W < 600 });
  await send('Page.navigate', { url });
  await sleep(2500);
  if (process.env.SEED) {
    await send('Runtime.evaluate', { expression: process.env.SEED });
    await send('Page.navigate', { url });
    await sleep(2500);
  }

  for (const t of targets) {
    const [name, sel] = t.split('=');
    if (sel && sel !== 'top') {
      await send('Runtime.evaluate', { expression:
        `(()=>{const e=document.querySelector(${JSON.stringify(sel)}); if(e) e.scrollIntoView({block:'start'}); return !!e;})()` });
      await sleep(600);
    }
    const { data } = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${outDir}/${name}.png`, Buffer.from(data, 'base64'));
    console.log(`${name}.png`);
  }
  ws.close();
  edge.kill();
  process.exit(0);
})();
