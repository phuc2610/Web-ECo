import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe';
const outDir = path.resolve('generated_diagrams');

async function captureInsights() {
  console.log('Launching Chrome to capture Admin Customer Insights...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1.5 });

  console.log('Navigating to Admin Portal (http://localhost:5174/)...');
  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1000));

  // Check login
  const emailInput = await page.$('input[type="email"]');
  if (emailInput) {
    console.log('Logging in with admin credentials...');
    await page.type('input[type="email"]', 'admin@np.com');
    await page.type('input[type="password"]', '123456');
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 }).catch(() => {});
    await new Promise(r => setTimeout(r, 2000));
  }

  console.log('Navigating to Customer Insights page (http://localhost:5174/customer-insights)...');
  await page.goto('http://localhost:5174/customer-insights', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2500));

  const dest = path.join(outDir, 'hinh_admin_customer_insights.jpg');
  await page.screenshot({
    path: dest,
    type: 'jpeg',
    quality: 90,
    fullPage: true
  });
  console.log('Saved real screenshot:', dest);

  await browser.close();
  console.log('DONE!');
}

captureInsights().catch(console.error);
