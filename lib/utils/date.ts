/**
 * 时区工具函数
 * 使用 UTC+8 时区（中国标准时间）
 */

/**
 * 获取 UTC+8 时区的当前日期字符串 (YYYY-MM-DD)
 * @returns UTC+8 时区的日期字符串
 */
export function getTodayDateUTC8(): string {
  const now = new Date();
  // 转换为 UTC+8
  const utc8Offset = 8; // UTC+8
  const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
  const utc8Time = new Date(utcTime + (utc8Offset * 3600000));

  const year = utc8Time.getFullYear();
  const month = String(utc8Time.getMonth() + 1).padStart(2, '0');
  const day = String(utc8Time.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/**
 * 检查两个日期字符串是否在同一天（UTC+8）
 * @param date1 日期1 (YYYY-MM-DD)
 * @param date2 日期2 (YYYY-MM-DD)
 * @returns 是否在同一天
 */
export function isSameDayUTC8(date1: string, date2: string): boolean {
  return date1 === date2;
}

/**
 * 检查给定的日期是否是今天（UTC+8）
 * @param dateStr 日期字符串 (YYYY-MM-DD)
 * @returns 是否是今天
 */
export function isTodayUTC8(dateStr: string): boolean {
  return dateStr === getTodayDateUTC8();
}

/**
 * 获取 UTC+8 时区的日期对象
 * @param dateStr 日期字符串 (YYYY-MM-DD)
 * @returns UTC+8 时区的日期对象
 */
export function getDateUTC8(dateStr?: string): Date {
  if (dateStr) {
    // 解析日期字符串，将其视为 UTC+8 的日期
    const [year, month, day] = dateStr.split('-').map(Number);
    const utc8Offset = 8;
    const date = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
    // 调整到 UTC+8
    return new Date(date.getTime() - (utc8Offset * 3600000));
  }

  // 获取当前 UTC+8 时间
  const now = new Date();
  const utc8Offset = 8;
  const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
  return new Date(utcTime + (utc8Offset * 3600000));
}
