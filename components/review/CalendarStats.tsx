'use client';

/**
 * CalendarStats - 日历统计组件
 *
 * 使用日历视图展示打卡数据
 * 颜色区分"有意义"、"无意义"和"未打卡"的日期
 */

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './CalendarStats.css';

interface CalendarStatsProps {
  /** 周期类型 */
  period: '7d' | '30d' | '6m' | '1y';
  /** 打卡数据 */
  checkInData: Array<{ date: string; isMeaningful: boolean }>;
}

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export function CalendarStats({ period, checkInData }: CalendarStatsProps) {
  // 构建日期到打卡状态的映射
  const checkInMap = useMemo(() => {
    const map = new Map<string, boolean>();
    checkInData.forEach((item) => {
      // 确保日期格式为 YYYY-MM-DD
      const dateStr = item.date.split('T')[0];
      map.set(dateStr, item.isMeaningful);
    });
    return map;
  }, [checkInData]);

  // 计算日历的初始月份
  const defaultActiveStartDate = useMemo(() => {
    const now = new Date();

    // 对于7日和30日复盘，显示当前月
    if (period === '7d' || period === '30d') {
      return now;
    }

    // 对于半年复盘，显示6个月前的月份
    if (period === '6m') {
      const sixMonthsAgo = new Date(now);
      sixMonthsAgo.setMonth(now.getMonth() - 6);
      return sixMonthsAgo;
    }

    // 对于年度复盘，显示今年年初
    if (period === '1y') {
      return new Date(now.getFullYear(), 0, 1);
    }

    return now;
  }, [period]);

  // 获取日期的CSS类名
  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') {
      return null;
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    const isMeaningful = checkInMap.get(dateStr);

    if (isMeaningful === true) {
      return 'meaningful-day';
    }
    if (isMeaningful === false) {
      return 'not-meaningful-day';
    }
    return null;
  };

  // 获取周期标签
  const periodLabel: Record<string, string> = {
    '7d': '7日复盘',
    '30d': '30日复盘',
    '6m': '半年复盘',
    '1y': '年度复盘',
  };

  return (
    <motion.div
      className="w-full bg-white border-2 border-black p-6"
      style={{ borderRadius: 0, backgroundColor: '#FFFEF2' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* 标题 */}
      <motion.h3
        className="text-xl font-bold text-black mb-2"
        style={{ fontFamily: 'Georgia, serif' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        打卡日历
      </motion.h3>

      <motion.p
        className="text-sm text-black/60 mb-6"
        style={{ fontFamily: 'Georgia, serif' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {periodLabel[period]}的打卡记录
      </motion.p>

      {/* 日历容器 */}
      <div className="calendar-container mb-6">
        <Calendar
          activeStartDate={defaultActiveStartDate}
          tileClassName={tileClassName}
          className="custom-calendar"
          formatDay={(locale, date) => date.getDate().toString()}
        />
      </div>

      {/* 图例 */}
      <motion.div
        className="flex items-center justify-center gap-6 text-sm"
        style={{ fontFamily: 'Georgia, serif' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 meaningful-day"></div>
          <span className="text-black/70">有意义</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 not-meaningful-day"></div>
          <span className="text-black/70">无意义</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border border-black/20"></div>
          <span className="text-black/70">未打卡</span>
        </div>
      </motion.div>

      <style jsx>{`
        .calendar-container :global(.custom-calendar) {
          width: 100%;
          background: transparent;
          border: none;
          font-family: 'Georgia', serif;
        }

        .calendar-container :global(.custom-calendar .react-calendar__navigation) {
          display: flex;
          height: 44px;
          margin-bottom: 1em;
        }

        .calendar-container :global(.custom-calendar .react-calendar__navigation button) {
          min-width: 44px;
          background: none;
          font-size: 16px;
          color: #1a1a2e;
          font-weight: bold;
          font-family: 'Georgia', serif;
        }

        .calendar-container :global(.custom-calendar .react-calendar__navigation button:enabled:hover,
          .custom-calendar .react-calendar__navigation button:enabled:focus) {
          background-color: rgba(212, 54, 40, 0.1);
        }

        .calendar-container :global(.custom-calendar .react-calendar__month-view__weekdays) {
          text-align: center;
          text-transform: uppercase;
          font-weight: bold;
          font-size: 0.75em;
          color: #1a1a2e;
          font-family: 'Georgia', serif;
        }

        .calendar-container :global(.custom-calendar .react-calendar__month-view__days__day) {
          position: relative;
          min-height: 40px;
          max-height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: 1px solid rgba(0, 0, 0, 0.1);
          font-size: 14px;
          font-family: 'Georgia', serif;
        }

        .calendar-container :global(.custom-calendar .react-calendar__month-view__days__day:enabled:hover,
          .custom-calendar .react-calendar__month-view__days__day:enabled:focus) {
          background-color: rgba(212, 54, 40, 0.2);
          font-weight: bold;
        }

        .calendar-container :global(.custom-calendar .react-calendar__tile:enabled:focus) {
          outline: none;
        }

        /* 有意义的日子 - 红色 */
        .calendar-container :global(.meaningful-day) {
          background-color: #D43628 !important;
          color: white !important;
          font-weight: bold !important;
        }

        /* 无意义的日子 - 灰色 */
        .calendar-container :global(.not-meaningful-day) {
          background-color: #E5E7EB !important;
          color: #1a1a2e !important;
        }

        /* 响应式调整 */
        @media (max-width: 640px) {
          .calendar-container :global(.custom-calendar .react-calendar__month-view__days__day) {
            min-height: 32px;
            max-height: 32px;
            font-size: 12px;
          }
        }
      `}</style>
    </motion.div>
  );
}
