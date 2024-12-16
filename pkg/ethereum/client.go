package ethereum

import (
	"context"
	"crypto/ecdsa"
	"fmt"
	"math/big"
	"sync"
	"time"

	"prediction-market/pkg/utils"

	"github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/ethclient"
)

type Client struct {
	*ethclient.Client
	chainID *big.Int
	mu      sync.RWMutex
	config  *Config
}

type Config struct {
	RPCUrl     string
	ChainID    int64
	PrivateKey string
}

var (
	client *Client
	once   sync.Once
)

func NewClient(config *utils.Config) (*Client, error) {
	var err error
	once.Do(func() {
		var ethClient *ethclient.Client
		ethClient, err = ethclient.Dial(config.NodeURL)
		if err != nil {
			return
		}

		chainID, err := ethClient.ChainID(context.Background())
		if err != nil {
			return
		}

		if chainID.Int64() != config.ChainID {
			err = fmt.Errorf("chain ID mismatch: got %d, want %d", chainID.Int64(), config.ChainID)
			return
		}

		client = &Client{
			Client:  ethClient,
			chainID: chainID,
			config: &Config{
				RPCUrl:     config.NodeURL,
				ChainID:    config.ChainID,
				PrivateKey: config.PrivateKey,
			},
		}
	})

	if err != nil {
		return nil, fmt.Errorf("failed to initialize ethereum client: %w", err)
	}

	return client, nil
}

func (c *Client) GetLatestBlockNumber() (uint64, error) {
	return c.BlockNumber(context.Background())
}

func (c *Client) GetChainID() *big.Int {
	c.mu.RLock()
	defer c.mu.RUnlock()
	return c.chainID
}

func (c *Client) IsContract(address common.Address) (bool, error) {
	code, err := c.CodeAt(context.Background(), address, nil)
	if err != nil {
		return false, err
	}
	return len(code) > 0, nil
}

// GetCallOpts returns CallOpts for read operations
func (c *Client) GetCallOpts(ctx context.Context) *bind.CallOpts {
	return &bind.CallOpts{
		Pending: false,
		Context: ctx,
	}
}

// GetTransactOpts returns TransactOpts for write operations
func (c *Client) GetTransactOpts(ctx context.Context) (*bind.TransactOpts, error) {
	privateKey, err := crypto.HexToECDSA(c.config.PrivateKey)
	if err != nil {
		return nil, fmt.Errorf("invalid private key: %w", err)
	}

	publicKey := privateKey.Public()
	publicKeyECDSA, ok := publicKey.(*ecdsa.PublicKey)
	if !ok {
		return nil, fmt.Errorf("error casting public key to ECDSA")
	}

	fromAddress := crypto.PubkeyToAddress(*publicKeyECDSA)
	nonce, err := c.PendingNonceAt(ctx, fromAddress)
	if err != nil {
		return nil, fmt.Errorf("failed to get nonce: %w", err)
	}

	gasPrice, err := c.SuggestGasPrice(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to suggest gas price: %w", err)
	}

	auth, err := bind.NewKeyedTransactorWithChainID(privateKey, c.chainID)
	if err != nil {
		return nil, fmt.Errorf("failed to create transactor: %w", err)
	}

	auth.Nonce = big.NewInt(int64(nonce))
	auth.Value = big.NewInt(0)
	auth.GasLimit = uint64(300000)
	auth.GasPrice = gasPrice
	auth.Context = ctx

	return auth, nil
}

// WaitForTransaction waits for transaction receipt
func (c *Client) WaitForTransaction(ctx context.Context, txHash common.Hash) (*types.Receipt, error) {
	queryTicker := time.NewTicker(time.Second)
	defer queryTicker.Stop()

	for {
		receipt, err := c.TransactionReceipt(ctx, txHash)
		if err == nil {
			return receipt, nil
		}

		if err != ethereum.NotFound {
			return nil, fmt.Errorf("failed to get transaction receipt: %w", err)
		}

		select {
		case <-ctx.Done():
			return nil, ctx.Err()
		case <-queryTicker.C:
			continue
		}
	}
}
