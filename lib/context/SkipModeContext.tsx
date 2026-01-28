'use client';

import { createContext, useState, useContext, ReactNode, useMemo } from 'react';

interface SkipModeContextType {
  isSkipMode: boolean;
  demoAddress: `0x${string}` | null;
  enableSkipMode: () => void;
  disableSkipMode: () => void;
}

const SkipModeContext = createContext<SkipModeContextType | undefined>(undefined);

const DEMO_WALLET_ADDRESS = '0x0000000000000000000000000000000000000000' as `0x${string}`;

export function SkipModeProvider({ children }: { children: ReactNode }) {
  const [isSkipMode, setIsSkipMode] = useState(false);

  const enableSkipMode = () => {
    setIsSkipMode(true);
  };

  const disableSkipMode = () => {
    setIsSkipMode(false);
  };

  const value = useMemo(() => ({
    isSkipMode,
    demoAddress: isSkipMode ? DEMO_WALLET_ADDRESS : null,
    enableSkipMode,
    disableSkipMode,
  }), [isSkipMode]);

  return (
    <SkipModeContext.Provider value={value}>
      {children}
    </SkipModeContext.Provider>
  );
}

export function useSkipMode() {
  const context = useContext(SkipModeContext);
  if (context === undefined) {
    throw new Error('useSkipMode must be used within a SkipModeProvider');
  }
  return context;
}
