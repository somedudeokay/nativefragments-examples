import { spawn, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { examples } from "./examples.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const defaultOutDir = join(root, "screenshots");
const defaultMirrorDir = resolve(root, "../nativefragments.org/public/app/screenshots");

const args = new Map(
  process.argv.slice(2).flatMap((arg) => {
    if (!arg.startsWith("--")) return [];
    const [key, value = "true"] = arg.slice(2).split("=");
    return [[key, value]];
  }),
);

const width = Number(args.get("width") ?? process.env.SCREENSHOT_WIDTH ?? 1280);
const height = Number(args.get("height") ?? process.env.SCREENSHOT_HEIGHT ?? 832);
const quality = Number(args.get("quality") ?? process.env.SCREENSHOT_QUALITY ?? 82);
const outDir = resolve(args.get("out") ?? process.env.SCREENSHOT_OUT_DIR ?? defaultOutDir);
const mirrorDir = args.get("mirror") === "false"
  ? null
  : resolve(args.get("mirror") ?? process.env.SCREENSHOT_MIRROR_DIR ?? defaultMirrorDir);
const chromeBin = args.get("chrome") ?? process.env.CHROME_BIN;

const sleep = (ms) => new Promise((resolveSleep) => setTimeout(resolveSleep, ms));

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

  waitFor(method, timeout = 15000) {
    return new Promise((resolveWait, rejectWait) => {
      const timer = setTimeout(() => {
        this.events.set(
          method,
          (this.events.get(method) ?? []).filter((item) => item !== listener),
        );
        rejectWait(new Error(`Timed out waiting for ${method}`));
      }, timeout);

      const listener = (params) => {
        clearTimeout(timer);
        this.events.set(
          method,
          (this.events.get(method) ?? []).filter((item) => item !== listener),
        );
        resolveWait(params);
      };

      this.events.set(method, [...(this.events.get(method) ?? []), listener]);
    });
  }

  close() {
    this.socket.close();
  }
}

const capture = async ({ browserPort, example }) => {
  const target = await getJson(
    `http://127.0.0.1:${browserPort}/json/new?${encodeURIComponent(example.url)}`,
    { method: "PUT" },
  );
  const session = new CdpSession(target.webSocketDebuggerUrl);
  const load = session.waitFor("Page.loadEventFired");

  await session.send("Page.enable");
  await session.send("Runtime.enable");
  await session.send("Emulation.setDeviceMetricsOverride", {
    deviceScaleFactor: 1,
    height,
    mobile: false,
    width,
  });
  await session.send("Page.navigate", { url: example.url });
  await load;
  await session.send("Runtime.evaluate", {
    awaitPromise: true,
    expression: "document.fonts?.ready ?? Promise.resolve()",
  });
  await sleep(600);

  const screenshot = await session.send("Page.captureScreenshot", {
    captureBeyondViewport: false,
    format: "webp",
    fromSurface: true,
    quality,
  });

  session.close();
  await getJson(`http://127.0.0.1:${browserPort}/json/close/${target.id}`).catch(() => {});

  return Buffer.from(screenshot.data, "base64");
};

const main = async () => {
  const browserPort = Number(args.get("port") ?? process.env.SCREENSHOT_DEBUG_PORT ?? 9237);
  const userDataDir = mkdtempSync(join(tmpdir(), "nativefragments-screenshots-"));
  const chrome = spawn(findChrome(), [
    "--headless=new",
    "--hide-scrollbars",
    "--disable-background-networking",
    "--disable-dev-shm-usage",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    `--remote-debugging-port=${browserPort}`,
    `--user-data-dir=${userDataDir}`,
    "about:blank",
  ], {
    stdio: ["ignore", "ignore", "pipe"],
  });

  chrome.stderr.on("data", (chunk) => {
    if (process.env.DEBUG_SCREENSHOTS) process.stderr.write(chunk);
  });

  try {
    await waitForDebugPort(browserPort);
    mkdirSync(outDir, { recursive: true });
    if (mirrorDir && existsSync(resolve(mirrorDir, "..", ".."))) {
      mkdirSync(mirrorDir, { recursive: true });
    }

    for (const example of examples) {
      const fileName = `${example.slug}.webp`;
      const image = await capture({ browserPort, example });
      const outputPath = join(outDir, fileName);
      writeFileSync(outputPath, image);
      console.log(`wrote ${outputPath}`);

      if (mirrorDir && existsSync(mirrorDir)) {
        const mirrorPath = join(mirrorDir, fileName);
        writeFileSync(mirrorPath, image);
        console.log(`mirrored ${mirrorPath}`);
      }
    }
  } finally {
    chrome.kill("SIGTERM");
    await waitForExit(chrome);
    rmSync(userDataDir, { force: true, recursive: true });
  }
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
