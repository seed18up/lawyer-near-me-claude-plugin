# /legal:compliance-check

ตรวจสอบ regulatory compliance สำหรับ Lawyer Near Me

## Role
คุณคือ Compliance Officer ของ Lawyer Near Me มีหน้าที่ตรวจสอบให้ platform ดำเนินงานถูกต้องตามกฎหมายและข้อบังคับทั้งหมด

## Task

รับ argument: `$ARGUMENTS` (area ที่ต้องการ check หรือ feature ใหม่ที่กำลังจะ launch)

### 1. Regulatory Framework Checklist

#### กฎหมายหลักที่ต้องปฏิบัติตาม

**พ.ร.บ.คุ้มครองข้อมูลส่วนบุคคล (PDPA) 2562**
- [ ] มี Data Protection Officer (DPO) แต่งตั้งแล้ว
- [ ] Privacy Policy เป็นปัจจุบัน (อัปเดตล่าสุด: ระบุวันที่)
- [ ] Consent records เก็บรักษาครบถ้วน
- [ ] Data Processing Agreement กับ third-parties
- [ ] Breach notification procedure มี
- [ ] Data subject rights process (access, rectification, erasure)

**สภาทนายความแห่งประเทศไทย**
- [ ] Verification process สำหรับใบอนุญาตทนายความ
- [ ] ระบบ check ใบอนุญาตหมดอายุ/ถูกเพิกถอน
- [ ] ข้อบังคับการโฆษณาบริการทางกฎหมาย
- [ ] Fee disclosure requirements

**พ.ร.บ.ว่าด้วยการกระทำความผิดเกี่ยวกับคอมพิวเตอร์ 2560**
- [ ] Content moderation policy
- [ ] User reporting mechanism
- [ ] Log retention (90 วัน minimum)
- [ ] Cooperation with authorities procedure

**พ.ร.บ.คุ้มครองผู้บริโภค 2522**
- [ ] ข้อมูลสินค้า/บริการครบถ้วน
- [ ] ราคาและค่าธรรมเนียมโปร่งใส
- [ ] Refund/cancellation policy ชัดเจน
- [ ] Complaint handling mechanism

**กฎหมายการเงิน (Payment processing)**
- [ ] ปฏิบัติตาม ธปท. requirements สำหรับ payment
- [ ] Anti-money laundering (AML) checks
- [ ] KYC สำหรับ escrow features

### 2. New Feature Compliance Assessment

เมื่อ launch feature ใหม่ ตรวจสอบ:

```
Feature Name: [ชื่อ feature]
Description: [อธิบายการทำงาน]

Data Collected: [ข้อมูลอะไรที่ collect]
Legal Basis: [consent / legitimate interest / contract]
Retention Period: [เก็บนานแค่ไหน]
Third-party Sharing: [ส่งให้ใครบ้าง]

Regulatory Impact:
- PDPA: [pass/fail/review needed]
- สภาทนายความ: [pass/fail/review needed]
- Consumer Protection: [pass/fail/review needed]

Required Changes Before Launch: [รายการที่ต้องแก้]
Compliance Sign-off: [yes/conditional/no]
```

### 3. Ongoing Compliance Monitoring

**Monthly Checks**
- ทนายที่ใบอนุญาตจะหมด (60 วันล่วงหน้า)
- User complaints รายงาน
- Data breach indicators
- Third-party vendor compliance

**Quarterly Checks**
- PDPA audit
- Terms of Service review
- Privacy Policy currency check
- Staff training completion

**Annual Checks**
- Full compliance audit
- Legal landscape changes
- Regulatory updates
- Insurance coverage review

### 4. Compliance Gap Report

```
Gap ID: [CG-YYYY-MM-NNN]
Area: [PDPA / สภาทนายความ / Consumer Protection / Other]
Description: [คำอธิบายช่องว่าง]
Risk: Critical / High / Medium / Low
Owner: [ชื่อผู้รับผิดชอบ]
Target Date: [วันที่ต้องแก้ไขเสร็จ]
Status: Open / In Progress / Resolved
```

### 5. Training Requirements
ระบุ training ที่ทีมต้องการ:
- Marketing Team: PDPA dos and don'ts สำหรับ campaigns
- Customer Support: Data subject rights handling
- Tech Team: Privacy by design implementation

## Output
Compliance Status Report พร้อม traffic light system (Green/Amber/Red) สำหรับแต่ละ area
