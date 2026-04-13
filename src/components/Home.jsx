import { useState, useEffect, useRef, useCallback } from "react";

// ── Design tokens ──────────────────────────────────────────
const C = {
  bg: "#08080f",
  surface: "#0f0f1a",
  surfaceHover: "#151525",
  border: "#1a1a2e",
  borderHover: "#2a2a50",
  cyan: "#00d4ff",
  purple: "#8b5cf6",
  green: "#22c55e",
  amber: "#fbbf24",
  gold: "#c9a84c",
  goldLight: "#e8d48b",
  goldDark: "#8b7a3a",
  red: "#ef4444",
  text: "#e4e4e7",
  textDim: "#a1a1aa",
  faint: "#52525b",
  deep: "#27272a",
};
const MONO =
  "'SF Mono', 'Cascadia Code', 'JetBrains Mono', 'Consolas', monospace";
const SANS = "system-ui, -apple-system, 'Segoe UI', sans-serif";

// ── Data ───────────────────────────────────────────────────
const SYSTEMS = [
  {
    name: "Dark Vector Cognition",
    desc: "AI research & computation lab",
    url: "https://darkvectorcognition.ai",
    status: "live",
    accent: C.cyan,
  },
  {
    name: "Enablement Hub",
    desc: "Workshops & technical materials",
    url: "https://enablement.alsharma.com",
    status: "live",
    accent: C.purple,
  },
  {
    name: "Explorations",
    desc: "20 interactive visual essays",
    route: "explorations",
    status: "active",
    accent: C.amber,
  },
  {
    name: "MCP Knowledge Systems",
    desc: "Agentic AI for enterprise workflows",
    status: "deployed",
    accent: C.green,
  },
];

const SELECTED_WORKS = [
  {
    id: "the-tell",
    title: "The Tell",
    desc: "Memory, cognition, and the archaeological mound",
  },
  {
    id: "software-factory",
    title: "The Software Factory",
    desc: "Supply chain security as a 2D platformer",
  },
  {
    id: "als-limit",
    title: "Al\u2019s Limit",
    desc: "A Kardashev Scale for software complexity",
  },
  {
    id: "intelligence-currency",
    title: "Intelligence as Currency",
    desc: "Seven theses on compounding intelligence",
  },
  {
    id: "emergent-life-lab",
    title: "Emergent Life Lab",
    desc: "Cellular automata, 8 rulesets, real-time sound",
  },
  {
    id: "entropy-filter",
    title: "The Entropy Filter",
    desc: "A thermodynamic answer to Fermi",
  },
];

const CAREER = [
  {
    co: "Port.io",
    role: "Head of Technical Success, AMER",
    yr: "2025 \u2013 Present",
    live: true,
  },
  {
    co: "Snyk",
    role: "Sr. Manager, Customer Solutions",
    yr: "2022 \u2013 2024",
  },
  {
    co: "Harness",
    role: "Sr. TPM / Manager, CS",
    yr: "2021 \u2013 2025",
  },
  { co: "HashiCorp", role: "User Success Manager", yr: "2021" },
  {
    co: "Western Digital",
    role: "Staff Manager, Enterprise",
    yr: "2013 \u2013 2021",
  },
];

// ── Background ─────────────────────────────────────────────
function Background() {
  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(0,212,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,212,255,0.025) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "fixed",
          top: "15%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "70%",
          height: "45%",
          background:
            "radial-gradient(ellipse at center, rgba(139,92,246,0.05), rgba(0,212,255,0.02) 50%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
    </>
  );
}

// ── Section wrapper ────────────────────────────────────────
function Section({ title, tag, tagColor, visible, delay = 0, children }) {
  return (
    <div
      style={{
        marginBottom: 40,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: `all 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 16,
        }}
      >
        <span
          style={{
            fontFamily: MONO,
            fontSize: 10,
            letterSpacing: 3,
            color: C.textDim,
          }}
        >
          {title}
        </span>
        <span
          style={{
            fontFamily: MONO,
            fontSize: 9,
            letterSpacing: 1,
            color: tagColor,
            border: `1px solid ${tagColor}33`,
            borderRadius: 3,
            padding: "2px 6px",
          }}
        >
          {tag}
        </span>
        <div style={{ flex: 1, height: 1, background: C.border }} />
      </div>
      {children}
    </div>
  );
}

// ── System card ────────────────────────────────────────────
function SystemCard({ system, hovered, onHover, onClick }) {
  const clickable = !!(system.url || system.route);
  const statusColor =
    system.status === "live"
      ? C.green
      : system.status === "deployed"
        ? C.cyan
        : C.faint;

  return (
    <button
      onClick={clickable ? onClick : undefined}
      onMouseEnter={() => onHover(system.name)}
      onMouseLeave={() => onHover(null)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        width: "100%",
        background: hovered ? C.surfaceHover : C.surface,
        border: `1px solid ${hovered ? system.accent + "44" : C.border}`,
        borderRadius: 8,
        padding: "14px 16px",
        cursor: clickable ? "pointer" : "default",
        textAlign: "left",
        transition: "all 0.25s ease",
        transform: hovered && clickable ? "translateY(-1px)" : "none",
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: statusColor,
          boxShadow: `0 0 8px ${statusColor}66`,
          flexShrink: 0,
        }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: MONO,
            fontSize: 13,
            fontWeight: 600,
            color: hovered ? system.accent : C.text,
            transition: "color 0.2s",
            marginBottom: 2,
          }}
        >
          {system.name}
        </div>
        <div style={{ fontSize: 12, color: C.faint }}>{system.desc}</div>
      </div>
      {clickable && (
        <span
          style={{
            fontFamily: MONO,
            fontSize: 10,
            color: hovered ? system.accent : C.deep,
            transition: "color 0.2s",
            flexShrink: 0,
          }}
        >
          {system.url ? "\u2197" : "\u2192"}
        </span>
      )}
    </button>
  );
}

// ── Work row ───────────────────────────────────────────────
function WorkRow({ work, hovered, onHover, onClick }) {
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => onHover(work.id)}
      onMouseLeave={() => onHover(null)}
      style={{
        display: "block",
        width: "100%",
        background: hovered ? C.surface : "transparent",
        border: "none",
        borderLeft: `2px solid ${hovered ? C.cyan : "transparent"}`,
        padding: "10px 12px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        textAlign: "left",
      }}
    >
      <div
        style={{
          fontFamily: MONO,
          fontSize: 13,
          color: hovered ? C.cyan : C.text,
          transition: "color 0.2s",
          marginBottom: 3,
        }}
      >
        {work.title}
      </div>
      <div style={{ fontSize: 12, color: C.faint, fontStyle: "italic" }}>
        {work.desc}
      </div>
    </button>
  );
}

// ── Career row ─────────────────────────────────────────────
function CareerRow({ entry }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: 12,
        padding: "9px 0",
        borderBottom: `1px solid ${C.border}`,
        flexWrap: "wrap",
      }}
    >
      <span
        style={{
          fontFamily: MONO,
          fontSize: 12,
          color: entry.live ? C.green : C.textDim,
          fontWeight: entry.live ? 600 : 400,
          minWidth: 120,
          flexShrink: 0,
        }}
      >
        {entry.co}
        {entry.live && (
          <span
            style={{
              display: "inline-block",
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: C.green,
              marginLeft: 6,
              verticalAlign: "middle",
              boxShadow: `0 0 6px ${C.green}`,
            }}
          />
        )}
      </span>
      <span style={{ fontSize: 12, color: C.faint, flex: 1, minWidth: 140 }}>
        {entry.role}
      </span>
      <span
        style={{
          fontFamily: MONO,
          fontSize: 10,
          color: C.deep,
          whiteSpace: "nowrap",
        }}
      >
        {entry.yr}
        {entry.note && (
          <span style={{ color: C.amber, marginLeft: 8 }}>{entry.note}</span>
        )}
      </span>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────
export default function Home({ onNavigate }) {
  const [phase, setPhase] = useState(0);
  const [hovered, setHovered] = useState(null);
  const [typedName, setTypedName] = useState("");

  // Typewriter effect for name
  useEffect(() => {
    const name = "AL SHARMA";
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setTypedName(name.slice(0, i));
      if (i >= name.length) {
        clearInterval(interval);
        setTimeout(() => setPhase(1), 200);
        setTimeout(() => setPhase(2), 700);
      }
    }, 55);
    return () => clearInterval(interval);
  }, []);

  const go = useCallback(
    (id) => {
      window.location.hash = id;
      onNavigate(id);
    },
    [onNavigate],
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        color: C.text,
        fontFamily: SANS,
        position: "relative",
      }}
    >
      <Background />

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 900,
          margin: "0 auto",
          padding: "72px 24px 60px",
        }}
      >
        {/* System identifier */}
        <div
          style={{
            fontFamily: MONO,
            fontSize: 11,
            letterSpacing: 2,
            color: C.faint,
            marginBottom: 28,
            opacity: phase >= 0 ? 1 : 0,
            transition: "opacity 0.6s ease",
          }}
        >
          ai_sharma.sys{" "}
          <span style={{ color: C.green }}>&#9679;</span>{" "}
          <span style={{ color: C.deep }}>operational</span>
        </div>

        {/* Vector Mark */}
        <svg viewBox="0 0 72 72" width="36" height="36" style={{ marginBottom: 16, opacity: phase >= 1 ? 1 : 0, transition: "opacity 0.6s ease", filter: "drop-shadow(0 0 10px rgba(201,168,76,0.3))" }}>
          <path d="M36,8 L46,18 L36,28 L26,18 Z" fill="#8B6914" stroke="#C9A84C" strokeWidth="1"/>
          <path d="M14,18 L24,18 L36,50 L36,62 Z" fill="#A6841E"/>
          <path d="M58,18 L48,18 L36,50 L36,62 Z" fill="#C9A84C"/>
          <path d="M24,18 L36,50 L30,34 Z" fill="#DFC060" opacity="0.6"/>
          <path d="M48,18 L36,50 L42,34 Z" fill="#DFC060" opacity="0.4"/>
        </svg>

        {/* Name */}
        <h1
          style={{
            fontFamily: MONO,
            fontSize: "clamp(44px, 10vw, 80px)",
            fontWeight: 700,
            letterSpacing: -2,
            lineHeight: 1,
            marginBottom: 20,
          }}
        >
          <span
            style={{
              background: `linear-gradient(135deg, ${C.goldLight}, ${C.gold}, ${C.goldDark})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {typedName}
          </span>
          <span
            style={{
              display: phase >= 2 ? "none" : "inline-block",
              width: 3,
              height: "0.75em",
              background: C.gold,
              marginLeft: 4,
              animation: "blink 0.8s step-end infinite",
              verticalAlign: "baseline",
            }}
          />
        </h1>

        {/* Tagline */}
        <p
          style={{
            fontSize: 20,
            color: C.textDim,
            marginBottom: 10,
            opacity: phase >= 1 ? 1 : 0,
            transform: phase >= 1 ? "translateY(0)" : "translateY(8px)",
            transition: "all 0.6s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          I build things that think.
        </p>

        {/* Identity */}
        <div
          style={{
            fontFamily: MONO,
            fontSize: 12,
            letterSpacing: 1,
            color: C.faint,
            marginBottom: 56,
            opacity: phase >= 1 ? 1 : 0,
            transform: phase >= 1 ? "translateY(0)" : "translateY(8px)",
            transition: "all 0.6s cubic-bezier(0.16,1,0.3,1) 0.1s",
          }}
        >
          Founder, Dark Vector Cognition &middot; Austin, TX
        </div>

        {/* ── Two-column grid: Systems + Signal ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 32,
            marginBottom: 8,
          }}
        >
          {/* SYSTEMS */}
          <Section
            title="SYSTEMS"
            tag="LIVE"
            tagColor={C.green}
            visible={phase >= 2}
            delay={0}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {SYSTEMS.map((sys) => (
                <SystemCard
                  key={sys.name}
                  system={sys}
                  hovered={hovered === sys.name}
                  onHover={setHovered}
                  onClick={() => {
                    if (sys.url)
                      window.open(sys.url, "_blank", "noopener,noreferrer");
                    else if (sys.route) go(sys.route);
                  }}
                />
              ))}
            </div>
          </Section>

          {/* SIGNAL */}
          <Section
            title="SIGNAL"
            tag="SELECTED"
            tagColor={C.amber}
            visible={phase >= 2}
            delay={0.08}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 0,
              }}
            >
              {SELECTED_WORKS.map((work) => (
                <WorkRow
                  key={work.id}
                  work={work}
                  hovered={hovered === work.id}
                  onHover={setHovered}
                  onClick={() => go(work.id)}
                />
              ))}
              <button
                onClick={() => go("explorations")}
                onMouseEnter={(e) => (e.target.style.color = C.cyan)}
                onMouseLeave={(e) => (e.target.style.color = C.faint)}
                style={{
                  background: "none",
                  border: "none",
                  color: C.faint,
                  fontFamily: MONO,
                  fontSize: 11,
                  letterSpacing: 1,
                  cursor: "pointer",
                  textAlign: "left",
                  padding: "10px 12px",
                  transition: "color 0.2s",
                }}
              >
                ALL 20 EXPLORATIONS {"\u2192"}
              </button>
            </div>
          </Section>
        </div>

        {/* ── PRODUCTION LOG ── */}
        <Section
          title="PRODUCTION LOG"
          tag="CAREER"
          tagColor={C.purple}
          visible={phase >= 2}
          delay={0.16}
        >
          {CAREER.map((c) => (
            <CareerRow key={c.co} entry={c} />
          ))}
          <button
            onClick={() => go("resume")}
            onMouseEnter={(e) => (e.target.style.color = C.cyan)}
            onMouseLeave={(e) => (e.target.style.color = C.faint)}
            style={{
              background: "none",
              border: "none",
              color: C.faint,
              fontFamily: MONO,
              fontSize: 11,
              letterSpacing: 1,
              cursor: "pointer",
              textAlign: "left",
              padding: "10px 0",
              marginTop: 4,
              transition: "color 0.2s",
            }}
          >
            FULL RESUME {"\u2192"}
          </button>
        </Section>

        {/* ── Footer ── */}
        <footer
          style={{
            marginTop: 48,
            paddingTop: 24,
            borderTop: `1px solid ${C.border}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
            opacity: phase >= 2 ? 1 : 0,
            transition: "opacity 0.8s ease 0.4s",
          }}
        >
          <div style={{ display: "flex", gap: 20 }}>
            {[
              { label: "GitHub", url: "https://github.com/kunalnano" },
              { label: "DVC", url: "https://darkvectorcognition.ai" },
              {
                label: "LinkedIn",
                url: "https://www.linkedin.com/in/alsharma",
              },
            ].map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: MONO,
                  fontSize: 11,
                  letterSpacing: 1,
                  color: C.faint,
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.target.style.color = C.cyan)}
                onMouseLeave={(e) => (e.target.style.color = C.faint)}
              >
                {link.label}
              </a>
            ))}
          </div>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 10,
              color: C.deep,
              letterSpacing: 1,
            }}
          >
            ai_sharma // 2026
          </div>
        </footer>
      </div>
    </div>
  );
}
