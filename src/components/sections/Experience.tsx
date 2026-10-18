"use client";
import { useEffect, useRef } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import { TIMELINE } from "@/lib/data";
import { useScrollProgress } from "@/lib/hooks";

export default function Experience() {
  const listRef = useRef<HTMLOListElement>(null);
  const p = useScrollProgress(listRef, "center");

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const fill = p * list.offsetHeight;
    list.style.setProperty("--fill", `${fill}px`);
    list.querySelectorAll<HTMLElement>("li[data-stop]").forEach((li) => {
      li.classList.toggle("on", li.offsetTop + 30 <= fill);
    });
  }, [p]);

  return (
    <section id="experience" className="exp" aria-labelledby="experience-heading">
      <div className="wrap">
        <SectionHeading id="experience" lead="Where I've" accent="been." />
        <ol ref={listRef} className="exp-list" aria-label="Education and experience timeline">
          {TIMELINE.map((t, i) => (
            <li key={t.id} data-stop className="exp-item">
              <span className="exp-dot" aria-hidden="true" />
              <article className="card exp-card rv" style={{ ["--i" as string]: 0 }}>
                <header>
                  <p className="exp-kind mono">
                    {String(i + 1).padStart(2, "0")} · {t.kind === "work" ? "Experience" : "Education"}
                  </p>
                  <h3 className="exp-title">{t.title}</h3>
                  <p className="exp-org">
                    {t.org}
                    {t.place ? `, ${t.place}` : ""}
                  </p>
                  <p className="exp-period mono">{t.period}</p>
                </header>
                {t.bullets && (
                  <ul className="exp-bullets">
                    {t.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                )}
              </article>
            </li>
          ))}
          <li className="exp-item">
            <span className="exp-dot exp-dot-next" aria-hidden="true" />
            <div className="exp-next rv">
              <p className="mono exp-kind">Next</p>
              <p className="exp-title">
                Your <span className="accent">team?</span>
              </p>
            </div>
          </li>
        </ol>
      </div>
      <style>{`
        .exp { padding-block: var(--section-pad); }
        .exp-list { --fill: 0px; position: relative; margin-top: clamp(40px, 6vw, 80px); padding-left: clamp(36px, 6vw, 96px); display: grid; gap: 28px; max-width: 980px; }
        .exp-list::before, .exp-list::after { content: ""; position: absolute; left: 9px; top: 0; width: 2px; border-radius: 2px; }
        .exp-list::before { bottom: 0; background: var(--line); }
        .exp-list::after { height: var(--fill); max-height: 100%; background: var(--ink); }
        .exp-item { position: relative; }
        .exp-dot { position: absolute; left: calc(-1 * clamp(36px, 6vw, 96px) + 1px); top: 30px; width: 18px; height: 18px; border-radius: 50%; background: var(--paper); box-shadow: inset 0 0 0 2px var(--faint); transition: background 0.5s var(--ease), box-shadow 0.5s var(--ease), transform 0.5s var(--ease); }
        .exp-item.on .exp-dot { background: var(--ink); box-shadow: 0 0 0 5px rgba(13,13,13,.12); transform: scale(1.1); }
        .exp-card { padding: clamp(22px, 3vw, 36px); }
        .exp-kind { font-size: 12px; letter-spacing: .08em; text-transform: uppercase; color: var(--mute); }
        .exp-title { margin-top: 10px; font-size: clamp(22px, 2.6vw, 34px); font-weight: 700; letter-spacing: -0.04em; line-height: 1.1; }
        .exp-org { margin-top: 6px; color: var(--ink-2); font-size: 16px; }
        .exp-period { margin-top: 10px; font-size: 12px; color: var(--mute); }
        .exp-bullets { margin-top: 22px; display: grid; gap: 10px; }
        .exp-bullets li { position: relative; padding-left: 18px; font-size: 15px; line-height: 1.55; color: var(--ink-2); }
        .exp-bullets li::before { content: ""; position: absolute; left: 0; top: .7em; width: 6px; height: 1px; background: var(--mute); }
        .exp-next { padding: clamp(22px, 3vw, 36px); border-radius: 26px; border: 1.5px dashed rgba(13,13,13,.28); }
        .exp-dot-next { box-shadow: inset 0 0 0 2px var(--faint); }
        .exp-item:last-child.on .exp-dot { background: var(--ink); }
        @media (prefers-reduced-motion: reduce) { .exp-list::after { transition: none; } }
      `}</style>
    </section>
  );
}
