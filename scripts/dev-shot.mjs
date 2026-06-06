// Dev-only: render an example app through its Worker handler in Node, serve its
// public assets, load it in headless Chrome, and capture a full-page PNG.
// Used to visually verify redesigns locally without deploying.
//
//   node scripts/dev-shot.mjs --apps=todo-app,worker-api --out=/tmp/nf-shots
//   node scripts/dev-shot.mjs            # all apps, default out dir
import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { existsSync, mkdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve, extname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { examples } from "./examples.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = new Map(
  process.argv.slice(2).flatMap((arg) => {
    if (!arg.startsWith("--")) return [];
    const body = arg.slice(2);
    const eq = body.indexOf("=");
    if (eq === -1) return [[body, "true"]];
    // Split on the FIRST "=" only so values may contain "=" (e.g. ?filter=x).
    return [[body.slice(0, eq), body.slice(eq + 1)]];
  }),
);

const width = Number(args.get("width") ?? 1280);
const viewportHeight = Number(args.get("height") ?? 900);
const fullPage = args.get("full") !== "false";
const format = args.get("format") ?? "png";
const quality = Number(args.get("quality") ?? 82);
const outDir = resolve(args.get("out") ?? "/tmp/nf-shots");
const only = args.get("apps")?.split(",").map((s) => s.trim()).filter(Boolean);
const routePath = args.get("path") ?? "/";
const appList = (only?.length ? examples.filter((e) => only.includes(e.slug)) : examples);

const MIME = {
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const makeAssets = (publicDir) => ({
  async fetch(request) {
    const url = new URL(request.url);
    let p = decodeURIComponent(url.pathname);
    if (p.endsWith("/")) p += "index.html";
    const filePath = join(publicDir, p);
    if (!filePath.startsWith(publicDir) || !existsSync(filePath) || statSync(filePath).isDirectory()) {
      return new Response("Not found", { status: 404 });
    }
    const body = readFileSync(filePath);
    return new Response(body, {
      status: 200,
      headers: { "Content-Type": MIME[extname(filePath)] ?? "application/octet-stream" },
    });
  },
});

const startAppServer = async (app) => {
  const appDir = join(root, "apps", app.slug);
  const worker = (await import(pathToFileURL(join(appDir, "worker.js")).href)).default;
  const env = { ASSETS: makeAssets(join(appDir, "public")) };
  const ctx = { waitUntil() {}, passThroughOnException() {} };

  const server = createServer(async (req, res) => {
    try {
      const reqUrl = `http://127.0.0.1${req.url}`;
      const request = new Request(reqUrl, { method: req.method, headers: req.headers });
      const response = await worker.fetch(request, env, ctx);
      res.statusCode = response.status;
      response.headers.forEach((v, k) => res.setHeader(k, v));
      const buf = Buffer.from(await response.arrayBuffer());
      res.end(buf);
    } catch (err) {
      res.statusCode = 500;
      res.end(String(err?.stack ?? err));
    }
  });
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  const port = server.address().port;
  return { server, port };
};

// --- Minimal CDP client (mirrors scripts/update-screenshots.mjs) ---
const getJson = async (url, init) => {
  const res = await fetch(url, init);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return res.json();
};
const waitForDebugPort = async (port) => {
  for (let i = 0; i < 80; i += 1) {
    try { return await getJson(`http://127.0.0.1:${port}/json/version`); }
    catch { await sleep(125); }
  }
  throw new Error(`Chrome did not open DevTools on port ${port}`);
};
class Cdp {
  constructor(url) {
    this.id = 0; this.pending = new Map(); this.events = new Map();
    this.socket = new WebSocket(url);
    this.ready = new Promise((res, rej) => {
      this.socket.addEventListener("open", res, { once: true });
      this.socket.addEventListener("error", rej, { once: true });
    });
    this.socket.addEventListener("message", (e) => this.onMessage(e));
  }
  onMessage(event) {
    const m = JSON.parse(event.data);
    if (m.id) {
      const item = this.pending.get(m.id); if (!item) return;
      this.pending.delete(m.id);
      m.error ? item.reject(new Error(m.error.message)) : item.resolve(m.result ?? {});
      return;
    }
    for (const l of this.events.get(m.method) ?? []) l(m.params ?? {});
  }
  async send(method, params = {}) {
    await this.ready; const id = (this.id += 1);
    const p = new Promise((res, rej) => this.pending.set(id, { resolve: res, reject: rej }));
    this.socket.send(JSON.stringify({ id, method, params }));
    return p;
  }
  waitFor(method, timeout = 15000) {
    return new Promise((res, rej) => {
      const timer = setTimeout(() => rej(new Error(`Timed out: ${method}`)), timeout);
      const l = (params) => { clearTimeout(timer); res(params); };
      this.events.set(method, [...(this.events.get(method) ?? []), l]);
    });
  }
  close() { this.socket.close(); }
}

const findChrome = () => {
  const c = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  if (existsSync(c)) return c;
  throw new Error("Set CHROME_BIN");
};

const main = async () => {
  mkdirSync(outDir, { recursive: true });
  // Unique-ish port so concurrent runs (e.g. parallel agents) don't collide.
  const browserPort = Number(args.get("port") ?? 9300 + (process.pid % 250));
  const userDataDir = mkdtempSync(join(tmpdir(), "nf-devshot-"));
  const chrome = spawn(findChrome(), [
    "--headless=new", "--hide-scrollbars", "--disable-gpu", "--no-first-run",
    "--no-default-browser-check", "--disable-dev-shm-usage",
    `--remote-debugging-port=${browserPort}`, `--user-data-dir=${userDataDir}`, "about:blank",
  ], { stdio: ["ignore", "ignore", "pipe"] });
  chrome.stderr.on("data", (c) => { if (process.env.DEBUG_SHOTS) process.stderr.write(c); });

  try {
    await waitForDebugPort(browserPort);
    for (const app of appList) {
      const { server, port } = await startAppServer(app);
      const localUrl = `http://127.0.0.1:${port}${routePath}`;
      try {
        const target = await getJson(
          `http://127.0.0.1:${browserPort}/json/new?${encodeURIComponent(localUrl)}`,
          { method: "PUT" },
        );
        const session = new Cdp(target.webSocketDebuggerUrl);
        const load = session.waitFor("Page.loadEventFired");
        await session.send("Page.enable");
        await session.send("Runtime.enable");
        await session.send("Emulation.setDeviceMetricsOverride", {
          deviceScaleFactor: 1, mobile: false, width, height: viewportHeight,
        });
        await session.send("Page.navigate", { url: localUrl });
        await load;
        await session.send("Runtime.evaluate", {
          awaitPromise: true,
          expression: "document.fonts?.ready ?? Promise.resolve()",
        });
        await sleep(700);

        let clip;
        if (fullPage) {
          const { result } = await session.send("Runtime.evaluate", {
            returnByValue: true,
            expression: "Math.min(document.documentElement.scrollHeight, 6000)",
          });
          clip = { x: 0, y: 0, width, height: result.value || viewportHeight, scale: 1 };
        }
        const shot = await session.send("Page.captureScreenshot", {
          format, fromSurface: true, captureBeyondViewport: fullPage,
          ...(format === "png" ? {} : { quality }),
          ...(clip ? { clip } : {}),
        });
        const outPath = join(outDir, `${app.slug}.${format}`);
        writeFileSync(outPath, Buffer.from(shot.data, "base64"));
        console.log(`wrote ${outPath}`);
        session.close();
        await getJson(`http://127.0.0.1:${browserPort}/json/close/${target.id}`).catch(() => {});
      } finally {
        server.close();
      }
    }
  } finally {
    chrome.kill("SIGTERM");
    await sleep(300);
    rmSync(userDataDir, { force: true, recursive: true });
  }
};

main().catch((e) => { console.error(e); process.exit(1); });
