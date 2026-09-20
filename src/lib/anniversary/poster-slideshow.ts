/**
 * 【06 留光成物 · 巨片走带】可抓取拖动的循环放映带（物理运动模型）。
 * 由 PosterSlideshow 组件在接近板块 ~600px 时动态 import（页面初始零成本）。
 *
 * 手感目标：抓住照片拖动 1:1 跟手；松手带惯性、轻微阻尼弹簧吸附到格；
 * 停留 2s 自动拨动一格——自动与拖动共用同一套弹簧物理（rAF 逐帧写
 * transform，零 CSS transition，杜绝机械过渡感）。
 *
 * 结构：track 内 3 个槽位组成无限循环带。槽 j 持有格号 gi[j]
 * （真实格位，可无限增减；照片索引 = 格号 mod N），槽的带位置 =
 * gi[j] * step + band。每帧把窗口外最远的槽重派到缺失格（ensureWindow）。
 *
 * 展示池 = manifest 全量（确定性洗牌已烘焙进数组顺序）；
 * 切后台/滚离板块暂停自动拨动（拖拽照常）；不做悬停暂停——
 * 用户停留观看时鼠标停在大海报上，悬停冻结反而像坏了（实测反馈）。
 * reduced-motion 下组件不会 import 本模块（保持静态首帧）。
 */
import { POSTERS } from '@/data/anniversary/posters';

/** 自动拨动节拍（无交互多久拨一格） */
const AUTO_MS = 2000;
/** 弹簧角频率（刚度） */
const OMEGA = 9;
/** 阻尼比：<1 轻微过冲回弹，抓照片的「落位」感 */
const ZETA = 0.78;
/** 松手速度投影时长（s）：速度换算成额外位移的预估 */
const FLING_LEAD = 0.15;
/** 自动拨动的初速冲量（px/s）：像手指轻拨一下 */
const AUTO_NUDGE_V = 420;
/** 向前预取张数 */
const PRELOAD_AHEAD = 2;
/** 署名切换的微淡出时长 */
const CAP_SWAP_MS = 180;

const mod = (n: number, m: number): number => ((n % m) + m) % m;
const pad3 = (n: number): string => String(n).padStart(3, '0');

export function initPosterSlideshow(): void {
  const root = document.querySelector<HTMLElement>('[data-poster-slideshow]');
  const track = document.querySelector<HTMLElement>('[data-poster-track]');
  if (!root || !track || POSTERS.length < 2) {
    return;
  }
  const N = POSTERS.length;

  const slots = [...track.querySelectorAll<HTMLImageElement>('[data-poster-slot]')];
  const noEl = root.querySelector<HTMLElement>('[data-poster-no]');
  const authorEl = root.querySelector<HTMLElement>('[data-poster-author]');
  const capEl = root.querySelector<HTMLElement>('[data-poster-cap]');
  const barEl = root.querySelector<HTMLElement>('[data-poster-bar]');
  if (slots.length < 3 || !noEl || !authorEl || !capEl || !barEl) {
    return;
  }

  let step = track.clientWidth || 1;
  /** 带偏移（px）：带位置 = 格号 * step + band，向右为正 */
  let band = 0;
  let vel = 0;
  /** 当前对齐格号（真实格位，无限增减） */
  let curG = 0;
  /** 弹簧目标（带偏移）；null = 无进行中的吸附 */
  let target: number | null = null;
  let dragging = false;
  let pointerId = -1;
  let startX = 0;
  let bandStart = 0;
  const samples: { t: number; x: number }[] = [];
  const failed = new Set<number>();
  let inView = false;
  let { hidden } = document;
  let idleT0 = performance.now();

  /** 槽 j 持有的格号；初始：槽0 = 格0（SSR 首帧已渲染 POSTERS[0]） */
  const gi = [0, -1, 1];
  /** 槽 j 当前绑定的照片索引；-1 = 未绑定 */
  const slotIdx = [0, -1, -1];

  const posterAt = (g: number): number => mod(g, N);

  function setSlotPoster(j: number, idx: number): void {
    if (slotIdx[j] === idx) {
      return;
    }
    slotIdx[j] = idx;
    const poster = POSTERS[idx];
    const img = slots[j];
    if (!poster || !img) {
      return;
    }
    img.onerror = () => {
      failed.add(idx);
    };
    img.src = poster.src;
    img.alt = `Seeker 七周年纪念海报 · @${poster.author}`;
  }

  const apply = (): void => {
    for (let j = 0; j < slots.length; j++) {
      const g = gi[j];
      const img = slots[j];
      if (g !== undefined && img) {
        img.style.transform = `translate3d(${(g * step + band).toFixed(1)}px, 0, 0)`;
      }
    }
  };

  /** 窗口维护：保证 [g0-1, g0+1] 三格都有槽；把窗口外最远的槽重派到缺失格 */
  function ensureWindow(): void {
    const g0 = Math.round(-band / step);
    const need = [g0 - 1, g0, g0 + 1];
    const missing = need.filter(g => !gi.includes(g));
    if (missing.length === 0) {
      return;
    }
    const spare = gi
      .map((g, j) => ({ g, j }))
      .filter(x => !need.includes(x.g))
      .sort((a, b) => Math.abs(b.g - g0) - Math.abs(a.g - g0))
      .map(x => x.j);
    for (const g of missing) {
      const j = spare.pop();
      if (j === undefined) {
        break;
      }
      gi[j] = g;
      setSlotPoster(j, posterAt(g));
    }
  }

  const updateCaption = (idx: number): void => {
    const poster = POSTERS[idx];
    if (!poster) {
      return;
    }
    barEl.style.width = `${(((idx + 1) / N) * 100).toFixed(2)}%`;
    capEl.classList.add('is-swap');
    window.setTimeout(() => {
      noEl.textContent = `NO.${pad3(poster.no)}`;
      authorEl.textContent = `@${poster.author}`;
      capEl.classList.remove('is-swap');
    }, CAP_SWAP_MS);
  };

  const preload = (idx: number): void => {
    const k = mod(idx, N);
    if (failed.has(k)) {
      return;
    }
    const poster = POSTERS[k];
    if (poster) {
      const img = new Image();
      img.src = poster.src;
    }
  };

  function onSettle(): void {
    curG = Math.round(-band / step);
    const idx = posterAt(curG);
    updateCaption(idx);
    for (let k = -PRELOAD_AHEAD; k <= PRELOAD_AHEAD; k++) {
      preload(curG + k);
    }
    idleT0 = performance.now();
  }

  // —— 拖拽：1:1 跟手，pointer 事件统一鼠标/触摸 ——
  track.addEventListener('pointerdown', e => {
    dragging = true;
    pointerId = e.pointerId;
    startX = e.clientX;
    bandStart = band;
    vel = 0;
    target = null;
    samples.length = 0;
    samples.push({ t: performance.now(), x: e.clientX });
    track.setPointerCapture(e.pointerId);
    track.classList.add('is-grabbing');
  });
  track.addEventListener('pointermove', e => {
    if (!dragging || e.pointerId !== pointerId) {
      return;
    }
    band = bandStart + (e.clientX - startX);
    const now = performance.now();
    samples.push({ t: now, x: e.clientX });
    const oldest = samples[0];
    while (oldest && samples.length > 2 && now - oldest.t > 120) {
      samples.shift();
    }
  });
  const endDrag = (e: PointerEvent): void => {
    if (!dragging || e.pointerId !== pointerId) {
      return;
    }
    dragging = false;
    track.classList.remove('is-grabbing');
    // 速度：最近 ≤120ms 的样本均速
    const now = performance.now();
    const recent = samples.filter(s => now - s.t <= 120);
    const s0 = recent[0] ?? samples[0];
    const sN = samples[samples.length - 1];
    if (s0 && sN && sN.t > s0.t) {
      vel = (sN.x - s0.x) / ((sN.t - s0.t) / 1000);
    } else {
      vel = 0;
    }
    // 吸附目标：当前位置 + 速度投影，取最近格
    target = -Math.round(-(band + vel * FLING_LEAD) / step) * step;
  };
  track.addEventListener('pointerup', endDrag);
  track.addEventListener('pointercancel', endDrag);

  // —— 自动拨动暂停：切后台 / 滚离板块（拖拽不受限） ——
  document.addEventListener('visibilitychange', () => {
    hidden = document.hidden;
    if (!hidden) {
      idleT0 = performance.now();
    }
  });
  const io = new IntersectionObserver(
    entries => {
      const wasOut = !inView;
      inView = entries.some(e => e.isIntersecting);
      if (inView && wasOut) {
        idleT0 = performance.now();
      }
    },
    { threshold: 0.15 },
  );
  io.observe(track);

  window.addEventListener('resize', () => {
    const w = track.clientWidth || 1;
    curG = Math.round(-band / step);
    step = w;
    band = -curG * step;
    if (target !== null) {
      target = band;
    }
  });

  // —— 物理循环 ——
  const w2 = OMEGA * OMEGA;
  const damp = 2 * ZETA * OMEGA;
  let last = 0;
  const tick = (now: number): void => {
    if (last === 0) {
      last = now;
    }
    const dt = Math.min(0.032, (now - last) / 1000);
    last = now;

    if (!dragging) {
      if (target !== null) {
        // 吸附弹簧：轻微欠阻尼，落位带一点回弹
        vel += ((target - band) * w2 - vel * damp) * dt;
        band += vel * dt;
        if (Math.abs(target - band) < 0.5 && Math.abs(vel) < 8) {
          band = target;
          vel = 0;
          target = null;
          onSettle();
        }
      } else if (inView && !hidden && now - idleT0 > AUTO_MS) {
        // 自动拨动：内容右移一格（下一帧自左滚入），给一个「轻拨」初速
        target = band - step;
        vel = -AUTO_NUDGE_V;
      }
    }

    ensureWindow();
    apply();
    requestAnimationFrame(tick);
  };

  // 初始就绪：填满窗口 + 进度线归位 + 预热
  ensureWindow();
  setSlotPoster(1, posterAt(gi[1] ?? 0));
  setSlotPoster(2, posterAt(gi[2] ?? 0));
  apply();
  barEl.style.width = `${((1 / N) * 100).toFixed(2)}%`;
  for (let k = -PRELOAD_AHEAD; k <= PRELOAD_AHEAD; k++) {
    preload(k);
  }
  idleT0 = performance.now();
  requestAnimationFrame(tick);
}
