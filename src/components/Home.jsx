import { useState, useEffect, useCallback } from "react";
import { C, F, L, T, pill, textLink, wordmark } from "../design.js";
import momentSample from "../assets/shipped/moment-sample.webp";
import quartermasterCapture from "../assets/shipped/quartermaster-desktop.webp";
const CAREER = [
  { co: "Port.io", role: "Head of Technical Success, Americas", yr: "2025 \u2014 Present", live: true },
  { co: "Harness", role: "Senior Technical Program Manager", yr: "2024 \u2014 2025" },
  { co: "Snyk", role: "Manager, Customer Solutions Group", yr: "2022 \u2014 2024" },
  { co: "HashiCorp", role: "Enterprise User Success Manager", yr: "2021" },
  { co: "Western Digital", role: "Staff Manager, Enterprise", yr: "2013 \u2014 2021" },
];

const pillFilled = pill.filled;
const pillGhost = pill.ghost;

// Hash is the router here, so same-page jumps scroll instead of setting it.
function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - L.navH;
  window.scrollTo({ top, behavior: "smooth" });
}

function useNarrow(maxWidth = 720) {
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

function Nav({ onNav }) {
  const narrow = useNarrow();
  const [open, setOpen] = useState(false);
  const drawerOpen = narrow && open;

  useEffect(() => {
    if (!drawerOpen) return undefined;
    const onKeyDown = (e) => { if (e["key"] === "Escape") setOpen(false); };
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

  const linkStyle = {
    color: C.inkMute, fontSize: 10, fontWeight: 500,
    letterSpacing: "0.14em", textTransform: "uppercase", cursor: "pointer",
    background: "none", border: "none", fontFamily: F.mono,
    padding: "0 2px", minHeight: 44, display: "inline-flex", alignItems: "center",
    textDecoration: "none", whiteSpace: "nowrap",
  };
  const rowStyle = {
    display: "grid", gridTemplateColumns: "34px 1fr", gap: "4px 8px", width: "100%",
    padding: "18px 0", background: "none", border: "none", textAlign: "left",
    borderBottom: `1px solid ${C.rule}`, cursor: "pointer", textDecoration: "none",
  };

  return (
    <nav aria-label="Primary" style={{
      position: "sticky", top: 0, zIndex: 50,
      backdropFilter: "blur(14px)",
      WebkitBackdropFilter: "blur(14px)",
      background: drawerOpen ? C.bg : "rgba(255,255,255,0.9)",
      borderBottom: `1px solid ${C.rule}`,
      height: L.navH,
    }}>
      <div style={{
        maxWidth: L.max, margin: "0 auto", padding: `0 ${L.gutter}`,
        height: "100%", display: "flex", alignItems: "center",
        justifyContent: "space-between", gap: 16,
      }}>
        <a href="/" aria-label="Al Sharma, home" style={wordmark}>Al Sharma</a>
        {narrow ? (
          <button
            type="button"
            aria-expanded={drawerOpen}
            aria-controls="site-drawer"
            onClick={() => setOpen((v) => !v)}
            style={{ ...linkStyle, color: C.ink, padding: "0 12px", minHeight: 40, border: `1px solid ${C.ruleStrong}` }}
          >{drawerOpen ? "Close" : "Menu"}</button>
        ) : (
          <div style={{ display: "flex", gap: "clamp(18px, 3vw, 40px)" }}>
            {items.map((it) => it.same ? (
              <button key={it.label} onClick={() => scrollToId(it.href.slice(1))} style={linkStyle}>{it.label}</button>
            ) : it.href ? (
              <a key={it.label} href={it.href} target="_blank" rel="noopener noreferrer" style={linkStyle}>{it.label}</a>
            ) : (
              <button key={it.label} onClick={it.run} style={linkStyle}>{it.label}</button>
            ))}
            <button onClick={contact} style={{ ...pill.filled, minHeight: 40, padding: "0 16px", fontSize: 10 }}>Get in touch</button>
          </div>
        )}
      </div>
      {drawerOpen && (
        <div id="site-drawer" style={{
          position: "absolute", top: L.navH, left: 0, right: 0,
          height: `calc(100dvh - ${L.navH}px)`,
          background: C.bg, padding: `8px ${L.gutter} 32px`, overflowY: "auto",
        }}>
          {items.map((it, i) => {
            const inner = (
              <>
                <span style={{ ...T.meta, gridRow: "1 / 3", paddingTop: 6 }}>{String(i + 1).padStart(2, "0")}</span>
                <strong style={{ fontFamily: F.display, fontWeight: 600, fontSize: 24, letterSpacing: "-0.03em", color: C.ink }}>{it.label}</strong>
                <em style={{ ...T.meta, fontStyle: "normal" }}>{it.note}</em>
              </>
            );
            return it.href && !it.same ? (
              <a key={it.label} href={it.href} target="_blank" rel="noopener noreferrer" style={rowStyle} onClick={() => setOpen(false)}>{inner}</a>
            ) : (
              <button key={it.label} type="button" style={rowStyle} onClick={() => {
                setOpen(false);
                if (it.same) scrollToId(it.href.slice(1)); else it.run();
              }}>{inner}</button>
            );
          })}
          <button type="button" onClick={() => { setOpen(false); contact(); }} style={{ ...pill.filled, width: "100%", marginTop: 24 }}>Get in touch</button>
        </div>
      )}
    </nav>
  );
}

function Hero({ onNav }) {
  return (
    <section style={{ background: C.bg, padding: `clamp(64px, 9vw, 128px) ${L.gutter} clamp(40px, 5vw, 64px)` }}>
      <div style={{ maxWidth: L.max, margin: "0 auto" }}>
        <p style={T.eyebrow}>{"Austin, Texas \u00B7 Post-sales leadership \u00B7 Builder"}</p>
        <h1 style={{ ...T.h1, margin: "22px 0 28px", fontSize: "clamp(58px, 10vw, 148px)" }}>Al Sharma.</h1>
        <div style={{
          display: "grid", gap: "clamp(20px, 4vw, 72px)", alignItems: "start",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 380px), 1fr))",
        }}>
          <p style={{
            fontFamily: F.display, fontWeight: 500,
            fontSize: "clamp(24px, 2.9vw, 38px)",
            lineHeight: 1.08, letterSpacing: "-0.035em",
            color: C.ink, margin: 0, maxWidth: 560,
          }}>Post-sales executive for developer platforms.</p>
          <div>
            <p style={{ ...T.lede, maxWidth: 620 }}>Fifteen years running customer success, support and services through developer-platform scale-ups &mdash; HashiCorp, Snyk, Harness &mdash; and now Technical Success for the Americas at Port. I build the AI agents I ask enterprise customers to adopt, and I ship them.</p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 32 }}>
              <button onClick={() => window.dispatchEvent(new CustomEvent("open-contact"))} style={pillFilled}>Get in touch <span aria-hidden="true">{"\u2192"}</span></button>
              <button onClick={() => onNav("resume")} style={pillGhost}>Read the r&eacute;sum&eacute;</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const PROOF = [
  { n: "$125M", l: "cumulative ARR book", sub: "developer platforms, AppSec, cloud infra" },
  { n: "135%+", l: "net revenue retention", sub: "Snyk enterprise portfolio, 2022\u20132024" },
  { n: "12+", l: "technical CSMs hired & developed", sub: "career frameworks, enablement, $100M+ book" },
  { n: "3", l: "post-sales orgs built or rebuilt", sub: "Snyk \u00B7 Harness \u00B7 Port" },
];

function ProofBar() {
  return (
    <section aria-label="Track record" style={{ background: C.bg, borderBlock: `1px solid ${C.rule}` }}>
      <div style={{
        maxWidth: L.max, margin: "0 auto", padding: `0 ${L.gutter}`,
      }}>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
          gap: 1, background: C.rule, borderInline: `1px solid ${C.rule}`,
        }}>
          {PROOF.map((p) => (
            <div key={p.l} style={{ background: C.bg, padding: "30px clamp(18px, 2.4vw, 30px) 32px" }}>
              <div style={{
                fontFamily: F.display, fontWeight: 600, fontSize: "clamp(36px, 4vw, 52px)",
                letterSpacing: "-0.045em", lineHeight: 1, color: C.ink, fontVariantNumeric: "tabular-nums",
              }}>{p.n}</div>
              <div style={{ fontFamily: F.text, fontSize: 16, color: C.ink, marginTop: 14 }}>{p.l}</div>
              <div style={{ ...T.meta, marginTop: 8 }}>{p.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Two-column section head: eyebrow + title left, supporting copy right.
function SectionHead({ eyebrow, title, children }) {
  return (
    <div style={{
      display: "grid", gap: "clamp(20px, 4vw, 72px)", alignItems: "end",
      gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 380px), 1fr))",
      marginBottom: "clamp(36px, 4.5vw, 60px)",
    }}>
      <div>
        <p style={T.eyebrow}>{eyebrow}</p>
        <h2 style={{ ...T.h2, marginTop: 16 }}>{title}</h2>
      </div>
      {children ? <p style={{ ...T.body, maxWidth: 520 }}>{children}</p> : null}
    </div>
  );
}

const THESES = [
  { k: "01", t: "Agents dissolve absorbed complexity.", b: "Any product whose moat is \u201Cwe aggregate context so you don\u2019t have to\u201D is exposed the moment agents do that aggregation natively. Post-sales has to sell outcomes the agent can\u2019t reach on its own, or it is selling a shrinking asset." },
  { k: "02", t: "Telemetry is the durable layer.", b: "Agents generate data; they don\u2019t replace it. Observability, audit and evidence get structurally safer as workflows go agent-native \u2014 so that is where a post-sales org should anchor its value and its renewals." },
  { k: "03", t: "Security has to stay a third party.", b: "Codegen vendors can\u2019t credibly police their own output. An agnostic layer has to do it \u2014 which is why the customer-engineering motion around AI security is a leadership job, not a support queue." },
];

function Thesis() {
  return (
    <section id="thesis" style={{ background: C.bgSoft, padding: `${L.section} ${L.gutter}` }}>
      <div style={{ maxWidth: L.max, margin: "0 auto" }}>
        <SectionHead eyebrow="Operating thesis" title="What changes about post-sales when the customer is an agent." />
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
          gap: 1, background: C.ruleStrong, border: `1px solid ${C.ruleStrong}`,
        }}>
          {THESES.map((x) => (
            <article key={x.k} style={{ background: C.bgSoft, padding: "clamp(26px, 3vw, 36px)" }}>
              <p style={T.meta}>{x.k}</p>
              <h3 style={{ ...T.h3, margin: "clamp(40px, 5vw, 72px) 0 14px" }}>{x.t}</h3>
              <p style={{ ...T.small, fontSize: 16 }}>{x.b}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const FEATURED_WORK = [
  {
    name: "Moment", category: "Apple application",
    what: "A calm place for the next visible move.",
    decision: "Keep the day in view, without turning it into another dashboard to manage.",
    href: "https://apps.apple.com/us/app/id6779027217",
    image: momentSample, width: 1600, height: 900,
    alt: "Existing Moment sample view showing weather and a follow-through board",
    caption: "Moment · Existing sample view", background: "#090909", fit: "cover",
  },
  {
    name: "QuarterMaster", category: "Editorial guidance",
    what: "The room decides the kit.",
    decision: "Start with where someone is going, then help them choose what belongs there.",
    href: "https://quartermaster.style",
    image: quartermasterCapture, width: 2880, height: 1800,
    alt: "Existing QuarterMaster homepage capture with its field manual and work-dinner scene",
    caption: "QuarterMaster · Existing product capture", background: "#201208", fit: "contain",
  },
];

function Built() {
  const narrow = useNarrow(760);
  return (
    <section id="shipped" style={{ background: C.bgSoft, borderTop: `1px solid ${C.rule}`, padding: `clamp(48px, 5.6vw, 80px) ${L.gutter} 72px` }}>
      <div style={{ maxWidth: L.max, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: narrow ? "1fr" : "1fr 1fr", gap: narrow ? 20 : 72, alignItems: "end", marginBottom: narrow ? 32 : 52 }}>
          <h2 style={{ ...T.h2, fontSize: "clamp(38px, 4.5vw, 64px)", lineHeight: 1.02, letterSpacing: "-0.04em" }}>The executive<br />who also builds.</h2>
          <p style={{ ...T.body, fontSize: narrow ? 17 : 18, maxWidth: 460 }}>Products from Dark Vector Cognition. Different problems, carried through to something you can use.</p>
        </div>
        {FEATURED_WORK.map((work, i) => (
          <article key={work.name} style={{ display: "grid", gridTemplateColumns: narrow ? "1fr" : i === 0 ? "5fr 7fr" : "7fr 5fr", gap: narrow ? 24 : 64, alignItems: "center", borderTop: `1px solid ${C.rule}`, padding: narrow ? "28px 0 36px" : "40px 0 48px" }}>
            <figure style={{ margin: 0, minWidth: 0, order: narrow || i === 1 ? 0 : 1 }}>
              <div style={{ height: narrow ? 315 : 380, background: work.background, overflow: "hidden" }}>
                <img src={work.image} alt={work.alt} width={work.width} height={work.height} loading="lazy" decoding="async" style={{ display: "block", width: "100%", height: "100%", objectFit: work.fit }} />
              </div>
              <figcaption style={{ ...T.meta, fontSize: 11, paddingTop: 10 }}>{work.caption}</figcaption>
            </figure>
            <div style={{ minWidth: 0, order: narrow || i === 1 ? 1 : 0 }}>
              <p style={{ ...T.meta, marginBottom: 18 }}>{work.category}</p>
              <h3 style={{ ...T.h3, fontSize: narrow ? 32 : 38, lineHeight: 1.1, letterSpacing: "-0.035em", overflowWrap: "anywhere" }}>{work.name}</h3>
              <p style={{ ...T.body, fontSize: narrow ? 17 : 18, maxWidth: "43ch", marginTop: 16 }}>{work.what}</p>
              <p style={{ borderTop: `1px solid ${C.rule}`, margin: `${narrow ? 20 : 28}px 0 0`, paddingTop: 18, fontSize: 15, lineHeight: 1.6, maxWidth: "44ch" }}>
                <span style={{ ...T.meta, display: "block", marginBottom: 6 }}>The product decision</span>
                {work.decision}
              </p>
              <a href={work.href} target="_blank" rel="noopener noreferrer" style={{ ...textLink, marginTop: 18, gap: 12 }}>Explore {work.name} <span aria-hidden="true" style={{ fontSize: 17 }}>{"\u2197"}</span></a>
            </div>
          </article>
        ))}
        <div style={{ display: "grid", gridTemplateColumns: narrow ? "1fr" : "1fr 1fr", gap: narrow ? 26 : 36, borderTop: `1px solid ${C.rule}`, paddingTop: 26 }}>
          <div>
            <h3 style={{ ...T.h3, fontSize: 22 }}>Witness</h3>
            <p style={{ ...T.small, fontSize: 14, maxWidth: "48ch" }}>Software that makes agent activity inspectable.</p>
            <a href="https://github.com/dark-vector-cognition/witness" target="_blank" rel="noopener noreferrer" style={{ ...textLink, marginTop: 6, gap: 12 }}>View the project <span aria-hidden="true" style={{ fontSize: 17 }}>{"\u2197"}</span></a>
          </div>
          <div>
            <h3 style={{ ...T.h3, fontSize: 22 }}>Earlier advisory work</h3>
            <p style={{ ...T.small, fontSize: 14, maxWidth: "48ch" }}>Agent Flight Check. A previous offer, shown here as part of the work rather than a current service.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function FinalCta({ onNav }) {
  return (
    <section style={{ background: C.bg, borderTop: `1px solid ${C.rule}`, padding: `${L.section} ${L.gutter}`, textAlign: "center" }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <p style={T.eyebrow}>{"Austin, Texas \u00B7 Replies within 24 hours"}</p>
        <h2 style={{ ...T.h2, margin: "18px 0 22px" }}>Building or rebuilding a post-sales org?</h2>
        <p style={{ ...T.body, maxWidth: 620, margin: "0 auto 32px" }}>Customer success, support and services for developer platforms, run by someone who also ships the agents.</p>
        <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
          <button onClick={() => window.dispatchEvent(new CustomEvent("open-contact"))} style={pillFilled}>Get in touch <span aria-hidden="true">{"\u2192"}</span></button>
          <button onClick={() => onNav("resume")} style={pillGhost}>Read the r&eacute;sum&eacute;</button>
        </div>
      </div>
    </section>
  );
}

// Demoted, not deleted: everything that is not the executive profile gets
// one line here. No images, no big headings.
function AlsoStrip({ onNav }) {
  const item = { ...T.meta, color: C.ink, display: "inline-flex", alignItems: "center", minHeight: 44, background: "none", border: "none", padding: 0, cursor: "pointer", textDecoration: "none" };
  return (
    <section aria-label="Also on this site" style={{ background: C.bg, borderTop: `1px solid ${C.rule}`, padding: `14px ${L.gutter}` }}>
      <div style={{ maxWidth: L.max, margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0 28px" }}>
        <span style={T.meta}>Also on this site</span>
        <button onClick={() => onNav("explorations")} style={item}>Explorations / twenty visual essays</button>
        <button onClick={() => onNav("operator")} style={item}>The Operator / field notes</button>
        <a href="https://enablement.alsharma.com" target="_blank" rel="noopener noreferrer" style={item}>Enablement</a>
        <a href="https://darkvectorcognition.ai" target="_blank" rel="noopener noreferrer" style={item}>Dark Vector Cognition</a>
      </div>
    </section>
  );
}

function CareerStrip({ onNav }) {
  return (
    <section style={{ background: C.bg, padding: `${L.section} ${L.gutter}` }}>
      <div style={{ maxWidth: L.max, margin: "0 auto" }}>
        <SectionHead eyebrow="Career" title="The arc." />
        <div style={{ borderTop: `1px solid ${C.ruleStrong}` }}>
          {CAREER.map((c) => (
            <div key={c.co} style={{
              display: "grid", alignItems: "baseline", gap: "6px 24px",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))",
              padding: "20px 0", borderBottom: `1px solid ${C.rule}`,
            }}>
              <div style={{
                fontFamily: F.display, fontWeight: 600, fontSize: 20,
                color: C.ink, letterSpacing: "-0.02em",
              }}>{c.co}
                {c.live && (
                  <span title="Current" style={{
                    display: "inline-block", marginLeft: 10, width: 7, height: 7,
                    background: C.live, verticalAlign: "middle",
                  }} />
                )}
              </div>
              <div style={{ color: C.inkSoft, fontSize: 16, fontFamily: F.text }}>{c.role}</div>
              <div style={{ ...T.meta, fontSize: 11 }}>{c.yr}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 24 }}>
          <button onClick={() => onNav("resume")} style={textLink}>{"Full r\u00E9sum\u00E9 \u2192"}</button>
        </div>
      </div>
    </section>
  );
}

function FooterStrip() {
  const linkStyle = {
    ...T.meta, textDecoration: "none",
    display: "inline-flex", alignItems: "center", minHeight: 44,
  };
  return (
    <footer style={{ background: C.bg, borderTop: `1px solid ${C.rule}` }}>
      <div style={{
        maxWidth: L.max, margin: "0 auto", padding: `22px ${L.gutter}`,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: "4px 24px",
      }}>
        <div style={T.meta}>{"\u00A9 2026 Al Sharma \u00B7 Built in Austin"}</div>
        <nav aria-label="Elsewhere" style={{ display: "flex", gap: "0 22px", flexWrap: "wrap" }}>
          <a href="https://www.linkedin.com/in/alsharma" target="_blank" rel="noopener noreferrer" style={linkStyle}>LinkedIn</a>
          <a href="https://github.com/kunalnano" target="_blank" rel="noopener noreferrer" style={linkStyle}>GitHub</a>
          <a href="https://darkvectorcognition.ai" target="_blank" rel="noopener noreferrer" style={linkStyle}>DVC</a>
          <a href="https://enablement.alsharma.com" target="_blank" rel="noopener noreferrer" style={linkStyle}>Enablement</a>
          <a href="mailto:hello@darkvectorcognition.ai" style={linkStyle}>Email</a>
        </nav>
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
      <ProofBar />
      <Thesis />
      <CareerStrip onNav={go} />
      <Built />
      <FinalCta onNav={go} />
      <AlsoStrip onNav={go} />
      <FooterStrip />
    </div>
  );
}
