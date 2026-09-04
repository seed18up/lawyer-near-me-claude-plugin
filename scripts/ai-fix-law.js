/**
 * ai-fix-law.js — ใช้ Claude Haiku 4.5 แก้ law JSON 2 งาน:
 *   1. เติม title สำหรับ sections ที่ไม่มี (468 sections)
 *   2. แบ่ง paragraph breaks สำหรับ sections text ยาว ไม่มี \n (3,341 sections)
 *
 * Usage:
 *   set ANTHROPIC_API_KEY=sk-ant-...
 *   node scripts/ai-fix-law.js
 *
 *   หรือ run เฉพาะงาน:
 *   node scripts/ai-fix-law.js --title-only
 *   node scripts/ai-fix-law.js --para-only
 *   node scripts/ai-fix-law.js --file law/criminal/criminal.json
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const readline = require('readline');

// ===== CONFIG =====
const MODEL = 'claude-haiku-4-5-20251001';
const CONCURRENCY = 5;       // parallel API calls
const SAVE_EVERY = 20;       // save JSON ทุก N sections
const MIN_TEXT_LEN = 150;    // sections ที่สั้นกว่านี้ไม่ต้อง fix paragraph

const LOG_FILE = 'ai-fix-law.log';
const logStream = fs.createWriteStream(LOG_FILE, { flags: 'a' });

function log(msg) {
  process.stdout.write(msg);
  logStream.write(msg);
}

// ===== ARG PARSING =====
const args = process.argv.slice(2);
const TITLE_ONLY = args.includes('--title-only');
const PARA_ONLY  = args.includes('--para-only');
const FILE_ARG   = (() => { const i = args.indexOf('--file'); return i >= 0 ? args[i+1] : null; })();
const DO_TITLE = !PARA_ONLY;
const DO_PARA  = !TITLE_ONLY;

// ===== GET API KEY =====
async function getApiKey() {
  if (process.env.ANTHROPIC_API_KEY) return process.env.ANTHROPIC_API_KEY;
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => {
    rl.question('กรุณาวาง ANTHROPIC_API_KEY: ', key => { rl.close(); resolve(key.trim()); });
  });
}

// ===== ANTHROPIC API CALL =====
function callApi(apiKey, messages, maxTokens) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      messages,
    });
    const req = https.request({
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Length': Buffer.byteLength(body),
      },
      timeout: 30000,
    }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const j = JSON.parse(data);
          if (j.error) reject(new Error(j.error.message));
          else resolve(j);
        } catch(e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
    req.write(body);
    req.end();
  });
}

function getText(resp) {
  return resp?.content?.[0]?.text?.trim() || '';
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ===== TITLE GENERATION =====
async function genTitle(apiKey, s) {
  const prompt = `คุณเป็นผู้เชี่ยวชาญกฎหมายไทย

สร้างชื่อ (title) สั้นๆ สำหรับมาตราต่อไปนี้ ภาษาไทย
- ยาวไม่เกิน 60 ตัวอักษร
- สรุปสาระสำคัญของมาตรา เช่น "กระทำโดยเจตนา — นิยามและองค์ประกอบ"
- รูปแบบ: [หัวข้อหลัก] — [รายละเอียดสั้น]
- ตอบแค่ title เท่านั้น ไม่ต้องอธิบายเพิ่ม

มาตรา ${s.section}: ${(s.text||'').substring(0, 300)}`;

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const resp = await callApi(apiKey, [{ role: 'user', content: prompt }], 100);
      const title = getText(resp).replace(/^["'""'']+|["'""'']+$/g, '').trim();
      if (title.length > 5) return title;
    } catch(e) {
      if (attempt < 2) await sleep(2000 * (attempt + 1));
      else throw e;
    }
  }
  return '';
}

// ===== PARAGRAPH BREAK GENERATION =====
async function genParagraphs(apiKey, s) {
  const text = (s.text || '').trim();
  if (!text || text.includes('\n') || text.length < MIN_TEXT_LEN) return null;

  const prompt = `คุณเป็นผู้เชี่ยวชาญกฎหมายไทย

ข้อความต่อไปนี้คือมาตรากฎหมายไทย ที่ถูก extract จาก PDF แล้วตัด newline ทิ้ง
กรุณาใส่ \\n กลับคืน ในตำแหน่งที่แต่ละ "วรรค" (paragraph) ควรเริ่ม

กฎ:
- วรรคใหม่มักเริ่มหลัง: ประโยคสมบูรณ์ที่จบด้วย "ไม่" "มิได้" "นั้น" "ด้วย" "ไว้" ฯลฯ
- list items (๑) (๒) (ก) (ข) แต่ละข้อขึ้นบรรทัดใหม่
- นิยาม "xxx" หมายความว่า ขึ้นบรรทัดใหม่
- ถ้าเป็นมาตราที่มีวรรคเดียวจริงๆ → คืนข้อความเดิมโดยไม่ใส่ \\n
- ห้ามเพิ่ม/ลดเนื้อหา เปลี่ยนได้แค่ตำแหน่ง \\n เท่านั้น
- ตอบแค่ข้อความที่แก้แล้ว ไม่ต้องอธิบาย

ข้อความ:
${text}`;

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const resp = await callApi(apiKey, [{ role: 'user', content: prompt }], Math.min(2048, text.length * 2 + 200));
      const result = getText(resp);
      // Sanity check: ความยาวต้องใกล้เคียงกับ original (±20%)
      const ratio = result.replace(/\n/g, '').length / text.replace(/\n/g, '').length;
      if (ratio > 0.75 && ratio < 1.25) return result;
      log(`  [WARN] para ratio ${ratio.toFixed(2)} for ม.${s.section} — skip\n`);
      return null;
    } catch(e) {
      if (attempt < 2) await sleep(2000 * (attempt + 1));
      else throw e;
    }
  }
  return null;
}

// ===== PROCESS FILE =====
async function processFile(apiKey, filePath) {
  let data;
  try { data = JSON.parse(fs.readFileSync(filePath, 'utf8')); }
  catch(e) { log(`ERROR reading ${filePath}: ${e.message}\n`); return; }

  const sections = data.sections || [];
  const fname = path.basename(filePath);

  // collect work
  const titleWork = DO_TITLE ? sections.filter(s => !s.title?.trim()) : [];
  const paraWork  = DO_PARA  ? sections.filter(s =>
    s.text && !s.text.includes('\n') && s.text.length > MIN_TEXT_LEN
  ) : [];

  if (titleWork.length === 0 && paraWork.length === 0) {
    log(`${fname}: ครบแล้ว\n`);
    return;
  }

  log(`\n${fname}: title=${titleWork.length} para=${paraWork.length}\n`);
  let changed = 0;

  // helper: run tasks with concurrency limit
  async function runConcurrent(tasks, runner) {
    let i = 0;
    async function worker() {
      while (i < tasks.length) {
        const s = tasks[i++];
        try { await runner(s); changed++; }
        catch(e) { log(`  [ERR] ม.${s.section}: ${e.message}\n`); }
        // save periodically
        if (changed % SAVE_EVERY === 0) {
          fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        }
        await sleep(200); // rate limit cushion
      }
    }
    await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  }

  // Phase 1: titles
  if (titleWork.length > 0) {
    log(`  [TITLE] generating ${titleWork.length} titles...\n`);
    await runConcurrent(titleWork, async s => {
      const title = await genTitle(apiKey, s);
      if (title) {
        s.title = title;
        log(`  ✓ title ม.${s.section}: ${title.substring(0,50)}\n`);
      }
    });
  }

  // Phase 2: paragraphs
  if (paraWork.length > 0) {
    log(`  [PARA] fixing ${paraWork.length} sections...\n`);
    await runConcurrent(paraWork, async s => {
      const result = await genParagraphs(apiKey, s);
      if (result && result !== s.text) {
        const nBefore = (s.text.match(/\n/g)||[]).length;
        const nAfter  = (result.match(/\n/g)||[]).length;
        if (nAfter > nBefore) {
          s.text = result;
          log(`  ✓ para ม.${s.section}: ${nAfter} วรรค\n`);
        }
      }
    });
  }

  // final save
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  log(`  SAVED ${fname} (${changed} changes)\n`);
}

// ===== MAIN =====
async function main() {
  log(`\n=== ai-fix-law เริ่ม ${new Date().toISOString()} ===\n`);
  log(`Mode: title=${DO_TITLE} para=${DO_PARA} model=${MODEL}\n\n`);

  const apiKey = await getApiKey();
  if (!apiKey || !apiKey.startsWith('sk-')) {
    log('API key ไม่ถูกต้อง\n'); process.exit(1);
  }

  // collect files using built-in fs (no glob dependency)
  let files;
  if (FILE_ARG) {
    files = [FILE_ARG];
  } else {
    function findJsonFiles(dir) {
      const results = [];
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) results.push(...findJsonFiles(full));
        else if (entry.name.endsWith('.json') && entry.name !== 'index.json') results.push(full);
      }
      return results;
    }
    files = findJsonFiles('law').sort();
  }

  log(`Files to process: ${files.length}\n`);

  let totalFiles = 0;
  for (const f of files) {
    await processFile(apiKey, f);
    totalFiles++;
  }

  log(`\n=== DONE ${new Date().toISOString()} ===\n`);
  log(`Files processed: ${totalFiles}\n`);
  logStream.end();
}

main().catch(e => { log(`FATAL: ${e.message}\n`); logStream.end(); process.exit(1); });
