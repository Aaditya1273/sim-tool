# 🔐 YieldForge Smart Contracts

## Overview

YieldForge includes two main smart contracts deployed on Fraxtal:

1. **YieldForgeToken ($YFORGE)** - ERC20 governance token
2. **YieldForgeVault** - Main vault for yield optimization

## Contracts

### 1. YieldForgeToken ($YFORGE)

**Location:** `contracts/YieldForge/YieldForgeToken.sol`

**Features:**
- ERC20 token with 1 billion total supply
- Staking mechanism (10% APY)
- Vesting schedules for team/advisors
- Burnable for deflationary tokenomics
- Reward distribution system

**Token Distribution:**
- Team: 200M (20%)
- Community: 300M (30%)
- Liquidity: 200M (20%)
- Treasury: 300M (30%)

**Key Functions:**
```solidity
// Staking
stake(uint256 amount)
unstake(uint256 amount)
claimRewards()

// Vesting
createVestingSchedule(address beneficiary, uint256 amount, uint256 duration)
releaseVestedTokens()

// View
getPendingRewards(address user)
getStakeInfo(address user)
```

### 2. YieldForgeVault

**Location:** `contracts/YieldForge/YieldForgeVault.sol`

**Features:**
- Multi-strategy yield optimization
- Automated harvesting
- Performance fee collection (0.5%)
- Emergency pause functionality
- Share-based accounting

**Key Functions:**
```solidity
// User Operations
deposit(uint256 amount)
withdraw(uint256 shares)
harvest(address user)

// Admin Operations
addStrategy(address strategyAddress, uint256 allocation)
updateStrategyAllocation(uint256 strategyId, uint256 newAllocation)
setPerformanceFee(uint256 newFee)

// View
getUserBalance(address user)
getVaultStats()
```

## Deployment

### Prerequisites

1. **Fraxtal Testnet Setup**
   - Add Fraxtal Testnet to MetaMask
   - Get test frxETH from faucet: https://faucet.fraxtal.io

2. **Environment Configuration**
   ```env
   WALLET_PRIVATE_KEY=your_private_key_here
   FRAXTAL_RPC_URL=https://rpc.testnet.fraxtal.io
   ```

### Compile Contracts

```bash
npm run compile
```

This compiles all Solidity contracts and generates artifacts in `hardhat/artifacts/`.

### Deploy to Fraxtal Testnet

```bash
npm run deploy:testnet
```

**Expected Output:**
```
🚀 Deploying YieldForge Contracts to Fraxtal Testnet...

📝 Deploying contracts with account: 0x...
💰 Account balance: 1.5 frxETH

1️⃣  Deploying YieldForgeToken ($YFORGE)...
✅ YieldForgeToken deployed to: 0x...
   Total Supply: 1000000000.0 YFORGE

2️⃣  Deploying YieldForgeVault...
✅ YieldForgeVault deployed to: 0x...
   Deposit Token: 0x...
   Fee Recipient: 0x...

3️⃣  Approving vault to spend tokens...
✅ Approved 1000000.0 YFORGE for vault

🎉 DEPLOYMENT COMPLETE!
```

### Deploy to Fraxtal Mainnet (ATP Launch)

```bash
npm run deploy:mainnet
```

**Note:** Requires real frxETH for gas fees (~$10 worth)

## Deployment Info

After deployment, contract addresses are saved to `deployment-info.json`:

```json
{
  "network": "fraxtalTestnet",
  "chainId": "2522",
  "deployer": "0x...",
  "timestamp": "2025-12-09T...",
  "contracts": {
    "YieldForgeToken": {
      "address": "0x...",
      "totalSupply": "1000000000000000000000000000"
    },
    "YieldForgeVault": {
      "address": "0x...",
      "depositToken": "0x...",
      "feeRecipient": "0x..."
    }
  }
}
```

## Verification

### Verify on Fraxtal Explorer

```bash
npx hardhat verify --network fraxtalTestnet <CONTRACT_ADDRESS>
```

### Manual Verification

1. Go to https://explorer.testnet.fraxtal.io
2. Search for your contract address
3. Click "Contract" tab
4. Click "Verify and Publish"
5. Upload contract source code

## Testing

### Run Contract Tests

```bash
npm run test:contracts
```

### Manual Testing with Hardhat Console

```bash
npx hardhat console --network fraxtalTestnet
```

```javascript
// Get contract instances
const Token = await ethers.getContractFactory("YieldForgeToken");
const token = await Token.attach("0x...");

// Check balance
const balance = await token.balanceOf("0x...");
console.log(ethers.formatEther(balance));

// Stake tokens
await token.stake(ethers.parseEther("1000"));

// Check pending rewards
const rewards = await token.getPendingRewards("0x...");
console.log(ethers.formatEther(rewards));
```

## Integration with Next.js

### Add Contract Addresses to .env

```env
NEXT_PUBLIC_YFORGE_TOKEN_ADDRESS=0x...
NEXT_PUBLIC_YFORGE_VAULT_ADDRESS=0x...
NEXT_PUBLIC_CHAIN_ID=2522
```

### Use in Frontend

```typescript
import { ethers } from 'ethers';

// Contract ABIs (from hardhat/artifacts)
import TokenABI from './hardhat/artifacts/contracts/YieldForge/YieldForgeToken.sol/YieldForgeToken.json';
import VaultABI from './hardhat/artifacts/contracts/YieldForge/YieldForgeVault.sol/YieldForgeVault.json';

// Connect to contracts
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();

const token = new ethers.Contract(
  process.env.NEXT_PUBLIC_YFORGE_TOKEN_ADDRESS!,
  TokenABI.abi,
  signer
);

const vault = new ethers.Contract(
  process.env.NEXT_PUBLIC_YFORGE_VAULT_ADDRESS!,
  VaultABI.abi,
  signer
);

// Deposit to vault
const amount = ethers.parseEther("100");
await token.approve(vault.address, amount);
await vault.deposit(amount);
```

## Security Considerations

### Auditing

Before mainnet deployment:
- [ ] Get professional smart contract audit
- [ ] Run static analysis tools (Slither, Mythril)
- [ ] Conduct thorough testing
- [ ] Implement timelock for admin functions

### Best Practices

1. **Never share private keys**
2. **Use hardware wallet for mainnet**
3. **Test thoroughly on testnet first**
4. **Implement emergency pause**
5. **Set reasonable fee limits**
6. **Monitor contract events**

## Gas Optimization

Current gas estimates (Fraxtal Testnet):

| Operation | Gas Used | Cost (at 0.1 gwei) |
|-----------|----------|-------------------|
| Deploy Token | ~2.5M | ~$0.25 |
| Deploy Vault | ~3.0M | ~$0.30 |
| Deposit | ~150K | ~$0.015 |
| Withdraw | ~120K | ~$0.012 |
| Harvest | ~100K | ~$0.010 |
| Stake | ~80K | ~$0.008 |

## Troubleshooting

### Compilation Errors

```bash
# Clear cache and recompile
rm -rf hardhat/cache hardhat/artifacts
npm run compile
```

### Deployment Fails

- Check wallet has enough frxETH
- Verify RPC URL is correct
- Ensure private key is valid
- Check network connectivity

### Transaction Reverts

- Check token approvals
- Verify sufficient balance
- Ensure contract is not paused
- Review error messages in explorer

## Resources

- **Fraxtal Docs:** https://docs.frax.com/
- **Hardhat Docs:** https://hardhat.org/docs
- **OpenZeppelin:** https://docs.openzeppelin.com/
- **Ethers.js:** https://docs.ethers.org/

## Next Steps

1. ✅ Compile contracts
2. ✅ Deploy to testnet
3. [ ] Test all functions
4. [ ] Integrate with frontend
5. [ ] Get security audit
6. [ ] Deploy to mainnet
7. [ ] Launch on ATP

---

**Smart contracts are the foundation of YieldForge's on-chain yield optimization! 🔐**
