const fs = require('fs');

// === ป.อ. round 43 ===
const crFile = 'law/criminal/criminal.json';
const cr = JSON.parse(fs.readFileSync(crFile, 'utf8'));
const crNew = [
  { id:'crim-269-8b', section:'269/8', chapter:17, chapter_title:'ความผิดเกี่ยวกับหนังสือเดินทาง', title:'ปลอมหนังสือเดินทาง/วีซ่า — จำคุก 1-10 ปี', text:'ผู้ใดทำปลอมขึ้นซึ่งหนังสือเดินทาง → จำคุก 1-10 ปี + ปรับ 20,000-200,000\nใช้หนังสือเดินทางปลอม → โทษเท่าผู้ปลอม', summary:'ปลอมพาสปอร์ต: ทำปลอม/ใช้ปลอม→1-10ปี ครอบคลุมทั้งพาสปอร์ตไทยและต่างประเทศ', keywords:['ปลอมพาสปอร์ต','วีซ่า','1-10 ปี'], dika:[] },
  { id:'crim-34-2', section:'35', chapter:3, chapter_title:'โทษ', title:'ริบทรัพย์สิน — ทรัพย์ที่ใช้/ได้มาจากความผิด ศาลริบได้', text:'เมื่อศาลสั่งริบทรัพย์สิน → ทรัพย์สินนั้นตกเป็นของแผ่นดิน\nถ้าศาลเห็นว่าทรัพย์สินที่ริบนั้นไม่มีราคาพอจะเก็บรักษา → ศาลจะสั่งให้ทำลายก็ได้', summary:'ริบทรัพย์ตกเป็นของแผ่นดิน: ศาลริบ→ตกเป็นของรัฐ ไม่มีค่า→ทำลายได้ เช่น ยาเสพติดที่ยึด', keywords:['ริบทรัพย์','ของแผ่นดิน','ทำลาย'], dika:[] },
  { id:'crim-38', section:'38', chapter:3, chapter_title:'โทษ', title:'ริบทรัพย์สินที่ศาลมิได้สั่ง — เจ้าของขอคืนได้', text:'ทรัพย์สินที่ศาลสั่งริบ ถ้าผู้เป็นเจ้าของแท้จริงมิได้รู้เห็นเป็นใจด้วยในการกระทำผิด → เจ้าของจะร้องขอรับคืนได้ภายใน 1 ปี', summary:'ขอคืนทรัพย์ริบ: เจ้าของแท้จริง+ไม่รู้เห็นเป็นใจ→ขอคืนได้ใน 1 ปี เช่น คนอื่นเอารถไปใช้ก่อเหตุ', keywords:['ขอคืนทรัพย์ริบ','เจ้าของแท้จริง','1 ปี'], dika:[] },
  { id:'crim-42', section:'42', chapter:3, chapter_title:'วิธีการเพื่อความปลอดภัย', title:'ห้ามประกอบอาชีพบางอย่าง — ศาลสั่ง ≤ 5 ปี', text:'เมื่อศาลลงโทษผู้ใด → ศาลจะสั่งห้ามมิให้ผู้นั้นประกอบอาชีพบางอย่าง ≤ 5 ปีนับแต่พ้นโทษ', summary:'ห้ามอาชีพ: ศาลสั่งห้ามประกอบอาชีพที่เกี่ยวกับความผิด ≤5ปี เช่น แพทย์ทำผิด→ห้ามรักษาคน', keywords:['ห้ามอาชีพ','5 ปี','พ้นโทษ'], dika:[] },
  { id:'crim-57', section:'57', chapter:3, chapter_title:'การรอการลงโทษ', title:'เพิกถอนรอลงอาญา — ทำผิดใหม่ในระหว่างรอ', text:'ถ้าผู้ที่ถูกรอการลงโทษได้กระทำผิดอีกในระหว่างรอ และถูกศาลพิพากษาลงโทษจำคุก → ศาลจะเพิกถอนการรอลงโทษก็ได้', summary:'เพิกถอนรอลงอาญา: ทำผิดใหม่ระหว่างรอ+ถูกจำคุก→ศาลเพิกถอนรอลงอาญา ต้องรับโทษทั้ง2คดี', keywords:['เพิกถอน','รอลงอาญา','ทำผิดใหม่'], dika:[] },
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
  { id:'cvp-4ben', section:'4 เบญจ', chapter:1, chapter_title:'เขตอำนาจศาล', title:'ส่งเอกสารทางอิเล็กทรอนิกส์ — ส่งทาง email/ระบบศาลได้', text:'การยื่นคำคู่ความ คำร้อง เอกสาร → อาจยื่นทางอิเล็กทรอนิกส์ก็ได้ ตามที่ประธานศาลฎีกากำหนด', summary:'ยื่นเอกสารออนไลน์: ยื่นคำฟ้อง/คำร้อง/เอกสารทาง e-filing ได้ ตามระเบียบประธานศาลฎีกา', keywords:['อิเล็กทรอนิกส์','e-filing','ออนไลน์'], dika:[] },
  { id:'cvp-357', section:'357', chapter:11, chapter_title:'การบังคับคดี', title:'บังคับกระทำการ — ศาลปรับจนกว่าลูกหนี้จะทำ', text:'ถ้าลูกหนี้ไม่กระทำการตามคำพิพากษา → ศาลจะสั่งปรับลูกหนี้จนกว่าจะกระทำก็ได้ (Astreinte)', summary:'ปรับจนกว่าจะทำ: Astreinte ศาลปรับทุกวัน/ทุกสัปดาห์จนลูกหนี้ทำ ≠ จ้างคนอื่นทำแทน(ม.356)', keywords:['Astreinte','ปรับ','จนกว่าจะทำ'], dika:[] },
];

const cvpExisting = new Set(cvp.sections.map(x => x.section));
let cvpAdded = 0;
for (const x of cvpNew) { if (!cvpExisting.has(x.section)) { cvp.sections.push(x); cvpAdded++; } }
fs.writeFileSync(cvpFile, JSON.stringify(cvp, null, 2), 'utf8');
console.log('Civil Procedure: +' + cvpAdded + ' = ' + cvp.sections.length);

const crpFile = 'law/criminal-procedure/criminal-procedure.json';
const crp = JSON.parse(fs.readFileSync(crpFile, 'utf8'));
const crpNew = [
  { id:'crp-236-crp', section:'236', chapter:16, chapter_title:'พยานบุคคล', title:'พยานเด็ก — ต้องมีนักจิตวิทยาหรือนักสังคมสงเคราะห์ร่วม', text:'ในคดีที่มีพยานเป็นเด็กอายุไม่เกิน 18 ปี → การถามพยานต้องกระทำในห้องที่จัดเตรียมเป็นพิเศษ โดยมีนักจิตวิทยาหรือนักสังคมสงเคราะห์ร่วมด้วย', summary:'พยานเด็ก: ≤18ปี ต้องมีนักจิตวิทยา/สังคมสงเคราะห์ ถามในห้องพิเศษ คุ้มครองเด็ก', keywords:['พยานเด็ก','นักจิตวิทยา','ห้องพิเศษ','คุ้มครอง'], dika:[] },
  { id:'crp-250-crp2', section:'250/1', chapter:17, chapter_title:'การบังคับตามคำพิพากษา', title:'ริบทรัพย์สินในคดีอาญา — ตกเป็นของแผ่นดิน', text:'ทรัพย์สินที่ศาลสั่งริบในคดีอาญา → ตกเป็นของแผ่นดิน\nเจ้าพนักงานบังคับคดีเป็นผู้ดำเนินการ', summary:'ริบทรัพย์อาญา: ศาลสั่ง→ตกเป็นของรัฐ เจ้าพนักงานดำเนินการ คู่กับ ม.33-38 ป.อ.', keywords:['ริบทรัพย์','ของแผ่นดิน','บังคับคดี'], dika:[] },
];

const crpExisting = new Set(crp.sections.map(x => x.section));
let crpAdded = 0;
for (const x of crpNew) { if (!crpExisting.has(x.section)) { crp.sections.push(x); crpAdded++; } }
fs.writeFileSync(crpFile, JSON.stringify(crp, null, 2), 'utf8');
console.log('Criminal Procedure: +' + crpAdded + ' = ' + crp.sections.length);

console.log('\nTotal added: ' + (crAdded + cvpAdded + crpAdded));
