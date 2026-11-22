// Shared design tokens: Apple 66% Concentric Shells & HIG direction.
// Light canvas (#f5f5f7) with floating #ffffff hardware shells, dark Pro stages
// (#1d1d1f / #000000), Apple SF Pro typography with self-hosted fallbacks,
// and continuous 66% concentric squircles.

export const C = {
  bg: "#f5f5f7",
  surface: "#ffffff",
  bgSoft: "#f5f5f7",
  tray: "#f5f5f7",
  trayHover: "#ebebf0",
  bgFooter: "#f5f5f7",
  bgInk: "#1d1d1f",
  bgDarkCanvas: "#000000",
  bgDarkTray: "#161617",
  ink: "#1d1d1f",
  inkSoft: "#515154",
  inkMute: "#6e6e73",
  darkInk: "#f5f5f7",
  darkInkMute: "#a1a1a6",
  rule: "rgba(0, 0, 0, 0.08)",
  ruleStrong: "#d2d2d7",
  controlBorder: "#86868b",
  controlBorderHover: "#6e6e73",
  darkRule: "rgba(255, 255, 255, 0.12)",
  darkControlBorder: "rgba(255, 255, 255, 0.42)",
  blue: "#0071e3",
  blueHover: "#0077ed",
  darkBlue: "#2997ff",
  link: "#0066cc",
  tint: "rgba(0, 113, 227, 0.10)",
  tintSolid: "#e8f2fc",
  accent: "#c9a84c", // amber accent preserved for dark visual essays
  live: "#1d7a36",
  darkLive: "#30d158",
  red: "#c92a2a",
  amber: "#9a4a00",
};

export const F = {
  display: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "IBM Plex Sans", "Helvetica Neue", Arial, sans-serif',
  text: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "IBM Plex Sans", "Helvetica Neue", Arial, sans-serif',
  mono: '"SF Mono", "JetBrains Mono", ui-monospace, "Cascadia Code", Menlo, Consolas, monospace',
};

// Concentric 66% squircle style helpers (pair with .apple-* classes where possible)
export const R = {
  xs: { borderRadius: "calc(var(--radius-xs) * var(--sq-mult))", cornerShape: "var(--sq-shape)" },
  sm: { borderRadius: "calc(var(--radius-sm) * var(--sq-mult))", cornerShape: "var(--sq-shape)" },
  md: { borderRadius: "calc(var(--radius-md) * var(--sq-mult))", cornerShape: "var(--sq-shape)" },
  lg: { borderRadius: "calc(var(--radius-lg) * var(--sq-mult))", cornerShape: "var(--sq-shape)" },
  xl: { borderRadius: "calc(var(--radius-xl) * var(--sq-mult))", cornerShape: "var(--sq-shape)" },
  pill: { borderRadius: "var(--radius-pill)", cornerShape: "round" },
};

export const SHADOW = {
  shell: "0 2px 12px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.03)",
  hover: "0 12px 32px rgba(0, 0, 0, 0.08)",
  dark: "0 20px 48px rgba(0, 0, 0, 0.22)",
};

// Layout rhythm
export const L = {
  max: 1180,
  gutter: "clamp(14px, 3vw, 32px)",
  section: "clamp(48px, 6.5vw, 88px)",
  shellPad: "clamp(24px, 4.2vw, 56px)",
  shellGap: "clamp(16px, 2vw, 24px)",
  navH: 60,
};

// Typography presets used across Home, Resume, Explorations, and essays
export const T = {
  h1: {
    fontFamily: F.display,
    fontWeight: 600,
    fontSize: "clamp(46px, 6.8vw, 92px)",
    lineHeight: 1.02,
    letterSpacing: "-0.04em",
    color: C.ink,
    margin: 0,
  },
  h2: {
    fontFamily: F.display,
    fontWeight: 600,
    fontSize: "clamp(32px, 4.4vw, 56px)",
    lineHeight: 1.06,
    letterSpacing: "-0.032em",
    color: C.ink,
    margin: 0,
  },
  h3: {
    fontFamily: F.display,
    fontWeight: 600,
    fontSize: "clamp(20px, 2vw, 24px)",
    lineHeight: 1.18,
    letterSpacing: "-0.022em",
    color: C.ink,
    margin: 0,
  },
  lede: {
    fontFamily: F.text,
    fontWeight: 400,
    fontSize: "clamp(18px, 1.8vw, 22px)",
    lineHeight: 1.48,
    letterSpacing: "-0.012em",
    color: C.inkSoft,
    margin: 0,
  },
  body: {
    fontFamily: F.text,
    fontSize: 17,
    lineHeight: 1.6,
    letterSpacing: "-0.008em",
    color: C.inkSoft,
    margin: 0,
  },
  small: {
    fontFamily: F.text,
    fontSize: 15,
    lineHeight: 1.56,
    letterSpacing: "-0.006em",
    color: C.inkSoft,
    margin: 0,
  },
  eyebrow: {
    fontFamily: F.text,
    fontSize: 12,
    lineHeight: 1.4,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    color: C.inkMute,
    fontWeight: 600,
    margin: 0,
  },
  meta: {
    fontFamily: F.text,
    fontSize: 13,
    lineHeight: 1.45,
    letterSpacing: "-0.004em",
    color: C.inkMute,
    fontWeight: 500,
    margin: 0,
  },
};

const buttonBase = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  minHeight: 48,
  padding: "0 24px",
  ...R.pill,
  fontFamily: F.text,
  fontSize: 15,
  fontWeight: 500,
  letterSpacing: "-0.01em",
  cursor: "pointer",
  textDecoration: "none",
};

export const pill = {
  filled: {
    ...buttonBase,
    background: C.blue,
    color: "#ffffff",
    border: "1px solid transparent",
  },
  ghost: {
    ...buttonBase,
    background: C.tray,
    color: C.ink,
    border: `1px solid ${C.controlBorder}`,
  },
  darkGhost: {
    ...buttonBase,
    background: "rgba(255, 255, 255, 0.10)",
    color: C.darkInk,
    border: `1px solid ${C.darkControlBorder}`,
  },
};

// Apple link-blue inline action link
export const textLink = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  minHeight: 44,
  background: "none",
  border: "none",
  padding: 0,
  fontFamily: F.text,
  fontSize: 16,
  fontWeight: 500,
  letterSpacing: "-0.01em",
  color: C.link,
  cursor: "pointer",
  textDecoration: "none",
};

// Site wordmark - full name, links home. Colour is overridden on dark chrome.
export const wordmark = {
  fontFamily: F.display,
  fontWeight: 600,
  fontSize: 17,
  letterSpacing: "-0.025em",
  color: C.ink,
  textDecoration: "none",
  flexShrink: 0,
  whiteSpace: "nowrap",
  display: "inline-flex",
  alignItems: "center",
  minHeight: 44,
};
