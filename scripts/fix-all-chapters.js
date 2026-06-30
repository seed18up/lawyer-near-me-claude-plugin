const fs = require('fs');

function toNum(s) { return parseFloat(s.toString().replace('/', '.')); }

function parseRange(range) {
  // Returns {lo, hi, exact} — exact=true means hi already covers sub-sections, don't add 0.99
  if (!range) return null;
  const parts = range.split('–').map(x => x.trim());
  const loStr = parts[0], hiStr = parts[1] || parts[0];
  const loBase = loStr.includes('/') ? parseInt(loStr.split('/')[0]) : null;
  const hiBase = hiStr.includes('/') ? parseInt(hiStr.split('/')[0]) : null;
  // Both bounds are sub-sections of the same base: cover all sub-sections of that base
  if (loBase !== null && hiBase !== null && loBase === hiBase) {
    return { lo: loBase + 0.001, hi: loBase + 0.999, exact: true };
  }
  return { lo: toNum(loStr), hi: toNum(hiStr), exact: false };
}

function fixFile(filePath) {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const chapters = data.chapters || [];
  if (!chapters.length) { console.log('  no chapters — skip'); return; }

  // Build range map from chapters array
  const rangeMap = [];
  for (const c of chapters) {
    const r = parseRange(c.range);
    if (r) rangeMap.push({ num: c.num, lo: r.lo, hi: r.exact ? r.hi : r.hi + 0.99 });
  }
  rangeMap.sort((a, b) => a.lo - b.lo);
  // Cap each hi to not overlap the next chapter's lo
  for (let i = 0; i < rangeMap.length - 1; i++) {
    if (rangeMap[i].hi >= rangeMap[i+1].lo) {
      rangeMap[i].hi = rangeMap[i+1].lo - 0.0001;
    }
  }

  let fixed = 0, unmatched = 0;
  for (const s of data.sections) {
    const n = toNum(s.section);
    let found = null;
    for (const r of rangeMap) {
      if (n >= r.lo && n <= r.hi) { found = r; break; }
    }
    if (found) {
      if (s.chapter !== found.num) {
        s.chapter = found.num;
        const ch = chapters.find(c => c.num === found.num);
        if (ch) s.chapter_title = ch.title;
        fixed++;
      }
    } else {
      // Falls outside all chapter ranges — assign to nearest chapter
      let best = rangeMap[0], bestDist = Infinity;
      for (const r of rangeMap) {
        const dist = Math.min(Math.abs(n - r.lo), Math.abs(n - r.hi));
        if (dist < bestDist) { bestDist = dist; best = r; }
      }
      if (s.chapter !== best.num) {
        s.chapter = best.num;
        const ch = chapters.find(c => c.num === best.num);
        if (ch) s.chapter_title = ch.title;
        fixed++;
      }
      unmatched++;
    }
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  return { fixed, unmatched, total: data.sections.length };
}

const targets = [
  'law/civil-procedure/civil-procedure.json',
  'law/criminal-procedure/criminal-procedure.json',
  'law/ppc/obligations/obligations.json',
  'law/ppc/sales/sales.json',
  'law/ppc/loans/loans.json',
  'law/ppc/family/family.json',
  'law/ppc/inheritance/inheritance.json',
  'law/ppc/property/property.json',
  'law/labor/labor.json',
  'law/narcotics/narcotics.json',
  'law/bankruptcy/bankruptcy.json',
];

for (const f of targets) {
  const name = f.split('/').slice(-2).join('/');
  const r = fixFile(f);
  console.log(`${name}: fixed ${r.fixed}/${r.total} ม.${r.unmatched ? ' ('+r.unmatched+' ม. นอก range — ใช้ nearest)' : ''}`);
}
