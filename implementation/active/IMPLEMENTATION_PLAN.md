# Implementation Plan - Phase 2 Native Section Component Expansion (Wedding, Toko Online, E-Course, CV)

Expand Wuzzkang V2 `dynamic-builder` engine with dedicated native section components for specialized domains (**Undangan Pernikahan / Wedding**, **Toko Online Katalog**, **E-Course & Kelas Online**, and **Web CV / Portofolio**), providing rich interactive UI cards (such as 1-Click Copy account numbers, direct WA checkout buttons, course curriculum accordions, and couple profiles) while maintaining 100% cross-domain modular flexibility.

## User Review Required

> [!IMPORTANT]
> **Component Architecture Standard**:
> All new V2 section components will follow the established 4-layer architecture (`getSectionStyle` centralized engine, `dividerHtml` transitions, `wuzzkang-lp` ES module renderer, synced `wuzzkang-dashboard` preview renderer, `V2VisualSectionPickerModal` visual cards, and `page.js` editor form blocks).

> [!NOTE]
> **Cross-Domain Freedom**:
> Users can freely insert any of these new domain section components into ANY page preset (e.g. adding `digital_gift` to a custom page or `product_grid` to a campaign page).

---

## Proposed New Native V2 Section Components

### 1. 💍 Domain Undangan Pernikahan (Wedding)
- **`wedding_couple`** (`wedding_couple-navy.js`):
  - Dedicated couple profile card for Groom & Bride.
  - Fields: `groom_name`, `groom_nickname`, `groom_parents`, `groom_instagram`, `groom_photo`, `bride_name`, `bride_nickname`, `bride_parents`, `bride_instagram`, `bride_photo`, `bismillah_quote`.
- **`wedding_events`** (`wedding_events-navy.js`):
  - Schedule card for Akad Nikah & Resepsi Pernikahan with Google Maps button.
  - Fields: `akad_title`, `akad_date`, `akad_time`, `akad_location`, `akad_address`, `akad_maps_url`, `resepsi_title`, `resepsi_date`, `resepsi_time`, `resepsi_location`, `resepsi_address`, `resepsi_maps_url`.
- **`digital_gift`** (`digital_gift-navy.js`):
  - Amplop Digital cashless gift card with **1-Click Copy Account Number** (BCA/Mandiri/e-Wallet), QRIS image preview, and WhatsApp RSVP button.
  - Fields: `title`, `description`, `bank_accounts` (repeater: `bank_name`, `account_number`, `account_holder`), `qris_image_url`, `rsvp_whatsapp`.

---

### 2. 🛍️ Domain Toko Online & Katalog (E-Commerce)
- **`product_grid`** (`product_grid-navy.js`):
  - Interactive product catalog grid with category pills, discount badges, original vs sale prices, product thumbnail images, and **Direct WhatsApp Checkout** per item.
  - Fields: `title`, `subtitle`, `products` (repeater: `name`, `category`, `sale_price`, `original_price`, `badge`, `image_url`, `description`).
- **`store_guarantee`** (`store_guarantee-navy.js`):
  - Online store trust & guarantee badges (fast shipping, 100% original, easy returns, CS fast response).
  - Fields: `title`, `features` (repeater: `icon`, `title`, `desc`).

---

### 3. 🎓 Domain E-Course & Kelas Online (Education)
- **`course_curriculum`** (`course_curriculum-navy.js`):
  - Accordion curriculum learning modules with module titles, lesson lists, duration, and downloadable resources.
  - Fields: `title`, `subtitle`, `modules` (repeater: `module_number`, `title`, `duration`, `lessons` array).
- **`course_mentor`** (`course_mentor-navy.js`):
  - Dedicated mentor / instructor bio profile card with achievement stats and social links.
  - Fields: `name`, `role`, `bio`, `avatar_url`, `experience_years`, `students_count`, `linkedin_url`.

---

## Proposed File Changes

### 1. `wuzzkang-dashboard` (Preview & Editor Form)
#### [NEW] [wedding_couple-navy.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-dashboard/public/preview/templates/components/sections/wedding_couple/wedding_couple-navy.js)
#### [NEW] [wedding_events-navy.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-dashboard/public/preview/templates/components/sections/wedding_events/wedding_events-navy.js)
#### [NEW] [digital_gift-navy.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-dashboard/public/preview/templates/components/sections/digital_gift/digital_gift-navy.js)
#### [NEW] [product_grid-navy.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-dashboard/public/preview/templates/components/sections/product_grid/product_grid-navy.js)
#### [NEW] [store_guarantee-navy.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-dashboard/public/preview/templates/components/sections/store_guarantee/store_guarantee-navy.js)
#### [NEW] [course_curriculum-navy.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-dashboard/public/preview/templates/components/sections/course_curriculum/course_curriculum-navy.js)
#### [NEW] [course_mentor-navy.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-dashboard/public/preview/templates/components/sections/course_mentor/course_mentor-navy.js)

#### [MODIFY] [V2VisualSectionPickerModal.jsx](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-dashboard/src/components/V2VisualSectionPickerModal.jsx)
- Add new section catalog cards with thumbnail previews and badge labels (`wedding_couple`, `wedding_events`, `digital_gift`, `product_grid`, `store_guarantee`, `course_curriculum`, `course_mentor`).

#### [MODIFY] [v2Presets.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-dashboard/src/app/generate/v2Presets.js)
- Update starter kit presets (`wedding`, `toko-online`, `e-course`) to consume the new native V2 components instead of generic custom cards.

#### [MODIFY] [page.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-dashboard/src/app/generate/page.js)
- Add editor form blocks and state handlers for new section types.
- Update `getSectionDisplayTitle` and `getSectionTypeIcon` helper maps.

---

### 2. `wuzzkang-lp` (Production Landing Page Renderer)
#### [NEW] [wedding_couple-navy.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-lp/templates/components/sections/wedding_couple/wedding_couple-navy.js)
#### [NEW] [wedding_events-navy.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-lp/templates/components/sections/wedding_events/wedding_events-navy.js)
#### [NEW] [digital_gift-navy.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-lp/templates/components/sections/digital_gift/digital_gift-navy.js)
#### [NEW] [product_grid-navy.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-lp/templates/components/sections/product_grid/product_grid-navy.js)
#### [NEW] [store_guarantee-navy.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-lp/templates/components/sections/store_guarantee/store_guarantee-navy.js)
#### [NEW] [course_curriculum-navy.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-lp/templates/components/sections/course_curriculum/course_curriculum-navy.js)
#### [NEW] [course_mentor-navy.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-lp/templates/components/sections/course_mentor/course_mentor-navy.js)

---

## Verification Plan

### Automated Build Verification
1. Run Next.js production build in `wuzzkang-dashboard`:
   `bash -c "source ~/.nvm/nvm.sh && nvm use 20 && npm --prefix wuzzkang-dashboard run build"`
   Verify zero compilation errors or broken imports.

### Manual UX Verification
1. Open Generator V2 and select **Undangan Pernikahan** starter kit. Verify `wedding_couple`, `wedding_events`, and `digital_gift` render seamlessly in Live Preview.
2. Test 1-Click Copy on `digital_gift` account numbers.
3. Select **Toko Online** starter kit and test `product_grid` direct WhatsApp checkout buttons.
4. Select **E-Course** starter kit and test `course_curriculum` accordion interactivity.
