import { useState, useEffect, useRef } from "react";

const GOLD = "#c9a84c";
const GOLD_LIGHT = "#e8d48b";
const GOLD_DIM = "#8b7a3a";
const BG = "#050508";
const BONE = "#e8e4dc";
const ASH = "#6b6580";
const DEEP_ASH = "#4a4860";
const LINE_GOLD = "rgba(201,168,76,0.12)";

const MONO = "'SF Mono', 'Cascadia Code', 'Consolas', monospace";
const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "'Segoe UI', system-ui, -apple-system, sans-serif";

// ── Scroll reveal hook ──
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
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `all 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

const CAPABILITIES = [
  { label: "CS Function Design & Revenue Ops", icon: "△" },
  { label: "NRR & GRR Ownership at Scale", icon: "◈" },
  { label: "Adoption Frameworks & Health Scoring", icon: "◎" },
  { label: "Executive Stakeholder Engagement", icon: "◆" },
  { label: "Enterprise Account Strategy", icon: "▣" },
  { label: "Cross-Functional GTM Alignment", icon: "⬡" },
  { label: "Team Building & Talent Architecture", icon: "◇" },
  { label: "Platform Engineering & DevSecOps", icon: "⬢" },
  { label: "AI-Native CS Workflows", icon: "◉" },
  { label: "Escalation & Risk Management", icon: "▲" },
];

const EXPERIENCE = [
  {
    title: "Head of Technical Success, AMER",
    company: "Port.io",
    period: "August 2025 \u2013 Present",
    context: "Series C Internal Developer Platform",
    accent: "#4aaa99",
    bullets: [
      "Designed and stood up the Americas Technical Success Management practice from scratch\u2014defined roles, hiring profiles, operating cadence, and the enterprise engagement model across a Fortune 500 portfolio spanning financial services, telecom, and professional services.",
      "Created a three-pillar implementation methodology adopted as the company-wide post-sales delivery standard, reducing onboarding friction and accelerating time-to-first-value.",
      "Prevented churn on multiple at-risk enterprise accounts through structured risk intervention, secured multi-year renewals, and drove expansion across LATAM and North America portfolios.",
      "Built MCP-based knowledge integrations, AI-assisted escalation triage, and agentic engagement patterns across CS workflows to improve team leverage and proactive customer management.",
      "Led structured field intelligence initiatives surfacing platform gaps directly to CEO and VP R&D, driving roadmap commitments on scalability and release governance.",
    ],
  },
  {
    title: "Sr. Technical Program Manager / Manager, CS",
    company: "Harness",
    period: "2021 \u2013 2022, 2024 \u2013 2025",
    context: "CI/CD and Software Delivery Platform (Series D)",
    accent: "#fbbf24",
    bullets: [
      "Individually managed 7 of Harness\u2019s largest enterprise relationships totaling $45M+ ARR, driving adoption of Kubernetes-based delivery pipelines and advanced deployment strategies.",
      "Oversaw post-sales delivery standards across Professional Services, Solutions Architects, Product, Support, and Partner channels.",
      "Partnered directly with product and engineering to align platform capabilities with enterprise requirements.",
    ],
  },
  {
    title: "Sr. Manager, Customer Solutions",
    company: "Snyk",
    period: "April 2022 \u2013 June 2024",
    context: "Application Security Leader (Series F)",
    accent: "#9b8fff",
    bullets: [
      "Hired and developed a team of 12+ Technical CSMs managing a $100M+ ARR enterprise portfolio. Designed career frameworks and enablement programs.",
      "Repositioned CS as a revenue contributor through cross-functional collaboration. Maintained 135%+ net revenue retention across the enterprise portfolio.",
      "Streamlined onboarding, implementation, and adoption processes to measurably improve time-to-value and long-term retention.",
    ],
  },
  {
    title: "User Success Manager",
    company: "HashiCorp",
    period: "January 2021 \u2013 September 2021",
    context: "Cloud Infrastructure Automation (Pre-IPO)",
    accent: "#34d399",
    bullets: [
      "Guided enterprise teams through cloud operating model adoption\u2014infrastructure-as-code, secrets management, and service mesh.",
      "Served as technical bridge between customer platform teams and HashiCorp product engineering.",
    ],
  },
  {
    title: "Staff Manager, Enterprise Technical Accounts",
    company: "Western Digital",
    period: "March 2013 \u2013 January 2021",
    context: "Fortune 200 Data Infrastructure ($16B Revenue)",
    accent: "#6ee7f0",
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
  { name: "Terraform Associate", color: "#9b8fff" },
  { name: "Vault Associate", color: "#fbbf24" },
  { name: "Certified Kubernetes Administrator", color: "#6ee7f0" },
  { name: "Snyk AppSec", color: "#9b8fff" },
  { name: "Harness CD Architect", color: "#fbbf24" },
  { name: "Deep Learning / Neural Networks", color: "#ff4d2e" },
];

function TimelineRole({ role, index }) {
  const [ref, visible] = useReveal(0.1);
  const [hoveredBullet, setHoveredBullet] = useState(null);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: `all 0.9s cubic-bezier(0.16,1,0.3,1) ${index * 0.1}s`,
        position: "relative",
        paddingLeft: 36,
        paddingBottom: 48,
      }}
    >
      {/* Timeline line */}
      <div
        style={{
          position: "absolute",
          left: 7,
          top: 12,
          bottom: 0,
          width: 1,
          background: `linear-gradient(180deg, ${role.accent}44, ${LINE_GOLD})`,
        }}
      />

      {/* Timeline dot */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 6,
          width: 15,
          height: 15,
          borderRadius: "50%",
          border: `2px solid ${role.accent}`,
          background: BG,
          boxShadow: `0 0 12px ${role.accent}33`,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 3,
            left: 3,
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: role.accent,
          }}
        />
      </div>

      {/* Period */}
      <div
        style={{
          fontFamily: MONO,
          fontSize: 10,
          letterSpacing: 2,
          color: DEEP_ASH,
          textTransform: "uppercase",
          marginBottom: 6,
        }}
      >
        {role.period}
      </div>

      {/* Title */}
      <div
        style={{
          fontSize: 18,
          fontWeight: 600,
          marginBottom: 6,
          color: BONE,
          letterSpacing: -0.3,
        }}
      >
        {role.title}
      </div>

      {/* Company with glow */}
      <div
        style={{
          fontFamily: MONO,
          fontSize: 13,
          color: role.accent,
          marginBottom: 4,
          textShadow: `0 0 20px ${role.accent}33`,
        }}
      >
        {role.company}
      </div>

      {/* Context */}
      <div
        style={{
          fontFamily: MONO,
          fontSize: 11,
          color: DEEP_ASH,
          marginBottom: 16,
        }}
      >
        {role.context}
      </div>

      {/* Bullets */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {role.bullets.map((bullet, j) => (
          <div
            key={j}
            onMouseEnter={() => setHoveredBullet(j)}
            onMouseLeave={() => setHoveredBullet(null)}
            style={{
              fontSize: 13,
              lineHeight: 1.75,
              color: hoveredBullet === j ? BONE : ASH,
              paddingLeft: 18,
              position: "relative",
              transition: "color 0.3s ease",
              fontFamily: SANS,
            }}
          >
            <span
              style={{
                position: "absolute",
                left: 0,
                top: 2,
                color: hoveredBullet === j ? role.accent : DEEP_ASH,
                fontSize: 8,
                transition: "color 0.3s ease",
              }}
            >
              ◆
            </span>
            {bullet}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Resume({ onBack }) {
  const [entered, setEntered] = useState(false);
  const [backHover, setBackHover] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setEntered(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: BG,
        color: BONE,
        fontFamily: SANS,
        padding: "60px 24px 120px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
      }}
    >
      <style>{`
        @keyframes shimmerLine {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
      `}</style>

      {/* Back button */}
      <button
        onClick={onBack}
        onMouseEnter={() => setBackHover(true)}
        onMouseLeave={() => setBackHover(false)}
        style={{
          position: "fixed",
          top: 28,
          left: 28,
          background: backHover ? "rgba(201,168,76,0.06)" : "none",
          border: `1px solid ${backHover ? GOLD + "44" : LINE_GOLD}`,
          borderRadius: 8,
          padding: "6px 14px",
          color: backHover ? GOLD : GOLD_DIM,
          fontFamily: MONO,
          fontSize: 11,
          letterSpacing: 1,
          cursor: "pointer",
          transition: "all 0.3s ease",
          zIndex: 100,
          boxShadow: backHover ? `0 0 16px ${GOLD}11` : "none",
        }}
      >
        ← HOME
      </button>

      <div style={{ maxWidth: 720, width: "100%" }}>
        {/* ── Header ── */}
        <div
          style={{
            marginBottom: 56,
            textAlign: "center",
            opacity: entered ? 1 : 0,
            transform: entered ? "translateY(0)" : "translateY(24px)",
            transition: "all 1s cubic-bezier(0.16,1,0.3,1) 0.2s",
          }}
        >
          <div
            style={{
              width: 64,
              height: 1,
              background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
              margin: "0 auto 24px",
            }}
          />
          <h1
            style={{
              fontSize: "clamp(36px, 6vw, 56px)",
              fontWeight: 700,
              letterSpacing: -2,
              marginBottom: 8,
              background: `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD}, ${GOLD_DIM})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              lineHeight: 1,
            }}
          >
            Al Sharma
          </h1>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 11,
              letterSpacing: 3,
              color: GOLD_DIM,
              marginBottom: 20,
              textTransform: "uppercase",
            }}
          >
            Austin, TX
          </div>
          <a
            href="https://www.linkedin.com/in/alsharma"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              fontFamily: MONO,
              fontSize: 11,
              letterSpacing: 2,
              color: GOLD_DIM,
              textDecoration: "none",
              textTransform: "uppercase",
              marginBottom: 20,
              transition: "color 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.color = GOLD)}
            onMouseLeave={(e) => (e.target.style.color = GOLD_DIM)}
          >
            linkedin.com/in/alsharma
          </a>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 13,
              color: GOLD,
              marginBottom: 24,
              letterSpacing: 1,
            }}
          >
            Vice President, Customer Success
          </div>
          <p
            style={{
              fontFamily: SERIF,
              fontSize: 15,
              lineHeight: 1.85,
              color: ASH,
              maxWidth: 600,
              margin: "0 auto",
              fontStyle: "italic",
            }}
          >
            Enterprise customer success executive with 15+ years building
            post-sales organizations that protect and grow revenue. Managed a
            cumulative book exceeding $125M ARR across Developer Platforms,
            Application Security, and Cloud Infrastructure.
          </p>
        </div>

        {/* Shimmer separator */}
        <Reveal>
          <div
            style={{
              width: "100%",
              height: 1,
              background: `linear-gradient(90deg, transparent 0%, ${GOLD}44 25%, ${GOLD} 50%, ${GOLD}44 75%, transparent 100%)`,
              backgroundSize: "200% 100%",
              animation: "shimmerLine 6s linear infinite",
              marginBottom: 56,
            }}
          />
        </Reveal>

        {/* ── Capabilities Grid ── */}
        <Reveal delay={0.1}>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 10,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: GOLD,
              marginBottom: 24,
            }}
          >
            Signature Capabilities
          </div>
        </Reveal>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 12,
            marginBottom: 64,
          }}
        >
          {CAPABILITIES.map((cap, i) => (
            <Reveal key={cap.label} delay={0.05 * i}>
              <CapabilityTag cap={cap} />
            </Reveal>
          ))}
        </div>

        {/* ── Experience Timeline ── */}
        <Reveal>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 10,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: GOLD,
              marginBottom: 32,
            }}
          >
            Professional Experience
          </div>
        </Reveal>

        <div style={{ marginBottom: 64 }}>
          {EXPERIENCE.map((role, i) => (
            <TimelineRole key={i} role={role} index={i} />
          ))}
        </div>

        {/* ── Education & Credentials ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 40,
            marginBottom: 56,
          }}
        >
          <Reveal delay={0}>
            <div>
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 10,
                  letterSpacing: 4,
                  textTransform: "uppercase",
                  color: GOLD,
                  marginBottom: 20,
                }}
              >
                Education
              </div>
              {EDUCATION.map((edu, i) => (
                <div key={i} style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>
                    {edu.degree}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: DEEP_ASH,
                      fontFamily: SERIF,
                      fontStyle: "italic",
                    }}
                  >
                    {edu.school}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div>
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 10,
                  letterSpacing: 4,
                  textTransform: "uppercase",
                  color: GOLD,
                  marginBottom: 20,
                }}
              >
                Credentials
              </div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 10,
                }}
              >
                {CERTS.map((cert) => (
                  <CertBadge key={cert.name} cert={cert} />
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        {/* ── AI Systems Section ── */}
        <Reveal delay={0.1}>
          <div
            style={{
              marginTop: 16,
              padding: 28,
              border: `1px solid ${GOLD}22`,
              borderRadius: 16,
              background: `linear-gradient(135deg, rgba(201,168,76,0.03), rgba(155,143,255,0.02))`,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Corner accent */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: 60,
                height: 60,
                background: `linear-gradient(135deg, ${GOLD}11, transparent)`,
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: 60,
                height: 60,
                background: `linear-gradient(315deg, ${GOLD}11, transparent)`,
                pointerEvents: "none",
              }}
            />

            <div
              style={{
                fontFamily: MONO,
                fontSize: 10,
                letterSpacing: 4,
                color: GOLD,
                textTransform: "uppercase",
                marginBottom: 16,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: GOLD,
                  boxShadow: `0 0 8px ${GOLD}66`,
                }}
              />
              AI Systems & Technical Depth
            </div>
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.8,
                color: ASH,
                margin: 0,
                fontFamily: SANS,
              }}
            >
              Built and applied MCP-based knowledge systems, agentic AI
              workflows, local LLM evaluation environments, and multi-agent
              orchestration patterns to improve workflow automation, operational
              leverage, and human-AI collaboration across post-sales teams.
            </p>
          </div>
        </Reveal>

        {/* Footer */}
        <Reveal delay={0.2}>
          <div style={{ marginTop: 80, textAlign: "center" }}>
            <div
              style={{
                width: 48,
                height: 1,
                background: `linear-gradient(90deg, transparent, ${GOLD}33, transparent)`,
                margin: "0 auto 16px",
              }}
            />
            <div
              style={{
                fontFamily: MONO,
                fontSize: 9,
                letterSpacing: 4,
                color: GOLD_DIM,
                textTransform: "uppercase",
              }}
            >
              alsharma.com
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

function CapabilityTag({ cap }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "12px 16px",
        border: `1px solid ${hovered ? GOLD + "33" : LINE_GOLD}`,
        borderRadius: 10,
        background: hovered ? "rgba(201,168,76,0.04)" : "rgba(201,168,76,0.01)",
        transition: "all 0.3s ease",
        cursor: "default",
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      <span
        style={{
          color: hovered ? GOLD : DEEP_ASH,
          fontSize: 12,
          transition: "color 0.3s ease",
        }}
      >
        {cap.icon}
      </span>
      <span
        style={{
          fontSize: 12,
          color: hovered ? BONE : ASH,
          transition: "color 0.3s ease",
          letterSpacing: 0.3,
        }}
      >
        {cap.label}
      </span>
    </div>
  );
}

function CertBadge({ cert }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontSize: 11,
        fontFamily: MONO,
        padding: "6px 12px",
        border: `1px solid ${hovered ? cert.color + "44" : LINE_GOLD}`,
        borderRadius: 8,
        color: hovered ? cert.color : BONE,
        background: hovered ? cert.color + "08" : "transparent",
        transition: "all 0.3s ease",
        cursor: "default",
        boxShadow: hovered ? `0 0 12px ${cert.color}11` : "none",
      }}
    >
      {cert.name}
    </div>
  );
}
