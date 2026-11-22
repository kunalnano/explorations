import { useEffect } from "react";
import { C, F, L, wordmark } from "../design.js";

// PageFrame
// Floats a consistent Apple frosted translucent nav over every framed route so
// chrome stays unified site-wide while dark visual essays retain their own
// interior visual world.

export default function PageFrame({
  children,
  onBack,
  backLabel = "Explorations",
  surface = "light", // "light" | "dark"
}) {
  const isDark = surface === "dark";
  const ink = isDark ? C.darkInk : C.ink;
  const linkColor = isDark ? C.darkBlue : C.link;
  const rule = isDark ? C.darkRule : C.rule;

  useEffect(() => {
    const prevBody = document.body.style.background;
    const prevHtml = document.documentElement.style.background;
    const target = isDark ? C.bgDarkCanvas : C.bg;
    document.body.style.background = target;
    document.documentElement.style.background = target;
    return () => {
      document.body.style.background = prevBody;
      document.documentElement.style.background = prevHtml;
    };
  }, [isDark]);

  return (
    <div className={isDark ? "apple-dark-surface" : undefined}>
      <nav
        aria-label="Page navigation"
        className={isDark ? "apple-nav-bar-dark" : "apple-nav-bar"}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          borderBottom: `1px solid ${rule}`,
          height: L.navH,
        }}
      >
        <div
          style={{
            maxWidth: L.max,
            margin: "0 auto",
            padding: `0 ${L.gutter}`,
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
          }}
        >
          <button
            type="button"
            onClick={onBack}
            className={`${isDark ? "apple-nav-link-dark" : "apple-nav-link"} apple-pill`}
            style={{
              color: linkColor,
              fontFamily: F.text,
              fontSize: 15,
              fontWeight: 500,
              gap: 4,
              paddingLeft: 8,
              paddingRight: 10,
              flexShrink: 0,
            }}
          >
            <span aria-hidden="true" style={{ fontSize: 18, lineHeight: 1 }}>{"\u2039"}</span>
            {backLabel}
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "clamp(8px, 2vw, 18px)", minWidth: 0 }}>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent("open-contact"))}
              className={`${isDark ? "apple-btn-dark-secondary" : "apple-btn-primary"} apple-pill`}
              style={{
                minHeight: 44,
                padding: "0 clamp(12px, 2vw, 18px)",
                fontSize: 14,
                whiteSpace: "nowrap",
              }}
            >
              Get in touch
            </button>
            <a
              href="/"
              aria-label="Al Sharma, home"
              style={{ ...wordmark, color: ink, fontSize: "clamp(15px, 2vw, 17px)" }}
            >
              Al Sharma
            </a>
          </div>
        </div>
      </nav>
      <div style={{ paddingTop: L.navH }}>{children}</div>
    </div>
  );
}
