/**
 * 【06 留光成物 · 巨片轮播】驻留期自动轮播逻辑。
 * 由 PosterSlideshow 组件在接近板块 ~600px 时动态 import（页面初始零成本）。
 * 展示池 = manifest 全量（确定性洗牌已烘焙进数组顺序），
 * 任一时刻仅预取当前 ±2 张；悬停/聚焦/切后台/滚离板块即暂停。
 * reduced-motion 下组件不会 import 本模块（保持静态首帧）。
 *
 * 滚动引擎只编排入场与板块高度，驻留期不干预本模块——
 * 引擎写 [data-poster-stage] 外层透明度，交叉淡入走内部 <img> 类切换，互不冲突。
 */
import { POSTERS } from '@/data/anniversary/posters';

/** 每帧驻留时长（含交叉淡入之外的全部停留） */
const INTERVAL_MS = 4500;
/** 换帧两段各自的时长：旧帧淡出 / 新帧淡入（须与组件内 .pss-img 的 transition 一致） */
const FADE_MS = 450;
/** 向前预取张数 */
const PRELOAD_AHEAD = 2;
/** 署名切换的微淡出时长 */
const CAP_SWAP_MS = 180;

const pad3 = (n: number): string => String(n).padStart(3, '0');

export function initPosterSlideshow(): void {
  const root = document.querySelector<HTMLElement>('[data-poster-slideshow]');
  if (!root || POSTERS.length < 2) {
    return;
  }

  const slotA = root.querySelector<HTMLImageElement>('[data-poster-img]');
  const slotB = root.querySelector<HTMLImageElement>('[data-poster-img-b]');
  const noEl = root.querySelector<HTMLElement>('[data-poster-no]');
  const authorEl = root.querySelector<HTMLElement>('[data-poster-author]');
  const capEl = root.querySelector<HTMLElement>('[data-poster-cap]');
  const barEl = root.querySelector<HTMLElement>('[data-poster-bar]');
  if (!slotA || !slotB || !noEl || !authorEl || !capEl || !barEl) {
    return;
  }

  let index = 0;
  let front: HTMLImageElement = slotA;
  let back: HTMLImageElement = slotB;
  let switching = false;
  let timer = 0;
  let inView = false;
  let hovered = false;
  let { hidden } = document;
  const failed = new Set<number>();

  const playing = (): boolean => inView && !hovered && !hidden;

  const preload = (i: number): void => {
    const poster = POSTERS[i % POSTERS.length];
    if (poster) {
      const img = new Image();
      img.src = poster.src;
    }
  };

  const schedule = (): void => {
    window.clearTimeout(timer);
    if (playing()) {
      timer = window.setTimeout(() => {
        void advance();
      }, INTERVAL_MS);
    }
  };

  const updateCaption = (i: number): void => {
    const poster = POSTERS[i];
    if (!poster) {
      return;
    }
    barEl.style.width = `${(((i + 1) / POSTERS.length) * 100).toFixed(2)}%`;
    capEl.classList.add('is-swap');
    window.setTimeout(() => {
      noEl.textContent = `NO.${pad3(poster.no)}`;
      authorEl.textContent = `@${poster.author}`;
      capEl.classList.remove('is-swap');
    }, CAP_SWAP_MS);
  };

  async function advance(): Promise<void> {
    if (switching) {
      return;
    }
    switching = true;
    // 跳过加载失败的帧；失败集合兜底防止全体失败时空转
    let next = index;
    for (let tries = 0; tries < POSTERS.length; tries++) {
      next = (next + 1) % POSTERS.length;
      if (!failed.has(next)) {
        break;
      }
    }
    const poster = POSTERS[next];
    if (!poster) {
      switching = false;
      return;
    }
    back.src = poster.src;
    back.alt = `Seeker 七周年纪念海报 · @${poster.author}`;
    try {
      await back.decode();
    } catch {
      failed.add(next);
      switching = false;
      schedule();
      return;
    }
    // 两段式换帧（暗房换照）：旧帧先整幅淡出，新帧再淡入——
    // 不用交叉淡入，横竖幅混排时新旧同框会叠出拼贴感、署名归属混淆
    front.classList.add('is-outgoing');
    window.setTimeout(() => {
      front.classList.remove('is-current', 'is-outgoing');
      back.classList.add('is-incoming');
      window.setTimeout(() => {
        back.classList.remove('is-incoming');
        back.classList.add('is-current');
        back.removeAttribute('aria-hidden');
        front.setAttribute('aria-hidden', 'true');
        const prev = front;
        front = back;
        back = prev;
        index = next;
        switching = false;
        updateCaption(index);
        for (let k = 1; k <= PRELOAD_AHEAD; k++) {
          preload(index + k);
        }
        schedule();
      }, FADE_MS);
    }, FADE_MS);
  }

  root.addEventListener('pointerenter', () => {
    hovered = true;
    schedule();
  });
  root.addEventListener('pointerleave', () => {
    hovered = false;
    schedule();
  });
  root.addEventListener('focusin', () => {
    hovered = true;
    schedule();
  });
  root.addEventListener('focusout', () => {
    hovered = false;
    schedule();
  });
  document.addEventListener('visibilitychange', () => {
    hidden = document.hidden;
    schedule();
  });
  const io = new IntersectionObserver(
    entries => {
      inView = entries.some(e => e.isIntersecting);
      schedule();
    },
    { threshold: 0.15 },
  );
  io.observe(root);

  // 初始就绪：进度线归位 + 预热前两帧
  barEl.style.width = `${((1 / POSTERS.length) * 100).toFixed(2)}%`;
  for (let k = 1; k <= PRELOAD_AHEAD; k++) {
    preload(k);
  }
}
