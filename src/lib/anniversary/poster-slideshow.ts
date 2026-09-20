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
/** 换帧两段各自的时长：旧帧淡出 / 新帧淡入（须与组件内 .pss-img 的 transition 一致） */
const FADE_MS = 450;
/** 向前预取张数 */
const PRELOAD_AHEAD = 2;
/** 署名切换的微淡出时长 */
const CAP_SWAP_MS = 180;
/** 换帧全程（淡出+淡入），从驻留周期内扣除，保证「每 INTERVAL_MS 一张」 */
const SWAP_TOTAL_MS = FADE_MS * 2;
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
    // 超时则照常换帧（fade 的 450ms 还能给解码留缓冲）；失败帧照旧跳过
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
    // 两段式换帧（暗房换照）：旧帧先整幅淡出，新帧再淡入——
    // 不用交叉淡入，横竖幅混排时新旧同框会叠出拼贴感、署名归属混淆。
    // 漂移在「空场瞬间」（旧帧已隐、新帧未现）归零：若在新帧可见后才归零，
    // 整个放映层会向左突跳一截（用户实测踩坑）
    front.classList.add('is-outgoing');
    window.setTimeout(() => {
      resetDrift();
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
