---
name: goal-manager
description: Manage the current user's Time Manager daily tasks, goals, subtasks, habit check-ins, and HTML content through five sender-scoped miniapp tools. Use for queries and confirmed mutations of the user's goal-management data.
---

# Goal Manager

Use only these sender-scoped tools:

- `miniapp_daily_task`
- `miniapp_goal`
- `miniapp_subtask`
- `miniapp_habit_checkin`
- `miniapp_html_content`

Never request, infer, display, or pass an openid, user key, Authorization header, or URL. The Bridge resolves identity from the current sender.

## Workflow

1. Identify the business domain and operation.
2. Read [references/actions.md](references/actions.md) for the exact operation schema and conditional fields.
3. Query first whenever an ID is unknown, a name may match multiple records, or a toggle's current state is unknown.
4. Ask only for missing business information. Never ask for identity or credentials.
5. Call one of the five tools with its `operation` and typed fields.
6. Treat every Tool Error as failure. Never claim success without a successful Tool Result.
7. Summarize returned business data naturally. Do not dump raw JSON unless explicitly requested.

## Goal Creation

Before creating a goal, establish from the user's words or by asking only when it cannot be inferred:

- yearly or monthly goal;
- target year and, for monthly goals, target month;
- project or habit goal;
- title;
- one of the nine grid categories.

Infer the time scope, project/habit type, category, quantity, unit, and start date when the user's wording makes them clear. Relative phrases use the current local date: "this month" means the current month, "this year" means the current year, and an inferred habit starts today. Ask only for fields that remain genuinely ambiguous.

Examples:

- "This month read ten books" means a current-month habit goal, starting today, with target count `10` and suffix `books`.
- "This year run 100 times" means a current-year habit goal, starting today, with target count `100` and suffix `times`.

For a relative month/year goal, set the explicit `startTime` to today and `endTime` to the final second of that month/year so the Bridge preserves the intended period. Do not ask the user to repeat a time scope already present in the request.

For a habit goal, also establish the target days or permanent duration, target count and unit, frequency type, and frequency-specific schedule. Frequency must still be asked when the wording does not determine `DAILY`, `WEEKLY`, or `PERIOD`; never invent a schedule.

The current API cannot move a goal to another year, month, or grid category. Tell the user to use the miniapp for such moves. Do not emulate a move by deleting and recreating the goal.

## Safety

- Execute a clearly requested single create, update, completion, restoration, or check-in directly.
- Ask for confirmation before every delete and every batch check-in.
- A daily task without a date means today; state that explicitly in the response.
- Never use a toggle when the desired current state is unknown. Query first and toggle only if a change is needed.
- Never guess a resource ID, ambiguous target, completed month, destructive scope, or missing goal time scope.
- If multiple records match, present concise candidates and ask the user to choose.

## Response Style

- Lists: summarize count, title, state, relevant date, and the most useful next action.
- Mutations: state exactly what changed and identify the affected item from the Tool Result.
- Statistics: explain notable values or trends instead of dumping fields.
- HTML: preserve returned HTML exactly. Prefer the provided `viewUrl` or `miniappPath` for display and do not rewrite source HTML.
- Follow [references/response-guidelines.md](references/response-guidelines.md) for large and HTML responses.
