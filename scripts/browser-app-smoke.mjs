import { createNodeHandler } from "@nativefragments/create-app/http";
import assert from "node:assert/strict";
import { spawn, spawnSync } from "node:child_process";
import { createServer } from "node:http";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const webOrigin = process.env.NF_WEB_ORIGIN ?? "http://127.0.0.1:8787";
const docsOrigin = process.env.NF_DOCS_ORIGIN ?? "http://127.0.0.1:8788";
const metOrigin = process.env.NF_MET_ORIGIN ?? "http://127.0.0.1:8789";
const scaffoldOrigin = process.env.NF_SCAFFOLD_ORIGIN ?? "http://127.0.0.1:8790";
const browserPort = Number(process.env.NF_BROWSER_PORT ?? 9241);
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const findChrome = () => {
  const candidates = [
    process.env.CHROME_BIN,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "google-chrome",
    "chromium",
  ].filter(Boolean);
  for (const candidate of candidates) {
    if (candidate.includes("/") && existsSync(candidate)) return candidate;
    if (!candidate.includes("/")) {
      const found = spawnSync("which", [candidate], { encoding: "utf8" });
      if (found.status === 0) return found.stdout.trim();
    }
  }
  throw new Error("Chrome not found. Set CHROME_BIN.");
};

const getJson = async (url, init) => {
  const response = await fetch(url, init);
  if (!response.ok) throw new Error(`${response.status} for ${url}`);
  return response.json();
};

const waitForDebugPort = async () => {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try {
      return await getJson(`http://127.0.0.1:${browserPort}/json/version`);
    } catch {
      await sleep(125);
    }
  }
  throw new Error("Chrome DevTools port did not open");
};

class CdpSession {
  constructor(url) {
    this.id = 0;
    this.pending = new Map();
    this.listeners = new Map();
    this.socket = new WebSocket(url);
    this.ready = new Promise((resolve, reject) => {
      this.socket.addEventListener("open", resolve, { once: true });
      this.socket.addEventListener("error", reject, { once: true });
    });
    this.socket.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (message.id) {
        const pending = this.pending.get(message.id);
        if (!pending) return;
        this.pending.delete(message.id);
        if (message.error) pending.reject(new Error(message.error.message));
        else pending.resolve(message.result ?? {});
        return;
      }
      for (const listener of this.listeners.get(message.method) ?? []) {
        listener(message.params ?? {});
      }
    });
  }

  on(method, listener) {
    const listeners = this.listeners.get(method) ?? [];
    listeners.push(listener);
    this.listeners.set(method, listeners);
  }

  async send(method, params = {}) {
    await this.ready;
    const id = ++this.id;
    const promise = new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
    });
    this.socket.send(JSON.stringify({ id, method, params }));
    return promise;
  }

  close() {
    this.socket.close();
  }
}

const evaluate = async (session, expression) => {
  const result = await session.send("Runtime.evaluate", {
    awaitPromise: true,
    expression,
    returnByValue: true,
  });
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.exception?.description ?? result.exceptionDetails.text);
  }
  return result.result.value;
};

const waitFor = async (condition, message, timeout = 12_000) => {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    if (await condition()) return;
    await sleep(80);
  }
  throw new Error(message);
};

const navigate = async (session, href) => {
  await session.send("Page.navigate", { url: href });
  await waitFor(
    () => evaluate(session, `document.readyState === "complete" && location.href === ${JSON.stringify(new URL(href).href)}`),
    `Page did not load: ${href}`,
  );
};

const headersLower = (headers) =>
  Object.fromEntries(Object.entries(headers ?? {}).map(([name, value]) => [name.toLowerCase(), String(value)]));

const mime = {
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

const startAppBridge = async (name, port) => {
  const appRoot = resolve(root, "apps", name);
  const publicRoot = resolve(appRoot, "public");
  const worker = (await import(new URL(`../apps/${name}/worker.js`, import.meta.url))).default;
  const origin = `http://127.0.0.1:${port}`;
  const env = {
    ASSETS: {
      async fetch(request) {
        const pathname = decodeURIComponent(new URL(request.url).pathname);
        const file = resolve(publicRoot, `.${pathname}`);
        if (!file.startsWith(`${publicRoot}/`)) return new Response("Not found", { status: 404 });
        try {
          return new Response(await readFile(file), {
            headers: { "Content-Type": mime[extname(file)] ?? "application/octet-stream" },
          });
        } catch {
          return new Response("Not found", { status: 404 });
        }
      },
    },
  };
  const server = createServer(createNodeHandler(request => worker.fetch(request, env, {})));
  await new Promise((resolveListen) => server.listen(port, "127.0.0.1", resolveListen));
  return { origin, server };
};

const run = async () => {
  const componentApps = await Promise.all([
    startAppBridge("analytics-dashboard", 8901),
    startAppBridge("command-palette", 8902),
    startAppBridge("signal-counter", 8903),
    startAppBridge("theme-switcher", 8904),
    startAppBridge("todo-app", 8905),
    startAppBridge("worker-search", 8906),
  ]);
  const profile = mkdtempSync(join(tmpdir(), "nativefragments-app-smoke-"));
  const chrome = spawn(findChrome(), [
    "--headless=new",
    "--disable-background-networking",
    "--disable-dev-shm-usage",
    "--disable-gpu",
    "--no-first-run",
    `--remote-debugging-port=${browserPort}`,
    `--user-data-dir=${profile}`,
    "about:blank",
  ], { stdio: "ignore" });

  try {
    await waitForDebugPort();
    const target = await getJson(
      `http://127.0.0.1:${browserPort}/json/new?${encodeURIComponent(webOrigin)}`,
      { method: "PUT" },
    );
    const session = new CdpSession(target.webSocketDebuggerUrl);
    const consoleErrors = [];
    const failedResponses = [];
    const fragmentRequests = [];

    session.on("Runtime.consoleAPICalled", ({ type, args }) => {
      if (type === "error") consoleErrors.push(args.map((arg) => arg.value ?? arg.description).join(" "));
    });
    session.on("Runtime.exceptionThrown", ({ exceptionDetails }) => {
      consoleErrors.push(exceptionDetails.exception?.description ?? exceptionDetails.text);
    });
    session.on("Network.responseReceived", ({ response }) => {
      if (response.status >= 400) failedResponses.push(`${response.status} ${response.url}`);
    });
    session.on("Network.requestWillBeSent", ({ request }) => {
      const headers = headersLower(request.headers);
      if (headers["x-fragment"] === "true") {
        fragmentRequests.push({ headers, url: request.url });
      }
    });

    await Promise.all([
      session.send("Page.enable"),
      session.send("Runtime.enable"),
      session.send("Network.enable"),
      session.send("Emulation.setDeviceMetricsOverride", {
        deviceScaleFactor: 1,
        height: 900,
        mobile: false,
        width: 1440,
      }),
    ]);

    await navigate(session, `${webOrigin}/`);
    assert.match(await evaluate(session, "document.querySelector('h1').textContent.replace(/\\s+/g, ' ').trim()"), /Fast applications\..*Explicit HTML\./);
    assert.equal(await evaluate(session, "Boolean(document.querySelector('nf-site-header')?.shadowRoot)"), true);
    assert.equal(await evaluate(session, "Boolean(document.querySelector('nf-runtime-map')?.shadowRoot)"), true);
    assert.equal(await evaluate(session, "document.documentElement.scrollWidth <= innerWidth"), true);
    await evaluate(session, "document.querySelector('nf-site-header').__smokeMarker = 1; document.querySelector('nf-site-header').shadowRoot.querySelector('a[href=\"/examples\"]').click()");
    await waitFor(() => evaluate(session, "location.pathname === '/examples'"), "Website fragment navigation failed");
    assert.equal(await evaluate(session, "document.querySelector('nf-site-header').__smokeMarker"), 1);
    assert.ok(fragmentRequests.some((request) => request.url.includes("/examples") && request.headers["x-nativefragments-protocol"] === "2"));

    await session.send("Emulation.setDeviceMetricsOverride", {
      deviceScaleFactor: 1,
      height: 844,
      mobile: true,
      width: 390,
    });
    await navigate(session, `${webOrigin}/`);
    assert.equal(await evaluate(session, "document.documentElement.scrollWidth <= innerWidth"), true);

    await session.send("Emulation.setDeviceMetricsOverride", {
      deviceScaleFactor: 1,
      height: 900,
      mobile: false,
      width: 1200,
    });
    await navigate(session, `${docsOrigin}/`);
    assert.equal(await evaluate(session, "Boolean(document.querySelector('docs-search')?.shadowRoot)"), true);
    await evaluate(session, "document.querySelector('a[href=\"/concepts/fragments\"]').click()");
    await waitFor(() => evaluate(session, "location.pathname === '/concepts/fragments'"), "Docs fragment navigation failed");
    assert.match(await evaluate(session, "document.querySelector('h1').textContent"), /Fragment Navigation/);
    assert.ok(fragmentRequests.some((request) => request.url.includes("/concepts/fragments") && request.headers["x-nativefragments-protocol"] === "2"));

    await navigate(session, `${metOrigin}/?topic=painting&fast=1`);
    await evaluate(session, `(() => {
      window.name = "";
      window.__nfSmokeEvents = [];
      window.__nfSawLoading = false;
      for (const type of ["navigation-start", "navigation-swap", "fragment-reveal", "navigation-complete", "navigation-error"]) {
        document.addEventListener("nativefragments:" + type, (event) => {
          window.__nfSmokeEvents.push({ type, fragmentId: event.detail.fragmentId ?? null });
          window.name += type + ":" + (event.detail.error?.message ?? "") + "|";
        });
      }
      new MutationObserver(() => {
        if (document.querySelector('[data-fragment-state="loading"]')) window.__nfSawLoading = true;
      }).observe(document.getElementById("content-slot"), { childList: true, subtree: true, attributes: true });
    })()`);
    await evaluate(session, "document.querySelector('a[href=\"/?topic=sculpture\"]').click()");
    await waitFor(
      () => evaluate(session, "location.search.includes('topic=sculpture')"),
      "Met navigation did not update the URL",
      20_000,
    );
    assert.equal(
      await evaluate(session, "Array.isArray(window.__nfSmokeEvents)"),
      true,
      `Met navigation reloaded or fell back: ${await evaluate(session, "window.name")}`,
    );
    await waitFor(() => evaluate(session, "window.__nfSmokeEvents.some((event) => event.type === 'navigation-complete')"), "Met streamed navigation did not complete", 20_000);
    assert.equal(await evaluate(session, "location.search.includes('topic=sculpture')"), true);
    assert.equal(await evaluate(session, "window.__nfSawLoading"), true);
    assert.ok(await evaluate(session, "window.__nfSmokeEvents.filter((event) => event.type === 'fragment-reveal').length >= 3"));
    assert.ok(fragmentRequests.some((request) => request.url.includes("topic=sculpture") && request.headers["x-nativefragments-protocol"] === "2"));
    assert.equal(await evaluate(session, "document.getElementById('content-slot').hasAttribute('aria-busy')"), false);

    await navigate(session, `${scaffoldOrigin}/`);
    assert.equal(await evaluate(session, "Boolean(document.querySelector('app-counter')?.shadowRoot)"), true);
    const before = await evaluate(session, "document.querySelector('app-counter').shadowRoot.querySelector('.value').textContent");
    await evaluate(session, "document.querySelector('app-counter').shadowRoot.querySelector('button').click()");
    await waitFor(
      () => evaluate(session, `document.querySelector('app-counter').shadowRoot.querySelector('.value').textContent !== ${JSON.stringify(before)}`),
      "Scaffold Lit counter did not hydrate",
    );

    await navigate(session, `${componentApps[0].origin}/`);
    assert.equal(await evaluate(session, "Boolean(document.querySelector('analytics-board')?.shadowRoot)"), true);
    await evaluate(session, "document.querySelector('analytics-board').shadowRoot.querySelector('[data-range=\"7d\"]').click()");
    await waitFor(() => evaluate(session, "document.querySelector('analytics-board').getAttribute('data-range') === '7d'"), "Analytics controls did not hydrate");

    await navigate(session, `${componentApps[1].origin}/`);
    await evaluate(session, `(() => {
      const input = document.querySelector("command-palette").shadowRoot.querySelector("input");
      input.value = "worker";
      input.dispatchEvent(new InputEvent("input", { bubbles: true, inputType: "insertText", data: "worker" }));
    })()`);
    await waitFor(() => evaluate(session, "document.querySelector('command-palette').shadowRoot.querySelectorAll('li').length === 1"), "Command palette did not filter");
    assert.equal(await evaluate(session, "document.querySelector('command-palette').shadowRoot.querySelector('input').value"), "worker");

    await navigate(session, `${componentApps[2].origin}/`);
    await evaluate(session, "document.querySelector('lit-counter').shadowRoot.querySelector('[data-action=\"increment\"]').click()");
    await waitFor(() => evaluate(session, "document.querySelector('lit-counter').getAttribute('count') === '1'"), "Lit counter did not update");

    await navigate(session, `${componentApps[3].origin}/`);
    await evaluate(session, "document.querySelector('theme-switcher').shadowRoot.querySelector('[data-theme-option=\"night\"]').click()");
    await waitFor(() => evaluate(session, "document.documentElement.dataset.theme === 'night'"), "Theme switcher did not update document tokens");

    await navigate(session, `${componentApps[4].origin}/`);
    const taskCount = await evaluate(session, "document.querySelector('todo-app').shadowRoot.querySelectorAll('.task').length");
    await evaluate(session, `(() => {
      const root = document.querySelector("todo-app").shadowRoot;
      const input = root.querySelector('input[name="title"]');
      input.value = "Browser smoke task";
      root.querySelector("form").requestSubmit();
    })()`);
    await waitFor(() => evaluate(session, `document.querySelector('todo-app').shadowRoot.querySelectorAll('.task').length > ${taskCount}`), "Todo element did not add a task");

    await navigate(session, `${componentApps[5].origin}/`);
    await evaluate(session, `(() => {
      const input = document.querySelector("worker-search-app").shadowRoot.querySelector("input");
      input.value = "Hoba";
      input.dispatchEvent(new InputEvent("input", { bubbles: true, inputType: "insertText", data: "Hoba" }));
    })()`);
    await waitFor(
      () => evaluate(session, "document.querySelector('worker-search-app').shadowRoot.querySelector('[data-search-status]').textContent.includes('matches')"),
      "Worker search did not return results",
    );

    const relevantFailures = failedResponses.filter((item) => !/favicon\.ico/.test(item));
    assert.deepEqual(consoleErrors, []);
    assert.deepEqual(relevantFailures, []);
    session.close();
    console.log(`browser app smoke passed (${fragmentRequests.length} fragment requests observed)`);
  } finally {
    chrome.kill("SIGTERM");
    await sleep(250);
    rmSync(profile, { recursive: true, force: true });
    await Promise.all(componentApps.map(({ server }) => new Promise((resolveClose) => server.close(resolveClose))));
  }
};

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
