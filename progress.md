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
