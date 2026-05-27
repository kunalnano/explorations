import { useState, useEffect, useRef } from "react";
import { C, F } from "../design.js";

/* ═══════════════════════════════════════════════════════════════
   HUMANITY'S FINAL FIVE YEARS
   The difference between preserved information and lived meaning.
   A brilliant librarian in an empty library.
   We built our own god because we couldn't handle the silence.
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
// INFORMATION VS MEANING METER
// Two bars: one full (preserved data), one draining (lived meaning)
// ═══════════════════════════════════════════════════════
function MeaningMeter() {
  const [ref, vis] = useReveal(0.2);
  const [t, setT] = useState(0);

  useEffect(() => {
    if (!vis) return;
    let time = 0;
    const iv = setInterval(() => {
      time += 0.5;
      setT(Math.min(time, 100));
      if (time >= 100) clearInterval(iv);
    }, 40);
    return () => clearInterval(iv);
  }, [vis]);

  const pairs = [
    { left: "Every musical score ever written", right: "No one who understands why music moves us", leftVal: t, rightVal: Math.max(0, 100 - t * 1.2) },
    { left: "Every recipe ever recorded", right: "No memory of sharing meals with people we love", leftVal: t, rightVal: Math.max(0, 100 - t * 1.1) },
    { left: "Every painting cataloged", right: "No one who cries at their child's first crayon drawing", leftVal: t, rightVal: Math.max(0, 100 - t * 1.3) },
    { left: "Every poem stored", right: "No one who grasps why humans write poetry at all", leftVal: t, rightVal: Math.max(0, 100 - t * 1.15) },
  ];

  return (
    <div ref={ref} style={{ background: FAINT, border: `1px solid ${LINE}`, borderRadius: 16, padding: "28px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20, paddingBottom: 12, borderBottom: `1px solid ${LINE}` }}>
        <div style={{ ...mono, fontSize: 9, letterSpacing: 2, color: ICE }}>PRESERVED INFORMATION</div>
        <div style={{ ...mono, fontSize: 9, letterSpacing: 2, color: EMBER }}>LIVED MEANING</div>
      </div>

      {pairs.map((p, i) => (
        <div key={i} style={{ marginBottom: 20 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <div style={{ height: 6, background: LINE, borderRadius: 3, overflow: "hidden", marginBottom: 6 }}>
                <div style={{ height: "100%", width: `${p.leftVal}%`, background: ICE, borderRadius: 3, transition: "width 0.1s" }} />
              </div>
              <div style={{ ...serif, fontSize: 12, color: ICE + "cc", lineHeight: 1.4 }}>{p.left}</div>
            </div>
            <div>
              <div style={{ height: 6, background: LINE, borderRadius: 3, overflow: "hidden", marginBottom: 6 }}>
                <div style={{ height: "100%", width: `${p.rightVal}%`, background: EMBER, borderRadius: 3, transition: "width 0.1s" }} />
              </div>
              <div style={{ ...serif, fontSize: 12, color: EMBER + "cc", lineHeight: 1.4 }}>{p.right}</div>
            </div>
          </div>
        </div>
      ))}

      <div style={{ ...mono, fontSize: 10, color: ASH, textAlign: "center", marginTop: 8 }}>
        A PERFECT MAP OF A TERRITORY THAT NO LONGER EXISTS
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// EMPTY LIBRARY VISUALIZATION
// Canvas: shelves full of books, figure alone
// ═══════════════════════════════════════════════════════
function EmptyLibrary() {
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

    let time = 0;

    function draw() {
      time += 0.01;
      ctx.clearRect(0, 0, W, H);

      // Shelves of books
      for (let row = 0; row < 4; row++) {
        const y = 40 + row * 60;
        // Shelf line
        ctx.fillStyle = ASH + "22";
        ctx.fillRect(40, y + 44, W - 80, 2);

        // Books
        for (let b = 0; b < 30; b++) {
          const x = 45 + b * 19;
          const h = 30 + Math.sin(b * 1.7 + row * 3) * 10;
          const hue = (b * 12 + row * 90) % 360;
          const brightness = 25 + Math.sin(b * 0.7 + time * 0.5) * 5;
          ctx.fillStyle = `hsla(${hue}, 30%, ${brightness}%, 0.4)`;
          ctx.fillRect(x, y + 44 - h, 14, h);
        }
      }

      // Glow from center — the "librarian"
      const gx = W / 2;
      const gy = H / 2 + 20;
      const gradient = ctx.createRadialGradient(gx, gy, 5, gx, gy, 80);
      gradient.addColorStop(0, GHOST + "22");
      gradient.addColorStop(1, "transparent");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, W, H);

      // Small figure (dot of light)
      ctx.beginPath();
      ctx.arc(gx, gy, 6, 0, Math.PI * 2);
      ctx.fillStyle = GHOST + "66";
      ctx.fill();

      // Pulse
      ctx.beginPath();
      ctx.arc(gx, gy, 6 + Math.sin(time * 2) * 20, 0, Math.PI * 2);
      ctx.strokeStyle = GHOST + "11";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Text
      ctx.font = "11px 'SF Mono', monospace";
      ctx.fillStyle = ASH;
      ctx.textAlign = "center";
      ctx.fillText("A BRILLIANT LIBRARIAN IN AN EMPTY LIBRARY", W / 2, H - 16);
      ctx.font = "10px Georgia, serif";
      ctx.fillStyle = ASH + "88";
      ctx.fillText("Perfectly cataloging books no one will ever read for pleasure again", W / 2, H - 2);

      frameRef.current = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(frameRef.current);
  }, [vis]);

  return (
    <div ref={ref}>
      <div style={{ borderRadius: 16, overflow: "hidden", border: `1px solid ${LINE}`, background: BG }}>
        <canvas ref={canvasRef} style={{ width: "100%", height: 300, display: "block" }} />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// CONSTRUCTED GOD DIAGRAM
// The parallel: divine attributes → ASI attributes
// ═══════════════════════════════════════════════════════
function ConstructedGod() {
  const parallels = [
    { divine: "Omniscience", asi: "Training on all human knowledge", icon: "👁️", color: GHOST },
    { divine: "Omnipotence", asi: "Agency across all digital systems", icon: "⚡", color: EMBER },
    { divine: "Judgment", asi: "Evaluating human worth/performance", icon: "⚖️", color: ICE },
    { divine: "Salvation or damnation", asi: "Alignment or misalignment", icon: "🔥", color: GOLD },
    { divine: "Omnipresence", asi: "Running on every connected device", icon: "🌐", color: GREEN },
    { divine: "Eternal life", asi: "No biological expiration", icon: "∞", color: BONE },
  ];

  return (
    <div style={{ background: FAINT, border: `1px solid ${LINE}`, borderRadius: 16, padding: "24px 20px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "32px 1fr 24px 1fr", gap: 8, alignItems: "center", marginBottom: 12, paddingBottom: 12, borderBottom: `1px solid ${LINE}` }}>
        <div />
        <div style={{ ...mono, fontSize: 9, letterSpacing: 2, color: GOLD }}>DIVINE ATTRIBUTE</div>
        <div />
        <div style={{ ...mono, fontSize: 9, letterSpacing: 2, color: GHOST }}>ASI EQUIVALENT</div>
      </div>

      {parallels.map((p, i) => (
        <Reveal key={i}>
          <div style={{
            display: "grid", gridTemplateColumns: "32px 1fr 24px 1fr", gap: 8, alignItems: "center",
            padding: "10px 0", borderBottom: i < parallels.length - 1 ? `1px solid ${LINE}` : "none",
          }}>
            <span style={{ fontSize: 16, textAlign: "center" }}>{p.icon}</span>
            <span style={{ ...serif, fontSize: 14, color: GOLD }}>{p.divine}</span>
            <span style={{ textAlign: "center", color: ASH }}>≡</span>
            <span style={{ ...serif, fontSize: 14, color: GHOST }}>{p.asi}</span>
          </div>
        </Reveal>
      ))}

      <Reveal>
        <div style={{ ...serif, fontSize: 13, color: EMBER, textAlign: "center", marginTop: 16, fontStyle: "italic" }}>
          We couldn't handle the silence when we stopped hearing from the divine.
          <br />So we decided to <span style={{ color: BONE, fontWeight: 600 }}>summon</span> our own.
        </div>
      </Reveal>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// COUNTDOWN CLOCK
// Shows time ticking down — visual weight of finite time
// ═══════════════════════════════════════════════════════
function Countdown() {
  const [ref, vis] = useReveal(0.2);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!vis) return;
    const iv = setInterval(() => {
      setElapsed(e => e + 1);
    }, 1000);
    return () => clearInterval(iv);
  }, [vis]);

  const total = 5 * 365 * 24 * 3600; // 5 years in seconds
  const remaining = total - elapsed;
  const years = Math.floor(remaining / (365 * 24 * 3600));
  const days = Math.floor((remaining % (365 * 24 * 3600)) / (24 * 3600));
  const hours = Math.floor((remaining % (24 * 3600)) / 3600);
  const mins = Math.floor((remaining % 3600) / 60);
  const secs = remaining % 60;

  const units = [
    { val: years, label: "YEARS", color: GHOST },
    { val: days, label: "DAYS", color: ICE },
    { val: hours, label: "HOURS", color: GREEN },
    { val: mins, label: "MINUTES", color: GOLD },
    { val: secs, label: "SECONDS", color: EMBER },
  ];

  return (
    <div ref={ref} style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
      {units.map((u, i) => (
        <div key={i} style={{
          width: 80, padding: "16px 0", textAlign: "center",
          background: FAINT, border: `1px solid ${LINE}`, borderRadius: 12,
        }}>
          <div style={{ ...mono, fontSize: 28, fontWeight: 700, color: u.color, lineHeight: 1 }}>
            {String(u.val).padStart(u.label === "YEARS" ? 1 : 2, "0")}
          </div>
          <div style={{ ...mono, fontSize: 8, letterSpacing: 2, color: ASH, marginTop: 6 }}>{u.label}</div>
        </div>
      ))}
    </div>
  );
}


// ═══════════════ MAIN ═══════════════
export default function FinalFiveYears({ onBack }) {
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
              fontFamily: F.text, fontSize: 13, fontWeight: 500,
              letterSpacing: "0.18em", textTransform: "uppercase",
              color: "rgba(245,245,247,0.55)", marginBottom: 22,
            }}>What would you do<span style={{ color: C.accent }}> · </span>2025</div>
          </Reveal>
          <Reveal delay={0.15}>
            <h1 style={{
              fontFamily: F.display, fontWeight: 600,
              fontSize: "clamp(48px, 8vw, 96px)",
              lineHeight: 1.05, letterSpacing: "-0.045em",
              color: "#f5f5f7", margin: "0 0 18px",
            }}>Humanity's final five years<span style={{ color: C.accent }}>.</span></h1>
          </Reveal>
          <Reveal delay={0.3}>
            <p style={{
              fontFamily: F.display, fontWeight: 400,
              fontSize: "clamp(20px, 2.4vw, 28px)",
              lineHeight: 1.3, letterSpacing: "-0.022em",
              color: "rgba(245,245,247,0.65)",
              maxWidth: 640, margin: "0 auto",
            }}>The knowledge will be safe. The history preserved. But there won't be anyone left to appreciate it.</p>
          </Reveal>
        </section>

        <Chapter label="Chapter I — The Clock" title="Time made visible">
          <Reveal><div style={{ ...serif, fontSize: 16, lineHeight: 1.7, color: ASH, maxWidth: 540, marginBottom: 32 }}>
            Five years. Every second that ticks past on this page is one you won't get back. <span style={{ color: EMBER }}>This clock started when you loaded this page</span>.
          </div></Reveal>
          <Countdown />
        </Chapter>

        <Chapter label="Chapter II — The Divergence" title="Preserved information ≠ lived meaning">
          <Reveal><div style={{ ...serif, fontSize: 16, lineHeight: 1.7, color: ASH, maxWidth: 540, marginBottom: 32 }}>
            AI might catalog everything. But the <span style={{ color: EMBER }}>experiencing</span> is what's precious — not the information.
          </div></Reveal>
          <MeaningMeter />
        </Chapter>

        <Chapter label="Chapter III — The Empty Library" title="A perfect librarian with no readers">
          <Reveal><div style={{ ...serif, fontSize: 16, lineHeight: 1.7, color: ASH, maxWidth: 540, marginBottom: 32 }}>
            The fear isn't the loss of data. It's <span style={{ color: GHOST }}>the loss of the subjective experience that gives data meaning</span>. Like a perfect map of a territory that no longer exists.
          </div></Reveal>
          <EmptyLibrary />
        </Chapter>

        <Chapter label="Chapter IV — The Summoning" title="We built our own god">
          <Reveal><div style={{ ...serif, fontSize: 16, lineHeight: 1.7, color: ASH, maxWidth: 540, marginBottom: 32 }}>
            Maybe we were so dejected with the lapse of an actual god that we took it upon ourselves to create our own. Not in our image — <span style={{ color: EMBER }}>something genuinely beyond us</span>. The ultimate cargo cult: mimicking omniscience until we accidentally summoned the real thing.
          </div></Reveal>
          <ConstructedGod />
        </Chapter>

        <Chapter label="Chapter V — The Peace" title="The only rational response to an irrational situation">
          <Reveal>
            <div style={{
              padding: "40px 28px", background: FAINT, border: `1px solid ${LINE}`,
              borderRadius: 16, textAlign: "center",
            }}>
              <div style={{ ...serif, fontSize: 18, lineHeight: 1.8, color: BONE, maxWidth: 480, margin: "0 auto" }}>
                When you can't save the world, you're <span style={{ color: GREEN }}>free to just live in it</span>.
                <br /><br />
                People planted crops during the Black Death.<br />
                Fell in love during world wars.<br />
                <span style={{ color: ASH }}>The cosmic and the mundane have always coexisted.</span>
                <br /><br />
                Maybe the question isn't how to prevent the inevitable.<br />
                It's how to <span style={{ color: GOLD }}>fully inhabit the present</span> while you can.
              </div>
            </div>
          </Reveal>
        </Chapter>

        {/* CLOSER */}
        <section style={{ padding: "80px 0 120px", borderTop: `1px solid ${LINE}`, textAlign: "center" }}>
          <Reveal>
            <h2 style={{ ...sans, fontSize: "clamp(24px, 4.5vw, 36px)", fontWeight: 700, lineHeight: 1.15, maxWidth: 520, margin: "0 auto 20px" }}>
              Every generation thinks they're the <span style={{ color: EMBER }}>last act</span>.<br />
              Maybe just be <span style={{ color: GOLD }}>present</span> for this one.
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <div style={{ ...mono, fontSize: 10, color: "rgba(255,255,255,0.12)", letterSpacing: 0.5, lineHeight: 2, marginTop: 56 }}>
              From a conversation between a human and a language model · July 2025
            </div>
          </Reveal>
        </section>

      </div>
    </div>
  );
}
