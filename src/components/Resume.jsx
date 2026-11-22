import { useState, useEffect, useRef } from "react";
import { C, F, L, T } from "../design.js";

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function useReveal(threshold = 0.01) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(prefersReducedMotion);
  useEffect(() => {
    if (visible) return undefined;
    const el = ref.current;
    if (!el) return undefined;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold, rootMargin: "0px 0px 140px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold, visible]);
  return [ref, visible];
}

function Reveal({ children, delay = 0, style }) {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

const CAPABILITIES = [
  "CS function design and revenue ops",
  "NRR and GRR ownership at scale",
  "Adoption frameworks and health scoring",
  "Executive stakeholder engagement",
  "Enterprise account strategy",
  "Cross-functional GTM alignment",
  "Team building and talent architecture",
  "Platform engineering and DevSecOps",
  "AI-native CS workflows",
  "Escalation and risk management",
];

const EXPERIENCE = [
  {
    title: "Head of Technical Success Managers, AMER",
    company: "Port.io",
    period: "Aug 2025 - Present",
    context: "Series C Internal Developer Platform",
    live: true,
    bullets: [
      "Designed and stood up the Americas Technical Success Management practice from scratch: defined roles, hiring profiles, operating cadence, and the enterprise engagement model across a Fortune 500 portfolio spanning financial services, telecom, and professional services.",
      "Created a three-pillar implementation methodology adopted as the company-wide post-sales delivery standard, reducing onboarding friction and accelerating time-to-first-value.",
      "Prevented churn on multiple at-risk enterprise accounts through structured risk intervention, secured multi-year renewals, and drove expansion across LATAM and North America portfolios.",
      "Built MCP-based knowledge integrations, AI-assisted escalation triage, and agentic engagement patterns across CS workflows to improve team leverage and proactive customer management.",
      "Led structured field intelligence initiatives surfacing platform gaps directly to CEO and VP R&D, driving roadmap commitments on scalability and release governance.",
    ],
  },
  {
    title: "Senior Technical Program Manager",
    company: "Harness",
    period: "Jun 2024 - Sep 2025",
    context: "CI/CD and Software Delivery Platform (Series D)",
    bullets: [
      "Individually managed 7 of Harness\u2019s largest enterprise relationships totaling $45M+ ARR, driving adoption of Kubernetes-based delivery pipelines and advanced deployment strategies.",
      "Oversaw post-sales delivery standards across Professional Services, Solutions Architects, Product, Support, and Partner channels.",
      "Partnered directly with product and engineering to align platform capabilities with enterprise requirements.",
    ],
  },
  {
    title: "Manager, Technical Customer Success",
    company: "Harness",
    period: "Oct 2023 - Jul 2024",
    context: "CI/CD and Software Delivery Platform (Series D)",
    bullets: [
      "Led growth and adoption initiatives for strategic accounts through cross-functional customer engagement.",
      "Guided enterprise teams through secure CI/CD adoption, application security programs, and risk management.",
    ],
  },
  {
    title: "Sr. Manager, Technical Success - Strategic Accounts",
    company: "Snyk",
    period: "Sep 2021 - Nov 2023",
    context: "Application Security Leader (Series F)",
    bullets: [
      "Led implementation and adoption of cloud-native application security for strategic accounts.",
      "Advised enterprise teams on secure software development and vulnerability management, and brought adoption feedback to product teams.",
    ],
  },
  {
    title: "Manager, Customer Solutions Group",
    company: "Snyk",
    period: "Feb 2023 - Sep 2023",
    context: "Application Security Leader (Series F)",
    bullets: [
      "Hired and developed a team of 12+ Technical CSMs managing a $100M+ ARR enterprise portfolio. Designed career frameworks and enablement programs.",
      "Repositioned CS as a revenue contributor through cross-functional collaboration. Maintained 135%+ net revenue retention across the enterprise portfolio.",
      "Streamlined onboarding, implementation, and adoption processes to measurably improve time-to-value and long-term retention.",
    ],
  },
  {
    title: "Enterprise User Success Manager",
    company: "HashiCorp",
    period: "Jan 2021 - Sep 2021",
    context: "Cloud Infrastructure Automation (Pre-IPO)",
    bullets: [
      "Guided enterprise teams through cloud operating model adoption: infrastructure-as-code, secrets management, and service mesh.",
      "Served as technical bridge between customer platform teams and HashiCorp product engineering.",
    ],
  },
  {
    title: "Staff Enterprise TAM",
    company: "Western Digital",
    period: "Apr 2013 - Jan 2021",
    context: "Fortune 200 Data Infrastructure ($16B Revenue)",
    bullets: [
      "Led cross-functional teams of engineers, researchers, and technicians. Built performance frameworks driving sustained productivity and high talent retention.",
      "Led global quality audits achieving full compliance across departments and geographies.",
    ],
  },
  {
    title: "Business Development Consultant",
    company: "Element Energy",
    period: "Jan 2010 - Jul 2012",
    context: "Renewable Energy",
    bullets: [
      "Led business development and market entry for solar and other renewable energy projects in India and Southeast Asia.",
      "Supported solar product registration, testing and compliance, and helped develop a 5 kW hybrid wind-solar system.",
    ],
  },
];

const EDUCATION = [
  { degree: "MS, Materials Engineering", school: "San Jose State University" },
  { degree: "B.Tech, Mechanical Engineering", school: "MIT Pune, India" },
];

const CERTS = [
  "Terraform Associate",
  "Vault Associate",
  "Certified Kubernetes Administrator",
  "Snyk AppSec",
  "Harness CD Architect",
  "Deep Learning / Neural Networks",
];

function TimelineRole({ role, index, last }) {
  const [ref, visible] = useReveal(0.05);
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${Math.min(index * 0.05, 0.25)}s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${Math.min(index * 0.05, 0.25)}s`,
        position: "relative",
        paddingLeft: 32,
        paddingBottom: last ? 0 : 18,
      }}
    >
      {!last && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: 6,
            top: 24,
            bottom: 0,
            width: 2,
            background: C.ruleStrong,
            borderRadius: 999,
          }}
        />
      )}

      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: 0,
          top: 18,
          width: 14,
          height: 14,
          borderRadius: "50%",
          border: `2px solid ${role.live ? C.blue : C.controlBorder}`,
          background: C.surface,
        }}
      >
        {role.live && (
          <div
            style={{
              position: "absolute",
              top: 2,
              left: 2,
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: C.live,
            }}
          />
        )}
      </div>

      <article
        className="apple-card"
        style={{
          background: C.tray,
          border: `1px solid ${C.rule}`,
          padding: "clamp(20px, 2.5vw, 28px)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
            marginBottom: 10,
          }}
        >
          <span
            className="apple-chip"
            style={{
              padding: "4px 10px",
              background: C.surface,
              border: `1px solid ${C.rule}`,
              fontFamily: F.mono,
              fontSize: 11,
              fontWeight: 500,
              color: role.live ? C.link : C.inkMute,
            }}
          >
            {role.period}
          </span>
          <span style={{ ...T.meta, fontSize: 13 }}>{role.context}</span>
        </div>

        <h3
          style={{
            fontFamily: F.display,
            fontSize: "clamp(20px, 2.2vw, 23px)",
            fontWeight: 600,
            letterSpacing: "-0.022em",
            color: C.ink,
            margin: "0 0 4px",
            lineHeight: 1.2,
          }}
        >
          {role.title}
        </h3>

        <div
          style={{
            fontFamily: F.text,
            fontSize: 16,
            color: C.inkSoft,
            marginBottom: 16,
            fontWeight: 500,
          }}
        >
          {role.company}
        </div>

        <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10, margin: 0, padding: 0 }}>
          {role.bullets.map((bullet, j) => (
            <li
              key={j}
              style={{
                fontFamily: F.text,
                fontSize: 15,
                lineHeight: 1.56,
                color: C.inkSoft,
                paddingLeft: 16,
                position: "relative",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: 0,
                  top: "0.58em",
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: role.live ? C.blue : C.inkMute,
                }}
              />
              {bullet}
            </li>
          ))}
        </ul>
      </article>
    </div>
  );
}

export default function Resume() {
  return (
    <div
      style={{
        background: C.bg,
        color: C.ink,
        fontFamily: F.text,
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          maxWidth: L.max,
          margin: "0 auto",
          padding: `clamp(18px, 2.6vw, 30px) ${L.gutter} clamp(36px, 5vw, 56px)`,
          display: "flex",
          flexDirection: "column",
          gap: L.shellGap,
        }}
      >
        <main style={{ display: "flex", flexDirection: "column", gap: L.shellGap }}>
          {/* Hero Shell */}
          <section
            className="apple-shell apple-shell-surface"
            style={{ padding: `clamp(30px, 5vw, 60px) clamp(24px, 4.5vw, 52px)` }}
          >
            <span
              className="apple-chip"
              style={{
                display: "inline-flex",
                padding: "6px 12px",
                background: C.tray,
                border: `1px solid ${C.rule}`,
                ...T.eyebrow,
                marginBottom: 20,
              }}
            >
              Curriculum vit&aelig;
            </span>
            <h1 style={{ ...T.h1, margin: "0 0 18px" }}>Al Sharma.</h1>
            <p
              style={{
                fontFamily: F.display,
                fontWeight: 600,
                fontSize: "clamp(22px, 2.6vw, 32px)",
                lineHeight: 1.12,
                letterSpacing: "-0.028em",
                color: C.ink,
                maxWidth: 720,
                margin: "0 0 14px",
              }}
            >
              Post-sales executive for developer platforms.
            </p>
            <p
              style={{
                ...T.lede,
                maxWidth: 660,
                margin: "0 0 26px",
              }}
            >
              15+ years building post-sales organizations that protect and grow
              revenue. Cumulative book exceeding $125M ARR across developer
              platforms, application security, and cloud infrastructure.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <span
                className="apple-chip"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  minHeight: 44,
                  padding: "0 14px",
                  background: C.tray,
                  border: `1px solid ${C.rule}`,
                  fontSize: 14,
                  fontWeight: 500,
                  color: C.inkSoft,
                }}
              >
                Austin, TX
              </span>
              <a
                href="https://www.linkedin.com/in/alsharma"
                target="_blank"
                rel="noopener noreferrer"
                className="apple-also-chip apple-chip"
                style={{ color: C.link, fontSize: 14 }}
              >
                linkedin.com/in/alsharma
              </a>
              <a
                href="mailto:hello@darkvectorcognition.ai"
                className="apple-also-chip apple-chip"
                style={{ color: C.link, fontSize: 14 }}
              >
                hello@darkvectorcognition.ai
              </a>
            </div>
          </section>

          {/* Capabilities Shell */}
          <section
            className="apple-shell apple-shell-surface"
            style={{ padding: `${L.shellPad}` }}
          >
            <Reveal>
              <p style={{ ...T.eyebrow, marginBottom: 12 }}>Signature capabilities</p>
              <h2 style={{ ...T.h2, marginBottom: "clamp(26px, 3.5vw, 42px)" }}>
                What I bring to the room.
              </h2>
            </Reveal>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
                gap: 12,
              }}
            >
              {CAPABILITIES.map((cap, i) => (
                <Reveal key={cap} delay={Math.min(i * 0.02, 0.16)}>
                  <div
                    className="apple-control"
                    style={{
                      background: C.tray,
                      border: `1px solid ${C.rule}`,
                      padding: "16px 18px",
                      fontFamily: F.text,
                      fontSize: 15,
                      fontWeight: 500,
                      color: C.ink,
                      lineHeight: 1.4,
                      height: "100%",
                    }}
                  >
                    {cap}
                  </div>
                </Reveal>
              ))}
            </div>
          </section>

          {/* Experience Shell */}
          <section
            className="apple-shell apple-shell-surface"
            style={{ padding: `${L.shellPad}` }}
          >
            <div style={{ maxWidth: 860, margin: "0 auto" }}>
              <Reveal>
                <p style={{ ...T.eyebrow, marginBottom: 12 }}>Experience</p>
                <h2 style={{ ...T.h2, marginBottom: "clamp(28px, 3.8vw, 44px)" }}>The arc.</h2>
              </Reveal>
              <div>
                {EXPERIENCE.map((role, i) => (
                  <TimelineRole
                    key={`${role.company}-${role.title}`}
                    role={role}
                    index={i}
                    last={i === EXPERIENCE.length - 1}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Education + Credentials Shell */}
          <section
            className="apple-shell apple-shell-surface"
            style={{ padding: 14 }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
                gap: 14,
              }}
            >
              <Reveal>
                <div
                  className="apple-media"
                  style={{
                    background: C.tray,
                    border: `1px solid ${C.rule}`,
                    padding: "clamp(22px, 2.6vw, 28px)",
                    height: "100%",
                  }}
                >
                  <p style={{ ...T.eyebrow, marginBottom: 18 }}>Education</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {EDUCATION.map((edu, idx) => (
                      <div
                        key={edu.degree}
                        style={{
                          paddingBottom: idx === EDUCATION.length - 1 ? 0 : 16,
                          borderBottom:
                            idx === EDUCATION.length - 1 ? "none" : `1px solid ${C.rule}`,
                        }}
                      >
                        <div
                          style={{
                            fontFamily: F.display,
                            fontSize: 18,
                            fontWeight: 600,
                            color: C.ink,
                            letterSpacing: "-0.018em",
                            marginBottom: 4,
                          }}
                        >
                          {edu.degree}
                        </div>
                        <div style={{ fontFamily: F.text, fontSize: 15, color: C.inkSoft }}>
                          {edu.school}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
              <Reveal delay={0.08}>
                <div
                  className="apple-media"
                  style={{
                    background: C.tray,
                    border: `1px solid ${C.rule}`,
                    padding: "clamp(22px, 2.6vw, 28px)",
                    height: "100%",
                  }}
                >
                  <p style={{ ...T.eyebrow, marginBottom: 18 }}>Credentials</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                    {CERTS.map((cert) => (
                      <div
                        key={cert}
                        className="apple-chip"
                        style={{
                          background: C.surface,
                          border: `1px solid ${C.rule}`,
                          padding: "9px 14px",
                          fontFamily: F.text,
                          fontSize: 13,
                          fontWeight: 500,
                          color: C.ink,
                          letterSpacing: "-0.008em",
                        }}
                      >
                        {cert}
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          </section>

          {/* AI Systems Apple Pro Dark Shell */}
          <section
            className="apple-shell apple-shell-dark apple-dark-surface"
            style={{
              padding: `clamp(44px, 6vw, 80px) clamp(24px, 4.5vw, 56px)`,
              textAlign: "center",
            }}
          >
            <div style={{ maxWidth: 820, margin: "0 auto" }}>
              <Reveal>
                <p
                  style={{
                    fontFamily: F.text,
                    fontSize: 12,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: C.darkBlue,
                    margin: "0 0 18px",
                    fontWeight: 600,
                  }}
                >
                  AI systems and technical depth
                </p>
                <h2
                  style={{
                    fontFamily: F.display,
                    fontWeight: 600,
                    fontSize: "clamp(30px, 4.2vw, 48px)",
                    lineHeight: 1.08,
                    letterSpacing: "-0.03em",
                    margin: "0 0 18px",
                    color: C.darkInk,
                  }}
                >
                  I build the agents I&apos;d want enterprises to use.
                </h2>
                <p
                  style={{
                    fontFamily: F.text,
                    fontWeight: 400,
                    fontSize: "clamp(18px, 2vw, 23px)",
                    lineHeight: 1.45,
                    letterSpacing: "-0.014em",
                    color: C.darkInkMute,
                    margin: "0 auto",
                    maxWidth: 680,
                  }}
                >
                  MCP-based knowledge systems, agentic AI workflows, local LLM
                  evaluation environments, and multi-agent orchestration patterns
                  for post-sales teams.
                </p>
              </Reveal>
            </div>
          </section>
        </main>

        {/* Footer Shell */}
        <footer
          className="apple-shell apple-shell-surface"
          style={{
            padding: "20px 24px",
            fontFamily: F.text,
            fontSize: 13,
            color: C.inkMute,
            textAlign: "center",
          }}
        >
          {"\u00A9 2026 Al Sharma. Built in Austin."}
        </footer>
      </div>
    </div>
  );
}
