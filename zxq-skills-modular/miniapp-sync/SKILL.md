---
name: miniapp-sync
description: Use when another skill needs to read and organize the current user's Time Manager goals, daily tasks, subtasks, habit records, or statistics across dates or categories.
---

# 小程序数据同步

这个 Skill 负责把当前用户的小程序业务数据按日期、年份、月份、目标类型或业务域读取出来，供其他 Skill 做计划、复盘和洞察。它只使用 sender-scoped Bridge 工具，不直接访问小程序 HTTP API。

## 身份与安全

- 只调用 `miniapp_daily_task`、`miniapp_goal`、`miniapp_subtask`、`miniapp_habit_checkin`。
- 不请求、推断、显示或传递 openid、用户 Key、Authorization、AK/SK、API 地址或 URL。
- 结果只属于当前发送者；不得把当前用户数据写入其他用户的上下文。
- 读取失败时保留错误状态，不得伪造同步成功或使用本地旧数据冒充最新数据。

## 同步场景

### 全量目标与统计

1. 使用 `miniapp_goal.list` 查询目标。
2. 需要汇总时调用 `statistics`、`year_month_statistics` 或 `categories`。
3. 需要目标详情时再调用 `get`，不要为每个列表项无条件重复查询。

### 按年份或月份

- 年度目标：`miniapp_goal.list` 搭配 `goalType=YEAR` 和 `year`。
- 月度目标：`miniapp_goal.list` 搭配 `goalType=MONTH`、`year` 和 `month`。
- 九宫格分类：调用 `categories` 或 `category_list`。

### 日计划

- 指定日期调用 `miniapp_daily_task.get_checklist`，日期格式为 `yyyy-MM-dd`。
- 未指定日期时使用今天，并在汇总中明确说明。
- 需要昨日未完成数量时调用 `yesterday_uncompleted_count`。

### 目标详情与习惯记录

- 目标详情先调用 `miniapp_goal.get`。
- 子任务调用 `miniapp_subtask.list`。
- 习惯目标再调用 `miniapp_habit_checkin.status`、`records` 或 `count`。
- 不确定目标 ID 时先用 `miniapp_goal.list` 查询，名称重复时让用户选择。

## 给其他 Skill 的结果

返回结构化的业务摘要：数据范围、数量、标题、状态、日期、进度和必要的 ID。不要把原始 JSON 整段倾倒到对话中，也不要自行改写 HTML。需要展示 HTML 时，将原文交给 `miniapp_html_content` 或使用其返回的展示链接。

## 与写入操作的边界

本 Skill 默认只读。创建、更新、完成、删除、打卡等写操作交给 `goal-manager`，并遵守其确认规则；不要在同步过程中顺便修改用户数据。
