// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./interfaces/IPriceFeed.sol";

contract PredictionMarket is Ownable, Pausable, ReentrancyGuard {
    // Structs
    struct Round {
        uint256 epoch;
        string pairId;
        uint256 startTimestamp;
        uint256 lockTimestamp;
        uint256 closeTimestamp;
        int256 lockPrice;
        int256 closePrice;
        uint256 totalAmount;
        uint256 bullAmount;
        uint256 bearAmount;
        bool oracleCalled;
        bool closed;
    }

    struct UserBet {
        uint256 amount;
        bool claimed;
        bool bull; // true for UP, false for DOWN
    }

    struct PairConfig {
        string pairId;
        address priceFeed;
        bool enabled;
        uint256 minBetAmount;
        uint256 maxBetAmount;
    }

    // Constants
    uint256 public constant MAX_BET_AMOUNT = 1000 ether;
    uint256 public minBetAmount = 0.1 ether;
    uint256 public treasuryFee = 300; // 3%
    uint256 public constant MAX_TREASURY_FEE = 1000; // 10%
    uint256 public intervalSeconds = 5 minutes;
    uint256 public bufferSeconds = 30 seconds;

    // State variables
    uint256 public currentEpoch;
    uint256 public treasuryAmount;
    IPriceFeed public priceFeed;
    address public adminAddress;
    address public operatorAddress;

    // Mappings
    mapping(uint256 => Round) public rounds;
    mapping(uint256 => mapping(address => UserBet)) public ledger;
    mapping(string => PairConfig) public pairs;
    mapping(string => mapping(uint256 => Round)) public pairRounds;
    mapping(string => mapping(uint256 => mapping(address => UserBet))) public pairLedger;

    // Events
    event RoundStarted(uint256 indexed epoch);
    event BetBull(address indexed sender, uint256 indexed epoch, uint256 amount);
    event BetBear(address indexed sender, uint256 indexed epoch, uint256 amount);
    event Claim(address indexed sender, uint256 indexed epoch, uint256 amount);
    event RoundEnd(uint256 indexed epoch, int256 price);
    event StartRound(uint256 indexed epoch);
    event LockRound(uint256 indexed epoch, int256 price);
    event MarketReset();
    event GenesisRestart(uint256 indexed epoch);
    event NewAdminAddress(address admin);
    event NewOperatorAddress(address operator);
    event NewMinBetAmount(uint256 minBet);
    event NewTreasuryFee(uint256 fee);

    // Modifiers
    modifier onlyAdmin() {
        require(msg.sender == adminAddress, "Not admin");
        _;
    }

    modifier onlyOperator() {
        require(msg.sender == operatorAddress, "Not operator");
        _;
    }

    constructor(address _priceFeed) Ownable(msg.sender) {
        priceFeed = IPriceFeed(_priceFeed);
        adminAddress = msg.sender;  // Set deployer as admin
        operatorAddress = msg.sender;  // Set deployer as operator initially
    }

    function betBull(uint256 epoch) external payable whenNotPaused nonReentrant {
        require(msg.value >= minBetAmount, "Bet amount too small");
        require(msg.value <= MAX_BET_AMOUNT, "Bet amount too large");
        require(rounds[epoch].startTimestamp != 0, "Round not started");
        require(block.timestamp < rounds[epoch].lockTimestamp, "Round locked");
        
        // Record user's bet
        ledger[epoch][msg.sender] = UserBet({
            amount: msg.value,
            claimed: false,
            bull: true
        });
        
        rounds[epoch].bullAmount += msg.value;
        rounds[epoch].totalAmount += msg.value;
        
        emit BetBull(msg.sender, epoch, msg.value);
    }

    function betBear(uint256 epoch) external payable whenNotPaused nonReentrant {
        // Similar to betBull but for bear position
    }

    function claim(uint256 epoch) external nonReentrant {
        require(rounds[epoch].closed, "Round not closed");
        require(!ledger[epoch][msg.sender].claimed, "Already claimed");
        
        uint256 reward = calculateReward(epoch, msg.sender);
        require(reward > 0, "No reward");
        
        // Calculate and update treasury amount here
        Round memory round = rounds[epoch];
        UserBet memory bet = ledger[epoch][msg.sender];
        uint256 otherPoolAmount = bet.bull ? round.bearAmount : round.bullAmount;
        uint256 treasuryFeeAmount = (otherPoolAmount * treasuryFee) / 10000;
        treasuryAmount += treasuryFeeAmount;
        
        ledger[epoch][msg.sender].claimed = true;
        payable(msg.sender).transfer(reward);
        
        emit Claim(msg.sender, epoch, reward);
    }

    function executeRound() external {
        require(
            block.timestamp >= rounds[currentEpoch].closeTimestamp,
            "Round not ready for execution"
        );
        
        // Get final price from oracle
        int256 closePrice = priceFeed.getLatestPrice();
        rounds[currentEpoch].closePrice = closePrice;
        rounds[currentEpoch].closed = true;
        
        emit RoundEnd(currentEpoch, closePrice);
        
        // Start new round
        currentEpoch++;
        _startRound(currentEpoch);
    }

    // Internal functions
    function _startRound(uint256 epoch) internal {
        Round storage round = rounds[epoch];
        round.epoch = epoch;
        round.startTimestamp = block.timestamp;
        round.lockTimestamp = block.timestamp + intervalSeconds;
        round.closeTimestamp = block.timestamp + intervalSeconds + bufferSeconds;
        
        emit RoundStarted(epoch);
    }

    function calculateReward(uint256 epoch, address user) 
        internal 
        view 
        returns (uint256) 
    {
        require(rounds[epoch].closed, "Round not closed");
        UserBet memory bet = ledger[epoch][user];
        Round memory round = rounds[epoch];
        
        // If user did not bet or already claimed
        if (bet.amount == 0 || bet.claimed) {
            return 0;
        }
        
        // If oracle failed to get price
        if (!round.oracleCalled) {
            return bet.amount;
        }
        
        // Determine if user won
        bool won;
        if (round.closePrice == round.lockPrice) {
            return bet.amount; // Return original bet if prices are equal
        } else {
            won = (round.closePrice > round.lockPrice && bet.bull) || 
                  (round.closePrice < round.lockPrice && !bet.bull);
        }
        
        if (!won) {
            return 0;
        }
        
        // Calculate reward
        uint256 rewardAmount = bet.amount;
        uint256 poolAmount = bet.bull ? round.bullAmount : round.bearAmount;
        uint256 otherPoolAmount = bet.bull ? round.bearAmount : round.bullAmount;
        
        // Calculate share of the winning pool
        if (poolAmount > 0) {
            uint256 treasuryFeeAmount = (otherPoolAmount * treasuryFee) / 10000;
            uint256 totalReward = otherPoolAmount - treasuryFeeAmount;
            rewardAmount += (totalReward * bet.amount) / poolAmount;
        }
        
        return rewardAmount;
    }

    // Admin functions
    function setAdmin(address _adminAddress) external onlyOwner {
        require(_adminAddress != address(0), "Cannot be zero address");
        adminAddress = _adminAddress;
        emit NewAdminAddress(_adminAddress);
    }

    function setOperator(address _operatorAddress) external onlyAdmin {
        require(_operatorAddress != address(0), "Cannot be zero address");
        operatorAddress = _operatorAddress;
        emit NewOperatorAddress(_operatorAddress);
    }

    function setMinBetAmount(uint256 _minBetAmount) external onlyAdmin {
        minBetAmount = _minBetAmount;
        emit NewMinBetAmount(_minBetAmount);
    }

    function setTreasuryFee(uint256 _treasuryFee) external onlyAdmin {
        require(_treasuryFee <= MAX_TREASURY_FEE, "Treasury fee too high");
        treasuryFee = _treasuryFee;
        emit NewTreasuryFee(_treasuryFee);
    }

    function setIntervalSeconds(uint256 _intervalSeconds) external onlyOwner {
        intervalSeconds = _intervalSeconds;
    }

    function setBufferSeconds(uint256 _bufferSeconds) external onlyOwner {
        bufferSeconds = _bufferSeconds;
    }

    // Emergency functions
    function pause() external onlyAdmin {
        _pause();
    }

    function unpause() external onlyAdmin {
        _unpause();
    }

    function emergencyWithdraw() external onlyAdmin {
        require(paused(), "Not paused");
        uint256 balance = address(this).balance;
        if (balance > 0) {
            payable(adminAddress).transfer(balance);
        }
    }

    // Allow users to recover funds in emergency
    function userEmergencyWithdraw(uint256 epoch) external nonReentrant {
        require(paused(), "Not paused");
        UserBet storage bet = ledger[epoch][msg.sender];
        require(bet.amount > 0, "No bet");
        require(!bet.claimed, "Already claimed");
        
        bet.claimed = true;
        payable(msg.sender).transfer(bet.amount);
    }

    function withdrawTreasury() external onlyAdmin {
        require(treasuryAmount > 0, "Nothing to withdraw");
        uint256 amount = treasuryAmount;
        treasuryAmount = 0;
        payable(adminAddress).transfer(amount);
    }

    function genesisStartRound() external onlyOperator whenNotPaused {
        require(currentEpoch == 0, "Not in genesis state");
        require(treasuryAmount == 0, "Treasury not empty");
        
        currentEpoch = 1;
        _startRound(currentEpoch);
        
        emit GenesisRestart(currentEpoch);
    }

    function genesisLockRound() external onlyOperator whenNotPaused {
        require(currentEpoch == 1, "Can only run for genesis round");
        require(rounds[currentEpoch].startTimestamp != 0, "Round not started");
        require(block.timestamp >= rounds[currentEpoch].lockTimestamp, "Too early to lock");
        
        // Get price from oracle
        int256 currentPrice = priceFeed.getLatestPrice();
        
        Round storage round = rounds[currentEpoch];
        round.lockPrice = currentPrice;
        round.oracleCalled = true;
        
        emit LockRound(currentEpoch, currentPrice);
    }

    function resetMarket() external onlyAdmin {
        require(paused(), "Market must be paused");
        
        // Clear current round data
        if (rounds[currentEpoch].startTimestamp != 0) {
            Round storage currentRound = rounds[currentEpoch];
            require(currentRound.totalAmount == 0, "Current round has bets");
        }
        
        // Reset epoch counter
        currentEpoch = 0;
        
        // Clear treasury amount (should be withdrawn first)
        require(treasuryAmount == 0, "Withdraw treasury first");
        
        emit MarketReset();
    }

    function addPair(
        string memory _pairId,
        address _priceFeed,
        uint256 _minBet,
        uint256 _maxBet
    ) external onlyAdmin {
        require(!pairs[_pairId].enabled, "Pair already exists");
        pairs[_pairId] = PairConfig({
            pairId: _pairId,
            priceFeed: _priceFeed,
            enabled: true,
            minBetAmount: _minBet,
            maxBetAmount: _maxBet
        });
    }
} 