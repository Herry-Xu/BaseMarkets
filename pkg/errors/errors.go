package errors

import "fmt"

type ErrorCode string

const (
	// Chain related errors
	ErrChainNotSupported ErrorCode = "CHAIN_NOT_SUPPORTED"
	ErrChainDisabled     ErrorCode = "CHAIN_DISABLED"

	// Price related errors
	ErrPriceNotAvailable ErrorCode = "PRICE_NOT_AVAILABLE"
	ErrPriceStale        ErrorCode = "PRICE_STALE"

	// Round related errors
	ErrRoundNotFound     ErrorCode = "ROUND_NOT_FOUND"
	ErrRoundNotStarted   ErrorCode = "ROUND_NOT_STARTED"
	ErrRoundAlreadyEnded ErrorCode = "ROUND_ALREADY_ENDED"
	ErrRoundNotClosed    ErrorCode = "ROUND_NOT_CLOSED"

	// Bet related errors
	ErrInvalidBetAmount ErrorCode = "INVALID_BET_AMOUNT"
	ErrBetNotFound      ErrorCode = "BET_NOT_FOUND"
	ErrAlreadyClaimed   ErrorCode = "ALREADY_CLAIMED"
	ErrBetTooSmall      ErrorCode = "BET_TOO_SMALL"
	ErrBetTooLarge      ErrorCode = "BET_TOO_LARGE"
	ErrRoundLocked      ErrorCode = "ROUND_LOCKED"
	ErrInvalidAddress   ErrorCode = "INVALID_ADDRESS"
	ErrTransactionFail  ErrorCode = "TRANSACTION_FAILED"
	ErrNoReward         ErrorCode = "NO_REWARD_AVAILABLE"
	ErrInsufficientFund ErrorCode = "INSUFFICIENT_FUNDS"
)

type Error struct {
	Code    ErrorCode
	Message string
	Err     error
}

func (e *Error) Error() string {
	if e.Err != nil {
		return fmt.Sprintf("%s: %s (%v)", e.Code, e.Message, e.Err)
	}
	return fmt.Sprintf("%s: %s", e.Code, e.Message)
}

func New(code ErrorCode, message string) *Error {
	return &Error{
		Code:    code,
		Message: message,
	}
}

func Wrap(code ErrorCode, message string, err error) *Error {
	return &Error{
		Code:    code,
		Message: message,
		Err:     err,
	}
}
