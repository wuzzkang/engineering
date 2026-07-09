# Handover — Custom Domain / Subdomain System (Phase 1)

## Verification Evidence

### E2E Test Execution (2026-07-09)

```
🧪 MEMULAI VERIFIKASI DOMAIN SERVICE
👤 Menggunakan User Test ID: 8cfbe2b9-61e3-4dfb-8cab-0dcd057b5fd0 (Saldo Awal: 1000 credit)
💰 Saldo sekarang: 1000 credit
📁 Membuat dummy project draft...
✅ Project created: d66160bb-bc4a-4e9b-b96a-431d617b9fee

🔍 Test 1: Check availability subdomain...
- Subdomain "test-623" available? true

❌ Test 2: Claim subdomain (Harus Gagal karena status masih draft)...
  ✅ Sukses ditolak dengan pesan: Project harus dideploy terlebih dahulu sebelum menggunakan subdomain.

🚀 Mengubah status project ke deployed...
💎 Test 3: Claim subdomain "test-623"...
  ✅ Claim result: {
    success: true,
    data: {
      domain: 'test-623.siluet.web.id',
      domain_type: 'subdomain',
      domain_status: 'active',
      new_balance: 990
    }
  }
  💰 Saldo berkurang: 10 credit (Expected: 10)
  ✅ Pengurangan saldo benar!

🔍 Test 4: Check availability untuk "test-623" yang sudah diklaim...
- Subdomain "test-623" available? false ✅ BENAR (Sudah tidak tersedia)

📋 Test 5: Get domain status...
  ✅ Status: {
    success: true,
    data: {
      project_id: 'd66160bb-bc4a-4e9b-b96a-431d617b9fee',
      custom_domain: 'test-623.siluet.web.id',
      domain_type: 'subdomain',
      domain_status: 'active',
      slug_url: 'https://siluet.web.id/?slug=slug-1783586852505',
      domain_url: 'https://test-623.siluet.web.id'
    }
  }

🗑️ Test 6: Release domain...
  ✅ Release result: { success: true, message: 'Custom domain/subdomain berhasil dihapus.' }
  📄 Data di DB setelah release: { custom_domain: null, domain_type: 'none' }
  ✅ Domain berhasil dibersihkan dari DB!

🧹 Membersihkan dummy project...
✨ Selesai!
```

### Database Migration

```
Applying migration 20260709100000_add_domain_type_and_index.sql...
Finished supabase db push.
```

## Remaining Manual Actions (Pre-Launch)

1. **Cloudflare DNS Setup (REQUIRED before users can access subdomains)**
   - Log in to Cloudflare Dashboard
   - Select zone: `siluet.web.id`
   - Add DNS record:
     - Type: `CNAME`
     - Name: `*`
     - Target: `wuzzkang.github.io`
     - Proxy: **ON** (orange cloud)
   - Cloudflare Universal SSL auto-covers `*.siluet.web.id` — no extra config needed

## Next Implementation

- Dashboard UI for subdomain management (claim form, status indicator, release button)
- Phase 2: Full custom domain (Cloudflare for SaaS) — implement `CloudflareProvider`
