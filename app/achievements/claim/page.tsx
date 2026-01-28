'use client';

/**
 * SBT领取页面 - 领取指定等级的SBT
 */

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAccount } from 'wagmi';
import { motion } from 'framer-motion';
import {
  ACHIEVEMENT_LEVELS,
  getLevelIcon,
  getLevelSBTImage,
  type AchievementLevel,
} from '@/lib/achievement-system';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { useMintSBT } from '@/lib/contracts/sbt';
import { SBTMintService } from '@/lib/sbt-mint-service';

function ClaimSBTPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { address } = useAccount();
  const levelParam = searchParams.get('level');
  const [level, setLevel] = useState<number | null>(null);
  const [levelInfo, setLevelInfo] = useState<AchievementLevel | null>(null);
  const [isMinting, setIsMinting] = useState(false);
  const [hasMinted, setHasMinted] = useState(false);

  // 使用真实的mint SBT Hook
  const { mintSBT, isPending, isConfirming, isConfirmed, hash } = useMintSBT();

  useEffect(() => {
    if (levelParam) {
      const levelNum = parseInt(levelParam);
      if (levelNum >= 1 && levelNum <= 6) {
        setLevel(levelNum);
        const info = ACHIEVEMENT_LEVELS.find(l => l.level === levelNum);
        if (info) {
          setLevelInfo(info);
        }
      } else {
        toast.error('无效的等级');
        router.push('/achievements');
      }
    } else {
      toast.error('缺少等级参数');
      router.push('/achievements');
    }
  }, [levelParam]);

  // 检查是否已铸造
  useEffect(() => {
    const checkMintStatus = async () => {
      if (address && level) {
        const minted = await SBTMintService.hasMinted(address, level);
        setHasMinted(minted);
        if (minted) {
          toast.error('此等级SBT已铸造，每个等级只能铸造一次');
        }
      }
    };

    checkMintStatus();
  }, [address, level]);

  // 监听交易确认
  useEffect(() => {
    if (hash && isConfirmed) {
      toast.success('SBT铸造成功！', { duration: 3000 });

      // 保存铸造记录
      if (address && level) {
        const metadataURI = `https://zhengdao.io/metadata/${level}/${address}`;
        SBTMintService.saveMintRecord(
          address,
          'bnb',
          level,
          hash,
          metadataURI
        ).catch(err => {
          console.error('[ClaimSBT] 保存铸造记录失败:', err);
        });
      }

      // 延迟跳转到成就页面
      setTimeout(() => {
        router.push('/profile');
      }, 2000);
    }
  }, [hash, isConfirmed, address, level, router]);

  // 监听交易状态更新按钮状态
  useEffect(() => {
    if (isPending || isConfirming) {
      setIsMinting(true);
    } else {
      setIsMinting(false);
    }
  }, [isPending, isConfirming]);

  const handleMint = async (chain: 'bnb' | 'solana') => {
    if (!address) {
      toast.error('请先连接钱包');
      return;
    }

    if (!level) {
      toast.error('等级参数错误');
      return;
    }

    if (hasMinted) {
      toast.error('此等级SBT已铸造，每个等级只能铸造一次');
      return;
    }

    if (chain !== 'bnb') {
      toast.error('目前仅支持BNB Chain的SBT铸造，Solana支持即将推出');
      return;
    }

    setIsMinting(true);
    try {
      // 准备metadata URI
      const metadataURI = `https://zhengdao.io/metadata/${level}/${address}`;

      // 显示加载提示
      toast.loading('正在确认钱包交易...', { id: 'mint-toast' });

      // 调用真实的合约mint函数
      await mintSBT(
        address as `0x${string}`,
        level,
        levelInfo?.requiredDays || 0,
        metadataURI
      );

      // 交易已提交，等待确认
      toast.loading('交易已提交，正在确认...', { id: 'mint-toast' });
    } catch (error) {
      console.error('[ClaimSBT] 铸造失败:', error);
      const errorMessage = error instanceof Error ? error.message : '铸造失败，请重试';
      toast.error(errorMessage, { id: 'mint-toast' });
      setIsMinting(false);
    }
    // 注意：不要在这里设置 setIsMinting(false)，等待交易确认后再设置
  };

  if (!levelInfo) {
    return (
      <div className="min-h-screen bg-[#FFFEF2] flex items-center justify-center p-6">
        <div className="w-16 h-16 border-4 border-ink/20 border-t-seal rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFEF2] p-6 py-12">
      <div className="max-w-4xl mx-auto">
        {/* 返回按钮 */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          className="mb-8 flex items-center gap-2 text-ink/60 hover:text-ink transition-colors"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          ← 返回成就页面
        </motion.button>

        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1
            className="text-4xl font-bold text-ink mb-2"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            领取你的成就徽章
          </h1>
          <p className="text-ink/60" style={{ fontFamily: 'Georgia, serif' }}>
            恭喜你达成 Level {level} 成就
          </p>
        </motion.div>

        {/* SBT预览卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border-2 border-ink/20 p-12 mb-8"
          style={{ borderRadius: 0 }}
        >
          <div className="flex flex-col md:flex-row gap-12 items-center">
            {/* SBT图像 */}
            <div className="flex-1 flex justify-center">
              <div
                className="w-80 h-80 rounded-2xl flex items-center justify-center relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${levelInfo.primaryColor} 0%, ${levelInfo.secondaryColor} 100%)`,
                }}
              >
                <Image
                  src={getLevelSBTImage(levelInfo.level)}
                  alt={`Level ${levelInfo.level} SBT - ${levelInfo.title}`}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* SBT信息 */}
            <div className="flex-1">
              <h3
                className="text-3xl font-bold text-ink mb-4"
                style={{ fontFamily: 'Georgia, serif', color: levelInfo.primaryColor }}
              >
                {levelInfo.title}
              </h3>
              <p className="text-ink/60 mb-6" style={{ fontFamily: 'Georgia, serif' }}>
                {levelInfo.description}
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🎯</span>
                  <span className="text-ink">需要打卡 {levelInfo.requiredDays} 天</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🎁</span>
                  <span className="text-ink">奖励加成 +{levelInfo.rewardBonus}%</span>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  {levelInfo.keywords.map(keyword => (
                    <span
                      key={keyword}
                      className="px-3 py-1 text-sm font-bold"
                      style={{
                        backgroundColor: levelInfo.secondaryColor,
                        color: levelInfo.primaryColor,
                      }}
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-ink/5 p-4 mb-6">
                <p className="text-sm text-ink/60" style={{ fontFamily: 'Georgia, serif' }}>
                  此SBT是你成就的永久证明，铸造成区块链上的不可替代代币(NFT)。
                  <br />
                  你可以选择在 BNB Chain 或 Solana 上铸造。
                </p>
              </div>

              {/* 链接钱包提示 */}
              {!address && (
                <div className="bg-yellow-50 border-2 border-yellow-300 p-4 mb-6">
                  <p className="text-sm text-yellow-800" style={{ fontFamily: 'Georgia, serif' }}>
                    ⚠️ 请先连接钱包后再铸造SBT
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Free Mint 横幅 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 p-4 rounded-lg"
        >
          <div className="flex items-center justify-center gap-3">
            <span className="text-3xl">🎁</span>
            <div className="text-center">
              <p className="text-lg font-bold text-green-800" style={{ fontFamily: 'Georgia, serif' }}>
                Free Mint - 完全免费铸造
              </p>
              <p className="text-sm text-green-700" style={{ fontFamily: 'Georgia, serif' }}>
                无需支付费用，只需承担链上Gas费用
              </p>
            </div>
            <span className="text-3xl">✨</span>
          </div>
        </motion.div>

        {/* 已铸造提示 */}
        {hasMinted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 bg-red-50 border-2 border-red-300 p-4 rounded-lg"
          >
            <p className="text-center text-red-800 font-bold" style={{ fontFamily: 'Georgia, serif' }}>
              ⚠️ 此等级SBT已铸造，每个等级只能铸造一次
            </p>
          </motion.div>
        )}

        {/* 铸造按钮 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <button
            onClick={() => handleMint('bnb')}
            disabled={isMinting || !address}
            className="py-6 bg-[#F3BA2F] text-white font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
            style={{ borderRadius: 0, fontFamily: 'Georgia, serif' }}
          >
            {isMinting ? '铸造中...' : '在 BNB Chain 铸造'}
          </button>
          <button
            onClick={() => handleMint('solana')}
            disabled={isMinting || !address}
            className="py-6 bg-[#9945FF] text-white font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
            style={{ borderRadius: 0, fontFamily: 'Georgia, serif' }}
          >
            {isMinting ? '铸造中...' : '在 Solana 铸造'}
          </button>
        </motion.div>

        {/* 提示信息 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center"
        >
          <p className="text-xs text-ink/40" style={{ fontFamily: 'Georgia, serif' }}>
            铸造SBT需要支付相应的链上Gas费用
            <br />
            铸造后的SBT将永久保存在区块链上，无法转让
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default function ClaimSBTPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FFFEF2] flex items-center justify-center p-6">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-ink/20 border-t-seal rounded-full mx-auto mb-4 animate-spin"></div>
            <p className="text-ink/60" style={{ fontFamily: 'Georgia, serif' }}>
              加载中...
            </p>
          </div>
        </div>
      }
    >
      <ClaimSBTPageContent />
    </Suspense>
  );
}
