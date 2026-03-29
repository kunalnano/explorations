const GOLD = "#c9a84c";
const GOLD_LIGHT = "#e8d48b";
const GOLD_DIM = "#8b7a3a";
const BG = "#050508";
const BONE = "#e8e4dc";
const ASH = "#6b6580";
const LINE_GOLD = "rgba(201,168,76,0.12)";

const MONO = "'SF Mono', 'Cascadia Code', 'Consolas', monospace";
const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "'Segoe UI', system-ui, -apple-system, sans-serif";

const CAPABILITIES = [
  "CS Function Design & Revenue Operations",
  "NRR & GRR Ownership at Scale",
  "Adoption Frameworks & Health Scoring",
  "Executive Stakeholder Engagement",
  "Enterprise Account Strategy & Expansion",
  "Cross-Functional GTM Alignment",
  "Team Building & Talent Architecture",
  "Platform Engineering & DevSecOps",
  "AI-Native CS Workflows & Agentic Systems",
  "Escalation & Risk Management",
];

const EXPERIENCE = [
  {
    title: "Head of Customer Success, Americas",
    company: "Port.io",
    period: "August 2025 \u2013 Present",
    context: "Series C Internal Developer Platform",
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
    bullets: [
      "Led cross-functional teams of engineers, researchers, and technicians. Built performance frameworks driving sustained productivity and high talent retention.",
      "Contributed to two patented technologies. Led global quality audits achieving full compliance across departments and geographies.",
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

function Section({ label, children }) {
  return (
    <div style={{ marginBottom: 48 }}>
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
        {label}
      </div>
      {children}
    </div>
  );
}

export default function Resume({ onBack }) {
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
      {/* Back */}
      <button
        onClick={onBack}
        style={{
          position: "absolute",
          top: 28,
          left: 28,
          background: "none",
          border: `1px solid ${LINE_GOLD}`,
          borderRadius: 8,
          padding: "6px 14px",
          color: GOLD_DIM,
          fontFamily: MONO,
          fontSize: 11,
          letterSpacing: 1,
          cursor: "pointer",
        }}
      >
        \u2190 HOME
      </button>

      <div style={{ maxWidth: 720, width: "100%" }}>
        {/* Header */}
        <div style={{ marginBottom: 48, textAlign: "center" }}>
          <div
            style={{
              width: 48,
              height: 1,
              background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
              margin: "0 auto 20px",
            }}
          />
          <h1
            style={{
              fontSize: "clamp(32px, 5vw, 48px)",
              fontWeight: 700,
              letterSpacing: -1,
              marginBottom: 8,
              background: `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD}, ${GOLD_DIM})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Al Sharma
          </h1>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 11,
              letterSpacing: 2,
              color: GOLD_DIM,
              marginBottom: 16,
            }}
          >
            AUSTIN, TX
          </div>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 12,
              color: GOLD_DIM,
              marginBottom: 24,
            }}
          >
            Vice President, Customer Success
          </div>
          <p
            style={{
              fontFamily: SERIF,
              fontSize: 14,
              lineHeight: 1.8,
              color: ASH,
              maxWidth: 600,
              margin: "0 auto",
            }}
          >
            Enterprise customer success executive with 15+ years building
            post-sales organizations that protect and grow revenue. Managed a
            cumulative book exceeding $125M ARR across Developer Platforms,
            Application Security, and Cloud Infrastructure. Builds CS functions
            from zero and scales them through adoption-first engagement,
            disciplined health scoring, and deep technical credibility.
          </p>
        </div>

        {/* Separator */}
        <div
          style={{
            width: "100%",
            height: 1,
            background: `linear-gradient(90deg, transparent, ${GOLD}22, transparent)`,
            marginBottom: 48,
          }}
        />

        {/* Capabilities */}
        <Section label="Signature Capabilities">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 8,
            }}
          >
            {CAPABILITIES.map((cap) => (
              <div
                key={cap}
                style={{
                  fontSize: 13,
                  color: BONE,
                  padding: "8px 0",
                  borderBottom: `1px solid ${LINE_GOLD}`,
                }}
              >
                {cap}
              </div>
            ))}
          </div>
        </Section>

        {/* Experience */}
        <Section label="Professional Experience">
          {EXPERIENCE.map((role, i) => (
            <div
              key={i}
              style={{
                marginBottom: 36,
                paddingBottom: 36,
                borderBottom:
                  i < EXPERIENCE.length - 1
                    ? `1px solid ${LINE_GOLD}`
                    : "none",
              }}
            >
              <div
                style={{
                  fontSize: 17,
                  fontWeight: 600,
                  marginBottom: 4,
                }}
              >
                {role.title}
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 8,
                  marginBottom: 4,
                }}
              >
                <div
                  style={{
                    fontFamily: MONO,
                    fontSize: 12,
                    color: GOLD,
                  }}
                >
                  {role.company}
                </div>
                <div
                  style={{
                    fontFamily: MONO,
                    fontSize: 11,
                    color: GOLD_DIM,
                  }}
                >
                  {role.period}
                </div>
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: ASH,
                  fontFamily: MONO,
                  marginBottom: 12,
                }}
              >
                {role.context}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {role.bullets.map((bullet, j) => (
                  <div
                    key={j}
                    style={{
                      fontSize: 13,
                      lineHeight: 1.7,
                      color: BONE,
                      paddingLeft: 16,
                      position: "relative",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        left: 0,
                        color: GOLD_DIM,
                      }}
                    >
                      \u25AA
                    </span>
                    {bullet}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </Section>

        {/* Education & Credentials */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 32,
          }}
        >
          <Section label="Education">
            {EDUCATION.map((edu, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>
                  {edu.degree}
                </div>
                <div style={{ fontSize: 12, color: ASH }}>
                  {edu.school}
                </div>
              </div>
            ))}
          </Section>
          <Section label="Credentials">
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              {CERTS.map((cert) => (
                <div
                  key={cert}
                  style={{
                    fontSize: 11,
                    fontFamily: MONO,
                    padding: "4px 10px",
                    border: `1px solid ${LINE_GOLD}`,
                    borderRadius: 6,
                    color: BONE,
                  }}
                >
                  {cert}
                </div>
              ))}
            </div>
          </Section>
        </div>

        {/* AI Depth Note */}
        <div
          style={{
            marginTop: 16,
            padding: 20,
            border: `1px solid ${LINE_GOLD}`,
            borderRadius: 12,
            background: "rgba(201,168,76,0.02)",
          }}
        >
          <div
            style={{
              fontFamily: MONO,
              fontSize: 10,
              letterSpacing: 3,
              color: GOLD,
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            AI Systems & Technical Depth
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.7, color: ASH }}>
            Built and applied MCP-based knowledge systems, agentic AI
            workflows, local LLM evaluation environments, and multi-agent
            orchestration patterns to improve workflow automation, operational
            leverage, and human-AI collaboration across post-sales teams.
          </p>
        </div>
      </div>
    </div>
  );
}
