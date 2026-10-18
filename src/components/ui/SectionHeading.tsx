import type { ReactNode } from "react";
import { SECTIONS, type SectionId } from "@/lib/data";

interface Props {
  /** Section id: supplies the "03 — Selected work" tag and the heading id `${id}-heading`. */
  id: SectionId;
  /** Heading text before the accent word, e.g. "Things I've". */
  lead: ReactNode;
  /** Final word, rendered in serif italic muted, e.g. "built." */
  accent: string;
  /** Override the tag text (defaults to SECTIONS[id]). */
  tag?: string;
  className?: string;
}

export default function SectionHeading({ id, lead, accent, tag, className = "" }: Props) {
  const s = SECTIONS[id];
  return (
    <header className={className}>
      <p className="sec-tag rv">
        <span>{s.index}</span>
        <span aria-hidden="true">—</span>
        <span>{tag ?? s.label}</span>
      </p>
      <h2 id={`${id}-heading`} className="sec-h">
        <span className="rv-mask">
          <span>
            {lead} <span className="accent">{accent}</span>
          </span>
        </span>
      </h2>
    </header>
  );
}
