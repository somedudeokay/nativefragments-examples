import { declarativeShadow, html } from "@nativefragments/core/server";
import { createCounterState } from "../models/counter.js";
import {
  counterStyles,
  renderCounterShadow,
} from "../../public/app/components/signal-counter-template.js";

export const signalCounterElement = (state = createCounterState()) => html`
  <signal-counter count="${state.count}" step="${state.step}">
    ${declarativeShadow({
      styles: [counterStyles],
      html: renderCounterShadow(state),
    })}
  </signal-counter>
`;
