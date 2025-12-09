# 🚀 Vercel Deployment Guide

## Quick Deploy to Vercel

### 1. Push to GitHub
```bash
git add .
git commit -m "Fix: Remove .js extensions for Next.js compatibility"
git push origin main
```

### 2. Vercel Settings

**Build Settings:**
- Build Command: `npm run build`
- Output Directory: `.next` (Next.js default)
- Install Command: `npm install`

**Environment Variables (Required):**
```
GOOGLE_API_KEY=AIzaSyCqYwivJtXpATLz0SfgBKQ03T7k2eZRBwk
LLM_MODEL=gemini-2.5-flash
```

**Environment Variables (Optional):**
```
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
FRAXTAL_RPC_URL=https://rpc.testnet.frax.com
FRAXTAL_CHAIN_ID=2523
```

### 3. Deploy
Click "Deploy" and wait for build to complete (~3-5 minutes)

## What Works Without Smart Contracts

✅ **AI Agent** - Fully functional with Gemini  
✅ **Yield Scanning** - Real-time data from DeFiLlama (50+ protocols)  
✅ **Risk Analysis** - Personalized recommendations  
✅ **Harvest Simulation** - Return projections  
✅ **Frax Integration** - Sponsor protocol support  
✅ **KRWQ Support** - Korean market features  

## Demo Mode

The app runs in demo mode without deployed smart contracts. Users can:
- Chat with the AI agent
- Get yield recommendations
- Analyze risk profiles
- Simulate harvest strategies
- View Frax Finance pools

## After Deployment

Your YieldForge app will be live at: `https://your-project.vercel.app`

Test the AI agent by asking:
- "I want to earn yield on $1000 USDC with minimal risk"
- "Show me the highest APY pools"
- "Can I earn yield in Korean Won (KRWQ)?"

## Troubleshooting

**Build fails?**
- Check environment variables are set correctly
- Ensure GOOGLE_API_KEY is valid
- Try redeploying

**Agent not responding?**
- Verify GOOGLE_API_KEY in Vercel dashboard
- Check browser console for errors
- Test API endpoint: `https://your-app.vercel.app/api/agent` (GET request)

## For Hackathon Judges

This is a **working demo** of YieldForge's AI-powered DeFi yield optimizer:
- Multi-agent architecture with ADK-TS
- Real-time DeFi data integration
- Frax Finance & KRWQ sponsor integration
- Production-ready Next.js 15 app
- Smart contracts ready for Fraxtal deployment

🔥 **Try it live and see the AI in action!**
