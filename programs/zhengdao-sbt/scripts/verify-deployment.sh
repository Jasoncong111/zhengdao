#!/bin/bash

# ZhengDAO Solana SBT Program - Deployment Verification Script
# Verify that the program is correctly deployed on Devnet

set -e

echo "🔍 ZhengDAO SBT Program - Deployment Verification"
echo "=================================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Get program ID from Anchor.toml
PROGRAM_ID=$(grep "zhengdao_sbt = " Anchor.toml | head -1 | awk -F'"' '{print $2}')

if [ "$PROGRAM_ID" == "zhengD1111111111111111111111111111111111111" ]; then
    echo -e "${RED}❌ Program ID not updated in Anchor.toml${NC}"
    echo "Please deploy the program first using: ./scripts/deploy-devnet.sh"
    exit 1
fi

echo "📝 Program ID: $PROGRAM_ID"
echo ""

# Check if on devnet
CURRENT_CLUSTER=$(solana config get | grep "RPC URL" | awk '{print $3}')
if [[ "$CURRENT_CLUSTER" != *"devnet"* ]]; then
    echo -e "${YELLOW}⚠️  Not on devnet, switching...${NC}"
    solana config set --url devnet
    echo ""
fi

echo "🔍 Verifying program deployment..."
echo ""

# Check if program exists
if solana program show $PROGRAM_ID &> /dev/null; then
    echo -e "${GREEN}✅ Program found on chain${NC}"
else
    echo -e "${RED}❌ Program not found on chain${NC}"
    echo "Please deploy the program first"
    exit 1
fi

# Get program details
echo ""
echo "📊 Program Details:"
echo "=================="
solana program show $PROGRAM_ID
echo ""

# Check program upgradability
UPGRADEABLE=$(solana program show $PROGRAM_ID | grep "Upgradeable" | awk '{print $2}')
if [ "$UPGRADEABLE" == "true" ]; then
    echo -e "${GREEN}✅ Program is upgradeable${NC}"
else
    echo -e "${YELLOW}⚠️  Program is not upgradeable${NC}"
fi

# Get program size
PROGRAM_SIZE=$(solana program show $PROGRAM_ID | grep "Program Data" | awk '{print $3}')
echo "Program size: $PROGRAM_SIZE"

echo ""
echo "🔍 Checking IDL..."
if [ -f "target/idl/zhengdao_sbt.json" ]; then
    echo -e "${GREEN}✅ IDL file exists${NC}"
    echo "   Size: $(wc -c < target/idl/zhengdao_sbt.json) bytes"
else
    echo -e "${YELLOW}⚠️  IDL file not found${NC}"
fi

echo ""
echo "🔍 Checking program binary..."
if [ -f "target/deploy/zhengdao_sbt.so" ]; then
    echo -e "${GREEN}✅ Program binary exists${NC}"
    echo "   Size: $(wc -c < target/deploy/zhengdao_sbt.so) bytes"
else
    echo -e "${RED}❌ Program binary not found${NC}"
fi

echo ""
echo "🌐 Solana Explorer Link:"
echo "https://explorer.solana.com/address/$PROGRAM_ID?cluster=devnet"
echo ""

# Test program functionality
echo "🧪 Quick functionality test..."
echo ""

# Check if we can call the program
echo "Testing program access..."
if solana program show $PROGRAM_ID &> /dev/null; then
    echo -e "${GREEN}✅ Program is accessible${NC}"
else
    echo -e "${RED}❌ Program is not accessible${NC}"
    exit 1
fi

echo ""
echo "=================================================="
echo -e "${GREEN}✅ Deployment Verification Successful!${NC}"
echo "=================================================="
echo ""
echo "Program ID: $PROGRAM_ID"
echo "Network: Devnet"
echo "Status: Active and accessible"
echo ""
echo "Next steps:"
echo "1. Run integration tests"
echo "2. Integrate with frontend"
echo "3. Deploy to mainnet (when ready)"
echo ""
