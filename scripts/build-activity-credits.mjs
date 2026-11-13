/**
 * 活动图署名数据生成器（Gallery 3.1，自动生成勿手改产物）：
 * 从内容集合 frontmatter 抽逐图署名 → src/data/activity-credits.generated.ts。
 * - 《时间的故事》src/content/activities/*.md：entries[] 的 author/images/caption
 *   （真名 + 拍摄手记，覆盖率 ~100%，含各期 cover 字段）
 * - 追光之旅 src/content/light-chasing/*.md：grandPrize + groups[] 的
 *   author/title/award/images/story（真作品名 + 作者 + 奖项）
 *
 * 运行：node scripts/build-activity-credits.mjs
 * 新增期数 / 追光年度后重跑（story-of-time-article skill 的发布流程应带上）。
 * 产物随 git 提交（与 activity-image-meta.ts 同先例——布局层构建期只读它）。
 */
import { readFile, writeFile } from 'node:fs/promises';
import { parse as parseYaml } from 'yaml';

const OUT = 'src/data/activity-credits.generated.ts';
const R2_HOST = 'https://r2.xn--seeker-ng2jm403afb4a.club';

/** 取 frontmatter（首对 --- 之间）并解析 */
const frontmatterOf = text => {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return m ? parseYaml(m[1]) : null;
};

const trimStory = s =>
  (s ?? '').replace(/\s+/g, ' ').trim().slice(0, 120) + ((s ?? '').length > 120 ? '…' : '');

/** url → 署名 */
const credits = new Map();
let storyCount = 0;
let chasingCount = 0;

for (const year of ['2022', '2023', '2024', '2025']) {
  const fm = await readFile(`src/content/light-chasing/${year}.md`, 'utf8').then(frontmatterOf);
  if (!fm) {
    throw new Error(`light-chasing/${year}.md frontmatter 解析失败`);
  }
  const works = [fm.grandPrize, ...(fm.groups ?? [])].filter(Boolean);
  for (const w of works) {
    for (const url of w.images ?? []) {
      if (!url.includes(R2_HOST)) {
        continue;
      }
      const key = url.replace(`${R2_HOST}/`, '');
      credits.set(key, {
        author: w.author,
        title: w.title ?? '',
        series: `追光之旅 ${fm.year}`,
        note: trimStory(w.story),
        award: w.award ?? '',
      });
      chasingCount++;
    }
  }
}

// 《时间的故事》：66 期（2021-02 起的 story-of-time-* 与 2026-01 起的新命名）
import { readdirSync } from 'node:fs';
const mdFiles = readdirSync('src/content/activities').filter(f => f.endsWith('.md'));
for (const f of mdFiles) {
  const fm = await readFile(`src/content/activities/${f}`, 'utf8').then(frontmatterOf);
  if (!fm) {
    throw new Error(`activities/${f} frontmatter 解析失败`);
  }
  for (const entry of fm.entries ?? []) {
    for (const url of entry.images ?? []) {
      if (!url.includes(R2_HOST)) {
        continue;
      }
      const key = url.replace(`${R2_HOST}/`, '');
      const period = key.match(/activities\/(?:story-of-time-)?(\d{4})-(\d{2})\//);
      credits.set(key, {
        author: entry.author,
        title: '',
        series: period ? `${period[1]}年${Number(period[2])}月` : (fm.issue ?? ''),
        note: trimStory(entry.caption),
        award: '',
      });
      storyCount++;
    }
  }
}

const lines = [...credits.entries()]
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([key, c]) => {
    const esc = s => JSON.stringify(s ?? '');
    return `  '${key}': { author: ${esc(c.author)}, title: ${esc(c.title)}, series: ${esc(c.series)}, award: ${esc(c.award)}, note: ${esc(c.note)} },`;
  });

const banner = `/**
 * 活动图逐图署名（自动生成，勿手改——源数据见 scripts/build-activity-credits.mjs）。
 * key = R2 对象 key；author = 真实署名；title = 作品名（追光之旅参赛作品，多为空）；
 * series = 期数；award = 奖项（追光之旅）；note = 拍摄手记摘要（≤120 字，灯箱/alt 可用）。
 * 覆盖：《时间的故事》全部期数 entries（${storyCount} 图）+ 追光之旅获奖作品（${chasingCount} 图）。
 */
export interface ActivityCredit {
  author: string;
  title: string;
  series: string;
  award: string;
  note: string;
}

export const ACTIVITY_CREDITS: Readonly<Record<string, ActivityCredit>> = {
`;

await writeFile(OUT, `${banner}${lines.join('\n')}\n} as const;\n`);
console.log(`生成 ${OUT}：故事图 ${storyCount} + 追光图 ${chasingCount} = ${credits.size} 条署名`);
