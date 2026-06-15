# Nivya

MF-only mutual fund distribution platform prototype (Corporate MFD model). Groww-style mobile UI with mock NAV, portfolio, SIP, and order flows.

**Scope:** Mutual funds only — lumpsum, SIP, redeem, switch, portfolio. Not a stock broker.

## Run locally

**UI only:**

```bash
npm install
npm run dev
```

**UI + BFF API** (two terminals):

```bash
npm install
npm run dev:api    # terminal 1 — http://localhost:3001/v1
npm run dev        # terminal 2 — Vite proxies /v1 → BFF
```

Demo login: `POST /v1/auth/otp/verify` with `{ "phone": "9876543210", "otp": "123456" }`.

## Repository layout

| Path | Description |
|------|-------------|
| `nivya-app.jsx` | Single-file React prototype (MF-only demo) |
| `src/main.jsx` | Vite entry point |
| `services/api/` | BFF — Fastify mock API (`docs/openapi.yaml`) |
| `services/vendor-mf/` | `VendorMFAdapter` + mock exchange adapter |
| `packages/compliance/` | ARN tagline, order compliance helpers |
| `infra/schema.sql` | PostgreSQL schema (v0.1) |
| `docs/ADR-001-hybrid-architecture.md` | Hybrid architecture decision |
| `docs/openapi.yaml` | BFF OpenAPI spec v0.1 |
| `NIVYA-MF-PLATFORM-REPORT.md` | Strategic architecture report |
| `HYBRID-E2E-PLAN.md` | Hybrid execution plan |

## Compliance note

Demo build uses placeholder `NIVYA_ARN=ARN-XXXXXX`. Set real ARN/EUIN in `services/api/.env` before production. Enable strict checks with `NIVYA_STRICT_COMPLIANCE=true`.

## License

MIT — see [LICENSE](LICENSE).
