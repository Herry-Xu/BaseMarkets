package middleware

import (
	"net/http"
	"time"

	"prediction-market/pkg/types"

	"github.com/gin-gonic/gin"
)

// PairValidationError represents pair validation errors
type PairValidationError struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

// SupportedPairs maps pair symbols to their configurations
var SupportedPairs = map[string]types.TradingPair{
	"BTC-USDC": {
		Symbol:          "BTC-USDC",
		BaseAsset:       "BTC",
		QuoteAsset:      "USDC",
		PriceFeedID:     "0x6550bc2301936011c1334555e62A87705A81C12C",
		Enabled:         true,
		MinBetAmount:    "1000000",   // 1 USDC with 6 decimals
		MaxBetAmount:    "500000000", // 500 USDC
		UpdateFrequency: 30,
		Decimals:        8,
		MaxVolume:       "1000000000", // 1000 USDC
		MaintenanceTime: []time.Time{
			time.Date(2024, 3, 1, 0, 0, 0, 0, time.UTC),
		},
	},
}

// PairMiddleware validates and injects trading pair information
func PairMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		pairSymbol := c.GetHeader("X-Pair-Symbol")
		if pairSymbol == "" {
			pairSymbol = "BTC-USDC" // Default pair
		}

		// Basic validation
		pair, exists := SupportedPairs[pairSymbol]
		if !exists {
			c.JSON(http.StatusBadRequest, PairValidationError{
				Code:    "UNSUPPORTED_PAIR",
				Message: "Trading pair not supported",
			})
			c.Abort()
			return
		}

		if !pair.Enabled {
			c.JSON(http.StatusServiceUnavailable, PairValidationError{
				Code:    "PAIR_DISABLED",
				Message: "Trading pair temporarily disabled",
			})
			c.Abort()
			return
		}

		// Maintenance window check
		now := time.Now().UTC()
		for _, maintenance := range pair.MaintenanceTime {
			if now.Equal(maintenance) || now.Add(1*time.Hour).After(maintenance) {
				c.JSON(http.StatusServiceUnavailable, PairValidationError{
					Code:    "MAINTENANCE_WINDOW",
					Message: "Trading pair under maintenance",
				})
				c.Abort()
				return
			}
		}

		// Rate limit check based on pair's update frequency
		lastUpdate := c.GetHeader("X-Last-Update")
		if lastUpdate != "" {
			lastUpdateTime, err := time.Parse(time.RFC3339, lastUpdate)
			if err == nil && now.Sub(lastUpdateTime).Seconds() < float64(pair.UpdateFrequency) {
				c.JSON(http.StatusTooManyRequests, PairValidationError{
					Code:    "UPDATE_TOO_FREQUENT",
					Message: "Price update too frequent",
				})
				c.Abort()
				return
			}
		}

		// Inject pair config into context
		c.Set("pair", pair)
		c.Next()
	}
}
