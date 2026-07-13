# 小程序内容上传 Skill

将 HTML 内容上传到小程序后台，并返回小程序可跳转的链接。

## 功能

- 上传 HTML 内容到服务器
- 自动通过 API Key 关联到用户账号
- 生成小程序跳转链接
- 支持从文件读取 HTML
- 支持直接输入 HTML 内容

## 安装

此 skill 已自动安装在 Claude Code 中，无需额外安装。

## 配置

在使用前，需要配置环境变量：

```bash
# 后端服务地址（默认：https://www.caoxf.nyc.mn/api）
export MINIAPP_API_BASE_URL=https://www.caoxf.nyc.mn/api

# API Key（必需，从小程序后台获取）
export MINIAPP_API_KEY=ak_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# 小程序 AppID（可选，用于生成跳转链接）
export MINIAPP_APPID=wxxxxxxxxxxxxxxxxxxx
```

### Windows PowerShell

```powershell
$env:MINIAPP_API_KEY="ak_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
$env:MINIAPP_APPID="wxxxxxxxxxxxxxxxxxxx"
```

### Windows CMD

```cmd
set MINIAPP_API_KEY=ak_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
set MINIAPP_APPID=wxxxxxxxxxxxxxxxxxxx
```

## 使用方法

### 方法 1：直接输入 HTML

```
上传到小程序：
<html>
<head><title>测试报告</title></head>
<body>
  <h1>2024年度总结</h1>
  <p>完成目标：80%</p>
</body>
</html>
```

### 方法 2：从文件上传

```
将 report.html 上传到小程序
```

### 方法 3：使用命令

```
上传到小程序
```

然后根据提示输入内容。

## 返回结果

上传成功后，会返回以下信息：

- **小程序路径**：可在小程序代码中使用
- **Web 查看链接**：可在浏览器中直接打开
- **微信跳转链接**：复制后在微信中打开，直接跳转到小程序

## 示例

**输入：**
```
上传以下内容到小程序：
<html>
<head>
  <meta charset="utf-8">
  <title>目标完成报告</title>
  <style>
    body { font-family: Arial; padding: 20px; }
    h1 { color: #333; }
  </style>
</head>
<body>
  <h1>2024年度目标完成报告</h1>
  <p>年度目标完成率：<strong>85%</strong></p>
  <ul>
    <li>健康目标：✅ 已完成</li>
    <li>学习目标：✅ 已完成</li>
    <li>工作目标：🔄 进行中</li>
  </ul>
</body>
</html>
```

**输出：**
```
✅ 上传成功！

📱 小程序路径：
pages/html-viewer/index?contentKey=abc123def456789

🔗 Web 查看链接：
https://www.caoxf.nyc.mn/api/open-api/html-content/abc123def456789/view

📲 微信跳转链接：
weixin://dl/business/?appid=wxd3578c75e67172b3&path=pages/html-viewer/index&query=contentKey%3Dabc123def456789

💡 提示：复制上面的链接在微信中打开，即可跳转到小程序查看
```

## 注意事项

1. **API Key 必须配置**：没有 API Key 将无法上传
2. **HTML 大小限制**：建议不超过 10MB
3. **小程序页面**：需要在小程序中创建对应的 HTML 查看页面
4. **外部资源**：HTML 中引用的外部资源（图片、CSS、JS）需使用 HTTPS

## 错误处理

| 错误信息 | 原因 | 解决方案 |
|---------|------|---------|
| `未配置 MINIAPP_API_KEY` | 环境变量未设置 | 设置 `MINIAPP_API_KEY` 环境变量 |
| `API Key 无效或已禁用` | API Key 错误或被禁用 | 检查 API Key 或联系管理员 |
| `未找到有效的 HTML 内容` | 输入内容不是 HTML | 确保输入包含 HTML 标签 |
| `文件不存在` | 文件路径错误 | 检查文件路径是否正确 |

## 技术说明

### 后端接口

- **上传接口**：`POST /open-api/html-content`
- **查看接口**：`GET /open-api/html-content/{contentKey}`
- **渲染接口**：`GET /open-api/html-content/{contentKey}/view`

### 认证方式

使用 HTTP Header 传递 API Key：

```
X-Api-Key: ak_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 数据存储

- 每个上传的 HTML 都会生成唯一的 `contentKey`
- 内容自动关联到 API Key 对应的用户
- 支持同一用户上传多个 HTML 内容

## 与其他功能配合

### 与目标管理系统配合

```
1. 生成我的月度目标总结（HTML 格式）
2. 上传到小程序
3. 分享给团队查看
```

### 与数据可视化配合

```
1. 生成目标完成率图表（HTML + Chart.js）
2. 上传到小程序
3. 在手机上随时查看
```

## 更新日志

### v1.0.0 (2026-07-04)
- ✨ 初始版本发布
- ✅ 支持 HTML 内容上传
- ✅ 支持从文件读取
- ✅ 支持生成小程序跳转链接
- ✅ 支持 API Key 认证
