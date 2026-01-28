/**
 * 测试辅助函数
 * 用于集成测试中的通用工具
 */

import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';

/**
 * 自定义渲染函数，可以添加全局Provider
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  // 这里可以添加需要的Provider，比如WagmiProvider, QueryClientProvider等
  return render(ui, options);
}

/**
 * 等待指定时间
 */
export const wait = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * 等待条件成立
 */
export async function waitForCondition(
  condition: () => boolean,
  timeout = 5000,
  interval = 100
): Promise<void> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    if (condition()) {
      return;
    }
    await wait(interval);
  }

  throw new Error(`Condition not met within ${timeout}ms`);
}

/**
 * 创建mock钱包地址
 */
export function createMockAddress(prefix = '0x'): string {
  const chars = '0123456789abcdef';
  let address = prefix;
  for (let i = 0; i < 40; i++) {
    address += chars[Math.floor(Math.random() * chars.length)];
  }
  return address;
}

/**
 * 创建mock交易哈希
 */
export function createMockTxHash(): string {
  const chars = '0123456789abcdef';
  let hash = '0x';
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

/**
 * 清除IndexedDB
 */
export async function clearIndexedDB(): Promise<void> {
  const databases = await indexedDB.databases();
  await Promise.all(
    databases.map((db) => {
      if (db.name) {
        return new Promise<void>((resolve, reject) => {
          const req = indexedDB.deleteDatabase(db.name);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
      }
      return Promise.resolve();
    })
  );
}

/**
 * Mock localStorage
 */
export const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

/**
 * Mock console方法（减少测试输出噪音）
 */
export function mockConsole() {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
}

/**
 * 恢复console方法
 */
export function restoreConsole() {
  console.log.mockRestore();
  console.warn.mockRestore();
  console.error.mockRestore();
}

/**
 * 模拟用户交互延迟
 */
export async function simulateUserDelay(minMs = 100, maxMs = 300) {
  const delay = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  await wait(delay);
}

/**
 * 创建可读取的stream
 */
export function createReadableStream(data: any): ReadableStream {
  return new ReadableStream({
    start(controller) {
      controller.enqueue(data);
      controller.close();
    },
  });
}

/**
 * 比较两个对象是否深度相等（用于快照测试）
 */
export function deepEqual(obj1: any, obj2: any): boolean {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}

/**
 * 格式化日期为测试友好的字符串
 */
export function formatDateForTest(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * 创建失败Promise
 */
export function createRejectionPromise(error: Error): Promise<never> {
  return Promise.reject(error);
}
