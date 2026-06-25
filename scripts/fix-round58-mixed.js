const fs = require('fs');

// === ป.อ. round 37 ===
const crFile = 'law/criminal/criminal.json';
const cr = JSON.parse(fs.readFileSync(crFile, 'utf8'));
const crNew = [
  { id:'crim-115', section:'115', chapter:10, chapter_title:'ความผิดเกี่ยวกับความมั่นคง', title:'คบคิดกับรัฐต่างประเทศเพื่อทำสงคราม — ประหาร/ตลอดชีวิต', text:'ผู้ใดคบคิดกับรัฐบาลต่างประเทศ เพื่อก่อให้เกิดการรุกรานหรือให้กระทำการเป็นปฏิปักษ์ต่อราชอาณาจักร → ประหาร/ตลอดชีวิต หรือจำคุก 3-20 ปี', summary:'คบคิดต่างชาติ: ร่วมมือรัฐบาลต่างประเทศเพื่อรุกรานไทย→ประหาร/ตลอดชีวิต/3-20ปี', keywords:['คบคิด','รัฐต่างประเทศ','รุกราน','ประหาร'], dika:[] },
  { id:'crim-117', section:'117', chapter:10, chapter_title:'ความผิดเกี่ยวกับความมั่นคง', title:'สนับสนุนกบฏ — ช่วยเหลือผู้กบฏ → จำคุก 2-15 ปี', text:'ผู้ใดสมคบกับผู้กระทำความผิดตามมาตรา 113 → จำคุก 2-15 ปี\nเตรียมการเพื่อกระทำกบฏ → จำคุก 1-10 ปี', summary:'สนับสนุนกบฏ: สมคบ→2-15ปี เตรียมการ→1-10ปี ≠ กบฏจริง(ม.113=ประหาร/ตลอดชีวิต)', keywords:['สนับสนุนกบฏ','สมคบ','เตรียมการ'], dika:[] },
  { id:'crim-212', section:'212', chapter:15, chapter_title:'ความผิดเกี่ยวกับความสงบสุข', title:'หัวหน้าอั้งยี่ — โทษหนักกว่าสมาชิก', text:'ถ้าผู้กระทำความผิดตามมาตรา 209 เป็นหัวหน้า ผู้จัดการ → จำคุก ≤ 10 ปี + ปรับ ≤ 200,000', summary:'หัวหน้าอั้งยี่: โทษหนักกว่าสมาชิก(ม.209=≤7ปี) หัวหน้า=≤10ปี', keywords:['หัวหน้าอั้งยี่','ผู้จัดการ','10 ปี'], dika:[] },
  { id:'crim-216', section:'216', chapter:15, chapter_title:'ความผิดเกี่ยวกับความสงบสุข', title:'ไม่เลิกมั่วสุม — สั่งแล้วไม่เลิก → จำคุก ≤ 3 ปี', text:'ถ้าผู้มั่วสุมตามมาตรา 215 ไม่เลิกเมื่อเจ้าพนักงานสั่งให้เลิก → จำคุก ≤ 3 ปี + ปรับ ≤ 60,000', summary:'ไม่เลิกมั่วสุม: เจ้าพนักงานสั่งเลิกแล้วไม่เลิก→≤3ปี หนักกว่ามั่วสุมธรรมดา(ม.215=≤6เดือน)', keywords:['ไม่เลิกมั่วสุม','สั่งเลิก','3 ปี'], dika:[] },
  { id:'crim-366-4', section:'366/4', chapter:23, chapter_title:'ความผิดเกี่ยวกับศพ', title:'ลักศพ/อวัยวะจากศพ — จำคุก 3 เดือน - 2 ปี', text:'ผู้ใดลักศพหรือส่วนของศพ หรือลักเครื่องแต่งกาย เครื่องประดับ หรือสิ่งอื่นใดจากศพ → จำคุก 3 เดือน - 2 ปี + ปรับ 5,000-40,000', summary:'ลักศพ: ลักศพ/อวัยวะ/เครื่องประดับจากศพ→3เดือน-2ปี ≠ ลักทรัพย์ธรรมดา(ม.334)', keywords:['ลักศพ','อวัยวะ','เครื่องประดับ'], dika:[] },
];

const crExisting = new Set(cr.sections.map(x => x.section));
let crAdded = 0;
for (const x of crNew) { if (!crExisting.has(x.section)) { cr.sections.push(x); crAdded++; } }
fs.writeFileSync(crFile, JSON.stringify(cr, null, 2), 'utf8');
console.log('Criminal: +' + crAdded + ' = ' + cr.sections.length);

// === วิ.แพ่ง + วิ.อาญา + ป.พ.พ. ===
const cvpFile = 'law/civil-procedure/civil-procedure.json';
const cvp = JSON.parse(fs.readFileSync(cvpFile, 'utf8'));
const cvpNew = [
  { id:'cvp-6', section:'6', chapter:1, chapter_title:'เขตอำนาจศาล', title:'คดีที่เกี่ยวกับสิทธิเรียกร้องหรือทรัพย์สิน — ฟ้องที่ศาลที่ทรัพย์ตั้งอยู่', text:'คดีที่เกี่ยวกับสิทธิเรียกร้องของโจทก์อันเกิดในเขตศาลใด → โจทก์จะเสนอคดีต่อศาลนั้นก็ได้', summary:'คดีสิทธิเรียกร้อง: ฟ้องที่ศาลที่สิทธิเกิดก็ได้ นอกจาก ม.2(ภูมิลำเนาจำเลย) หรือ ม.3(อสังหาฯ)', keywords:['สิทธิเรียกร้อง','เขตศาล','เกิดในเขต'], dika:[] },
  { id:'cvp-96', section:'96', chapter:5, chapter_title:'พยานหลักฐาน', title:'ศาลเป็นผู้ซักถามพยาน — ควบคุมวิธีซักถาม', text:'ศาลเป็นผู้ควบคุมวิธีซักถามพยาน จะอนุญาตหรือไม่อนุญาตให้ถามคำถามใดก็ได้', summary:'ศาลควบคุมการถาม: ศาลอนุญาต/ไม่อนุญาตคำถามได้ ห้ามถามชี้นำ/ถามนอกประเด็น/ถามข่มขู่', keywords:['ศาลควบคุม','ซักถาม','อนุญาต'], dika:[] },
];

const cvpExisting = new Set(cvp.sections.map(x => x.section));
let cvpAdded = 0;
for (const x of cvpNew) { if (!cvpExisting.has(x.section)) { cvp.sections.push(x); cvpAdded++; } }
fs.writeFileSync(cvpFile, JSON.stringify(cvp, null, 2), 'utf8');
console.log('Civil Procedure: +' + cvpAdded + ' = ' + cvp.sections.length);

const crpFile = 'law/criminal-procedure/criminal-procedure.json';
const crp = JSON.parse(fs.readFileSync(crpFile, 'utf8'));
const crpNew = [
  { id:'crp-100', section:'100', chapter:7, chapter_title:'ค้น', title:'ค้นตัวผู้ถูกจับ — ค้นตัวและยึดสิ่งของได้ทันที', text:'เมื่อจับผู้ใดแล้ว → ผู้จับมีอำนาจค้นตัวผู้ถูกจับ และยึดสิ่งของที่อาจเป็นพยานหลักฐาน หรือที่อาจเป็นอันตรายได้', summary:'ค้นตัวผู้ถูกจับ: จับแล้ว→ค้นตัวได้ทันที ยึดอาวุธ/ของกลาง ≠ ค้นบ้าน(ม.93=ต้องมีหมาย)', keywords:['ค้นตัว','ผู้ถูกจับ','ยึดสิ่งของ'], dika:[] },
  { id:'crp-170-crp', section:'170/1', chapter:12, chapter_title:'การฟ้องคดีอาญา', title:'ศาลไม่ประทับรับฟ้อง — คดีไม่มีมูล ยกฟ้อง', text:'ถ้าศาลไต่สวนมูลฟ้องแล้วเห็นว่าคดีไม่มีมูล → ศาลสั่งไม่ประทับรับฟ้อง ยกฟ้อง\nถ้าเห็นว่ามีมูล → ประทับรับฟ้อง แล้วดำเนินกระบวนพิจารณาต่อไป', summary:'ไม่ประทับรับฟ้อง: ไต่สวนแล้วไม่มีมูล→ยกฟ้อง มีมูล→รับฟ้อง โจทก์อุทธรณ์ได้ถ้าไม่รับ', keywords:['ไม่ประทับรับฟ้อง','ไม่มีมูล','ยกฟ้อง'], dika:[] },
];

const crpExisting = new Set(crp.sections.map(x => x.section));
let crpAdded = 0;
for (const x of crpNew) { if (!crpExisting.has(x.section)) { crp.sections.push(x); crpAdded++; } }
fs.writeFileSync(crpFile, JSON.stringify(crp, null, 2), 'utf8');
console.log('Criminal Procedure: +' + crpAdded + ' = ' + crp.sections.length);

console.log('\nTotal added: ' + (crAdded + cvpAdded + crpAdded));
