import { html, raw, route } from "@nativefragments/core/server";
import {
  articleBySlug,
  articleNeighbors,
  articles,
  readingMinutes,
} from "./content.js";

const origin = "https://content-site.nativefragments.org";

const monthDay = { day: "numeric", month: "short", year: "numeric" };
const formatDate = (iso) => {
  const date = new Date(`${iso}T00:00:00Z`);
  return Number.isNaN(date.getTime())
    ? iso
    : date.toLocaleDateString("en-US", { ...monthDay, timeZone: "UTC" });
};

const articleLinks = (activeSlug) =>
  raw(
    articles
      .map((article, index) => {
        const active = article.slug === activeSlug;
        const number = String(index + 1).padStart(2, "0");
        return html`<li>
          <a
            class="index-link${active ? " is-active" : ""}"
            href="/${article.slug}"
            data-fragment-prefetch="visible"
            ${active ? raw('aria-current="page"') : raw("")}
          >
            <span class="index-link__num">${number}</span>
            <span class="index-link__body">
              <span class="index-link__title">${article.title}</span>
              <span class="index-link__meta"
                >${formatDate(article.date)} · ${readingMinutes(article)} min</span
              >
            </span>
          </a>
        </li>`;
      })
      .join(""),
  );

const renderBlock = (block) => {
  switch (block.type) {
    case "h2":
      return html`<h2>${block.text}</h2>`;
    case "quote":
      return html`<blockquote><p>${block.text}</p></blockquote>`;
    case "code":
      return html`<pre><code>${block.text}</code></pre>`;
    case "list":
      return html`<ul>
        ${raw(block.items.map((item) => html`<li>${item}</li>`).join(""))}
      </ul>`;
    default:
      return html`<p>${block.text}</p>`;
  }
};

const articleBody = (article) =>
  raw(article.blocks.map((block) => renderBlock(block)).join(""));

const neighborNav = (slug) => {
  const { prev, next } = articleNeighbors(slug);
  const card = (article, direction, label) =>
    article
      ? html`<a class="pager__link pager__link--${direction}" href="/${article.slug}">
          <span class="pager__dir">${label}</span>
          <span class="pager__title">${article.title}</span>
        </a>`
      : html`<span class="pager__link pager__link--empty" aria-hidden="true"></span>`;
  return raw(card(prev, "prev", "Previous") + card(next, "next", "Next"));
};

const articlePage = ({ params }) => {
  const article = articleBySlug(params.slug);

  return html`<section class="reader">
    <aside class="index" aria-label="Articles">
      <div class="index__top">
        <a class="brand" href="/${articles[0].slug}">
          <span class="brand__mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 4h9l5 5v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z" />
              <path d="M14 4v5h5" />
              <path d="M8 13h7M8 16.5h7" />
            </svg>
          </span>
          <span class="brand__name">NF&nbsp;Notes</span>
        </a>
        <p class="index__tagline">Field notes on shipping at the edge</p>
      </div>
      <nav aria-label="All articles">
        <ol class="index-list">
          ${articleLinks(article.slug)}
        </ol>
      </nav>
      <p class="index__foot">Native Fragments · MMXXVI</p>
    </aside>

    <article class="post">
      <header class="post__head">
        <p class="post__kicker">${article.kicker}</p>
        <h1 class="post__title">${article.title}</h1>
        <p class="post__lede">${article.description}</p>
        <div class="post__byline">
          <span class="post__byline-name">${article.author}</span>
          <span class="post__byline-dot" aria-hidden="true">·</span>
          <time datetime="${article.date}">${formatDate(article.date)}</time>
          <span class="post__byline-dot" aria-hidden="true">·</span>
          <span>${readingMinutes(article)} min read</span>
        </div>
      </header>

      <div class="post__body">${articleBody(article)}</div>

      <nav class="pager" aria-label="More from NF Notes">
        ${neighborNav(article.slug)}
      </nav>
    </article>
  </section>`;
};

export const routes = [
  route("/", {
    meta: () => ({
      canonical: origin,
      description: articles[0].description,
      title: "NF Notes · Native Fragments Demo",
    }),
    render: articlePage,
  }),
  route("/:slug", {
    meta: ({ params }) => {
      const article = articleBySlug(params.slug);
      return {
        canonical: `${origin}/${article.slug}`,
        description: article.description,
        title: `${article.title} · NF Notes`,
      };
    },
    render: articlePage,
  }),
];
