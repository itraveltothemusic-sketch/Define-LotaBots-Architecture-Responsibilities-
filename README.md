# Equity Builders — Forensic Property Intelligence Platform

> Transforming commercial storm-damaged properties into verified equity gains through forensic inspections, insurance intelligence, and AI-guided execution.

---

## What Is This?

Equity Builders is a **production-grade forensic property intelligence platform** designed for commercial property stakeholders who need to:

- **Document storm damage** with forensic precision
- **Navigate insurance claims** with data-driven intelligence
- **Execute repairs** through verified contractor networks
- **Prove equity gains** through before/after analysis and auditable evidence chains

This is not a CRM. This is not a project management tool. This is a **forensic intelligence system** that treats every property as a case, every document as evidence, and every decision as an auditable action.

---

## Who Is This For?

| Role | What They Get |
|------|--------------|
| **Property Owners** | Full visibility into damage, claims, repairs, and equity recovery |
| **Contractors** | Clear scopes, compliance tracking, and progress verification |
| **Insurance Adjusters** | Transparent documentation, scope comparisons, and discrepancy detection |
| **Internal Teams** | Central intelligence dashboard, AI-guided workflows, and outcome analytics |

---

## How It Works

### 1. Intelligence Center (The Heart)
A central command dashboard that surfaces what matters: active properties, claim statuses, inspection timelines, and AI-recommended next actions. Every data point links back to verifiable evidence.

### 2. Forensic Property Module
Properties are treated as forensic cases. Every inspection, photo, video, and document is timestamped, categorized, and linked to damage classifications. Nothing is informal — everything is evidence.

### 3. Insurance Intelligence Module
Claims are tracked through their full lifecycle. Carrier interactions are logged. Scope comparisons detect discrepancies between what was claimed and what was approved. The system surfaces gaps before they become losses.

### 4. Contractor Execution Module
Contractors are onboarded with verification. Work scopes are assigned with precision. Progress is documented and verified against the original scope. Compliance is tracked, not assumed.

### 5. Equity Outcome Module
The endgame: proving that the work created value. Before/after valuations are calculated. Claim-vs-payout deltas are tracked. Equity gain narratives are generated with full evidence backing.

### ATOS — The Intelligence Layer
ATOS (Adaptive Tactical Operations System) is embedded throughout the platform. It is NOT a chatbot. It is a forensic guide that:
- Proactively surfaces risks, gaps, and opportunities
- Explains *why* something matters at every step
- Translates insurance complexity into actionable confidence
- Reasons only from provided data — never halluccinates

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 (App Router), TypeScript, Tailwind CSS |
| Backend | Node.js with API Routes / Server Actions |
| Database | PostgreSQL (Neon-compatible) |
| Auth | Role-based (Owner, Contractor, Adjuster, Internal) |
| AI Layer | ATOS — embedded contextual intelligence |
| Hosting | Vercel / Render compatible |

---

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes
│   │   ├── login/
│   │   └── register/
│   ├── (platform)/               # Authenticated platform routes
│   │   ├── dashboard/            # Intelligence Center
│   │   ├── intelligence/         # Deep intelligence views
│   │   ├── properties/           # Forensic Property Module
│   │   ├── insurance/            # Insurance Intelligence Module
│   │   ├── contractors/          # Contractor Execution Module
│   │   ├── equity/               # Equity Outcome Module
│   │   └── settings/             # Platform settings
│   └── api/                      # API routes
│       ├── auth/
│       ├── properties/
│       ├── insurance/
│       ├── contractors/
│       ├── equity/
│       └── atos/
├── components/
│   ├── ui/                       # Design system primitives
│   ├── layout/                   # Shell, navigation, headers
│   ├── atos/                     # ATOS intelligence components
│   ├── dashboard/                # Dashboard-specific components
│   ├── properties/               # Property module components
│   ├── insurance/                # Insurance module components
│   ├── contractors/              # Contractor module components
│   └── equity/                   # Equity module components
├── lib/                          # Utilities, constants, helpers
├── types/                        # TypeScript type definitions
├── stores/                       # Zustand state management
└── hooks/                        # Custom React hooks
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

---

## Design Principles

1. **Accuracy over aesthetics** — but aesthetics are still elite
2. **Explainability over black boxes** — every number has a source
3. **Trust, verification, and documentation are first-class citizens**
4. **Every user action feels guided by intelligence**
5. **The system feels like a forensic expert + strategist is always present**

---

## License

Proprietary. All rights reserved.
