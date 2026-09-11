# Session Progress Log

## Current State

**Last Updated:** 2026-08-29 **Branch:**
main（feat/update-astro-homepage 已随 PR #10 合入，合并提交 05cd810）**Active
Feature:** 无 —— 首页画册式改版（feat-020~022）已完成并合并

## Status

### What's Done

- [x] feat-001 ~
      feat-015（历史会话已完成，详见下方「历史记录」与 feature_list.json）
- [x] 依赖更新（feat-020 一部分）
  - Astro 7.0.6 → 7.2.8，React 19.2.8，Tailwind 4.3.3，ESLint 10.9.1 等
  - 跳过跨大版本：TypeScript 7（风险高）、eslint-plugin-astro 3（需改配置）
- [x] 安装 ui-ux-pro-max 设计技能（7 个技能 → .agents/skills/）
  - SKILL.md 中 ${CLAUDE_PLUGIN_ROOT} 路径已改写为 .agents/skills/
  - 搜索脚本冒烟测试通过；ESLint 忽略 .agents/**
- [x] 首页整屏滚动改版（feat-020）
  - 第1屏 Hero 保持不变；箭头改为真按钮点击滚动到 #about
  - CSS scroll-snap（y mandatory）整屏吸附，html:has(.snap-scroll) 限定首页
  - 新增 4 个区块：#about 关于（特色卡×3）、#branches 地区分部（城市卡）、#activities 小组活动（线上/线下两栏）、#join 加入我们（CTA 占位）
  - Topbar：滚动过 60% 后玻璃实底 + 高度收缩；scrollspy 当前区块渐变下划线；导航锚点映射（首页内 #id，其他页 /#id）；logo 纯文字 + 渐变「追光者」（用户要求去掉光圈小图标）
  - 右侧进度圆点导航（5 章，桌面端显示，hover 显示章节名）
  - 通用玻璃卡样式收口到 global.css（.glass-card 与导航下拉同配方）
  - reveal 入场动画（html.js 门控 + IntersectionObserver + 错峰延迟）
  - 顺手修复：渐变标语 text-shadow→drop-shadow；页脚社交图标统一 24px；页脚联系方式 emoji→SVG 图标；版权年份动态化；移除 console.log；视频离屏自动暂停；100vh→100svh
- [x] 全站浅色主题 Catppuccin Latte（feat-021）
  - shadcn 变量重映射：:root = Latte（浅色默认），.dark =
    Mocha（ThemeToggle 切换保留）
  - 品牌渐变 #4ecdc4→#ff6b6b → Latte Teal #179299 → Red
    #d20f39（对比度核对：浅底大字 ≥3:1、按钮白字 ≥4.5:1）
  - 新增界面令牌：--grad-a/b、--on-gradient、--glass-*、--divider、--glow-a/b、--icon-tile
  - 组件去硬编码：Layout/Navigation/ThemeToggle/4 个 section/PageProgress/Footer/TeamHero/MemberCard/MemberSocial/team/under-construction
  - 首屏视频区保持沉浸式深色（用户之前要求第一屏保持现状）；导航顶部悬浮白字、落地/非首页切换主题前景色（--nav-* 状态变量）
  - 修复 ThemeToggle 固有 bug：initThemeToggle 双重注册导致单击切换两次（等于没切）
  - 修复 under-construction 死代码：.light 覆盖规则永不生效（Layout 从不加 .light 类），改令牌后自动跟随主题
  - 修复非首页导航白字压浅底不可读：Navigation--solid 常驻玻璃底（isHome 判断）
- [x] 首页画册式改版（feat-022，替代 feat-020 的四屏区块结构）
  - 用户诊断「像个人博客不像摄影小组」→ 影像主导重设计：照片即版式
  - 作品墙 WorksSection：满版错落拼贴（7 块 grid-areas）+ 底片风占位（暗房渐变 + 全局 .ph-tile 胶片颗粒 +
    EXIF 悬浮小字），恒定深底
  - 活动 ActsSection：3 条全宽大图横条，活动名压图，单一「全部活动」入口
  - 介绍 AboutSection：左文右图单屏，浅色「画册文字页」与深色照片区形成节奏
  - 节奏：Hero(深·视频)→作品墙(深)→活动条(深)→介绍(浅)→Footer(浅)，翻屏 6→4
  - scrollspy：works/activities/about 平级 section 各自映射；进度点改 4 点
  - 修复：活动区 padding-top 56→88（标题被导航压住）
  - 旧 ShowcaseSection/IntroSection 及四屏区块组件已删除（内容并入新组件）
- [x] feat-022 迭代：内容层全部浅色化 + 卡片堆叠形式（用户反馈第二轮）
  - 作品墙：恒定深底→浅色底，作品块加白边相框（5px）+ 交替微旋转（±0.7°）
    - 层叠阴影，hover 转正放大
  - 活动区：三条横条→拍立得照片堆（3 张白框厚底卡 38% 宽错位叠放，活动名写在下方白边，hover 抽出转正放大 z-index 置顶），移动端纵向堆叠
  - 排障：vite 长时间 HMR 后模块状态损坏（ActsSection 样式整体失效、dev
    server 启动 fetchModule 超时）→ 杀残留进程 + 清 node_modules/.astro
    - 重启 dev server 解决
- [x] feat-022 迭代二：作品页改胶片带画廊 + 活动卡 sticky 突出（用户反馈第三轮）
  - 作品页标题改「画廊 GALLERY」；错落拼贴→35mm 胶片带：上下齿孔（repeating-gradient + 走带动画）、帧线分隔、帧号 No.01~07、内容双份渲染 +
    translateX(-50%) 无缝自动轮播（42s，hover/focus 暂停，reduced-motion 降级为横向滚动）
  - 活动拍立得：突出态从 :hover 改为 JS 维护的 .active 类（mouseenter/focus 跟随，鼠标移开后保持到下一张），第二张默认突出
  - 排障补充：浏览器端样式异常时先确认是否同页 hash 跳转未真正重新加载；生产构建（build+preview）是可靠的验收路径

- [x] feat-022 迭代三：topbar 简化（用户反馈第四轮）
  - 「小组活动」与「小组简介」位置调换（作品展示|小组活动|小组简介|加入小组）
  - 移除全部下拉菜单（含主下拉/子下拉样式与移动端内联展开规则，净删 ~240 行）
  - 连带处理：/team 团队页入口原在下拉「成员构成›主理人」内，移至介绍页左栏「认识主理人团队 →」链接；地区分部子链接信息由介绍页 branch
    chips 承接
  - 排障提醒：验证前务必 rebuild + 重启 preview（4322），dev(4321) HMR 易假象

- [x] feat-022 迭代四：scrollspy 首屏高亮修复（用户反馈第五轮）
  - 现象：停在首屏时「作品展示」下划线不消失（离开区块时无清除逻辑）
  - 修复：IntersectionObserver 回调维护各目标相交状态 Map，全部目标离开视口中线带时 setActive(null) 清除高亮与 aria-current

- [x] feat-022 迭代五：进度点水滴物理动效（用户反馈第六轮）
  - 激活点 dot-drop 关键帧：10px→拉伸 31px→压扁回弹→24px 稳定
  - 失活点 dot-pop 关键帧：24px→压扁 4px（水滴分离）→弹回 10px，渐变色同步淡出；animationend 后移除 pop-out 类
  - JS 维护 currentId，切换时新旧两点分别触发落入/分离动画；prefers-reduced-motion 关闭动画

### What's In Progress

- 无（feat-020~022 已全部合入 main；待办：/join 联系方式素材、画廊真实作品、feat-016/018 详情页）

### What's Next

1. feat-016: 作品展示画廊（导航「作品展示」仍指向占位页）
2. feat-017: 小组简介完整内容（首页 #about 目前是摘要卡）
3. feat-018: 小组活动页面（首页 #activities 目前是摘要卡）
4. feat-019: 加入小组入口（#join 联系方式目前是占位）

## Blockers / Risks

- [ ] #join 联系方式为占位内容，待用户提供真实素材
- [ ] optional: 「一次手势严格一屏」JS 滚动方案未做（当前 CSS
      snap 快速滚动可能一次跳过两屏），用户如不满意可二期实现
- [ ] Google
      Fonts（Archivo）走 CDN，国内访问速度一般；数字/拉丁字符量小，影响可控

## Decisions Made

- **CSS scroll-snap 而非 JS fullpage**: 用户拍板；无 JS 可用、保留原生滚动
- **Snap 作用域**: html:has(.snap-scroll) 限定首页，/team 等页面正常滚动
- **页脚也设为吸附点**: mandatory 模式下无吸附点区域无法停留
- **设计语言**: 延续 Liquid Glass 配方（blur 20px + saturate
  200%），ui-ux-pro-max 数据库中 glassmorphism 风格条目验证了该方向
- **数字字体 Archivo**: ui-ux-pro-max 推荐；中文沿用系统字体栈（Noto Sans
  SC 等 webfont 体积大，放弃）
- **页脚吸附进首页容器外**: .snap-scroll .footer 选择器实现，不改 Footer 组件
- **历史决策**（保留）: Cloudflare
  Pages 部署；R2 存大文件；占位链接统一 /under-construction

## Files Modified（本会话）

- `package.json` / `pnpm-lock.yaml` - 依赖更新
- `eslint.config.js` - 忽略 .agents/**
- `.agents/skills/{ui-ux-pro-max,ui-styling,design,design-system,brand,slides,banner-design}/` - 新增技能
- `src/styles/global.css` - Archivo 引入 + 整屏滚动系统 + 玻璃卡/区块公共样式
- `src/layouts/Layout.astro` - html.js 门控（无 JS 时 reveal 不隐藏内容）
- `src/components/Banner.astro` - 箭头按钮化 + 100svh +
  drop-shadow + 视频离屏暂停
- `src/components/Navigation.astro` - 玻璃态 + scrollspy + 锚点映射 + 渐变下划线
- `src/components/home/AboutSection.astro` - 新增
- `src/components/home/BranchesSection.astro` - 新增
- `src/components/home/ActivitiesSection.astro` - 新增
- `src/components/home/JoinSection.astro` - 新增
- `src/components/home/PageProgress.astro` - 新增
- `src/components/Footer.astro` - 图标统一 24px + emoji→SVG + 年份动态
- `src/pages/index.astro` - snap-scroll 容器组装 + reveal 脚本
- `feature_list.json` - 新增 feat-020
- `progress.md` - 本文件

## Evidence of Completion（本会话）

- [x] ./init.sh 通过：pnpm install / type-check（0 errors）/ lint（0 errors 0
      warnings）/ build（3 pages）
- [x] 构建产物 16 项结构检查全部通过（snap 容器、四个区块 id、进度点、锚点、玻璃卡、动态年份、emoji 清除、logo 无小图标、CSS
      snap 规则、Archivo 等）
- [x] 浏览器实测（dev 4321 + 生产 preview
      4322，1280×800）：五屏 snap 吸附逐屏截图验证 ✓；scrollspy 下划线与进度圆点逐屏联动 ✓；视觉验证发现并修复 3 个问题：① 页脚不可达（Footer 在 .snap-scroll 外）→ 改 html:has(.snap-scroll)
      .footer；② 带锚点进入被 snap 拉回首屏且 load 被 R2 大视频拖住 →
      DOMContentLoaded 即刻 scrollIntoView + load 兜底；③
      800px 高视口下 #activities 超一屏标题被顶出 → 压缩节奏 +
      max-height:880px 隐藏卡片标签行

## Notes for Next Session

- 当前在 main 分支，PR #10 已合并；feat-016~019 可基于新首页结构继续开发
- 后续功能（feat-016~019）可基于首页区块的卡片语言继续开发
- #join 联系方式占位内容待用户提供
- 参考 DEVELOPMENT_STANDARDS.md 遵循开发规范

---

## 历史记录（feat-015 会话，2026-07-15）

<details>
<summary>展开</summary>

- 施工中占位页面（feat-015）：/under-construction 统一占位页，导航 25 个占位链接 + 页脚 4 个快速链接统一指向，noindex + 返回首页按钮，PR
  #7 合并
- 部署信息：Cloudflare Pages（seeker-homepage），R2 bucket
  seeker-homepage-assets，视频 /videos/banner.mp4（43 MiB）
- R2 公开 URL：https://pub-4a7b0e2f651540e19220929f5d72b9b6.r2.dev
- 限制：Pages 单文件 25 MiB；R2 免费额度 10 GB + 1000 万读取/月

</details>

---

## 会话记录（feat-023 公益项目板块，2026-08-29）

### 交付内容（分支 feat/public-welfare，基于 main 7290f0f）

- **welfare Content Collection**：`src/content.config.ts` 新增 welfare
  schema（title/subtitle/kicker/coverLine/cover/excerpt/quote/quoteAuthor/pubDate/author/order）
- **首篇文章**：`src/content/welfare/bring-her-eyes.md`
  —— 公众号《带上她的眼睛 | 在遥远的地方，我看到了什么》全文重排（2026-08-29 原文，作者寄意寒星），38 张学生摄影作品全部收录，图注用斜体行约定（`p:has(img) + p em`
  渲染为居中灰字）
- **二级页 `/welfare/`**：项目介绍 hero（渐变 glow + kicker「SEEKER 公益 ·
  WELFARE」）
  - 图文手记拍立得堆叠卡片（与首页活动卡同一语言，hover/focus 突出跟随）
- **文章页 `/welfare/[slug]/`**：公众号风格排版——品牌语头部（SEEKER
  · 繁星闪烁之时）、居中大标题/副题/meta、金句引用（署名右对齐）、居中章节标题（01/02/03 写在标题文字里，渐变短下划线）、全宽圆角照片、居中图注、诗句 blockquote、鸣谢名单
- **首页**：活动卡「一种关注」→「Seeker公益 · 带上她的眼睛」（真实封面图 +
  `/welfare/` 直达），stack-tag 改深色玻璃底（浅色照片上白字可读）

### ⚠️ R2 迁移待办（用户授权后执行）

Cloudflare OAuth
token 与 refresh_token 均已过期（原过期时间 2026-07-09），wrangler 上传报
`CLOUDFLARE_API_TOKEN` 错误，本次图片暂存仓库：
`public/images/welfare/bring-her-eyes/01.jpg…38.jpg（含 02.png，共 5.1MB）`。授权恢复后迁移步骤：

1. `wrangler login`（或设 `CLOUDFLARE_API_TOKEN`）
2. 循环
   `wrangler r2 object put seeker-homepage-assets/welfare/bring-her-eyes/$n.$ext --file public/images/welfare/bring-her-eyes/$n.$ext --remote`
3. `grep -rl '/images/welfare/bring-her-eyes/' src/ | xargs sed -i '' 's|/images/welfare/bring-her-eyes/|https://pub-4a7b0e2f651540e19220929f5d72b9b6.r2.dev/welfare/bring-her-eyes/|g'`
4. 删除 `public/images/welfare/` 并验证构建

### Evidence

- `pnpm run type-check`：0 errors / 0 warnings
- `pnpm run lint`：0 problems
- `pnpm run build`：5 页（含 /welfare/、/welfare/bring-her-eyes/）
- 浏览器截图验证：二级页 hero/卡片、文章页头部/章节/图注/38 图、首页公益卡（封面铺满 +
  tag 可读 + href=/welfare/）

### Notes for Next Session

- 当前分支 `feat/public-welfare`，已提交待用户确认后推送/建 PR
- 新增公益文章：在 `src/content/welfare/`
  加 md（frontmatter 参照现有文章，order 递增），/welfare 列表自动出现
- 后续可加：文章页上一篇/下一篇、welfare 导航入口（目前从首页活动卡进入）

### 排版重排（用户反馈，同日）

- 用户反馈：公众号式排版偏手机阅读，要求参考 Aperture
  editorial（马格南系画册风）重排
- 参考要点（实站测量）：不对称头版（左衬线大标题+lede
  / 右满高图出血）、正文单栏 ~741px 衬线 17px 行高 1.76 左对齐、全列宽大图 +
  12px 左对齐图注、成组作品双图/三图并排
- 重排实现：`.article-hero`
  左右 46/54 分栏（--edge 左边距对齐正文列）、正文衬线体（Songti SC / Noto Serif
  SC / SimSun
  fallback）16.5px 行高 1.95、金句改左对齐渐变竖线、章节标题左对齐衬线 + 短规则线、图注左对齐 12px
  sans、组图约定「md 软换行落同段 → p:has(img+img)
  flex 并排（顶对齐不裁剪）」、手机端头版堆叠 + 组图退回单列
- md 中 7 处成组作品改为软换行并排（10+11、17+18+19、22+23、25+26、27+28、29+30、35+36）

### 排版细节打磨（用户反馈「看着怪」，用 ui-ux-pro-max skill 审查，同日）

- skill 结论：editorial-grid-magazine 检查表中缺 drop cap；line
  length 应限 65-75 字符
- 修复「怪」感根源：内容列贴屏幕左缘（原 --edge 24px）→
  6vw 左基线（Aperture 约 7-8vw 比例）
- 新增：正文首段首字下沉、无图注氛围大图向右破格 122%（画册宽窄节奏）、版心 720→760px
- 去重：hero 封面与正文引子图同图（01.jpg）重复展示 → 删正文引子图
- 微调：图片印刷质感直角（radius
  0）、金句 1.22→1.32rem、图注间距 -0.8em→-0.5em、尾部返回居中
- 顺手：**pycache** 误入仓库 → git rm --cached + .gitignore

### 延伸阅读侧栏 + 左基线再调（用户反馈，同日）

- 参照 Aperture「You May Also Like」：文章页右侧新增「延伸阅读 MORE
  STORIES」sticky 侧栏（272px，top
  96px），三张真实感占位卡（标题派生自项目素材：第一台相机的旅程 / 每人一本摄影集 / 明信片的另一端，渐变缩略图 + 「即将上线 · 素材整理中」状态行）+「了解 Seeker公益 →」回项目页；文章就位后把占位卡替换为 getCollection 链接即可
- 布局：article-layout 双栏 grid（760px 版心 + 72px 栏距 +
  272px 侧栏）；左基线 6vw→9vw（用户反馈往中间挪）；破格图 122%→108%（伸入栏距不压侧栏）
- 响应式：<1280px 侧栏移到正文下方三卡横排；<900px 退回单列

### 侧栏收敛 + 竖图并排（用户反馈，同日）

- 用户反馈侧栏「太放肆」：实测 Aperture 侧栏参数（模块宽 365px、小图 78×89 横排卡、非 sticky）
- 侧栏重做：grid 列改 1fr，模块 width
  min(300px) 在右侧留白区内居中（非全局居中）；去掉 sticky（停文档位置）；大缩略图竖卡 →
  74×89 横排小卡（图左 + 标题/状态右）
- 正文：07 马杏 +
  08 吕秋然两张竖图改并排（md 软换行），图注合并，与上方 06 陈鹏横图左右对齐

### 三连图对齐 + 35/36 改上下布置（用户反馈，同日）

- 吕欣怡三联原图比例 1.50/1.33/1.50 → JS 给三图段打 .img-trio（CSS
  :has 数不出子元素），统一 aspect-ratio 3/2 + object-fit
  cover，底部对齐（18 仅轻微裁切）
- 35/36 从软换行并排拆回上下两段（同宽破格 108%，左右对齐）；36 实为 1080×218 手写便条长条图
- 其余双图组实测组内比例一致（1.33 组、0.75 竖图组），无需处理

### R2 迁移完成（2026-08-29）

- 根因回顾：先前 wrangler OAuth 过期 + refresh 失效；重新登录后发现登的是
  1712313289@qq.com 账号（无 Pages 项目、未启用 R2），bucket 属于
  Djhannyuan@gmail.com 账号；用户切换账号重新 login 后打通
- 迁移执行：38 张图全部上传 R2 `welfare/bring-her-eyes/`（逐一 curl 验证 200），
  `bring-her-eyes.md`（39 处）与 `ActsSection.astro`（1 处）路径替换为
  `https://pub-4a7b0e2f651540e19220929f5d72b9b6.r2.dev/welfare/bring-her-eyes/`，删除
  `public/images/welfare/`（仓库瘦身 5.1MB）
- 验证：type-check/lint/build 全过；preview 实测 38 张图全部从 R2 加载成功
- 顺带：按 developers.cloudflare.com/agent-setup/prompt.md 安装 Cloudflare
  Skills 到全局 ~/.agents/skills/（MCP 需用户在 ZCode 客户端配置，未做）

### R2 目录重组为「项目/文章」两层（用户要求，同日）

- 用户澄清：「带上她的眼睛」是项目名（会有多篇文章），每篇文章图片需独立目录
- R2 重组：`welfare/bring-her-eyes/`（38 张散图）→
  `welfare/bring-her-eyes/in-a-faraway-place/`
  （第一篇文章，slug 取自副题「在遥远的地方」）；旧 key 全部删除（404 已验证）
- 站内文章 URL `/welfare/bring-her-eyes/` 保持不变，仅 md/组件里的 R2
  URL 前缀更新
- 约定（已写入 AGENTS.md）：R2 路径 =
  `welfare/<项目slug>/<文章slug>/n.jpg`，新文章 = 项目目录下新建子目录；未来若有新公益项目，`welfare/`
  下新建项目目录
- 验证：38 个新 URL 全 200；build 通过；preview 实测图片正常加载（懒加载 37/38 视口外）

---

## 会话记录（第二篇文章《过春天》+ 哈苏模板，2026-08-29）

### 交付（分支 feat/welfare-second-article）

- **第二篇文章**
  `src/content/welfare/passing-spring.md`：《带上她的眼睛 | 过春天》（公众号 2026-06-04 发布），41 图全部入 R2
  `welfare/bring-her-eyes/passing-spring/`；三章节：找春天 / 山人 / 实在舍不得；尾部新增「支教的老师们」名单章节
- **列表时间排序**：`/welfare/`
  改按 pubDate 升序（项目叙事时间线：6月《过春天》→ 8月《带上她的眼睛》）
- **文章页哈苏化**（参考 hasselblad.com/inspiration/masters/2026 图文排版，配色保持 Catppuccin 令牌；两篇文章共用模板）：居中头版（kicker/标题/副题/meta 宽字距居中）+ 全宽封面；章节标题居中 +
  0.3em 宽字距（md 去「01
  ·」编号）；组图统一 1:1 等高裁切（竖图组 JS 检测切 3:4）、10px 窄间距；正文改无衬线居中窄列；金句/引文/图注全部居中；去 drop
  cap 与破格
- **修复**：02.png（腊肉图）在 R2 为 0 字节（此前迁移脚本 git
  show 路径错误产生空文件）→ 从 git 历史重新导出上传（704KB），R2 即时生效，线上破图同步修复

### Evidence

- type-check / lint / build（6 页）全过；preview 实测两篇文章桌面 + 390px 移动端
- R2：passing-spring/ 41 张（01.jpg 曾失败重传成功）；in-a-faraway-place/
  38 张（02.png 修复为 704KB）

### 模板分离：两篇文章各自使用独立模板（用户要求，同日）

- 用户反馈第一篇不该跟随哈苏模板 → 模板拆分为组件 + layout 字段分发：
  - `content.config.ts` welfare schema 加
    `layout: enum('editorial'|'hasselblad')`，默认 editorial
  - `src/pages/welfare/[slug].astro` → 薄分发器（getStaticPaths +
    others 互链数据）
  - `src/components/welfare/ArticleEditorial.astro`
    = 画册版（从 main 恢复：不对称头版、衬线 drop
    cap、破格、右侧延伸阅读侧栏）；侧栏占位卡替换为真实互链卡（others）
  - `src/components/welfare/ArticleHasselblad.astro`
    = 哈苏版（居中头版、等高不裁切图组、文末延伸阅读互链）
- 《带上她的眼睛》无 layout 字段 → editorial（原样恢复）；《过春天》layout:
  hasselblad
- 互链双向生效：两篇文末/侧栏均指向对方

### 延伸阅读重设计（用户反馈「没设计感」，skill 复查，2026-08-30）

- skill 原则：hover 必须有视觉反馈；杂志感 = 衬线 + kicker 宽字距 + 箭头交互
- editorial（画册版）侧栏：横排小卡 → 纵向编辑卡（「下篇故事 NEXT
  STORY」品牌色 kicker + 封面原比例大图（hover 亮度变化）+ 衬线大标题 19px + 副题 +「阅读全文 →」箭头 hover 右移）
- hasselblad：文末三列小卡 → 左图右文横幅卡（3:2 图 + 宽字距大标题 + 副题 +
  CTA，hover 标题变品牌色 + 箭头位移）；顺序调整为延伸阅读在返回链接之前
- 移动端：横幅卡上下堆叠

### 延伸阅读语义修正（用户反馈，2026-08-30）

- 卡片标题：第一篇 title 为项目名「带上她的眼睛」，卡片改用新字段 cardTitle（「在遥远的地方，我看到了什么」）；schema 加 cardTitle 可选字段
- 方向标签：用户按「从后往前」制作，指向《带上她的眼睛》应称「上一篇」——
  kicker 不再写死 NEXT STORY，按 order 动态计算（other.order
  < 当前 →「上一篇 PREVIOUS STORY」，否则「下一篇 NEXT
  STORY」），kicker 移入卡片内部
- 实测：过春天页 →「上一篇 PREVIOUS STORY
  | 在遥远的地方，我看到了什么」；带上她的眼睛页 →「下一篇 NEXT STORY | 过春天」

### 细节修正（用户反馈，2026-08-30 第二轮）

- 第一篇 title 改为文章名「在遥远的地方，我看到了什么」（subtitle 改「山村中的摄影课」，cardTitle 字段移除）；页面 h1
  / 列表卡 / 互链卡 / SEO 标题全部一致更新
- 画册头版标题错位换行：title 含中文逗号时首个逗号后断行、第二行缩进 2em（.title-line
  nth-child(2)，字号上限降到 2.7rem 保证两行不折）
- /welfare/ 列表排序改 order 升序（在遥远的地方在前，过春天=下一篇在后）
- 过春天正文删除与 hero 封面重复的引子图（01.jpg，同图重复）；开头 Kawa 歌词被 prettier 合并成单行 → 改 HTML
  blockquote + <br> 恢复分行

### 文章顺序最终修正（用户确认，2026-08-30）

- 用户确认手记顺序：《过春天》在前（order 1），《在遥远的地方》在后（order
  2，它的下一篇）
- 对调两篇 order；延伸阅读方向标签随之正确：过春天页显示「下一篇 NEXT
  STORY」（指向在遥远的地方），在遥远的地方页显示「上一篇 PREVIOUS
  STORY」（指向过春天）

### 收尾（feat/welfare-second-article 合并前）

- feat-023 evidence 更新：双模板 + 两篇文章 + R2 全量 + 多轮排版验收
- 延伸阅读语义终版：过春天在前（order 1）→「下一篇 NEXT
  STORY」指向在遥远的地方；在遥远的地方（order 2）→「上一篇 PREVIOUS
  STORY」指向过春天
- 第一篇 title 修正为文章名「在遥远的地方，我看到了什么」（subtitle 山村中的摄影课）

### 字体体系统一（用户反馈 + skill 评估，2026-08-30）

- skill 结论：杂志类站点经典搭配 = 衬线标题/正文 + 无衬线辅助行（Magazine Style
  pairing）
- 统一结果（两模板一致）：h1 大标题、章节标题、正文、延伸阅读卡标题 = 衬线（--font-serif-song：Songti
  SC 栈）；kicker/meta/dek/图注/CTA = Archivo + 无衬线
- 哈苏组件补齐 --font-serif-song 变量，hero-title 与 next-title 从黑体改衬线

### 小组介绍合影位照片（2026-08-30）

- 用户提供成员照片墙拼贴图（1500x2500 PNG，5MB）上传 R2 `about/team-photo.png`
- AboutSection 右侧「外拍合影位」占位替换为照片墙（background
  cover，label 改「成员照片墙 · 每一张都是我们」）

## 会话记录（skill 测试：《第三季》发布 + magnum 新模板，2026-08-30）

### skill 测试实战（welfare-article + layout-analyzer 首次联动）

- 输入：微信长链（被环境验证拦截，降级用用户提供的短链 /s/4E-6-wWJny1UquVsmPGVmA）
  - Magnum 排版参考（用户确认新建模板）
- layout-analyzer 首跑：agent-browser 实测 Magnum signature-drop 页（hero
  740px 居中、细字重 300、图 720/480/291 三档节奏、图注左对齐灰字、Next
  Story 左竖线卡、EXPLORE
  MORE 带侧线标题），规格 /tmp/layout-specs/magnum.md 经用户确认后实施
- 新模板 ArticleMagnum.astro：居中细列头版 + 宽幅封面 +
  740px 左对齐衬线正文 + 衬线居中章节（字距 0.12em）+ 金句词距拉开 + 大图 720px/瓦片行等高原比例 + 左对齐图注（本模板特征）+
  Next Story 左竖线互链卡；schema 枚举加 magnum
- 《带上她的眼睛 | 第三季》：2026-03-05，58 图入 R2
  welfare/bring-her-eyes/season-three/（45-58 首轮上传遇网络中断，重试成功；字节数逐一比对通过）；报名表单二维码（原图 58.png）按规则丢弃并告知；图注错字「10坤岁摄」修正为「10岁摄」
- order 重排：第三季=1（最早）、过春天=2、在遥远的地方=3

### 经验沉淀（待写入 skill）

- 微信长链带 poc_token 会触发环境验证 → 优先让用户提供短链（/s/xxx 格式）或本机另存 HTML；skill 应补「抓取受阻降级路径」一节

## 会话记录（skill 测试：《第三季》发布 + magnum 模板 + 双技能，2026-08-30）

### 交付（分支 feat/welfare-article，随 PR 17 合入 main）

- **第三篇文章《带上她的眼睛 | 第三季》**：2026-03-05，58 图入 R2
  welfare/bring-her-eyes/season-three/；五章节 + 沁园春开头 + 抒情诗 + 合作教师 6 位；layout:
  magnum
- **magnum 模板**（layout-analyzer 首次实战）：居中细列头版、大图 720/瓦片行交替（突破版心 1080px、等高原比例不裁切）、正文与图注左对齐、Next
  Story 左竖线互链卡
- **延伸阅读收敛**：三模板统一只显示紧邻一篇（优先下一篇，末篇回退上一篇）
- **小组介绍合影位**：成员照片墙（R2 about/team-photo.png）
- **双技能沉淀**：.agents/skills/welfare-article/（发布流程）+
  .agents/skills/layout-analyzer/（排版规格提取）；本次实战反馈待补：①微信长链 poc_token 拦截 → 降级短链/本地 HTML；②R2 分批上传防中断

### 流程记录

- 延伸阅读语义两轮修正（cardTitle、上一篇/下一篇方向）；「10坤岁摄」玩梗图注保留（正文一字不改规则同样适用于图注）
- ⚠️ 流程违规一次：字体统一小改动误直推 main（c0e9e6c），后续已恢复分支-PR 流程

## 会话记录（《时间的故事》八月篇 · 画廊模板设计，2026-09-08）

### 状态：设计阶段（分支 feat/story-of-time，基线 ./init.sh 全绿）

- 目标功能：feat-018 小组活动 ·《时间的故事》八月篇（微信推文 → 网站画廊页）
- 用户要求：与 welfare 同一 layout 家族，但形态是「带一点文字说明的画廊」；layout 方案用 ui-ux-pro-max 技能设计
- 设计规格已产出：/tmp/layout-specs/story-of-time.md（待用户确认后实施）
  - Pattern：Scroll-Triggered Storytelling（日期章节 + 阅读进度条 +
    reduced-motion 降级）
  - 新增 activities collection + /activities/[slug].astro 按 layout 分发 +
    GalleryStory.astro 模板
  - 画廊条目 = 照片 ≤960px 原比例 + 居中墙标签（作品名宋体 / 说明 sans muted
    / 署名 grad-a）
- ⚠️ 阻塞项：微信页正文图片为 blob: URL 无法抓取，需用户提供 19 张作品图 +
  1 张封面原图 → R2 activities/story-of-time/2026-08/

## 会话记录（《时间的故事》八月篇交付，2026-09-08 续）

### 交付（分支 feat/story-of-time）

- **图片自抓成功**：设计阶段的「blob: 阻塞」已解除——微信页 HTML 的 data-src 含真实 mmbiz
  CDN URL；curl（MicroMessenger
  UA）直接下载 21 张（封面 1080×459 + 正文 19 张 1080 宽 + 组委会品牌图），抽查图文对位正确
- **日期映射**：原文「日期仅在变化时显示」（19 条目仅 11 个日期头，8 个缺失位以「——StoryofTime」装饰行出现）；以 raw
  HTML 中日期串与 jpeg
  data-src 的位置先后对齐，全部条目落到确切日期（康布的黄昏=8月1日、暗处符号=8月7日、星轨/寄愿=8月13日、中元=8月25日 等）
- **R2**：`activities/story-of-time/2026-08/`（cover.jpg + 01-19.jpg +
  committee.jpg），21 文件公开 URL Content-Length 逐一比对通过
- **代码**：content.config.ts 增 activities collection（entries[] 结构化条目 +
  poem/pastIssues/committee 字段，宽高入库防 CLS）；src/content/activities/story-of-time-2026-08.md；GalleryStory.astro（画廊模板：居中细列头版/edge 封面/初心段/日期章节/墙标签条目/诗/往期 chips/组委会/相邻期卡/2px 渐变进度条/IO 入场一次性定格 +
  reduced-motion 与 html.js 降级）；pages/activities/[slug].astro 按 layout 分发；ActsSection「时间的故事」卡换真实封面并直连 /activities/story-of-time-2026-08/
- **正文忠实**：19 条说明文字一字未改（保留「没想道」等原文拼写）；多段说明（Ring
  of Fire、线·影·人·潮）以 \n 保留段落
- **验证**：./init.sh 全绿（astro check + tsc 0 错误、eslint
  0 错 0 警、8 页构建）；judge 三轮视觉验收 overall
  pass（桌面 8 区 + 移动 4 区 + 深色 2 张 + 首页活动卡）

### 验收中发现并修复 / 排除

- 修复：375px 头版 meta 行折行出现行首孤立「·」→ 间隔点改挂各项末尾 +
  ≤700px 竖排隐藏间隔点
- 排除（截图侧误报）：懒加载未完成即截图导致「图片塌陷/黑条」误报两轮 → 协议改为全量 eager +
  complete 轮询 + 静置；「霞染渔湾」白边框为作者三联拼图原片自带

### 经验沉淀（待写入 skill）

- 微信图片抓取：网页转换器常给 blob:（懒加载），应直接抓原始 HTML 提取 data-src（mmbiz
  CDN 可匿名下载）；日期类装饰行缺失字段需用位置对齐还原
- 截图验收协议：长画廊页必须等视口内图片 complete（最好 eager 化全量等待）再截，否则必然产生布局塌陷误报

## 会话记录（《时间的故事》活动主页 + 版式重构 + 1-7 月补齐，2026-09-08 续二）

### 用户反馈驱动的三项改动

- **活动主页**
  `/activities/story-of-time/`：介绍区（kicker/金句/初心）+「往期回顾 Editions」白框相片卡网格（期数角标/副题/期数·作品数），对齐 welfare 二级页模式；首页「时间的故事」卡改指主页，不再直达八月
- **版式重构**（用户点名参考哈苏大师赛/马格南）：条目按画幅分型——side（竖/方幅 h≥1.2w）照片居左大幅（≤84vh）+ 说明右侧 sticky 栏左对齐；stack（横幅）照片突破版心通栏居中（≤1360px/80vh）+ 说明下方居中；≤900px 统一上下排版；横幅从 960px 上限放大到通栏，竖图从 648px 高放大到 84vh
- **1-7 月补齐**：v3 抓取管道（/tmp/story-of-time/pipeline.py）一次跑通 7 期——处理了：日期仅在变化时显示（位置对齐还原）、一稿双图（三月 2 条，schema 改 images[]）、png 正文图（一月「金穹巡舟」）、标题 «»/「」两种形态、每月不同的组长/编辑/组委会名单、尾部品牌图 committee（svg 装饰排除；一月无品牌图）

### 数据规模

- 8 期共 204 个条目 / 206 张作品图（三月 2 条 × 2 图）+ 各期封面/品牌图全部入 R2
  activities/story-of-time/<2026-MM>/，逐字节校验通过（首轮 ~60 张因会话中断失败，自动补传循环一轮清零）
- md 由 gen_md.py 从 draft.json 生成（单行标量一律 JSON 双引号防原文引号/冒号歧义；多行说明用块标量；宽高入库防 CLS）
- 8 期条目数逐页断言：08=19、07=22、06=33、05=26、04=23、03=28、02=25、01=28，0 坏图

### 验证

- judge 第 4/5 轮：side/stack 版式 + 活动主页 overall
  pass（「爱意」褪色误报经 img.decode() 全量等待 + opacity 断言排除）
- judge 第 6 轮：主页 + 七期新月抽查（hub 网格/三月多图/六月首末/二月诗/移动端）
- ./init.sh 全绿（astro check + tsc 0 错误、eslint 0 错 0 警、16 页构建）

### 经验沉淀（待写入 skill）

- 微信编辑器陷阱集：日期条可省略（需位置对齐）；一稿多图（连续图片共用标题块）；正文图可能是 png；标题书名号有 «»/「」两种；组委会名单每月不同；尾部品牌图可能缺失（svg 分隔线不可当图片）
- gen_md 类生成器必须把所有单行标量 JSON 引号化——原文说明里的英文直引号会让裸 YAML 标量断裂

## 会话记录（画廊优化 P0-P2 + 期数分页，2026-09-08 续三）

### 用户审计反馈 → 全部落地

- **P0 图片优化**：442 张 WebP（640/1080 双档，cwebp q80）入 R2 + <picture>
  srcset（sizes 按分型：side 640px/stack 1080px）+ JPEG 原图回退 +
  **onerror 回退**（webp
  404 时 img 自动切 jpg 原图）；单页图重 7MB→5MB（桌面 1080 档）/
  2.1MB（移动 640 档）
- **P1 lightbox**：点击照片全屏浏览（计数/左右切换/Esc/点背景关/焦点管理/html
  overflow 锁滚动保滚动位/reduced-motion 无动画）；JPEG 原图直出
- **P1 期数分页**（用户需求）：移除「往期回顾 chips + 相邻期卡」，文末双卡——左=下一期（无则「敬请期待·新一期筹备中」），右=上一期（无则「已是最早一期」）；八月/七月/一月三组断言全对
- **P1 side 左对齐**：竖图贴内容左缘（img 左缘=版心左缘 96px@1440）
- **P2**：多图 2-up（--cols 显式列数，移动端单列）；chapter-en
  11px；多图 alt（1/2）；回到顶部玻璃圆钮；hub「最新」渐变角标 + 卡片封面 webp；JSON-LD
  ImageGallery（eslint 按文件豁免 no-set-html-directive）
- 图片 URL 全部加版本查询参数 `?v20260908a`（cache-busting）

### ⚠️ r2.dev 边缘事故（重要经验）

- 现象：同一 URL 的 200/404 按分钟级翻转；curl 常通而浏览器请求停滞/404
- 根因链：①webp 上传完成前，早期测试会话已请求这些 URL
  → 边缘缓存 404；②r2.dev 公开域多缓存节点独立 TTL
  → 部分节点毒化部分干净 → 请求轮询导致时好时坏；③本机网络对 r2.dev 的浏览器路径（疑 HTTP/3）劣化，curl 正常
- 佐证：金丝雀对象 8 分钟 5 次探测全 200（对象没被删）；严格校验两遍 GET
  200+字节一致全过（442/442）
- 缓解：版本查询参数（新缓存键必然回源）+ img
  onerror 回退 JPEG + 真实访客首发缓存干净
- **建议用户**：给 R2 桶绑定自定义域名（r2.dev 是无 SLA 的 dev 域），生产稳定性与缓存行为都可控

### 验证

- ./init.sh 全绿（0 错 0 警，16 页）；lightbox/分页/左对齐/2-up/回顶全部程序化断言通过
- judge 第 8 轮：lightbox
  pass；其余 fail 项经查全部为 r2.dev 边缘事故期的截图取证问题（破图=404 缓存），非页面缺陷——分页卡/side 左对齐已有渲染完好截图（shots6/s9-*.png）

## 会话记录（架构定稿：展示图迁入仓库同源分发 + R2 绑自定义域，2026-09-08 续四）

### 用户决策：保留 R2 + 绑定域名

- 用户明确「不弃用对象存储，绑定域名」→
  `wrangler r2 bucket domain add seeker-homepage-assets --domain r2.xn--seeker-ng2jm403afb4a.club --zone-id 1efd52ca...`（zone 经 wrangler
  OAuth token 调 CF API 查得）
- 全仓 363 个 r2.dev URL 替换为
  `https://r2.xn--seeker-ng2jm403afb4a.club/...`（8 期 md + 3 篇 welfare md +
  ActsSection/Banner/AboutSection）

### 展示图迁入仓库（astro:assets 同源分发）

- 221 张原图入 `src/assets/activities/<slug>/`；activities
  schema 改 image()（cover/committeeImage/entries.images）——image() 元数据自带宽高，md 中的手工 width/height 全部删除
- GalleryStory：layout="full-width"（封面）/
  "constrained"（条目/组委会），astro:assets 自动 WebP 多档 srcset +
  CLS 预留；手工 WebP 管线/版本参数/onerror 回退脚本全部移除（被本地管线取代）
- hub 卡片封面改
  <Image>（原 background-image 无法回退懒加载）；ActsSection 封面走 import 资产；astro.config 加
  `site: https://seeker-homepage.pages.dev`（og:image 绝对 URL）
- gen_md.py 同步改相对路径输出（未来期数一致）
- 效果：页面 0 个跨域图片引用，srcset
  4 档（640/750/828/1080w），构建期一次性优化 16.8s（有缓存）

### 最终验证

- judge 第 9 轮（最终）：10 张截图 overall pass /
  must_fix 空——「连续三轮的图片时好时坏问题在本轮 10 张中零复现」
- ./init.sh 全绿（0 错 0 警，16 页）；8 期逐页滚动断言渐进懒加载正常
- R2 分工定稿：原图备份 +
  welfare 图床（自定义域）+ 大文件（视频）；页面小图走仓库同源

### 经验沉淀（待写入 skill）

- wrangler 4.x 已支持 `r2 bucket domain add/list`（--domain --zone-id
  -y）；zone-id 可用 wrangler OAuth token 调 CF API GET
  /zones 查得（但该 token 无 zone
  settings 权限，http3 开关这类设置要在 dashboard 做）
- R2 自定义域绑定后需等 DNS/证书传播（分钟级），期间偶发 404
- r2.dev 公开域慎用于生产页面图片：边缘多节点独立缓存 + 限流，上传完成前的请求会把 404 毒化进边缘缓存且按 TTL 迟迟不散

### 用户复核反馈（2026-09-08 收尾）

- 期数分页对调：左=上一期、右=下一期（八月右位「敬请期待」不变）；断言八月/七月两页全对
- side 型题注空隙：照片列 1fr→auto（列宽随图），题注紧贴照片右缘（实测 36px，改前宽屏约 400px）
- 用户复核第二轮：side 组合（照片+题注）在版心内居中（pairCenterOffset=0）；尾声前加分隔线（细线+渐变菱形，与日期章节同语言）
- 用户复核第三轮：side 型题注列定位于屏幕约四分之三（栅格 76%/1fr，实测 captionLeft=75vw）
- 用户复核第四轮：side 照片位固定（列内居中，左缘 312px@1440
  ≈ 整组居中版参考位 300px），题注列起点 = 屏宽 74-75%

## 会话记录（夜间模式拍立得卡片修复，2026-09-08）

### 交付（分支 fix/dark-mode-polish）

- 用户反馈：夜间模式下小组活动区的白色拍立得卡片太刺眼；配色要求继续遵循 Catppuccin 调色板（Latte/Mocha）
- 根因：三处拍立得/白框相片卡硬编码浅色值（`#fff` 相纸、`#3a3f55`/`#9093a8`
  文字、Latte 灰阴影），不随主题切换：
  1. `ActsSection.astro` 首页活动照片堆
  2. `welfare/index.astro` 图文手记堆叠卡
  3. `activities/story-of-time.astro` 往期回顾相片卡
- 修复：global.css 新增界面令牌（沿用 feat-021 令牌模式）——`--paper-face`
  （相纸）、`--paper-ink/--paper-sub`（卡上文字）、`--paper-shadow(-lift)`（阴影）
  - Latte（浅色默认）：白相纸 + 原字色 + 原灰阴影（浅色外观零变化）
  - Mocha（深色）：相纸 Surface0 #313244、标题 Text #cdd6f4、副文字 Subtext0
    #a6adc8、黑阶阴影（0 18px 44px / lift 0 30px 64px rgba(0,0,0,.5~.55)）
- 三处组件硬编码值全部替换为令牌；lightbox 白色控件（GalleryStory
  `.lb-btn`）为暗场 UI 两种主题下都正确，不动

### Evidence

- 浏览器实测（dev
  4321，1280×800）：深色下首页活动堆/welfare 手记堆/时间的故事往期卡均为 Mocha 相纸，与背景协调、文字可读；切回浅色三处外观与改前一致
- ./init.sh 全绿：astro check + tsc 0 错误、eslint 0 错 0 警、16 页构建
- 用户需求：往期回顾按年份分组——hub 按各期 pubDate 年份分组渲染（年份标题+细线+期数，倒序），未来 2025/2024 各期上传后自动成组；最新角标改按 newest
  id 标记

## 会话记录（2025 全年 + 历史期数全量上站，2026-09-09 深夜）

### 用户指令

- 合集页（73 篇）全部整理上站；2025 无 1/2 月文章（启年篇代替）、2024 四月前为一季度合集、另有特别篇
- 全权自行处理；**绝不自行创建 PR/合并**，用户晨起复核后决定
- 画质优先：不许过度压缩，大横图发虚不可接受

### 交付（分支 feat/story-of-time-2025，未合并）

- 合集页浏览器滚动加载全部 73 篇 → 清单解析：62 个唯一期数（6 对重发去重）+
  3 条非画廊内容剔除（航拍活动通道/线下讲座×2）
- 年份分布：2026=8（已在线）、2025=11（启年篇+三月~~十二月）、2024=10（一季度合集+四月~~十二月）、2023=12、2022=12（叁月篇原样）、2021=11（二月~十二月，无一月篇）
- 解析器 v5：@作者行收口切块（标题/日期可选）；装饰图按跨文章 URL 频次过滤（≥3 篇=装饰）；尾部品牌图→committee；诗阶段 JS 行终止
- 全部展示图入 src/assets（astro:assets 同源分发，quality
  90）；R2 备份本轮未做（git 即备份）
- 期数 order 全局时序化（年×100+月），跨年期数分页正确
- 断言：62 期逐页条目数与原文一致、0 坏图；2025-08（30 张 PNG 图）与 2022-02（纯文字回顾篇）修正后正常收录
- init.sh 全绿（0 错 0 警，72 页）

### ⚠️ 遗留（晨起复核清单）

- 2025-08 的 30 张图是 PNG（其他期为 JPEG）——已验证渲染正常，仅提示
- 2021-02 尾部「如何加入这个计划/【时间的故事】邀请行」两行混入诗块（原文如此位置，保留）
- 2022-02 尾部时间的故事集分隔行归属类似上条
- 截图 daemon 在长会话后 EAGAIN：复核如遇截图失败，pkill -9 -f
  agent-browser 后重试

### 经验沉淀

- 微信合集页：静态 HTML 只含前 10 篇，其余靠浏览器滚动触发加载；直接抓取拿不到全量
- 早期（2021-2022）版式差异：无 @author 行的文章存在（极老），宁缺勿滥按无署名条目处理会丢——本批未遇到，列为已知风险

### 书架版式评审落地（judge 设计评审采纳项）

- P0 滚动可发现性：右缘渐隐（滚到队尾自动隐藏）+ 悬停显隐左右圆形箭头（禁用态自动隐藏）+ 鼠标拖拽滚动（拖后拦截误触点击）+ 细滚动条
- P1 架板厚度感（顶亮/底暗双色 + 深色模式变体）；书册 hover 落地投影加深；年份锚点行（点击平滑跳层）
- P2 计数对比度加深；书名压封面底部渐变衬底（白字，替代架下文字）；书签带挂书顶
- 未采纳：滚轮横移映射（箭头+拖拽已覆盖，避免劫持纵向滚动）；渐变标题对比（全站既有设计）

### 年份分组与书架布局（2026-09-09）

- 活动主页「往期回顾」按年份分组，每年一个独立区域，年份倒序
- 「书架」布局：每年一层架板（暖木质渐变），期数为一册册竖放的书（竖版封面裁切 + 书脊暗条 + 高度错落 232-258px）
- 最新一期挂书签带（渐变红蓝 + 「新」字）；hover 抽书（上提微倾 + 落地投影加深）
- 横向滚动：右缘渐隐提示 + 悬停左右箭头（到位自动禁用）+ 鼠标拖拽 + 细滚动条
- 年份锚点行（点击跳层）；深色模式架板变体
- judge 设计评审：书架隐喻成立且克制优雅；落地 P0 滚动可发现性 + P1 架板厚度感 +
  P1 年份锚点 + P2 计数对比度

### 作者配对修复（2026-09-10，feat/story-of-time-2025）

- 根因：2021-2025 旧版式为「@作者 → 图/图注」，旧解析器按 2026 版式（@ 在图后）配对，导致全部 56 期作者整体错位一位、每期最后一位作者的照片漏下载、其署名并入尾部文本
- 重建管线（脚本在 /tmp/story-of-time-v2，微信 API 合集分页 begin_msgid 翻页取全 73 篇）：
  1. 重下载 64 篇文章 HTML；解析 js_content 事件流（svg/gif 装饰剔除）
  2. 以「@作者开块」重建条目：尾部标记（写在最后/如何加入/组委会等）后进入尾段，尾段中遇 @ 重新开块（兼容 2021-05 末尾彩蛋条目）；按 (作者,图组) 去重（2022-08 文章自身有整段重复的编辑事故）
  3. 本地资产 md5 哈希比对复用；缺失图补下载（每期 1 张，共 58 张）；未引用外来文件删除（2021-06 整夹为七月篇图片，全部换新 29 张；2022-08 两张重复图）
  4. entries/poem/team/committee/excerpt 全部由 HTML 重推：poem 原混入尾部「如何加入/组委会」垃圾文本（页面可见），现只保留「写在最后」段结语；正文 md 由生拼原文改为干净导语，开篇引言提为 quote 字段（与 2026 期一致）
- 验证：56 期页面 item-author 序列与文章真值序列 56/56 一致；截图抽查 2023-11（首条屋顶数星星 + 末条 Jackli 补图）、2021-06（ke0v0 银河图）正确；type-check
  0 错误、lint 通过、build 72 页通过
- 遗留：2021-06 图片文件名从 30 起编（旧 01-29 为七月篇垃圾已删）；条目名编号不连续，仅影响文件夹美观不影响展示

### 全量视觉验收（2026-09-11 凌晨，验收人：agent 逐张目验）

- 范围：64 期全部（2021-02 →
  2026-08，1915 个条目），每期截图 3-5 锚点（首条/中段/末条/页尾），2021-02/03/04 三期逐条全览
- 结论：**64/64 通过，零错配**。作者-图片-图注三方一致；重点复核 2023-11（屋顶数星星首条）、2021-06（整夹重建）、2021-05（彩蛋条目）、2022-08（原文重复段去重）、2023-07、2024-03（一季度合集）、2025-01（启年篇）、2023-12（跨年导航卡）均正常
- 决定性旁证：≥15 个条目照片自带摄影师水印，与站点署名一致（Icer冰冰冰、葛炮的号哭、正陽兮門下、LucasSun、May、DawnTideNN、XINXIAO、xchen、Daniel李、Jack.li、YaphetsYi境、Min铭皓、逸晨、快门3w次、守仁）
- 方法：微信原文 HTML 真值序列比对（56/56 一致）+ 无头 Chrome 截图人工目验；过程记录 /tmp/story-of-time-v2/audit_log.md
- 已知非问题：IAB 内置浏览器对 3 万像素长页截图有灰帧/超时（渲染时序），与站点数据无关；改用无头 Chrome 后消失

### 文字排版专项优化（2026-09-11 凌晨）

- 全量扫描 64 期图注数据 + 渲染结果，修复四类瑕疵：
  1. 孤行符号：单独成行的「。」「------」「#」「】」及零宽连接符，共 60 行清除
  2. 栏目标签残留：图注末尾混入的「自然户外组/城市建筑组/人文纪实组/人像肖像组/商业创意组」等
  3. CJK 折叠空格：YAML 单引号多行折叠导致的中文字间空格，全部归一
  4. 2021-08 结尾结构：毕业去向版块的祝语/诗句从末条图注移入尾诗引文，照片墙式条目（无文字）图注置空
- 渲染端：图注增加 text-wrap: pretty（防换行后末行孤字）；空图注不再渲染空段落
- 回归：64 期 YAML 全部有效、作者序列 56/56 一致、type-check
  0 错误、lint 通过、build 72 页通过；修复点截图逐一目验确认
- 提交：fb36c99（未建 PR，待用户验收）

### 美观向整体优化（2026-09-11 凌晨第二轮）

- **栏目章节恢复**（45 期）：2022-2025 原文的「城市/自然/人文/人像/静物创意」及2025 起的「月影集/自然户外组/城市建筑组/人文纪实组/人像肖像组/商业创意组」分类结构，此前被当作图注垃圾清除；现从原文事件流重新提取为 entries.group字段（schema 新增 optional），画廊按连续同栏目分章，渲染与日期章节同款的细线夹标题分隔（1378 个 group 字段，45 期）
- **超长竖条拼接图**（h≥3w 的竖排串拍）：新增 strip 分型，按胶片长卷全宽呈现（此前在 side/stack 高度上限下渲染成约 100px 宽的细缝，完全看不清）
- 回归：YAML 全部有效、作者序列 56/56 一致、type-check 0 错误、build
  72 页通过；组章节（2023-11、2025-08）、长条图（2021-10 苏州华谊）、书架 hub 截图目验正常
- 提交：未建 PR，待用户验收

### 书架页「画册式照片卡」改版（2026-09-11，参考 Stephen Shore 画册展示）

- 背景：旧版把 2.35:1 的横幅封面硬裁成 172px 竖放书脊，照片信息几乎全部裁掉；用户要求参考 stephenshore.net/m/books.php 的画册式呈现（照片裱在素色卡纸 + 小字图注），回到主分支拍立得纸卡风格并放大面积
- 实现（src/pages/activities/story-of-time.astro）：
  1. 卡片结构：宽幅封面完整裱在拍立得纸卡（复用 --paper-face/--paper-ink/--paper-sub 设计令牌，明暗自适应）上，卡面下方写小字图注——「期数 |
     MAY 2025」小字排印行 + 宋体主题句（最多两行）+「N 幅作品」
  2. 卡片 280px 宽（移动端 236px，原 172/148px），面积约原来 2 倍；photo 区 aspect-ratio
     1080/459 完整显示封面不裁切
  3. 微倾错落（5 张一循环 ±1.3deg）立在木质架板上；hover/聚焦转正上提 + 「翻阅 →」浮现（prefers-reduced-motion 门控）
  4. 「新」书签带移到照片右上角；顺手清理了样式表里整段重复的箭头/渐隐规则
- 保留：每年一层书架 + 横向翻阅（箭头/拖拽/右缘渐隐）、年份锚点、hero 文案
- 验证：astro check 0 错误、lint 通过、build
  72 页通过；桌面 1440/移动 390、明/暗模式、hover 态截图逐一目验（/tmp/sot-shelf/）

### 删除木质架板 → 悬浮落地影（2026-09-11，用户反馈）

- 用户反馈拍立得卡下方的金色木质架板太丑，与画册卡语言不搭；删除 .books::after 架板（含暗色变体）
- 替代设计语言：卡片悬浮在版面上，.book::after 椭圆落地软阴影（radial-gradient +
  blur，明暗两套），与首页拍立得堆的悬浮语言一致；hover/聚焦提起时落地影变淡收窄（.book:has() 联动，reduced-motion 门控）
- .shelf-scroll 底部 padding 26→20px
- 验证：type-check 0 错误、lint 通过、build 72 页；浅色/暗色 + hover 态截图目验

### 恢复拍立得白框（悬浮式）（2026-09-11，用户澄清）

- 澄清误解：「不要框」实指让拍立得白框卡片做成悬浮式，而非去掉白框；revert
  51dcff1，回到「白框纸卡（图注在卡面）+
  paper 悬浮阴影 + 椭圆落地影（hover 联动变淡收窄）+ 微倾错落」，木质架板保持删除；仅修正注释措辞（立在架上 → 悬浮在版面上）
- 验证：type-check 0 错误、lint 通过、build 72 页；浅色截图目验

### 删除椭圆落地影（2026-09-11，用户反馈第三轮）

- 用户指出椭圆落地影在卡片下缘形成模糊「影子框」，观感未达预期；删除 .book::after 椭圆影、暗色变体及 :has
  hover 联动，拍立得白框卡片仅凭自身 --paper-shadow 悬浮在背景画布上，hover 时投影加深为 --paper-shadow-lift
- 验证：build 72 页、lint 通过；浅色/暗色截图目验（影子框消失，悬浮感干净）

### 阴影带修复（2026-09-11，用户截图标注反馈）

- 用户标注截图：整排卡片底部的大范围投影（全局 --paper-shadow
  38px 大模糊、下移 14px，在 30px 间隙密排下互相叠加）连成一条「阴影带」，即用户此前说的「阴影大框」
- 修复：书架页 .book-card 局部覆写 --paper-shadow /
  --paper-shadow-lift 为紧贴卡片的小半径双层影（1px 贴边 +
  16px 漂浮，暗色对应加深），卡片各自独立悬浮，间隙恢复干净画布；hover 抬起仍换 lift 影
- 验证：build 72 页、lint 通过；浅色/暗色截图目验（阴影带消失）
