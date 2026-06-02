import { useState, useEffect, useRef } from "react";
import { C, F } from "../design.js";

/* ═══════════════════════════════════════════════════════════════
   MULTI-AGENT CIVILIZATION
   How autonomous AI agents recapitulate 10,000 years of
   organizational theory in a weekend.
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

// Apple-direction font tokens — sans-first.
const sans = { fontFamily: F.display };
const serif = { fontFamily: F.text };
const mono = { fontFamily: F.mono };

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

// ── AGENT SIMULATION — interactive swarm with emergent clustering ──
function AgentSimulation({ agentCount }) {
  const canvasRef = useRef(null);
  const agents = useRef([]);
  const frameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = 600,
      H = 360;
    canvas.width = W;
    canvas.height = H;

    // Init agents
    agents.current = [];
    for (let i = 0; i < agentCount; i++) {
      agents.current.push({
        x: 60 + Math.random() * (W - 120),
        y: 60 + Math.random() * (H - 120),
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        role:
          i === 0 ? "leader" : i < agentCount * 0.15 ? "reviewer" : "worker",
        cluster: Math.floor(i / Math.max(3, agentCount / 4)),
        hue: [GOLD, GREEN, ICE, GHOST, EMBER][i % 5],
      });
    }

    let running = true;
    function tick() {
      if (!running) return;
      ctx.fillStyle = "rgba(5,5,8,0.25)";
      ctx.fillRect(0, 0, W, H);

      const pts = agents.current;
      const clusterCenters = {};

      // Compute cluster centers
      for (const p of pts) {
        if (!clusterCenters[p.cluster])
          clusterCenters[p.cluster] = { x: 0, y: 0, n: 0 };
        clusterCenters[p.cluster].x += p.x;
        clusterCenters[p.cluster].y += p.y;
        clusterCenters[p.cluster].n++;
      }
      for (const k in clusterCenters) {
        clusterCenters[k].x /= clusterCenters[k].n;
        clusterCenters[k].y /= clusterCenters[k].n;
      }

      // Draw cluster zones when enough agents
      if (agentCount >= 6) {
        for (const k in clusterCenters) {
          const c = clusterCenters[k];
          ctx.beginPath();
          ctx.arc(c.x, c.y, 40 + agentCount * 0.8, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(155,143,255,0.03)";
          ctx.fill();
          ctx.strokeStyle = "rgba(155,143,255,0.08)";
          ctx.stroke();
        }
      }

      // Draw connections between nearby agents
      if (agentCount >= 3) {
        for (let i = 0; i < pts.length; i++) {
          for (let j = i + 1; j < pts.length; j++) {
            const dx = pts[i].x - pts[j].x;
            const dy = pts[i].y - pts[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 60 + (agentCount < 10 ? 20 : 0)) {
              ctx.beginPath();
              ctx.moveTo(pts[i].x, pts[i].y);
              ctx.lineTo(pts[j].x, pts[j].y);
              ctx.strokeStyle = `rgba(110,231,240,${0.12 * (1 - dist / 80)})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
      }

      // Draw hierarchy lines for reviewers when >6 agents
      if (agentCount >= 6) {
        for (const p of pts) {
          if (p.role === "reviewer" || p.role === "leader") {
            for (const q of pts) {
              if (q.cluster === p.cluster && q.role === "worker") {
                const dx = p.x - q.x;
                const dy = p.y - q.y;
                if (Math.sqrt(dx * dx + dy * dy) < 90) {
                  ctx.beginPath();
                  ctx.moveTo(p.x, p.y);
                  ctx.lineTo(q.x, q.y);
                  ctx.strokeStyle =
                    p.role === "leader"
                      ? "rgba(255,77,46,0.12)"
                      : "rgba(251,191,36,0.1)";
                  ctx.lineWidth = 0.8;
                  ctx.setLineDash([3, 3]);
                  ctx.stroke();
                  ctx.setLineDash([]);
                }
              }
            }
          }
        }
      }

      // Update and draw agents
      for (const p of pts) {
        // Cluster attraction
        const cc = clusterCenters[p.cluster];
        if (cc && agentCount >= 6) {
          p.vx += (cc.x - p.x) * 0.0008;
          p.vy += (cc.y - p.y) * 0.0008;
        }
        // Separation
        for (const q of pts) {
          if (q === p) continue;
          const dx = p.x - q.x,
            dy = p.y - q.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 18 && d > 0) {
            p.vx += (dx / d) * 0.3;
            p.vy += (dy / d) * 0.3;
          }
        }
        // Damping
        p.vx *= 0.985;
        p.vy *= 0.985;
        p.x += p.vx;
        p.y += p.vy;
        // Bounds
        if (p.x < 20 || p.x > W - 20) p.vx *= -0.8;
        if (p.y < 20 || p.y > H - 20) p.vy *= -0.8;
        p.x = Math.max(10, Math.min(W - 10, p.x));
        p.y = Math.max(10, Math.min(H - 10, p.y));

        // Draw
        const r = p.role === "leader" ? 6 : p.role === "reviewer" ? 4.5 : 3;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle =
          p.role === "leader" ? EMBER : p.role === "reviewer" ? GOLD : p.hue;
        ctx.fill();
        if (p.role !== "worker") {
          ctx.beginPath();
          ctx.arc(p.x, p.y, r + 4, 0, Math.PI * 2);
          ctx.strokeStyle = (p.role === "leader" ? EMBER : GOLD) + "33";
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      frameRef.current = requestAnimationFrame(tick);
    }
    frameRef.current = requestAnimationFrame(tick);
    return () => {
      running = false;
      cancelAnimationFrame(frameRef.current);
    };
  }, [agentCount]);

  return (
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
  );
}

// ── SCALING CONTROL — drag to watch governance emerge ──
const STAGE_THRESHOLDS = [
  {
    min: 2,
    max: 5,
    name: "The Campfire",
    color: GOLD,
    icon: "🔥",
    desc: "Implicit coordination. No governance needed.",
  },
  {
    min: 6,
    max: 10,
    name: "The Village",
    color: GREEN,
    icon: "🏘️",
    desc: "Roles emerge. Reviewer agents. Written norms.",
  },
  {
    min: 11,
    max: 30,
    name: "The City",
    color: ICE,
    icon: "🏙️",
    desc: "APIs as contracts. Abstraction boundaries. Bureaucracy.",
  },
  {
    min: 31,
    max: 50,
    name: "The Global Village",
    color: GHOST,
    icon: "🌍",
    desc: "Markets. Hierarchy. Democracy. All re-derived.",
  },
];

function ScalingControl({ count, setCount }) {
  const stage =
    STAGE_THRESHOLDS.find((s) => count >= s.min && count <= s.max) ||
    STAGE_THRESHOLDS[3];

  return (
    <div style={{ margin: "32px 0" }}>
      {/* Slider */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 20,
        }}
      >
        <span style={{ ...mono, fontSize: 11, color: ASH }}>2</span>
        <input
          type="range"
          min={2}
          max={50}
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          style={{
            flex: 1,
            height: 4,
            appearance: "none",
            WebkitAppearance: "none",
            background: `linear-gradient(to right, ${stage.color}88 0%, ${stage.color}88 ${((count - 2) / 48) * 100}%, ${LINE} ${((count - 2) / 48) * 100}%, ${LINE} 100%)`,
            borderRadius: 2,
            outline: "none",
            cursor: "pointer",
          }}
        />
        <span style={{ ...mono, fontSize: 11, color: ASH }}>50</span>
      </div>

      {/* Current stage readout */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "16px 20px",
          borderRadius: 14,
          background: stage.color + "0c",
          border: `1px solid ${stage.color}33`,
          transition: "all 0.4s",
        }}
      >
        <span style={{ fontSize: 28 }}>{stage.icon}</span>
        <div>
          <div
            style={{
              ...sans,
              fontSize: 18,
              fontWeight: 700,
              color: stage.color,
            }}
          >
            {stage.name}
          </div>
          <div style={{ ...mono, fontSize: 11, color: ASH }}>
            {count} agents
          </div>
        </div>
        <div
          style={{
            flex: 1,
            ...serif,
            fontSize: 13,
            color: BONE,
            textAlign: "right",
          }}
        >
          {stage.desc}
        </div>
      </div>

      {/* Governance indicators */}
      <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
        {[
          { label: "Roles", threshold: 6, color: GREEN },
          { label: "Norms", threshold: 6, color: GOLD },
          { label: "Hierarchy", threshold: 10, color: ICE },
          { label: "Contracts", threshold: 15, color: GHOST },
          { label: "Bureaucracy", threshold: 20, color: EMBER },
          { label: "Markets", threshold: 30, color: GREEN },
          { label: "Democracy", threshold: 40, color: GOLD },
        ].map((g, i) => (
          <div
            key={i}
            style={{
              ...mono,
              fontSize: 9,
              letterSpacing: 1,
              textTransform: "uppercase",
              padding: "5px 12px",
              borderRadius: 20,
              color: count >= g.threshold ? g.color : ASH + "44",
              border: `1px solid ${count >= g.threshold ? g.color + "44" : LINE}`,
              background: count >= g.threshold ? g.color + "0c" : "transparent",
              transition: "all 0.4s",
            }}
          >
            {g.label}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── EMERGENCE MAP — SVG showing agent→institution mapping ──
const EMERGENCES = [
  {
    agent: "File ownership",
    human: "Property rights",
    icon: "🏠",
    color: GOLD,
  },
  { agent: "AGENTS.md", human: "Language & culture", icon: "📝", color: GREEN },
  { agent: "Reviewer agent", human: "Judiciary", icon: "⚖️", color: ICE },
  { agent: "Linter", human: "Regulation", icon: "📋", color: GHOST },
  {
    agent: "Best-solution competition",
    human: "Markets",
    icon: "📈",
    color: EMBER,
  },
  {
    agent: "Human selects winner",
    human: "Democracy",
    icon: "🗳️",
    color: GOLD,
  },
  { agent: "Git repo", human: "Infrastructure", icon: "🛤️", color: GREEN },
  { agent: "Test suite", human: "Public services", icon: "🔧", color: ICE },
  { agent: "CI pipeline", human: "Bureaucracy", icon: "🏛️", color: GHOST },
];

function EmergenceMapSVG() {
  const [hovered, setHovered] = useState(null);
  const rowH = 36,
    pad = 20;
  const h = EMERGENCES.length * rowH + pad * 2;

  return (
    <Reveal>
      <svg
        viewBox={`0 0 640 ${h}`}
        style={{
          width: "100%",
          maxWidth: 640,
          display: "block",
          margin: "24px auto",
        }}
      >
        {/* Headers */}
        <text
          x={100}
          y={16}
          textAnchor="middle"
          fill={ICE}
          fontSize={9}
          fontFamily="monospace"
          letterSpacing={2}
        >
          AGENT WORLD
        </text>
        <text
          x={540}
          y={16}
          textAnchor="middle"
          fill={GOLD}
          fontSize={9}
          fontFamily="monospace"
          letterSpacing={2}
        >
          HUMAN WORLD
        </text>

        {EMERGENCES.map((e, i) => {
          const y = pad + 12 + i * rowH;
          const isH = hovered === i;
          return (
            <g
              key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: "pointer" }}
            >
              {/* Agent side */}
              <rect
                x={10}
                y={y - 12}
                width={180}
                height={28}
                rx={6}
                fill={isH ? e.color + "14" : "transparent"}
                stroke={isH ? e.color + "33" : "transparent"}
                style={{ transition: "all 0.2s" }}
              />
              <text
                x={20}
                y={y + 4}
                fill={isH ? e.color : ICE + "aa"}
                fontSize={11}
                fontFamily="monospace"
              >
                {e.agent}
              </text>

              {/* Connection line */}
              <line
                x1={200}
                y1={y}
                x2={430}
                y2={y}
                stroke={isH ? e.color + "66" : LINE}
                strokeWidth={isH ? 1.5 : 0.8}
                strokeDasharray={isH ? "none" : "4 3"}
                style={{ transition: "all 0.3s" }}
              >
                {isH && (
                  <animate
                    attributeName="strokeDashoffset"
                    values="8;0"
                    dur="0.6s"
                    repeatCount="indefinite"
                  />
                )}
              </line>
              {/* ≡ symbol */}
              <text
                x={315}
                y={y + 4}
                textAnchor="middle"
                fill={isH ? e.color : ASH}
                fontSize={12}
              >
                ≡
              </text>

              {/* Human side */}
              <rect
                x={440}
                y={y - 12}
                width={190}
                height={28}
                rx={6}
                fill={isH ? e.color + "14" : "transparent"}
                stroke={isH ? e.color + "33" : "transparent"}
                style={{ transition: "all 0.2s" }}
              />
              <text
                x={450}
                y={y + 4}
                fill={isH ? e.color : GOLD + "aa"}
                fontSize={12}
                fontFamily="Georgia, serif"
              >
                {e.human}
              </text>
            </g>
          );
        })}
      </svg>
    </Reveal>
  );
}

// ── GOD PROBLEM — escalation visualization ──
function EscalationDiagram() {
  const [step, setStep] = useState(0);
  const steps = [
    { action: "Delegate review", result: "Hierarchy", color: GREEN },
    { action: "Review the reviewer", result: "Bureaucracy", color: ICE },
    { action: "Too slow → flatten", result: "Mesh networks", color: GHOST },
    { action: "Agents vote on conflicts", result: "Democracy", color: GOLD },
    { action: "Shared conventions first", result: "Culture", color: EMBER },
  ];

  return (
    <Reveal>
      <div style={{ margin: "32px 0" }}>
        <svg
          viewBox="0 0 600 200"
          style={{
            width: "100%",
            maxWidth: 600,
            display: "block",
            margin: "0 auto",
          }}
        >
          {steps.map((s, i) => {
            const x = 30 + i * 112;
            const active = i <= step;
            return (
              <g
                key={i}
                onClick={() => setStep(i)}
                style={{ cursor: "pointer" }}
              >
                {/* Node */}
                <circle
                  cx={x + 46}
                  cy={60}
                  r={24}
                  fill={active ? s.color + "18" : FAINT}
                  stroke={active ? s.color : LINE}
                  strokeWidth={active ? 2 : 1}
                  style={{ transition: "all 0.4s" }}
                />
                <text
                  x={x + 46}
                  y={64}
                  textAnchor="middle"
                  fill={active ? s.color : ASH}
                  fontSize={20}
                  fontWeight={700}
                  fontFamily="'Segoe UI', sans-serif"
                >
                  {i + 1}
                </text>
                {/* Connection */}
                {i < 4 && (
                  <line
                    x1={x + 72}
                    y1={60}
                    x2={x + 112}
                    y2={60}
                    stroke={i < step ? steps[i + 1].color + "66" : LINE}
                    strokeWidth={1}
                    strokeDasharray={i < step ? "none" : "3 3"}
                    style={{ transition: "all 0.4s" }}
                  />
                )}
                {/* Labels */}
                <text
                  x={x + 46}
                  y={105}
                  textAnchor="middle"
                  fill={active ? BONE : ASH}
                  fontSize={8.5}
                  fontFamily="monospace"
                  style={{ transition: "fill 0.3s" }}
                >
                  {s.action}
                </text>
                <text
                  x={x + 46}
                  y={130}
                  textAnchor="middle"
                  fill={active ? s.color : ASH + "66"}
                  fontSize={9}
                  fontWeight={600}
                  fontFamily="'Segoe UI', sans-serif"
                  style={{ transition: "fill 0.3s" }}
                >
                  → {s.result}
                </text>
              </g>
            );
          })}
          {/* Progress label */}
          <text
            x={300}
            y={170}
            textAnchor="middle"
            fill={ASH}
            fontSize={9}
            fontFamily="Georgia, serif"
            fontStyle="italic"
          >
            Click each step · {step + 1}/5 governance structures discovered
          </text>
        </svg>
      </div>
    </Reveal>
  );
}

// ═══════════════ MAIN ═══════════════
export default function MultiAgentCiv() {
  const [agentCount, setAgentCount] = useState(3);

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
        <section style={{
          padding: "112px 0 80px",
          textAlign: "center",
          animation: "fadeIn 1.2s ease both",
        }}>
          <p style={{
            fontFamily: F.text, fontSize: 13, letterSpacing: "0.18em",
            textTransform: "uppercase", color: "rgba(245,245,247,0.55)",
            fontWeight: 500, margin: "0 0 28px",
            display: "inline-flex", alignItems: "center", gap: 10,
          }}>
            <span style={{
              display: "inline-block", width: 6, height: 6,
              borderRadius: "50%", background: C.accent,
            }} />
            When agents discover governance
          </p>
          <h1 style={{
            fontFamily: F.display, fontWeight: 600,
            fontSize: "clamp(48px, 8vw, 96px)",
            lineHeight: 1.04, letterSpacing: "-0.045em",
            margin: "0 0 22px", color: "#f5f5f7",
          }}>Multi-agent civilization.</h1>
          <p style={{
            fontFamily: F.display, fontWeight: 400,
            fontSize: "clamp(20px, 2.4vw, 28px)",
            lineHeight: 1.3, letterSpacing: "-0.022em",
            color: "rgba(245,245,247,0.65)",
            maxWidth: 640, margin: "0 auto",
          }}>
            Put autonomous agents in a shared environment. Watch them reinvent
            10,000 years of organizational theory in a weekend.
          </p>
        </section>

        {/* ═══ CH I: THE OBSERVATION ═══ */}
        <Chapter
          label="Chapter I — The Observation"
          title="The coordination problems are the same"
        >
          <Reveal>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 2,
                borderRadius: 16,
                overflow: "hidden",
              }}
            >
              <div style={{ padding: "24px 20px", background: FAINT }}>
                <div
                  style={{
                    ...mono,
                    fontSize: 9,
                    letterSpacing: 2,
                    color: ICE,
                    marginBottom: 10,
                  }}
                >
                  AGENT SYSTEMS
                </div>
                <div
                  style={{
                    ...sans,
                    fontSize: "clamp(28px, 5vw, 44px)",
                    fontWeight: 800,
                    color: ICE,
                    lineHeight: 1,
                  }}
                >
                  N agents
                </div>
                <div style={{ fontSize: 12, color: ASH, marginTop: 8 }}>
                  Shared resources, no central authority
                </div>
              </div>
              <div style={{ padding: "24px 20px", background: FAINT }}>
                <div
                  style={{
                    ...mono,
                    fontSize: 9,
                    letterSpacing: 2,
                    color: GOLD,
                    marginBottom: 10,
                  }}
                >
                  HUMAN CIVILIZATIONS
                </div>
                <div
                  style={{
                    ...sans,
                    fontSize: "clamp(28px, 5vw, 44px)",
                    fontWeight: 800,
                    color: GOLD,
                    lineHeight: 1,
                  }}
                >
                  N people
                </div>
                <div style={{ fontSize: 12, color: ASH, marginTop: 8 }}>
                  Shared resources, no central authority
                </div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div
              style={{
                padding: "14px 20px",
                background: FAINT,
                border: `1px solid ${LINE}`,
                borderRadius: 12,
                marginTop: 8,
                textAlign: "center",
              }}
            >
              <span style={{ ...serif, fontSize: 14, color: BONE }}>
                Same constraints →{" "}
                <span style={{ color: ICE }}>same emergent structures</span>.
              </span>
            </div>
          </Reveal>
        </Chapter>

        {/* ═══ CH II: INTERACTIVE SIM ═══ */}
        <Chapter
          label="Chapter II — The Simulation"
          title="Drag the slider. Watch governance emerge."
        >
          <AgentSimulation agentCount={agentCount} />
          <ScalingControl count={agentCount} setCount={setAgentCount} />
        </Chapter>

        {/* ═══ CH III: EMERGENCE MAP ═══ */}
        <Chapter
          label="Chapter III — The Emergence Map"
          title="Agent primitives map to civilizational institutions"
        >
          <EmergenceMapSVG />
        </Chapter>

        {/* ═══ CH IV: THE GOD PROBLEM ═══ */}
        <Chapter
          label="Chapter IV — The God Problem"
          title="You're the god of this system. But you can't scale."
        >
          <EscalationDiagram />
          <Reveal>
            <div
              style={{
                padding: "14px 20px",
                background: GHOST + "06",
                border: `1px solid ${GHOST}22`,
                borderRadius: 12,
                marginTop: 16,
                textAlign: "center",
              }}
            >
              <span style={{ ...serif, fontSize: 14, color: BONE }}>
                10,000 years of organizational theory —{" "}
                <span style={{ color: GHOST }}>recapitulated in a weekend</span>
                .
              </span>
            </div>
          </Reveal>
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
              Multi-agent systems are a{" "}
              <span style={{ color: GREEN }}>proof</span> that civilization was
              inevitable.
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
              From a conversation between a human and a language model ·
              February 2026
            </div>
          </Reveal>
        </section>
      </div>
    </div>
  );
}
