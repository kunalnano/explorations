import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════════════
   MULTI-AGENT CIVILIZATION
   How autonomous AI agents recapitulate 10,000 years of
   organizational theory in a weekend.
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
      opacity: vis ? 1 : 0,
      transform: vis ? "translateY(0)" : "translateY(32px)",
      transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`,
    }}>
      {children}
    </div>
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

// ── STAGE CARD ──
const STAGES = [
  {
    num: "1", name: "The Campfire", agents: "2–3 agents", color: GOLD, icon: "🔥",
    description: "A small tribe. Everyone can see what everyone else is doing. Coordination is implicit — you just look across the fire and see what's happening. No governance needed. No protocols.",
    mechanism: "Shared filesystem as communication bus. Scoped tasks by directory. Human oversees everything.",
    emergence: "Nothing formal emerges. Trust is implicit. Scale is small enough that chaos is manageable.",
    humanAnalog: "Hunter-gatherer bands. Dunbar's number hasn't been exceeded. Cooperation is face-to-face.",
  },
  {
    num: "2", name: "The Village", agents: "6–10 agents", color: GREEN, icon: "🏘️",
    description: "You can't just scope by 'don't touch that file.' You need roles. You need a reviewer agent that acts as a village elder — someone whose job isn't to produce, but to maintain coherence.",
    mechanism: "Shared AGENTS.md describing social contracts. Naming conventions. Merge protocols. Role specialization.",
    emergence: "Culture. Written norms. The first governance artifact. The reviewer agent is the first institution.",
    humanAnalog: "Agricultural settlements. Shared granaries. Elders. Oral laws becoming customs.",
  },
  {
    num: "3", name: "The City", agents: "10–50 agents", color: ICE, icon: "🏙️",
    description: "Agents produce artifacts that other agents consume not as files, but as interfaces. Agent A doesn't need to know how Agent B implemented the service — it just needs the API contract.",
    mechanism: "Task graphs. Dependency resolution. Abstraction boundaries. Something that looks like a legal system for resolving conflicts.",
    emergence: "Specialization. Contracts. Bureaucracy. The need for governance that the creator can't personally manage.",
    humanAnalog: "City-states. Division of labor. Written law. Courts. Trade agreements between strangers.",
  },
  {
    num: "4", name: "The Global Village", agents: "50+ agents", color: GHOST, icon: "🌍",
    description: "The patterns of human civilization aren't just analogies for multi-agent systems — they're the literal solutions to the same coordination problems.",
    mechanism: "Markets (agents competing for best solutions). Hierarchy (reviewer of reviewers). Mesh networks (peer agents). Democratic consensus.",
    emergence: "Every pattern humans invented over 10,000 years. Property rights, markets, governance, culture — all re-derived from first principles.",
    humanAnalog: "Globalization. The internet. International law. The UN. Open-source communities.",
  },
];

function StageCard({ stage }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <Reveal>
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          background: expanded ? "rgba(255,255,255,0.04)" : FAINT,
          border: `1px solid ${expanded ? stage.color + "44" : LINE}`,
          borderRadius: 16, padding: "28px 24px", marginBottom: 16, cursor: "pointer",
          transition: "all 0.4s ease",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: expanded ? 20 : 0 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14,
            background: stage.color + "12", border: `1px solid ${stage.color}33`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 26, flexShrink: 0,
          }}>{stage.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ ...mono, fontSize: 10, letterSpacing: 2, color: stage.color, textTransform: "uppercase" }}>
              Stage {stage.num} · {stage.agents}
            </div>
            <div style={{ ...sans, fontSize: 22, fontWeight: 700, lineHeight: 1.3 }}>{stage.name}</div>
          </div>
          <div style={{ ...mono, fontSize: 18, color: ASH, transition: "transform 0.3s", transform: expanded ? "rotate(45deg)" : "rotate(0)" }}>+</div>
        </div>

        {expanded && (
          <div style={{ paddingLeft: 72 }}>
            <div style={{ ...serif, fontSize: 16, lineHeight: 1.7, color: BONE, marginBottom: 20 }}>
              {stage.description}
            </div>
            {[
              { label: "MECHANISM", text: stage.mechanism, c: stage.color },
              { label: "WHAT EMERGES", text: stage.emergence, c: GREEN },
              { label: "HUMAN ANALOG", text: stage.humanAnalog, c: GOLD },
            ].map((row, i) => (
              <div key={i} style={{ marginBottom: 14 }}>
                <div style={{ ...mono, fontSize: 9, letterSpacing: 2, color: row.c, marginBottom: 4 }}>{row.label}</div>
                <div style={{ ...serif, fontSize: 14, color: ASH, lineHeight: 1.5 }}>{row.text}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Reveal>
  );
}

// ── EMERGENCE MAP ──
const EMERGENCES = [
  { agent: "File ownership scoping", human: "Property rights", icon: "🏠" },
  { agent: "AGENTS.md conventions", human: "Language & culture", icon: "📝" },
  { agent: "Reviewer agent enforcing standards", human: "Law & judiciary", icon: "⚖️" },
  { agent: "Linter as legislature", human: "Regulation", icon: "📋" },
  { agent: "Agents competing for best solution", human: "Markets", icon: "📈" },
  { agent: "Human selecting the winner", human: "Democracy / elections", icon: "🗳️" },
  { agent: "Git repo", human: "Roads & infrastructure", icon: "🛤️" },
  { agent: "Test suite", human: "Utilities & public services", icon: "🔧" },
  { agent: "CI pipeline", human: "Bureaucratic process", icon: "🏛️" },
];

function EmergenceMap() {
  return (
    <div>
      {EMERGENCES.map((e, i) => (
        <Reveal key={i}>
          <div style={{
            display: "flex", alignItems: "center", gap: 12, padding: "12px 0",
            borderBottom: i < EMERGENCES.length - 1 ? `1px solid ${LINE}` : "none",
          }}>
            <span style={{ fontSize: 18, width: 32, textAlign: "center" }}>{e.icon}</span>
            <div style={{ flex: 1, ...mono, fontSize: 13, color: ICE }}>{e.agent}</div>
            <div style={{ width: 24, textAlign: "center", color: ASH }}>≡</div>
            <div style={{ flex: 1, ...serif, fontSize: 14, color: GOLD }}>{e.human}</div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}


// ═══════════════ MAIN ═══════════════
export default function MultiAgentCiv({ onBack }) {
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
            <div style={{ ...mono, fontSize: 10, letterSpacing: 4, color: GREEN, textTransform: "uppercase", marginBottom: 20 }}>
              When AI agents discover governance
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <h1 style={{ ...sans, fontSize: "clamp(36px, 7vw, 56px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: -2, marginBottom: 24 }}>
              Multi-Agent<br /><span style={{ color: GREEN }}>Civilization</span>
            </h1>
          </Reveal>
          <Reveal delay={0.3}>
            <div style={{ ...serif, fontSize: 20, lineHeight: 1.7, color: ASH, maxWidth: 540, fontStyle: "italic" }}>
              Put autonomous agents in a shared environment with scarce resources.
              Watch them reinvent 10,000 years of organizational theory in a weekend.
            </div>
          </Reveal>
        </div>

        {/* CH I: THE OBSERVATION */}
        <Chapter label="Chapter I — The Observation" title="You're not building a civilization metaphor. You're watching one self-assemble.">
          <Reveal>
            <div style={{ ...serif, fontSize: 17, lineHeight: 1.85, color: BONE, maxWidth: 560 }}>
              Any sufficiently complex system of autonomous agents operating on shared resources
              will converge on the same patterns humans invented. Not because we're special.
              Because{" "}
              <span style={{ color: ICE }}>the coordination problems are the same</span>.
              <br /><br />
              Humans didn't invent markets, governance, and culture because of some unique
              biological insight. We invented them because they're the{" "}
              <span style={{ color: GREEN }}>universal solutions</span> to the universal
              problems of autonomous agents sharing finite resources.
              <br /><br />
              It's physics. It's information theory. It's inevitable.
            </div>
          </Reveal>
        </Chapter>

        {/* CH II: THE FOUR STAGES */}
        <Chapter label="Chapter II — The Stages" title="From campfire to global village">
          {STAGES.map((s, i) => <StageCard key={i} stage={s} />)}
        </Chapter>

        {/* CH III: THE EMERGENCE MAP */}
        <Chapter label="Chapter III — The Emergence Map" title="Agent primitives map to civilizational institutions">
          <Reveal>
            <div style={{ ...serif, fontSize: 16, lineHeight: 1.7, color: ASH, marginBottom: 32, maxWidth: 540 }}>
              Every governance structure that took humans millennia to develop
              re-emerges within hours when you put AI agents in a shared filesystem.
            </div>
          </Reveal>
          <Reveal>
            <div style={{ background: FAINT, border: `1px solid ${LINE}`, borderRadius: 16, padding: "24px 20px" }}>
              <div style={{ display: "flex", gap: 12, marginBottom: 16, paddingBottom: 12, borderBottom: `1px solid ${LINE}` }}>
                <div style={{ width: 32 }} />
                <div style={{ flex: 1, ...mono, fontSize: 9, letterSpacing: 2, color: ICE }}>AGENT WORLD</div>
                <div style={{ width: 24 }} />
                <div style={{ flex: 1, ...mono, fontSize: 9, letterSpacing: 2, color: GOLD }}>HUMAN WORLD</div>
              </div>
              <EmergenceMap />
            </div>
          </Reveal>
        </Chapter>

        {/* CH IV: THE GOD PROBLEM */}
        <Chapter label="Chapter IV — The God Problem" title="You're currently the god of this system">
          <Reveal>
            <div style={{ ...serif, fontSize: 17, lineHeight: 1.85, color: BONE, maxWidth: 560 }}>
              You write the founding documents (the prompts). You set the initial conditions
              (the tmux layout). You adjudicate disputes (merge conflicts). You decide who
              lives and dies (killing agents).
              <br /><br />
              But as the system scales, that becomes untenable.{" "}
              <span style={{ color: EMBER }}>You can't review every diff from 20 agents.</span>
            </div>
          </Reveal>

          <Reveal>
            <div style={{ padding: "32px 0" }}>
              {[
                { step: "You delegate review to a reviewer agent", result: "You've invented hierarchy" },
                { step: "You need a reviewer of the reviewer", result: "You've invented bureaucracy" },
                { step: "It's too slow, so you flatten it", result: "You've invented mesh networks" },
                { step: "Agents vote on conflicting solutions", result: "You've invented democracy" },
                { step: "You create shared conventions everyone reads first", result: "You've invented culture" },
              ].map((row, i) => (
                <Reveal key={i}>
                  <div style={{
                    display: "flex", gap: 16, alignItems: "baseline", padding: "14px 0",
                    borderBottom: `1px solid ${LINE}`,
                  }}>
                    <div style={{ ...mono, fontSize: 11, color: GHOST, width: 20, flexShrink: 0 }}>{i + 1}</div>
                    <div style={{ flex: 1, ...serif, fontSize: 15, color: BONE, lineHeight: 1.5 }}>{row.step}</div>
                    <div style={{ ...mono, fontSize: 12, color: EMBER, textAlign: "right" }}>→ {row.result}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <div style={{
              padding: "32px 28px", background: GHOST + "08", border: `1px solid ${GHOST}22`,
              borderRadius: 16, marginTop: 16,
            }}>
              <div style={{ ...sans, fontSize: 17, fontWeight: 600, color: GHOST, marginBottom: 12 }}>
                You've just recapitulated 10,000 years of organizational theory in a weekend.
              </div>
              <div style={{ ...serif, fontSize: 15, lineHeight: 1.7, color: ASH }}>
                And the insight that makes this actionable: the internal developer platform
                IS the village square. The service catalog IS the shared language. The scorecards
                ARE the social contracts. You're running a simulation of the problem your
                enterprise customers are paying to solve.
              </div>
            </div>
          </Reveal>
        </Chapter>

        {/* CLOSER */}
        <section style={{ padding: "80px 0 120px", borderTop: `1px solid ${LINE}`, textAlign: "center" }}>
          <Reveal>
            <h2 style={{ ...sans, fontSize: "clamp(24px, 4.5vw, 38px)", fontWeight: 700, lineHeight: 1.15, maxWidth: 540, margin: "0 auto 20px" }}>
              Civilization isn't a metaphor for multi-agent systems.<br />
              Multi-agent systems are a <span style={{ color: GREEN }}>proof</span> that civilization was inevitable.
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <div style={{ ...mono, fontSize: 10, color: "rgba(255,255,255,0.12)", letterSpacing: 0.5, lineHeight: 2, marginTop: 56 }}>
              From a conversation between a human and a language model · February 2026
            </div>
          </Reveal>
        </section>

      </div>
    </div>
  );
}
