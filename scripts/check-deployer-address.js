const { ethers } = require("hardhat");

async function main() {
  // 获取当前部署者账户
  const [deployer] = await ethers.getSigners();
  const deployerAddress = deployer.address;
  
  console.log("\n📋 部署账户信息:");
  console.log("  当前私钥对应的地址:", deployerAddress);
  
  const contractAddress = "0x5aE01F579cC82568A680bb160e4f5d184033F6A7";
  const ZhengDaoSBT = await ethers.getContractFactory("ZhengDaoSBT");
  const sbt = ZhengDaoSBT.attach(contractAddress);
  
  const owner = await sbt.owner();
  console.log("  合约 Owner 地址:", owner);
  console.log("");
  
  if (deployerAddress.toLowerCase() === owner.toLowerCase()) {
    console.log("✅ 当前私钥是合约的所有者！");
    console.log("💡 您可以使用现有的合约进行测试和铸造");
  } else {
    console.log("⚠️  当前私钥不是合约的所有者");
    console.log("💡 建议:");
    console.log("   1. 如果是您的测试账户，可以使用现有合约");
    console.log("   2. 如果需要控制权限，需要重新部署");
  }
  
  // 检查余额
  const balance = await ethers.provider.getBalance(deployerAddress);
  console.log("");
  console.log("💰 账户余额:", ethers.formatEther(balance), "BNB");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
