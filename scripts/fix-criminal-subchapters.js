const fs = require('fs');
const cr = JSON.parse(fs.readFileSync('law/criminal/criminal.json', 'utf8'));

function toNum(section) {
  return parseFloat(section.toString().replace('/', '.'));
}

// ── Fix ch4 boundary: 135/1-135/4 belong to ch4 (ความมั่นคง), not ch5 ──
const CHAPTER_MAP = [
  { min: 0,     max: 17.99,  chapter: 1  },
  { min: 18,    max: 58.99,  chapter: 2  },
  { min: 59,    max: 106.99, chapter: 3  },
  { min: 107,   max: 135.99, chapter: 4  }, // includes 135/1-135/4
  { min: 136,   max: 166.99, chapter: 5  },
  { min: 167,   max: 205.99, chapter: 6  },
  { min: 206,   max: 208.99, chapter: 7  },
  { min: 209,   max: 216.99, chapter: 8  },
  { min: 217,   max: 239.99, chapter: 9  },
  { min: 240,   max: 269,    chapter: 10 }, // exactly 269 (not 269/x)
  { min: 269.01,max: 269.99, chapter: 11 }, // 269/1-269/15
  { min: 270,   max: 287.99, chapter: 12 },
  { min: 288,   max: 308.99, chapter: 13 },
  { min: 309,   max: 333.99, chapter: 14 },
  { min: 334,   max: 366.99, chapter: 15 },
  { min: 367,   max: 999,    chapter: 16 },
];

const CHAPTER_TITLES = {
  1:  'การใช้กฎหมายอาญา',
  2:  'โทษและวิธีการเพื่อความปลอดภัย',
  3:  'ความรับผิดในทางอาญา',
  4:  'ความผิดเกี่ยวกับความมั่นคงแห่งราชอาณาจักร',
  5:  'ความผิดเกี่ยวกับการปกครอง',
  6:  'ความผิดเกี่ยวกับการยุติธรรม',
  7:  'ความผิดเกี่ยวกับศาสนา',
  8:  'ความผิดเกี่ยวกับความสงบสุขของประชาชน',
  9:  'ความผิดเกี่ยวกับการก่อให้เกิดภยันตรายต่อประชาชน',
  10: 'ความผิดเกี่ยวกับการปลอมและการแปลง',
  11: 'ความผิดเกี่ยวกับบัตรอิเล็กทรอนิกส์',
  12: 'ความผิดเกี่ยวกับเพศ',
  13: 'ความผิดเกี่ยวกับชีวิตและร่างกาย',
  14: 'ความผิดเกี่ยวกับเสรีภาพและชื่อเสียง',
  15: 'ความผิดเกี่ยวกับทรัพย์',
  16: 'ความผิดลหุโทษ',
};

// ── Subchapter definitions per chapter ──
// Format: [maxSectionNum, subchapter_num, subchapter_title]
const SUBCHAPTER_MAP = {
  1: [],  // ไม่มีหมวด
  2: [
    [36.99, 1, 'โทษ'],
    [50.99, 2, 'วิธีการเพื่อความปลอดภัย'],
    [58.99, 3, 'วิธีเพิ่มโทษ ลดโทษ และรอการลงโทษ'],
  ],
  3: [
    [79.99, 1, 'บทบัญญัติทั่วไป'],
    [82.99, 2, 'การพยายามกระทำความผิด'],
    [89.99, 3, 'ตัวการและผู้สนับสนุน'],
    [106.99,4, 'อายุความ'],
  ],
  4: [
    [112.99, 1, 'ความผิดต่อองค์พระมหากษัตริย์ รัชทายาท และผู้สำเร็จราชการแทนพระองค์'],
    [118.99, 2, 'ความผิดต่อความมั่นคงของรัฐภายนอกราชอาณาจักร'],
    [127.99, 3, 'ความผิดต่อความมั่นคงของรัฐภายในราชอาณาจักร'],
    [135,    4, 'ความผิดต่อสัมพันธไมตรีกับต่างประเทศ'],  // ม.128-135 (integer)
    [135.99, 5, 'ความผิดเกี่ยวกับการก่อการร้าย'],         // ม.135/1-135/4
  ],
  5: [
    [146.99, 1, 'ความผิดต่อเจ้าพนักงาน'],
    [166.99, 2, 'ความผิดต่อตำแหน่งหน้าที่ราชการ'],
  ],
  6: [
    [199.99, 1, 'ความผิดต่อเจ้าพนักงานในการยุติธรรม'],
    [205.99, 2, 'ความผิดต่อหน้าที่ในทางยุติธรรม'],
  ],
  7:  [],  // ไม่มีหมวด (3 มาตรา)
  8:  [],  // ไม่มีหมวด (8 มาตรา)
  9:  [],  // ไม่มีหมวด
  10: [
    [249.99, 1, 'ความผิดเกี่ยวกับเงินตรา'],
    [263.99, 2, 'ความผิดเกี่ยวกับดวงตรา แสตมป์ และตั๋ว'],
    [269,    3, 'ความผิดเกี่ยวกับเอกสาร'],
  ],
  11: [],  // ไม่มีหมวด (บัตรอิเล็กทรอนิกส์)
  12: [],  // ไม่มีหมวด (เพศ)
  13: [
    [299.99, 1, 'ความผิดต่อชีวิต'],
    [308.99, 2, 'ความผิดต่อร่างกาย'],
  ],
  14: [
    [321.99, 1, 'ความผิดต่อเสรีภาพ'],
    [325.99, 2, 'ความผิดฐานเปิดเผยความลับ'],
    [333.99, 3, 'ความผิดฐานหมิ่นประมาท'],
  ],
  15: [
    [336.99, 1, 'ความผิดฐานลักทรัพย์และวิ่งราวทรัพย์'],
    [340.99, 2, 'ความผิดฐานกรรโชก ชิงทรัพย์ และปล้นทรัพย์'],
    [348.99, 3, 'ความผิดฐานฉ้อโกง'],
    [351.99, 4, 'ความผิดฐานโกงเจ้าหนี้'],
    [356.99, 5, 'ความผิดฐานยักยอก'],
    [360.99, 6, 'ความผิดฐานรับของโจร'],
    [361.99, 7, 'ความผิดฐานทำให้เสียทรัพย์'],
    [366.99, 8, 'ความผิดฐานบุกรุก'],
  ],
  16: [],  // ลหุโทษ ไม่มีหมวด
};

// ── Remap chapter + assign subchapter ──
let chFixed = 0, subAssigned = 0;
for (const s of cr.sections) {
  const n = toNum(s.section);

  // Fix chapter
  for (const row of CHAPTER_MAP) {
    if (n >= row.min && n <= row.max) {
      if (s.chapter !== row.chapter) { s.chapter = row.chapter; chFixed++; }
      s.chapter_title = CHAPTER_TITLES[row.chapter];
      break;
    }
  }

  // Assign subchapter
  const subs = SUBCHAPTER_MAP[s.chapter] || [];
  if (subs.length === 0) {
    s.subchapter = 0;
    s.subchapter_title = '';
  } else {
    for (const [max, sub, title] of subs) {
      if (n <= max) {
        s.subchapter = sub;
        s.subchapter_title = title;
        subAssigned++;
        break;
      }
    }
  }
}

// ── Rebuild chapters array with subchapters field ──
cr.chapters.forEach(c => {
  const subs = SUBCHAPTER_MAP[c.num] || [];
  c.subchapters = subs.map(([, sub, title]) => ({ num: sub, title }));
});

fs.writeFileSync('law/criminal/criminal.json', JSON.stringify(cr, null, 2), 'utf8');
console.log(`✓ chapter fixed: ${chFixed}, subchapter assigned: ${subAssigned}`);
console.log('\nVerify ch4 + ch5:');
['4','5'].forEach(ch=>{
  const secs=cr.sections.filter(s=>s.chapter===parseInt(ch));
  const byS={};
  secs.forEach(s=>{ const k=s.subchapter+'|'+s.subchapter_title; byS[k]=(byS[k]||[]); byS[k].push(s.section); });
  console.log(`\nch${ch} (${secs.length} มาตรา):`);
  Object.entries(byS).forEach(([k,v])=>console.log(' ',k,'→',v.join(',')));
});
