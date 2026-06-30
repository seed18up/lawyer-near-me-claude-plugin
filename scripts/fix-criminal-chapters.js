const fs = require('fs');

const CHAPTER_MAP = [
  { max: 17,    chapter: 1,  title: 'การใช้กฎหมายอาญา' },
  { max: 58,    chapter: 2,  title: 'โทษและวิธีการเพื่อความปลอดภัย' },
  { max: 106,   chapter: 3,  title: 'ความรับผิดในทางอาญา' },
  { max: 135,   chapter: 4,  title: 'ความผิดเกี่ยวกับความมั่นคงแห่งราชอาณาจักร' },
  { max: 166,   chapter: 5,  title: 'ความผิดเกี่ยวกับการปกครอง' },
  { max: 205,   chapter: 6,  title: 'ความผิดเกี่ยวกับการยุติธรรม' },
  { max: 208,   chapter: 7,  title: 'ความผิดเกี่ยวกับศาสนา' },
  { max: 216,   chapter: 8,  title: 'ความผิดเกี่ยวกับความสงบสุขของประชาชน' },
  { max: 239,   chapter: 9,  title: 'ความผิดเกี่ยวกับการก่อให้เกิดภยันตรายต่อประชาชน' },
  { max: 269,   chapter: 10, title: 'ความผิดเกี่ยวกับการปลอมและการแปลง' },
  { max: 269.99,chapter: 11, title: 'ความผิดเกี่ยวกับบัตรอิเล็กทรอนิกส์' }, // ม.269/1–269/x
  { max: 287,   chapter: 12, title: 'ความผิดเกี่ยวกับเพศ' },
  { max: 308,   chapter: 13, title: 'ความผิดเกี่ยวกับชีวิตและร่างกาย' },
  { max: 333,   chapter: 14, title: 'ความผิดเกี่ยวกับเสรีภาพและชื่อเสียง' },
  { max: 366.99,chapter: 15, title: 'ความผิดเกี่ยวกับทรัพย์' },
  { max: 999,   chapter: 16, title: 'ความผิดลหุโทษ' },
];

function toNum(section) {
  // "269/3" → 269.3, "135/2" → 135.2, "366/1" → 366.1
  return parseFloat(section.toString().replace('/', '.'));
}

function classify(section) {
  const n = toNum(section);
  for (const row of CHAPTER_MAP) {
    if (n <= row.max) return { chapter: row.chapter, chapter_title: row.title };
  }
  return { chapter: 16, chapter_title: 'ความผิดลหุโทษ' };
}

const file = 'law/criminal/criminal.json';
const cr = JSON.parse(fs.readFileSync(file, 'utf8'));

let changed = 0;
for (const s of cr.sections) {
  const { chapter, chapter_title } = classify(s.section);
  if (s.chapter !== chapter || s.chapter_title !== chapter_title) {
    s.chapter = chapter;
    s.chapter_title = chapter_title;
    changed++;
  }
}

fs.writeFileSync(file, JSON.stringify(cr, null, 2), 'utf8');
console.log(`แก้แล้ว ${changed}/${cr.sections.length} sections`);

// Summary
const summary = {};
cr.sections.forEach(s => {
  const k = `ch${s.chapter}: ${s.chapter_title}`;
  summary[k] = (summary[k] || 0) + 1;
});
Object.entries(summary).sort((a, b) => {
  const na = parseInt(a[0].match(/\d+/)[0]), nb = parseInt(b[0].match(/\d+/)[0]);
  return na - nb;
}).forEach(([k, v]) => console.log(`  ${k} → ${v} มาตรา`));
