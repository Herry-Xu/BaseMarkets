package middleware

import (
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

// ChainConfig represents supported blockchain configuration
type ChainConfig struct {
	ID              int64
	Name            string
	RPC             string
	PriceFeedID     string
	Enabled         bool
	MinBlockTime    time.Duration // Minimum block time for the chain
	MaxGasPrice     int64         // Maximum gas price to accept
	RequiredConfirm int           // Required confirmations for finality
	IsTestnet       bool          // Whether this is a testnet
}

// SupportedChains maps chain IDs to their configurations
var SupportedChains = map[int64]ChainConfig{
	8453: { // Base
		ID:              8453,
		Name:            "Base",
		RPC:             "https://mainnet.base.org",
		PriceFeedID:     "0x6550bc2301936011c1334555e62A87705A81C12C",
		Enabled:         true,
		MinBlockTime:    2 * time.Second,
		MaxGasPrice:     100, // in gwei
		RequiredConfirm: 3,
		IsTestnet:       false,
	},
	84532: { // Base Sepolia
		ID:              84532,
		Name:            "Base Sepolia",
		RPC:             "https://sepolia.base.org",
		PriceFeedID:     "0x6550bc2301936011c1334555e62A87705A81C12C",
		Enabled:         true,
		MinBlockTime:    2 * time.Second,
		MaxGasPrice:     50,
		RequiredConfirm: 1,
		IsTestnet:       true,
	},
}

// ChainValidationError represents chain validation errors
type ChainValidationError struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

// ChainMiddleware validates and injects chain information
func ChainMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		chainID := c.GetHeader("X-Chain-ID")
		if chainID == "" {
			chainID = "8453" // Default to Base
		}

		// Basic validation
		id, err := strconv.ParseInt(chainID, 10, 64)
		if err != nil {
			c.JSON(http.StatusBadRequest, ChainValidationError{
				Code:    "INVALID_CHAIN_ID",
				Message: "Invalid chain ID format",
			})
			c.Abort()
			return
		}

		chain, exists := SupportedChains[id]
		if !exists {
			c.JSON(http.StatusBadRequest, ChainValidationError{
				Code:    "UNSUPPORTED_CHAIN",
				Message: "Chain not supported",
			})
			c.Abort()
			return
		}

		if !chain.Enabled {
			c.JSON(http.StatusServiceUnavailable, ChainValidationError{
				Code:    "CHAIN_DISABLED",
				Message: "Chain temporarily disabled",
			})
			c.Abort()
			return
		}

		// Production/Testnet validation
		if chain.IsTestnet && c.GetHeader("X-Environment") == "production" {
			c.JSON(http.StatusBadRequest, ChainValidationError{
				Code:    "TESTNET_IN_PROD",
				Message: "Cannot use testnet in production environment",
			})
			c.Abort()
			return
		}

		// Inject chain config into context
		c.Set("chain", chain)
		c.Next()
	}
}
