import { readSearch } from "@nativefragments/core/server";

export const steps = [
  {
    id: "profile",
    title: "Profile",
    prompt: "Who is this workspace for?",
    fields: ["name", "role"],
  },
  {
    id: "preferences",
    title: "Preferences",
    prompt: "Choose the defaults this team expects.",
    fields: ["cadence", "visibility"],
  },
  {
    id: "review",
    title: "Review",
    prompt: "Confirm the generated onboarding plan.",
    fields: [],
  },
];

export const currentStep = (id = "profile") =>
  steps.find((step) => step.id === id) ?? steps[0];

export const stepIndex = (id = "profile") =>
  steps.findIndex((step) => step.id === currentStep(id).id);

export const nextStep = (id = "profile") =>
  steps[Math.min(stepIndex(id) + 1, steps.length - 1)];

export const progress = (id = "profile") =>
  Math.round(((stepIndex(id) + 1) / steps.length) * 100);

export const planFromSearch = (searchParams) =>
  readSearch(searchParams, {
    cadence: "Weekly",
    name: "Native team",
    role: "Product engineering",
    visibility: "Shared",
  });
