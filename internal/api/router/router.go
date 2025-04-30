package router

import (
	"prediction-market/internal/api/handlers"
	"prediction-market/internal/api/middleware"
	"prediction-market/internal/bet"
	"prediction-market/internal/price"
	"prediction-market/internal/round"
	"prediction-market/pkg/ethereum"
	"prediction-market/pkg/utils"

	"log"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine, client *ethereum.Client, env string) {
	config := utils.GetConfig()

	// Global middleware
	r.Use(gin.Logger())
	r.Use(gin.Recovery())
	r.Use(middleware.CORS())

	// API v1 routes
	v1 := r.Group("/api/v1")
	v1.Use(middleware.ChainMiddleware())
	v1.Use(middleware.PairMiddleware())

	// Initialize only the required service based on environment
	switch env {
	case "price-feed":
		priceService := price.NewService(client)
		priceHandler := handlers.NewPriceHandler(priceService)
		price := v1.Group("/price")
		{
			price.GET("/latest", middleware.RateLimitPrice(), priceHandler.GetLatestPrice)
			price.GET("/history", middleware.RateLimitHistory(), priceHandler.GetPriceHistory)
		}

	case "round-management":
		roundService := round.NewService(client, config)
		roundHandler := handlers.NewRoundHandler(roundService)
		round := v1.Group("/round")
		{
			round.GET("/current", roundHandler.GetCurrentRound)
			round.GET("/:epoch", roundHandler.GetRound)
			round.GET("/history", middleware.RateLimitHistory(), roundHandler.GetRoundHistory)
		}

	case "user":
		betService := bet.NewService(client, config)
		betHandler := handlers.NewBetHandler(betService)

		bet := v1.Group("/bet")
		{
			bet.POST("/bull", middleware.RateLimitBetting(), betHandler.PlaceBullBet)
			bet.POST("/bear", middleware.RateLimitBetting(), betHandler.PlaceBearBet)
			bet.GET("/position/:epoch", betHandler.GetUserPosition)
			bet.POST("/claim/:epoch", middleware.RateLimitClaiming(), betHandler.ClaimReward)
		}

		history := v1.Group("/history")
		{
			history.GET("/bets", middleware.RateLimitHistory(), betHandler.GetUserBetHistory)
			history.GET("/stats", middleware.RateLimitHistory(), betHandler.GetUserStats)
			history.GET("/round/:epoch", betHandler.GetUserRoundResult)
			history.GET("/pnl", middleware.RateLimitHistory(), betHandler.GetUserPnL)
		}

	default:
		log.Fatalf("Unknown environment: %s", env)
	}
}
