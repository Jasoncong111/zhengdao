'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  useAccount,
  useConnect,
  useDisconnect,
  useBalance,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi';
import { http, createConfig } from 'wagmi';
import { hardhat, sepolia } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

import HeroStatus from '@/components/HeroStatus';
import CheckInRing from '@/components/CheckInRing';
import WeekGrid from '@/components/WeekGrid';
import DuelCard from '@/components/DuelCard';
import MockCamera from '@/components/MockCamera';
import YieldChart from '@/components/YieldChart';
import PVPDemo from '@/components/PVPDemo';
import { ZHENGDAO_ABI, ZHENGDAO_CONTRACT_ADDRESS } from '@/lib/contractABI';

// Define WeekDayStatus type locally
type WeekDayStatus = 'victory' | 'defeat' | 'pending';

// Wagmi configuration for the demo
const config = createConfig({
  chains: [hardhat, sepolia],
  connectors: [injected()],
  transports: {
    [hardhat.id]: http(),
    [sepolia.id]: http(),
  },
});

// User data interface
interface UserData {
  principalAmount: bigint;
  totalBalance: bigint;
  lastCheckInTime: bigint;
  checkInCount: number;
}

function HomePageContent() {
  const searchParams = useSearchParams();
  const isDemoMode = searchParams.get('demo') === 'true';

  // Wallet hooks
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors, isPending: connectPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({ address });

  // Contract hooks
  const { data: userData, refetch: refetchUserData } = useReadContract({
    address: ZHENGDAO_CONTRACT_ADDRESS as `0x${string}`,
    abi: ZHENGDAO_ABI,
    functionName: 'getUserData',
    args: address ? [address] : undefined,
  });

  const { data: contractBalance } = useReadContract({
    address: ZHENGDAO_CONTRACT_ADDRESS as `0x${string}`,
    abi: ZHENGDAO_ABI,
    functionName: 'getYieldAmount',
    args: address ? [address] : undefined,
  });

  const { writeContract, data: hash, isPending: writePending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Local state
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [checkInCompleted, setCheckInCompleted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [weekData, setWeekData] = useState<WeekDayStatus[]>([
    'pending',
    'pending',
    'pending',
    'pending',
    'pending',
    'pending',
    'pending',
  ]);
  const [showCamera, setShowCamera] = useState(false);
  const [showYieldChart, setShowYieldChart] = useState(false);
  const [showPVPDemo, setShowPVPDemo] = useState(false);

  // Parse user data
  const parsedUserData: UserData | null = userData
    ? {
        principalAmount: userData[0] as bigint,
        totalBalance: userData[1] as bigint,
        lastCheckInTime: userData[2] as bigint,
        checkInCount: Number(userData[3]),
      }
    : null;

  // Calculate total balance (principal + yield)
  const totalBalance = parsedUserData?.totalBalance || 0n;
  const principalAmount = parsedUserData?.principalAmount || 0n;
  const yieldAmount = contractBalance || 0n;
  const checkInCount = parsedUserData?.checkInCount || 0;

  // Format balance for display
  const formatBalance = (balance: bigint) => {
    return Number(balance) / 1e18;
  };

  // Handle check-in - open camera first
  const handleCheckIn = async (completed: boolean) => {
    if (!completed || isCheckingIn) return;

    // Open mock camera
    setShowCamera(true);
  };

  // Handle photo capture from camera
  const handlePhotoCapture = async (imageUrl: string) => {
    setShowCamera(false);
    
    if (!address) {
      setErrorMessage('请先连接钱包');
      return;
    }

    setIsCheckingIn(true);
    setErrorMessage(null);

    try {
      console.log('[Demo] 照片已捕获，开始打卡:', imageUrl);

      // 直接调用智能合约 checkIn
      writeContract(
        {
          address: ZHENGDAO_CONTRACT_ADDRESS as `0x${string}`,
          abi: ZHENGDAO_ABI,
          functionName: 'checkIn',
        },
        {
          onSuccess: () => {
            console.log('Check-in transaction submitted');
          },
          onError: (error) => {
            console.error('Check-in error:', error);
            setErrorMessage('打卡交易失败');
            setIsCheckingIn(false);
          },
        }
      );
    } catch (error: any) {
      console.error('Check-in error:', error);
      setErrorMessage(error.message || '打卡失败');
      setIsCheckingIn(false);
    }
  };

  // 临时注释掉图片选择功能
  /*
  // Select image from camera or file picker
  const selectImage = (): Promise<File | null> => {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'environment'; // Prefer camera on mobile

      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0] || null;
        resolve(file);
      };

      input.oncancel = () => {
        resolve(null);
      };

      input.click();
    });
  };

  // Convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data URL prefix if present
        const base64 = result.includes(',') ? result.split(',')[1] : result;
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };
  */

  // Update week data on successful check-in
  useEffect(() => {
    if (isConfirmed && !checkInCompleted) {
      setCheckInCompleted(true);
      setIsCheckingIn(false);

      // Update today's status in week grid
      const today = new Date().getDay();
      const dayIndex = today === 0 ? 6 : today - 1; // Convert Sunday (0) to 6

      setWeekData((prev) => {
        const newWeekData = [...prev];
        newWeekData[dayIndex] = 'victory';
        return newWeekData;
      });

      // Refetch user data after a delay
      setTimeout(() => {
        refetchUserData();
      }, 2000);
    }
  }, [isConfirmed, checkInCompleted, refetchUserData]);

  // Reset check-in state when disconnected
  useEffect(() => {
    if (!isConnected) {
      setCheckInCompleted(false);
      setWeekData([
        'pending',
        'pending',
        'pending',
        'pending',
        'pending',
        'pending',
        'pending',
      ]);
    }
  }, [isConnected]);

  // Truncate address for display
  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-paper p-6 space-y-8">
      {/* ==================== Header ==================== */}
      <div className="flex justify-between items-center">
        <div>
          <h1
            className="text-2xl font-bold text-ink"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            证道
          </h1>
          <p
            className="text-sm text-ink/60"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            修身 · 齐家 · 证道
          </p>
        </div>

        {/* Demo Mode Indicator */}
        {isDemoMode && (
          <div
            className="px-3 py-1 text-xs font-bold text-white"
            style={{
              backgroundColor: '#D43628',
              fontFamily: 'Georgia, serif',
            }}
          >
            演示模式
          </div>
        )}
      </div>

      {/* ==================== Wallet Connection ==================== */}
      {!isConnected ? (
        <div className="space-y-4">
          <div
            className="p-6 border-2 border-ink bg-paper"
            style={{ borderRadius: 0 }}
          >
            <p
              className="text-center text-ink/80 mb-4"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              连接钱包开始打卡挑战
            </p>
            <button
              onClick={() => connect({ connector: connectors[0] })}
              disabled={connectPending}
              className="w-full py-3 bg-ink text-paper font-bold"
              style={{
                borderRadius: 0,
                fontFamily: 'Georgia, serif',
                opacity: connectPending ? 0.6 : 1,
              }}
            >
              {connectPending ? '连接中...' : '连接钱包'}
            </button>
          </div>

          {/* Demo Mode Components (without wallet) */}
          <div className="space-y-6">
            <CheckInRing isCompleted={checkInCompleted} />

            <WeekGrid weekData={weekData} />

            <DuelCard />

            {/* Demo Controls for non-connected users */}
            <div className="space-y-4 mt-8">
              <div
                className="p-4 border-2 border-ink/20"
                style={{ borderRadius: 0 }}
              >
                <h3
                  className="text-lg font-bold text-ink mb-4"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  📊 Demo 演示
                </h3>
                
                <div className="grid grid-cols-1 gap-3">
                  <button
                    onClick={() => setShowYieldChart(!showYieldChart)}
                    className="py-3 px-4 border-2 border-ink text-ink font-bold text-left"
                    style={{ borderRadius: 0, fontFamily: 'Georgia, serif' }}
                  >
                    {showYieldChart ? '隐藏' : '显示'} 收益曲线图
                  </button>
                  
                  <button
                    onClick={() => setShowPVPDemo(!showPVPDemo)}
                    className="py-3 px-4 border-2 border-ink text-ink font-bold text-left"
                    style={{ borderRadius: 0, fontFamily: 'Georgia, serif' }}
                  >
                    {showPVPDemo ? '隐藏' : '显示'} PVP 机制演示
                  </button>
                </div>
              </div>

              {/* Yield Chart */}
              {showYieldChart && (
                <YieldChart
                  days={30}
                  initialBalance={1000}
                  yieldRate={0.005}
                />
              )}

              {/* PVP Demo */}
              {showPVPDemo && <PVPDemo />}
            </div>
          </div>
        </div>
      ) : (
        /* ==================== Connected State ==================== */
        <div className="space-y-6">
          {/* Wallet Info */}
          <div className="flex justify-between items-center p-4 border border-ink/20">
            <div>
              <p
                className="text-xs text-ink/60"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                已连接
              </p>
              <p
                className="text-sm font-bold text-ink"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {truncateAddress(address || '')}
              </p>
            </div>

            <div className="text-right">
              <p
                className="text-xs text-ink/60"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                余额
              </p>
              <p
                className="text-sm font-bold text-ink"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {balance ? formatBalance(balance.value).toFixed(4) : '0.0000'} ETH
              </p>
            </div>

            <button
              onClick={() => disconnect()}
              className="px-4 py-2 text-xs border border-ink text-ink"
              style={{
                borderRadius: 0,
                fontFamily: 'Georgia, serif',
              }}
            >
              断开
            </button>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div
              className="p-4 bg-red-50 border-l-4 text-red-700"
              style={{ borderColor: '#D43628' }}
            >
              <p className="text-sm" style={{ fontFamily: 'Georgia, serif' }}>
                {errorMessage}
              </p>
            </div>
          )}

          {/* Loading State */}
          {(writePending || isConfirming) && (
            <div className="text-center py-4">
              <p
                className="text-sm text-ink/60"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {isConfirming ? '确认交易中...' : '提交交易中...'}
              </p>
            </div>
          )}

          {/* ==================== Hero Status ==================== */}
          <div className="space-y-6">
            <HeroStatus
              totalBalance={totalBalance}
              principalAmount={principalAmount}
              yieldAmount={yieldAmount}
              checkInCount={checkInCount}
              currentStreak={0}
              walletAddress={address || ''}
            />
          </div>

          {/* ==================== Check-In Ring ==================== */}
          <div className="flex justify-center">
            <CheckInRing
              isCompleted={checkInCompleted}
              onToggle={handleCheckIn}
            />
          </div>

          {/* ==================== Week Grid ==================== */}
          <WeekGrid weekData={weekData} />

          {/* ==================== Duel Card ==================== */}
          <DuelCard />

          {/* ==================== Demo Controls ==================== */}
          <div className="space-y-4 mt-8">
            <div
              className="p-4 border-2 border-ink/20"
              style={{ borderRadius: 0 }}
            >
              <h3
                className="text-lg font-bold text-ink mb-4"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                📊 Demo 演示
              </h3>
              
              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => setShowYieldChart(!showYieldChart)}
                  className="py-3 px-4 border-2 border-ink text-ink font-bold text-left"
                  style={{ borderRadius: 0, fontFamily: 'Georgia, serif' }}
                >
                  {showYieldChart ? '隐藏' : '显示'} 收益曲线图
                </button>
                
                <button
                  onClick={() => setShowPVPDemo(!showPVPDemo)}
                  className="py-3 px-4 border-2 border-ink text-ink font-bold text-left"
                  style={{ borderRadius: 0, fontFamily: 'Georgia, serif' }}
                >
                  {showPVPDemo ? '隐藏' : '显示'} PVP 机制演示
                </button>
              </div>
            </div>

            {/* Yield Chart */}
            {showYieldChart && (
              <YieldChart
                days={30}
                initialBalance={1000}
                yieldRate={0.005}
              />
            )}

            {/* PVP Demo */}
            {showPVPDemo && <PVPDemo />}
          </div>
        </div>
      )}

      {/* ==================== Mock Camera Modal ==================== */}
      {showCamera && (
        <MockCamera
          onCapture={handlePhotoCapture}
          onClose={() => setShowCamera(false)}
        />
      )}

      {/* ==================== Footer ==================== */}
      <footer className="pt-8 pb-4 text-center">
        <p
          className="text-xs text-ink/40"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          · 证道 ZhengDao ·
        </p>
      </footer>
    </div>
  );
}


export default function HomePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">加载中...</div>}>
      <HomePageContent />
    </Suspense>
  );
}
