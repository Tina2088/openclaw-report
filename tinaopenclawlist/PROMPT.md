# Claude Code 开发提示词：OpenClaw 应用案例展示网站

> 本提示词可直接复制给 Claude Code，一次性完成整个项目开发，无需多次迭代。

---

## 项目目标

构建一个**苹果官网风格的静态单页展示网站**，汇总展示 40+ 个 OpenClaw 真实应用案例，按 6 大类别组织，支持卡片展开/收起交互，每个案例有独立详情页。

**核心特性：**
- 纯静态网站（HTML + CSS + JS），无框架，无构建工具
- 中英双语支持（中文为主，英文为辅）
- 响应式设计（桌面 4 列 / 平板 2 列 / 手机 1 列）
- 案例详情页从 GitHub 拉取 markdown 内容，预翻译为中文
- 部署到 Vercel

---

## 数据源

**案例数据来源：** https://github.com/hesamsheikh/awesome-openclaw-usecases

**40 个案例分为 6 大类别：**
1. 社交媒体（Social Media）- 5 个案例
2. 创意与构建（Creative & Building）- 5 个案例
3. 基础设施与 DevOps（Infrastructure & DevOps）- 2 个案例
4. 生产力工具（Productivity）- 20 个案例
5. 研究与学习（Research & Learning）- 7 个案例
6. 金融与交易（Finance & Trading）- 1 个案例

**每个案例包含：**
- 英文名称 + 中文名称
- 英文描述 + 中文描述
- 使用工具列表
- GitHub 详情页链接

---

## 技术架构

### 文件结构
```
/
├── index.html              # 主页（单页应用）
├── case.html               # 案例详情页模板
├── css/
│   ├── reset.css           # CSS reset + 设计 tokens
│   ├── layout.css          # 导航、Hero、类别区域布局
│   ├── card.css            # 案例卡片样式
│   ├── responsive.css      # 响应式断点
│   └── case.css            # 详情页样式
├── js/
│   ├── data.js             # 数据加载（fetch JSON）
│   ├── render.js           # DOM 渲染
│   ├── interactions.js     # 交互逻辑
│   ├── main.js             # 主入口
│   └── case.js             # 详情页逻辑
├── data/
│   ├── categories.json     # 6 个类别定义
│   ├── cases.json          # 40 个案例元数据
│   └── translations/       # 预翻译的中文 markdown（40 个 JSON 文件）
├── scripts/
│   └── translate_cases.py  # 批量翻译脚本（使用 Claude API）
├── vercel.json             # Vercel 部署配置
└── README.md
```

### 技术栈
- **HTML5** 语义化标签
- **CSS3** Grid/Flexbox/自定义属性/动画
- **原生 JavaScript** ES6+ Modules
- **JSON** 数据存储
- **Claude API** 内容翻译

---

## 详细设计规范

### 1. 视觉设计（苹果风格）

**色彩系统：**
```css
--color-bg: #FFFFFF;
--color-bg-secondary: #F5F5F7;
--color-border: #D2D2D7;
--color-text-primary: #1D1D1F;
--color-text-secondary: #6E6E73;
--color-text-tertiary: #86868B;
--color-accent: #0071E3;
```

**类别渐变色：**
- 社交媒体：`#FF3B30 → #FF6B6B`
- 创意与构建：`#FF9500 → #FFB84D`
- 基础设施：`#34C759 → #5DD57D`
- 生产力工具：`#007AFF → #4DA3FF`
- 研究与学习：`#5856D6 → #8B89E6`
- 金融与交易：`#FFD60A → #FFE04D`

**字体系统：**
```css
--font-family: -apple-system, BlinkMacSystemFont, "Segoe UI",
               "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
```

**间距系统（8px 基础单位）：**
- `--space-xs: 8px`
- `--space-sm: 16px`
- `--space-md: 24px`
- `--space-lg: 40px`
- `--space-xl: 80px`
- `--space-2xl: 120px`

**圆角与阴影：**
- `--radius-card: 18px`
- `--radius-btn: 20px`
- `--shadow-card: 0 2px 8px rgba(0,0,0,0.08)`

---

### 2. 首页结构

#### 2.1 固定导航栏
- 高度：52px
- 背景：`rgba(255,255,255,0.8)` + `backdrop-filter: blur(20px)`
- Logo：`Tina-龙虾`
- 导航链接：6 个类别锚点
- 汉堡菜单（移动端）
- 滚动时高亮当前类别

#### 2.2 Hero 区（全屏）
- 背景：纯白
- 标题层级：
  - 小标题（蓝色）：`Tina-OpenClaw Use Cases`（48px, 700）
  - 主标题：`Tina-龙虾应用案例`（64px, 700）
  - 副标题（灰色）：`Real-world OpenClaw automations, organized by category`（19px）
  - 统计信息：`40+ 真实案例 · 6 大应用场景 · 持续更新`（17px）
- 滚动提示：`向下滚动探索 · Scroll to explore`（带动画）

#### 2.3 类别区域（6 个）
每个类别包含：
- **类别标题：** 中文大字（48px） + 英文小字（21px, 灰色）
- **类别描述：** 一句话说明
- **案例卡片网格：**
  - 桌面：4 列（`repeat(4, 1fr)`）
  - 平板：2 列
  - 手机：1 列
  - 间距：24px
  - 初始显示 4 个卡片，其余隐藏
- **展开按钮：** `显示全部 X 个案例` / `收起`（切换状态）

#### 2.4 案例卡片
**默认状态（280px 高）：**
- 渐变色背景（类别色）
- 首字母装饰（200px, 半透明）
- 中文名称（22px, 700, 白色）在上
- 英文名称（14px, 400, 半透明）在下
- 悬停：`translateY(-4px)` + 增强阴影

**展开状态：**
- 详情面板展开（`max-height: 1200px` 动画）
- 中文描述（16px, 500, 蓝色背景块）
- 英文描述（14px, 灰色，分隔线下方）
- 工具标签（圆角徽章）
- 「查看完整详情 →」按钮（蓝色，跳转详情页）
- 「收起 · Collapse ↑」按钮

**交互：**
- 点击卡片任意位置展开/收起
- 键盘支持：Enter/Space 展开，ESC 关闭所有
- `aria-expanded` 状态管理

#### 2.5 页脚
- 版权信息：`© 2026 Tina-龙虾应用案例汇总`
- 数据来源链接：GitHub 仓库

---

### 3. 详情页结构（case.html）

#### 3.1 顶部导航
- 返回按钮：`← 返回案例列表`
- Logo：`Tina-OpenClaw`

#### 3.2 Hero 区（渐变色背景）
- 类别标签（圆角徽章）
- 首字母装饰（半透明）
- 中文标题（52px, 700）
- 英文标题（20px, 半透明）
- 中文描述（19px）
- 英文描述（15px, 半透明）

#### 3.3 元信息栏
- 使用工具（标签列表）
- GitHub 链接（带图标）

#### 3.4 Markdown 内容区
**内容来源：**
1. 优先加载：`data/translations/{id}.json`（预翻译的中文）
2. 备用：从 GitHub 拉取英文原文

**渲染规则：**
- 跳过第一个 `# H1`（已在 Hero 区显示）
- 章节标题：中文大字 + 英文小字（如「所需技能 / Skills you Need」）
- 支持：段落、列表、代码块、引用块、链接、粗体、斜体
- 代码块：带语言标签，语法高亮样式

**章节标题自动翻译映射：**
```javascript
{
  'overview': '概览',
  'what it does': '功能介绍',
  'how to set it up': '如何配置',
  'skills required': '所需技能',
  'example': '示例',
  'limitations': '限制',
  'related links': '相关链接',
  // ... 更多映射
}
```

#### 3.5 页脚
同首页

---

### 4. 响应式设计

**断点：**
- 桌面：`≥ 1024px`（4 列卡片）
- 平板：`768px - 1023px`（2 列卡片）
- 手机：`< 768px`（1 列卡片）
- 大屏：`≥ 1400px`（容器 max-width 保持 1200px）

**移动端适配：**
- 导航栏：汉堡菜单（三条横线动画）
- Hero 标题：64px → 36px
- 类别标题：48px → 28px
- 卡片悬停效果禁用（`transform: none`）
- 展开按钮：全宽，居中

**无障碍：**
- `prefers-reduced-motion: reduce` 禁用所有动画
- ARIA 属性：`aria-expanded`, `aria-label`, `role="button"`
- 键盘导航：Tab, Enter, Space, ESC
- 焦点样式：`outline: 2px solid var(--color-accent)`

---

### 5. 数据结构

#### 5.1 categories.json
```json
[
  {
    "id": "social-media",
    "name": "社交媒体",
    "nameEn": "Social Media",
    "color": "#FF3B30 → #FF6B6B",
    "icon": "📱",
    "description": "社交媒体自动化、内容聚合与分析",
    "order": 1
  }
  // ... 其余 5 个类别
]
```

#### 5.2 cases.json
```json
[
  {
    "id": "daily-reddit-digest",
    "name": "Daily Reddit Digest",
    "nameZh": "每日Reddit摘要",
    "category": "social-media",
    "description": "Summarize curated subreddit digests...",
    "descriptionZh": "根据你的偏好自动汇总精选 subreddit...",
    "tools": ["OpenClaw", "Reddit API", "Email"],
    "links": [{"text": "查看详情", "url": "https://github.com/..."}],
    "verified": true,
    "featured": true,
    "githubFile": "daily-reddit-digest"  // 可选，映射 GitHub 文件名
  }
  // ... 其余 39 个案例
]
```

**注意：** 部分案例的 GitHub 文件名与 `id` 不一致，需要 `githubFile` 字段映射：
- `multi-source-tech-news` → `multi-source-tech-news-digest`
- `goal-driven-autonomous-tasks` → `overnight-mini-app-builder`
- `multi-agent-content-factory` → `content-factory`
- `family-calendar-household` → `family-calendar-household-assistant`
- `desktop-cowork` → `aionui-cowork-desktop`
- `habit-tracker` → `habit-tracker-accountability-coach`

#### 5.3 translations/{id}.json
```json
{
  "id": "daily-reddit-digest",
  "content": "# 每日 Reddit 摘要\n\n每天自动运行摘要，为你提供..."
}
```

---

### 6. JavaScript 模块设计

#### 6.1 data.js
```javascript
export async function loadData() {
  const [categoriesRes, casesRes] = await Promise.all([
    fetch('data/categories.json'),
    fetch('data/cases.json')
  ]);

  const categories = await categoriesRes.json();
  const cases = await casesRes.json();

  // 按类别分组
  const casesByCategory = {};
  cases.forEach(c => {
    if (!casesByCategory[c.category]) casesByCategory[c.category] = [];
    casesByCategory[c.category].push(c);
  });

  return { categories, casesByCategory };
}
```

#### 6.2 render.js
```javascript
export function renderNavLinks(categories) { /* 渲染导航链接 */ }
export function renderCategories(categories, casesByCategory) { /* 渲染类别区域 */ }
function renderCard(caseData, category) { /* 渲染单个卡片 */ }
export function renderError() { /* 错误状态 */ }
```

**关键点：**
- 卡片渲染：中文名称在上（22px），英文名称在下（14px）
- 展开详情：中文描述（蓝色背景块） + 英文描述（分隔线下方）
- 链接改为：`<a href="case.html?id=${id}">查看完整详情 →</a>`
- XSS 防护：`escapeHtml()` 处理所有用户数据

#### 6.3 interactions.js
```javascript
export function initCardInteractions() { /* 卡片展开/收起 */ }
export function initExpandButtons() { /* 展开按钮切换 */ }
export function initNavHighlight() { /* 导航滚动高亮 */ }
export function initHamburgerMenu() { /* 汉堡菜单 */ }
```

**关键点：**
- 事件委托：监听 `.main` 区域，避免每个卡片绑定监听器
- 键盘支持：Enter/Space 展开，ESC 关闭所有
- 展开按钮：切换 `is-hidden-card` 类，更新按钮文字
- 滚动高亮：`requestAnimationFrame` 节流

#### 6.4 main.js
```javascript
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

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
```

#### 6.5 case.js（详情页）
```javascript
async function init() {
  const id = new URLSearchParams(location.search).get('id');

  // 并行加载：案例元数据 + 中文翻译 + 英文原文
  const [casesRes, zhRes, enRes] = await Promise.all([
    fetch('data/cases.json'),
    fetch(`data/translations/${id}.json`).catch(() => null),
    fetch(`https://raw.githubusercontent.com/.../usecases/${id}.md`).catch(() => null)
  ]);

  const caseData = cases.find(c => c.id === id);

  // 优先用中文翻译
  let mdContent = null;
  if (zhRes && zhRes.ok) {
    const zhData = await zhRes.json();
    mdContent = zhData.content;
  } else if (enRes && enRes.ok) {
    mdContent = await enRes.text();
  }

  renderCase(caseData, mdContent);
}

function markdownToHtml(md) {
  // 简单 markdown 解析器
  // 跳过第一个 H1
  // 章节标题：中文大字 + 英文小字
  // 支持：段落、列表、代码块、引用块、链接、粗体、斜体
}
```

---

### 7. 内容翻译脚本

#### 7.1 scripts/translate_cases.py
```python
import anthropic
import json
import urllib.request

client = anthropic.Anthropic(
    api_key=os.environ["ANTHROPIC_AUTH_TOKEN"],
    base_url=os.environ.get("ANTHROPIC_BASE_URL", "https://api.anthropic.com")
)

def translate_markdown(case_id, name_zh, md_content):
    """使用 Claude API 翻译 markdown 内容为中文"""
    prompt = f"""
    将以下 OpenClaw 应用案例的 markdown 文档翻译为中文。

    案例名称：{name_zh}

    要求：
    1. 保持 markdown 格式（标题、列表、代码块、链接）
    2. 代码块内容不翻译
    3. 专有名词保留英文（OpenClaw, GitHub, API 等）
    4. 语气专业、简洁、易懂
    5. 章节标题翻译为中文

    原文：
    {md_content}
    """

    message = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=4096,
        messages=[{"role": "user", "content": prompt}]
    )

    return message.content[0].text

# 批量翻译所有 40 个案例
for case in cases:
    md = fetch_markdown(case['id'], case.get('githubFile'))
    zh_md = translate_markdown(case['id'], case['nameZh'], md)
    save_translation(case['id'], zh_md)
```

**运行：**
```bash
python3 scripts/translate_cases.py
```

---

### 8. 部署配置

#### 8.1 vercel.json
```json
{
  "headers": [
    {
      "source": "/data/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=3600, s-maxage=3600" }
      ]
    },
    {
      "source": "/(.*\\.(css|js))",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

**注意：** 不要添加 `rewrites` 块（会拦截 JSON 请求）

#### 8.2 部署步骤
1. 推送到 GitHub
2. Vercel 导入项目
3. 自动部署（无需构建步骤）

---

## 开发步骤（按顺序执行）

### Phase 1: 数据层
1. 创建 `data/categories.json`（6 个类别）
2. 创建 `data/cases.json`（40 个案例，包含 `githubFile` 映射）
3. 验证 JSON 格式

### Phase 2: 样式层
4. 创建 `css/reset.css`（CSS reset + 设计 tokens）
5. 创建 `css/layout.css`（导航、Hero、类别、网格）
6. 创建 `css/card.css`（卡片默认/悬停/展开状态）
7. 创建 `css/responsive.css`（三个断点 + prefers-reduced-motion）
8. 创建 `css/case.css`（详情页样式）

### Phase 3: 逻辑层
9. 创建 `js/data.js`（数据加载）
10. 创建 `js/render.js`（DOM 渲染，注意中文在上、英文在下）
11. 创建 `js/interactions.js`（交互逻辑）
12. 创建 `js/main.js`（主入口）
13. 创建 `js/case.js`（详情页逻辑）

### Phase 4: 页面层
14. 创建 `index.html`（主页，`<script type="module">`）
15. 创建 `case.html`（详情页模板）

### Phase 5: 内容翻译
16. 创建 `scripts/translate_cases.py`
17. 运行翻译脚本，生成 `data/translations/*.json`（40 个文件）

### Phase 6: 部署
18. 创建 `vercel.json`
19. 创建 `README.md`
20. 本地测试：`python3 -m http.server 8080`
21. 推送到 GitHub，Vercel 部署

---

## 关键决策点（避免迭代）

### ✅ 明确的设计决策
1. **中文为主，英文为辅**
   - 首页卡片：中文名称 22px 在上，英文名称 14px 在下
   - 详情页标题：中文大字，英文小字
   - 详情页内容：优先显示中文翻译

2. **不显示"已验证"徽章**
   - `cases.json` 里有 `verified` 字段，但不渲染

3. **展开详情只显示一个按钮**
   - 「查看完整详情 →」跳转详情页
   - 不显示原 GitHub 链接列表

4. **详情页内容来源**
   - 优先：`data/translations/{id}.json`（预翻译）
   - 备用：GitHub raw markdown（英文原文）

5. **响应式断点**
   - 桌面 ≥1024px：4 列
   - 平板 768-1023px：2 列
   - 手机 <768px：1 列

6. **动画性能**
   - 使用 `transform` 和 `opacity`（GPU 加速）
   - 避免 `height` 动画（用 `max-height`）
   - 支持 `prefers-reduced-motion`

### ❌ 避免的常见错误
1. **vercel.json 不要加 `rewrites`**（会拦截 JSON 请求）
2. **categories.json 用单个 `color` 字段**（不是 `colorStart`/`colorEnd`）
3. **部分案例需要 `githubFile` 映射**（文件名不一致）
4. **详情页跳过第一个 H1**（已在 Hero 区显示）
5. **展开按钮要支持切换**（显示全部 ↔ 收起）
6. **HTML 加载 JS 必须用 `type="module"`**

---

## 验证清单

### 功能验证
- [ ] 首页加载显示 6 个类别
- [ ] 每个类别初始显示 4 个卡片
- [ ] 点击卡片展开/收起详情
- [ ] 点击「查看完整详情」跳转详情页
- [ ] 详情页显示中文翻译内容
- [ ] 导航栏滚动高亮当前类别
- [ ] 展开按钮切换显示/隐藏卡片
- [ ] 键盘支持（Enter/Space/ESC）
- [ ] 移动端汉堡菜单工作正常

### 样式验证
- [ ] 卡片中文名称大字在上
- [ ] 详情页章节标题中文大字在上
- [ ] 响应式布局正确（4/2/1 列）
- [ ] 悬停动画流畅
- [ ] 无 CSS 样式冲突

### 性能验证
- [ ] Lighthouse Performance ≥ 90
- [ ] Lighthouse Accessibility ≥ 95
- [ ] LCP < 2.5s
- [ ] 无 JavaScript 错误
- [ ] 无 404 请求

---

## 提示词使用方法

**直接复制以下内容给 Claude Code：**

```
请按照 PROMPT.md 文件中的完整规范，开发一个 OpenClaw 应用案例展示网站。

要求：
1. 严格按照「开发步骤」顺序执行（Phase 1-6）
2. 遵循所有「关键决策点」，避免常见错误
3. 使用 superpowers:writing-plans 创建实施计划
4. 使用 superpowers:subagent-driven-development 执行计划
5. 每个 Phase 完成后进行代码审查
6. 最后运行「验证清单」确保所有功能正常

项目路径：/Users/tina/Downloads/tinaproject
```

---

## 预期结果

**开发时间：** 约 30-45 分钟（包含翻译）

**最终交付：**
- 完整的静态网��（13 个文件）
- 40 个预翻译的中文内容
- Vercel 部署配置
- 本地可运行（`python3 -m http.server 8080`）

**零迭代关键：**
- 所有设计决策在提示词中明确
- 数据结构完整定义
- 样式规范精确到像素
- 交互逻辑详细描述
- 常见错误提前规避
