import assert from "node:assert/strict";
import test from "node:test";
import { shell } from "../site/shell.js";
import { todoPage } from "../site/pages/todo.js";
import { routes } from "../site/routes.js";

test("server renders the initially visible custom element shadow dom", () => {
  const body = todoPage({
    url: new URL("https://todo-app.nativefragments.org/active"),
  });

  assert.match(body, /<todo-app data-filter="active">/);
  assert.match(body, /<template shadowrootmode="open">/);
  assert.match(body, /Server rendered\. Edits save in this browser\./);
  assert.match(body, /data-todo-state/);
});

test("shell includes the fragment mount and zero-build browser modules", () => {
  const html = shell({
    body: "<todo-app></todo-app>",
    meta: {
      canonical: "https://todo-app.nativefragments.org/",
      description: "Demo",
      title: "Todo",
    },
  });

  assert.match(html, /<main id="content-slot"><todo-app><\/todo-app><\/main>/);
  assert.match(html, /href="\/app\/styles.css"/);
  assert.match(html, /src="\/app\/client.js"/);
});

test("route manifest exposes all filter fallbacks", () => {
  assert.deepEqual(
    routes.map((route) => route.path),
    ["/", "/active", "/completed"],
  );
});
