# Equity Builders — Forensic Property Intelligence Platform

> Transform storm-damaged commercial properties into verified equity gains through forensic inspections, insurance intelligence, and AI-guided execution.

## What This Platform Is

Equity Builders is a production-grade intelligence platform designed for the commercial property restoration industry. It provides an end-to-end system for managing the lifecycle of storm-damaged properties — from initial forensic inspection through insurance claim recovery to verified equity outcomes.

Every decision, document, and data point flows through a unified intelligence layer powered by **ATOS** (Adaptive Tactical Operations System), our forensic AI assistant that proactively guides users with evidence-based recommendations.

## Who It Is For

| Role | What They Get |
|------|--------------|
| **Property Owners** | Full visibility into their property's restoration journey, claim status, and equity growth |
| **Internal Team** | Central command for managing the entire portfolio of storm-damaged properties |
| **Insurance Adjusters** | Transparent documentation trail and verified scope comparison |
| **Contractors** | Clear scope assignments, compliance checklists, and progress tracking |

## How It Works

### 1. Forensic Inspection
Certified inspectors document every instance of storm damage with photographic evidence, severity classification, and detailed repair specifications. All evidence is timestamped and categorized.

### 2. Insurance Intelligence
The platform tracks the full insurance claim lifecycle — from filing through settlement. ATOS analyzes scope estimates, identifies discrepancies between owner and carrier positions, and surfaces opportunities (like code-required upgrades) that maximize claim recovery.

### 3. Verified Execution
Vetted contractors execute repairs under compliance monitoring. Every milestone requires verification — permits, material specs, mid-point inspections, and final compliance checks are tracked systematically.

### 4. Equity Verification
Before-and-after property valuations document the equity gain. The platform generates verified narratives that quantify how storm damage was transformed into measurable property value increase.

## Core Modules

- **Intelligence Center** — Central dashboard with portfolio metrics, property overview, and ATOS insights
- **Forensic Property Module** — Property profiles, inspection records, and evidence management
- **Insurance Intelligence** — Claim lifecycle, carrier interactions, and scope discrepancy analysis
- **Contractor Execution** — Onboarding, scope assignments, progress verification, and compliance
- **Equity Outcomes** — Before/after valuations, gain calculations, and verified narratives

## ATOS — Forensic AI Intelligence

ATOS is embedded throughout the platform. It is **not** a chatbot — it is a forensic guide and strategist that:

- **Proactively** identifies risks, documentation gaps, and missed opportunities
- **Explains** why each finding matters in plain language
- **Recommends** specific, actionable next steps with referenced evidence
- **Never speculates** — all analysis is grounded in provided data
- **Monitors** claim deadlines, carrier behavior patterns, and compliance requirements

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 (App Router), TypeScript, Tailwind CSS v4 |
| Backend | Next.js API Routes / Server Actions |
| Database | PostgreSQL (Neon) |
| Auth | Role-based (Owner, Contractor, Adjuster, Internal) |
| AI Layer | ATOS — contextual intelligence embedded in every module |
| Hosting | Vercel / Render compatible |

## Project Structure

```
equity-builders/
├── src/
│   ├── app/
│   │   ├── (auth)/              # Login, register pages
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (platform)/          # Authenticated platform pages
│   │   │   ├── dashboard/       # Intelligence Center
│   │   │   ├── properties/      # Property profiles + [id] detail
│   │   │   ├── insurance/       # Claims management + [id] detail
│   │   │   ├── contractors/     # Contractor execution + [id] detail
│   │   │   ├── equity/          # Equity outcomes + [id] detail
│   │   │   └── settings/        # Platform settings
│   │   ├── api/                 # API routes
│   │   │   ├── auth/
│   │   │   ├── properties/
│   │   │   ├── insurance/
│   │   │   ├── contractors/
│   │   │   ├── equity/
│   │   │   └── atos/            # ATOS intelligence endpoint
│   │   ├── layout.tsx           # Root layout
│   │   └── page.tsx             # Landing page
│   ├── components/
│   │   ├── ui/                  # Reusable UI components
│   │   ├── layout/              # Sidebar, Topbar
│   │   ├── atos/                # ATOS intelligence panel
│   │   ├── dashboard/           # Dashboard-specific components
│   │   ├── properties/          # Property-specific components
│   │   ├── insurance/           # Insurance-specific components
│   │   ├── contractors/         # Contractor-specific components
│   │   └── equity/              # Equity-specific components
│   ├── lib/
│   │   ├── utils.ts             # Utility functions
│   │   └── mock-data.ts         # Development mock data
│   ├── types/
│   │   └── index.ts             # TypeScript type definitions
│   ├── hooks/                   # Custom React hooks
│   └── styles/
│       └── globals.css          # Global styles + design system
├── public/
│   └── images/
├── docs/                        # Documentation
├── next.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.mjs
└── package.json
```

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

The development server runs at [http://localhost:3000](http://localhost:3000).

## Design Philosophy

1. **Accuracy over aesthetics** — but aesthetics must still be elite
2. **Explainability over black boxes** — every AI recommendation is transparent
3. **Trust, verification, and documentation are first-class citizens**
4. **Every user action feels guided by intelligence**
5. **The system feels like a forensic expert + strategist is always present**

## Environment Variables

```env
# Database (Neon Postgres)
DATABASE_URL=postgresql://...

# AI Provider (for ATOS)
AI_API_KEY=...
AI_MODEL=...

# Auth
AUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
```

## License

Proprietary — Equity Builders Platform. All rights reserved.
