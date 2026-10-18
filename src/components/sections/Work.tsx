"use client";
import { useState } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import TechLogo from "@/components/ui/TechLogo";
import { PROJECTS, type Project } from "@/lib/data";

function Visual({ kind }: { kind: Project["visual"] }) {
  if (kind === "blog")
    return (
      <div className="mu mu-blog" aria-hidden="true">
        <div className="mu-bar"><i /><i /><i /><b /></div>
        <div className="mu-compose"><span /><em>Post</em></div>
        {[0, 1, 2].map((n) => (
          <div className="mu-post" key={n} style={{ ["--n" as string]: n }}>
            <i className="mu-av" />
            <div><b /><span /><span /></div>
          </div>
        ))}
      </div>
    );
  if (kind === "voice")
    return (
      <div className="mu mu-voice" aria-hidden="true">
        <div className="mu-mic"><i /><i /><i /><span /></div>
        <div className="mu-bub l"><span /><span /></div>
        <div className="mu-bub r"><span /></div>
        <div className="mu-cards"><div><span /><b /></div><div><span /><b /></div><div><span /><b /></div></div>
      </div>
    );
  return (
    <div className="mu mu-iot" aria-hidden="true">
      <div className="mu-bar"><i /><i /><i /><b /></div>
      <div className="mu-tiles">
        {[0, 1, 2, 3].map((n) => (
          <div key={n} className={n % 2 === 0 ? "on" : ""}>
            <span>Appliance {String(n + 1).padStart(2, "0")}</span>
            <i><u /></i>
          </div>
        ))}
      </div>
      <div className="mu-voice-btn"><i />Voice</div>
    </div>
  );
}

export default function Work() {
  const [open, setOpen] = useState(0);
  return (
    <section id="work" className="section" aria-labelledby="work-heading">
      <style>{css}</style>
      <div className="wrap">
        <SectionHeading id="work" lead="Things I've" accent="built." />
        <div className="wk-row rv" role="list">
          {PROJECTS.map((p, i) => {
            const isOpen = open === i;
            return (
              <article
                key={p.id}
                role="listitem"
                className={`wk-panel${isOpen ? " is-open" : ""}`}
                onMouseEnter={() => setOpen(i)}
                aria-labelledby={`wk-t-${p.id}`}
              >
                <button
                  type="button"
                  className="wk-spine"
                  aria-expanded={isOpen}
                  aria-controls={`wk-b-${p.id}`}
                  onFocus={() => setOpen(i)}
                  onClick={() => setOpen(i)}
                  tabIndex={isOpen ? -1 : 0}
                >
                  <span className="wk-sn mono">{p.number}</span>
                  <span className="wk-st">{p.title}</span>
                  <span className="wk-plus" aria-hidden="true">+</span>
                </button>

                <div className="wk-bw" id={`wk-b-${p.id}`}>
                  <div className="wk-body">
                    <div className="wk-left">
                      <p className="wk-kick mono">
                        {p.number} · {p.kicker} · {p.date}
                      </p>
                      <h3 id={`wk-t-${p.id}`} className="wk-title">{p.title}</h3>
                      <p className="wk-desc">{p.description}</p>
                      <ul className="wk-feat">
                        {p.features.map((f) => (
                          <li key={f}>{f}</li>
                        ))}
                      </ul>
                      <ul className="wk-tech" aria-label="Technologies">
                        {p.tech.map((t) => (
                          <li key={t.name}>
                            {t.logo && <TechLogo name={t.logo} size={16} />}
                            {t.name}
                          </li>
                        ))}
                      </ul>
                      {p.link && (
                        <a className="btn btn-primary btn-sm wk-link" href={p.link.href} target="_blank" rel="noopener noreferrer" tabIndex={isOpen ? 0 : -1}>
                          {p.link.label} <span aria-hidden="true">↗</span>
                        </a>
                      )}
                    </div>
                    <div className="wk-right">
                      <div className="wk-vis">
                        <Visual kind={p.visual} />
                      </div>
                      <p className="wk-cap mono">Illustrative UI</p>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const css = `
.wk-row{display:flex;gap:12px;margin-top:56px;height:min(78svh,600px)}
.wk-panel{position:relative;flex:1 1 0;min-width:0;overflow:hidden;border-radius:26px;background:var(--card);box-shadow:inset 0 0 0 1px var(--line);transition:flex-grow .9s var(--ease),box-shadow .6s var(--ease)}
.wk-panel.is-open{flex-grow:8;box-shadow:inset 0 0 0 1px var(--line),0 40px 80px -30px rgba(13,13,13,.25)}
.wk-panel:has(.wk-spine:focus-visible){outline:2px solid var(--ink);outline-offset:3px}
.wk-spine{position:absolute;inset:0;z-index:2;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:24px 0;width:100%;transition:opacity .4s var(--ease)}
.wk-spine:focus-visible{outline:none}
.wk-panel.is-open .wk-spine{opacity:0;pointer-events:none}
.wk-sn{font-size:12px;letter-spacing:.08em;color:var(--mute)}
.wk-st{writing-mode:vertical-rl;transform:rotate(180deg);font-weight:700;font-size:20px;letter-spacing:-.03em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-height:calc(100% - 100px)}
.wk-plus{font-size:26px;line-height:1;width:36px;height:36px;border-radius:50%;display:grid;place-items:center;box-shadow:inset 0 0 0 1px rgba(13,13,13,.2);transition:transform .6s var(--ease),background .4s var(--ease),color .4s var(--ease)}
.wk-panel:hover .wk-plus,.wk-spine:focus-visible .wk-plus{transform:rotate(90deg);background:var(--ink);color:#fff}
.wk-bw{position:absolute;inset:0;opacity:0;pointer-events:none;transition:opacity .3s var(--ease)}
.wk-panel.is-open .wk-bw{opacity:1;pointer-events:auto;transition:opacity .6s var(--ease) .3s}
.wk-body{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);gap:28px;height:100%;padding:36px;min-width:min(100%,760px)}
.wk-left{display:flex;flex-direction:column;min-width:0;overflow:hidden}
.wk-kick{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--mute)}
.wk-title{margin-top:12px;font-weight:700;font-size:clamp(26px,2.9vw,42px);letter-spacing:-.045em;line-height:1.02;text-wrap:balance}
.wk-desc{margin-top:14px;font-size:15px;line-height:1.5;color:var(--ink-2)}
.wk-feat{margin-top:16px;display:grid;grid-template-columns:1fr 1fr;gap:6px 16px}
.wk-feat li{font-size:13px;line-height:1.3;color:var(--ink-2);padding-left:14px;position:relative}
.wk-feat li::before{content:"";position:absolute;left:0;top:.6em;width:6px;height:1px;background:var(--ink)}
.wk-tech{margin-top:16px;display:flex;flex-wrap:wrap;gap:6px}
.wk-tech li{display:inline-flex;align-items:center;gap:6px;height:28px;padding-inline:11px;border-radius:999px;font-size:12px;font-weight:500;box-shadow:inset 0 0 0 1px var(--line);background:var(--paper)}
.wk-tech li:has(img){padding-left:7px}
.wk-link{margin-top:auto;align-self:flex-start}
.wk-tech + .wk-link{margin-top:20px}
.wk-right{display:flex;flex-direction:column;min-width:0}
.wk-vis{flex:1;min-height:0;border-radius:18px;background:var(--paper);box-shadow:inset 0 0 0 1px var(--line);overflow:hidden;clip-path:inset(0 100% 0 0);transition:clip-path .1s linear;display:grid;place-items:center;padding:20px}
.wk-panel.is-open .wk-vis{clip-path:inset(0 0 0 0);transition:clip-path 1.1s var(--ease) .35s}
.wk-cap{margin-top:10px;font-size:10.5px;letter-spacing:.08em;text-transform:uppercase;color:var(--faint);text-align:right}

/* mini UIs: grayscale only */
.mu{width:100%;max-width:340px;max-height:100%;border-radius:14px;background:#fff;box-shadow:0 20px 40px -24px rgba(13,13,13,.4),inset 0 0 0 1px var(--line);padding:14px;display:grid;gap:10px;overflow:hidden}
.mu span,.mu b{display:block;height:7px;border-radius:4px;background:#e1ded8}
.mu b{background:#c9c6c0;width:55%}
.mu-bar{display:flex;gap:5px;align-items:center}
.mu-bar i{width:8px;height:8px;border-radius:50%;background:#d6d3cd}
.mu-bar b{margin-left:auto;width:34%;height:7px}
.mu-compose{display:flex;gap:8px;align-items:center;padding:10px;border-radius:10px;box-shadow:inset 0 0 0 1px var(--line)}
.mu-compose span{flex:1;height:8px}
.mu-compose em{font-style:normal;font-size:11px;font-weight:600;background:var(--ink);color:#fff;border-radius:999px;padding:4px 12px}
.mu-post{display:flex;gap:10px;align-items:flex-start;padding:8px 2px;border-top:1px solid var(--line)}
.mu-post>div{flex:1;display:grid;gap:6px}
.mu-av{width:26px;height:26px;border-radius:50%;background:#bdbab4;flex:none}
.mu-post:nth-of-type(odd) .mu-av{background:#8c8982}
.mu-voice{justify-items:center;gap:12px;padding:20px}
.mu-mic{position:relative;width:76px;height:76px;display:grid;place-items:center}
.mu-mic span{width:40px;height:40px;border-radius:50%;background:var(--ink);position:relative;z-index:1}
.mu-mic i{position:absolute;inset:0;border-radius:50%;box-shadow:inset 0 0 0 1px rgba(13,13,13,.25);animation:muRing 3s var(--ease) infinite}
.mu-mic i:nth-child(2){animation-delay:1s}.mu-mic i:nth-child(3){animation-delay:2s}
@keyframes muRing{0%{transform:scale(.5);opacity:1}100%{transform:scale(1.25);opacity:0}}
.mu-bub{display:grid;gap:6px;padding:10px 12px;border-radius:14px;width:70%}
.mu-bub.l{justify-self:start;background:#efede8;border-bottom-left-radius:4px}
.mu-bub.r{justify-self:end;background:#d6d3cd;border-bottom-right-radius:4px;width:46%}
.mu-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;width:100%}
.mu-cards>div{padding:9px;border-radius:10px;box-shadow:inset 0 0 0 1px var(--line);display:grid;gap:6px}
.mu-tiles{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.mu-tiles>div{display:grid;gap:10px;padding:12px;border-radius:12px;background:#f1efea;font-size:11px;font-weight:600;color:var(--ink-2)}
.mu .mu-tiles span{height:auto;background:none;border-radius:0}
.mu-tiles>div.on{background:var(--ink);color:#fff}
.mu-tiles i{width:34px;height:18px;border-radius:999px;background:#c9c6c0;position:relative;display:block}
.mu-tiles u{position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;background:#fff;transition:transform .5s var(--ease)}
.mu-tiles .on i{background:#fff}.mu-tiles .on u{background:var(--ink);transform:translateX(16px)}
.mu-voice-btn{display:flex;align-items:center;gap:8px;justify-content:center;padding:10px;border-radius:999px;box-shadow:inset 0 0 0 1px rgba(13,13,13,.25);font-size:12px;font-weight:600}
.mu-voice-btn i{width:8px;height:8px;border-radius:50%;background:var(--ink)}

@media (max-width:1180px){
 .wk-body{padding:26px;gap:20px}
 .wk-feat{grid-template-columns:1fr}
 .wk-desc{font-size:14px}
 .wk-feat li{font-size:12.5px}
}
@media (max-width:899px){
 .wk-row{flex-direction:column;height:auto;margin-top:40px}
 .wk-panel{flex:none;display:flex;flex-direction:column}
 .wk-spine{position:relative;inset:auto;flex-direction:row;gap:14px;padding:0 18px;height:76px;justify-content:flex-start;text-align:left}
 .wk-st{writing-mode:horizontal-tb;transform:none;font-size:17px;max-height:none;flex:1;min-width:0;text-align:left;line-height:1.15;white-space:normal;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
 .wk-panel.is-open .wk-spine{opacity:1;pointer-events:auto}
 .wk-plus{flex:none}
 .wk-panel.is-open .wk-plus{transform:rotate(45deg)}
 .wk-bw{position:relative;inset:auto;display:grid;grid-template-rows:0fr;opacity:1;pointer-events:auto;transition:grid-template-rows .8s var(--ease)}
 .wk-panel.is-open .wk-bw{grid-template-rows:1fr;transition:grid-template-rows .8s var(--ease)}
 .wk-bw>.wk-body{overflow:hidden;min-height:0}
 .wk-body{grid-template-columns:minmax(0,1fr);padding:0 18px;min-width:0;height:auto;gap:18px}
 .wk-panel.is-open .wk-body{padding-bottom:22px}
 .wk-feat{grid-template-columns:1fr 1fr}
 .wk-vis{min-height:260px}
 .wk-left{overflow:visible}
 .wk-link{margin-top:20px}
}
@media (max-width:420px){.wk-feat{grid-template-columns:1fr}}
@media (prefers-reduced-motion:reduce){.mu-mic i{animation:none}}
`;
