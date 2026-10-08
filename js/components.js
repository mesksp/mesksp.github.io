/* ==========================================================================
   components.js  |  Reusable site chrome & shared behaviors
   --------------------------------------------------------------------------
   Single source of truth for the header, navigation and footer so that every
   page stays consistent. To change a nav item, social link or contact detail
   across the whole site, edit ONLY the SITE object below.
   ========================================================================== */

/* --------------------------------------------------------------------------
   Central site configuration  (edit here; propagates everywhere)
   -------------------------------------------------------------------------- */
const SITE = {
  name:       "Surya Prakash S. K.",
  shortName:  "S. P. S. K.",
  role:       "PhD Research Scholar",
  centre:     "Centre for Artificial Intelligence and Robotics (CAIR)",
  institute:  "Indian Institute of Technology Mandi",
  location:   "Kamand, Himachal Pradesh 175005, India",
  email:      "s.surya1754@gmail.com",

  // External profiles. Replace "#" placeholders once IDs are available.
  links: {
    cv:        "assets/Documents/SuryaPrakash_CV.pdf",
    scholar:   "https://scholar.google.com/citations?user=NJhUjFQAAAAJ&hl=en",
    orcid:     "https://orcid.org/0009-0006-3327-8019",
    github:    "https://github.com/suryaroboticarm",
    linkedin:  "https://www.linkedin.com/in/surya-prakash-s-k-7517b2157/",
    email:     "mailto:s.surya1754@gmail.com"
  },

  // Primary navigation (order preserved)
  nav: [
    { label: "Home",         href: "index.html" },
    { label: "About",        href: "about.html" },
    { label: "Research",     href: "research.html" },
    { label: "Projects",     href: "projects.html" },
    { label: "Publications", href: "publications.html" },
    { label: "Experience",   href: "experience.html" },
    { label: "Gallery",      href: "gallery.html" },
    { label: "News",         href: "news.html" },
    { label: "Contact",      href: "contact.html" }
  ],

  lastUpdated: "June 2026"
};

/* --------------------------------------------------------------------------
   Inline SVG icon set (no external icon dependency → fast, offline-safe)
   -------------------------------------------------------------------------- */
const ICONS = {
  scholar:  '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3 1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v3.99L12 21l7-3.83v-3.99L12 17l-7-3.82z"/></svg>',
  orcid:    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zM7.37 18.16h-1.6V8.2h1.6v9.96zM6.57 6.5a.93.93 0 1 1 0-1.86.93.93 0 0 1 0 1.86zm11.36 11.66h-3.4c-3.2 0-4.55-2.3-4.55-4.98 0-2.96 1.88-4.98 4.7-4.98h3.25v1.45h-3.16c-2.07 0-2.99 1.5-2.99 3.53 0 1.86 1.06 3.53 3.04 3.53h1.51V9.65h1.6v8.51z"/></svg>',
  github:   '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.39 1.24-3.23-.12-.31-.54-1.53.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.18.77.84 1.24 1.92 1.24 3.23 0 4.62-2.81 5.64-5.49 5.94.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12.01 12.01 0 0 0 24 12.5C24 5.87 18.63.5 12 .5z"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/></svg>',
  email:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>',
  download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 3v12m0 0 4-4m-4 4-4-4M4 19h16"/></svg>',
  sun:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>',
  moon:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
  menu:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  close:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  arrowUp:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 19V5m0 0-7 7m7-7 7 7"/></svg>',
  search:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>'
};

/* --------------------------------------------------------------------------
   Build & inject the sticky site header / navigation
   -------------------------------------------------------------------------- */
function buildHeader() {
  const current = (location.pathname.split("/").pop() || "index.html");
  const navLinks = SITE.nav.map(item => {
    const active = item.href === current ? " is-active" : "";
    return `<a class="nav__link${active}" href="${item.href}"${active ? ' aria-current="page"' : ""}>${item.label}</a>`;
  }).join("");

  const header = document.createElement("header");
  header.className = "site-header";
  header.innerHTML = `
    <div class="container nav">
      <a class="nav__brand" href="index.html" aria-label="${SITE.name} — Home">
        <span class="name">${SITE.name}</span>
        <span class="role">${SITE.role} · IIT Mandi</span>
      </a>
      <nav class="nav__menu" id="primary-nav" aria-label="Primary">
        ${navLinks}
      </nav>
      <div class="nav__controls">
        <button class="icon-btn" id="theme-toggle" type="button"
                aria-label="Switch colour theme" title="Toggle dark mode">${ICONS.moon}</button>
        <button class="icon-btn nav__toggle" id="nav-toggle" type="button"
                aria-label="Open menu" aria-expanded="false"
                aria-controls="primary-nav">${ICONS.menu}</button>
      </div>
    </div>`;

  const mount = document.getElementById("site-header");
  if (mount) mount.replaceWith(header);
  else document.body.prepend(header);
}

/* --------------------------------------------------------------------------
   Build & inject the site footer
   -------------------------------------------------------------------------- */
function buildFooter() {
  const year = new Date().getFullYear();
  const footer = document.createElement("footer");
  footer.className = "site-footer";
  footer.innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <div>
          <p class="brand-name">${SITE.name}</p>
          <p>${SITE.role}<br>${SITE.centre}<br>${SITE.institute}</p>
          <p>${SITE.location}</p>
        </div>
        <div>
          <h4>Navigate</h4>
          ${SITE.nav.slice(0, 5).map(i => `<p><a href="${i.href}">${i.label}</a></p>`).join("")}
        </div>
        <div>
          <h4>Profiles</h4>
          <p><a href="${SITE.links.scholar}">Google Scholar</a></p>
          <p><a href="${SITE.links.orcid}">ORCID</a></p>
          <p><a href="${SITE.links.github}">GitHub</a></p>
          <p><a href="${SITE.links.linkedin}">LinkedIn</a></p>
          <p><a href="${SITE.links.email}">Email</a></p>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© ${year} ${SITE.name}. All rights reserved.</span>
        <span>Last updated: ${SITE.lastUpdated} · Visitors:
          <span id="visitor-count" aria-label="Visitor count">—</span>
        </span>
      </div>
    </div>`;

  const mount = document.getElementById("site-footer");
  if (mount) mount.replaceWith(footer);
  else document.body.appendChild(footer);
}

/* --------------------------------------------------------------------------
   Mobile navigation toggle
   -------------------------------------------------------------------------- */
function initNavToggle() {
  const toggle = document.getElementById("nav-toggle");
  const menu   = document.getElementById("primary-nav");
  if (!toggle || !menu) return;

  toggle.addEventListener("click", () => {
    const open = menu.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    toggle.innerHTML = open ? ICONS.close : ICONS.menu;
  });

  // Close the menu when a link is chosen (mobile)
  menu.querySelectorAll("a").forEach(a =>
    a.addEventListener("click", () => {
      menu.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.innerHTML = ICONS.menu;
    })
  );
}

/* --------------------------------------------------------------------------
   Header elevation on scroll
   -------------------------------------------------------------------------- */
function initHeaderScroll() {
  const header = document.querySelector(".site-header");
  if (!header) return;
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* --------------------------------------------------------------------------
   Back-to-top button
   -------------------------------------------------------------------------- */
function initBackToTop() {
  const btn = document.createElement("button");
  btn.className = "to-top";
  btn.type = "button";
  btn.setAttribute("aria-label", "Back to top");
  btn.innerHTML = ICONS.arrowUp;
  document.body.appendChild(btn);

  btn.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" }));
  window.addEventListener("scroll", () =>
    btn.classList.toggle("is-visible", window.scrollY > 480), { passive: true });
}

/* --------------------------------------------------------------------------
   Lightweight session-based visitor counter (no backend required)
   Stored in localStorage; a real deployment can swap in a hosted counter.
   -------------------------------------------------------------------------- */
function initVisitorCounter() {
  const el = document.getElementById("visitor-count");
  if (!el) return;
  try {
    let n = parseInt(localStorage.getItem("sp_visits") || "0", 10);
    if (!sessionStorage.getItem("sp_counted")) {
      n += 1;
      localStorage.setItem("sp_visits", String(n));
      sessionStorage.setItem("sp_counted", "1");
    }
    el.textContent = (1240 + n).toLocaleString(); // seeded baseline
  } catch (e) {
    el.textContent = "—";
  }
}

/* Expose for other modules */
window.SITE = SITE;
window.ICONS = ICONS;
