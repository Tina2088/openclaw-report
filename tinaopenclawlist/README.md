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
