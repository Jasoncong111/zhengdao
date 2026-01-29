/**
 * 成就数据看板
 * 展示用户成就相关的统计和图表
 */

'use client';

import { useEffect, useState } from 'react';
import { AchievementAnalytics } from '@/types/demo-data';
import { demoAnalyticsService } from '@/lib/demo-analytics-service';
import { ACHIEVEMENT_LEVELS } from '@/lib/demo-user-profiles';

interface LevelCardProps {
  level: number;
  name: string;
  count: number;
  total: number;
}

function LevelCard({ level, name, count, total }: LevelCardProps) {
  const percentage = total > 0 ? (count / total) * 100 : 0;
  const levelInfo = ACHIEVEMENT_LEVELS[level - 1];

  return (
    <div className="text-center p-4 border-2 border-ink bg-white">
      <div className="text-2xl mb-1" style={{ color: levelInfo.color }}>
        L{level}
      </div>
      <div className="text-xs text-ink/60 mb-2">{name}</div>
      <div className="text-lg font-bold">{count}</div>
      <div className="text-xs text-ink/40">{percentage.toFixed(1)}%</div>
    </div>
  );
}

export default function AchievementAnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AchievementAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await demoAnalyticsService.getAchievementAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error('加载成就分析失败:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="border-2 border-ink bg-white p-6 text-center">
        <div className="text-ink/60">加载中...</div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="border-2 border-ink bg-white p-6 text-center">
        <div className="text-ink/60">暂无数据</div>
      </div>
    );
  }

  // 准备图表数据
  const levelData = Object.entries(analytics.levelDistribution).map(([level, count]) => ({
    level: parseInt(level),
    count,
    name: ACHIEVEMENT_LEVELS[parseInt(level) - 1]?.name || '',
  }));

  return (
    <div className="space-y-6">
      {/* 关键指标 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="border-2 border-ink bg-white p-4">
          <div className="text-3xl mb-2">👥</div>
          <div className="text-2xl font-bold text-seal">
            {analytics.totalUsers.toLocaleString()}
          </div>
          <div className="text-sm text-ink/60">总用户数</div>
        </div>
        <div className="border-2 border-ink bg-white p-4">
          <div className="text-3xl mb-2">⭐</div>
          <div className="text-2xl font-bold text-seal">
            {analytics.averageLevel.toFixed(1)}
          </div>
          <div className="text-sm text-ink/60">平均等级</div>
        </div>
        <div className="border-2 border-ink bg-white p-4">
          <div className="text-3xl mb-2">📅</div>
          <div className="text-2xl font-bold text-seal">
            {analytics.averageCheckInDays}
          </div>
          <div className="text-sm text-ink/60">平均打卡天数</div>
        </div>
        <div className="border-2 border-ink bg-white p-4">
          <div className="text-3xl mb-2">🎖️</div>
          <div className="text-2xl font-bold text-seal">
            {analytics.sbtClaimRate.toFixed(1)}%
          </div>
          <div className="text-sm text-ink/60">SBT领取率</div>
        </div>
      </div>

      {/* 用户等级分布 */}
      <div className="border-2 border-ink bg-white p-6">
        <h3 className="text-lg font-bold mb-4">用户等级分布</h3>
        <div className="grid grid-cols-6 gap-4">
          {levelData.map(item => (
            <LevelCard
              key={item.level}
              level={item.level}
              name={item.name}
              count={item.count}
              total={analytics.totalUsers}
            />
          ))}
        </div>
      </div>

      {/* Top 10 用户 */}
      {analytics.topUsers.length > 0 && (
        <div className="border-2 border-ink bg-white p-6">
          <h3 className="text-lg font-bold mb-4">Top 10 活跃用户</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-ink">
                  <th className="text-left p-2">用户</th>
                  <th className="text-center p-2">等级</th>
                  <th className="text-center p-2">打卡天数</th>
                  <th className="text-center p-2">有意义率</th>
                  <th className="text-center p-2">常用情绪</th>
                </tr>
              </thead>
              <tbody>
                {analytics.topUsers.map((user, index) => (
                  <tr key={user.id} className="border-b border-ink/20">
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-seal">#{index + 1}</span>
                        <span>{user.name}</span>
                      </div>
                    </td>
                    <td className="text-center p-2">
                      <span className="px-2 py-1 bg-seal text-white text-xs rounded">
                        L{user.currentLevel}
                      </span>
                    </td>
                    <td className="text-center p-2">{user.checkInDays}</td>
                    <td className="text-center p-2">{user.meaningfulRate.toFixed(1)}%</td>
                    <td className="text-center p-2">{user.favoriteEmotion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
