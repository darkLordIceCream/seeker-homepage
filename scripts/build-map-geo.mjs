/**
 * 构建「七周年地图墙」中国全图 GeoJSON（34 省级行政区 + 九段线）。
 *
 * 用法：node scripts/build-map-geo.mjs
 *
 * 处理：
 * 1. 源 = DataV 省级数据（34 省级 + 九段线，含港澳台）。
 * 2. 简化：坐标取整（~3km）+ 去重 + 共线点去除，控制体积 ≤480KB。
 * 3. 区域过小被简化清空时（如澳门）保留原始环，避免要素消失。
 * 4. 注入成员数据（nameZh / memberCount）：源 = src/data/anniversary/map-points.json，
 *    未列入的省份计 0（港澳台等无成员省份保留边界，不生成光点）。
 *
 * 输出：public/geo/anniv-china.json（提交入库，≤480KB）
 *       public/geo/anniv-points.json（光点源：34 省级代表点，含 0 人省份，
 *       供暗房「你在哪里」全量选择；页面样式按 memberCount > 0 只点亮有成员的省）
 * 说明：地图为中国视图。如恢复世界视图，见 git 历史中的世界+中国合并版脚本。
 */
import fs from 'node:fs';

const CHINA_SRC = 'public/geo/china-provinces.json';
const OUT = 'public/geo/anniv-china.json';
const POINTS_OUT = 'public/geo/anniv-points.json';
const PREC = 0.03; // ~3km

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

const china = JSON.parse(fs.readFileSync(CHINA_SRC, 'utf8'));
if (!Array.isArray(china.features)) {
  throw new Error('china-provinces.json 结构异常（无 features）');
}

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
    } else if (simplified.length > 1) {
      outPolys.push(...simplified.map((r) => [r]));
    }
    // simplified 为空（区域过小被简化清空，如澳门）时保留原始环，避免要素消失
    if (simplified.length === 0 && poly[0] && poly[0].length >= 4) {
      outPolys.push(poly);
    }
  }
  f.geometry = { type: 'MultiPolygon', coordinates: outPolys };
}
console.log(`中国省级要素: ${china.features.length}`);

// —— 注入成员数据（nameZh / memberCount），统计与地图同源 ——
// 直接读 map-points.json（与 map-points.ts 同一数据源；Node ESM 读 JSON 免导入属性）
const POINTS_DATA = JSON.parse(
  fs.readFileSync('src/data/anniversary/map-points.json', 'utf8'),
);
const PROVINCE_POINTS = POINTS_DATA.provinces;
const countByName = new Map(PROVINCE_POINTS.map((p) => [p.name, p.count]));
let enriched = 0;
for (const f of china.features) {
  if (!f.properties.name) {
    // DataV 九段线要素（adcode 100000_JD）无名称，标注后供 tooltip 使用
    f.properties.nameZh = '南海诸岛';
    f.properties.memberCount = 0;
    continue;
  }
  f.properties.nameZh = f.properties.name;
  f.properties.memberCount = countByName.get(f.properties.name) ?? 0;
  if (countByName.has(f.properties.name)) {
    enriched++;
  }
}
console.log(`注入成员数据: ${enriched} 个地区有成员`);

// —— 生成光点源 anniv-points.json ——
// 光点必须是 Point 要素：circle 图层作用在多边形上会按顶点渲染（光点沿边界密布）。
// 取「最大外环顶点均值」为每个省级行政区求代表点；0 人省份同样生成（暗房
// 「你在哪里」需要全量选项），页面样式按 memberCount > 0 过滤只点亮有成员的。
function largestRingCentroid(geometry) {
  const polys = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates;
  let bestRing = null;
  let bestArea = 0;
  for (const poly of polys) {
    const ring = poly[0];
    let area = 0;
    for (let i = 0; i < ring.length - 1; i++) {
      area += ring[i][0] * ring[i + 1][1] - ring[i + 1][0] * ring[i][1];
    }
    area = Math.abs(area / 2);
    if (area > bestArea) {
      bestArea = area;
      bestRing = ring;
    }
  }
  if (!bestRing) {
    return null;
  }
  let sx = 0;
  let sy = 0;
  for (const p of bestRing) {
    sx += p[0];
    sy += p[1];
  }
  return [sx / bestRing.length, sy / bestRing.length];
}

const pointFeatures = [];
for (const f of china.features) {
  const coord = largestRingCentroid(f.geometry);
  if (!coord || !f.properties.nameZh || f.properties.nameZh === '南海诸岛') {
    continue; // 九段线是界线不是行政区，不生成光点
  }
  pointFeatures.push({
    type: 'Feature',
    geometry: { type: 'Point', coordinates: coord },
    properties: {
      name: f.properties.nameZh,
      nameZh: f.properties.nameZh,
      memberCount: f.properties.memberCount,
      kind: 'province',
    },
  });
}

fs.writeFileSync(
  POINTS_OUT,
  JSON.stringify({ type: 'FeatureCollection', features: pointFeatures }),
);
console.log(
  `光点源: ${pointFeatures.length} 点（34 省级，含 ${PROVINCE_POINTS.length} 个有成员）→ ${POINTS_OUT}`,
);

const out = JSON.stringify(china);
fs.mkdirSync('public/geo', { recursive: true });
fs.writeFileSync(OUT, out);

const { size } = await fs.promises.stat(OUT);
const kb = (size / 1024).toFixed(0);
if (size > 480 * 1024) {
  throw new Error(`${OUT} ${kb}KB 超过 480KB 目标`);
}
console.log(`✅ ${OUT} (${kb}KB)`);
