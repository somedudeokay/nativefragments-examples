import { installFragmentNavigation } from "/nativefragments/router.js";

const labels = new Map([
  ["/", "Profile"],
  ["/settings/profile", "Profile"],
  ["/settings/security", "Security"],
  ["/settings/notifications", "Notifications"],
  ["/settings/billing", "Billing"],
]);

const canonicalPath = () =>
  window.location.pathname === "/" ? "/settings/profile" : window.location.pathname;

export const syncSettingsNavigation = () => {
  const path = canonicalPath();

  for (const link of document.querySelectorAll("[data-settings-link]")) {
    const active = new URL(link.href).pathname === path;
    link.classList.toggle("is-active", active);

    if (active) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  }

  const label = document.querySelector("[data-current-panel-label]");
  if (label) label.textContent = labels.get(path) ?? "Profile";
};

installFragmentNavigation({
  afterNavigate: syncSettingsNavigation,
});

syncSettingsNavigation();
