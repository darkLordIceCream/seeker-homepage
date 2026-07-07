# Seeker Homepage 开发规范

> 本项目（Astro 摄影小组官网）的开发规范，适用于 AI 辅助开发和人工开发。

## 项目定位

基于 Astro 开发的摄影小组官方网站，以静态内容展示为主，包括摄影小组介绍、摄影作品展示、成员介绍、活动记录等。

**项目目标：** 高性能、优秀 SEO、低维护成本、良好的多人协作体验。

## 技术栈

- **框架:** Astro 7.x
- **UI:** React 19 + shadcn/ui
- **样式:** Tailwind CSS 4.x
- **语言:** TypeScript 6
- **内容管理:** Astro Content Collections
- **包管理:** pnpm
- **版本控制:** Git + GitHub
- **部署:** 静态托管（Vercel / Netlify / Cloudflare Pages）

## 开发原则

### 1. Content First（内容优先）

优先使用 Astro Content Collections 管理内容，不要把内容直接写死到页面。

**目录结构：**

```
src/content/
├── gallery/          # 摄影作品
│   └── *.md
├── members/          # 成员介绍
│   └── *.md
├── activities/       # 小组活动
│   └── *.md
└── news/             # 公告通知
    └── *.md
```

**Schema 定义：**

```typescript
// src/content.config.ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const gallery = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/gallery' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    cover: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()),
    location: z.string().optional(),
    photographer: z.string(),
  }),
});
```

**新增内容应通过新增 Markdown 文件完成，而不是修改页面代码。**

---

### 2. Component First（组件优先）

页面应保持简洁，拆分为多个独立组件。

**组件命名规范：**

- 使用 PascalCase：`GalleryGrid.astro`, `MemberCard.astro`
- 页面组件放在 `src/pages/`
- 可复用组件放在 `src/components/`
- shadcn/ui 组件放在 `src/components/ui/`

**组件职责单一：**

```
src/components/
├── ui/                    # shadcn/ui 基础组件
├── Banner.astro           # 首页横幅
├── Navigation.astro       # 导航栏
├── Footer.astro           # 页脚
├── GalleryGrid.astro      # 作品网格
├── MemberCard.astro       # 成员卡片
├── ActivityList.astro     # 活动列表
└── SEOHead.astro          # SEO 头部
```

---

### 3. Layout Reuse（布局复用）

所有页面复用 Layout，避免复制 Header、Footer、SEO 等公共代码。

```astro
---
// src/pages/index.astro
import Layout from '../layouts/Layout.astro';
import Navigation from '../components/Navigation.astro';
import Banner from '../components/Banner.astro';
import Footer from '../components/Footer.astro';
---

<Layout>
  <Navigation />
  <Banner />
  <Footer />
</Layout>
```

---

### 4. Type Safety（类型安全）

所有数据应具有明确 TypeScript 类型，不使用 `any`。

**Content Collections Schema 规范：**

- 字段命名一致：统一使用 `cover`，不要混用 `image`、`thumbnail`
- 必填字段用 `z.string()`，可选字段用 `z.string().optional()`
- 日期使用 `z.coerce.date()`

**组件 Props 类型：**

```astro
---
import type { CollectionEntry } from 'astro:content';

interface Props {
  member: CollectionEntry<'members'>;
  size?: 'sm' | 'md' | 'lg';
}

const { member, size = 'md' } = Astro.props;
---
```

---

### 5. Performance First（性能优先）

默认生成静态页面，除非确实需要交互，否则不添加客户端 JavaScript。

**客户端指令优先级：**

1. 无指令（静态 HTML）— 最佳
2. `client:visible` — 用户滚动到可见区域时加载
3. `client:idle` — 浏览器空闲时加载
4. `client:load` — 页面加载时加载（尽量避免）

**图片优化：**

```astro
---
import { Image } from 'astro:assets';
import coverImage from '../assets/images/cover.jpg';
---

<Image
  src={coverImage}
  alt="摄影作品封面"
  width={800}
  height={600}
  loading="lazy"
  format="webp"
/>
```

---

### 6. Image First（图片优先）

这是摄影网站，图片处理必须规范。

**规范：**

- 使用 Astro `<Image />` 组件，自动优化
- 必须设置 `alt` 属性（可访问性）
- 使用 `loading="lazy"` 懒加载
- 使用 `format="webp"` 现代格式
- 响应式图片使用 `srcset`

**禁止：**

```astro
<!-- ❌ 不要直接使用 img 标签 -->
<img src="/images/photo.jpg" />

<!-- ✅ 使用 Astro Image -->
<Image src={photo} alt="描述" width={800} height={600} />
```

---

### 7. SEO First（SEO 优先）

所有页面都应包含完整的 SEO 元数据。

**SEO 组件：**

```astro
---
// src/components/SEOHead.astro
interface Props {
  title: string;
  description: string;
  image?: string;
  canonical?: string;
}

const { title, description, image, canonical } = Astro.props;
---

<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>{title} | Seeker追光者</title>
<meta name="description" content={description} />

<!-- Open Graph -->
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
{image && <meta property="og:image" content={image} />}
<meta property="og:type" content="website" />

<!-- Canonical -->
{canonical && <link rel="canonical" href={canonical} />}
```

---

### 8. Accessibility（可访问性）

遵循基本可访问性原则：

- 图片必须有 `alt`
- 表单有 `label`
- 合理使用语义化 HTML（`<nav>`, `<main>`, `<article>`, `<section>`）
- 颜色对比度符合 WCAG 标准
- 键盘可导航

---

### 9. Git 工作流

**分支策略：**

- `main` — 主分支，受保护
- `feat/*` — 新功能
- `fix/*` — Bug 修复
- `refactor/*` — 重构
- `docs/*` — 文档更新
- `chore/*` — 杂项任务

**提交规范：**

使用 Conventional Commits + Emoji：

```
✨ feat: 新增功能
🐛 fix: 修复缺陷
📝 docs: 文档变更
💄 style: 代码格式
♻️ refactor: 代码重构
⚡️ perf: 性能优化
✅ test: 测试相关
📦️ build: 构建相关
👷 ci: CI 配置
🔧 chore: 杂项任务
```

**工作流程：**

1. 从 `main` 创建功能分支
2. 开发并提交
3. 创建 Pull Request
4. 代码审查
5. 合并到 `main`

---

### 10. AI 修改策略

**优先级：**

1. 新增组件（最低风险）
2. 修改单个组件
3. 修改页面
4. 修改配置（最高风险）

**原则：**

- 修改范围尽可能小
- 一次只做一件事
- 修改后运行验证（`./init.sh`）
- 更新 `feature_list.json` 和 `progress.md`

---

### 11. 代码风格

- 简洁、可维护、模块化、可读性高
- 避免重复代码
- 优先复用已有组件
- 使用 ESLint + Prettier 保持一致

---

### 12. 输出要求

实现新功能时：

1. 先分析是否已有组件可以复用
2. 如果需要新增组件，说明原因
3. 如果涉及 Content Collections，说明需要新增哪些 Markdown 文件
4. 尽量减少修改文件数量
5. 修改后保持项目结构整洁
6. 运行 `./init.sh` 验证

---

## 项目结构

```
seeker-homepage/
├── public/                    # 静态资源
├── src/
│   ├── assets/               # 图片、视频
│   ├── components/           # 组件
│   │   └── ui/               # shadcn/ui
│   ├── content/              # Content Collections（待创建）
│   │   ├── gallery/
│   │   ├── members/
│   │   ├── activities/
│   │   └── news/
│   ├── layouts/              # 布局
│   ├── lib/                  # 工具函数
│   ├── pages/                # 页面
│   └── styles/               # 样式
├── AGENTS.md                 # Agent 工作手册
├── feature_list.json         # 功能状态追踪
├── progress.md               # 会话日志
├── session-handoff.md        # 会话交接
└── init.sh                   # 验证脚本
```

---

## 参考资源

- [Astro 官方文档](https://docs.astro.build/)
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [Astro Images](https://docs.astro.build/en/guides/images/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
