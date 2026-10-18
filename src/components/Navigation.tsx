"use client";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from "react";
import { NAV, PROFILE, type SectionId } from "@/lib/data";
import { scrollToTarget, setScrollLocked } from "@/lib/scroll";
import { useScrollProgress } from "@/lib/hooks";

export default function Navigation() {
  const progress = useScrollProgress();
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<SectionId | null>(null);
  const [open, setOpen] = useState(false);
  const [ind, setInd] = useState<{ x: number; w: number } | null>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const linkRefs = useRef<Partial<Record<SectionId, HTMLAnchorElement | null>>>({});
  const menuBtn = useRef<HTMLButtonElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  // scrolled state
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  // active section (rootMargin -45% 0 -50% => thin band at viewport centre)
  useEffect(() => {
    const els = NAV.map((n) => document.getElementById(n.id)).filter(Boolean) as HTMLElement[];
    // sections that are not in nav (certifications) should clear/keep the nearest; track all section ids
    const all = ["about", "skills", "work", "certifications", "experience", "achievements", "contact", "hero"]
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];
    const navIds = new Set<string>(NAV.map((n) => n.id));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const id = e.target.id;
          if (id === "hero") setActive(null);
          else if (navIds.has(id)) setActive(id as SectionId);
          else setActive("work"); // certifications sits under Work
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    (all.length ? all : els).forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // sliding indicator
  const measure = useCallback(() => {
    const a = active && linkRefs.current[active];
    const ul = listRef.current;
    if (!a || !ul) return setInd(null);
    setInd({ x: a.offsetLeft, w: a.offsetWidth });
  }, [active]);
  useLayoutEffect(measure, [measure, scrolled]);
  useEffect(() => {
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  // mobile menu: Esc, scroll lock, focus
  const close = useCallback(() => {
    setOpen(false);
    setScrollLocked(false);
    menuBtn.current?.focus({ preventScroll: true });
  }, []);
  useEffect(() => {
    if (!open) return;
    setScrollLocked(true);
    closeBtn.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    const onResize = () => window.innerWidth >= 768 && close();
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      setScrollLocked(false);
    };
  }, [open, close]);

  const go = (id: SectionId) => (e: MouseEvent) => {
    e.preventDefault();
    if (open) {
      setOpen(false);
      setScrollLocked(false);
    }
    scrollToTarget(id);
    history.replaceState(null, "", `#${id}`);
  };
  const top = (e: MouseEvent) => {
    e.preventDefault();
    if (open) {
      setOpen(false);
      setScrollLocked(false);
    }
    scrollToTarget(0);
    history.replaceState(null, "", window.location.pathname);
  };

  return (
    <>
      <div className="nav-progress" aria-hidden="true">
        <span style={{ transform: `scaleX(${progress})` }} />
      </div>
      <header className={`nav${scrolled ? " is-scrolled" : ""}`}>
        <a href="#" className="nav-brand" onClick={top} aria-label={PROFILE.name} title="Back to top">
          <span className="nav-mark" aria-hidden="true">
            <span>{PROFILE.initials}</span>
          </span>
          <span className="nav-name">{PROFILE.name}</span>
        </a>

        <nav className="nav-pill" aria-label="Primary">
          <ul ref={listRef}>
            <li
              className="nav-ind"
              aria-hidden="true"
              style={ind ? { transform: `translateX(${ind.x}px)`, width: ind.w, opacity: 1 } : { opacity: 0 }}
            />
            {NAV.map((n) => (
              <li key={n.id}>
                <a
                  href={`#${n.id}`}
                  ref={(el) => {
                    linkRefs.current[n.id] = el;
                  }}
                  className={active === n.id ? "is-active" : ""}
                  aria-current={active === n.id ? "true" : undefined}
                  onClick={go(n.id)}
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <button
          ref={menuBtn}
          type="button"
          className="nav-menu-btn"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen(true)}
        >
          Menu
        </button>
      </header>

      <div id="mobile-menu" className={`menu${open ? " is-open" : ""}`} role="dialog" aria-modal="true" aria-label="Menu" aria-hidden={!open} inert={!open}>
        <div className="menu-top">
          <span className="mono menu-eyebrow">Navigate</span>
          <button ref={closeBtn} type="button" className="nav-menu-btn" onClick={close}>
            Close
          </button>
        </div>
        <ul className="menu-list">
          {NAV.map((n, i) => (
            <li key={n.id} style={{ ["--i" as string]: i }}>
              <a href={`#${n.id}`} onClick={go(n.id)} tabIndex={open ? 0 : -1}>
                <span className="mono">{n.index}</span>
                <span>{n.label}</span>
              </a>
            </li>
          ))}
        </ul>
        <p className="menu-foot mono">{PROFILE.email}</p>
      </div>

      <style>{`
        .nav-progress { position: fixed; inset: 0 0 auto 0; height: 2px; z-index: 60; pointer-events: none; }
        .nav-progress span { display: block; height: 100%; background: var(--ink); transform-origin: left; transform: scaleX(0); }
        .nav { position: fixed; z-index: 50; top: 0; left: 0; right: 0; height: var(--nav-h); display: flex; align-items: center;
          justify-content: space-between; padding: 0 var(--gutter); pointer-events: none; }
        .nav > * { pointer-events: auto; }
        .nav-brand { display: inline-flex; align-items: center; gap: 12px; }
        .nav-mark { width: 44px; height: 44px; border-radius: 50%; display: grid; place-items: center; font-weight: 700;
          font-size: 15px; letter-spacing: -0.02em; box-shadow: inset 0 0 0 1.5px var(--ink); color: var(--ink); background: transparent;
          transition: background .5s var(--ease), color .5s var(--ease), transform .9s var(--ease); }
        .nav.is-scrolled .nav-mark { background: var(--ink); color: var(--paper); }
        .nav-brand:hover .nav-mark { transform: rotate(360deg); }
        .nav-name { font-weight: 600; letter-spacing: -0.02em; font-size: 17px; transition: opacity .5s var(--ease), transform .5s var(--ease); }
        .nav.is-scrolled .nav-name { opacity: 0; transform: translateX(-8px); pointer-events: none; }
        .nav-pill { display: none; border-radius: 999px; padding: 5px; transition: background .5s var(--ease), box-shadow .5s var(--ease), backdrop-filter .5s; }
        .nav.is-scrolled .nav-pill { background: rgba(255,255,255,.72); -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px);
          box-shadow: inset 0 0 0 1px var(--line), 0 12px 32px -16px rgba(13,13,13,.25); }
        .nav-pill ul { position: relative; display: flex; gap: 2px; }
        .nav-pill li:not(.nav-ind) a { position: relative; z-index: 1; display: block; padding: 10px 18px; border-radius: 999px; font-size: 14px;
          font-weight: 500; letter-spacing: -0.01em; color: var(--ink-2); transition: color .4s var(--ease); }
        .nav-pill li a:hover { color: var(--ink); }
        .nav-pill li a.is-active { color: #fff; }
        .nav-ind { position: absolute; top: 0; bottom: 0; left: 0; border-radius: 999px; background: var(--ink); z-index: 0;
          transition: transform .6s var(--ease), width .6s var(--ease), opacity .3s; }
        .nav-menu-btn { height: 44px; padding: 0 22px; border-radius: 999px; font-weight: 600; font-size: 14px; background: #fff;
          box-shadow: inset 0 0 0 1px var(--line); transition: background .4s var(--ease), color .4s var(--ease); }
        .nav-menu-btn:hover { background: var(--ink); color: #fff; }
        .menu { position: fixed; inset: 0; z-index: 70; background: var(--paper); display: flex; flex-direction: column;
          padding: 0 var(--gutter) 28px; clip-path: circle(0 at calc(100% - 60px) 38px); visibility: hidden;
          transition: clip-path .8s var(--ease), visibility 0s linear .8s; }
        .menu.is-open { clip-path: circle(150% at calc(100% - 60px) 38px); visibility: visible; transition: clip-path .8s var(--ease), visibility 0s; }
        .menu-top { height: var(--nav-h); display: flex; align-items: center; justify-content: space-between; }
        .menu-eyebrow { font-size: 12px; letter-spacing: .08em; text-transform: uppercase; color: var(--mute); }
        .menu-list { margin: auto 0; display: grid; gap: 4px; }
        .menu-list a { display: flex; align-items: baseline; gap: 16px; padding: 6px 0; font-size: clamp(44px, 13vw, 76px); font-weight: 700;
          letter-spacing: -0.045em; line-height: 1.05; }
        .menu-list a .mono { font-size: 13px; font-weight: 400; letter-spacing: .06em; color: var(--mute); }
        .menu-list li { opacity: 0; transform: translateY(36px); transition: opacity .6s var(--ease), transform .8s var(--ease); }
        .menu.is-open .menu-list li { opacity: 1; transform: none; transition-delay: calc(var(--i) * 70ms + 250ms); }
        .menu-foot { font-size: 13px; color: var(--mute); }
        @media (min-width: 768px) {
          .nav-pill { display: block; }
          .nav-menu-btn:not(.menu .nav-menu-btn) { display: none; }
          .menu { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .nav-brand:hover .nav-mark { transform: none; }
          .menu { transition: none; }
          .menu-list li { opacity: 1; transform: none; }
        }
      `}</style>
    </>
  );
}
