# 🚀 YieldForge Setup Guide

## Prerequisites

- **Node.js 18+** (22+ recommended)
- **npm 9+** (comes with Node.js)
- **Google AI API Key** (Gemini)

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env
# Edit .env and add your GOOGLE_API_KEY

# 3. Run the app
npm run dev

# 4. Open browser
# http://localhost:3000
```

## Detailed Setup

### 1. Get Google AI API Key

1. Visit [Google AI Studio](https://aistudio.google.com/api-keys)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key

### 2. Configure Environment

Create `.env` file:

```env
# Required
GOOGLE_API_KEY=your_google_api_key_here
LLM_MODEL=gemini-2.5-flash

# Optional - For Fraxtal testnet integration
# WALLET_PRIVATE_KEY=your_wallet_private_key_here
FRAXTAL_RPC_URL=https://rpc.testnet.fraxtal.io
FRAXTAL_CHAIN_ID=2522
FRAXTAL_EXPLORER=https://explorer.testnet.fraxtal.io
```

### 3. Install Dependencies

```bash
npm install
```

This installs:
- Next.js 15 (React framework)
- ADK-TS (AI agent framework)
- Ethers.js & Viem (blockchain libraries)
- Axios (HTTP client)
- Zod (validation)

### 4. Run the Application

**Option A: Next.js Web App (Recommended)**
```bash
npm run dev
```
- Opens at: `http://localhost:3000`
- Full-featured web interface
- Chat with YieldForge agent
- View DeFi opportunities

**Option B: ADK CLI**
```bash
# Web interface
npm run agent:dev

# Terminal chat
npm run agent:cli

# Test agent
npm run agent:test
```

### 5. Build for Production

```bash
npm run build
npm start
```

## Optional: Fraxtal Testnet Setup

### Add Fraxtal to MetaMask

1. Open MetaMask
2. Click Networks → Add Network
3. Enter details:
   - **Network Name:** Fraxtal Testnet
   - **RPC URL:** https://rpc.testnet.fraxtal.io
   - **Chain ID:** 2522
   - **Currency:** frxETH
   - **Explorer:** https://explorer.testnet.fraxtal.io

### Get Test Tokens

1. Visit [Fraxtal Faucet](https://faucet.fraxtal.io)
2. Enter your wallet address
3. Request frxETH test tokens

### Configure Wallet in App

1. Export private key from MetaMask
2. Add to `.env`:
   ```env
   WALLET_PRIVATE_KEY=your_private_key_here
   ```
3. Restart the app
4. Use "Check Fraxtal status" command

## Troubleshooting

### Agent won't start?
- ✅ Check `GOOGLE_API_KEY` in `.env`
- ✅ Run `npm install` again
- ✅ Verify Node.js version: `node --version` (should be 18+)

### No DeFi data?
- ✅ DeFiLlama API is free, no auth needed
- ✅ Check internet connection
- ✅ API may be rate-limited (wait 1 minute)

### Fraxtal not connecting?
- ✅ Add `WALLET_PRIVATE_KEY` to `.env`
- ✅ Get test frxETH from faucet
- ✅ Verify RPC URL is accessible

### Build errors?
- ✅ Delete `node_modules` and `.next` folders
- ✅ Run `npm install` again
- ✅ Check TypeScript errors: `npm run lint`

## Project Structure

```
yieldforge-agent/
├── app/                          # Next.js 15 app directory
│   ├── api/agent/route.ts       # Agent API endpoint
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page (chat interface)
│   └── globals.css              # Global styles
├── src/                         # Agent source code
│   ├── agents/yieldforge-agent/ # Main agent
│   │   ├── agent.ts            # Agent orchestrator
│   │   ├── tools.ts            # 6 DeFi tools
│   │   └── sub-agents/         # 3 specialized agents
│   ├── utils/blockchain.ts     # Fraxtal integration
│   ├── env.ts                  # Environment config
│   └── index.ts                # Agent entry point
├── public/                      # Static assets
├── components/                  # React components (future)
├── .env.example                 # Environment template
├── next.config.js              # Next.js config
├── tsconfig.json               # TypeScript config
├── package.json                # Dependencies
└── README.md                   # Documentation
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js dev server (port 3000) |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run agent:dev` | Start ADK web interface |
| `npm run agent:cli` | Start ADK CLI chat |
| `npm run agent:test` | Test agent initialization |

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GOOGLE_API_KEY` | ✅ Yes | - | Google AI API key for Gemini |
| `LLM_MODEL` | No | `gemini-2.5-flash` | LLM model to use |
| `ADK_DEBUG` | No | `false` | Enable debug logging |
| `WALLET_PRIVATE_KEY` | No | - | Wallet for Fraxtal testnet |
| `FRAXTAL_RPC_URL` | No | `https://rpc.testnet.fraxtal.io` | Fraxtal RPC endpoint |
| `FRAXTAL_CHAIN_ID` | No | `2522` | Fraxtal chain ID |
| `FRAXTAL_EXPLORER` | No | `https://explorer.testnet.fraxtal.io` | Block explorer |

## Next Steps

1. ✅ Complete setup
2. ✅ Test the agent with sample queries
3. ✅ Record demo video (5 minutes)
4. ✅ Deploy to Vercel/Railway (optional)
5. ✅ Submit to AGENT ARENA hackathon
6. ✅ Launch on ATP by Dec 12

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [ADK-TS Docs](https://adk.iqai.com/)
- [Fraxtal Docs](https://docs.frax.com/)
- [Google AI Studio](https://aistudio.google.com/)

## Support

- **Discord:** [IQAI Community](https://discord.gg/w2Uk6ACK4D)
- **GitHub:** [Issues](https://github.com/IQAIcom/adk-ts-samples/issues)
- **Docs:** [ADK-TS Documentation](https://adk.iqai.com/)

---

**Ready to optimize DeFi yields? Let's go! 🔥**
