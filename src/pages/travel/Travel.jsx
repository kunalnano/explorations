import { useEffect, useMemo, useState } from "react";
import valDiFunesImg from "./images/val-di-funes.jpg";
import valDiFunes2Img from "./images/val-di-funes-2.jpg";
import valDiFunes3Img from "./images/val-di-funes-3.jpg";
import switzerlandImg from "./images/switzerland.jpg";
import switzerland2Img from "./images/switzerland-2.jpg";
import switzerland3Img from "./images/switzerland-3.jpg";
import sayulitaImg from "./images/sayulita.jpg";
import sayulita2Img from "./images/sayulita-2.jpg";
import sayulita3Img from "./images/sayulita-3.jpg";
import medellinImg from "./images/medellin.jpg";
import altaImg from "./images/alta.jpg";
import alta2Img from "./images/alta-2.jpg";
import patagoniaImg from "./images/patagonia.jpg";

// ── Typography ────────────────────────────────────────────
const SERIF =
  '"Crimson Pro", "Crimson Text", Georgia, "Times New Roman", serif';
const MONO =
  '"JetBrains Mono", "SF Mono", "Cascadia Code", Consolas, "Liberation Mono", monospace';

// Inline grain SVG, rendered once via data URI
const GRAIN_SVG = encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'>
    <filter id='n'>
      <feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/>
      <feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0'/>
    </filter>
    <rect width='100%' height='100%' filter='url(#n)' opacity='0.6'/>
  </svg>`
);

// Status badge palette — variants kept for forward compatibility as
// destinations move along the pipeline (researching → must-see → booked).
const BADGE = {
  amber: { bg: "rgba(251, 191, 36, 0.14)", fg: "#fbbf24", border: "rgba(251, 191, 36, 0.45)" },
  blue:  { bg: "rgba(96, 165, 250, 0.14)", fg: "#93c5fd", border: "rgba(96, 165, 250, 0.45)" },
  green: { bg: "rgba(34, 197, 94, 0.16)",  fg: "#86efac", border: "rgba(34, 197, 94, 0.45)" },
};

// Status -> badge variant. Anything not listed falls back to amber.
const STATUS_VARIANT = {
  "must-see":    "amber",
  "researching": "blue",
  "booked":      "green",
};

// Build a Google Maps URL from numeric coords.
const mapsUrl = (lat, lng) =>
  `https://www.google.com/maps?q=${lat},${lng}`;

// "46.6455°, 11.7175°" — signed decimals, the way the source data is shaped.
const fmtCoords = (lat, lng) => `${lat}°, ${lng}°`;

// ── Destination data ──────────────────────────────────────
const DESTINATIONS = [
  {
    id: "val-di-funes",
    name: "Val di Funes",
    emoji: "⛪",
    image: valDiFunesImg,
    country: "Italy",
    region: "Dolomites, South Tyrol",
    status: "must-see",
    hero: "Santa Maddalena & the Odle Peaks",
    tag: "birthday trip",
    color: "#2d6a4f",
    accent: "#95d5b2",
    description:
      "The Panoramaweg viewpoint above Santa Maddalena village — church spire framed by the Odle/Geisler mountain group catching golden alpenglow at sunset.",
    highlights: [
      "Panoramaweg viewpoint (///received.singed.clever)",
      "Chiesa di Santa Maddalena",
      "Church of St. John in Ranui (€4 entry)",
      "Adolf Munkel Trail from Zanses",
      "Hotel Tyrol Dolomites — book Geisler Blick room",
    ],
    logistics:
      "Fly Venice/Innsbruck → rent car → 30min from Bressanone. Park at Fermeda Parkplatz (€4/day). 20min walk to viewpoint.",
    bestTime: "Late May – Oct (green meadows). Sep–Oct for autumn foliage. Sunset for alpenglow.",
    coords: { lat: 46.6455, lng: 11.7175 },
    gallery: [
      { src: valDiFunes2Img, caption: "Alpine ridges at golden hour" },
      { src: valDiFunes3Img, caption: "Hiking the Geisler/Odle group" },
    ],
  },
  {
    id: "switzerland",
    name: "Switzerland",
    emoji: "🏔️",
    image: switzerlandImg,
    country: "Switzerland",
    region: "Alps",
    status: "must-see",
    hero: "Alpine Grandeur",
    tag: null,
    color: "#c1121f",
    accent: "#fdf0d5",
    description:
      "Swiss precision meets raw alpine beauty — glaciers, lakes, trains threading through impossible passes.",
    highlights: [
      "Jungfrau Region (Grindelwald, Lauterbrunnen)",
      "Zermatt & the Matterhorn",
      "Glacier Express rail journey",
      "Lake Lucerne & Rigi",
      "Interlaken for adventure sports",
    ],
    logistics:
      "Fly Zurich or Geneva. Swiss Travel Pass for trains. Book mountain hotels 3+ months ahead in summer.",
    bestTime: "Jun–Sep for hiking. Dec–Mar for skiing. Shoulder months (May, Oct) for fewer crowds.",
    coords: { lat: 46.5935, lng: 7.908 },
    gallery: [
      { src: switzerland2Img, caption: "Alpine peak above the cloud sea" },
      { src: switzerland3Img, caption: "Lauterbrunnen valley & waterfalls" },
    ],
  },
  {
    id: "sayulita",
    name: "Sayulita",
    emoji: "🏄",
    image: sayulitaImg,
    country: "Mexico",
    region: "Riviera Nayarit",
    status: "must-see",
    hero: "Surf & Soul",
    tag: "surfing",
    color: "#e07a00",
    accent: "#fff3b0",
    description:
      "Bohemian beach town on the Pacific coast. Perfect beginner-to-intermediate surf breaks, incredible ceviche, and a pace that forces you to decompress.",
    highlights: [
      "Surf lessons at the main break",
      "Playa de los Muertos (quieter beach)",
      "Fresh seafood at street-side mariscos",
      "Day trip to Islas Marietas",
      "Mezcal tastings",
    ],
    logistics:
      "Fly PVR (Puerto Vallarta). 45min drive north. Stay in town — walking distance to everything.",
    bestTime: "Nov–Apr (dry season, best surf). Avoid Aug (rain + humidity).",
    coords: { lat: 20.8684, lng: -105.4413 },
    gallery: [
      { src: sayulita2Img, caption: "Pacific sunset on a soft-sand beach" },
      { src: sayulita3Img, caption: "In the barrel" },
    ],
  },
  {
    id: "medellin",
    name: "Medellín",
    emoji: "🌺",
    image: medellinImg,
    country: "Colombia",
    region: "Antioquia",
    status: "must-see",
    hero: "City of Eternal Spring",
    tag: null,
    color: "#7b2d8b",
    accent: "#f0c6ff",
    description:
      "Perfect year-round climate, world-class coffee, vibrant neighborhoods, and a city that reinvented itself.",
    highlights: [
      "El Poblado & Laureles neighborhoods",
      "Comuna 13 street art & escalators",
      "Coffee farm day trip (Jardín or Santa Elena)",
      "Guatapé & El Peñol day trip",
      "Parque Arví via Metrocable",
    ],
    logistics:
      "Fly MDE direct from US hubs. Uber/InDrive everywhere. Stay El Poblado (tourist) or Laureles (local vibe).",
    bestTime: "Year-round (spring climate). Dec–Mar and Jun–Aug are driest.",
    coords: { lat: 6.2442, lng: -75.5812 },
    gallery: [],
  },
  {
    id: "alta",
    name: "Alta",
    emoji: "🌌",
    image: altaImg,
    country: "Norway",
    region: "Finnmark, Arctic Norway",
    status: "must-see",
    hero: "Northern Lights Capital",
    tag: null,
    color: "#003566",
    accent: "#90e0ef",
    description:
      "One of the best places on Earth to see the aurora borealis. Midnight sun in summer, polar night in winter. Raw, remote, and humbling.",
    highlights: [
      "Northern Lights hunting (Sep–Mar)",
      "Alta Canyon — northern Europe's largest",
      "Sámi culture & reindeer sledding",
      "Ice hotel / igloo stays",
      "Midnight sun (May–Jul)",
    ],
    logistics:
      "Fly Oslo → Alta (SAS/Widerøe). Rent a car — chase clear skies. Dress for -20°C in winter.",
    bestTime: "Sep–Mar for Northern Lights. Nov–Jan for polar night drama. Jun–Jul for midnight sun.",
    coords: { lat: 69.9689, lng: 23.2716 },
    gallery: [
      { src: alta2Img, caption: "Aurora over the boreal forest" },
    ],
  },
  {
    id: "patagonia",
    name: "Patagonia",
    emoji: "🧊",
    image: patagoniaImg,
    country: "Argentina / Chile",
    region: "Southern Andes",
    status: "must-see",
    hero: "End of the World",
    tag: null,
    color: "#1b4965",
    accent: "#bee9e8",
    description:
      "Glaciers calving into turquoise lakes, granite spires punching through clouds, and wind that makes you feel genuinely small.",
    highlights: [
      "Torres del Paine W Trek (Chile)",
      "Perito Moreno Glacier (Argentina)",
      "El Chaltén & Fitz Roy",
      "Tierra del Fuego & Ushuaia",
      "Estancia stays (working ranches)",
    ],
    logistics:
      "Fly Buenos Aires → El Calafate (Argentina) or Punta Arenas (Chile). Book refugios months ahead for W Trek.",
    bestTime: "Nov–Mar (Patagonian summer). Shoulder months (Nov, Mar) are ideal.",
    coords: { lat: -50.9423, lng: -73.4068 },
    gallery: [],
  },
];

const FILTERS = [
  { id: "all",            label: "all" },
  { id: "birthday trip",  label: "birthday trip" },
  { id: "surfing",        label: "surfing" },
];

// ── Component ─────────────────────────────────────────────
export default function Travel() {
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState(null);

  // Inject Google Fonts (Crimson Pro + JetBrains Mono). System fallbacks
  // keep the page readable if the network is blocked.
  useEffect(() => {
    const id = "travel-fonts";
    if (document.getElementById(id)) return;
    const preconnect1 = document.createElement("link");
    preconnect1.rel = "preconnect";
    preconnect1.href = "https://fonts.googleapis.com";
    const preconnect2 = document.createElement("link");
    preconnect2.rel = "preconnect";
    preconnect2.href = "https://fonts.gstatic.com";
    preconnect2.crossOrigin = "";
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,400;0,500;0,600;1,400&family=JetBrains+Mono:wght@400;500;600&display=swap";
    document.head.appendChild(preconnect1);
    document.head.appendChild(preconnect2);
    document.head.appendChild(link);
  }, []);

  const visible = useMemo(
    () =>
      filter === "all"
        ? DESTINATIONS
        : DESTINATIONS.filter((d) => d.tag === filter),
    [filter]
  );

  const toggle = (id) => setExpanded((cur) => (cur === id ? null : id));

  return (
    <div style={S.shell}>
      {/* Grain overlay */}
      <div style={S.grain} aria-hidden="true" />

      <div style={S.container}>
        <header style={S.header}>
          <div style={S.eyebrow}>HANK · TRAVEL INDEX</div>
          <h1 style={S.title}>Bucket List</h1>
          <p style={S.lede}>
            Six places I want to go, why, and the smallest plausible plan to
            actually get there. Updated whenever the calendar shifts.
          </p>
        </header>

        <nav style={S.filterRow} aria-label="filter destinations">
          {FILTERS.map((f) => {
            const active = f.id === filter;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                style={{
                  ...S.filterBtn,
                  ...(active ? S.filterBtnActive : null),
                }}
              >
                {f.label}
              </button>
            );
          })}
        </nav>

        <main style={S.grid}>
          {visible.map((d) => (
            <DestinationCard
              key={d.id}
              dest={d}
              expanded={expanded === d.id}
              onToggle={() => toggle(d.id)}
            />
          ))}
        </main>

        {visible.length === 0 && (
          <div style={S.empty}>
            No destinations under this filter yet. Check back.
          </div>
        )}

        <footer style={S.footer}>Hank's Travel Index · 2026</footer>
      </div>
    </div>
  );
}

function DestinationCard({ dest, expanded, onToggle }) {
  const variant = STATUS_VARIANT[dest.status] || "amber";
  const badge = BADGE[variant];
  const gallery = dest.gallery || [];
  const slides = [{ src: dest.image, caption: dest.hero }, ...gallery];
  const [slideIdx, setSlideIdx] = useState(0);
  // Reset to hero when the card collapses, so re-expand starts fresh.
  useEffect(() => {
    if (!expanded) setSlideIdx(0);
  }, [expanded]);
  const activeSrc = slides[slideIdx]?.src || dest.image;
  const cardStyle = expanded
    ? { ...S.card, ...S.cardExpanded }
    : S.card;
  const imgStyle = {
    ...S.cardImage,
    height: expanded ? 340 : 200,
    backgroundImage: `url(${activeSrc})`,
  };

  return (
    <article
      style={cardStyle}
      onClick={onToggle}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle();
        }
      }}
      aria-expanded={expanded}
    >
      <div style={imgStyle} role="img" aria-label={dest.name}>
        <div style={S.imageOverlay} />
        {dest.tag && <div style={S.tagTopLeft}>★ {dest.tag}</div>}
        <div
          style={{
            ...S.statusBadge,
            background: badge.bg,
            color: badge.fg,
            borderColor: badge.border,
          }}
        >
          {dest.status}
        </div>
        <div style={S.nameOverlay}>
          <span style={S.cardEmoji} aria-hidden="true">{dest.emoji}</span>
          <span style={S.cardName}>{dest.name}</span>
        </div>
      </div>

      <div style={S.cardBody}>
        <div style={S.subtitle}>
          {dest.region} <span style={S.dot}>·</span> {dest.country}
        </div>
        <p style={S.tagline}>{dest.hero}</p>

        {expanded && (
          <div style={S.details} onClick={(e) => e.stopPropagation()}>
            {slides.length > 1 && (
              <div style={S.gallery} role="tablist" aria-label={`${dest.name} photos`}>
                {slides.map((s, i) => {
                  const isActive = i === slideIdx;
                  return (
                    <button
                      key={i}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      aria-label={s.caption || `Photo ${i + 1}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSlideIdx(i);
                      }}
                      style={{
                        ...S.thumb,
                        ...(isActive ? S.thumbActive : null),
                        backgroundImage: `url(${s.src})`,
                      }}
                    >
                      <span style={S.srOnly}>{s.caption || `Photo ${i + 1}`}</span>
                    </button>
                  );
                })}
                {slides[slideIdx]?.caption && (
                  <div style={S.galleryCaption}>{slides[slideIdx].caption}</div>
                )}
              </div>
            )}

            <p style={S.description}>{dest.description}</p>

            <h3 style={S.h3}>Must-do</h3>
            <ul style={S.list}>
              {dest.highlights.map((m, i) => (
                <li key={i} style={S.li}>{m}</li>
              ))}
            </ul>

            <h3 style={S.h3}>Logistics</h3>
            <p style={S.detailPara}>{dest.logistics}</p>

            <h3 style={S.h3}>Best time</h3>
            <p style={S.detailPara}>{dest.bestTime}</p>

            <div style={S.coordsRow}>
              <span style={S.coords}>
                {fmtCoords(dest.coords.lat, dest.coords.lng)}
              </span>
              <a
                href={mapsUrl(dest.coords.lat, dest.coords.lng)}
                target="_blank"
                rel="noopener noreferrer"
                style={S.mapsLink}
                onClick={(e) => e.stopPropagation()}
              >
                Open in Google Maps ↗
              </a>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

// ── Styles ────────────────────────────────────────────────
const S = {
  shell: {
    position: "relative",
    minHeight: "100vh",
    width: "100%",
    color: "#e8e6df",
    fontFamily: SERIF,
    background:
      "linear-gradient(160deg, #0a0a0a 0%, #1a1a2e 55%, #0f3460 100%)",
    overflowX: "hidden",
  },
  grain: {
    pointerEvents: "none",
    position: "fixed",
    inset: 0,
    zIndex: 0,
    backgroundImage: `url("data:image/svg+xml;utf8,${GRAIN_SVG}")`,
    backgroundSize: "160px 160px",
    opacity: 0.03,
    mixBlendMode: "overlay",
  },
  container: {
    position: "relative",
    zIndex: 1,
    maxWidth: 1280,
    margin: "0 auto",
    padding: "64px 24px 96px",
  },
  header: {
    marginBottom: 48,
  },
  eyebrow: {
    fontFamily: MONO,
    fontSize: 11,
    letterSpacing: "0.22em",
    color: "rgba(232, 230, 223, 0.55)",
    marginBottom: 14,
  },
  title: {
    fontFamily: SERIF,
    fontWeight: 500,
    fontSize: "clamp(44px, 7vw, 80px)",
    lineHeight: 1.04,
    letterSpacing: "-0.01em",
    margin: 0,
    color: "#f5f3ec",
  },
  lede: {
    fontFamily: SERIF,
    fontSize: 19,
    lineHeight: 1.55,
    color: "rgba(232, 230, 223, 0.78)",
    maxWidth: 640,
    marginTop: 18,
  },
  filterRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 36,
  },
  filterBtn: {
    background: "rgba(255, 255, 255, 0.04)",
    border: "1px solid rgba(255, 255, 255, 0.14)",
    color: "rgba(232, 230, 223, 0.78)",
    padding: "9px 16px",
    fontFamily: MONO,
    fontSize: 11,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    cursor: "pointer",
    borderRadius: 2,
    transition: "all 160ms ease",
  },
  filterBtnActive: {
    background: "rgba(245, 243, 236, 0.92)",
    color: "#0a0a0a",
    borderColor: "rgba(245, 243, 236, 0.92)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: 24,
    alignItems: "start",
  },
  card: {
    background: "rgba(255, 255, 255, 0.03)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: 4,
    overflow: "hidden",
    cursor: "pointer",
    transition:
      "transform 240ms ease, border-color 240ms ease, background 240ms ease",
    gridColumn: "span 1",
  },
  cardExpanded: {
    gridColumn: "1 / -1",
    background: "rgba(255, 255, 255, 0.05)",
    borderColor: "rgba(255, 255, 255, 0.18)",
  },
  cardImage: {
    width: "100%",
    height: 200,
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
    transition: "height 280ms ease",
  },
  imageOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(180deg, rgba(10,10,10,0.05) 0%, rgba(10,10,10,0.45) 60%, rgba(10,10,10,0.85) 100%)",
  },
  tagTopLeft: {
    position: "absolute",
    top: 12,
    left: 12,
    fontFamily: MONO,
    fontSize: 10,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "#f5f3ec",
    background: "rgba(10, 10, 10, 0.55)",
    border: "1px solid rgba(245, 243, 236, 0.35)",
    padding: "4px 9px",
    borderRadius: 2,
    backdropFilter: "blur(4px)",
  },
  statusBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    fontFamily: MONO,
    fontSize: 10,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    padding: "4px 9px",
    border: "1px solid",
    borderRadius: 2,
    backdropFilter: "blur(4px)",
  },
  nameOverlay: {
    position: "absolute",
    left: 18,
    bottom: 16,
    right: 18,
    display: "flex",
    alignItems: "baseline",
    gap: 10,
  },
  cardEmoji: {
    fontSize: 24,
    filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.6))",
  },
  cardName: {
    fontFamily: SERIF,
    fontSize: 28,
    fontWeight: 500,
    color: "#f5f3ec",
    letterSpacing: "-0.01em",
    textShadow: "0 2px 12px rgba(0, 0, 0, 0.6)",
  },
  cardBody: {
    padding: "20px 22px 24px",
  },
  subtitle: {
    fontFamily: MONO,
    fontSize: 11,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "rgba(232, 230, 223, 0.55)",
    marginBottom: 10,
  },
  dot: { color: "rgba(232, 230, 223, 0.35)", margin: "0 4px" },
  tagline: {
    fontFamily: SERIF,
    fontSize: 18,
    fontStyle: "italic",
    lineHeight: 1.4,
    color: "rgba(232, 230, 223, 0.88)",
    margin: 0,
  },
  details: {
    marginTop: 22,
    paddingTop: 22,
    borderTop: "1px solid rgba(255, 255, 255, 0.1)",
  },
  gallery: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 10,
    marginBottom: 22,
  },
  thumb: {
    width: 88,
    height: 60,
    padding: 0,
    border: "1px solid rgba(255, 255, 255, 0.14)",
    borderRadius: 3,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    cursor: "pointer",
    opacity: 0.6,
    transition: "opacity 160ms ease, border-color 160ms ease, transform 160ms ease",
    overflow: "hidden",
  },
  thumbActive: {
    opacity: 1,
    borderColor: "rgba(245, 243, 236, 0.85)",
    boxShadow: "0 0 0 1px rgba(245, 243, 236, 0.18) inset",
    transform: "scale(1.02)",
  },
  galleryCaption: {
    fontFamily: MONO,
    fontSize: 11,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "rgba(232, 230, 223, 0.55)",
    marginLeft: 6,
  },
  srOnly: {
    position: "absolute",
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    whiteSpace: "nowrap",
    border: 0,
  },
  description: {
    fontFamily: SERIF,
    fontSize: 17,
    lineHeight: 1.65,
    color: "rgba(232, 230, 223, 0.85)",
    margin: "0 0 22px",
  },
  h3: {
    fontFamily: MONO,
    fontSize: 11,
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: "rgba(232, 230, 223, 0.55)",
    margin: "20px 0 10px",
    fontWeight: 600,
  },
  list: { paddingLeft: 18, margin: 0 },
  li: {
    fontFamily: SERIF,
    fontSize: 16,
    lineHeight: 1.55,
    color: "rgba(232, 230, 223, 0.82)",
    marginBottom: 6,
  },
  detailPara: {
    fontFamily: SERIF,
    fontSize: 16,
    lineHeight: 1.6,
    color: "rgba(232, 230, 223, 0.82)",
    margin: 0,
  },
  coordsRow: {
    marginTop: 22,
    paddingTop: 18,
    borderTop: "1px solid rgba(255, 255, 255, 0.08)",
    display: "flex",
    flexWrap: "wrap",
    gap: 16,
    alignItems: "center",
    justifyContent: "space-between",
  },
  coords: {
    fontFamily: MONO,
    fontSize: 12,
    letterSpacing: "0.06em",
    color: "rgba(232, 230, 223, 0.6)",
  },
  mapsLink: {
    fontFamily: MONO,
    fontSize: 11,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "#93c5fd",
    textDecoration: "none",
    border: "1px solid rgba(147, 197, 253, 0.4)",
    padding: "7px 12px",
    borderRadius: 2,
  },
  empty: {
    fontFamily: MONO,
    fontSize: 12,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    color: "rgba(232, 230, 223, 0.5)",
    padding: "48px 0",
    textAlign: "center",
  },
  footer: {
    marginTop: 80,
    paddingTop: 28,
    borderTop: "1px solid rgba(255, 255, 255, 0.08)",
    fontFamily: MONO,
    fontSize: 11,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "rgba(232, 230, 223, 0.45)",
    textAlign: "center",
  },
};
