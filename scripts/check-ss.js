#!/usr/bin/env node
const CLOUD  = 'de50nluyy';
const KEY    = '188554158979891';
const SECRET = process.env.CLOUDINARY_API_SECRET;
if (!SECRET) { console.error('Set CLOUDINARY_API_SECRET'); process.exit(1); }

(async () => {
  const res  = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/resources/image?prefix=legal-bg-&type=upload&max_results=100`, {
    headers: { Authorization: 'Basic ' + Buffer.from(KEY + ':' + SECRET).toString('base64') }
  });
  const data = await res.json();
  const ss   = (data.resources || []).filter(r => r.public_id.includes('-ss'));
  if (ss.length === 0) console.log('ไม่พบรูป -ss เลย → ยังไม่ได้รัน upload');
  else { console.log(`พบ ${ss.length} รูป:`); ss.forEach(r => console.log(' ', r.public_id)); }
})();
