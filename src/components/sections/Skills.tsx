"use client";
import { useEffect, useState } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import TechLogo from "@/components/ui/TechLogo";
import { SKILLS, SKILL_FAMILIES, type SkillFamily } from "@/lib/data";
import { useInView } from "@/lib/hooks";

export default function Skills() {
  const [filter, setFilter] = useState<SkillFamily | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [cols, setCols] = useState(8);
  const [gridRef, shown] = useInView<HTMLUListElement>({ threshold: 0.12 });

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const set = () => setCols(mq.matches ? 8 : 4);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);

  const active = SKILLS[activeIdx];
  const count = (f: SkillFamily) => SKILLS.filter((s) => s.family === f).length;

  return (
    <section id="skills" className="section" aria-labelledby="skills-heading">
      <style>{css}</style>
      <div className="wrap">
        <SectionHeading id="skills" lead="The periodic table of" accent="my stack." />

        <div className="sk-chips rv" role="group" aria-label="Filter skills by family">
          <button type="button" className="sk-chip" aria-pressed={filter === null} onClick={() => setFilter(null)}>
            All <span>{SKILLS.length}</span>
          </button>
          {SKILL_FAMILIES.map((f) => (
            <button
              key={f}
              type="button"
              className="sk-chip"
              aria-pressed={filter === f}
              onClick={() => setFilter(filter === f ? null : f)}
            >
              {f} <span>{count(f)}</span>
            </button>
          ))}
        </div>

        <div className="sk-layout">
          <ul ref={gridRef} className={`sk-grid${shown ? " is-shown" : ""}`} aria-label="Skills">
            {SKILLS.map((s, i) => {
              const dim = filter !== null && s.family !== filter;
              const delay = (Math.floor(i / cols) + (i % cols)) * 40;
              return (
                <li key={s.symbol} style={{ transitionDelay: `${delay}ms` }} className="sk-li">
                  <button
                    type="button"
                    className={`sk-tile${i === activeIdx ? " is-active" : ""}${dim ? " is-dim" : ""}`}
                    onMouseEnter={() => setActiveIdx(i)}
                    onFocus={() => setActiveIdx(i)}
                    onClick={() => setActiveIdx(i)}
                    aria-label={`${s.name}, ${s.family}`}
                    aria-current={i === activeIdx ? "true" : undefined}
                  >
                    <span className="sk-num mono">{s.number}</span>
                    <span className="sk-sym">{s.symbol}</span>
                    <span className="sk-name">{s.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          <aside className="sk-insp card card-active" aria-live="polite" aria-label="Skill inspector">
            <div className="sk-insp-in">
              <div className="sk-logo" key={active.symbol}>
                <TechLogo name={active.logo} size={150} label={`${active.name} logo`} className="sk-pop" />
              </div>
              <p className="sk-fam mono">
                {String(active.number).padStart(2, "0")} · {active.symbol} · {active.family}
              </p>
              <h3 className="sk-title">{active.name}</h3>
              {active.usedIn ? (
                <>
                  <p className="sk-used-h mono">Used in</p>
                  <ul className="sk-used">
                    {active.usedIn.map((u) => (
                      <li key={u}>{u}</li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="sk-used-none">Listed under {active.family.toLowerCase()} in my résumé.</p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

const css = `
.sk-chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:40px}
.sk-chip{display:inline-flex;align-items:center;gap:8px;height:40px;padding-inline:16px;border-radius:999px;font-size:14px;font-weight:600;box-shadow:inset 0 0 0 1px rgba(13,13,13,.18);transition:background .4s var(--ease),color .4s var(--ease),transform .4s var(--ease)}
.sk-chip span{font-family:var(--f-mono),monospace;font-size:11px;color:var(--mute);transition:color .4s var(--ease)}
.sk-chip:hover{transform:translateY(-2px)}
.sk-chip[aria-pressed="true"]{background:var(--ink);color:#fff}
.sk-chip[aria-pressed="true"] span{color:rgba(255,255,255,.6)}
.sk-layout{display:grid;grid-template-columns:minmax(0,1fr) 320px;gap:32px;margin-top:32px;align-items:start}
.sk-grid{display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:8px}
.sk-li{opacity:0;transform:translateY(18px) scale(.94);transition:opacity .8s var(--ease),transform .8s var(--ease);min-width:0}
.sk-grid.is-shown .sk-li{opacity:1;transform:none}
.sk-tile{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;width:100%;aspect-ratio:1;padding:6px;border-radius:14px;background:var(--card);box-shadow:inset 0 0 0 1px var(--line);transition:opacity .5s var(--ease),transform .5s var(--ease),background .4s var(--ease),color .4s var(--ease),box-shadow .5s var(--ease);min-width:0}
.sk-tile:hover,.sk-tile.is-active{transform:translateY(-3px);box-shadow:inset 0 0 0 1px rgba(13,13,13,.35),0 18px 30px -18px rgba(13,13,13,.35)}
.sk-tile.is-active{background:var(--ink);color:#fff}
.sk-tile.is-dim{opacity:.22}
.sk-num{position:absolute;top:7px;left:9px;font-size:10px;color:var(--mute)}
.sk-tile.is-active .sk-num{color:rgba(255,255,255,.6)}
.sk-sym{font-weight:700;font-size:clamp(22px,2.6vw,34px);letter-spacing:-.04em;line-height:1}
.sk-name{margin-top:6px;font-size:clamp(9px,.9vw,11.5px);line-height:1.15;text-align:center;color:var(--ink-2);max-width:100%;overflow-wrap:anywhere}
.sk-tile.is-active .sk-name{color:rgba(255,255,255,.8)}
.sk-insp{position:sticky;top:96px;padding:28px;min-height:420px}
.sk-logo{height:150px;display:flex;align-items:center;justify-content:center}
.sk-pop{animation:skPop .6s var(--ease) both}
@keyframes skPop{0%{transform:scale(.5) rotate(-8deg);opacity:0}100%{transform:none;opacity:1}}
.sk-fam{margin-top:22px;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--mute)}
.sk-title{margin-top:6px;font-size:30px;font-weight:700;letter-spacing:-.04em;line-height:1.05}
.sk-used-h{margin-top:20px;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--mute)}
.sk-used{margin-top:8px;display:grid;gap:8px}
.sk-used li{font-size:14px;line-height:1.4;color:var(--ink-2);padding-left:14px;position:relative}
.sk-used li::before{content:"";position:absolute;left:0;top:.55em;width:6px;height:1px;background:var(--ink)}
.sk-used-none{margin-top:18px;font-size:14px;color:var(--mute)}
@media (max-width:1023px){
 .sk-layout{grid-template-columns:minmax(0,1fr)}
 .sk-insp{position:static;min-height:0}
}
@media (max-width:767px){
 .sk-grid{grid-template-columns:repeat(4,minmax(0,1fr));gap:6px}
 .sk-sym{font-size:22px}
 .sk-name{font-size:9px}
 .sk-num{top:5px;left:6px;font-size:9px}
}
@media (prefers-reduced-motion:reduce){.sk-li{opacity:1;transform:none}.sk-pop{animation:none}}
`;
