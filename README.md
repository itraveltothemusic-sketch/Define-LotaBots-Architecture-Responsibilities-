# Equity Builders — Forensic Property Intelligence Platform

## 🎯 Mission

Transform commercial storm-damaged properties into verified equity gains through forensic inspections, insurance intelligence, and AI-guided execution.

This is not a demo or MVP—this is a production-grade, enterprise-ready platform built for **trust**, **precision**, and **authority**.

---

## 🏗️ What Is Equity Builders?

Equity Builders is a comprehensive platform that connects property owners, contractors, insurance adjusters, and internal teams to maximize recoverable value from storm-damaged commercial properties.

### Core Value Proposition

- **Forensic Property Intelligence**: Document every detail with precision-grade evidence
- **Insurance Claim Optimization**: Track, compare, and close discrepancies in real-time
- **Contractor Execution Management**: Coordinate scope, progress, and compliance
- **Equity Outcome Verification**: Measure and certify before/after value gains
- **AI-Guided Strategy**: ATOS assistant provides context-aware guidance at every step

---

## 👥 Who Is This For?

### Property Owners
- Track claim progress and documentation
- Understand insurance processes in plain language
- View equity gain trajectories

### Contractors
- Receive clear scope assignments
- Submit progress with verification
- Maintain compliance records

### Insurance Adjusters
- Access complete property documentation
- Compare scopes and validate claims
- Streamline communication

### Internal Teams (Equity Builders Staff)
- Manage entire property lifecycle
- Coordinate all stakeholders
- Generate comprehensive reports

---

## 🧠 How It Works

### 1. Property Intake & Forensic Documentation
- Property profile creation with comprehensive metadata
- Inspection scheduling and evidence collection
- Photo, video, and document ingestion with AI categorization
- Damage classification and severity assessment

### 2. Insurance Intelligence Layer
- Claim lifecycle tracking from filing to settlement
- Carrier interaction logs and timeline
- Scope comparison engine (initial vs revised vs final)
- Discrepancy detection and resolution tracking

### 3. Contractor Orchestration
- Contractor onboarding with credential verification
- Scope assignment with clear expectations
- Progress verification through milestone tracking
- Compliance monitoring (licensing, insurance, quality standards)

### 4. Equity Outcome Analysis
- Before/after property valuation
- Claim payout vs actual recovery delta
- Equity gain narrative with supporting evidence
- Comprehensive outcome reports for stakeholders

### 5. ATOS Intelligence Assistant
- **Not a chatbot**—a forensic strategist and guide
- Proactively surfaces risks, gaps, and opportunities
- Explains "why this matters" at every decision point
- Translates complexity into confidence
- Reasons from provided data (never hallucinates)

---

## 🛠️ Technology Stack

### Frontend
- **Next.js 15** (App Router) — Server components, streaming, modern React
- **TypeScript** — End-to-end type safety
- **Tailwind CSS** — Utility-first styling with custom design system

### Backend
- **Node.js** — API routes and server actions
- **Next.js Server Actions** — Type-safe mutations without API boilerplate

### Database
- **PostgreSQL** (Neon) — Serverless Postgres for scalability
- **Drizzle ORM** — Type-safe SQL with excellent DX

### Authentication
- **NextAuth.js v5** — Secure, role-based authentication
- **JWT** — Stateless session management
- **bcrypt** — Password hashing

### AI/Intelligence Layer
- **ATOS Assistant** — Context-aware guidance engine
- **Future**: OpenAI GPT-4 integration for natural language reasoning
- **Future**: Document analysis and extraction

### Infrastructure
- **Vercel** / **Render** — Production deployment
- **Git** — Version control and CI/CD

---

## 📁 Project Structure

```
equity-builders/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/              # Protected dashboard routes
│   │   ├── layout.tsx            # Shared dashboard layout
│   │   ├── page.tsx              # Main dashboard/intelligence center
│   │   ├── properties/           # Property management
│   │   ├── claims/               # Insurance claims
│   │   ├── contractors/          # Contractor management
│   │   ├── equity/               # Equity outcomes
│   │   └── intelligence/         # ATOS center
│   ├── api/                      # API routes
│   │   ├── auth/
│   │   ├── properties/
│   │   ├── claims/
│   │   └── atos/                 # AI assistant endpoints
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing page
│   └── globals.css               # Global styles
├── components/
│   ├── ui/                       # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── ...
│   ├── forms/                    # Form components
│   ├── layouts/                  # Layout components
│   └── modules/                  # Feature-specific components
│       ├── PropertyCard.tsx
│       ├── ClaimTimeline.tsx
│       ├── ATOSPanel.tsx
│       └── ...
├── lib/
│   ├── db/                       # Database
│   │   ├── schema.ts             # Drizzle schema definitions
│   │   ├── client.ts             # Database client
│   │   └── migrations/
│   ├── auth/                     # Authentication logic (e.g. NextAuth configuration, middleware)
│   ├── ai/                       # AI/ATOS logic (e.g. ATOS assistant core, prompts)
│   └── utils/                    # Utility functions
│       ├── cn.ts                 # Class name utilities
│       ├── format.ts             # Formatting helpers
│       └── validation.ts         # Zod schemas
├── types/                        # Shared TypeScript type definitions (database, auth, domain modules)
├── public/                       # Static assets
│   ├── images/
│   └── icons/
├── drizzle.config.ts             # Drizzle Kit configuration
├── next.config.ts                # Next.js configuration
├── tailwind.config.ts            # Tailwind configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- PostgreSQL database (Neon recommended)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd equity-builders

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials and secrets

# Run database migrations
npm run db:push

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 📊 Core Modules

### 1. Intelligence Center
The heart of the platform. Unified dashboard showing:
- Active properties and their status
- Recent activity timeline
- Risk indicators and gaps
- ATOS guidance panel

### 2. Forensic Property Module
Complete property lifecycle management:
- Property profiles with metadata
- Inspection records and schedules
- Evidence vault (photos, videos, documents)
- Damage assessment and classification

### 3. Insurance Intelligence Module
End-to-end claim tracking:
- Claim status and milestones
- Carrier communication logs
- Scope comparison tools
- Discrepancy resolution workflow

### 4. Contractor Execution Module
Orchestrate contractor work:
- Contractor profiles and credentials
- Scope assignment with specifications
- Progress tracking and verification
- Compliance monitoring

### 5. Equity Outcome Module
Measure and certify results:
- Pre/post-restoration valuations
- Claim recovery analysis
- Equity gain calculation
- Comprehensive outcome reports

---

## 🤖 ATOS Intelligence Assistant

ATOS (Automated Tactical Operations System) is the AI-powered guide embedded throughout the platform.

### Design Philosophy
- **Proactive, not reactive**: Surfaces insights before users ask
- **Explainable**: Every recommendation includes "why this matters"
- **Data-grounded**: Reasons from evidence, never hallucinates
- **Context-aware**: Understands where the user is in the workflow
- **Strategic**: Focuses on outcomes, not just actions

### Example Interactions
- "This photo shows water intrusion in the HVAC room—this increases claim value by 15-20% if documented properly"
- "The adjuster's scope is missing 3 items from your contractor's estimate. Here's how to address it..."
- "Your claim has been pending for 47 days, which is 12 days above industry average. Consider these next steps..."

---

## 🔐 Security & Compliance

- **Role-Based Access Control (RBAC)**: Users see only what they're authorized to access
- **Encrypted Passwords**: bcrypt hashing with salt rounds
- **JWT Authentication**: Secure, stateless sessions
- **Input Validation**: Zod schemas on all user inputs
- **SQL Injection Prevention**: Parameterized queries via Drizzle ORM
- **Environment Secrets**: Sensitive data never committed to repository

---

## 📈 Development Roadmap

### Phase 1: Foundation (Current)
- ✅ Project scaffolding and architecture
- ✅ Authentication system
- ✅ Database schema
- ✅ Core UI components
- 🔄 Landing page and dashboard shell

### Phase 2: Core Modules
- 🔄 Intelligence Center
- 🔄 Property management
- 🔄 Claims tracking
- 🔄 Contractor portal

### Phase 3: Intelligence Layer
- ATOS assistant integration
- Document analysis
- Automated insights
- Risk detection

### Phase 4: Advanced Features
- Mobile app
- Real-time notifications
- Advanced analytics
- Third-party integrations

---

## 🤝 Contributing

This is a production system. All contributions must:
- Pass TypeScript type checking
- Follow established code patterns
- Include clear comments explaining "why"
- Maintain test coverage
- Be reviewed before merging

---

## 📝 License

Proprietary — All rights reserved

---

## 📞 Support

For questions or issues, contact the Equity Builders technical team.

---

**Built with precision. Powered by intelligence. Designed for trust.**
