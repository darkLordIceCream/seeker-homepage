---
name: story-of-time-article
description: >
  发布《时间的故事》新一期到 seeker-homepage 网站。两种数据来源皆适用： ①
  用户提供微信公众号文章链接（标题形如【Seeker 时间的故事】X月篇）； ②
  用户提供一手数据（本地图片文件夹 + docx 编辑文档）。触发词包括
  "时间的故事更新了"、"新一期时间的故事"、"把X月篇搬上来"、"更新最新一期"、
  "X月篇的一手数据在某目录"等，即使没有明说"时间的故事"。不适用于：
  公益板块文章（用 welfare-article）、追光之旅大赛（用 light-chasing 相关
  流程）、仅抓取内容做参考而不发布、编辑已有期数、单纯上传图片。
---

# 《时间的故事》新一期发布流程

把一期公众号图文完整发布到 `/activities/story-of-time/`：抓取 → 图片入 R2
→ 尺寸登记 → 写 Content Collection md → 构建验证 → PR 合并 → 生产验证。

**一期一分支**——开始任何工作前 `git branch --show-current`
确认不在 main 上；在 main 上则从最新 main 拉 `feat/story-of-time-YYYY-MM`
分支（YYYY-MM 为期数月份）。验收即 PR 即合并，不跨期复用分支。

## 关键事实（开工前先读）

- **一期 = 一个 md + 一个 R2 目录**：
  `src/content/activities/story-of-time-YYYY-MM.md` + R2 `activities/YYYY-MM/`
  （cover.webp + 01…NN.webp + committee.webp）
- **R2 路径有两代**：2026 年起无前缀（`activities/2026-09/`）；2021-2025 旧期带前缀（`activities/story-of-time-2025-12/`）。新一期一律用无前缀形式，仅维护旧期时才在旧目录内操作
- schema 在 `src/content.config.ts`（activities collection）；渲染模板
  `src/components/activities/GalleryStory.astro`；书架页 `story-of-time.astro`
  按 order 倒序自动收录，新 md 一旦构建即上书架
- **首页 #activities 的「时间的故事」卡封面自动跟随最新一期**：
  `src/components/home/ActsSection.astro`
  构建期取 order 最大的那期 cover——新增期数 md 后自动切换，**禁止再把封面 URL 写死回该文件**；发布新一期时在验证清单里确认首页卡片已换成新封面即可
- **docx 的「投稿组别」不录入 md**（2026-10-28 定版）：一手数据的 docx 每条目带投稿组别（自然风光/自然户外/城市建筑/人文纪实/人像肖像/商业创意/生态，写法多变），但往期章节分隔只有日期，加组别会破坏排版一致性——解析时识别并跳过该标签，schema 的 entry.group留空（GalleryStory 对空 group 只渲染日期）
- **参考实例**：`story-of-time-2026-09.md`（最新惯例）与
  `story-of-time-2026-08.md`，字段取值照它们来

## 第零步：确认数据来源（微信推文 or 一手数据）

- **微信推文**：走下面的第一～二步抓取流程
- **一手数据（本地文件夹 + docx 编辑文档）**：跳过抓取，改走「一手数据解析」：
  1. 目录约定：图片按「MM.DD 作者」命名文件夹（跨日如「10.01-6 大学」），每文件夹 1 张（或多张）原图；docx 记录文案（每条目：作品名称 / 投稿组别 / 介绍 /
     ID
     / 拍摄时间，标签写法有变体：名称：、组别：、作品介绍：、无标签裸行；投稿组别识别后**跳过不录入**——往期排版无组别章节）
  2. docx 提取：`textutil -stdout -convert txt <docx>`（或 unzip
     word/document.xml）
  3. 条目 ↔ 文件夹按「作者名 + 日期」配对（作者名归一：去书名号、去尾部英文句点）；docx 缺拍摄时间的条目用文件夹日期补
  4. 无标签文案紧跟前一作品 ID 行时会被吞并进相邻条目，解析后必须核对条目数 = 文件夹数，并逐条核对作者序列
  5. 已知缺口模式：个别条目缺标题/组别（如 BBBronny 十月篇）、占位组别——缺失项列入「发布前置内容清单」交用户补，勿擅自代拟

## 第一步：抓取公众号文章

1. **优先让用户给短链**（`mp.weixin.qq.com/s/xxx`
   格式）；带 poc_token 的长链会触发环境验证，受阻时让用户本机另存 HTML 再处理
2. curl 带浏览器 UA 抓**原始 HTML**——不要用网页转换器，它们把懒加载图给成
   `blob:`；真实图片 URL 在 `data-src` 属性（mmbiz CDN 可匿名直接下载）
3. 图片 URL 把 `/640?` 换 `/0?`
   取原图分辨率；把块级标签（p/section/div/br）替换成换行后再剥标签——**诗句和多段图注的分行靠这个保留**
4. 输出「文本块 | 图片」交错序列存临时文件，后续写 md 以它为唯一依据（不要凭记忆重写正文）
5. 元信息直接取 meta：`og:title`（主题句在"｜"后）、`og:description`（本期金句）、
   **`og:image`（分享封面图 ≈ 1280×545，就是站点 cover，与往期惯例一致）**、
   `createTime`（= pubDate）

## 第二步：微信编辑器陷阱对照表

逐条对照，全部处理完才动手写 md：

| 陷阱                                                    | 处理                                      |
| ------------------------------------------------------- | ----------------------------------------- |
| 日期条仅在变化时显示（装饰行「——StoryofTime」占缺失位） | 按原文位置对齐，把日期还原到每个条目      |
| 一稿多图（连续图片共用一个标题块）                      | schema `images[]`，一稿多图共用一条 entry |
| 正文图可能是 png                                        | 下载后 `file` 实测，扩展名以真实格式为准  |
| 标题书名号有 «» / 「」 两种形态                         | 剥掉外层书名号再入 `title`                |
| 组委会名单 / 本月组长 / 编辑每月不同                    | 从原文照录，不沿用上期                    |
| 尾部品牌图（committee）可能缺失                         | schema optional，缺则整个字段省略         |
| 装饰 gif / svg 分隔线                                   | 不是内容图，跳过不下载                    |
| 作者拼写、错别字（如"没想道"）                          | 一字不改照搬，正文忠实优先                |

## 第三步：图片入 R2

1. `cwebp -q 82` 转码；普通图最长边 ≤2560；**画幅 ≥3 的长条全景保留原分辨率**
2. 命名：`cover.webp`（og:image 分享封面原图）、`01.webp`…`NN.webp`（正文按序）、
   `committee.webp`（尾部品牌图）
3. `npx wrangler whoami` 确认登录的是拥有 bucket 的账号，然后逐张：
   `npx wrangler r2 object put seeker-homepage-assets/activities/YYYY-MM/<name>.webp --file <f> --remote --content-type image/webp --cache-control "public, max-age=31536000, immutable"`
4. **全量验证**：逐对象 curl 检查 HTTP
   200 且 Content-Length 与本地一致（最好 MD5 比对）；单张失败重传，全部通过才进下一步

## 第四步：尺寸登记

`src/lib/activity-image-meta.ts`
追加本期全部对象（含 cover/committee）的实际 WebP 像素尺寸。插入位置按代：2026 期插在
`activities/2026-(MM-1)/cover.webp`
之后（首期 2026-01 在文件最前）；旧期插在对应 story-of-time-YYYY-MM 块尾。文件头注明"勿手改单个条目，新增期数按相同结构追加"。

## 第五步：写期数 md

新建 `src/content/activities/story-of-time-YYYY-MM.md`（先确认在
`feat/story-of-time-YYYY-MM` 分支上）。字段照参考实例：

- `subtitle` = og:title"｜"后的主题句；`quote` = og:description；`period` =
  "SEPTEMBER 2026" 式英文月年；`team.lead/editor` = 本月组长/编辑； `pubDate`
  = 原文发布日；`order` = YYYYMM；`excerpt` =
  "《时间的故事》X月篇：<主题句>。N 幅作品，……"
- `entries[]`：date（加引号）/ title（无书名号）/ author（不含 @，可含 emoji）/
  caption（**一字不改照搬**）/ images（R2 绝对 URL）
- `poem`（结尾诗，`|` 块标量保留分行）；`pastIssues`
  顺延最近 5 期——注意这是 schema 外字段（zod 会剥离），但为模板一致性照抄；`committeeImage` +
  `committee`（组委会照录）

**YAML 陷阱**：日期一律加引号；含英文直引号/冒号/emoji 的单行标量必须加引号（原文直引号会让裸标量断裂）；多段图注用
`|-` 块标量保留段落。

**发布前置内容清单**（月度编辑字段不会自动生成，交付前必须逐项与用户确认；缺失项明确留空占位并告知）：

1. subtitle 主题句（必填，页面大标题旁）
2. quote 金句（可省）
3. team 本月组长 / 编辑
4. poem 结尾诗（可省）
5. committeeImage 组委会品牌图（R2 `activities/YYYY-MM/committee.webp`）
6. committee 组委会策划团队名单
7. cover 封面图（1280×545 横幅；往期取公众号分享封面；临时可用首幅作品图占位，上线前必须替换）
8. pubDate 定档发布时间

## 第六步：构建验证

1. `./init.sh` 全绿（pnpm install / type-check / lint / build）
2. 页数 +1：`/activities/story-of-time-YYYY-MM/` 路由出现
3. 书架页：总期数 +1、新一期带「新」标
4. 首页 `#activities` 时间的故事卡封面 = 本期 cover（构建期自动跟随，检查
   `dist/index.html` 的 stack-card 背景图为新封面 URL）
5. 详情页断言：条目数与原文一致、md 引用的 R2 URL 恰好全部存在（0 死链 0 冗余）
6. 视觉验收（如做）：**长画廊页截图必须等视口内图片 complete（最好 eager 化全量等待再截）**，否则必然产生布局塌陷误报

## 第七步：交付

- 提交：Conventional Commits +
  gitmoji（`✨ feat(activities): 《时间的故事》X月篇上线（…）`；subject 里不要用
  `#`，会触发 commitlint 报错）
- push → `gh pr create`
  → 审查（diff 只含预期文件：新 md、meta 尺寸、工件；Cloudflare Pages 检查绿）→
  `gh pr merge --merge --delete-branch` → 切回 main 拉取同步
- 合并后生产验证：`https://seeker-homepage.pages.dev/activities/story-of-time-YYYY-MM/`
  返回 200 且内容正确（push main 自动触发部署，等 check-run success 再验）

### 定时发布（与微信推文同步上线）

- 机制：GitHub Actions `scheduled-publish.yml`（每 5 分钟 tick）检查
  `release/publish-time.txt`（ISO 时间，含 +08:00 时区）——到点且存在
  `release/story-of-time-YYYY-MM` 分支的开放 PR 即自动合并 → push main →
  CF 构建上线（误差约 1–3 分钟）；`workflow_dispatch` 可手动立即触发
- 流程：内容全部就绪 → 推 release 分支 + 开 PR（**保持开放不手动合并**）→把确定的发布时间写进
  `release/publish-time.txt`（单独小提交）→ 到点自动合并上线
- 内容 PR 的 pubDate 填发布时间；时间未定时 publish-time.txt 用过去时间占位（workflow 空转，不会误发）
- 收尾职责：更新 feature_list.json（feat-018 证据的期数总数）与 progress.md

## 并行会话注意事项

工作区可能被并行会话 checkout 到其他分支（有事故记录，见 progress.md
2026-09-22）。开工时若 `git branch --show-current` 不是预期分支且工作树被占用，
**不要切走别人的分支**：用独立 worktree 完成全部操作——
`git worktree add /tmp/<名字>-wt -b <分支> main`，在其中编辑、提交、push，结束后
`git worktree remove` 清理。
