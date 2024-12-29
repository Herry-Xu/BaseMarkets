const config = {
  testnet: {
    chainId: 84532,
    rpc: "https://sepolia.base.org",
    pairs: [
      {
        id: "ETH-USD",
        priceFeed: "0x4aDC67696bA383F43DD60A9e78F2C97Fbbfc7cb1", // ETH/USD on Base Sepolia
        minBet: "1000000", // 1 USDC
        maxBet: "500000000" // 500 USDC
      },
      {
        id: "BTC-USD",
        priceFeed: "0x0FB99723Aee6f420beAD13e6bBB79b7E6F034298", // BTC/USD on Base Sepolia
        minBet: "1000000",
        maxBet: "500000000"
      }
    ]
  },
  mainnet: {
    chainId: 8453,
    rpc: "https://mainnet.base.org",
    pairs: [
      {
        id: "ETH-USD",
        priceFeed: "0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70", // ETH/USD on Base Mainnet
        minBet: "1000000",
        maxBet: "500000000"
      },
      {
        id: "BTC-USD",
        priceFeed: "0x64c911996D3c6aC71f9b455B1E8E7266BcbD848F", // BTC/USD on Base Mainnet
        minBet: "1000000",
        maxBet: "500000000"
      }
    ]
  }
}

module.exports = config; 