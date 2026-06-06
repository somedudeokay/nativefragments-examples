import { html, route } from "@nativefragments/core/server";
import { currentStep, nextStep, planFromSearch, progress, steps } from "./model.js";

const origin = "https://form-wizard.nativefragments.org";

const stepHref = (id) => (id === "profile" ? "/" : `/${id}`);

const stepNav = (activeId) => html`<ol class="step-nav">
  ${steps.map(
    (step) => html`<li class="${step.id === activeId ? "active" : ""}">
      <a href="${stepHref(step.id)}" data-fragment-prefetch="intent">${step.title}</a>
    </li>`,
  )}
</ol>`;

const fieldsFor = (step, plan) => {
  if (step.id === "review") {
    return html`<dl class="review">
      <div><dt>Name</dt><dd>${plan.name}</dd></div>
      <div><dt>Role</dt><dd>${plan.role}</dd></div>
      <div><dt>Cadence</dt><dd>${plan.cadence}</dd></div>
      <div><dt>Visibility</dt><dd>${plan.visibility}</dd></div>
    </dl>`;
  }

  if (step.id === "preferences") {
    return html`<label>Cadence<input name="cadence" value="${plan.cadence}" /></label>
      <label>Visibility<input name="visibility" value="${plan.visibility}" /></label>
      <input name="name" type="hidden" value="${plan.name}" />
      <input name="role" type="hidden" value="${plan.role}" />`;
  }

  return html`<label>Name<input name="name" value="${plan.name}" /></label>
    <label>Role<input name="role" value="${plan.role}" /></label>`;
};

const wizardPage = ({ params, url }) => {
  const step = currentStep(params.step);
  const plan = planFromSearch(url.searchParams);
  const next = nextStep(step.id);
  const isDone = step.id === "review";

  return html`<section class="hero">
    <p class="eyebrow">Form Wizard</p>
    <h1>Progressive steps with real URLs.</h1>
    <p>
      Every step is a route. Fragment navigation makes it feel fast, but the
      forms still work as plain HTML links and GET submissions.
    </p>
  </section>

  <section class="wizard">
    ${stepNav(step.id)}
    <article>
      <div class="meter" style="--progress: ${progress(step.id)}%"><span></span></div>
      <p class="eyebrow">${progress(step.id)}% complete</p>
      <h2>${step.prompt}</h2>
      <form action="${isDone ? "/" : stepHref(next.id)}" method="get">
        ${fieldsFor(step, plan)}
        <button type="submit">${isDone ? "Start over" : `Continue to ${next.title}`}</button>
      </form>
    </article>
  </section>`;
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
