require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: process.env.NET ? `.env.${process.env.NET}` : '.env.testnet' });

const config = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    baseTestnet: {
      url: process.env.NODE_URL || "https://sepolia.base.org",
      accounts: [process.env.PRIVATE_KEY],
      chainId: Number(process.env.CHAIN_ID) || 84532,
    },
    baseMainnet: {
      url: process.env.NODE_URL || "https://mainnet.base.org",
      accounts: [process.env.PRIVATE_KEY],
      chainId: Number(process.env.CHAIN_ID) || 8453,
    }
  },
  etherscan: {
    apiKey: {
      baseTestnet: process.env.BASESCAN_API_KEY,
      baseMainnet: process.env.BASESCAN_API_KEY
    },
    customChains: [
      {
        network: "baseTestnet",
        chainId: 84532,
        urls: {
          apiURL: "https://api-sepolia.basescan.org/api",
          browserURL: "https://sepolia.basescan.org"
        }
      },
      {
        network: "baseMainnet",
        chainId: 8453,
        urls: {
          apiURL: "https://api.basescan.org/api",
          browserURL: "https://basescan.org"
        }
      }
    ]
  }
};

module.exports = config; 