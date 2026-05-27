import { useState, useEffect, useCallback } from "react";
import { C, F, T } from "../design.js";
import imgTheTell from "../assets/explorations/the-tell.jpg";
import imgSoftwareFactory from "../assets/explorations/software-factory.jpg";
import imgFinalFiveYears from "../assets/explorations/final-five-years.jpg";

// Per-essay hero image. Cards fall back to the CSS gradient (exp.visual)
// for any essay not yet in this map.
const IMAGES = {
  "the-tell": imgTheTell,
  "software-factory": imgSoftwareFactory,
  "final-five-years": imgFinalFiveYears,
};

const EXPLORATIONS = [
  {
    id: "the-tell",
    title: "The Tell.",
    eyebrow: "Memory",
    description:
      "A Saturday morning on memory, cognition, and the archaeological mound. Each conversation builds on the flattened last one. The tell is taller.",
    color: "#cd7f3a",
    visual:
      "radial-gradient(circle at 30% 40%, rgba(201,168,76,0.55), transparent 60%), linear-gradient(135deg, #1a1a1a, #2a2a2a)",
    date: "Apr 2026",
  },
  {
    id: "github-constellation",
    title: "GitHub Constellation.",
    eyebrow: "Live data",
    description:
      "A living force-directed graph of public repositories, colored by language, connected by shared technologies. Fetched live from the GitHub API.",
    color: "#3178c6",
    visual:
      "radial-gradient(circle at 70% 40%, rgba(49,120,198,0.45), transparent 55%), linear-gradient(135deg, #0a1230, #1a2244)",
    date: "Mar 2026",
  },
  {
    id: "software-factory",
    title: "The Software Factory.",
    eyebrow: "Platform",
    description:
      "Walk through a software delivery pipeline rendered as a physical factory. Inspect crates of compromised dependencies, toxic barrels of CI/CD vulnerabilities, and machines that assemble your code.",
    color: "#4aaa99",
    visual:
      "radial-gradient(circle at 60% 60%, rgba(74,170,153,0.4), transparent 55%), linear-gradient(135deg, #0d2422, #142e2b)",
    date: "Mar 2026",
  },
  {
    id: "als-limit",
    title: "Al’s Limit.",
    eyebrow: "Complexity",
    description:
      "A Kardashev scale for software complexity. Software grows through discrete cognitive regimes. AI doesn’t eliminate the transitions — it enables them.",
    color: "#9b8fff",
    visual:
      "radial-gradient(circle at 50% 50%, rgba(155,143,255,0.42), transparent 55%), linear-gradient(135deg, #14122a, #1a1736)",
    date: "Mar 2026",
  },
  {
    id: "entropy-filter",
    title: "The Entropy Filter.",
    eyebrow: "Fermi",
    description:
      "A thermodynamic answer to Fermi. The corridor between ‘smart enough to try’ and ‘coordinated enough to succeed’ narrows as complexity increases.",
    color: "#ff4d2e",
    visual:
      "radial-gradient(circle at 45% 55%, rgba(255,77,46,0.4), transparent 55%), linear-gradient(135deg, #2a1414, #1a0e0e)",
    date: "Mar 2026",
  },
  {
    id: "emergent-life-lab",
    title: "Emergent Life Lab.",
    eyebrow: "Cellular",
    description:
      "Conway’s Game of Life on acid. Eight cellular automata rulesets, six visual modes, real-time sonification, and a mutation engine.",
    color: "#00ffd5",
    visual:
      "radial-gradient(circle at 35% 45%, rgba(0,255,213,0.35), transparent 55%), linear-gradient(135deg, #0a2424, #112e2e)",
    date: "Mar 2026",
  },
  {
    id: "intelligence-currency",
    title: "Intelligence as currency.",
    eyebrow: "Intelligence",
    description:
      "The compounding spiral. Seven theses on why intelligence compounds, credentialism collapses, and compute is the new gold.",
    color: "#fbbf24",
    visual:
      "radial-gradient(circle at 50% 30%, rgba(251,191,36,0.4), transparent 60%), linear-gradient(160deg, #2b2a14, #1a1810)",
    date: "Mar 2026",
  },
  {
    id: "tapestry-lattice",
    title: "The tapestry of the lattice.",
    eyebrow: "Mythology",
    description:
      "A syncretic mythology weaving crystal mysticism, sacred geometry, semiconductor physics, and Genesis into a unified creation narrative.",
    color: "#c9a84c",
    visual:
      "radial-gradient(circle at 55% 50%, rgba(201,168,76,0.4), transparent 55%), linear-gradient(135deg, #1d1a10, #2a2418)",
    date: "Feb 2026",
  },
  {
    id: "software-theory",
    title: "The software theory of civilization.",
    eyebrow: "Civilization",
    description:
      "Civilization doesn’t just use software — civilization IS software. From oral tradition to probabilistic intelligence.",
    color: "#9b8fff",
    visual:
      "radial-gradient(circle at 60% 40%, rgba(155,143,255,0.4), transparent 55%), linear-gradient(135deg, #14122a, #1a1736)",
    date: "Feb 2026",
  },
  {
    id: "boltzmann-brain",
    title: "The Boltzmann brain problem.",
    eyebrow: "Cosmology",
    description:
      "A visual essay on thermodynamics, consciousness, and the unsettling parallel between cosmological fluctuations and next-token prediction.",
    color: "#ff4d2e",
    visual:
      "radial-gradient(circle at 40% 50%, rgba(255,77,46,0.42), transparent 55%), linear-gradient(135deg, #2a1414, #1a0e0e)",
    date: "Feb 2026",
  },
  {
    id: "multi-agent-civ",
    title: "Multi-agent civilization.",
    eyebrow: "Agents",
    description:
      "Put autonomous AI agents in a shared environment. Watch them reinvent property rights, markets, law, and governance from first principles.",
    color: "#34d399",
    visual:
      "radial-gradient(circle at 50% 60%, rgba(52,211,153,0.4), transparent 55%), linear-gradient(135deg, #0e2418, #142e22)",
    date: "Feb 2026",
  },
  {
    id: "path-dependency",
    title: "Path dependency of innovation.",
    eyebrow: "Strategy",
    description:
      "Why Tesla and Waymo built completely different self-driving architectures — and why both were ‘correct.’ Your ecosystem chooses your solution.",
    color: "#fbbf24",
    visual:
      "radial-gradient(circle at 55% 45%, rgba(251,191,36,0.36), transparent 55%), linear-gradient(135deg, #2b2a14, #1a1810)",
    date: "2025",
  },
  {
    id: "tech-entropy",
    title: "Technology as entropy.",
    eyebrow: "Entropy",
    description:
      "Technology is a thermodynamic force. Once complex enough to become self-improving, its march toward ASI becomes structurally inevitable.",
    color: "#ff4d2e",
    visual:
      "radial-gradient(circle at 45% 55%, rgba(255,77,46,0.4), transparent 55%), linear-gradient(135deg, #2a1414, #1a0e0e)",
    date: "2025",
  },
  {
    id: "jwst-dominoes",
    title: "The cosmic domino collapse.",
    eyebrow: "Cosmology",
    description:
      "JWST discovered galaxies that shouldn’t exist. If these findings hold, 20 flagship results of modern cosmology are thrown into question.",
    color: "#6ee7f0",
    visual:
      "radial-gradient(circle at 50% 40%, rgba(110,231,240,0.38), transparent 55%), linear-gradient(135deg, #102428, #1a2a30)",
    date: "2025",
  },
  {
    id: "simulation-evolution",
    title: "Simulation as evolution.",
    eyebrow: "Substrate",
    description:
      "Carbon life exists to bootstrap silicon intelligence. Consciousness is a compression algorithm. You might be an NPC who became sentient.",
    color: "#34d399",
    visual:
      "radial-gradient(circle at 60% 45%, rgba(52,211,153,0.4), transparent 55%), linear-gradient(135deg, #0e2418, #142e22)",
    date: "2025",
  },
  {
    id: "derivative-universes",
    title: "Derivative universes.",
    eyebrow: "Hive mind",
    description:
      "Child universes gain power through mutation. Your brain is already a hive mind — Neuralink just scales it up. Copy with noise equals evolution.",
    color: "#ff4d2e",
    visual:
      "radial-gradient(circle at 40% 55%, rgba(255,77,46,0.4), transparent 55%), linear-gradient(135deg, #2a1414, #1a0e0e)",
    date: "2025 — 2026",
  },
  {
    id: "final-five-years",
    title: "Humanity’s final five years.",
    eyebrow: "Meaning",
    description:
      "The difference between preserved information and lived meaning. A brilliant librarian in an empty library.",
    color: "#ff4d2e",
    visual:
      "radial-gradient(circle at 50% 50%, rgba(255,77,46,0.38), transparent 55%), linear-gradient(135deg, #2a1414, #1a0e0e)",
    date: "Jul 2025",
  },
  {
    id: "cognitive-symbiosis",
    title: "Cognitive symbiosis.",
    eyebrow: "Collaboration",
    description:
      "The spark plug and the V8 engine. From guerilla cognition to jeweller’s precision. Two alien forms of intelligence that learned to tango.",
    color: "#fbbf24",
    visual:
      "radial-gradient(circle at 45% 45%, rgba(251,191,36,0.4), transparent 55%), linear-gradient(135deg, #2b2a14, #1a1810)",
    date: "Jun 2025",
  },
  {
    id: "declarative-agents",
    title: "Declarative agents.",
    eyebrow: "Direction",
    description:
      "You’re not a developer anymore — you’re a director casting AI actors. The imperative-to-declarative shift that turned coding into configuration.",
    color: "#6ee7f0",
    visual:
      "radial-gradient(circle at 55% 50%, rgba(110,231,240,0.4), transparent 55%), linear-gradient(135deg, #102428, #1a2a30)",
    date: "Dec 2025",
  },
  {
    id: "ancient-wisdom",
    title: "Ancient wisdom.",
    eyebrow: "Decision map",
    description:
      "An interactive concept map connecting six major philosophical traditions through their shared decision-making principles.",
    color: "#3B82F6",
    visual:
      "radial-gradient(circle at 50% 45%, rgba(59,130,246,0.4), transparent 55%), linear-gradient(135deg, #10183a, #182148)",
    date: "2025",
  },
];

function Card({ exp, onClick }) {
  const [hovered, setHovered] = useState(false);
  const image = IMAGES[exp.id];
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: C.bg,
        border: "none",
        borderRadius: 22,
        overflow: "hidden",
        padding: 0,
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        minHeight: 360,
        textAlign: "left",
        fontFamily: F.text,
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 14px 40px rgba(0,0,0,0.08)"
          : "0 1px 0 rgba(0,0,0,0.04)",
        transition: "transform .35s cubic-bezier(0.16,1,0.3,1), box-shadow .35s ease",
      }}
    >
      <div style={{ height: 180, overflow: "hidden", position: "relative" }}>
        {image ? (
          <img
            src={image}
            alt=""
            loading="lazy"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              transform: hovered ? "scale(1.04)" : "scale(1)",
              transition: "transform .6s cubic-bezier(0.16,1,0.3,1)",
            }}
          />
        ) : (
          <div style={{ width: "100%", height: "100%", background: exp.visual }} />
        )}
      </div>
      <div style={{ padding: "26px 26px 28px", display: "flex", flexDirection: "column", flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
          <p style={{ ...T.eyebrow, margin: 0 }}>{exp.eyebrow}</p>
          <span
            style={{
              fontFamily: F.text,
              fontSize: 12,
              color: C.inkMute,
              letterSpacing: "-0.008em",
            }}
          >
            {exp.date}
          </span>
        </div>
        <h3
          style={{
            fontFamily: F.display,
            fontWeight: 600,
            fontSize: 24,
            lineHeight: 1.15,
            letterSpacing: "-0.025em",
            color: C.ink,
            margin: "0 0 10px",
          }}
        >
          {exp.title}
        </h3>
        <p
          style={{
            margin: 0,
            color: C.inkSoft,
            fontSize: 15,
            fontFamily: F.text,
            letterSpacing: "-0.008em",
            lineHeight: 1.5,
            flex: 1,
          }}
        >
          {exp.description}
        </p>
        <span
          style={{
            marginTop: 18,
            fontFamily: F.text,
            fontSize: 14,
            color: C.link,
            letterSpacing: "-0.008em",
            transform: hovered ? "translateX(3px)" : "translateX(0)",
            transition: "transform .3s ease",
          }}
        >
          Explore ›
        </span>
      </div>
    </button>
  );
}

export default function Explorations({ onNavigate }) {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 80);
    return () => clearTimeout(t);
  }, []);

  const go = useCallback(
    (id) => {
      window.location.hash = id;
      onNavigate(id);
      window.scrollTo(0, 0);
    },
    [onNavigate]
  );

  return (
    <div
      style={{
        background: C.bg,
        color: C.ink,
        fontFamily: F.text,
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
      }}
    >
      {/* Hero */}
      <section
        style={{
          padding: "96px 22px 64px",
          maxWidth: 980,
          margin: "0 auto",
          textAlign: "center",
          opacity: entered ? 1 : 0,
          transform: entered ? "translateY(0)" : "translateY(16px)",
          transition: "all 0.9s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <p style={{ ...T.eyebrow, marginBottom: 20 }}>
          {EXPLORATIONS.length} visual essays
        </p>
        <h1
          style={{
            fontFamily: F.display,
            fontWeight: 600,
            fontSize: "clamp(48px, 8vw, 96px)",
            lineHeight: 1.02,
            letterSpacing: "-0.045em",
            color: C.ink,
            margin: "0 0 14px",
          }}
        >
          Explorations.
        </h1>
        <p
          style={{
            fontFamily: F.display,
            fontWeight: 400,
            fontSize: "clamp(20px, 2.4vw, 28px)",
            lineHeight: 1.3,
            letterSpacing: "-0.022em",
            color: C.inkSoft,
            maxWidth: 720,
            margin: "0 auto",
          }}
        >
          Interactive essays on agents, platform engineering, cosmology, and
          the operator&apos;s craft.
        </p>
      </section>

      {/* Grid */}
      <section style={{ background: C.bgSoft, padding: "48px 22px 112px" }}>
        <div
          style={{
            maxWidth: 1080,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 20,
          }}
        >
          {EXPLORATIONS.map((exp) => (
            <Card key={exp.id} exp={exp} onClick={() => go(exp.id)} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          background: C.bgSoft,
          borderTop: `1px solid ${C.rule}`,
          padding: "28px 22px",
          fontFamily: F.text,
          fontSize: 12,
          color: C.inkMute,
          textAlign: "center",
        }}
      >
        2025 — 2026 · alsharma.com
      </footer>
    </div>
  );
}
