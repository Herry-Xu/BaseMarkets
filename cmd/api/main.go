package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

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

	// Service selection based on environment variable
	switch config.Environment {
	case "price-feed":
		startPriceFeedService(client, config)
	case "round-management":
		startRoundManagementService(client, config)
	case "user":
		startUserService(client, config)
	case "event-listener":
		startEventListenerService(client, config)
	default:
		log.Fatal("Unknown service type in ENVIRONMENT variable")
	}
}

func startPriceFeedService(_ *ethereum.Client, config *utils.Config) {
	r := gin.Default()
	// TODO: Add price feed routes

	srv := &http.Server{
		Addr:    ":" + config.Port,
		Handler: r,
	}

	go func() {
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Failed to start server: %v", err)
		}
	}()

	gracefulShutdown(srv)
}

func startRoundManagementService(_ *ethereum.Client, config *utils.Config) {
	r := gin.Default()
	// TODO: Add round management routes

	srv := &http.Server{
		Addr:    ":" + config.Port,
		Handler: r,
	}

	go func() {
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Failed to start server: %v", err)
		}
	}()

	gracefulShutdown(srv)
}

func startUserService(_ *ethereum.Client, config *utils.Config) {
	r := gin.Default()
	// TODO: Add user routes

	srv := &http.Server{
		Addr:    ":" + config.Port,
		Handler: r,
	}

	go func() {
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Failed to start server: %v", err)
		}
	}()

	gracefulShutdown(srv)
}

func startEventListenerService(_ *ethereum.Client, config *utils.Config) {
	r := gin.Default()
	// TODO: Add event listener routes

	srv := &http.Server{
		Addr:    ":" + config.Port,
		Handler: r,
	}

	go func() {
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Failed to start server: %v", err)
		}
	}()

	gracefulShutdown(srv)
}

func gracefulShutdown(srv *http.Server) {
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Println("Shutting down server...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		log.Fatalf("Server forced to shutdown: %v", err)
	}

	log.Println("Server exiting")
}
