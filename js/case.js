/**
 * case.js — 案例详情页逻辑
 * 从 cases.json 读取案例元数据，从 GitHub 拉取 markdown，渲染成中文详情页
 */

const GITHUB_RAW = 'https://raw.githubusercontent.com/hesamsheikh/awesome-openclaw-usecases/main/usecases';

// 章节标题中英对照翻译
const SECTION_TRANSLATIONS = {
  // 常见标题
  'overview': '概览',
  'introduction': '简介',
  'what it does': '功能介绍',
  'what this does': '功能介绍',
  'capabilities': '核心能力',
  'core function': '核心功能',
  'features': '功能特性',
  'how it works': '工作原理',
  'how to set it up': '如何配置',
  'how to set up': '如何配置',
  'setup': '配置步骤',
  'setup requirements': '配置要求',
  'requirements': '前置要求',
  'prerequisites': '前置条件',
  'skills required': '所需技能',
  'required skills': '所需技能',
  'skills': '所需技能',
  'configuration': '配置说明',
  'usage': '使用方法',
  'use cases': '使用场景',
  'example': '示例',
  'examples': '示例',
  'scheduling': '定时设置',
  'smart curation': '智能筛选',
  'related links': '相关链接',
  'links': '相关链接',
  'resources': '参考资源',
  'notes': '注意事项',
  'limitations': '使用限制',
  'tips': '使用技巧',
  'workflow': '工作流程',
  'architecture': '架构说明',
  'implementation': '实现方式',
  'getting started': '快速开始',
  'quick start': '快速开始',
  'installation': '安装步骤',
  'demo': '演示',
  'output': '输出结果',
  'results': '运行结果',
  'benefits': '核心优势',
  'why use this': '为什么使用',
  'how to use': '使用方法',
  'step by step': '分步说明',
  'technical details': '技术细节',
  'advanced': '进阶用法',
  'customization': '自定义配置',
  'troubleshooting': '常见问题',
  'faq': '常见问题',
};

function translateHeading(text) {
  const lower = text.toLowerCase().trim();
  // 精确匹配
  if (SECTION_TRANSLATIONS[lower]) {
    return SECTION_TRANSLATIONS[lower];
  }
  // 部分匹配
  for (const [en, zh] of Object.entries(SECTION_TRANSLATIONS)) {
    if (lower.includes(en)) return zh;
  }
  return null; // 无翻译，保留原文
}

// 简单 Markdown → HTML 转换器
function markdownToHtml(md) {
  const lines = md.split('\n');
  const html = [];
  let inCode = false;
  let codeLang = '';
  let codeLines = [];
  let inList = false;
  let listType = '';
  let skippedH1 = false;

  function flushList() {
    if (!inList) return;
    html.push(`</${listType}>`);
    inList = false;
    listType = '';
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // 代码块
    if (line.startsWith('```')) {
      if (!inCode) {
        flushList();
        inCode = true;
        codeLang = line.slice(3).trim() || 'text';
        codeLines = [];
      } else {
        inCode = false;
        const escaped = codeLines.join('\n')
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
        html.push(`<div class="case-code-block"><div class="case-code-block__lang">${codeLang}</div><pre><code>${escaped}</code></pre></div>`);
        codeLines = [];
        codeLang = '';
      }
      continue;
    }

    if (inCode) {
      codeLines.push(line);
      continue;
    }

    // 标题
    const h3 = line.match(/^### (.+)/);
    const h2 = line.match(/^## (.+)/);
    const h1 = line.match(/^# (.+)/);

    if (h1) {
      flushList();
      if (!skippedH1) {
        skippedH1 = true;
      } else {
        const text = h1[1];
        const zh = translateHeading(text);
        if (zh) {
          html.push(`<h1 class="case-content__h1"><span class="case-content__heading-main">${zh}</span><span class="case-content__heading-en">${escapeHtml(text)}</span></h1>`);
        } else {
          html.push(`<h1 class="case-content__h1">${escapeHtml(text)}</h1>`);
        }
      }
      continue;
    }
    if (h2) {
      flushList();
      const text = h2[1];
      const zh = translateHeading(text);
      if (zh) {
        html.push(`<h2 class="case-content__h2"><span class="case-content__heading-main">${zh}</span><span class="case-content__heading-en">${escapeHtml(text)}</span></h2>`);
      } else {
        html.push(`<h2 class="case-content__h2">${escapeHtml(text)}</h2>`);
      }
      continue;
    }
    if (h3) {
      flushList();
      const text = h3[1];
      const zh = translateHeading(text);
      if (zh) {
        html.push(`<h3 class="case-content__h3"><span class="case-content__heading-main">${zh}</span><span class="case-content__heading-en">${escapeHtml(text)}</span></h3>`);
      } else {
        html.push(`<h3 class="case-content__h3">${escapeHtml(text)}</h3>`);
      }
      continue;
    }

    // 引用块
    if (line.startsWith('> ')) {
      flushList();
      html.push(`<blockquote class="case-content__blockquote">${renderInline(line.slice(2))}</blockquote>`);
      continue;
    }

    // 无序列表
    const ulMatch = line.match(/^[-*+] (.+)/);
    if (ulMatch) {
      if (!inList || listType !== 'ul') {
        flushList();
        html.push('<ul class="case-content__list">');
        inList = true;
        listType = 'ul';
      }
      html.push(`<li>${renderInline(ulMatch[1])}</li>`);
      continue;
    }

    // 有序列表
    const olMatch = line.match(/^\d+\. (.+)/);
    if (olMatch) {
      if (!inList || listType !== 'ol') {
        flushList();
        html.push('<ol class="case-content__list case-content__list--ordered">');
        inList = true;
        listType = 'ol';
      }
      html.push(`<li>${renderInline(olMatch[1])}</li>`);
      continue;
    }

    // 空行
    if (line.trim() === '') {
      flushList();
      continue;
    }

    // 水平线
    if (line.match(/^---+$/)) {
      flushList();
      html.push('<hr class="case-content__hr">');
      continue;
    }

    // 普通段落
    flushList();
    if (line.trim()) {
      html.push(`<p class="case-content__p">${renderInline(line)}</p>`);
    }
  }

  flushList();
  return html.join('\n');
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// 行内元素渲染：粗体、斜体、代码、链接
function renderInline(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // 粗体
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.+?)__/g, '<strong>$1</strong>')
    // 斜体
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/_(.+?)_/g, '<em>$1</em>')
    // 行内代码
    .replace(/`(.+?)`/g, '<code class="case-content__inline-code">$1</code>')
    // 链接
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="case-content__link" target="_blank" rel="noopener noreferrer">$1</a>');
}

// 类别颜色映射
const CATEGORY_COLORS = {
  'social-media': ['#FF3B30', '#FF6B6B'],
  'creative-building': ['#FF9500', '#FFB84D'],
  'infrastructure-devops': ['#34C759', '#5DD57D'],
  'productivity': ['#007AFF', '#4DA3FF'],
  'research-learning': ['#5856D6', '#8B89E6'],
  'finance-trading': ['#FFD60A', '#FFE04D'],
};

const CATEGORY_NAMES = {
  'social-media': '社交媒体',
  'creative-building': '创意与构建',
  'infrastructure-devops': '基础设施与DevOps',
  'productivity': '生产力工具',
  'research-learning': '研究与学习',
  'finance-trading': '金融与交易',
};

async function init() {
  const params = new URLSearchParams(location.search);
  const id = params.get('id');

  if (!id) {
    showError('未指定案例 ID');
    return;
  }

  try {
    // 并行加载案例元数据 + 中文翻译（优先）+ 英文原文（备用）
    const [casesRes, zhRes, enRes] = await Promise.all([
      fetch('data/cases.json'),
      fetch(`data/translations/${id}.json`).catch(() => null),
      fetch(`${GITHUB_RAW}/${id}.md`).catch(() => null),
    ]);

    if (!casesRes.ok) throw new Error('无法加载案例数据');

    const cases = await casesRes.json();
    const caseData = cases.find(c => c.id === id);

    if (!caseData) {
      showError(`找不到案例：${id}`);
      return;
    }

    // 更新页面标题
    document.title = `${caseData.nameZh || caseData.name} — Tina-OpenClaw`;

    // 优先用中文翻译，否则用英文原文
    let mdContent = null;
    if (zhRes && zhRes.ok) {
      const zhData = await zhRes.json();
      mdContent = zhData.content;
    } else if (enRes && enRes.ok) {
      mdContent = await enRes.text();
    }

    renderCase(caseData, mdContent);
  } catch (err) {
    console.error(err);
    showError('加载失败，请检查网络连接后重试');
  }
}

function renderCase(caseData, mdContent) {
  const main = document.getElementById('case-main');
  const colors = CATEGORY_COLORS[caseData.category] || ['#667eea', '#764ba2'];
  const gradient = `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`;
  const initial = caseData.name.charAt(0).toUpperCase();
  const categoryName = CATEGORY_NAMES[caseData.category] || caseData.category;

  const toolTags = (caseData.tools || [])
    .map(t => `<span class="case-detail__tool-tag">${escapeHtml(t)}</span>`)
    .join('');

  const githubUrl = `https://github.com/hesamsheikh/awesome-openclaw-usecases/blob/main/usecases/${caseData.id}.md`;

  main.innerHTML = `
    <!-- Hero 区 -->
    <div class="case-hero" style="background: ${gradient}">
      <div class="case-hero__inner">
        <a href="index.html#${caseData.category}" class="case-hero__category">${categoryName}</a>
        <div class="case-hero__initial" aria-hidden="true">${initial}</div>
        <h1 class="case-hero__title">${escapeHtml(caseData.nameZh || caseData.name)}</h1>
        <p class="case-hero__title-en">${escapeHtml(caseData.name)}</p>
        <p class="case-hero__desc">${escapeHtml(caseData.descriptionZh || caseData.description)}</p>
        ${caseData.descriptionZh ? `<p class="case-hero__desc-en">${escapeHtml(caseData.description)}</p>` : ''}
      </div>
    </div>

    <!-- 元信息栏 -->
    <div class="case-meta">
      <div class="case-meta__inner">
        ${toolTags ? `
          <div class="case-meta__section">
            <span class="case-meta__label">使用工具</span>
            <div class="case-meta__tools">${toolTags}</div>
          </div>
        ` : ''}
        <div class="case-meta__section">
          <a href="${githubUrl}" class="case-meta__github-link" target="_blank" rel="noopener noreferrer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            在 GitHub 查看原文
          </a>
        </div>
      </div>
    </div>

    <!-- Markdown 内容 -->
    <div class="case-content">
      <div class="case-content__inner">
        ${mdContent
          ? markdownToHtml(mdContent)
          : `<div class="case-content__no-content">
               <p>📄 暂时无法加载详细内容</p>
               <p>请访问 <a href="${githubUrl}" target="_blank" rel="noopener noreferrer">GitHub 原文</a> 查看完整内容。</p>
             </div>`
        }
      </div>
    </div>
  `;

  // 隐藏加载状态
  document.getElementById('case-loading').style.display = 'none';
}

function showError(msg) {
  const main = document.getElementById('case-main');
  document.getElementById('case-loading').style.display = 'none';
  main.innerHTML = `
    <div class="case-error">
      <p class="case-error__icon">⚠️</p>
      <p class="case-error__msg">${escapeHtml(msg)}</p>
      <a href="index.html" class="case-error__back">返回案例列表</a>
    </div>
  `;
}

init();
