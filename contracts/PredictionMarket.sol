// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./interfaces/IPriceFeed.sol";

contract PredictionMarket is Ownable, Pausable, ReentrancyGuard {
    struct Round {
        uint256 epoch;
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

    IPriceFeed public priceFeed;
    
    uint256 public currentEpoch;
    uint256 public intervalSeconds = 5 minutes;
    uint256 public bufferSeconds = 30 seconds;
    uint256 public minBetAmount = 1e18; // 1 USDC (assuming 18 decimals)
    uint256 public treasuryFee = 300; // 3%
    uint256 public constant MAX_TREASURY_FEE = 1000; // 10%
    uint256 public constant MAX_BET_AMOUNT = 10000e18; // 10000 USDC

    mapping(uint256 => Round) public rounds;
    mapping(uint256 => mapping(address => UserBet)) public ledger;

    event RoundStarted(uint256 indexed epoch);
    event BetBull(address indexed sender, uint256 indexed epoch, uint256 amount);
    event BetBear(address indexed sender, uint256 indexed epoch, uint256 amount);
    event Claim(address indexed sender, uint256 indexed epoch, uint256 amount);
    event RoundEnd(uint256 indexed epoch, int256 price);
    
    constructor(address _priceFeed) {
        priceFeed = IPriceFeed(_priceFeed);
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
            uint256 totalReward = otherPoolAmount * (10000 - treasuryFee) / 10000;
            rewardAmount += (totalReward * bet.amount) / poolAmount;
        }
        
        return rewardAmount;
    }

    // Admin functions
    address public adminAddress;
    address public operatorAddress;

    event NewAdminAddress(address admin);
    event NewOperatorAddress(address operator);
    event NewMinBetAmount(uint256 minBet);
    event NewTreasuryFee(uint256 fee);
    event Pause();
    event Unpause();

    modifier onlyAdmin() {
        require(msg.sender == adminAddress, "Not admin");
        _;
    }

    modifier onlyOperator() {
        require(msg.sender == operatorAddress, "Not operator");
        _;
    }

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
        emit Pause();
    }

    function unpause() external onlyAdmin {
        _unpause();
        emit Unpause();
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
} 