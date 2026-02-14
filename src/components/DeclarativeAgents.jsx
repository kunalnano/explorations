import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════════════
   DECLARATIVE AGENTS
   You're not a developer. You're a director casting AI actors.
   The imperative→declarative shift. Complexity abstracted, not eliminated.
   ═══════════════════════════════════════════════════════════════ */

const BG = "#050508";
const BONE = "#e8e4dc";
const ASH = "#4a4860";
const ICE = "#6ee7f0";
const EMBER = "#ff4d2e";
const GHOST = "#9b8fff";
const GOLD = "#fbbf24";
const GREEN = "#34d399";
const FAINT = "rgba(255,255,255,0.03)";
const LINE = "rgba(255,255,255,0.06)";

const sans = { fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif" };
const serif = { fontFamily: "Georgia, 'Times New Roman', serif" };
const mono = { fontFamily: "'SF Mono', 'Cascadia Code', 'Consolas', monospace" };

function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.unobserve(el); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, vis];
}

function Reveal({ children, delay = 0 }) {
  const [ref, vis] = useReveal();
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "translateY(0)" : "translateY(32px)",
      transition: `all 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
    }}>{children}</div>
  );
}

function Chapter({ label, title, children }) {
  return (
    <section style={{ padding: "80px 0", borderTop: `1px solid ${LINE}` }}>
      <Reveal>
        <div style={{ ...mono, fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: GHOST, marginBottom: 20 }}>{label}</div>
        <h2 style={{ ...sans, fontSize: "clamp(26px, 4.5vw, 40px)", fontWeight: 700, lineHeight: 1.1, letterSpacing: -1, marginBottom: 24 }}>{title}</h2>
      </Reveal>
      {children}
    </section>
  );
}

// ═══════════════════════════════════════════════════════
// CODE COMPARISON — IMPERATIVE VS DECLARATIVE
// Animated side-by-side showing the paradigm shift
// ═══════════════════════════════════════════════════════
function CodeCompare() {
  const [ref, vis] = useReveal(0.15);
  const [line, setLine] = useState(0);

  useEffect(() => {
    if (!vis) return;
    let l = 0;
    const iv = setInterval(() => {
      l++;
      setLine(l);
      if (l >= 12) clearInterval(iv);
    }, 200);
    return () => clearInterval(iv);
  }, [vis]);

  const imperative = [
    { text: "// The old way: Imperative Software", color: ASH },
    { text: "1. Capture audio from microphone", color: EMBER },
    { text: "2. Send to Whisper for transcription", color: EMBER },
    { text: "3. Parse transcription into structured data", color: EMBER },
    { text: "4. Send to LLM for reasoning", color: EMBER },
    { text: "5. Parse LLM response for tool calls", color: EMBER },
    { text: "6. Execute tools, handle errors", color: EMBER },
    { text: "7. Format response text", color: EMBER },
    { text: "8. Send to TTS for speech synthesis", color: EMBER },
    { text: "9. Stream audio to output device", color: EMBER },
    { text: "10. Handle interruptions, errors, retry", color: EMBER },
    { text: "// 500+ lines of orchestration code", color: ASH },
  ];

  const declarative = [
    { text: "// The new way: Declarative Agents", color: ASH },
    { text: '"You are Eve."', color: GREEN },
    { text: '"You sound like this."', color: GREEN },
    { text: '"You can access these tools."', color: GREEN },
    { text: '"Go."', color: GREEN },
    { text: "", color: "transparent" },
    { text: "// That's it.", color: ASH },
    { text: "// 5 minutes. Done.", color: ASH },
  ];

  return (
    <div ref={ref} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <div style={{ background: EMBER + "06", border: `1px solid ${EMBER}22`, borderRadius: 16, padding: "20px 16px" }}>
        <div style={{ ...mono, fontSize: 9, letterSpacing: 2, color: EMBER, marginBottom: 12 }}>IMPERATIVE · 1 HOUR</div>
        {imperative.map((l, i) => (
          <div key={i} style={{
            ...mono, fontSize: 11, color: l.color,
            padding: "3px 0", opacity: i <= line ? 1 : 0.1,
            transition: `opacity 0.3s ease ${i * 0.05}s`,
            textDecoration: i > 0 && i < 11 && line >= 12 ? "line-through" : "none",
          }}>{l.text}</div>
        ))}
      </div>

      <div style={{ background: GREEN + "06", border: `1px solid ${GREEN}22`, borderRadius: 16, padding: "20px 16px" }}>
        <div style={{ ...mono, fontSize: 9, letterSpacing: 2, color: GREEN, marginBottom: 12 }}>DECLARATIVE · 5 MINUTES</div>
        {declarative.map((l, i) => (
          <div key={i} style={{
            ...mono, fontSize: 11, color: l.color,
            padding: "3px 0", opacity: line >= 8 ? 1 : 0.1,
            transition: `opacity 0.5s ease ${i * 0.1}s`,
          }}>{l.text}</div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// ABSTRACTION COLLAPSE
// Shows layers collapsing from many to few
// ═══════════════════════════════════════════════════════
function AbstractionCollapse() {
  const [collapsed, setCollapsed] = useState(false);

  const layers = [
    { label: "Voice synthesis", handler: "ElevenLabs", color: GHOST },
    { label: "Speech recognition", handler: "ElevenLabs", color: GHOST },
    { label: "Reasoning", handler: "LLM (Claude/GPT)", color: ICE },
    { label: "Tool execution", handler: "MCP / webhooks", color: GREEN },
    { label: "Orchestration", handler: "Platform", color: GOLD },
    { label: "Personality + connections", handler: "YOU", color: EMBER },
  ];

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20, justifyContent: "center" }}>
        <button onClick={() => setCollapsed(false)} style={{
          background: !collapsed ? EMBER + "22" : FAINT,
          border: `1px solid ${!collapsed ? EMBER + "44" : LINE}`,
          color: !collapsed ? EMBER : ASH,
          borderRadius: 8, padding: "8px 20px", cursor: "pointer",
          ...mono, fontSize: 10, letterSpacing: 1,
        }}>2 YEARS AGO</button>
        <button onClick={() => setCollapsed(true)} style={{
          background: collapsed ? GREEN + "22" : FAINT,
          border: `1px solid ${collapsed ? GREEN + "44" : LINE}`,
          color: collapsed ? GREEN : ASH,
          borderRadius: 8, padding: "8px 20px", cursor: "pointer",
          ...mono, fontSize: 10, letterSpacing: 1,
        }}>NOW</button>
      </div>

      <div style={{ background: FAINT, border: `1px solid ${LINE}`, borderRadius: 16, padding: "24px 20px" }}>
        {layers.map((l, i) => {
          const isYou = i === layers.length - 1;
          const visible = collapsed ? (isYou || i >= 4) : true;
          const isCollapsed = collapsed && !isYou && i < 5;

          return (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "10px 0",
              borderBottom: visible && !isCollapsed ? `1px solid ${LINE}` : "none",
              opacity: isCollapsed ? 0 : (visible ? 1 : 0.3),
              height: isCollapsed ? 0 : "auto",
              overflow: "hidden",
              transition: "all 0.6s ease",
            }}>
              <div style={{
                width: 8, height: 8, borderRadius: 4,
                background: isYou ? EMBER : l.color,
                boxShadow: isYou ? `0 0 12px ${EMBER}44` : "none",
              }} />
              <div style={{ flex: 1, ...sans, fontSize: 14, fontWeight: isYou ? 700 : 400, color: isYou ? EMBER : BONE }}>{l.label}</div>
              <div style={{ ...mono, fontSize: 11, color: isYou ? EMBER : ASH }}>
                {collapsed && !isYou ? "API call" : l.handler}
              </div>
            </div>
          );
        })}

        {collapsed && (
          <div style={{
            ...serif, fontSize: 13, color: GREEN, textAlign: "center", marginTop: 16, fontStyle: "italic",
          }}>
            The complexity didn't disappear. It got abstracted.
            <br />You only touch the top layer now.
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// ROLE SHIFT VISUALIZATION
// Developer → Director transformation
// ═══════════════════════════════════════════════════════
function RoleShift() {
  const oldSkills = [
    { name: "Write orchestration code", value: 90, color: EMBER },
    { name: "Build TTS pipeline", value: 85, color: EMBER },
    { name: "Host infrastructure", value: 80, color: EMBER },
    { name: "Debug audio streams", value: 75, color: EMBER },
  ];

  const newSkills = [
    { name: "What personality should it have?", value: 95, color: GREEN },
    { name: "What tools should it access?", value: 90, color: GREEN },
    { name: "How should it handle edge cases?", value: 85, color: GREEN },
    { name: "What voice fits the brand?", value: 80, color: GREEN },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <Reveal>
        <div style={{ background: EMBER + "06", border: `1px solid ${EMBER}22`, borderRadius: 16, padding: "24px 18px" }}>
          <div style={{ ...mono, fontSize: 9, letterSpacing: 2, color: EMBER, marginBottom: 4 }}>THE OLD QUESTION</div>
          <div style={{ ...sans, fontSize: 16, fontWeight: 700, color: BONE, marginBottom: 16 }}>"Can you build it?"</div>
          {oldSkills.map((s, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ ...serif, fontSize: 12, color: ASH, marginBottom: 3 }}>{s.name}</div>
              <div style={{ height: 4, background: LINE, borderRadius: 2, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${s.value}%`, background: s.color + "66", borderRadius: 2 }} />
              </div>
            </div>
          ))}
          <div style={{ ...mono, fontSize: 10, color: EMBER, marginTop: 12, textDecoration: "line-through" }}>DEVELOPER</div>
        </div>
      </Reveal>

      <Reveal delay={0.2}>
        <div style={{ background: GREEN + "06", border: `1px solid ${GREEN}22`, borderRadius: 16, padding: "24px 18px" }}>
          <div style={{ ...mono, fontSize: 9, letterSpacing: 2, color: GREEN, marginBottom: 4 }}>THE NEW QUESTION</div>
          <div style={{ ...sans, fontSize: 16, fontWeight: 700, color: BONE, marginBottom: 16 }}>"What should it be?"</div>
          {newSkills.map((s, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ ...serif, fontSize: 12, color: ASH, marginBottom: 3 }}>{s.name}</div>
              <div style={{ height: 4, background: LINE, borderRadius: 2, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${s.value}%`, background: s.color + "66", borderRadius: 2 }} />
              </div>
            </div>
          ))}
          <div style={{ ...mono, fontSize: 10, color: GREEN, marginTop: 12 }}>DIRECTOR</div>
        </div>
      </Reveal>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// TIMELINE: COMMODITIZATION OF HARD THINGS
// ═══════════════════════════════════════════════════════
function CommoditizationTimeline() {
  const [ref, vis] = useReveal(0.2);
  const [step, setStep] = useState(-1);

  useEffect(() => {
    if (!vis) return;
    let s = 0;
    const iv = setInterval(() => {
      setStep(s);
      s++;
      if (s >= items.length) clearInterval(iv);
    }, 350);
    return () => clearInterval(iv);
  }, [vis]);

  const items = [
    { before: "Train your own ASR model", after: "API call", color: GHOST },
    { before: "Build TTS pipeline", after: "API call", color: GHOST },
    { before: "Orchestrate tool calling", after: "MCP standard", color: ICE },
    { before: "Host inference infrastructure", after: "Serverless", color: GREEN },
    { before: "Voice cloning from hours of data", after: "Upload one sample", color: GOLD },
    { before: "Build memory systems", after: "Config option", color: EMBER },
  ];

  return (
    <div ref={ref} style={{ background: FAINT, border: `1px solid ${LINE}`, borderRadius: 16, padding: "24px 20px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 32px 1fr", gap: 8, marginBottom: 12, paddingBottom: 8, borderBottom: `1px solid ${LINE}` }}>
        <div style={{ ...mono, fontSize: 9, letterSpacing: 2, color: EMBER }}>2 YEARS AGO</div>
        <div />
        <div style={{ ...mono, fontSize: 9, letterSpacing: 2, color: GREEN }}>NOW</div>
      </div>

      {items.map((item, i) => (
        <div key={i} style={{
          display: "grid", gridTemplateColumns: "1fr 32px 1fr", gap: 8, alignItems: "center",
          padding: "8px 0", borderBottom: i < items.length - 1 ? `1px solid ${LINE}` : "none",
          opacity: i <= step ? 1 : 0.15,
          transition: `opacity 0.5s ease ${i * 0.05}s`,
        }}>
          <div style={{
            ...serif, fontSize: 13, color: ASH,
            textDecoration: i <= step ? "line-through" : "none",
            transition: "all 0.5s",
          }}>{item.before}</div>
          <div style={{ textAlign: "center", ...mono, fontSize: 14, color: i <= step ? GREEN : LINE }}>→</div>
          <div style={{ ...mono, fontSize: 12, color: i <= step ? item.color : ASH, fontWeight: 600 }}>{item.after}</div>
        </div>
      ))}
    </div>
  );
}


// ═══════════════ MAIN ═══════════════
export default function DeclarativeAgents({ onBack }) {
  return (
    <div style={{ background: BG, minHeight: "100vh", color: BONE }}>
      <div style={{
        position: "fixed", inset: 0, zIndex: 999, pointerEvents: "none", opacity: 0.03,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }} />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 720, margin: "0 auto", padding: "0 24px" }}>

        <div style={{ paddingTop: 32 }}>
          <button onClick={onBack} style={{ background: "none", border: "none", color: ASH, cursor: "pointer", ...mono, fontSize: 11, letterSpacing: 2, padding: "8px 0" }}>← EXPLORATIONS</button>
        </div>

        <div style={{ padding: "80px 0 60px" }}>
          <Reveal><div style={{ ...mono, fontSize: 10, letterSpacing: 4, color: ICE, textTransform: "uppercase", marginBottom: 20 }}>The paradigm shift in software</div></Reveal>
          <Reveal delay={0.15}>
            <h1 style={{ ...sans, fontSize: "clamp(36px, 7vw, 56px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: -2, marginBottom: 24 }}>
              Declarative<br /><span style={{ color: ICE }}>Agents</span>
            </h1>
          </Reveal>
          <Reveal delay={0.3}>
            <div style={{ ...serif, fontSize: 18, lineHeight: 1.7, color: ASH, maxWidth: 540, fontStyle: "italic" }}>
              You're not a developer anymore. You're a director casting AI actors.
              The complexity didn't disappear — it got abstracted.
            </div>
          </Reveal>
        </div>

        <Chapter label="Chapter I — The Shift" title="From step-by-step to describe-and-go">
          <Reveal><div style={{ ...serif, fontSize: 16, lineHeight: 1.7, color: ASH, maxWidth: 540, marginBottom: 32 }}>
            What took an hour of imperative orchestration code now takes <span style={{ color: GREEN }}>five minutes of configuration</span>. The transition is as profound as SQL was for databases.
          </div></Reveal>
          <CodeCompare />
        </Chapter>

        <Chapter label="Chapter II — The Collapse" title="Where did the complexity go?">
          <Reveal><div style={{ ...serif, fontSize: 16, lineHeight: 1.7, color: ASH, maxWidth: 540, marginBottom: 32 }}>
            Every hard problem got commoditized into an API call. Toggle between eras to see the collapse.
          </div></Reveal>
          <AbstractionCollapse />
        </Chapter>

        <Chapter label="Chapter III — The Commoditization" title="The hard parts became config screens">
          <CommoditizationTimeline />
        </Chapter>

        <Chapter label="Chapter IV — The New Role" title="Developer → Director">
          <Reveal><div style={{ ...serif, fontSize: 16, lineHeight: 1.7, color: ASH, maxWidth: 540, marginBottom: 32 }}>
            The value shifted from <span style={{ color: EMBER }}>"can you build it?"</span> to <span style={{ color: GREEN }}>"what should it be?"</span> The remaining moat: knowing how it works underneath lets you customize beyond what the UI allows.
          </div></Reveal>
          <RoleShift />
        </Chapter>

        <section style={{ padding: "80px 0 120px", borderTop: `1px solid ${LINE}`, textAlign: "center" }}>
          <Reveal>
            <h2 style={{ ...sans, fontSize: "clamp(24px, 4.5vw, 36px)", fontWeight: 700, lineHeight: 1.15, maxWidth: 520, margin: "0 auto 20px" }}>
              Software engineering is becoming<br />
              <span style={{ color: ICE }}>systems integration</span> + <span style={{ color: GOLD }}>prompt engineering</span> + <span style={{ color: GHOST }}>taste</span>.
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <div style={{ ...mono, fontSize: 10, color: "rgba(255,255,255,0.12)", letterSpacing: 0.5, lineHeight: 2, marginTop: 56 }}>
              From a conversation between a human and a language model · December 2025
            </div>
          </Reveal>
        </section>

      </div>
    </div>
  );
}
