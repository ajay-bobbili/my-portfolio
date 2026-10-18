import SectionHeading from "@/components/ui/SectionHeading";
import { CERTIFICATIONS } from "@/lib/data";

export default function Certifications() {
  const n = CERTIFICATIONS.length;
  return (
    <section id="certifications" className="certs" aria-labelledby="certifications-heading">
      <div className="wrap certs-grid">
        <div className="certs-left">
          <SectionHeading id="certifications" lead="Always" accent="learning." />
          <p className="certs-count rv" style={{ ["--i" as string]: 2 }}>
            <span className="mono">{String(n).padStart(2, "0")}</span> certifications and counting
          </p>
        </div>
        <ol className="certs-list" aria-label="Certifications">
          {CERTIFICATIONS.map((c, i) => (
            <li key={c.id} className="rv" style={{ ["--i" as string]: Math.min(i, 5) }}>
              <a className="cert-row" href={c.url} target="_blank" rel="noopener noreferrer">
                <span className="cert-idx mono">{c.index}</span>
                <span className="cert-title">
                  {c.title}
                  <span className="cert-sr sr-only-x"> (opens in new tab)</span>
                </span>
                <span className="cert-date mono">{c.date}</span>
                <span className="cert-arrow" aria-hidden="true">↗</span>
              </a>
            </li>
          ))}
        </ol>
      </div>
      <style>{`
        .certs { background: #fff; border-block: 1px solid var(--line); padding-block: var(--section-pad); }
        .certs-grid { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: clamp(32px, 6vw, 96px); align-items: start; }
        .certs-left { position: sticky; top: calc(var(--nav-h) + 24px); }
        .certs-count { margin-top: 28px; color: var(--mute); font-size: 15px; }
        .certs-count .mono { color: var(--ink); }
        .certs-list { border-top: 1px solid var(--line); }
        .certs-list li { border-bottom: 1px solid var(--line); }
        .cert-row { position: relative; display: grid; grid-template-columns: 44px minmax(0, 1fr) auto 28px; align-items: center; gap: 16px; padding: 26px 18px; overflow: hidden; isolation: isolate; color: var(--ink); transition: color 0.5s var(--ease); }
        .cert-row::before { content: ""; position: absolute; inset: 0; z-index: -1; background: var(--ink); transform: scaleX(0); transform-origin: left; transition: transform 0.6s var(--ease); }
        .cert-row:hover, .cert-row:focus-visible { color: #fff; }
        .cert-row:hover::before, .cert-row:focus-visible::before { transform: scaleX(1); }
        .cert-row:focus-visible { outline-offset: -3px; outline-color: var(--faint); border-radius: 0; }
        .cert-idx { font-size: 12px; color: var(--mute); transition: color 0.5s var(--ease); }
        .cert-title { font-size: clamp(18px, 2vw, 26px); font-weight: 600; letter-spacing: -0.03em; line-height: 1.15; }
        .cert-date { font-size: 12px; color: var(--mute); white-space: nowrap; transition: color 0.5s var(--ease); }
        .cert-row:hover .cert-idx, .cert-row:hover .cert-date, .cert-row:focus-visible .cert-idx, .cert-row:focus-visible .cert-date { color: rgba(255,255,255,.7); }
        .cert-arrow { font-size: 20px; opacity: 0; transform: translateX(-14px); transition: opacity 0.5s var(--ease), transform 0.5s var(--ease); }
        .cert-row:hover .cert-arrow, .cert-row:focus-visible .cert-arrow { opacity: 1; transform: none; }
        @media (max-width: 860px) {
          .certs-grid { grid-template-columns: minmax(0, 1fr); }
          .certs-left { position: static; }
          .cert-row { grid-template-columns: 32px minmax(0, 1fr) 24px; padding: 20px 8px; row-gap: 4px; }
          .cert-date { grid-column: 2; grid-row: 2; }
          .cert-arrow { grid-column: 3; grid-row: 1; opacity: 1; transform: none; }
        }
        @media (hover: none) { .cert-arrow { opacity: 1; transform: none; } }
      `}</style>
    </section>
  );
}
