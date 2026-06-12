#!/usr/bin/env node
/**
 * Uploads Shutterstock images from Downloads folder to Cloudinary.
 * Named legal-bg-{category}-ss{n} to distinguish from pexels (-t) and officials (-gov).
 *
 * Run:
 *   $env:CLOUDINARY_API_SECRET="xxx"; node scripts/shutterstock-upload.js
 */

const crypto = require('crypto');
const fs     = require('fs');
const path   = require('path');
const os     = require('os');

const CLOUD   = 'de50nluyy';
const CLD_KEY = '188554158979891';
const SECRET  = process.env.CLOUDINARY_API_SECRET;

if (!SECRET) { console.error('Set CLOUDINARY_API_SECRET'); process.exit(1); }

const DOWNLOADS = path.join(os.homedir(), 'Downloads');

// Map shutterstock filename → Cloudinary public_id
const UPLOADS = [
  { file: 'shutterstock_746249257.jpg',   id: 'legal-bg-criminal-ss1' },
  { file: 'shutterstock_2515840795_small.jpg', id: 'legal-bg-criminal-ss2' },
  { file: 'shutterstock_2559853195.jpg',  id: 'legal-bg-criminal-ss3' },
  { file: 'shutterstock_2618331059_small.jpg', id: 'legal-bg-criminal-ss4' },
  { file: 'shutterstock_2119835456.jpg',  id: 'legal-bg-criminal-ss5' },
  { file: 'shutterstock_1704962473.jpg',  id: 'legal-bg-consumer-ss1' },
  { file: 'shutterstock_2609089455_small.jpg', id: 'legal-bg-consumer-ss2' },
  { file: 'shutterstock_2540189217.jpg',  id: 'legal-bg-consumer-ss3' },
];

function sign(params) {
  const str = Object.keys(params).sort().map(k => `${k}=${params[k]}`).join('&');
  return crypto.createHash('sha1').update(str + SECRET).digest('hex');
}

async function upload(filePath, publicId) {
  const data = fs.readFileSync(filePath);
  const b64  = `data:image/jpeg;base64,${data.toString('base64')}`;

  const timestamp = Math.floor(Date.now() / 1000);
  const params    = { public_id: publicId, timestamp };
  const signature = sign(params);

  const body = new URLSearchParams({
    file: b64, public_id: publicId,
    timestamp: String(timestamp), api_key: CLD_KEY, signature,
  });

  console.log(`  Uploading ${publicId} (${(data.length / 1024 / 1024).toFixed(1)} MB)...`);
  const res  = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });
  const json = await res.json();
  if (json.error) { console.log(`  ❌ ${publicId}: ${json.error.message}`); return false; }
  console.log(`  ✅ ${publicId} — ${json.width}x${json.height}`);
  return true;
}

async function exists(publicId) {
  const res  = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/resources/image/upload/${publicId}`, {
    headers: { Authorization: 'Basic ' + Buffer.from(CLD_KEY + ':' + SECRET).toString('base64') }
  });
  return res.status === 200;
}

async function main() {
  console.log(`Reading from: ${DOWNLOADS}\n`);
  let ok = 0, skipped = 0;
  for (const { file, id } of UPLOADS) {
    const fp = path.join(DOWNLOADS, file);
    if (!fs.existsSync(fp)) { console.log(`  ⚠️  Not found: ${file}`); continue; }
    if (await exists(id)) { console.log(`  ⏭️  ${id} มีแล้ว ข้าม`); skipped++; continue; }
    const success = await upload(fp, id);
    if (success) ok++;
    await new Promise(r => setTimeout(r, 1000));
  }
  console.log(`\n✅ Done — upload ${ok} รูป, ข้าม ${skipped} รูป`);
  console.log('รูปใหม่จะถูก dynamic pool ดึงอัตโนมัติในรอบถัดไป');
}

main().catch(console.error);
