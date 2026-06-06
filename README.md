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
npm run deploy
```

Each app package also supports the same commands from its own directory.

Update the real screenshots used by the docsite after deploying examples:

```sh
npm run update-screenshots
```

The script writes efficient WebP screenshots to `screenshots/`. When the sibling
`../nativefragments.org` checkout is present, it also mirrors them into
`../nativefragments.org/public/app/screenshots/`.
