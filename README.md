# Equity Builders — Forensic Property Intelligence Platform

Equity Builders turns **commercial storm-damaged properties** into **verified equity gains** by combining forensic inspections, insurance intelligence, and guided execution — with trust, documentation, and explainability as first‑class citizens.

This repository is a **production-grade** Next.js (App Router) system designed to be reviewed by engineers, insurers, and investors.

## Who this is for

- **Owners**: Understand damage scope, coverage leverage, execution status, and verified outcome.
- **Contractors**: Execute scopes with evidence requirements and compliance guardrails.
- **Adjusters**: Review organized evidence, timelines, scope comparisons, and discrepancy explanations.
- **Internal**: Operate forensic workflows, quality control, and outcome reporting.

## Core product concept

Every property becomes a **case file**:

- **Evidence is structured** (photos, video, docs, notes) with provenance and timestamps.
- **Damage is classified** (what, where, severity, confidence, supporting evidence).
- **Claims are tracked** as a lifecycle with carrier interactions and scope deltas.
- **Execution is verified** with progress evidence and compliance checkpoints.
- **Outcome is computed** and explained: before/after valuation, payout deltas, equity narrative.

## ATOS (Central Intelligence Assistant)

ATOS is not a chatbot. ATOS is a **forensic guide + strategist + explainer** embedded throughout the platform.

ATOS must:

- Proactively guide users through the next best actions
- Explain *why each step matters* (coverage risk, valuation impact, compliance)
- Surface **gaps, risks, and opportunities**
- Never hallucinate facts — it may only reason from platform data and explicitly call out missing data

The codebase treats ATOS as a **decision-support layer** with deterministic, inspectable reasoning paths first, and model-powered augmentation second.

## Tech stack (locked)

- **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS
- **Backend**: Node.js via Next.js Route Handlers + Server Actions
- **Database**: Postgres (assume Neon)
- **Auth**: Role-based (Owner, Contractor, Adjuster, Internal)
- **Deploy**: Vercel / Render compatible

## Repository structure

This is an npm workspace with the web application in `apps/web`.

```
apps/
  web/                  # Next.js App Router application (UI + server routes/actions)
docs/                   # Architecture and decision records (added as the system grows)
```

Within `apps/web/src` we keep a scalable structure:

- `app/`: routes, layouts, route handlers
- `modules/`: domain modules (Intelligence Center, Forensic Property, Insurance Intelligence, etc.)
- `server/`: auth, db, validation, server actions
- `components/`: shared UI primitives and shell components

## Getting started (local)

### 1) Install dependencies

From the repo root:

```bash
npm install
```

### 2) Configure environment

Copy the template and fill in values:

- Copy `.env.example` → `apps/web/.env.local`
- Set `DATABASE_URL` to your Neon Postgres connection string
- Set `AUTH_SECRET` to a strong random value

### 2b) Initialize database (recommended)

Once `DATABASE_URL` is set:

```bash
npm --workspace apps/web run db:migrate
npm --workspace apps/web run db:seed
```

Seeded credentials (development only):

- `internal@equitybuilders.local` / `ChangeMeNow!` (role: Internal)
- `owner@equitybuilders.local` / `ChangeMeNow!` (role: Owner)

### 3) Run the app

```bash
npm run dev
```

Then open `http://localhost:3000`.

### 4) Quality checks

```bash
npm run lint
npm run build
npm test
```

## Modules (build order)

1. **Intelligence Center** (heart of platform)
2. **Forensic Property**
3. **Insurance Intelligence**
4. **Contractor Execution**
5. **Equity Outcome**

Each module must be:

- **Evidence-backed**
- **Explainable**
- **Auditable** (timeline, provenance, verification status)

## Engineering standards (non-negotiable)

- **Accuracy over aesthetics** (aesthetics still elite)
- **Explainability over black boxes**
- **Trust & verification** are first-class citizens (audit trails, evidence requirements)
- **Secure by default** (RBAC, least privilege, secret management)

## Deployment notes

- Works on Vercel and Render (Node runtime).
- Use managed Postgres (Neon) with SSL.
- Configure environment variables in the hosting provider.

