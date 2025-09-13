# Seeker追光者 - 摄影小组官网

> 拍一张照片，交一个朋友

一个基于 Astro 构建的现代化摄影小组官网，采用 TypeScript + Tailwind CSS +
Less 技术栈。

[English](./README.md) | 简体中文

## ✨ 特性

- 🚀 **Astro 5.x** - 现代化静态站点生成器
- 🎨 **Tailwind CSS 4.x** - 原子化 CSS 框架
- 💎 **Less** - CSS 预处理器，支持变量和混入
- 📝 **TypeScript** - 类型安全的 JavaScript
- 🛠️ **完整的开发工具链** - ESLint + Prettier + Husky
- 📦 **Commitizen** - 规范化 Git 提交信息
- 🎯 **响应式设计** - 移动端友好

## 🚀 快速开始

### 环境要求

- Node.js 22.17.1+ (推荐使用 nvm 管理)
- pnpm 9.0+

### 安装

```bash
# 克隆项目
git clone <repository-url>
cd seeker-homepage

# 使用指定 Node.js 版本
nvm use 22.17.1

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

## 📋 可用命令

| 命令              | 说明                |
| ----------------- | ------------------- |
| `pnpm dev`        | 启动开发服务器      |
| `pnpm build`      | 构建生产版本        |
| `pnpm preview`    | 预览构建结果        |
| `pnpm lint`       | 代码检查            |
| `pnpm lint:fix`   | 自动修复代码问题    |
| `pnpm format`     | 格式化代码          |
| `pnpm type-check` | TypeScript 类型检查 |
| `pnpm commit`     | 交互式提交（推荐）  |

## 🎯 Git 提交规范

本项目使用 [Conventional Commits](https://www.conventionalcommits.org/)
规范，支持 emoji 前缀：

```bash
# 使用交互式提交（推荐）
pnpm commit

# 手动提交示例
git commit -m "✨ feat: 添加用户登录功能"
git commit -m "🐛 fix(auth): 修复登录验证错误"
git commit -m "📝 docs: 更新 README 文档"
```

### 提交类型

| Emoji | 类型       | 说明     |
| ----- | ---------- | -------- |
| ✨    | `feat`     | 新增功能 |
| 🐛    | `fix`      | 修复缺陷 |
| 📝    | `docs`     | 文档变更 |
| 💄    | `style`    | 代码格式 |
| ♻️    | `refactor` | 代码重构 |
| ⚡️   | `perf`     | 性能优化 |
| ✅    | `test`     | 测试相关 |
| 📦️   | `build`    | 构建相关 |
| 👷    | `ci`       | CI 配置  |
| 🔧    | `chore`    | 杂项任务 |

## 🛠️ 开发工具链

### 代码质量

- **ESLint 9.x** - 代码静态分析，支持 JavaScript/TypeScript/Astro
- **Prettier** - 代码格式化，集成 Astro 插件
- **TypeScript** - 严格类型检查，支持路径映射

### Git Hooks

- **pre-commit** - 提交前检查和格式化暂存文件
- **commit-msg** - 验证提交信息格式
- **pre-push** - 推送前运行完整检查

### VS Code 集成

项目包含完整的 VS Code 配置：

- 自动格式化和错误检查
- 推荐扩展列表
- 统一的编辑器设置

## 📁 项目结构

```
seeker-homepage/
├── public/                 # 静态资源
├── src/
│   ├── assets/            # 图片、视频等资源
│   ├── components/        # Astro 组件
│   ├── layouts/           # 页面布局
│   ├── pages/             # 页面文件
│   ├── styles/            # 样式文件
│   │   ├── global.less    # 全局样式
│   │   └── variables.less # 设计系统变量
│   └── lib/               # 工具函数
├── .husky/                # Git hooks
├── .vscode/               # VS Code 配置
├── eslint.config.js       # ESLint 配置
├── commitlint.config.js   # Commitlint 配置
├── tsconfig.json          # TypeScript 配置
└── tailwind.config.js     # Tailwind CSS 配置
```

## 🎨 样式系统

### Tailwind CSS

使用 Tailwind CSS 4.x 作为主要样式框架，配置了：

- 响应式设计断点
- 自定义颜色系统
- 统一的间距和字体规范

### Less 预处理器

- **全局样式**: `src/styles/global.less`
- **设计变量**: `src/styles/variables.less`
- 支持嵌套、变量、混入等高级功能

### 设计系统

```less
// 颜色系统
@color-primary: #000;
@color-accent: #007acc;

// 字体系统
@font-family-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', ...;

// 间距系统（基于 8px 网格）
@spacing-4: 1rem; // 16px
@spacing-8: 2rem; // 32px
```

## 🚀 部署

### 构建

```bash
pnpm build
```

构建输出位于 `dist/` 目录，可以部署到任何静态托管服务。

### 支持的平台

- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages

## 🤝 贡献指南

1. Fork 本项目
2. 创建功能分支: `git checkout -b feature/amazing-feature`
3. 提交更改: `pnpm commit`
4. 推送分支: `git push origin feature/amazing-feature`
5. 提交 Pull Request

### 开发规范

- 遵循 ESLint 规则
- 使用 Prettier 格式化代码
- 编写语义化的提交信息
- 确保类型检查通过

## 📄 许可证

[MIT License](./LICENSE)

## 🙏 致谢

- [Astro](https://astro.build/) - 现代化的静态站点生成器
- [Tailwind CSS](https://tailwindcss.com/) - 原子化 CSS 框架
- [TypeScript](https://www.typescriptlang.org/) - JavaScript 的超集

---

**Seeker追光者摄影小组** - 用镜头记录美好，用技术分享快乐
