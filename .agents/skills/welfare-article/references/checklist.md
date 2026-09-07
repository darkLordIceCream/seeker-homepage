# 发布检查清单

写作与验证时逐项对照。所有规则都来自实际踩坑，不要凭印象跳过。

## 一、Frontmatter 字段

```yaml
---
title: 文章名（不是项目名；含中文逗号时画册模板会自动错位换行）
subtitle: 副题（画册模板显示在标题下；哈苏模板显示为宽字距行）
kicker: 开头品牌语（公众号头部的小字，如「繁星闪烁之时」「山风吹走乌云朵」）
coverLine: 封面图描述（用于 alt）
cover: https://pub-4a7b0e2f651540e19220929f5d72b9b6.r2.dev/welfare/bring-her-eyes/<slug>/01.jpg
excerpt: 一句话摘要（列表卡片与 SEO description 用）
quote: 开头金句（可选；正文里已有引用则不必重复设）
quoteAuthor: 金句署名（可选）
pubDate: 公众号发布日期（YYYY-MM-DD；不是抓取日）
author: 作者署名（可多人空格分隔，如「那山 寄意寒星」）
order: 现有最大 order + 1（决定列表顺序与延伸阅读方向）
layout: editorial | hasselblad（每次问用户）
---
```

注意：title 是**文章名**。若原文标题是项目名（如「带上她的眼睛 | 在遥远的地方……」格式），取分隔符后面的部分做 title，前面的做 kicker 或舍弃。

## 二、正文取舍表（原文 → md）

| 原文元素                            | 处理                                                                                               |
| ----------------------------------- | -------------------------------------------------------------------------------------------------- |
| 开头品牌头（SEEKER、项目名、副题）  | 提取到 frontmatter，不进正文                                                                       |
| 开头诗词 / 歌词引用                 | 正文开头 blockquote（短引文居中；长歌词用 `<blockquote class="song-lyrics">` + `<br>` 分行左对齐） |
| 章节标题（01 / 02 / 03 + 名称）     | `## 章节名`（编号去掉，模板自带样式）                                                              |
| 章节引言（“春天在哪里……”）          | 章节标题下 blockquote                                                                              |
| 图片下方斜体图注（「罗琴 11岁摄」） | 图片后**紧跟**斜体行（空行隔开；渲染为居中图注）                                                   |
| 正文文字                            | **一字不改照搬**                                                                                   |
| 文末鸣谢名单                        | `## 鸣谢` 章节（+「（排名不分先后）」），照搬                                                      |
| 文末支教老师等名单                  | 若原文有结构（姓名 + 学校逐条），参照 passing-spring.md 的 `.teachers` HTML 块写法                 |
| 往期回顾、小程序卡、投票、广告      | 丢弃                                                                                               |
| 二维码图 / 海报图                   | 丢弃并告知用户                                                                                     |

## 三、图片规范

- 命名：`01.jpg` 起两位序号，按文章出现顺序；扩展名以 `file`
  检出的**真实格式**为准（微信常见 .jpg 实为 PNG）
- 微信下载必须带 `Referer: https://mp.weixin.qq.com/`，否则部分图 403
- R2 路径：`seeker-homepage-assets/welfare/bring-her-eyes/<slug>/<序号>.<ext>`
- content-type 与真实格式一致（image/jpeg / image/png）
- 上传后逐张 `curl -s -o /dev/null -w "%{http_code} %{size_download}B"`
  验证 200 且字节数与本地一致
- > 3MB：质量压缩（不改尺寸）；**任何情况下禁止裁切**（拍立得水印即内容）
- 上传失败重试一次；再失败停止报告，不带病上传

## 四、组图与排版约定（写作时）

- 连续图片行**不空行** → 渲染为并排组；需要并排的图写成软换行相邻
- 竖图组会由模板自动等高排列（哈苏版 JS 计算，不裁切）
- 图片引用一律 R2 绝对 URL，不用相对路径

## 五、发布前验证清单

- [ ] 在 `feat/<slug>` 独立分支上（不在 main 直接动手）
- [ ] `pnpm run build` 通过，构建页数 +1
- [ ] 杀旧 preview（`lsof -ti:4322 | xargs kill -9`）后起新 preview
- [ ] 头版：标题 / 副题 / kicker / meta 正确，封面不裁切
- [ ] 字体与既有文章一致：标题/正文衬线（Songti
      SC 栈）、kicker/meta/图注无衬线（Archivo 栈）——用 `getComputedStyle`
      抽查验证
- [ ] 图组：等高并排、无裁切、拍立得水印完整
- [ ] 文末：鸣谢/名单完整，延伸阅读卡出现新文章
- [ ] 抽一篇旧文章：其延伸阅读/侧栏自动出现新文章互链
- [ ] 390px 移动端：头版堆叠、组图退单列、无横向滚动
- [ ] `pnpm run type-check` 与 `pnpm run lint` 0 错误

## 六、交付

- 本地提交：`✨ feat: 公益文章《标题》(feat-023)` 风格；subject 不用 `#`
- 告知用户验收链接：`http://localhost:4322/welfare/<slug>/`
- 用户确认后：push → `gh pr create --base main --head <branch>` →
  `gh pr merge --merge --delete-branch` → `git checkout main && git pull`
