"use client";
import { useEffect, useRef, useState } from "react";
import { PROFILE } from "@/lib/data";
import { prefersReducedMotion } from "@/lib/hooks";
import { scrollToTarget } from "@/lib/scroll";
import { asset } from "@/lib/asset";
import Button from "@/components/ui/Button";

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [soundOn, setSoundOn] = useState(false); // true while the intro is playing once, with sound
  const reduced = useRef(false);
  const visible = useRef(true);
  // idle: silent looping ambient clip; playing: intro playing once with sound; stopped: finished, frozen on first frame
  const mode = useRef<"idle" | "playing" | "stopped">("idle");

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    reduced.current = prefersReducedMotion();
    v.muted = true;
    v.loop = true;
    if (reduced.current) v.pause();
    else v.play().catch(() => {});

    const onEnded = () => {
      mode.current = "stopped";
      v.pause();
      v.currentTime = 0;
      v.muted = true;
      setSoundOn(false);
    };
    v.addEventListener("ended", onEnded);

    // pause when <35% visible, resume on return (unless it has been stopped)
    const io = new IntersectionObserver(
      ([e]) => {
        visible.current = e.intersectionRatio >= 0.35;
        if (!visible.current) v.pause();
        else if (mode.current === "playing" || (mode.current === "idle" && !reduced.current)) v.play().catch(() => {});
      },
      { threshold: [0, 0.35, 1] },
    );
    io.observe(v);
    return () => {
      v.removeEventListener("ended", onEnded);
      io.disconnect();
    };
  }, []);

  // play button: play the intro once, with sound, from the start; press again while playing to stop it
  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (mode.current === "playing") {
      mode.current = "stopped";
      v.pause();
      v.currentTime = 0;
      v.muted = true;
      setSoundOn(false);
      return;
    }
    mode.current = "playing";
    v.loop = false;
    v.muted = false;
    v.currentTime = 0;
    v.play().then(() => setSoundOn(true)).catch(() => { mode.current = "stopped"; v.muted = true; setSoundOn(false); });
  };

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToTarget(id);
    history.replaceState(null, "", `#${id}`);
  };

  return (
    <section id="hero" className="hero" aria-label="Introduction">
      <div className="hero-ghost" aria-hidden="true">{PROFILE.firstName.toUpperCase()}</div>

      <div className="hero-grid">
        <div className="hero-copy">
          <p className="mono hero-eyebrow rv">
            {PROFILE.role} <span aria-hidden="true">·</span> {PROFILE.company}
          </p>
          <h1 className="hero-h1">
            <span className="rv-mask" style={{ ["--i" as string]: 1 }}><span>Site Reliability</span></span>
            <span className="rv-mask" style={{ ["--i" as string]: 2 }}><span><span className="accent">Engineer.</span></span></span>
          </h1>
          <div className="hero-cta rv" style={{ ["--i" as string]: 3 }}>
            <Button href="#work" onClick={go("work")}>Explore work</Button>
            <Button href="#contact" onClick={go("contact")} variant="secondary">Let&apos;s talk</Button>
            <Button href={PROFILE.resume} variant="secondary" download="Ajay-B-Resume.pdf">Résumé ↓</Button>
          </div>
        </div>

        <div className="hero-stage">
          <video
            ref={videoRef}
            className="hero-video"
            muted
            playsInline
            preload="auto"
            aria-label={`Animated portrait of ${PROFILE.name} introducing himself`}
          >
            <source src={asset("/hero/hero.webm")} type="video/webm" />
            <source src={asset("/hero/hero.mp4")} type="video/mp4" />
          </video>
          <button
            type="button"
            data-sound-btn
            className="hero-sound"
            aria-label={soundOn ? "Stop intro" : "Play intro once"}
            aria-pressed={soundOn}
            onClick={toggle}
          >
            {soundOn ? (
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" /><rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" fill="currentColor" /></svg>
            )}
          </button>
        </div>

        <div className="hero-meta rv" style={{ ["--i" as string]: 4 }}>
          <p className="mono">Since {PROFILE.since}</p>
          <p className="mono">{PROFILE.location}</p>
        </div>
      </div>

      <style>{`
        .hero { position: relative; overflow: clip; padding-top: calc(var(--nav-h) + 8px); min-height: 100svh; }
        .hero-ghost { position: absolute; left: 50%; top: calc(var(--nav-h) + 2svh); transform: translateX(-50%); z-index: 0;
          font-weight: 800; letter-spacing: -0.05em; line-height: .8; font-size: clamp(110px, 24vw, 380px); color: #e4e1da;
          user-select: none; pointer-events: none; white-space: nowrap; }
        .hero-grid { position: relative; width: 100%; max-width: calc(var(--max) + var(--gutter) * 2); margin-inline: auto;
          padding-inline: var(--gutter); display: grid; grid-template-columns: 1fr; justify-items: center; }
        .hero-stage { position: relative; order: 1; width: min(100%, calc(62svh * .8)); }
        .hero-video { width: 100%; height: auto; aspect-ratio: 768 / 960; object-fit: cover; mix-blend-mode: darken; background: transparent; -webkit-mask-image: linear-gradient(to right, transparent, #000 8%, #000 92%, transparent); mask-image: linear-gradient(to right, transparent, #000 8%, #000 92%, transparent); }
        .hero-copy { order: 2; position: relative; z-index: 2; width: 100%; margin-top: 8px; padding-bottom: 56px; text-align: left; }
        .hero-eyebrow { font-size: 12px; letter-spacing: .08em; text-transform: uppercase; color: var(--mute); margin-bottom: 16px; }
        .hero-h1 { font-weight: 700; letter-spacing: -0.045em; line-height: 1; font-size: clamp(44px, 12vw, 64px); }
        .hero-h1 .accent { font-size: 1.05em; }
        .hero-cta { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 28px; }
        .hero-meta { display: none; }
        .hero-sound { position: absolute; right: 4%; bottom: 6%; width: 46px; height: 46px; border-radius: 50%; display: grid; place-items: center;
          background: var(--ink); color: #fff; transition: transform .4s var(--ease), background .4s var(--ease); z-index: 2; }
        .hero-sound:hover { transform: scale(1.08); background: #2a2a2a; }
        .hero-sound.is-pinging::after { content: ""; position: absolute; inset: 0; border-radius: 50%; box-shadow: 0 0 0 0 rgba(13,13,13,.45);
          animation: hero-ping 1.8s var(--ease) infinite; pointer-events: none; }
        @keyframes hero-ping { 0% { box-shadow: 0 0 0 0 rgba(13,13,13,.4); } 80%, 100% { box-shadow: 0 0 0 18px rgba(13,13,13,0); } }
        @media (min-width: 900px) {
          .hero { display: flex; align-items: flex-end; }
          .hero-grid { grid-template-columns: minmax(0,1fr) auto minmax(0,1fr); align-items: end; column-gap: clamp(8px, 2vw, 32px); }
          .hero-stage { order: 0; width: auto; height: min(96svh, 1040px); max-height: calc(100svh - var(--nav-h)); aspect-ratio: 768 / 960; }
          .hero-video { height: 100%; width: auto; }
          .hero-copy { order: 0; margin-top: 0; padding-bottom: clamp(40px, 9svh, 110px); }
          .hero-h1 { font-size: clamp(44px, 4.6vw, 84px); }
          .hero-stage { margin-inline: calc(-1 * clamp(0px, 8vw, 140px)); }
          .hero-meta { position: relative; z-index: 2; }
          .hero-meta { display: grid; gap: 6px; justify-self: end; text-align: right; padding-bottom: clamp(40px, 9svh, 110px);
            font-size: 12px; letter-spacing: .08em; text-transform: uppercase; color: var(--mute); }
        }
        @media (prefers-reduced-motion: reduce) { .hero-sound.is-pinging::after { animation: none; } }
      `}</style>
    </section>
  );
}
