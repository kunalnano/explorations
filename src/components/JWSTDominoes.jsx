import { useState, useEffect, useRef } from "react";

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
const mono = { fontFamily: "'SF Mono', 'Cascadia Code', 'Consolas', monospace" };

function Reveal({ children, delay = 0 }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.unobserve(el); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(32px)",
      transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`,
    }}>{children}</div>
  );
}

function Chapter({ label, title, children }) {
  return (
    <section style={{ padding: "80px 0", borderTop: `1px solid ${LINE}` }}>
      <Reveal>
        <div style={{ ...mono, fontSize: 10, letterSpacing: 3, color: ICE, textTransform: "uppercase", marginBottom: 12 }}>{label}</div>
        <h2 style={{ ...sans, fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 700, lineHeight: 1.1, marginBottom: 40, maxWidth: 600 }}>{title}</h2>
      </Reveal>
      {children}
    </section>
  );
}

// ── DOMINO CATEGORIES ──
const DOMINOES = {
  foundational: {
    label: "Foundational Models",
    color: EMBER,
    items: [
      { name: "Big Bang theory", desc: "The foundational cosmological model is undermined if the CMB isn't a primordial snapshot" },
      { name: "Cosmic inflation", desc: "Loses its primary observational justification — the CMB was its strongest evidence" },
      { name: "ΛCDM model", desc: "The standard model of cosmology — key parameters become unreliable without CMB constraints" },
      { name: "Age of the universe", desc: "Must be recalculated if the CMB-based calibration is wrong" },
    ],
  },
  cmb: {
    label: "CMB-Dependent Findings",
    color: GHOST,
    items: [
      { name: "CMB power spectrum", desc: "Loses predictive relevance if the signal isn't primordial" },
      { name: "Acoustic peaks in CMB", desc: "No longer evidence of primordial sound waves — the cornerstone of baryon physics" },
      { name: "Polarization of CMB", desc: "Origin needs complete reassessment" },
      { name: "Gravitational lensing of CMB", desc: "Loses its standard interpretation framework" },
      { name: "ISW (Integrated Sachs–Wolfe) effect", desc: "Interpretation invalidated" },
      { name: "Planck and WMAP findings", desc: "Two decades of flagship space telescope data — foundational assumptions invalidated" },
    ],
  },
  darkSector: {
    label: "Dark Sector",
    color: ICE,
    items: [
      { name: "Dark energy", desc: "Inferred partly from CMB data — may be entirely mischaracterized" },
      { name: "Dark matter density", desc: "Current estimates derived from CMB constraints may be invalid" },
      { name: "Cosmic curvature", desc: "The inference that the universe is flat — challenged" },
    ],
  },
  structure: {
    label: "Structure & Distance",
    color: GREEN,
    items: [
      { name: "Large-scale structure formation", desc: "Initial conditions become unclear without CMB seeds" },
      { name: "Baryon acoustic oscillations", desc: "Decoupled from CMB if the signal source changes" },
      { name: "Hubble constant (H₀)", desc: "No longer reliably constrained by CMB — the tension gets worse" },
      { name: "Cosmic distance ladder", desc: "Calibration may be fundamentally flawed" },
      { name: "Reionization epoch", desc: "Timing and cause questioned" },
      { name: "Primordial nucleosynthesis", desc: "Needs an alternative explanation for light element abundances" },
      { name: "Matter–radiation equality timing", desc: "Must be re-evaluated from scratch" },
    ],
  },
};

function DominoCategory({ cat }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <Reveal>
      <div style={{
        background: expanded ? "rgba(255,255,255,0.04)" : FAINT,
        border: `1px solid ${expanded ? cat.color + "44" : LINE}`,
        borderRadius: 16, padding: "24px 20px", marginBottom: 14, cursor: "pointer",
        transition: "all 0.4s ease",
      }} onClick={() => setExpanded(!expanded)}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: expanded ? 16 : 0 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: cat.color + "18", border: `1px solid ${cat.color}33`,
            display: "flex", alignItems: "center", justifyContent: "center",
            ...mono, fontSize: 14, fontWeight: 700, color: cat.color,
          }}>{cat.items.length}</div>
          <div style={{ flex: 1, ...sans, fontSize: 17, fontWeight: 600 }}>{cat.label}</div>
          <div style={{ ...mono, fontSize: 16, color: ASH, transition: "transform 0.3s", transform: expanded ? "rotate(45deg)" : "rotate(0)" }}>+</div>
        </div>
        {expanded && (
          <div style={{ paddingLeft: 50 }}>
            {cat.items.map((item, i) => (
              <div key={i} style={{ padding: "10px 0", borderBottom: i < cat.items.length - 1 ? `1px solid ${LINE}` : "none" }}>
                <div style={{ ...sans, fontSize: 14, fontWeight: 600, color: cat.color, marginBottom: 3 }}>{item.name}</div>
                <div style={{ ...serif, fontSize: 13, color: ASH, lineHeight: 1.5 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Reveal>
  );
}

// ── COUNTER ANIMATION ──
function AnimatedCount({ target }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        let c = 0;
        const interval = setInterval(() => {
          c++;
          setCount(c);
          if (c >= target) clearInterval(interval);
        }, 80);
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{count}</span>;
}


// ═══════════════ MAIN ═══════════════
export default function JWSTDominoes({ onBack }) {
  const totalDominoes = Object.values(DOMINOES).reduce((a, c) => a + c.items.length, 0);

  return (
    <div style={{ background: BG, minHeight: "100vh", color: BONE }}>
      <div style={{
        position: "fixed", inset: 0, zIndex: 999, pointerEvents: "none", opacity: 0.03,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }} />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 720, margin: "0 auto", padding: "0 24px" }}>

        <div style={{ paddingTop: 32 }}>
          <button onClick={onBack} style={{ background: "none", border: "none", color: ASH, cursor: "pointer", ...mono, fontSize: 11, letterSpacing: 2, padding: "8px 0" }}>← EXPLORATIONS</button>
        </div>

        {/* HERO */}
        <div style={{ padding: "80px 0 60px" }}>
          <Reveal>
            <div style={{ ...mono, fontSize: 10, letterSpacing: 4, color: EMBER, textTransform: "uppercase", marginBottom: 20 }}>
              When one telescope rewrites the textbooks
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <h1 style={{ ...sans, fontSize: "clamp(36px, 7vw, 56px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: -2, marginBottom: 24 }}>
              The Cosmic<br /><span style={{ color: EMBER }}>Domino Collapse</span>
            </h1>
          </Reveal>
          <Reveal delay={0.3}>
            <div style={{ ...serif, fontSize: 20, lineHeight: 1.7, color: ASH, maxWidth: 540, fontStyle: "italic" }}>
              The James Webb Space Telescope keeps delivering massive L's for astrophysics.
              If these findings hold, <span style={{ color: BONE }}><AnimatedCount target={totalDominoes} /> flagship findings</span> of
              modern cosmology are thrown into question.
            </div>
          </Reveal>
        </div>

        {/* CH I: THE DISCOVERY */}
        <Chapter label="Chapter I — The Discovery" title="Early Mature Galaxies shouldn't exist">
          <Reveal>
            <div style={{ ...serif, fontSize: 17, lineHeight: 1.85, color: BONE, maxWidth: 560 }}>
              JWST discovered <span style={{ color: ICE }}>Early Mature Galaxies (EMGs)</span> — massive,
              fully-formed galaxies that existed far earlier than any model predicted. They crushed the
              existing models of galaxy formation because they formed much earlier than astrophysicists
              thought possible.
              <br /><br />
              But it got worse.
              <br /><br />
              A new paper shows that the energy output of these EMGs can account for the{" "}
              <span style={{ color: EMBER }}>entire energy density</span> of the Cosmic Microwave Background
              Radiation — the CMB.
            </div>
          </Reveal>
        </Chapter>

        {/* CH II: WHY THIS MATTERS */}
        <Chapter label="Chapter II — Why This Matters" title="The CMB was the foundation of everything">
          <Reveal>
            <div style={{ ...serif, fontSize: 17, lineHeight: 1.85, color: BONE, maxWidth: 560, marginBottom: 32 }}>
              The CMB was believed to be a <span style={{ color: GOLD }}>snapshot of the first light</span>{" "}
              emitted after the Big Bang, when the universe was approximately 379,000 years old. The
              tiny variations in its temperature were believed to be relics of quantum fluctuations in
              the dense primordial plasma.
              <br /><br />
              Nearly every major result in modern cosmology — from dark matter estimates to the age
              of the universe to the geometry of spacetime — was <span style={{ color: EMBER }}>calibrated
              against this signal</span>.
              <br /><br />
              If the CMB isn't primordial — if it's just the aggregate glow of early galaxies —
              then the calibration standard for modern cosmology was wrong from the start.
            </div>
          </Reveal>

          <Reveal>
            <div style={{
              padding: "28px 24px", background: EMBER + "08", border: `1px solid ${EMBER}22`,
              borderRadius: 16,
            }}>
              <div style={{ ...sans, fontSize: 16, fontWeight: 600, color: EMBER, marginBottom: 10 }}>
                The analogy
              </div>
              <div style={{ ...serif, fontSize: 15, lineHeight: 1.7, color: ASH }}>
                Imagine you built an entire city's infrastructure — roads, bridges, power grid —
                based on a survey map. Then someone proved the map was actually a photograph of a
                different landscape that happened to look similar. Every measurement, every alignment,
                every calculation derived from that map is now suspect.
              </div>
            </div>
          </Reveal>
        </Chapter>

        {/* CH III: THE DOMINOES */}
        <Chapter label="Chapter III — The Dominoes" title={`${totalDominoes} findings thrown into question`}>
          <Reveal>
            <div style={{ ...serif, fontSize: 16, lineHeight: 1.7, color: ASH, maxWidth: 540, marginBottom: 32 }}>
              Click each category to see what falls. These aren't fringe predictions —
              they're the flagship results of decades of precision cosmology.
            </div>
          </Reveal>

          {Object.values(DOMINOES).map((cat, i) => <DominoCategory key={i} cat={cat} />)}
        </Chapter>

        {/* CH IV: THE CAVEAT */}
        <Chapter label="Chapter IV — The Caveat" title="Science doesn't collapse in a day">
          <Reveal>
            <div style={{ ...serif, fontSize: 17, lineHeight: 1.85, color: BONE, maxWidth: 560 }}>
              A few things to hold in mind before panic:
              <br /><br />
              <span style={{ color: GREEN }}>This is one paper.</span> Extraordinary claims require
              extraordinary evidence. The claim that EMGs account for the entire CMB energy density
              needs independent replication, cross-validation with other datasets, and peer scrutiny.
              <br /><br />
              <span style={{ color: GREEN }}>ΛCDM is battle-tested.</span> The standard model has
              survived decades of challenges. Many "revolutionary" findings have been absorbed into
              refined versions of the existing framework rather than replacing it entirely.
              <br /><br />
              <span style={{ color: GREEN }}>Science is designed for this.</span> The process of
              observation → challenge → revision is working exactly as intended. JWST was literally
              built to find things that challenge our models.
              <br /><br />
              <span style={{ color: EMBER }}>But</span> — if the findings are replicated, this isn't
              a minor adjustment. It's a foundation-level crack that propagates through everything
              built on top of it. The dominos above aren't hypothetical — they're the logical
              consequences of losing the CMB as a primordial signal.
            </div>
          </Reveal>

          <Reveal>
            <div style={{
              padding: "28px 24px", background: GHOST + "08", border: `1px solid ${GHOST}22`,
              borderRadius: 16, marginTop: 32,
            }}>
              <div style={{ ...sans, fontSize: 16, fontWeight: 600, color: GHOST, marginBottom: 10 }}>
                The meta-lesson
              </div>
              <div style={{ ...serif, fontSize: 15, lineHeight: 1.7, color: ASH }}>
                The history of science is the history of wrong-but-useful models being replaced
                by less-wrong-but-more-useful models. Newtonian gravity was "wrong" but it got us
                to the moon. The CMB interpretation may have been "wrong" but it bootstrapped
                precision cosmology. What matters is what comes next.
              </div>
            </div>
          </Reveal>
        </Chapter>

        {/* CLOSER */}
        <section style={{ padding: "80px 0 120px", borderTop: `1px solid ${LINE}`, textAlign: "center" }}>
          <Reveal>
            <h2 style={{ ...sans, fontSize: "clamp(24px, 4.5vw, 38px)", fontWeight: 700, lineHeight: 1.15, maxWidth: 540, margin: "0 auto 20px" }}>
              The universe doesn't care about our models.<br />
              It just keeps <span style={{ color: EMBER }}>showing us what's real</span>.
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <div style={{ ...mono, fontSize: 10, color: "rgba(255,255,255,0.12)", letterSpacing: 0.5, lineHeight: 2, marginTop: 56 }}>
              From a conversation between a human and a language model · 2025
            </div>
          </Reveal>
        </section>

      </div>
    </div>
  );
}
