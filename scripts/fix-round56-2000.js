const fs = require('fs');

// === ป.อ. round 35 ===
const crFile = 'law/criminal/criminal.json';
const cr = JSON.parse(fs.readFileSync(crFile, 'utf8'));
const crNew = [
  { id:'crim-201', section:'201', chapter:13, chapter_title:'ความผิดต่อตำแหน่งหน้าที่ในการยุติธรรม', title:'ผู้พิพากษาลงโทษผิดกฎหมาย — จำคุก 1-20 ปี/ตลอดชีวิต', text:'ผู้ใดเป็นเจ้าพนักงานในตำแหน่งตุลาการ พนักงานอัยการ กระทำหรือไม่กระทำการอย่างใดในตำแหน่งโดยมิชอบ เพื่อให้บุคคลหนึ่งบุคคลใดต้องรับโทษหนักขึ้น → จำคุก 1-20 ปี', summary:'ตุลาการ/อัยการทุจริต: ทำให้คนรับโทษหนักขึ้นโดยทุจริต→1-20ปี หนักมากเพราะเป็นผู้ตัดสิน', keywords:['ตุลาการ','อัยการ','ทุจริต','โทษหนักขึ้น'], dika:[] },
  { id:'crim-202', section:'202', chapter:13, chapter_title:'ความผิดต่อตำแหน่งหน้าที่ในการยุติธรรม', title:'เจ้าพนักงานทำสำนวนเท็จ — จำคุก 1-10 ปี', text:'ผู้ใดเป็นเจ้าพนักงาน มีหน้าที่ทำหรือรักษาเอกสาร กรอกข้อความลงในเอกสาร ทำรายงานเท็จ → จำคุก 1-10 ปี', summary:'สำนวนเท็จ: จ.พง.ทำสำนวน/รายงานเท็จ→1-10ปี เช่น ส.ส.ทำบันทึกการจับกุมเท็จ', keywords:['สำนวนเท็จ','รายงานเท็จ','เจ้าพนักงาน'], dika:[] },
  { id:'crim-204', section:'204', chapter:13, chapter_title:'ความผิดต่อตำแหน่งหน้าที่ในการยุติธรรม', title:'ผู้พิพากษาเปิดเผยความลับคดี — จำคุก ≤ 5 ปี', text:'ผู้ใดเป็นเจ้าพนักงานในตำแหน่งตุลาการ พนักงานอัยการ หรือเจ้าพนักงานที่มีอำนาจสืบสวนคดีอาญา เปิดเผยความลับในคดี → จำคุก ≤ 5 ปี', summary:'เปิดเผยความลับคดี: ผู้พิพากษา/อัยการ/ส.ส.เปิดเผยข้อมูลลับในคดี→≤5ปี', keywords:['ความลับคดี','ผู้พิพากษา','อัยการ','เปิดเผย'], dika:[] },
  { id:'crim-269-10', section:'269/10', chapter:17, chapter_title:'ความผิดเกี่ยวกับหนังสือเดินทาง', title:'มีหนังสือเดินทางปลอม — จำคุก 1-10 ปี', text:'ผู้ใดมีไว้เพื่อนำออกใช้ซึ่งหนังสือเดินทางปลอม → จำคุก 1-10 ปี + ปรับ 20,000-200,000', summary:'มีพาสปอร์ตปลอม: แค่มีไว้ก็ผิด→1-10ปี ≠ ม.269/15(ทำปลอม=1-10ปี) ≠ ม.269/9(ใช้ของคนอื่น)', keywords:['หนังสือเดินทางปลอม','มีไว้','พาสปอร์ต'], dika:[] },
  { id:'crim-269-12', section:'269/12', chapter:17, chapter_title:'ความผิดเกี่ยวกับหนังสือเดินทาง', title:'ขอหนังสือเดินทางโดยแจ้งข้อมูลเท็จ — จำคุก ≤ 5 ปี', text:'ผู้ใดยื่นคำขอรับหนังสือเดินทาง โดยแจ้งข้อความอันเป็นเท็จ → จำคุก ≤ 5 ปี + ปรับ ≤ 100,000', summary:'ขอพาสปอร์ตเท็จ: แจ้งข้อมูลเท็จเพื่อขอพาสปอร์ต→≤5ปี เช่น แอบอ้างชื่อ/สัญชาติ', keywords:['หนังสือเดินทาง','ข้อมูลเท็จ','แจ้งเท็จ'], dika:[] },
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
  { id:'cvp-98', section:'98', chapter:5, chapter_title:'พยานหลักฐาน', title:'พยานที่มีส่วนได้เสีย — รับฟังได้แต่น้ำหนักน้อย', text:'พยานที่มีส่วนได้เสียในคดี → ศาลรับฟังได้ แต่จะให้น้ำหนักน้อยกว่าพยานที่ไม่มีส่วนได้เสีย', summary:'พยานมีส่วนได้เสีย: รับฟังได้ แต่น้ำหนักน้อย เช่น ญาติ/เพื่อนสนิทของคู่ความ', keywords:['พยานมีส่วนได้เสีย','น้ำหนัก','รับฟังได้'], dika:[] },
  { id:'cvp-281', section:'281', chapter:11, chapter_title:'การบังคับคดี', title:'เจ้าพนักงานบังคับคดี — อำนาจยึดอายัดทรัพย์สิน', text:'เจ้าพนักงานบังคับคดีมีอำนาจ:\n(1) ยึดทรัพย์สินลูกหนี้\n(2) อายัดสิทธิเรียกร้อง\n(3) ขายทอดตลาด\n(4) จำหน่ายทรัพย์สิน', summary:'อำนาจ จ.พง.บังคับคดี: ยึด/อายัด/ขายทอดตลาด/จำหน่ายทรัพย์ลูกหนี้ ทำได้ตามคำพิพากษา', keywords:['เจ้าพนักงานบังคับคดี','ยึด','อายัด','ขายทอดตลาด'], dika:[] },
];

const cvpExisting = new Set(cvp.sections.map(x => x.section));
let cvpAdded = 0;
for (const x of cvpNew) { if (!cvpExisting.has(x.section)) { cvp.sections.push(x); cvpAdded++; } }
fs.writeFileSync(cvpFile, JSON.stringify(cvp, null, 2), 'utf8');
console.log('Civil Procedure: +' + cvpAdded + ' = ' + cvp.sections.length);

const crpFile = 'law/criminal-procedure/criminal-procedure.json';
const crp = JSON.parse(fs.readFileSync(crpFile, 'utf8'));
const crpNew = [
  { id:'crp-220', section:'220', chapter:15, chapter_title:'ฎีกา', title:'ข้อจำกัดฎีกาอาญา — ศาลอุทธรณ์ยืน → ห้ามฎีกาข้อเท็จจริง', text:'ในคดีที่ศาลอุทธรณ์พิพากษายืนตามศาลชั้นต้น → ห้ามฎีกาในปัญหาข้อเท็จจริง\nเว้นแต่ได้รับอนุญาตจากศาลฎีกา', summary:'ฎีกาอาญาจำกัด: อุทธรณ์ยืน→ห้ามฎีกาข้อเท็จจริง ต้องขออนุญาตศาลฎีกา คล้าย วิ.แพ่ง ม.248', keywords:['ฎีกาจำกัด','อุทธรณ์ยืน','ข้อเท็จจริง'], dika:[] },
  { id:'crp-253', section:'253', chapter:17, chapter_title:'ค่าธรรมเนียม', title:'ค่าธรรมเนียมคดีอาญา — โจทก์ไม่ต้องเสียค่าธรรมเนียม', text:'ในคดีอาญา → โจทก์ไม่ต้องเสียค่าธรรมเนียมศาล\nเว้นแต่ค่าธรรมเนียมในส่วนแพ่ง', summary:'คดีอาญาฟรี: โจทก์(อัยการ/ผู้เสียหาย)ไม่ต้องจ่ายค่าธรรมเนียม ≠ คดีแพ่ง(ต้องจ่าย ม.150)', keywords:['ค่าธรรมเนียม','คดีอาญา','ฟรี'], dika:[] },
];

const crpExisting = new Set(crp.sections.map(x => x.section));
let crpAdded = 0;
for (const x of crpNew) { if (!crpExisting.has(x.section)) { crp.sections.push(x); crpAdded++; } }
fs.writeFileSync(crpFile, JSON.stringify(crp, null, 'utf8'));
console.log('Criminal Procedure: +' + crpAdded + ' = ' + crp.sections.length);

console.log('\nTotal added: ' + (crAdded + cvpAdded + crpAdded));
