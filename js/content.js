/* ==========================================================================
   content.js  |  JSON-driven renderers for News & Gallery
   --------------------------------------------------------------------------
   Each renderer is a no-op unless its mount element is present on the page,
   so this single module can load everywhere. Adding news items, gallery
   photos, or courses requires editing ONLY the corresponding JSON file.
   ========================================================================== */

/* ---------------------------- NEWS ------------------------------------- */
const NEWS = {
  async init(limit) {
    const mount = document.getElementById("news-list");
    if (!mount) return;
    try {
      const json = await window.loadJSON("data/news.json");
      let items = json.news;
      if (limit) items = items.slice(0, limit);
      mount.innerHTML = items.map(n => `
        <article class="news-item reveal">
          <div class="news-date">${window.escapeHTML(n.date)}</div>
          <div class="news-body">
            <span class="tag tag--navy news-tag">${window.escapeHTML(n.tag)}</span>
            <h3 style="font-size:var(--fs-md);margin:6px 0 4px;">${window.escapeHTML(n.title)}</h3>
            <p>${window.escapeHTML(n.body)}</p>
          </div>
        </article>`).join("");
      requestAnimationFrame(() =>
        mount.querySelectorAll(".reveal").forEach(n => n.classList.add("is-visible")));
    } catch (err) {
      mount.innerHTML = `<div class="empty-state">News could not be loaded.</div>`;
    }
  }
};

/* --------------------------- GALLERY ----------------------------------- */
const GALLERY = {
  filter: "all",
  data: [],
  labels: { conference: "Conference", lab: "Lab", robot: "Robot", simulation: "Simulation", demo: "Demonstration" },

  async init() {
    const mount = document.getElementById("gallery-grid");
    if (!mount) return;
    try {
      const json = await window.loadJSON("data/gallery.json");
      this.data = json.items;
      this.render();
      this.initFilters();
    } catch (err) {
      mount.innerHTML = `<div class="empty-state">Gallery could not be loaded.</div>`;
    }
  },

  render() {
    const mount = document.getElementById("gallery-grid");
    const items = this.filter === "all"
      ? this.data
      : this.data.filter(i => i.category === this.filter);
    mount.innerHTML = items.map(i => {
      const media = i.image
        ? `<img loading="lazy" src="${window.escapeHTML(i.image)}" alt="${window.escapeHTML(i.caption)}">`
        : `<div class="media-ph"><span>${this.labels[i.category] || "Image"} placeholder</span></div>`;
      return `<figure class="gallery-item reveal">
        ${i.image ? `<div class="media-ph" style="background:none;border:0;">${media}</div>` : media}
        <figcaption class="cap">${window.escapeHTML(i.caption)}</figcaption>
      </figure>`;
    }).join("");
    requestAnimationFrame(() =>
      mount.querySelectorAll(".reveal").forEach(n => n.classList.add("is-visible")));
  },

  initFilters() {
    const filters = document.getElementById("gallery-filters");
    if (!filters) return;
    filters.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-btn");
      if (!btn) return;
      filters.querySelectorAll(".filter-btn")
        .forEach(b => b.classList.toggle("is-active", b === btn));
      this.filter = btn.dataset.filter;
      this.render();
    });
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const limit = document.getElementById("news-list")?.dataset.limit;
  NEWS.init(limit ? parseInt(limit, 10) : 0);
  GALLERY.init();
});

window.NEWS = NEWS;
window.GALLERY = GALLERY;
