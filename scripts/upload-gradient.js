#!/usr/bin/env node
/**
 * Uploads a solid-black PNG overlay to Cloudinary (used for gradient bar).
 * Run once: $env:CLOUDINARY_API_SECRET="xxx"; node scripts/upload-gradient.js
 */

const crypto = require('crypto');
const zlib   = require('zlib');

const CLOUD  = 'de50nluyy';
const KEY    = '188554158979891';
const SECRET = process.env.CLOUDINARY_API_SECRET;

if (!SECRET) { console.error('Set CLOUDINARY_API_SECRET'); process.exit(1); }

// ── Build a valid RGBA PNG from scratch (no external deps) ──
const CRC_TABLE = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
  CRC_TABLE[n] = c;
}
function crc32(buf) {
  let c = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}
function chunk(type, data) {
  const t = Buffer.from(type, 'ascii');
  const l = Buffer.allocUnsafe(4); l.writeUInt32BE(data.length, 0);
  const r = Buffer.allocUnsafe(4); r.writeUInt32BE(crc32(Buffer.concat([t, data])), 0);
  return Buffer.concat([l, t, data, r]);
}
function blackPNG(w, h) {
  const ihdr = Buffer.allocUnsafe(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  const row = 1 + w * 4;
  const raw = Buffer.alloc(h * row, 0);
  for (let y = 0; y < h; y++) {
    raw[y * row] = 0; // filter: None
    for (let x = 0; x < w; x++) raw[y * row + 1 + x * 4 + 3] = 255; // alpha=255
  }
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

function sign(params) {
  const str = Object.keys(params).sort().map(k => `${k}=${params[k]}`).join('&');
  return crypto.createHash('sha1').update(str + SECRET).digest('hex');
}

async function main() {
  const png       = blackPNG(10, 10);
  const dataUrl   = `data:image/png;base64,${png.toString('base64')}`;
  const public_id = 'lawyernearme-gradient';
  const timestamp = Math.floor(Date.now() / 1000);
  const params    = { overwrite: 'true', public_id, timestamp };
  const signature = sign(params);

  const body = new URLSearchParams({
    file: dataUrl, public_id,
    overwrite: 'true',
    timestamp: String(timestamp), api_key: KEY, signature,
  });

  const res  = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });
  const data = await res.json();

  if (data.error) { console.error('Error:', data.error.message); process.exit(1); }

  console.log('✅ Uploaded PNG:', data.public_id, `(${data.width}x${data.height})`);
  console.log('\nTest URL (paste in browser):');
  console.log(`https://res.cloudinary.com/${CLOUD}/image/upload/w_1200,h_630,c_fill,g_auto,q_auto:good/e_brightness:-15/l_lawyernearme-gradient/w_1200,h_320,c_fill/e_gradient_fade,y_0.5/fl_layer_apply,g_south,o_92/sample`);
}

main().catch(console.error);
