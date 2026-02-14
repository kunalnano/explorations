import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════
   JWST: THE COSMIC DOMINO COLLAPSE
   The James Webb Space Telescope keeps delivering massive L's
   for astrophysics. What falls if the CMB isn't primordial.
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

// ── DOMINO DATA ──
const ALL_DOMINOES = [
  { name: "Big Bang theory", cat: "foundation", color: EMBER },
  { name: "Cosmic inflation", cat: "foundation", color: EMBER },
  { name: "ΛCDM model", cat: "foundation", color: EMBER },
  { name: "Age of the universe", cat: "foundation", color: EMBER },
  { name: "CMB power spectrum", cat: "cmb", color: GHOST },
  { name: "Acoustic peaks", cat: "cmb", color: GHOST },
  { name: "CMB polarization", cat: "cmb", color: GHOST },
  { name: "Gravitational lensing of CMB", cat: "cmb", color: GHOST },
  { name: "ISW effect", cat: "cmb", color: GHOST },
  { name: "Planck & WMAP data", cat: "cmb", color: GHOST },
  { name: "Dark energy", cat: "dark", color: ICE },
  { name: "Dark matter density", cat: "dark", color: ICE },
  { name: "Cosmic curvature", cat: "dark", color: ICE },
  { name: "Large-scale structure", cat: "structure", color: GREEN },
  { name: "Baryon oscillations", cat: "structure", color: GREEN },
  { name: "Hubble constant H₀", cat: "structure", color: GREEN },
  { name: "Distance ladder", cat: "structure", color: GREEN },
  { name: "Reionization epoch", cat: "structure", color: GREEN },
  { name: "Primordial nucleosynthesis", cat: "structure", color: GREEN },
  { name: "Matter–radiation equality", cat: "structure", color: GREEN },
];

const CATEGORIES = [
  { id: "foundation", label: "Foundational Models", color: EMBER },
  { id: "cmb", label: "CMB-Dependent", color: GHOST },
  { id: "dark", label: "Dark Sector", color: ICE },
  { id: "structure", label: "Structure & Distance", color: GREEN },
];

// ── DRAMATIC COUNTER — big reveal with particle burst ──
function DramaticCounter() {
  const ref = useRef(null);
  const [count, setCount] = useState(0);
  const [burst, setBurst] = useState(false);
  const target = ALL_DOMINOES.length;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          obs.unobserve(el);
          let c = 0;
          const interval = setInterval(() => {
            c++;
            setCount(c);
            if (c >= target) {
              clearInterval(interval);
              setBurst(true);
            }
          }, 60);
        }
      },
      { threshold: 0.5 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);

  return (
    <div
      ref={ref}
      style={{ textAlign: "center", margin: "48px 0", position: "relative" }}
    >
      <div
        style={{
          ...sans,
          fontSize: "clamp(80px, 15vw, 140px)",
          fontWeight: 900,
          lineHeight: 1,
          color: EMBER,
          position: "relative",
          display: "inline-block",
          textShadow: burst
            ? `0 0 40px ${EMBER}66, 0 0 80px ${EMBER}33`
            : "none",
          transition: "text-shadow 0.5s",
        }}
      >
        {count}
      </div>
      <div
        style={{
          ...mono,
          fontSize: 12,
          letterSpacing: 3,
          textTransform: "uppercase",
          color: burst ? EMBER : ASH,
          marginTop: 8,
          transition: "color 0.5s",
        }}
      >
        flagship findings thrown into question
      </div>
      {/* Category breakdown */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 16,
          marginTop: 20,
          flexWrap: "wrap",
        }}
      >
        {CATEGORIES.map((c) => {
          const n = ALL_DOMINOES.filter((d) => d.cat === c.id).length;
          return (
            <div
              key={c.id}
              style={{
                ...mono,
                fontSize: 9,
                letterSpacing: 1,
                padding: "4px 12px",
                borderRadius: 20,
                color: c.color,
                border: `1px solid ${c.color}33`,
                background: c.color + "0c",
              }}
            >
              {c.label} · {n}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── DOMINO CASCADE — click to topple ──
function DominoCascade() {
  const [toppled, setToppled] = useState(-1);
  const [autoRunning, setAutoRunning] = useState(false);
  const timerRef = useRef(null);

  const startCascade = useCallback(() => {
    setToppled(0);
    setAutoRunning(true);
  }, []);

  useEffect(() => {
    if (!autoRunning || toppled < 0) return;
    if (toppled >= ALL_DOMINOES.length - 1) {
      setAutoRunning(false);
      return;
    }
    timerRef.current = setTimeout(() => setToppled((t) => t + 1), 120);
    return () => clearTimeout(timerRef.current);
  }, [toppled, autoRunning]);

  const reset = () => {
    setToppled(-1);
    setAutoRunning(false);
  };

  const cols = 5;
  const rows = Math.ceil(ALL_DOMINOES.length / cols);
  const cellW = 120,
    cellH = 56;

  return (
    <Reveal>
      <div style={{ margin: "32px 0" }}>
        <svg
          viewBox={`0 0 ${cols * cellW + 20} ${rows * cellH + 60}`}
          style={{
            width: "100%",
            maxWidth: cols * cellW + 20,
            display: "block",
            margin: "0 auto",
          }}
        >
          {ALL_DOMINOES.map((d, i) => {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const x = 10 + col * cellW;
            const y = 10 + row * cellH;
            const isFallen = i <= toppled;
            const isFalling = i === toppled;

            return (
              <g
                key={i}
                style={{
                  cursor: toppled === -1 && i === 0 ? "pointer" : "default",
                }}
                onClick={() => toppled === -1 && i === 0 && startCascade()}
              >
                {/* Domino piece */}
                <rect
                  x={x}
                  y={y}
                  width={cellW - 8}
                  height={cellH - 8}
                  rx={8}
                  fill={isFallen ? d.color + "22" : FAINT}
                  stroke={isFallen ? d.color + "88" : LINE}
                  strokeWidth={isFalling ? 2.5 : isFallen ? 1.5 : 0.8}
                  style={{
                    transition: "all 0.3s ease",
                    transform: isFallen
                      ? `rotate(${2 + Math.random() * 3}deg)`
                      : "none",
                    transformOrigin: `${x + cellW / 2}px ${y + cellH}px`,
                    filter: isFalling
                      ? `drop-shadow(0 0 12px ${d.color}66)`
                      : "none",
                  }}
                />
                {/* Label */}
                <text
                  x={x + (cellW - 8) / 2}
                  y={y + (cellH - 8) / 2 + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={isFallen ? d.color : ASH}
                  fontSize={8}
                  fontWeight={isFallen ? 700 : 400}
                  fontFamily="'Segoe UI', sans-serif"
                  style={{ transition: "fill 0.3s" }}
                >
                  {d.name}
                </text>
                {/* Impact flash */}
                {isFalling && (
                  <circle
                    cx={x + (cellW - 8) / 2}
                    cy={y + (cellH - 8) / 2}
                    r={20}
                    fill={d.color}
                    opacity={0.15}
                  >
                    <animate
                      attributeName="r"
                      from="5"
                      to="30"
                      dur="0.4s"
                      fill="freeze"
                    />
                    <animate
                      attributeName="opacity"
                      from="0.3"
                      to="0"
                      dur="0.4s"
                      fill="freeze"
                    />
                  </circle>
                )}
              </g>
            );
          })}
        </svg>

        {/* Controls */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 12,
            marginTop: 16,
          }}
        >
          {toppled === -1 ? (
            <button
              onClick={startCascade}
              style={{
                ...mono,
                fontSize: 11,
                letterSpacing: 2,
                padding: "10px 28px",
                borderRadius: 24,
                background: EMBER + "18",
                border: `1px solid ${EMBER}44`,
                color: EMBER,
                cursor: "pointer",
              }}
            >
              ▶ TOPPLE THE FIRST DOMINO
            </button>
          ) : (
            <button
              onClick={reset}
              style={{
                ...mono,
                fontSize: 10,
                letterSpacing: 1,
                padding: "8px 20px",
                borderRadius: 20,
                background: "transparent",
                border: `1px solid ${LINE}`,
                color: ASH,
                cursor: "pointer",
              }}
            >
              ↻ RESET
            </button>
          )}
        </div>
        {toppled >= 0 && (
          <div
            style={{
              textAlign: "center",
              marginTop: 12,
              ...mono,
              fontSize: 10,
              color: toppled >= ALL_DOMINOES.length - 1 ? EMBER : ASH,
            }}
          >
            {toppled + 1} / {ALL_DOMINOES.length} fallen
          </div>
        )}
      </div>
    </Reveal>
  );
}

// ── CMB DEPENDENCY GRAPH — radial layout showing what depends on CMB ──
function DependencyGraph() {
  const [hovered, setHovered] = useState(null);
  const cx = 320,
    cy = 260,
    innerR = 50;

  // Layout categories in rings
  const rings = CATEGORIES.map((cat, ci) => {
    const items = ALL_DOMINOES.filter((d) => d.cat === cat.id);
    const r = 120 + ci * 55;
    return items.map((item, ii) => {
      const startAngle = ci * 90 - 45;
      const spread = 80;
      const angle =
        ((startAngle + (ii / Math.max(items.length - 1, 1)) * spread) *
          Math.PI) /
        180;
      return {
        ...item,
        x: cx + Math.cos(angle) * r,
        y: cy + Math.sin(angle) * r,
        catIdx: ci,
        angle,
      };
    });
  }).flat();

  const hoveredCat = hovered !== null ? rings[hovered]?.cat : null;

  return (
    <Reveal>
      <div style={{ margin: "32px 0" }}>
        <svg
          viewBox="0 0 640 520"
          style={{
            width: "100%",
            maxWidth: 640,
            display: "block",
            margin: "0 auto",
          }}
        >
          {/* Distance rings */}
          {[120, 175, 230, 285].map((r, i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={LINE}
              strokeWidth={0.5}
              strokeDasharray="4 4"
            />
          ))}

          {/* Connection lines from CMB to each domino */}
          {rings.map((d, i) => {
            const isHL = hovered === i || hoveredCat === d.cat;
            return (
              <line
                key={`line-${i}`}
                x1={cx}
                y1={cy}
                x2={d.x}
                y2={d.y}
                stroke={isHL ? d.color + "66" : d.color + "12"}
                strokeWidth={isHL ? 1.5 : 0.5}
                style={{ transition: "all 0.3s" }}
              />
            );
          })}

          {/* CMB central node */}
          <circle
            cx={cx}
            cy={cy}
            r={innerR}
            fill={EMBER + "12"}
            stroke={EMBER + "66"}
            strokeWidth={2}
          />
          <circle
            cx={cx}
            cy={cy}
            r={innerR - 6}
            fill="none"
            stroke={EMBER + "22"}
            strokeWidth={1}
            strokeDasharray="4 3"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from={`0 ${cx} ${cy}`}
              to={`360 ${cx} ${cy}`}
              dur="30s"
              repeatCount="indefinite"
            />
          </circle>
          <text
            x={cx}
            y={cy - 6}
            textAnchor="middle"
            fill={EMBER}
            fontSize={11}
            fontWeight={700}
            fontFamily="'Segoe UI', sans-serif"
          >
            CMB
          </text>
          <text
            x={cx}
            y={cy + 8}
            textAnchor="middle"
            fill={ASH}
            fontSize={8}
            fontFamily="monospace"
          >
            Foundation
          </text>

          {/* Domino nodes */}
          {rings.map((d, i) => {
            const isHL = hovered === i;
            const isCatHL = hoveredCat === d.cat;
            return (
              <g
                key={`node-${i}`}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: "pointer" }}
              >
                <circle
                  cx={d.x}
                  cy={d.y}
                  r={isHL ? 24 : 18}
                  fill={isHL || isCatHL ? d.color + "18" : d.color + "08"}
                  stroke={d.color + (isHL ? "88" : isCatHL ? "44" : "22")}
                  strokeWidth={isHL ? 2 : 1}
                  style={{
                    transition: "all 0.3s",
                    filter: isHL ? `drop-shadow(0 0 8px ${d.color}44)` : "none",
                  }}
                />
                <text
                  x={d.x}
                  y={d.y + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={isHL || isCatHL ? d.color : ASH}
                  fontSize={isHL ? 7 : 6}
                  fontWeight={isHL ? 700 : 400}
                  fontFamily="'Segoe UI', sans-serif"
                  style={{ transition: "all 0.3s" }}
                >
                  {d.name.length > 14 ? d.name.slice(0, 12) + "…" : d.name}
                </text>
              </g>
            );
          })}

          {/* Category legend */}
          {CATEGORIES.map((c, i) => (
            <g key={`leg-${i}`}>
              <circle cx={30 + i * 160} cy={510} r={5} fill={c.color} />
              <text
                x={40 + i * 160}
                y={514}
                fill={c.color}
                fontSize={9}
                fontFamily="'Segoe UI', sans-serif"
                fontWeight={600}
              >
                {c.label}
              </text>
            </g>
          ))}

          {/* Hover detail */}
          {hovered !== null && (
            <g>
              <rect
                x={cx - 100}
                y={16}
                width={200}
                height={28}
                rx={8}
                fill={BG}
                stroke={rings[hovered].color + "44"}
              />
              <text
                x={cx}
                y={34}
                textAnchor="middle"
                fill={rings[hovered].color}
                fontSize={10}
                fontWeight={600}
                fontFamily="monospace"
              >
                {rings[hovered].name}
              </text>
            </g>
          )}
        </svg>
        <div
          style={{
            ...mono,
            fontSize: 9,
            color: ASH,
            textAlign: "center",
            marginTop: 4,
          }}
        >
          Every node is calibrated against the CMB · Hover to trace dependencies
        </div>
      </div>
    </Reveal>
  );
}

// ── GALAXY TIMELINE — JWST discovery markers on cosmic timeline ──
const DISCOVERIES = [
  {
    year: 2022.5,
    label: "JWST launches",
    desc: "Christmas 2021, reaches L2 Jan 2022",
    color: GOLD,
    type: "event",
  },
  {
    year: 2022.7,
    label: "First deep field",
    desc: "SMACS 0723 — earliest galaxies seen",
    color: ICE,
    type: "finding",
  },
  {
    year: 2023.0,
    label: "CEERS galaxies",
    desc: "Mature galaxies at z>10, shouldn't exist",
    color: EMBER,
    type: "finding",
  },
  {
    year: 2023.3,
    label: "JADES survey",
    desc: "Galaxy at z=14.3 — just 290M years post-BB",
    color: EMBER,
    type: "finding",
  },
  {
    year: 2023.6,
    label: "Impossible masses",
    desc: "Galaxies 10-100x more massive than predicted",
    color: GHOST,
    type: "finding",
  },
  {
    year: 2024.0,
    label: "H₀ tension deepens",
    desc: "Cepheid measurements confirm the discrepancy",
    color: ICE,
    type: "finding",
  },
  {
    year: 2024.4,
    label: "EMG energy budget",
    desc: "Early galaxies could account for CMB energy",
    color: EMBER,
    type: "finding",
  },
  {
    year: 2025.0,
    label: "CMB origin paper",
    desc: "EMGs fully explain CMB energy density",
    color: EMBER,
    type: "bombshell",
  },
];

function GalaxyTimeline() {
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
      { threshold: 0.12 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const W = 660,
    H = 320,
    padL = 50,
    padR = 50,
    padT = 40,
    padB = 80;
  const gW = W - padL - padR;
  const minY = 2022.0,
    maxY = 2025.5;

  return (
    <Reveal>
      <div ref={ref} style={{ margin: "32px 0" }}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          style={{
            width: "100%",
            maxWidth: W,
            display: "block",
            margin: "0 auto",
          }}
        >
          {/* Timeline axis */}
          <line
            x1={padL}
            y1={padT + 20}
            x2={padL + gW}
            y2={padT + 20}
            stroke={ASH + "44"}
            strokeWidth={2}
          />

          {/* Year markers */}
          {[2022, 2023, 2024, 2025].map((yr) => {
            const x = padL + ((yr - minY) / (maxY - minY)) * gW;
            return (
              <g key={yr}>
                <line
                  x1={x}
                  y1={padT + 14}
                  x2={x}
                  y2={padT + 26}
                  stroke={ASH + "44"}
                  strokeWidth={1}
                />
                <text
                  x={x}
                  y={padT + 8}
                  textAnchor="middle"
                  fill={ASH}
                  fontSize={10}
                  fontFamily="monospace"
                >
                  {yr}
                </text>
              </g>
            );
          })}

          {/* Discovery markers */}
          {DISCOVERIES.map((d, i) => {
            const x = padL + ((d.year - minY) / (maxY - minY)) * gW;
            const side = i % 2 === 0 ? 1 : -1;
            const stemH = 40 + (i % 3) * 16;
            const labelY = padT + 20 + side * stemH;
            const isH = hovered === i;
            const isBomb = d.type === "bombshell";
            const delay = vis ? i * 0.1 : 0;

            return (
              <g
                key={i}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  cursor: "pointer",
                  opacity: vis ? 1 : 0,
                  transition: `opacity 0.5s ease ${delay}s`,
                }}
              >
                {/* Stem */}
                <line
                  x1={x}
                  y1={padT + 20}
                  x2={x}
                  y2={labelY}
                  stroke={d.color + (isH ? "88" : "33")}
                  strokeWidth={isH ? 1.5 : 1}
                  style={{ transition: "all 0.3s" }}
                />
                {/* Dot on axis */}
                <circle
                  cx={x}
                  cy={padT + 20}
                  r={isBomb ? 6 : isH ? 5 : 3.5}
                  fill={d.color}
                  style={{
                    transition: "r 0.2s",
                    filter:
                      isH || isBomb
                        ? `drop-shadow(0 0 6px ${d.color}88)`
                        : "none",
                  }}
                >
                  {isBomb && (
                    <animate
                      attributeName="r"
                      values="5;8;5"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  )}
                </circle>
                {/* Label box */}
                <rect
                  x={x - 68}
                  y={side > 0 ? labelY : labelY - 34}
                  width={136}
                  height={34}
                  rx={8}
                  fill={isH ? d.color + "14" : BG}
                  stroke={d.color + (isH ? "66" : "22")}
                  strokeWidth={isH ? 1.5 : 0.8}
                  style={{ transition: "all 0.3s" }}
                />
                <text
                  x={x}
                  y={(side > 0 ? labelY : labelY - 34) + 14}
                  textAnchor="middle"
                  fill={d.color}
                  fontSize={8.5}
                  fontWeight={700}
                  fontFamily="'Segoe UI', sans-serif"
                >
                  {d.label}
                </text>
                <text
                  x={x}
                  y={(side > 0 ? labelY : labelY - 34) + 26}
                  textAnchor="middle"
                  fill={ASH}
                  fontSize={7}
                  fontFamily="Georgia, serif"
                >
                  {d.desc}
                </text>
              </g>
            );
          })}

          {/* Escalation gradient */}
          <defs>
            <linearGradient id="escalate" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={GOLD} stopOpacity={0.05} />
              <stop offset="100%" stopColor={EMBER} stopOpacity={0.15} />
            </linearGradient>
          </defs>
          <rect
            x={padL}
            y={padT + 22}
            width={gW}
            height={6}
            fill="url(#escalate)"
          />
        </svg>
      </div>
    </Reveal>
  );
}

// ═══════════════ MAIN ═══════════════
export default function JWSTDominoes({ onBack }) {
  const [backHover, setBackHover] = useState(false);

  return (
    <div style={{ background: BG, minHeight: "100vh", color: BONE }}>
      <style>{`
        @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes fadeUp  { from { opacity: 0; transform: translateY(32px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes pulseEmber { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
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
      <button
        onClick={onBack}
        onMouseEnter={() => setBackHover(true)}
        onMouseLeave={() => setBackHover(false)}
        style={{
          position: "fixed",
          top: 28,
          left: 28,
          zIndex: 1000,
          background: "none",
          border: "none",
          color: backHover ? BONE : ASH,
          cursor: "pointer",
          ...mono,
          fontSize: 11,
          letterSpacing: 2,
          padding: "8px 0",
          transition: "color 0.3s",
        }}
      >
        ← EXPLORATIONS
      </button>

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
            When one telescope rewrites the textbooks
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
            The Cosmic
            <br />
            Domino Collapse
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
            If early galaxies account for the entire CMB, modern cosmology loses
            its calibration standard.
          </div>
        </div>

        {/* CH I: THE COUNT */}
        <Chapter
          label="Chapter I — The Scale"
          title="If the CMB isn't primordial, everything built on it is suspect"
        >
          <DramaticCounter />
        </Chapter>

        {/* CH II: THE TIMELINE */}
        <Chapter
          label="Chapter II — The Discovery Arc"
          title="Two years of escalating findings"
        >
          <GalaxyTimeline />
        </Chapter>

        {/* CH III: DEPENDENCY GRAPH */}
        <Chapter
          label="Chapter III — The Web"
          title="Everything connects back to the CMB"
        >
          <DependencyGraph />
        </Chapter>

        {/* CH IV: THE CASCADE */}
        <Chapter
          label="Chapter IV — The Dominoes"
          title="Click to topple the first one"
        >
          <DominoCascade />
        </Chapter>

        {/* CH V: THE CAVEAT */}
        <Chapter
          label="Chapter V — The Caveat"
          title="Science doesn't collapse in a day"
        >
          <Reveal>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}
            >
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
                    marginBottom: 10,
                  }}
                >
                  WHY IT MIGHT BE OK
                </div>
                {[
                  "One paper — needs replication",
                  "ΛCDM is battle-tested for decades",
                  "JWST was literally built to challenge models",
                  "Science is designed for revision",
                ].map((t, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: 8,
                      padding: "5px 0",
                      borderBottom: i < 3 ? `1px solid ${LINE}` : "none",
                    }}
                  >
                    <span style={{ color: GREEN, fontSize: 10 }}>✓</span>
                    <span
                      style={{
                        ...serif,
                        fontSize: 12,
                        color: BONE,
                        lineHeight: 1.5,
                      }}
                    >
                      {t}
                    </span>
                  </div>
                ))}
              </div>
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
                    marginBottom: 10,
                  }}
                >
                  WHY IT MIGHT NOT BE
                </div>
                {[
                  "This isn't a tweak — it's a foundation crack",
                  "20 findings across 4 categories affected",
                  "The Hubble tension was already a warning sign",
                  "Wrong-but-useful → less-wrong-but-more-useful",
                ].map((t, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: 8,
                      padding: "5px 0",
                      borderBottom: i < 3 ? `1px solid ${LINE}` : "none",
                    }}
                  >
                    <span style={{ color: EMBER, fontSize: 10 }}>⚠</span>
                    <span
                      style={{
                        ...serif,
                        fontSize: 12,
                        color: BONE,
                        lineHeight: 1.5,
                      }}
                    >
                      {t}
                    </span>
                  </div>
                ))}
              </div>
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
              The universe doesn't care about our models.
              <br />
              It just keeps{" "}
              <span style={{ color: EMBER }}>showing us what's real</span>.
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
