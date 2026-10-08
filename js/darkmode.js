/* ==========================================================================
   darkmode.js  |  Theme management
   --------------------------------------------------------------------------
   Resolution order:  saved preference  →  system preference  →  light.
   The chosen theme is written to <html data-theme> and persisted.
   An inline guard in <head> (see HTML) applies the theme before paint to
   avoid a flash of the wrong theme.
   ========================================================================== */

(function () {
  const STORAGE_KEY = "sp_theme";
  const root = document.documentElement;

  function systemPrefersDark() {
    return window.matchMedia &&
           window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  function resolveInitial() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark") return saved;
    return systemPrefersDark() ? "dark" : "light";
  }

  function setTheme(theme, persist) {
    root.setAttribute("data-theme", theme);
    if (persist) localStorage.setItem(STORAGE_KEY, theme);
    updateToggle(theme);
  }

  function updateToggle(theme) {
    const btn = document.getElementById("theme-toggle");
    if (!btn || !window.ICONS) return;
    const isDark = theme === "dark";
    btn.innerHTML = isDark ? window.ICONS.sun : window.ICONS.moon;
    btn.setAttribute("aria-label",
      isDark ? "Switch to light theme" : "Switch to dark theme");
    btn.setAttribute("title",
      isDark ? "Light mode" : "Dark mode");
  }

  // Apply immediately (the <head> guard may already have set it).
  setTheme(resolveInitial(), false);

  // Wire up the toggle once the header exists.
  window.initThemeToggle = function () {
    const btn = document.getElementById("theme-toggle");
    if (!btn) return;
    updateToggle(root.getAttribute("data-theme") || "light");

    btn.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      // Smooth the transition, then remove the helper class.
      root.classList.add("theme-fade");
      setTheme(next, true);
      window.setTimeout(() => root.classList.remove("theme-fade"), 300);
    });
  };

  // Follow system changes only when the user hasn't chosen explicitly.
  if (window.matchMedia) {
    window.matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => {
        if (!localStorage.getItem(STORAGE_KEY)) {
          setTheme(e.matches ? "dark" : "light", false);
        }
      });
  }
})();
