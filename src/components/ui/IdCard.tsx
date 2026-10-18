"use client";
import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import Image from "next/image";
import { asset } from "@/lib/asset";
import { PROFILE } from "@/lib/data";
import { prefersReducedMotion } from "@/lib/hooks";

/* Deterministic barcode bar widths from a seed string (decorative only). */
function bars(seed: string): { x: number; w: number }[] {
  let h = 2166136261;
  const out: { x: number; w: number }[] = [];
  let x = 0;
  for (let i = 0; x < 196; i++) {
    h = Math.imul(h ^ (seed.charCodeAt(i % seed.length) + i), 16777619) >>> 0;
    const w = 1 + (h % 3);
    if (i % 2 === 0) out.push({ x, w });
    x += w + 1 + ((h >> 5) % 2);
  }
  return out;
}
const BARS = bars("AJAY-B-SRE");

const BACK_LINES = [
  "Systems Engineer III (SRE) at LexisNexis Risk Solutions",
  "PG Diploma in Advanced Cloud Computing and DevOps, IIT Roorkee",
  "MBA in Business Analytics at BITS Pilani (pursuing)",
  "Projects: Micro-blogging platform, Alexa Tourist Assistant, Home Automation using IoT",
  "Spotlight Award and Inspiration Beacon Award",
];

export default function IdCard() {
  const [flipped, setFlipped] = useState(false);
  const pendulum = useRef<HTMLDivElement>(null);
  const zone = useRef<HTMLDivElement>(null);
  const pType = useRef("mouse");
  const impulse = useRef(0);
  const last = useRef<{ x: number; t: number } | null>(null);

  useEffect(() => {
    const el = pendulum.current;
    const host = zone.current;
    if (!el || !host || prefersReducedMotion()) return;
    let raf = 0;
    let visible = false;
    let angle = 6; // small initial swing on arrival
    let vel = 0;
    let prev = performance.now();
    const frame = (now: number) => {
      const dt = Math.min(0.033, (now - prev) / 1000);
      prev = now;
      vel += impulse.current;
      impulse.current = 0;
      const target = Math.sin(now / 1700) * 0.9; // idle sway
      vel += (-34 * (angle - target) - 2.6 * vel) * dt;
      angle += vel * dt;
      angle = Math.max(-24, Math.min(24, angle));
      el.style.transform = `rotate(${angle.toFixed(3)}deg)`;
      if (visible) raf = requestAnimationFrame(frame);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) {
        prev = performance.now();
        raf = requestAnimationFrame(frame);
      }
    });
    io.observe(host);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const now = performance.now();
    if (last.current) {
      const dt = Math.max(8, now - last.current.t);
      const vx = (e.clientX - last.current.x) / dt; // px per ms
      impulse.current += Math.max(-14, Math.min(14, vx * 7));
    }
    last.current = { x: e.clientX, t: now };
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setFlipped((f) => !f);
    }
  };

  return (
    <div ref={zone} className="idc-zone" onPointerMove={onMove} onPointerLeave={() => (last.current = null)}>
      <div ref={pendulum} className="idc-pend">
        <div className="idc-strap" aria-hidden="true">
          <div className="idc-strap-track">
            {[0, 1].map((k) => (
              <span key={k}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <b key={i}>
                    AJAY B <i>·</i> SYSTEMS ENGINEER III (SRE) <i>·</i>
                  </b>
                ))}
              </span>
            ))}
          </div>
        </div>
        <div className="idc-clip" aria-hidden="true">
          <span />
        </div>
        <div
          className={`idc-card${flipped ? " is-flipped" : ""}`}
          role="button"
          tabIndex={0}
          aria-pressed={flipped}
          aria-roledescription="flippable ID card"
          onKeyDown={onKey}
          onPointerEnter={(e) => {
            pType.current = e.pointerType;
            if (e.pointerType === "mouse") setFlipped(true);
          }}
          onPointerLeave={(e) => {
            if (e.pointerType === "mouse") setFlipped(false);
          }}
          onClick={() => {
            if (pType.current !== "mouse") setFlipped((f) => !f);
          }}
          onPointerDown={(e) => (pType.current = e.pointerType)}
        >
          <div className="idc-inner">
            <div className="idc-face idc-front" aria-hidden={flipped}>
              <div className="idc-band">
                <span className="idc-slot" />
                <span className="mono">SRE PROFILE</span>
              </div>
              <div className="idc-photo">
                <div className="idc-halo" />
                <div className="idc-ring">
                  <Image src={asset("/portrait-bust.webp")} alt={`Portrait of ${PROFILE.name}`} width={120} height={150} sizes="120px" priority={false} />
                </div>
              </div>
              <p className="idc-name">{PROFILE.name}</p>
              <p className="idc-role">{PROFILE.role}</p>
              <p className="idc-co">{PROFILE.company}</p>
              <p className="idc-loc mono">{PROFILE.location}</p>
              <div className="idc-foot">
                <svg viewBox="0 0 200 38" className="idc-bar" role="img" aria-label="Decorative barcode" preserveAspectRatio="none">
                  {BARS.map((b, i) => (
                    <rect key={i} x={b.x} y="0" width={b.w} height="38" fill="#0d0d0d" />
                  ))}
                </svg>
                <span className="idc-holo" aria-hidden="true" />
              </div>
            </div>
            <div className="idc-face idc-back" aria-hidden={!flipped}>
              <p className="idc-bk-tag mono">What I am</p>
              <ul className="idc-bk-list">
                {BACK_LINES.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
              <p className="idc-sign">{PROFILE.name}</p>
              <p className="idc-found mono">
                If found, say hello · {PROFILE.email}
              </p>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .idc-zone { position: relative; width: 100%; height: calc(var(--section-pad) + 560px); margin-top: calc(var(--section-pad) * -1); }
        .idc-pend { position: absolute; top: 0; left: 50%; width: 300px; margin-left: -150px; transform-origin: 50% 0; will-change: transform; }
        .idc-strap { position: relative; width: 30px; height: calc(var(--section-pad) + 60px); margin-inline: auto; background: var(--ink); overflow: hidden; border-radius: 0 0 3px 3px; }
        .idc-strap-track { position: absolute; inset-inline: 0; top: 0; display: flex; flex-direction: column; animation: idc-scroll 18s linear infinite; }
        .idc-strap-track > span { display: flex; flex-direction: column; align-items: center; }
        .idc-strap-track b { writing-mode: vertical-rl; font: 600 10px/30px var(--f-mono), monospace; letter-spacing: .14em; color: #fff; white-space: nowrap; padding-block: 10px; }
        .idc-strap-track i { font-style: normal; color: var(--faint); padding-block: 6px; }
        @keyframes idc-scroll { to { transform: translateY(-50%); } }
        .idc-clip { width: 30px; height: 34px; margin: -2px auto 0; position: relative; z-index: 2; display: grid; place-items: center; }
        .idc-clip span { width: 26px; height: 34px; border-radius: 4px 4px 10px 10px; background: linear-gradient(90deg, #8c8c8c, #e9e9e9 45%, #9a9a9a); box-shadow: inset 0 0 0 1px rgba(0,0,0,.25), 0 3px 6px rgba(0,0,0,.18); }
        .idc-card { position: relative; margin-top: -10px; width: 300px; height: 404px; perspective: 1400px; cursor: pointer; border-radius: 22px; -webkit-tap-highlight-color: transparent; }
        .idc-inner { position: relative; width: 100%; height: 100%; transform-style: preserve-3d; transition: transform .9s var(--ease); }
        .idc-card.is-flipped .idc-inner { transform: rotateY(180deg); }
        .idc-face { position: absolute; inset: 0; border-radius: 22px; overflow: hidden; backface-visibility: hidden; -webkit-backface-visibility: hidden; background: #fff; box-shadow: inset 0 0 0 1px var(--line), 0 40px 70px -34px rgba(13,13,13,.35), 0 10px 24px -14px rgba(13,13,13,.18); }
        .idc-front { text-align: center; }
        .idc-band { position: relative; height: 54px; background: var(--ink); color: #fff; display: grid; place-items: center; padding-top: 6px; font-size: 11px; letter-spacing: .26em; }
        .idc-slot { position: absolute; top: 9px; left: 50%; width: 52px; height: 7px; margin-left: -26px; border-radius: 4px; background: var(--paper); }
        .idc-photo { position: relative; width: 128px; height: 156px; margin: 18px auto 14px; }
        .idc-halo { position: absolute; inset: -22px; border-radius: 50%; background: radial-gradient(closest-side, rgba(13,13,13,.1), transparent); }
        .idc-ring { position: relative; width: 100%; height: 100%; padding: 4px; border-radius: 22px; background: linear-gradient(160deg, #d6d6d6, #8e8e8e 55%, #e4e4e4); overflow: hidden; }
        .idc-ring img { width: 100%; height: 100%; object-fit: cover; object-position: center 20%; border-radius: 18px; background: #f1f1f1; transition: transform .8s var(--ease); }
        .idc-card:hover .idc-ring img { transform: scale(1.06); }
        .idc-name { font-weight: 700; font-size: 25px; letter-spacing: -.035em; line-height: 1.1; }
        .idc-role { margin-top: 4px; font-size: 14px; font-weight: 600; color: var(--ink-2); }
        .idc-co { margin-top: 2px; font-size: 13px; color: var(--mute); }
        .idc-loc { margin-top: 6px; font-size: 11px; letter-spacing: .14em; text-transform: uppercase; color: var(--faint); }
        .idc-foot { position: absolute; left: 22px; right: 22px; bottom: 18px; display: flex; align-items: flex-end; justify-content: space-between; gap: 14px; }
        .idc-bar { height: 34px; width: 170px; flex: 1; min-width: 0; }
        .idc-holo { width: 40px; height: 40px; border-radius: 50%; flex: none; background: conic-gradient(from 20deg, #f2f2f2, #9d9d9d, #fafafa, #7d7d7d, #e1e1e1, #b5b5b5, #f2f2f2); box-shadow: inset 0 0 0 1px rgba(13,13,13,.18); animation: idc-holo 6s linear infinite; }
        @keyframes idc-holo { to { transform: rotate(360deg); } }
        .idc-back { transform: rotateY(180deg); background: var(--ink); color: #fff; padding: 28px 24px 20px; display: flex; flex-direction: column; box-shadow: 0 40px 70px -34px rgba(13,13,13,.5); }
        .idc-bk-tag { font-size: 11px; letter-spacing: .22em; text-transform: uppercase; color: var(--faint); }
        .idc-bk-list { margin-top: 12px; display: grid; gap: 7px; font-size: 12.5px; line-height: 1.35; color: #e6e6e6; }
        .idc-bk-list li { padding-left: 14px; position: relative; }
        .idc-bk-list li::before { content: ""; position: absolute; left: 0; top: .55em; width: 5px; height: 1px; background: var(--faint); }
        .idc-sign { margin-top: auto; font-family: var(--f-serif), serif; font-style: italic; font-size: 34px; line-height: 1; }
        .idc-found { margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,.18); font-size: 10px; letter-spacing: .04em; color: var(--faint); overflow-wrap: anywhere; }
        @media (max-width: 1023px) {
          .idc-zone { margin-top: 0; height: 530px; }
          .idc-strap { height: 80px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .idc-strap-track, .idc-holo { animation: none; }
        }
      `}</style>
    </div>
  );
}
