/**
 * 补齐 Astro/Vite 生产构建缺失的 MapLibre v6 Web Worker 文件。
 *
 * 背景：maplibre-gl v6 为原生 ESM 分包（入口 + shared + worker），入口在运行期以
 * `new Worker(new URL('.../maplibre-gl-worker.mjs', import.meta.url), { type: 'module' })`
 * 拉起 worker。Vite/Rollup 处理 `new URL(..., import.meta.url)` 时会把该 URL 写进
 * 产物（dist/_astro/maplibre-gl-worker.mjs），但 Astro 的构建管线不会真正发射这个
 * 文件 → 生产环境 worker 404，地图静默卡在加载态（dev 不受影响）。
 *
 * 处理：构建后从 node_modules 原包把 worker 与 shared 两个 ESM 文件原样补进
 * dist/_astro/（文件名未被 hash，直接同名拷贝即可对上引用）。
 *
 * 用法：astro build 之后执行（package.json 的 build 脚本已串联）。
 */
import fs from 'node:fs';
import path from 'node:path';

const DIST = 'dist';
const ASTRO_DIR = path.join(DIST, '_astro');
const PKG_DIST = path.join('node_modules', 'maplibre-gl', 'dist');
const FILES = ['maplibre-gl-worker.mjs', 'maplibre-gl-shared.mjs'];

if (!fs.existsSync(ASTRO_DIR)) {
  console.warn(`[copy-maplibre-worker] 跳过：${ASTRO_DIR} 不存在（先执行 astro build）`);
  process.exit(0);
}

let copied = 0;
for (const file of FILES) {
  const src = path.join(PKG_DIST, file);
  const dest = path.join(ASTRO_DIR, file);
  if (!fs.existsSync(src)) {
    console.warn(`[copy-maplibre-worker] 跳过：源文件不存在 ${src}（maplibre-gl 版本结构变化？）`);
    continue;
  }
  fs.copyFileSync(src, dest);
  copied++;
  console.log(`[copy-maplibre-worker] ${dest}`);
}

if (copied === 0) {
  console.error('[copy-maplibre-worker] 未拷贝任何文件——生产环境地图可能无法加载');
  process.exit(1);
}
console.log(`[copy-maplibre-worker] ✅ 补齐 ${copied} 个 MapLibre worker 文件`);
