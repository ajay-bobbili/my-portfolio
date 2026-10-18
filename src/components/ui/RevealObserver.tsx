"use client";
import { useEffect } from "react";

/** Mount once (App does). Adds .is-in to every .rv / .rv-mask when it scrolls into view, once only.
 *  Elements added later (client-rendered) are picked up by a MutationObserver. */
export default function RevealObserver() {
  useEffect(() => {
    const SEL = ".rv, .rv-mask";
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    const seen = new WeakSet<Element>();
    const scan = (root: ParentNode) => {
      root.querySelectorAll(SEL).forEach((el) => {
        if (!seen.has(el) && !el.classList.contains("is-in")) {
          seen.add(el);
          io.observe(el);
        }
      });
    };
    scan(document);
    const mo = new MutationObserver((muts) => {
      for (const m of muts) m.addedNodes.forEach((n) => {
        if (n instanceof Element) {
          if (n.matches(SEL) && !seen.has(n)) { seen.add(n); io.observe(n); }
          scan(n);
        }
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { io.disconnect(); mo.disconnect(); };
  }, []);
  return null;
}
