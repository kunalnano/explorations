import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

// ── Typography ─────────────────────────────────────────────
const SERIF = "'Fraunces', Georgia, serif";
const MONO = "'JetBrains Mono', 'SF Mono', ui-monospace, monospace";
const AMBER = "#ffc878";

// ── Beats ──────────────────────────────────────────────────
const BEATS = [
  { id: "I",   line1: "Every system has a center.", line2: "Someone stands there." },
  { id: "II",  line1: "Pull back far enough",        line2: "and the center looks small." },
  { id: "III", line1: "What survives the distance",  line2: "is the work." },
];

export default function Operator({ onBegin }) {
  const mountRef = useRef(null);
  const [progress, setProgress] = useState(0);

  // Reset window scroll when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // ── Three.js scene ───────────────────────────────────────
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.0008);

    const camera = new THREE.PerspectiveCamera(
      60,
      mount.clientWidth / mount.clientHeight,
      0.1,
      5000
    );
    camera.position.set(0, 0, 6);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 1);
    mount.appendChild(renderer.domElement);

    // ── Galaxy ───────────────────────────────────────────
    const COUNT = 35000;
    const RADIUS = 250;
    const BRANCHES = 5;
    const SPIN = 1.2;
    const RAND = 0.4;
    const RAND_POW = 2.5;
    const inside = new THREE.Color(0xffc878);
    const outside = new THREE.Color(0x5a78ff);

    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);

    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3;
      const r = Math.pow(Math.random(), 1.4) * RADIUS;
      const branchAngle = ((i % BRANCHES) / BRANCHES) * Math.PI * 2;
      const spinAngle = (r * SPIN) / RADIUS * Math.PI;

      const sign = () => (Math.random() < 0.5 ? 1 : -1);
      const rx = Math.pow(Math.random(), RAND_POW) * sign() * RAND * r * 0.3;
      const ry = Math.pow(Math.random(), RAND_POW) * sign() * RAND * r * 0.08;
      const rz = Math.pow(Math.random(), RAND_POW) * sign() * RAND * r * 0.3;

      positions[i3]     = Math.cos(branchAngle + spinAngle) * r + rx;
      positions[i3 + 1] = ry;
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * r + rz;

      const mixed = inside.clone().lerp(outside, r / RADIUS);
      colors[i3]     = mixed.r;
      colors[i3 + 1] = mixed.g;
      colors[i3 + 2] = mixed.b;
    }

    const galaxyGeo = new THREE.BufferGeometry();
    galaxyGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    galaxyGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const galaxyMat = new THREE.PointsMaterial({
      size: 0.55,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const galaxy = new THREE.Points(galaxyGeo, galaxyMat);
    scene.add(galaxy);

    // ── Central star ─────────────────────────────────────
    const starGroup = new THREE.Group();
    const coreGeo = new THREE.SphereGeometry(0.45, 32, 32);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0xfff4dd });
    starGroup.add(new THREE.Mesh(coreGeo, coreMat));

    const glowLayers = [
      { size: 0.85, opacity: 0.55 },
      { size: 1.35, opacity: 0.32 },
      { size: 2.2,  opacity: 0.18 },
      { size: 3.6,  opacity: 0.08 },
    ];
    const glowMeshes = [];
    const glowGeos = [];
    const glowMats = [];
    glowLayers.forEach(({ size, opacity }) => {
      const g = new THREE.SphereGeometry(size, 32, 32);
      const m = new THREE.MeshBasicMaterial({
        color: 0xffc878,
        transparent: true,
        opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const mesh = new THREE.Mesh(g, m);
      starGroup.add(mesh);
      glowMeshes.push(mesh);
      glowGeos.push(g);
      glowMats.push(m);
    });
    scene.add(starGroup);

    // ── Background stars ─────────────────────────────────
    const BG_COUNT = 1000;
    const bgPos = new Float32Array(BG_COUNT * 3);
    for (let i = 0; i < BG_COUNT; i++) {
      const i3 = i * 3;
      const r = 900 + Math.random() * 1800;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      bgPos[i3]     = r * Math.sin(phi) * Math.cos(theta);
      bgPos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      bgPos[i3 + 2] = r * Math.cos(phi);
    }
    const bgGeo = new THREE.BufferGeometry();
    bgGeo.setAttribute("position", new THREE.BufferAttribute(bgPos, 3));
    const bgMat = new THREE.PointsMaterial({
      size: 1.4,
      color: 0xffffff,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
    });
    scene.add(new THREE.Points(bgGeo, bgMat));

    // ── Animation loop ───────────────────────────────────
    let frameId;
    let t = 0;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      t += 0.0008;
      galaxy.rotation.y = t * 0.5;
      const pulse = 1 + Math.sin(t * 50) * 0.04;
      glowMeshes.forEach((m) => m.scale.setScalar(pulse));
      renderer.render(scene, camera);
    };
    animate();

    // ── Scroll coupling ──────────────────────────────────
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const p = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
      setProgress(p);
      const eased = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      camera.position.z = 6 + eased * 380;
      camera.position.y = eased * 110;
      camera.lookAt(0, 0, 0);
    };

    const handleResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    handleScroll();

    // ── Cleanup ──────────────────────────────────────────
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      galaxyGeo.dispose();
      galaxyMat.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      bgGeo.dispose();
      bgMat.dispose();
      glowGeos.forEach((g) => g.dispose());
      glowMats.forEach((m) => m.dispose());
      renderer.dispose();
    };
  }, []);

  // ── Render ───────────────────────────────────────────────
  return (
    <div style={{ background: "#000", color: "#fff", minHeight: "100vh", position: "relative", fontFamily: SERIF }}>
      {/* WebGL canvas */}
      <div ref={mountRef} style={{ position: "fixed", inset: 0, zIndex: 0 }} />

      {/* Vignette */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 10,
          pointerEvents: "none",
          background: "radial-gradient(ellipse at center, transparent 0%, transparent 45%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      {/* Top chrome */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 30, padding: "24px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: AMBER, boxShadow: `0 0 12px ${AMBER}` }} />
          <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.35em", color: "rgba(255,236,200,0.7)" }}>
            OPERATOR
          </span>
        </div>
        <button
          onClick={onBegin}
          style={{
            fontFamily: MONO,
            fontSize: 10,
            letterSpacing: "0.35em",
            color: "rgba(255,236,200,0.75)",
            background: "transparent",
            border: "1px solid rgba(255,236,200,0.2)",
            borderRadius: 999,
            padding: "8px 16px",
            cursor: "pointer",
            transition: "all 0.25s ease",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,236,200,0.5)"; e.currentTarget.style.color = "#ffecc8"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,236,200,0.2)"; e.currentTarget.style.color = "rgba(255,236,200,0.75)"; }}
        >
          SKIP INTRO →
        </button>
      </div>

      {/* Scroll progress */}
      <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 30, fontFamily: MONO }}>
        <div style={{ fontSize: 10, letterSpacing: "0.3em", color: "rgba(255,236,200,0.45)", marginBottom: 8, textAlign: "right" }}>
          {String(Math.round(progress * 100)).padStart(3, "0")}
        </div>
        <div style={{ width: 96, height: 1, background: "rgba(255,255,255,0.1)" }}>
          <div style={{ width: `${progress * 100}%`, height: "100%", background: `linear-gradient(90deg, ${AMBER}, #ffe5b8)`, transition: "width 120ms linear" }} />
        </div>
      </div>

      {/* Content sections */}
      <div style={{ position: "relative", zIndex: 20 }}>
        {/* Hero */}
        <section style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 24px" }}>
          <div style={{ textAlign: "center", maxWidth: 768, pointerEvents: "none" }}>
            <p style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.45em", color: "rgba(255,236,200,0.5)", marginBottom: 32 }}>
              ARCHIVE  /  VOLUME  I
            </p>
            <h1 style={{
              fontFamily: SERIF,
              fontSize: "clamp(64px, 14vw, 168px)",
              fontWeight: 300,
              fontVariationSettings: '"opsz" 144',
              letterSpacing: "-0.025em",
              lineHeight: 0.92,
              color: "#fff",
            }}>
              The<br />
              <span style={{ fontStyle: "italic", fontWeight: 300, color: AMBER }}>Operator</span>
            </h1>
            <p style={{
              fontFamily: SERIF,
              marginTop: 32,
              fontSize: "clamp(16px, 1.6vw, 20px)",
              fontStyle: "italic",
              fontWeight: 300,
              color: "rgba(255,255,255,0.65)",
              maxWidth: 480,
              marginLeft: "auto",
              marginRight: "auto",
              lineHeight: 1.6,
            }}>
              Field notes on calm execution under load.
            </p>
            <p style={{
              fontFamily: MONO,
              fontSize: 10,
              letterSpacing: "0.45em",
              color: "rgba(255,236,200,0.4)",
              marginTop: 80,
              animation: "operatorPulse 2s ease-in-out infinite",
            }}>
              SCROLL TO PULL BACK
            </p>
          </div>
        </section>

        {/* Beats */}
        {BEATS.map((b) => (
          <section key={b.id} style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 24px" }}>
            <div style={{ textAlign: "center", maxWidth: 640, pointerEvents: "none" }}>
              <p style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.45em", color: "rgba(255,200,120,0.45)", marginBottom: 24 }}>
                — {b.id} —
              </p>
              <p style={{
                fontFamily: SERIF,
                fontSize: "clamp(28px, 4.5vw, 56px)",
                fontWeight: 300,
                lineHeight: 1.15,
                letterSpacing: "-0.01em",
                color: "rgba(255,255,255,0.92)",
              }}>
                {b.line1}<br />
                <span style={{ fontStyle: "italic", color: AMBER }}>{b.line2}</span>
              </p>
            </div>
          </section>
        ))}

        {/* CTA → BEGIN BRIEFING */}
        <section style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 24px" }}>
          <div style={{ textAlign: "center", maxWidth: 560 }}>
            <p style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.45em", color: "rgba(255,236,200,0.4)", marginBottom: 32 }}>
              ARCHIVE  /  ENTRY
            </p>
            <p style={{
              fontFamily: SERIF,
              fontSize: "clamp(24px, 3vw, 38px)",
              fontWeight: 300,
              color: "rgba(255,255,255,0.85)",
              lineHeight: 1.4,
              marginBottom: 48,
            }}>
              Begin where <em style={{ color: AMBER }}>the work</em> begins.
            </p>
            <button
              onClick={onBegin}
              style={{
                fontFamily: MONO,
                fontSize: 11,
                letterSpacing: "0.45em",
                color: "rgba(255,228,170,0.95)",
                border: "1px solid rgba(255,228,170,0.45)",
                background: "transparent",
                padding: "16px 40px",
                borderRadius: 999,
                cursor: "pointer",
                transition: "all 0.25s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,228,170,0.1)";
                e.currentTarget.style.borderColor = "rgba(255,228,170,0.75)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = "rgba(255,228,170,0.45)";
              }}
            >
              BEGIN  BRIEFING  →
            </button>
          </div>
        </section>
      </div>

      <style>{`
        @keyframes operatorPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}
