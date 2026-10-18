import SectionHeading from "@/components/ui/SectionHeading";
import { CERTIFICATIONS } from "@/lib/data";

export default function Certifications() {
  return (
    <section id="certifications" className="section bg-w" aria-labelledby="certifications-heading">
      <div className="wrap">
        <SectionHeading id="certifications" title="Always learning." sub={`${CERTIFICATIONS.length} certifications and counting.`} />
        <ol className="cert-list" aria-label="Certifications">
          {CERTIFICATIONS.map((c, i) => (
            <li key={c.id} className="rv" style={{ ["--i" as string]: Math.min(i, 3) }}>
              <a className="cert-row" href={c.url} target="_blank" rel="noopener noreferrer">
                <span className="cert-t">
                  {c.title}
                  {c.issuer && <span className="cert-iss">{c.issuer}</span>}
                  <span className="sr-only-x"> (opens in new tab)</span>
                </span>
                <span className="cert-date">{c.date}</span>
                <span className="cert-ar" aria-hidden="true">&#8250;</span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
