package handlers

import (
	"net/http"
	"strconv"

	"prediction-market/internal/price"
	"prediction-market/pkg/errors"
	"prediction-market/pkg/types"

	"github.com/gin-gonic/gin"
)

type PriceHandler struct {
	priceService price.Service
}

func NewPriceHandler(priceService price.Service) *PriceHandler {
	return &PriceHandler{
		priceService: priceService,
	}
}

func (h *PriceHandler) GetLatestPrice(c *gin.Context) {
	pair := c.MustGet("pair").(types.TradingPair)
	priceData, err := h.priceService.GetLatestPrice(c.Request.Context(), pair.Symbol)
	if err != nil {
		if e, ok := err.(*errors.Error); ok {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": e.Message,
				"code":  e.Code,
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get price"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"price":     priceData.Price.String(),
		"timestamp": priceData.Timestamp,
		"pair":      priceData.PairID,
		"decimals":  priceData.Decimals,
	})
}

// GetPriceHistory returns historical price data for a trading pair
func (h *PriceHandler) GetPriceHistory(c *gin.Context) {
	pair := c.MustGet("pair").(types.TradingPair)

	// Parse query parameters
	interval := c.DefaultQuery("interval", "5m")
	limitStr := c.DefaultQuery("limit", "100")
	limit, err := strconv.Atoi(limitStr)
	if err != nil {
		limit = 100
	}

	// Get price history
	priceHistory, err := h.priceService.GetPriceHistory(c.Request.Context(), pair.Symbol, interval, limit)
	if err != nil {
		if e, ok := err.(*errors.Error); ok {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": e.Message,
				"code":  e.Code,
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get price history"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"prices":   priceHistory,
		"pair":     pair.Symbol,
		"interval": interval,
	})
}
