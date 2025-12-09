# 🚀 Deploy Smart Contracts Using Remix IDE

## Why Remix?
- ✅ No installation needed (browser-based)
- ✅ Easy to use interface
- ✅ Built-in compiler
- ✅ Direct MetaMask integration
- ✅ Perfect for beginners

## Step-by-Step Guide

### Step 1: Prepare Your Wallet

1. **Install MetaMask**
   - Download from https://metamask.io
   - Create a new wallet or import existing

2. **Add Fraxtal Testnet to MetaMask**
   - Open MetaMask
   - Click Networks → Add Network
   - Enter these details:
     ```
     Network Name: Fraxtal Testnet
     RPC URL: https://rpc.testnet.fraxtal.io
     Chain ID: 2522
     Currency Symbol: frxETH
     Block Explorer: https://explorer.testnet.fraxtal.io
     ```
   - Click "Save"

3. **Get Test frxETH**
   - Visit https://faucet.fraxtal.io
   - Enter your wallet address
   - Click "Request Tokens"
   - Wait 1-2 minutes
   - Check MetaMask balance (should have ~1 frxETH)

### Step 2: Open Remix IDE

1. Go to https://remix.ethereum.org
2. You'll see the Remix interface with:
   - File Explorer (left)
   - Code Editor (center)
   - Compiler/Deploy tabs (right)

### Step 3: Create Contract Files

#### 3.1 Create YieldForgeToken.sol

1. In File Explorer, click "contracts" folder
2. Click the "+" icon to create new file
3. Name it: `YieldForgeToken.sol`
4. Copy and paste this code:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract YieldForgeToken is ERC20, ERC20Burnable, Ownable {
    
    uint256 public constant TOTAL_SUPPLY = 1_000_000_000 * 10**18;
    
    mapping(address => StakeInfo) public stakes;
    uint256 public totalStaked;
    uint256 public rewardRate = 1000; // 10% APY

    struct StakeInfo {
        uint256 amount;
        uint256 startTime;
        uint256 lastClaimTime;
    }

    event TokensStaked(address indexed user, uint256 amount);
    event TokensUnstaked(address indexed user, uint256 amount);
    event RewardsClaimed(address indexed user, uint256 amount);

    constructor() ERC20("YieldForge Token", "YFORGE") Ownable(msg.sender) {
        _mint(msg.sender, TOTAL_SUPPLY);
    }

    function stake(uint256 amount) external {
        require(amount > 0, "Amount must be > 0");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");

        if (stakes[msg.sender].amount > 0) {
            _claimRewards(msg.sender);
        }

        _transfer(msg.sender, address(this), amount);

        stakes[msg.sender].amount += amount;
        stakes[msg.sender].startTime = block.timestamp;
        stakes[msg.sender].lastClaimTime = block.timestamp;
        totalStaked += amount;

        emit TokensStaked(msg.sender, amount);
    }

    function unstake(uint256 amount) external {
        require(amount > 0, "Amount must be > 0");
        require(stakes[msg.sender].amount >= amount, "Insufficient staked");

        _claimRewards(msg.sender);

        stakes[msg.sender].amount -= amount;
        totalStaked -= amount;

        _transfer(address(this), msg.sender, amount);

        emit TokensUnstaked(msg.sender, amount);
    }

    function claimRewards() external {
        require(stakes[msg.sender].amount > 0, "No stake");
        _claimRewards(msg.sender);
    }

    function _claimRewards(address user) internal {
        StakeInfo storage stakeInfo = stakes[user];
        
        uint256 timeStaked = block.timestamp - stakeInfo.lastClaimTime;
        uint256 rewards = (stakeInfo.amount * timeStaked * rewardRate) / (365 days * 10000);

        if (rewards > 0) {
            stakeInfo.lastClaimTime = block.timestamp;
            _mint(user, rewards);
            emit RewardsClaimed(user, rewards);
        }
    }

    function getPendingRewards(address user) external view returns (uint256) {
        StakeInfo memory stakeInfo = stakes[user];
        if (stakeInfo.amount == 0) return 0;

        uint256 timeStaked = block.timestamp - stakeInfo.lastClaimTime;
        return (stakeInfo.amount * timeStaked * rewardRate) / (365 days * 10000);
    }

    function getStakeInfo(address user) external view returns (
        uint256 amount,
        uint256 startTime,
        uint256 pendingRewards
    ) {
        StakeInfo memory stakeInfo = stakes[user];
        uint256 timeStaked = block.timestamp - stakeInfo.lastClaimTime;
        uint256 pending = (stakeInfo.amount * timeStaked * rewardRate) / (365 days * 10000);
        
        return (stakeInfo.amount, stakeInfo.startTime, pending);
    }
}
```

#### 3.2 Create YieldForgeVault.sol

1. Create another new file: `YieldForgeVault.sol`
2. Copy and paste this code:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract YieldForgeVault is Ownable, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    struct UserDeposit {
        uint256 amount;
        uint256 shares;
        uint256 depositTime;
        uint256 lastHarvestTime;
    }

    IERC20 public immutable depositToken;
    mapping(address => UserDeposit) public userDeposits;
    uint256 public totalShares;
    uint256 public totalAssets;
    uint256 public performanceFee = 50; // 0.5%
    address public feeRecipient;

    event Deposit(address indexed user, uint256 amount, uint256 shares);
    event Withdraw(address indexed user, uint256 amount, uint256 shares);

    constructor(
        address _depositToken,
        address _feeRecipient
    ) Ownable(msg.sender) {
        require(_depositToken != address(0), "Invalid token");
        require(_feeRecipient != address(0), "Invalid fee recipient");
        
        depositToken = IERC20(_depositToken);
        feeRecipient = _feeRecipient;
    }

    function deposit(uint256 amount) external nonReentrant whenNotPaused {
        require(amount > 0, "Amount must be > 0");

        uint256 shares = totalShares == 0 
            ? amount 
            : (amount * totalShares) / totalAssets;

        UserDeposit storage userDeposit = userDeposits[msg.sender];
        userDeposit.amount += amount;
        userDeposit.shares += shares;
        userDeposit.depositTime = block.timestamp;
        userDeposit.lastHarvestTime = block.timestamp;

        totalShares += shares;
        totalAssets += amount;

        depositToken.safeTransferFrom(msg.sender, address(this), amount);

        emit Deposit(msg.sender, amount, shares);
    }

    function withdraw(uint256 shares) external nonReentrant {
        UserDeposit storage userDeposit = userDeposits[msg.sender];
        require(shares > 0 && shares <= userDeposit.shares, "Invalid shares");

        uint256 amount = (shares * totalAssets) / totalShares;

        userDeposit.amount -= amount;
        userDeposit.shares -= shares;

        totalShares -= shares;
        totalAssets -= amount;

        depositToken.safeTransfer(msg.sender, amount);

        emit Withdraw(msg.sender, amount, shares);
    }

    function getUserBalance(address user) external view returns (uint256) {
        UserDeposit memory userDeposit = userDeposits[user];
        if (userDeposit.shares == 0) return 0;
        
        return (userDeposit.shares * totalAssets) / totalShares;
    }

    function getVaultStats() external view returns (
        uint256 _totalAssets,
        uint256 _totalShares,
        uint256 _strategyCount,
        uint256 _performanceFee
    ) {
        return (totalAssets, totalShares, 0, performanceFee);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}
```

### Step 4: Compile Contracts

1. Click on "Solidity Compiler" tab (left sidebar, 3rd icon)
2. Select compiler version: `0.8.20`
3. Click "Compile YieldForgeToken.sol"
4. Wait for green checkmark ✅
5. Click "Compile YieldForgeVault.sol"
6. Wait for green checkmark ✅

**If you see errors:**
- Make sure compiler version is 0.8.20
- Check for any typos in the code
- Try clicking "Auto compile" checkbox

### Step 5: Deploy YieldForgeToken

1. Click "Deploy & Run Transactions" tab (left sidebar, 4th icon)
2. In "ENVIRONMENT" dropdown, select **"Injected Provider - MetaMask"**
3. MetaMask popup will appear → Click "Connect"
4. Verify you're on **Fraxtal Testnet** (should show Chain ID: 2522)
5. In "CONTRACT" dropdown, select **"YieldForgeToken"**
6. Click orange **"Deploy"** button
7. MetaMask popup appears → Click "Confirm"
8. Wait 5-10 seconds for deployment
9. You'll see the contract under "Deployed Contracts"
10. **COPY THE CONTRACT ADDRESS** (click copy icon)

**Example:** `0x1234567890abcdef1234567890abcdef12345678`

### Step 6: Deploy YieldForgeVault

1. Still in "Deploy & Run Transactions" tab
2. In "CONTRACT" dropdown, select **"YieldForgeVault"**
3. You'll see constructor parameters:
   - `_DEPOSITTOKEN`: Paste your YieldForgeToken address from Step 5
   - `_FEERECIPIENT`: Paste your wallet address (from MetaMask)
4. Click orange **"Deploy"** button
5. MetaMask popup → Click "Confirm"
6. Wait for deployment
7. **COPY THE VAULT CONTRACT ADDRESS**

### Step 7: Verify Deployment

1. Go to https://explorer.testnet.fraxtal.io
2. Paste your token address in search
3. You should see:
   - Contract creation transaction
   - Token name: "YieldForge Token"
   - Symbol: "YFORGE"
   - Total supply: 1,000,000,000

### Step 8: Add Addresses to Your App

1. Open your `.env` file
2. Add the contract addresses:

```env
NEXT_PUBLIC_YFORGE_TOKEN_ADDRESS=0x1234...  # Your token address
NEXT_PUBLIC_YFORGE_VAULT_ADDRESS=0xabcd...  # Your vault address
```

3. Save the file
4. Restart your app:
```bash
npm run dev
```

### Step 9: Test Your Contracts

#### 9.1 Add Token to MetaMask

1. Open MetaMask
2. Click "Import tokens"
3. Paste your token address
4. Token symbol should auto-fill: YFORGE
5. Click "Add"
6. You should see 1,000,000,000 YFORGE in your wallet!

#### 9.2 Test in Your App

1. Go to http://localhost:3000
2. Connect your wallet
3. Click "Launch App"
4. You should see your Portfolio with:
   - 1B YFORGE balance
   - Staking interface
   - Vault interface

#### 9.3 Test Staking

1. In Portfolio, enter amount (e.g., "1000")
2. Click "Stake"
3. Confirm in MetaMask
4. Wait for confirmation
5. See staked amount update!

## Troubleshooting

### Problem: "Insufficient funds for gas"
**Solution:** Get more frxETH from faucet

### Problem: "Contract deployment failed"
**Solution:** 
- Check you're on Fraxtal Testnet (2522)
- Verify you have enough frxETH
- Try increasing gas limit in MetaMask

### Problem: "Compilation failed"
**Solution:**
- Check compiler version is 0.8.20
- Look for red error messages
- Make sure all code is copied correctly

### Problem: "MetaMask not connecting"
**Solution:**
- Refresh Remix page
- Disconnect and reconnect MetaMask
- Try different browser

## Quick Reference

### Contract Addresses Format
```
Token:  0x1234567890abcdef1234567890abcdef12345678
Vault:  0xabcdef1234567890abcdef1234567890abcdef12
```

### Explorer Links
```
Token:  https://explorer.testnet.fraxtal.io/address/YOUR_TOKEN_ADDRESS
Vault:  https://explorer.testnet.fraxtal.io/address/YOUR_VAULT_ADDRESS
```

### .env Configuration
```env
GOOGLE_API_KEY=your_google_key
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_id
NEXT_PUBLIC_YFORGE_TOKEN_ADDRESS=0x...
NEXT_PUBLIC_YFORGE_VAULT_ADDRESS=0x...
```

## Video Tutorial

**Recommended YouTube Tutorials:**
1. "How to Deploy Smart Contracts with Remix" - Ethereum.org
2. "Remix IDE Tutorial for Beginners" - Dapp University
3. "Deploy ERC20 Token with Remix" - EatTheBlocks

## Next Steps

1. ✅ Deploy contracts on Remix
2. ✅ Copy addresses to .env
3. ✅ Test in your app
4. ✅ Add token to MetaMask
5. ✅ Test staking
6. ✅ Test vault deposits
7. ✅ Record demo video
8. ✅ Submit to hackathon!

## Important Notes

- ⚠️ **Save your contract addresses!** You'll need them
- ⚠️ **Don't lose your private key!** Write it down
- ⚠️ **Test everything on testnet first!**
- ⚠️ **For mainnet, use hardware wallet**

## Resources

- **Remix IDE:** https://remix.ethereum.org
- **Fraxtal Faucet:** https://faucet.fraxtal.io
- **Fraxtal Explorer:** https://explorer.testnet.fraxtal.io
- **MetaMask:** https://metamask.io
- **OpenZeppelin Docs:** https://docs.openzeppelin.com

---

**You're ready to deploy! Follow these steps and you'll have your contracts live in 10 minutes! 🚀**
