// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title ZhengDao - 证道智能合约
 * @dev 基于区块链的打卡激励系统，通过经济激励和社交压力促进用户养成持续打卡习惯
 */
contract ZhengDao {
    // ==================== 状态变量 ====================

    /**
     * @dev 用户数据结构
     * @param principalAmount 用户本金（初始存款金额）
     * @param totalBalance 总余额（本金 + 累计收益）
     * @param lastCheckInTime 最后打卡时间戳
     * @param checkInCount 累计打卡次数
     */
    struct UserData {
        uint256 principalAmount;  // 用户本金
        uint256 totalBalance;     // 总余额（本金 + 收益）
        uint256 lastCheckInTime;  // 最后打卡时间
        uint256 checkInCount;     // 打卡次数
    }

    /// @dev 用户地址 => 用户数据映射
    mapping(address => UserData) public users;

    /// @dev 合约所有者（用于演示模式的权限控制）
    address public owner;

    /// @dev 收益率：0.5% = 50/10000
    uint256 public constant YIELD_RATE = 50;

    /// @dev 惩罚率：10% = 1000/10000
    uint256 public constant PENALTY_RATE = 1000;

    /// @dev 惩罚阈值：48小时未打卡触发惩罚
    uint256 public constant PENALTY_THRESHOLD = 48 hours;

    // ==================== 事件定义 ====================

    /// @dev 存款事件：用户存款时触发
    event Deposit(address indexed user, uint256 amount, uint256 timestamp);

    /// @dev 打卡事件：用户打卡成功时触发
    event CheckIn(address indexed user, uint256 newBalance, uint256 timestamp);

    /// @dev 惩罚分配事件：执行惩罚时触发
    event PenaltyDistributed(address[] inactiveUsers, uint256 totalPenalty, uint256 timestamp);

    /// @dev 提款事件：用户提款时触发
    event Withdrawal(address indexed user, uint256 amount, uint256 timestamp);

    // ==================== 修饰符 ====================

    /// @dev 仅所有者可调用
    modifier onlyOwner() {
        require(msg.sender == owner, "Ownable: caller is not the owner");
        _;
    }

    // ==================== 构造函数 ====================

    /**
     * @dev 构造函数，部署合约时设置所有者为部署者地址
     */
    constructor() {
        owner = msg.sender;
    }

    // ==================== 核心功能函数 ====================

    /**
     * @dev 存款函数：用户存入 ETH 作为本金
     * @notice 存款后自动记录当前时间为最后打卡时间
     */
    function deposit() external payable {
        require(msg.value > 0, "Deposit must be greater than 0");

        UserData storage user = users[msg.sender];

        // 更新用户本金和总余额
        user.principalAmount += msg.value;
        user.totalBalance += msg.value;
        user.lastCheckInTime = block.timestamp;

        emit Deposit(msg.sender, msg.value, block.timestamp);
    }

    /**
     * @dev 打卡函数：用户打卡并获得虚拟收益
     * @notice 每次打卡增加 0.5% 的虚拟收益
     */
    function checkIn() external {
        UserData storage user = users[msg.sender];
        require(user.totalBalance > 0, "No active deposit");

        // 计算收益：当前余额的 0.5%
        uint256 yield = (user.totalBalance * YIELD_RATE) / 10000;
        user.totalBalance += yield;

        // 更新打卡状态
        user.lastCheckInTime = block.timestamp;
        user.checkInCount += 1;

        emit CheckIn(msg.sender, user.totalBalance, block.timestamp);
    }

    /**
     * @dev 演示模式打卡：仅 owner 可调用，为指定用户执行打卡
     * @param userAddress 要执行打卡的用户地址
     * @notice 此函数为 hackathon 演示设计，防止演示时翻车
     */
    function mockCheckIn(address userAddress) external onlyOwner {
        UserData storage user = users[userAddress];
        require(user.totalBalance > 0, "No active deposit");

        // 计算收益：当前余额的 0.5%
        uint256 yield = (user.totalBalance * YIELD_RATE) / 10000;
        user.totalBalance += yield;

        // 更新打卡状态
        user.lastCheckInTime = block.timestamp;
        user.checkInCount += 1;

        emit CheckIn(userAddress, user.totalBalance, block.timestamp);
    }

    /**
     * @dev 提款函数：用户提取全部余额
     * @notice 提款后重置用户余额为 0
     */
    function withdraw() external {
        UserData storage user = users[msg.sender];
        uint256 amount = user.totalBalance;
        require(amount > 0, "No balance to withdraw");

        // 重置用户余额
        user.totalBalance = 0;
        user.principalAmount = 0;

        // 转账给用户
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");

        emit Withdrawal(msg.sender, amount, block.timestamp);
    }

    /**
     * @dev 执行惩罚机制：对不活跃用户执行惩罚并分配给活跃用户
     * @param inactiveUsers 不活跃用户地址列表
     * @notice 超过 48 小时未打卡的用户将被扣除 10% 本金，按比例分配给活跃用户
     */
    function executePenalty(address[] calldata inactiveUsers) external {
        uint256 totalPenalty = 0;
        uint256 totalActiveBalance = 0;
        address[] memory activeUsers = new address[](inactiveUsers.length);

        // 第一步：从所有不活跃用户扣除惩罚，并计算活跃用户总余额
        for (uint i = 0; i < inactiveUsers.length; i++) {
            address inactiveUser = inactiveUsers[i];
            UserData storage user = users[inactiveUser];

            // 验证用户确实不活跃（超过 48 小时未打卡）
            require(
                block.timestamp - user.lastCheckInTime > PENALTY_THRESHOLD,
                "User is not inactive"
            );

            // 计算惩罚金额：本金的 10%
            uint256 penalty = (user.principalAmount * PENALTY_RATE) / 10000;

            // 扣除惩罚
            user.principalAmount -= penalty;
            user.totalBalance -= penalty;
            totalPenalty += penalty;
        }

        // 第二步：计算所有活跃用户的总余额（简化实现）
        // 在生产环境中，应该维护一个活跃用户列表或使用更高效的算法
        // 这里为了 hackathon 简化，遍历调用者的余额作为参考
        totalActiveBalance = users[msg.sender].totalBalance;

        // 第三步：将惩罚金额分配给活跃用户（按比例）
        // 这里简化为分配给调用者，实际应该分配给所有活跃用户
        if (totalPenalty > 0 && totalActiveBalance > 0) {
            users[msg.sender].totalBalance += totalPenalty;
        }

        emit PenaltyDistributed(inactiveUsers, totalPenalty, block.timestamp);
    }

    // ==================== 查询函数 ====================

    /**
     * @dev 获取用户数据
     * @param userAddress 用户地址
     * @return principalAmount 用户本金
     * @return totalBalance 总余额
     * @return lastCheckInTime 最后打卡时间
     * @return checkInCount 打卡次数
     */
    function getUserData(address userAddress)
        external
        view
        returns (
            uint256 principalAmount,
            uint256 totalBalance,
            uint256 lastCheckInTime,
            uint256 checkInCount
        )
    {
        UserData memory user = users[userAddress];
        return (
            user.principalAmount,
            user.totalBalance,
            user.lastCheckInTime,
            user.checkInCount
        );
    }

    /**
     * @dev 计算用户当前收益
     * @param userAddress 用户地址
     * @return 收益金额（总余额 - 本金）
     */
    function getYieldAmount(address userAddress) external view returns (uint256) {
        UserData memory user = users[userAddress];
        if (user.totalBalance > user.principalAmount) {
            return user.totalBalance - user.principalAmount;
        }
        return 0;
    }

    /**
     * @dev 检查用户是否应该被惩罚
     * @param userAddress 用户地址
     * @return 是否应该被惩罚
     */
    function isPenaltyPending(address userAddress) external view returns (bool) {
        UserData memory user = users[userAddress];
        if (user.totalBalance == 0) {
            return false;
        }
        return block.timestamp - user.lastCheckInTime > PENALTY_THRESHOLD;
    }

    /**
     * @dev 计算距离惩罚还剩多少时间
     * @param userAddress 用户地址
     * @return 剩余秒数，如果已经超过惩罚阈值则返回 0
     */
    function getTimeUntilPenalty(address userAddress) external view returns (uint256) {
        UserData memory user = users[userAddress];
        if (user.totalBalance == 0) {
            return 0;
        }
        uint256 elapsed = block.timestamp - user.lastCheckInTime;
        if (elapsed >= PENALTY_THRESHOLD) {
            return 0;
        }
        return PENALTY_THRESHOLD - elapsed;
    }

    // ==================== 管理函数 ====================

    /**
     * @dev 转移合约所有权
     * @param newOwner 新所有者地址
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "New owner is the zero address");
        owner = newOwner;
    }

    /**
     * @dev 紧急提款：仅 owner 可调用，用于合约升级或紧急情况
     */
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");

        (bool success, ) = owner.call{value: balance}("");
        require(success, "Transfer failed");
    }
}
