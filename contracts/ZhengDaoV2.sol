// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ZhengDao V2 - 证道打卡激励系统 (双池版本)
 * @notice 实现奖金池 + 积分池的双池机制
 * @dev 包含防止一家独大、积分系统、等级系统等功能
 */
contract ZhengDaoV2 {
    // ==================== 状态变量 ====================
    
    address public owner;
    
    // 池子余额
    uint256 public rewardPool;      // 奖金池
    uint256 public pointsPool;      // 积分池
    uint256 public totalDeposits;   // 总存款
    
    // 费率配置 (基点，10000 = 100%)
    uint256 public constant REWARD_POOL_RATE = 200;     // 2%
    uint256 public constant POINTS_POOL_RATE = 300;     // 3%
    uint256 public constant PRINCIPAL_RATE = 9500;      // 95%
    uint256 public constant DEPOSIT_FEE = 500;          // 5%
    uint256 public constant WITHDRAW_FEE = 200;         // 2%
    
    // PVP 配置
    uint256 public constant PVP_PENALTY_RATE = 1000;    // 10%
    uint256 public constant PVP_TIMEOUT = 48 hours;
    
    // 收益配置
    uint256 public constant BASE_YIELD_RATE = 50;       // 0.5%
    
    // 积分配置
    uint256 public constant BASE_POINTS = 100;          // 基础积分
    uint256 public constant STREAK_BONUS = 10;          // 连续打卡加成
    uint256 public constant MAX_STREAK_BONUS = 100;     // 最大连续加成
    uint256 public constant REFERRAL_POINTS = 500;      // 邀请奖励
    
    // ==================== 数据结构 ====================
    
    struct UserData {
        uint256 principalAmount;    // 本金
        uint256 totalBalance;       // 总余额（本金 + 虚拟收益）
        uint256 lastCheckInTime;    // 最后打卡时间
        uint256 checkInCount;       // 打卡次数
        uint256 consecutiveDays;    // 连续打卡天数
        uint256 points;             // 积分
        uint256 level;              // 等级
        address referrer;           // 推荐人
        bool isNewbie;              // 是否新手（前30天）
        uint256 joinTime;           // 加入时间
    }
    
    struct DailyReward {
        uint256 totalAmount;        // 当日奖金总额
        uint256 totalWeight;        // 当日总权重
        mapping(address => uint256) userWeights;  // 用户权重
        address[] participants;     // 参与者列表
    }
    
    // 等级配置
    struct Level {
        uint256 requiredPoints;     // 所需积分
        string title;               // 称号
        uint256 rewardBonus;        // 奖金加成 (基点)
    }
    
    // ==================== 映射 ====================
    
    mapping(address => UserData) public users;
    mapping(uint256 => DailyReward) public dailyRewards;  // 日期 => 每日奖励
    mapping(uint256 => Level) public levels;              // 等级配置
    mapping(address => mapping(address => bool)) public referrals;  // 推荐关系
    
    // 统计数据
    uint256 public totalUsers;
    uint256 public activeUsers;
    uint256 public totalCheckIns;
    
    // ==================== 事件 ====================
    
    event Deposit(address indexed user, uint256 amount, uint256 toRewardPool, uint256 toPointsPool);
    event CheckIn(address indexed user, uint256 points, uint256 consecutiveDays);
    event Withdraw(address indexed user, uint256 amount, uint256 fee);
    event RewardClaimed(address indexed user, uint256 amount);
    event PointsExchanged(address indexed user, uint256 points, uint256 amount);
    event PVPPenalty(address indexed user, uint256 penalty, uint256 toRewardPool, uint256 toPointsPool);
    event LevelUp(address indexed user, uint256 newLevel, string title);
    event Referral(address indexed referrer, address indexed referee, uint256 points);
    
    // ==================== 修饰器 ====================
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    modifier userExists() {
        require(users[msg.sender].principalAmount > 0, "User not found");
        _;
    }
    
    // ==================== 构造函数 ====================
    
    constructor() {
        owner = msg.sender;
        
        // 初始化等级配置
        levels[1] = Level(0, "Beginner", 0);           // 初学者
        levels[2] = Level(1000, "Practitioner", 500);  // 修行者 +5%
        levels[3] = Level(5000, "Enlightened", 1000);  // 证道者 +10%
        levels[4] = Level(10000, "Master", 1500);      // 宗师 +15%
        levels[5] = Level(50000, "Saint", 2000);       // 圣者 +20%
        levels[6] = Level(100000, "Immortal", 3000);   // 仙人 +30%
    }
    
    // ==================== 核心功能 ====================
    
    /**
     * @notice 用户存款
     */
    function deposit() external payable {
        require(msg.value > 0, "Deposit amount must be greater than 0");
        
        uint256 depositAmount = msg.value;
        
        // 扣除手续费
        uint256 fee = (depositAmount * DEPOSIT_FEE) / 10000;
        uint256 netAmount = depositAmount - fee;
        
        // 分配到各个池子
        uint256 toRewardPool = (netAmount * REWARD_POOL_RATE) / 10000;
        uint256 toPointsPool = (netAmount * POINTS_POOL_RATE) / 10000;
        uint256 toPrincipal = (netAmount * PRINCIPAL_RATE) / 10000;
        
        rewardPool += toRewardPool;
        pointsPool += toPointsPool;
        
        UserData storage user = users[msg.sender];
        
        // 新用户
        if (user.principalAmount == 0) {
            totalUsers++;
            user.isNewbie = true;
            user.joinTime = block.timestamp;
            user.level = 1;
        }
        
        user.principalAmount += toPrincipal;
        user.totalBalance += toPrincipal;
        totalDeposits += toPrincipal;
        
        emit Deposit(msg.sender, depositAmount, toRewardPool, toPointsPool);
    }
    
    /**
     * @notice 用户打卡
     */
    function checkIn() external userExists {
        UserData storage user = users[msg.sender];
        
        // 检查是否可以打卡（每天只能打卡一次）
        require(
            block.timestamp >= user.lastCheckInTime + 1 days,
            "Already checked in today"
        );
        
        // 检查 PVP 惩罚
        if (user.lastCheckInTime > 0 && 
            block.timestamp > user.lastCheckInTime + PVP_TIMEOUT) {
            _applyPVPPenalty(msg.sender);
        }
        
        // 更新连续打卡天数
        if (block.timestamp <= user.lastCheckInTime + 2 days) {
            user.consecutiveDays++;
        } else {
            user.consecutiveDays = 1;
        }
        
        // 计算积分
        uint256 earnedPoints = _calculatePoints(msg.sender);
        user.points += earnedPoints;
        
        // 检查是否升级
        _checkLevelUp(msg.sender);
        
        // 计算虚拟收益
        uint256 yield = _calculateYield(msg.sender);
        user.totalBalance += yield;
        
        // 记录每日奖励权重
        uint256 today = block.timestamp / 1 days;
        DailyReward storage reward = dailyRewards[today];
        
        uint256 weight = _calculateWeight(msg.sender);
        reward.userWeights[msg.sender] = weight;
        reward.totalWeight += weight;
        reward.participants.push(msg.sender);
        
        // 更新统计
        user.lastCheckInTime = block.timestamp;
        user.checkInCount++;
        totalCheckIns++;
        
        emit CheckIn(msg.sender, earnedPoints, user.consecutiveDays);
    }
    
    /**
     * @notice 领取每日奖励
     */
    function claimDailyReward(uint256 day) external userExists {
        DailyReward storage reward = dailyRewards[day];
        require(reward.userWeights[msg.sender] > 0, "No reward for this day");
        
        // 计算用户应得奖励
        uint256 userReward = (reward.totalAmount * reward.userWeights[msg.sender]) / reward.totalWeight;
        require(userReward > 0, "No reward to claim");
        
        // 重置权重，防止重复领取
        reward.userWeights[msg.sender] = 0;
        
        // 转账
        payable(msg.sender).transfer(userReward);
        
        emit RewardClaimed(msg.sender, userReward);
    }
    
    /**
     * @notice 提现
     */
    function withdraw(uint256 amount) external userExists {
        UserData storage user = users[msg.sender];
        require(amount <= user.totalBalance, "Insufficient balance");
        
        // 扣除手续费
        uint256 fee = (amount * WITHDRAW_FEE) / 10000;
        uint256 netAmount = amount - fee;
        
        // 手续费分配
        uint256 feeToReward = (fee * 3000) / 10000;  // 30%
        uint256 feeToPoints = (fee * 7000) / 10000;  // 70%
        
        rewardPool += feeToReward;
        pointsPool += feeToPoints;
        
        // 更新余额
        user.totalBalance -= amount;
        if (amount <= user.principalAmount) {
            user.principalAmount -= amount;
        } else {
            user.principalAmount = 0;
        }
        
        totalDeposits -= (amount > totalDeposits ? totalDeposits : amount);
        
        // 转账
        payable(msg.sender).transfer(netAmount);
        
        emit Withdraw(msg.sender, amount, fee);
    }
    
    /**
     * @notice 积分兑换 BNB
     */
    function exchangePointsForBNB(uint256 points) external userExists {
        UserData storage user = users[msg.sender];
        require(user.points >= points, "Insufficient points");
        require(points >= 10000, "Minimum 10000 points");
        
        // 兑换率: 10000 积分 = 0.1 BNB
        uint256 bnbAmount = (points * 1e17) / 10000;  // 0.1 BNB = 1e17 wei
        
        // 扣除手续费 10%
        uint256 fee = (bnbAmount * 1000) / 10000;
        uint256 netAmount = bnbAmount - fee;
        
        require(pointsPool >= netAmount, "Insufficient points pool");
        
        // 扣除积分
        user.points -= points;
        pointsPool -= netAmount;
        
        // 转账
        payable(msg.sender).transfer(netAmount);
        
        emit PointsExchanged(msg.sender, points, netAmount);
    }
    
    /**
     * @notice 推荐好友
     */
    function refer(address referee) external {
        require(referee != address(0), "Invalid referee");
        require(referee != msg.sender, "Cannot refer yourself");
        require(!referrals[msg.sender][referee], "Already referred");
        require(users[referee].principalAmount > 0, "Referee must deposit first");
        require(users[referee].referrer == address(0), "Referee already has referrer");
        
        // 记录推荐关系
        referrals[msg.sender][referee] = true;
        users[referee].referrer = msg.sender;
        
        // 奖励推荐人
        users[msg.sender].points += REFERRAL_POINTS;
        
        emit Referral(msg.sender, referee, REFERRAL_POINTS);
    }
    
    // ==================== 内部函数 ====================
    
    /**
     * @dev 计算积分
     */
    function _calculatePoints(address user) internal view returns (uint256) {
        UserData storage userData = users[user];
        
        // 基础积分
        uint256 points = BASE_POINTS;
        
        // 连续打卡加成
        uint256 streakBonus = userData.consecutiveDays * STREAK_BONUS;
        if (streakBonus > MAX_STREAK_BONUS) {
            streakBonus = MAX_STREAK_BONUS;
        }
        points += streakBonus;
        
        // 新手保护：双倍积分
        if (userData.isNewbie && block.timestamp < userData.joinTime + 30 days) {
            points *= 2;
        }
        
        // 大户限制：积分 -10%
        if (_isWhale(user)) {
            points = (points * 9000) / 10000;
        }
        
        return points;
    }
    
    /**
     * @dev 计算虚拟收益
     */
    function _calculateYield(address user) internal view returns (uint256) {
        UserData storage userData = users[user];
        
        // 基础收益
        uint256 yield = (userData.principalAmount * BASE_YIELD_RATE) / 10000;
        
        // 递减收益机制
        if (userData.checkInCount > 120) {
            yield = (yield * 8000) / 10000;  // 80%
        } else if (userData.checkInCount > 90) {
            yield = (yield * 8500) / 10000;  // 85%
        } else if (userData.checkInCount > 60) {
            yield = (yield * 9000) / 10000;  // 90%
        } else if (userData.checkInCount > 30) {
            yield = (yield * 9500) / 10000;  // 95%
        }
        
        return yield;
    }
    
    /**
     * @dev 计算权重
     */
    function _calculateWeight(address user) internal view returns (uint256) {
        UserData storage userData = users[user];
        
        // 基础权重 = 本金
        uint256 weight = userData.principalAmount;
        
        // 连续打卡加成（最高 2x）
        uint256 streakMultiplier = 10000 + (userData.consecutiveDays * 100);
        if (streakMultiplier > 20000) {
            streakMultiplier = 20000;
        }
        weight = (weight * streakMultiplier) / 10000;
        
        // 等级加成
        Level storage level = levels[userData.level];
        weight = (weight * (10000 + level.rewardBonus)) / 10000;
        
        // 新手保护：权重 +20%
        if (userData.isNewbie && block.timestamp < userData.joinTime + 30 days) {
            weight = (weight * 12000) / 10000;
        }
        
        // 大户限制：权重 -20%
        if (_isWhale(user)) {
            weight = (weight * 8000) / 10000;
        }
        
        return weight;
    }
    
    /**
     * @dev 检查是否升级
     */
    function _checkLevelUp(address user) internal {
        UserData storage userData = users[user];
        
        for (uint256 i = userData.level + 1; i <= 6; i++) {
            if (userData.points >= levels[i].requiredPoints) {
                userData.level = i;
                emit LevelUp(user, i, levels[i].title);
            } else {
                break;
            }
        }
    }
    
    /**
     * @dev 应用 PVP 惩罚
     */
    function _applyPVPPenalty(address user) internal {
        UserData storage userData = users[user];
        
        // 新手保护：免 PVP 惩罚
        if (userData.isNewbie && block.timestamp < userData.joinTime + 30 days) {
            return;
        }
        
        // 计算惩罚金额
        uint256 penalty = (userData.principalAmount * PVP_PENALTY_RATE) / 10000;
        
        // 扣除本金
        userData.principalAmount -= penalty;
        userData.totalBalance -= penalty;
        
        // 分配惩罚金额
        uint256 toReward = penalty / 2;
        uint256 toPoints = penalty / 2;
        
        rewardPool += toReward;
        pointsPool += toPoints;
        
        // 重置连续打卡
        userData.consecutiveDays = 0;
        
        emit PVPPenalty(user, penalty, toReward, toPoints);
    }
    
    /**
     * @dev 检查是否为大户
     */
    function _isWhale(address user) internal view returns (bool) {
        if (totalDeposits == 0) return false;
        return (users[user].principalAmount * 10000) / totalDeposits > 500;  // > 5%
    }
    
    // ==================== 查询函数 ====================
    
    function getUserData(address user) external view returns (
        uint256 principalAmount,
        uint256 totalBalance,
        uint256 lastCheckInTime,
        uint256 checkInCount,
        uint256 consecutiveDays,
        uint256 points,
        uint256 level
    ) {
        UserData storage userData = users[user];
        return (
            userData.principalAmount,
            userData.totalBalance,
            userData.lastCheckInTime,
            userData.checkInCount,
            userData.consecutiveDays,
            userData.points,
            userData.level
        );
    }
    
    function getYieldAmount(address user) external view returns (uint256) {
        UserData storage userData = users[user];
        return userData.totalBalance - userData.principalAmount;
    }
    
    function getLevelInfo(uint256 levelId) external view returns (
        uint256 requiredPoints,
        string memory title,
        uint256 rewardBonus
    ) {
        Level storage level = levels[levelId];
        return (level.requiredPoints, level.title, level.rewardBonus);
    }
    
    function getPoolBalances() external view returns (
        uint256 reward,
        uint256 points,
        uint256 total
    ) {
        return (rewardPool, pointsPool, totalDeposits);
    }
    
    // ==================== 管理函数 ====================
    
    /**
     * @notice 分配每日奖金到奖金池
     */
    function distributeDailyReward() external payable onlyOwner {
        require(msg.value > 0, "Amount must be greater than 0");
        
        uint256 today = block.timestamp / 1 days;
        dailyRewards[today].totalAmount += msg.value;
        rewardPool += msg.value;
    }
    
    /**
     * @notice 紧急提现（仅限 owner）
     */
    function emergencyWithdraw(uint256 amount) external onlyOwner {
        require(amount <= address(this).balance, "Insufficient balance");
        payable(owner).transfer(amount);
    }
    
    /**
     * @notice 演示后门：模拟打卡（仅限 owner）
     */
    function mockCheckIn(address user) external onlyOwner {
        require(users[user].principalAmount > 0, "User not found");
        
        UserData storage userData = users[user];
        userData.lastCheckInTime = block.timestamp;
        userData.checkInCount++;
        userData.consecutiveDays++;
        userData.points += BASE_POINTS;
        
        uint256 yield = _calculateYield(user);
        userData.totalBalance += yield;
    }
}
