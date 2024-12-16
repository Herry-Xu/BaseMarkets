package bet

import (
	"context"
	"math/big"
	"time"

	"prediction-market/internal/api/middleware"
	"prediction-market/internal/contracts/predictionmarket"
	"prediction-market/pkg/errors"
	"prediction-market/pkg/ethereum"
	"prediction-market/pkg/utils"

	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
)

type Service interface {
	PlaceBet(ctx context.Context, bet *Bet) error
	GetUserPosition(ctx context.Context, userAddr string, epoch uint64) (*Position, error)
	ClaimReward(ctx context.Context, userAddr string, epoch uint64) error
	GetUserHistory(ctx context.Context, userAddr string, limit int) ([]*Bet, error)
	GetUserStats(ctx context.Context, userAddr string) (*Stats, error)
}

type Bet struct {
	UserAddress string
	PairID      string
	Epoch       uint64
	Amount      *big.Int
	IsBull      bool
	Timestamp   time.Time
}

type Position struct {
	Epoch   uint64
	Amount  *big.Int
	IsBull  bool
	Claimed bool
	Won     bool
	Reward  *big.Int
}

type Stats struct {
	TotalBets     int64
	WinningBets   int64
	TotalVolume   *big.Int
	TotalWinnings *big.Int
	WinRate       float64
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

func (s *service) PlaceBet(ctx context.Context, bet *Bet) error {
	// Validate bet amount
	pair, exists := middleware.SupportedPairs[bet.PairID]
	if !exists {
		return errors.New(errors.ErrChainNotSupported, "pair not supported")
	}

	minBet := new(big.Int)
	minBet.SetString(pair.MinBetAmount, 10)
	if bet.Amount.Cmp(minBet) < 0 {
		return errors.New(errors.ErrBetTooSmall, "bet amount below minimum")
	}

	maxBet := new(big.Int)
	maxBet.SetString(pair.MaxBetAmount, 10)
	if bet.Amount.Cmp(maxBet) > 0 {
		return errors.New(errors.ErrBetTooLarge, "bet amount above maximum")
	}

	// Get prediction market contract
	predictionMarket, err := predictionmarket.NewContracts(common.HexToAddress(s.config.PredictionAddress), s.client)
	if err != nil {
		return errors.Wrap(errors.ErrTransactionFail, "failed to get contract", err)
	}

	// Create transaction
	opts, err := s.client.GetTransactOpts(ctx)
	if err != nil {
		return errors.Wrap(errors.ErrTransactionFail, "failed to get transaction opts", err)
	}
	opts.Value = bet.Amount

	// Place bet
	var tx *types.Transaction
	if bet.IsBull {
		tx, err = predictionMarket.BetBull(opts, big.NewInt(int64(bet.Epoch)))
	} else {
		tx, err = predictionMarket.BetBear(opts, big.NewInt(int64(bet.Epoch)))
	}

	if err != nil {
		return errors.Wrap(errors.ErrTransactionFail, "failed to place bet", err)
	}

	// Wait for confirmation
	receipt, err := s.client.WaitForTransaction(ctx, tx.Hash())
	if err != nil {
		return errors.Wrap(errors.ErrTransactionFail, "failed to confirm transaction", err)
	}

	if receipt.Status == 0 {
		return errors.New(errors.ErrTransactionFail, "transaction reverted")
	}

	return nil
}

func (s *service) GetUserPosition(ctx context.Context, userAddr string, epoch uint64) (*Position, error) {
	if !common.IsHexAddress(userAddr) {
		return nil, errors.New(errors.ErrInvalidAddress, "invalid user address")
	}

	predictionMarket, err := predictionmarket.NewContracts(common.HexToAddress(s.config.PredictionAddress), s.client)
	if err != nil {
		return nil, errors.Wrap(errors.ErrTransactionFail, "failed to get contract", err)
	}

	// Get user's bet
	userBet, err := predictionMarket.Ledger(&bind.CallOpts{}, big.NewInt(int64(epoch)), common.HexToAddress(userAddr))
	if err != nil {
		return nil, errors.Wrap(errors.ErrBetNotFound, "failed to get bet", err)
	}

	// Get round data to determine if won
	round, err := predictionMarket.Rounds(&bind.CallOpts{}, big.NewInt(int64(epoch)))
	if err != nil {
		return nil, errors.Wrap(errors.ErrRoundNotFound, "failed to get round", err)
	}

	won := false
	if round.Closed && round.OracleCalled {
		won = (round.ClosePrice.Cmp(round.LockPrice) > 0 && userBet.Bull) ||
			(round.ClosePrice.Cmp(round.LockPrice) < 0 && !userBet.Bull)
	}

	return &Position{
		Epoch:   epoch,
		Amount:  userBet.Amount,
		IsBull:  userBet.Bull,
		Claimed: userBet.Claimed,
		Won:     won,
		Reward:  nil, // Calculate if needed
	}, nil
}

func (s *service) ClaimReward(ctx context.Context, userAddr string, epoch uint64) error {
	if !common.IsHexAddress(userAddr) {
		return errors.New(errors.ErrInvalidAddress, "invalid user address")
	}

	predictionMarket, err := predictionmarket.NewContracts(common.HexToAddress(s.config.PredictionAddress), s.client)
	if err != nil {
		return errors.Wrap(errors.ErrTransactionFail, "failed to get contract", err)
	}

	// Check if round is closed and not claimed
	round, err := predictionMarket.Rounds(&bind.CallOpts{}, big.NewInt(int64(epoch)))
	if err != nil {
		return errors.Wrap(errors.ErrTransactionFail, "failed to get round", err)
	}

	if !round.Closed {
		return errors.New(errors.ErrRoundNotClosed, "round not closed")
	}

	// Check user's bet
	bet, err := predictionMarket.Ledger(&bind.CallOpts{}, big.NewInt(int64(epoch)), common.HexToAddress(userAddr))
	if err != nil {
		return errors.Wrap(errors.ErrBetNotFound, "failed to get bet", err)
	}

	if bet.Claimed {
		return errors.New(errors.ErrAlreadyClaimed, "reward already claimed")
	}

	// Claim reward
	opts, err := s.client.GetTransactOpts(ctx)
	if err != nil {
		return errors.Wrap(errors.ErrTransactionFail, "failed to get transaction opts", err)
	}

	tx, err := predictionMarket.Claim(opts, big.NewInt(int64(epoch)))
	if err != nil {
		return errors.Wrap(errors.ErrTransactionFail, "failed to claim reward", err)
	}

	// Wait for confirmation
	receipt, err := s.client.WaitForTransaction(ctx, tx.Hash())
	if err != nil {
		return errors.Wrap(errors.ErrTransactionFail, "failed to confirm transaction", err)
	}

	if receipt.Status == 0 {
		return errors.New(errors.ErrTransactionFail, "transaction reverted")
	}

	return nil
}

func (s *service) GetUserHistory(ctx context.Context, userAddr string, limit int) ([]*Bet, error) {
	// Implementation for getting user history
	return nil, nil
}

func (s *service) GetUserStats(ctx context.Context, userAddr string) (*Stats, error) {
	// Implementation for getting user stats
	return nil, nil
}
