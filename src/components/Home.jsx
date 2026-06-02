import { useEffect, useCallback, useRef } from "react";
import { C, F, pill } from "../design.js";
import imgTheTell from "../assets/explorations/the-tell.jpg";
import imgSoftwareFactory from "../assets/explorations/software-factory.jpg";
import imgIntelligenceCurrency from "../assets/explorations/intelligence-currency.jpg";
import imgAlsLimit from "../assets/explorations/als-limit.jpg";

// Per-essay hero image. Featured cards fall back to the CSS gradient
// (work.visual) when no image is registered here.
const IMAGES = {
  "the-tell": imgTheTell,
  "software-factory": imgSoftwareFactory,
  "intelligence-currency": imgIntelligenceCurrency,
  "als-limit": imgAlsLimit,
};

const FEATURED = [
  {
    id: "the-tell",
    eyebrow: "MEMORY",
    title: "The Tell.",
    desc: "Memory, cognition, and the archaeological mound.",
    visual:
      "radial-gradient(circle at 30% 40%, rgba(201,168,76,0.5), transparent 60%), linear-gradient(135deg, #1a1a1a, #2a2a2a)",
  },
  {
    id: "software-factory",
    eyebrow: "PLATFORM",
    title: "The Software Factory.",
    desc: "Supply chain security as a 2D platformer.",
    visual:
      "radial-gradient(circle at 70% 50%, rgba(80,120,255,0.4), transparent 55%), linear-gradient(135deg, #0a1230, #1a2244)",
  },
  {
    id: "intelligence-currency",
    eyebrow: "INTELLIGENCE",
    title: "Intelligence as currency.",
    desc: "Seven theses on compounding intelligence.",
    visual:
      "radial-gradient(circle at 50% 30%, rgba(255,255,255,0.18), transparent 60%), linear-gradient(160deg, #2b3a2b, #1a261a)",
  },
  {
    id: "als-limit",
    eyebrow: "COMPLEXITY",
    title: "Al\u2019s Limit.",
    desc: "A Kardashev scale for software complexity.",
    visual:
      "radial-gradient(circle at 60% 60%, rgba(220,90,90,0.32), transparent 55%), linear-gradient(135deg, #2a1414, #1a0e0e)",
  },
];

const CAREER = [
  { co: "Port.io", role: "Head of Technical Success, Americas", yr: "2025 \u2014 Present", live: true },
  { co: "Harness", role: "Senior Technical Program Manager", yr: "2024 \u2014 2025" },
  { co: "Snyk", role: "Manager, Customer Solutions Group", yr: "2022 \u2014 2024" },
  { co: "HashiCorp", role: "Enterprise User Success Manager", yr: "2021" },
  { co: "Western Digital", role: "Staff Manager, Enterprise", yr: "2013 \u2014 2021" },
];

const pillFilled = pill.filled;
const pillGhost = pill.ghost;

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

function Nav({ onNav }) {
  const linkStyle = {
    color: C.ink, opacity: 0.85,
    fontSize: "clamp(12px, 3.4vw, 14px)", fontWeight: 400,
    letterSpacing: "-0.01em", cursor: "pointer",
    background: "none", border: "none", fontFamily: F.text,
    padding: 0, textDecoration: "none", whiteSpace: "nowrap",
  };
  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 50,
      backdropFilter: "saturate(180%) blur(20px)",
      WebkitBackdropFilter: "saturate(180%) blur(20px)",
      background: "rgba(255,255,255,0.72)",
      borderBottom: "1px solid rgba(0,0,0,0.06)",
      height: 48,
      }}>
      <div style={{
        maxWidth: 1024, margin: "0 auto", padding: "0 clamp(12px, 4vw, 22px)",
        height: "100%", display: "flex", alignItems: "center",
        justifyContent: "space-between", gap: 8,
      }}>
        <span style={{
          fontWeight: 500, color: C.ink, fontFamily: F.text, fontSize: 14,
          flexShrink: 0,
        }}>sharma</span>
        <div style={{ display: "flex", gap: "clamp(8px, 2.4vw, 28px)" }}>
          <button onClick={() => onNav("explorations")} style={linkStyle}>Explorations</button>
          <button onClick={() => onNav("operator")} style={linkStyle}>Operator</button>
          <a href="https://darkvectorcognition.ai" target="_blank" rel="noopener noreferrer" style={linkStyle}>DVC</a>
          <button onClick={() => window.dispatchEvent(new CustomEvent("open-contact"))} style={linkStyle}>Contact</button>
        </div>
      </div>
    </nav>
  );
}

function createGalaxyPreview() {
  const rand = seededRandom(4279);
  const stars = Array.from({ length: 1600 }, () => ({
    x: rand(),
    y: rand(),
    r: 0.25 + rand() * 1.35,
    a: 0.12 + rand() * 0.84,
    tw: rand() * Math.PI * 2,
    drift: 0.18 + rand() * 0.62,
    depth: 0.35 + rand() * 0.9,
    hue: rand() > 0.82 ? "190,220,255" : rand() > 0.58 ? "255,226,176" : "255,255,255",
  }));

  const nebula = Array.from({ length: 9 }, () => ({
    x: 0.16 + rand() * 0.68,
    y: 0.18 + rand() * 0.62,
    radius: 0.16 + rand() * 0.3,
    alpha: 0.03 + rand() * 0.055,
    color: rand() > 0.5 ? "68,122,190" : "220,156,92",
  }));

  const arms = 6;
  const particles = Array.from({ length: 9600 }, (_, i) => {
    const arm = i % arms;
    const radius = Math.pow(rand(), 0.54);
    const theta = (arm / arms) * Math.PI * 2 + radius * 7.4 + (rand() - 0.5) * (0.44 + radius * 0.2);
    const scatter = Math.pow(rand(), 2.35) * (0.012 + radius * 0.092);
    const tone = rand();
    return {
      radius,
      theta,
      scatterX: (rand() - 0.5) * scatter,
      scatterY: (rand() - 0.5) * scatter * 0.5,
      lift: (rand() - 0.5) * Math.pow(radius, 1.35) * 0.12,
      size: 0.28 + Math.pow(rand(), 2.6) * 1.85,
      alpha: 0.18 + rand() * 0.72,
      shimmer: rand() * Math.PI * 2,
      color: tone > 0.84 ? "118,210,255" : tone > 0.52 ? "255,218,150" : tone > 0.18 ? "244,248,255" : "196,172,255",
      spark: rand() > 0.93,
    };
  });

  const dust = Array.from({ length: 1600 }, (_, i) => {
    const arm = i % arms;
    const radius = 0.14 + Math.pow(rand(), 0.68) * 0.9;
    return {
      radius,
      theta: (arm / arms) * Math.PI * 2 + radius * 7.75 + 0.28 + (rand() - 0.5) * 0.24,
      width: 1.2 + rand() * 4.6,
      alpha: 0.045 + rand() * 0.16,
    };
  });

  const filaments = Array.from({ length: 26 }, (_, i) => ({
    arm: i % arms,
    start: 0.18 + rand() * 0.2,
    end: 0.56 + rand() * 0.38,
    phase: rand() * Math.PI * 2,
    alpha: 0.04 + rand() * 0.1,
    width: 0.55 + rand() * 1.1,
    color: rand() > 0.54 ? "118,210,255" : "255,218,150",
  }));

  const comets = Array.from({ length: 10 }, () => ({
    x: rand(),
    y: 0.08 + rand() * 0.72,
    length: 0.08 + rand() * 0.18,
    angle: -0.18 - rand() * 0.42,
    speed: 0.03 + rand() * 0.08,
    alpha: 0.16 + rand() * 0.28,
  }));

  return { stars, nebula, particles, dust, filaments, comets };
}

function GalaxyPreviewCanvas() {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    sceneRef.current = sceneRef.current || createGalaxyPreview();
    const scene = sceneRef.current;
    const ctx = canvas.getContext("2d");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let frame = 0;
    let running = true;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawPoint = (x, y, size, color, alpha) => {
      ctx.fillStyle = `rgba(${color},${alpha})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    };

    const render = (time = 0) => {
      if (!running) return;
      const t = time * 0.001;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#010103";
      ctx.fillRect(0, 0, width, height);

      const bg = ctx.createLinearGradient(0, 0, width, height);
      bg.addColorStop(0, "rgba(10,18,34,0.55)");
      bg.addColorStop(0.52, "rgba(0,0,0,0)");
      bg.addColorStop(1, "rgba(32,18,45,0.42)");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      scene.nebula.forEach((n) => {
        const x = n.x * width + Math.sin(t * 0.08 + n.x * 12) * width * 0.014;
        const y = n.y * height + Math.cos(t * 0.07 + n.y * 10) * height * 0.012;
        const r = n.radius * Math.max(width, height);
        const haze = ctx.createRadialGradient(x, y, 0, x, y, r);
        haze.addColorStop(0, `rgba(${n.color},${n.alpha})`);
        haze.addColorStop(0.45, `rgba(${n.color},${n.alpha * 0.42})`);
        haze.addColorStop(1, `rgba(${n.color},0)`);
        ctx.fillStyle = haze;
        ctx.fillRect(0, 0, width, height);
      });

      scene.stars.forEach((star) => {
        const drift = t * 0.004 * star.drift;
        const x = ((star.x + drift) % 1) * width;
        const y = star.y * height + Math.sin(t * 0.12 + star.tw) * star.depth;
        const alpha = star.a * (0.68 + Math.sin(t * 0.8 + star.tw) * 0.24);
        drawPoint(x, y, star.r, star.hue, alpha);
      });

      const cx = width * 0.5;
      const cy = height * 0.47;
      const rx = width * 0.46;
      const ry = height * 0.41;
      const rotation = -0.36 + t * 0.042;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(1, 0.54);
      ctx.rotate(rotation);

      ctx.globalCompositeOperation = "lighter";
      scene.filaments.forEach((line) => {
        ctx.beginPath();
        for (let i = 0; i <= 34; i += 1) {
          const q = i / 34;
          const radius = line.start + (line.end - line.start) * q;
          const theta = (line.arm / 6) * Math.PI * 2 + radius * 7.7 + line.phase * 0.05 + t * 0.022;
          const wobble = Math.sin(q * Math.PI * 3 + line.phase + t * 0.55) * 0.018;
          const x = Math.cos(theta) * rx * (radius + wobble);
          const y = Math.sin(theta) * ry * (radius - wobble * 0.5);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(${line.color},${line.alpha})`;
        ctx.lineWidth = line.width;
        ctx.stroke();
      });

      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = "rgba(255,255,255,0.075)";
      ctx.lineWidth = 0.55;
      for (let i = 1; i <= 8; i += 1) {
        ctx.beginPath();
        ctx.ellipse(0, 0, rx * i * 0.105, ry * i * 0.105, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.globalCompositeOperation = "lighter";
      scene.particles.forEach((p) => {
        const theta = p.theta + t * (0.018 + (1 - p.radius) * 0.032);
        const antiGravity = Math.sin(t * 0.7 + p.shimmer) * p.lift * height;
        const x = Math.cos(theta) * rx * p.radius + p.scatterX * width;
        const y = Math.sin(theta) * ry * p.radius + p.scatterY * height + antiGravity;
        const alpha = p.alpha * (0.78 + Math.sin(t * 1.45 + p.shimmer) * 0.2);
        drawPoint(x, y, p.size, p.color, alpha);
        if (p.spark) {
          ctx.fillStyle = `rgba(${p.color},${alpha * 0.42})`;
          ctx.fillRect(x - p.size * 2.2, y - 0.4, p.size * 4.4, 0.8);
          ctx.fillRect(x - 0.4, y - p.size * 2.2, 0.8, p.size * 4.4);
        }
      });

      ctx.globalCompositeOperation = "source-over";
      scene.dust.forEach((grain) => {
        const theta = grain.theta + t * (0.016 + (1 - grain.radius) * 0.028);
        const x = Math.cos(theta) * rx * grain.radius;
        const y = Math.sin(theta) * ry * grain.radius;
        drawPoint(x, y, grain.width, "0,0,0", grain.alpha);
      });

      const core = ctx.createRadialGradient(0, 0, 2, 0, 0, Math.min(width, height) * 0.12);
      core.addColorStop(0, "rgba(255,248,228,1)");
      core.addColorStop(0.18, "rgba(255,214,136,0.78)");
      core.addColorStop(0.42, "rgba(104,176,255,0.2)");
      core.addColorStop(1, "rgba(255,205,126,0)");
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(0, 0, Math.min(width, height) * 0.18, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      scene.comets.forEach((comet) => {
        const drift = (comet.x + t * comet.speed) % 1;
        const x = drift * width;
        const y = comet.y * height + Math.sin(t * 0.3 + comet.x * 8) * height * 0.04;
        const len = comet.length * width;
        const endX = x - Math.cos(comet.angle) * len;
        const endY = y - Math.sin(comet.angle) * len;
        const tail = ctx.createLinearGradient(x, y, endX, endY);
        tail.addColorStop(0, `rgba(255,236,198,${comet.alpha})`);
        tail.addColorStop(0.45, `rgba(118,210,255,${comet.alpha * 0.34})`);
        tail.addColorStop(1, "rgba(118,210,255,0)");
        ctx.strokeStyle = tail;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      });

      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(0,0,0,0.28)";
      ctx.fillRect(0, height * 0.72, width, height * 0.28);
    };

    const draw = (time = 0) => {
      render(time);
      if (!reduceMotion) frame = requestAnimationFrame(draw);
    };

    resize();
    draw();
    const observer = new ResizeObserver(() => {
      resize();
      render(performance.now());
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
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
      }}
    />
  );
}

function HeroStage({ onNav }) {
  return (
    <button
      type="button"
      onClick={() => onNav("operator")}
      aria-label="Open the Operator cinematic introduction"
      style={{
        margin: "56px auto 0", maxWidth: 1024, width: "100%",
        height: "clamp(330px, 42vw, 500px)",
        borderRadius: 22, cursor: "pointer",
        position: "relative", overflow: "hidden",
        background: "#010103", border: "none", padding: 0,
        boxShadow: "0 24px 70px rgba(0,0,0,0.14)",
      }}
    >
      <GalaxyPreviewCanvas />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.06), rgba(0,0,0,0) 44%, rgba(0,0,0,0.36)), radial-gradient(ellipse at center, rgba(255,255,255,0.02), rgba(0,0,0,0.36) 72%)",
          pointerEvents: "none",
        }}
      />
      <div style={{
        position: "absolute", left: 32, bottom: 28, color: "rgba(255,255,255,0.85)",
        fontFamily: F.display, fontSize: 14,
        letterSpacing: "0.18em", textTransform: "uppercase",
      }}>{"Operator · A cinematic invitation ›"}</div>
    </button>
  );
}

function Hero({ onNav }) {
  return (
    <section style={{ background: C.bg, textAlign: "center", padding: "96px 22px 56px" }}>
      <h1 style={{
        fontFamily: F.display, fontWeight: 600,
        fontSize: "clamp(56px, 9vw, 112px)",
        lineHeight: 1.05, letterSpacing: "-0.045em",
        margin: "0 0 14px", color: C.ink,
      }}>Al Sharma.</h1>
      <p style={{
        fontFamily: F.display, fontWeight: 400,
        fontSize: "clamp(22px, 2.6vw, 30px)",
        lineHeight: 1.2, letterSpacing: "-0.022em",
        color: C.ink, maxWidth: 760, margin: "0 auto 12px",
      }}>Post-sales strategy for AI-native software.</p>
      <p style={{
        fontFamily: F.text, fontSize: 18, color: C.inkSoft,
        letterSpacing: "-0.012em", maxWidth: 640,
        margin: "0 auto 28px", lineHeight: 1.45,
      }}>I close the gap between what enterprises buy and what they realize from it. I also build the agents I&apos;d want them to use.</p>
      <div style={{ display: "flex", justifyContent: "center", gap: 18, flexWrap: "wrap" }}>
        <button onClick={() => onNav("explorations")} style={pillFilled}>See the work</button>
        <a href="https://darkvectorcognition.ai" target="_blank" rel="noopener noreferrer" style={pillGhost}>{"Dark Vector Cognition \u203A"}</a>
      </div>
      <HeroStage onNav={onNav} />
    </section>
  );
}

function ExplorationCard({ work, onNav }) {
  const image = IMAGES[work.id];
  return (
    <button onClick={() => onNav(work.id)}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 12px 36px rgba(0,0,0,0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
      style={{
        background: "#fff", border: "none", borderRadius: 22,
        overflow: "hidden", padding: 0, cursor: "pointer",
        display: "flex", flexDirection: "column", minHeight: 380,
        textAlign: "left", fontFamily: F.text,
        transition: "transform .3s ease, box-shadow .3s ease",
      }}>
      <div style={{ height: 220, overflow: "hidden", position: "relative" }}>
        {image ? (
          <img
            src={image}
            alt=""
            loading="lazy"
            style={{
              width: "100%", height: "100%", objectFit: "cover", display: "block",
            }}
          />
        ) : (
          <div style={{ width: "100%", height: "100%", background: work.visual }} />
        )}
      </div>
      <div style={{ padding: "26px 28px 32px" }}>
        <p style={{
          fontFamily: F.text, fontSize: 13, letterSpacing: "0.04em",
          textTransform: "uppercase", color: C.inkMute, margin: "0 0 8px",
          fontWeight: 500,
        }}>{work.eyebrow}</p>
        <h3 style={{
          fontFamily: F.display, fontWeight: 600,
          fontSize: 28, lineHeight: 1.1, letterSpacing: "-0.025em",
          margin: "0 0 8px", color: C.ink,
        }}>{work.title}</h3>
        <p style={{
          margin: 0, color: C.inkSoft, fontSize: 16,
          fontFamily: F.text, letterSpacing: "-0.012em",
        }}>{work.desc}</p>
      </div>
    </button>
  );
}

function ExplorationsGrid({ onNav }) {
  return (
    <section style={{ background: C.bgSoft, paddingBottom: 96 }}>
      <div style={{ textAlign: "center", padding: "96px 22px 40px", maxWidth: 980, margin: "0 auto" }}>
        <h2 style={{
          fontFamily: F.display, fontWeight: 600,
          fontSize: "clamp(34px, 4.5vw, 52px)",
          lineHeight: 1.08, letterSpacing: "-0.035em",
          margin: "0 0 12px", color: C.ink,
        }}>Explorations.</h2>
        <p style={{
          fontFamily: F.display, fontWeight: 400,
          fontSize: "clamp(19px, 2vw, 23px)",
          color: C.inkSoft, maxWidth: 640, margin: "0 auto",
          lineHeight: 1.35, letterSpacing: "-0.018em",
        }}>Visual essays on agents, platform engineering, and the operator&apos;s craft.</p>
      </div>
      <div style={{
        maxWidth: 1024, margin: "0 auto", padding: "0 22px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
        gap: 20,
      }}>
        {FEATURED.map((work) => <ExplorationCard key={work.id} work={work} onNav={onNav} />)}
      </div>
      <div style={{ textAlign: "center", marginTop: 40 }}>
        <button onClick={() => onNav("explorations")} style={{
          background: "none", border: "none", color: C.link,
          fontFamily: F.text, fontSize: 17, letterSpacing: "-0.01em",
          cursor: "pointer",
        }}>{"See all twenty explorations \u203A"}</button>
      </div>
    </section>
  );
}

function DVCBlock() {
  return (
    <section style={{ background: C.bgFooter, padding: "112px 22px" }}>
      <div style={{ maxWidth: 920, margin: "0 auto", textAlign: "center" }}>
        <p style={{
          fontFamily: F.text, fontSize: 13, letterSpacing: "0.18em",
          textTransform: "uppercase", color: C.inkMute, margin: "0 0 28px",
        }}>Dark Vector Cognition</p>
        <h2 style={{
          fontFamily: F.display, fontWeight: 500,
          fontSize: "clamp(32px, 4.4vw, 50px)",
          lineHeight: 1.12, letterSpacing: "-0.03em",
          margin: "0 0 22px", color: C.ink,
        }}>A studio for systems that think.</h2>
        <p style={{
          fontFamily: F.display, fontWeight: 400,
          fontSize: "clamp(22px, 2.6vw, 32px)",
          lineHeight: 1.3, letterSpacing: "-0.022em",
          color: C.ink, margin: "0 auto 32px", maxWidth: 720,
        }}>Legacy software was built for humans clicking buttons. The next layer is built for agents doing work. We sit at that seam.</p>
        <a href="https://darkvectorcognition.ai" target="_blank" rel="noopener noreferrer" style={pillFilled}>Visit DVC</a>
      </div>
    </section>
  );
}

function CareerStrip({ onNav }) {
  return (
    <section style={{ background: C.bg, padding: "96px 22px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <h2 style={{
          fontFamily: F.display, fontWeight: 600,
          fontSize: "clamp(28px, 3.4vw, 40px)",
          lineHeight: 1.1, letterSpacing: "-0.03em",
          margin: "0 0 36px", color: C.ink, textAlign: "center",
        }}>The arc.</h2>
        <div>
          {CAREER.map((c) => (
            <div key={c.co} style={{
              display: "flex", justifyContent: "space-between",
              alignItems: "baseline", padding: "16px 0",
              borderBottom: `1px solid ${C.rule}`,
              flexWrap: "wrap", gap: 12,
            }}>
              <div style={{ minWidth: 140 }}>
                <div style={{
                  fontFamily: F.display, fontWeight: 600, fontSize: 18,
                  color: C.ink, letterSpacing: "-0.015em",
                }}>{c.co}
                  {c.live && (
                    <span style={{
                      display: "inline-block", marginLeft: 8, width: 7, height: 7,
                      borderRadius: "50%", background: C.live, verticalAlign: "middle",
                    }} />
                  )}
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 200, color: C.inkSoft, fontSize: 16, fontFamily: F.text }}>{c.role}</div>
              <div style={{ fontFamily: F.text, fontSize: 14, color: C.inkMute, whiteSpace: "nowrap" }}>{c.yr}</div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 32 }}>
          <button onClick={() => onNav("resume")} style={{
            background: "none", border: "none", color: C.link,
            fontFamily: F.text, fontSize: 17, cursor: "pointer",
          }}>{"Full resume \u203A"}</button>
        </div>
      </div>
    </section>
  );
}

function FooterStrip() {
  const linkStyle = { color: C.inkMute, textDecoration: "none", fontFamily: F.text };
  return (
    <footer style={{
      background: C.bgSoft, color: C.inkMute, fontSize: 12,
      borderTop: `1px solid ${C.rule}`,
    }}>
      <div style={{
        maxWidth: 1024, margin: "0 auto", padding: "28px 22px",
        display: "flex", justifyContent: "space-between",
        flexWrap: "wrap", gap: 12, fontFamily: F.text,
      }}>
        <div>{"\u00A9 2026 Al Sharma. Built in Austin."}</div>
        <div style={{ display: "flex", gap: 16 }}>
          <a href="https://www.linkedin.com/in/alsharma" target="_blank" rel="noopener noreferrer" style={linkStyle}>LinkedIn</a>
          <a href="https://github.com/kunalnano" target="_blank" rel="noopener noreferrer" style={linkStyle}>GitHub</a>
          <a href="https://darkvectorcognition.ai" target="_blank" rel="noopener noreferrer" style={linkStyle}>DVC</a>
          <a href="https://enablement.alsharma.com" target="_blank" rel="noopener noreferrer" style={linkStyle}>Enablement</a>
          <a href="mailto:hello@darkvectorcognition.ai" style={linkStyle}>Email</a>
        </div>
      </div>
    </footer>
  );
}

export default function Home({ onNavigate }) {
  const go = useCallback((id) => {
    window.location.hash = id;
    onNavigate(id);
    window.scrollTo(0, 0);
  }, [onNavigate]);

  useEffect(() => {
    const prev = document.body.style.background;
    document.body.style.background = C.bg;
    return () => { document.body.style.background = prev; };
  }, []);

  return (
    <div style={{
      background: C.bg, color: C.ink, fontFamily: F.text,
      minHeight: "100vh",
      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale",
    }}>
      <Nav onNav={go} />
      <Hero onNav={go} />
      <ExplorationsGrid onNav={go} />
      <DVCBlock />
      <CareerStrip onNav={go} />
      <FooterStrip />
    </div>
  );
}
