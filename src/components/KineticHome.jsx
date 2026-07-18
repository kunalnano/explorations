import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import fieldMap from "../assets/home/operator-field-map.png";

const STEPS = [
  {
    num: "01",
    label: "Field Signal",
    title: "Listen where adoption gets real.",
    text:
      "I read the customer environment across usage, executive pressure, delivery friction, and product fit so the next move is grounded in what is actually happening.",
  },
  {
    num: "02",
    label: "Value Motion",
    title: "Turn signal into operating motion.",
    text:
      "The work becomes a rhythm: proof points, stakeholder alignment, field plays, and the clear path from bought promise to lived value.",
  },
  {
    num: "03",
    label: "Agent Systems",
    title: "Build tools for the leverage point.",
    text:
      "I design authority-bounded agentic systems that keep context, route work, surface risk, and make expert operators faster without pretending judgment disappeared.",
  },
  {
    num: "04",
    label: "Renewal Gravity",
    title: "Make retention a consequence.",
    text:
      "When post-sales motion compounds, renewal stops being a rescue motion. It becomes the natural result of value, trust, and useful instrumentation.",
  },
];

const WORK = [
  ["Memory", "The Tell", "Memory, cognition, and the archaeological mound.", "the-tell"],
  ["Platform", "The Software Factory", "Supply chain security as a playable operating model.", "software-factory"],
  ["Intelligence", "Intelligence as Currency", "Seven theses on compounding intelligence.", "intelligence-currency"],
  ["Systems", "GitHub Constellation", "Signal, ownership, and engineering gravity.", "github-constellation"],
];

const CAREER = [
  ["2025 - Present", "Port.io", "Head of Technical Success, Americas"],
  ["2024 - 2025", "Harness", "Senior Technical Program Manager"],
  ["2022 - 2024", "Snyk", "Manager, Customer Solutions Group"],
  ["2021", "HashiCorp", "Enterprise User Success Manager"],
  ["2013 - 2021", "Western Digital", "Staff Manager, Enterprise"],
];

function SignalOverlay({ idPrefix, variant = "hero" }) {
  const mainPath = "M170 640 C330 602 485 640 645 582 C762 540 846 472 980 500 C1110 528 1196 440 1364 396";
  const crossPath = "M694 590 C798 648 926 652 1048 592 C1170 532 1294 555 1452 482";
  const uplinkPath = "M580 706 C710 724 814 668 896 592 C973 520 1080 464 1228 424";

  return (
    <svg className={`kh-map-signals kh-map-signals--${variant}`} viewBox="0 0 1600 900" aria-hidden="true" data-signal-layer={variant}>
      <defs>
        <filter id={`${idPrefix}-glow`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path id={`${idPrefix}-main`} className="kh-signal-path kh-signal-path--main" d={mainPath} filter={`url(#${idPrefix}-glow)`} />
      <path className="kh-signal-path kh-signal-path--soft kh-signal-path--delay" d={crossPath} filter={`url(#${idPrefix}-glow)`} />
      <path className="kh-signal-path kh-signal-path--soft kh-signal-path--slow" d={uplinkPath} filter={`url(#${idPrefix}-glow)`} />
      <g className="kh-signal-nodes" filter={`url(#${idPrefix}-glow)`}>
        {[
          [645, 582],
          [896, 592],
          [980, 500],
          [1228, 424],
          [1364, 396],
        ].map(([cx, cy], index) => (
          <circle className="kh-signal-node" style={{ "--node-delay": `${index * 0.5}s` }} cx={cx} cy={cy} r="7" key={`${cx}-${cy}`} />
        ))}
      </g>
      <circle className="kh-signal-carrier" r="8" filter={`url(#${idPrefix}-glow)`}>
        <animateMotion dur={variant === "hero" ? "7.5s" : "6.2s"} repeatCount="indefinite" rotate="auto">
          <mpath href={`#${idPrefix}-main`} />
        </animateMotion>
      </circle>
    </svg>
  );
}

function FieldMapStage({ className, imageClassName, idPrefix, variant, dataAttr }) {
  return (
    <div className={`kh-map-stage ${className}`} {...dataAttr}>
      <div className="kh-map-drift">
        <img src={fieldMap} alt="" className={`kh-map-image ${imageClassName}`} />
        <SignalOverlay idPrefix={idPrefix} variant={variant} />
      </div>
    </div>
  );
}

function useSmoothScroll(rootRef) {
  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    gsap.registerPlugin(ScrollTrigger);

    const root = rootRef.current;
    const html = document.documentElement;
    const previousBehavior = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";

    const lenis = new Lenis({
      duration: 0.98,
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 1.1,
    });

    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    const update = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    const onClick = (event) => {
      const anchor = event.target.closest?.('a[href^="#"]');
      if (!anchor || !root?.contains(anchor)) return;
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target, { offset: -68, duration: 1.08 });
    };

    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      lenis.off("scroll", onScroll);
      gsap.ticker.remove(update);
      lenis.destroy();
      html.style.scrollBehavior = previousBehavior;
    };
  }, [rootRef]);
}

function useKineticMotion(rootRef, setActiveStep) {
  useLayoutEffect(() => {
    if (typeof window === "undefined") return undefined;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          reduced: "(prefers-reduced-motion: reduce)",
          motion: "(prefers-reduced-motion: no-preference)",
          desktop: "(min-width: 900px) and (prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const { reduced, motion, desktop } = context.conditions;

          if (reduced) {
            gsap.set("[data-reveal], [data-map-stage], [data-step-card]", {
              autoAlpha: 1,
              clearProps: "transform",
            });
            setActiveStep(0);
            return;
          }

          if (motion) {
            gsap.fromTo(
              "[data-reveal]",
              { autoAlpha: 0, y: 22 },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.78,
                stagger: 0.08,
                ease: "power3.out",
                clearProps: "transform",
              },
            );

            gsap.to("[data-hero-map]", {
              yPercent: 9,
              scale: 1.045,
              ease: "none",
              scrollTrigger: {
                trigger: "[data-hero]",
                start: "top top",
                end: "bottom top",
                scrub: true,
              },
            });

            gsap.fromTo(
              "[data-signal-layer]",
              { autoAlpha: 0 },
              { autoAlpha: 1, duration: 1.15, delay: 0.22, ease: "power2.out" },
            );

            gsap.utils.toArray("[data-row-reveal]").forEach((el) => {
              gsap.fromTo(
                el,
                { autoAlpha: 0, y: 24 },
                {
                  autoAlpha: 1,
                  y: 0,
                  duration: 0.68,
                  ease: "power3.out",
                  scrollTrigger: { trigger: el, start: "top 86%" },
                },
              );
            });
          }

          if (desktop) {
            ScrollTrigger.create({
              trigger: "[data-process]",
              start: "top top",
              end: `+=${STEPS.length * 78}%`,
              scrub: 0.55,
              pin: true,
              anticipatePin: 1,
              onUpdate: (self) => {
                const next = Math.min(STEPS.length - 1, Math.floor(self.progress * STEPS.length));
                setActiveStep(next);
              },
              onLeaveBack: () => setActiveStep(0),
            });

            gsap.to("[data-process-map]", {
              xPercent: -7,
              yPercent: -5,
              scale: 1.12,
              ease: "none",
              scrollTrigger: {
                trigger: "[data-process]",
                start: "top top",
                end: `+=${STEPS.length * 78}%`,
                scrub: 0.55,
              },
            });
          }
        },
      );
    }, rootRef);

    return () => ctx.revert();
  }, [rootRef, setActiveStep]);
}

function Nav({ onNavigate }) {
  return (
    <header className="kh-nav" aria-label="Primary navigation">
      <div className="kh-nav-left">
        <a href="#strategy">Strategy</a>
        <a href="#work">Work</a>
      </div>
      <button type="button" className="kh-brand" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
        alsharma.com
      </button>
      <div className="kh-nav-right">
        <button type="button" onClick={() => onNavigate("explorations")}>Explorations</button>
        <a href="https://darkvectorcognition.ai" target="_blank" rel="noopener noreferrer">DVC</a>
        <a className="kh-contact" href="mailto:hello@darkvectorcognition.ai">Contact</a>
      </div>
    </header>
  );
}

function Hero({ onNavigate }) {
  return (
    <section className="kh-hero" data-hero>
      <FieldMapStage
        className="kh-hero-stage"
        imageClassName="kh-hero-map"
        idPrefix="hero-signal"
        variant="hero"
        dataAttr={{ "data-hero-map": true }}
      />
      <div className="kh-hero-copy">
        <h1 data-reveal>The Operator Layer for <span className="kh-nowrap">AI-Native</span> Growth</h1>
        <p data-reveal>
          Post-sales strategy, field intelligence, and agentic systems that turn adoption into operating leverage.
        </p>
        <div className="kh-hero-actions" data-reveal>
          <a href="#strategy">Explore the motion</a>
          <button type="button" onClick={() => onNavigate("explorations")}>See the work</button>
        </div>
      </div>
      <div className="kh-scroll-cue" data-reveal>
        <span />
        Scroll to map the system
      </div>
    </section>
  );
}

function StepRail({ activeStep, onSelect }) {
  return (
    <ol className="kh-step-rail" aria-label="Strategy sequence">
      {STEPS.map((step, index) => (
        <li className={index === activeStep ? "is-active" : ""} key={step.num}>
          <button type="button" onClick={() => onSelect(index)} aria-current={index === activeStep ? "step" : undefined}>
            <span>{step.num}</span>
            <strong>{step.label}</strong>
            <p>{step.text}</p>
          </button>
        </li>
      ))}
    </ol>
  );
}

function ProcessSection({ activeStep, onSelectStep }) {
  const step = STEPS[activeStep];

  return (
    <section id="strategy" className="kh-process" data-process>
      <FieldMapStage
        className="kh-process-stage"
        imageClassName="kh-process-map"
        idPrefix="process-signal"
        variant="process"
        dataAttr={{ "data-process-map": true }}
      />
      <div className="kh-process-vignette" />
      <div className="kh-process-content">
        <StepRail activeStep={activeStep} onSelect={onSelectStep} />
        <article className="kh-step-card" data-step-card>
          <div className="kh-step-number">{step.num}</div>
          <div>
            <span>{step.label}</span>
            <h2>{step.title}</h2>
            <p>{step.text}</p>
          </div>
        </article>
      </div>
    </section>
  );
}

function WorkSection({ onNavigate }) {
  return (
    <section className="kh-work" id="work">
      <div className="kh-section-intro" data-row-reveal>
        <h2>Selected work, prototypes, and public thinking.</h2>
        <p>
          The writing and experiments are not a separate wing of the site. They are where the operating model becomes visible.
        </p>
      </div>
      <div className="kh-work-list">
        {WORK.map(([eyebrow, title, desc, id]) => (
          <button type="button" className="kh-work-row" key={id} onClick={() => onNavigate(id)} data-row-reveal>
            <span>{eyebrow}</span>
            <strong>{title}</strong>
            <p>{desc}</p>
          </button>
        ))}
      </div>
    </section>
  );
}

function CareerSection({ onNavigate }) {
  return (
    <section className="kh-career">
      <div className="kh-section-intro" data-row-reveal>
        <h2>Enterprise field work, product translation, AI-native tooling.</h2>
        <p>
          A career spent standing between customer reality, product constraint, and the systems that make expert work repeatable.
        </p>
      </div>
      <div className="kh-career-list">
        {CAREER.map(([years, company, role]) => (
          <div className="kh-career-row" key={`${years}-${company}`} data-row-reveal>
            <span>{years}</span>
            <strong>{company}</strong>
            <p>{role}</p>
          </div>
        ))}
      </div>
      <div className="kh-career-actions" data-row-reveal>
        <button type="button" onClick={() => onNavigate("resume")}>Resume</button>
        <a href="mailto:hello@darkvectorcognition.ai">Contact</a>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="kh-footer">
      <span>Built in Austin. 2026.</span>
      <div>
        <a href="https://www.linkedin.com/in/alsharma" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a href="https://github.com/kunalnano" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href="mailto:hello@darkvectorcognition.ai">Email</a>
      </div>
    </footer>
  );
}

export default function KineticHome({ onNavigate }) {
  const rootRef = useRef(null);
  const [activeStep, setActiveStep] = useState(0);

  useSmoothScroll(rootRef);
  useKineticMotion(rootRef, setActiveStep);

  const go = useCallback((id) => {
    window.location.hash = id;
    onNavigate(id);
    window.scrollTo(0, 0);
  }, [onNavigate]);

  useEffect(() => {
    const previous = document.body.style.background;
    document.body.style.background = "#dce8f1";
    return () => { document.body.style.background = previous; };
  }, []);

  return (
    <div className="kinetic-home" ref={rootRef}>
      <style>{`
        .kinetic-home {
          --kh-bg: #dce8f1;
          --kh-bg-deep: #c9d9e5;
          --kh-ink: #07081c;
          --kh-muted: rgba(7, 8, 28, 0.62);
          --kh-soft: rgba(7, 8, 28, 0.42);
          --kh-line: rgba(7, 8, 28, 0.13);
          --kh-line-strong: rgba(7, 8, 28, 0.24);
          --kh-blue: #174cff;
          --kh-white: rgba(255, 255, 255, 0.76);
          min-height: 100vh;
          background:
            radial-gradient(circle at 18% 20%, rgba(255,255,255,0.9), transparent 28rem),
            linear-gradient(180deg, var(--kh-bg), #d7e5ef 46%, #eef4f8 100%);
          color: var(--kh-ink);
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif;
          overflow-x: clip;
          -webkit-font-smoothing: antialiased;
          text-rendering: geometricPrecision;
        }

        .kinetic-home * { box-sizing: border-box; }
        .kinetic-home a { color: inherit; text-decoration: none; }
        .kinetic-home button { font: inherit; color: inherit; }

        .kh-nav {
          position: fixed;
          inset: 0 0 auto 0;
          z-index: 50;
          height: 76px;
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
          align-items: center;
          gap: 24px;
          padding: 0 clamp(18px, 3vw, 46px);
          background: rgba(220, 232, 241, 0.72);
          backdrop-filter: blur(20px) saturate(145%);
          border-bottom: 1px solid rgba(255,255,255,0.42);
        }

        .kh-nav-left,
        .kh-nav-right {
          display: flex;
          align-items: center;
          gap: clamp(14px, 2.2vw, 34px);
        }

        .kh-nav-right { justify-content: flex-end; }

        .kh-nav a,
        .kh-nav button {
          border: 0;
          background: transparent;
          cursor: pointer;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          font-size: 12px;
          font-weight: 650;
          white-space: nowrap;
        }

        .kh-brand {
          letter-spacing: 0.34em !important;
          font-size: 18px !important;
          font-weight: 800 !important;
        }

        .kh-contact {
          color: var(--kh-blue) !important;
        }

        .kh-hero {
          min-height: 100svh;
          position: relative;
          display: grid;
          place-items: start center;
          padding: clamp(118px, 15vh, 158px) clamp(20px, 4vw, 64px) 70px;
          overflow: hidden;
          isolation: isolate;
        }

        .kh-hero::after,
        .kh-process::after {
          content: "";
          position: absolute;
          inset: auto 0 0;
          height: 42%;
          background: linear-gradient(180deg, transparent, rgba(220, 232, 241, 0.78));
          pointer-events: none;
          z-index: -1;
        }

        .kh-map-stage {
          position: absolute;
          z-index: -2;
          max-width: none;
          pointer-events: none;
          user-select: none;
          transform-origin: center;
          will-change: transform;
        }

        .kh-map-drift {
          position: relative;
          width: 100%;
          animation: khMapBreathe 12s ease-in-out infinite alternate;
          transform-origin: center;
          will-change: transform;
        }

        .kh-map-image {
          display: block;
          width: 100%;
          height: auto;
          filter: saturate(1.03) contrast(1.02);
        }

        .kh-hero-stage {
          right: -5vw;
          bottom: -12vh;
          width: min(1500px, 116vw);
          opacity: 0.96;
        }

        .kh-map-signals {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: visible;
          mix-blend-mode: screen;
          opacity: 0.92;
        }

        .kh-map-signals--process {
          opacity: 0.76;
        }

        .kh-signal-path {
          fill: none;
          stroke: rgba(23, 76, 255, 0.72);
          stroke-width: 4;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-dasharray: 22 34;
          animation: khSignalFlow 4.8s linear infinite;
        }

        .kh-signal-path--main {
          stroke-width: 5;
          stroke: rgba(37, 143, 255, 0.78);
        }

        .kh-signal-path--soft {
          stroke-width: 3;
          stroke: rgba(90, 188, 255, 0.46);
          stroke-dasharray: 12 28;
        }

        .kh-signal-path--delay {
          animation-delay: -1.6s;
        }

        .kh-signal-path--slow {
          animation-duration: 6.4s;
          animation-direction: reverse;
        }

        .kh-signal-node {
          fill: rgba(23, 76, 255, 0.9);
          stroke: rgba(255, 255, 255, 0.9);
          stroke-width: 4;
          transform-box: fill-box;
          transform-origin: center;
          animation: khNodePulse 2.8s ease-in-out infinite;
          animation-delay: var(--node-delay);
        }

        .kh-signal-carrier {
          fill: #174cff;
          stroke: rgba(255,255,255,0.95);
          stroke-width: 5;
        }

        .kh-scroll-cue span {
          animation: khCueLine 2.4s ease-in-out infinite;
        }

        @keyframes khMapBreathe {
          from { transform: translate3d(0, 0, 0) scale(1); }
          to { transform: translate3d(-0.8%, -1%, 0) scale(1.012); }
        }

        @keyframes khSignalFlow {
          to { stroke-dashoffset: -112; }
        }

        @keyframes khNodePulse {
          0%, 100% {
            opacity: 0.62;
            transform: scale(0.82);
          }
          45% {
            opacity: 1;
            transform: scale(1.22);
          }
        }

        @keyframes khCueLine {
          0%, 100% { opacity: 0.52; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(7px); }
        }

        .kh-hero-copy {
          width: min(1040px, 100%);
          text-align: center;
          position: relative;
          z-index: 2;
        }

        .kh-hero h1 {
          margin: 0;
          font-size: clamp(54px, 7vw, 96px);
          line-height: 0.96;
          font-weight: 800;
          letter-spacing: 0;
        }

        .kh-hero-copy p {
          margin: 28px auto 0;
          max-width: 650px;
          color: var(--kh-muted);
          font-size: clamp(19px, 2.1vw, 27px);
          line-height: 1.32;
          font-weight: 450;
        }

        .kh-nowrap {
          white-space: nowrap;
        }

        .kh-hero-actions {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 34px;
        }

        .kh-hero-actions a,
        .kh-hero-actions button,
        .kh-career-actions a,
        .kh-career-actions button {
          min-height: 50px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          border: 1px solid rgba(7, 8, 28, 0.15);
          background: rgba(255, 255, 255, 0.52);
          padding: 0 24px;
          cursor: pointer;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          font-size: 12px;
          font-weight: 750;
          box-shadow: 0 18px 42px rgba(64, 94, 125, 0.08);
        }

        .kh-hero-actions a {
          background: var(--kh-ink);
          color: #fff;
          border-color: var(--kh-ink);
        }

        .kh-scroll-cue {
          position: absolute;
          left: 50%;
          bottom: clamp(30px, 6vh, 58px);
          transform: translateX(-50%);
          display: grid;
          justify-items: center;
          gap: 10px;
          color: var(--kh-blue);
          text-transform: uppercase;
          letter-spacing: 0.16em;
          font-size: 11px;
          font-weight: 760;
          z-index: 2;
        }

        .kh-scroll-cue span {
          width: 1px;
          height: 54px;
          background: currentColor;
          position: relative;
        }

        .kh-scroll-cue span::after {
          content: "";
          position: absolute;
          left: 50%;
          bottom: -4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: currentColor;
          transform: translateX(-50%);
        }

        .kh-process {
          min-height: 100svh;
          position: relative;
          overflow: hidden;
          background: linear-gradient(180deg, #dbe8f1, #d3e1ec);
          border-top: 1px solid rgba(255,255,255,0.5);
          border-bottom: 1px solid rgba(7, 8, 28, 0.08);
          isolation: isolate;
        }

        .kh-process-stage {
          right: -18vw;
          top: -5vh;
          width: min(1680px, 130vw);
          opacity: 0.8;
        }

        .kh-process-stage .kh-map-drift {
          animation-duration: 14s;
          animation-direction: alternate-reverse;
        }

        .kh-process-vignette {
          position: absolute;
          inset: 0;
          z-index: -1;
          background:
            linear-gradient(90deg, rgba(220,232,241,0.96) 0%, rgba(220,232,241,0.88) 27%, rgba(220,232,241,0.32) 56%, rgba(220,232,241,0.62) 100%),
            radial-gradient(circle at 74% 35%, transparent 0 24rem, rgba(220,232,241,0.45) 45rem);
          pointer-events: none;
        }

        .kh-process-content {
          min-height: 100svh;
          display: grid;
          grid-template-columns: minmax(330px, 0.62fr) minmax(460px, 0.9fr);
          align-items: center;
          gap: clamp(32px, 6vw, 96px);
          padding: 112px clamp(24px, 5vw, 76px) 74px;
        }

        .kh-step-rail {
          list-style: none;
          margin: 0;
          padding: 0 0 0 44px;
          display: grid;
          gap: 21px;
          position: relative;
        }

        .kh-step-rail::before {
          content: "";
          position: absolute;
          left: 10px;
          top: 12px;
          bottom: 12px;
          width: 1px;
          background: rgba(7, 8, 28, 0.18);
        }

        .kh-step-rail li {
          position: relative;
          color: var(--kh-soft);
          transition: color 220ms ease, transform 220ms ease, opacity 220ms ease;
        }

        .kh-step-rail button {
          width: 100%;
          display: grid;
          grid-template-columns: 58px minmax(0, 1fr);
          gap: 10px 18px;
          border: 0;
          padding: 0;
          background: transparent;
          color: inherit;
          text-align: left;
          cursor: pointer;
        }

        .kh-step-rail button:focus-visible {
          outline: 2px solid rgba(23, 76, 255, 0.72);
          outline-offset: 5px;
          border-radius: 6px;
        }

        .kh-step-rail li::before {
          content: "";
          position: absolute;
          left: -39px;
          top: 10px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #c3d1dc;
          border: 1px solid rgba(7, 8, 28, 0.16);
          transition: background 220ms ease, transform 220ms ease, box-shadow 220ms ease;
        }

        .kh-step-rail span {
          grid-row: 1 / span 2;
          color: inherit;
          font-size: 28px;
          font-weight: 760;
          line-height: 1;
        }

        .kh-step-rail strong {
          color: inherit;
          font-size: 19px;
          line-height: 1.15;
        }

        .kh-step-rail p {
          max-width: 360px;
          margin: 0;
          color: inherit;
          font-size: 14px;
          line-height: 1.45;
        }

        .kh-step-rail li.is-active {
          color: var(--kh-ink);
          transform: translateX(4px);
          opacity: 1;
        }

        .kh-step-rail li.is-active::before {
          background: var(--kh-blue);
          transform: scale(1.16);
          box-shadow: 0 0 0 7px rgba(23, 76, 255, 0.12);
        }

        .kh-step-rail li:not(.is-active) p {
          display: none;
        }

        .kh-step-card {
          align-self: center;
          display: grid;
          grid-template-columns: minmax(96px, 0.26fr) minmax(0, 1fr);
          gap: clamp(22px, 3.6vw, 42px);
          max-width: 690px;
        }

        .kh-step-number {
          font-size: clamp(88px, 10vw, 148px);
          line-height: 0.76;
          font-weight: 760;
          color: var(--kh-blue);
        }

        .kh-step-card span {
          display: block;
          color: var(--kh-blue);
          text-transform: uppercase;
          letter-spacing: 0.16em;
          font-size: 12px;
          font-weight: 800;
          margin-bottom: 12px;
        }

        .kh-step-card h2 {
          margin: 0;
          font-size: clamp(40px, 4.7vw, 64px);
          line-height: 0.96;
          letter-spacing: 0;
          font-weight: 800;
        }

        .kh-step-card p {
          max-width: 620px;
          margin: 20px 0 0;
          color: var(--kh-muted);
          font-size: clamp(17px, 1.6vw, 21px);
          line-height: 1.36;
        }

        .kh-work,
        .kh-career {
          padding: clamp(88px, 12vw, 152px) clamp(22px, 5vw, 76px);
          background: #f2f6f9;
          border-bottom: 1px solid rgba(7, 8, 28, 0.09);
        }

        .kh-career {
          background: #e8f0f5;
        }

        .kh-section-intro {
          max-width: 900px;
          margin: 0 auto 50px;
          text-align: center;
        }

        .kh-section-intro h2 {
          margin: 0;
          font-size: clamp(42px, 6vw, 86px);
          line-height: 0.98;
          font-weight: 800;
          letter-spacing: 0;
        }

        .kh-section-intro p {
          max-width: 720px;
          margin: 20px auto 0;
          color: var(--kh-muted);
          font-size: clamp(18px, 2vw, 23px);
          line-height: 1.42;
        }

        .kh-work-list,
        .kh-career-list {
          max-width: 1040px;
          margin: 0 auto;
          border-top: 1px solid var(--kh-line);
        }

        .kh-work-row,
        .kh-career-row {
          width: 100%;
          display: grid;
          grid-template-columns: 150px minmax(190px, 0.75fr) minmax(260px, 1fr);
          gap: clamp(18px, 3vw, 44px);
          align-items: baseline;
          padding: 28px 0;
          border: 0;
          border-bottom: 1px solid var(--kh-line);
          background: transparent;
          text-align: left;
        }

        .kh-work-row {
          cursor: pointer;
        }

        .kh-work-row:hover strong {
          color: var(--kh-blue);
        }

        .kh-work-row span,
        .kh-career-row span {
          color: var(--kh-muted);
          text-transform: uppercase;
          letter-spacing: 0.13em;
          font-size: 12px;
          font-weight: 760;
        }

        .kh-work-row strong,
        .kh-career-row strong {
          font-size: clamp(24px, 3vw, 36px);
          line-height: 1;
          font-weight: 800;
          transition: color 180ms ease;
        }

        .kh-work-row p,
        .kh-career-row p {
          margin: 0;
          color: var(--kh-muted);
          font-size: 17px;
          line-height: 1.46;
        }

        .kh-career-actions {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 12px;
          margin-top: 38px;
        }

        .kh-career-actions button {
          background: var(--kh-ink);
          color: #fff;
          border-color: var(--kh-ink);
        }

        .kh-footer {
          display: flex;
          justify-content: space-between;
          gap: 18px;
          flex-wrap: wrap;
          padding: 28px clamp(22px, 5vw, 76px);
          color: var(--kh-muted);
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          background: #f8fafc;
        }

        .kh-footer div {
          display: flex;
          gap: 18px;
          flex-wrap: wrap;
        }

        .kh-footer a:hover {
          color: var(--kh-blue);
        }

        @media (prefers-reduced-motion: reduce) {
          .kh-map-drift,
          .kh-scroll-cue span,
          .kh-signal-path,
          .kh-signal-node {
            animation: none !important;
          }

          .kh-signal-carrier {
            display: none;
          }
        }

        @media (max-width: 1040px) {
          .kh-brand {
            font-size: 15px !important;
            letter-spacing: 0.24em !important;
          }

          .kh-process-content {
            grid-template-columns: 1fr;
            align-content: center;
          }

          .kh-step-rail {
            grid-template-columns: repeat(4, minmax(0, 1fr));
            padding-left: 0;
            gap: 12px;
          }

          .kh-step-rail::before,
          .kh-step-rail li::before,
          .kh-step-rail p {
            display: none;
          }

          .kh-step-rail li {
            padding: 14px;
            border-radius: 8px;
            background: rgba(255,255,255,0.35);
          }

          .kh-step-rail button {
            grid-template-columns: 1fr;
            gap: 8px;
          }

          .kh-step-rail span {
            grid-row: auto;
            font-size: 22px;
          }
        }

        @media (max-width: 760px) {
          .kh-nav {
            height: auto;
            grid-template-columns: 1fr;
            justify-items: center;
            gap: 10px;
            padding: 13px 16px;
          }

          .kh-nav-left,
          .kh-nav-right {
            width: 100%;
            justify-content: center;
            gap: 18px;
            overflow-x: auto;
            scrollbar-width: none;
          }

          .kh-nav-left::-webkit-scrollbar,
          .kh-nav-right::-webkit-scrollbar { display: none; }

          .kh-nav a,
          .kh-nav button {
            font-size: 10px;
            letter-spacing: 0.1em;
          }

          .kh-brand {
            order: -1;
            font-size: 13px !important;
            letter-spacing: 0.2em !important;
          }

          .kh-hero {
            min-height: 92svh;
            padding-top: 136px;
            place-items: start;
          }

          .kh-hero-copy {
            text-align: left;
          }

          .kh-hero h1 {
            font-size: clamp(45px, 14vw, 68px);
          }

          .kh-hero-copy p {
            margin-left: 0;
            font-size: 19px;
          }

          .kh-hero-actions {
            justify-content: flex-start;
          }

          .kh-hero-actions a,
          .kh-hero-actions button,
          .kh-career-actions a,
          .kh-career-actions button {
            width: 100%;
          }

          .kh-hero-stage {
            width: 190vw;
            right: -76vw;
            bottom: -2vh;
            opacity: 0.82;
          }

          .kh-scroll-cue {
            left: 22px;
            transform: none;
            justify-items: start;
            bottom: 28px;
          }

          .kh-process {
            min-height: auto;
          }

          .kh-process-content {
            min-height: auto;
            padding: 116px 20px 70px;
          }

          .kh-process-stage {
            width: 220vw;
            right: -112vw;
            top: 12vh;
            opacity: 0.58;
          }

          .kh-step-rail {
            grid-template-columns: 1fr 1fr;
          }

          .kh-step-card {
            grid-template-columns: 1fr;
            padding: 22px;
          }

          .kh-step-number {
            font-size: 92px;
          }

          .kh-step-card h2,
          .kh-section-intro h2 {
            font-size: clamp(36px, 12vw, 54px);
          }

          .kh-work-row,
          .kh-career-row {
            grid-template-columns: 1fr;
            gap: 10px;
          }

          .kh-footer {
            display: grid;
          }
        }
      `}</style>
      <Nav onNavigate={go} />
      <Hero onNavigate={go} />
      <ProcessSection activeStep={activeStep} onSelectStep={setActiveStep} />
      <WorkSection onNavigate={go} />
      <CareerSection onNavigate={go} />
      <Footer />
    </div>
  );
}
