#!/bin/bash

# BSC 主网部署脚本

echo "=========================================="
echo "   BSC 主网合约部署指南"
echo "=========================================="
echo ""

# 检查私钥
if [ -z "$PRIVATE_KEY" ]; then
    echo "❌ 错误: PRIVATE_KEY 未配置"
    echo ""
    echo "📝 请按照以下步骤配置:"
    echo ""
    echo "1. 在 OKX 钱包中，确保你有足够的 BNB（建议至少 0.1 BNB）"
    echo "2. 导出钱包私钥："
    echo "   - 打开 OKX 钱包"
    echo "   - 点击右上角三个点"
    echo "   - 选择「账户详情」"
    echo "   - 点击「导出私钥」"
    echo "   - 输入密码后复制私钥"
    echo ""
    echo "3. 在项目根目录的 .env.local 文件中添加:"
    echo "   PRIVATE_KEY=你的私钥（不要包含 0x 前缀）"
    echo ""
    echo "⚠️  安全提醒:"
    echo "   - .env.local 文件已在 .gitignore 中，不会被提交到 git"
    echo "   - 不要使用包含大量资金的钱包"
    echo "   - 部署完成后可以重新导入到新钱包"
    echo ""
    echo "=========================================="
    exit 1
fi

echo "✅ PRIVATE_KEY 已配置"
echo ""
echo "📋 部署信息:"
echo "   网络: BSC 主网 (Chain ID: 56)"
echo "   预计 Gas 费用: ~0.01-0.05 BNB"
echo ""
echo "⏳ 准备部署..."
echo ""

# 编译合约
echo "🔨 编译合约..."
npm run hardhat:compile

if [ $? -ne 0 ]; then
    echo "❌ 合约编译失败"
    exit 1
fi

echo "✅ 合约编译成功"
echo ""

# 部署合约
echo "🚀 开始部署合约到 BSC 主网..."
npx hardhat run scripts/deploy-bnb-sbt.ts --network bnb

if [ $? -eq 0 ]; then
    echo ""
    echo "=========================================="
    echo "✅ 部署成功！"
    echo "=========================================="
    echo ""
    echo "📝 下一步操作:"
    echo ""
    echo "1. 复制上面的合约地址"
    echo ""
    echo "2. 更新 .env.local 文件:"
    echo "   NEXT_PUBLIC_ZHENGDAO_SBT_ADDRESS=合约地址"
    echo ""
    echo "3. 重启开发服务器:"
    echo "   npm run dev"
    echo ""
    echo "4. 验证合约（可选）:"
    echo "   npx hardhat verify --network bsc <合约地址> \"ZhengDao Soulbound Token\" \"ZDSBT\" \"https://zhengdao.io/api/sbt-metadata/\""
    echo ""
    echo "=========================================="
else
    echo ""
    echo "=========================================="
    echo "❌ 部署失败"
    echo "=========================================="
    echo ""
    echo "💡 可能的原因:"
    echo "   1. 钱包 BNB 余额不足"
    echo "   2. 私钥格式错误"
    echo "   3. 网络连接问题"
    echo ""
    echo "请检查后重试"
    echo "=========================================="
    exit 1
fi
