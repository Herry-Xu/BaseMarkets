# API & Smart Contract Overview

## Smart Contract Architecture

### PredictionMarket Contract
Main contract handling betting logic and round management.

#### Key Functions:
1. **Round Management**
   - `genesisStartRound()`: Initialize first round
   - `genesisLockRound()`: Lock first round
   - `executeRound()`: Execute round and start next

2. **Betting**
   - `betBull(uint256 epoch)`: Place UP bet
   - `betBear(uint256 epoch)`: Place DOWN bet
   - `claim(uint256 epoch)`: Claim rewards

3. **Admin Functions**
   - `setAdmin(address _adminAddress)`
   - `setOperator(address _operatorAddress)`
   - `addPair(string _pairId, address _priceFeed, uint256 _minBet, uint256 _maxBet)`
   - `setMinBetAmount(uint256 _minBetAmount)`
   - `setTreasuryFee(uint256 _treasuryFee)`
   - `withdrawTreasury()`

4. **Emergency Functions**
   - `pause()`: Pause contract
   - `emergencyWithdraw()`: Admin withdrawal
   - `userEmergencyWithdraw(uint256 epoch)`: User withdrawal
   - `resetMarket()`: Reset market state

## API Endpoints

### Price Endpoints
GET /api/v1/price/latest
Header: X-Chain-ID: 8453
Header: X-Pair-Symbol: BTC-USDC

### Round Endpoints
GET /api/v1/round/current
GET /api/v1/round/:epoch
GET /api/v1/round/history?limit=20&start_time=&end_time=

### Betting Endpoints
POST /api/v1/bet/bull
POST /api/v1/bet/bear
GET /api/v1/bet/position/:epoch
POST /api/v1/bet/claim/:epoch

### History Endpoints
GET /api/v1/history/bets?limit=20&start_time=&end_time=
GET /api/v1/history/stats
GET /api/v1/history/round/:epoch
GET /api/v1/history/pnl?timeframe=daily

## Rate Limits
1. Betting: 1 request/second
2. Claiming: 1 request/5 seconds
3. Price Feed: 1 request/second
4. History: 1 request/30 seconds
5. Stats: 1 request/30 seconds
6. User History: 1 request/10 seconds

## Trading Pairs
Currently supported:
- BTC-USDC
  - Min bet: 1 USDC
  - Max bet: 500 USDC
  - Price feed: Chainlink BTC/USD
  - Update frequency: 30 seconds
  - Decimals: 8

## Security Features
1. Smart Contract
   - Pausable
   - ReentrancyGuard
   - Admin controls
   - Emergency withdrawals
   - Multi-pair support
   - Treasury management
   - Round validation

2. API
   - Rate limiting
   - Chain validation
   - Pair validation
   - Maintenance windows
   - Input validation
   - Error handling

## Error Codes
1. Chain Errors
   - INVALID_CHAIN_ID: Invalid chain ID format
   - UNSUPPORTED_CHAIN: Chain not supported
   - CHAIN_DISABLED: Chain temporarily disabled
   - TESTNET_IN_PROD: Testnet in production

2. Pair Errors
   - UNSUPPORTED_PAIR: Trading pair not supported
   - PAIR_DISABLED: Trading pair disabled
   - MAINTENANCE_WINDOW: Under maintenance
   - UPDATE_TOO_FREQUENT: Price update too frequent

3. Rate Limit Errors
   - Status code 429 with retry-after header
   - Different windows for different endpoints 