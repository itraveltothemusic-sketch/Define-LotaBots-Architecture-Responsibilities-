# Equity Builders — Forensic Property Intelligence Platform

Equity Builders is an enterprise-grade platform for transforming storm-damaged commercial properties into **verified equity gains** through forensic evidence management, insurance intelligence, and execution governance.

This repository is intentionally structured as a production-oriented foundation, not a throwaway demo.

---

## What this platform is

A unified operating system where ownership teams, contractors, adjusters, and internal specialists work from the same trusted record:

- Forensic inspections and chain-of-custody evidence
- Claim lifecycle control and carrier negotiation intelligence
- Contractor execution governance with compliance verification
- Equity outcome reporting tied to documented operational actions

At the center is **ATOS** (Adaptive Technical Operations Strategist): an embedded intelligence layer that provides explainable, evidence-grounded guidance in every module.

---

## Who it is for

- **Owner**: Portfolio-level risk, settlement quality, and equity outcome visibility
- **Contractor**: Scope execution, completion verification, and compliance accountability
- **Adjuster**: Defensible evidence review, scope alignment, and claim adjudication
- **Internal**: Cross-functional command across forensic, insurance, and execution tracks

---

## How it works (high level)

1. **Forensic Intake**
   - Build canonical property profile
   - Ingest evidence with chain-of-custody references
   - Classify damage with verification status

2. **Insurance Intelligence**
   - Track claim milestones and owner accountability
   - Log carrier interactions and commitments
   - Quantify discrepancy deltas between insured and carrier scope

3. **Contractor Execution**
   - Validate onboarding posture
   - Assign and track scope completion
   - Verify compliance checkpoints

4. **Equity Outcome**
   - Reconcile claimed vs settled values
   - Estimate before/after valuation movement
   - Publish a traceable equity narrative

5. **ATOS Guidance Everywhere**
   - Why this matters
   - Risks surfaced
   - Opportunities detected
   - Recommended actions
   - Confidence label for evidence grounding

---

## Technology stack (locked)

- **Frontend:** Next.js App Router, TypeScript, Tailwind CSS
- **Backend:** Node.js runtime using Route Handlers + Server Actions
- **Database target:** Postgres (Neon)
- **Auth:** Role-based access with signed session cookies
- **AI layer:** ATOS guidance engine embedded in each core module
- **Deployment:** Vercel/Render compatible

---

## Repository structure

```txt
.
├── docs/
│   └── ARCHITECTURE.md
├── prisma/
│   └── schema.prisma
├── src/
│   ├── app/
│   │   ├── (app)/
│   │   │   ├── dashboard/
│   │   │   ├── forensic/
│   │   │   ├── insurance/
│   │   │   ├── execution/
│   │   │   └── equity/
│   │   ├── api/
│   │   │   ├── atos/advice/
│   │   │   └── auth/session/
│   │   ├── login/
│   │   ├── not-authorized/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── atos/
│   │   ├── intelligence/
│   │   ├── layout/
│   │   └── ui/
│   ├── lib/
│   │   ├── auth/
│   │   ├── atos.ts
│   │   ├── navigation.ts
│   │   └── utils.ts
│   ├── server/
│   │   ├── data/
│   │   ├── db/
│   │   └── repositories/
│   ├── middleware.ts
│   └── types/
└── README.md
```

---

## Core modules implemented

Implemented in the required order:

1. **Intelligence Center**
   - Central command dashboard
   - Property overview
   - Evidence/document timeline
   - ATOS guidance panel

2. **Forensic Property Module**
   - Property profile
   - Inspection records
   - Evidence ingestion metrics
   - Damage classification matrix

3. **Insurance Intelligence Module**
   - Claim lifecycle tracker
   - Carrier interaction logs
   - Scope discrepancy detection table

4. **Contractor Execution Module**
   - Contractor onboarding matrix
   - Scope assignments and progress verification
   - Compliance checkpoint tracking

5. **Equity Outcome Module**
   - Before/after valuation metrics
   - Claimed vs settled reconciliation
   - Equity gain narrative

---

## ATOS behavior contract

ATOS is a forensic strategist, not a freeform chatbot.

ATOS in this platform:
- Proactively guides decisions inside each module context
- Explains why recommendations matter
- Surfaces risks, gaps, and opportunities
- Provides confidence labeling
- Operates only on the current verified data model (no fabricated facts)

Implementation entrypoint: `src/lib/atos.ts`

---

## Local development

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment

Create `.env.local`:

```bash
AUTH_SESSION_SECRET=replace-with-strong-random-secret
DATABASE_URL=postgres://...
```

> `DATABASE_URL` is required when connecting to Neon-backed persistence logic.  
> The current scaffold runs with seeded repository data by default.

### 3) Run the app

```bash
npm run dev
```

Visit `http://localhost:3000`.

### 4) Validate

```bash
npm run lint
npm run typecheck
npm run build
```

---

## Deployment notes

- Works with Vercel/Render Node runtimes.
- Set environment variables in deployment config:
  - `AUTH_SESSION_SECRET`
  - `DATABASE_URL`
- Replace seeded repository internals (`src/server/repositories`) with Neon queries for production datasets.

---

## Design intent

This foundation emphasizes:
- **Accuracy over aesthetics**
- **Explainability over black boxes**
- **Trust and verification as first-class concerns**
- **Role-aware intelligence at every workflow step**

The result is a platform that should feel like a forensic expert and strategic operator is continuously present.
