// ── Shared design tokens — DVC monochrome direction ────────
// Same language as darkvectorcognition.ai's default theme: black ink on
// white, Space Grotesk display, IBM Plex Sans body, JetBrains Mono for
// eyebrows / nav / buttons, hairline rules, square corners.
// Used by Home and every exploration so the whole site stays one piece.

export const C = {
  bg: "#ffffff",
  bgSoft: "#f3f3f0",
  bgFooter: "#f7f7f4",
  bgInk: "#050505",
  ink: "#050505",
  inkSoft: "rgba(5,5,5,0.69)",
  inkMute: "rgba(5,5,5,0.58)",
  rule: "rgba(5,5,8,0.11)",
  ruleStrong: "rgba(5,5,8,0.22)",
  surface: "rgba(5,5,8,0.018)",
  accent: "#c9a84c", // amber — essays on dark surfaces only
  link: "#050505",
  live: "#087a3b",
};

export const F = {
  display: '"Space Grotesk", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif',
  text: '"IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif',
  mono: '"JetBrains Mono", "SF Mono", "Cascadia Code", Consolas, monospace',
};

// Layout rhythm
export const L = {
  max: 1240,
  gutter: "clamp(20px, 5vw, 56px)",
  section: "clamp(80px, 10vw, 144px)",
  navH: 64,
};

// Typography presets used across explorations
export const T = {
  h1: {
    fontFamily: F.display, fontWeight: 600,
    fontSize: "clamp(46px, 7.2vw, 104px)",
    lineHeight: 0.94, letterSpacing: "-0.06em",
    color: C.ink, margin: 0,
  },
  h2: {
    fontFamily: F.display, fontWeight: 600,
    fontSize: "clamp(36px, 5.4vw, 72px)",
    lineHeight: 0.98, letterSpacing: "-0.045em",
    color: C.ink, margin: 0,
  },
  h3: {
    fontFamily: F.display, fontWeight: 600,
    fontSize: "clamp(21px, 2.2vw, 26px)",
    lineHeight: 1.12, letterSpacing: "-0.022em",
    color: C.ink, margin: 0,
  },
  lede: {
    fontFamily: F.text, fontWeight: 300,
    fontSize: "clamp(18px, 1.9vw, 23px)",
    lineHeight: 1.55, letterSpacing: 0,
    color: C.inkSoft, margin: 0,
  },
  body: {
    fontFamily: F.text, fontSize: 17,
    lineHeight: 1.68, letterSpacing: 0,
    color: C.inkSoft, margin: 0,
  },
  small: {
    fontFamily: F.text, fontSize: 15,
    lineHeight: 1.6, letterSpacing: 0,
    color: C.inkSoft, margin: 0,
  },
  eyebrow: {
    fontFamily: F.mono, fontSize: 11, lineHeight: 1.5,
    letterSpacing: "0.2em", textTransform: "uppercase",
    color: C.ink, fontWeight: 500, margin: 0,
  },
  meta: {
    fontFamily: F.mono, fontSize: 10, lineHeight: 1.5,
    letterSpacing: "0.1em", textTransform: "uppercase",
    color: C.inkMute, fontWeight: 500, margin: 0,
  },
};

const button = {
  display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 14,
  minHeight: 48, padding: "0 22px", borderRadius: 0,
  fontFamily: F.mono, fontSize: 11, fontWeight: 500,
  letterSpacing: "0.08em", textTransform: "uppercase",
  cursor: "pointer", textDecoration: "none",
};

// Name kept as `pill` for existing imports; the shape is now square.
export const pill = {
  filled: { ...button, background: C.ink, color: "#fff", border: `1px solid ${C.ink}` },
  ghost: { ...button, background: "transparent", color: C.ink, border: `1px solid ${C.ruleStrong}` },
};

// Inline mono text link ("FULL RESUME →")
export const textLink = {
  display: "inline-flex", alignItems: "center", minHeight: 44,
  background: "none", border: "none", padding: 0,
  fontFamily: F.mono, fontSize: 11, fontWeight: 500,
  letterSpacing: "0.08em", textTransform: "uppercase",
  color: C.ink, cursor: "pointer", textDecoration: "none",
};

// Site wordmark — full name, links home. Colour is overridden on dark chrome.
export const wordmark = {
  fontFamily: F.display, fontWeight: 600, fontSize: 16,
  letterSpacing: "-0.02em", color: C.ink,
  textDecoration: "none", flexShrink: 0, whiteSpace: "nowrap",
  display: "inline-flex", alignItems: "center", minHeight: 44,
};
