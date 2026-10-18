"use client";
import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import { NAV, PROFILE, type SectionId } from "@/lib/data";
import { scrollToTarget, setScrollLocked } from "@/lib/scroll";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<SectionId | null>(null);
  const [open, setOpen] = useState(false);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 4);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  // active section: thin band at viewport centre
  useEffect(() => {
    const all = ["hero", "about", "skills", "work", "certifications", "experience", "achievements", "contact"]
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
    all.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

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
      <header className={`nav${scrolled ? " is-scrolled" : ""}`}>
        <div className="nav-in">
          <a href="#" className="nav-brand" onClick={top} aria-label={`${PROFILE.name}, back to top`}>
            {PROFILE.name}
          </a>
          <nav aria-label="Primary">
            <ul className="nav-links">
              {NAV.map((n) => (
                <li key={n.id}>
                  <a href={`#${n.id}`} className={active === n.id ? "is-active" : ""} aria-current={active === n.id ? "true" : undefined} onClick={go(n.id)}>
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <a className="nav-cta" href={PROFILE.resume} download="Ajay-B-Resume.pdf">Résumé</a>
          <button ref={menuBtn} type="button" className="nav-menu-btn" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(true)}>
            Menu
          </button>
        </div>
      </header>

      <div id="mobile-menu" className={`menu${open ? " is-open" : ""}`} role="dialog" aria-modal="true" aria-label="Menu" aria-hidden={!open} inert={!open}>
        <div className="menu-top">
          <span className="nav-brand">{PROFILE.name}</span>
          <button ref={closeBtn} type="button" className="nav-menu-btn" style={{ display: "block" }} onClick={close}>
            Close
          </button>
        </div>
        <ul className="menu-list">
          {NAV.map((n, i) => (
            <li key={n.id} style={{ ["--i" as string]: i }}>
              <a href={`#${n.id}`} onClick={go(n.id)} tabIndex={open ? 0 : -1}>{n.label}</a>
            </li>
          ))}
        </ul>
        <p className="menu-foot">{PROFILE.email}</p>
      </div>
    </>
  );
}
