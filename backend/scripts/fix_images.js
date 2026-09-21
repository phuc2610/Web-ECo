import mongoose from 'mongoose';
import https from 'https';

const checkUrl = (url) => new Promise((resolve) => {
  if (!url || typeof url !== 'string' || !url.startsWith('http')) return resolve(false);
  try {
    const req = https.get(url, (res) => {
      resolve(res.statusCode >= 200 && res.statusCode < 400);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(4000, () => { req.destroy(); resolve(false); });
  } catch {
    resolve(false);
  }
});

async function main() {
  await mongoose.connect('mongodb+srv://Phuc26104:2785YaFdsluel5sI@cluster0.qdkccgc.mongodb.net/np_computer');
  console.log('Connected to DB');
  const db = mongoose.connection.db;
  const prods = await db.collection('products').find({}).toArray();

  for (const p of prods) {
    const mainImg = Array.isArray(p.image) ? p.image[0] : p.image;
    const ok = await checkUrl(mainImg);
    if (!ok) {
      console.log('Broken image for:', p.name, '->', mainImg);
      let fallback = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800';
      if (p.category === 'Điện thoại') fallback = 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=800';
      else if (p.category === 'Laptop') fallback = 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800';
      else if (p.category === 'Máy tính bảng') fallback = 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=800';
      else if (p.category === 'PC') fallback = 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=800';
      else if (p.name.includes('Sạc') || p.name.includes('Cáp') || p.category.includes('Phụ kiện')) fallback = 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&q=80&w=800';
      
      const newImages = Array.isArray(p.image) && p.image.length > 0 ? [fallback, ...p.image.slice(1)] : [fallback];
      await db.collection('products').updateOne({ _id: p._id }, { $set: { image: newImages, images: newImages } });
      console.log('Fixed product:', p.name);
    }
  }
  console.log('Done fixing broken product images!');
  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });
