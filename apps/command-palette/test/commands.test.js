import assert from "node:assert/strict";
import test from "node:test";
import {
  commands,
  paletteHtml,
  searchCommands,
} from "../public/app/components/command-palette-template.js";

test("empty command search returns every command", () => {
  assert.equal(searchCommands("").length, commands.length);
});

test("command search matches labels and sections", () => {
  assert.equal(searchCommands("deploy")[0].id, "copy-deploy-url");
  assert.equal(searchCommands("preferences")[0].id, "toggle-theme");
});

test("server template marks the active command row", () => {
  assert.match(paletteHtml(commands, 1), /data-active="true"/);
});
