import { http, createConfig } from 'wagmi';
import { bsc } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';

// Wagmi configuration - 使用 BNB 主网
export const wagmiConfig = createConfig({
  chains: [bsc],
  connectors: [
    injected(),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'default-project-id',
    }),
  ],
  transports: {
    [bsc.id]: http('https://bsc-dataseed1.binance.org'),
  },
  ssr: true,
});

// 导出链ID供其他模块使用
export const CHAIN_IDS = {
  BSC: bsc.id,
};

// 导出RPC URL
export const RPC_URLS = {
  BSC: 'https://bsc-dataseed1.binance.org',
};
