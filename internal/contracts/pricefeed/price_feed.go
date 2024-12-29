// Code generated - DO NOT EDIT.
// This file is a generated binding and any manual changes will be lost.

package pricefeed

import (
	"errors"
	"math/big"
	"strings"

	ethereum "github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/event"
)

// Reference imports to suppress errors if they are not otherwise used.
var (
	_ = errors.New
	_ = big.NewInt
	_ = strings.NewReader
	_ = ethereum.NotFound
	_ = bind.Bind
	_ = common.Big1
	_ = types.BloomLookup
	_ = event.NewSubscription
	_ = abi.ConvertType
)

// PricefeedMetaData contains all meta data concerning the Pricefeed contract.
var PricefeedMetaData = &bind.MetaData{
	ABI: "[{\"inputs\":[],\"name\":\"decimals\",\"outputs\":[{\"internalType\":\"uint8\",\"name\":\"\",\"type\":\"uint8\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"description\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint80\",\"name\":\"_roundId\",\"type\":\"uint80\"}],\"name\":\"getRoundData\",\"outputs\":[{\"internalType\":\"uint80\",\"name\":\"roundId\",\"type\":\"uint80\"},{\"internalType\":\"int256\",\"name\":\"answer\",\"type\":\"int256\"},{\"internalType\":\"uint256\",\"name\":\"startedAt\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"updatedAt\",\"type\":\"uint256\"},{\"internalType\":\"uint80\",\"name\":\"answeredInRound\",\"type\":\"uint80\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"latestRoundData\",\"outputs\":[{\"internalType\":\"uint80\",\"name\":\"roundId\",\"type\":\"uint80\"},{\"internalType\":\"int256\",\"name\":\"answer\",\"type\":\"int256\"},{\"internalType\":\"uint256\",\"name\":\"startedAt\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"updatedAt\",\"type\":\"uint256\"},{\"internalType\":\"uint80\",\"name\":\"answeredInRound\",\"type\":\"uint80\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"version\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"}]",
}

// PricefeedABI is the input ABI used to generate the binding from.
// Deprecated: Use PricefeedMetaData.ABI instead.
var PricefeedABI = PricefeedMetaData.ABI

// Pricefeed is an auto generated Go binding around an Ethereum contract.
type Pricefeed struct {
	PricefeedCaller     // Read-only binding to the contract
	PricefeedTransactor // Write-only binding to the contract
	PricefeedFilterer   // Log filterer for contract events
}

// PricefeedCaller is an auto generated read-only Go binding around an Ethereum contract.
type PricefeedCaller struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// PricefeedTransactor is an auto generated write-only Go binding around an Ethereum contract.
type PricefeedTransactor struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// PricefeedFilterer is an auto generated log filtering Go binding around an Ethereum contract events.
type PricefeedFilterer struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// PricefeedSession is an auto generated Go binding around an Ethereum contract,
// with pre-set call and transact options.
type PricefeedSession struct {
	Contract     *Pricefeed        // Generic contract binding to set the session for
	CallOpts     bind.CallOpts     // Call options to use throughout this session
	TransactOpts bind.TransactOpts // Transaction auth options to use throughout this session
}

// PricefeedCallerSession is an auto generated read-only Go binding around an Ethereum contract,
// with pre-set call options.
type PricefeedCallerSession struct {
	Contract *PricefeedCaller // Generic contract caller binding to set the session for
	CallOpts bind.CallOpts    // Call options to use throughout this session
}

// PricefeedTransactorSession is an auto generated write-only Go binding around an Ethereum contract,
// with pre-set transact options.
type PricefeedTransactorSession struct {
	Contract     *PricefeedTransactor // Generic contract transactor binding to set the session for
	TransactOpts bind.TransactOpts    // Transaction auth options to use throughout this session
}

// PricefeedRaw is an auto generated low-level Go binding around an Ethereum contract.
type PricefeedRaw struct {
	Contract *Pricefeed // Generic contract binding to access the raw methods on
}

// PricefeedCallerRaw is an auto generated low-level read-only Go binding around an Ethereum contract.
type PricefeedCallerRaw struct {
	Contract *PricefeedCaller // Generic read-only contract binding to access the raw methods on
}

// PricefeedTransactorRaw is an auto generated low-level write-only Go binding around an Ethereum contract.
type PricefeedTransactorRaw struct {
	Contract *PricefeedTransactor // Generic write-only contract binding to access the raw methods on
}

// NewPricefeed creates a new instance of Pricefeed, bound to a specific deployed contract.
func NewPricefeed(address common.Address, backend bind.ContractBackend) (*Pricefeed, error) {
	contract, err := bindPricefeed(address, backend, backend, backend)
	if err != nil {
		return nil, err
	}
	return &Pricefeed{PricefeedCaller: PricefeedCaller{contract: contract}, PricefeedTransactor: PricefeedTransactor{contract: contract}, PricefeedFilterer: PricefeedFilterer{contract: contract}}, nil
}

// NewPricefeedCaller creates a new read-only instance of Pricefeed, bound to a specific deployed contract.
func NewPricefeedCaller(address common.Address, caller bind.ContractCaller) (*PricefeedCaller, error) {
	contract, err := bindPricefeed(address, caller, nil, nil)
	if err != nil {
		return nil, err
	}
	return &PricefeedCaller{contract: contract}, nil
}

// NewPricefeedTransactor creates a new write-only instance of Pricefeed, bound to a specific deployed contract.
func NewPricefeedTransactor(address common.Address, transactor bind.ContractTransactor) (*PricefeedTransactor, error) {
	contract, err := bindPricefeed(address, nil, transactor, nil)
	if err != nil {
		return nil, err
	}
	return &PricefeedTransactor{contract: contract}, nil
}

// NewPricefeedFilterer creates a new log filterer instance of Pricefeed, bound to a specific deployed contract.
func NewPricefeedFilterer(address common.Address, filterer bind.ContractFilterer) (*PricefeedFilterer, error) {
	contract, err := bindPricefeed(address, nil, nil, filterer)
	if err != nil {
		return nil, err
	}
	return &PricefeedFilterer{contract: contract}, nil
}

// bindPricefeed binds a generic wrapper to an already deployed contract.
func bindPricefeed(address common.Address, caller bind.ContractCaller, transactor bind.ContractTransactor, filterer bind.ContractFilterer) (*bind.BoundContract, error) {
	parsed, err := PricefeedMetaData.GetAbi()
	if err != nil {
		return nil, err
	}
	return bind.NewBoundContract(address, *parsed, caller, transactor, filterer), nil
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_Pricefeed *PricefeedRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _Pricefeed.Contract.PricefeedCaller.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_Pricefeed *PricefeedRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _Pricefeed.Contract.PricefeedTransactor.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_Pricefeed *PricefeedRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _Pricefeed.Contract.PricefeedTransactor.contract.Transact(opts, method, params...)
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_Pricefeed *PricefeedCallerRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _Pricefeed.Contract.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_Pricefeed *PricefeedTransactorRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _Pricefeed.Contract.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_Pricefeed *PricefeedTransactorRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _Pricefeed.Contract.contract.Transact(opts, method, params...)
}

// Decimals is a free data retrieval call binding the contract method 0x313ce567.
//
// Solidity: function decimals() view returns(uint8)
func (_Pricefeed *PricefeedCaller) Decimals(opts *bind.CallOpts) (uint8, error) {
	var out []interface{}
	err := _Pricefeed.contract.Call(opts, &out, "decimals")

	if err != nil {
		return *new(uint8), err
	}

	out0 := *abi.ConvertType(out[0], new(uint8)).(*uint8)

	return out0, err

}

// Decimals is a free data retrieval call binding the contract method 0x313ce567.
//
// Solidity: function decimals() view returns(uint8)
func (_Pricefeed *PricefeedSession) Decimals() (uint8, error) {
	return _Pricefeed.Contract.Decimals(&_Pricefeed.CallOpts)
}

// Decimals is a free data retrieval call binding the contract method 0x313ce567.
//
// Solidity: function decimals() view returns(uint8)
func (_Pricefeed *PricefeedCallerSession) Decimals() (uint8, error) {
	return _Pricefeed.Contract.Decimals(&_Pricefeed.CallOpts)
}

// Description is a free data retrieval call binding the contract method 0x7284e416.
//
// Solidity: function description() view returns(string)
func (_Pricefeed *PricefeedCaller) Description(opts *bind.CallOpts) (string, error) {
	var out []interface{}
	err := _Pricefeed.contract.Call(opts, &out, "description")

	if err != nil {
		return *new(string), err
	}

	out0 := *abi.ConvertType(out[0], new(string)).(*string)

	return out0, err

}

// Description is a free data retrieval call binding the contract method 0x7284e416.
//
// Solidity: function description() view returns(string)
func (_Pricefeed *PricefeedSession) Description() (string, error) {
	return _Pricefeed.Contract.Description(&_Pricefeed.CallOpts)
}

// Description is a free data retrieval call binding the contract method 0x7284e416.
//
// Solidity: function description() view returns(string)
func (_Pricefeed *PricefeedCallerSession) Description() (string, error) {
	return _Pricefeed.Contract.Description(&_Pricefeed.CallOpts)
}

// GetRoundData is a free data retrieval call binding the contract method 0x9a6fc8f5.
//
// Solidity: function getRoundData(uint80 _roundId) view returns(uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)
func (_Pricefeed *PricefeedCaller) GetRoundData(opts *bind.CallOpts, _roundId *big.Int) (struct {
	RoundId         *big.Int
	Answer          *big.Int
	StartedAt       *big.Int
	UpdatedAt       *big.Int
	AnsweredInRound *big.Int
}, error) {
	var out []interface{}
	err := _Pricefeed.contract.Call(opts, &out, "getRoundData", _roundId)

	outstruct := new(struct {
		RoundId         *big.Int
		Answer          *big.Int
		StartedAt       *big.Int
		UpdatedAt       *big.Int
		AnsweredInRound *big.Int
	})
	if err != nil {
		return *outstruct, err
	}

	outstruct.RoundId = *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)
	outstruct.Answer = *abi.ConvertType(out[1], new(*big.Int)).(**big.Int)
	outstruct.StartedAt = *abi.ConvertType(out[2], new(*big.Int)).(**big.Int)
	outstruct.UpdatedAt = *abi.ConvertType(out[3], new(*big.Int)).(**big.Int)
	outstruct.AnsweredInRound = *abi.ConvertType(out[4], new(*big.Int)).(**big.Int)

	return *outstruct, err

}

// GetRoundData is a free data retrieval call binding the contract method 0x9a6fc8f5.
//
// Solidity: function getRoundData(uint80 _roundId) view returns(uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)
func (_Pricefeed *PricefeedSession) GetRoundData(_roundId *big.Int) (struct {
	RoundId         *big.Int
	Answer          *big.Int
	StartedAt       *big.Int
	UpdatedAt       *big.Int
	AnsweredInRound *big.Int
}, error) {
	return _Pricefeed.Contract.GetRoundData(&_Pricefeed.CallOpts, _roundId)
}

// GetRoundData is a free data retrieval call binding the contract method 0x9a6fc8f5.
//
// Solidity: function getRoundData(uint80 _roundId) view returns(uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)
func (_Pricefeed *PricefeedCallerSession) GetRoundData(_roundId *big.Int) (struct {
	RoundId         *big.Int
	Answer          *big.Int
	StartedAt       *big.Int
	UpdatedAt       *big.Int
	AnsweredInRound *big.Int
}, error) {
	return _Pricefeed.Contract.GetRoundData(&_Pricefeed.CallOpts, _roundId)
}

// LatestRoundData is a free data retrieval call binding the contract method 0xfeaf968c.
//
// Solidity: function latestRoundData() view returns(uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)
func (_Pricefeed *PricefeedCaller) LatestRoundData(opts *bind.CallOpts) (struct {
	RoundId         *big.Int
	Answer          *big.Int
	StartedAt       *big.Int
	UpdatedAt       *big.Int
	AnsweredInRound *big.Int
}, error) {
	var out []interface{}
	err := _Pricefeed.contract.Call(opts, &out, "latestRoundData")

	outstruct := new(struct {
		RoundId         *big.Int
		Answer          *big.Int
		StartedAt       *big.Int
		UpdatedAt       *big.Int
		AnsweredInRound *big.Int
	})
	if err != nil {
		return *outstruct, err
	}

	outstruct.RoundId = *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)
	outstruct.Answer = *abi.ConvertType(out[1], new(*big.Int)).(**big.Int)
	outstruct.StartedAt = *abi.ConvertType(out[2], new(*big.Int)).(**big.Int)
	outstruct.UpdatedAt = *abi.ConvertType(out[3], new(*big.Int)).(**big.Int)
	outstruct.AnsweredInRound = *abi.ConvertType(out[4], new(*big.Int)).(**big.Int)

	return *outstruct, err

}

// LatestRoundData is a free data retrieval call binding the contract method 0xfeaf968c.
//
// Solidity: function latestRoundData() view returns(uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)
func (_Pricefeed *PricefeedSession) LatestRoundData() (struct {
	RoundId         *big.Int
	Answer          *big.Int
	StartedAt       *big.Int
	UpdatedAt       *big.Int
	AnsweredInRound *big.Int
}, error) {
	return _Pricefeed.Contract.LatestRoundData(&_Pricefeed.CallOpts)
}

// LatestRoundData is a free data retrieval call binding the contract method 0xfeaf968c.
//
// Solidity: function latestRoundData() view returns(uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)
func (_Pricefeed *PricefeedCallerSession) LatestRoundData() (struct {
	RoundId         *big.Int
	Answer          *big.Int
	StartedAt       *big.Int
	UpdatedAt       *big.Int
	AnsweredInRound *big.Int
}, error) {
	return _Pricefeed.Contract.LatestRoundData(&_Pricefeed.CallOpts)
}

// Version is a free data retrieval call binding the contract method 0x54fd4d50.
//
// Solidity: function version() view returns(uint256)
func (_Pricefeed *PricefeedCaller) Version(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _Pricefeed.contract.Call(opts, &out, "version")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// Version is a free data retrieval call binding the contract method 0x54fd4d50.
//
// Solidity: function version() view returns(uint256)
func (_Pricefeed *PricefeedSession) Version() (*big.Int, error) {
	return _Pricefeed.Contract.Version(&_Pricefeed.CallOpts)
}

// Version is a free data retrieval call binding the contract method 0x54fd4d50.
//
// Solidity: function version() view returns(uint256)
func (_Pricefeed *PricefeedCallerSession) Version() (*big.Int, error) {
	return _Pricefeed.Contract.Version(&_Pricefeed.CallOpts)
}
