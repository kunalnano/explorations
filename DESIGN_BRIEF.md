# alsharma.com Redesign — Brief for /canvas-design + /design

**Branch:** `redesign/apple-home`
**Last checkpoint:** `01d0cb7`
**Build:** ✅ `npm run build` green (1.3s, 1.1 MB main bundle)

---

## The thesis

Apple direction, **carried through the entire site**. Home, explorations index, and every visual essay descend from the same design language. The previous attempts failed because:

1. First pass: Apple on Home only → click any essay, land in dark/terminal aesthetic → felt like two different sites.
2. Second pass: walked Apple back to dark/editorial → Hank rejected, called it lazy. The right call.

The work is to bring the essays UP to meet the Apple direction, not pull Home down to meet them.

---

## What Apple means here

- **Typography:** SF Pro Display for headlines, SF Pro Text for body. System font stack falls back gracefully. Sentence case ending in periods. Tight negative letter-spacing on display sizes (-0.04em at 72px+).
- **Surface:** white (`#ffffff`) primary, soft grey (`#f5f5f7`) for section breaks, black (`#000000`) for dramatic moments (the DVC editorial block on Home, certain essay heros).
- **Color:** restrained. One amber accent (`#c9a84c`) that nods to the Operator galaxy. Apple link blue (`#0066cc`) for actions. No multi-accent palettes.
- **Buttons:** pill, rounded 999px, two variants (filled blue, ghost blue text-link).
- **Spacing:** generous — 96–112px section padding, 22px gutters, max-width 1024px.
- **Chrome:** sticky nav with `backdrop-filter: blur(20px)` and `saturate(180%)`. Sentence case nav links.

Counter-example: Apple's product pages are **not** uniformly white. Dark hero shots, vivid product images, and black sections live happily inside an Apple-typographic frame. The chrome is constant; the content can be its own visual world. **This is the model for the essays** — keep their interior visual identity, force their chrome and typography into the Apple system.

---

## Identity (locked, do not drift)

Source of truth is the LinkedIn About we just finalized. Same voice across every surface.

- **Headline:** "Al Sharma." (sentence case, period)
- **Subhead:** "Post-sales strategy for AI-native software."
- **Lede:** "I close the gap between what enterprises buy and what they realize from it. I also build the agents I'd want them to use."
- **DVC pullquote:** "Legacy software was built for humans clicking buttons. The next layer is built for agents doing work. We sit at that seam."
- **DVC** is the commercial spine. Named explicitly. Not hidden, not over-named.

---

## Architecture already in place

```
src/
├── design.js              # Shared tokens: C (colors), F (fonts), T (type presets), pill
├── routeMeta.js           # Per-route: surface (light|dark), backLabel
├── App.jsx                # Refactored: route table + PageFrame wrapping
├── components/
│   ├── Home.jsx           # ✅ Apple direction (done)
│   ├── PageFrame.jsx      # ✅ Floating Apple nav, transparent body, surface-adaptive
│   ├── TheTell.jsx        # internal back button removed, interior typography NOT YET updated
│   ├── SoftwareFactoryPlatformer.jsx  # same
│   ├── IntelligenceAsCurrency.jsx     # same
│   ├── AlsLimit.jsx                    # same
│   └── ... (15 more essays in same state)
└── pages/travel/Travel.jsx
```

**PageFrame is the chrome contract.** Every route except Home and Operator wraps in `<PageFrame surface="light|dark" onBack={...} backLabel="...">`. The frame provides:

- Sticky top nav (Apple, backdrop blur, ‹ Explorations + sharma wordmark)
- Transparent body (essay paints its own background)
- 48px top padding so essay content clears the nav

Essays no longer need their own back buttons. PageFrame handles it.

---

## What's left (the actual /design + /canvas-design work)

Per essay, three surgeries:

### 1. Typography (mechanical)

Replace per-essay inline font stacks with imports from `src/design.js`:

```js
import { C, F, T } from "../design.js";

// before
const sans = { fontFamily: "'Segoe UI', system-ui, ..." };
const serif = { fontFamily: "'Georgia', serif" };

// after — use the shared tokens
// F.display for h1/h2, F.text for body, F.mono for monospace labels
// Or use T.h1, T.h2, T.lede, T.body, T.small, T.eyebrow as preset objects
```

### 2. Spacing (mechanical)

Replace ad-hoc paddings with Apple rhythm:

- Section padding: 96–112px vertical
- Container max-width: 1024px (1080 max for grid sections)
- Gutter: 22px
- Card border-radius: 22px

### 3. Hero treatment (creative — per essay)

Each essay's hero needs an Apple-flavored opener. Pattern:

```
[mono eyebrow in inkMute, 0.18em letter-spacing, uppercase]
[h1 in F.display, 600 weight, -0.04em letter-spacing, 72–112px]
[lede in F.display, 400 weight, inkSoft color, 22–30px]
```

The essay's interior visualizations / interactive bits stay. Their surrounding chrome adopts Apple language.

---

## Essay list with surface decisions (from `routeMeta.js`)

| Route | Surface | Notes |
|---|---|---|
| `the-tell` | dark | Earth-toned mound; keep palette inside, frame is Apple |
| `software-factory` | dark | Platformer aesthetic; same |
| `intelligence-currency` | dark | |
| `als-limit` | dark | |
| `ancient-wisdom` | dark | Map visualization; keep |
| `boltzmann-brain` | dark | |
| `software-theory` | dark | |
| `multi-agent-civ` | dark | |
| `path-dependency` | dark | |
| `tech-entropy` | dark | |
| `jwst-dominoes` | dark | |
| `simulation-evolution` | dark | |
| `derivative-universes` | dark | |
| `final-five-years` | dark | |
| `cognitive-symbiosis` | dark | |
| `declarative-agents` | dark | |
| `tapestry-lattice` | dark | |
| `emergent-life-lab` | dark | Cellular automata canvas; keep |
| `entropy-filter` | dark | |
| `github-constellation` | dark | Canvas constellation; keep |
| `resume` | light | Apple white CV-style |
| `explorations` (index) | light | Apple white grid |
| `travel` | light | Photo essays |

Operator stays as-is — full-bleed cinematic, no chrome. It's the destination behind the galaxy stage on Home.

---

## Open items (deferred, not for this pass)

1. **Three.js bundle weight.** Operator imports load eagerly. `React.lazy(() => import("./Operator"))` is a 5-min follow-up.
2. **SSR / static HTML.** Site is fully client-rendered. Meta tags now do the OG job statically, but full SSG (Astro? Vite SSG?) is a separate project.
3. **AncientWisdomMap** uses `onClose` not `onBack` — verify routing wiring.

---

## Suggested order of operations for /design

1. Convert the **resume** and **explorations index** first (light surface, simplest, sets the Apple pattern).
2. Then the four featured essays from Home: `the-tell`, `software-factory`, `intelligence-currency`, `als-limit`.
3. Then the remaining 15 essays in any order — each one is mechanical once the pattern is locked.
4. Visual QA pass: every page should feel like the same site as Home, regardless of internal surface color.

---

## Quick commands

```bash
cd ~/Projects/explorations
git checkout redesign/apple-home   # already there
npm run dev                         # localhost:5173
npm run build                       # verify build green before each commit
```

To revert and start clean: `git checkout main`.
