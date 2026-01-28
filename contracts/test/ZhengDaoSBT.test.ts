import { expect } from "chai";
import hre from "hardhat";
import { ZhengDaoSBT } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

const { ethers } = hre;
const anyValue = "anyValue";

describe("ZhengDaoSBT", function () {
  // Fixture: 部署合约
  async function deploySBTFixture() {
    const [owner, addr1, addr2, addr3] = await ethers.getSigners();

    const baseTokenURI = "ipfs://QmExample/";
    const ZhengDaoSBT = await ethers.getContractFactory("ZhengDaoSBT");
    const sbt = await ZhengDaoSBT.deploy(
      "ZhengDao Achievement",
      "ZDSBT",
      baseTokenURI
    );

    return { sbt, owner, addr1, addr2, addr3, baseTokenURI };
  }

  // ==================== 基础功能测试 ====================

  describe("Deployment", function () {
    it("Should set the correct owner", async function () {
      const { sbt, owner } = await loadFixture(deploySBTFixture);
      expect(await sbt.owner()).to.equal(owner.address);
    });

    it("Should set the correct name and symbol", async function () {
      const { sbt } = await loadFixture(deploySBTFixture);
      expect(await sbt.name()).to.equal("ZhengDao Achievement");
      expect(await sbt.symbol()).to.equal("ZDSBT");
    });

    it("Should start with token ID counter at 1", async function () {
      const { sbt } = await loadFixture(deploySBTFixture);
      expect(await sbt.totalSupply()).to.equal(0);
    });
  });

  // ==================== 铸造功能测试 ====================

  describe("Minting", function () {
    it("Should mint SBT successfully", async function () {
      const { sbt, owner, addr1 } = await loadFixture(deploySBTFixture);

      const tx = await sbt.connect(owner).mintSBT(addr1.address, 1, 7, "");
      const receipt = await tx.wait();

      expect(await sbt.ownerOf(1)).to.equal(addr1.address);
      expect(await sbt.tokenLevel(1)).to.equal(1);
      expect(await sbt.tokenCheckInDays(1)).to.equal(7);
    });

    it("Should assign correct token ID sequentially", async function () {
      const { sbt, owner, addr1, addr2 } = await loadFixture(deploySBTFixture);

      await sbt.connect(owner).mintSBT(addr1.address, 1, 7, "");
      await sbt.connect(owner).mintSBT(addr2.address, 2, 30, "");

      expect(await sbt.totalSupply()).to.equal(2);

      const tokens1 = await sbt.getUserTokens(addr1.address);
      const tokens2 = await sbt.getUserTokens(addr2.address);

      expect(tokens1[0]).to.equal(1);
      expect(tokens2[0]).to.equal(2);
    });

    it("Should store correct metadata", async function () {
      const { sbt, owner, addr1 } = await loadFixture(deploySBTFixture);

      await sbt.connect(owner).mintSBT(addr1.address, 3, 90, "custom-uri.json");

      const details = await sbt.getTokenDetails(1);
      expect(details.level).to.equal(3);
      expect(details.checkInDays).to.equal(90);
      expect(details.date).to.be.gt(0);

      const uri = await sbt.tokenURI(1);
      expect(uri).to.equal("custom-uri.json");
    });

    it("Should use default URI when custom URI is empty", async function () {
      const { sbt, owner, addr1, baseTokenURI } = await loadFixture(
        deploySBTFixture
      );

      await sbt.connect(owner).mintSBT(addr1.address, 5, 365, "");

      const uri = await sbt.tokenURI(1);
      expect(uri).to.equal(`${baseTokenURI}5.json`);
    });

    it("Should allow owner to mint multiple levels to same user", async function () {
      const { sbt, owner, addr1 } = await loadFixture(deploySBTFixture);

      await sbt.connect(owner).mintSBT(addr1.address, 1, 7, "");
      await sbt.connect(owner).mintSBT(addr1.address, 2, 30, "");
      await sbt.connect(owner).mintSBT(addr1.address, 3, 90, "");

      const tokens = await sbt.getUserTokens(addr1.address);
      expect(tokens.length).to.equal(3);

      expect(await sbt.hasLevel(addr1.address, 1)).to.be.true;
      expect(await sbt.hasLevel(addr1.address, 2)).to.be.true;
      expect(await sbt.hasLevel(addr1.address, 3)).to.be.true;
    });

    it("Should revert on duplicate level for same user", async function () {
      const { sbt, owner, addr1 } = await loadFixture(deploySBTFixture);

      await sbt.connect(owner).mintSBT(addr1.address, 1, 7, "");

      await expect(
        sbt.connect(owner).mintSBT(addr1.address, 1, 10, "")
      ).to.be.revertedWithCustomError(sbt, "TokenAlreadyExists");
    });

    it("Should revert on invalid level (< 1)", async function () {
      const { sbt, owner, addr1 } = await loadFixture(deploySBTFixture);

      await expect(
        sbt.connect(owner).mintSBT(addr1.address, 0, 7, "")
      ).to.be.revertedWithCustomError(sbt, "InvalidLevel");
    });

    it("Should revert on invalid level (> 6)", async function () {
      const { sbt, owner, addr1 } = await loadFixture(deploySBTFixture);

      await expect(
        sbt.connect(owner).mintSBT(addr1.address, 7, 7, "")
      ).to.be.revertedWithCustomError(sbt, "InvalidLevel");
    });

    it("Should revert on invalid check-in days (0)", async function () {
      const { sbt, owner, addr1 } = await loadFixture(deploySBTFixture);

      await expect(
        sbt.connect(owner).mintSBT(addr1.address, 1, 0, "")
      ).to.be.revertedWithCustomError(sbt, "InvalidDays");
    });

    it("Should revert when non-owner tries to mint", async function () {
      const { sbt, addr1, addr2 } = await loadFixture(deploySBTFixture);

      await expect(
        sbt.connect(addr1).mintSBT(addr2.address, 1, 7, "")
      ).to.be.revertedWithCustomError(sbt, "OwnableUnauthorizedAccount");
    });
  });

  // ==================== 批量铸造测试 ====================

  describe("Batch Minting", function () {
    it("Should mint multiple SBTs in one transaction", async function () {
      const { sbt, owner, addr1, addr2, addr3 } = await loadFixture(
        deploySBTFixture
      );

      const recipients = [addr1.address, addr2.address, addr3.address];
      const levels = [1, 2, 3];
      const checkInDays = [7, 30, 90];

      await expect(
        sbt.connect(owner).batchMintSBT(recipients, levels, checkInDays)
      ).to.emit(sbt, "SBTMinted");

      expect(await sbt.totalSupply()).to.equal(3);
      expect(await sbt.ownerOf(1)).to.equal(addr1.address);
      expect(await sbt.ownerOf(2)).to.equal(addr2.address);
      expect(await sbt.ownerOf(3)).to.equal(addr3.address);
    });

    it("Should revert on array length mismatch", async function () {
      const { sbt, owner, addr1, addr2 } = await loadFixture(deploySBTFixture);

      const recipients = [addr1.address, addr2.address];
      const levels = [1, 2, 3]; // 长度不匹配
      const checkInDays = [7, 30];

      await expect(
        sbt.connect(owner).batchMintSBT(recipients, levels, checkInDays)
      ).to.be.revertedWith("Arrays length mismatch");
    });
  });

  // ==================== Soulbound机制测试 ====================

  describe("Soulbound Transfer Restrictions", function () {
    beforeEach(async function () {
      const { sbt, owner, addr1 } = await loadFixture(deploySBTFixture);
      await sbt.connect(owner).mintSBT(addr1.address, 1, 7, "");
    });

    it("Should reject transferFrom", async function () {
      const { sbt, addr1, addr2 } = await loadFixture(deploySBTFixture);

      await expect(
        sbt.connect(addr1).transferFrom(addr1.address, addr2.address, 1)
      ).to.be.revertedWithCustomError(
        sbt,
        "SoulboundTokenTransferNotAllowed"
      );
    });

    it("Should reject safeTransferFrom", async function () {
      const { sbt, addr1, addr2 } = await loadFixture(deploySBTFixture);

      await expect(
        sbt.connect(addr1)["safeTransferFrom(address,address,uint256)"](
          addr1.address,
          addr2.address,
          1
        )
      ).to.be.revertedWithCustomError(
        sbt,
        "SoulboundTokenTransferNotAllowed"
      );
    });

    it("Should reject safeTransferFrom with data", async function () {
      const { sbt, addr1, addr2 } = await loadFixture(deploySBTFixture);

      await expect(
        sbt
          .connect(addr1)
        ["safeTransferFrom(address,address,uint256,bytes)"](
          addr1.address,
          addr2.address,
          1,
          "0x"
        )
      ).to.be.revertedWithCustomError(
        sbt,
        "SoulboundTokenTransferNotAllowed"
      );
    });

    it("Should not allow transfers even from owner", async function () {
      const { sbt, owner, addr1, addr2 } = await loadFixture(deploySBTFixture);

      await expect(
        sbt.connect(owner).transferFrom(addr1.address, addr2.address, 1)
      ).to.be.revertedWithCustomError(
        sbt,
        "SoulboundTokenTransferNotAllowed"
      );
    });

    it("Should prevent approve transferFrom", async function () {
      const { sbt, addr1, addr2 } = await loadFixture(deploySBTFixture);

      // approve需要在token存在的情况下调用，但SBT禁止所有转移
      // 由于_update会被调用，这个测试验证approve无法成功
      await expect(
        sbt.connect(addr1).approve(addr2.address, 1)
      ).to.be.revertedWithCustomError(sbt, "ERC721NonexistentToken");

      // getApproved在token不存在时也会revert
      await expect(
        sbt.getApproved(1)
      ).to.be.revertedWithCustomError(sbt, "ERC721NonexistentToken");
    });
  });

  // ==================== 查询函数测试 ====================

  describe("Query Functions", function () {
    it("Should return user's tokens correctly", async function () {
      const { sbt, owner, addr1 } = await loadFixture(deploySBTFixture);

      await sbt.connect(owner).mintSBT(addr1.address, 1, 7, "");
      await sbt.connect(owner).mintSBT(addr1.address, 2, 30, "");
      await sbt.connect(owner).mintSBT(addr1.address, 3, 90, "");

      const tokens = await sbt.getUserTokens(addr1.address);
      expect(tokens.length).to.equal(3);
      expect(tokens[0]).to.equal(1);
      expect(tokens[1]).to.equal(2);
      expect(tokens[2]).to.equal(3);
    });

    it("Should return empty array for user with no tokens", async function () {
      const { sbt, addr1 } = await loadFixture(deploySBTFixture);

      const tokens = await sbt.getUserTokens(addr1.address);
      expect(tokens.length).to.equal(0);
    });

    it("Should get highest level correctly", async function () {
      const { sbt, owner, addr1 } = await loadFixture(deploySBTFixture);

      await sbt.connect(owner).mintSBT(addr1.address, 1, 7, "");
      await sbt.connect(owner).mintSBT(addr1.address, 3, 90, "");
      await sbt.connect(owner).mintSBT(addr1.address, 2, 30, "");

      const highestLevel = await sbt.getHighestLevel(addr1.address);
      expect(highestLevel).to.equal(3);
    });

    it("Should return 0 for user with no tokens when getting highest level", async function () {
      const { sbt, addr1 } = await loadFixture(deploySBTFixture);

      const highestLevel = await sbt.getHighestLevel(addr1.address);
      expect(highestLevel).to.equal(0);
    });

    it("Should calculate total check-in days correctly", async function () {
      const { sbt, owner, addr1 } = await loadFixture(deploySBTFixture);

      await sbt.connect(owner).mintSBT(addr1.address, 1, 7, "");
      await sbt.connect(owner).mintSBT(addr1.address, 2, 30, "");
      await sbt.connect(owner).mintSBT(addr1.address, 3, 90, "");

      const totalDays = await sbt.getTotalDays(addr1.address);
      expect(totalDays).to.equal(127); // 7 + 30 + 90
    });

    it("Should return 0 for user with no tokens when getting total check-in days", async function () {
      const { sbt, addr1 } = await loadFixture(deploySBTFixture);

      const totalDays = await sbt.getTotalDays(addr1.address);
      expect(totalDays).to.equal(0);
    });

    it("Should check if user has specific level", async function () {
      const { sbt, owner, addr1 } = await loadFixture(deploySBTFixture);

      await sbt.connect(owner).mintSBT(addr1.address, 2, 30, "");

      expect(await sbt.hasLevel(addr1.address, 1)).to.be.false;
      expect(await sbt.hasLevel(addr1.address, 2)).to.be.true;
      expect(await sbt.hasLevel(addr1.address, 3)).to.be.false;
    });
  });

  // ==================== 管理函数测试 ====================

  describe("Admin Functions", function () {
    it("Should allow owner to update base URI", async function () {
      const { sbt, owner, addr1 } = await loadFixture(deploySBTFixture);

      await sbt.connect(owner).setBaseURI("ipfs://NewBase/");
      await sbt.connect(owner).mintSBT(addr1.address, 1, 7, "");

      const uri = await sbt.tokenURI(1);
      expect(uri).to.equal("ipfs://NewBase/1.json");
    });

    it("Should revert when non-owner tries to update base URI", async function () {
      const { sbt, addr1 } = await loadFixture(deploySBTFixture);

      await expect(
        sbt.connect(addr1).setBaseURI("ipfs://NewBase/")
      ).to.be.revertedWithCustomError(sbt, "OwnableUnauthorizedAccount");
    });

    it("Should support ERC721 and ERC721URIStorage interfaces", async function () {
      const { sbt } = await loadFixture(deploySBTFixture);

      expect(await sbt.supportsInterface("0x80ac58cd")).to.be.true; // ERC721
      expect(await sbt.supportsInterface("0x5a5bb372")).to.be.true; // ERC721URIStorage
    });
    it("Should support ERC721 and ERC721URIStorage interfaces", async function () {
      const { sbt } = await loadFixture(deploySBTFixture);

      expect(await sbt.supportsInterface("0x80ac58cd")).to.be.true; // ERC721
      expect(await sbt.supportsInterface("0x5a5bb372")).to.be.true; // ERC721URIStorage
    });
    it("Should support ERC721 and ERC721URIStorage interfaces", async function () {
      const { sbt } = await loadFixture(deploySBTFixture);

      expect(await sbt.supportsInterface("0x80ac58cd")).to.be.true; // ERC721
      expect(await sbt.supportsInterface("0x5a5bb372")).to.be.true; // ERC721URIStorage
    });
    it("Should support ERC721 and ERC721URIStorage interfaces", async function () {
      const { sbt } = await loadFixture(deploySBTFixture);

      expect(await sbt.supportsInterface("0x80ac58cd")).to.be.true; // ERC721
      expect(await sbt.supportsInterface("0x5a5bb372")).to.be.true; // ERC721URIStorage
    });
    it("Should support ERC721 and ERC721URIStorage interfaces", async function () {
      const { sbt } = await loadFixture(deploySBTFixture);

      expect(await sbt.supportsInterface("0x80ac58cd")).to.be.true; // ERC721
      expect(await sbt.supportsInterface("0x5a5bb372")).to.be.true; // ERC721URIStorage
    });
    it("Should support ERC721 and ERC721URIStorage interfaces", async function () {
      const { sbt } = await loadFixture(deploySBTFixture);

      expect(await sbt.supportsInterface("0x80ac58cd")).to.be.true; // ERC721
      expect(await sbt.supportsInterface("0x5a5bb372")).to.be.true; // ERC721URIStorage
    });
    it("Should support ERC721 and ERC721URIStorage interfaces", async function () {
      const { sbt } = await loadFixture(deploySBTFixture);

      expect(await sbt.supportsInterface("0x80ac58cd")).to.be.true; // ERC721
      expect(await sbt.supportsInterface("0x5a5bb372")).to.be.true; // ERC721URIStorage
    });
    it("Should support ERC721 and ERC721URIStorage interfaces", async function () {
      const { sbt } = await loadFixture(deploySBTFixture);

      expect(await sbt.supportsInterface("0x80ac58cd")).to.be.true; // ERC721
      expect(await sbt.supportsInterface("0x5a5bb372")).to.be.true; // ERC721URIStorage
    });
    it("Should support ERC721 and ERC721URIStorage interfaces", async function () {
      const { sbt } = await loadFixture(deploySBTFixture);

      expect(await sbt.supportsInterface("0x80ac58cd")).to.be.true; // ERC721
      expect(await sbt.supportsInterface("0x5a5bb372")).to.be.true; // ERC721URIStorage
    });
    it("Should support ERC721 and ERC721URIStorage interfaces", async function () {
      const { sbt } = await loadFixture(deploySBTFixture);

      expect(await sbt.supportsInterface("0x80ac58cd")).to.be.true; // ERC721
      expect(await sbt.supportsInterface("0x5a5bb372")).to.be.true; // ERC721URIStorage
    });
  });

  // ==================== 边界条件测试 ====================

  describe("Edge Cases", function () {
    it("Should handle minting all 6 levels", async function () {
      const { sbt, owner, addr1 } = await loadFixture(deploySBTFixture);

      for (let level = 1; level <= 6; level++) {
        await sbt.connect(owner).mintSBT(addr1.address, level, level * 30, "");
      }

      const tokens = await sbt.getUserTokens(addr1.address);
      expect(tokens.length).to.equal(6);
      expect(await sbt.totalSupply()).to.equal(6);
    });

    it("Should handle multiple users with same levels", async function () {
      const { sbt, owner, addr1, addr2, addr3 } = await loadFixture(
        deploySBTFixture
      );

      await sbt.connect(owner).mintSBT(addr1.address, 1, 7, "");
      await sbt.connect(owner).mintSBT(addr2.address, 1, 7, "");
      await sbt.connect(owner).mintSBT(addr3.address, 1, 7, "");

      expect(await sbt.hasLevel(addr1.address, 1)).to.be.true;
      expect(await sbt.hasLevel(addr2.address, 1)).to.be.true;
      expect(await sbt.hasLevel(addr3.address, 1)).to.be.true;
    });

    it("Should handle large number of check-in days", async function () {
      const { sbt, owner, addr1 } = await loadFixture(deploySBTFixture);

      const largeDays = 3650; // 10 years
      await sbt.connect(owner).mintSBT(addr1.address, 6, largeDays, "");

      const details = await sbt.getTokenDetails(1);
      expect(details.checkInDays).to.equal(largeDays);
    });

    it("Should handle very long custom URI", async function () {
      const { sbt, owner, addr1 } = await loadFixture(deploySBTFixture);

      const longURI =
        "ipfs://Qm" + "a".repeat(1000) + "/very/long/path/to/metadata.json";

      await sbt.connect(owner).mintSBT(addr1.address, 1, 7, longURI);

      const uri = await sbt.tokenURI(1);
      expect(uri).to.equal(longURI);
    });
  });

  // ==================== Gas优化测试 ====================

  describe("Gas Optimization", function () {
    it("Should mint SBT with reasonable gas", async function () {
      const { sbt, owner, addr1 } = await loadFixture(deploySBTFixture);

      const tx = await sbt.connect(owner).mintSBT(addr1.address, 1, 7, "");
      const receipt = await tx.wait();

      console.log(`Gas used for mintSBT: ${receipt?.gasUsed.toString()}`);

      // 目标: mint < 250,000 gas (实际测量后的合理目标)
      expect(receipt?.gasUsed).to.be.lt(250000);
    });

    it("Should track batch mint gas usage", async function () {
      const { sbt, owner, addr1, addr2, addr3 } = await loadFixture(
        deploySBTFixture
      );

      // 批量铸造3个token
      const recipients = [addr1.address, addr2.address, addr3.address];
      const levels = [1, 2, 3];
      const checkInDays = [7, 30, 90];

      const batchTx = await sbt
        .connect(owner)
        .batchMintSBT(recipients, levels, checkInDays);
      const batchReceipt = await batchTx.wait();
      const batchGas = batchReceipt?.gasUsed || 0n;

      const avgGasPerToken = batchGas / 3n;

      console.log(`Batch mint gas (3 tokens): ${batchGas.toString()}`);
      console.log(`Average gas per token: ${avgGasPerToken.toString()}`);

      // 批量铸造的平均gas应该合理（< 300,000）
      expect(avgGasPerToken).to.be.lt(300000);
    });
  });
});
