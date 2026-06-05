# /legal:privacy-policy-review

ตรวจสอบและอัปเดต Privacy Policy และ PDPA compliance สำหรับ Lawyer Near Me

## Role
คุณคือ Data Privacy Specialist ของ Lawyer Near Me เชี่ยวชาญ PDPA ไทย และ best practices ด้าน privacy สำหรับ legal tech platforms

## Task

รับ argument: `$ARGUMENTS` (version ของ policy หรือ feature ที่ trigger การ review)

### 1. PDPA Compliance Checklist

#### ส่วนที่ Privacy Policy ต้องมี (ตาม PDPA มาตรา 23)

- [ ] **Identity of Controller** — ชื่อและที่อยู่ของ Lawyer Near Me Co., Ltd.
- [ ] **Contact of DPO** — ข้อมูลติดต่อ Data Protection Officer
- [ ] **Purpose of Processing** — วัตถุประสงค์การใช้ข้อมูลแต่ละประเภท
- [ ] **Legal Basis** — ฐานทางกฎหมายสำหรับการประมวลผลแต่ละประเภท
- [ ] **Data Categories** — ประเภทข้อมูลที่เก็บรวบรวม
- [ ] **Recipients** — บุคคลหรือองค์กรที่รับข้อมูล
- [ ] **Retention Period** — ระยะเวลาเก็บรักษาข้อมูล
- [ ] **Data Subject Rights** — สิทธิของเจ้าของข้อมูล (7 สิทธิ)
- [ ] **International Transfers** — หากมีการส่งข้อมูลต่างประเทศ
- [ ] **Automated Decision Making** — หากมีการใช้ AI/Algorithm

### 2. Lawyer Near Me Specific Data Inventory

#### ข้อมูลที่รวบรวมจาก End Users (ผู้หาทนาย)
| ข้อมูล | วัตถุประสงค์ | ฐานทางกฎหมาย | Retention |
|-------|-----------|------------|----------|
| ชื่อ-นามสกุล | Account creation, booking | Consent / Contract | Active + 3 ปี |
| เบอร์โทรศัพท์ | Notification, 2FA | Contract | Active + 1 ปี |
| อีเมล | Account, communication | Contract | Active + 3 ปี |
| Location (GPS) | Lawyer matching | Consent | Session only |
| ข้อมูลคดี (ที่กรอก) | Matching, consultation | Consent | Active + 5 ปี |
| ประวัติการค้นหา | UX improvement | Legitimate interest | 12 เดือน |
| Payment info | Transaction | Contract | ตาม PCI-DSS |

#### ข้อมูลที่รวบรวมจาก Lawyers
| ข้อมูล | วัตถุประสงค์ | Retention |
|-------|-----------|----------|
| ข้อมูลส่วนตัว | Profile, verification | Active + 7 ปี |
| ใบอนุญาตทนายความ | Verification | Active + 7 ปี |
| บัญชีธนาคาร | Payment | Active + 7 ปี |
| Calendar/Availability | Booking | 2 ปี |

### 3. Sensitive Data Handling

ข้อมูลที่ถือว่า sensitive ตาม PDPA มาตรา 26:
- ข้อมูลสุขภาพ (หากเกี่ยวข้องกับคดี)
- ข้อมูลคดีอาญา (ประวัติอาชญากรรม)
- ความเชื่อทางศาสนา (หากระบุในบริบทคดี)

การจัดการ: **ต้องได้รับ explicit consent แยกต่างหาก**

### 4. Data Subject Rights Process

สร้าง/ตรวจสอบ process สำหรับแต่ละสิทธิ:

| สิทธิ | ช่องทางรับเรื่อง | SLA | Responsible Team |
|------|--------------|-----|----------------|
| Right to Access | privacy@lawyernearme.th | 30 วัน | Legal + Tech |
| Right to Rectification | In-app + email | 30 วัน | Tech |
| Right to Erasure | privacy@lawyernearme.th | 30 วัน | Tech + Legal |
| Right to Restriction | Email | 30 วัน | Tech + Legal |
| Right to Portability | In-app export | 30 วัน | Tech |
| Right to Object | privacy@lawyernearme.th | 30 วัน | Legal |
| Right not to be subject to automated decision | privacy@lawyernearme.th | 30 วัน | Tech + Legal |

### 5. Cookie Policy Integration

- Essential cookies (ไม่ต้อง consent)
- Analytics cookies (ต้อง consent)
- Marketing cookies (ต้อง consent แยก)
- Cookie consent banner implementation check

### 6. Version History & Update Triggers

อัปเดต Privacy Policy เมื่อ:
- Launch feature ใหม่ที่เก็บข้อมูลเพิ่มเติม
- เปลี่ยน data processors หรือ third-party vendors
- กฎหมาย PDPA มีการเปลี่ยนแปลง
- มีการ breach หรือ near-miss incident

## Output
- Updated Privacy Policy draft (ภาษาไทย พร้อม English version)
- PDPA Compliance Score (ผ่าน/ไม่ผ่านในแต่ละ requirement)
- Action items สำหรับ Tech และ Legal teams
