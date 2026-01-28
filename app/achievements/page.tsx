'use client';

/**
 * 成就页面 - 重定向到个人主页
 *
 * 成就展示已集成到个人主页中，此页面仅用于重定向
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AchievementsPage() {
  const router = useRouter();

  useEffect(() => {
    // 重定向到个人主页
    router.replace('/profile');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#FFFEF2] flex items-center justify-center p-6">
      <div className="text-center">
        <div
          className="w-16 h-16 border-4 border-black/20 border-t-[#D43628] rounded-full mx-auto mb-4 animate-spin"
        ></div>
        <p className="text-black/60" style={{ fontFamily: 'Georgia, serif' }}>
          正在跳转到个人主页...
        </p>
      </div>
    </div>
  );
}
