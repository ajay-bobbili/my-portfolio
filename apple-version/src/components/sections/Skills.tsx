"use client";
import { useState } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import TechLogo, { isBrand } from "@/components/ui/TechLogo";
import { SKILLS, SKILL_GROUPS } from "@/lib/data";

export default function Skills() {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = SKILLS[activeIdx];

  return (
    <section id="skills" className="section bg-w" aria-labelledby="skills-heading">
      <div className="wrap">
        <SectionHeading id="skills" title="Tools of the trade." sub="Ordered by recency, newest role first. Select any tile to see where I used it." />

        <aside className="card sk-insp rv" aria-live="polite" aria-label="Skill details">
          <div className="sk-logo" key={active.symbol}>
            <TechLogo name={active.logo} size={88} label={`${active.name} logo`} className="glyph" />
          </div>
          <div>
            <p className="k">{active.family}</p>
            <h3 className="sk-title">{active.name}</h3>
            {active.usedIn ? (
              <ul className="sk-used">
                {active.usedIn.map((u) => (
                  <li key={u}>{u}</li>
                ))}
              </ul>
            ) : (
              <p className="mid">Listed under {active.family.toLowerCase()} in my résumé.</p>
            )}
          </div>
        </aside>

        <div className="sk-grid">
          {SKILL_GROUPS.map((g, gi) => (
            <section key={g.family} className={`card sk-fam rv${gi === 0 ? " wide" : ""}`} style={{ ["--i" as string]: gi % 3 }} aria-label={g.family}>
              <h3>
                {g.family}
                <span>{g.skills.length}</span>
              </h3>
              <ul className="sk-tiles">
                {g.skills.map((s) => {
                  const i = SKILLS.indexOf(s);
                  return (
                    <li key={s.symbol}>
                      <button
                        type="button"
                        className={`sk-tile${i === activeIdx ? " is-active" : ""}`}
                        style={{ width: "100%" }}
                        onMouseEnter={() => setActiveIdx(i)}
                        onFocus={() => setActiveIdx(i)}
                        onClick={() => setActiveIdx(i)}
                        aria-label={`${s.name}, ${s.family}`}
                        aria-current={i === activeIdx ? "true" : undefined}
                      >
                        <TechLogo name={s.logo} size={32} className={isBrand(s.logo) ? "" : "glyph"} />
                        <span>{s.name}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
