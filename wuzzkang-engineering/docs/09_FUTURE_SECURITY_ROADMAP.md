# Future Security Hardening Roadmap

> **Status**: Planned (Future Implementation)  
> **Target System**: Wuzzkang AI Platform Ecosystem  
> **Goal**: Enhance token security, prevent XSS token theft, and harden API endpoint defenses.

---

## 1. Overview

Documented planned security enhancements to be executed in future refactoring cycles. These enhancements aim to mitigate risks such as JWT token theft, XSS exploitation, and credential brute-forcing.

---

## 2. Planned Security Initiatives

### Item 1: HttpOnly Cookie Session Management (Anti-XSS)
- **Current State**: JWT tokens are stored in browser `localStorage` and sent via `Authorization: Bearer <TOKEN>` header.
- **Future Enhancement**:
  - Migrate JWT session storage to `HttpOnly`, `Secure`, and `SameSite=Strict` cookies.
  - Set cookie flags: `HttpOnly` (prevents JavaScript access), `Secure` (HTTPS only), `SameSite=Strict` (prevents CSRF).
  - Ensures malicious browser scripts (XSS attacks) cannot read or exfiltrate session tokens.

### Item 2: Active Session & Multi-Device Revocation Dashboard
- **Current State**: Password reset revokes refresh tokens via Supabase.
- **Future Enhancement**:
  - Provide a dedicated **Keamanan & Perangkat Active** section in User Profile.
  - Display active devices (Device Name, Operating System, IP Address, Last Access Time).
  - Allow users to click **"Logout from All Other Devices"** to instantly invalidate all active Refresh Tokens.

### Item 3: Redis Rate Limiting & Anomaly Detection
- **Current State**: Standard backend endpoint processing.
- **Future Enhancement**:
  - Implement Redis-backed sliding window rate limiters (`wuzzkang:ratelimit:auth:*` & `wuzzkang:ratelimit:deploy:*`).
  - Block IP addresses attempting rapid brute-force credential requests or coupon abuse.
  - Log security audit events to `security_audit_logs` in Supabase.

### Item 4: Content Security Policy (CSP) & Headers Hardening
- **Current State**: Standard HTTP headers in Next.js & Express.
- **Future Enhancement**:
  - Enforce strict `Content-Security-Policy` (CSP) headers across Dashboard & API.
  - Restrict script sources (`script-src 'self'`) to block inline script injection.
  - Add `X-Frame-Options: SAMEORIGIN` and `X-Content-Type-Options: nosniff`.

---

## 3. Implementation Schedule

These initiatives will be prioritized during **Phase 4: Security & Production Hardening** of the Wuzzkang Platform Roadmap.
