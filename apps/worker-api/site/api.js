import { summary } from "./model.js";

const json = (data, init = {}) =>
  Response.json(data, {
    headers: {
      "Cache-Control": "no-store",
      ...(init.headers ?? {}),
    },
    status: init.status ?? 200,
  });

export const api = {
  fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === "/api/health") {
      return json({
        ok: true,
        service: "nativefragments-demo-worker-api",
      });
    }

    if (url.pathname === "/api/summary") {
      return json(summary());
    }

    return json({ error: "Not found" }, { status: 404 });
  },
};
