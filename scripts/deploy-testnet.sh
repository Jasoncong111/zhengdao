#!/bin/bash

echo "=========================================="
echo "   BSC 测试网合约部署"
echo "=========================================="
echo ""

# 检查私钥
if [ -z "$PRIVATE_KEY" ]; then
    echo "❌ 错误: PRIVATE_KEY 未配置"
    echo ""
    echo "📝 配置步骤:"
    echo "1. 打开项目根目录的 .env.local 文件"
    echo "2. 找到第 49 行: PRIVATE_KEY=在这里粘贴你的私钥"
    echo "3. 替换为你的实际私钥（不要包含 0x 前缀）"
    echo "4. 保存文件"
    echo ""
    echo "⚠️  提示: .env.local 文件已在 .gitignore 中，不会被提交"
    echo "=========================================="
    exit 1
fi

echo "✅ PRIVATE_KEY 已配置"
echo ""
echo "📋 部署信息:"
echo "   网络: BSC 测试网 (Chain ID: 97)"
echo "   费用: 免费（使用测试币）"
echo ""
echo "💡 如果还没有测试币，请先访问:"
echo "   https://testnet.bnbchain.org/faucet-smart"
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
echo "🚀 开始部署合约到 BSC 测试网..."
npx hardhat run scripts/deploy-bnb-sbt.ts --network bnbTestnet

if [ $? -eq 0 ]; then
    echo ""
    echo "=========================================="
    echo "✅ 部署成功！"
    echo "=========================================="
    echo ""
    echo "📝 下一步操作:"
    echo ""
    echo "1. 复制上面的合约地址（类似 0x...）"
    echo ""
    echo "2. 更新 .env.local 文件:"
    echo "   NEXT_PUBLIC_ZHENGDAO_SBT_ADDRESS=合约地址"
    echo ""
    echo "3. 重启开发服务器:"
    echo "   npm run dev"
    echo ""
    echo "4. 在 OKX 钱包中切换到 BSC 测试网 (Chain ID: 97)"
    echo ""
    echo "5. 在浏览器中测试铸造功能"
    echo ""
    echo "=========================================="
else
    echo ""
    echo "=========================================="
    echo "❌ 部署失败"
    echo "=========================================="
    echo ""
    echo "💡 可能的原因:"
    echo "   1. 还没有领取测试币"
    echo "      → 访问: https://testnet.bnbchain.org/faucet-smart"
    echo ""
    echo "   2. 私钥格式错误"
    echo "      → 确保不要包含 0x 前缀"
    echo ""
    echo "   3. 网络连接问题"
    echo "      → 检查网络连接"
    echo ""
    echo "请检查后重试"
    echo "=========================================="
    exit 1
fi
