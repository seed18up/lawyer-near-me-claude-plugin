const fs = require('fs');

// === ป.อ. round 46 — เข้าใกล้ 390! ===
const crFile = 'law/criminal/criminal.json';
const cr = JSON.parse(fs.readFileSync(crFile, 'utf8'));
const crNew = [
  { id:'crim-99', section:'99', chapter:9, chapter_title:'อายุความ', title:'อายุความ — ไม่นับระหว่างคดียังอยู่ในศาล', text:'ในระหว่างที่คดียังอยู่ในระหว่างพิจารณาของศาล → อายุความไม่นับ\nเมื่อมีคำพิพากษาถึงที่สุดแล้ว → เริ่มนับอายุความต่อ', summary:'อายุความอาญาไม่นับ: ระหว่างคดีอยู่ในศาล อายุความหยุด ศาลตัดสินแล้ว→เริ่มนับต่อ', keywords:['อายุความ','ระหว่างพิจารณา','หยุดนับ'], dika:[] },
  { id:'crim-104', section:'104', chapter:9, chapter_title:'อายุความ', title:'อายุความคดียอมความ — สิทธิฟ้องระงับ', text:'ความผิดอันยอมความได้ → ถ้าผู้เสียหายมิได้ร้องทุกข์ภายใน 3 เดือนนับแต่รู้เรื่องความผิดและรู้ตัวผู้กระทำ → เป็นอันขาดอายุความ', summary:'อายุความคดียอมความ: 3 เดือนนับแต่รู้เรื่อง+รู้ตัว ไม่ร้องทุกข์→ขาดอายุความ คู่กับ วิ.อาญา ม.38', keywords:['อายุความ','ยอมความ','3 เดือน','ร้องทุกข์'], dika:[] },
  { id:'crim-105', section:'105', chapter:9, chapter_title:'อายุความ', title:'อายุความคดีความผิดต่อแผ่นดิน — ฟ้องได้ตลอดไม่ต้องรอร้องทุกข์', text:'ความผิดอาญาแผ่นดิน → พนักงานอัยการมีอำนาจฟ้องได้โดยไม่ต้องมีคำร้องทุกข์\nอายุความตามมาตรา 95', summary:'คดีอาญาแผ่นดิน: อัยการฟ้องเอง ไม่ต้องร้องทุกข์ อายุความตาม ม.95(1-20ปี) ≠ คดียอมความ(3เดือน)', keywords:['อาญาแผ่นดิน','ไม่ต้องร้องทุกข์','อัยการ'], dika:[] },
  { id:'crim-106', section:'106', chapter:9, chapter_title:'อายุความ', title:'อายุความลงโทษ — ล่วงเลยการลงโทษ', text:'เมื่อล่วงเลยกำหนดเวลาตามมาตรา 98 → ถือว่าล่วงเลยการลงโทษ ผู้ต้องคำพิพากษาพ้นจากการลงโทษ', summary:'ล่วงเลยลงโทษ: ศาลตัดสินแล้วแต่จับตัวไม่ได้ตามกำหนด→พ้นโทษ คู่กับ ม.98(กำหนดเวลา) ม.101', keywords:['ล่วงเลยลงโทษ','จับไม่ได้','พ้นโทษ'], dika:[] },
  { id:'crim-389', section:'389', chapter:24, chapter_title:'ลหุโทษ', title:'ใช้ตำแหน่งเท็จ — แอบอ้างตำแหน่งไม่มีจริง → ปรับ ≤ 200', text:'ผู้ใดใช้ตำแหน่ง ยศ ปริญญา วิทยฐานะ ซึ่งตนไม่มีสิทธิจะใช้ → ปรับ ≤ 200', summary:'อ้างตำแหน่งเท็จ: อ้างว่ามียศ/ตำแหน่ง/ปริญญาที่ไม่มี→ปรับ≤200 ลหุโทษ', keywords:['ตำแหน่งเท็จ','ยศ','ปริญญา','ลหุโทษ'], dika:[] },
];

const crExisting = new Set(cr.sections.map(x => x.section));
let crAdded = 0;
for (const x of crNew) { if (!crExisting.has(x.section)) { cr.sections.push(x); crAdded++; } }
fs.writeFileSync(crFile, JSON.stringify(cr, null, 2), 'utf8');
console.log('Criminal: +' + crAdded + ' = ' + cr.sections.length);

// === วิ.แพ่ง + วิ.อาญา ===
const cvpFile = 'law/civil-procedure/civil-procedure.json';
const cvp = JSON.parse(fs.readFileSync(cvpFile, 'utf8'));
const cvpNew = [
  { id:'cvp-114', section:'114', chapter:5, chapter_title:'พยานหลักฐาน', title:'พยานผู้เชี่ยวชาญ — ทำรายงานเป็นหนังสือยื่นต่อศาล', text:'ผู้เชี่ยวชาญต้องทำรายงานเป็นหนังสือยื่นต่อศาล และอาจถูกเรียกมาให้การประกอบรายงานด้วย', summary:'รายงานผู้เชี่ยวชาญ: ทำเป็นหนังสือ+ยื่นศาล ถูกเรียกมาซักถามได้ เช่น รายงานผลตรวจ DNA', keywords:['ผู้เชี่ยวชาญ','รายงาน','หนังสือ','ซักถาม'], dika:[] },
  { id:'cvp-324', section:'324', chapter:11, chapter_title:'การบังคับคดี', title:'ร้องขอเฉลี่ย — เจ้าหนี้อื่นขอเฉลี่ยทรัพย์ที่ยึด', text:'เจ้าหนี้ตามคำพิพากษาอื่น อาจร้องขอเข้าเฉลี่ยในทรัพย์สินที่ยึดไว้ได้ → ต้องร้องขอก่อนสิ้นระยะเวลาที่กำหนด', summary:'ร้องขอเฉลี่ย: เจ้าหนี้อื่นขอแบ่งเงินจากทรัพย์ที่ยึด→ร้องภายในกำหนด ≠ บุริมสิทธิ(ได้ก่อน)', keywords:['ร้องขอเฉลี่ย','เจ้าหนี้อื่น','ทรัพย์ที่ยึด'], dika:[] },
];

const cvpExisting = new Set(cvp.sections.map(x => x.section));
let cvpAdded = 0;
for (const x of cvpNew) { if (!cvpExisting.has(x.section)) { cvp.sections.push(x); cvpAdded++; } }
fs.writeFileSync(cvpFile, JSON.stringify(cvp, null, 2), 'utf8');
console.log('Civil Procedure: +' + cvpAdded + ' = ' + cvp.sections.length);

const crpFile = 'law/criminal-procedure/criminal-procedure.json';
const crp = JSON.parse(fs.readFileSync(crpFile, 'utf8'));
const crpNew = [
  { id:'crp-129', section:'129', chapter:9, chapter_title:'การสอบสวน', title:'ห้ามสอบสวนก่อนแจ้งความ — ต้องมีคำร้องทุกข์/กล่าวโทษก่อน', text:'ในกรณีความผิดซึ่งมิใช่ความผิดซึ่งหน้า → ห้ามมิให้จับ ค้น หรือทำการสอบสวน จนกว่าจะมีคำร้องทุกข์หรือคำกล่าวโทษ', summary:'ต้องแจ้งความก่อนสอบสวน: ผิดไม่ซึ่งหน้า→ต้องมีคำร้องทุกข์/กล่าวโทษก่อน ≠ ผิดซึ่งหน้า(จับ/สอบสวนได้เลย)', keywords:['ร้องทุกข์ก่อน','ก่อนสอบสวน','ไม่ซึ่งหน้า'], dika:[] },
  { id:'crp-214', section:'214', chapter:14, chapter_title:'อุทธรณ์', title:'อุทธรณ์คดีอาญา — อุทธรณ์ได้ทั้งข้อเท็จจริงและข้อกฎหมาย', text:'ในคดีอาญา คู่ความมีสิทธิอุทธรณ์คำพิพากษาของศาลชั้นต้น → ทั้งในปัญหาข้อเท็จจริงและข้อกฎหมาย\nเว้นแต่จะมีข้อจำกัดตามมาตรา 193-212', summary:'อุทธรณ์อาญา: อุทธรณ์ได้ทั้งข้อเท็จจริง+ข้อกฎหมาย เว้นแต่จำกัด(รับสารภาพ/ปรับน้อย)', keywords:['อุทธรณ์อาญา','ข้อเท็จจริง','ข้อกฎหมาย'], dika:[] },
];

const crpExisting = new Set(crp.sections.map(x => x.section));
let crpAdded = 0;
for (const x of crpNew) { if (!crpExisting.has(x.section)) { crp.sections.push(x); crpAdded++; } }
fs.writeFileSync(crpFile, JSON.stringify(crp, null, 2), 'utf8');
console.log('Criminal Procedure: +' + crpAdded + ' = ' + crp.sections.length);

console.log('\nTotal added: ' + (crAdded + cvpAdded + crpAdded));
