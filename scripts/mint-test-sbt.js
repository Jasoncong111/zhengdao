const hre = require("hardhat");

/**
 * 测试脚本：在 BSC 测试网上铸造测试 SBT
 * 运行：npx hardhat run scripts/mint-test-sbt.js --network bnbTestnet
 */

async function main() {
  console.log("🧪 开始测试 SBT 铸造功能...\n");

  // 获取合约地址
  const contractAddress = process.env.NEXT_PUBLIC_ZHENGDAO_SBT_ADDRESS;
  if (!contractAddress) {
    console.error("❌ 错误: 未找到合约地址");
    console.log("💡 请在 .env.local 中设置 NEXT_PUBLIC_ZHENGDAO_SBT_ADDRESS");
    process.exit(1);
  }

  console.log("📍 合约地址:", contractAddress);
  console.log("");

  // 获取签名者
  const [signer] = await hre.ethers.getSigners();
  console.log("📝 测试账户地址:", signer.address);

  // 获取合约实例
  console.log("⏳ 正在连接合约...");
  const sbt = await hre.ethers.getContractAt("ZhengDaoSBT", contractAddress);

  // 检查账户当前 SBT 余额
  console.log("\n🔍 检查当前 SBT 余额...");
  const balance = await sbt.balanceOf(signer.address);
  console.log("  - 当前 SBT 数量:", balance.toString());

  // 检查是否已经铸造过 SBT
  if (balance > 0) {
    console.log("\n✅ 账户已拥有 SBT");
    console.log("💡 提示: 如需查看 SBT 详细信息，请访问 BscScan");
    console.log("   https://testnet.bscscan.com/address/" + signer.address);
    return;
  }

  // 测试铸造 SBT
  console.log("\n⏳ 开始铸造 SBT...");
  try {
    // 假设用户已经修行了 100 天（Level 2: 知止）
    const level = 2; // Level 2: 知止
    const checkInDays = 100;
    const uri = ""; // 使用默认 URI

    // 调用 mintSBT 函数（需要合约 owner 或有权限的地址）
    const tx = await sbt.mintSBT(signer.address, level, checkInDays, uri);
    console.log("  - 交易 Hash:", tx.hash);

    console.log("⏳ 等待交易确认...");
    const receipt = await tx.wait();
    console.log("  - 交易确认，Block Number:", receipt.blockNumber);
    console.log("  - Gas Used:", receipt.gasUsed.toString());

    // 验证铸造结果
    console.log("\n✅ SBT 铸造成功！验证结果...");

    const newBalance = await sbt.balanceOf(signer.address);
    console.log("  - 新的 SBT 数量:", newBalance.toString());

    // 从 userTokens 获取 token ID
    const userTokensList = await sbt.userTokens(signer.address);
    const tokenId = userTokensList[0];
    console.log("  - Token ID:", tokenId.toString());

    const tokenLevel = await sbt.tokenLevel(tokenId);
    console.log("  - 当前等级:", tokenLevel.toString(), "(Level 2: 知止)");

    const tokenDays = await sbt.tokenCheckInDays(tokenId);
    console.log("  - 打卡天数:", tokenDays.toString());

    const tokenURI = await sbt.tokenURI(tokenId);
    console.log("  - Token URI:", tokenURI);

    console.log("\n✅ SBT 铸造测试通过！");

  } catch (error) {
    console.error("\n❌ SBT 铸造失败:");
    console.error(error);

    // 检查是否是因为没有权限
    if (error.message.includes("Not authorized")) {
      console.log("\n💡 提示: 只有合约 owner 或授权的地址才能铸造 SBT");
      console.log("   当前合约 owner:", await sbt.owner());
    }

    process.exit(1);
  }

  console.log("\n" + "=".repeat(60));
  console.log("🎉 测试完成！");
  console.log("=".repeat(60));
  console.log("\n📊 合约信息:");
  console.log("📍 合约地址:", contractAddress);
  console.log("🔗 BscScan: https://testnet.bscscan.com/address/" + contractAddress);
  console.log("");
}

// 执行测试
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
