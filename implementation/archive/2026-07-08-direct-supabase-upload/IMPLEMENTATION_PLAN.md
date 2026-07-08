# Implementation Plan - Direct Upload to Supabase Storage via Signed URLs

This implementation plan details the architectural and code changes to secure file uploads in the Wuzzkang application. Instead of proxying file uploads through the Express backend, the Dashboard will request a Signed Upload URL from the API and upload files directly to Supabase Storage.

## User Review Required

> [!IMPORTANT]
> - **Direct Uploads**: The Dashboard will upload files directly to the Supabase Storage bucket via `PUT` requests. Please ensure that the Supabase bucket `wuzzkang-bucket` is configured to allow `PUT` operations via Signed URLs and that public read access is enabled.
> - **MIME-type restrictions**: Only `image/jpeg`, `image/png`, `image/webp`, and `image/gif` will be permitted.
> - **File Size Limit**: We will enforce a strict client-side limit of **5MB** for uploaded files.

---

## Proposed Changes

### Backend: `wuzzkang-api`

#### [MODIFY] [supabase.service.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/src/services/supabase.service.js)
- Add a new helper function `createSignedUploadUrl(fileName)` that wraps the Supabase SDK `storage.from('wuzzkang-bucket').createSignedUploadUrl(fileName)`.
- It will also generate the final public read URL using `storage.from('wuzzkang-bucket').getPublicUrl(fileName)`.

#### [MODIFY] [image.route.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/src/routes/image.route.js)
- Add a new route `POST /api/media/upload-url` (or GET equivalent) that:
  1. Validates user session.
  2. Validates incoming parameters (e.g., target `fileName` and `mimeType` using Zod).
  3. Rejects unsupported MIME-types (only images: `image/jpeg`, `image/png`, `image/webp`, `image/gif`).
  4. Generates a unique timestamped file path `uploads/${userId}_${timestamp}.${ext}` to prevent naming conflicts.
  5. Requests a Signed Upload URL from the Supabase client.
  6. Returns `{ success: true, signedUrl, publicUrl, token }`.
- Keep the legacy `POST /api/media/upload` route temporarily to ensure backward compatibility during migration, but add a warning or deprecation comment.

---

### Frontend: `wuzzkang-dashboard`

#### [MODIFY] [page.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-dashboard/src/app/generate/page.js)
- Update the `handleUploadImage` function:
  1. Enforce dynamic upload size limit based on `process.env.NEXT_PUBLIC_MAX_UPLOAD_SIZE_MB` (default: 5MB).
  2. Implement client-side auto-resizing for images. If an image exceeds the maximum size, run the `compressImage` utility to resize and compress it to fit the target image size (default: 300KB) before checking the limit.
  3. Validate final file size limit (reject non-images or failed compressions exceeding the limit).
  4. Call `POST /api/media/upload-url` with `{ fileName: file.name, mimeType: file.type }`.
  5. Use the returned `signedUrl` to upload the file directly to Supabase via a standard HTTP `PUT` request:
     ```javascript
     const uploadResponse = await fetch(signedUrl, {
         method: 'PUT',
         headers: {
             'Content-Type': fileToUpload.type,
         },
         body: fileToUpload
     });
     ```
  6. Retrieve the public URL from the backend response and update the appropriate state variable (e.g., `setGroomImage`, `setBrideImage`, etc.) as before.
  7. Handle target `'cv'` to update `cvPhotoUrl` state and control its uploading indicator state.
- Add an upload input area component and deletion control for `cvPhotoUrl` state under the "1. Data Profil" section of the CV template form in JSX.
- Fix the live preview sidebar condition in `page.js` to include `templateType === 'cv'` so that the CV iframe is rendered instead of defaulting to the Store mockup.
- Update the template synchronization script `sync:templates` in `package.json` to include the `cv` templates folder.

---

## Verification Plan

### Automated Tests
- We will run the backend API tests (`npm run test:api`) and syntax/build tests (`npm run dev`) to ensure no regressions are introduced.

### Manual Verification
1. **Signed URL Generation**: Send a `POST` request to `/api/media/upload-url` with valid payload and check the output.
2. **Direct Upload from Dashboard**:
   - Open the dashboard in development mode.
   - Upload a small image (e.g. groom or bride photo).
   - Ensure the upload finishes successfully and the image preview is loaded correctly.
3. **Constraint Validation**:
   - Attempt to upload a file larger than 5MB and check if the dashboard correctly rejects the upload with an error message.
   - Attempt to request an upload URL for an invalid MIME-type (e.g., `application/zip`) and verify that the backend returns a `400 Bad Request` or custom validation error.
