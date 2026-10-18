"use client";
import { useState } from "react";
import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";
import { asset } from "@/lib/asset";
import { EDUCATION, PROFILE } from "@/lib/data";

const BACK_LINES = [
  `${PROFILE.role} at ${PROFILE.company}`,
  "PG Diploma in Advanced Cloud Computing and DevOps, IIT Roorkee",
  "MBA in Business Analytics at BITS Pilani (pursuing)",
  "Projects: Micro-blogging platform, Alexa Tourist Assistant, Home Automation using IoT",
  "Spotlight Award and Inspiration Beacon Award",
];

function ProfileCard() {
  const [flipped, setFlipped] = useState(false);
  return (
    <button
      type="button"
      className={`flip${flipped ? " is-flipped" : ""}`}
      aria-pressed={flipped}
      aria-label={flipped ? "Profile card, showing highlights. Flip to front" : "Profile card. Flip to see highlights"}
      onClick={() => setFlipped((f) => !f)}
    >
      <span className="flip-in">
        <span className="flip-face flip-front" aria-hidden={flipped}>
          <span className="flip-photo">
            <Image src={asset("/portrait-bust.webp")} alt={`Portrait of ${PROFILE.name}`} width={480} height={600} sizes="(min-width: 1024px) 360px, 90vw" />
          </span>
          <span className="flip-cap">
            <b>{PROFILE.name}</b>
            <span>{PROFILE.heroTitle}, {PROFILE.location}</span>
          </span>
          <span className="flip-hint" aria-hidden="true">Flip</span>
        </span>
        <span className="flip-face flip-back" aria-hidden={!flipped}>
          <ul>
            {BACK_LINES.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </span>
      </span>
    </button>
  );
}

export default function About() {
  return (
    <section id="about" className="section bg-g" aria-labelledby="about-heading">
      <div className="wrap">
        <SectionHeading id="about" title="Hi, I’m Ajay." />
        <p className="about-p rv">{PROFILE.resumeSummary}</p>
        <div className="about-links rv" style={{ ["--i" as string]: 1 }}>
          <a className="btn btn-primary" href={PROFILE.resume} download="Ajay-B-Resume.pdf">Résumé</a>
          <a className="btn btn-secondary" href={PROFILE.github} target="_blank" rel="noopener noreferrer">GitHub</a>
          <a className="btn btn-secondary" href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </div>

        <div className="bento">
          <div className="b-profile rv"><ProfileCard /></div>

          <article className="card b-role rv" style={{ ["--i" as string]: 1 }}>
            <p className="k">Current role</p>
            <h3 className="big">{PROFILE.role}</h3>
            <p className="mid">{PROFILE.company}</p>
            <p className="mid">Since {PROFILE.since}</p>
          </article>

          <figure className="card b-quote rv" style={{ ["--i" as string]: 2 }}>
            <blockquote>Built GitHub Actions CI/CD and an OpenTelemetry observability stack from scratch.</blockquote>
          </figure>

          <article className="card b-edu rv" style={{ ["--i" as string]: 3 }}>
            <p className="k">Education</p>
            <ul className="edu-list">
              {EDUCATION.map((e) => (
                <li key={e.id}>
                  <b>{e.degree}</b>
                  <span>{e.pursuing ? "Pursuing" : e.period}</span>
                  <small>
                    {e.school}
                    {e.place ? `, ${e.place}` : ""}
                  </small>
                </li>
              ))}
            </ul>
          </article>

          <article className="card b-facts rv" aria-label="Quick facts" style={{ ["--i" as string]: 4 }}>
            <div className="fact">
              <p className="k">Location</p>
              <p>{PROFILE.location}</p>
            </div>
            <div className="fact">
              <p className="k">Email</p>
              <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
            </div>
            <div className="fact">
              <p className="k">Phone</p>
              <a href={PROFILE.phoneHref}>{PROFILE.phone}</a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
