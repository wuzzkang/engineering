# Handover - Dynamic Subdomains & Dashboard UI

The implementation of dynamic subdomain pricing and its responsive dashboard UI modal is complete.

## Verification Details

The test suite executed successfully, validating:
1. Dynamic cost checking from DB (`products` table) inside `DomainService`.
2. Atomic wallet balance reduction based on dynamic DB costs.
3. Subdomain format verification rules (min 3 chars, max 15 chars, alphanumeric + dashes).
4. Prevention of subdomain claims on draft landing pages.
5. Non-refundable release process with instant state cleanup.

## UI Actions Available
- **Project Card Info**: Deployed projects now display their custom subdomain or a dynamic link to add one.
- **Dynamic Pricing View**: Modal shows current dynamic claim price fetched from API dynamically.
- **Availability Input**: Check text availability live as the user types (debounced).
- **Domain Release**: Active subdomains can be removed with standard confirmation and warning indicators.
