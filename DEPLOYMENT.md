# 🚀 YieldForge Deployment Guide

## Quick Deploy Options

### Option 1: Vercel (Recommended - 2 minutes)

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Deploy**
```bash
vercel
```

3. **Add Environment Variables**
- Go to Vercel Dashboard → Project → Settings → Environment Variables
- Add `GOOGLE_API_KEY`
- Redeploy

**Live URL:** `https://your-project.vercel.app`

### Option 2: Railway (3 minutes)

1. **Install Railway CLI**
```bash
npm install -g railway
```

2. **Login & Deploy**
```bash
railway login
railway init
railway up
```

3. **Add Environment Variables**
```bash
railway variables set GOOGLE_API_KEY=your_key_here
```

**Live URL:** `https://your-project.railway.app`

### Option 3: Netlify (3 minutes)

1. **Install Netlify CLI**
```bash
npm install -g netlify-cli
```

2. **Deploy**
```bash
netlify deploy --prod
```

3. **Add Environment Variables**
- Go to Netlify Dashboard → Site Settings → Environment Variables
- Add `GOOGLE_API_KEY`

---

## Manual Deployment

### Build for Production

```bash
# Install dependencies
npm install

# Build the app
npm run build

# Test production build locally
npm start
```

### Environment Variables

Required for production:

```env
GOOGLE_API_KEY=your_google_api_key_here
LLM_MODEL=gemini-2.5-flash
NODE_ENV=production
```

Optional:

```env
WALLET_PRIVATE_KEY=your_wallet_private_key
FRAXTAL_RPC_URL=https://rpc.testnet.fraxtal.io
FRAXTAL_CHAIN_ID=2522
```

---

## Docker Deployment

### Create Dockerfile

```dockerfile
FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### Build & Run

```bash
# Build image
docker build -t yieldforge-agent .

# Run container
docker run -p 3000:3000 \
  -e GOOGLE_API_KEY=your_key_here \
  yieldforge-agent
```

### Docker Compose

```yaml
version: '3.8'

services:
  yieldforge:
    build: .
    ports:
      - "3000:3000"
    environment:
      - GOOGLE_API_KEY=${GOOGLE_API_KEY}
      - LLM_MODEL=gemini-2.5-flash
      - NODE_ENV=production
    restart: unless-stopped
```

Run with:
```bash
docker-compose up -d
```

---

## Cloud Platform Deployment

### AWS (Elastic Beanstalk)

1. **Install EB CLI**
```bash
pip install awsebcli
```

2. **Initialize**
```bash
eb init -p node.js yieldforge-agent
```

3. **Create Environment**
```bash
eb create yieldforge-production
```

4. **Set Environment Variables**
```bash
eb setenv GOOGLE_API_KEY=your_key_here
```

5. **Deploy**
```bash
eb deploy
```

### Google Cloud (Cloud Run)

1. **Build Container**
```bash
gcloud builds submit --tag gcr.io/PROJECT_ID/yieldforge-agent
```

2. **Deploy**
```bash
gcloud run deploy yieldforge-agent \
  --image gcr.io/PROJECT_ID/yieldforge-agent \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GOOGLE_API_KEY=your_key_here
```

### Azure (App Service)

1. **Create App Service**
```bash
az webapp create \
  --resource-group myResourceGroup \
  --plan myAppServicePlan \
  --name yieldforge-agent \
  --runtime "NODE|22-lts"
```

2. **Deploy**
```bash
az webapp deployment source config-zip \
  --resource-group myResourceGroup \
  --name yieldforge-agent \
  --src ./build.zip
```

3. **Set Environment Variables**
```bash
az webapp config appsettings set \
  --resource-group myResourceGroup \
  --name yieldforge-agent \
  --settings GOOGLE_API_KEY=your_key_here
```

---

## Performance Optimization

### Next.js Config

```javascript
// next.config.js
module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  
  // Image optimization
  images: {
    domains: ['files.catbox.moe'],
    formats: ['image/avif', 'image/webp'],
  },
  
  // Caching
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ],
}
```

### Environment-Specific Builds

```json
{
  "scripts": {
    "build:dev": "NODE_ENV=development next build",
    "build:staging": "NODE_ENV=staging next build",
    "build:prod": "NODE_ENV=production next build"
  }
}
```

---

## Monitoring & Analytics

### Add Vercel Analytics

```bash
npm install @vercel/analytics
```

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### Error Tracking (Sentry)

```bash
npm install @sentry/nextjs
```

```javascript
// sentry.client.config.js
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
})
```

---

## Security Checklist

- [ ] Environment variables secured
- [ ] API keys not in code
- [ ] HTTPS enabled
- [ ] CORS configured
- [ ] Rate limiting implemented
- [ ] Input validation
- [ ] Error messages sanitized
- [ ] Dependencies updated

---

## Post-Deployment

### 1. Test the Deployment

```bash
# Health check
curl https://your-app.vercel.app/api/agent

# Test agent
curl -X POST https://your-app.vercel.app/api/agent \
  -H "Content-Type: application/json" \
  -d '{"message":"Check Fraxtal status"}'
```

### 2. Monitor Performance

- Check response times
- Monitor error rates
- Track API usage
- Review logs

### 3. Update Documentation

- Add live demo URL to README
- Update HACKATHON_SUBMISSION.md
- Share on Discord/Twitter

---

## Troubleshooting

### Build Fails

```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

### Environment Variables Not Working

- Check variable names (case-sensitive)
- Restart deployment after adding variables
- Verify in deployment logs

### API Errors

- Check GOOGLE_API_KEY is valid
- Verify API quotas not exceeded
- Check network connectivity

### Performance Issues

- Enable caching
- Optimize images
- Use CDN for static assets
- Implement rate limiting

---

## Cost Estimates

### Vercel (Hobby - Free)
- ✅ Free for personal projects
- ✅ 100GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Global CDN

### Railway (Starter - $5/month)
- ✅ 500 hours/month
- ✅ 100GB bandwidth
- ✅ Custom domains
- ✅ Automatic deployments

### AWS (t3.micro - ~$10/month)
- ✅ 750 hours free tier
- ✅ Scalable
- ✅ Full control
- ⚠️ More complex setup

---

## Support

- **Vercel Docs:** https://vercel.com/docs
- **Railway Docs:** https://docs.railway.app
- **Next.js Docs:** https://nextjs.org/docs
- **Discord:** https://discord.gg/w2Uk6ACK4D

---

**Ready to deploy? Choose your platform and go! 🚀**
