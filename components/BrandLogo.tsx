'use client';

/**
 * BrandLogo - 品牌Logo展示组件（方案A：极简居中型）
 *
 * 移动端优先的极简居中设计
 * 支持圆形Logo裁剪显示
 */

import { motion } from 'framer-motion';
import Image from 'next/image';

type LogoStyle = 'circle' | 'circle-bordered' | 'rounded-square';

export function BrandLogo({
  slogan = '第一个Web3的成长变现应用',
  logoStyle = 'circle'
}: {
  slogan?: string;
  logoStyle?: LogoStyle;
}) {
  return (
    <motion.div
      className="brand-logo-container"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      {/* Logo 图片 - 圆形裁剪 */}
      <div className="logo-wrapper">
        <motion.div
          className={`logo-image logo-style-${logoStyle}`}
          animate={{
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <Image
            src="/zhengdao-logo.png"
            alt="证道 ZhengDao"
            width={180}
            height={180}
            priority
            className="logo-img"
          />
        </motion.div>
      </div>

      {/* 项目名称 */}
      <motion.h1
        className="brand-title"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        证道
      </motion.h1>

      {/* 新的Slogan */}
      {slogan && (
        <motion.p
          className="brand-slogan"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          {slogan}
        </motion.p>
      )}

      {/* 装饰线 */}
      <motion.div
        className="brand-divider"
        initial={{ width: 0 }}
        animate={{ width: '60px' }}
        transition={{ delay: 0.7, duration: 0.6 }}
      />

      <style jsx>{`
        .brand-logo-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem 1.5rem;
          text-align: center;
        }

        .logo-wrapper {
          margin-bottom: 1rem;
        }

        .logo-image {
          position: relative;
          width: 180px;
          height: 180px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        /* 方案1: 完全圆形（推荐） */
        .logo-style-circle {
          border-radius: 50%;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        }

        /* 方案2: 带边框的圆形 */
        .logo-style-circle-bordered {
          border-radius: 50%;
          border: 3px solid #D43628;
          box-shadow: 0 4px 16px rgba(212, 54, 40, 0.3);
        }

        /* 方案3: 圆角方块 */
        .logo-style-rounded-square {
          border-radius: 20px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        }

        .logo-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .brand-title {
          font-family: 'Georgia', serif;
          font-size: 5rem;
          font-weight: bold;
          color: #000000;
          margin: 0 0 0.75rem 0;
          letter-spacing: 0.1em;
        }

        .brand-slogan {
          font-family: 'Georgia', serif;
          font-size: 1rem;
          color: #4A4A4A;
          margin: 0 0 1rem 0;
          letter-spacing: 0.05em;
          font-weight: 400;
        }

        .brand-divider {
          height: 3px;
          background: linear-gradient(90deg, transparent, #D43628, transparent);
          margin: 0.5rem auto 0;
        }

        /* 移动端优化 */
        @media (max-width: 768px) {
          .brand-logo-container {
            padding: 1.5rem 1rem 1rem;
          }

          .logo-image {
            width: 140px;
            height: 140px;
          }

          .brand-title {
            font-size: 3.5rem;
          }

          .brand-slogan {
            font-size: 0.95rem;
          }
        }

        /* 小屏手机优化 */
        @media (max-width: 375px) {
          .logo-image {
            width: 120px;
            height: 120px;
          }

          .brand-title {
            font-size: 2.8rem;
          }

          .brand-slogan {
            font-size: 0.875rem;
          }
        }
      `}</style>
    </motion.div>
  );
}

export default BrandLogo;
