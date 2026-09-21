import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe';
const outDir = path.resolve('generated_diagrams');

async function captureHomeRecommendations() {
  console.log('Launching Chrome to capture Homepage with recommendations...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1200, deviceScaleFactor: 1.5 });

  console.log('Navigating to Homepage (http://localhost:5173/)...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  await page.evaluate(() => {
    window.scrollTo(0, 850);
  });
  await new Promise(r => setTimeout(r, 1500));

  const dest = path.join(outDir, 'hinh_home_recommendations.jpg');
  await page.screenshot({
    path: dest,
    type: 'jpeg',
    quality: 90
  });
  console.log('Saved real screenshot:', dest);

  await browser.close();
  console.log('DONE!');
}

captureHomeRecommendations().catch(console.error);
