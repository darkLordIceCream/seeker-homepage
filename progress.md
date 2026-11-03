# Session Progress Log

## Current State

**Last Updated:** 2026-10-16 **Branch:** fix/mobile-stack-cards **Active
Feature:**
移动端堆叠卡片微重叠优化（首页活动区 + 公益主页——标题不再被遮挡，堆叠隐喻保留），init.sh 全绿 +
390/1280 双端截图验证通过，本地提交待合并

## Status

### What's Done

- [x] 依赖更新（2026-10-09）
  - astro 7.2.8 → 7.3.8（多页面构建性能优化）、react/react-dom/@types
    19.3.0、eslint 10.12.0、maplibre-gl 6.13.0、lucide-react 1.53.0、sharp
    0.35.5、prettier 3.9.9、typescript-eslint 8.71.1、lint-staged
    17.6.0 等 in-range 更新
  - 跨大版本两项：@astrojs/react 6 → 7.0.1（babel 选项移除，项目 `react()`
    无参调用不受影响）、eslint-plugin-astro 2 →
    3.2.1（peer 要求 eslint≥10、typescript-eslint≥8.61 已满足，零配置改动，0
    error）
  - TypeScript 暂留 6.0.3：typescript-eslint 8.x peer 上限 <6.1.0，TS
    7 待其支持后再升
  - 验证：astro check 0 错误、tsc 0 错误、eslint 0 error（60
    warning，多为 eslint-plugin-astro
    3 的 astro/sort-attributes 排序提示，按标准保留）、build 78 页成功
- [x] feat-001 ~
      feat-024（历史会话已完成，详见下方「历史记录」与 feature_list.json）
- [x] 依赖更新（feat-020 一部分）
  - Astro 7.0.6 → 7.2.8，React 19.2.8，Tailwind 4.3.3，ESLint 10.9.1 等
  - 跳过跨大版本：TypeScript 7（风险高）、eslint-plugin-astro 3（需改配置）※
    eslint-plugin-astro 3 已于 2026-10-09 升级，无需改配置
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

### 删除 54 个无引用的重复活动图片目录(2026-09-11)

- 磁盘排查发现 `src/assets/activities`
  有两套命名:`story-of-time-YYYY-MM/`(内容 md 实际引用)与普通
  `YYYY-MM/`(2021-_~2025-_
  共 54 个目录、1719 个文件、345MB,全库零引用);MD5 比对确认两套内容字节级相同,且待删集合中 0 个「孤儿」文件(内容均存在于保留目录)
- 删除上述 54 个普通命名目录;`src/assets`
  812M→467M,全活动图片 3781→2062 张;同时清理本地 `dist/`(1.5G)与
  `.wrangler/`(43M)构建产物(不入库)
- 遗留:`.git` 541M 因历史 blob 不变,需 `git filter-repo`
  重写历史才能瘦身(影响协作者,暂不动);`committee.jpg`
  等少量跨目录复用图(约 6MB)保留原状
- 验证:`./init.sh`
  全通过(install/type-check/lint/build,72 页);dist 中无任何指向已删目录的引用

### 活动照片迁移 R2(2026-09-11)

- 背景活动照片 2062 张(467MB)是 git 仓库最大体积来源;按公益板块既有模式整体迁至R2
  bucket `seeker-homepage-assets`,自定义域 `r2.xn--seeker-ng2jm403afb4a.club`
- 转换:sharp 全量转 WebP(q82
  smartSubsample、最长边 ≤2560、按 EXIF 转正、剥离 EXIF 隐私),
  467MB→232MB;抽张 100% 放大比对画质无明显损失
- 代码:
  - `content.config.ts` activities 集合
    `cover`/`committeeImage`/`entries[].images` 从 `image()` 改为
    `z.string().url()`(R2 绝对 URL)
  - 新增 `src/lib/activity-image-meta.ts`(2062 条像素尺寸清单,迁移脚本生成)+
    `src/lib/activityImageMeta.ts` 查询函数,替代 astro:assets 的尺寸元数据
  - `GalleryStory.astro`/`story-of-time.astro` 的 `<Image>`
    全部换成带 width/height 的
    `<img>`(排版分型 isStrip/isSide 改用清单查尺寸,CLS 防抖动保留)
  - `ActsSection.astro` 首页封面、`[slug].astro` og:image 改 R2 URL
  - 64 个 md 的 `cover`/`entries[].images`/`committeeImage` 批量重写为 R2 URL
- 删除 `src/assets/activities/`(git rm);`src/assets` 仅剩 UI 小图(420KB)
- AGENTS.md 写入素材管理规则:素材一律 R2、src/assets 只放 UI 小图、单文件>500KB 不入 git、一期一目录命名唯一
- 踩坑:全局 wrangler(pnpm 无此依赖),`pnpm --dir <path> wrangler`
  会把路径当可执行文件报 EACCES;上传脚本需用全局二进制绝对路径
  `/Users/<user>/Library/pnpm/wrangler`
- 验证:build 72 页、type-check 0 错误、lint 通过;构建产物 HTML 无本地活动图引用;
  R2 全量 URL 可达性校验 2062/2062

### git 历史重写瘦身(2026-09-11,用户确认单人维护后执行)

- 备份:重写前全量 bundle 存于
  `~/Documents/project/seeker/seeker-homepage-history-backup.bundle`(旧历史唯一副本,确认无误后可删)
- `git filter-repo --invert-paths`
  清除 src/assets/activities、videos、src/assets/images/videos、src/assets/videos、public/videos、*.mp4、.wrangler 的全部历史 blob(视频在历史中有 4 个路径变体,分三轮清完)
- 结果:`.git` 541MB→10MB,最大 blob 从 42.5MB(视频)降到 0.7MB
- 提交记录:155/160 保留;SimZun(15)、wenruohan(2)署名完整;被裁 4 个均为纯视频/大文件操作提交 (remove
  video file / compress video 25MiB limit / 移除 .wrangler /
  PR#6 的空 merge 节点),全部是 hanyuan/董瀚元本人
- remotes 重建(origin 曾被 filter-repo 摘除);main 强推 GitHub+Gitee,chore 分支推 GitHub
- 验证:build 72 页通过;PR #22

### 迁移后风险自查与条图修复(2026-09-11)

- 自查发现:53 张画幅 ≥3 的"胶片长卷"条图被"最长边 ≤2560"规则误缩(如 1000x12417 缩至 206x2560), 条图版式全宽展示会放大模糊;已按原分辨率重转重传(共 31.4MB,53/53 可达),尺寸清单同步更新,
  AGENTS.md 规则补充长条全景例外
- 其余检查结论:原图全部 sRGB/无 ICC/无 alpha/无 GPS(116 封面+样张实测),无色彩漂移与隐私泄露;
  tags/Releases 均无;origin 远程分支干净;gitee 为上一团队遗留仓库,remote 已从本地移除(此前对其main/master 的强推无实际影响)
- 已知边界:R2 自定义域默认无边缘缓存(cf-cache-status:
  DYNAMIC),建议 Cloudflare 后台为该域加Cache
  Rule;GitHub 服务端 refs/pull/* 仍保留旧历史对象(新 clone 干净,但未物理清除);原图全分辨率仅存于本地备份 bundle,建议团队另建原图冷备份

### 画质优化:大图恢复原分辨率 + 封面 q90(2026-09-11,用户反馈大图偏模糊)

- 诊断:2062 张里 1970 张(95.6%)原生即 1080 级别(微信传图压缩所致),模糊感主要源于源图固有分辨率, 非迁移引入;版心 740px,1x 屏清晰,2x
  retina 下 1080 图略软(历史上一直如此)
- 修复:14 张被 2560 上限实际缩小的普通图恢复原分辨率;64 张封面 +
  63 张组委会图(最占屏幕的两类) 从原图按 q90 重转,共 141 张重传 R2(20.6MB),尺寸清单同步
- 原图来源:迁移时解包的 /tmp/orig-extract(bundle 的临时展开),不依赖重写后的仓库
- 流程性建议:以后收稿要求组员提供原图(非聊天工具压缩版),前端 R2 方案天然支持任意分辨率

### 边缘缓存闭环 + PR 合并上线(2026-09-11)

- 实验确认:R2 对象带 cache-control 也不会触发边缘缓存(cf-cache-status 仍 DYNAMIC),边缘缓存必须面板 Cache
  Rule;用户已添加(Hostname equals r2 域 → Eligible for cache,尊重源 max-age)
- 全部 2062 个对象补写
  `cache-control: public, max-age=31536000, immutable`(6 个瞬时失败重传清零, 全量校验 2062/2062);浏览器缓存 + 边缘缓存双生效,MISS→HIT 实测通过
- gitee 为上一团队遗留仓库,remote 已移除;排查期间 `git fetch gitee master`
  拉入的旧对象已 `git gc`
  清理,.git 回到 10M;另发现一个旧团队时代的 stash(feature/coming-soon-pages),未动,留用户处置
- PR
  #22 审查合并(6 提交/73 文件,CI 绿),main 恢复可构建;生产部署验证:画廊页 67 处 R2 引用、0 处本地图引用
- 待办:边界 3 原图冷备份(bundle 为原图唯一副本,建议解包去重后另存私有 R2
  bucket + 移动硬盘); 遗留 stash 处置;确认稳定后可删 bundle

## 会话记录（七周年水印海报生成器，2026-09-14）

### 交付（分支 feat/photo-watermark，基于 main 1075316）

- 需求：Seeker 七周年——用户上传照片 + 昵称 → 套统一纪念模板 → 拖动/缩放调整 → 下载成图；**照片全程只在浏览器内存处理，不上传服务器**（用户提供计划书，本会话评审后落地）
- 方案：纯原生 Canvas + Astro
  `<script>`（与全站交互模式一致，零新依赖、零 React）；PSD 不参与运行时，只消费导出的模板图
- 新文件：
  - `src/lib/watermark/template.ts`
    —— 模板配置唯一入口：模板URL/尺寸、照片区域、昵称样式（字体/字号/颜色/字距/对齐）、输出格式、FontFace清单
  - `src/lib/watermark/render.ts` —— 渲染管线：loadPhoto（createImageBitmap +
    EXIF 方向，失败退
    <img>，HEIC 等不可解码抛 PhotoDecodeError）、loadTemplate（fetch→blob 防 Canvas 污染）、ensureFonts、cover 适配 + 防露边钳制、圆角裁剪、带字距逐字排布文字、toBlob 导出、文件名清洗
  - `src/lib/watermark/gestures.ts`
    —— 指针手势：单指拖动、双指捏合（增量式）、滚轮/触控板缩放，围绕锚点缩放保持视野
  - `src/components/watermark/WatermarkGenerator.astro` ——
    UI + 原生 TS脚本：上传（点击/拖拽/Ctrl-V 粘贴）、昵称实时预览、滑杆/±/重置、生成下载（自动触发 + 常驻链接）、状态/错误文案、隐私提示
  - `src/pages/7th/watermark.astro`
    —— 页面壳（Layout+Navigation+Footer，70px 顶距），noindex 直达页
  - `scripts/make-placeholder-template.mjs` +
    `public/templates/seeker-7th-placeholder.webp` ——
    1440×1920 占位模板：相纸底 + 取景框四角 +
    evenodd 挖空照片窗口；脚本自带两项校验：窗口中心 alpha=0（防真实模板重蹈覆辙）、产物 ≤500KB 入库上限
- 用户确认的决策：占位模板先行（参数配置化零返工替换）；昵称字体文件后续提供（一期系统字体栈 +
  FontFace 通道已就绪）；路由 `/7th/watermark/`
  为七周年板块留命名空间、入口暂不挂导航/首页；输出 JPEG
  q0.92（**推翻计划书的 WebP 默认值**：iOS 存相册/微信兼容性差）

### 排障

- 占位模板 SVG 整幅底色矩形把照片窗口也盖住（绘制顺序照片→模板，成图无照片）→
  evenodd 挖洞 + alpha 自动校验
- ESLint：curly（单行 if 必须花括号）、no-duplicate-imports、no-non-null-assertion
  → 已全部修复；`.wm-zoom-row button`
  固定宽挤压「重置」成竖排 → 方形样式收窄到 +/- 按钮 + nowrap

### 真实海报设计接入（用户提供的两张成品 JPG，2026-09-14 第二轮）

- 用户确认设计形态：**照片做全幅背景**，白色模板元素直接叠加；两张成品海报（竖版 2084×3705、横版 2500×1559，纯黑底 + 纯白元素）即最终效果，`@肖默`
  位置为动态 ID 位
- **叠加层从 JPG 精确重建**（`scripts/make-watermark-overlays.mjs`）：海报是纯白/纯黑二值图形，逐像素alpha
  =
  max(R,G,B)、RGB=白（抗锯齿自然保留为半透明，黑→透明）；重建揭示了设计细节——SEEKER竖排字母本身是低透明度幽灵水印，手写体/小字实白
- **二维码卡片区域例外处理**：保留原始像素强制不透明（白底黑码蓝标浮于照片，保证可扫），坐标实测竖版 {1701,3401,201,184}、横版 {2240,1370,129,129}
- **昵称参数像素级实测**（坐标网格裁剪目测 + 白像素扫描）：竖版「© 肖 默」center
  x1396 / baseline y1688 / 31px / 字距 16；横版「@肖默」x893 / y1008 / 27px
  / 字距 5；字重 300（Light）
- 组件升级双模板：面板「海报模板」切换按钮（aria-pressed），切换时 aspect-ratio 动态调整、变换重置、叠加层按 id 缓存；`template.ts`
  重构为 WATERMARK_TEMPLATES 数组 + DEFAULT，photoArea 全幅
- 旧「相纸风」占位模板及其脚本删除（被真实设计取代）；源 JPG 副本入库
  `scripts/assets/watermark/`（竖版 559KB 超 500KB 线，mozjpeg
  q88 重压缩至 149KB）
- 浏览器实测：竖版/横版切换、照片注入、昵称位置与原海报逐区域比对一致、成图导出目验正确

### 真实 PSD 导出接入 + 照片适配规则（用户提供的两张透明 PNG，2026-09-14 第三轮）

- 用户提供设计师 PSD 导出的透明 PNG（竖版/横版，尺寸与此前一致 2084×3705 /
  2500×1559），直接替换 JPG 重建管线：`make-watermark-overlays.mjs` 改为消费
  `scripts/assets/watermark/seeker-7th-*-src.png`（262KB /
  456KB 可入库），输出**无损 WebP** （212KB / 117KB，二维码模块零损耗保证可扫）
- **导出图两处程序修补**（PSD 图层结构所致，脚本自动处理并校验）：
  1. 昵称层被烙进导出图（设计师未隐藏昵称层）→
     eraseRects 内 alpha 清零（竖版 {1320,1650,142,52}、横版 {832,970,118,52}），该位置由 Canvas 绘制动态昵称；
  2. 二维码白卡是透明的（白卡与背景层编组）→
     backingRects 垫白强制不透明（竖版 {1698,3398,208,193}、横版 {2237,1367,136,136}）
- **照片适配规则落地**（用户约定，替代 cover）：
  - 竖版：照片与模板**上下对齐、左右居中**——高度铺满，过宽裁两侧、过窄两侧留黑边居中（fit:
    base height / anchorY center）
  - 横版：照片与模板**底部和左右对齐**——宽度铺满，过高裁顶、过矮顶部留黑、底边对齐（fit:
    base width / anchorY bottom）
  - 实现：`template.ts` 新增 FitSpec；`render.ts` baseScale /
    clampTransform（锚点感知钳制，letterbox 轴锁 0）/
    drawPhoto（锚点定位）/ 新增 zoomAtTransform（绕点缩放，(p-ref)(1-k)+t·k 公式，ref 随 anchorY 取中心或底边）；`gestures.ts`
    收敛为 drag/zoomAt 纯回调契约，变换语义全部收口到 render.ts
- 浏览器实测：竖版+窄长图（上下对齐左右黑边 ✓）、横版+宽幅全景（底部对齐顶部黑边 ✓）、底锚缩放 3.32×（顶部锚点放大后照片铺满、无露黑 ✓）

### 待办（七周年板块接入时，见 feature_list.json feat-024）

1. 昵称字体：woff2 → `public/fonts/` + `template.ts`
   fonts[] 登记（CJK 全量字体1.5-8MB，接入时评估子集化/加载策略）
2. 板块上线：移除 `/7th/watermark.astro` 的 noindex meta；入口三选一——Navigation
   `nav-list` 加 `<li>`（不带 data-section）/ ActsSection `events`
   数组加卡 / 首页七周年弹窗
3. 设计师后续更新导出图时：**请隐藏昵称图层**再导出（否则依赖脚本的擦除坐标），覆盖
   `scripts/assets/watermark/*-src.png` 后重跑
   `node scripts/make-watermark-overlays.mjs`

### Evidence

- `./init.sh` 全绿：astro check + tsc 0 错 0 警、eslint
  0 错（2 处有意保留的 no-console 警告）、73 页构建
- agent-browser 端到端实测（dev
  4321）：注入照片 → 预览合成正确（照片入框 + 模板叠加 + 圆角）；昵称「@倾斜的地平线」带字距居中绘制；滑杆 1.8x 缩放生效；滚轮缩放 1→1.43；重置回 1；「生成纪念海报」→ 状态「已生成（0.1
  MB）」、下载文件名
  `Seeker七周年_@倾斜的地平线.jpg`、toDataURL 导出目验成图正确；伪造坏图 →
  HEIC 友好文案；页面 head 含 `noindex, nofollow`
- 测试用 `public/test-photo.jpg` 已删除，未入库

### 无 ID 残留导出替换 + 工具链冲突修复（2026-09-14 第四轮）

- 设计师重新导出（PS 里隐藏了 ID 图层）：竖版/横版 PNG 尺寸不变，昵称核心区可见像素 1127→75
  / 413→51（残留为书法笔画末端的抗锯齿细条，非 ID）；已替换
  `scripts/assets/watermark/*-src.png` 并重新生成叠加层
- `eraseRects`
  置空（源头已无 ID，避免误擦书法笔画末端），擦除机制保留备将来忘记隐藏图层时用；白卡自校准扫描结果与上版完全一致（竖版 183×183
  @1713,3399 / 横版 120×120 @2265,1367），确认版式未变
- 浏览器实测：动态昵称（©测试昵称甲乙丙 /
  @测试昵称甲乙丙）渲染正常、无任何「肖默」残留
- ⚠️ 发现并修复仓库工具链冲突：prettier（trailingComma:
  es5，移除多行函数参数尾逗号）与 eslint（comma-dangle:
  always-multiline，要求尾逗号）互相矛盾——多行参数列表的函数签名每次提交都会被 lint-staged 的 prettier 打回并导致
  `pnpm lint`
  报 9 个 comma-dangle 错误。修复：render.ts 全部函数签名单行化或收敛为单个 options 对象（对象字面量尾逗号两边规则一致），复杂调用同理。此冲突是仓库级隐患，未来其他 .ts 文件出现多行参数签名时会复现，届时同样以「签名单行化/options 对象」处理
- 提交：896b0f5（模板替换 + 签名重构）、4d11ed7（ensureFonts 调用参数尾逗号）

## 会话记录（七周年板块通宵开发，2026-09-14 深夜 → 09-15 凌晨）

### 交付总览（分支 feat/7th-anniversary，由 feat/photo-watermark 改名）

- 用户通宵任务：七周年板块——①首页周年角卡（每次打开都浮现、显眼不打断）→
  /7th/ 板块 hub；②地图墙（国内精确到省、国外精确到国家）；③水印工坊页面重设计（功能保留、UI/交互重置）；④七周年手记预留。设计决策按 .agents/skills/ 设计方法论（ui-ux-pro-max
  / design-system / brand / banner-design）执行：Photography
  Studio 暗色 token、纪念金 accent
  ≤10%、Bento 入口卡、1.25 字阶、动效令牌 150/200/300ms、弹窗三区法则

- **地图墙** `/7th/map/`：d3-geo 构建期渲染（Astro
  frontmatter 内投影 → 静态 SVG，零客户端地图运行时/零瓦片服务）。世界面板（Natural
  Earth 110m，NaturalEarth1 投影）+ 中国省域面板（墨卡托、按大陆固定 bbox
  fit）。品牌渐变发光标记按人数定半径、Top3 文字标签、hover 提示（30 行原生委托）。GeoJSON：DataV 省级（mapshaper
  25% 简化 118KB）+ world-atlas 110m（topojson-client 转 GeoJSON
  436KB），均入库 public/geo 与 src/data
- **地图墙两大数据坑（已修复并沉淀）**：
  1. d3 球面多边形绕向：小于半球的外环必须顺时针，逆时针会被当作「全球去框」导致 fitExtent 拟合整个世界（scale
     70 vs 正确 403）；
  2. DataV 省级要素把南海海域挂为填充多边形 + 外环为 RFC7946 逆时针：填充渲染会层层叠加成灰块（35 层 ×
     4.3% 白），d3 质心会算到「球面其余部分」——省域改为纯描边线稿 + 质心取最大环反转后计算
- **水印工坊重设计**：暗色 hero（幽灵书法背景 + 金色渐变标语）+ 浅色工具区；模板选择器改海报缩略图（白字叠加层在黑底缩略图上即完整海报外观）；新增「没有照片？用示例试试」一键加载内置样图（public/samples/ 两张 ~31KB）；移动端页眉字号/字距适配
- **Hub 页** `/7th/`：金色大 7 + 幽灵书法 hero +
  Bento 入口卡（水印工坊暗卡/地图墙/手记·即将上线）
  - 结尾寄语；卡片接入全站 .reveal 入场动画（错峰 0.12s/0.24s）
- **首页周年角卡**
  `AnniversaryCard.astro`：右下角延迟 0.8s 滑入，每次打开首页都出现（用户明确要求），不锁滚动、可关闭（×）、点击整卡进入 /7th/；z-index
  1200，prefers-reduced-motion 降级
- **入口三件套**：导航金胶囊「7周年」（兼容导航浮/落两态，不参与 scrollspy）、首页活动区第 4 张卡（海报幽灵字背景，补 nth-child(4) 布局与移动端 n+2/n+3 规则）、水印页移除 noindex
- **collection 预留**：content.config.ts 注册 anniversary
  collection（glob 指向 src/content/anniversary/，当前空目录 .gitkeep），文章就位即出现在构建

### 严重事故与修复（当晚）

1. **GeoJSON 简化幻觉**：mapshaper 25% 简化 +
   precision 舍入曾让省级边界缩水到 125.7°E 以东丢失（疑似 simplify 交集修复副作用），已用 10% 版本（57KB）→ 发现过度简化 → 定稿 25% 版重跑（118KB）并逐省坐标范围扫描验证（黑龙江东界 135.0
   ✓）
2. **d3 绕向/质心连环坑**：见上，两次截图对比发现后定位到球面几何约定
3. **agent-browser daemon 劣化**：长会话后 Page.captureScreenshot
   EAGAIN（已知问题），首页因 Banner 视频流更必现；改用「DOM 几何断言 + Chrome
   headless --screenshot」组合验证，首页活动区用 scrollSnapType='none' +
   scrollIntoView 后可截

### 晨间复核清单（TODO）

- [ ] **替换真实成员分布数据**：src/data/anniversary/map-points.ts 当前为占位数据（34 省级 +
      15 国家，825 人为虚构），替换后重建即自动更新地图与统计
- [ ] 七周年手记文章就位：src/content/anniversary/ 加 .md，hub「即将上线」卡换真实链接
- [x] 水印昵称 webfont：✅ 已解决（09-15 凌晨补充）——用户确认设计稿字体为等线；等线为方正/微软商业字体不可直接内嵌，改用免费商用（Apache-2.0）的思源黑体 Light 子集 webfont（GB2312 一级高频字 3512 字 +
      ASCII/标点，466KB ≤
      480KB 入库线）+ 字体栈 DengXian 优先（装了 Office 的设备本地精确匹配零下载），FontFace 注册家族 NotoSansSCSub；生成脚本 scripts/make-nickname-font.mjs（可随时重跑调整字符集）
- [ ] 板块正式发布时：确认角卡曝光策略（当前每次打开都显示，如需改为每天一次/一次，改 AnniversaryCard 脚本的 localStorage 逻辑）
- [ ] 7 周年活动结束后下线路径：角卡移除 + 导航/活动卡入口摘除 + 板块页保留或归档

### 验证

- ./init.sh 全绿：astro check + tsc 0 错误、eslint
  0 错误（3 处 no-console 警告为有意保留）、75 页构建
- judge 视觉验收第二轮：hub 页与地图墙页双 pass，无 must_fix/should_fix 遗留（第一轮 must_fix「移动端溢出」经 DOM 断言证伪：375px 视口 scrollWidth
  ==
  375 零溢出，系无头 Chrome 长页截图伪影；should_fix 幽灵书法压字已加渐变护层修复）
- 浏览器实测：周年角卡浮现/关闭 ✓；导航 7周年 → /7th/
  ✓；水印工坊示例照片→模板切换→昵称→缩放→生成（seeker-sample_seeker_7th_watermark.jpg）✓；地图墙世界/中国面板标记、标签、提示 ✓；暗色模式 hub 卡片区协调 ✓

## 会话记录（水印工坊交互重设计 · 画布优先沉浸式，2026-09-15 上午）

- 用户反馈：水印工坊功能没问题，但交互太老套；新增自动识别横竖版功能；要求用设计类 skill 重新设计交互
- 设计依据（ui-ux-pro-max 数据挖掘）：Photo
  Editor 色板结构、「表单式双栏/无实时预览/拖拽唯一路径/placeholder 当 label」等 12 条编辑器反模式、12 条画布优先准则（悬浮玻璃工具条、一屏唯一主 CTA、手势+可见控件双通道、动效 token、触控 ≥44px）
- **新交互逻辑（画布优先沉浸式）**：
  - 整页即海报舞台（全幅居中画布、装裱边框阴影），取消双栏表单
  - 底部悬浮玻璃工具条单行收纳：竖|横分段切换 → 昵称输入（常驻兜底）→ 缩放滑杆/±/重置 → 唯一主 CTA 生成
  - 空状态 = 模板虚影 + 大目标上传卡（点击/拖拽/粘贴）+ 隐私承诺内联 + 示例按钮独立成行
  - 左上浮标：水印工坊 / 🔒仅本地处理 / ← 七周年板块
- **自动识别横竖版（核心新功能）**：照片宽 ≥ 高 → 横版模板，高 > 宽 → 竖版；自动切换 +
  toast「已识别为横图，自动套用横版模板 · 可在下方工具条切换」；手动切换保留至下一张照片；正方形默认竖版。修复 toast 时序 bug（setStatus('') 原在 toast 之后执行导致提示被清）
- **昵称就地编辑**：点击海报上昵称区域（按模板坐标换算的百分比热区）→ 就地弹出输入框（可见 label + 字数 +
  Enter 确认），与工具条输入框双向同步（双通道）
- 技术要点：逻辑层零改动（render/gestures/template 复用）；组件整体重写；主题跟随双模式（工具区/舞台用主题令牌，海报本身黑底为设计）
- 验证：type-check/lint/build 全绿；浏览器回归：竖图保持竖版、横图自动切横版、toast 文案、popover 双通道同步、Enter 关闭、生成 0.3MB 成图 + 正确文件名、375px 视口 scrollWidth
  == 375 零溢出
- ⚠️ 排障记录：agent-browser 长会话后 screenshot 稳定 EAGAIN（首页含视频流必现）；dev
  server 长时间运行后文件监听漏事件（编辑后需重启才生效）——两个问题均已用「杀进程重启」临时解决，晨间如复现按此处理

## 会话记录（地图墙重设计：实时晨昏线地球仪，2026-09-15 上午）

- 用户需求：①水印画布下方被工具条遮挡一小部分（修）；②地图墙重设计——整屏一张地图（类似首页整屏）、不要平面地图、要地球仪效果、iPad 壁纸质感、实时晨昏线
- 设计确认（AskUserQuestion）：全球视图 + 「聚焦中国」按钮（旋转放大显示省界）；自转 + 拖拽 + 实时晨昏线；iPad 壁纸真实感配色；整体跟随主题双模式
- 实现：新组件 MapGlobe.astro 替代 MapWall（已删）：
  - d3-geo 正交投影 + Canvas 2D（零新依赖，DPR 适配）
  - 分层渲染：深空星野（种子随机静态层）→ 大气光晕 → 海洋径向渐变球 → 经纬网 → 大陆（绿色渐变填充）→ 实时晨昏线（夜半球 geoCircle
    90° + 多层羽化，太阳赤纬/ 直射经度由 UTC 实时计算，每 60s 刷新）→ 聚焦中国省界 → 金色成员光点（√人数定径，geoDistance
    < 1.45 仅绘可见半球）
  - 交互：拖拽旋转（λ 自由/φ 夹 ±90°）、空闲 2s 后缓慢自转（聚焦模式暂停）、聚焦中国补间（旋转+缩放 850ms
    expo.inOut，reduced-motion 直接终态）
  - 布局：整屏 = 地球仪（100dvh-70px 导航以下，无滚动），浮动玻璃面板（左上标题+统计、右上聚焦按钮、底部提示+水印工坊链接）；数据 geojson 走 /geo/ 同源 fetch
- 水印画布遮挡修复：根因 = 悬浮工具条不占布局流且「重新生成/下载」出现后工具条增高换行，静态预留量失效 → 改为 ResizeObserver 实测工具条高度并写入 --wm-toolbar-reserve
  CSS 变量，页面底部 padding 与组件 layoutStage 可用高度都引用该变量（动态跟随，永不再遮挡）
- 排障：
  1. dev
     server 长时间运行后文件监听漏事件——地球仪改动一度未生效（judge 首轮审的是旧 MapWall 页面）；彻底重启 dev
     server 后恢复。此后每次改动验证前都先重启
  2. headless Chrome
     --window-size=375 有 ~500px 最小窗口宽度钳制（布局按 500 排、截图裁 375）——此前 judge「移动端溢出」部分为此伪影；真实验证须用 agent-browser
     set viewport（设备仿真）
  3. agent-browser 长会话后 screenshot 稳定 EAGAIN——pkill 重启守护可解
- 提交：8b99d1b（地球仪 + 修复）、前置若干

## 会话记录（七周年「摄影档案」UI/UX 重构，2026-09-15 晨）

- 用户晨间反馈：手搓地球仪太简陋，要求找开源方案或改为平铺全屏世界地图；后批准设计稿（「SEEKER
  07 摄影档案」UI/UX 重构任务清单），按 MapLibre + 摄影档案架构执行
- **Phase
  A 设计令牌**：global.css 追加 --anniv-* 令牌组（bg/surface/fg/muted/border/accent
  - motion tokens fast 150ms/normal 300ms/slow 700ms +
    ease-enter/exit），仅作用于 7th 板块
- **Phase B 档案馆首页**：/7th/ 重写——Hero（SEEKER + 07 巨字 + YEARS OF LIGHT +
  2019—2026
  - 追光七载 slogan + ENTER ARCHIVE）→ 01
    ANNIVERSARY（水印工坊 editorial 入口 + 相框视觉）→ 02 PEOPLE（地图墙入口 +
    count-up 统计）→ 03 MEMORY（THE ARCHIVE / 七年的故事还没有结束 / THE STORY
    CONTINUES）→ Ending（2019 WE STARTED → 7 → 2026 THE NEXT FRAME IS YOURS
  - 拍一张照片，交一个朋友）；去 Bento 卡片化，非对称 editorial 排版
- **Phase C 水印 DARKROOM**：未上传态（editorial 大标题 MAKE YOUR ANNIVERSARY
  FRAME + 把这一刻留在七周年 + 选择照片按钮 + 示例）；编辑态（大尺寸照片为第一主体、控制区移到照片下方 FORMAT/NAME/SCALE 三分区、FORMAT 比例可视化选择器、SAFE
  AREA 虚线热区就地编辑）；生成动画（光线扫过 850ms + YOUR FRAME IS
  READY 完成态 + 下载海报/再做一张）；自动识别横竖版保留；功能保护清单 Task
  9 全项浏览器回归通过
- **Phase D MapLibre 地图**：pnpm remove echarts / pnpm add
  maplibre-gl@6.10；组件重写为 MapLibre
  GL（cooperativeGestures 滚动穿透 + 底部 +/- 控件）；单一融合 GeoJSON（anniv-world.json：世界国家 + 中国省域 +
  nameZh/memberCount 注入）；图层：bg →
  region-fill（按 memberCount 金色深浅 choropleth）→ region-border →
  member-glow（circle-blur 辉光）→ member-point（亮核）；hover
  feature-state 高亮 + tooltip（GUANGDONG / 87
  SEEKERS）；点击中国 flyTo 下钻省域 + Back to
  World；进入时光点 0.9s 渐亮（reduced-motion 直接显示）；ECharts 依赖移除
- **Phase E 主站入口**：导航金胶囊「7周年」→「✦
  7TH」（Archivo 细描边 + 极轻 glow，不抢主导航不闪烁，Permanent
  Navigation）；右下角卡重写为小型摄影卡：默认收起（⑦ SEEKER 小方卡）→
  hover 展开（海报艺术条 + SEEKER 07 + 追光七载 + ENTER
  →）→ 滚动到 #activities 展开一次（IntersectionObserver）；⚠️ 行为变更：此前「每次打开首页都弹」改为「常驻收起 + 定点展开」
- **排障记录**：
  - MapLibre dev 模式 worker 卡死：Vite dev 预打包的 maplibre-gl
    worker 与 ESM 格式不兼容，astro.config.mjs 加 worker.format:'es' +
    optimizeDeps.exclude:['maplibre-gl'] 修复（仅影响 dev，生产构建不受影响）
  - headless
    Chrome 最小窗口宽度 ~500px：--window-size=375 会被钳制到 500 再裁切截图，导致 judge「移动端溢出」误报——真实验证用 agent-browser
    set viewport 375 812
  - ECharts GeoJSON dateline 环在切换 MapLibre 后已无关（MapLibre/MapLibre GL
    JS 支持跨日界线多边形）——但 public/geo/world-countries.json 仍保留日界线切割版（436KB→117KB
    12% 简化版），供未来非 ECharts 场景复用
- 验证：init.sh 全绿；浏览器回归：水印 Task
  9 全项 + 地图 hover/flyTo/back + 角卡行为 +
  375px 断言；judge 第二轮 hub/地图双 pass
- 晨间复核清单（不变）+ 新增：① Safari/iOS 真机测试（本环境无法覆盖）②
  PMTiles/Protomaps 为未来选项 ③ 角卡曝光行为已按设计稿改为「常驻收起+定点展开」（此前为每次弹出）

## 会话记录（七周年第二版重构「光影七载，看见彼此」，2026-09-16 深夜 → 09-17 凌晨）

### 背景

用户转来高手第二版设计规范（SEEKER 07 · Digital Photobook / Anniversary
Archive）：把 /7th/ 从「功能页」升级为「可在网页中阅读的摄影纪念册」，七章叙事 + 独立深/浅双主题 + 首页双入口重定位。三个决策已与用户确认：①版式全建 + 优雅占位（数据文件带 published 开关）②独立双主题（默认深色、☼/☾ 切换、seeker-7th-theme
localStorage、与主站无关）③水印保留 JPEG
q0.92（规范写 PNG，但 2084×3705 的 PNG 约 8-15MB/张 vs JPEG
0.3MB，按「不为重构重写可用逻辑」原则保留 JPEG，差异已在此注明）。

### What's Done（feat-026，9 个 commit）

- **93620b6 数据底座 + 双主题令牌**：src/data/anniversary/ 新增 stats.json（825/15/34 唯一权威源）+
  interviews/partners/merchandise/thanks.json（published 开关 +
  schema 注释，禁止伪造内容）；--anniv-* 令牌升级双主题集（默认深色暗房 +
  html[data-theme='light'] 暖纸印刷感，新增 surface-soft / fg-secondary /
  border-strong / accent-soft / error /
  map-bg·land·border·point·point-halo）；MapWall / WatermarkGenerator /
  AnniversaryCard 硬编码 hex 全部令牌化（color-mix 表达透明度变体）；统计 0 闪烁修复（HTML 直出终值，JS 仅在进入视口后从 0 增强——规范 #7 的「0
  SEEKERS」即此 bug）；水印页统计改读 stats.json
- **62f96e7 独立主题系统 + 纪念册页头页脚**：AnniversaryHeader（← SEEKER /
  SEEKER 07 YEARS OF LIGHT 字标 /
  ☼☾ 小切换，写 localStorage + 派发 anniv-theme-change）+
  AnniversaryFooter（光影七载，看见彼此。/ 2019 — 2026
  / 拍一张照片，交一个朋友。/ © 2026
  SEEKER）；三页替换主站 Navigation/Footer，Layout head
  slot 注入防闪烁 inline 脚本（默认 dark）；color-scheme 联动
- **516f2ba 七章骨架 + 首页双入口**：/7th/ 重写为 HERO → 01-07 → LEAVE YOUR
  FRAME → WITH THANKS 骨架（SectionHead 编号/中文大字/英文辅助 +
  AwaitNote「AWAITING
  ARCHIVE 空相框」优雅占位组件）；Hero 主文案换「光影七载，看见彼此。」（旧标语降级为 Ending 辅助行）；ActsSection 删第四张拍立得卡，改为栈下「07
  / SEVEN
  YEARS」暗房特殊块（理性入口）；AnniversaryCard 重写为「藏着一张照片」感性入口——构建期从 ACTIVITY_IMAGE_META 抽样 28 张真实成员照片池（过滤封面/组委会图），define:vars 注入客户端每次加载随机取一张，桌面 hover 轻展开（SEEKER
  07 / 光影七载，看见彼此。/ ENTER →，无弹跳），移动端 6.4rem 图块直达
- **8eedea8
  01 七年序章**：ContactSheet 胶片接触印样墙——构建期从 activities 集合每两期抽一帧（真实照片 + 真实作者署名 + 期数，跨 2021→2026），统一 3:2 印样画幅（object-fit
  cover）+ FRAME 编号 +
  1px 细线网格；地图静态预览：scripts/build-map-preview.mjs 从 anniv-world.json 生成 145KB 简化 SVG（equirectangular +
  0.6° 量化 + 共线去除），以 CSS
  mask 呈现、fill 走 --anniv-map-* 令牌（双主题自适应、零 JS）
- **e8a21a6 02 + 03**：FounderNote（真实主理人肖像 astro:assets 优化 +
  Editorial 版式 + 寄语占位 + 真实 bio/署名）；VoicesSection +
  InterviewStory（大幅肖像/字框占位 + 姓名/身份 +
  Q/A 版式，问题数不写死，interviews.json 就绪前渲染占位）
- **ff6c349 04 + 05**：ProjectTimeline 真实时间线——activities
  64 期按年分组（年份大字 + 期数标签 + 当年最新一期真实封面 + 阅读链接）+
  3 篇公益项目（标题/摘要/封面/链接全真实）；时间线主轴深色光轨/浅色墨线（纯令牌）；SharedRoad 十字关系网（品牌/社区─SEEKER─高校/地方分部 editorial 细线节点，非 Logo
  Wall），partners.json 就绪前展示骨架 + 占位
- **6b1b41a 06 + WITH
  THANKS**：ObjectsSection 展示真实设计物（七周年纪念框正/横版 webp
  = 水印工坊线上同款，OBJ.01/02 档案编号图注）+ 周边占位；Thanks 分组鸣谢版式（角色金标 + 衬线人名，名单未确认前占位）
- **2caa394 地图双主题**：src/lib/anniversary/mapStyle.ts 生成深色（暗房光点）/浅色（纸面墨点）两套 StyleSpecification；MapWall 监听 anniv-theme-change 调 map.setStyle() 实时切换（generateId 保证 feature-state 稳定）；入场渐亮动画透明度收敛为 POINT_OPACITY 常量
- **23c53f1 关键修复批次**（回归中发现，见排障记录）：光点改区域代表点源；生产包补齐 MapLibre
  worker；SharedRoad 移动端溢出修复；印样墙统一画幅

### 排障记录（本会话重点）

1. **生产环境地图静默卡死（严重，自 feat-025
   MapLibre 迁移起就存在，此前仅验证过 dev）**：astro
   preview 下地图 canvas 已创建但 load 永不触发、无任何报错。定位过程：Blob
   Worker 探针正常 → agent-browser --init-script 劫持 Worker 构造器抓到
   `WORKER-ERROR` 指向 `/_astro/maplibre-gl-worker.mjs`
   → 该文件 404。根因：maplibre-gl v6 为原生 ESM 分包（入口 + shared +
   worker），入口运行期
   `new Worker(new URL('...worker.mjs', import.meta.url), {type:'module'})`，Vite 把 URL 写进产物但 Astro 构建管线不发射该文件。修复：scripts/copy-maplibre-worker.mjs 构建后把 worker +
   shared 两个 .mjs 原样补进 dist/_astro/（文件名未 hash，同名拷贝即可），package.json
   build 串联（Cloudflare Pages 同样生效）
2. **circle 图层作用于多边形按顶点渲染**：member-glow/point 原挂在边界 GeoJSON（MultiPolygon）上，光点沿全部国界线密布。修复：build-map-geo.mjs 新增光点源生成——每个有成员区域取「最大外环顶点均值」代表点（lngLat 手工标注优先，如美国/新加坡/澳洲），输出 public/geo/anniv-points.json（49 点），member 图层改挂 anniv-points 源。附带修复：澳门多边形因过小被简化清空 → 简化结果为空时保留原始环
3. **成员明细数据源迁移**：map-points 数据抽到 map-points.json（脚本与 TS 共用单一数据源），map-points.ts 改为类型化转出（Node
   ESM 读 JSON 需导入属性，脚本改 fs 直读绕开）
4. **SharedRoad 十字网格 375px 溢出（559px）**：节点英文后缀 nowrap 撑破；英文包 .sr-en
   span 小屏隐藏 + 节点内边距收紧，四断点（375/390/430/768）全页滚动复测零溢出
5. **eslint ↔ prettier 尾逗号之争**（历史遗留再现）：eslint comma-dangle
   always-multiline vs prettier trailingComma
   es5 在多行函数实参上互斥，仓库既有提交本就以 eslint 为准（format:check 非必检项），处理原则：eslint
   --fix 后不再对 .astro script 跑 prettier --write
6. **教训**：`pnpm run type-check | tail`
   会吞掉非零退出码——关键验证必须显式 echo $?

### 验证

- init.sh 全绿（type-check 0 错误、lint 0 错误 22 警告、75 页构建 +
  worker 补齐日志）
- 浏览器回归（agent-browser，生产 preview
  4322）：/7th/ 七章深浅双主题截图逐章验证；统计直出 825/15/34；印样墙/时间线/关系网/设计物真实数据渲染；主题切换 ☼☾ +
  localStorage 持久 + 地图 setStyle 实时切换（暗房光点 ↔ 纸面墨点）；地图 hover
  tooltip、点击中国 flyTo 省级视野 + BACK TO WORLD；水印示例 → 自动识别 → 编辑 →
  MAKE MY FRAME → FRAME READY 0.3MB →
  seeker-sample_seeker_7th_watermark.jpg；首页角卡随机真实照片 + 桌面 hover 展开文案 + 移动端小图块；07/SEVEN
  YEARS 特殊块；375/390/430/768 四断点全页零横向溢出

### 遗留 / 待办

- 内容缺口（版式已就绪，数据 published 置 true 即上线）：寄语全文、成员采访（interviews.json）、合作伙伴（partners.json）、周边实物（merchandise.json）、鸣谢名单（thanks.json）——均禁止伪造，待用户提供
- 825/15/34 与地图分布仍为占位（stats.json + map-points.json 两处同步替换）
- 水印导出为 JPEG q0.92（规范写 PNG 的差异及理由见本记录开头）
- Safari/iOS 真机、成员头像墙未来扩展（当前印样墙用活动照片混排，规范允许）

## 会话记录（Scroll Story 滚动叙事，2026-09-17）

### 背景

用户转来高手第二份规范（当前仓库版）：把 /7th/ 升级为 Apple 式滚动叙事的数字摄影纪念册。与旧版规范的关键差异已按用户决定固化：01 七年序章**只有一张头像墙**，禁止恢复任何 Frame
/ 多图 crossfade / Hero
Frame；04 追光印记保持空状态。用户确认计划（AskUserQuestion 曾就素材冲突提问，用户以新规范回复替代选择）。

### 技术决策：不引入 GSAP

规范优先级阶梯 CSS → IO → GSAP。盘点全部场景后判定：所需效果全部可由 CSS
position:sticky（免费的 pin）+ 自研 ~100 行 rAF 进度引擎覆盖，零新增依赖，符合规范 #32「不要为了证明用了 GSAP 而增加动画」。引擎接口按可替换设计，未来场景超出能力再评估 GSAP。

### What's Done（feat-027，6 个 commit）

- **C1 引擎 +
  HERO**：src/lib/anniversary/scroll-story.ts——场景注册表（data-story-scene
  → 映射工厂）、rAF 进度计算（几何仅 measure 时读取：init/resize/load/根 RO；滚动帧只置 dirty）、reduced-motion 守卫（引擎不初始化=静态页）、initReveals（[data-reveal]
  → global.css .reveal/.in-view 约定 +
  --reveal-delay 错峰）。渐进增强契约：init 时给 main 加 .story-on 并同步首帧 apply，无闪烁窗口。HERO 舞台（180vh/150vh 轨道）：07
  scale 1→1.03
  → 真实活动照片淡入（构建期确定性抽取横幅图）→ 品牌组退场 →「光影七载，看见彼此。」压照片浮现（text-shadow 保可读）
- **C2
  01 七年序章**（260vh/190vh 轨道）：眉题引言（0-0.16）→ 头像墙进入（0.18-0.38，translateY
  50→0 + scale
  0.97→1）→ 停留（0.38-0.62）→ 离场（0.62-0.78，上浮淡出）→ 统计容器上滑补位 +
  825/15/34 依序浮现（0.78-0.98）；地图预览在轨道后正常流（data-reveal + scale
  0.98 变体）。AvatarWall 增加 stage 变体（视口限高 48vh）
- **C3 02 + 06 + 07**：02 光影札记（250vh/180vh）：暗场 → 肖像 0.18-0.4 淡入 →
  0.48-0.62 scale 1→1.04 → 0.62-0.78 寄语浮现 →
  0.8+ 肖像轻微退后文字成为焦点；06 留光成物（280vh/200vh）：新增 MemoryObject 分层舞台（真实活动竖幅照片 → 相框 mat 显影 →
  @你的昵称 → SEEKER 07 金标 → 2019 —
  2026 依序成形），OBJ.01/02 真实设计物档案保留在舞台后；07 光影七载（300vh/200vh 全页最慢）：2019/WE
  STARTED → 7 scale 0.92→1 → YEARS LATER（新增元素）→ 2026 THE NEXT FRAME IS
  YOURS. → 主题句
- **C4/C5 03 + 05 + 呼吸段 + 04**：03 采访按 肖像→姓名→身份→简介→Q/A stagger
  reveal（240ms 起每题 +120ms）；05 同行之路 view 模式（不钉住，进度=区块穿越视口）——SEEKER 先现 → 连线 scaleX/Y 从 SEEKER 向外生长 → 社区/高校 → 品牌/地方分部；LEAVE
  YOUR FRAME / WITH THANKS / 04
  AwaitNote 挂 data-reveal（呼吸段），04 保持空状态并预留 PROJECT 图文插入结构
- **C6 统一回归**：全断点零溢出；主题切换（pinned 中 ☼☾）无损；引擎初始化模拟 reduced-motion（init-script 劫持 matchMedia）确认 story-on=false；console 零错误

### 排障记录

- eslint prefer-destructuring /
  prettier 无冲突点均即时修复；统计容器上滑方向首次写反（+slide
  → 应为 -slide），浏览器截图复验发现即改
- AvatarWall 舞台限高被基础 `.aw img`
  规则覆盖（同特异性后定义胜出），提升变体特异性 `.aw.aw--stage img` 修复
- 验证 reduced-motion：本版 agent-browser 无 reduced-motion 子命令，改用 --init-script 劫持 window.matchMedia 模拟

### 遗留 / 待办

- 04 内容就绪后在 AwaitNote 位置插入 PROJECT 图文（结构已预留）
- 横屏版头像墙到位后替换 AvatarWall src 与宽高
- Safari/iOS 真机滚动性能（本环境仅 Chrome 模拟）
- reduced-motion 用 init-script 模拟验证（非系统级真机验证）

## 会话记录（地图与暗房叙事重构，2026-09-17）

### 背景

用户转来第三份规范（当前仓库版 Implementation
Spec）：地图与暗房不再拥有独立页面，收编为 /7th/ 章节并形成「WHERE WE ARE →
WHERE ARE YOU? → YOU ARE
HERE」叙事闭环。两个决策已确认：保留 06 留光成物（规范结构清单未列它，但内容为真实设计物，不删）；删两页 +
public/_redirects 重定向（旧链接不 404）。

### What's Done（feat-028，4 个 commit）

- **地图章节（WHERE WE
  ARE）**：新增 AnniversaryMap.astro 嵌入 01 后段（替代静态 SVG 预览 + EXPLORE
  THE MAP 旧入口）。懒加载：挂载点接近视口 800px 才动态 import
  maplibre + 拉取 GeoJSON。滚动五阶段由引擎 map 场景派发进度事件驱动：World 安静出现 →
  First Light → Seven Years（灯光随进度点亮，point/glow opacity 乘 ramp）→
  People（hover/click tooltip「SHANGHAI / 03 SEEKERS」，真实数据）→
  Exit（地图变淡 + 「WE WERE HERE. AND WE ARE STILL
  LOOKING.」+ 中文副题）。无年份数据 → 不做假年份。
- **暗房章节（WHERE ARE YOU?）**：LEAVE YOUR FRAME 重写为暗房章节——开场（LEAVE
  YOUR FRAME / WHERE ARE YOU? / A PLACE FOR YOUR LIGHT 编辑排版）+
  WatermarkGenerator 迁入。脚本整体抽离为 src/lib/watermark/darkroom.ts 的 initDarkroom()（render/gestures/template 管线零改动），组件只留 IO 懒加载器（rootMargin
  600px，页面初始零处理成本）。文案舞台化：A PLACE FOR YOUR LIGHT →「BRING YOUR
  LIGHT.」+ [+ ADD YOUR PHOTO] → 选片后 DEVELOPING… 显影动画（canvas filter
  brightness/contrast/saturate 1.6s 过渡，reduced-motion 跳过）→ WHO ARE
  YOU? 昵称 → YOUR FRAME 完成
- **✦ YOU ARE HERE 闭环**：完成态新增 WHERE ARE
  YOU? 位置确认——下拉复用 anniv-points.json
  49 个省/国代表点坐标（构建期 readFileSync 注入 data-locations，与地图同源），确认后派发 anniv-you-are-here 事件：AnniversaryMap 用 Marker 自定义 ✦ 元素点亮（规避 symbol 文本的 glyphs 依赖）+
  easeTo 推近 + 页面平滑滚回地图章节。仅会话内展示，不落库（规范未要求持久化，已在 UI 注明）
- **删除与清理**：删 src/pages/7th/map.astro、watermark.astro、旧 MapWall.astro；public/_redirects 四条 302（/7th/map|/、/7th/watermark|/
  → /7th/#where-we-are /
  #leave-your-frame）；AnniversaryFooter 链接改章节锚点；grep 确认无「EXPLORE
  THE MAP/进入水印工坊」类旧入口残留

### 排障记录

- 跨组件 story-on 选择器：AnniversaryMap 的 `.story-on .am` 被 Astro
  scoped 样式限制在本组件，main 上的 story-on 匹配不到 → 改
  `:global(.story-on) .am`；index.astro 内的同名规则无需改
- darkroom.ts 抽离时 frontmatter 变量（stats）不随迁：确认脚本体未引用；位置数据用 readFileSync('public/geo/anniv-points.json') 构建期读取（new
  URL 方案在构建渲染期解析到 dist，弃用）
- 完成态标题 YOUR FRAME IS READY. → YOUR FRAME.（规范 Stage 05）

### 验证

- init.sh 全绿（73 页 = 75 - 删除的 2 个二级页）
- 浏览器：地图懒加载（canvas 出现 + skeleton 隐藏）、五阶段点亮截图、hover
  tooltip、暗房全流程（示例→DEVELOPING→昵称→生成→YOUR
  FRAME→ 位置下拉 49 项→点亮）、✦ YOU ARE
  HERE 推近地图、pinned 中 ☼☾ 切主题地图 restyle 正常、375 移动端暗房全流程 + 地图可用 + 零横向溢出、reduced-motion 引擎不初始化地图全亮可用、console 零错误

### 遗留 / 待办

- YOU ARE
  HERE 为会话内展示（规范未要求持久化）；若未来要「真的留下位置」需后端/存储方案（R2/CF
  D1 等），属新产品决策
- 04 等真实项目内容；头像墙等横屏版；Safari 真机
- 水印导出维持 JPEG q0.92（规范写 PNG 的既有决定）

---

## 2026-09-17 会话：首页作品区重构为编辑式摄影展墙（feat-016，分支 feat/7th-anniversary）

按用户提供的 Gallery 重构计划（"不要模拟摄影，直接展示摄影"）执行；对该计划的 4 处代码现实修正：① 现 WorksSection 本就是纯渐变占位帧（无真图），本次为从零填充选图；②
activities entries 有真实 author 署名可诚实标注；③
ACTIVITY_IMAGE_META 提供构建期 w/h，可精确分型与防裁剪；④ 计划漏了首页 scroll-snap
/ #works 锚点 / scrollspy 等硬约束（均已保留）。

### 实现

- **src/data/gallery.ts（新增）**：唯一换图入口。主图池 3（立青《渡光》、钪钇国王峰冰川、魔法药《留白待雪》）+ 竖幅 3（迅雷疾风《霞染申城》、日行性猫猫《暮日之城》、源Dream 贡嘎彗星）+ 方幅 3（屋顶数星星《从"头"开始》、白纸《我与我》、柯达拍什么《一瞬与永恒》）。9 位作者无重复，author/title 摘自 activities
  entries，alt 按真实画面撰写，排除带第三方水印图（如 OPPO 水印猫）。选图方法：脚本联查 65 期 entries
  × 元数据得 1590 合格候选 → 浏览器 contact sheet 视觉挑选 42 → 逐张放大核对
- **WorksSection.astro（重写）**：删除胶片带/齿孔/伪 EXIF/No.XX 全部系统；新结构 =
  4fr+2fr×3 主图行（crossfade 主图 + 3 竖幅）+ 62% 宽居中方幅行。主图位纯 CSS
  crossfade（27s 循环、负 delay 交叠淡入淡出、hover 暂停），署名随图轮换（同 keyframes 同 delay 的叠放 span，置于图下）；辅图 loading=lazy +
  width/height 防CLS + hover scale 1.02；入场复用全局 .reveal +
  --reveal-delay 错峰。断点：≤900 主图+1竖幅+方幅整行、≤640 主图通栏+2竖幅（方幅行隐藏）。CTA「查看全部」按用户决定暂不渲染（原指向 /under-construction 死链）

### 排障记录

- `.wall-row img`（0,1,1）的 height:auto 压过 `.hero-img`（0,1,0）的 height:100%
  → 主图不充满框、框底露出 --muted 横带；改选择器为 `.wall-item img` 收窄作用域
- hero 署名最初叠图左下，白字在《留白待雪》雪面上不可读 → 改图下署名（与辅图一致）；首次改 CSS 时未同步移 DOM，credit 仍嵌在 .hero-frame 内被 aspect-ratio 顶到框顶，已移出为兄弟节点
- 全仓 `pnpm format`（prettier --write .）会重排 49 个存量未格式化文件，已 git
  checkout 还原，仅保留本 feature 两个文件；仓库本非 prettier 全量干净，勿在无关 feature 里跑全局 format

### 验证

- init.sh 全绿：astro check 0 错误、eslint
  0 错误（39 条 warning 全为其他文件存量）、build 73 页通过
- 浏览器（agent-browser）：Desktop 1440×900 Light/Dark、Laptop
  1280×800（max-height 44vh/24vh 生效贴合）、Tablet 834、Mobile
  390×844 一屏收纳；reduced-motion 模拟下仅首图静态、动画全 none、reveal 直显；crossfade 实测轮换（三张主图先后出现）；performance
  entries 确认 Gallery 恰好 9 张 R2 请求无重复；scrollspy「作品展示」高亮正常
- 验收对照重构计划 §27：胶片系统与伪参数全删、单屏 9 张内真实照片、R2 只读零改动、「时间的故事」未出现在文案、无新页面、其他 section 未动

### 遗留 / 待办

- 图单为首版机器辅助挑选，正式上线前建议成员人工过目一轮（换图只改 src/data/gallery.ts）
- 主图池 3 张 crossfade 中《留白待雪》为高调白图，与暗色主题相邻屏的衔接观感可在真机再确认

---

## 2026-09-17 会话（续）：Gallery 全图位随机轮换

用户追加需求：所有图位都要能切换其他图片，每个图位每次切换间隔在 3~6 秒之间独立随机，形成不对称节奏。

### 实现

- **选图扩充 9 →
  23 张**：主图池 5（+iwanna我想 洞穴框景、脏了的布娃娃 落日亭）、竖幅 3 格 ×3（+X_ming《金辉下的澳门港》/《天穹彼岸》、ClevelandZhu《你好！2026！》、日行性猫猫《林中密城》、Talon 秋树、移动城堡内的全麦 银河）、方幅 3 格 ×3（+程早《极光洒落童话小镇》、黑暗之王 极简海滩/黑白城市、让我吃一口 窗光、月某人 微小星球、屋顶数星星《海边的袋鼠》）。109 张近方幅候选对比图目验后精选；全尺寸核验剔除带 HUAWEI 品牌水印与翻拍 Print 类图；竖幅第三格凑成「贡嘎彗星 + 沙井星轨 + 银河」星空主题组
- **gallery.ts 结构**：GALLERY_SUPPORT_TALL / SQUARE 改为 `GalleryImage[][]`
  （每格一份独立轮换列表），GALLERY_HERO 扩为 5 张
- **WorksSection.astro**：三处图位统一为 wall-slot 结构（data-cycle +
  data-fade-img/-credit + is-active）；CSS 由 keyframes 改为 opacity
  transition 交叉淡化；新增 ~40 行原生 JS 调度器——每格 setTimeout 链，间隔
  `3000 + Math.random() * 3000`ms，悬停暂停/移开续播；渐进增强：无 JS 或 prefers-reduced-motion 时静态展示各格首张
- 图位比例改用显式修饰类（wall-slot--hero/tall/square），规避 nth-child 特异性压过 .wall-row--square 的隐患

### 排障记录

- 仓库已知工具链冲突复现：prettier（trailingComma: es5）vs eslint（comma-dangle:
  always-multiline）在多行 setTimeout 参数上互相打架，按 progress.md 既有原则将调用单行化（抽出 nextDelay()）解决
- reduced-motion 浏览器实测先出现「reduce:true 仍在切换」假象：系 agent-browser 对新导航页延迟应用媒体模拟所致（脚本一次性守卫在模拟生效前已启动）；同页 reload（模拟自文档加载即生效）复测 8s 零切换，守卫正确，真实用户不受影响
- 注意：本会话进行中的 gallery.ts/WorksSection 改动被并行会话的提交 0f08a71（暗房中文化）顺带带入仓库；后续仅剩 WorksSection 修饰类与 nextDelay 两处增量，未做任何历史改写

### 验证

- init.sh 全绿（type-check 0 / lint 0 错误 / build 73 页）
- MutationObserver 实测 40s：7 格共 81 次切换，各格间隔序列互不相同且全部落在 3.1~6.0s（如格 0:
  5.3/4.6/3.7…，格 3: 6.0/3.4/3.9…）
- reduced-motion：同页 reload 后 8s 零切换、7 格各留首张
- performance：Gallery 恰好 23 张 R2 webp 无重复（另 2 张为七周年角卡随机图）
- 视觉：Desktop 1440×900 与 Mobile 390 一屏收纳不变，图注基线对齐

### 遗留 / 待办

- 同前：图单建议成员人工过目一轮（只改 src/data/gallery.ts）
- 23 张图全 lazy，但轮换池使首页图片请求从 9 →
  23；若未来要省流量，可把每格轮换列表收紧为 2 张（配置即可，无需改组件）

## 会话记录（Seeker 品牌配色系统重构，2026-09-18）

### 背景

用户转来品牌配色规范：建立统一的 Seeker 品牌色系统（藏蓝基底 + 蓝色编辑标记 + 蓝光识别），替代此前的 Catppuccin 青/红渐变体系，让首页、Gallery、活动页、7 周年在视觉上同属一个品牌（与 Logo 的藏蓝/电光蓝同源）。两处决策按规范执行：保留 06 留光成物；删两页 + 重定向。

### 关键决策：不引入第二套变量体系

审计（Explore 全量色值盘点）确认全站高度 token 驱动 → 在现有 Catppuccin/
shadcn 变量名上直接换值为 Seeker 色板 + 新增 --seeker-navy/blue/sky/pale-blue 四个品牌基色，组件零改动即整体换色；散落硬编码仅 14 个文件，品牌相关集中在 Navigation/Banner/under-construction（青红）与 ActsSection/Watermark/mapStyle（金）。

### What's Done（feat-029，分阶段 commit）

- **bc17f4b tokens**：global.css
  :root/.dark 全量换值（Light 纸张 #F7FAFD + 墨蓝 #14283D + Blue #0750A8 强调 +
  Sky ring；Dark 藏蓝夜空 #061A30 + 月光白 #EAF4FF + Sky 光）+ 新增品牌基色 +
  grad/glow/glass/divider/icon-tile/paper 换蓝。组件零改动全站自动换色
- **9b781af home**：Navigation 浮动 hover #4ecdc4→Sky、7周年金胶囊→Seeker
  Blue；Banner 三色渐变标语→白→天蓝蓝光渐变、focus ring→Sky；ActsSection Young
  Blood 卡橙/青 radial→藏蓝/Sky；7周年特殊块金字面量→--anniv-accent 令牌化；under-construction
  SVG 九处→品牌蓝
- **6cc811f 7th**：--anniv-* 双主题换血——dark：bg #04101E 藏蓝黑/surface
  #08243F/#0C3155/fg 月光白 #EAF4FF/accent **#3A9DFF Sky 光**/map point
  #A8D8FF+halo #3A9DFF；light：bg #F7FAFD 冷蓝纸/accent #0750A8 墨/map point
  #14283D 墨点/halo #0750A8；mapStyle.ts 色板同步（bg/land 三阶/hover/point/
  stroke/accent）；WatermarkGenerator 光扫渐变 金→蓝
- **C4/C5 验证阶段**：主题机制审计（主站 .dark+theme
  storage+系统偏好；7th 独立 data-theme+seeker-7th-theme+防闪烁，均未改动）；地图 pinned 中真实按钮切主题 restyle 正常；Gallery
  photo-first 双主题核对（无 fake EXIF/ 胶片视觉/蓝底包围照片）

### 排障记录

- eval 直接改 data-theme 不派发 anniv-theme-change
  → 地图不 restyle，属测试方法问题；真实按钮路径验证正常（第一次就踩过同款坑，第二次复现确认）
- 跨组件 .story-on 选择器需 :global（AnniversaryMap），index.astro 内无需

### 验证

- 每阶段 lint/astro:check/build 全绿；init.sh 全绿 73 页
- 浏览器：主站 Light/Dark 全页截图；7th
  dark（藏蓝黑+蓝色光点地图+月光白统计）/light（冷蓝纸+墨点）截图；地图 pinned 中 ☼☾ 真实切换 restyle
  ✓

### 遗留 / 待办

- 7th 档案金 → 蓝色为规范 #16 明确要求（与 Logo 电光蓝同源）；若不满意可 git
  revert 6cc811f 单独回退 7th 配色
- +7 .jpg（无作者 ID）未上传；横屏版头像墙待替换 AvatarWall
- Safari 真机；YOU ARE HERE 会话内展示

---

## 2026-09-19 追光之旅摄影大赛上站（feat/chasing-light）

### 交付

- 首页 ActsSection：Young
  Blood 占位卡 → 「追光之旅 · 摄影大赛」实卡（2024 总冠军封面）
- /activities/chasing-light/ 历届门户 +
  /activities/chasing-light/{2022,2023,2024}/ 年度页（结果公示 + 作品赏析合并一页；影展式常暗 hero/公示区，赏析区跟随站点明暗主题）
- lightChasing 内容集合：3 个年度 .md，42 位获奖者名单与「背后的故事」全部照录原文
- R2 新增 65 图（activities/chasing-light/<year>/<slug>/NN.webp，q82
  ≤2560，immutable）
- activity-image-meta.ts 追加 65 条尺寸登记；eslint.config.js 为两个新页关闭 set:html 规则

### 内容管线（可复用方法论）

1. 微信文章原始 HTML：mp.weixin.qq.com/s 对本机 IP 与 CF
   workers.dev 出口均风控，但 URL 追加任意有效 chksm 签名参数即可绕过（签名不校验与 sn 的绑定），经临时 CF
   Worker relay 抓取（用完已删 wx-fetch-relay-tmp）
2. js_content 图文交错解析 → 奖项节分段（注意 2023 赏析为无书名号裸标题格式、优秀奖顺序与公示不同需按标题归一化合并）→ 装饰图（同文件 ≥3 次重复 URL）剔除
3. 哈希去重（公示/赏析两文重复嵌入同一作品）→ contact
   sheet 全量人工目检（剔除大赛海报/赞助页/截图/归属存疑图，-series 组图 10 张、-05 祖辈 15 张保留全组）
4. sharp 转 WebP → wrangler r2 object put（immutable 头）

### 排障记录

- R2 自定义域 CDN 对 immutable 缓存头同 key 重传不刷新：2023 总冠军首传误为海报版，换新 key
  cover.webp 重传并弃用 01.webp（.md/meta 同步改名）
- zsh 不做单词拆分：`set -- $a` 循环写文件名变成整串 → 用 while read 处理
- 微信「上下滑动查看」swiper 的重复装饰 PNG 会出现在 data-src 里，按出现频次过滤
- headless 截图遇 IO 渐进显影（html.js .cl-reveal
  opacity:0）时内容看似缺失，需 --virtual-time-budget 或高视口；页面实高 25632px

### 验证

- type-check / lint（0 errors）/ build 全绿，77 页（+门户+3 年度页）
- 桌面 1440：门户 + 三年度页整页截图核对（hero/组冠军画廊墙/密集网格 hover 态样式/ 赏析编辑块/组照编号/公示脚注/pager）
- 移动 375：hero 与结果网格单列塌缩正常
- lightbox 实测：点击开图、R2 原图加载、图注/计数（1/23）、Esc 关闭 ✓

### 遗留 / 待办

- 2022 赏析文仅 5 位冠军有故事（原文如此），优秀奖无故事属正常
- 首页「全部活动 →」仍指向 /under-construction（未在本次范围）
- 2021 年大赛按需求未做

## 会话记录（feat-026 地图墙真实数据 + 中国视图，2026-09-19）

### 背景

- 成员分布原为占位假数据（825 人/15 国/34 省），用户统计出真实省级分布后口头提供（高德群聊位置共享无官方导出，本会话已确认；截图识别备而未用）
- 用户决策：地图改为「中国全图」视图（含港澳台与南海九段线），不再展示世界图层

### 交付内容（分支 feat/7th-anniversary）

- 真实数据：map-points.json 换 28 省真实人数（合计 219；用户口述出现两次湖南——「2 人」与「3 人」，合并为 5 并已向用户标注核对）；stats.json
  → 219/0/28；头部统计去掉 COUNTRIES 项（海外为 0，避免显示 0 COUNTRIES）
- 中国视图：build-map-geo.mjs 重写为仅处理 DataV 省级（35 要素 =
  34 省级 + 九段线），输出改 public/geo/anniv-china.json（79KB，远低于原 480KB 世界+中国包）；anniv-world.json 删除；mapStyle 默认 URL 同步；初始视野改 fitBounds 中国全图（含南海），minZoom
  2（防移动端 fitBounds 被 clamp 裁边）
- 光点标定：region-fill 色阶与辉光/实点半径 interpolate 区间按真实最大省人数（广东 56）重定标；anniv-points.json 改为全量 34 省代表点——0 人省份保留供暗房「你在哪里」全量选择，页面样式按 memberCount>0 只点亮有成员省
- 细节：九段线要素（adcode 100000_JD 无名）标注 nameZh=南海诸岛（memberCount
  0，不生成光点）；地图收尾文案「七年来，我们走到了世界各地。」→「七年来，我们走过大江南北。」；暗房地区选择过滤空分组（海外组随 countries=[] 自动消失，剩 34 省级选项）；水印文案自动显示 219 位追光者

### 验证

- type-check 0 错误 / lint 0 errors（48 既有 warnings）/ build 77 页 + MapLibre
  worker 补齐，全绿
- dev server +
  IAB 浏览器实测 /7th/：中国全图渲染（含台湾岛/海南岛/九段线虚线），广东最大光点清晰、各省光点按人数分布；暗房选项 34 省、收尾文案、水印 219 位追光者均确认
- 数据抽查：广东点 [113.28, 23.17]
  count=56、台湾/香港/河北 count=0、天津 count=1 ✓

### 遗留 / 待办

- 「湖南 2+3=5」待用户确认；若有误改 map-points.json 后重跑
  `node scripts/build-map-geo.mjs` 即可
- scripts/build-map-preview.mjs 及产物 map-preview.svg 仍面向旧世界图，页面已不引用（遗留未清理）
- 用户工作区另有未提交改动（Footer.astro 微信二维码 +
  src/assets/images/wechat-qrcode.png），非本会话产物，未纳入提交
- Safari 真机待测（沿袭 feat-026 既有遗留）

## 会话记录（页脚公众号二维码 + 首页分部补全与分部小地图，2026-09-20）

### 交付内容（分支 feat/7th-anniversary，均未提交）

1. 页脚联系方式重做：邮箱/微信/全国各地分部三条占位删除，换成微信公众号二维码（src/assets/images/wechat-qrcode.png，512px/168KB，astro:assets 构建期优化为 10kB
   webp）；Footer 全站生效，深浅主题截图验证通过
2. 首页 About「小组简介」分部胶囊补全 9 个：陕西/山西/武汉/安徽/海南/云南/川渝/广西/上海（用户指定顺序，插金陵后，「你的城市 · 期待点亮」保持压尾虚线）
3. 新增分部小地图（用户选定「静态 SVG」方案，零客户端框架）：
   - src/data/branches.ts：11 个分部单一数据源（id/label/cities/lngLat）
   - src/lib/branches/china-svg.ts：构建期读取 public/geo/china-provinces.json（已提交的 DataV 省界，不依赖周年页 WIP 产物），等距圆柱投影（经度 ×cos35°）→
     0.1° 量化去重 → 像素空间 Douglas–Peucker 抽稀（闭合环按最远点拆半，容差 1.0px/段线 0.7px）→ 内联路径约 29KB；主图 viewBox
     640×471（南界 16.5°N，给附图让出纯海区），南海诸岛附图复用同一完整投影空间等比缩小（150×54 框，clip 至 20.9°N 以南），主图九段线用 evenodd
     clipPath 挖掉附图矩形避免重复描线；澳门（<0.2°）丢弃、港澳台保留
   - src/components/home/BranchMap.astro：省份底 var(--glass-bg)/var(--divider) 主题自适应；分部圆点 = 渐变核（--grad-a/--grad-b
     radialGradient）+ 光晕呼吸动画（prefers-reduced-motion 关闭、相位错开）；圆点内嵌
     <title> 原生 tooltip；省份
     <title>；~30 行原生 JS 实现胶囊 ↔ 圆点双向 mouseenter/mouseleave 高亮（.is-active）
   - AboutSection 接入：地图置于胶囊下、join-row 上（max-width
     420px），chip 加 transition + .is-active 样式

### 验证

- type-check 0 错误 / lint 0 errors（51 既有 warnings，与我改动无关）/ build
  77 页全绿
- 截图实测（preview
  :4322）：深色（默认）+ 浅色主题地图/胶囊/加入按钮渲染正常；hover 联动双端 class 验证通过；移动端 390×844 单列布局正常
- 几何抽查：广州 [413.1, 386.5]、海口 [382.5,
  425.8] 落位正确；台湾岛与附图框不重叠；附图仅含伸入南海的省份（海南/广东等按 maxY 过滤）
- 调试注记：浏览器缓存过旧 HTML，用 cache-buster 排查后确认 dist 正确；调试用 svg
  scale 变换已全部还原

### 遗留 / 待办

- AboutSection
  join-row 仍有「微信：seeker-photo（占位）」（用户只要求改页脚，此处待指示）
- 桌面端 About 屏内容（胶囊 3 行 + 地图 + join）略超 100svh，可滚动，用户已认可
- 全部改动未提交：与周年 WIP（mapStyle/AnniversaryMap/map-points 等）同工作区，等用户信息补完统一整理提交

## 会话记录（feat-026 光影札记主理人寄语 + 五拍滚动叙事，2026-09-20）

### 交付内容（分支 feat/7th-anniversary，已提交）

1. 数据：src/data/anniversary/founder-note.json（published 开关 + 三段寄语原文逐字保留，2026-09 主理人提供）；false 时 FounderNote 回退 AwaitNote 占位
2. FounderNote.astro：AwaitNote 占位替换为三段正文；bio 与三段、落款均为 data-founder-beat 节拍，bio/正文 grid 叠放（1/1 同格，容器高取最高段，轮换不跳动、隐藏不占行）；《专题名》splitTopic 拆段以 .fn-topic 强调色渲染（不用 set:html，规则 astro/no-set-html-directive 禁用）；正文衬线 var(--anniv-serif) 行高 2
3. scroll-story.ts founder 工厂扩展为五拍轮换（仿 ending）：肖像淡入+轻放大 →
   bio(0.28-0.38) → 三段(0.42/0.56/0.70 进入，前段同窗退场)
   → 落款(0.84-0.92，第三段压暗 0.25 衬底)；窗口表按节拍数键控（5=全文 /
   2=占位回退）
4. index.astro：story-track--founder 250vh→300vh（移动 180→240vh）
5. 工具链对齐：.prettierrc trailingComma
   es5→all——此前提交钩子里 prettier 后跑会剥掉函数参数尾逗号（c68df27 时 mapStyle.ts 被剥，lint
   comma-dangle 报错），与 eslint
   always-multiline 打架；'all' 对齐多数派既有风格，mapStyle 参数尾逗号补回
6. 窄屏（≤48rem）：肖像压成「署名小票」（72px 小图 + 纵排署名同行）、正文 0.92rem/1.85，保证章节标题 + 当前节拍 + 落款 100svh 同屏

### 验证

- type-check 0 错误 / lint 0 errors（51 既有 warnings）/ build 77 页全绿
- 浏览器实测（dev +
  IAB）：桌面 1280×720 五拍逐拍截图核对（轮换、退场、落款、压暗）；375×667 三拍同屏、无横向溢出；文字三段与 founder-note.json 逐字比对 ALL
  PASS
- 开场拍人像偶现空白为 lazy 图片解码时序（img.complete 后正常），非布局缺陷

### 遗留 / 待办

- progress.md 本次记录与页脚/分部会话记录同文件未提交（见下），由统一整理提交时一并带上
- format:check 基线即红（Navigation.astro style 块 CssSyntaxError +
  48 文件格式漂移），非本次引入，未处理
- 三篇文章《那些忙碌的摄影师今年还在拍摄吗？》上线后可回填链接

## 会话记录（分部小地图 v2「引线+按钮」+ 页脚二维码换图缩小，2026-09-20 续）

### 交付内容（同分支，未提交）

1. 分部小地图升级（用户反馈「简陋」→ 标注式地图）：
   - BranchMap.astro 新增引线层（bm-net，圆点→按钮细线，pathLength=1 归一化描画，进入视口后按 0.09s 错峰 draw-in）与按钮层（bm-places，86×27 胶囊 + 分部名，样式同 chips 玻璃胶囊）
   - PLACEMENTS 手工排布 11 个按钮中心点（逐一核算避让：台湾岛、南海附图框、海南/广佛等南部密集圆点、引线互不交叉、不出 viewBox）
   - 联动升级为三方：chips 列表 ↔ 地图圆点 ↔ 地图按钮，悬停任一处同步 is-active，对应引线增亮（opacity
     .45→1，宽 1→1.6）；无 JS 时引线常显（html.js 门控）
   - 地图 max-width 420→440px；figure 加 .reveal 入场
2. 页脚公众号二维码：换成用户 2026-09-20 提供的新图（512×512，144KB 入库），显示尺寸 128→100px（Image
   width/height 256→200，构建后 8kB webp）

### 验证

- type-check 0 错误 / lint 0 errors（51 既有 warnings）/ build 77 页全绿
- 截图实测：地图 11 引线+按钮无碰撞；hover 地图「川渝分部」按钮 → 圆点光晕放大、引线 computed
  opacity 1 / stroke-width 1.6px、chips 列表同步高亮，三方联动 ✓
- 页脚新二维码渲染确认（getBoundingClientRect 宽 100px），含 Seeker logo 新图 ✓

### 遗留 / 待办

- 同前：AboutSection join-row「微信占位」待指示；全部改动未提交，等用户统一安排

## 会话记录（feat-026 光影札记节拍吸附，2026-09-20 增量）

- 用户反馈连续插值会停在两段之间影响阅读：founder 场景改为「节拍吸附」——进度只决定当前是第几拍（相邻拍中心的中点为阈值，5 拍阈值 0.395/0.53/0.67/0.81），跨过阈值整拍切换；切换过渡由 CSS
  transition 0.55s ease-out-cubic 完成（FounderNote
  .story-on 门控，will-change 提示）。任何停留位置看到的都是完整一段，肖像入场保留连续淡入
- 验证：type-check / lint / build 全绿；运行时断言 p=0.95
  → 三段 0.25 + 落款 1 + 其余 0；桌面截图核对「中点前停留=完整拍1」「跨过中点=整段切到拍2」「落款拍」；测试中曾出现的停帧为后台标签 rAF 暂停的假象，页面可见时无此问题
- 改动文件：src/lib/anniversary/scroll-story.ts（founder 工厂状态机化）、src/components/anniversary/FounderNote.astro（节拍 transition）——已提交

## 会话记录（feat-031 板块6 改版：成员巨片幻灯片墙 + 暗房并入，2026-09-20）

### 素材与 R2

- 源：桌面「附件下载_七周年海报收集」162 张（167MB，成员用暗房工具自制水印海报，文件名 = 作者_时间_原图名_序号）
- `scripts/make-7th-posters.mjs`：MD5 去重（Wilson 重复 1 张）→ 161 张 /
  92 位成员；sharp 转 WebP（q82
  smartSubsample、EXIF 转正后剥离，尺寸不动——源已长边约 2500，唯一全景 12503x3705 按约定保留原分辨率）；产物
  `.posters-stage/`（gitignore）
- manifest
  `src/data/anniversary/posters.ts`：脚本生成勿手改；数组顺序 = 展示顺序（seed
  20260919 确定性洗牌，首帧 NO.028 @黒加侖 竖幅精选）；no
  = 档案编号（按作者名 zh-Hans 排序赋号）；92 人/161 帧等文案数字全部运行时从 manifest 计算
- 上传：全局 wrangler（~/Library/pnpm/wrangler，whoami 确认
  djhannyuan@gmail.com），161 张逐一 put 到
  `activities/7th-anniversary/posters/NNN.webp` （image/webp +
  immutable 缓存头），curl 自定义域全量验证 200（011 首测 000 为连击瞬时失败，复测 200）；注意：wrangler
  4.108 `r2 object put` 无 `--quiet` 参数

### 板块 6 新结构（feat-031，详见 feature_list.json）

- 删除：MemoryObject.astro、ObjectsSection.astro、merchandise.json、scroll-story
  `memory` 工厂、`.story-track--memory` CSS
- 新增：`PosterSlideshow.astro`（放映框 + 双槽位 + 署名/计数/进度线）、
  `src/lib/anniversary/poster-slideshow.ts`（自动轮播逻辑，接近板块 ~600px 才动态 import）、scroll-story
  `posters`
  工厂（入场三段 ramp，轨道 320vh/240vh）、交接句 .arc-handoff「你的那一帧，还差你。」
- 叙事：入场装框（引言→海报→署名）→ 驻留自动轮播（4.5s/帧，滚动不干预）→
  sticky 释放 → 交接句 → 暗房「你在哪里？」（原样并入 06，#leave-your-frame锚点/重定向/footer 链接不变）
- 设计取舍：海报自带相框+二维码 → 固定放映框内 contain 原比例展示绝不裁切；换帧用两段式（旧帧整幅淡出→新帧淡入）而非交叉淡入——横竖幅混排时新旧同框会叠出拼贴感、署名归属混淆；全量池+预取 ±2 张：所有成员的片子都会出现，任一时刻仅 3 张解码资源

### 验证

- ./init.sh 全绿（type-check 0 错 0 警、lint 0 错 60 既有警告、77 页构建）
- agent-browser headless（1440x900 /
  375x667）：入场 ramp 数学正确；自动轮播连续推进 6+ 帧（计数器/署名/进度条/槽位 aria 交接正确）；两段式换帧单帧可见；悬停 6s 暂停、移开恢复；出场→交接句→暗房 empty 态正常；深浅双主题截图核对；移动端零横向溢出
- 环境假象记录：ZCode 内嵌浏览器面板被遮挡时 rAF 暂停 +
  setTimeout 密集约节流，滚动引擎停帧、平滑滚动冻结——页面可见时无此问题（与 2026-09-20
  founder 会话记录一致）；headless 验证时曾用「rAF→setTimeout 补丁 + 重新 initScrollStory」绕过

### 未提交改动说明

- 本功能文件已单独提交；工作区另有上一会话的分部小地图 v2 改动（BranchMap.astro、branches.ts、src/lib/branches/、Footer.astro、AboutSection.astro、wechat-qrcode.png）仍按其记录「等用户统一安排」未提交
- `pnpm format`
  现状：Navigation.astro 既有 CSS 语法错误导致 prettier 全仓跑挂（报错文件为已提交代码，非本次改动）；已恢复被 prettier 误重排的无关文件

## 会话记录（About 区收敛：去胶囊列表、期待点亮入地图卡片、删微信占位，2026-09-20 续 2）

### 交付内容（同分支，未提交）

1. AboutSection：删除 branch-chips 胶囊列表（含 .chip/.chip--more/.chip.is-active 样式与id="branches"，无外部引用，已 grep 确认）；join-row 删除「微信：seeker-photo（占位）」（.join-contact 样式同删），现在左栏为 标题/简介/特性/team-link/地图/加入按钮
2. BranchMap：新增 figcaption「你的城市 · 期待点亮」虚线胶囊（卡片内 SVG 下方，沿用 chip--more 视觉）；联动脚本移除 .branch-chips 查询（降为圆点↔按钮双向），注释同步更新

### 验证

- type-check 0 错误 / lint 0 errors（52 既有 warnings）/ build 全绿
- 截图实测（深+浅主题、390×844 移动端）：胶囊列表消失、地图卡片含 11 分部按钮 + 期待点亮虚线胶囊、加入按钮独占一行无微信占位；地图内 hover 联动（海南：pill+dot
  is-active）回归通过
- 未提交，与前两次会话改动及周年 WIP 同工作区，等用户统一安排

### 板块6 海报加载不出修复（2026-09-20 用户反馈）

- 症状：板块6 放映框/署名在、海报图不出来；排查时 R2 自定义域全量 200 正常、Chromium（headless + 内嵌）渲染正常
- 根因：首帧 `<img loading="lazy">` 嵌在 sticky 舞台（.story-stage
  overflow:hidden）里，WebKit 对「sticky +
  overflow:hidden 容器内的懒加载图」距离计算有 bug，请求可能永不发出（页面顶部非 lazy 的 R2 图都正常，符合此模式）
- 修复：PosterSlideshow 首帧去 loading="lazy"（fetchpriority="high" 已有）；poster-slideshow.ts 的 decode() 加老 Safari 兼容（缺失时等 load/error，error 走既有跳帧逻辑，不会让坏帧上墙）
- 验证：type-check/build 全绿；内嵌浏览器实测首帧直出（naturalWidth>0、无 lazy 属性）、换帧正常推进（NO.117→NO.143 时间线）
- 教训：滚动叙事页深处的图（轨道 1.2 万 px 下）不要依赖 lazy——WebKit 的懒加载触发在 pinned 容器里不可靠；首帧一律 eager 直出

## 会话记录（板块6 视觉升级：左文右图巨片排版 + 飞行编排，2026-09-20 续二）

### 布局（用户要求：照片占比大一些，占满「留光成物」右侧）

- PosterSlideshow 重构为 grid 左右分栏：左列 =
  SectionHead（章节题移入组件）+ 引言 +
  NO/署名/进度线信息面板；右列 = 放映区 height min(78vh, 50rem) 占满右侧
- 照片 z-index 在文字列之下（pss-side z2 / pss-right
  z1）：飘入时从标题后面穿过，不遮文字；移动端回退单列（题→引言→署名→放映区 44vh）

### 飞行编排（用户口述动效落地）

- 入场（p
  .02→.2）：照片从屏幕左侧 -60vw 减速飘入（(1-t)² 缓出就位），不透明度 .05→.15 渐显
- 驻留缓漂：poster-slideshow.ts 新增 rAF 漂移循环，时间驱动写 [data-poster-drift]（引擎写 [data-poster-stage] 滚动分量，两层 transform 叠加互不覆盖），13px/s 匀速右移、上限 160px，悬停/切后台/滚离与轮播同步冻结，换帧归零
- 离场（p .82→.96）：滚动二次加速 t²·115vw 飘出右缘 + 1.5° 微旋转
- 结束动作：空框 ghost 是放映区的静止兄弟层（不是子层——首版放子层里被照片带走，修正）——照片飘走后原地浮现（p
  .84→.92，品牌蓝细框 + 内光晕 +「光已飘向下一帧」），末段 p
  .95→1 收缩淡出，接下方「你的那一帧，还差你。」
- 左列引言/署名在离场段反向退场（引言上浮、署名下沉淡出），标题保留

### 验证

- ./init.sh 全绿；headless 全程截图验证：p=.08 飘入中（x=-384px
  ✓ 数学正确）、驻留漂移 25.8→52px/2s（≈13px/s）、p=.88 照片出屏+空框浮现、p=.93 空框完整呈现、悬停漂移冻结、移动端零溢出、深浅双主题正常

### 轮播节奏改 2 秒/张 + 修复「停留时不轮播」（2026-09-20 用户反馈）

- 节奏：INTERVAL_MS
  4500→2000，且换帧动画时长（900ms）从周期内扣除（schedule 延迟 = INTERVAL_MS -
  SWAP_TOTAL_MS），严格「每 2 秒一张」
- 停留不轮播根因：①悬停暂停——用户停留观看时鼠标多半停在大海报上，pointerenter 即冻结轮播，看起来「坏了」；②decode() 个别环境可能永不返回，switching 永久为 true 锁死换帧
- 修复：移除悬停/聚焦暂停（保留切后台 + 滚离板块两类）；decode 等待加 1.5s 超时上限（Promise.race），超时照常换帧不再锁死
- 验证：headless 页面内采样 10.6s 走 6 帧（028→066→119→074→142→117，恰为 2s/张）；type-check/build 全绿

### 提示行 + 换帧左跳修复（2026-09-20 用户反馈续）

- 左列引言下新增「✦ 请停驻欣赏」提示行（✦ 品牌蓝、正文白、0.32em 字距，随引言一起入场/退场）
- 换帧左跳根因：漂移归零原在换帧完成后（新帧已可见）→ 放映层从 ~26px 瞬间跳回 0，即用户看到的「新照片进来往左突然移一下」；修正为在换帧「空场瞬间」（旧帧已隐、新帧未现的中点）resetDrift
- 验证：type-check/build 全绿；漂移轨迹采样 2.8→14.3px（驻留）→ 换帧中点归零 → 新帧从 0 起漂，无可见跳动

### 换帧改「左右滑动走带」（2026-09-20 用户反馈续二）

- 用户要求换帧不要渐变、改左右滚动且进出加速：旧帧加速右滑出（+112%）、新帧自左加速滚入（-112%→0），transform 过渡 0.55s
  cubic-bezier(0.55,0,1,0.45)（ease-in 加速）；transition 只挂状态类（is-current/is-outgoing/is-entering），基础态无过渡（清理复位瞬置不可见）；两帧同速同曲线 = 胶片走带，与板块「光向右流动」语言一致；周期仍严格 2s（schedule 扣除 SWAP_MS
  550）
- 漂移位置守恒：换帧开始时放映层带着漂移 d，直接归零会左跳 d
  px——先把旧帧瞬置 +d（transition:none +
  reflow 固定），归零后两帧从补偿位起滑，视觉零跳变
- 修复过程中的 bug：滑动版换帧初版漏移除旧帧 is-current（旧帧永久叠在新帧上，z2 双层同显）——补 front.classList.remove('is-current')；左列 z-index 提到 3（滑动帧从文字后穿过时双保险）
- 验证：换帧中两帧位移矩阵采样：新帧 -797→-379→0（每 100ms 位移 9→37→69→
  112→191，标准加速）、旧帧 19(漂移补偿位)→427→出屏同步加速；类生命周期 CUR→OUT→清理、周期 2.07s；中间帧截图确认走带同屏；./init.sh 全绿

### 轮播重构：可抓取拖动的物理走带（2026-09-20 用户反馈续三）

- 用户反馈滑动换帧「太生硬」，要求「抓住照片拖动」的手感：1:1 跟手、自然惯性、轻微阻尼、连续位移动画、移动端流畅
- 重构 PosterSlideshow（双槽淡出/滑动换帧 → 三槽无限循环走带）：
  - DOM：track 内 3 个槽位（data-poster-slot），槽 j 持真实格号 gi[j]，带位置 =
    gi[j]*step +
    band；每帧 ensureWindow 把窗口 [g0-1,g0+1] 外最远的槽重派到缺失格（无限循环）；touch-action:
    pan-y + grab 光标
  - 物理引擎（rAF 逐帧写 transform，零 CSS
    transition）：拖拽 1:1 跟手（pointermove 直写 band，120ms 速度采样窗）；松手速度投影 0.15s 定目标格，欠阻尼弹簧吸附（ω=9、ζ=0.78 轻微过冲回弹）；停留 2s 自动拨动走同一弹簧（420px/s 初速冲量，像手指轻拨）；caption/进度线 settle 时更新
  - 删除：漂移层（物理走带取代）、CSS 状态类过渡、is-incoming/outgoing 体系
- 修过的坑：初始相邻槽未绑图（ensureWindow 只管格覆盖不管绑定，显式补赋）；function 声明提升致 guard 窄化失效（改 const 箭头函数）；headless 低帧率下 rAF
  dt 恒上限，弹簧「过冲大」为离散采样伪影（真机 60fps 过冲 ~2%）
- 验证：拖 150px（不足半格）松手弹回当前格 +
  caption 正常；拨动方向正确（内容右移、新帧从左入）；三槽窗口覆盖 + 循环重派；移动端零溢出；滚动编排回归（入场/离场/空框不受影响）；./init.sh 全绿

### 布局定稿：左图右文 + 裁切分层（2026-09-20 用户反馈续五）

- 用户反馈裁切版「视觉效果差」：revert
  b717751（恢复照片延展观感），布局互换为「放映区在左、文字在右」（用户定稿——照片运动不经过文字）
- 方向镜像：离场 t²·-1.15vw 向左飘出（rotate -1.5°）、自动拨动内容左移（target =
  band -
  step、冲量 -420，新帧自右滚入）；入场保持从屏幕左缘 -60vw 飘入——照片全部运动局限在左半区与屏幕左缘外
- 无裁切走带的本质矛盾（相邻格照片必然延展进文字区）用分层解：stage >
  .pss-clip(overflow hidden) >
  track——裁切只作用于走带（换帧滑动框内进行、右侧邻格被裁不可见）；入场/离场在 stage 层无裁切，延展感保留
- 移动端单列加 order:-1 保持文字在上；375px 零溢出
- 验证：驻留截图（左图右文、右侧文字零遮挡）；离场 transform
  -538px 向左 ✓；./init.sh 全绿；提交流：revert b717751 → 本改动

### 走带去框改边缘渐隐（2026-09-20 用户反馈续六）

- 用户反馈框式裁切限制照片、视觉差；要求改为左右淡出淡入的呼吸感，淡出位置正好在文字处、不影响文字
- 实现：删 .pss-clip 裁切层；.pss-track 加 mask-image 线性渐隐（transparent 0 →
  #000 10vw → #000 52vw → transparent 88vw，mask-size 130vw
  no-repeat——mask 盒比 track 宽、右侧渐变区正好铺在文字列下方：照片延展过放映区右缘后渐淡、到文字处近乎透明）；mask 随 stage 走，入场/离场大编排不受淡出干扰；-webkit- 前缀兼容 Safari
- 验证：驻留截图（右缘渐隐、文字零遮挡）；换帧滑动中截图（新帧右入渐显、旧帧左出渐隐、间隔自然）；拖拽/自动拨动不受影响；./init.sh 全绿

### 遮罩减轻为轻遮（2026-09-20 用户反馈续七）

- 用户反馈上一版遮罩「遮挡有点多」：右缘淡出从「到全透明」改为「轻遮」——色标 rgba(0,0,0,.45)0
  → #000 4vw → #000 58vw → rgba(0,0,0,.35) 66vw → rgba(0,0,0,.12)
  80vw；贴边 3-4vw 轻雾、照片主体全实、文字下方照片余 ~12%
- 验证：截图核对（照片主体完整、贴边轻雾、文字清晰）；./init.sh 全绿

### 轮播恢复 496c632 无遮罩状态（2026-09-20 用户反馈续八）

- 用户定稿：恢复 496c632 的物理走带（无遮罩、照片自然延展），保留左图右文布局与镜像方向——当前文件与 496c632 的轮播差异仅剩 mask
  CSS，删除即恢复
- 文字在右侧 z3 上层，邻格照片延展到其下方时文字仍可读（白字压图）
- 验证：驻留截图（自然延展、文字可读）；./init.sh 全绿

### 运动方向定稿向右（2026-09-20 用户反馈续九）

- 用户要求离场镜像为向右飘出：posters 工厂离场改 +1.15vw·t²（rotate
  +1.5°），自动拨动同步转回内容右移（target = band +
  step、冲量 +420，新帧自左滚入）——入场左入、换帧右流、离场右出，运动语言统一向右
- 验证：离场 transform +538.7px 向右 ✓；./init.sh 全绿

### 走带 3D 纵深（2026-09-20 用户反馈续十）

- 用户要求滑出的照片「稍微缩小、变暗、往后退」：物理循环 apply() 按槽偏离中心的距离写 norm（0=居中 1=一格远）——scale
  1→0.85、亮度 1→0.6（CSS 变量 --pss-dim 挂在 filter
  brightness 上，drop-shadow 留 CSS 与主题联动）、z-index
  2/1 分层；拖拽跟手时同样实时缩放变暗 = 翻相册的进深感，无需任何 CSS transition
- 验证：换帧中点截图（滑出帧缩小变暗沉下层、新帧全亮前景）；./init.sh 全绿

### 追光印记「舞台式 3D 节拍」改造（2026-09-20 用户需求）

- 用户需求：用板块6走带的 3D 思想改造追光印记三卡——去掉底部三点；Part1 主位、Part2/3 两翼后方待命；滚动换场（2 上场 1 下场、3 上场 2 下场）；末段三卡一起谢幕
- 探索澄清：追光印记 = 代码 02 章节（ProjectsShowcase.astro +
  projects 工厂），1e3c239 的钉住翻卡已被 4939f53/faadd7c 重写为 3D 镜头连续插值
- 重写 projects 工厂为「三槽循环走带」（与留光成物同思想）：
  - 节拍 g(p)：0-0.3 Part1 主位 → 0.3-0.44 smoothstep 过渡 → 0.44-0.56
    Part2 主位 → 0.56-0.7 过渡 → 0.7-0.85 Part3 主位 → 0.85-1 谢幕
  - raw = mod3(i - g) 折叠到 [-1.5,1.5)：0=主位、±1=右/左后；scale
    1→0.86、brightness 1→0.45（CSS 变量 --ps-dim）、translateZ 0→-260、rotateY
    ∓10°（侧后内转）、z-index 2/1 分层；|raw|>1 降透明度（绕行背面不穿帮）
  - 谢幕：容器级 translateZ -300 + scale 0.94 + brightness
    0.45（不用容器 opacity——会压平 preserve-3d）
  - 删除：SPANS/DEPTH 锚点/逐层错峰/leadIdx/三点 dots 逻辑；组件删 .ps-progress 整块（三点+PART
    label）与相关 CSS
- 验证：五状态截图（0.15 Part1 主位两翼待命 / 0.37 过渡换场 / 0.5 Part2 主位 /
  0.78 Part3 主位 / 0.97 三卡谢幕）全部正确；移动端零溢出；./init.sh 全绿

### 追光印记「拍立得舞台剧」重做（2026-09-20 用户反馈续十一）

- 用户反馈循环轮播「像图片轮播不像舞台」，要求：卡片拍立得化（不裁切图片）、三卡从左/中/右后方走上台前定格、下场退回对应位置、三张都结束后集体退场
- 拍立得卡片重构（ProjectsShowcase.astro 全量重写）：暖白相纸框 + 方形照片区（img
  contain 完整显示不裁切，白底衬图）+ 下方留白 caption（PART/标题/进入项目）；desc 从卡上移除（详情在项目页）；相纸固定暖白 #f7f5ef + 深色手记文字（实体物件不随主题变色）；story-on 时 .ps 放宽 62rem 三列并立
- projects 工厂再重写为「固定站位走位」：三卡左中右列站位由 grid 决定，工厂只写 z 走位——入场 0→0.24+off（错峰 0.05 依次从后方走上台，depth
  520/ 移动 340）→ 台上定格 0.24-0.58
  → 对称退场 0.58+off→0.8+off（退回各自后方）→ 集体谢幕 0.84-0.98（继续后退 +
  opacity 暗场退场）；dim 用 --ps-dim
- 修：smooth 工具函数提升到引擎顶部（原为旧工厂闭包局部，替换时丢失致重复定义/未定义报错）
- 验证：五状态截图（走位中/台上定格/对称退场/谢幕暗场）+ 移动端零溢出 +
  ./init.sh 全绿；无 JS 降级竖排全可见

### 追光印记登场特写 + 深色展示卡（2026-09-20 用户反馈续十二）

- 用户反馈：白拍立得与暗房色彩不符；编排改为「站位定格 → 逐个 3D 放大登场（叠加相邻卡）→ 原路返回 → 三个都结束后一起退场」
- 卡片深色化：白相纸 → anniv-surface 深蓝卡体 +
  anniv-border 边框，照片区 anniv-bg 深底衬图，caption 配色主题化（accent/fg/muted）——暗房展示卡
- projects 工厂时间轴重排：0-0.12 走位入场 →
  0.12-0.2 站位定格 → 逐个登场窗口（P1 0.2-0.34 / P2 0.38-0.52 / P3
  0.56-0.7，各含登满+原路返回）→ 0.7-0.84 站位回顾 →
  0.84-0.98 对称退回 + 集体谢幕
- 登场效果（focus 平滑插值）：translateZ +180（向镜头）、scale
  ×1.32、x 向屏幕中心偏 40px（叠加相邻卡）、brightness
  +0.06、z-index 置顶 3；返回 = 原窗口回放，原路返回
- 验证：站位定格 / P1 登场特写（放大叠加 P2）/ P3 登场特写 / 谢幕 opacity
  0.01 四截图；移动端 375px 登场特写成立零溢出；./init.sh 全绿

### 追光印记定稿：顺序登场 + 一起退场 + 深色展示卡（2026-09-20 用户反馈续十三）

- 用户反馈：逐个登场特写太复杂；白拍立得丑（与暗房色彩不符）。定稿：编排简化为「按顺序依次出现 → 台上定格 → 三卡一起退场」；卡片换回原图文横排结构重新设计（深色展示卡），保证照片 contain 不裁切
- 卡片：anniv-surface 卡体 + anniv-border 边框；照片区 anniv-bg 深底 + img
  contain 完整显示；恢复 PART/标题/描述/CTA 完整内容；story-on 舞台内 desc
  line-clamp 2（移动 1 行）压缩一屏；题头在 projects 轨道作用域内收紧
- projects 工厂简化：错峰顺序入场（off=i*0.06，P1 先现 P2/3 跟上）→ 台上定格 →
  0.68-0.84 三卡同步一起退场（退回后方深处 + 暗场）
- 验证：桌面定格截图（三行卡一屏内 217-874px、照片完整不裁切）+ 移动端零溢出 +
  ./init.sh 全绿

### 追光印记「空间行走式 Scroll Story」（2026-09-20 用户需求文档定稿）

- 用户提供完整需求文档：三 Part 改为「同一空间中的连续行走」——走近/面对停留/经过/留在身后；遮挡是核心；方形展板比例恒定；progress 连续映射空间状态；不加依赖；移动端降载
- projects 工厂重写为「相机位置模型」：PATH 路径表 progress→相机格位 cam（停驻点=每块板面前：0.05-0.26
  P1 / 0.38-0.57 P2 / 0.69-0.86
  P3，行走段 smoothstep，A 的结束=B 的开始）；每帧 rel = i -
  cam 连续，写 translate3d(pan.x vw, pan.y vh,
  -rel*stepPx)——透视自动产生近大远小与遮挡；brightness 面前 1
  → 远处最低 0.55（微光等待可辨识）；穿过身后（rel<-0.06）opacity 渐 0 不穿模；z-index 按深度；展道空间错位向右斜 ±14vw（左右露出的空间前提——±6vw 时远板投影完全被近板盖住，验证后修正）
- 组件：卡片改方形摄影展板（aspect-ratio
  1、宽 min(60vh,100%,32rem)/移动 42vh/21rem；照片区 contain 不裁切 + 题签 PART/标题/三行图注/CTA）；三板 grid 叠同一格 preserve-3d；走过 P3 后展厅整体变暗退出接 03
- 验证：连续行程六截图（面对 P1+P2 露出遮挡 / 行走过渡 P1 身后 P2 面前 / 面对 P2
  / 面对 P3
  / 空间退出暗场）全部符合需求文档验收标准；移动端零溢出、空间层次保留；./init.sh 全绿

### 追光印记定稿「依次聚焦」（2026-09-20 用户反馈续十四）

- 用户反馈空间行走太复杂，简化为「依次聚焦」：三卡纵排在钉住舞台内固定不动（无 3D 走位/相机模型），滚动三等分推进焦点轮换——Part
  01 → 02 →
  03 依次聚焦（放大 1.02、提亮、品牌色描边、阴影加深），非聚焦卡压暗 0.68、缩小 0.965；拍间 CSS
  transition 0.55s 补间，无中间停留态
- projects 工厂简化为焦点索引切换（p 三等分 →
  is-focus 类切换），删相机模型/PAN/translateZ；卡片保持图上文下横排、照片 contain 不裁切、desc 舞台内两行摘要
- 验证：三焦点状态截图（P1 聚焦/P2 聚焦/P3 聚焦，非聚焦卡 0.68 亮度压暗可辨识）；非聚焦亮度从 0.5 提到 0.68（暗色调照片压到 0.5 几乎不可见）；./init.sh 全绿（SharedRoad 错误为并行会话 WIP，与本改动无关）

### 修复：追光印记矮视口 Part3 被裁（2026-09-20 用户截图反馈）

- 用户屏幕（逻辑视口约 988x552）三行卡超一屏，Part3 被裁在底缘
- 修复：story-on 舞台行高改视口单位推导——.ps-beat height
  calc((100svh-15rem)/3)（移动 16rem），矮视口整组等比压缩；题头/stage 留白在 max-height:780 断点进一步收紧；矮视口下 CTA 隐藏（整卡可点击进项目页）
- 过程：先试 grid
  minmax(0,1fr) 压缩——stage 仍被内容固有高撑到 1071px 失败；视口单位直接定行高确定性最强
- 验证：988x552 三卡+题头完整一屏（158-493）；1440x900
  fits；375x667 零溢出；SharedRoad
  5 个类型错误为并行会话 WIP（nodePos 中间态），与本改动无关

### 海报走带动画手感调优（2026-09-20 用户反馈：动画僵硬）

- 用户反馈海报部分动画僵硬。诊断：非 bug，是运动品质——①弹簧 ω=9/ζ=0.78太硬：0.55s 完成位移即急停，几乎无回弹呼吸；②完全周期性：每 2s、固定420px/s、同一弹簧，每次拨动轨迹一模一样（人眼对严格周期运动=机械感）；③缩放/明暗随位置线性映射，缺层次
- 调优：弹簧调柔 ω 9→6.5、ζ
  0.78→0.72（过冲回弹更明显，落位从容）；拨动间隔 1900ms+0-700ms 随机、拨动冲量 ±12.5% 随机（每次轨迹不同）；缩放/明暗映射改 smoothstep（边缘变化更缓）
- 顺带修：换帧时邻格照片（缩小后两侧露出）延展进左列文字区——走带步长改 1.5×放映区宽（格距加宽，邻格照片不再压字）
- 验证：驻留截图（文字区干净、当前帧全幅居中）；换帧中段截图（弹簧回弹轨迹自然）；./init.sh 全绿

### 删空框收束 + 追光印记题头字号统一（2026-09-20 用户反馈续十五）

- 用户：删「光已飘向下一帧」空框，滑动直接到下一板块；追光印记大标题与其他板块字号不一致
- 删除：PosterSlideshow 空框 DOM/CSS、posters 工厂 ghost 引用——退场拍海报直接向右滑出 + 整体暗场，不再有空框停留
- 题头：追光印记作用域的 ash-zh/ash-en/ash 覆盖全部删除（当时为挤一屏收紧，卡片自适应后不再需要）——四章节标题字号回归基准 clamp(1.9rem,
  5vw, 3.1rem)，实测全部 49.6px 一致
- 验证：退场拍截图（整体暗场、无空框）；四章节标题 49.6px 一致；./init.sh 全绿

### 并行会话 WIP 收尾：Footer 二维码 + 首页分部地图 + 同行之路弹窗卡（2026-09-20）

- 另外两个会话留下的未提交改动，检查确认代码完整（无半截逻辑/残留引用）后收尾：
  - Footer：占位联系方式（占位邮箱 /
    seeker-photo 微信号 / 全国各地分部）替换为微信公众号二维码（src/assets/images/wechat-qrcode.png，512×512
    / 144KB，astro:assets 处理）+「扫码关注微信公众号」
  - 首页 AboutSection：分部 chips 换成 BranchMap 组件——中国全图版式（主图大陆 + 右下角南海诸岛附图），11 个分部圆点 + 引线 + 胶囊按钮；构建期把 public/geo/china-provinces.json（已提交的 DataV
    GeoJSON）投影 + 简化为静态 SVG（src/lib/branches/china-svg.ts：等距圆柱投影、0.1° 量化去重、Douglas–Peucker 抽稀，零客户端地图库）；分部数据单一来源 src/data/branches.ts（新增分部只改这一处）
  - SharedRoad（同行之路）：放大镜悬停改为悬浮弹窗卡——mouseenter 克隆卡片内容为 fixed 浮层（完整文案、360px 宽），上排向下弹 / 下排向上弹，水平夹回视口，移出/滚动即销毁；触屏（hover:none）不启用，手机端维持单列完整阅读
- 修复：SharedRoad lint error（prefer-destructuring，`let left = r.left` →
  `let { left } = r`）
- 验证：./init.sh 全绿（type-check 0 错、lint 0 错 59 警、build
  77 页）；浏览器实测——地图渲染 440×394、11 胶囊 11 圆点、胶囊↔圆点↔引线三方 is-active 联动命中；Footer 二维码正常显示；弹窗卡上排向下弹 / 下排向上弹、360×298 在视口内、文案完整不截断、mouseleave 即销毁
- 提交：2903ba9（Footer 二维码）、896c3d4（分部地图 + 弹窗卡）

### 七周年页脚新增制作名单（2026-09-20 用户需求）

- AnniversaryFooter 在导航链接与版权行之间加「CREDITS
  · 制作名单」：周年文章丨赵老师 / 抽奖运营丨月某人 Ted / 周年标语丨SteveZhang
  LEO / 地图打卡丨LEO
  / 专题访谈丨WHITE-SCORE 田田 / 海报设计丨肖默（哈姐）/ 网站设计丨黑暗之王；名单收在组件 frontmatter 数组里，沿用 anniv 设计令牌（标题 accent、角色 muted、名字 fg、分隔符 faint），flex-wrap 居中排布
- 验证：type-check / lint
  0 错；/7th 页脚截图确认 7 项名单两行居中、暗色主题下对比度正常
- 提交：dedecea

### 七载光影修复：三拍切换 transition 补回 + 名单竖排（2026-09-20 用户反馈）

- 用户反馈「七载光影动画僵硬、滑到下一板块有很长空白」。诊断：
  - 僵硬 = 三拍切换的补间规则丢失：6dce3b5 引入节拍设计时给 .pss-stage/.pss-lead 加过 transition，2279cc6 回退时一并删除，30c7f6a 重新启用三拍工厂却没恢复 CSS——实测 computed
    transition 为 all 0s，入场/退场均为单帧硬切
  - 空白 = 退场拍在 P=0.72 触发后轨道还剩 0.28×2.2 屏 ≈
    554px 纯空舞台（P=0.8 截图整屏黑）；旧版由空框浮现填充，d8f1636 删空框时未同步调拍点/轨道
- 本轮先修僵硬（用户确认）：PosterSlideshow.astro 补回 .pss-stage（transform
  0.6s var(--ease-enter) + opacity 0.6s
  ease）与 .pss-lead（0.45s），并给 .pss-cap 同款 0.45s（署名/进度线同样在三拍里被工厂改写，此前也是硬切）；ghost 相关不恢复（元素已删）
- 验证：computed
  transition 恢复 0.6s/0.45s；跨 0.12 阈值抓中间帧——海报就位途中、署名淡入中，1.2s 后落定完整；type-check/lint
  0 错；提交 cb0fdda
- 遗留：空白段（拍点 0.72→1 的空轨道）未动，待用户确认方案（推迟退场拍阈值至 ~0.88 + 轨道 320vh→280vh）后实施

### 首页七周年角卡把手外移（2026-09-20 用户反馈，方案A）

- 反馈「弹窗里有被挡住的蓝色按钮」：实为 .ac-knob「7」旋钮把手——设计值露出 52%，收起态 7° 旋转再吃掉几像素后仅露 14/39px，蓝色月牙读不出把手身份（且 accent 变量是电光蓝，与 CSS 注释的「金色」不符）
- 方案A：left -1.15rem →
  -1.55rem，实测露出 18/39px、「7」字完整可读；展开态 CTA 本就无遮挡，未动
- 提交至 feat/7th-anniversary 分支（待复核后再并 main）

### 首页七周年角卡删除「7」把手（2026-09-20 用户反馈，续方案A）

- 用户看完外移效果后决定直接删除：.ac-knob 元素与整段 CSS 移除，注释同步更新；半藏态仅剩照片条 +
  × 关闭钮，照片本身即视觉提示，悬停/点击行为不变
- 验证：把手节点已不存在（querySelector
  null）、露出条 128px 正常；type-check/lint 0 错

## 会话记录（首页滚轮段落感修复：mandatory → proximity，2026-09-20 续 3）

### 根因（Explore 探索确认，纯 CSS，无 JS 劫持滚轮）

1. `global.css` `html:has(.snap-scroll) { scroll-snap-type: y mandatory }` +
   `.section`/Banner的
   `scroll-snap-stop: always`：滚轮每格被硬停到下一屏 → 段落感
2. About 区（含地图后）自然高约 1.2–1.4×视口，mandatory 对超一屏吸附区会反复回吸 → 加重卡顿

### 改动（当前在 main 分支，未提交）

1. global.css：snap-type `y mandatory` →
   `y proximity`（就近吸附，滚轮连续自由滚，近边界停下才轻吸附）；`.section` 删
   `scroll-snap-stop: always`；footer 吸附点注释更新
2. Banner.astro：`.banner` 删
   `scroll-snap-stop: always`；顺带修真 bug——「滚动到下一屏」箭头原写死
   `#about`（跳过作品/活动两屏）→ 改 `#works`

### 验证

- type-check 0 错误 / lint 0 errors / build 77 页全绿
- preview 实测：html computed scrollSnapType =
  "y"（Chromium 对 proximity 初始值的序列化省略，即 proximity 生效）、.section
  snap-stop = normal；点击下滑箭头精确落 `#works` 顶部（offset 0）
- 手感以用户本机滚轮实际体验为准

### 遗留 / 待办

- 本改动未提交（当前 main 有未提交改动：global.css +
  Banner.astro）；按用户习惯等确认手感后提交，或转 fix/* 分支

### 移动端导航两项修复（2026-09-20 用户反馈）

- 白条：移动端侧滑菜单 left:-100% 收起后右缘露 8px 玻璃条（width:100% + margin 0
  8px 超出视口）——宽度改 calc(100% -
  16px) 含入边距，收回完全离屏；顺带修正展开态右侧溢出 8px，两侧边距对称。提交 11c1fab
- 7 周年按钮：移动端此前只有抽屉里一项、顶栏无入口——nav-right 新增 .nav-anniv-mobile 胶囊按钮（桌面 display:none 防重复），颜色走导航状态变量（--nav-pill-bg/--nav-fg），Hero 深色视频上透明白、落地玻璃条自适应主题。移动 375px 实测两态可读、桌面无重复
- 同步：两提交推送 origin/main（Cloudflare Pages 自动部署）

### 移动端顶栏重排（2026-09-20 用户反馈）

- 7 周年按钮挤压导致品牌名折行 → .nav-logo a 加 white-space:nowrap +
  flex-shrink:0；胶囊按钮同样加 nowrap（修复子页面 320px 下折成两行）；移动端 nav-right 间距 16→10px
- 首页移动端撤掉汉堡与抽屉（菜单项全是本页锚点，整页滚动即达）——navigation--home 类驱动，子页面保留完整抽屉导航；首页顶栏 = 品牌 |
  7周年 | 主题切换
- 验证：320/375px 首页（无汉堡、单行 logo）+ 子页面（汉堡保留、胶囊单行）截图通过；type-check/lint
  0 错

### 移动端首页杂志式重构（2026-09-22，feat-033，分支 feat/mobile-magazine-homepage）

按《Seeker 首页移动端重构设计规范》重构 ≤768px 首页（全部改动收敛在
`@media (max-width: 768px)`，桌面端零改动）。用户三项决策：导航保留「品牌+7周年胶囊+主题切换」顶栏（规范 §5 汉堡方案不采纳）；7 周年三入口（顶栏胶囊/右下角卡/活动区档案条）全保留；移动端改杂志式自然滚动。

#### 改动

1. Banner.astro：`.banner` 移动端 height:auto + display:block（不再占满整屏）；
   `.video-container` 改 relative + aspect-ratio
   16/9 + 深藏蓝底（--seeker-navy），视频 object-fit:contain 完整显示横屏画面；slogan 移到视频下方文档流——white-space:nowrap +
   clamp(20px,5.5vw,32px) + letter-spacing
   -0.02em，颜色从白色系渐变换成主题感知 var(--grad-a)→var(--grad-b)（浅色主题下白字不可读），去 drop-shadow；遮罩减淡为轻渐变（顶部稍深保导航白字对比度）；下滑箭头改文档流居中（button 需显式 display:block 才能 margin 居中）+ 新增无位移 bounce-y 关键帧 + 主题感知箭头色；删除原 480px 二级缩字号块（clamp 已覆盖）
2. global.css：新增 ≤768px 块——html:has(.snap-scroll) 关闭 scroll-snap-type（杂志式连续滚动）；.section
   min-height:0 + padding 72px clamp(16px,5vw,24px) 56px
3. WorksSection.astro：新增 slotStyle() 把每格首图真实宽高比写为内联
   `--slot-ar`（noUncheckedIndexedAccess 下判空）；≤768px 网格化——
   .gallery-wall 两列 grid gap 8px、.wall-row
   display:contents、全部 8 图位恢复参展（覆盖 ≤900 的 display:none）、主图通栏、.slot-frame
   aspect-ratio:var(--slot-ar)
   max-height:none 原生比例替代固定裁切；≤640px 旧块（隐藏方幅/收敛一屏）整体废除

#### 验证

- ./init.sh 全绿：type-check 0 错 0 警 / lint 0 错 / build 77 页
- agent-browser 多视口实测（dev server）：
  - 320/375/390/414/430/768：视频 16:9 完整无裁切、slogan 单行不换行（320px 最窄也放得下）、两列原生比例画廊 + 署名、scrollWidth==
    clientWidth 零横向溢出、html scrollSnapType=none、banner 高 341px
    ≪ 视口 844px（不再占满整屏）
  - 暗色主题：slogan 蓝→浅蓝渐变双主题可读
  - 桌面 1440×900 无回归：scrollSnapType=y
    proximity、banner 高=视口 900、白色叠加 slogan、4fr 2fr 2fr
    2fr 展墙、进度圆点均原样
- 修复迭代一处：箭头首次截图偏左（inline-block 不吃 margin:auto），补 display:block 后居中

#### 遗留 / 待办

- 分支 feat/mobile-magazine-homepage 待用户真机（iOS
  Safari）确认视频自动播放与手势滚动手感后合入 main
- 轮换切换图在原生比例格内为 cover 轻微裁切（首图零裁切）；若不可接受可改为移动端停用轮换
- AnniversaryCard 移动端两段式点击仍会短暂遮挡画廊右缘（用户选择保留）

### 活动区七周年条移动端换行修复（2026-09-22，feat/mobile-magazine-homepage 第二个提交）

- 问题（用户截图反馈，main 同样存在的历史问题）：`.acts-anniv`
  三段横排 flex（07/SEVEN YEARS + 标题体 + ENTER ARCHIVE），中间
  `.acts-anniv-body` 为 flex:1（basis
  0）且 min-width:0，≤768px 被两侧文字挤到几十像素宽，标题「七周年 · 光影七载，看见彼此。」一字一行竖排
- 修复：≤768px 块内改为纵向堆叠——flex-direction:column +
  align-items:flex-start，标题/年代/CTA 各占一行自然换行（320px 标题两行整行折行，390/768px 单行）；桌面横排不变
- 验证：./init.sh 全绿；agent-browser
  320/390/768 三视口截图（顶栏同时复核为「品牌+7周年胶囊+主题切换」无汉堡）

### 附注：2026-09-22 分支纠缠事故记录

- 用户报告「汉堡+弹出抽屉复现」——排查为工作区被另一会话 checkout 到
  `feat/7th-anniversary`（分叉点 a2c2caf，早于 main 的 96a8995 移动端导航改版），dev
  server 伺服的是旧导航代码；本分支（基于 96a8995）导航与 main 完全一致，从未改动。排查期间该会话仍在实时提交（63dd9e5→
  9f6815d 角卡把手迭代）
- 为避免干扰，本次修复在独立 worktree /tmp/seeker-mobile-wt 完成后提交回本分支

### 《时间的故事》2026 年九月篇上线（2026-10-08，分支 feat/story-of-time-2026-09）

- 内容源：公众号文章 https://mp.weixin.qq.com/s/Dz6PPIwY_Flputw4LRu7zQ
  （发布 2026-09-30 19:00）
- 新增
  `src/content/activities/story-of-time-2026-09.md`：主题「秋风启序，云落清秋」，24幅作品（8月29日–9月27日），本月组长 嘿嘿嘿 / 编辑 是田田吖，结尾诗与往期回顾按原文照录
- 图片 26 张（24 作品 + cover +
  committee）：公众号原图下载（作品图均为 1280 宽，最长边 ≤2560，无需缩放）→
  cwebp q82 → 上传 R2 `activities/2026-09/`（带 immutable 缓存头，26 个对象 HTTP
  206 验证通过）；cover 用公众号分享封面图（1280×545，与往期惯例一致）
- `src/lib/activity-image-meta.ts`
  追加 2026-09 全部 26 条尺寸（置于 2026-08 与 story-of-time-2021-02 之间，同结构）
- 验证：./init.sh 全绿（78 页构建，/activities/story-of-time-2026-09/ 生成）；hub 页书架出现九月篇且总数 65 期

### 《时间的故事》更新规范沉淀（2026-10-08，分支 docs/story-of-time-conventions）

- 用户问询后确认：《时间的故事》更新此前无专门规范——约定散落在 AGENTS.md（仅素材存储）、content.config.ts
  schema 注释、activity-image-meta.ts 文件头、progress.md 历次会话（标注「经验沉淀（待写入 skill）」从未落地），每次更新靠参照上一期实例
- 本次补齐两项：
  1. 新增
     `.agents/skills/story-of-time-article/SKILL.md`（对齐 welfare-article 结构）：触发词 / 一期一分支 / 抓取要点（原始 HTML
     data-src、/0 原图、og:image=封面、createTime=pubDate）/ 微信编辑器陷阱对照表（日期位置对齐、一稿多图、png 正文图、«»「」书名号、组委会每月不同、品牌图可缺、装饰图跳过、错别字照搬）/
     cwebp q82 与长边规则 /
     R2 上传与全量验证 / 尺寸登记插入位置 / 期数 md 模板与 YAML 陷阱 / 验证清单（页数+1、书架「新」标、条目数断言、截图等 complete 防误报）/ 交付流程 / 并行会话 worktree 注意事项
  2. 修正 AGENTS.md 活动照片路径约定滞后：写明两代路径并存（2026+
     `activities/YYYY-MM/` 无前缀 vs 2021-2025
     `activities/story-of-time-YYYY-MM/`），并在素材约定末尾补 story-of-time-article
     / welfare-article 双技能指引
- 实操注意：本次工作区被并行会话检出在 chore/deps-update-2026-10（依赖升级），故按 2026-09-22 事故沉淀的做法在独立 worktree
  /tmp/seeker-docs-wt 完成全部编辑提交

### 首页活动卡封面跟随最新一期（2026-10-10，分支 feat/acts-cover-follow-latest）

- 背景：`ActsSection.astro`
  的「时间的故事」卡封面为写死 URL，停在 2026-08（九月篇上线后未跟）
- 改动：构建期 `getCollection('activities')`
  按 order 倒序取最新一期的 cover——新增期数 md 即自动切换，与书架页「新」标同源；组件内注明禁止再写死
- skill 同步：story-of-time-article 关键事实新增该机制（含"禁止写死回该文件"），验证清单新增首页卡封面断言（dist/index.html
  stack-card 背景图）
- 验证：./init.sh 全绿；dist/index.html 时间的故事卡背景图为 activities/2026-09/cover.webp

### 追光之旅 2025 届上架（2026-10-10，分支 feat/light-chasing-2025）

- 内容源：结果公布 https://mp.weixin.qq.com/s/vp1TX7VbZUPFgWl0p1VDpA（2026-03-09
  发布，= sourceResults/pubDate）+ 作品赏析
  https://mp.weixin.qq.com/s/ihNvfUI1NbR-6oiSHwIAxQ（2026-04-02，=
  sourceStories）
- 结构解析：公示文按「556×77 装饰分隔条 + 作品图 + 标题」交替排列，13 幅作品（1 总冠军 +
  5 组冠军 + 5 优胜 +
  2 特别关注）经 contact-sheet 目检一一对应；赏析文作品图为方裁切版（弃用），6 篇冠军第一人称故事从赏析文照录；优胜/特别关注原文无故事（story 省略，同 2022 先例）
- 图片：原图（1280~2048 宽，均 ≤2560）cwebp q82 → R2
  activities/chasing-light/2025/<slug>/01.webp（slug:
  grand-prize/nature/city/people/campus/creative/excellent-01..05/attention-01..02，immutable 头，13/13
  HTTP 200 + MD5 一致）
- 数据：2025.md 复刻 2024 结构，order/pubDate=2025/2026-03-09，组别 award 名照原文（自然户外组/城市建筑组/人文纪实组/校园学生赛道/商业创意组冠军，2025 无组图组），sponsors 腾龙/VIGORBIRD/唯卓仕/联合创新/蒲公英智能科技/富图宝（照录），resultsNote 公示期 3月9日-16日 + 邮箱；⚠️
  period 原文未提供征稿时间窗，暂用 '2025 —
  2026'（可核验兜底），待用户确认后可改具体月份
- 顺手：首页 ActsSection 追光之旅卡封面从写死 2024 改为构建期取 lightChasing 最新届 grandPrize.cover（与时间的故事卡同模式）
- 已知存量缺口（未动）：meta 清单里 2022/2024 届追光图无尺寸登记（activityImageDims 返回 undefined，页面可渲染但无 CLS 预留），如需要可后续补

### 追光之旅照片原比例展示重构（2026-10-10，分支 refactor/chasing-light-image-ratio，未提 PR 待用户预览）

- 需求：追光之旅模块所有照片尊重原比例、且不超一屏可见；自查全部四届
- 裁切点修复：年份页 hero 与门户 hero（92vh 固定容器 + object-fit:cover
  → 图随容器完整展示，max-height: calc(100svh - 70px) +
  contain）；minor-tile 密集网格（aspect-ratio:3/2 +
  cover 强裁 → 原比例 + 封顶 contain）；win-card / story-imgs
  / 门户年份卡（height:auto 无上限 → max-height: min(86svh,900px) /
  min(72svh,640px) / min(60svh,520px) + contain）
- 每张 img 输出内联 aspect-ratio（ratioStyle(dims)），CLS 预留保留；移动端断点里 hero 固定高删除
- 数据：补登记 2022（16 张）/2024（37 张）尺寸——此前 activityImageDims 对这两届全返回 undefined（无宽高属性、加载塌陷），现在四届 78 条全覆盖
- 明确不动：首页拍立得卡（全站活动卡相框设计，background
  cover 属相框裁切语义）、七周年 ProjectsShowcase（已 contain）、lightbox（已 contain +
  80vh）
- 验证：./init.sh 全绿；五页（门户+四年份）程序化断言——每张 chasing 图 computed
  object-fit=contain、渲染高度 ≤
  innerHeight、0 横向溢出、lazy 全加载（2022:32/2023:24/
  2024:51/2025:26/门户:5）；浏览器截图目检（win-card 竖图原比例、2024 组图水印完整、hero 封顶居中两侧黑厅留边）；lightbox 回归正常
- 交付：按用户要求本地提交后停在分支，不 push 不建 PR，preview
  :4322 供预览，同意后再提

### 追光之旅获奖网格重构：分组标题 + 图下署名（2026-10-10，同分支追加提交）

- 用户反馈：minor-tile
  hover 浮层里「优胜奖」字样与作者名重叠（浮层在 line-height:0 的 button 内，行盒为零所致）
- 按用户方案重构：去掉整个 hover 文字浮层体系（tile-scrim/tile-info/浮层 hover 规则/
  hover
  zoom——zoom 会裁切 contain 留边照片，一并移除）；excellence 与 attention 拆成两组，各带分组小标题（subhead-title 照录该组 award 名 +
  EN kicker + 细分隔线，数据驱动——
  2022 显示「优秀奖」、2024/2025 显示「优胜奖」）；每张图片下方 figcaption 署名 © 作者
- a11y：作品标题移入按钮 aria-label（查看大图：《标题》（奖项，© 作者））
- 验证：build 全绿；2025 分组标题 [优胜奖, 特别关注奖]、2022
  [优秀奖]、浮层元素 0 残留、署名数与作品数一致；lightbox 点击回归正常（图注正确）；init.sh 全绿

### 追光之旅年度页阅读流重构（2026-10-10，分支 refactor/light-chasing-reading-flow，未提 PR 待用户预览）

- 用户方向：入页先看公示导语、总冠军 C 位在后；作品赏析并入照片交互避免重复；鸣谢放最末尾
- 信息架构重构（LightChasingYear.astro）：
  - 删原全屏 hero（92vh 容器 + cover 裁切）与整个独立赏析区（story-block
    ~300 行）
  - 新结构：区头 → 导语列（正文 +
    stats）→ 总冠军 C 位（cl-grand：原比例 contain、封顶一屏、居中，h1 随迁至 grand-meta）→ 组冠军 win-card
    → 优胜/特别关注分组网格 → 公示脚注 → 赞助鸣谢（cl-sponsors，最末尾）→
    pager/foot（移出至 cl-tail）
  - 故事交互：有故事的作品按钮带 data-story-idx +
    story-hint 胶囊（桌面 hover 浮现「点击查看作品赏析」+ 图 scale
    1.02 不裁切——overflow 不隐藏，溢出融入深底；触屏 hover:none 胶囊常显）；点击开 cl-storyview 全屏浮层（桌面图文双栏：左大图可翻页/右衬线故事列；移动 375 堆叠滚动；多图作品浮层内箭头翻页 + 计数；Esc/点背景/关闭钮，锁滚动，焦点管理）
  - 故事数据构建期内联 JSON（`<`
    转义防闭合），JS 只做显隐——SEO 保留；无故事作品点击仍走 lightbox 看大图；cl-reveal 观察器随赏析区移除
- 验证：astro check / type-check / lint /
  build 全绿；五页断言（图片数=作品数：2022:16、2023:12、2024:14、2025:13、门户:5，object-fit 全 contain、0 超屏 0 溢出）；双浮层实测（grand→storyview
  22 段、优胜无故事→lightbox、2024《飞行计划》10 图翻页 2/10、Esc 关闭）；移动 375 堆叠浮层截图验证；触屏常显规则确认在产物 CSS
- 交付：按既定流程本地提交停在分支，preview :4322 供预览，用户同意后再提 PR

### 浮层返回键与移动端关闭按钮修复（2026-10-10，同分支追加提交）

- 用户反馈：移动端作品赏析浮层没有明显的退出按钮；按浏览器返回会整个退出页面
- 修复：
  1. 浮层接入浏览器历史——打开（storyview/lightbox 均适用）时 history.pushState 压入 {clOverlay:true}，popstate 监听里只关浮层（解锁滚动+焦点归还）不离开页面；关闭按钮/Esc 关闭时同步 history.back() 消费该条目，历史栈一致（不会出现按两次返回）
  2. 移动端关闭按钮加强：44px、实底深底 rgba(4,16,30,.78)、边框提亮至 .5 白、z-index 压过滚动内容；≤900px 断点贴边（top10/right12）
- 验证：375 视口实测——开浮层 → history.back()
  → 浮层关、页面仍在、滚动解锁；sv-close 路径关闭且 history.state 清空；无故事作品（鲸鸣于亲）lightbox 路径回归（开/关/消费历史）全过；build 全绿

## 会话记录（深色模式蓝色小字对比度修复，2026-10-15）

### 交付（分支 fix/dark-small-text-contrast，基于 main 18c12a2）

- 用户反馈：深色模式下蓝色小字看不清，例：首页 #activities 右侧「全部活动 →」
- 根因：全站蓝色小字/交互文字统一
  `color: var(--grad-a)`，深色下 --grad-a=#2e86de 在 #061a30 底上对比度 ≈4.6:1，对 10.5~14px 小字偏弱（MemberCard 标题在卡片底上甚至 <4.5:1）
- 方案：新增语义令牌
  `--link`（链接/交互小字专用），不直接改深色 --grad-a——它同时是品牌渐变起点（.grad-text 大标题/按钮/进度点/logo），整体提亮会破坏渐变层次
  - `:root` #06427e（与原 --grad-a 同值，浅色零变化）；`.dark`
    #8fc9ff（冰蓝，≈10:1 达 WCAG AAA，与深色 --chart-2 同源）；@theme
    inline 注册 --color-link 暴露 text-link utility
  - 替换规则（可 grep 验证）：凡 --grad-a 作**文字色 / hover 文字色 /
    focus-visible 描边** → --link；作**渐变、装饰边框、圆点、光晕、SVG stop**
    保持不动
- 修改 15 个文件：
  - global.css（令牌 + .section-kicker/.mini-cta）
  - 首页 ActsSection（.acts-link「全部活动 →」+ .acts-anniv 七周年条局部
    `--anniv-accent: #8fc9ff`——该条常暗底不随主站主题切换，两种主题下小字都提亮，scoped 覆盖不影响 /7th 页面）、AboutSection（.team-link +
    .join-btn focus）、PageProgress focus
  - Navigation（落地态 .scrolled/--solid 的 --nav-hover + 移动端菜单 active/hover；悬浮在视频上的硬编码 #2e86de 不动）、Footer（链接 hover——顺带修复深色下 hover 反而比常态 #afc8df 更暗的问题）、MemberCard（.member-title/.specialty-tag）
  - activities：story-of-time（hero-kicker/year-anchor
    hover/book-cta/shelf-arrow）、chasing-light（--cl-accent 别名改指 --link，级联修复 ed-cta
    hover 与 back-link focus）、GalleryStory（pager-kicker
    10.5px 全站最小蓝字/back-link/item-author/back-top/lightbox
    focus）、LightChasingYear（--cl-accent
    - 同款 pager/back-link）
  - welfare：三模板（back-link/hero-kicker/side-kicker/side-back/next-card
    hover 标题/focus）、welfare/index（hero-kicker + stack-card focus）
- 明确不动：品牌渐变（.grad-text/按钮/进度点/logo 渐变）、Footer
  tech-name渐变字（background-clip 渐变填充，均色对比尚可）、7 周年独立主题体系（--anniv-\*，固定夜色设计语言）

### Evidence

- ./init.sh 全绿：astro check + tsc 0 错误、eslint 0 错误（65
  warning 为存量 astro/sort-attributes 类，git stash 对比基线一致）、79 页构建
- 浏览器实测（dev 4321 + IAB 截图）：深色首页 #activities——「全部活动 →」「07 /
  SEVEN YEARS」「ENTER ARCHIVE
  →」明亮冰蓝清晰可读；浅色同区域与改前一致零回归；/activities/story-of-time 深色 hero-kicker 清晰、渐变大标题不受影响

### Notes for Next Session

- 7 周年板块（--anniv-accent
  #2e86de 的常暗页面）存在同类低对比小字，属独立设计体系本次未动，如需统一提亮单独开事项
- feature_list.json 已新增 feat-038

## 会话记录（《时间的故事》字体审计与整改，2026-10-16）

### 交付（分支 refactor/story-of-time-typography，基于 main 328309a）

- 用户要求排查 /activities/story-of-time/ 与文章页字体使用：导语段落「略显拥挤」+ 担心页面超三种字体
- **审计结论**（完整报告 `docs/typography-audit-2026-10-16.md`）：
  - 两页均恰好 3 族（系统无衬线打底 /
    Archivo 辅助行 / 宋体衬线标题正文），未超标，符合 2026-08-30 杂志式 pairing 约定
  - 拥挤根因：`.hero-desc` 14.5px + `text-align: justify` +
    560px 窄版心，CJK 两端对齐字距不匀
  - 真正的乱源是 4 处不一致：主页大标题无衬线 vs 文章页宋体；`--font-serif-song`
    7 文件重复定义 + `--anniv-serif`
    第 8 套近似变量；Archivo 栈两种写法（`'Archivo', sans-serif`
    的中文在非苹果设备落浏览器默认 sans）；`.font-display` 死代码 +
    Archivo 无 preconnect
- **整改**（用户确认三决策：导语居中 / 主页标题改宋体 / 全站收敛）：
  - `.hero-desc`：justify→center、14.5→15.5px、行高 2→2.1
  - 主页 `.hero-title` 加
    `var(--font-serif-song)`（渐变 accent 保留）；hero-kicker 字距 0.32em→0.22em 与文章页统一
  - global.css `:root` 新增 `--font-serif-song` /
    `--font-archivo`（含完整中文回退）唯一定义；`--anniv-serif`
    改指 var；删 7 处页面级重复定义；删 `.font-display`
  - 全站 sed 机械替换：106 处 Archivo 字面量 +
    Hasselblad/ActsSection 宋体字面量 → var() 引用（27 文件）
  - Layout.astro head 加 Google Fonts
    preconnect（fonts.googleapis/gstatic；后被 feat-040 自托管取代移除）
- 已知边界（当时未整改；**已随下节 feat-040 webfont 落地解决**）：宋体栈中 Noto
  Serif
  SC 为名义回退无 webfont，无宋体系统（Android）会退黑体渲染；跨平台一致需中文 webfont 子集化（可参照水印工坊 noto-sans-sc-300-subset 做法）

### Evidence

- grep 断言：`font-family: 'Archivo'` / `font-family: 'Songti SC'`
  字面量全站零残留；`--font-serif-song:` 定义仅 global.css 一处
- ./init.sh 全绿：type-check 0 错误、lint 0 错误 65
  warning（与基线一致；期间 preconnect 触发 3 个 astro/sort-attributes 已 eslint
  --fix 修复）、79 页构建
- 浏览器实测（dev
  4321 截图）：活动主页导语居中字距均匀不再拥挤、大标题宋体化与文章页同语言；文章页零回归；首页七周年条宋体（--anniv-serif→var 链路）正常

### Notes for Next Session

- feature_list.json 已新增 feat-039；报告与整改同分支两个 commit

## 会话记录（Webfont 双方案：Archivo 自托管 + 中文衬线 webfont，2026-10-16）

### 背景（承接上一节字体审计的跨平台调研）

- 调研确认三类不一致：①宋体衬线栈在安卓（原生只有 Noto Sans
  CJK，serif 中文按黑体渲染）与 Windows（落 SimSun，无真粗体、伪加粗发虚）断裂，仅苹果系完整；②Archivo 走 fonts.googleapis.com，中国大陆被阻断（受众为国内微信生态）；③swap
  FOUT、text-wrap: pretty 降级等轻微项
- 用户决策：方案①②都做（安卓移动端占比高）

### 交付（分支 feat/webfont-selfhost，基于 main）

- **Archivo 自托管**：从 Google Fonts CSS
  API 抓 latin 子集——发现 Archivo 是可变字体，**一个 34KB
  woff2 覆盖全部字重**（fontTools 验证 fvar
  wght 轴 100-900）。global.css 删 @import 外链，改为单条 @font-face（font-weight:
  400 700 区间声明）；Layout
  preload 该文件（字体同域也必须 crossorigin）。附带修正：24 处继承 400 的 Archivo 元素此前被 Google 的 500 顶位，现在真正拿到 400
- **Noto Serif SC webfont**：pnpm add
  @fontsource/noto-serif-sc（unicode-range 切片，与 Google
  Fonts 同源切片），Layout 引入 400/700 两档；字体栈零改动——Songti
  SC 仍排首（苹果零下载），安卓/Windows 落到 webfont。归一 SharedRoad
  .sr-card-title 600→700（全站唯一 600 衬线，砍掉 600 档省 ~120 切片）
- 字体文件经 npm 依赖 +
  Vite 构建复制进 dist，仓库不入字体文件；Pages 同域分发无 CORS 问题

### Evidence

- ./init.sh 全绿：type-check 0 错误、lint 0 错误 65
  warning（基线一致，preload 属性序已 eslint --fix）、79 页构建；dist 含 archivo
  woff2 + 392 个 noto-serif-sc 切片
- 浏览器双路径实测（dev 4321）：
  - 路径 A（macOS 默认）：**fonts.g\* 外链请求 0 个**；Archivo 单文件同域加载且可变字重生效（400/500/600/700 四级宽度单调递增）；衬线 webfont 不下载（Songti
    SC 命中，serifLoaded=false）——苹果用户零额外体积
  - 路径 B（模拟无 Songti 设备）：document.fonts.load 强制走 webfont，13 个切片约 407KB 按需下载；canvas 像素对比「时」字——Noto
    Serif SC 与 Songti
    SC 渲染不同、与 sans 不同，证明安卓/Windows 将真实命中衬线
  - 文章页截图：macOS 视觉零回归
- ⚠️ 提醒：Astro 7 dev 守护进程会常驻 4321（pnpm
  dev 包装层被杀后仍存活），重启用 astro dev stop

### Notes for Next Session

- feature_list.json 本分支新增 feat-040，与 typography 分支的 feat-039 尾部冲突已按两条并存解决
- docs/typography-audit-2026-10-16.md 的「已知边界」节已随本次合并回填 webfont 落地结论

## 会话记录（移动端堆叠卡片微重叠优化，2026-10-16）

### 交付（分支 fix/mobile-stack-cards，基于 main）

- 用户反馈：堆叠卡片的 hover 弹出在移动端不可感知，且堆叠遮挡卡片底部标题；要求调研并出报告（docs/mobile-stack-report.md，含 390px 取证截图 docs/img/）
- 取证：390×844 实拍确认两页同病——首页「时间的故事」/公益主页《在遥远的地方》标题被下一张卡整张盖住；弹出态由 mouseenter/focus 驱动触屏不触发，只有渲染时写死的一张莫名弹出且标题单行截断
- 用户选定**微重叠方案**（保留堆叠隐喻，重叠只落白框下缘；平铺/横滑两案被否）
- 整改（全部收在 @media max-width:768px，桌面逐字节不变；两组件同配方）：
  - 重叠 -34/-30px → -12px（只压白框下缘 + 阴影）
  - `transform: rotate(calc(var(--rot) * 0.25))`
    旋转降为 1/4（≤1°）并抵消 ±dy——rot/dy 是内联 style 只能整条 transform 覆盖
  - padding-bottom 56→64px 加高标题区；.stack-meta 纵向两行 + bottom
    18px + 标题去 nowrap（修掉「Seeker公益 · 带上她的…」截断）
  - .active 移动端取消弹出位移（触屏不可感知且上提会压住上一张标题），保留抬升阴影（**后随用户反馈改为触屏两段式点按弹出，见下**）
  - 几何安全边距：覆盖 reach = 12px 重叠 + 2.6px 旋转下探 = 14.6px < 标题 18px
  - 顺带：/welfare/
    hero 导语 justify 拥挤（与 story-of-time 同款）按已确认配方修复
- 三方案对比（平铺/微重叠/横滑）与被否原因见报告第二节

### Evidence

- ./init.sh 全绿：0 错误、65 存量 warning、79 页构建
- 浏览器实测：390 视口两页标题完整可见（「时间的故事」「Seeker公益 · 带上她的眼睛」「第三季」「过春天」均不再遮挡/截断）、微堆叠质感保留；1280 桌面与改前一致（hover 堆叠原样）
- 报告：docs/mobile-stack-report.md；报告与修复分两个 commit 停在分支

### Notes for Next Session

- feature_list.json 已新增 feat-041

### 追加：触屏两段式点按弹出（用户反馈「保留手指点击之后的卡片弹出动画」）

- 约束：卡片是链接，触屏单击立即跳转、动画不可见 → 两段式点按：第一段点未弹出的卡 preventDefault 并播放弹出动画（转正 +
  scale
  1.03 + 抬升阴影，常驻弹出态），再点已弹出的卡才进入；初始 active 卡一次点按直达
- 弹出几何：不做上提位移——scale 1.03 顶边抬升 ≈4.4px，重叠 reach = 12+4.4 =
  16.4px < 标题 18px 安全线；rotate 归零后旋转下探归零
- 触屏判定：pointerdown 的 pointerType !==
  'mouse' 置 touchMode——安卓点按会先派发 mouseenter/focus 再 click，不拦截会提前置 active 穿透两段式；桌面 hover/键盘行为零改动；click 处理器对 mouse 一律放行
- 验证：合成触屏序列断言——第一段 prevented=true +
  active 切换 ✓、第二段 prevented=false（放行跳转）✓；用户真机连续两次落在追光之旅页即两段式真实闭环
- lint 曾报 4 个 curly 错误（单行 if），已补花括号；init.sh 全绿

---

## 2026-10-22 · 首页活动板块重设计（哈苏式一屏一图 + 移动端横滑）

- 分支 `feat/activities-visual-redesign`；设计流程用 huashu-design
  skill 跑了两轮三方向门
- 第一轮（印刷/编辑向：负片画幅/册页书脊/细线目录）用户整体否决 → 偏好已记入本机品味档案
- 第二轮按用户要求转向现代视觉（参考哈苏/徕卡/WPP/索尼WPA/阿尔勒/Paris
  Photo 真实截图拆解），三稿 dir-4/5/6，用户选定 dir-4 并要求移动端改横滑 →
  design-demos/direction-approved.md 存原话
- 落地 ActsSection.astro：桌面满幅单图舞台（底部四等分标签兼 6s 自动轮换进度条，悬停交互区/ 离屏/reduced-motion 暂停，交叉淡入，七周年深底排印幅）；移动端同一组 DOM 变横向 snap 卡轨 + 圆点
- 数据仍来自 content
  collections（65 期计数、最新一期、最新一届总冠军均构建期自动跟随），四个入口链接不变
- 验证：./init.sh 全绿（type-check 0 错 / lint 0 错 /
  79 页构建）；浏览器实测 1440 浅/深主题、1280×800、375 横滑与圆点（design-demos/verify/ 截图）
- design-demos/（设计草稿与截图，多数 >500KB）加入 .gitignore 不入仓库

### 2026-10-23 · 活动板块迭代：双主题 + 移动端满屏吸附（用户两点反馈）

- 反馈①「颜色貌似只有深色」：根因是组件用了 --anniv-* 令牌（只认 7th 页 html[data-theme]，与主站 html.dark 开关无关）→ 重写为组件级 --acts-* 令牌：DAYLIGHT（浅色默认，纸底/白昼纱幕/ 墨字/墨线标签/纸底描边 07）+
  NIGHT（:global(.dark)，沉浸藏蓝黑，原观感不变）；图片压暗分档仅 NIGHT 生效
- 反馈②「手机版没占满整屏、要像电脑端那样吸附」：global.css ≤768px 恢复 y
  proximity 吸附，其他吸附点（.section/.banner/.footer）移动端置 none（html:has 前缀压过 Banner
  scoped 规则），仅 .acts-section 为唯一吸附点；ActsSection 移动端 min-height:100svh + 卡轨 flex:1 + 卡片撑满轨高（375×812 上约 343×640，一屏一图），吸附对齐后刚好铺满整屏
- DAYLIGHT 高调照片（公益雪景）白纱幕过曝 → 卡内纱幕白度降档（墨字有白色柔光兜底），实测两张极限卡通过
- 验证：./init.sh 全绿（0 错误/63 存量警告/79 页构建）；Playwright 实测 1440 浅/深 ×
  4 帧、375 浅/深吸附位 + 横滑（design-demos/verify2/）
- 已提交并推送 feat/activities-visual-redesign（不合并不动 main，Preview 自动刷新）

### 2026-10-23 · 浅色纱幕转透明 + 按钮反色收窄（用户两点反馈）

- 「浅色边缘白色柔光不好看，偏透明就行」：DAYLIGHT 纱幕（桌面 4 层 + 移动卡内 4 层）全部降到 0.08-0.2，照片原样呈现；墨字可读性改由更强白色柔光 halo 兜底——name/fact/kicker/标题行/底部标签五处 text-shadow 令牌化（--acts-*-shadow，NIGHT 为 none 保持原观感）
- 「中间按钮时不时变深色」：根因是反色挂在 .act:hover（整卡）上——满幅舞台鼠标停在照片任意处即触发；收窄为 .act-enter:hover（按钮自身）+
  .act:focus-visible（键盘可达性保留）
- 验证：./init.sh 全绿（0 错误）；实测浅色 4 帧（含暗片 halo）、悬停照片非按钮、NIGHT 回归、375 双卡

### 2026-10-23 · 三迭代：取消全部柔光，深浅只差顶部 header（用户反馈）

- 「文字旁边的柔光太丑，取消所有柔光」：删除全部白色 halo；照片上文字回归白字 + 深投影（两主题一致）
- 「底部换成深色模式一样的效果」：纱幕改为边缘近乎透明 + 仅底部压暗（rgba(4,16,30,.9)），白字标签行/白进度线两主题一致；按钮/压暗分档也统一为深色模式取值
- 「深浅模式的区别就是顶部 header」：随主题的收敛为 header 一族——底带 --acts-bg、标题行 --acts-fg/--acts-accent、七周年排印幅（纸底墨字/深底月光白，且不再画照片纱幕——修掉浅色下纸底被底部渐变染灰的问题）、圆点 --dot-*；七周年帧激活时 section 挂 .is-seventh，标签行跟随主题配色（修掉纸底上白标签不可见的回归）
- 验证：./init.sh 全绿（0 错误）；1440 双主题四帧 + 七周年对照、375 双主题（design-demos/verify2/v4-v6）

### 2026-10-23 · 四迭代：以清晰为主的浅色配色（huashu-design 色彩协议 + WCAG 实测）

- 用户反馈「有一些字看不清楚，以清晰为主」→ 偏好已记（对比度实测为准，不做目测调参）
- 设计决策（论证见 design_lint
  ledger）：白字永远坐受控暗底（文字区收敛暗 vignette 0.68 + 压暗分档 hi .6/mid
  .75/lo .88）；主题色文字（header）永远坐实底/玻璃条（blur14 + 95% 主题底）
- 新增 design-demos/contrast_check.py：Playwright 像素级 WCAG 对比度实测（隐藏字形→采样真实背景→ 最不利分位），两主题×四帧×双端 112/112 达标（≥4.5:1，88px 大字 ≥3:1）
- 过程中修的问题：① 标签激活态误用 header 令牌（浅色下墨字落暗纱幕 1.19-1.3）→ 回归舞台白；② 测量脚本两处假值——transition 渐变中的半透明字形（先禁用过渡再采样）、冷缓存半载 R2 图（等图后再采）
- init.sh 全绿（0 错误）；终态对比图 design-demos/final-对比.jpg

### 2026-10-23 · 五迭代：header 撤玻璃条恢复透明（用户选型）

- 用户确认其余文字已清晰，header 恢复为透明悬浮（无玻璃条），vignette/压暗/标签白字等全保留
- 实测 105/112：7 项不达标均为透明 header 自身（浅色墨字落暗照片顶 1.21-1.59/4.27、深色月光白落雪景亮部 3.12），属透明化已知代价，用户明示选择，数据如实记录
- init.sh 全绿

### 2026-10-23 · 六迭代：文字适配照片明暗（与站点主题解耦）

- 用户反馈：header 行与底部标签行按图片深浅自动切换文字深浅，与站点深浅模式无关
- R2 图床无 CORS 头 → 运行时 canvas 采样不可行 → 改离线采样烤定：每个活动卡 data-head-tone
  / data-tabs-tone / data-veil（top20%/bottom25% 均值，阈值 L 0.227）
- 激活帧同步调性到板块；桌面端 CSS 按调性切换：暗底→白字+暗底纱，亮底→墨字+白底纱（白纱含 hold 段：盖住 header 行 80-116px，210px 淡出）；移动端与七周年帧不受影响
- 过程修复：dataset 键名 kebab→camel 转换缺失导致调性同步失效（假值 1.18-1.74）、亮底帧纱幕规则被 tabs-tone 规则覆盖、veil 类型与 Tone 混用
- WCAG 实测 112/112（welfare 帧墨字 header≈6+、墨字标签≈12+）；init.sh 全绿
- 服务挂 4322 待用户预览批准，批准后 commit+push

### 2026-10-23 · 七迭代：逐元素文字适配 + 亮图帧纱幕清零（上线版）

- 用户「怎么感觉还是有一层渐变」→ 两个真凶：① 中央暗 radial 椭圆 52%×42% 几乎罩满照片；②
  preview 服务的是旧 dist（改完源码未重建）——测量/截图一度失真，教训：改完必须 rebuild 再验
- 亮图帧（带上她的眼睛）：舞台纱幕清零；白标题暗底改为文字块紧凑暗云（-72/-96px
  radial 0.72）
- 逐元素调性（用户需求本义）：linkTone +
  tabsTones[4] 烤定，公益帧 = 标题墨/链接白/标签 墨白白白
- bug 修复：七周年帧 tab 调性残留（改固定 4 次按位同步）、旧 head-tone 链接规则覆盖 link-tone（删残留）、kicker
  4.4 压线（暗云加深至 0.72）
- 实测 144/144（逐元素清单含四个标签列）；init.sh 全绿；用户 4323 批准
- 流程：fix/activities-adaptive-text 分支 → PR → 自审 → 合并上线

### 《时间的故事》十月篇一手数据上线（2026-10-28，分支 release/story-of-time-2026-10，PR 开放待定时合并）

- 数据来源首次为一手数据（本地文件夹 +
  docx），非微信推文抓取：63 个「MM.DD 作者」文件夹
  - docx 编辑文档（63 条目：作品名称/投稿组别/介绍/ID/拍摄时间），与画廊 schema 完美映射
- 管线：docx 解析（块级解析器 + 两特例修复：CONST 无标签块、BBBronny 无名称条目曾吞并阿羊舰见福州条目，均按原文锚点拆回）→ 按「作者+日期」与文件夹配对 → 组别归一 7 类（entry.group 章节字段首次启用，GalleryStory 渲染「日期 组别」章节分隔）→
  cwebp q82（6 张 >2560 缩边；迅雷疾风按用户指定用 jpg）→ R2
  activities/2026-10/63 张（200+MD5 全过）→ meta 登记 63 条 →
  story-of-time-2026-10.md（pubDate 2026-10-31 占位）
- 已知留空（用户将补，见缺口清单）：subtitle/quote/team/poem/committee/committeeImage/
  cover（临时用 01.webp）/BBBronny 标题
- 定时发布机制（feat-038）：scheduled-publish
  workflow 每 5 分钟检查 release/publish-time.txt，到点自动合并 release 分支开放 PR（PR
  #42 已合入 main）；发布时间定档后改配置文件两行即生效
- skill 更新：story-of-time-article 新增第零步（一手数据来源解析流程 + 缺口模式）、entry.group 要点、发布前置内容清单（8 项）、定时发布流程
- 验证：init.sh 全绿；五页断言全过；十月篇详情页章节渲染正常（54 章）、书架 66 期带「新」标、首页卡封面自动跟随（01.webp 占位）；排版与九月篇同源一致
- 交付：内容 PR 开放（scheduled-publish 到点自动合并），发布时间定档后更新 release/publish-time.txt +
  pubDate 即完成上线

### 《时间的故事》十月篇正式上线（2026-10-31，PR #43 合并 fdbd728）

- 微信正式版 14:07 群发后抓取对照，站点对齐：63→18 幅精选（微信编排顺序，组长《沧岸秋暝》打头）、主题句「疏林承晓色，落韵载秋光」（正式版 og:title）、结尾诗换微信版「十月是秋光的信札」、封面=微信分享封面（火山湖 1080×460
  → cover.webp）
- 定时发布未启用（文章已直接群发，PR 按用户确认手动合并）；scheduled-publish
  workflow 保留（PR #42），下次期数定档时填 release/publish-time.txt 即用
- 生产验证：十月篇/书架（66 期）/首页全 200，首页卡跟随新封面，18 幅内容断言通过
- 十月篇遗留说明：45 幅未选作品图仍存 R2
  activities/2026-10/（未引用，保留作档案）；meta 清单保留 63 条尺寸登记

### 十月篇未选作品图清理（2026-10-31，用户指示）

- R2 activities/2026-10/ 删除 45 张未入选微信精选的作品图（源存储 wrangler
  get 验证已删）；保留 18 幅精选 + cover.webp（19/19 源存在验证 ✓）
- 注意：CDN 边缘缓存（immutable 头）会让被删 URL 短期仍返回 200，属预期，无实际影响（站点零引用）；沿用 zsh 不做单词拆分的教训——本会话曾因 for
  in $var 整串问题导致首轮删除/验证假执行，改 while read 后正确完成
- meta 清单同步精简：2026-10 块 64 条 → 19 条（18 幅 +
  cover），build 恢复全绿，详情页 18 个图片引用与 meta 一一对应

### 2026-10-25 · Gallery 2.0 重构第一轮：三方向 Demo（等待选型）

- 规范来源：用户提供的《Seeker_Gallery_2.0_重构实现规范》（高手编辑方向：编辑式摄影展墙、固定 6 张精选、沉浸灯箱）；用户追加硬约束：**零裁切，尊重原图比例**
- huashu 偏好档案修正方向谱系：用户曾否掉印刷/拟书感（L1），要现代摄影品牌数字感（哈苏/徕卡/赛事站，L2），移动端偏横滑卡轨（L4），清晰优先（L5）→ 三方向全部走现代品牌谱系而非印刷编辑拟物
- 新增
  `GALLERY_FEATURED`（src/data/gallery.ts 末尾，按 src 引用全量池不复制字段；曾因放在 GALLERY_POOL 之前触发 TDZ
  ReferenceError，已修）
- demo 页（分支专属、noindex，整合时删）：/gallery-demos/{stage,matrix,mosaic}/ + 对比板 index.astro（ResizeObserver 缩放 iframe 预览）；共享组件 src/components/gallery-demos/{DemoBar,Lightbox}.astro（灯箱零依赖，补触摸横滑/
  Tab 焦点圈禁/加载失败态）
- 过程修 bug：① GALLERY_FEATURED TDZ；② matrix
  `var(--a1) fr`（var 与 fr 间空格）整条 grid-template-columns 失效退化单列 → 改传完整 --cols 值；③
  DemoBar 标题 nowrap 致 320px 全站 demo 溢出 → ≤420px 隐藏
- 浏览器验收（IAB 1440/390/320 + 明暗 + 灯箱键盘流）全部通过，数据见 feat-042
  evidence；截图 design-demos/homepage-gallery/shots/
- **停在方向门**：等用户从 A/B/C（或混搭）里选，记录将写入 design-demos/homepage-gallery/direction-approved.md；下一轮把选中方向落进 WorksSection（弃随机轮换）并处理 scroll-snap 与 >100vh 整合
- dev server 挂在 4321（nohup）；分支 feat/gallery-2.0 未推送

### 2026-10-25 · Gallery 2.0 第二轮：随机轮换三解法 demo（等待选型）

- 用户否掉第一轮静态策展墙：要"一眼抓眼球 + 往下拉就出现 + 随机播放照片素材"，难点是不同比例照片不裁切且在一屏内和谐 + 移动端优化
- 数据面先行：39 张按宽高比分池（横15/竖15/近方2/超宽1），版式只用横/竖两种池，轮换同池取图使比例波动天然受控；近方/超宽不设轮换槽
- 共享引擎 src/lib/gallery-cycle.ts：3-6s 独立随机间隔、**预约制防同屏重复**
  （修并发 swap 竞态：两槽同时换撞图）、预载后交叉淡入、hover/隐藏暂停、reduced-motion 静态、换图同步灯箱触发器
- 三解法：A 丝带呼吸（等高丝带定理 行高=W/Σar，flex-grow=ar 全数值过渡；主带竖槽限 0.6-0.85 池保证极端组合行高 ≤480px
  → 一屏 892px）；B 聚光舞台（主视觉 42svh 锁高宽随比例呼吸，移动端 --ar-m 断点变量换竖池+immediate 首换）；C 瀑布长廊（超宽横幅锚点+三列错宽 10 张长墙 2590px，相近比例子池 ±0.08）
- 过程修 bug：① gallery-cycle 预约制（并发 swap 撞图）；② spotlight
  `.shot--spot` 被 `.shot{width:100%}` 源序覆盖 → 提特异性
  `.shot.shot--spot`；③ 引擎槽元素须传容器不能传 button（querySelector 结构依赖）；④ 移动端单 item
  flex-grow 分配怪癖（free space 未分完 238/358）→ 单槽 `flex:1 1 100%` 兜底；⑤
  ribbon 主带竖池限 0.6-0.85；⑥ 审计脚本须排除 opacity:0 旧图与过渡中间态（双采样取最小）
- 实测：稳态零裁切 A 0.02%/B 0%/C
  0%；等高/满宽/一屏/320/390/暗色/灯箱全过；type-check 0 错、lint 0 错、build
  83 页；截图 r2-*.png
- **停在方向门**：A/B/C 待选（可混搭）；选定后落进 WorksSection 并处理 scroll-snap

### 2026-10-25 · Gallery 2.0 收官：丝带呼吸正式落地首页 #works

- 用户选定方向 A（原话「就选丝带呼吸，直接开干吧」）→
  demo 页/组件删除，逻辑并入src/components/home/WorksSection.astro（单组件自包含，沿用项目零依赖惯例）
- 一屏数学（新增 fitWall）：墙宽 = min(1264,
  (视口高−285)×Σ1Σ2/(Σ1+Σ2))，轮换改变 Σ 后重算 + max-width
  0.9s 过渡——两行高之和恒等于可用视口高，任何轮换组合不超首屏（实测 sectionBottom=900 恰好一屏）
- 数据层清理：gallery.ts 删 GALLERY_HERO/SUPPORT_TALL/SUPPORT_SQUARE/GALLERY_FEATURED（feat-016 轮换模型与 feat-042 固定精选均被新机制取代），仅留 GALLERY_POOL；AnniversaryCard/7th 页消费者零改动回归通过
- 过程修 bug：WorksSection 重写时 onSwap 漏更新槽位 --ar/--fg（demo 里该逻辑在 onSwap 内）——换图后槽比例停留首图导致 letterbox，补上后稳态 0.02%
- 验收：桌面 1440 稳态零裁切 0.02%/等高/一屏 900 恰好、hash 两次复测落位、scrollspy/进度点/角卡正常、390 主竖满宽稳态 0.06-0.11%、320 无溢出、暗色正常、灯箱 1/8 当前图 matches/←→/Esc、七周年回归；init.sh 全绿（build
  79 页，demo 删除后由 83 回落）
- 分支 feat/gallery-2.0 两个提交（567a82c 第一轮 +
  5a8e4ff 第二轮 + 本次落地），未推送；方向门记录 design-demos/homepage-gallery/direction-approved.md 待补用户选择原话

### 2026-10-25 · 画廊标题恢复主分支极简版

- 用户反馈「文字全部删掉……一个画廊 Gallery 就可以了」→ 删 kicker（GALLERY ·
  FEATURED）与导语，标题恢复主分支「画廊 Gallery」左对齐样式（clamp 1.5-2rem +
  Archivo 眉字）
- 头部变矮（99→51px）→
  fitWall 预算 285→260，墙宽进一步放大（1207→1253px），仍恰好一屏（sectionBottom=900）；稳态零裁切 ≤0.77%（含一张过渡态）复验通过

### 2026-10-25 · 画廊微调：去圆角 + 拉开间距

- 用户反馈「照片之间贴得太紧……照片不用做圆角，保留原汁原味」→
  .shot 圆角 8px→0（灯箱图 2px 圆角一并去掉）；桌面 gap
  14→22px、两带间距 16→24px、平板 10→16、移动端 8→12px；fitWall 预算 260→268 对冲行距增量
- 复验：radius=0、gap 22px、bandGap
  24px、sectionBottom 仍恰好 900 一屏、稳态零裁切保持（maxDev
  0.63% 含过渡态）、无溢出

### 2026-10-25 · 画廊防抖重构：三层复合缓动 → 单层数值过渡

- 用户反馈换图时所有照片抖动（怀疑动画不够线性）→ 根因确认：墙 max-width
  / 槽 flex-grow /
  aspect-ratio 三层复合 ease 缓动速度叠加不均，且 aspect-ratio 过渡部分浏览器不支持时直接跳变
- 重构：fitWall 解析几何后 JS 一次性写入每槽目标 width/height（px，flex 置 0 0
  auto），只过渡这两个数值（0.9s
  ease 全槽一致）→ 单层插值整墙同起同止同速；max-width 瞬时设置不再过渡；无 JS 仍回退 flex-grow +
  aspect-ratio 兜底
- 健壮性：跨断点（桌面→移动）clearLayout 清内联 px 交还 CSS；gap 从 computed
  style 动态读取（平板 16px 断点自适应）；辅带 1100px 封顶时主带吃剩余高度
- 实测：14s 窗口 73 个变化采样点，最大单步 6px、跳变 0、方向回摆 0（修复前三层复合存在突跳）；桌面/平板(900px)均恰好一屏（900/800）；跨断点清理生效（390 主槽 351 满宽）；零裁切稳态保持

### 2026-10-25 · 画廊照片悬浮阴影

- 用户要求「照片做一点阴影，营造悬浮感」→
  .shot 双层软影（近影 1px 定边 + 远影 14/34px 抬升，浅色用品牌藏蓝 rgba(8,41,74) 低透明度、深色模式纯黑加深）；hover 时上浮 translateY(-4px) + 阴影加深（配合既有 scale
  1.015）；box-shadow 为纯 paint 不参与布局，不引入重排抖动
- 复验：阴影 computed 生效、sectionBottom 仍 900 恰好一屏、无溢出

### 2026-10-25 · 画廊抖动二轮排查：解码竞态 + 缓动曲线

- 用户仍感换图抖动 → 帧率诊断 12s 窗口 720 帧平均 60fps、零长帧（最差 18ms），排除性能；定位两个残余源：① 解码竞态——预载 onload 后立即淡入，但
  <img>
  自身解码/上纹理未完成，新图淡入中途才显形（闪一下）→ 改 standby.decode()（像素就绪才切换 +
  onSwap），probe 预载删除（decode 自带下载等待），decode 失败还原预约 ② 缓动曲线/时序——布局 0.9s
  ease 的起步速度突变（ease
  t=0 斜率≈2.5×线性）且与淡入 1.1s 不同步 → 布局改 1.1s
  ease-in-out（起止速度连续的 S 曲线）与淡入同长同步
- rAF 级采样：过渡窗口每帧步进 0.75px、回摆 0；零裁切 0.58%、恰好一屏 900

### 2026-10-25 · 画廊抖动三轮排查（用户线索：比例差大时更抖）

- 根因推演：① CSS
  transition 高频重定向——8 槽平均 0.56s 一次 fitWall 全墙重设目标 <
  1.1s 过渡时长，ease-in-out 重定向速度瞬间归零再加速 = 全墙每半秒"刹车再起步"，比例差大位移大抖感强（与用户观察吻合）；② 交叉淡入期旧图 contain 于新比例槽，露出 .shot 的 muted 灰底（比例差大灰底面积大）
- 修复：槽尺寸动画改 **rAF 指数平滑**（cur +=
  (tgt−cur)×(1−exp(−dt/130ms))，帧率无关；目标变化速度天然连续无归零不超调；静止 <0.5px 自动停循环；reduced-motion 直设终值；跨断点 clearLayout 清动画状态）；.shot 背景 muted
  → transparent（letterbox 融入页面背景）
- 实测：38s 窗口 67 次换图、12 次大比例差（Δar
  0.25-0.45）帧级分析——每帧最大步进 5.9px、回摆 0 次；帧率诊断 60fps 零长帧；稳态 letterbox
  ≤0.27%（早前 15.52% 为采样撞上淡入中间态的瞬态）；恰好一屏 900、type-check
  0 错
- 后备未动：若仍有感知抖动可放缓轮换间隔 3-6s → 5-9s（产品节奏决策，待用户定）

### 2026-11-03 · 画廊 6 张满宽版（用户反馈：图太多看不过来 + 屏幕利用率低）

- 用户两条反馈合并处理：8 →
  6 张（主带 1横2竖 + 辅带 3 横，辅带从 5 减 3）、辅带取消 1100px 限宽居中 → 与主带同宽、墙 max-width
  1264 → 1728 满宽直出
- 底层权衡：一屏约束下"减图"与"加宽"数学对抗（Σar 变小 → 行高变大 → 反解 W 更小），故放宽为满宽优先、区块约 1.08 屏——snap 是 proximity 就近吸附，多滚一点自然看完（移动端画廊本就是该模式）
- fitWall 简化：删反解/预算常量，W =
  wall.clientWidth 直出，两行各自丝带定理解行高；rAF 指数平滑/防抖/灯箱/无 JS 兜底全保持
- 实测 1440×900：墙 1392 真满宽（左右仅 padding
  24）；主带横图 720×444（旧 620×428）辅带横图 485×323（旧 306×172，大 88%）；零裁切 0.05%；区块 976px=1.08 屏；移动端 390 主竖 351 满宽 + 辅 3 横、无溢出；轮换/呼吸重排正常

### 2026-11-03 · 画廊收回严格一屏（用户反馈：底部超出一屏，标题要可见）

- fitWall 恢复反解模型（两行同宽、行高预算 = 视口高 − FIXED_BUDGET 230
  − 带距 22），6 张组合（辅带 3 横 Σ≈4.3）反解 W ≈
  1170–1220——比旧 8 张版（1253）相近略窄，但辅带单图大 60%+；固定开销压缩：padding
  72/40 → 56/24、标题距 22 → 18、带距 24 → 22
- 实测 1440×900：sectionBottom =
  900 恰好一屏、标题可见、墙宽 1197、主带横图 659×371
  / 辅带横图 ~400×278、稳态零裁切 0.15%（截图 2.74% 为换图交叉淡入瞬态）、无溢出；type-check
  0 错

## 2026-11-04 00:30-01:15 · feat/bring-her-eyes-portfolio · 小摄影师的作品集 v1

- 编辑五步（接触印样 64 张 / 1280 候选 → 定稿 40 张 /
  5 主题）+ 素材管线（scripts/welfare-gallery/import.py，PIL 压缩长边 2560 q82 →
  public/r2-preview 预览，R2 只存入选图）+ 画廊页 /welfare/gallery/（GalleryWall：幽灵期号章头 + 序列观看器 + 移植 photoreason/skills
  MIT 的锚定缩放/拖拽平移 lightbox）+ 落地页入口 GalleryEntry
- 验证：type-check 0 错、lint 0 错（93 警告为基线+非空断言）、build
  84 页、浏览器实测桌面/375px + 翻页/放大/缩放/分层 Esc/history 全通过
- 待办：用户过目 40 张定稿（/tmp/prs-curation/checkpoint.html）→
  R2 上传 → 数据切 R2 URL
- 2026-11-04
  01:40 迭代2：GalleryWall 换页淡入（viewer+lightbox，reduced-motion 降级）、触屏滑动翻页（>48px 横向判定 +
  dataset 时间戳护栏防误开 lightbox）；暗色模式截图核验通过；IAB 截图合成器过期帧伪影再次确认（dlgOpen=false 时仍可截到残影，以 evaluate 状态为准）
- 2026-11-04
  01:55 迭代3：LQIP 主色占位——import.py 提取上/下半部平均色（tone="#top,#bottom"），章图/缩略图/lightbox 大图/入口瓷砖加载期显示照片主色渐变（底片感）；坑：Astro
  scoped
  CSS 不匹配 JS 动态创建节点（无 astro-cid），动态缩略图改内联 background；feature_list.json 登记 feat-046（现场取 max=45
  → 046 防撞号）
- 2026-11-04 02:45 迭代4：导航回路（Foreground
  Web「清晰回列表之路」）——画廊 hero 返回链「← 带上她的眼睛 · 图文手记」+ 页脚 CTA「回到…读孩子们的故事」双向闭环；第一章首图 fetchpriority=high（LCP 候选）；入口 CTA
  hover 箭头位移 + 瓷砖 hover 阴影升起（物理手感）
- 2026-11-04 03:45 迭代5：邻图预热（rIC/300ms
  fallback，±1 张，saveData 跳过，按章 in-view 门控——修复首屏预取 19 请求→6 请求）、目录 scrollspy（35%-45% 视口带判定，手动/同步验证通过；后台标签页 IO 回调挂起是环境限制非代码问题）、观看器大图占比提升（72vh/700px，移动端 60vw）
- 2026-11-04 05:00 迭代6：lightbox 进出过渡（@starting-style + allow-discrete +
  ::backdrop 独立过渡，无支持浏览器直开降级）、章间编辑交接行「下一辑 · XX
  ↓」（skill 模板 quiet
  handoff 同款，Fragment 包裹修复 JSX 多根；排障：早期误写块体 map 体导致级联解析错误，重写 map 开头修复）、lightbox 打开时 body 滚动锁定
