# Decision Log — Resilient Stock URL Fallback (Bypass Supabase Upload)

This file tracks major technical decisions, architectural shifts, and changes in direction.

---

### DEC-3: Direct Stock URL Return (Bypass Supabase Upload)
*   **Date:** 2026-07-05T02:44:00+07:00
*   **Context:** The user requested that we do not download and upload stock photos to Supabase Storage when fallback occurs. Instead, we should return the stock photo URL directly.
*   **Options Considered:**
    *   *Option A (Always Upload):* Download stock images to server memory and upload them to Supabase to keep all images on the same domain.
    *   *Option B (Direct URL Bypass):* Check if the generated image is a stock photo. If so, return the URL directly, skipping download and upload.
*   **Decision:** Option B (Direct URL Bypass).
*   **Impact:** Massive performance speedup during fallback, zero Supabase Storage storage usage for fallbacks, and lower bandwidth utilization.
