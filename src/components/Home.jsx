import { useEffect, useCallback } from "react";
import imgTheTell from "../assets/explorations/the-tell.jpg";
import imgSoftwareFactory from "../assets/explorations/software-factory.jpg";
import imgIntelligenceCurrency from "../assets/explorations/intelligence-currency.jpg";
import imgAlsLimit from "../assets/explorations/als-limit.jpg";

// Per-essay hero image. Featured cards fall back to the CSS gradient
// (work.visual) when no image is registered here.
const IMAGES = {
  "the-tell": imgTheTell,
  "software-factory": imgSoftwareFactory,
  "intelligence-currency": imgIntelligenceCurrency,
  "als-limit": imgAlsLimit,
};

// ── Tokens — Apple direction ───────────────────────────────
const C = {
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

const F = {
  display:
    '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", Helvetica, Arial, sans-serif',
  text:
    '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif',
};

const FEATURED = [
  {
    id: "the-tell",
    eyebrow: "MEMORY",
    title: "The Tell.",
    desc: "Memory, cognition, and the archaeological mound.",
    visual:
      "radial-gradient(circle at 30% 40%, rgba(201,168,76,0.5), transparent 60%), linear-gradient(135deg, #1a1a1a, #2a2a2a)",
  },
  {
    id: "software-factory",
    eyebrow: "PLATFORM",
    title: "The Software Factory.",
    desc: "Supply chain security as a 2D platformer.",
    visual:
      "radial-gradient(circle at 70% 50%, rgba(80,120,255,0.4), transparent 55%), linear-gradient(135deg, #0a1230, #1a2244)",
  },
  {
    id: "intelligence-currency",
    eyebrow: "INTELLIGENCE",
    title: "Intelligence as currency.",
    desc: "Seven theses on compounding intelligence.",
    visual:
      "radial-gradient(circle at 50% 30%, rgba(255,255,255,0.18), transparent 60%), linear-gradient(160deg, #2b3a2b, #1a261a)",
  },
  {
    id: "als-limit",
    eyebrow: "COMPLEXITY",
    title: "Al\u2019s Limit.",
    desc: "A Kardashev scale for software complexity.",
    visual:
      "radial-gradient(circle at 60% 60%, rgba(220,90,90,0.32), transparent 55%), linear-gradient(135deg, #2a1414, #1a0e0e)",
  },
];

const CAREER = [
  { co: "Port.io", role: "Head of Technical Success, Americas", yr: "2025 \u2014 Present", live: true },
  { co: "Harness", role: "Senior Technical Program Manager", yr: "2024 \u2014 2025" },
  { co: "Snyk", role: "Manager, Customer Solutions Group", yr: "2022 \u2014 2024" },
  { co: "HashiCorp", role: "Enterprise User Success Manager", yr: "2021" },
  { co: "Western Digital", role: "Staff Manager, Enterprise", yr: "2013 \u2014 2021" },
];

const pillFilled = {
  display: "inline-flex", alignItems: "center", gap: 6,
  padding: "12px 22px", borderRadius: 999,
  background: C.link, color: "#fff",
  fontFamily: F.text, fontSize: 17, fontWeight: 400,
  border: "none", cursor: "pointer", textDecoration: "none",
  letterSpacing: "-0.01em",
};
const pillGhost = {
  display: "inline-flex", alignItems: "center", gap: 6,
  padding: "12px 22px", borderRadius: 999,
  background: "transparent", color: C.link,
  fontFamily: F.text, fontSize: 17, fontWeight: 400,
  border: "none", cursor: "pointer", textDecoration: "none",
  letterSpacing: "-0.01em",
};

function Nav({ onNav }) {
  const linkStyle = {
    color: C.ink, opacity: 0.85,
    fontSize: "clamp(12px, 3.4vw, 14px)", fontWeight: 400,
    letterSpacing: "-0.01em", cursor: "pointer",
    background: "none", border: "none", fontFamily: F.text,
    padding: 0, textDecoration: "none", whiteSpace: "nowrap",
  };
  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 50,
      backdropFilter: "saturate(180%) blur(20px)",
      WebkitBackdropFilter: "saturate(180%) blur(20px)",
      background: "rgba(255,255,255,0.72)",
      borderBottom: "1px solid rgba(0,0,0,0.06)",
      height: 48,
    }}>
      <div style={{
        maxWidth: 1024, margin: "0 auto", padding: "0 22px",
        height: "100%", display: "flex", alignItems: "center",
        justifyContent: "space-between", gap: 12,
      }}>
        <span style={{
          fontWeight: 500, color: C.ink, fontFamily: F.text, fontSize: 14,
          flexShrink: 0,
        }}>sharma</span>
        <div style={{ display: "flex", gap: "clamp(12px, 4vw, 28px)" }}>
          <button onClick={() => onNav("explorations")} style={linkStyle}>Explorations</button>
          <button onClick={() => onNav("operator")} style={linkStyle}>Operator</button>
          <a href="https://darkvectorcognition.ai" target="_blank" rel="noopener noreferrer" style={linkStyle}>DVC</a>
          <button onClick={() => window.dispatchEvent(new CustomEvent("open-contact"))} style={linkStyle}>Contact</button>
        </div>
      </div>
    </nav>
  );
}

function HeroStage({ onNav }) {
  return (
    <div onClick={() => onNav("operator")}
      style={{
        margin: "56px auto 0", maxWidth: 1024, height: 460,
        borderRadius: 22, cursor: "pointer",
        position: "relative", overflow: "hidden",
        background:
          "radial-gradient(circle at 50% 60%, rgba(201,168,76,0.55), rgba(201,168,76,0) 38%), radial-gradient(circle at 50% 60%, rgba(80,120,255,0.18), rgba(0,0,0,0) 55%), #000",
      }}>
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage:
          "radial-gradient(2px 2px at 18% 30%, rgba(255,255,255,0.85), transparent 60%), radial-gradient(1.5px 1.5px at 72% 22%, rgba(255,255,255,0.7), transparent 60%), radial-gradient(1px 1px at 40% 75%, rgba(255,255,255,0.7), transparent 60%), radial-gradient(1.5px 1.5px at 85% 65%, rgba(255,255,255,0.8), transparent 60%), radial-gradient(1px 1px at 12% 80%, rgba(255,255,255,0.7), transparent 60%), radial-gradient(1px 1px at 60% 40%, rgba(255,255,255,0.6), transparent 60%), radial-gradient(1.5px 1.5px at 28% 55%, rgba(255,255,255,0.7), transparent 60%), radial-gradient(1px 1px at 90% 35%, rgba(255,255,255,0.6), transparent 60%)",
      }} />
      <div style={{
        position: "absolute", left: 32, bottom: 28, color: "rgba(255,255,255,0.85)",
        fontFamily: F.display, fontSize: 14,
        letterSpacing: "0.18em", textTransform: "uppercase",
      }}>Operator \u00B7 A cinematic invitation \u203A</div>
    </div>
  );
}

function Hero({ onNav }) {
  return (
    <section style={{ background: C.bg, textAlign: "center", padding: "96px 22px 56px" }}>
      <h1 style={{
        fontFamily: F.display, fontWeight: 600,
        fontSize: "clamp(56px, 9vw, 112px)",
        lineHeight: 1.05, letterSpacing: "-0.045em",
        margin: "0 0 14px", color: C.ink,
      }}>Al Sharma.</h1>
      <p style={{
        fontFamily: F.display, fontWeight: 400,
        fontSize: "clamp(22px, 2.6vw, 30px)",
        lineHeight: 1.2, letterSpacing: "-0.022em",
        color: C.ink, maxWidth: 760, margin: "0 auto 12px",
      }}>Post-sales strategy for AI-native software.</p>
      <p style={{
        fontFamily: F.text, fontSize: 18, color: C.inkSoft,
        letterSpacing: "-0.012em", maxWidth: 640,
        margin: "0 auto 28px", lineHeight: 1.45,
      }}>I close the gap between what enterprises buy and what they realize from it. I also build the agents I&apos;d want them to use.</p>
      <div style={{ display: "flex", justifyContent: "center", gap: 18, flexWrap: "wrap" }}>
        <button onClick={() => onNav("explorations")} style={pillFilled}>See the work</button>
        <a href="https://darkvectorcognition.ai" target="_blank" rel="noopener noreferrer" style={pillGhost}>{"Dark Vector Cognition \u203A"}</a>
      </div>
      <HeroStage onNav={onNav} />
    </section>
  );
}

function ExplorationCard({ work, onNav }) {
  const image = IMAGES[work.id];
  return (
    <button onClick={() => onNav(work.id)}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 12px 36px rgba(0,0,0,0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
      style={{
        background: "#fff", border: "none", borderRadius: 22,
        overflow: "hidden", padding: 0, cursor: "pointer",
        display: "flex", flexDirection: "column", minHeight: 380,
        textAlign: "left", fontFamily: F.text,
        transition: "transform .3s ease, box-shadow .3s ease",
      }}>
      <div style={{ height: 220, overflow: "hidden", position: "relative" }}>
        {image ? (
          <img
            src={image}
            alt=""
            loading="lazy"
            style={{
              width: "100%", height: "100%", objectFit: "cover", display: "block",
            }}
          />
        ) : (
          <div style={{ width: "100%", height: "100%", background: work.visual }} />
        )}
      </div>
      <div style={{ padding: "26px 28px 32px" }}>
        <p style={{
          fontFamily: F.text, fontSize: 13, letterSpacing: "0.04em",
          textTransform: "uppercase", color: C.inkMute, margin: "0 0 8px",
          fontWeight: 500,
        }}>{work.eyebrow}</p>
        <h3 style={{
          fontFamily: F.display, fontWeight: 600,
          fontSize: 28, lineHeight: 1.1, letterSpacing: "-0.025em",
          margin: "0 0 8px", color: C.ink,
        }}>{work.title}</h3>
        <p style={{
          margin: 0, color: C.inkSoft, fontSize: 16,
          fontFamily: F.text, letterSpacing: "-0.012em",
        }}>{work.desc}</p>
      </div>
    </button>
  );
}

function ExplorationsGrid({ onNav }) {
  return (
    <section style={{ background: C.bgSoft, paddingBottom: 96 }}>
      <div style={{ textAlign: "center", padding: "96px 22px 40px", maxWidth: 980, margin: "0 auto" }}>
        <h2 style={{
          fontFamily: F.display, fontWeight: 600,
          fontSize: "clamp(34px, 4.5vw, 52px)",
          lineHeight: 1.08, letterSpacing: "-0.035em",
          margin: "0 0 12px", color: C.ink,
        }}>Explorations.</h2>
        <p style={{
          fontFamily: F.display, fontWeight: 400,
          fontSize: "clamp(19px, 2vw, 23px)",
          color: C.inkSoft, maxWidth: 640, margin: "0 auto",
          lineHeight: 1.35, letterSpacing: "-0.018em",
        }}>Visual essays on agents, platform engineering, and the operator&apos;s craft.</p>
      </div>
      <div style={{
        maxWidth: 1024, margin: "0 auto", padding: "0 22px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
        gap: 20,
      }}>
        {FEATURED.map((work) => <ExplorationCard key={work.id} work={work} onNav={onNav} />)}
      </div>
      <div style={{ textAlign: "center", marginTop: 40 }}>
        <button onClick={() => onNav("explorations")} style={{
          background: "none", border: "none", color: C.link,
          fontFamily: F.text, fontSize: 17, letterSpacing: "-0.01em",
          cursor: "pointer",
        }}>{"See all twenty explorations \u203A"}</button>
      </div>
    </section>
  );
}

function DVCBlock() {
  return (
    <section style={{ background: C.bgFooter, padding: "112px 22px" }}>
      <div style={{ maxWidth: 920, margin: "0 auto", textAlign: "center" }}>
        <p style={{
          fontFamily: F.text, fontSize: 13, letterSpacing: "0.18em",
          textTransform: "uppercase", color: C.inkMute, margin: "0 0 28px",
        }}>Dark Vector Cognition</p>
        <h2 style={{
          fontFamily: F.display, fontWeight: 500,
          fontSize: "clamp(32px, 4.4vw, 50px)",
          lineHeight: 1.12, letterSpacing: "-0.03em",
          margin: "0 0 22px", color: C.ink,
        }}>A studio for systems that think.</h2>
        <p style={{
          fontFamily: F.display, fontWeight: 400,
          fontSize: "clamp(22px, 2.6vw, 32px)",
          lineHeight: 1.3, letterSpacing: "-0.022em",
          color: C.ink, margin: "0 auto 32px", maxWidth: 720,
        }}>Legacy software was built for humans clicking buttons. The next layer is built for agents doing work. We sit at that seam.</p>
        <a href="https://darkvectorcognition.ai" target="_blank" rel="noopener noreferrer" style={pillFilled}>Visit DVC</a>
      </div>
    </section>
  );
}

function CareerStrip({ onNav }) {
  return (
    <section style={{ background: C.bg, padding: "96px 22px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <h2 style={{
          fontFamily: F.display, fontWeight: 600,
          fontSize: "clamp(28px, 3.4vw, 40px)",
          lineHeight: 1.1, letterSpacing: "-0.03em",
          margin: "0 0 36px", color: C.ink, textAlign: "center",
        }}>The arc.</h2>
        <div>
          {CAREER.map((c) => (
            <div key={c.co} style={{
              display: "flex", justifyContent: "space-between",
              alignItems: "baseline", padding: "16px 0",
              borderBottom: `1px solid ${C.rule}`,
              flexWrap: "wrap", gap: 12,
            }}>
              <div style={{ minWidth: 140 }}>
                <div style={{
                  fontFamily: F.display, fontWeight: 600, fontSize: 18,
                  color: C.ink, letterSpacing: "-0.015em",
                }}>{c.co}
                  {c.live && (
                    <span style={{
                      display: "inline-block", marginLeft: 8, width: 7, height: 7,
                      borderRadius: "50%", background: C.live, verticalAlign: "middle",
                    }} />
                  )}
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 200, color: C.inkSoft, fontSize: 16, fontFamily: F.text }}>{c.role}</div>
              <div style={{ fontFamily: F.text, fontSize: 14, color: C.inkMute, whiteSpace: "nowrap" }}>{c.yr}</div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 32 }}>
          <button onClick={() => onNav("resume")} style={{
            background: "none", border: "none", color: C.link,
            fontFamily: F.text, fontSize: 17, cursor: "pointer",
          }}>{"Full resume \u203A"}</button>
        </div>
      </div>
    </section>
  );
}

function FooterStrip() {
  const linkStyle = { color: C.inkMute, textDecoration: "none", fontFamily: F.text };
  return (
    <footer style={{
      background: C.bgSoft, color: C.inkMute, fontSize: 12,
      borderTop: `1px solid ${C.rule}`,
    }}>
      <div style={{
        maxWidth: 1024, margin: "0 auto", padding: "28px 22px",
        display: "flex", justifyContent: "space-between",
        flexWrap: "wrap", gap: 12, fontFamily: F.text,
      }}>
        <div>{"\u00A9 2026 Al Sharma. Built in Austin."}</div>
        <div style={{ display: "flex", gap: 16 }}>
          <a href="https://www.linkedin.com/in/alsharma" target="_blank" rel="noopener noreferrer" style={linkStyle}>LinkedIn</a>
          <a href="https://github.com/kunalnano" target="_blank" rel="noopener noreferrer" style={linkStyle}>GitHub</a>
          <a href="https://darkvectorcognition.ai" target="_blank" rel="noopener noreferrer" style={linkStyle}>DVC</a>
          <a href="https://enablement.alsharma.com" target="_blank" rel="noopener noreferrer" style={linkStyle}>Enablement</a>
          <a href="mailto:hello@darkvectorcognition.ai" style={linkStyle}>Email</a>
        </div>
      </div>
    </footer>
  );
}

export default function Home({ onNavigate }) {
  const go = useCallback((id) => {
    window.location.hash = id;
    onNavigate(id);
    window.scrollTo(0, 0);
  }, [onNavigate]);

  useEffect(() => {
    const prev = document.body.style.background;
    document.body.style.background = C.bg;
    return () => { document.body.style.background = prev; };
  }, []);

  return (
    <div style={{
      background: C.bg, color: C.ink, fontFamily: F.text,
      minHeight: "100vh",
      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale",
    }}>
      <Nav onNav={go} />
      <Hero onNav={go} />
      <ExplorationsGrid onNav={go} />
      <DVCBlock />
      <CareerStrip onNav={go} />
      <FooterStrip />
    </div>
  );
}
