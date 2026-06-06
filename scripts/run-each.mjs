import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const script = process.argv[2];

if (!script) {
  console.error("Usage: node scripts/run-each.mjs <script>");
  process.exit(1);
}

const appsRoot = new URL("../apps/", import.meta.url);
const apps = readdirSync(appsRoot)
  .map((name) => join(appsRoot.pathname, name))
  .filter((path) => statSync(path).isDirectory())
  .sort();

for (const app of apps) {
  const result = spawnSync("npm", ["run", script, "--if-present"], {
    cwd: app,
    stdio: "inherit",
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
