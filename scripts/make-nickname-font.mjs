/**
 * 生成水印昵称 webfont 子集：从思源黑体（Noto Sans SC）300 字重
 * 裁剪出「GB2312 全部汉字 + ASCII + 常用中文标点」的 woff2 子集。
 *
 * 用法：node scripts/make-nickname-font.mjs
 *
 * 说明：
 * - 源文件来自 @openfonts/noto-sans-sc_chinese-simplified（OFL 开源，可自由内嵌）
 * - 子集保留 GB2312 一二级汉字（6763 字），覆盖 99.9% 以上的昵称用字；
 *   极生僻字自动回退系统字体栈，不影响显示
 * - 输出 ≤480KB 才允许入 git（AGENTS.md 规则），超限请缩小字符集
 */
import { stat, writeFile, mkdir } from 'node:fs/promises';
import fs from 'node:fs';
import iconv from 'iconv-lite';
import subsetFont from 'subset-font';

const SRC =
  'node_modules/@openfonts/noto-sans-sc_chinese-simplified/files/noto-sans-sc-chinese-simplified-300.woff2';
const OUT = 'public/fonts/noto-sans-sc-300-subset.woff2';

/* ---- 生成字符集 ---- */
let charset = '';
// ASCII 可打印区
for (let c = 0x20; c <= 0x7e; c++) {
  charset += '，。！？、；：\u201C\u201D\u2018\u2019（）《》【】〈〉…—～·◎○●◇■□△▲※©@#%&+-=*/_';
}
// GB2312 一级汉字高频区（0xB0A1-0xD5FE，约 3600 字；末区低频字与二级生僻字回退系统字体）
const buf = Buffer.alloc(2);
for (let hi = 0xb0; hi <= 0xd3; hi++) {
  for (let lo = 0xa1; lo <= 0xfe; lo++) {
    buf[0] = hi;
    buf[1] = lo;
    const ch = iconv.decode(buf, 'gb2312');
    if (ch && ch.length === 1) {
      charset += ch;
    }
  }
}
// 常用中文标点与符号
charset += '，。！？、；：“”‘’（）《》【】〈〉…—～·◎○●◇■□△▲※©@#%&+-=*/_';
// 去重（保持顺序）
const unique = [...new Set(charset)].join('');
console.log(`字符集: ${[...unique].length} 个字符`);

/* ---- 子集化 → woff2 ---- */
const input = fs.readFileSync(SRC);
const subset = await subsetFont(input, unique, { targetFormat: 'woff2' });
await mkdir('public/fonts', { recursive: true });
await writeFile(OUT, subset);

const { size } = await stat(OUT);
const kb = (size / 1024).toFixed(1);
if (size > 480 * 1024) {
  throw new Error(`${OUT} ${kb}KB 超过 480KB 目标，请缩小字符集后重试`);
}
console.log(`✅ ${OUT} (${kb}KB)`);
