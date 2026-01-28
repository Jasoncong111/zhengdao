// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title ZhengDaoSBT - 证道成就系统 Soulbound Token
 * @notice 符合ERC-721标准的SBT，完全禁止转移
 * @dev 6个等级的成就SBT，链上存储元数据
 */
contract ZhengDaoSBT is ERC721, ERC721URIStorage, Ownable {
    using Strings for uint256;

    // ==================== 状态变量 ====================

    // Token计数器
    uint256 private _tokenIdCounter;

    // Token元数据存储
    mapping(uint256 => uint256) public tokenLevel;  // tokenId => level (1-6)
    mapping(uint256 => uint256) public tokenCheckInDays;   // tokenId => check-in days
    mapping(uint256 => uint256) public tokenDate;   // tokenId => mint timestamp

    // 用户拥有的所有SBT
    mapping(address => uint256[]) public userTokens;

    // 用户是否已拥有某等级的SBT（防止重复铸造）
    mapping(address => mapping(uint256 => bool)) public userHasLevel;

    // 基础URI
    string private _baseTokenURI;

    // ==================== 事件 ====================

    event SBTMinted(
        address indexed to,
        uint256 indexed tokenId,
        uint256 level,
        uint256 checkInDays,
        uint256 timestamp
    );

    // ==================== 错误定义 ====================

    error InvalidLevel();
    error InvalidDays();
    error TokenAlreadyExists();
    error TokenDoesNotExist();
    error SoulboundTokenTransferNotAllowed();

    // ==================== 修饰器 ====================

    /**
     * @dev 检查等级是否有效
     */
    modifier validLevel(uint256 level) {
        if (level < 1 || level > 6) {
            revert InvalidLevel();
        }
        _;
    }

    /**
     * @dev 检查天数是否有效
     */
    modifier validCheckInDays(uint256 checkInDays) {
        if (checkInDays == 0) {
            revert InvalidDays();
        }
        _;
    }

    /**
     * @dev 检查token是否存在
     */
    modifier tokenExists(uint256 tokenId) {
        if (_ownerOf(tokenId) == address(0)) {
            revert TokenDoesNotExist();
        }
        _;
    }

    // ==================== 构造函数 ====================

    constructor(
        string memory name,
        string memory symbol,
        string memory baseTokenURI
    ) ERC721(name, symbol) Ownable(msg.sender) {
        _baseTokenURI = baseTokenURI;
        _tokenIdCounter = 1; // 从1开始计数
    }

    // ==================== 核心功能 ====================

    /**
     * @notice 铸造SBT（仅合约owner）
     * @dev 为指定地址铸造指定等级的SBT
     * @param to 接收地址
     * @param level 等级（1-6）
     * @param checkInDays 打卡天数
     * @param uri 元数据URI（可选，如果为空则使用默认URI）
     */
    function mintSBT(
        address to,
        uint256 level,
        uint256 checkInDays,
        string memory uri
    ) external onlyOwner validLevel(level) validCheckInDays(checkInDays) returns (uint256) {
        // 检查用户是否已有该等级的SBT
        if (userHasLevel[to][level]) {
            revert TokenAlreadyExists();
        }

        // 铸造新token
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;

        // 铸造ERC721 token
        _safeMint(to, tokenId);

        // 存储元数据
        tokenLevel[tokenId] = level;
        tokenCheckInDays[tokenId] = checkInDays;
        tokenDate[tokenId] = block.timestamp;

        // 记录用户拥有该等级
        userHasLevel[to][level] = true;

        // 添加到用户的SBT列表
        userTokens[to].push(tokenId);

        // 设置token URI
        if (bytes(uri).length > 0) {
            _setTokenURI(tokenId, uri);
        } else {
            // 使用默认URI: baseURI/{level}.json
            _setTokenURI(tokenId, string(abi.encodePacked(_baseTokenURI, level.toString(), ".json")));
        }

        emit SBTMinted(to, tokenId, level, checkInDays, block.timestamp);

        return tokenId;
    }

    /**
     * @notice 批量铸造SBT（仅合约owner）
     * @dev 为多个地址批量铸造SBT
     * @param recipients 接收地址数组
     * @param levels 等级数组
     * @param checkInDays 天数数组
     */
    /**
     * @notice 批量铸造SBT（仅合约owner）
     * @dev 为多个地址批量铸造SBT
     * @param recipients 接收地址数组
     * @param levels 等级数组
     * @param checkInDays 天数数组
     */
    function batchMintSBT(
        address[] calldata recipients,
        uint256[] calldata levels,
        uint256[] calldata checkInDays
    ) external onlyOwner {
        require(
            recipients.length == levels.length &&
            recipients.length == checkInDays.length,
            "Arrays length mismatch"
        );

        for (uint256 i = 0; i < recipients.length; i++) {
            _mintSBTInternal(recipients[i], levels[i], checkInDays[i], "");
        }
    }

    /**
     * @dev 内部铸造函数，用于批量铸造
     */
    function _mintSBTInternal(
        address to,
        uint256 level,
        uint256 checkInDays,
        string memory uri
    ) internal onlyOwner validLevel(level) validCheckInDays(checkInDays) returns (uint256) {
        // 检查用户是否已有该等级的SBT
        if (userHasLevel[to][level]) {
            revert TokenAlreadyExists();
        }

        // 铸造新token
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;

        // 铸造ERC721 token
        _safeMint(to, tokenId);

        // 存储元数据
        tokenLevel[tokenId] = level;
        tokenCheckInDays[tokenId] = checkInDays;
        tokenDate[tokenId] = block.timestamp;

        // 记录用户拥有该等级
        userHasLevel[to][level] = true;

        // 添加到用户的SBT列表
        userTokens[to].push(tokenId);

        // 设置token URI
        if (bytes(uri).length > 0) {
            _setTokenURI(tokenId, uri);
        } else {
            // 使用默认URI: baseURI/{level}.json
            _setTokenURI(tokenId, string(abi.encodePacked(_baseTokenURI, level.toString(), ".json")));
        }

        emit SBTMinted(to, tokenId, level, checkInDays, block.timestamp);

        return tokenId;
    }

    // ==================== Soulbound机制 ====================

    /**
     * @dev 重写_update函数以禁止转移 - SBT不可转移
     * @notice 只有mint操作（from == address(0)）和burn操作（to == address(0)）被允许
     */
    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721)
        returns (address)
    {
        address from = _ownerOf(tokenId);

        // 允许铸造 (from == address(0))
        if (from == address(0)) {
            return super._update(to, tokenId, auth);
        }

        // 允许销毁 (to == address(0))
        if (to == address(0)) {
            return super._update(to, tokenId, auth);
        }

        // 禁止所有转移操作
        revert SoulboundTokenTransferNotAllowed();
    }

    /**
     * @dev 禁止所有转移操作 - SBT不可转移（额外保护）
     */
    function transferFrom(address, address, uint256)
        public
        pure
        override(ERC721, IERC721)
    {
        revert SoulboundTokenTransferNotAllowed();
    }

    // ==================== 查询函数 ====================

    /**
     * @notice 获取用户的所有SBT
     * @param user 用户地址
     * @return tokenIds 用户拥有的所有SBT的tokenId数组
     */
    function getUserTokens(address user) external view returns (uint256[] memory) {
        return userTokens[user];
    }

    /**
     * @notice 获取SBT的详细信息
     * @param tokenId SBT的ID
     * @return level 等级
     * @return checkInDays 打卡天数
     * @return date 铸造时间戳
     */
    function getTokenDetails(uint256 tokenId) external view returns (
        uint256 level,
        uint256 checkInDays,
        uint256 date
    ) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return (
            tokenLevel[tokenId],
            tokenCheckInDays[tokenId],
            tokenDate[tokenId]
        );
    }

    /**
     * @notice 获取用户指定等级的SBT是否存在
     * @param user 用户地址
     * @param level 等级
     * @return bool 是否拥有该等级的SBT
     */
    function hasLevel(address user, uint256 level) external view returns (bool) {
        return userHasLevel[user][level];
    }

    /**
     * @notice 获取用户的最高等级
     * @param user 用户地址
     * @return highestLevel 用户拥有的最高等级（如果没有则返回0）
     */
    function getHighestLevel(address user) external view returns (uint256) {
        uint256[] memory tokens = userTokens[user];
        uint256 highestLevel = 0;

        for (uint256 i = 0; i < tokens.length; i++) {
            uint256 level = tokenLevel[tokens[i]];
            if (level > highestLevel) {
                highestLevel = level;
            }
        }

        return highestLevel;
    }

    /**
     * @notice 获取用户的总打卡天数（所有SBT的天数之和）
     * @param user 用户地址
     * @return totalDays 总打卡天数
     */
    function getTotalDays(address user) external view returns (uint256) {
        uint256[] memory tokens = userTokens[user];
        uint256 totalCheckInDays = 0;

        for (uint256 i = 0; i < tokens.length; i++) {
            totalCheckInDays += tokenCheckInDays[tokens[i]];
        }

        return totalCheckInDays;
    }

    /**
     * @notice 获取已铸造的SBT总数
     * @return count SBT总数
     */
    function totalSupply() external view returns (uint256) {
        return _tokenIdCounter - 1;
    }

    // ==================== 管理函数 ====================

    /**
     * @notice 更新基础URI（仅合约owner）
     * @param baseTokenURI 新的基础URI
     */
    function setBaseURI(string memory baseTokenURI) external onlyOwner {
        _baseTokenURI = baseTokenURI;
    }

    /**
     * @notice 获取token的URI
     * @dev 重写以支持ERC721URIStorage
     */
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    /**
     * @dev 重写supportsInterface以支持多个接口
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
