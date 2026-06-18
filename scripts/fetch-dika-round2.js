const fs = require('fs');
const https = require('https');

function walk(dir) {
  const files = [];
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    if (f.isDirectory() && f.name !== 'node_modules') files.push(...walk(dir + '/' + f.name));
    else if (f.name.endsWith('.json') && dir.includes('law/')) files.push(dir + '/' + f.name);
  }
  return files;
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
      if (res.status !== 200) { await sleep(500); continue; }
      const matches = res.body.match(/deka\/[0-9]+-[0-9]+/g);
      if (!matches || matches.length === 0) { await sleep(300); continue; }
      const unique = [...new Set(matches)].slice(0, max);
      const results = [];
      for (const m of unique) {
        const [_, year, num] = m.match(/deka\/(\d+)-(\d+)/);
        await sleep(400);
        try {
          const detail = await fetch('https://deka.in.th/' + m);
          if (detail.status !== 200) continue;
          const descMatch = detail.body.match(/name="description" content="([^"]{0,200})/);
          const desc = descMatch ? descMatch[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&') : '';
          results.push({ num: num + '/' + year, summary: desc });
        } catch (e) { continue; }
      }
      if (results.length > 0) return results;
    } catch (e) {}
    await sleep(300);
  }
  return [];
}

const LAW_NAMES = {
  'administrative.json': 'วิธีปฏิบัติราชการทางปกครอง',
  'bankruptcy.json': 'ล้มละลาย',
  'civil-procedure.json': 'วิธีพิจารณาความแพ่ง',
  'constitution.json': 'รัฐธรรมนูญ',
  'consumer-protection.json': 'คุ้มครองผู้บริโภค',
  'court-organization.json': 'พระธรรมนูญศาลยุติธรรม',
  'computer-crime.json': 'คอมพิวเตอร์',
  'criminal-procedure.json': 'วิธีพิจารณาความอาญา',
  'criminal.json': 'อาญา',
  'debt-collection.json': 'ทวงถามหนี้',
  'intellectual-property.json': 'ทรัพย์สินทางปัญญา',
  'juvenile.json': 'เยาวชน',
  'labor.json': 'คุ้มครองแรงงาน',
  'narcotics.json': 'ยาเสพติด',
  'pdpa.json': 'ข้อมูลส่วนบุคคล',
  'family.json': 'ครอบครัว',
  'inheritance.json': 'มรดก',
  'loans.json': 'กู้ยืม',
  'obligations.json': 'นิติกรรม หนี้',
  'property.json': 'ทรัพย์สิน',
  'sales.json': 'ซื้อขาย',
  'tax.json': 'ภาษี',
  'traffic.json': 'จราจร',
};

async function main() {
  const files = walk('law');
  let totalUpdated = 0, totalDika = 0;

  for (const file of files) {
    let data;
    try { data = JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { continue; }
    if (!data.sections) continue;
    const fname = file.split('/').pop();
    const lawShort = LAW_NAMES[fname] || '';

    let changed = false;
    for (const s of data.sections) {
      if (s.dika && s.dika.length > 0) continue;

      const thaiKw = (s.keywords || []).filter(k => !/[a-zA-Z]/.test(k)).slice(0, 3);
      const titleClean = s.title.replace(/—/g, ' ').replace(/[^฀-๿\s]/g, '').trim().substring(0, 30);

      const queries = [
        lawShort + ' มาตรา ' + s.section,
        titleClean,
        thaiKw.join(' '),
        lawShort + ' ' + thaiKw.slice(0, 2).join(' '),
        'ฎีกา ' + lawShort + ' ' + thaiKw[0],
      ].filter(q => q && q.trim().length > 3);

      process.stdout.write(fname + ' ม.' + s.section + ' ... ');

      const results = await searchDika(queries, 2);
      if (results.length > 0) {
        s.dika = results.map(r => r.num);
        s.dika_details = results;
        changed = true;
        totalDika += results.length;
        totalUpdated++;
        console.log('✓ ' + results.length + ' (' + results.map(r => r.num).join(', ') + ')');
      } else {
        console.log('—');
      }

      await sleep(400);
    }

    if (changed) {
      fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
      console.log('  SAVED ' + file);
    }
  }

  console.log('\n=== DONE ===');
  console.log('Updated:', totalUpdated, '| Dika found:', totalDika);
}

main().catch(e => console.error('FATAL:', e));
