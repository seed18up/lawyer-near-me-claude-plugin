const fs = require('fs');

// === ป.อ. round 32 ===
const crFile = 'law/criminal/criminal.json';
const cr = JSON.parse(fs.readFileSync(crFile, 'utf8'));
const crNew = [
  { id:'crim-124', section:'124', chapter:10, chapter_title:'ความผิดเกี่ยวกับความมั่นคง', title:'ยุยงให้ทหารละทิ้งหน้าที่ — จำคุก ≤ 5 ปี', text:'ผู้ใดยุยง เสี้ยมสอน ทหาร ตำรวจ หรืออาสาสมัครทหาร ให้หนีราชการ ทรยศ หรือไม่ปฏิบัติหน้าที่ → จำคุก ≤ 5 ปี + ปรับ ≤ 100,000', summary:'ยุยงทหารละทิ้ง: ยุยงให้หนี/ทรยศ/ไม่ปฏิบัติหน้าที่→≤5ปี คู่กับ ม.122', keywords:['ยุยงทหาร','ละทิ้งหน้าที่','ทรยศ'], dika:[] },
  { id:'crim-179', section:'179', chapter:13, chapter_title:'ความผิดต่อเจ้าพนักงานในการยุติธรรม', title:'นำพยานเท็จมาสืบ — จำคุก 1-7 ปี ถ้าคดีอาญาทำให้ถูกลงโทษ', text:'ถ้าการกระทำความผิดตามมาตรา 177 เป็นการกระทำในกรณีแห่งคดีอาญา โดยเป็นเหตุให้ผู้ถูกฟ้องต้องคำพิพากษาให้รับโทษ → จำคุก 1-7 ปี + ปรับ 20,000-140,000', summary:'พยานเท็จคดีอาญา: นำพยานเท็จจนคนถูกลงโทษ→1-7ปี หนักกว่าพยานเท็จทั่วไป(ม.177=≤5ปี)', keywords:['พยานเท็จ','คดีอาญา','ถูกลงโทษ'], dika:[] },
  { id:'crim-180', section:'180', chapter:13, chapter_title:'ความผิดต่อเจ้าพนักงานในการยุติธรรม', title:'นำพยานเท็จจนถูกประหาร — ประหารชีวิต/ตลอดชีวิต', text:'ถ้าการกระทำตามมาตรา 177 เป็นเหตุให้จำเลยต้องคำพิพากษาให้ลงโทษประหารชีวิต → ผู้กระทำต้องระวางโทษประหารชีวิตหรือจำคุกตลอดชีวิต', summary:'พยานเท็จจนถูกประหาร: ผลร้ายแรงสุด พยานเท็จจนคนถูกประหาร→ผู้ให้การเท็จถูกประหาร/ตลอดชีวิตเช่นกัน', keywords:['พยานเท็จ','ประหารชีวิต','ตลอดชีวิต'], dika:[] },
  { id:'crim-269-2', section:'269/2', chapter:17, chapter_title:'ความผิดเกี่ยวกับบัตรอิเล็กทรอนิกส์', title:'แก้ไขข้อมูลบัตรอิเล็กทรอนิกส์ — จำคุก 1-5 ปี', text:'ผู้ใดแก้ไขเปลี่ยนแปลงข้อมูลหรือรหัสในบัตรอิเล็กทรอนิกส์ → จำคุก 1-5 ปี + ปรับ 20,000-100,000', summary:'แก้ไขข้อมูลบัตร: เปลี่ยนข้อมูล/รหัสในบัตรเครดิต/ATM→1-5ปี เช่น skim ข้อมูลบัตร', keywords:['แก้ไขข้อมูล','บัตรอิเล็กทรอนิกส์','skim'], dika:[] },
  { id:'crim-269-3', section:'269/3', chapter:17, chapter_title:'ความผิดเกี่ยวกับบัตรอิเล็กทรอนิกส์', title:'ทำเครื่องมือปลอมบัตร — จำคุก 3-10 ปี', text:'ผู้ใดทำ มีไว้ นำเข้า ซึ่งเครื่องมือหรืออุปกรณ์สำหรับทำปลอมหรือแก้ไขบัตรอิเล็กทรอนิกส์ → จำคุก 3-10 ปี + ปรับ 60,000-200,000', summary:'เครื่องมือปลอมบัตร: มีเครื่อง skimmer/อุปกรณ์ปลอมบัตร→3-10ปี หนักกว่าปลอมบัตร(ม.269/1=1-5ปี)', keywords:['เครื่องมือปลอมบัตร','skimmer','อุปกรณ์'], dika:[] },
];

const crExisting = new Set(cr.sections.map(x => x.section));
let crAdded = 0;
for (const x of crNew) { if (!crExisting.has(x.section)) { cr.sections.push(x); crAdded++; } }
fs.writeFileSync(crFile, JSON.stringify(cr, null, 2), 'utf8');
console.log('Criminal: +' + crAdded + ' = ' + cr.sections.length);

// === ป.พ.พ. + วิ.แพ่ง + วิ.อาญา ===
const obFile = 'law/ppc/obligations/obligations.json';
const ob = JSON.parse(fs.readFileSync(obFile, 'utf8'));
const obNew = [
  { id:'ppc-193-27', section:'193/27', chapter:6, chapter_title:'อายุความ', title:'อายุความ — คู่กรณีตกลงเปลี่ยนแปลงไม่ได้', text:'คู่กรณีจะตกลงเปลี่ยนแปลงอายุความที่กฎหมายกำหนดไว้ไม่ได้ เว้นแต่จะมีกฎหมายบัญญัติไว้เป็นอย่างอื่น', summary:'ห้ามเปลี่ยนอายุความ: ตกลงกันเองเปลี่ยนไม่ได้ เป็นกฎหมายเกี่ยวกับความสงบเรียบร้อย คู่กับ ม.193/28', keywords:['ห้ามเปลี่ยน','อายุความ','ตกลง'], dika:[] },
  { id:'ppc-282', section:'282', chapter:7, chapter_title:'หนี้ — บุริมสิทธิ', title:'บุริมสิทธิ — ผู้ทรงบุริมสิทธิบังคับชำระจากทรัพย์สินได้ก่อน', text:'ผู้ทรงบุริมสิทธิมีสิทธิที่จะได้รับชำระหนี้จากทรัพย์สินซึ่งเป็นหลักแห่งบุริมสิทธิก่อนเจ้าหนี้อื่น', summary:'บังคับบุริมสิทธิ: บังคับชำระจากทรัพย์ที่เป็นหลักแห่งบุริมสิทธิก่อนเจ้าหนี้อื่น เช่น ค่าจ้างจากเงินเดือน', keywords:['บุริมสิทธิ','บังคับ','ชำระก่อน'], dika:[] },
];

const obExisting = new Set(ob.sections.map(x => x.section));
let obAdded = 0;
for (const x of obNew) { if (!obExisting.has(x.section)) { ob.sections.push(x); obAdded++; } }
fs.writeFileSync(obFile, JSON.stringify(ob, null, 2), 'utf8');
console.log('Obligations: +' + obAdded + ' = ' + ob.sections.length);

const cvpFile = 'law/civil-procedure/civil-procedure.json';
const cvp = JSON.parse(fs.readFileSync(cvpFile, 'utf8'));
const cvpNew = [
  { id:'cvp-109', section:'109', chapter:5, chapter_title:'พยานหลักฐาน', title:'พยานไม่มาศาล — ศาลออกหมายเรียก/หมายจับ', text:'ถ้าพยานไม่มาศาลตามกำหนด → ศาลจะออกหมายเรียกอีกครั้ง หรือออกหมายจับพยานมาก็ได้', summary:'พยานไม่มา: ศาลเรียกอีก/จับมาได้ พยานปฏิเสธให้การ→ลงโทษละเมิดอำนาจศาล', keywords:['พยานไม่มา','หมายจับ','หมายเรียก'], dika:[] },
];

const cvpExisting = new Set(cvp.sections.map(x => x.section));
let cvpAdded = 0;
for (const x of cvpNew) { if (!cvpExisting.has(x.section)) { cvp.sections.push(x); cvpAdded++; } }
fs.writeFileSync(cvpFile, JSON.stringify(cvp, null, 2), 'utf8');
console.log('Civil Procedure: +' + cvpAdded + ' = ' + cvp.sections.length);

const crpFile = 'law/criminal-procedure/criminal-procedure.json';
const crp = JSON.parse(fs.readFileSync(crpFile, 'utf8'));
const crpNew = [
  { id:'crp-189', section:'189', chapter:13, chapter_title:'คำพิพากษา', title:'คำพิพากษาถึงที่สุด — เมื่อไม่มีอุทธรณ์/ฎีกาภายในกำหนด', text:'คำพิพากษาหรือคำสั่งถึงที่สุด เมื่อ:\n(1) ไม่มีการอุทธรณ์หรือฎีกาภายในกำหนดเวลา\n(2) ศาลสูงสุดมีคำพิพากษาแล้ว', summary:'คดีถึงที่สุด: ไม่อุทธรณ์/ฎีกาภายในกำหนด หรือ ศาลสูงสุดตัดสิน→ถึงที่สุด บังคับคดีได้', keywords:['ถึงที่สุด','อุทธรณ์','ฎีกา','กำหนดเวลา'], dika:[] },
  { id:'crp-248', section:'248', chapter:17, chapter_title:'การบังคับตามคำพิพากษา', title:'กักขังแทนค่าปรับ — ไม่จ่ายค่าปรับ → กักขังแทน', text:'ถ้าผู้ต้องโทษปรับไม่ชำระค่าปรับ → ให้กักขังแทน\nอัตรากักขัง → วันละ 500 บาท\nกักขังรวมไม่เกิน 1 ปี (ปรับเกิน 200,000 ไม่เกิน 2 ปี)', summary:'กักขังแทนปรับ: ไม่จ่าย→กักขัง วันละ500บาท รวม≤1ปี(เกิน200K=≤2ปี) คู่กับ ม.30 ป.อ.', keywords:['กักขังแทนปรับ','500 บาท/วัน','1 ปี'], dika:[] },
];

const crpExisting = new Set(crp.sections.map(x => x.section));
let crpAdded = 0;
for (const x of crpNew) { if (!crpExisting.has(x.section)) { crp.sections.push(x); crpAdded++; } }
fs.writeFileSync(crpFile, JSON.stringify(crp, null, 2), 'utf8');
console.log('Criminal Procedure: +' + crpAdded + ' = ' + crp.sections.length);

console.log('\nTotal added: ' + (crAdded + obAdded + cvpAdded + crpAdded));
