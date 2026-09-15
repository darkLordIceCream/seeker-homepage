/**
 * 构建「七周年地图墙」合并地图数据：世界（国家）+ 中国（省域）单一 GeoJSON。
 *
 * 用法：node scripts/build-map-geo.mjs
 *
 * 处理：
 * 1. 源 = ECharts 官方 world.json（日界线预切割，217 国，properties.name 为英文国名）；
 *    本地缺失时自动从 GitHub 下载。
 * 2. 简化：坐标取整（~1km 精度）+ 去重 + 共线点去除，控制体积 ≤480KB。
 * 3. 环修复：单段经度跳变 >40° 的退化环（简化副作用，如俄罗斯北海岸）按跳变切割。
 * 4. 移除中国轮廓与南极洲，替换为 DataV 省级数据（34 省级 + 九段线），
 *    实现「国内精确到省、国外精确到国家」的单图融合。
 *
 * 输出：public/geo/anniv-world.json（提交入库，≤480KB）
 * 数据：成员分布见 src/data/anniversary/map-points.ts
 */
import fs from 'node:fs';

const WORLD_URL = 'https://raw.githubusercontent.com/apache/echarts/master/test/data/map/json/world.json';
const WORLD_CACHE = '/tmp/geo/echarts-world.json';
const OUT = 'public/geo/anniv-world.json';
const PREC = 0.03; // ~3km

async function loadWorldSource() {
  if (fs.existsSync(WORLD_CACHE)) {
    return fs.readFileSync(WORLD_CACHE, 'utf8');
  }
  const resp = await fetch(WORLD_URL);
  if (!resp.ok) {
    throw new Error(`下载世界地图失败：HTTP ${resp.status}`);
  }
  const text = await resp.text();
  fs.mkdirSync('/tmp/geo', { recursive: true });
  fs.writeFileSync(WORLD_CACHE, text);
  return text;
}

function ringWraps(ring, threshold = 180) {
  for (let i = 0; i < ring.length - 1; i++) {
    if (Math.abs(ring[i][0] - ring[i + 1][0]) > threshold) {
      return true;
    }
  }
  return false;
}

/** 在跳变处切割环：跳变 >40° 的退化段按跳变位置切开，两段各自闭合 */
function splitRingAtJumps(ring) {
  const parts = [];
  let cur = [];
  for (let i = 0; i < ring.length; i++) {
    const pt = ring[i];
    if (i === 0) {
      cur.push(pt.slice());
      continue;
    }
    const prev = ring[i - 1];
    const d = Math.abs(pt[0] - prev[0]);
    if (d > 40) {
      if (cur.length >= 3) {
        parts.push(cur);
      }
      cur = [pt.slice()];
    } else {
      cur.push(pt.slice());
    }
  }
  if (cur.length >= 3) {
    parts.push(cur);
  }
  return parts;
}

function simplifyRing(ring) {
  const q = ring.map((pt) => [
    Number((Math.round(pt[0] / PREC) * PREC).toFixed(2)),
    Number((Math.round(pt[1] / PREC) * PREC).toFixed(2)),
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
    return dedup;
  }
  let pts = dedup;
  for (let pass = 0; pass < 3; pass++) {
    const res = [pts[0]];
    for (let i = 1; i < pts.length - 1; i++) {
      const a = res[res.length - 1];
      const b = pts[i];
      const c = pts[i + 1];
      const cross = (b[0] - a[0]) * (c[1] - b[1]) - (b[1] - a[1]) * (c[0] - b[0]);
      if (Math.abs(cross) > 0.01) {
        res.push(b);
      }
    }
    res.push(pts[pts.length - 1]);
    if (res.length === pts.length) {
      pts = res;
      break;
    }
    pts = res;
  }
  return pts;
}

const worldText = await loadWorldSource();
const world = JSON.parse(worldText);
if (!Array.isArray(world.features)) {
  throw new Error('echarts world.json 结构异常（无 features）');
}

// 环修复（俄罗斯北海岸等简化退化段）
for (const f of world.features) {
  if (f.geometry.type !== 'Polygon' && f.geometry.type !== 'MultiPolygon') {
    continue;
  }
  const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
  const outPolys = [];
  for (const poly of polys) {
    const newRings = [];
    for (const ring of poly) {
      if (ringWraps(ring, 40)) {
        newRings.push(...splitRingAtJumps(ring).map(simplifyRing));
      } else {
        newRings.push(simplifyRing(ring));
      }
    }
    const usable = newRings.filter((r) => r.length >= 4);
    if (usable.length === 1) {
      outPolys.push(usable);
    } else {
      outPolys.push(...usable.map((r) => [r]));
    }
  }
  f.geometry = { type: 'MultiPolygon', coordinates: outPolys };
}

// 移除中国轮廓与南极洲（中国区域由省级数据替换；南极洲无成员且投影线易出伪影）
const before = world.features.length;
world.features = world.features.filter(
  (f) => f.properties?.name !== 'China' && f.properties?.name !== 'Antarctica',
);
console.log(`移除 China/Antarctica: ${before} → ${world.features.length} 要素`);

// 追加中国省级（DataV，含九段线）
const chinaText = fs.readFileSync('public/geo/china-provinces.json', 'utf8');
const china = JSON.parse(chinaText);
for (const f of china.features) {
  if (f.geometry.type !== 'Polygon' && f.geometry.type !== 'MultiPolygon') {
    continue;
  }
  const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
  const outPolys = [];
  for (const poly of polys) {
    const simplified = poly.map(simplifyRing).filter((r) => r.length >= 4);
    if (simplified.length === 1) {
      outPolys.push(simplified);
    } else {
      outPolys.push(...simplified.map((r) => [r]));
    }
  }
  f.geometry = { type: 'MultiPolygon', coordinates: outPolys };
  world.features.push(f);
}
console.log(`合并后要素: ${world.features.length}`);

const out = JSON.stringify(world);
fs.mkdirSync('public/geo', { recursive: true });
fs.writeFileSync(OUT, out);

const { size } = await fs.promises.stat(OUT);
const kb = (size / 1024).toFixed(0);
if (size > 480 * 1024) {
  throw new Error(`${OUT} ${kb}KB 超过 480KB 目标`);
}
console.log(`✅ ${OUT} (${kb}KB)`);
