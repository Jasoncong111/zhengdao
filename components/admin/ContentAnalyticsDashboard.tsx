/**
 * 内容数据看板
 * 展示内容相关的统计和图表
 */

'use client';

import { useEffect, useState } from 'react';
import { ContentAnalytics } from '@/types/demo-data';
import { demoAnalyticsService } from '@/lib/demo-analytics-service';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: string;
  trend?: string;
}

function MetricCard({ title, value, icon, trend }: MetricCardProps) {
  return (
    <div className="border-2 border-ink bg-white p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        {trend && (
          <span className={`text-xs font-bold ${trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
            {trend}
          </span>
        )}
      </div>
      <div className="text-3xl font-bold text-seal">{value}</div>
      <div className="text-sm text-ink/60">{title}</div>
    </div>
  );
}

export default function ContentAnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<ContentAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await demoAnalyticsService.getContentAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error('加载内容分析失败:', error);
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
  const emotionData = Object.entries(analytics.emotionDistribution).map(([name, value]) => ({
    name,
    value: Math.round(value),
  }));

  const keywordData = analytics.keywordFrequency.slice(0, 10);
  const trendData = analytics.dailyTrend.slice(-7);

  return (
    <div className="space-y-6">
      {/* 关键指标卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="总打卡数"
          value={analytics.totalCheckIns.toLocaleString()}
          icon="📝"
          trend="+12%"
        />
        <MetricCard
          title="活跃用户"
          value={analytics.uniqueUsers.toLocaleString()}
          icon="👥"
          trend="+8%"
        />
        <MetricCard
          title="有意义率"
          value={`${analytics.meaningfulRate.toFixed(1)}%`}
          icon="✨"
          trend="+2%"
        />
        <MetricCard
          title="平均字数"
          value={analytics.averageWordCount}
          icon="📊"
        />
      </div>

      {/* 情绪分布 */}
      <div className="border-2 border-ink bg-white p-6">
        <h3 className="text-lg font-bold mb-4">情绪分布</h3>
        <div className="space-y-3">
          {emotionData.map(item => (
            <div key={item.name} className="flex items-center gap-4">
              <div className="w-20 text-sm font-bold">{item.name}</div>
              <div className="flex-1 bg-ink/10 rounded-full h-6">
                <div
                  className="bg-seal h-6 rounded-full flex items-center justify-end px-2 text-xs text-white font-bold"
                  style={{ width: `${Math.min(item.value, 100)}%` }}
                >
                  {item.value > 15 && `${item.value}%`}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 高频关键词 */}
      <div className="border-2 border-ink bg-white p-6">
        <h3 className="text-lg font-bold mb-4">高频关键词 TOP 10</h3>
        <div className="flex flex-wrap gap-2">
          {keywordData.map((item, index) => (
            <span
              key={item.word}
              className={`px-3 py-1 text-sm font-bold border-2 border-ink inline-block`}
              style={{
                backgroundColor: index < 3 ? '#D43628' : index < 6 ? '#E85D04' : '#F48C06',
                color: 'white',
              }}
            >
              {item.word} ({item.count})
            </span>
          ))}
        </div>
      </div>

      {/* 打卡趋势 */}
      <div className="border-2 border-ink bg-white p-6">
        <h3 className="text-lg font-bold mb-4">最近7天打卡趋势</h3>
        <div className="space-y-2">
          {trendData.map(item => (
            <div key={item.date} className="flex items-center gap-4">
              <div className="w-24 text-sm text-ink/60">{item.date}</div>
              <div className="flex-1 bg-ink/10 rounded-full h-4">
                <div
                  className="bg-seal h-4 rounded-full"
                  style={{ width: `${Math.min((item.count / Math.max(...trendData.map(d => d.count))) * 100, 100)}%` }}
                />
              </div>
              <div className="w-12 text-sm text-right">{item.count}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
