# Surya Prakash S. K.: Academic Research Website

Official academic homepage for **Surya Prakash S. K.**, PhD Research Scholar at the
Centre for Artificial Intelligence and Robotics (CAIR), Indian Institute of
Technology Mandi. The site is a fast, accessible, fully static, **JSON-driven**
multi-page website designed for PhD/postdoc/faculty applications, research
collaborations, and long-term use. It deploys directly to GitHub Pages with no
build step.

---

## Quick start

It is a static site: open `index.html` directly, or serve the folder so that
the `fetch()`-based JSON loading works (browsers block `fetch` of local files
over `file://`):

```bash
# from the project root
python3 -m http.server 8000
# then visit http://localhost:8000
```

---

## Project structure

```
research-portfolio/
├── index.html          Home (hero, stats, research snapshot, recent news)
├── about.html          Biography, journey, vision, philosophy, skills
├── research.html       Three research themes (anchored sections)
├── projects.html       Project cards (rendered from data/projects.json)
├── publications.html   Searchable/filterable publications + stats
├── experience.html     Research / academic / industrial timeline + education
├── gallery.html        Filterable image gallery (placeholders)
├── news.html           Full news feed
├── contact.html        Contact details, profiles, map, mailto form
│
├── css/
│   ├── style.css        Design tokens + all component styles (light + dark)
│   ├── responsive.css   Breakpoints (1024 / 820 / 560px) + print styles
│   └── animations.css   Scroll reveal, stat count-up (reduced-motion safe)
│
├── js/
│   ├── components.js    Central SITE config; builds header, nav, footer
│   ├── darkmode.js      Theme resolution + toggle (saved → system → light)
│   ├── main.js          Bootstrap: reveal, count-up, smooth scroll, helpers
│   ├── publications.js  Renders publications + citations/BibTeX from JSON
│   ├── search.js        Publication text search + type/status filters
│   ├── projects.js      Renders project cards + theme filters from JSON
│   └── content.js       Renders News and Gallery from JSON
│
├── data/
│   ├── publications.json
│   ├── projects.json
│   ├── news.json
│   └── gallery.json
│
├── assets/
│   ├── images/          Profile photo + gallery images (see placeholders)
│   ├── icons/
│   ├── pdf/             Surya_Prakash_CV.pdf
│   └── videos/
│
├── .nojekyll            Tells GitHub Pages to serve files as-is
└── README.md
```

> **Note on the JavaScript file list.** Beyond the five JS files in the original
> spec, two were added to keep the code modular and the content fully
> data-driven: **`components.js`** (single source of truth for the header,
> footer, nav, social links and contact details) and **`content.js`** (the
> News/Gallery renderers). Editing `components.js` once updates the
> chrome on every page.

---

## Editing content: JSON only

Adding publications, projects, news, gallery items, or courses requires editing
**only the JSON files** in `data/`. No HTML or JS changes are needed, and the
design scales to 100+ entries without modification.

### Add a publication: `data/publications.json`

```json
{
  "id": "venue2027-shortname",
  "type": "journal",                 // "journal" | "conference"
  "status": "published",             // "published" | "accepted" | "under-review"
  "title": "Paper title",
  "authors": [
    { "name": "Surya Prakash S. K.", "me": true },
    { "name": "Co Author" }
  ],
  "venue": "IEEE Transactions on …",
  "publisher": "IEEE",
  "location": "City, Country",       // optional
  "year": 2027,
  "pages": "pp. 1-8",                // optional
  "doi": "10.xxxx/xxxxx",           // optional: DOI button + citation
  "abstract": "…",
  "keywords": ["…", "…"],
  "flags": { "first": true, "corresponding": false, "best": false },
  "links": { "pdf": "", "code": "", "video": "" },
  "note": "Revision 1"               // optional small parenthetical
}
```

Citation strings and BibTeX are generated automatically. Buttons (DOI, PDF,
Code, Video) appear only when the corresponding field is filled. The stat
counters on `publications.html` update from the data; if you change the totals
substantially, update the `data-count` values in that page's stat band so the
count-up animation lands on the right number.

### Add a project: `data/projects.json`

Each project supports: `title`, `year`, `summary`, `themes` (array; see theme
keys below), `overview`, `problem`, `motivation`, `methodology`,
`technical_details`, `results`, `future_scope`, `tech` (array), `links`
(`paper`/`code`/`video`), and `publication` cross-reference.

**Theme keys** (used by the project filter and the research page):
`single-arm`, `dual-arm-planning`, `rl` (also used by `data/publications.json`).

### Add news / gallery

- `data/news.json`: newest first: `{ "date", "tag", "title", "body" }`.
- `data/gallery.json`: `{ "category", "caption" }` (categories: `conference`,
  `lab`, `robot`, `simulation`, `demo`). Add an `image` field once you upload a
  file to `assets/images/`.

### Update name, links, navigation

Edit the `SITE` object at the top of `js/components.js`; it propagates to the
header, footer, and social rails everywhere.

---

## Placeholders to replace

These are intentionally marked and easy to find:

| Item | Where | How to fix |
|------|-------|-----------|
| **Profile photo** | `index.html` hero (`.profile-photo`) | Add `assets/images/profile.jpg` and replace the placeholder block with an `<img loading="lazy">`. |
| **Google Scholar URL** | `js/components.js` → `SITE.links.scholar` | Replace `"#"` with the profile URL. |
| **ORCID iD** | `js/components.js` → `SITE.links.orcid` | Replace `"#"`. |
| **GitHub URL** | `js/components.js` → `SITE.links.github` | Replace `"#"`. |
| **Gallery images** | `data/gallery.json` + `assets/images/` | Add files and `image` fields. |
| **Google Map** | `contact.html` (`.media-ph`) | Replace with an embedded map `<iframe>`. |
| **Canonical domain** | `<link rel="canonical">` / Open Graph URLs / JSON-LD `url` | Replace `https://your-domain.example/` with the live URL. |
| **Visitor counter** | footer | Currently a local-storage demo counter; swap in a hosted counter if desired. |

Links left as `"#"` (Scholar, ORCID, GitHub) are automatically dimmed in the UI
and marked “Link not yet provided”, so the site never shows a broken profile
link.

---

## Deploying to GitHub Pages

1. Create a repository and push these files to the default branch (e.g. `main`).
2. In **Settings → Pages**, set the source to the `main` branch, root folder.
3. The included **`.nojekyll`** file ensures all assets are served verbatim.
4. Update the canonical/OG/JSON-LD URLs (see table above) to the published URL.

The site uses relative paths throughout, so it works whether served from a
user/organization page (`username.github.io`) or a project subpath
(`username.github.io/research-portfolio/`).

---

## Features

Dark mode (system-aware, persisted) · sticky responsive navigation ·
publication search and filters · animated research statistics ·
research timeline · downloadable CV · back-to-top · smooth scroll ·
SEO meta + Open Graph · Schema.org `Person` metadata · lazy image loading ·
WCAG-minded semantics, skip link, focus states, and `prefers-reduced-motion`
support · no external runtime dependencies (inline SVG icons, system `fetch`).

---

## Data integrity

All content is drawn from the author's CV. Publications, venues, author lists,
DOIs, education, and experience reflect the CV exactly; nothing is fabricated.
DOIs appear only where assigned (currently the *Frontiers in Robotics and AI*
article). Where information was unavailable (photo, ORCID, GitHub, map), the
site uses clearly-marked placeholders rather than invented data.

---

© 2026 Surya Prakash S. K. Last updated: June 2026.
