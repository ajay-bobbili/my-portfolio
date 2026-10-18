# Ajay B - Portfolio

Next.js 15 (App Router) + React 19 + TypeScript + Tailwind 4 + Lenis. All content lives in `src/lib/data.ts`.

## Run
```
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Sections
| # | id | File |
|---|----|------|
| - | hero | `src/components/hero/Hero.tsx` |
| 01 | about | `src/components/sections/About.tsx` |
| 02 | skills | `.../Skills.tsx` |
| 03 | work | `.../Work.tsx` |
| 04 | certifications | `.../Certifications.tsx` |
| 05 | experience | `.../Experience.tsx` |
| 06 | achievements | `.../Achievements.tsx` |
| 07 | contact | `.../Contact.tsx` |

Shared: `src/components/ui/*` (RevealObserver, SectionHeading, Button, TechLogo), `src/lib/{data,hooks,scroll}`.

## Rebuild the hero assets
Needs ffmpeg on PATH, Python with numpy + Pillow. Inputs in the project root: `intro.mp4`, `id card.jpeg`, `cv.pdf`.
```
python -I -X utf8 scripts/build-hero-assets.py
```
Produces `public/hero/hero.{mp4,webm}` (looping, audio crossfaded sample-accurately), `public/portrait-bust.webp`, `og.jpg`, `favicon.ico`, `icon.png`, `cv.pdf`.
Background whitening uses `colorlevels` at 0.90 on all channels (the source background measures 0.91-0.94 per channel/frame, so the specified 0.98 would not reach white).
The hero video's left/right 8% is feathered to transparent with a CSS `mask-image` on `.hero-video` (Hero.tsx) so the floor-shadow crop edge never shows.

## Notes
- The updated CV now uses ajaybobbili7@gmail.com in both its text and its mailto link.
- The MBA (BITS Pilani) and the Chennai location were supplied by the owner, not the CV.

## Logo credits
`public/logos/*.svg` are devicon "original" icons (MIT, see `public/logos/LICENSE-devicon.txt`); trademarks belong to their owners. `lnrs.webp` (LexisNexis Risk Solutions) and `srm.webp` (SRM Institute of Science and Technology) were supplied by the site owner. Fonts (Inter Tight, Instrument Serif, JetBrains Mono; OFL) are self-hosted in `src/fonts` with licences.
