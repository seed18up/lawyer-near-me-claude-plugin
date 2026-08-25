const fs = require('fs');
const https = require('https');

// เป้าหมาย: family → land → trademark (ตามลำดับ)
const TARGET_FILES = [
  'law/ppc/family/family.json',
  'law/land/land.json',
  'law/trademark/trademark.json',
];

const LAW_NAMES = {
  'family.json':    'ครอบครัว',
  'land.json':      'ที่ดิน',
  'trademark.json': 'เครื่องหมายการค้า',
};

const LOG_FILE = 'fetch-dika-round3.log';
const logStream = fs.createWriteStream(LOG_FILE, { flags: 'a' });

function log(msg) {
  process.stdout.write(msg);
  logStream.write(msg);
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function fetch(url) {
  return new Promise((resolve) => {
    const req = https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      timeout: 15000
    }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', () => resolve({ status: 0, body: '' }));
    req.on('timeout', () => { req.destroy(); resolve({ status: 0, body: '' }); });
  });
}

async function searchDika(queries, max) {
  for (const q of queries) {
    const url = 'https://deka.in.th/search?q=' + encodeURIComponent(q);
    try {
      const res = await fetch(url);
      if (res.status !== 200) { await sleep(600); continue; }
      const matches = res.body.match(/deka\/[0-9]+-[0-9]+/g);
      if (!matches || matches.length === 0) { await sleep(300); continue; }
      const unique = [...new Set(matches)].slice(0, max);
      const results = [];
      for (const m of unique) {
        const parts = m.match(/deka\/(\d+)-(\d+)/);
        if (!parts) continue;
        const [_, year, num] = parts;
        await sleep(400);
        try {
          const detail = await fetch('https://deka.in.th/' + m);
          if (detail.status !== 200) continue;
          const descMatch = detail.body.match(/name="description" content="([^"]{0,250})/);
          const desc = descMatch
            ? descMatch[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&#39;/g, "'").trim()
            : '';
          if (desc.length > 10) results.push({ num: num + '/' + year, summary: desc });
        } catch (e) { continue; }
      }
      if (results.length > 0) return results;
    } catch (e) {}
    await sleep(300);
  }
  return [];
}

async function main() {
  log('=== fetch-dika-round3 เริ่ม ' + new Date().toISOString() + ' ===\n');
  let totalUpdated = 0, totalDika = 0;

  for (const file of TARGET_FILES) {
    let data;
    try { data = JSON.parse(fs.readFileSync(file, 'utf8')); }
    catch (e) { log('ERROR: อ่านไฟล์ไม่ได้ ' + file + '\n'); continue; }
    if (!data.sections) continue;

    const fname = file.split('/').pop();
    const lawShort = LAW_NAMES[fname] || '';
    const empty = data.sections.filter(s => !s.dika || s.dika.length === 0);
    log('\n--- ' + file + ' (' + empty.length + '/' + data.sections.length + ' sections ที่ยังว่าง) ---\n');

    let fileChanged = false;
    for (const s of data.sections) {
      if (s.dika && s.dika.length > 0) continue;

      const thaiKw = (s.keywords || []).filter(k => !/[a-zA-Z]/.test(k)).slice(0, 3);
      const titleClean = (s.title || '').replace(/—/g, ' ').replace(/[^฀-๿\s]/g, '').trim().substring(0, 30);

      const queries = [
        lawShort + ' มาตรา ' + s.section,
        'ป.พ.พ. มาตรา ' + s.section,   // สำหรับ family (ppc)
        titleClean,
        thaiKw.join(' '),
        lawShort + ' ' + thaiKw.slice(0, 2).join(' '),
      ].filter(q => q && q.trim().length > 3);

      log(fname + ' ม.' + s.section + ' ... ');

      const results = await searchDika(queries, 2);
      if (results.length > 0) {
        s.dika = results.map(r => r.num);
        s.dika_details = results;
        fileChanged = true;
        totalDika += results.length;
        totalUpdated++;
        log('✓ ' + results.length + ' (' + results.map(r => r.num).join(', ') + ')\n');
      } else {
        log('—\n');
      }

      await sleep(400);
    }

    if (fileChanged) {
      fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
      log('  SAVED ' + file + '\n');
    }
  }

  log('\n=== DONE ' + new Date().toISOString() + ' ===\n');
  log('Updated: ' + totalUpdated + ' | Dika found: ' + totalDika + '\n');
  logStream.end();
}

main().catch(e => {
  log('FATAL: ' + e.message + '\n');
  logStream.end();
  process.exit(1);
});
