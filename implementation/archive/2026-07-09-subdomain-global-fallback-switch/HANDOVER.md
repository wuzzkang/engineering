# Handover - Subdomain User Limit, Route Fixes & Global Fallback Switch

The implementation of settings-based subdomain pricing, maximum user domain limits, global fallback switches, and its responsive dashboard UI modal is complete.

## Verification & Switch Details

1. **Global Fallback Switch**: If the subdomain feature is turned off in the database (`system_settings.subdomain_pricing.is_active` set to `false`), the dashboard automatically and instantly redirects all viewing, copy-linking, and WhatsApp guest invite-linking targets to the original/default URL structure (`live_url`). When `true`, it uses the custom subdomains.
2. **User Subdomain Limit**: Users can now claim a maximum of 5 subdomains globally. If they exceed this count, the claim is rejected with a clear message: `"Gagal mengklaim subdomain. Anda telah mencapai batas maksimal 5 subdomain."` inside an HTTP `400` response. This limit is dynamic and configured under `system_settings.subdomain_pricing.max_per_user`.
3. **Route Collision**: Resolved Express collision by placing static routes before dynamic parameters in `domain.route.js`.
4. **Subdomain Settings**: Pricing and user limits are safely loaded dynamically from `system_settings.subdomain_pricing`.
5. **Modal UI**: Live availability input validations work flawlessly.
