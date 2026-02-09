# Deployment Guide - Equity Builders

This document provides instructions for deploying the Equity Builders platform to production.

## Prerequisites

Before deploying, ensure you have:

1. **Node.js 18+** installed
2. **PostgreSQL database** (Neon recommended)
3. **Environment variables** configured
4. **Hosting platform** account (Vercel, Render, or similar)

## Environment Variables

Create a `.env` file with the following variables:

```env
# Database
DATABASE_URL=postgresql://username:password@host:port/database

# Authentication
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-strong-secret-key-here

# AI / LLM (Future)
OPENAI_API_KEY=your-openai-key-here

# Application
NODE_ENV=production
```

### Generating Secrets

Generate a secure `NEXTAUTH_SECRET`:

```bash
openssl rand -base64 32
```

## Database Setup

### Using Neon (Recommended)

1. Create a Neon account at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Add it to your `.env` as `DATABASE_URL`

### Running Migrations

```bash
# Generate migration files
npm run db:generate

# Push schema to database
npm run db:push
```

## Deployment Options

### Option 1: Vercel (Recommended for Next.js)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Add Environment Variables:**
   - Go to Vercel dashboard
   - Navigate to your project settings
   - Add all environment variables from `.env`

5. **Deploy to Production:**
   ```bash
   vercel --prod
   ```

### Option 2: Render

1. **Create account** at [render.com](https://render.com)

2. **Create new Web Service:**
   - Connect your GitHub repository
   - Select branch: `main` or `cursor/project-initial-setup-772f`
   - Build command: `npm install && npm run build`
   - Start command: `npm start`

3. **Add Environment Variables:**
   - Go to service settings
   - Add all variables from `.env`

4. **Deploy:** Render will automatically deploy on push

### Option 3: Self-Hosted

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Start the server:**
   ```bash
   npm start
   ```

3. **Use a process manager (PM2):**
   ```bash
   npm install -g pm2
   pm2 start npm --name "equity-builders" -- start
   pm2 save
   pm2 startup
   ```

4. **Set up reverse proxy (Nginx):**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## Post-Deployment

### 1. Verify Deployment

- Visit your deployed URL
- Test authentication (login/register)
- Verify database connection
- Check that all pages load correctly

### 2. Create Initial Admin User

Use the registration page to create your first user with the "internal" role.

### 3. Monitor

- Set up error tracking (Sentry recommended)
- Monitor database performance
- Set up uptime monitoring

### 4. Security Checklist

- [ ] All environment variables are set
- [ ] `NEXTAUTH_SECRET` is strong and unique
- [ ] Database credentials are secure
- [ ] HTTPS is enabled
- [ ] CORS is properly configured
- [ ] Rate limiting is enabled (if applicable)

## Continuous Deployment

### GitHub Actions (Example)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          NEXTAUTH_SECRET: ${{ secrets.NEXTAUTH_SECRET }}
      
      - name: Deploy to Vercel
        run: vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

## Troubleshooting

### Database Connection Issues

If you see "DATABASE_URL is not set":
- Verify environment variables are correctly set
- Restart the application
- Check database connectivity

### Build Failures

If build fails:
- Clear `.next` directory: `rm -rf .next`
- Delete `node_modules`: `rm -rf node_modules`
- Reinstall: `npm install`
- Try build again: `npm run build`

### Authentication Issues

If login doesn't work:
- Verify `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your domain
- Clear browser cookies
- Check server logs

## Scaling Considerations

As your platform grows:

1. **Database Scaling:**
   - Neon automatically scales
   - Consider connection pooling for high traffic
   - Set up read replicas if needed

2. **Application Scaling:**
   - Vercel/Render handle auto-scaling
   - For self-hosted, use load balancer (Nginx, HAProxy)
   - Consider CDN for static assets

3. **Caching:**
   - Implement Redis for session storage
   - Cache frequently accessed data
   - Use Next.js built-in caching

## Support

For deployment assistance or issues:
- Check the [README.md](README.md) for general documentation
- Review Next.js deployment docs: [nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)
- Contact the technical team

---

**Remember:** Always test in a staging environment before deploying to production.
