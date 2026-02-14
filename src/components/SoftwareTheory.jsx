import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════
   THE SOFTWARE THEORY OF CIVILIZATION
   Civilization doesn't just use software — civilization IS software.
   From a conversation between a human and a language model.
   ═══════════════════════════════════════════════════════════════ */

const BG = "#050508";
const BONE = "#e8e4dc";
const ASH = "#4a4860";
const ICE = "#6ee7f0";
const EMBER = "#ff4d2e";
const GHOST = "#9b8fff";
const GOLD = "#fbbf24";
const GREEN = "#34d399";
const FAINT = "rgba(255,255,255,0.03)";
const LINE = "rgba(255,255,255,0.06)";

const sans = { fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif" };
const serif = { fontFamily: "Georgia, 'Times New Roman', serif" };
const mono = {
  fontFamily: "'SF Mono', 'Cascadia Code', 'Consolas', monospace",
};

// ── SCROLL REVEAL ──
function Reveal({ children, delay = 0 }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVis(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.12 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

function Chapter({ label, title, children }) {
  return (
    <section style={{ padding: "80px 0", borderTop: `1px solid ${LINE}` }}>
      <Reveal>
        <div
          style={{
            ...mono,
            fontSize: 10,
            letterSpacing: 3,
            color: ICE,
            textTransform: "uppercase",
            marginBottom: 12,
          }}
        >
          {label}
        </div>
        <h2
          style={{
            ...sans,
            fontSize: "clamp(28px, 5vw, 44px)",
            fontWeight: 700,
            lineHeight: 1.1,
            marginBottom: 40,
            maxWidth: 600,
          }}
        >
          {title}
        </h2>
      </Reveal>
      {children}
    </section>
  );
}

// ── ANIMATED LAYER STACK ──
const LAYERS = [
  {
    id: "v4",
    label: "v4.0 — Probabilistic Intelligence",
    sub: "Vectors · Embeddings · Weights",
    color: GHOST,
    icon: "🧠",
    output: "Agents, synthesis, cross-domain reasoning",
  },
  {
    id: "v3",
    label: "v3.0 — The Executable Era",
    sub: "Binary · Logic Gates · Algorithms",
    color: GREEN,
    icon: "💻",
    output: "The Internet, SaaS, global finance",
  },
  {
    id: "v2",
    label: "v2.0 — The Persistence Era",
    sub: "Text · Scripture · Legal Code",
    color: ICE,
    icon: "📜",
    output: "Nations, religions, empires, contracts",
  },
  {
    id: "v1",
    label: "v1.0 — The Biological Era",
    sub: "Speech · Gesture · Memory",
    color: GOLD,
    icon: "🗣️",
    output: "Myths, tribal knowledge, culture",
  },
];

function AnimatedStack() {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [particles, setParticles] = useState([]);
  const frameRef = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVis(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.12 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Particle animation between layers
  useEffect(() => {
    if (!vis) return;
    let running = true;
    const pts = [];
    for (let i = 0; i < 18; i++) {
      pts.push({
        x: 120 + Math.random() * 360,
        y: 40 + Math.random() * 340,
        vx: (Math.random() - 0.5) * 0.6,
        vy: -0.3 - Math.random() * 0.5,
        life: Math.random(),
        layer: Math.floor(Math.random() * 4),
      });
    }
    function tick() {
      if (!running) return;
      for (const p of pts) {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.004;
        if (p.life <= 0 || p.y < 20 || p.y > 400) {
          p.x = 120 + Math.random() * 360;
          p.layer = Math.floor(Math.random() * 4);
          p.y = 72 + p.layer * 90 + Math.random() * 60;
          p.life = 0.6 + Math.random() * 0.4;
          p.vx = (Math.random() - 0.5) * 0.6;
          p.vy = -0.3 - Math.random() * 0.4;
        }
      }
      setParticles([...pts]);
      frameRef.current = requestAnimationFrame(tick);
    }
    frameRef.current = requestAnimationFrame(tick);
    return () => {
      running = false;
      cancelAnimationFrame(frameRef.current);
    };
  }, [vis]);

  const layerH = 72,
    gap = 18,
    startY = 40;

  return (
    <Reveal>
      <div
        ref={ref}
        style={{ position: "relative", margin: "32px auto", maxWidth: 620 }}
      >
        <svg viewBox="0 0 600 420" style={{ width: "100%", display: "block" }}>
          <defs>
            {LAYERS.map((l, i) => (
              <linearGradient
                key={l.id}
                id={`grad-${l.id}`}
                x1="0"
                y1="0"
                x2="1"
                y2="0"
              >
                <stop offset="0%" stopColor={l.color} stopOpacity={0.08} />
                <stop
                  offset="50%"
                  stopColor={l.color}
                  stopOpacity={hovered === i ? 0.2 : 0.12}
                />
                <stop offset="100%" stopColor={l.color} stopOpacity={0.08} />
              </linearGradient>
            ))}
          </defs>

          {/* Abstraction arrow */}
          <text
            x={16}
            y={220}
            fill={ASH}
            fontSize={9}
            fontFamily="monospace"
            transform="rotate(-90, 16, 220)"
          >
            ABSTRACTION ▲
          </text>

          {/* Layers */}
          {LAYERS.map((l, i) => {
            const y = startY + i * (layerH + gap);
            const indent = i * 12;
            const w = 540 - indent * 2;
            const animDelay = vis ? (3 - i) * 0.15 : 0;
            const isHov = hovered === i;
            return (
              <g
                key={l.id}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  cursor: "pointer",
                  opacity: vis ? 1 : 0,
                  transform: vis ? "translateY(0)" : "translateY(20px)",
                  transition: `all 0.7s ease ${animDelay}s`,
                }}
              >
                <rect
                  x={30 + indent}
                  y={y}
                  width={w}
                  height={layerH}
                  rx={14}
                  fill={`url(#grad-${l.id})`}
                  stroke={l.color + (isHov ? "88" : "33")}
                  strokeWidth={isHov ? 2 : 1}
                  style={{ transition: "all 0.3s" }}
                />
                {/* Glow effect on hover */}
                {isHov && (
                  <rect
                    x={30 + indent}
                    y={y}
                    width={w}
                    height={layerH}
                    rx={14}
                    fill="none"
                    stroke={l.color}
                    strokeWidth={1}
                    style={{ filter: `drop-shadow(0 0 8px ${l.color}44)` }}
                  />
                )}
                <text
                  x={60 + indent}
                  y={y + 28}
                  fill={l.color}
                  fontSize={13}
                  fontWeight={600}
                  fontFamily="'Segoe UI', sans-serif"
                >
                  {l.label}
                </text>
                <text
                  x={60 + indent}
                  y={y + 46}
                  fill={ASH}
                  fontSize={10}
                  fontStyle="italic"
                  fontFamily="Georgia, serif"
                >
                  {l.sub}
                </text>
                {isHov && (
                  <text
                    x={60 + indent}
                    y={y + 62}
                    fill={l.color + "aa"}
                    fontSize={9}
                    fontFamily="monospace"
                  >
                    → {l.output}
                  </text>
                )}
              </g>
            );
          })}

          {/* Connecting flow lines between layers */}
          {[0, 1, 2].map((i) => {
            const y1 = startY + i * (layerH + gap) + layerH;
            const y2 = startY + (i + 1) * (layerH + gap);
            return (
              <g key={`conn-${i}`}>
                <line
                  x1={200}
                  y1={y1}
                  x2={200}
                  y2={y2}
                  stroke={LINE}
                  strokeWidth={1}
                  strokeDasharray="3 3"
                >
                  {vis && (
                    <animate
                      attributeName="strokeDashoffset"
                      values="6;0"
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                  )}
                </line>
                <line
                  x1={400}
                  y1={y1}
                  x2={400}
                  y2={y2}
                  stroke={LINE}
                  strokeWidth={1}
                  strokeDasharray="3 3"
                >
                  {vis && (
                    <animate
                      attributeName="strokeDashoffset"
                      values="6;0"
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                  )}
                </line>
              </g>
            );
          })}

          {/* Particles flowing upward between layers */}
          {particles.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={1.5}
              fill={LAYERS[p.layer].color}
              opacity={p.life * 0.6}
            />
          ))}

          {/* Time arrow */}
          <text
            x={584}
            y={220}
            fill={ASH}
            fontSize={9}
            fontFamily="monospace"
            transform="rotate(90, 584, 220)"
          >
            TIME ▲
          </text>
        </svg>
      </div>
    </Reveal>
  );
}

// ── COMPRESSION TIMELINE — intervals shrink exponentially ──
function CompressionTimeline() {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVis(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.2 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const intervals = [
    {
      label: "v1.0 → v2.0",
      years: "~295,000 yrs",
      pct: 100,
      color: GOLD,
      desc: "Speech to writing",
    },
    {
      label: "v2.0 → v3.0",
      years: "~4,500 yrs",
      pct: 1.5,
      color: ICE,
      desc: "Writing to code",
    },
    {
      label: "v3.0 → v4.0",
      years: "~75 yrs",
      pct: 0.025,
      color: GREEN,
      desc: "Code to LLMs",
    },
    {
      label: "v4.0 → v5.0?",
      years: "~?? yrs",
      pct: 0.003,
      color: GHOST,
      desc: "LLMs to ...",
    },
  ];

  return (
    <Reveal>
      <div ref={ref} style={{ margin: "40px 0" }}>
        <div
          style={{
            ...mono,
            fontSize: 9,
            letterSpacing: 2,
            color: ASH,
            marginBottom: 20,
            textTransform: "uppercase",
          }}
        >
          Interval compression between version updates
        </div>
        {intervals.map((iv, i) => (
          <div key={i} style={{ marginBottom: 16 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: 6,
              }}
            >
              <span style={{ ...mono, fontSize: 11, color: iv.color }}>
                {iv.label}
              </span>
              <span
                style={{
                  ...serif,
                  fontSize: 12,
                  color: ASH,
                  fontStyle: "italic",
                }}
              >
                {iv.desc}
              </span>
              <span style={{ ...mono, fontSize: 11, color: BONE }}>
                {iv.years}
              </span>
            </div>
            <div
              style={{
                height: 8,
                borderRadius: 4,
                background: LINE,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  borderRadius: 4,
                  background: `linear-gradient(90deg, ${iv.color}88, ${iv.color})`,
                  width: vis ? `${Math.max(iv.pct, 2)}%` : "0%",
                  transition: `width 1.2s cubic-bezier(0.16,1,0.3,1) ${i * 0.2}s`,
                  boxShadow: `0 0 8px ${iv.color}44`,
                }}
              />
            </div>
          </div>
        ))}
        <div
          style={{
            ...serif,
            fontSize: 13,
            color: ASH,
            fontStyle: "italic",
            marginTop: 12,
          }}
        >
          Each bar is proportional to the time between transitions. The last
          three are invisible at this scale.
        </div>
      </div>
    </Reveal>
  );
}

// ── BOTTLENECK GAUGES — animated meters ──
const BOTTLENECKS = [
  {
    icon: "⚖️",
    domain: "Law",
    stat: "180K+",
    full: "pages of US federal regulation",
    pct: 72,
    color: GOLD,
  },
  {
    icon: "💾",
    domain: "Code",
    stat: "2B+",
    full: "lines in Google's monorepo",
    pct: 88,
    color: GREEN,
  },
  {
    icon: "📊",
    domain: "Data",
    stat: "120 ZB",
    full: "created per year globally",
    pct: 95,
    color: ICE,
  },
  {
    icon: "🏥",
    domain: "Medicine",
    stat: "2M+",
    full: "papers published per year",
    pct: 82,
    color: GHOST,
  },
];

function BottleneckGauges() {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVis(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.2 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 16,
        margin: "32px 0",
      }}
    >
      {BOTTLENECKS.map((b, i) => {
        // SVG arc gauge
        const r = 44,
          cx = 56,
          cy = 56;
        const circ = 2 * Math.PI * r;
        const arcLen = circ * 0.75; // 270 degrees
        const fillLen = arcLen * (b.pct / 100);
        return (
          <Reveal key={i} delay={i * 0.1}>
            <div
              style={{
                background: FAINT,
                border: `1px solid ${LINE}`,
                borderRadius: 16,
                padding: "20px 16px",
                textAlign: "center",
              }}
            >
              <svg
                viewBox="0 0 112 80"
                style={{
                  width: 112,
                  height: 80,
                  margin: "0 auto",
                  display: "block",
                }}
              >
                {/* Background arc */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill="none"
                  stroke={LINE}
                  strokeWidth={6}
                  strokeDasharray={`${arcLen} ${circ}`}
                  strokeDashoffset={-circ * 0.125}
                  strokeLinecap="round"
                  transform={`rotate(135 ${cx} ${cy})`}
                />
                {/* Fill arc */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill="none"
                  stroke={b.color}
                  strokeWidth={6}
                  strokeDasharray={`${vis ? fillLen : 0} ${circ}`}
                  strokeDashoffset={-circ * 0.125}
                  strokeLinecap="round"
                  transform={`rotate(135 ${cx} ${cy})`}
                  style={{
                    transition: `stroke-dasharray 1.5s cubic-bezier(0.16,1,0.3,1) ${i * 0.15}s`,
                    filter: `drop-shadow(0 0 4px ${b.color}44)`,
                  }}
                />
                {/* Center text */}
                <text
                  x={cx}
                  y={cy - 4}
                  textAnchor="middle"
                  fill={b.color}
                  fontSize={16}
                  fontWeight={700}
                  fontFamily="'SF Mono', monospace"
                >
                  {b.stat}
                </text>
                <text
                  x={cx}
                  y={cy + 10}
                  textAnchor="middle"
                  fill={ASH}
                  fontSize={7}
                  fontFamily="Georgia, serif"
                >
                  {b.full}
                </text>
              </svg>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  marginTop: 4,
                }}
              >
                <span style={{ fontSize: 14 }}>{b.icon}</span>
                <span
                  style={{
                    ...sans,
                    fontSize: 13,
                    fontWeight: 600,
                    color: BONE,
                  }}
                >
                  {b.domain}
                </span>
              </div>
              <div
                style={{ ...mono, fontSize: 9, color: b.color, marginTop: 4 }}
              >
                {b.pct}% BEYOND HUMAN BANDWIDTH
              </div>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}

// ── GATEKEEPER POWER FLOW ──
function GatekeeperFlow() {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  const [activeLayer, setActiveLayer] = useState(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVis(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const keepers = [
    {
      ver: "v1.0",
      who: "Elders & Shamans",
      color: GOLD,
      power: "Oral memory",
      w: 100,
    },
    {
      ver: "v2.0",
      who: "Priests & Scribes",
      color: ICE,
      power: "Scripture & law",
      w: 140,
    },
    {
      ver: "v3.0",
      who: "Engineers & Tech Cos",
      color: GREEN,
      power: "Digital code",
      w: 180,
    },
    {
      ver: "v4.0",
      who: "Frontier Labs",
      color: GHOST,
      power: "Model weights",
      w: 220,
    },
  ];

  return (
    <Reveal>
      <div ref={ref} style={{ margin: "40px auto", maxWidth: 600 }}>
        <svg viewBox="0 0 600 300" style={{ width: "100%", display: "block" }}>
          {/* Power funnel — each era's gatekeeper controls a wider scope */}
          {keepers.map((k, i) => {
            const y = 30 + i * 65;
            const x = 300 - k.w / 2;
            const isActive = activeLayer === i;
            const d = vis ? 0.2 + i * 0.15 : 0;
            return (
              <g
                key={i}
                onMouseEnter={() => setActiveLayer(i)}
                onMouseLeave={() => setActiveLayer(null)}
                style={{
                  cursor: "pointer",
                  opacity: vis ? 1 : 0,
                  transition: `opacity 0.6s ease ${d}s`,
                }}
              >
                {/* Power bar */}
                <rect
                  x={x}
                  y={y}
                  width={vis ? k.w : 0}
                  height={48}
                  rx={12}
                  fill={k.color + (isActive ? "22" : "0c")}
                  stroke={k.color + (isActive ? "88" : "33")}
                  strokeWidth={isActive ? 2 : 1}
                  style={{
                    transition: `all 0.8s cubic-bezier(0.16,1,0.3,1) ${d}s`,
                  }}
                />
                {isActive && (
                  <rect
                    x={x}
                    y={y}
                    width={k.w}
                    height={48}
                    rx={12}
                    fill="none"
                    stroke={k.color}
                    strokeWidth={1}
                    opacity={0.4}
                    style={{ filter: `drop-shadow(0 0 12px ${k.color}66)` }}
                  />
                )}
                {/* Labels */}
                <text
                  x={300}
                  y={y + 20}
                  textAnchor="middle"
                  fill={k.color}
                  fontSize={11}
                  fontWeight={700}
                  fontFamily="'Segoe UI', sans-serif"
                >
                  {k.who}
                </text>
                <text
                  x={300}
                  y={y + 36}
                  textAnchor="middle"
                  fill={ASH}
                  fontSize={9}
                  fontFamily="monospace"
                >
                  {k.ver} · {k.power}
                </text>
                {/* Scope arrows */}
                {vis && (
                  <>
                    <line
                      x1={x + 4}
                      y1={y + 24}
                      x2={x - 16}
                      y2={y + 24}
                      stroke={k.color + "44"}
                      strokeWidth={1}
                      markerEnd="url(#arrowR)"
                    />
                    <line
                      x1={x + k.w - 4}
                      y1={y + 24}
                      x2={x + k.w + 16}
                      y2={y + 24}
                      stroke={k.color + "44"}
                      strokeWidth={1}
                    />
                  </>
                )}
              </g>
            );
          })}
          {/* Connection lines */}
          {[0, 1, 2].map((i) => (
            <line
              key={i}
              x1={300}
              y1={78 + i * 65}
              x2={300}
              y2={95 + i * 65}
              stroke={LINE}
              strokeWidth={1}
              strokeDasharray="3 3"
            />
          ))}
          {/* Scope label */}
          <text
            x={580}
            y={160}
            fill={ASH}
            fontSize={8}
            fontFamily="monospace"
            transform="rotate(90, 580, 160)"
          >
            SCOPE OF CONTROL ▶
          </text>
        </svg>
        {activeLayer !== null && (
          <div
            style={{
              textAlign: "center",
              padding: "12px 20px",
              background: keepers[activeLayer].color + "08",
              border: `1px solid ${keepers[activeLayer].color}22`,
              borderRadius: 12,
              marginTop: 8,
              transition: "all 0.3s",
            }}
          >
            <span style={{ ...serif, fontSize: 14, color: BONE }}>
              {activeLayer === 0 &&
                "Knowledge died with the elder. Power was local, personal, mortal."}
              {activeLayer === 1 &&
                "Scripture outlived its author. Power became institutional, persistent, territorial."}
              {activeLayer === 2 &&
                "Code scales infinitely. Power became global, instant, corporate."}
              {activeLayer === 3 &&
                "Model weights encode the full stack. Power is now concentrated in whoever trains the frontier."}
            </span>
          </div>
        )}
      </div>
    </Reveal>
  );
}

// ── ABSTRACTION FLOW — each layer wraps the previous ──
function AbstractionFlow() {
  const [active, setActive] = useState(null);
  const transitions = [
    {
      from: "Speech",
      to: "Writing",
      insight: "We still speak. Writing let us speak across time.",
      fromC: GOLD,
      toC: ICE,
    },
    {
      from: "Law",
      to: "Code",
      insight: "We still write laws. Code let us execute them automatically.",
      fromC: ICE,
      toC: GREEN,
    },
    {
      from: "Code",
      to: "LLMs",
      insight: "We still write code. LLMs let us operate through language.",
      fromC: GREEN,
      toC: GHOST,
    },
  ];

  return (
    <Reveal>
      <svg
        viewBox="0 0 600 160"
        style={{
          width: "100%",
          maxWidth: 600,
          display: "block",
          margin: "32px auto",
        }}
      >
        {transitions.map((t, i) => {
          const y = 20 + i * 48;
          const isA = active === i;
          return (
            <g
              key={i}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              style={{ cursor: "pointer" }}
            >
              {/* From */}
              <rect
                x={40}
                y={y}
                width={100}
                height={32}
                rx={8}
                fill={t.fromC + "12"}
                stroke={t.fromC + "44"}
              />
              <text
                x={90}
                y={y + 20}
                textAnchor="middle"
                fill={t.fromC}
                fontSize={11}
                fontWeight={600}
                fontFamily="'Segoe UI', sans-serif"
              >
                {t.from}
              </text>
              {/* Arrow */}
              <line
                x1={148}
                y1={y + 16}
                x2={210}
                y2={y + 16}
                stroke={isA ? BONE : ASH}
                strokeWidth={isA ? 2 : 1}
              >
                {isA && (
                  <animate
                    attributeName="strokeDashoffset"
                    values="12;0"
                    dur="0.8s"
                    repeatCount="indefinite"
                  />
                )}
              </line>
              <polygon
                points={`210,${y + 10} 210,${y + 22} 222,${y + 16}`}
                fill={isA ? BONE : ASH}
              />
              {/* To */}
              <rect
                x={228}
                y={y}
                width={100}
                height={32}
                rx={8}
                fill={t.toC + "12"}
                stroke={t.toC + (isA ? "88" : "44")}
              />
              <text
                x={278}
                y={y + 20}
                textAnchor="middle"
                fill={t.toC}
                fontSize={11}
                fontWeight={600}
                fontFamily="'Segoe UI', sans-serif"
              >
                {t.to}
              </text>
              {/* Insight */}
              <text
                x={346}
                y={y + 20}
                fill={isA ? BONE : ASH}
                fontSize={10}
                fontFamily="Georgia, serif"
                fontStyle="italic"
              >
                {t.insight}
              </text>
            </g>
          );
        })}
      </svg>
    </Reveal>
  );
}

// ═══════════════════════════════════════════════════════════════
// THESIS BEAMS — animated SVG showing version transitions
// Replaces the text card grid with a visual arrow flow.
// ═══════════════════════════════════════════════════════════════
function ThesisBeams() {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  const [hovered, setHovered] = useState(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVis(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const beams = [
    {
      from: "Speech",
      to: "Writing",
      verb: "Transmit",
      color: GOLD,
      ver: "v1.0 → v2.0",
      out: "Nations, religions",
    },
    {
      from: "Text",
      to: "Code",
      verb: "Store",
      color: ICE,
      ver: "v2.0 → v3.0",
      out: "Internet, global finance",
    },
    {
      from: "Code",
      to: "LLMs",
      verb: "Execute",
      color: GREEN,
      ver: "v3.0 → v4.0",
      out: "Agents, synthesis",
    },
  ];

  return (
    <Reveal>
      <div ref={ref}>
        <svg
          viewBox="0 0 640 230"
          style={{
            width: "100%",
            maxWidth: 640,
            display: "block",
            margin: "24px auto",
          }}
        >
          {beams.map((b, i) => {
            const y = 16 + i * 72;
            const d = vis ? i * 0.2 : 0;
            const isH = hovered === i;
            return (
              <g
                key={i}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  cursor: "pointer",
                  opacity: vis ? 1 : 0,
                  transition: `opacity 0.8s ease ${d}s`,
                }}
              >
                {/* Row highlight */}
                {isH && (
                  <rect
                    x={0}
                    y={y - 4}
                    width={640}
                    height={64}
                    rx={12}
                    fill={b.color + "06"}
                  />
                )}
                {/* Version label */}
                <text
                  x={16}
                  y={y + 28}
                  fill={b.color}
                  fontSize={9}
                  fontWeight={700}
                  fontFamily="monospace"
                  letterSpacing={1}
                >
                  {b.ver}
                </text>
                {/* From node */}
                <rect
                  x={110}
                  y={y + 6}
                  width={90}
                  height={38}
                  rx={10}
                  fill={b.color + "0c"}
                  stroke={b.color + (isH ? "66" : "33")}
                  strokeWidth={isH ? 1.5 : 1}
                  style={{ transition: "all 0.3s" }}
                />
                <text
                  x={155}
                  y={y + 30}
                  textAnchor="middle"
                  fill={b.color}
                  fontSize={12}
                  fontWeight={600}
                  fontFamily="'Segoe UI', sans-serif"
                >
                  {b.from}
                </text>
                {/* Animated arrow beam */}
                <line
                  x1={210}
                  y1={y + 25}
                  x2={340}
                  y2={y + 25}
                  stroke={b.color + (isH ? "66" : "33")}
                  strokeWidth={isH ? 2.5 : 2}
                  strokeDasharray="8 4"
                  style={{ transition: "all 0.3s" }}
                >
                  {vis && (
                    <animate
                      attributeName="strokeDashoffset"
                      values="12;0"
                      dur="1s"
                      repeatCount="indefinite"
                    />
                  )}
                </line>
                {/* Verb label on arrow */}
                <text
                  x={275}
                  y={y + 18}
                  textAnchor="middle"
                  fill={b.color + "88"}
                  fontSize={8}
                  fontFamily="monospace"
                  letterSpacing={2}
                >
                  {b.verb.toUpperCase()}
                </text>
                {/* Arrow head */}
                <polygon
                  points={`340,${y + 19} 340,${y + 31} 354,${y + 25}`}
                  fill={b.color + (isH ? "88" : "55")}
                  style={{ transition: "fill 0.3s" }}
                />
                {/* To node */}
                <rect
                  x={362}
                  y={y + 6}
                  width={90}
                  height={38}
                  rx={10}
                  fill={b.color + (isH ? "22" : "14")}
                  stroke={b.color + (isH ? "88" : "55")}
                  strokeWidth={1.5}
                  style={{
                    transition: "all 0.3s",
                    filter: isH ? `drop-shadow(0 0 8px ${b.color}44)` : "none",
                  }}
                />
                <text
                  x={407}
                  y={y + 30}
                  textAnchor="middle"
                  fill={b.color}
                  fontSize={12}
                  fontWeight={700}
                  fontFamily="'Segoe UI', sans-serif"
                >
                  {b.to}
                </text>
                {/* Output */}
                <text
                  x={470}
                  y={y + 30}
                  fill={isH ? BONE : ASH}
                  fontSize={10}
                  fontFamily="Georgia, serif"
                  fontStyle="italic"
                  style={{ transition: "fill 0.3s" }}
                >
                  → {b.out}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </Reveal>
  );
}

// ═══════════════════════════════════════════════════════════════
// CLAIM STRENGTH VIS — replaces text-based counterargument cards
// Visual strength meter comparing unfalsifiable vs testable claims.
// ═══════════════════════════════════════════════════════════════
function ClaimStrengthVis() {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  const [hovered, setHovered] = useState(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVis(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const claims = [
    {
      label: "Strong Claim",
      text: '"AI was inevitable because complexity demanded it"',
      verdict: "UNFALSIFIABLE",
      color: EMBER,
      strength: 25,
    },
    {
      label: "Defensible Claim",
      text: '"Each layer generates complexity exceeding its capacity"',
      verdict: "OBSERVABLE · TESTABLE",
      color: GREEN,
      strength: 82,
    },
  ];

  return (
    <Reveal>
      <div ref={ref} style={{ margin: "32px 0" }}>
        <div
          style={{
            ...mono,
            fontSize: 9,
            letterSpacing: 2,
            color: ASH,
            textTransform: "uppercase",
            marginBottom: 20,
            textAlign: "center",
          }}
        >
          Epistemic strength of each framing
        </div>
        <svg
          viewBox="0 0 640 170"
          style={{
            width: "100%",
            maxWidth: 640,
            display: "block",
            margin: "0 auto",
          }}
        >
          {claims.map((c, i) => {
            const y = 10 + i * 80;
            const isH = hovered === i;
            const barW = (c.strength / 100) * 360;
            const d = vis ? i * 0.15 : 0;
            return (
              <g
                key={i}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: "pointer" }}
              >
                <rect
                  x={0}
                  y={y}
                  width={640}
                  height={68}
                  rx={12}
                  fill={isH ? c.color + "08" : "transparent"}
                  style={{ transition: "fill 0.3s" }}
                />
                {/* Label */}
                <text
                  x={16}
                  y={y + 18}
                  fill={c.color}
                  fontSize={9}
                  fontWeight={700}
                  fontFamily="monospace"
                  letterSpacing={2}
                >
                  {c.label.toUpperCase()}
                </text>
                {/* Claim text */}
                <text
                  x={16}
                  y={y + 38}
                  fill={isH ? BONE : ASH}
                  fontSize={11}
                  fontFamily="Georgia, serif"
                  fontStyle="italic"
                  style={{ transition: "fill 0.3s" }}
                >
                  {c.text}
                </text>
                {/* Strength bar */}
                <rect
                  x={260}
                  y={y + 48}
                  width={360}
                  height={10}
                  rx={5}
                  fill={LINE}
                />
                <rect
                  x={260}
                  y={y + 48}
                  width={vis ? barW : 0}
                  height={10}
                  rx={5}
                  fill={c.color + "55"}
                  stroke={c.color + "33"}
                  strokeWidth={0.5}
                  style={{
                    transition: `width 1.2s cubic-bezier(0.16,1,0.3,1) ${d}s`,
                    filter: isH ? `drop-shadow(0 0 6px ${c.color}44)` : "none",
                  }}
                />
                {/* Verdict pill */}
                <text
                  x={260 + barW + 10}
                  y={y + 57}
                  fill={c.color}
                  fontSize={8}
                  fontWeight={600}
                  fontFamily="monospace"
                  style={{
                    opacity: vis ? 1 : 0,
                    transition: `opacity 0.5s ease ${d + 0.3}s`,
                  }}
                >
                  {c.verdict}
                </text>
              </g>
            );
          })}
        </svg>
        <div
          style={{
            padding: "12px 16px",
            background: GREEN + "06",
            border: `1px solid ${GREEN}22`,
            borderRadius: 12,
            marginTop: 12,
            textAlign: "center",
          }}
        >
          <span style={{ ...serif, fontSize: 13, color: BONE }}>
            The form is contingent.{" "}
            <span style={{ color: GREEN }}>The pressure is structural.</span>
          </span>
        </div>
      </div>
    </Reveal>
  );
}

// ═══════════════ MAIN COMPONENT ═══════════════
export default function SoftwareTheory({ onBack }) {
  return (
    <div style={{ background: BG, minHeight: "100vh", color: BONE }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 999,
          pointerEvents: "none",
          opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Back button — fixed position */}
      <button
        onClick={onBack}
        style={{
          position: "fixed",
          top: 20,
          left: 20,
          zIndex: 100,
          ...mono,
          fontSize: 11,
          letterSpacing: 1,
          color: ASH,
          background: "rgba(255,255,255,0.03)",
          border: `1px solid ${LINE}`,
          borderRadius: 8,
          padding: "8px 16px",
          cursor: "pointer",
          transition: "color 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = ICE)}
        onMouseLeave={(e) => (e.currentTarget.style.color = ASH)}
      >
        ← Back
      </button>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 740,
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        {/* ═══ HERO ═══ */}
        <section
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            padding: "80px 0",
          }}
        >
          <div
            style={{
              ...mono,
              fontSize: 10,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: GHOST,
              marginBottom: 36,
              animation: "fadeIn 2s ease 0.5s both",
            }}
          >
            A framework for understanding human progress
          </div>
          <h1
            style={{
              ...sans,
              fontSize: "clamp(44px, 9vw, 72px)",
              fontWeight: 800,
              lineHeight: 0.95,
              letterSpacing: -3,
              animation: "fadeUp 1.5s ease 1s both",
            }}
          >
            The Software Theory
            <br />
            <span
              style={{
                background: `linear-gradient(135deg, ${GHOST}, ${ICE})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              of Civilization
            </span>
          </h1>
          <p
            style={{
              ...serif,
              fontSize: 19,
              fontWeight: 300,
              fontStyle: "italic",
              color: ASH,
              maxWidth: 440,
              marginTop: 32,
              lineHeight: 1.7,
              animation: "fadeUp 1.5s ease 1.5s both",
            }}
          >
            Civilization does not just use software. Civilization is software.
          </p>
        </section>

        {/* ═══ CH I: CORE THESIS ═══ */}
        <Chapter
          label="Chapter I — The Core Thesis"
          title="Every upgrade to how we transmit information rewrites civilization"
        >
          <ThesisBeams />
        </Chapter>

        {/* ═══ CH II: THE STACK ═══ */}
        <Chapter
          label="Chapter II — The Stack"
          title="Four version updates to our collective processing capacity"
        >
          <AnimatedStack />
          <CompressionTimeline />
        </Chapter>

        {/* ═══ CH III: THE BOTTLENECK ═══ */}
        <Chapter
          label="Chapter III — The Bottleneck"
          title="The system outgrew its operators"
        >
          <BottleneckGauges />
        </Chapter>

        {/* ═══ CH IV: THE PATTERN ═══ */}
        <Chapter
          label="Chapter IV — The Pattern"
          title="Each layer abstracts over the previous — never replaces it"
        >
          <AbstractionFlow />
          <Reveal>
            <div
              style={{
                padding: "16px 20px",
                background: FAINT,
                border: `1px solid ${LINE}`,
                borderRadius: 12,
                marginTop: 16,
                textAlign: "center",
              }}
            >
              <span style={{ ...serif, fontSize: 14, color: BONE }}>
                Writing didn't kill speech. Code didn't kill law.{" "}
                <span style={{ color: ICE }}>LLMs won't kill code.</span>
              </span>
            </div>
          </Reveal>
        </Chapter>

        {/* ═══ CH V: GATEKEEPERS ═══ */}
        <Chapter
          label="Chapter V — The Implication"
          title="If civilization is software, who controls the compiler?"
        >
          <GatekeeperFlow />
        </Chapter>

        {/* ═══ CH VI: COUNTERARGUMENT ═══ */}
        <Chapter
          label="Chapter VI — The Counterargument"
          title='Was this "inevitable"?'
        >
          <ClaimStrengthVis />
        </Chapter>

        {/* ═══ CLOSER ═══ */}
        <section
          style={{
            padding: "80px 0 120px",
            borderTop: `1px solid ${LINE}`,
            textAlign: "center",
          }}
        >
          <Reveal>
            <h2
              style={{
                ...sans,
                fontSize: "clamp(26px, 4.5vw, 40px)",
                fontWeight: 700,
                lineHeight: 1.15,
                maxWidth: 540,
                margin: "0 auto 20px",
              }}
            >
              The software is the civilization.
              <br />
              The question is who writes the{" "}
              <span style={{ color: GHOST }}>next commit</span>.
            </h2>
          </Reveal>
          <Reveal delay={0.4}>
            <div
              style={{
                ...mono,
                fontSize: 10,
                color: "rgba(255,255,255,0.12)",
                letterSpacing: 0.5,
                lineHeight: 2,
                marginTop: 56,
              }}
            >
              From a conversation between a human and a language model ·
              February 2026
            </div>
          </Reveal>
        </section>
      </div>
    </div>
  );
}
