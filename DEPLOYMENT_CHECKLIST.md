# ✅ Smart Contract Deployment Checklist

## Before You Start

- [ ] MetaMask installed
- [ ] Fraxtal Testnet added to MetaMask
- [ ] Test frxETH in wallet (from https://faucet.fraxtal.io)
- [ ] Remix IDE open (https://remix.ethereum.org)

## Deployment Steps

### 1. Prepare Contracts
- [ ] Create `YieldForgeToken.sol` in Remix
- [ ] Create `YieldForgeVault.sol` in Remix
- [ ] Copy code from `REMIX_DEPLOYMENT_GUIDE.md`

### 2. Compile
- [ ] Select compiler version 0.8.20
- [ ] Compile YieldForgeToken ✅
- [ ] Compile YieldForgeVault ✅
- [ ] No errors shown

### 3. Deploy Token
- [ ] Select "Injected Provider - MetaMask"
- [ ] Connect MetaMask
- [ ] Verify Fraxtal Testnet (Chain ID: 2522)
- [ ] Select "YieldForgeToken" contract
- [ ] Click "Deploy"
- [ ] Confirm in MetaMask
- [ ] Wait for confirmation
- [ ] **Copy token address:** `0x________________`

### 4. Deploy Vault
- [ ] Select "YieldForgeVault" contract
- [ ] Enter token address in `_DEPOSITTOKEN`
- [ ] Enter your wallet address in `_FEERECIPIENT`
- [ ] Click "Deploy"
- [ ] Confirm in MetaMask
- [ ] Wait for confirmation
- [ ] **Copy vault address:** `0x________________`

### 5. Verify on Explorer
- [ ] Visit https://explorer.testnet.fraxtal.io
- [ ] Search for token address
- [ ] Verify contract is deployed
- [ ] Search for vault address
- [ ] Verify contract is deployed

### 6. Configure App
- [ ] Open `.env` file
- [ ] Add `NEXT_PUBLIC_YFORGE_TOKEN_ADDRESS=0x...`
- [ ] Add `NEXT_PUBLIC_YFORGE_VAULT_ADDRESS=0x...`
- [ ] Save file
- [ ] Restart app: `npm run dev`

### 7. Add Token to MetaMask
- [ ] Open MetaMask
- [ ] Click "Import tokens"
- [ ] Paste token address
- [ ] Verify symbol shows "YFORGE"
- [ ] Click "Add"
- [ ] See 1,000,000,000 YFORGE balance

### 8. Test in App
- [ ] Go to http://localhost:3000
- [ ] Connect wallet
- [ ] Click "Launch App"
- [ ] See Portfolio with balance
- [ ] Test staking (enter amount, click Stake)
- [ ] Confirm transaction
- [ ] See staked amount update

## Contract Addresses

**Save these addresses!**

```
YieldForge Token:  0x________________________________
YieldForge Vault:  0x________________________________

Deployer Address:  0x________________________________
Network:           Fraxtal Testnet (2522)
Block Explorer:    https://explorer.testnet.fraxtal.io
```

## Explorer Links

```
Token Contract:
https://explorer.testnet.fraxtal.io/address/YOUR_TOKEN_ADDRESS

Vault Contract:
https://explorer.testnet.fraxtal.io/address/YOUR_VAULT_ADDRESS
```

## .env Configuration

```env
# LLM
GOOGLE_API_KEY=your_google_key_here

# WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here

# Smart Contracts (ADD THESE AFTER DEPLOYMENT)
NEXT_PUBLIC_YFORGE_TOKEN_ADDRESS=0x...
NEXT_PUBLIC_YFORGE_VAULT_ADDRESS=0x...
```

## Troubleshooting

### ❌ Deployment Failed
- Check you have frxETH for gas
- Verify you're on Fraxtal Testnet
- Try increasing gas limit

### ❌ Contract Not Showing in App
- Verify addresses in .env are correct
- Check addresses start with 0x
- Restart the app after adding addresses

### ❌ Can't See Token Balance
- Add token to MetaMask manually
- Check you're on correct network
- Verify token address is correct

### ❌ Staking Not Working
- Approve tokens first (if needed)
- Check you have enough balance
- Verify transaction on explorer

## Success Criteria

✅ Both contracts deployed
✅ Addresses added to .env
✅ Token visible in MetaMask
✅ Portfolio shows balance
✅ Can stake tokens
✅ Transactions confirm on explorer

## Next Steps After Deployment

1. [ ] Test all features
2. [ ] Record demo video
3. [ ] Take screenshots
4. [ ] Update README with contract addresses
5. [ ] Deploy to Vercel/production
6. [ ] Submit to hackathon
7. [ ] Launch on ATP (mainnet)

## Time Estimate

- Setup MetaMask & Faucet: 5 minutes
- Create contracts in Remix: 5 minutes
- Compile contracts: 2 minutes
- Deploy contracts: 5 minutes
- Configure app: 3 minutes
- Test functionality: 5 minutes

**Total: ~25 minutes** ⏱️

## Resources

- **Remix:** https://remix.ethereum.org
- **Faucet:** https://faucet.fraxtal.io
- **Explorer:** https://explorer.testnet.fraxtal.io
- **Guide:** See `REMIX_DEPLOYMENT_GUIDE.md`

---

**Follow this checklist and you'll have your contracts deployed in 25 minutes! 🚀**

**Current Status:** [ ] Not Started | [ ] In Progress | [ ] Complete ✅
