# Equity Builders

Forensic Property Intelligence Platform that converts commercial storm damage into verified equity gains through:

- forensic inspections and evidence integrity,
- insurance claim intelligence,
- contractor execution governance,
- quantified equity outcomes.

This repository is built as a production-grade Next.js App Router platform with role-based access, modular domain architecture, and an explainable AI guidance layer called **ATOS**.

---

## 1) What this platform is

Equity Builders is an enterprise operating system for storm-impacted commercial real estate portfolios.  
It is designed to reduce value leakage by making every decision auditable, evidence-backed, and strategy-guided.

Core design priorities:

1. Accuracy over aesthetics
2. Explainability over black boxes
3. Trust, verification, and documentation as first-class capabilities
4. Intelligent guidance at every user touchpoint

---

## 2) Who it is for

- **Owners / Asset Managers**: recover claim value while increasing long-term equity.
- **Contractors**: execute scoped work with compliance and verification controls.
- **Adjusters**: align technical evidence to carrier decision workflows.
- **Internal Operations Teams**: orchestrate multi-party execution with forensic accountability.

---

## 3) How it works (high-level)

1. **Intelligence Center** aggregates operating risk, claim posture, evidence timeline, and ATOS recommendations.
2. **Forensic Property Module** structures profiles, inspections, ingestion queues, and damage classification.
3. **Insurance Intelligence Module** tracks claim lifecycle, carrier communication, and scope discrepancies.
4. **Contractor Execution Module** governs onboarding, assignment progress, and compliance checkpoints.
5. **Equity Outcome Module** quantifies valuation uplift, claim delta, and narrative confidence reporting.

ATOS is embedded in each module to provide:

- proactive risk and opportunity detection,
- “why this matters” context,
- action recommendations tied to specific evidence references,
- bounded reasoning from platform data only.

---

## 4) Technology stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4
- **Backend**: Next.js route handlers / server components
- **Database**: PostgreSQL (Neon-compatible) via Prisma schema
- **Auth**: role-based session auth (Owner, Contractor, Adjuster, Internal)
- **AI layer**: ATOS deterministic analysis engine + API interface
- **Deployment target**: Vercel / Render compatible

---

## 5) Repository structure

```text
src/
  app/
    page.tsx                         # Landing page
    login/page.tsx                   # Auth entry
    platform/                        # Authenticated shell + module routes
    api/
      auth/login|logout/route.ts     # Session auth handlers
      atos/route.ts                  # ATOS analysis endpoint
  components/
    layout/                          # Platform shell and navigation
    ui/                              # Shared UI primitives
    atos/assistant-panel.tsx         # Embedded ATOS interface
  features/
    intelligence/
    forensic/
    insurance/
    contractor/
    equity/                          # Module UIs
  lib/
    auth/                            # Session + authorization policy
    atos/                            # Explainable guidance engine
    data/                            # Repository + seeded forensic dataset
    db/                              # Prisma client bootstrap
  types/domain.ts                    # Canonical domain model
prisma/schema.prisma                 # Neon/Postgres data model
middleware.ts                        # Route protection and RBAC enforcement
```

---

## 6) Local development

### Prerequisites

- Node.js 20+
- npm 10+

### Setup

```bash
npm install
cp .env.example .env.local
```

Set environment values in `.env.local`:

- `AUTH_SECRET` (long random string, required)
- `DATABASE_URL` (Neon/Postgres URL, required when using Prisma migrations)

### Run

```bash
npm run dev
```

Open: `http://localhost:3000`

### Quality checks

```bash
npm run lint
npm run typecheck
npm run build
```

---

## 7) Demo authentication directory

For local bootstrap, all demo users share password: `EquityBuilders-2026`.

- `owner@equitybuilders.local` (OWNER)
- `adjuster@equitybuilders.local` (ADJUSTER)
- `contractor@equitybuilders.local` (CONTRACTOR)
- `internal@equitybuilders.local` (INTERNAL)

> Production deployments should replace demo-directory auth with enterprise SSO / IdP integration.

---

## 8) Database model status

`prisma/schema.prisma` defines first-class entities for:

- properties, inspections, evidence chains
- claims, carrier interactions, scope comparison lines
- contractors, assignments, compliance checkpoints
- equity outcomes and narrative reports

This enables direct migration from seeded mock data to persistent Postgres-backed operations.

---

## 9) Current implementation scope

Implemented in this repository:

- complete scaffold and modular folder architecture,
- role-gated authenticated shell,
- working landing and login experience,
- all five core module interfaces,
- ATOS guidance panel + module-aware analysis API,
- explainable recommendation framework tied to evidence references.

---

## 10) Next production hardening steps

1. Replace demo auth with SSO (OIDC/SAML) and MFA policy enforcement.
2. Persist module repositories on Prisma/Postgres and add migration/seed workflows.
3. Introduce event-driven ingestion pipelines for media metadata verification.
4. Add comprehensive test coverage (unit, integration, and end-to-end).
5. Add observability (structured logs, tracing, and module-level SLIs).
