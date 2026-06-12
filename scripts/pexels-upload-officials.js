#!/usr/bin/env node
/**
 * Uploads Thai government official photos (police, rescue, court, labor inspection)
 * named legal-bg-{category}-gov{n} starting from gov1.
 *
 * Run:
 *   $env:CLOUDINARY_API_SECRET="xxx"; $env:PEXELS_API_KEY="xxx"; node scripts/pexels-upload-officials.js
 */

const crypto = require('crypto');

const CLOUD      = 'de50nluyy';
const CLD_KEY    = '188554158979891';
const CLD_SECRET = process.env.CLOUDINARY_API_SECRET;
const PEXELS_KEY = process.env.PEXELS_API_KEY;

if (!CLD_SECRET || !PEXELS_KEY) {
  console.error('Set both CLOUDINARY_API_SECRET and PEXELS_API_KEY'); process.exit(1);
}

const QUERIES = {
  criminal: [
    'thai police officer uniform',
    'thailand police arrest',
    'asian police investigation',
    'thailand court judge',
  ],
  labor: [
    'thailand labor inspection officer',
    'asian government official workplace',
    'thailand ministry labor',
    'southeast asia government worker inspection',
  ],
  property: [
    'thailand land department official',
    'asian government real estate document',
    'thailand property registration officer',
    'southeast asia land title deed official',
  ],
  family: [
    'thailand social worker family',
    'asian government social welfare officer',
    'thailand family court official',
    'southeast asia child protection officer',
  ],
  consumer: [
    'thailand consumer protection official',
    'asian food safety inspector',
    'thailand rescue emergency worker',
    'thailand ambulance rescue accident',
  ],
  contract: [
    'thailand government contract signing official',
    'asian government notary public',
    'thailand department business development officer',
    'southeast asia government legal document official',
  ],
};

async function searchPexels(query, page = 1) {
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=6&page=${page}&orientation=landscape&size=large`;
  const res  = await fetch(url, { headers: { Authorization: PEXELS_KEY } });
  if (!res.ok) { console.log(`  Pexels error ${res.status}`); return []; }
  const data = await res.json();
  return (data.photos || []).map(p => p.src.large2x || p.src.large || p.src.original);
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
    const seen = new Set();
    let n = 1;

    for (const query of queries) {
      if (n > 4) break;
      const urls = await searchPexels(query, 1);
      for (const url of urls) {
        if (n > 4) break;
        if (seen.has(url)) continue;
        seen.add(url);
        const publicId = `legal-bg-${cat}-gov${n}`;
        const ok = await upload(url, publicId);
        if (ok) n++;
        await new Promise(r => setTimeout(r, 700));
      }
      await new Promise(r => setTimeout(r, 400));
    }
  }
  console.log('\n✅ Done — รูปใหม่จะถูก dynamic pool ดึงอัตโนมัติในรอบถัดไป');
}

main().catch(console.error);
