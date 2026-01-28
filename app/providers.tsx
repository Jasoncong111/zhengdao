'use client';

import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { wagmiConfig } from '@/lib/wagmi-config';
import { SkipModeProvider } from '@/lib/context/SkipModeContext';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <SkipModeProvider>
          {children}
        </SkipModeProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
