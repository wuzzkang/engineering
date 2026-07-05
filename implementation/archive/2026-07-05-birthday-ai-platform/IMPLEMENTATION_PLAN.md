# Implementation Plan: Birthday Template AI Migration

This plan details the migration of the Birthday invitation template generation flow to the queue-based, asynchronous `AIOrchestrationService` using `GeminiProvider` (`gemini-2.5-flash`).

## Proposed Changes

### Backend

#### [NEW] [BirthdayTaskCompiler.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/src/services/ai-platform/compilers/BirthdayTaskCompiler.js)
Create the new compiler representing the `'birthday'` template generation task.
- Context input keys: `celebrantName`, `celebrantAge`, `eventDate`, `eventLocation`, `theme`.
- Output fields: `banner_tagline`, `invitation_intro`, `closing_message`.
- Target model: `'gemini-2.5-flash'`.

#### [MODIFY] [register.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/src/services/ai-platform/register.js)
Import and register `BirthdayTaskCompiler` with key `'birthday'`:
```javascript
import { BirthdayTaskCompiler } from './compilers/BirthdayTaskCompiler.js';
...
TaskCompilerRegistry.register('birthday', new BirthdayTaskCompiler());
```

---

### Frontend

#### [MODIFY] [page.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-dashboard/src/app/generate/page.js)
Integrate the `'birthday'` template type into the async AI execution flow:

1. Update `handleGenerate` to execute `'birthday'` template through the async execute API:
   Modify the template type check in `handleGenerate` (around line 1515):
   ```diff
   - if (templateType === 'wedding' || templateType === 'campaign') {
   + if (templateType === 'wedding' || templateType === 'campaign' || templateType === 'birthday') {
   ```

2. Construct the `executePayload` for Birthday (inside `handleGenerate`):
   ```javascript
   executePayload = {
     idempotencyKey,
     projectId: projectId || null,
     templateType: 'birthday',
     styleKey: 'default',
     inputAssets: celebrantImage && celebrantImage !== DEFAULT_GROOM_AVATAR ? [{ url: celebrantImage, role: 'celebrant' }] : [],
     inputContext: {
       celebrantName,
       celebrantAge,
       eventDate: birthdayDate,
       eventLocation: birthdayLocation,
       theme: designKey,
       quote: prompt || ''
     },
     async: true
   };
   ```

3. Construct `compiledPageData` for Birthday from AI task results (inside `handleGenerate` after polling is complete):
   ```javascript
   compiledPageData = {
     meta: {
       title: `Undangan Ulang Tahun ${celebrantNickname || celebrantName}`,
       theme: designKey,
       template_type: 'birthday',
       design_key: designKey,
     },
     content: {
       design_key: designKey,
       celebrant: {
         name: celebrantName,
         nickname: celebrantNickname,
         age: celebrantAge,
         parent_name: celebrantParents || null,
         image_url: celebrantImage || null,
         gender: celebrantGender
       },
       event: {
         date: birthdayDate,
         time: birthdayTime,
         location: birthdayLocation,
         maps_url: birthdayMaps || null
       },
       gift: birthdayGiftBank && birthdayGiftAccount ? {
         bank_name: birthdayGiftBank,
         account_number: birthdayGiftAccount,
         account_holder: birthdayGiftHolder || ''
       } : null,
       // Map the AI invitation_intro to quote for backward-compatibility with LP rendering
       quote: aiConfig.invitation_intro || 'Selamat hari lahir! Semoga panjang umur, sehat selalu.',
       // Save additional generated fields if needed
       banner_tagline: aiConfig.banner_tagline || null,
       closing_message: aiConfig.closing_message || null
     }
   };
   ```

4. Update the live preview auto-update `useEffect` (around line 469) to watch birthday state dependencies (if missing) and include `birthdayQuote` state if we want to bind it, or read from `pageData?.content?.quote`.

5. Update `assembledContent` inside the dashboard's live preview auto-update `useEffect`:
   ```javascript
   quote: pageData?.content?.quote || 'Selamat hari lahir! Semoga panjang umur, sehat selalu, dan dilimpahi kebahagiaan serta kesuksesan.'
   ```

---

## Verification Plan

### Automated Verification
Run compile check and build test:
```bash
cd wuzzkang-dashboard && npm run build
```

### Manual Verification
1. Open the dashboard and navigate to the Birthday generation form.
2. Fill out all birthday details (Name: "Farhan", Age: "17", Date, Location).
3. Type custom quote preference (Optional).
4. Click **Generate Preview**.
5. Verify that it executes asynchronously, polls status, and updates the preview template in the iframe dynamically with the generated wishes/quote.
