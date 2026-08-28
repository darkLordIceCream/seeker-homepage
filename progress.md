# Session Progress Log

## Current State

**Last Updated:** 2026-08-27 **Branch:** feat/update-astro-homepage（基于 main
227a810）**Active Feature:** feat-020 - 首页整屏滚动改版（已完成，待 PR）

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

- 无（迭代五已验证；分支已推送，等用户指令再建 PR）

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

- 当前在 feat/update-astro-homepage 分支，已本地提交，尚未推送
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
