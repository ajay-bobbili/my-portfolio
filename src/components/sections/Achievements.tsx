"use client";
import { useEffect, useRef, useState } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import TechLogo from "@/components/ui/TechLogo";
import { ACHIEVEMENTS, type Achievement } from "@/lib/data";
import { prefersReducedMotion, useInView, useScrollProgress } from "@/lib/hooks";

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
      const k = Math.min(1, (t - t0) / 1400);
      setV(Math.round(to * (1 - Math.pow(1 - k, 4))));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, to]);
  return <>{v.toLocaleString("en-US")}</>;
}

function Card({ a, active }: { a: Achievement; active: boolean }) {
  const [ref, seen] = useInView<HTMLElement>({ threshold: 0.5 });
  return (
    <article
      ref={ref}
      className={`ach-card${active ? " is-active" : ""}`}
      style={{ ["--tint" as string]: a.tint }}
      aria-label={a.label}
    >
      <div className="ach-top">
        <div className="ach-logo">
          <TechLogo name={a.logo} size={44} label={`${a.label} logo`} />
        </div>
        <span className="mono ach-idx">
          {a.index} / {String(ACHIEVEMENTS.length).padStart(2, "0")}
        </span>
      </div>
      <div className="ach-bottom">
        <div className="ach-text">
          <h3 className="ach-label">{a.label}</h3>
          <p className="ach-cap">{a.caption}</p>
          <p className="ach-detail mono">{a.detail}</p>
        </div>
        {a.number !== undefined && (
          <p className="ach-num" role="img" aria-label={`${a.prefix ?? ""}${a.number}${a.suffix ?? ""} ${a.unit ?? ""}`}>
            <span aria-hidden="true">
              {a.prefix}
              <CountUp to={a.number} run={seen} />
              {a.suffix}
            </span>
            {a.unit && (
              <small className="mono" aria-hidden="true">
                {a.unit}
              </small>
            )}
          </p>
        )}
      </div>
    </article>
  );
}

export default function Achievements() {
  const wrapRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [travel, setTravel] = useState(0);
  const [native, setNative] = useState(false);
  const [active, setActive] = useState(0);
  const p = useScrollProgress(wrapRef, "pinned");

  useEffect(() => {
    const measure = () => {
      const t = trackRef.current;
      if (!t) return;
      setNative(prefersReducedMotion());
      setTravel(Math.max(0, t.scrollWidth - window.innerWidth));
    };
    measure();
    window.addEventListener("resize", measure);
    const t = trackRef.current;
    const ro = t ? new ResizeObserver(measure) : null;
    if (t) ro?.observe(t);
    return () => {
      window.removeEventListener("resize", measure);
      ro?.disconnect();
    };
  }, []);

  useEffect(() => {
    const t = trackRef.current;
    if (!t) return;
    const mid = window.innerWidth / 2;
    let best = 0;
    let bd = Infinity;
    t.querySelectorAll<HTMLElement>(".ach-card").forEach((c, i) => {
      const r = c.getBoundingClientRect();
      const d = Math.abs(r.left + r.width / 2 - mid);
      if (d < bd) {
        bd = d;
        best = i;
      }
    });
    setActive(best);
  }, [p, travel]);

  const pinned = !native && travel > 0;

  return (
    <section
      id="achievements"
      ref={wrapRef}
      className={`ach${pinned ? " is-pinned" : ""}`}
      aria-labelledby="achievements-heading"
      style={pinned ? { height: `calc(100svh + ${travel}px)` } : undefined}
    >
      <div className="ach-stick">
        <div className="wrap ach-head">
          <SectionHeading id="achievements" lead="Honours &" accent="metrics." />
          <div className="ach-bar" aria-hidden="true">
            <i style={{ transform: `scaleX(${pinned ? p : 0})` }} />
          </div>
        </div>
        <div className="ach-clip">
        <div
          ref={trackRef}
          className="ach-track"
          style={pinned ? { transform: `translate3d(${-p * travel}px,0,0)` } : undefined}
        >
          {ACHIEVEMENTS.map((a, i) => (
            <Card key={a.id} a={a} active={pinned && i === active} />
          ))}
          <div className="ach-end serif-i" aria-hidden="true">
            and counting <span>→</span>
          </div>
        </div>
        </div>
      </div>
      <style>{`
        .ach { padding-block: var(--section-pad); }
        .ach.is-pinned { padding-block: 0; }
        .ach-stick { display: flex; flex-direction: column; justify-content: center; gap: clamp(24px, 5vh, 56px); }
        .ach.is-pinned .ach-stick { position: sticky; top: 0; height: 100svh; overflow: hidden; }
        .ach-head { display: flex; flex-direction: column; gap: clamp(16px, 3vh, 28px); }
        .ach.is-pinned .sec-h { font-size: clamp(36px, 5.2vw, 76px); }
        .ach-bar { height: 2px; background: var(--line); border-radius: 2px; overflow: hidden; max-width: 420px; }
        .ach-bar i { display: block; height: 100%; background: var(--ink); transform-origin: left; transform: scaleX(0); }
        .ach-track { display: flex; gap: clamp(16px, 2vw, 28px); padding: 24px var(--gutter) 40px; width: max-content; will-change: transform; }
        .ach:not(.is-pinned) .ach-clip { overflow-x: auto; scroll-snap-type: x proximity; }
        .ach-card { flex: none; position: relative; width: clamp(340px, 40vw, 540px); height: clamp(260px, 36vh, 310px); padding: 22px 26px 24px; border-radius: 28px; background: #fff; box-shadow: inset 0 0 0 1px var(--line), 0 16px 36px -28px rgba(13,13,13,.25); display: flex; flex-direction: column; justify-content: space-between; transition: transform 0.7s var(--ease), box-shadow 0.7s var(--ease); scroll-snap-align: center; }
        .ach-card::before { content: ""; position: absolute; left: 18px; top: 8px; width: 120px; height: 90px; border-radius: 50%; background: var(--tint); filter: blur(34px); opacity: .55; transition: opacity 0.7s var(--ease); pointer-events: none; }
        .ach-card.is-active { transform: translateY(-12px); box-shadow: inset 0 0 0 1px var(--line), 0 44px 70px -32px rgba(13,13,13,.32); }
        .ach-card.is-active::before { opacity: 1; }
        .ach-top { position: relative; display: flex; align-items: flex-start; justify-content: space-between; }
        .ach-logo { width: 72px; height: 72px; border-radius: 20px; display: grid; place-items: center; background: #fff; box-shadow: inset 0 0 0 1px var(--line), 0 10px 30px -8px var(--tint); }
        .ach-idx { font-size: 12px; color: var(--mute); letter-spacing: .06em; }
        .ach-bottom { position: relative; display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; }
        .ach-text { min-width: 0; flex: 1; }
        .ach-label { font-size: clamp(18px, 1.6vw, 22px); font-weight: 700; letter-spacing: -0.03em; line-height: 1.1; }
        .ach-cap { margin-top: 6px; font-size: 14px; line-height: 1.4; color: var(--ink-2); }
        .ach-detail { margin-top: 8px; font-size: 11px; line-height: 1.4; color: var(--mute); }
        .ach-num { flex: none; text-align: right; font-weight: 700; letter-spacing: -0.06em; line-height: .85; font-size: clamp(52px, 6vw, 84px); font-variant-numeric: tabular-nums; }
        .ach-num small { display: block; margin-top: 8px; font-size: 10px; letter-spacing: .06em; font-weight: 400; color: var(--mute); text-transform: uppercase; }
        .ach-end { flex: none; align-self: center; padding-inline: 24px 40px; font-size: clamp(32px, 4vw, 56px); color: var(--mute); white-space: nowrap; }
        .ach-end span { color: var(--ink); }
        @media (max-width: 560px) {
          .ach-card { width: min(340px, 86vw); height: 290px; }
          .ach-num { font-size: 48px; }
        }
      `}</style>
    </section>
  );
}
