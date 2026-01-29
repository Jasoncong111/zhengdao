const { ethers } = require("hardhat");

async function main() {
  const ZhengDaoSBT = await ethers.getContractFactory("ZhengDaoSBT");
  const sbt = await ZhengDaoSBT.deploy("Test", "TST", "ipfs://test/");
  await sbt.waitForDeployment();

  // 标准接口 ID
  const interfaces = {
    "IERC165": "0x01ffc9a7",
    "IERC721": "0x80ac58cd",
    "IERC721Metadata": "0x5b5e139f",
    "IERC721Enumerable": "0x780e9d63",
    "Tested in tests (wrong?)": "0x5a5bb372", // 测试中使用的
  };

  console.log("\n=== Interface Support Check ===");
  for (const [name, id] of Object.entries(interfaces)) {
    const supported = await sbt.supportsInterface(id);
    console.log(`${name} (${id}): ${supported ? "✅ SUPPORTED" : "❌ NOT SUPPORTED"}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
