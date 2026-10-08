/* ==========================================================================
   publications.js  |  JSON-driven publication rendering
   --------------------------------------------------------------------------
   Reads data/publications.json and renders one card per entry into
   #pub-list. Each card exposes: status / type badges, author list (with the
   author marked `me` in bold), venue, an expandable abstract, keyword tags,
   and actions (DOI, PDF, code, video, BibTeX, copy citation).
   Search & filtering are handled by search.js, which reads the data-* hooks
   written here. Adding a paper requires editing ONLY the JSON file.
   ========================================================================== */

const PUB = {
  data: [],

  statusLabel: {
    "published": "Published",
    "accepted": "Accepted",
    "under-review": "Under Review"
  },
  statusBadge: {
    "published": "badge--published",
    "accepted": "badge--accepted",
    "under-review": "badge--review"
  },

  async init() {
    const list = document.getElementById("pub-list");
    if (!list) return;
    try {
      const json = await window.loadJSON("data/publications.json");
      // Sort: newest first, then journals before conferences within a year.
      this.data = json.publications.sort((a, b) =>
        (b.year - a.year) || (a.type === b.type ? 0 : a.type === "journal" ? -1 : 1));
      this.render();
      this.updateStats();
      if (window.PubSearch) window.PubSearch.init(this.data);
    } catch (err) {
      list.innerHTML = `<div class="empty-state">Publication list could not be loaded. ${window.escapeHTML(err.message)}</div>`;
    }
  },

  authorsHTML(authors) {
    return authors.map(a =>
      a.me ? `<span class="me">${window.escapeHTML(a.name)}</span>`
           : window.escapeHTML(a.name)
    ).join(", ");
  },

  citationString(p) {
    const authors = p.authors.map(a => a.name).join(", ");
    const bits = [`${authors}, "${p.title},"`, p.venue];
    if (p.location) bits.push(p.location);
    bits.push(String(p.year));
    if (p.pages) bits.push(p.pages);
    let s = bits.filter(Boolean).join(", ") + ".";
    if (p.doi) s += ` doi: ${p.doi}.`;
    return s;
  },

  bibtex(p) {
    const firstSurname = (p.authors[0].name.split(" ").pop() || "ref")
      .replace(/[^A-Za-z]/g, "");
    const key = `${firstSurname}${p.year}${p.id.split("-")[0]}`;
    const entryType = p.type === "journal" ? "article" : "inproceedings";
    const venueField = p.type === "journal" ? "journal" : "booktitle";
    const authorBib = p.authors.map(a => a.name).join(" and ");
    const lines = [
      `@${entryType}{${key},`,
      `  author    = {${authorBib}},`,
      `  title     = {${p.title}},`,
      `  ${venueField} = {${p.venue}},`,
      `  year      = {${p.year}},`
    ];
    if (p.pages)     lines.push(`  pages     = {${p.pages.replace(/^pp\.\s*/, "")}},`);
    if (p.publisher) lines.push(`  publisher = {${p.publisher}},`);
    if (p.location)  lines.push(`  address   = {${p.location}},`);
    if (p.doi)       lines.push(`  doi       = {${p.doi}},`);
    lines.push(`}`);
    return lines.join("\n");
  },

  themeLabels: {
    "single-arm": "Single-Arm Vision & Learning",
    "dual-arm-planning": "Perception-Based Dual-Arm Motion Planning",
    "rl": "Reinforcement-Learning-Based Manipulation"
  },

  card(p) {
    const badges = [];
    badges.push(`<span class="tag tag--navy">${p.type === "journal" ? "Journal" : "Conference"}</span>`);
    badges.push(`<span class="badge ${this.statusBadge[p.status]}">${this.statusLabel[p.status]}</span>`);
    if (p.flags?.first)         badges.push(`<span class="badge badge--first">First Author</span>`);
    if (p.flags?.corresponding) badges.push(`<span class="badge badge--corr">Corresponding</span>`);
    if (p.flags?.best)          badges.push(`<span class="badge badge--best">Best Paper</span>`);

    const venueLine = [p.venue, p.location].filter(Boolean).join(", ");
    const meta = [p.publisher, p.pages].filter(Boolean).join(" · ");
    const note = p.note ? ` <span class="muted">(${window.escapeHTML(p.note)})</span>` : "";

    const actions = [];
    if (p.doi)            actions.push(`<a class="btn btn--outline btn--sm" href="https://doi.org/${p.doi}" target="_blank" rel="noopener">DOI</a>`);
    if (p.links?.pdf)     actions.push(`<a class="btn btn--outline btn--sm" href="${p.links.pdf}" target="_blank" rel="noopener">PDF</a>`);
    if (p.links?.code)    actions.push(`<a class="btn btn--outline btn--sm" href="${p.links.code}" target="_blank" rel="noopener">Code</a>`);
    const vids = p.links?.videos?.length ? p.links.videos : (p.links?.video ? [{ label: "Video", src: p.links.video }] : []);
    vids.forEach(v => actions.push(`<a class="btn btn--outline btn--sm" href="${window.escapeHTML(v.src)}" target="_blank" rel="noopener">${window.escapeHTML(v.label)}</a>`));
    actions.push(`<button class="btn btn--ghost btn--sm" data-action="abstract">Abstract</button>`);
    actions.push(`<button class="btn btn--ghost btn--sm" data-action="bibtex">BibTeX</button>`);
    actions.push(`<button class="btn btn--ghost btn--sm" data-action="cite">Copy citation</button>`);

    const keywords = (p.keywords || [])
      .map(k => `<span class="tag">${window.escapeHTML(k)}</span>`).join("");

    const themeNames = (p.themes || []).map(t => this.themeLabels[t] || t);
    const themeTags = themeNames
      .map(t => `<span class="tag tag--navy">${window.escapeHTML(t)}</span>`).join("");

    const searchText = [
      p.title, venueLine, ...themeNames, ...(p.keywords || []),
      ...p.authors.map(a => a.name)
    ].join(" ").toLowerCase();

    const el = document.createElement("article");
    el.className = "pub reveal";
    el.dataset.type = p.type;
    el.dataset.status = p.status;
    el.dataset.themes = (p.themes || []).join(" ");
    el.dataset.search = searchText;
    el.innerHTML = `
      <div class="pub__top">${badges.join("")}</div>
      <h3 class="pub__title">${window.escapeHTML(p.title)}</h3>
      <p class="pub__authors">${this.authorsHTML(p.authors)}</p>
      <p class="pub__venue">${window.escapeHTML(venueLine)}
         <span class="year">${p.year}</span>${meta ? " · " + window.escapeHTML(meta) : ""}${note}</p>
      ${p.abstract ? `<p class="pub__abstract">${window.escapeHTML(p.abstract)}</p>` : ""}
      ${themeTags ? `<div class="pub__keywords">${themeTags}</div>` : ""}
      ${keywords ? `<div class="pub__keywords">${keywords}</div>` : ""}
      <div class="pub__actions">${actions.join("")}</div>
      <pre class="pub__bibtex">${window.escapeHTML(this.bibtex(p))}</pre>`;

    // Wire interactive actions
    el.querySelector('[data-action="abstract"]')
      ?.addEventListener("click", () => el.classList.toggle("is-expanded"));
    el.querySelector('[data-action="bibtex"]')
      ?.addEventListener("click", () =>
        el.querySelector(".pub__bibtex").classList.toggle("is-open"));
    el.querySelector('[data-action="cite"]')
      ?.addEventListener("click", (e) => {
        const txt = this.citationString(p);
        navigator.clipboard?.writeText(txt);
        const btn = e.currentTarget;
        const original = btn.textContent;
        btn.textContent = "Copied ✓";
        setTimeout(() => (btn.textContent = original), 1400);
      });

    return el;
  },

  render() {
    const list = document.getElementById("pub-list");
    list.innerHTML = "";
    const frag = document.createDocumentFragment();
    this.data.forEach(p => frag.appendChild(this.card(p)));
    list.appendChild(frag);
    requestAnimationFrame(() =>
      list.querySelectorAll(".reveal").forEach(n => n.classList.add("is-visible")));
  },

  updateStats() {
    const total = this.data.length;
    const journals = this.data.filter(p => p.type === "journal").length;
    const conferences = this.data.filter(p => p.type === "conference").length;
    const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    set("stat-total", total);
    set("stat-journal", journals);
    set("stat-conference", conferences);
  }
};

document.addEventListener("DOMContentLoaded", () => PUB.init());
window.PUB = PUB;
