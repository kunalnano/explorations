// ── Shared design tokens — Apple direction ─────────────────
// Used by Home and every exploration so the whole site stays one piece.

export const C = {
  bg: "#ffffff",
  bgSoft: "#f5f5f7",
  bgFooter: "#fafafa",
  bgInk: "#000000",
  ink: "#1d1d1f",
  inkSoft: "#6e6e73",
  inkMute: "#86868b",
  rule: "#d2d2d7",
  accent: "#c9a84c",
  link: "#0066cc",
  live: "#34c759",
};

export const F = {
  display:
    '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", Helvetica, Arial, sans-serif',
  text:
    '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif',
  mono:
    '"SF Mono", "JetBrains Mono", "Cascadia Code", Consolas, monospace',
};

// Typography presets used across explorations
export const T = {
  h1: {
    fontFamily: F.display, fontWeight: 600,
    fontSize: "clamp(48px, 7vw, 88px)",
    lineHeight: 1.05, letterSpacing: "-0.04em",
    color: C.ink, margin: 0,
  },
  h2: {
    fontFamily: F.display, fontWeight: 600,
    fontSize: "clamp(32px, 4vw, 48px)",
    lineHeight: 1.08, letterSpacing: "-0.03em",
    color: C.ink, margin: 0,
  },
  h3: {
    fontFamily: F.display, fontWeight: 600,
    fontSize: "clamp(22px, 2.4vw, 30px)",
    lineHeight: 1.15, letterSpacing: "-0.022em",
    color: C.ink, margin: 0,
  },
  lede: {
    fontFamily: F.display, fontWeight: 400,
    fontSize: "clamp(20px, 2vw, 26px)",
    lineHeight: 1.35, letterSpacing: "-0.018em",
    color: C.inkSoft, margin: 0,
  },
  body: {
    fontFamily: F.text, fontSize: 18,
    lineHeight: 1.55, letterSpacing: "-0.01em",
    color: C.ink, margin: 0,
  },
  small: {
    fontFamily: F.text, fontSize: 15,
    lineHeight: 1.5, letterSpacing: "-0.008em",
    color: C.inkSoft, margin: 0,
  },
  eyebrow: {
    fontFamily: F.text, fontSize: 13,
    letterSpacing: "0.04em", textTransform: "uppercase",
    color: C.inkMute, fontWeight: 500, margin: 0,
  },
};

export const pill = {
  filled: {
    display: "inline-flex", alignItems: "center", gap: 6,
    padding: "12px 22px", borderRadius: 999,
    background: C.link, color: "#fff",
    fontFamily: F.text, fontSize: 17, fontWeight: 400,
    border: "none", cursor: "pointer", textDecoration: "none",
    letterSpacing: "-0.01em",
  },
  ghost: {
    display: "inline-flex", alignItems: "center", gap: 6,
    padding: "12px 22px", borderRadius: 999,
    background: "transparent", color: C.link,
    fontFamily: F.text, fontSize: 17, fontWeight: 400,
    border: "none", cursor: "pointer", textDecoration: "none",
    letterSpacing: "-0.01em",
  },
};
