# Implementation Summary - Dynamic Custom Subdomain, User Limit & Global Fallback Switch

## Accomplished Work

1. **Global Fallback Switch**:
   - Exposed `subdomain_active` state through systemSettings under `/profile` endpoint (`wuzzkang-api/src/routes/profile.route.js`) by reading the configuration `system_settings.subdomain_pricing.is_active` dynamically.
   - Updated `wuzzkang-dashboard/src/app/page.js` to parse `subdomainActive` globally.
   - Modified "Lihat" links, project URLs, and the "Bagikan Undangan" sharing modal (main links + personalized guest links) to dynamically evaluate this state.
   - If subdomain is deactivated globally by the admin, all dashboard links instantly fallback to the original/default URL structure (`live_url` with parameters), bypassing subdomains safely.

2. **User Limit Safeguard (Max 5 Subdomains)**:
   - Restricts subdomain claims to 5 per user profiles globally. Rejects claims above the limit with status `400` and clear feedback messages.

3. **Route Collision Fix**:
   - Fixed route interception bug in Express by moving `/domains/pricing` and `/domains/check` above the dynamic parameter routes.

4. **Dashboard UI Subdomain Modal**:
   - Beautiful management modal featuring debounced check input fields, custom status badges, and transaction safety alerts.
