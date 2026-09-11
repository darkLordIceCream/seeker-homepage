/**
 * 《时间的故事》活动图片尺寸清单(R2 远程素材)查询。
 *
 * 活动照片存于 R2(不进 git、不走 astro:assets),本清单记录每张图的
 * 像素尺寸,用于:① 画廊排版分型(竖幅/横幅/长卷判断)② <img> 的
 * width/height 属性,防止图片加载时布局抖动(CLS)。
 *
 * 数据由迁移脚本生成于 activity-image-meta.ts;新增期数时,上传图片后
 * 按相同结构补充条目(key 为相对 bucket 根的路径)。
 */
import { ACTIVITY_IMAGE_META } from './activity-image-meta';

export interface ActivityImageDims {
  w: number;
  h: number;
}

/** 按 R2 路径或完整 URL 查询图片尺寸;清单中不存在时返回 undefined */
export function activityImageDims(url: string): ActivityImageDims | undefined {
  let path = url;
  if (url.startsWith('http://') || url.startsWith('https://')) {
    try {
      path = new URL(url).pathname;
    } catch {
      return undefined;
    }
  }
  const key = path.replace(/^\/+/, '');
  const hit = ACTIVITY_IMAGE_META[key];
  return hit ? { ...hit } : undefined;
}
