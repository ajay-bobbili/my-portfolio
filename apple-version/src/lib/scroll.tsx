"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import Lenis from "lenis";
import { prefersReducedMotion } from "./hooks";

let instance: Lenis | null = null;

const LenisContext = createContext<Lenis | null>(null);
/** The Lenis instance (null on the server, with reduced motion, or before mount). */
export const useLenis = () => useContext(LenisContext);

/** Scroll to a section id ("about" or "#about"), element, or pixel offset. Uses Lenis when active. */
export function scrollToTarget(target: string | number | HTMLElement, offset = 0) {
  let el: HTMLElement | null = null;
  if (typeof target === "string") el = document.getElementById(target.replace(/^#/, ""));
  else if (typeof target !== "number") el = target;
  if (typeof target !== "number" && !el) return;
  if (instance) {
    instance.scrollTo(typeof target === "number" ? target : (el as HTMLElement), { offset, duration: 1.3 });
  } else {
    const top = typeof target === "number" ? target : (el as HTMLElement).getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }
}

/** Lock / unlock page scrolling (mobile menu overlay). */
export function setScrollLocked(locked: boolean) {
  if (locked) instance?.stop();
  else instance?.start();
  document.documentElement.style.overflow = locked ? "hidden" : "";
}

export function LenisProvider({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const l = new Lenis({ autoRaf: true, lerp: 0.1, smoothWheel: true });
    instance = l;
    setLenis(l);
    return () => {
      l.destroy();
      instance = null;
      setLenis(null);
    };
  }, []);
  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
