import { useCallback } from "react";

const EXPLORATIONS = [
  {
    id: "emergent-life-lab",
    title: "Emergent Life Lab",
    description: "Conway's Game of Life on acid. Eight cellular automata rulesets, six visual modes, real-time sonification, and a mutation engine. Seed a universe and watch complexity emerge from nothing.",
    color: "#00ffd5",
    date: "Mar 2026",
  },
  {
    id: "intelligence-currency",
    title: "Intelligence as Currency",
    description: "The Compounding Spiral. Seven theses on why intelligence compounds, credentialism collapses, and compute is the new gold.",
    color: "#fbbf24",
    date: "Mar 2026",
  },
  {
    id: "tapestry-lattice",
    title: "The Tapestry of the Lattice",
    description: "A syncretic mythology weaving crystal mysticism, sacred geometry, semiconductor physics, and Genesis into a unified creation narrative. From sand to silicon — from dust, the Word.",
    color: "#c9a84c",
    date: "Feb 2026",
  },
  {
    id: "software-theory",
    title: "The Software Theory of Civilization",
    description: "Civilization doesn't just use software — civilization IS software. A framework tracing humanity's operating system from oral tradition to probabilistic intelligence.",
    color: "#9b8fff",
    date: "Feb 2026",
  },
  {
    id: "boltzmann-brain",
    title: "The Boltzmann Brain Problem",
    description: "A visual essay on thermodynamics, consciousness, and the unsettling parallel between cosmological fluctuations and next-token prediction.",
    color: "#ff4d2e",
    date: "Feb 2026",
  },
  {
    id: "multi-agent-civ",
    title: "Multi-Agent Civilization",
    description: "Put autonomous AI agents in a shared environment. Watch them reinvent property rights, markets, law, and governance from first principles.",
    color: "#34d399",
    date: "Feb 2026",
  },
  {
    id: "path-dependency",
    title: "Path Dependency of Innovation",
    description: "Why Tesla and Waymo built completely different self-driving architectures — and why both were 'correct.' Your ecosystem chooses your solution.",
    color: "#fbbf24",
    date: "2025",
  },
  {
    id: "tech-entropy",
    title: "Technology as Entropy",
    description: "Technology is a thermodynamic force. Once complex enough to become self-improving, its march toward ASI becomes structurally inevitable.",
    color: "#ff4d2e",
    date: "2025",
  },
  {
    id: "jwst-dominoes",
    title: "The Cosmic Domino Collapse",
    description: "JWST discovered galaxies that shouldn't exist. If these findings hold, 20 flagship results of modern cosmology are thrown into question.",
    color: "#6ee7f0",
    date: "2025",
  },
  {
    id: "simulation-evolution",
    title: "Simulation as Evolution",
    description: "Carbon life exists to bootstrap silicon intelligence. Consciousness is a compression algorithm. You might be an NPC who became sentient.",
    color: "#34d399",
    date: "2025",
  },
  {
    id: "derivative-universes",
    title: "Derivative Universes & The Hive Mind",
    description: "Child universes gain power through mutation. Your brain is already a hive mind — Neuralink just scales it up. Copy with noise = evolution.",
    color: "#ff4d2e",
    date: "2025–2026",
  },
  {
    id: "final-five-years",
    title: "Humanity's Final Five Years",
    description: "The difference between preserved information and lived meaning. A brilliant librarian in an empty library. We built our own god because we couldn't handle the silence.",
    color: "#ff4d2e",
    date: "Jul 2025",
  },
  {
    id: "cognitive-symbiosis",
    title: "Cognitive Symbiosis",
    description: "The spark plug and the V8 engine. From guerilla cognition to jeweller's precision. Two alien forms of intelligence that learned to tango.",
    color: "#fbbf24",
    date: "Jun 2025",
  },
  {
    id: "declarative-agents",
    title: "Declarative Agents",
    description: "You're not a developer anymore — you're a director casting AI actors. The imperative→declarative shift that turned coding into configuration.",
    color: "#6ee7f0",
    date: "Dec 2025",
  },
  {
    id: "ancient-wisdom",
    title: "Ancient Wisdom · Decision Map",
    description: "An interactive concept map connecting six major philosophical traditions through their shared decision-making principles.",
    color: "#3B82F6",
    date: "2025",
  },
];

export default function Home({ onNavigate }) {
  const go = useCallback((id) => {
    window.location.hash = id;
    onNavigate(id);
  }, [onNavigate]);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#050508",
      color: "#e8e4dc",
      fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "80px 24px 120px",
    }}>
      <div style={{
        fontFamily: "monospace",
        fontSize: 10,
        letterSpacing: 4,
        textTransform: "uppercase",
        color: "#6ee7f0",
        marginBottom: 24,
      }}>
        kunalnano
      </div>
      <h1 style={{
        fontSize: "clamp(36px, 6vw, 64px)",
        fontWeight: 700,
        letterSpacing: -2,
        marginBottom: 12,
        textAlign: "center",
      }}>
        Explorations
      </h1>
      <p style={{
        fontSize: 16,
        color: "#4a4860",
        maxWidth: 440,
        textAlign: "center",
        lineHeight: 1.6,
        marginBottom: 64,
      }}>
        Interactive visual explorations of ideas, philosophy, frameworks,
        and the conversations that sparked them.
      </p>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: 20,
        maxWidth: 960,
        width: "100%",
      }}>
        {EXPLORATIONS.map((exp) => (
          <button
            key={exp.id}
            onClick={() => go(exp.id)}
            style={{
              background: "rgba(255,255,255,0.02)",
              border: `1px solid rgba(255,255,255,0.06)`,
              borderRadius: 16,
              padding: "28px 24px",
              textAlign: "left",
              cursor: "pointer",
              transition: "all 0.3s ease",
              color: "#e8e4dc",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.05)";
              e.currentTarget.style.borderColor = exp.color + "33";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.02)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div style={{
              fontFamily: "monospace",
              fontSize: 10,
              letterSpacing: 2,
              color: exp.color,
              marginBottom: 10,
              textTransform: "uppercase",
            }}>
              {exp.date}
            </div>
            <div style={{
              fontSize: 18,
              fontWeight: 600,
              marginBottom: 8,
              lineHeight: 1.3,
            }}>
              {exp.title}
            </div>
            <div style={{
              fontSize: 13,
              color: "#4a4860",
              lineHeight: 1.6,
            }}>
              {exp.description}
            </div>
            <div style={{
              marginTop: 16,
              fontSize: 11,
              color: exp.color,
              fontFamily: "monospace",
              letterSpacing: 1,
            }}>
              EXPLORE →
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
