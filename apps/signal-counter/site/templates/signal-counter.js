import { renderLit } from "@nativefragments/lit/server";
import { html } from "lit";
import "../../client/components/lit-counter.js";
import { createCounterState } from "../models/counter.js";

export const litCounterElement = (state = createCounterState()) =>
  renderLit(html`<lit-counter count=${state.count} step=${state.step}></lit-counter>`);
