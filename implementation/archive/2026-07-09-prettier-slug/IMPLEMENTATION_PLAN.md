# Implementation Plan: Prettier Slug

## Status: `Draft — Awaiting User Approval`

---

## Goal Description

Improve the slug system so that:
1. **URLs are clean and readable** — only lowercase, dashes, no random noise.
2. **Suffix is deterministic, not random** — derived from the project UUID so it is always unique without any retry loop.
3. **The user experience is smart** — the slug input auto-suggests a meaningful value from the page content.
4. **Future-proof for custom domains** — the technical slug remains as a routing fallback, but custom domains will eventually replace it as the user-facing URL.

---

## Architecture Decision: Deterministic Suffix via Project UUID

### Current System (Problem)

```
User types: toko-saya
                │
                ▼
backend appends random 4-char suffix (e.g. x7k2)
                │
    [check DB uniqueness, retry up to 5 times]
                │
                ▼
stored slug: toko-saya-x7k2
```

**Issues:**
- Suffix is random and unpredictable — user can't know the final URL before deploying.
- Retry loop is wasteful and can fail after 5 attempts.
- No semantic link between the suffix and the project.

### Proposed System (Solution)

```
User types: toko-saya
                │
                ▼
backend takes first 6 chars of project UUID (already unique globally)
e.g. projectId = "3b9d4cf2-2321-4f11-..." → suffix = "3b9d4c"
                │
                ▼
stored slug: toko-saya-3b9d4c  (deterministic, unique, no retry needed)
```

**Why this works:**
- `projectId` (UUID v4) is globally unique — therefore `{base}-{first6chars}` is also unique.
- The probability of the first 6 hex chars of two different UUIDs colliding is ~1 in 16 million. With the user-typed base prefix, this is effectively zero.
- **Zero retry loop needed** — slug is computed deterministically in one shot.
- 6 hex chars are short enough to be tolerable and will eventually be hidden behind a custom domain.

### Custom Domain Future Path

```
Today:  user shares  →  wuzzkang.github.io/?slug=toko-saya-3b9d4c
Future: user points custom domain (e.g. toko.serasi.id)
            → DNS → wuzzkang system resolves to the same project
            → technical slug becomes invisible to end users
```

The `projects.slug` field remains as the **routing fallback key**. Custom domains, when implemented, will resolve by project ID directly, making the slug a secondary routing mechanism.

---

## Proposed Changes

### Milestone 1 — Backend: Deterministic Slug Generation

**Objective:** Replace the random retry-based suffix with a deterministic UUID-derived suffix.

---

#### [MODIFY] [project.service.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/src/services/project.service.js)

In the `deployDraftProject` method, **replace** the `generateFinalSlug` async retry function with a simple deterministic computation:

```js
// BEFORE (current implementation — lines 32-46):
const generateFinalSlug = async (baseSlug, attempts = 0) => {
    if (attempts >= 5) {
        throw new Error('Gagal membuat slug unik...');
    }
    const suffix = Math.random().toString(36).substring(2, 6); // random!
    const candidate = `${baseSlug}-${suffix}`;
    const existing = await supabaseService.getProjectBySlug(candidate);
    if (existing) {
        return generateFinalSlug(baseSlug, attempts + 1);
    }
    return candidate;
};
const finalSlug = await generateFinalSlug(slug);

// AFTER (new implementation):
const uuidSuffix = projectId.replace(/-/g, '').substring(0, 6); // e.g. "3b9d4c"
const finalSlug = `${slug}-${uuidSuffix}`;
// No DB uniqueness check needed — projectId is globally unique.
```

**Benefits:**
- Removes 1 DB round-trip (was: `getProjectBySlug` per attempt).
- Removes retry loop and failure error path.
- Slug is deterministic — the same project always produces the same slug.

---

#### [MODIFY] [project.route.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-api/src/routes/project.route.js)

Tighten the Zod regex to enforce **lowercase only** (no uppercase, no underscore):

```js
// BEFORE:
.regex(/^[a-zA-Z0-9_-]+$/, 'Slug hanya boleh mengandung huruf, angka, strip (-), atau underscore (_)')

// AFTER:
.regex(/^[a-z0-9-]+$/, 'Slug hanya boleh mengandung huruf kecil (a-z), angka (0-9), dan strip (-)')
```

> [!WARNING]
> This is a non-breaking change for existing deployed projects (their slugs are already stored). It only affects new deployments.

---

### Milestone 2 — Dashboard: Smart Auto-Suggestion & Input UX

**Objective:** Auto-populate slug from meaningful content fields and improve the input experience.

---

#### [MODIFY] [page.js](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-dashboard/src/app/generate/page.js)

**Change 1: Add `buildSlugSuggestion()` function**

Add a utility function inside the component that derives a clean slug from the active form content:

```js
const buildSlugSuggestion = () => {
  let raw = '';
  if (templateType === 'wedding' && groomNickname && brideNickname) {
    raw = `${groomNickname}-${brideNickname}`;
  } else if (templateType === 'birthday' && celebrantNickname) {
    raw = `${celebrantNickname}-ultah`;
  } else if (templateType === 'toko-online' && storeName) {
    raw = storeName;
  } else if (templateType === 'campaign' && heroHeadline) {
    raw = heroHeadline.substring(0, 25);
  } else if (templateType === 'cv' && cvProfileName) {
    raw = `${cvProfileName}-cv`;
  } else {
    raw = name; // fallback to project name
  }
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')  // replace non-alphanumeric with dash
    .replace(/-+/g, '-')           // collapse multiple dashes
    .replace(/(^-|-$)/g, '')       // trim leading/trailing dashes
    .substring(0, 40);             // max 40 chars (API max is 50, leaves room for suffix)
};
```

**Change 2: Call `buildSlugSuggestion()` after generation succeeds**

Replace the current name-based suggestion in `handleGenerate` (line ~2488):
```js
// BEFORE:
const suggestedSlug = name
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/(^-|-$)/g, '');
setSlug(suggestedSlug);

// AFTER:
setSlug(buildSlugSuggestion());
```

**Change 3: Enforce lowercase in slug input `onChange`**

```js
// BEFORE (line ~4806):
onChange={(e) => setSlug(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ''))}

// AFTER:
onChange={(e) => setSlug(
  e.target.value
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
)}
```

**Change 4: Add slug preview hint text**

Below the slug input field, add a small helper text showing what the final URL will look like:

```jsx
<p className="text-[10px] text-theme-text-muted mt-1.5 pl-1">
  URL Anda akan seperti:{' '}
  <span className="font-mono text-theme-text-sec">
    .../?slug={slug || 'nama-anda'}-<span className="opacity-50">xxxxxx</span>
  </span>
</p>
```

This transparently educates users about the suffix without making it feel alarming.

---

### Milestone 3 — Documentation Synchronization

**Objective:** Update engineering docs to stay in sync with the new slug architecture.

---

#### [MODIFY] [05_API_SPECIFICATION.md](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-engineering/docs/05_API_SPECIFICATION.md)

Update `POST /api/projects/:id/deploy` section:
- Update slug validation description to document lowercase-only constraint.
- Note that the final stored slug includes a 6-char UUID-derived suffix.

#### [MODIFY] [04_DOMAIN_MODEL.md](file:///home/bms-del112/BMS/personal-project/wuzzkang/wuzzkang-engineering/docs/04_DOMAIN_MODEL.md)

Update Section 2.12 (Slug Value Object):
- Add: "Slug is composed of a user-provided base (lowercase, a-z, 0-9, dashes only) and a 6-character deterministic suffix derived from the first 6 hex characters of the project's UUID."
- Add: "Slug serves as the routing fallback key. Custom domains, when implemented, will resolve projects by ID and make the slug a secondary mechanism."

---

## Verification Plan

### Manual Test Checklist

| # | Action | Expected Result |
|---|---|---|
| 1 | Wedding: fill groomNickname=`Rian`, brideNickname=`Dinda` → generate | Slug auto-fills as `rian-dinda` |
| 2 | Toko: fill storeName=`Serasi Gadget` → generate | Slug auto-fills as `serasi-gadget` |
| 3 | Birthday: fill celebrantNickname=`Rafa` → generate | Slug auto-fills as `rafa-ultah` |
| 4 | Type `TOKO BESAR` in slug field | Auto-converts to `toko-besar` |
| 5 | Type special chars `toko@saya!` | Strips to `tokosaya` |
| 6 | Slug preview hint | Shows `.../?slug=toko-saya-xxxxxx` |
| 7 | Full deploy flow | Stored slug = `toko-saya-{6chars}`, live_url correct |
| 8 | API test: send uppercase slug `TOKO` | 400 Bad Request |
| 9 | API test: send underscore slug `toko_saya` | 400 Bad Request |
| 10 | Repeat deploy of same project (should not be possible, but verify slug is idempotent) | Same suffix chars if same projectId |

### Build Verification
```bash
# Frontend build check
cd wuzzkang-dashboard && npm run build

# API lint/start check
cd wuzzkang-api && npm start
```

---

## Open Questions for User

> [!IMPORTANT]
> **Q: Suffix display format**
> The new suffix akan berbentuk 6 karakter hex dari UUID project (contoh: `3b9d4c`). Apakah Anda ingin prefix lain untuk suffix ini? Misal:
> - `toko-saya-3b9d4c` (format saat ini yang diusulkan)
> - `toko-saya.3b9d4c` (gunakan titik sebagai separator, lebih "domain-like")
>
> Rekomendasi: gunakan dash (`-`) karena sudah konsisten dengan format slug existing dan lebih aman untuk URL.

> [!NOTE]
> **Catatan Custom Domain:**
> Saat custom domain diimplementasikan, slug teknikal (dengan suffix) akan tetap berfungsi sebagai fallback routing. Custom domain akan menjadi URL "cantik" yang terlihat oleh pengguna akhir.
