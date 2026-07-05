---
name: miniapp-sync
description: |
  从小程序后台读取和同步用户目标管理数据到 openclaw 本地。
  支持全量同步、按时间段同步、按类型同步。
  可以被其他 skill 调用，作为数据源。
  触发词: "同步小程序数据"、"拉取我的目标"、"读取年度目标"、"从小程序读取"
tags:
  - 小程序
  - 数据同步
  - API对接
  - 目标管理
---

# 小程序数据同步 Skill

## 功能说明

从小程序后台读取用户的目标管理数据，同步到 openclaw 本地，供其他 skill 使用。

这是一个**工具 skill**，负责打通 openclaw 和小程序后台的数据读取通道。

## 支持的数据类型

### 1. 目标数据
- 年度目标九宫格
- 月度目标九宫格
- 项目型目标（PROJECT）
- 习惯型目标（HABIT）
- 目标详情（包含子任务、打卡记录）

### 2. 日计划数据
- 日清单（包含日待办、年目标任务、月目标任务、项目任务、习惯任务）
- 日待办历史
- 昨日未完成待办数量

### 3. 统计数据
- 目标状态统计（总数、进行中、已完成、已暂停、已取消）
- 年月目标统计（年度目标数、月度目标数、完成率）
- 分类目标统计（按九宫格八大领域）

### 4. 习惯打卡数据
- 打卡状态
- 打卡记录
- 打卡次数

---

## API 配置

在 `.env` 或配置文件中设置：

```bash
# 小程序后台地址
MINIAPP_API_BASE_URL=https://940819.xyz/api

# API Key（从小程序后台获取）
MINIAPP_API_KEY=ak_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**获取 API Key 的方式**：
- 生产环境：`https://940819.xyz/api`
- 本地测试：`https://www.caoxf.nyc.mn/api`（可能需要 `-k` 参数跳过证书验证）

---

## 使用方式

### 1. 全量同步
```
同步小程序数据
拉取我的所有目标
```

→ 拉取所有数据（年度目标、月目标、日计划、统计数据）

---

### 2. 按时间段同步

#### 同步指定年份的数据
```
同步 2026 年的数据
读取 2026 年目标
```

→ 拉取指定年份的年度目标

#### 同步指定月份的数据
```
同步 2026 年 7 月的数据
读取这个月的目标
读取本月目标
```

→ 拉取指定月份的月度目标

#### 同步日计划历史
```
同步最近 7 天的日计划
读取 2026-07-01 到 2026-07-07 的日清单
```

→ 拉取指定日期范围的日计划

---

### 3. 按类型同步

#### 读取年度目标
```
读取年度目标
同步年度目标九宫格
```

→ 拉取当前年度的所有年度目标

#### 读取月度目标
```
读取月目标
同步月目标九宫格
```

→ 拉取当前月份的所有月度目标

#### 读取日计划
```
读取今天的日清单
同步今日计划
```

→ 拉取今天的日清单（包含日待办、目标任务、习惯任务）

#### 读取目标统计
```
读取目标统计
查看目标完成率
```

→ 拉取目标状态统计和年月目标统计

#### 读取分类目标
```
读取分类目标
查看九宫格各领域目标
```

→ 按八大领域（健康、工作、学习等）拉取目标

---

## API 接口说明

### 1. 认证方式

所有接口都需要在请求头中携带：

```bash
X-Api-Key: ak_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Content-Type: application/json  # POST/PUT 请求必须
```

**重要**：
- API Key 和用户 openid 在后台绑定
- 不需要传 `openid` 或 `userId`
- 服务端会自动识别 API Key 对应的用户

---

### 2. 目标相关接口

#### 2.1 查询目标列表
```bash
GET /open-api/goals
```

**Query 参数**：
- `year` - 按年份过滤（如 `2026`）
- `month` - 按月份过滤（`1` 到 `12`）
- `goalType` - 按目标类型过滤（`YEAR`、`MONTH`）
- `status` - 按状态过滤（`ACTIVE`、`COMPLETED`、`PAUSED`、`CANCELLED`）
- `goalCategory` - 按结构类型过滤（`PROJECT`、`HABIT`）
- `goalArea` - 按领域过滤（如 `健康·身体`、`工作·事业`）
- `completed` - 按完成状态过滤（`0`、`1`）
- `keyword` - 模糊搜索（标题、内容、描述、领域）

**示例**：
```bash
# 查询 2026 年的年度目标
curl -X GET "https://940819.xyz/api/open-api/goals?year=2026&goalType=YEAR" \
  -H "X-Api-Key: ak_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# 查询 7 月的月度目标
curl -X GET "https://940819.xyz/api/open-api/goals?year=2026&month=7&goalType=MONTH" \
  -H "X-Api-Key: ak_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

---

#### 2.2 查询目标详情
```bash
GET /open-api/goals/{goalId}
```

**Path 参数**：
- `goalId` - 目标 ID

**返回**：目标详情（包含所有字段）

---

#### 2.3 查询目标统计
```bash
GET /open-api/goals/statistics
```

**返回**：
```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "totalGoals": 10,
    "activeGoals": 6,
    "completedGoals": 3,
    "pausedGoals": 1,
    "cancelledGoals": 0
  }
}
```

---

#### 2.4 查询年月目标统计
```bash
GET /open-api/goals/statistics/year-month?year=2026
```

**Query 参数**：
- `year` - 统计年份（默认当前年）

**返回**：
```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "totalYearGoals": 8,
    "completedYearGoals": 3,
    "totalMonthGoals": 12,
    "completedMonthGoals": 7,
    "overallCompletionRate": 50
  }
}
```

---

#### 2.5 查询分类目标
```bash
GET /open-api/goals/categories?year=2026&goalType=YEAR
```

**Query 参数**：
- `year` - 查询年份（默认当前年）
- `month` - 查询月份（`goalType=MONTH` 时必填）
- `goalType` - 目标类型（`YEAR`、`MONTH`，默认 `YEAR`）

**返回**：按九宫格八大领域分组的目标
```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "categories": {
      "study": {
        "count": 2,
        "goals": [...]
      },
      "health": {
        "count": 1,
        "goals": [...]
      },
      ...
    }
  }
}
```

**九宫格领域**：
- `study` - 学习·成长
- `experience` - 体验·突破
- `relax` - 休闲·放松
- `family` - 家庭·生活
- `core` - 核心词
- `work` - 工作·事业
- `social` - 人际·社群
- `finance` - 财务·理财
- `health` - 健康·身体

---

#### 2.6 查询指定分类目标
```bash
GET /open-api/goals/category/{category}?year=2026
```

**Path 参数**：
- `category` - 分类 key（如 `health`、`work`）

**Query 参数**：
- `year` - 查询年份
- `month` - 查询月份（可选）

---

### 3. 子任务相关接口

#### 3.1 查询子任务
```bash
GET /open-api/goals/{goalId}/subtasks
```

**Path 参数**：
- `goalId` - 目标 ID

**返回**：子任务数组

---

### 4. 日清单与日待办接口

#### 4.1 查询日清单
```bash
GET /open-api/daily-checklist?date=2026-07-05
```

**Query 参数**：
- `date` - 查询日期（格式 `yyyy-MM-dd`，默认今天）

**返回**：
```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "date": "2026-07-05",
    "dailyTasks": [...],              // 日待办列表
    "yearGoalTasks": [...],           // 年目标任务
    "monthGoalTasks": [...],          // 月目标任务
    "projectGoalTasks": [...],        // 项目型目标任务
    "habitGoalTasks": [...],          // 习惯目标
    "yesterdayUncompletedCount": 3    // 昨日未完成数量
  }
}
```

---

#### 4.2 查询昨日未完成待办数量
```bash
GET /open-api/daily-tasks/yesterday-uncompleted-count
```

**返回**：昨日未完成待办数量

---

### 5. 习惯打卡相关接口

#### 5.1 查询打卡状态
```bash
GET /open-api/goals/{goalId}/checkin/status?date=2026-07-05
```

**Path 参数**：
- `goalId` - 习惯目标 ID

**Query 参数**：
- `date` - 查询日期（默认今天）

**返回**：`true` 已打卡，`false` 未打卡

---

#### 5.2 查询打卡记录
```bash
GET /open-api/goals/{goalId}/checkin/records
```

**Path 参数**：
- `goalId` - 习惯目标 ID

**返回**：该目标全部打卡记录（按日期倒序）

---

#### 5.3 查询总打卡次数
```bash
GET /open-api/goals/{goalId}/checkin/count
```

**Path 参数**：
- `goalId` - 习惯目标 ID

**返回**：总打卡次数

---

## 被其他 Skill 调用

### weekly-insight 调用示例

`weekly-insight` 启动时需要读取最近 7 天的复盘数据：

```markdown
## weekly-insight 启动时

1. 检查本地是否有最近 7 天的数据
2. 如果没有，调用 miniapp-sync
3. 读取 7 天的日清单、目标任务、习惯打卡
4. 再生成洞察
```

**调用方式**：
```
调用 miniapp-sync，参数：
- 同步最近 7 天的日计划
- 日期范围：2026-06-29 到 2026-07-05
```

---

### monthly-goal-grid 调用示例

`monthly-goal-grid` 启动时需要读取上月目标作为参考：

```markdown
## monthly-goal-grid 启动时

1. 检查是否有上月目标数据
2. 如果有，展示给用户参考
3. 如果没有，调用 miniapp-sync 拉取
4. 同时读取当前年度目标（用于对齐）
```

**调用方式**：
```
调用 miniapp-sync，参数：
- 读取 2026 年 6 月的月目标
- 读取 2026 年的年度目标
```

---

### goal-grid-reviewer 调用示例

`goal-grid-reviewer` 启动时需要读取用户当前的九宫格：

```markdown
## goal-grid-reviewer 启动时

1. 如果本地没有九宫格数据
2. 调用 miniapp-sync 拉取
3. 读取分类目标（九宫格结构）
```

**调用方式**：
```
调用 miniapp-sync，参数：
- 读取分类目标
- 年份：2026
- 类型：YEAR
```

---

## 数据缓存

### 缓存策略
- 读取的数据会缓存到本地（内存或临时文件）
- 避免重复请求
- 用户可以手动刷新

### 缓存时效
- 目标数据：缓存 5 分钟
- 日计划数据：缓存 1 分钟
- 统计数据：缓存 10 分钟

### 手动刷新
```
刷新小程序数据
强制同步
```

---

## 错误处理

| 错误码 | 说明 | 解决方案 |
|--------|------|----------|
| `400` | 请求参数错误 | 检查日期格式、目标 ID 是否正确 |
| `401` | API Key 无效或已禁用 | 检查 `.env` 中的 `MINIAPP_API_KEY` |
| `404` | 资源不存在或无权访问 | 用户可能还没创建对应数据 |
| `500` | 服务器错误 | 稍后重试或联系管理员 |

---

## 数据结构说明

### 目标对象 (Goal)

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | Long | 目标 ID |
| `title` | String | 目标标题 |
| `goalContent` | String | 目标内容 |
| `goalType` | String | 目标类型（`YEAR`、`MONTH`） |
| `goalYear` | Integer | 目标年份 |
| `goalMonth` | Integer | 目标月份（月目标） |
| `goalArea` | String | 目标领域（如 `健康·身体`） |
| `goalCategory` | String | 目标结构类型（`PROJECT`、`HABIT`） |
| `status` | String | 目标状态（`ACTIVE`、`COMPLETED`、`PAUSED`、`CANCELLED`） |
| `completed` | Integer | 完成状态（`0` 未完成，`1` 已完成） |
| `priority` | String | 优先级（`HIGH`、`MEDIUM`、`LOW`） |
| `isFrogGoal` | Integer | 是否青蛙目标（`0` 否，`1` 是） |
| `startTime` | String | 开始时间 |
| `endTime` | String | 结束时间 |
| `deadline` | String | 截止时间 |
| `icon` | String | 图标标识 |
| `description` | String | 目标描述 |
| `progress` | Integer | 目标进度（`0` 到 `100`） |

**项目型目标额外字段**：
| 字段 | 类型 | 说明 |
|------|------|------|
| `subTaskCount` | Integer | 子任务总数 |
| `completedSubTaskCount` | Integer | 已完成子任务数 |

**习惯型目标额外字段**：
| 字段 | 类型 | 说明 |
|------|------|------|
| `habitPrefix` | String | 习惯前缀 |
| `habitTargetCount` | Integer | 习惯目标数量 |
| `habitSuffix` | String | 习惯后缀 |
| `habitFrequencyType` | String | 习惯频率（`DAILY`、`WEEKLY`、`PERIOD`） |
| `habitDailyWeekDays` | String | 按天频率的星期配置（JSON 数组字符串） |
| `habitWeeklyDays` | Integer | 按周频率时每周需打卡天数 |
| `habitIntervalDays` | Integer | 按固定间隔打卡（每 N 天一次） |
| `habitCompletedCount` | Integer | 习惯累计完成次数 |
| `habitLivesRemaining` | Integer | 习惯剩余生命值 |
| `habitTargetDays` | Integer | 习惯坚持天数（`-1` 表示永久） |
| `habitStartDate` | String | 习惯开始日期（`yyyy-MM-dd`） |
| `habitEncourageText` | String | 习惯鼓励语 |

---

### 子任务对象 (SubTask)

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | Long | 子任务 ID |
| `goalId` | Long | 父目标 ID |
| `taskName` | String | 子任务名称 |
| `startTime` | String | 开始时间 |
| `endTime` | String | 结束时间 |
| `status` | String | 状态（`PENDING`、`COMPLETED`） |
| `sortOrder` | Integer | 排序值 |
| `completedTime` | String | 完成时间 |

---

### 日待办对象 (DailyTask)

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | Long | 日待办 ID |
| `title` | String | 待办标题 |
| `taskDate` | String | 待办所属日期（`yyyy-MM-dd`） |
| `completed` | Integer | 完成状态（`0` 未完成，`1` 已完成） |
| `goalId` | Long | 关联目标 ID |

---

### 习惯打卡记录 (HabitCheckinRecord)

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | Long | 打卡记录 ID |
| `goalId` | Long | 习惯目标 ID |
| `checkinDate` | String | 打卡日期（`yyyy-MM-dd`） |
| `checkinTime` | String | 打卡时间（`yyyy-MM-dd HH:mm:ss`） |
| `weekNumber` | Integer | 打卡日期所在年份的周编号 |
| `yearNumber` | Integer | 打卡日期所在年份 |

---

## 实现示例

### 使用 curl 测试

```bash
# 读取年度目标
curl -X GET "https://940819.xyz/api/open-api/goals?year=2026&goalType=YEAR" \
  -H "X-Api-Key: ak_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# 读取今天的日清单
curl -X GET "https://940819.xyz/api/open-api/daily-checklist?date=2026-07-05" \
  -H "X-Api-Key: ak_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# 读取目标统计
curl -X GET "https://940819.xyz/api/open-api/goals/statistics" \
  -H "X-Api-Key: ak_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# 读取分类目标
curl -X GET "https://940819.xyz/api/open-api/goals/categories?year=2026&goalType=YEAR" \
  -H "X-Api-Key: ak_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

---

### 使用 Python 实现

```python
import requests
import os

# API 配置
API_BASE_URL = os.getenv('MINIAPP_API_BASE_URL', 'https://940819.xyz/api')
API_KEY = os.getenv('MINIAPP_API_KEY')

headers = {
    'X-Api-Key': API_KEY
}

# 读取年度目标
def fetch_annual_goals(year=2026):
    url = f"{API_BASE_URL}/open-api/goals"
    params = {
        'year': year,
        'goalType': 'YEAR'
    }
    response = requests.get(url, headers=headers, params=params)
    return response.json()

# 读取月度目标
def fetch_monthly_goals(year=2026, month=7):
    url = f"{API_BASE_URL}/open-api/goals"
    params = {
        'year': year,
        'month': month,
        'goalType': 'MONTH'
    }
    response = requests.get(url, headers=headers, params=params)
    return response.json()

# 读取日清单
def fetch_daily_checklist(date='2026-07-05'):
    url = f"{API_BASE_URL}/open-api/daily-checklist"
    params = {'date': date}
    response = requests.get(url, headers=headers, params=params)
    return response.json()

# 读取目标统计
def fetch_goal_statistics():
    url = f"{API_BASE_URL}/open-api/goals/statistics"
    response = requests.get(url, headers=headers)
    return response.json()

# 读取分类目标
def fetch_category_goals(year=2026, goal_type='YEAR'):
    url = f"{API_BASE_URL}/open-api/goals/categories"
    params = {
        'year': year,
        'goalType': goal_type
    }
    response = requests.get(url, headers=headers, params=params)
    return response.json()
```

---

## 注意事项

1. **API Key 安全**
   - 不要在代码中硬编码 API Key
   - 使用环境变量或配置文件
   - 定期更换 API Key

2. **数据归属**
   - API Key 和用户 openid 绑定
   - 不需要传 `openid` 或 `userId`
   - 只能读取 API Key 对应用户的数据

3. **日期格式**
   - 日期：`yyyy-MM-dd`（如 `2026-07-05`）
   - 日期时间：`yyyy-MM-dd HH:mm:ss`（如 `2026-07-05 09:30:00`）
   - ISO 格式也支持：`yyyy-MM-dd'T'HH:mm:ss`

4. **分类目标查询**
   - `goalType=MONTH` 时必须传 `month` 参数
   - 否则月目标分类计算会缺少月份

5. **习惯目标**
   - 只有 `goalCategory=HABIT` 的目标才能查询打卡记录
   - 打卡状态查询默认查今天

---

## 更新日志

- **v1.0.0** (2026-07-05)
  - 初始版本
  - 支持目标、子任务、日计划、习惯打卡数据同步
  - 支持目标统计、分类目标查询
  - 支持按时间段、按类型同步
  - 可被其他 skill 调用
