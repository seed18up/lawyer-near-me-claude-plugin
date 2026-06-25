const fs = require('fs');

// === ป.พ.พ. obligations round 27 — กระจายเพิ่ม ===
const obFile = 'law/ppc/obligations/obligations.json';
const ob = JSON.parse(fs.readFileSync(obFile, 'utf8'));
const obNew = [
  { id:'ppc-25', section:'25', chapter:2, chapter_title:'บุคคลธรรมดา — ความสามารถ', title:'ผู้เยาว์ทำพินัยกรรมเมื่ออายุ 15 ปี — ทำได้โดยไม่ต้องยินยอม', text:'ผู้เยาว์อาจทำพินัยกรรมได้เมื่อมีอายุสิบห้าปีบริบูรณ์', summary:'ผู้เยาว์ทำพินัยกรรม: อายุ ≥15 ปี ทำได้โดยไม่ต้องยินยอมผู้แทน ≠ นิติกรรมอื่น(ต้องยินยอม/20ปี)', keywords:['พินัยกรรม','ผู้เยาว์','15 ปี','ไม่ต้องยินยอม'], dika:[] },
  { id:'ppc-71', section:'71', chapter:2, chapter_title:'นิติบุคคล', title:'นิติบุคคลมีสิทธิฟ้องร้องและถูกฟ้อง — เป็นคู่ความได้', text:'นิติบุคคลจะเป็นคู่ความในคดีฟ้องร้องหรือถูกฟ้องได้ โดยผู้แทนของนิติบุคคลเป็นผู้ดำเนินคดี', summary:'นิติบุคคลฟ้อง/ถูกฟ้อง: เป็นคู่ความได้ ผู้แทน(กรรมการ)ดำเนินคดีแทน เช่น บริษัทฟ้องลูกค้า', keywords:['นิติบุคคล','ฟ้องร้อง','คู่ความ','ผู้แทน'], dika:[] },
  { id:'ppc-193-13', section:'193/13', chapter:6, chapter_title:'อายุความ', title:'อายุความเริ่มนับ — สิทธิเรียกร้องที่มีเงื่อนไข → เมื่อเงื่อนไขสำเร็จ', text:'สิทธิเรียกร้องที่มีเงื่อนไขบังคับก่อน → อายุความเริ่มนับตั้งแต่เงื่อนไขนั้นสำเร็จ', summary:'อายุความเงื่อนไข: มีเงื่อนไขบังคับก่อน→เริ่มนับเมื่อเงื่อนไขสำเร็จ ≠ ม.193/12(ไม่มีเงื่อนไข=เริ่มทันที)', keywords:['อายุความ','เงื่อนไข','สำเร็จ','เริ่มนับ'], dika:[] },
  { id:'ppc-289', section:'289', chapter:7, chapter_title:'หนี้ — บุริมสิทธิ', title:'บุริมสิทธิ — ผู้ทรงบุริมสิทธิเรียกให้ขายทอดตลาดได้', text:'ผู้ทรงบุริมสิทธิพิเศษเหนือสังหาริมทรัพย์ → มีสิทธิเรียกให้ขายทอดตลาดทรัพย์สินนั้น เพื่อเอาเงินมาชำระหนี้ของตน', summary:'บังคับบุริมสิทธิ: ขายทอดตลาดทรัพย์ที่เป็นหลักแห่งบุริมสิทธิ→เอาเงินมาชำระหนี้ คล้ายบังคับจำนำ', keywords:['บุริมสิทธิ','ขายทอดตลาด','บังคับ'], dika:[] },
  { id:'ppc-418', section:'418', chapter:13, chapter_title:'ลาภมิควรได้', title:'ลาภมิควรได้ — ลูกหนี้ชำระหนี้ขาดอายุความ → เรียกคืนไม่ได้', text:'ถ้าบุคคลใดได้กระทำการชำระหนี้ซึ่งขาดอายุความแล้ว → จะเรียกทรัพย์คืนไม่ได้ แม้จะไม่รู้ว่าสิทธิเรียกร้องนั้นขาดอายุความ', summary:'ชำระหนี้ขาดอายุความ: จ่ายไปแล้ว→เรียกคืนไม่ได้ แม้ไม่รู้ว่าขาดอายุความ เพราะถือว่าชำระหนี้ธรรมชาติ', keywords:['ขาดอายุความ','เรียกคืนไม่ได้','หนี้ธรรมชาติ'], dika:[] },
];

const obExisting = new Set(ob.sections.map(x => x.section));
let obAdded = 0;
for (const x of obNew) { if (!obExisting.has(x.section)) { ob.sections.push(x); obAdded++; } }
fs.writeFileSync(obFile, JSON.stringify(ob, null, 2), 'utf8');
console.log('Obligations: +' + obAdded + ' = ' + ob.sections.length);

// === วิ.แพ่ง + วิ.อาญา ===
const cvpFile = 'law/civil-procedure/civil-procedure.json';
const cvp = JSON.parse(fs.readFileSync(cvpFile, 'utf8'));
const cvpNew = [
  { id:'cvp-34', section:'34', chapter:1, chapter_title:'อำนาจและหน้าที่ของศาล', title:'ศาลทำกระบวนพิจารณานอกศาล — ไปดูสถานที่/ตรวจพยาน ณ ที่เกิดเหตุ', text:'เมื่อมีความจำเป็น → ศาลจะทำกระบวนพิจารณานอกศาล ณ สถานที่ใดก็ได้', summary:'พิจารณานอกศาล: ศาลไปดูสถานที่เกิดเหตุ/ตรวจพยานวัตถุ ณ ที่จริงได้ เช่น ไปดูที่ดินพิพาท', keywords:['นอกศาล','สถานที่เกิดเหตุ','ตรวจพยาน'], dika:[] },
  { id:'cvp-356', section:'356', chapter:11, chapter_title:'การบังคับคดี', title:'บังคับคดีกรณีให้กระทำการ — ลูกหนี้ไม่ทำ → จ้างคนอื่นทำแทน', text:'ถ้าคำพิพากษาบังคับให้ลูกหนี้กระทำการใด แล้วลูกหนี้ไม่ทำ → เจ้าหนี้จะขอให้ศาลอนุญาตให้บุคคลอื่นทำแทนโดยลูกหนี้เสียค่าใช้จ่ายก็ได้', summary:'บังคับให้ทำ: ลูกหนี้ไม่ทำ→จ้างคนอื่นทำแทน(ลูกหนี้จ่าย) หรือ ปรับจนกว่าจะทำ', keywords:['บังคับกระทำ','จ้างคนอื่น','ค่าใช้จ่าย'], dika:[] },
];

const cvpExisting = new Set(cvp.sections.map(x => x.section));
let cvpAdded = 0;
for (const x of cvpNew) { if (!cvpExisting.has(x.section)) { cvp.sections.push(x); cvpAdded++; } }
fs.writeFileSync(cvpFile, JSON.stringify(cvp, null, 2), 'utf8');
console.log('Civil Procedure: +' + cvpAdded + ' = ' + cvp.sections.length);

const crpFile = 'law/criminal-procedure/criminal-procedure.json';
const crp = JSON.parse(fs.readFileSync(crpFile, 'utf8'));
const crpNew = [
  { id:'crp-75', section:'75', chapter:5, chapter_title:'หมายอาญา', title:'หมายขัง/หมายจำคุก — ศาลออกเมื่อสั่งขังหรือพิพากษาจำคุก', text:'หมายขัง → ศาลออกเมื่อสั่งให้ขังผู้ต้องหาหรือจำเลย\nหมายจำคุก → ศาลออกเมื่อพิพากษาให้ลงโทษจำคุก\nหมายปล่อย → ศาลออกเมื่อสั่งปล่อยตัว', summary:'หมาย 3 ชนิด: ขัง(ระหว่างพิจารณา) จำคุก(หลังพิพากษา) ปล่อย(ยกฟ้อง/พ้นโทษ)', keywords:['หมายขัง','หมายจำคุก','หมายปล่อย'], dika:[] },
  { id:'crp-255', section:'255', chapter:17, chapter_title:'ค่าธรรมเนียม', title:'ค่าธรรมเนียมคดีอาญา — จำเลยไม่ต้องเสียค่าธรรมเนียม', text:'จำเลยในคดีอาญา → ไม่ต้องเสียค่าธรรมเนียมศาล ทั้งในชั้นต้น อุทธรณ์ และฎีกา', summary:'จำเลยไม่เสียค่าธรรมเนียม: คดีอาญาทั้งโจทก์+จำเลยฟรี ≠ คดีแพ่ง(ฝ่ายแพ้จ่าย ม.161)', keywords:['จำเลย','ค่าธรรมเนียม','ฟรี','คดีอาญา'], dika:[] },
];

const crpExisting = new Set(crp.sections.map(x => x.section));
let crpAdded = 0;
for (const x of crpNew) { if (!crpExisting.has(x.section)) { crp.sections.push(x); crpAdded++; } }
fs.writeFileSync(crpFile, JSON.stringify(crp, null, 2), 'utf8');
console.log('Criminal Procedure: +' + crpAdded + ' = ' + crp.sections.length);

console.log('\nTotal added: ' + (obAdded + cvpAdded + crpAdded));
