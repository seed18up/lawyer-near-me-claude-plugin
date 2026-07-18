#!/usr/bin/env node

/**
 * Master Board — AI Document Pre-Check
 * Downloads a sales-tax-report PDF, has Claude extract each invoice row,
 * then runs deterministic checks (Thai Tax ID checksum, VAT math, date range,
 * sequential invoice numbering) — never trusts Claude's own pass/fail judgment
 * for anything tax-compliance-critical.
 * Reports results back to a Power Automate callback URL.
 */

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const FILE_URL = process.env.FILE_URL;
const ITEM_ID = process.env.ITEM_ID;
const CALLBACK_URL = process.env.CALLBACK_URL;
const CLIENT_CODE = process.env.CLIENT_CODE;
const ACCOUNTING_PERIOD = process.env.ACCOUNTING_PERIOD; // "YYYY-MM"

for (const [name, val] of Object.entries({ ANTHROPIC_API_KEY, FILE_URL, ITEM_ID, CALLBACK_URL, CLIENT_CODE, ACCOUNTING_PERIOD })) {
  if (!val) {
    console.error(`ERROR: missing required input/env ${name}`);
    process.exit(1);
  }
}

async function main() {
  const pdfBase64 = await downloadPdfAsBase64(FILE_URL);
  const rows = await extractRowsWithClaude(pdfBase64);
  const issues = validateRows(rows, ACCOUNTING_PERIOD);

  const result = {
    itemId: ITEM_ID,
    clientCode: CLIENT_CODE,
    accountingPeriod: ACCOUNTING_PERIOD,
    rowCount: rows.length,
    passed: issues.length === 0,
    issues,
  };

  console.log(JSON.stringify(result, null, 2));
  await reportToCallback(result);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

// ── Download the PDF and return base64 ──────────────────────────────────────
async function downloadPdfAsBase64(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download PDF: ${res.status} ${res.statusText}`);
  const buf = Buffer.from(await res.arrayBuffer());
  return buf.toString('base64');
}

// ── Ask Claude to extract structured rows from the PDF ──────────────────────
async function extractRowsWithClaude(pdfBase64) {
  const prompt = `อ่านรายงานภาษีขายนี้ แล้วส่งกลับเป็น JSON array เท่านั้น ห้ามมีข้อความอื่นนอกเหนือจาก JSON
แต่ละรายการมีฟิลด์:
- invoiceNo (string) เลขที่ใบกำกับเต็ม รวมเครื่องหมาย * หรือ ? นำหน้าถ้ามี
- date (string) รูปแบบ DD/MM/YY ตามในรายงาน (พุทธศักราช 2 หลัก)
- buyerName (string)
- buyerTaxId (string) เลขประจำตัวผู้เสียภาษี 13 หลัก ไม่มีขีดหรือช่องว่าง
- amount (number) มูลค่าสินค้าก่อนภาษี
- vat (number) จำนวนภาษีมูลค่าเพิ่ม
- cancelled (boolean) true ถ้าเลขที่มี * นำหน้า
- pending (boolean) true ถ้าเลขที่มี ? นำหน้า`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 8000,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: pdfBase64 } },
            { type: 'text', text: prompt },
          ],
        },
      ],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Claude API error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const text = data.content?.[0]?.text ?? '';
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error(`Could not find JSON array in Claude response: ${text.slice(0, 500)}`);
  return JSON.parse(jsonMatch[0]);
}

// ── Deterministic validation — never trust the LLM for these ────────────────
function validateRows(rows, accountingPeriod) {
  const issues = [];
  const [periodYear, periodMonth] = accountingPeriod.split('-').map(Number);

  const seqNumbers = [];

  for (const row of rows) {
    const label = row.invoiceNo || '(ไม่ทราบเลขที่)';

    // Thai 13-digit Tax ID checksum
    if (row.buyerTaxId && !isValidThaiTaxId(row.buyerTaxId)) {
      issues.push(`${label}: เลขผู้เสียภาษี "${row.buyerTaxId}" ไม่ผ่านสูตรตรวจสอบ (checksum ไม่ถูกต้อง)`);
    }

    // VAT ≈ 7% of amount (allow ±1 baht rounding tolerance)
    if (typeof row.amount === 'number' && typeof row.vat === 'number') {
      const expectedVat = Math.round(row.amount * 0.07 * 100) / 100;
      if (Math.abs(expectedVat - row.vat) > 1) {
        issues.push(`${label}: VAT ${row.vat} ไม่ตรงกับ 7% ของมูลค่าสินค้า ${row.amount} (คาดว่าควรเป็น ~${expectedVat})`);
      }
    }

    // Date within the accounting period being processed
    if (row.date) {
      const parsed = parseThaiDate(row.date);
      if (!parsed) {
        issues.push(`${label}: วันที่ "${row.date}" อ่านไม่ได้ตามรูปแบบ DD/MM/YY`);
      } else if (parsed.year !== periodYear || parsed.month !== periodMonth) {
        issues.push(`${label}: วันที่ ${row.date} อยู่นอกรอบบัญชี ${accountingPeriod}`);
      }
    }

    // Flag pending (missing invoice) — a real compliance risk, not just data noise
    if (row.pending) {
      issues.push(`${label}: ยังไม่ได้ใบกำกับ (มีเครื่องหมาย ? ในรายงาน)`);
    }

    // Collect sequence numbers for continuity check (skip cancelled — they're expected gaps in usage, not gaps in numbering)
    const seq = extractSeqNumber(row.invoiceNo);
    if (seq !== null) seqNumbers.push(seq);
  }

  // Sequential numbering continuity check
  if (seqNumbers.length > 1) {
    const sorted = [...new Set(seqNumbers)].sort((a, b) => a - b);
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const present = new Set(sorted);
    const missing = [];
    for (let n = min; n <= max; n++) {
      if (!present.has(n)) missing.push(n);
    }
    if (missing.length > 0) {
      issues.push(`เลขที่ใบกำกับไม่ต่อเนื่อง — ขาดหมายเลข: ${missing.join(', ')}`);
    }
  }

  return issues;
}

// Thai 13-digit Tax ID / national ID checksum (mod-11)
function isValidThaiTaxId(id) {
  const cleaned = String(id).replace(/[^0-9]/g, '');
  if (!/^\d{13}$/.test(cleaned)) return false;
  const digits = cleaned.split('').map(Number);
  let sum = 0;
  for (let i = 0; i < 12; i++) sum += digits[i] * (13 - i);
  const check = (11 - (sum % 11)) % 10;
  return check === digits[12];
}

// Parse "DD/MM/YY" Buddhist-era date (YY assumed 25xx) into Gregorian {year, month, day}
function parseThaiDate(dateStr) {
  const m = String(dateStr).match(/^(\d{1,2})\/(\d{1,2})\/(\d{2})$/);
  if (!m) return null;
  const day = parseInt(m[1], 10);
  const month = parseInt(m[2], 10);
  const buddhistYear = 2500 + parseInt(m[3], 10);
  return { year: buddhistYear - 543, month, day };
}

// Extract the trailing numeric segment from an invoice number, e.g. "*A06906/21" -> 21
function extractSeqNumber(invoiceNo) {
  if (!invoiceNo) return null;
  const m = String(invoiceNo).match(/(\d+)\s*$/);
  return m ? parseInt(m[1], 10) : null;
}

// ── Report results back to Power Automate ────────────────────────────────────
async function reportToCallback(result) {
  const res = await fetch(CALLBACK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(result),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Callback failed ${res.status}: ${errText}`);
  }
  console.log('Callback reported successfully.');
}
