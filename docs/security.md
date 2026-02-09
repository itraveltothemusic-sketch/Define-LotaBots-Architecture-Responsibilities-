# Security & Trust Model — Equity Builders

Equity Builders is designed for high-stakes workflows (insurance/valuation). This document explains how the platform enforces **trust**, **verification**, and **access control**.

## Authentication

Current implementation:

- **NextAuth Credentials** (email + password) backed by Postgres users.
- Sessions use **JWT strategy** (no session table yet).

Planned evolution:

- Invite-based onboarding
- SSO (SAML/OIDC) for enterprise orgs
- Stronger device/session controls

## Authorization (RBAC)

Roles are explicit:

- `OWNER`
- `CONTRACTOR`
- `ADJUSTER`
- `INTERNAL`

Policy helpers live in `src/lib/security/roles.ts`.

Guiding rule: **deny by default**, allow by explicit policy.

## Organization isolation (multi-tenant boundary)

All domain entities (Property/Inspection/Evidence/Claim/Contractor/EquityReport) are scoped to an organization boundary via relations from `Organization` → `Property` → downstream tables.

Server actions and route handlers must always:

- Derive `orgId` from the authenticated session
- Query with `where: { orgId: session.user.orgId }` (or via relational constraint)

## Auditability

The `AuditEvent` table captures high-signal events:

- Auth events (signup/signin)
- Property creation
- Evidence additions
- Claim creation/updates

Each audit record includes actor type, user/org association, resource references, and metadata.

## ATOS “no hallucination” guarantee

ATOS is prohibited from inventing facts.

Current enforcement:

- Guidance generation is deterministic and based on platform stats only (`src/lib/atos/engine.ts`).

Future enforcement (when LLM is added):

- Strict “facts store” input construction
- Evidence citations attached to claims
- Persisted prompts/outputs with references for review

## Transport and secrets

- Secrets are injected via environment variables (`.env`).
- Never commit real credentials; use `.env.example` and Cloud Agent secrets for CI/deploy.

