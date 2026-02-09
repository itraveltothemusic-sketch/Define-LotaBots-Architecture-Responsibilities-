# Equity Builders — Forensic Property Intelligence Platform

Equity Builders transforms **commercial storm-damaged properties** into **verified equity gains** through forensic inspections, insurance intelligence, and AI-guided execution.

This platform is engineered for **trust**, **precision**, and **auditability**—built to be credible to **engineers**, **insurers**, and **investors**.

## Who it’s for

- **Owners**: Understand damage, quantify opportunity, and drive claim outcomes with evidence.
- **Contractors**: Execute scopes with verification, compliance, and clear accountability.
- **Adjusters**: Review a clean, defensible evidence trail and resolve discrepancies faster.
- **Internal**: Operate a repeatable, forensic workflow with measurable outcomes.

## How it works (high level)

1. **Forensic Property Module**: Capture inspections + evidence (photo/video/docs) with a strict chain-of-custody mindset.
2. **Insurance Intelligence Module**: Track claim lifecycle, carrier interactions, and scope deltas.
3. **Contractor Execution Module**: Assign scopes, verify progress, and enforce compliance.
4. **Equity Outcome Module**: Calculate before/after valuation narrative and generate defensible reports.
5. **ATOS (Central Intelligence Assistant)**: A forensic guide and strategist embedded everywhere.
   - Explains *why each step matters*
   - Surfaces gaps/risks/opportunities
   - Never invents facts—reasons only from provided evidence

## Tech stack (locked)

- **Frontend**: Next.js (App Router), TypeScript, Tailwind
- **Backend**: Node.js via Next.js route handlers + server actions
- **Database**: Postgres (assume Neon)
- **Auth**: Role-based (Owner, Contractor, Adjuster, Internal)
- **Hosting**: Vercel/Render-compatible

## Repo structure

```text
apps/
  web/                 # Next.js application (App Router)
docs/                  # Architecture, security, operating guides
packages/              # Future shared packages (db, contracts, UI, etc.)
```

## Run locally

This repo is scaffolded to **run immediately** in a safe “demo mode” until Postgres is wired.

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Documentation

- `docs/`: platform architecture and operating principles
- `docs/Define-LotaBots-Architecture-Responsibilities.md`: historical system automation notes (preserved)

