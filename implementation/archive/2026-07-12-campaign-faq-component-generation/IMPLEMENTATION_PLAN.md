# Implementation Plan — Add Reusable FAQ Component & AI Generation to Campaign Product

This plan introduces a reusable FAQ component to the Wuzzkang system, specifically implementing it for the Campaign product landing page templates (`neon-conversion` and `clean-trust`). It adds structured form inputs in the dashboard form editor, enables AI generation support (including backend API handling, queue, and Redis caching), and integrates preview functionality.

## User Review Required

> [!IMPORTANT]
> The FAQ feature will be optional for users. If no FAQs are provided, the FAQ section will not render, preserving the existing layouts of previously generated/deployed campaign pages.
> The FAQ design is built using Tailwind CSS to automatically match the theme palette (`neon-conversion` uses dark neon borders, `clean-trust` uses border-slate cards).

## Open Questions

There are no open questions. The requirements are clear:
1. FAQ must be a reusable template component (`Faq.js`).
2. There must be FAQ inputs in the Campaign dashboard form.
3. AI generation capability must exist for FAQs based on the project campaign brief.

## Proposed Changes

---

### Landing Page & Components (`wuzzkang-lp`)

#### [NEW] [Faq.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-lp/templates/components/Faq.js)
Create a reusable FAQ template component that accepts a container element, array of FAQs, and options like `theme`. It will render an interactive accordion using Tailwind CSS.

#### [MODIFY] [neon-conversion.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-lp/templates/campaign/neon-conversion.js)
- Import `Faq.js` dynamically when `content.faqs` exists.
- Add an FAQ section with a unique placeholder container before the footer.
- Initialize the FAQ component with the `neon-conversion` theme.

#### [MODIFY] [clean-trust.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-lp/templates/campaign/clean-trust.js)
- Import `Faq.js` dynamically when `content.faqs` exists.
- Add an FAQ section with a unique placeholder container before the footer.
- Initialize the FAQ component with the `clean-trust` theme.

#### [MODIFY] [script.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-lp/script.js)
- Bump `LP_VERSION` to invalidate cache.

---

### Backend API (`wuzzkang-api`)

#### [MODIFY] [schema.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/src/utils/schema.js)
- Update `CampaignPageSchema` to include the `faqs` property:
  ```typescript
  faqs: z.array(z.object({
      question: z.string().min(3).max(500),
      answer: z.string().min(3).max(3000)
  })).optional().nullable()
  ```

#### [MODIFY] [generator.route.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/src/routes/generator.route.js)
- In `GenerateRequestSchema`, allow optional `faqs` in `campaign_details`.
- In `GenerateFieldRequestSchema`, add `'campaign_faq'` to the `fieldType` enum.

#### [MODIFY] [ai.service.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/src/services/ai.service.js)
- In `generateFieldContent`, add prompt logic for `campaign_faq` fieldType. The prompt will request Gemini to return 3 relevant conversion-focused Q&As based on the provided campaign brief, formatted in JSON.

---

### User Dashboard (`wuzzkang-dashboard`)

#### [MODIFY] [package.json](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-dashboard/package.json)
- Modify the `sync:templates` script to clean and sync the `components` directory from `wuzzkang-lp/templates/components` to `wuzzkang-dashboard/public/preview/templates/components`.

#### [MODIFY] [page.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-dashboard/src/app/generate/page.js)
- Initialize state `campaignFaqs` (`[{ question: '', answer: '' }]`) and loading state `isGeneratingCampaignFaq`.
- Read existing `content.faqs` when loading a draft.
- In `compiledPageData`, include `faqs: campaignFaqs.filter(f => f.question && f.answer)`.
- Render the FAQ Form segment under Campaign fields allowing:
  - Adding new Q&A items.
  - Removing Q&A items.
  - Form field inputs for questions and answers.
  - An "✨ AI Generate" button that triggers `handleAICampaignAssist('campaign_faq')`.
- Hook up `isGeneratingCampaignFaq` to update button state during generation.

---

## Verification Plan

### Automated Tests
- Run backend unit tests: `npm run test` (if present in wuzzkang-api/package.json) or run API check.
- Validate campaign page schema verification manually or programmatically.

### Manual Verification
- Sync templates using `npm run sync:templates`.
- Launch development server: `npm run dev` inside `wuzzkang-dashboard`.
- Access dashboard generate page `/generate?id=<draftId>` or create new campaign.
- Input campaign brief, click `✨ AI Generate` on FAQ section, check if it populates FAQs.
- Verify live preview updates instantly with the generated FAQs in the accordion element.
- Test adding, removing, and manually writing FAQs.
- Save draft, refresh page, check if the data remains persisted.
- Publish/deploy and check rendered output.
