# Miniapp action reference

All calls use:

```json
{"actionKey":"...","parameters":{}}
```

## Daily checklist and tasks

| Action | Parameters | Purpose |
|---|---|---|
| `daily_checklist` | `date?` (`yyyy-MM-dd`) | Get a day's checklist |
| `daily_task_yesterday_uncompleted_count` | none | Count yesterday's unfinished tasks |
| `daily_task_create` | `title`, `date?`, `goalId?` | Create a daily task |
| `daily_task_update` | `taskId`, `title`, `goalId?` | Update a daily task |
| `daily_task_toggle` | `taskId` | Change completion state after querying current state |
| `daily_task_delete` | `taskId` | Delete after explicit confirmation |

## Goals

| Action | Parameters | Purpose |
|---|---|---|
| `goal_list` | `year?`, `month?`, `goalType?`, `status?`, `goalCategory?`, `goalArea?`, `completed?`, `keyword?` | Search/list goals |
| `goal_get` | `goalId` | Get goal detail |
| `goal_create` | Fields accepted by the goal creation form | Create a goal |
| `goal_update` | `goalId` plus update fields | Update a goal |
| `goal_toggle_completion` | `goalId`, `completedMonth?`, `completionSummary?`, `completionImages?` | Change completion after querying state |
| `goal_uncomplete` | `goalId` | Explicitly restore an already completed goal |
| `goal_delete` | `goalId` | Delete after explicit confirmation |
| `goal_statistics` | none | Overall goal statistics |
| `goal_year_month_statistics` | `year?` | Year/month statistics |
| `goal_categories` | `year?`, `month?`, `goalType?` | Categorized goals |
| `goal_category_list` | `category`, `year?`, `month?`, `goalType?` | Goals in one category |

### Goal creation contract

All dates use `yyyy-MM-dd`; date-times use `yyyy-MM-dd HH:mm:ss`.

- `goalType`: `YEAR` or `MONTH`; monthly goals require `goalMonth`, yearly goals must omit it.
- `goalCategory`: `PROJECT` or `HABIT`.
- `category`: `study`, `experience`, `relax`, `family`, `core`, `work`, `social`, `finance`, `health`.
- Project creation requires `title`, `goalType`, `goalYear`, `goalCategory=PROJECT`, and `category`.
- Habit creation additionally requires `habitStartDate`, `habitTargetDays`, `habitTargetCount`, `habitSuffix`, and `habitFrequencyType`.
- `habitTargetDays=-1` means permanent duration.
- `DAILY` requires `habitDailyWeekDays`; `WEEKLY` requires `habitWeeklyDays`; `PERIOD` requires `habitIntervalDays`.
- Optional habit fields include `habitPrefix` and `habitEncourageText`.

Infer explicit natural-language scope, type, quantity, unit, and start date before calling the tool. For example, “今年跑步 100 次” becomes a yearly habit with `habitTargetCount=100`, `habitSuffix=次`, and a start date of today. Ask only for frequency or other fields that remain genuinely ambiguous.

Supported goal updates include title/content, description, status, priority, deadline, progress, frog flag, start/end time, icon, habit fields, completion summary, and clearing habit configuration. Moving a goal across year, month, or grid category is unsupported; direct the user to the miniapp instead of deleting and recreating it.

## Subtasks

| Action | Parameters | Purpose |
|---|---|---|
| `subtask_list` | `goalId` | List subtasks |
| `subtask_create` | `goalId` plus subtask fields | Create a subtask |
| `subtask_update` | `goalId`, `subTaskId` plus fields | Update a subtask |
| `subtask_toggle` | `goalId`, `subTaskId`, completion fields? | Change status after querying |
| `subtask_delete` | `goalId`, `subTaskId` | Delete after confirmation |

## Habit check-ins

| Action | Parameters | Purpose |
|---|---|---|
| `habit_status` | `goalId`, `date?` | Check whether a date is checked in |
| `habit_records` | `goalId` | List records |
| `habit_count` | `goalId` | Total check-in days |
| `habit_checkin` | `goalId`, optional request fields | Check in |
| `habit_cancel` | `goalId`, `date?` | Cancel after confirmation |
| `habit_batch` | `goalId`, `count` | Batch check-in after confirmation |

## HTML content

| Action | Parameters | Purpose |
|---|---|---|
| `html_create` | `title?`, `htmlContent`, `contentKey?` | Save displayable HTML |
| `html_list` | none | List the user's HTML content |
| `html_get` | `contentKey` | Get full HTML when the user needs to inspect or display it |
| `html_delete` | `contentKey` | Delete after confirmation |

## Artifact publishing

| Tool operation | Parameters | Purpose |
|---|---|---|
| `miniapp_artifact.publish_image` | `localPath`, `title?`, `description?` | Publish an `image_generate` result and create a miniapp display page |
| `miniapp_artifact.publish_html` | `htmlContent`, `title?`, `contentKey?` | Publish exact HTML and return trusted navigation metadata |

Identity and authentication fields are never tool parameters. Links and miniapp paths must come from the Tool Result.
