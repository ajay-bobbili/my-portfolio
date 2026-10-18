"use client";
import { useEffect, useRef, useState } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import TechLogo from "@/components/ui/TechLogo";
import { prefersReducedMotion } from "@/lib/hooks";
import { PROJECTS } from "@/lib/data";

export default function Work() {
  const scroller = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const upd = () => setEdge({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8 });
    upd();
    el.addEventListener("scroll", upd, { passive: true });
    window.addEventListener("resize", upd);
    return () => {
      el.removeEventListener("scroll", upd);
      window.removeEventListener("resize", upd);
    };
  }, []);

  const step = (dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("article");
    const w = (card?.offsetWidth ?? 480) + 20;
    el.scrollBy({ left: dir * w, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  };

  return (
    <section id="work" className="section bg-g" aria-labelledby="work-heading" style={{ overflowX: "clip" }}>
      <div className="wrap">
        <SectionHeading id="work" title="Things I’ve built." sub="Swipe to see more." />
      </div>
      <div ref={scroller} className="wk-scroll rv" role="list" tabIndex={0} aria-label="Projects, scroll horizontally">
        {PROJECTS.map((p) => (
          <article key={p.id} role="listitem" className="card wk-card" aria-labelledby={`wk-t-${p.id}`}>
            <p className="k">
              {p.kicker} · {p.date}
            </p>
            <h3 id={`wk-t-${p.id}`} className="wk-t">{p.title}</h3>
            <p className="wk-d">{p.description}</p>
            <ul className="wk-tech" aria-label="Technologies">
              {p.tech.map((t) => (
                <li key={t.name}>
                  {t.logo && <TechLogo name={t.logo} size={14} />}
                  {t.name}
                </li>
              ))}
            </ul>
            <div className="wk-foot">
              {p.link && (
                <a className="more" href={p.link.href} target="_blank" rel="noopener noreferrer">
                  {p.link.label}
                  <span className="sr-only-x"> (opens in new tab)</span>
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
      <div className="wrap">
        <div className="wk-ctrl">
          <button type="button" className="circ" aria-label="Previous project" disabled={edge.start} onClick={() => step(-1)}>&#8249;</button>
          <button type="button" className="circ" aria-label="Next project" disabled={edge.end} onClick={() => step(1)}>&#8250;</button>
        </div>
      </div>
    </section>
  );
}
