package main

import (
	"log"
	"os"

	"prediction-market/internal/api/router"
	"prediction-market/pkg/ethereum"
	"prediction-market/pkg/utils"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func init() {
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file")
	}
}

func main() {
	// Service selection based on environment variable
	serviceType := os.Getenv("SERVICE_TYPE")

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

	switch serviceType {
	case "price-feed":
		startPriceFeedService(r, client, config)
	case "round-management":
		startRoundManagementService(r, client, config)
	case "user":
		startUserService(r, client, config)
	case "event-listener":
		startEventListenerService(r, client, config)
	default:
		log.Fatal("Unknown service type")
	}
}

func startPriceFeedService(r *gin.Engine, client *ethereum.Client, config *utils.Config) {
	log.Println("Starting price feed service...")
	router.SetupRoutes(r, client, "price-feed")
	if err := r.Run(":" + config.Port); err != nil {
		log.Fatalf("Failed to start price feed service: %v", err)
	}
}

func startRoundManagementService(r *gin.Engine, client *ethereum.Client, config *utils.Config) {
	log.Println("Starting round management service...")
	router.SetupRoutes(r, client, "round-management")
	if err := r.Run(":" + config.Port); err != nil {
		log.Fatalf("Failed to start round management service: %v", err)
	}
}

func startUserService(r *gin.Engine, client *ethereum.Client, config *utils.Config) {
	log.Println("Starting user service...")
	router.SetupRoutes(r, client, "user")
	if err := r.Run(":" + config.Port); err != nil {
		log.Fatalf("Failed to start user service: %v", err)
	}
}

func startEventListenerService(r *gin.Engine, client *ethereum.Client, config *utils.Config) {
	log.Println("Starting event listener service...")
	router.SetupRoutes(r, client, "event-listener")
	if err := r.Run(":" + config.Port); err != nil {
		log.Fatalf("Failed to start event listener service: %v", err)
	}
}
