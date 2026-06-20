const fs = require('fs');
const path = require('path');

const catMap = {
  'administrative': ['ปกครอง', '🏛️'],
  'bankruptcy': ['ล้มละลาย', '💰'],
  'cheque': ['เช็ค', '💸'],
  'civil-procedure': ['วิ.แพ่ง', '📑'],
  'computer-crime': ['คอมพิวเตอร์', '💻'],
  'condo': ['อาคารชุด', '🏢'],
  'constitution': ['รัฐธรรมนูญ', '📜'],
  'consumer-protection': ['ผู้บริโภค', '🛡️'],
  'court-organization': ['พระธรรมนูญศาล', '🏛️'],
  'criminal-procedure': ['วิ.อาญา', '⚖️'],
  'criminal': ['อาญา', '⚖️'],
  'debt-collection': ['ทวงถามหนี้', '📞'],
  'intellectual-property': ['ทรัพย์สินทางปัญญา', '💡'],
  'juvenile': ['เยาวชน', '👦'],
  'labor-relations': ['แรงงานสัมพันธ์', '✊'],
  'labor': ['แรงงาน', '👷'],
  'narcotics': ['ยาเสพติด', '🚫'],
  'pdpa': ['PDPA', '🔐'],
  'social-security': ['ประกันสังคม', '🏥'],
  'tax': ['ภาษี', '🧾'],
  'traffic': ['จราจร', '🚗'],
  'family': ['ครอบครัว', '👨‍👩‍👧'],
  'inheritance': ['มรดก', '📋'],
  'loans': ['กู้ยืม', '💳'],
  'obligations': ['นิติกรรม/หนี้', '📜'],
  'property': ['ทรัพย์สิน', '🏠'],
  'sales': ['ซื้อขาย', '🛒'],
};

const all = [];

function scan(dir) {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, f.name);
    if (f.isDirectory()) { scan(p); continue; }
    if (!f.name.endsWith('.json')) continue;
    const d = JSON.parse(fs.readFileSync(p, 'utf8'));
    const rel = p.replace(/\\/g, '/');
    const parts = rel.split('/');
    const cat = parts.length > 3 ? parts[2] : parts[1];
    const cm = catMap[cat] || [cat, '⚖️'];
    for (const s of d.sections || []) {
      for (const dk of s.dika || []) {
        if (typeof dk !== 'string') continue;
        const m = dk.match(/^(\d+)\/(\d+)$/);
        if (!m) continue;
        const num = m[1], yr = m[2];
        all.push({
          id: 'dika-' + num + '-' + yr,
          num: dk,
          year: yr,
          category: cat,
          category_label: cm[0],
          category_emoji: cm[1],
          law: (d.meta && d.meta.law) || '',
          section: s.section,
          section_title: s.title || '',
          summary: s.summary || '',
          deka_url: 'https://deka.in.th/deka/' + yr + '-' + num
        });
      }
    }
  }
}

scan('law');

const unique = new Map();
all.forEach(x => { if (!unique.has(x.id)) unique.set(x.id, x); });

const arr = [...unique.values()].sort((a, b) =>
  Number(b.year) - Number(a.year) || Number(b.num.split('/')[0]) - Number(a.num.split('/')[0])
);

const out = { total: arr.length, dika: arr };
fs.writeFileSync('dika/dika.json', JSON.stringify(out, null, 2), 'utf8');
console.log('Total unique dika:', arr.length);
