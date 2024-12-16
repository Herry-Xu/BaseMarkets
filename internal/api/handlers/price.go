package handlers

import (
	"net/http"

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
	})
}
