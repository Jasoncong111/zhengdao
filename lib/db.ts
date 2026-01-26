/**
 * IndexedDB 数据库初始化和 Schema 定义
 * 使用 Dexie.js 作为封装库
 */

import Dexie, { Table } from 'dexie';

/**
 * 反思数据结构化提取结果
 */
export interface StructuredReflectionData {
  /** 收获 - 学到了什么、做到了什么 */
  gains: string[];
  /** 损失 - 浪费了什么、犯了什么错 */
  losses: string[];
  /** 想法 - 闪现的灵感、新的想法 */
  ideas: string[];
  /** 情绪标签 - 积极/平静/焦虑/疲惫 */
  emotion: string;
  /** 关键词 - 3-5个最重要的关键词 */
  keywords: string[];
}

/**
 * 每日反思数据表结构
 */
export interface Reflection {
  /** 自增主键 */
  id?: number;
  /** 日期 YYYY-MM-DD */
  date: string;
  /** 今天有意义吗? Yes/No */
  isMeaningful: boolean;
  /** 用户原始输入内容 */
  rawContent: string;
  /** AI提取的结构化数据 */
  structuredData: StructuredReflectionData;
  /** 用户钱包地址 */
  walletAddress: string;
  /** 创建时间 */
  createdAt: Date;
  /** 最后更新时间 */
  updatedAt: Date;
}

/**
 * 月度统计数据
 */
export interface MonthlyStats {
  /** 本月总天数 */
  totalDays: number;
  /** 复盘天数 */
  reflectionCount: number;
  /** 有意义天数 */
  meaningfulCount: number;
  /** 有意义率 (0-100) */
  meaningfulRate: number;
  /** 情绪分布 */
  emotions: Record<string, number>;
  /** 关键词频率 */
  keywords: Record<string, number>;
  /** 所有收获 */
  allGains: string[];
  /** 所有损失 */
  allLosses: string[];
  /** 所有想法 */
  allIdeas: string[];
}

/**
 * 证道数据库
 */
export class ZhengDaoDatabase extends Dexie {
  /** 反思数据表 */
  reflections!: Table<Reflection, number>;

  constructor() {
    super('ZhengDaoDB');

    // 定义数据库版本和表结构
    this.version(1).stores({
      reflections: '++id, date, walletAddress, createdAt', // 索引字段
    });
  }
}

/**
 * 创建数据库实例（单例）
 */
export const db = new ZhengDaoDatabase();

/**
 * 数据库错误处理
 */
export function handleDBError(error: unknown, context: string): never {
  console.error(`[DB Error] ${context}:`, error);

  if (error instanceof Dexie.SchemaError) {
    throw new Error('数据库Schema错误，请清除浏览器数据后重试');
  } else if (error instanceof Dexie.ConstraintError) {
    throw new Error('数据约束错误，可能是重复添加数据');
  } else {
    throw new Error(`数据库操作失败: ${error instanceof Error ? error.message : String(error)}`);
  }
}
