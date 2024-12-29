package price

import (
	"context"
	"math/big"
	"time"

	"prediction-market/internal/api/middleware"
	"prediction-market/internal/contracts/pricefeed"
	"prediction-market/pkg/errors"
	"prediction-market/pkg/ethereum"
	"prediction-market/pkg/utils"

	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
)

type Service interface {
	GetLatestPrice(ctx context.Context, pairID string) (*Price, error)
	GetPriceAtTime(ctx context.Context, pairID string, timestamp time.Time) (*PriceData, error)
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

func (s *service) GetLatestPrice(ctx context.Context, pairID string) (*Price, error) {
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

	return &Price{
		PairID:    priceData.PairID,
		Price:     priceData.Price,
		Timestamp: priceData.Timestamp,
		Decimals:  decimals,
	}, nil
}

func (s *service) GetPriceAtTime(ctx context.Context, pairID string, timestamp time.Time) (*PriceData, error) {
	// Implementation for historical price lookup
	return nil, nil
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
