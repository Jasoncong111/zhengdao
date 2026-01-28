/**
 * chart-utils.ts - 图表工具函数
 *
 * 提供数据处理、格式化等辅助函数
 */

export interface CheckInData {
  id: string;
  date: string;
  meaningful: boolean;
  originalText: string;
  wordCount: number;
  createdAt: number;
}

export interface GoalData {
  category: string;
  target: string;
  progress: number;
}

/**
 * 根据周期筛选打卡数据
 */
export function filterDataByPeriod(data: CheckInData[], period: '7d' | '30d' | '6m' | '1y' | 'all'): CheckInData[] {
  if (period === 'all') return data;

  const now = new Date();
  const periodMap = {
    '7d': 7,
    '30d': 30,
    '6m': 180,
    '1y': 365,
  };

  const days = periodMap[period];
  const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  return data.filter(item => new Date(item.date) >= cutoffDate);
}

/**
 * 计算是/否统计
 * 同一天的多条记录只统计一次（取最后一条）
 */
export function calculateYesNoRatio(data: CheckInData[]): { yes: number; no: number } {
  // 按日期去重，保留最后一条记录
  const dateMap = new Map<string, CheckInData>();
  data.forEach(item => {
    dateMap.set(item.date, item);
  });

  // 统计去重后的数据
  const uniqueData = Array.from(dateMap.values());

  return uniqueData.reduce(
    (acc, item) => {
      if (item.meaningful) {
        acc.yes++;
      } else {
        acc.no++;
      }
      return acc;
    },
    { yes: 0, no: 0 }
  );
}

/**
 * 生成打卡趋势数据
 */
export function generateTrendData(data: CheckInData[]): Array<{ date: string; wordCount: number }> {
  // 按日期分组并计算每天的总字数
  const grouped = data.reduce((acc, item) => {
    if (!acc[item.date]) {
      acc[item.date] = 0;
    }
    acc[item.date] += item.wordCount;
    return acc;
  }, {} as Record<string, number>);

  // 转换为数组并按日期排序
  return Object.entries(grouped)
    .map(([date, wordCount]) => ({ date, wordCount }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * 按周/月聚合有意义天数比例
 */
export function aggregateMeaningfulDays(
  data: CheckInData[],
  groupBy: 'week' | 'month'
): Array<{ period: string; ratio: number }> {
  // 按周/月分组
  const grouped = data.reduce((acc, item) => {
    const date = new Date(item.date);
    let key: string;

    if (groupBy === 'week') {
      // 计算年份和周数
      const startOfYear = new Date(date.getFullYear(), 0, 1);
      const days = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
      const week = Math.ceil((days + startOfYear.getDay() + 1) / 7);
      key = `${date.getFullYear()}-W${week.toString().padStart(2, '0')}`;
    } else {
      // 按月分组
      key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    }

    if (!acc[key]) {
      acc[key] = { total: 0, meaningful: 0 };
    }
    acc[key].total++;
    if (item.meaningful) {
      acc[key].meaningful++;
    }

    return acc;
  }, {} as Record<string, { total: number; meaningful: number }>);

  // 计算比例并转换为数组
  return Object.entries(grouped)
    .map(([period, stats]) => ({
      period,
      ratio: stats.total > 0 ? (stats.meaningful / stats.total) * 100 : 0,
    }))
    .sort((a, b) => a.period.localeCompare(b.period));
}

/**
 * 格式化日期显示
 */
export function formatDate(date: string, format: 'short' | 'long' = 'short'): string {
  const d = new Date(date);

  if (format === 'short') {
    return `${d.getMonth() + 1}/${d.getDate()}`;
  }

  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
}

/**
 * 计算目标进度（基于打卡数据）
 */
export function calculateGoalProgress(
  goal: GoalData,
  checkInData: CheckInData[]
): number {
  // 简单实现：基于打卡频率计算进度
  // 实际应用中需要根据具体目标类型实现不同的计算逻辑

  const categoryKeywords: Record<string, string[]> = {
    财富: ['收入', '存款', '投资', '理财'],
    健康: ['运动', '睡眠', '体重', '健身'],
    家庭: ['陪伴', '家庭', '亲子', '伴侣'],
    其他: ['学习', '读书', '课程', '技能'],
  };

  // 这里只是一个示例，实际应该根据业务逻辑实现
  return goal.progress;
}

/**
 * 生成图表颜色配置
 */
export const chartColors = {
  primary: '#D43628', // 朱砂红
  secondary: '#1a1a2e', // 墨黑
  background: '#FFFEF2', // 纸白
  auxiliary: '#6B7280', // 青灰
  grid: '#00000020', // 网格线
};

/**
 * 图表通用样式配置
 */
export const chartStyles = {
  fontFamily: 'Georgia, serif',
  fontSize: 12,
  axisColor: '#000000',
  gridColor: '#00000020',
};

/**
 * 数据验证：检查打卡数据是否有效
 */
export function validateCheckInData(data: any): data is CheckInData {
  return (
    typeof data === 'object' &&
    typeof data.date === 'string' &&
    typeof data.meaningful === 'boolean' &&
    typeof data.wordCount === 'number'
  );
}

/**
 * 空数据占位符
 */
export function getEmptyStateMessage(chartType: string): string {
  const messages: Record<string, string> = {
    yesNo: '暂无打卡数据，完成首次打卡后查看统计',
    trend: '暂无趋势数据，连续打卡后查看变化趋势',
    goal: '暂无目标数据，请先完成人生规划问卷',
    meaningful: '暂无趋势数据，积累更多打卡记录后查看',
  };

  return messages[chartType] || '暂无数据';
}
