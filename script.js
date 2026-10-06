'use strict';

// Preferencia de movimiento reducido (se consulta una vez al cargar).
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Devuelve true si el elemento está dentro del viewport y la pestaña está visible.
function isInViewport(el) {
  if (!el || document.hidden) return false;
  const r = el.getBoundingClientRect();
  return r.top < window.innerHeight && r.bottom > 0;
}

/* ==========================================================================
   Datos de assets (adaptados a los archivos reales del proyecto)
   ========================================================================== */

function range(base, ext, start, end, pad) {
  pad = pad === undefined ? 2 : pad;
  const out = [];
  for (let i = start; i <= end; i++) {
    out.push(base + String(i).padStart(pad, '0') + '.' + ext);
  }
  return out;
}

const BMG = {
  overview: {
    bullets: [
      'Sistema de administración empresarial multi-tier para gimnasios',
      'Gestión completa de clientes, personal, suscripciones y planes',
      'Roles y permisos administrados por perfil bajo principio de mínimo privilegio',
      'Desplegado en Railway con frontend en Cloudflare'
    ],
    images: range('assets/images/bmg/overview/bmg-overview-', 'jpeg', 1, 15)
  },
  auth: {
    bullets: [
      'Autenticación JWT con rotación de tokens asistida por refresh token con estado',
      'Autorización RBAC: permisos embebidos en el payload del token',
      'Control granular de acceso a módulos del sistema por perfil de usuario',
      'Administración de roles desde perfil administrador, sin acceso de clientes'
    ],
    images: ['bmg-auth-01', 'bmg-auth-02', 'bmg-auth-03', 'bmg-auth04', 'bmg-auth-05']
      .map((n) => 'assets/images/bmg/auth/' + n + '.jpeg')
  },
  edge: {
    bullets: [
      'Nodo edge (JavaFX + SQLite) para registro de asistencias con operación offline',
      'Sincronización diferencial con el backend mediante campos de auditoría',
      'Jobs programados de purga y población diaria de la base embebida',
      'Detector de anomalías: suscripciones vencidas, escaneos QR frecuentes o excesivos'
    ],
    images: range('assets/images/bmg/edge/bmg-edge-', 'jpeg', 1, 7)
  },
  analytics: {
    bullets: [
      'Motor de detección de anomalías configurable vía variables de entorno (12-Factor App)',
      'Reportes de ingresos y pérdidas por periodo o rango de fechas personalizado',
      'Gráfico de tendencia anual de ingresos y top clientes por inversión',
      'Análisis de rendimiento y venta de planes y promociones activas'
    ],
    images: range('assets/images/bmg/analytics/bmg-analytics-', 'jpeg', 1, 8)
  }
};

const ANTROPOS_GIFS = range('assets/images/antropos/gifs/antropos-gif-', 'gif', 1, 5);
const ANTROPOS_SCREENSHOTS = range('assets/images/antropos/screenshots/antropos-ss-', 'jpeg', 1, 8);

const ANTROPOS = {
  tabs: {
    exploracion: {
      hero: { type: 'image', src: 'assets/images/antropos/screenshots/antropos-ss-03.jpeg' },
      bullets: [
        'Recorrido en primera persona por salas temáticas del cuerpo humano',
        'Mapa interactivo para navegación entre sistemas corporales',
        'Sistema de inventario que registra el progreso del visitante',
        'Hub central con acceso a cada sala mediante portales temáticos'
      ]
    },
    sistemas: {
      hero: { type: 'image', src: 'assets/images/antropos/gifs/antropos-gif-01.gif' },
      bullets: [
        'Sala Sistema Circulatorio: modelos 3D del corazón y red vascular',
        'Sala Sistema Muscular: visualización de musculatura superficial y profunda',
        'Sala Sistema Nervioso: estructura cerebral y red nerviosa periférica',
        'Sala Sistema Óseo: esqueleto completo con piezas óseas individuales'
      ]
    },
    arte: {
      hero: { type: 'image', src: 'assets/images/antropos/screenshots/antropos-ss-01.jpeg' },
      bullets: [
        'Estética pixel-art para HUD: inventario, mapa minimapa y etiquetas de sala',
        'Ilustración 2D del menú principal con personajes anatómicos estilizados',
        'Modelado 3D de órganos, entornos y elementos interactivos de cada sala',
        'Integración coherente de UI 2D sobre entorno 3D navegable'
      ]
    },
    tecnologia: {
      hero: { type: 'image', src: 'assets/images/antropos/screenshots/antropos-ss-02.jpeg' },
      bullets: [
        'Engine: Unity3D con pipeline de renderizado estándar',
        'Lógica de juego y sistemas de navegación implementados en C#',
        'Modelado 3D de assets originales para órganos y arquitectura de salas',
        'Sistema de progreso persistente mediante inventario de sistemas visitados'
      ]
    }
  },
  carousel: ANTROPOS_GIFS.concat(ANTROPOS_SCREENSHOTS).map((src) => ({ type: 'image', src: src }))
};

// ---------------------------------------------------------------------------
// Experiencia — visor de evidencias
// ---------------------------------------------------------------------------

// Se admiten varios formatos: cada elemento declara su propia ruta con extensión.
const EVIDENCE_CONFIG = {
  vlln: {
    /// label: 'Propuestas de rediseño sobre un proyecto de práctica con datos ficticios',
    images: [
      { src: 'assets/images/experience/VLLN/evidences/exp-vlln-01.png', caption: 'Propuesta de dashboard centralizando para Ingresos/Egresos en el estilo actual de VEX.' },
      { src: 'assets/images/experience/VLLN/evidences/exp-vlln-02.png', caption: 'Propuesta de interfaz de prueba para Venta de Productos.' },
      { src: 'assets/images/experience/VLLN/evidences/exp-vlln-03.png', caption: 'Propuesta de interfaz de prueba para Compra de Productos a Proveedores.' },
      { src: 'assets/images/experience/VLLN/evidences/exp-vlln-04.png', caption: 'Propuesta de diseño siguiendo un estilo glass blur para el dashboad centralizando de Ingresos/Egresos en modo Dark.' },
      { src: 'assets/images/experience/VLLN/evidences/exp-vlln-05.png', caption: 'Propuesta de diseño siguiendo un estilo glass blur para el dashboad centralizando de Ingresos/Egresos en modo Light' }
    ]
  },
  cel: {
    images: [
      { src: 'assets/images/experience/CEL/evidences/exp-cel-01.png', caption: 'Por medio de UX, se simplifica la interacción con la sección de Avisos y Convocatorias.' },
      { src: 'assets/images/experience/CEL/evidences/exp-cel-02.png', caption: 'Se limpia y se generar páginas hijas para Convenios, accesibles mediante los logos de las instituciones.' },
      { src: 'assets/images/experience/CEL/evidences/exp-cel-03.png', caption: 'Simplificación de interfaz que presenta el material Make It Real!' },
      { src: 'assets/images/experience/CEL/evidences/exp-cel-04.png', caption: 'Se aclara el flujo para inscripción a convocatorias con capturas de pantalla del proceso más legibles.' },
      { src: 'assets/images/experience/CEL/evidences/exp-cel-05.png', caption: 'Se mejora la distribución y jerarquía del Personal con su información de Contacto.' }
    ]
  }
};

const EVIDENCE_AUTO_MS = 5000;
const EVIDENCE_MISSING = {};
const evidenceViewers = [];

function evidenceRetriggerFade(el) {
  el.style.animation = 'none';
  void el.offsetWidth;
  el.style.animation = '';
}

function initEvidenceViewer(rootEl, config) {
  const images = (config && config.images) || [];
  const n = images.length;
  if (n < 2) return;
  const label = config.label || '';

  let current = 0;
  let thumbs = [];
  for (let i = 1; i < n; i++) thumbs.push(i);

  let active = 0;
  let timer = null;
  let focused = false;
  let userPaused = false;
  let lightboxOpen = false;
  let visible = false;

  rootEl.innerHTML =
    '<button type="button" class="evidence__main">' +
      '<span class="evidence__stage">' +
        '<img class="evidence__img" width="1600" height="900" loading="lazy" decoding="async" alt="">' +
        '<img class="evidence__img" width="1600" height="900" loading="lazy" decoding="async" alt="" aria-hidden="true">' +
        (label ? '<span class="evidence__badge">' + label + '</span>' : '') +
        '<span class="expand-hint">' + icon('ri:fullscreen-line') + '</span>' +
        mediaBar(EVIDENCE_AUTO_MS) +
      '</span>' +
    '</button>' +
    '<div class="evidence__meta">' +
      '<p class="evidence__caption"></p>' +
      '<span class="evidence__counter"></span>' +
      (prefersReducedMotion ? '' : '<button type="button" class="evidence__pause" aria-pressed="false">Pausar</button>') +
      '<span class="evidence__live" aria-live="polite" aria-atomic="true"></span>' +
    '</div>' +
    '<div class="evidence__thumbs"></div>';

  const mainBtn = rootEl.querySelector('.evidence__main');
  const layers = rootEl.querySelectorAll('.evidence__img');
  const captionEl = rootEl.querySelector('.evidence__caption');
  const counterEl = rootEl.querySelector('.evidence__counter');
  const liveEl = rootEl.querySelector('.evidence__live');
  const pauseBtn = rootEl.querySelector('.evidence__pause');
  const thumbsWrap = rootEl.querySelector('.evidence__thumbs');

  function applyImg(el, src, alt) {
    if (EVIDENCE_MISSING[src]) {
      el.removeAttribute('src');
      el.classList.add('is-missing');
      el.alt = '';
      return;
    }
    el.classList.remove('is-missing');
    el.alt = alt || '';
    if (el.getAttribute('src') !== src) el.src = src;
  }

  function watchImg(el) {
    el.addEventListener('error', function () {
      const s = el.getAttribute('src');
      if (s) EVIDENCE_MISSING[s] = true;
      el.classList.add('is-missing');
    });
    el.addEventListener('load', function () {
      el.classList.remove('is-missing');
    });
  }

  layers.forEach(watchImg);

  const thumbButtons = [];
  for (let k = 0; k < n - 1; k++) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'evidence__thumb';
    const im = document.createElement('img');
    im.width = 1600;
    im.height = 900;
    im.loading = 'lazy';
    im.decoding = 'async';
    im.alt = '';
    watchImg(im);
    b.appendChild(im);
    (function (pos) {
      b.addEventListener('click', function () {
        goTo(thumbs[pos], true);
        scheduleAuto();
      });
    })(k);
    thumbsWrap.appendChild(b);
    thumbButtons.push(b);
  }

  function whenDecoded(img, cb) {
    if (img.classList.contains('is-missing')) { cb(); return; }
    if (typeof img.decode === 'function') {
      img.decode().then(cb).catch(cb);
    } else if (img.complete) {
      cb();
    } else {
      img.addEventListener('load', cb, { once: true });
      img.addEventListener('error', cb, { once: true });
    }
  }

  function showMain(index) {
    const inc = layers[1 - active];
    const out = layers[active];
    applyImg(inc, images[index].src, images[index].caption);
    inc.removeAttribute('aria-hidden');
    whenDecoded(inc, function () {
      inc.classList.add('is-active');
      out.classList.remove('is-active');
      out.setAttribute('aria-hidden', 'true');
      active = 1 - active;
    });
  }

  function renderThumbs() {
    for (let k = 0; k < thumbButtons.length; k++) {
      const idx = thumbs[k];
      applyImg(thumbButtons[k].querySelector('img'), images[idx].src, '');
      thumbButtons[k].setAttribute('aria-label', 'Ver imagen ' + (idx + 1) + ': ' + images[idx].caption);
    }
  }

  function updateLabels() {
    captionEl.textContent = images[current].caption;
    evidenceRetriggerFade(captionEl);
    counterEl.textContent = (current + 1) + ' / ' + n;
    mainBtn.setAttribute('aria-label', 'Ampliar imagen ' + (current + 1) + ' de ' + n);
  }

  function goTo(index, manual) {
    if (index === current || index < 0 || index >= n) return;
    const p = thumbs.indexOf(index);
    if (p === -1) return;
    const old = current;
    thumbs[p] = old;
    current = index;
    showMain(index);
    renderThumbs();
    updateLabels();
    if (manual) liveEl.textContent = 'Imagen ' + (current + 1) + ' de ' + n + ': ' + images[current].caption;
  }

  function shouldAutoRun() {
    return !prefersReducedMotion && visible && !document.hidden &&
      !focused && !userPaused && !lightboxOpen;
  }

  function scheduleAuto() {
    if (timer !== null) { clearTimeout(timer); timer = null; }
    const bar = rootEl.querySelector('.media-bar');
    if (!shouldAutoRun()) {
      if (bar) bar.style.animationPlayState = 'paused';
      return;
    }
    if (bar) {                       // reinicia la barra junto con el temporizador
      bar.style.animation = 'none';
      void bar.offsetWidth;
      bar.style.animation = '';
      bar.style.animationPlayState = 'running';
    }
    timer = setTimeout(function () {
      timer = null;
      if (!shouldAutoRun()) return;
      goTo((current + 1) % n, false);
      scheduleAuto();
    }, EVIDENCE_AUTO_MS);
  }

  mainBtn.addEventListener('click', function () {
    const gallery = images.map(function (im) {
      return { type: 'image', src: im.src, caption: im.caption };
    });
    openLightbox(gallery, current);
  });

  if (pauseBtn) {
    pauseBtn.addEventListener('click', function () {
      userPaused = !userPaused;
      pauseBtn.textContent = userPaused ? 'Reanudar' : 'Pausar';
      pauseBtn.setAttribute('aria-pressed', String(userPaused));
      scheduleAuto();
    });
  }

  rootEl.addEventListener('focusin', function () { focused = true; scheduleAuto(); });
  rootEl.addEventListener('focusout', function (e) {
    if (!rootEl.contains(e.relatedTarget)) { focused = false; scheduleAuto(); }
  });

  const io = new IntersectionObserver(function (entries) {
    visible = entries[0].isIntersecting;
    scheduleAuto();
  }, { threshold: 0.5 });
  io.observe(rootEl);

  applyImg(layers[0], images[0].src, images[0].caption);
  layers[0].removeAttribute('aria-hidden');
  whenDecoded(layers[0], function () { layers[0].classList.add('is-active'); });
  renderThumbs();
  updateLabels();
  scheduleAuto();

  evidenceViewers.push({
    updateAuto: scheduleAuto,
    setLightboxOpen: function (open) { lightboxOpen = open; scheduleAuto(); }
  });
}

document.addEventListener('visibilitychange', function () {
  evidenceViewers.forEach(function (v) { v.updateAuto(); });
});

/* ==========================================================================
   Experiencia — entrada/salida por visibilidad
   ---------------------------------------------------------------------------
   Al entrar al viewport: la fila (logo + texto) va de izquierda a derecha y
   el visor de derecha a izquierda. Al salir, cada uno vuelve desde el centro
   a su lado. Se dispara por visibilidad (IntersectionObserver), no por scroll.
   ========================================================================== */

(function () {
  const timeline = document.querySelector('.timeline--experience');
  if (!timeline || prefersReducedMotion) return;
  const entries = Array.prototype.slice.call(timeline.querySelectorAll('.timeline__entry'));
  if (!entries.length) return;

  const observer = new IntersectionObserver(function (list) {
    list.forEach(function (item) {
      item.target.classList.toggle('is-shown', item.isIntersecting);
    });
  }, { threshold: 0.15 });

  entries.forEach(function (entry) { observer.observe(entry); });
})();

/* ==========================================================================
   Certificaciones — tarjeta ligada al scroll (ambos sentidos)
   ---------------------------------------------------------------------------
   La tarjeta sube/aparece al entrar y baja/desaparece al salir, en función de
   su cercanía al centro del viewport. El signo del desplazamiento depende del
   lado: entra desde abajo (sube) o desde arriba (baja), y se revierte igual.
   La opacidad es proporcional al progreso, no un transition fijo.
   ========================================================================== */

(function () {
  const el = document.querySelector('.cert');
  if (!el || prefersReducedMotion) return;

  const RISE = 110;    // px de recorrido al entrar/salir
  const DEAD = 0.4;   // |d|/edge en que ya está visible
  const DELAY = 0.2;  // retraso: fracción de edge que espera antes de aparecer
  let frame = null;

  function update() {
    frame = null;
    const vh = window.innerHeight;
    const rect = el.getBoundingClientRect();
    const center = rect.top + rect.height / 2;
    const d = center - vh / 2;                 // + si está por debajo del centro
    const edge = vh / 2 + rect.height / 2;     // distancia al borde del viewport
    const start = edge * (1 - DELAY);          // aún oculto aquí
    const end = edge * DEAD;                   // ya visible aquí
    let p = (start - Math.abs(d)) / (start - end);
    if (p < 0) p = 0; else if (p > 1) p = 1;
    const dir = d >= 0 ? 1 : -1;
    el.style.opacity = String(p);
    el.style.transform = 'translateY(' + (dir * (1 - p) * RISE).toFixed(2) + 'px)';
  }

  function onScroll() {
    if (frame === null) frame = requestAnimationFrame(update);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();
})();

const ANTROPOS_LIGHTBOX = ANTROPOS.carousel;

let bmgTab = 'overview';
let bmgIndex = 0;
let bmgTimer = null;

/* ==========================================================================
   Utilidades de render
   ========================================================================== */

const IMG_EXTS = ['jpeg', 'png', 'jpg'];

function imgFallback(img) {
  const base = img.getAttribute('data-base');
  const current = img.getAttribute('data-ext') || 'jpeg';
  const idx = IMG_EXTS.indexOf(current);
  if (idx !== -1 && idx < IMG_EXTS.length - 1) {
    const next = IMG_EXTS[idx + 1];
    img.setAttribute('data-ext', next);
    img.src = base + '.' + next;
  }
}

function imgTag(src, alt, lazy) {
  const m = src.match(/^(.*)\.([a-z0-9]+)$/i);
  const base = m ? m[1] : src;
  const ext = m ? m[2].toLowerCase() : 'jpeg';
  const lazyAttr = lazy ? ' loading="lazy"' : '';
  return '<img src="' + src + '" alt="' + alt + '" draggable="false" data-base="' + base + '" data-ext="' + ext + '" onerror="imgFallback(this)"' + lazyAttr + '>';
}

function mediaInner(type, src, alt) {
  if (type === 'video') {
    const autoplay = prefersReducedMotion ? '' : ' autoplay';
    return '<video src="' + src + '"' + autoplay + ' muted loop playsinline></video>';
  }
  return imgTag(src, alt);
}

// Renderiza un icono inline del sprite. `key` es 'ri:nombre' o 'dev:nombre'.
function icon(key, cls) {
  const id = key.indexOf('dev:') === 0 ? 'i-dev-' + key.slice(4) : 'i-ri-' + key.slice(3);
  return '<svg class="icon' + (cls ? ' ' + cls : '') + '" aria-hidden="true"><use href="#' + id + '"></use></svg>';
}

function expandHint() {
  return '<span class="expand-hint">' + icon('ri:fullscreen-line') + '</span>';
}

// Intervalo del cambio automático de la imagen principal (duración de la barra).
const MEDIA_AUTO_MS = 5000;

function mediaBar(ms) {
  return '<span class="media-bar" style="--media-bar-dur:' + (ms || MEDIA_AUTO_MS) + 'ms"></span>';
}

function renderBullets(bullets) {
  return bullets
    .map((b, i) => '<li style="--i:' + i + '">' + b + '</li>')
    .join('');
}

function renderBMG(tabId) {
  bmgTab = tabId;
  bmgIndex = 0;
  const data = BMG[tabId];
  const body = document.getElementById('bmg-body');
  const main = data.images[0];
  const altBase = 'BMG GYM SYSTEM — ' + tabId;
  const duration = data.images.length * 4;

  body.innerHTML =
    '<div class="project-card__layout">' +
      '<figure class="project-card__media" data-type="image" data-src="' + main + '" data-index="0">' +
        mediaInner('image', main, altBase + ' principal') + expandHint() + mediaBar() +
      '</figure>' +
      '<ul class="project-card__bullets">' + renderBullets(data.bullets) + '</ul>' +
    '</div>' +
    '<div class="carousel" aria-label="Galería de ' + tabId + '">' +
      '<div class="carousel__track" id="bmg-carousel"></div>' +
    '</div>';

  buildCarousel(document.getElementById('bmg-carousel'), data.images.map(function (s) {
    return { type: 'image', src: s };
  }), { duration: duration, interactive: true });

  initDraggableMarquee(document.getElementById('bmg-carousel').closest('.carousel'), { duration: duration });

  updateBmgCarouselActive(main);
  startBmgAuto();
}

function renderAntropos(tabId) {
  const data = ANTROPOS.tabs[tabId];
  const body = document.getElementById('antropos-body');
  const hero = data.hero;
  const altBase = 'ANTROPOS — ' + tabId;
  const lbIndex = hero.type === 'video' ? 0 : antroposLbIndex(hero.src);

  body.innerHTML =
    '<div class="project-card__layout">' +
      '<figure class="project-card__media" data-type="' + hero.type + '" data-src="' + hero.src + '" data-lbindex="' + lbIndex + '">' +
        mediaInner(hero.type, hero.src, altBase) + expandHint() + (hero.type === 'image' ? mediaBar() : '') +
      '</figure>' +
      '<ul class="project-card__bullets">' + renderBullets(data.bullets) + '</ul>' +
    '</div>' +
    '<div class="carousel" aria-label="Galería de recursos de ANTROPOS">' +
      '<div class="carousel__track" id="antropos-carousel"></div>' +
    '</div>';

  buildCarousel(document.getElementById('antropos-carousel'), ANTROPOS.carousel, {
    duration: ANTROPOS.carousel.length * 6,
    interactive: true
  });

  initDraggableMarquee(document.getElementById('antropos-carousel').closest('.carousel'), {
    duration: ANTROPOS.carousel.length * 6
  });

  if (hero.type === 'image') {
    highlightAntroposItem(hero.src);
    startAntroposAuto();
  } else {
    stopAntroposAuto();
  }
}

function buildCarousel(trackEl, items, opts) {
  opts = opts || {};
  const duration = opts.duration || 32;
  const interactive = opts.interactive !== false;
  const doubled = items.concat(items);
  trackEl.style.setProperty('--marquee-duration', duration + 's');
  trackEl.innerHTML = doubled
    .map((item, i) => {
      const label = 'Recurso ' + ((i % items.length) + 1);
      const attrs = interactive
        ? ' role="button" tabindex="0"'
        : '';
      return '<div class="carousel__item"' + attrs +
        ' data-index="' + (i % items.length) + '" ' +
        'data-src="' + item.src + '" data-type="' + item.type + '" aria-label="' + label + '">' +
        imgTag(item.src, label, true) +
        '</div>';
    })
    .join('');
}

// Segundos que tarda cada item en cruzar la pantalla. Como la velocidad se
// normaliza por el nº de items, el conteo se cancela en la fórmula:
//   speed = (w / half) / T  →  itemStep / T   (independiente de cuántos items haya)
const CAROUSEL_SECONDS_PER_ITEM = 5;

function initDraggableMarquee(carouselEl, opts) {
  opts = opts || {};
  const track = carouselEl.querySelector('.carousel__track');
  if (!track || !track.children.length) return;

  // JS controla el transform; se elimina la animación CSS del marquee.
  track.style.animation = 'none';

  const items = Array.from(track.children);
  const half = Math.max(1, Math.floor(items.length / 2));
  const gap = 16;
  const duration = opts.duration || 26;
  const reverse = !!opts.reverse;

  let offset = 0;
  let speed = 0;
  let w = 0;
  let lastRender = null;
  let dragging = false;
  let hoverPaused = false;
  let horizontalIntent = null;
  let startX = 0;
  let startY = 0;
  let startOffset = 0;
  let pendingX = null;
  let pendingY = null;
  let lastTime = null;
  let rafId = null;
  let visible = false;
  let visibilityObserver = null;

  function measure() {
    w = 0;
    for (let i = 0; i < half; i++) {
      w += (items[i].offsetWidth || 0) + gap;
    }
    // Con movimiento reducido no hay auto-scroll (velocidad 0); solo se puede arrastrar.
    if (prefersReducedMotion) {
      speed = 0;
      return;
    }
    // Velocidad constante por item: divide el ancho total entre el nº de items
    // (half) y entre los segundos por item, así el conteo se cancela.
    speed = (w / half) / CAROUSEL_SECONDS_PER_ITEM * (reverse ? 1 : -1);
  }

  function wrap() {
    if (w <= 0) return;
    while (offset < -w) offset += w;
    while (offset > 0) offset -= w;
  }

  function render() {
    if (lastRender !== offset) {
      track.style.transform = 'translateX(' + offset + 'px)';
      lastRender = offset;
    }
  }

  function cleanup() {
    halt();
    window.removeEventListener('resize', measure);
    if (visibilityObserver) visibilityObserver.disconnect();
    document.removeEventListener('visibilitychange', updateMotion);
  }

  function step(t) {
    if (!carouselEl.isConnected) {
      cleanup();
      return;
    }
    if (lastTime == null) lastTime = t;
    const dt = Math.min((t - lastTime) / 1000, 0.05);
    lastTime = t;
    if (dragging) {
      if (horizontalIntent !== false && pendingX != null) {
        offset = Math.max(-w, Math.min(0, startOffset + (pendingX - startX)));
        pendingX = null;
      }
    } else if (!hoverPaused) {
      offset += speed * dt;
      wrap();
    }
    render();
    rafId = requestAnimationFrame(step);
  }

  function run() {
    if (rafId == null) {
      lastTime = null;
      rafId = requestAnimationFrame(step);
    }
  }

  function halt() {
    if (rafId != null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  function updateMotion() {
    if (dragging) {
      run();
      return;
    }
    if (visible && !document.hidden && !prefersReducedMotion) run();
    else halt();
  }

  function startDrag(clientX, clientY, immediate) {
    dragging = true;
    horizontalIntent = immediate ? true : null;
    startX = clientX;
    startY = clientY;
    startOffset = offset;
    pendingX = clientX;
    pendingY = clientY;
    run();
  }

  function onMove(clientX, clientY) {
    if (!dragging) return false;
    pendingX = clientX;
    pendingY = clientY;
    if (horizontalIntent == null) {
      const dx = pendingX - startX;
      const dy = pendingY - startY;
      if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) {
        horizontalIntent = true;
      } else if (Math.abs(dy) > 8) {
        horizontalIntent = false;
      }
    }
    if (horizontalIntent === false) {
      dragging = false;
    }
    return horizontalIntent === true;
  }

  function endDrag() {
    dragging = false;
    horizontalIntent = null;
    wrap();
    updateMotion();
  }

  carouselEl.addEventListener('mousedown', function (e) {
    if (e.button !== 0) return;
    startDrag(e.clientX, e.clientY, true);
    e.preventDefault();
  });
  window.addEventListener('mousemove', function (e) {
    if (dragging && horizontalIntent !== false) onMove(e.clientX, e.clientY);
  });
  window.addEventListener('mouseup', function () {
    if (dragging) endDrag();
  });

  carouselEl.addEventListener('mouseenter', function () {
    if (!dragging) hoverPaused = true;
  });
  carouselEl.addEventListener('mouseleave', function () {
    hoverPaused = false;
    lastTime = null;
  });

  carouselEl.addEventListener('touchstart', function (e) {
    startDrag(e.touches[0].clientX, e.touches[0].clientY, false);
  }, { passive: true });
  carouselEl.addEventListener('touchmove', function (e) {
    if (onMove(e.touches[0].clientX, e.touches[0].clientY)) {
      e.preventDefault();
    }
  }, { passive: false });
  carouselEl.addEventListener('touchend', function () {
    if (dragging) endDrag();
  }, { passive: true });
  carouselEl.addEventListener('touchcancel', function () {
    if (dragging) endDrag();
  }, { passive: true });

  window.addEventListener('resize', measure);

  visibilityObserver = new IntersectionObserver(function (entries) {
    visible = entries[0].isIntersecting;
    updateMotion();
  }, { rootMargin: '200px' });
  visibilityObserver.observe(carouselEl);

  document.addEventListener('visibilitychange', updateMotion);

  requestAnimationFrame(function () {
    measure();
    offset = reverse ? -w : 0;
    updateMotion();
  });
}

function swapMedia(mediaEl, type, src, alt) {
  mediaEl.classList.add('is-fading');
  setTimeout(function () {
    mediaEl.dataset.type = type;
    mediaEl.dataset.src = src;
    mediaEl.innerHTML = mediaInner(type, src, alt) + expandHint() + (type === 'image' ? mediaBar() : '');
    mediaEl.classList.remove('is-fading');
  }, 200);
}

function swapWithFade(bodyEl, renderFn) {
  bodyEl.classList.add('is-fading');
  setTimeout(function () {
    renderFn();
    bodyEl.classList.remove('is-fading');
  }, 180);
}

/* ==========================================================================
   BMG: auto-avance de la imagen principal + estado
   ========================================================================== */

function updateBmgMain() {
  const images = BMG[bmgTab].images;
  const src = images[bmgIndex];
  const media = document.querySelector('#bmg-body .project-card__media');
  if (!media) return;
  media.dataset.index = String(bmgIndex);
  swapMedia(media, 'image', src, 'BMG GYM SYSTEM — ' + bmgTab + ' ' + (bmgIndex + 1));
  updateBmgCarouselActive(src);
}

function updateBmgCarouselActive(src) {
  const track = document.getElementById('bmg-carousel');
  if (!track) return;
  track.querySelectorAll('.carousel__item').forEach(function (item) {
    item.classList.toggle('active', item.dataset.src === src);
  });
}

function startBmgAuto() {
  clearInterval(bmgTimer);
  if (prefersReducedMotion) return;
  bmgTimer = setInterval(function () {
    if (!isInViewport(document.getElementById('project-bmg'))) return;
    bmgIndex = (bmgIndex + 1) % BMG[bmgTab].images.length;
    updateBmgMain();
  }, MEDIA_AUTO_MS);
}

/* ==========================================================================
   ANTROPOS: índice en el lightbox + resaltado del recurso activo
   ========================================================================== */

function antroposLbIndex(src) {
  for (let i = 0; i < ANTROPOS.carousel.length; i++) {
    if (ANTROPOS.carousel[i].src === src) return i;
  }
  return 0;
}

function highlightAntroposItem(src) {
  const track = document.getElementById('antropos-carousel');
  if (!track) return;
  track.querySelectorAll('.carousel__item').forEach(function (item) {
    item.classList.toggle('active', item.dataset.src === src);
  });
}

function activateAntroposItem(item) {
  const media = document.querySelector('#project-antropos .project-card__media');
  swapMedia(media, item.dataset.type, item.dataset.src, 'Recurso ANTROPOS');
  media.dataset.lbindex = String(antroposLbIndex(item.dataset.src));
  highlightAntroposItem(item.dataset.src);
  startAntroposAuto();
}

let antroposTimer = null;

function currentAntroposResourceIndex() {
  const media = document.querySelector('#project-antropos .project-card__media');
  if (!media) return -1;
  const src = media.dataset.src;
  for (let i = 0; i < ANTROPOS.carousel.length; i++) {
    if (ANTROPOS.carousel[i].src === src) return i;
  }
  return -1;
}

function advanceAntroposHero() {
  const media = document.querySelector('#project-antropos .project-card__media');
  if (!media || media.dataset.type === 'video') return;
  const cur = currentAntroposResourceIndex();
  const next = cur === -1 ? 0 : (cur + 1) % ANTROPOS.carousel.length;
  const item = ANTROPOS.carousel[next];
  swapMedia(media, 'image', item.src, 'Recurso ANTROPOS');
  media.dataset.lbindex = String(next);
  highlightAntroposItem(item.src);
}

function startAntroposAuto() {
  clearInterval(antroposTimer);
  if (prefersReducedMotion) return;
  antroposTimer = setInterval(function () {
    if (!isInViewport(document.getElementById('project-antropos'))) return;
    advanceAntroposHero();
  }, MEDIA_AUTO_MS);
}

function stopAntroposAuto() {
  clearInterval(antroposTimer);
}

/* ==========================================================================
   Tabs de proyectos
   ========================================================================== */

function activateTab(cardEl, tabId) {
  cardEl.querySelectorAll('.tab').forEach(function (t) {
    const active = t.dataset.tab === tabId;
    t.classList.toggle('active', active);
    t.setAttribute('aria-selected', active ? 'true' : 'false');
  });
}

function renderProjectBody(cardEl, tabId) {
  if (cardEl.dataset.project === 'bmg') {
    renderBMG(tabId);
  } else {
    renderAntropos(tabId);
  }
}

function openProjectTab(project, tabId) {
  const card = document.getElementById('project-' + project);
  activateTab(card, tabId);
  swapWithFade(card.querySelector('.project-card__body'), function () {
    renderProjectBody(card, tabId);
  });
}

document.querySelectorAll('.project-card').forEach(function (card) {
  card.querySelectorAll('.tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      const tabId = tab.dataset.tab;
      activateTab(card, tabId);
      swapWithFade(card.querySelector('.project-card__body'), function () {
        renderProjectBody(card, tabId);
      });
    });
  });
});

/* ==========================================================================
   Delegación de clics: thumbnails, carrusel y lightbox
   ========================================================================== */

document.addEventListener('click', function (e) {
  const bmgCarouselItem = e.target.closest('#bmg-carousel .carousel__item');
  if (bmgCarouselItem) {
    bmgIndex = parseInt(bmgCarouselItem.dataset.index, 10) || 0;
    updateBmgMain();
    startBmgAuto();
    return;
  }

  const carouselItem = e.target.closest('#antropos-carousel .carousel__item');
  if (carouselItem) {
    activateAntroposItem(carouselItem);
    return;
  }

  const media = e.target.closest('.project-card__media');
  if (media) {
    const card = media.closest('.project-card');
    if (card.dataset.project === 'bmg') {
      const gallery = BMG[bmgTab].images.map(function (s) {
        return { type: 'image', src: s };
      });
      openLightbox(gallery, bmgIndex);
    } else {
      const idx = parseInt(media.dataset.lbindex, 10);
      openLightbox(ANTROPOS_LIGHTBOX, isNaN(idx) ? 0 : idx);
    }
  }
});

document.addEventListener('keydown', function (e) {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  const bmgCarouselItem = e.target.closest('#bmg-carousel .carousel__item');
  if (bmgCarouselItem) {
    e.preventDefault();
    bmgIndex = parseInt(bmgCarouselItem.dataset.index, 10) || 0;
    updateBmgMain();
    startBmgAuto();
    return;
  }
  const carouselItem = e.target.closest('#antropos-carousel .carousel__item');
  if (carouselItem) {
    e.preventDefault();
    activateAntroposItem(carouselItem);
  }
});

/* ==========================================================================
   Lightbox global
   ========================================================================== */

const lightbox = document.getElementById('lightbox');
const lightboxMedia = document.getElementById('lightboxMedia');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

let lbGallery = [];
let lbIndex = 0;
let lastFocused = null;

function renderLightboxMedia() {
  const item = lbGallery[lbIndex];
  if (!item) return;
  const autoplay = prefersReducedMotion ? '' : ' autoplay';
  if (item.type === 'video') {
    lightboxMedia.innerHTML = '<video src="' + item.src + '" controls' + autoplay + '></video>';
    return;
  }
  if (item.caption) {
    lightboxMedia.innerHTML =
      '<img src="' + item.src + '" alt="' + item.caption + '">' +
      '<span class="lightbox__caption">' + item.caption + '</span>';
    return;
  }
  lightboxMedia.innerHTML = imgTag(item.src, 'Vista ampliada');
}

function openLightbox(gallery, index) {
  lbGallery = gallery || [];
  lbIndex = index || 0;
  lastFocused = document.activeElement;
  renderLightboxMedia();
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  lightboxClose.focus();
  evidenceViewers.forEach(function (v) { v.setLightboxOpen(true); });
}

function stepLightbox(delta) {
  if (!lbGallery.length) return;
  lbIndex = (lbIndex + delta + lbGallery.length) % lbGallery.length;
  renderLightboxMedia();
}

function closeLightbox() {
  const video = lightboxMedia.querySelector('video');
  if (video) video.pause();
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  lightboxMedia.innerHTML = '';
  evidenceViewers.forEach(function (v) { v.setLightboxOpen(false); });
  if (lastFocused && typeof lastFocused.focus === 'function') {
    lastFocused.focus();
  }
}

lightboxClose.addEventListener('click', closeLightbox);

lightboxPrev.addEventListener('click', function () {
  stepLightbox(-1);
});

lightboxNext.addEventListener('click', function () {
  stepLightbox(1);
});

lightbox.addEventListener('click', function (e) {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    closeLightbox();
    return;
  }
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'ArrowLeft') {
    stepLightbox(-1);
  } else if (e.key === 'ArrowRight') {
    stepLightbox(1);
  } else if (e.key === 'Tab') {
    const focusable = [lightboxClose, lightboxPrev, lightboxNext];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
});

/* ==========================================================================
   Scrollspy (sidebar activo)
   ========================================================================== */

const spyItems = document.querySelectorAll('.sidebar__item');

function setActiveSection(id) {
  spyItems.forEach(function (it) {
    it.classList.toggle('active', it.dataset.section === id);
  });
}

const spyObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) setActiveSection(entry.target.id);
  });
}, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

['about', 'stack', 'experience', 'projects', 'certifications', 'education'].forEach(function (id) {
  const section = document.getElementById(id);
  if (section) spyObserver.observe(section);
});

/* ==========================================================================
   Sidebar: scroll al hacer clic + toggle móvil
   ========================================================================== */

const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');

function closeMenu() {
  sidebar.classList.remove('open');
  sidebarToggle.setAttribute('aria-expanded', 'false');
}

spyItems.forEach(function (item) {
  item.addEventListener('click', function (e) {
    e.preventDefault();
    const id = item.dataset.section;
    const target = document.getElementById(id);
    if (target) {
      if (!prefersReducedMotion) startBypass(id);
      target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    }
    closeMenu();
  });
});

sidebarToggle.addEventListener('click', function () {
  const open = sidebar.classList.toggle('open');
  sidebarToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
});

/* ==========================================================================
   Stack — modelo orbital
   ========================================================================== */

const STACK_DATA = [
  {
    id: 'cloud',
    label: 'Cloud',
    icon: 'ri:cloud-line',
    gridIndex: 0,
    corner: 'top-left',
    techs: [
      { name: 'AWS', icon: 'dev:amazonwebservices', interactive: true, project: 'bmg', tab: 'overview' },
      { name: 'Railway', icon: 'ri:train-line', interactive: true, project: 'bmg', tab: 'overview' },
      { name: 'Cloudflare', icon: 'dev:cloudflare', interactive: true, project: 'bmg', tab: 'overview' }
    ]
  },
  {
    id: 'backend',
    label: 'Backend',
    icon: 'ri:code-s-slash-line',
    gridIndex: 1,
    corner: null,
    techs: [
      { name: 'Java', icon: 'dev:java', interactive: true, project: 'bmg', tab: 'overview' },
      { name: 'Spring Boot 3', icon: 'dev:spring', interactive: true, project: 'bmg', tab: 'overview' },
      { name: 'API REST', icon: 'ri:global-line', interactive: true, project: 'bmg', tab: 'overview' },
      { name: 'JWT / RBAC', icon: 'ri:shield-keyhole-line', interactive: true, project: 'bmg', tab: 'auth' },
      { name: 'JPA / Hibernate', icon: 'dev:hibernate', interactive: true, project: 'bmg', tab: 'overview' },
      { name: 'Python', icon: 'dev:python', interactive: false },
      { name: 'Docker', icon: 'dev:docker', interactive: true, project: 'bmg', tab: 'overview' }
    ]
  },
  {
    id: 'databases',
    label: 'Databases',
    icon: 'ri:database-2-line',
    gridIndex: 2,
    corner: 'top-right',
    techs: [
      { name: 'PostgreSQL', icon: 'dev:postgresql', interactive: true, project: 'bmg', tab: 'overview' },
      { name: 'MySQL', icon: 'dev:mysql', interactive: false },
      { name: 'SQLite', icon: 'dev:sqlite', interactive: true, project: 'bmg', tab: 'edge' }
    ]
  },
  {
    id: 'frontend',
    label: 'Frontend',
    icon: 'ri:layout-line',
    gridIndex: 3,
    corner: 'bottom-left',
    techs: [
      { name: 'Angular v20+', icon: 'dev:angular', interactive: true, project: 'bmg', tab: 'overview' },
      { name: 'TypeScript', icon: 'dev:typescript', interactive: true, project: 'bmg', tab: 'overview' },
      { name: 'JavaScript', icon: 'dev:javascript', interactive: false },
      { name: 'HTML', icon: 'dev:html5', interactive: true, project: 'bmg', tab: 'overview' },
      { name: 'CSS', icon: 'dev:css3', interactive: true, project: 'bmg', tab: 'overview' },
      { name: 'JavaFX', icon: 'ri:window-2-line', interactive: true, project: 'bmg', tab: 'edge' }
    ]
  },
  {
    id: 'tools',
    label: 'Tools',
    icon: 'ri:tools-line',
    gridIndex: 4,
    corner: 'bottom-right',
    techs: [
      { name: 'Git', icon: 'dev:git', interactive: true, project: 'bmg', tab: 'overview' },
      { name: 'GitHub', icon: 'ri:github-fill', interactive: true, project: 'bmg', tab: 'overview' },
      { name: 'OpenCode', icon: 'ri:terminal-line', interactive: true, project: 'bmg', tab: 'overview' }
    ]
  }
];

const ORBIT_RADIUS    = 168;
const ORBIT_CENTER_Y  = 260;
const ORBIT_H_FOCUSED = 520;
const SAT_W           = 92;
const SAT_H           = 92;
const CAT_CARD_W      = 140;
const CAT_CARD_H      = 80;
const CAT_ACTIVE_W    = 160;
const CAT_ACTIVE_H    = 90;
const CAT_PILL_W      = 110;
const CAT_PILL_H      = 40;
const CORNER_OFFSET   = 64;
const SAT_STAGGER_MS  = 60;

let currentActiveCat = 'backend';
let resizeTimer = null;
let stackOrbitInView = false;
let satTimers = [];

function calcRestPositions(containerW) {
  const row1Y = 80;
  const row2Y = 220;
  const gapX = 20;
  const totalW3 = CAT_CARD_W * 3 + gapX * 2;
  const totalW2 = CAT_CARD_W * 2 + gapX;
  const startX3 = (containerW - totalW3) / 2;
  const startX2 = (containerW - totalW2) / 2;

  return [
    { left: startX3, top: row1Y },
    { left: startX3 + CAT_CARD_W + gapX, top: row1Y },
    { left: startX3 + (CAT_CARD_W + gapX) * 2, top: row1Y },
    { left: startX2, top: row2Y },
    { left: startX2 + CAT_CARD_W + gapX, top: row2Y }
  ];
}

function calcFocusPositions(containerW, activeId) {
  const activePos = {
    left: containerW / 2 - CAT_ACTIVE_W / 2,
    top: ORBIT_CENTER_Y - CAT_ACTIVE_H / 2
  };

  const corners = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
  const others = STACK_DATA
    .filter(function (c) { return c.id !== activeId; })
    .sort(function (a, b) { return a.gridIndex - b.gridIndex; });

  const cornerPositions = new Map();
  others.forEach(function (cat, i) {
    const corner = corners[i];
    const pos = {};
    if (corner.indexOf('top') !== -1) {
      pos.top = CORNER_OFFSET;
    } else {
      pos.top = ORBIT_H_FOCUSED - CORNER_OFFSET - CAT_PILL_H;
    }
    if (corner.indexOf('left') !== -1) {
      pos.left = CORNER_OFFSET;
    } else {
      pos.left = containerW - CORNER_OFFSET - CAT_PILL_W;
    }
    cornerPositions.set(cat.id, pos);
  });

  return { activePos: activePos, cornerPositions: cornerPositions };
}

function calcSatellitePositions(n, containerW) {
  const cx = containerW / 2;
  const cy = ORBIT_CENTER_Y;
  const startAngle = -Math.PI / 2;

  return Array.from({ length: n }, function (_, i) {
    const angle = startAngle + (2 * Math.PI / n) * i;
    return {
      left: cx + ORBIT_RADIUS * Math.cos(angle) - SAT_W / 2,
      top: cy + ORBIT_RADIUS * Math.sin(angle) - SAT_H / 2
    };
  });
}

function clearSatTimers() {
  satTimers.forEach(clearTimeout);
  satTimers = [];
}

function showSatellites() {
  clearSatTimers();
  document.querySelectorAll('#stack-orbit .satellite').forEach(function (sat, i) {
    if (prefersReducedMotion) {
      sat.classList.add('is-visible');
      return;
    }
    satTimers.push(setTimeout(function () {
      sat.classList.add('is-visible');
    }, 200 + i * SAT_STAGGER_MS));
  });
}

function hideSatellites() {
  clearSatTimers();
  document.querySelectorAll('#stack-orbit .satellite').forEach(function (sat) {
    sat.classList.remove('is-visible');
  });
}

function activateCategory(catId) {
  const orbit = document.getElementById('stack-orbit');
  if (!orbit || orbit.offsetParent === null) return;

  currentActiveCat = catId;
  const cw = orbit.offsetWidth;
  const calc = calcFocusPositions(cw, catId);
  const cat = STACK_DATA.find(function (c) { return c.id === catId; });
  if (!cat) return;

  orbit.classList.add('is-focused');

  orbit.querySelectorAll('.cat-card').forEach(function (card) {
    const id = card.dataset.catId;
    card.classList.remove('is-active', 'is-inactive');

    if (id === catId) {
      card.classList.add('is-active');
      card.style.left = calc.activePos.left + 'px';
      card.style.top = calc.activePos.top + 'px';
      card.style.width = CAT_ACTIVE_W + 'px';
      card.style.height = CAT_ACTIVE_H + 'px';
    } else {
      card.classList.add('is-inactive');
      const pos = calc.cornerPositions.get(id);
      card.style.left = pos.left + 'px';
      card.style.top = pos.top + 'px';
      card.style.width = CAT_PILL_W + 'px';
      card.style.height = CAT_PILL_H + 'px';
    }
  });

  orbit.querySelectorAll('.satellite').forEach(function (s) { s.remove(); });

  const satPositions = calcSatellitePositions(cat.techs.length, cw);

  cat.techs.forEach(function (tech, i) {
    const sat = document.createElement('div');
    sat.className = 'satellite' + (tech.interactive ? ' is-interactive' : '');

    if (tech.interactive) {
      sat.setAttribute('role', 'button');
      sat.setAttribute('tabindex', '0');
      sat.setAttribute('aria-label', tech.name + ' — ver en proyecto');
      sat.dataset.project = tech.project;
      sat.dataset.tab = tech.tab;
    }

    sat.style.left = satPositions[i].left + 'px';
    sat.style.top = satPositions[i].top + 'px';
    sat.style.animationDelay = (i * 0.4) + 's';

    sat.innerHTML =
      '<div class="satellite__inner">' +
        '<span class="satellite__icon">' + icon(tech.icon) + '</span>' +
        '<span class="satellite__name">' + tech.name + '</span>' +
      '</div>';

    if (tech.interactive) {
      sat.querySelector('.satellite__inner').style.animationDelay = (i * 0.5) + 's';
    }

    orbit.appendChild(sat);
  });

  if (prefersReducedMotion || stackOrbitInView) showSatellites();
}

function navigateToProject(project, tab) {
  const projectSection = document.getElementById('projects');
  if (projectSection) projectSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  openProjectTab(project, tab);
}

function initStack() {
  const orbit = document.getElementById('stack-orbit');
  const accordion = document.getElementById('stack-accordion');
  if (!orbit || !accordion) return;

  // --- Desktop: orbit ---
  STACK_DATA.forEach(function (cat) {
    const card = document.createElement('div');
    card.className = 'cat-card';
    card.dataset.catId = cat.id;
    card.setAttribute('aria-label', 'Categoría ' + cat.label);
    card.innerHTML =
      '<span class="cat-card__icon">' + icon(cat.icon) + '</span>' +
      '<span class="cat-card__label">' + cat.label + '</span>';
    orbit.appendChild(card);
  });

  requestAnimationFrame(function () {
    if (orbit.offsetParent === null) return;
    const cw = orbit.offsetWidth;
    const restPos = calcRestPositions(cw);
    orbit.querySelectorAll('.cat-card').forEach(function (card, i) {
      card.style.left = restPos[i].left + 'px';
      card.style.top = restPos[i].top + 'px';
    });
    activateCategory('backend');
  });

  // Los satélites entran cuando el orbit está cerca del centro del viewport,
  // y se invierten al salir. Rectángulo central reducido (35% arriba/abajo).
  if (!prefersReducedMotion) {
    const stackObserver = new IntersectionObserver(function (entries) {
      stackOrbitInView = entries[0].isIntersecting;
      if (stackOrbitInView) showSatellites();
      else hideSatellites();
    }, { rootMargin: '-35% 0px -35% 0px', threshold: 0 });
    stackObserver.observe(orbit);
  }

  orbit.addEventListener('click', function (e) {
    const card = e.target.closest('.cat-card');
    if (card) {
      if (card.dataset.catId !== currentActiveCat) activateCategory(card.dataset.catId);
      return;
    }
    const sat = e.target.closest('.satellite.is-interactive');
    if (sat) navigateToProject(sat.dataset.project, sat.dataset.tab);
  });

  orbit.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      const sat = e.target.closest('.satellite.is-interactive');
      if (sat) {
        e.preventDefault();
        navigateToProject(sat.dataset.project, sat.dataset.tab);
      }
    }
  });

  // --- Mobile: accordion ---
  STACK_DATA.forEach(function (cat) {
    const item = document.createElement('div');
    item.className = 'accordion-item';
    item.dataset.catId = cat.id;

    const techsHTML = cat.techs.map(function (t) {
      return '<div class="accordion-tech' + (t.interactive ? ' is-interactive' : '') + '"' +
        (t.interactive ? ' data-project="' + t.project + '" data-tab="' + t.tab + '" role="button" tabindex="0" aria-label="Ver ' + t.name + ' en proyectos"' : '') + '>' +
        '<span class="accordion-tech__icon">' + icon(t.icon) + '</span>' +
        '<span class="accordion-tech__name">' + t.name + '</span>' +
        '</div>';
    }).join('');

    item.innerHTML =
      '<button class="accordion-trigger" aria-expanded="false" aria-controls="acc-body-' + cat.id + '">' +
        '<span class="accordion-trigger__left">' +
          icon(cat.icon, 'accordion-trigger__icon') +
          '<span class="accordion-trigger__label">' + cat.label + '</span>' +
        '</span>' +
        icon('ri:arrow-down-s-line', 'accordion-trigger__chevron') +
      '</button>' +
      '<div class="accordion-body" id="acc-body-' + cat.id + '" role="region">' + techsHTML + '</div>';

    accordion.appendChild(item);
  });

  const defaultItem = accordion.querySelector('[data-cat-id="backend"]');
  if (defaultItem) {
    defaultItem.classList.add('is-open');
    defaultItem.querySelector('.accordion-trigger').setAttribute('aria-expanded', 'true');
  }

  accordion.addEventListener('click', function (e) {
    const trigger = e.target.closest('.accordion-trigger');
    if (trigger) {
      const item = trigger.closest('.accordion-item');
      const isOpen = item.classList.contains('is-open');
      accordion.querySelectorAll('.accordion-item.is-open').forEach(function (el) {
        el.classList.remove('is-open');
        el.querySelector('.accordion-trigger').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
      }
      return;
    }
    const tech = e.target.closest('.accordion-tech.is-interactive');
    if (tech) navigateToProject(tech.dataset.project, tech.dataset.tab);
  });

  accordion.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      const tech = e.target.closest('.accordion-tech.is-interactive');
      if (tech) {
        e.preventDefault();
        navigateToProject(tech.dataset.project, tech.dataset.tab);
      }
    }
  });

  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (orbit.offsetParent !== null) {
        activateCategory(currentActiveCat);
      }
    }, 200);
  });
}

initStack();

/* ==========================================================================
   Cursor glow
   ========================================================================== */

const glow = document.getElementById('cursor-glow');

// Solo en dispositivos con puntero preciso; en táctil no se activa.
if (window.matchMedia('(pointer: fine)').matches && glow) {
  window.addEventListener('mousemove', function (e) {
    glow.style.transform = 'translate(' + (e.clientX - 160) + 'px, ' + (e.clientY - 160) + 'px)';
  });
}

/* ==========================================================================
   Contact rail: copiar correo al portapapeles + toast
   ========================================================================== */

const emailCopyBtn = document.querySelector('.contact-rail__copy');
const toast = document.getElementById('toast');
let toastTimer = null;

function showToast() {
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () {
    toast.classList.remove('show');
  }, 2500);
}

function fallbackCopy(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand('copy');
  } catch (e) {
    /* ignore */
  }
  document.body.removeChild(textarea);
}

emailCopyBtn.addEventListener('click', function () {
  const email = emailCopyBtn.dataset.email || 'fernandogtz242@gmail.com';
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(email).then(showToast, function () {
      fallbackCopy(email);
      showToast();
    });
  } else {
    fallbackCopy(email);
    showToast();
  }
});

/* ==========================================================================
   Reveal repetible (IntersectionObserver)
   ---------------------------------------------------------------------------
   Animaciones restauradas de la versión original (translateY 32px / translateX
   ±40px / scale 0.95, 0.8s, escalonado por --reveal-delay) para todos los
   elementos que las tenían: hero, títulos, tarjetas, empleos, filas,
   carruseles, certificado e idiomas.
   Se conservan las mejoras:
   - `revealObserver` revela al entrar en la zona útil; `resetObserver` re-arma
     solo cuando el elemento salió por completo (+80px). La histéresis evita que
     en el borde el elemento entre y se cancele (bug del toggle original).
   - Un clic del sidebar no anima las secciones intermedias.
   - Movimiento reducido: todo visible desde el inicio.
   ========================================================================== */

const revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
const sectionHeads = Array.prototype.slice.call(document.querySelectorAll('.section-head'));

let bypassSectionId = null;
let bypassTimer = null;
let bypassSettleTimer = null;

function isInBypassTarget(el) {
  const section = el.closest('.section');
  return !!(section && section.id === bypassSectionId);
}

function revealEl(el) {
  // Salto desde el sidebar: las secciones intermedias se muestran sin animar.
  if (bypassSectionId !== null && !isInBypassTarget(el)) {
    el.classList.add('reveal-no-anim', 'revealed');
    return;
  }
  el.classList.add('revealed');
}

function resetRevealEl(el) {
  el.classList.remove('revealed', 'reveal-no-anim');
}

/* Dirección de scroll: única fuente, un único listener ligero (sin leer layout). */
let scrollDir = 'down';
let hasScrolled = false;
let lastScrollY = window.scrollY;
let lastScrollT = performance.now();
let scrollSpeed = 0;
let dirRaf = null;

function sampleScroll() {
  dirRaf = null;
  const y = window.scrollY;
  const t = performance.now();
  const dy = y - lastScrollY;
  const dt = Math.max(1, t - lastScrollT) / 1000;
  if (Math.abs(dy) >= 4) {                 // ignora inercia/rebote (< 4px)
    scrollDir = dy > 0 ? 'down' : 'up';
    lastScrollY = y;
    hasScrolled = true;
  }
  scrollSpeed = scrollSpeed * 0.7 + (Math.abs(dy) / dt) * 0.3;
  lastScrollT = t;
}

function onDirScroll() {
  if (dirRaf === null) dirRaf = requestAnimationFrame(sampleScroll);
}

/* Encabezados de sección: coreografía número / título / línea. */
function sectionHeadInstant(el) {
  if (scrollSpeed > 2500) return true;     // scroll muy rápido
  if (!hasScrolled) return false;          // carga: se anima (cuenta como bajada)
  const vh = window.innerHeight;
  const rect = el.getBoundingClientRect();
  const center = rect.top + rect.height / 2;
  return scrollDir === 'up' ? center > vh / 2 : center < vh / 2;
}

function showSectionHead(el) {
  if (el.classList.contains('is-shown')) return;   // no animar dos veces
  const up = scrollDir === 'up';
  el.classList.toggle('is-up', up);
  el.classList.toggle('is-down', !up);

  const instant = (bypassSectionId !== null && !isInBypassTarget(el)) || sectionHeadInstant(el);
  el.classList.add('reveal-no-anim');
  el.classList.remove('is-shown');
  if (instant) {
    el.classList.add('is-shown');
    return;
  }
  void el.offsetWidth;                              // fija el estado inicial de la dirección
  el.classList.remove('reveal-no-anim');
  el.classList.add('is-shown');
}

function hideSectionHead(el) {
  if (!el.classList.contains('is-shown')) return;
  el.classList.remove('is-shown');   // la línea se borra (derecha -> izquierda)
}

function resetSectionHead(el) {
  el.classList.remove('is-shown', 'is-up', 'is-down', 'reveal-no-anim');
}

function measureSectionLines() {
  sectionHeads.forEach(function (el) {
    el.classList.remove('no-line');
    const w = parseFloat(getComputedStyle(el, '::after').width);
    el.classList.toggle('no-line', isFinite(w) && w < 40);
  });
}

function refreshReveals() {
  if (prefersReducedMotion) return;
  const vh = window.innerHeight;
  revealEls.forEach(function (el) {
    const rect = el.getBoundingClientRect();
    if (rect.bottom > 0 && rect.top < vh) {
      el.classList.add('revealed');
    } else {
      resetRevealEl(el);
    }
  });
  sectionHeads.forEach(function (el) {
    const rect = el.getBoundingClientRect();
    if (rect.bottom > 0 && rect.top < vh) {
      showSectionHead(el);
    } else {
      resetSectionHead(el);
    }
  });
}

function onBypassScroll() {
  clearTimeout(bypassSettleTimer);
  bypassSettleTimer = setTimeout(endBypass, 150);
}

function startBypass(id) {
  bypassSectionId = id;
  const target = document.getElementById(id);
  if (target) scrollDir = target.getBoundingClientRect().top >= 0 ? 'down' : 'up';
  clearTimeout(bypassTimer);
  clearTimeout(bypassSettleTimer);
  window.addEventListener('scroll', onBypassScroll, { passive: true });
  bypassTimer = setTimeout(endBypass, 2500);
}

function endBypass() {
  if (bypassSectionId === null) return;
  bypassSectionId = null;
  clearTimeout(bypassTimer);
  clearTimeout(bypassSettleTimer);
  window.removeEventListener('scroll', onBypassScroll);
  refreshReveals();
}

// Los encabezados: aparecen con >=60% visible y se borran (con la línea) al
// acercarse a cualquiera de los dos bordes (~30% visible o menos). El margen
// recorta arriba y abajo por igual para que el borrado se vea en ambos sentidos.
const revealObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.target.classList.contains('section-head')) {
      const r = entry.isIntersecting ? entry.intersectionRatio : 0;
      if (r >= 0.6) showSectionHead(entry.target);
      else if (r <= 0.3) hideSectionHead(entry.target);
    } else if (entry.isIntersecting) {
      revealEl(entry.target);
    }
  });
}, { rootMargin: '-12% 0px -12% 0px', threshold: [0, 0.3, 0.6] });

// Re-arma solo cuando el elemento salió del todo del viewport, con 80px de
// holgura (histéresis que evita que el borde provoque reinicios repetidos).
const resetObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) return;
    if (entry.target.classList.contains('section-head')) resetSectionHead(entry.target);
    else resetRevealEl(entry.target);
  });
}, { rootMargin: '80px 0px 80px 0px', threshold: 0 });

if (prefersReducedMotion) {
  // Todo visible desde el inicio, sin desplazamiento ni repetición.
  revealEls.forEach(function (el) {
    el.classList.add('revealed');
  });
} else {
  // 1) ocultar sin transición (el estado oculto es el "antes").
  document.documentElement.classList.add('reveal-ready');
  revealEls.forEach(function (el) {
    el.classList.remove('revealed', 'reveal-no-anim');
  });
  sectionHeads.forEach(function (el) {
    el.classList.remove('is-shown', 'is-up', 'is-down', 'reveal-no-anim');
  });
  void document.documentElement.offsetHeight;
  // 2) habilitar transiciones y observar.
  document.documentElement.classList.add('reveal-transitions');
  revealEls.forEach(function (el) {
    revealObserver.observe(el);
    resetObserver.observe(el);
  });
  sectionHeads.forEach(function (el) {
    revealObserver.observe(el);
    resetObserver.observe(el);
  });

  measureSectionLines();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measureSectionLines);
  window.addEventListener('scroll', onDirScroll, { passive: true });
}

/* Línea vertical de Educación: crece de arriba a abajo cuando la sección está
   centrada en el viewport y se retrae de abajo hacia arriba al salir. */
(function () {
  const tl = document.querySelector('.timeline--education');
  if (!tl || prefersReducedMotion) return;
  const evLineObserver = new IntersectionObserver(function (entries) {
    tl.classList.toggle('is-shown', entries[0].isIntersecting);
  }, { rootMargin: '-30% 0px -30% 0px', threshold: 0 });
  evLineObserver.observe(tl);
})();

/* ==========================================================================
   Render inicial
   ========================================================================== */

document.querySelectorAll('.evidence').forEach(function (el) {
  const cfg = EVIDENCE_CONFIG[el.dataset.evidence];
  if (cfg) initEvidenceViewer(el, cfg);
});

renderBMG('overview');
renderAntropos('exploracion');

/* ==========================================================================
   Particles background
   ========================================================================== */

(function () {
  if (prefersReducedMotion) return;
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const styles = getComputedStyle(document.documentElement);
  const COLORS = [
    styles.getPropertyValue('--accent').trim() || '#9d4edd',
    styles.getPropertyValue('--accent-light').trim() || '#c77dff',
    '#7b2fd6',
    '#a855f7',
    '#5a189a'
  ];

  let particles = [];
  let width = 0;
  let height = 0;
  let rafId = null;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    spawn();
  }

  function spawn() {
    const count = Math.min(80, Math.max(35, Math.round((width * height) / 38000)));
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 0.8 + Math.random() * 1.6,
        vy: 0.06 + Math.random() * 0.22,
        sway: 0.3 + Math.random() * 0.7,
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: 0.002 + Math.random() * 0.005,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        alpha: 0.25 + Math.random() * 0.35
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    for (const p of particles) {
      p.phase += p.phaseSpeed;
      p.y -= p.vy;
      if (p.y < -12) {
        p.y = height + 12;
        p.x = Math.random() * width;
      }
      const x = p.x + Math.sin(p.phase) * p.sway * 18;
      const twinkle = 0.65 + 0.35 * Math.sin(p.phase * 3 + p.alpha * 10);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha * 0.25 * twinkle;
      ctx.beginPath();
      ctx.arc(x, p.y, p.r * 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = p.alpha * twinkle;
      ctx.beginPath();
      ctx.arc(x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    rafId = requestAnimationFrame(draw);
  }

  function start() {
    if (rafId == null) rafId = requestAnimationFrame(draw);
  }

  function stop() {
    if (rafId != null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop();
    else start();
  });

  resize();
  window.addEventListener('resize', resize);
  start();
})();
