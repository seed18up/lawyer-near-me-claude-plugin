const fs = require('fs');

// === ป.อ. round 31 ===
const crFile = 'law/criminal/criminal.json';
const cr = JSON.parse(fs.readFileSync(crFile, 'utf8'));
const crNew = [
  { id:'crim-127', section:'127', chapter:10, chapter_title:'ความผิดเกี่ยวกับความมั่นคง', title:'ทำลายเส้นทางคมนาคมเพื่อช่วยข้าศึก — จำคุก 5-15 ปี', text:'ผู้ใดทำลาย ทำให้เสียหาย ซึ่งถนน สะพาน ทางรถไฟ ท่อน้ำ การสื่อสาร เพื่อช่วยข้าศึก → จำคุก 5-15 ปี\nในเวลาสงคราม → ประหาร/ตลอดชีวิต', summary:'ทำลายคมนาคมช่วยข้าศึก: ทำลายถนน/สะพาน/รถไฟ→5-15ปี สงคราม=ประหาร', keywords:['ทำลายคมนาคม','ข้าศึก','สะพาน','รถไฟ'], dika:[] },
  { id:'crim-129', section:'129', chapter:10, chapter_title:'ความผิดเกี่ยวกับความมั่นคง', title:'กระทำอันตรายต่อทหารไทย — ทำร้าย/ขัดขวางทหาร → จำคุก 5-15 ปี', text:'ผู้ใดกระทำการอันเป็นอันตรายต่อทหาร ตำรวจ หรือเจ้าหน้าที่ซึ่งปฏิบัติหน้าที่ป้องกันประเทศ → จำคุก 5-15 ปี', summary:'อันตรายต่อทหาร: ทำร้าย/ขัดขวางทหาร-ตำรวจที่ป้องกันประเทศ→5-15ปี สงคราม=หนักขึ้น', keywords:['อันตรายต่อทหาร','ขัดขวาง','ป้องกันประเทศ'], dika:[] },
  { id:'crim-162', section:'162', chapter:12, chapter_title:'ความผิดต่อตำแหน่งหน้าที่ราชการ', title:'เจ้าพนักงานจำคุกผิดกฎหมาย — กักขังโดยมิชอบ → จำคุก ≤ 7 ปี', text:'ผู้ใดเป็นเจ้าพนักงาน รับหรือกักขังบุคคลใดโดยไม่มีอำนาจ หรือโดยวิธีอันมิชอบด้วยกฎหมาย → จำคุก ≤ 7 ปี + ปรับ ≤ 140,000', summary:'จำคุกผิดกฎหมาย: จ.พง.กักขังคนโดยไม่มีอำนาจ→≤7ปี เช่น ตำรวจขังโดยไม่มีหมาย/เกินกำหนด', keywords:['จำคุกผิดกฎหมาย','กักขังมิชอบ','ไม่มีอำนาจ'], dika:[] },
  { id:'crim-214', section:'214', chapter:15, chapter_title:'ความผิดเกี่ยวกับความสงบสุข', title:'ชุมนุมทำร้ายคน/ทำลายทรัพย์ — จำคุก ≤ 5 ปี', text:'ผู้ใดเมื่อมั่วสุมกันแล้ว ร่วมกันทำร้ายผู้อื่น ทำให้ทรัพย์สินเสียหาย → จำคุก ≤ 5 ปี + ปรับ ≤ 100,000', summary:'ชุมนุมทำร้าย/ทำลาย: มั่วสุมแล้วทำร้ายคน/ทำลายของ→≤5ปี หนักกว่ามั่วสุมธรรมดา(ม.215=≤6เดือน)', keywords:['ชุมนุม','ทำร้าย','ทำลายทรัพย์'], dika:[] },
  { id:'crim-269-4', section:'269/4', chapter:17, chapter_title:'ความผิดเกี่ยวกับบัตรอิเล็กทรอนิกส์', title:'ใช้บัตรอิเล็กทรอนิกส์ของผู้อื่น — จำคุก 1-5 ปี', text:'ผู้ใดใช้บัตรอิเล็กทรอนิกส์ของผู้อื่นโดยมิชอบ ในประการที่น่าจะก่อให้เกิดความเสียหายแก่ผู้อื่น → จำคุก 1-5 ปี + ปรับ 20,000-100,000', summary:'ใช้บัตรคนอื่น: ใช้บัตรเครดิต/ATM ของคนอื่นโดยไม่ได้รับอนุญาต→1-5ปี', keywords:['ใช้บัตรคนอื่น','บัตรเครดิต','ATM','มิชอบ'], dika:[] },
];

const crExisting = new Set(cr.sections.map(x => x.section));
let crAdded = 0;
for (const x of crNew) { if (!crExisting.has(x.section)) { cr.sections.push(x); crAdded++; } }
fs.writeFileSync(crFile, JSON.stringify(cr, null, 2), 'utf8');
console.log('Criminal: +' + crAdded + ' = ' + cr.sections.length);

// === ป.พ.พ. round 25 + วิ.แพ่ง + วิ.อาญา ===
const obFile = 'law/ppc/obligations/obligations.json';
const ob = JSON.parse(fs.readFileSync(obFile, 'utf8'));
const obNew = [
  { id:'ppc-38', section:'38', chapter:2, chapter_title:'บุคคลธรรมดา — ภูมิลำเนา', title:'มีที่อยู่หลายแห่ง — ถือแห่งใดแห่งหนึ่งเป็นภูมิลำเนา', text:'ถ้าบุคคลธรรมดามีถิ่นที่อยู่หลายแห่ง ซึ่งอยู่สับเปลี่ยนกันไป หรือมีหลักแหล่งที่ทำการงานเป็นปกติหลายแห่ง → ให้ถือเอาแห่งใดแห่งหนึ่งเป็นภูมิลำเนา', summary:'มีที่อยู่หลายแห่ง: อยู่สลับกัน→ถือแห่งไหนก็ได้ เช่น มีบ้านกรุงเทพ+เชียงใหม่ ฟ้องที่ไหนก็ได้', keywords:['หลายแห่ง','สับเปลี่ยน','ภูมิลำเนา'], dika:[] },
  { id:'ppc-193-21', section:'193/21', chapter:6, chapter_title:'อายุความ', title:'อายุความหยุดระหว่างจัดการมรดก', text:'ถ้าสิทธิเรียกร้องเกี่ยวกับกองมรดก → อายุความไม่ครบบริบูรณ์จนกว่าจะพ้นกำหนดหนึ่งปีนับแต่วันที่ได้ตั้งผู้จัดการมรดก หรือวันที่ทายาทได้รับทรัพย์มรดก', summary:'อายุความมรดก: หยุดระหว่างจัดการมรดก ยืดอีก 1 ปีหลังตั้ง ผจม./รับมรดก', keywords:['อายุความมรดก','ผู้จัดการมรดก','1 ปี'], dika:[] },
];

const obExisting = new Set(ob.sections.map(x => x.section));
let obAdded = 0;
for (const x of obNew) { if (!obExisting.has(x.section)) { ob.sections.push(x); obAdded++; } }
fs.writeFileSync(obFile, JSON.stringify(ob, null, 2), 'utf8');
console.log('Obligations: +' + obAdded + ' = ' + ob.sections.length);

const cvpFile = 'law/civil-procedure/civil-procedure.json';
const cvp = JSON.parse(fs.readFileSync(cvpFile, 'utf8'));
const cvpNew = [
  { id:'cvp-181', section:'181', chapter:7, chapter_title:'วิธีพิจารณาสามัญ', title:'ศาลสั่งงดสืบพยาน — ข้อเท็จจริงพอวินิจฉัยได้', text:'ถ้าศาลเห็นว่าข้อเท็จจริงที่คู่ความกล่าวอ้างพอฟังได้แล้ว → ศาลจะสั่งงดสืบพยาน แล้วพิพากษาไปตามที่เห็นสมควรก็ได้', summary:'งดสืบพยาน: ข้อเท็จจริงพอแล้ว→ศาลงดสืบ+พิพากษาได้ ประหยัดเวลา คู่ความคัดค้านได้', keywords:['งดสืบพยาน','พอวินิจฉัย','ประหยัดเวลา'], dika:[] },
];

const cvpExisting = new Set(cvp.sections.map(x => x.section));
let cvpAdded = 0;
for (const x of cvpNew) { if (!cvpExisting.has(x.section)) { cvp.sections.push(x); cvpAdded++; } }
fs.writeFileSync(cvpFile, JSON.stringify(cvp, null, 2), 'utf8');
console.log('Civil Procedure: +' + cvpAdded + ' = ' + cvp.sections.length);

const crpFile = 'law/criminal-procedure/criminal-procedure.json';
const crp = JSON.parse(fs.readFileSync(crpFile, 'utf8'));
const crpNew = [
  { id:'crp-36-crp', section:'36/1', chapter:4, chapter_title:'การฟ้องคดีอาญา', title:'ผู้เสียหายตาย — ทายาทฟ้องแทนได้', text:'ในกรณีที่ผู้เสียหายถึงแก่ความตายก่อนร้องทุกข์หรือก่อนฟ้องคดี → คู่สมรส ผู้บุพการี หรือผู้สืบสันดาน ร้องทุกข์หรือฟ้องคดีแทนได้', summary:'ผู้เสียหายตาย: ทายาท(คู่สมรส/พ่อแม่/ลูก)ร้องทุกข์/ฟ้องแทนได้ สิทธิฟ้องไม่ระงับเพราะผู้เสียหายตาย', keywords:['ผู้เสียหายตาย','ทายาท','ฟ้องแทน'], dika:[] },
  { id:'crp-176-crp2', section:'176/1', chapter:12, chapter_title:'การพิจารณา', title:'ส่งตัวจำเลยไปศาลทางวิดีโอ — พิจารณาผ่านจอภาพ', text:'ในการพิจารณา ศาลอาจอนุญาตให้จำเลยหรือพยานอยู่ในสถานที่อื่น โดยใช้ระบบการประชุมทางจอภาพก็ได้', summary:'พิจารณาทางวิดีโอ: จำเลย/พยานไม่ต้องมาศาล ใช้วิดีโอคอนเฟอเรนซ์ได้ ศาลอนุญาต', keywords:['วิดีโอ','จอภาพ','ไม่ต้องมาศาล','ทางไกล'], dika:[] },
];

const crpExisting = new Set(crp.sections.map(x => x.section));
let crpAdded = 0;
for (const x of crpNew) { if (!crpExisting.has(x.section)) { crp.sections.push(x); crpAdded++; } }
fs.writeFileSync(crpFile, JSON.stringify(crp, null, 2), 'utf8');
console.log('Criminal Procedure: +' + crpAdded + ' = ' + crp.sections.length);

console.log('\nTotal added: ' + (crAdded + obAdded + cvpAdded + crpAdded));
