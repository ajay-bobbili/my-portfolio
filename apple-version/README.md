# Ajay B - portfolio (Apple-design variant)

A restyled copy of the portfolio following Apple's design principles: system font stack (SF Pro first, self-hosted Inter Tight as fallback), white and #f5f5f7 alternating sections, a black achievements section, frosted 44px nav, bento cards, scroll-snap project tiles and subtle scroll reveals. Content comes only from `src/lib/data.ts`. The original site in the repo root is untouched.

## Run

```
npm install
npm run dev          # http://localhost:3000
npm run build        # static export to ./out
```

Set `NEXT_PUBLIC_BASE_PATH=/my-portfolio` for a GitHub Pages sub-path; leave it empty locally.
