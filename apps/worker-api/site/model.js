export const endpoints = [
  {
    method: "GET",
    path: "/api/health",
    purpose: "Liveness check with no framework router dependency.",
  },
  {
    method: "GET",
    path: "/api/summary",
    purpose: "JSON payload sourced from the same model as the HTML page.",
  },
];

export const summary = () => ({
  dependencies: ["@nativefragments/core"],
  endpoints: endpoints.length,
  runtime: "Cloudflare Workers",
  testRunner: "node:test",
});
