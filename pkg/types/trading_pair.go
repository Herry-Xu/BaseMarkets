package types

import "time"

// TradingPair represents a trading pair configuration
type TradingPair struct {
	Symbol          string
	BaseAsset       string
	QuoteAsset      string
	PriceFeedID     string
	Enabled         bool
	MinBetAmount    string      // Minimum bet amount in quote asset
	MaxBetAmount    string      // Maximum bet amount in quote asset
	UpdateFrequency int64       // Price update frequency in seconds
	Decimals        int         // Price feed decimals
	MaxVolume       string      // Maximum volume per round
	MaintenanceTime []time.Time // Scheduled maintenance windows
}
