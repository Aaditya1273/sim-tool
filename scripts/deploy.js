const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying YieldForge Contracts to Fraxtal Testnet...\n");

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "FRAX\n");

  // Deploy YieldForgeToken ($YFORGE)
  console.log("1️⃣  Deploying YieldForgeToken ($YFORGE)...");
  const YieldForgeToken = await hre.ethers.getContractFactory("YieldForgeToken");
  const token = await YieldForgeToken.deploy();
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("✅ YieldForgeToken deployed to:", tokenAddress);
  console.log("   Total Supply:", hre.ethers.formatEther(await token.totalSupply()), "YFORGE\n");

  // Deploy YieldForgeVault
  console.log("2️⃣  Deploying YieldForgeVault...");
  const YieldForgeVault = await hre.ethers.getContractFactory("YieldForgeVault");
  const vault = await YieldForgeVault.deploy(
    tokenAddress, // Use YFORGE as deposit token for demo
    deployer.address // Fee recipient
  );
  await vault.waitForDeployment();
  const vaultAddress = await vault.getAddress();
  console.log("✅ YieldForgeVault deployed to:", vaultAddress);
  console.log("   Deposit Token:", tokenAddress);
  console.log("   Fee Recipient:", deployer.address, "\n");

  // Approve vault to spend tokens (for testing)
  console.log("3️⃣  Approving vault to spend tokens...");
  const approveAmount = hre.ethers.parseEther("1000000"); // 1M tokens
  const approveTx = await token.approve(vaultAddress, approveAmount);
  await approveTx.wait();
  console.log("✅ Approved", hre.ethers.formatEther(approveAmount), "YFORGE for vault\n");

  // Summary
  console.log("=" .repeat(60));
  console.log("🎉 DEPLOYMENT COMPLETE!");
  console.log("=" .repeat(60));
  console.log("\n📋 Contract Addresses:");
  console.log("   YieldForgeToken ($YFORGE):", tokenAddress);
  console.log("   YieldForgeVault:", vaultAddress);
  console.log("\n🔗 Fraxtal Testnet Explorer:");
  console.log("   Token:", `https://explorer.testnet.fraxtal.io/address/${tokenAddress}`);
  console.log("   Vault:", `https://explorer.testnet.fraxtal.io/address/${vaultAddress}`);
  console.log("\n💡 Next Steps:");
  console.log("   1. Verify contracts on explorer");
  console.log("   2. Add contract addresses to .env");
  console.log("   3. Test deposit/withdraw functions");
  console.log("   4. Integrate with Next.js frontend");
  console.log("   5. Launch on ATP for tokenization");
  console.log("\n🔥 YieldForge is ready to optimize yields!");
  console.log("=" .repeat(60));

  // Save deployment info
  const fs = require("fs");
  const deploymentInfo = {
    network: hre.network.name,
    chainId: (await hre.ethers.provider.getNetwork()).chainId.toString(),
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      YieldForgeToken: {
        address: tokenAddress,
        totalSupply: (await token.totalSupply()).toString(),
      },
      YieldForgeVault: {
        address: vaultAddress,
        depositToken: tokenAddress,
        feeRecipient: deployer.address,
      },
    },
  };

  fs.writeFileSync(
    "deployment-info.json",
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log("\n💾 Deployment info saved to deployment-info.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
