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
   * 头像墙过渡：HERO 之后全屏停留一帧「看见彼此」。
   * 墙尽早入场、驻留缓漂，退场只压暗到 28% 保留质感底，交棒给 01 光影札记。
   */
  intro: track => {
    const wall = track.querySelector<HTMLElement>('[data-intro-wall]');
    const cap = track.querySelector<HTMLElement>('[data-wall-cap]');
    return ({ progress: p }) => {
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
    let lastSwap = 0;
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
      // 一次一段锁：不管滑多长，每次只推进/回退一段（首帧直接就位）；
      // 快速滑过时按 520ms 节奏逐段追上，绝不跳段
      const now = performance.now();
      if (active !== -1) {
        if (now - lastSwap < 520) {
          return;
        }
        s = s > active ? active + 1 : active - 1;
      }
      lastSwap = now;
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
   * 02 追光印记：空间行走式叙事——三块方形展板同存于一个空间，滚动 = 相机
   * 沿微 S 展道前移（progress 连续映射相机格位 cam，经停驻点有「面对」停留）。
   * 每块展板相对相机的深度 rel = i - cam 连续变化：
   *   rel 0 = 面前（最大最亮最清晰）→ 负 = 身后（放大穿过、渐淡消失）
   *   → 正 = 前方（近大远小，远处微光等待）。
   * 遮挡由空间深度自然产生：面对 Part 01 时，Part 02 在其后方露出一点——
   * 用户会知道「前面还有一个」，而不是「网页要切到下一张卡片」。
   * 空间错位克制（微 S 走道：左 → 中 → 右），走完 Part 03 后整个展厅
   * 变暗退出，自然接 03 同行之路。所有状态由 progress 直接计算（无
   * transition/定时器），快速与反向滚动严格连续。
   */
  /**
   * 02 追光印记：舞台式三卡节拍（三卡固定左/中/右站位，段落吸附）。
   * 进入章节 Part 01 占主位（全亮全尺寸），Part 02/03 在右/左后方待命（缩小、变暗、后退、微转）；
   * 滚动推进节拍——Part 2 上场 Part 1 退场、Part 3 上场 Part 2 退场，
   * 末段三卡一起后退变暗谢幕。编排逻辑在 scroll-story.ts 的 projects 工厂。
   * 无 JS / reduced-motion：不加 story-on，卡片退化为普通文档流依次排列、全部可见。
   * 图文数据与首页活动卡同源（R2 代表图 + 主站路由）。
   * 段落吸附：progress 只决定「当前拍」（面对 P1 / P2 / P3 / 退场谢幕），
   * 一次最多推进一段（不管滑多长，段落锁 600ms + ±1 步进）；
   * 拍内姿态 = 该拍的目标状态，切换由 CSS transition 补间——
   * 滚动不会停在任何中间态上。
   */
  projects: track => {
    const boards = [...track.querySelectorAll<HTMLElement>('[data-project-beat]')];
    // 展道空间错位：向右斜的走道（左 → 中 → 右）——错位量需让下一块板
    // 从当前板的侧面露出（遮挡关系的空间前提）
    const PAN = [
      { x: -14, y: 0 },
      { x: 0, y: -2 },
      { x: 14, y: 1 },
    ];
    // 各拍相机格位：拍1 面对展板1、拍2 展板2、拍3 展板3、拍4 退场暗场
    const CAM = [0, 1, 2, 2.9];
    // 拍切换边界（progress）：面对三段停留均匀铺在行走轨道上
    const EDGE = [0.18, 0.42, 0.68];
    let beat = -1;
    let lastAt = 0;
    const applyBeat = (b: number, isDesktop: boolean): void => {
      const step = (isDesktop ? 92 : 105) * (window.innerWidth / 100); // 板间距 px
      const exit = b >= 3 ? 1 : 0; // 末拍：三卡一起退场暗场
      const cam = CAM[Math.min(b, 2)] ?? 0;
      boards.forEach((el, i) => {
        const pan = PAN[i] ?? { x: 0, y: 0 };
        const rel = i - cam; // <0 身后（已面对过） >0 前方（等待）
        const away = Math.abs(rel);
        // 穿过身后渐淡（不穿模）；前方始终存在——远处微光等待
        const passed = rel < -0.06 ? Math.min(1, (-rel - 0.06) / 0.42) : 0;
        const opacity = (1 - 0.92 * passed) * (1 - 0.9 * exit);
        const dim = Math.max(0.55, 1 - away * 0.42) * (1 - 0.45 * exit);
        el.style.opacity = opacity.toFixed(3);
        el.style.transform = `translate3d(${pan.x.toFixed(1)}vw, ${pan.y.toFixed(1)}vh, ${(-rel * step).toFixed(1)}px)`;
        el.style.zIndex = String(60 - Math.round(rel * 30));
        el.style.setProperty('--ps-dim', dim.toFixed(3));
      });
    };
    return ({ progress: P, isDesktop }) => {
      let b = 0;
      for (const edge of EDGE) {
        if (P >= edge) {
          b++;
        }
      }
      if (beat === -1) {
        // 首帧：直接就位到当前拍（不做段落锁）
        beat = b;
        applyBeat(beat, isDesktop);
        return;
      }
      const now = performance.now();
      // 段落锁：不管滑多长，一次只推进一段；切换间隔至少 600ms
      if (b !== beat && now - lastAt >= 600) {
        beat += b > beat ? 1 : -1;
        lastAt = now;
        applyBeat(beat, isDesktop);
      }
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
  /**
   * 04 留光成物：巨片舞台（段落吸附三拍）。
   * 拍0（未到）：巨片在后方深处（缩小、变暗、下坠）；拍1（面对）：台前定格
   * 全亮供观看，引言/署名/进度线同步亮起；拍2（走过）：整体向右退出并暗场
   * ——空框浮现在原地（光已飘走，框留余温），交棒给下方的暗房章节。
   * progress 只决定当前拍（一次一段），切换由 CSS transition 补间；
   * 快速/反向滚动不会停在任何中间态上。
   */
  posters: track => {
    const lead = track.querySelector<HTMLElement>('[data-poster-lead]');
    const stage = track.querySelector<HTMLElement>('[data-poster-stage]');
    const cap = track.querySelector<HTMLElement>('[data-poster-cap]');
    const ghost = track.querySelector<HTMLElement>('[data-poster-ghost]');
    let beat = -1;
    return ({ progress: P }) => {
      const b = P < 0.12 ? 0 : P < 0.72 ? 1 : 2;
      if (b === beat) {
        return;
      }
      beat = b;
      const set = (el: HTMLElement | null, op: string, tf: string): void => {
        if (el) {
          el.style.opacity = op;
          el.style.transform = tf;
        }
      };
      if (b === 0) {
        set(lead, '0', 'translateY(14px)');
        set(stage, '0.1', 'scale(0.88) translateY(26px)');
        set(cap, '0', 'translateY(10px)');
        set(ghost, '0', 'none');
      } else if (b === 1) {
        set(lead, '1', 'translateY(0)');
        set(stage, '1', 'translate3d(0, 0, 0)');
        set(cap, '1', 'translateY(0)');
        set(ghost, '0', 'none');
      } else {
        // 退场：巨片整体向右退出并暗场；空框原地浮现
        set(lead, '0', 'translateY(-14px)');
        set(stage, '0', 'translate3d(46vw, 0, 0)');
        set(cap, '0', 'translateY(10px)');
        set(ghost, '1', 'none');
      }
    };
  },
  /**
   * 03 同行之路：品牌关系网节拍——所有品牌文字节点连接到「合作品牌」枢纽
   * （排名不分先后：网络本身无序）。滚动依次聚焦每个品牌：节点与连线点亮，
   * 顶部放大字「@品牌名」、下方稍小字体展开合作文案（跨过相邻段中点即整段
   * 切换，transition 由 CSS 完成，绝不停在两段之间）。末段点亮「排名不分先后」。
   */
  road: track => {
    const nodes = [...track.querySelectorAll<HTMLElement>('[data-road-node]')];
    const links = [...track.querySelectorAll<HTMLElement>('[data-road-link]')];
    const focuses = [...track.querySelectorAll<HTMLElement>('[data-road-focus]')];
    const fineprint = track.querySelector<HTMLElement>('[data-road-fineprint]');
    const N = Math.min(nodes.length, focuses.length);
    const SPAN = N > 0 ? 0.94 / N : 1;
    const HEAD = 0.03;
    let active = -1;
    return ({ progress: p }) => {
      let s = -1;
      for (let i = 0; i < N; i++) {
        const q = (p - (HEAD + i * SPAN)) / SPAN;
        if (q >= -0.5 && q < 1.5 && s < 0) {
          s = i; // 第一段从进入即生效；段间中点由阈值切换
        }
      }
      // 阈值切换：跨过每段中点即切换到下一段（吸附，不停在中间态）
      s = Math.max(0, Math.min(N - 1, Math.floor((p - HEAD) / SPAN)));
      if (s === active) {
        return;
      }
      active = s;
      nodes.forEach((el, i) => {
        el.classList.toggle('is-active', i === s);
      });
      links.forEach((el, i) => {
        el.classList.toggle('is-active', i === s);
      });
      focuses.forEach((el, i) => {
        el.style.opacity = i === s ? '1' : '0';
      });
      if (fineprint) {
        fineprint.style.opacity = s >= N - 1 ? '1' : '0';
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
