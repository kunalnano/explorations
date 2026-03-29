import { useState, useEffect, useRef, useCallback } from "react";

const GOLD = "#c9a84c";
const GOLD_LIGHT = "#e8d48b";
const GOLD_DIM = "#8b7a3a";
const BG = "#050508";
const BONE = "#e8e4dc";
const LINE_GOLD = "rgba(201,168,76,0.12)";
const MONO = "'SF Mono', 'Cascadia Code', 'Consolas', monospace";
const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "'Segoe UI', system-ui, -apple-system, sans-serif";

const NAV_ITEMS = [
  {
    id: "explorations",
    label: "Explorations",
    desc: "Interactive visual essays",
    count: "19 essays",
    accent: "#9b8fff",
  },
  {
    id: "github-constellation",
    label: "GitHub Universe",
    desc: "Live repository constellation",
    count: "live data",
    accent: "#3178c6",
  },
  {
    id: "resume",
    label: "Resume",
    desc: "Career & experience",
    count: "15+ years",
    accent: GOLD,
  },
  {
    id: "dvc",
    label: "Dark Vector Cognition",
    desc: "AI systems & computation",
    count: "darkvectorcognition.ai",
    accent: "#ff4d2e",
    external: "https://darkvectorcognition.ai",
  },
  {
    id: "enablement",
    label: "Enablement",
    desc: "Workshops & materials",
    count: "enablement.alsharma.com",
    accent: "#34d399",
    external: "https://enablement.alsharma.com",
  },
];

// Constellation background — slowly drifting nodes with gold connections
function Constellation() {
  const canvasRef = useRef(null);
  const nodesRef = useRef([]);
  const frameRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W, H;

    function resize() {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
    }
    resize();
    window.addEventListener("resize", resize);

    // Seed nodes
    const COUNT = Math.min(60, Math.floor((W * H) / 18000));
    nodesRef.current = Array.from({ length: COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      r: Math.random() * 1.5 + 0.5,
      brightness: Math.random(),
      phase: Math.random() * Math.PI * 2,
    }));

    function onMove(e) {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    }
    window.addEventListener("mousemove", onMove);

    let running = true;
    let t = 0;

    function tick() {
      if (!running) return;
      t += 0.003;
      ctx.clearRect(0, 0, W, H);

      const nodes = nodesRef.current;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Update positions
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0) n.x = W;
        if (n.x > W) n.x = 0;
        if (n.y < 0) n.y = H;
        if (n.y > H) n.y = 0;

        // Mouse repulsion
        const dx = n.x - mx;
        const dy = n.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) / 120 * 0.3;
          n.x += (dx / dist) * force;
          n.y += (dy / dist) * force;
        }
      }

      // Draw connections
      const maxDist = 140;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.08;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(201,168,76,${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (const n of nodes) {
        const pulse = Math.sin(t * 2 + n.phase) * 0.3 + 0.7;
        const alpha = 0.15 + n.brightness * 0.25 * pulse;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,168,76,${alpha})`;
        ctx.fill();

        // Glow for larger nodes
        if (n.r > 1.2) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r * 3, 0, Math.PI * 2);
          const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 3);
          g.addColorStop(0, `rgba(201,168,76,${alpha * 0.3})`);
          g.addColorStop(1, "transparent");
          ctx.fillStyle = g;
          ctx.fill();
        }
      }

      frameRef.current = requestAnimationFrame(tick);
    }
    frameRef.current = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}

export default function Home({ onNavigate }) {
  const [entered, setEntered] = useState(false);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setEntered(true), 100);
    return () => clearTimeout(timer);
  }, []);

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
        fontFamily: SANS,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Constellation />

      {/* Injected keyframes */}
      <style>{`
        @keyframes goldLinePulse {
          0%, 100% { opacity: 0.4; transform: scaleX(0.6); }
          50% { opacity: 1; transform: scaleX(1); }
        }
        @keyframes breatheGlow {
          0%, 100% { opacity: 0.03; }
          50% { opacity: 0.08; }
        }
      `}</style>

      {/* Central radial glow — breathing */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          height: "80%",
          background: `radial-gradient(ellipse 40% 40% at 50% 50%, ${GOLD}, transparent)`,
          pointerEvents: "none",
          animation: "breatheGlow 6s ease-in-out infinite",
          zIndex: 1,
        }}
      />

      {/* Content — above canvas */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Top rule — animated */}
        <div
          style={{
            width: 64,
            height: 1,
            background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
            marginBottom: 32,
            animation: "goldLinePulse 4s ease-in-out infinite",
            opacity: entered ? 1 : 0,
            transition: "opacity 1s ease 0.2s",
          }}
        />

        {/* Monospace label */}
        <div
          style={{
            fontFamily: MONO,
            fontSize: 10,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: GOLD_DIM,
            marginBottom: 24,
            opacity: entered ? 1 : 0,
            transform: entered ? "translateY(0)" : "translateY(12px)",
            transition: "all 0.8s cubic-bezier(0.16,1,0.3,1) 0.3s",
          }}
        >
          alsharma.com
        </div>

        {/* Name */}
        <h1
          style={{
            fontSize: "clamp(48px, 9vw, 88px)",
            fontWeight: 700,
            letterSpacing: -3,
            marginBottom: 16,
            textAlign: "center",
            background: `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD}, ${GOLD_DIM})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            opacity: entered ? 1 : 0,
            transform: entered ? "translateY(0)" : "translateY(20px)",
            transition: "all 1s cubic-bezier(0.16,1,0.3,1) 0.5s",
            lineHeight: 1,
          }}
        >
          Al Sharma
        </h1>

        {/* Identity line */}
        <p
          style={{
            fontFamily: SERIF,
            fontSize: "clamp(16px, 2.5vw, 20px)",
            color: GOLD_DIM,
            textAlign: "center",
            lineHeight: 1.5,
            marginBottom: 12,
            fontStyle: "italic",
            opacity: entered ? 1 : 0,
            transform: entered ? "translateY(0)" : "translateY(16px)",
            transition: "all 1s cubic-bezier(0.16,1,0.3,1) 0.8s",
          }}
        >
          I build things that think.
        </p>

        {/* Founder line */}
        <div
          style={{
            fontFamily: MONO,
            fontSize: 11,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: GOLD,
            marginBottom: 12,
            opacity: entered ? 1 : 0,
            transform: entered ? "translateY(0)" : "translateY(12px)",
            transition: "all 1s cubic-bezier(0.16,1,0.3,1) 0.95s",
          }}
        >
          Founder, Dark Vector Cognition
        </div>

        {/* Location */}
        <div
          style={{
            fontFamily: MONO,
            fontSize: 10,
            letterSpacing: 3,
            color: GOLD_DIM,
            textTransform: "uppercase",
            marginBottom: 64,
            opacity: entered ? 0.6 : 0,
            transition: "opacity 1s ease 1.1s",
          }}
        >
          Austin, TX
        </div>

        {/* Navigation cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 20,
            maxWidth: 760,
            width: "100%",
            marginBottom: 80,
            opacity: entered ? 1 : 0,
            transform: entered ? "translateY(0)" : "translateY(24px)",
            transition: "all 1s cubic-bezier(0.16,1,0.3,1) 1.2s",
          }}
        >
          {NAV_ITEMS.map((item) => {
            const isHov = hovered === item.id;
            return (
              <button
                key={item.id}
                onClick={() => item.external ? window.open(item.external, '_blank', 'noopener,noreferrer') : go(item.id)}
                onMouseEnter={() => setHovered(item.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  background: isHov
                    ? `rgba(201,168,76,0.06)`
                    : "rgba(201,168,76,0.015)",
                  border: `1px solid ${isHov ? item.accent + "55" : LINE_GOLD}`,
                  borderRadius: 16,
                  padding: "28px 36px",
                  cursor: "pointer",
                  transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
                  color: BONE,
                  textAlign: "left",
                  minWidth: 220,
                  position: "relative",
                  overflow: "hidden",
                  transform: isHov ? "translateY(-4px)" : "translateY(0)",
                  boxShadow: isHov
                    ? `0 8px 32px rgba(201,168,76,0.08)`
                    : "none",
                }}
              >
                {/* Top accent line */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 2,
                    background: `linear-gradient(90deg, transparent, ${item.accent}${isHov ? "88" : "22"}, transparent)`,
                    transition: "all 0.4s ease",
                  }}
                />

                <div
                  style={{
                    fontFamily: MONO,
                    fontSize: 9,
                    letterSpacing: 3,
                    color: item.accent,
                    textTransform: "uppercase",
                    marginBottom: 10,
                    opacity: isHov ? 1 : 0.6,
                    transition: "opacity 0.3s",
                  }}
                >
                  {item.count}
                </div>
                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 600,
                    marginBottom: 6,
                    letterSpacing: -0.5,
                  }}
                >
                  {item.label}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: GOLD_DIM,
                    fontFamily: SERIF,
                    fontStyle: "italic",
                  }}
                >
                  {item.desc}
                </div>

                {/* Arrow */}
                <div
                  style={{
                    marginTop: 16,
                    fontFamily: MONO,
                    fontSize: 11,
                    color: item.accent,
                    letterSpacing: 1,
                    opacity: isHov ? 1 : 0.4,
                    transform: isHov ? "translateX(4px)" : "translateX(0)",
                    transition: "all 0.3s ease",
                  }}
                >
                  ENTER →
                </div>
              </button>
            );
          })}
        </div>

        {/* Links row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            marginBottom: 80,
            opacity: entered ? 1 : 0,
            transform: entered ? "translateY(0)" : "translateY(16px)",
            transition: "all 1s cubic-bezier(0.16,1,0.3,1) 1.5s",
          }}
        >
          <a
            href="https://github.com/kunalnano"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: MONO,
              fontSize: 11,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: GOLD_DIM,
              textDecoration: "none",
              transition: "color 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.color = GOLD)}
            onMouseLeave={(e) => (e.target.style.color = GOLD_DIM)}
          >
            github
          </a>
          <span
            style={{
              color: GOLD_DIM,
              fontSize: 6,
              opacity: 0.5,
            }}
          >
            {"●"}
          </span>
          <a
            href="https://darkvectorcognition.ai"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: MONO,
              fontSize: 11,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: GOLD_DIM,
              textDecoration: "none",
              transition: "color 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.color = GOLD)}
            onMouseLeave={(e) => (e.target.style.color = GOLD_DIM)}
          >
            dvc
          </a>
          <span
            style={{
              color: GOLD_DIM,
              fontSize: 6,
              opacity: 0.5,
            }}
          >
            {"●"}
          </span>
          <a
            href="https://www.linkedin.com/in/alsharma"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: MONO,
              fontSize: 11,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: GOLD_DIM,
              textDecoration: "none",
              transition: "color 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.color = GOLD)}
            onMouseLeave={(e) => (e.target.style.color = GOLD_DIM)}
          >
            linkedin
          </a>
        </div>

        {/* Footer */}
        <div
          style={{
            textAlign: "center",
            opacity: entered ? 1 : 0,
            transition: "opacity 1.5s ease 1.8s",
          }}
        >
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
              fontFamily: MONO,
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
    </div>
  );
}
