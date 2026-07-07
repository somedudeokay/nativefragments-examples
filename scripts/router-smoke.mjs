import assert from "node:assert/strict";
import { spawn, spawnSync } from "node:child_process";
import { createServer } from "node:http";
import { existsSync, readFileSync, rmSync } from "node:fs";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createCloudflareHandler } from "@nativefragments/core/cloudflare";
import { html, redirect, route } from "@nativefragments/core/server";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = new Map(
  process.argv.slice(2).flatMap((arg) => {
    if (!arg.startsWith("--")) return [];
    const [key, value = "true"] = arg.slice(2).split("=");
    return [[key, value]];
  }),
);

const appPort = Number(args.get("app-port") ?? process.env.ROUTER_SMOKE_APP_PORT ?? 8891);
const browserPort = Number(args.get("browser-port") ?? process.env.ROUTER_SMOKE_DEBUG_PORT ?? 9239);
const origin = `http://127.0.0.1:${appPort}`;
const chromeBin = args.get("chrome") ?? process.env.CHROME_BIN;
const routerPath = join(root, "apps/form-wizard/public/nativefragments/router.js");
let visiblePrefetches = 0;
let nonHtmlFragmentRequests = 0;

const sleep = (ms) => new Promise((resolveSleep) => setTimeout(resolveSleep, ms));

const findChrome = () => {
  const candidates = [
    chromeBin,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    "google-chrome",
    "chromium",
    "chromium-browser",
    "chrome",
    "msedge",
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (candidate.includes("/") && existsSync(candidate)) return candidate;
    if (!candidate.includes("/")) {
      const found = spawnSync("which", [candidate], { encoding: "utf8" });
      if (found.status === 0) return found.stdout.trim();
    }
  }

  throw new Error("Could not find Chrome. Set CHROME_BIN or pass --chrome=/path/to/chrome.");
};

const getJson = async (url, init) => {
  const response = await fetch(url, init);
  if (!response.ok) throw new Error(`${response.status} ${response.statusText} for ${url}`);
  return response.json();
};

const waitForExit = (processHandle, timeout = 2500) =>
  new Promise((resolveExit) => {
    if (processHandle.exitCode != null || processHandle.signalCode != null) {
      resolveExit();
      return;
    }
    const timer = setTimeout(resolveExit, timeout);
    processHandle.once("exit", () => {
      clearTimeout(timer);
      resolveExit();
    });
  });

const waitForDebugPort = async (port) => {
  const endpoint = `http://127.0.0.1:${port}/json/version`;
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try {
      return await getJson(endpoint);
    } catch {
      await sleep(125);
    }
  }
  throw new Error(`Chrome did not open DevTools on port ${port}`);
};

class CdpSession {
  constructor(url) {
    this.id = 0;
    this.pending = new Map();
    this.events = new Map();
    this.socket = new WebSocket(url);
    this.ready = new Promise((resolveReady, rejectReady) => {
      this.socket.addEventListener("open", resolveReady, { once: true });
      this.socket.addEventListener("error", rejectReady, { once: true });
    });
    this.socket.addEventListener("message", (event) => this.onMessage(event));
  }

  onMessage(event) {
    const message = JSON.parse(event.data);
    if (message.id) {
      const item = this.pending.get(message.id);
      if (!item) return;
      this.pending.delete(message.id);
      if (message.error) item.reject(new Error(message.error.message));
      else item.resolve(message.result ?? {});
      return;
    }

    const listeners = this.events.get(message.method) ?? [];
    for (const listener of listeners) listener(message.params ?? {});
  }

  async send(method, params = {}) {
    await this.ready;
    const id = (this.id += 1);
    const promise = new Promise((resolveSend, rejectSend) => {
      this.pending.set(id, { resolve: resolveSend, reject: rejectSend });
    });
    this.socket.send(JSON.stringify({ id, method, params }));
    return promise;
  }

  close() {
    this.socket.close();
  }
}

const evalInPage = async (session, expression) => {
  const result = await session.send("Runtime.evaluate", {
    awaitPromise: true,
    expression,
    returnByValue: true,
  });
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.text ?? "Runtime evaluation failed");
  }
  return result.result.value;
};

const waitFor = async (fn, message, timeout = 5000) => {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    if (await fn()) return;
    await sleep(100);
  }
  throw new Error(message);
};

const navigateDocument = async (session, url, message = "document navigation failed") => {
  const expected = new URL(url);
  await session.send("Page.navigate", { url });
  await waitFor(
    () =>
      evalInPage(
        session,
        `document.readyState === 'complete' && location.href === ${JSON.stringify(expected.href)}`,
      ),
    message,
  );
};

const page = (title, body) => html`<section class="page">
  <nav>
    <a id="home-link" href="/">Home</a>
    <a id="same-hash" href="#anchor-target">Hash</a>
    <a id="cross-hash" href="/page#deep-target">Cross hash</a>
    <a id="asset-link" href="/plain-export">Export</a>
    <a id="visible-page" href="/with-visible">Visible prefetch page</a>
    <a id="redirect-link" href="/redirect-source">Redirect</a>
  </nav>
  <h1>${title}</h1>
  ${body}
</section>`;

const tallBlock = () => html`<div style="height: 1400px"></div>`;

const routes = [
  route("/", {
    render: () => page("Router smoke", html`
      <form id="search-form" action="/search" method="get" data-fragment-form>
        <input name="q" value="native fragments" />
        <button type="submit" name="mode" value="fast">Search</button>
      </form>
      ${tallBlock()}
      <h2 id="anchor-target">Anchor target</h2>
    `),
  }),
  route("/page", {
    render: () => page("Hash page", html`${tallBlock()}<h2 id="deep-target">Deep target</h2>`),
  }),
  route("/with-visible", {
    render: () => page("Visible page", html`
      ${tallBlock()}
      <a id="visible-prefetch-link" href="/prefetched" data-fragment-prefetch="visible">Prefetch me</a>
    `),
  }),
  route("/prefetched", {
    render: () => page("Prefetched", html`<p>Prefetched route</p>`),
  }),
  route("/search", {
    render: ({ query }) => page("Search", html`<p id="query-result">${query.get("q")}</p>`),
  }),
  route("/plain-export", {
    render: () =>
      new Response("name,count\nnative-fragments,1\n", {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      }),
  }),
  route("/redirect-source", {
    render: () => redirect("/final#done"),
  }),
  route("/final", {
    render: () => page("Final", html`${tallBlock()}<h2 id="done">Redirect target</h2>`),
  }),
];

const shell = ({ body, meta }) => html`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${meta.title || "Router smoke"}</title>
    <script type="module">
      import { installFragmentNavigation } from "/nativefragments/router.js";
      window.__nfAfter = [];
      installFragmentNavigation({
        prefetch: "none",
        viewTransitions: false,
        afterNavigate(event) {
          window.__nfAfter.push({ href: event.url.href, slot: event.slot });
        },
      });
    </script>
  </head>
  <body>
    <main id="content-slot">${body}</main>
  </body>
</html>`;

const app = createCloudflareHandler({ routes, shell });

const MIME = {
  ".csv": "text/csv; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
};

const env = {
  ASSETS: {
    async fetch(request) {
      const url = new URL(request.url);
      if (url.pathname === "/nativefragments/router.js") {
        return new Response(readFileSync(routerPath), {
          headers: { "Content-Type": MIME[".js"] },
        });
      }
      if (url.pathname === "/export.csv") {
        return new Response("name,count\nnative-fragments,1\n", {
          headers: { "Content-Type": MIME[".csv"] },
        });
      }
      return new Response("Not found", { status: 404 });
    },
  },
};

const ctx = { passThroughOnException() {}, waitUntil() {} };

const server = createServer(async (req, res) => {
  try {
    if (req.url?.startsWith("/__prefetch-count")) {
      res.setHeader("content-type", "application/json");
      res.end(JSON.stringify({ visiblePrefetches }));
      return;
    }

    const hasBody = req.method !== "GET" && req.method !== "HEAD";
    let body;
    if (hasBody) {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      body = chunks.length ? Buffer.concat(chunks) : undefined;
    }
    const request = new Request(`${origin}${req.url}`, {
      headers: req.headers,
      method: req.method,
      body,
    });
    if (
      request.headers.get("x-fragment") === "true" &&
      new URL(request.url).pathname === "/prefetched"
    ) {
      visiblePrefetches += 1;
    }
    if (
      request.headers.get("x-fragment") === "true" &&
      new URL(request.url).pathname === "/plain-export"
    ) {
      nonHtmlFragmentRequests += 1;
    }
    const response = await app.fetch(request, env, ctx);
    res.statusCode = response.status;
    response.headers.forEach((value, key) => res.setHeader(key, value));
    res.end(Buffer.from(await response.arrayBuffer()));
  } catch (error) {
    res.statusCode = 500;
    res.end(String(error?.stack ?? error));
  }
});

const listen = () =>
  new Promise((resolveListen) => {
    server.listen(appPort, "127.0.0.1", resolveListen);
  });

const closeServer = () =>
  new Promise((resolveClose) => server.close(resolveClose));

const run = async () => {
  await listen();
  const userDataDir = mkdtempSync(join(tmpdir(), "nativefragments-router-smoke-"));
  const chrome = spawn(findChrome(), [
    "--headless=new",
    "--disable-background-networking",
    "--disable-dev-shm-usage",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    `--remote-debugging-port=${browserPort}`,
    `--user-data-dir=${userDataDir}`,
    "about:blank",
  ], { stdio: ["ignore", "ignore", "pipe"] });

  try {
    await waitForDebugPort(browserPort);
    const target = await getJson(
      `http://127.0.0.1:${browserPort}/json/new?${encodeURIComponent(origin)}`,
      { method: "PUT" },
    );
    const session = new CdpSession(target.webSocketDebuggerUrl);
    await session.send("Page.enable");
    await session.send("Runtime.enable");
    await session.send("Emulation.setDeviceMetricsOverride", {
      deviceScaleFactor: 1,
      height: 700,
      mobile: false,
      width: 1000,
    });
    await navigateDocument(session, origin, "page did not load");

    await evalInPage(session, "document.getElementById('same-hash').click()");
    await waitFor(() => evalInPage(session, "location.hash === '#anchor-target'"), "hash link did not update hash");
    assert.equal(await evalInPage(session, "window.__nfAfter.length"), 0);
    assert.ok(await evalInPage(session, "window.scrollY > 500"));

    await evalInPage(session, "history.back()");
    await waitFor(() => evalInPage(session, "location.hash === ''"), "hash back did not clear the hash");
    await waitFor(() => evalInPage(session, "window.scrollY < 100"), "hash back did not restore scroll");
    await evalInPage(session, "history.forward()");
    await waitFor(() => evalInPage(session, "location.hash === '#anchor-target'"), "hash forward did not restore the hash");
    await waitFor(() => evalInPage(session, "window.scrollY > 500"), "hash forward did not scroll to the anchor");

    await evalInPage(session, "document.getElementById('cross-hash').click()");
    await waitFor(() => evalInPage(session, "location.pathname === '/page' && location.hash === '#deep-target'"), "cross-page hash did not navigate");
    assert.ok(await evalInPage(session, "window.scrollY > 500"));

    await evalInPage(session, "window.scrollTo(0, 321)");
    await evalInPage(session, "document.getElementById('visible-page').click()");
    await waitFor(() => evalInPage(session, "location.pathname === '/with-visible'"), "visible page did not navigate");
    await evalInPage(session, "window.scrollTo(0, document.body.scrollHeight)");
    await waitFor(
      async () => (await getJson(`${origin}/__prefetch-count`)).visiblePrefetches > 0,
      "visible link did not prefetch after fragment navigation",
    );

    await evalInPage(session, "history.back()");
    await waitFor(() => evalInPage(session, "location.pathname === '/page'"), "back did not restore previous route");
    assert.ok(await evalInPage(session, "Math.abs(window.scrollY - 321) < 80"));

    await navigateDocument(session, origin, "home reload failed");
    await evalInPage(session, "document.querySelector('#search-form input').value = 'query smoke'");
    await evalInPage(session, "document.getElementById('search-form').requestSubmit(document.querySelector('#search-form button'))");
    await waitFor(() => evalInPage(session, "location.pathname === '/search' && location.search === '?q=query+smoke&mode=fast'"), "GET form did not fragment navigate");
    assert.equal(await evalInPage(session, "document.getElementById('query-result').textContent"), "query smoke");

    await navigateDocument(session, origin, "home reload failed");
    await evalInPage(session, "document.getElementById('redirect-link').click()");
    await waitFor(() => evalInPage(session, "location.pathname === '/final' && location.hash === '#done'"), "redirect did not update final URL");
    assert.ok(await evalInPage(session, "window.scrollY > 500"));

    await navigateDocument(session, origin, "home reload failed");
    await evalInPage(session, "document.getElementById('asset-link').click()");
    await waitFor(
      () => evalInPage(session, "location.pathname === '/plain-export'"),
      "non-HTML asset did not fall back to document navigation",
    ).catch(async (error) => {
      const state = await evalInPage(
        session,
        `JSON.stringify({
          href: location.href,
          afterNavigate: window.__nfAfter?.length ?? null,
          body: document.body.textContent.slice(0, 120),
          nonHtmlFragmentRequests: ${nonHtmlFragmentRequests}
        })`,
      );
      throw new Error(`${error.message}: ${state}`);
    });
    assert.match(
      await evalInPage(session, "document.body.textContent"),
      /native-fragments,1/,
    );
    assert.equal(nonHtmlFragmentRequests, 1);

    session.close();
    await getJson(`http://127.0.0.1:${browserPort}/json/close/${target.id}`).catch(() => {});
    console.log("router smoke passed");
  } finally {
    chrome.kill("SIGTERM");
    await waitForExit(chrome);
    rmSync(userDataDir, { force: true, recursive: true });
    await closeServer();
  }
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
