import { ethers } from "hardhat";

async function main() {
  console.log("💰 检查账户余额\n");

  const [deployer] = await ethers.getSigners();
  const address = await deployer.getAddress();
  const balance = await ethers.provider.getBalance(address);

  console.log("📝 账户地址:", address);
  console.log("💰 当前余额:", ethers.formatEther(balance), "BNB\n");

  // 检查余额是否足够部署
  const minRequired = ethers.parseEther("0.01");
  if (balance < minRequired) {
    console.error("❌ 错误: 余额不足！");
    console.error("   最低需要:", ethers.formatEther(minRequired), "BNB");
    console.error("   当前余额:", ethers.formatEther(balance), "BNB");
    console.log("\n💡 请从水龙头获取测试币:");
    console.log("   https://testnet.bnbchain.org/faucet-smart");
    console.log("   https://testnet.bnbchain.org/faucet\n");
    process.exit(1);
  }

  console.log("✅ 余额充足，可以部署合约！\n");

  // 显示网络信息
  const network = await ethers.provider.getNetwork();
  console.log("🌐 网络信息:");
  console.log("   - Chain ID:", network.chainId.toString());
  console.log("   - 网络名称:", network.name === "unknown" ? "BNB Testnet" : network.name);

  if (network.chainId === 97n) {
    console.log("   - BscScan: https://testnet.bscscan.com/address/" + address);
  } else if (network.chainId === 56n) {
    console.log("   - BscScan: https://bscscan.com/address/" + address);
    console.log("\n⚠️  警告: 您正在连接到主网！");
  }
  console.log("");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
