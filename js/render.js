/**
 * render.js — DOM 渲染
 * 职责：根据数据生成 HTML 结构，插入 DOM
 */

const INITIAL_VISIBLE = 4;  // 每个类别初始显示的卡片数

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

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
                <span class="category__title-en">${cat.nameEn}</span>
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
              data-expanded="false"
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
  const [colorStart, colorEnd] = category.color.split(' → ');
  const gradient = `linear-gradient(135deg, ${colorStart}, ${colorEnd})`;
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
        <div class="case-card__name-wrap">
          <h3 class="case-card__name">${escapeHtml(caseData.name)}</h3>
          ${caseData.nameZh ? `<p class="case-card__name-zh">${escapeHtml(caseData.nameZh)}</p>` : ''}
        </div>
      </div>

      <div class="case-card__details" aria-hidden="true">
        <div class="case-card__details-inner">
          ${caseData.descriptionZh ? `
            <p class="case-card__description case-card__description--zh">${escapeHtml(caseData.descriptionZh)}</p>
            <p class="case-card__description case-card__description--en">${escapeHtml(caseData.description)}</p>
          ` : `
            <p class="case-card__description">${escapeHtml(caseData.description)}</p>
          `}

          ${tools ? `
            <p class="case-card__section-label">使用工具 <span class="case-card__section-label-en">Tools</span></p>
            <div class="case-card__tools">${tools}</div>
          ` : ''}

          ${links ? `
            <p class="case-card__section-label">相关链接 <span class="case-card__section-label-en">Links</span></p>
            <div class="case-card__links">
              <a href="case.html?id=${caseData.id}" class="case-card__link case-card__link--primary">查看完整详情 →</a>
            </div>
          ` : `
            <div class="case-card__links">
              <a href="case.html?id=${caseData.id}" class="case-card__link case-card__link--primary">查看完整详情 →</a>
            </div>
          `}

          <button class="case-card__collapse-btn" aria-label="收起 ${caseData.name}">
            收起 · Collapse ↑
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
      <button class="error-retry-btn" style="
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
  const retryBtn = main.querySelector('.error-retry-btn');
  if (retryBtn) retryBtn.addEventListener('click', () => location.reload());
}

export { renderNavLinks, renderCategories, renderError, INITIAL_VISIBLE };
