---
name: miniapp-upload
description: Use when generated HTML or an OpenClaw-generated image needs to be published for the current user and opened from Time Manager miniapp or WeChat.
---

# 小程序生成内容发布

只使用 sender-scoped `miniapp_artifact`。不得请求、推断、显示或传递 openid、`cm_user`、Authorization、AK/SK 或服务端 URL。

## 发布图片

1. 必须先调用当前 Bridge 提供的 `image_generate` 工具，不能只生成提示词，也不能调用不存在的 OpenClaw 原生图片工具。
2. 只有当 `image_generate` 返回成功且包含 `generatedImageId` 时，才能继续。
3. 将工具返回的 `generatedImageId` 传给发布工具：

```json
{
  "operation": "publish_image",
  "generatedImageId": "img_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "title": "生成内容标题",
  "description": "可选说明"
}
```

`localPath` 仅用于微信渠道直接发送图片，不得作为 Artifact 参数。不得传入任意用户文件、网络 URL、输出路径或伪造的图片 ID。

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
- “图片已生成”必须同时满足：`image_generate` 成功、`miniapp_artifact.publish_image` 成功，并且返回了 artifact 的 `imageId` 或 `imageUrl`。
- 如果 `image_generate` 没有被调用、调用失败、返回结果缺少 `generatedImageId`，必须停止图片发布流程，并明确回复“图片生成失败”，不得生成 HTML 文字卡片冒充图片。
- 如果生图成功但上传失败，必须回复“图片已生成，但发布到小程序失败”，不得回复“已生成图片卡片”。
- 如果只能生成图片提示词而没有图片工具可用，必须明确说明当前未生成图片，不得声称已经生成。
- 使用工具返回的 `miniappPath`、`viewUrl` 或 `miniappScheme`，不得自行拼接链接。
- 小程序 AI 会根据 artifact 弹出查看入口；微信回复应同时发送图片附件或提供查看链接。
- 失败时说明失败阶段，不得返回认证信息或完整错误堆栈。
