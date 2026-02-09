# Architecture — Equity Builders

This document explains the **system architecture**, **module boundaries**, and **design decisions** for Equity Builders.

## Product posture (non-negotiable)

- **Trust is a feature**: evidence, provenance, and auditability are first-class.
- **Explainability over black boxes**: ATOS guidance must be inspectable and grounded in platform data.
- **Enterprise boundaries**: organization isolation, explicit RBAC, and predictable workflows.

## Runtime architecture (high level)

- **Next.js App Router** provides:
  - Server Components for secure data fetching (Postgres)
  - Route Handlers for APIs (`src/app/api/*`)
  - Server Actions for form submissions (write paths)
- **Postgres (Neon)** is the primary system of record.
- **ATOS** is a guidance layer embedded in the authenticated shell and fed by verified platform facts.

## Route groups

- `src/app/(marketing)` — public-facing landing
- `src/app/(auth)` — sign-in / sign-up
- `src/app/(app)` — authenticated product surfaces

Route groups keep URL paths clean while enforcing distinct layouts and security constraints.

## Data model (Prisma)

Core tables in `prisma/schema.prisma`:

- **Organization / Membership / User**
  - Multi-tenant boundary via `orgId`
  - RBAC enforced via `Membership.role` (OWNER / CONTRACTOR / ADJUSTER / INTERNAL)
- **Property** (root of forensic truth)
  - `PropertyStatus` tracks lifecycle (intake → equity)
- **Inspection / Evidence**
  - Inspections anchor “what/when/who”
  - Evidence items capture artifacts; include integrity/provenance fields (e.g. `sha256`, `sourceUrl`, `storageKey`)
- **Claim / CarrierInteraction**
  - Claim lifecycle and carrier interaction truth
- **Contractor / ScopeAssignment**
  - Execution layer with verifiable assignments
- **EquityReport**
  - Outcome artifact per property
- **AuditEvent**
  - Non-repudiation and defensibility across key actions

## ATOS design (today)

ATOS guidance is **deterministic and data-bound** (see `src/lib/atos/engine.ts`):

- Inputs: verified platform stats (counts, coverage gaps, lifecycle states)
- Outputs: actions + risks with explicit rationale (“why this matters”)
- Guarantee: **no fabricated facts** (guidance only references inputs)

Later evolution:

- Add LLM reasoning *on top of* verified facts and citations.
- Persist guidance snapshots and references (inputs/outputs) for auditability.

## Module delivery order (implementation plan)

1. **Intelligence Center**
2. **Forensic Property**
3. **Insurance Intelligence**
4. **Contractor Execution**
5. **Equity Outcome**

Each module is implemented with:

- A clear UI surface
- Schema additions (when required)
- RBAC policy rules
- Audit events for high-risk actions
- ATOS guidance hooks (data-bound)

