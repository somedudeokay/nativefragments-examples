# Streaming and navigation regression coverage

The examples now use core 0.8, the optional Lit adapter and the shared create-app
build/HTTP utilities. Source ESM lives in client/; public/build/ is generated.

The gallery previously inferred stream restarts by observing loading nodes.
Cache replay could insert completed content in one turn and leave its timeline
pending or showing an earlier visit. The dock now resets on navigation-start,
distinguishes streamed and buffered/cached swaps, and paints fragment-reveal events.
Strict CSP allows the response nonce in style-src for no-JavaScript placeholders.

The local preview previously buffered response.arrayBuffer(). It now forwards
response chunks with backpressure and disconnect cancellation, preserving the
same Fetch response semantics as the Worker.

Core fixes included in these deployments:

- Wait for closed document payloads before moving their DOM nodes.
- Scope reveal targets/IDs to each response and retire finished observers.
- Preserve shadow roots and Lit SSR node identity during fragment navigation.
- Prevent cancelled transitions and old deferred work from committing.
- Restore named targets on Back/Forward and exclude links from target selection.
- Preserve redirect cookies, cache freshness, expiry and alias invalidation.

## Run the checks

```sh
npm ci
npx playwright install chromium firefox webkit
npm run check
npm test
npm run test:streaming
npm run eval:streaming
```

The browser suite serves the real gallery, client bundle and streaming renderers.
Only museum data and remote images are deterministic fixtures. It checks the
four reveal states and their order, cache replay, Back/Forward, rapid navigation,
absence of leftover payload wrappers, and visible JavaScript-disabled content.
The provenance failure is intentional and must not prevent other slots resolving.
Rapid navigation starts each following native link click on the first swap event
and requires an observed cancellation. This keeps the overlap deterministic even
when WebKit's automated click waits for navigation I/O on Linux runners.
For the initial loading-state assertion, the test server sends the real document
shell and holds subsequent chunks until the browser acknowledges the placeholder.
This avoids missing a short-lived loading state on busy runners without changing
application code or increasing arbitrary delays.

The evaluation repeats each scenario five times in all three engines. It writes
test-results/gallery.json and attaches per-browser reveal/navigation timings.
Failures retain traces. Timings describe the local controlled workload, not a
production performance guarantee. The recorded release run passed 45/45 cases;
the initial suite passed 9/9. Node tests passed 52/52.

Core additionally owns 33 browser contracts, 60 repeated streaming cases,
workerd socket-disconnect checks, D1 integration, strict consumer types and clean
tarball/scaffold installs. This suite does not require a sibling checkout.

Cloudflare configs enable request signal propagation. Pass context.signal into
downstream I/O. A disconnected socket must be observed by the runtime before the
signal aborts; finite deferred timeouts remain the backstop.
