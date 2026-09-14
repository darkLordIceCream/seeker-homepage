/**
 * 【七周年 · 地图墙】成员分布数据（占位数据，等待真实数据替换）。
 *
 * ⚠️ 本文件当前为占位数据：数字与分布为演示用虚构值，上线前请替换为真实统计。
 *
 * 替换方式：
 * - `PROVINCE_POINTS`：国内成员，精确到省级行政区（含 港/澳/台）。
 *   `name` 必须与 GeoJSON 中的省级名称完全一致（北京市 / 广东省 / 台湾省 /
 *   香港特别行政区 / 澳门特别行政区 …），count 为该地区成员数。
 * - `COUNTRY_POINTS`：海外成员，精确到国家。
 *   `worldName` 为 world-atlas 世界图中的英文国名（用于构建期匹配边界并取
 *   中心点），若该国在世界图上过小无法匹配（如新加坡），改用 `lngLat`
 *   手工标注 [经度, 纬度]。`name` 为展示用的中文国名。
 *
 * 地图墙在构建期读取本文件渲染 SVG——改完数据重新 build 即自动更新。
 */

export interface ProvincePoint {
  /** 省级行政区名，与 china-provinces.json 的 properties.name 一致 */
  name: string;
  count: number;
}

export interface CountryPoint {
  /** 展示用中文国名 */
  name: string;
  /** world-atlas 中的英文国名（用于匹配边界取中心点），二选一 */
  worldName?: string;
  /** 无边界小国手工标注 [经度, 纬度]，与 worldName 二选一 */
  lngLat?: [number, number];
  count: number;
}

/** 国内成员分布（省级行政区，占位数据） */
export const PROVINCE_POINTS: readonly ProvincePoint[] = [
  { name: '北京市', count: 88 },
  { name: '上海市', count: 76 },
  { name: '广东省', count: 68 },
  { name: '浙江省', count: 52 },
  { name: '江苏省', count: 45 },
  { name: '四川省', count: 33 },
  { name: '湖南省', count: 31 },
  { name: '山东省', count: 29 },
  { name: '河南省', count: 27 },
  { name: '湖北省', count: 25 },
  { name: '福建省', count: 24 },
  { name: '安徽省', count: 22 },
  { name: '重庆市', count: 20 },
  { name: '河北省', count: 21 },
  { name: '陕西省', count: 18 },
  { name: '辽宁省', count: 16 },
  { name: '云南省', count: 15 },
  { name: '广西壮族自治区', count: 14 },
  { name: '江西省', count: 13 },
  { name: '山西省', count: 12 },
  { name: '贵州省', count: 11 },
  { name: '天津市', count: 10 },
  { name: '黑龙江省', count: 9 },
  { name: '海南省', count: 8 },
  { name: '吉林省', count: 8 },
  { name: '内蒙古自治区', count: 7 },
  { name: '甘肃省', count: 6 },
  { name: '新疆维吾尔自治区', count: 6 },
  { name: '台湾省', count: 12 },
  { name: '香港特别行政区', count: 9 },
  { name: '澳门特别行政区', count: 3 },
  { name: '宁夏回族自治区', count: 4 },
  { name: '青海省', count: 3 },
  { name: '西藏自治区', count: 5 },
];

/** 海外成员分布（国家，占位数据） */
export const COUNTRY_POINTS: readonly CountryPoint[] = [
  { name: '日本', worldName: 'Japan', count: 11 },
  { name: '美国', worldName: 'United States of America', count: 14 },
  { name: '澳大利亚', worldName: 'Australia', count: 9 },
  { name: '新加坡', lngLat: [103.8198, 1.3521], count: 7 },
  { name: '加拿大', worldName: 'Canada', count: 6 },
  { name: '英国', worldName: 'United Kingdom', count: 5 },
  { name: '德国', worldName: 'Germany', count: 4 },
  { name: '新西兰', worldName: 'New Zealand', count: 4 },
  { name: '法国', worldName: 'France', count: 3 },
  { name: '韩国', worldName: 'South Korea', count: 3 },
  { name: '马来西亚', worldName: 'Malaysia', count: 3 },
  { name: '泰国', worldName: 'Thailand', count: 2 },
  { name: '荷兰', worldName: 'Netherlands', count: 2 },
  { name: '瑞士', worldName: 'Switzerland', count: 1 },
  { name: '阿联酋', worldName: 'United Arab Emirates', count: 1 },
];

/** 统计汇总（供地图墙统计条使用） */
export const MAP_STATS = {
  provinces: PROVINCE_POINTS.length,
  countries: COUNTRY_POINTS.length,
  members:
    PROVINCE_POINTS.reduce((sum, p) => sum + p.count, 0) +
    COUNTRY_POINTS.reduce((sum, c) => sum + c.count, 0),
} as const;
