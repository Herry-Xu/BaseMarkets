package handlers

import (
	"net/http"
	"strconv"

	"prediction-market/internal/round"
	"prediction-market/pkg/errors"
	"prediction-market/pkg/types"

	"github.com/gin-gonic/gin"
)

type RoundHandler struct {
	roundService round.Service
}

func NewRoundHandler(roundService round.Service) *RoundHandler {
	return &RoundHandler{
		roundService: roundService,
	}
}

func (h *RoundHandler) GetCurrentRound(c *gin.Context) {
	pair := c.MustGet("pair").(types.TradingPair)

	currentRound, err := h.roundService.GetCurrentRound(c.Request.Context(), pair.Symbol)
	if err != nil {
		if e, ok := err.(*errors.Error); ok {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": e.Message,
				"code":  e.Code,
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get current round"})
		return
	}

	c.JSON(http.StatusOK, currentRound)
}

func (h *RoundHandler) GetRound(c *gin.Context) {
	pair := c.MustGet("pair").(types.TradingPair)
	epochStr := c.Param("epoch")

	epoch, err := strconv.ParseUint(epochStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid epoch"})
		return
	}

	round, err := h.roundService.GetRound(c.Request.Context(), pair.Symbol, epoch)
	if err != nil {
		if e, ok := err.(*errors.Error); ok {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": e.Message,
				"code":  e.Code,
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get round"})
		return
	}

	c.JSON(http.StatusOK, round)
}

func (h *RoundHandler) GetRoundHistory(c *gin.Context) {
	pair := c.MustGet("pair").(types.TradingPair)
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))

	history, err := h.roundService.GetRoundHistory(c.Request.Context(), pair.Symbol, limit)
	if err != nil {
		if e, ok := err.(*errors.Error); ok {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": e.Message,
				"code":  e.Code,
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get round history"})
		return
	}

	c.JSON(http.StatusOK, history)
}
