import { useState, useEffect, useRef } from "react";
import { C, F } from "../design.js";
import {
  DoubleHelixVis,
  DataOceanVis,
  BrainArchitectureVis,
  CredentialismTimeline,
  ComputeGoldToggle,
  GitaCycleVis,
  InnovationStackVis,
} from "./IntelligenceAsCurrencyVis";

/* ═══════════════════════════════════════════════════════════════
   INTELLIGENCE AS CURRENCY
   The Compounding Spiral.
   Seven theses on why intelligence compounds, credentialism
   collapses, and compute is the new gold.
   ═══════════════════════════════════════════════════════════════ */

const BG = "#050508";
const BONE = "#e8e4dc";
const ASH = "#4a4860";
const GHOST = "#9b8fff";
const GOLD = "#fbbf24";
const GREEN = "#34d399";
const ICE = "#6ee7f0";
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

// ═══════════════ MAIN ═══════════════
export default function IntelligenceAsCurrency({ onBack }) {
  return (
    <div style={{ background: BG, minHeight: "100vh", color: BONE }}>
      <div style={{
        position: "fixed", inset: 0, zIndex: 999, pointerEvents: "none", opacity: 0.03,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }} />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 720, margin: "0 auto", padding: "0 24px" }}>

        {/* ═══ HERO — Apple-direction, hairline accent above eyebrow, gold period ═══ */}
        <section style={{ padding: "112px 22px 80px", textAlign: "center" }}>
          <Reveal>
            <div style={{
              width: 56, height: 1, background: C.accent,
              margin: "0 auto 28px", opacity: 0.85,
            }} />
          </Reveal>
          <Reveal>
            <div style={{
              fontFamily: F.text, fontSize: 13, fontWeight: 500,
              letterSpacing: "0.18em", textTransform: "uppercase",
              color: "rgba(245,245,247,0.55)", marginBottom: 28,
            }}>The Compounding Spiral</div>
          </Reveal>
          <Reveal delay={0.15}>
            <h1 style={{
              fontFamily: F.display, fontWeight: 600,
              fontSize: "clamp(48px, 8vw, 96px)",
              lineHeight: 1.04, letterSpacing: "-0.045em",
              margin: "0 0 22px", color: "#f5f5f7",
            }}>
              Intelligence as currency<span style={{ color: GOLD }}>.</span>
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
              Seven theses on why intelligence compounds, credentialism collapses, and compute is the new gold.
            </p>
          </Reveal>
        </section>

        <Chapter label="Thesis I — The Double Helix" title="The compounding loop">
          <Reveal><div style={{ ...serif, fontSize: 16, lineHeight: 1.7, color: ASH, maxWidth: 540, marginBottom: 32 }}>
            Better tools make better users who extract more from better tools. The spiral <span style={{ color: GOLD }}>compounds</span>. Each revolution lifts both strands higher. The human who learns to orchestrate AI becomes a better prompt for the next generation of AI.
          </div></Reveal>
          <DoubleHelixVis />
        </Chapter>

        <Chapter label="Thesis II — The Brain as Data Model" title="Navigation, not storage">
          <Reveal><div style={{ ...serif, fontSize: 16, lineHeight: 1.7, color: ASH, maxWidth: 540, marginBottom: 32 }}>
            Human cognition isn't a hard drive. It's a <span style={{ color: ICE }}>navigational template</span> over an ocean of data. You don't need to store it all. You need to know where to sail and what to pull up from the depths.
          </div></Reveal>
          <DataOceanVis />
        </Chapter>

        <Chapter label="Thesis III — Architecture Over Scale" title="Connectivity beats volume">
          <Reveal><div style={{ ...serif, fontSize: 16, lineHeight: 1.7, color: ASH, maxWidth: 540, marginBottom: 32 }}>
            A sperm whale brain weighs 8 kilograms. A human brain weighs 1.4. The human brain wins because of <span style={{ color: GREEN }}>connectivity patterns</span>, not raw volume. The same principle applies to AI: architectural innovation outpaces brute-force scaling.
          </div></Reveal>
          <BrainArchitectureVis />
        </Chapter>

        <Chapter label="Thesis IV — Credentialism Collapsing" title="The 16th century monk">
          <Reveal><div style={{ ...serif, fontSize: 16, lineHeight: 1.7, color: ASH, maxWidth: 540, marginBottom: 32 }}>
            The monk who memorized scripture was valuable. Then the printing press arrived and <span style={{ color: GOLD }}>memorization stopped being the scarce resource</span>. Every technological shift moves the value layer up. We're watching it happen again.
          </div></Reveal>
          <CredentialismTimeline />
        </Chapter>

        <Chapter label="Thesis V — Compute as the New Gold" title="But generative, not inert">
          <Reveal><div style={{ ...serif, fontSize: 16, lineHeight: 1.7, color: ASH, maxWidth: 540, marginBottom: 32 }}>
            Gold just sits there. Compute <span style={{ color: GREEN }}>generates</span>. But possession without orchestration architecture is worthless. A GPU farm without taste is a space heater.
          </div></Reveal>
          <ComputeGoldToggle />
        </Chapter>

        <Chapter label="Thesis VI — The Gita Thesis" title="The gap between knowing and acting">
          <Reveal><div style={{ ...serif, fontSize: 16, lineHeight: 1.7, color: ASH, maxWidth: 540, marginBottom: 32 }}>
            The Bhagavad Gita's central tension: Arjuna <span style={{ color: GHOST }}>knows</span> what's right but can't act. The gap between knowing and acting is where suffering lives. AI compresses the know-act-reflect-adjust loop. It doesn't eliminate the gap. It <span style={{ color: GREEN }}>shrinks the cycle time</span>.
          </div></Reveal>
          <GitaCycleVis />
        </Chapter>

        <Chapter label="Thesis VII — The Category Error" title="Why AI isn't a bubble">
          <Reveal><div style={{ ...serif, fontSize: 16, lineHeight: 1.7, color: ASH, maxWidth: 540, marginBottom: 32 }}>
            Tulips were one layer of speculation. The internet in 1997 had simultaneous innovation at infrastructure, protocol, application, and integration layers. AI today has <span style={{ color: GREEN }}>innovation at every layer of the stack simultaneously</span>. That's not a bubble. That's a phase transition.
          </div></Reveal>
          <InnovationStackVis />
        </Chapter>

        {/* Closing section */}
        <section style={{ padding: "80px 0 120px", borderTop: `1px solid ${LINE}`, textAlign: "center" }}>
          <Reveal>
            <div style={{ ...serif, fontSize: 20, lineHeight: 1.7, color: BONE, maxWidth: 520, margin: "0 auto 32px", fontStyle: "italic" }}>
              "We don't know what we don't know, and it's very hard to baseline."
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div style={{ ...serif, fontSize: 20, lineHeight: 1.7, color: BONE, maxWidth: 520, margin: "0 auto 40px", fontStyle: "italic" }}>
              "Just because you know you're smart doesn't make you smart enough to know what to do."
            </div>
          </Reveal>
          <Reveal delay={0.4}>
            <div style={{ ...mono, fontSize: 11, color: GOLD, letterSpacing: 1, marginBottom: 8 }}>
              — H.S., March 8, 2026
            </div>
          </Reveal>
          <Reveal delay={0.5}>
            <div style={{ ...mono, fontSize: 10, color: "rgba(255,255,255,0.12)", letterSpacing: 0.5, lineHeight: 2, marginTop: 40 }}>
              From a conversation between a human and a language model · March 2026
            </div>
          </Reveal>
        </section>

      </div>
    </div>
  );
}
