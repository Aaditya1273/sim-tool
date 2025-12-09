# 🔐 Smart Contract Integration Guide

## Overview

This guide shows you exactly how to deploy smart contracts and integrate them into YieldForge.

## Step 1: Deploy Smart Contracts

### 1.1 Get Test Tokens

1. Visit [Fraxtal Faucet](https://faucet.fraxtal.io)
2. Enter your wallet address
3. Request test frxETH (you need ~0.1 frxETH for deployment)

### 1.2 Configure Environment

Add your wallet private key to `.env`:

```env
# For deployment only - NEVER commit this!
WALLET_PRIVATE_KEY=your_private_key_here
```

**⚠️ Security Warning:** Never share or commit your private key!

### 1.3 Deploy Contracts

```bash
# Compile contracts first
npm run compile

# Deploy to Fraxtal Testnet
npm run deploy:testnet
```

**Expected Output:**
```
🚀 Deploying YieldForge Contracts to Fraxtal Testnet...

✅ YieldForgeToken deployed to: 0x1234...5678
✅ YieldForgeVault deployed to: 0xabcd...ef01

💾 Deployment info saved to deployment-info.json
```

### 1.4 Save Contract Addresses

The deployment script creates `deployment-info.json`:

```json
{
  "contracts": {
    "YieldForgeToken": {
      "address": "0x1234567890abcdef..."
    },
    "YieldForgeVault": {
      "address": "0xabcdef1234567890..."
    }
  }
}
```

## Step 2: Configure Frontend

### 2.1 Add Contract Addresses to .env

Copy the addresses from `deployment-info.json` to `.env`:

```env
# Smart Contract Addresses (from deployment)
NEXT_PUBLIC_YFORGE_TOKEN_ADDRESS=0x1234567890abcdef...
NEXT_PUBLIC_YFORGE_VAULT_ADDRESS=0xabcdef1234567890...
```

### 2.2 Restart the App

```bash
# Stop the current process (Ctrl+C)
# Then restart
npm run dev
```

## Step 3: How Contracts Are Used

### 3.1 Contract Hooks (`lib/contracts.ts`)

The app uses custom React hooks to interact with contracts:

```typescript
// Read token balance
const { data: balance } = useTokenBalance(address);

// Read staking info
const { data: stakeInfo } = useStakeInfo(address);

// Stake tokens
const { stake, isPending } = useStakeTokens();
stake('100'); // Stake 100 YFORGE

// Deposit to vault
const { deposit } = useDepositToVault();
deposit('50'); // Deposit 50 YFORGE
```

### 3.2 Portfolio Component (`components/Portfolio.tsx`)

Shows user's:
- $YFORGE token balance
- Staked amount and rewards
- Vault deposits
- Contract addresses with explorer links

### 3.3 Where Contracts Are Used

**1. Portfolio Dashboard**
- Displays token balances
- Shows staking rewards
- Vault deposit interface

**2. AI Agent Integration**
- Agent can check user's balance
- Recommend staking strategies
- Simulate vault deposits

**3. Transaction Execution**
- Stake tokens (10% APY)
- Deposit to yield vault
- Claim rewards
- Withdraw funds

## Step 4: User Flow with Contracts

### Flow 1: Staking $YFORGE

```
1. User connects wallet (RainbowKit)
2. User sees $YFORGE balance in Portfolio
3. User enters amount to stake
4. Clicks "Stake" button
5. MetaMask popup appears
6. User confirms transaction
7. Transaction processes on Fraxtal
8. Balance updates automatically
9. Rewards start accumulating (10% APY)
```

### Flow 2: Depositing to Vault

```
1. User has $YFORGE tokens
2. User enters deposit amount
3. Clicks "Approve" (allows vault to spend tokens)
4. Confirms approval transaction
5. Clicks "Deposit"
6. Confirms deposit transaction
7. Tokens deposited to vault
8. Yield optimization begins
9. User earns performance fees
```

## Step 5: Testing Contracts

### 5.1 Get Test Tokens

After deployment, you need test $YFORGE tokens:

```bash
# Using Hardhat console
npx hardhat console --network fraxtalTestnet

# In console:
const Token = await ethers.getContractFactory("YieldForgeToken");
const token = await Token.attach("YOUR_TOKEN_ADDRESS");

// Transfer tokens to your wallet
await token.transfer("YOUR_WALLET_ADDRESS", ethers.parseEther("1000"));
```

### 5.2 Test Staking

1. Go to Portfolio section
2. Enter amount (e.g., "100")
3. Click "Stake"
4. Confirm in MetaMask
5. Wait for confirmation
6. See staked amount update

### 5.3 Test Vault Deposit

1. Enter deposit amount
2. Click "Approve" first
3. Confirm approval
4. Click "Deposit"
5. Confirm deposit
6. See vault balance update

## Step 6: Verify on Explorer

### View Your Contracts

**Token Contract:**
```
https://explorer.testnet.fraxtal.io/address/YOUR_TOKEN_ADDRESS
```

**Vault Contract:**
```
https://explorer.testnet.fraxtal.io/address/YOUR_VAULT_ADDRESS
```

### View Transactions

All transactions appear in:
- Fraxtal Explorer
- Your wallet history
- Portfolio component

## Step 7: Add Portfolio to Chat Interface

Update `app/page.tsx` to include Portfolio:

```typescript
import { Portfolio } from '@/components/Portfolio';

function ChatInterface() {
  const [showPortfolio, setShowPortfolio] = useState(false);
  
  return (
    <div className={styles.chatPage}>
      <div className={styles.chatHeader}>
        <div className={styles.chatLogo}>
          <span className={styles.logoIcon}>🔥</span>
          <span className={styles.logoText}>YieldForge AI</span>
        </div>
        <button onClick={() => setShowPortfolio(!showPortfolio)}>
          {showPortfolio ? 'Chat' : 'Portfolio'}
        </button>
        <ConnectButton />
      </div>

      {showPortfolio ? (
        <Portfolio />
      ) : (
        // ... existing chat interface
      )}
    </div>
  );
}
```

## Step 8: AI Agent Integration

The AI agent can interact with contracts:

```typescript
// In app/api/agent/route.ts
import { CONTRACTS } from '@/lib/contracts';

// Agent can check balances
const balance = await publicClient.readContract({
  address: CONTRACTS.YFORGE_TOKEN,
  abi: YFORGE_TOKEN_ABI,
  functionName: 'balanceOf',
  args: [userAddress],
});

// Agent can recommend actions
if (balance > parseEther('100')) {
  return "You have 100+ YFORGE! Consider staking for 10% APY.";
}
```

## Troubleshooting

### Contract Not Deployed Error

**Problem:** App shows "Contracts Not Deployed" warning

**Solution:**
1. Check `.env` has contract addresses
2. Verify addresses are correct (0x...)
3. Restart the app after adding addresses

### Transaction Fails

**Problem:** Transaction reverts or fails

**Solutions:**
1. Check you have enough frxETH for gas
2. Verify you have enough $YFORGE tokens
3. For vault deposits, approve first
4. Check network is Fraxtal Testnet (2522)

### Balance Not Updating

**Problem:** Balance doesn't update after transaction

**Solutions:**
1. Wait for transaction confirmation (~5 seconds)
2. Refresh the page
3. Check transaction on explorer
4. Verify wallet is still connected

## Security Best Practices

### ✅ DO:
- Keep private keys in `.env` (never commit)
- Test on testnet first
- Verify contract addresses
- Check transactions on explorer
- Use hardware wallet for mainnet

### ❌ DON'T:
- Share private keys
- Commit `.env` to git
- Deploy without testing
- Skip approval step
- Use same key for mainnet and testnet

## Contract Addresses Reference

After deployment, your addresses will be:

```env
# Fraxtal Testnet
NEXT_PUBLIC_YFORGE_TOKEN_ADDRESS=0x...
NEXT_PUBLIC_YFORGE_VAULT_ADDRESS=0x...

# Fraxtal Mainnet (for ATP launch)
# NEXT_PUBLIC_YFORGE_TOKEN_ADDRESS_MAINNET=0x...
# NEXT_PUBLIC_YFORGE_VAULT_ADDRESS_MAINNET=0x...
```

## Next Steps

1. ✅ Deploy contracts to testnet
2. ✅ Add addresses to `.env`
3. ✅ Test staking functionality
4. ✅ Test vault deposits
5. ✅ Integrate with AI agent
6. ✅ Record demo video
7. ✅ Deploy to mainnet for ATP launch

## Resources

- **Fraxtal Faucet:** https://faucet.fraxtal.io
- **Fraxtal Explorer:** https://explorer.testnet.fraxtal.io
- **Hardhat Docs:** https://hardhat.org/docs
- **Wagmi Docs:** https://wagmi.sh/

---

**Your smart contracts are now fully integrated with YieldForge! 🔥**
