const fs = require('fs');

const crFile = 'law/criminal/criminal.json';
const cr = JSON.parse(fs.readFileSync(crFile, 'utf8'));
const crNew = [
  { id:'crim-242', section:'242', chapter:17, chapter_title:'ความผิดเกี่ยวกับเงินตรา', title:'นำเงินตราปลอมเข้าราชอาณาจักร — จำคุก 10-20 ปี', text:'ผู้ใดนำเข้ามาในราชอาณาจักรซึ่งเงินตราปลอม → จำคุก 10-20 ปี + ปรับ 200,000-400,000', summary:'นำเข้าเงินปลอม: โทษเท่าทำปลอม(ม.240)=10-20ปี นำแบงก์ปลอมจากต่างประเทศเข้าไทย', keywords:['นำเข้าเงินปลอม','10-20 ปี'], dika:[] },
  { id:'crim-250', section:'250', chapter:17, chapter_title:'ความผิดเกี่ยวกับดวงตรา', title:'ปลอมดวงตราต่างประเทศ — จำคุก ≤ 5 ปี', text:'ผู้ใดทำปลอมดวงตราของรัฐบาลต่างประเทศ → จำคุก ≤ 5 ปี + ปรับ ≤ 100,000', summary:'ปลอมดวงตราต่างประเทศ: ปลอมตราของรัฐต่างชาติ→≤5ปี เบากว่าปลอมตราไทย(ม.252=1-7ปี)', keywords:['ดวงตรา','ต่างประเทศ','ปลอม'], dika:[] },
  { id:'crim-254', section:'254', chapter:17, chapter_title:'ความผิดเกี่ยวกับดวงตรา', title:'ทำให้เสียหายซึ่งดวงตราราชการ — จำคุก 1-5 ปี', text:'ผู้ใดทำให้เสียหาย ทำลาย ซึ่งดวงตรา รอยตรา หรือแสตมป์ของทบวงการเมือง → จำคุก 1-5 ปี + ปรับ 20,000-100,000', summary:'ทำลายดวงตราราชการ: ทำให้เสียหาย/ทำลายตราราชการ→1-5ปี ≠ ปลอม(ม.252=1-7ปี)', keywords:['ทำลายดวงตรา','ราชการ','เสียหาย'], dika:[] },
  { id:'crim-257', section:'257', chapter:17, chapter_title:'ความผิดเกี่ยวกับดวงตรา', title:'ปลอมแสตมป์รายได้ — จำคุก 1-7 ปี', text:'ผู้ใดทำปลอมแสตมป์สำหรับเก็บภาษีอากร หรือค่าธรรมเนียม → จำคุก 1-7 ปี + ปรับ 20,000-140,000', summary:'ปลอมแสตมป์ภาษี: ปลอมแสตมป์สรรพากร/อากรแสตมป์→1-7ปี ใช้แสตมป์ปลอม=โทษเท่ากัน', keywords:['แสตมป์','ภาษี','ปลอม','อากร'], dika:[] },
  { id:'crim-258', section:'258', chapter:17, chapter_title:'ความผิดเกี่ยวกับดวงตรา', title:'ใช้แสตมป์ปลอม — โทษเท่าผู้ปลอม', text:'ผู้ใดใช้หรืออ้างดวงตรา รอยตรา แสตมป์ปลอม → ระวางโทษดังที่บัญญัติไว้สำหรับความผิดฐานปลอม', summary:'ใช้แสตมป์ปลอม: โทษเท่าผู้ปลอม ≠ ม.260(แสตมป์ใช้แล้ว=≤3ปี)', keywords:['ใช้แสตมป์ปลอม','โทษเท่าปลอม'], dika:[] },
];

const crExisting = new Set(cr.sections.map(x => x.section));
let crAdded = 0;
for (const x of crNew) { if (!crExisting.has(x.section)) { cr.sections.push(x); crAdded++; } }
fs.writeFileSync(crFile, JSON.stringify(cr, null, 2), 'utf8');
console.log('Criminal: +' + crAdded + ' = ' + cr.sections.length);

const obFile = 'law/ppc/obligations/obligations.json';
const ob = JSON.parse(fs.readFileSync(obFile, 'utf8'));
const obNew = [
  { id:'ppc-67', section:'67', chapter:2, chapter_title:'นิติบุคคล', title:'ผู้แทนนิติบุคคลหลายคน — ต้องกระทำร่วมกัน', text:'ถ้านิติบุคคลมีผู้แทนหลายคน → การกระทำของผู้แทนจะผูกพันนิติบุคคลก็ต่อเมื่อผู้แทนเหล่านั้นได้กระทำร่วมกัน เว้นแต่จะมีข้อกำหนดไว้เป็นอย่างอื่น', summary:'ผู้แทนหลายคน: ต้องทำร่วมกัน(เว้นแต่กำหนดไว้) เช่น กรรมการ2คนลงนามร่วม ≠ กรรมการคนเดียวลงนาม', keywords:['ผู้แทนหลายคน','ร่วมกัน','ลงนาม'], dika:[] },
  { id:'ppc-300', section:'300', chapter:8, chapter_title:'หนี้ — ลูกหนี้ร่วม', title:'ลูกหนี้ร่วมคนหนึ่งหลุดพ้น — คนอื่นยังรับผิด', text:'ถ้าลูกหนี้ร่วมคนหนึ่งหลุดพ้นจากหนี้โดยเหตุเฉพาะตัว → ลูกหนี้ร่วมคนอื่นยังคงรับผิดเต็มจำนวน หักส่วนของผู้ที่หลุดพ้น', summary:'ลูกหนี้ร่วมหลุดพ้น: คนหนึ่งหลุด(เช่น ขาดอายุความ)→คนอื่นยังรับผิด หักส่วนที่หลุดออก', keywords:['ลูกหนี้ร่วม','หลุดพ้น','หักส่วน'], dika:[] },
  { id:'ppc-416', section:'416', chapter:13, chapter_title:'ลาภมิควรได้', title:'ลาภมิควรได้ — ผู้รับทุจริต รับผิดทั้งหมดแม้สูญหาย', text:'ผู้รับลาภมิควรได้ ถ้ารู้อยู่ว่าไม่มีสิทธิจะได้รับ → ต้องรับผิดในการคืนลาภมิควรได้ แม้ทรัพย์สินจะสูญหายหรือบุบสลาย', summary:'ทุจริตรับผิดเต็ม: รู้ว่าไม่มีสิทธิ→คืนทั้งหมด แม้ของหาย/เสียหาย ≠ สุจริต(ม.413=คืนเท่าที่เหลือ)', keywords:['ทุจริต','รับผิดเต็ม','สูญหาย','ลาภมิควรได้'], dika:[] },
];

const obExisting = new Set(ob.sections.map(x => x.section));
let obAdded = 0;
for (const x of obNew) { if (!obExisting.has(x.section)) { ob.sections.push(x); obAdded++; } }
fs.writeFileSync(obFile, JSON.stringify(ob, null, 2), 'utf8');
console.log('Obligations: +' + obAdded + ' = ' + ob.sections.length);

const crpFile = 'law/criminal-procedure/criminal-procedure.json';
const crp = JSON.parse(fs.readFileSync(crpFile, 'utf8'));
const crpNew = [
  { id:'crp-147', section:'147', chapter:10, chapter_title:'การสอบสวน', title:'ห้ามโฆษณาภาพผู้ต้องหา — คุ้มครองสิทธิผู้ต้องหา', text:'ห้ามมิให้เผยแพร่ภาพ ชื่อ หรือข้อมูลอื่นใดของผู้ต้องหาหรือจำเลย ในลักษณะที่จะทำให้เข้าใจว่าบุคคลนั้นเป็นผู้กระทำผิด ก่อนศาลมีคำพิพากษา', summary:'ห้ามโฆษณาภาพผู้ต้องหา: คุ้มครองสันนิษฐานบริสุทธิ์(ม.3) ห้ามเผยแพร่ก่อนศาลตัดสิน', keywords:['ภาพผู้ต้องหา','ห้ามโฆษณา','สันนิษฐานบริสุทธิ์'], dika:[] },
  { id:'crp-260', section:'260', chapter:18, chapter_title:'อภัยโทษ เปลี่ยนโทษ ลดโทษ', title:'เปลี่ยนโทษหนักเป็นเบา — รัฐมนตรียุติธรรมเสนอ', text:'รัฐมนตรีว่าการกระทรวงยุติธรรมอาจถวายคำแนะนำขอพระราชทานเปลี่ยนโทษหนักเป็นโทษเบา หรือลดโทษ', summary:'เปลี่ยนโทษ: รมต.ยุติธรรมเสนอเปลี่ยนโทษหนักเป็นเบา/ลดโทษ เช่น ประหาร→ตลอดชีวิต ≠ อภัยโทษ(ม.259)', keywords:['เปลี่ยนโทษ','ลดโทษ','รัฐมนตรียุติธรรม'], dika:[] },
];

const crpExisting = new Set(crp.sections.map(x => x.section));
let crpAdded = 0;
for (const x of crpNew) { if (!crpExisting.has(x.section)) { crp.sections.push(x); crpAdded++; } }
fs.writeFileSync(crpFile, JSON.stringify(crp, null, 2), 'utf8');
console.log('Criminal Procedure: +' + crpAdded + ' = ' + crp.sections.length);

console.log('\nTotal added: ' + (crAdded + obAdded + crpAdded));
