/**
 * Gallery 2.0「丝带呼吸」轮换引擎（首页 WorksSection 使用）。
 * 延续上一版展墙「每槽 3~6s 独立随机间隔轮换」的机制，工程升级：
 * - 双 <img> 交叉淡入：下一张预载完成后才切换，避免半图
 * - hover 暂停该槽、document.hidden 全局暂停、prefers-reduced-motion 不启动
 * - 预约制防同屏重复：换图前查重其他槽的当前 src，选定后立即占位（杜绝并发竞态）
 * - 每次换图同步更新灯箱触发按钮的 data-full/data-title/data-author/aria-label
 *   与图注文本，并回调 onSwap 供布局重算（丝带行几何）
 *
 * 槽位 DOM 约定（el 必须是包含 img/button/caption 的容器）：
 *   .gslot > button.shot[data-full...] > img.gimg.is-active + img.gimg
 *           + figcaption.gcap（可选，内含 .gcap-text）
 */
import type { GalleryImage } from '@/data/gallery';

export interface CycleSlot {
  /** 槽位根元素（.gslot） */
  el: HTMLElement;
  /** 该槽的候选池 */
  pool: readonly GalleryImage[];
}

export interface CycleOptions {
  /** 单次间隔下限 ms（默认 3000） */
  min?: number;
  /** 单次间隔上限 ms（默认 6000） */
  max?: number;
  /** 换图回调（布局重算等）；入参为槽位与新图 */
  onSwap?: (slotEl: HTMLElement, img: GalleryImage) => void;
  /** 这些槽跳过首轮等待、立即轮换（如移动端主视觉需尽快换到断点专属池） */
  immediateEls?: readonly HTMLElement[];
}

const rand = (min: number, max: number) => min + Math.random() * (max - min);

export function startGalleryCycle(slots: CycleSlot[], opts: CycleOptions = {}): void {
  const min = opts.min ?? 3000;
  const max = opts.max ?? 6000;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }
  if (slots.length === 0) {
    return;
  }

  /** 每槽当前图（引擎内部状态） */
  const state = new Map<HTMLElement, GalleryImage>();
  for (const s of slots) {
    const active = s.el.querySelector<HTMLImageElement>('img.gimg.is-active');
    const src = active?.getAttribute('src') ?? '';
    const img = s.pool.find(i => i.src === src);
    if (img) {
      state.set(s.el, img);
    }
  }

  /** 同屏其他槽正在显示的 src（防重复） */
  const busySrc = (self: HTMLElement) =>
    new Set([...state.entries()].filter(([el]) => el !== self).map(([, img]) => img.src));

  const swap = (slot: CycleSlot) => {
    const cur = state.get(slot.el);
    const busy = busySrc(slot.el);
    // 随机取一张非当前、不与他槽重复的（最多尝试 8 次）
    let next: GalleryImage | undefined;
    for (let i = 0; i < 8; i++) {
      const cand = slot.pool[Math.floor(Math.random() * slot.pool.length)];
      if (cand && cand.src !== cur?.src && !busy.has(cand.src)) {
        next = cand;
        break;
      }
    }
    if (!next) {
      return;
    }
    // 预约制：立即占位，杜绝并发 swap 的同屏重复竞态（预载是异步的）
    state.set(slot.el, next);

    const active = slot.el.querySelector<HTMLImageElement>('img.gimg.is-active');
    const standby = slot.el.querySelector<HTMLImageElement>('img.gimg:not(.is-active)');
    const btn = slot.el.querySelector<HTMLButtonElement>('button.shot');
    const capText = slot.el.querySelector<HTMLElement>('.gcap-text');
    if (!active || !standby || !btn) {
      return;
    }

    standby.src = next.src;
    standby.alt = `${next.alt}（作者：${next.author}）`;

    // decode() 确保像素真正解码就绪后才开始交叉淡入——
    // 否则新图会在淡入中途才"显形"，视觉上闪一下（抖感来源之一）
    const apply = () => {
      if (!document.contains(slot.el)) {
        return;
      }
      standby.classList.add('is-active');
      active.classList.remove('is-active');
      // 灯箱触发按钮与图注跟随当前图
      btn.dataset.full = next.src;
      btn.dataset.title = next.title ?? '';
      btn.dataset.author = next.author;
      btn.setAttribute(
        'aria-label',
        `放大查看 ${next.title ? `《${next.title}》 @${next.author}` : `@${next.author}`}`,
      );
      if (capText) {
        capText.textContent = next.title ? `《${next.title}》 @${next.author}` : `@${next.author}`;
      }
      opts.onSwap?.(slot.el, next);
    };
    standby
      .decode()
      .then(apply)
      .catch(() => {
        // 解码失败（加载失败/槽已移除）：还原预约，等下一轮
        if (cur) {
          state.set(slot.el, cur);
        }
      });
  };

  const timers = new Map<HTMLElement, number>();

  const schedule = (slot: CycleSlot, immediate = false) => {
    const t = window.setTimeout(
      () => {
        if (document.hidden || !document.contains(slot.el)) {
          schedule(slot, true);
          return;
        }
        swap(slot);
        schedule(slot);
      },
      immediate ? 0 : rand(min, max),
    );
    timers.set(slot.el, t);
  };

  const immediate = new Set(opts.immediateEls ?? []);
  for (const slot of slots) {
    schedule(slot, immediate.has(slot.el));
    // hover 暂停该槽，移出恢复
    slot.el.addEventListener('mouseenter', () => {
      const t = timers.get(slot.el);
      if (t) {
        window.clearTimeout(t);
      }
    });
    slot.el.addEventListener('mouseleave', () => schedule(slot));
  }

  // 页面回到前台时把各槽定时器重新校准（隐藏期间的轮换已顺延）
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      for (const slot of slots) {
        const t = timers.get(slot.el);
        if (t) {
          window.clearTimeout(t);
        }
        schedule(slot);
      }
    }
  });
}
