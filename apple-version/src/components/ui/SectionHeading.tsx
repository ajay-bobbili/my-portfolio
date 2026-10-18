import type { ReactNode } from "react";
import { SECTIONS, type SectionId } from "@/lib/data";

interface Props {
  id: SectionId;
  /** Large headline. */
  title: ReactNode;
  /** Short gray subhead (optional). */
  sub?: ReactNode;
  /** Override the small eyebrow label (defaults to SECTIONS[id].label). */
  eyebrow?: string;
}

export default function SectionHeading({ id, title, sub, eyebrow }: Props) {
  return (
    <header className="sec-head">
      <p className="eyebrow rv">{eyebrow ?? SECTIONS[id].label}</p>
      <h2 id={`${id}-heading`} className="h2 rv" style={{ ["--i" as string]: 1 }}>{title}</h2>
      {sub && <p className="sub rv" style={{ ["--i" as string]: 2 }}>{sub}</p>}
    </header>
  );
}
