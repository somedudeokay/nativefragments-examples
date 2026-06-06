import { installFragmentNavigation } from "/nativefragments/router.js";
import "./components/analytics-board.js";

const normalizePath = (path) => path.replace(/\/+$/, "") || "/";

const syncSectionNavigation = () => {
  const path = normalizePath(window.location.pathname);

  for (const link of document.querySelectorAll("[data-section-nav]")) {
    const linkPath = normalizePath(new URL(link.href).pathname);
    if (linkPath === path) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  }
};

syncSectionNavigation();

installFragmentNavigation({
  afterNavigate() {
    syncSectionNavigation();
  },
});
