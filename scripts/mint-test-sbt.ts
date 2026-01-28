import { ethers } from "hardhat";

async function main() {
  console.log("🧪 开始测试铸造 ZhengDaoSBT...\n");

  // 从环境变量获取合约地址
  const contractAddress = process.env.ZHENGDAO_SBT_ADDRESS;
  if (!contractAddress) {
    console.error("❌ 错误: 请设置环境变量 ZHENGDAO_SBT_ADDRESS");
    console.log("💡 示例: ZHENGDAO_SBT_ADDRESS=0x... npx hardhat run scripts/mint-test-sbt.ts --network bnbTestnet");
    process.exit(1);
  }

  console.log("📍 合约地址:", contractAddress);

  // 获取签名者
  const [deployer] = await ethers.getSigners();
  console.log("📝 部署账户:", deployer.address);

  // 连接合约
  const ZhengDaoSBT = await ethers.getContractFactory("ZhengDaoSBT");
  const sbt = ZhengDaoSBT.attach(contractAddress);

  console.log("\n📋 测试铸造参数:");

  // 测试地址（使用部署者地址）
  const testAddress = deployer.address;
  const testLevel = 1;
  const testCheckInDays = 7;

  console.log("  - 接收地址:", testAddress);
  console.log("  - 等级:", testLevel);
  console.log("  - 打卡天数:", testCheckInDays);
  console.log("");

  // 检查是否已拥有该等级
  const hasLevel = await sbt.hasLevel(testAddress, testLevel);
  if (hasLevel) {
    console.log("⚠️  该地址已拥有等级", testLevel, "的 SBT，跳过铸造");
    return;
  }

  // 铸造 SBT
  console.log("⏳ 正在铸造 SBT...");
  const tx = await sbt.mintSBT(testAddress, testLevel, testCheckInDays, "");
  const receipt = await tx.wait();

  console.log("\n✅ SBT 铸造成功!");
  console.log("📊 交易详情:");
  console.log("  - 交易 Hash:", receipt.hash);
  console.log("  - Gas Used:", receipt.gasUsed.toString());
  console.log("");

  // 查询铸造的 SBT 信息
  const tokens = await sbt.getUserTokens(testAddress);
  const tokenId = tokens[tokens.length - 1]; // 获取最新的 token

  const [level, checkInDays, date] = await sbt.getTokenDetails(tokenId);
  const uri = await sbt.tokenURI(tokenId);

  console.log("🎖️  SBT 详情:");
  console.log("  - Token ID:", tokenId.toString());
  console.log("  - 等级:", level.toString());
  console.log("  - 打卡天数:", checkInDays.toString());
  console.log("  - 铸造时间:", new Date(Number(date) * 1000).toLocaleString());
  console.log("  - 元数据 URI:", uri);
  console.log("");

  // 测试禁止转移
  console.log("🧪 测试 SBT 不可转移特性...");
  try {
    await sbt.transferFrom(testAddress, ethers.Wallet.createRandom().address, tokenId);
    console.error("❌ 错误: SBT 不应该能够转移!");
  } catch (error: any) {
    if (error.message.includes("SoulboundTokenTransferNotAllowed")) {
      console.log("✅ SBT 转移已被正确阻止");
    } else {
      console.error("⚠️  意外的错误:", error.message);
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log("🎉 测试完成!");
  console.log("=".repeat(60));
}

main()
  .then(() => {
    console.log("✅ 测试脚本执行完成");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ 测试失败:");
    console.error(error);
    process.exit(1);
  });
}
