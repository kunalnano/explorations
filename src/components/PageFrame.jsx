import { useEffect } from "react";
import { C, F, L, wordmark } from "../design.js";

// ── PageFrame ──────────────────────────────────────────────
// Floats a consistent DVC-style nav over every page so the chrome is
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
  const ink = isDark ? "#f5f2e9" : C.ink;
  const rule = isDark ? "rgba(255,255,255,0.10)" : C.rule;
  const navBg = isDark ? "rgba(5,5,8,0.82)" : "rgba(255,255,255,0.9)";

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
    color: ink, fontSize: 10, fontWeight: 500,
    letterSpacing: "0.14em", textTransform: "uppercase", cursor: "pointer",
    background: "none", border: "none", fontFamily: F.mono,
    padding: 0, minHeight: 44, display: "inline-flex", alignItems: "center",
    textDecoration: "none", whiteSpace: "nowrap",
  };

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        background: navBg,
        borderBottom: `1px solid ${rule}`,
        height: L.navH,
      }}>
        <div style={{
          maxWidth: L.max, margin: "0 auto", padding: `0 ${L.gutter}`,
          height: "100%", display: "flex", alignItems: "center",
          justifyContent: "space-between", gap: 16,
        }}>
          <button onClick={onBack} style={linkStyle}>{"\u2190 "}{backLabel}</button>
          <div style={{ display: "flex", alignItems: "center", gap: "clamp(16px, 3vw, 32px)" }}>
            <button onClick={() => window.dispatchEvent(new CustomEvent("open-contact"))} style={linkStyle}>Contact</button>
            <a href="/" aria-label="Al Sharma, home" style={{ ...wordmark, color: ink }}>Al Sharma</a>
          </div>
        </div>
      </nav>
      <div style={{ paddingTop: L.navH }}>{children}</div>
    </>
  );
}
