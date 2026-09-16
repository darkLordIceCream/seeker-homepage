/**
 * 【七周年 · 地图墙】成员分布明细（国内到省 / 海外到国家）。
 *
 * ⚠️ 占位数据：数字与分布为演示用虚构值，上线前请替换为真实统计。
 * 数据本体在 map-points.json（本文件做类型化转出，供 TS 侧使用；
 * 构建脚本 build-map-geo.mjs 读同一 JSON 注入 GeoJSON 属性并生成光点源）。
 *
 * 字段说明：
 * - provinces[].name 必须与 china-provinces.json 的 properties.name 完全一致
 *   （北京市 / 广东省 / 台湾省 / 香港特别行政区 …）。
 * - countries[].worldName 为世界图中的英文国名（用于匹配边界取中心点）；
 *   小国（如新加坡）或位置需校正时改用 lngLat 手工标注 [经度, 纬度]。
 */

import pointsData from './map-points.json';

export interface ProvincePoint {
  /** 省级行政区名，与 china-provinces.json 的 properties.name 一致 */
  name: string;
  count: number;
}

export interface CountryPoint {
  /** 展示用中文国名 */
  name: string;
  /** 世界图中的英文国名（用于匹配边界取中心点），与 lngLat 二选一 */
  worldName?: string;
  /** 无边界小国手工标注 [经度, 纬度]，与 worldName 二选一 */
  lngLat?: [number, number];
  count: number;
}

interface PointsData {
  provinces: ProvincePoint[];
  countries: CountryPoint[];
}

const data = pointsData as unknown as PointsData;

/** 国内成员分布（省级行政区，占位数据） */
export const PROVINCE_POINTS: readonly ProvincePoint[] = data.provinces;

/** 海外成员分布（国家，占位数据） */
export const COUNTRY_POINTS: readonly CountryPoint[] = data.countries;

/** 统计汇总（区域明细口径；页面头部统计的权威源是 stats.json，两者需一致） */
export const MAP_STATS = {
  provinces: PROVINCE_POINTS.length,
  countries: COUNTRY_POINTS.length,
  members:
    PROVINCE_POINTS.reduce((sum, p) => sum + p.count, 0) +
    COUNTRY_POINTS.reduce((sum, c) => sum + c.count, 0),
} as const;
