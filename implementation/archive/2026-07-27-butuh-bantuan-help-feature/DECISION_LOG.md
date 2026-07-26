# Decision Log — Contact Support Feature

## DL-001: Approach Selection
- **Decision**: Use Opsi A+B (Sidebar entry + Floating FAB)
- **Reason**: User requested both for maximum discoverability. Opsi C (ticketing system) planned for future iteration.
- **Date**: 2026-07-27

## DL-002: Contact Info Source
- **Decision**: Primary source = `NEXT_PUBLIC_SUPPORT_WHATSAPP` and `NEXT_PUBLIC_SUPPORT_EMAIL` env vars; fallback = hardcoded defaults in `branding.js`
- **Reason**: User explicitly requested env vars with fallback to hardcode for flexibility
- **Date**: 2026-07-27

## DL-003: Language Tone
- **Decision**: Use friendly, approachable language. Avoid "admin" — use "tim kami", "kami siap membantu"
- **Reason**: User wants non-corporate, friendly UX tone
- **Date**: 2026-07-27

## DL-004: WhatsApp Pre-fill
- **Decision**: Auto-fill WhatsApp message with user's name, email, and balance pulled from AuthContext profile
- **Reason**: Reduces friction for user when reporting issues; gives support team instant context
- **Date**: 2026-07-27

## DL-005: FloatingHelpButton placement
- **Decision**: Fixed bottom-right corner, z-index above content but below modals. Hidden on /login and /register pages.
- **Reason**: Standard UX pattern for help widgets; login/register pages shouldn't show it (user not yet authenticated)
- **Date**: 2026-07-27
