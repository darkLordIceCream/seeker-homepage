/**
 * 照片预览手势：单指/鼠标拖动、双指捏合缩放、滚轮/触控板缩放。
 * 本模块只做指针簿记与「CSS px → 模板 px」换算；
 * 全部变换语义（基准适配、锚点、钳制）由调用方通过 drag / zoomAt 实现。
 */
export interface GestureHandlers {
  /** 单指拖动产生的位移（模板 px） */
  drag(dx: number, dy: number): void;
  /** 以模板坐标 (px, py) 为锚点缩放 factor 倍（保持该点内容不动） */
  zoomAt(px: number, py: number, factor: number): void;
  /** CSS px → 模板 px 的换算系数 */
  cssToTemplate(): number;
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
      const k = handlers.cssToTemplate();
      handlers.drag(dx * k, dy * k);
    } else if (pointers.size === 2 && pinch) {
      const pts = [...pointers.values()];
      if (!(pts[0] && pts[1])) {
        return;
      }
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y) || 1;
      const mid = templatePoint((pts[0].x + pts[1].x) / 2, (pts[0].y + pts[1].y) / 2);
      handlers.zoomAt(mid.x, mid.y, dist / pinch.prevDist);
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
    handlers.zoomAt(p.x, p.y, factor);
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
