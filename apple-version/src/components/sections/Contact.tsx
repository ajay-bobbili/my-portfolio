"use client";
import { useRef, useState } from "react";
import { PROFILE } from "@/lib/data";
import { scrollToTarget } from "@/lib/scroll";

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
      <section id="contact" className="section bg-g" aria-labelledby="contact-heading">
        <div className="wrap">
          <p className="eyebrow rv">Contact</p>
          <h2 id="contact-heading" className="ct-h rv" style={{ ["--i" as string]: 1 }}>Let&apos;s build something together.</h2>

          <div className="ct-mail rv" style={{ ["--i" as string]: 2 }}>
            <a className="ct-email" href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
            <button type="button" className="btn btn-secondary btn-sm" onClick={copy} aria-label={`Copy email address ${PROFILE.email}`}>
              {copied ? "Copied" : "Copy"}
            </button>
            <span className="sr-only-x" role="status" aria-live="polite">{copied ? "Email address copied" : ""}</span>
          </div>

          <ul className="ct-links">
            {links.map((l, i) => (
              <li key={l.label} className="card rv" style={{ ["--i" as string]: i }}>
                <a href={l.href} {...(l.ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                  <span className="k">{l.label}</span>
                  <span className="t">{l.text}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <footer className="foot">
        <div className="wrap">
          <span>Copyright &copy; {new Date().getFullYear()} {PROFILE.name}. All rights reserved.</span>
          <button type="button" onClick={() => scrollToTarget(0)}>Back to top</button>
          <span>Built with Next.js</span>
        </div>
      </footer>
    </>
  );
}
