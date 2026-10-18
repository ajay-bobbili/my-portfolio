"use client";
import { useEffect, useState } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import TechLogo from "@/components/ui/TechLogo";
import { ACHIEVEMENTS, type Achievement } from "@/lib/data";
import { prefersReducedMotion, useInView } from "@/lib/hooks";

function CountUp({ to, run }: { to: number; run: boolean }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!run) return;
    if (prefersReducedMotion()) {
      setV(to);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / 1600);
      setV(Math.round(to * (1 - Math.pow(1 - k, 4))));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, to]);
  return <>{v.toLocaleString("en-US")}</>;
}

const byId = (id: string) => ACHIEVEMENTS.find((a) => a.id === id)!;

function Stat({ a, cls, delay }: { a: Achievement; cls: string; delay: number }) {
  const [ref, seen] = useInView<HTMLElement>({ threshold: 0.4 });
  return (
    <article ref={ref} className={`card stat ${cls} rv`} style={{ ["--i" as string]: delay }} aria-label={a.label}>
      <div className="a-top">
        <span className="chip"><TechLogo name={a.logo} size={30} label={`${a.label} logo`} /></span>
        <span className="k">{a.label}</span>
      </div>
      <div>
        <p className="num" role="img" aria-label={`${a.prefix ?? ""}${a.number}${a.suffix ?? ""} ${a.unit ?? ""}`.trim()}>
          <span aria-hidden="true">
            {a.prefix}
            <CountUp to={a.number ?? 0} run={seen} />
            {a.suffix}
            {a.unit && <small>{a.unit}</small>}
          </span>
        </p>
        <p className="a-cap">{a.caption}</p>
        <p className="a-det">{a.detail}</p>
      </div>
    </article>
  );
}

function Award({ a, delay }: { a: Achievement; delay: number }) {
  return (
    <article className="card award rv" style={{ ["--i" as string]: delay }} aria-label={a.label}>
      <div className="a-top">
        <span className="chip"><TechLogo name={a.logo} size={34} label={`${a.label} logo`} /></span>
        <span className="k">Honour</span>
      </div>
      <h3>{a.label}</h3>
      <p className="a-cap">{a.caption}</p>
      <p className="a-det">{a.detail}</p>
    </article>
  );
}

export default function Achievements() {
  return (
    <section id="achievements" className="section bg-w" aria-labelledby="achievements-heading">
      <div className="wrap">
        <SectionHeading id="achievements" title="Impact, in numbers." sub="Results from the roles above, and the honours along the way." />
        <div className="ach">
          <Stat a={byId("deploy")} cls="stat-a" delay={0} />
          <Stat a={byId("releases")} cls="stat-b" delay={1} />
          <Stat a={byId("uptime")} cls="stat-c" delay={2} />
          <Stat a={byId("savings")} cls="stat-d" delay={1} />
          <Award a={byId("spotlight")} delay={0} />
          <Award a={byId("beacon")} delay={1} />
          <Award a={byId("skills2020")} delay={2} />
        </div>
      </div>
    </section>
  );
}
