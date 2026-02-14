import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════════════
   PATH DEPENDENCY OF INNOVATION
   Why Tesla and Waymo built completely different self-driving
   architectures — and why both were "correct."
   ═══════════════════════════════════════════════════════════════ */

const BG = "#050508";
const BONE = "#e8e4dc";
const ASH = "#4a4860";
const ICE = "#6ee7f0";
const EMBER = "#ff4d2e";
const GHOST = "#9b8fff";
const GOLD = "#fbbf24";
const GREEN = "#34d399";
const TESLA_RED = "#e82127";
const WAYMO_BLUE = "#4285f4";
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

// ── COMPARISON ROW ──
function CompareRow({ dimension, tesla, waymo }) {
  return (
    <Reveal>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, padding: "16px 0", borderBottom: `1px solid ${LINE}` }}>
        <div style={{ ...sans, fontSize: 13, fontWeight: 600, color: BONE }}>{dimension}</div>
        <div style={{ ...serif, fontSize: 13, color: TESLA_RED + "cc", lineHeight: 1.5 }}>{tesla}</div>
        <div style={{ ...serif, fontSize: 13, color: WAYMO_BLUE + "cc", lineHeight: 1.5 }}>{waymo}</div>
      </div>
    </Reveal>
  );
}

// ── PATH CARD ──
function PathCard({ color, icon, company, canvas, constraint, assumption, evolution, concession }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <Reveal>
      <div onClick={() => setExpanded(!expanded)} style={{
        background: expanded ? "rgba(255,255,255,0.04)" : FAINT,
        border: `1px solid ${expanded ? color + "44" : LINE}`,
        borderRadius: 16, padding: "28px 24px", marginBottom: 16, cursor: "pointer",
        transition: "all 0.4s ease",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: expanded ? 20 : 0 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14, background: color + "12",
            border: `1px solid ${color}33`, display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 26, flexShrink: 0,
          }}>{icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ ...sans, fontSize: 22, fontWeight: 700, lineHeight: 1.3 }}>{company}</div>
            <div style={{ ...serif, fontSize: 13, color: ASH, fontStyle: "italic" }}>{canvas}</div>
          </div>
          <div style={{ ...mono, fontSize: 18, color: ASH, transition: "transform 0.3s", transform: expanded ? "rotate(45deg)" : "rotate(0)" }}>+</div>
        </div>
        {expanded && (
          <div style={{ paddingLeft: 72 }}>
            {[
              { label: "ECOSYSTEM CONSTRAINT", text: constraint, c: color },
              { label: "CORE ASSUMPTION", text: assumption, c: GOLD },
              { label: "EVOLUTIONARY PATH", text: evolution, c: GREEN },
              { label: "THE CONCESSION", text: concession, c: EMBER },
            ].map((row, i) => (
              <div key={i} style={{ marginBottom: 16 }}>
                <div style={{ ...mono, fontSize: 9, letterSpacing: 2, color: row.c, marginBottom: 4 }}>{row.label}</div>
                <div style={{ ...serif, fontSize: 14, color: BONE, lineHeight: 1.6 }}>{row.text}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Reveal>
  );
}

// ── BRANCHING TREE SVG ──
function BranchingTree() {
  return (
    <Reveal>
      <svg viewBox="0 0 600 320" style={{ width: "100%", maxWidth: 600, display: "block", margin: "24px auto" }}>
        {/* Root */}
        <rect x={220} y={10} width={160} height={44} rx={10} fill={GHOST + "18"} stroke={GHOST + "44"} />
        <text x={300} y={37} textAnchor="middle" fill={GHOST} fontSize={12} fontFamily="'Segoe UI', sans-serif" fontWeight={600}>
          Self-Driving Problem
        </text>

        {/* Branch lines */}
        <path d="M 260 54 L 160 100" stroke={TESLA_RED + "44"} strokeWidth={1.5} fill="none" />
        <path d="M 340 54 L 440 100" stroke={WAYMO_BLUE + "44"} strokeWidth={1.5} fill="none" />

        {/* Tesla branch */}
        <rect x={60} y={100} width={200} height={40} rx={10} fill={TESLA_RED + "12"} stroke={TESLA_RED + "33"} />
        <text x={160} y={124} textAnchor="middle" fill={TESLA_RED} fontSize={11} fontFamily="'Segoe UI', sans-serif" fontWeight={600}>
          Tesla: Vision-first, fleet data
        </text>

        {/* Waymo branch */}
        <rect x={340} y={100} width={200} height={40} rx={10} fill={WAYMO_BLUE + "12"} stroke={WAYMO_BLUE + "33"} />
        <text x={440} y={124} textAnchor="middle" fill={WAYMO_BLUE} fontSize={11} fontFamily="'Segoe UI', sans-serif" fontWeight={600}>
          Waymo: LiDAR-first, HD maps
        </text>

        {/* Tesla sub-branches */}
        <path d="M 120 140 L 100 180" stroke={TESLA_RED + "33"} strokeWidth={1} fill="none" />
        <path d="M 200 140 L 220 180" stroke={TESLA_RED + "33"} strokeWidth={1} fill="none" />
        <text x={100} y={198} textAnchor="middle" fill={ASH} fontSize={9} fontFamily="monospace">Camera-only</text>
        <text x={100} y={212} textAnchor="middle" fill={EMBER} fontSize={9} fontFamily="monospace">→ HW4: LiDAR added</text>
        <text x={220} y={198} textAnchor="middle" fill={ASH} fontSize={9} fontFamily="monospace">Fleet moat</text>
        <text x={220} y={212} textAnchor="middle" fill={EMBER} fontSize={9} fontFamily="monospace">→ Less edge than expected</text>

        {/* Waymo sub-branches */}
        <path d="M 400 140 L 380 180" stroke={WAYMO_BLUE + "33"} strokeWidth={1} fill="none" />
        <path d="M 480 140 L 500 180" stroke={WAYMO_BLUE + "33"} strokeWidth={1} fill="none" />
        <text x={380} y={198} textAnchor="middle" fill={ASH} fontSize={9} fontFamily="monospace">Robustness first</text>
        <text x={380} y={212} textAnchor="middle" fill={GREEN} fontSize={9} fontFamily="monospace">→ Operational in SF, PHX</text>
        <text x={500} y={198} textAnchor="middle" fill={ASH} fontSize={9} fontFamily="monospace">Cost be damned</text>
        <text x={500} y={212} textAnchor="middle" fill={GOLD} fontSize={9} fontFamily="monospace">→ $100K+ per vehicle</text>

        {/* Convergence */}
        <path d="M 160 230 L 300 280" stroke={LINE} strokeWidth={1} strokeDasharray="4 4" fill="none" />
        <path d="M 440 230 L 300 280" stroke={LINE} strokeWidth={1} strokeDasharray="4 4" fill="none" />
        <rect x={210} y={270} width={180} height={40} rx={10} fill={FAINT} stroke={LINE} />
        <text x={300} y={290} textAnchor="middle" fill={BONE} fontSize={10} fontFamily="'Segoe UI', sans-serif" fontWeight={600}>
          Next frontier: Generalization
        </text>
        <text x={300} y={303} textAnchor="middle" fill={ASH} fontSize={9} fontFamily="Georgia, serif" fontStyle="italic">
          Working outside training arena
        </text>
      </svg>
    </Reveal>
  );
}


// ═══════════════ MAIN ═══════════════
export default function PathDependency({ onBack }) {
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
            <div style={{ ...mono, fontSize: 10, letterSpacing: 4, color: GOLD, textTransform: "uppercase", marginBottom: 20 }}>
              Why "rational" actors build opposite solutions
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <h1 style={{ ...sans, fontSize: "clamp(36px, 7vw, 56px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: -2, marginBottom: 24 }}>
              The Path Dependency<br /><span style={{ color: GOLD }}>of Innovation</span>
            </h1>
          </Reveal>
          <Reveal delay={0.3}>
            <div style={{ ...serif, fontSize: 20, lineHeight: 1.7, color: ASH, maxWidth: 540, fontStyle: "italic" }}>
              Tesla and Waymo didn't choose different strategies. Their ecosystems chose for them.
              Both were "correct" — constrained by the canvas they started on.
            </div>
          </Reveal>
        </div>

        {/* CH I: THE THESIS */}
        <Chapter label="Chapter I — The Thesis" title="Innovation is path-dependent, not rational">
          <Reveal>
            <div style={{ ...serif, fontSize: 17, lineHeight: 1.85, color: BONE, maxWidth: 560 }}>
              When seemingly rational actors arrive at completely different solutions to the same
              problem, the explanation isn't that one is smarter. It's that{" "}
              <span style={{ color: ICE }}>their evolutionary paths reduced them to different option sets</span>.
              <br /><br />
              The canvas you start on constrains the art you can make. Tesla started on the canvas
              of car manufacturing. Waymo started on the canvas of pure research. Each approach
              is a unique outcome of its evolutionary path, not a free choice from infinite options.
            </div>
          </Reveal>
        </Chapter>

        {/* CH II: THE TWO PATHS */}
        <Chapter label="Chapter II — The Two Paths" title="Same problem, different ecosystems, opposite architectures">
          <BranchingTree />

          <PathCard
            color={TESLA_RED} icon="⚡" company="Tesla" canvas="The car company that had to evolve"
            constraint="Tesla is a car manufacturing business with an overarching goal of transitioning transport from fossil fuels to electric. Self-driving had to be bolted onto existing vehicles sold to consumers."
            assumption="'Our fleet of millions of cars is a data moat. Camera-only vision at consumer-grade cost will outscale LiDAR.' First-principles thinking applied to sensor economics."
            evolution="Camera-only → Neural nets on fleet data → Realized the data moat was less decisive than expected → HW4 generation quietly incorporating LiDAR-like capabilities → Still hasn't publicly conceded the assumption."
            concession="The fleet data advantage didn't materialize as expected. The generalization problem (working outside training data) remains unsolved. Musk hasn't conceded, but HW4 tells the story."
          />

          <PathCard
            color={WAYMO_BLUE} icon="🔍" company="Waymo (Google)" canvas="The research lab with unlimited patience"
            constraint="Google had no car business to protect. No consumer hardware to amortize. Pure research freedom with deep pockets. The luxury of making an agnostic, universal product."
            assumption="'Solve for robustness first. Cost be damned — if it works, economies of scale will handle cost.' The purist approach: get the physics right, then optimize."
            evolution="LiDAR + HD maps → Geofenced operations in SF, Phoenix → Operational robotaxi service → Still $100K+ per vehicle → Slowly expanding coverage area."
            concession="The cost problem is real and persistent. Geofencing means they haven't solved generalization either. Coverage expansion is slow. The 'economies of scale' assumption hasn't fully materialized."
          />
        </Chapter>

        {/* CH III: COMPARISON */}
        <Chapter label="Chapter III — The Comparison" title="Neither was wrong. Both were constrained.">
          <Reveal>
            <div style={{ background: FAINT, border: `1px solid ${LINE}`, borderRadius: 16, padding: "24px 20px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, paddingBottom: 12, marginBottom: 4, borderBottom: `1px solid ${LINE}` }}>
                <div style={{ ...mono, fontSize: 9, letterSpacing: 2, color: ASH }}>DIMENSION</div>
                <div style={{ ...mono, fontSize: 9, letterSpacing: 2, color: TESLA_RED }}>TESLA</div>
                <div style={{ ...mono, fontSize: 9, letterSpacing: 2, color: WAYMO_BLUE }}>WAYMO</div>
              </div>
              <CompareRow dimension="Starting canvas" tesla="Car manufacturer" waymo="Research lab" />
              <CompareRow dimension="Sensor philosophy" tesla="Camera-only (→ hybrid)" waymo="LiDAR + cameras + radar" />
              <CompareRow dimension="Data strategy" tesla="Fleet of millions" waymo="Focused fleet, HD maps" />
              <CompareRow dimension="Cost per unit" tesla="Consumer-grade" waymo="$100K+ per vehicle" />
              <CompareRow dimension="Coverage" tesla="Everywhere (with caveats)" waymo="Geofenced cities" />
              <CompareRow dimension="Generalization" tesla="Unsolved" waymo="Unsolved" />
              <CompareRow dimension="Business model" tesla="Consumer ownership" waymo="Robotaxi service" />
              <CompareRow dimension="Biggest bet" tesla="Scale > precision" waymo="Precision > scale" />
            </div>
          </Reveal>
        </Chapter>

        {/* CH IV: THE PRINCIPLE */}
        <Chapter label="Chapter IV — The Principle" title="The general framework">
          <Reveal>
            <div style={{ ...serif, fontSize: 17, lineHeight: 1.85, color: BONE, maxWidth: 560, marginBottom: 32 }}>
              This isn't just about self-driving cars. It's a general principle:{" "}
              <span style={{ color: GOLD }}>
                the ecosystem an innovator starts in constrains the solution space they can explore.
              </span>
              <br /><br />
              You see this everywhere. AWS built cloud infrastructure because they had excess
              server capacity from e-commerce. Slack became a messaging platform because their
              game studio needed internal tools. The origin story isn't just history — it's architecture.
            </div>
          </Reveal>

          <Reveal>
            <div style={{ padding: "24px 0" }}>
              {[
                { label: "Constraint", insight: "Your existing business, infrastructure, and customers define your option set" },
                { label: "Assumption", insight: "You make a bet based on what your ecosystem makes possible" },
                { label: "Evolution", insight: "You iterate within those constraints, often unable to see the paths you didn't take" },
                { label: "Concession", insight: "Reality forces adaptation, but the original path still shapes the architecture" },
                { label: "Convergence", insight: "Different paths eventually face the same frontier problems — just from different angles" },
              ].map((row, i) => (
                <Reveal key={i}>
                  <div style={{ display: "flex", gap: 16, padding: "14px 0", borderBottom: `1px solid ${LINE}`, alignItems: "baseline" }}>
                    <div style={{ ...mono, fontSize: 11, color: GOLD, width: 100, flexShrink: 0 }}>{row.label}</div>
                    <div style={{ ...serif, fontSize: 15, color: BONE, lineHeight: 1.5 }}>{row.insight}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </Reveal>
        </Chapter>

        {/* CLOSER */}
        <section style={{ padding: "80px 0 120px", borderTop: `1px solid ${LINE}`, textAlign: "center" }}>
          <Reveal>
            <h2 style={{ ...sans, fontSize: "clamp(24px, 4.5vw, 38px)", fontWeight: 700, lineHeight: 1.15, maxWidth: 540, margin: "0 auto 20px" }}>
              The path you started on<br />isn't just your history.<br />
              It's your <span style={{ color: GOLD }}>architecture</span>.
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
