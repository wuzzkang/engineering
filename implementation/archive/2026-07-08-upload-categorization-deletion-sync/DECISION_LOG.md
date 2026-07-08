# Decision Log

### DEC-001: Bypassed CDN Cache in E2E Verification
*   **Date:** 2026-07-08T03:46:00Z
*   **Context:** In the E2E verification tests, when a `.png` image is downloaded right after upload (to verify it was uploaded) and then deleted, the subsequent `.download()` call still succeeds and returns the file contents. This happens because Cloudflare CDN caching fronts Supabase Storage and caches files with `.png` extensions for up to 1 hour (according to the default `max-age=3600` cache control headers).
*   **Options Considered:** 
    *   *Option A:* Use `.txt` or non-cached format for testing. Pros: test can download and fail. Cons: backend `image.route.js` has strict MIME verification restricting files to images (JPG, PNG, WEBP, GIF), thus rejecting `.txt` uploads.
    *   *Option B:* Verify file deletion via `list()` check instead of `download()`. Pros: `list()` queries the database table `storage.objects` directly, bypassing Cloudflare CDN cache entirely, which works perfectly with images. Cons: None.
*   **Decision:** Selected Option B. We query the folder contents using `.list()` and verify the deleted file is not present in the returned array.
*   **Impact:** [test-upload-delete.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/test-upload-delete.js)

### DEC-002: Automatic Replacements and Explicit Deletion Buttons
*   **Date:** 2026-07-08T04:31:00Z
*   **Context:** When a user uploads a new image to replace an existing uploaded image (e.g. bride/groom photos, store logo, products, prewedding covers), the previous image in Supabase Storage became orphaned (wasting storage space) because it wasn't physically deleted. Additionally, some upload components lacked a clear "Hapus" button, forcing users to uncheck/disable sections to clear them.
*   **Options Considered:**
    *   *Option A:* Maintain manual deletion only when clearing sections. Pros: Less frontend state checks. Cons: Leads to orphaned files on image replacement/modification.
    *   *Option B:* Implement automatic background deletion of the old image prior to updating the state with the newly uploaded image, and add explicit "Hapus" buttons to all avatar, logo, product, and picker previews. Pros: Clean storage engine, zero orphaned files, and superior user experience. Cons: Slightly more API calls.
*   **Decision:** Selected Option B.
*   **Impact:** [page.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-dashboard/src/app/generate/page.js), [ImagePickerField.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-dashboard/src/components/ImagePickerField.js)
