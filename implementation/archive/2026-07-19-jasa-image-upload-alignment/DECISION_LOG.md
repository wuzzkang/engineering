# Decision Log

### DEC-1: Unified Jasa Image Picker Flow
* **Date:** 2026-07-19
* **Context:** The Jasa layout upload options did not match the rest of the application layout, bypassing standard security trackers and memory leak cleanups.
* **Options Considered:**
  * *Option A:* Keep legacy custom file input (no Unsplash query integration).
  * *Option B:* Re-align with `<ImagePickerField>` reusable component.
* **Decision:** Option B (Re-align with `<ImagePickerField>` for standardization).
* **Impact:** Replaced custom image pickers in `page.js` for Jasa Hero and About fields.
