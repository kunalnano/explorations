import { useState, useEffect, useCallback, lazy, Suspense } from "react";
import Home from "./components/KineticHome";
import PageFrame from "./components/PageFrame";
import { ROUTE_META } from "./routeMeta";

const Explorations = lazy(() => import("./components/Explorations"));
const Operator = lazy(() => import("./components/Operator"));
const Resume = lazy(() => import("./components/Resume"));
const AncientWisdomMap = lazy(() => import("./components/AncientWisdomMap"));
const BoltzmannBrain = lazy(() => import("./components/BoltzmannBrain"));
const SoftwareTheory = lazy(() => import("./components/SoftwareTheory"));
const MultiAgentCiv = lazy(() => import("./components/MultiAgentCiv"));
const PathDependency = lazy(() => import("./components/PathDependency"));
const TechEntropy = lazy(() => import("./components/TechEntropy"));
const JWSTDominoes = lazy(() => import("./components/JWSTDominoes"));
const SimulationEvolution = lazy(() => import("./components/SimulationEvolution"));
const DerivativeUniverses = lazy(() => import("./components/DerivativeUniverses"));
const FinalFiveYears = lazy(() => import("./components/FinalFiveYears"));
const CognitiveSymbiosis = lazy(() => import("./components/CognitiveSymbiosis"));
const DeclarativeAgents = lazy(() => import("./components/DeclarativeAgents"));
const TapestryLattice = lazy(() => import("./components/TapestryLattice"));
const IntelligenceAsCurrency = lazy(() => import("./components/IntelligenceAsCurrency"));
const EmergentLifeLab = lazy(() => import("./components/EmergentLifeLab"));
const EntropyFilter = lazy(() => import("./components/EntropyFilter"));
const AlsLimit = lazy(() => import("./components/AlsLimit"));
const SoftwareFactoryPlatformer = lazy(() => import("./components/SoftwareFactoryPlatformer"));
const GitHubConstellation = lazy(() => import("./components/GitHubConstellation"));
const TheTell = lazy(() => import("./components/TheTell"));
const Travel = lazy(() => import("./pages/travel/Travel"));


const PATH_ROUTES = new Set(["travel"]);
const HOSTNAME_ROUTES = { travel: "travel" };

function getRoute() {
  const hash = window.location.hash.replace("#", "");
  if (hash) return hash;
  const path = window.location.pathname.replace(/^\/+|\/+$/g, "");
  if (PATH_ROUTES.has(path)) return path;
  const hostPrefix = window.location.hostname.split(".")[0];
  if (HOSTNAME_ROUTES[hostPrefix]) return HOSTNAME_ROUTES[hostPrefix];
  return "home";
}

// Map of route id → { component, getProps(navHelpers) }
const ROUTES = {
  "operator":              { C: Operator, props: (h) => ({ onBegin: h.finishIntro }) },
  "explorations":          { C: Explorations, props: (h) => ({ onNavigate: h.navigate, onBack: h.goHome }) },
  "resume":                { C: Resume, props: (h) => ({ onBack: h.goHome }) },
  "ancient-wisdom":        { C: AncientWisdomMap, props: (h) => ({ onBack: h.goExplorations }) },
  "boltzmann-brain":       { C: BoltzmannBrain, props: (h) => ({ onBack: h.goExplorations }) },
  "software-theory":       { C: SoftwareTheory, props: (h) => ({ onBack: h.goExplorations }) },
  "multi-agent-civ":       { C: MultiAgentCiv, props: (h) => ({ onBack: h.goExplorations }) },
  "path-dependency":       { C: PathDependency, props: (h) => ({ onBack: h.goExplorations }) },
  "tech-entropy":          { C: TechEntropy, props: (h) => ({ onBack: h.goExplorations }) },
  "jwst-dominoes":         { C: JWSTDominoes, props: (h) => ({ onBack: h.goExplorations }) },
  "simulation-evolution":  { C: SimulationEvolution, props: (h) => ({ onBack: h.goExplorations }) },
  "derivative-universes":  { C: DerivativeUniverses, props: (h) => ({ onBack: h.goExplorations }) },
  "final-five-years":      { C: FinalFiveYears, props: (h) => ({ onBack: h.goExplorations }) },
  "cognitive-symbiosis":   { C: CognitiveSymbiosis, props: (h) => ({ onBack: h.goExplorations }) },
  "declarative-agents":    { C: DeclarativeAgents, props: (h) => ({ onBack: h.goExplorations }) },
  "tapestry-lattice":      { C: TapestryLattice, props: (h) => ({ onBack: h.goExplorations }) },
  "intelligence-currency": { C: IntelligenceAsCurrency, props: (h) => ({ onBack: h.goExplorations }) },
  "emergent-life-lab":     { C: EmergentLifeLab, props: (h) => ({ onBack: h.goExplorations }) },
  "als-limit":             { C: AlsLimit, props: (h) => ({ onBack: h.goExplorations }) },
  "entropy-filter":        { C: EntropyFilter, props: (h) => ({ onBack: h.goExplorations }) },
  "software-factory":      { C: SoftwareFactoryPlatformer, props: (h) => ({ onBack: h.goExplorations }) },
  "github-constellation":  { C: GitHubConstellation, props: (h) => ({ onBack: h.goExplorations }) },
  "the-tell":              { C: TheTell, props: (h) => ({ onBack: h.goExplorations }) },
  "travel":                { C: Travel, props: (h) => ({ onBack: h.goHome }) },
};

// Routes that need the PageFrame chrome (not Home or Operator)
const FRAMED = new Set(Object.keys(ROUTE_META));

function OperatorFallback() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "rgba(245,245,247,0.72)",
        display: "grid",
        placeItems: "center",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif',
        fontSize: 14,
      }}
    >
      Loading operator.
    </div>
  );
}

function RouteFallback({ surface = "light" }) {
  const dark = surface === "dark";
  return (
    <div
      style={{
        minHeight: "100vh",
        background: dark ? "#050508" : "#ffffff",
        color: dark ? "rgba(245,245,247,0.72)" : "#1d1d1f",
        display: "grid",
        placeItems: "center",
        fontFamily:
          '"JetBrains Mono", "SF Mono", ui-monospace, monospace',
        fontSize: 12,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
      }}
    >
      Loading.
    </div>
  );
}

export default function App() {
  const [route, setRoute] = useState(getRoute);

  useEffect(() => {
    const onHash = () => setRoute(getRoute());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const goHome = useCallback(() => {
    window.location.hash = "";
    setRoute("home");
    window.scrollTo(0, 0);
  }, []);

  const finishIntro = useCallback(() => {
    window.location.hash = "";
    setRoute("home");
    window.scrollTo(0, 0);
  }, []);

  const goExplorations = useCallback(() => {
    window.location.hash = "explorations";
    setRoute("explorations");
    window.scrollTo(0, 0);
  }, []);

  const navigate = useCallback((id) => {
    window.location.hash = id;
    setRoute(id);
    window.scrollTo(0, 0);
  }, []);

  const helpers = { goHome, finishIntro, goExplorations, navigate };

  // Home — no chrome wrapper, has its own nav
  if (route === "home" || route === "intro") {
    return <Home onNavigate={navigate} />;
  }

  // Operator — full-bleed cinematic, no chrome
  if (route === "operator") {
    return (
      <Suspense fallback={<OperatorFallback />}>
        <Operator onBegin={finishIntro} />
      </Suspense>
    );
  }

  const entry = ROUTES[route];
  if (!entry) return <Home onNavigate={navigate} />;

  const Component = entry.C;
  const componentProps = entry.props(helpers);
  const meta = ROUTE_META[route] || { surface: "light", backLabel: "Home" };
  const backFn = meta.backLabel === "Home" ? goHome : goExplorations;

  if (!FRAMED.has(route)) {
    return (
      <Suspense fallback={<RouteFallback surface={meta.surface} />}>
        <Component {...componentProps} />
      </Suspense>
    );
  }

  return (
    <PageFrame surface={meta.surface} onBack={backFn} backLabel={meta.backLabel}>
      <Suspense fallback={<RouteFallback surface={meta.surface} />}>
        <Component {...componentProps} />
      </Suspense>
    </PageFrame>
  );
}
