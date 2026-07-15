# 小程序生成内容发布

该 Skill 使用 OpenClaw 内的 sender-scoped `miniapp_artifact` 工具发布 AI 生成的图片或 HTML。

- 图片先由 `image_generate` 生成，再调用 `publish_image`。
- HTML 使用 `publish_html` 原文发布。
- openid、`cm_user` 和服务地址由 Claw Manager 根据当前发送者自动映射。
- 不需要也不允许在 Skill 中配置 API Key、openid 或 Authorization。
- 发布成功后返回 `miniappPath`、`viewUrl` 和 `miniappScheme`，小程序 AI 可弹窗跳转，微信可返回图片及查看链接。

详见 [SKILL.md](SKILL.md)。
