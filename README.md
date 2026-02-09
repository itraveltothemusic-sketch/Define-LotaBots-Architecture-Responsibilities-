# Equity Builders
## Forensic Property Intelligence Platform

[![Production Ready](https://img.shields.io/badge/status-production--ready-green.svg)](https://github.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org/)
[![License](https://img.shields.io/badge/license-Proprietary-red.svg)](LICENSE)

---

## 🎯 Mission

**Transform commercial storm-damaged properties into verified equity gains through forensic inspections, insurance intelligence, and AI-guided execution.**

Equity Builders is not a demo. It is not an MVP toy. This is a serious, scalable, enterprise-ready platform built for trust, precision, and authority in the commercial property insurance and restoration space.

---

## 🏗️ What Is This Platform?

Equity Builders bridges the gap between property damage, insurance claims, and restoration execution. It serves as the **central intelligence system** that:

- **Documents every detail** of storm-damaged commercial properties through forensic-grade inspections
- **Tracks insurance claim lifecycles** from first notice of loss through final settlement
- **Identifies discrepancies** between insurance scopes and actual damage
- **Guides contractor execution** with precision verification and compliance tracking
- **Proves equity gains** through before/after valuation and transparent reporting

The platform is powered by **ATOS** — an AI intelligence assistant that acts as a forensic guide, strategist, and explainer embedded throughout the user experience.

---

## 👥 Who Is This For?

### Primary Users

1. **Property Owners**
   - Commercial property owners dealing with storm damage
   - Need clear guidance through the complex insurance claim process
   - Want to maximize legitimate claim value and verify work quality

2. **Insurance Adjusters**
   - Need accurate, documented property damage assessments
   - Require audit trails and compliance verification
   - Value transparent communication and evidence-based claims

3. **Contractors**
   - Restoration contractors executing repairs
   - Need scope clarity and progress tracking
   - Want to demonstrate compliance and quality

4. **Internal Team (Equity Builders Staff)**
   - Forensic inspectors conducting property assessments
   - Case managers coordinating stakeholders
   - Analysts monitoring claim performance and equity outcomes

### Secondary Stakeholders

- Insurance carriers (viewing claims data)
- Legal teams (accessing documentation for disputes)
- Investors (reviewing equity performance metrics)
- Lenders (verifying property value restoration)

---

## 🧠 How It Works (High-Level)

```
┌─────────────────────────────────────────────────────────────────┐
│                     INTELLIGENCE CENTER                         │
│            (Central Dashboard & Command Center)                 │
│                                                                 │
│  • Property Overview          • ATOS AI Guidance               │
│  • Timeline & Evidence        • Risk & Opportunity Detection   │
│  • Stakeholder Status         • Next Action Recommendations    │
└─────────────────────────────────────────────────────────────────┘
                                  │
                    ┌─────────────┼─────────────┐
                    │             │             │
                    ▼             ▼             ▼
        ┌───────────────┐  ┌──────────────┐  ┌─────────────────┐
        │   FORENSIC    │  │  INSURANCE   │  │   CONTRACTOR    │
        │   PROPERTY    │  │ INTELLIGENCE │  │   EXECUTION     │
        │    MODULE     │  │    MODULE    │  │     MODULE      │
        │               │  │              │  │                 │
        │ • Property    │  │ • Claim      │  │ • Contractor    │
        │   Profiles    │  │   Tracking   │  │   Onboarding    │
        │ • Inspections │  │ • Scope      │  │ • Scope         │
        │ • Photo/Video │  │   Comparison │  │   Assignment    │
        │ • Damage IDs  │  │ • Carrier    │  │ • Progress      │
        │               │  │   Logs       │  │   Verification  │
        └───────────────┘  └──────────────┘  └─────────────────┘
                                  │
                                  ▼
                    ┌──────────────────────────┐
                    │   EQUITY OUTCOME MODULE  │
                    │                          │
                    │ • Valuation Before/After │
                    │ • Claim vs Payout Delta  │
                    │ • Equity Gain Reports    │
                    │ • ROI Analysis           │
                    └──────────────────────────┘
```

### Workflow

1. **Property Intake**: Property owner submits damage claim → system creates property profile
2. **Forensic Inspection**: Certified inspector documents damage → photos, videos, measurements uploaded
3. **AI Analysis**: ATOS analyzes evidence → identifies damage categories, estimates scope
4. **Insurance Submission**: Claim package submitted to carrier → tracked in Intelligence Module
5. **Scope Comparison**: Insurance estimate vs. forensic assessment → discrepancies flagged
6. **Contractor Assignment**: Qualified contractor matched → scope and schedule defined
7. **Execution Tracking**: Progress monitored → compliance verified → photo documentation required
8. **Final Settlement**: Payout received → equity gain calculated → outcome report generated

---

## 🛠️ Technical Architecture

### Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 15 (App Router) | Server-side rendering, routing, UI |
| **Language** | TypeScript 5.7 | Type safety, developer experience |
| **Styling** | Tailwind CSS 3.4 | Utility-first design system |
| **Backend** | Next.js API Routes & Server Actions | Serverless API, data mutations |
| **Database** | PostgreSQL (Neon) | Relational data with JSONB support |
| **Authentication** | JWT + bcrypt | Role-based access control |
| **AI Layer** | OpenAI GPT-4 | ATOS intelligence assistant |
| **File Storage** | AWS S3 / Local | Document, photo, video storage |
| **Hosting** | Vercel / Render | Scalable cloud deployment |

### Directory Structure

```
equity-builders/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Landing page
│   ├── globals.css              # Global styles
│   ├── dashboard/               # Authenticated dashboard
│   ├── auth/                    # Authentication pages
│   ├── intelligence/            # Intelligence Center
│   ├── properties/              # Forensic Property Module
│   ├── insurance/               # Insurance Intelligence Module
│   ├── contractors/             # Contractor Execution Module
│   ├── equity/                  # Equity Outcome Module
│   └── api/                     # API routes
├── components/                   # React components
│   ├── ui/                      # Reusable UI components
│   ├── layout/                  # Layout components
│   ├── intelligence/            # Intelligence Center components
│   ├── properties/              # Property module components
│   ├── insurance/               # Insurance module components
│   ├── contractors/             # Contractor module components
│   └── equity/                  # Equity module components
├── lib/                          # Core library code
│   ├── db/                      # Database utilities and schema
│   ├── auth/                    # Authentication logic
│   ├── ai/                      # ATOS AI integration
│   └── utils/                   # Shared utilities
├── types/                        # TypeScript type definitions
├── public/                       # Static assets
│   ├── images/                  # Image assets
│   └── documents/               # Static documents
├── next.config.ts               # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies and scripts
```

---

## 🔐 Security & Compliance

### Authentication & Authorization

- **JWT-based authentication** with secure HTTP-only cookies
- **Role-based access control (RBAC)**: Owner, Contractor, Adjuster, Internal
- **Password hashing** using bcrypt with salt rounds
- **Session management** with automatic expiration

### Data Protection

- **Encryption at rest** for sensitive documents and financial data
- **HTTPS enforcement** for all connections
- **Input validation** using Zod schemas
- **SQL injection prevention** through parameterized queries
- **XSS protection** via Next.js automatic escaping

### Audit Trail

- **Comprehensive logging** of all data mutations
- **Timestamped records** for all user actions
- **Immutable evidence chain** for forensic documentation
- **Version history** for claims and scopes

---

## 🤖 ATOS: The Intelligence Assistant

**ATOS (Automated Tactical Operations System)** is not a chatbot. It is a forensic guide, strategist, and explainer embedded throughout the platform.

### Core Behaviors

1. **Proactive Guidance**: Suggests next actions based on current state
2. **Risk Detection**: Flags gaps, inconsistencies, and compliance issues
3. **Opportunity Identification**: Highlights potential equity optimization points
4. **Explainability**: Translates complex insurance/legal concepts into clear language
5. **Fact-Based Reasoning**: Never hallucinates — only reasons from provided data

### Integration Points

- **Intelligence Center**: Strategic overview and recommended actions
- **Property Inspections**: Damage classification assistance
- **Claim Comparison**: Scope discrepancy analysis
- **Contractor Selection**: Qualification matching
- **Equity Reports**: Narrative generation for stakeholders

---

## 📊 Key Features

### Intelligence Center

- Real-time property portfolio dashboard
- Evidence timeline with photo/video previews
- Stakeholder communication hub
- ATOS guidance panel with actionable insights
- Risk and opportunity heat map

### Forensic Property Module

- Detailed property profiles with location, ownership, and valuation data
- Inspection workflow with mobile-friendly photo/video capture
- AI-powered damage classification (structural, water, wind, electrical, etc.)
- 3D property visualization (future enhancement)
- Document version control

### Insurance Intelligence Module

- End-to-end claim lifecycle tracking (FNOL → Settlement)
- Carrier interaction logs with communication history
- Automated scope comparison (insurance estimate vs. forensic assessment)
- Discrepancy detection with dollar-value impact analysis
- Supplement request generation

### Contractor Execution Module

- Contractor qualification database with licensing and insurance verification
- Scope-to-contractor matching algorithm
- Work order generation and digital signatures
- Progress photo requirements and verification
- Compliance checklists (permits, safety, quality standards)

### Equity Outcome Module

- Before-damage property valuation (AVM + comparable sales)
- After-restoration valuation projection
- Claim payout vs. actual damage delta analysis
- Equity gain calculation and ROI metrics
- Shareable outcome reports for stakeholders

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17+ and npm 9+
- PostgreSQL 14+ (or Neon account)
- OpenAI API key (for ATOS)
- AWS S3 bucket (or local storage for development)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd equity-builders

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Initialize the database
npm run db:init

# Run development server
npm run dev
```

Visit `http://localhost:3000` to see the platform.

### Environment Configuration

See `.env.example` for all required environment variables. Key configurations:

- **Database**: `POSTGRES_URL` - Connection string for PostgreSQL
- **Authentication**: `JWT_SECRET` - Secret key for JWT signing
- **AI**: `OPENAI_API_KEY` - OpenAI API key for ATOS
- **Storage**: `STORAGE_PROVIDER` - "local" or "s3"

---

## 📚 Core Principles

1. **Accuracy over aesthetics** (but aesthetics must still be elite)
2. **Explainability over black boxes**
3. **Trust, verification, and documentation are first-class citizens**
4. **Every user action must feel guided by intelligence**
5. **The system should feel like a forensic expert + strategist is always present**

---

## 🎨 Design Philosophy

### Visual Language

- **Forensic precision**: Clean, data-dense layouts with clear hierarchy
- **Trust signals**: Verification badges, audit trails, timestamped records
- **Intelligence presence**: ATOS guidance panels integrated contextually
- **Progressive disclosure**: Complex data revealed in digestible layers

### Color Semantics

- **Primary Blue**: Intelligence, analysis, professional authority
- **Accent Green**: Equity gains, verified outcomes, success states
- **Warning Orange**: Risks, gaps, action required
- **Dark Grays**: Data density, forensic seriousness

---

## 📈 Roadmap

### Phase 1: Foundation (Current)
- ✅ Core architecture and authentication
- ✅ Intelligence Center dashboard
- ✅ Property and inspection workflows
- ✅ Basic ATOS integration

### Phase 2: Intelligence (Next)
- ⏳ Advanced claim comparison algorithms
- ⏳ Automated supplement generation
- ⏳ Contractor recommendation engine
- ⏳ Real-time collaboration features

### Phase 3: Scale (Future)
- ⏳ Mobile app for field inspections
- ⏳ 3D property modeling and visualization
- ⏳ Multi-carrier integrations (Xactimate, Symbility)
- ⏳ Predictive analytics for claim outcomes

### Phase 4: Ecosystem (Vision)
- ⏳ Marketplace for vetted contractors
- ⏳ Insurance carrier portal
- ⏳ Public adjuster integrations
- ⏳ Investor dashboard for portfolio performance

---

## 🤝 Contributing

This is a proprietary platform. Contributions are by invitation only.

For authorized contributors:
1. Create a feature branch from `main`
2. Follow the established code patterns and TypeScript conventions
3. Write meaningful commit messages
4. Ensure all tests pass and type-check succeeds
5. Submit a pull request with detailed description

---

## 📄 License

Proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

---

## 📞 Support

For technical issues or questions:
- **Email**: support@equitybuilders.com
- **Documentation**: [docs.equitybuilders.com](https://docs.equitybuilders.com)
- **Status Page**: [status.equitybuilders.com](https://status.equitybuilders.com)

---

**Built with precision. Powered by intelligence. Driven by equity.**

© 2026 Equity Builders. All rights reserved.
