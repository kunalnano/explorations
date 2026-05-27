import { useState, useEffect, useRef, useMemo } from "react";
import { C, F } from "../design.js";
import ConstellationCanvas, {
  COLORS,
  FONTS,
  getLangColor,
} from "./GitHubConstellationCanvas";

function DetailPanel({ selected, onClose }) {
  if (!selected) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: 12,
        right: 44,
        width: 280,
        background: "rgba(5,5,8,0.92)",
        border: `1px solid ${COLORS.goldDim}`,
        borderRadius: 6,
        padding: "20px 18px",
        zIndex: 10,
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: 10,
          right: 12,
          background: "none",
          border: "none",
          color: COLORS.ash,
          fontSize: 16,
          cursor: "pointer",
          fontFamily: FONTS.mono,
        }}
      >
        x
      </button>

      <a
        href={selected.html_url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          fontFamily: FONTS.mono,
          fontSize: 15,
          fontWeight: 600,
          color: COLORS.gold,
          textDecoration: "none",
          display: "block",
          marginBottom: 8,
          lineHeight: 1.3,
        }}
      >
        {selected.name}
      </a>

      {selected.description && (
        <p
          style={{
            fontFamily: FONTS.serif,
            fontSize: 13,
            color: COLORS.ash,
            lineHeight: 1.5,
            margin: "0 0 12px",
          }}
        >
          {selected.description}
        </p>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        {selected.language && (
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              fontSize: 12,
              fontFamily: FONTS.mono,
              color: COLORS.bone,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: getLangColor(selected.language),
                display: "inline-block",
              }}
            />
            {selected.language}
          </span>
        )}
        {selected.stargazers_count > 0 && (
          <span style={{ fontSize: 12, fontFamily: FONTS.mono, color: COLORS.goldDim }}>
            &#9733; {selected.stargazers_count}
          </span>
        )}
      </div>

      <div
        style={{
          fontSize: 11,
          fontFamily: FONTS.mono,
          color: COLORS.deepAsh,
          marginBottom: 10,
        }}
      >
        Updated{" "}
        {new Date(selected.updated_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </div>

      {selected.fork && (
        <div
          style={{
            fontSize: 11,
            fontFamily: FONTS.mono,
            color: COLORS.ash,
            marginBottom: 10,
            fontStyle: "italic",
          }}
        >
          Forked repository
        </div>
      )}

      {selected.topics && selected.topics.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 14 }}>
          {selected.topics.map((t) => (
            <span
              key={t}
              style={{
                fontSize: 10,
                fontFamily: FONTS.mono,
                color: COLORS.goldDim,
                border: `1px solid ${COLORS.deepAsh}`,
                borderRadius: 3,
                padding: "2px 6px",
              }}
            >
              {t}
            </span>
          ))}
        </div>
      )}

      <a
        href={selected.html_url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          fontFamily: FONTS.mono,
          fontSize: 11,
          color: COLORS.gold,
          textDecoration: "none",
          letterSpacing: "0.05em",
        }}
      >
        View on GitHub &rarr;
      </a>
    </div>
  );
}

function LanguageBar({ langCounts }) {
  const data = useMemo(() => {
    const total = Object.values(langCounts).reduce((a, b) => a + b, 0);
    return Object.entries(langCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([lang, count]) => ({
        lang,
        count,
        pct: (count / total) * 100,
        color: getLangColor(lang === "Unknown" ? null : lang),
      }));
  }, [langCounts]);

  if (data.length === 0) return null;

  return (
    <div style={{ maxWidth: 1100, margin: "32px auto 0", padding: "0 32px" }}>
      <div
        style={{
          fontFamily: FONTS.mono,
          fontSize: 10,
          letterSpacing: "0.12em",
          color: COLORS.goldDim,
          textTransform: "uppercase",
          marginBottom: 10,
        }}
      >
        Language Distribution
      </div>
      <div
        style={{
          display: "flex",
          height: 8,
          borderRadius: 4,
          overflow: "hidden",
          marginBottom: 12,
        }}
      >
        {data.map((d) => (
          <div
            key={d.lang}
            style={{
              width: `${d.pct}%`,
              background: d.color,
              minWidth: d.pct > 0 ? 2 : 0,
              transition: "width 0.5s ease",
            }}
            title={`${d.lang}: ${d.count}`}
          />
        ))}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 16px" }}>
        {data.slice(0, 12).map((d) => (
          <span
            key={d.lang}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              fontSize: 11,
              fontFamily: FONTS.mono,
              color: COLORS.ash,
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: d.color,
                display: "inline-block",
                flexShrink: 0,
              }}
            />
            {d.lang} ({d.count})
          </span>
        ))}
      </div>
    </div>
  );
}

export default function GitHubConstellation({ onBack }) {
  const [repos, setRepos] = useState(null);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [headerVisible, setHeaderVisible] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setHeaderVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const CACHE_KEY = "gh_constellation_repos";
    const CACHE_TTL = 60 * 60 * 1000; // 1 hour

    // Check cache first
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, ts } = JSON.parse(cached);
        if (Date.now() - ts < CACHE_TTL && Array.isArray(data)) {
          setRepos(data);
          return;
        }
      }
    } catch (_) {
      // Cache miss or corrupt, proceed to fetch
    }

    fetch("https://api.github.com/users/kunalnano/repos?per_page=100&sort=updated")
      .then((r) => {
        if (!r.ok) throw new Error(`GitHub API returned ${r.status}`);
        return r.json();
      })
      .then((data) => {
        if (!cancelled) {
          setRepos(data);
          try {
            localStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() }));
          } catch (_) {
            // Storage full, no-op
          }
        }
      })
      .catch((e) => {
        if (!cancelled) setError(e.message);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const langCounts = useMemo(() => {
    if (!repos) return {};
    const counts = {};
    for (const r of repos) {
      const lang = r.language || "Unknown";
      counts[lang] = (counts[lang] || 0) + 1;
    }
    return counts;
  }, [repos]);

  // Loading
  if (!repos && !error) {
    return (
      <div
        style={{
          background: COLORS.bg,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h1 style={{ position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap", border: 0 }}>
          GitHub constellation.
        </h1>
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: COLORS.gold,
            animation: "pulseGold 1.2s ease-in-out infinite",
          }}
        />
        <style>{`@keyframes pulseGold { 0%,100%{opacity:.3;transform:scale(.8)} 50%{opacity:1;transform:scale(1.3)} }`}</style>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div
        style={{
          background: COLORS.bg,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: COLORS.bone,
          fontFamily: FONTS.sans,
        }}
      >
        <div style={{ fontSize: 18, marginBottom: 12, color: COLORS.gold }}>
          Failed to load repositories
        </div>
        <div style={{ fontSize: 14, color: COLORS.ash }}>{error}</div>
        </div>
    );
  }

  return (
    <div style={{ background: COLORS.bg, minHeight: "100vh", color: COLORS.bone }}>
      {/* ═══ HERO — Apple-direction, gold dot in eyebrow + gold period on title ═══ */}
      <section style={{ padding: "112px 22px 64px", textAlign: "center", position: "relative" }}>
        <div style={{ maxWidth: 1024, margin: "0 auto" }}>
          <div
            style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              marginBottom: 28,
              opacity: headerVisible ? 1 : 0,
              transform: headerVisible ? "translateY(0)" : "translateY(8px)",
              transition: "opacity 0.8s ease, transform 0.8s ease",
            }}
          >
            <span style={{
              width: 7, height: 7, borderRadius: "50%",
              background: C.accent, display: "inline-block",
              boxShadow: `0 0 12px ${C.accent}`,
            }} />
            <span style={{
              fontFamily: F.text, fontSize: 13, fontWeight: 500,
              letterSpacing: "0.18em", textTransform: "uppercase",
              color: "rgba(245,245,247,0.55)",
            }}>
              Live from GitHub API
            </span>
          </div>

          <h1
            style={{
              fontFamily: F.display, fontWeight: 600,
              fontSize: "clamp(48px, 8vw, 96px)",
              lineHeight: 1.02, letterSpacing: "-0.045em",
              margin: "0 0 22px",
              color: "#f5f5f7",
              opacity: headerVisible ? 1 : 0,
              transform: headerVisible ? "translateY(0)" : "translateY(12px)",
              transition: "opacity 0.8s ease 0.1s, transform 0.8s ease 0.1s",
            }}
          >
            GitHub constellation<span style={{ color: C.accent }}>.</span>
          </h1>

          <p
            style={{
              fontFamily: F.display, fontWeight: 400,
              fontSize: "clamp(20px, 2.4vw, 28px)",
              lineHeight: 1.32, letterSpacing: "-0.022em",
              color: "rgba(245,245,247,0.65)",
              maxWidth: 640, margin: "0 auto",
              opacity: headerVisible ? 1 : 0,
              transform: headerVisible ? "translateY(0)" : "translateY(10px)",
              transition: "opacity 0.8s ease 0.25s, transform 0.8s ease 0.25s",
            }}
          >
            A living map of code, languages, and ideas.
          </p>
        </div>
      </section>

      {/* Canvas + detail panel */}
      <div
        ref={containerRef}
        style={{ maxWidth: 1100, margin: "28px auto 0", padding: "0 32px", position: "relative" }}
      >
        <ConstellationCanvas
          repos={repos}
          hovered={hovered}
          setHovered={setHovered}
          selected={selected}
          setSelected={setSelected}
          containerRef={containerRef}
        />
        <DetailPanel selected={selected} onClose={() => setSelected(null)} />
      </div>

      <LanguageBar langCounts={langCounts} />

      {/* Footer */}
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "48px 32px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.deepAsh, letterSpacing: "0.05em" }}>
          alsharma.com
        </span>
        <span style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.deepAsh }}>
          Data fetched live from GitHub. Repos shown: {repos ? repos.length : 0}
        </span>
      </div>
    </div>
  );
}
