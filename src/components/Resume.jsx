import { useState, useEffect, useRef } from "react";
import { C, F, T } from "../design.js";

// ── Scroll reveal ──
function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function Reveal({ children, delay = 0, style }) {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `all 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
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
    title: "Head of Technical Success, AMER",
    company: "Port.io",
    period: "Aug 2025 — Present",
    context: "Series C Internal Developer Platform",
    accent: C.accent,
    live: true,
    bullets: [
      "Designed and stood up the Americas Technical Success Management practice from scratch — defined roles, hiring profiles, operating cadence, and the enterprise engagement model across a Fortune 500 portfolio spanning financial services, telecom, and professional services.",
      "Created a three-pillar implementation methodology adopted as the company-wide post-sales delivery standard, reducing onboarding friction and accelerating time-to-first-value.",
      "Prevented churn on multiple at-risk enterprise accounts through structured risk intervention, secured multi-year renewals, and drove expansion across LATAM and North America portfolios.",
      "Built MCP-based knowledge integrations, AI-assisted escalation triage, and agentic engagement patterns across CS workflows to improve team leverage and proactive customer management.",
      "Led structured field intelligence initiatives surfacing platform gaps directly to CEO and VP R&D, driving roadmap commitments on scalability and release governance.",
    ],
  },
  {
    title: "Sr. Technical Program Manager / Manager, CS",
    company: "Harness",
    period: "2021 — 2022, 2024 — 2025",
    context: "CI/CD and Software Delivery Platform (Series D)",
    accent: C.accent,
    bullets: [
      "Individually managed 7 of Harness’s largest enterprise relationships totaling $45M+ ARR, driving adoption of Kubernetes-based delivery pipelines and advanced deployment strategies.",
      "Oversaw post-sales delivery standards across Professional Services, Solutions Architects, Product, Support, and Partner channels.",
      "Partnered directly with product and engineering to align platform capabilities with enterprise requirements.",
    ],
  },
  {
    title: "Sr. Manager, Customer Solutions",
    company: "Snyk",
    period: "Apr 2022 — Jun 2024",
    context: "Application Security Leader (Series F)",
    accent: C.accent,
    bullets: [
      "Hired and developed a team of 12+ Technical CSMs managing a $100M+ ARR enterprise portfolio. Designed career frameworks and enablement programs.",
      "Repositioned CS as a revenue contributor through cross-functional collaboration. Maintained 135%+ net revenue retention across the enterprise portfolio.",
      "Streamlined onboarding, implementation, and adoption processes to measurably improve time-to-value and long-term retention.",
    ],
  },
  {
    title: "User Success Manager",
    company: "HashiCorp",
    period: "Jan 2021 — Sep 2021",
    context: "Cloud Infrastructure Automation (Pre-IPO)",
    accent: C.accent,
    bullets: [
      "Guided enterprise teams through cloud operating model adoption — infrastructure-as-code, secrets management, and service mesh.",
      "Served as technical bridge between customer platform teams and HashiCorp product engineering.",
    ],
  },
  {
    title: "Staff Manager, Enterprise Technical Accounts",
    company: "Western Digital",
    period: "Mar 2013 — Jan 2021",
    context: "Fortune 200 Data Infrastructure ($16B Revenue)",
    accent: C.accent,
    bullets: [
      "Led cross-functional teams of engineers, researchers, and technicians. Built performance frameworks driving sustained productivity and high talent retention.",
      "Led global quality audits achieving full compliance across departments and geographies.",
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
  const [ref, visible] = useReveal(0.1);
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `all 0.8s cubic-bezier(0.16,1,0.3,1) ${index * 0.08}s`,
        position: "relative",
        paddingLeft: 40,
        paddingBottom: last ? 0 : 48,
      }}
    >
      {/* Timeline line */}
      {!last && (
        <div
          style={{
            position: "absolute",
            left: 6,
            top: 18,
            bottom: 16,
            width: 1,
            background: C.rule,
          }}
        />
      )}

      {/* Timeline dot */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 10,
          width: 13,
          height: 13,
          borderRadius: "50%",
          border: `2px solid ${role.accent}`,
          background: C.bg,
        }}
      >
        {role.live && (
          <div
            style={{
              position: "absolute",
              top: 2,
              left: 2,
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: C.live,
            }}
          />
        )}
      </div>

      {/* Period */}
      <div style={{ ...T.eyebrow, marginBottom: 8 }}>{role.period}</div>

      {/* Title */}
      <div
        style={{
          fontFamily: F.display,
          fontSize: 22,
          fontWeight: 600,
          letterSpacing: "-0.022em",
          color: C.ink,
          marginBottom: 4,
          lineHeight: 1.2,
        }}
      >
        {role.title}
      </div>

      {/* Company */}
      <div
        style={{
          fontFamily: F.text,
          fontSize: 16,
          color: C.ink,
          marginBottom: 2,
          letterSpacing: "-0.01em",
          fontWeight: 500,
        }}
      >
        {role.company}
      </div>

      {/* Context */}
      <div
        style={{
          fontFamily: F.text,
          fontSize: 14,
          color: C.inkMute,
          marginBottom: 18,
          letterSpacing: "-0.008em",
        }}
      >
        {role.context}
      </div>

      {/* Bullets */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {role.bullets.map((bullet, j) => (
          <div
            key={j}
            style={{
              fontFamily: F.text,
              fontSize: 15,
              lineHeight: 1.55,
              color: C.inkSoft,
              letterSpacing: "-0.008em",
              paddingLeft: 14,
              position: "relative",
            }}
          >
            <span
              style={{
                position: "absolute",
                left: 0,
                top: "0.55em",
                width: 4,
                height: 4,
                borderRadius: "50%",
                background: role.accent,
              }}
            />
            {bullet}
          </div>
        ))}
      </div>
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
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
      }}
    >
      {/* ── Hero ── */}
      <section
        style={{
          padding: "96px 22px 64px",
          maxWidth: 880,
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <p style={{ ...T.eyebrow, marginBottom: 20 }}>Curriculum vitæ</p>
        <h1
          style={{
            fontFamily: F.display,
            fontWeight: 600,
            fontSize: "clamp(48px, 8vw, 96px)",
            lineHeight: 1.02,
            letterSpacing: "-0.045em",
            color: C.ink,
            margin: "0 0 14px",
          }}
        >
          Al Sharma.
        </h1>
        <p
          style={{
            fontFamily: F.display,
            fontWeight: 400,
            fontSize: "clamp(22px, 2.6vw, 30px)",
            lineHeight: 1.22,
            letterSpacing: "-0.022em",
            color: C.ink,
            maxWidth: 720,
            margin: "0 auto 12px",
          }}
        >
          Post-sales strategy for AI-native software.
        </p>
        <p
          style={{
            fontFamily: F.text,
            fontSize: 18,
            color: C.inkSoft,
            letterSpacing: "-0.012em",
            maxWidth: 640,
            margin: "0 auto 28px",
            lineHeight: 1.5,
          }}
        >
          15+ years building post-sales organizations that protect and grow
          revenue. Cumulative book exceeding $125M ARR across developer
          platforms, application security, and cloud infrastructure.
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 24,
            flexWrap: "wrap",
            fontFamily: F.text,
            fontSize: 14,
            color: C.inkMute,
            letterSpacing: "-0.008em",
          }}
        >
          <span>Austin, TX</span>
          <span aria-hidden="true">·</span>
          <a
            href="https://www.linkedin.com/in/alsharma"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: C.link, textDecoration: "none" }}
          >
            linkedin.com/in/alsharma
          </a>
          <span aria-hidden="true">·</span>
          <a
            href="mailto:hello@darkvectorcognition.ai"
            style={{ color: C.link, textDecoration: "none" }}
          >
            hello@darkvectorcognition.ai
          </a>
        </div>
      </section>

      {/* ── Capabilities ── */}
      <section style={{ background: C.bgSoft, padding: "80px 22px" }}>
        <div style={{ maxWidth: 1024, margin: "0 auto" }}>
          <Reveal>
            <p style={{ ...T.eyebrow, textAlign: "center", marginBottom: 14 }}>
              Signature capabilities
            </p>
            <h2
              style={{
                ...T.h2,
                textAlign: "center",
                marginBottom: 48,
              }}
            >
              What I bring to the room.
            </h2>
          </Reveal>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 12,
            }}
          >
            {CAPABILITIES.map((cap, i) => (
              <Reveal key={cap} delay={i * 0.03}>
                <div
                  style={{
                    background: C.bg,
                    border: `1px solid ${C.rule}`,
                    borderRadius: 14,
                    padding: "18px 22px",
                    fontFamily: F.text,
                    fontSize: 15,
                    color: C.ink,
                    letterSpacing: "-0.01em",
                    lineHeight: 1.4,
                  }}
                >
                  {cap}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Experience ── */}
      <section style={{ background: C.bg, padding: "96px 22px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <Reveal>
            <p style={{ ...T.eyebrow, marginBottom: 14 }}>Experience</p>
            <h2 style={{ ...T.h2, marginBottom: 56 }}>The arc.</h2>
          </Reveal>
          <div>
            {EXPERIENCE.map((role, i) => (
              <TimelineRole
                key={role.company}
                role={role}
                index={i}
                last={i === EXPERIENCE.length - 1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Education + Credentials ── */}
      <section style={{ background: C.bgSoft, padding: "96px 22px" }}>
        <div
          style={{
            maxWidth: 1024,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 48,
          }}
        >
          <Reveal>
            <p style={{ ...T.eyebrow, marginBottom: 18 }}>Education</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {EDUCATION.map((edu) => (
                <div
                  key={edu.degree}
                  style={{
                    paddingBottom: 18,
                    borderBottom: `1px solid ${C.rule}`,
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
                  <div
                    style={{
                      fontFamily: F.text,
                      fontSize: 15,
                      color: C.inkSoft,
                      letterSpacing: "-0.008em",
                    }}
                  >
                    {edu.school}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <p style={{ ...T.eyebrow, marginBottom: 18 }}>Credentials</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {CERTS.map((cert) => (
                <div
                  key={cert}
                  style={{
                    background: C.bg,
                    border: `1px solid ${C.rule}`,
                    borderRadius: 999,
                    padding: "8px 16px",
                    fontFamily: F.text,
                    fontSize: 13,
                    color: C.ink,
                    letterSpacing: "-0.008em",
                  }}
                >
                  {cert}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── AI Systems (Apple dark inset) ── */}
      <section style={{ background: C.bgInk, padding: "112px 22px" }}>
        <div
          style={{
            maxWidth: 920,
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <Reveal>
            <p
              style={{
                fontFamily: F.text,
                fontSize: 13,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: C.accent,
                margin: "0 0 28px",
                fontWeight: 500,
              }}
            >
              AI systems and technical depth
            </p>
            <h2
              style={{
                fontFamily: F.display,
                fontWeight: 500,
                fontSize: "clamp(32px, 4.4vw, 50px)",
                lineHeight: 1.12,
                letterSpacing: "-0.03em",
                margin: "0 0 22px",
                color: "#f5f5f7",
              }}
            >
              I build the agents I&apos;d want enterprises to use.
            </h2>
            <p
              style={{
                fontFamily: F.display,
                fontWeight: 400,
                fontSize: "clamp(20px, 2.4vw, 28px)",
                lineHeight: 1.32,
                letterSpacing: "-0.022em",
                color: "rgba(245,245,247,0.78)",
                margin: "0 auto",
                maxWidth: 720,
              }}
            >
              MCP-based knowledge systems, agentic AI workflows, local LLM
              evaluation environments, and multi-agent orchestration patterns
              for post-sales teams.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          background: C.bgSoft,
          borderTop: `1px solid ${C.rule}`,
          padding: "28px 22px",
          fontFamily: F.text,
          fontSize: 12,
          color: C.inkMute,
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 1024, margin: "0 auto" }}>
          {"© 2026 Al Sharma. Built in Austin."}
        </div>
      </footer>
    </div>
  );
}
