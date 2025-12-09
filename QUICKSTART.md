# 🚀 YieldForge - Quick Start Guide

## ⚡ 5-Minute Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```

Edit `.env` and add your Google AI API key:
```env
GOOGLE_API_KEY=your_key_here
```

Get your key: https://aistudio.google.com/api-keys

### 3. Run the Application
```bash
# Next.js web app (recommended)
npm run dev
```

Opens at: http://localhost:3000

**Alternative: Use ADK CLI**
```bash
npm run agent:dev  # ADK web interface
npm run agent:cli  # Terminal chat
```

### 4. Try These Commands

**Conservative Investor:**
```
I want to earn yield on $1000 USDC with minimal risk
```

**Aggressive Trader:**
```
Show me the highest APY pools, I'm okay with risk
```

**Korean User:**
```
Can I earn yield in Korean Won (KRWQ)?
```

**Check Fraxtal:**
```
Check Fraxtal testnet status
```

---

## 🎥 Demo Video Checklist

- [ ] Record 5-minute demo
- [ ] Show problem (manual yield farming)
- [ ] Demo YieldForge conversation
- [ ] Highlight multi-agent architecture
- [ ] Show Frax/KRWQ integration
- [ ] Explain ATP tokenization
- [ ] Upload to YouTube
- [ ] Add link to submission

---

## 📋 Submission Checklist

- [ ] GitHub repo public
- [ ] README.md complete
- [ ] Demo video uploaded
- [ ] Live demo link working
- [ ] ADK-TS usage explained
- [ ] .env.example included
- [ ] Code documented
- [ ] ATP launch plan ready

---

## 🔗 Quick Links

- **Demo**: https://adk-web.iqai.com
- **GitHub**: https://github.com/IQAIcom/adk-ts-samples
- **Discord**: https://discord.gg/w2Uk6ACK4D
- **Fraxtal Faucet**: https://faucet.fraxtal.io
- **ATP Platform**: https://iqai.com

---

## 🆘 Troubleshooting

**Agent won't start?**
- Check GOOGLE_API_KEY in .env
- Run `pnpm install` again
- Try `pnpm dev:cli` instead

**No DeFi data?**
- DeFiLlama API is free, no auth needed
- Check internet connection
- API may be rate-limited (wait 1 min)

**Fraxtal not connecting?**
- Add WALLET_PRIVATE_KEY to .env
- Get test frxETH from faucet
- Verify RPC URL is accessible

---

## 💡 Pro Tips

1. **Highlight Sponsors**: Always mention Frax Finance and KRWQ in demos
2. **Show Multi-Agent**: Explain how 3 sub-agents work together
3. **Emphasize Safety**: This is simulation-only, no real trades
4. **Korean Market**: EwhaChain community loves KRWQ integration
5. **ATP Ready**: Explain $YFORGE tokenomics to judges

---

**Good luck! 🏆**
