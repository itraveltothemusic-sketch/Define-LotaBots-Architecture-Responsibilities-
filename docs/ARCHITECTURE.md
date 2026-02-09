# Architecture — Equity Builders (early foundation)

This document captures the initial structure and design intent for a production-grade build.

## Non-negotiables

- **Evidence-first**: artifacts and provenance are first-class entities.
- **Explainability**: guidance must be grounded in persisted facts; missing data must be explicit.
- **Trust**: verification state and attribution exist everywhere.
- **RBAC**: role-based access is enforced end-to-end.

## Repo layout

- `apps/web`: Next.js (App Router) application
- `docs`: architecture notes and decision records

## Application layout (`apps/web/src`)

- `app/`: routes, layouts, route handlers
- `components/`: shared UI primitives + shell components
- `modules/`: domain modules (Intelligence Center, Forensic Property, etc.)
- `server/`: database, auth, security utilities

## ATOS design (phase 1)

ATOS is implemented as a deterministic guidance engine:

- Input: structured module snapshot(s)
- Output: guidance items that include **grounded facts** and recommended actions

This creates a verifiable baseline. An LLM layer may later augment wording and prioritization, but
must never invent facts beyond grounded facts.

