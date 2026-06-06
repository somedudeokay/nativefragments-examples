import { createCloudflareHandler } from "@nativefragments/core/cloudflare";
import { routes } from "./site/routes.js";
import { shell } from "./site/shell.js";

const app = createCloudflareHandler({
  routes,
  shell,
});

export default {
  fetch(request, env, context) {
    return app.fetch(request, env, context);
  },
};
