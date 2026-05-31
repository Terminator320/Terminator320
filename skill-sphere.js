// ── Skills tech sphere ────────────────────────────────────────
// Progressive enhancement for the Tech Stack section: reads the existing
// skill "pills" (icon + label + brand colour) and arranges them on a slowly
// spinning 3D sphere — a CSS-3D tag cloud, no WebGL. A faint wireframe globe
// is drawn behind the icons on a canvas, rotating in sync. Front-facing icons
// read in full brand colour with their label; back-facing icons recede and
// fade. Tapping an icon makes it glow + active and parks the spin; tapping it
// again (or empty space) releases. If anything is missing or reduced-motion is
// on, the original pill grid stays as the fallback.

const AUTO_YAW = 0.0022;   // resting spin speed (radians / frame ≈ 60fps)
const REST_PITCH = -0.18;  // gentle downward tilt at rest
const DRAG_GAIN = 0.0055;  // pointer pixels → radians
const PERSPECTIVE = 1.9;   // depth foreshortening (× radius); higher = flatter
const TAP_SLOP = 6;        // px of movement still counted as a tap, not a drag
const WIRE_RGB = '113, 100, 245'; // --violet, for the wireframe globe lines

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

  // ── Wireframe globe canvas (sits behind the icons) ───────────
  const wire = document.createElement('canvas');
  wire.className = 'sphere__wire';
  wire.setAttribute('aria-hidden', 'true');
  stage.appendChild(wire);
  const ctx = wire.getContext('2d');

  // Precompute lat/long ring point sets once; each frame we just rotate +
  // project them rather than regenerating the geometry.
  const rings = buildRings();

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
  let cssSize = 0;
  let rotX = REST_PITCH;
  let rotY = 0;
  let velX = 0;
  let velY = AUTO_YAW;
  let dragging = false;
  let moved = false;
  let lastX = 0, lastY = 0, downX = 0, downY = 0;
  let pressTag = null;
  let activeTag = null;
  let rafId = 0;
  let running = false;

  function resize() {
    const size = stage.clientWidth || root.clientWidth || 320;
    cssSize = size;
    radius = size * 0.36;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    wire.width = Math.round(size * dpr);
    wire.height = Math.round(size * dpr);
    wire.style.width = wire.style.height = size + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function setActive(tag) {
    if (activeTag) activeTag.classList.remove('is-active');
    activeTag = tag;
    if (activeTag) activeTag.classList.add('is-active');
  }

  function frame() {
    if (dragging) {
      // pointer is driving the rotation directly
    } else if (activeTag) {
      // park the spin while an icon is selected so it stays readable
      velY *= 0.85;
      velX *= 0.85;
    } else {
      // ease yaw back to the resting auto-spin and pitch back to rest
      velY += (AUTO_YAW - velY) * 0.03;
      velX *= 0.9;
      rotX += (REST_PITCH - rotX) * 0.03;
    }
    rotY += velY;
    rotX += velX;

    const sinY = Math.sin(rotY), cosY = Math.cos(rotY);
    const sinX = Math.sin(rotX), cosX = Math.cos(rotX);
    const depthScale = PERSPECTIVE * radius;

    // Wireframe globe, same rotation as the icons.
    drawWire(sinY, cosY, sinX, cosX);

    for (let i = 0; i < N; i++) {
      const p = points[i];
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
      tag.style.zIndex = String(1 + ((depth * 100) | 0));
      tag.style.setProperty('--depth', depth.toFixed(3));
      // Back-facing icons shouldn't intercept taps meant for front ones.
      tag.style.pointerEvents = depth > 0.55 ? 'auto' : 'none';
    }

    rafId = requestAnimationFrame(frame);
  }

  function drawWire(sinY, cosY, sinX, cosX) {
    const c = cssSize / 2;
    ctx.clearRect(0, 0, cssSize, cssSize);
    ctx.lineWidth = 1;
    for (const ring of rings) {
      let prevX = 0, prevY = 0, prevD = 0, has = false;
      for (const [x, y, z] of ring) {
        const x1 = x * cosY - z * sinY;
        const z1 = x * sinY + z * cosY;
        const y2 = y * cosX - z1 * sinX;
        const z2 = y * sinX + z1 * cosX;
        const sx = c + x1 * radius;
        const sy = c - y2 * radius;
        const d = (z2 + 1) / 2;
        if (has) {
          ctx.beginPath();
          ctx.moveTo(prevX, prevY);
          ctx.lineTo(sx, sy);
          const a = 0.04 + ((d + prevD) / 2) * 0.2; // far side fainter
          ctx.strokeStyle = `rgba(${WIRE_RGB}, ${a.toFixed(3)})`;
          ctx.stroke();
        }
        prevX = sx; prevY = sy; prevD = d; has = true;
      }
    }
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

  // ── Pointer: drag to spin, tap to activate ───────────────────
  stage.addEventListener('pointerdown', (e) => {
    dragging = true;
    moved = false;
    lastX = downX = e.clientX;
    lastY = downY = e.clientY;
    pressTag = e.target.closest('.sphere__tag');
    stage.setPointerCapture?.(e.pointerId);
    stage.classList.add('is-grabbing');
  });
  stage.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    if (Math.hypot(e.clientX - downX, e.clientY - downY) > TAP_SLOP) moved = true;
    velY = (e.clientX - lastX) * DRAG_GAIN;
    velX = -(e.clientY - lastY) * DRAG_GAIN;
    lastX = e.clientX;
    lastY = e.clientY;
  });
  function endDrag(e) {
    if (!dragging) return;
    dragging = false;
    stage.releasePointerCapture?.(e.pointerId);
    stage.classList.remove('is-grabbing');
    if (!moved) {
      // a tap: toggle the pressed icon, or clear when tapping empty space
      if (pressTag) setActive(pressTag === activeTag ? null : pressTag);
      else setActive(null);
    }
    pressTag = null;
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

// Lat/long lattice for the wireframe globe, as arrays of unit-sphere points.
function buildRings() {
  const rings = [];
  const STEPS = 40;
  const circle = (fn) => {
    const pts = [];
    for (let s = 0; s <= STEPS; s++) pts.push(fn((s / STEPS) * Math.PI * 2));
    return pts;
  };
  // parallels at -60°…60°
  for (let li = -2; li <= 2; li++) {
    const lat = (li * Math.PI) / 6;
    rings.push(circle((t) => [
      Math.cos(lat) * Math.cos(t), Math.sin(lat), Math.cos(lat) * Math.sin(t),
    ]));
  }
  // meridians (great circles through the poles)
  for (let mi = 0; mi < 6; mi++) {
    const lon = (mi * Math.PI) / 6;
    rings.push(circle((t) => [
      Math.sin(t) * Math.cos(lon), Math.cos(t), Math.sin(t) * Math.sin(lon),
    ]));
  }
  return rings;
}
