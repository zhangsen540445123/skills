---
name: goal-manager
description: Manage the current user's goals, subtasks, daily checklist, habits, check-ins, and HTML presentation content through the sender-scoped miniapp_api_call tool. Use when the user asks to query, create, update, complete, restore, check in, summarize, or delete goal-management data.
---

# Goal Manager

Use only the sender-scoped `miniapp_api_call` tool. Never request, infer, display, or pass an openid, user key, Authorization header, or URL.

## Workflow

1. Identify the requested business operation and required date or resource.
2. Read [references/actions.md](references/actions.md) for the exact action and parameters.
3. Query first when an ID is unknown or a name can match multiple records.
4. Call `miniapp_api_call` with only `actionKey` and `parameters`.
5. Summarize the returned business data in natural language. Do not return raw JSON unless explicitly requested.

## Safety

- Execute a clearly requested single create, update, completion, restoration, or check-in directly.
- Ask for confirmation before every delete and every batch write.
- Do not use toggle actions when the desired current state is unknown. Query first, then toggle only if a state change is needed.
- Never guess a resource ID, ambiguous target, date, completed month, or destructive scope.
- If multiple records match, present concise candidates and ask the user to choose.
- Treat tool errors as failures. Never claim that a mutation succeeded without a successful Tool Result.

## Response Style

- For lists, summarize count, title, state, date, and the most useful next action.
- For mutations, state exactly what changed and identify the affected item.
- For statistics, explain the result and notable trend instead of dumping fields.
- For HTML creation, return the content key and display URL/path provided by the tool.
- Read [references/response-guidelines.md](references/response-guidelines.md) for large or HTML responses.
