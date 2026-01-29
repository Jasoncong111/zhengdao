/**
 * 数据生成控制面板
 * 用于配置参数并生成演示数据
 */

'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  DemoDataConfig,
  GenerationProgress,
  DEFAULT_DEMO_CONFIG,
} from '@/types/demo-data';
import {
  DemoDataGenerator,
  getDataQualityMetrics,
} from '@/lib/demo-data-generator';
import { calculateLevelDistribution } from '@/lib/demo-user-profiles';

interface ConfigFieldProps {
  label: string;
  type: 'number' | 'range';
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

function ConfigField({ label, type, value, onChange, min, max, step = 1 }: ConfigFieldProps) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-bold">{label}</label>
      {type === 'range' ? (
        <div className="flex items-center gap-4">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={e => onChange(Number(e.target.value))}
            className="flex-1"
          />
          <span className="text-sm w-12 text-right">{value.toFixed(2)}</span>
        </div>
      ) : (
        <input
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="w-full border-2 border-ink p-2"
        />
      )}
    </div>
  );
}

export default function DataGeneratorPanel() {
  const [config, setConfig] = useState<DemoDataConfig>(DEFAULT_DEMO_CONFIG);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState<GenerationProgress | null>(null);
  const [quality, setQuality] = useState<any>(null);

  // 更新配置
  const updateConfig = (key: keyof DemoDataConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  // 生成数据
  const handleGenerate = async () => {
    if (generating) return;

    setGenerating(true);
    setProgress(null);

    try {
      const generator = new DemoDataGenerator(config);
      generator.setProgressCallback(setProgress);

      await generator.generateAll();

      toast.success(`成功生成 ${config.userCount} 个用户的演示数据！`);

      // 显示数据质量
      const metrics = await getDataQualityMetrics();
      setQuality(metrics);
    } catch (error) {
      toast.error('生成失败: ' + (error as Error).message);
      console.error(error);
    } finally {
      setGenerating(false);
      setProgress(null);
    }
  };

  // 清空数据
  const handleClear = async () => {
    if (!confirm('确定要清空所有演示数据吗？此操作不可恢复！')) {
      return;
    }

    try {
      await DemoDataGenerator.clearAll();
      toast.success('已清空所有演示数据');
      setQuality(null);
    } catch (error) {
      toast.error('清空失败: ' + (error as Error).message);
    }
  };

  // 计算等级分布预览
  const levelDistribution = calculateLevelDistribution(config.userCount);

  return (
    <div className="border-2 border-ink bg-paper p-6 space-y-6">
      <div>
        <h3 className="text-xl font-bold mb-2">演示数据生成器</h3>
        <p className="text-sm text-ink/60">
          生成逼真的虚拟用户和历史数据，用于演示和测试
        </p>
      </div>

      {/* 配置表单 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ConfigField
          label="用户数量"
          type="number"
          value={config.userCount}
          onChange={v => updateConfig('userCount', v)}
          min={100}
          max={500}
        />

        <ConfigField
          label="历史天数"
          type="number"
          value={config.daysPerUser}
          onChange={v => updateConfig('daysPerUser', v)}
          min={30}
          max={90}
        />

        <ConfigField
          label="打卡概率"
          type="range"
          value={config.checkInProbability}
          onChange={v => updateConfig('checkInProbability', v)}
          min={0.6}
          max={0.9}
          step={0.05}
        />

        <ConfigField
          label="有意义概率"
          type="range"
          value={config.meaningfulProbability}
          onChange={v => updateConfig('meaningfulProbability', v)}
          min={0.5}
          max={0.8}
          step={0.05}
        />
      </div>

      {/* 等级分布预览 */}
      <div>
        <h4 className="font-bold mb-2">等级分布预览</h4>
        <div className="flex gap-2 text-xs">
          {levelDistribution.map((count, index) => (
            <div key={index} className="flex-1 text-center p-2 border-2 border-ink/20">
              <div className="text-lg font-bold">L{index + 1}</div>
              <div className="text-ink/60">{count} 人</div>
            </div>
          ))}
        </div>
      </div>

      {/* 进度条 */}
      {progress && (
        <div className="border-2 border-ink p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>{progress.stage === 'users' ? '创建用户...' : progress.stage === 'data' ? '生成数据...' : '保存中...'}</span>
            <span>
              {progress.current} / {progress.total}
            </span>
          </div>
          <div className="w-full bg-ink/10 rounded-full h-4">
            <div
              className="bg-seal h-4 rounded-full transition-all"
              style={{ width: `${(progress.current / progress.total) * 100}%` }}
            />
          </div>
          {progress.user && (
            <div className="text-xs text-ink/60">当前: {progress.user}</div>
          )}
        </div>
      )}

      {/* 数据质量指标 */}
      {quality && (
        <div className="border-2 border-ink/30 p-4 space-y-2">
          <h4 className="font-bold">数据质量指标</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-ink/60">总反思数</div>
              <div className="text-lg font-bold">{quality.totalReflections}</div>
            </div>
            <div>
              <div className="text-ink/60">重复率</div>
              <div className="text-lg font-bold">{quality.duplicateRate.toFixed(1)}%</div>
            </div>
            <div>
              <div className="text-ink/60">质量评分</div>
              <div className="text-lg font-bold">{quality.qualityScore.toFixed(0)}</div>
            </div>
            <div>
              <div className="text-ink/60">关键词种类</div>
              <div className="text-lg font-bold">{quality.keywordVariety}</div>
            </div>
          </div>
        </div>
      )}

      {/* 操作按钮 */}
      <div className="flex flex-wrap gap-4">
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="px-6 py-3 bg-seal text-paper font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-seal/90 transition-colors"
        >
          {generating ? '生成中...' : '生成数据'}
        </button>

        <button
          onClick={handleClear}
          disabled={generating}
          className="px-6 py-3 border-2 border-ink font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-ink/5 transition-colors"
        >
          清空数据
        </button>

        <button
          onClick={async () => {
            try {
              const json = await DemoDataGenerator.exportToJSON();
              const blob = new Blob([json], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'zhengdao-demo-data.json';
              a.click();
              URL.revokeObjectURL(url);
              toast.success('已导出 JSON 文件');
            } catch (error) {
              toast.error('导出失败');
            }
          }}
          disabled={generating}
          className="px-6 py-3 border-2 border-ink font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-ink/5 transition-colors"
        >
          导出JSON
        </button>
      </div>
    </div>
  );
}
