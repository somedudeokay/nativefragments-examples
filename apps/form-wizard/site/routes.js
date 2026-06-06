import { html, raw, route } from "@nativefragments/core/server";
import {
  currentStep,
  nextStep,
  planFromSearch,
  progress,
  stepIndex,
  steps,
} from "./model.js";

const origin = "https://form-wizard.nativefragments.org";

const stepHref = (id) => (id === "profile" ? "/" : `/${id}`);

const checkIcon = raw(
  `<svg viewBox="0 0 16 16" width="13" height="13" fill="none" aria-hidden="true"><path d="M3 8.5 6.2 12 13 4.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
);

const arrowIcon = raw(
  `<svg viewBox="0 0 18 18" width="16" height="16" fill="none" aria-hidden="true"><path d="M3.5 9h11M10 4.5 14.5 9 10 13.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
);

const blurbFor = {
  profile: "Tell us who owns this workspace so we can set sensible defaults.",
  preferences: "Pick the rhythm and visibility your team will start with.",
  review: "Everything below is editable later. Confirm to finish setup.",
};

const stepNav = (activeId) => {
  const activeIndex = stepIndex(activeId);
  const items = steps
    .map((step, index) => {
      const state =
        index < activeIndex
          ? "done"
          : index === activeIndex
            ? "current"
            : "todo";
      const marker =
        state === "done"
          ? html`<span class="step-mark" aria-hidden="true">${checkIcon}</span>`
          : html`<span class="step-mark" aria-hidden="true">${index + 1}</span>`;
      const inner = html`${raw(marker)}
        <span class="step-text">
          <span class="step-title">${step.title}</span>
          <span class="step-sub">${blurbFor[step.id]}</span>
        </span>`;
      const body =
        state === "todo"
          ? html`<span class="step-link" aria-current="false">${raw(inner)}</span>`
          : html`<a
              class="step-link"
              href="${stepHref(step.id)}"
              data-fragment-prefetch="intent"
              ${raw(state === "current" ? 'aria-current="step"' : "")}
              >${raw(inner)}</a
            >`;
      return html`<li class="step ${state}">${raw(body)}</li>`;
    })
    .join("");

  return html`<nav class="stepper" aria-label="Setup progress">
    <p class="rail-label">Setup</p>
    <ol class="step-nav">
      ${raw(items)}
    </ol>
  </nav>`;
};

const field = ({ name, label, value, hint, type = "text" }) => html`<div
  class="field"
>
  <label for="f-${name}">${label}</label>
  ${hint ? raw(html`<p class="field-hint">${hint}</p>`) : ""}
  <input id="f-${name}" name="${name}" type="${type}" value="${value}" autocomplete="off" />
</div>`;

const fieldsFor = (step, plan) => {
  if (step.id === "review") {
    const rows = [
      { label: "Workspace name", value: plan.name, edit: "/" },
      { label: "Primary role", value: plan.role, edit: "/" },
      { label: "Update cadence", value: plan.cadence, edit: "/preferences" },
      { label: "Default visibility", value: plan.visibility, edit: "/preferences" },
    ]
      .map(
        (row) => html`<div class="review-row">
          <dt>${row.label}</dt>
          <dd>${row.value}</dd>
          <a
            class="review-edit"
            href="${`${row.edit}?name=${encodeURIComponent(plan.name)}&role=${encodeURIComponent(plan.role)}&cadence=${encodeURIComponent(plan.cadence)}&visibility=${encodeURIComponent(plan.visibility)}`}"
            data-fragment-prefetch="intent"
            >Edit</a
          >
        </div>`,
      )
      .join("");
    return html`<dl class="review">
      ${raw(rows)}
    </dl>`;
  }

  if (step.id === "preferences") {
    return html`${raw(
        field({
          name: "cadence",
          label: "Update cadence",
          value: plan.cadence,
          hint: "How often digests and summaries go out, e.g. Weekly or Daily.",
        }),
      )}
      ${raw(
        field({
          name: "visibility",
          label: "Default visibility",
          value: plan.visibility,
          hint: "Who can see new projects by default, e.g. Shared or Private.",
        }),
      )}
      <input name="name" type="hidden" value="${plan.name}" />
      <input name="role" type="hidden" value="${plan.role}" />`;
  }

  return html`${raw(
      field({
        name: "name",
        label: "Workspace name",
        value: plan.name,
        hint: "The display name your team will see across the product.",
      }),
    )}
    ${raw(
      field({
        name: "role",
        label: "Primary role",
        value: plan.role,
        hint: "We use this to tailor onboarding suggestions.",
      }),
    )}`;
};

const wizardPage = ({ params, url }) => {
  const step = currentStep(params.step);
  const plan = planFromSearch(url.searchParams);
  const next = nextStep(step.id);
  const isDone = step.id === "review";
  const pct = progress(step.id);
  const position = `${stepIndex(step.id) + 1} of ${steps.length}`;

  return html`<div class="page">
    <header class="masthead">
      <p class="eyebrow">Native Fragments</p>
      <h1>Workspace setup</h1>
      <p class="lede">
        A three-step onboarding wizard where every step is its own route.
        Fragment navigation keeps it instant, yet each step still works as a
        plain HTML link and GET submission.
      </p>
    </header>

    <section class="wizard" aria-labelledby="step-heading">
      ${raw(stepNav(step.id))}

      <article class="panel">
        <div class="progress" role="group" aria-label="Completion">
          <div class="progress-head">
            <span class="progress-pos">Step ${position}</span>
            <span class="progress-pct"><span>${pct}</span>%</span>
          </div>
          <div
            class="meter"
            role="progressbar"
            aria-label="Setup completion"
            aria-valuenow="${pct}"
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuetext="${pct}% complete"
            style="--progress: ${pct}%"
          >
            <span></span>
          </div>
        </div>

        <div class="panel-body">
          <p class="kicker">${step.title}</p>
          <h2 id="step-heading">${step.prompt}</h2>
          <p class="panel-blurb">${blurbFor[step.id]}</p>

          <form action="${isDone ? "/" : stepHref(next.id)}" method="get">
            ${raw(fieldsFor(step, plan))}
            <div class="actions">
              <button class="btn-primary" type="submit">
                <span>${isDone ? "Finish setup" : `Continue to ${next.title}`}</span>
                ${arrowIcon}
              </button>
              ${
                isDone
                  ? raw(
                      html`<a class="btn-ghost" href="/" data-fragment-prefetch="intent">Start over</a>`,
                    )
                  : ""
              }
            </div>
          </form>
        </div>
      </article>
    </section>
  </div>`;
};

export const routes = [
  route("/", {
    meta: () => ({
      canonical: origin,
      description:
        "A Native Fragments form wizard demo with route-backed steps and progressive enhancement.",
      title: "Form Wizard · Native Fragments Demo",
    }),
    render: wizardPage,
  }),
  route("/:step", {
    meta: ({ params }) => ({
      canonical: `${origin}/${params.step}`,
      description:
        "A Native Fragments form wizard demo with route-backed steps and progressive enhancement.",
      title: `${currentStep(params.step).title} · Form Wizard`,
    }),
    render: wizardPage,
  }),
];
