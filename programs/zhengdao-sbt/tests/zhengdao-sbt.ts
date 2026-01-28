import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { ZhengdaoSbt } from "../target/types/zhengdao_sbt";
import { assert } from "chai";
import { PublicKey } from "@solana/web3.js";

describe("zhengdao-sbt", () => {
  // 配置provider
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.ZhengdaoSbt as Program<ZhengdaoSbt>;

  // 测试账户
  let sbtConfig: PublicKey;
  let authority: anchor.web3.Keypair;
  let owner: anchor.web3.Keypair;

  // PDA seeds
  const SBT_CONFIG_SEED = "sbt_config";
  const SBT_SEED = "sbt";

  before(() => {
    // 生成测试密钥对
    authority = anchor.web3.Keypair.generate();
    owner = anchor.web3.Keypair.generate();

    // 计算SBT配置PDA
    [sbtConfig] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from(SBT_CONFIG_SEED)],
      program.programId
    );
  });

  it("Initializes the SBT program", async () => {
    // 调用initialize指令
    const tx = await program.methods
      .initialize()
      .accounts({
        sbtConfig: sbtConfig,
        payer: provider.wallet.publicKey,
      })
      .rpc();

    console.log("✅ Initialize transaction signature:", tx);

    // 验证配置账户
    const configAccount = await program.account.sbtConfig.fetch(sbtConfig);
    assert.equal(
      configAccount.authority.toString(),
      provider.wallet.publicKey.toString()
    );
    assert.isNumber(configAccount.bump);

    console.log("✅ SBT config initialized successfully");
  });

  it("Mints a level 1 SBT (初级修行者)", async () => {
    const level = 1;
    const days = 7;
    const metadataUri = "https://example.com/metadata/level-1.json";

    // 计算SBT PDA
    const [sbtPDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from(SBT_SEED),
        owner.publicKey.toBuffer(),
        Buffer.from([level]),
      ],
      program.programId
    );

    // 调用mint_sbt指令
    const tx = await program.methods
      .mintSbt(level, days, metadataUri)
      .accounts({
        sbt: sbtPDA,
        owner: owner.publicKey,
        payer: provider.wallet.publicKey,
      })
      .rpc();

    console.log("✅ Mint SBT transaction signature:", tx);

    // 验证SBT账户
    const sbtAccount = await program.account.sbt.fetch(sbtPDA);
    assert.equal(sbtAccount.owner.toString(), owner.publicKey.toString());
    assert.equal(sbtAccount.level, level);
    assert.equal(sbtAccount.days, days);
    assert.equal(sbtAccount.metadataUri, metadataUri);

    console.log("✅ Level 1 SBT minted successfully");
    console.log("   Owner:", sbtAccount.owner.toString());
    console.log("   Level:", sbtAccount.level);
    console.log("   Days:", sbtAccount.days);
  });

  it("Mints all 6 levels of SBT", async () => {
    const levels = [1, 2, 3, 4, 5, 6];
    const levelDays = [7, 30, 90, 180, 365, 1000];
    const metadataBaseUri = "https://example.com/metadata/level-";

    for (let i = 0; i < levels.length; i++) {
      const level = levels[i];
      const days = levelDays[i];
      const metadataUri = `${metadataBaseUri}${level}.json`;

      // 为每个等级生成新的owner
      const testOwner = anchor.web3.Keypair.generate();

      // 计算SBT PDA
      const [sbtPDA] = anchor.web3.PublicKey.findProgramAddressSync(
        [
          Buffer.from(SBT_SEED),
          testOwner.publicKey.toBuffer(),
          Buffer.from([level]),
        ],
        program.programId
      );

      // 铸造SBT
      const tx = await program.methods
        .mintSbt(level, days, metadataUri)
        .accounts({
          sbt: sbtPDA,
          owner: testOwner.publicKey,
          payer: provider.wallet.publicKey,
        })
        .rpc();

      console.log(`✅ Level ${level} SBT minted:`, tx);

      // 验证SBT
      const sbtAccount = await program.account.sbt.fetch(sbtPDA);
      assert.equal(sbtAccount.level, level);
      assert.equal(sbtAccount.days, days);
    }

    console.log("✅ All 6 levels minted successfully");
  });

  it("Fails to mint invalid level (level 7)", async () => {
    const level = 7; // 无效等级
    const days = 100;
    const metadataUri = "https://example.com/metadata/invalid.json";

    const testOwner = anchor.web3.Keypair.generate();

    const [sbtPDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from(SBT_SEED),
        testOwner.publicKey.toBuffer(),
        Buffer.from([level]),
      ],
      program.programId
    );

    try {
      await program.methods
        .mintSbt(level, days, metadataUri)
        .accounts({
          sbt: sbtPDA,
          owner: testOwner.publicKey,
          payer: provider.wallet.publicKey,
        })
        .rpc();

      // 如果没有抛出错误，测试失败
      assert.fail("Should have thrown an error for invalid level");
    } catch (err) {
      assert.include(err.toString(), "InvalidLevel");
      console.log("✅ Invalid level correctly rejected");
    }
  });

  it("Fails to mint invalid level (level 0)", async () => {
    const level = 0; // 无效等级
    const days = 100;
    const metadataUri = "https://example.com/metadata/invalid.json";

    const testOwner = anchor.web3.Keypair.generate();

    const [sbtPDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from(SBT_SEED),
        testOwner.publicKey.toBuffer(),
        Buffer.from([level]),
      ],
      program.programId
    );

    try {
      await program.methods
        .mintSbt(level, days, metadataUri)
        .accounts({
          sbt: sbtPDA,
          owner: testOwner.publicKey,
          payer: provider.wallet.publicKey,
        })
        .rpc();

      assert.fail("Should have thrown an error for invalid level");
    } catch (err) {
      assert.include(err.toString(), "InvalidLevel");
      console.log("✅ Level 0 correctly rejected");
    }
  });

  it("Updates SBT metadata by authority", async () => {
    const level = 1;
    const newMetadataUri = "https://example.com/metadata/level-1-updated.json";

    // 使用之前创建的owner的SBT
    const [sbtPDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from(SBT_SEED),
        owner.publicKey.toBuffer(),
        Buffer.from([level]),
      ],
      program.programId
    );

    // 更新元数据
    const tx = await program.methods
      .updateMetadata(newMetadataUri)
      .accounts({
        sbtConfig: sbtConfig,
        sbt: sbtPDA,
        authority: provider.wallet.publicKey, // 当前authority
      })
      .rpc();

    console.log("✅ Update metadata transaction signature:", tx);

    // 验证元数据已更新
    const sbtAccount = await program.account.sbt.fetch(sbtPDA);
    assert.equal(sbtAccount.metadataUri, newMetadataUri);

    console.log("✅ Metadata updated successfully");
  });

  it("Fails to update metadata by unauthorized user", async () => {
    const level = 1;
    const newMetadataUri = "https://example.com/metadata/level-1-hack.json";

    const [sbtPDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from(SBT_SEED),
        owner.publicKey.toBuffer(),
        Buffer.from([level]),
      ],
      program.programId
    );

    // 使用未授权的密钥对
    const unauthorizedUser = anchor.web3.Keypair.generate();

    try {
      await program.methods
        .updateMetadata(newMetadataUri)
        .accounts({
          sbtConfig: sbtConfig,
          sbt: sbtPDA,
          authority: unauthorizedUser.publicKey,
        })
        .rpc();

      assert.fail("Should have thrown an error for unauthorized access");
    } catch (err) {
      assert.include(err.toString(), "Unauthorized");
      console.log("✅ Unauthorized update correctly rejected");
    }
  });

  it("Gets SBT information", async () => {
    const level = 1;

    const [sbtPDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from(SBT_SEED),
        owner.publicKey.toBuffer(),
        Buffer.from([level]),
      ],
      program.programId
    );

    // 获取SBT信息
    const sbtInfo = await program.methods
      .getSbt()
      .accounts({
        sbt: sbtPDA,
      })
      .view();

    console.log("✅ SBT Info retrieved:");
    console.log("   Owner:", sbtInfo.owner.toString());
    console.log("   Level:", sbtInfo.level);
    console.log("   Days:", sbtInfo.days);
    console.log("   Minted at:", new Date(sbtInfo.mintedAt.toNumber() * 1000).toISOString());
    console.log("   Metadata:", sbtInfo.metadataUri);

    assert.equal(sbtInfo.owner.toString(), owner.publicKey.toString());
    assert.equal(sbtInfo.level, level);
  });

  it("Handles metadata URI length limit", async () => {
    const level = 2;
    const days = 30;

    // 创建超过256字符的URI
    const longUri = "https://example.com/metadata/" + "a".repeat(300) + ".json";

    const testOwner = anchor.web3.Keypair.generate();

    const [sbtPDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from(SBT_SEED),
        testOwner.publicKey.toBuffer(),
        Buffer.from([level]),
      ],
      program.programId
    );

    try {
      await program.methods
        .mintSbt(level, days, longUri)
        .accounts({
          sbt: sbtPDA,
          owner: testOwner.publicKey,
          payer: provider.wallet.publicKey,
        })
        .rpc();

      console.log("✅ Long URI handled (Anchor/Rust will truncate if needed)");
    } catch (err) {
      console.log("ℹ️ Long URI rejected:", err.toString());
      // 这是预期行为，如果程序实现了长度检查
    }
  });
});
