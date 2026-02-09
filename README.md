# Equity Builders — Forensic Property Intelligence Platform

Equity Builders is an enterprise-grade, forensic property intelligence platform that turns **storm-damaged commercial properties** into **verified equity gains** through:

- **Forensic inspections** (evidence-first, defensible documentation)
- **Insurance intelligence** (claim lifecycle truth + discrepancy detection)
- **AI-guided execution** (ATOS: proactive strategist + explainer that only reasons from your data)

This is a trust-and-precision product. Every action is designed to feel like a forensic expert and claims strategist is standing next to the user.

## Who it is for

- **Owners / Asset Managers**: prove damage, protect value, and convert recovery into equity outcomes.
- **Contractors**: execute scopes with verification, compliance, and progress intelligence.
- **Adjusters / Consultants**: resolve claims faster with authoritative documentation and auditability.
- **Internal teams**: standardize investigations, reduce leakage, and scale best practices.

## How it works (high level)

1. **Ingest & verify**: create a property record, attach inspection artifacts (photos/video/docs), and timestamp evidence.
2. **Classify & explain**: the system organizes evidence into a forensic timeline and flags gaps.
3. **Insurance intelligence**: track claims, interactions, scopes, and discrepancies with a defensible narrative.
4. **Execution**: assign scope to contractors, verify progress, and track compliance.
5. **Equity outcome**: quantify before/after value, claim vs payout delta, and generate an equity narrative report.

## Core modules (implemented in this repo)

1. **Intelligence Center** (heart of the platform)
2. **Forensic Property Module**
3. **Insurance Intelligence Module**
4. **Contractor Execution Module**
5. **Equity Outcome Module**

## Tech stack (locked)

- **Frontend**: Next.js (App Router), TypeScript, Tailwind
- **Backend**: Node.js via Next.js Route Handlers + Server Actions
- **Database**: Postgres (Neon-ready)
- **Auth**: Role-based (Owner, Contractor, Adjuster, Internal)
- **AI layer**: ATOS (embedded guidance; never fabricates facts)

## Repo structure (overview)

```text
src/
  app/
    (marketing)/             # public landing
    (auth)/                  # sign-in, sign-up
    (app)/                   # authenticated experience
      dashboard/
      intelligence/
      properties/
      claims/
      contractors/
      equity/
    api/                     # route handlers (server-side APIs)
  components/                # UI + layouts + ATOS interface
  db/                        # Prisma client and DB helpers
  lib/
    atos/                    # ATOS guidance engine (data-bound, explainable)
    security/                # RBAC utilities
    validation/              # zod schemas
prisma/
  schema.prisma              # Postgres schema
docs/
  architecture.md
  security.md
```

## Getting started (local)

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment

Create `.env` from `.env.example`:

```bash
cp .env.example .env
```

Set:

- **DATABASE_URL**: Neon Postgres connection string
- **NEXTAUTH_SECRET**: a long random secret (required)
- **NEXTAUTH_URL**: `http://localhost:3000` for local dev

### 3) Initialize the database

```bash
npm run db:migrate
npm run db:seed
```

### 4) Run the app

```bash
npm run dev
```

Open `http://localhost:3000`.

## Trust & explainability guarantees (ATOS)

ATOS is not a chatbot. It is a **forensic guide + strategist** that:

- **Only reasons from available platform data and user-provided facts**
- Surfaces **gaps, risks, and next-best actions** with explicit “why this matters”
- Produces **auditable** guidance (inputs and rationale are inspectable)

## Deployment notes

The app is compatible with Vercel/Render-style deployments. Provide environment variables and a Postgres database (Neon recommended).

## License

Proprietary (internal). If you need an OSS license, add it explicitly.
