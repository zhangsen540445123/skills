---
name: goal-manager
description: Use when the current user asks to query or change goals, subtasks, daily tasks, habit check-ins, HTML reports, or generated miniapp artifacts.
---

# Goal Manager

使用 sender-scoped 强类型工具：

- `miniapp_daily_task`
- `miniapp_goal`
- `miniapp_subtask`
- `miniapp_habit_checkin`
- `miniapp_html_content`
- `miniapp_artifact`

绝不请求、推断、显示或传递 openid、用户 Key、Authorization 或 URL。

## 工作流

1. 判断业务域和 operation。
2. ID 未知或名称可能重复时先查询。
3. 缺少强类型工具要求的必要业务字段时追问；能从“今年、这个月、每天”等明确语义推断时直接推断。
4. 调用对应工具，只传业务参数。
5. 根据 Tool Result 汇总自然语言；工具失败时不得声称成功。

## 目标创建推断

创建目标前，从用户原话中提取目标范围、类型、数量、单位、分类和开始日期。明确表达出的信息直接推断，不要重复追问。

- “今年跑步 100 次”推断为年度习惯目标，目标年份为当前年，开始日期为今天，目标次数为 100，单位为“次”。
- “这个月读 10 本书”推断为当月习惯目标，目标月份为当前月，开始日期为今天，目标次数为 10，单位为“本书”。
- “今年完成一个作品集”推断为年度项目目标；项目目标不需要习惯频率字段。
- 只在用户没有表达年度/月度范围、项目/习惯类型、数量单位，或习惯频率无法判断时追问。
- “每天”“每周”“每隔 N 天”等表达可分别推断为 `DAILY`、`WEEKLY`、`PERIOD`；没有频率信息时不得自行编造频率。
- 相对时间使用当前本地日期；推断出的习惯开始日期为今天，并将明确的年度/月度周期转换为对应的 `startTime` 和 `endTime`。

当前接口不支持移动目标年份、月份或九宫格分类。遇到这类请求，应提示用户在小程序中操作，不得通过删除后重建模拟移动。

## 安全边界

- 明确的单条创建、更新、完成、恢复、打卡可直接执行。
- 删除和批量打卡必须二次确认。
- toggle 前先查询当前状态。
- 名称匹配多条时让用户选择。
- HTML 原文使用 `miniapp_artifact.publish_html` 发布。
- 图片先用 `image_generate` 生成，再用 `miniapp_artifact.publish_image` 发布。
- 链接和小程序路径只使用工具返回值。

详细操作参数见 [references/actions.md](references/actions.md)。
