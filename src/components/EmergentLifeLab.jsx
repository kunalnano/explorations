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
