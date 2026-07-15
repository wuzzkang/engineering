# Decision Log — Project Deletion Feature

## 1. Asset Storage Deletion
* **Decision**: Traverse `page_data` recursively and delete files physically from Supabase Storage instead of relying on database cascades.
* **Rationale**: Supabase Storage is not automatically pruned when postgres rows are deleted. Deleting them programmatically ensures we do not accumulate dead storage assets.

## 2. Preserving Defaults
* **Decision**: Filter out storage paths containing `/defaults/`.
* **Rationale**: Placeholder images used in template page states should not be physically removed from storage when a project is deleted.

## 3. Test Verification with Cache Buster
* **Decision**: Fetch the asset URL with `?t=${Date.now()}` query parameter instead of using `.download()` to verify deletion.
* **Rationale**: CDN and edge caches might return a cached image even after physical deletion, causing false-negative test failures.
