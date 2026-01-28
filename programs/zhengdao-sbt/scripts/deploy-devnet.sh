#!/bin/bash

# ZhengDAO Solana SBT Program - Devnet Deployment Script
# TASK-2-3: Deploy to Solana Devnet

set -e  # Exit on error

echo "🚀 ZhengDAO SBT Program - Deployment to Solana Devnet"
echo "======================================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
echo "📋 Checking prerequisites..."

# Check if Rust is installed
if ! command -v rustc &> /dev/null; then
    echo -e "${RED}❌ Rust is not installed${NC}"
    echo "Please install Rust: https://rustup.rs/"
    exit 1
fi
echo -e "${GREEN}✅ Rust is installed${NC}"

# Check if Solana CLI is installed
if ! command -v solana &> /dev/null; then
    echo -e "${RED}❌ Solana CLI is not installed${NC}"
    echo "Please install Solana CLI: https://docs.solana.com/cli/install-solana-cli-tools"
    exit 1
fi
echo -e "${GREEN}✅ Solana CLI is installed${NC}"

# Check if Anchor is installed
if ! command -v anchor &> /dev/null; then
    echo -e "${RED}❌ Anchor is not installed${NC}"
    echo "Please install Anchor: cargo install --git https://github.com/coral-xyz/anchor avm --locked --force"
    exit 1
fi
echo -e "${GREEN}✅ Anchor is installed${NC}"
echo ""

# Display current configuration
echo "📊 Current Solana Configuration:"
echo "==============================="
solana config get
echo ""

# Check if we're on devnet
CURRENT_CLUSTER=$(solana config get | grep "RPC URL" | awk '{print $3}')
if [[ "$CURRENT_CLUSTER" != *"devnet"* ]]; then
    echo -e "${YELLOW}⚠️  Warning: Not configured for devnet${NC}"
    echo "Switching to devnet..."
    solana config set --url devnet
    echo ""
fi

# Check balance
echo "💰 Checking wallet balance..."
BALANCE=$(solana balance | awk '{print $1}')
echo "Current balance: $BALANCE SOL"
echo ""

# Check if balance is sufficient (need at least 1 SOL for deployment)
if (( $(echo "$BALANCE < 1.0" | bc -l) )); then
    echo -e "${YELLOW}⚠️  Warning: Balance might be insufficient for deployment${NC}"
    echo "Requesting airdrop..."
    solana airdrop 2
    echo ""
fi

# Build the program
echo "🔨 Building the program..."
anchor build
echo -e "${GREEN}✅ Build completed${NC}"
echo ""

# Get the program ID
PROGRAM_ID=$(solana address -k target/deploy/zhengdao_sbt-keypair.json)
echo "📝 Program ID: $PROGRAM_ID"
echo ""

# Ask for confirmation
echo "⚠️  About to deploy to Solana Devnet"
echo "Program ID: $PROGRAM_ID"
read -p "Do you want to continue? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled."
    exit 0
fi

# Deploy the program
echo "🚀 Deploying to devnet..."
anchor deploy --program-name zhengdao_sbt

echo ""
echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo ""

# Verify deployment
echo "🔍 Verifying deployment..."
solana program show $PROGRAM_ID
echo ""

# Update Anchor.toml with the new program ID
echo "📝 Updating Anchor.toml..."
sed -i.bak "s/zhengD1111111111111111111111111111111111111/$PROGRAM_ID/g" Anchor.toml
echo -e "${GREEN}✅ Anchor.toml updated${NC}"
echo ""

# Create deployment record
DEPLOYMENT_LOG="../../docs/deployment/solana-devnet-deployment.md"
mkdir -p ../../docs/deployment

cat > $DEPLOYMENT_LOG << EOF
# Solana SBT Program - Devnet Deployment Record

**部署时间**: $(date)
**部署者**: AI #2 (Solana程序工程师)
**任务**: TASK-2-3
**网络**: Solana Devnet

## 程序信息

- **程序ID**: \`$PROGRAM_ID\`
- **网络**: Devnet
- **确认状态**: ✅ Deployed

## 验证

可以在 [Solana Explorer](https://explorer.solana.com/?cluster=devnet) 查看程序详情:
https://explorer.solana.com/address/$PROGRAM_ID?cluster=devnet

## 部署步骤

1. ✅ 检查环境（Rust, Solana CLI, Anchor）
2. ✅ 配置devnet网络
3. ✅ 编译程序 (\`anchor build\`)
4. ✅ 部署程序 (\`anchor deploy\`)
5. ✅ 验证部署 (\`solana program show\`)

## 下一步

- [ ] 运行测试验证程序功能
- [ ] 更新前端配置使用新的程序ID
- [ ] 编写前端集成代码

## 相关文件

- 程序代码: \`/programs/zhengdao-sbt/src/lib.rs\`
- 测试代码: \`/programs/zhengdao-sbt/tests/zhengdao-sbt.ts\`
- 配置文件: \`Anchor.toml\`

---
**部署完成时间**: $(date)
EOF

echo "📄 Deployment log created: $DEPLOYMENT_LOG"
echo ""

echo "======================================================"
echo -e "${GREEN}🎉 TASK-2-3 Completed Successfully!${NC}"
echo "======================================================"
echo ""
echo "Program ID: $PROGRAM_ID"
echo "Explorer: https://explorer.solana.com/address/$PROGRAM_ID?cluster=devnet"
echo ""
echo "✅ Program is now live on Solana Devnet!"
echo ""
