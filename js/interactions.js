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
