import { http, createConfig } from 'wagmi';
import { bscTestnet } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

// 自定义 Solana Devnet 配置（通过 EVM 兼容层）
// 注意：Solana 原生不支持 Wagmi，这里使用 BSC 测试网作为主要演示网络
// 如需真正的 Solana 支持，需要使用 @solana/web3.js

// Wagmi configuration - 使用 BNB 测试网
export const wagmiConfig = createConfig({
  chains: [bscTestnet],
  connectors: [injected()],
  transports: {
    [bscTestnet.id]: http('https://data-seed-prebsc-1-s1.binance.org:8545'),
  },
  ssr: true,
});
