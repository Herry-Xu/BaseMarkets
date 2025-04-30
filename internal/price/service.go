package price

import (
	"context"
	"math/big"
	"time"

	"prediction-market/internal/api/middleware"
	"prediction-market/internal/contracts/pricefeed"
	"prediction-market/pkg/errors"
	"prediction-market/pkg/ethereum"
	"prediction-market/pkg/types"
	"prediction-market/pkg/utils"

	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
)

type Service interface {
	GetLatestPrice(ctx context.Context, pairID string) (*types.PriceData, error)
	GetPriceAtTime(ctx context.Context, pairID string, timestamp time.Time) (*types.PriceData, error)
	GetPriceHistory(ctx context.Context, pairID string, interval string, limit int) ([]types.PriceData, error)
}

type PriceData struct {
	Price     *big.Int
	Timestamp time.Time
	PairID    string
}

type Price struct {
	PairID    string
	Price     *big.Int
	Timestamp time.Time
	Decimals  uint8
}

type service struct {
	client *ethereum.Client
	cache  map[string]*PriceData
	config *utils.Config
	// mu     sync.RWMutex // TODO: Add mutex for cache
}

func NewService(client *ethereum.Client) Service {
	return &service{
		client: client,
		cache:  make(map[string]*PriceData),
		config: utils.GetConfig(),
	}
}

func (s *service) GetLatestPrice(ctx context.Context, pairID string) (*types.PriceData, error) {
	priceData, err := s.fetchPriceFromChain(ctx, pairID)
	if err != nil {
		return nil, err
	}

	// Get decimals from the price feed contract
	pair, exists := middleware.SupportedPairs[pairID]
	if !exists {
		return nil, errors.New(errors.ErrChainNotSupported, "pair not supported")
	}

	priceFeed, err := pricefeed.NewPricefeed(common.HexToAddress(pair.PriceFeedID), s.client)
	if err != nil {
		return nil, errors.Wrap(errors.ErrPriceNotAvailable, "failed to load price feed contract", err)
	}

	decimals, err := priceFeed.Decimals(&bind.CallOpts{Context: ctx})
	if err != nil {
		return nil, errors.Wrap(errors.ErrPriceNotAvailable, "failed to get decimals", err)
	}

	return &types.PriceData{
		PairID:    priceData.PairID,
		Price:     &types.Decimal{Int: priceData.Price},
		Timestamp: priceData.Timestamp.Unix(),
		Decimals:  int(decimals),
	}, nil
}

func (s *service) GetPriceAtTime(ctx context.Context, pairID string, timestamp time.Time) (*types.PriceData, error) {
	// Implementation for historical price lookup
	return nil, nil
}

func (s *service) GetPriceHistory(ctx context.Context, pairID string, interval string, limit int) ([]types.PriceData, error) {
	// This is a simplified implementation
	// In a real application, you would fetch this from a database or external API

	// Parse interval string to duration
	var duration time.Duration
	switch interval {
	case "1m":
		duration = time.Minute
	case "5m":
		duration = 5 * time.Minute
	case "15m":
		duration = 15 * time.Minute
	case "1h":
		duration = time.Hour
	case "4h":
		duration = 4 * time.Hour
	case "1d":
		duration = 24 * time.Hour
	default:
		duration = 5 * time.Minute
	}

	// Get current price as a starting point
	currentPrice, err := s.GetLatestPrice(ctx, pairID)
	if err != nil {
		return nil, err
	}

	// Generate mock historical data
	// In production, you would fetch this from a database
	result := make([]types.PriceData, 0, limit)
	now := time.Now().Unix()

	// Add current price
	result = append(result, *currentPrice)

	// Generate historical prices with slight variations
	// This is just for demonstration - replace with actual historical data
	for i := 1; i < limit; i++ {
		timestamp := now - int64(i)*int64(duration.Seconds())

		// Create variation factor (98% to 102%)
		variationFactor := &types.Decimal{Int: big.NewInt(int64(98 + i%5))}

		// Create a new big.Int for the calculation
		newPrice := new(big.Int).Set(currentPrice.Price.Int)

		// Multiply by variation factor (98-102) and divide by 100
		newPrice.Mul(newPrice, variationFactor.Int)
		newPrice.Div(newPrice, big.NewInt(100))

		// Create a price with slight variation
		historicalPrice := types.PriceData{
			PairID:    pairID,
			Price:     &types.Decimal{Int: newPrice},
			Timestamp: timestamp,
			Decimals:  currentPrice.Decimals,
		}

		result = append(result, historicalPrice)
	}

	return result, nil
}

func (s *service) fetchPriceFromChain(ctx context.Context, pairID string) (*PriceData, error) {
	// Get price feed contract address from pair config
	pair, exists := middleware.SupportedPairs[pairID]
	if !exists {
		return nil, errors.New(errors.ErrChainNotSupported, "pair not supported")
	}

	// Use NewPricefeed instead of NewContracts
	priceFeed, err := pricefeed.NewPricefeed(common.HexToAddress(pair.PriceFeedID), s.client)
	if err != nil {
		return nil, errors.Wrap(errors.ErrPriceNotAvailable, "failed to create price feed contract", err)
	}

	// Get latest round data using the new interface
	roundData, err := priceFeed.LatestRoundData(&bind.CallOpts{Context: ctx})
	if err != nil {
		return nil, errors.Wrap(errors.ErrPriceNotAvailable, "failed to get latest round data", err)
	}

	// Check if price is stale TODO: Add back in
	// if time.Since(time.Unix(roundData.UpdatedAt.Int64(), 0)) > 30*time.Second {
	// 	return nil, errors.New(errors.ErrPriceStale, "price data is stale")
	// }

	return &PriceData{
		Price:     roundData.Answer,
		Timestamp: time.Unix(roundData.UpdatedAt.Int64(), 0),
		PairID:    pairID,
	}, nil
}
