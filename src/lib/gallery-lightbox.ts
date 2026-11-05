/**
 * 画廊灯箱共享引擎（首页门厅 WorksSection 与档案馆 /gallery 共用）。
 * 零依赖渐进增强：Esc 关闭 / ←→ 切换 / Tab 焦点圈禁 / 触屏轻滑 /
 * 点击背景关闭 / 加载失败给可理解错误态（灯箱仍可关闭与切换）。
 *
 * 片单制：打开与翻页时经 getSlides() 现读当前片单——门厅传全池展示序
 * （灯箱成为门厅与档案馆之间的走廊，可 ←/→ 翻遍全部作品），档案馆传
 * 同一展示序（与藏品编号 No.XX 一致）。计数「N / 总数」永远与片单一致。
 *
 * 触发按钮由调用方绑定（打开序位因页面而异），本引擎只负责灯箱本体；
 * 返回 { open, close } 句柄供调用方打开指定序位。
 *
 * 灯箱 DOM 约定（root 内）：
 *   button.gl-close / button.gl-prev / button.gl-next
 *   .gl-stage > img.gl-img + figcaption.gl-cap（内含 span.gl-cap-text；
 *   archiveHref 提供时自动追加 a.gl-cap-link「在档案馆查看 →」）
 *   p.gl-count
 */

export interface LightboxSlide {
  /** 大图 URL */
  full: string;
  /** 作品名（无题作品传空串） */
  title: string;
  /** 作者 ID */
  author: string;
}

export interface GalleryLightboxOptions {
  /** 灯箱根元素（.gl-lightbox） */
  root: HTMLElement;
  /** 每次打开/翻页时返回当前片单 */
  getSlides: () => readonly LightboxSlide[];
  /** 提供时，图注下显示「在档案馆查看 →」链接 */
  archiveHref?: string;
}

export interface GalleryLightboxHandle {
  /** 打开灯箱并定位到片单第 index 项（越界自动回 0） */
  open: (index: number) => void;
  close: () => void;
}

export function initGalleryLightbox({
  root,
  getSlides,
  archiveHref,
}: GalleryLightboxOptions): GalleryLightboxHandle {
  const img = root.querySelector<HTMLImageElement>('.gl-img');
  const capText = root.querySelector<HTMLElement>('.gl-cap-text');
  const cap = root.querySelector<HTMLElement>('.gl-cap');
  const count = root.querySelector<HTMLElement>('.gl-count');

  let current = -1;
  let lastFocus: HTMLElement | null = null;

  const renderSlide = () => {
    const slide = getSlides()[current];
    if (!img || !capText || !count || !slide) {
      return;
    }
    img.classList.remove('gl-img--error');
    img.src = slide.full;
    img.alt = slide.title ? `《${slide.title}》——${slide.author}作品` : `${slide.author}作品`;
    capText.textContent = slide.title ? `《${slide.title}》 @${slide.author}` : `@${slide.author}`;
    count.textContent = `${current + 1} / ${getSlides().length}`;
  };

  const openLightbox = (index: number) => {
    const total = getSlides().length;
    if (total === 0) {
      return;
    }
    current = index >= 0 && index < total ? index : 0;
    renderSlide();
    lastFocus = document.activeElement as HTMLElement | null;
    // 锁定 html 滚动（overflow 方案天然保留滚动位置）
    document.documentElement.style.overflow = 'hidden';
    root.hidden = false;
    root.querySelector<HTMLElement>('.gl-close')?.focus();
  };

  const closeLightbox = () => {
    root.hidden = true;
    document.documentElement.style.overflow = '';
    lastFocus?.focus();
    current = -1;
  };

  const step = (delta: number) => {
    const total = getSlides().length;
    if (current < 0 || total === 0) {
      return;
    }
    current = (current + delta + total) % total;
    renderSlide();
  };

  root.querySelector('.gl-close')?.addEventListener('click', closeLightbox);
  root.querySelector('.gl-prev')?.addEventListener('click', () => step(-1));
  root.querySelector('.gl-next')?.addEventListener('click', () => step(1));
  // 点背景关闭（点在图片/按钮上不关）
  root.addEventListener('click', e => {
    if (e.target === root) {
      closeLightbox();
    }
  });

  // 键盘：Esc 关闭 / ←→ 切换 / Tab 焦点圈禁在灯箱内
  const FOCUSABLE = '.gl-close, .gl-prev, .gl-next';
  document.addEventListener('keydown', e => {
    if (current < 0) {
      return;
    }
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowRight') {
      step(1);
    } else if (e.key === 'ArrowLeft') {
      step(-1);
    } else if (e.key === 'Tab') {
      const items = [...root.querySelectorAll<HTMLElement>(FOCUSABLE)];
      const first = items[0];
      const last = items[items.length - 1];
      if (!first || !last) {
        return;
      }
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  // 触屏左右轻滑切换
  let touchX = 0;
  let touchY = 0;
  root.addEventListener(
    'touchstart',
    e => {
      const t = e.touches[0];
      if (t) {
        touchX = t.clientX;
        touchY = t.clientY;
      }
    },
    { passive: true },
  );
  root.addEventListener(
    'touchend',
    e => {
      const t = e.changedTouches[0];
      if (!t) {
        return;
      }
      const dx = t.clientX - touchX;
      const dy = t.clientY - touchY;
      if (Math.abs(dx) > 44 && Math.abs(dx) > Math.abs(dy) * 1.2) {
        step(dx < 0 ? 1 : -1);
      }
    },
    { passive: true },
  );

  // 加载失败：可理解的错误态，灯箱仍可关闭/切换
  img?.addEventListener('error', () => {
    if (current < 0 || !capText || !count) {
      return;
    }
    img.classList.add('gl-img--error');
    capText.textContent = '图片加载失败——请检查网络后重试，仍可切换其他作品或关闭查看器。';
    count.textContent = `${current + 1} / ${getSlides().length}`;
  });

  // 「在档案馆查看 →」：门厅灯箱成为通往档案馆的走廊
  if (archiveHref && cap) {
    const link = document.createElement('a');
    link.className = 'gl-cap-link';
    link.href = archiveHref;
    link.textContent = '在档案馆查看 →';
    cap.appendChild(link);
  }

  return { open: openLightbox, close: closeLightbox };
}
