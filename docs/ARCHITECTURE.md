# Equity Builders Platform Architecture

## System orientation

Equity Builders is built around one principle: **evidence-first decisioning**.  
Every module consumes the same canonical property intelligence record and every advisory emitted by ATOS must map back to verified data.

## Runtime stack

- **Frontend and orchestration:** Next.js App Router + TypeScript
- **UI system:** Tailwind CSS (utility-first with strict composability)
- **Persistence target:** Postgres (Neon) via repository boundary
- **Auth model:** role-scoped, signed cookie session
- **AI behavior layer:** ATOS guidance engine (`src/lib/atos.ts`)

## Core architectural boundaries

### 1. App routes (`src/app`)
- Presentation and interaction orchestration.
- Server-first rendering for trusted data access and role checks.

### 2. Domain and policy (`src/types`, `src/lib`)
- Typed forensic and claim entities.
- Authorization policy and navigation policy in one place.
- Explainable ATOS logic isolated from UI components.

### 3. Data/repository layer (`src/server`)
- Repository API exposes role-scoped intelligence snapshots.
- Current implementation uses deterministic seeded data.
- Production implementation swaps internals to Neon-backed queries with no page-layer changes.

## Explainability posture

ATOS guidance is required to return:
- Why the recommendation matters
- Enumerated risks and opportunities
- Ordered recommended actions
- Confidence label indicating evidence sufficiency

This keeps advisory output audit-ready for engineering, insurers, and investors.

## Security posture

- Session payloads are signed with HMAC (`AUTH_SESSION_SECRET`).
- Sensitive pages are protected in server layouts.
- Role-based module access is enforced centrally.
