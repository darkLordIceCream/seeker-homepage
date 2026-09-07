---
name: layout-analyzer
description: >
  法证式提取一个图文/文章页面的排版规则，输出可直接实现的排版规格文件（精确到
  px、字距、行高的参数值，不是"有杂志感"这类描述）。当用户要求"分析这个网站
  的排版"、"提取排版规则"、"参考这个站做排版"、"出一份排版规格"，或
  welfare-article
  等发布流程需要按参考站排版新建模板时使用。只分析图文排版（版心、标题、正文、
  图片、图注、引用、交互反馈、响应式），不做整站克隆、不下载资产、不写代码。
---

# 排版规格提取（Layout Analyzer）

把一个参考页面的排版逆向为一份**可实现参数清单**。产出物是规格文件——它是后续写模板组件的唯一真相源；实现者拿着它应该不需要看参考站就能写出布局。

核心纪律（来自整站克隆实践的方法论）：

- **每个数值都来自 `getComputedStyle()` 或 `getBoundingClientRect()`，禁止目测**
  ——"大概是 18px"是错误的；实测是 17px 就写 17px
- **每条规则必须可实现**——"标题有杂志感"不合格；"1.35rem / 字距 0.3em
  / 居中" 合格
- **不要只看默认状态**——hover、滚动触发的变化也要测，交互反馈是排版观感的一半

## 流程

### 1. 侦察

用 agent-browser 打开参考 URL（`set viewport 1440 900`），截全页截图（`--full`）作为母版参照。判断页面原型：图文文章页 / 图集页 / 落地页——原型决定后面测量哪些区块。

缓慢滚动全页一遍，记录：版心宽度变化、粘性元素、滚动触发效果、图片的排列节奏（单图与图组如何交替）。

### 2. 测量

对每个排版角色，用 agent-browser
eval 提取计算样式。核心测量脚本（按需调整选择器）：

```js
(() => {
  const props = [
    'fontFamily',
    'fontSize',
    'fontWeight',
    'lineHeight',
    'letterSpacing',
    'color',
    'textAlign',
    'textTransform',
    'maxWidth',
    'width',
    'margin',
    'padding',
    'gap',
    'display',
    'borderRadius',
    'boxShadow',
    'objectFit',
    'transition',
  ];
  const pick = el => {
    if (!el) return null;
    const cs = getComputedStyle(el);
    const o = { tag: el.tagName.toLowerCase() };
    props.forEach(p => {
      const v = cs[p];
      if (v && v !== 'none' && v !== 'normal' && v !== 'auto') o[p] = v;
    });
    const r = el.getBoundingClientRect();
    o._rect = { w: Math.round(r.width), h: Math.round(r.height) };
    return o;
  };
  return JSON.stringify(
    {
      container: pick(document.querySelector('article, main, .post, .prose')),
      h1: pick(document.querySelector('h1')),
      kicker: pick(document.querySelector('header p, .kicker, .eyebrow')),
      dek: pick(document.querySelector('.dek, .subtitle, header p + p')),
      meta: pick(document.querySelector('.meta, time, .byline')),
      h2: pick(document.querySelector('h2')),
      bodyP: pick(document.querySelector('article p, main p')),
      img: pick(document.querySelector('article img, main img')),
      caption: pick(document.querySelector('figcaption, em')),
      quote: pick(document.querySelector('blockquote')),
    },
    null,
    2
  );
})();
```

补充测量（同样禁止目测）：

- **版心**：正文列 `getBoundingClientRect().width` + 视口宽，算出边距比例
- **图片**：单图宽 / 视口宽的占比；图组的列数、间距、每张宽高比（自然尺寸 vs 渲染尺寸，判断是否裁切
  `object-fit`）
- **hover**：对链接/卡片/按钮取 hover 前后样式差（`matchMedia(':hover')`
  不可用时，直接读 CSS 规则里的 `:hover` 声明）
- **移动端**：`set viewport 390 844`
  重测关键项（列宽、图组是否退单列、头版是否堆叠）

### 3.（可选）风格定性

用 ui-ux-pro-max skill 按观察到的风格检索（如 `editorial magazine`、
`full bleed gallery`），拿到该风格家族的通用参数做交叉验证——但**以实测值为准**，检索结果只补盲区。

### 4. 写规格文件

按下方模板输出到调用方指定路径（未指定则
`/tmp/layout-specs/<参考名>.md`）。规格是给实现者的合同，不是分析报告。

### 5. 给用户过目

展示规格全文。**实现必须等用户确认规格后再开始**——先对齐参数再写码，比写完返工省一轮。

## 规格文件模板

```markdown
# 排版规格：<参考名>（<URL>）

> 采集：视口 1440x900 /
> 390x844；所有数值为 getComputedStyle 实测。用途：<由调用方填写，如 welfare-article 新模板>

## 总体气质

<一句话：图主导/文主导；密度；装饰程度。如"图集式画册页，图占 ~88% 视口宽，零装饰">

## 版心与栅格

- 内容列：<width>px，边距 <实测边距/占比>
- 图片相对版心：<满宽 / 破格 X% / 居中限宽>
- 断点：<~Npx 以下单栏>

## 头部（Hero）

- 结构与顺序：<kicker → 标题 → 副题 → meta，各间距实测>
- kicker：<fontSize / letterSpacing / 对齐 / 颜色角色>
- 标题：<fontFamily 角色 / fontSize / fontWeight / letterSpacing / 对齐 / 行高>
- 副题与 meta：<同上>
- 封面图：<满宽/限高/比例/直角或圆角>

## 章节

- 标题：<fontSize / letterSpacing / 对齐 / 装饰线有无>
- 与上下文的间距：<实测 margin>

## 图片

- 单图：<宽度策略 / 比例 / 是否裁切>
- 图组：<列数 / 间距 / 等高策略 / 裁切与否>
- 图注：<对齐 / fontSize / 颜色 / 与图的间距>

## 正文

- 字体族角色：<衬线/无衬线；栈由实现方决定>
- fontSize / lineHeight / 对齐 / 列宽 / 段间距

## 引用与金句

<blockquote 样式实测：对齐、字号、缩进、装饰>

## 交互反馈

- <元素>：<hover 前 → 后，transition 实测>

## 响应式（390px 实测）

- <头版是否堆叠 / 图组是否退单列 / 列宽变化>

## 配色（仅供参考，是否采纳由调用方决定）

- 参考站实测：背景 / 正文 / 强调色
- 注意：welfare-article 场景固定保持站点 Catppuccin 令牌，不采纳参考站配色
```

## 禁忌（每条都是真实返工换来的）

- **不要凭截图目测数值。** 截图用于对照结构；数值必须来自计算样式。
- **不要输出虚话。** "高级感""杂志感"不是规格；字号、字距、占比才是。
- **不要建议裁切图片。**
  调用方（welfare-article）的照片带拍立得水印与署名，裁切即毁内容；规格里的图片规则一律按"原比例"设计。
- **不要采纳参考站配色到 welfare 模板。**
  配色章节仅作记录，站内实现固定用站点设计令牌。
- **不要漏交互与移动端。**
  只测桌面默认态的规格，做出来的页面会"看起来对、用起来死"。
- **不要替用户拍板实现。** 规格确认后才能进入模板编写。
