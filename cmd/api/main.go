package main

import (
	"log"

	"prediction-market/internal/api/router"
	"prediction-market/pkg/ethereum"
	"prediction-market/pkg/utils"

	"github.com/gin-gonic/gin"
)

func main() {
	// Load configuration
	config, err := utils.LoadConfig()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	// Initialize Ethereum client
	client, err := ethereum.NewClient(config)
	if err != nil {
		log.Fatalf("Failed to initialize Ethereum client: %v", err)
	}

	// Initialize router
	r := gin.Default()
	router.SetupRoutes(r, client, config.Environment)

	// Start server
	if err := r.Run(":" + config.Port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
