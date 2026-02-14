import { useState, useEffect, useCallback } from "react";
import Home from "./components/Home";
import AncientWisdomMap from "./components/AncientWisdomMap";
import BoltzmannBrain from "./components/BoltzmannBrain";

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
    default:
      return <Home onNavigate={navigate} />;
  }
}
