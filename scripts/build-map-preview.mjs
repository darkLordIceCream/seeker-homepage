/**
 * 构建「01 七年序章」地图静态预览 SVG（作为 CSS mask 使用，可被页面令牌上色）。
 *
 * 用法：node scripts/build-map-preview.mjs
 *
 * 处理：public/geo/anniv-world.json → equirectangular 投影（经度 -180..180，
 * 纬度 -56..84，裁掉南半球空域）→ 0.35° 量化 + 去重 + 共线点去除（两轮）→
 * 丢弃过小环。输出单 path 黑色填充 SVG，页面侧用 mask + --anniv-map-land 上色，
 * 深浅主题天然自适应、零 JS。
 *
 * 输出：public/geo/map-preview.svg（提交入库，目标 ≤150KB）
 */
import fs from 'node:fs';

const SRC = 'public/geo/anniv-world.json';
const OUT = 'public/geo/map-preview.svg';
const W = 1000;
const LAT_MAX = 84;
const LAT_MIN = -56;
const PREC = 0.6;

const H = Math.round((W * (LAT_MAX - LAT_MIN)) / 360);
const project = ([lng, lat]) => [
  ((lng + 180) / 360) * W,
  ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * H,
];

function simplifyRing(ring) {
  const q = ring.map(pt => [
    Math.round(pt[0] / PREC) * PREC,
    Math.round(pt[1] / PREC) * PREC,
  ]);
  const dedup = [q[0]];
  for (let i = 1; i < q.length; i++) {
    const p = q[i];
    const last = dedup[dedup.length - 1];
    if (p[0] !== last[0] || p[1] !== last[1]) {
      dedup.push(p);
    }
  }
  if (dedup.length < 4) {
    return null;
  }
  let pts = dedup;
  for (let pass = 0; pass < 2; pass++) {
    const res = [pts[0]];
    for (let i = 1; i < pts.length - 1; i++) {
      const a = res[res.length - 1];
      const b = pts[i];
      const c = pts[i + 1];
      const cross = (b[0] - a[0]) * (c[1] - b[1]) - (b[1] - a[1]) * (c[0] - b[0]);
      if (Math.abs(cross) > 1e-9) {
        res.push(b);
      }
    }
    res.push(pts[pts.length - 1]);
    pts = res;
    if (pts.length < 4) {
      return null;
    }
  }
  return pts;
}

function ringArea(pts) {
  let area = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    area += pts[i][0] * pts[i + 1][1] - pts[i + 1][0] * pts[i][1];
  }
  return Math.abs(area / 2);
}

const geo = JSON.parse(fs.readFileSync(SRC, 'utf8'));
const parts = [];
let skipped = 0;

for (const f of geo.features) {
  if (f.geometry?.type !== 'Polygon' && f.geometry?.type !== 'MultiPolygon') {
    continue;
  }
  const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
  for (const poly of polys) {
    for (const ring of poly) {
      const pts = simplifyRing(ring.map(project));
      // 只保留外环（简化后内环多为碎屑），并丢弃显示尺寸下不可见的小环
      if (!pts || pts.length < 4 || ringArea(pts) < 0.6) {
        skipped++;
        continue;
      }
      const d = `${pts
        .map((p, i) => `${i === 0 ? 'M' : 'L'}${Math.round(p[0])} ${Math.round(p[1])}`)
        .join('')}Z`;
      parts.push(d);
    }
  }
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet"><path fill="#000" fill-rule="evenodd" d="${parts.join('')}"/></svg>`;

fs.mkdirSync('public/geo', { recursive: true });
fs.writeFileSync(OUT, svg);

const { size } = await fs.promises.stat(OUT);
const kb = (size / 1024).toFixed(0);
if (size > 150 * 1024) {
  throw new Error(`${OUT} ${kb}KB 超过 150KB 目标（调大 PREC 重试）`);
}
console.log(`✅ ${OUT} (${kb}KB)，环片段 ${parts.length}，丢弃 ${skipped}，画布 ${W}x${H}`);
