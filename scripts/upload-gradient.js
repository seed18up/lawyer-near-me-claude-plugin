#!/usr/bin/env node
/**
 * Uploads a solid-black gradient overlay image to Cloudinary.
 * Run once: $env:CLOUDINARY_API_SECRET="xxx"; node scripts/upload-gradient.js
 */

const crypto = require('crypto');

const CLOUD  = 'de50nluyy';
const KEY    = '188554158979891';
const SECRET = process.env.CLOUDINARY_API_SECRET;

if (!SECRET) { console.error('Set CLOUDINARY_API_SECRET'); process.exit(1); }

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"><rect width="1" height="1" fill="black"/></svg>`;
const dataUrl = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;

function sign(params) {
  const str = Object.keys(params).sort().map(k => `${k}=${params[k]}`).join('&');
  return crypto.createHash('sha1').update(str + SECRET).digest('hex');
}

async function main() {
  const public_id = 'lawyernearme-gradient';
  const timestamp = Math.floor(Date.now() / 1000);
  const params    = { public_id, timestamp };
  const signature = sign(params);

  const body = new URLSearchParams({
    file: dataUrl, public_id,
    timestamp: String(timestamp), api_key: KEY, signature,
  });

  const res  = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });
  const data = await res.json();

  if (data.error) {
    console.error('Error:', data.error.message);
    process.exit(1);
  }

  console.log('✅ Uploaded:', data.public_id);
  console.log('\nTest URL (paste in browser):');
  console.log(`https://res.cloudinary.com/${CLOUD}/image/upload/w_1200,h_630,c_fill,g_auto,q_auto:good/l_lawyernearme-gradient/w_1200,h_320,c_fill/e_gradient_fade,y_0.5/fl_layer_apply,g_south,o_90/legal-bg-criminal-px1`);
}

main().catch(console.error);
