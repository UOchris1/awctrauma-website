import puppeteer from 'puppeteer';

const htmlPath = process.argv[2];
const outPath = process.argv[3];

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 2400, deviceScaleFactor: 2 });
await page.goto(`file:///${htmlPath.replace(/\\/g, '/')}`, { waitUntil: 'networkidle0' });
await page.evaluate(() => document.fonts.ready);
await new Promise(r => setTimeout(r, 600));

const el = await page.$('.sheet');
await el.screenshot({ path: outPath, type: 'png' });
console.log(`Saved: ${outPath}`);
await browser.close();
