// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title YieldForgeToken ($YFORGE)
 * @notice Governance and utility token for YieldForge platform
 * @dev ERC20 token with burning capability for deflationary tokenomics
 */
contract YieldForgeToken is ERC20, ERC20Burnable, Ownable {
    
    // Token distribution
    uint256 public constant TOTAL_SUPPLY = 1_000_000_000 * 10**18; // 1 billion tokens
    uint256 public constant TEAM_ALLOCATION = 200_000_000 * 10**18; // 20%
    uint256 public constant COMMUNITY_ALLOCATION = 300_000_000 * 10**18; // 30%
    uint256 public constant LIQUIDITY_ALLOCATION = 200_000_000 * 10**18; // 20%
    uint256 public constant TREASURY_ALLOCATION = 300_000_000 * 10**18; // 30%

    // Vesting
    mapping(address => VestingSchedule) public vestingSchedules;
    
    struct VestingSchedule {
        uint256 totalAmount;
        uint256 releasedAmount;
        uint256 startTime;
        uint256 duration;
    }

    // Staking
    mapping(address => StakeInfo) public stakes;
    uint256 public totalStaked;
    uint256 public rewardRate = 1000; // 10% APY in basis points

    struct StakeInfo {
        uint256 amount;
        uint256 startTime;
        uint256 lastClaimTime;
    }

    // Events
    event TokensStaked(address indexed user, uint256 amount);
    event TokensUnstaked(address indexed user, uint256 amount);
    event RewardsClaimed(address indexed user, uint256 amount);
    event VestingScheduleCreated(address indexed beneficiary, uint256 amount, uint256 duration);

    constructor() ERC20("YieldForge Token", "YFORGE") Ownable(msg.sender) {
        // Mint total supply to contract deployer
        _mint(msg.sender, TOTAL_SUPPLY);
    }

    /**
     * @notice Stake tokens to earn rewards
     * @param amount Amount of tokens to stake
     */
    function stake(uint256 amount) external {
        require(amount > 0, "Amount must be > 0");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");

        // Claim pending rewards first
        if (stakes[msg.sender].amount > 0) {
            _claimRewards(msg.sender);
        }

        // Transfer tokens to contract
        _transfer(msg.sender, address(this), amount);

        // Update stake info
        stakes[msg.sender].amount += amount;
        stakes[msg.sender].startTime = block.timestamp;
        stakes[msg.sender].lastClaimTime = block.timestamp;
        totalStaked += amount;

        emit TokensStaked(msg.sender, amount);
    }

    /**
     * @notice Unstake tokens
     * @param amount Amount of tokens to unstake
     */
    function unstake(uint256 amount) external {
        require(amount > 0, "Amount must be > 0");
        require(stakes[msg.sender].amount >= amount, "Insufficient staked");

        // Claim pending rewards first
        _claimRewards(msg.sender);

        // Update stake info
        stakes[msg.sender].amount -= amount;
        totalStaked -= amount;

        // Transfer tokens back to user
        _transfer(address(this), msg.sender, amount);

        emit TokensUnstaked(msg.sender, amount);
    }

    /**
     * @notice Claim staking rewards
     */
    function claimRewards() external {
        require(stakes[msg.sender].amount > 0, "No stake");
        _claimRewards(msg.sender);
    }

    /**
     * @notice Internal function to claim rewards
     */
    function _claimRewards(address user) internal {
        StakeInfo storage stakeInfo = stakes[user];
        
        uint256 timeStaked = block.timestamp - stakeInfo.lastClaimTime;
        uint256 rewards = (stakeInfo.amount * timeStaked * rewardRate) / (365 days * 10000);

        if (rewards > 0) {
            stakeInfo.lastClaimTime = block.timestamp;
            _mint(user, rewards); // Mint new tokens as rewards
            emit RewardsClaimed(user, rewards);
        }
    }

    /**
     * @notice Create vesting schedule for team/advisors
     * @param beneficiary Address of the beneficiary
     * @param amount Total amount to vest
     * @param duration Vesting duration in seconds
     */
    function createVestingSchedule(
        address beneficiary,
        uint256 amount,
        uint256 duration
    ) external onlyOwner {
        require(beneficiary != address(0), "Invalid beneficiary");
        require(amount > 0, "Amount must be > 0");
        require(duration > 0, "Duration must be > 0");
        require(vestingSchedules[beneficiary].totalAmount == 0, "Schedule exists");

        vestingSchedules[beneficiary] = VestingSchedule({
            totalAmount: amount,
            releasedAmount: 0,
            startTime: block.timestamp,
            duration: duration
        });

        emit VestingScheduleCreated(beneficiary, amount, duration);
    }

    /**
     * @notice Release vested tokens
     */
    function releaseVestedTokens() external {
        VestingSchedule storage schedule = vestingSchedules[msg.sender];
        require(schedule.totalAmount > 0, "No vesting schedule");

        uint256 vestedAmount = _calculateVestedAmount(msg.sender);
        uint256 releasable = vestedAmount - schedule.releasedAmount;
        
        require(releasable > 0, "No tokens to release");

        schedule.releasedAmount += releasable;
        _transfer(owner(), msg.sender, releasable);
    }

    /**
     * @notice Calculate vested amount
     */
    function _calculateVestedAmount(address beneficiary) internal view returns (uint256) {
        VestingSchedule memory schedule = vestingSchedules[beneficiary];
        
        if (block.timestamp < schedule.startTime) {
            return 0;
        }

        uint256 timeElapsed = block.timestamp - schedule.startTime;
        
        if (timeElapsed >= schedule.duration) {
            return schedule.totalAmount;
        }

        return (schedule.totalAmount * timeElapsed) / schedule.duration;
    }

    /**
     * @notice Get pending rewards for a user
     */
    function getPendingRewards(address user) external view returns (uint256) {
        StakeInfo memory stakeInfo = stakes[user];
        if (stakeInfo.amount == 0) return 0;

        uint256 timeStaked = block.timestamp - stakeInfo.lastClaimTime;
        return (stakeInfo.amount * timeStaked * rewardRate) / (365 days * 10000);
    }

    /**
     * @notice Get stake info for a user
     */
    function getStakeInfo(address user) external view returns (
        uint256 amount,
        uint256 startTime,
        uint256 pendingRewards
    ) {
        StakeInfo memory stakeInfo = stakes[user];
        uint256 timeStaked = block.timestamp - stakeInfo.lastClaimTime;
        uint256 pending = (stakeInfo.amount * timeStaked * rewardRate) / (365 days * 10000);
        
        return (stakeInfo.amount, stakeInfo.startTime, pending);
    }

    /**
     * @notice Update reward rate (only owner)
     */
    function setRewardRate(uint256 newRate) external onlyOwner {
        require(newRate <= 5000, "Rate too high"); // Max 50% APY
        rewardRate = newRate;
    }
}
