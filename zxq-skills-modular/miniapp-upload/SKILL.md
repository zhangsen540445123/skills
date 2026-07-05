---
name: miniapp-upload
display_name: 小程序内容上传
description: |
  将生成的 HTML 内容上传到小程序后台，并返回小程序可跳转的链接。
  支持通过 API Key 认证，自动绑定到用户账号。
  触发词: "上传到小程序"、"回传到小程序"、"miniapp-upload"
tags:
  - 小程序
  - HTML上传
  - 内容分享
---

# 小程序内容上传 Skill

> 将 HTML 内容上传到小程序后台，生成可在微信小程序中查看的链接

## 功能说明

这个 skill 负责：
1. 将 HTML 内容上传到后端服务器
2. 通过 API Key 自动关联到用户账号
3. 返回小程序跳转链接，用户可在微信中直接查看

## 使用方法

### 基础用法

```
上传到小程序
```

触发后，会提示你提供要上传的 HTML 内容。

### 直接指定内容

```
将以下 HTML 上传到小程序：
<html>...</html>
```

### 从文件读取

```
将 report.html 上传到小程序
```

## 配置说明

在使用前，需要配置以下信息：

### 1. API 配置

在 `.env` 或配置文件中设置：

```bash
# 后端服务地址
MINIAPP_API_BASE_URL=https://940819.xyz/api

# API Key（从小程序后台获取）
MINIAPP_API_KEY=ak_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 2. 小程序配置

```bash
# 小程序 AppID（用于生成跳转链接）
MINIAPP_APPID=wxxxxxxxxxxxxxxxxxxx
```

## 工作流程

1. **获取 HTML 内容**
   - 从用户输入获取
   - 从文件读取
   - 从其他 skill 生成的内容获取

2. **上传到后端**
   - 调用 `/open-api/html-content` 接口
   - 使用 API Key 认证
   - 自动生成唯一 content_key

3. **返回结果**
   - Web 查看链接
   - 小程序路径
   - 小程序跳转链接（URL Scheme）

## 示例

### 示例 1：上传简单 HTML

**输入：**
```
上传以下内容到小程序：
<html>
<head><title>测试报告</title></head>
<body>
  <h1>2024年度总结</h1>
  <p>完成目标：80%</p>
</body>
</html>
```

**输出：**
```
✅ 上传成功！

📱 小程序查看：
pages/html-viewer/index?contentKey=abc123def456

🔗 Web 查看链接：
https://940819.xyz/api/open-api/html-content/abc123def456/view

📲 复制以下链接在微信中打开：
weixin://dl/business/?appid=wxXXXXXXXX&path=pages/html-viewer/index&query=contentKey%3Dabc123def456
```

### 示例 2：上传文件

**输入：**
```
将 ./report.html 上传到小程序
```

**输出：**
```
✅ 已读取文件：report.html (5.2 KB)
✅ 上传成功！

[返回链接...]
```

## API 接口说明

### 上传接口

```bash
POST /open-api/html-content
```

**Headers:**
```
X-Api-Key: ak_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "可选的标题",
  "htmlContent": "<html>...</html>",
  "contentKey": "可选的自定义key"
}
```

**Response:**
```json
{
  "code": 200,
  "message": "上传成功",
  "data": {
    "id": 123,
    "contentKey": "abc123def456",
    "viewUrl": "https://940819.xyz/api/open-api/html-content/abc123def456/view",
    "miniappPath": "pages/html-viewer/index?contentKey=abc123def456",
    "miniappScheme": "weixin://dl/business/?appid=wxXXXXXXXX..."
  }
}
```

## 注意事项

1. **API Key 安全**
   - 不要在代码中硬编码 API Key
   - 使用环境变量或配置文件
   - 定期更换 API Key

2. **HTML 内容限制**
   - 最大 10MB（数据库 LONGTEXT 限制）
   - 建议压缩 HTML 和内联资源
   - 外部资源需使用 HTTPS

3. **小程序页面**
   - 确保小程序中已创建 `pages/html-viewer/index` 页面
   - 页面需要支持 `contentKey` 参数
   - 页面需调用接口获取并渲染 HTML 内容

## 错误处理

| 错误码 | 说明 | 解决方案 |
|--------|------|----------|
| 400 | HTML 内容为空 | 检查输入内容 |
| 401 | API Key 无效 | 检查 API Key 配置 |
| 400 | content_key 已存在 | 使用自动生成或更换 key |
| 500 | 服务器错误 | 稍后重试或联系管理员 |

## 与其他 Skill 配合

### 与目标管理 Skill 配合

```
1. 生成我的年度目标总结报告（HTML格式）
2. 上传到小程序
```

### 与数据可视化 Skill 配合

```
1. 将目标完成率生成图表（HTML）
2. 上传到小程序分享给团队
```

## 技术实现

实现此 skill 需要：

1. **环境变量读取**
   ```javascript
   const apiBaseUrl = process.env.MINIAPP_API_BASE_URL;
   const apiKey = process.env.MINIAPP_API_KEY;
   ```

2. **HTTP 请求**
   ```javascript
   fetch(`${apiBaseUrl}/open-api/html-content`, {
     method: 'POST',
     headers: {
       'X-Api-Key': apiKey,
       'Content-Type': 'application/json'
     },
     body: JSON.stringify({
       title,
       htmlContent
     })
   });
   ```

3. **文件读取**
   ```javascript
   const fs = require('fs');
   const htmlContent = fs.readFileSync(filePath, 'utf-8');
   ```

## 更新日志

- **v1.0.0** (2026-07-04)
  - 初始版本
  - 支持 HTML 内容上传
  - 支持小程序跳转链接生成
  - 支持 API Key 认证
