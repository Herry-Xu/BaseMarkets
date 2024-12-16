package middleware

import (
	"fmt"
	"net/http"
	"strconv"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
)

type RateLimiter struct {
	sync.RWMutex
	limits map[string][]time.Time
}

// Different rate limits for different actions
const (
	BETTING_WINDOW      = 1 * time.Second  // 1 bet per second
	CLAIMING_WINDOW     = 5 * time.Second  // 1 claim per 5 seconds
	PRICE_WINDOW        = 1 * time.Second  // 1 price request per second
	HISTORY_WINDOW      = 30 * time.Second // 1 history request per 30 seconds
	USER_HISTORY_WINDOW = 10 * time.Second // Less strict for user history
	STATS_WINDOW        = 30 * time.Second // Cache stats longer
	MAX_REQUESTS        = 100              // Maximum requests to store per user
	MAX_HISTORY_LIMIT   = 100              // Maximum number of rounds per request
)

var limiter = &RateLimiter{
	limits: make(map[string][]time.Time),
}

// RateLimitBetting specifically for betting endpoints
func RateLimitBetting() gin.HandlerFunc {
	return createRateLimiter(BETTING_WINDOW, "betting")
}

// RateLimitClaiming for reward claims
func RateLimitClaiming() gin.HandlerFunc {
	return createRateLimiter(CLAIMING_WINDOW, "claiming")
}

// RateLimitPrice for price feed requests
func RateLimitPrice() gin.HandlerFunc {
	return createRateLimiter(PRICE_WINDOW, "price")
}

// RateLimitHistory for historical data requests
func RateLimitHistory() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Validate time range
		startTime := c.DefaultQuery("start_time", "")
		endTime := c.DefaultQuery("end_time", "")
		if startTime != "" && endTime != "" {
			start, err1 := time.Parse(time.RFC3339, startTime)
			end, err2 := time.Parse(time.RFC3339, endTime)
			if err1 != nil || err2 != nil {
				c.JSON(http.StatusBadRequest, gin.H{
					"error": "Invalid time format",
				})
				c.Abort()
				return
			}

			// Limit time range to prevent heavy queries
			if end.Sub(start) > 30*24*time.Hour { // 30 days max
				c.JSON(http.StatusBadRequest, gin.H{
					"error": "Time range too large, maximum 30 days",
				})
				c.Abort()
				return
			}
		}

		// Get limit from query params
		limit := c.DefaultQuery("limit", "20")
		limitInt, err := strconv.Atoi(limit)
		if err != nil || limitInt <= 0 {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Invalid limit parameter",
			})
			c.Abort()
			return
		}

		if limitInt > MAX_HISTORY_LIMIT {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": fmt.Sprintf("Limit exceeds maximum of %d", MAX_HISTORY_LIMIT),
			})
			c.Abort()
			return
		}

		// Apply rate limiting based on endpoint
		var window time.Duration
		switch c.FullPath() {
		case "/api/v1/history/stats":
			window = STATS_WINDOW
		case "/api/v1/history/pnl":
			window = USER_HISTORY_WINDOW
		default:
			window = HISTORY_WINDOW
		}

		rateLimiter := createRateLimiter(window, "history")
		rateLimiter(c)
	}
}

func createRateLimiter(window time.Duration, actionType string) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get user identifier (IP or user ID if authenticated)
		identifier := getUserIdentifier(c)
		key := fmt.Sprintf("%s:%s", identifier, actionType)

		limiter.Lock()
		defer limiter.Unlock()

		now := time.Now()

		// Clean old requests
		if requests, exists := limiter.limits[key]; exists {
			var valid []time.Time
			for _, t := range requests {
				if now.Sub(t) < window {
					valid = append(valid, t)
				}
			}
			limiter.limits[key] = valid
		}

		// Check rate limit
		if len(limiter.limits[key]) >= MAX_REQUESTS {
			c.JSON(429, gin.H{
				"error":       fmt.Sprintf("Rate limit exceeded for %s", actionType),
				"retry_after": window.Seconds(),
			})
			c.Abort()
			return
		}

		// Add new request
		limiter.limits[key] = append(limiter.limits[key], now)

		c.Next()
	}
}

func getUserIdentifier(c *gin.Context) string {
	// If user is authenticated, use their ID
	if userID, exists := c.Get("user_id"); exists {
		return fmt.Sprintf("user:%v", userID)
	}

	// Otherwise use IP address
	return fmt.Sprintf("ip:%s", c.ClientIP())
}
