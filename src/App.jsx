import { useState, useEffect, useCallback } from "react";
import Home from "./components/Home";
import Operator from "./components/Operator";
import Explorations from "./components/Explorations";
import Resume from "./components/Resume";
import AncientWisdomMap from "./components/AncientWisdomMap";
import BoltzmannBrain from "./components/BoltzmannBrain";
import SoftwareTheory from "./components/SoftwareTheory";
import MultiAgentCiv from "./components/MultiAgentCiv";
import PathDependency from "./components/PathDependency";
import TechEntropy from "./components/TechEntropy";
import JWSTDominoes from "./components/JWSTDominoes";
import SimulationEvolution from "./components/SimulationEvolution";
import DerivativeUniverses from "./components/DerivativeUniverses";
import FinalFiveYears from "./components/FinalFiveYears";
import CognitiveSymbiosis from "./components/CognitiveSymbiosis";
import DeclarativeAgents from "./components/DeclarativeAgents";
import TapestryLattice from "./components/TapestryLattice";
import IntelligenceAsCurrency from "./components/IntelligenceAsCurrency";
import EmergentLifeLab from "./components/EmergentLifeLab";
import EntropyFilter from "./components/EntropyFilter";
import AlsLimit from "./components/AlsLimit";
import SoftwareFactoryPlatformer from "./components/SoftwareFactoryPlatformer";
import GitHubConstellation from "./components/GitHubConstellation";
import TheTell from "./components/TheTell";
import Travel from "./pages/travel/Travel";
import PageFrame from "./components/PageFrame";
import { ROUTE_META } from "./routeMeta";

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
    return <Operator onBegin={finishIntro} />;
  }

  const entry = ROUTES[route];
  if (!entry) return <Home onNavigate={navigate} />;

  const Component = entry.C;
  const componentProps = entry.props(helpers);
  const meta = ROUTE_META[route] || { surface: "light", backLabel: "Home" };
  const backFn = meta.backLabel === "Home" ? goHome : goExplorations;

  if (!FRAMED.has(route)) {
    return <Component {...componentProps} />;
  }

  return (
    <PageFrame surface={meta.surface} onBack={backFn} backLabel={meta.backLabel}>
      <Component {...componentProps} />
    </PageFrame>
  );
}
