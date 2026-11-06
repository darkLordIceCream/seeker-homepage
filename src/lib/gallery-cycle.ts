/**
 * 画廊轮换引擎（首页门厅 WorksSection 使用；档案馆为静态网格不轮换）。
 * 延续「每槽独立随机间隔轮换」机制，Gallery 3.0 门厅新增四件策展纪律：
 * - 视口门控（gateEl）：区块首次进入视口才起表——Hero 停留再久，翻下来
 *   第一眼永远是定妆组合（t0 = 首次可见，首个换图 ≥ t0 + min）
 * - 两段式换场（twoStage）：旧帧整幅淡出 → 空墙 → 新帧淡入（展厅换灯），
 *   替代大图交叉淡入中点的双曝叠影（复用七周年 PosterSlideshow 的结论）
 * - 全局错峰（exclusive）：同一时刻至多一个槽在换场，撞车者顺延重试
 * - 每槽洗牌袋（shuffle）：小比例带池防连续重复（袋空重洗，重洗后首张
 *   不与上一张相同）。洗牌袋模式不做跨槽查重——门厅两槽比例带互斥，
 *   候选池天然不相交
 *
 * 既有机制保留：双 <img> 交替、预载 decode() 就绪才切换、hover 暂停、
 * document.hidden 暂停 + visibilitychange 校准、reduced-motion 不启动。
 *
 * 槽位 DOM 约定（el 必须是包含 img/button/caption 的容器）：
 *   .gslot > button.shot[data-full...] > img.gimg.is-active + img.gimg
 *           + figcaption.gcap（可选，内含 .gcap-text）
 */
import type { GalleryImage } from '@/data/gallery';

export interface CycleSlot {
  /** 槽位根元素（.gslot） */
  el: HTMLElement;
  /** 该槽的候选池（调用方按槽内比例带过滤，如主作 1.48–1.62 / 竖图 0.657–0.686） */
  pool: readonly GalleryImage[];
}

export interface CycleOptions {
  /** 单次间隔下限 ms（默认 3000） */
  min?: number;
  /** 单次间隔上限 ms（默认 6000） */
  max?: number;
  /** 视口门控区块：首次进入视口（≥20%）才启动轮换；不传则维持加载即启动 */
  gateEl?: HTMLElement;
  /** 两段式换场：旧帧淡出 outMs → 空墙 gapMs → 新帧淡入 inMs */
  twoStage?: { outMs?: number; gapMs?: number; inMs?: number };
  /** 全局错峰：同一时刻至多一个槽在换场 */
  exclusive?: boolean;
  /** 每槽洗牌袋防小池连续重复 */
  shuffle?: boolean;
  /** 换图回调（布局重算等）；入参为槽位与新图 */
  onSwap?: (slotEl: HTMLElement, img: GalleryImage) => void;
  /** 这些槽跳过首轮等待、立即轮换（gateEl 存在时忽略——门控优先保住定妆） */
  immediateEls?: readonly HTMLElement[];
  /**
   * hydration 即随机化首图：启动时立刻对每槽随机换一张（不经门控——
   * 页面加载在 Hero 阶段就换好，观众翻下来看到的第一眼就是随机的，
   * 「点进去就是随机播放」）。各槽按换场时长错峰，互不撞 exclusive。
   */
  randomizeFirst?: boolean;
  /**
   * 门控起表后的首轮换图间隔（观众落定后第一张别挂太久）；
   * 缺省用 min/max。
   */
  firstDelay?: { min: number; max: number };
}

const rand = (min: number, max: number) => min + Math.random() * (max - min);

/** Fisher-Yates 洗牌 */
const shuffled = <T>(items: readonly T[]): T[] => {
  const bag = [...items];
  for (let i = bag.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const a = bag[i]!;
    const b = bag[j]!;
    bag[i] = b;
    bag[j] = a;
  }
  return bag;
};

export function startGalleryCycle(slots: CycleSlot[], opts: CycleOptions = {}): void {
  const min = opts.min ?? 3000;
  const max = opts.max ?? 6000;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }
  if (slots.length === 0) {
    return;
  }

  const OUT_MS = opts.twoStage?.outMs ?? 700;
  const GAP_MS = opts.twoStage?.gapMs ?? 150;
  const IN_MS = opts.twoStage?.inMs ?? 500;
  /** exclusive 的互斥窗口：两段式为全程，交叉淡入按 CSS 过渡 1.1s 计 */
  const SWAP_WINDOW_MS = opts.twoStage ? OUT_MS + GAP_MS + IN_MS : 1100;
  /** exclusive 撞车后的顺延重试间隔 */
  const RETRY_MS = 400;

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

  // —— 洗牌袋（shuffle 模式）：袋空重洗，重洗后首张不与上一张相同 ——
  const bags = new Map<HTMLElement, GalleryImage[]>();
  const lastPicked = new Map<HTMLElement, GalleryImage>();

  const pickShuffled = (slot: CycleSlot): GalleryImage | undefined => {
    let bag = bags.get(slot.el);
    if (!bag || bag.length === 0) {
      bag = shuffled(slot.pool);
      const last = lastPicked.get(slot.el);
      if (last && bag.length > 1 && bag[0]?.src === last.src) {
        bag[0] = bag[1]!;
        bag[1] = last;
      }
      bags.set(slot.el, bag);
    }
    const next = bag.pop();
    if (next) {
      lastPicked.set(slot.el, next);
    }
    return next;
  };

  /** 同屏其他槽正在显示的 src（防重复，仅交叉淡入模式使用） */
  const busySrc = (self: HTMLElement) =>
    new Set([...state.entries()].filter(([el]) => el !== self).map(([, img]) => img.src));

  // —— exclusive 全局互斥：同一时刻至多一个槽在换场 ——
  let swapping = false;

  const swap = (slot: CycleSlot) => {
    const cur = state.get(slot.el);
    let picked: GalleryImage | undefined;
    if (opts.shuffle) {
      picked = pickShuffled(slot);
    } else {
      const busy = busySrc(slot.el);
      // 随机取一张非当前、不与他槽重复的（最多尝试 8 次）
      for (let i = 0; i < 8; i++) {
        const cand = slot.pool[Math.floor(Math.random() * slot.pool.length)];
        if (cand && cand.src !== cur?.src && !busy.has(cand.src)) {
          picked = cand;
          break;
        }
      }
    }
    if (!picked || picked.src === cur?.src) {
      return;
    }
    // 预约制：立即占位，杜绝并发 swap 的同屏重复竞态（预载是异步的）
    state.set(slot.el, picked);
    const next = picked;

    const active = slot.el.querySelector<HTMLImageElement>('img.gimg.is-active');
    const standby = slot.el.querySelector<HTMLImageElement>('img.gimg:not(.is-active)');
    const btn = slot.el.querySelector<HTMLButtonElement>('button.shot');
    const capText = slot.el.querySelector<HTMLElement>('.gcap-text');
    if (!active || !standby || !btn) {
      return;
    }

    standby.src = next.src;
    standby.alt = `${next.alt}（作者：${next.author}）`;

    // decode() 确保像素真正解码就绪后才开始换场——
    // 否则新图会在过渡中途才"显形"，视觉上闪一下
    const commit = () => {
      if (!document.contains(slot.el)) {
        return;
      }
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

    if (opts.twoStage) {
      // —— 两段式换场（展厅换灯）：旧帧整幅淡出 → 空墙 → 新帧淡入 ——
      swapping = true;
      standby
        .decode()
        .then(() => {
          if (!document.contains(slot.el)) {
            return;
          }
          // 空墙纪律：画框（阴影/描边）随旧画一起退场，空墙期不残留幽灵框
          slot.el.classList.add('is-swapping');
          // 旧帧整幅淡出：页面底透出 = 空墙（避免交叉淡入中点的双曝叠影）
          active.style.transition = `opacity ${OUT_MS}ms ease`;
          active.style.opacity = '0';
          window.setTimeout(() => {
            if (!document.contains(slot.el)) {
              return;
            }
            // 新帧淡入（此刻旧帧已全隐，无双曝）
            standby.style.transition = `opacity ${IN_MS}ms ease`;
            standby.classList.add('is-active');
            active.classList.remove('is-active');
            commit();
            window.setTimeout(() => {
              // 收尾：清内联样式、画框随新画回场
              active.style.transition = '';
              active.style.opacity = '';
              standby.style.transition = '';
              slot.el.classList.remove('is-swapping');
              swapping = false;
            }, IN_MS);
          }, OUT_MS + GAP_MS);
        })
        .catch(() => {
          // 解码失败（加载失败/槽已移除）：还原预约，等下一轮
          slot.el.classList.remove('is-swapping');
          swapping = false;
          if (cur) {
            state.set(slot.el, cur);
          }
        });
      return;
    }

    // —— 交叉淡入（旧行为，twoStage 未传时）——
    swapping = true;
    standby
      .decode()
      .then(() => {
        standby.classList.add('is-active');
        active.classList.remove('is-active');
        commit();
      })
      .catch(() => {
        if (cur) {
          state.set(slot.el, cur);
        }
      })
      .finally(() => {
        window.setTimeout(() => {
          swapping = false;
        }, SWAP_WINDOW_MS);
      });
  };

  const timers = new Map<HTMLElement, number>();
  let started = false;

  const fire = (slot: CycleSlot) => {
    if (!document.contains(slot.el)) {
      return;
    }
    if (document.hidden) {
      // 隐藏期间不换场，回前台由 visibilitychange 统一校准
      return;
    }
    if (opts.exclusive && swapping) {
      schedule(slot, false, RETRY_MS);
      return;
    }
    swap(slot);
    schedule(slot);
  };

  const schedule = (slot: CycleSlot, immediate = false, delay?: number) => {
    if (!started) {
      return;
    }
    const t = window.setTimeout(() => fire(slot), delay ?? (immediate ? 0 : rand(min, max)));
    timers.set(slot.el, t);
  };

  // —— 启动：gateEl 存在时等区块首次进入视口（t0），否则加载即启动 ——
  const startAll = () => {
    if (started) {
      return;
    }
    started = true;
    const immediate = new Set(opts.immediateEls ?? []);
    for (const slot of slots) {
      // 首轮换图用 firstDelay（观众落定后第一张别挂太久），此后回归 min/max
      const d =
        opts.firstDelay && immediate.has(slot.el)
          ? rand(opts.firstDelay.min, opts.firstDelay.max)
          : undefined;
      schedule(slot, immediate.has(slot.el), d);
    }
  };

  if (opts.gateEl && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      entries => {
        if (entries.some(e => e.isIntersecting)) {
          io.disconnect();
          startAll();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(opts.gateEl);
  } else {
    startAll();
  }

  // hover 暂停该槽，移出恢复（门控未启动时 schedule 直接跳过）
  for (const slot of slots) {
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
    if (!document.hidden && started) {
      for (const slot of slots) {
        const t = timers.get(slot.el);
        if (t) {
          window.clearTimeout(t);
        }
        schedule(slot);
      }
    }
  });

  // —— hydration 即随机化首图：「点进去就是随机播放」——
  // 页面加载时（多半还在 Hero）就对每槽随机换一张，观众翻下来看到的
  // 第一眼已是随机结果。各槽按换场全程时长错峰，避免互斥撞车。
  if (opts.randomizeFirst) {
    slots.forEach((slot, i) => {
      window.setTimeout(
        () => {
          if (document.contains(slot.el)) {
            swap(slot);
          }
        },
        i * (SWAP_WINDOW_MS + 100),
      );
    });
  }
}
