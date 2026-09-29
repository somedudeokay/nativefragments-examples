# Native Fragments examples

Each directory in `apps/` is an independently deployable Cloudflare Worker demo.
The demos are intentionally small, inspectable, and dependency-light.

Runtime dependencies are Native Fragments and optional Lit. Applications use
standard ESM and esbuild through `@nativefragments/create-app/build`; there is no
framework compiler. Declare additional browser worker entries explicitly in
`package.json.nativefragments.workers`. Generated `/build/*` assets revalidate on
each load; deployment builds remove stale maps and worker entries.

Useful commands:

```sh
npm run check
npm run test
npm run test:router
npm run test:streaming
npm run eval:streaming
npm run deploy
```

Each app package also supports the same commands from its own directory.
`npm run test:router` drives the fragment router through a real headless
Chrome (hash links, scroll restoration, GET forms, redirects, prefetch).

Preview one app locally without `wrangler dev`:

```sh
node scripts/serve-app.mjs --app=todo-app --port=8799
```

Update the real screenshots used by the docsite after deploying examples:

```sh
npm run update-screenshots
```

The script writes efficient WebP screenshots to `screenshots/`. When the sibling
`../nativefragments` checkout is present, it also mirrors them into
`../nativefragments/apps/web/public/app/screenshots/`.

Refresh the Worker Search meteorite dataset from NASA Open Data:

```sh
npm run update-worker-search-data
```

See [streaming regression coverage](docs/streaming-regressions.md) for scenarios,
evaluation output and CI. The persistent authenticated example lives in the
[framework repository](https://github.com/somedudeokay/nativefragments/tree/main/apps/task-board)
and runs at [Fieldwork](https://task-board.nativefragments.org).

Release dependencies currently use the public GitHub 0.8 tarballs with locked
integrity, so this checkout installs independently while npm registry publishing
awaits a renewed credential. There are no sibling-checkout dependencies.
