"use client";
import { useEffect } from "react";
import "./intro-loader.css";

export function IntroLoader() {
  useEffect(() => {
    const root = document.documentElement;
    if (!root.hasAttribute("data-intro")) return;
    const dismiss = () => root.removeAttribute("data-intro");
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === "Tab") dismiss();
    };
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const onMotion = () => { if (reduced.matches) dismiss(); };
    const timer = window.setTimeout(dismiss, 2000);
    window.addEventListener("keydown", onKey);
    window.addEventListener("pagehide", dismiss);
    reduced.addEventListener("change", onMotion);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pagehide", dismiss);
      reduced.removeEventListener("change", onMotion);
    };
  }, []);
  return <div className="pf-intro" aria-hidden="true" onPointerDown={() => document.documentElement.removeAttribute("data-intro")}>
    <div className="pf-intro-logo">
      <img className="pf-intro-logo-base" src="/shared/branding/imgPercyAvatarSvg.svg" alt="" width={112} height={112} fetchPriority="high" />
      <img className="pf-intro-logo-fill" src="/shared/branding/imgPercyAvatarSvg.svg" alt="" width={112} height={112} />
    </div>
    <div className="pf-intro-line" />
  </div>;
}
