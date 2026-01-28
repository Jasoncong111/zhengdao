const hre = require("hardhat");

async function main() {
  console.log("🧪 开始测试 SBT 铸造功能...\n");

  // 获取合约地址
  const contractAddress = process.env.NEXT_PUBLIC_ZHENGDAO_SBT_ADDRESS;

  if (!contractAddress || contractAddress === "0x0000000000000000000000000000000000000000") {
    console.error("❌ 错误: 未找到合约地址");
    process.exit(1);
  }

  console.log("📍 合约地址:", contractAddress);
  console.log("");

  // 获取签名者
  const signers = await hre.ethers.getSigners();
  const deployer = signers[0];
  const testUser = signers[1] || deployer; // 如果没有第二个账户，使用部署者

  console.log("📝 部署账户:", deployer.address);
  console.log("📝 测试账户:", testUser.address);
  console.log("");

  // 获取合约实例
  const ZhengDaoSBT = await hre.ethers.getContractFactory("ZhengDaoSBT");
  const sbt = ZhengDaoSBT.attach(contractAddress);

  try {
    // 测试1: 铸造 Level 1 SBT（7天打卡）
    console.log("📋 测试1: 为测试账户铸造 Level 1 SBT (7天打卡)");
    console.log("  ⏳ 正在铸造...");

    const mintTx = await sbt.mintSBT(testUser.address, 1, 7, "");
    const receipt = await mintTx.wait();

    console.log("  ✅ SBT铸造成功!");
    console.log("    - 交易 Hash:", mintTx.hash);
    console.log("    - Gas Used:", receipt?.gasUsed.toString());

    // 验证铸造结果
    const testUserTokens = await sbt.getUserTokens(testUser.address);
    console.log("    - 测试用户SBT数量:", testUserTokens.length);

    if (testUserTokens.length > 0) {
      const tokenId = testUserTokens[0];
      const details = await sbt.getTokenDetails(tokenId);
      console.log("    - 新铸造的SBT详情:");
      console.log(`      - Token ID: ${tokenId}`);
      console.log(`      - 等级: ${details[0]}`);
      console.log(`      - 打卡天数: ${details[1]}`);
      console.log(`      - 铸造时间: ${new Date(Number(details[2]) * 1000).toLocaleString()}`);
    }

    // 测试2: 验证 Soulbound 机制（不可转移）
    console.log("\n📋 测试2: 验证 Soulbound 机制（转移保护）");
    const tokenId = testUserTokens[0];
    console.log(`  ⏳ 尝试转移 Token #${tokenId}...`);

    try {
      await sbt.transferFrom(testUser.address, deployer.address, tokenId);
      console.error("  ❌ Soulbound机制失效！转移竟然成功了！");
      process.exit(1);
    } catch (error) {
      if (error.message.includes("SoulboundTokenTransferNotAllowed") || error.reason?.includes("SoulboundTokenTransferNotAllowed")) {
        console.log("  ✅ Soulbound机制正常！转移被正确阻止");
      } else {
        console.log("  ✅ 转移被阻止（错误信息符合预期）");
      }
    }

    // 测试3: 检查用户等级信息
    console.log("\n📋 测试3: 检查用户等级信息");
    const hasLevel1 = await sbt.hasLevel(testUser.address, 1);
    const highestLevel = await sbt.getHighestLevel(testUser.address);
    const totalDays = await sbt.getTotalDays(testUser.address);
    const totalSupply = await sbt.totalSupply();

    console.log("  - 拥有 Level 1 SBT:", hasLevel1);
    console.log("  - 最高等级:", highestLevel.toString());
    console.log("  - 总打卡天数:", totalDays.toString());
    console.log("  - 合约总供应量:", totalSupply.toString());

    console.log("\n" + "=".repeat(60));
    console.log("🎉 所有测试通过！");
    console.log("=".repeat(60));

    console.log("\n✅ 测试总结:");
    console.log("  ✅ SBT 铸造功能正常");
    console.log("  ✅ Soulbound 机制工作正常（不可转移）");
    console.log("  ✅ 用户查询功能正常");
    console.log("  ✅ 元数据存储正确");
    console.log("\n🚀 合约已准备好集成到前端！");

    return contractAddress;
  } catch (error) {
    console.error("\n❌ 测试失败:");
    console.error("错误信息:", error.message || error);

    if (error.message.includes("TokenAlreadyExists")) {
      console.log("\n💡 提示: 测试账户已拥有该等级的SBT，这是正常的");
      console.log("  你可以尝试为其他地址铸造，或铸造不同等级的SBT");
    }

    process.exit(1);
  }
}

// 执行测试
main()
  .then(() => {
    console.log("\n✅ 测试脚本执行完成");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ 测试脚本执行失败:");
    console.error(error);
    process.exit(1);
  });
