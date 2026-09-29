import "@nativefragments/lit/client";
import { startRouter } from "@nativefragments/core/client/router.js";
import "./components/todo-app.js";

const router = startRouter();
document.addEventListener("todo-state-change", () => router.invalidate());
