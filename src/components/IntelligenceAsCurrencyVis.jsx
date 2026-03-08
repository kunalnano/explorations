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

const sans = { fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif" };
const serif = { fontFamily: "Georgia, 'Times New Roman', serif" };
const mono = { fontFamily: "'SF Mono', 'Cascadia Code', 'Consolas', monospace" };

function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.unobserve(el); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, vis];
}

// ═══════════════════════════════════════════════════════
// THESIS I — DOUBLE HELIX
// ═══════════════════════════════════════════════════════
export function DoubleHelixVis() {
  const canvasRef = useRef(null);
  const [ref, vis] = useReveal(0.15);
  const frameRef = useRef(null);

  useEffect(() => {
    if (!vis) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = 660, H = 360;
    canvas.width = W; canvas.height = H;

    const particles = [];
    let time = 0;

    function draw() {
      time += 0.015;
      ctx.clearRect(0, 0, W, H);
      const cx = W / 2, amplitude = 80, segments = 120;

      for (let strand = 0; strand < 2; strand++) {
        const offset = strand * Math.PI;
        const color = strand === 0 ? GOLD : GHOST;

        ctx.beginPath();
        for (let i = 0; i <= segments; i++) {
          const t = i / segments;
          const y = H - 30 - t * (H - 60);
          const phase = t * Math.PI * 4 + time * 2 + offset;
          const x = cx + Math.sin(phase) * amplitude * (0.3 + t * 0.7);
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = color + "88";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        for (let i = 0; i <= segments; i++) {
          const t = i / segments;
          const y = H - 30 - t * (H - 60);
          const phase = t * Math.PI * 4 + time * 2 + offset;
          const x = cx + Math.sin(phase) * amplitude * (0.3 + t * 0.7);
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = color + "22";
        ctx.lineWidth = 6;
        ctx.stroke();
      }

      for (let i = 0; i < 12; i++) {
        const t = (i + 0.5) / 12;
        const y = H - 30 - t * (H - 60);
        const phase = t * Math.PI * 4 + time * 2;
        const x1 = cx + Math.sin(phase) * amplitude * (0.3 + t * 0.7);
        const x2 = cx + Math.sin(phase + Math.PI) * amplitude * (0.3 + t * 0.7);
        const depthDiff = Math.abs(Math.cos(phase) - Math.cos(phase + Math.PI));
        if (depthDiff < 1.2) {
          ctx.beginPath();
          ctx.moveTo(x1, y);
          ctx.lineTo(x2, y);
          ctx.strokeStyle = GREEN + Math.floor(30 + depthDiff * 20).toString(16).padStart(2, "0");
          ctx.lineWidth = 1;
          ctx.setLineDash([3, 4]);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      if (Math.random() < 0.3) {
        particles.push({ t: Math.random(), life: 0, maxLife: 60 + Math.random() * 40, strand: Math.random() > 0.5 ? 0 : 1 });
      }
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++; p.t += 0.003;
        if (p.life > p.maxLife || p.t > 1) { particles.splice(i, 1); continue; }
        const y = H - 30 - p.t * (H - 60);
        const phase = p.t * Math.PI * 4 + time * 2 + p.strand * Math.PI;
        const x = cx + Math.sin(phase) * amplitude * (0.3 + p.t * 0.7);
        const alpha = Math.min(1, p.life / 10) * Math.max(0, 1 - p.life / p.maxLife);
        ctx.beginPath();
        ctx.arc(x, y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = (p.strand === 0 ? GOLD : GHOST) + Math.floor(alpha * 180).toString(16).padStart(2, "0");
        ctx.fill();
      }

      ctx.font = "10px 'SF Mono', monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = GOLD;
      ctx.fillText("HUMAN SKILL", cx - amplitude - 40, H - 10);
      ctx.fillStyle = GHOST;
      ctx.fillText("AI CAPABILITY", cx + amplitude + 40, H - 10);
      ctx.fillStyle = GREEN;
      ctx.fillText("COMPOUNDING", cx, 16);

      frameRef.current = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(frameRef.current);
  }, [vis]);

  return (
    <div ref={ref}>
      <div style={{ borderRadius: 16, overflow: "hidden", border: `1px solid ${LINE}`, background: BG }}>
        <canvas ref={canvasRef} style={{ width: "100%", height: 360, display: "block" }} />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// THESIS II — DATA OCEAN
// ═══════════════════════════════════════════════════════
export function DataOceanVis() {
  const canvasRef = useRef(null);
  const [ref, vis] = useReveal(0.15);
  const frameRef = useRef(null);

  useEffect(() => {
    if (!vis) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = 660, H = 320;
    canvas.width = W; canvas.height = H;
    let time = 0;

    function draw() {
      time += 0.02;
      ctx.clearRect(0, 0, W, H);

      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, "#0a0a18");
      grad.addColorStop(0.4, "#060620");
      grad.addColorStop(1, "#020210");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      for (let i = 0; i < 80; i++) {
        const x = (i * 73 + time * 10) % W;
        const y = 140 + (i * 37 % 160);
        const pulse = Math.sin(time * 2 + i) * 0.5 + 0.5;
        ctx.beginPath();
        ctx.arc(x, y, 1 + pulse, 0, Math.PI * 2);
        ctx.fillStyle = ICE + Math.floor(10 + pulse * 25).toString(16).padStart(2, "0");
        ctx.fill();
      }

      ctx.beginPath();
      ctx.moveTo(0, 130);
      for (let x = 0; x <= W; x += 4) {
        const y = 130 + Math.sin(x * 0.01 + time) * 8 + Math.sin(x * 0.025 + time * 1.5) * 4;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(W, 0); ctx.lineTo(0, 0); ctx.closePath();
      ctx.fillStyle = "#0a0a18";
      ctx.fill();

      ctx.beginPath();
      for (let x = 0; x <= W; x += 2) {
        const y = 130 + Math.sin(x * 0.01 + time) * 8 + Math.sin(x * 0.025 + time * 1.5) * 4;
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = ICE + "33";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      const boatX = W / 2 + Math.sin(time * 0.5) * 20;
      const boatY = 122 + Math.sin(boatX * 0.01 + time) * 8 + Math.sin(boatX * 0.025 + time * 1.5) * 4;

      ctx.beginPath();
      ctx.moveTo(boatX - 20, boatY);
      ctx.quadraticCurveTo(boatX - 24, boatY + 10, boatX - 12, boatY + 12);
      ctx.lineTo(boatX + 12, boatY + 12);
      ctx.quadraticCurveTo(boatX + 24, boatY + 10, boatX + 20, boatY);
      ctx.closePath();
      ctx.fillStyle = GOLD + "66"; ctx.strokeStyle = GOLD; ctx.lineWidth = 1;
      ctx.fill(); ctx.stroke();

      ctx.beginPath(); ctx.moveTo(boatX, boatY); ctx.lineTo(boatX, boatY - 35);
      ctx.strokeStyle = GOLD + "88"; ctx.lineWidth = 1.5; ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(boatX, boatY - 33);
      ctx.quadraticCurveTo(boatX + 16 + Math.sin(time) * 3, boatY - 20, boatX, boatY - 5);
      ctx.fillStyle = GOLD + "22"; ctx.strokeStyle = GOLD + "44"; ctx.lineWidth = 1;
      ctx.fill(); ctx.stroke();

      for (let i = 0; i < 3; i++) {
        const phase = time + i * 2.1;
        const active = (Math.sin(phase) + 1) / 2;
        if (active > 0.4) {
          const dataX = boatX + (i - 1) * 60;
          const dataY = 200 + i * 30;
          const alpha = (active - 0.4) / 0.6;
          ctx.beginPath(); ctx.moveTo(boatX, boatY + 12); ctx.lineTo(dataX, dataY);
          ctx.strokeStyle = GHOST + Math.floor(alpha * 40).toString(16).padStart(2, "0");
          ctx.lineWidth = 1; ctx.setLineDash([4, 6]); ctx.stroke(); ctx.setLineDash([]);
          const riseY = dataY - alpha * (dataY - boatY - 20);
          ctx.beginPath(); ctx.arc(dataX, riseY, 3 + alpha * 2, 0, Math.PI * 2);
          ctx.fillStyle = GHOST + Math.floor(alpha * 160).toString(16).padStart(2, "0");
          ctx.fill();
        }
      }

      ctx.font = "10px 'SF Mono', monospace"; ctx.textAlign = "center";
      ctx.fillStyle = GOLD; ctx.fillText("NAVIGATOR", boatX, boatY - 42);
      ctx.fillStyle = ICE + "66"; ctx.fillText("THE DATA OCEAN", W / 2, H - 16);
      ctx.font = "9px Georgia, serif";
      ctx.fillStyle = GHOST + "88"; ctx.fillText("just-in-time context retrieval", W / 2, H - 4);

      frameRef.current = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(frameRef.current);
  }, [vis]);

  return (
    <div ref={ref}>
      <div style={{ borderRadius: 16, overflow: "hidden", border: `1px solid ${LINE}`, background: BG }}>
        <canvas ref={canvasRef} style={{ width: "100%", height: 320, display: "block" }} />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// THESIS III — BRAIN ARCHITECTURE
// ═══════════════════════════════════════════════════════
export function BrainArchitectureVis() {
  const canvasRef = useRef(null);
  const [ref, vis] = useReveal(0.15);
  const frameRef = useRef(null);

  useEffect(() => {
    if (!vis) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = 660, H = 320;
    canvas.width = W; canvas.height = H;

    const rng = (seed) => { let s = seed; return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; };

    const whaleBrain = [];
    const r1 = rng(42);
    for (let i = 0; i < 20; i++) {
      const angle = r1() * Math.PI * 2, radius = r1() * 70;
      whaleBrain.push({ x: 165 + Math.cos(angle) * radius, y: 150 + Math.sin(angle) * radius * 0.75 });
    }

    const humanBrain = [];
    const r2 = rng(99);
    for (let i = 0; i < 40; i++) {
      const angle = r2() * Math.PI * 2, radius = r2() * 50;
      humanBrain.push({ x: 490 + Math.cos(angle) * radius, y: 150 + Math.sin(angle) * radius * 0.75 });
    }

    let time = 0;

    function draw() {
      time += 0.02;
      ctx.clearRect(0, 0, W, H);

      ctx.beginPath(); ctx.ellipse(165, 150, 90, 70, 0, 0, Math.PI * 2);
      ctx.strokeStyle = EMBER + "22"; ctx.lineWidth = 1; ctx.stroke();

      for (let i = 0; i < whaleBrain.length; i++) {
        for (let j = i + 1; j < whaleBrain.length; j++) {
          if ((i + j) % 5 === 0) {
            const pulse = Math.sin(time + i + j) * 0.3 + 0.3;
            ctx.beginPath(); ctx.moveTo(whaleBrain[i].x, whaleBrain[i].y); ctx.lineTo(whaleBrain[j].x, whaleBrain[j].y);
            ctx.strokeStyle = EMBER + Math.floor(pulse * 40).toString(16).padStart(2, "0");
            ctx.lineWidth = 0.5; ctx.stroke();
          }
        }
      }
      whaleBrain.forEach((n, i) => {
        const pulse = Math.sin(time * 2 + i) * 0.3 + 0.7;
        ctx.beginPath(); ctx.arc(n.x, n.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = EMBER + Math.floor(pulse * 120).toString(16).padStart(2, "0"); ctx.fill();
      });

      ctx.beginPath(); ctx.ellipse(490, 150, 65, 50, 0, 0, Math.PI * 2);
      ctx.strokeStyle = GREEN + "22"; ctx.lineWidth = 1; ctx.stroke();

      for (let i = 0; i < humanBrain.length; i++) {
        for (let j = i + 1; j < humanBrain.length; j++) {
          const dx = humanBrain[i].x - humanBrain[j].x, dy = humanBrain[i].y - humanBrain[j].y;
          if (Math.sqrt(dx * dx + dy * dy) < 55) {
            const pulse = Math.sin(time * 3 + i * 0.5 + j * 0.3) * 0.4 + 0.5;
            ctx.beginPath(); ctx.moveTo(humanBrain[i].x, humanBrain[i].y); ctx.lineTo(humanBrain[j].x, humanBrain[j].y);
            ctx.strokeStyle = GREEN + Math.floor(pulse * 50).toString(16).padStart(2, "0");
            ctx.lineWidth = 0.5; ctx.stroke();
          }
        }
      }
      humanBrain.forEach((n, i) => {
        const pulse = Math.sin(time * 3 + i * 0.7) * 0.4 + 0.6;
        ctx.beginPath(); ctx.arc(n.x, n.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = GREEN + Math.floor(pulse * 200).toString(16).padStart(2, "0"); ctx.fill();
        if (pulse > 0.85) {
          ctx.beginPath(); ctx.arc(n.x, n.y, 5, 0, Math.PI * 2);
          ctx.fillStyle = GREEN + "15"; ctx.fill();
        }
      });

      ctx.font = "11px 'SF Mono', monospace"; ctx.textAlign = "center";
      ctx.fillStyle = EMBER; ctx.fillText("SPERM WHALE", 165, 250);
      ctx.font = "9px Georgia, serif"; ctx.fillStyle = ASH; ctx.fillText("8.0 kg \u00B7 sparse connections", 165, 266);
      ctx.font = "11px 'SF Mono', monospace"; ctx.fillStyle = GREEN; ctx.fillText("HUMAN", 490, 230);
      ctx.font = "9px Georgia, serif"; ctx.fillStyle = ASH; ctx.fillText("1.4 kg \u00B7 dense architecture", 490, 246);
      ctx.font = "10px 'SF Mono', monospace"; ctx.fillStyle = GHOST; ctx.textAlign = "center";
      ctx.fillText("Connectivity beats volume", W / 2, H - 10);

      frameRef.current = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(frameRef.current);
  }, [vis]);

  return (
    <div ref={ref}>
      <div style={{ borderRadius: 16, overflow: "hidden", border: `1px solid ${LINE}`, background: BG }}>
        <canvas ref={canvasRef} style={{ width: "100%", height: 320, display: "block" }} />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// THESIS IV — CREDENTIALISM TIMELINE
// ═══════════════════════════════════════════════════════
export function CredentialismTimeline() {
  const [ref, vis] = useReveal(0.2);
  const [stage, setStage] = useState(-1);

  useEffect(() => {
    if (!vis) return;
    let s = -1;
    const iv = setInterval(() => { s++; setStage(s); if (s >= 3) clearInterval(iv); }, 700);
    return () => clearInterval(iv);
  }, [vis]);

  const eras = [
    { era: "16th Century", icon: "\uD83D\uDCDC", label: "Monk with scroll", memorized: "Sacred texts", valuable: "Literacy itself", shift: "Memorization = power", color: EMBER },
    { era: "17th Century", icon: "\uD83D\uDCD6", label: "Person with book", memorized: "Reference works", valuable: "Interpretation", shift: "Access democratized", color: GOLD },
    { era: "20th Century", icon: "\uD83D\uDCBB", label: "Person with computer", memorized: "Databases", valuable: "Search + synthesis", shift: "Storage outsourced", color: ICE },
    { era: "Now", icon: "\uD83D\uDD78\uFE0F", label: "Person with AI mesh", memorized: "Everything, generated", valuable: "Orchestration + taste", shift: "Cognition augmented", color: GREEN },
  ];

  return (
    <div ref={ref}>
      <div style={{ position: "relative" }}>
        <div style={{ position: "absolute", left: 24, top: 24, bottom: 24, width: 2, background: `linear-gradient(${EMBER}44, ${GREEN}44)` }} />
        {eras.map((e, i) => (
          <div key={i} style={{
            display: "flex", gap: 20, padding: "20px 0", paddingLeft: 48, position: "relative",
            opacity: i <= stage ? 1 : 0.15,
            transform: i <= stage ? "translateX(0)" : "translateX(-10px)",
            transition: `all 0.6s ease ${i * 0.1}s`,
          }}>
            <div style={{
              position: "absolute", left: 16, top: 28, width: 18, height: 18, borderRadius: "50%",
              background: i <= stage ? e.color + "33" : FAINT,
              border: `2px solid ${i <= stage ? e.color : LINE}`, transition: "all 0.4s",
            }} />
            <div style={{ flex: 1, background: FAINT, border: `1px solid ${i <= stage ? e.color + "22" : LINE}`, borderRadius: 12, padding: "16px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 22 }}>{e.icon}</span>
                <div>
                  <div style={{ ...mono, fontSize: 10, letterSpacing: 2, color: e.color }}>{e.era}</div>
                  <div style={{ ...sans, fontSize: 15, fontWeight: 600 }}>{e.label}</div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 8 }}>
                <div>
                  <div style={{ ...mono, fontSize: 8, color: ASH, letterSpacing: 1, marginBottom: 2 }}>MEMORIZED</div>
                  <div style={{ ...serif, fontSize: 11, color: BONE }}>{e.memorized}</div>
                </div>
                <div>
                  <div style={{ ...mono, fontSize: 8, color: ASH, letterSpacing: 1, marginBottom: 2 }}>VALUABLE</div>
                  <div style={{ ...serif, fontSize: 11, color: e.color }}>{e.valuable}</div>
                </div>
                <div>
                  <div style={{ ...mono, fontSize: 8, color: ASH, letterSpacing: 1, marginBottom: 2 }}>SHIFT</div>
                  <div style={{ ...serif, fontSize: 11, color: BONE }}>{e.shift}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// THESIS V — COMPUTE VS GOLD TOGGLE
// ═══════════════════════════════════════════════════════
export function ComputeGoldToggle() {
  const [mode, setMode] = useState("gold");
  const canvasRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    if (mode !== "compute") { if (frameRef.current) cancelAnimationFrame(frameRef.current); return; }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = 600, H = 200;
    canvas.width = W; canvas.height = H;
    let time = 0;
    const outputs = [];

    function draw() {
      time += 0.03;
      ctx.clearRect(0, 0, W, H);

      for (let r = 0; r < 4; r++) {
        const rx = 40 + r * 60, ry = 60;
        ctx.fillStyle = GREEN + "11"; ctx.strokeStyle = GREEN + "44"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.roundRect(rx, ry, 40, 80, 4); ctx.fill(); ctx.stroke();
        for (let l = 0; l < 6; l++) {
          ctx.beginPath(); ctx.arc(rx + 12, ry + 12 + l * 11, 2, 0, Math.PI * 2);
          ctx.fillStyle = Math.sin(time * 5 + r + l * 2) > 0 ? GREEN : GREEN + "22"; ctx.fill();
          ctx.beginPath(); ctx.arc(rx + 28, ry + 12 + l * 11, 2, 0, Math.PI * 2);
          ctx.fillStyle = Math.sin(time * 3 + r * 2 + l) > 0.3 ? ICE + "88" : ICE + "22"; ctx.fill();
        }
      }

      if (Math.random() < 0.15) outputs.push({ x: 300, y: 80 + Math.random() * 60, vx: 2 + Math.random() * 3, life: 0 });
      for (let i = outputs.length - 1; i >= 0; i--) {
        const o = outputs[i]; o.x += o.vx; o.life++;
        if (o.x > W) { outputs.splice(i, 1); continue; }
        const alpha = Math.min(1, o.life / 8) * Math.max(0, 1 - (o.x - 300) / (W - 300));
        ctx.beginPath(); ctx.arc(o.x, o.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = GHOST + Math.floor(alpha * 160).toString(16).padStart(2, "0"); ctx.fill();
      }

      ctx.font = "9px 'SF Mono', monospace"; ctx.textAlign = "left";
      ["CODE", "ANALYSIS", "INSIGHT", "SYNTHESIS", "STRATEGY"].forEach((l, i) => {
        const y = 65 + i * 25, xBase = 420 + Math.sin(time + i) * 20;
        const alpha = (Math.sin(time * 2 + i * 1.5) + 1) / 2;
        ctx.fillStyle = GHOST + Math.floor(40 + alpha * 80).toString(16).padStart(2, "0");
        ctx.fillText(l, xBase, y);
      });
      ctx.font = "10px 'SF Mono', monospace"; ctx.fillStyle = GREEN; ctx.textAlign = "center";
      ctx.fillText("GENERATING", 160, H - 10);

      frameRef.current = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(frameRef.current);
  }, [mode]);

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20, justifyContent: "center" }}>
        {[
          { key: "gold", label: "GOLD (INERT)", color: GOLD },
          { key: "compute", label: "COMPUTE (GENERATIVE)", color: GREEN },
        ].map(m => (
          <button key={m.key} onClick={() => setMode(m.key)} style={{
            background: mode === m.key ? m.color + "22" : FAINT,
            border: `1px solid ${mode === m.key ? m.color + "44" : LINE}`,
            color: mode === m.key ? m.color : ASH,
            borderRadius: 8, padding: "8px 20px", cursor: "pointer",
            ...mono, fontSize: 10, letterSpacing: 1, transition: "all 0.3s",
          }}>{m.label}</button>
        ))}
      </div>
      <div style={{ background: FAINT, border: `1px solid ${LINE}`, borderRadius: 16, padding: "24px", minHeight: 240 }}>
        {mode === "gold" ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{
              width: 160, height: 80, margin: "0 auto 24px",
              background: `linear-gradient(135deg, ${GOLD}44, ${GOLD}22, ${GOLD}33)`,
              border: `2px solid ${GOLD}66`, borderRadius: 8,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <div style={{ ...sans, fontSize: 28, fontWeight: 800, color: GOLD }}>Au</div>
            </div>
            <div style={{ ...sans, fontSize: 16, fontWeight: 600, color: GOLD, marginBottom: 8 }}>Static. Scarce. Inert.</div>
            <div style={{ ...serif, fontSize: 13, color: ASH, lineHeight: 1.6, maxWidth: 360, margin: "0 auto" }}>
              You hoard it. It sits in a vault. Its value comes from scarcity alone. It produces nothing. Possession = wealth.
            </div>
          </div>
        ) : (
          <div>
            <canvas ref={canvasRef} style={{ width: "100%", height: 200, display: "block", borderRadius: 8 }} />
            <div style={{ textAlign: "center", marginTop: 12 }}>
              <div style={{ ...sans, fontSize: 16, fontWeight: 600, color: GREEN, marginBottom: 8 }}>Active. Generative. Orchestrated.</div>
              <div style={{ ...serif, fontSize: 13, color: ASH, lineHeight: 1.6, maxWidth: 360, margin: "0 auto" }}>
                Value comes from orchestration, not possession. A GPU farm without architecture is a space heater.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// THESIS VI — GITA CYCLE
// ═══════════════════════════════════════════════════════
export function GitaCycleVis() {
  const canvasRef = useRef(null);
  const [ref, vis] = useReveal(0.15);
  const frameRef = useRef(null);

  useEffect(() => {
    if (!vis) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = 660, H = 340;
    canvas.width = W; canvas.height = H;
    let time = 0;
    const stages = ["KNOW", "ACT", "REFLECT", "ADJUST"];
    const colors = [ICE, GREEN, GOLD, GHOST];

    function draw() {
      time += 0.01;
      ctx.clearRect(0, 0, W, H);
      const cx = W / 2, cy = H / 2, outerR = 120, innerR = 60;

      const outerAngle = time * 0.5;
      ctx.beginPath(); ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
      ctx.strokeStyle = ASH + "33"; ctx.lineWidth = 2; ctx.stroke();

      stages.forEach((s, i) => {
        const angle = (i / 4) * Math.PI * 2 - Math.PI / 2;
        const x = cx + Math.cos(angle) * outerR, y = cy + Math.sin(angle) * outerR;
        const activePhase = ((outerAngle / (Math.PI * 2)) * 4) % 4;
        const isActive = Math.floor(activePhase) === i;
        ctx.beginPath(); ctx.arc(x, y, isActive ? 22 : 18, 0, Math.PI * 2);
        ctx.fillStyle = isActive ? colors[i] + "33" : colors[i] + "11";
        ctx.strokeStyle = isActive ? colors[i] + "88" : colors[i] + "33";
        ctx.lineWidth = isActive ? 2 : 1; ctx.fill(); ctx.stroke();
        ctx.font = `${isActive ? "bold " : ""}10px 'SF Mono', monospace`;
        ctx.fillStyle = isActive ? colors[i] : colors[i] + "88";
        ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(s, x, y);
      });

      const dotAngle = outerAngle - Math.PI / 2;
      ctx.beginPath(); ctx.arc(cx + Math.cos(dotAngle) * outerR, cy + Math.sin(dotAngle) * outerR, 4, 0, Math.PI * 2);
      ctx.fillStyle = BONE + "88"; ctx.fill();

      const innerAngle = time * 2.5;
      ctx.beginPath(); ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
      ctx.strokeStyle = GREEN + "22"; ctx.lineWidth = 1.5; ctx.stroke();

      stages.forEach((s, i) => {
        const angle = (i / 4) * Math.PI * 2 - Math.PI / 2;
        const x = cx + Math.cos(angle) * innerR, y = cy + Math.sin(angle) * innerR;
        const innerActivePhase = ((innerAngle / (Math.PI * 2)) * 4) % 4;
        const isActive = Math.floor(innerActivePhase) === i;
        ctx.beginPath(); ctx.arc(x, y, isActive ? 12 : 9, 0, Math.PI * 2);
        ctx.fillStyle = isActive ? GREEN + "44" : GREEN + "11";
        ctx.strokeStyle = isActive ? GREEN + "88" : GREEN + "33";
        ctx.lineWidth = 1; ctx.fill(); ctx.stroke();
        ctx.font = "7px 'SF Mono', monospace";
        ctx.fillStyle = isActive ? GREEN : GREEN + "66";
        ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(s[0], x, y);
      });

      const innerDotAngle = innerAngle - Math.PI / 2;
      ctx.beginPath(); ctx.arc(cx + Math.cos(innerDotAngle) * innerR, cy + Math.sin(innerDotAngle) * innerR, 3, 0, Math.PI * 2);
      ctx.fillStyle = GREEN; ctx.fill();

      ctx.textBaseline = "alphabetic";
      ctx.font = "10px 'SF Mono', monospace"; ctx.textAlign = "left";
      ctx.fillStyle = ASH; ctx.fillText("OUTER: Human cycle", 20, 24);
      ctx.fillStyle = GREEN; ctx.fillText("INNER: AI-augmented (5x faster)", 20, 40);
      ctx.font = "9px Georgia, serif"; ctx.fillStyle = GHOST + "88"; ctx.textAlign = "center";
      ctx.fillText("The gap between knowing and acting is where suffering lives", cx, H - 12);

      frameRef.current = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(frameRef.current);
  }, [vis]);

  return (
    <div ref={ref}>
      <div style={{ borderRadius: 16, overflow: "hidden", border: `1px solid ${LINE}`, background: BG }}>
        <canvas ref={canvasRef} style={{ width: "100%", height: 340, display: "block" }} />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// THESIS VII — INNOVATION STACK
// ═══════════════════════════════════════════════════════
export function InnovationStackVis() {
  const [ref, vis] = useReveal(0.2);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!vis) return;
    const t = setTimeout(() => setActive(true), 400);
    return () => clearTimeout(t);
  }, [vis]);

  const layers = [
    { name: "Architecture", desc: "Transformers, Mamba, Mixture of Experts", color: GHOST, activity: 0.9 },
    { name: "Compression", desc: "Quantization, pruning, knowledge distillation", color: ICE, activity: 0.8 },
    { name: "Distillation", desc: "Smaller models learning from larger ones", color: GREEN, activity: 0.85 },
    { name: "Inference", desc: "Speculative decoding, batched KV cache, edge deployment", color: GOLD, activity: 0.75 },
    { name: "Tooling", desc: "Agents, function calling, code interpreters", color: EMBER, activity: 0.95 },
    { name: "Integration", desc: "IDE, browser, OS-level, enterprise pipelines", color: BONE, activity: 0.7 },
  ];

  return (
    <div ref={ref}>
      <div style={{ background: FAINT, border: `1px solid ${LINE}`, borderRadius: 16, padding: "24px", position: "relative" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }}>
          <div style={{ textAlign: "center", padding: "12px 16px", background: EMBER + "08", border: `1px solid ${EMBER}22`, borderRadius: 10 }}>
            <div style={{ ...mono, fontSize: 10, color: EMBER, letterSpacing: 1, marginBottom: 4 }}>TULIPS (1637)</div>
            <div style={{ ...serif, fontSize: 12, color: ASH }}>One layer of speculation. No underlying innovation.</div>
          </div>
          <div style={{ textAlign: "center", padding: "12px 16px", background: GREEN + "08", border: `1px solid ${GREEN}22`, borderRadius: 10 }}>
            <div style={{ ...mono, fontSize: 10, color: GREEN, letterSpacing: 1, marginBottom: 4 }}>AI (2024-2026)</div>
            <div style={{ ...serif, fontSize: 12, color: ASH }}>Simultaneous innovation at every layer of the stack.</div>
          </div>
        </div>

        {layers.map((l, i) => {
          const delay = i * 0.1;
          return (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 16,
              padding: "10px 16px", marginBottom: 6,
              background: active ? l.color + "08" : "transparent",
              border: `1px solid ${active ? l.color + "22" : "transparent"}`,
              borderRadius: 10, transition: `all 0.6s ease ${delay}s`,
            }}>
              <div style={{
                width: 8, height: 8, borderRadius: "50%",
                background: active ? l.color : ASH + "33",
                boxShadow: active ? `0 0 8px ${l.color}66` : "none",
                animation: active ? `iacPulse 1.${i + 2}s ease-in-out infinite` : "none",
                transition: `all 0.6s ease ${delay}s`,
              }} />
              <div style={{ flex: 1 }}>
                <div style={{ ...sans, fontSize: 14, fontWeight: 600, color: l.color }}>{l.name}</div>
                <div style={{ ...serif, fontSize: 11, color: ASH }}>{l.desc}</div>
              </div>
              <div style={{ width: 80, height: 6, background: LINE, borderRadius: 3, overflow: "hidden" }}>
                <div style={{
                  height: "100%", width: active ? `${l.activity * 100}%` : "0%",
                  background: l.color + "88", borderRadius: 3,
                  transition: `width 1.2s ease ${delay + 0.3}s`,
                }} />
              </div>
            </div>
          );
        })}
        <style>{`@keyframes iacPulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }`}</style>
      </div>
    </div>
  );
}
