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
