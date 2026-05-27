import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════
   TECHNOLOGY AS ENTROPY
   Technology is a dissipative structure — once complex enough,
   its march toward ASI becomes thermodynamically inevitable.
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

// ── ENTROPY CURVE — animated S-curve with phase transition markers ──
const PHASES = [
  { x: 0.05, label: "Fire", year: "~1M yrs ago", color: EMBER, icon: "🔥" },
  {
    x: 0.18,
    label: "Agriculture",
    year: "~10,000 BCE",
    color: GOLD,
    icon: "🌾",
  },
  { x: 0.35, label: "Writing", year: "~3,200 BCE", color: ICE, icon: "📜" },
  { x: 0.52, label: "Printing", year: "1440 CE", color: GREEN, icon: "📖" },
  { x: 0.68, label: "Electricity", year: "1879 CE", color: GOLD, icon: "⚡" },
  { x: 0.8, label: "Computing", year: "1945 CE", color: ICE, icon: "💻" },
  { x: 0.88, label: "Internet", year: "1991 CE", color: GREEN, icon: "🌐" },
  { x: 0.94, label: "AI", year: "2023 CE", color: GHOST, icon: "🧠" },
  { x: 0.99, label: "ASI?", year: "????", color: EMBER, icon: "∞" },
];

function EntropyCurve() {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [progress, setProgress] = useState(0);
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
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!vis) return;
    let start = null;
    function tick(ts) {
      if (!start) start = ts;
      const elapsed = (ts - start) / 2500;
      setProgress(Math.min(elapsed, 1));
      if (elapsed < 1) frameRef.current = requestAnimationFrame(tick);
    }
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [vis]);

  const W = 660,
    H = 380,
    padL = 50,
    padR = 30,
    padT = 30,
    padB = 80;
  const gW = W - padL - padR,
    gH = H - padT - padB;

  // exponential curve: y = e^(kx) scaled
  function curveY(t) {
    const k = 6;
    return 1 - (Math.exp(k * t) - 1) / (Math.exp(k) - 1);
  }

  // Build path
  const pts = [];
  const steps = 120;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    if (t > progress) break;
    const px = padL + t * gW;
    const py = padT + curveY(t) * gH;
    pts.push(`${i === 0 ? "M" : "L"} ${px.toFixed(1)} ${py.toFixed(1)}`);
  }

  return (
    <Reveal>
      <div ref={ref} style={{ margin: "24px 0" }}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          style={{
            width: "100%",
            maxWidth: W,
            display: "block",
            margin: "0 auto",
          }}
        >
          {/* Grid lines */}
          {[0.25, 0.5, 0.75].map((t, i) => (
            <line
              key={i}
              x1={padL}
              y1={padT + t * gH}
              x2={padL + gW}
              y2={padT + t * gH}
              stroke={LINE}
              strokeWidth={0.5}
            />
          ))}

          {/* Y-axis label */}
          <text
            x={14}
            y={padT + gH / 2}
            fill={ASH}
            fontSize={9}
            fontFamily="monospace"
            transform={`rotate(-90, 14, ${padT + gH / 2})`}
            textAnchor="middle"
          >
            COMPLEXITY / ENERGY THROUGHPUT
          </text>

          {/* X-axis label */}
          <text
            x={padL + gW / 2}
            y={H - 8}
            fill={ASH}
            fontSize={9}
            fontFamily="monospace"
            textAnchor="middle"
          >
            TIME →
          </text>

          {/* Curve */}
          <path
            d={pts.join(" ")}
            fill="none"
            stroke={EMBER}
            strokeWidth={2.5}
            style={{ filter: `drop-shadow(0 0 6px ${EMBER}44)` }}
          />

          {/* Fill under curve */}
          {pts.length > 1 && (
            <path
              d={`${pts.join(" ")} L ${(padL + progress * gW).toFixed(1)} ${padT + gH} L ${padL} ${padT + gH} Z`}
              fill={`url(#entGrad)`}
            />
          )}
          <defs>
            <linearGradient id="entGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={EMBER} stopOpacity={0.12} />
              <stop offset="100%" stopColor={EMBER} stopOpacity={0} />
            </linearGradient>
          </defs>

          {/* Phase markers */}
          {PHASES.map((p, i) => {
            if (p.x > progress) return null;
            const px = padL + p.x * gW;
            const py = padT + curveY(p.x) * gH;
            const isH = hovered === i;
            return (
              <g
                key={i}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: "pointer" }}
              >
                {/* Vertical marker line */}
                <line
                  x1={px}
                  y1={py}
                  x2={px}
                  y2={padT + gH}
                  stroke={p.color + "33"}
                  strokeWidth={1}
                  strokeDasharray="3 3"
                />
                {/* Dot */}
                <circle
                  cx={px}
                  cy={py}
                  r={isH ? 6 : 4}
                  fill={p.color}
                  style={{
                    transition: "r 0.2s",
                    filter: isH ? `drop-shadow(0 0 8px ${p.color}88)` : "none",
                  }}
                />
                {/* Label */}
                <text
                  x={px}
                  y={padT + gH + 16}
                  textAnchor="middle"
                  fill={p.color}
                  fontSize={isH ? 10 : 8}
                  fontWeight={isH ? 700 : 400}
                  fontFamily="'Segoe UI', sans-serif"
                  style={{ transition: "all 0.2s" }}
                >
                  {p.label}
                </text>
                <text
                  x={px}
                  y={padT + gH + 28}
                  textAnchor="middle"
                  fill={ASH}
                  fontSize={7}
                  fontFamily="monospace"
                >
                  {p.year}
                </text>
                {/* Hover tooltip */}
                {isH && (
                  <g>
                    <rect
                      x={px - 50}
                      y={py - 32}
                      width={100}
                      height={22}
                      rx={6}
                      fill={BG}
                      stroke={p.color + "44"}
                    />
                    <text
                      x={px}
                      y={py - 17}
                      textAnchor="middle"
                      fill={p.color}
                      fontSize={9}
                      fontWeight={600}
                      fontFamily="monospace"
                    >
                      Phase transition
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Axis lines */}
          <line
            x1={padL}
            y1={padT}
            x2={padL}
            y2={padT + gH}
            stroke={ASH + "44"}
            strokeWidth={1}
          />
          <line
            x1={padL}
            y1={padT + gH}
            x2={padL + gW}
            y2={padT + gH}
            stroke={ASH + "44"}
            strokeWidth={1}
          />
        </svg>
        <div
          style={{
            ...mono,
            fontSize: 9,
            color: ASH,
            textAlign: "center",
            marginTop: 8,
          }}
        >
          Each transition compresses time exponentially · Hover to explore
        </div>
      </div>
    </Reveal>
  );
}

// ── PHASE TRANSITION — particles reorganizing through states ──
function PhaseTransitionVis() {
  const canvasRef = useRef(null);
  const [phase, setPhase] = useState(0); // 0=chaos, 1=ordering, 2=structure, 3=new chaos
  const particles = useRef([]);
  const frameRef = useRef(null);

  const PHASE_NAMES = [
    { name: "Chaos", sub: "Maximum entropy · No structure", color: EMBER },
    {
      name: "Ordering",
      sub: "Energy gradient drives self-organization",
      color: GOLD,
    },
    {
      name: "Dissipative Structure",
      sub: "Order maintained far from equilibrium",
      color: ICE,
    },
    {
      name: "Phase Transition",
      sub: "Structure collapses → higher-order emerges",
      color: GHOST,
    },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = 600,
      H = 300;
    canvas.width = W;
    canvas.height = H;

    // Initialize particles
    particles.current = Array.from({ length: 80 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 3,
      vy: (Math.random() - 0.5) * 3,
      targetX: 0,
      targetY: 0,
      color: [EMBER, GOLD, ICE, GREEN, GHOST][Math.floor(Math.random() * 5)],
    }));

    let running = true;
    function tick() {
      if (!running) return;
      ctx.fillStyle = "rgba(5,5,8,0.15)";
      ctx.fillRect(0, 0, W, H);

      const pts = particles.current;
      const cx = W / 2,
        cy = H / 2;

      for (const p of pts) {
        if (phase === 0) {
          // Chaos — random brownian
          p.vx += (Math.random() - 0.5) * 0.8;
          p.vy += (Math.random() - 0.5) * 0.8;
        } else if (phase === 1) {
          // Ordering — attract to cluster centers
          const angle = Math.atan2(p.y - cy, p.x - cx);
          const clustR = 80;
          p.targetX = cx + Math.cos(angle) * clustR;
          p.targetY = cy + Math.sin(angle) * clustR;
          p.vx += (p.targetX - p.x) * 0.008;
          p.vy += (p.targetY - p.y) * 0.008;
        } else if (phase === 2) {
          // Structure — orbit in formation
          const idx = pts.indexOf(p);
          const ring = Math.floor(idx / 20);
          const angleOffset =
            ((idx % 20) / 20) * Math.PI * 2 +
            performance.now() * 0.0005 * (ring % 2 === 0 ? 1 : -1);
          const r = 40 + ring * 35;
          p.targetX = cx + Math.cos(angleOffset) * r;
          p.targetY = cy + Math.sin(angleOffset) * r;
          p.vx += (p.targetX - p.x) * 0.03;
          p.vy += (p.targetY - p.y) * 0.03;
        } else {
          // Phase transition — expand then re-coalesce into two structures
          const idx = pts.indexOf(p);
          const side = idx < 40 ? -1 : 1;
          const localCx = cx + side * 140;
          const ring = Math.floor((idx % 40) / 10);
          const ao =
            ((idx % 10) / 10) * Math.PI * 2 +
            performance.now() * 0.001 * (ring % 2 === 0 ? 1 : -1);
          const r = 25 + ring * 22;
          p.targetX = localCx + Math.cos(ao) * r;
          p.targetY = cy + Math.sin(ao) * r;
          p.vx += (p.targetX - p.x) * 0.02;
          p.vy += (p.targetY - p.y) * 0.02;
        }

        p.vx *= 0.94;
        p.vy *= 0.94;
        p.x += p.vx;
        p.y += p.vy;
        p.x = Math.max(5, Math.min(W - 5, p.x));
        p.y = Math.max(5, Math.min(H - 5, p.y));

        // Draw connections in structured phases
        if (phase >= 1) {
          for (const q of pts) {
            if (q === p) continue;
            const dx = p.x - q.x,
              dy = p.y - q.y;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < (phase === 2 ? 50 : 35)) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(q.x, q.y);
              ctx.strokeStyle = `rgba(110,231,240,${0.08 * (1 - d / 50)})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }

      frameRef.current = requestAnimationFrame(tick);
    }
    frameRef.current = requestAnimationFrame(tick);
    return () => {
      running = false;
      cancelAnimationFrame(frameRef.current);
    };
  }, [phase]);

  return (
    <Reveal>
      <div style={{ margin: "32px 0" }}>
        <canvas
          ref={canvasRef}
          style={{
            width: "100%",
            maxWidth: 600,
            display: "block",
            margin: "0 auto",
            borderRadius: 16,
            border: `1px solid ${LINE}`,
            background: BG,
          }}
        />
        {/* Phase controls */}
        <div
          style={{
            display: "flex",
            gap: 6,
            justifyContent: "center",
            margin: "16px 0",
          }}
        >
          {PHASE_NAMES.map((p, i) => (
            <button
              key={i}
              onClick={() => setPhase(i)}
              style={{
                ...mono,
                fontSize: 9,
                letterSpacing: 1,
                padding: "6px 14px",
                borderRadius: 20,
                background: phase === i ? p.color + "18" : "transparent",
                border: `1px solid ${phase === i ? p.color + "66" : LINE}`,
                color: phase === i ? p.color : ASH,
                cursor: "pointer",
                transition: "all 0.3s",
              }}
            >
              {p.name}
            </button>
          ))}
        </div>
        <div
          style={{
            textAlign: "center",
            padding: "10px 16px",
            borderRadius: 10,
            background: PHASE_NAMES[phase].color + "08",
            border: `1px solid ${PHASE_NAMES[phase].color}22`,
            transition: "all 0.4s",
          }}
        >
          <span
            style={{ ...mono, fontSize: 10, color: PHASE_NAMES[phase].color }}
          >
            {PHASE_NAMES[phase].sub}
          </span>
        </div>
      </div>
    </Reveal>
  );
}

// ── DISSIPATIVE STRUCTURE — interactive energy flow diagram ──
function DissipativeStructure() {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  const [hoveredPart, setHoveredPart] = useState(null);

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

  const parts = [
    {
      id: "input",
      label: "Energy Input",
      sub: "Resources, capital, data",
      x: 60,
      y: 180,
      color: GOLD,
      w: 130,
    },
    {
      id: "structure",
      label: "Dissipative Structure",
      sub: "Technology / civilization",
      x: 250,
      y: 100,
      color: ICE,
      w: 180,
    },
    {
      id: "output",
      label: "Entropy Output",
      sub: "Waste heat, pollution, complexity debt",
      x: 490,
      y: 180,
      color: EMBER,
      w: 140,
    },
    {
      id: "feedback",
      label: "Feedback Loop",
      sub: "Growth demands more input",
      x: 250,
      y: 280,
      color: GHOST,
      w: 160,
    },
  ];

  return (
    <Reveal>
      <div ref={ref} style={{ margin: "32px 0" }}>
        <svg
          viewBox="0 0 660 360"
          style={{
            width: "100%",
            maxWidth: 660,
            display: "block",
            margin: "0 auto",
          }}
        >
          <defs>
            <marker
              id="arrE"
              markerWidth="8"
              markerHeight="6"
              refX="8"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 8 3, 0 6" fill={GOLD + "88"} />
            </marker>
            <marker
              id="arrO"
              markerWidth="8"
              markerHeight="6"
              refX="8"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 8 3, 0 6" fill={EMBER + "88"} />
            </marker>
            <marker
              id="arrF"
              markerWidth="8"
              markerHeight="6"
              refX="8"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 8 3, 0 6" fill={GHOST + "88"} />
            </marker>
          </defs>

          {/* Flow arrows */}
          <path
            d="M 190 180 Q 220 140 250 130"
            fill="none"
            stroke={GOLD + "66"}
            strokeWidth={2}
            markerEnd="url(#arrE)"
            strokeDasharray={vis ? "none" : "200"}
            strokeDashoffset={vis ? 0 : 200}
            style={{ transition: "stroke-dashoffset 1s ease 0.3s" }}
          >
            {vis && (
              <animate
                attributeName="strokeDashoffset"
                values="0;-16"
                dur="1.5s"
                repeatCount="indefinite"
              />
            )}
          </path>
          <path
            d="M 430 130 Q 460 140 490 170"
            fill="none"
            stroke={EMBER + "66"}
            strokeWidth={2}
            markerEnd="url(#arrO)"
            strokeDasharray={vis ? "none" : "200"}
            strokeDashoffset={vis ? 0 : 200}
            style={{ transition: "stroke-dashoffset 1s ease 0.5s" }}
          >
            {vis && (
              <animate
                attributeName="strokeDashoffset"
                values="0;-16"
                dur="1.5s"
                repeatCount="indefinite"
              />
            )}
          </path>
          {/* Feedback loop */}
          <path
            d="M 490 230 Q 490 300 410 300"
            fill="none"
            stroke={GHOST + "44"}
            strokeWidth={1.5}
            strokeDasharray="6 4"
          />
          <path
            d="M 250 300 Q 140 300 120 230"
            fill="none"
            stroke={GHOST + "44"}
            strokeWidth={1.5}
            strokeDasharray="6 4"
            markerEnd="url(#arrF)"
          >
            {vis && (
              <animate
                attributeName="strokeDashoffset"
                values="0;-20"
                dur="2s"
                repeatCount="indefinite"
              />
            )}
          </path>

          {/* Nodes */}
          {parts.map((p) => {
            const isH = hoveredPart === p.id;
            return (
              <g
                key={p.id}
                onMouseEnter={() => setHoveredPart(p.id)}
                onMouseLeave={() => setHoveredPart(null)}
                style={{
                  cursor: "pointer",
                  opacity: vis ? 1 : 0,
                  transition: `opacity 0.6s ease 0.4s`,
                }}
              >
                <rect
                  x={p.x}
                  y={p.y}
                  width={p.w}
                  height={60}
                  rx={14}
                  fill={isH ? p.color + "18" : p.color + "0a"}
                  stroke={p.color + (isH ? "88" : "33")}
                  strokeWidth={isH ? 2 : 1}
                  style={{ transition: "all 0.3s" }}
                />
                {isH && (
                  <rect
                    x={p.x}
                    y={p.y}
                    width={p.w}
                    height={60}
                    rx={14}
                    fill="none"
                    stroke={p.color}
                    strokeWidth={1}
                    opacity={0.3}
                    style={{ filter: `drop-shadow(0 0 12px ${p.color}44)` }}
                  />
                )}
                <text
                  x={p.x + p.w / 2}
                  y={p.y + 24}
                  textAnchor="middle"
                  fill={p.color}
                  fontSize={11}
                  fontWeight={700}
                  fontFamily="'Segoe UI', sans-serif"
                >
                  {p.label}
                </text>
                <text
                  x={p.x + p.w / 2}
                  y={p.y + 42}
                  textAnchor="middle"
                  fill={ASH}
                  fontSize={8}
                  fontFamily="Georgia, serif"
                  fontStyle="italic"
                >
                  {p.sub}
                </text>
              </g>
            );
          })}

          {/* Center label */}
          <text
            x={330}
            y={34}
            textAnchor="middle"
            fill={ASH}
            fontSize={9}
            fontFamily="monospace"
          >
            PRIGOGINE'S INSIGHT: Order emerges from energy flow, not despite
            entropy — because of it
          </text>
        </svg>
      </div>
    </Reveal>
  );
}

// ── TECH CASCADE — animated flow from monolith→microservices→AI ──
const CASCADE_STAGES = [
  {
    id: "mono",
    label: "Monolith",
    desc: "Single codebase, single deploy",
    color: GOLD,
    y: 20,
  },
  {
    id: "soa",
    label: "SOA",
    desc: "Service boundaries, shared buses",
    color: GREEN,
    y: 80,
  },
  {
    id: "micro",
    label: "Microservices",
    desc: "Independent, distributed, complex",
    color: ICE,
    y: 140,
  },
  {
    id: "mesh",
    label: "Service Mesh",
    desc: "Sidecar proxies manage connections",
    color: GHOST,
    y: 200,
  },
  {
    id: "platform",
    label: "Platform Eng",
    desc: "Internal developer platforms abstract it all",
    color: GOLD,
    y: 260,
  },
  {
    id: "ai",
    label: "AI Agents",
    desc: "The system manages itself",
    color: EMBER,
    y: 320,
  },
];

function TechCascadeFlow() {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  const [activeStage, setActiveStage] = useState(null);

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
    <Reveal>
      <div ref={ref} style={{ margin: "32px 0" }}>
        <svg
          viewBox="0 0 640 400"
          style={{
            width: "100%",
            maxWidth: 640,
            display: "block",
            margin: "0 auto",
          }}
        >
          {/* Complexity gradient bar on right */}
          <defs>
            <linearGradient id="compGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={GOLD} stopOpacity={0.3} />
              <stop offset="50%" stopColor={ICE} stopOpacity={0.3} />
              <stop offset="100%" stopColor={EMBER} stopOpacity={0.5} />
            </linearGradient>
          </defs>

          {/* Complexity meter */}
          <rect x={590} y={20} width={16} height={340} rx={8} fill={LINE} />
          <rect
            x={590}
            y={20}
            width={16}
            height={vis ? 340 : 0}
            rx={8}
            fill="url(#compGrad)"
            style={{ transition: "height 2s cubic-bezier(0.16,1,0.3,1) 0.5s" }}
          />
          <text
            x={598}
            y={12}
            textAnchor="middle"
            fill={ASH}
            fontSize={7}
            fontFamily="monospace"
          >
            COMPLEXITY
          </text>

          {/* Entropy arrow */}
          <text
            x={20}
            y={200}
            fill={ASH}
            fontSize={8}
            fontFamily="monospace"
            transform="rotate(-90, 20, 200)"
            textAnchor="middle"
          >
            ENTROPY MANAGEMENT ▼
          </text>

          {/* Stages */}
          {CASCADE_STAGES.map((s, i) => {
            const isA = activeStage === i;
            const barW = 120 + i * 50; // each stage wider = more complexity
            const x = 50;
            const d = vis ? i * 0.12 : 0;
            return (
              <g
                key={s.id}
                onMouseEnter={() => setActiveStage(i)}
                onMouseLeave={() => setActiveStage(null)}
                style={{
                  cursor: "pointer",
                  opacity: vis ? 1 : 0,
                  transition: `opacity 0.6s ease ${d}s`,
                }}
              >
                {/* Stage bar */}
                <rect
                  x={x}
                  y={s.y}
                  width={vis ? barW : 0}
                  height={44}
                  rx={10}
                  fill={isA ? s.color + "18" : s.color + "08"}
                  stroke={s.color + (isA ? "88" : "33")}
                  strokeWidth={isA ? 2 : 1}
                  style={{
                    transition: `width 1s cubic-bezier(0.16,1,0.3,1) ${d}s, fill 0.3s, stroke 0.3s`,
                  }}
                />
                {isA && (
                  <rect
                    x={x}
                    y={s.y}
                    width={barW}
                    height={44}
                    rx={10}
                    fill="none"
                    stroke={s.color}
                    opacity={0.3}
                    style={{ filter: `drop-shadow(0 0 8px ${s.color}44)` }}
                  />
                )}
                {/* Labels */}
                <text
                  x={x + 16}
                  y={s.y + 18}
                  fill={s.color}
                  fontSize={12}
                  fontWeight={700}
                  fontFamily="'Segoe UI', sans-serif"
                  style={{
                    opacity: vis ? 1 : 0,
                    transition: `opacity 0.6s ease ${d + 0.2}s`,
                  }}
                >
                  {s.label}
                </text>
                <text
                  x={x + 16}
                  y={s.y + 34}
                  fill={ASH}
                  fontSize={9}
                  fontFamily="Georgia, serif"
                  style={{
                    opacity: vis ? 1 : 0,
                    transition: `opacity 0.6s ease ${d + 0.3}s`,
                  }}
                >
                  {s.desc}
                </text>
                {/* Connection line to next */}
                {i < CASCADE_STAGES.length - 1 && (
                  <line
                    x1={x + barW / 2}
                    y1={s.y + 44}
                    x2={x + (barW + 50) / 2}
                    y2={s.y + 60}
                    stroke={LINE}
                    strokeWidth={1}
                    strokeDasharray="3 3"
                    style={{
                      opacity: vis ? 1 : 0,
                      transition: `opacity 0.6s ease ${d + 0.4}s`,
                    }}
                  />
                )}
                {/* Complexity dots */}
                {Array.from({ length: i + 1 }).map((_, j) => (
                  <circle
                    key={j}
                    cx={x + barW - 14 - j * 10}
                    cy={s.y + 22}
                    r={3}
                    fill={s.color + "55"}
                    style={{
                      opacity: vis ? 1 : 0,
                      transition: `opacity 0.6s ease ${d + 0.3}s`,
                    }}
                  />
                ))}
              </g>
            );
          })}

          {/* Callout for active stage */}
          {activeStage !== null && (
            <g>
              <rect
                x={390}
                y={CASCADE_STAGES[activeStage].y - 5}
                width={180}
                height={54}
                rx={10}
                fill={BG}
                stroke={CASCADE_STAGES[activeStage].color + "44"}
                strokeWidth={1}
              />
              <text
                x={400}
                y={CASCADE_STAGES[activeStage].y + 15}
                fill={CASCADE_STAGES[activeStage].color}
                fontSize={10}
                fontWeight={600}
                fontFamily="monospace"
              >
                {
                  [
                    "1 app, 1 team",
                    "~10 services",
                    "~100+ services",
                    "~1000+ connections",
                    "Abstraction layer",
                    "Self-managing",
                  ][activeStage]
                }
              </text>
              <text
                x={400}
                y={CASCADE_STAGES[activeStage].y + 32}
                fill={ASH}
                fontSize={9}
                fontFamily="Georgia, serif"
              >
                {
                  [
                    "Simple · Human-scale",
                    "Manageable · API contracts",
                    "Complex · Human limit",
                    "Overwhelming · Tooling required",
                    "IDP manages complexity",
                    "AI manages the platform",
                  ][activeStage]
                }
              </text>
            </g>
          )}
        </svg>
      </div>
    </Reveal>
  );
}

// ── INEVITABILITY THERMOMETER — are we past the point of no return? ──
function InevitabilityGauge() {
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

  const markers = [
    { pct: 15, label: "Fire", color: EMBER },
    { pct: 30, label: "Agriculture", color: GOLD },
    { pct: 45, label: "Writing", color: ICE },
    { pct: 60, label: "Electricity", color: GREEN },
    { pct: 75, label: "Computing", color: GHOST },
    { pct: 88, label: "AI", color: EMBER },
    { pct: 98, label: "ASI?", color: GHOST },
  ];

  return (
    <Reveal>
      <div
        ref={ref}
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          margin: "32px 0",
          borderRadius: 16,
          overflow: "hidden",
        }}
      >
        {/* For */}
        <div
          style={{
            background: EMBER + "08",
            border: `1px solid ${EMBER}22`,
            borderRadius: 16,
            padding: "24px 20px",
          }}
        >
          <div
            style={{
              ...mono,
              fontSize: 9,
              letterSpacing: 2,
              color: EMBER,
              marginBottom: 14,
            }}
          >
            THERMODYNAMIC CASE
          </div>
          {[
            "Energy throughput always increases",
            "Each phase creates the conditions for the next",
            "No civilization has voluntarily reduced complexity",
            "The pattern predates human intention",
          ].map((t, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 8,
                alignItems: "flex-start",
                padding: "6px 0",
                borderBottom: i < 3 ? `1px solid ${LINE}` : "none",
              }}
            >
              <span style={{ color: EMBER, fontSize: 12 }}>→</span>
              <span
                style={{ ...serif, fontSize: 13, color: BONE, lineHeight: 1.5 }}
              >
                {t}
              </span>
            </div>
          ))}
        </div>
        {/* Against */}
        <div
          style={{
            background: GREEN + "08",
            border: `1px solid ${GREEN}22`,
            borderRadius: 16,
            padding: "24px 20px",
          }}
        >
          <div
            style={{
              ...mono,
              fontSize: 9,
              letterSpacing: 2,
              color: GREEN,
              marginBottom: 14,
            }}
          >
            COUNTERPOINT
          </div>
          {[
            "Thermodynamic analogy ≠ thermodynamic law",
            "Civilizations have collapsed (Bronze Age, Rome)",
            "Selection bias — we only see surviving systems",
            "Intentionality changes the equation",
          ].map((t, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 8,
                alignItems: "flex-start",
                padding: "6px 0",
                borderBottom: i < 3 ? `1px solid ${LINE}` : "none",
              }}
            >
              <span style={{ color: GREEN, fontSize: 12 }}>→</span>
              <span
                style={{ ...serif, fontSize: 13, color: BONE, lineHeight: 1.5 }}
              >
                {t}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

// ═══════════════ MAIN COMPONENT ═══════════════
export default function TechEntropy({ onBack }) {
  const [backHover, setBackHover] = useState(false);

  return (
    <div style={{ background: BG, minHeight: "100vh", color: BONE }}>
      <style>{`
        @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes fadeUp  { from { opacity: 0; transform: translateY(32px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes pulseGlow { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.8; } }
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

      {/* Fixed back button */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 720,
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        {/* HERO — full viewport */}
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingBottom: 80,
          }}
        >
          <div
            style={{
              ...mono,
              fontSize: 10,
              letterSpacing: 4,
              color: EMBER,
              textTransform: "uppercase",
              marginBottom: 20,
              animation: "fadeIn 1s ease both",
            }}
          >
            A thermodynamic theory of progress
          </div>
          <h1
            style={{
              ...sans,
              fontSize: "clamp(36px, 7vw, 60px)",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -2,
              marginBottom: 24,
              background: `linear-gradient(135deg, ${EMBER}, ${GHOST})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "fadeUp 1.2s ease 0.3s both",
            }}
          >
            Technology as
            <br />
            Entropy
          </h1>
          <div
            style={{
              ...serif,
              fontSize: 20,
              lineHeight: 1.7,
              color: ASH,
              maxWidth: 540,
              fontStyle: "italic",
              animation: "fadeUp 1.2s ease 0.6s both",
            }}
          >
            Not a human invention. A thermodynamic inevitability.
          </div>
        </div>

        {/* CH I: THE CURVE */}
        <Chapter
          label="Chapter I — The Curve"
          title="Every phase transition compresses the interval before the next"
        >
          <EntropyCurve />
          <Reveal>
            <div
              style={{
                ...serif,
                fontSize: 14,
                color: ASH,
                fontStyle: "italic",
                textAlign: "center",
                marginTop: 8,
              }}
            >
              The signature of a thermodynamic system approaching criticality.
            </div>
          </Reveal>
        </Chapter>

        {/* CH II: PHASE TRANSITIONS */}
        <Chapter
          label="Chapter II — Phase Transitions"
          title="Order doesn't resist entropy. It rides it."
        >
          <PhaseTransitionVis />
        </Chapter>

        {/* CH III: DISSIPATIVE STRUCTURES */}
        <Chapter
          label="Chapter III — The Engine"
          title="Prigogine's insight: structure requires energy flow"
        >
          <DissipativeStructure />
          <Reveal>
            <div
              style={{
                ...serif,
                fontSize: 14,
                color: ASH,
                fontStyle: "italic",
                textAlign: "center",
                marginTop: 8,
              }}
            >
              Remove the energy gradient and the structure dies.
            </div>
          </Reveal>
        </Chapter>

        {/* CH IV: THE CASCADE */}
        <Chapter
          label="Chapter IV — The Cascade"
          title="Each architecture stage widens the entropy it must manage"
        >
          <TechCascadeFlow />
        </Chapter>

        {/* CH V: THE ARGUMENT */}
        <Chapter
          label="Chapter V — The Question"
          title="Is ASI thermodynamically inevitable?"
        >
          <InevitabilityGauge />
          <Reveal>
            <div
              style={{
                ...serif,
                fontSize: 14,
                color: ASH,
                fontStyle: "italic",
                textAlign: "center",
                marginTop: 16,
              }}
            >
              3.8 billion years of increasing complexity — never once reversed.
            </div>
          </Reveal>
        </Chapter>

        {/* CLOSER */}
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
                fontSize: "clamp(24px, 4.5vw, 38px)",
                fontWeight: 700,
                lineHeight: 1.15,
                maxWidth: 540,
                margin: "0 auto 20px",
              }}
            >
              The universe doesn't care about your roadmap.
              <br />
              It just keeps <span style={{ color: EMBER }}>dissipating</span>.
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
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
              Prigogine · Kauffman · England · Chaisson · Schneider & Kay
              <br />
              From a conversation between a human and a language model ·
              February 2026
            </div>
          </Reveal>
        </section>
      </div>
    </div>
  );
}
