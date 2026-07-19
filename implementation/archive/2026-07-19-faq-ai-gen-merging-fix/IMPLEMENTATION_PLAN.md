# Implementation Plan: Fix FAQ AI Generation Regressions (Merging Bug)

## Goal
Fix the bug where generating FAQs via AI on Jasa and E-Course templates overwrites the user's existing FAQs instead of merging them. Ensure that Jasa and E-Course merge existing filled FAQs and only populate empty slots (just like the Campaign FAQ template does).

## Proposed Changes

### Backend API
#### [MODIFY] [ai.service.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/src/services/ai.service.js)
- Update `e_course_faq` handler block to support dynamic `context.faqCount` and `context.filledFaqs` inputs, preventing duplicates against existing questions.

### Frontend Dashboard
#### [MODIFY] [page.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-dashboard/src/app/generate/page.js)
- Update `handleAIJasaAssist()` callback for `fieldType === 'jasa_faq'`:
  - Replace the destructive `setJasaFaqs(...)` assignment with a safe merging algorithm that preserves already filled items.
- Update `handleAIE-CourseAssist()` (specifically `fieldType === 'e_course_faq'`):
  - Replace the destructive `setECourseFaqs(...)` assignment with the same safe merging algorithm.

---

## Verification Plan

### Manual Verification
1. Open the dashboard in edit mode for a Jasa page containing 2 existing FAQs.
2. Click "Tambah FAQ" to add a 3rd slot.
3. Click "AI Generate" on Jasa FAQ.
4. Verify that:
   - The 2 existing FAQs remain untouched.
   - The 3rd slot is populated with a new question and answer from the AI.
5. Repeat the exact test case for an E-Course page.
