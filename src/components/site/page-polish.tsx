"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
export function PagePolish() {
  const path = usePathname();
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const main = document.querySelector("main");
    const transition = main?.animate(
      [
        { opacity: 0.65, transform: "translateY(8px)" },
        { opacity: 1, transform: "translateY(0)" },
      ],
      { duration: 240, easing: "cubic-bezier(0.22,1,0.36,1)" },
    );
    return () => transition?.cancel();
  }, [path]);
  return null;
}
