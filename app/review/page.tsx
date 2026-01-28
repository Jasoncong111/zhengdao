/**
 * app/review/page.tsx - 复盘主页面
 *
 * 默认重定向到7日复盘
 */

import { redirect } from 'next/navigation';

export default function ReviewPage() {
  // 默认重定向到7日复盘
  redirect('/review/7d');
}
