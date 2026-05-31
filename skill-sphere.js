// ── Skills tech sphere ────────────────────────────────────────
// Progressive enhancement for the Tech Stack section: reads the existing
// skill "pills" (icon + label + brand colour) and arranges them on a slowly
// spinning 3D sphere — a CSS-3D tag cloud, no WebGL. Front-facing icons read
// in full brand colour with their label; back-facing icons recede and fade.
// If anything is missing or reduced-motion is on, the original pill grid stays
// as the fallback (the JS simply never flips the section to its live state).

const AUTO_YAW = 0.0022;   // resting spin speed (radians / frame ≈ 60fps)
const REST_PITCH = -0.18;  // gentle downward tilt at rest
const DRAG_GAIN = 0.0055;  // pointer pixels → radians
const PERSPECTIVE = 1.9;   // depth foreshortening (× radius); higher = flatter

export function initSkillSphere() {
  const prefersReducedMotion =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const root = document.getElementById('skill-sphere');
  if (!root) return;
  const stage = root.querySelector('.sphere__stage');
  if (!stage) return;

  // Pull the skill data straight out of the existing pills — single source of
  // truth, no duplicated list to keep in sync with the markup.
  const pills = Array.from(root.querySelectorAll('.stack__pills .pill'));
  if (prefersReducedMotion || pills.length === 0) return;

  const items = pills.map((pill) => {
    const ico = pill.querySelector('iconify-icon');
    return {
      icon: ico ? ico.getAttribute('icon') : '',
      label: pill.textContent.trim(),
      brand: (pill.style.getPropertyValue('--brand') || '').trim(),
    };
  }).filter((it) => it.icon);
  if (items.length === 0) return;

  // ── Build the DOM tags, one per skill ───────────────────────
  const tags = items.map((it) => {
    const tag = document.createElement('span');
    tag.className = 'sphere__tag';
    if (it.brand) tag.style.setProperty('--brand', it.brand);

    const icon = document.createElement('iconify-icon');
    icon.setAttribute('icon', it.icon);
    icon.setAttribute('aria-hidden', 'true');

    const label = document.createElement('span');
    label.className = 'sphere__label';
    label.textContent = it.label;

    tag.append(icon, label);
    stage.appendChild(tag);
    return tag;
  });

  // ── Distribute points evenly on a unit sphere (Fibonacci spiral) ──
  const N = tags.length;
  const golden = Math.PI * (3 - Math.sqrt(5));
  const points = tags.map((_, i) => {
    const y = 1 - (i / (N - 1 || 1)) * 2;       // 1 → -1
    const r = Math.sqrt(Math.max(0, 1 - y * y)); // ring radius at this y
    const theta = golden * i;
    return { x: Math.cos(theta) * r, y, z: Math.sin(theta) * r };
  });

  // ── State ────────────────────────────────────────────────────
  let radius = 0;
  let rotX = REST_PITCH;
  let rotY = 0;
  let velX = 0;
  let velY = AUTO_YAW;
  let dragging = false;
  let lastX = 0;
  let lastY = 0;
  let rafId = 0;
  let running = false;

  function resize() {
    const size = stage.clientWidth || root.clientWidth || 320;
    // Leave room around the equator for icons + labels so nothing clips.
    radius = size * 0.36;
  }

  function frame() {
    if (!dragging) {
      // Ease yaw back to the resting auto-spin and pitch back to rest.
      velY += (AUTO_YAW - velY) * 0.03;
      velX *= 0.9;
      rotX += (REST_PITCH - rotX) * 0.03;
    }
    rotY += velY;
    rotX += velX;

    const sinY = Math.sin(rotY), cosY = Math.cos(rotY);
    const sinX = Math.sin(rotX), cosX = Math.cos(rotX);
    const depthScale = PERSPECTIVE * radius;

    for (let i = 0; i < N; i++) {
      const p = points[i];
      // rotate around Y, then X
      const x1 = p.x * cosY - p.z * sinY;
      const z1 = p.x * sinY + p.z * cosY;
      const y2 = p.y * cosX - z1 * sinX;
      const z2 = p.y * sinX + z1 * cosX; // +1 front … -1 back

      const px = x1 * radius;
      const py = y2 * radius;
      const scale = (depthScale + z2 * radius) / (depthScale + radius);
      const depth = (z2 + 1) / 2; // 0 back … 1 front

      const tag = tags[i];
      tag.style.transform =
        `translate(-50%, -50%) translate3d(${px.toFixed(1)}px, ${(-py).toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
      tag.style.opacity = (0.25 + depth * 0.75).toFixed(3);
      tag.style.zIndex = String((depth * 100) | 0);
      tag.style.setProperty('--depth', depth.toFixed(3));
      // Back-facing icons shouldn't intercept clicks meant for front ones.
      tag.style.pointerEvents = depth > 0.55 ? 'auto' : 'none';
    }

    rafId = requestAnimationFrame(frame);
  }

  function start() {
    if (running) return;
    running = true;
    rafId = requestAnimationFrame(frame);
  }
  function stop() {
    running = false;
    cancelAnimationFrame(rafId);
  }

  // ── Pointer drag to spin ─────────────────────────────────────
  stage.addEventListener('pointerdown', (e) => {
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    stage.setPointerCapture?.(e.pointerId);
    stage.classList.add('is-grabbing');
  });
  stage.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;
    velY = dx * DRAG_GAIN;
    velX = -dy * DRAG_GAIN;
  });
  function endDrag(e) {
    if (!dragging) return;
    dragging = false;
    stage.releasePointerCapture?.(e.pointerId);
    stage.classList.remove('is-grabbing');
  }
  stage.addEventListener('pointerup', endDrag);
  stage.addEventListener('pointercancel', endDrag);

  // ── Lifecycle: pause when offscreen, react to resize ─────────
  const io = new IntersectionObserver((entries) => {
    if (entries[0]?.isIntersecting) start();
    else stop();
  }, { threshold: 0 });
  io.observe(root);

  window.addEventListener('resize', resize, { passive: true });

  // Go live: hide the fallback grid, reveal the sphere. Flip the class first so
  // the stage has its laid-out size before we measure the radius from it.
  root.classList.add('is-live');
  resize();
  start();
}
