export const articles = [
  {
    slug: "edge-rendering",
    title: "Edge rendering without a framework tax",
    description: "A short note on keeping Workers inspectable and fast.",
    date: "2026-06-06",
    body: [
      "Native Fragments keeps the rendering contract small: routes return HTML, the shell wraps it, and browser modules hydrate only the islands that need behavior.",
      "That shape leaves the deployed Worker easy to inspect. There is no compiler output to reverse engineer and no hidden client runtime to chase.",
    ],
  },
  {
    slug: "agent-friendly-apps",
    title: "What makes an app agent-friendly?",
    description: "Readable routes, plain links, scoped components, and tiny APIs.",
    date: "2026-06-05",
    body: [
      "Agents work best when the application has obvious files and stable platform primitives.",
      "A document route, a custom element, and a model helper are easier to change safely than generated bundles with implicit conventions.",
    ],
  },
  {
    slug: "zero-build-components",
    title: "Zero-build components can still feel modern",
    description: "Shadow DOM, CSS custom properties, and fragment navigation cover a lot.",
    date: "2026-06-04",
    body: [
      "A Custom Element is a good boundary for behavior. Declarative Shadow DOM lets the server send the first paint without waiting for JavaScript.",
      "The client helper then hydrates the same shadow root, preserving the initial layout while adding interaction.",
    ],
  },
];

export const articleBySlug = (slug) =>
  articles.find((article) => article.slug === slug) ?? articles[0];

export const readingMinutes = (article) => {
  const words = article.body.join(" ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 180));
};
