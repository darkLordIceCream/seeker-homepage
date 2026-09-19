/**
 * 【SEEKER 07 / DARKROOM】暗房应用逻辑（由 WatermarkGenerator 抽离）。
 * 懒加载：用户接近暗房章节时才由组件动态 import 本模块（规范 #32），
 * 页面初始加载不含图片处理逻辑。核心管线（render/gestures/template）不变。
 */
import { attachGestures } from './gestures';
import {
  buildFileName,
  clampFrame,
  clampTransform,
  frameRange,
  type FrameOffset,
  ensureFonts,
  exportImage,
  initialTransform,
  loadPhoto,
  loadTemplate,
  PhotoDecodeError,
  renderComposition,
  zoomAtTransform,
  type LoadedPhoto,
  type PhotoTransform,
} from './render';
import {
  DEFAULT_WATERMARK_TEMPLATE,
  NICKNAME_MAX_LENGTH,
  WATERMARK_TEMPLATES,
  type WatermarkTemplate,
} from './template';

export function initDarkroom(): void {

  const MIN_SCALE = 1;
  const MAX_SCALE = 4;
  const ZOOM_STEP = 1.25;
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const darkroomRoot = document.querySelector<HTMLElement>('[data-darkroom-root]');

  /** 位置选择数据（构建期从 anniv-points.json 注入；仅本页展示，不落库） */
  const locGroups = JSON.parse(darkroomRoot?.dataset.locations ?? '[]') as {
    label: string;
    options: { value: string; name: string; lngLat: [number, number] }[];
  }[];

  function required<T extends HTMLElement>(id: string, ctor: new () => T): T {
    const node = document.getElementById(id);
    if (!(node instanceof ctor)) {
      throw new Error(`暗房缺少元素 #${id}`);
    }
    return node;
  }

  const emptySec = required('dr-empty', HTMLElement);
  const editorSec = required('dr-editor', HTMLElement);
  const stage = required('wm-stage', HTMLElement);
  const canvas = required('wm-canvas', HTMLCanvasElement);
  const dropzone = required('wm-dropzone', HTMLButtonElement);
  const fileInput = required('wm-file', HTMLInputElement);
  const nickHit = required('wm-nick-hit', HTMLButtonElement);
  const sweepEl = required('dr-sweep', HTMLElement);
  const toastEl = required('wm-toast', HTMLElement);
  const sampleBtn = required('wm-sample', HTMLButtonElement);
  const nicknameInput = required('wm-nickname', HTMLInputElement);
  const zoomSlider = required('wm-zoom', HTMLInputElement);
  const zoomInBtn = required('wm-zoom-in', HTMLButtonElement);
  const zoomOutBtn = required('wm-zoom-out', HTMLButtonElement);
  const resetBtn = required('wm-reset', HTMLButtonElement);
  const generateBtn = required('wm-generate', HTMLButtonElement);
  const downloadLink = required('wm-download', HTMLAnchorElement);
  const changeBtn = required('wm-change', HTMLButtonElement);
  const againBtn = required('dr-again', HTMLButtonElement);
  const controlsEl = required('dr-controls', HTMLElement);
  const actionsEl = required('dr-actions', HTMLElement);
  const readyEl = required('dr-ready', HTMLElement);
  const popEl = required('wm-pop', HTMLElement);
  const popInput = required('wm-pop-input', HTMLInputElement);
  const popCount = required('wm-pop-count', HTMLElement);
  const tplButtons = Array.from(
    document.querySelectorAll<HTMLButtonElement>('.dr-format[data-template-id]'),
);

  let currentTemplate: WatermarkTemplate = DEFAULT_WATERMARK_TEMPLATE;
  let templateBitmap: ImageBitmap | null = null;
  let qrBitmap: ImageBitmap | null = null;
  const overlayCache = new Map<string, ImageBitmap>();
  const qrCache = new Map<string, ImageBitmap>();
  let frame: FrameOffset = { x: 0, y: 0 };
  let photo: LoadedPhoto | null = null;
  let transform: PhotoTransform = initialTransform();
  let downloadUrl: string | null = null;
  let renderQueued = false;
  let sourceFileName = '';
  let toastTimer = 0;

  const areaCenter = { x: 0, y: 0 };

  function syncAreaCenter(): void {
    areaCenter.x = currentTemplate.photoArea.x + currentTemplate.photoArea.width / 2;
    areaCenter.y = currentTemplate.photoArea.y + currentTemplate.photoArea.height / 2;
  }

  function setStatus(message: string, isError = false, sticky = false): void {
    toastEl.textContent = message;
    toastEl.classList.toggle('is-error', isError);
    toastEl.hidden = !message;
    if (toastTimer) {
      window.clearTimeout(toastTimer);
    }
    if (message && !sticky) {
      toastTimer = window.setTimeout(() => {
        toastEl.hidden = true;
      }, 2800);
    }
  }

  function showEditor(show: boolean): void {
    emptySec.hidden = show;
    editorSec.hidden = !show;
  }

  function requestRender(): void {
    if (renderQueued || !templateBitmap) {
      return;
    }
    renderQueued = true;
    requestAnimationFrame(() => {
      renderQueued = false;
      if (!templateBitmap) {
        return;
      }
      const cssWidth = canvas.clientWidth || stage.clientWidth || 360;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const scale = Math.max(
        Math.min((cssWidth * dpr) / currentTemplate.width, 1600 / currentTemplate.width),
        0.2,
    );
      renderComposition(canvas, {
        template: currentTemplate,
        templateImage: templateBitmap,
        qrImage: qrBitmap,
        photo,
        transform,
        frame,
        nickname: nicknameInput.value,
        scale,
      });
    });
  }

  const normalize = (t: PhotoTransform): PhotoTransform =>
    photo ? clampTransform({ template: currentTemplate, photo, transform: t }) : t;

  function syncTplButtons(): void {
    for (const btn of tplButtons) {
      btn.setAttribute('aria-pressed', String(btn.dataset.templateId === currentTemplate.id));
    }
  }

  function syncControls(): void {
    const hasPhoto = photo !== null;
    zoomSlider.value = String(transform.scale);
    zoomSlider.disabled = !hasPhoto;
    zoomInBtn.disabled = !hasPhoto;
    zoomOutBtn.disabled = !hasPhoto;
    resetBtn.disabled = !hasPhoto;
    generateBtn.disabled = !hasPhoto;
    changeBtn.hidden = !hasPhoto;
  }

  function resetToReady(showReady: boolean): void {
    controlsEl.hidden = showReady;
    actionsEl.hidden = showReady;
    readyEl.hidden = !showReady;
    // 位置确认随完成态出现；重新制作时收起
    const locPanel = darkroomRoot?.querySelector<HTMLElement>('[data-darkroom-loc]');
    if (locPanel) {
      locPanel.hidden = !showReady;
    }
    const locDone = darkroomRoot?.querySelector<HTMLElement>('[data-loc-done]');
    if (locDone) {
      locDone.hidden = true;
    }
  }

  function zoomBy(factor: number): void {
    transform = zoomAtTransform({
      template: currentTemplate,
      photo,
      transform,
      px: areaCenter.x,
      py: areaCenter.y,
      factor,
      minScale: MIN_SCALE,
      maxScale: MAX_SCALE,
    });
    syncControls();
    requestRender();
  }

  /* —— 水印帧平移（FRAME）：仅 frameAxis 轴向，昵称随动，二维码钉角 —— */
  const frameSlider = document.getElementById('wm-frame') as HTMLInputElement | null;
  const frameNeg = darkroomRoot?.querySelector<HTMLButtonElement>('[data-frame-neg]') ?? null;
  const framePos = darkroomRoot?.querySelector<HTMLButtonElement>('[data-frame-pos]') ?? null;
  const frameReset = darkroomRoot?.querySelector<HTMLButtonElement>('[data-frame-reset]') ?? null;
  const frameLabel = darkroomRoot?.querySelector<HTMLElement>('[data-frame-label]') ?? null;

  const FRAME_STEP = 24; // 模板 px / 击

  function syncFrameControls(): void {
    const axis = currentTemplate.frameAxis;
    if (frameLabel) {
      frameLabel.textContent = axis === 'y' ? 'FRAME ↕' : 'FRAME ↔';
    }
    if (frameNeg) {
      frameNeg.setAttribute('aria-label', axis === 'y' ? '上移水印' : '左移水印');
      frameNeg.textContent = axis === 'y' ? '˄' : '‹';
    }
    if (framePos) {
      framePos.setAttribute('aria-label', axis === 'y' ? '下移水印' : '右移水印');
      framePos.textContent = axis === 'y' ? '˅' : '›';
    }
    if (frameSlider) {
      const range = frameRange(currentTemplate);
      frameSlider.value = String(((axis === 'x' ? frame.x : frame.y) / range).toFixed(3));
    }
  }

  function shiftFrame(delta: number): void {
    frame = clampFrame(currentTemplate, {
      x: frame.x + (currentTemplate.frameAxis === 'x' ? delta : 0),
      y: frame.y + (currentTemplate.frameAxis === 'y' ? delta : 0),
    });
    syncFrameControls();
    updateNickHit();
    requestRender();
  }

  frameNeg?.addEventListener('click', () => shiftFrame(-FRAME_STEP));
  framePos?.addEventListener('click', () => shiftFrame(FRAME_STEP));
  frameReset?.addEventListener('click', () => {
    frame = { x: 0, y: 0 };
    syncFrameControls();
    updateNickHit();
    requestRender();
  });
  frameSlider?.addEventListener('input', () => {
    const v = Number.parseFloat(frameSlider.value);
    if (!Number.isFinite(v)) {
      return;
    }
    const range = frameRange(currentTemplate);
    frame = clampFrame(currentTemplate, {
      x: currentTemplate.frameAxis === 'x' ? v * range : 0,
      y: currentTemplate.frameAxis === 'y' ? v * range : 0,
    });
    updateNickHit();
    requestRender();
  });

  function releaseDownload(): void {
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
      downloadUrl = null;
    }
    downloadLink.hidden = true;
  }

  /** 再做一张：回到上传态 */
  function backToEmpty(): void {
    photo?.close();
    photo = null;
    transform = initialTransform();
    releaseDownload();
    resetToReady(false);
    showEditor(false);
    setStatus('');
  }

  async function handleFile(file: File | null | undefined): Promise<void> {
    if (!file) {
      return;
    }
    if (!file.type.startsWith('image/')) {
      setStatus('请选择图片文件（JPG / PNG / WebP）', true);
      return;
    }
    setStatus('正在读取照片…');
    try {
      const loaded = await loadPhoto(file);
      photo?.close();
      photo = loaded;
      sourceFileName = file.name;
      transform = initialTransform();
      releaseDownload();
      resetToReady(false);
      showEditor(true);

      // 自动识别横竖版：宽 ≥ 高 → 横版
      const detected =
        loaded.width >= loaded.height
          ? WATERMARK_TEMPLATES.find(t => t.frameAxis === 'y')
          : WATERMARK_TEMPLATES.find(t => t.frameAxis === 'x');
      if (detected && detected.id !== currentTemplate.id) {
        await switchTemplate(detected, true);
      } else {
        syncControls();
        requestRender();
      }
      playDeveloping();
      setStatus(
        `已识别为${loaded.width >= loaded.height ? '横图' : '竖图'}，自动套用${currentTemplate.name.split('·').pop()?.trim() ?? ''}版式`,
    );
    } catch (error) {
      setStatus(
        error instanceof PhotoDecodeError
          ? '这张照片无法在浏览器中解码，请改用 JPG / PNG 格式（iPhone 可在「设置 → 相机 → 格式」选「兼容性最佳」后重新保存）。'
          : '照片读取失败，请重试。',
        true,
    );
    }
  }

  /**
   * DEVELOPING：暗房显影——黑 → 灰 → 轮廓 → 完整照片（CSS filter 过渡，
   * 非 spinner；reduced-motion 直接跳过）。结束后进入可编辑状态。
   */
  function playDeveloping(): void {
    if (REDUCED) {
      return;
    }
    stage.classList.add('is-developing');
    setStatus('DEVELOPING…', false, true);
    window.setTimeout(() => {
      stage.classList.remove('is-developing');
      setStatus('');
    }, 1600);
  }

  function playSweep(): Promise<void> {
    if (REDUCED) {
      return Promise.resolve();
    }
    return new Promise(resolve => {
      sweepEl.classList.add('is-sweeping');
      window.setTimeout(() => {
        sweepEl.classList.remove('is-sweeping');
        resolve();
      }, 850);
    });
  }

  async function generate(): Promise<void> {
    if (!templateBitmap || !photo) {
      return;
    }
    generateBtn.disabled = true;
    generateBtn.textContent = '冲印中…';
    setStatus('');
    const sweep = playSweep();
    try {
      const out = document.createElement('canvas');
      renderComposition(out, {
        template: currentTemplate,
        templateImage: templateBitmap,
        qrImage: qrBitmap,
        photo,
        transform,
        frame,
        nickname: nicknameInput.value,
      });
      const blob = await exportImage(out, currentTemplate.output);
      releaseDownload();
      downloadUrl = URL.createObjectURL(blob);
      downloadLink.href = downloadUrl;
      downloadLink.download = buildFileName(currentTemplate.output, sourceFileName);
      await sweep;
      downloadLink.hidden = false;
      resetToReady(true);
      setStatus(`纪念帧完成 · ${(blob.size / 1024 / 1024).toFixed(1)} MB`);
    } catch {
      await sweep;
      setStatus('生成失败，请重试。', true);
    } finally {
      generateBtn.disabled = false;
      generateBtn.textContent = '生成纪念帧';
    }
  }

  async function switchTemplate(template: WatermarkTemplate, silent = false): Promise<void> {
    if (template.id === currentTemplate.id && templateBitmap) {
      return;
    }
    if (!silent) {
      setStatus('版式切换中…');
    }
    try {
      let bitmap = overlayCache.get(template.id);
      if (!bitmap) {
        bitmap = await loadTemplate(template.src);
        overlayCache.set(template.id, bitmap);
      }
      let qr = qrCache.get(template.id);
      if (!qr) {
        qr = await loadTemplate(template.qr.src);
        qrCache.set(template.id, qr);
      }
      currentTemplate = template;
      templateBitmap = bitmap;
      qrBitmap = qr;
      transform = initialTransform();
      frame = { x: 0, y: 0 };
      syncFrameControls();
      releaseDownload();
      canvas.style.aspectRatio = `${template.width} / ${template.height}`;
      layoutStage();
      syncAreaCenter();
      syncTplButtons();
      updateNickHit();
      syncControls();
      requestRender();
      if (!silent) {
        setStatus('');
      }
    } catch {
      setStatus('模板加载失败，请检查网络后刷新重试。', true);
    }
  }

  /** 舞台尺寸：编辑态下按剩余视口高度最大化 */
  function layoutStage(): void {
    const aspect = currentTemplate.width / currentTemplate.height;
    const availW = Math.min(window.innerWidth - 32, 920);
    const headH = 56;
    const reserve = window.innerWidth < 768 ? 340 : 220;
    const availH = Math.max(window.innerHeight - headH - reserve, 280);
    const w = Math.min(availW, availH * aspect);
    stage.style.width = `${Math.round(w)}px`;
  }

  /** SAFE AREA 热区定位（模板昵称坐标 → 舞台百分比） */
  function updateNickHit(): void {
    const n = currentTemplate.nickname;
    const estWidth = Math.min(
      n.maxWidth,
      n.fontSize * 0.72 * 6 + n.letterSpacing * 5 + n.fontSize * 1.2,
  );
    nickHit.style.left = `${((n.x - estWidth / 2 - 14) / currentTemplate.width) * 100}%`;
    nickHit.style.top = `${((n.y - n.fontSize * 1.5 - 10) / currentTemplate.height) * 100}%`;
    nickHit.style.width = `${((estWidth + 28) / currentTemplate.width) * 100}%`;
    nickHit.style.height = `${((n.fontSize * 2.1 + 20) / currentTemplate.height) * 100}%`;
  }

  /* —— 昵称就地编辑 —— */
  function showPop(): void {
    const hit = nickHit.getBoundingClientRect();
    popEl.hidden = false;
    const popW = 240;
    let left = hit.left + hit.width / 2 - popW / 2;
    left = Math.max(8, Math.min(left, window.innerWidth - popW - 8));
    const top = hit.top - popEl.offsetHeight - 10;
    popEl.style.left = `${Math.round(left)}px`;
    popEl.style.top = `${Math.round(Math.max(8, top))}px`;
    popInput.value = nicknameInput.value;
    popCount.textContent = `${nicknameInput.value.length} / ${NICKNAME_MAX_LENGTH}`;
    window.setTimeout(() => popInput.focus(), 0);
  }

  function hidePop(): void {
    popEl.hidden = true;
  }

  nickHit.addEventListener('click', () => {
    if (popEl.hidden) {
      showPop();
    } else {
      hidePop();
    }
  });

  popInput.addEventListener('input', () => {
    nicknameInput.value = popInput.value;
    popCount.textContent = `${popInput.value.length} / ${NICKNAME_MAX_LENGTH}`;
    requestRender();
  });

  popInput.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === 'Escape') {
      hidePop();
      requestRender();
    }
  });

  document.addEventListener('pointerdown', e => {
    if (popEl.hidden) {
      return;
    }
    const t = e.target as Element;
    if (!popEl.contains(t) && t !== nickHit && !nickHit.contains(t)) {
      hidePop();
    }
  });

  /* —— 事件绑定 —— */
  for (const btn of tplButtons) {
    const tpl = WATERMARK_TEMPLATES.find(t => t.id === btn.dataset.templateId);
    btn.addEventListener('click', () => {
      if (tpl) {
        void switchTemplate(tpl);
      }
    });
  }

  dropzone.addEventListener('click', () => fileInput.click());
  changeBtn.addEventListener('click', () => fileInput.click());
  againBtn.addEventListener('click', backToEmpty);

  const SAMPLE_SOURCES: Record<string, string> = {
    'seeker-7th-portrait': '/samples/seeker-sample-portrait.jpg',
    'seeker-7th-landscape': '/samples/seeker-sample-landscape.jpg',
  };
  sampleBtn.addEventListener('click', () => {
    const src =
      SAMPLE_SOURCES[currentTemplate.id] ??
      SAMPLE_SOURCES['seeker-7th-portrait'] ??
      '/samples/seeker-sample-portrait.jpg';
    void (async () => {
      sampleBtn.disabled = true;
      setStatus('正在加载示例照片…');
      try {
        const resp = await fetch(src);
        const blob = await resp.blob();
        await handleFile(new File([blob], 'seeker-sample.jpg', { type: 'image/jpeg' }));
      } catch {
        setStatus('示例照片加载失败，请直接选择本地照片。', true);
      } finally {
        sampleBtn.disabled = false;
      }
    })();
  });

  fileInput.addEventListener('change', () => {
    void handleFile(fileInput.files?.[0]);
    fileInput.value = '';
  });

  document.addEventListener('dragover', e => {
    e.preventDefault();
    if (!editorSec.hidden) {
      stage.classList.add('is-dragover');
    }
  });
  document.addEventListener('dragleave', () => stage.classList.remove('is-dragover'));
  document.addEventListener('drop', e => {
    e.preventDefault();
    stage.classList.remove('is-dragover');
    void handleFile(e.dataTransfer?.files?.[0]);
  });
  document.addEventListener('paste', e => {
    void handleFile(e.clipboardData?.files?.[0]);
  });

  nicknameInput.addEventListener('input', () => {
    popInput.value = nicknameInput.value;
    requestRender();
  });

  zoomSlider.addEventListener('input', () => {
    const scale = Number.parseFloat(zoomSlider.value);
    if (!Number.isFinite(scale)) {
      return;
    }
    transform = zoomAtTransform({
      template: currentTemplate,
      photo,
      transform,
      px: areaCenter.x,
      py: areaCenter.y,
      factor: scale / transform.scale,
      minScale: MIN_SCALE,
      maxScale: MAX_SCALE,
    });
    requestRender();
  });

  zoomInBtn.addEventListener('click', () => zoomBy(ZOOM_STEP));
  zoomOutBtn.addEventListener('click', () => zoomBy(1 / ZOOM_STEP));
  resetBtn.addEventListener('click', () => {
    transform = initialTransform();
    syncControls();
    requestRender();
  });
  generateBtn.addEventListener('click', () => void generate());

  attachGestures(canvas, {
    cssToTemplate: () => currentTemplate.width / (canvas.clientWidth || 1),
    drag: (dx, dy, modifiers) => {
      if (modifiers?.shift) {
        // 水印帧平移（仅 frameAxis 轴向生效；昵称随动，二维码钉角不动）
        frame = clampFrame(currentTemplate, {
          x: frame.x + (currentTemplate.frameAxis === 'x' ? dx : 0),
          y: frame.y + (currentTemplate.frameAxis === 'y' ? dy : 0),
        });
        updateNickHit();
      } else {
        transform = normalize({ ...transform, x: transform.x + dx, y: transform.y + dy });
        zoomSlider.value = String(transform.scale);
      }
      requestRender();
    },
    zoomAt: (px, py, factor) => {
      transform = zoomAtTransform({
        template: currentTemplate,
        photo,
        transform,
        px,
        py,
        factor,
        minScale: MIN_SCALE,
        maxScale: MAX_SCALE,
      });
      zoomSlider.value = String(transform.scale);
      requestRender();
    },
  });

  const resizeObserver = new ResizeObserver(() => requestRender());
  resizeObserver.observe(stage);
  window.addEventListener('resize', () => {
    layoutStage();
  });
  document.fonts.ready.then(() => {
    layoutStage();
    requestRender();
  });

  /* —— 初始化：模板常驻预载，进入编辑态零等待 —— */
  void (async () => {
    try {
      await ensureFonts(currentTemplate.fonts);
      templateBitmap = await loadTemplate(currentTemplate.src);
      overlayCache.set(currentTemplate.id, templateBitmap);
      qrBitmap = await loadTemplate(currentTemplate.qr.src);
      qrCache.set(currentTemplate.id, qrBitmap);
      canvas.style.aspectRatio = `${currentTemplate.width} / ${currentTemplate.height}`;
      layoutStage();
      syncAreaCenter();
      syncTplButtons();
      syncControls();
      syncFrameControls();
      updateNickHit();
      requestRender();
    } catch {
      setStatus('模板加载失败，请检查网络后刷新重试。', true, true);
    }
  })();

  /* —— WHERE ARE YOU?：位置确认 → ✦ YOU ARE HERE（地图章节联动） —— */
  const locSelect = darkroomRoot?.querySelector<HTMLSelectElement>('#wm-loc-select');
  const locConfirm = darkroomRoot?.querySelector<HTMLElement>('[data-loc-confirm]');
  const locDone = darkroomRoot?.querySelector<HTMLElement>('[data-loc-done]');
  locConfirm?.addEventListener('click', () => {
    const value = locSelect?.value ?? '';
    let lngLat: [number, number] | null = null;
    let name = '';
    for (const group of locGroups) {
      const hit = group.options.find(o => o.value === value);
      if (hit) {
        lngLat = hit.lngLat;
        name = hit.name;
        break;
      }
    }
    if (!lngLat) {
      setStatus('请先选择一个地区。', true);
      return;
    }
    window.dispatchEvent(
      new CustomEvent('anniv-you-are-here', { detail: { lngLat, name } }),
    );
    if (locDone) {
      locDone.hidden = false;
    }
    // 平滑回到地图章节，见证自己的光点亮
    document.querySelector('#where-we-are')?.scrollIntoView({
      behavior: REDUCED ? 'auto' : 'smooth',
      block: 'start',
    });
  });
}
