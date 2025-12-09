const hre = require("hardhat");
require("dotenv").config();

async function main() {
  console.log("🔍 Checking Deployment Readiness...\n");

  // Check if private key is set
  if (!process.env.WALLET_PRIVATE_KEY) {
    console.log("❌ WALLET_PRIVATE_KEY not found in .env");
    console.log("\n📝 To deploy, you need to:");
    console.log("1. Get test frxETH from: https://faucet.fraxtal.io");
    console.log("2. Export your wallet private key from MetaMask");
    console.log("3. Add it to .env file: WALLET_PRIVATE_KEY=0x...");
    console.log("\n⚠️  NEVER commit your .env file to git!");
    return;
  }

  console.log("✅ Private key found");

  try {
    // Get signer
    const [deployer] = await hre.ethers.getSigners();
    console.log("✅ Wallet address:", deployer.address);

    // Check balance
    const balance = await hre.ethers.provider.getBalance(deployer.address);
    const balanceInEth = hre.ethers.formatEther(balance);
    
    console.log("💰 Balance:", balanceInEth, "frxETH");

    if (parseFloat(balanceInEth) < 0.01) {
      console.log("\n⚠️  Low balance! You need at least 0.01 frxETH to deploy.");
      console.log("Get test tokens from: https://faucet.fraxtal.io");
      return;
    }

    // Check network
    const network = await hre.ethers.provider.getNetwork();
    console.log("✅ Network:", network.name, "Chain ID:", network.chainId.toString());

    if (network.chainId.toString() !== "2522") {
      console.log("\n⚠️  Not connected to Fraxtal Testnet (Chain ID: 2522)");
      return;
    }

    console.log("\n🎉 Ready to deploy!");
    console.log("\nRun: npm run deploy:testnet");

  } catch (error) {
    console.error("\n❌ Error:", error.message);
    console.log("\n🔧 Troubleshooting:");
    console.log("- Check your RPC URL is correct");
    console.log("- Verify your private key format (should start with 0x)");
    console.log("- Make sure you're connected to internet");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
