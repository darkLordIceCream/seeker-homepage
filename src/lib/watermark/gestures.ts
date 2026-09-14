/**
 * 照片预览手势：单指/鼠标拖动、双指捏合缩放、滚轮/触控板缩放。
 * 位移与缩放统一在「模板像素」坐标系中进行，
 * 由调用方通过 normalize 负责钳制（照片不露边）并通过 onChange 触发重绘。
 */
import type { PhotoTransform } from './render';

export interface GestureHandlers {
  getTransform(): PhotoTransform;
  /** 应用业务钳制（cover 不露边、scale 上下限） */
  normalize(transform: PhotoTransform): PhotoTransform;
  /** CSS px → 模板 px 的换算系数 */
  cssToTemplate(): number;
  /** 照片区域中心（模板 px），缩放围绕该点保持视野 */
  areaCenter: { readonly x: number; readonly y: number };
  minScale: number;
  maxScale: number;
  onChange(transform: PhotoTransform): void;
}

/** 在模板坐标 (px, py) 处缩放 factor 倍：保持该点下的照片内容不动 */
function zoomAt(handlers: GestureHandlers, px: number, py: number, factor: number): void {
  const t0 = handlers.getTransform();
  const scale = Math.min(handlers.maxScale, Math.max(handlers.minScale, t0.scale * factor));
  if (scale === t0.scale) {
    return;
  }
  const { x: cx, y: cy } = handlers.areaCenter;
  const relX = (px - cx - t0.x) / t0.scale;
  const relY = (py - cy - t0.y) / t0.scale;
  handlers.onChange(
    handlers.normalize({ scale, x: px - cx - relX * scale, y: py - cy - relY * scale })
  );
}

/** 绑定手势，返回解绑函数 */
export function attachGestures(el: HTMLElement, handlers: GestureHandlers): () => void {
  const pointers = new Map<number, { x: number; y: number }>();
  // 捏合状态记录上一次双指间距，每次 move 以增量因子缩放
  let pinch: { prevDist: number } | null = null;

  const templatePoint = (clientX: number, clientY: number): { x: number; y: number } => {
    const rect = el.getBoundingClientRect();
    const k = handlers.cssToTemplate();
    return { x: (clientX - rect.left) * k, y: (clientY - rect.top) * k };
  };

  const onPointerDown = (e: PointerEvent): void => {
    if (e.pointerType === 'mouse' && e.button !== 0) {
      return;
    }
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    el.setPointerCapture(e.pointerId);
    if (pointers.size === 2) {
      const pts = [...pointers.values()];
      if (pts[0] && pts[1]) {
        pinch = { prevDist: Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y) || 1 };
      }
    }
  };

  const onPointerMove = (e: PointerEvent): void => {
    const p = pointers.get(e.pointerId);
    if (!p) {
      return;
    }
    const dx = e.clientX - p.x;
    const dy = e.clientY - p.y;
    p.x = e.clientX;
    p.y = e.clientY;

    if (pointers.size === 1) {
      const t0 = handlers.getTransform();
      const k = handlers.cssToTemplate();
      handlers.onChange(handlers.normalize({ ...t0, x: t0.x + dx * k, y: t0.y + dy * k }));
    } else if (pointers.size === 2 && pinch) {
      const pts = [...pointers.values()];
      if (!(pts[0] && pts[1])) {
        return;
      }
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y) || 1;
      const mid = templatePoint((pts[0].x + pts[1].x) / 2, (pts[0].y + pts[1].y) / 2);
      zoomAt(handlers, mid.x, mid.y, dist / pinch.prevDist);
      pinch.prevDist = dist;
    }
  };

  const onPointerEnd = (e: PointerEvent): void => {
    pointers.delete(e.pointerId);
    if (pointers.size < 2) {
      pinch = null;
    }
  };

  const onWheel = (e: WheelEvent): void => {
    e.preventDefault();
    const p = templatePoint(e.clientX, e.clientY);
    const factor = Math.exp(-e.deltaY * (e.deltaMode === 1 ? 0.05 : 0.0015));
    zoomAt(handlers, p.x, p.y, factor);
  };

  el.addEventListener('pointerdown', onPointerDown);
  el.addEventListener('pointermove', onPointerMove);
  el.addEventListener('pointerup', onPointerEnd);
  el.addEventListener('pointercancel', onPointerEnd);
  el.addEventListener('wheel', onWheel, { passive: false });

  return () => {
    el.removeEventListener('pointerdown', onPointerDown);
    el.removeEventListener('pointermove', onPointerMove);
    el.removeEventListener('pointerup', onPointerEnd);
    el.removeEventListener('pointercancel', onPointerEnd);
    el.removeEventListener('wheel', onWheel);
  };
}
