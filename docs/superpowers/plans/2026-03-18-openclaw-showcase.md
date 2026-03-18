# Tina-OpenClaw 应用案例汇总网站 实现计划

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个苹果官网风格的单页展示网站，汇总展示 40+ 个 OpenClaw 真实应用案例，按 6 大类别组织，支持卡片展开/收起交互。

**Architecture:** 纯静态单页应用（HTML + CSS + JS），案例数据存储在 `data/cases.json`，页面通过 `fetch()` 加载数据后动态渲染。无构建工具，无框架依赖，直接部署到 Vercel。

**Tech Stack:** HTML5 语义化标签、CSS3（Grid/Flexbox/自定义属性/动画）、原生 JavaScript（ES6+）、JSON 数据文件

---

## Chunk 1: 数据层

### 文件结构

```
/Users/tina/Downloads/tinaproject/
├── index.html              # 主页面（单页应用入口）
├── css/
│   ├── reset.css           # CSS reset + 基础变量
│   ├── layout.css          # 导航栏、Hero、类别区域布局
│   ├── card.css            # 案例卡片样式（默认+展开状态）
│   └── responsive.css      # 响应式断点
├── js/
│   ├── data.js             # 数据加载与解析（fetch + 错误处理）
│   ├── render.js           # DOM 渲染（类别区域、卡片）
│   ├── interactions.js     # 交互逻辑（展开/收起、导航高亮）
│   └── main.js             # 入口，组合以上模块
└── data/
    ├── categories.json     # 6 个类别定义
    └── cases.json          # 40 个案例数据
```

---

### Task 1: 创建 categories.json

**Files:**
- Create: `data/categories.json`

- [ ] **Step 1: 创建 data 目录并写入 categories.json**

```bash
mkdir -p /Users/tina/Downloads/tinaproject/data
```

内容写入 `data/categories.json`：

```json
[
  {
    "id": "social-media",
    "name": "社交媒体",
    "nameEn": "Social Media",
    "colorStart": "#FF3B30",
    "colorEnd": "#FF6B6B",
    "icon": "📱",
    "description": "社交媒体自动化、内容聚合与分析",
    "order": 1
  },
  {
    "id": "creative-building",
    "name": "创意与构建",
    "nameEn": "Creative & Building",
    "colorStart": "#FF9500",
    "colorEnd": "#FFB84D",
    "icon": "🎨",
    "description": "内容创作、游戏开发、多媒体制作",
    "order": 2
  },
  {
    "id": "infrastructure-devops",
    "name": "基础设施与DevOps",
    "nameEn": "Infrastructure & DevOps",
    "colorStart": "#34C759",
    "colorEnd": "#5DD57D",
    "icon": "⚙️",
    "description": "服务器管理、工作流编排、自动化运维",
    "order": 3
  },
  {
    "id": "productivity",
    "name": "生产力工具",
    "nameEn": "Productivity",
    "colorStart": "#007AFF",
    "colorEnd": "#4DA3FF",
    "icon": "📊",
    "description": "项目管理、客服系统、邮件处理、日程安排",
    "order": 4
  },
  {
    "id": "research-learning",
    "name": "研究与学习",
    "nameEn": "Research & Learning",
    "colorStart": "#5856D6",
    "colorEnd": "#8B89E6",
    "icon": "📚",
    "description": "知识管理、市场研究、学术论文分析",
    "order": 5
  },
  {
    "id": "finance-trading",
    "name": "金融与交易",
    "nameEn": "Finance & Trading",
    "colorStart": "#FFD60A",
    "colorEnd": "#FFE04D",
    "icon": "💰",
    "description": "预测市场、交易自动化、财务分析",
    "order": 6
  }
]
```

- [ ] **Step 2: 验证 JSON 格式正确**

```bash
python3 -c "import json; data=json.load(open('/Users/tina/Downloads/tinaproject/data/categories.json')); print(f'OK: {len(data)} categories')"
```

期望输出：`OK: 6 categories`

- [ ] **Step 3: Commit**

```bash
git add data/categories.json
git commit -m "feat: add categories data"
```

---

### Task 2: 创建 cases.json

**Files:**
- Create: `data/cases.json`

- [ ] **Step 1: 写入 cases.json（全部 6 个类别，共 40 个案例）**

> 注：finance-trading 类别目前仅有 1 个案例（Polymarket Autopilot），与 GitHub 仓库数据一致。

内容写入 `data/cases.json`：

```json
[
  {
    "id": "daily-reddit-digest",
    "name": "Daily Reddit Digest",
    "category": "social-media",
    "description": "Summarize curated subreddit digests based on your preferences. Get daily summaries of top posts delivered to your inbox.",
    "tools": ["OpenClaw", "Reddit API", "Email"],
    "links": [{"text": "查看详情", "url": "https://github.com/hesamsheikh/awesome-openclaw-usecases/blob/main/usecases/daily-reddit-digest.md"}],
    "verified": true,
    "featured": true
  },
  {
    "id": "daily-youtube-digest",
    "name": "Daily YouTube Digest",
    "category": "social-media",
    "description": "Get daily summaries of new videos from your favorite YouTube channels. Never miss important content.",
    "tools": ["OpenClaw", "YouTube API", "Email"],
    "links": [{"text": "查看详情", "url": "https://github.com/hesamsheikh/awesome-openclaw-usecases/blob/main/usecases/daily-youtube-digest.md"}],
    "verified": true,
    "featured": false
  },
  {
    "id": "x-account-analysis",
    "name": "X Account Analysis",
    "category": "social-media",
    "description": "Receive qualitative analysis of your X (Twitter) account including engagement patterns and content performance.",
    "tools": ["OpenClaw", "X API"],
    "links": [{"text": "查看详情", "url": "https://github.com/hesamsheikh/awesome-openclaw-usecases/blob/main/usecases/x-account-analysis.md"}],
    "verified": true,
    "featured": false
  },
  {
    "id": "multi-source-tech-news",
    "name": "Multi-Source Tech News Digest",
    "category": "social-media",
    "description": "Aggregate quality-scored tech news from 109+ sources via natural language queries. Stay on top of the tech world.",
    "tools": ["OpenClaw", "RSS", "n8n"],
    "links": [{"text": "查看详情", "url": "https://github.com/hesamsheikh/awesome-openclaw-usecases/blob/main/usecases/multi-source-tech-news-digest.md"}],
    "verified": true,
    "featured": true
  },
  {
    "id": "x-twitter-automation",
    "name": "X/Twitter Automation",
    "category": "social-media",
    "description": "Post tweets, reply, like, retweet, follow, DM, search, and monitor accounts via the TweetClaw plugin.",
    "tools": ["OpenClaw", "TweetClaw", "X API"],
    "links": [{"text": "查看详情", "url": "https://github.com/hesamsheikh/awesome-openclaw-usecases/blob/main/usecases/x-twitter-automation.md"}],
    "verified": true,
    "featured": false
  },
  {
    "id": "goal-driven-autonomous-tasks",
    "name": "Goal-Driven Autonomous Tasks",
    "category": "creative-building",
    "description": "Brain dump your goals and have agents autonomously generate daily tasks and mini-apps to achieve them.",
    "tools": ["OpenClaw", "Multi-Agent"],
    "links": [{"text": "查看详情", "url": "https://github.com/hesamsheikh/awesome-openclaw-usecases/blob/main/usecases/overnight-mini-app-builder.md"}],
    "verified": true,
    "featured": true
  },
  {
    "id": "youtube-content-pipeline",
    "name": "YouTube Content Pipeline",
    "category": "creative-building",
    "description": "Automate video idea scouting, research, and tracking for your YouTube channel.",
    "tools": ["OpenClaw", "YouTube API", "Notion"],
    "links": [{"text": "查看详情", "url": "https://github.com/hesamsheikh/awesome-openclaw-usecases/blob/main/usecases/youtube-content-pipeline.md"}],
    "verified": true,
    "featured": false
  },
  {
    "id": "multi-agent-content-factory",
    "name": "Multi-Agent Content Factory",
    "category": "creative-building",
    "description": "Run a multi-agent pipeline in Discord with research, writing, and thumbnail agents working in parallel.",
    "tools": ["OpenClaw", "Discord", "Multi-Agent"],
    "links": [{"text": "查看详情", "url": "https://github.com/hesamsheikh/awesome-openclaw-usecases/blob/main/usecases/content-factory.md"}],
    "verified": true,
    "featured": true
  },
  {
    "id": "autonomous-game-dev-pipeline",
    "name": "Autonomous Game Dev Pipeline",
    "category": "creative-building",
    "description": "Full lifecycle game development management from backlog to git commit with a 'Bugs First' policy.",
    "tools": ["OpenClaw", "Git", "Multi-Agent"],
    "links": [{"text": "查看详情", "url": "https://github.com/hesamsheikh/awesome-openclaw-usecases/blob/main/usecases/autonomous-game-dev-pipeline.md"}],
    "verified": true,
    "featured": false
  },
  {
    "id": "podcast-production-pipeline",
    "name": "Podcast Production Pipeline",
    "category": "creative-building",
    "description": "Automate guest research, episode outlines, show notes, and social media promotion for your podcast.",
    "tools": ["OpenClaw", "Email", "Social Media"],
    "links": [{"text": "查看详情", "url": "https://github.com/hesamsheikh/awesome-openclaw-usecases/blob/main/usecases/podcast-production-pipeline.md"}],
    "verified": true,
    "featured": false
  },
  {
    "id": "n8n-workflow-orchestration",
    "name": "n8n Workflow Orchestration",
    "category": "infrastructure-devops",
    "description": "Delegate API calls via webhooks without exposing credentials. Secure workflow orchestration with n8n.",
    "tools": ["OpenClaw", "n8n", "Webhooks"],
    "links": [{"text": "查看详情", "url": "https://github.com/hesamsheikh/awesome-openclaw-usecases/blob/main/usecases/n8n-workflow-orchestration.md"}],
    "verified": true,
    "featured": true
  },
  {
    "id": "self-healing-home-server",
    "name": "Self-Healing Home Server",
    "category": "infrastructure-devops",
    "description": "Always-on infrastructure agent with SSH access and automated cron jobs that self-heals your home server.",
    "tools": ["OpenClaw", "SSH", "Cron"],
    "links": [{"text": "查看详情", "url": "https://github.com/hesamsheikh/awesome-openclaw-usecases/blob/main/usecases/self-healing-home-server.md"}],
    "verified": true,
    "featured": true
  },
  {
    "id": "autonomous-project-management",
    "name": "Autonomous Project Management",
    "category": "productivity",
    "description": "Coordinate multi-agent projects using the STATE.yaml pattern for transparent, resumable workflows.",
    "tools": ["OpenClaw", "Multi-Agent", "YAML"],
    "links": [{"text": "查看详情", "url": "https://github.com/hesamsheikh/awesome-openclaw-usecases/blob/main/usecases/autonomous-project-management.md"}],
    "verified": true,
    "featured": true
  },
  {
    "id": "multi-channel-customer-service",
    "name": "Multi-Channel AI Customer Service",
    "category": "productivity",
    "description": "Unify WhatsApp, Instagram, Email, and Google Reviews in one AI-powered inbox.",
    "tools": ["OpenClaw", "WhatsApp", "Instagram", "Email"],
    "links": [{"text": "查看详情", "url": "https://github.com/hesamsheikh/awesome-openclaw-usecases/blob/main/usecases/multi-channel-customer-service.md"}],
    "verified": true,
    "featured": true
  },
  {
    "id": "phone-based-personal-assistant",
    "name": "Phone-Based Personal Assistant",
    "category": "productivity",
    "description": "Access your AI agent via phone calls for hands-free assistance anywhere, anytime.",
    "tools": ["OpenClaw", "Twilio", "Phone API"],
    "links": [{"text": "查看详情", "url": "https://github.com/hesamsheikh/awesome-openclaw-usecases/blob/main/usecases/phone-based-personal-assistant.md"}],
    "verified": true,
    "featured": false
  },
  {
    "id": "inbox-declutter",
    "name": "Inbox De-clutter",
    "category": "productivity",
    "description": "Summarize newsletters and send clean digests via email. Cut through inbox noise automatically.",
    "tools": ["OpenClaw", "Email", "Gmail"],
    "links": [{"text": "查看详情", "url": "https://github.com/hesamsheikh/awesome-openclaw-usecases/blob/main/usecases/inbox-declutter.md"}],
    "verified": true,
    "featured": false
  },
  {
    "id": "personal-crm",
    "name": "Personal CRM",
    "category": "productivity",
    "description": "Automatically discover and track contacts from your email and calendar. Never lose touch.",
    "tools": ["OpenClaw", "Gmail", "Google Calendar"],
    "links": [{"text": "查看详情", "url": "https://github.com/hesamsheikh/awesome-openclaw-usecases/blob/main/usecases/personal-crm.md"}],
    "verified": true,
    "featured": false
  },
  {
    "id": "health-symptom-tracker",
    "name": "Health & Symptom Tracker",
    "category": "productivity",
    "description": "Track food intake and symptoms to identify triggers and patterns in your health.",
    "tools": ["OpenClaw", "Notion", "Telegram"],
    "links": [{"text": "查看详情", "url": "https://github.com/hesamsheikh/awesome-openclaw-usecases/blob/main/usecases/health-symptom-tracker.md"}],
    "verified": true,
    "featured": false
  },
  {
    "id": "multi-channel-assistant",
    "name": "Multi-Channel Personal Assistant",
    "category": "productivity",
    "description": "Route tasks across Telegram, Slack, email, and calendar from a single AI assistant.",
    "tools": ["OpenClaw", "Telegram", "Slack", "Email"],
    "links": [{"text": "查看详情", "url": "https://github.com/hesamsheikh/awesome-openclaw-usecases/blob/main/usecases/multi-channel-assistant.md"}],
    "verified": true,
    "featured": false
  },
  {
    "id": "project-state-management",
    "name": "Project State Management",
    "category": "productivity",
    "description": "Event-driven project tracking with automatic context capture for seamless handoffs.",
    "tools": ["OpenClaw", "YAML", "Git"],
    "links": [{"text": "查看详情", "url": "https://github.com/hesamsheikh/awesome-openclaw-usecases/blob/main/usecases/project-state-management.md"}],
    "verified": true,
    "featured": false
  },
  {
    "id": "dynamic-dashboard",
    "name": "Dynamic Dashboard",
    "category": "productivity",
    "description": "Real-time dashboard with parallel data fetching from multiple APIs and databases.",
    "tools": ["OpenClaw", "APIs", "Database"],
    "links": [{"text": "查看详情", "url": "https://github.com/hesamsheikh/awesome-openclaw-usecases/blob/main/usecases/dynamic-dashboard.md"}],
    "verified": true,
    "featured": false
  },
  {
    "id": "todoist-task-manager",
    "name": "Todoist Task Manager",
    "category": "productivity",
    "description": "Sync reasoning and progress logs to Todoist for full transparency on agent work.",
    "tools": ["OpenClaw", "Todoist"],
    "links": [{"text": "查看详情", "url": "https://github.com/hesamsheikh/awesome-openclaw-usecases/blob/main/usecases/todoist-task-manager.md"}],
    "verified": true,
    "featured": false
  },
  {
    "id": "family-calendar-household",
    "name": "Family Calendar & Household Assistant",
    "category": "productivity",
    "description": "Aggregate family calendars into a morning briefing and manage household inventory automatically.",
    "tools": ["OpenClaw", "Google Calendar", "Telegram"],
    "links": [{"text": "查看详情", "url": "https://github.com/hesamsheikh/awesome-openclaw-usecases/blob/main/usecases/family-calendar-household-assistant.md"}],
    "verified": true,
    "featured": false
  },
  {
    "id": "multi-agent-team",
    "name": "Multi-Agent Specialized Team",
    "category": "productivity",
    "description": "Run a coordinated team of strategy, dev, marketing, and business agents working together.",
    "tools": ["OpenClaw", "Multi-Agent"],
    "links": [{"text": "查看详情", "url": "https://github.com/hesamsheikh/awesome-openclaw-usecases/blob/main/usecases/multi-agent-team.md"}],
    "verified": true,
    "featured": false
  },
  {
    "id": "desktop-cowork",
    "name": "OpenClaw as Desktop Cowork",
    "category": "productivity",
    "description": "Desktop app with unified UI, multi-agent support, and remote repair via Telegram.",
    "tools": ["OpenClaw", "Electron", "Telegram"],
    "links": [{"text": "查看详情", "url": "https://github.com/hesamsheikh/awesome-openclaw-usecases/blob/main/usecases/aionui-cowork-desktop.md"}],
    "verified": true,
    "featured": false
  },
  {
    "id": "custom-morning-brief",
    "name": "Custom Morning Brief",
    "category": "productivity",
    "description": "Fully customized daily briefing with news, tasks, weather, and AI recommendations.",
    "tools": ["OpenClaw", "Email", "APIs"],
    "links": [{"text": "查看详情", "url": "https://github.com/hesamsheikh/awesome-openclaw-usecases/blob/main/usecases/custom-morning-brief.md"}],
    "verified": true,
    "featured": false
  },
  {
    "id": "meeting-notes-action-items",
    "name": "Automated Meeting Notes & Action Items",
    "category": "productivity",
    "description": "Turn meeting transcripts into summaries and automatically create tasks in Jira, Linear, or Todoist.",
    "tools": ["OpenClaw", "Jira", "Linear", "Todoist"],
    "links": [{"text": "查看详情", "url": "https://github.com/hesamsheikh/awesome-openclaw-usecases/blob/main/usecases/meeting-notes-action-items.md"}],
    "verified": true,
    "featured": false
  },
  {
    "id": "habit-tracker",
    "name": "Habit Tracker & Accountability Coach",
    "category": "productivity",
    "description": "Proactive daily check-ins via Telegram or SMS to keep you on track with your habits.",
    "tools": ["OpenClaw", "Telegram", "Twilio"],
    "links": [{"text": "查看详情", "url": "https://github.com/hesamsheikh/awesome-openclaw-usecases/blob/main/usecases/habit-tracker-accountability-coach.md"}],
    "verified": true,
    "featured": false
  },
  {
    "id": "second-brain",
    "name": "Second Brain",
    "category": "productivity",
    "description": "Text anything to remember it, then search your memories in a custom Next.js dashboard.",
    "tools": ["OpenClaw", "Next.js", "Vector DB"],
    "links": [{"text": "查看详情", "url": "https://github.com/hesamsheikh/awesome-openclaw-usecases/blob/main/usecases/second-brain.md"}],
    "verified": true,
    "featured": false
  },
  {
    "id": "event-guest-confirmation",
    "name": "Event Guest Confirmation",
    "category": "productivity",
    "description": "Call guests one-by-one to confirm attendance and compile a summary report automatically.",
    "tools": ["OpenClaw", "Twilio", "Phone API"],
    "links": [{"text": "查看详情", "url": "https://github.com/hesamsheikh/awesome-openclaw-usecases/blob/main/usecases/event-guest-confirmation.md"}],
    "verified": true,
    "featured": false
  },
  {
    "id": "phone-call-notifications",
    "name": "Phone Call Notifications",
    "category": "productivity",
    "description": "Turn agent alerts into real phone calls with two-way conversation capability.",
    "tools": ["OpenClaw", "Twilio"],
    "links": [{"text": "查看详情", "url": "https://github.com/hesamsheikh/awesome-openclaw-usecases/blob/main/usecases/phone-call-notifications.md"}],
    "verified": true,
    "featured": false
  },
  {
    "id": "local-crm-framework",
    "name": "Local CRM Framework",
    "category": "productivity",
    "description": "Fully local CRM and sales automation with DuckDB and browser automation. No cloud required.",
    "tools": ["OpenClaw", "DuckDB", "Browser Automation"],
    "links": [{"text": "查看详情", "url": "https://github.com/hesamsheikh/awesome-openclaw-usecases/blob/main/usecases/local-crm-framework.md"}],
    "verified": true,
    "featured": false
  },
  {
    "id": "earnings-tracker",
    "name": "AI Earnings Tracker",
    "category": "research-learning",
    "description": "Track tech and AI earnings reports with automated previews and alerts before market open.",
    "tools": ["OpenClaw", "Financial APIs", "Email"],
    "links": [{"text": "查看详情", "url": "https://github.com/hesamsheikh/awesome-openclaw-usecases/blob/main/usecases/earnings-tracker.md"}],
    "verified": true,
    "featured": true
  },
  {
    "id": "knowledge-base-rag",
    "name": "Personal Knowledge Base (RAG)",
    "category": "research-learning",
    "description": "Build a searchable knowledge base from URLs, tweets, and articles using RAG technology.",
    "tools": ["OpenClaw", "Vector DB", "RAG"],
    "links": [{"text": "查看详情", "url": "https://github.com/hesamsheikh/awesome-openclaw-usecases/blob/main/usecases/knowledge-base-rag.md"}],
    "verified": true,
    "featured": true
  },
  {
    "id": "market-research-product-factory",
    "name": "Market Research & Product Factory",
    "category": "research-learning",
    "description": "Mine Reddit and X for pain points, then automatically build MVPs to solve them.",
    "tools": ["OpenClaw", "Reddit API", "X API"],
    "links": [{"text": "查看详情", "url": "https://github.com/hesamsheikh/awesome-openclaw-usecases/blob/main/usecases/market-research-product-factory.md"}],
    "verified": true,
    "featured": false
  },
  {
    "id": "pre-build-idea-validator",
    "name": "Pre-Build Idea Validator",
    "category": "research-learning",
    "description": "Scan GitHub, HN, npm, PyPI, and Product Hunt before building to validate your idea.",
    "tools": ["OpenClaw", "GitHub API", "HN API"],
    "links": [{"text": "查看详情", "url": "https://github.com/hesamsheikh/awesome-openclaw-usecases/blob/main/usecases/pre-build-idea-validator.md"}],
    "verified": true,
    "featured": false
  },
  {
    "id": "semantic-memory-search",
    "name": "Semantic Memory Search",
    "category": "research-learning",
    "description": "Vector-powered semantic search with hybrid retrieval and auto-sync across your knowledge.",
    "tools": ["OpenClaw", "Vector DB", "Embeddings"],
    "links": [{"text": "查看详情", "url": "https://github.com/hesamsheikh/awesome-openclaw-usecases/blob/main/usecases/semantic-memory-search.md"}],
    "verified": true,
    "featured": false
  },
  {
    "id": "arxiv-paper-reader",
    "name": "arXiv Paper Reader",
    "category": "research-learning",
    "description": "Read and analyze arXiv papers conversationally with automatic summaries and key insights.",
    "tools": ["OpenClaw", "arXiv API"],
    "links": [{"text": "查看详情", "url": "https://github.com/hesamsheikh/awesome-openclaw-usecases/blob/main/usecases/arxiv-paper-reader.md"}],
    "verified": true,
    "featured": false
  },
  {
    "id": "latex-paper-writing",
    "name": "LaTeX Paper Writing",
    "category": "research-learning",
    "description": "Write and compile LaTeX papers with instant PDF preview and AI-assisted editing.",
    "tools": ["OpenClaw", "LaTeX", "PDF"],
    "links": [{"text": "查看详情", "url": "https://github.com/hesamsheikh/awesome-openclaw-usecases/blob/main/usecases/latex-paper-writing.md"}],
    "verified": true,
    "featured": false
  },
  {
    "id": "polymarket-autopilot",
    "name": "Polymarket Autopilot",
    "category": "finance-trading",
    "description": "Automated paper trading on prediction markets with backtesting capabilities.",
    "tools": ["OpenClaw", "Polymarket API"],
    "links": [{"text": "查看详情", "url": "https://github.com/hesamsheikh/awesome-openclaw-usecases/blob/main/usecases/polymarket-autopilot.md"}],
    "verified": true,
    "featured": true
  }
]
```

- [ ] **Step 2: 验证 JSON 格式和数量**

```bash
python3 -c "
import json
data = json.load(open('/Users/tina/Downloads/tinaproject/data/cases.json'))
cats = {}
for c in data:
    cats[c['category']] = cats.get(c['category'], 0) + 1
print(f'Total: {len(data)} cases')
for k,v in sorted(cats.items()):
    print(f'  {k}: {v}')
"
```

期望输出：
```
Total: 40 cases
  creative-building: 5
  finance-trading: 1
  infrastructure-devops: 2
  productivity: 20
  research-learning: 7
  social-media: 5
```

- [ ] **Step 3: Commit**

```bash
git add data/cases.json
git commit -m "feat: add all 40 use cases data"
```

---

## Chunk 2: CSS 样式层

### Task 3: 创建 CSS 基础变量与 Reset

**Files:**
- Create: `css/reset.css`

- [ ] **Step 1: 创建 css 目录和 reset.css**

```bash
mkdir -p /Users/tina/Downloads/tinaproject/css
```

内容写入 `css/reset.css`：

```css
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  /* 背景色 */
  --color-bg: #FFFFFF;
  --color-bg-secondary: #F5F5F7;
  --color-border: #D2D2D7;

  /* 文字色 */
  --color-text-primary: #1D1D1F;
  --color-text-secondary: #6E6E73;
  --color-text-tertiary: #86868B;

  /* 点缀色 */
  --color-accent: #0071E3;
  --color-accent-hover: #0077ED;

  /* 类别渐变色 */
  --color-social-start: #FF3B30;
  --color-social-end: #FF6B6B;
  --color-creative-start: #FF9500;
  --color-creative-end: #FFB84D;
  --color-infra-start: #34C759;
  --color-infra-end: #5DD57D;
  --color-productivity-start: #007AFF;
  --color-productivity-end: #4DA3FF;
  --color-research-start: #5856D6;
  --color-research-end: #8B89E6;
  --color-finance-start: #FFD60A;
  --color-finance-end: #FFE04D;

  /* 字体 */
  --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC",
    "Hiragino Sans GB", "Microsoft YaHei", sans-serif;

  /* 间距 */
  --space-xs: 8px;
  --space-sm: 16px;
  --space-md: 24px;
  --space-lg: 40px;
  --space-xl: 80px;
  --space-2xl: 120px;

  /* 圆角 */
  --radius-card: 18px;
  --radius-btn: 12px;
  --radius-sm: 8px;

  /* 阴影 */
  --shadow-card: 0 2px 8px rgba(0, 0, 0, 0.04);
  --shadow-card-hover: 0 8px 24px rgba(0, 0, 0, 0.12);
  --shadow-nav: 0 1px 0 rgba(0, 0, 0, 0.08);

  /* 动画 */
  --transition-fast: 0.2s ease;
  --transition-card: 0.3s ease;
  --transition-expand: 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

html {
  scroll-behavior: smooth;
  -webkit-text-size-adjust: 100%;
}

body {
  font-family: var(--font-family);
  background-color: var(--color-bg);
  color: var(--color-text-primary);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

a {
  color: var(--color-accent);
  text-decoration: none;
}

a:hover {
  color: var(--color-accent-hover);
}

button {
  font-family: var(--font-family);
  cursor: pointer;
  border: none;
  background: none;
}

img {
  max-width: 100%;
  display: block;
}

ul, ol {
  list-style: none;
}
```

- [ ] **Step 2: 验证文件存在**

```bash
ls -la /Users/tina/Downloads/tinaproject/css/reset.css
```

期望输出：文件存在，大小 > 0

- [ ] **Step 3: Commit**

```bash
git add css/reset.css
git commit -m "feat: add CSS reset and design tokens"
```

---

### Task 4: 创建布局样式

**Files:**
- Create: `css/layout.css`

- [ ] **Step 1: 写入 layout.css**

内容写入 `css/layout.css`：

```css
/* ===== 导航栏 ===== */
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 52px;
  background: rgba(255, 255, 255, 0.8);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  backdrop-filter: saturate(180%) blur(20px);
  border-bottom: 1px solid var(--color-border);
  box-shadow: var(--shadow-nav);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
}

.nav__logo {
  font-size: 17px;
  font-weight: 600;
  color: var(--color-text-primary);
  white-space: nowrap;
}

.nav__links {
  display: flex;
  gap: 4px;
  align-items: center;
}

.nav__link {
  font-size: 14px;
  color: var(--color-text-secondary);
  padding: 6px 12px;
  border-radius: var(--radius-sm);
  transition: color var(--transition-fast), background var(--transition-fast);
  white-space: nowrap;
}

.nav__link:hover {
  color: var(--color-text-primary);
  background: var(--color-bg-secondary);
}

.nav__link.is-active {
  color: var(--color-accent);
  font-weight: 500;
}

/* 汉堡菜单（移动端） */
.nav__hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  padding: 8px;
  cursor: pointer;
}

.nav__hamburger span {
  display: block;
  width: 22px;
  height: 2px;
  background: var(--color-text-primary);
  border-radius: 2px;
  transition: transform var(--transition-fast), opacity var(--transition-fast);
}

/* ===== Hero 区 ===== */
.hero {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 52px 24px 0;
  background: var(--color-bg);
}

.hero__title {
  font-size: 64px;
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.5px;
  color: var(--color-text-primary);
  margin-bottom: 24px;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.8s ease forwards;
}

.hero__stats {
  font-size: 21px;
  color: var(--color-text-secondary);
  line-height: 1.4;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.8s ease 0.3s forwards;
}

.hero__scroll-hint {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  color: var(--color-text-tertiary);
  font-size: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  opacity: 0;
  animation: fadeInUp 0.8s ease 0.6s forwards;
}

.hero__scroll-hint::after {
  content: '';
  display: block;
  width: 1px;
  height: 40px;
  background: var(--color-border);
  animation: scrollPulse 2s ease-in-out infinite;
}

/* ===== 主内容区 ===== */
.main {
  padding-top: 0;
}

/* ===== 类别区域 ===== */
.category {
  padding: var(--space-2xl) 0;
  border-top: 1px solid var(--color-border);
}

.category:first-child {
  border-top: none;
}

.category__inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.category__header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: var(--space-xl);
}

.category__title {
  font-size: 48px;
  font-weight: 700;
  line-height: 1.2;
  color: var(--color-text-primary);
}

.category__count {
  font-size: 17px;
  color: var(--color-text-tertiary);
}

.category__description {
  font-size: 17px;
  color: var(--color-text-secondary);
  margin-top: 8px;
  margin-bottom: var(--space-xl);
}

/* ===== 卡片网格 ===== */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-lg);
}

/* ===== 展开按钮 ===== */
.expand-btn {
  display: block;
  margin: var(--space-xl) auto 0;
  padding: 12px 32px;
  font-size: 17px;
  color: var(--color-accent);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-btn);
  background: transparent;
  transition: background var(--transition-fast), border-color var(--transition-fast);
}

.expand-btn:hover {
  background: var(--color-bg-secondary);
  border-color: var(--color-accent);
}

.expand-btn.is-hidden {
  display: none;
}

/* ===== Footer ===== */
.footer {
  padding: var(--space-xl) 24px;
  text-align: center;
  border-top: 1px solid var(--color-border);
  color: var(--color-text-tertiary);
  font-size: 14px;
}

.footer a {
  color: var(--color-text-tertiary);
}

.footer a:hover {
  color: var(--color-accent);
}

/* ===== 动画 ===== */
@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scrollPulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}
```

- [ ] **Step 2: 验证文件存在**

```bash
ls -la /Users/tina/Downloads/tinaproject/css/layout.css
```

期望输出：文件存在，大小 > 0

- [ ] **Step 3: Commit**

```bash
git add css/layout.css
git commit -m "feat: add layout CSS (nav, hero, category, grid)"
```

---

### Task 5: 创建卡片样式

**Files:**
- Create: `css/card.css`

- [ ] **Step 1: 写入 card.css**

内容写入 `css/card.css`：

```css
/* ===== 案例卡片 ===== */
.case-card {
  position: relative;
  border-radius: var(--radius-card);
  overflow: hidden;
  cursor: pointer;
  box-shadow: var(--shadow-card);
  transition: transform var(--transition-card), box-shadow var(--transition-card);
  background: var(--color-bg-secondary);
}

.case-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-card-hover);
}

.case-card:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

/* 卡片封面（渐变色块） */
.case-card__cover {
  position: relative;
  height: 280px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: var(--space-md);
  overflow: hidden;
}

/* 首字母装饰 */
.case-card__initial {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -60%);
  font-size: 200px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.25);
  line-height: 1;
  pointer-events: none;
  user-select: none;
  letter-spacing: -4px;
}

/* 卡片标题 */
.case-card__name {
  position: relative;
  font-size: 28px;
  font-weight: 700;
  color: #FFFFFF;
  line-height: 1.3;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  z-index: 1;
}

/* 展开详情区域 */
.case-card__details {
  max-height: 0;
  overflow: hidden;
  transition: max-height var(--transition-expand);
  background: var(--color-bg);
}

.case-card.is-expanded .case-card__details {
  max-height: 600px;
}

.case-card__details-inner {
  padding: var(--space-md);
  opacity: 0;
  transform: translateY(8px);
  transition: opacity var(--transition-fast) 0.15s,
              transform var(--transition-fast) 0.15s;
}

.case-card.is-expanded .case-card__details-inner {
  opacity: 1;
  transform: translateY(0);
}

/* 详情内容 */
.case-card__description {
  font-size: 15px;
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin-bottom: var(--space-md);
}

.case-card__section-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

/* 工具标签 */
.case-card__tools {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: var(--space-md);
}

.case-card__tool-tag {
  font-size: 13px;
  color: var(--color-text-secondary);
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: 20px;
  padding: 4px 12px;
}

/* 链接区域 */
.case-card__links {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: var(--space-md);
}

.case-card__link {
  font-size: 14px;
  color: var(--color-accent);
  border: 1px solid var(--color-accent);
  border-radius: var(--radius-btn);
  padding: 6px 16px;
  transition: background var(--transition-fast), color var(--transition-fast);
}

.case-card__link:hover {
  background: var(--color-accent);
  color: #FFFFFF;
}

/* 收起按钮 */
.case-card__collapse-btn {
  display: block;
  width: 100%;
  padding: 10px;
  font-size: 14px;
  color: var(--color-text-tertiary);
  text-align: center;
  border-top: 1px solid var(--color-border);
  transition: color var(--transition-fast), background var(--transition-fast);
}

.case-card__collapse-btn:hover {
  color: var(--color-text-primary);
  background: var(--color-bg-secondary);
}

/* 已验证徽章 */
.case-card__verified {
  position: absolute;
  top: 12px;
  right: 12px;
  font-size: 11px;
  background: rgba(255, 255, 255, 0.9);
  color: #34C759;
  border-radius: 20px;
  padding: 3px 8px;
  font-weight: 600;
  z-index: 1;
}
```

- [ ] **Step 2: 验证文件存在**

```bash
ls -la /Users/tina/Downloads/tinaproject/css/card.css
```

期望输出：文件存在，大小 > 0

- [ ] **Step 3: Commit**

```bash
git add css/card.css
git commit -m "feat: add case card CSS with expand/collapse animation"
```

---

### Task 6: 创建响应式样式

**Files:**
- Create: `css/responsive.css`

- [ ] **Step 1: 写入 responsive.css**

内容写入 `css/responsive.css`：

```css
/* ===== 平板端（768px - 1023px） ===== */
@media (max-width: 1023px) {
  .hero__title {
    font-size: 48px;
  }

  .category__title {
    font-size: 36px;
  }

  .cards-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-md);
  }

  .nav__links {
    gap: 2px;
  }

  .nav__link {
    font-size: 13px;
    padding: 6px 8px;
  }
}

/* ===== 移动端（< 768px） ===== */
@media (max-width: 767px) {
  .hero__title {
    font-size: 36px;
    letter-spacing: -0.3px;
  }

  .hero__stats {
    font-size: 17px;
  }

  .category {
    padding: var(--space-xl) 0;
  }

  .category__title {
    font-size: 28px;
  }

  .category__header {
    flex-direction: column;
    gap: 4px;
    margin-bottom: var(--space-lg);
  }

  .cards-grid {
    grid-template-columns: 1fr;
    gap: var(--space-md);
  }

  .case-card:hover {
    transform: none;
  }

  /* 移动端导航 */
  .nav__links {
    display: none;
    position: fixed;
    top: 52px;
    left: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.97);
    -webkit-backdrop-filter: blur(20px);
    backdrop-filter: blur(20px);
    flex-direction: column;
    padding: 16px;
    border-bottom: 1px solid var(--color-border);
    gap: 4px;
  }

  .nav__links.is-open {
    display: flex;
  }

  .nav__link {
    font-size: 17px;
    padding: 12px 16px;
    border-radius: var(--radius-sm);
  }

  .nav__hamburger {
    display: flex;
  }

  .nav__hamburger.is-open span:nth-child(1) {
    transform: translateY(7px) rotate(45deg);
  }

  .nav__hamburger.is-open span:nth-child(2) {
    opacity: 0;
  }

  .nav__hamburger.is-open span:nth-child(3) {
    transform: translateY(-7px) rotate(-45deg);
  }

  .expand-btn {
    width: 100%;
    max-width: 320px;
  }
}


/* ===== 减少动画（无障碍） ===== */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  html {
    scroll-behavior: auto;
  }
}

/* ===== 大屏（> 1400px） ===== */
@media (min-width: 1400px) {
  .category__inner {
    max-width: 1400px;
  }

  .cards-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

- [ ] **Step 2: 验证文件存在**

```bash
ls -la /Users/tina/Downloads/tinaproject/css/responsive.css
```

期望输出：文件存在，大小 > 0

- [ ] **Step 3: Commit**

```bash
git add css/responsive.css
git commit -m "feat: add responsive CSS for tablet and mobile"
```

---

## Chunk 3: JavaScript 逻辑层

### Task 7: 创建数据加载模块

**Files:**
- Create: `js/data.js`

- [ ] **Step 1: 写入 js/data.js**

```bash
mkdir -p /Users/tina/Downloads/tinaproject/js
```

内容写入 `js/data.js`：

```javascript
/**
 * data.js — 数据加载与解析
 * 职责：fetch JSON 文件，返回结构化数据，处理错误
 */

const BASE_URL = '';  // 相对路径，适配 Vercel 部署

/**
 * 加载并返回 { categories, cases } 数据
 * @returns {Promise<{categories: Array, casesByCategory: Object}>}
 */
async function loadData() {
  try {
    const [categoriesRes, casesRes] = await Promise.all([
      fetch(`${BASE_URL}/data/categories.json`),
      fetch(`${BASE_URL}/data/cases.json`)
    ]);

    if (!categoriesRes.ok) throw new Error(`categories.json: ${categoriesRes.status}`);
    if (!casesRes.ok) throw new Error(`cases.json: ${casesRes.status}`);

    const categories = await categoriesRes.json();
    const cases = await casesRes.json();

    // 按类别分组
    const casesByCategory = {};
    for (const cat of categories) {
      casesByCategory[cat.id] = cases.filter(c => c.category === cat.id);
    }

    return { categories, casesByCategory };
  } catch (err) {
    console.error('[data.js] 加载失败:', err);
    throw err;
  }
}

export { loadData };
```

- [ ] **Step 2: 验证文件存在**

```bash
ls -la /Users/tina/Downloads/tinaproject/js/data.js
```

期望输出：文件存在，大小 > 0

- [ ] **Step 3: Commit**

```bash
git add js/data.js
git commit -m "feat: add data loading module"
```

---

### Task 8: 创建 DOM 渲染模块

**Files:**
- Create: `js/render.js`

- [ ] **Step 1: 写入 js/render.js**

内容写入 `js/render.js`：

```javascript
/**
 * render.js — DOM 渲染
 * 职责：根据数据生成 HTML 结构，插入 DOM
 */

const INITIAL_VISIBLE = 4;  // 每个类别初始显示的卡片数

/**
 * 渲染导航栏类别链接
 */
function renderNavLinks(categories) {
  const container = document.querySelector('.nav__links');
  if (!container) return;

  container.innerHTML = categories.map(cat => `
    <a href="#${cat.id}" class="nav__link" data-category="${cat.id}">
      ${cat.name}
    </a>
  `).join('');
}

/**
 * 渲染所有类别区域
 */
function renderCategories(categories, casesByCategory) {
  const main = document.querySelector('.main');
  if (!main) return;

  main.innerHTML = categories.map(cat => {
    const cases = casesByCategory[cat.id] || [];
    const visibleCases = cases.slice(0, INITIAL_VISIBLE);
    const hiddenCases = cases.slice(INITIAL_VISIBLE);
    const hasMore = hiddenCases.length > 0;

    return `
      <section class="category" id="${cat.id}" aria-labelledby="title-${cat.id}">
        <div class="category__inner">
          <div class="category__header">
            <div>
              <h2 class="category__title" id="title-${cat.id}" tabindex="-1">
                ${cat.icon} ${cat.name}
              </h2>
              <p class="category__description">${cat.description}</p>
            </div>
            <span class="category__count">${cases.length} 个案例</span>
          </div>

          <div class="cards-grid" id="grid-${cat.id}">
            ${visibleCases.map(c => renderCard(c, cat)).join('')}
            ${hiddenCases.map(c => renderCard(c, cat, true)).join('')}
          </div>

          ${hasMore ? `
            <button
              class="expand-btn"
              data-category="${cat.id}"
              data-hidden="${hiddenCases.length}"
              aria-expanded="false"
              aria-controls="grid-${cat.id}">
              显示全部 ${cases.length} 个案例
            </button>
          ` : ''}
        </div>
      </section>
    `;
  }).join('');
}

/**
 * 渲染单个案例卡片
 */
function renderCard(caseData, category, hidden = false) {
  const initial = caseData.name.charAt(0).toUpperCase();
  const gradient = `linear-gradient(135deg, ${category.colorStart}, ${category.colorEnd})`;
  const tools = (caseData.tools || []).map(t =>
    `<span class="case-card__tool-tag">${t}</span>`
  ).join('');
  const links = (caseData.links || []).map(l =>
    `<a href="${l.url}" class="case-card__link" target="_blank" rel="noopener noreferrer">${l.text} →</a>`
  ).join('');

  return `
    <article
      class="case-card${hidden ? ' is-hidden-card' : ''}"
      id="case-${caseData.id}"
      role="button"
      tabindex="0"
      aria-expanded="false"
      aria-label="${caseData.name}"
      data-id="${caseData.id}"
      ${hidden ? 'style="display:none"' : ''}>

      <div class="case-card__cover" style="background: ${gradient}">
        <span class="case-card__initial" aria-hidden="true">${initial}</span>
        ${caseData.verified ? '<span class="case-card__verified">✓ 已验证</span>' : ''}
        <h3 class="case-card__name">${caseData.name}</h3>
      </div>

      <div class="case-card__details" aria-hidden="true">
        <div class="case-card__details-inner">
          <p class="case-card__description">${caseData.description}</p>

          ${tools ? `
            <p class="case-card__section-label">使用工具</p>
            <div class="case-card__tools">${tools}</div>
          ` : ''}

          ${links ? `
            <p class="case-card__section-label">相关链接</p>
            <div class="case-card__links">${links}</div>
          ` : ''}

          <button class="case-card__collapse-btn" aria-label="收起 ${caseData.name}">
            收起 ↑
          </button>
        </div>
      </div>
    </article>
  `;
}

/**
 * 显示错误状态
 */
function renderError() {
  const main = document.querySelector('.main');
  if (!main) return;
  main.innerHTML = `
    <div style="text-align:center; padding: 120px 24px; color: var(--color-text-secondary);">
      <p style="font-size:48px; margin-bottom:16px;">⚠️</p>
      <p style="font-size:21px; margin-bottom:24px;">加载失败，请刷新页面重试</p>
      <button onclick="location.reload()" style="
        padding: 12px 32px;
        font-size: 17px;
        color: var(--color-accent);
        border: 1px solid var(--color-accent);
        border-radius: var(--radius-btn);
        background: transparent;
        cursor: pointer;
        font-family: var(--font-family);
      ">重试</button>
    </div>
  `;
}

export { renderNavLinks, renderCategories, renderError, INITIAL_VISIBLE };
```

- [ ] **Step 2: 验证文件存在**

```bash
ls -la /Users/tina/Downloads/tinaproject/js/render.js
```

期望输出：文件存在，大小 > 0

- [ ] **Step 3: Commit**

```bash
git add js/render.js
git commit -m "feat: add DOM render module"
```

---

### Task 9: 创建交互逻辑模块

**Files:**
- Create: `js/interactions.js`

- [ ] **Step 1: 写入 js/interactions.js**

内容写入 `js/interactions.js`：

```javascript
/**
 * interactions.js — 交互逻辑
 * 职责：卡片展开/收起、导航高亮、汉堡菜单
 */

/**
 * 初始化卡片展开/收起交互
 */
function initCardInteractions() {
  const main = document.querySelector('.main');
  if (!main) return;

  // 事件委托：监听整个 main 区域的点击
  main.addEventListener('click', (e) => {
    // 点击收起按钮
    const collapseBtn = e.target.closest('.case-card__collapse-btn');
    if (collapseBtn) {
      e.stopPropagation();
      const card = collapseBtn.closest('.case-card');
      collapseCard(card);
      return;
    }

    // 点击外部链接，不触发展开
    if (e.target.closest('.case-card__link')) return;

    // 点击卡片本体
    const card = e.target.closest('.case-card');
    if (!card) return;

    if (card.classList.contains('is-expanded')) {
      collapseCard(card);
    } else {
      expandCard(card);
    }
  });

  // 键盘支持
  main.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    // 如果焦点在收起按钮上，不重复触发
    if (e.target.closest('.case-card__collapse-btn')) return;
    const card = e.target.closest('.case-card');
    if (!card) return;
    e.preventDefault();
    if (card.classList.contains('is-expanded')) {
      collapseCard(card);
    } else {
      expandCard(card);
    }
  });

  // ESC 键收起所有展开的卡片
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    document.querySelectorAll('.case-card.is-expanded').forEach(collapseCard);
  });
}

function expandCard(card) {
  card.classList.add('is-expanded');
  card.setAttribute('aria-expanded', 'true');
  const details = card.querySelector('.case-card__details');
  if (details) details.setAttribute('aria-hidden', 'false');

  // 确保卡片在视口内可见（延迟等待动画开始）
  setTimeout(() => {
    const rect = card.getBoundingClientRect();
    const navHeight = 52;
    if (rect.bottom > window.innerHeight) {
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, 100);
}

function collapseCard(card) {
  card.classList.remove('is-expanded');
  card.setAttribute('aria-expanded', 'false');
  const details = card.querySelector('.case-card__details');
  if (details) details.setAttribute('aria-hidden', 'true');
}

/**
 * 初始化展开按钮（显示更多案例）
 */
function initExpandButtons() {
  const main = document.querySelector('.main');
  if (!main) return;

  main.addEventListener('click', (e) => {
    const btn = e.target.closest('.expand-btn');
    if (!btn) return;

    const categoryId = btn.dataset.category;
    const grid = document.getElementById(`grid-${categoryId}`);
    if (!grid) return;

    const isExpanded = btn.dataset.expanded === 'true';

    if (!isExpanded) {
      // 展开：显示所有隐藏的卡片
      grid.querySelectorAll('.is-hidden-card').forEach(card => {
        card.style.display = '';
      });
      btn.dataset.expanded = 'true';
      btn.setAttribute('aria-expanded', 'true');
      btn.textContent = '收起';
    } else {
      // 收起：重新隐藏超出初始数量的卡片
      const allCards = grid.querySelectorAll('.case-card');
      allCards.forEach((card, i) => {
        if (i >= 4) {
          card.style.display = 'none';
          card.classList.add('is-hidden-card');
          // 同时收起已展开的详情
          if (card.classList.contains('is-expanded')) {
            card.classList.remove('is-expanded');
            card.setAttribute('aria-expanded', 'false');
            const details = card.querySelector('.case-card__details');
            if (details) details.setAttribute('aria-hidden', 'true');
          }
        }
      });
      btn.dataset.expanded = 'false';
      btn.setAttribute('aria-expanded', 'false');
      const total = allCards.length;
      btn.textContent = `显示全部 ${total} 个案例`;
    }
  });
}

/**
 * 初始化导航栏滚动高亮
 */
function initNavHighlight() {
  const navLinks = document.querySelectorAll('.nav__link[data-category]');
  if (!navLinks.length) return;

  const sections = document.querySelectorAll('.category[id]');
  const navHeight = 52;

  // 节流处理
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    requestAnimationFrame(() => {
      updateActiveLink(sections, navLinks, navHeight);
      ticking = false;
    });
    ticking = true;
  }, { passive: true });

  // 初始化
  updateActiveLink(sections, navLinks, navHeight);
}

function updateActiveLink(sections, navLinks, navHeight) {
  let activeId = null;
  const scrollY = window.scrollY + navHeight + 60;

  sections.forEach(section => {
    if (section.offsetTop <= scrollY) {
      activeId = section.id;
    }
  });

  navLinks.forEach(link => {
    link.classList.toggle('is-active', link.dataset.category === activeId);
  });
}

/**
 * 初始化汉堡菜单（移动端）
 */
function initHamburgerMenu() {
  const hamburger = document.querySelector('.nav__hamburger');
  const navLinks = document.querySelector('.nav__links');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    hamburger.classList.toggle('is-open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  // 点击导航链接后关闭菜单
  navLinks.addEventListener('click', (e) => {
    if (e.target.closest('.nav__link')) {
      navLinks.classList.remove('is-open');
      hamburger.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
}

export { initCardInteractions, initExpandButtons, initNavHighlight, initHamburgerMenu };
```

- [ ] **Step 2: 验证文件存在**

```bash
ls -la /Users/tina/Downloads/tinaproject/js/interactions.js
```

期望输出：文件存在，大小 > 0

- [ ] **Step 3: Commit**

```bash
git add js/interactions.js
git commit -m "feat: add interaction module (card expand, nav highlight, hamburger)"
```

---

### Task 10: 创建主入口模块

**Files:**
- Create: `js/main.js`

- [ ] **Step 1: 写入 js/main.js**

内容写入 `js/main.js`：

```javascript
/**
 * main.js — 应用入口
 * 职责：组合各模块，初始化应用
 */

import { loadData } from './data.js';
import { renderNavLinks, renderCategories, renderError } from './render.js';
import { initCardInteractions, initExpandButtons, initNavHighlight, initHamburgerMenu } from './interactions.js';

async function init() {
  try {
    const { categories, casesByCategory } = await loadData();

    renderNavLinks(categories);
    renderCategories(categories, casesByCategory);

    initCardInteractions();
    initExpandButtons();
    initNavHighlight();
    initHamburgerMenu();
  } catch (err) {
    renderError();
  }
}

// DOM 就绪后启动
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
```

> **重要：** `index.html` 中必须使用 `<script type="module" src="js/main.js"></script>` 加载此文件，否则 ES module `import` 语法会报错。

- [ ] **Step 2: 验证文件存在**

```bash
ls -la /Users/tina/Downloads/tinaproject/js/main.js
```

期望输出：文件存在，大小 > 0

- [ ] **Step 3: Commit**

```bash
git add js/main.js
git commit -m "feat: add main entry module"
```

---

## Chunk 4: HTML 页面与最终集成

### Task 11: 创建 index.html

**Files:**
- Create: `index.html`

- [ ] **Step 1: 写入 index.html**

> **注意：** 类别区域和案例卡片的 HTML 结构由 `js/render.js` 动态生成，包括正确的 `id` 属性（如 `id="social-media"`）用于导航锚点跳转。

内容写入 `index.html`：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tina-OpenClaw 应用案例汇总 | 40+真实案例</title>
  <meta name="description" content="汇总展示 OpenClaw 的 40+ 个真实应用案例，涵盖社交媒体、生产力工具、研究学习等 6 大应用场景。">
  <meta name="keywords" content="OpenClaw, AI Agent, 应用案例, 自动化, 生产力工具">
  <meta name="author" content="Tina">

  <!-- Open Graph -->
  <meta property="og:title" content="Tina-OpenClaw 应用案例汇总">
  <meta property="og:description" content="40+真实 OpenClaw 应用案例，6大应用场景">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://your-domain.com/">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Tina-OpenClaw 应用案例汇总">
  <meta name="twitter:description" content="40+真实 OpenClaw 应用案例">

  <!-- Favicon -->
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🤖</text></svg>">

  <!-- CSS -->
  <link rel="stylesheet" href="css/reset.css">
  <link rel="stylesheet" href="css/layout.css">
  <link rel="stylesheet" href="css/card.css">
  <link rel="stylesheet" href="css/responsive.css">
</head>
<body>

  <!-- 导航栏 -->
  <nav class="nav" role="navigation" aria-label="类别导航">
    <div class="nav__logo">Tina-OpenClaw</div>
    <div class="nav__links">
      <!-- 动态生成 -->
    </div>
    <button class="nav__hamburger" aria-label="菜单" aria-expanded="false">
      <span></span>
      <span></span>
      <span></span>
    </button>
  </nav>

  <!-- Hero 区 -->
  <section class="hero">
    <h1 class="hero__title">Tina-OpenClaw<br>应用案例汇总</h1>
    <p class="hero__stats">40+真实案例 · 6大应用场景 · 持续更新</p>
    <div class="hero__scroll-hint" aria-hidden="true">向下滚动探索</div>
  </section>

  <!-- 主内容区 -->
  <main class="main">
    <!-- 动态生成类别区域 -->
  </main>

  <!-- 页脚 -->
  <footer class="footer">
    <div class="footer__inner">
      <p>© 2026 Tina-OpenClaw 应用案例汇总</p>
      <p>数据来源：<a href="https://github.com/hesamsheikh/awesome-openclaw-usecases" target="_blank" rel="noopener noreferrer">awesome-openclaw-usecases</a></p>
    </div>
  </footer>

  <!-- JavaScript (ES Module) -->
  <script type="module" src="js/main.js"></script>

</body>
</html>
```

- [ ] **Step 2: 验证 HTML 语法**

```bash
# 检查文件存在
ls -la /Users/tina/Downloads/tinaproject/index.html

# 简单验证：检查是否包含关键元素
grep -q '<script type="module"' /Users/tina/Downloads/tinaproject/index.html && echo "✓ ES module script tag found"
grep -q 'class="hero"' /Users/tina/Downloads/tinaproject/index.html && echo "✓ Hero section found"
grep -q 'class="main"' /Users/tina/Downloads/tinaproject/index.html && echo "✓ Main section found"
```

期望输出：3 个 ✓ 标记

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add main HTML page"
```

---

### Task 12: 添加页脚样式

**Files:**
- Modify: `css/layout.css` (追加页脚样式)

- [ ] **Step 1: 追加页脚样式到 layout.css**

```bash
cat >> /Users/tina/Downloads/tinaproject/css/layout.css << 'FOOTER_CSS'

/* ===== 页脚 ===== */
.footer {
  background: var(--color-bg-secondary);
  border-top: 1px solid var(--color-border);
  padding: var(--space-xl) 0;
  margin-top: var(--space-2xl);
}

.footer__inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  text-align: center;
  color: var(--color-text-secondary);
  font-size: 14px;
  line-height: 1.8;
}

.footer__inner p {
  margin: 4px 0;
}

.footer__inner a {
  color: var(--color-accent);
  text-decoration: underline;
}

.footer__inner a:hover {
  color: var(--color-accent-hover);
}
FOOTER_CSS
```

- [ ] **Step 2: 验证追加成功**

```bash
tail -20 /Users/tina/Downloads/tinaproject/css/layout.css | grep -q "\.footer" && echo "✓ Footer styles added"
```

期望输出：`✓ Footer styles added`

- [ ] **Step 3: Commit**

```bash
git add css/layout.css
git commit -m "feat: add footer styles"
```

---

### Task 13: 本地测试

**Files:**
- Test: 所有文件集成测试

- [ ] **Step 1: 启动本地服务器**

```bash
cd /Users/tina/Downloads/tinaproject
python3 -m http.server 8000
```

> 在浏览器打开 `http://localhost:8000`

- [ ] **Step 2: 手动测试清单**

测试项目：

1. **页面加载**
   - [ ] Hero 区标题和统计数据正确显示
   - [ ] 6 个类别区域全部渲染
   - [ ] 每个类别显示正确数量的案例卡片

2. **导航栏**
   - [ ] 固定在顶部，滚动时不消失
   - [ ] 点击类别链接，平滑滚动到对应区域
   - [ ] 当前浏览的类别高亮显示

3. **案例卡片**
   - [ ] 卡片显示渐变背景、首字母、案例名称
   - [ ] 悬停时卡片上浮并显示阴影
   - [ ] 点击卡片展开详情（描述、工具、链接）
   - [ ] 点击"收起"按钮关闭详情
   - [ ] 键盘 Tab 可聚焦卡片，Enter/Space 展开/收起

4. **展开按钮**
   - [ ] 案例数 > 4 的类别显示"显示全部 X 个案例"按钮
   - [ ] 点击按钮显示所有隐藏的卡片
   - [ ] 按钮文字变为"收起"
   - [ ] 再次点击，隐藏超出初始数量的卡片，按钮恢复原文字

5. **响应式**
   - [ ] 桌面端（> 1024px）：4 列卡片网格
   - [ ] 平板端（768-1023px）：2 列卡片网格
   - [ ] 移动端（< 768px）：1 列卡片网格，汉堡菜单显示

6. **无障碍访问**
   - [ ] Tab 键可以聚焦所有交互元素（导航链接、卡片、按钮）
   - [ ] 焦点环清晰可见
   - [ ] Enter/Space 键可以激活卡片展开/收起
   - [ ] ESC 键可以关闭已展开的卡片
   - [ ] 展开/收起时 aria-expanded 属性正确更新

7. **错误处理**
   - [ ] 如果 JSON 文件不存在，显示错误提示和重试按钮

- [ ] **Step 3: 停止服务器**

```bash
# 按 Ctrl+C 停止服务器
```

- [ ] **Step 4: 记录测试结果**

如果所有测试通过，继续下一步。如果有问题，记录并修复。

---

### Task 14: 创建 vercel.json 配置

**Files:**
- Create: `vercel.json`

- [ ] **Step 1: 写入 vercel.json**

内容写入 `vercel.json`：

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        }
      ]
    },
    {
      "source": "/data/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=3600, immutable"
        }
      ]
    },
    {
      "source": "/(css|js)/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

- [ ] **Step 2: 验证 JSON 格式**

```bash
python3 -c "import json; json.load(open('/Users/tina/Downloads/tinaproject/vercel.json')); print('✓ vercel.json valid')"
```

期望输出：`✓ vercel.json valid`

- [ ] **Step 3: Commit**

```bash
git add vercel.json
git commit -m "feat: add Vercel deployment config"
```

---

### Task 15: 最终验证与文档

**Files:**
- Create: `README.md`

- [ ] **Step 1: 写入 README.md**

内容写入 `README.md`：

```markdown
# Tina-OpenClaw 应用案例汇总

> 一个苹果官网风格的单页展示网站，汇总展示 40+ 个 OpenClaw 真实应用案例。

## 特性

- 🎨 极简白色系设计，参考 Apple 官网风格
- 📱 完全响应式，适配桌面/平板/手机
- ⚡ 纯静态页面，无构建工具，快速加载
- ♿ 无障碍访问支持（键盘导航、ARIA 标签、颜色对比度）
- 🚀 一键部署到 Vercel

## 项目结构

```
├── index.html          # 主页面
├── css/
│   ├── reset.css       # CSS reset + 设计变量
│   ├── layout.css      # 布局样式（导航、Hero、类别）
│   ├── card.css        # 案例卡片样式
│   └── responsive.css  # 响应式断点
├── js/
│   ├── data.js         # 数据加载
│   ├── render.js       # DOM 渲染
│   ├── interactions.js # 交互逻辑
│   └── main.js         # 入口
├── data/
│   ├── categories.json # 6 个类别定义
│   └── cases.json      # 40 个案例数据
└── vercel.json         # Vercel 部署配置
```

## 本地开发

```bash
# 启动本地服务器
python3 -m http.server 8000

# 访问 http://localhost:8000
```

## 部署到 Vercel

1. 将项目推送到 GitHub
2. 在 Vercel 导入项目
3. 自动部署完成

或使用 Vercel CLI：

```bash
npm i -g vercel
vercel
```

## 数据来源

案例数据来自 [awesome-openclaw-usecases](https://github.com/hesamsheikh/awesome-openclaw-usecases)

## 技术栈

- HTML5 语义化标签
- CSS3（Grid/Flexbox/自定义属性/动画）
- 原生 JavaScript（ES6+ Modules）
- 无框架，无构建工具

## License

MIT
```

- [ ] **Step 2: 验证所有文件存在**

```bash
cd /Users/tina/Downloads/tinaproject

# 检查关键文件
for file in index.html vercel.json README.md \
  css/reset.css css/layout.css css/card.css css/responsive.css \
  js/data.js js/render.js js/interactions.js js/main.js \
  data/categories.json data/cases.json; do
  if [ -f "$file" ]; then
    echo "✓ $file"
  else
    echo "✗ $file MISSING"
  fi
done
```

期望输出：所有文件显示 ✓

- [ ] **Step 3: 最终 commit**

```bash
git add README.md
git commit -m "docs: add README"
```

- [ ] **Step 4: 查看 git log**

```bash
git log --oneline -20
```

期望输出：看到所有 15 个 task 的 commit 记录

---

## 完成

所有任务完成！项目已准备好部署到 Vercel。

**下一步：**
1. 推送到 GitHub：`git push origin main`
2. 在 Vercel 导入项目并部署
3. 访问生成的 URL 验证线上效果

**验证清单：**
- [ ] 所有 CSS 文件加载正常
- [ ] 所有 JS 模块加载正常
- [ ] JSON 数据加载成功
- [ ] 6 个类别全部显示
- [ ] 40 个案例全部渲染
- [ ] 交互功能正常（展开/收起、导航高亮）
- [ ] 移动端响应式正常
- [ ] 无控制台错误
