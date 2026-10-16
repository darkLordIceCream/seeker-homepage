# 字体使用审计报告 ——《时间的故事》两个页面(附全站盘点)

> 审计日期:2026-10-16 · 审计范围:`/activities/story-of-time/`(活动主页)与
> `/activities/story-of-time-YYYY-MM/`(文章页,GalleryStory 模板),并对全站字体栈做交叉盘点。结论同时适用于追光之旅、公益板块等同一版式家族的页面。

## 一、字体族清单:每个页面只有 3 族,没有超标

| #   | 字体族                                                  | 来源                                    | 承担角色                                               |
| --- | ------------------------------------------------------- | --------------------------------------- | ------------------------------------------------------ |
| 1   | **系统无衬线**(PingFang SC / 微软雅黑栈)                | `Layout.astro` html/body 默认,全站继承  | 导航、页脚、中文图注/说明、副标题等正文辅助文字        |
| 2   | **Archivo**(Google Fonts webfont,500/600/700)           | `global.css` 第 1 行 `@import`,整站加载 | 英文眉标(kicker)、meta 行、期数/年份/计数、CTA、署名   |
| 3   | **宋体衬线**(Songti SC / STSong / SimSun 系统栈,零下载) | `--font-serif-song` 变量                | 大标题、引言、正文叙事、章节标题、作品名、诗、组委会名 |

第四个字体族
`NotoSansSCSub`(`public/fonts/noto-sans-sc-300-subset.woff2`,运行时 JS
FontFace 加载)
**只作用于 /7th/ 水印工坊的 canvas 海报绘制**,不会渲染为任何主站页面文字,与本审计范围无关。

**结论:「一个页面超过三种字体」的问题当前不存在。**
两页均恰好 3 族,且与 2026-08-30确立的「杂志式搭配」约定一致(衬线做标题/正文叙事、Archivo 做辅助行、系统黑体打底)。

## 二、活动主页导语「拥挤」的根因

`.hero-desc`(story-of-time.astro)修复前:

```css
font-size: 14.5px;
line-height: 2;
text-align: justify; /* ← 拥挤主因 */
max-width: 560px; /* 每行仅约 38 字 */
```

中文**两端对齐**会在字间与标点处拉开不均匀的空隙,560px 窄版心下每行容字少、拉伸被放大,叠加剧 14.5px 字号,形成「挤」的观感;而同区
`.hero-line` 带 0.3em大字距,对比之下导语更显局促。

**修复**:去掉 justify 改居中(与 hero 区其他元素同轴),字号 15.5px、行高 2.1。

## 三、发现的不一致与漂移(整改项)

| #   | 问题                                                                                                                                                                                                           | 风险                             | 整改                                                                                                |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- | --------------------------------------------------------------------------------------------------- |
| 1   | 活动主页大标题「时间的故事」是**无衬线**,文章页大标题是**宋体**——同一品牌两个层级入口字形不同                                                                                                                  | 品牌语言割裂,即用户感知的「乱」  | 主页 `.hero-title` 改 `var(--font-serif-song)`,与文章页统一                                         |
| 2   | 宋体栈变量 `--font-serif-song` 在 **7 个文件**逐字重复定义,`--anniv-serif` 又是第 8 套近似值(缺 Georgia 回退)                                                                                                  | 将来改栈必漏改,单页悄悄漂移      | 定义收敛到 `global.css :root` 一处;`--anniv-serif` 改指 `var(--font-serif-song)`;7 处页面级定义删除 |
| 3   | Archivo 栈两种写法并存:`'Archivo', sans-serif`(约 80 处)与 `'Archivo', -apple-system, sans-serif`(约 26 处)。前者的**中文字符落到浏览器默认 sans** 而非站内 PingFang/雅黑栈,非苹果设备上同页中文会出现两种黑体 | 跨平台字形不一致                 | 新增 `--font-archivo` 变量(含完整中文回退),全站 106 处字面量统一替换                                |
| 4   | 零散字面量:Hasselblad `.welfare-prose` 用宋体字面量、首页 ActsSection 用**缺 Source Han Serif SC 的短版宋体栈**(全站唯一)                                                                                      | 同上                             | 全部改 `var(--font-serif-song)`                                                                     |
| 5   | `.font-display` 类(global.css)定义后全站零使用,死代码                                                                                                                                                          | 维护噪音                         | 删除                                                                                                |
| 6   | Archivo 经 CSS `@import` 加载,无 `preconnect`,浏览器解析到 CSS 才发现字体源,串行建连                                                                                                                           | 首屏字体交换(flash)与 LCP 略劣化 | `Layout.astro` head 加 `preconnect` 到 fonts.googleapis.com / fonts.gstatic.com                     |
| 7   | 两页 hero-kicker 字距不一:主页 0.32em vs 文章页 0.22em(同一文案 SEEKER · STORY OF TIME)                                                                                                                        | 细节不齐                         | 主页统一为 0.22em                                                                                   |

**已知边界(未整改,记录备查)**:宋体栈中的 `Noto Serif SC` / `Source Han Serif SC`
只是名义回退,并没有 webfont 支撑——真正下载中文衬线字体需 1.5~8MB(此前已决策放弃)。无宋体的系统(Android 多数机型)会退到泛型 serif/黑体渲染,这是零下载方案的固有代价; 若未来要求跨平台一致的衬线观感,需引入中文 webfont 子集化方案(可参照水印工坊noto-sans-sc 子集的做法,按高频字裁剪)。

## 四、整改后的全站字体架构

```
global.css :root(唯一定义处)
├── --font-serif-song  宋体衬线栈(标题/正文叙事)   ← 41 处 var() 引用
├── --font-archivo     Archivo + 中文回退(辅助行)   ← 106 处 var() 引用
└── --anniv-serif      = var(--font-serif-song)(7th 板块沿用旧名)

Layout.astro
└── html/body 系统无衬线栈(全局兜底)+ Google Fonts preconnect
```

各页面渲染字体族数(整改前后一致,均为 3 族以内):

| 页面                                 | 字体族                      |
| ------------------------------------ | --------------------------- |
| /activities/story-of-time/           | 系统无衬线 + Archivo + 宋体 |
| /activities/story-of-time-*/(文章页) | 同上                        |
| /welfare/*(三模板)                   | 同上                        |
| /activities/chasing-light/*          | 同上                        |
| 首页 /                               | 同上                        |
| /team                                | 仅系统无衬线(1 族)          |

## 五、验证记录

- `grep` 断言:`font-family: 'Archivo'` / `font-family: 'Songti SC'`
  字面量全站零残留; `--font-serif-song:` 定义仅 global.css 一处
- `./init.sh` 全绿(type-check / lint / build 79 页)
- 浏览器双主题截图:/activities/story-of-time/ 导语居中不挤、大标题宋体;文章页零回归
