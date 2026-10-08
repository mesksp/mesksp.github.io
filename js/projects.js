/* ==========================================================================
   projects.js  |  JSON-driven project rendering
   --------------------------------------------------------------------------
   Reads data/projects.json and renders a detailed card for each project,
   including overview, problem statement, motivation, methodology, technical
   details, results, future scope, technology stack, and links to the related
   publication / code / video. Adding a project requires editing ONLY the JSON.
   Theme filter chips (optional, via #project-filters) reuse data-themes hooks.
   ========================================================================== */

const PROJ = {
  data: [],
  pubIndex: {},

  themeLabels: {
    "vision": "Vision-Based Manipulation",
    "dual-arm": "Dual-Arm Manipulation",
    "robot-learning": "Robot Learning",
    "reinforcement-learning": "Reinforcement Learning",
    "motion-planning": "Motion Planning",
    "embodied-ai": "Embodied AI",
    "industrial": "Industrial Robotics"
  },

  async init() {
    const mount = document.getElementById("project-list");
    if (!mount) return;
    try {
      const [pj, pubs] = await Promise.all([
        window.loadJSON("data/projects.json"),
        window.loadJSON("data/publications.json").catch(() => ({ publications: [] }))
      ]);
      this.data = pj.projects;
      pubs.publications.forEach(p => (this.pubIndex[p.id] = p));
      this.render();
      this.initFilters();
    } catch (err) {
      mount.innerHTML = `<div class="empty-state">Projects could not be loaded. ${window.escapeHTML(err.message)}</div>`;
    }
  },

  block(label, value) {
    if (!value) return "";
    return `<div class="fc-block">
      <h4>${label}</h4>
      <p>${window.escapeHTML(value)}</p>
    </div>`;
  },

  card(p) {
    const tech = (p.tech || [])
      .map(t => `<span class="tag">${window.escapeHTML(t)}</span>`).join("");

    const pub = p.publication && this.pubIndex[p.publication];
    const actions = [];
    if (pub) {
      const href = pub.doi ? `https://doi.org/${pub.doi}` : "publications.html";
      actions.push(`<a class="btn btn--outline btn--sm" href="${href}"${pub.doi ? ' target="_blank" rel="noopener"' : ""}>Publication</a>`);
    }
    if (p.links?.code)  actions.push(`<a class="btn btn--outline btn--sm" href="${p.links.code}" target="_blank" rel="noopener">Code</a>`);
    const vids = p.links?.videos?.length ? p.links.videos : (p.links?.video ? [{ label: "Video", src: p.links.video }] : []);

    let media;
    if (vids.length) {
      const chips = vids.length > 1
        ? `<div class="proj-video__tabs" role="group" aria-label="Choose video">${vids.map((v, i) =>
            `<button type="button" class="proj-video__tab${i ? "" : " is-active"}" data-src="${window.escapeHTML(v.src)}">${window.escapeHTML(v.label)}</button>`).join("")}</div>`
        : "";
      media = `<div class="proj-video">
        <video src="${window.escapeHTML(vids[0].src)}" muted loop playsinline controls preload="metadata" aria-label="${window.escapeHTML(p.title)} demonstration video"></video>
        ${chips}
      </div>`;
    } else {
      const inner = p.image
        ? `<img loading="lazy" src="${window.escapeHTML(p.image)}" alt="${window.escapeHTML(p.title)}">`
        : `<span>Figure placeholder</span>`;
      media = `<div class="media-ph">${inner}</div>`;
    }

    const el = document.createElement("article");
    el.className = "feature-card reveal";
    el.dataset.themes = (p.themes || []).join(" ");
    el.innerHTML = `
      ${media}
      <div>
        <p class="card__meta">${window.escapeHTML(p.year || "")} · ${(p.themes || []).map(t => this.themeLabels[t] || t).join(" · ")}</p>
        <h3>${window.escapeHTML(p.title)}</h3>
        ${p.tagline ? `<p class="lead">${window.escapeHTML(p.tagline)}</p>` : ""}
        ${this.block("Overview", p.overview)}
        ${this.block("Problem Statement", p.problem)}
        ${this.block("Research Motivation", p.motivation)}
        ${this.block("Methodology", p.methodology)}
        ${this.block("Technical Details", p.technical)}
        ${this.block("Experimental Results", p.results)}
        ${this.block("Future Scope", p.future)}
        ${tech ? `<div class="fc-block"><h4>Technology Stack</h4><div class="pub__keywords">${tech}</div></div>` : ""}
        ${actions.length ? `<div class="pub__actions">${actions.join("")}</div>` : ""}
      </div>`;
    this.bindVideo(el);
    return el;
  },

  /* Hover-to-play on pointer devices; the native play button works everywhere. */
  bindVideo(el) {
    const video = el.querySelector(".proj-video video");
    if (!video) return;
    const canHover = window.matchMedia("(hover: hover)").matches;
    let manual = false;
    video.addEventListener("click", () => { manual = true; });
    video.addEventListener("pause", () => { manual = false; });
    if (canHover) {
      el.querySelector(".proj-video").addEventListener("mouseenter", () => { video.play().catch(() => {}); });
      el.querySelector(".proj-video").addEventListener("mouseleave", () => { if (!manual) video.pause(); });
    }
    el.querySelectorAll(".proj-video__tab").forEach(tab => {
      tab.addEventListener("click", () => {
        el.querySelectorAll(".proj-video__tab").forEach(t => t.classList.toggle("is-active", t === tab));
        video.src = tab.dataset.src;
        video.play().catch(() => {});
      });
    });
  },

  render(list = this.data) {
    const mount = document.getElementById("project-list");
    mount.innerHTML = "";
    if (!list.length) {
      mount.innerHTML = `<div class="empty-state">No projects match this theme.</div>`;
      return;
    }
    const frag = document.createDocumentFragment();
    list.forEach(p => frag.appendChild(this.card(p)));
    mount.appendChild(frag);
    // Re-run reveal for freshly inserted nodes
    if (window.IntersectionObserver) {
      document.querySelectorAll("#project-list .reveal").forEach(n => n.classList.add("is-visible"));
    }
  },

  initFilters() {
    const filters = document.getElementById("project-filters");
    if (!filters) return;
    filters.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-btn");
      if (!btn) return;
      filters.querySelectorAll(".filter-btn")
        .forEach(b => b.classList.toggle("is-active", b === btn));
      const theme = btn.dataset.filter;
      const list = theme === "all"
        ? this.data
        : this.data.filter(p => (p.themes || []).includes(theme));
      this.render(list);
    });
  }
};

document.addEventListener("DOMContentLoaded", () => PROJ.init());
window.PROJ = PROJ;
