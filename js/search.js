/* ==========================================================================
   search.js  |  Publication search & filter
   --------------------------------------------------------------------------
   Operates on the cards rendered by publications.js using their data-* hooks
   (data-type, data-status, data-search). Filtering is done by toggling card
   visibility without re-rendering, so it scales to hundreds of entries cheaply.
   ========================================================================== */

window.PubSearch = {
  state: { query: "", filter: "all" },

  init() {
    const search = document.getElementById("pub-search");
    const filters = document.getElementById("pub-filters");
    if (!search && !filters) return;

    if (search) {
      search.addEventListener("input", (e) => {
        this.state.query = e.target.value.trim().toLowerCase();
        this.apply();
      });
    }

    if (filters) {
      filters.addEventListener("click", (e) => {
        const btn = e.target.closest(".filter-btn");
        if (!btn) return;
        filters.querySelectorAll(".filter-btn")
          .forEach(b => b.classList.toggle("is-active", b === btn));
        this.state.filter = btn.dataset.filter;
        this.apply();
      });
    }

    this.apply();
  },

  matchesFilter(card) {
    const f = this.state.filter;
    if (f === "all") return true;
    if (f === "journal" || f === "conference") return card.dataset.type === f;
    if (f === "published" || f === "under-review" || f === "accepted")
      return card.dataset.status === f;
    if (f in { "single-arm": 1, "dual-arm-planning": 1, "rl": 1 })
      return (card.dataset.themes || "").split(" ").includes(f);
    return true;
  },

  apply() {
    const cards = document.querySelectorAll("#pub-list .pub");
    let shown = 0;
    cards.forEach(card => {
      const okText = !this.state.query ||
        card.dataset.search.includes(this.state.query);
      const okFilter = this.matchesFilter(card);
      const visible = okText && okFilter;
      card.style.display = visible ? "" : "none";
      if (visible) shown++;
    });

    const count = document.getElementById("pub-count");
    if (count) {
      count.textContent = shown === cards.length
        ? `Showing all ${cards.length} publications`
        : `Showing ${shown} of ${cards.length} publications`;
    }

    const empty = document.getElementById("pub-empty");
    if (empty) empty.style.display = shown === 0 ? "block" : "none";
  }
};
