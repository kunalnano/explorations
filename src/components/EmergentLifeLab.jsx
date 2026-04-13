import { useEffect, useRef } from "react";

const BG = "#050508";

export default function EmergentLifeLab({ onBack }) {
  const iframeRef = useRef(null);

  useEffect(() => {
    // Lock body scroll while lab is active
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, background: BG, zIndex: 10 }}>
      {/* Back button overlay */}
      <button
        onClick={onBack}
        style={{
          position: "absolute",
          top: 12,
          left: 12,
          zIndex: 100,
          background: "rgba(10,10,15,0.85)",
          border: "1px solid rgba(0,255,213,0.3)",
          color: "#00ffd5",
          fontFamily: "'SF Mono', 'Fira Code', monospace",
          fontSize: 11,
          letterSpacing: 2,
          padding: "6px 14px",
          borderRadius: 3,
          cursor: "pointer",
          backdropFilter: "blur(8px)",
          transition: "all 0.2s",
        }}
        onMouseOver={(e) => {
          e.target.style.borderColor = "#00ffd5";
          e.target.style.boxShadow = "0 0 12px rgba(0,255,213,0.3)";
        }}
        onMouseOut={(e) => {
          e.target.style.borderColor = "rgba(0,255,213,0.3)";
          e.target.style.boxShadow = "none";
        }}
      >
        ← BACK
      </button>

      <iframe
        ref={iframeRef}
        src="/life-lab.html"
        title="Emergent Life Lab"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          display: "block",
        }}
        allow="autoplay"
      />
    </div>
  );
}
