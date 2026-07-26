# AI Context — Contact Support Feature (Help Button)

## Session Info
- **Started**: 2026-07-27
- **Task**: Add "Butuh Bantuan?" / Help feature to the Wuzzkang Dashboard
- **Scope**: Opsi A+B — WhatsApp Direct Link in Sidebar + Floating Help FAB on all pages
- **Repositories affected**: `wuzzkang-dashboard` only

## Target Files
- `src/config/branding.js` — Add SUPPORT_WHATSAPP & SUPPORT_EMAIL constants
- `src/components/Sidebar.js` — Add "Butuh Bantuan?" entry in mobile drawer bottom section
- `src/app/layout.js` — Mount FloatingHelpButton globally
- `src/components/FloatingHelpButton.jsx` — NEW: Floating FAB component (always visible)

## Key Constraints
- Language: friendly Bahasa Indonesia (avoid "admin" language, use "tim kami", "kami siap bantu", etc.)
- WhatsApp number & email MUST come from env vars (`NEXT_PUBLIC_SUPPORT_WHATSAPP`, `NEXT_PUBLIC_SUPPORT_EMAIL`)
- Fallback to hardcoded values if env vars are not set
- Must consume `BRAND_NAME` from `@/config/branding` (no hardcoded brand names)
- Must work on mobile (WhatsApp deeplink) and desktop (web.whatsapp.com)
- Must adapt to all 3 dashboard themes (Clean, Retro, Classic Dark) via CSS variables
- Pre-fill WhatsApp message with: user name, email, user balance, and a placeholder for their issue
- Must NOT break existing Bottom Nav or Sidebar layout
