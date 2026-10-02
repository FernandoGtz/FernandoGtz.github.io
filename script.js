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
      hero: { type: 'video', src: 'assets/videos/antropos/antropos-npc.mp4' },
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

const EXPERIENCE_IMAGES_VLLN = range('assets/images/experience/VLLN/carousel/exp-vlln-', 'png', 1, 21);
const EXPERIENCE_IMAGES_CEL = range('assets/images/experience/CEL/carousel/exp-cel-', 'gif', 1, 4);

const ANTROPOS_LIGHTBOX = [{ type: 'video', src: 'assets/videos/antropos/antropos-npc.mp4' }]
  .concat(ANTROPOS.carousel);

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
        mediaInner('image', main, altBase + ' principal') + expandHint() +
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
        mediaInner(hero.type, hero.src, altBase) + expandHint() +
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
    mediaEl.innerHTML = mediaInner(type, src, alt) + expandHint();
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
  }, 3000);
}

/* ==========================================================================
   ANTROPOS: índice en el lightbox + resaltado del recurso activo
   ========================================================================== */

function antroposLbIndex(src) {
  for (let i = 0; i < ANTROPOS.carousel.length; i++) {
    if (ANTROPOS.carousel[i].src === src) return i + 1;
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
  media.dataset.lbindex = String(next + 1);
  highlightAntroposItem(item.src);
}

function startAntroposAuto() {
  clearInterval(antroposTimer);
  if (prefersReducedMotion) return;
  antroposTimer = setInterval(function () {
    if (!isInViewport(document.getElementById('project-antropos'))) return;
    advanceAntroposHero();
  }, 3000);
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

function renderLightboxMedia() {
  const item = lbGallery[lbIndex];
  if (!item) return;
  const autoplay = prefersReducedMotion ? '' : ' autoplay';
  lightboxMedia.innerHTML = item.type === 'video'
    ? '<video src="' + item.src + '" controls' + autoplay + '></video>'
    : imgTag(item.src, 'Vista ampliada');
}

function openLightbox(gallery, index) {
  lbGallery = gallery || [];
  lbIndex = index || 0;
  renderLightboxMedia();
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function stepLightbox(delta) {
  if (!lbGallery.length) return;
  lbIndex = (lbIndex + delta + lbGallery.length) % lbGallery.length;
  renderLightboxMedia();
}

function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  lightboxMedia.innerHTML = '';
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
  item.addEventListener('click', function () {
    const target = document.getElementById(item.dataset.section);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
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
      { name: 'AWS', icon: 'dev:amazonwebservices', interactive: false },
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
      { name: 'Docker', icon: 'dev:docker', interactive: false }
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
      { name: 'Git', icon: 'dev:git', interactive: false },
      { name: 'GitHub', icon: 'ri:github-fill', interactive: false },
      { name: 'OpenCode', icon: 'ri:terminal-line', interactive: false }
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

    setTimeout(function () {
      sat.classList.add('is-visible');
    }, 200 + i * SAT_STAGGER_MS);
  });
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
   Reveal (IntersectionObserver)
   ========================================================================== */

const revealObserver = new IntersectionObserver(function (entries, observer) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(function (el) {
  revealObserver.observe(el);
});

/* ==========================================================================
   Render inicial
   ========================================================================== */

buildCarousel(document.getElementById('experience-carousel'), EXPERIENCE_IMAGES_CEL.map(function (src) {
  return { type: 'image', src: src };
}), { duration: 26, interactive: false });

initDraggableMarquee(document.getElementById('experience-carousel').closest('.carousel'), { duration: 26 });

buildCarousel(document.getElementById('experience-carousel-inline'), EXPERIENCE_IMAGES_VLLN.map(function (src) {
  return { type: 'image', src: src };
}), { duration: 26, interactive: false });

initDraggableMarquee(document.getElementById('experience-carousel-inline').closest('.carousel'), { duration: 26, reverse: true });

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
