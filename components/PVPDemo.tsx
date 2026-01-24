'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  balance: number;
  isActive: boolean;
  lastCheckIn: number;
}

/**
 * PVPDemo - PVP 机制演示组件
 * 
 * 展示投入/瓜分的效果
 */
export default function PVPDemo() {
  const [day, setDay] = useState(0);
  const [users, setUsers] = useState<User[]>([
    { id: 'A', name: '用户 A', balance: 1000, isActive: true, lastCheckIn: 0 },
    { id: 'B', name: '用户 B', balance: 1000, isActive: true, lastCheckIn: 0 },
    { id: 'C', name: '用户 C', balance: 1000, isActive: true, lastCheckIn: 0 },
  ]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPenalty, setShowPenalty] = useState(false);

  // 模拟一天的打卡
  const simulateDay = () => {
    setDay((prev) => prev + 1);
    
    setUsers((prevUsers) => {
      return prevUsers.map((user) => {
        // 用户 C 在第 3 天开始不打卡
        if (user.id === 'C' && day >= 2) {
          return {
            ...user,
            isActive: false,
          };
        }

        // 活跃用户获得 0.5% 收益
        if (user.isActive || day < 2) {
          return {
            ...user,
            balance: user.balance * 1.005,
            lastCheckIn: day + 1,
          };
        }

        return user;
      });
    });

    // 第 3 天触发惩罚
    if (day === 2) {
      setTimeout(() => {
        setShowPenalty(true);
        executePenalty();
      }, 1000);
    }
  };

  // 执行惩罚
  const executePenalty = () => {
    setUsers((prevUsers) => {
      const inactiveUser = prevUsers.find((u) => !u.isActive);
      if (!inactiveUser) return prevUsers;

      // 扣除 10% 本金
      const penalty = 1000 * 0.1; // 100 ETH
      const activeUsers = prevUsers.filter((u) => u.isActive);
      const rewardPerUser = penalty / activeUsers.length; // 50 ETH each

      return prevUsers.map((user) => {
        if (!user.isActive) {
          // 不活跃用户被扣除
          return {
            ...user,
            balance: user.balance - penalty,
          };
        } else {
          // 活跃用户获得奖励
          return {
            ...user,
            balance: user.balance + rewardPerUser,
          };
        }
      });
    });

    setTimeout(() => setShowPenalty(false), 3000);
  };

  // 自动播放
  useEffect(() => {
    if (isPlaying && day < 5) {
      const timer = setTimeout(() => {
        simulateDay();
      }, 2000);
      return () => clearTimeout(timer);
    } else if (day >= 5) {
      setIsPlaying(false);
    }
  }, [isPlaying, day]);

  // 重置
  const handleReset = () => {
    setDay(0);
    setUsers([
      { id: 'A', name: '用户 A', balance: 1000, isActive: true, lastCheckIn: 0 },
      { id: 'B', name: '用户 B', balance: 1000, isActive: true, lastCheckIn: 0 },
      { id: 'C', name: '用户 C', balance: 1000, isActive: true, lastCheckIn: 0 },
    ]);
    setIsPlaying(false);
    setShowPenalty(false);
  };

  return (
    <motion.div
      className="w-full bg-white border-2 border-black p-6"
      style={{ borderRadius: 0 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* 标题 */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-black" style={{ fontFamily: 'Georgia, serif' }}>
            PVP 机制演示
          </h3>
          <p className="text-sm text-black/60 mt-1" style={{ fontFamily: 'Georgia, serif' }}>
            第 {day} 天
          </p>
        </div>

        {/* 控制按钮 */}
        <div className="flex gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={day >= 5}
            className="px-4 py-2 bg-black text-white font-bold disabled:opacity-50"
            style={{ borderRadius: 0, fontFamily: 'Georgia, serif' }}
          >
            {isPlaying ? '暂停' : day >= 5 ? '已完成' : '播放'}
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 border-2 border-black text-black font-bold"
            style={{ borderRadius: 0, fontFamily: 'Georgia, serif' }}
          >
            重置
          </button>
        </div>
      </div>

      {/* 用户列表 */}
      <div className="space-y-4 mb-6">
        {users.map((user, index) => (
          <motion.div
            key={user.id}
            className="border-2 border-black p-4"
            style={{ borderRadius: 0 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex justify-between items-center">
              {/* 用户信息 */}
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 flex items-center justify-center text-2xl font-bold"
                  style={{
                    backgroundColor: user.isActive ? '#D43628' : '#999',
                    color: 'white',
                    borderRadius: 0,
                    fontFamily: 'Georgia, serif',
                  }}
                >
                  {user.id}
                </div>
                <div>
                  <div className="font-bold text-black" style={{ fontFamily: 'Georgia, serif' }}>
                    {user.name}
                  </div>
                  <div className="text-sm text-black/60" style={{ fontFamily: 'Georgia, serif' }}>
                    {user.isActive ? '✓ 活跃' : '✗ 不活跃'}
                  </div>
                </div>
              </div>

              {/* 余额 */}
              <motion.div
                className="text-right"
                key={user.balance}
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-2xl font-bold text-black" style={{ fontFamily: 'Georgia, serif' }}>
                  {user.balance.toFixed(2)}
                </div>
                <div className="text-sm text-black/60" style={{ fontFamily: 'Georgia, serif' }}>
                  ETH
                </div>
              </motion.div>
            </div>

            {/* 最后打卡时间 */}
            <div className="mt-2 text-xs text-black/50" style={{ fontFamily: 'Georgia, serif' }}>
              最后打卡：第 {user.lastCheckIn} 天
            </div>
          </motion.div>
        ))}
      </div>

      {/* 惩罚提示 */}
      <AnimatePresence>
        {showPenalty && (
          <motion.div
            className="p-4 bg-[#D43628] text-white mb-4"
            style={{ borderRadius: 0 }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="font-bold mb-2" style={{ fontFamily: 'Georgia, serif' }}>
              ⚠️ PVP 惩罚触发！
            </div>
            <div className="text-sm" style={{ fontFamily: 'Georgia, serif' }}>
              用户 C 超过 48 小时未打卡，扣除 100 ETH（10%）
              <br />
              用户 A 和 B 各获得 50 ETH 奖励
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 说明 */}
      <div className="p-4 bg-black/5" style={{ borderRadius: 0 }}>
        <p className="text-xs text-black/70" style={{ fontFamily: 'Georgia, serif' }}>
          💡 规则：每天打卡获得 0.5% 收益。超过 48 小时未打卡将被扣除 10% 本金，奖励给活跃用户。
        </p>
      </div>
    </motion.div>
  );
}
