# Equity Builders — Forensic Property Intelligence Platform

> Transform storm-damaged commercial properties into verified equity gains through forensic inspections, insurance intelligence, and AI-guided execution.

---

## What Is This?

Equity Builders is a production-grade intelligence platform built for the commercial property restoration industry. It connects the entire pipeline from storm damage discovery to verified equity outcomes — forensic inspections, insurance claim management, contractor execution, and financial verification — in a single system guided by AI intelligence.

The platform is built on the principle that **every dollar of property value lost to storm damage can be recovered, documented, and turned into equity** — if the process is forensic, strategic, and transparent.

## Who Is It For?

| Role | How They Use It |
|------|----------------|
| **Property Owners** | Track their properties, view inspection findings, monitor claim progress, and verify equity gains |
| **Internal Team** | Manage the full pipeline — from property intake through equity verification — with AI-powered intelligence |
| **Insurance Adjusters** | Review forensic documentation, compare scopes, and process claims with complete evidence trails |
| **Contractors** | View assignments, report progress, maintain compliance, and verify completed work |

## How It Works

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Property    │ ──► │   Forensic   │ ──► │  Insurance   │ ──► │  Contractor  │ ──► │    Equity    │
│   Intake      │     │  Inspection  │     │    Claim     │     │  Execution   │     │ Verification │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
                                    ▲                                    ▲
                                    │         ATOS Intelligence          │
                                    └───── (guides every step) ─────────┘
```

### The Five Modules

1. **Intelligence Center** — The command hub. Real-time insights, risk analysis, and ATOS intelligence briefings across the entire portfolio.

2. **Forensic Property Module** — Property profiles, inspection records, photo/video/document management, and AI-assisted damage classification.

3. **Insurance Intelligence Module** — Claim lifecycle tracking, carrier interaction logs, scope comparison (forensic vs. carrier), and discrepancy detection.

4. **Contractor Execution Module** — Contractor onboarding, scope assignments, progress tracking with photo verification, and compliance management.

5. **Equity Outcome Module** — Before/after property valuations, claim-vs-payout deltas, ROI analysis, and verified equity gain narratives.

### ATOS — The Intelligence Layer

ATOS (Adaptive Tactical Operations System) is not a chatbot. It's a forensic guide embedded throughout the platform that:

- **Proactively identifies risks** — approaching deadlines, scope discrepancies, compliance gaps
- **Surfaces opportunities** — underpaid claim items, equity verification readiness
- **Explains context** — "why this matters" at every step
- **Translates complexity** — insurance jargon → clear, actionable guidance
- **Never fabricates** — only reasons from provided data

## Technology Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | Next.js 16 (App Router) | Server components, streaming, optimal performance |
| Language | TypeScript | Type safety across the full stack |
| Styling | Tailwind CSS 4 | Utility-first, consistent design system |
| Database | PostgreSQL (Neon) | Relational integrity for financial and legal data |
| ORM | Prisma | Type-safe database access with migrations |
| Auth | JWT (jose) + Cookies | Secure, role-based access control |
| AI | OpenAI-compatible API | Configurable LLM for ATOS intelligence |
| Icons | Lucide React | Consistent, professional iconography |

## Project Structure

```
equity-builders/
├── prisma/
│   └── schema.prisma              # Complete database schema (18 models)
├── public/
│   ├── images/
│   └── icons/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/             # Authentication
│   │   │   └── register/          # Registration with role selection
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx         # Dashboard shell (sidebar + header)
│   │   │   ├── dashboard/         # Command Center
│   │   │   ├── intelligence/      # Intelligence Center + ATOS
│   │   │   ├── properties/        # Property list + detail views
│   │   │   ├── insurance/         # Claims list + detail + scope comparison
│   │   │   ├── contractors/       # Contractor network + compliance
│   │   │   ├── equity/            # Equity outcomes + ROI analysis
│   │   │   └── settings/          # Platform configuration
│   │   ├── api/
│   │   │   ├── auth/              # Authentication endpoints
│   │   │   ├── properties/        # Property CRUD
│   │   │   ├── inspections/       # Inspection management
│   │   │   ├── claims/            # Insurance claim operations
│   │   │   ├── contractors/       # Contractor management
│   │   │   ├── equity/            # Equity outcome tracking
│   │   │   └── atos/              # ATOS AI interface
│   │   ├── layout.tsx             # Root layout
│   │   └── page.tsx               # Landing page
│   ├── components/
│   │   ├── ui/                    # Design system primitives
│   │   ├── layout/                # Sidebar, Header
│   │   ├── atos/                  # ATOS panel component
│   │   ├── dashboard/             # Dashboard-specific components
│   │   ├── properties/            # Property module components
│   │   ├── insurance/             # Insurance module components
│   │   ├── contractors/           # Contractor module components
│   │   └── equity/                # Equity module components
│   ├── lib/
│   │   ├── ai/                    # ATOS intelligence layer
│   │   ├── auth/                  # JWT auth + RBAC
│   │   ├── db/                    # Prisma client singleton
│   │   └── utils/                 # Formatting, helpers
│   ├── types/                     # TypeScript type definitions
│   ├── hooks/                     # Custom React hooks
│   └── styles/
│       └── globals.css            # Tailwind + custom design tokens
├── .env.example                   # Environment configuration template
├── next.config.ts
├── tsconfig.json
├── postcss.config.mjs
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (or Neon account)
- OpenAI API key (optional — ATOS works in fallback mode without it)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd equity-builders

# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env
# Edit .env with your database URL and API keys

# Generate Prisma client
npx prisma generate

# Push schema to database (development)
npx prisma db push

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`.

### Demo Mode

The platform includes a demo mode that works without a database connection:

1. Click "Launch Demo Dashboard" on the login page
2. Or use these credentials:
   - **Internal**: `demo@equitybuilders.com` / `demo123`
   - **Owner**: `owner@equitybuilders.com` / `demo123`
   - **Contractor**: `contractor@equitybuilders.com` / `demo123`

## Architecture Decisions

### Why Next.js App Router?
Server components reduce client-side JavaScript. Server actions provide type-safe mutations. The app router's layout system perfectly models our dashboard hierarchy.

### Why PostgreSQL over NoSQL?
Financial data, insurance claims, and property records demand relational integrity. Joins across properties, claims, inspections, and contractors are fundamental operations. PostgreSQL's JSONB fields give us document flexibility where needed.

### Why JWT over Session-Based Auth?
Stateless auth simplifies deployment across edge and serverless environments. The JWT contains role information for instant access control decisions without database lookups.

### Why Not a Component Library (shadcn, MUI)?
Custom components give us full control over the design language. The forensic/analytical aesthetic requires specific visual treatments (glass panels, muted backgrounds, precision typography) that are easier to achieve with purpose-built components.

### Why ATOS Uses Structured Prompts?
Context-specific system prompts ensure ATOS gives relevant guidance for each module. A property overview context produces different intelligence than a claim strategy context. This architecture prevents the "generic chatbot" problem.

## Database Schema

The Prisma schema includes 18 models covering:

- **Users** — Multi-role with RBAC (Owner, Contractor, Adjuster, Internal)
- **Properties** — Full commercial property profiles with geo data
- **Inspections** — Forensic inspection records with damage classification
- **Damage Items** — Line-item damage documentation with cost estimates
- **Media** — Photos, videos, documents with metadata
- **Insurance Claims** — Full claim lifecycle with financial tracking
- **Carrier Interactions** — Detailed interaction log for audit trails
- **Scope Comparisons** — Line-by-line forensic vs. carrier comparison
- **Contractors** — Profiles with compliance and performance data
- **Assignments** — Work orders with progress tracking
- **Compliance Checks** — Insurance, licensing, safety verification
- **Equity Outcomes** — Before/after valuations with ROI analysis
- **ATOS Intelligence** — Conversation history and proactive insights

## Role-Based Access Control

| Permission | Owner | Contractor | Adjuster | Internal |
|-----------|-------|------------|----------|----------|
| View own properties | ✅ | — | — | ✅ |
| View all properties | — | — | ✅ | ✅ |
| Create inspections | — | — | — | ✅ |
| View inspections | ✅ | ✅ | ✅ | ✅ |
| File claims | — | — | — | ✅ |
| View claims | ✅ | — | ✅ | ✅ |
| Manage contractors | — | — | — | ✅ |
| Update progress | — | ✅ | — | ✅ |
| View equity outcomes | ✅ | — | — | ✅ |
| ATOS access | ✅ | ✅ | ✅ | ✅ |

## Deployment

The application is designed for deployment on:

- **Vercel** — Optimal for Next.js with edge functions
- **Render** — Full-stack deployment with background workers
- **Docker** — Self-hosted with the included configuration

### Environment Variables

See `.env.example` for the complete list. Critical variables:

- `DATABASE_URL` — PostgreSQL connection string
- `JWT_SECRET` — Minimum 32 character secret for token signing
- `ATOS_API_KEY` — OpenAI API key for ATOS intelligence
- `NEXT_PUBLIC_APP_URL` — Public URL for the application

## Contributing

This is an enterprise platform. All contributions must:

1. Include TypeScript types for all new code
2. Follow the existing component patterns
3. Include explanatory comments for business logic
4. Maintain the forensic/analytical design language
5. Never introduce dependencies without justification

## License

Proprietary. All rights reserved.

---

*Built with precision. Guided by intelligence. Verified by evidence.*
