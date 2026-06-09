#!/usr/bin/env node
/**
 * One-time setup: uploads 6 category background images to Cloudinary.
 * Run with: CLOUDINARY_API_SECRET=xxx node scripts/setup-cloudinary.js
 */

const crypto = require('crypto');

const CLOUD_NAME  = 'de50nluyy';
const API_KEY     = '188554158979891';
const API_SECRET  = process.env.CLOUDINARY_API_SECRET;

if (!API_SECRET) {
  console.error('ERROR: Set CLOUDINARY_API_SECRET environment variable.');
  console.error('Usage: CLOUDINARY_API_SECRET=xxx node scripts/setup-cloudinary.js');
  process.exit(1);
}

const BACKGROUNDS = [
  {
    id:  'legal-bg-criminal',
    url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&h=630&fit=crop&q=80',
  },
  {
    id:  'legal-bg-labor',
    url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&h=630&fit=crop&q=80',
  },
  {
    id:  'legal-bg-property',
    url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=630&fit=crop&q=80',
  },
  {
    id:  'legal-bg-family',
    url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&h=630&fit=crop&q=80',
  },
  {
    id:  'legal-bg-consumer',
    url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=630&fit=crop&q=80',
  },
  {
    id:  'legal-bg-contract',
    url: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&h=630&fit=crop&q=80',
  },
];

function sign(params) {
  const str = Object.keys(params).sort().map(k => `${k}=${params[k]}`).join('&');
  return crypto.createHash('sha1').update(str + API_SECRET).digest('hex');
}

async function upload(item) {
  const timestamp = Math.floor(Date.now() / 1000);
  const params    = { public_id: item.id, timestamp };
  const signature = sign(params);

  const body = new URLSearchParams({
    file:       item.url,
    public_id:  item.id,
    timestamp:  String(timestamp),
    api_key:    API_KEY,
    signature,
  });

  const res  = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body:    body.toString(),
  });
  const data = await res.json();

  if (data.error) {
    console.log(`❌ ${item.id}: ${data.error.message}`);
  } else {
    console.log(`✅ ${item.id} → ${data.secure_url}`);
  }
}

async function main() {
  console.log('Uploading 6 background images to Cloudinary...\n');
  for (const item of BACKGROUNDS) {
    await upload(item);
    await new Promise(r => setTimeout(r, 800));
  }
  console.log('\nDone! Background images ready for text overlay.');
}

main().catch(console.error);
