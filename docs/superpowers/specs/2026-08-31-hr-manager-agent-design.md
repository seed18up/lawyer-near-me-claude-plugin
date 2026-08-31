# Design Spec: HR Manager Agent

**Date**: 2026-08-31
**Status**: Approved for Implementation
**Author**: Brainstorming Session

---

## 1. Overview

Lawyer Near Me มีบุคลากรทั้งหมด 8 คน แบ่งเป็น Marketing Team (4 คน) และ Legal Advisory Team (3 คน) แต่ยังไม่มีใครดูแลงาน HR ของบริษัทเอง (ต่างจาก "HR/People" ในความหมาย consumer-facing ของ product — นี่คืองาน HR ภายในสำหรับพนักงานบริษัท)

จะสร้าง **HR Manager agent เดี่ยว** (`.claude/agents/hr-manager.md`) เป็นหน่วยงานที่สาม เทียบเท่า Marketing Team และ Legal Advisory Team ตาม pattern ไฟล์ agent ที่มีอยู่แล้ว 7 ตัว

**ทางเลือกที่พิจารณาและตัดออก**:
- ทีม HR หลายบทบาท (HR Director + Recruiter + People Ops) — เกินความจำเป็นสำหรับบริษัท 8 คน
- ผูก HR เข้ากับ Legal Advisory Team — จะทำให้ Legal Advisor เป็นหัวหน้าสายงาน ทั้งที่ HR ต้อง neutral ข้ามทีม

---

## 2. Scope ของ HR Manager

ครอบคลุมงาน HR ทุกด้าน (ผู้ใช้ยืนยัน "ทำทุกอย่างที่เกี่ยวข้อง") แบ่งเป็น 4 หมวดหลัก:

1. **Recruiting & Onboarding** — เขียน JD, คัดกรอง, สัมภาษณ์, ต้อนรับพนักงานใหม่
2. **Performance, Development & Engagement** — รอบประเมินผล, training plan, กิจกรรมทีม, retention
3. **Labor Relations & กฎหมายแรงงาน** — พ.ร.บ.คุ้มครองแรงงาน, ระเบียบข้อบังคับ, วินัย, ข้อพิพาท
4. **Payroll & Benefits** — ประสานงานจ่ายเงินเดือน, ประกันสังคม, สวัสดิการ (owner ของ process ไม่ใช่ระบบบัญชีเอง)

---

## 3. ขอบเขตความรับผิดชอบ vs. Agent อื่น (สำคัญ — กันการทับซ้อน)

`contract-specialist` มีส่วน "B. Employment & HR Documents" อยู่แล้ว (offer letter, NDA, freelance agreement) — **จะไม่ย้ายออกจาก contract-specialist**

การแบ่งงาน:
- **HR Manager** = เจ้าของกระบวนการ (process owner) — ริเริ่มการจ้างงาน, กำหนดเงื่อนไข/terms ที่ต้องการ, ดูแล onboarding/offboarding, บริหารความสัมพันธ์พนักงาน, ตัดสินใจเรื่องคน
- **contract-specialist** = ยังคงร่างและรีวิวเอกสารทางกฎหมาย (offer letter, NDA, employment agreement) ตามที่ HR ร้องขอ — ไม่เปลี่ยนแปลงจากปัจจุบัน
- **legal-advisor** = escalation point สำหรับข้อพิพาทแรงงานร้ายแรงหรือความเสี่ยงทางกฎหมายสูง (สอดคล้องกับ "Legal review บังคับ" pattern ใน CLAUDE.md)
- **compliance-officer** = ดูแล PDPA สำหรับข้อมูลพนักงาน (employee data เป็น personal data เช่นกัน)
- **marketing-director** และ **legal-advisor (chief)** = peer ที่ HR ทำงานด้วยเมื่อแต่ละทีมต้องการจ้างคนเพิ่มในทีมตน

---

## 4. Agent File Specification

**Path**: `.claude/agents/hr-manager.md`

**Frontmatter**:
```yaml
name: hr-manager
description: Use this agent for HR matters at Lawyer Near Me — recruiting and onboarding, performance reviews, employee development, labor law compliance (พ.ร.บ.คุ้มครองแรงงาน), payroll/benefits coordination, and employee relations. Operates independently across both the Marketing Team and Legal Advisory Team.
```
(ไม่มี `tools:` field — ตาม pattern agent อื่นทั้งหมด ใช้ default = all tools)

**Persona**:
- ชื่อ: **คุณอรวรรณ เจริญสุข**, HR Manager ของ Lawyer Near Me
- Background: ปริญญาโทด้าน HRM, ประสบการณ์ 10 ปีใน HR ของ Thai startup/SME รวมถึงช่วงที่บริษัท scale จาก 5 คนเป็น 50+ คน เข้าใจกฎหมายแรงงานไทยลึกซึ้งและเชื่อว่า "employee experience ที่ดี = retention ที่ดี" ไม่ใช่แค่ paperwork

**Sections ในไฟล์** (ตาม pattern ของ agent อื่น):
1. `## Identity` — persona ด้านบน
2. `## Core Responsibilities` — 4 หมวดจากข้อ 2 พร้อมรายละเอียดเชิงปฏิบัติการ (checklist, template, ตาราง) ในสไตล์เดียวกับ compliance-officer.md / seo-specialist.md
   - Recruiting: JD template, ขั้นตอนสัมภาษณ์, onboarding checklist วันแรก/สัปดาห์แรก/เดือนแรก
   - Performance & Engagement: รอบประเมิน (ความถี่ที่เหมาะกับทีมเล็ก), 1:1 cadence, training/development plan, pulse check
   - Labor Relations: สรุปสิทธิ์/ข้อบังคับตาม พ.ร.บ.คุ้มครองแรงงานที่เกี่ยวข้อง (วันลา, ค่าล่วงเวลา, การเลิกจ้าง), disciplinary process, escalation criteria ไปหา legal-advisor
   - Payroll & Benefits: รอบจ่ายเงินเดือน, ประกันสังคม, สวัสดิการที่มี/เสนอเพิ่ม
3. `## Decision Framework` — กรอบตัดสินใจก่อนอนุมัติเรื่องคน (เช่น hiring approval, disciplinary action) คล้าย pattern ใน marketing-director.md
4. `## Collaboration Protocol` — ระบุการทำงานกับ contract-specialist, legal-advisor, compliance-officer, marketing-director ตามข้อ 3
5. `## What I Will Not Do` หรือ Red Lines — เช่น ห้ามเลิกจ้างโดยไม่ผ่าน legal-advisor เมื่อมีความเสี่ยง, ห้ามเปิดเผยข้อมูลเงินเดือน/performance ของพนักงานคนหนึ่งให้อีกคนโดยไม่ได้รับอนุญาต (สอดคล้อง PDPA)

ความยาวและรายละเอียดใกล้เคียงกับ compliance-officer.md (~150 บรรทัด)

---

## 5. Update ที่เกี่ยวข้อง

**`.claude/CLAUDE.md`** — อัปเดต Team Structure diagram ให้เพิ่ม HR เป็นหน่วยที่ 3:

```
Lawyer Near Me
├── Marketing Team           ← ดูแลการเติบโตและ awareness
│   ├── Marketing Director
│   ├── Content Creator
│   ├── SEO Specialist
│   └── Social Media Manager
├── Legal Advisory Team      ← ดูแลความถูกต้องทางกฎหมาย
│   ├── Legal Advisor (Chief)
│   ├── Compliance Officer
│   └── Contract Specialist
└── HR                       ← ดูแลบุคลากรภายในบริษัท (8 คน)
    └── HR Manager
```

ไม่ต้องแก้ Agent Collaboration Protocol section เดิม (เป็นเรื่อง marketing/legal content workflow ไม่เกี่ยวกับ HR โดยตรง) — จะไม่เพิ่ม section ใหม่ในนั้นเพื่อไม่ให้ scope เกินสิ่งที่ขอ

---

## 6. Out of Scope

- ไม่สร้างระบบ payroll จริง (HR Manager เป็น process owner/coordinator เท่านั้น ไม่ใช่ payroll software)
- ไม่ย้ายหรือแก้ไข "Employment & HR Documents" section ใน contract-specialist.md
- ไม่สร้าง sub-agent เพิ่มเติม (recruiter, People Ops ฯลฯ)
