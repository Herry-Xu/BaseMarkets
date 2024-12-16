package utils

import (
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

type Config struct {
	NodeURL           string
	PrivateKey        string
	ChainlinkAddress  string
	ChainID           int64
	RpcURL            string
	Environment       string
	PredictionAddress string
	PriceFeedAddress  string
	BasescanAPIKey    string
	Port              string
}

var config *Config

func LoadConfig() (*Config, error) {
	env := os.Getenv("NET")
	if env == "" {
		env = "testnet" // default to testnet
	}

	if err := godotenv.Load(".env." + env); err != nil {
		return nil, err
	}

	chainID, err := strconv.ParseInt(os.Getenv("CHAIN_ID"), 10, 64)
	if err != nil {
		return nil, err
	}

	config = &Config{
		NodeURL:           os.Getenv("NODE_URL"),
		PrivateKey:        os.Getenv("PRIVATE_KEY"),
		ChainlinkAddress:  os.Getenv("CHAINLINK_CONTRACT_ADDRESS"),
		ChainID:           chainID,
		RpcURL:            os.Getenv("RPC_URL"),
		Environment:       os.Getenv("ENVIRONMENT"),
		PredictionAddress: os.Getenv("PREDICTION_ADDRESS"),
		PriceFeedAddress:  os.Getenv("PRICE_FEED_ADDRESS"),
		BasescanAPIKey:    os.Getenv("BASESCAN_API_KEY"),
		Port:              os.Getenv("PORT"),
	}

	return config, nil
}

func GetConfig() *Config {
	return config
}
