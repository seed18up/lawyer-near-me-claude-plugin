const fs = require('fs');

// === ป.อ. round 33 ===
const crFile = 'law/criminal/criminal.json';
const cr = JSON.parse(fs.readFileSync(crFile, 'utf8'));
const crNew = [
  { id:'crim-185', section:'185', chapter:13, chapter_title:'ความผิดต่อเจ้าพนักงานในการยุติธรรม', title:'แหกที่คุมขังโดยทำลาย — จำคุก ≤ 7 ปี', text:'ผู้ใดทำให้เสียหาย ทำลาย หรือทำให้ใช้การไม่ได้ซึ่งที่คุมขัง เพื่อช่วยผู้ถูกคุมขังให้หลุดพ้น → จำคุก ≤ 7 ปี + ปรับ ≤ 140,000', summary:'ทำลายที่คุมขัง: ทำลายกำแพง/ประตูคุก→≤7ปี ≠ ม.181(หนีเฉยๆ=≤3ปี) ≠ ม.184(ใช้กำลัง=≤5ปี)', keywords:['แหกคุก','ทำลาย','ที่คุมขัง'], dika:[] },
  { id:'crim-195', section:'195', chapter:13, chapter_title:'ความผิดต่อเจ้าพนักงานในการยุติธรรม', title:'ช่วยผู้ถูกคุมขังหนี — ร่วมกัน ≥ 3 คน → จำคุก 1-7 ปี', text:'ถ้าการกระทำตามมาตรา 192 193 194 ได้กระทำโดยร่วมกัน 3 คนขึ้นไป → จำคุก 1-7 ปี\nถ้ามีอาวุธ → จำคุก 2-10 ปี', summary:'ช่วยหนี≥3คน: ร่วมกัน→1-7ปี มีอาวุธ→2-10ปี หนักกว่าช่วยคนเดียว', keywords:['ช่วยหนี','ร่วมกัน','3 คน','อาวุธ'], dika:[] },
  { id:'crim-231', section:'231', chapter:16, chapter_title:'ความผิดเกี่ยวกับการก่อภยันตราย', title:'ปลอมปนน้ำประปา — ใส่สารอันตรายลงน้ำดื่มสาธารณะ', text:'ผู้ใดเอาสิ่งที่เป็นอันตรายต่อสุขภาพลงในน้ำที่ใช้ดื่มของประชาชน → จำคุก 6 เดือน - 10 ปี', summary:'ปลอมปนน้ำ: ใส่สารอันตรายลงน้ำดื่มสาธารณะ→6เดือน-10ปี ตาย=10-20ปี/ตลอดชีวิต', keywords:['น้ำประปา','สารอันตราย','น้ำดื่ม','สาธารณะ'], dika:[] },
  { id:'crim-269-6', section:'269/6', chapter:17, chapter_title:'ความผิดเกี่ยวกับบัตรอิเล็กทรอนิกส์', title:'ขายบัตรอิเล็กทรอนิกส์ปลอม — จำคุก 1-5 ปี', text:'ผู้ใดนำเข้า ส่งออก จำหน่าย ซึ่งบัตรอิเล็กทรอนิกส์ปลอม → จำคุก 1-5 ปี + ปรับ 20,000-100,000', summary:'ขายบัตรปลอม: นำเข้า/ส่งออก/จำหน่ายบัตรเครดิต/ATM ปลอม→1-5ปี', keywords:['ขายบัตรปลอม','นำเข้า','จำหน่าย'], dika:[] },
  { id:'crim-269-15', section:'269/15', chapter:17, chapter_title:'ความผิดเกี่ยวกับหนังสือเดินทาง', title:'ปลอมหนังสือเดินทาง — จำคุก 1-10 ปี', text:'ผู้ใดทำปลอมขึ้นซึ่งหนังสือเดินทาง → จำคุก 1-10 ปี + ปรับ 20,000-200,000\nใช้หนังสือเดินทางปลอม → โทษเท่าผู้ปลอม', summary:'ปลอมพาสปอร์ต: ปลอมหนังสือเดินทาง→1-10ปี ใช้พาสปอร์ตปลอม=โทษเท่ากัน', keywords:['หนังสือเดินทาง','พาสปอร์ต','ปลอม'], dika:[] },
];

const crExisting = new Set(cr.sections.map(x => x.section));
let crAdded = 0;
for (const x of crNew) { if (!crExisting.has(x.section)) { cr.sections.push(x); crAdded++; } }
fs.writeFileSync(crFile, JSON.stringify(cr, null, 2), 'utf8');
console.log('Criminal: +' + crAdded + ' = ' + cr.sections.length);

// === วิ.อาญา round 16 + วิ.แพ่ง round 16 ===
const crpFile = 'law/criminal-procedure/criminal-procedure.json';
const crp = JSON.parse(fs.readFileSync(crpFile, 'utf8'));
const crpNew = [
  { id:'crp-50', section:'50', chapter:4, chapter_title:'คดีแพ่งเกี่ยวเนื่อง', title:'คดีแพ่งต้องถือตามข้อเท็จจริงในคดีอาญา', text:'เมื่อคดีอาญาเรื่องเดียวกัน ศาลอาญาได้วินิจฉัยข้อเท็จจริงว่าจำเลยกระทำผิด → ศาลแพ่งต้องถือตามนั้น', summary:'แพ่งถือตามอาญา: ศาลอาญาตัดสินว่าผิด→ศาลแพ่งต้องถือว่าผิดด้วย แต่ยกฟ้องอาญา≠ยกฟ้องแพ่ง', keywords:['แพ่งถือตามอาญา','ข้อเท็จจริง','ผูกพัน'], dika:[] },
  { id:'crp-249-crp', section:'249/1', chapter:17, chapter_title:'การบังคับตามคำพิพากษา', title:'ค่าปรับในคดีอาญา — ชำระภายใน 30 วัน', text:'ผู้ต้องโทษปรับต้องชำระค่าปรับภายในสามสิบวันนับแต่วันที่ศาลพิพากษา\nถ้าไม่ชำระ → ยึดทรัพย์สินใช้ค่าปรับ หรือกักขังแทน', summary:'ค่าปรับ 30 วัน: จ่ายค่าปรับใน 30 วัน ไม่จ่าย→ยึดทรัพย์/กักขังแทน(500บาท/วัน ม.30 ป.อ.)', keywords:['ค่าปรับ','30 วัน','ยึดทรัพย์','กักขังแทน'], dika:[] },
];

const crpExisting = new Set(crp.sections.map(x => x.section));
let crpAdded = 0;
for (const x of crpNew) { if (!crpExisting.has(x.section)) { crp.sections.push(x); crpAdded++; } }
fs.writeFileSync(crpFile, JSON.stringify(crp, null, 2), 'utf8');
console.log('Criminal Procedure: +' + crpAdded + ' = ' + crp.sections.length);

const cvpFile = 'law/civil-procedure/civil-procedure.json';
const cvp = JSON.parse(fs.readFileSync(cvpFile, 'utf8'));
const cvpNew = [
  { id:'cvp-202', section:'202', chapter:7, chapter_title:'การขาดนัดพิจารณา', title:'โจทก์ขาดนัดพิจารณา — ศาลจำหน่ายคดีหรือพิพากษายกฟ้อง', text:'ถ้าโจทก์ขาดนัดพิจารณา → ศาลจะมีคำสั่งจำหน่ายคดีออกจากสารบบความ\nถ้าจำเลยยื่นคำขอ → ศาลจะพิพากษายกฟ้องก็ได้', summary:'โจทก์ขาดนัด: ศาลจำหน่ายคดี(โจทก์ฟ้องใหม่ได้) หรือ จำเลยขอ→ยกฟ้อง(ฟ้องใหม่ไม่ได้)', keywords:['โจทก์ขาดนัด','จำหน่ายคดี','ยกฟ้อง'], dika:[] },
  { id:'cvp-260', section:'260', chapter:10, chapter_title:'วิธีการชั่วคราว', title:'คุ้มครองชั่วคราว — ศาลสั่งห้ามจำเลยทำซ้ำ/ทำต่อ', text:'ในกรณีที่โจทก์ยื่นคำร้องขอคุ้มครอง → ศาลอาจมีคำสั่งห้ามชั่วคราว ไม่ให้จำเลยกระทำซ้ำหรือกระทำต่อไปซึ่งการอันละเมิดหรือผิดสัญญา', summary:'ห้ามชั่วคราว: ศาลสั่งห้ามจำเลยทำซ้ำ/ทำต่อก่อนพิพากษา เช่น ห้ามก่อสร้าง/ห้ามขายทรัพย์', keywords:['ห้ามชั่วคราว','ทำซ้ำ','ทำต่อ','คุ้มครอง'], dika:[] },
  { id:'cvp-337', section:'337', chapter:11, chapter_title:'การบังคับคดี', title:'บัญชีส่วนเฉลี่ย — เจ้าหนี้หลายรายแบ่งเงินตามส่วน', text:'เมื่อมีเจ้าหนี้หลายราย → เจ้าพนักงานบังคับคดีต้องทำบัญชีส่วนเฉลี่ย แบ่งเงินที่ได้จากการขายทอดตลาดให้แก่เจ้าหนี้ตามส่วน', summary:'บัญชีส่วนเฉลี่ย: เจ้าหนี้หลายราย→แบ่งเงินตามส่วน มีบุริมสิทธิ→ได้ก่อน ≠ เจ้าหนี้รายเดียว(ได้ทั้งหมด)', keywords:['บัญชีส่วนเฉลี่ย','เจ้าหนี้หลายราย','แบ่งตามส่วน'], dika:[] },
];

const cvpExisting = new Set(cvp.sections.map(x => x.section));
let cvpAdded = 0;
for (const x of cvpNew) { if (!cvpExisting.has(x.section)) { cvp.sections.push(x); cvpAdded++; } }
fs.writeFileSync(cvpFile, JSON.stringify(cvp, null, 2), 'utf8');
console.log('Civil Procedure: +' + cvpAdded + ' = ' + cvp.sections.length);

console.log('\nTotal added: ' + (crAdded + crpAdded + cvpAdded));
