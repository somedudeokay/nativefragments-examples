// Dev-only: serve one example app locally through its Worker handler, with its
// public/ assets, on a fixed port. Stays running until killed (Ctrl-C / SIGTERM).
// Lets you preview or audit an app (e.g. Lighthouse) without `wrangler dev`.
//
//   node scripts/serve-app.mjs --app=todo-app --port=8799
import { createServer } from "node:http";
import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = new Map(
  process.argv.slice(2).flatMap((a) => {
    if (!a.startsWith("--")) return [];
    const b = a.slice(2);
    const i = b.indexOf("=");
    return i === -1 ? [[b, "true"]] : [[b.slice(0, i), b.slice(i + 1)]];
  }),
);

const app = args.get("app");
const port = Number(args.get("port") ?? 8799);
if (!app) {
  console.error("Usage: node scripts/serve-app.mjs --app=<slug> [--port=8799]");
  process.exit(1);
}

const MIME = {
  ".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".html": "text/html; charset=utf-8",
  ".json": "application/json; charset=utf-8", ".svg": "image/svg+xml",
  ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg",
  ".ico": "image/x-icon", ".woff2": "font/woff2", ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};

const appDir = join(root, "apps", app);
const publicDir = join(appDir, "public");
const worker = (await import(pathToFileURL(join(appDir, "worker.js")).href)).default;
const env = {
  ASSETS: {
    async fetch(request) {
      const url = new URL(request.url);
      let p = decodeURIComponent(url.pathname);
      if (p.endsWith("/")) p += "index.html";
      const filePath = join(publicDir, p);
      if (!filePath.startsWith(publicDir) || !existsSync(filePath) || statSync(filePath).isDirectory()) {
        return new Response("Not found", { status: 404 });
      }
      return new Response(readFileSync(filePath), {
        status: 200,
        headers: { "Content-Type": MIME[extname(filePath)] ?? "application/octet-stream" },
      });
    },
  },
};
const ctx = { waitUntil() {}, passThroughOnException() {} };

const server = createServer(async (req, res) => {
  try {
    const request = new Request(`http://127.0.0.1:${port}${req.url}`, {
      method: req.method,
      headers: req.headers,
    });
    const response = await worker.fetch(request, env, ctx);
    res.statusCode = response.status;
    response.headers.forEach((v, k) => res.setHeader(k, v));
    res.end(Buffer.from(await response.arrayBuffer()));
  } catch (err) {
    res.statusCode = 500;
    res.end(String(err?.stack ?? err));
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`serving ${app} at http://127.0.0.1:${port}`);
});
