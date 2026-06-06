export const articles = [
  {
    slug: "edge-rendering",
    title: "Edge rendering without a framework tax",
    description: "A short note on keeping Workers inspectable and fast.",
    kicker: "Architecture",
    author: "The NF Notes desk",
    date: "2026-06-06",
    blocks: [
      {
        type: "p",
        text: "Native Fragments keeps the rendering contract small. Routes return HTML, the shell wraps it, and browser modules hydrate only the islands that actually need behavior. Nothing else has to ship to the client.",
      },
      {
        type: "p",
        text: "That shape leaves the deployed Worker easy to inspect. There is no compiler output to reverse engineer and no hidden client runtime to chase through a sourcemap.",
      },
      { type: "h2", text: "The contract you can read" },
      {
        type: "p",
        text: "A request comes in, a route produces a string of HTML, and the platform streams it back. You can open the response in a browser, read it top to bottom, and know exactly what was sent.",
      },
      {
        type: "code",
        text: "route(\"/:slug\", {\n  render: ({ params }) => html`<article>…</article>`,\n});",
      },
      {
        type: "quote",
        text: "The best rendering layer is the one you can hold entirely in your head.",
      },
      {
        type: "p",
        text: "When the markup is the artifact, debugging is reading. That is the whole pitch, and it holds up surprisingly far into a real application.",
      },
    ],
    body: [
      "Native Fragments keeps the rendering contract small. Routes return HTML, the shell wraps it, and browser modules hydrate only the islands that actually need behavior. Nothing else has to ship to the client.",
      "That shape leaves the deployed Worker easy to inspect. There is no compiler output to reverse engineer and no hidden client runtime to chase through a sourcemap.",
      "A request comes in, a route produces a string of HTML, and the platform streams it back. You can open the response in a browser, read it top to bottom, and know exactly what was sent.",
      "When the markup is the artifact, debugging is reading. That is the whole pitch, and it holds up surprisingly far into a real application.",
    ],
  },
  {
    slug: "agent-friendly-apps",
    title: "What makes an app agent-friendly?",
    description: "Readable routes, plain links, scoped components, and tiny APIs.",
    kicker: "Practice",
    author: "The NF Notes desk",
    date: "2026-06-05",
    blocks: [
      {
        type: "p",
        text: "Agents work best when an application has obvious files and stable platform primitives. The less implicit a project is, the further an automated collaborator can get on its own.",
      },
      { type: "h2", text: "Favor stable primitives" },
      {
        type: "p",
        text: "A document route, a custom element, and a small model helper are easier to change safely than generated bundles with implicit conventions. Each lives in one place and means one thing.",
      },
      {
        type: "list",
        items: [
          "Routes that map cleanly to URLs you can guess.",
          "Components scoped by the platform, not by a build step.",
          "Model code that reads like plain functions over plain data.",
        ],
      },
      {
        type: "p",
        text: "Give an agent a codebase like that and it stops guessing. It can follow a link, read a file, and predict the effect of an edit before making it.",
      },
    ],
    body: [
      "Agents work best when an application has obvious files and stable platform primitives. The less implicit a project is, the further an automated collaborator can get on its own.",
      "A document route, a custom element, and a small model helper are easier to change safely than generated bundles with implicit conventions. Each lives in one place and means one thing.",
      "Give an agent a codebase like that and it stops guessing. It can follow a link, read a file, and predict the effect of an edit before making it.",
    ],
  },
  {
    slug: "zero-build-components",
    title: "Zero-build components can still feel modern",
    description: "Shadow DOM, custom properties, and fragment navigation cover a lot.",
    kicker: "Components",
    author: "The NF Notes desk",
    date: "2026-06-04",
    blocks: [
      {
        type: "p",
        text: "A custom element is a good boundary for behavior, and you do not need a bundler to reach for one. The platform already ships the parts that used to require a framework.",
      },
      { type: "h2", text: "First paint, then behavior" },
      {
        type: "p",
        text: "Declarative Shadow DOM lets the server send the first paint without waiting for JavaScript. The client helper then hydrates the same shadow root, preserving the initial layout while adding interaction.",
      },
      {
        type: "p",
        text: "Custom properties carry the theme across the boundary, so a component can stay encapsulated and still match the page it lives on.",
      },
      {
        type: "quote",
        text: "Modern is not a build size. It is the experience the reader gets on the first byte.",
      },
      {
        type: "p",
        text: "Fragment navigation ties it together: links swap document fragments in place, so a multi-page site reads like an app without a single-page runtime underneath it.",
      },
    ],
    body: [
      "A custom element is a good boundary for behavior, and you do not need a bundler to reach for one. The platform already ships the parts that used to require a framework.",
      "Declarative Shadow DOM lets the server send the first paint without waiting for JavaScript. The client helper then hydrates the same shadow root, preserving the initial layout while adding interaction.",
      "Custom properties carry the theme across the boundary, so a component can stay encapsulated and still match the page it lives on.",
      "Fragment navigation ties it together: links swap document fragments in place, so a multi-page site reads like an app without a single-page runtime underneath it.",
    ],
  },
];

export const articleBySlug = (slug) =>
  articles.find((article) => article.slug === slug) ?? articles[0];

export const readingMinutes = (article) => {
  const words = article.body.join(" ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 180));
};

export const articleNeighbors = (slug) => {
  const index = articles.findIndex((article) => article.slug === slug);
  const current = index === -1 ? 0 : index;
  return {
    prev: current > 0 ? articles[current - 1] : null,
    next: current < articles.length - 1 ? articles[current + 1] : null,
  };
};
