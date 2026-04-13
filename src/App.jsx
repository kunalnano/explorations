import { useState, useEffect, useCallback } from "react";
import Home from "./components/Home";
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

function getRoute() {
  const hash = window.location.hash.replace("#", "");
  return hash || "home";
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

  switch (route) {
    case "explorations":
      return <Explorations onNavigate={navigate} onBack={goHome} />;
    case "resume":
      return <Resume onBack={goHome} />;
    case "ancient-wisdom":
      return <AncientWisdomMap onBack={goExplorations} />;
    case "boltzmann-brain":
      return <BoltzmannBrain onBack={goExplorations} />;
    case "software-theory":
      return <SoftwareTheory onBack={goExplorations} />;
    case "multi-agent-civ":
      return <MultiAgentCiv onBack={goExplorations} />;
    case "path-dependency":
      return <PathDependency onBack={goExplorations} />;
    case "tech-entropy":
      return <TechEntropy onBack={goExplorations} />;
    case "jwst-dominoes":
      return <JWSTDominoes onBack={goExplorations} />;
    case "simulation-evolution":
      return <SimulationEvolution onBack={goExplorations} />;
    case "derivative-universes":
      return <DerivativeUniverses onBack={goExplorations} />;
    case "final-five-years":
      return <FinalFiveYears onBack={goExplorations} />;
    case "cognitive-symbiosis":
      return <CognitiveSymbiosis onBack={goExplorations} />;
    case "declarative-agents":
      return <DeclarativeAgents onBack={goExplorations} />;
    case "tapestry-lattice":
      return <TapestryLattice onBack={goExplorations} />;
    case "intelligence-currency":
      return <IntelligenceAsCurrency onBack={goExplorations} />;
    case "emergent-life-lab":
      return <EmergentLifeLab onBack={goExplorations} />;
    case "als-limit":
      return <AlsLimit onBack={goExplorations} />;
    case "entropy-filter":
      return <EntropyFilter onBack={goExplorations} />;
    case "software-factory":
      return <SoftwareFactoryPlatformer onBack={goExplorations} />;
    case "github-constellation":
      return <GitHubConstellation onBack={goExplorations} />;
    case "the-tell":
      return <TheTell onBack={goExplorations} />;
    default:
      return <Home onNavigate={navigate} />;
  }
}
