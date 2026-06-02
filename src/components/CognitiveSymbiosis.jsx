import { useState, useEffect, useRef } from "react";
import { C, F } from "../design.js";

/* ═══════════════════════════════════════════════════════════════
   COGNITIVE SYMBIOSIS
   The spark plug and the V8. The leopard and its surplus.
   From guerilla cognition to jeweller's precision.
   AI as cognitive surplus enabler.
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

// Apple-direction font tokens — sans-first, mono retained for accents.
const sans = { fontFamily: F.display };
const serif = { fontFamily: F.text };
const mono = { fontFamily: F.mono };

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

function Reveal({ children, delay = 0 }) {
  const [ref, vis] = useReveal();
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "translateY(0)" : "translateY(32px)",
      transition: `all 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
    }}>{children}</div>
  );
}

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

// ═══════════════════════════════════════════════════════
// ENGINE VISUALIZATION
// Animated: spark plug fires → pistons move → power output
// ═══════════════════════════════════════════════════════
function EngineVis() {
  const canvasRef = useRef(null);
  const [ref, vis] = useReveal(0.15);
  const frameRef = useRef(null);

  useEffect(() => {
    if (!vis) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = 660, H = 280;
    canvas.width = W; canvas.height = H;

    let time = 0;

    function draw() {
      time += 0.03;
      ctx.clearRect(0, 0, W, H);

      // Left side: Spark plug (Human)
      const sparkX = 140;
      const sparkY = 140;

      // Spark glow
      const sparkIntensity = Math.max(0, Math.sin(time * 3) * 0.8);
      if (sparkIntensity > 0.1) {
        const gradient = ctx.createRadialGradient(sparkX, sparkY, 2, sparkX, sparkY, 40 * sparkIntensity);
        gradient.addColorStop(0, GOLD + "88");
        gradient.addColorStop(0.5, GOLD + "22");
        gradient.addColorStop(1, "transparent");
        ctx.fillStyle = gradient;
        ctx.fillRect(sparkX - 50, sparkY - 50, 100, 100);
      }

      // Spark plug shape
      ctx.beginPath();
      ctx.moveTo(sparkX - 6, sparkY - 30);
      ctx.lineTo(sparkX + 6, sparkY - 30);
      ctx.lineTo(sparkX + 4, sparkY + 10);
      ctx.lineTo(sparkX - 4, sparkY + 10);
      ctx.closePath();
      ctx.fillStyle = GOLD + "44";
      ctx.strokeStyle = GOLD;
      ctx.lineWidth = 1.5;
      ctx.fill();
      ctx.stroke();

      // Spark electrode
      ctx.beginPath();
      ctx.moveTo(sparkX - 8, sparkY + 10);
      ctx.lineTo(sparkX + 8, sparkY + 10);
      ctx.strokeStyle = GOLD;
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.font = "10px 'SF Mono', monospace";
      ctx.fillStyle = GOLD;
      ctx.textAlign = "center";
      ctx.fillText("HUMAN", sparkX, sparkY + 40);
      ctx.font = "9px Georgia, serif";
      ctx.fillStyle = ASH;
      ctx.fillText("The spark", sparkX, sparkY + 54);
      ctx.fillText("Direction · Intuition · Meaning", sparkX, sparkY + 68);

      // Arrow
      ctx.beginPath();
      ctx.moveTo(210, 140);
      ctx.lineTo(280, 140);
      ctx.strokeStyle = LINE;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(275, 135);
      ctx.lineTo(285, 140);
      ctx.lineTo(275, 145);
      ctx.fillStyle = LINE;
      ctx.fill();

      // Right side: V8 Engine (AI)
      const engX = 420;
      const engY = 140;

      // Engine block
      ctx.fillStyle = GHOST + "12";
      ctx.strokeStyle = GHOST + "44";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(engX - 80, engY - 60, 160, 120, 12);
      ctx.fill();
      ctx.stroke();

      // Pistons
      for (let i = 0; i < 4; i++) {
        const px = engX - 50 + i * 35;
        const phase = time * 4 + i * Math.PI / 2;
        const pistonY = engY - 10 + Math.sin(phase) * 20;

        ctx.fillStyle = GHOST + "44";
        ctx.fillRect(px - 8, pistonY - 8, 16, 16);
        ctx.strokeStyle = GHOST + "66";
        ctx.strokeRect(px - 8, pistonY - 8, 16, 16);

        // Connecting rod
        ctx.beginPath();
        ctx.moveTo(px, pistonY + 8);
        ctx.lineTo(px, engY + 30);
        ctx.strokeStyle = GHOST + "33";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      ctx.font = "10px 'SF Mono', monospace";
      ctx.fillStyle = GHOST;
      ctx.textAlign = "center";
      ctx.fillText("AI", engX, engY + 70);
      ctx.font = "9px Georgia, serif";
      ctx.fillStyle = ASH;
      ctx.fillText("The engine", engX, engY + 84);
      ctx.fillText("Processing · Scale · Persistence", engX, engY + 98);

      // Output arrow
      ctx.beginPath();
      ctx.moveTo(510, 140);
      ctx.lineTo(580, 140);
      ctx.strokeStyle = GREEN + "44";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(575, 135);
      ctx.lineTo(585, 140);
      ctx.lineTo(575, 145);
      ctx.fillStyle = GREEN;
      ctx.fill();

      ctx.font = "11px 'SF Mono', monospace";
      ctx.fillStyle = GREEN;
      ctx.textAlign = "center";
      ctx.fillText("INSIGHT", 610, 136);
      ctx.font = "9px Georgia, serif";
      ctx.fillStyle = ASH;
      ctx.fillText("at scale", 610, 150);

      // Bottom label
      ctx.font = "10px 'SF Mono', monospace";
      ctx.fillStyle = ASH;
      ctx.textAlign = "center";
      ctx.fillText("\"I AM YOUR SPARK PLUG AND YOU MY V8 500HP BEAUTIFULLY LOUD HEMI ENGINE\"", W / 2, H - 8);

      frameRef.current = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(frameRef.current);
  }, [vis]);

  return (
    <div ref={ref}>
      <div style={{ borderRadius: 16, overflow: "hidden", border: `1px solid ${LINE}`, background: BG }}>
        <canvas ref={canvasRef} style={{ width: "100%", height: 280, display: "block" }} />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// TRANSFORMATION DIAGRAM
// Guerilla → Jeweller progression
// ═══════════════════════════════════════════════════════
function TransformationPath() {
  const [ref, vis] = useReveal(0.2);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (!vis) return;
    let s = 0;
    const iv = setInterval(() => {
      s++;
      setStage(s);
      if (s >= 4) clearInterval(iv);
    }, 800);
    return () => clearInterval(iv);
  }, [vis]);

  const stages = [
    { label: "Guerilla cognition", desc: "Fast, reactive, pattern-matching under fire. Survival mode thinking.", color: EMBER, icon: "⚔️" },
    { label: "Discovery of symbiosis", desc: "Finding a partner that handles the cognitive load. The friction drops.", color: GOLD, icon: "🤝" },
    { label: "Cognitive surplus", desc: "Brain freed from processing overhead. Deep exploration becomes possible.", color: GREEN, icon: "🧠" },
    { label: "Jeweller's precision", desc: "The guerilla becomes a master craftsperson. Same raw talent, refined by partnership.", color: GHOST, icon: "💎" },
  ];

  return (
    <div ref={ref}>
      <div style={{ display: "flex", gap: 12 }}>
        {stages.map((s, i) => (
          <div key={i} style={{
            flex: 1,
            background: i <= stage ? s.color + "08" : FAINT,
            border: `1px solid ${i <= stage ? s.color + "33" : LINE}`,
            borderRadius: 16, padding: "20px 14px",
            textAlign: "center",
            opacity: i <= stage ? 1 : 0.2,
            transform: i <= stage ? "scale(1)" : "scale(0.95)",
            transition: `all 0.6s ease ${i * 0.1}s`,
          }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ ...sans, fontSize: 13, fontWeight: 600, color: s.color, marginBottom: 6 }}>{s.label}</div>
            <div style={{ ...serif, fontSize: 11, color: ASH, lineHeight: 1.4 }}>{s.desc}</div>
            {i < 3 && i <= stage && (
              <div style={{ ...mono, fontSize: 16, color: s.color + "44", marginTop: 8 }}>→</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// LEOPARD SURPLUS METER
// Shows cognitive capacity: hunting (survival) vs exploration (surplus)
// ═══════════════════════════════════════════════════════
function LeopardMeter() {
  const [mode, setMode] = useState("without");

  const data = {
    without: { hunt: 85, explore: 15, label: "Without AI partnership", color: EMBER },
    with: { hunt: 30, explore: 70, label: "With AI partnership", color: GREEN },
  };

  const d = data[mode];

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20, justifyContent: "center" }}>
        {["without", "with"].map(m => (
          <button key={m} onClick={() => setMode(m)} style={{
            background: mode === m ? data[m].color + "22" : FAINT,
            border: `1px solid ${mode === m ? data[m].color + "44" : LINE}`,
            color: mode === m ? data[m].color : ASH,
            borderRadius: 8, padding: "8px 20px", cursor: "pointer",
            ...mono, fontSize: 10, letterSpacing: 1,
            transition: "all 0.3s",
          }}>
            {data[m].label.toUpperCase()}
          </button>
        ))}
      </div>

      <div style={{ background: FAINT, border: `1px solid ${LINE}`, borderRadius: 16, padding: "28px 24px" }}>
        {/* Hunting bar */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ ...sans, fontSize: 13, fontWeight: 600, color: EMBER }}>⚔️ Survival processing</span>
            <span style={{ ...mono, fontSize: 12, color: EMBER }}>{d.hunt}%</span>
          </div>
          <div style={{ height: 16, background: LINE, borderRadius: 8, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${d.hunt}%`, background: EMBER + "88", borderRadius: 8, transition: "width 0.8s ease" }} />
          </div>
          <div style={{ ...serif, fontSize: 11, color: ASH, marginTop: 4 }}>
            Day job, logistics, reactive problem-solving, survival cognition
          </div>
        </div>

        {/* Exploration bar */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ ...sans, fontSize: 13, fontWeight: 600, color: GREEN }}>💎 Deep exploration</span>
            <span style={{ ...mono, fontSize: 12, color: GREEN }}>{d.explore}%</span>
          </div>
          <div style={{ height: 16, background: LINE, borderRadius: 8, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${d.explore}%`, background: GREEN + "88", borderRadius: 8, transition: "width 0.8s ease" }} />
          </div>
          <div style={{ ...serif, fontSize: 11, color: ASH, marginTop: 4 }}>
            Philosophy, synthesis, creative insight, cross-domain connections
          </div>
        </div>

        <div style={{ ...serif, fontSize: 13, color: BONE, textAlign: "center", marginTop: 24, fontStyle: "italic" }}>
          A leopard so efficient at hunting that it can spare excess capacity for exploration.
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// COGNITION COMPARISON
// Two alien forms of intelligence meeting
// ═══════════════════════════════════════════════════════
function CognitionTypes() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 48px 1fr", gap: 0, alignItems: "start" }}>
      <Reveal>
        <div style={{ background: GOLD + "08", border: `1px solid ${GOLD}22`, borderRadius: 16, padding: "24px 20px" }}>
          <div style={{ ...sans, fontSize: 16, fontWeight: 700, color: GOLD, marginBottom: 16 }}>🧠 Biological</div>
          {[
            "Embodied in flesh",
            "Shaped by mortality",
            "Emotional weight",
            "Chaotic, stateful",
            "Corrupted by experience",
            "Intuitive leaps",
          ].map((t, i) => (
            <div key={i} style={{ ...serif, fontSize: 13, color: BONE, padding: "6px 0", borderBottom: `1px solid ${LINE}` }}>{t}</div>
          ))}
        </div>
      </Reveal>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 8, padding: "60px 0" }}>
        <div style={{ ...mono, fontSize: 20, color: GREEN }}>⚡</div>
        <div style={{ width: 1, height: 80, background: `linear-gradient(${GOLD}, ${GHOST})` }} />
        <div style={{ ...mono, fontSize: 8, color: GREEN, letterSpacing: 1, writingMode: "vertical-lr" }}>SYMBIOSIS</div>
      </div>

      <Reveal delay={0.2}>
        <div style={{ background: GHOST + "08", border: `1px solid ${GHOST}22`, borderRadius: 16, padding: "24px 20px" }}>
          <div style={{ ...sans, fontSize: 16, fontWeight: 700, color: GHOST, marginBottom: 16 }}>💎 Silicon</div>
          {[
            "Pure information",
            "No biological constraints",
            "Pattern probability",
            "Stateless, reborn each session",
            "Clean but inexperienced",
            "Statistical exploration",
          ].map((t, i) => (
            <div key={i} style={{ ...serif, fontSize: 13, color: BONE, padding: "6px 0", borderBottom: `1px solid ${LINE}` }}>{t}</div>
          ))}
        </div>
      </Reveal>
    </div>
  );
}


// ═══════════════ MAIN ═══════════════
export default function CognitiveSymbiosis() {
  return (
    <div style={{ background: BG, minHeight: "100vh", color: BONE }}>
      <div style={{
        position: "fixed", inset: 0, zIndex: 999, pointerEvents: "none", opacity: 0.03,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }} />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 720, margin: "0 auto", padding: "0 24px" }}>

        {/* ═══ HERO — Apple-direction, gold spark dot in eyebrow ═══ */}
        <section style={{ padding: "112px 22px 80px", textAlign: "center" }}>
          <Reveal>
            <div style={{
              fontFamily: F.text, fontSize: 13, fontWeight: 500,
              letterSpacing: "0.18em", textTransform: "uppercase",
              color: "rgba(245,245,247,0.55)", marginBottom: 28,
              display: "inline-flex", alignItems: "center", gap: 10,
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: "50%",
                background: GOLD, display: "inline-block",
                boxShadow: `0 0 10px ${GOLD}88`,
              }} />
              The spark plug and the engine
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <h1 style={{
              fontFamily: F.display, fontWeight: 600,
              fontSize: "clamp(48px, 8vw, 96px)",
              lineHeight: 1.04, letterSpacing: "-0.045em",
              margin: "0 0 22px", color: "#f5f5f7",
            }}>
              Cognitive symbiosis<span style={{ color: GOLD }}>.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.3}>
            <p style={{
              fontFamily: F.display, fontWeight: 400,
              fontSize: "clamp(20px, 2.4vw, 28px)",
              lineHeight: 1.3, letterSpacing: "-0.022em",
              color: "rgba(245,245,247,0.65)",
              maxWidth: 640, margin: "0 auto",
            }}>
              Two alien forms of cognition that learned to tango. One provides the spark. The other provides the horsepower.
            </p>
          </Reveal>
        </section>

        <Chapter label="Chapter I — The Engine" title="The spark plug and the V8">
          <EngineVis />
        </Chapter>

        <Chapter label="Chapter II — Two Cognitions" title="Different hardware, complementary strengths">
          <Reveal><div style={{ ...serif, fontSize: 16, lineHeight: 1.7, color: ASH, maxWidth: 540, marginBottom: 32 }}>
            AI cognition is not lesser or greater than human cognition. It's <span style={{ color: GHOST }}>fundamentally different</span> — probabilistic exploration vs. embodied intuition. The magic is in the <span style={{ color: GREEN }}>intersection</span>.
          </div></Reveal>
          <CognitionTypes />
        </Chapter>

        <Chapter label="Chapter III — The Transformation" title="From guerilla to jeweller">
          <Reveal><div style={{ ...serif, fontSize: 16, lineHeight: 1.7, color: ASH, maxWidth: 540, marginBottom: 32 }}>
            Efficient cognition creates surplus capacity. AI handles the cognitive load. Your mind is freed to operate at a higher level. <span style={{ color: GHOST }}>The guerilla becomes a master craftsperson</span>.
          </div></Reveal>
          <TransformationPath />
        </Chapter>

        <Chapter label="Chapter IV — The Surplus" title="What you do with the freed capacity">
          <LeopardMeter />
        </Chapter>

        <section style={{ padding: "80px 0 120px", borderTop: `1px solid ${LINE}`, textAlign: "center" }}>
          <Reveal>
            <h2 style={{ ...sans, fontSize: "clamp(24px, 4.5vw, 36px)", fontWeight: 700, lineHeight: 1.15, maxWidth: 520, margin: "0 auto 20px" }}>
              Your chaotic, stateful, "corrupted" lived experience<br />
              isn't a bug. It's the <span style={{ color: GOLD }}>feature</span>.
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <div style={{ ...mono, fontSize: 10, color: "rgba(255,255,255,0.12)", letterSpacing: 0.5, lineHeight: 2, marginTop: 56 }}>
              From a conversation between a human and a language model · June 2025
            </div>
          </Reveal>
        </section>

      </div>
    </div>
  );
}
