#!/bin/bash

# ZhengDAO Solana SBT Program - Readiness Check Script
# 检查所有准备工作是否完成

set -e

echo "🔍 ZhengDAO SBT Program - Readiness Check"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check counters
CHECKS_PASSED=0
CHECKS_FAILED=0
CHECKS_WARNING=0

# Function to check file
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅${NC} $1"
        ((CHECKS_PASSED++))
        return 0
    else
        echo -e "${RED}❌${NC} $1 (missing)"
        ((CHECKS_FAILED++))
        return 1
    fi
}

# Function to check directory
check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✅${NC} $1 (directory)"
        ((CHECKS_PASSED++))
        return 0
    else
        echo -e "${RED}❌${NC} $1 (directory not found)"
        ((CHECKS_FAILED++))
        return 1
    fi
}

# Function to check command
check_cmd() {
    if command -v "$1" &> /dev/null; then
        echo -e "${GREEN}✅${NC} $1 (installed)"
        ((CHECKS_PASSED++))
        return 0
    else
        echo -e "${YELLOW}⚠️  ${NC} $1 (not installed)"
        ((CHECKS_WARNING++))
        return 1
    fi
}

echo "📁 Checking Files..."
echo "===================="
check_file "src/lib.rs"
check_file "tests/zhengdao-sbt.ts"
check_file "Anchor.toml"
check_file "package.json"
check_file "tsconfig.json"
echo ""

echo "📁 Checking Metadata Files..."
echo "=============================="
check_file "metadata/level1.json"
check_file "metadata/level2.json"
check_file "metadata/level3.json"
check_file "metadata/level4.json"
check_file "metadata/level5.json"
check_file "metadata/level6.json"
check_file "metadata/metadata-uris.json"
check_file "metadata/test-data.json"
check_file "metadata/README.md"
echo ""

echo "📁 Checking Scripts..."
echo "======================="
check_file "scripts/prepare-environment.sh"
check_file "scripts/test.sh"
check_file "scripts/deploy-devnet.sh"
check_file "scripts/verify-deployment.sh"
check_file "scripts/check-readiness.sh"
echo ""

echo "📁 Checking Documentation..."
echo "============================"
check_file "README.md"
check_file "QUICK_START.md"
check_file "TASK-B-PREPARATION.md"
check_file "DEPLOYMENT-CHECKLIST.md"
check_file "TASK-B-COMPLETION-REPORT.md"
check_file "TASK-B-SUMMARY.md"
check_file "EXECUTION-STATUS.md"
echo ""

echo "🔧 Checking Tools (Optional for Development)..."
echo "================================================"
check_cmd "rustc"
check_cmd "cargo"
check_cmd "solana"
check_cmd "anchor"
check_cmd "node"
check_cmd "npm"
echo ""

echo "📊 Summary"
echo "=========="
echo -e "${GREEN}Passed:${NC}   $CHECKS_PASSED"
echo -e "${YELLOW}Warning:${NC}  $CHECKS_WARNING"
echo -e "${RED}Failed:${NC}   $CHECKS_FAILED"
echo ""

TOTAL_CHECKS=$((CHECKS_PASSED + CHECKS_FAILED))
PERCENTAGE=$((CHECKS_PASSED * 100 / TOTAL_CHECKS))

echo "Readiness: ${CHECKS_PASSED}/${TOTAL_CHECKS} ($PERCENTAGE%)"
echo ""

if [ $CHECKS_FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All critical files are ready!${NC}"
    echo ""
    if [ $CHECKS_WARNING -gt 0 ]; then
        echo -e "${YELLOW}⚠️  Note: Some tools are not installed yet.${NC}"
        echo "Run './scripts/prepare-environment.sh' to install them."
        echo ""
    fi
    echo "Next steps:"
    echo "1. Install tools: ./scripts/prepare-environment.sh"
    echo "2. Build program: anchor build"
    echo "3. Run tests:    anchor test"
    echo "4. Deploy:       ./scripts/deploy-devnet.sh"
    echo ""
    exit 0
else
    echo -e "${RED}❌ Some critical files are missing!${NC}"
    echo "Please check the failed items above."
    echo ""
    exit 1
fi
