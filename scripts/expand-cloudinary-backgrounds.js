#!/usr/bin/env node
/**
 * Expands Cloudinary background pool: 3-4 images per category.
 * All candidates are object/scene shots — no identifiable people —
 * so the Western-face problem cannot appear.
 *
 * Run: CLOUDINARY_API_SECRET=xxx node scripts/expand-cloudinary-backgrounds.js
 * After: review at https://console.cloudinary.com/pm/c-de50nluyy/media-library
 */

const crypto = require('crypto');
const CLOUD  = 'de50nluyy';
const KEY    = '188554158979891';
const SECRET = process.env.CLOUDINARY_API_SECRET;

if (!SECRET) {
  console.error('CLOUDINARY_API_SECRET not set'); process.exit(1);
}

// public_id suffix -2,-3,-4 … (original -1 already uploaded as "legal-bg-CATEGORY")
// All URLs: object/scene/architecture only — zero identifiable people.
const CANDIDATES = {
  criminal: [
    // gavel on dark wood
    'https://images.unsplash.com/photo-1589578527966-fdac0f44566c?w=1200&h=630&fit=crop&q=80',
    // scales of justice statue close-up
    'https://images.unsplash.com/photo-1589578228447-e1a4e481c6c8?w=1200&h=630&fit=crop&q=80',
    // law books stack
    'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=1200&h=630&fit=crop&q=80',
    // handcuffs on table
    'https://images.unsplash.com/photo-1589829083958-84e5c95aab4f?w=1200&h=630&fit=crop&q=80',
  ],
  labor: [
    // yellow hard hat on steel beam
    'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&h=630&fit=crop&q=80',
    // construction crane against blue sky
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&h=630&fit=crop&q=80',
    // industrial tools laid out
    'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=1200&h=630&fit=crop&q=80',
    // factory machinery (no people)
    'https://images.unsplash.com/photo-1565043666747-69f6646db940?w=1200&h=630&fit=crop&q=80',
  ],
  property: [
    // suburban house exterior
    'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1200&h=630&fit=crop&q=80',
    // modern apartment block
    'https://images.unsplash.com/photo-1570129477492-1f17d3f82f33?w=1200&h=630&fit=crop&q=80',
    // Bangkok-style condo tower
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=630&fit=crop&q=80',
    // house keys on wooden table
    'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=1200&h=630&fit=crop&q=80',
  ],
  family: [
    // child's shoes (no face, warm feeling)
    'https://images.unsplash.com/photo-1540479859555-17af45c78602?w=1200&h=630&fit=crop&q=80',
    // family home cozy living room
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&h=630&fit=crop&q=80',
    // heart shape on sunset sky — family warmth
    'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=1200&h=630&fit=crop&q=80',
  ],
  consumer: [
    // colourful market produce — Asian market feel
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=630&fit=crop&q=80',
    // shopping bags only (no face)
    'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=630&fit=crop&q=80',
    // smartphone with cart icon (online shopping)
    'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&h=630&fit=crop&q=80',
    // cashless payment — card on terminal
    'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=630&fit=crop&q=80',
  ],
  contract: [
    // pen resting on contract paper
    'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=630&fit=crop&q=80',
    // official rubber stamp on document
    'https://images.unsplash.com/photo-1542621334-a254cf47733d?w=1200&h=630&fit=crop&q=80',
    // open law book + reading glasses
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1200&h=630&fit=crop&q=80',
  ],
};

function sign(params) {
  const str = Object.keys(params).sort().map(k => `${k}=${params[k]}`).join('&');
  return crypto.createHash('sha1').update(str + SECRET).digest('hex');
}

async function checkUrl(url) {
  try {
    const r = await fetch(url, { method: 'HEAD' });
    return r.ok;
  } catch { return false; }
}

async function upload(imageUrl, publicId) {
  const timestamp = Math.floor(Date.now() / 1000);
  const params    = { public_id: publicId, timestamp };
  const sig       = sign(params);
  const body      = new URLSearchParams({
    file: imageUrl, public_id: publicId,
    timestamp: String(timestamp), api_key: KEY, signature: sig,
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
  const pools = {};

  for (const [cat, urls] of Object.entries(CANDIDATES)) {
    console.log(`\n📂 ${cat}`);
    pools[cat] = [`legal-bg-${cat}`]; // original already on Cloudinary
    let idx = 2;

    for (const url of urls) {
      const ok = await checkUrl(url);
      if (!ok) { console.log(`  ⚠ unreachable, skip`); continue; }

      const publicId = `legal-bg-${cat}-${idx}`;
      if (await upload(url, publicId)) { pools[cat].push(publicId); idx++; }
      await new Promise(r => setTimeout(r, 800));
    }
  }

  console.log('\n\n── Paste this into generate-news.js ──\n');
  const lines = Object.entries(pools)
    .map(([k, v]) => `  ${k}: ${JSON.stringify(v)},`).join('\n');
  console.log(`const BG_POOLS = {\n${lines}\n};`);
  console.log('\nCheck uploads: https://console.cloudinary.com/pm/c-de50nluyy/media-library');
}

main().catch(console.error);
