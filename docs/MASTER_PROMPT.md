# Master prompt: "Talking-Video" personal portfolio

Paste this whole prompt into an AI coding assistant (for example Claude or Google Antigravity) after attaching your intro video and résumé PDF. Adjust the details to your own résumé (role, sections, links) if needed.

Credit: this prompt and the "talking-video portfolio" idea come from **Lohitha Damisetti** ([@SL_Tech_Journal](https://www.instagram.com/SL_Tech_Journal)), who open-sourced it.

---

You are a senior creative front-end engineer. Build a complete, production-ready personal portfolio website for the person in the two attached files:

1. intro video (`intro.mp4` or `.mov`). The person is standing in the centre of the frame against a plain white or light background, speaking a short self-introduction to the camera.
2. résumé (`resume.pdf`). This is the only source of truth for all text content.

The site must feel clean, light, smooth and premium, not heavy. It should feel like an Awwwards "Site of the Day", but quiet: white, black and gray only. Every section has its own unique component and its own animation, yet the whole page reads as one continuous, calm surface.

---

## 0. NON-NEGOTIABLE RULES

1. Never fabricate. Every name, number, date, company, project, skill, link and certification must come from the résumé (including hyperlinks embedded in the PDF). If something isn't in the résumé, leave it out. Don't invent testimonials, clients, metrics, project screenshots or social links. If a section has no data, remove the section and its nav link.
2. Colours: white, black and grays only. No accent colours, no gradients, and no dark full-width sections.
   - The only exception: real brand logos (tech stack, coding platforms) keep their official colours.
   - A very soft brand-tint glow behind those logos is allowed.
3. No loader, no splash screen, and no "enter with sound / without sound" screen. The page opens directly on the hero.
4. No page transitions or curtains between sections. It is one continuous scroll.
5. No cursor tracking of the person and no 3D/WebGL. No three.js and no GSAP. Use CSS animations, IntersectionObserver and small requestAnimationFrame loops only.
6. Lightweight: the first-load JS for the page should stay around 130 kB. Self-host the fonts. Use no image CDNs and no external scripts at runtime.
7. Responsive from 360 px to 1920 px with zero horizontal overflow, and fully usable on touch.
8. Accessible:
   - Semantic sections and correct heading order.
   - Keyboard focus styles throughout.
   - `prefers-reduced-motion` turns off smooth scroll and decorative motion.
   - Every visual has a text equivalent.

---

## 1. TECH STACK

- Next.js 15 (App Router) with React 19 and TypeScript.
- Tailwind CSS 4, plus a small amount of custom CSS:
  - Component CSS lives in a `<style>` tag inside each component.
  - Shared classes go in `@layer components`.
  - Base `a` / `button` resets go in `@layer base`, so that Tailwind utilities always win.
- Lenis for smooth scrolling. This is the only animation-related dependency.
- Fonts are self-hosted with `next/font/local` and kept in `src/fonts`:
  - Inter Tight (variable): display and body text.
  - Instrument Serif (regular + italic): one italic accent word per heading.
  - JetBrains Mono (variable): small labels, indices and numbers.
- All content lives in one file, `src/lib/data.ts` (PROFILE, NAV, SKILL_GROUPS, EXPERIENCE, EDUCATION, PROJECTS, CERTIFICATIONS, ACHIEVEMENTS). Components only read from it.
- A `README.md` explains how to run the site, the sections table, how to rebuild the hero video, and the credits and licences for the brand logos.

### Folder structure

```
src/app/         layout.tsx (metadata, OG, fonts, themeColor #f4f2ee), page.tsx, globals.css
src/components/  App.tsx, Navigation.tsx, hero/Hero.tsx, sections/*.tsx, ui/*.tsx
src/lib/         data.ts, hooks.ts (useInView, useScrollProgress, prefersReducedMotion),
                 scroll.tsx (Lenis + scrollToTarget)
src/fonts/       *.woff2
public/hero/     hero.mp4, hero.webm
public/logos/    brand SVGs + LICENSE files
public/          portrait-bust.webp, og.jpg, favicon
scripts/         build-hero-assets.py
```

---

## 2. DESIGN SYSTEM

```css
--paper: #f4f2ee;  /* page background (warm off-white) */
--card: #ffffff;
--ink: #0d0d0d;    /* text, buttons, active states */
--ink-2: #3a3a3a;
--mute: #77756f;   /* secondary text */
--faint: #a9a6a0;
--line: rgba(13,13,13,.1);
--soft: #e9e6e0;
--ease: cubic-bezier(.16, 1, .3, 1); /* used for every transition */
--gutter: clamp(18px, 4vw, 64px);
```

- Content width: max 1320 px with side padding equal to the gutter. Sections use generous vertical padding (around `clamp(96px, 14vh, 160px)`).
- Headings: bold Inter Tight with tight tracking (−0.045em) and line-height 1.
- Each section heading ends with one Instrument Serif italic word in `--mute` ("Things I've built.").
- Section tag above each heading: a mono index plus a label, e.g. `03 — Selected work`. Number the tags in section order.
- Cards: white, radius 24–28 px, a 1 px hairline inset shadow, and a soft large shadow when active.
- Buttons: pill-shaped.
  - Primary is solid ink with white text.
  - Secondary is a hairline outline.
  - On hover, buttons fill or darken with a slight lift.
- Reveal-on-scroll: a global RevealObserver adds `.is-in` to `.rv` (fade + 24 px rise) and to `.rv-mask` (a line slides up from a mask). Use a stagger via `--i`. Animate once only.
- Text selection: ink background with paper text.

---

## 3. THE HERO VIDEO PIPELINE

Write `scripts/build-hero-assets.py`, a Python script that uses ffmpeg and numpy. It turns the uploaded intro video into a seamless looping hero clip.

1. Detect the person (or ask me for crop values) and crop tightly around them, head to toe. The person must end up centred.
   - Example for a 1920×1080 source: `crop=800:1000:<x>:80`.
   - Scale to 768 px wide.
2. Whiten the background: `colorlevels=rimax=0.98:gimax=0.98:bimax=0.98`. This makes the off-white backdrop pure white, so it blends into the page.
3. Make the loop seamless. Take about the first 10 s of the video.
   - Cross-fade the last 0.5 s of the picture into the first 0.5 s (ffmpeg `xfade`).
   - Do the same cross-fade on the audio, sample-accurately in numpy. Don't use ffmpeg `acrossfade`; it can drop the audio.
   - The intro then repeats forever with no visible jump and no audible click. Lips must stay in sync, so never stretch or retime the clip.
4. Export two files:
   - `hero.mp4`: H.264 yuv420p video (CRF 24, `-preset slow`) with AAC audio at 96 kbps and `+faststart`.
   - `hero.webm`: VP9 video (CRF 36) with Opus audio at 80 kbps.
   - Use both as `<source>` elements, webm first.
5. Make a portrait still from the clearest frame (or from a photo, if I provide one): a head-to-shirt crop at 480×600 saved as `portrait-bust.webp`. Also export `og.jpg` at 1200×630.

---

## 4. SECTIONS (in this exact order)

Hero → About → Skills → Work → Certifications → Experience → Achievements → Contact

Navigation lists: About · Skills · Work · Experience · Achievements · Contact.

### 4.0 Navigation

- Left: a round "initials" mark (outlined; turns solid ink after scrolling 40 px; spins 360° on hover) next to the full name, which fades out after scrolling.
- Centre/right: a pill of nav links.
- Once you scroll, it becomes a frosted white glass pill (`backdrop-filter: blur(12px)`).
- A solid ink indicator pill slides under the active link. Track the active section with an IntersectionObserver using `rootMargin: -45% 0px -50% 0px`.
- A 2 px ink scroll-progress bar runs along the very top.
- Mobile: a "Menu" pill opens a full-screen paper overlay that reveals with clip-path. It shows big numbered links that stagger in. Esc closes it and page scroll is locked while it's open.
- All links scroll smoothly through Lenis.

### 4.1 Hero

- Layout:
  - The video sits in the centre, large: height `min(96svh, 1040px)` with `aspect-ratio: 768/960` (about 62svh on mobile).
  - Apply `mix-blend-mode: multiply` so the white video background disappears into the paper.
  - A giant outlined ghost word (the first name, in uppercase) sits behind the person.
  - The heading is the role from the résumé (for example "Full Stack Developer."), with the CTAs: Explore work, Let's talk, Résumé ↓ (downloads the PDF).
- Video behaviour:
  - Use `<video muted loop playsInline preload="auto">`.
  - On load, try `play()` with sound. If the browser blocks it, play muted.
  - Unlock sound on the visitor's first `pointerdown`, `keydown` or `touchend`.
  - The voice loops continuously while the hero is visible.
  - An IntersectionObserver pauses the video when less than 35 % of the hero is visible, which stops the voice the moment you scroll into another section. It resumes when you scroll back.
- Sound control: one icon-only round button (46 px, solid ink).
  - Show ▶ (triangle) when the sound is off and ❚❚ (two bars) when it is on.
  - No "sound on / off" text; use an aria-label only.
  - While autoplay is blocked, show a soft ping ring around the button.

### 4.2 About: hanging lanyard ID card

- Three-column grid: `minmax(0,1fr) 320px minmax(0,1fr)`. All three columns are equal height.
- Left column:
  - "Hi, I'm <first name>."
  - The résumé summary, verbatim, plus one more short line from the résumé.
  - Buttons: Résumé, GitHub, LinkedIn (only the links that exist in the résumé).
- Centre: a realistic ID card hanging on a lanyard from the top of the section.
  - The strap is 30×56 px, with the person's name and role scrolling vertically on it, and it ends in a metal clip.
  - The card itself is about 300×404 px.
  - Motion:
    - A damped pendulum swing reacts to pointer movement (velocity → angle, with spring damping).
    - A subtle idle sway runs when nothing is happening.
    - The card flips (3D `rotateY`, `backface-visibility`) on hover. On touch it flips on tap; for keyboard it flips on Enter/Space.
  - Front:
    - A black top band reading "DEVELOPER ID".
    - The portrait centred and highlighted: a head-to-shirt crop in a 128×156 frame with a gray gradient ring, a soft halo and a hover zoom.
    - Below the photo: name, role, and rows for ID No., Dept., Valid till (the graduation year from the résumé).
    - At the bottom, a barcode and a holographic sticker (both in grays).
  - Back: "What I am": 4–5 lines drawn only from the résumé (role, degree + CGPA, problem-solving total, key project names, honours), plus a signature line and "If found, say hello · <email>".
- Right column: "Quick facts" rows (location, education, current role/internship, email), followed by one short quote.
  - The quote must be a paraphrase of the résumé's own wording, not an invented claim.

### 4.3 Skills: "The periodic table of my stack"

- Every skill in the résumé becomes an element tile with: atomic number, a 2-letter symbol (e.g. "Py", "Re"), name, and family.
- The grid is 8 columns of `minmax(0,1fr)` on desktop and 4 on mobile.
- Family filter chips (Languages, Frontend, Backend, Databases, Tools, Concepts…, grouped from the résumé). Non-matching tiles dim.
- Entrance: a diagonal wave reveal, with a delay of (row + col) × 40 ms.
- Inspector panel: sticky on the right, 320 px wide (on mobile it sits below the grid).
  - On hover or focus, it shows the real brand logo at 150 px with a pop animation, plus the name, family and the projects that use the skill.
  - Use official devicon "original" SVGs or simple-icons coloured paths, copied into `public/logos` together with their licence files.
  - Concept skills (DSA, OOP, System Design, AI, ML, REST APIs…) get custom thin line icons in the same style.
  - Build a `TechLogo` component with a BRAND map and a CONCEPT map, and export `isBrand()`.

### 4.4 Work: expanding accordion gallery

- One tall panel per résumé project (`height: min(78svh, 600px)`), laid out side by side.
- Hover, focus or tap a panel and it opens wide (flex 8). The others fold into slim spines, each showing the project number, a vertical title, and a "+" button that rotates on hover.
- Open panel:
  - Left side: number + kicker, title, the description from the résumé, a 2-column feature list, tech chips with tiny logos, and a "View on GitHub ↗" button (only if a link exists).
  - Right side: an illustrative mini-UI built in pure CSS/JSX, in grayscale, that hints at what the product does. It reveals with a clip-path wipe and is labelled "Illustrative UI" so it isn't mistaken for a real screenshot.
- Mobile: the panels become a vertical accordion.

### 4.5 Certifications: ink-flood index

- Left: a sticky heading ("Always learning.") and a count line.
- Right: a numbered list (`01`, `02`…) with each certification's title and issuer.
- On hover/focus, a row floods with ink from left to right (`scaleX` 0→1 on `::before`). The text turns white and a ↗ arrow slides in.
- The section sits on a white band with hairline top and bottom borders.

### 4.6 Experience: education and experience as one path

- A vertical timeline. Its spine draws as you scroll, scaled by scroll progress through the section.
- Each stop (year → title → place → detail) lights up as the spine reaches it.
- Combine education (school, intermediate, degree with scores and honours) and experience (internships, jobs) in chronological order.
- End with a dashed card: "Next — Your team?".

### 4.7 Achievements: pinned horizontal gallery

- The section is pinned (`position: sticky; height: 100svh`). Its total height is the viewport height plus the horizontal travel distance.
- Scrolling down slides the card track to the left; scrolling up brings it back. A thin progress bar sits in the header.
- Cards are landscape rectangles: `clamp(340px, 40vw, 540px)` × `clamp(260px, 36vh, 310px)`, white, radius 28.
- Top: a 72 px logo tile (the real platform logo, e.g. LeetCode / CodeChef / GFG / HackerRank, with a soft brand-tint glow) and an index such as "01 / 06".
- Bottom-left: label, caption and one detail line.
- Bottom-right: a huge number that counts up the first time the card is seen (easeOutQuart over 1.4 s).
- The card nearest the viewport centre lifts 12 px, its glow brightens and it gets a deeper soft shadow. There is no black border.
- Include only the numbers, ranks and honours stated in the résumé. The track ends with "and counting →".

### 4.8 Contact + footer

- A huge heading, "Let's build / something together." Each letter hops (translateY bounce) when the cursor passes over it.
- The email is a large underlined link with a Copy chip that shows "Copied ✓" and uses `aria-live`.
- Phone (a `tel:` link), GitHub and LinkedIn, all from the résumé.
- A circular "say hello" text badge spins slowly.
- Footer: © year + name, a "Back to top" link, and a "Built with Next.js" line.

---

## 5. DATA EXTRACTION (do this first)

1. Read the résumé PDF fully, including the embedded hyperlinks (GitHub, LinkedIn, project repos, certificates).
2. Fill `src/lib/data.ts` with typed objects:
   - PROFILE: name, role, email, phone, phoneHref, location, resumeSummary (verbatim), github, linkedin, resume path.
   - NAV, SKILL_GROUPS, EXPERIENCE, EDUCATION, PROJECTS (id, index, title, kicker, description, features, tech, github), CERTIFICATIONS, ACHIEVEMENTS.
3. Before building the UI, print a short summary of what you extracted and list anything that is missing, so I can confirm it.
4. Copy the résumé into `public/` so the Résumé ↓ button downloads it.

---

## 6. QUALITY CHECKS BEFORE YOU FINISH

- `npm run build` passes with no type or lint errors and no console errors at runtime.
- Use Playwright to take screenshots at 1440×900 and at 390×844, and check that `document.documentElement.scrollWidth === innerWidth` (no horizontal overflow).
- The hero video loops with no visible jump. The voice pauses when you scroll past the hero and resumes when you return. The ▶ / ❚❚ button works.
- The ID card swings, flips, and works on touch and keyboard.
- Achievements scroll horizontally while pinned and the numbers count up.
- Every piece of text can be traced back to the résumé.
- Lighthouse: Performance ≥ 90, Accessibility ≥ 95.

Deliver: the full source code, the README, and the run commands (`npm install` → `npm run dev`).

---

### Inputs checklist (for the person sending files)

- 🎥 Intro video: 8–15 s, filmed in landscape (16:9), with you standing centred against a white or light plain wall. Use even lighting and a clear voice, and start and end with a brief pause so the loop is seamless.
- 📄 Résumé PDF: the latest version, with working GitHub and LinkedIn links.
- 🖼️ (Optional) a clear front-facing photo for the ID card.
