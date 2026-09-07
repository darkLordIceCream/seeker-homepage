---
name: welfare-article
description: >
  发布 Seeker追光者公益板块的新文章到 seeker-homepage 网站。当用户提供微信
  公众号文章链接（或其他图文文章）并表达发布意图时使用——触发词包括"发文章"、
  "加到公益板块"、"把这篇公众号搬过来"、"新增一篇手记"、"发布这篇"等，即使
  没有明说"公益文章"。也适用于用户给出参考排版网站要求按其风格发布新文章的
  场景。不适用于：仅抓取文章内容做参考而不发布、编辑已有文章、单纯上传图片。
---

# 公益文章发布流程

把一篇公众号图文文章完整发布到 `/welfare` 板块：抓取 → 图片入 R2 → 写 Content
Collection md → 生产构建验证 → 用户验收 → PR 合并。

**每篇文章必须在独立分支上进行**——开始任何工作（包括抓取后的写作）之前，
`git branch --show-current` 确认不在 main 上；在 main 上则先从最新 main 拉
`feat/<slug>` 分支（slug 未定时用 `feat/welfare-article` 占位，slug 定了如不同再
`git branch -m` 改名）。一篇文章一个分支，验收即 PR 即合并，不跨文章复用分支。

## 不变量（任何模板、任何文章都不允许改变）

这些是全站经过多轮打磨沉淀的常量，新模板/新文章只能改变布局结构，不能碰：

- **字体体系**：大标题 / 章节标题 / 正文 / 延伸阅读卡标题 = 衬线（
  `--font-serif-song`：Songti SC 栈）；kicker / 副题 / meta / 图注 / CTA =
  Archivo + 无衬线。新模板必须复用这套角色分工，不得引入新字体或对调角色。
- **配色**：站点 Catppuccin 令牌（light 默认），不取参考站颜色。
- **图片**：任何场景禁止裁切（拍立得水印与署名是内容的一部分）。
- **延伸阅读**：所有模板必须带互链卡，设计语言统一为 kicker + 封面原比例图 + 衬线标题 + 「阅读全文 →」箭头 CTA，数据来自
  `others`（自动互链）。

## 第一步：收集输入

向用户确认以下决策（可一条消息问齐，但模板必须单独问）：

1. **文章 URL**（触发前提；无公众号来源的手写文章跳过第二、三步的抓取部分，直接进入写作，图片由用户提供）
2. **参考排版**：用户应提供一个参考网站（如 aperture.org 的画册版、hasselblad.com/inspiration/masters 的图集版）。没有提供时必须先问 "按哪套排版发？"。若用户给的参考是全新风格（现有模板对不上），走
   [新模板流程](#新模板流程)。
3. **模板选择**：每次都问，不自动推断。现有模板：`editorial`（画册/编辑部风）、
   `hasselblad`（图集风）。schema 枚举见 `src/content.config.ts`。
4. **作者署名**：问一次。已知作者：寄意寒星、那山（可多人空格分隔）。
5. **slug**：自动起一个简短英文 slug（如
   `passing-spring`），展示给用户确认，一句话可改。
6. **order**：自动设为现有文章最大 order +
   1（排最后），告知用户"想插到中间告诉我"。order 决定列表顺序和延伸阅读的上一篇/下一篇方向，不要问用户数值。

不问的：图片 R2 目录（固定规则见 checklist）、延伸阅读互链（自动）、标题/ 副题/kicker/金句（从原文提取，见 checklist 取舍表）。

## 第二步：抓取文章

用 agent-browser 打开文章并提取图文流（微信图片是懒加载的 blob 引用，不滚动拿不到真实 URL）：

1. `agent-browser open <url>` + `wait --load networkidle`
2. 注入 JS：按屏滚动到底触发懒加载，回顶后遍历 `#js_content`
   的子节点，输出 JSON（`{type:'text'|'img', text|src}`
   交错数组）。img 的 src 取 `dataset.src` 并去掉 `#imgIndex` 后缀。meta 单独取
   `#activity-name`、 `#js_name`、`#publish_time`。
3. 把交错流存到临时文件，后续写作以它为唯一依据（不要凭记忆重写正文）。

## 第三步：图片入 R2

规则细节见 [references/checklist.md](references/checklist.md)
图片规范一节，流程：

1. 按交错流顺序下载全部图片（curl 带
   `Referer: https://mp.weixin.qq.com/`），命名 `01.jpg`
   两位序号（扩展名以真实格式为准）
2. 逐张 `file`
   校验：真实格式 ≠ 扩展名则按真实格式重命名；0 字节或非图片立即重下，重下失败**停止并报告**，绝不带病上传
3. 超过 3MB 的做质量压缩（`sips -s formatOptions`），**尺寸与内容绝不动**
4. `wrangler whoami` 确认登录；未登录让用户跑
   `npx wrangler login`，且提醒确认登录的是拥有 seeker-homepage 项目的账号（登错账号会报 R2 未启用）
5. 上传到 `seeker-homepage-assets/welfare/bring-her-eyes/<slug>/<序号>.<ext>`
6. 逐张 curl 验证 200 且字节数与本地一致，全部通过才进入写作

**绝对禁止裁切任何图片**——照片带拍立得水印与作者署名，裁切即毁内容。压缩也只能调质量参数，不改尺寸。

## 第四步：写文章 md

新建 `src/content/welfare/<slug>.md`（写作前确认已在 `feat/<slug>`
分支上，不在就先切），frontmatter 字段与正文取舍规则见
[references/checklist.md](references/checklist.md) 取舍表。要点：

- **正文文字一字不改照搬**（作者即用户团队，改写有风险）
- **图片默认全收**；明显的二维码/广告图丢弃并告知用户收了哪些丢了哪些
- 图片引用统一用 R2 绝对 URL
  `https://pub-4a7b0e2f651540e19220929f5d72b9b6.r2.dev/welfare/bring-her-eyes/<slug>/n.jpg`
- 组图约定：连续图片行之间**不空行**即渲染为并排；需要左右并排的图写成软换行相邻
- 公众号导流元素（往期回顾、小程序卡、广告）丢弃

## 第五步：生产构建验证

**必须基于 build 产物验证**（dev 模式有 HMR 假象，曾出现样式丢失的误报）：

1. `pnpm run build` 通过，页数 +1（新文章路由出现）
2. 杀掉旧的 preview 进程再起（stale build 会让用户看到旧版本）：
   `lsof -ti:4322 | xargs kill -9; pnpm preview --port 4322 --host 0.0.0.0`
3. agent-browser 检查（详见 checklist 验证清单）：头版、图组（等高并排、
   **无裁切**、水印完整）、文末名单与延伸阅读卡、抽一篇旧文确认互链出现新文章、390px 移动端

## 第六步：交付（两段式）

**第一段（默认终点）**：本地提交（Conventional Commits + gitmoji，
`✨ feat: ...`；subject 里不要用 `#`，会触发 commitlint 报错），告知用户：

> 已就绪待验收：http://localhost:4322/welfare/<slug>/

**第二段（用户确认后）**：push 分支 → `gh pr create` →
`gh pr merge --merge --delete-branch`
→ 切回 main 拉取同步。PR 创建与合并在用户一句确认后连续完成，不再中途停顿。

合并后提醒：更新 feature_list.json / progress.md 属于会话收尾职责。

## 新模板流程

用户给的参考排版与现有模板气质对不上时：

1. **委托 `layout-analyzer` skill**
   分析参考 URL，得到排版规格文件（实测参数清单）
2. **把规格给用户过目确认，再动手写组件**（防止像哈苏 v1 那样整轮返工）
3. 新建
   `src/components/welfare/Article<Name>.astro`（参照现有两套的结构：Props 接收 article +
   others，含延伸阅读互链），schema 的 layout 枚举加值，
   `src/pages/welfare/[slug].astro` 分发器加分支
4. 新模板的延伸阅读卡沿用现有设计语言：kicker + 封面原比例大图 + 衬线标题 + 「阅读全文 →」箭头 CTA；配色一律保持站点 Catppuccin 令牌
