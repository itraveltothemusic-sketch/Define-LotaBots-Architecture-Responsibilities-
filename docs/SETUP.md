# Setup Guide - Equity Builders

## Prerequisites

- Node.js 18+ and npm 9+
- PostgreSQL database (local or Neon cloud)
- OpenAI API key (for ATOS features)
- Code editor (VS Code recommended)

## Installation Steps

### 1. Clone and Install Dependencies

```bash
git clone [repository-url]
cd equity-builders
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your actual values:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/equity_builders"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-min-32-characters-long"
SESSION_DURATION="7d"

# AI/LLM (Optional for ATOS features)
OPENAI_API_KEY="sk-your-openai-api-key"
ATOS_MODEL="gpt-4-turbo-preview"

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

### 3. Database Setup

#### Option A: Local PostgreSQL

Install PostgreSQL locally and create the database:

```bash
createdb equity_builders
```

#### Option B: Neon Cloud (Recommended)

1. Sign up at https://neon.tech
2. Create a new project
3. Copy the connection string to `DATABASE_URL`

### 4. Run Database Migrations

Generate and apply database schema:

```bash
npm run db:generate  # Generate migration files
npm run db:push      # Apply to database
```

**Note**: Add these scripts to `package.json`:

```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate:pg",
    "db:push": "drizzle-kit push:pg",
    "db:studio": "drizzle-kit studio"
  }
}
```

### 5. Start Development Server

```bash
npm run dev
```

Application will be available at `http://localhost:3000`

## Default Accounts

For testing, you can create accounts through the registration page. The first registered user can be granted INTERNAL role for full access.

### Creating an Admin User (Manual)

Connect to your database and run:

```sql
UPDATE users 
SET role = 'INTERNAL' 
WHERE email = 'your-admin-email@example.com';
```

## Verification Steps

### 1. Check Application Runs

- Visit `http://localhost:3000`
- Landing page should load correctly
- Navigation should work

### 2. Test Authentication

- Register a new account
- Verify email validation
- Login with credentials
- Check dashboard access

### 3. Test Database Connection

- Create a property
- Upload evidence (mock UI)
- Verify data persists

### 4. Test ATOS (if API key configured)

- Navigate to Intelligence Center
- ATOS guidance should display
- Ask a question in ATOS chat

## Troubleshooting

### Database Connection Issues

**Problem**: `Error: connect ECONNREFUSED`

**Solution**:
- Verify PostgreSQL is running: `pg_isready`
- Check `DATABASE_URL` is correct
- For Neon, ensure you're using the pooled connection string

### JWT Secret Error

**Problem**: `JWT_SECRET environment variable is not set`

**Solution**:
- Ensure `.env` file exists in root
- `JWT_SECRET` should be at least 32 characters
- Restart the dev server after adding

### Build Errors

**Problem**: TypeScript or build errors

**Solution**:
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

### Port Already in Use

**Problem**: `Port 3000 is already in use`

**Solution**:
```bash
# Find and kill process
lsof -ti:3000 | xargs kill

# Or use a different port
PORT=3001 npm run dev
```

## Development Workflow

### 1. Making Database Changes

1. Edit schema in `src/lib/db/schema.ts`
2. Generate migration: `npm run db:generate`
3. Review generated SQL in `drizzle/` folder
4. Apply migration: `npm run db:push`

### 2. Adding New Features

1. Create components in `src/components/`
2. Add types in `src/types/`
3. Create API routes in `src/app/api/`
4. Add pages in `src/app/(dashboard)/dashboard/`

### 3. Testing Changes

1. Test locally in browser
2. Check console for errors
3. Verify database updates
4. Test authentication flows

## Production Deployment

### Vercel Deployment

1. **Connect Repository**
   - Go to https://vercel.com
   - Import your Git repository
   - Select "equity-builders" project

2. **Configure Environment Variables**
   - Add all variables from `.env`
   - Use production database URL
   - Generate secure JWT_SECRET (32+ chars)

3. **Deploy**
   - Vercel auto-deploys on git push
   - Check deployment logs for errors
   - Verify environment variables are set

### Database Migration

For production, migrations should be run separately:

```bash
# Set production DATABASE_URL
export DATABASE_URL="your-production-url"

# Run migrations
npm run db:push
```

**Important**: Always backup production database before migrations.

## Common Configuration

### Custom Domain

1. Add domain in Vercel dashboard
2. Configure DNS records
3. SSL certificate auto-generated

### Email Setup (SMTP)

Add to `.env`:

```env
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_USER="apikey"
SMTP_PASSWORD="your-sendgrid-api-key"
SMTP_FROM="noreply@yourdomain.com"
```

### File Upload Configuration

For production file uploads:

1. **Vercel Blob** (Recommended)
   ```bash
   npm install @vercel/blob
   ```

2. **AWS S3**
   ```env
   AWS_ACCESS_KEY_ID="your-key"
   AWS_SECRET_ACCESS_KEY="your-secret"
   AWS_REGION="us-east-1"
   AWS_BUCKET_NAME="equity-builders-uploads"
   ```

## Performance Optimization

### Enable Caching

```typescript
// In page.tsx files
export const revalidate = 3600; // Cache for 1 hour
```

### Image Optimization

Use Next.js Image component:

```tsx
import Image from 'next/image';

<Image
  src="/path/to/image.jpg"
  width={500}
  height={300}
  alt="Description"
/>
```

### Database Optimization

Add indexes for frequently queried columns (already in schema).

## Monitoring Setup

### Error Tracking (Sentry)

```bash
npm install @sentry/nextjs
```

Initialize in `instrumentation.ts`:

```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});
```

### Analytics

Add Vercel Analytics:

```bash
npm install @vercel/analytics
```

## Security Checklist

- [ ] JWT_SECRET is strong and unique
- [ ] Database has SSL enabled
- [ ] Environment variables not in git
- [ ] CORS configured correctly
- [ ] Rate limiting enabled (production)
- [ ] HTTPS enforced (production)
- [ ] Security headers configured
- [ ] Regular dependency updates

## Getting Help

- Check documentation in `/docs`
- Review error logs in console
- Check Next.js documentation: https://nextjs.org/docs
- Check Drizzle ORM docs: https://orm.drizzle.team

## Next Steps

After setup is complete:

1. **Customize Branding**
   - Update logo and colors in `tailwind.config.ts`
   - Edit landing page copy

2. **Configure ATOS**
   - Test AI responses
   - Customize guidance prompts
   - Add domain-specific knowledge

3. **Set Up Monitoring**
   - Add error tracking
   - Configure analytics
   - Set up alerts

4. **Test Workflows**
   - Create test properties
   - Upload evidence
   - File claims
   - Track outcomes

5. **Train Users**
   - Create user documentation
   - Record demo videos
   - Schedule training sessions
