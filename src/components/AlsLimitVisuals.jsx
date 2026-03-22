import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════
   AL'S LIMIT — Visualization subcomponents
   ═══════════════════════════════════════════════════════════════ */

export const BG = "#050508";
export const BONE = "#e8e4dc";
export const ASH = "#4a4860";
export const ICE = "#6ee7f0";
export const EMBER = "#ff4d2e";
export const GHOST = "#9b8fff";
export const GOLD = "#fbbf24";
export const GREEN = "#34d399";
export const FAINT = "rgba(255,255,255,0.03)";
export const LINE = "rgba(255,255,255,0.06)";

export const sans = { fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif" };
export const serif = { fontFamily: "Georgia, 'Times New Roman', serif" };
export const mono = { fontFamily: "'SF Mono', 'Cascadia Code', 'Consolas', monospace" };

export const TIERS = [
  {
    id: 0, label: "Type 0", name: "Solo Cognitive Range", color: GREEN,
    nodeCount: 8, edgeDensity: 0.4,
    aiRole: "Autocomplete", aiExample: "Copilot finishing lines",
    description: "One person holds the full system in their head. Complexity bounded by individual working memory.",
    conwaysLaw: "No Conway's Law. The architecture IS the developer's mental model.",
    ceiling: "You hit the wall when context-switching costs exceed your working memory.",
    effortToImpact: 0.9, icon: "◉",
  },
  {
    id: 1, label: "Type I", name: "Team Cognitive Range", color: ICE,
    nodeCount: 32, edgeDensity: 0.15,
    aiRole: "Cross-module reasoning", aiExample: "Navigating codebases no individual fully grasps",
    description: "No single person understands the whole system. Shared mental models, documentation, conventions.",
    conwaysLaw: "Conway's Law kicks in. Team boundaries become architecture boundaries.",
    ceiling: "You hit the wall when coordination cost exceeds the value of coordination.",
    effortToImpact: 0.55, icon: "◎",
  },
  {
    id: 2, label: "Type II", name: "Institutional Cognitive Range", color: GHOST,
    nodeCount: 96, edgeDensity: 0.06,
    aiRole: "Modeling second-order effects", aiExample: "Predicting cascade failures across services no human team fully maps",
    description: "System exceeds any team's comprehension. Understood only statistically — metrics, observability, emergent behavior.",
    conwaysLaw: "Conway's Law becomes Conway's Fog. Nobody chose this architecture; it emerged.",
    ceiling: "You hit the wall when the system's behavior surprises its own operators.",
    effortToImpact: 0.25, icon: "◈",
  },
  {
    id: 3, label: "Type III", name: "Ecosystem Cognitive Range", color: EMBER,
    nodeCount: 220, edgeDensity: 0.025,
    aiRole: "The Limit", aiExample: "Bottleneck shifts from cognition to coordination across autonomous actors",
    description: "No single organization understands the system. The internet. Global financial stack. Supply chains.",
    conwaysLaw: "Conway's Law is everyone's law simultaneously. Architecture IS politics.",
    ceiling: "More intelligence doesn't solve consensus. This is the wall.",
    effortToImpact: 0.08, icon: "◆",
  },
];

// ── SCROLL REVEAL ──
export function useReveal(threshold = 0.12) {
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

export function Reveal({ children, delay = 0, style }) {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(32px)",
      transition: `all 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
      ...style,
    }}>
      {children}
    </div>
  );
}

export function Chapter({ label, title, children, color = GHOST }) {
  return (
    <section style={{ padding: "80px 0", borderTop: `1px solid ${LINE}` }}>
      <Reveal>
        <div style={{ ...mono, fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color, marginBottom: 16 }}>{label}</div>
        <h2 style={{ ...sans, fontSize: "clamp(26px, 4.5vw, 42px)", fontWeight: 700, lineHeight: 1.1, letterSpacing: -1, marginBottom: 32, maxWidth: 640 }}>{title}</h2>
      </Reveal>
      {children}
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// NETWORK CANVAS
// ═══════════════════════════════════════════════════════════════

function generateNetwork(tier, width, height) {
  const t = TIERS[tier];
  const nodes = [];
  const edges = [];
  const margin = 40;
  for (let i = 0; i < t.nodeCount; i++) {
    const angle = (i / t.nodeCount) * Math.PI * 2 + Math.random() * 0.5;
    const radius = (Math.min(width, height) / 2 - margin) * (0.3 + Math.random() * 0.6);
    nodes.push({
      x: width / 2 + Math.cos(angle) * radius,
      y: height / 2 + Math.sin(angle) * radius,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: 2 + Math.random() * (tier === 0 ? 4 : tier === 3 ? 1.5 : 2.5),
      pulse: Math.random() * Math.PI * 2,
    });
  }
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      if (Math.random() < t.edgeDensity) edges.push({ from: i, to: j });
    }
  }
  return { nodes, edges };
}

function NetworkCanvas({ tier, width, height, transitioning }) {
  const canvasRef = useRef(null);
  const networkRef = useRef(null);
  const frameRef = useRef(null);
  const timeRef = useRef(0);

  useEffect(() => {
    networkRef.current = generateNetwork(tier, width, height);
  }, [tier, width, height]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = width * 2;
    canvas.height = height * 2;
    ctx.scale(2, 2);
    let running = true;
    const t = TIERS[tier];

    function tick() {
      if (!running) return;
      timeRef.current += 0.016;
      const time = timeRef.current;
      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, width, height);
      const net = networkRef.current;
      if (!net) { frameRef.current = requestAnimationFrame(tick); return; }

      for (const node of net.nodes) {
        node.x += node.vx; node.y += node.vy; node.pulse += 0.02;
        if (node.x < 20 || node.x > width - 20) node.vx *= -1;
        if (node.y < 20 || node.y > height - 20) node.vy *= -1;
        node.vx += (width / 2 - node.x) * 0.0001;
        node.vy += (height / 2 - node.y) * 0.0001;
        node.vx *= 0.999; node.vy *= 0.999;
      }

      const maxDist = tier <= 1 ? 250 : 180;
      for (const edge of net.edges) {
        const a = net.nodes[edge.from], b = net.nodes[edge.to];
        const dx = b.x - a.x, dy = b.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > maxDist) continue;
        const alpha = (1 - dist / maxDist) * (tier === 0 ? 0.35 : tier === 3 ? 0.08 : 0.18);
        const pulse = Math.sin(time * 2 + edge.from * 0.3) * 0.5 + 0.5;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = t.color + Math.round(alpha * pulse * 255).toString(16).padStart(2, "0");
        ctx.lineWidth = tier === 0 ? 1.5 : 0.7;
        ctx.stroke();
      }

      for (const node of net.nodes) {
        const glow = Math.sin(node.pulse) * 0.3 + 0.7;
        const size = node.size * glow;
        ctx.beginPath(); ctx.arc(node.x, node.y, size * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = t.color + "08"; ctx.fill();
        ctx.beginPath(); ctx.arc(node.x, node.y, size, 0, Math.PI * 2);
        ctx.fillStyle = t.color + Math.round(glow * 200).toString(16).padStart(2, "0");
        ctx.fill();
      }

      if (transitioning) {
        const flash = Math.sin(time * 8) * 0.5 + 0.5;
        ctx.fillStyle = t.color + Math.round(flash * 15).toString(16).padStart(2, "0");
        ctx.fillRect(0, 0, width, height);
      }

      ctx.font = "10px monospace"; ctx.fillStyle = t.color + "60";
      ctx.textAlign = "left"; ctx.fillText(`${t.label} — ${t.name}`, 16, height - 14);
      ctx.textAlign = "right"; ctx.fillText(`${net.nodes.length} nodes · ${net.edges.length} edges`, width - 16, height - 14);
      frameRef.current = requestAnimationFrame(tick);
    }
    frameRef.current = requestAnimationFrame(tick);
    return () => { running = false; cancelAnimationFrame(frameRef.current); };
  }, [tier, width, height, transitioning]);

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block", borderRadius: 16 }} />;
}

// ═══════════════════════════════════════════════════════════════
// TIER EXPLORER
// ═══════════════════════════════════════════════════════════════

export function TierExplorer() {
  const [activeTier, setActiveTier] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [ref, vis] = useReveal(0.1);
  const containerRef = useRef(null);
  const [dims, setDims] = useState({ w: 700, h: 450 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = Math.min(entry.contentRect.width, 900);
      setDims({ w, h: Math.min(w * 0.6, 500) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const switchTier = useCallback((newTier) => {
    if (newTier === activeTier) return;
    setTransitioning(true);
    setTimeout(() => {
      setActiveTier(newTier);
      setTimeout(() => setTransitioning(false), 300);
    }, 150);
  }, [activeTier]);

  const tier = TIERS[activeTier];

  return (
    <div ref={ref}>
      <Reveal>
        <div ref={containerRef} style={{ position: "relative", margin: "0 auto", maxWidth: 900 }}>
          <div style={{ display: "flex", gap: 0, marginBottom: 0, borderRadius: "16px 16px 0 0", overflow: "hidden", border: `1px solid ${LINE}`, borderBottom: "none" }}>
            {TIERS.map((t) => (
              <button key={t.id} onClick={() => switchTier(t.id)} style={{
                flex: 1, padding: "14px 8px",
                background: activeTier === t.id ? t.color + "12" : "transparent",
                border: "none", borderRight: t.id < 3 ? `1px solid ${LINE}` : "none",
                cursor: "pointer", transition: "all 0.3s", position: "relative",
              }}>
                <div style={{ ...mono, fontSize: 10, letterSpacing: 2, color: activeTier === t.id ? t.color : ASH, textTransform: "uppercase", marginBottom: 2 }}>{t.label}</div>
                <div style={{ ...sans, fontSize: 11, color: activeTier === t.id ? BONE : ASH, fontWeight: activeTier === t.id ? 600 : 400 }}>{t.name}</div>
                {activeTier === t.id && <div style={{ position: "absolute", bottom: 0, left: "20%", right: "20%", height: 2, background: t.color, borderRadius: 1 }} />}
              </button>
            ))}
          </div>

          <div style={{ border: `1px solid ${LINE}`, borderRadius: "0 0 16px 16px", overflow: "hidden", background: BG, height: dims.h, position: "relative" }}>
            {vis && <NetworkCanvas tier={activeTier} width={dims.w} height={dims.h} transitioning={transitioning} />}
            {activeTier < 3 && (
              <div style={{ position: "absolute", top: 16, right: 16, background: "rgba(5,5,8,0.85)", border: `1px solid ${TIERS[activeTier + 1].color}33`, borderRadius: 12, padding: "10px 16px", maxWidth: 220, backdropFilter: "blur(8px)" }}>
                <div style={{ ...mono, fontSize: 8, letterSpacing: 2, color: EMBER, textTransform: "uppercase", marginBottom: 6 }}>Ceiling ahead</div>
                <div style={{ ...sans, fontSize: 11, color: "#94A3B8", lineHeight: 1.5 }}>{tier.ceiling}</div>
              </div>
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
            <div style={{ background: FAINT, border: `1px solid ${LINE}`, borderRadius: 16, padding: "20px 24px" }}>
              <div style={{ ...mono, fontSize: 9, letterSpacing: 2, color: tier.color, textTransform: "uppercase", marginBottom: 10 }}>{tier.icon} System State</div>
              <p style={{ ...serif, fontSize: 14, color: BONE, lineHeight: 1.7, margin: "0 0 14px" }}>{tier.description}</p>
              <p style={{ ...sans, fontSize: 12, color: ASH, lineHeight: 1.6, margin: 0, borderLeft: `2px solid ${tier.color}33`, paddingLeft: 12 }}>{tier.conwaysLaw}</p>
            </div>
            <div style={{ background: FAINT, border: `1px solid ${LINE}`, borderRadius: 16, padding: "20px 24px" }}>
              <div style={{ ...mono, fontSize: 9, letterSpacing: 2, color: tier.color, textTransform: "uppercase", marginBottom: 10 }}>AI Role at this tier</div>
              <div style={{ ...sans, fontSize: 20, fontWeight: 700, color: tier.color, marginBottom: 8 }}>{tier.aiRole}</div>
              <p style={{ ...serif, fontSize: 13, color: "#94A3B8", lineHeight: 1.6, margin: 0 }}>{tier.aiExample}</p>
              <div style={{ marginTop: 16 }}>
                <div style={{ ...mono, fontSize: 8, letterSpacing: 2, color: ASH, textTransform: "uppercase", marginBottom: 6 }}>Effort-to-impact ratio</div>
                <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 4, height: 8, overflow: "hidden" }}>
                  <div style={{ width: `${tier.effortToImpact * 100}%`, height: "100%", background: `linear-gradient(90deg, ${tier.color}, ${tier.color}88)`, borderRadius: 4, transition: "width 0.6s cubic-bezier(0.16,1,0.3,1)" }} />
                </div>
                <div style={{ ...mono, fontSize: 9, color: tier.color, marginTop: 4, textAlign: "right" }}>{Math.round(tier.effortToImpact * 100)}%</div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ENTROPY RATCHET
// ═══════════════════════════════════════════════════════════════

export function EntropyRatchet() {
  const [ref, vis] = useReveal(0.15);
  const [hovered, setHovered] = useState(null);

  const tiers = [
    { label: "Type 0", effort: 100, output: 90, color: GREEN, analogy: "Solo dev ships a feature in an afternoon" },
    { label: "Type I", effort: 100, output: 55, color: ICE, analogy: "Team spends a sprint on what solo dev did in hours" },
    { label: "Type II", effort: 100, output: 25, color: GHOST, analogy: "Org takes a quarter. Half the work is coordination." },
    { label: "Type III", effort: 100, output: 8, color: EMBER, analogy: "Industry consortium. Years. Most energy is governance." },
  ];

  return (
    <Reveal>
      <div ref={ref} style={{ maxWidth: 620, margin: "0 auto" }}>
        <div style={{ ...mono, fontSize: 9, letterSpacing: 2, color: ASH, textTransform: "uppercase", marginBottom: 20, textAlign: "center" }}>
          Same effort, shrinking output — the ratchet only turns one way
        </div>
        {tiers.map((t, i) => (
          <div key={t.label} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}
            style={{ marginBottom: 20, opacity: vis ? 1 : 0, transform: vis ? "translateX(0)" : "translateX(-24px)", transition: `all 0.6s ease ${i * 0.12}s`, cursor: "default" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
              <span style={{ ...mono, fontSize: 10, color: t.color, width: 50, letterSpacing: 1 }}>{t.label}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                  <span style={{ ...mono, fontSize: 8, color: ASH, width: 44 }}>EFFORT</span>
                  <div style={{ flex: 1, background: "rgba(255,255,255,0.05)", borderRadius: 3, height: 6 }}>
                    <div style={{ width: "100%", height: "100%", background: `${t.color}44`, borderRadius: 3 }} />
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ ...mono, fontSize: 8, color: ASH, width: 44 }}>OUTPUT</span>
                  <div style={{ flex: 1, background: "rgba(255,255,255,0.05)", borderRadius: 3, height: 6 }}>
                    <div style={{ width: `${t.output}%`, height: "100%", background: `linear-gradient(90deg, ${t.color}, ${t.color}88)`, borderRadius: 3, transition: "width 0.8s cubic-bezier(0.16,1,0.3,1)" }} />
                  </div>
                  <span style={{ ...mono, fontSize: 9, color: t.color, width: 28 }}>{t.output}%</span>
                </div>
              </div>
            </div>
            {hovered === i && <div style={{ ...serif, fontSize: 12, color: "#94A3B8", marginLeft: 62, fontStyle: "italic" }}>{t.analogy}</div>}
          </div>
        ))}
        <div style={{ ...serif, fontSize: 12, color: ASH, textAlign: "center", marginTop: 8, fontStyle: "italic" }}>
          Like Bitcoin mining: the hash rate climbs, the block reward halves.
        </div>
      </div>
    </Reveal>
  );
}

// ═══════════════════════════════════════════════════════════════
// CEILING BREAKER — Phase transition visualization
// ═══════════════════════════════════════════════════════════════

function CeilingCanvas({ phase, color }) {
  const canvasRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = 700, H = 240;
    canvas.width = W * 2; canvas.height = H * 2;
    ctx.scale(2, 2);
    let running = true, time = 0;

    const count = phase === 0 ? 24 : phase === 1 ? 48 : 120;
    const particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * (phase === 0 ? 0.3 : phase === 1 ? 2 : 0.8),
        vy: (Math.random() - 0.5) * (phase === 0 ? 0.3 : phase === 1 ? 2 : 0.8),
        size: phase === 0 ? 3 : phase === 2 ? 1.5 : 2,
      });
    }

    function tick() {
      if (!running) return;
      time += 0.016;
      ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H);

      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (phase === 0) {
          p.vx += Math.sin(time + p.y * 0.01) * 0.01;
          p.vy += Math.cos(time + p.x * 0.01) * 0.01;
          p.vx *= 0.98; p.vy *= 0.98;
        } else if (phase === 1) {
          p.vx += (Math.random() - 0.5) * 0.3;
          p.vy += (Math.random() - 0.5) * 0.3;
          p.vx *= 0.96; p.vy *= 0.96;
        } else {
          p.vx += (Math.random() - 0.5) * 0.15;
          p.vy += (Math.random() - 0.5) * 0.15;
          p.vx *= 0.97; p.vy *= 0.97;
        }
        if (p.x < 0) p.x += W; if (p.x > W) p.x -= W;
        if (p.y < 0) p.y += H; if (p.y > H) p.y -= H;
      }

      const maxDist = phase === 0 ? 80 : phase === 1 ? 60 : 40;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[j].x - particles[i].x, dy = particles[j].y - particles[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * (phase === 2 ? 0.08 : 0.2);
            ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = color + Math.round(alpha * 255).toString(16).padStart(2, "0");
            ctx.lineWidth = 0.5; ctx.stroke();
          }
        }
      }

      for (const p of particles) {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = color + "cc"; ctx.fill();
      }

      if (phase === 1) {
        const fracY = H / 2 + Math.sin(time * 3) * 10;
        ctx.beginPath(); ctx.setLineDash([4, 8]);
        for (let x = 0; x < W; x += 3) {
          const y = fracY + Math.sin(x * 0.05 + time * 5) * 8 + (Math.random() - 0.5) * 4;
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = GOLD + "88"; ctx.lineWidth = 2; ctx.stroke(); ctx.setLineDash([]);
        ctx.shadowColor = GOLD; ctx.shadowBlur = 20;
        ctx.strokeStyle = GOLD + "33"; ctx.lineWidth = 8; ctx.stroke(); ctx.shadowBlur = 0;
      }

      frameRef.current = requestAnimationFrame(tick);
    }
    frameRef.current = requestAnimationFrame(tick);
    return () => { running = false; cancelAnimationFrame(frameRef.current); };
  }, [phase, color]);

  return <canvas ref={canvasRef} style={{ width: "100%", maxWidth: 700, height: 240, display: "block", borderRadius: 12, border: `1px solid ${LINE}`, background: BG }} />;
}

export function CeilingBreaker() {
  const [phase, setPhase] = useState(0);
  const [ref] = useReveal(0.15);

  const phases = [
    { title: "Before the ceiling", description: "Everything works. Your approach scales. You're productive. You mistake local optimization for global understanding.", color: GREEN },
    { title: "The phase transition", description: "One more microservice. One more team. One more API consumer. The old mental model snaps. Suddenly nothing composes the way it used to.", color: GOLD },
    { title: "After the ceiling", description: "You're in the next regime. The previous approach isn't just suboptimal, it's structurally impossible. There is no going back.", color: EMBER },
  ];
  const p = phases[phase];

  return (
    <Reveal>
      <div ref={ref} style={{ maxWidth: 700, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 0, marginBottom: 24, borderRadius: 12, overflow: "hidden", border: `1px solid ${LINE}` }}>
          {phases.map((ph, i) => (
            <button key={i} onClick={() => setPhase(i)} style={{
              flex: 1, padding: "12px 8px", background: phase === i ? ph.color + "12" : "transparent",
              border: "none", borderRight: i < 2 ? `1px solid ${LINE}` : "none",
              cursor: "pointer", ...sans, fontSize: 12, color: phase === i ? ph.color : ASH,
              fontWeight: phase === i ? 600 : 400, transition: "all 0.3s",
            }}>{ph.title}</button>
          ))}
        </div>
        <CeilingCanvas phase={phase} color={p.color} />
        <div style={{ background: FAINT, border: `1px solid ${p.color}22`, borderRadius: 12, padding: "16px 20px", marginTop: 16, transition: "border-color 0.3s" }}>
          <p style={{ ...serif, fontSize: 14, color: BONE, lineHeight: 1.7, margin: 0 }}>{p.description}</p>
        </div>
      </div>
    </Reveal>
  );
}

// ═══════════════════════════════════════════════════════════════
// LIMIT REVEAL
// ═══════════════════════════════════════════════════════════════

export function LimitReveal() {
  const [revealed, setRevealed] = useState(false);
  const [ref, vis] = useReveal(0.2);

  useEffect(() => {
    if (vis) { const t = setTimeout(() => setRevealed(true), 1200); return () => clearTimeout(t); }
  }, [vis]);

  return (
    <div ref={ref} style={{ textAlign: "center", padding: "60px 0" }}>
      <div style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(20px)", transition: "all 0.8s ease" }}>
        <div style={{ ...mono, fontSize: 10, letterSpacing: 4, color: ICE, textTransform: "uppercase", marginBottom: 20 }}>The first limit</div>
        <h2 style={{ ...sans, fontSize: "clamp(36px, 6vw, 56px)", fontWeight: 800, color: BONE, letterSpacing: -2, margin: "0 0 8px" }}>Al's Limit</h2>
        <p style={{ ...serif, fontSize: 16, color: ASH, maxWidth: 480, margin: "0 auto 12px", lineHeight: 1.6 }}>
          The threshold where human cognition alone can no longer reach the next tier. Where you need augmentation just to stay in the game.
        </p>
        <p style={{ ...mono, fontSize: 11, color: ICE + "88" }}>Named for anyone who's felt the ceiling close in.</p>
      </div>

      <div style={{ width: 1, height: revealed ? 60 : 0, background: `linear-gradient(${EMBER}00, ${EMBER}, ${EMBER}00)`, margin: "32px auto", transition: "height 1s ease 0.3s" }} />

      <div style={{ opacity: revealed ? 1 : 0, transform: revealed ? "translateY(0)" : "translateY(20px)", transition: "all 1s ease 0.5s" }}>
        <div style={{ ...mono, fontSize: 10, letterSpacing: 4, color: EMBER, textTransform: "uppercase", marginBottom: 20 }}>The second limit</div>
        <h2 style={{ ...sans, fontSize: "clamp(36px, 6vw, 56px)", fontWeight: 800, color: BONE, letterSpacing: -2, margin: "0 0 8px" }}>AI's Limit</h2>
        <p style={{ ...serif, fontSize: 16, color: ASH, maxWidth: 480, margin: "0 auto 12px", lineHeight: 1.6 }}>
          Type III. The wall where even AI hits the ceiling. The bottleneck isn't cognition anymore. It's coordination across autonomous actors who don't share goals.
        </p>
        <p style={{ ...mono, fontSize: 11, color: EMBER + "88" }}>More intelligence doesn't solve consensus.</p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// TREADMILL VISUALIZATION
// ═══════════════════════════════════════════════════════════════

export function TreadmillVis() {
  const [ref, vis] = useReveal(0.15);
  const [activeTier, setActiveTier] = useState(0);

  useEffect(() => {
    if (!vis) return;
    const interval = setInterval(() => setActiveTier((prev) => (prev + 1) % 4), 2500);
    return () => clearInterval(interval);
  }, [vis]);

  const tier = TIERS[activeTier];
  const motorSizes = [1, 2.2, 4.5, 9];
  const speedLabels = ["10 km/h", "22 km/h", "45 km/h", "90 km/h"];

  return (
    <Reveal>
      <div ref={ref} style={{ maxWidth: 500, margin: "0 auto", textAlign: "center" }}>
        <div style={{ ...mono, fontSize: 9, letterSpacing: 2, color: ASH, textTransform: "uppercase", marginBottom: 24 }}>The treadmill doesn't stop</div>
        <div style={{ position: "relative", height: 120, marginBottom: 16 }}>
          {TIERS.map((t, i) => {
            const size = motorSizes[i] * 12;
            const isActive = i === activeTier;
            return (
              <div key={i} onClick={() => setActiveTier(i)} style={{
                position: "absolute", left: `${15 + i * 22}%`, bottom: 0,
                transform: `translateX(-50%) scale(${isActive ? 1.1 : 0.9})`,
                transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)",
                cursor: "pointer", opacity: isActive ? 1 : 0.4,
              }}>
                <div style={{
                  width: size, height: size, borderRadius: "50%",
                  border: `2px solid ${t.color}`, background: isActive ? t.color + "18" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.5s", margin: "0 auto 8px",
                }}>
                  <span style={{ ...mono, fontSize: Math.max(8, size / 5), color: t.color }}>{t.icon}</span>
                </div>
                <div style={{ ...mono, fontSize: 8, color: t.color, letterSpacing: 1 }}>{t.label}</div>
              </div>
            );
          })}
        </div>
        <div style={{ background: FAINT, border: `1px solid ${tier.color}22`, borderRadius: 12, padding: "12px 20px", transition: "border-color 0.3s" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ ...mono, fontSize: 10, color: ASH }}>BELT SPEED</span>
            <span style={{ ...mono, fontSize: 14, color: tier.color, fontWeight: 700 }}>{speedLabels[activeTier]}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
            <span style={{ ...mono, fontSize: 10, color: ASH }}>YOUR POSITION</span>
            <span style={{ ...sans, fontSize: 14, color: BONE, fontWeight: 600 }}>Same place.</span>
          </div>
        </div>
        <div style={{ ...serif, fontSize: 13, color: ASH, fontStyle: "italic", marginTop: 16 }}>It just gets a bigger motor.</div>
      </div>
    </Reveal>
  );
}

// ═══════════════════════════════════════════════════════════════
// LIBERATION TRAP
// ═══════════════════════════════════════════════════════════════

export function LiberationTrap() {
  const [ref, vis] = useReveal(0.15);

  const transitions = [
    { from: "Type 0", to: "Type I", liberation: "We can build bigger things!", trap: "Now nobody understands the whole thing.", fromColor: GREEN, toColor: ICE },
    { from: "Type I", to: "Type II", liberation: "AI can reason across modules for us!", trap: "Now the system exhibits emergent behavior nobody predicted.", fromColor: ICE, toColor: GHOST },
    { from: "Type II", to: "Type III", liberation: "AI can model institutional-scale effects!", trap: "Now the bottleneck is getting autonomous organizations to agree.", fromColor: GHOST, toColor: EMBER },
  ];

  return (
    <Reveal>
      <div ref={ref} style={{ maxWidth: 600, margin: "0 auto" }}>
        {transitions.map((t, i) => (
          <div key={i} style={{
            opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(20px)",
            transition: `all 0.6s ease ${i * 0.2}s`, marginBottom: 24,
          }}>
            <div style={{ display: "flex", alignItems: "stretch" }}>
              <div style={{ flex: 1, background: t.fromColor + "08", border: `1px solid ${t.fromColor}22`, borderRadius: "12px 0 0 12px", padding: "16px 18px" }}>
                <div style={{ ...mono, fontSize: 8, letterSpacing: 2, color: t.fromColor, textTransform: "uppercase", marginBottom: 6 }}>{t.from} ceiling breached</div>
                <div style={{ ...sans, fontSize: 13, color: GREEN, fontWeight: 600 }}>"{t.liberation}"</div>
              </div>
              <div style={{ width: 32, display: "flex", alignItems: "center", justifyContent: "center", background: `linear-gradient(90deg, ${t.fromColor}08, ${t.toColor}08)`, borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}` }}>
                <span style={{ ...mono, fontSize: 14, color: ASH }}>→</span>
              </div>
              <div style={{ flex: 1, background: t.toColor + "08", border: `1px solid ${t.toColor}22`, borderRadius: "0 12px 12px 0", padding: "16px 18px" }}>
                <div style={{ ...mono, fontSize: 8, letterSpacing: 2, color: EMBER, textTransform: "uppercase", marginBottom: 6 }}>{t.to} entropy unlocked</div>
                <div style={{ ...sans, fontSize: 13, color: EMBER, fontWeight: 600 }}>"{t.trap}"</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Reveal>
  );
}
