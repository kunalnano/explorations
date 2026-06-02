import { useEffect, useRef } from "react";
import { C, F } from "../design.js";

const BG = "#050508";
const GLOW = "#00ffd5";

export default function EmergentLifeLab() {
  const iframeRef = useRef(null);

  useEffect(() => {
    const prev = document.body.style.background;
    document.body.style.background = BG;
    return () => { document.body.style.background = prev; };
  }, []);

  return (
    <div style={{ background: BG, minHeight: "100vh", color: "#e8e4dc" }}>

      {/* ═══ HERO — Apple-direction, cyan accent rule under title ═══ */}
      <section style={{
        padding: "112px 22px 64px", textAlign: "center",
        maxWidth: 1024, margin: "0 auto",
      }}>
        <div style={{
          fontFamily: F.text, fontSize: 13, fontWeight: 500,
          letterSpacing: "0.18em", textTransform: "uppercase",
          color: "rgba(245,245,247,0.55)", marginBottom: 28,
        }}>An interactive sandbox</div>
        <h1 style={{
          fontFamily: F.display, fontWeight: 600,
          fontSize: "clamp(48px, 8vw, 96px)",
          lineHeight: 1.04, letterSpacing: "-0.045em",
          margin: "0 0 22px", color: "#f5f5f7",
        }}>
          Emergent life lab<span style={{ color: GLOW }}>.</span>
        </h1>
        <div style={{
          width: 56, height: 1, background: GLOW,
          margin: "0 auto 28px", opacity: 0.8,
        }} />
        <p style={{
          fontFamily: F.display, fontWeight: 400,
          fontSize: "clamp(20px, 2.4vw, 28px)",
          lineHeight: 1.3, letterSpacing: "-0.022em",
          color: "rgba(245,245,247,0.65)",
          maxWidth: 640, margin: "0 auto",
        }}>
          Cellular automata, swarm dynamics, and synthesized sound. Tweak the parameters, watch life emerge.
        </p>
      </section>

      {/* ═══ LAB FRAME — the interactive iframe lives in a constrained surface ═══ */}
      <div style={{
        maxWidth: 1280, margin: "0 auto", padding: "0 22px 80px",
      }}>
        <div style={{
          borderRadius: 22, overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.08)",
          background: "#0a0a0f",
          height: "calc(100vh - 160px)", minHeight: 560,
        }}>
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
      </div>
    </div>
  );
}
