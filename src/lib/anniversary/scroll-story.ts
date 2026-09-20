/**
 * 【SEEKER 07 · Scroll Story 引擎】
 *
 * 滚动即时间轴：每个 Cinematic 章节是「一段 track 高度 + 一个 sticky 舞台」，
 * 本引擎把滚动位置换算为场景进度 0 → 1，交给场景映射函数写入
 * transform / opacity（唯一的样式写入面，主题与照片零接触）。
 *
 * 渐进增强契约：
 * - 仅在「JS 可用 + prefers-reduced-motion 未开启」时初始化；
 *   否则什么都不做，页面保持现有静态形态（内容完整可读）。
 * - 初始化时给场景根加 `.story-on`（track 高度由该类启用），
 *   并在同一个同步流程内完成首次 apply——无闪烁窗口。
 *
 * 性能约定：
 * - 几何量（track 顶部/可滚动距离）只在 measure 时读取（init / resize /
 *   window load / 根元素尺寸变化），滚动帧内零布局读取；
 * - 滚动仅置 dirty 标记，写入在 rAF 中统一执行；
 * - 编辑型 reveal 走 IntersectionObserver（复用 global.css 的
 *   .reveal / .in-view 约定，离开视口不回退）。
 */

export interface StoryProgress {
  /** 场景进度 0 → 1（跟随滚动，无自动补间——滚动速度由用户控制） */
  progress: number;
  /** 视口 ≥ 48rem（与 CSS 断点一致） */
  isDesktop: boolean;
}

type SceneApply = (ctx: StoryProgress) => void;
type SceneFactory = (track: HTMLElement) => SceneApply;

const clamp01 = (v: number): number => Math.min(1, Math.max(0, v));
/** progress 在 [a, b] 区间的线性推进（0 → 1） */
const ramp = (p: number, a: number, b: number): number => clamp01((p - a) / (b - a));

/**
 * 场景注册表：名字来自标记元素上的 data-story-scene。
 * 元素引用在注册时缓存一次，滚动帧内只做样式写入。
 */
const SCENE_FACTORIES: Record<string, SceneFactory> = {
  /** HERO：07 轻微放大 → 首帧摄影作品浮现 → 品牌组退场 → 主题句出现 */
  hero: track => {
    const num = track.querySelector<HTMLElement>('[data-hero-num]');
    const core = track.querySelector<HTMLElement>('[data-hero-core]');
    const photo = track.querySelector<HTMLElement>('[data-hero-photo]');
    const slogan = track.querySelector<HTMLElement>('[data-hero-slogan]');
    return ({ progress, isDesktop }) => {
      if (num) {
        num.style.transform = `scale(${(1 + 0.03 * ramp(progress, 0, 0.2)).toFixed(4)})`;
      }
      if (photo) {
        const t = ramp(progress, 0.35, 0.55);
        photo.style.opacity = t.toFixed(3);
        photo.style.transform = `scale(${(1.06 - 0.06 * t).toFixed(4)})`;
      }
      if (core) {
        const t = ramp(progress, 0.55, 0.75);
        core.style.opacity = (1 - t).toFixed(3);
        core.style.transform = `translateY(${(-28 * t).toFixed(1)}px)`;
      }
      if (slogan) {
        const t = ramp(progress, isDesktop ? 0.75 : 0.7, 0.9);
        slogan.style.opacity = t.toFixed(3);
        slogan.style.transform = `translateY(${(18 * (1 - t)).toFixed(1)}px)`;
      }
    };
  },

  /**
   * 01 七年序章：引言 → 全屏头像墙淡入/停留/淡出（缓慢漂移）→ 统计依序出现。
   * 头像墙为舞台全屏底层（桌面横版/移动竖版由 <picture> 切换）。
   * 节奏：墙尽早入场、退场只压暗到 28% 保留质感底，避免长黑屏打断。
   */
  intro: track => {
    const head = track.querySelector<HTMLElement>('[data-intro-head]');
    const lead = track.querySelector<HTMLElement>('[data-intro-lead]');
    const wall = track.querySelector<HTMLElement>('[data-intro-wall]');
    const cap = track.querySelector<HTMLElement>('[data-wall-cap]');
    const stats = Array.from(track.querySelectorAll<HTMLElement>('[data-intro-stat]'));
    const statStarts = [0.62, 0.7, 0.78];
    return ({ progress: p }) => {
      if (head) {
        const t = ramp(p, 0, 0.08);
        const out = ramp(p, 0.5, 0.62);
        head.style.opacity = (t * (1 - out)).toFixed(3);
        head.style.transform = `translateY(${(16 * (1 - t) - 12 * out).toFixed(1)}px)`;
      }
      if (lead) {
        const t = ramp(p, 0.04, 0.12);
        const out = ramp(p, 0.5, 0.62);
        lead.style.opacity = (t * (1 - out)).toFixed(3);
        lead.style.transform = `translateY(${(16 * (1 - t) - 12 * out).toFixed(1)}px)`;
      }
      if (wall) {
        const enter = ramp(p, 0.04, 0.2);
        const drift = ramp(p, 0.2, 0.6);
        const dim = ramp(p, 0.66, 0.84);
        wall.style.opacity = (enter * (1 - dim * 0.72)).toFixed(3); // 退场压暗至 28%，保留质感底
        wall.style.transform = `scale(${(1.055 - 0.055 * enter + 0.035 * drift).toFixed(4)})`;
      }
      if (cap) {
        const t = ramp(p, 0.24, 0.36) * (1 - ramp(p, 0.56, 0.68));
        cap.style.opacity = t.toFixed(3);
      }
      stats.forEach((el, i) => {
        const start = statStarts[i] ?? 0.78;
        const t = ramp(p, start, start + 0.07);
        el.style.opacity = t.toFixed(3);
        el.style.transform = `translateY(${(14 * (1 - t)).toFixed(1)}px)`;
      });
    };
  },

  /**
   * 02 光影札记：暗场 → 肖像淡入 + 轻微放大 → 文字节拍轮换
   * （bio 开场 → 三段正文逐段聚焦 → 落款；末段压暗为背景衬托落款）。
   * 节拍吸附：进度只决定「当前在第几拍」（跨过相邻拍中心的中点即整拍切换），
   * 切换过渡由 CSS transition 完成（FounderNote 内 .story-on 门控）——
   * 停在任何位置看到的都是完整一段，绝不会停在两拍之间。
   * 中心点表键为节拍数：5 = 全文（bio + 三段 + 落款），2 = 占位回退。
   */
  founder: track => {
    const portrait = track.querySelector<HTMLElement>('[data-founder-portrait]');
    const beats = [...track.querySelectorAll<HTMLElement>('[data-founder-beat]')];
    const CENTERS: Record<number, number[]> = {
      5: [0.33, 0.46, 0.6, 0.74, 0.88],
      2: [0.36, 0.84],
    };
    const centers =
      CENTERS[beats.length] ??
      beats.map((_, i) => 0.33 + (0.55 * i) / Math.max(1, beats.length - 1));
    const thresholds: number[] = [];
    for (let i = 1; i < centers.length; i++) {
      const a = centers[i - 1];
      const b = centers[i];
      if (a !== undefined && b !== undefined) {
        thresholds.push((a + b) / 2);
      }
    }
    let active = -1;
    return ({ progress: p }) => {
      if (portrait) {
        const t = ramp(p, 0.12, 0.26);
        const zoom = ramp(p, 0.3, 0.44);
        portrait.style.opacity = t.toFixed(3);
        portrait.style.transform = `scale(${(1 + 0.04 * zoom).toFixed(4)})`;
      }
      let s = 0;
      for (const th of thresholds) {
        if (p >= th) {
          s++;
        }
      }
      if (s === active) {
        return;
      }
      active = s;
      beats.forEach((el, i) => {
        // 落款拍（最后一拍）：前一段压暗 0.25 作背景，其余非当前拍整段退场
        const dim = s === beats.length - 1 && i === s - 1 ? 0.25 : 0;
        const opacity = i === s ? 1 : dim;
        const ty = i === s ? 0 : i < s ? -14 : 16;
        el.style.opacity = opacity.toFixed(3);
        el.style.transform = `translateY(${ty}px)`;
      });
    };
  },

  /**
   * 06 留光成物：巨片飞行编排（全程滚动驱动；驻留缓漂由 poster-slideshow
   * 的时间驱动层接管，写 [data-poster-drift]，与本工厂写的 [data-poster-stage]
   * 分层叠加）：
   * 入场 p .02→.2 照片从屏幕左侧飘入（减速就位）→ 驻留 → 离场 p .82→.96
   * 随滚动二次加速向右飘出屏幕 → 空框浮现 p .86→.93、收束淡出 p .94→1
   * （结束动作：光已飘走，框留余温）。
   */
  posters: track => {
    const lead = track.querySelector<HTMLElement>('[data-poster-lead]');
    const stage = track.querySelector<HTMLElement>('[data-poster-stage]');
    const cap = track.querySelector<HTMLElement>('[data-poster-cap]');
    const ghost = track.querySelector<HTMLElement>('[data-poster-ghost]');
    return ({ progress: p }) => {
      const vw = window.innerWidth;
      if (stage) {
        // 入场：从左侧 -60vw 减速飘入；(1-t)² 让就位带缓出感
        const tIn = ramp(p, 0.02, 0.2);
        // 离场：t² 二次加速飘向右出屏
        const tOut = ramp(p, 0.82, 0.96);
        const x = -0.6 * vw * (1 - tIn) * (1 - tIn) + tOut * tOut * 1.15 * vw;
        stage.style.opacity = ramp(p, 0.05, 0.15).toFixed(3);
        stage.style.transform = `translate3d(${x.toFixed(1)}px, 0, 0) rotate(${(tOut * 1.5).toFixed(2)}deg)`;
      }
      if (lead) {
        const e = ramp(p, 0.82, 0.9);
        lead.style.opacity = (ramp(p, 0.03, 0.1) * (1 - e)).toFixed(3);
        lead.style.transform = `translateY(${(-14 * e).toFixed(1)}px)`;
      }
      if (cap) {
        const e = ramp(p, 0.84, 0.92);
        cap.style.opacity = (ramp(p, 0.1, 0.18) * (1 - e)).toFixed(3);
        cap.style.transform = `translateY(${(10 * e).toFixed(1)}px)`;
      }
      if (ghost) {
        // 浮现后完整停留（.92→.95），末段再收束淡出
        const g = ramp(p, 0.84, 0.92);
        const s = ramp(p, 0.95, 1);
        ghost.style.opacity = (g * (1 - s)).toFixed(3);
        ghost.style.transform = `scale(${(1 - 0.06 * s).toFixed(4)})`;
      }
    };
  },

  /** 07 光影七载：2019 → WE STARTED → 7 → YEARS LATER → 2026 → 主题句（全页最慢） */
  ending: track => {
    const head = track.querySelector<HTMLElement>('[data-ending-head]');
    const line1 = track.querySelector<HTMLElement>('[data-ending-line1]');
    const seven = track.querySelector<HTMLElement>('[data-ending-seven]');
    const later = track.querySelector<HTMLElement>('[data-ending-later]');
    const line2 = track.querySelector<HTMLElement>('[data-ending-line2]');
    const brand = track.querySelector<HTMLElement>('[data-ending-brand]');
    return ({ progress: p }) => {
      if (head) {
        const t = ramp(p, 0, 0.08);
        head.style.opacity = t.toFixed(3);
      }
      if (line1) {
        const t = ramp(p, 0.05, 0.18);
        line1.style.opacity = t.toFixed(3);
        line1.style.transform = `translateY(${(16 * (1 - t)).toFixed(1)}px)`;
      }
      if (seven) {
        const t = ramp(p, 0.22, 0.4);
        seven.style.opacity = t.toFixed(3);
        seven.style.transform = `scale(${(0.92 + 0.08 * t).toFixed(4)})`;
      }
      if (later) {
        const t = ramp(p, 0.4, 0.52);
        later.style.opacity = t.toFixed(3);
      }
      if (line2) {
        const t = ramp(p, 0.58, 0.74);
        line2.style.opacity = t.toFixed(3);
        line2.style.transform = `translateY(${(16 * (1 - t)).toFixed(1)}px)`;
      }
      if (brand) {
        const t = ramp(p, 0.78, 0.94);
        brand.style.opacity = t.toFixed(3);
        brand.style.transform = `translateY(${(18 * (1 - t)).toFixed(1)}px)`;
      }
    };
  },

  /**
   * 05 同行之路：关系逐渐展开（view 模式——不钉住，进度=区块穿越视口）。
   * SEEKER → ─ 社区/高校 → │ 品牌/地方分部，细线随进度生长。
   */
  road: track => {
    const center = track.querySelector<HTMLElement>('[data-road-center]');
    const h1 = track.querySelector<HTMLElement>('[data-road-h1]');
    const left = track.querySelector<HTMLElement>('[data-road-left]');
    const h2 = track.querySelector<HTMLElement>('[data-road-h2]');
    const right = track.querySelector<HTMLElement>('[data-road-right]');
    const v1 = track.querySelector<HTMLElement>('[data-road-v1]');
    const top = track.querySelector<HTMLElement>('[data-road-top]');
    const v2 = track.querySelector<HTMLElement>('[data-road-v2]');
    const bottom = track.querySelector<HTMLElement>('[data-road-bottom]');
    return ({ progress: p }) => {
      if (center) {
        const t = ramp(p, 0.02, 0.12);
        center.style.opacity = t.toFixed(3);
        center.style.transform = `translateY(${(12 * (1 - t)).toFixed(1)}px)`;
      }
      if (h1) {
        h1.style.opacity = '1';
        h1.style.transform = `scaleX(${ramp(p, 0.12, 0.26).toFixed(3)})`;
      }
      if (left) {
        left.style.opacity = ramp(p, 0.26, 0.36).toFixed(3);
      }
      if (h2) {
        h2.style.opacity = '1';
        h2.style.transform = `scaleX(${ramp(p, 0.14, 0.28).toFixed(3)})`;
      }
      if (right) {
        right.style.opacity = ramp(p, 0.28, 0.38).toFixed(3);
      }
      if (v1) {
        v1.style.opacity = '1';
        v1.style.transform = `scaleY(${ramp(p, 0.38, 0.48).toFixed(3)})`;
      }
      if (top) {
        top.style.opacity = ramp(p, 0.48, 0.56).toFixed(3);
      }
      if (v2) {
        v2.style.opacity = '1';
        v2.style.transform = `scaleY(${ramp(p, 0.4, 0.5).toFixed(3)})`;
      }
      if (bottom) {
        bottom.style.opacity = ramp(p, 0.5, 0.58).toFixed(3);
      }
    };
  },

  /**
   * 地图章节（WHERE WE ARE）：眉题浮现 → 灯光阶段 → Exit 收尾文案。
   * 进度本身以事件派发给 AnniversaryMap（地图实例在其内部，懒加载）。
   */
  map: track => {
    const eyebrow = track.querySelector<HTMLElement>('[data-map-eyebrow]');
    const exit = track.querySelector<HTMLElement>('[data-map-exit]');
    let last = -1;
    return ({ progress: p }) => {
      if (eyebrow) {
        const t = ramp(p, 0, 0.12);
        eyebrow.style.opacity = t.toFixed(3);
        eyebrow.style.transform = `translateY(${(14 * (1 - t)).toFixed(1)}px)`;
      }
      if (exit) {
        const t = ramp(p, 0.82, 0.96);
        exit.style.opacity = t.toFixed(3);
        exit.style.transform = `translateY(${(16 * (1 - t)).toFixed(1)}px)`;
      }
      if (Math.abs(p - last) >= 0.004) {
        last = p;
        window.dispatchEvent(new CustomEvent('anniv-map-progress', { detail: { progress: p } }));
      }
    };
  },
};

/**
 * 初始化滚动叙事。重复调用安全（无场景 / reduced-motion 时为空操作）。
 */
export function initScrollStory(): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return; // reduced-motion：pin/scrub 全禁用，保留静态内容
  }
  const root = document.querySelector<HTMLElement>('[data-story-root]');
  if (!root || root.classList.contains('story-on')) {
    return;
  }
  root.classList.add('story-on');
  initReveals(root);

  const mq = window.matchMedia('(min-width: 48rem)');
  const scenes: {
    track: HTMLElement;
    top: number;
    range: number;
    apply: SceneApply;
    view: boolean;
  }[] = [];
  root.querySelectorAll<HTMLElement>('[data-story-scene]').forEach(track => {
    const { storyScene: name, storyMode } = track.dataset;
    const factory = name ? SCENE_FACTORIES[name] : undefined;
    if (factory) {
      scenes.push({
        track,
        top: 0,
        range: 1,
        apply: factory(track),
        view: storyMode === 'view',
      });
    }
  });
  if (scenes.length === 0) {
    return;
  }

  const measure = () => {
    const { scrollY } = window;
    for (const s of scenes) {
      if (s.view) {
        // view 模式：区块顶端触到视口底 → 0；区块底端离开视口顶 → 1
        const rect = s.track.getBoundingClientRect();
        s.top = rect.top + scrollY - window.innerHeight;
        s.range = Math.max(1, window.innerHeight + rect.height);
      } else {
        s.top = s.track.getBoundingClientRect().top + scrollY;
        s.range = Math.max(1, s.track.offsetHeight - window.innerHeight);
      }
    }
  };
  const invalidate = () => {
    dirty = true;
  };

  let dirty = true;
  measure();
  window.addEventListener('scroll', invalidate, { passive: true });
  window.addEventListener('resize', () => {
    measure();
    invalidate();
  });
  window.addEventListener('load', () => {
    measure();
    invalidate();
  });
  // 图片/字体等资源加载改变根高度（推移后续 track 位置）时重新测量
  const ro = new ResizeObserver(() => {
    measure();
    invalidate();
  });
  ro.observe(root);

  const ctx: StoryProgress = { progress: 0, isDesktop: mq.matches };
  const tick = () => {
    if (dirty) {
      dirty = false;
      ctx.isDesktop = mq.matches;
      const y = window.scrollY;
      for (const s of scenes) {
        ctx.progress = clamp01((y - s.top) / s.range);
        s.apply(ctx);
      }
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/**
 * 编辑型 reveal：[data-reveal] 进入视口一次性加 .in-view（复用 global.css
 * 的 .reveal 过渡约定与 --reveal-delay 错峰）。离开视口不回退，阅读优先。
 */
function initReveals(root: HTMLElement): void {
  const els = root.querySelectorAll<HTMLElement>('[data-reveal]');
  if (els.length === 0) {
    return;
  }
  const io = new IntersectionObserver(
    entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.2, rootMargin: '0px 0px -8% 0px' },
  );
  els.forEach(el => {
    el.classList.add('reveal');
    const delay = el.dataset.revealDelay;
    if (delay) {
      el.style.setProperty('--reveal-delay', delay);
    }
    io.observe(el);
  });
}
