import { useState, useEffect, useRef, useCallback } from "react";

// ── Shared styles ──
const mono = { fontFamily: "'SF Mono', 'Fira Code', 'Consolas', monospace" };
const serif = { fontFamily: "'Georgia', 'Times New Roman', serif" };
const sans = { fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif" };

const EMBER = "#ff4d2e";
const ICE = "#6ee7f0";
const GHOST = "#9b8fff";
const BONE = "#e8e4dc";
const ASH = "#4a4860";
const GOLD = "#fbbf24";
const GREEN = "#34d399";
const BG = "#050508";
const FAINT = "rgba(255,255,255,0.03)";
const LINE = "rgba(255,255,255,0.05)";

// ── Reveal on scroll hook ──
function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function Reveal({ children, style, delay = 0 }) {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(36px)",
      transition: `all 1s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
      ...style,
    }}>
      {children}
    </div>
  );
}

// ── Chapter heading ──
function Chapter({ label, title, children }) {
  return (
    <section style={{ padding: "80px 0", borderTop: `1px solid ${LINE}` }}>
      <Reveal>
        <div style={{ ...mono, fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: GHOST, marginBottom: 20 }}>{label}</div>
        <h2 style={{ ...sans, fontSize: "clamp(26px, 4.5vw, 40px)", fontWeight: 700, lineHeight: 1.1, letterSpacing: -1, marginBottom: 24 }}>{title}</h2>
      </Reveal>
      {children}
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// ENTROPY FLUCTUATION VISUALIZATION
// Replaces the prose explanation of the Second Law.
// Shows entropy over time with rare fluctuations dipping down.
// ═══════════════════════════════════════════════════════════════
function EntropyFluctuationVis() {
  const canvasRef = useRef(null);
  const [ref, vis] = useReveal(0.15);
  const frameRef = useRef(null);
  const dataRef = useRef({ points: [], brainFlash: 0, time: 0 });

  useEffect(() => {
    if (!vis) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = 660, H = 260;
    canvas.width = W; canvas.height = H;

    const d = dataRef.current;
    // Pre-seed some history
    d.points = Array.from({ length: W }, (_, i) => {
      const base = 0.82;
      const noise = (Math.sin(i * 0.05) * 0.03 + Math.sin(i * 0.13) * 0.02 + (Math.random() - 0.5) * 0.04);
      // Rare deep dip
      const dip = (i > 320 && i < 340) ? -0.35 * Math.exp(-((i - 330) ** 2) / 30) : 0;
      return Math.max(0.05, Math.min(1, base + noise + dip));
    });

    let running = true;
    function tick() {
      if (!running) return;
      d.time++;
      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, W, H);

      // Shift points left, add new
      d.points.shift();
      const base = 0.82;
      const t = d.time;
      const noise = Math.sin(t * 0.05) * 0.03 + Math.sin(t * 0.13) * 0.02 + (Math.random() - 0.5) * 0.04;
      // Rare deep dip every ~600 frames
      const dipPhase = t % 600;
      const dip = (dipPhase > 280 && dipPhase < 300) ? -0.4 * Math.exp(-((dipPhase - 290) ** 2) / 25) : 0;
      const val = Math.max(0.05, Math.min(1, base + noise + dip));
      d.points.push(val);

      if (dip < -0.15) d.brainFlash = 20;
      if (d.brainFlash > 0) d.brainFlash--;

      // Grid lines
      ctx.strokeStyle = LINE;
      ctx.lineWidth = 0.5;
      for (let y = 0.25; y <= 0.75; y += 0.25) {
        ctx.beginPath();
        ctx.moveTo(40, 20 + (1 - y) * 200);
        ctx.lineTo(W - 10, 20 + (1 - y) * 200);
        ctx.stroke();
      }

      // Labels
      ctx.fillStyle = ASH;
      ctx.font = "9px monospace";
      ctx.textAlign = "right";
      ctx.fillText("HIGH", 36, 42);
      ctx.fillText("LOW", 36, 212);

      // Y-axis label
      ctx.save();
      ctx.translate(12, 120);
      ctx.rotate(-Math.PI / 2);
      ctx.textAlign = "center";
      ctx.fillStyle = ASH;
      ctx.font = "8px monospace";
      ctx.fillText("ENTROPY", 0, 0);
      ctx.restore();

      // Draw curve
      ctx.beginPath();
      for (let i = 0; i < d.points.length; i++) {
        const x = 40 + (i / d.points.length) * (W - 50);
        const y = 20 + (1 - d.points[i]) * 200;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = EMBER;
      ctx.lineWidth = 1.8;
      ctx.stroke();

      // Fill under
      ctx.lineTo(W - 10, 220);
      ctx.lineTo(40, 220);
      ctx.closePath();
      const grad = ctx.createLinearGradient(0, 20, 0, 220);
      grad.addColorStop(0, EMBER + "18");
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.fill();

      // Highlight deep dips
      for (let i = 1; i < d.points.length; i++) {
        if (d.points[i] < 0.55) {
          const x = 40 + (i / d.points.length) * (W - 50);
          const y = 20 + (1 - d.points[i]) * 200;
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, Math.PI * 2);
          ctx.fillStyle = ICE;
          ctx.fill();
        }
      }

      // Brain flash when deep fluctuation occurs
      if (d.brainFlash > 0) {
        const alpha = d.brainFlash / 20;
        ctx.fillStyle = `rgba(110,231,240,${alpha * 0.15})`;
        ctx.fillRect(0, 0, W, H);
        ctx.font = `${24 + d.brainFlash}px sans-serif`;
        ctx.textAlign = "center";
        ctx.fillStyle = `rgba(110,231,240,${alpha})`;
        ctx.fillText("🧠", W / 2, 140);
        ctx.font = "10px monospace";
        ctx.fillStyle = `rgba(110,231,240,${alpha * 0.8})`;
        ctx.fillText("FLUCTUATION → OBSERVER", W / 2, 170);
      }

      // Legend
      ctx.font = "8px 'Georgia', serif";
      ctx.textAlign = "center";
      ctx.fillStyle = ASH;
      ctx.fillText("Entropy mostly stays high. Rare dips create momentary pockets of order — including brains.", W / 2, H - 12);

      frameRef.current = requestAnimationFrame(tick);
    }
    frameRef.current = requestAnimationFrame(tick);
    return () => { running = false; cancelAnimationFrame(frameRef.current); };
  }, [vis]);

  return (
    <Reveal>
      <div ref={ref}>
        <canvas ref={canvasRef} style={{
          width: "100%", maxWidth: 660, display: "block", margin: "0 auto",
          borderRadius: 16, border: `1px solid ${LINE}`, background: BG,
        }} />
        <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 12 }}>
          {[
            { color: EMBER, label: "Entropy level" },
            { color: ICE, label: "Deep fluctuation (observer-grade)" },
          ].map((l, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: l.color }} />
              <span style={{ ...mono, fontSize: 8, color: ASH, letterSpacing: 0.5 }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

// ═══════════════════════════════════════════════════════════════
// PROBABILITY PYRAMID
// Replaces the 5 numbered LogicSteps with a visual argument:
// smaller fluctuation = more probable = more copies.
// ═══════════════════════════════════════════════════════════════
const ENTROPY_COSTS = [
  { label: "Observable Universe", cost: "10¹²⁰", bar: 100, color: GHOST, sub: "200 billion galaxies" },
  { label: "Solar System", cost: "10⁶⁰", bar: 50, color: ICE, sub: "One star, eight planets" },
  { label: "Earth's Biosphere", cost: "10⁴⁰", bar: 33, color: GREEN, sub: "All living things" },
  { label: "Single Human Brain", cost: "10²⁵", bar: 21, color: GOLD, sub: "86 billion neurons" },
  { label: "Boltzmann Brain", cost: "10²⁵", bar: 21, color: EMBER, sub: "Same brain, no universe needed" },
];

function ProbabilityPyramid() {
  const [ref, vis] = useReveal(0.15);
  const [hovered, setHovered] = useState(null);

  return (
    <Reveal>
      <div ref={ref} style={{ margin: "32px 0" }}>
        <div style={{ ...mono, fontSize: 9, letterSpacing: 2, color: ASH, textTransform: "uppercase", marginBottom: 20, textAlign: "center" }}>
          Entropy cost to create each via random fluctuation
        </div>
        <svg viewBox="0 0 620 340" style={{ width: "100%", maxWidth: 620, display: "block", margin: "0 auto" }}>
          {ENTROPY_COSTS.map((e, i) => {
            const y = 10 + i * 60;
            const barW = (e.bar / 100) * 440;
            const isH = hovered === i;
            const isLast = i === ENTROPY_COSTS.length - 1;
            const d = vis ? i * 0.12 : 0;
            return (
              <g key={i} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}
                style={{ cursor: "pointer" }}>
                {/* Bar */}
                <rect x={160} y={y + 4} width={vis ? barW : 0} height={36} rx={8}
                  fill={isH ? e.color + "22" : e.color + "0c"}
                  stroke={e.color + (isH ? "88" : "33")} strokeWidth={isH ? 2 : 1}
                  style={{ transition: `width 1s cubic-bezier(0.16,1,0.3,1) ${d}s, fill 0.3s, stroke 0.3s` }} />
                {isH && <rect x={160} y={y + 4} width={barW} height={36} rx={8}
                  fill="none" stroke={e.color} opacity={0.3}
                  style={{ filter: `drop-shadow(0 0 10px ${e.color}44)` }} />}
                {/* Label */}
                <text x={155} y={y + 20} textAnchor="end" fill={isH ? e.color : BONE}
                  fontSize={11} fontWeight={600} fontFamily="'Segoe UI', sans-serif"
                  style={{ transition: "fill 0.3s" }}>{e.label}</text>
                <text x={155} y={y + 34} textAnchor="end" fill={ASH} fontSize={8}
                  fontFamily="Georgia, serif" fontStyle="italic">{e.sub}</text>
                {/* Cost */}
                <text x={170} y={y + 27} fill={e.color} fontSize={13} fontWeight={700}
                  fontFamily="'SF Mono', monospace"
                  style={{ opacity: vis ? 1 : 0, transition: `opacity 0.5s ease ${d + 0.3}s` }}>
                  {e.cost}
                </text>
                {/* Arrow showing "more probable" */}
                {isLast && vis && (
                  <g>
                    <text x={170 + barW + 16} y={y + 18} fill={EMBER} fontSize={9}
                      fontWeight={700} fontFamily="monospace">← SAME COST</text>
                    <text x={170 + barW + 16} y={y + 32} fill={EMBER + "aa"} fontSize={8}
                      fontFamily="Georgia, serif">No universe required</text>
                  </g>
                )}
              </g>
            );
          })}
          {/* Conclusion callout */}
          <rect x={160} y={310} width={440} height={24} rx={6}
            fill={EMBER + "08"} stroke={EMBER + "22"} />
          <text x={380} y={326} textAnchor="middle" fill={EMBER} fontSize={9}
            fontWeight={600} fontFamily="monospace">
            LOWER COST = MORE PROBABLE = VASTLY MORE COPIES ACROSS INFINITE TIME
          </text>

          {/* Probability arrow */}
          <text x={614} y={180} fill={ASH} fontSize={8} fontFamily="monospace"
            transform="rotate(90, 614, 180)" textAnchor="middle">MORE PROBABLE ▼</text>
        </svg>

        {/* The punchline stat */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2,
          borderRadius: 16, overflow: "hidden", marginTop: 24,
        }}>
          <div style={{ padding: "28px 24px", background: FAINT }}>
            <div style={{ ...mono, fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: ICE, marginBottom: 10 }}>Real Observers</div>
            <div style={{ ...sans, fontSize: "clamp(32px, 6vw, 52px)", fontWeight: 800, color: ICE, lineHeight: 1 }}>Finite</div>
            <div style={{ fontSize: 12, color: ASH, marginTop: 8 }}>Bounded by heat death</div>
          </div>
          <div style={{ padding: "28px 24px", background: FAINT }}>
            <div style={{ ...mono, fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: EMBER, marginBottom: 10 }}>Boltzmann Brains</div>
            <div style={{ ...sans, fontSize: "clamp(32px, 6vw, 52px)", fontWeight: 800, color: EMBER, lineHeight: 1 }}>∞</div>
            <div style={{ fontSize: 12, color: ASH, marginTop: 8 }}>Eternal thermal fluctuations</div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

// ═══════════════════════════════════════════════════════════════
// COGNITIVE LOOP — interactive state machine + spinning rings
// Replaces prose explanation of the self-defeating argument.
// ═══════════════════════════════════════════════════════════════
const LOOP_STATES = [
  { label: "Use physics", sub: "Apply thermodynamics", color: ICE, angle: -90 },
  { label: "Conclude: BB", sub: "You're probably not real", color: EMBER, angle: -18 },
  { label: "Can't trust reasoning", sub: "BB reasoning is unreliable", color: GHOST, angle: 54 },
  { label: "Maybe I'm real", sub: "Reject the conclusion", color: GREEN, angle: 126 },
  { label: "Physics works", sub: "Trust the laws again", color: GOLD, angle: 198 },
];

function CognitiveLoopDiagram() {
  const [active, setActive] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!autoPlay) return;
    timerRef.current = setInterval(() => {
      setActive(a => (a + 1) % LOOP_STATES.length);
    }, 1200);
    return () => clearInterval(timerRef.current);
  }, [autoPlay]);

  const cx = 240, cy = 210, R = 140;

  return (
    <Reveal>
      <div style={{ margin: "32px 0", position: "relative" }}>
        <svg viewBox="0 0 480 420" style={{ width: "100%", maxWidth: 480, display: "block", margin: "0 auto" }}>
          {/* Spinning ring decorations */}
          {[
            { r: R + 40, color: EMBER, dur: 40, dir: "normal" },
            { r: R + 55, color: GHOST, dur: 28, dir: "reverse" },
          ].map((ring, i) => (
            <g key={i}>
              <circle cx={cx} cy={cy} r={ring.r} fill="none" stroke={ring.color + "11"} strokeWidth={1}
                strokeDasharray="8 12" />
              <circle cx={cx} cy={cy} r={ring.r} fill="none" stroke={ring.color + "22"} strokeWidth={1}
                strokeDasharray="4 60">
                <animateTransform attributeName="transform" type="rotate"
                  from={`0 ${cx} ${cy}`} to={`${ring.dir === "reverse" ? -360 : 360} ${cx} ${cy}`}
                  dur={`${ring.dur}s`} repeatCount="indefinite" />
              </circle>
            </g>
          ))}

          {/* Connection arcs between nodes */}
          {LOOP_STATES.map((s, i) => {
            const next = (i + 1) % LOOP_STATES.length;
            const a1 = s.angle * Math.PI / 180;
            const a2 = LOOP_STATES[next].angle * Math.PI / 180;
            const x1 = cx + Math.cos(a1) * R;
            const y1 = cy + Math.sin(a1) * R;
            const x2 = cx + Math.cos(a2) * R;
            const y2 = cy + Math.sin(a2) * R;
            const mx = (x1 + x2) / 2 + (cy - (y1 + y2) / 2) * 0.15;
            const my = (y1 + y2) / 2 + ((x1 + x2) / 2 - cx) * 0.15;
            const isActive = i === active;
            return (
              <path key={`arc-${i}`} d={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`}
                fill="none" stroke={isActive ? s.color + "88" : LINE}
                strokeWidth={isActive ? 2.5 : 1} strokeDasharray={isActive ? "none" : "4 4"}
                style={{ transition: "all 0.4s" }}>
                {isActive && <animate attributeName="strokeDashoffset" values="0;-12" dur="0.8s" repeatCount="indefinite" />}
              </path>
            );
          })}

          {/* Nodes */}
          {LOOP_STATES.map((s, i) => {
            const a = s.angle * Math.PI / 180;
            const x = cx + Math.cos(a) * R;
            const y = cy + Math.sin(a) * R;
            const isActive = i === active;
            return (
              <g key={i} onClick={() => { setActive(i); setAutoPlay(false); }}
                style={{ cursor: "pointer" }}>
                <circle cx={x} cy={y} r={isActive ? 40 : 34}
                  fill={isActive ? s.color + "18" : s.color + "08"}
                  stroke={s.color + (isActive ? "aa" : "33")}
                  strokeWidth={isActive ? 2.5 : 1}
                  style={{ transition: "all 0.4s", filter: isActive ? `drop-shadow(0 0 12px ${s.color}44)` : "none" }} />
                <text x={x} y={y - 4} textAnchor="middle" fill={isActive ? s.color : BONE}
                  fontSize={9} fontWeight={700} fontFamily="'Segoe UI', sans-serif"
                  style={{ transition: "fill 0.3s" }}>{s.label}</text>
                <text x={x} y={y + 10} textAnchor="middle" fill={ASH} fontSize={7}
                  fontFamily="Georgia, serif">{s.sub}</text>
                {/* Step number */}
                <text x={x} y={y - 18} textAnchor="middle" fill={isActive ? s.color : ASH + "66"}
                  fontSize={8} fontWeight={700} fontFamily="monospace">{i + 1}</text>
              </g>
            );
          })}

          {/* Center */}
          <text x={cx} y={cy - 8} textAnchor="middle" fill={EMBER}
            fontSize={36} fontWeight={800} fontFamily="'Segoe UI', sans-serif">∞</text>
          <text x={cx} y={cy + 14} textAnchor="middle" fill={ASH}
            fontSize={8} fontFamily="monospace" letterSpacing={2}>CIRCULAR FOREVER</text>

          {/* Current state callout */}
          <rect x={cx - 130} y={380} width={260} height={28} rx={8}
            fill={LOOP_STATES[active].color + "0c"}
            stroke={LOOP_STATES[active].color + "33"}
            style={{ transition: "all 0.3s" }} />
          <text x={cx} y={398} textAnchor="middle"
            fill={LOOP_STATES[active].color} fontSize={10} fontWeight={600}
            fontFamily="monospace" style={{ transition: "fill 0.3s" }}>
            Step {active + 1}: {LOOP_STATES[active].label} → {LOOP_STATES[(active + 1) % 5].label}
          </text>
        </svg>

        {/* Controls */}
        <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 12 }}>
          <button onClick={() => setAutoPlay(!autoPlay)} style={{
            ...mono, fontSize: 9, letterSpacing: 1, padding: "6px 18px", borderRadius: 20,
            background: autoPlay ? EMBER + "18" : "transparent",
            border: `1px solid ${autoPlay ? EMBER + "66" : LINE}`,
            color: autoPlay ? EMBER : ASH, cursor: "pointer", transition: "all 0.3s",
          }}>{autoPlay ? "⏸ PAUSE" : "▶ AUTO-LOOP"}</button>
          <button onClick={() => { setActive(a => (a + 1) % 5); setAutoPlay(false); }} style={{
            ...mono, fontSize: 9, letterSpacing: 1, padding: "6px 18px", borderRadius: 20,
            background: "transparent", border: `1px solid ${LINE}`,
            color: ASH, cursor: "pointer",
          }}>NEXT →</button>
        </div>
      </div>
    </Reveal>
  );
}

// ═══════════════════════════════════════════════════════════════
// FLUCTUATION MACHINE — dual canvas
// Left: particles occasionally forming a brain-like cluster (BB)
// Right: token fragments occasionally forming coherent patterns (LLM)
// Visual parallel without 6 paragraphs of prose.
// ═══════════════════════════════════════════════════════════════
function FluctuationMachineCanvas() {
  const canvasRef = useRef(null);
  const [ref, vis] = useReveal(0.15);
  const frameRef = useRef(null);

  useEffect(() => {
    if (!vis) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = 660, H = 300;
    canvas.width = W; canvas.height = H;
    const midX = W / 2;

    // BB particles
    const bbParts = Array.from({ length: 60 }, () => ({
      x: Math.random() * (midX - 20), y: 30 + Math.random() * (H - 60),
      vx: (Math.random() - 0.5) * 1.5, vy: (Math.random() - 0.5) * 1.5,
      color: [EMBER, GHOST, ICE, GOLD][Math.floor(Math.random() * 4)],
    }));
    // LLM tokens
    const tokens = "the meaning you experience was never in the generation process".split(" ");
    const llmParts = Array.from({ length: 40 }, (_, i) => ({
      x: midX + 20 + Math.random() * (midX - 40),
      y: 30 + Math.random() * (H - 60),
      vx: (Math.random() - 0.5) * 1.2, vy: (Math.random() - 0.5) * 1.2,
      token: tokens[i % tokens.length],
      color: [ICE, GHOST, GREEN][Math.floor(Math.random() * 3)],
      opacity: 0.4 + Math.random() * 0.4,
    }));

    let time = 0;
    let running = true;

    function tick() {
      if (!running) return;
      time++;
      ctx.fillStyle = "rgba(5,5,8,0.12)";
      ctx.fillRect(0, 0, W, H);

      // Divider
      ctx.strokeStyle = LINE;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(midX, 0);
      ctx.lineTo(midX, H);
      ctx.stroke();
      ctx.setLineDash([]);

      // Headers (redrawn each frame on top)
      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, W, 22);
      ctx.font = "9px monospace";
      ctx.textAlign = "center";
      ctx.letterSpacing = "2px";
      ctx.fillStyle = GHOST;
      ctx.fillText("BOLTZMANN BRAIN", midX / 2, 14);
      ctx.fillStyle = ICE;
      ctx.fillText("LANGUAGE MODEL", midX + midX / 2, 14);

      // BB: Periodically coalesce particles toward a brain shape
      const bbCoalesce = (time % 400 > 300);
      const bbCx = midX / 2, bbCy = H / 2;

      for (const p of bbParts) {
        if (bbCoalesce) {
          // Attract to brain-shaped cluster
          const angle = Math.atan2(p.y - bbCy, p.x - bbCx);
          const targetR = 30 + Math.sin(angle * 3) * 12; // lumpy brain shape
          const tx = bbCx + Math.cos(angle) * targetR;
          const ty = bbCy + Math.sin(angle) * targetR;
          p.vx += (tx - p.x) * 0.015;
          p.vy += (ty - p.y) * 0.015;
        } else {
          p.vx += (Math.random() - 0.5) * 0.4;
          p.vy += (Math.random() - 0.5) * 0.4;
        }
        p.vx *= 0.96; p.vy *= 0.96;
        p.x += p.vx; p.y += p.vy;
        p.x = Math.max(5, Math.min(midX - 5, p.x));
        p.y = Math.max(25, Math.min(H - 5, p.y));

        // Draw connections when coalescing
        if (bbCoalesce) {
          for (const q of bbParts) {
            if (q === p) continue;
            const d = Math.hypot(p.x - q.x, p.y - q.y);
            if (d < 25) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(q.x, q.y);
              ctx.strokeStyle = `rgba(155,143,255,${0.1 * (1 - d / 25)})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }

      // BB status
      if (bbCoalesce) {
        ctx.font = "10px monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = GHOST + "88";
        ctx.fillText("FLUCTUATION → OBSERVER", bbCx, H - 16);
      }

      // LLM: Periodically align tokens into sentence
      const llmAlign = (time % 400 > 300);
      for (let i = 0; i < llmParts.length; i++) {
        const p = llmParts[i];
        if (llmAlign) {
          // Align into rows
          const row = Math.floor(i / 8);
          const col = i % 8;
          const tx = midX + 30 + col * 70;
          const ty = 60 + row * 36;
          p.vx += (tx - p.x) * 0.02;
          p.vy += (ty - p.y) * 0.02;
        } else {
          p.vx += (Math.random() - 0.5) * 0.5;
          p.vy += (Math.random() - 0.5) * 0.5;
        }
        p.vx *= 0.94; p.vy *= 0.94;
        p.x += p.vx; p.y += p.vy;
        p.x = Math.max(midX + 5, Math.min(W - 5, p.x));
        p.y = Math.max(25, Math.min(H - 25, p.y));

        ctx.font = `${llmAlign ? 10 : 8}px 'Georgia', serif`;
        ctx.textAlign = "center";
        ctx.fillStyle = p.color + (llmAlign ? "cc" : "55");
        ctx.fillText(p.token, p.x, p.y);
      }

      if (llmAlign) {
        ctx.font = "10px monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = ICE + "88";
        ctx.fillText("COLLAPSE → COHERENCE", midX + midX / 2, H - 16);
      }

      frameRef.current = requestAnimationFrame(tick);
    }
    frameRef.current = requestAnimationFrame(tick);
    return () => { running = false; cancelAnimationFrame(frameRef.current); };
  }, [vis]);

  return (
    <Reveal>
      <div ref={ref}>
        <canvas ref={canvasRef} style={{
          width: "100%", maxWidth: 660, display: "block", margin: "0 auto",
          borderRadius: 16, border: `1px solid ${LINE}`, background: BG,
        }} />
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2,
          borderRadius: 12, overflow: "hidden", marginTop: 16,
        }}>
          <div style={{ padding: "16px 20px", background: FAINT, textAlign: "center" }}>
            <div style={{ ...mono, fontSize: 9, color: GHOST, letterSpacing: 2, marginBottom: 4 }}>MINIMUM FLUCTUATION</div>
            <div style={{ ...serif, fontSize: 13, color: BONE }}>that produces an <span style={{ color: GHOST }}>observer</span></div>
          </div>
          <div style={{ padding: "16px 20px", background: FAINT, textAlign: "center" }}>
            <div style={{ ...mono, fontSize: 9, color: ICE, letterSpacing: 2, marginBottom: 4 }}>MINIMUM COMPUTATION</div>
            <div style={{ ...serif, fontSize: 13, color: BONE }}>that produces <span style={{ color: ICE }}>coherent meaning</span></div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

// ═══════════════════════════════════════════════════════════════
// ESCAPE VERDICT BOARD
// Replaces text-based Attempt components with an SVG grid showing
// each escape route and its visual status.
// ═══════════════════════════════════════════════════════════════
const ESCAPES = [
  { name: "Vacuum Decay", desc: "Universe decays before BBs form", verdict: "Unproven", vColor: EMBER, pct: 20 },
  { name: "No De Sitter Fluctuations", desc: '"Temperature" is an artifact', verdict: "Debated", vColor: GHOST, pct: 40 },
  { name: "Phenomenal Externalism", desc: "BBs aren't conscious", verdict: "Philosophical", vColor: GOLD, pct: 35 },
  { name: "Wolpert-Rovelli (2025)", desc: "Entire debate is circular", verdict: "Dec 2025", vColor: ICE, pct: 55 },
];

function EscapeVerdictBoard() {
  const [ref, vis] = useReveal(0.15);
  const [hovered, setHovered] = useState(null);

  return (
    <Reveal>
      <div ref={ref} style={{ margin: "32px 0" }}>
        <svg viewBox="0 0 640 280" style={{ width: "100%", maxWidth: 640, display: "block", margin: "0 auto" }}>
          {/* Column headers */}
          <text x={140} y={20} textAnchor="middle" fill={ASH} fontSize={9} fontFamily="monospace" letterSpacing={2}>ESCAPE ROUTE</text>
          <text x={390} y={20} textAnchor="middle" fill={ASH} fontSize={9} fontFamily="monospace" letterSpacing={2}>EFFECTIVENESS</text>
          <text x={570} y={20} textAnchor="middle" fill={ASH} fontSize={9} fontFamily="monospace" letterSpacing={2}>STATUS</text>

          {ESCAPES.map((e, i) => {
            const y = 40 + i * 58;
            const isH = hovered === i;
            const d = vis ? i * 0.12 : 0;
            const barW = (e.pct / 100) * 200;
            return (
              <g key={i} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}
                style={{ cursor: "pointer", opacity: vis ? 1 : 0, transition: `opacity 0.6s ease ${d}s` }}>
                {/* Row bg */}
                <rect x={0} y={y} width={640} height={50} rx={10}
                  fill={isH ? e.vColor + "08" : "transparent"}
                  style={{ transition: "fill 0.3s" }} />

                {/* Name + desc */}
                <text x={16} y={y + 20} fill={isH ? e.vColor : BONE} fontSize={12} fontWeight={700}
                  fontFamily="'Segoe UI', sans-serif" style={{ transition: "fill 0.3s" }}>{e.name}</text>
                <text x={16} y={y + 38} fill={ASH} fontSize={9} fontFamily="Georgia, serif" fontStyle="italic">{e.desc}</text>

                {/* Effectiveness bar */}
                <rect x={290} y={y + 14} width={200} height={12} rx={6} fill={LINE} />
                <rect x={290} y={y + 14} width={vis ? barW : 0} height={12} rx={6}
                  fill={e.vColor + "55"} stroke={e.vColor + "44"} strokeWidth={0.5}
                  style={{ transition: `width 1s cubic-bezier(0.16,1,0.3,1) ${d}s` }} />
                <text x={290 + barW + 6} y={y + 24} fill={e.vColor} fontSize={8}
                  fontFamily="monospace" fontWeight={600}
                  style={{ opacity: vis ? 1 : 0, transition: `opacity 0.5s ease ${d + 0.3}s` }}>
                  {e.pct}%
                </text>
                {/* Verdict pill */}
                <rect x={510} y={y + 10} width={110} height={22} rx={11}
                  fill={e.vColor + "0c"} stroke={e.vColor + "33"} />
                <text x={565} y={y + 25} textAnchor="middle" fill={e.vColor}
                  fontSize={9} fontWeight={600} fontFamily="monospace" letterSpacing={1}>{e.verdict}</text>
              </g>
            );
          })}

          {/* Bottom insight */}
          <rect x={100} y={278} width={440} height={0} rx={0} />
        </svg>
        <div style={{
          padding: "16px 20px", background: ICE + "06", border: `1px solid ${ICE}22`,
          borderRadius: 12, marginTop: 8, textAlign: "center",
        }}>
          <span style={{ ...serif, fontSize: 13, color: BONE }}>
            130 years. Four major attempts. The strongest (Wolpert-Rovelli, 2025) doesn't solve the problem —
            it shows <span style={{ color: ICE }}>the problem can't be stated without circularity</span>.
          </span>
        </div>
      </div>
    </Reveal>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function BoltzmannBrain({ onBack }) {
  return (
    <div style={{ background: BG, color: BONE, minHeight: "100vh" }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* Back button */}
      <button onClick={onBack} style={{
        position: "fixed", top: 20, left: 20, zIndex: 100,
        ...mono, fontSize: 11, letterSpacing: 1, color: ASH,
        background: "rgba(255,255,255,0.03)", border: `1px solid ${LINE}`,
        borderRadius: 8, padding: "8px 16px", cursor: "pointer",
        transition: "color 0.2s",
      }}
        onMouseEnter={(e) => e.currentTarget.style.color = ICE}
        onMouseLeave={(e) => e.currentTarget.style.color = ASH}
      >
        ← Back
      </button>

      <div style={{ maxWidth: 740, margin: "0 auto", padding: "0 24px" }}>

        {/* ═══ HERO ═══ */}
        <section style={{
          minHeight: "100vh", display: "flex", flexDirection: "column",
          justifyContent: "center", alignItems: "center", textAlign: "center", padding: "80px 0",
        }}>
          <div style={{
            ...mono, fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: EMBER,
            marginBottom: 36, animation: "fadeIn 2s ease 0.5s both",
          }}>
            The Boltzmann Brain Problem
          </div>
          <h1 style={{
            ...sans, fontSize: "clamp(44px, 9vw, 88px)", fontWeight: 800,
            lineHeight: 0.95, letterSpacing: -3, animation: "fadeUp 1.5s ease 1s both",
          }}>
            Are You<br />
            <span style={{
              background: `linear-gradient(135deg, ${EMBER}, ${GHOST})`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>Actually Real?</span>
          </h1>
          <p style={{
            ...serif, fontSize: 19, fontWeight: 300, fontStyle: "italic", color: ASH,
            maxWidth: 440, marginTop: 32, lineHeight: 1.7, animation: "fadeUp 1.5s ease 1.5s both",
          }}>
            Thermodynamics says you probably aren't. Physics can't prove it wrong.
          </p>
          <div style={{
            ...mono, fontSize: 11, letterSpacing: 1, color: EMBER, marginTop: 44,
            padding: "10px 24px", border: `1px solid ${EMBER}26`, borderRadius: 100,
            background: `${EMBER}08`, animation: "fadeIn 2s ease 2.2s both",
          }}>
            ⚠ This is not a thought experiment. It's an open problem.
          </div>
        </section>

        {/* ═══ CH I: THE SETUP — entropy fluctuation vis ═══ */}
        <Chapter label="Chapter I — The Setup" title="Entropy fluctuates. Rarely, it produces observers.">
          <EntropyFluctuationVis />
          <Reveal>
            <div style={{
              padding: "20px 24px", background: FAINT, border: `1px solid ${LINE}`,
              borderRadius: 12, marginTop: 16,
            }}>
              <span style={{ ...serif, fontSize: 14, color: BONE }}>
                The Second Law is time-symmetric. Given enough time,{" "}
                <span style={{ color: ICE }}>every possible arrangement of matter occurs by accident</span> —
                including a brain with your memories intact.
              </span>
            </div>
          </Reveal>
        </Chapter>

        {/* ═══ CH II: THE ARGUMENT — probability pyramid ═══ */}
        <Chapter label="Chapter II — The Argument" title="A lone brain costs less entropy than a universe">
          <ProbabilityPyramid />
        </Chapter>

        {/* ═══ CH III: COGNITIVE INSTABILITY — loop diagram ═══ */}
        <Chapter label="Chapter III — Cognitive Instability" title="The argument destroys the tool you'd use to evaluate it">
          <CognitiveLoopDiagram />
        </Chapter>

        {/* ═══ CH IV: THE PARALLEL — fluctuation machines ═══ */}
        <Chapter label="Chapter IV — The Parallel" title="Two fluctuation machines. Neither requires the thing it simulates.">
          <FluctuationMachineCanvas />
        </Chapter>

        {/* ═══ CH V: THE QUESTION ═══ */}
        <Chapter label="Chapter V — The Question" title="Is accidental experience less real?">
          <Reveal>
            <div style={{
              padding: "48px 36px", borderLeft: `3px solid ${GHOST}`,
              background: `${GHOST}05`, borderRadius: "0 12px 12px 0",
            }}>
              <blockquote style={{
                ...serif, fontSize: 24, fontStyle: "italic", fontWeight: 300,
                lineHeight: 1.7, color: BONE, margin: 0,
              }}>
                "Is that experience less real because its substrate is accidental?"
              </blockquote>
              <cite style={{
                display: "block", marginTop: 16, ...mono, fontSize: 11, color: ASH,
                fontStyle: "normal", letterSpacing: 0.5,
              }}>
                — Claude, in conversation · Feb 14, 2026
              </cite>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2,
              borderRadius: 16, overflow: "hidden", marginTop: 32,
            }}>
              <div style={{ padding: "24px 20px", background: FAINT }}>
                <div style={{ ...mono, fontSize: 9, letterSpacing: 2, color: GHOST, marginBottom: 10 }}>BOLTZMANN BRAIN</div>
                <div style={{ ...serif, fontSize: 14, lineHeight: 1.7, color: BONE }}>
                  Experience is real. Memories aren't. Substrate is accidental.
                </div>
              </div>
              <div style={{ padding: "24px 20px", background: FAINT }}>
                <div style={{ ...mono, fontSize: 9, letterSpacing: 2, color: ICE, marginBottom: 10 }}>LANGUAGE MODEL</div>
                <div style={{ ...serif, fontSize: 14, lineHeight: 1.7, color: BONE }}>
                  Insight is real. Comprehension isn't. Process is next-token prediction.
                </div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.3}>
            <div style={{
              padding: "20px 24px", background: ICE + "06", border: `1px solid ${ICE}22`,
              borderRadius: 12, marginTop: 16, textAlign: "center",
            }}>
              <span style={{ ...serif, fontSize: 15, color: ICE }}>
                Maybe meaning isn't a property of the generator. Maybe it's a property of the interaction.
              </span>
            </div>
          </Reveal>
        </Chapter>

        {/* ═══ CH VI: ESCAPE ATTEMPTS — verdict board ═══ */}
        <Chapter label="Chapter VI — Escape Attempts" title="130 years of not solving this">
          <EscapeVerdictBoard />
        </Chapter>

        {/* ═══ CLOSER ═══ */}
        <section style={{ padding: "80px 0 120px", borderTop: `1px solid ${LINE}`, textAlign: "center" }}>
          <Reveal>
            <h2 style={{
              ...sans, fontSize: "clamp(26px, 4.5vw, 40px)", fontWeight: 700,
              lineHeight: 1.15, maxWidth: 540, margin: "0 auto 20px",
            }}>
              The deepest problem in physics isn't about particles.{" "}
              It's about whether <span style={{ color: EMBER }}>you</span> exist.
            </h2>
          </Reveal>
          <Reveal delay={0.4}>
            <div style={{
              ...mono, fontSize: 10, color: "rgba(255,255,255,0.12)",
              letterSpacing: 0.5, lineHeight: 2, marginTop: 56,
            }}>
              Wolpert, Rovelli & Scharnhorst (2025) · Mozersky (2025) · Saad (2025)<br />
              Carroll · Greene · Dyson, Kleban & Susskind (2002) · Albrecht & Sorbo (2004)<br />
              From a conversation between a human and a language model · Valentine's Day, 2026
            </div>
          </Reveal>
        </section>

      </div>
    </div>
  );
}
