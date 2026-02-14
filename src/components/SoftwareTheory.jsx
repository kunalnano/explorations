import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════════════
   THE SOFTWARE THEORY OF CIVILIZATION
   Civilization doesn't just use software — civilization IS software.
   From a conversation between a human and a language model.
   ═══════════════════════════════════════════════════════════════ */

// ── PALETTE ──
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

// ── FONTS ──
const sans = { fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif" };
const serif = { fontFamily: "Georgia, 'Times New Roman', serif" };
const mono = { fontFamily: "'SF Mono', 'Cascadia Code', 'Consolas', monospace" };

// ── SCROLL REVEAL ──
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
      opacity: vis ? 1 : 0,
      transform: vis ? "translateY(0)" : "translateY(32px)",
      transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`,
    }}>
      {children}
    </div>
  );
}

// ── CHAPTER WRAPPER ──
function Chapter({ num, label, title, children }) {
  return (
    <section style={{ padding: "80px 0", borderTop: `1px solid ${LINE}` }}>
      <Reveal>
        <div style={{ ...mono, fontSize: 10, letterSpacing: 3, color: ICE, textTransform: "uppercase", marginBottom: 12 }}>
          {label}
        </div>
        <h2 style={{ ...sans, fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 700, lineHeight: 1.1, marginBottom: 40, maxWidth: 600 }}>
          {title}
        </h2>
      </Reveal>
      {children}
    </section>
  );
}

// ── VERSION LAYER CARD ──
function VersionLayer({ version, name, subtitle, protocol, upgrade, output, limitations, color, icon }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <Reveal>
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          background: expanded ? "rgba(255,255,255,0.04)" : FAINT,
          border: `1px solid ${expanded ? color + "44" : LINE}`,
          borderRadius: 16,
          padding: "28px 24px",
          marginBottom: 16,
          cursor: "pointer",
          transition: "all 0.4s ease",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: expanded ? 20 : 0 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: color + "18", border: `1px solid ${color}33`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, flexShrink: 0,
          }}>
            {icon}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ ...mono, fontSize: 10, letterSpacing: 2, color, textTransform: "uppercase" }}>
              {version}
            </div>
            <div style={{ ...sans, fontSize: 20, fontWeight: 600, lineHeight: 1.3 }}>{name}</div>
            <div style={{ ...serif, fontSize: 13, color: ASH, fontStyle: "italic" }}>{subtitle}</div>
          </div>
          <div style={{ ...mono, fontSize: 18, color: ASH, transition: "transform 0.3s", transform: expanded ? "rotate(45deg)" : "rotate(0)" }}>+</div>
        </div>

        {expanded && (
          <div style={{ paddingLeft: 64, transition: "all 0.4s ease" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <div>
                <div style={{ ...mono, fontSize: 9, letterSpacing: 2, color, marginBottom: 6 }}>PROTOCOL</div>
                <div style={{ ...serif, fontSize: 15, color: BONE, lineHeight: 1.5 }}>{protocol}</div>
              </div>
              <div>
                <div style={{ ...mono, fontSize: 9, letterSpacing: 2, color, marginBottom: 6 }}>UPGRADE</div>
                <div style={{ ...serif, fontSize: 15, color: BONE, lineHeight: 1.5 }}>{upgrade}</div>
              </div>
            </div>
            {limitations && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ ...mono, fontSize: 9, letterSpacing: 2, color: EMBER, marginBottom: 6 }}>LIMITATIONS</div>
                <div style={{ ...serif, fontSize: 14, color: ASH, lineHeight: 1.5 }}>{limitations}</div>
              </div>
            )}
            <div>
              <div style={{ ...mono, fontSize: 9, letterSpacing: 2, color: GREEN, marginBottom: 6 }}>OUTPUT</div>
              <div style={{ ...serif, fontSize: 15, color: BONE, lineHeight: 1.5 }}>{output}</div>
            </div>
          </div>
        )}
      </div>
    </Reveal>
  );
}

// ── BOTTLENECK CARD ──
function Bottleneck({ icon, domain, stat, description }) {
  return (
    <Reveal>
      <div style={{
        background: FAINT,
        border: `1px solid ${LINE}`,
        borderRadius: 12,
        padding: "20px 18px",
        marginBottom: 12,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <span style={{ fontSize: 18 }}>{icon}</span>
          <span style={{ ...sans, fontSize: 15, fontWeight: 600, color: BONE }}>{domain}</span>
        </div>
        <div style={{ ...mono, fontSize: 22, fontWeight: 700, color: EMBER, marginBottom: 6 }}>{stat}</div>
        <div style={{ ...serif, fontSize: 14, color: ASH, lineHeight: 1.5 }}>{description}</div>
      </div>
    </Reveal>
  );
}

// ── GATEKEEPER ROW ──
function Gatekeeper({ layer, who, color }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 16, padding: "14px 0",
      borderBottom: `1px solid ${LINE}`,
    }}>
      <div style={{ ...mono, fontSize: 11, letterSpacing: 1, color, width: 60, flexShrink: 0 }}>{layer}</div>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, ${color}44, transparent)` }} />
      <div style={{ ...serif, fontSize: 15, color: BONE }}>{who}</div>
    </div>
  );
}

// ── STACK VISUALIZATION (SVG) ──
function StackDiagram() {
  const layers = [
    { y: 20, h: 80, color: GHOST, label: "v4.0 — Probabilistic Intelligence", sub: "Vectors · Embeddings · Weights" },
    { y: 110, h: 80, color: GREEN, label: "v3.0 — The Executable Era", sub: "Binary · Logic Gates · Algorithms" },
    { y: 200, h: 80, color: ICE, label: "v2.0 — The Persistence Era", sub: "Text · Scripture · Legal Code" },
    { y: 290, h: 80, color: GOLD, label: "v1.0 — The Biological Era", sub: "Speech · Gesture · Memory" },
  ];

  return (
    <Reveal>
      <svg viewBox="0 0 600 400" style={{ width: "100%", maxWidth: 600, display: "block", margin: "0 auto" }}>
        {layers.map((l, i) => (
          <g key={i}>
            <rect x={60 + i * 15} y={l.y} width={480 - i * 30} height={l.h} rx={12}
              fill={l.color + "12"} stroke={l.color + "44"} strokeWidth={1} />
            <text x={300} y={l.y + 32} textAnchor="middle"
              fill={l.color} fontFamily="'Segoe UI', system-ui" fontSize={14} fontWeight={600}>
              {l.label}
            </text>
            <text x={300} y={l.y + 54} textAnchor="middle"
              fill={ASH} fontFamily="Georgia, serif" fontSize={11} fontStyle="italic">
              {l.sub}
            </text>
            {i < 3 && (
              <line x1={300} y1={l.y + l.h} x2={300} y2={layers[i + 1].y}
                stroke={LINE} strokeWidth={1} strokeDasharray="4 4" />
            )}
          </g>
        ))}
        {/* Arrow annotations */}
        <text x={20} y={200} fill={ASH} fontSize={9} fontFamily="monospace" transform="rotate(-90, 20, 200)">
          ABSTRACTION ▲
        </text>
        <text x={580} y={200} fill={ASH} fontSize={9} fontFamily="monospace" transform="rotate(90, 580, 200)">
          TIME ▲
        </text>
      </svg>
    </Reveal>
  );
}


// ═══════════════ MAIN COMPONENT ═══════════════
export default function SoftwareTheory({ onBack }) {
  return (
    <div style={{ background: BG, minHeight: "100vh", color: BONE }}>
      {/* Noise overlay */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 999, pointerEvents: "none", opacity: 0.03,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }} />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: 720, margin: "0 auto", padding: "0 24px" }}>

        {/* BACK */}
        <div style={{ paddingTop: 32 }}>
          <button onClick={onBack} style={{
            background: "none", border: "none", color: ASH, cursor: "pointer",
            ...mono, fontSize: 11, letterSpacing: 2, padding: "8px 0",
          }}>
            ← EXPLORATIONS
          </button>
        </div>

        {/* HERO */}
        <div style={{ padding: "80px 0 60px" }}>
          <Reveal>
            <div style={{ ...mono, fontSize: 10, letterSpacing: 4, color: GHOST, textTransform: "uppercase", marginBottom: 20 }}>
              A framework for understanding human progress
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <h1 style={{
              ...sans, fontSize: "clamp(36px, 7vw, 60px)", fontWeight: 800,
              lineHeight: 1.05, letterSpacing: -2, marginBottom: 24,
            }}>
              The Software Theory<br />
              <span style={{ color: GHOST }}>of Civilization</span>
            </h1>
          </Reveal>
          <Reveal delay={0.3}>
            <div style={{ ...serif, fontSize: 20, lineHeight: 1.7, color: ASH, maxWidth: 560, fontStyle: "italic" }}>
              Civilization does not just use software.<br />
              Civilization <span style={{ color: BONE, fontWeight: 600 }}>is</span> software.
            </div>
          </Reveal>
        </div>

        {/* ═══ CH I: CORE THESIS ═══ */}
        <Chapter num="I" label="Chapter I — The Core Thesis" title="Every upgrade to how we transmit information rewrites civilization">
          <Reveal>
            <div style={{ ...serif, fontSize: 17, lineHeight: 1.85, color: BONE, maxWidth: 600 }}>
              Throughout history, human progress has been defined by upgrades to our collective
              operating system — the protocols we use to <span style={{ color: ICE }}>transmit</span>,{" "}
              <span style={{ color: GREEN }}>store</span>, and{" "}
              <span style={{ color: EMBER }}>execute</span> information.
              <br /><br />
              We started with biological wetware, upgraded to language, hardened it into law,
              optimized it with digital code, and have now arrived at the era of probabilistic intelligence.
              <br /><br />
              <span style={{ color: GHOST }}>
                AI is not an alien invasion. It is the necessary architectural upgrade required
                to manage the crushing complexity of the previous layers.
              </span>
            </div>
          </Reveal>
        </Chapter>

        {/* ═══ CH II: THE STACK ═══ */}
        <Chapter num="II" label="Chapter II — The Stack" title="Four version updates to our collective processing capacity">
          <StackDiagram />

          <div style={{ marginTop: 48 }}>
            <VersionLayer
              version="v1.0" name="Oral Tradition" subtitle="The volatile layer"
              icon="🗣️" color={GOLD}
              protocol="Speech, gesture, rhythm, song"
              upgrade="First external information transfer between brains"
              limitations="High packet loss. Strictly synchronous. Limited by biological memory (RAM). Each retelling introduces drift — like a game of telephone across generations."
              output="Myths, tribal knowledge, oral histories, cultural identity"
            />
            <VersionLayer
              version="v2.0" name="The Written Word & Law" subtitle="The persistence layer"
              icon="📜" color={ICE}
              protocol="Text, scripture, legal code, bureaucracy"
              upgrade="Asynchronous communication. Persistent storage (hard drive). Error correction through canonical texts. Information survives the death of its creator."
              limitations="Slow replication (hand-copying). Gated by literacy. Interpretation drift across translations and centuries."
              output="Nations, religions, contracts, property rights, empires"
            />
            <VersionLayer
              version="v3.0" name="Digital Code" subtitle="The executable layer"
              icon="💻" color={GREEN}
              protocol="Binary, logic gates, deterministic algorithms"
              upgrade="Instant transmission. Zero-marginal-cost replication. Automation of rigid logic. Global coordination at light speed."
              limitations="Brittle — can only handle what was explicitly programmed. Cannot parse ambiguity, intent, or nuance. Requires human translation layer."
              output="The Internet, SaaS, global finance, social networks, e-commerce"
            />
            <VersionLayer
              version="v4.0" name="Large Language Models" subtitle="The probabilistic layer"
              icon="🧠" color={GHOST}
              protocol="Vectors, embeddings, attention weights"
              upgrade="Handles ambiguity. Interprets intent. Bridges the gap between rigid code and fluid human language. Reads, writes, and executes across the entire stack."
              limitations="Probabilistic — no guaranteed correctness. Hallucination. Opaque reasoning. Energy-intensive. The measure problem: who validates the validator?"
              output="Agents, synthesis, creative generation, cross-domain reasoning, civilization-scale pattern matching"
            />
          </div>
        </Chapter>

        {/* ═══ CH III: THE NECESSITY ═══ */}
        <Chapter num="III" label="Chapter III — The Bottleneck" title="We hit the limits of deterministic scaling">
          <Reveal>
            <div style={{ ...serif, fontSize: 17, lineHeight: 1.85, color: BONE, maxWidth: 560, marginBottom: 40 }}>
              As our software (society, culture, law, code) became too complex for the hardware
              (individual human brains) to parse, we faced a bottleneck.
              <span style={{ color: EMBER }}> The system outgrew its operators.</span>
            </div>
          </Reveal>

          <Bottleneck icon="⚖️" domain="Law" stat="180,000+ pages"
            description="The US Code of Federal Regulations. No single lawyer can hold the full corpus. We've been using heuristic shortcuts — specialization, precedent, delegation — as lossy compression for decades." />
          <Bottleneck icon="💾" domain="Code" stat="2 billion+ lines"
            description="Google's monorepo. No developer maintains even a fraction. Microservices created the data atomization and operational complexity that necessitated AI solutions." />
          <Bottleneck icon="📊" domain="Data" stat="120 zettabytes/year"
            description="Global data creation in 2023. No analyst queries it. Most of it is never read by a human. The information exists but the meaning is stranded." />
          <Bottleneck icon="🏥" domain="Medicine" stat="2 million+ papers/year"
            description="Biomedical literature growth. A physician would need to read 29 hours per day to keep current. The knowledge exists. The bandwidth to apply it doesn't." />

          <Reveal>
            <div style={{
              padding: "32px 28px", background: EMBER + "08", border: `1px solid ${EMBER}22`,
              borderRadius: 16, marginTop: 32,
            }}>
              <div style={{ ...sans, fontSize: 18, fontWeight: 700, color: EMBER, marginBottom: 12 }}>
                The emergence of AI was the inevitable systemic response.
              </div>
              <div style={{ ...serif, fontSize: 15, lineHeight: 1.7, color: ASH }}>
                A tool capable of reading, writing, and executing the "software" of civilization at a
                scale biology cannot match. Not because we chose it — because the complexity demanded it.
              </div>
            </div>
          </Reveal>
        </Chapter>

        {/* ═══ CH IV: EACH LAYER ABSTRACTS ═══ */}
        <Chapter num="IV" label="Chapter IV — The Pattern" title="Each layer doesn't replace the one below — it abstracts over it">
          <Reveal>
            <div style={{ ...serif, fontSize: 17, lineHeight: 1.85, color: BONE, maxWidth: 560, marginBottom: 32 }}>
              This is what most "AI will change everything" narratives miss. Writing didn't kill
              speech. Code didn't kill law. LLMs won't kill code.
              <span style={{ color: ICE }}> You still need TCP/IP even though you're writing React.</span>
            </div>
          </Reveal>

          <Reveal>
            <div style={{
              background: FAINT, border: `1px solid ${LINE}`, borderRadius: 16, padding: "28px 24px",
              marginBottom: 32,
            }}>
              <div style={{ ...sans, fontSize: 16, fontWeight: 600, marginBottom: 20 }}>
                The abstraction stack is additive, not replacive
              </div>
              {[
                { from: "v1.0 → v2.0", insight: "We still speak. But writing let us speak across time." },
                { from: "v2.0 → v3.0", insight: "We still write laws. But code let us execute them automatically." },
                { from: "v3.0 → v4.0", insight: "We still write code. But LLMs let us operate on code through natural language." },
              ].map((row, i) => (
                <div key={i} style={{
                  display: "flex", gap: 16, padding: "12px 0",
                  borderBottom: i < 2 ? `1px solid ${LINE}` : "none",
                  alignItems: "baseline",
                }}>
                  <div style={{ ...mono, fontSize: 11, color: GHOST, width: 100, flexShrink: 0 }}>{row.from}</div>
                  <div style={{ ...serif, fontSize: 15, color: BONE, lineHeight: 1.5 }}>{row.insight}</div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <div style={{ ...serif, fontSize: 17, lineHeight: 1.85, color: BONE, maxWidth: 560 }}>
              A missing layer worth noting: between oral tradition and writing, there was arguably
              a <span style={{ color: GOLD }}>v1.5 — Numeracy and Measurement</span>. Counting systems,
              calendars, weights and measures. Mesopotamian clay tokens for accounting predate writing
              by millennia. The Incas ran an empire on quipu (knotted strings) without what we'd call writing.
              <br /><br />
              This matters because it shows that{" "}
              <span style={{ color: ICE }}>the coordination protocol doesn't have to be linguistic</span>{" "}
              — which strengthens the v4.0 argument, since embeddings and vectors are also non-linguistic representations.
            </div>
          </Reveal>
        </Chapter>

        {/* ═══ CH V: WHO CONTROLS THE COMPILER ═══ */}
        <Chapter num="V" label="Chapter V — The Implication" title="If civilization is software, then who controls the compiler?">
          <Reveal>
            <div style={{ ...serif, fontSize: 17, lineHeight: 1.85, color: BONE, maxWidth: 560, marginBottom: 40 }}>
              Every previous layer had gatekeepers. The interesting question isn't
              "will AI change things" — it's{" "}
              <span style={{ color: EMBER }}>who controls the abstraction layer</span>.
              Control of the compiler is control of civilization itself.
            </div>
          </Reveal>

          <Reveal>
            <div style={{ padding: "24px 0" }}>
              <Gatekeeper layer="v1.0" who="Elders, shamans, storytellers — keepers of oral tradition" color={GOLD} />
              <Gatekeeper layer="v2.0" who="Priests, scribes, lawyers — controllers of scripture and law" color={ICE} />
              <Gatekeeper layer="v3.0" who="Developers, engineers, tech companies — writers of digital code" color={GREEN} />
              <Gatekeeper layer="v4.0" who="The handful of organizations that train frontier models" color={GHOST} />
            </div>
          </Reveal>

          <Reveal>
            <div style={{
              padding: "32px 28px", background: GHOST + "08", border: `1px solid ${GHOST}22`,
              borderRadius: 16, marginTop: 32,
            }}>
              <div style={{ ...sans, fontSize: 17, fontWeight: 600, color: GHOST, marginBottom: 12 }}>
                The stack metaphor implies something provocative
              </div>
              <div style={{ ...serif, fontSize: 15, lineHeight: 1.7, color: ASH }}>
                Each gatekeeper layer controlled civilization's operating system in their era.
                The transition between gatekeepers has historically been violent — revolutions,
                reformations, disruptions. We are in the middle of the v3.0 → v4.0 transition right now.
                <br /><br />
                The question is whether the v4.0 gatekeepers will be governments, corporations,
                open-source communities, or something we haven't named yet.
              </div>
            </div>
          </Reveal>
        </Chapter>

        {/* ═══ CH VI: THE TELEOLOGY PROBLEM ═══ */}
        <Chapter num="VI" label="Chapter VI — The Counterargument" title='Was this "inevitable"?'>
          <Reveal>
            <div style={{ ...serif, fontSize: 17, lineHeight: 1.85, color: BONE, maxWidth: 560, marginBottom: 32 }}>
              The framework risks being too <span style={{ color: EMBER }}>teleological</span> —
              implying v4.0 was an inevitable systemic response. That's a strong claim.
              <br /><br />
              The printing press wasn't an inevitable response to manuscript copying bottlenecks.
              It was a contingent invention by a specific guy in Mainz who knew about wine presses.
              The transformer architecture emerged from a specific 2017 Google paper solving a
              specific attention problem.
              <br /><br />
              The complexity pressure was real. But{" "}
              <span style={{ color: ICE }}>the form of the response was not predetermined</span>.
              Framing it as inevitable risks becoming unfalsifiable — which makes it a narrative
              rather than a theory.
            </div>
          </Reveal>

          <Reveal>
            <div style={{
              background: FAINT, border: `1px solid ${LINE}`, borderRadius: 16, padding: "28px 24px",
            }}>
              <div style={{ ...sans, fontSize: 16, fontWeight: 600, marginBottom: 16 }}>
                The honest framing
              </div>
              <div style={{ ...serif, fontSize: 15, lineHeight: 1.7, color: ASH }}>
                <span style={{ color: BONE }}>Strong claim:</span> "AI was inevitable because complexity
                demanded it." Unfalsifiable. Narrative.
                <br /><br />
                <span style={{ color: BONE }}>Defensible claim:</span> "Each information layer eventually
                generates complexity that exceeds its own processing capacity, creating pressure for a
                new abstraction layer." Observable. Testable. The form is contingent; the pressure is structural.
              </div>
            </div>
          </Reveal>
        </Chapter>

        {/* ═══ CLOSER ═══ */}
        <section style={{ padding: "80px 0 120px", borderTop: `1px solid ${LINE}`, textAlign: "center" }}>
          <Reveal>
            <h2 style={{
              ...sans, fontSize: "clamp(24px, 4.5vw, 38px)", fontWeight: 700,
              lineHeight: 1.15, maxWidth: 540, margin: "0 auto 20px",
            }}>
              The software is the civilization.<br />
              The question is who writes the <span style={{ color: GHOST }}>next commit</span>.
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p style={{
              ...serif, fontSize: 16, fontStyle: "italic", color: ASH,
              maxWidth: 480, margin: "0 auto", lineHeight: 1.7,
            }}>
              We started with myths around a fire. We formalized them into scripture.
              We compiled them into code. Now we're training systems that can read
              the entire stack and write the next layer.
              <br /><br />
              Whether that's progress depends on whether we're writing the spec,
              or the spec is writing us.
            </p>
          </Reveal>
          <Reveal delay={0.4}>
            <div style={{
              ...mono, fontSize: 10, color: "rgba(255,255,255,0.12)",
              letterSpacing: 0.5, lineHeight: 2, marginTop: 56,
            }}>
              From a conversation between a human and a language model · February 2026
            </div>
          </Reveal>
        </section>

      </div>
    </div>
  );
}
