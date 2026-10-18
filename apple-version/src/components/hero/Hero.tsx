"use client";
import { useEffect, useRef, useState } from "react";
import { PROFILE } from "@/lib/data";
import { prefersReducedMotion } from "@/lib/hooks";
import { scrollToTarget } from "@/lib/scroll";
import { asset } from "@/lib/asset";

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
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

  // headline scales and fades as you scroll past (skipped with reduced motion)
  useEffect(() => {
    const el = copyRef.current;
    if (!el || prefersReducedMotion()) return;
    let raf = 0;
    const calc = () => {
      raf = 0;
      const p = Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 0.7)));
      el.style.transform = `translateY(${(-p * 48).toFixed(1)}px) scale(${(1 - p * 0.08).toFixed(4)})`;
      el.style.opacity = Math.max(0, 1 - p * 1.25).toFixed(3);
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(calc);
    };
    calc();
    window.addEventListener("scroll", on, { passive: true });
    return () => {
      window.removeEventListener("scroll", on);
      if (raf) cancelAnimationFrame(raf);
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
      <div className="wrap">
        <div ref={copyRef} className="hero-copy">
          <h1 className="hero-h1 rv">{PROFILE.heroTitle}.</h1>
          <p className="hero-sub rv" style={{ ["--i" as string]: 1 }}>
            {PROFILE.role} at {PROFILE.company}. {PROFILE.location}.
          </p>
          <div className="hero-cta rv" style={{ ["--i" as string]: 2 }}>
            <div className="pills">
              <a className="btn btn-primary" href="#work" onClick={go("work")}>Explore work</a>
              <a className="btn btn-secondary" href="#contact" onClick={go("contact")}>Let&apos;s talk</a>
            </div>
            <a className="more" href={PROFILE.resume} download="Ajay-B-Resume.pdf">Résumé</a>
          </div>
        </div>
      </div>

      <div className="hero-stage rv" style={{ ["--i" as string]: 3 }}>
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
            <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" /><rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" /></svg>
          ) : (
            <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" fill="currentColor" /></svg>
          )}
          <span aria-hidden="true">{soundOn ? "Stop" : "Play intro"}</span>
        </button>
      </div>
    </section>
  );
}
