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

export const health = () => ({
  ok: true,
  service: "nativefragments-demo-worker-api",
});

// Representative payloads rendered into the docs response preview so the panel
// is fully server-rendered (SSR/CSR parity) instead of waiting on a fetch.
export const sampleResponses = {
  get health() {
    return health();
  },
  get summary() {
    return summary();
  },
};
