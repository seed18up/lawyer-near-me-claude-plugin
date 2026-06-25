const fs = require('fs');

// === ป.อ. round 40 ===
const crFile = 'law/criminal/criminal.json';
const cr = JSON.parse(fs.readFileSync(crFile, 'utf8'));
const crNew = [
  { id:'crim-220', section:'220', chapter:16, chapter_title:'ความผิดเกี่ยวกับการก่อภยันตราย', title:'วางเพลิงเผาทรัพย์ตนเองจนคนตาย — จำคุก 5-20 ปี', text:'ถ้าการกระทำตามมาตรา 217 218 หรือ 219 เป็นเหตุให้ผู้อื่นถึงแก่ความตาย → จำคุก 5-20 ปี หรือตลอดชีวิต', summary:'วางเพลิงจนตาย: เผาทรัพย์(ตัวเอง/คนอื่น)แล้วมีคนตาย→5-20ปี/ตลอดชีวิต', keywords:['วางเพลิง','ตาย','5-20 ปี'], dika:[] },
  { id:'crim-222', section:'222', chapter:16, chapter_title:'ความผิดเกี่ยวกับการก่อภยันตราย', title:'ทำให้ระเบิดจนคนตาย — จำคุก 5-20 ปี / ตลอดชีวิต', text:'ถ้าการกระทำตามมาตรา 221 เป็นเหตุให้ผู้อื่นถึงแก่ความตาย → จำคุก 5-20 ปี หรือตลอดชีวิต', summary:'ระเบิดจนตาย: ทำให้เกิดระเบิดแล้วมีคนตาย→5-20ปี/ตลอดชีวิต', keywords:['ระเบิด','ตาย','ตลอดชีวิต'], dika:[] },
  { id:'crim-227', section:'227', chapter:16, chapter_title:'ความผิดเกี่ยวกับการก่อภยันตราย', title:'ทำให้ภยันตรายต่อการจราจรโดยประมาท — จำคุก ≤ 3 ปี', text:'ถ้าการกระทำตามมาตรา 224 225 หรือ 226 ได้กระทำโดยประมาท → จำคุก ≤ 3 ปี + ปรับ ≤ 60,000', summary:'ก่อภยันตรายจราจรโดยประมาท: ประมาทจนเกิดอันตรายต่อจราจร→≤3ปี ≠ เจตนา(ม.224=≤5ปี)', keywords:['ประมาท','จราจร','ภยันตราย'], dika:[] },
  { id:'crim-229', section:'229', chapter:16, chapter_title:'ความผิดเกี่ยวกับการก่อภยันตราย', title:'กระทำให้เกิดอุทกภัยโดยประมาท — จำคุก ≤ 5 ปี', text:'ถ้าการกระทำตามมาตรา 228 ได้กระทำโดยประมาท → จำคุก ≤ 5 ปี + ปรับ ≤ 100,000', summary:'อุทกภัยโดยประมาท: ประมาทจนเกิดน้ำท่วม→≤5ปี ≠ เจตนา(ม.228=2-7ปี)', keywords:['อุทกภัย','ประมาท','น้ำท่วม'], dika:[] },
  { id:'crim-241', section:'241', chapter:17, chapter_title:'ความผิดเกี่ยวกับเงินตรา', title:'ปลอมเงินตรา — สมคบกันปลอม → จำคุก 5-15 ปี', text:'ผู้ใดสมคบกันเพื่อกระทำความผิดตามมาตรา 240 → จำคุก 5-15 ปี + ปรับ 100,000-300,000', summary:'สมคบปลอมเงิน: ตกลงร่วมกันเพื่อปลอมเงิน→5-15ปี แม้ยังไม่ได้ปลอมจริง ≠ ปลอมจริง(ม.240=10-20ปี)', keywords:['สมคบ','ปลอมเงิน','5-15 ปี'], dika:[] },
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
  { id:'cvp-16', section:'16', chapter:1, chapter_title:'อำนาจและหน้าที่ของศาล', title:'อำนาจศาลตามชั้น — ศาลชั้นต้น อุทธรณ์ ฎีกา', text:'ศาลชั้นต้น → พิจารณาพิพากษาคดีในชั้นต้น\nศาลอุทธรณ์ → พิจารณาพิพากษาคดีที่อุทธรณ์คำพิพากษาศาลชั้นต้น\nศาลฎีกา → พิจารณาพิพากษาคดีที่ฎีกาคำพิพากษาศาลอุทธรณ์', summary:'3 ชั้นศาล: ชั้นต้น→อุทธรณ์→ฎีกา แต่ละชั้นตรวจสอบชั้นล่าง', keywords:['ศาลชั้นต้น','ศาลอุทธรณ์','ศาลฎีกา','3 ชั้น'], dika:[] },
  { id:'cvp-186', section:'186', chapter:7, chapter_title:'วิธีพิจารณาสามัญ', title:'ศาลชี้สองสถาน — กำหนดประเด็น ภาระพิสูจน์ วันสืบพยาน', text:'เมื่อได้ชี้สองสถานแล้ว → ศาลจะกำหนดวันสืบพยาน โดยให้โจทก์นำสืบก่อน แล้วจำเลยนำสืบ', summary:'ชี้สองสถาน: กำหนดประเด็น+ภาระพิสูจน์+วันสืบ โจทก์สืบก่อน→จำเลยสืบ→สรุป→พิพากษา', keywords:['ชี้สองสถาน','ประเด็น','ภาระพิสูจน์','วันสืบ'], dika:[] },
];

const cvpExisting = new Set(cvp.sections.map(x => x.section));
let cvpAdded = 0;
for (const x of cvpNew) { if (!cvpExisting.has(x.section)) { cvp.sections.push(x); cvpAdded++; } }
fs.writeFileSync(cvpFile, JSON.stringify(cvp, null, 2), 'utf8');
console.log('Civil Procedure: +' + cvpAdded + ' = ' + cvp.sections.length);

const crpFile = 'law/criminal-procedure/criminal-procedure.json';
const crp = JSON.parse(fs.readFileSync(crpFile, 'utf8'));
const crpNew = [
  { id:'crp-121', section:'121', chapter:9, chapter_title:'การสอบสวน', title:'ร้องทุกข์ที่ไหนก็ได้ — ร้องทุกข์ ณ สถานีตำรวจใดก็ได้', text:'ผู้เสียหายจะร้องทุกข์ต่อพนักงานสอบสวน ณ ท้องที่ใดก็ได้ → พนักงานสอบสวนต้องรับคำร้องทุกข์ แล้วส่งเรื่องไปยังพนักงานสอบสวนผู้รับผิดชอบ', summary:'ร้องทุกข์ที่ไหนก็ได้: ไม่ต้องไปแจ้งที่ท้องที่เกิดเหตุ แจ้งที่ไหนก็ได้ ส.ส.ต้องรับแล้วส่งต่อ', keywords:['ร้องทุกข์','สถานีตำรวจ','ที่ไหนก็ได้'], dika:[] },
  { id:'crp-144', section:'144', chapter:10, chapter_title:'การสอบสวน', title:'ส่งสำนวนให้อัยการ — ส.ส.ส่งสำนวนพร้อมตัวผู้ต้องหา', text:'เมื่อสอบสวนเสร็จแล้ว → พนักงานสอบสวนส่งสำนวน ความเห็น และตัวผู้ต้องหาไปยังพนักงานอัยการ\nถ้าไม่มีตัวผู้ต้องหา → ส่งสำนวนอย่างเดียว', summary:'ส่งสำนวนอัยการ: สำนวน+ความเห็น+ตัวผู้ต้องหา→อัยการ อัยการสั่งฟ้อง/ไม่ฟ้อง(ม.142)', keywords:['ส่งสำนวน','อัยการ','ตัวผู้ต้องหา'], dika:[] },
];

const crpExisting = new Set(crp.sections.map(x => x.section));
let crpAdded = 0;
for (const x of crpNew) { if (!crpExisting.has(x.section)) { crp.sections.push(x); crpAdded++; } }
fs.writeFileSync(crpFile, JSON.stringify(crp, null, 2), 'utf8');
console.log('Criminal Procedure: +' + crpAdded + ' = ' + crp.sections.length);

console.log('\nTotal added: ' + (crAdded + cvpAdded + crpAdded));
