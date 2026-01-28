# Solana SBT程序部署检查清单

**用于**: TASK-2-2（测试）和 TASK-2-3（部署）
**负责人**: AI #2 (Solana程序工程师)
**日期**: 2026-01-27

---

## 📋 环境准备检查

### Phase 1: 工具安装

- [ ] **Rust工具链**
  - [ ] `rustc` 版本 >= 1.70
  - [ ] `cargo` 可用
  - [ ] 验证命令: `rustc --version`

- [ ] **Solana CLI**
  - [ ] `solana` 命令可用
  - [ ] 版本 >= 1.16
  - [ ] 验证命令: `solana --version`

- [ ] **Anchor框架**
  - [ ] `anchor` 命令可用
  - [ ] 版本 >= 0.29.0
  - [ ] 验证命令: `anchor --version`

- [ ] **Node.js & npm**
  - [ ] Node.js 版本 >= 16
  - [ ] npm 版本 >= 8
  - [ ] 验证命令: `node --version` 和 `npm --version`

### Phase 2: Solana配置

- [ ] **网络配置**
  - [ ] 配置为devnet
  - [ ] RPC URL: `https://api.devnet.solana.com`
  - [ ] 验证命令: `solana config get`

- [ ] **钱包配置**
  - [ ] 密钥对存在 (`~/.config/solana/id.json`)
  - [ ] 可以查看钱包地址
  - [ ] 验证命令: `solana address`

- [ ] **SOL余额**
  - [ ] 至少有2 SOL用于测试
  - [ ] 至少有5 SOL用于部署
  - [ ] 验证命令: `solana balance`
  - [ ] 如果不足: `solana airdrop 2`

### Phase 3: 项目文件

- [ ] **核心代码文件**
  - [ ] `/programs/zhengdao-sbt/src/lib.rs` 存在
  - [ ] `/programs/zhengdao-sbt/tests/zhengdao-sbt.ts` 存在
  - [ ] `/programs/zhengdao-sbt/Anchor.toml` 存在

- [ ] **配置文件**
  - [ ] `package.json` 配置正确
  - [ ] `tsconfig.json` 存在
  - [ ] `Anchor.toml` 配置正确

- [ ] **脚本文件**
  - [ ] `scripts/prepare-environment.sh` 可执行
  - [ ] `scripts/test.sh` 可执行
  - [ ] `scripts/deploy-devnet.sh` 可执行
  - [ ] `scripts/verify-deployment.sh` 可执行

### Phase 4: 依赖安装

- [ ] **Node.js依赖**
  - [ ] `node_modules/` 目录存在
  - [ ] `@coral-xyz/anchor` 已安装
  - [ ] `@solana/web3.js` 已安装
  - [ ] 验证命令: `npm list --depth=0`

---

## 🧪 TASK-2-2: 测试前检查

### Pre-Test Checks

- [ ] **程序编译**
  - [ ] 运行 `anchor build` 成功
  - [ ] `target/deploy/zhengdao_sbt.so` 存在
  - [ ] `target/idl/zhengdao_sbt.json` 存在
  - [ ] `target/types/zhengdao_sbt.ts` 存在

- [ ] **本地验证器**
  - [ ] 可以启动 `solana-test-validator`
  - [ ] 或者 `anchor test` 能自动启动

- [ ] **测试文件**
  - [ ] 测试文件存在: `tests/zhengdao-sbt.ts`
  - [ ] 10个测试用例定义完整
  - [ ] 没有语法错误

### Test Execution

运行测试命令:
```bash
anchor test
```

- [ ] **测试结果**
  - [ ] 所有10个测试通过
  - [ ] 没有失败或跳过的测试
  - [ ] 测试覆盖所有功能

- [ ] **预期测试**
  - [ ] ✅ 初始化程序
  - [ ] ✅ 铸造Level 1 SBT
  - [ ] ✅ 铸造所有6个等级
  - [ ] ✅ 拒绝无效等级(7)
  - [ ] ✅ 拒绝无效等级(0)
  - [ ] ✅ 管理员更新元数据
  - [ ] ✅ 拒绝未授权更新
  - [ ] ✅ 获取SBT信息
  - [ ] ✅ 处理超长URI
  - [ ] ✅ 多用户并发铸造

### Post-Test Verification

- [ ] **测试覆盖率**
  - [ ] 覆盖率 >85%
  - [ ] 所有代码路径执行
  - [ ] 边界条件测试

- [ ] **测试报告**
  - [ ] 测试日志保存
  - [ ] 性能指标记录
  - [ ] 错误信息完整

---

## 🚀 TASK-2-3: 部署前检查

### Pre-Deployment Checks

- [ ] **网络确认**
  - [ ] 当前网络是devnet
  - [ ] 验证: `solana config get | grep "RPC URL"`

- [ ] **程序ID**
  - [ ] 当前使用占位符ID
  - [ ] 或已有正式程序ID
  - [ ] 验证: 查看Anchor.toml

- [ ] **余额检查**
  - [ ] 钱包余额 >=5 SOL
  - [ ] 验证: `solana balance`
  - [ ] 如需更多: `solana airdrop 5`

- [ ] **最新代码**
  - [ ] 程序已重新编译
  - [ ] 使用最新版本
  - [ ] 验证: `anchor build`

### Deployment Execution

运行部署命令:
```bash
./scripts/deploy-devnet.sh
```

或手动部署:
```bash
anchor deploy --program-name zhengdao_sbt
```

- [ ] **部署过程**
  - [ ] 程序成功上传
  - [ ] 程序ID生成/确认
  - [ ] 交易确认成功

- [ ] **配置更新**
  - [ ] Anchor.toml更新为实际程序ID
  - [ ] IDL文件更新
  - [ ] 类型定义更新

### Post-Deployment Verification

- [ ] **程序验证**
  - [ ] 程序在链上可查
  - [ ] 验证: `solana program show <PROGRAM_ID>`
  - [ ] Explorer可以查看

- [ ] **功能性测试**
  - [ ] 可以调用initialize
  - [ ] 可以调用mint_sbt
  - [ ] 可以调用update_metadata
  - [ ] 可以调用get_sbt

- [ ] **部署记录**
  - [ ] 部署日志创建
  - [ ] 程序ID记录
  - [ ] Explorer链接保存

---

## 📊 部署后清单

### 立即任务

- [ ] **记录程序ID**
  - [ ] 保存到文档
  - [ ] 更新前端配置
  - [ ] 通知团队

- [ ] **验证程序**
  - [ ] 在Solana Explorer查看
  - [ ] 运行验证脚本
  - [ ] 测试基本功能

- [ ] **文档更新**
  - [ ] 更新部署日志
  - [ ] 更新README
  - [ ] 创建部署报告

### 后续任务

- [ ] **前端集成准备**（AI #3）
  - [ ] 提供IDL文件
  - [ ] 提供程序ID
  - [ ] 提供使用示例

- [ ] **测试数据准备**
  - [ ] 准备测试账户
  - [ ] 准备测试元数据
  - [ ] 准备测试场景

---

## ✅ 最终验收标准

### TASK-2-2: 测试完成

- [ ] 所有10个测试通过
- [ ] 测试覆盖率 >85%
- [ ] 无严重bug
- [ ] 测试报告完整

### TASK-2-3: 部署完成

- [ ] 程序部署到devnet
- [ ] 程序可正常调用
- [ ] Explorer可查看
- [ ] 文档齐全

### 环境准备完成

- [ ] 所有工具安装
- [ ] 配置正确
- [ ] 可以正常开发
- [ ] 可以继续迭代

---

## 🐛 常见问题速查

| 问题 | 检查项 | 解决方案 |
|-----|--------|---------|
| `command not found` | 工具安装 | 运行 `prepare-environment.sh` |
| `out of rent` | 钱包余额 | 运行 `solana airdrop 2` |
| `build failed` | 代码错误 | 检查 `src/lib.rs` 语法 |
| `test timeout` | 验证器问题 | 使用 `--skip-local-validator` |
| `deploy failed` | 网络/余额 | 检查devnet和SOL余额 |

---

## 📞 紧急联系

如果遇到无法解决的问题：

1. **查看日志**: 仔细阅读错误信息
2. **查看文档**: 检查README和QUICK_START
3. **在线搜索**: Solana Stack Exchange
4. **询问团队**: 在项目频道提问

---

## 🎯 成功标志

当以下所有项都打勾时，TASK-B完成：

- [ ] ✅ 环境配置完成
- [ ] ✅ 程序编译成功
- [ ] ✅ 所有测试通过
- [ ] ✅ 程序部署成功
- [ ] ✅ 功能验证通过
- [ ] ✅ 文档齐全

---

**使用说明**:
1. 打印此清单或复制到编辑器
2. 按顺序逐项检查
3. 打勾确认完成
4. 遇到问题查看故障排查章节
5. 完成后通知团队

---

**版本**: v1.0
**最后更新**: 2026-01-27
**维护者**: AI #2
