# Design Spec: `/legal-news` Slash Command Skill

**Date**: 2026-06-05  
**Status**: Approved for Implementation  
**Author**: Brainstorming Session

---

## 1. Overview

`/legal-news` คือ Claude Code slash command skill สำหรับ Lawyer Near Me ที่เมื่อรันแล้วจะ:

1. ค้นหาข่าวกระแสสังคมไทยแบบ real-time (WebSearch) + อ่าน digest ที่มีอยู่
2. ใช้ agents 3 ตัวทำงานตามลำดับ: content-creator → seo-specialist → legal-advisor
3. สร้าง output: `.txt` digest + `.html` report + `.png` screenshot

**Command**: `/legal-news [หัวข้อ optional]`  
**ตัวอย่าง**: `/legal-news`, `/legal-news เศรษฐกิจ`, `/legal-news แรงงาน`

---

## 2. Architecture: Sequential Pipeline

```
/legal-news [topic?]
    │
    ├─ Step 1: GATHER
    │   ├─ WebSearch: "ข่าวกระแสสังคมไทย [topic] [วันนี้]"
    │   ├─ WebSearch: "Thailand legal news [topic] [today]"
    │   └─ Read: news-digest/ และ news-legal-digest/ ไฟล์ล่าสุด (ถ้ามี)
    │
    ├─ Step 2: CONTENT CREATOR AGENT (subagent)
    │   ├─ persona: คุณมินตรา ชัยศรี, Content Creator
    │   ├─ input: ข่าวดิบจาก Step 1
    │   ├─ output: สรุปข่าว 3 ข่าว พร้อม "เกี่ยวกับคุณอย่างไร" และ "ควรทำอย่างไร"
    │   └─ format: ภาษาไทย, เข้าใจง่าย, ไม่ใช้ศัพท์กฎหมายซับซ้อน
    │
    ├─ Step 3: SEO SPECIALIST AGENT (subagent)
    │   ├─ persona: SEO Specialist, Lawyer Near Me
    │   ├─ input: ข่าวสรุปจาก Step 2
    │   ├─ output: keywords หลัก, search intent, Practice Area ที่ควร link
    │   └─ format: keyword list + intent mapping ต่อข่าว
    │
    ├─ Step 4: LEGAL ADVISOR AGENT (subagent)
    │   ├─ persona: ดร.วรรณา สิทธิชัย, Chief Legal Advisor
    │   ├─ input: ข่าวสรุป (Step 2) + SEO context (Step 3)
    │   ├─ output: Legal Opinion (LO-YYYY-NNN) พร้อม Priority Actions
    │   └─ format: เป็นทางการ, ระบุกฎหมายที่เกี่ยวข้อง, Risk Matrix
    │
    └─ Step 5: RENDER & SAVE
        ├─ สร้าง HTML report (ดีไซน์สไตล์ legal-news.html เดิม + SEO panel)
        ├─ บันทึก .txt digest → news-legal-digest/YYYY-MM-DD_HH-MM-SS_legal-news-digest.txt
        ├─ Screenshot HTML → output/legal-news-YYYY-MM-DD.png (ใช้ tools/html-to-png.js)
        └─ แสดง summary ใน terminal
```

---

## 3. Skill File Specification

**ตำแหน่ง**: `.claude/commands/legal-news.md`

### 3.1 Trigger & Arguments

```
/legal-news              → ค้นหาข่าวทั่วไป (ไม่เจาะหัวข้อ)
/legal-news [หัวข้อ]    → เจาะเฉพาะหัวข้อ เช่น แรงงาน, อสังหา, ดิจิทัล
```

### 3.2 Agent Personas

Skill จะ spawn 3 subagents ตามลำดับ โดยแต่ละตัวรับ output จากตัวก่อนหน้าเป็น input:

| Agent | Subagent Type | Role |
|-------|---------------|------|
| Content Creator | `content-creator` | สรุปข่าวภาษาชาวบ้าน |
| SEO Specialist | `seo-specialist` | วิเคราะห์ keywords |
| Legal Advisor | `legal-advisor` | Legal Opinion อย่างเป็นทางการ |

### 3.3 Output Files

| ไฟล์ | ตำแหน่ง | รูปแบบ |
|------|---------|--------|
| Text digest | `news-legal-digest/YYYY-MM-DD_HH-MM-SS_legal-news-digest.txt` | UTF-8 text |
| HTML report | `output/legal-news.html` (overwrite) | HTML5 |
| PNG screenshot | `output/legal-news-YYYY-MM-DD.png` | PNG 1400px wide |

---

## 4. HTML Report Design

ใช้ layout เดิมจาก `output/legal-news.html` เป็นฐาน เพิ่ม **SEO Keywords Panel** ใหม่:

```
┌─────────────────────────────────────────────────────────────────┐
│ TOPBAR: BREAKING | วันที่ | Lawyer Near Me                      │
├─────────────────────────────────────────────────────────────────┤
│ HEADER: Logo | ข่าวกระแสสังคมและประเด็นข้อพิพาทกฎหมาย         │
├───────────────────────────────┬─────────────────────────────────┤
│                               │                                 │
│  MAIN CONTENT (2/3 width)     │  SIDEBAR (1/3 width)           │
│  ─────────────────────────    │  ─────────────────────────      │
│  • ข่าวที่ 1 (card)           │  • Legal Opinion Summary        │
│    - สรุปข่าว                 │  • SEO Keywords Panel (ใหม่)   │
│    - เกี่ยวกับคุณอย่างไร       │  • Practice Areas ที่เกี่ยวข้อง │
│    - ควรทำอย่างไร             │  • Priority Actions             │
│                               │                                 │
│  • ข่าวที่ 2 (card)           │                                 │
│  • ข่าวที่ 3 (card)           │                                 │
│                               │                                 │
├───────────────────────────────┴─────────────────────────────────┤
│ LEGAL OPINION SECTION (full width)                              │
│ ─────────────────────────────────────────────────────────────── │
│ • LO-YYYY-NNN | กฎหมายที่เกี่ยวข้อง | Risk Matrix             │
├─────────────────────────────────────────────────────────────────┤
│ FOOTER: Sources | หมายเหตุ disclaimer                           │
└─────────────────────────────────────────────────────────────────┘
```

**สีและ Typography**: คงสไตล์เดิม (สีหลัก `#B71C1C` + `#1B3A8B`, ฟอนต์ Sarabun)

---

## 5. Text Digest Format

```
================================================================================
LAWYER NEAR ME — ข่าวกระแสสังคมและประเด็นข้อพิพาทกฎหมาย
Timestamp: YYYY-MM-DD HH:MM:SS
Generated by: /legal-news skill | Sequential Pipeline v1.0
================================================================================

ส่วนที่ 1: สรุปข่าวกระแสสังคม [content-creator agent]
...

ส่วนที่ 2: SEO Keywords & Practice Areas [seo-specialist agent]
...

ส่วนที่ 3: Legal Opinion (LO-YYYY-NNN) [legal-advisor agent]
...

แหล่งข้อมูล
...
================================================================================
```

---

## 6. Error Handling

| สถานการณ์ | การจัดการ |
|-----------|-----------|
| WebSearch ไม่พบข่าวใหม่ | ใช้ไฟล์ digest ล่าสุดแทน |
| ไม่มีไฟล์ digest เดิม | ใช้ WebSearch อย่างเดียว |
| html-to-png.js ไม่พบ | ข้าม PNG step, แจ้งใน terminal |
| Agent ล้มเหลว | หยุด pipeline, แสดง error ชัดเจน |

---

## 7. Skill File Structure (`.claude/commands/legal-news.md`)

Skill file จะมีโครงสร้าง:
1. **Metadata & trigger**: คำอธิบาย, วิธีใช้ `$ARGUMENTS`
2. **Step-by-step instructions**: สั่ง Claude ทำตาม 5 ขั้น
3. **Agent prompts**: prompt สำหรับแต่ละ subagent (ระบุ persona ชัด)
4. **Output templates**: format ของ HTML และ txt
5. **Legal disclaimer**: reminder ให้ใส่ disclaimer ใน output ทุกครั้ง

---

## 8. Compliance Notes

- Output ทุกชิ้นต้องมีข้อความ: *"เนื้อหานี้จัดทำเพื่อการศึกษาทั่วไป ไม่ใช่คำปรึกษาทางกฎหมาย"*
- Legal Opinion ต้องระบุ classification: `INTERNAL USE ONLY`
- ห้ามระบุชื่อทนายความจริงโดยไม่ได้รับอนุญาต
- ทุก content ที่จะ publish จริงต้องผ่าน Legal Advisor review อีกครั้ง

---

## 9. Out of Scope

- ไม่รองรับการ push content ไปยัง social media โดยตรง
- ไม่ทำ real-time monitoring (ใช้ cron job แยกต่างหาก)
- ไม่เชื่อมต่อฐานข้อมูลทนายความ

---

## 10. Files to Create/Modify

| Action | ไฟล์ |
|--------|------|
| **Create** | `.claude/commands/legal-news.md` (skill หลัก) |
| **Create** | `docs/superpowers/specs/2026-06-05-legal-news-skill-design.md` (เอกสารนี้) |
| **Existing (reuse)** | `tools/html-to-png.js` |
| **Existing (reuse)** | `.claude/agents/*.md` (agent personas) |
| **Output dirs (existing)** | `news-legal-digest/`, `output/` |
