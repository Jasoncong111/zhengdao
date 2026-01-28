#!/usr/bin/env ts-node

/**
 * 元数据验证脚本
 * 用于验证SBT元数据JSON文件的格式和必填字段
 */

import * as fs from 'fs';
import * as path from 'path';

interface Metadata {
  name: string;
  description: string;
  image: string;
  external_url: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

const METADATA_DIR = path.join(__dirname, '../public/sbt-metadata');

// 必填字段
const REQUIRED_FIELDS = ['name', 'description', 'image', 'external_url', 'attributes'];

// 必需的attributes
const REQUIRED_ATTRIBUTES = [
  'Level',
  'Days',
  'Title',
  'Title EN',
  'Chain',
  'Rarity',
  'Color',
  'Icon',
  'Keywords'
];

// 有效的Rarity值
const VALID_RARITIES = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythical'];

// 有效的Chain值
const VALID_CHAINS = ['BNB Chain', 'Solana'];

// 有效的颜色值
const VALID_COLORS = [
  'Gray/White',
  'Green',
  'Blue',
  'Purple',
  'Red',
  'Gold'
];

function validateMetadata(filePath: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  try {
    // 读取JSON文件
    const content = fs.readFileSync(filePath, 'utf-8');
    const metadata: Metadata = JSON.parse(content);

    // 检查必填字段
    for (const field of REQUIRED_FIELDS) {
      if (!(field in metadata)) {
        errors.push(`Missing required field: ${field}`);
      }
    }

    // 检查attributes是否存在且是数组
    if (!metadata.attributes || !Array.isArray(metadata.attributes)) {
      errors.push('attributes must be an array');
    } else {
      // 检查必需的attribute类型
      const attributeTypes = metadata.attributes.map(attr => attr.trait_type);

      for (const requiredAttr of REQUIRED_ATTRIBUTES) {
        if (!attributeTypes.includes(requiredAttr)) {
          errors.push(`Missing required attribute: ${requiredAttr}`);
        }
      }

      // 验证特定字段的值
      for (const attr of metadata.attributes) {
        switch (attr.trait_type) {
          case 'Rarity':
            if (!VALID_RARITIES.includes(attr.value as string)) {
              errors.push(`Invalid Rarity value: ${attr.value}. Must be one of: ${VALID_RARITIES.join(', ')}`);
            }
            break;
          case 'Chain':
            if (!VALID_CHAINS.includes(attr.value as string)) {
              errors.push(`Invalid Chain value: ${attr.value}. Must be one of: ${VALID_CHAINS.join(', ')}`);
            }
            break;
          case 'Color':
            if (!VALID_COLORS.includes(attr.value as string)) {
              errors.push(`Invalid Color value: ${attr.value}. Must be one of: ${VALID_COLORS.join(', ')}`);
            }
            break;
          case 'Level':
            if (typeof attr.value !== 'number' || attr.value < 1 || attr.value > 6) {
              errors.push(`Invalid Level value: ${attr.value}. Must be a number between 1 and 6`);
            }
            break;
          case 'Days':
            if (typeof attr.value !== 'number' || attr.value < 0) {
              errors.push(`Invalid Days value: ${attr.value}. Must be a positive number`);
            }
            break;
        }
      }
    }

    // 检查image路径是否存在
    const imagePath = path.join(__dirname, '..', 'public', metadata.image.replace(/^\//, ''));
    if (!fs.existsSync(imagePath)) {
      errors.push(`Image file does not exist: ${metadata.image}`);
    }

  } catch (error) {
    errors.push(`Failed to parse JSON: ${error}`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

function main() {
  console.log('🔍 Validating SBT Metadata...\n');

  const files = fs.readdirSync(METADATA_DIR)
    .filter(file => file.endsWith('.json'));

  if (files.length === 0) {
    console.log('❌ No metadata files found in', METADATA_DIR);
    process.exit(1);
  }

  let totalErrors = 0;

  for (const file of files) {
    const filePath = path.join(METADATA_DIR, file);
    const result = validateMetadata(filePath);

    if (result.valid) {
      console.log(`✅ ${file}: Valid`);
    } else {
      console.log(`❌ ${file}: Invalid`);
      result.errors.forEach(error => {
        console.log(`   - ${error}`);
      });
      totalErrors += result.errors.length;
    }
  }

  console.log('\n' + '='.repeat(50));

  if (totalErrors === 0) {
    console.log('✅ All metadata files are valid!');
    console.log(`📊 Total files validated: ${files.length}`);
    process.exit(0);
  } else {
    console.log(`❌ Validation failed with ${totalErrors} error(s)`);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main();
}

export { validateMetadata };
