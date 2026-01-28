const hre = require("hardhat");

async function main() {
  console.log("🚀 开始部署 ZhengDaoSBT 合约到 BNB Chain Testnet...\n");

  // 获取部署者账户
  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 部署账户地址:", deployer.address);

  // 获取账户余额
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 账户余额:", hre.ethers.formatEther(balance), "tBNB\n");

  // 检查余额是否足够
  if (balance < hre.ethers.parseEther("0.01")) {
    console.error("❌ 错误: 余额不足，至少需要 0.01 tBNB");
    console.log("💡 请从水龙头获取测试币: https://testnet.bnbchain.org/faucet-smart");
    process.exit(1);
  }

  // 部署参数
  const contractName = "ZhengDaoSBT";
  const tokenName = "ZhengDao Soulbound Token";
  const tokenSymbol = "ZDSBT";
  const baseTokenURI = "https://your-domain.com/api/sbt-metadata/";

  console.log("📋 合约部署参数:");
  console.log("  - 合约名称:", contractName);
  console.log("  - Token 名称:", tokenName);
  console.log("  - Token 符号:", tokenSymbol);
  console.log("  - 基础 URI:", baseTokenURI);
  console.log("");

  // 获取合约工厂
  console.log("⏳ 正在部署合约...");
  const ZhengDaoSBT = await hre.ethers.getContractFactory(contractName);

  // 部署合约
  const sbt = await ZhengDaoSBT.deploy(
    tokenName,
    tokenSymbol,
    baseTokenURI
  );

  await sbt.waitForDeployment();
  const address = await sbt.getAddress();

  console.log("\n✅ 合约部署成功!");
  console.log("📍 合约地址:", address);
  console.log("🔗 BscScan: https://testnet.bscscan.com/address/" + address);
  console.log("");

  // 获取部署交易信息
  const deploymentTransaction = sbt.deploymentTransaction();
  if (deploymentTransaction) {
    const receipt = await hre.ethers.provider.getTransactionReceipt(deploymentTransaction.hash);
    console.log("📊 部署交易详情:");
    console.log("  - 交易 Hash:", deploymentTransaction.hash);
    console.log("  - Gas Used:", receipt?.gasUsed.toString());
    console.log("  - Block Number:", receipt?.blockNumber);
    console.log("");
  }

  // 验证合约所有权
  const owner = await sbt.owner();
  console.log("🔐 合约 Owner:", owner);
  console.log("");

  // 测试基本功能
  console.log("🧪 正在测试合约基本功能...");
  try {
    const totalSupply = await sbt.totalSupply();
    console.log("  - 当前总供应量:", totalSupply.toString());

    const name = await sbt.name();
    const symbol = await sbt.symbol();
    console.log("  - Token 名称:", name);
    console.log("  - Token 符号:", symbol);
    console.log("");
    console.log("✅ 合约功能测试通过!");
  } catch (error) {
    console.error("❌ 合约功能测试失败:", error);
  }

  console.log("\n" + "=".repeat(60));
  console.log("🎉 部署完成!");
  console.log("=".repeat(60));
  console.log("\n📝 下一步操作:");
  console.log("1. 更新 .env.local 文件:");
  console.log(`   NEXT_PUBLIC_ZHENGDAO_SBT_ADDRESS=${address}`);
  console.log("\n2. 验证合约（需要 BSCSCAN_API_KEY）:");
  console.log(`   npx hardhat verify --network bnbTestnet ${address} "${tokenName}" "${tokenSymbol}" "${baseTokenURI}"`);
  console.log("");

  // 返回合约地址供其他脚本使用
  return address;
}

// 执行部署
main()
  .then((address) => {
    console.log("✅ 部署脚本执行完成");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ 部署失败:");
    console.error(error);
    process.exit(1);
  });
