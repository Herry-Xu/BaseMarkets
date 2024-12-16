# Deployment Guide

## Prerequisites
- Node.js and npm installed
- Go 1.21 or higher
- Access to Base RPC nodes
- Private key with sufficient funds
- Environment variables configured

## Environment Setup
1. Copy `.env.example` to `.env`:
cp .env.example .env

2. Configure environment variables:
# Blockchain Configuration
PRIVATE_KEY=your_private_key
BASESCAN_API_KEY=your_basescan_api_key

# Testnet
BASE_TESTNET_RPC=https://sepolia.base.org
BASE_TESTNET_CHAINID=84532

# Mainnet
BASE_MAINNET_RPC=https://mainnet.base.org
BASE_MAINNET_CHAINID=8453

## Smart Contract Deployment

### Testnet Deployment
1. Install dependencies:
npm install

2. Deploy to testnet:
npx hardhat run scripts/deploy.testnet.js --network baseTestnet

3. Verify contracts:
npx hardhat verify --network baseTestnet <contract_address>

### Mainnet Deployment
1. Safety checks:
   - Ensure all tests pass
   - Review gas settings
   - Verify sufficient funds

2. Deploy to mainnet:
npx hardhat run scripts/deploy.mainnet.js --network baseMainnet

3. Post-deployment steps:
   - Set admin address
   - Set operator address
   - Configure trading pairs
   - Start genesis round

## API Server Deployment

1. Build the application:
go build -o prediction-api ./cmd/api

2. Run the server:
./prediction-api

3. For production, use process manager (e.g., systemd):
[Unit]
Description=Prediction Market API

[Service]
ExecStart=/path/to/prediction-api
Restart=always
Environment=GIN_MODE=release

[Install]
WantedBy=multi-user.target

## Monitoring & Maintenance

1. Contract monitoring:
   - Watch for events
   - Monitor treasury
   - Check round executions

2. API monitoring:
   - Health checks
   - Rate limit status
   - Error rates

3. Regular maintenance:
   - Update price feeds
   - Adjust parameters
   - Backup data

## Security Considerations

1. Smart Contract Security:
   - Multi-sig admin wallet
   - Timelock for critical functions
   - Emergency pause functionality
   - Regular audits

2. API Security:
   - Rate limiting
   - CORS configuration
   - Input validation
   - SSL/TLS setup

## Troubleshooting

1. Common Issues:
   - Oracle price feed delays
   - Gas price spikes
   - Rate limit exceeded
   - Network congestion

2. Recovery Procedures:
   - Emergency pause
   - Market reset
   - Treasury withdrawal
   - User emergency withdrawals 