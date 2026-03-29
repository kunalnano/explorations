import { useEffect, useRef, useCallback } from "react";

export const COLORS = {
  bg: "#050508",
  gold: "#c9a84c",
  goldLight: "#e8d48b",
  goldDim: "#8b7a3a",
  bone: "#e8e4dc",
  ash: "#6b6580",
  deepAsh: "#4a4860",
};

export const FONTS = {
  mono: "'SF Mono', 'Cascadia Code', 'Consolas', monospace",
  serif: "Georgia, 'Times New Roman', serif",
  sans: "'Segoe UI', system-ui, -apple-system, sans-serif",
};

const LANG_COLORS = {
  JavaScript: "#f7df1e",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  Go: "#00ADD8",
  Rust: "#dea584",
  Ruby: "#701516",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  Vue: "#41b883",
  Svelte: "#ff3e00",
};

export function getLangColor(lang) {
  return LANG_COLORS[lang] || COLORS.gold;
}

export function scoreRepo(repo) {
  const stars = repo.stargazers_count || 0;
  const now = Date.now();
  const updated = new Date(repo.updated_at).getTime();
  const ageMonths = (now - updated) / (1000 * 60 * 60 * 24 * 30);
  const recency = Math.max(0, 1 - ageMonths / 36);
  return stars * 2 + recency * 5 + 1;
}

export function nodeRadius(score) {
  return Math.max(5, Math.min(22, 4 + score * 1.2));
}

export function buildGraph(repos) {
  const nodes = repos.map((repo, i) => {
    const score = scoreRepo(repo);
    const angle = (i / repos.length) * Math.PI * 2;
    const spread = 80 + Math.random() * 40;
    return {
      id: repo.name,
      repo,
      score,
      radius: nodeRadius(score),
      color: getLangColor(repo.language),
      x: 400 + Math.cos(angle) * spread + (Math.random() - 0.5) * 30,
      y: 300 + Math.sin(angle) * spread + (Math.random() - 0.5) * 30,
      vx: 0,
      vy: 0,
      fork: repo.fork,
    };
  });
  const edges = [];
  const langCounts = {};
  for (const node of nodes) {
    const lang = node.repo.language || "Unknown";
    langCounts[lang] = (langCounts[lang] || 0) + 1;
  }
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      if (nodes[i].repo.language && nodes[i].repo.language === nodes[j].repo.language) {
        edges.push({ source: i, target: j });
      }
    }
  }
  return { nodes, edges, langCounts };
}

export default function ConstellationCanvas({
  repos,
  hovered,
  setHovered,
  selected,
  setSelected,
  containerRef,
}) {
  const canvasRef = useRef(null);
  const nodesRef = useRef([]);
  const edgesRef = useRef([]);
  const frameRef = useRef(null);
  const panRef = useRef({ x: 0, y: 0 });
  const draggingRef = useRef(false);
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const iterRef = useRef(0);

  const getCanvasSize = useCallback(() => {
    const container = containerRef.current;
    if (!container) return { w: 800, h: 600 };
    return { w: container.clientWidth, h: 600 };
  }, [containerRef]);

  // Init graph nodes into ref
  useEffect(() => {
    if (!repos || repos.length === 0) return;
    const { nodes, edges } = buildGraph(repos);
    nodesRef.current = nodes;
    edgesRef.current = edges;
    iterRef.current = 0;
  }, [repos]);

  // Canvas resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const { w, h } = getCanvasSize();
      canvas.width = w * (window.devicePixelRatio || 1);
      canvas.height = h * (window.devicePixelRatio || 1);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [repos, getCanvasSize]);

  // Animation loop
  useEffect(() => {
    if (!repos || repos.length === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    function tick() {
      const ns = nodesRef.current;
      const es = edgesRef.current;
      const { w, h } = getCanvasSize();
      const dpr = window.devicePixelRatio || 1;
      const cx = w / 2;
      const cy = h / 2;
      const iter = iterRef.current;
      const cooling = iter < 300 ? 1 - iter / 400 : 0.15;

      if (iter < 600) {
        for (let i = 0; i < ns.length; i++) {
          for (let j = i + 1; j < ns.length; j++) {
            const dx = ns[j].x - ns[i].x;
            const dy = ns[j].y - ns[i].y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const force = (800 * cooling) / (dist * dist);
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;
            ns[i].vx -= fx;
            ns[i].vy -= fy;
            ns[j].vx += fx;
            ns[j].vy += fy;
          }
        }
        for (const e of es) {
          const a = ns[e.source];
          const b = ns[e.target];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = (dist - 100) * 0.003 * cooling;
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;
          a.vx += fx;
          a.vy += fy;
          b.vx -= fx;
          b.vy -= fy;
        }
        for (const n of ns) {
          n.vx += (cx - n.x) * 0.001;
          n.vy += (cy - n.y) * 0.001;
          n.vx *= 0.92;
          n.vy *= 0.92;
          n.x += n.vx;
          n.y += n.vy;
          n.x = Math.max(n.radius, Math.min(w - n.radius, n.x));
          n.y = Math.max(n.radius, Math.min(h - n.radius, n.y));
        }
        iterRef.current++;
      }

      // Render
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = COLORS.bg;
      ctx.fillRect(0, 0, w, h);
      ctx.save();
      ctx.translate(panRef.current.x, panRef.current.y);

      const hovIdx = ns.findIndex((n) => n.id === hovered);
      const selIdx = ns.findIndex((n) => n.id === (selected && selected.name));

      for (const e of es) {
        const a = ns[e.source];
        const b = ns[e.target];
        const hl = e.source === hovIdx || e.target === hovIdx || e.source === selIdx || e.target === selIdx;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = hl ? "rgba(201,168,76,0.28)" : "rgba(201,168,76,0.07)";
        ctx.lineWidth = hl ? 1.2 : 0.5;
        ctx.stroke();
      }

      for (const n of ns) {
        const isHov = n.id === hovered;
        const isSel = selected && n.id === selected.name;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius * (isHov ? 1.25 : 1), 0, Math.PI * 2);
        if (n.fork) ctx.globalAlpha = 0.5;
        ctx.fillStyle = n.color;
        ctx.fill();
        if (isHov || isSel) {
          ctx.strokeStyle = COLORS.goldLight;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
        if (n.fork) {
          ctx.setLineDash([3, 3]);
          ctx.strokeStyle = COLORS.ash;
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.setLineDash([]);
        }
        ctx.globalAlpha = 1;
      }

      if (hovIdx >= 0) {
        const mx = mouseRef.current.x - panRef.current.x;
        const my = mouseRef.current.y - panRef.current.y;
        ctx.font = `12px ${FONTS.mono}`;
        const text = ns[hovIdx].repo.name;
        const tw = ctx.measureText(text).width;
        ctx.fillStyle = "rgba(5,5,8,0.88)";
        ctx.fillRect(mx + 10, my - 24, tw + 12, 22);
        ctx.fillStyle = COLORS.goldLight;
        ctx.fillText(text, mx + 16, my - 8);
      }

      ctx.restore();
      ctx.restore();
      frameRef.current = requestAnimationFrame(tick);
    }

    frameRef.current = requestAnimationFrame(tick);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [repos, hovered, selected, getCanvasSize]);

  const findNodeAt = useCallback((clientX, clientY) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left - panRef.current.x;
    const y = clientY - rect.top - panRef.current.y;
    for (const n of nodesRef.current) {
      const dx = x - n.x;
      const dy = y - n.y;
      if (dx * dx + dy * dy < (n.radius + 4) * (n.radius + 4)) return n;
    }
    return null;
  }, []);

  const handleMouseMove = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };

    if (draggingRef.current) {
      panRef.current.x += e.clientX - lastMouseRef.current.x;
      panRef.current.y += e.clientY - lastMouseRef.current.y;
      lastMouseRef.current = { x: e.clientX, y: e.clientY };
      return;
    }
    const node = findNodeAt(e.clientX, e.clientY);
    setHovered(node ? node.id : null);
    canvas.style.cursor = node ? "pointer" : "grab";
  }, [findNodeAt, setHovered]);

  const handleMouseDown = useCallback((e) => {
    if (findNodeAt(e.clientX, e.clientY)) return;
    draggingRef.current = true;
    lastMouseRef.current = { x: e.clientX, y: e.clientY };
    if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";
  }, [findNodeAt]);

  const handleMouseUp = useCallback(() => {
    draggingRef.current = false;
    if (canvasRef.current) canvasRef.current.style.cursor = "grab";
  }, []);

  const handleClick = useCallback((e) => {
    const node = findNodeAt(e.clientX, e.clientY);
    setSelected(node ? node.repo : null);
  }, [findNodeAt, setSelected]);

  return (
    <canvas
      ref={canvasRef}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={handleClick}
      style={{ display: "block", width: "100%", height: 600, borderRadius: 4, cursor: "grab" }}
    />
  );
}
