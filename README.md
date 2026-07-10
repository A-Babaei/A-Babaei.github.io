# A. Babaei — Dark Minimal Portfolio

A static, dependency-free portfolio designed for GitHub Pages.

## Deploy

Upload the contents of this folder to the root of `A-Babaei/A-Babaei.github.io`. Keep `index.html` at repository root. GitHub Pages should deploy from `main` and `/ (root)`.

## Add the profile photo

Create a professional vertical 4:5 JPG, ideally 1200 × 1500 px, compressed below about 500 KB. Save it as:

```
assets/images/profile-photo.jpg
```

The HTML automatically falls back to the included SVG placeholder if the JPG is absent.

## Main files

- `assets/css/styles.css` — design tokens and responsive layout
- `assets/js/site.js` — navigation, scroll progress, reveal effects, custom cursor, and Canvas animations
- `index.html` — long-form homepage
- `research.html`, `projects.html`, `code.html`, `visual.html`, `cv.html`, `contact.html` — internal pages

## Edit the palette

At the top of `assets/css/styles.css` change:

```css
--bg: #080808;
--paper: #efede7;
--teal: #64d8d1;
--coral: #f0614b;
```

## Mathematical animation

The website includes browser-native Canvas adaptations inspired by concepts in:

`https://github.com/A-Babaei/MatheMathical-funcion-s-Animation-`

They are adaptations for web performance, not direct execution of MATLAB files.

## Before final publication

- Add a real portrait.
- Add verified Google Scholar, ORCID, and LinkedIn URLs.
- Add only verified publication citations and DOI links.
- Replace placeholders with authorized portfolio images.
- Review CV dates and doctoral institution details.
- Do not publish confidential experimental data or client-owned assets.
