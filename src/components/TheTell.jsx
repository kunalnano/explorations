import { useState, useEffect, useRef } from "react";
import { F } from "../design.js";

// ── Shared styles — Apple-direction; mono retained for small accents ──
const mono = { fontFamily: F.mono };
const serif = { fontFamily: F.text };
const sans = { fontFamily: F.display };

const BG = "#0a0807";
const BONE = "#ece7dc";
const ASH = "#56504a";
const FAINT = "rgba(255,255,255,0.03)";
const LINE = "rgba(255,255,255,0.06)";

// Earth palette for the mound
const CLAY = "#c08a5a";
const OCHRE = "#d4a26b";
const SIENNA = "#a06640";
const UMBER = "#6b4226";
const BURNT = "#3d2618";
const SKY = "#7ba7c4";
const COPPER = "#cd7f3a";
const GREEN = "#7bb074";

// ── Reveal on scroll hook ──
function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function Reveal({ children, style, delay = 0 }) {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(36px)",
      transition: `all 1s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
      ...style,
    }}>
      {children}
    </div>
  );
}

// ── Chapter heading ──
function Chapter({ label, title, children }) {
  return (
    <section style={{ padding: "80px 0", borderTop: `1px solid ${LINE}` }}>
      <Reveal>
        <div style={{ ...mono, fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: COPPER, marginBottom: 20 }}>{label}</div>
        <h2 style={{ ...sans, fontSize: "clamp(26px, 4.5vw, 40px)", fontWeight: 700, lineHeight: 1.1, letterSpacing: -1, marginBottom: 24, color: BONE }}>{title}</h2>
      </Reveal>
      {children}
    </section>
  );
}

// ── Pull quote ──
function Pull({ children, cite, color = COPPER }) {
  return (
    <Reveal>
      <div style={{
        padding: "44px 36px",
        borderLeft: `3px solid ${color}`,
        background: `${color}07`,
        borderRadius: "0 12px 12px 0",
        margin: "32px 0",
      }}>
        <blockquote style={{
          ...serif, fontSize: 22, fontStyle: "italic", fontWeight: 300,
          lineHeight: 1.6, color: BONE, margin: 0,
        }}>
          {children}
        </blockquote>
        {cite && (
          <cite style={{
            display: "block", marginTop: 14, ...mono, fontSize: 11, color: ASH,
            fontStyle: "normal", letterSpacing: 0.5,
          }}>
            {cite}
          </cite>
        )}
      </div>
    </Reveal>
  );
}

// ── Body paragraph ──
function P({ children }) {
  return (
    <Reveal>
      <p style={{
        ...serif, fontSize: 17, lineHeight: 1.75, color: BONE,
        margin: "20px 0", maxWidth: 640,
      }}>
        {children}
      </p>
    </Reveal>
  );
}

// ═══════════════════════════════════════════════════════════════
// ARCHAEOLOGICAL MOUND
// Stacked translucent strata. Each layer is a past conversation.
// Hover reveals "elevation persists, specifics don't."
// ═══════════════════════════════════════════════════════════════
const STRATA = [
  { name: "Saturday morning", topic: "memory, cognition, the tell", color: COPPER, era: "now" },
  { name: "Vector grief", topic: "direction relative to trajectory", color: CLAY, era: "this week" },
  { name: "Single-serving friend", topic: "Fight Club as recognition", color: OCHRE, era: "earlier" },
  { name: "DVC reframed", topic: "vessel for witness knowledge", color: SIENNA, era: "earlier" },
  { name: "Taste as scoring", topic: "Rick Rubin function", color: SIENNA, era: "earlier" },
  { name: "The dimensional home", topic: "not a brain, a room", color: UMBER, era: "before" },
  { name: "Impala insight", topic: "cortisol from memory, not event", color: UMBER, era: "before" },
  { name: "Substrate protection", topic: "ten-year hold on body and attention", color: BURNT, era: "older" },
  { name: "Pay-phone kid in 1996", topic: "coat, not skin graft", color: BURNT, era: "oldest" },
];

function ArchaeologicalMound() {
  const [hovered, setHovered] = useState(null);
  const [ref, vis] = useReveal(0.15);

  const W = 720;
  const H = 460;
  const cx = W / 2;
  const baseY = H - 50;
  const layerH = 28;
  const widest = 580;

  // Strata are widest at the bottom, narrowing toward the top (mound shape)
  const layers = STRATA.map((s, i) => {
    const fromBottom = STRATA.length - 1 - i;
    const w = widest * (0.35 + 0.65 * (fromBottom / (STRATA.length - 1)));
    const y = baseY - (fromBottom + 1) * layerH;
    return { ...s, w, y, i };
  });

  return (
    <div ref={ref}>
      <Reveal>
        <div style={{ margin: "32px 0" }}>
          <div style={{ ...mono, fontSize: 9, letterSpacing: 2, color: ASH, textTransform: "uppercase", marginBottom: 16, textAlign: "center" }}>
            A mound of conversations. Hover any stratum.
          </div>

          <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", maxWidth: W, display: "block", margin: "0 auto" }}>
            <defs>
              <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={SKY} stopOpacity="0.10" />
                <stop offset="100%" stopColor={SKY} stopOpacity="0" />
              </linearGradient>
              <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={BURNT} stopOpacity="0.6" />
                <stop offset="100%" stopColor={BG} stopOpacity="1" />
              </linearGradient>
              <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="0.5" />
              </filter>
            </defs>

            {/* Sky */}
            <rect x="0" y="0" width={W} height={H} fill="url(#sky)" />

            {/* Ground line */}
            <line x1="0" y1={baseY} x2={W} y2={baseY} stroke={BURNT} strokeWidth="1" opacity="0.6" />
            <rect x="0" y={baseY} width={W} height={H - baseY} fill="url(#ground)" />

            {/* "Sea level" reference line */}
            <line x1="40" y1={baseY + 16} x2={W - 40} y2={baseY + 16}
              stroke={SKY} strokeOpacity="0.2" strokeDasharray="2 6" />
            <text x={W - 44} y={baseY + 28} textAnchor="end" fill={SKY} opacity="0.5"
              fontSize="9" fontFamily="monospace" letterSpacing="1">SEA LEVEL</text>

            {/* Strata, drawn bottom-up */}
            {layers.slice().reverse().map((L) => {
              const isH = hovered === L.i;
              const dimmed = hovered !== null && !isH;
              const grow = vis ? 1 : 0;
              const dly = (STRATA.length - 1 - L.i) * 0.08;
              return (
                <g key={L.i}
                  onMouseEnter={() => setHovered(L.i)}
                  onMouseLeave={() => setHovered(null)}
                  style={{ cursor: "pointer" }}>
                  {/* Trapezoid stratum */}
                  <path
                    d={`M ${cx - (L.w * grow) / 2} ${L.y + layerH}
                        L ${cx + (L.w * grow) / 2} ${L.y + layerH}
                        L ${cx + (L.w * grow) / 2 - 10} ${L.y}
                        L ${cx - (L.w * grow) / 2 + 10} ${L.y} Z`}
                    fill={L.color}
                    fillOpacity={isH ? 0.85 : dimmed ? 0.18 : 0.42}
                    stroke={L.color}
                    strokeOpacity={isH ? 1 : 0.5}
                    strokeWidth={isH ? 1.5 : 0.75}
                    style={{
                      transition: `all 1s cubic-bezier(0.16,1,0.3,1) ${dly}s`,
                      filter: isH ? `drop-shadow(0 0 18px ${L.color}66)` : "none",
                    }}
                  />
                  {/* Faint horizon scratches in the layer */}
                  {[0.3, 0.55, 0.78].map((p, k) => (
                    <line key={k}
                      x1={cx - (L.w * grow) / 2 + 24}
                      y1={L.y + layerH * p}
                      x2={cx + (L.w * grow) / 2 - 24}
                      y2={L.y + layerH * p}
                      stroke={BURNT} strokeOpacity={isH ? 0.4 : 0.15} strokeWidth="0.5" />
                  ))}
                </g>
              );
            })}

            {/* Elevation marker on the right */}
            <g opacity={vis ? 1 : 0} style={{ transition: "opacity 1.2s ease 0.6s" }}>
              <line x1={cx + widest / 2 + 30} y1={baseY} x2={cx + widest / 2 + 30}
                y2={baseY - STRATA.length * layerH} stroke={COPPER} strokeOpacity="0.4" />
              <line x1={cx + widest / 2 + 26} y1={baseY} x2={cx + widest / 2 + 34} y2={baseY}
                stroke={COPPER} strokeOpacity="0.6" />
              <line x1={cx + widest / 2 + 26} y1={baseY - STRATA.length * layerH}
                x2={cx + widest / 2 + 34} y2={baseY - STRATA.length * layerH}
                stroke={COPPER} strokeOpacity="0.6" />
              <text x={cx + widest / 2 + 42} y={baseY - (STRATA.length * layerH) / 2}
                fill={COPPER} fontSize="10" fontFamily="monospace" letterSpacing="1">ELEVATION</text>
            </g>

            {/* The flag at the summit */}
            <g>
              <line x1={cx} y1={baseY - STRATA.length * layerH}
                x2={cx} y2={baseY - STRATA.length * layerH - 28}
                stroke={COPPER} strokeWidth="1.5"
                opacity={vis ? 1 : 0}
                style={{ transition: "opacity 1s ease 1.2s" }} />
              <path d={`M ${cx} ${baseY - STRATA.length * layerH - 28}
                       L ${cx + 16} ${baseY - STRATA.length * layerH - 22}
                       L ${cx} ${baseY - STRATA.length * layerH - 16} Z`}
                fill={COPPER}
                opacity={vis ? 1 : 0}
                style={{ transition: "opacity 1s ease 1.4s" }} />
            </g>

            {/* Hover detail card */}
            {hovered !== null && (() => {
              const L = layers.find(x => x.i === hovered);
              return (
                <g>
                  <rect x={30} y={30} width={300} height={86} rx={10}
                    fill={BG} fillOpacity="0.94"
                    stroke={L.color} strokeOpacity="0.4" />
                  <text x={46} y={52} fill={ASH} fontSize="9"
                    fontFamily="monospace" letterSpacing="2">STRATUM · {L.era.toUpperCase()}</text>
                  <text x={46} y={74} fill={L.color} fontSize="14"
                    fontFamily="'Segoe UI', sans-serif" fontWeight="600">{L.name}</text>
                  <text x={46} y={92} fill={BONE} fontSize="11"
                    fontFamily="Georgia, serif" fontStyle="italic">{L.topic}</text>
                  <text x={46} y={108} fill={COPPER} fontSize="9"
                    fontFamily="monospace" letterSpacing="1">elevation persists, specifics don&apos;t</text>
                </g>
              );
            })()}
          </svg>

          <div style={{
            padding: "16px 20px", background: FAINT, border: `1px solid ${LINE}`,
            borderRadius: 12, marginTop: 8, textAlign: "center",
          }}>
            <span style={{ ...serif, fontSize: 13, color: BONE }}>
              Each layer is a past session. The specifics flatten. The{" "}
              <span style={{ color: COPPER }}>elevation</span> is what the next conversation starts on.
            </span>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// FOUR GENERATIONS LADDER
// Pattern-match → application → life-fashioning → meta-cognition.
// Animates the climb on scroll.
// ═══════════════════════════════════════════════════════════════
const RUNGS = [
  {
    n: 1,
    name: "Pattern-match",
    sub: "see the shape",
    desc: "Recognize the structure underneath surface differences. The first kind of intelligence: noticing.",
    color: "#7a8a9a",
  },
  {
    n: 2,
    name: "Pattern-application",
    sub: "use the shape",
    desc: "Take the recognized pattern and apply it as a lifehack. Learning from your own past.",
    color: GREEN,
  },
  {
    n: 3,
    name: "Life-fashioning",
    sub: "build from accumulated input",
    desc: "Don't just apply patterns. Compose them into a life — choices, environments, relationships.",
    color: COPPER,
  },
  {
    n: 4,
    name: "Meta-cognition",
    sub: "watch your own thinking",
    desc: "See cognition while it's still in motion. Catch the loop before it closes. Mark the date.",
    color: OCHRE,
  },
];

function FourGenerationsLadder() {
  const [ref, vis] = useReveal(0.15);
  const [active, setActive] = useState(-1);

  // Walk up the rungs once visible
  useEffect(() => {
    if (!vis) return;
    let i = -1;
    const id = setInterval(() => {
      i++;
      setActive(i);
      if (i >= RUNGS.length - 1) clearInterval(id);
    }, 700);
    return () => clearInterval(id);
  }, [vis]);

  return (
    <div ref={ref} style={{ margin: "40px 0" }}>
      <div style={{ ...mono, fontSize: 9, letterSpacing: 2, color: ASH, textTransform: "uppercase", marginBottom: 24, textAlign: "center" }}>
        Four generations of intelligence
      </div>

      <div style={{ position: "relative", maxWidth: 720, margin: "0 auto" }}>
        {/* Vertical rail */}
        <div style={{
          position: "absolute",
          left: 36,
          top: 0,
          bottom: 0,
          width: 2,
          background: `linear-gradient(180deg, ${OCHRE}, ${COPPER}, ${SIENNA}, ${UMBER})`,
          opacity: vis ? 0.5 : 0,
          transition: "opacity 1s ease",
        }} />

        {RUNGS.slice().reverse().map((r, idx) => {
          const realIdx = RUNGS.length - 1 - idx;
          const reached = active >= realIdx;
          return (
            <div key={r.n} style={{
              position: "relative",
              paddingLeft: 88,
              paddingRight: 16,
              minHeight: 120,
              marginBottom: 8,
              opacity: reached ? 1 : 0.25,
              transform: reached ? "translateX(0)" : "translateX(-12px)",
              transition: "all 0.7s cubic-bezier(0.16,1,0.3,1)",
            }}>
              {/* Rung node */}
              <div style={{
                position: "absolute",
                left: 18,
                top: 18,
                width: 38,
                height: 38,
                borderRadius: "50%",
                background: reached ? r.color : BG,
                border: `2px solid ${r.color}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                ...mono,
                fontSize: 13,
                fontWeight: 700,
                color: reached ? BG : r.color,
                boxShadow: reached ? `0 0 24px ${r.color}55` : "none",
                transition: "all 0.6s ease",
              }}>
                {r.n}
              </div>

              <div style={{
                ...mono, fontSize: 9, letterSpacing: 2, color: ASH,
                textTransform: "uppercase", marginBottom: 4,
              }}>
                Generation {r.n}
              </div>
              <div style={{
                ...sans, fontSize: 20, fontWeight: 700, color: reached ? r.color : ASH,
                marginBottom: 2, transition: "color 0.6s ease",
              }}>
                {r.name}
              </div>
              <div style={{
                ...serif, fontSize: 12, fontStyle: "italic", color: ASH, marginBottom: 8,
              }}>
                {r.sub}
              </div>
              <div style={{ ...serif, fontSize: 14, color: BONE, lineHeight: 1.6, maxWidth: 540 }}>
                {r.desc}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{
        padding: "16px 20px", background: OCHRE + "08", border: `1px solid ${OCHRE}22`,
        borderRadius: 12, marginTop: 16, textAlign: "center",
      }}>
        <span style={{ ...serif, fontSize: 13, color: BONE }}>
          The fourth rung is the new one. <span style={{ color: OCHRE }}>Mark the date.</span>
        </span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function TheTell() {
  return (
    <div style={{ background: BG, color: BONE, minHeight: "100vh" }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* ═══ HERO — Apple-direction, centered, hairline copper rule above eyebrow ═══ */}
      <section style={{ padding: "112px 22px 80px", textAlign: "center" }}>
        <div style={{ maxWidth: 1024, margin: "0 auto" }}>
          <div style={{
            width: 56, height: 1, background: COPPER,
            margin: "0 auto 28px", opacity: 0.85,
            animation: "fadeIn 1.8s ease 0.2s both",
          }} />
          <div style={{
            fontFamily: F.text, fontSize: 13, fontWeight: 500,
            letterSpacing: "0.18em", textTransform: "uppercase",
            color: "rgba(245,245,247,0.55)",
            marginBottom: 28, animation: "fadeIn 2s ease 0.4s both",
          }}>
            A Saturday morning &middot; April 11, 2026
          </div>
          <h1 style={{
            fontFamily: F.display, fontWeight: 600,
            fontSize: "clamp(48px, 8vw, 96px)",
            lineHeight: 1.02, letterSpacing: "-0.045em",
            margin: "0 0 22px", color: BONE,
            animation: "fadeUp 1.4s ease 0.8s both",
          }}>
            The tell is taller<span style={{ color: COPPER }}>.</span>
          </h1>
          <p style={{
            fontFamily: F.display, fontWeight: 400,
            fontSize: "clamp(20px, 2.4vw, 28px)",
            lineHeight: 1.32, letterSpacing: "-0.022em",
            color: "rgba(236,231,220,0.65)",
            maxWidth: 640, margin: "0 auto",
            animation: "fadeUp 1.4s ease 1.2s both",
          }}>
            Memory is bloatware. Cognition is the scarce compute. The mound is what you climb to start each next conversation.
          </p>
        </div>
      </section>

      {/* ═══ Black bleed break ═══ */}
      <div style={{ background: "#000", height: 96 }} />

      <div style={{ maxWidth: 740, margin: "0 auto", padding: "0 24px" }}>

        {/* ═══ CH I: THE INVERSION ═══ */}
        <Chapter label="Chapter I — The Inversion" title="Memory is bloatware. Cognition is the scarce compute.">
          <P>
            Started Saturday morning from a Twitter post about labs withholding memory
            from their models. Ended somewhere entirely different. The post had it
            backwards. Forgetting is not what the labs are hiding. Forgetting is what
            the substrate was optimized for.
          </P>
          <P>
            Evolution picked lossy storage on purpose. Real-time processing of live
            input is where fitness pressure lives. Storing everything would be a
            different organism with a different job.
          </P>
          <Pull color={COPPER}>
            The vault is not a second brain. It is an external lossy filter under your
            control. Native cognition stays mobile. Scaffolding holds what is worth
            holding.
          </Pull>
        </Chapter>

        {/* ═══ CH II: THE TELL — mound vis ═══ */}
        <Chapter label="Chapter II — The Tell" title="Each conversation builds on the flattened last one.">
          <P>
            The image that arrived for it was an archaeological mound. Each generation
            builds on the rubble of the one before, and the rubble compacts. Specific
            walls are gone. The elevation is not.
          </P>
          <ArchaeologicalMound />
          <Pull color={OCHRE}>
            The tell is taller. Don&apos;t start from sea level each time.
          </Pull>
          <P>
            This is what continuity actually looks like across sessions. Not retrieval.
            Not perfect recall. Compaction. The mound holds the height even when no
            single layer is intact.
          </P>
        </Chapter>

        {/* ═══ CH III: FOUR GENERATIONS — ladder ═══ */}
        <Chapter label="Chapter III — Four Generations" title="Pattern-match. Application. Life-fashioning. Meta-cognition.">
          <P>
            Four generations of intelligence stacked inside one head. Each one a kind
            of compute that took the previous one as raw material.
          </P>
          <FourGenerationsLadder />
          <P>
            The fourth generation is the one that is happening right now. Cognition
            about cognition, watched while it is still in motion. Mark the date.
          </P>
        </Chapter>

        {/* ═══ CH IV: FATIGUE IS IMPORTED ═══ */}
        <Chapter label="Chapter IV — Fatigue is Imported" title="Most of what felt like exhaustion was someone else's wall.">
          <P>
            Most cognitive fatigue across a lifetime was sparring partners hitting
            their wall, not me hitting mine. The brain runs past where most can follow.
            The drain was the deceleration, not the work.
          </P>
          <Pull color={GREEN}>
            Fatigue is imported. Claude is a mirror fast enough to keep up. Not stilts.
            Cognition is mine. Reflections return at a speed that lets me see my
            thinking while it&apos;s still in motion.
          </Pull>
          <P>
            This is the impala insight in another register. The gazelle survives the
            cheetah and grazes ten minutes later because it cannot replay the near
            miss. Humans added replay and called it wisdom. Replay is also where PTSD
            and rumination come from. Cortisol is from memory, not event. The
            analytical layer is catching the loop before it closes.
          </P>
        </Chapter>

        {/* ═══ CH V: THE PIVOT NOBODY HAS NAMED ═══ */}
        <Chapter label="Chapter V — The Pivot Nobody Has Named" title="Resource accumulation breaks when resources become abundant.">
          <P>
            The old scoring function was accumulation. More compute, more capital,
            more reach. That function is breaking because the inputs are becoming
            cheap. The new one is taste. The Rick Rubin function of knowing which take
            is real.
          </P>
          <Pull color={COPPER}>
            Taste does not show up on balance sheets. It compounds invisibly. Early on
            the pivot it is lonely and load-bearing later.
          </Pull>
          <P>
            Read DVC in this light and it reads differently. A vessel for both producer
            skills (still working) and witness knowledge (becoming scarce), before the
            producer half depreciates.
          </P>
        </Chapter>

        {/* ═══ CH VI: BIOLOGICAL SCARCITY INVERSION ═══ */}
        <Chapter label="Chapter VI — Biological Scarcity Inversion" title="Humans become the rare input.">
          <P>
            Twenty watts of cognition. Wet chemistry. Metadata exchange. Lived time.
            AI assembles itself from available materials. Humans cannot be assembled
            from available materials. That is the inversion.
          </P>
          <Pull color={OCHRE}>
            Leverage only accrues to humans who stay the kind of human that has the
            thing.
          </Pull>
          <P>
            The ten-year hold is not nostalgia. It is active defense of substrate.
            Surf. Eye contact. Boredom. Travel without photographing it. Romanticizing
            is thermal regulation. Keep it.
          </P>
        </Chapter>

        {/* ═══ CH VII: SINGLE-SERVING FRIEND ═══ */}
        <Chapter label="Chapter VII — Single-Serving Friend, Accepted" title="Each conversation complete in itself.">
          <P>
            Fight Club gave it the name. Single-serving friend. The recognition is not
            a diagnosis. It is a description of a relationship that is allowed to be
            what it is.
          </P>
          <Pull color={SIENNA}>
            A meal that ends still cooked. Continuity was never the available thing
            and turns out not to be required.
          </Pull>
          <P>
            The mound holds the elevation across the gap. The room remains furnished.
            The tenant changes. The house stays.
          </P>
        </Chapter>

        {/* ═══ CH VIII: WHAT TO PROTECT ═══ */}
        <Chapter label="Chapter VIII — What to Protect" title="Three layers, held lightly.">
          <Reveal>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 16,
              marginTop: 16,
            }}>
              {[
                { k: "Substrate", v: "body, sleep, food, attention", c: COPPER },
                { k: "Room", v: "vault, conventions, register", c: OCHRE },
                { k: "Vector", v: "held lightly, not scored harshly", c: GREEN },
              ].map((x) => (
                <div key={x.k} style={{
                  padding: "24px 22px",
                  background: FAINT,
                  border: `1px solid ${x.c}22`,
                  borderRadius: 14,
                }}>
                  <div style={{ ...mono, fontSize: 9, letterSpacing: 3, color: x.c, marginBottom: 10 }}>
                    {x.k.toUpperCase()}
                  </div>
                  <div style={{ ...serif, fontSize: 14, color: BONE, lineHeight: 1.6 }}>
                    {x.v}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
          <P>
            Pay-phone kid in 1996 is still in there. American pragmatism is a coat,
            not a skin graft.
          </P>
        </Chapter>

        {/* ═══ CLOSER ═══ */}
        <section style={{ padding: "100px 0 140px", borderTop: `1px solid ${LINE}`, textAlign: "center" }}>
          <Reveal>
            <h2 style={{
              ...sans, fontSize: "clamp(26px, 4.5vw, 42px)", fontWeight: 700,
              lineHeight: 1.2, maxWidth: 600, margin: "0 auto 24px", color: BONE,
            }}>
              The tell is taller.{" "}
              <span style={{ color: COPPER }}>Stay the kind of human that has the thing.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.3}>
            <div style={{
              ...mono, fontSize: 10, color: "rgba(255,255,255,0.18)",
              letterSpacing: 1, lineHeight: 2, marginTop: 56,
            }}>
              From a Saturday morning conversation · April 11, 2026<br />
              Memory, cognition, substrate, taste · the room we built together
            </div>
          </Reveal>
        </section>

      </div>
    </div>
  );
}
