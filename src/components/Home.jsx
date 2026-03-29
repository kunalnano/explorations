import { useCallback, useState } from "react";

const GOLD = "#c9a84c";
const GOLD_LIGHT = "#e8d48b";
const GOLD_DIM = "#8b7a3a";
const BG = "#050508";
const BONE = "#e8e4dc";
const LINE_GOLD = "rgba(201,168,76,0.12)";

const NAV_ITEMS = [
  { id: "explorations", label: "Explorations", desc: "Interactive visual essays" },
  { id: "resume", label: "Resume", desc: "Career & experience" },
];

export default function Home({ onNavigate }) {
  const [hovered, setHovered] = useState(null);

  const go = useCallback(
    (id) => {
      window.location.hash = id;
      onNavigate(id);
    },
    [onNavigate]
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: BG,
        color: BONE,
        fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 24px",
        position: "relative",
      }}
    >
      {/* Subtle glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "60%",
          height: "60%",
          background: `radial-gradient(ellipse 50% 50% at 50% 50%, ${GOLD}06, transparent)`,
          pointerEvents: "none",
        }}
      />

      {/* Top rule */}
      <div
        style={{
          width: 48,
          height: 1,
          background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
          marginBottom: 24,
        }}
      />

      {/* Name */}
      <h1
        style={{
          fontSize: "clamp(40px, 7vw, 72px)",
          fontWeight: 700,
          letterSpacing: -2,
          marginBottom: 8,
          textAlign: "center",
          background: `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD}, ${GOLD_DIM})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Al Sharma
      </h1>

      {/* Tagline */}
      <p
        style={{
          fontSize: 15,
          color: GOLD_DIM,
          maxWidth: 520,
          textAlign: "center",
          lineHeight: 1.7,
          marginBottom: 12,
          fontFamily: "Georgia, 'Times New Roman', serif",
        }}
      >
        Builder of post-sales organizations, AI systems, and
        interactive explorations at the intersection of technology and philosophy.
      </p>

      <div
        style={{
          fontFamily: "'SF Mono', 'Cascadia Code', 'Consolas', monospace",
          fontSize: 10,
          letterSpacing: 3,
          color: GOLD_DIM,
          textTransform: "uppercase",
          marginBottom: 48,
        }}
      >
        Austin, TX
      </div>

      {/* Navigation */}
      <div
        style={{
          display: "flex",
          gap: 20,
          flexWrap: "wrap",
          justifyContent: "center",
          marginBottom: 64,
        }}
      >
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => go(item.id)}
            onMouseEnter={() => setHovered(item.id)}
            onMouseLeave={() => setHovered(null)}
            style={{
              background:
                hovered === item.id
                  ? "rgba(201,168,76,0.06)"
                  : "rgba(201,168,76,0.02)",
              border: `1px solid ${
                hovered === item.id ? GOLD + "44" : LINE_GOLD
              }`,
              borderRadius: 12,
              padding: "20px 32px",
              cursor: "pointer",
              transition: "all 0.3s ease",
              color: BONE,
              textAlign: "center",
              minWidth: 180,
              transform:
                hovered === item.id ? "translateY(-2px)" : "translateY(0)",
            }}
          >
            <div
              style={{
                fontSize: 16,
                fontWeight: 600,
                marginBottom: 4,
              }}
            >
              {item.label}
            </div>
            <div
              style={{
                fontSize: 11,
                color: GOLD_DIM,
                fontFamily:
                  "'SF Mono', 'Cascadia Code', 'Consolas', monospace",
                letterSpacing: 1,
              }}
            >
              {item.desc}
            </div>
          </button>
        ))}
      </div>

      {/* Footer */}
      <div style={{ marginTop: 80, textAlign: "center" }}>
        <div
          style={{
            width: 48,
            height: 1,
            background: `linear-gradient(90deg, transparent, ${GOLD}33, transparent)`,
            margin: "0 auto 16px",
          }}
        />
        <div
          style={{
            fontFamily:
              "'SF Mono', 'Cascadia Code', 'Consolas', monospace",
            fontSize: 9,
            letterSpacing: 4,
            color: GOLD_DIM,
            textTransform: "uppercase",
          }}
        >
          alsharma.com
        </div>
      </div>
    </div>
  );
}
