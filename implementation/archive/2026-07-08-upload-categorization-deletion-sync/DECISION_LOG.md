# Decision Log

### DEC-001: Bypassed CDN Cache in E2E Verification
*   **Date:** 2026-07-08T03:46:00Z
*   **Context:** In the E2E verification tests, when a `.png` image is downloaded right after upload (to verify it was uploaded) and then deleted, the subsequent `.download()` call still succeeds and returns the file contents. This happens because Cloudflare CDN caching fronts Supabase Storage and caches files with `.png` extensions for up to 1 hour (according to the default `max-age=3600` cache control headers).
*   **Options Considered:** 
    *   *Option A:* Use `.txt` or non-cached format for testing. Pros: test can download and fail. Cons: backend `image.route.js` has strict MIME verification restricting files to images (JPG, PNG, WEBP, GIF), thus rejecting `.txt` uploads.
    *   *Option B:* Verify file deletion via `list()` check instead of `download()`. Pros: `list()` queries the database table `storage.objects` directly, bypassing Cloudflare CDN cache entirely, which works perfectly with images. Cons: None.
*   **Decision:** Selected Option B. We query the folder contents using `.list()` and verify the deleted file is not present in the returned array.
*   **Impact:** [test-upload-delete.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/test-upload-delete.js)
