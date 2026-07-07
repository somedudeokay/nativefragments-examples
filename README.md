# Native Fragments examples

Each directory in `apps/` is an independently deployable Cloudflare Worker demo.
The demos are intentionally small, inspectable, and dependency-light.

Dependency rule:

- Runtime dependencies must be Native Fragments packages only.
- Dev dependencies are limited to `@web/test-runner`.
- Unit tests use `node:test`.

Useful commands:

```sh
npm run check
npm run test
npm run test:router
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
