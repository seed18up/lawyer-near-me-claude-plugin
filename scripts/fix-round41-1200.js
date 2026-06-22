const fs = require('fs');

// === ป.อ. round 23 ===
const crFile = 'law/criminal/criminal.json';
const cr = JSON.parse(fs.readFileSync(crFile, 'utf8'));
const crNew = [
  { id:'crim-133', section:'133', chapter:11, chapter_title:'ความผิดเกี่ยวกับความมั่นคง', title:'ดูหมิ่นธงชาติ/เครื่องหมายไทย — จำคุก ≤ 2 ปี', text:'ผู้ใดทำให้เสื่อมเสียธงชาติ หรือเครื่องหมายอื่นใดอันมีความหมายถึงรัฐ → จำคุก ≤ 2 ปี + ปรับ ≤ 40,000', summary:'ดูหมิ่นธงชาติ: ทำเสื่อมเสียธงไทย/ตราแผ่นดิน→≤2ปี ≠ ม.132(ธงต่างประเทศ)', keywords:['ธงชาติ','ดูหมิ่น','เครื่องหมายรัฐ'], dika:[] },
  { id:'crim-134', section:'134', chapter:11, chapter_title:'ความผิดเกี่ยวกับความมั่นคง', title:'ดูหมิ่นเอกอัครราชทูต/กงสุล — จำคุก ≤ 2 ปี', text:'ผู้ใดกระทำการดูหมิ่นต่อผู้แทนรัฐบาลต่างประเทศซึ่งได้รับแต่งตั้งให้มาปฏิบัติงานในราชอาณาจักร → จำคุก ≤ 2 ปี + ปรับ ≤ 40,000', summary:'ดูหมิ่นทูต: ดูหมิ่นเอกอัครราชทูต/กงสุลต่างประเทศ→≤2ปี คุ้มครองสัมพันธไมตรี', keywords:['เอกอัครราชทูต','กงสุล','ดูหมิ่น'], dika:[] },
  { id:'crim-369', section:'369', chapter:24, chapter_title:'ลหุโทษ', title:'ทำให้เสียของ — ราคาไม่เกิน 1,000 บาท ลหุโทษ', text:'ผู้ใดทำให้เสียหาย ทำลาย ทำให้ไร้ประโยชน์ ซึ่งทรัพย์ของผู้อื่น ถ้าราคาทรัพย์ไม่เกินหนึ่งพันบาท → ปรับ ≤ 10,000', summary:'ทำเสียของเล็กน้อย: ราคา≤1,000บาท→ปรับ≤10,000 ลหุโทษ ≠ ม.358(ราคาเกิน=≤3ปี)', keywords:['ทำเสียของ','ราคาไม่เกิน','1,000 บาท','ลหุโทษ'], dika:[] },
  { id:'crim-373', section:'373', chapter:24, chapter_title:'ลหุโทษ', title:'ปล่อยสัตว์ให้เที่ยวไป — ปรับ ≤ 500', text:'ผู้ใดปล่อยสัตว์ให้เที่ยวไปในทางสาธารณะ หรือในที่สาธารณสถาน โดยไม่มีคนคุม → ปรับ ≤ 500', summary:'ปล่อยสัตว์เที่ยว: ปล่อยสัตว์ไม่มีคนคุมในที่สาธารณะ→ปรับ≤500 เช่น ปล่อยวัวเดินบนถนน', keywords:['ปล่อยสัตว์','ไม่มีคนคุม','ที่สาธารณะ'], dika:[] },
  { id:'crim-392', section:'392', chapter:24, chapter_title:'ลหุโทษ', title:'ลักทรัพย์เล็กน้อย — ราคาไม่เกิน 1,000 บาท ปรับ ≤ 10,000', text:'ผู้ใดลักทรัพย์ราคาไม่เกินหนึ่งพันบาท → ปรับ ≤ 10,000\nเป็นลหุโทษ', summary:'ลักทรัพย์เล็กน้อย: ราคา≤1,000→ปรับ≤10,000 ลหุโทษ ≠ ม.334(เกิน1,000=≤3ปี จำคุก)', keywords:['ลักทรัพย์','ราคาน้อย','1,000 บาท','ลหุโทษ'], dika:[] },
  { id:'crim-395', section:'395', chapter:24, chapter_title:'ลหุโทษ', title:'ฉ้อโกงเล็กน้อย — ราคาไม่เกิน 1,000 บาท ปรับ ≤ 10,000', text:'ผู้ใดกระทำความผิดฐานฉ้อโกง แต่ทรัพย์สินหรือประโยชน์ที่ได้ไปมีราคาไม่เกินหนึ่งพันบาท → ปรับ ≤ 10,000', summary:'ฉ้อโกงเล็กน้อย: ราคา≤1,000→ปรับ≤10,000 ลหุโทษ ≠ ม.341(เกิน=≤3ปี จำคุก)', keywords:['ฉ้อโกง','ราคาน้อย','1,000 บาท','ลหุโทษ'], dika:[] },
];

const crExisting = new Set(cr.sections.map(x => x.section));
let crAdded = 0;
for (const x of crNew) { if (!crExisting.has(x.section)) { cr.sections.push(x); crAdded++; } }
fs.writeFileSync(crFile, JSON.stringify(cr, null, 2), 'utf8');
console.log('Criminal: +' + crAdded + ' = ' + cr.sections.length);

// === ป.พ.พ. round 15 + วิ.แพ่ง/วิ.อาญา ===
const obFile = 'law/ppc/obligations/obligations.json';
const ob = JSON.parse(fs.readFileSync(obFile, 'utf8'));
const obNew = [
  { id:'ppc-193-22', section:'193/22', chapter:6, chapter_title:'อายุความ', title:'อายุความหยุดลง — ไม่นับระหว่างมีเหตุขัดข้อง', text:'ในระหว่างที่เจ้าหนี้ไม่อาจบังคับสิทธิเรียกร้องของตนได้เพราะเหตุสุดวิสัย → อายุความไม่นับ ตลอดเวลาที่เหตุขัดข้องนั้นยังมีอยู่\nเมื่อเหตุขัดข้องหมดไป → อายุความเริ่มนับต่อ', summary:'อายุความหยุด: เหตุสุดวิสัย(น้ำท่วม/สงคราม)→อายุความหยุดนับ เหตุหมด→นับต่อ ≠ สะดุด(ม.193/17=นับใหม่)', keywords:['อายุความหยุด','เหตุสุดวิสัย','ขัดข้อง'], dika:[] },
  { id:'ppc-304', section:'304', chapter:9, chapter_title:'หนี้ — โอนสิทธิ', title:'โอนสิทธิเรียกร้อง — บอกกล่าวลูกหนี้แล้ว ลูกหนี้ต้องชำระให้ผู้รับโอน', text:'เมื่อได้บอกกล่าวการโอนแก่ลูกหนี้แล้ว → ลูกหนี้จะยกข้อต่อสู้ที่มีต่อผู้โอน ขึ้นต่อสู้ผู้รับโอนก็ได้ เฉพาะที่มีอยู่ก่อนได้รับคำบอกกล่าว', summary:'ผลโอนสิทธิ: บอกกล่าวแล้ว→ลูกหนี้ชำระให้ผู้รับโอน ข้อต่อสู้ที่มีก่อนบอกกล่าว=ยกขึ้นได้', keywords:['โอนสิทธิ','บอกกล่าว','ข้อต่อสู้','ผู้รับโอน'], dika:[] },
];

const obExisting = new Set(ob.sections.map(x => x.section));
let obAdded = 0;
for (const x of obNew) { if (!obExisting.has(x.section)) { ob.sections.push(x); obAdded++; } }
fs.writeFileSync(obFile, JSON.stringify(ob, null, 2), 'utf8');
console.log('Obligations: +' + obAdded + ' = ' + ob.sections.length);

const cvpFile = 'law/civil-procedure/civil-procedure.json';
const cvp = JSON.parse(fs.readFileSync(cvpFile, 'utf8'));
const cvpNew = [
  { id:'cvp-145', section:'145', chapter:6, chapter_title:'คำพิพากษา', title:'คำพิพากษาผูกพันคู่ความ — ผูกพันเฉพาะคู่ความในคดี', text:'คำพิพากษาหรือคำสั่งย่อมผูกพันคู่ความในกระบวนพิจารณาของศาลที่พิพากษาหรือมีคำสั่ง\nบุคคลภายนอก → ไม่ถูกผูกพัน เว้นแต่กฎหมายจะบัญญัติไว้เป็นอย่างอื่น', summary:'คำพิพากษาผูกพัน: เฉพาะคู่ความในคดี บุคคลภายนอกไม่ถูกผูกพัน (Res Judicata เฉพาะคู่ความ)', keywords:['ผูกพันคู่ความ','บุคคลภายนอก','Res Judicata'], dika:[] },
  { id:'cvp-236', section:'236', chapter:8, chapter_title:'อุทธรณ์', title:'ห้ามอ้างพยานใหม่ในอุทธรณ์ — เว้นแต่ศาลอนุญาต', text:'ห้ามมิให้คู่ความอ้างหรือส่งพยานหลักฐานใหม่ในชั้นอุทธรณ์ เว้นแต่\n(1) ศาลอุทธรณ์จะอนุญาต\n(2) เป็นพยานหลักฐานที่เพิ่งค้นพบภายหลัง', summary:'พยานใหม่ในอุทธรณ์: ห้ามอ้างเป็นหลัก เว้นแต่ศาลอนุญาต/เพิ่งค้นพบ ≠ ฎีกา(เข้มกว่า)', keywords:['พยานใหม่','อุทธรณ์','ห้ามอ้าง','ค้นพบ'], dika:[] },
];

const cvpExisting = new Set(cvp.sections.map(x => x.section));
let cvpAdded = 0;
for (const x of cvpNew) { if (!cvpExisting.has(x.section)) { cvp.sections.push(x); cvpAdded++; } }
fs.writeFileSync(cvpFile, JSON.stringify(cvp, null, 2), 'utf8');
console.log('Civil Procedure: +' + cvpAdded + ' = ' + cvp.sections.length);

const crpFile = 'law/criminal-procedure/criminal-procedure.json';
const crp = JSON.parse(fs.readFileSync(crpFile, 'utf8'));
const crpNew = [
  { id:'crp-63', section:'63', chapter:5, chapter_title:'หมายอาญา', title:'หมายจับมีอายุ 6 เดือน — เกินต้องขอใหม่', text:'หมายจับคงใช้ได้อยู่จนกว่าจะจับได้ แต่ศาลจะกำหนดอายุหมายไว้ก็ได้\nถ้าไม่กำหนด → หมายจับใช้ได้ 6 เดือนนับแต่วันออก หลังจากนั้นต้องขอใหม่', summary:'อายุหมายจับ: 6 เดือน(ถ้าไม่กำหนด) เกิน→ต้องขอศาลออกใหม่ ศาลกำหนดสั้นกว่าได้', keywords:['อายุหมายจับ','6 เดือน','ขอใหม่'], dika:[] },
  { id:'crp-68', section:'68', chapter:5, chapter_title:'หมายอาญา', title:'หมายจับ — เหตุยกเลิกหมายจับ', text:'หมายจับย่อมสิ้นผลเมื่อ:\n(1) จับได้แล้ว\n(2) ศาลสั่งเพิกถอน\n(3) ครบกำหนดอายุหมาย', summary:'หมายจับสิ้นผล: จับได้/ศาลเพิกถอน/หมดอายุ จับแล้ว→หมายหมดผลทันที', keywords:['หมายจับสิ้นผล','จับได้','เพิกถอน'], dika:[] },
];

const crpExisting = new Set(crp.sections.map(x => x.section));
let crpAdded = 0;
for (const x of crpNew) { if (!crpExisting.has(x.section)) { crp.sections.push(x); crpAdded++; } }
fs.writeFileSync(crpFile, JSON.stringify(crp, null, 2), 'utf8');
console.log('Criminal Procedure: +' + crpAdded + ' = ' + crp.sections.length);

console.log('\nTotal added: ' + (crAdded + obAdded + cvpAdded + crpAdded));
