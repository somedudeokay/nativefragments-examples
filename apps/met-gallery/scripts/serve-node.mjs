import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import worker from "../worker.js";

const root = fileURLToPath(new URL("..", import.meta.url));
const publicRoot = join(root, "public");
const port = Number(process.env.PORT || 8788);

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
};

const assetPath = (pathname) => {
  const decoded = decodeURIComponent(pathname);
  const relative = normalize(decoded.replace(/^\/+/, ""));
  if (relative.startsWith("..")) return null;
  return join(publicRoot, relative);
};

const assets = {
  async fetch(request) {
    const url = new URL(request.url);
    const filePath = assetPath(url.pathname);
    if (!filePath) return new Response("Not found", { status: 404 });

    try {
      const body = await readFile(filePath);
      return new Response(body, {
        headers: {
          "Content-Type": contentTypes[extname(filePath)] ?? "application/octet-stream",
        },
      });
    } catch {
      return new Response("Not found", { status: 404 });
    }
  },
};

const headersFromIncoming = (request) => {
  const headers = new Headers();
  for (const [name, value] of Object.entries(request.headers)) {
    if (Array.isArray(value)) {
      for (const item of value) headers.append(name, item);
    } else if (value != null) {
      headers.set(name, value);
    }
  }
  return headers;
};

const writeResponse = async (nodeResponse, response, startedAt) => {
  nodeResponse.writeHead(response.status, Object.fromEntries(response.headers));

  if (!response.body) {
    nodeResponse.end();
    return;
  }

  const reader = response.body.getReader();
  let chunkCount = 0;

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    chunkCount += 1;
    console.log(
      `[stream] chunk ${chunkCount} ${value.byteLength}b +${Date.now() - startedAt}ms`,
    );
    nodeResponse.write(value);
  }

  nodeResponse.end();
};

const server = createServer(async (request, response) => {
  const startedAt = Date.now();
  const host = request.headers.host ?? `localhost:${port}`;
  const url = `http://${host}${request.url}`;
  console.log(`[request] ${request.method} ${request.url}`);

  try {
    const workerRequest = new Request(url, {
      headers: headersFromIncoming(request),
      method: request.method,
    });
    const workerResponse = await worker.fetch(workerRequest, { ASSETS: assets }, {});
    await writeResponse(response, workerResponse, startedAt);
    console.log(`[done] ${request.method} ${request.url} +${Date.now() - startedAt}ms`);
  } catch (error) {
    console.error(error);
    response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Internal Server Error");
  }
});

server.listen(port, () => {
  console.log(`Met Gallery streaming dev server ready on http://localhost:${port}`);
});
