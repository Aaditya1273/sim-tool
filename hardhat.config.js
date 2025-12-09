require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    // Fraxtal Testnet (for hackathon)
    fraxtalTestnet: {
      url: process.env.FRAXTAL_RPC_URL || "https://rpc.testnet.frax.com",
      chainId: 2523,
      accounts: process.env.WALLET_PRIVATE_KEY ? [process.env.WALLET_PRIVATE_KEY] : [],
      gasPrice: "auto",
    },
    // Fraxtal Mainnet (for ATP launch)
    fraxtal: {
      url: "https://rpc.fraxtal.io",
      chainId: 252,
      accounts: process.env.WALLET_PRIVATE_KEY ? [process.env.WALLET_PRIVATE_KEY] : [],
      gasPrice: "auto",
    },
    // Localhost for testing
    localhost: {
      url: "http://127.0.0.1:8545",
    },
  },
  etherscan: {
    apiKey: {
      fraxtalTestnet: "no-api-key-needed",
      fraxtal: "no-api-key-needed",
    },
    customChains: [
      {
        network: "fraxtalTestnet",
        chainId: 2522,
        urls: {
          apiURL: "https://api-testnet.fraxscan.com/api",
          browserURL: "https://explorer.testnet.fraxtal.io",
        },
      },
      {
        network: "fraxtal",
        chainId: 252,
        urls: {
          apiURL: "https://api.fraxscan.com/api",
          browserURL: "https://explorer.fraxtal.io",
        },
      },
    ],
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./hardhat/cache",
    artifacts: "./hardhat/artifacts",
  },
};
