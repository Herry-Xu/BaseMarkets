package round

import (
	"context"
	"math/big"
	"time"

	"prediction-market/internal/contracts/predictionmarket"
	"prediction-market/pkg/errors"
	"prediction-market/pkg/ethereum"
	"prediction-market/pkg/utils"

	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
)

type Service interface {
	GetCurrentRound(ctx context.Context, pairID string) (*Round, error)
	GetRound(ctx context.Context, pairID string, epoch uint64) (*Round, error)
	GetRoundHistory(ctx context.Context, pairID string, limit int) ([]*Round, error)
}

type Round struct {
	Epoch        uint64
	PairID       string
	StartTime    time.Time
	LockTime     time.Time
	CloseTime    time.Time
	LockPrice    *big.Int
	ClosePrice   *big.Int
	TotalAmount  *big.Int
	BullAmount   *big.Int
	BearAmount   *big.Int
	OracleCalled bool
	Closed       bool
}

type service struct {
	client *ethereum.Client
	config *utils.Config
}

func NewService(client *ethereum.Client, config *utils.Config) Service {
	return &service{
		client: client,
		config: config,
	}
}

func (s *service) getPredictionContract() (*predictionmarket.Contracts, error) {
	return predictionmarket.NewContracts(
		common.HexToAddress(s.config.PredictionAddress),
		s.client,
	)
}

func (s *service) GetCurrentRound(ctx context.Context, pairID string) (*Round, error) {
	predictionMarket, err := s.getPredictionContract()
	if err != nil {
		return nil, errors.Wrap(errors.ErrTransactionFail, "failed to get contract", err)
	}

	currentEpoch, err := predictionMarket.CurrentEpoch(&bind.CallOpts{Context: ctx})
	if err != nil {
		return nil, errors.Wrap(errors.ErrRoundNotFound, "failed to get current epoch", err)
	}

	return s.GetRound(ctx, pairID, currentEpoch.Uint64())
}

func (s *service) GetRound(ctx context.Context, pairID string, epoch uint64) (*Round, error) {
	predictionMarket, err := s.getPredictionContract()
	if err != nil {
		return nil, errors.Wrap(errors.ErrTransactionFail, "failed to get contract", err)
	}

	roundData, err := predictionMarket.Rounds(&bind.CallOpts{Context: ctx}, big.NewInt(int64(epoch)))
	if err != nil {
		return nil, errors.Wrap(errors.ErrRoundNotFound, "failed to get round data", err)
	}

	if roundData.StartTimestamp.Uint64() == 0 {
		return nil, errors.New(errors.ErrRoundNotFound, "round not found")
	}

	return &Round{
		Epoch:        epoch,
		PairID:       pairID,
		StartTime:    time.Unix(roundData.StartTimestamp.Int64(), 0),
		LockTime:     time.Unix(roundData.LockTimestamp.Int64(), 0),
		CloseTime:    time.Unix(roundData.CloseTimestamp.Int64(), 0),
		LockPrice:    roundData.LockPrice,
		ClosePrice:   roundData.ClosePrice,
		TotalAmount:  roundData.TotalAmount,
		BullAmount:   roundData.BullAmount,
		BearAmount:   roundData.BearAmount,
		OracleCalled: roundData.OracleCalled,
		Closed:       roundData.Closed,
	}, nil
}

func (s *service) GetRoundHistory(ctx context.Context, pairID string, limit int) ([]*Round, error) {
	// Implementation for getting round history
	return nil, nil
}
