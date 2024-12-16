# Prediction Market

A decentralized prediction market platform built on Base blockchain, allowing users to bet on price movements of various crypto assets.

## Features

- Price prediction markets for crypto assets
- Integration with Chainlink price feeds
- Real-time price updates and round management
- User-friendly betting interface
- Multi-pair support
- Treasury fee management
- Emergency withdrawal mechanisms

## Tech Stack

- **Blockchain**: Base (L2 on Ethereum)
- **Smart Contracts**: Solidity, Hardhat
- **Backend**: Go
- **Price Feeds**: Chainlink

## Prerequisites

- Go 1.21+
- Node.js 18+
- Hardhat
- Base RPC access

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-repo/prediction-market.git
cd prediction-market
```

2. Install Node.js dependencies:
```bash
yarn install
```

3. Install Go dependencies:
```bash
go mod download
```

4. Set up environment variables:
```bash
cp .env.example .env.testnet
```

## Edit .env.testnet with your configuration

## Smart Contract Deployment

1. Deploy to Base Sepolia testnet:
```bash
npx hardhat compile
npx hardhat run scripts/deploy.testnet.js --network baseTestnet
```

2. Deploy to Base mainnet:
```bash
npx hardhat compile
npx hardhat run scripts/deploy.mainnet.js --network baseMainnet
```

## Running the API Server

1. Start the price feed service:
```bash
ENVIRONMENT=price-feed go run cmd/api/main.go
```

2. Start the round management service:
```bash
ENVIRONMENT=round-management go run cmd/api/main.go
```

3. Start the user service:
```bash
ENVIRONMENT=user go run cmd/api/main.go
```

## Development

Generate Contract Bindings:

1. Extract ABIs:
```bash
npx hardhat run scripts/extract-abi.js
```

2. Generate Go bindings:
```bash
abigen --abi abi/PredictionMarket.abi --bin abi/PredictionMarket.bin --pkg predictionmarket --out internal/contracts/predictionmarket/prediction_market.go
abigen --abi abi/PriceFeed.abi --pkg pricefeed --out internal/contracts/pricefeed/price_feed.go
```

## Testing

Run smart contract tests:
```bash
npx hardhat test
```

Run Go tests:
```bash
go test ./...
```

## Architecture

The project follows clean architecture principles:
- cmd/: Application entry points
- internal/: Private application code
- pkg/: Public libraries
- contracts/: Smart contract source code
- scripts/: Deployment and utility scripts

## License

This project is licensed under the MIT License - see the LICENSE file for details.