/**
 * 【06 留光成物 · 巨片轮播】驻留期自动轮播 + 缓右漂移。
 * 由 PosterSlideshow 组件在接近板块 ~600px 时动态 import（页面初始零成本）。
 * 展示池 = manifest 全量（确定性洗牌已烘焙进数组顺序），
 * 任一时刻仅预取当前 ±2 张；切后台/滚离板块即暂停（不做悬停暂停——
 * 用户停留观看时鼠标停在大海报上，悬停冻结反而让轮播「看起来坏了」）。
 * reduced-motion 下组件不会 import 本模块（保持静态首帧）。
 *
 * 与滚动引擎的分工：引擎写 [data-poster-stage]（入场左飘入 / 离场加速右飘出，
 * 滚动驱动），本模块写 [data-poster-drift]（驻留缓右漂移，时间驱动）——
 * 两个写入面分层，互不覆盖。换帧时漂移归零（每张照片从基线重新起漂）。
 */
import { POSTERS } from '@/data/anniversary/posters';

/** 每帧驻留时长（含换帧之外的全部停留） */
const INTERVAL_MS = 2000;
/** 换帧滑动时长（旧帧滑出与新帧滚入同时进行；与 CSS transition 时长一致） */
const SWAP_MS = 550;
/** 向前预取张数 */
const PRELOAD_AHEAD = 2;
/** 署名切换的微淡出时长 */
const CAP_SWAP_MS = 180;
/** 换帧计入驻留周期：schedule 延迟 = INTERVAL_MS - SWAP_MS，严格「每 INTERVAL_MS 一张」 */
const SWAP_TOTAL_MS = SWAP_MS;
/** 单帧解码等待上限：防止个别环境 decode() 永不返回把轮播锁死 */
const DECODE_TIMEOUT_MS = 1500;
/** 缓右漂移速度（px/ms ≈ 13px/s）：钉住时照片缓缓向右飘 */
const DRIFT_SPEED = 0.013;
/** 漂移上限（后台计时失真兜底，换帧即归零） */
const DRIFT_MAX = 160;

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
  const driftEl = root.querySelector<HTMLElement>('[data-poster-drift]');
  if (!slotA || !slotB || !noEl || !authorEl || !capEl || !barEl) {
    return;
  }

  let index = 0;
  let front: HTMLImageElement = slotA;
  let back: HTMLImageElement = slotB;
  let switching = false;
  let timer = 0;
  let inView = false;
  let { hidden } = document;
  const failed = new Set<number>();

  const playing = (): boolean => inView && !hidden;

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
      timer = window.setTimeout(
        () => {
          void advance();
        },
        Math.max(200, INTERVAL_MS - SWAP_TOTAL_MS),
      );
    }
  };

  /* —— 缓右漂移（时间驱动）：播放中匀速右移，暂停冻结，换帧归零 —— */
  let drift = 0;
  let lastT = 0;
  const driftLoop = (now: number): void => {
    if (lastT === 0) {
      lastT = now;
    }
    if (playing() && driftEl && !switching) {
      drift = Math.min(drift + (now - lastT) * DRIFT_SPEED, DRIFT_MAX);
      driftEl.style.transform = `translate3d(${drift.toFixed(1)}px, 0, 0)`;
    }
    lastT = now;
    requestAnimationFrame(driftLoop);
  };
  requestAnimationFrame(driftLoop);

  const resetDrift = (): void => {
    drift = 0;
    if (driftEl) {
      driftEl.style.transform = 'translate3d(0, 0, 0)';
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
    // decode() 等待加超时上限：个别环境 decode 可能永不返回（卡死轮播），
    // 超时则照常换帧（滑动动画还能给解码留缓冲）；失败帧照旧跳过
    const decoded = ((): Promise<void> => {
      if (typeof back.decode === 'function') {
        return back.decode();
      }
      if (!back.complete || back.naturalWidth === 0) {
        return new Promise<void>((resolve, reject) => {
          back.addEventListener('load', () => resolve(), { once: true });
          back.addEventListener('error', () => reject(new Error('poster load failed')), {
            once: true,
          });
        });
      }
      return Promise.resolve();
    })();
    try {
      await Promise.race([decoded, new Promise(r => window.setTimeout(r, DECODE_TIMEOUT_MS))]);
    } catch {
      failed.add(next);
      switching = false;
      schedule();
      return;
    }
    // 滑动换帧（走带）：旧帧加速右滑出、新帧自左加速滚入——与板块
    // 「光向右流动」的运动语言一致（入场左飘入、驻留缓右漂、离场右飘出）。
    // 漂移位置守恒：放映层此刻带着漂移 d，归零会让可见画面左跳 d px——
    // 先把旧帧瞬置 +d 抵消（视觉不变），再让两帧从补偿后的位置起滑
    const d = drift;
    resetDrift();
    if (d > 0) {
      front.style.transition = 'none';
      front.style.transform = `translateX(${d.toFixed(1)}px)`;
    }
    back.classList.add('is-entering');
    void back.offsetWidth; // 固定瞬置起点（旧帧补偿位 / 新帧左缘外），再开过渡
    if (d > 0) {
      front.style.transition = '';
      front.style.transform = '';
    }
    front.classList.remove('is-current');
    front.classList.add('is-outgoing');
    back.classList.remove('is-entering');
    back.classList.add('is-current');
    window.setTimeout(() => {
      front.classList.remove('is-outgoing'); // 回基础态（透明、瞬置，不可见）
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
    }, SWAP_MS);
  }

  // 不做悬停暂停：用户停留观看时鼠标多半停在大海报上，悬停即冻结
  // 会让「停留反而看不到轮播」（用户实测反馈）。仅保留两类暂停——
  // 切后台（省资源）与滚离板块（不在视口）
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
