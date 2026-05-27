import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════════════
   PATH DEPENDENCY OF INNOVATION
   Why Tesla and Waymo built completely different self-driving
   architectures — and why both were "correct."
   ═══════════════════════════════════════════════════════════════ */

const BG = "#050508";
const BONE = "#e8e4dc";
const ASH = "#4a4860";
const ICE = "#6ee7f0";
const EMBER = "#ff4d2e";
const GHOST = "#9b8fff";
const GOLD = "#fbbf24";
const GREEN = "#34d399";
const TESLA_RED = "#e82127";
const WAYMO_BLUE = "#4285f4";
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

// ── ANIMATED BRANCHING TREE — grows on scroll ──
function BranchingTree() {
  const ref = useRef(null);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setProgress(1);
      },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const draw = (pct) => (pct > 0 ? 1 : 0);
  const p = progress;

  return (
    <Reveal>
      <div ref={ref}>
        <svg
          viewBox="0 0 620 400"
          style={{
            width: "100%",
            maxWidth: 620,
            display: "block",
            margin: "24px auto",
          }}
        >
          <defs>
            <filter id="glow-t">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Root */}
          <rect
            x={220}
            y={10}
            width={180}
            height={50}
            rx={12}
            fill={GHOST + "18"}
            stroke={GHOST + "55"}
            strokeWidth={1.5}
            style={{ opacity: p, transition: "opacity 0.6s ease 0s" }}
          />
          <text
            x={310}
            y={32}
            textAnchor="middle"
            fill={GHOST}
            fontSize={13}
            fontWeight={700}
            fontFamily="'Segoe UI', sans-serif"
            style={{ opacity: p, transition: "opacity 0.6s ease 0.1s" }}
          >
            Self-Driving Problem
          </text>
          <text
            x={310}
            y={48}
            textAnchor="middle"
            fill={ASH}
            fontSize={9}
            fontFamily="Georgia, serif"
            style={{ opacity: p, transition: "opacity 0.6s ease 0.2s" }}
          >
            Same goal, different ecosystems
          </text>

          {/* Branch lines — animate with dashoffset */}
          <path
            d="M 260 60 Q 200 85 150 110"
            fill="none"
            stroke={TESLA_RED + "66"}
            strokeWidth={2}
            strokeDasharray="200"
            strokeDashoffset={p ? 0 : 200}
            style={{ transition: "stroke-dashoffset 1s ease 0.4s" }}
          />
          <path
            d="M 360 60 Q 420 85 470 110"
            fill="none"
            stroke={WAYMO_BLUE + "66"}
            strokeWidth={2}
            strokeDasharray="200"
            strokeDashoffset={p ? 0 : 200}
            style={{ transition: "stroke-dashoffset 1s ease 0.4s" }}
          />

          {/* Tesla branch */}
          <g style={{ opacity: p, transition: "opacity 0.6s ease 0.6s" }}>
            <rect
              x={40}
              y={110}
              width={220}
              height={50}
              rx={12}
              fill={TESLA_RED + "12"}
              stroke={TESLA_RED + "44"}
              strokeWidth={1.5}
            />
            <text
              x={150}
              y={132}
              textAnchor="middle"
              fill={TESLA_RED}
              fontSize={12}
              fontWeight={700}
              fontFamily="'Segoe UI', sans-serif"
            >
              Tesla: Vision-First
            </text>
            <text
              x={150}
              y={148}
              textAnchor="middle"
              fill={ASH}
              fontSize={9}
              fontFamily="Georgia, serif"
            >
              Camera-only · Fleet data · Consumer cost
            </text>
          </g>

          {/* Waymo branch */}
          <g style={{ opacity: p, transition: "opacity 0.6s ease 0.6s" }}>
            <rect
              x={360}
              y={110}
              width={220}
              height={50}
              rx={12}
              fill={WAYMO_BLUE + "12"}
              stroke={WAYMO_BLUE + "44"}
              strokeWidth={1.5}
            />
            <text
              x={470}
              y={132}
              textAnchor="middle"
              fill={WAYMO_BLUE}
              fontSize={12}
              fontWeight={700}
              fontFamily="'Segoe UI', sans-serif"
            >
              Waymo: LiDAR-First
            </text>
            <text
              x={470}
              y={148}
              textAnchor="middle"
              fill={ASH}
              fontSize={9}
              fontFamily="Georgia, serif"
            >
              HD maps · Robustness · Cost be damned
            </text>
          </g>

          {/* Sub-branches Tesla */}
          <g style={{ opacity: p, transition: "opacity 0.6s ease 1s" }}>
            <line
              x1={100}
              y1={160}
              x2={80}
              y2={200}
              stroke={TESLA_RED + "33"}
              strokeWidth={1}
            />
            <line
              x1={200}
              y1={160}
              x2={220}
              y2={200}
              stroke={TESLA_RED + "33"}
              strokeWidth={1}
            />
            <rect
              x={30}
              y={200}
              width={100}
              height={36}
              rx={8}
              fill={FAINT}
              stroke={EMBER + "33"}
            />
            <text
              x={80}
              y={218}
              textAnchor="middle"
              fill={EMBER}
              fontSize={8}
              fontFamily="monospace"
            >
              HW4: Adding LiDAR
            </text>
            <text
              x={80}
              y={230}
              textAnchor="middle"
              fill={ASH}
              fontSize={7}
              fontFamily="monospace"
            >
              concession
            </text>
            <rect
              x={170}
              y={200}
              width={100}
              height={36}
              rx={8}
              fill={FAINT}
              stroke={ASH + "33"}
            />
            <text
              x={220}
              y={218}
              textAnchor="middle"
              fill={ASH}
              fontSize={8}
              fontFamily="monospace"
            >
              Fleet data moat
            </text>
            <text
              x={220}
              y={230}
              textAnchor="middle"
              fill={EMBER}
              fontSize={7}
              fontFamily="monospace"
            >
              less edge than expected
            </text>
          </g>

          {/* Sub-branches Waymo */}
          <g style={{ opacity: p, transition: "opacity 0.6s ease 1s" }}>
            <line
              x1={420}
              y1={160}
              x2={400}
              y2={200}
              stroke={WAYMO_BLUE + "33"}
              strokeWidth={1}
            />
            <line
              x1={520}
              y1={160}
              x2={540}
              y2={200}
              stroke={WAYMO_BLUE + "33"}
              strokeWidth={1}
            />
            <rect
              x={350}
              y={200}
              width={100}
              height={36}
              rx={8}
              fill={FAINT}
              stroke={GREEN + "33"}
            />
            <text
              x={400}
              y={218}
              textAnchor="middle"
              fill={GREEN}
              fontSize={8}
              fontFamily="monospace"
            >
              Operational in SF, PHX
            </text>
            <text
              x={400}
              y={230}
              textAnchor="middle"
              fill={ASH}
              fontSize={7}
              fontFamily="monospace"
            >
              geofenced
            </text>
            <rect
              x={490}
              y={200}
              width={100}
              height={36}
              rx={8}
              fill={FAINT}
              stroke={GOLD + "33"}
            />
            <text
              x={540}
              y={218}
              textAnchor="middle"
              fill={GOLD}
              fontSize={8}
              fontFamily="monospace"
            >
              $100K+ per vehicle
            </text>
            <text
              x={540}
              y={230}
              textAnchor="middle"
              fill={ASH}
              fontSize={7}
              fontFamily="monospace"
            >
              cost problem
            </text>
          </g>

          {/* Convergence */}
          <g style={{ opacity: p, transition: "opacity 0.6s ease 1.4s" }}>
            <path
              d="M 150 250 Q 220 300 310 320"
              fill="none"
              stroke={LINE}
              strokeWidth={1}
              strokeDasharray="4 4"
            />
            <path
              d="M 470 250 Q 400 300 310 320"
              fill="none"
              stroke={LINE}
              strokeWidth={1}
              strokeDasharray="4 4"
            />
            <rect
              x={220}
              y={310}
              width={180}
              height={44}
              rx={12}
              fill={GOLD + "0c"}
              stroke={GOLD + "33"}
              strokeWidth={1.5}
            />
            <text
              x={310}
              y={332}
              textAnchor="middle"
              fill={GOLD}
              fontSize={11}
              fontWeight={600}
              fontFamily="'Segoe UI', sans-serif"
            >
              Convergence: Generalization
            </text>
            <text
              x={310}
              y={347}
              textAnchor="middle"
              fill={ASH}
              fontSize={9}
              fontFamily="Georgia, serif"
              fontStyle="italic"
            >
              Both unsolved. Both approaching from different angles.
            </text>
          </g>
        </svg>
      </div>
    </Reveal>
  );
}

// ── SENSOR VISUALIZATION — camera vs LiDAR side by side ──
function SensorComparison() {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  const [frame, setFrame] = useState(0);
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
    let running = true;
    function tick() {
      if (!running) return;
      setFrame((f) => f + 1);
      frameRef.current = requestAnimationFrame(tick);
    }
    frameRef.current = requestAnimationFrame(tick);
    return () => {
      running = false;
      cancelAnimationFrame(frameRef.current);
    };
  }, [vis]);

  // Generate pseudo-random point cloud for LiDAR
  const lidarPoints = [];
  const seed = 42;
  for (let i = 0; i < 120; i++) {
    const angle = ((i * 137.508 + frame * 0.3) * Math.PI) / 180;
    const r = 20 + (i % 7) * 12 + Math.sin(i * 0.5 + frame * 0.02) * 8;
    lidarPoints.push({
      x: 150 + Math.cos(angle) * r,
      y: 120 + Math.sin(angle) * r * 0.6,
      d: r,
    });
  }

  return (
    <Reveal>
      <div
        ref={ref}
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          margin: "32px 0",
        }}
      >
        {/* Camera view */}
        <div
          style={{
            background: FAINT,
            border: `1px solid ${TESLA_RED}22`,
            borderRadius: 16,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              ...mono,
              fontSize: 9,
              letterSpacing: 2,
              color: TESLA_RED,
              padding: "12px 16px",
              borderBottom: `1px solid ${LINE}`,
            }}
          >
            CAMERA VIEW · RGB PIXELS
          </div>
          <svg
            viewBox="0 0 300 200"
            style={{ width: "100%", display: "block" }}
          >
            {/* Simulated camera grid */}
            {Array.from({ length: 12 }).map((_, row) =>
              Array.from({ length: 15 }).map((_, col) => {
                const brightness =
                  Math.sin((row + col + frame * 0.05) * 0.5) * 30 + 40;
                return (
                  <rect
                    key={`${row}-${col}`}
                    x={col * 20}
                    y={row * 16.7}
                    width={20}
                    height={16.7}
                    fill={`hsl(${200 + row * 5}, 30%, ${brightness}%)`}
                    opacity={0.6}
                  />
                );
              }),
            )}
            {/* "Car" shape */}
            <rect
              x={100}
              y={70}
              width={100}
              height={60}
              rx={6}
              fill="none"
              stroke={TESLA_RED + "66"}
              strokeWidth={2}
            />
            <text
              x={150}
              y={105}
              textAnchor="middle"
              fill={TESLA_RED}
              fontSize={9}
              fontFamily="monospace"
            >
              OBJECT DETECTED
            </text>
            <text
              x={150}
              y={185}
              textAnchor="middle"
              fill={ASH}
              fontSize={8}
              fontFamily="Georgia, serif"
            >
              Dense color data · No depth · Cheap sensors
            </text>
          </svg>
        </div>

        {/* LiDAR view */}
        <div
          style={{
            background: FAINT,
            border: `1px solid ${WAYMO_BLUE}22`,
            borderRadius: 16,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              ...mono,
              fontSize: 9,
              letterSpacing: 2,
              color: WAYMO_BLUE,
              padding: "12px 16px",
              borderBottom: `1px solid ${LINE}`,
            }}
          >
            LiDAR VIEW · 3D POINT CLOUD
          </div>
          <svg
            viewBox="0 0 300 200"
            style={{
              width: "100%",
              display: "block",
              background: "rgba(0,0,0,0.3)",
            }}
          >
            {/* Point cloud */}
            {lidarPoints.map((p, i) => (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={1.2}
                fill={p.d < 60 ? GREEN : p.d < 100 ? WAYMO_BLUE : ICE}
                opacity={0.7}
              />
            ))}
            {/* Distance rings */}
            {[40, 80, 120].map((r, i) => (
              <circle
                key={i}
                cx={150}
                cy={120}
                r={r}
                fill="none"
                stroke={WAYMO_BLUE + "11"}
                strokeWidth={0.5}
              />
            ))}
            <text
              x={150}
              y={185}
              textAnchor="middle"
              fill={ASH}
              fontSize={8}
              fontFamily="Georgia, serif"
            >
              Precise depth · Sparse color · $10K+ sensor
            </text>
          </svg>
        </div>
      </div>
    </Reveal>
  );
}

// ── RADAR CHART — interactive comparison ──
const DIMENSIONS = [
  { label: "Scale", tesla: 0.9, waymo: 0.3 },
  { label: "Precision", tesla: 0.5, waymo: 0.95 },
  { label: "Cost/Unit", tesla: 0.85, waymo: 0.2 },
  { label: "Coverage", tesla: 0.7, waymo: 0.35 },
  { label: "Safety Record", tesla: 0.4, waymo: 0.85 },
  { label: "Generalization", tesla: 0.3, waymo: 0.3 },
];

function RadarChart() {
  const [hoveredSide, setHoveredSide] = useState(null);
  const cx = 200,
    cy = 180,
    maxR = 130;
  const n = DIMENSIONS.length;

  function polarToXY(angle, radius) {
    const a = ((angle - 90) * Math.PI) / 180;
    return { x: cx + Math.cos(a) * radius, y: cy + Math.sin(a) * radius };
  }

  function buildPath(key) {
    return (
      DIMENSIONS.map((d, i) => {
        const angle = (360 / n) * i;
        const p = polarToXY(angle, d[key] * maxR);
        return `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`;
      }).join(" ") + " Z"
    );
  }

  return (
    <Reveal>
      <div style={{ margin: "32px 0", textAlign: "center" }}>
        <svg
          viewBox="0 0 400 380"
          style={{
            width: "100%",
            maxWidth: 440,
            display: "block",
            margin: "0 auto",
          }}
        >
          {/* Grid rings */}
          {[0.25, 0.5, 0.75, 1].map((s, i) => (
            <polygon
              key={i}
              points={DIMENSIONS.map((_, j) => {
                const p = polarToXY((360 / n) * j, s * maxR);
                return `${p.x},${p.y}`;
              }).join(" ")}
              fill="none"
              stroke={LINE}
              strokeWidth={0.5}
            />
          ))}
          {/* Axis lines */}
          {DIMENSIONS.map((d, i) => {
            const p = polarToXY((360 / n) * i, maxR + 8);
            const pe = polarToXY((360 / n) * i, maxR);
            return (
              <g key={i}>
                <line
                  x1={cx}
                  y1={cy}
                  x2={pe.x}
                  y2={pe.y}
                  stroke={LINE}
                  strokeWidth={0.5}
                />
                <text
                  x={p.x + (p.x > cx ? 4 : p.x < cx ? -4 : 0)}
                  y={p.y + (p.y > cy ? 12 : -4)}
                  textAnchor={
                    p.x > cx + 5 ? "start" : p.x < cx - 5 ? "end" : "middle"
                  }
                  fill={ASH}
                  fontSize={9}
                  fontFamily="'Segoe UI', sans-serif"
                >
                  {d.label}
                </text>
              </g>
            );
          })}

          {/* Waymo shape */}
          <path
            d={buildPath("waymo")}
            fill={WAYMO_BLUE + "18"}
            stroke={WAYMO_BLUE}
            strokeWidth={hoveredSide === "waymo" ? 2.5 : 1.5}
            opacity={hoveredSide === "tesla" ? 0.3 : 1}
            style={{ transition: "all 0.3s" }}
            onMouseEnter={() => setHoveredSide("waymo")}
            onMouseLeave={() => setHoveredSide(null)}
          />

          {/* Tesla shape */}
          <path
            d={buildPath("tesla")}
            fill={TESLA_RED + "18"}
            stroke={TESLA_RED}
            strokeWidth={hoveredSide === "tesla" ? 2.5 : 1.5}
            opacity={hoveredSide === "waymo" ? 0.3 : 1}
            style={{ transition: "all 0.3s" }}
            onMouseEnter={() => setHoveredSide("tesla")}
            onMouseLeave={() => setHoveredSide(null)}
          />

          {/* Data points */}
          {DIMENSIONS.map((d, i) => {
            const angle = (360 / n) * i;
            const pt = polarToXY(angle, d.tesla * maxR);
            const pw = polarToXY(angle, d.waymo * maxR);
            return (
              <g key={`pts-${i}`}>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={3}
                  fill={TESLA_RED}
                  opacity={hoveredSide === "waymo" ? 0.3 : 1}
                  style={{ transition: "opacity 0.3s" }}
                />
                <circle
                  cx={pw.x}
                  cy={pw.y}
                  r={3}
                  fill={WAYMO_BLUE}
                  opacity={hoveredSide === "tesla" ? 0.3 : 1}
                  style={{ transition: "opacity 0.3s" }}
                />
              </g>
            );
          })}

          {/* Legend */}
          <circle cx={100} cy={365} r={5} fill={TESLA_RED} />
          <text
            x={112}
            y={369}
            fill={TESLA_RED}
            fontSize={10}
            fontFamily="'Segoe UI', sans-serif"
            fontWeight={600}
          >
            Tesla
          </text>
          <circle cx={260} cy={365} r={5} fill={WAYMO_BLUE} />
          <text
            x={272}
            y={369}
            fill={WAYMO_BLUE}
            fontSize={10}
            fontFamily="'Segoe UI', sans-serif"
            fontWeight={600}
          >
            Waymo
          </text>
        </svg>
      </div>
    </Reveal>
  );
}

// ── CONSTRAINT FILTER — shows how starting ecosystems narrow option sets ──
function ConstraintFilter() {
  const [hover, setHover] = useState(null);
  const rows = [
    {
      origin: "Consumer HW",
      constraint: "Must be < $50K",
      filter: "No LiDAR budget",
      result: "Vision-Only",
      color: TESLA_RED,
    },
    {
      origin: "Robotics Lab",
      constraint: "Must be safest",
      filter: "No cost ceiling",
      result: "LiDAR-First",
      color: WAYMO_BLUE,
    },
  ];

  return (
    <Reveal>
      <svg
        viewBox="0 0 620 180"
        style={{
          width: "100%",
          maxWidth: 620,
          display: "block",
          margin: "24px auto",
        }}
      >
        {/* Column headers */}
        {["ECOSYSTEM", "CONSTRAINT", "FILTER", "ARCHITECTURE"].map((h, i) => (
          <text
            key={h}
            x={80 + i * 155}
            y={20}
            textAnchor="middle"
            fill={ASH}
            fontSize={8}
            fontFamily="monospace"
            letterSpacing={1.5}
          >
            {h}
          </text>
        ))}
        {/* Rows */}
        {rows.map((r, ri) => {
          const y = 50 + ri * 70;
          const active = hover === ri;
          return (
            <g
              key={ri}
              onMouseEnter={() => setHover(ri)}
              onMouseLeave={() => setHover(null)}
              style={{ cursor: "default" }}
            >
              {/* Origin */}
              <rect
                x={15}
                y={y}
                width={130}
                height={40}
                rx={8}
                fill={r.color + "0c"}
                stroke={r.color + (active ? "66" : "33")}
                strokeWidth={1}
              />
              <text
                x={80}
                y={y + 24}
                textAnchor="middle"
                fill={r.color}
                fontSize={10}
                fontWeight={600}
                fontFamily="'Segoe UI', sans-serif"
              >
                {r.origin}
              </text>
              {/* Arrow */}
              <line
                x1={148}
                y1={y + 20}
                x2={162}
                y2={y + 20}
                stroke={r.color + (active ? "88" : "44")}
                strokeWidth={1.5}
                markerEnd="none"
              />
              <polygon
                points={`162,${y + 16} 162,${y + 24} 170,${y + 20}`}
                fill={r.color + (active ? "88" : "44")}
              />
              {/* Constraint */}
              <rect
                x={170}
                y={y}
                width={130}
                height={40}
                rx={8}
                fill={FAINT}
                stroke={LINE}
                strokeWidth={1}
              />
              <text
                x={235}
                y={y + 24}
                textAnchor="middle"
                fill={BONE}
                fontSize={9}
                fontFamily="Georgia, serif"
              >
                {r.constraint}
              </text>
              {/* Arrow */}
              <line
                x1={303}
                y1={y + 20}
                x2={317}
                y2={y + 20}
                stroke={r.color + (active ? "88" : "44")}
                strokeWidth={1.5}
              />
              <polygon
                points={`317,${y + 16} 317,${y + 24} 325,${y + 20}`}
                fill={r.color + (active ? "88" : "44")}
              />
              {/* Filter */}
              <rect
                x={325}
                y={y}
                width={130}
                height={40}
                rx={8}
                fill={FAINT}
                stroke={EMBER + "22"}
                strokeWidth={1}
              />
              <text
                x={390}
                y={y + 24}
                textAnchor="middle"
                fill={EMBER}
                fontSize={9}
                fontFamily="Georgia, serif"
              >
                {r.filter}
              </text>
              {/* Arrow */}
              <line
                x1={458}
                y1={y + 20}
                x2={472}
                y2={y + 20}
                stroke={r.color + (active ? "88" : "44")}
                strokeWidth={1.5}
              />
              <polygon
                points={`472,${y + 16} 472,${y + 24} 480,${y + 20}`}
                fill={r.color + (active ? "88" : "44")}
              />
              {/* Result */}
              <rect
                x={480}
                y={y}
                width={130}
                height={40}
                rx={8}
                fill={r.color + "14"}
                stroke={r.color + (active ? "88" : "55")}
                strokeWidth={1.5}
              />
              <text
                x={545}
                y={y + 24}
                textAnchor="middle"
                fill={r.color}
                fontSize={11}
                fontWeight={700}
                fontFamily="'Segoe UI', sans-serif"
              >
                {r.result}
              </text>
            </g>
          );
        })}
      </svg>
    </Reveal>
  );
}

// ── PATH ORIGIN VIS — shows pattern across industries ──
function PathOriginVis() {
  const [hover, setHover] = useState(null);
  const cases = [
    {
      company: "AWS",
      origin: "Excess servers",
      path: "Internal infra → API",
      product: "Cloud computing",
      color: GOLD,
    },
    {
      company: "Slack",
      origin: "Game studio tools",
      path: "Internal chat → Product",
      product: "Enterprise messaging",
      color: ICE,
    },
    {
      company: "Tesla",
      origin: "Consumer EV fleet",
      path: "Cameras → Vision AI",
      product: "FSD",
      color: TESLA_RED,
    },
  ];

  return (
    <Reveal>
      <svg
        viewBox="0 0 620 160"
        style={{
          width: "100%",
          maxWidth: 620,
          display: "block",
          margin: "24px auto",
        }}
      >
        {["COMPANY", "ORIGIN", "PATH", "PRODUCT"].map((h, i) => (
          <text
            key={h}
            x={[45, 190, 370, 545][i]}
            y={16}
            textAnchor="middle"
            fill={ASH}
            fontSize={8}
            fontFamily="monospace"
            letterSpacing={1.5}
          >
            {h}
          </text>
        ))}
        {cases.map((c, i) => {
          const y = 30 + i * 44;
          const active = hover === i;
          return (
            <g
              key={i}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              style={{ cursor: "default" }}
            >
              <rect
                x={5}
                y={y}
                width={80}
                height={32}
                rx={6}
                fill={c.color + "10"}
                stroke={c.color + (active ? "66" : "33")}
                strokeWidth={1}
              />
              <text
                x={45}
                y={y + 20}
                textAnchor="middle"
                fill={c.color}
                fontSize={11}
                fontWeight={700}
                fontFamily="'Segoe UI', sans-serif"
              >
                {c.company}
              </text>
              <line
                x1={88}
                y1={y + 16}
                x2={107}
                y2={y + 16}
                stroke={c.color + "44"}
                strokeWidth={1}
              />
              <polygon
                points={`107,${y + 13} 107,${y + 19} 113,${y + 16}`}
                fill={c.color + "44"}
              />
              <rect
                x={115}
                y={y}
                width={150}
                height={32}
                rx={6}
                fill={FAINT}
                stroke={LINE}
              />
              <text
                x={190}
                y={y + 20}
                textAnchor="middle"
                fill={BONE}
                fontSize={9}
                fontFamily="Georgia, serif"
              >
                {c.origin}
              </text>
              <line
                x1={268}
                y1={y + 16}
                x2={287}
                y2={y + 16}
                stroke={c.color + "44"}
                strokeWidth={1}
              />
              <polygon
                points={`287,${y + 13} 287,${y + 19} 293,${y + 16}`}
                fill={c.color + "44"}
              />
              <rect
                x={295}
                y={y}
                width={150}
                height={32}
                rx={6}
                fill={FAINT}
                stroke={LINE}
              />
              <text
                x={370}
                y={y + 20}
                textAnchor="middle"
                fill={ASH}
                fontSize={9}
                fontFamily="Georgia, serif"
              >
                {c.path}
              </text>
              <line
                x1={448}
                y1={y + 16}
                x2={467}
                y2={y + 16}
                stroke={c.color + "44"}
                strokeWidth={1}
              />
              <polygon
                points={`467,${y + 13} 467,${y + 19} 473,${y + 16}`}
                fill={c.color + "44"}
              />
              <rect
                x={475}
                y={y}
                width={140}
                height={32}
                rx={6}
                fill={c.color + "0c"}
                stroke={c.color + (active ? "66" : "33")}
                strokeWidth={1}
              />
              <text
                x={545}
                y={y + 20}
                textAnchor="middle"
                fill={c.color}
                fontSize={10}
                fontWeight={600}
                fontFamily="'Segoe UI', sans-serif"
              >
                {c.product}
              </text>
            </g>
          );
        })}
      </svg>
    </Reveal>
  );
}

// ── CONVERGENCE FUNNEL ──
function ConvergenceFunnel() {
  const steps = [
    {
      label: "Constraint",
      desc: "Existing business defines option set",
      color: GOLD,
      w: 100,
    },
    { label: "Assumption", desc: "Bet based on ecosystem", color: ICE, w: 80 },
    {
      label: "Evolution",
      desc: "Iterate within constraints",
      color: GREEN,
      w: 60,
    },
    {
      label: "Concession",
      desc: "Reality forces adaptation",
      color: EMBER,
      w: 40,
    },
    {
      label: "Convergence",
      desc: "Same frontier, different angles",
      color: GHOST,
      w: 30,
    },
  ];

  return (
    <Reveal>
      <div style={{ margin: "32px auto", textAlign: "center" }}>
        {steps.map((s, i) => (
          <div
            key={i}
            style={{
              width: `${s.w}%`,
              margin: "0 auto",
              padding: "12px 16px",
              background: s.color + "0c",
              border: `1px solid ${s.color}33`,
              borderRadius:
                i === 0
                  ? "14px 14px 4px 4px"
                  : i === 4
                    ? "4px 4px 14px 14px"
                    : 4,
              marginBottom: 2,
              transition: "all 0.3s",
            }}
          >
            <div
              style={{
                ...mono,
                fontSize: 10,
                color: s.color,
                letterSpacing: 1,
              }}
            >
              {s.label}
            </div>
            <div style={{ ...serif, fontSize: 12, color: ASH }}>{s.desc}</div>
          </div>
        ))}
      </div>
    </Reveal>
  );
}

// ═══════════════ MAIN ═══════════════
export default function PathDependency({ onBack }) {
  const [backHover, setBackHover] = useState(false);

  return (
    <div style={{ background: BG, minHeight: "100vh", color: BONE }}>
      <style>{`
        @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes fadeUp  { from { opacity: 0; transform: translateY(32px) } to { opacity: 1; transform: translateY(0) } }
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
              color: GOLD,
              textTransform: "uppercase",
              marginBottom: 20,
              animation: "fadeIn 1s ease both",
            }}
          >
            Why "rational" actors build opposite solutions
          </div>
          <h1
            style={{
              ...sans,
              fontSize: "clamp(36px, 7vw, 56px)",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -2,
              marginBottom: 24,
              background: `linear-gradient(135deg, ${BONE}, ${GOLD})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "fadeUp 1.2s ease 0.3s both",
            }}
          >
            The Path Dependency
            <br />
            of Innovation
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
            Tesla and Waymo didn't choose different strategies. Their ecosystems
            chose for them.
          </div>
        </div>

        {/* CH I: THE THESIS — visual constraint filter */}
        <Chapter
          label="Chapter I — The Thesis"
          title="Innovation is path-dependent, not rational"
        >
          <ConstraintFilter />
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
              The canvas you start on constrains the art you can make.
            </div>
          </Reveal>
        </Chapter>

        {/* CH II: THE TWO PATHS */}
        <Chapter
          label="Chapter II — The Two Paths"
          title="Same problem, different ecosystems, opposite architectures"
        >
          <BranchingTree />
        </Chapter>

        {/* CH III: SENSOR COMPARISON */}
        <Chapter
          label="Chapter III — The Sensors"
          title="Two fundamentally different ways to see the road"
        >
          <SensorComparison />
        </Chapter>

        {/* CH IV: RADAR COMPARISON */}
        <Chapter
          label="Chapter IV — The Comparison"
          title="Neither was wrong. Both were constrained."
        >
          <RadarChart />
          <Reveal>
            <div
              style={{
                textAlign: "center",
                ...serif,
                fontSize: 14,
                color: ASH,
                fontStyle: "italic",
                marginTop: 8,
              }}
            >
              Hover each shape to isolate. Note generalization — unsolved by
              both.
            </div>
          </Reveal>
        </Chapter>

        {/* CH V: THE PRINCIPLE — visual pattern table */}
        <Chapter
          label="Chapter V — The Principle"
          title="The general framework"
        >
          <ConvergenceFunnel />
          <PathOriginVis />
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
              The origin story isn't just history — it's architecture.
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
              The path you started on isn't just your history.
              <br />
              It's your <span style={{ color: GOLD }}>architecture</span>.
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
              From a conversation between a human and a language model · 2025
            </div>
          </Reveal>
        </section>
      </div>
    </div>
  );
}
