import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { createNodeHandler } from "@nativefragments/create-app/http";
import worker from "../apps/met-gallery/worker.js";

// Museum data is deterministic. Renderers, artificial latency, CSP, client
// bundle, HTTP bridge and navigation are real; an optional gate below lets a
// test inspect loading UI before the real reveal chunks are forwarded.
globalThis.fetch = async input => {
  const url = new URL(String(input));
  if (url.origin !== "https://api.artic.edu") throw new Error(`Unexpected upstream: ${url.origin}`);
  const type = url.searchParams.get("query[match][artwork_type_title]") ?? "Painting";
  const art = { id: 1, title: `${type} fixture`, image_id: "fixture", artist_display: "Test artist", date_display: "2026", medium_display: type, department_title: "Collection", description: "A deterministic artwork.", is_on_view: true };
  return Response.json(url.pathname.endsWith("/search") ? { pagination: { total: 23 }, data: [art] } : { data: art });
};
const root = new URL("../apps/met-gallery/public/", import.meta.url);
const assets = { async fetch(request) {
  const path = new URL(request.url).pathname;
  if (!["/build/client.js", "/app/styles.css", "/favicon.svg"].includes(path)) return new Response("Not found", { status: 404 });
  return new Response(await readFile(new URL(path.slice(1), root)), {
    headers: { "Content-Type": path.endsWith(".js") ? "text/javascript" : path.endsWith(".css") ? "text/css" : "image/svg+xml" },
  });
} };
const gates = new Map();
createServer(createNodeHandler(async request => {
  const url = new URL(request.url);
  if (url.pathname === "/health") return new Response("OK");
  if (url.pathname === "/__test/release") {
    const release = gates.get(url.searchParams.get("gate"));
    if (!release) return new Response("Unknown gate", { status: 404 });
    release();
    return new Response("Released");
  }
  const response = await worker.fetch(request, { ASSETS: assets }, {});
  const gate = url.searchParams.get("__stream_gate");
  if (!gate) return response;

  // Deliver the real shell, placeholders and bootstrap, then hold reveal chunks
  // until the browser inspects its loading state. Each test owns its own gate.
  let resume;
  const ready = new Promise(resolve => { resume = resolve; });
  const release = () => { clearTimeout(timeout); gates.delete(gate); resume(); };
  const timeout = setTimeout(release, 15_000);
  gates.set(gate, release);
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let prefix = "";
  let shellComplete = false;
  return new Response(new ReadableStream({
    async pull(controller) {
      if (shellComplete) await ready;
      const { value, done } = await reader.read();
      if (done) { release(); controller.close(); }
      else {
        prefix += decoder.decode(value, { stream: true });
        shellComplete ||= prefix.includes("data-nativefragments-deferred-bootstrap");
        prefix = prefix.slice(-48);
        controller.enqueue(value);
      }
    },
    cancel(reason) { release(); return reader.cancel(reason); },
  }), response);
})).listen(8923, "127.0.0.1");
