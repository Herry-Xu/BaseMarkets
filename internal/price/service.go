package price

import (
	"context"
	"math/big"
	"sync"
	"time"

	"prediction-market/internal/api/middleware"
	"prediction-market/internal/contracts/pricefeed"
	"prediction-market/pkg/errors"
	"prediction-market/pkg/ethereum"

	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
)

type Service interface {
	GetLatestPrice(ctx context.Context, pairID string) (*PriceData, error)
	GetPriceAtTime(ctx context.Context, pairID string, timestamp time.Time) (*PriceData, error)
}

type PriceData struct {
	Price     *big.Int
	Timestamp time.Time
	PairID    string
}

type service struct {
	client *ethereum.Client
	cache  map[string]*PriceData
	mu     sync.RWMutex
}

func NewService(client *ethereum.Client) Service {
	return &service{
		client: client,
		cache:  make(map[string]*PriceData),
	}
}

func (s *service) GetLatestPrice(ctx context.Context, pairID string) (*PriceData, error) {
	// Check cache first
	s.mu.RLock()
	if price, exists := s.cache[pairID]; exists {
		if time.Since(price.Timestamp) < 30*time.Second {
			s.mu.RUnlock()
			return price, nil
		}
	}
	s.mu.RUnlock()

	// Get fresh price from chain
	price, err := s.fetchPriceFromChain(ctx, pairID)
	if err != nil {
		return nil, err
	}

	// Update cache
	s.mu.Lock()
	s.cache[pairID] = price
	s.mu.Unlock()

	return price, nil
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

	// Create price feed contract instance
	priceFeed, err := pricefeed.NewContracts(common.HexToAddress(pair.PriceFeedID), s.client)
	if err != nil {
		return nil, errors.Wrap(errors.ErrPriceNotAvailable, "failed to create price feed contract", err)
	}

	// Get latest price
	price, err := priceFeed.GetLatestPrice(&bind.CallOpts{Context: ctx})
	if err != nil {
		return nil, errors.Wrap(errors.ErrPriceNotAvailable, "failed to get latest price", err)
	}

	// Get latest timestamp
	timestamp, err := priceFeed.GetLatestTimestamp(&bind.CallOpts{Context: ctx})
	if err != nil {
		return nil, errors.Wrap(errors.ErrPriceNotAvailable, "failed to get timestamp", err)
	}

	// Check if price is stale
	if time.Since(time.Unix(timestamp.Int64(), 0)) > 30*time.Second {
		return nil, errors.New(errors.ErrPriceStale, "price data is stale")
	}

	return &PriceData{
		Price:     price,
		Timestamp: time.Unix(timestamp.Int64(), 0),
		PairID:    pairID,
	}, nil
}
