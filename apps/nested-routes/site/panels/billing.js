import { html, raw } from "@nativefragments/core/server";

const invoices = [
  ["INV-2042", "May 2026", "$29.00", "Paid"],
  ["INV-1998", "April 2026", "$29.00", "Paid"],
  ["INV-1947", "March 2026", "$29.00", "Paid"],
];

export const billingPanel = () => html`<article class="panel-card" data-panel="billing">
  <header class="panel-header">
    <div>
      <p class="panel-kicker">Billing</p>
      <h2>Plan and usage</h2>
      <p>
        Billing is another child route sharing the same parent settings shell.
        Direct requests and fragment requests both come from the Worker.
      </p>
    </div>
    <span class="status-pill strong">Pro</span>
  </header>

  <section class="usage-layout">
    <div class="plan-summary">
      <span>Current plan</span>
      <strong>Pro workspace</strong>
      <p>Includes 8 seats, preview Workers, and extended audit history.</p>
    </div>

    <div class="usage-stack" aria-label="Usage meters">
      <label>
        <span>Seats</span>
        <meter min="0" max="8" value="6">6 of 8</meter>
      </label>
      <label>
        <span>Preview routes</span>
        <meter min="0" max="100" value="44">44%</meter>
      </label>
      <label>
        <span>Audit retention</span>
        <meter min="0" max="90" value="64">64 days</meter>
      </label>
    </div>
  </section>

  <section class="invoice-table" aria-label="Recent invoices">
    <h3>Recent invoices</h3>
    ${raw(
      invoices
        .map(
          ([number, period, amount, status]) => html`<div class="invoice-row">
            <strong>${number}</strong>
            <span>${period}</span>
            <span>${amount}</span>
            <em>${status}</em>
          </div>`,
        )
        .join(""),
    )}
  </section>
</article>`;
