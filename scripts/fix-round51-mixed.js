const fs = require('fs');

// === วิ.แพ่ง round 15 + วิ.อาญา round 15 + ป.พ.พ. round 24 ===
const cvpFile = 'law/civil-procedure/civil-procedure.json';
const cvp = JSON.parse(fs.readFileSync(cvpFile, 'utf8'));
const cvpNew = [
  { id:'cvp-30', section:'30', chapter:1, chapter_title:'อำนาจและหน้าที่ของศาล', title:'ศาลสั่งให้แก้ไขข้อบกพร่อง — คำฟ้องไม่สมบูรณ์ → สั่งแก้ได้', text:'ถ้าคำฟ้อง คำคู่ความ หรือเอกสารอื่นใด บกพร่องในเรื่องแบบ → ศาลจะสั่งให้คู่ความแก้ไขข้อบกพร่องภายในเวลาที่กำหนดก็ได้', summary:'สั่งแก้ไขข้อบกพร่อง: ฟ้องผิดแบบ→ศาลสั่งแก้ได้ ไม่ต้องยกฟ้องทันที เช่น ลืมลงชื่อ/ขาดเอกสาร', keywords:['แก้ไขข้อบกพร่อง','คำฟ้อง','แบบ'], dika:[] },
  { id:'cvp-164', section:'164', chapter:6, chapter_title:'ค่าธรรมเนียม', title:'ค่าทนายความ — ศาลกำหนดตามอัตรา', text:'ค่าทนายความที่ศาลกำหนดให้ฝ่ายแพ้จ่าย → ตามอัตราที่กำหนดในตาราง\nค่าทนายความที่ศาลกำหนด ≠ ค่าจ้างจริงที่จ่ายทนาย', summary:'ค่าทนาย: ศาลกำหนดตามตาราง(ไม่ใช่ค่าจ้างจริง) มักน้อยกว่าจ่ายจริง ฝ่ายแพ้จ่าย(ม.161)', keywords:['ค่าทนายความ','ตาราง','ฝ่ายแพ้'], dika:[] },
  { id:'cvp-214', section:'214', chapter:7, chapter_title:'อนุญาโตตุลาการ', title:'อนุญาโตตุลาการ — คู่สัญญาตกลงให้บุคคลภายนอกชี้ขาด', text:'คู่ความในคดีจะตกลงกันให้บุคคลภายนอกเป็นอนุญาโตตุลาการ ชี้ขาดข้อพิพาทที่เกิดขึ้นแล้วก็ได้\nคำชี้ขาดของอนุญาโตตุลาการ → ศาลจะพิพากษาตามนั้น', summary:'อนุญาโตตุลาการ: คู่ความตกลงให้คนกลางตัดสิน→ศาลพิพากษาตาม ≠ ไกล่เกลี่ย(ตกลงกันเอง)', keywords:['อนุญาโตตุลาการ','ชี้ขาด','บุคคลภายนอก'], dika:[] },
];

const cvpExisting = new Set(cvp.sections.map(x => x.section));
let cvpAdded = 0;
for (const x of cvpNew) { if (!cvpExisting.has(x.section)) { cvp.sections.push(x); cvpAdded++; } }
fs.writeFileSync(cvpFile, JSON.stringify(cvp, null, 2), 'utf8');
console.log('Civil Procedure: +' + cvpAdded + ' = ' + cvp.sections.length);

const crpFile = 'law/criminal-procedure/criminal-procedure.json';
const crp = JSON.parse(fs.readFileSync(crpFile, 'utf8'));
const crpNew = [
  { id:'crp-33', section:'33', chapter:4, chapter_title:'การฟ้องคดีอาญา', title:'ห้ามฟ้องอาญาซ้ำ — ฟ้องข้อหาเดียวกัน คนเดียวกัน', text:'ห้ามมิให้ฟ้องบุคคลเดียวกันในเรื่องเดียวกัน อันได้ฟ้องและศาลได้พิพากษาเสร็จเด็ดขาดแล้ว', summary:'ห้ามฟ้องซ้ำอาญา: คดีถึงที่สุดแล้ว→ฟ้องซ้ำไม่ได้ (Double Jeopardy) ≠ ม.170 วิ.แพ่ง(Res Judicata)', keywords:['ห้ามฟ้องซ้ำ','Double Jeopardy','เด็ดขาด'], dika:[] },
  { id:'crp-210', section:'210', chapter:14, chapter_title:'อุทธรณ์', title:'ห้ามอุทธรณ์คดีที่จำเลยรับสารภาพ — เว้นแต่ข้อกฎหมาย', text:'ในคดีที่จำเลยให้การรับสารภาพตามฟ้อง → ห้ามอุทธรณ์ในปัญหาข้อเท็จจริง\nอุทธรณ์ได้เฉพาะปัญหาข้อกฎหมาย หรือเรื่องกำหนดโทษ', summary:'รับสารภาพห้ามอุทธรณ์: จำเลยรับแล้ว→อุทธรณ์ข้อเท็จจริงไม่ได้ เฉพาะข้อกฎหมาย/กำหนดโทษ', keywords:['รับสารภาพ','ห้ามอุทธรณ์','ข้อเท็จจริง'], dika:[] },
  { id:'crp-245', section:'245', chapter:17, chapter_title:'การบังคับตามคำพิพากษา', title:'บังคับคดีอาญา — จำคุก/ปรับ/ริบทรัพย์ ตามคำพิพากษา', text:'ให้บังคับคดีอาญาดังนี้:\n(1) ประหารชีวิต → ฉีดยา\n(2) จำคุก → ขังในเรือนจำ\n(3) กักขัง → กักขังในสถานที่กำหนด\n(4) ปรับ → ชำระเงิน ไม่ชำระ → กักขังแทน\n(5) ริบทรัพย์สิน → ยึดทรัพย์', summary:'บังคับคดีอาญา: ประหาร(ฉีดยา)/จำคุก(เรือนจำ)/กักขัง/ปรับ(ไม่จ่าย=กักขังแทน)/ริบทรัพย์', keywords:['บังคับคดีอาญา','ประหาร','จำคุก','ปรับ','ริบ'], dika:[] },
];

const crpExisting = new Set(crp.sections.map(x => x.section));
let crpAdded = 0;
for (const x of crpNew) { if (!crpExisting.has(x.section)) { crp.sections.push(x); crpAdded++; } }
fs.writeFileSync(crpFile, JSON.stringify(crp, null, 2), 'utf8');
console.log('Criminal Procedure: +' + crpAdded + ' = ' + crp.sections.length);

const obFile = 'law/ppc/obligations/obligations.json';
const ob = JSON.parse(fs.readFileSync(obFile, 'utf8'));
const obNew = [
  { id:'ppc-107', section:'107', chapter:2, chapter_title:'นิติบุคคล — สมาคม', title:'สมาคมเลิก — ให้ชำระบัญชี ทรัพย์สินที่เหลือตกแก่สมาคมอื่น', text:'เมื่อสมาคมเลิก → ให้มีการชำระบัญชี\nทรัพย์สินที่เหลือ → ให้ตกเป็นของสมาคมหรือมูลนิธิที่มีวัตถุประสงค์ใกล้เคียง ถ้าไม่มี → ตกเป็นของแผ่นดิน', summary:'สมาคมเลิก+ชำระบัญชี: ทรัพย์ที่เหลือ→สมาคม/มูลนิธิคล้ายกัน ไม่มี→แผ่นดิน ≠ บริษัท(แบ่งให้ผู้ถือหุ้น)', keywords:['สมาคมเลิก','ชำระบัญชี','ทรัพย์สิน','แผ่นดิน'], dika:[] },
  { id:'ppc-193-23', section:'193/23', chapter:6, chapter_title:'อายุความ', title:'อายุความหยุดระหว่างผู้ปกครอง/ผู้อนุบาล', text:'อายุความไม่ครบบริบูรณ์ตราบเท่าที่ผู้ปกครอง ผู้อนุบาล ยังดำรงตำแหน่งอยู่ → สำหรับสิทธิเรียกร้องระหว่างผู้อยู่ในปกครองกับผู้ปกครอง', summary:'อายุความผู้ปกครอง: ไม่นับระหว่างมีตำแหน่ง คุ้มครองผู้เยาว์/คนไร้ความสามารถ', keywords:['อายุความ','ผู้ปกครอง','ผู้อนุบาล','หยุด'], dika:[] },
  { id:'ppc-336', section:'336', chapter:10, chapter_title:'หนี้ — การชำระหนี้', title:'ชำระหนี้ด้วยเช็ค — หนี้ยังไม่ระงับจนกว่าเช็คขึ้นเงินได้', text:'ถ้าชำระหนี้โดยออกตั๋วเงินหรือเช็ค → หนี้นั้นจะระงับต่อเมื่อตั๋วเงินหรือเช็คนั้นได้ขึ้นเงินแล้ว', summary:'ชำระด้วยเช็ค: หนี้ยังไม่หมดจนกว่าเช็คขึ้นเงินได้ เช็คเด้ง=หนี้ยังอยู่ ≠ ชำระเป็นเงินสด(หนี้หมดทันที)', keywords:['เช็ค','หนี้ยังไม่ระงับ','ขึ้นเงิน','เช็คเด้ง'], dika:[] },
  { id:'ppc-417', section:'417', chapter:13, chapter_title:'ลาภมิควรได้', title:'ลาภมิควรได้ — ผู้รับทุจริต ต้องคืนพร้อมดอกเบี้ย', text:'ผู้ที่ได้รับลาภมิควรได้โดยทุจริต → ต้องคืนลาภนั้นพร้อมดอกเบี้ย ตั้งแต่เวลาที่รับไว้\nถ้าได้รับโดยสุจริต → คืนเฉพาะส่วนที่ยังเหลืออยู่', summary:'ทุจริตต้องคืนหมด: รู้ว่าไม่มีสิทธิ→คืนทั้งหมด+ดอกเบี้ย สุจริต→คืนเฉพาะที่เหลือ', keywords:['ลาภมิควรได้','ทุจริต','ดอกเบี้ย','คืน'], dika:[] },
];

const obExisting = new Set(ob.sections.map(x => x.section));
let obAdded = 0;
for (const x of obNew) { if (!obExisting.has(x.section)) { ob.sections.push(x); obAdded++; } }
fs.writeFileSync(obFile, JSON.stringify(ob, null, 2), 'utf8');
console.log('Obligations: +' + obAdded + ' = ' + ob.sections.length);

console.log('\nTotal added: ' + (cvpAdded + crpAdded + obAdded));
