import { startRouter } from "@nativefragments/core/client/router.js";

// Topic switches swap only #content-slot, so the shell and open stream dock
// persist while the next route's deferred fragments stream into place.
startRouter({
  prefetch: "intent",
});
