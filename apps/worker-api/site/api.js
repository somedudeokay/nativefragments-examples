import { apiRoute, createApi } from "@nativefragments/core/server";
import { health, summary } from "./model.js";

const noStore = (data) =>
  Response.json(data, {
    headers: {
      "Cache-Control": "no-store",
    },
  });

export const api = createApi([
  apiRoute("GET", "/api/health", () => noStore(health())),
  apiRoute("GET", "/api/summary", () => noStore(summary())),
]);
