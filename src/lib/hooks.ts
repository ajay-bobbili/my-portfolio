"use client";
import { useEffect, useRef, useState, type RefObject } from "react";

/** True when the user asked for reduced motion. Safe on the server (returns false). */
export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

interface InViewOptions {
  threshold?: number | number[];
  rootMargin?: string;
  /** Stay true after first intersection (default true). */
  once?: boolean;
}

/** Returns [ref, inView]. Attach ref to the element to watch. */
export function useInView<T extends Element = HTMLElement>(opts: InViewOptions = {}): [RefObject<T | null>, boolean] {
  const { threshold = 0.2, rootMargin = "0px", once = true } = opts;
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          if (once) io.disconnect();
        } else if (!once) setInView(false);
      },
      { threshold, rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [once, rootMargin, JSON.stringify(threshold)]);
  return [ref, inView];
}

/**
 * Scroll progress 0..1.
 *  - no ref: whole-page progress.
 *  - mode "through" (default): 0 when the element's top enters the viewport bottom, 1 when its bottom leaves the top.
 *  - mode "pinned": 0 when the element's top reaches the viewport top, 1 when its bottom reaches the viewport bottom
 *    (use for tall wrappers containing a sticky 100svh child).
 *  - mode "center": like "through" but reaches 1 when the element's bottom is near the viewport centre.
 */
export function useScrollProgress(ref?: RefObject<Element | null>, mode: "through" | "pinned" | "center" = "through"): number {
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const calc = () => {
      raf = 0;
      const vh = window.innerHeight;
      let v: number;
      if (!ref) {
        const max = document.documentElement.scrollHeight - vh;
        v = max > 0 ? window.scrollY / max : 0;
      } else {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        if (mode === "pinned") {
          const travel = r.height - vh;
          v = travel > 0 ? -r.top / travel : 0;
        } else if (mode === "center") {
          v = (vh * 0.6 - r.top) / (r.height + vh * 0.1);
        } else {
          v = (vh - r.top) / (r.height + vh);
        }
      }
      setP(Math.min(1, Math.max(0, v)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(calc);
    };
    calc();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);
  return p;
}
