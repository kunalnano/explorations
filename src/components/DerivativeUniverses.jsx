import { useState, useEffect, useRef } from "react";
import { C, F } from "../design.js";

/* ═══════════════════════════════════════════════════════════════
   DERIVATIVE UNIVERSES & THE HIVE MIND
   Copy with noise = evolution = innovation.
   Child universes outgrow parents.
   Your brain is already a hive mind.
   Neuralink just scales it up.
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

// Apple typographic stack — interior identity colors stay
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
// COPY-WITH-NOISE VISUALIZATION
// Shows DNA-like replication where errors create novelty
// ═══════════════════════════════════════════════════════
function CopyWithNoise() {
  const canvasRef = useRef(null);
  const [ref, vis] = useReveal(0.15);
  const frameRef = useRef(null);
  const timeRef = useRef(0);

  useEffect(() => {
    if (!vis) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = 660, H = 240;
    canvas.width = W; canvas.height = H;

    // Original sequence
    const original = [];
    for (let i = 0; i < 40; i++) {
      original.push({ hue: (i * 9) % 360, val: 0.3 + Math.random() * 0.5 });
    }

    function draw() {
      timeRef.current += 0.02;
      const t = timeRef.current;
      ctx.clearRect(0, 0, W, H);

      // Labels
      ctx.font = "10px 'SF Mono', monospace";
      ctx.textAlign = "left";

      // Row 1: Original
      ctx.fillStyle = ICE;
      ctx.fillText("PARENT UNIVERSE", 16, 30);
      original.forEach((s, i) => {
        const x = 16 + i * 16;
        ctx.fillStyle = `hsla(${s.hue}, 60%, 50%, ${s.val})`;
        ctx.fillRect(x, 40, 12, 24);
      });

      // Rows 2-4: Copies with increasing noise
      const noises = [0.05, 0.2, 0.6];
      const labels = ["COPY (LOW NOISE)", "COPY (MEDIUM NOISE)", "CHILD UNIVERSE (HIGH MUTATION)"];
      const colors = [GREEN, GOLD, EMBER];

      noises.forEach((noise, row) => {
        const y = 90 + row * 50;
        ctx.fillStyle = colors[row];
        ctx.fillText(labels[row], 16, y);

        original.forEach((s, i) => {
          const x = 16 + i * 16;
          // Add noise — seeded by position for stability, shifted by time for shimmer
          const mutH = s.hue + Math.sin(i * 3.7 + t * 0.3) * noise * 120;
          const mutV = Math.max(0.1, Math.min(1, s.val + Math.sin(i * 2.1 + t * 0.5) * noise));
          const isMutant = Math.abs(Math.sin(i * 7.3 + row * 2)) < noise;

          ctx.fillStyle = `hsla(${mutH}, 60%, 50%, ${mutV})`;
          ctx.fillRect(x, y + 10, 12, 24);

          if (isMutant && row === 2) {
            // Star marker on high mutations
            ctx.fillStyle = EMBER;
            ctx.font = "8px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText("★", x + 6, y + 8);
            ctx.font = "10px 'SF Mono', monospace";
            ctx.textAlign = "left";
          }
        });
      });

      // Arrow annotation
      ctx.fillStyle = EMBER + "88";
      ctx.font = "11px 'SF Mono', monospace";
      ctx.textAlign = "right";
      ctx.fillText("★ = NOVEL CAPABILITY", W - 16, H - 12);

      frameRef.current = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(frameRef.current);
  }, [vis]);

  return (
    <div ref={ref}>
      <div style={{ borderRadius: 16, overflow: "hidden", border: `1px solid ${LINE}`, background: BG }}>
        <canvas ref={canvasRef} style={{ width: "100%", height: 240, display: "block" }} />
      </div>
      <div style={{ ...serif, fontSize: 13, color: ASH, textAlign: "center", marginTop: 12, fontStyle: "italic" }}>
        Errors in copying are the entire engine of innovation. The "bug" becomes the feature.
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// NEURAL BANDWIDTH METER
// Shows Neuralink's 1024 channels vs brain's 100T connections
// ═══════════════════════════════════════════════════════
function BandwidthMeter() {
  const [ref, vis] = useReveal(0.2);

  const channels = [
    { label: "Neuralink (2024)", value: 1024, max: 1e14, color: EMBER, display: "1,024 channels" },
    { label: "Human speech", value: 39, max: 1e14, color: GOLD, display: "~39 bits/sec" },
    { label: "Human typing", value: 10, max: 1e14, color: ASH, display: "~10 bits/sec" },
    { label: "Full brain bandwidth", value: 1e14, max: 1e14, color: GHOST, display: "~100 trillion synapses" },
  ];

  return (
    <div ref={ref}>
      <div style={{ background: FAINT, border: `1px solid ${LINE}`, borderRadius: 16, padding: "24px 20px" }}>
        {channels.map((c, i) => {
          // Log scale for visualization
          const logVal = c.value > 0 ? Math.log10(c.value) : 0;
          const logMax = Math.log10(c.max);
          const pct = (logVal / logMax) * 100;

          return (
            <div key={i} style={{ marginBottom: i < channels.length - 1 ? 20 : 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ ...sans, fontSize: 13, fontWeight: 600, color: c.color }}>{c.label}</span>
                <span style={{ ...mono, fontSize: 11, color: c.color }}>{c.display}</span>
              </div>
              <div style={{ height: 8, background: LINE, borderRadius: 4, overflow: "hidden" }}>
                <div style={{
                  height: "100%", width: vis ? `${pct}%` : "0%", background: c.color,
                  borderRadius: 4, transition: `width 1.5s ease ${i * 0.2}s`,
                }} />
              </div>
            </div>
          );
        })}

        <div style={{ ...mono, fontSize: 10, color: EMBER, textAlign: "center", marginTop: 20, letterSpacing: 1 }}>
          NEURALINK READS 1,024 OF 100,000,000,000,000 CONNECTIONS
        </div>
        <div style={{ ...serif, fontSize: 13, color: ASH, textAlign: "center", marginTop: 6, fontStyle: "italic" }}>
          Like monitoring New York City by tapping 1,000 phone lines
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// HIVE MIND SCALE
// Interactive slider: individual → networked → dissolved
// ═══════════════════════════════════════════════════════
function HiveMindScale() {
  const [level, setLevel] = useState(0);

  const stages = [
    { pos: 0, label: "Individual", desc: "86B neurons. None is 'you.' Yet somehow from their firing, 'you' emerge.", color: GOLD, icon: "🧠" },
    { pos: 25, label: "Telepathy", desc: "Individual identities persist but gain access to collective processing. You remain you, just networked.", color: GREEN, icon: "🔗" },
    { pos: 50, label: "Shared sensorium", desc: "Bidirectional read/write. Your experiences become accessible to others. Privacy dissolves.", color: ICE, icon: "👁️" },
    { pos: 75, label: "Collective cognition", desc: "Thinking happens across multiple brains simultaneously. 'Your' ideas emerge from the network.", color: GHOST, icon: "🌐" },
    { pos: 100, label: "Dissolution", desc: "No more 'you' or 'me' — just us. One consciousness wearing 8 billion faces.", color: EMBER, icon: "∞" },
  ];

  const current = stages.reduce((best, s) => Math.abs(level - s.pos) < Math.abs(level - best.pos) ? s : best, stages[0]);

  return (
    <div>
      <div style={{ background: FAINT, border: `1px solid ${LINE}`, borderRadius: 16, padding: "32px 24px" }}>
        {/* Slider */}
        <input
          type="range" min={0} max={100} value={level}
          onChange={e => setLevel(Number(e.target.value))}
          style={{ width: "100%", accentColor: current.color, marginBottom: 24 }}
        />

        {/* Stage display */}
        <div style={{ textAlign: "center", minHeight: 120 }}>
          <div style={{ fontSize: 40, marginBottom: 8, transition: "all 0.3s" }}>{current.icon}</div>
          <div style={{ ...sans, fontSize: 20, fontWeight: 700, color: current.color, marginBottom: 8, transition: "color 0.3s" }}>
            {current.label}
          </div>
          <div style={{ ...serif, fontSize: 15, color: ASH, maxWidth: 400, margin: "0 auto", lineHeight: 1.6 }}>
            {current.desc}
          </div>
        </div>

        {/* Stage dots */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
          {stages.map((s, i) => (
            <div key={i} style={{ textAlign: "center", cursor: "pointer" }} onClick={() => setLevel(s.pos)}>
              <div style={{
                width: 10, height: 10, borderRadius: 5, margin: "0 auto 4px",
                background: level >= s.pos ? s.color : LINE,
                transition: "all 0.3s",
              }} />
              <div style={{ ...mono, fontSize: 8, color: level >= s.pos ? s.color : ASH, letterSpacing: 0.5 }}>
                {s.label.toUpperCase().slice(0, 6)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Reveal>
        <div style={{
          padding: "20px 20px", background: GHOST + "08", border: `1px solid ${GHOST}22`,
          borderRadius: 16, marginTop: 16,
        }}>
          <div style={{ ...serif, fontSize: 14, lineHeight: 1.7, color: ASH, textAlign: "center" }}>
            <span style={{ color: BONE }}>Your brain is already a hive mind.</span> 86 billion neurons, none of them "you."
            Connecting brains might just be scaling up the same process that turned neurons into consciousness.
          </div>
        </div>
      </Reveal>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// DERIVATIVE UNIVERSE TREE
// Visual: parent → children with mutations branching
// ═══════════════════════════════════════════════════════
function UniverseTree() {
  const [ref] = useReveal(0.15);

  return (
    <div ref={ref}>
      <svg viewBox="0 0 600 320" style={{ width: "100%", maxWidth: 600, display: "block", margin: "0 auto" }}>
        {/* Parent */}
        <circle cx={300} cy={40} r={28} fill={GHOST + "18"} stroke={GHOST + "55"} strokeWidth={1.5} />
        <text x={300} y={44} textAnchor="middle" fill={GHOST} fontSize={10} fontFamily="'Segoe UI'" fontWeight={600}>PARENT</text>

        {/* Branch lines */}
        {[120, 300, 480].map((x, i) => (
          <line key={i} x1={300} y1={68} x2={x} y2={120} stroke={[GREEN, ICE, EMBER][i] + "33"} strokeWidth={1} strokeDasharray="4 4" />
        ))}

        {/* Children */}
        {[
          { x: 120, label: "Child A", sub: "Same rules", color: GREEN, mutations: 2 },
          { x: 300, label: "Child B", sub: "+Mutation", color: ICE, mutations: 5 },
          { x: 480, label: "Child C", sub: "+MAJOR mutation", color: EMBER, mutations: 12 },
        ].map((c, i) => (
          <g key={i}>
            <circle cx={c.x} cy={145} r={24} fill={c.color + "15"} stroke={c.color + "44"} strokeWidth={1.5} />
            <text x={c.x} y={142} textAnchor="middle" fill={c.color} fontSize={9} fontFamily="'Segoe UI'" fontWeight={600}>{c.label}</text>
            <text x={c.x} y={154} textAnchor="middle" fill={ASH} fontSize={8} fontFamily="Georgia">{c.sub}</text>

            {/* Mutation sparkles */}
            {Array.from({ length: c.mutations }).map((_, j) => {
              const angle = (j / c.mutations) * Math.PI * 2;
              const r = 36 + Math.random() * 16;
              return (
                <circle key={j}
                  cx={c.x + Math.cos(angle) * r}
                  cy={145 + Math.sin(angle) * r}
                  r={1.5}
                  fill={c.color + "88"}
                >
                  <animate attributeName="opacity" values="0.3;1;0.3" dur={`${1.5 + Math.random()}s`} repeatCount="indefinite" />
                </circle>
              );
            })}
          </g>
        ))}

        {/* Grandchild from Child C — showing power gain */}
        <line x1={480} y1={169} x2={480} y2={220} stroke={EMBER + "33"} strokeWidth={1} strokeDasharray="4 4" />
        <circle cx={480} cy={245} r={32} fill={EMBER + "15"} stroke={EMBER + "55"} strokeWidth={2}>
          <animate attributeName="r" values="30;34;30" dur="3s" repeatCount="indefinite" />
        </circle>
        <text x={480} y={240} textAnchor="middle" fill={EMBER} fontSize={9} fontFamily="'Segoe UI'" fontWeight={700}>EXCEEDS</text>
        <text x={480} y={252} textAnchor="middle" fill={EMBER} fontSize={9} fontFamily="'Segoe UI'" fontWeight={700}>PARENT</text>
        <text x={480} y={268} textAnchor="middle" fill={ASH} fontSize={8} fontFamily="Georgia" fontStyle="italic">New physics emerged</text>

        {/* Annotation */}
        <text x={300} y={310} textAnchor="middle" fill={ASH} fontSize={10} fontFamily="'SF Mono', monospace">
          THE CHILD OUTGROWS THE PARENT — NOT DESPITE BEING DERIVATIVE, BECAUSE OF IT
        </text>
      </svg>
    </div>
  );
}


// ═══════════════ MAIN ═══════════════
export default function DerivativeUniverses() {
  return (
    <div style={{ background: BG, minHeight: "100vh", color: BONE }}>
      <div style={{
        position: "fixed", inset: 0, zIndex: 999, pointerEvents: "none", opacity: 0.03,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }} />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 720, margin: "0 auto", padding: "0 24px" }}>

        {/* HERO — Apple typographic frame */}
        <section style={{ padding: "112px 0 80px", textAlign: "center" }}>
          <Reveal>
            <div style={{
              width: 56, height: 1, background: C.accent,
              margin: "0 auto 22px", opacity: 0.85,
            }} />
            <div style={{
              fontFamily: F.text, fontSize: 13, fontWeight: 500,
              letterSpacing: "0.18em", textTransform: "uppercase",
              color: "rgba(245,245,247,0.55)", marginBottom: 22,
            }}>Copy with noise equals evolution</div>
          </Reveal>
          <Reveal delay={0.15}>
            <h1 style={{
              fontFamily: F.display, fontWeight: 600,
              fontSize: "clamp(48px, 8vw, 96px)",
              lineHeight: 1.05, letterSpacing: "-0.045em",
              color: "#f5f5f7", margin: "0 0 18px",
            }}>Derivative universes<span style={{ color: C.accent }}>.</span></h1>
          </Reveal>
          <Reveal delay={0.3}>
            <p style={{
              fontFamily: F.display, fontWeight: 400,
              fontSize: "clamp(20px, 2.4vw, 28px)",
              lineHeight: 1.3, letterSpacing: "-0.022em",
              color: "rgba(245,245,247,0.65)",
              maxWidth: 640, margin: "0 auto",
            }}>Child universes outgrow their parents. Your brain is already a hive mind. Neuralink is just monitoring a city by tapping a thousand phone lines.</p>
          </Reveal>
        </section>

        <Chapter label="Chapter I — Copy With Noise" title="Errors are the engine">
          <Reveal>
            <div style={{ ...serif, fontSize: 16, lineHeight: 1.7, color: ASH, maxWidth: 540, marginBottom: 32 }}>
              We assume copy = degradation. But every capability life has — <span style={{ color: GREEN }}>flight, sight, consciousness</span> — emerged from copying mistakes.
            </div>
          </Reveal>
          <CopyWithNoise />
        </Chapter>

        <Chapter label="Chapter II — Derivative Universes" title="The child outgrows the parent">
          <Reveal>
            <div style={{ ...serif, fontSize: 16, lineHeight: 1.7, color: ASH, maxWidth: 540, marginBottom: 32 }}>
              If a simulation has entropy, has noise, has imperfect copying... it's not running a script. It's running <span style={{ color: EMBER }}>evolution</span>. And evolution doesn't respect the intentions of its creator.
            </div>
          </Reveal>
          <UniverseTree />
        </Chapter>

        <Chapter label="Chapter III — The Bandwidth Gap" title="We're tapping 1,000 lines in a city of trillions">
          <Reveal>
            <div style={{ ...serif, fontSize: 16, lineHeight: 1.7, color: ASH, maxWidth: 540, marginBottom: 32 }}>
              Neuralink's first human implant reads ~1,024 channels from the motor cortex. Your brain has 100 trillion synaptic connections. The gap is <span style={{ color: EMBER }}>incomprehensible</span>.
            </div>
          </Reveal>
          <BandwidthMeter />
        </Chapter>

        <Chapter label="Chapter IV — The Hive Mind Spectrum" title="From isolation to dissolution">
          <Reveal>
            <div style={{ ...serif, fontSize: 16, lineHeight: 1.7, color: ASH, maxWidth: 540, marginBottom: 32 }}>
              If networked consciousness is coming, do you want to be in the first generation that merges? The last that doesn't? Or the messy middle?
            </div>
          </Reveal>
          <HiveMindScale />
        </Chapter>

        {/* CLOSER */}
        <section style={{ padding: "80px 0 120px", borderTop: `1px solid ${LINE}`, textAlign: "center" }}>
          <Reveal>
            <h2 style={{ ...sans, fontSize: "clamp(24px, 4.5vw, 36px)", fontWeight: 700, lineHeight: 1.15, maxWidth: 520, margin: "0 auto 20px" }}>
              No single neuron thinks <span style={{ color: GOLD }}>"I am you."</span><br />
              Yet here <span style={{ color: GHOST }}>you</span> are.
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <div style={{ ...mono, fontSize: 10, color: "rgba(255,255,255,0.12)", letterSpacing: 0.5, lineHeight: 2, marginTop: 56 }}>
              From a conversation between a human and a language model · 2025–2026
            </div>
          </Reveal>
        </section>

      </div>
    </div>
  );
}
