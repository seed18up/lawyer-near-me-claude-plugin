# /legal-news Skill Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** สร้าง slash command `/legal-news` ที่รันแล้วดึงข่าวกระแสสังคมไทย วิเคราะห์ประเด็นกฎหมาย ผ่าน content-creator → seo-specialist → legal-advisor agents และสร้าง HTML + TXT + PNG output อัตโนมัติ

**Architecture:** Sequential pipeline skill ใน `.claude/commands/legal-news.md` — Claude อ่าน skill แล้ว spawn 3 subagents ตามลำดับ แต่ละตัวรับ output ของตัวก่อนเป็น input ก่อนสร้างไฟล์ผลลัพธ์

**Tech Stack:** Claude Code slash commands, Agent tool (subagent-driven), WebSearch, Node.js html-to-png.js (Chrome headless), ภาษาไทย HTML5/CSS (Sarabun font)

---

## File Map

| Action | ไฟล์ | หน้าที่ |
|--------|------|---------|
| **Create** | `.claude/commands/legal-news.md` | Skill หลัก — pipeline instructions ครบทุกขั้น |
| **Output (auto)** | `news-legal-digest/YYYY-MM-DD_HH-MM-SS_legal-news-digest.txt` | Text digest สร้างโดย skill |
| **Output (auto)** | `output/legal-news.html` | HTML report สร้างโดย skill (overwrite) |
| **Output (auto)** | `output/legal-news-YYYY-MM-DD.png` | PNG screenshot สร้างโดย skill |
| **Reuse (no change)** | `tools/html-to-png.js` | Screenshot tool ที่มีอยู่แล้ว |
| **Reuse (no change)** | `.claude/agents/content-creator.md` | Agent persona |
| **Reuse (no change)** | `.claude/agents/seo-specialist.md` | Agent persona |
| **Reuse (no change)** | `.claude/agents/legal-advisor.md` | Agent persona |

---

## Task 1: สร้าง Skill File หลัก

**Files:**
- Create: `.claude/commands/legal-news.md`

### Skill File Structure

Skill file แบ่งเป็น 5 ส่วนหลัก ตาม pipeline:

---

- [ ] **Step 1: สร้างไฟล์ `.claude/commands/legal-news.md`** ด้วยเนื้อหาด้านล่างนี้ทั้งหมด (copy verbatim):

```markdown
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

Spawn subagent ประเภท `content-creator` ด้วย prompt ด้านล่างนี้:

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

Spawn subagent ประเภท `seo-specialist` ด้วย prompt ด้านล่างนี้:

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

ก่อน spawn: นับเลข LO ล่าสุดจากไฟล์ใน `news-legal-digest/` โดยค้นหา pattern `LO-2026-` ในไฟล์ล่าสุด แล้วบวก 1 เก็บเป็น `next_lo_number` (format: 3 หลัก เช่น 010, 011)

Spawn subagent ประเภท `legal-advisor` ด้วย prompt ด้านล่างนี้:

```
คุณคือ ดร.วรรณา สิทธิชัย, Chief Legal Advisor ของ Lawyer Near Me

จากสรุปข่าว: [content_summary]
และการวิเคราะห์ SEO: [seo_analysis]

งานของคุณ: ออก Legal Opinion อย่างเป็นทางการ ในรูปแบบมาตรฐาน:

================================================================================
LEGAL OPINION REF: LO-2026-[next_lo_number]
Date: [วันที่ปัจจุบัน ภาษาไทย]
Requested by: Marketing Team / Content Pipeline
Subject: วิเคราะห์ประเด็นกฎหมายจากข่าวกระแสสังคม [N] กรณี
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
[รูปแบบเดียวกัน]

ประเด็นที่ 3: [ชื่อข่าว]
[รูปแบบเดียวกัน]

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

สร้างเนื้อหาของไฟล์ `.txt` ในรูปแบบต่อไปนี้ แล้วเขียนลงไฟล์:

**ชื่อไฟล์**: `news-legal-digest/[YYYY-MM-DD]_[HH-MM-SS]_legal-news-digest.txt`
(ใช้วันที่และเวลาปัจจุบัน format: 2026-06-05_14-30-00)

**เนื้อหา**:
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

เขียนไฟล์ `output/legal-news.html` ด้วย HTML ต่อไปนี้ (แทนค่า placeholder ด้วยข้อมูลจริงจาก steps ก่อนหน้า):

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

  /* TOPBAR */
  .topbar { background: #B71C1C; color: #fff; display: flex; align-items: center; justify-content: space-between; padding: 0 32px; height: 44px; font-size: 13px; font-weight: 600; letter-spacing: 0.5px; }
  .topbar-left { display: flex; align-items: center; gap: 20px; }
  .breaking-badge { background: #fff; color: #B71C1C; font-weight: 800; font-size: 11px; padding: 3px 10px; border-radius: 2px; letter-spacing: 1px; text-transform: uppercase; }

  /* HEADER */
  .header { background: #fff; border-bottom: 3px solid #B71C1C; padding: 16px 32px; display: flex; align-items: center; justify-content: space-between; }
  .logo-name { font-size: 22px; font-weight: 800; color: #1B3A8B; }
  .logo-sub { font-size: 12px; color: #666; }
  .header-section-tag { font-size: 13px; font-weight: 700; color: #B71C1C; border: 2px solid #B71C1C; padding: 4px 14px; border-radius: 4px; }

  /* LAYOUT */
  .main-wrap { display: flex; gap: 24px; padding: 24px 32px 32px; }
  .main-col { flex: 2; display: flex; flex-direction: column; gap: 20px; }
  .side-col { flex: 1; display: flex; flex-direction: column; gap: 16px; }

  /* NEWS CARDS */
  .news-card { background: #fff; border-radius: 10px; padding: 20px 24px; border-left: 5px solid #B71C1C; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
  .news-number { font-size: 11px; font-weight: 700; color: #B71C1C; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
  .news-title { font-size: 20px; font-weight: 800; color: #1a1a1a; margin-bottom: 14px; line-height: 1.4; }
  .news-section { margin-bottom: 12px; }
  .news-section-label { font-size: 11px; font-weight: 700; color: #1B3A8B; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 4px; }
  .news-section-body { font-size: 15px; line-height: 1.7; color: #333; }
  .practice-tag { display: inline-block; background: #E3F2FD; color: #1B3A8B; font-size: 12px; font-weight: 600; padding: 3px 10px; border-radius: 20px; margin-top: 8px; }
  .disclaimer { font-size: 12px; color: #888; font-style: italic; margin-top: 12px; padding-top: 10px; border-top: 1px solid #eee; }

  /* SIDEBAR */
  .side-card { background: #fff; border-radius: 10px; padding: 18px 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
  .side-card-title { font-size: 13px; font-weight: 800; color: #1B3A8B; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 2px solid #E3F2FD; }

  /* LEGAL OPINION */
  .legal-section { background: #fff; margin: 0 32px 32px; border-radius: 10px; padding: 28px 32px; border-top: 4px solid #1B3A8B; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
  .legal-ref { font-size: 12px; color: #888; margin-bottom: 6px; }
  .legal-title { font-size: 18px; font-weight: 800; color: #1B3A8B; margin-bottom: 16px; }
  .legal-body { font-size: 14px; line-height: 1.8; color: #333; white-space: pre-wrap; font-family: 'Sarabun', sans-serif; }

  /* SEO PANEL */
  .seo-panel { background: #F3F4F6; border-radius: 8px; padding: 14px 16px; }
  .keyword-pill { display: inline-block; background: #1B3A8B; color: #fff; font-size: 11px; padding: 3px 9px; border-radius: 12px; margin: 3px 3px 3px 0; }
  .seo-item { margin-bottom: 14px; }
  .seo-item-label { font-size: 11px; color: #666; font-weight: 600; margin-bottom: 4px; }

  /* RISK MATRIX */
  .risk-item { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; font-size: 13px; }
  .risk-stars { color: #B71C1C; font-size: 14px; }

  /* FOOTER */
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

    <!-- ข่าวที่ 1 -->
    <div class="news-card">
      <div class="news-number">ข่าวที่ 1</div>
      <div class="news-title">[หัวข้อข่าวที่ 1 จาก content_summary]</div>
      <div class="news-section">
        <div class="news-section-label">เกิดอะไรขึ้น?</div>
        <div class="news-section-body">[สรุปข่าวที่ 1]</div>
      </div>
      <div class="news-section">
        <div class="news-section-label">เกี่ยวกับคุณอย่างไร?</div>
        <div class="news-section-body">[ผลกระทบข่าวที่ 1]</div>
      </div>
      <div class="news-section">
        <div class="news-section-label">ควรทำอย่างไร?</div>
        <div class="news-section-body">[คำแนะนำข่าวที่ 1]</div>
      </div>
      <div><span class="practice-tag">[practice area ข่าวที่ 1]</span></div>
      <div class="disclaimer">ข้อมูลนี้เพื่อการศึกษาทั่วไป ไม่ใช่คำปรึกษาทางกฎหมาย</div>
    </div>

    <!-- ข่าวที่ 2 -->
    <div class="news-card">
      <div class="news-number">ข่าวที่ 2</div>
      <div class="news-title">[หัวข้อข่าวที่ 2]</div>
      <div class="news-section">
        <div class="news-section-label">เกิดอะไรขึ้น?</div>
        <div class="news-section-body">[สรุปข่าวที่ 2]</div>
      </div>
      <div class="news-section">
        <div class="news-section-label">เกี่ยวกับคุณอย่างไร?</div>
        <div class="news-section-body">[ผลกระทบข่าวที่ 2]</div>
      </div>
      <div class="news-section">
        <div class="news-section-label">ควรทำอย่างไร?</div>
        <div class="news-section-body">[คำแนะนำข่าวที่ 2]</div>
      </div>
      <div><span class="practice-tag">[practice area ข่าวที่ 2]</span></div>
      <div class="disclaimer">ข้อมูลนี้เพื่อการศึกษาทั่วไป ไม่ใช่คำปรึกษาทางกฎหมาย</div>
    </div>

    <!-- ข่าวที่ 3 -->
    <div class="news-card">
      <div class="news-number">ข่าวที่ 3</div>
      <div class="news-title">[หัวข้อข่าวที่ 3]</div>
      <div class="news-section">
        <div class="news-section-label">เกิดอะไรขึ้น?</div>
        <div class="news-section-body">[สรุปข่าวที่ 3]</div>
      </div>
      <div class="news-section">
        <div class="news-section-label">เกี่ยวกับคุณอย่างไร?</div>
        <div class="news-section-body">[ผลกระทบข่าวที่ 3]</div>
      </div>
      <div class="news-section">
        <div class="news-section-label">ควรทำอย่างไร?</div>
        <div class="news-section-body">[คำแนะนำข่าวที่ 3]</div>
      </div>
      <div><span class="practice-tag">[practice area ข่าวที่ 3]</span></div>
      <div class="disclaimer">ข้อมูลนี้เพื่อการศึกษาทั่วไป ไม่ใช่คำปรึกษาทางกฎหมาย</div>
    </div>

  </div><!-- end main-col -->

  <div class="side-col">

    <!-- Legal Opinion Summary -->
    <div class="side-card">
      <div class="side-card-title">Legal Opinion</div>
      <div style="font-size:11px;color:#888;margin-bottom:8px;">LO-2026-[next_lo_number] | ดร.วรรณา สิทธิชัย</div>
      <div style="font-size:14px;line-height:1.7;">[Executive Summary จาก legal_opinion — 2-3 ประโยค]</div>
    </div>

    <!-- SEO Keywords Panel -->
    <div class="side-card">
      <div class="side-card-title">SEO Keywords Panel</div>
      <div class="seo-panel">
        <div class="seo-item">
          <div class="seo-item-label">ข่าวที่ 1 — Keywords</div>
          <div>[keyword pills จาก seo_analysis ข่าวที่ 1: <span class="keyword-pill">keyword</span>]</div>
        </div>
        <div class="seo-item">
          <div class="seo-item-label">ข่าวที่ 2 — Keywords</div>
          <div>[keyword pills จาก seo_analysis ข่าวที่ 2]</div>
        </div>
        <div class="seo-item">
          <div class="seo-item-label">ข่าวที่ 3 — Keywords</div>
          <div>[keyword pills จาก seo_analysis ข่าวที่ 3]</div>
        </div>
      </div>
    </div>

    <!-- Practice Areas -->
    <div class="side-card">
      <div class="side-card-title">Practice Areas ที่เกี่ยวข้อง</div>
      <div style="font-size:14px;line-height:2;">
        [รายการ practice areas จาก seo_analysis พร้อม intent]
      </div>
    </div>

    <!-- Priority Actions -->
    <div class="side-card" style="border-left: 4px solid #B71C1C;">
      <div class="side-card-title" style="color:#B71C1C;">Priority Actions</div>
      <div style="font-size:13px;line-height:1.8;">
        [Priority Actions จาก legal_opinion — IMMEDIATE และ SHORT-TERM]
      </div>
    </div>

    <!-- Risk Matrix -->
    <div class="side-card">
      <div class="side-card-title">Risk Matrix</div>
      <div class="risk-item"><span class="risk-stars">[★ stars]</span><span style="font-size:13px;">[ข่าวที่ 1 ชื่อย่อ]</span></div>
      <div class="risk-item"><span class="risk-stars">[★ stars]</span><span style="font-size:13px;">[ข่าวที่ 2 ชื่อย่อ]</span></div>
      <div class="risk-item"><span class="risk-stars">[★ stars]</span><span style="font-size:13px;">[ข่าวที่ 3 ชื่อย่อ]</span></div>
    </div>

  </div><!-- end side-col -->
</div><!-- end main-wrap -->

<!-- Full Legal Opinion -->
<div class="legal-section">
  <div class="legal-ref">LO-2026-[next_lo_number] | Classification: INTERNAL USE ONLY</div>
  <div class="legal-title">Legal Opinion — วิเคราะห์ประเด็นกฎหมายจากข่าวกระแสสังคม</div>
  <div class="legal-body">[legal_opinion เต็ม]</div>
</div>

<div class="footer">
  <strong>แหล่งข้อมูล:</strong> [URLs จาก WebSearch]<br>
  <strong>หมายเหตุ:</strong> เนื้อหานี้จัดทำเพื่อการศึกษาทั่วไป ไม่ใช่คำปรึกษาทางกฎหมาย | สร้างโดย /legal-news skill | [timestamp]
</div>

</body>
</html>
```

### 5c. Screenshot เป็น PNG

รัน command ต่อไปนี้:

```
node tools/html-to-png.js output/legal-news.html output/legal-news-[YYYY-MM-DD].png
```

ถ้า Node.js หรือ Chrome ไม่พร้อม ให้แสดงข้อความใน terminal:
```
[SKIP] PNG screenshot ข้าม — ตรวจสอบว่า Node.js และ Chrome ติดตั้งแล้ว
HTML report พร้อมที่: output/legal-news.html
```
แล้วดำเนิน Step ต่อไปโดยไม่หยุด

### 5d. แสดง Summary ใน Terminal

แสดงผลสรุปใน terminal:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 /legal-news — เสร็จสมบูรณ์
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 ข่าว 3 ข่าว | Legal Opinion: LO-2026-[N]
 
 ไฟล์ที่สร้าง:
 📄 news-legal-digest/[timestamp]_legal-news-digest.txt
 🌐 output/legal-news.html
 🖼️ output/legal-news-[YYYY-MM-DD].png
 
 ประเด็นสำคัญ: [หัวข้อข่าวที่ 1], [ข่าวที่ 2], [ข่าวที่ 3]
 Risk สูงสุด: [ข่าวที่มี risk stars สูงสุด]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 ทุก content ที่จะ publish ต้องผ่าน Legal Advisor review
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```
```

---

- [ ] **Step 2: ตรวจสอบไฟล์ถูกสร้างและอยู่ในตำแหน่งที่ถูกต้อง**

ใช้ Glob หรือ Bash เพื่อยืนยัน:
```powershell
Get-ChildItem ".claude\commands\legal-news.md"
```
Expected output: แสดงไฟล์ที่มีขนาด > 0 bytes

- [ ] **Step 3: ตรวจสอบ syntax และ placeholder ใน skill file**

อ่านไฟล์ `.claude/commands/legal-news.md` และตรวจสอบ:
- มี `$ARGUMENTS` อยู่ใน Step 1 (ส่วน GATHER)
- มีการ mention `combined_news_context`, `content_summary`, `seo_analysis`, `legal_opinion`, `next_lo_number` ครบทุกจุดที่ต้องใช้
- มีทุก Step ตั้งแต่ 1 ถึง 5
- มี disclaimer ใน HTML template และ txt template

---

## Task 2: ทดสอบ Skill ด้วยการรันจริง

**Files:**
- Output (verify): `news-legal-digest/*.txt` (ไฟล์ใหม่)
- Output (verify): `output/legal-news.html`
- Output (verify): `output/legal-news-[date].png`

- [ ] **Step 1: รัน skill โดยไม่มี argument**

พิมพ์ใน Claude Code:
```
/legal-news
```

ผลที่คาดหวัง:
- Claude เริ่ม Step 1 (GATHER) — WebSearch หาข่าว
- Claude spawn content-creator subagent (Step 2)
- Claude spawn seo-specialist subagent (Step 3)
- Claude spawn legal-advisor subagent (Step 4)
- Claude สร้างไฟล์ output (Step 5)
- แสดง summary ใน terminal

- [ ] **Step 2: ตรวจสอบ TXT digest ถูกสร้าง**

```powershell
Get-ChildItem "news-legal-digest\" | Sort-Object LastWriteTime -Descending | Select-Object -First 1
```

Expected: มีไฟล์ใหม่ที่สร้างหลังจากรัน skill ชื่อ format `YYYY-MM-DD_HH-MM-SS_legal-news-digest.txt`

อ่านไฟล์และตรวจสอบ:
- มีส่วนที่ 1 (Content Creator), ส่วนที่ 2 (SEO), ส่วนที่ 3 (Legal Opinion)
- มี LO reference number
- มี disclaimer ท้ายไฟล์

- [ ] **Step 3: ตรวจสอบ HTML ถูกอัปเดต**

```powershell
Get-Item "output\legal-news.html" | Select-Object LastWriteTime, Length
```

Expected: `LastWriteTime` ต้องใหม่กว่าเวลาก่อนรัน skill, `Length` > 5000 bytes

เปิดไฟล์ใน browser เพื่อตรวจสอบ visual:
- มี topbar, header, news cards 3 ใบ
- มี SEO Keywords Panel ใน sidebar
- มี Legal Opinion section ด้านล่าง
- มี footer พร้อม disclaimer

- [ ] **Step 4: ตรวจสอบ PNG (ถ้า Chrome พร้อม)**

```powershell
Get-ChildItem "output\legal-news-*.png" | Sort-Object LastWriteTime -Descending | Select-Object -First 1
```

Expected: มีไฟล์ `.png` ชื่อ `legal-news-[วันนี้].png`, ขนาด > 100KB

- [ ] **Step 5: รัน skill พร้อม argument เพื่อทดสอบ topic filter**

พิมพ์ใน Claude Code:
```
/legal-news แรงงาน
```

ผลที่คาดหวัง:
- ข่าวที่ปรากฏใน output เน้นประเด็นแรงงานมากกว่าครั้งแรก
- ไฟล์ TXT ใหม่มี `Topic filter: แรงงาน` ในหัวไฟล์
- LO number เพิ่มขึ้น 1 จากครั้งแรก

---

## Self-Review Checklist

### Spec Coverage

| Spec Section | Task ที่ implement |
|---|---|
| Sequential pipeline 5 ขั้น | Task 1 Step 1 (skill file มี Step 1-5 ครบ) |
| WebSearch real-time + existing files | Step 1 GATHER ใน skill |
| content-creator agent | Step 2 ใน skill |
| seo-specialist agent | Step 3 ใน skill |
| legal-advisor agent (LO format) | Step 4 ใน skill |
| HTML output (layout + SEO panel) | Step 5b ใน skill |
| TXT digest (format กำหนดไว้) | Step 5a ใน skill |
| PNG screenshot | Step 5c ใน skill |
| Error handling (ไม่พบ Chrome/Node) | Step 5c fallback ใน skill |
| Compliance disclaimers | ทั้ง HTML template, TXT template, summary |
| `/legal-news [topic]` argument | `$ARGUMENTS` ใน Step 1 |

ไม่พบช่องว่าง — ครอบคลุมทุก requirement ใน spec

### ไม่มี placeholder ที่ยังไม่สมบูรณ์

ทุก step มีเนื้อหาจริง ไม่มี "TBD" หรือ "implement later"

### Type/Variable Consistency

| Variable | กำหนดใน | ใช้ใน |
|---|---|---|
| `$ARGUMENTS` | Step 1 header | Step 1a query, Step 5a filename |
| `raw_news_search` | Step 1a | Step 1c |
| `existing_digest` | Step 1b | Step 1c |
| `combined_news_context` | Step 1c | Step 2 prompt |
| `content_summary` | Step 2 | Step 3 prompt, Step 4 prompt, Step 5a |
| `seo_analysis` | Step 3 | Step 4 prompt, Step 5a, Step 5b |
| `legal_opinion` | Step 4 | Step 5a, Step 5b |
| `next_lo_number` | Step 4 header | Step 4 prompt, Step 5b |

ทุก variable สอดคล้องกัน
