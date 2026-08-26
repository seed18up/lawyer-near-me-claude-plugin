const fs = require('fs');
const https = require('https');

// ยิงทุกไฟล์ที่มี gap — script จะข้ามมาตราที่มี dika แล้วอัตโนมัติ
const TARGET_FILES = [
  'law/ppc/obligations/obligations.json',
  'law/administrative/administrative.json',
  'law/juvenile/juvenile.json',
  'law/ppc/agency/agency.json',
  'law/ppc/loans/loans.json',
  'law/ppc/property/property.json',
  'law/ppc/company/company.json',
  'law/constitution/constitution.json',
  'law/civil-procedure/civil-procedure.json',
  'law/criminal-procedure/criminal-procedure.json',
  'law/criminal/criminal.json',
  'law/bankruptcy/bankruptcy.json',
  'law/tax/tax.json',
  'law/ppc/inheritance/inheritance.json',
  'law/traffic/traffic.json',
  'law/consumer-protection/consumer-protection.json',
  'law/social-security/social-security.json',
  'law/maritime-transport/maritime-transport.json',
  'law/court-organization/court-organization.json',
  'law/labor/labor.json',
  'law/debt-collection/debt-collection.json',
  'law/computer-crime/computer-crime.json',
  'law/condo/condo.json',
  'law/workmen-compensation/workmen-compensation.json',
  'law/ppc/family/family.json',
  'law/pdpa/pdpa.json',
];

const LAW_NAMES = {
  'obligations.json':      'นิติกรรม หนี้',
  'administrative.json':   'วิธีปฏิบัติราชการทางปกครอง',
  'juvenile.json':         'เยาวชนและครอบครัว',
  'agency.json':           'ตัวแทน นายหน้า',
  'loans.json':            'กู้ยืม ค้ำประกัน',
  'property.json':         'ทรัพย์สิน',
  'company.json':          'บริษัท ห้างหุ้นส่วน',
  'constitution.json':     'รัฐธรรมนูญ',
  'civil-procedure.json':  'วิธีพิจารณาความแพ่ง',
  'criminal-procedure.json': 'วิธีพิจารณาความอาญา',
  'criminal.json':         'อาญา',
  'bankruptcy.json':       'ล้มละลาย',
  'tax.json':              'ภาษีอากร',
  'inheritance.json':      'มรดก',
  'traffic.json':          'จราจร',
  'consumer-protection.json': 'คุ้มครองผู้บริโภค',
  'social-security.json':  'ประกันสังคม',
  'maritime-transport.json': 'ขนส่งทางทะเล',
  'court-organization.json': 'พระธรรมนูญศาลยุติธรรม',
  'labor.json':            'คุ้มครองแรงงาน',
  'debt-collection.json':  'ทวงถามหนี้',
  'computer-crime.json':   'คอมพิวเตอร์',
  'condo.json':            'อาคารชุด',
  'workmen-compensation.json': 'เงินทดแทน',
  'family.json':           'ครอบครัว',
  'pdpa.json':             'ข้อมูลส่วนบุคคล PDPA',
};

const LOG_FILE = 'fetch-dika-round7.log';
const logStream = fs.createWriteStream(LOG_FILE, { flags: 'a' });
function log(msg) { process.stdout.write(msg); logStream.write(msg); }
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
  log('=== fetch-dika-round7 เริ่ม ' + new Date().toISOString() + ' ===\n');
  let totalUpdated = 0, totalDika = 0;

  for (const file of TARGET_FILES) {
    let data;
    try { data = JSON.parse(fs.readFileSync(file, 'utf8')); }
    catch (e) { log('ERROR: ' + file + '\n'); continue; }
    if (!data.sections) continue;

    const fname = file.split('/').pop();
    const lawShort = LAW_NAMES[fname] || '';
    const empty = data.sections.filter(s => !s.dika || s.dika.length === 0);
    if (empty.length === 0) { log('\n--- ' + file + ' ครบแล้ว ---\n'); continue; }
    log('\n--- ' + file + ' (' + empty.length + ' remaining) ---\n');

    let fileChanged = false;
    for (const s of data.sections) {
      if (s.dika && s.dika.length > 0) continue;

      const thaiKw = (s.keywords || []).filter(k => !/[a-zA-Z]/.test(k)).slice(0, 4);
      const titleClean = (s.title || '').replace(/—/g, ' ').replace(/[^฀-๿\s]/g, '').trim().substring(0, 35);

      const queries = [
        lawShort + ' มาตรา ' + s.section,
        titleClean,
        thaiKw.slice(0, 3).join(' '),
        'ฎีกา ' + lawShort + ' มาตรา ' + s.section,
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

main().catch(e => { log('FATAL: ' + e.message + '\n'); logStream.end(); process.exit(1); });
