// Fig. 1 — an ink knowledge graph.
// Ink nodes are rules, data and infrastructure; red nodes are model calls.
// Pulses wander the graph and mostly stay in ink — the model is called only where needed.
import * as THREE from 'three';

type NodeDef = { id: string; label?: string; model?: boolean };

const NAMED: NodeDef[] = [
  { id: 'ontology', label: 'Ontology rules' },
  { id: 'crm', label: 'CRM sync' },
  { id: 'zoho', label: 'Zoho' },
  { id: 'sf', label: 'Salesforce' },
  { id: 'pd', label: 'Pipedrive' },
  { id: 'hook', label: 'Webhooks' },
  { id: 'rbac', label: 'RBAC' },
  { id: 'bull', label: 'BullMQ' },
  { id: 'redis', label: 'Redis' },
  { id: 'pgv', label: 'pgvector' },
  { id: 'neo', label: 'Neo4j' },
  { id: 'mongo', label: 'MongoDB' },
  { id: 'ocr', label: 'Tesseract' },
  { id: 'celery', label: 'Celery' },
  { id: 'pg', label: 'Postgres' },
  { id: 'llm', label: 'LLM', model: true },
  { id: 'clip', label: 'CLIP', model: true },
  { id: 'hf', label: 'Hugging Face', model: true },
  { id: 'rag', label: 'RAG', model: true },
];

const LINKS: [string, string][] = [
  ['zoho', 'crm'], ['sf', 'crm'], ['pd', 'crm'], ['crm', 'hook'], ['crm', 'rbac'],
  ['hook', 'bull'], ['bull', 'redis'], ['bull', 'llm'], ['celery', 'redis'], ['celery', 'pg'],
  ['pg', 'pgv'], ['pgv', 'rag'], ['pgv', 'clip'], ['mongo', 'rag'], ['rag', 'llm'],
  ['ocr', 'ontology'], ['ontology', 'neo'], ['neo', 'rag'], ['ontology', 'hf'], ['celery', 'llm'],
  ['ontology', 'crm'], ['rbac', 'hook'], ['mongo', 'clip'],
];

const FILLERS = 26;

function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function cssColor(name: string) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return new THREE.Color(v || '#000');
}

/* ── Shaders ───────────────────────────────────────────── */
const washVert = /* glsl */ `
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`;

const washFrag = /* glsl */ `
precision highp float;
uniform float uTime; uniform vec2 uRes; uniform vec2 uMouse; uniform float uMouseAmt;
uniform vec3 uInk; uniform float uStrength; uniform vec2 uCenter;
varying vec2 vUv;
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
float noise(vec2 p){ vec2 i=floor(p), f=fract(p); vec2 u=f*f*(3.0-2.0*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),u.x), mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x), u.y); }
float fbm(vec2 p){ float v=0.0, a=0.5; mat2 m=mat2(1.6,1.2,-1.2,1.6);
  for(int i=0;i<OCTAVES;i++){ v+=a*noise(p); p=m*p; a*=0.5; } return v; }
void main(){
  float asp = uRes.x / uRes.y;
  vec2 p = (vUv - 0.5) * vec2(asp, 1.0);
  float t = uTime * 0.035;
  vec2 q = vec2(fbm(p*1.5 + t), fbm(p*1.5 - t + 4.2));
  vec2 r = vec2(fbm(p*2.0 + 2.2*q + vec2(1.7,9.2) + t*1.4), fbm(p*2.0 + 2.2*q + vec2(8.3,2.8) - t));
  float f = fbm(p*1.7 + 2.6*r);
  vec2 c = uCenter * vec2(asp, 1.0);
  float m = smoothstep(1.05, 0.0, length((p - c) * vec2(0.85, 1.1)));
  vec2 mp = (uMouse - 0.5) * vec2(asp, 1.0);
  m += uMouseAmt * 0.6 * smoothstep(0.42, 0.0, length(p - mp));
  float ink = smoothstep(0.42, 0.9, f) * m;
  ink *= 0.72 + 0.28 * noise(p * 55.0);
  gl_FragColor = vec4(uInk, clamp(ink, 0.0, 1.0) * uStrength);
}`;

const edgeVert = /* glsl */ `
attribute float aRed; attribute float aHi;
varying float vRed; varying float vHi; varying float vDepth;
void main(){
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vRed = aRed; vHi = aHi; vDepth = -mv.z;
  gl_Position = projectionMatrix * mv;
}`;
const edgeFrag = /* glsl */ `
uniform vec3 uInk; uniform vec3 uAccent; uniform float uFade; uniform float uOpacity;
varying float vRed; varying float vHi; varying float vDepth;
void main(){
  float near = smoothstep(9.5, 5.0, vDepth);
  float a = mix(0.07, 0.42, near) + vHi * 0.55;
  vec3 col = mix(uInk, uAccent, smoothstep(0.35, 1.0, vRed));
  gl_FragColor = vec4(col, a * uFade * uOpacity);
}`;

const nodeVert = /* glsl */ `
attribute float aSize; attribute float aRed; attribute float aHi; attribute float aSeed;
uniform float uPx;
varying float vRed; varying float vHi; varying float vSeed; varying float vDepth;
void main(){
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vRed = aRed; vHi = aHi; vSeed = aSeed; vDepth = -mv.z;
  gl_PointSize = aSize * (1.0 + aHi * 0.6) * uPx * (7.0 / -mv.z);
  gl_Position = projectionMatrix * mv;
}`;
const nodeFrag = /* glsl */ `
uniform vec3 uInk; uniform vec3 uAccent; uniform vec3 uPaper; uniform float uFade;
varying float vRed; varying float vHi; varying float vSeed; varying float vDepth;
void main(){
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  float ang = atan(c.y, c.x);
  // a slightly irregular, brush-like edge
  float edge = 0.46 + 0.025 * sin(ang * 5.0 + vSeed * 6.28) + 0.015 * sin(ang * 11.0 + vSeed * 3.1);
  float fill = smoothstep(edge, edge - 0.06, d);
  float near = smoothstep(10.0, 5.0, vDepth);
  vec3 col = uInk;
  float a = fill;
  if (vRed > 0.5) {
    // model node: red core inside a thin red ring
    float core = smoothstep(0.24, 0.19, d);
    float ring = smoothstep(0.035, 0.0, abs(d - 0.40));
    col = uAccent;
    a = max(core, ring * 0.9);
  }
  a *= mix(0.35, 1.0, near);
  if (a < 0.01) discard;
  gl_FragColor = vec4(col, a * uFade);
}`;

const pulseFrag = /* glsl */ `
uniform vec3 uInk; uniform vec3 uAccent; uniform float uFade;
varying float vRed; varying float vHi; varying float vSeed; varying float vDepth;
void main(){
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.15, d);
  vec3 col = mix(uInk, uAccent, vRed);
  if (a < 0.01) discard;
  gl_FragColor = vec4(col, a * uFade * mix(0.4, 1.0, smoothstep(10.0, 5.0, vDepth)));
}`;

/* ── Scene ─────────────────────────────────────────────── */
export function mountInkGraph(host: HTMLElement, labelsHost: HTMLElement) {
  const isSmall = window.innerWidth < 768;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rand = rng(1027);

  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch {
    return () => {};
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isSmall ? 1.25 : 1.6));
  renderer.setClearColor(0x000000, 0);
  host.appendChild(renderer.domElement);
  renderer.domElement.setAttribute('aria-hidden', 'true');
  renderer.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;';

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 50);
  camera.position.set(0, 0, 7.4);

  const colors = { ink: cssColor('--ink'), accent: cssColor('--accent'), paper: cssColor('--paper') };

  /* Ink wash backdrop */
  const washU = {
    uTime: { value: 0 },
    uRes: { value: new THREE.Vector2(1, 1) },
    uMouse: { value: new THREE.Vector2(0.7, 0.5) },
    uMouseAmt: { value: 0 },
    uInk: { value: colors.ink },
    uStrength: { value: 0.16 },
    uCenter: { value: new THREE.Vector2(0.24, -0.12) },
  };
  const wash = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    new THREE.ShaderMaterial({
      vertexShader: washVert,
      fragmentShader: washFrag,
      uniforms: washU,
      defines: { OCTAVES: isSmall ? 4 : 5 },
      transparent: true,
      depthTest: false,
      depthWrite: false,
    }),
  );
  wash.frustumCulled = false;
  wash.renderOrder = -1;
  scene.add(wash);

  /* Graph data */
  const nodes: (NodeDef & { pos: THREE.Vector3; vel: THREE.Vector3 })[] = [];
  for (const n of NAMED) nodes.push({ ...n, pos: new THREE.Vector3(), vel: new THREE.Vector3() });
  for (let i = 0; i < FILLERS; i++) nodes.push({ id: `f${i}`, pos: new THREE.Vector3(), vel: new THREE.Vector3() });
  const index = new Map(nodes.map((n, i) => [n.id, i]));
  nodes.forEach((n) =>
    n.pos.set((rand() - 0.5) * 3, (rand() - 0.5) * 3, (rand() - 0.5) * 3),
  );

  const edgeSet = new Set<string>();
  const edges: [number, number][] = [];
  const addEdge = (a: number, b: number) => {
    if (a === b) return;
    const k = a < b ? `${a}-${b}` : `${b}-${a}`;
    if (edgeSet.has(k)) return;
    edgeSet.add(k);
    edges.push([a, b]);
  };
  for (const [a, b] of LINKS) addEdge(index.get(a)!, index.get(b)!);
  // fillers hang off random named nodes, and sometimes off each other
  for (let i = NAMED.length; i < nodes.length; i++) {
    addEdge(i, Math.floor(rand() * NAMED.length));
    if (rand() < 0.55) addEdge(i, NAMED.length + Math.floor(rand() * FILLERS));
  }

  // Force-directed layout, computed once.
  for (let it = 0; it < 420; it++) {
    const cool = 1 - it / 420;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const d = new THREE.Vector3().subVectors(nodes[i].pos, nodes[j].pos);
        const len = Math.max(d.length(), 0.05);
        const f = 0.018 / (len * len);
        d.multiplyScalar(f / len);
        nodes[i].vel.add(d);
        nodes[j].vel.sub(d);
      }
    }
    for (const [a, b] of edges) {
      const d = new THREE.Vector3().subVectors(nodes[b].pos, nodes[a].pos);
      const len = d.length();
      const f = (len - 0.62) * 0.045;
      d.multiplyScalar(f / Math.max(len, 0.001));
      nodes[a].vel.add(d);
      nodes[b].vel.sub(d);
    }
    for (const n of nodes) {
      n.vel.addScaledVector(n.pos, -0.012);
      n.pos.addScaledVector(n.vel, 0.85 * cool + 0.05);
      n.vel.multiplyScalar(0.6);
    }
  }
  // normalise to a radius and squash slightly into a lens
  const centre = new THREE.Vector3();
  nodes.forEach((n) => centre.add(n.pos));
  centre.divideScalar(nodes.length);
  let maxR = 0;
  nodes.forEach((n) => {
    n.pos.sub(centre);
    maxR = Math.max(maxR, n.pos.length());
  });
  nodes.forEach((n) => n.pos.multiplyScalar(1.75 / maxR).multiply(new THREE.Vector3(1.12, 0.95, 0.9)));

  const group = new THREE.Group();
  scene.add(group);

  /* Edges */
  const ePos = new Float32Array(edges.length * 6);
  const eRed = new Float32Array(edges.length * 2);
  const eHi = new Float32Array(edges.length * 2);
  edges.forEach(([a, b], i) => {
    nodes[a].pos.toArray(ePos, i * 6);
    nodes[b].pos.toArray(ePos, i * 6 + 3);
    eRed[i * 2] = nodes[a].model ? 1 : 0;
    eRed[i * 2 + 1] = nodes[b].model ? 1 : 0;
  });
  const eGeo = new THREE.BufferGeometry();
  eGeo.setAttribute('position', new THREE.BufferAttribute(ePos, 3));
  eGeo.setAttribute('aRed', new THREE.BufferAttribute(eRed, 1));
  const eHiAttr = new THREE.BufferAttribute(eHi, 1);
  eGeo.setAttribute('aHi', eHiAttr);
  const sharedU = {
    uInk: { value: colors.ink },
    uAccent: { value: colors.accent },
    uPaper: { value: colors.paper },
    uFade: { value: 0 },
    uOpacity: { value: 1 },
    uPx: { value: renderer.getPixelRatio() },
  };
  const edgeMesh = new THREE.LineSegments(
    eGeo,
    new THREE.ShaderMaterial({
      vertexShader: edgeVert,
      fragmentShader: edgeFrag,
      uniforms: sharedU,
      transparent: true,
      depthWrite: false,
    }),
  );
  group.add(edgeMesh);

  /* Nodes */
  const nPos = new Float32Array(nodes.length * 3);
  const nSize = new Float32Array(nodes.length);
  const nRed = new Float32Array(nodes.length);
  const nHi = new Float32Array(nodes.length);
  const nSeed = new Float32Array(nodes.length);
  nodes.forEach((n, i) => {
    n.pos.toArray(nPos, i * 3);
    nSize[i] = n.model ? 26 : n.label ? 11 : 5 + rand() * 3;
    nRed[i] = n.model ? 1 : 0;
    nSeed[i] = rand();
  });
  const nGeo = new THREE.BufferGeometry();
  nGeo.setAttribute('position', new THREE.BufferAttribute(nPos, 3));
  nGeo.setAttribute('aSize', new THREE.BufferAttribute(nSize, 1));
  nGeo.setAttribute('aRed', new THREE.BufferAttribute(nRed, 1));
  const nHiAttr = new THREE.BufferAttribute(nHi, 1);
  nGeo.setAttribute('aHi', nHiAttr);
  nGeo.setAttribute('aSeed', new THREE.BufferAttribute(nSeed, 1));
  const nodeMesh = new THREE.Points(
    nGeo,
    new THREE.ShaderMaterial({
      vertexShader: nodeVert,
      fragmentShader: nodeFrag,
      uniforms: sharedU,
      transparent: true,
      depthWrite: false,
    }),
  );
  group.add(nodeMesh);

  /* Pulses: random walks along edges */
  const adj: number[][] = nodes.map(() => []);
  edges.forEach(([a, b]) => {
    adj[a].push(b);
    adj[b].push(a);
  });
  const P = isSmall ? 14 : 26;
  const pulses = Array.from({ length: P }, () => {
    const from = Math.floor(rand() * nodes.length);
    const to = adj[from][Math.floor(rand() * adj[from].length)] ?? from;
    return { from, to, t: rand(), speed: 0.35 + rand() * 0.5 };
  });
  const pPos = new Float32Array(P * 3);
  const pRed = new Float32Array(P);
  const pSize = new Float32Array(P).fill(4.2);
  const pGeo = new THREE.BufferGeometry();
  const pPosAttr = new THREE.BufferAttribute(pPos, 3);
  const pRedAttr = new THREE.BufferAttribute(pRed, 1);
  pGeo.setAttribute('position', pPosAttr);
  pGeo.setAttribute('aRed', pRedAttr);
  pGeo.setAttribute('aSize', new THREE.BufferAttribute(pSize, 1));
  pGeo.setAttribute('aHi', new THREE.BufferAttribute(new Float32Array(P), 1));
  pGeo.setAttribute('aSeed', new THREE.BufferAttribute(new Float32Array(P), 1));
  const pulseMesh = new THREE.Points(
    pGeo,
    new THREE.ShaderMaterial({
      vertexShader: nodeVert,
      fragmentShader: pulseFrag,
      uniforms: sharedU,
      transparent: true,
      depthWrite: false,
    }),
  );
  pulseMesh.frustumCulled = false;
  group.add(pulseMesh);

  /* HTML labels */
  const labelEls = new Map<number, HTMLElement>();
  nodes.forEach((n, i) => {
    if (!n.label) return;
    const el = document.createElement('span');
    el.className = `ink-label${n.model ? ' is-model' : ''}`;
    el.textContent = n.label;
    labelsHost.appendChild(el);
    labelEls.set(i, el);
  });

  /* Layout & sizing */
  let W = 1, H = 1;
  const resize = () => {
    const r = host.getBoundingClientRect();
    W = Math.max(1, r.width);
    H = Math.max(1, r.height);
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    // On wide screens the graph sits to the right of the text; on narrow ones it sits up top.
    const wide = W / H > 1.05;
    group.position.set(wide ? 1.35 : 0, wide ? 0.15 : -0.1, 0);
    const s = wide ? 1 : Math.min(1, W / H + 0.1);
    group.scale.setScalar(s);
    washU.uCenter.value.set(wide ? 0.22 : 0.05, wide ? -0.05 : 0.12);
    camera.updateProjectionMatrix();
    washU.uRes.value.set(W, H);
    sharedU.uPx.value = renderer.getPixelRatio();
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(host);

  /* Interaction */
  const pointer = { x: 0.7, y: 0.5, nx: 0, ny: 0, inside: false };
  let dragging = false, lastX = 0, lastY = 0, velX = 0, velY = 0;
  let rotY = 0.4, rotX = -0.12;
  let hovered = -1;

  const onMove = (e: PointerEvent) => {
    const r = host.getBoundingClientRect();
    pointer.x = (e.clientX - r.left) / r.width;
    pointer.y = 1 - (e.clientY - r.top) / r.height;
    pointer.nx = pointer.x * 2 - 1;
    pointer.ny = pointer.y * 2 - 1;
    pointer.inside = pointer.x >= 0 && pointer.x <= 1 && pointer.y >= 0 && pointer.y <= 1;
    if (dragging) {
      velY = (e.clientX - lastX) * 0.005;
      velX = (e.clientY - lastY) * 0.003;
      rotY += velY;
      rotX = THREE.MathUtils.clamp(rotX + velX, -0.8, 0.8);
      lastX = e.clientX;
      lastY = e.clientY;
    }
  };
  const onDown = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return; // touch scrolls the page
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    host.style.cursor = 'grabbing';
  };
  const onUp = () => {
    dragging = false;
    host.style.cursor = '';
  };
  window.addEventListener('pointermove', onMove, { passive: true });
  host.addEventListener('pointerdown', onDown);
  window.addEventListener('pointerup', onUp);

  /* Theme */
  const onTheme = () => {
    colors.ink.copy(cssColor('--ink'));
    colors.accent.copy(cssColor('--accent'));
    colors.paper.copy(cssColor('--paper'));
    washU.uStrength.value = document.documentElement.dataset.theme === 'dark' ? 0.3 : 0.3;
  };
  onTheme();
  window.addEventListener('themechange', () => requestAnimationFrame(onTheme));

  /* Visibility: only render while on screen */
  let visible = true;
  const vis = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0 });
  vis.observe(host);

  /* Loop */
  let prev = performance.now();
  let elapsed = 0;
  const tmp = new THREE.Vector3();
  const world = new THREE.Vector3();
  const start = performance.now();
  let raf = 0;

  const frame = () => {
    raf = requestAnimationFrame(frame);
    if (!visible) return;
    const nowMs = performance.now();
    const dt = Math.min((nowMs - prev) / 1000, 0.05);
    prev = nowMs;
    elapsed += dt;
    const t = elapsed;

    // fade in
    const k = Math.min(1, (performance.now() - start) / 1800);
    sharedU.uFade.value = 1 - Math.pow(1 - k, 3);

    // rotation: slow drift + pointer parallax + drag inertia
    if (!dragging) {
      if (!reduce) rotY += dt * 0.06;
      rotY += velY;
      rotX = THREE.MathUtils.clamp(rotX + velX, -0.8, 0.8);
      velY *= 0.94;
      velX *= 0.9;
    }
    const scrollK = Math.min(1, window.scrollY / Math.max(1, H));
    group.rotation.y = rotY + pointer.nx * 0.18 + scrollK * 0.9;
    group.rotation.x = rotX - pointer.ny * 0.1 + scrollK * 0.2;
    sharedU.uOpacity.value = 1 - scrollK * 0.7;

    // ink wash follows the pointer softly
    washU.uTime.value = reduce ? 12 : t;
    washU.uMouse.value.lerp(new THREE.Vector2(pointer.x, pointer.y), 0.04);
    washU.uMouseAmt.value += ((pointer.inside ? 1 : 0) - washU.uMouseAmt.value) * 0.03;

    // pulses
    if (!reduce) {
      pulses.forEach((p, i) => {
        p.t += dt * p.speed;
        if (p.t >= 1) {
          p.t = 0;
          p.from = p.to;
          const options = adj[p.from];
          // bias toward ink: model nodes are entered less often
          let next = options[Math.floor(rand() * options.length)];
          if (nodes[next]?.model && rand() < 0.55) next = options[Math.floor(rand() * options.length)];
          p.to = next ?? p.from;
        }
        tmp.lerpVectors(nodes[p.from].pos, nodes[p.to].pos, p.t);
        tmp.toArray(pPos, i * 3);
        pRed[i] = nodes[p.to].model ? Math.min(1, p.t * 1.6) : nodes[p.from].model ? 1 - p.t : 0;
      });
      pPosAttr.needsUpdate = true;
      pRedAttr.needsUpdate = true;
    }

    group.updateMatrixWorld();

    // project labels, find hovered node
    let best = -1, bestD = 26 * 26;
    const mx = pointer.x * W, my = (1 - pointer.y) * H;
    nodes.forEach((n, i) => {
      world.copy(n.pos).applyMatrix4(group.matrixWorld);
      const depth = world.distanceTo(camera.position);
      world.project(camera);
      const sx = (world.x * 0.5 + 0.5) * W;
      const sy = (-world.y * 0.5 + 0.5) * H;
      if (n.label && pointer.inside) {
        const dx = sx - mx, dy = sy - my;
        const d2 = dx * dx + dy * dy;
        if (d2 < bestD) { bestD = d2; best = i; }
      }
      const el = labelEls.get(i);
      if (el) {
        const near = THREE.MathUtils.smoothstep(depth, 5.2, 9.2);
        const o = (1 - near) * 0.85 + 0.12 + (i === hovered ? 1 : 0);
        el.style.transform = `translate3d(${sx + 10}px, ${sy - 7}px, 0)`;
        el.style.opacity = String(Math.min(1, o) * sharedU.uFade.value * sharedU.uOpacity.value);
        el.classList.toggle('is-hot', i === hovered);
      }
    });

    if (best !== hovered) {
      hovered = best;
      nHi.fill(0);
      eHi.fill(0);
      if (hovered >= 0) {
        nHi[hovered] = 1;
        edges.forEach(([a, b], i) => {
          if (a === hovered || b === hovered) {
            eHi[i * 2] = eHi[i * 2 + 1] = 1;
            nHi[a === hovered ? b : a] = 0.5;
          }
        });
      }
      nHiAttr.needsUpdate = true;
      eHiAttr.needsUpdate = true;
      host.style.cursor = dragging ? 'grabbing' : 'grab';
    }

    renderer.render(scene, camera);
  };
  frame();

  return () => {
    cancelAnimationFrame(raf);
    ro.disconnect();
    vis.disconnect();
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerup', onUp);
    renderer.dispose();
  };
}
