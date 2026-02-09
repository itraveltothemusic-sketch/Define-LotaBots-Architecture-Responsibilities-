# Equity Builders — Forensic Property Intelligence Platform

## What This Platform Is

Equity Builders is a production-grade, enterprise intelligence platform that transforms commercial storm-damaged properties into verified equity gains through forensic inspections, insurance intelligence, and AI-guided execution.

This is not a demo. This is not a toy MVP. This is a serious, scalable system built for trust, precision, and authority in the commercial property restoration and insurance claims space.

## The Problem We Solve

When commercial properties are damaged by storms, owners face:
- **Information asymmetry** with insurance carriers
- **Underpaid claims** due to incomplete documentation
- **Contractor fraud or poor execution**
- **Lost equity** from suboptimal restoration decisions
- **Opacity** in complex multi-party processes

Traditional approaches rely on fragmented tools, manual processes, and hope. Equity Builders brings forensic rigor, intelligence, and systematic execution to every phase.

## Who This Is For

### Primary Users
- **Property Owners**: Commercial real estate owners seeking to maximize legitimate insurance recovery and property value restoration
- **Contractors**: Qualified contractors who want structured scopes, clear expectations, and verification systems
- **Adjusters**: Insurance adjusters who value documentation, transparency, and efficient claim resolution
- **Internal Team**: Platform operators who manage workflows, verify evidence, and ensure quality

### Use Case Flow
1. Property owner uploads property and damage information
2. ATOS (AI assistant) guides forensic documentation process
3. Platform generates comprehensive evidence packages
4. Insurance intelligence tracks claim lifecycle and identifies discrepancies
5. Qualified contractors execute verified scopes with real-time oversight
6. Equity outcomes are measured, documented, and reportable

## How It Works (High-Level Architecture)

### Core Philosophy
- **Accuracy over aesthetics** (though aesthetics are elite)
- **Explainability over black boxes** — every recommendation has reasoning
- **Trust, verification, and documentation** are first-class citizens
- **Intelligence-guided execution** — users never feel alone in complex decisions

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    INTELLIGENCE CENTER                       │
│  (Central dashboard, property overview, ATOS guidance)       │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐    ┌─────────────────┐   ┌──────────────────┐
│   FORENSIC    │    │   INSURANCE     │   │   CONTRACTOR     │
│   PROPERTY    │◄──►│  INTELLIGENCE   │◄─►│   EXECUTION      │
│    MODULE     │    │     MODULE      │   │     MODULE       │
└───────────────┘    └─────────────────┘   └──────────────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              ▼
                   ┌────────────────────┐
                   │  EQUITY OUTCOME    │
                   │      MODULE        │
                   └────────────────────┘
```

### Technology Stack

**Frontend**
- Next.js 14 (App Router) — Modern React framework with server components
- TypeScript — Type safety throughout
- Tailwind CSS — Utility-first styling with custom forensic design system

**Backend**
- Next.js API Routes & Server Actions — Serverless-ready backend
- Node.js runtime
- Role-based authentication & authorization

**Database**
- PostgreSQL (Neon) — Reliable, scalable relational database
- Drizzle ORM — Type-safe database access

**AI Layer**
- ATOS (AI Tactical Operations System) — Central intelligence assistant
- Context-aware guidance embedded throughout the platform
- Reasoning from evidence, never hallucinating facts

**Hosting**
- Vercel/Render compatible
- Edge-ready with CDN optimization
- Production-grade security headers

## Key Modules

### 1. Intelligence Center
The command center for all property operations.
- Unified dashboard showing property portfolio
- Real-time status of inspections, claims, and work
- Evidence timeline with verification status
- ATOS guidance panel with contextual intelligence

### 2. Forensic Property Module
Rigorous documentation and damage assessment.
- Property profiles with detailed specifications
- Inspection record management
- Multi-format evidence ingestion (photos, videos, documents)
- Damage classification with industry-standard taxonomies
- Before/during/after comparison tools

### 3. Insurance Intelligence Module
Track claims with carrier-grade precision.
- Complete claim lifecycle visibility
- Carrier interaction logging
- Scope comparison (contractor vs adjuster vs actual)
- Discrepancy detection with automatic flagging
- Payment tracking and variance analysis

### 4. Contractor Execution Module
Verified work from qualified contractors.
- Contractor vetting and onboarding
- Scope assignment with detailed work orders
- Progress verification with photographic evidence
- Compliance tracking (permits, codes, safety)
- Payment milestone management

### 5. Equity Outcome Module
Measure and report value creation.
- Before/after property valuation
- Claim amount vs actual payout analysis
- Equity gain calculation with documentation
- Exportable reports for stakeholders
- Portfolio-level analytics

## ATOS: The Intelligence Assistant

ATOS is not a chatbot. ATOS is a **forensic guide, strategist, and explainer**.

### ATOS Behavior Principles
- **Proactive guidance**: Anticipates next steps and potential issues
- **Contextual intelligence**: Understands where user is in the process
- **Risk surfacing**: Identifies gaps, inconsistencies, and opportunities
- **Confidence building**: Translates complexity into clarity
- **Evidence-based**: Only reasons from provided data, never fabricates

### ATOS Integration Points
- Property damage assessment guidance
- Documentation completeness checks
- Claim strategy recommendations
- Contractor selection assistance
- Risk and opportunity identification
- Report generation and narrative building

## Getting Started

### Prerequisites
- Node.js 18+ and npm 9+
- PostgreSQL database (local or Neon)
- OpenAI API key (for ATOS)

### Installation

```bash
# Clone the repository
git clone [repository-url]
cd equity-builders

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your actual values

# Run database migrations
npm run db:push

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

### First-Time Setup
1. The database will be initialized with seed data
2. Default admin account: See `docs/SETUP.md`
3. Configure ATOS with your OpenAI API key
4. Set up SMTP for email notifications

## Project Structure

```
equity-builders/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── (auth)/            # Authentication routes
│   │   ├── (dashboard)/       # Authenticated dashboard routes
│   │   ├── api/               # API routes
│   │   └── layout.tsx         # Root layout
│   ├── components/            # Shared UI components
│   │   ├── ui/               # Base UI components
│   │   ├── atos/             # ATOS assistant components
│   │   └── layout/           # Layout components
│   ├── modules/              # Feature modules
│   │   ├── intelligence/     # Intelligence Center
│   │   ├── forensic/         # Forensic Property
│   │   ├── insurance/        # Insurance Intelligence
│   │   ├── contractor/       # Contractor Execution
│   │   └── equity/           # Equity Outcomes
│   ├── lib/                  # Utility libraries
│   │   ├── db/              # Database connection & schema
│   │   ├── auth/            # Authentication logic
│   │   ├── atos/            # ATOS AI engine
│   │   └── utils/           # Helper functions
│   └── types/               # TypeScript type definitions
├── public/                   # Static assets
├── docs/                    # Documentation
└── drizzle/                # Database migrations
```

## Development Principles

### Code Quality
- **TypeScript strict mode** — No implicit any, proper typing throughout
- **Component composition** — Reusable, testable, isolated components
- **Server-first** — Leverage server components and actions for security and performance
- **Error boundaries** — Graceful failure handling at every level

### Security
- **Role-based access control** — Strict permissions on all data operations
- **Input validation** — Zod schemas for all user inputs
- **SQL injection prevention** — Parameterized queries via Drizzle ORM
- **XSS protection** — Sanitized outputs, CSP headers
- **Authentication** — JWT with secure httpOnly cookies

### Performance
- **Edge optimization** — Static generation where possible
- **Image optimization** — Next.js Image component with Sharp
- **Database indexing** — Proper indexes on query patterns
- **Lazy loading** — Code splitting and dynamic imports
- **Caching strategy** — Intelligent cache invalidation

## Deployment

### Environment Setup
1. Configure production database (Neon recommended)
2. Set all environment variables in hosting platform
3. Configure domain and SSL
4. Set up monitoring and error tracking

### Deployment Command
```bash
npm run build
npm run start
```

### Recommended Hosting
- **Vercel**: Optimized for Next.js, edge functions, automatic scaling
- **Render**: Full-stack hosting with database, easy setup

## Documentation

- `/docs/ARCHITECTURE.md` — Detailed technical architecture
- `/docs/API.md` — API endpoint documentation
- `/docs/DATABASE.md` — Database schema and relationships
- `/docs/ATOS.md` — ATOS behavior and prompt engineering
- `/docs/DEPLOYMENT.md` — Production deployment guide

## Support & Contribution

This is a production system. Changes should be:
- Thoroughly tested
- Documented
- Reviewed for security implications
- Aligned with forensic accuracy principles

## License

Proprietary and confidential.

---

**Built with precision. Operated with trust. Designed for equity.**
