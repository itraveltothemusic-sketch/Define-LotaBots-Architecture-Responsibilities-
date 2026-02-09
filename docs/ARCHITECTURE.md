# Architecture (high level)

Equity Builders is designed as an enterprise-grade, evidence-first system with strict separation between:

- **UI composition** (layout, navigation, state)
- **Domain modules** (intelligence, forensic property, insurance, contractor execution, equity outcomes)
- **Trusted computation** (validation, provenance, deterministic guidance rules)
- **Persistence** (Postgres, migrations, audited events)

## App structure (Next.js App Router)

- Route segments under `apps/web/src/app/` map directly to product areas.
- Domain logic lives under `apps/web/src/server/` and `apps/web/src/features/`.
- Shared UI components live under `apps/web/src/components/`.

## Trust model (first-class)

Every conclusion must be traceable to:

- **Observed evidence** (photos, documents, measurements, timestamps)
- **Recorded events** (who did what, when)
- **Explicit assumptions** (captured as structured data)

ATOS produces guidance with:

- **Facts used** (citations to the inputs it relied on)
- **Gaps detected** (missing measurements, missing documentation)
- **Next best actions** (concrete steps, not vague chat)

