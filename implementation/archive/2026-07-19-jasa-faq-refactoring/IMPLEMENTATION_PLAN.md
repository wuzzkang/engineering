# Implementation Plan: Refactoring Jasa FAQ to Reusable Shared Component

## Goal
Extract the custom FAQ logic and styling from `wuzzkang-lp/templates/jasa/professional-navy.js` and integrate it into the shared component `wuzzkang-lp/templates/components/Faq.js` under a new theme called `'professional-navy'`. Then, refactor the Jasa template to consume this standardized shared component.

## User Review Required
- This changes the shared component `Faq.js`, extending it to support a new theme `'professional-navy'`.
- All styling and functionality for Jasa FAQ will remain exactly the same (smooth slide transitions, rotating '+' to 'x' icon, dark navy colors, and opening the first accordion by default).

## Proposed Changes

### Shared Landing Page Components
#### [MODIFY] [Faq.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-lp/templates/components/Faq.js)
- Extend `initFaq` to support `theme === 'professional-navy'`.
- Setup class mapping for `cardClass`, `questionClass`, `answerClass`, and `arrowClass` matching Jasa's CSS class names.
- Make the interactive click listener toggle Jasa's `.open` class, animate `maxHeight` dynamically, and toggle the `+` / `×` symbols.
- Autoplay/open the first FAQ item by default on load for the Jasa theme.

### Jasa Template
#### [MODIFY] [professional-navy.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-lp/templates/jasa/professional-navy.js)
- Remove manual HTML accordion loop `faqHtml` construction.
- Replace container markup with a placeholder: `<div id="jasa-faq-root"></div>`.
- Delete manual `window.toggleJasaFaq` click script injection.
- Import and initialize the shared component:
  ```javascript
  const faqRoot = document.getElementById('jasa-faq-root');
  if (faqRoot && Array.isArray(content.faqs) && content.faqs.length > 0) {
      const { initFaq } = await import('../components/Faq.js');
      await initFaq(faqRoot, content.faqs, {
          theme: 'professional-navy',
          title: 'Pertanyaan yang Sering Diajukan',
          subtitle: 'Temukan jawaban atas pertanyaan umum seputar layanan kami'
      });
  }
  ```

---

## Verification Plan

### Manual Verification
1. Access the preview frame / live Jasa page template.
2. Verify the FAQ section loads exactly with the same navy-blue style, hover effects, and orange borders/icons.
3. Verify that clicking an item closes the active one and smoothly opens the clicked item (using `scrollHeight` transition).
4. Verify that the first FAQ item is open by default.
5. Verify that E-Course and Campaign FAQs (`purple-academy.js` and `neon-conversion.js`) are completely unaffected.
