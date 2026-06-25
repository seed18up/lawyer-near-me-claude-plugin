const fs = require('fs');

// === ป.อ. round 36 ===
const crFile = 'law/criminal/criminal.json';
const cr = JSON.parse(fs.readFileSync(crFile, 'utf8'));
const crNew = [
  { id:'crim-205', section:'205', chapter:13, chapter_title:'ความผิดต่อตำแหน่งหน้าที่ในการยุติธรรม', title:'เจ้าพนักงานกระทำผิดต่อคดี — โทษหนักขึ้น 1/3', text:'ถ้าผู้กระทำความผิดตามมาตรา 200 ถึง 204 กระทำโดยเรียก รับ หรือยอมจะรับทรัพย์สิน → เพิ่มโทษอีก 1/3', summary:'จ.พง.ยุติธรรม+รับสินบน: กระทำมิชอบในคดี+รับเงิน→เพิ่มโทษ 1/3 โทษหนักสุดในหมวด', keywords:['เพิ่มโทษ','รับสินบน','ยุติธรรม'], dika:[] },
  { id:'crim-232', section:'232', chapter:16, chapter_title:'ความผิดเกี่ยวกับการก่อภยันตราย', title:'ทำให้ภยันตรายต่อยานพาหนะ — ทำให้รถ/เรือ/เครื่องบินเสียหาย', text:'ผู้ใดกระทำให้เสียหาย ทำลาย ซึ่งยานพาหนะ เรือ อากาศยาน ในประการที่น่าจะเป็นอันตรายแก่บุคคลอื่น → จำคุก ≤ 5 ปี + ปรับ ≤ 100,000', summary:'ทำลายยานพาหนะ: ทำลายรถ/เรือ/เครื่องบินจนน่าจะอันตราย→≤5ปี ตาย=5-20ปี', keywords:['ยานพาหนะ','ทำลาย','อันตราย'], dika:[] },
  { id:'crim-269-11', section:'269/11', chapter:17, chapter_title:'ความผิดเกี่ยวกับหนังสือเดินทาง', title:'จัดหาหนังสือเดินทางให้ผู้อื่นโดยมิชอบ — จำคุก 2-10 ปี', text:'ผู้ใดเป็นธุระจัดหาหนังสือเดินทางให้แก่ผู้อื่นโดยมิชอบด้วยกฎหมาย → จำคุก 2-10 ปี + ปรับ 40,000-200,000', summary:'จัดหาพาสปอร์ต: เป็นธุระจัดหาพาสปอร์ตให้คนอื่นโดยผิดกฎหมาย→2-10ปี เช่น นายหน้าค้ามนุษย์', keywords:['จัดหาหนังสือเดินทาง','มิชอบ','นายหน้า'], dika:[] },
  { id:'crim-366-2', section:'366/2', chapter:23, chapter_title:'ความผิดเกี่ยวกับศพ', title:'เก็บศพไว้ซ่อนเร้น — จำคุก ≤ 1 ปี', text:'ผู้ใดซ่อนเร้น ย้าย หรือทำลายศพ หรือส่วนของศพ เพื่อปกปิดการตายหรือสาเหตุแห่งการตาย → จำคุก ≤ 1 ปี + ปรับ ≤ 20,000', summary:'ซ่อนศพ: ซ่อน/ย้าย/ทำลายศพเพื่อปิดบัง→≤1ปี เบากว่า ม.366/1(ทำลายปกปิดฆ่า=1-5ปี)', keywords:['ซ่อนศพ','ย้ายศพ','ปกปิด'], dika:[] },
  { id:'crim-366-3', section:'366/3', chapter:23, chapter_title:'ความผิดเกี่ยวกับศพ', title:'ดูหมิ่นศพ — กระทำอนาจารต่อศพ → จำคุก 3 เดือน - 2 ปี', text:'ผู้ใดกระทำการอันเป็นการดูหมิ่นหรือกระทำอนาจารต่อศพ → จำคุก 3 เดือน - 2 ปี + ปรับ 5,000-40,000', summary:'ดูหมิ่นศพ: กระทำอนาจาร/ดูหมิ่นต่อศพ→3เดือน-2ปี', keywords:['ดูหมิ่นศพ','อนาจาร','ศพ'], dika:[] },
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
  { id:'ppc-193-34-2', section:'193/34', chapter:6, chapter_title:'อายุความ — กำหนดอายุความ', title:'อายุความ 2 ปี — ค่าสินค้า ค่าจ้างทำของ ค่ารักษาพยาบาล', text:'สิทธิเรียกร้องดังต่อไปนี้ มีกำหนดอายุความสองปี\n(1) ผู้ประกอบการค้า เรียกเอาค่าของที่ได้ส่งมอบ\n(2) ผู้ประกอบอุตสาหกรรม เรียกเอาค่าของที่ได้ส่งมอบ\n(3) ผู้ประกอบเกษตรกรรม เรียกเอาค่าของที่ได้ส่งมอบ\n(4) ผู้ประกอบการรับจ้างทำของ เรียกเอาค่าจ้าง\n(5) ผู้ประกอบการรักษาพยาบาล เรียกเอาค่ารักษาพยาบาล', summary:'อายุความ 2 ปี: ค่าสินค้า/ค่าจ้างทำของ/ค่ารักษาพยาบาล/ค่าอาหาร ≠ 5ปี(ม.193/33=ค่าเช่า) ≠ 1ปี(ม.193/35)', keywords:['อายุความ 2 ปี','ค่าสินค้า','ค่าจ้าง','ค่ารักษา'], dika:[] },
  { id:'ppc-287', section:'287', chapter:7, chapter_title:'หนี้ — บุริมสิทธิ', title:'บุริมสิทธิ — เจ้าหนี้ผู้มีบุริมสิทธิพิเศษ ชำระก่อนเจ้าหนี้จำนอง', text:'ถ้าผู้ทรงบุริมสิทธิพิเศษเหนืออสังหาริมทรัพย์ ได้จดทะเบียนบุริมสิทธินั้นก่อนจดทะเบียนจำนอง → บุริมสิทธิมีลำดับก่อนจำนอง', summary:'บุริมสิทธิก่อนจำนอง: จดทะเบียนก่อนจำนอง→ได้ชำระก่อน เช่น ค่าก่อสร้างจดก่อนจำนอง=ได้ก่อน', keywords:['บุริมสิทธิ','ก่อนจำนอง','จดทะเบียน'], dika:[] },
];

const obExisting = new Set(ob.sections.map(x => x.section));
let obAdded = 0;
for (const x of obNew) { if (!obExisting.has(x.section)) { ob.sections.push(x); obAdded++; } }
fs.writeFileSync(obFile, JSON.stringify(ob, null, 2), 'utf8');
console.log('Obligations: +' + obAdded + ' = ' + ob.sections.length);

const crpFile = 'law/criminal-procedure/criminal-procedure.json';
const crp = JSON.parse(fs.readFileSync(crpFile, 'utf8'));
const crpNew = [
  { id:'crp-127-crp', section:'127', chapter:9, chapter_title:'การสอบสวน', title:'แจ้งความเท็จ — ผู้แจ้งรับผิดทางอาญา', text:'ถ้าคำร้องทุกข์หรือคำกล่าวโทษเป็นเท็จ → ผู้แจ้งมีความผิดตาม ป.อ. ม.172 หรือ ม.173\nพนักงานสอบสวนจะแจ้งให้ผู้ร้องทุกข์ทราบว่าการแจ้งเท็จมีความผิด', summary:'แจ้งเท็จ: ผู้แจ้งความเท็จมีความผิดตาม ป.อ. ม.172(≤2ปี) ส.ส.ต้องแจ้งเตือนผู้ร้องก่อน', keywords:['แจ้งเท็จ','ผู้ร้อง','ม.172'], dika:[] },
  { id:'crp-234', section:'234', chapter:16, chapter_title:'พยานบุคคล', title:'พยานที่ไม่ต้องมาศาล — ป่วย/ไม่สามารถมาได้ → ส่งบันทึกแทน', text:'ในกรณีที่พยานไม่สามารถมาเบิกความต่อศาลได้ เพราะเหตุป่วย ทุพพลภาพ หรืออยู่ต่างประเทศ → ศาลอาจรับบันทึกคำเบิกความแทนการมาศาลก็ได้', summary:'พยานมาไม่ได้: ป่วย/พิการ/อยู่ต่างประเทศ→ส่งบันทึกคำเบิกความ/วิดีโอแทนได้ ศาลอนุญาต', keywords:['พยานมาไม่ได้','บันทึก','ป่วย','ต่างประเทศ'], dika:[] },
];

const crpExisting = new Set(crp.sections.map(x => x.section));
let crpAdded = 0;
for (const x of crpNew) { if (!crpExisting.has(x.section)) { crp.sections.push(x); crpAdded++; } }
fs.writeFileSync(crpFile, JSON.stringify(crp, null, 2), 'utf8');
console.log('Criminal Procedure: +' + crpAdded + ' = ' + crp.sections.length);

console.log('\nTotal added: ' + (crAdded + obAdded + crpAdded));
