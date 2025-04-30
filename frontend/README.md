# Harwood

A woodland-themed prediction game platform where users can predict BTC/USD price movements.

## Current Status

### Settings
- Round duration: 30 seconds (testing mode)
  - Will be increased to 5 minutes (300 seconds) for production
  - Location: `app/hooks/useGameState.ts`

### Features
- ✅ BTC/USD price predictions with mock price feed
- ✅ USDC-based betting system
- ✅ User balance management
- ✅ Round management (Expired, Live, Next, Later)
- ✅ Price change indicators with animations
- ✅ User prediction history
- ✅ Win/loss tracking
- ✅ Mobile responsive design
- ✅ Woodland theme styling
- ✅ Toast notifications for game events

### Recent Updates
- Switched to USDC for betting (from BTC)
- Added user balance display
- Improved price change indicators
- Added detailed user activity history
- Added round result calculations
- Added win/loss notifications

## Implementation Details

### Price Feed
- Mock price feed around $99k with trending variations
- Updates every 3 seconds
- Location: `app/services/priceFeed.ts`

### Game State
- Managed with Zustand
- Tracks rounds, predictions, and user balance
- Location: `app/hooks/useGameState.ts`

### Betting System
- USDC-based betting
- 2x payout for correct predictions
- Balance validation
- Location: `app/components/BettingModal.tsx`

### User Interface
- Responsive design for all screen sizes
- Real-time price updates
- Animated transitions
- Toast notifications
- Location: Various components in `app/components/`

## Future Tasks

### Price Feed
- [ ] Integrate Chainlink BTC/USD feed
- [ ] Add price charts
- [ ] Add technical indicators
- [ ] Add price alerts

### Smart Contracts
- [ ] Create PredictionGame contract
- [ ] Implement USDC deposits/withdrawals
- [ ] Add automated payouts
- [ ] Add emergency functions

### Game Features
- [ ] Add leaderboard
- [ ] Add user statistics
- [ ] Add achievement system
- [ ] Add social features

### UI Improvements
- [ ] Add price charts
- [ ] Add more animations
- [ ] Add sound effects
- [ ] Add dark/light themes

## Next Steps Priority
1. Add price charts
2. Implement leaderboard
3. Add user statistics dashboard
4. Improve mobile experience