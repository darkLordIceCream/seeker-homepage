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
  const scenes: { track: HTMLElement; top: number; range: number; apply: SceneApply }[] = [];
  root.querySelectorAll<HTMLElement>('[data-story-scene]').forEach(track => {
    const { storyScene: name } = track.dataset;
    const factory = name ? SCENE_FACTORIES[name] : undefined;
    if (factory) {
      scenes.push({ track, top: 0, range: 1, apply: factory(track) });
    }
  });
  if (scenes.length === 0) {
    return;
  }

  const measure = () => {
    const { scrollY } = window;
    for (const s of scenes) {
      s.top = s.track.getBoundingClientRect().top + scrollY;
      s.range = Math.max(1, s.track.offsetHeight - window.innerHeight);
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
