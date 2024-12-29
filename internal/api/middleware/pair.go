package middleware

import (
	"fmt"
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
	"BTC-USD": {
		Symbol:          "BTC-USD",
		BaseAsset:       "BTC",
		QuoteAsset:      "USDC",
		PriceFeedID:     "0x0FB99723Aee6f420beAD13e6bBB79b7E6F034298",
		Enabled:         true,
		MinBetAmount:    "1000000",   // 1 USDC with 6 decimals
		MaxBetAmount:    "500000000", // 500 USDC
		UpdateFrequency: 30,
		Decimals:        8,
		MaxVolume:       "1000000000", // 1000 USDC
	},
	"ETH-USD": {
		Symbol:          "ETH-USD",
		BaseAsset:       "ETH",
		QuoteAsset:      "USD",
		PriceFeedID:     "0x4aDC67696bA383F43DD60A9e78F2C97Fbbfc7cb1",
		Enabled:         true,
		MinBetAmount:    "1000000",   // 1 USDC with 6 decimals
		MaxBetAmount:    "500000000", // 500 USDC
		UpdateFrequency: 30,
		Decimals:        8,
		MaxVolume:       "1000000000", // 1000 USDC
	},
}

// PairMiddleware validates and injects trading pair information
func PairMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		pairSymbol := c.Query("pairId")
		if pairSymbol == "" {
			pairSymbol = "BTC-USD" // Default pair
		}

		// Basic validation
		pair, exists := SupportedPairs[pairSymbol]
		if !exists {
			c.JSON(http.StatusBadRequest, PairValidationError{
				Code:    "UNSUPPORTED_PAIR",
				Message: fmt.Sprintf("Trading pair %s not supported", pairSymbol),
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

		// Maintenance window check TODO: Add back in
		// for _, maintenance := range pair.MaintenanceTime {
		// 	if now.Equal(maintenance) || now.Add(1*time.Hour).After(maintenance) {
		// 		c.JSON(http.StatusServiceUnavailable, PairValidationError{
		// 			Code:    "MAINTENANCE_WINDOW",
		// 			Message: "Trading pair under maintenance",
		// 		})
		// 		c.Abort()
		// 		return
		// 	}
		// }

		now := time.Now().UTC()

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
