# Storage Upload and Deletion Sync Optimization Plan

Optimize the image upload mechanism to partition files by category folders in Supabase Storage and synchronize file deletions from the dashboard UI with the storage server to prevent orphaned file accumulation.

## User Review Required

> [!WARNING]
> This change introduces a new `DELETE /api/media` endpoint and alters the backend's file path generation for newly uploaded assets. Old files will remain under their legacy flat paths (`uploads/userId_timestamp.ext`) and will continue to be readable. The deletion logic is backward-compatible and handles both legacy paths and new categorized folder paths as long as they belong to the requesting user.

## Proposed Changes

### Backend: wuzzkang-api

#### [MODIFY] [SupabaseStorageProvider.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/src/services/storage/SupabaseStorageProvider.js)
- Implement `deleteFile(path)` to interface with Supabase's JS SDK `storage.from().remove()` function.
```javascript
async deleteFile(path) {
    const { data, error } = await supabase.storage
        .from(this.bucket)
        .remove([path]);

    if (error) {
        throw new Error(`[SupabaseStorageProvider] Delete failed for "${path}": ${error.message}`);
    }
    return data;
}
```

#### [MODIFY] [image.route.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/src/routes/image.route.js)
- In `POST /api/media/upload-url`, read the optional `category` parameter from the request body.
- Update the filename prefix logic:
  - If `category` is supplied (e.g., `'gallery'`, `'avatar'`), construct the path as:
    `uploads/${userId}/${category}/${timestamp}.${ext}`
  - Otherwise, fall back to legacy flat naming:
    `uploads/${userId}_${timestamp}.${ext}`
- Add a new `DELETE /api/media` endpoint:
  - Extract the `path` (e.g. `uploads/userId/gallery/filename.ext`) from the body.
  - Enforce ownership checking. The filename segment must start with `userId_` (legacy) OR the path must contain `/userId/` (new) matching the authenticated `req.user.id`.
  - Invoke `deleteFile(path)` and return a success status.

---

### Dashboard: wuzzkang-dashboard

#### [MODIFY] [page.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-dashboard/src/app/generate/page.js)
- Update `handleUploadImage(file, target)`:
  - Map target strings to category values when requesting the signed upload URL:
    - `groom` / `bride` / `celebrant` -> `'avatar'`
    - `prewedding` / `campaignHero` / `banner` / `storeBanner` -> `'background'`
    - `gallery` -> `'gallery'`
    - `story` -> `'story'`
    - `logo` -> `'logo'`
    - `cvPhoto` / `cv` -> `'cv'`
    - `product-*` -> `'product'`
  - Pass the `category` in the fetch request body to `POST /api/media/upload-url`.
- Implement a helper function `handleDeleteImage(imageUrl)`:
  - Parse the Supabase relative storage path from the public URL.
  - Send a `DELETE` request to `${process.env.NEXT_PUBLIC_API_URL}/media` with `{ path: parsedPath }`.
- Hook `handleDeleteImage` into:
  - Gallery slide item deletion (`onClick` handler in slide mapping).
  - Story timeline item deletion.
  - CV photo deletion.
  - Checkbox toggle and tab switches in [ImagePickerField.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-dashboard/src/components/ImagePickerField.js) if they clear a user-uploaded image.

---

## Verification Plan

### Automated Tests
- Create a test script `/home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/test-upload-delete.js` using Node.js to programmatically:
  1. Authenticate / mock login to obtain JWT.
  2. Request a signed upload URL with category parameter.
  3. Upload a mock image buffer to the signed URL.
  4. Invoke `DELETE /api/media` with the uploaded file's path.
  5. Check if the file is successfully deleted from Supabase Storage.

### Manual Verification
- Test through the Dashboard UI:
  - Go to the Wedding invitation template.
  - Upload a slide photo to "Galeri Foto Pernikahan".
  - Verify on Supabase Storage dashboard that it goes to the `/uploads/{userId}/gallery/` folder.
  - Click the "Hapus" button on that image in the slide gallery.
  - Verify that the image file disappears from the Supabase Storage bucket.
  - Repeat the process for other templates (e.g. CV Photo profile, Story images).
