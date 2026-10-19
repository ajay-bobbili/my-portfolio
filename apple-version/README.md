# Ajay B - portfolio (Apple-design variant)

A restyled copy of the portfolio following Apple's design principles: system font stack (SF Pro first, self-hosted Inter Tight as fallback), white and #f5f5f7 alternating sections, a light achievements section with large count-up numbers, frosted 44px nav, bento cards, scroll-snap project tiles and subtle scroll reveals. Content comes only from `src/lib/data.ts`. The original site in the repo root is untouched. See the [root README](../README.md) for the full guide to building and customising your own talking-video portfolio.

## Run

```
npm install
npm run dev          # http://localhost:3000
npm run build        # static export to ./out
```

Set `NEXT_PUBLIC_BASE_PATH=/my-portfolio` for a GitHub Pages sub-path; leave it empty locally.

## Portrait
`public/portrait-bust.webp` is a neutral cartoon default (a head-and-shirt crop of the hero character). Replace it with your own 480x600 image.

## Credits
Credits to Lohitha Damisetti ([Instagram: @SL_Tech_Journal](https://www.instagram.com/SL_Tech_Journal), [LinkedIn](https://www.linkedin.com/in/lohitha-damisetti-2bb36829a/)) for the open-source talking-video portfolio idea.
