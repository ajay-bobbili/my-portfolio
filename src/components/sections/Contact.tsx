"use client";
import { Fragment, useRef, useState, type AnimationEvent, type PointerEvent } from "react";
import { PROFILE } from "@/lib/data";
import { scrollToTarget } from "@/lib/scroll";

function Letters({ text, accent = false }: { text: string; accent?: boolean }) {
  const hop = (e: PointerEvent<HTMLSpanElement>) => {
    const el = e.currentTarget;
    if (el.classList.contains("hop")) return;
    el.classList.add("hop");
  };
  const done = (e: AnimationEvent<HTMLSpanElement>) => e.currentTarget.classList.remove("hop");
  return (
    <>
      {text.split(" ").map((w, wi) => (
        <Fragment key={wi}>
          {wi > 0 ? " " : ""}
          <span className="ct-word" aria-hidden="true">
            {[...w].map((c, i) => (
              <span key={i} className={`ct-l${accent ? " accent" : ""}`} onPointerEnter={hop} onAnimationEnd={done}>
                {c}
              </span>
            ))}
          </span>
        </Fragment>
      ))}
    </>
  );
}

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = PROFILE.email;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); } catch { /* ignore */ }
      ta.remove();
    }
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
  };

  const links = [
    { label: "Phone", text: PROFILE.phone, href: PROFILE.phoneHref, ext: false },
    { label: "GitHub", text: "github.com/ajaysrinic", href: PROFILE.github, ext: true },
    { label: "LinkedIn", text: "linkedin.com/in/ajaysrinic", href: PROFILE.linkedin, ext: true },
  ];

  return (
    <>
      <section id="contact" className="section ct" aria-labelledby="contact-heading">
        <div className="wrap">
          <p className="sec-tag rv"><span>07</span><span aria-hidden="true">—</span><span>Contact</span></p>
          <h2 id="contact-heading" className="ct-h" aria-label="Let's build something together.">
            <span className="ct-line"><Letters text="Let's build" /></span>
            <span className="ct-line"><Letters text="something" /> <Letters text="together." accent /></span>
          </h2>

          <div className="ct-mail rv">
            <a className="ct-email" href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
            <button type="button" className="ct-copy" onClick={copy} aria-label={`Copy email address ${PROFILE.email}`}>
              {copied ? "Copied ✓" : "Copy"}
            </button>
            <span className="sr-only-x" role="status" aria-live="polite">{copied ? "Email address copied" : ""}</span>
          </div>

          <div className="ct-row">
            <ul className="ct-links">
              {links.map((l, i) => (
                <li key={l.label} className="rv" style={{ ["--i" as string]: i }}>
                  <a href={l.href} {...(l.ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                    <span className="mono">{l.label}</span>
                    <span className="ct-lt">{l.text}</span>
                    <span className="ct-ar" aria-hidden="true">↗</span>
                  </a>
                </li>
              ))}
            </ul>
            <svg className="ct-badge" viewBox="0 0 160 160" role="img" aria-label="Say hello">
              <defs>
                <path id="ct-circ" d="M80,80 m-58,0 a58,58 0 1,1 116,0 a58,58 0 1,1 -116,0" />
              </defs>
              <g className="ct-spin">
                <text fontSize="12.5" letterSpacing="3.4" fill="#0d0d0d" fontFamily="var(--f-mono), monospace">
                  <textPath href="#ct-circ">SAY HELLO · SAY HELLO · SAY HELLO · </textPath>
                </text>
              </g>
              <circle cx="80" cy="80" r="26" fill="#0d0d0d" />
              <path d="M70 80h20m-7-7 7 7-7 7" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        <style>{`
          .ct-h { margin-top: 4px; font-weight: 700; letter-spacing: -.05em; line-height: .96; font-size: clamp(44px,10vw,160px); }
          .ct-line { display: block; }
          .ct-word { display: inline-block; white-space: nowrap; }
          .ct-l { display: inline-block; white-space: pre; }
          .ct-l.hop { animation: ct-hop .6s var(--ease); }
          @keyframes ct-hop { 0% { transform: translateY(0); } 35% { transform: translateY(-.16em); } 100% { transform: translateY(0); } }
          .ct-mail { margin-top: clamp(40px,7vh,72px); display: flex; flex-wrap: wrap; align-items: center; gap: 14px 18px; }
          .ct-email { font-size: clamp(22px,4.2vw,64px); font-weight: 600; letter-spacing: -.04em; line-height: 1.1; overflow-wrap: anywhere; text-decoration: underline; text-decoration-thickness: 2px; text-underline-offset: .15em; text-decoration-color: var(--faint); transition: text-decoration-color .4s var(--ease); }
          .ct-email:hover { text-decoration-color: var(--ink); }
          .ct-copy { height: 36px; padding-inline: 16px; border-radius: 999px; font: 500 13px var(--f-mono), monospace; box-shadow: inset 0 0 0 1px rgba(13,13,13,.22); transition: background .4s var(--ease), color .4s var(--ease), transform .4s var(--ease); }
          .ct-copy:hover { background: var(--ink); color: #fff; transform: translateY(-2px); }
          .ct-row { margin-top: clamp(40px,7vh,72px); display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 32px; }
          .ct-links { flex: 1 1 380px; max-width: 640px; }
          .ct-links a { display: grid; grid-template-columns: 90px minmax(0,1fr) auto; align-items: center; gap: 12px; padding: 18px 0; border-top: 1px solid var(--line); transition: padding .5s var(--ease); }
          .ct-links li:last-child a { border-bottom: 1px solid var(--line); }
          .ct-links a:hover { padding-left: 12px; }
          .ct-links .mono { font-size: 12px; letter-spacing: .08em; text-transform: uppercase; color: var(--mute); }
          .ct-lt { font-size: clamp(16px,1.6vw,22px); font-weight: 600; letter-spacing: -.02em; overflow-wrap: anywhere; }
          .ct-ar { transition: transform .5s var(--ease); }
          .ct-links a:hover .ct-ar { transform: translate(3px,-3px); }
          .ct-badge { width: clamp(120px,14vw,170px); height: auto; flex: none; }
          .ct-spin { transform-origin: 80px 80px; animation: ct-rot 22s linear infinite; }
          @keyframes ct-rot { to { transform: rotate(360deg); } }
          .ct-foot { border-top: 1px solid var(--line); padding-block: 24px; font-size: 14px; color: var(--mute); }
          .ct-foot .wrap { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 12px 24px; align-items: center; }
          .ct-foot button { text-decoration: underline; text-underline-offset: 3px; color: var(--ink); }
          @media (prefers-reduced-motion: reduce) { .ct-spin { animation: none; } .ct-l.hop { animation: none; } }
        `}</style>
      </section>
      <footer className="ct-foot">
        <div className="wrap">
          <span>© {new Date().getFullYear()} {PROFILE.name}</span>
          <button type="button" onClick={() => scrollToTarget(0)}>Back to top ↑</button>
          <span>Built with Next.js</span>
        </div>
      </footer>
    </>
  );
}
