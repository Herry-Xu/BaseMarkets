package handlers

import (
	"math/big"
	"net/http"
	"strconv"

	"prediction-market/internal/bet"
	"prediction-market/pkg/errors"
	"prediction-market/pkg/types"

	"github.com/gin-gonic/gin"
)

type BetHandler struct {
	betService bet.Service
}

func NewBetHandler(betService bet.Service) *BetHandler {
	return &BetHandler{
		betService: betService,
	}
}

type PlaceBetRequest struct {
	Amount string `json:"amount" binding:"required"`
	Epoch  uint64 `json:"epoch" binding:"required"`
}

type BetResponse struct {
	Message string `json:"message"`
	TxHash  string `json:"txHash,omitempty"`
}

func (h *BetHandler) PlaceBullBet(c *gin.Context) {
	var req PlaceBetRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	amount := new(big.Int)
	amount.SetString(req.Amount, 10)

	pair := c.MustGet("pair").(types.TradingPair)
	bet := &bet.Bet{
		UserAddress: c.GetString("user_address"),
		PairID:      pair.Symbol,
		Epoch:       req.Epoch,
		Amount:      amount,
		IsBull:      true,
	}

	if err := h.betService.PlaceBet(c.Request.Context(), bet); err != nil {
		if e, ok := err.(*errors.Error); ok {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": e.Message,
				"code":  e.Code,
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to place bet"})
		return
	}

	c.JSON(http.StatusOK, BetResponse{
		Message: "Bull bet placed successfully",
	})
}

func (h *BetHandler) PlaceBearBet(c *gin.Context) {
	var req PlaceBetRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	amount := new(big.Int)
	amount.SetString(req.Amount, 10)

	pair := c.MustGet("pair").(types.TradingPair)
	bet := &bet.Bet{
		UserAddress: c.GetString("user_address"),
		PairID:      pair.Symbol,
		Epoch:       req.Epoch,
		Amount:      amount,
		IsBull:      false,
	}

	if err := h.betService.PlaceBet(c.Request.Context(), bet); err != nil {
		if e, ok := err.(*errors.Error); ok {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": e.Message,
				"code":  e.Code,
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to place bet"})
		return
	}

	c.JSON(http.StatusOK, BetResponse{
		Message: "Bear bet placed successfully",
	})
}

func (h *BetHandler) GetUserPosition(c *gin.Context) {
	epochStr := c.Param("epoch")
	epoch, err := strconv.ParseUint(epochStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid epoch"})
		return
	}

	position, err := h.betService.GetUserPosition(c.Request.Context(), c.GetString("user_address"), epoch)
	if err != nil {
		if e, ok := err.(*errors.Error); ok {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": e.Message,
				"code":  e.Code,
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get position"})
		return
	}

	c.JSON(http.StatusOK, position)
}

func (h *BetHandler) ClaimReward(c *gin.Context) {
	epochStr := c.Param("epoch")
	epoch, err := strconv.ParseUint(epochStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid epoch"})
		return
	}

	if err := h.betService.ClaimReward(c.Request.Context(), c.GetString("user_address"), epoch); err != nil {
		if e, ok := err.(*errors.Error); ok {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": e.Message,
				"code":  e.Code,
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to claim reward"})
		return
	}

	c.JSON(http.StatusOK, BetResponse{
		Message: "Reward claimed successfully",
	})
}

func (h *BetHandler) GetUserBetHistory(c *gin.Context) {
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	history, err := h.betService.GetUserHistory(c.Request.Context(), c.GetString("user_address"), limit)
	if err != nil {
		if e, ok := err.(*errors.Error); ok {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": e.Message,
				"code":  e.Code,
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get bet history"})
		return
	}

	c.JSON(http.StatusOK, history)
}

func (h *BetHandler) GetUserStats(c *gin.Context) {
	stats, err := h.betService.GetUserStats(c.Request.Context(), c.GetString("user_address"))
	if err != nil {
		if e, ok := err.(*errors.Error); ok {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": e.Message,
				"code":  e.Code,
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get user stats"})
		return
	}

	c.JSON(http.StatusOK, stats)
}

func (h *BetHandler) GetUserRoundResult(c *gin.Context) {
	// Implementation needed
}

func (h *BetHandler) GetUserPnL(c *gin.Context) {
	// Implementation needed
}
