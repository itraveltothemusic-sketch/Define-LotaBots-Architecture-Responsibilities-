# Equity Builders - Forensic Property Intelligence Platform

Equity Builders is an enterprise platform that converts commercial storm damage into verified equity recovery through forensic evidence, insurance intelligence, guided contractor execution, and outcome analytics.

This repository is built as a production-oriented foundation, not a throwaway demo.  
The design center is trust, explainability, and defensible decision quality.

---

## What this platform is

Equity Builders is a command system for storm-impacted commercial portfolios where every step must be documented, auditable, and financially explainable.

The platform combines:

- forensic inspection operations
- insurance claim intelligence
- contractor execution governance
- equity outcome analytics
- a deterministic AI guidance layer (ATOS) that explains risk and next-best actions from available data

---

## Who it is for

- Owners / asset managers: maximize recoverable value and protect portfolio equity
- Adjusters / claim professionals: evaluate complete forensic evidence and scope variances
- Contractors: execute verified scopes with compliance and milestone accountability
- Internal operations teams: coordinate forensic, insurance, and execution workstreams

---

## How it works (high-level)

1. Forensic capture: properties, inspections, media, and documents are ingested with verification status.
2. Insurance intelligence: claims, carrier interactions, and scope discrepancies are continuously tracked.
3. Execution control: contractor onboarding, assignment, and milestone verification are governed.
4. Equity analytics: before/after valuation and claim-to-payout delta are translated into equity narratives.
5. ATOS guidance: every module surfaces explainable risks, opportunities, and recommended actions.

---

## Technology stack (locked)

- Frontend: Next.js App Router, TypeScript, Tailwind CSS
- Backend: Next.js route handlers and server actions
- Database: PostgreSQL (Neon-ready, schema included in `db/schema.sql`)
- Auth: Role-based session auth (Owner, Contractor, Adjuster, Internal)
- AI layer: ATOS deterministic guidance engine (`src/lib/atos/engine.ts`)
- Deploy target: Vercel / Render compatible

---

## Initial module coverage

### 1) Intelligence Center (core)
- central KPI board
- property overview
- evidence/document timeline
- ATOS strategy panel

### 2) Forensic Property Module
- property profiles
- inspection records
- ingestion timeline for photos/videos/documents
- damage classification distribution

### 3) Insurance Intelligence Module
- claim lifecycle board
- carrier interaction log
- scope discrepancy detection

### 4) Contractor Execution Module
- contractor onboarding + compliance
- milestone progress and verification
- blocker visibility

### 5) Equity Outcome Module
- before/after valuation view
- claim vs payout conversion
- equity gain narrative by property

---

## Repository structure

```text
.
|- db/
|  |- schema.sql
|- src/
|  |- app/
|  |  |- (marketing)/page.tsx
|  |  |- (auth)/login/
|  |  |- (platform)/dashboard/
|  |  |  |- page.tsx
|  |  |  |- forensic/page.tsx
|  |  |  |- insurance/page.tsx
|  |  |  |- execution/page.tsx
|  |  |  |- equity/page.tsx
|  |  |- api/
|  |     |- intelligence/route.ts
|  |     |- forensic/properties/route.ts
|  |     |- insurance/claims/route.ts
|  |     |- execution/contractors/route.ts
|  |     |- equity/outcomes/route.ts
|  |- components/
|  |  |- atos/
|  |  |- dashboard/
|  |  |- ui/
|  |- config/navigation.ts
|  |- lib/
|  |  |- auth/
|  |  |- atos/
|  |  |- data/
|  |  |- db/
|  |  |- services/
|  |  |- utils/
|  |- types/domain.ts
|- middleware.ts
|- .env.example
```

---

## Run locally

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment

```bash
cp .env.example .env.local
```

Set at minimum:

- `AUTH_SECRET` (32+ random characters)
- `DATABASE_URL` (Neon/Postgres connection string)

### 3) Start app

```bash
npm run dev
```

Open `http://localhost:3000`.

---

## Bootstrap RBAC accounts (local only)

For local development, the app seeds role-based accounts you can use to explore the system via `/login`:

- Owner (portfolio owner)
- Contractor (execution partner)
- Adjuster (carrier-side)
- Internal (Equity Builders internal)

Default credentials for these accounts are defined in the local seed configuration or environment (e.g., `.env.local`) and are intended for **local development only**. Do not reuse them in any deployed or shared environment; replace seeded users with your identity provider and persistent user store before production use.

---

## Explainability + trust posture

ATOS in this codebase is deterministic and evidence-constrained:

- it does not fabricate data
- it computes guidance from provided module datasets
- it outputs explicit risks, opportunities, and rationale-linked recommendations

This ensures that insurer, operations, and investor stakeholders can trace recommendations back to observed signals.

---

## Production hardening checklist (next step)

- replace seeded auth with enterprise IdP + MFA
- persist module data in Postgres with migrations and auditing
- add event sourcing for evidence-chain integrity
- introduce background workers for document processing
- add end-to-end tests and SLO-based observability
