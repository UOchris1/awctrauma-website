import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Accept filename as argument, default to vte_chart
const inputFile = process.argv[2] || 'vte_chart.html';
const baseName = inputFile.replace('.html', '');
const htmlPath = resolve(__dirname, inputFile);
const outPath = resolve(__dirname, `${baseName}_render.png`);

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 2400, deviceScaleFactor: 2 });
await page.goto(`file:///${htmlPath.replace(/\\/g, '/')}`, { waitUntil: 'networkidle0' });

await page.evaluate(() => document.fonts.ready);
await new Promise(r => setTimeout(r, 500));

const bodyHeight = await page.evaluate(() => document.getElementById('chart').scrollHeight);
await page.setViewport({ width: 1200, height: bodyHeight + 40, deviceScaleFactor: 2 });
await new Promise(r => setTimeout(r, 300));

await page.screenshot({ path: outPath, fullPage: true, type: 'png' });
console.log(`Saved: ${outPath}`);
await browser.close();
