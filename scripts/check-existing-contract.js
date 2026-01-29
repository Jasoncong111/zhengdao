const { ethers } = require("hardhat");

async function main() {
  const contractAddress = "0x5aE01F579cC82568A680bb160e4f5d184033F6A7";
  
  console.log("\n🔍 检查现有合约地址:", contractAddress);
  console.log("🔗 BscScan: https://testnet.bscscan.com/address/" + contractAddress);
  console.log("");
  
  try {
    // 尝试连接到合约
    const ZhengDaoSBT = await ethers.getContractFactory("ZhengDaoSBT");
    const sbt = ZhengDaoSBT.attach(contractAddress);
    
    // 测试基本功能
    const name = await sbt.name();
    const symbol = await sbt.symbol();
    const owner = await sbt.owner();
    const totalSupply = await sbt.totalSupply();
    
    console.log("✅ 合约存在且可访问！");
    console.log("");
    console.log("📋 合约信息:");
    console.log("  - Token 名称:", name);
    console.log("  - Token 符号:", symbol);
    console.log("  - 合约 Owner:", owner);
    console.log("  - 总供应量:", totalSupply.toString());
    console.log("");
    
    // 检查接口支持
    const supportsERC721 = await sbt.supportsInterface("0x80ac58cd");
    const supportsMetadata = await sbt.supportsInterface("0x5b5e139f");
    
    console.log("🔧 接口支持:");
    console.log("  - ERC721:", supportsERC721 ? "✅" : "❌");
    console.log("  - ERC721Metadata:", supportsMetadata ? "✅" : "❌");
    console.log("");
    
    console.log("🎉 当前合约已部署且功能正常！");
    console.log("💡 建议: 如果需要重新部署，请确认是否真的需要");
    
  } catch (error) {
    console.log("❌ 合约不存在或无法访问");
    console.log("错误信息:", error.message);
    console.log("");
    console.log("💡 建议执行新部署");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
