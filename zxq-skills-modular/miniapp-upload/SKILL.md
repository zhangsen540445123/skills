---
name: miniapp-upload
description: Use when generated HTML or an OpenClaw-generated image needs to be published for the current user and opened from Time Manager miniapp or WeChat.
---

# 小程序生成内容发布

只使用 sender-scoped `miniapp_artifact`。不得请求、推断、显示或传递 openid、`cm_user`、Authorization、AK/SK 或服务端 URL。

## 发布图片

1. 图片必须先由 OpenClaw 原生 `image_generate` 生成。
2. 取得工具返回的本地附件路径。
3. 调用：

```json
{
  "operation": "publish_image",
  "localPath": "/tmp/openclaw/.../image.png",
  "title": "生成内容标题",
  "description": "可选说明"
}
```

不得传入任意用户文件、网络 URL 或未经 `image_generate` 生成的路径。

## 发布 HTML

HTML 必须是完整原文：

```json
{
  "operation": "publish_html",
  "title": "报告标题",
  "htmlContent": "<!doctype html>..."
}
```

不得摘要、截断或重新改写需要小程序展示的 HTML 原文。

## 回复规则

- 只在 Tool Result 成功后说明发布完成。
- 使用工具返回的 `miniappPath`、`viewUrl` 或 `miniappScheme`，不得自行拼接链接。
- 小程序 AI 会根据 artifact 弹出查看入口；微信回复应同时发送图片附件或提供查看链接。
- 失败时说明失败阶段，不得返回认证信息或完整错误堆栈。
