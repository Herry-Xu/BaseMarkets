package router

import (
	"prediction-market/internal/api/handlers"
	"prediction-market/internal/api/middleware"
	"prediction-market/internal/bet"
	"prediction-market/internal/price"
	"prediction-market/internal/round"
	"prediction-market/pkg/ethereum"
	"prediction-market/pkg/utils"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine, client *ethereum.Client) {
	// Get config
	config := utils.GetConfig()

	// Initialize services with config
	priceService := price.NewService(client)
	roundService := round.NewService(client, config)
	betService := bet.NewService(client, config)

	// Initialize handlers
	priceHandler := handlers.NewPriceHandler(priceService)
	roundHandler := handlers.NewRoundHandler(roundService)
	betHandler := handlers.NewBetHandler(betService)

	// Global middleware
	r.Use(gin.Logger())
	r.Use(gin.Recovery())
	r.Use(middleware.CORS())

	// API v1 routes
	v1 := r.Group("/api/v1")
	{
		// Apply chain and pair middleware to all routes
		v1.Use(middleware.ChainMiddleware())
		v1.Use(middleware.PairMiddleware())

		// Price routes with rate limiting
		price := v1.Group("/price")
		{
			price.GET("/latest", middleware.RateLimitPrice(), priceHandler.GetLatestPrice)
		}

		// Round routes with rate limiting
		round := v1.Group("/round")
		{
			round.GET("/current", roundHandler.GetCurrentRound)
			round.GET("/:epoch", roundHandler.GetRound)
			round.GET("/history", middleware.RateLimitHistory(), roundHandler.GetRoundHistory)
		}

		// Bet routes with rate limiting
		bet := v1.Group("/bet")
		{
			bet.POST("/bull", middleware.RateLimitBetting(), betHandler.PlaceBullBet)
			bet.POST("/bear", middleware.RateLimitBetting(), betHandler.PlaceBearBet)
			bet.GET("/position/:epoch", betHandler.GetUserPosition)
			bet.POST("/claim/:epoch", middleware.RateLimitClaiming(), betHandler.ClaimReward)
		}

		// User history routes
		history := v1.Group("/history")
		{
			// Get user's betting history with filters
			history.GET("/bets", middleware.RateLimitHistory(), betHandler.GetUserBetHistory)

			// Get user's performance stats
			history.GET("/stats", middleware.RateLimitHistory(), betHandler.GetUserStats)

			// Get specific round results for user
			history.GET("/round/:epoch", betHandler.GetUserRoundResult)

			// Get user's PnL over time
			history.GET("/pnl", middleware.RateLimitHistory(), betHandler.GetUserPnL)
		}
	}
}
