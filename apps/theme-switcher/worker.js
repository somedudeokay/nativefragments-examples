import { createCloudflareHandler } from "@nativefragments/core/cloudflare";
import { routes } from "./site/routes.js";
import { shell } from "./site/shell.js";

const app = createCloudflareHandler({
  routes,
  shell,
});

export default {
  fetch(request, env, context) {
    const url = new URL(request.url);

    if (url.hostname === "www.theme-switcher.nativefragments.org") {
      return Response.redirect(
        `https://theme-switcher.nativefragments.org${url.pathname}${url.search}`,
        301,
      );
    }

    return app.fetch(request, env, context);
  },
};
