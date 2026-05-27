import { C, F } from "../design.js";
import {
  BG, BONE, ASH, ICE, EMBER, GHOST, GOLD, GREEN, FAINT, LINE,
  sans, serif, mono, TIERS,
  Reveal, Chapter,
  TierExplorer, EntropyRatchet, CeilingBreaker,
  LimitReveal, TreadmillVis, LiberationTrap,
} from "./AlsLimitVisuals";

/* ═══════════════════════════════════════════════════════════════
   AL'S LIMIT — A Kardashev Scale for Software Complexity
   Software systems grow through discrete cognitive complexity
   regimes. Each transition feels like liberation but actually
   unlocks the next entropy regime.
   ═══════════════════════════════════════════════════════════════ */

export default function AlsLimit({ onBack }) {
  return (
    <div style={{ background: BG, minHeight: "100vh", color: BONE, ...sans }}>
      {/* ═══ HERO — Apple-direction, gold period + hairline accent under title ═══ */}
      <header style={{
        padding: "112px 22px 80px", textAlign: "center", position: "relative",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: `radial-gradient(ellipse 60% 40% at 50% 50%, ${GHOST}08, transparent)`,
          pointerEvents: "none",
        }} />

        <div style={{ position: "relative", maxWidth: 1024, margin: "0 auto" }}>
          <Reveal>
            <p style={{
              fontFamily: F.text, fontSize: 13, fontWeight: 500,
              letterSpacing: "0.18em", textTransform: "uppercase",
              color: "rgba(245,245,247,0.55)", margin: "0 0 28px",
            }}>A Kardashev Scale for Software Complexity</p>
          </Reveal>

          <Reveal delay={0.15}>
            <h1 style={{
              fontFamily: F.display, fontWeight: 600,
              fontSize: "clamp(48px, 8vw, 96px)",
              lineHeight: 1.02, letterSpacing: "-0.045em",
              margin: "0 0 22px", color: "#f5f5f7",
            }}>
              Al&rsquo;s limit<span style={{ color: GOLD }}>.</span>
            </h1>
          </Reveal>

          <Reveal delay={0.25}>
            <div style={{
              width: 56, height: 1, background: C.accent,
              margin: "0 auto 28px", opacity: 0.8,
            }} />
          </Reveal>

          <Reveal delay={0.3}>
            <p style={{
              fontFamily: F.display, fontWeight: 400,
              fontSize: "clamp(20px, 2.4vw, 28px)",
              lineHeight: 1.32, letterSpacing: "-0.022em",
              color: "rgba(245,245,247,0.65)",
              maxWidth: 640, margin: "0 auto",
            }}>
              Software systems grow through discrete cognitive complexity regimes. AI doesn&rsquo;t eliminate these transitions. It enables them.
            </p>
          </Reveal>
        </div>
      </header>

      {/* Content */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 120px" }}>

        <Chapter label="Chapter I" title="Four Regimes of Cognitive Complexity" color={GHOST}>
          <Reveal>
            <p style={{ ...serif, fontSize: 16, color: "#94A3B8", lineHeight: 1.8, maxWidth: 600, marginBottom: 40 }}>
              Nikolai Kardashev measured civilizations by their energy consumption.
              Software complexity follows the same pattern, but the currency is cognition, not watts.
              Each tier isn't just "more complex." It's a fundamentally different kind of complex.
            </p>
          </Reveal>
          <TierExplorer />
        </Chapter>

        <Chapter label="Chapter II" title="The Entropy Ratchet" color={EMBER}>
          <Reveal>
            <p style={{ ...serif, fontSize: 16, color: "#94A3B8", lineHeight: 1.8, maxWidth: 600, marginBottom: 40 }}>
              Difficulty only goes one direction in practice. Like Bitcoin mining, the computational
              effort stays constant but the yield per unit of effort degrades with each tier.
              The ratchet only turns one way.
            </p>
          </Reveal>
          <EntropyRatchet />
        </Chapter>

        <Chapter label="Chapter III" title="The Phase Transition" color={GOLD}>
          <Reveal>
            <p style={{ ...serif, fontSize: 16, color: "#94A3B8", lineHeight: 1.8, maxWidth: 600, marginBottom: 40 }}>
              The ceiling between tiers isn't a gradual slope. It's a phase transition.
              One day everything works. Then you add one more thing, and the old approach
              doesn't just slow down. It structurally fails.
            </p>
          </Reveal>
          <CeilingBreaker />
        </Chapter>

        <Chapter label="Chapter IV" title="Liberation as Trap" color={ICE}>
          <Reveal>
            <p style={{ ...serif, fontSize: 16, color: "#94A3B8", lineHeight: 1.8, maxWidth: 600, marginBottom: 40 }}>
              Each tier transition feels like freedom. AI lets you break through the ceiling.
              But breaking through doesn't remove the ceiling above. It just reveals the next one.
            </p>
          </Reveal>
          <LiberationTrap />
        </Chapter>

        <Chapter label="Chapter V" title="The Limit" color={EMBER}>
          <Reveal>
            <p style={{ ...serif, fontSize: 16, color: "#94A3B8", lineHeight: 1.8, maxWidth: 600, marginBottom: 40 }}>
              Two limits share a name. One is personal. One is universal. Both are real.
            </p>
          </Reveal>
          <LimitReveal />
        </Chapter>

        <Chapter label="Coda" title="The Treadmill" color={ASH}>
          <TreadmillVis />
        </Chapter>

        <Reveal>
          <div style={{ borderTop: `1px solid ${LINE}`, paddingTop: 40, textAlign: "center" }}>
            <p style={{ ...serif, fontSize: 14, color: ASH, fontStyle: "italic", marginBottom: 8 }}>
              "The treadmill doesn't stop. It just gets a bigger motor."
            </p>
            <p style={{ ...mono, fontSize: 9, color: ASH, letterSpacing: 2 }}>AL'S LIMIT — 2026</p>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
