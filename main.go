package main

import (
	"log"
	"os"

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

	switch serviceType {
	case "price-feed":
		startPriceFeedService()
	case "round-management":
		startRoundManagementService()
	case "user":
		startUserService()
	case "event-listener":
		startEventListenerService()
	default:
		log.Fatal("Unknown service type")
	}
}

func startPriceFeedService() {
	// Initialize price feed service
}

func startRoundManagementService() {
	// Initialize round management service
}

func startUserService() {
	// Initialize user service
}

func startEventListenerService() {
	// Initialize event listener service
}
