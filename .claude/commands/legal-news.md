# /legal-news

ดึงข่าวกระแสสังคมไทยแบบ real-time วิเคราะห์ประเด็นข้อพิพาทกฎหมาย และสร้าง report สำหรับ Lawyer Near Me

**Usage:** `/legal-news` หรือ `/legal-news [หัวข้อ]` เช่น `/legal-news แรงงาน`, `/legal-news อสังหา`

---

## Pipeline Overview

รัน 5 ขั้นตามลำดับ ห้ามข้ามขั้น:

1. **GATHER** — ค้นหาและรวบรวมข่าว
2. **CONTENT CREATOR AGENT** — สรุปข่าว 3 ข่าว
3. **SEO SPECIALIST AGENT** — วิเคราะห์ keywords
4. **LEGAL ADVISOR AGENT** — Legal Opinion อย่างเป็นทางการ
5. **RENDER & SAVE** — สร้าง HTML, TXT, PNG

---

## Step 1: GATHER

รับ argument: `$ARGUMENTS` (หัวข้อที่ต้องการ ถ้าไม่มีใช้ข่าวทั่วไป)

**1a. WebSearch ข่าวใหม่ (real-time)**

ค้นหาด้วย query ต่อไปนี้ตามลำดับ:
- `"ข่าวกระแสสังคมไทย $ARGUMENTS วันนี้ 2026"`
- `"Thailand trending news $ARGUMENTS legal dispute 2026"`
- `"ข่าวกฎหมายไทย $ARGUMENTS ล่าสุด"`

ถ้า `$ARGUMENTS` ว่างเปล่า ใช้:
- `"ข่าวกระแสสังคมไทย วันนี้ 2026"`
- `"Thailand trending news legal today 2026"`
- `"คดีดัง ข่าวกฎหมาย ไทย ล่าสุด"`

เก็บผลการค้นหาเป็น `raw_news_search`

**1b. อ่านไฟล์ digest ที่มีอยู่**

ค้นหาไฟล์ล่าสุดใน `news-digest/` และ `news-legal-digest/` โดยใช้ Glob pattern:
- `news-digest/*.txt`
- `news-legal-digest/*.txt`

อ่านไฟล์ที่ใหม่ที่สุด (ตาม timestamp ในชื่อไฟล์) ของแต่ละ folder เก็บเป็น `existing_digest`

ถ้าไม่พบไฟล์ใด ๆ ให้ข้ามและใช้เฉพาะ `raw_news_search`

**1c. รวม sources**

สร้าง `combined_news_context` = ผสม `raw_news_search` + `existing_digest`
ระบุชัดเจนว่าข้อมูลใดมาจาก WebSearch (real-time) และข้อมูลใดมาจากไฟล์ที่มีอยู่

---

## Step 2: CONTENT CREATOR AGENT

Spawn subagent ประเภท `content-creator` ด้วย prompt ด้านล่างนี้ (แทน `[combined_news_context]` ด้วยข้อมูลจริงจาก Step 1):

```
คุณคือ คุณมินตรา ชัยศรี, Content Creator ของ Lawyer Near Me

จากข่าวต่อไปนี้: [combined_news_context]

งานของคุณ: เลือกข่าว 3 ข่าวที่มีประเด็นกฎหมายที่น่าสนใจและกระทบต่อชีวิตประชาชนมากที่สุด
แล้วเขียนสรุปแต่ละข่าวในรูปแบบนี้:

## ข่าวที่ [N]: [หัวข้อข่าวที่ดึงดูด]

เกิดอะไรขึ้น? [อธิบาย 3-4 ประโยค ภาษาชาวบ้าน ไม่ใช้ศัพท์กฎหมาย]

เกี่ยวกับคุณอย่างไร? [ผลกระทบต่อคนทั่วไป 2-3 ประโยค]

ควรทำอย่างไร? [คำแนะนำเบื้องต้น + บอกให้ปรึกษาทนายใน practice area ที่เกี่ยวข้อง]

---

กฎที่ห้ามละเมิด:
- ห้ามการันตีผลคดีใด ๆ
- ต้องมี disclaimer ท้ายแต่ละข่าว: "ข้อมูลนี้เพื่อการศึกษาทั่วไป ไม่ใช่คำปรึกษาทางกฎหมาย"
- ใช้ภาษาไทยที่เข้าใจง่าย
- ระบุ practice area ที่เกี่ยวข้อง (Criminal, Civil, Family, Property, Labor, Corporate, Digital/PDPA)

ส่งผลลัพธ์เป็น markdown เท่านั้น
```

เก็บผลลัพธ์ของ subagent เป็น `content_summary`

---

## Step 3: SEO SPECIALIST AGENT

Spawn subagent ประเภท `seo-specialist` ด้วย prompt ด้านล่างนี้ (แทน `[content_summary]` ด้วยข้อมูลจริงจาก Step 2):

```
คุณคือ คุณธนวัฒน์ ศรีสมบูรณ์, SEO Specialist ของ Lawyer Near Me

จากสรุปข่าว 3 ข่าวต่อไปนี้: [content_summary]

งานของคุณ: วิเคราะห์ SEO สำหรับแต่ละข่าว ในรูปแบบนี้:

### ข่าวที่ [N]: [ชื่อย่อข่าว]

**Primary Keyword:** [คีย์เวิร์ดหลัก ภาษาไทย]
**Secondary Keywords:** [3-5 คีย์เวิร์ดรอง คั่นด้วยลูกน้ำ]
**Search Intent:** [Informational / Navigational / Transactional]
**Practice Area Link:** [ชื่อ practice area ที่ควร link ใน platform]
**People Also Ask:** [2-3 คำถามที่คนมักค้นหาเกี่ยวกับเรื่องนี้]

---

ส่งผลลัพธ์เป็น markdown เท่านั้น
```

เก็บผลลัพธ์ของ subagent เป็น `seo_analysis`

---

## Step 4: LEGAL ADVISOR AGENT

ก่อน spawn: นับเลข LO ล่าสุดจากไฟล์ใน `news-legal-digest/` โดยค้นหา pattern `LO-2026-` ในไฟล์ล่าสุด แล้วบวก 1 เก็บเป็น `next_lo_number` (format: 3 หลัก เช่น 010, 011) ถ้าไม่พบให้ใช้ 001

Spawn subagent ประเภท `legal-advisor` ด้วย prompt ด้านล่างนี้ (แทน placeholder ด้วยข้อมูลจริง):

```
คุณคือ ดร.วรรณา สิทธิชัย, Chief Legal Advisor ของ Lawyer Near Me

จากสรุปข่าว: [content_summary]
และการวิเคราะห์ SEO: [seo_analysis]

งานของคุณ: ออก Legal Opinion อย่างเป็นทางการ ในรูปแบบมาตรฐาน:

================================================================================
LEGAL OPINION REF: LO-2026-[next_lo_number]
Date: [วันที่ปัจจุบัน ภาษาไทย]
Requested by: Marketing Team / Content Pipeline
Subject: วิเคราะห์ประเด็นกฎหมายจากข่าวกระแสสังคม 3 กรณี
Classification: INTERNAL USE ONLY
================================================================================

EXECUTIVE SUMMARY:
[1-2 ย่อหน้า สรุปภาพรวมและนัยต่อ Lawyer Near Me]

LEGAL ANALYSIS:

ประเด็นที่ 1: [ชื่อข่าว]
──────────────────────────────────────────────────────────────────────────────
กฎหมายที่เกี่ยวข้อง:
- [พ.ร.บ./มาตรา + โทษ ถ้ามี]

การประเมิน:
[วิเคราะห์ 3-5 ประโยค]

ผลกระทบต่อ LNM: [สูง/ปานกลาง/ต่ำ] — [อธิบาย]

ประเด็นที่ 2: [ชื่อข่าว]
──────────────────────────────────────────────────────────────────────────────
กฎหมายที่เกี่ยวข้อง:
- [พ.ร.บ./มาตรา + โทษ ถ้ามี]

การประเมิน:
[วิเคราะห์ 3-5 ประโยค]

ผลกระทบต่อ LNM: [สูง/ปานกลาง/ต่ำ] — [อธิบาย]

ประเด็นที่ 3: [ชื่อข่าว]
──────────────────────────────────────────────────────────────────────────────
กฎหมายที่เกี่ยวข้อง:
- [พ.ร.บ./มาตรา + โทษ ถ้ามี]

การประเมิน:
[วิเคราะห์ 3-5 ประโยค]

ผลกระทบต่อ LNM: [สูง/ปานกลาง/ต่ำ] — [อธิบาย]

CONCLUSION — Priority Actions:

IMMEDIATE (ภายใน 14 วัน):
[รายการ actions ถ้ามี]

SHORT-TERM (ภายใน 30 วัน):
[รายการ actions ถ้ามี]

RISK MATRIX รอบนี้:
- [ข่าวที่ 1]: ★[N]☆☆☆☆ ([เหตุผล])
- [ข่าวที่ 2]: ★[N]☆☆☆☆ ([เหตุผล])
- [ข่าวที่ 3]: ★[N]☆☆☆☆ ([เหตุผล])

APPROVAL DECISION: [APPROVED / APPROVED WITH CHANGES / REJECTED]
เงื่อนไข: [ถ้ามี]

CAVEATS:
- เนื้อหาทุกชิ้นที่จะ publish จริงต้องผ่าน Legal Review อีกครั้ง
- [caveats เพิ่มเติมตามแต่ละกรณี]

Signed: ดร.วรรณา สิทธิชัย
        Chief Legal Advisor, Lawyer Near Me
        [วันที่]
================================================================================
```

เก็บผลลัพธ์ของ subagent เป็น `legal_opinion`

---

## Step 5: RENDER & SAVE

### 5a. สร้าง Text Digest

นำข้อมูลทั้งหมดมาประกอบเป็นไฟล์ `.txt` แล้วเขียนด้วย Write tool:

**ชื่อไฟล์**: `news-legal-digest/[YYYY-MM-DD]_[HH-MM-SS]_legal-news-digest.txt`
(ใช้วันที่และเวลาปัจจุบัน เช่น `2026-06-05_14-30-00_legal-news-digest.txt`)

**เนื้อหาไฟล์** (แทน placeholder ด้วยข้อมูลจริงทุกจุด):

```
================================================================================
LAWYER NEAR ME — ข่าวกระแสสังคมและประเด็นข้อพิพาทกฎหมาย
Timestamp: [YYYY-MM-DD HH:MM:SS]
Generated by: /legal-news skill | Sequential Pipeline v1.0
Topic filter: [$ARGUMENTS หรือ "ทั่วไป" ถ้าไม่มี argument]
================================================================================

================================================================================
ส่วนที่ 1: สรุปข่าวกระแสสังคมประจำวัน
รวบรวมโดย: Content Creator Agent (คุณมินตรา ชัยศรี)
================================================================================

[content_summary]

================================================================================
ส่วนที่ 2: SEO Keywords & Practice Areas
จัดทำโดย: SEO Specialist Agent (คุณธนวัฒน์ ศรีสมบูรณ์)
================================================================================

[seo_analysis]

================================================================================
ส่วนที่ 3: Legal Opinion
จัดทำโดย: ดร.วรรณา สิทธิชัย, Chief Legal Advisor (Legal Advisor Agent)
================================================================================

[legal_opinion]

================================================================================
แหล่งข้อมูล (Sources)
================================================================================

[รายการ URL จาก WebSearch ที่ใช้จริง]

================================================================================
หมายเหตุ: ไฟล์นี้สร้างโดย /legal-news skill
เนื้อหานี้จัดทำเพื่อการศึกษาทั่วไป ไม่ใช่คำปรึกษาทางกฎหมาย
ทุก content ที่จะ publish จริงต้องผ่าน Legal Advisor review อีกครั้ง
================================================================================
```

### 5b. สร้าง HTML Report

เขียนไฟล์ `output/legal-news.html` ด้วย Write tool โดยแทนที่ placeholder ทุกจุดด้วยข้อมูลจริง:
- `[หัวข้อข่าวเด่นที่สุด]` → หัวข้อข่าวที่ 1 จาก content_summary
- `[วันที่ปัจจุบัน ภาษาไทย]` → เช่น "5 มิถุนายน 2569"
- `[next_lo_number]` → เลข LO จริง
- ข้อมูลข่าว 3 ข่าว, SEO keywords, Legal Opinion → จากผลลัพธ์จริง

```html
<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=1400">
<title>[หัวข้อข่าวเด่นที่สุด] — Lawyer Near Me News</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Sarabun', sans-serif; background: #f0f2f5; color: #1a1a1a; width: 1400px; min-height: 2200px; }

  .topbar { background: #B71C1C; color: #fff; display: flex; align-items: center; justify-content: space-between; padding: 0 32px; height: 44px; font-size: 13px; font-weight: 600; letter-spacing: 0.5px; }
  .topbar-left { display: flex; align-items: center; gap: 20px; }
  .breaking-badge { background: #fff; color: #B71C1C; font-weight: 800; font-size: 11px; padding: 3px 10px; border-radius: 2px; letter-spacing: 1px; text-transform: uppercase; }

  .header { background: #fff; border-bottom: 3px solid #B71C1C; padding: 16px 32px; display: flex; align-items: center; justify-content: space-between; }
  .logo-name { font-size: 22px; font-weight: 800; color: #1B3A8B; }
  .logo-sub { font-size: 12px; color: #666; }
  .header-section-tag { font-size: 13px; font-weight: 700; color: #B71C1C; border: 2px solid #B71C1C; padding: 4px 14px; border-radius: 4px; }

  .main-wrap { display: flex; gap: 24px; padding: 24px 32px 32px; }
  .main-col { flex: 2; display: flex; flex-direction: column; gap: 20px; }
  .side-col { flex: 1; display: flex; flex-direction: column; gap: 16px; }

  .news-card { background: #fff; border-radius: 10px; padding: 20px 24px; border-left: 5px solid #B71C1C; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
  .news-number { font-size: 11px; font-weight: 700; color: #B71C1C; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
  .news-title { font-size: 20px; font-weight: 800; color: #1a1a1a; margin-bottom: 14px; line-height: 1.4; }
  .news-section { margin-bottom: 12px; }
  .news-section-label { font-size: 11px; font-weight: 700; color: #1B3A8B; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 4px; }
  .news-section-body { font-size: 15px; line-height: 1.7; color: #333; }
  .practice-tag { display: inline-block; background: #E3F2FD; color: #1B3A8B; font-size: 12px; font-weight: 600; padding: 3px 10px; border-radius: 20px; margin-top: 8px; }
  .disclaimer { font-size: 12px; color: #888; font-style: italic; margin-top: 12px; padding-top: 10px; border-top: 1px solid #eee; }

  .side-card { background: #fff; border-radius: 10px; padding: 18px 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
  .side-card-title { font-size: 13px; font-weight: 800; color: #1B3A8B; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 2px solid #E3F2FD; }

  .legal-section { background: #fff; margin: 0 32px 32px; border-radius: 10px; padding: 28px 32px; border-top: 4px solid #1B3A8B; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
  .legal-ref { font-size: 12px; color: #888; margin-bottom: 6px; }
  .legal-title { font-size: 18px; font-weight: 800; color: #1B3A8B; margin-bottom: 16px; }
  .legal-body { font-size: 14px; line-height: 1.8; color: #333; white-space: pre-wrap; font-family: 'Sarabun', sans-serif; }

  .seo-panel { background: #F3F4F6; border-radius: 8px; padding: 14px 16px; }
  .keyword-pill { display: inline-block; background: #1B3A8B; color: #fff; font-size: 11px; padding: 3px 9px; border-radius: 12px; margin: 3px 3px 3px 0; }
  .seo-item { margin-bottom: 14px; }
  .seo-item-label { font-size: 11px; color: #666; font-weight: 600; margin-bottom: 4px; }

  .risk-item { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; font-size: 13px; }
  .risk-stars { color: #B71C1C; font-size: 14px; }

  .footer { background: #1a1a1a; color: #ccc; padding: 16px 32px; font-size: 12px; line-height: 1.8; }
</style>
</head>
<body>

<div class="topbar">
  <div class="topbar-left">
    <span class="breaking-badge">BREAKING</span>
    <span>[วันที่ปัจจุบัน ภาษาไทย]</span>
    <span>ข่าวกระแสสังคมและประเด็นข้อพิพาทกฎหมาย</span>
  </div>
  <span>Lawyer Near Me — Legal News Intelligence</span>
</div>

<div class="header">
  <div>
    <div class="logo-name">⚖️ Lawyer Near Me</div>
    <div class="logo-sub">ทุกปัญหากฎหมาย มีทางออก</div>
  </div>
  <div class="header-section-tag">ข่าวกฎหมายประจำวัน</div>
</div>

<div class="main-wrap">
  <div class="main-col">

    <div class="news-card">
      <div class="news-number">ข่าวที่ 1</div>
      <div class="news-title">[หัวข้อข่าวที่ 1 จาก content_summary]</div>
      <div class="news-section">
        <div class="news-section-label">เกิดอะไรขึ้น?</div>
        <div class="news-section-body">[สรุปข่าวที่ 1 — เกิดอะไรขึ้น]</div>
      </div>
      <div class="news-section">
        <div class="news-section-label">เกี่ยวกับคุณอย่างไร?</div>
        <div class="news-section-body">[ผลกระทบต่อประชาชนข่าวที่ 1]</div>
      </div>
      <div class="news-section">
        <div class="news-section-label">ควรทำอย่างไร?</div>
        <div class="news-section-body">[คำแนะนำเบื้องต้นข่าวที่ 1]</div>
      </div>
      <div><span class="practice-tag">[practice area ข่าวที่ 1]</span></div>
      <div class="disclaimer">ข้อมูลนี้เพื่อการศึกษาทั่วไป ไม่ใช่คำปรึกษาทางกฎหมาย</div>
    </div>

    <div class="news-card">
      <div class="news-number">ข่าวที่ 2</div>
      <div class="news-title">[หัวข้อข่าวที่ 2 จาก content_summary]</div>
      <div class="news-section">
        <div class="news-section-label">เกิดอะไรขึ้น?</div>
        <div class="news-section-body">[สรุปข่าวที่ 2 — เกิดอะไรขึ้น]</div>
      </div>
      <div class="news-section">
        <div class="news-section-label">เกี่ยวกับคุณอย่างไร?</div>
        <div class="news-section-body">[ผลกระทบต่อประชาชนข่าวที่ 2]</div>
      </div>
      <div class="news-section">
        <div class="news-section-label">ควรทำอย่างไร?</div>
        <div class="news-section-body">[คำแนะนำเบื้องต้นข่าวที่ 2]</div>
      </div>
      <div><span class="practice-tag">[practice area ข่าวที่ 2]</span></div>
      <div class="disclaimer">ข้อมูลนี้เพื่อการศึกษาทั่วไป ไม่ใช่คำปรึกษาทางกฎหมาย</div>
    </div>

    <div class="news-card">
      <div class="news-number">ข่าวที่ 3</div>
      <div class="news-title">[หัวข้อข่าวที่ 3 จาก content_summary]</div>
      <div class="news-section">
        <div class="news-section-label">เกิดอะไรขึ้น?</div>
        <div class="news-section-body">[สรุปข่าวที่ 3 — เกิดอะไรขึ้น]</div>
      </div>
      <div class="news-section">
        <div class="news-section-label">เกี่ยวกับคุณอย่างไร?</div>
        <div class="news-section-body">[ผลกระทบต่อประชาชนข่าวที่ 3]</div>
      </div>
      <div class="news-section">
        <div class="news-section-label">ควรทำอย่างไร?</div>
        <div class="news-section-body">[คำแนะนำเบื้องต้นข่าวที่ 3]</div>
      </div>
      <div><span class="practice-tag">[practice area ข่าวที่ 3]</span></div>
      <div class="disclaimer">ข้อมูลนี้เพื่อการศึกษาทั่วไป ไม่ใช่คำปรึกษาทางกฎหมาย</div>
    </div>

  </div>

  <div class="side-col">

    <div class="side-card">
      <div class="side-card-title">Legal Opinion</div>
      <div style="font-size:11px;color:#888;margin-bottom:8px;">LO-2026-[next_lo_number] | ดร.วรรณา สิทธิชัย</div>
      <div style="font-size:14px;line-height:1.7;">[Executive Summary จาก legal_opinion — 2-3 ประโยคสรุปภาพรวม]</div>
    </div>

    <div class="side-card">
      <div class="side-card-title">SEO Keywords Panel</div>
      <div class="seo-panel">
        <div class="seo-item">
          <div class="seo-item-label">ข่าวที่ 1 — [Primary Keyword ข่าวที่ 1]</div>
          <div>[Secondary keywords จาก seo_analysis ข่าวที่ 1 แต่ละคำใส่ใน &lt;span class="keyword-pill"&gt;keyword&lt;/span&gt;]</div>
        </div>
        <div class="seo-item">
          <div class="seo-item-label">ข่าวที่ 2 — [Primary Keyword ข่าวที่ 2]</div>
          <div>[Secondary keywords จาก seo_analysis ข่าวที่ 2]</div>
        </div>
        <div class="seo-item">
          <div class="seo-item-label">ข่าวที่ 3 — [Primary Keyword ข่าวที่ 3]</div>
          <div>[Secondary keywords จาก seo_analysis ข่าวที่ 3]</div>
        </div>
      </div>
    </div>

    <div class="side-card">
      <div class="side-card-title">Practice Areas ที่เกี่ยวข้อง</div>
      <div style="font-size:14px;line-height:2;">
        [รายการ Practice Area Link จาก seo_analysis ทั้ง 3 ข่าว พร้อม Search Intent]
      </div>
    </div>

    <div class="side-card" style="border-left: 4px solid #B71C1C;">
      <div class="side-card-title" style="color:#B71C1C;">Priority Actions</div>
      <div style="font-size:13px;line-height:1.8;">
        [IMMEDIATE และ SHORT-TERM actions จาก legal_opinion]
      </div>
    </div>

    <div class="side-card">
      <div class="side-card-title">Risk Matrix</div>
      <div class="risk-item"><span class="risk-stars">[★★★☆☆]</span><span style="font-size:13px;">[ชื่อย่อข่าวที่ 1]</span></div>
      <div class="risk-item"><span class="risk-stars">[★★☆☆☆]</span><span style="font-size:13px;">[ชื่อย่อข่าวที่ 2]</span></div>
      <div class="risk-item"><span class="risk-stars">[★★★★☆]</span><span style="font-size:13px;">[ชื่อย่อข่าวที่ 3]</span></div>
    </div>

  </div>
</div>

<div class="legal-section">
  <div class="legal-ref">LO-2026-[next_lo_number] | Classification: INTERNAL USE ONLY</div>
  <div class="legal-title">Legal Opinion — วิเคราะห์ประเด็นกฎหมายจากข่าวกระแสสังคม</div>
  <div class="legal-body">[legal_opinion เต็มทั้งหมด]</div>
</div>

<div class="footer">
  <strong>แหล่งข้อมูล:</strong> [URLs จาก WebSearch ที่ใช้จริง]<br>
  <strong>หมายเหตุ:</strong> เนื้อหานี้จัดทำเพื่อการศึกษาทั่วไป ไม่ใช่คำปรึกษาทางกฎหมาย | สร้างโดย /legal-news skill | [timestamp]
</div>

</body>
</html>
```

### 5c. Screenshot เป็น PNG

รัน command ต่อไปนี้ผ่าน Bash tool:

```bash
node tools/html-to-png.js output/legal-news.html output/legal-news-YYYY-MM-DD.png
```

แทน `YYYY-MM-DD` ด้วยวันที่ปัจจุบัน เช่น `output/legal-news-2026-06-05.png`

ถ้า Node.js หรือ Chrome ไม่พร้อม ให้แจ้งใน terminal:
```
[SKIP] PNG screenshot ข้าม — ตรวจสอบว่า Node.js และ Chrome ติดตั้งแล้ว
HTML report พร้อมที่: output/legal-news.html
```
แล้วดำเนินการต่อโดยไม่หยุด

### 5d. แสดง Summary ใน Terminal

แสดงผลสรุป (แทน placeholder ด้วยข้อมูลจริง):

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 /legal-news — เสร็จสมบูรณ์
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 ข่าว 3 ข่าว | Legal Opinion: LO-2026-[N]

 ไฟล์ที่สร้าง:
 📄 news-legal-digest/[timestamp]_legal-news-digest.txt
 🌐 output/legal-news.html
 🖼️ output/legal-news-[YYYY-MM-DD].png

 ประเด็นสำคัญ: [ข่าวที่ 1], [ข่าวที่ 2], [ข่าวที่ 3]
 Risk สูงสุด: [ข่าวที่มี risk stars สูงสุด]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 ทุก content ที่จะ publish ต้องผ่าน Legal Advisor review
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```
