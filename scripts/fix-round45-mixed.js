const fs = require('fs');

// === ป.อ. round 26 ===
const crFile = 'law/criminal/criminal.json';
const cr = JSON.parse(fs.readFileSync(crFile, 'utf8'));
const crNew = [
  { id:'crim-135-3', section:'135/3', chapter:11, chapter_title:'ความผิดเกี่ยวกับการก่อการร้าย', title:'ขู่ว่าจะก่อการร้าย — จำคุก 2-7 ปี', text:'ผู้ใดขู่ว่าจะกระทำการก่อการร้าย โดยมีพฤติการณ์อันควรเชื่อว่าจะกระทำจริง → จำคุก 2-7 ปี + ปรับ 40,000-140,000', summary:'ขู่ก่อการร้าย: ขู่ว่าจะวางระเบิด/ทำร้ายคนจำนวนมาก→2-7ปี แม้ไม่ได้ทำจริง', keywords:['ขู่ก่อการร้าย','วางระเบิด','พฤติการณ์'], dika:[] },
  { id:'crim-135-4', section:'135/4', chapter:11, chapter_title:'ความผิดเกี่ยวกับการก่อการร้าย', title:'สมคบเพื่อก่อการร้าย — จำคุก 2-10 ปี', text:'ผู้ใดสมคบกันตั้งแต่สองคนขึ้นไปเพื่อกระทำความผิดฐานก่อการร้าย → จำคุก 2-10 ปี + ปรับ 40,000-200,000', summary:'สมคบก่อการร้าย: ≥2คนตกลงก่อการร้าย→2-10ปี ≠ สมคบทั่วไป(ม.211=≤5ปี)', keywords:['สมคบ','ก่อการร้าย','2 คน'], dika:[] },
  { id:'crim-208', section:'208', chapter:14, chapter_title:'ความผิดเกี่ยวกับศาสนา', title:'ดูหมิ่นผู้สอนศาสนา — จำคุก ≤ 1 ปี', text:'ผู้ใดดูหมิ่นพระภิกษุ สามเณร นักพรต นักบวช หรือผู้สอนในศาสนาใด ในขณะปฏิบัติศาสนกิจ → จำคุก ≤ 1 ปี + ปรับ ≤ 20,000', summary:'ดูหมิ่นนักบวช: ดูหมิ่นพระ/บาทหลวง/อิหม่ามขณะปฏิบัติศาสนกิจ→≤1ปี', keywords:['ดูหมิ่น','พระภิกษุ','นักบวช','ศาสนกิจ'], dika:[] },
  { id:'crim-387', section:'387', chapter:24, chapter_title:'ลหุโทษ', title:'ไม่ปฏิบัติตามข้อบังคับเรื่องสุขภาพ — ปรับ ≤ 1,000', text:'ผู้ใดไม่ปฏิบัติตามข้อบังคับ ระเบียบ หรือคำสั่งของเจ้าพนักงาน ซึ่งสั่งการเพื่อป้องกันโรคติดต่อ → ปรับ ≤ 1,000', summary:'ไม่ปฏิบัติตามป้องกันโรค: ฝ่าฝืนคำสั่งป้องกันโรคระบาด→ปรับ≤1,000 ลหุโทษ', keywords:['โรคติดต่อ','ป้องกันโรค','คำสั่ง','ลหุโทษ'], dika:[] },
  { id:'crim-396', section:'396', chapter:24, chapter_title:'ลหุโทษ', title:'ยักยอกเล็กน้อย — ราคาไม่เกิน 1,000 บาท ปรับ ≤ 10,000', text:'ผู้ใดกระทำความผิดฐานยักยอก แต่ทรัพย์สินมีราคาไม่เกินหนึ่งพันบาท → ปรับ ≤ 10,000', summary:'ยักยอกเล็กน้อย: ราคา≤1,000→ปรับ≤10,000 ลหุโทษ ≠ ม.352(เกิน=≤3ปี จำคุก)', keywords:['ยักยอก','ราคาน้อย','1,000 บาท','ลหุโทษ'], dika:[] },
];

const crExisting = new Set(cr.sections.map(x => x.section));
let crAdded = 0;
for (const x of crNew) { if (!crExisting.has(x.section)) { cr.sections.push(x); crAdded++; } }
fs.writeFileSync(crFile, JSON.stringify(cr, null, 2), 'utf8');
console.log('Criminal: +' + crAdded + ' = ' + cr.sections.length);

// === ป.พ.พ. round 18 + วิ.แพ่ง + วิ.อาญา ===
const obFile = 'law/ppc/obligations/obligations.json';
const ob = JSON.parse(fs.readFileSync(obFile, 'utf8'));
const obNew = [
  { id:'ppc-37', section:'37', chapter:2, chapter_title:'บุคคลธรรมดา — ภูมิลำเนา', title:'ภูมิลำเนาบุคคลธรรมดา — ที่อยู่เป็นหลักแหล่งสำคัญ', text:'ภูมิลำเนาของบุคคลธรรมดา ได้แก่ถิ่นอันบุคคลนั้นมีสถานที่อยู่เป็นแหล่งสำคัญ', summary:'ภูมิลำเนา: ถิ่นที่มีสถานที่อยู่เป็นหลัก สำคัญในการฟ้อง(ฟ้องที่ศาลที่จำเลยมีภูมิลำเนา)', keywords:['ภูมิลำเนา','สถานที่อยู่','หลักแหล่ง'], dika:[] },
  { id:'ppc-39', section:'39', chapter:2, chapter_title:'บุคคลธรรมดา — ภูมิลำเนา', title:'ภูมิลำเนาไม่ปรากฏ — ถือถิ่นที่อยู่เป็นภูมิลำเนา', text:'ถ้าภูมิลำเนาไม่ปรากฏ ให้ถือว่าถิ่นที่อยู่เป็นภูมิลำเนา', summary:'ไม่ปรากฏภูมิลำเนา: ใช้ถิ่นที่อยู่แทน เช่น คนไร้บ้าน=ที่พบตัว(ม.40)', keywords:['ภูมิลำเนาไม่ปรากฏ','ถิ่นที่อยู่'], dika:[] },
  { id:'ppc-44', section:'44', chapter:2, chapter_title:'บุคคลธรรมดา — ภูมิลำเนา', title:'ภูมิลำเนาผู้เยาว์ — ตามภูมิลำเนาผู้แทนโดยชอบธรรม', text:'ภูมิลำเนาของผู้เยาว์ ได้แก่ ภูมิลำเนาของผู้แทนโดยชอบธรรมซึ่งเป็นผู้ใช้อำนาจปกครองหรือผู้ปกครอง', summary:'ภูมิลำเนาผู้เยาว์: ตามพ่อแม่/ผู้ปกครอง ถ้าพ่อแม่แยกกัน→ตามคนที่อยู่ด้วย', keywords:['ภูมิลำเนาผู้เยาว์','ผู้แทน','อำนาจปกครอง'], dika:[] },
];

const obExisting = new Set(ob.sections.map(x => x.section));
let obAdded = 0;
for (const x of obNew) { if (!obExisting.has(x.section)) { ob.sections.push(x); obAdded++; } }
fs.writeFileSync(obFile, JSON.stringify(ob, null, 2), 'utf8');
console.log('Obligations: +' + obAdded + ' = ' + ob.sections.length);

const crpFile = 'law/criminal-procedure/criminal-procedure.json';
const crp = JSON.parse(fs.readFileSync(crpFile, 'utf8'));
const crpNew = [
  { id:'crp-116', section:'116', chapter:8, chapter_title:'ปล่อยชั่วคราว', title:'ผิดสัญญาประกัน — ศาลบังคับตามสัญญา ริบเงินประกัน', text:'ผู้ประกันผิดสัญญา → ศาลมีอำนาจสั่งบังคับตามสัญญาประกัน ริบเงินประกัน หรือบังคับเอาแก่ทรัพย์สินของผู้ประกัน', summary:'ผิดสัญญาประกัน: จำเลยหนี→ริบเงินประกัน/บังคับทรัพย์ผู้ค้ำ ผู้ค้ำขอลดได้ถ้ามีเหตุสมควร', keywords:['ผิดสัญญาประกัน','ริบเงิน','ผู้ค้ำ'], dika:[] },
  { id:'crp-241', section:'241', chapter:16, chapter_title:'พยานหลักฐาน', title:'พยานวัตถุ — ของกลาง/วัตถุพยานต้องนำมาแสดงต่อศาล', text:'พยานวัตถุ คือ วัตถุหรือสิ่งของที่ใช้เป็นพยานหลักฐาน → ต้องนำมาแสดงต่อศาล\nถ้านำมาไม่ได้ → ศาลจะไปตรวจ ณ ที่นั้น หรือใช้ภาพถ่าย/แผนที่/แผนผังแทนก็ได้', summary:'พยานวัตถุ: ของกลาง/อาวุธ/ยาเสพติด ต้องนำมาแสดง นำไม่ได้→ศาลไปดู/ใช้ภาพถ่ายแทน', keywords:['พยานวัตถุ','ของกลาง','นำมาแสดง'], dika:[] },
];

const crpExisting = new Set(crp.sections.map(x => x.section));
let crpAdded = 0;
for (const x of crpNew) { if (!crpExisting.has(x.section)) { crp.sections.push(x); crpAdded++; } }
fs.writeFileSync(crpFile, JSON.stringify(crp, null, 2), 'utf8');
console.log('Criminal Procedure: +' + crpAdded + ' = ' + crp.sections.length);

console.log('\nTotal added: ' + (crAdded + obAdded + crpAdded));
