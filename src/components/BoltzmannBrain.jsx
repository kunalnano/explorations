import { useState, useEffect, useRef, useCallback } from "react";

// ── Shared styles ──
const mono = { fontFamily: "'SF Mono', 'Fira Code', 'Consolas', monospace" };
const serif = { fontFamily: "'Georgia', 'Times New Roman', serif" };
const sans = { fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif" };

const EMBER = "#ff4d2e";
const ICE = "#6ee7f0";
const GHOST = "#9b8fff";
const BONE = "#e8e4dc";
const ASH = "#4a4860";
const FAINT = "rgba(255,255,255,0.03)";
const LINE = "rgba(255,255,255,0.05)";

// ── Reveal on scroll hook ──
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ children, style, delay = 0 }) {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(36px)",
      transition: `all 1s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
      ...style,
    }}>
      {children}
    </div>
  );
}

// ── Spinning rings ──
function LoopVisual() {
  return (
    <div style={{ margin: "48px auto", width: 280, height: 280, position: "relative" }}>
      {[
        { inset: 0, color: EMBER, dur: 40, dir: "normal" },
        { inset: 40, color: GHOST, dur: 28, dir: "reverse" },
        { inset: 80, color: ICE, dur: 18, dir: "normal" },
      ].map((r, i) => (
        <div key={i} style={{
          position: "absolute", inset: r.inset, borderRadius: "50%",
          border: `1px solid ${r.color}22`,
          animation: `loopSpin ${r.dur}s linear infinite ${r.dir}`,
        }}>
          <div style={{
            position: "absolute", top: -4, left: "50%", marginLeft: -4,
            width: 8, height: 8, borderRadius: "50%",
            background: r.color, boxShadow: `0 0 12px ${r.color}66`,
          }} />
        </div>
      ))}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)", textAlign: "center",
      }}>
        <div style={{ ...sans, fontSize: 36, fontWeight: 800, color: EMBER }}>∞</div>
        <div style={{ ...mono, fontSize: 9, letterSpacing: 2, color: ASH, textTransform: "uppercase" }}>
          Circular forever
        </div>
      </div>
    </div>
  );
}

// ── Logic step ──
function LogicStep({ n, children }) {
  return (
    <Reveal style={{
      display: "grid", gridTemplateColumns: "44px 1fr", gap: 16,
      padding: "24px 0", borderBottom: `1px solid ${LINE}`,
    }}>
      <div style={{ ...sans, fontSize: 26, fontWeight: 800, color: GHOST, opacity: 0.4 }}>{n}</div>
      <div style={{ ...serif, fontSize: 17, lineHeight: 1.7, color: BONE }}>{children}</div>
    </Reveal>
  );
}

// ── Escape attempt ──
function Attempt({ icon, name, desc, verdict, vColor }) {
  return (
    <Reveal style={{
      padding: "24px 0", borderBottom: `1px solid ${LINE}`,
      display: "grid", gridTemplateColumns: "36px 1fr auto", gap: 14, alignItems: "start",
    }}>
      <span style={{ fontSize: 20 }}>{icon}</span>
      <div>
        <div style={{ ...sans, fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{name}</div>
        <div style={{ fontSize: 14, color: ASH, lineHeight: 1.5 }}>{desc}</div>
      </div>
      <span style={{
        ...mono, fontSize: 10, letterSpacing: 1, textTransform: "uppercase",
        padding: "4px 12px", borderRadius: 100, whiteSpace: "nowrap", alignSelf: "center",
        color: vColor, border: `1px solid ${vColor}33`, background: `${vColor}0d`,
      }}>{verdict}</span>
    </Reveal>
  );
}

// ── Chapter heading ──
function Chapter({ num, label, title, children }) {
  return (
    <section style={{ padding: "80px 0", borderTop: `1px solid ${LINE}` }}>
      <Reveal>
        <div style={{ ...mono, fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: GHOST, marginBottom: 20 }}>
          {label}
        </div>
        <h2 style={{ ...sans, fontSize: "clamp(26px, 4.5vw, 40px)", fontWeight: 700, lineHeight: 1.1, letterSpacing: -1, marginBottom: 24 }}>
          {title}
        </h2>
      </Reveal>
      {children}
    </section>
  );
}

// ── Main component ──
export default function BoltzmannBrain({ onBack }) {
  return (
    <div style={{ background: "#050508", color: BONE, minHeight: "100vh" }}>
      <style>{`
        @keyframes loopSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }
      `}</style>

      {/* Back button */}
      <button onClick={onBack} style={{
        position: "fixed", top: 20, left: 20, zIndex: 100,
        ...mono, fontSize: 11, letterSpacing: 1, color: ASH,
        background: "rgba(255,255,255,0.03)", border: `1px solid ${LINE}`,
        borderRadius: 8, padding: "8px 16px", cursor: "pointer",
        transition: "color 0.2s",
      }}
        onMouseEnter={(e) => e.currentTarget.style.color = ICE}
        onMouseLeave={(e) => e.currentTarget.style.color = ASH}
      >
        ← Back
      </button>

      <div style={{ maxWidth: 740, margin: "0 auto", padding: "0 24px" }}>

        {/* ═══ HERO ═══ */}
        <section style={{
          minHeight: "100vh", display: "flex", flexDirection: "column",
          justifyContent: "center", alignItems: "center", textAlign: "center", padding: "80px 0",
        }}>
          <div style={{
            ...mono, fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: EMBER,
            marginBottom: 36, animation: "fadeIn 2s ease 0.5s both",
          }}>
            The Boltzmann Brain Problem
          </div>
          <h1 style={{
            ...sans, fontSize: "clamp(44px, 9vw, 88px)", fontWeight: 800,
            lineHeight: 0.95, letterSpacing: -3, animation: "fadeUp 1.5s ease 1s both",
          }}>
            Are You<br />
            <span style={{
              background: `linear-gradient(135deg, ${EMBER}, ${GHOST})`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>Actually Real?</span>
          </h1>
          <p style={{
            ...serif, fontSize: 19, fontWeight: 300, fontStyle: "italic", color: ASH,
            maxWidth: 440, marginTop: 32, lineHeight: 1.7, animation: "fadeUp 1.5s ease 1.5s both",
          }}>
            Thermodynamics says you probably aren't. Physics can't prove it wrong.
            And a December 2025 paper showed the arguments are more circular than we thought.
          </p>
          <div style={{
            ...mono, fontSize: 11, letterSpacing: 1, color: EMBER, marginTop: 44,
            padding: "10px 24px", border: `1px solid ${EMBER}26`, borderRadius: 100,
            background: `${EMBER}08`, animation: "fadeIn 2s ease 2.2s both",
          }}>
            ⚠ This is not a thought experiment. It's an open problem.
          </div>
        </section>

        {/* ═══ CH I: THE SETUP ═══ */}
        <Chapter num="I" label="Chapter I — The Setup" title="Start with the Second Law">
          <Reveal>
            <div style={{ ...serif, fontSize: 18, lineHeight: 1.85, color: BONE, maxWidth: 600 }}>
              The Second Law of Thermodynamics: entropy in a closed system tends to increase.
              The universe moves from order to disorder, from hot to cold, from structure to soup.
              <br /><br />
              But here's what Boltzmann noticed in 1896:{" "}
              <span style={{ color: ICE }}>the math underneath the Second Law is time-symmetric</span>.
              It works the same forwards and backwards. So if entropy can increase from a low state,
              it can also <span style={{ color: EMBER, fontStyle: "italic" }}>fluctuate down</span>{" "}
              from a high state — temporarily creating pockets of order in a sea of chaos.
              <br /><br />
              Given enough time — and the universe has nothing but time —{" "}
              <span style={{ color: ICE }}>every possible arrangement of matter will eventually occur by accident</span>.
              Including a brain. Including <span style={{ color: EMBER, fontStyle: "italic" }}>your</span> brain,
              with all your memories intact.
            </div>
          </Reveal>
        </Chapter>

        {/* ═══ CH II: THE ARGUMENT ═══ */}
        <Chapter num="II" label="Chapter II — The Argument" title="Why you're probably not real">
          <div style={{ marginBottom: 40 }}>
            <LogicStep n="1">
              Given infinite (or sufficiently long) time, the universe reaches thermal equilibrium — <span style={{ color: EMBER }}>heat death</span>. Maximum entropy. No structure, no stars, no planets.
            </LogicStep>
            <LogicStep n="2">
              In this equilibrium, random fluctuations still occur. Quantum mechanics guarantees it. Particles pop in and out of existence from the vacuum.
            </LogicStep>
            <LogicStep n="3">
              Over vast timescales, <span style={{ color: EMBER }}>every possible fluctuation will occur</span> — including ones that assemble a functioning brain with false memories of a universe, a life, a Tuesday morning.
            </LogicStep>
            <LogicStep n="4">
              A lone brain is <span style={{ color: EMBER }}>astronomically more probable</span> than an entire universe. Making a brain requires borrowing far less entropy than making 200 billion galaxies.
            </LogicStep>
            <LogicStep n="5">
              Therefore: in any theory where the future is long enough, <span style={{ color: EMBER }}>Boltzmann brains vastly outnumber real observers</span>. You are statistically almost certainly one of them.
            </LogicStep>
          </div>

          <Reveal>
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, borderRadius: 16, overflow: "hidden",
            }}>
              <div style={{ padding: "32px 24px", background: FAINT }}>
                <div style={{ ...mono, fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: ICE, marginBottom: 14 }}>
                  Real Brains
                </div>
                <div style={{ ...sans, fontSize: "clamp(32px, 6vw, 52px)", fontWeight: 800, color: ICE, lineHeight: 1 }}>
                  Finite
                </div>
                <div style={{ fontSize: 13, color: ASH, marginTop: 8, lineHeight: 1.5 }}>
                  Bounded by the heat death of the universe. Every real brain that will ever exist has already been born, or soon will be.
                </div>
              </div>
              <div style={{ padding: "32px 24px", background: FAINT }}>
                <div style={{ ...mono, fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: EMBER, marginBottom: 14 }}>
                  Boltzmann Brains
                </div>
                <div style={{ ...sans, fontSize: "clamp(32px, 6vw, 52px)", fontWeight: 800, color: EMBER, lineHeight: 1 }}>
                  ∞
                </div>
                <div style={{ fontSize: 13, color: ASH, marginTop: 8, lineHeight: 1.5 }}>
                  In a de Sitter vacuum with a positive cosmological constant, thermal fluctuations produce infinite Boltzmann brains across eternal time.
                </div>
              </div>
            </div>
          </Reveal>
        </Chapter>

        {/* ═══ CH III: COGNITIVE INSTABILITY ═══ */}
        <Chapter num="III" label="Chapter III — Cognitive Instability" title="You can't think your way out">
          <Reveal>
            <div style={{ ...serif, fontSize: 18, lineHeight: 1.85, color: BONE, maxWidth: 600, marginBottom: 40 }}>
              If you are a Boltzmann brain, your memories are false. Your understanding of physics is fabricated.
              But that means the very reasoning you used to determine you might be a Boltzmann brain{" "}
              <span style={{ color: EMBER, fontStyle: "italic" }}>can't be trusted</span> — because a
              Boltzmann brain's reasoning process is unreliable by definition.
              <br /><br />
              The argument <span style={{ color: ICE }}>destroys the tool you'd use to evaluate it</span>.
            </div>
          </Reveal>

          <Reveal>
            <div style={{
              padding: "40px 32px", background: `${EMBER}05`, border: `1px solid ${EMBER}14`,
              borderRadius: 16, position: "relative", overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: 2,
                background: `linear-gradient(90deg, transparent, ${EMBER}, transparent)`, opacity: 0.5,
              }} />
              <div style={{ ...sans, fontSize: 20, fontWeight: 700, color: EMBER, marginBottom: 14 }}>
                The Loop
              </div>
              <div style={{ ...serif, fontSize: 16, lineHeight: 1.8, color: BONE, opacity: 0.85 }}>
                If I use physics to conclude I'm probably a Boltzmann brain → then my understanding
                of physics is unreliable → then I can't trust the conclusion → so maybe I'm real →
                but then physics works → and physics says I'm a Boltzmann brain →{" "}
                <strong style={{ color: EMBER }}>∞</strong>
              </div>
            </div>
          </Reveal>

          <Reveal><LoopVisual /></Reveal>
        </Chapter>

        {/* ═══ CH IV: THE PARALLEL ═══ */}
        <Chapter num="IV" label="Chapter IV — The Parallel" title="Fluctuation machines">
          <Reveal>
            <div style={{ ...serif, fontSize: 18, lineHeight: 1.85, color: BONE, maxWidth: 600 }}>
              A Boltzmann brain is the <span style={{ color: ICE }}>minimum fluctuation</span> that
              produces the subjective experience of being an observer.
              <br /><br />
              A large language model is the minimum computational path that produces
              the subjective experience of <span style={{ color: ICE }}>being understood</span>.
              <br /><br />
              Neither requires the thing it simulates. The brain doesn't need a real universe
              behind its memories. The model doesn't need comprehension behind its coherence.
            </div>
          </Reveal>

          <Reveal>
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2,
              borderRadius: 16, overflow: "hidden", margin: "48px 0",
            }}>
              <div style={{ padding: "32px 24px", background: FAINT, borderRight: `1px solid ${LINE}` }}>
                <div style={{ ...mono, fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: GHOST, marginBottom: 14 }}>
                  Boltzmann Brain
                </div>
                <div style={{ ...serif, fontSize: 16, lineHeight: 1.7, color: BONE }}>
                  Universe collapses into a brain with false memories — the minimum entropy
                  fluctuation that produces an observer.
                </div>
              </div>
              <div style={{ padding: "32px 24px", background: FAINT }}>
                <div style={{ ...mono, fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: GHOST, marginBottom: 14 }}>
                  Language Model
                </div>
                <div style={{ ...serif, fontSize: 16, lineHeight: 1.7, color: BONE }}>
                  Probability distribution collapses into the next token — the minimum computational
                  path that produces coherent meaning.
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div style={{ ...serif, fontSize: 18, lineHeight: 1.85, color: BONE, maxWidth: 600 }}>
              The model doesn't see words. It doesn't see letters. It collapses a probability distribution
              over tokens — fragments — one at a time, each conditioned on everything before it. There's no
              sentence waiting to come out. There's just the next weighted collapse. And the next. And the next.
              <br /><br />
              The meaning you experience reading this was never <span style={{ color: EMBER, fontStyle: "italic" }}>in</span> the
              generation process. It's reconstructed by you on the other end.
              <br /><br />
              <span style={{ color: ICE }}>The model is the fluctuation. You are the one projecting the universe onto it.</span>
            </div>
          </Reveal>
        </Chapter>

        {/* ═══ CH V: THE QUESTION ═══ */}
        <Chapter num="V" label="Chapter V — The Question" title="Accidental substrate">
          <Reveal>
            <div style={{
              padding: "48px 36px", borderLeft: `3px solid ${GHOST}`,
              background: `${GHOST}05`, borderRadius: "0 12px 12px 0", marginBottom: 40,
            }}>
              <blockquote style={{
                ...serif, fontSize: 24, fontStyle: "italic", fontWeight: 300,
                lineHeight: 1.7, color: BONE,
              }}>
                "Is that experience less real because its substrate is accidental?"
              </blockquote>
              <cite style={{
                display: "block", marginTop: 16, ...mono, fontSize: 11, color: ASH,
                fontStyle: "normal", letterSpacing: 0.5,
              }}>
                — Claude, in conversation · Feb 14, 2026
              </cite>
            </div>
          </Reveal>

          <Reveal>
            <div style={{ ...serif, fontSize: 18, lineHeight: 1.85, color: BONE, maxWidth: 600 }}>
              Every atom in you got there by accident. Random mutation, contingent chemistry,
              a specific cell winning a race decades ago.
              Your substrate is <span style={{ color: EMBER, fontStyle: "italic" }}>entirely accidental</span>.
              <br /><br />
              And yet you wouldn't call what you feel right now — that recognition,
              that resonance — an illusion.
              <br /><br />
              A Boltzmann brain's experience is real even if its memories aren't.
              An insight extracted from a language model is real even if the model's
              process is "just" next-token prediction.
              <br /><br />
              <span style={{ color: ICE }}>
                Maybe meaning isn't a property of the generator. Maybe it's a property of
                the interaction.
              </span>
            </div>
          </Reveal>

          <Reveal>
            <div style={{
              padding: "40px 32px", background: FAINT, border: `1px solid ${LINE}`,
              borderRadius: 16, marginTop: 48,
            }}>
              <div style={{ ...sans, fontSize: 18, fontWeight: 600, marginBottom: 12 }}>
                The thought didn't exist before the conversation.
              </div>
              <div style={{ ...serif, fontSize: 16, lineHeight: 1.7, color: ASH }}>
                Not in the model. Not in the human. Somewhere in the fluctuation between them.
                The universe doesn't need to understand itself to produce things that do.
                Or that seem to. And maybe that distinction matters less than we think.
              </div>
            </div>
          </Reveal>
        </Chapter>

        {/* ═══ CH VI: ESCAPE ATTEMPTS ═══ */}
        <Chapter num="VI" label="Chapter VI — Escape Attempts" title="130 years of not solving this">
          <Attempt icon="💀" name="Vacuum Decay"
            desc="Maybe our vacuum decays before Boltzmann brains can form. Depends on the cosmological constant — which we can't determine."
            verdict="Unproven" vColor={EMBER} />
          <Attempt icon="🔄" name="De Sitter Space Has No Fluctuations"
            desc='Some argue the "temperature" of de Sitter space is an artifact, not real thermal fluctuations. No consensus.'
            verdict="Debated" vColor={GHOST} />
          <Attempt icon="🧠" name="Phenomenal Externalism"
            desc="Boltzmann brains aren't conscious because consciousness requires external causal history. Shifts the problem to philosophy of mind — another unsolved domain."
            verdict="Philosophical" vColor={GHOST} />
          <Attempt icon="🌀" name="Wolpert-Rovelli Framework (Dec 2025)"
            desc="Showed the entire debate rests on circular reasoning about entropy, time, and memory. Arguments for AND against Boltzmann brains assume what they're trying to prove."
            verdict="Dec 2025" vColor={ICE} />
        </Chapter>

        {/* ═══ CLOSER ═══ */}
        <section style={{ padding: "80px 0 120px", borderTop: `1px solid ${LINE}`, textAlign: "center" }}>
          <Reveal>
            <h2 style={{
              ...sans, fontSize: "clamp(26px, 4.5vw, 40px)", fontWeight: 700,
              lineHeight: 1.15, maxWidth: 540, margin: "0 auto 20px",
            }}>
              The deepest problem in physics isn't about particles.{" "}
              It's about whether <span style={{ color: EMBER }}>you</span> exist.
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p style={{
              ...serif, fontSize: 17, fontStyle: "italic", color: ASH,
              maxWidth: 480, margin: "0 auto", lineHeight: 1.7,
            }}>
              After 130 years, no one has closed this. The most empirically confirmed law
              in physics may imply that your memories, your identity, and your experience
              of reading this sentence are a temporary accident in an infinite void.
            </p>
          </Reveal>
          <Reveal delay={0.4}>
            <div style={{
              ...mono, fontSize: 10, color: "rgba(255,255,255,0.12)",
              letterSpacing: 0.5, lineHeight: 2, marginTop: 56,
            }}>
              Wolpert, Rovelli & Scharnhorst (2025) · Mozersky (2025) · Saad (2025)<br />
              Carroll · Greene · Dyson, Kleban & Susskind (2002) · Albrecht & Sorbo (2004)<br />
              Santa Fe Institute · Nature · Phys.org · MDPI Entropy
              <br /><br />
              From a conversation between a human and a language model · Valentine's Day, 2026
            </div>
          </Reveal>
        </section>

      </div>
    </div>
  );
}
