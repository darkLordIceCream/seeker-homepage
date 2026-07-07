# Seeker追光者

![License](https://img.shields.io/badge/license-MIT-blue)
![Astro](https://img.shields.io/badge/Astro-7-BC52EE?logo=astro)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)

> 拍一张照片，交一个朋友

一个基于 Astro 构建的现代化摄影小组官网，采用 TypeScript + Tailwind CSS +
React 技术栈。

[English](./README.md) | 简体中文

## ✨ 特性

- 🚀 **Astro 7.x** - 现代化静态站点生成器
- ⚛️ **React 19** - UI 组件库
- 🎨 **Tailwind CSS 4.x** - 原子化 CSS 框架
- 🧩 **shadcn/ui** - 可复用组件库
- 📝 **TypeScript 6** - 类型安全的 JavaScript
- 🛠️ **完整的开发工具链** - ESLint + Prettier + Husky
- 📦 **Commitizen** - 规范化 Git 提交信息
- 🎯 **响应式设计** - 移动端友好
- 🤖 **Agent Harness** - AI 辅助开发工作流

## 🚀 快速开始

### 环境要求

- Node.js 22.12.0+ (推荐使用 nvm 管理)
- pnpm 9.0+

### 安装

```bash
# 克隆项目
git clone https://github.com/darkLordIceCream/seeker-homepage.git
cd seeker-homepage

# 使用指定 Node.js 版本
nvm use

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

## 📋 可用命令

| 命令                | 说明                            |
| ------------------- | ------------------------------- |
| `pnpm dev`          | 启动开发服务器                  |
| `pnpm build`        | 构建生产版本                    |
| `pnpm preview`      | 预览构建结果                    |
| `pnpm lint`         | 代码检查                        |
| `pnpm lint:fix`     | 自动修复代码问题                |
| `pnpm format`       | 格式化代码                      |
| `pnpm format:check` | 检查代码格式                    |
| `pnpm type-check`   | TypeScript 类型检查             |
| `pnpm astro:check`  | Astro 类型检查                  |
| `pnpm commit`       | 交互式提交（推荐）              |
| `./init.sh`         | 完整验证（安装+类型+lint+构建） |

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
| ⚡️    | `perf`     | 性能优化 |
| ✅    | `test`     | 测试相关 |
| 📦️    | `build`    | 构建相关 |
| 👷    | `ci`       | CI 配置  |
| 🔧    | `chore`    | 杂项任务 |

## 🛠️ 开发工具链

### 代码质量

- **ESLint 10.x** - 代码静态分析，支持 JavaScript/TypeScript/Astro
- **Prettier** - 代码格式化，集成 Astro 插件
- **TypeScript 6** - 严格类型检查，支持路径映射

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
│   └── favicon.svg        # 网站图标
├── src/
│   ├── assets/            # 图片、视频等资源
│   │   ├── images/        # 图片资源
│   │   └── videos/        # 视频资源
│   ├── components/        # Astro 和 React 组件
│   │   ├── ui/            # shadcn/ui 组件
│   │   ├── Banner.astro   # 视频横幅组件
│   │   ├── Navigation.astro # 导航栏
│   │   ├── Footer.astro   # 页脚
│   │   └── ThemeToggle.astro # 主题切换器
│   ├── layouts/           # 页面布局
│   │   └── Layout.astro   # 根布局
│   ├── pages/             # 页面文件
│   │   ├── index.astro    # 首页
│   │   └── team.astro     # 团队页面
│   ├── styles/            # 样式文件
│   │   └── global.css     # 全局样式 + shadcn 主题
│   └── lib/               # 工具函数
│       └── utils.ts       # cn() 工具函数
├── .agents/               # Agent 技能 (Matt Pocock)
├── .husky/                # Git hooks
├── .vscode/               # VS Code 配置
├── AGENTS.md              # Agent 工作手册
├── feature_list.json      # 功能状态追踪
├── progress.md            # 会话连续性日志
├── session-handoff.md     # 会话交接文档
├── init.sh                # 验证脚本
├── .czrc                  # Commitizen 配置
├── .lintstagedrc.json     # lint-staged 配置
├── .prettierrc.mjs        # Prettier 配置
├── .nvmrc                 # Node.js 版本
├── components.json        # shadcn/ui 配置
├── commitlint.config.js   # Commitlint 配置
├── eslint.config.js       # ESLint 配置
├── tsconfig.json          # TypeScript 配置
├── astro.config.mjs       # Astro 配置
└── package.json           # 包配置
```

## 🎨 样式系统

### Tailwind CSS

使用 Tailwind CSS 4.x 作为主要样式框架，配置了：

- 响应式设计断点
- 自定义颜色系统
- 统一的间距和字体规范

### shadcn/ui

使用 shadcn/ui（New York 风格，Zinc 基色）提供：

- 预构建的无障碍组件
- CSS 变量主题系统
- 深色/浅色模式支持

### 设计系统

```css
/* 颜色系统（CSS 变量） */
--primary: oklch(0.21 0.006 285.885);
--accent: oklch(0.967 0.001 286.375);

/* 自定义颜色 */
#4ecdc4 (青色) + #ff6b6b (珊瑚红) 渐变
```

## 🤖 Agent Harness

本项目包含用于可靠 AI 辅助开发的 harness：

- **AGENTS.md** - Agent 工作手册，含启动流程
- **feature_list.json** - 功能状态追踪器
- **progress.md** - 会话连续性日志
- **session-handoff.md** - 会话交接文档
- **init.sh** - 验证脚本

在启动任何 agent 会话前运行 `./init.sh` 验证环境健康状态。

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
- [shadcn/ui](https://ui.shadcn.com/) - 组件库
- [TypeScript](https://www.typescriptlang.org/) - JavaScript 的超集

---

**Seeker追光者** - 用镜头记录美好，用技术分享快乐
