import { useState, useCallback, useMemo } from "react";

const TRADITIONS = [
  {
    id: "stoicism",
    name: "Stoicism",
    era: "3rd c. BCE – 2nd c. CE",
    color: "#3B82F6",
    x: 20, y: 18,
    thinkers: ["Marcus Aurelius", "Epictetus", "Seneca"],
    corePrinciple: "Master what you control; accept what you cannot.",
    decisionLens: "The Dichotomy of Control — before acting, separate what's in your power from what isn't. Energy spent on externals is energy wasted.",
    keyTexts: ["Meditations", "Discourses", "Letters from a Stoic"],
    practices: ["Morning premeditation of adversity", "Evening self-review", "Negative visualization (premeditatio malorum)"],
  },
  {
    id: "sunTzu",
    name: "Strategic Realism",
    era: "5th c. BCE",
    color: "#EF4444",
    x: 75, y: 15,
    thinkers: ["Sun Tzu", "Zhuge Liang", "Miyamoto Musashi"],
    corePrinciple: "Win without fighting; shape conditions before engagement.",
    decisionLens: "Terrain Analysis — every decision has a landscape. Map the forces, find asymmetric leverage, and strike only when conditions favor you.",
    keyTexts: ["The Art of War", "The Book of Five Rings", "36 Stratagems"],
    practices: ["Pre-mortem analysis", "Competitive terrain mapping", "Deception awareness"],
  },
  {
    id: "taoism",
    name: "Taoism",
    era: "4th c. BCE",
    color: "#10B981",
    x: 50, y: 50,
    thinkers: ["Lao Tzu", "Zhuangzi", "Liezi"],
    corePrinciple: "Act by not forcing; align with the natural flow.",
    decisionLens: "Wu Wei (effortless action) — the best decisions feel like water finding its path. Don't force outcomes; create conditions where the right result emerges.",
    keyTexts: ["Tao Te Ching", "Zhuangzi", "I Ching"],
    practices: ["Observe before acting", "Embrace paradox", "Simplify ruthlessly"],
  },
  {
    id: "buddhism",
    name: "Buddhism",
    era: "5th c. BCE",
    color: "#F59E0B",
    x: 20, y: 78,
    thinkers: ["Siddhartha Gautama", "Nagarjuna", "Thich Nhat Hanh"],
    corePrinciple: "Suffering arises from attachment; clarity arises from presence.",
    decisionLens: "Dependent Origination — every situation is a web of causes. See the full chain of conditions before you act, and question the desires driving your choice.",
    keyTexts: ["Dhammapada", "Heart Sutra", "Mūlamadhyamakakārikā"],
    practices: ["Mindful pause before decisions", "Attachment audit", "Impermanence reflection"],
  },
  {
    id: "greek",
    name: "Classical Greek",
    era: "5th-4th c. BCE",
    color: "#8B5CF6",
    x: 48, y: 85,
    thinkers: ["Socrates", "Plato", "Aristotle"],
    corePrinciple: "The examined life is the only life worth living.",
    decisionLens: "Dialectic Reasoning — stress-test every belief through rigorous questioning. Wisdom is knowing the limits of your own knowledge.",
    keyTexts: ["Republic", "Nicomachean Ethics", "Apology"],
    practices: ["Socratic questioning", "Seek the golden mean", "Define terms before debating"],
  },
  {
    id: "confucianism",
    name: "Confucianism",
    era: "5th c. BCE",
    color: "#EC4899",
    x: 78, y: 75,
    thinkers: ["Confucius", "Mencius", "Xunzi"],
    corePrinciple: "Right relationships and ritual create social harmony.",
    decisionLens: "Relational Ethics — every decision ripples through your relationships. Ask: does this uphold your responsibilities to others and strengthen trust?",
    keyTexts: ["Analects", "Mencius", "Doctrine of the Mean"],
    practices: ["Role-based duty review", "Ritual as discipline", "Continuous self-cultivation (xiuyang)"],
  },
];

const BRIDGES = [
  { from: "stoicism", to: "taoism", concept: "Acceptance & Non-Resistance", description: "Both teach releasing attachment to outcomes. Stoics call it amor fati; Taoists call it wu wei." },
  { from: "stoicism", to: "buddhism", concept: "Impermanence & Equanimity", description: "Both recognize that clinging to transient things causes suffering. Train the mind to remain steady." },
  { from: "stoicism", to: "greek", concept: "Virtue as Highest Good", description: "Stoicism is a direct descendant of Socratic ethics. Virtue (arete) is the sole good." },
  { from: "sunTzu", to: "taoism", concept: "Strategic Patience", description: "Sun Tzu's 'win without fighting' mirrors Taoist wu wei. The best generals shape conditions, not force." },
  { from: "sunTzu", to: "confucianism", concept: "Moral Authority", description: "Both emphasize that true leadership comes from character, not coercion. Win loyalty before battles." },
  { from: "taoism", to: "buddhism", concept: "Emptiness & Interconnection", description: "Taoist 'the Tao that can be named' and Buddhist sunyata both point to reality beyond concepts." },
  { from: "taoism", to: "confucianism", concept: "Complementary Opposites", description: "Historically the yin to Confucianism's yang. One flows; the other structures. Both are needed." },
  { from: "buddhism", to: "greek", concept: "Self-Knowledge & Inquiry", description: "Socratic 'know thyself' parallels Buddhist vipassana. Both use rigorous introspection to cut through delusion." },
  { from: "greek", to: "confucianism", concept: "Virtue Ethics & Character", description: "Aristotle's phronesis (practical wisdom) mirrors Confucian junzi (the exemplary person). Character is destiny." },
  { from: "buddhism", to: "confucianism", concept: "Compassion & Benevolence", description: "Buddhist karuna and Confucian ren (benevolence) both place care for others at the center of the good life." },
  { from: "stoicism", to: "sunTzu", concept: "Emotional Discipline", description: "Both demand mastery over emotion before action. A reactive leader loses; a composed one wins." },
  { from: "stoicism", to: "confucianism", concept: "Duty & Role Ethics", description: "Both emphasize fulfilling one's role with excellence. Stoic cosmopolitan duty meets Confucian relational duty." },
  { from: "greek", to: "sunTzu", concept: "Strategic Wisdom", description: "Aristotle's phronesis and Sun Tzu's strategic calculus both prize situational judgment over rigid rules." },
];

const NODE_RADIUS = 56;

function getNodeCenter(tradition) {
  return {
    x: (tradition.x / 100) * 960,
    y: (tradition.y / 100) * 600,
  };
}

function TraditionNode({ tradition, isSelected, isConnected, onSelect, dimmed }) {
  const center = getNodeCenter(tradition);
  const opacity = dimmed ? 0.15 : 1;
  const scale = isSelected ? 1.12 : isConnected ? 1.04 : 1;

  return (
    <g
      onClick={() => onSelect(tradition.id)}
      style={{ cursor: "pointer", transition: "opacity 0.3s", opacity }}
      transform={`translate(${center.x}, ${center.y}) scale(${scale})`}
    >
      <circle r={NODE_RADIUS} fill={tradition.color + "18"} stroke={tradition.color} strokeWidth={isSelected ? 3.5 : 2} style={{ transition: "all 0.3s" }} />
      <circle r={NODE_RADIUS - 6} fill="none" stroke={tradition.color + "40"} strokeWidth={1} strokeDasharray="4 3" />
      <text textAnchor="middle" dy="-6" fill={tradition.color} fontWeight="700" fontSize="13" style={{ userSelect: "none" }}>{tradition.name}</text>
      <text textAnchor="middle" dy="12" fill={tradition.color + "BB"} fontSize="9.5" style={{ userSelect: "none" }}>{tradition.era}</text>
    </g>
  );
}

function BridgeLine({ bridge, traditions, isHighlighted, dimmed, onHover, onClick }) {
  const fromT = traditions.find((t) => t.id === bridge.from);
  const toT = traditions.find((t) => t.id === bridge.to);
  const fromC = getNodeCenter(fromT);
  const toC = getNodeCenter(toT);
  const midX = (fromC.x + toC.x) / 2;
  const midY = (fromC.y + toC.y) / 2;
  const dx = toC.x - fromC.x;
  const dy = toC.y - fromC.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const nx = -dy / dist;
  const ny = dx / dist;
  const bulge = dist * 0.08;
  const cpX = midX + nx * bulge;
  const cpY = midY + ny * bulge;
  const opacity = dimmed ? 0.06 : isHighlighted ? 0.9 : 0.25;
  const strokeW = isHighlighted ? 2.5 : 1.2;
  const labelX = (fromC.x + 2 * cpX + toC.x) / 4;
  const labelY = (fromC.y + 2 * cpY + toC.y) / 4;

  return (
    <g onMouseEnter={() => onHover(bridge)} onMouseLeave={() => onHover(null)} onClick={() => onClick(bridge)} style={{ cursor: "pointer" }}>
      <path d={`M ${fromC.x} ${fromC.y} Q ${cpX} ${cpY} ${toC.x} ${toC.y}`} fill="none" stroke="#94A3B8" strokeWidth={strokeW} strokeDasharray={isHighlighted ? "none" : "6 4"} style={{ transition: "all 0.3s", opacity }} />
      {isHighlighted && (
        <text x={labelX} y={labelY - 8} textAnchor="middle" fontSize="10" fontWeight="600" fill="#334155" style={{ userSelect: "none" }}>{bridge.concept}</text>
      )}
    </g>
  );
}

function DetailPanel({ tradition, bridges, onClose }) {
  if (!tradition) return null;
  const relatedBridges = bridges.filter((b) => b.from === tradition.id || b.to === tradition.id);

  return (
    <div style={{ background: "#0F172A", border: `1px solid ${tradition.color}55`, borderRadius: 16, padding: "24px 28px", color: "#E2E8F0", maxHeight: "calc(100vh - 40px)", overflowY: "auto", position: "relative" }}>
      <button onClick={onClose} style={{ position: "absolute", top: 12, right: 16, background: "none", border: "none", color: "#94A3B8", fontSize: 20, cursor: "pointer", lineHeight: 1 }}>✕</button>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <div style={{ width: 14, height: 14, borderRadius: "50%", background: tradition.color }} />
        <h2 style={{ margin: 0, fontSize: 22, color: tradition.color }}>{tradition.name}</h2>
        <span style={{ color: "#64748B", fontSize: 13 }}>{tradition.era}</span>
      </div>
      <p style={{ color: "#CBD5E1", fontSize: 14, lineHeight: 1.65, margin: "0 0 18px", fontStyle: "italic", borderLeft: `3px solid ${tradition.color}44`, paddingLeft: 14 }}>{tradition.corePrinciple}</p>
      <div style={{ marginBottom: 18 }}>
        <h4 style={{ color: tradition.color, fontSize: 12, textTransform: "uppercase", letterSpacing: 1.5, margin: "0 0 8px" }}>Decision Lens</h4>
        <p style={{ color: "#94A3B8", fontSize: 13, lineHeight: 1.65, margin: 0 }}>{tradition.decisionLens}</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 18 }}>
        <div>
          <h4 style={{ color: tradition.color, fontSize: 12, textTransform: "uppercase", letterSpacing: 1.5, margin: "0 0 8px" }}>Key Thinkers</h4>
          {tradition.thinkers.map((t) => (<div key={t} style={{ color: "#CBD5E1", fontSize: 13, padding: "3px 0" }}>→ {t}</div>))}
        </div>
        <div>
          <h4 style={{ color: tradition.color, fontSize: 12, textTransform: "uppercase", letterSpacing: 1.5, margin: "0 0 8px" }}>Key Texts</h4>
          {tradition.keyTexts.map((t) => (<div key={t} style={{ color: "#CBD5E1", fontSize: 13, padding: "3px 0", fontStyle: "italic" }}>📜 {t}</div>))}
        </div>
      </div>
      <div style={{ marginBottom: 18 }}>
        <h4 style={{ color: tradition.color, fontSize: 12, textTransform: "uppercase", letterSpacing: 1.5, margin: "0 0 8px" }}>Practices</h4>
        {tradition.practices.map((p) => (<div key={p} style={{ color: "#CBD5E1", fontSize: 13, padding: "4px 0", paddingLeft: 8, borderLeft: `2px solid ${tradition.color}33` }}>{p}</div>))}
      </div>
      {relatedBridges.length > 0 && (
        <div>
          <h4 style={{ color: "#F59E0B", fontSize: 12, textTransform: "uppercase", letterSpacing: 1.5, margin: "0 0 10px" }}>⚡ Connections</h4>
          {relatedBridges.map((b, i) => {
            const otherT = TRADITIONS.find((t) => t.id === (b.from === tradition.id ? b.to : b.from));
            return (
              <div key={i} style={{ background: "#1E293B", borderRadius: 10, padding: "10px 14px", marginBottom: 8 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: otherT.color, marginBottom: 4 }}>↔ {otherT.name}: {b.concept}</div>
                <div style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.55 }}>{b.description}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function BridgePanel({ bridge, onClose }) {
  if (!bridge) return null;
  const fromT = TRADITIONS.find((t) => t.id === bridge.from);
  const toT = TRADITIONS.find((t) => t.id === bridge.to);
  return (
    <div style={{ background: "#0F172A", border: "1px solid #334155", borderRadius: 16, padding: "24px 28px", color: "#E2E8F0", position: "relative" }}>
      <button onClick={onClose} style={{ position: "absolute", top: 12, right: 16, background: "none", border: "none", color: "#94A3B8", fontSize: 20, cursor: "pointer" }}>✕</button>
      <h3 style={{ margin: "0 0 6px", fontSize: 18, color: "#F59E0B" }}>{bridge.concept}</h3>
      <div style={{ fontSize: 12, color: "#64748B", marginBottom: 14 }}>
        <span style={{ color: fromT.color }}>{fromT.name}</span> ↔ <span style={{ color: toT.color }}>{toT.name}</span>
      </div>
      <p style={{ color: "#CBD5E1", fontSize: 14, lineHeight: 1.7, margin: 0 }}>{bridge.description}</p>
    </div>
  );
}

export default function AncientWisdomMap() {
  const [selected, setSelected] = useState(null);
  const [hoveredBridge, setHoveredBridge] = useState(null);
  const [selectedBridge, setSelectedBridge] = useState(null);
  const selectedTradition = TRADITIONS.find((t) => t.id === selected);

  const connectedIds = useMemo(() => {
    if (!selected) return new Set();
    const ids = new Set();
    BRIDGES.forEach((b) => {
      if (b.from === selected) ids.add(b.to);
      if (b.to === selected) ids.add(b.from);
    });
    ids.add(selected);
    return ids;
  }, [selected]);

  const hoveredIds = useMemo(() => {
    if (!hoveredBridge) return new Set();
    return new Set([hoveredBridge.from, hoveredBridge.to]);
  }, [hoveredBridge]);

  const handleSelect = useCallback((id) => {
    setSelectedBridge(null);
    setSelected((prev) => (prev === id ? null : id));
  }, []);

  const handleBridgeClick = useCallback((bridge) => {
    setSelected(null);
    setSelectedBridge((prev) => (prev === bridge ? null : bridge));
  }, []);

  const activeFilter = selected || hoveredBridge || selectedBridge;

  return (
    <div style={{ background: "#0B1120", minHeight: "100vh", fontFamily: "'Inter', system-ui, sans-serif", padding: 20 }}>
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <h1 style={{ color: "#E2E8F0", fontSize: 26, fontWeight: 800, margin: "0 0 6px", letterSpacing: -0.5 }}>Ancient Wisdom · Decision Map</h1>
        <p style={{ color: "#64748B", fontSize: 13, margin: 0 }}>Click a tradition to explore · Hover connections to see bridges · Click connections for details</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: selected || selectedBridge ? "1fr 380px" : "1fr", gap: 20, maxWidth: 1400, margin: "0 auto" }}>
        <div style={{ background: "#111827", borderRadius: 16, border: "1px solid #1E293B", overflow: "hidden" }}>
          <svg viewBox="0 0 960 600" style={{ width: "100%", display: "block" }}>
            <defs><radialGradient id="glow"><stop offset="0%" stopColor="#1E293B" /><stop offset="100%" stopColor="#0B1120" /></radialGradient></defs>
            <rect width="960" height="600" fill="url(#glow)" />
            {BRIDGES.map((bridge, i) => {
              const isHighlighted = hoveredBridge === bridge || selectedBridge === bridge || (selected && (bridge.from === selected || bridge.to === selected));
              const dimmed = activeFilter && !isHighlighted;
              return <BridgeLine key={i} bridge={bridge} traditions={TRADITIONS} isHighlighted={isHighlighted} dimmed={dimmed} onHover={setHoveredBridge} onClick={handleBridgeClick} />;
            })}
            {TRADITIONS.map((t) => {
              const isSelected = selected === t.id;
              const isConnected = connectedIds.has(t.id) || hoveredIds.has(t.id);
              const dimmed = activeFilter && !isSelected && !isConnected && !(selectedBridge && (selectedBridge.from === t.id || selectedBridge.to === t.id));
              return <TraditionNode key={t.id} tradition={t} isSelected={isSelected} isConnected={isConnected} dimmed={dimmed} onSelect={handleSelect} />;
            })}
          </svg>
        </div>
        {(selectedTradition || selectedBridge) && (
          <div>
            {selectedTradition && <DetailPanel tradition={selectedTradition} bridges={BRIDGES} onClose={() => setSelected(null)} />}
            {selectedBridge && <BridgePanel bridge={selectedBridge} onClose={() => setSelectedBridge(null)} />}
          </div>
        )}
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap", marginTop: 16 }}>
        {TRADITIONS.map((t) => (
          <button key={t.id} onClick={() => handleSelect(t.id)} style={{ background: selected === t.id ? t.color + "22" : "transparent", border: `1px solid ${selected === t.id ? t.color : "#334155"}`, borderRadius: 20, padding: "6px 16px", color: selected === t.id ? t.color : "#94A3B8", fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>{t.name}</button>
        ))}
      </div>
    </div>
  );
}
