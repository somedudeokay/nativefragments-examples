import { createCloudflareHandler } from "@nativefragments/core/cloudflare";
import { routes } from "./site/routes.js";
import { shell } from "./site/shell.js";

const app = createCloudflareHandler({
  contentSecurityPolicy: ({ nonce }) =>
    [
      "default-src 'self'",
      "base-uri 'none'",
      "object-src 'none'",
      "frame-ancestors 'none'",
      `script-src 'self' 'nonce-${nonce}'`,
      "style-src 'self'",
      "img-src 'self' data: https://www.artic.edu",
    ].join("; "),
  routes,
  shell,
});

export default {
  fetch(request, env, context) {
    return app.fetch(request, env, context);
  },
};
