import { html, route } from "@nativefragments/core/server";
import { articleBySlug, articles, readingMinutes } from "./content.js";

const origin = "https://content-site.nativefragments.org";

const articleLinks = (activeSlug) => html`<nav class="article-list" aria-label="Articles">
  ${articles.map(
    (article) => html`<a
      class="${article.slug === activeSlug ? "active" : ""}"
      href="/${article.slug}"
      data-fragment-prefetch="visible"
    >
      <span>${article.date}</span>
      ${article.title}
    </a>`,
  )}
</nav>`;

const articlePage = ({ params }) => {
  const article = articleBySlug(params.slug);

  return html`<section class="layout">
    <aside>
      <a class="brand" href="/">NF Notes</a>
      ${articleLinks(article.slug)}
    </aside>
    <article>
      <p class="eyebrow">${article.date} · ${readingMinutes(article)} min read</p>
      <h1>${article.title}</h1>
      <p class="lede">${article.description}</p>
      ${article.body.map((paragraph) => html`<p>${paragraph}</p>`)}
    </article>
  </section>`;
};

export const routes = [
  route("/", {
    meta: () => ({
      canonical: origin,
      description: articles[0].description,
      title: "Content Site · Native Fragments Demo",
    }),
    render: articlePage,
  }),
  route("/:slug", {
    meta: ({ params }) => {
      const article = articleBySlug(params.slug);
      return {
        canonical: `${origin}/${article.slug}`,
        description: article.description,
        title: `${article.title} · Content Site`,
      };
    },
    render: articlePage,
  }),
];
