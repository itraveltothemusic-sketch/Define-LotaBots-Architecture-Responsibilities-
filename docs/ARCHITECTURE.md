# Equity Builders - Technical Architecture

## Overview

Equity Builders is a production-grade, full-stack forensic property intelligence platform built with modern web technologies and designed for scalability, security, and performance.

## Technology Stack

### Frontend
- **Next.js 14** (App Router)
  - Server-side rendering (SSR)
  - Server components for optimal performance
  - Automatic code splitting and optimization
- **React 18** with Server Components
- **TypeScript** for type safety
- **Tailwind CSS** for styling with custom design system

### Backend
- **Next.js API Routes** and Server Actions
- **Node.js** runtime
- **Drizzle ORM** for type-safe database operations
- **PostgreSQL** (via Neon serverless)

### Authentication & Security
- **JWT** (JSON Web Tokens) for session management
- **bcryptjs** for password hashing (12 salt rounds)
- **Role-based access control** (RBAC)
- **httpOnly cookies** for secure session storage
- **Content Security Policy** (CSP) headers
- **XSS and CSRF protection**

### AI/ML Layer
- **OpenAI API** integration for ATOS assistant
- Context-aware prompt engineering
- Evidence-based reasoning (no hallucination)

## System Architecture

### High-Level Structure

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT BROWSER                           │
│  (Next.js Client Components + Server Components)            │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   NEXT.JS APP ROUTER                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   Pages     │  │ API Routes  │  │   Server    │        │
│  │             │  │             │  │   Actions   │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────┘
                            │
              ┌─────────────┴─────────────┐
              ▼                           ▼
┌──────────────────────┐    ┌──────────────────────┐
│   BUSINESS LOGIC     │    │     ATOS ENGINE      │
│   (lib/ directory)   │    │   (AI Assistant)     │
└──────────────────────┘    └──────────────────────┘
              │                           │
              └─────────────┬─────────────┘
                            ▼
              ┌──────────────────────────┐
              │   DATABASE (PostgreSQL)  │
              │   (Drizzle ORM)          │
              └──────────────────────────┘
```

## Directory Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                  # Authentication routes
│   │   └── auth/
│   │       ├── login/
│   │       └── register/
│   ├── (dashboard)/             # Protected dashboard routes
│   │   └── dashboard/
│   │       ├── layout.tsx       # Dashboard layout with sidebar
│   │       ├── page.tsx         # Intelligence Center
│   │       ├── properties/      # Forensic Property Module
│   │       ├── insurance/       # Insurance Intelligence
│   │       ├── contractors/     # Contractor Execution
│   │       └── equity/          # Equity Outcomes
│   ├── api/                     # API Routes
│   │   ├── auth/               # Authentication endpoints
│   │   └── properties/         # Property CRUD
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Landing page
│   └── globals.css             # Global styles
│
├── components/                  # Reusable UI components
│   ├── ui/                     # Base UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Input.tsx
│   │   └── Select.tsx
│   ├── atos/                   # ATOS-specific components
│   │   ├── ATOSPanel.tsx
│   │   └── ATOSChat.tsx
│   └── layout/                 # Layout components
│       ├── Sidebar.tsx
│       └── Header.tsx
│
├── lib/                        # Core business logic
│   ├── db/                    # Database layer
│   │   ├── schema.ts          # Drizzle schema definitions
│   │   └── index.ts           # DB connection
│   ├── auth/                  # Authentication logic
│   │   ├── password.ts        # Password hashing/verification
│   │   ├── jwt.ts             # JWT token operations
│   │   └── session.ts         # Session management
│   ├── atos/                  # ATOS AI engine
│   │   └── engine.ts          # Core ATOS logic
│   └── utils/                 # Utility functions
│       ├── validation.ts      # Zod schemas
│       ├── api.ts             # API helpers
│       └── format.ts          # Formatting utilities
│
├── types/                     # TypeScript type definitions
│   └── index.ts              # Global types
│
└── modules/                   # Feature modules (future expansion)
    ├── intelligence/
    ├── forensic/
    ├── insurance/
    ├── contractor/
    └── equity/
```

## Database Schema

### Core Entities

1. **Users** - Authentication and user management
2. **Properties** - Commercial property records
3. **Damage Assessments** - Forensic damage documentation
4. **Evidence** - Photos, videos, documents
5. **Insurance Claims** - Claim lifecycle tracking
6. **Claim Interactions** - Carrier communication logs
7. **Scope Discrepancies** - Automated variance detection
8. **Contractors** - Vetted contractor database
9. **Work Orders** - Project and scope management
10. **Progress Updates** - Real-time work verification
11. **Property Valuations** - Before/after value tracking
12. **Equity Outcomes** - ROI and equity gain calculations
13. **Activity Logs** - Audit trail
14. **ATOS Guidance** - AI assistance history

### Key Relationships

- Properties belong to Users (owners)
- Claims belong to Properties
- Work Orders belong to Properties and Contractors
- Evidence links to Properties and Damage Assessments
- All entities maintain created/updated timestamps

### Indexes

Strategic indexes on:
- User email (unique)
- Property owner ID and status
- Claim property ID and status
- Work order property ID and contractor ID
- Evidence property ID and type
- Activity logs user ID and timestamp

## Authentication Flow

1. **Registration**
   - User submits email, password, name, role
   - Server validates input (Zod)
   - Password hashed with bcrypt (12 rounds)
   - User record created in database
   - JWT token generated and stored in httpOnly cookie
   - User redirected to dashboard

2. **Login**
   - User submits email and password
   - Server looks up user by email
   - Password verified against stored hash
   - JWT token generated with user ID, email, role
   - Token stored in httpOnly cookie
   - Last login timestamp updated

3. **Session Management**
   - JWT stored in httpOnly cookie (secure, sameSite: lax)
   - Token includes: userId, role, email, expiry
   - Default expiry: 7 days
   - Server validates token on protected routes
   - Session automatically refreshed on activity

4. **Authorization**
   - Role-based access control (RBAC)
   - Roles: OWNER, CONTRACTOR, ADJUSTER, INTERNAL
   - Middleware checks user role for route access
   - API routes verify permissions before operations

## ATOS AI Assistant

### Architecture

ATOS is not a generic chatbot - it's a specialized forensic intelligence system.

### Behavior Model

1. **Context Awareness**
   - Tracks current module (intelligence, forensic, insurance, etc.)
   - Knows property state and recent activity
   - Understands user role and permissions

2. **Guidance Generation**
   - Module-specific prompts
   - Evidence-based reasoning
   - Risk identification
   - Opportunity surfacing
   - Prioritized action suggestions

3. **Integration Points**
   - Property damage analysis
   - Claim scope comparison
   - Contractor performance review
   - Documentation completeness checks
   - Strategic recommendations

### Prompt Engineering

System prompt defines:
- ATOS role as forensic expert + strategist
- Core principles (accuracy, explainability, risk awareness)
- Output format (guidance, reasoning, actions, risks, opportunities)
- Behavioral constraints (no hallucination, evidence-only)

## Security Measures

### Input Validation
- All user inputs validated with Zod schemas
- SQL injection prevention via parameterized queries (Drizzle ORM)
- XSS protection through React's built-in escaping
- File upload validation (type, size, content)

### Authentication Security
- Passwords hashed with bcrypt (12 salt rounds)
- JWT tokens signed with secret key
- httpOnly cookies prevent XSS theft
- Secure cookies in production (HTTPS only)
- CSRF protection via SameSite cookie attribute

### API Security
- Authentication required for all protected routes
- Role-based authorization on data operations
- Rate limiting (future: implement on API routes)
- Input sanitization and validation
- Error messages don't leak sensitive info

### Data Security
- Database credentials via environment variables
- SSL/TLS for database connections (Neon)
- No sensitive data in client-side code
- Audit logs for all critical operations
- Regular backups (handled by Neon)

## Performance Optimizations

### Frontend
- Server components for reduced JavaScript bundle
- Automatic code splitting by Next.js
- Image optimization with next/image
- Static generation where possible
- Edge caching for static assets

### Database
- Strategic indexes on frequently queried columns
- Efficient joins with Drizzle ORM
- Pagination for large data sets
- Connection pooling (Neon serverless)

### Caching Strategy
- Server component caching
- API route caching with revalidation
- Static page generation
- CDN for static assets

## Deployment Architecture

### Recommended Stack
- **Frontend/Backend**: Vercel (optimized for Next.js)
- **Database**: Neon (serverless PostgreSQL)
- **File Storage**: AWS S3 or Vercel Blob
- **Email**: SendGrid or AWS SES
- **Monitoring**: Vercel Analytics + Sentry

### Environment Variables
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT signing
- `OPENAI_API_KEY` - For ATOS AI features
- `NEXT_PUBLIC_APP_URL` - Application base URL
- `SMTP_*` - Email configuration

### CI/CD Pipeline
- Git push triggers automatic deployment (Vercel)
- Database migrations run automatically
- Environment variables managed in dashboard
- Preview deployments for PRs
- Production deployments on merge to main

## Scalability Considerations

### Horizontal Scaling
- Stateless application design
- JWT-based authentication (no server session state)
- Database handles multiple connections (Neon)
- CDN for static asset distribution

### Vertical Scaling
- Serverless functions scale automatically (Vercel)
- Database scales with Neon's serverless model
- File storage scales independently (S3/Blob)

### Future Enhancements
- Redis for session caching
- Message queue for async processing (evidence processing, AI)
- Microservices for heavy operations (video processing)
- GraphQL for flexible data queries

## Monitoring & Observability

### Logging
- Structured logging for all API requests
- Error tracking with stack traces
- Audit logs for sensitive operations
- Performance metrics collection

### Alerting
- Error rate monitoring
- Response time thresholds
- Database connection issues
- Failed authentication attempts

### Analytics
- User activity tracking
- Feature usage metrics
- Performance benchmarks
- Conversion funnels

## Testing Strategy

### Unit Tests
- Utility functions (validation, formatting)
- Authentication logic
- Database operations
- ATOS engine logic

### Integration Tests
- API route testing
- Database transaction tests
- Authentication flow tests
- Authorization checks

### End-to-End Tests
- User registration/login flow
- Property creation workflow
- Evidence upload process
- Claim submission

## Compliance & Legal

### Data Protection
- GDPR compliance (if applicable)
- Data encryption at rest (database)
- Data encryption in transit (SSL/TLS)
- Right to deletion (account/data removal)

### Audit Requirements
- Complete activity logs
- Data access tracking
- Change history for critical records
- Retention policies

## Future Architecture Evolution

### Phase 2: Enhanced Features
- Real-time collaboration (WebSockets)
- Advanced analytics dashboard
- Mobile app (React Native)
- Offline mode with sync

### Phase 3: Scale
- Microservices architecture
- Event-driven processing
- Advanced caching layers
- Multi-region deployment

### Phase 4: AI Enhancement
- Custom ML models for damage assessment
- Predictive analytics for claim outcomes
- Computer vision for evidence verification
- Natural language processing for documents
