# Implementation Progress

## Milestone 1: Backend wuzzkang-api Changes
- [x] Implement `deleteFile(path)` in [SupabaseStorageProvider.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/src/services/storage/SupabaseStorageProvider.js)
- [x] Update category path mapping in `/media/upload-url` of [image.route.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/src/routes/image.route.js)
- [x] Implement ownership-validated `DELETE /api/media` route in [image.route.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/src/routes/image.route.js)

## Milestone 2: Dashboard wuzzkang-dashboard Changes
- [x] Map targets to upload categories in `handleUploadImage` of [page.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-dashboard/src/app/generate/page.js)
- [x] Implement `handleDeleteImage` call in [page.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-dashboard/src/app/generate/page.js)
- [x] Integrate deletion trigger for wedding slide gallery deletion
- [x] Integrate deletion trigger for wedding story timeline item deletion
- [x] Integrate deletion trigger for CV photo profile deletion
- [x] Integrate deletion trigger for optional ImagePickerField clearing

## Milestone 3: Verification & Polish
- [x] Create automated integration test script in `wuzzkang-api`
- [x] Verify manual UI flows in local development environment
- [x] Complete self-review, update status, and sync documentation
