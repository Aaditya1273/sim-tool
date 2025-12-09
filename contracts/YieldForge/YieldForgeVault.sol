// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title YieldForgeVault
 * @notice Main vault contract for YieldForge yield optimization
 * @dev Manages user deposits, yield strategies, and automated rebalancing
 */
contract YieldForgeVault is Ownable, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    // Vault state
    struct UserDeposit {
        uint256 amount;
        uint256 shares;
        uint256 depositTime;
        uint256 lastHarvestTime;
    }

    struct Strategy {
        address strategyAddress;
        uint256 allocation; // Percentage in basis points (10000 = 100%)
        bool active;
        uint256 totalDeposited;
    }

    // State variables
    IERC20 public immutable depositToken;
    mapping(address => UserDeposit) public userDeposits;
    mapping(uint256 => Strategy) public strategies;
    uint256 public strategyCount;
    uint256 public totalShares;
    uint256 public totalAssets;
    uint256 public performanceFee = 50; // 0.5% in basis points
    address public feeRecipient;

    // Events
    event Deposit(address indexed user, uint256 amount, uint256 shares);
    event Withdraw(address indexed user, uint256 amount, uint256 shares);
    event StrategyAdded(uint256 indexed strategyId, address strategyAddress, uint256 allocation);
    event StrategyUpdated(uint256 indexed strategyId, uint256 newAllocation);
    event Harvest(address indexed user, uint256 yield);
    event PerformanceFeeUpdated(uint256 newFee);

    constructor(
        address _depositToken,
        address _feeRecipient
    ) Ownable(msg.sender) {
        require(_depositToken != address(0), "Invalid token");
        require(_feeRecipient != address(0), "Invalid fee recipient");
        
        depositToken = IERC20(_depositToken);
        feeRecipient = _feeRecipient;
    }

    /**
     * @notice Deposit tokens into the vault
     * @param amount Amount of tokens to deposit
     */
    function deposit(uint256 amount) external nonReentrant whenNotPaused {
        require(amount > 0, "Amount must be > 0");

        // Calculate shares
        uint256 shares = totalShares == 0 
            ? amount 
            : (amount * totalShares) / totalAssets;

        // Update user deposit
        UserDeposit storage userDeposit = userDeposits[msg.sender];
        userDeposit.amount += amount;
        userDeposit.shares += shares;
        userDeposit.depositTime = block.timestamp;
        userDeposit.lastHarvestTime = block.timestamp;

        // Update totals
        totalShares += shares;
        totalAssets += amount;

        // Transfer tokens
        depositToken.safeTransferFrom(msg.sender, address(this), amount);

        emit Deposit(msg.sender, amount, shares);
    }

    /**
     * @notice Withdraw tokens from the vault
     * @param shares Amount of shares to withdraw
     */
    function withdraw(uint256 shares) external nonReentrant {
        UserDeposit storage userDeposit = userDeposits[msg.sender];
        require(shares > 0 && shares <= userDeposit.shares, "Invalid shares");

        // Calculate withdrawal amount
        uint256 amount = (shares * totalAssets) / totalShares;

        // Update user deposit
        userDeposit.amount -= amount;
        userDeposit.shares -= shares;

        // Update totals
        totalShares -= shares;
        totalAssets -= amount;

        // Transfer tokens
        depositToken.safeTransfer(msg.sender, amount);

        emit Withdraw(msg.sender, amount, shares);
    }

    /**
     * @notice Add a new yield strategy
     * @param strategyAddress Address of the strategy contract
     * @param allocation Allocation percentage in basis points
     */
    function addStrategy(
        address strategyAddress,
        uint256 allocation
    ) external onlyOwner {
        require(strategyAddress != address(0), "Invalid strategy");
        require(allocation <= 10000, "Allocation > 100%");

        strategies[strategyCount] = Strategy({
            strategyAddress: strategyAddress,
            allocation: allocation,
            active: true,
            totalDeposited: 0
        });

        emit StrategyAdded(strategyCount, strategyAddress, allocation);
        strategyCount++;
    }

    /**
     * @notice Update strategy allocation
     * @param strategyId ID of the strategy
     * @param newAllocation New allocation percentage
     */
    function updateStrategyAllocation(
        uint256 strategyId,
        uint256 newAllocation
    ) external onlyOwner {
        require(strategyId < strategyCount, "Invalid strategy");
        require(newAllocation <= 10000, "Allocation > 100%");

        strategies[strategyId].allocation = newAllocation;
        emit StrategyUpdated(strategyId, newAllocation);
    }

    /**
     * @notice Harvest yield for a user
     * @dev Called by AI agent to optimize yields
     */
    function harvest(address user) external nonReentrant returns (uint256) {
        UserDeposit storage userDeposit = userDeposits[user];
        require(userDeposit.amount > 0, "No deposit");

        // Calculate yield (simplified - in production, query actual strategies)
        uint256 timeSinceLastHarvest = block.timestamp - userDeposit.lastHarvestTime;
        uint256 yield = (userDeposit.amount * timeSinceLastHarvest * 12) / (365 days * 100); // ~12% APY

        if (yield > 0) {
            // Deduct performance fee
            uint256 fee = (yield * performanceFee) / 10000;
            uint256 userYield = yield - fee;

            // Update user deposit
            userDeposit.amount += userYield;
            userDeposit.lastHarvestTime = block.timestamp;

            // Update total assets
            totalAssets += userYield;

            // Transfer fee
            if (fee > 0) {
                depositToken.safeTransfer(feeRecipient, fee);
            }

            emit Harvest(user, userYield);
            return userYield;
        }

        return 0;
    }

    /**
     * @notice Get user's current balance including yield
     */
    function getUserBalance(address user) external view returns (uint256) {
        UserDeposit memory userDeposit = userDeposits[user];
        if (userDeposit.shares == 0) return 0;
        
        return (userDeposit.shares * totalAssets) / totalShares;
    }

    /**
     * @notice Update performance fee
     */
    function setPerformanceFee(uint256 newFee) external onlyOwner {
        require(newFee <= 1000, "Fee too high"); // Max 10%
        performanceFee = newFee;
        emit PerformanceFeeUpdated(newFee);
    }

    /**
     * @notice Pause deposits (emergency)
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @notice Unpause deposits
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @notice Get vault statistics
     */
    function getVaultStats() external view returns (
        uint256 _totalAssets,
        uint256 _totalShares,
        uint256 _strategyCount,
        uint256 _performanceFee
    ) {
        return (totalAssets, totalShares, strategyCount, performanceFee);
    }
}