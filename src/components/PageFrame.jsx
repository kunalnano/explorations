import { useEffect } from "react";
import { C, F } from "../design.js";

// ── PageFrame ──────────────────────────────────────────────
// Floats a consistent Apple-style nav over every page so the chrome is
// identical site-wide. PageFrame also owns the body background — that
// prevents white-leak underneath short dark essays where the page
// content doesn't fill the viewport.
//
// Usage:
//   <PageFrame surface="dark" onBack={goExplorations}>
//     <YourEssayContent />
//   </PageFrame>

const DARK_BODY_BG = "#0a0807"; // near-black; individual essays paint over it

export default function PageFrame({
  children,
  onBack,
  backLabel = "Explorations",
  surface = "light", // "light" | "dark"
}) {
  const isDark = surface === "dark";
  const ink = isDark ? "#f5f5f7" : C.ink;
  const rule = isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.06)";
  const navBg = isDark ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.72)";

  useEffect(() => {
    const prevBody = document.body.style.background;
    const prevHtml = document.documentElement.style.background;
    const target = isDark ? DARK_BODY_BG : C.bg;
    document.body.style.background = target;
    document.documentElement.style.background = target;
    return () => {
      document.body.style.background = prevBody;
      document.documentElement.style.background = prevHtml;
    };
  }, [isDark]);

  const linkStyle = {
    color: ink, opacity: 0.85, fontSize: 14, fontWeight: 400,
    letterSpacing: "-0.01em", cursor: "pointer",
    background: "none", border: "none", fontFamily: F.text,
    padding: 0, textDecoration: "none", whiteSpace: "nowrap",
  };

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        backdropFilter: "saturate(180%) blur(20px)",
        WebkitBackdropFilter: "saturate(180%) blur(20px)",
        background: navBg,
        borderBottom: `1px solid ${rule}`,
        height: 48,
      }}>
        <div style={{
          maxWidth: 1024, margin: "0 auto", padding: "0 22px",
          height: "100%", display: "flex", alignItems: "center",
          justifyContent: "flex-start",
        }}>
          <button onClick={onBack} style={linkStyle}>{"\u2039 "}{backLabel}</button>
        </div>
      </nav>
      <div style={{ paddingTop: 48 }}>{children}</div>
    </>
  );
}
