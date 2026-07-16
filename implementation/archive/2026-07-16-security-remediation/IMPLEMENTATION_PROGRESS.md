# Implementation Progress: Security & Logic Remediation

- [x] Milestone 1: Fix BOLA (IDOR) Vulnerabilities
  - [x] Fix payment controller body manipulation (`payment.controller.js`)
  - [x] Fix project detail route leaks (`project.route.js`)
  - [x] Fix queue deployment route leaks (`deploy.route.js`)
- [x] Milestone 2: Enforce Database Atomicity & Constraints
  - [x] Add unique partial index on `projects.custom_domain`
  - [x] Add atomic balance update RPC (`increment_user_balance`)
  - [x] Add atomic coupon update RPC (`increment_coupon_uses`)
- [x] Milestone 3: Fix Path Traversal and Privilege Escalation
  - [x] Fix media deletion path normalization (`image.route.js`)
  - [x] Restrict user deletion endpoint to super_admins (`admin.route.js`)
