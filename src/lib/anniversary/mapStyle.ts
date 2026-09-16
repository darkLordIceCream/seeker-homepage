/**
 * 【SEEKER 07 · WHERE WE ARE】MapLibre 地图双主题风格。
 * 深色 = 暗房光点（LIGHT IN DARKNESS）；浅色 = 暖纸墨点（PAPER & INK）。
 * 颜色与 global.css 的 --anniv-map-* 令牌保持一致（令牌用于页面装饰，
 * MapLibre 不读 CSS 变量，故此处维护对应色值——改色需两处同步）。
 * 主题切换由 MapWall 监听 anniv-theme-change 事件后调 map.setStyle()。
 */
import type { GeoJSON } from 'geojson';
import type { StyleSpecification } from 'maplibre-gl';

export type AnniversaryTheme = 'dark' | 'light';

/** 成员点辉光/实点的透明度（入场渐亮动画的目标值） */
export const POINT_OPACITY = { glow: 0.16, point: 0.95 } as const;

/**
 * 生成地图 StyleSpecification。
 * @param geo 已获取的 GeoJSON（推荐传入，切换主题时免去重复请求）；
 *            省略时 MapLibre 自行按 URL 拉取 /geo/anniv-world.json。
 */
export function buildMapStyle(theme: AnniversaryTheme, geo?: GeoJSON): StyleSpecification {
  const dark = theme !== 'light';
  const accent = dark ? '#e8c766' : '#7c6118';
  return {
    version: 8,
    sources: {
      anniv: {
        type: 'geojson',
        data: geo ?? '/geo/anniv-world.json',
        generateId: true,
      },
    },
    layers: [
      {
        id: 'bg',
        type: 'background',
        paint: { 'background-color': dark ? '#060607' : '#f6f1e6' },
      },
      {
        id: 'region-fill',
        type: 'fill',
        source: 'anniv',
        paint: {
          'fill-color': [
            'case',
            ['==', ['feature-state', 'hover'], true],
            dark ? '#33322f' : '#d5c9a8',
            [
              'interpolate',
              ['linear'],
              ['get', 'memberCount'],
              0,
              dark ? '#141419' : '#e5ddc8',
              10,
              dark ? '#232017' : '#dcd0ae',
              88,
              dark ? '#4a3d1c' : '#c8b483',
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
            dark ? 'rgba(242, 240, 235, 0.14)' : 'rgba(34, 29, 20, 0.16)',
          ],
          'line-width': ['case', ['==', ['feature-state', 'hover'], true], 1.4, 0.6],
        },
      },
      {
        id: 'member-glow',
        type: 'circle',
        source: 'anniv',
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
            88,
            26,
          ],
        },
      },
      {
        id: 'member-point',
        type: 'circle',
        source: 'anniv',
        filter: ['>', ['get', 'memberCount'], 0],
        paint: {
          'circle-color': dark ? '#f5e2a8' : '#221d14',
          'circle-opacity': POINT_OPACITY.point,
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['get', 'memberCount'],
            1,
            2.6,
            14,
            4.4,
            88,
            7,
          ],
          'circle-stroke-width': 0.6,
          'circle-stroke-color': dark ? 'rgba(6, 6, 7, 0.8)' : 'rgba(246, 241, 230, 0.85)',
        },
      },
    ],
  };
}
