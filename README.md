# Equity Builders — Forensic Property Intelligence Platform

**Transform storm-damaged properties into verified equity gains through forensic inspections, insurance intelligence, and AI-guided execution.**

---

## 🎯 Mission

Equity Builders is an enterprise-grade platform that bridges the gap between property damage, insurance claims, and strategic rehabilitation. We provide property owners, contractors, adjusters, and internal teams with a unified system of truth—combining forensic property analysis, insurance intelligence, and AI-guided decision-making to maximize equity outcomes.

This is not a demo. This is not an MVP. This is a production-ready, scalable platform built for trust, precision, and authority.

---

## 👥 Who This Is For

### Property Owners
Gain clarity, control, and confidence throughout the storm damage recovery process. Track every inspection, claim interaction, and contractor milestone in one place.

### Contractors
Receive verified scopes, track progress with photo/video evidence, and maintain compliance with insurance requirements—no surprises, no disputes.

### Insurance Adjusters
Access centralized property intelligence, inspection timelines, and documented evidence to expedite fair claims processing.

### Internal Teams (Equity Builders)
Orchestrate the entire workflow: forensic inspections, claim strategy, contractor coordination, and equity outcome validation.

---

## 🏗️ How It Works (High-Level)

1. **Property Onboarding**  
   Storm-damaged property is registered with photos, videos, and initial assessment data.

2. **Forensic Inspection**  
   Certified inspectors document damage using our mobile-first inspection interface. All evidence is timestamped, geotagged, and categorized.

3. **Insurance Intelligence**  
   Track claim submission, adjuster interactions, scope discrepancies, and negotiation history. ATOS (our AI assistant) flags gaps and recommends actions.

4. **Contractor Execution**  
   Assign verified contractors with clear scopes. Monitor progress with visual verification and compliance tracking.

5. **Equity Validation**  
   Generate before/after valuations, claim vs. payout analysis, and comprehensive equity gain reports.

---

## 🧠 ATOS — The Intelligence Core

**ATOS is not a chatbot. ATOS is a forensic strategist.**

ATOS provides:
- **Proactive Guidance**: Surfaces next-best actions based on property state
- **Risk Detection**: Identifies gaps in documentation, scope mismatches, and claim red flags
- **Explainability**: Translates complex insurance/legal language into actionable insights
- **Context-Aware Assistance**: Every module has embedded ATOS guidance tailored to the user's role and task

ATOS never hallucinates. It reasons from verified data and explicitly flags uncertainty.

---

## 🛠️ Technology Stack

### Frontend
- **Next.js 15** (App Router) with TypeScript
- **Tailwind CSS** for design system
- **Framer Motion** for polished interactions
- **Lucide React** for iconography

### Backend
- **Next.js API Routes** + **Server Actions** for serverless architecture
- **Node.js runtime** (v20+)
- **Drizzle ORM** for type-safe database access

### Database
- **PostgreSQL** (Neon for serverless deployment)
- Optimized schema for forensic timelines, document chains, and role-based access

### Authentication
- **NextAuth.js v5** with role-based access control (Owner, Contractor, Adjuster, Internal)
- Secure session management with JWT

### AI Layer
- Modular AI integration (OpenAI/Anthropic/custom models)
- Prompt engineering for forensic reasoning and strategic guidance

### Hosting & Deployment
- **Vercel/Render-compatible**
- Edge-optimized with ISR for performance
- Security headers and HTTPS enforcement

---

## 📁 Project Structure

```
equity-builders/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes
│   │   ├── login/
│   │   ├── register/
│   │   └── layout.tsx
│   ├── (dashboard)/              # Authenticated dashboard
│   │   ├── intelligence/         # Intelligence Center (main hub)
│   │   ├── properties/           # Property management
│   │   ├── inspections/          # Forensic inspections
│   │   ├── insurance/            # Insurance intelligence
│   │   ├── contractors/          # Contractor execution
│   │   ├── equity/               # Equity outcomes
│   │   └── layout.tsx
│   ├── api/                      # API routes
│   │   ├── auth/
│   │   ├── properties/
│   │   ├── atos/                 # AI intelligence endpoints
│   │   └── webhooks/
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing page
├── components/                    # React components
│   ├── ui/                       # Base UI components
│   ├── atos/                     # ATOS assistant interface
│   ├── forensic/                 # Forensic inspection components
│   ├── insurance/                # Insurance tracking components
│   └── charts/                   # Data visualization
├── lib/                          # Core utilities
│   ├── db/                       # Database schema and client
│   ├── auth/                     # Authentication logic
│   ├── atos/                     # AI/ATOS integration
│   ├── validation/               # Zod schemas
│   └── utils.ts                  # Shared utilities
├── public/                       # Static assets
├── types/                        # TypeScript definitions
└── config/                       # Configuration files
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ and npm 10+
- PostgreSQL database (Neon recommended)
- AI API key (OpenAI or similar)

### Installation

```bash
# Clone repository
git clone <repository-url>
cd equity-builders

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database and API keys

# Push database schema
npm run db:push

# Start development server
npm run dev
```

Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run start
```

---

## 🔐 Security & Compliance

- **Role-Based Access Control (RBAC)**: Every user has strict permissions
- **Data Encryption**: All sensitive data encrypted at rest and in transit
- **Audit Trails**: Complete logs of all property and claim interactions
- **HTTPS Enforcement**: Strict security headers in production
- **Input Validation**: Zod schemas validate all user inputs

---

## 📊 Core Modules

### 1. Intelligence Center
Central command dashboard. See all properties, active claims, contractor progress, and ATOS insights in one view.

### 2. Forensic Property Module
Property profiles, inspection records, photo/video/document ingestion, damage classification, and timeline visualization.

### 3. Insurance Intelligence Module
Claim lifecycle tracking, carrier interaction logs, scope comparison, discrepancy detection, and negotiation history.

### 4. Contractor Execution Module
Contractor onboarding, scope assignment, progress verification with visual evidence, compliance tracking.

### 5. Equity Outcome Module
Before/after valuations, claim vs. payout delta analysis, equity gain narratives, and exportable reports.

---

## 🧪 Development Guidelines

### Code Standards
- **TypeScript strict mode** enabled
- **ESLint** for code quality
- **Prettier** for consistent formatting
- Component documentation with JSDoc

### Testing Philosophy
- Unit tests for business logic
- Integration tests for API routes
- E2E tests for critical user flows
- AI output validation in test suites

### Git Workflow
- Feature branches from `main`
- Descriptive commit messages
- PR reviews required
- CI/CD pipeline for automated checks

---

## 📝 Documentation

- **API Documentation**: See `/docs/api.md`
- **Database Schema**: See `/docs/schema.md`
- **ATOS Integration Guide**: See `/docs/atos.md`
- **Deployment Guide**: See `/docs/deployment.md`

---

## 🤝 Contributing

This is a production system. All contributions must:
1. Pass TypeScript type checking
2. Follow ESLint rules
3. Include tests for new features
4. Maintain backward compatibility
5. Document breaking changes

---

## 📄 License

Proprietary. © 2026 Equity Builders. All rights reserved.

---

## 🔗 Links

- **Production**: [https://equitybuilders.com](https://equitybuilders.com)
- **Staging**: [https://staging.equitybuilders.com](https://staging.equitybuilders.com)
- **Documentation**: [https://docs.equitybuilders.com](https://docs.equitybuilders.com)
- **Support**: support@equitybuilders.com

---

**Built with precision. Powered by intelligence. Trusted by property owners.**
