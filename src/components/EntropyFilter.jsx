import { useState, useEffect, useRef } from "react";
import {
  CorridorVisualization,
  BootstrapParadoxVis,
  FragilityMapVis,
  DestructionEconVis,
  StargateCollapseVis,
  PrisonersDilemmaVis,
} from "./EntropyFilterVis";

/* ═══════════════════════════════════════════════════════════════
   THE ENTROPY FILTER
   The Great Filter isn't an event. It's a gradient.
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
const CRIMSON = "#e6394a";

const sans = { fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif" };
const serif = { fontFamily: "Georgia, 'Times New Roman', serif" };
const mono = { fontFamily: "'SF Mono', 'Cascadia Code', 'Consolas', monospace" };

// ── Reveal ──
function Reveal({ children, delay = 0, style }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.unobserve(el); } },
      { threshold: 0.12 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "translateY(0)" : "translateY(32px)",
      transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`,
      ...style,
    }}>{children}</div>
  );
}

// ── Chapter ──
function Chapter({ label, title, accent = EMBER, children }) {
  return (
    <section style={{ padding: "80px 0", borderTop: `1px solid ${LINE}` }}>
      <Reveal>
        <div style={{
          ...mono, fontSize: 10, letterSpacing: 3,
          color: accent, textTransform: "uppercase", marginBottom: 12,
        }}>{label}</div>
        <h2 style={{
          ...sans, fontSize: "clamp(28px, 5vw, 44px)",
          fontWeight: 700, lineHeight: 1.1, marginBottom: 40, maxWidth: 600,
        }}>{title}</h2>
      </Reveal>
      {children}
    </section>
  );
}

// ── Pull Quote ──
function PullQuote({ children, accent = EMBER }) {
  return (
    <Reveal>
      <blockquote style={{
        ...serif, fontSize: "clamp(20px, 3.5vw, 28px)",
        fontStyle: "italic", lineHeight: 1.5,
        borderLeft: `3px solid ${accent}`,
        paddingLeft: 24, margin: "48px 0",
        color: BONE, maxWidth: 640,
      }}>{children}</blockquote>
    </Reveal>
  );
}

// ── Prose ──
function Prose({ children }) {
  return (
    <Reveal>
      <div style={{
        ...serif, fontSize: 17, lineHeight: 1.75,
        color: "#c4c0b8", marginBottom: 32, maxWidth: 640,
      }}>{children}</div>
    </Reveal>
  );
}

// ══════════════════════════════════════════════════════════════
export default function EntropyFilter({ onBack }) {
  return (
    <div style={{ background: BG, color: BONE, minHeight: "100vh" }}>
      {/* Back */}
      {/* ── HERO ── */}
      <header style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        justifyContent: "center", alignItems: "center",
        padding: "80px 24px", textAlign: "center",
      }}>
        <Reveal>
          <div style={{
            ...mono, fontSize: 10, letterSpacing: 4,
            color: EMBER, textTransform: "uppercase", marginBottom: 24,
          }}>A THERMODYNAMIC ANSWER TO FERMI</div>
        </Reveal>
        <Reveal delay={0.15}>
          <h1 style={{
            ...sans, fontSize: "clamp(40px, 8vw, 80px)",
            fontWeight: 800, letterSpacing: -3, lineHeight: 1.05, marginBottom: 20,
            background: `linear-gradient(135deg, ${BONE} 0%, ${EMBER} 100%)`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>The Entropy Filter</h1>
        </Reveal>
        <Reveal delay={0.3}>
          <p style={{
            ...serif, fontSize: "clamp(16px, 2.5vw, 22px)",
            fontStyle: "italic", color: ASH, maxWidth: 560, lineHeight: 1.6,
          }}>
            Why the corridor between "smart enough to try" and<br />
            "coordinated enough to succeed" closes before anyone gets through.
          </p>
        </Reveal>
        <Reveal delay={0.5}>
          <div style={{
            marginTop: 40, padding: "16px 24px",
            background: FAINT, border: `1px solid ${LINE}`,
            borderRadius: 12, maxWidth: 440,
          }}>
            <div style={{ ...mono, fontSize: 9, color: ASH, letterSpacing: 1 }}>
              Based on a conversation between Hank Sharma and Claude
            </div>
            <div style={{ ...mono, fontSize: 9, color: ASH, letterSpacing: 1, marginTop: 4 }}>
              March 13, 2026 · Canyon Lake, Texas
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.7}>
          <div style={{ marginTop: 48, color: ASH, fontSize: 20, opacity: 0.4 }}>↓</div>
        </Reveal>
      </header>

      {/* ── CONTENT ── */}
      <div style={{ maxWidth: 740, margin: "0 auto", padding: "0 24px" }}>

        {/* THESIS */}
        <Chapter label="The Thesis" title="The Great Filter Is a Gradient" accent={EMBER}>
          <Prose><p>The Great Filter isn't a wall. It's not nuclear war, or a rogue AI, or a gamma-ray burst. It's not an event at all.</p></Prose>
          <Prose><p>It's a gradient. A thermodynamic pressure that increases with complexity. Any civilization sophisticated enough to approach AGI is, by definition, operating at a level of complexity that requires an enormous number of things to go right simultaneously.</p></Prose>
          <Prose><p>Energy extraction. Material refinement. Global supply chains. Stable geopolitics. Functioning institutions. Knowledge preservation. All maintained by biological organisms subject to entropy, irrationality, and tribalism.</p></Prose>
          <PullQuote>
            The biggest problem against AI is entropy. You need a whole bunch of things to come together in magical ways for AI to happen, and monkeys are in charge of that.
          </PullQuote>
          <Prose><p>There's way more at stake for this to NOT happen than to happen. The corridor between capability and coordination narrows as both increase, and entropy closes it before anyone gets through.</p></Prose>
          <CorridorVisualization />
        </Chapter>

        {/* I: BOOTSTRAP */}
        <Chapter label="Chapter I" title="The Bootstrap Paradox" accent={GHOST}>
          <Prose><p>AGI requires AGI to manage the complexity that building AGI demands.</p></Prose>
          <Prose><p>You need AI to optimize the energy grids that power the data centers that train the AI. You need AI to manage the supply chains that deliver the helium that cools the fabs that make the chips that run the AI.</p></Prose>
          <PullQuote accent={GHOST}>
            The thing you're building is the only thing that could make building it feasible. But it doesn't exist yet.
          </PullQuote>
          <Prose><p>Every dependency in the chain is circular. Not metaphorically. Literally. The optimization problem is self-referential, and the system that needs to be optimized is the system doing the optimizing.</p></Prose>
          <BootstrapParadoxVis />
          <Prose><p>Hover a node. Follow the arrows. Every link is a dependency. Every dependency is a single point of failure. And every single point of failure is managed by humans who need sleep, have opinions, and occasionally declare war on each other.</p></Prose>
        </Chapter>

        {/* II: PHYSICAL TETHER */}
        <Chapter label="Chapter II" title="The Physical Tether" accent={ICE}>
          <Prose><p>The self-recursive improvement loop in software is real. An AI can rewrite its own code, optimize its own training, compress its own weights. Software moves at the speed of light.</p></Prose>
          <Prose><p>But software runs on hardware. And hardware is made of atoms. Moving atoms around requires a physical economy that AGI can optimize but cannot bypass.</p></Prose>
          <PullQuote accent={ICE}>
            The intelligence explosion has to drag the physical economy along with it. And the physical economy is heavy.
          </PullQuote>
          <Prose><p>Building a data center takes years. Mining rare earth elements takes permits, infrastructure, and political stability. Laying undersea cable takes specialized ships that take years to build. Generating the power to run inference takes fuel that takes time to extract, refine, and transport.</p></Prose>
          <Prose><p>The bottleneck isn't intelligence. It's atoms. And atoms obey thermodynamics, not Moore's Law.</p></Prose>
        </Chapter>

        {/* III: HORMUZ */}
        <Chapter label="Chapter III" title="Proof of Concept: March 2026" accent={EMBER}>
          <Prose><p>A single shipping lane closes.</p></Prose>
          <Prose><p>India, with 1.4 billion people, a nuclear arsenal, and a massive IT sector, can't get cooking gas within two weeks. 67% of India's LPG transits the Strait of Hormuz. Infosys tells 300,000 employees to bring food from home. Restaurants shut down across the country.</p></Prose>
          <Prose><p>Pakistan goes to a 4-day work week. Vietnam asks employers to allow remote work to save fuel. One chokepoint. Civilizational-scale impact. Two weeks.</p></Prose>
          <FragilityMapVis />
          <PullQuote>
            The same strait carries helium from Qatar, 33% of the global supply. Irreplaceable in semiconductor fabrication. No helium, no chips. No chips, no AI.
          </PullQuote>
          <Prose><p>The cooking gas crisis and the AI supply chain crisis share the same root cause. The same geography. The same fragility. One family can't make dinner. One lab can't make chips. Same problem.</p></Prose>
        </Chapter>

        {/* IV: DESTRUCTION */}
        <Chapter label="Chapter IV" title="Destruction Economics" accent={GOLD}>
          <Prose><p>Every bomb dropped on a refinery is embodied energy, embodied materials, embodied human time, converted to rubble in seconds. Then you spend twice the resources rebuilding.</p></Prose>
          <Prose><p>GDP counts both the destruction and the reconstruction as economic activity. The accounting is insane.</p></Prose>
          <DestructionEconVis />
          <PullQuote accent={GOLD}>
            On a planet with finite resources and a ticking energy clock, organized destruction is thermodynamically criminal.
          </PullQuote>
          <Prose><p>We are spending money to destroy things that will take years and even more money and materials to fix. Every joule spent on a missile is a joule not spent on a chip fab. Every engineer designing a guidance system is an engineer not designing an energy grid. The opportunity cost isn't just economic. It's civilizational.</p></Prose>
        </Chapter>

        {/* V: STARGATE */}
        <Chapter label="Chapter V" title="The Stargate Collapse" accent={ICE}>
          <Prose><p>OpenAI walked away from a 600MW data center expansion. The reason? Nvidia's chips would be obsolete before the building had power. Oracle took on massive debt for infrastructure that needs to be gutted before it's used.</p></Prose>
          <Prose><p>Real materials. Real energy. Real labor. Consumed for nothing. Entropy at the corporate level.</p></Prose>
          <StargateCollapseVis />
          <Prose><p>Meanwhile, Nvidia allegedly paid $150M to block AMD from the contract. The golden triangle, OpenAI + Nvidia + Oracle, fragmenting under its own complexity. $500 billion in announced investment evaporating not because the technology failed, but because the coordination did.</p></Prose>
          <PullQuote accent={ICE}>
            The corridor didn't close because anyone wasn't smart enough. It closed because the pieces couldn't stay aligned long enough.
          </PullQuote>
        </Chapter>

        {/* VI: GLOBAL VILLAGE */}
        <Chapter label="Chapter VI" title="The Global Village Illusion" accent={GREEN}>
          <Prose><p>We built global supply chains without global governance. Interdependence without shared institutions is just mutual vulnerability. Mutual vulnerability without trust is a hostage situation.</p></Prose>
          <PrisonersDilemmaVis />
          <PullQuote accent={GREEN}>
            When the system works, cooperation is rational. When it stutters, defection cascades. Classic prisoner's dilemma at civilizational scale.
          </PullQuote>
          <Prose><p>Drag the slider. Watch cooperation collapse. Notice how fast it happens, and how the status changes. The transition from "stable" to "closed" takes fewer steps than you'd expect. That's not a design choice. That's the math.</p></Prose>
        </Chapter>

        {/* VII: TOOL PARADOX */}
        <Chapter label="Chapter VII" title="The AI Tool Paradox" accent={GHOST}>
          <Prose><p>A company whose entire product is enabling AI-driven developer tooling cannot allow its own employees to effectively use AI tools. For legitimate security reasons.</p></Prose>
          <Prose><p>The enterprise is becoming dependent on the thing it's simultaneously afraid of. You can't train your models on customer code and then let your employees paste customer code into someone else's model.</p></Prose>
          <PullQuote accent={GHOST}>
            An addiction cycle at the organizational level. You need it, you sell it, you fear it, you restrict it. The dependency and the resistance live in the same body.
          </PullQuote>
          <Prose><p>This is entropy at the institutional level. The same organization that needs AI to survive is structurally incapable of fully adopting AI. The immune system is attacking the cure.</p></Prose>
        </Chapter>

        {/* VIII: NUCLEAR */}
        <Chapter label="Chapter VIII" title="Nuclear Restraint as Precedent" accent={GOLD}>
          <Prose><p>The US in 1945 had a monopoly on the most destructive technology ever created. And chose, imperfectly, self-interestedly, to build institutions rather than conquer.</p></Prose>
          <Prose><p>AI represents a second moment of asymmetric power. Broader in scope. More diffuse in control. The question is the same: what do you do with that window?</p></Prose>
          <Reveal>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, margin: "32px 0" }}>
              {[
                { year: "1945", label: "Nuclear", choices: ["Institutions", "Arms control", "UN, NATO, IAEA"], color: GOLD },
                { year: "2025", label: "AI", choices: ["Competition", "Consolidation", "Resource nationalism"], color: CRIMSON },
              ].map((era) => (
                <div key={era.year} style={{
                  background: FAINT, border: `1px solid ${LINE}`, borderRadius: 12, padding: 20,
                }}>
                  <div style={{ ...mono, fontSize: 10, color: era.color, letterSpacing: 2, marginBottom: 8 }}>
                    {era.year} — {era.label}
                  </div>
                  {era.choices.map((c, i) => (
                    <div key={i} style={{
                      ...serif, fontSize: 14, color: "#c4c0b8", padding: "4px 0",
                      borderLeft: `2px solid ${era.color}33`, paddingLeft: 12, marginTop: 6,
                    }}>{c}</div>
                  ))}
                </div>
              ))}
            </div>
          </Reveal>
          <PullQuote accent={GOLD}>
            The current trajectory doesn't suggest the 1945 answer is being repeated.
          </PullQuote>
        </Chapter>

        {/* IX: KNOWLEDGE */}
        <Chapter label="Chapter IX" title="Institutional Knowledge Evaporation" accent={EMBER}>
          <Prose><p>Change management is actively destroying the expertise pipeline. We're asking the best minds to externalize everything they know into AI-digestible formats, accelerating their own obsolescence.</p></Prose>
          <Prose><p>People who comply fastest are accelerating their own replaceability. People who resist get labeled dinosaurs.</p></Prose>
          <PullQuote>
            Brain obsolescence by request. The institutional knowledge that took decades to build is being extracted, compressed, and served back by systems that don't understand what they're saying.
          </PullQuote>
          <Prose><p>And then when the model hallucinates, when the edge case appears that wasn't in the training data, when the supply chain stutters in a way nobody documented because the person who understood it was "optimized out," there's nobody left who knows how to fix it.</p></Prose>
        </Chapter>

        {/* ── CLOSER ── */}
        <section style={{ padding: "100px 0 80px", borderTop: `1px solid ${LINE}` }}>
          <Reveal>
            <div style={{
              ...mono, fontSize: 10, letterSpacing: 3,
              color: EMBER, textTransform: "uppercase", marginBottom: 40, textAlign: "center",
            }}>THE CORRIDOR</div>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 style={{
              ...sans, fontSize: "clamp(28px, 5vw, 44px)",
              fontWeight: 700, lineHeight: 1.2, textAlign: "center", marginBottom: 40,
            }}>So Where Does This Leave Us?</h2>
          </Reveal>
          <Reveal delay={0.2}>
            <div style={{
              ...serif, fontSize: 17, lineHeight: 1.75,
              color: "#c4c0b8", maxWidth: 640, margin: "0 auto", textAlign: "center",
            }}>
              <p style={{ marginBottom: 24 }}>
                The Filter isn't ahead of us or behind us. It's the ground we're standing on. Every day the system holds together is a day we got lucky. Every supply chain that delivers, every institution that functions, every geopolitical crisis that de-escalates is the corridor staying open by a hair.
              </p>
              <p style={{ marginBottom: 24 }}>
                The argument for AI isn't wrong. The argument for AI is the strongest argument in human history. But the strongest argument doesn't matter if the atoms can't keep up, the monkeys can't cooperate, and the entropy keeps compounding.
              </p>
              <p>The corridor is real. It's narrow. And it's narrowing.</p>
            </div>
          </Reveal>
          <Reveal delay={0.4}>
            <div style={{
              marginTop: 80, textAlign: "center",
              ...serif, fontSize: 13, color: ASH, fontStyle: "italic", opacity: 0.4,
            }}>
              Hank Sharma + Claude · March 2026 · Canyon Lake, TX
            </div>
          </Reveal>
        </section>
      </div>
    </div>
  );
}
