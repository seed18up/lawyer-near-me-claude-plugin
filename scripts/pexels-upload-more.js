#!/usr/bin/env node
/**
 * Adds 4 more Thai/Asian people photos per category (px5–px8)
 * so the pool becomes roughly 2/3 people, 1/3 scene.
 *
 * Run:
 *   CLOUDINARY_API_SECRET=xxx PEXELS_API_KEY=xxx node scripts/pexels-upload-more.js
 */

const crypto = require('crypto');

const CLOUD      = 'de50nluyy';
const CLD_KEY    = '188554158979891';
const CLD_SECRET = process.env.CLOUDINARY_API_SECRET;
const PEXELS_KEY = process.env.PEXELS_API_KEY;

if (!CLD_SECRET || !PEXELS_KEY) {
  console.error('Set both CLOUDINARY_API_SECRET and PEXELS_API_KEY'); process.exit(1);
}

// New queries — different keywords from the first batch to get fresh results
const QUERIES = {
  criminal: [
    'asian lawyer courtroom',
    'thai judge court',
    'southeast asia police officer',
    'thailand legal justice people',
  ],
  labor: [
    'asian workers office building',
    'thailand employee working',
    'thai people working construction',
    'southeast asia worker factory',
  ],
  property: [
    'asian couple buying house',
    'thai people new home',
    'southeast asia family property',
    'thailand apartment people',
  ],
  family: [
    'asian family smiling outdoor',
    'thai parents children happy',
    'southeast asia kids family',
    'thailand family portrait',
  ],
  consumer: [
    'thai people street food market',
    'asian woman shopping',
    'thailand chatuchak market crowd',
    'southeast asia market shoppers',
  ],
  contract: [
    'asian business people handshake',
    'thai office workers meeting',
    'southeast asia businessmen signing',
    'thailand office professional',
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
  const added = {};

  for (const [cat, queries] of Object.entries(QUERIES)) {
    console.log(`\n📂 ${cat}`);
    added[cat] = [];
    const seen = new Set();
    let n = 5; // start from px5

    for (const query of queries) {
      if (n > 8) break;
      const urls = await searchPexels(query, 2); // page 2 → fresh results
      for (const url of urls) {
        if (n > 8) break;
        if (seen.has(url)) continue;
        seen.add(url);
        const publicId = `legal-bg-${cat}-px${n}`;
        const ok = await upload(url, publicId);
        if (ok) { added[cat].push(publicId); n++; }
        await new Promise(r => setTimeout(r, 700));
      }
      await new Promise(r => setTimeout(r, 400));
    }
  }

  // Print updated BG_POOLS with 2/3 people ratio
  const SCENE = {
    criminal: ['legal-bg-criminal','legal-bg-criminal-2','legal-bg-criminal-3','legal-bg-criminal-4'],
    labor:    ['legal-bg-labor','legal-bg-labor-2','legal-bg-labor-3','legal-bg-labor-4','legal-bg-labor-5'],
    property: ['legal-bg-property','legal-bg-property-2','legal-bg-property-3','legal-bg-property-4'],
    family:   ['legal-bg-family','legal-bg-family-2','legal-bg-family-3','legal-bg-family-4'],
    consumer: ['legal-bg-consumer','legal-bg-consumer-2','legal-bg-consumer-3','legal-bg-consumer-4','legal-bg-consumer-5'],
    contract: ['legal-bg-contract','legal-bg-contract-2','legal-bg-contract-3','legal-bg-contract-4'],
  };
  const PEOPLE_BASE = {
    criminal: ['legal-bg-criminal-px1','legal-bg-criminal-px2','legal-bg-criminal-px3','legal-bg-criminal-px4'],
    labor:    ['legal-bg-labor-px1','legal-bg-labor-px2','legal-bg-labor-px3','legal-bg-labor-px4'],
    property: ['legal-bg-property-px1','legal-bg-property-px2','legal-bg-property-px3','legal-bg-property-px4'],
    family:   ['legal-bg-family-px1','legal-bg-family-px2','legal-bg-family-px3','legal-bg-family-px4'],
    consumer: ['legal-bg-consumer-px1','legal-bg-consumer-px2','legal-bg-consumer-px3','legal-bg-consumer-px4'],
    contract: ['legal-bg-contract-px1','legal-bg-contract-px2','legal-bg-contract-px3','legal-bg-contract-px4'],
  };

  console.log('\n\n── Paste this into generate-news.js (replaces BG_POOLS) ──\n');
  const lines = Object.keys(SCENE).map(cat => {
    const all = [...SCENE[cat], ...PEOPLE_BASE[cat], ...(added[cat] || [])];
    const pCount = PEOPLE_BASE[cat].length + (added[cat] || []).length;
    const total  = all.length;
    console.log(`  ${cat}: ${total} total, ${pCount} people (${Math.round(pCount/total*100)}%)`);
    return `  ${cat}: ${JSON.stringify(all)},`;
  }).join('\n');
  console.log(`\nconst BG_POOLS = {\n${lines}\n};`);
}

main().catch(console.error);
