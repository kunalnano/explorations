import { useState, useEffect, useCallback } from "react";
import Home from "./components/Home";
import AncientWisdomMap from "./components/AncientWisdomMap";
import BoltzmannBrain from "./components/BoltzmannBrain";
import SoftwareTheory from "./components/SoftwareTheory";
import MultiAgentCiv from "./components/MultiAgentCiv";
import PathDependency from "./components/PathDependency";
import TechEntropy from "./components/TechEntropy";
import JWSTDominoes from "./components/JWSTDominoes";

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

  const navigate = useCallback((id) => {
    setRoute(id);
    window.scrollTo(0, 0);
  }, []);

  switch (route) {
    case "ancient-wisdom":
      return <AncientWisdomMap onBack={goHome} />;
    case "boltzmann-brain":
      return <BoltzmannBrain onBack={goHome} />;
    case "software-theory":
      return <SoftwareTheory onBack={goHome} />;
    case "multi-agent-civ":
      return <MultiAgentCiv onBack={goHome} />;
    case "path-dependency":
      return <PathDependency onBack={goHome} />;
    case "tech-entropy":
      return <TechEntropy onBack={goHome} />;
    case "jwst-dominoes":
      return <JWSTDominoes onBack={goHome} />;
    default:
      return <Home onNavigate={navigate} />;
  }
}
