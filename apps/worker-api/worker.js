import { createCloudflareHandler } from "@nativefragments/core/cloudflare";
import { api } from "./site/api.js";
import { routes } from "./site/routes.js";
import { shell } from "./site/shell.js";

export default createCloudflareHandler({
  api,
  routes,
  shell,
});
