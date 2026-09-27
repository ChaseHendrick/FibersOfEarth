// Capture real application states at 60 fps of controlled browser time.
// Optional documentation tooling only; it never runs in CI or changes the app.
import {chromium} from 'playwright';
import {spawn, spawnSync} from 'node:child_process';
import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const python = process.env.TOUR_PYTHON || 'python3';
if (spawnSync(python, ['scripts/encode-tour.py', '--check'], {cwd: root, stdio: 'inherit'}).status !== 0) {
  console.error('See docs/MEDIA.md for the optional tour dependencies and TOUR_PYTHON.');
  process.exit(1);
}
await fs.access(path.join(root, 'dist/index.html'));
const framesDir = path.join(root, 'work/readme-tour');
const outputDir = path.join(root, 'docs/screenshots');
await fs.mkdir(framesDir, {recursive: true});
await fs.mkdir(outputDir, {recursive: true});
const port = process.env.TOUR_PORT || '4182';
const server = spawn(process.execPath, ['scripts/serve.mjs'], {
  cwd: root, env: {...process.env, PORT: port}, stdio: ['ignore', 'pipe', 'inherit']
});
let browser;
try {
  await new Promise((resolve, reject) => {
    server.stdout.once('data', resolve);
    server.once('error', reject);
    server.once('exit', code => reject(Error('Preview server exited: ' + code)));
  });
  browser = await chromium.launch({
    headless: true,
    ...(process.env.BROWSER_CHANNEL ? {channel: process.env.BROWSER_CHANNEL} : {}),
    ...(process.env.BROWSER_EXECUTABLE ? {executablePath: process.env.BROWSER_EXECUTABLE} : {})
  });
  const context = await browser.newContext({
    viewport: {width: 1280, height: 880}, deviceScaleFactor: 1, reducedMotion: 'no-preference'
  });
  const page = await context.newPage();
  const errors = [], frames = [], scenes = [];
  const fps = 60;
  let elapsed = 0;
  page.on('pageerror', error => errors.push(error.message));
  const epoch = Date.UTC(2026, 0, 1);
  await page.clock.install({time: epoch});
  await page.goto(`http://127.0.0.1:${port}/#/atlas/wool`);
  await page.locator('.map-node').first().waitFor();
  await page.evaluate(() => document.fonts.ready);
  await page.clock.pauseAt(epoch + 60000);
  await page.mouse.move(1270, 875);

  // Playwright's default fake rAF ticks at 16 ms. Use one callback batch per
  // output frame instead, avoiding an extra animation step every 24 frames.
  await page.evaluate(() => {
    const queue = new Map();
    let id = 1000000;
    window.__tourRAF = {queue, now: performance.now()};
    window.requestAnimationFrame = callback => { queue.set(++id, callback); return id; };
    window.cancelAnimationFrame = handle => queue.delete(handle);
    Object.defineProperty(performance, 'now', {configurable: true, value: () => window.__tourRAF.now});
  });
  // Drain the animation callback queued before installing the capture clock.
  await page.clock.runFor(32);
  await page.evaluate(() => {
    const clock = window.__tourRAF;
    clock.now += 32;
    clock.base = clock.now;
    const pending = [...clock.queue.values()];
    clock.queue.clear();
    for (const callback of pending) callback(clock.now);
  });

  // CSS animations use a separate timeline. Pin both clocks to capture time
  // so a slow screenshot cannot skip animation frames.
  async function syncCSS() {
    await page.evaluate(time => {
      window.__tourAnimations ||= new WeakMap();
      for (const animation of document.getAnimations()) {
        if (!window.__tourAnimations.has(animation)) {
          window.__tourAnimations.set(animation, {start: time, offset: Number(animation.currentTime) || 0});
          animation.pause();
        }
        const {start, offset} = window.__tourAnimations.get(animation);
        animation.currentTime = offset + time - start;
      }
    }, elapsed);
  }
  async function capture(scene) {
    await syncCSS();
    const file = `frame-${String(frames.length).padStart(4, '0')}.png`;
    await page.screenshot({path: path.join(framesDir, file), caret: 'hide'});
    frames.push({file, scene, timeMs: elapsed});
    const next = frames.length * 1000 / fps;
    await page.clock.runFor(Math.round(next) - Math.round(elapsed));
    elapsed = next;
    await page.evaluate(time => {
      const clock = window.__tourRAF;
      clock.now = clock.base + time;
      const pending = [...clock.queue.values()];
      clock.queue.clear();
      for (const callback of pending) callback(clock.now);
    }, elapsed);
  }
  async function record(scene, seconds, update) {
    const count = Math.round(seconds * fps);
    scenes.push({name: scene, start: frames.length, count});
    for (let i = 0; i < count; i++) {
      if (update) await update(i / Math.max(1, count - 1));
      await capture(scene);
    }
    console.log(`Captured ${scene}: ${count} frames (${frames.length} total)`);
  }
  async function go(route, heading) {
    await page.evaluate(route => { location.hash = '#/' + route; }, route);
    await page.getByRole('heading', {name: heading, level: 1, exact: true}).waitFor();
    await page.mouse.move(1270, 875);
  }
  async function still(name) {
    await syncCSS();
    await page.screenshot({path: path.join(outputDir, name), caret: 'hide'});
  }

  await still('readme-poster.png');
  await record('atlas', 3);
  await go('brands', 'Brands, mills & makers.');
  await record('directory', .8);
  await record('directory-scroll', .9, async progress => {
    const ease = progress * progress * (3 - 2 * progress);
    await page.evaluate(y => scrollTo(0, y), 230 * ease);
  });
  await still('brand-directory-desktop.png');
  const input = page.getByRole('searchbox', {name: 'Search brands', exact: true});
  const query = 'Fox Brothers';
  for (let i = 1; i <= query.length; i++) {
    await input.fill(query.slice(0, i));
    await record('search', .1);
  }
  await record('search-results', .6);
  await page.locator('.brand-card h2 a').filter({hasText: 'Fox Brothers'}).click();
  await page.getByRole('heading', {name: 'Fox Brothers', level: 1, exact: true}).waitFor();
  await page.mouse.move(1270, 875);
  await still('brand-research-desktop.png');
  await record('research', 2);
  await go('weaves', 'Weaves & patterns.');
  await still('weaves-tour-desktop.png');
  await record('weave-guide', .8);
  await go('weaves?compare=herringbone,houndstooth', 'Weaves & patterns.');
  await page.locator('.pattern-compare-card').nth(1).waitFor();
  await page.locator('#pattern-comparison').scrollIntoViewIfNeeded();
  await still('weave-comparison-desktop.png');
  await record('weave-comparison', 1.2);
  await go('weaves/houndstooth', 'Houndstooth');
  await still('houndstooth-tour-desktop.png');
  await record('houndstooth-colors', 1.5);
  await page.getByLabel('Warp and weft contrast', {exact:true}).check();
  await page.mouse.move(1270,875);
  await record('houndstooth-structure', 1);
  // Keep a current still of the lab alongside the tour's new pattern scenes.
  await go('science', 'A closer look at the thread.');
  await still('science-tour-desktop.png');
  if (errors.length) throw Error(errors.join('\n'));
  await fs.writeFile(path.join(framesDir, 'frames.json'), JSON.stringify({
    width: 1024, height: 704, fps, frames, scenes
  }, null, 2));
  const encoded = spawnSync(python, ['scripts/encode-tour.py', path.join(framesDir, 'frames.json'), outputDir], {
    cwd: root, stdio: 'inherit'
  });
  if (encoded.status !== 0) throw Error('Tour encoding failed');
  console.log('60 fps tour, GIF fallback and still images captured from the current build.');
} finally {
  await browser?.close();
  server.kill();
}
