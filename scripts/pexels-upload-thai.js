#!/usr/bin/env node
/**
 * Uploads Thailand-specific photos for each legal category.
 * Naming: legal-bg-{category}-t{n} starting from t1.
 *
 * Run:
 *   $env:CLOUDINARY_API_SECRET="xxx"; $env:PEXELS_API_KEY="xxx"; node scripts/pexels-upload-thai.js
 */

const crypto = require('crypto');

const CLOUD      = 'de50nluyy';
const CLD_KEY    = '188554158979891';
const CLD_SECRET = process.env.CLOUDINARY_API_SECRET;
const PEXELS_KEY = process.env.PEXELS_API_KEY;

if (!CLD_SECRET || !PEXELS_KEY) {
  console.error('Set both CLOUDINARY_API_SECRET and PEXELS_API_KEY'); process.exit(1);
}

const TARGET = 8; // photos per category

const QUERIES = {
  criminal: [
    'thailand police officer',
    'thai police uniform',
    'thailand court justice',
    'thai lawyer court',
    'thailand police investigation',
    'bangkok police station',
    'thailand criminal court',
    'thai judge courthouse',
  ],
  labor: [
    'thailand factory worker',
    'thai worker construction',
    'thailand office worker',
    'bangkok business employee',
    'thailand labor worker',
    'thai people working',
    'thailand manufacturing worker',
    'bangkok office building people',
  ],
  property: [
    'thailand house property',
    'bangkok real estate',
    'thailand apartment building',
    'thai house purchase',
    'thailand land property',
    'bangkok condominium',
    'thailand home buyer',
    'thai real estate agent',
  ],
  family: [
    'thai family happy',
    'thailand family portrait',
    'thai parents children',
    'thailand family outdoor',
    'thai couple family',
    'thailand kids family park',
    'thai family lifestyle',
    'bangkok family home',
  ],
  consumer: [
    'thailand market shopping',
    'thai street food market',
    'bangkok chatuchak market',
    'thailand consumer shopping',
    'thai people market food',
    'thailand rescue ambulance',
    'thai emergency rescue',
    'bangkok traffic accident rescue',
  ],
  contract: [
    'thailand business meeting',
    'thai business people signing',
    'bangkok office business',
    'thailand entrepreneur contract',
    'thai business handshake',
    'thailand startup office',
    'bangkok corporate meeting',
    'thai professional business',
  ],
};

async function searchPexels(query, page = 1) {
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=5&page=${page}&orientation=landscape&size=large`;
  const res  = await fetch(url, { headers: { Authorization: PEXELS_KEY } });
  if (!res.ok) { console.log(`  Pexels error ${res.status}`); return []; }
  const data = await res.json();
  return (data.photos || []).map(p => ({ url: p.src.large2x || p.src.large, id: p.id }));
}

function sign(params) {
  const str = Object.keys(params).sort().map(k => `${k}=${params[k]}`).join('&');
  return crypto.createHash('sha1').update(str + CLD_SECRET).digest('hex');
}

async function upload(imageUrl, publicId) {
  const timestamp = Math.floor(Date.now() / 1000);
  const params    = { public_id: publicId, timestamp };
  const signature = sign(params);
  const body      = new URLSearchParams({
    file: imageUrl, public_id: publicId,
    timestamp: String(timestamp), api_key: CLD_KEY, signature,
  });
  const res  = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`, {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });
  const data = await res.json();
  if (data.error) { console.log(`  ❌ ${publicId}: ${data.error.message}`); return false; }
  console.log(`  ✅ ${publicId}`);
  return true;
}

async function main() {
  for (const [cat, queries] of Object.entries(QUERIES)) {
    console.log(`\n📂 ${cat}`);
    const seenIds = new Set();
    let n = 1;

    for (const query of queries) {
      if (n > TARGET) break;
      const photos = await searchPexels(query);
      for (const { url, id } of photos) {
        if (n > TARGET) break;
        if (seenIds.has(id)) continue;
        seenIds.add(id);
        const publicId = `legal-bg-${cat}-t${n}`;
        const ok = await upload(url, publicId);
        if (ok) n++;
        await new Promise(r => setTimeout(r, 600));
      }
      await new Promise(r => setTimeout(r, 300));
    }
    console.log(`  → ${n - 1} รูป upload สำเร็จ`);
  }
  console.log('\n✅ Done — รูปใหม่จะถูก dynamic pool ดึงอัตโนมัติในรอบถัดไป');
}

main().catch(console.error);
