import { readFileSync } from 'node:fs';
import type { FeatureCollection, MultiPolygon, Polygon, Position } from 'geojson';

/**
 * 首页分部小地图的构建期渲染：把已提交的省界 GeoJSON（public/geo/china-provinces.json，
 * DataV 数据）投影、简化成可直接内联的 SVG 路径字符串，构建后零客户端地图库。
 *
 * 投影：等距圆柱，经度按 35°N 的 cos 收缩，接近常见中国全图观感。
 * 版式：主图为大陆范围（海南岛完整保留），南海诸岛按惯例以附图呈现——
 * 附图复用同一完整投影空间（含南海）做等比缩小，因此所有路径只算一遍。
 * 简化：0.1° 量化去重 → 投影到像素空间 → Douglas–Peucker 抽稀（闭合环按
 * 距起点最远点拆成两条开链分别处理），容差按主图显示尺寸标定。
 */

export interface ChinaSvgProvince {
  name: string;
  /** 完整投影空间坐标下的路径（主图与附图共用） */
  d: string;
  /** 路径在投影空间的最大 y，用于挑选伸进南海附图范围的省份 */
  maxY: number;
}

export interface ChinaSvgData {
  /** 主图（大陆）viewBox 尺寸 */
  viewW: number;
  viewH: number;
  /** 完整投影空间尺寸，供附图等比换算 */
  fullWidth: number;
  fullHeight: number;
  provinces: ChinaSvgProvince[];
  /** 九段线路径（完整投影空间坐标，仅描边） */
  nineDash: string[];
}

// 全图投影范围（含南海诸岛），与周年页地图保持一致
const LNG0 = 73.5;
const LNG1 = 135.1;
const LAT0 = 3.8;
const LAT1 = 53.6;
// 主图南界：低于海南岛与九段线上段，给右下角南海附图留出纯海区
const MAIN_LAT0 = 16.5;
const VIEW_W = 640;
const KX = Math.cos((35 * Math.PI) / 180);
const SCALE = VIEW_W / ((LNG1 - LNG0) * KX);
const FULL_H = Math.round((LAT1 - LAT0) * SCALE);
const MAIN_H = Math.round((LAT1 - MAIN_LAT0) * SCALE);

// 量化网格：1/GRID 度（0.1° ≈ 11km），先去重再进像素空间抽稀
const GRID = 10;
// 双向跨度都小于该网格数（0.2°）的环直接丢弃（如澳门，绘制后不足 1px）
const MIN_RING_SPAN = 2;
// 抽稀容差（投影空间 px；主图约以 2/3 比例显示）
const DP_TOLERANCE = 1.0;
const DP_TOLERANCE_NINE_DASH = 0.7;

type Pt = [number, number];

function isNineDash(adcode: unknown): boolean {
  return String(adcode) === '100000_JD';
}

/** 0.1° 网格量化 + 相邻去重，返回网格整数坐标 */
function quantizeRing(ring: Position[]): Pt[] {
  const pts: Pt[] = [];
  let lastX = Number.NaN;
  let lastY = Number.NaN;
  for (const p of ring) {
    const lng = p[0];
    const lat = p[1];
    if (lng === undefined || lat === undefined) {
      continue;
    }
    const x = Math.round(lng * GRID);
    const y = Math.round(lat * GRID);
    if (x === lastX && y === lastY) {
      continue;
    }
    pts.push([x, y]);
    lastX = x;
    lastY = y;
  }
  return pts;
}

function ringSpan(pts: Pt[]): { w: number; h: number } {
  let minX = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;
  for (const [x, y] of pts) {
    if (x < minX) {
      minX = x;
    }
    if (x > maxX) {
      maxX = x;
    }
    if (y < minY) {
      minY = y;
    }
    if (y > maxY) {
      maxY = y;
    }
  }
  return { w: maxX - minX, h: maxY - minY };
}

function projectPt(pt: Pt): Pt {
  const x = (pt[0] / GRID - LNG0) * KX * SCALE;
  const y = (LAT1 - pt[1] / GRID) * SCALE;
  return [Math.round(x * 10) / 10, Math.round(y * 10) / 10];
}

function pointSegDist([px, py]: Pt, [ax, ay]: Pt, [bx, by]: Pt): number {
  const dx = bx - ax;
  const dy = by - ay;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) {
    return Math.hypot(px - ax, py - ay);
  }
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lenSq));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

/** 开折线 Douglas–Peucker（迭代式，避免深递归） */
function dpOpen(pts: Pt[], tolerance: number): boolean[] {
  const keep = new Array<boolean>(pts.length).fill(false);
  const first = pts[0];
  const last = pts[pts.length - 1];
  if (!first || !last) {
    return keep;
  }
  keep[0] = true;
  keep[pts.length - 1] = true;
  const stack: Array<[number, number]> = [[0, pts.length - 1]];
  for (let range = stack.pop(); range; range = stack.pop()) {
    const [start, end] = range;
    const a = pts[start];
    const b = pts[end];
    if (!a || !b) {
      continue;
    }
    let maxDist = -1;
    let maxIdx = -1;
    for (let i = start + 1; i < end; i++) {
      const p = pts[i];
      if (!p) {
        continue;
      }
      const d = pointSegDist(p, a, b);
      if (d > maxDist) {
        maxDist = d;
        maxIdx = i;
      }
    }
    if (maxDist > tolerance && maxIdx > 0) {
      keep[maxIdx] = true;
      stack.push([start, maxIdx], [maxIdx, end]);
    }
  }
  return keep;
}

/** 闭合环抽稀：按距起点最远的点拆成两条开链，各自 DP 后拼回（不重复端点坐标） */
function simplifyRingPx(ring: Pt[], tolerance: number): Pt[] {
  if (ring.length < 4) {
    return ring;
  }
  const p0 = ring[0];
  if (!p0) {
    return ring;
  }
  let farIdx = 1;
  let maxD = -1;
  for (let i = 1; i < ring.length; i++) {
    const p = ring[i];
    if (!p) {
      continue;
    }
    const d = Math.hypot(p[0] - p0[0], p[1] - p0[1]);
    if (d > maxD) {
      maxD = d;
      farIdx = i;
    }
  }
  const chainA = ring.slice(0, farIdx + 1);
  const endB = ring[farIdx];
  const chainB = endB ? ring.slice(farIdx).concat([p0]) : ring.slice(farIdx);
  const keepA = dpOpen(chainA, tolerance);
  const keepB = dpOpen(chainB, tolerance);
  const headA = chainA.filter((_, i) => keepA[i] ?? false);
  const headB = chainB.filter((_, i) => keepB[i] ?? false);
  // chainA 末点 = chainB 首点，chainB 末点 = 起点回环（交给 Z 收口），各去掉一份
  return [...headA.slice(0, -1), ...headB.slice(0, -1)];
}

function ringPathD(ring: Pt[]): string | null {
  if (ring.length < 3) {
    return null;
  }
  const coords = ring.map(([x, y]) => `${x} ${y}`);
  return `M${coords.join(' ')}Z`;
}

let cache: ChinaSvgData | null = null;

export function buildChinaSvgData(): ChinaSvgData {
  if (cache) {
    return cache;
  }
  const raw = JSON.parse(
    readFileSync('public/geo/china-provinces.json', 'utf8'),
  ) as FeatureCollection<Polygon | MultiPolygon>;

  const provinces: ChinaSvgProvince[] = [];
  const nineDash: string[] = [];

  for (const feature of raw.features) {
    const { geometry } = feature;
    if (!geometry) {
      continue;
    }
    const polygons = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates;
    const dash = isNineDash(feature.properties?.adcode);
    const ds: string[] = [];
    let maxY = Number.NEGATIVE_INFINITY;

    for (const rings of polygons) {
      for (const ring of rings) {
        const quantized = quantizeRing(ring);
        const span = ringSpan(quantized);
        if (span.w < MIN_RING_SPAN && span.h < MIN_RING_SPAN) {
          continue;
        }
        const projected = quantized.map(projectPt);
        for (const [, y] of projected) {
          if (y > maxY) {
            maxY = y;
          }
        }
        const simplified = simplifyRingPx(projected, dash ? DP_TOLERANCE_NINE_DASH : DP_TOLERANCE);
        const d = ringPathD(simplified);
        if (d) {
          ds.push(d);
        }
      }
    }

    if (ds.length === 0) {
      continue;
    }
    if (dash) {
      nineDash.push(...ds);
    } else {
      const name = typeof feature.properties?.name === 'string' ? feature.properties.name : '';
      provinces.push({ name, d: ds.join(''), maxY });
    }
  }

  cache = {
    viewW: VIEW_W,
    viewH: MAIN_H,
    fullWidth: VIEW_W,
    fullHeight: FULL_H,
    provinces,
    nineDash,
  };
  return cache;
}

/** [lng, lat] → 投影空间像素坐标（主图与完整空间共用左上角原点） */
export function projectPoint([lng, lat]: [number, number]): Pt {
  const x = (lng - LNG0) * KX * SCALE;
  const y = (LAT1 - lat) * SCALE;
  return [Math.round(x * 10) / 10, Math.round(y * 10) / 10];
}
