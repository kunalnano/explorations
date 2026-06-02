import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import operatorGalaxy from "../assets/operator/m101-pinwheel.jpg";

// ── Typography ─────────────────────────────────────────────
const SERIF = "'Fraunces', Georgia, serif";
const MONO = "'JetBrains Mono', 'SF Mono', ui-monospace, monospace";
const AMBER = "#ffc878";

// ── Beats ──────────────────────────────────────────────────
const BEATS = [
  { id: "I",   line1: "Every system has a center.", line2: "Someone stands there." },
  { id: "II",  line1: "Pull back far enough",        line2: "and the center looks small." },
  { id: "III", line1: "What survives the distance",  line2: "is the work." },
];

function seededRandom(seed) {
  let value = seed;
  return () => {
    value += 0x6D2B79F5;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function createFallbackGalaxy(mount) {
  const canvas = document.createElement("canvas");
  canvas.style.position = "absolute";
  canvas.style.inset = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.display = "block";
  mount.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  const rand = seededRandom(91027);
  const stars = Array.from({ length: 2200 }, () => ({
    x: rand(),
    y: rand(),
    r: 0.2 + rand() * 1.45,
    a: 0.12 + rand() * 0.82,
    tw: rand() * Math.PI * 2,
    drift: 0.1 + rand() * 0.5,
    c: rand() > 0.78 ? "255,218,150" : rand() > 0.54 ? "130,190,255" : "255,255,255",
  }));
  const nebula = Array.from({ length: 12 }, () => ({
    x: 0.12 + rand() * 0.76,
    y: 0.14 + rand() * 0.7,
    radius: 0.18 + rand() * 0.36,
    alpha: 0.02 + rand() * 0.055,
    color: rand() > 0.52 ? "79,133,206" : "236,156,84",
  }));
  const arms = 6;
  const particles = Array.from({ length: 14500 }, (_, i) => {
    const arm = i % arms;
    const radius = Math.pow(rand(), 0.55);
    return {
      radius,
      theta: (arm / arms) * Math.PI * 2 + radius * 7.8 + (rand() - 0.5) * (0.42 + radius * 0.22),
      jitterX: (rand() - 0.5) * radius * 0.1,
      jitterY: (rand() - 0.5) * radius * 0.06,
      lift: (rand() - 0.5) * Math.pow(radius, 1.4) * 0.14,
      size: 0.22 + Math.pow(rand(), 2.5) * 1.75,
      alpha: 0.16 + rand() * 0.7,
      c: rand() > 0.82 ? "130,190,255" : rand() > 0.46 ? "255,210,132" : rand() > 0.18 ? "245,250,255" : "198,170,255",
      tw: rand() * Math.PI * 2,
      spark: rand() > 0.94,
    };
  });
  const filaments = Array.from({ length: 34 }, (_, i) => ({
    arm: i % arms,
    start: 0.16 + rand() * 0.2,
    end: 0.54 + rand() * 0.42,
    phase: rand() * Math.PI * 2,
    width: 0.5 + rand() * 1.2,
    alpha: 0.035 + rand() * 0.1,
    color: rand() > 0.54 ? "130,190,255" : "255,210,132",
  }));
  const dust = Array.from({ length: 2600 }, (_, i) => {
    const arm = i % arms;
    const radius = 0.16 + Math.pow(rand(), 0.68) * 0.88;
    return {
      radius,
      theta: (arm / arms) * Math.PI * 2 + radius * 8.1 + 0.22 + (rand() - 0.5) * 0.26,
      size: 1.1 + rand() * 4.4,
      alpha: 0.04 + rand() * 0.14,
    };
  });
  const comets = Array.from({ length: 14 }, () => ({
    x: rand(),
    y: 0.08 + rand() * 0.76,
    angle: -0.25 - rand() * 0.44,
    length: 0.08 + rand() * 0.2,
    speed: 0.02 + rand() * 0.07,
    alpha: 0.12 + rand() * 0.24,
  }));
  let width = 1;
  let height = 1;
  let frame = 0;
  let running = true;

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.max(1, mount.clientWidth);
    height = Math.max(1, mount.clientHeight);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const point = (x, y, size, color, alpha) => {
    ctx.fillStyle = `rgba(${color},${alpha})`;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  };

  const draw = (time = 0) => {
    if (!running) return;
    const t = time * 0.001;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, width, height);

    nebula.forEach((n) => {
      const x = n.x * width + Math.sin(t * 0.08 + n.x * 10) * width * 0.018;
      const y = n.y * height + Math.cos(t * 0.07 + n.y * 12) * height * 0.014;
      const r = n.radius * Math.max(width, height);
      const glow = ctx.createRadialGradient(x, y, 0, x, y, r);
      glow.addColorStop(0, `rgba(${n.color},${n.alpha})`);
      glow.addColorStop(0.5, `rgba(${n.color},${n.alpha * 0.34})`);
      glow.addColorStop(1, `rgba(${n.color},0)`);
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);
    });

    stars.forEach((s) => {
      const x = ((s.x + t * 0.003 * s.drift) % 1) * width;
      point(x, s.y * height, s.r, s.c, s.a * (0.72 + Math.sin(t + s.tw) * 0.22));
    });

    const cx = width * 0.5;
    const cy = height * 0.48;
    const rx = width * 0.38;
    const ry = height * 0.32;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(-0.34 + t * 0.026);
    ctx.scale(1, 0.54);

    ctx.globalCompositeOperation = "lighter";
    filaments.forEach((line) => {
      ctx.beginPath();
      for (let i = 0; i <= 36; i += 1) {
        const q = i / 36;
        const radius = line.start + (line.end - line.start) * q;
        const theta = (line.arm / arms) * Math.PI * 2 + radius * 8.05 + line.phase * 0.04 + t * 0.018;
        const wobble = Math.sin(q * Math.PI * 3.5 + line.phase + t * 0.42) * 0.018;
        const x = Math.cos(theta) * rx * (radius + wobble);
        const y = Math.sin(theta) * ry * (radius - wobble * 0.6);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `rgba(${line.color},${line.alpha})`;
      ctx.lineWidth = line.width;
      ctx.stroke();
    });

    particles.forEach((p) => {
      const theta = p.theta + t * (0.016 + (1 - p.radius) * 0.028);
      const x = Math.cos(theta) * rx * p.radius + p.jitterX * width;
      const y = Math.sin(theta) * ry * p.radius + p.jitterY * height + Math.sin(t * 0.62 + p.tw) * p.lift * height;
      const alpha = p.alpha * (0.8 + Math.sin(t * 1.3 + p.tw) * 0.16);
      point(x, y, p.size, p.c, alpha);
      if (p.spark) {
        ctx.fillStyle = `rgba(${p.c},${alpha * 0.44})`;
        ctx.fillRect(x - p.size * 2.6, y - 0.35, p.size * 5.2, 0.7);
        ctx.fillRect(x - 0.35, y - p.size * 2.6, 0.7, p.size * 5.2);
      }
    });

    ctx.globalCompositeOperation = "source-over";
    dust.forEach((d) => {
      const theta = d.theta + t * (0.014 + (1 - d.radius) * 0.025);
      point(Math.cos(theta) * rx * d.radius, Math.sin(theta) * ry * d.radius, d.size, "0,0,0", d.alpha);
    });

    const core = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.min(width, height) * 0.09);
    core.addColorStop(0, "rgba(255,250,230,1)");
    core.addColorStop(0.24, "rgba(255,200,120,0.7)");
    core.addColorStop(0.48, "rgba(120,190,255,0.18)");
    core.addColorStop(1, "rgba(255,200,120,0)");
    ctx.globalCompositeOperation = "lighter";
    ctx.fillStyle = core;
    ctx.beginPath();
    ctx.arc(0, 0, Math.min(width, height) * 0.16, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.globalCompositeOperation = "lighter";
    comets.forEach((comet) => {
      const x = ((comet.x + t * comet.speed) % 1) * width;
      const y = comet.y * height + Math.sin(t * 0.28 + comet.x * 8) * height * 0.045;
      const len = comet.length * width;
      const endX = x - Math.cos(comet.angle) * len;
      const endY = y - Math.sin(comet.angle) * len;
      const tail = ctx.createLinearGradient(x, y, endX, endY);
      tail.addColorStop(0, `rgba(255,236,198,${comet.alpha})`);
      tail.addColorStop(0.4, `rgba(130,190,255,${comet.alpha * 0.35})`);
      tail.addColorStop(1, "rgba(130,190,255,0)");
      ctx.strokeStyle = tail;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    });
    ctx.globalCompositeOperation = "source-over";

    frame = requestAnimationFrame(draw);
  };

  resize();
  draw();
  const observer = new ResizeObserver(resize);
  observer.observe(mount);

  return () => {
    running = false;
    cancelAnimationFrame(frame);
    observer.disconnect();
    if (mount.contains(canvas)) mount.removeChild(canvas);
  };
}

function browserSupportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
    return Boolean(gl);
  } catch {
    return false;
  }
}

function createRadialTexture(stops, size = 64) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const center = size / 2;
  const gradient = ctx.createRadialGradient(center, center, 0, center, center, center - 2);
  stops.forEach(([offset, color]) => gradient.addColorStop(offset, color));
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function createGalaxyDiskTexture(branches, size = 1024) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const rand = seededRandom(531903);
  const center = size / 2;
  const maxRadius = size * 0.46;

  const pointOnArm = (arm, radius, offset = 0) => {
    const angle = (arm / branches) * Math.PI * 2
      + Math.pow(radius, 0.82) * Math.PI * 4.85
      + offset
      + Math.sin(radius * 13 + arm) * 0.035;
    return {
      angle,
      x: center + Math.cos(angle) * maxRadius * radius,
      y: center + Math.sin(angle) * maxRadius * radius,
    };
  };

  ctx.clearRect(0, 0, size, size);

  const halo = ctx.createRadialGradient(center, center, 0, center, center, maxRadius);
  halo.addColorStop(0, "rgba(255,216,150,0.24)");
  halo.addColorStop(0.22, "rgba(255,178,96,0.11)");
  halo.addColorStop(0.58, "rgba(90,150,255,0.065)");
  halo.addColorStop(1, "rgba(90,150,255,0)");
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, size, size);

  ctx.globalCompositeOperation = "lighter";
  const ribbons = [
    { width: 38, alpha: 0.04, color: "255,168,86", offset: -0.09 },
    { width: 24, alpha: 0.07, color: "117,183,255", offset: 0.04 },
    { width: 11, alpha: 0.16, color: "255,232,190", offset: 0.13 },
  ];

  ribbons.forEach((ribbon) => {
    for (let arm = 0; arm < branches; arm += 1) {
      for (let i = 0; i < 126; i += 1) {
        const q0 = i / 126;
        const q1 = (i + 1) / 126;
        const radius0 = 0.045 + q0 * 0.91;
        const radius1 = 0.045 + q1 * 0.91;
        const p0 = pointOnArm(arm, radius0, ribbon.offset);
        const p1 = pointOnArm(arm, radius1, ribbon.offset);
        const fade = Math.max(0, 1 - q0 * 0.72);

        ctx.strokeStyle = `rgba(${ribbon.color},${ribbon.alpha * fade})`;
        ctx.lineWidth = ribbon.width * (0.3 + fade * 0.7);
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.stroke();
      }
    }
  });

  for (let i = 0; i < 34000; i += 1) {
    const arm = i % branches;
    const radius = 0.035 + Math.pow(rand(), 0.58) * 0.94;
    const spread = (0.013 + Math.pow(radius, 1.35) * 0.07) * maxRadius;
    const p = pointOnArm(arm, radius, (rand() - 0.5) * (0.18 + radius * 0.22));
    const tangent = p.angle + Math.PI / 2;
    const drift = (rand() - 0.5) * spread;
    const x = p.x + Math.cos(tangent) * drift;
    const y = p.y + Math.sin(tangent) * drift;
    const warm = rand() > 0.42;
    const color = warm ? "255,214,150" : rand() > 0.38 ? "142,198,255" : "244,248,255";
    const alpha = (0.04 + rand() * 0.28) * Math.max(0.22, 1 - radius * 0.34);
    const dotSize = 0.45 + Math.pow(rand(), 3.6) * 2.8;

    ctx.fillStyle = `rgba(${color},${alpha})`;
    ctx.beginPath();
    ctx.arc(x, y, dotSize, 0, Math.PI * 2);
    ctx.fill();
  }

  const core = ctx.createRadialGradient(center, center, 0, center, center, maxRadius * 0.24);
  core.addColorStop(0, "rgba(255,250,232,0.98)");
  core.addColorStop(0.23, "rgba(255,198,104,0.58)");
  core.addColorStop(0.55, "rgba(255,162,84,0.2)");
  core.addColorStop(1, "rgba(255,190,104,0)");
  ctx.fillStyle = core;
  ctx.beginPath();
  ctx.arc(center, center, maxRadius * 0.25, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

function createRealGalaxyPlate(size = 1400) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const rand = seededRandom(8675309);
  const center = size / 2;
  const radius = size * 0.45;
  const majorArms = 2;

  const armPoint = (arm, r, offset = 0) => {
    const phase = arm * Math.PI + Math.sin(r * 9.4 + arm) * 0.1 + offset;
    const angle = phase + 0.46 + Math.log1p(r * 7.2) * 1.34 + r * 2.62;
    return { angle, x: Math.cos(angle) * radius * r, y: Math.sin(angle) * radius * r };
  };

  ctx.clearRect(0, 0, size, size);
  ctx.save();
  ctx.translate(center, center);

  const halo = ctx.createRadialGradient(0, 0, 0, 0, 0, radius * 1.05);
  halo.addColorStop(0, "rgba(255,223,168,0.52)");
  halo.addColorStop(0.2, "rgba(255,190,110,0.24)");
  halo.addColorStop(0.58, "rgba(135,174,255,0.12)");
  halo.addColorStop(1, "rgba(55,90,180,0)");
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(0, 0, radius * 1.05, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalCompositeOperation = "lighter";
  const ribbonPasses = [
    { color: "255,222,170", width: 34, alpha: 0.075, offset: 0 },
    { color: "124,184,255", width: 22, alpha: 0.09, offset: 0.1 },
    { color: "255,250,232", width: 9, alpha: 0.16, offset: -0.07 },
  ];

  ribbonPasses.forEach((pass) => {
    for (let arm = 0; arm < majorArms; arm += 1) {
      ctx.beginPath();
      for (let i = 0; i <= 230; i += 1) {
        const q = i / 230;
        const r = 0.035 + q * 0.82;
        const p = armPoint(arm, r, pass.offset);
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.strokeStyle = `rgba(${pass.color},${pass.alpha})`;
      ctx.lineWidth = pass.width;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();
    }
  });

  for (let i = 0; i < 64000; i += 1) {
    const arm = i % majorArms;
    const r = 0.03 + Math.pow(rand(), 0.6) * 0.88;
    const armScatter = (0.015 + Math.pow(r, 1.25) * 0.105) * radius;
    const offset = (rand() - 0.5) * (0.16 + r * 0.24);
    const p = armPoint(arm, r, offset);
    const tangent = p.angle + Math.PI / 2;
    const along = (rand() - 0.5) * armScatter * 0.5;
    const across = (rand() - 0.5) * armScatter;
    const x = p.x + Math.cos(tangent) * across + Math.cos(p.angle) * along;
    const y = p.y + Math.sin(tangent) * across + Math.sin(p.angle) * along;
    const outer = Math.max(0, r - 0.22);
    const color = rand() > 0.76
      ? "125,188,255"
      : rand() > 0.5
        ? "255,224,168"
        : rand() > 0.18
          ? "246,249,255"
          : "191,174,255";
    const alpha = (0.032 + rand() * 0.3) * (1 - outer * 0.18);
    const dot = 0.35 + Math.pow(rand(), 3.2) * 2.2;
    ctx.fillStyle = `rgba(${color},${alpha})`;
    ctx.beginPath();
    ctx.arc(x, y, dot, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalCompositeOperation = "source-over";
  for (let arm = 0; arm < majorArms; arm += 1) {
    for (let lane = 0; lane < 3; lane += 1) {
      ctx.beginPath();
      for (let i = 0; i <= 190; i += 1) {
        const q = i / 190;
        const r = 0.1 + q * 0.72;
        const p = armPoint(arm, r, -0.18 - lane * 0.035);
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.strokeStyle = `rgba(3,2,1,${0.18 - lane * 0.035})`;
      ctx.lineWidth = 14 - lane * 3;
      ctx.lineCap = "round";
      ctx.stroke();
    }
  }

  ctx.globalCompositeOperation = "lighter";
  for (let i = 0; i < 520; i += 1) {
    const arm = i % majorArms;
    const r = 0.24 + Math.pow(rand(), 0.8) * 0.62;
    const p = armPoint(arm, r, (rand() - 0.5) * 0.18);
    const color = rand() > 0.72 ? "255,112,170" : "118,200,255";
    const glow = 2.2 + rand() * 5.6;
    const alpha = 0.13 + rand() * 0.28;
    const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glow * 3.5);
    g.addColorStop(0, `rgba(${color},${alpha})`);
    g.addColorStop(0.32, `rgba(${color},${alpha * 0.28})`);
    g.addColorStop(1, `rgba(${color},0)`);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(p.x, p.y, glow * 3.5, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.rotate(-0.16);
  const bar = ctx.createRadialGradient(0, 0, 0, 0, 0, radius * 0.32);
  bar.addColorStop(0, "rgba(255,248,230,0.96)");
  bar.addColorStop(0.34, "rgba(255,200,118,0.58)");
  bar.addColorStop(0.72, "rgba(255,156,82,0.2)");
  bar.addColorStop(1, "rgba(255,156,82,0)");
  ctx.fillStyle = bar;
  ctx.beginPath();
  ctx.ellipse(0, 0, radius * 0.34, radius * 0.12, 0, 0, Math.PI * 2);
  ctx.fill();

  const core = ctx.createRadialGradient(0, 0, 0, 0, 0, radius * 0.2);
  core.addColorStop(0, "rgba(255,255,238,1)");
  core.addColorStop(0.24, "rgba(255,218,142,0.82)");
  core.addColorStop(0.55, "rgba(255,176,92,0.34)");
  core.addColorStop(1, "rgba(255,176,92,0)");
  ctx.fillStyle = core;
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
  return canvas;
}

function RealGalaxyCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");
    const rand = seededRandom(123987);
    const galaxyImage = new Image();
    let galaxyReady = false;
    let galaxyFailed = false;
    let fallbackPlate = null;
    const stars = Array.from({ length: 1400 }, () => ({
      x: rand(),
      y: rand(),
      r: 0.35 + rand() * 1.55,
      a: 0.16 + rand() * 0.74,
      hue: rand() > 0.78 ? "126,184,255" : rand() > 0.54 ? "255,218,150" : "255,255,255",
      phase: rand() * Math.PI * 2,
    }));
    const streaks = Array.from({ length: 9 }, () => ({
      x: rand(),
      y: rand(),
      length: 0.06 + rand() * 0.16,
      speed: 0.02 + rand() * 0.055,
      alpha: 0.1 + rand() * 0.22,
    }));
    let width = 1;
    let height = 1;
    let frame = 0;
    let running = true;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const getFallbackPlate = () => {
      fallbackPlate = fallbackPlate || createRealGalaxyPlate();
      return fallbackPlate;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, canvas.clientWidth);
      height = Math.max(1, canvas.clientHeight);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (time = 0) => {
      if (!running) return;
      const t = time * 0.001;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#020203";
      ctx.fillRect(0, 0, width, height);

      const isCompact = width < 720;
      const galaxyCenterX = width * 0.5;
      const galaxyCenterY = height * (isCompact ? 0.77 : 0.84);
      const echoCenterY = height * (isCompact ? 0.68 : 0.74);

      const bg = ctx.createRadialGradient(galaxyCenterX, echoCenterY, 0, galaxyCenterX, echoCenterY, Math.max(width, height) * 0.72);
      bg.addColorStop(0, "rgba(82,74,86,0.2)");
      bg.addColorStop(0.36, "rgba(16,22,36,0.2)");
      bg.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      const galaxySource = galaxyReady ? galaxyImage : galaxyFailed ? getFallbackPlate() : null;
      if (galaxySource) {
        const imageWidth = galaxySource.naturalWidth || galaxySource.width;
        const imageHeight = galaxySource.naturalHeight || galaxySource.height;
        const coverScale = Math.max(width / imageWidth, height / imageHeight) * 1.18;
        const coverWidth = imageWidth * coverScale;
        const coverHeight = imageHeight * coverScale;

        ctx.save();
        ctx.globalAlpha = 0.26;
        ctx.filter = "blur(22px) saturate(1.25) contrast(1.08)";
        ctx.translate(galaxyCenterX, echoCenterY);
        ctx.rotate(Math.sin(t * 0.045) * 0.006);
        ctx.drawImage(galaxySource, -coverWidth / 2, -coverHeight / 2, coverWidth, coverHeight);
        ctx.restore();
        ctx.filter = "none";

        const drawSize = Math.min(
          Math.max(width * (isCompact ? 1.2 : 0.62), Math.min(width, height) * (isCompact ? 1.02 : 0.82)),
          height * (isCompact ? 0.68 : 0.76)
        );
        const driftX = Math.sin(t * 0.07) * width * 0.012;
        const driftY = Math.cos(t * 0.055) * height * 0.01;
        const zoom = 1.04 + Math.sin(t * 0.035) * 0.025 + (reduceMotion ? 0 : t * 0.0018);

        ctx.save();
        ctx.translate(galaxyCenterX + driftX, galaxyCenterY + driftY);
        ctx.rotate(Math.sin(t * 0.05) * 0.01);
        ctx.scale(zoom, zoom);
        ctx.globalCompositeOperation = "screen";
        ctx.globalAlpha = 0.98;
        ctx.filter = "saturate(1.22) contrast(1.12) brightness(1.04)";
        ctx.shadowColor = "rgba(116,174,255,0.24)";
        ctx.shadowBlur = 38;
        ctx.drawImage(galaxySource, -drawSize / 2, -drawSize / 2, drawSize, drawSize);
        ctx.restore();
        ctx.filter = "none";
        ctx.shadowBlur = 0;
      }

      stars.forEach((star) => {
        const alpha = star.a * (0.72 + Math.sin(t * 0.7 + star.phase) * 0.2);
        ctx.fillStyle = `rgba(${star.hue},${alpha})`;
        ctx.beginPath();
        ctx.arc(star.x * width, star.y * height, star.r, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalCompositeOperation = "lighter";
      streaks.forEach((streak) => {
        const x = ((streak.x + t * streak.speed) % 1) * width;
        const y = streak.y * height;
        const len = streak.length * width;
        const tail = ctx.createLinearGradient(x, y, x - len, y + len * 0.12);
        tail.addColorStop(0, `rgba(255,230,185,${streak.alpha})`);
        tail.addColorStop(0.5, `rgba(120,190,255,${streak.alpha * 0.28})`);
        tail.addColorStop(1, "rgba(120,190,255,0)");
        ctx.strokeStyle = tail;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - len, y + len * 0.12);
        ctx.stroke();
      });
      ctx.globalCompositeOperation = "source-over";

      const vignette = ctx.createRadialGradient(width * 0.5, height * 0.5, Math.min(width, height) * 0.22, width * 0.5, height * 0.5, Math.max(width, height) * 0.68);
      vignette.addColorStop(0, "rgba(0,0,0,0)");
      vignette.addColorStop(1, "rgba(0,0,0,0.42)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);

      if (!reduceMotion) frame = requestAnimationFrame(draw);
    };

    galaxyImage.decoding = "async";
    galaxyImage.onload = () => {
      galaxyReady = true;
      draw(performance.now());
    };
    galaxyImage.onerror = () => {
      galaxyFailed = true;
      draw(performance.now());
    };
    galaxyImage.src = operatorGalaxy;
    resize();
    draw();
    const observer = new ResizeObserver(() => {
      resize();
      draw(performance.now());
    });
    observer.observe(canvas);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1,
        width: "100%",
        height: "100%",
        display: "block",
        pointerEvents: "none",
      }}
    />
  );
}

export default function Operator({ onBegin }) {
  const mountRef = useRef(null);
  const [progress, setProgress] = useState(0);

  // Reset window scroll when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const contactFab = document.getElementById("contact-fab");
    if (!contactFab) return undefined;
    const previousDisplay = contactFab.style.display;
    contactFab.style.display = "none";
    return () => {
      contactFab.style.display = previousDisplay;
    };
  }, []);

  // ── Three.js scene ───────────────────────────────────────
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    if (navigator.webdriver || !browserSupportsWebGL()) {
      return createFallbackGalaxy(mount);
    }

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.0005);

    const camera = new THREE.PerspectiveCamera(
      52,
      mount.clientWidth / mount.clientHeight,
      0.1,
      5000
    );
    camera.position.set(-90, 360, 470);
    camera.lookAt(0, 0, 0);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    } catch {
      return createFallbackGalaxy(mount);
    }
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    // ── Galaxy ───────────────────────────────────────────
    const rand = seededRandom(771331);
    const sign = () => (rand() < 0.5 ? 1 : -1);
    const geometries = [];
    const materials = [];
    const textures = [];
    const RADIUS = 430;
    const BRANCHES = 7;
    const SPIN = 2.08;
    const RAND = 0.42;
    const RAND_POW = 2.65;
    const coreColor = new THREE.Color(0xffcf86);
    const armColor = new THREE.Color(0xf8fbff);
    const edgeColor = new THREE.Color(0x6ea5ff);
    const violetColor = new THREE.Color(0xc7a6ff);
    const tempColor = new THREE.Color();
    const diskTexture = createGalaxyDiskTexture(BRANCHES, mount.clientWidth < 700 ? 768 : 1024);
    const particleTexture = createRadialTexture([
      [0, "rgba(255,255,255,1)"],
      [0.24, "rgba(255,255,255,0.86)"],
      [0.64, "rgba(255,255,255,0.18)"],
      [1, "rgba(255,255,255,0)"],
    ], 64);
    const hazeTexture = createRadialTexture([
      [0, "rgba(255,255,255,0.5)"],
      [0.2, "rgba(255,255,255,0.18)"],
      [1, "rgba(255,255,255,0)"],
    ], 96);
    const flareTexture = createRadialTexture([
      [0, "rgba(255,248,220,1)"],
      [0.16, "rgba(255,200,120,0.48)"],
      [0.48, "rgba(110,170,255,0.16)"],
      [1, "rgba(255,200,120,0)"],
    ], 128);
    textures.push(diskTexture, particleTexture, hazeTexture, flareTexture);

    const galaxyGroup = new THREE.Group();
    galaxyGroup.rotation.x = -0.06;
    scene.add(galaxyGroup);

    const diskGeo = new THREE.PlaneGeometry(RADIUS * 2.35, RADIUS * 2.35);
    const diskMat = new THREE.MeshBasicMaterial({
      map: diskTexture,
      transparent: true,
      opacity: 0.82,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    geometries.push(diskGeo);
    materials.push(diskMat);
    const galaxyDisk = new THREE.Mesh(diskGeo, diskMat);
    galaxyDisk.rotation.x = -Math.PI / 2;
    galaxyDisk.position.y = -8;
    galaxyDisk.renderOrder = -2;
    galaxyGroup.add(galaxyDisk);

    const makeSpiralPosition = (i, randomRadius = rand()) => {
      const r = Math.pow(randomRadius, 0.52) * RADIUS;
      const normalized = r / RADIUS;
      const branchAngle = ((i % BRANCHES) / BRANCHES) * Math.PI * 2;
      const spinAngle = Math.pow(normalized, 0.84) * SPIN * Math.PI * 2;
      const scatter = Math.pow(rand(), RAND_POW) * RAND * r;
      const angle = branchAngle + spinAngle + (rand() - 0.5) * (0.08 + normalized * 0.14);
      return {
        r,
        normalized,
        x: Math.cos(angle) * r + scatter * sign() * 0.2,
        y: Math.pow(rand(), 3.2) * sign() * (2 + normalized * 28),
        z: Math.sin(angle) * r + scatter * sign() * 0.2,
      };
    };

    const GALAXY_COUNT = mount.clientWidth < 700 ? 76000 : 118000;
    const positions = new Float32Array(GALAXY_COUNT * 3);
    const colors = new Float32Array(GALAXY_COUNT * 3);
    for (let i = 0; i < GALAXY_COUNT; i += 1) {
      const i3 = i * 3;
      const p = makeSpiralPosition(i);
      positions[i3] = p.x;
      positions[i3 + 1] = p.y;
      positions[i3 + 2] = p.z;

      tempColor.copy(coreColor).lerp(armColor, Math.min(1, p.normalized * 1.2));
      tempColor.lerp(edgeColor, Math.max(0, p.normalized - 0.32) * 0.72);
      if (rand() > 0.86) tempColor.lerp(violetColor, 0.35);
      colors[i3] = tempColor.r;
      colors[i3 + 1] = tempColor.g;
      colors[i3 + 2] = tempColor.b;
    }

    const galaxyGeo = new THREE.BufferGeometry();
    galaxyGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    galaxyGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const galaxyMat = new THREE.PointsMaterial({
      size: 1.06,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.98,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      map: particleTexture,
    });
    geometries.push(galaxyGeo);
    materials.push(galaxyMat);
    const galaxy = new THREE.Points(galaxyGeo, galaxyMat);
    galaxyGroup.add(galaxy);

    const SPARK_COUNT = mount.clientWidth < 700 ? 4200 : 7600;
    const sparkPos = new Float32Array(SPARK_COUNT * 3);
    const sparkColors = new Float32Array(SPARK_COUNT * 3);
    for (let i = 0; i < SPARK_COUNT; i += 1) {
      const i3 = i * 3;
      const p = makeSpiralPosition(i, Math.pow(rand(), 1.4));
      sparkPos[i3] = p.x;
      sparkPos[i3 + 1] = p.y + sign() * rand() * 4;
      sparkPos[i3 + 2] = p.z;
      tempColor.copy(rand() > 0.64 ? coreColor : armColor).lerp(rand() > 0.5 ? edgeColor : violetColor, rand() * 0.28);
      sparkColors[i3] = tempColor.r;
      sparkColors[i3 + 1] = tempColor.g;
      sparkColors[i3 + 2] = tempColor.b;
    }
    const sparkGeo = new THREE.BufferGeometry();
    sparkGeo.setAttribute("position", new THREE.BufferAttribute(sparkPos, 3));
    sparkGeo.setAttribute("color", new THREE.BufferAttribute(sparkColors, 3));
    const sparkMat = new THREE.PointsMaterial({
      size: 2.25,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.92,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      map: particleTexture,
    });
    geometries.push(sparkGeo);
    materials.push(sparkMat);
    const sparkField = new THREE.Points(sparkGeo, sparkMat);
    galaxyGroup.add(sparkField);

    const NEBULA_COUNT = mount.clientWidth < 700 ? 3600 : 9200;
    const nebulaPos = new Float32Array(NEBULA_COUNT * 3);
    const nebulaColors = new Float32Array(NEBULA_COUNT * 3);
    for (let i = 0; i < NEBULA_COUNT; i += 1) {
      const i3 = i * 3;
      const p = makeSpiralPosition(i, Math.pow(rand(), 0.8));
      const spread = 1.15 + rand() * 0.38;
      nebulaPos[i3] = p.x * spread;
      nebulaPos[i3 + 1] = p.y + sign() * (8 + rand() * 34) * p.normalized;
      nebulaPos[i3 + 2] = p.z * spread;
      tempColor.copy(rand() > 0.5 ? edgeColor : coreColor).lerp(violetColor, rand() * 0.24);
      nebulaColors[i3] = tempColor.r;
      nebulaColors[i3 + 1] = tempColor.g;
      nebulaColors[i3 + 2] = tempColor.b;
    }
    const nebulaGeo = new THREE.BufferGeometry();
    nebulaGeo.setAttribute("position", new THREE.BufferAttribute(nebulaPos, 3));
    nebulaGeo.setAttribute("color", new THREE.BufferAttribute(nebulaColors, 3));
    const nebulaMat = new THREE.PointsMaterial({
      size: 14,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.2,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      map: hazeTexture,
    });
    geometries.push(nebulaGeo);
    materials.push(nebulaMat);
    const nebulaField = new THREE.Points(nebulaGeo, nebulaMat);
    galaxyGroup.add(nebulaField);

    const arcLines = [];
    for (let i = 0; i < 18; i += 1) {
      const radius = 58 + i * 23 + rand() * 8;
      const points = [];
      const phase = rand() * Math.PI * 2;
      for (let j = 0; j <= 180; j += 1) {
        const q = j / 180;
        const angle = q * Math.PI * 2;
        const warp = 1 + Math.sin(angle * 3 + phase) * 0.026;
        points.push(new THREE.Vector3(
          Math.cos(angle) * radius * warp,
          Math.sin(angle * 2 + phase) * (1.5 + i * 0.18),
          Math.sin(angle) * radius * 0.68 * warp
        ));
      }
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      const mat = new THREE.LineBasicMaterial({
        color: rand() > 0.5 ? 0x86c8ff : 0xffd08a,
        transparent: true,
        opacity: 0.055 + rand() * 0.075,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      geometries.push(geo);
      materials.push(mat);
      const line = new THREE.Line(geo, mat);
      line.rotation.y = rand() * Math.PI;
      line.userData.phase = phase;
      arcLines.push(line);
      galaxyGroup.add(line);
    }

    const filamentLines = [];
    for (let i = 0; i < 28; i += 1) {
      const angle = rand() * Math.PI * 2;
      const baseRadius = 24 + rand() * 210;
      const lift = 42 + rand() * 120;
      const points = [];
      for (let j = 0; j <= 28; j += 1) {
        const q = j / 28;
        const curl = angle + q * sign() * (0.12 + rand() * 0.18);
        const radius = baseRadius * (1 + q * 0.26);
        points.push(new THREE.Vector3(
          Math.cos(curl) * radius,
          (q - 0.45) * lift + Math.sin(q * Math.PI * 3 + angle) * 5,
          Math.sin(curl) * radius * 0.7
        ));
      }
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      const mat = new THREE.LineBasicMaterial({
        color: rand() > 0.5 ? 0x8ed7ff : 0xffc878,
        transparent: true,
        opacity: 0.04 + rand() * 0.08,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      geometries.push(geo);
      materials.push(mat);
      const line = new THREE.Line(geo, mat);
      line.userData.phase = rand() * Math.PI * 2;
      filamentLines.push(line);
      galaxyGroup.add(line);
    }

    const starGroup = new THREE.Group();
    const coreGeo = new THREE.SphereGeometry(0.72, 32, 32);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0xfff4dd });
    geometries.push(coreGeo);
    materials.push(coreMat);
    starGroup.add(new THREE.Mesh(coreGeo, coreMat));

    const glowMeshes = [];
    [
      { size: 1.8, opacity: 0.34 },
      { size: 3.4, opacity: 0.18 },
      { size: 6.8, opacity: 0.07 },
    ].forEach(({ size, opacity }) => {
      const g = new THREE.SphereGeometry(size, 32, 32);
      const m = new THREE.MeshBasicMaterial({
        color: 0xffc878,
        transparent: true,
        opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      geometries.push(g);
      materials.push(m);
      const mesh = new THREE.Mesh(g, m);
      glowMeshes.push(mesh);
      starGroup.add(mesh);
    });

    const flareSprites = [];
    [112, 42].forEach((size, index) => {
      const mat = new THREE.SpriteMaterial({
        map: flareTexture,
        color: index === 0 ? 0xffc878 : 0x8ecbff,
        transparent: true,
        opacity: index === 0 ? 0.68 : 0.36,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      materials.push(mat);
      const sprite = new THREE.Sprite(mat);
      sprite.scale.set(size, size, 1);
      sprite.userData.baseSize = size;
      flareSprites.push(sprite);
      starGroup.add(sprite);
    });
    galaxyGroup.add(starGroup);

    const BG_COUNT = mount.clientWidth < 700 ? 1800 : 3600;
    const bgPos = new Float32Array(BG_COUNT * 3);
    const bgColors = new Float32Array(BG_COUNT * 3);
    for (let i = 0; i < BG_COUNT; i += 1) {
      const i3 = i * 3;
      const r = 850 + rand() * 2200;
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      bgPos[i3] = r * Math.sin(phi) * Math.cos(theta);
      bgPos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      bgPos[i3 + 2] = r * Math.cos(phi);
      tempColor.copy(rand() > 0.72 ? edgeColor : armColor).lerp(coreColor, rand() * 0.14);
      bgColors[i3] = tempColor.r;
      bgColors[i3 + 1] = tempColor.g;
      bgColors[i3 + 2] = tempColor.b;
    }
    const bgGeo = new THREE.BufferGeometry();
    bgGeo.setAttribute("position", new THREE.BufferAttribute(bgPos, 3));
    bgGeo.setAttribute("color", new THREE.BufferAttribute(bgColors, 3));
    const bgMat = new THREE.PointsMaterial({
      size: 1.45,
      vertexColors: true,
      transparent: true,
      opacity: 0.74,
      depthWrite: false,
      map: particleTexture,
    });
    geometries.push(bgGeo);
    materials.push(bgMat);
    const backgroundStars = new THREE.Points(bgGeo, bgMat);
    scene.add(backgroundStars);

    const cometLines = [];
    for (let i = 0; i < 16; i += 1) {
      const length = 38 + rand() * 90;
      const geo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(-length, -length * (0.08 + rand() * 0.2), -length * (0.12 + rand() * 0.22)),
      ]);
      const mat = new THREE.LineBasicMaterial({
        color: rand() > 0.5 ? 0x8ecbff : 0xffd79b,
        transparent: true,
        opacity: 0.12 + rand() * 0.18,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      geometries.push(geo);
      materials.push(mat);
      const line = new THREE.Line(geo, mat);
      line.position.set(-900 + rand() * 1800, -260 + rand() * 520, -850 + rand() * 580);
      line.userData.baseX = line.position.x;
      line.userData.speed = 8 + rand() * 22;
      line.userData.phase = rand() * Math.PI * 2;
      cometLines.push(line);
      scene.add(line);
    }

    // ── Animation loop ───────────────────────────────────
    let frameId;
    let scrollProgress = 0;
    const pointer = { x: 0, y: 0 };
    const clock = new THREE.Clock();
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      const eased = scrollProgress < 0.5
        ? 4 * scrollProgress * scrollProgress * scrollProgress
        : 1 - Math.pow(-2 * scrollProgress + 2, 3) / 2;

      galaxyGroup.rotation.y = -0.18 + t * 0.02;
      galaxyGroup.rotation.z = Math.sin(t * 0.08) * 0.018;
      sparkField.rotation.y = t * 0.034;
      nebulaField.rotation.y = -t * 0.012;
      backgroundStars.rotation.y = t * 0.0028;
      backgroundStars.rotation.x = Math.sin(t * 0.05) * 0.006;
      const pulse = 1 + Math.sin(t * 1.4) * 0.035;
      glowMeshes.forEach((m) => m.scale.setScalar(pulse));
      flareSprites.forEach((sprite, index) => {
        const scale = sprite.userData.baseSize * (1 + Math.sin(t * 1.1 + index) * 0.045);
        sprite.scale.set(scale, scale, 1);
      });
      arcLines.forEach((line, index) => {
        line.rotation.y += 0.00045 + index * 0.000012;
        line.material.opacity = 0.045 + Math.sin(t * 0.7 + line.userData.phase) * 0.018 + index * 0.0015;
      });
      filamentLines.forEach((line, index) => {
        line.rotation.y += 0.00028 * (index % 2 === 0 ? 1 : -1);
        line.material.opacity = 0.035 + Math.sin(t * 0.5 + line.userData.phase) * 0.016;
      });
      cometLines.forEach((line) => {
        line.position.x = ((line.userData.baseX + t * line.userData.speed + 1100) % 2200) - 1100;
        line.position.y += Math.sin(t * 0.4 + line.userData.phase) * 0.012;
      });

      camera.position.x = -90 + eased * 220 + Math.sin(t * 0.17) * 9 + pointer.x * 18;
      camera.position.y = 360 + eased * 130 + Math.cos(t * 0.13) * 7 - pointer.y * 14;
      camera.position.z = 470 + eased * 440 + Math.sin(t * 0.11) * 12;
      camera.lookAt(Math.sin(t * 0.09) * 18, Math.sin(t * 0.07) * 8, 0);
      renderer.render(scene, camera);
    };
    animate();

    // ── Scroll coupling ──────────────────────────────────
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const p = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
      scrollProgress = p;
      setProgress(p);
    };

    const handlePointer = (event) => {
      pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    const handleResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("pointermove", handlePointer, { passive: true });
    window.addEventListener("resize", handleResize);
    handleScroll();

    // ── Cleanup ──────────────────────────────────────────
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("pointermove", handlePointer);
      window.removeEventListener("resize", handleResize);
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
      textures.forEach((texture) => texture.dispose());
      renderer.dispose();
    };
  }, []);

  // ── Render ───────────────────────────────────────────────
  return (
    <div style={{ background: "#000", color: "#fff", minHeight: "100vh", position: "relative", fontFamily: SERIF }}>
      {/* WebGL canvas */}
      <div ref={mountRef} style={{ position: "fixed", inset: 0, zIndex: 0 }} />
      <RealGalaxyCanvas />

      {/* Vignette */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 10,
          pointerEvents: "none",
          background: "radial-gradient(ellipse at center, transparent 0%, transparent 58%, rgba(0,0,0,0.42) 100%)",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "48vh",
          zIndex: 11,
          pointerEvents: "none",
          background: "linear-gradient(180deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.72) 44%, rgba(0,0,0,0) 100%)",
        }}
      />

      {/* Top chrome */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 30, padding: "24px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: AMBER, boxShadow: `0 0 12px ${AMBER}` }} />
          <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.35em", color: "rgba(255,236,200,0.7)" }}>
            OPERATOR
          </span>
        </div>
        <button
          onClick={onBegin}
          style={{
            fontFamily: MONO,
            fontSize: 10,
            letterSpacing: "0.35em",
            color: "rgba(255,236,200,0.75)",
            background: "transparent",
            border: "1px solid rgba(255,236,200,0.2)",
            borderRadius: 999,
            padding: "8px 16px",
            cursor: "pointer",
            transition: "all 0.25s ease",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,236,200,0.5)"; e.currentTarget.style.color = "#ffecc8"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,236,200,0.2)"; e.currentTarget.style.color = "rgba(255,236,200,0.75)"; }}
        >
          SKIP INTRO →
        </button>
      </div>

      {/* Scroll progress */}
      <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 30, fontFamily: MONO }}>
        <div style={{ fontSize: 10, letterSpacing: "0.3em", color: "rgba(255,236,200,0.45)", marginBottom: 8, textAlign: "right" }}>
          {String(Math.round(progress * 100)).padStart(3, "0")}
        </div>
        <div style={{ width: 96, height: 1, background: "rgba(255,255,255,0.1)" }}>
          <div style={{ width: `${progress * 100}%`, height: "100%", background: `linear-gradient(90deg, ${AMBER}, #ffe5b8)`, transition: "width 120ms linear" }} />
        </div>
      </div>

      {/* Content sections */}
      <div style={{ position: "relative", zIndex: 20 }}>
        {/* Hero */}
        <section style={{ minHeight: "100vh", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "clamp(112px, 13vh, 136px) 24px 0" }}>
          <div style={{ textAlign: "center", maxWidth: 768, pointerEvents: "none" }}>
            <p style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.45em", color: "rgba(255,236,200,0.55)", marginBottom: 20 }}>
              ARCHIVE  /  VOLUME  I
            </p>
            <h1 aria-label="The Operator" style={{
              fontFamily: SERIF,
              fontSize: "clamp(58px, 9.5vw, 124px)",
              fontWeight: 300,
              fontVariationSettings: '"opsz" 144',
              letterSpacing: "-0.025em",
              lineHeight: 0.92,
              color: "#fff",
              textShadow: "0 2px 28px rgba(0,0,0,0.7), 0 0 48px rgba(0,0,0,0.45)",
            }}>
              The<br />
              <span style={{ fontStyle: "italic", fontWeight: 300, color: AMBER }}>Operator</span>
            </h1>
            <p style={{
              fontFamily: SERIF,
              marginTop: 20,
              fontSize: "clamp(16px, 1.6vw, 20px)",
              fontStyle: "italic",
              fontWeight: 300,
              color: "rgba(255,255,255,0.78)",
              maxWidth: 480,
              marginLeft: "auto",
              marginRight: "auto",
              lineHeight: 1.6,
              textShadow: "0 2px 18px rgba(0,0,0,0.75)",
            }}>
              Field notes on calm execution under load.
            </p>
            <p style={{
              fontFamily: MONO,
              fontSize: 10,
              letterSpacing: "0.45em",
              color: "rgba(255,236,200,0.4)",
              marginTop: 38,
              animation: "operatorPulse 2s ease-in-out infinite",
            }}>
              SCROLL TO PULL BACK
            </p>
          </div>
        </section>

        {/* Beats */}
        {BEATS.map((b) => (
          <section key={b.id} style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 24px" }}>
            <div style={{ textAlign: "center", maxWidth: 640, pointerEvents: "none" }}>
              <p style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.45em", color: "rgba(255,200,120,0.45)", marginBottom: 24 }}>
                — {b.id} —
              </p>
              <p style={{
                fontFamily: SERIF,
                fontSize: "clamp(28px, 4.5vw, 56px)",
                fontWeight: 300,
                lineHeight: 1.15,
                letterSpacing: "-0.01em",
                color: "rgba(255,255,255,0.92)",
              }}>
                {b.line1}<br />
                <span style={{ fontStyle: "italic", color: AMBER }}>{b.line2}</span>
              </p>
            </div>
          </section>
        ))}

        {/* CTA → BEGIN BRIEFING */}
        <section style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 24px" }}>
          <div style={{ textAlign: "center", maxWidth: 560 }}>
            <p style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.45em", color: "rgba(255,236,200,0.4)", marginBottom: 32 }}>
              ARCHIVE  /  ENTRY
            </p>
            <p style={{
              fontFamily: SERIF,
              fontSize: "clamp(24px, 3vw, 38px)",
              fontWeight: 300,
              color: "rgba(255,255,255,0.85)",
              lineHeight: 1.4,
              marginBottom: 48,
            }}>
              Begin where <em style={{ color: AMBER }}>the work</em> begins.
            </p>
            <button
              onClick={onBegin}
              style={{
                fontFamily: MONO,
                fontSize: 11,
                letterSpacing: "0.45em",
                color: "rgba(255,228,170,0.95)",
                border: "1px solid rgba(255,228,170,0.45)",
                background: "transparent",
                padding: "16px 40px",
                borderRadius: 999,
                cursor: "pointer",
                transition: "all 0.25s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,228,170,0.1)";
                e.currentTarget.style.borderColor = "rgba(255,228,170,0.75)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = "rgba(255,228,170,0.45)";
              }}
            >
              BEGIN  BRIEFING  →
            </button>
          </div>
        </section>
      </div>

      <style>{`
        @keyframes operatorPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}
