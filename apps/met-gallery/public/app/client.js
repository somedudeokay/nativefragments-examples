import { installFragmentNavigation } from "/nativefragments/router.js";

// Client-side fragment navigation: topic switches swap only #content-slot, so
// the shell (and the sticky stream dock) persist — open stays open. Switches use
// the buffered fragment path, so afterNavigate marks the dock rows accordingly
// (the live cascade plays on first load / hard refresh).
installFragmentNavigation({
  prefetch: "intent",
  afterNavigate() {
    window.__nfStreamMarkBuffered?.();
  },
});
