# Equity Builders - Deployment Guide

This guide provides comprehensive instructions for deploying the Equity Builders platform to production.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Database Setup](#database-setup)
4. [Deployment Options](#deployment-options)
5. [Security Checklist](#security-checklist)
6. [Monitoring & Maintenance](#monitoring--maintenance)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before deploying, ensure you have:

- **Node.js**: Version 18.17.0 or higher
- **npm**: Version 9.0.0 or higher
- **PostgreSQL**: Version 14 or higher (or Neon account)
- **OpenAI API Key**: For ATOS AI functionality
- **Domain Name**: For production deployment
- **SSL Certificate**: Handled automatically by hosting platforms

---

## Environment Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd equity-builders
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your production values:

```env
# Database (Neon Postgres recommended)
POSTGRES_URL="postgresql://user:password@host:5432/equity_builders"
POSTGRES_PRISMA_URL="postgresql://user:password@host:5432/equity_builders?pgbouncer=true"
POSTGRES_URL_NON_POOLING="postgresql://user:password@host:5432/equity_builders"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-min-32-characters"
JWT_EXPIRES_IN="7d"

# Application
NODE_ENV="production"
NEXT_PUBLIC_APP_URL="https://your-domain.com"

# AI Integration
OPENAI_API_KEY="sk-your-openai-api-key"
AI_MODEL="gpt-4-turbo-preview"

# Storage
STORAGE_PROVIDER="s3"
AWS_S3_BUCKET="equity-builders-production"
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_REGION="us-east-1"

# Email
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_USER="apikey"
SMTP_PASSWORD="your-sendgrid-api-key"
SMTP_FROM="noreply@equitybuilders.com"
```

### 4. Generate Secure JWT Secret

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Use the output as your `JWT_SECRET`.

---

## Database Setup

### Option 1: Neon (Recommended)

1. **Create Account**: Sign up at [neon.tech](https://neon.tech)
2. **Create Database**: 
   - Name: `equity_builders`
   - Region: Choose closest to your users
3. **Get Connection String**: Copy from Neon dashboard
4. **Initialize Schema**:

```bash
# Download schema file
curl -o schema.sql https://raw.githubusercontent.com/<your-repo>/main/lib/db/schema.sql

# Connect to Neon and run schema
psql "your-neon-connection-string" -f lib/db/schema.sql
```

### Option 2: Self-Hosted PostgreSQL

1. **Install PostgreSQL 14+**
2. **Create Database**:

```sql
CREATE DATABASE equity_builders;
CREATE USER equity_user WITH PASSWORD 'secure-password';
GRANT ALL PRIVILEGES ON DATABASE equity_builders TO equity_user;
```

3. **Run Schema**:

```bash
psql -U equity_user -d equity_builders -f lib/db/schema.sql
```

### Verify Database

```bash
npm run db:check
```

---

## Deployment Options

### Option 1: Vercel (Recommended for Next.js)

#### Prerequisites
- Vercel account
- GitHub repository

#### Steps

1. **Install Vercel CLI**:
```bash
npm i -g vercel
```

2. **Login**:
```bash
vercel login
```

3. **Configure Project**:
```bash
vercel
```

Follow prompts:
- Link to existing project? No
- Project name: equity-builders
- Directory: ./
- Framework: Next.js

4. **Set Environment Variables**:
```bash
vercel env add POSTGRES_URL
vercel env add JWT_SECRET
vercel env add OPENAI_API_KEY
# ... add all variables from .env
```

5. **Deploy**:
```bash
vercel --prod
```

6. **Configure Custom Domain**:
```bash
vercel domains add your-domain.com
```

### Option 2: Render

#### Prerequisites
- Render account
- GitHub repository

#### Steps

1. **Create New Web Service**:
   - Connect GitHub repository
   - Name: equity-builders
   - Environment: Node
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

2. **Configure Environment Variables**:
   - Add all variables from `.env` in Render dashboard
   - Environment Group: Production

3. **Database**:
   - Create PostgreSQL instance in Render
   - Copy connection string to `POSTGRES_URL`

4. **Deploy**:
   - Auto-deploys on git push to main branch

### Option 3: Docker

#### Dockerfile

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]
```

#### Build and Run

```bash
# Build image
docker build -t equity-builders:latest .

# Run container
docker run -d \
  --name equity-builders \
  -p 3000:3000 \
  --env-file .env \
  equity-builders:latest
```

#### Docker Compose

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${POSTGRES_URL}
      - JWT_SECRET=${JWT_SECRET}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    depends_on:
      - postgres

  postgres:
    image: postgres:14-alpine
    environment:
      - POSTGRES_DB=equity_builders
      - POSTGRES_USER=equity_user
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./lib/db/schema.sql:/docker-entrypoint-initdb.d/schema.sql

volumes:
  postgres_data:
```

Run: `docker-compose up -d`

---

## Security Checklist

### Pre-Deployment

- [ ] **Strong JWT Secret**: Minimum 32 characters, randomly generated
- [ ] **Environment Variables**: Never commit `.env` to git
- [ ] **Database Credentials**: Use strong passwords (16+ characters)
- [ ] **API Keys**: Rotate regularly, restrict permissions
- [ ] **HTTPS**: Enabled (automatic with Vercel/Render)
- [ ] **CORS**: Configure allowed origins
- [ ] **Rate Limiting**: Implement for API routes
- [ ] **Input Validation**: All user inputs validated
- [ ] **SQL Injection**: Using parameterized queries
- [ ] **XSS Protection**: Next.js automatic escaping enabled

### Post-Deployment

- [ ] **Database Backups**: Automated daily backups
- [ ] **Monitoring**: Error tracking configured
- [ ] **Logging**: Application logs stored securely
- [ ] **SSL Certificate**: Valid and auto-renewing
- [ ] **Security Headers**: CSP, HSTS configured
- [ ] **Dependency Updates**: Regular security patches
- [ ] **Password Policy**: Enforced for users
- [ ] **Session Management**: Timeout configured
- [ ] **2FA**: Available for admin accounts

---

## Monitoring & Maintenance

### Error Tracking

Integrate Sentry:

```bash
npm install @sentry/nextjs
```

```js
// next.config.js
const { withSentryConfig } = require('@sentry/nextjs');

module.exports = withSentryConfig(
  nextConfig,
  { silent: true },
  { hideSourceMaps: true }
);
```

### Performance Monitoring

Use Vercel Analytics (automatic) or Google Analytics:

```js
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Database Maintenance

**Neon**: Automatic backups and maintenance

**Self-Hosted**: Set up cron jobs:

```bash
# Backup daily at 2 AM
0 2 * * * pg_dump equity_builders > /backups/db_$(date +\%Y\%m\%d).sql

# Vacuum weekly
0 3 * * 0 psql -d equity_builders -c "VACUUM ANALYZE;"
```

### Health Checks

Create health check endpoint:

```ts
// app/api/health/route.ts
import { checkDatabaseConnection } from '@/lib/db';

export async function GET() {
  const dbHealthy = await checkDatabaseConnection();
  
  return Response.json({
    status: dbHealthy ? 'healthy' : 'unhealthy',
    database: dbHealthy ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  }, {
    status: dbHealthy ? 200 : 503
  });
}
```

Monitor: `https://your-domain.com/api/health`

---

## Troubleshooting

### Build Failures

**Error: Module not found**
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run build
```

**Error: Type errors**
```bash
# Run type check
npm run type-check
```

### Database Connection Issues

**Error: Connection refused**
- Check `POSTGRES_URL` is correct
- Verify database is running
- Check firewall/security groups
- Ensure IP whitelist includes deployment server

**Error: Too many connections**
- Use `POSTGRES_PRISMA_URL` with pgBouncer
- Reduce connection pool size
- Check for connection leaks

### Authentication Issues

**Error: Invalid token**
- Verify `JWT_SECRET` matches across deployments
- Check token expiration settings
- Clear cookies and re-login

**Error: Password validation fails**
- Verify bcrypt is properly installed
- Check `SALT_ROUNDS` configuration

### Performance Issues

**Slow page loads**
- Enable caching for static assets
- Optimize images (use Next.js Image component)
- Enable ISR for semi-static pages
- Add database indexes

**High memory usage**
- Reduce connection pool size
- Implement pagination for large datasets
- Optimize queries (use EXPLAIN ANALYZE)

---

## Rollback Procedure

If deployment fails:

### Vercel
```bash
vercel rollback
```

### Render
- Go to dashboard → Deployments
- Click "Rollback" on previous working deployment

### Docker
```bash
docker stop equity-builders
docker run -d --name equity-builders equity-builders:previous-tag
```

---

## Support

For deployment issues:
- **Email**: devops@equitybuilders.com
- **Docs**: https://docs.equitybuilders.com
- **Status**: https://status.equitybuilders.com

---

## Changelog

### v1.0.0 (Initial Release)
- Complete platform architecture
- All core modules implemented
- Production-ready authentication
- ATOS AI integration
- Comprehensive security measures

---

**Built with precision. Deployed with confidence.**

© 2026 Equity Builders
