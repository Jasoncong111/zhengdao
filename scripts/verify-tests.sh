#!/bin/bash

# 集成测试验证脚本
# 用于验证测试框架是否正确搭建

echo "========================================="
echo "证道双链SBT系统 - 集成测试验证"
echo "========================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "1. 检查测试文件..."
echo "   - BNB Chain集成测试"
if [ -f "__tests__/integration/bnb-chain.test.tsx" ]; then
    echo -e "   ${GREEN}✓${NC} bnb-chain.test.tsx"
else
    echo -e "   ${RED}✗${NC} bnb-chain.test.tsx 未找到"
fi

echo "   - Solana集成测试"
if [ -f "__tests__/integration/solana.test.tsx" ]; then
    echo -e "   ${GREEN}✓${NC} solana.test.tsx"
else
    echo -e "   ${RED}✗${NC} solana.test.tsx 未找到"
fi

echo "   - 双链切换集成测试"
if [ -f "__tests__/integration/multi-chain.test.tsx" ]; then
    echo -e "   ${GREEN}✓${NC} multi-chain.test.tsx"
else
    echo -e "   ${RED}✗${NC} multi-chain.test.tsx 未找到"
fi

echo ""
echo "2. 检查测试工具..."
if [ -d "__tests__/utils" ]; then
    echo -e "   ${GREEN}✓${NC} utils/ 目录存在"

    echo "   - test-helpers.ts"
    if [ -f "__tests__/utils/test-helpers.ts" ]; then
        echo -e "     ${GREEN}✓${NC}"
    else
        echo -e "     ${RED}✗${NC}"
    fi

    echo "   - mocks/"
    if [ -d "__tests__/utils/mocks" ]; then
        echo -e "     ${GREEN}✓${NC} mocks/ 目录存在"

        echo "     * wagmi.ts"
        [ -f "__tests__/utils/mocks/wagmi.ts" ] && echo -e "       ${GREEN}✓${NC}" || echo -e "       ${RED}✗${NC}"

        echo "     * achievement.ts"
        [ -f "__tests__/utils/mocks/achievement.ts" ] && echo -e "       ${GREEN}✓${NC}" || echo -e "       ${RED}✗${NC}"

        echo "     * solana.ts"
        [ -f "__tests__/utils/mocks/solana.ts" ] && echo -e "       ${GREEN}✓${NC}" || echo -e "       ${RED}✗${NC}"
    else
        echo -e "     ${RED}✗${NC} mocks/ 目录不存在"
    fi
else
    echo -e "   ${RED}✗${NC} utils/ 目录不存在"
fi

echo ""
echo "3. 检查文档..."
if [ -f "docs/TESTING-GUIDE.md" ]; then
    echo -e "   ${GREEN}✓${NC} TESTING-GUIDE.md"
else
    echo -e "   ${RED}✗${NC} TESTING-GUIDE.md 未找到"
fi

if [ -f "docs/TEST-REPORT.md" ]; then
    echo -e "   ${GREEN}✓${NC} TEST-REPORT.md"
else
    echo -e "   ${RED}✗${NC} TEST-REPORT.md 未找到"
fi

if [ -f "__tests__/README.md" ]; then
    echo -e "   ${GREEN}✓${NC} __tests__/README.md"
else
    echo -e "   ${RED}✗${NC} __tests__/README.md 未找到"
fi

echo ""
echo "4. 检查Jest配置..."
if [ -f "jest.config.js" ]; then
    echo -e "   ${GREEN}✓${NC} jest.config.js"
else
    echo -e "   ${RED}✗${NC} jest.config.js 未找到"
fi

if [ -f "jest.setup.js" ]; then
    echo -e "   ${GREEN}✓${NC} jest.setup.js"
else
    echo -e "   ${RED}✗${NC} jest.setup.js 未找到"
fi

echo ""
echo "5. 统计测试用例数量..."
echo -e "   ${YELLOW}注意: 以下为预估数量，实际运行时可能会调整${NC}"

# 统计describe块
bnb_tests=$(grep -c "describe\|it" __tests__/integration/bnb-chain.test.tsx 2>/dev/null || echo "0")
solana_tests=$(grep -c "describe\|it" __tests__/integration/solana.test.tsx 2>/dev/null || echo "0")
multi_tests=$(grep -c "describe\|it" __tests__/integration/multi-chain.test.tsx 2>/dev/null || echo "0")

echo "   - BNB Chain: ~$((bnb_tests / 2)) 个测试"
echo "   - Solana: ~$((solana_tests / 2)) 个测试"
echo "   - Multi-chain: ~$((multi_tests / 2)) 个测试"
echo "   - 总计: ~$(( (bnb_tests + solana_tests + multi_tests) / 2 )) 个测试"

echo ""
echo "========================================="
echo "验证完成！"
echo "========================================="
echo ""
echo "下一步操作："
echo "  1. 运行测试: npm test"
echo "  2. 运行特定测试: npm test bnb-chain"
echo "  3. 监听模式: npm run test:watch"
echo "  4. 覆盖率报告: npm run test:coverage"
echo ""
echo "查看测试文档："
echo "  - 测试指南: docs/TESTING-GUIDE.md"
echo "  - 测试报告: docs/TEST-REPORT.md"
echo ""
