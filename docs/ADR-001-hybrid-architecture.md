# ADR-001: Hybrid MF Platform Architecture

**Status:** Accepted  
**Date:** 2026-06-16  
**Deciders:** Engineering (Nivya)  
**Related:** `HYBRID-E2E-PLAN.md`, `NIVYA-MF-PLATFORM-REPORT.md`

## Context

Nivya launches as a **Corporate Mutual Fund Distributor** (AMFI ARN), MF-only. Full custom exchange integrations (BSE StAR MF, NSE MF Invest, per-AMC empanelment, RTA reconciliation) take 9–12+ months. A hybrid model uses a wealth-tech vendor for transaction rails while Nivya owns branded UX, user data, order orchestration, and compliance audit trails.

## Decision

Adopt **Path B — Hybrid** for v1:

| Layer | Owner | Technology (v1) |
|-------|-------|-----------------|
| Investor web UI | Nivya | React (Vite prototype → `apps/web`) |
| Mobile (later) | Nivya | React Native |
| BFF / API | Nivya | Node.js (`services/api`) |
| User DB, orders ledger, audit | Nivya | PostgreSQL |
| Exchange orders, mandates, scheme master (initial) | Vendor | `VendorMFAdapter` abstraction |
| KYC (initial) | Vendor or KRA API | Orchestrated by Nivya BFF |

All production orders **must** include Nivya **ARN + EUIN** before submission to vendor/exchange.

## Architecture

```
Investor UI (web / mobile)
        │  HTTPS /v1/*
        ▼
  Nivya BFF (services/api)
   ├── Auth (OTP)
   ├── Profile + KYC orchestration
   ├── Order orchestration + consent gate
   ├── Portfolio (cache + vendor sync)
   └── Immutable audit_events
        │
        ▼
  VendorMFAdapter (services/vendor-mf)
   ├── MockAdapter (dev / UAT without vendor)
   └── VendorXAdapter (production — TBD)
        │
        ▼
  BSE StAR MF / NSE MF Invest → RTA → AMC
```

## Consequences

### Positive

- Faster time-to-market (target 5–8 months vs 9–12 custom).
- Nivya controls UX differentiation and investor relationship.
- `VendorMFAdapter` limits vendor lock-in; own PostgreSQL ledger retained.
- Mock adapter enables parallel frontend/backend build before vendor selection.

### Negative

- Dual dependency: vendor SLA + Nivya BFF availability.
- Revenue share / per-transaction vendor fees.
- Migration effort if vendor changes or rails brought in-house later.

### Neutral

- Monorepo grows incrementally: `services/api`, `services/vendor-mf`, `packages/compliance`, `docs/openapi.yaml`.
- PostgreSQL schema (`infra/schema.sql`) is source of truth for Nivya-owned data.

## Alternatives considered

| Option | Rejected because |
|--------|------------------|
| Full white-label app | No UX control; weak brand |
| Full custom stack v1 | Too slow and costly for new entity |
| Stock broker + MF | Wrong license; requires SEBI broker registration |

## Compliance constraints (non-negotiable)

- Display AMFI tagline + ARN on all surfaces (`packages/compliance`).
- SID/KIM consent logged in `consents` before first investment per scheme.
- Server-side block if KYC incomplete or EUIN/ARN missing on order payload.
- Regular plans only for commission-eligible distribution.

## Implementation milestones

1. ✅ MF-only UI prototype (`nivya-app.jsx`)
2. ✅ OpenAPI v0.1 (`docs/openapi.yaml`)
3. ✅ Mock BFF + `MockVendorMFAdapter`
4. Vendor selection + UAT credentials
5. Wire UI to BFF; replace mock adapter with vendor adapter
6. Production ARN/EUIN in config
