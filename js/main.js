/**
 * main.js — 应用入口
 * 职责：组合所有模块，初始化应用
 */

import { loadData } from './data.js';
import { renderNavLinks, renderCategories, renderError } from './render.js';
import { initCardInteractions, initExpandButtons, initNavHighlight, initHamburgerMenu } from './interactions.js';

/**
 * 初始化应用
 */
async function initApp() {
  try {
    // 1. 加载数据
    const { categories, casesByCategory } = await loadData();

    // 2. 渲染 UI
    renderNavLinks(categories);
    renderCategories(categories, casesByCategory);

    // 3. 初始化交互
    initCardInteractions();
    initExpandButtons();
    initNavHighlight();
    initHamburgerMenu();

    console.log('[main.js] 应用初始化成功');
  } catch (err) {
    console.error('[main.js] 应用初始化失败:', err);
    renderError();
  }
}

// 当 DOM 加载完成后初始化应用
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
