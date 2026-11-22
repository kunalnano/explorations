import { useState, useEffect, useCallback } from "react";
import { C, F, L, T, wordmark } from "../design.js";
import momentSample from "../assets/shipped/moment-sample.webp";
import quartermasterCapture from "../assets/shipped/quartermaster-desktop.webp";

const CAREER = [
  { co: "Port.io", role: "Head of Technical Success Managers, AMER", yr: "2025 - Present", live: true },
  { co: "Harness", role: "Manager, Technical Customer Success / Senior Technical Program Manager", yr: "2023 - 2025" },
  { co: "Snyk", role: "Sr. Manager, Technical Success - Strategic Accounts", yr: "2021 - 2023" },
  { co: "HashiCorp", role: "Enterprise User Success Manager", yr: "2021" },
  { co: "Western Digital", role: "Staff Enterprise TAM", yr: "2013 - 2021" },
  { co: "Element Energy", role: "Business Development Consultant", yr: "2010 - 2012" },
];

// Hash is the router here, so same-page jumps scroll instead of setting it.
function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - (L.navH + 16);
  window.scrollTo({ top, behavior: "smooth" });
}

function useNarrow(maxWidth = 760) {
  const query = `(max-width: ${maxWidth}px)`;
  const [narrow, setNarrow] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = (e) => setNarrow(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);
  return narrow;
}

function EyebrowChip({ children, dark = false }) {
  return (
    <span
      className="apple-chip"
      style={{
        display: "inline-flex",
        alignItems: "center",
        maxWidth: "100%",
        padding: "6px 12px",
        background: dark ? "rgba(255, 255, 255, 0.08)" : C.tray,
        border: `1px solid ${dark ? C.darkRule : C.rule}`,
        fontFamily: F.text,
        fontSize: 12,
        fontWeight: 600,
        lineHeight: 1.4,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        color: dark ? C.darkInkMute : C.inkMute,
      }}
    >
      {children}
    </span>
  );
}

function Nav({ onNav }) {
  const narrow = useNarrow();
  const [open, setOpen] = useState(false);
  const drawerOpen = narrow && open;

  useEffect(() => {
    if (!drawerOpen) return undefined;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const contact = () => window.dispatchEvent(new CustomEvent("open-contact"));
  const items = [
    { label: "R\u00E9sum\u00E9", note: "Curriculum vit\u00E6", run: () => onNav("resume") },
    { label: "Thesis", note: "How I run post-sales", href: "#thesis", same: true },
    { label: "Shipped", note: "What I have built", href: "#shipped", same: true },
    { label: "DVC", note: "darkvectorcognition.ai \u2197", href: "https://darkvectorcognition.ai" },
  ];

  const rowStyle = {
    display: "grid",
    gridTemplateColumns: "34px 1fr",
    gap: "2px 10px",
    width: "100%",
    padding: "16px 18px",
    background: C.tray,
    border: `1px solid ${C.rule}`,
    textAlign: "left",
    cursor: "pointer",
    textDecoration: "none",
    alignItems: "center",
  };

  return (
    <>
    <nav
      aria-label="Primary"
      className={drawerOpen ? "apple-nav-bar apple-nav-bar-open" : "apple-nav-bar"}
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        borderBottom: `1px solid ${C.rule}`,
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
          gap: 16,
        }}
      >
        <a href="/" aria-label="Al Sharma, home" style={wordmark}>
          Al Sharma
        </a>
        {narrow ? (
          <button
            type="button"
            aria-expanded={drawerOpen}
            aria-controls="site-drawer"
            onClick={() => setOpen((v) => !v)}
            className="apple-btn-secondary apple-control"
            style={{ minHeight: 44, padding: "0 16px", fontSize: 14 }}
          >
            {drawerOpen ? "Close" : "Menu"}
          </button>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: "clamp(4px, 1.4vw, 14px)" }}>
            {items.map((it) =>
              it.same ? (
                <button
                  key={it.label}
                  type="button"
                  onClick={() => scrollToId(it.href.slice(1))}
                  className="apple-nav-link apple-pill"
                >
                  {it.label}
                </button>
              ) : it.href ? (
                <a
                  key={it.label}
                  href={it.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="apple-nav-link apple-pill"
                >
                  {it.label}
                </a>
              ) : (
                <button
                  key={it.label}
                  type="button"
                  onClick={it.run}
                  className="apple-nav-link apple-pill"
                >
                  {it.label}
                </button>
              )
            )}
            <button
              type="button"
              onClick={contact}
              className="apple-btn-primary apple-pill"
              style={{ minHeight: 44, padding: "0 18px", fontSize: 14, marginLeft: 4 }}
            >
              Get in touch
            </button>
          </div>
        )}
      </div>
    </nav>
    {drawerOpen && (
      <>
        <div
          onClick={() => setOpen(false)}
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: `${L.navH}px 0 0 0`,
            background: "rgba(0, 0, 0, 0.24)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            zIndex: 49,
          }}
        />
        <div
          id="site-drawer"
          className="apple-shell apple-shell-surface"
          style={{
            position: "fixed",
            top: L.navH + 10,
            left: 12,
            right: 12,
            maxHeight: `calc(100dvh - ${L.navH + 22}px)`,
            padding: 14,
            overflowY: "auto",
            zIndex: 51,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
            {items.map((it, i) => {
              const inner = (
                <>
                  <span
                    style={{
                      fontFamily: F.mono,
                      fontSize: 12,
                      fontWeight: 500,
                      color: C.inkMute,
                      gridRow: "1 / 3",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <strong
                    style={{
                      fontFamily: F.display,
                      fontWeight: 600,
                      fontSize: 20,
                      letterSpacing: "-0.025em",
                      color: C.ink,
                    }}
                  >
                    {it.label}
                  </strong>
                  <em style={{ ...T.meta, fontStyle: "normal" }}>{it.note}</em>
                </>
              );
              return it.href && !it.same ? (
                <a
                  key={it.label}
                  href={it.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="apple-media"
                  style={rowStyle}
                  onClick={() => setOpen(false)}
                >
                  {inner}
                </a>
              ) : (
                <button
                  key={it.label}
                  type="button"
                  className="apple-media"
                  style={rowStyle}
                  onClick={() => {
                    setOpen(false);
                    if (it.same) scrollToId(it.href.slice(1));
                    else it.run();
                  }}
                >
                  {inner}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                contact();
              }}
              className="apple-btn-primary apple-pill"
              style={{ width: "100%", marginTop: 6 }}
            >
              Get in touch
            </button>
          </div>
        </>
      )}
    </>
  );
}

function Hero({ onNav }) {
  return (
    <section
      className="apple-shell apple-shell-surface"
      style={{
        padding: `clamp(32px, 5.5vw, 68px) clamp(24px, 4.5vw, 56px)`,
      }}
    >
      <EyebrowChip>{"Austin, Texas \u00B7 Post-sales leadership \u00B7 Builder"}</EyebrowChip>
      <h1
        style={{
          ...T.h1,
          margin: "22px 0 26px",
          fontSize: "clamp(50px, 8.2vw, 112px)",
          lineHeight: 0.98,
          letterSpacing: "-0.045em",
        }}
      >
        Al Sharma.
      </h1>
      <div
        style={{
          display: "grid",
          gap: "clamp(20px, 4vw, 56px)",
          alignItems: "start",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
        }}
      >
        <p
          style={{
            fontFamily: F.display,
            fontWeight: 600,
            fontSize: "clamp(24px, 2.8vw, 34px)",
            lineHeight: 1.12,
            letterSpacing: "-0.03em",
            color: C.ink,
            margin: 0,
            maxWidth: 500,
          }}
        >
          Post-sales executive for developer platforms.
        </p>
        <div>
          <p style={{ ...T.lede, maxWidth: 580 }}>
            Fifteen years running customer success, support and services through
            developer-platform scale-ups (HashiCorp, Snyk, Harness) and now
            Technical Success for the Americas at Port. I build the AI agents I
            ask enterprise customers to adopt, and I ship them.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 28 }}>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent("open-contact"))}
              className="apple-btn-primary apple-pill"
            >
              Get in touch <span aria-hidden="true">{"\u2192"}</span>
            </button>
            <button
              type="button"
              onClick={() => onNav("resume")}
              className="apple-btn-secondary apple-pill"
            >
              Read the r&eacute;sum&eacute;
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

const PROOF = [
  { n: "$125M", l: "cumulative ARR book", sub: "developer platforms, AppSec, cloud infra" },
  { n: "135%+", l: "net revenue retention", sub: "Snyk enterprise portfolio" },
  { n: "12+", l: "technical CSMs hired & developed", sub: "career frameworks, enablement, $100M+ book" },
  { n: "3", l: "post-sales orgs built or rebuilt", sub: "Snyk \u00B7 Harness \u00B7 Port" },
];

function ProofBar() {
  return (
    <section
      aria-label="Track record"
      className="apple-shell apple-shell-surface"
      style={{ padding: 14 }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
          gap: 12,
        }}
      >
        {PROOF.map((p) => (
          <div
            key={p.l}
            className="apple-media"
            style={{
              background: C.tray,
              border: `1px solid ${C.rule}`,
              padding: "26px clamp(18px, 2.2vw, 26px)",
            }}
          >
            <div
              style={{
                fontFamily: F.display,
                fontWeight: 600,
                fontSize: "clamp(34px, 3.8vw, 48px)",
                letterSpacing: "-0.04em",
                lineHeight: 1,
                color: C.ink,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {p.n}
            </div>
            <div
              style={{
                fontFamily: F.text,
                fontSize: 16,
                fontWeight: 500,
                color: C.ink,
                marginTop: 12,
                letterSpacing: "-0.01em",
              }}
            >
              {p.l}
            </div>
            <div style={{ ...T.meta, marginTop: 6 }}>{p.sub}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SectionHead({ eyebrow, title, children }) {
  return (
    <div
      style={{
        display: "grid",
        gap: "clamp(16px, 3vw, 48px)",
        alignItems: "end",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
        marginBottom: "clamp(28px, 3.5vw, 44px)",
      }}
    >
      <div>
        <p style={T.eyebrow}>{eyebrow}</p>
        <h2 style={{ ...T.h2, marginTop: 12 }}>{title}</h2>
      </div>
      {children ? <p style={{ ...T.body, maxWidth: 500 }}>{children}</p> : null}
    </div>
  );
}

const THESES = [
  {
    k: "01",
    t: "Agents dissolve absorbed complexity.",
    b: "Any product whose moat is \u201Cwe aggregate context so you don\u2019t have to\u201D is exposed the moment agents do that aggregation natively. Post-sales has to sell outcomes the agent can\u2019t reach on its own, or it is selling a shrinking asset.",
  },
  {
    k: "02",
    t: "Telemetry is the durable layer.",
    b: "Agents generate data; they don\u2019t replace it. Observability, audit and evidence get structurally safer as workflows go agent-native, so that is where a post-sales org should anchor its value and its renewals.",
  },
  {
    k: "03",
    t: "Security has to stay a third party.",
    b: "Codegen vendors can\u2019t credibly police their own output. An agnostic layer has to do it, which is why the customer-engineering motion around AI security is a leadership job, not a support queue.",
  },
];

function Thesis() {
  return (
    <section
      id="thesis"
      className="apple-shell apple-shell-surface"
      style={{ padding: `${L.shellPad}` }}
    >
      <SectionHead
        eyebrow="Operating thesis"
        title="What changes about post-sales when the customer is an agent."
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
          gap: 14,
        }}
      >
        {THESES.map((x) => (
          <article
            key={x.k}
            className="apple-card"
            style={{
              background: C.tray,
              border: `1px solid ${C.rule}`,
              padding: "clamp(22px, 2.6vw, 30px)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span
              className="apple-chip"
              style={{
                alignSelf: "flex-start",
                padding: "4px 10px",
                background: C.surface,
                border: `1px solid ${C.rule}`,
                fontFamily: F.mono,
                fontSize: 12,
                fontWeight: 500,
                color: C.link,
              }}
            >
              {x.k}
            </span>
            <h3 style={{ ...T.h3, margin: "clamp(24px, 3vw, 40px) 0 12px" }}>{x.t}</h3>
            <p style={{ ...T.small, fontSize: 15.5 }}>{x.b}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function CareerStrip({ onNav }) {
  return (
    <section
      className="apple-shell apple-shell-surface"
      style={{ padding: `${L.shellPad}` }}
    >
      <SectionHead eyebrow="Career" title="The arc." />
      <div
        className="apple-card"
        style={{
          background: C.tray,
          border: `1px solid ${C.rule}`,
          padding: "4px clamp(18px, 2.5vw, 28px)",
        }}
      >
        {CAREER.map((c, idx) => (
          <div
            key={c.co}
            style={{
              display: "grid",
              alignItems: "baseline",
              gap: "6px 24px",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))",
              padding: "18px 0",
              borderBottom: idx === CAREER.length - 1 ? "none" : `1px solid ${C.rule}`,
            }}
          >
            <div
              style={{
                fontFamily: F.display,
                fontWeight: 600,
                fontSize: 19,
                color: C.ink,
                letterSpacing: "-0.02em",
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              {c.co}
              {c.live && (
                <span
                  title="Current"
                  aria-label="Current role"
                  style={{
                    display: "inline-block",
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: C.live,
                    boxShadow: "0 0 0 3px rgba(29, 122, 54, 0.16)",
                  }}
                />
              )}
            </div>
            <div style={{ color: C.inkSoft, fontSize: 16, fontFamily: F.text }}>{c.role}</div>
            <div style={{ ...T.meta, fontFamily: F.mono, fontSize: 12 }}>{c.yr}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 18 }}>
        <button
          type="button"
          onClick={() => onNav("resume")}
          className="apple-text-link"
        >
          {"Full r\u00E9sum\u00E9 \u2192"}
        </button>
      </div>
    </section>
  );
}

const FEATURED_WORK = [
  {
    name: "Moment",
    category: "Apple application",
    what: "A calm place for the next visible move.",
    decision: "Keep the day in view, without turning it into another dashboard to manage.",
    href: "https://apps.apple.com/us/app/id6779027217",
    image: momentSample,
    width: 1600,
    height: 900,
    alt: "Existing Moment sample view showing weather and a follow-through board",
    caption: "Moment \u00B7 Existing sample view",
    background: "#090909",
    fit: "cover",
  },
  {
    name: "QuarterMaster",
    category: "Editorial guidance",
    what: "The room decides the kit.",
    decision: "Start with where someone is going, then help them choose what belongs there.",
    href: "https://quartermaster.style",
    image: quartermasterCapture,
    width: 2880,
    height: 1800,
    alt: "Existing QuarterMaster homepage capture with its field manual and work-dinner scene",
    caption: "QuarterMaster \u00B7 Existing product capture",
    background: "#201208",
    fit: "contain",
  },
];

function Built() {
  const narrow = useNarrow(780);
  return (
    <section
      id="shipped"
      className="apple-shell apple-shell-surface"
      style={{ padding: `${L.shellPad}` }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: narrow ? "1fr" : "1fr 1fr",
          gap: narrow ? 16 : 48,
          alignItems: "end",
          marginBottom: narrow ? 28 : 40,
        }}
      >
        <div>
          <p style={T.eyebrow}>Shipped</p>
          <h2 style={{ ...T.h2, marginTop: 12 }}>
            The executive
            <br />
            who also builds.
          </h2>
        </div>
        <p style={{ ...T.body, maxWidth: 460 }}>
          Products from Dark Vector Cognition. Different problems, carried
          through to something you can use.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {FEATURED_WORK.map((work, i) => (
          <article
            key={work.name}
            className="apple-card"
            style={{
              background: C.tray,
              border: `1px solid ${C.rule}`,
              padding: 10,
              display: "grid",
              gridTemplateColumns: narrow ? "1fr" : i === 0 ? "5fr 7fr" : "7fr 5fr",
              gap: narrow ? 16 : 28,
              alignItems: "center",
            }}
          >
            <figure style={{ margin: 0, minWidth: 0, order: narrow || i === 1 ? 0 : 1 }}>
              <div
                className="apple-control"
                style={{
                  height: narrow ? 240 : 360,
                  background: work.background,
                  overflow: "hidden",
                  border: `1px solid ${C.rule}`,
                }}
              >
                <img
                  src={work.image}
                  alt={work.alt}
                  width={work.width}
                  height={work.height}
                  loading="lazy"
                  decoding="async"
                  style={{
                    display: "block",
                    width: "100%",
                    height: "100%",
                    objectFit: work.fit,
                  }}
                />
              </div>
              <figcaption style={{ ...T.meta, fontSize: 12, paddingTop: 10, paddingLeft: 6 }}>
                {work.caption}
              </figcaption>
            </figure>
            <div style={{ minWidth: 0, padding: narrow ? "8px 10px 10px" : "14px 20px", order: narrow || i === 1 ? 1 : 0 }}>
              <span
                className="apple-chip"
                style={{
                  display: "inline-block",
                  padding: "4px 10px",
                  background: C.surface,
                  border: `1px solid ${C.rule}`,
                  fontFamily: F.text,
                  fontSize: 12,
                  fontWeight: 600,
                  color: C.inkMute,
                  marginBottom: 14,
                }}
              >
                {work.category}
              </span>
              <h3
                style={{
                  ...T.h3,
                  fontSize: narrow ? 30 : 36,
                  lineHeight: 1.08,
                  letterSpacing: "-0.03em",
                  overflowWrap: "anywhere",
                }}
              >
                {work.name}
              </h3>
              <p style={{ ...T.body, fontSize: narrow ? 17 : 18, maxWidth: "42ch", marginTop: 12 }}>
                {work.what}
              </p>
              <div
                className="apple-control"
                style={{
                  background: C.surface,
                  border: `1px solid ${C.rule}`,
                  margin: "20px 0 0",
                  padding: "14px 16px",
                  fontSize: 15,
                  lineHeight: 1.55,
                  color: C.inkSoft,
                  maxWidth: "46ch",
                }}
              >
                <span style={{ ...T.eyebrow, fontSize: 11, display: "block", marginBottom: 6 }}>
                  The product decision
                </span>
                {work.decision}
              </div>
              <a
                href={work.href}
                target="_blank"
                rel="noopener noreferrer"
                className="apple-text-link"
                style={{ marginTop: 14 }}
              >
                Explore {work.name} <span aria-hidden="true">{"\u2197"}</span>
              </a>
            </div>
          </article>
        ))}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: narrow ? "1fr" : "1fr 1fr",
            gap: 14,
          }}
        >
          <div
            className="apple-card"
            style={{
              background: C.tray,
              border: `1px solid ${C.rule}`,
              padding: "22px 24px",
            }}
          >
            <h3 style={{ ...T.h3, fontSize: 21 }}>Witness</h3>
            <p style={{ ...T.small, marginTop: 6, maxWidth: "48ch" }}>
              Software that makes agent activity inspectable.
            </p>
            <a
              href="https://github.com/dark-vector-cognition/witness"
              target="_blank"
              rel="noopener noreferrer"
              className="apple-text-link"
              style={{ marginTop: 8, fontSize: 15 }}
            >
              View the project <span aria-hidden="true">{"\u2197"}</span>
            </a>
          </div>
          <div
            className="apple-card"
            style={{
              background: C.tray,
              border: `1px solid ${C.rule}`,
              padding: "22px 24px",
            }}
          >
            <h3 style={{ ...T.h3, fontSize: 21 }}>Earlier advisory work</h3>
            <p style={{ ...T.small, marginTop: 6, maxWidth: "48ch" }}>
              Agent Flight Check. A previous offer, shown here as part of the
              work rather than a current service.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function FinalCta({ onNav }) {
  return (
    <section
      className="apple-shell apple-shell-dark apple-dark-surface"
      style={{
        padding: `clamp(44px, 6vw, 80px) clamp(24px, 4.5vw, 56px)`,
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        <EyebrowChip dark>{"Austin, Texas \u00B7 Replies within 24 hours"}</EyebrowChip>
        <h2
          style={{
            ...T.h2,
            color: C.darkInk,
            margin: "20px 0 18px",
          }}
        >
          Building or rebuilding a post-sales org?
        </h2>
        <p
          style={{
            ...T.body,
            color: C.darkInkMute,
            maxWidth: 580,
            margin: "0 auto 30px",
          }}
        >
          Customer success, support and services for developer platforms, run by
          someone who also ships the agents.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("open-contact"))}
            className="apple-btn-primary apple-pill"
          >
            Get in touch <span aria-hidden="true">{"\u2192"}</span>
          </button>
          <button
            type="button"
            onClick={() => onNav("resume")}
            className="apple-btn-dark-secondary apple-pill"
          >
            Read the r&eacute;sum&eacute;
          </button>
        </div>
      </div>
    </section>
  );
}

// Demoted, not deleted: everything outside the executive profile stays reachable
// as compact concentric chips above the footer links.
function FooterShell({ onNav }) {
  const linkStyle = {
    ...T.meta,
    color: C.inkSoft,
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    minHeight: 44,
    padding: "0 8px",
  };
  return (
    <footer
      className="apple-shell apple-shell-surface"
      style={{ padding: "20px clamp(20px, 3vw, 32px)" }}
    >
      <div
        aria-label="Also on this site"
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "10px",
          paddingBottom: 18,
          borderBottom: `1px solid ${C.rule}`,
        }}
      >
        <span style={{ ...T.eyebrow, marginRight: 6 }}>Also on this site</span>
        <button
          type="button"
          onClick={() => onNav("explorations")}
          className="apple-also-chip apple-chip"
        >
          Explorations / twenty visual essays
        </button>
        <button
          type="button"
          onClick={() => onNav("operator")}
          className="apple-also-chip apple-chip"
        >
          The Operator / field notes
        </button>
        <a
          href="https://enablement.alsharma.com"
          target="_blank"
          rel="noopener noreferrer"
          className="apple-also-chip apple-chip"
        >
          Enablement
        </a>
        <a
          href="https://darkvectorcognition.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="apple-also-chip apple-chip"
        >
          Dark Vector Cognition
        </a>
      </div>

      <div
        style={{
          paddingTop: 14,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "4px 20px",
        }}
      >
        <div style={T.meta}>{"\u00A9 2026 Al Sharma \u00B7 Built in Austin"}</div>
        <nav aria-label="Elsewhere" style={{ display: "flex", gap: "0 6px", flexWrap: "wrap" }}>
          <a
            href="https://www.linkedin.com/in/alsharma"
            target="_blank"
            rel="noopener noreferrer"
            className="apple-nav-link apple-pill"
            style={linkStyle}
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/kunalnano"
            target="_blank"
            rel="noopener noreferrer"
            className="apple-nav-link apple-pill"
            style={linkStyle}
          >
            GitHub
          </a>
          <a
            href="https://darkvectorcognition.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="apple-nav-link apple-pill"
            style={linkStyle}
          >
            DVC
          </a>
          <a
            href="https://enablement.alsharma.com"
            target="_blank"
            rel="noopener noreferrer"
            className="apple-nav-link apple-pill"
            style={linkStyle}
          >
            Enablement
          </a>
          <a
            href="mailto:hello@darkvectorcognition.ai"
            className="apple-nav-link apple-pill"
            style={linkStyle}
          >
            Email
          </a>
        </nav>
      </div>
    </footer>
  );
}

export default function Home({ onNavigate }) {
  const go = useCallback(
    (id) => {
      window.location.hash = id;
      onNavigate(id);
      window.scrollTo(0, 0);
    },
    [onNavigate]
  );

  useEffect(() => {
    const prevBody = document.body.style.background;
    const prevHtml = document.documentElement.style.background;
    document.body.style.background = C.bg;
    document.documentElement.style.background = C.bg;
    return () => {
      document.body.style.background = prevBody;
      document.documentElement.style.background = prevHtml;
    };
  }, []);

  return (
    <div
      style={{
        background: C.bg,
        color: C.ink,
        fontFamily: F.text,
        minHeight: "100vh",
      }}
    >
      <Nav onNav={go} />
      <div
        style={{
          maxWidth: L.max,
          margin: "0 auto",
          padding: `clamp(16px, 2.4vw, 28px) ${L.gutter} clamp(36px, 5vw, 56px)`,
          display: "flex",
          flexDirection: "column",
          gap: L.shellGap,
        }}
      >
        <main style={{ display: "flex", flexDirection: "column", gap: L.shellGap }}>
          <Hero onNav={go} />
          <ProofBar />
          <Thesis />
          <CareerStrip onNav={go} />
          <Built />
          <FinalCta onNav={go} />
        </main>
        <FooterShell onNav={go} />
      </div>
    </div>
  );
}
