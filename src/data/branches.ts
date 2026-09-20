// 首页「小组简介」分部数据：胶囊列表与地图圆点共用此单一来源。
// 新增分部只需在此追加一条；lngLat 为地图上代表点的 [经度, 纬度]。

export interface Branch {
  /** DOM 联动用的稳定 id（胶囊 data-branch / 圆点 data-branch） */
  id: string;
  /** 胶囊文案 */
  label: string;
  /** tooltip 里的城市说明 */
  cities: string;
  /** 地图定位点 [lng, lat] */
  lngLat: [number, number];
}

export const BRANCHES: Branch[] = [
  { id: 'guangfo', label: '广佛分部', cities: '广州 / 佛山', lngLat: [113.264, 23.129] },
  { id: 'jinling', label: '金陵分部', cities: '南京', lngLat: [118.797, 32.06] },
  { id: 'shaanxi', label: '陕西分部', cities: '西安', lngLat: [108.94, 34.342] },
  { id: 'shanxi', label: '山西分部', cities: '太原', lngLat: [112.549, 37.87] },
  { id: 'wuhan', label: '武汉分部', cities: '武汉', lngLat: [114.306, 30.593] },
  { id: 'anhui', label: '安徽分部', cities: '合肥', lngLat: [117.227, 31.821] },
  { id: 'hainan', label: '海南分部', cities: '海口', lngLat: [110.32, 20.031] },
  { id: 'yunnan', label: '云南分部', cities: '昆明', lngLat: [102.833, 24.881] },
  { id: 'chuanyu', label: '川渝分部', cities: '成都 / 重庆', lngLat: [104.066, 30.572] },
  { id: 'guangxi', label: '广西分部', cities: '南宁', lngLat: [108.32, 22.821] },
  { id: 'shanghai', label: '上海分部', cities: '上海', lngLat: [121.474, 31.23] },
];
