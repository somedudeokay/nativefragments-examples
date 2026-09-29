import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { createNodeHandler } from "@nativefragments/create-app/http";
import worker from "../apps/met-gallery/worker.js";

// Only the upstream museum data is deterministic. Renderers, artificial latency,
// CSP, client bundle, stream transport, and navigation are the real application.
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
createServer(createNodeHandler(request => new URL(request.url).pathname === "/health"
  ? new Response("OK") : worker.fetch(request, { ASSETS: assets }, {}))).listen(8923, "127.0.0.1");
