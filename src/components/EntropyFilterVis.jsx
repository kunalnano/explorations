import { useState, useEffect, useRef } from "react";

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
const CRIMSON = "#e6394a";

const sans = { fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif" };
const serif = { fontFamily: "Georgia, 'Times New Roman', serif" };
const mono = { fontFamily: "'SF Mono', 'Cascadia Code', 'Consolas', monospace" };

function Reveal({ children, delay = 0, style }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.unobserve(el); } },
      { threshold: 0.12 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "translateY(0)" : "translateY(32px)",
      transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`,
      ...style,
    }}>
      {children}
    </div>
  );
}


// ══════════════════════════════════════════════════════════════
// The Narrowing Corridor — capability vs coordination
// ══════════════════════════════════════════════════════════════

export function CorridorVisualization() {
  const canvasRef = useRef(null);
  const [vis, setVis] = useState(false);
  const wrapRef = useRef(null);
  const frameRef = useRef(null);
  const progressRef = useRef(0);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.unobserve(el); } },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!vis) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const W = 720, H = 400;
    canvas.width = W;
    canvas.height = H;

    const startTime = performance.now();
    let running = true;

    function sigmoid(x) { return 1 / (1 + Math.exp(-x)); }

    function tick(now) {
      if (!running) return;
      const elapsed = (now - startTime) / 1000;
      const target = Math.min(elapsed / 3.5, 1);
      progressRef.current += (target - progressRef.current) * 0.04;
      const p = progressRef.current;

      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, W, H);

      const marginX = 60, marginY = 50;
      const gw = W - marginX * 2;
      const gh = H - marginY * 2;
      const steps = 200;

      // Capability curve (rises fast, exponential)
      ctx.beginPath();
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        if (t > p) break;
        const x = marginX + t * gw;
        const capY = marginY + gh - (sigmoid((t - 0.3) * 12) * gh * 0.92);
        if (i === 0) ctx.moveTo(x, capY);
        else ctx.lineTo(x, capY);
      }
      ctx.strokeStyle = ICE;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Coordination curve (rises slower, plateaus, dips)
      ctx.beginPath();
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        if (t > p) break;
        const x = marginX + t * gw;
        const coordRaw = sigmoid((t - 0.35) * 8) * 0.55 +
          Math.sin(t * Math.PI * 3) * 0.04 -
          (t > 0.7 ? (t - 0.7) * 0.6 : 0);
        const coordY = marginY + gh - (coordRaw * gh);
        if (i === 0) ctx.moveTo(x, coordY);
        else ctx.lineTo(x, coordY);
      }
      ctx.strokeStyle = EMBER;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Fill corridor between curves
      if (p > 0.05) {
        ctx.beginPath();
        const pts1 = [], pts2 = [];
        for (let i = 0; i <= steps; i++) {
          const t = i / steps;
          if (t > p) break;
          const x = marginX + t * gw;
          const capY = marginY + gh - (sigmoid((t - 0.3) * 12) * gh * 0.92);
          const coordRaw = sigmoid((t - 0.35) * 8) * 0.55 +
            Math.sin(t * Math.PI * 3) * 0.04 -
            (t > 0.7 ? (t - 0.7) * 0.6 : 0);
          const coordY = marginY + gh - (coordRaw * gh);
          pts1.push({ x, y: capY });
          pts2.push({ x, y: coordY });
        }
        ctx.moveTo(pts1[0].x, pts1[0].y);
        pts1.forEach(pt => ctx.lineTo(pt.x, pt.y));
        for (let i = pts2.length - 1; i >= 0; i--) ctx.lineTo(pts2[i].x, pts2[i].y);
        ctx.closePath();
        const grad = ctx.createLinearGradient(marginX, 0, marginX + gw, 0);
        grad.addColorStop(0, "rgba(255,77,46,0.0)");
        grad.addColorStop(0.3, "rgba(255,77,46,0.08)");
        grad.addColorStop(0.7, "rgba(255,77,46,0.15)");
        grad.addColorStop(1, "rgba(230,57,74,0.25)");
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // Axis labels
      ctx.font = "10px 'SF Mono', monospace";
      ctx.fillStyle = ASH;
      ctx.textAlign = "left";
      ctx.fillText("COMPLEXITY →", marginX, H - 12);
      ctx.save();
      ctx.translate(14, marginY + gh / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.textAlign = "center";
      ctx.fillText("LEVEL →", 0, 0);
      ctx.restore();

      // Legend
      if (p > 0.2) {
        const alpha = Math.min((p - 0.2) * 3, 1);
        ctx.globalAlpha = alpha;
        ctx.font = "11px 'SF Mono', monospace";
        ctx.textAlign = "left";
        ctx.fillStyle = ICE;
        ctx.fillRect(W - 200, 20, 10, 2);
        ctx.fillText("Capability", W - 184, 24);
        ctx.fillStyle = EMBER;
        ctx.fillRect(W - 200, 38, 10, 2);
        ctx.fillText("Coordination", W - 184, 42);
        ctx.fillStyle = "rgba(255,77,46,0.2)";
        ctx.fillRect(W - 200, 52, 10, 10);
        ctx.fillStyle = ASH;
        ctx.fillText("The Corridor", W - 184, 61);
        ctx.globalAlpha = 1;
      }

      // Annotation
      if (p > 0.85) {
        const alpha = Math.min((p - 0.85) * 6, 1);
        ctx.globalAlpha = alpha;
        ctx.font = "bold 13px 'Segoe UI', system-ui, sans-serif";
        ctx.fillStyle = CRIMSON;
        ctx.textAlign = "center";
        ctx.fillText("CORRIDOR CLOSES", marginX + gw * 0.92, marginY + gh * 0.25);
        ctx.globalAlpha = 1;
      }

      frameRef.current = requestAnimationFrame(tick);
    }

    frameRef.current = requestAnimationFrame(tick);
    return () => { running = false; cancelAnimationFrame(frameRef.current); };
  }, [vis]);

  return (
    <div ref={wrapRef} style={{ margin: "40px 0" }}>
      <Reveal>
        <div style={{
          background: FAINT, border: `1px solid ${LINE}`,
          borderRadius: 12, padding: 20, overflow: "hidden",
        }}>
          <canvas ref={canvasRef} style={{
            width: "100%", maxWidth: 720, height: "auto",
            aspectRatio: "720 / 400", display: "block", margin: "0 auto",
          }} />
        </div>
      </Reveal>
    </div>
  );
}


// ══════════════════════════════════════════════════════════════
// Bootstrap Paradox — circular dependency loop
// ══════════════════════════════════════════════════════════════

const BOOTSTRAP_NODES = [
  { id: "ai", label: "AI Systems", icon: "🧠", color: GHOST },
  { id: "energy", label: "Energy Grids", icon: "⚡", color: GOLD },
  { id: "supply", label: "Supply Chains", icon: "🚢", color: GREEN },
  { id: "materials", label: "Rare Materials", icon: "⛏️", color: EMBER },
  { id: "fabs", label: "Chip Fabs", icon: "🔬", color: ICE },
  { id: "compute", label: "Data Centers", icon: "🖥️", color: "#e879f9" },
];

const BOOTSTRAP_EDGES = [
  { from: "ai", to: "energy", label: "optimizes" },
  { from: "energy", to: "fabs", label: "powers" },
  { from: "fabs", to: "compute", label: "produces chips for" },
  { from: "compute", to: "ai", label: "trains" },
  { from: "ai", to: "supply", label: "manages" },
  { from: "supply", to: "materials", label: "delivers" },
  { from: "materials", to: "fabs", label: "feeds" },
];

export function BootstrapParadoxVis() {
  const [hovered, setHovered] = useState(null);
  const [vis, setVis] = useState(false);
  const ref = useRef(null);
  const [pulsePhase, setPulsePhase] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.unobserve(el); } },
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
      setPulsePhase(p => (p + 0.015) % (Math.PI * 2));
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    return () => { running = false; };
  }, [vis]);

  const cx = 300, cy = 240, r = 170;
  const nodePositions = BOOTSTRAP_NODES.map((n, i) => {
    const angle = (i / BOOTSTRAP_NODES.length) * Math.PI * 2 - Math.PI / 2;
    return { ...n, x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r };
  });
  const posMap = {};
  nodePositions.forEach(n => { posMap[n.id] = n; });

  return (
    <div ref={ref} style={{ margin: "40px 0" }}>
      <Reveal>
        <div style={{
          background: FAINT, border: `1px solid ${LINE}`,
          borderRadius: 12, padding: 20, overflow: "hidden",
        }}>
          <svg viewBox="0 0 600 480" style={{ width: "100%", maxWidth: 600, display: "block", margin: "0 auto" }}>
            <text x={cx} y={cy - 10} textAnchor="middle" fill={ASH}
              style={{ fontSize: 10, fontFamily: mono.fontFamily, letterSpacing: 2 }}>BOOTSTRAP</text>
            <text x={cx} y={cx + 10} textAnchor="middle" fill={ASH}
              style={{ fontSize: 10, fontFamily: mono.fontFamily, letterSpacing: 2 }}>PARADOX</text>
            <circle cx={cx} cy={cy} r={r} fill="none" stroke={LINE}
              strokeWidth={1} strokeDasharray="4 8" />
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5"
                markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill={ASH} />
              </marker>
            </defs>
            {BOOTSTRAP_EDGES.map((edge, i) => {
              const from = posMap[edge.from], to = posMap[edge.to];
              if (!from || !to) return null;
              const dx = to.x - from.x, dy = to.y - from.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              const nx = dx / dist, ny = dy / dist;
              const x1 = from.x + nx * 32, y1 = from.y + ny * 32;
              const x2 = to.x - nx * 32, y2 = to.y - ny * 32;
              const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
              const isActive = hovered === edge.from || hovered === edge.to;
              const alpha = vis ? (isActive ? 0.7 : 0.25) : 0;
              return (
                <g key={i}>
                  <line x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke={from.color || EMBER} strokeWidth={isActive ? 2 : 1}
                    strokeOpacity={alpha} strokeDasharray="6 4"
                    strokeDashoffset={-pulsePhase * 20} markerEnd="url(#arrow)" />
                  {isActive && (
                    <text x={mx} y={my - 8} textAnchor="middle" fill={ASH}
                      style={{ fontSize: 9, fontFamily: mono.fontFamily }}>{edge.label}</text>
                  )}
                </g>
              );
            })}
            {nodePositions.map((n) => {
              const isHov = hovered === n.id;
              return (
                <g key={n.id} onMouseEnter={() => setHovered(n.id)}
                  onMouseLeave={() => setHovered(null)} style={{ cursor: "pointer" }}>
                  <circle cx={n.x} cy={n.y} r={isHov ? 34 : 28}
                    fill={BG} stroke={n.color}
                    strokeWidth={isHov ? 2 : 1}
                    strokeOpacity={vis ? (isHov ? 0.9 : 0.4) : 0}
                    style={{ transition: "all 0.3s ease" }} />
                  <text x={n.x} y={n.y + 5} textAnchor="middle" style={{ fontSize: 20 }}>{n.icon}</text>
                  <text x={n.x} y={n.y + 50} textAnchor="middle"
                    fill={isHov ? BONE : ASH}
                    style={{ fontSize: 10, fontFamily: mono.fontFamily, transition: "fill 0.3s" }}>{n.label}</text>
                </g>
              );
            })}
          </svg>
        </div>
      </Reveal>
    </div>
  );
}


// ══════════════════════════════════════════════════════════════
// Fragility Map — chokepoints of civilization
// ══════════════════════════════════════════════════════════════

const CHOKEPOINTS = [
  { id: "hormuz", x: 62, y: 42, label: "Strait of Hormuz",
    detail: "67% of India's LPG. 33% of global helium (Qatar). One lane.", color: EMBER, severity: 0.95 },
  { id: "taiwan", x: 78, y: 38, label: "Taiwan Strait",
    detail: "TSMC produces 90% of advanced chips. Entire AI supply chain.", color: CRIMSON, severity: 1.0 },
  { id: "congo", x: 52, y: 55, label: "DR Congo",
    detail: "70% of global cobalt. Essential for batteries and electronics.", color: GOLD, severity: 0.8 },
  { id: "china-re", x: 75, y: 35, label: "Chinese Rare Earths",
    detail: "60% of mining, 90% of processing. Magnets, motors, defense.", color: "#e879f9", severity: 0.85 },
  { id: "suez", x: 54, y: 40, label: "Suez Canal",
    detail: "12% of global trade. Alternative route adds 10 days + fuel.", color: GOLD, severity: 0.7 },
  { id: "malacca", x: 74, y: 48, label: "Strait of Malacca",
    detail: "25% of all shipped goods. Closure collapses East Asian trade.", color: GREEN, severity: 0.75 },
];

export function FragilityMapVis() {
  const [selected, setSelected] = useState(null);
  const [vis, setVis] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.unobserve(el); } },
      { threshold: 0.12 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ margin: "40px 0" }}>
      <Reveal>
        <div style={{
          background: FAINT, border: `1px solid ${LINE}`,
          borderRadius: 12, padding: 20,
        }}>
          <div style={{
            ...mono, fontSize: 9, letterSpacing: 2,
            color: ASH, textTransform: "uppercase", marginBottom: 16, textAlign: "center",
          }}>SINGLE POINTS OF FAILURE</div>
          <svg viewBox="0 0 100 65" style={{
            width: "100%", maxWidth: 700, display: "block", margin: "0 auto",
          }}>
            {[20, 40, 60, 80].map(x => (
              <line key={`v${x}`} x1={x} y1={0} x2={x} y2={65} stroke={LINE} strokeWidth={0.15} />
            ))}
            {[15, 30, 45].map(y => (
              <line key={`h${y}`} x1={0} y1={y} x2={100} y2={y} stroke={LINE} strokeWidth={0.15} />
            ))}
            <polygon points="8,12 22,10 28,18 25,28 20,32 12,30 6,22"
              fill="rgba(255,255,255,0.015)" stroke={LINE} strokeWidth={0.2} />
            <polygon points="22,35 30,32 32,40 30,52 24,58 18,50 20,42"
              fill="rgba(255,255,255,0.015)" stroke={LINE} strokeWidth={0.2} />
            <polygon points="44,12 56,10 58,18 54,22 46,24 42,18"
              fill="rgba(255,255,255,0.015)" stroke={LINE} strokeWidth={0.2} />
            <polygon points="44,26 56,24 60,32 58,48 52,55 44,50 42,38"
              fill="rgba(255,255,255,0.015)" stroke={LINE} strokeWidth={0.2} />
            <polygon points="58,8 82,6 90,14 88,26 80,32 70,34 62,28 56,18"
              fill="rgba(255,255,255,0.015)" stroke={LINE} strokeWidth={0.2} />
            <polygon points="80,44 90,42 92,50 86,54 78,50"
              fill="rgba(255,255,255,0.015)" stroke={LINE} strokeWidth={0.2} />
            {CHOKEPOINTS.map((cp) => {
              const isSel = selected === cp.id;
              const pulseR = isSel ? 3.5 : 2;
              return (
                <g key={cp.id} onMouseEnter={() => setSelected(cp.id)}
                  onMouseLeave={() => setSelected(null)} style={{ cursor: "pointer" }}>
                  <circle cx={cp.x} cy={cp.y} r={pulseR + 2}
                    fill="none" stroke={cp.color} strokeWidth={0.3} strokeOpacity={isSel ? 0.6 : 0.2}>
                    {vis && <animate attributeName="r" values={`${pulseR + 1};${pulseR + 4};${pulseR + 1}`}
                      dur="2s" repeatCount="indefinite" />}
                    {vis && <animate attributeName="stroke-opacity" values="0.4;0.1;0.4"
                      dur="2s" repeatCount="indefinite" />}
                  </circle>
                  <circle cx={cp.x} cy={cp.y} r={pulseR}
                    fill={cp.color} fillOpacity={isSel ? 0.9 : 0.6}
                    style={{ transition: "all 0.3s" }} />
                  {isSel && (
                    <g>
                      <rect x={cp.x - 22} y={cp.y - 14} width={44} height={10}
                        rx={2} fill={BG} fillOpacity={0.85} stroke={cp.color} strokeWidth={0.2} />
                      <text x={cp.x} y={cp.y - 6.5} textAnchor="middle" fill={cp.color}
                        style={{ fontSize: 2.8, fontFamily: mono.fontFamily }}>{cp.label}</text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
          <div style={{
            minHeight: 48, marginTop: 16, padding: "12px 16px",
            background: "rgba(255,255,255,0.02)", borderRadius: 8,
            border: `1px solid ${LINE}`, transition: "all 0.3s",
          }}>
            {selected ? (() => {
              const cp = CHOKEPOINTS.find(c => c.id === selected);
              return (<>
                <div style={{ ...mono, fontSize: 11, color: cp.color, marginBottom: 4 }}>{cp.label}</div>
                <div style={{ ...serif, fontSize: 14, color: "#c4c0b8", lineHeight: 1.5 }}>{cp.detail}</div>
                <div style={{
                  marginTop: 8, height: 3, borderRadius: 2,
                  background: `linear-gradient(90deg, ${cp.color} ${cp.severity * 100}%, transparent ${cp.severity * 100}%)`,
                  opacity: 0.5,
                }} />
                <div style={{ ...mono, fontSize: 9, color: ASH, marginTop: 4 }}>
                  FRAGILITY: {Math.round(cp.severity * 100)}%
                </div>
              </>);
            })() : (
              <div style={{ ...mono, fontSize: 11, color: ASH, textAlign: "center" }}>
                Hover a chokepoint to see details
              </div>
            )}
          </div>
        </div>
      </Reveal>
    </div>
  );
}


// ══════════════════════════════════════════════════════════════
// Destruction Economics
// ══════════════════════════════════════════════════════════════

export function DestructionEconVis() {
  const [phase, setPhase] = useState(0);

  const phases = [
    { label: "BUILD", cost: "$2B", time: "3 years", icon: "🏗️", color: GREEN, desc: "Refinery built. Materials, labor, energy embodied.", gdp: "+$2B", costW: 200, timeW: 240, gdpW: 200 },
    { label: "DESTROY", cost: "$0.5M", time: "2 seconds", icon: "💥", color: EMBER, desc: "One missile. Years of embodied energy, gone.", gdp: "+$0.5M", costW: 25, timeW: 2, gdpW: 50 },
    { label: "REBUILD", cost: "$4B", time: "5 years", icon: "🔄", color: GOLD, desc: "Double the cost. GDP counts both. The accounting is insane.", gdp: "+$6.5B total", costW: 400, timeW: 400, gdpW: 400 },
  ];
  const current = phases[phase];

  return (
    <Reveal>
      <div style={{
        background: FAINT, border: `1px solid ${LINE}`,
        borderRadius: 12, padding: 24, margin: "40px 0",
      }}>
        <div style={{
          ...mono, fontSize: 9, letterSpacing: 2,
          color: ASH, textTransform: "uppercase", marginBottom: 20, textAlign: "center",
        }}>DESTRUCTION ECONOMICS</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 24 }}>
          {phases.map((p, i) => (
            <button key={i} onClick={() => setPhase(i)} style={{
              background: phase === i ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)",
              border: `1px solid ${phase === i ? p.color + "44" : LINE}`,
              borderRadius: 8, padding: "8px 16px", cursor: "pointer",
              color: phase === i ? p.color : ASH,
              ...mono, fontSize: 10, letterSpacing: 1, transition: "all 0.3s",
            }}>{p.icon} {p.label}</button>
          ))}
        </div>
        <svg viewBox="0 0 500 160" style={{ width: "100%", maxWidth: 500, display: "block", margin: "0 auto" }}>
          {[
            { y: 12, label: "COST", w: current.costW, val: current.cost },
            { y: 62, label: "TIME", w: current.timeW, val: current.time },
            { y: 112, label: "GDP", w: current.gdpW, val: current.gdp, isGdp: true },
          ].map((row) => (
            <g key={row.label}>
              <text x={10} y={row.y + 13} fill={ASH} style={{ fontSize: 10, fontFamily: mono.fontFamily }}>{row.label}</text>
              <rect x={60} y={row.y} width={400} height={24} rx={4}
                fill="rgba(255,255,255,0.02)" stroke={LINE} strokeWidth={0.5} />
              <rect x={60} y={row.y} width={row.w} height={24} rx={4}
                fill={row.isGdp && phase === 2 ? CRIMSON : current.color} fillOpacity={row.isGdp && phase === 2 ? 0.4 : 0.3}
                style={{ transition: "width 0.8s cubic-bezier(0.16,1,0.3,1)" }} />
              <text x={Math.max(70 + row.w, 70)} y={row.y + 16}
                fill={row.isGdp && phase === 2 ? CRIMSON : current.color}
                style={{ fontSize: 11, fontFamily: mono.fontFamily, transition: "all 0.5s" }}>{row.val}</text>
            </g>
          ))}
        </svg>
        <div style={{
          ...serif, fontSize: 14, color: "#c4c0b8", textAlign: "center",
          marginTop: 20, lineHeight: 1.6, minHeight: 44,
        }}>{current.desc}</div>
      </div>
    </Reveal>
  );
}


// ══════════════════════════════════════════════════════════════
// Stargate Collapse — the golden triangle
// ══════════════════════════════════════════════════════════════

export function StargateCollapseVis() {
  const [hovered, setHovered] = useState(null);
  const [vis, setVis] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.unobserve(el); } },
      { threshold: 0.12 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const nodes = [
    { id: "openai", label: "OpenAI", x: 250, y: 60, color: ICE, detail: "Walked away from 600MW expansion" },
    { id: "nvidia", label: "Nvidia", x: 100, y: 280, color: GREEN, detail: "$150M to block AMD. Chips obsolete before install" },
    { id: "oracle", label: "Oracle", x: 400, y: 280, color: GOLD, detail: "Massive debt for infrastructure needing gutting" },
  ];
  const edges = [
    { from: "openai", to: "nvidia", label: "chip dependency", status: "strained" },
    { from: "openai", to: "oracle", label: "infra partnership", status: "collapsed" },
    { from: "nvidia", to: "oracle", label: "supply agreement", status: "compromised" },
  ];
  const nodeMap = {};
  nodes.forEach(n => { nodeMap[n.id] = n; });

  return (
    <div ref={ref} style={{ margin: "40px 0" }}>
      <Reveal>
        <div style={{
          background: FAINT, border: `1px solid ${LINE}`,
          borderRadius: 12, padding: 20,
        }}>
          <div style={{
            ...mono, fontSize: 9, letterSpacing: 2,
            color: ASH, textTransform: "uppercase", marginBottom: 16, textAlign: "center",
          }}>THE GOLDEN TRIANGLE — FRAGMENTING</div>
          <svg viewBox="0 0 500 360" style={{ width: "100%", maxWidth: 500, display: "block", margin: "0 auto" }}>
            <text x={250} y={190} textAnchor="middle" fill={CRIMSON}
              style={{ fontSize: 10, fontFamily: mono.fontFamily, letterSpacing: 2 }}>STARGATE</text>
            <text x={250} y={205} textAnchor="middle" fill={ASH}
              style={{ fontSize: 8, fontFamily: mono.fontFamily }}>$500B → $0</text>
            {edges.map((edge, i) => {
              const from = nodeMap[edge.from], to = nodeMap[edge.to];
              const mx = (from.x + to.x) / 2, my = (from.y + to.y) / 2;
              const isActive = hovered === edge.from || hovered === edge.to;
              return (
                <g key={i}>
                  <line x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                    stroke={CRIMSON} strokeWidth={isActive ? 1.5 : 0.8}
                    strokeOpacity={isActive ? 0.6 : 0.2}
                    strokeDasharray={edge.status === "collapsed" ? "3 6" : "6 3"} />
                  {isActive && (
                    <text x={mx} y={my - 6} textAnchor="middle" fill={ASH}
                      style={{ fontSize: 8, fontFamily: mono.fontFamily }}>
                      {edge.label} [{edge.status}]
                    </text>
                  )}
                </g>
              );
            })}
            {nodes.map((n) => {
              const isHov = hovered === n.id;
              return (
                <g key={n.id} onMouseEnter={() => setHovered(n.id)}
                  onMouseLeave={() => setHovered(null)} style={{ cursor: "pointer" }}>
                  <circle cx={n.x} cy={n.y} r={isHov ? 38 : 30}
                    fill={BG} stroke={n.color}
                    strokeWidth={isHov ? 2 : 1}
                    strokeOpacity={vis ? (isHov ? 0.8 : 0.35) : 0}
                    style={{ transition: "all 0.3s ease" }} />
                  <text x={n.x} y={n.y + 4} textAnchor="middle"
                    fill={isHov ? BONE : "#8a8698"}
                    style={{ fontSize: 12, fontFamily: sans.fontFamily, fontWeight: 600, transition: "fill 0.3s" }}>
                    {n.label}
                  </text>
                  {isHov && (
                    <text x={n.x} y={n.y + 56} textAnchor="middle" fill={n.color}
                      style={{ fontSize: 9, fontFamily: mono.fontFamily }}>{n.detail}</text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </Reveal>
    </div>
  );
}


// ══════════════════════════════════════════════════════════════
// Prisoner's Dilemma Cascade
// ══════════════════════════════════════════════════════════════

export function PrisonersDilemmaVis() {
  const [round, setRound] = useState(0);
  const maxRounds = 6;

  const states = [
    { coop: 8, label: "Global supply chain works. Everyone cooperates.", status: "stable" },
    { coop: 6, label: "Minor disruption. Two players hedge.", status: "cautious" },
    { coop: 4, label: "Trust erodes. Stockpiling begins.", status: "unstable" },
    { coop: 2, label: "Export controls. Resource nationalism.", status: "fragmenting" },
    { coop: 1, label: "Supply chains bifurcate. Redundancy costs explode.", status: "fractured" },
    { coop: 0, label: "Everyone defects. Mutual vulnerability becomes mutual hostility.", status: "collapsed" },
    { coop: 0, label: "No one can build AGI alone. The corridor closes.", status: "closed" },
  ];
  const current = states[round];

  return (
    <Reveal>
      <div style={{
        background: FAINT, border: `1px solid ${LINE}`,
        borderRadius: 12, padding: 24, margin: "40px 0",
      }}>
        <div style={{
          ...mono, fontSize: 9, letterSpacing: 2,
          color: ASH, textTransform: "uppercase", marginBottom: 20, textAlign: "center",
        }}>CIVILIZATIONAL PRISONER'S DILEMMA</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
          {Array.from({ length: 8 }).map((_, i) => {
            const isDefector = i >= current.coop;
            return (
              <div key={i} style={{
                width: 40, height: 40, borderRadius: 8,
                background: isDefector ? "rgba(230,57,74,0.15)" : "rgba(52,211,153,0.1)",
                border: `1px solid ${isDefector ? CRIMSON + "44" : GREEN + "33"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18, transition: "all 0.5s ease",
              }}>{isDefector ? "🛡️" : "🤝"}</div>
            );
          })}
        </div>
        <div style={{
          ...serif, fontSize: 14, color: "#c4c0b8", textAlign: "center",
          lineHeight: 1.6, marginBottom: 20, minHeight: 44,
        }}>{current.label}</div>
        <div style={{
          ...mono, fontSize: 10, textAlign: "center",
          color: current.status === "closed" ? CRIMSON : current.status === "stable" ? GREEN : GOLD,
          marginBottom: 16, letterSpacing: 1,
        }}>STATUS: {current.status.toUpperCase()}</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
          <span style={{ ...mono, fontSize: 10, color: GREEN }}>COOPERATE</span>
          <input type="range" min={0} max={maxRounds} value={round}
            onChange={(e) => setRound(Number(e.target.value))}
            style={{ width: 200, accentColor: EMBER }} />
          <span style={{ ...mono, fontSize: 10, color: CRIMSON }}>DEFECT</span>
        </div>
      </div>
    </Reveal>
  );
}
