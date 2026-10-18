import SectionHeading from "@/components/ui/SectionHeading";
import { TIMELINE } from "@/lib/data";

export default function Experience() {
  // newest first reads best for a quiet vertical list
  const items = [...TIMELINE].reverse();
  return (
    <section id="experience" className="section bg-g" aria-labelledby="experience-heading">
      <div className="wrap">
        <SectionHeading id="experience" title="Where I’ve been." sub="Education and experience, newest first." />
        <ol className="tl" aria-label="Education and experience timeline">
          {items.map((t) => (
            <li key={t.id} className={`tl-item rv ${t.kind}`}>
              <p className="tl-per">
                {t.kind === "work" ? "Experience" : "Education"} · {t.period}
              </p>
              <h3 className="tl-t">{t.title}</h3>
              <p className="tl-org">
                {t.org}
                {t.place ? `, ${t.place}` : ""}
              </p>
              {t.bullets && (
                <ul className="tl-b">
                  {t.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
