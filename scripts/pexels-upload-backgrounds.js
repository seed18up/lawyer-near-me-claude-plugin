#!/usr/bin/env node
/**
 * Searches Pexels for Thai/Asian people photos per category,
 * uploads them to Cloudinary, and prints the updated BG_POOLS.
 *
 * Run:
 *   CLOUDINARY_API_SECRET=xxx PEXELS_API_KEY=xxx node scripts/pexels-upload-backgrounds.js
 */

const crypto = require('crypto');

const CLOUD        = 'de50nluyy';
const CLD_KEY      = '188554158979891';
const CLD_SECRET   = process.env.CLOUDINARY_API_SECRET;
const PEXELS_KEY   = process.env.PEXELS_API_KEY;

if (!CLD_SECRET || !PEXELS_KEY) {
  console.error('Set both CLOUDINARY_API_SECRET and PEXELS_API_KEY');
  process.exit(1);
}

// Queries biased toward Thai / Southeast Asian people
const QUERIES = {
  criminal: [
    'thailand court lawyer judge',
    'thai police officer',
    'thailand law legal people',
  ],
  labor: [
    'thailand construction workers',
    'thai factory workers asian',
    'thailand labor worker',
  ],
  property: [
    'thailand family house',
    'thai family home',
    'thailand real estate people',
  ],
  family: [
    'thai family parents children',
    'thailand family happy',
    'asian family thailand',
  ],
  consumer: [
    'thailand market people shopping',
    'thai people shopping mall',
    'bangkok market crowd',
  ],
  contract: [
    'thailand business meeting people',
    'thai businessman office',
    'asian business people signing',
  ],
};

async function searchPexels(query, perPage = 6) {
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=landscape&size=large`;
  const res  = await fetch(url, { headers: { Authorization: PEXELS_KEY } });
  if (!res.ok) { console.log(`  Pexels error ${res.status} for "${query}"`); return []; }
  const data = await res.json();
  return (data.photos || []).map(p => p.src.large2x || p.src.large || p.src.original);
}

function sign(params) {
  const str = Object.keys(params).sort().map(k => `${k}=${params[k]}`).join('&');
  return crypto.createHash('sha1').update(str + CLD_SECRET).digest('hex');
}

async function uploadToCloudinary(imageUrl, publicId) {
  const timestamp = Math.floor(Date.now() / 1000);
  const params    = { public_id: publicId, timestamp };
  const signature = sign(params);
  const body      = new URLSearchParams({
    file: imageUrl, public_id: publicId,
    timestamp: String(timestamp), api_key: CLD_KEY, signature,
  });
  const res  = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });
  const data = await res.json();
  if (data.error) { console.log(`  ❌ ${publicId}: ${data.error.message}`); return false; }
  console.log(`  ✅ ${publicId}`);
  return true;
}

async function main() {
  const newIds = {}; // cat → [publicId, ...]

  for (const [cat, queries] of Object.entries(QUERIES)) {
    console.log(`\n📂 ${cat}`);
    newIds[cat] = [];
    const seen = new Set();
    let n = 1;

    for (const query of queries) {
      if (n > 4) break; // max 4 new Pexels images per category
      const urls = await searchPexels(query, 6);
      for (const url of urls) {
        if (n > 4) break;
        if (seen.has(url)) continue;
        seen.add(url);
        const publicId = `legal-bg-${cat}-px${n}`;
        const ok = await uploadToCloudinary(url, publicId);
        if (ok) { newIds[cat].push(publicId); n++; }
        await new Promise(r => setTimeout(r, 700));
      }
      await new Promise(r => setTimeout(r, 500));
    }
  }

  // Merge with existing object/scene pool
  const EXISTING = {
    criminal: ['legal-bg-criminal', 'legal-bg-criminal-2', 'legal-bg-criminal-3', 'legal-bg-criminal-4'],
    labor:    ['legal-bg-labor', 'legal-bg-labor-2', 'legal-bg-labor-3', 'legal-bg-labor-4', 'legal-bg-labor-5'],
    property: ['legal-bg-property', 'legal-bg-property-2', 'legal-bg-property-3', 'legal-bg-property-4'],
    family:   ['legal-bg-family', 'legal-bg-family-2', 'legal-bg-family-3', 'legal-bg-family-4'],
    consumer: ['legal-bg-consumer', 'legal-bg-consumer-2', 'legal-bg-consumer-3', 'legal-bg-consumer-4', 'legal-bg-consumer-5'],
    contract: ['legal-bg-contract', 'legal-bg-contract-2', 'legal-bg-contract-3', 'legal-bg-contract-4'],
  };

  console.log('\n\n── Paste this into generate-news.js (replaces BG_POOLS) ──\n');
  const lines = Object.keys(EXISTING).map(cat => {
    const all = [...EXISTING[cat], ...(newIds[cat] || [])];
    return `  ${cat}: ${JSON.stringify(all)},`;
  }).join('\n');
  console.log(`const BG_POOLS = {\n${lines}\n};`);
  console.log('\nReview: https://console.cloudinary.com/pm/c-de50nluyy/media-library');
}

main().catch(console.error);
