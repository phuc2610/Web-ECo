import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe';
const outDir = path.resolve('generated_diagrams');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function captureAll() {
  console.log('Launching local Chrome at:', chromePath);
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1.5 });

  // 1. Homepage
  console.log('Capturing 1. Homepage (http://localhost:5173/)...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({
    path: path.join(outDir, 'hinh_5_1_giao_dien_trang_chu.jpg'),
    type: 'jpeg',
    quality: 90
  });
  console.log('Saved hinh_5_1_giao_dien_trang_chu.jpg');

  // 2. Product Detail
  console.log('Capturing 2. Product Detail (http://localhost:5173/product/6a9a7dac0532f9993124b082)...');
  await page.goto('http://localhost:5173/product/6a9a7dac0532f9993124b082', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({
    path: path.join(outDir, 'hinh_5_2_giao_dien_san_pham.jpg'),
    type: 'jpeg',
    quality: 90
  });
  console.log('Saved hinh_5_2_giao_dien_san_pham.jpg');

  // 3. VietQR Payment Gateway
  console.log('Capturing 3. VietQR Payment (http://localhost:5173/payment/6a9a9fda7b65c0848cd0c8ad)...');
  await page.goto('http://localhost:5173/payment/6a9a9fda7b65c0848cd0c8ad', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2500));
  await page.screenshot({
    path: path.join(outDir, 'hinh_5_3_thanh_toan_vietqr.jpg'),
    type: 'jpeg',
    quality: 90
  });
  console.log('Saved hinh_5_3_thanh_toan_vietqr.jpg');

  // 4. Collection page
  console.log('Capturing 4. Collection Page (http://localhost:5173/collection)...');
  await page.goto('http://localhost:5173/collection', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({
    path: path.join(outDir, 'hinh_5_5_giao_dien_danh_muc.jpg'),
    type: 'jpeg',
    quality: 90
  });
  console.log('Saved hinh_5_5_giao_dien_danh_muc.jpg');

  // 5. Admin Dashboard
  console.log('Capturing 5. Admin Portal (http://localhost:5174/)...');
  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1000));

  // Check if login form is present
  const emailInput = await page.$('input[type="email"]');
  if (emailInput) {
    console.log('Logging in to Admin...');
    await page.type('input[type="email"]', 'admin@np.com');
    await page.type('input[type="password"]', '123456');
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 }).catch(() => {});
    await new Promise(r => setTimeout(r, 2000));
  }

  await page.screenshot({
    path: path.join(outDir, 'hinh_5_4_admin_dashboard.jpg'),
    type: 'jpeg',
    quality: 90
  });
  console.log('Saved hinh_5_4_admin_dashboard.jpg');

  // 6. Admin Add Product
  console.log('Capturing 6. Admin Add Product (http://localhost:5174/add)...');
  await page.goto('http://localhost:5174/add', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({
    path: path.join(outDir, 'hinh_5_6_admin_them_san_pham.jpg'),
    type: 'jpeg',
    quality: 90
  });
  console.log('Saved hinh_5_6_admin_them_san_pham.jpg');

  await browser.close();
  console.log('\n=== ALL REAL SCREENSHOTS CAPTURED SUCCESSFULLY! ===');
}

captureAll().catch(console.error);
