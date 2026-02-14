import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════════════
   TECHNOLOGY AS ENTROPY
   Technology is a fundamental force of the universe — once complex
   enough, its march toward ASI becomes thermodynamically inevitable.
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

// ── THEORY CARD ──
function TheoryCard({ name, thinker, color, core, connection, limitation }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <Reveal>
      <div onClick={() => setExpanded(!expanded)} style={{
        background: expanded ? "rgba(255,255,255,0.04)" : FAINT,
        border: `1px solid ${expanded ? color + "44" : LINE}`,
        borderRadius: 16, padding: "24px 20px", marginBottom: 14, cursor: "pointer",
        transition: "all 0.4s ease",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: expanded ? 16 : 0 }}>
          <div style={{ width: 8, height: 8, borderRadius: 4, background: color, flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ ...sans, fontSize: 17, fontWeight: 600 }}>{name}</div>
            <div style={{ ...serif, fontSize: 13, color: ASH, fontStyle: "italic" }}>{thinker}</div>
          </div>
          <div style={{ ...mono, fontSize: 16, color: ASH, transition: "transform 0.3s", transform: expanded ? "rotate(45deg)" : "rotate(0)" }}>+</div>
        </div>
        {expanded && (
          <div style={{ paddingLeft: 22 }}>
            {[
              { label: "CORE IDEA", text: core, c: color },
              { label: "CONNECTION TO ENTROPY THESIS", text: connection, c: GREEN },
              { label: "WHERE IT FALLS SHORT", text: limitation, c: EMBER },
            ].map((r, i) => (
              <div key={i} style={{ marginBottom: 14 }}>
                <div style={{ ...mono, fontSize: 9, letterSpacing: 2, color: r.c, marginBottom: 4 }}>{r.label}</div>
                <div style={{ ...serif, fontSize: 14, color: BONE, lineHeight: 1.6 }}>{r.text}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Reveal>
  );
}

// ── PHASE TRANSITION TIMELINE ──
function PhaseTimeline() {
  const phases = [
    { era: "~3.8B years ago", event: "Self-replicating molecules", label: "Chemistry → Biology", color: GOLD },
    { era: "~600M years ago", event: "Multicellular organisms", label: "Cells → Organisms", color: GOLD },
    { era: "~300K years ago", event: "Homo sapiens + language", label: "Biology → Culture", color: GREEN },
    { era: "~5K years ago", event: "Writing, mathematics", label: "Oral → Persistent", color: ICE },
    { era: "~500 years ago", event: "Printing press, science", label: "Manuscript → Mass media", color: ICE },
    { era: "~75 years ago", event: "Digital computers", label: "Analog → Digital", color: GHOST },
    { era: "~10 years ago", event: "Deep learning at scale", label: "Deterministic → Probabilistic", color: GHOST },
    { era: "Next?", event: "ASI", label: "Narrow → General → Super", color: EMBER },
  ];

  return (
    <div style={{ position: "relative", paddingLeft: 24 }}>
      <div style={{ position: "absolute", left: 6, top: 0, bottom: 0, width: 1, background: LINE }} />
      {phases.map((p, i) => (
        <Reveal key={i}>
          <div style={{ position: "relative", paddingLeft: 24, paddingBottom: 28 }}>
            <div style={{
              position: "absolute", left: -2, top: 4, width: 12, height: 12, borderRadius: 6,
              background: p.color + "33", border: `2px solid ${p.color}`,
            }} />
            <div style={{ ...mono, fontSize: 10, letterSpacing: 1, color: p.color, marginBottom: 4 }}>{p.era}</div>
            <div style={{ ...sans, fontSize: 15, fontWeight: 600, color: BONE, marginBottom: 2 }}>{p.event}</div>
            <div style={{ ...serif, fontSize: 13, color: ASH, fontStyle: "italic" }}>{p.label}</div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}


// ═══════════════ MAIN ═══════════════
export default function TechEntropy({ onBack }) {
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
              A thermodynamic theory of technological progress
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <h1 style={{ ...sans, fontSize: "clamp(36px, 7vw, 56px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: -2, marginBottom: 24 }}>
              Technology<br /><span style={{ color: EMBER }}>as Entropy</span>
            </h1>
          </Reveal>
          <Reveal delay={0.3}>
            <div style={{ ...serif, fontSize: 20, lineHeight: 1.7, color: ASH, maxWidth: 540, fontStyle: "italic" }}>
              Technology, like entropy, is the fundamental nature of our universe.
              Once complex enough, its march toward artificial superintelligence
              becomes thermodynamically inevitable.
            </div>
          </Reveal>
        </div>

        {/* CH I: THE HYPOTHESIS */}
        <Chapter label="Chapter I — The Hypothesis" title="Technology follows the same laws as heat">
          <Reveal>
            <div style={{ ...serif, fontSize: 17, lineHeight: 1.85, color: BONE, maxWidth: 560 }}>
              The Second Law of Thermodynamics says entropy in a closed system tends to increase.
              Systems move from ordered states to disordered states. Heat flows from hot to cold.
              Structure dissolves into chaos. This is the arrow of time.
              <br /><br />
              But here's the thing:{" "}
              <span style={{ color: ICE }}>
                life and technology are both entropy-accelerating machines
              </span>.
              A tree dissipates solar energy more efficiently than bare rock. A city dissipates
              energy more efficiently than a forest. A data center dissipates energy more
              efficiently than a city.
              <br /><br />
              Each layer of complexity doesn't fight entropy —{" "}
              <span style={{ color: EMBER }}>it serves entropy by accelerating the rate at which
              energy is dissipated and information is processed</span>.
              <br /><br />
              Technology isn't an anomaly in a universe trending toward disorder.
              It's the universe's most efficient tool for getting there.
            </div>
          </Reveal>

          <Reveal>
            <div style={{
              padding: "28px 24px", background: EMBER + "08", border: `1px solid ${EMBER}22`,
              borderRadius: 16, marginTop: 32,
            }}>
              <div style={{ ...sans, fontSize: 16, fontWeight: 600, color: EMBER, marginBottom: 10 }}>
                The punchline
              </div>
              <div style={{ ...serif, fontSize: 15, lineHeight: 1.7, color: ASH }}>
                If technology is the universe's entropy accelerator, then once it reaches
                sufficient complexity to become self-improving (AI), stopping it would be
                like stopping heat from flowing downhill. The future converges to ASI.
                It's just a matter of when.
              </div>
            </div>
          </Reveal>
        </Chapter>

        {/* CH II: PHASE TRANSITIONS */}
        <Chapter label="Chapter II — The Evidence" title="Complexity undergoes phase transitions">
          <Reveal>
            <div style={{ ...serif, fontSize: 16, lineHeight: 1.7, color: ASH, maxWidth: 540, marginBottom: 32 }}>
              Each transition created a new substrate for information processing that
              was orders of magnitude more efficient than the last. And the intervals
              between transitions are <span style={{ color: EMBER }}>accelerating</span>.
            </div>
          </Reveal>
          <PhaseTimeline />
          <Reveal>
            <div style={{
              padding: "24px 20px", background: FAINT, border: `1px solid ${LINE}`,
              borderRadius: 16, marginTop: 24,
            }}>
              <div style={{ ...serif, fontSize: 15, lineHeight: 1.7, color: BONE }}>
                Notice the compression: billions of years for chemistry → biology.
                Hundreds of millions for single → multicellular.
                Thousands for writing. Hundreds for printing.
                Decades for computers. Years for deep learning.
                <br /><br />
                <span style={{ color: ICE }}>The pattern isn't linear. It's not even exponential. It's phase transitions
                in a complex system approaching criticality.</span>
              </div>
            </div>
          </Reveal>
        </Chapter>

        {/* CH III: ACADEMIC FRAMEWORKS */}
        <Chapter label="Chapter III — The Frameworks" title="What academia says (and where it falls short)">
          <TheoryCard
            name="Technological Determinism" thinker="Jacques Ellul, Neil Postman" color={GHOST}
            core="Technology has its own autonomous logic that drives society forward regardless of human intentions. Once a technology exists, its internal logic compels adoption and further development."
            connection="Directly supports the entropy thesis: technology as a fundamental force that, once unleashed, follows its own thermodynamic-like laws toward increasing complexity."
            limitation="Doesn't explain mechanism. Says 'technology drives itself' without explaining why. The entropy framing provides the missing physics."
          />
          <TheoryCard
            name="Evolutionary Epistemology" thinker="Donald Campbell, Karl Popper" color={GREEN}
            core="Knowledge and technology evolve through variation and selection, just like biological organisms. Each generation creates selection pressure for the next."
            connection="AI development as an accelerating evolutionary process — each model generation creates the conditions for the next, with selection pressure tightening as capability increases."
            limitation="Better at explaining the pattern after the fact than predicting when transitions happen. Selection pressures are easier to identify in retrospect."
          />
          <TheoryCard
            name="Edge of Chaos" thinker="Stuart Kauffman, Santa Fe Institute" color={ICE}
            core="Complex systems naturally evolve toward critical transition points — the 'edge of chaos' — where they're neither too ordered (frozen) nor too disordered (random). Maximum adaptability lives here."
            connection="We may be approaching a complexity phase transition where ASI emergence becomes structurally inevitable. The accelerating interval between phase transitions supports this."
            limitation="Kauffman's work is elegant but mostly descriptive. It tells you the system is approaching criticality, not what happens after the transition."
          />
          <TheoryCard
            name="Dissipative Structures" thinker="Ilya Prigogine, Nobel 1977" color={EMBER}
            core="Far-from-equilibrium systems spontaneously create ordered structures that accelerate entropy production. Life, cities, economies are all dissipative structures."
            connection="The strongest physics-based support for the thesis. Technology as a dissipative structure: ordered complexity that exists because it accelerates the universe's march toward equilibrium."
            limitation="Prigogine's framework explains why complexity emerges but doesn't specifically predict technological trajectories. The gap between 'structure will emerge' and 'AGI will emerge' is still a leap."
          />
        </Chapter>

        {/* CH IV: THE GAP */}
        <Chapter label="Chapter IV — The Honest Assessment" title="What we can and can't claim">
          <Reveal>
            <div style={{ ...serif, fontSize: 17, lineHeight: 1.85, color: BONE, maxWidth: 560, marginBottom: 32 }}>
              The entropy-technology thesis is compelling but must be held with epistemic humility.
            </div>
          </Reveal>

          <Reveal>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div style={{ background: GREEN + "08", border: `1px solid ${GREEN}22`, borderRadius: 16, padding: "24px 20px" }}>
                <div style={{ ...mono, fontSize: 9, letterSpacing: 2, color: GREEN, marginBottom: 12 }}>WHAT WE CAN CLAIM</div>
                {[
                  "Complexity in the universe tends to increase through phase transitions",
                  "The intervals between transitions are compressing",
                  "Technology functions as an entropy accelerator",
                  "AI represents a qualitatively new phase of complexity",
                  "Structural pressure toward greater capability is real and observable",
                ].map((t, i) => (
                  <div key={i} style={{ ...serif, fontSize: 13, color: BONE, lineHeight: 1.5, marginBottom: 10, paddingLeft: 16, borderLeft: `2px solid ${GREEN}33` }}>{t}</div>
                ))}
              </div>
              <div style={{ background: EMBER + "08", border: `1px solid ${EMBER}22`, borderRadius: 16, padding: "24px 20px" }}>
                <div style={{ ...mono, fontSize: 9, letterSpacing: 2, color: EMBER, marginBottom: 12 }}>WHAT WE CAN'T CLAIM</div>
                {[
                  "That ASI is guaranteed (contingency still applies)",
                  "When it arrives (all frameworks fail at timing)",
                  "What form it takes (the printing press wasn't predetermined)",
                  "That it will be beneficial (entropy doesn't have preferences)",
                  "That we'll retain control (the universe rewards dissipation, not intent)",
                ].map((t, i) => (
                  <div key={i} style={{ ...serif, fontSize: 13, color: BONE, lineHeight: 1.5, marginBottom: 10, paddingLeft: 16, borderLeft: `2px solid ${EMBER}33` }}>{t}</div>
                ))}
              </div>
            </div>
          </Reveal>
        </Chapter>

        {/* CH V: MICROSERVICES */}
        <Chapter label="Chapter V — The Origin Story" title="Microservices created the chaos that midwifed AI">
          <Reveal>
            <div style={{ ...serif, fontSize: 17, lineHeight: 1.85, color: BONE, maxWidth: 560 }}>
              Here's an insight that connects this cosmic framing to the actual engineering history:{" "}
              <span style={{ color: ICE }}>
                the architectural decision to decompose monoliths into microservices created
                both the data atomization and the operational complexity that necessitated AI solutions.
              </span>
              <br /><br />
              Microservices generated the chaos. ML/AI emerged to manage it. Distributed systems
              created the "core chaos" that midwifed the next phase of complexity.
              <br /><br />
              This is entropy working at the architectural level:{" "}
              <span style={{ color: GHOST }}>
                each layer of solution generates the conditions that demand the next layer.
              </span>{" "}
              Not because anyone planned it, but because complexity compounds and the system
              needs increasingly sophisticated tools to remain coherent.
            </div>
          </Reveal>

          <Reveal>
            <div style={{ padding: "24px 0" }}>
              {[
                { from: "Monoliths", to: "Microservices", generated: "Data atomization, operational explosion", color: ICE },
                { from: "Microservices", to: "DevOps tooling", generated: "Tool sprawl, cognitive overload", color: GREEN },
                { from: "Tool sprawl", to: "Platform engineering", generated: "Abstraction layers, new governance needs", color: GOLD },
                { from: "Platform + data", to: "AI/ML systems", generated: "The complexity manager that complexity demanded", color: GHOST },
                { from: "AI at scale", to: "AGI pressure", generated: "Self-improving systems, capability acceleration", color: EMBER },
              ].map((r, i) => (
                <Reveal key={i}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 0", borderBottom: `1px solid ${LINE}` }}>
                    <div style={{ ...mono, fontSize: 11, color: r.color, width: 120, flexShrink: 0 }}>{r.from}</div>
                    <div style={{ color: ASH }}>→</div>
                    <div style={{ ...sans, fontSize: 13, fontWeight: 600, color: BONE, width: 140, flexShrink: 0 }}>{r.to}</div>
                    <div style={{ ...serif, fontSize: 12, color: ASH, fontStyle: "italic" }}>{r.generated}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </Reveal>
        </Chapter>

        {/* CLOSER */}
        <section style={{ padding: "80px 0 120px", borderTop: `1px solid ${LINE}`, textAlign: "center" }}>
          <Reveal>
            <h2 style={{ ...sans, fontSize: "clamp(24px, 4.5vw, 38px)", fontWeight: 700, lineHeight: 1.15, maxWidth: 560, margin: "0 auto 20px" }}>
              The universe rewards entropy.<br />
              Technology is how it <span style={{ color: EMBER }}>collects</span>.
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p style={{ ...serif, fontSize: 16, fontStyle: "italic", color: ASH, maxWidth: 460, margin: "0 auto", lineHeight: 1.7 }}>
              Unless there's a galactic superpower civilization out there
              that intervenes and ends our march to ASI...
              <br /><br />
              the future converges.
            </p>
          </Reveal>
          <Reveal delay={0.4}>
            <div style={{ ...mono, fontSize: 10, color: "rgba(255,255,255,0.12)", letterSpacing: 0.5, lineHeight: 2, marginTop: 56 }}>
              From a conversation between a human and a language model · 2025
            </div>
          </Reveal>
        </section>

      </div>
    </div>
  );
}
