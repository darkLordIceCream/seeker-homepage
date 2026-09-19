/**
 * 【SEEKER 07 · WHERE WE ARE】MapLibre 地图双主题风格（中国全图：34 省级 + 九段线）。
 * 深色 = 暗房光点（LIGHT IN DARKNESS）；浅色 = 暖纸墨点（PAPER & INK）。
 * 颜色与 global.css 的 --anniv-map-* 令牌保持一致（令牌用于页面装饰，
 * MapLibre 不读 CSS 变量，故此处维护对应色值——改色需两处同步）。
 * 主题切换由 MapWall 监听 anniv-theme-change 事件后调 map.setStyle()。
 * 色阶/光点尺寸插值区间按真实统计的最大省人数（56，广东）定标。
 */
import type { GeoJSON } from 'geojson';
import type { StyleSpecification } from 'maplibre-gl';

export type AnniversaryTheme = 'dark' | 'light';

/** 成员点辉光/实点的透明度（入场渐亮动画的目标值） */
export const POINT_OPACITY = { glow: 0.16, point: 0.95 } as const;

/**
 * 生成地图 StyleSpecification。
 * @param geo 已获取的边界 GeoJSON（推荐传入，切换主题时免去重复请求）；
 *            省略时 MapLibre 自行按 URL 拉取 /geo/anniv-china.json。
 * @param points 已获取的光点 GeoJSON（区域代表点，build-map-geo.mjs 生成）；
 *               省略时按 URL 拉取 /geo/anniv-points.json。
 */
export function buildMapStyle(
  theme: AnniversaryTheme,
  geo?: GeoJSON,
  points?: GeoJSON
): StyleSpecification {
  const dark = theme !== 'light';
  const accent = dark ? '#2e86de' : '#06427e'; /* Sky 光 / Seeker Blue 墨 */
  return {
    version: 8,
    sources: {
      anniv: {
        type: 'geojson',
        data: geo ?? '/geo/anniv-china.json',
        generateId: true,
      },
      'anniv-points': {
        type: 'geojson',
        data: points ?? '/geo/anniv-points.json',
        generateId: true,
      },
    },
    layers: [
      {
        id: 'bg',
        type: 'background',
        paint: { 'background-color': dark ? '#04101e' : '#f7fafd' },
      },
      {
        id: 'region-fill',
        type: 'fill',
        source: 'anniv',
        paint: {
          'fill-color': [
            'case',
            ['==', ['feature-state', 'hover'], true],
            dark ? '#16324f' : '#d3e3f2',
            [
              'interpolate',
              ['linear'],
              ['get', 'memberCount'],
              0,
              dark ? '#0a2036' : '#e4edf6',
              10,
              dark ? '#10294a' : '#d8e6f2',
              56,
              dark ? '#1a3a5c' : '#c9dcee',
            ],
          ],
          'fill-opacity': 1,
        },
      },
      {
        id: 'region-border',
        type: 'line',
        source: 'anniv',
        paint: {
          'line-color': [
            'case',
            ['==', ['feature-state', 'hover'], true],
            accent,
            dark ? 'rgba(234, 244, 255, 0.12)' : 'rgba(20, 40, 61, 0.15)',
          ],
          'line-width': ['case', ['==', ['feature-state', 'hover'], true], 1.4, 0.6],
        },
      },
      {
        id: 'member-glow',
        type: 'circle',
        source: 'anniv-points',
        filter: ['>', ['get', 'memberCount'], 0],
        paint: {
          'circle-color': accent,
          'circle-opacity': POINT_OPACITY.glow,
          'circle-blur': 1,
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['get', 'memberCount'],
            1,
            10,
            14,
            16,
            56,
            26,
          ],
        },
      },
      {
        id: 'member-point',
        type: 'circle',
        source: 'anniv-points',
        filter: ['>', ['get', 'memberCount'], 0],
        paint: {
          'circle-color': dark ? '#a8d8ff' : '#14283d',
          'circle-opacity': POINT_OPACITY.point,
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['get', 'memberCount'],
            1,
            2.6,
            14,
            4.4,
            56,
            7,
          ],
          'circle-stroke-width': 0.6,
          'circle-stroke-color': dark ? 'rgba(4, 16, 30, 0.8)' : 'rgba(247, 250, 253, 0.85)',
        },
      },
    ],
  };
}
