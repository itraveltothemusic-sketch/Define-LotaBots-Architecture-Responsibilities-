# Development Guide - Equity Builders Platform

## What Has Been Built

### ✅ Core Infrastructure
- **Next.js 15** with App Router, TypeScript, and Tailwind CSS
- **Database Schema** with Drizzle ORM and PostgreSQL (Neon-ready)
- **Authentication System** with NextAuth.js v5 and role-based access
- **Security Headers** and environment configuration
- **Comprehensive UI Components** (Button, Card, Badge, etc.)

### ✅ Landing Page & Authentication
- **Public Landing Page** with feature showcase and trust indicators
- **Login Page** with demo credentials
- **Registration Page** with role selection
- **Protected Dashboard Layout** with sidebar navigation and header

### ✅ Intelligence Center (Main Dashboard)
- Real-time property overview with metrics
- ATOS AI insights panel
- Active properties list
- Claims summary
- Activity timeline
- Quick actions and system status

### ✅ Forensic Property Module
- **Properties Listing** with grid view and status badges
- **Property Creation Form** with comprehensive fields
- **Property Detail Page** with:
  - Property overview and valuation
  - Related inspections
  - Document gallery
  - Insurance claims
  - Work orders
  - Quick actions

### ✅ Insurance Intelligence Module
- **Claims Listing** with financial metrics
- **Claim Filing Form** with carrier and policy details
- **Claim Detail Page** with:
  - Financial summary and approval rates
  - Claim interactions timeline
  - Scope comparisons
  - ATOS recommendations

### ✅ Contractor Execution Module
- **Contractor Network** listing with ratings and verification
- **Contractor Profiles** with license and performance metrics
- **Work Order Tracking** (integrated with property views)

### ✅ Equity Outcome Module
- **Equity Reports Dashboard** with portfolio metrics
- **Individual Equity Reports** showing:
  - Before/after valuations
  - Claim payout vs. repair cost
  - ROI calculations
  - Equity gain analysis

### ✅ ATOS Assistant
- **Dedicated Chat Interface** for AI interactions
- **Quick Actions** for common queries
- **Context-Aware Responses** (demo implementation)
- **Capabilities Documentation**

### ✅ Settings & Profile
- User profile management
- Notification preferences
- Security settings

## Getting Started

### Prerequisites
```bash
node >= 20.0.0
npm >= 10.0.0
```

### Installation
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials:
# - DATABASE_URL (Neon PostgreSQL)
# - NEXTAUTH_SECRET (generate with: openssl rand -base64 32)
# - AI_API_KEY (for ATOS functionality)
```

### Database Setup
```bash
# Push schema to database
npm run db:push

# Open Drizzle Studio to view/edit data
npm run db:studio
```

### Development
```bash
# Start development server
npm run dev

# Open http://localhost:3000
```

### Build for Production
```bash
# Type check
npm run type-check

# Build
npm run build

# Start production server
npm run start
```

## Architecture

### Database Schema
The platform uses a comprehensive PostgreSQL schema with:
- **Users & Authentication** (users, sessions)
- **Properties** (properties, inspections, damage assessments)
- **Documents** (photos, videos, reports)
- **Insurance** (claims, interactions, scope comparisons)
- **Contractors** (contractors, work orders, updates)
- **Equity Reports** (valuations, financial outcomes)
- **ATOS Intelligence** (insights, conversations)
- **Activity Logs** (audit trail)

### Key Design Patterns
1. **Server Components by Default** - Fetch data server-side for performance
2. **Client Components When Needed** - Forms, interactive elements marked with 'use client'
3. **Type Safety** - Full TypeScript with Zod validation
4. **Role-Based Access** - Middleware and helpers for authorization
5. **Forensic Timeline** - Complete audit trail for compliance

### File Structure
```
equity-builders/
├── app/
│   ├── (auth)/           # Authentication pages
│   ├── (dashboard)/      # Protected dashboard pages
│   ├── api/              # API routes
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Landing page
├── components/
│   ├── ui/               # Reusable UI components
│   ├── atos/             # ATOS assistant components
│   ├── dashboard/        # Dashboard layout components
│   └── intelligence/     # Intelligence center components
├── lib/
│   ├── auth/             # Authentication logic
│   ├── db/               # Database schema and client
│   └── utils.ts          # Utility functions
└── public/               # Static assets
```

## Next Steps

### 1. Database Connection
Set up your Neon PostgreSQL database:
```bash
# Sign up at https://neon.tech
# Create a new project
# Copy the connection string to DATABASE_URL in .env
npm run db:push
```

### 2. Seed Demo Data (Optional)
Create demo users and properties for testing:
```typescript
// Run seed script (create this file)
// scripts/seed.ts
```

### 3. AI Integration
Connect ATOS to your AI provider:
```typescript
// lib/atos/client.ts
// Implement OpenAI/Anthropic/custom AI integration
```

### 4. File Upload
Implement document storage:
- Vercel Blob Storage
- AWS S3
- Cloudinary
```typescript
// lib/storage/client.ts
```

### 5. Email Notifications
Set up email service:
```typescript
// lib/email/client.ts
// Using SendGrid, Resend, or similar
```

### 6. Testing
Add test coverage:
```bash
# Install testing dependencies
npm install -D @testing-library/react @testing-library/jest-dom jest

# Run tests
npm test
```

## Environment Variables

Required variables:
```env
DATABASE_URL=              # Neon PostgreSQL connection
NEXTAUTH_SECRET=           # Auth secret (openssl rand -base64 32)
NEXTAUTH_URL=              # http://localhost:3000 (dev)
AI_API_KEY=                # OpenAI/Anthropic API key
```

Optional variables:
```env
BLOB_READ_WRITE_TOKEN=     # File storage token
EMAIL_SERVER_HOST=         # SMTP host
EMAIL_SERVER_USER=         # SMTP user
EMAIL_FROM=                # From email address
```

## Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Render / Railway / Fly.io
```bash
# Build command: npm run build
# Start command: npm run start
# Node version: 20.x
```

## API Routes

### Authentication
- `POST /api/auth/register` - User registration
- `GET/POST /api/auth/[...nextauth]` - NextAuth handlers

### Properties
- `GET /api/properties` - List properties
- `POST /api/properties` - Create property

### Insurance
- `POST /api/insurance/claims` - File claim

## Security Considerations

1. **Environment Variables** - Never commit secrets
2. **Role-Based Access** - Check permissions on every route
3. **Input Validation** - Zod schemas on all API routes
4. **SQL Injection** - Drizzle ORM prevents this
5. **XSS Protection** - React escapes by default
6. **CSRF Protection** - NextAuth handles this

## Performance Optimization

1. **Server Components** - Fetch data close to database
2. **Image Optimization** - Use Next.js Image component
3. **Code Splitting** - Automatic with App Router
4. **Caching** - ISR for static content
5. **Database Indexing** - Add indexes to frequently queried fields

## Support & Documentation

- **Next.js Docs**: https://nextjs.org/docs
- **Drizzle ORM**: https://orm.drizzle.team
- **NextAuth.js**: https://next-auth.js.org
- **Tailwind CSS**: https://tailwindcss.com

## Contributing

This is a production system. All contributions must:
1. Pass TypeScript type checking
2. Follow ESLint rules
3. Include tests for new features
4. Maintain backward compatibility
5. Document breaking changes

---

**Built with precision. Powered by intelligence. Trusted by property owners.**
