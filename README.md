# Equity Builders — Forensic Property Intelligence Platform

Equity Builders is an enterprise platform that transforms storm-damaged commercial
properties into verified equity gains through:

- forensic inspections and evidence certainty,
- insurance claim intelligence and discrepancy defense,
- contractor execution controls,
- and explainable AI guidance from **ATOS**.

This repository contains a production-oriented greenfield scaffold with modular
architecture, role-aware access control, and deterministic intelligence workflows.

---

## What this platform is

Equity Builders is a trust-first operating system for property recovery and
financial outcome optimization. It is designed to make every critical decision:

1. **Evidence-backed** (chain-of-custody and verification aware)
2. **Explainable** (ATOS reasoning from platform data, not speculation)
3. **Actionable** (clear next steps with risk/opportunity visibility)

---

## Who it is for

- **Owners / Asset Managers**: monitor claim posture, recovery velocity, and equity lift
- **Adjusters / Claim Teams**: track lifecycle stages, carrier interactions, and scope gaps
- **Contractors**: execute approved scopes with verification and compliance discipline
- **Internal Operations**: orchestrate cross-functional workflows with auditability

---

## How it works (high level)

1. **Intelligence Center** unifies property, evidence, and claim context.
2. **Forensic Property Module** tracks inspections, ingestion, and damage classes.
3. **Insurance Intelligence Module** manages claims, carrier interactions, and deltas.
4. **Contractor Execution Module** controls onboarding, assignments, and compliance.
5. **Equity Outcome Module** connects operational work to valuation and payout impact.
6. **ATOS Assistant** is embedded in each module to surface deterministic guidance.

---

## Technology stack

- **Frontend**: Next.js App Router, TypeScript, Tailwind CSS
- **Backend**: Next.js Route Handlers + Server Actions
- **Database**: Neon/Postgres-ready client (`postgres`)
- **Validation**: Zod
- **Auth model**: role-based session cookie (Owner, Contractor, Adjuster, Internal)

---

## Current project structure

```text
src/
  app/
    api/
      atos/route.ts
      intelligence/summary/route.ts
      properties/route.ts
      insurance/route.ts
      contractors/route.ts
      equity/route.ts
    dashboard/
      layout.tsx
      intelligence/page.tsx
      properties/page.tsx
      insurance/page.tsx
      contractors/page.tsx
      equity/page.tsx
      page.tsx
    login/
      actions.ts
      page.tsx
    logout/route.ts
    globals.css
    layout.tsx
    page.tsx
  components/
    atos/
    intelligence/
    layout/
    ui/
  lib/
    auth/
    db/
    intelligence/
    mock/
    utils/
  types/
    domain.ts
```

---

## Running locally

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment

```bash
cp .env.example .env.local
```

Set `DATABASE_URL` for Neon when available.  
If not configured, the platform runs in deterministic fixture mode.

### 3) Start the app

```bash
npm run dev
```

Open `http://localhost:3000`.

---

## Authentication and authorization model

Current implementation uses a secure role-based session cookie for bootstrapping.
The dashboard layout enforces authentication, and each module route checks role access:

- **Owner**: all modules
- **Internal**: all modules
- **Adjuster**: intelligence, forensic, insurance, equity
- **Contractor**: intelligence, forensic, contractor execution

---

## ATOS behavior contract

ATOS is not treated as an open-ended chatbot.

ATOS in this codebase:
- reasons from loaded platform records,
- returns explicit **why this matters** rationale,
- provides **next best action** guidance,
- includes confidence scoring,
- avoids unsupported assertions by design.

---

## Next enterprise steps

1. Replace fixture repositories with Neon-backed query models and migrations
2. Integrate SSO (SAML/OIDC) and audited RBAC administration
3. Add immutable evidence storage with signed URL ingestion
4. Add workflow engine for claim and execution milestones
5. Add reporting export layer (PDF/CSV + investor packet generation)

---

## Quality checks

```bash
npm run lint
npm run build
```

Both should pass before deployment.
