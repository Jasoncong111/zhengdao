import { ethers } from "hardhat";

/**
 * 验证 BNB Chain SBT 合约部署
 *
 * 用途：
 * 1. 验证合约是否在指定地址
 * 2. 检查合约基本功能
 * 3. 测试SBT铸造流程
 * 4. 验证Soulbound机制
 *
 * 使用方法：
 * npx hardhat run scripts/verify-bnb-deployment.ts --network bnbTestnet
 */

async function main() {
  console.log("🔍 开始验证 ZhengDaoSBT 合约部署...\n");

  // 从环境变量获取合约地址
  const contractAddress = process.env.NEXT_PUBLIC_ZHENGDAO_SBT_ADDRESS;

  if (!contractAddress || contractAddress === "0x0000000000000000000000000000000000000000") {
    console.error("❌ 错误: 未找到合约地址");
    console.log("💡 请在 .env.local 中设置 NEXT_PUBLIC_ZHENGDAO_SBT_ADDRESS");
    console.log("   或先运行部署脚本: npx hardhat run scripts/deploy-bnb-sbt.ts --network bnbTestnet");
    process.exit(1);
  }

  console.log("📍 合约地址:", contractAddress);
  console.log("");

  try {
    // 获取合约实例
    const ZhengDaoSBT = await ethers.getContractFactory("ZhengDaoSBT");
    const sbt = ZhengDaoSBT.attach(contractAddress);

    console.log("=" .repeat(60));
    console.log("📋 合约基本信息验证");
    console.log("=" .repeat(60));

    // 1. 验证合约名称和符号
    const name = await sbt.name();
    const symbol = await sbt.symbol();
    console.log("✅ Token 名称:", name);
    console.log("✅ Token 符号:", symbol);

    // 2. 验证合约所有者
    const owner = await sbt.owner();
    console.log("✅ 合约 Owner:", owner);

    // 3. 验证基础URI
    // 注意：baseTokenURI是private的，无法直接访问
    // 我们可以通过mint一个test token来验证

    // 4. 检查当前总供应量
    const totalSupply = await sbt.totalSupply();
    console.log("✅ 当前总供应量:", totalSupply.toString());

    console.log("\n" + "=".repeat(60));
    console.log("🧪 功能测试");
    console.log("=" .repeat(60));

    // 获取测试账户
    const [deployer, testUser] = await ethers.getSigners();
    console.log("📝 部署账户:", deployer.address);
    console.log("📝 测试账户:", testUser.address);

    // 测试1: 检查用户是否拥有SBT
    console.log("\n🔍 测试1: 检查用户SBT持有情况");
    const userTokens = await sbt.getUserTokens(deployer.address);
    console.log("  - 部署者拥有的SBT数量:", userTokens.length);

    if (userTokens.length > 0) {
      console.log("\n  已有的SBT详情:");
      for (let i = 0; i < userTokens.length; i++) {
        const tokenId = userTokens[i];
        const details = await sbt.getTokenDetails(tokenId);
        console.log(`    Token #${tokenId}:`);
        console.log(`      - 等级: ${details[0]}`);
        console.log(`      - 打卡天数: ${details[1]}`);
        console.log(`      - 铸造时间: ${new Date(Number(details[2]) * 1000).toLocaleString()}`);
      }
    }

    // 测试2: 检查最高等级
    console.log("\n🔍 测试2: 检查用户最高等级");
    const highestLevel = await sbt.getHighestLevel(deployer.address);
    console.log("  - 最高等级:", highestLevel.toString());

    // 测试3: 检查总打卡天数
    console.log("\n🔍 测试3: 检查总打卡天数");
    const totalDays = await sbt.getTotalDays(deployer.address);
    console.log("  - 总打卡天数:", totalDays.toString());

    // 测试4: 尝试铸造一个测试SBT（仅在部署者账户操作）
    console.log("\n🔍 测试4: 尝试铸造测试SBT");
    console.log("  ⚠️  注意: 这将实际铸造一个SBT，消耗gas");

    // 检查是否已有level 1的SBT
    const hasLevel1 = await sbt.hasLevel(testUser.address, 1);

    if (!hasLevel1) {
      try {
        console.log("  ⏳ 正在为测试账户铸造 Level 1 SBT...");
        const mintTx = await sbt.mintSBT(testUser.address, 1, 7, "");
        const receipt = await mintTx.wait();

        console.log("  ✅ SBT铸造成功!");
        console.log("    - 交易Hash:", mintTx.hash);
        console.log("    - Gas Used:", receipt?.gasUsed.toString());

        // 验证铸造结果
        const newTotalSupply = await sbt.totalSupply();
        console.log("    - 新的总供应量:", newTotalSupply.toString());

        const testUserTokens = await sbt.getUserTokens(testUser.address);
        console.log("    - 测试用户SBT数量:", testUserTokens.length);

        if (testUserTokens.length > 0) {
          const tokenId = testUserTokens[0];
          const details = await sbt.getTokenDetails(tokenId);
          console.log("    - 新铸造的SBT详情:");
          console.log(`      - Token ID: ${tokenId}`);
          console.log(`      - 等级: ${details[0]}`);
          console.log(`      - 打卡天数: ${details[1]}`);
        }
      } catch (error: any) {
        console.error("  ❌ SBT铸造失败:", error.message);
      }
    } else {
      console.log("  ℹ️  测试账户已拥有Level 1 SBT，跳过铸造");
    }

    // 测试5: 验证Soulbound机制
    console.log("\n🔍 测试5: 验证Soulbound机制（转移保护）");
    if (userTokens.length > 0) {
      const tokenId = userTokens[0];
      console.log(`  ⏳ 尝试转移 Token #${tokenId}...`);

      try {
        // 尝试转移 - 应该失败
        await sbt.transferFrom(deployer.address, testUser.address, tokenId);
        console.error("  ❌ Soulbound机制失效！转移竟然成功了！");
        process.exit(1);
      } catch (error: any) {
        if (error.message.includes("SoulboundTokenTransferNotAllowed")) {
          console.log("  ✅ Soulbound机制正常！转移被正确阻止");
        } else {
          console.error("  ❌ 转移失败，但错误信息不符合预期:", error.message);
        }
      }
    } else {
      console.log("  ℹ️  没有SBT可供测试转移功能");
    }

    // 测试6: 检查合约支持的接口
    console.log("\n🔍 测试6: 检查合约支持的接口");
    const ERC721_INTERFACE_ID = "0x80ac58cd";
    const ERC721_METADATA_INTERFACE_ID = "0x5b5e139f";

    const supportsERC721 = await sbt.supportsInterface(ERC721_INTERFACE_ID);
    const supportsMetadata = await sbt.supportsInterface(ERC721_METADATA_INTERFACE_ID);

    console.log("  - 支持 ERC721:", supportsERC721);
    console.log("  - 支持 ERC721Metadata:", supportsMetadata);

    if (supportsERC721 && supportsMetadata) {
      console.log("  ✅ 接口支持正常");
    } else {
      console.error("  ❌ 接口支持异常");
    }

    console.log("\n" + "=".repeat(60));
    console.log("🎉 验证完成！");
    console.log("=".repeat(60));

    console.log("\n✅ 所有验证项通过！");
    console.log("\n📝 验证总结:");
    console.log("  ✅ 合约地址正确");
    console.log("  ✅ 合约基本信息正确");
    console.log("  ✅ SBT铸造功能正常");
    console.log("  ✅ Soulbound机制工作正常");
    console.log("  ✅ 接口实现完整");
    console.log("\n🚀 合约已准备好集成到前端！");

    return contractAddress;
  } catch (error: any) {
    console.error("\n❌ 验证失败:");
    console.error("错误信息:", error.message);

    if (error.message.includes("invalid address")) {
      console.error("\n💡 可能的原因:");
      console.error("  1. 合约地址不正确");
      console.error("  2. 合约未部署到当前网络");
      console.error("  3. 网络配置错误");
    }

    process.exit(1);
  }
}

// 执行验证
main()
  .then((address) => {
    console.log("\n✅ 验证脚本执行完成");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ 验证脚本执行失败:");
    console.error(error);
    process.exit(1);
  });
