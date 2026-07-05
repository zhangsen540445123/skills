#!/usr/bin/env node

/**
 * 小程序内容上传 Skill 实现
 * 将 HTML 内容上传到小程序后台，并返回小程序跳转链接
 */

const fs = require('fs');
const path = require('path');

// ============================================
// 配置读取
// ============================================

const config = {
  apiBaseUrl: process.env.MINIAPP_API_BASE_URL || 'https://940819.xyz/api',
  apiKey: process.env.MINIAPP_API_KEY || '',
  miniappAppId: process.env.MINIAPP_APPID || ''
};

// ============================================
// 工具函数
// ============================================

/**
 * 发起 HTTP 请求
 */
async function httpRequest(url, options = {}) {
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`请求失败: ${error.message}`);
  }
}

/**
 * 上传 HTML 内容
 */
async function uploadHtmlContent(htmlContent, title = null) {
  if (!config.apiKey) {
    throw new Error('未配置 MINIAPP_API_KEY，请在环境变量中设置');
  }

  const url = `${config.apiBaseUrl}/open-api/html-content`;

  const response = await httpRequest(url, {
    method: 'POST',
    headers: {
      'X-Api-Key': config.apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title,
      htmlContent
    })
  });

  if (response.code !== 200) {
    throw new Error(response.message || '上传失败');
  }

  return response.data;
}

/**
 * 读取文件内容
 */
function readHtmlFile(filePath) {
  try {
    const absolutePath = path.resolve(filePath);
    if (!fs.existsSync(absolutePath)) {
      throw new Error(`文件不存在: ${filePath}`);
    }

    const content = fs.readFileSync(absolutePath, 'utf-8');
    const fileSize = (Buffer.byteLength(content) / 1024).toFixed(2);

    return {
      content,
      fileSize,
      fileName: path.basename(filePath)
    };
  } catch (error) {
    throw new Error(`读取文件失败: ${error.message}`);
  }
}

/**
 * 格式化输出结果
 */
function formatResult(uploadResult) {
  const lines = [
    '✅ 上传成功！',
    '',
    '📱 小程序路径：',
    uploadResult.miniappPath,
    '',
    '🔗 Web 查看链接：',
    uploadResult.viewUrl,
    ''
  ];

  if (uploadResult.miniappScheme) {
    lines.push('📲 微信跳转链接：');
    lines.push(uploadResult.miniappScheme);
    lines.push('');
    lines.push('💡 提示：复制上面的链接在微信中打开，即可跳转到小程序查看');
  } else {
    lines.push('⚠️  未配置小程序 AppID，无法生成微信跳转链接');
    lines.push('💡 请在环境变量中设置 MINIAPP_APPID');
  }

  return lines.join('\n');
}

/**
 * 提取 HTML 内容
 */
function extractHtmlFromInput(input) {
  // 尝试匹配 HTML 标签
  const htmlMatch = input.match(/<html[\s\S]*<\/html>/i);
  if (htmlMatch) {
    return htmlMatch[0];
  }

  // 尝试匹配部分 HTML
  const bodyMatch = input.match(/<body[\s\S]*<\/body>/i);
  if (bodyMatch) {
    return `<html><head><meta charset="utf-8"></head>${bodyMatch[0]}</html>`;
  }

  // 如果包含 HTML 标签，认为是 HTML 片段
  if (/<[^>]+>/.test(input)) {
    return `<html><head><meta charset="utf-8"></head><body>${input}</body></html>`;
  }

  return null;
}

/**
 * 提取文件路径
 */
function extractFilePath(input) {
  // 匹配常见的文件路径表达
  const patterns = [
    /(?:将|把|读取|上传)\s*[`'""]?([^\s`'"",，]+\.html?)[`'""]?\s*(?:上传|到)/i,
    /[`'""]?([^\s`'"",，]+\.html?)[`'""]?/i
  ];

  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

// ============================================
// 主流程
// ============================================

async function main() {
  // 从命令行参数或标准输入获取内容
  const args = process.argv.slice(2);
  const input = args.join(' ');

  if (!input || input.trim() === '') {
    console.log('请提供要上传的 HTML 内容或文件路径');
    console.log('');
    console.log('用法示例：');
    console.log('  1. 直接上传 HTML:');
    console.log('     上传到小程序：<html>...</html>');
    console.log('');
    console.log('  2. 从文件上传:');
    console.log('     将 report.html 上传到小程序');
    process.exit(1);
  }

  try {
    let htmlContent = null;
    let title = null;
    let fileInfo = null;

    // 1. 尝试提取文件路径
    const filePath = extractFilePath(input);
    if (filePath) {
      fileInfo = readHtmlFile(filePath);
      htmlContent = fileInfo.content;
      title = fileInfo.fileName;
      console.log(`✅ 已读取文件：${fileInfo.fileName} (${fileInfo.fileSize} KB)`);
    }

    // 2. 如果没有文件路径，尝试提取 HTML 内容
    if (!htmlContent) {
      htmlContent = extractHtmlFromInput(input);
    }

    // 3. 验证 HTML 内容
    if (!htmlContent || htmlContent.trim() === '') {
      throw new Error('未找到有效的 HTML 内容');
    }

    // 4. 上传到服务器
    console.log('⏳ 正在上传...');
    const result = await uploadHtmlContent(htmlContent, title);

    // 5. 输出结果
    console.log('');
    console.log(formatResult(result));

  } catch (error) {
    console.error('❌ 上传失败:', error.message);
    process.exit(1);
  }
}

// 执行主流程
if (require.main === module) {
  main();
}

module.exports = {
  uploadHtmlContent,
  readHtmlFile,
  formatResult
};
