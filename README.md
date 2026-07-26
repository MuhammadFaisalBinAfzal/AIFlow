# AIFlow Landing Page

A marketing landing page for AIFlow, an AI business-automation service. Originally a single monolithic HTML file — restructured here into separate HTML, CSS, and JS files for maintainability.

## Folder structure

```
aiflow-landing/
├── index.html          # Page markup (nav, hero, sections, footer)
├── css/
│   └── style.css       # All styling: layout, animations, responsive rules
├── js/
│   └── main.js         # All behavior: nav scroll state, particles, reveal
│                          animations, orbit layout, form handling, etc.
├── assets/              # Place images (e.g. og-image.png) here if you add any
└── README.md
```

## Running it

No build step is required — it's plain HTML/CSS/JS.

- **Quickest:** double-click `index.html` to open it in a browser.
- **Recommended (avoids some browser file:// quirks):** serve it locally, e.g.:
  ```bash
  cd aiflow-landing
  python3 -m http.server 8000
  ```
  then visit `http://localhost:8000`.

## Notes

- `index.html` now links to `css/style.css` and `js/main.js` instead of embedding them inline.
- The structured-data (`application/ld+json`) script block stays inline in `<head>`, since that's standard practice for SEO metadata.
- The `assets/` folder is currently empty — the page's icons are all inline SVGs, so no image files are required for it to render as-is. Add your real `og-image.png` there and update the `og:image` / `twitter:image` URLs in `index.html` if you want social-share previews to work.
- All functionality (scroll reveal, particle background, orbit tech diagram, hero workflow animation, contact form handling, mobile menu, etc.) is unchanged — only the file organization changed.