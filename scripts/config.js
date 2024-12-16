const config = {
  testnet: {
    chainId: 84532,
    rpc: "https://sepolia.base.org",
    pairs: [
      {
        id: "BTC-USDC",
        priceFeed: "0x6550bc2301936011c1334555e62A87705A81C12C",
        minBet: "1000000", // 1 USDC (6 decimals)
        maxBet: "500000000" // 500 USDC
      }
    ]
  },
  mainnet: {
    chainId: 8453,
    rpc: "https://mainnet.base.org",
    pairs: [
      {
        id: "BTC-USDC",
        priceFeed: "0x6550bc2301936011c1334555e62A87705A81C12C",
        minBet: "1000000", // 1 USDC
        maxBet: "500000000" // 500 USDC
      }
    ]
  }
}

module.exports = config; 