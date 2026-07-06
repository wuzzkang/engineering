# Javanese Traditional Style & Photo Gallery Slider for Wedding Product

This document outlines the detailed architecture and changes implemented to add the **Javanese Traditional** template and a reusable **Photo Gallery Slider** component to the wedding product lines in the wuzzkang application.

## User Review Required

> [!IMPORTANT]
> The implementation updates the database validation schema in `wuzzkang-api` via Zod. When deploying to production, make sure the API server restarts to apply the updated schemas, allowing `javanese-traditional` and `gallery` payloads to pass validation checks.

## Implemented Changes

### Backend (`wuzzkang-api`)

#### [MODIFY] [WeddingTaskCompiler.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/src/services/ai-platform/compilers/WeddingTaskCompiler.js)
- Added the `'javanese-traditional'` preset inside `STYLE_DESCRIPTORS`.
- The descriptor guides Gemini on generating formal Javanese-Indonesian copywriting, traditional themes (batik, blangkon, gamelan), and inserts Javanese honorific quotes.

#### [MODIFY] [generator.route.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/src/routes/generator.route.js)
- Updated Zod validation schema `wedding_details` to accept `'javanese-traditional'` as an enum option inside `design_key`.
- Added the `gallery` field (an array of URLs) in the wedding input context payload.

#### [MODIFY] [schema.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/src/utils/schema.js)
- Expanded the master `WeddingPageSchema` validation (both `design_key` and `theme` enums) to permit `'javanese-traditional'`.
- Added `gallery` field inside the page content block schema.

---

### Shared Templates & Frontend UI (`wuzzkang-dashboard` & `wuzzkang-lp`)

#### [NEW] [ImageSlider.js (Dashboard)](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-dashboard/public/preview/templates/components/ImageSlider.js) & [ImageSlider.js (Landing Page)](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-lp/templates/components/ImageSlider.js)
- Created a highly reusable, beautifully styled, and responsive image carousel component in Vanilla JS and Tailwind CSS.
- Features auto-slides (every 6 seconds), navigation dots, hover pause, slide fade-transitions, and responsive heights.

#### [NEW] [javanese-traditional.js (Dashboard)](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-dashboard/public/preview/templates/wedding/javanese-traditional.js) & [javanese-traditional.js (Landing Page)](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-lp/templates/wedding/javanese-traditional.js)
- Designed an elegant Javanese traditional wedding template layout using deep maroon (`#8C2D19`) and gold (`#C59B27`) accent tones.
- Uses traditional motifs, serif/cursive typography, countdown timers, akad/reception details, story timelines, and a digital gift card section.
- Integrates the new `ImageSlider` component to render the prewedding photo gallery when uploaded.

#### [MODIFY] Existing Wedding Templates ([sage-green.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-dashboard/public/preview/templates/wedding/sage-green.js), [floral-pink.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-dashboard/public/preview/templates/wedding/floral-pink.js), [classic-love.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-dashboard/public/preview/templates/wedding/classic-love.js) in both dashboard and lp)
- Updated each template to import `renderImageSlider` and dynamically append a "Galeri Foto" section if `content.gallery` is provided.

#### [MODIFY] [page.js (Dashboard Generate Form)](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-dashboard/src/app/generate/page.js)
- Added `galleryList` state hook.
- Added a gorgeous multi-photo upload interface below the prewedding background image option (supports up to 12 images, thumbnail preview grid, delete button).
- Implemented file upload, compression, and backend storage integration using existing API endpoints under target `'gallery'`.
- Synchronized template state variables with the preview iframe postMessage trigger, updating changes live.
- Fixed layout issue by nesting `classic-love` and `javanese-traditional` theme choices inside the horizontal-scroll snap container.

---

## Verification Plan

### Automated Tests
- Ran standard platform verification scripts to ensure compilation engine behaves:
  `node test-milestone4.js`
  `node test-milestone5.js`
  `node test-milestone6-gemini.js`

### Manual Verification
- Verify preview modal correctly showcases the `ImageSlider` carousel with pre-populated mock wedding photos.
- Verify photo gallery can be uploaded, viewed in the preview pane, deleted, and stored safely.
