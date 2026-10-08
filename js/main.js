/* ==========================================================================
   main.js  |  Site bootstrap & shared interactions
   --------------------------------------------------------------------------
   Initialises the injected chrome (header/footer), then wires up scroll
   reveals, animated statistics, smooth in-page anchors and accessibility
   helpers. Page-specific rendering lives in publications.js / projects.js.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Build reusable chrome ------------------------------------------------
  buildHeader();
  buildFooter();

  // 2. Behaviors that depend on the chrome existing -------------------------
  if (window.initThemeToggle) window.initThemeToggle();
  initNavToggle();
  initHeaderScroll();
  initBackToTop();
  initVisitorCounter();

  // 3. Shared page behaviors ------------------------------------------------
  initScrollReveal();
  initStatCountUp();
  initSmoothAnchors();
  setActiveYear();
});

/* --------------------------------------------------------------------------
   Scroll-reveal using IntersectionObserver (graceful fallback included)
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const targets = document.querySelectorAll(".reveal, .reveal-stagger");
  if (!targets.length) return;

  if (!("IntersectionObserver" in window)) {
    targets.forEach(t => t.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  targets.forEach(t => io.observe(t));
}

/* --------------------------------------------------------------------------
   Animated research statistics (count-up when scrolled into view)
   Markup: <span class="stat__num" data-count="6" data-suffix="+">0</span>
   -------------------------------------------------------------------------- */
function initStatCountUp() {
  const nums = document.querySelectorAll(".stat__num[data-count]");
  if (!nums.length) return;

  const reduce = window.matchMedia &&
                 window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const animate = (el) => {
    const target = parseFloat(el.dataset.count) || 0;
    const suffix = el.dataset.suffix || "";
    const decimals = (el.dataset.count.split(".")[1] || "").length;
    if (reduce) { el.textContent = target.toFixed(decimals) + suffix; return; }

    const duration = 1200;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      el.textContent = (target * eased).toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target.toFixed(decimals) + suffix;
    };
    requestAnimationFrame(step);
  };

  if (!("IntersectionObserver" in window)) { nums.forEach(animate); return; }
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (e.isIntersecting) { animate(e.target); obs.unobserve(e.target); }
    });
  }, { threshold: 0.5 });
  nums.forEach(n => io.observe(n));
}

/* --------------------------------------------------------------------------
   Smooth scrolling for in-page anchor links (with reduced-motion respect)
   -------------------------------------------------------------------------- */
function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    });
  });
}

/* --------------------------------------------------------------------------
   Populate any element marked data-year with the current year
   -------------------------------------------------------------------------- */
function setActiveYear() {
  document.querySelectorAll("[data-year]").forEach(el => {
    el.textContent = new Date().getFullYear();
  });
}

/* --------------------------------------------------------------------------
   Shared fetch helper for JSON data files (with friendly error surface)
   -------------------------------------------------------------------------- */
async function loadJSON(path) {
  const res = await fetch(path, { cache: "no-cache" });
  if (!res.ok) throw new Error(`Could not load ${path} (${res.status})`);
  return res.json();
}
window.loadJSON = loadJSON;

/* Escape helper to keep JSON-driven content injection safe ----------------- */
function escapeHTML(str) {
  return String(str ?? "").replace(/[&<>"']/g, ch => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[ch]));
}
window.escapeHTML = escapeHTML;
