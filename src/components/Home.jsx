import { useCallback } from "react";

const EXPLORATIONS = [
  {
    id: "ancient-wisdom",
    title: "Ancient Wisdom · Decision Map",
    description: "An interactive concept map connecting six major philosophical traditions through their shared decision-making principles.",
    color: "#3B82F6",
    date: "2025",
  },
  {
    id: "boltzmann-brain",
    title: "The Boltzmann Brain Problem",
    description: "A visual essay on thermodynamics, consciousness, and the unsettling parallel between cosmological fluctuations and next-token prediction.",
    color: "#ff4d2e",
    date: "Feb 2026",
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
        maxWidth: 400,
        textAlign: "center",
        lineHeight: 1.6,
        marginBottom: 64,
      }}>
        Interactive visual explorations of ideas, philosophy, and frameworks.
      </p>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: 20,
        maxWidth: 720,
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
              padding: "32px 28px",
              textAlign: "left",
              cursor: "pointer",
              transition: "all 0.3s ease",
              color: "#e8e4dc",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.05)";
              e.currentTarget.style.borderColor = exp.color + "33";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.02)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
            }}
          >
            <div style={{
              fontFamily: "monospace",
              fontSize: 10,
              letterSpacing: 2,
              color: exp.color,
              marginBottom: 12,
              textTransform: "uppercase",
            }}>
              {exp.date}
            </div>
            <div style={{
              fontSize: 20,
              fontWeight: 600,
              marginBottom: 10,
              lineHeight: 1.3,
            }}>
              {exp.title}
            </div>
            <div style={{
              fontSize: 14,
              color: "#4a4860",
              lineHeight: 1.6,
            }}>
              {exp.description}
            </div>
            <div style={{
              marginTop: 20,
              fontSize: 12,
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
