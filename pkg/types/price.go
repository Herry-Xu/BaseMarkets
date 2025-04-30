package types

import (
	"math/big"
)

// PriceData represents price information for a trading pair
type PriceData struct {
	PairID    string   `json:"pairId"`
	Price     *Decimal `json:"price"`
	Timestamp int64    `json:"timestamp"`
	Decimals  int      `json:"decimals"`
}

// Ensure you have a Decimal type or use *big.Int directly
type Decimal struct {
	*big.Int
}

func NewDecimal(value int64, decimals int) *Decimal {
	// Create a new decimal with the given value and decimals
	// For example, NewDecimal(1234, 2) would represent 12.34
	multiplier := new(big.Int).Exp(big.NewInt(10), big.NewInt(int64(decimals)), nil)
	result := new(big.Int).Mul(big.NewInt(value), multiplier)
	return &Decimal{result}
}
