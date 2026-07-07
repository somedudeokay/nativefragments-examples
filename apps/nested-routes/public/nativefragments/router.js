const defaultSlot = "#content-slot";
const cache = new Map();
const inFlight = new Map();

const fragmentUrl = (url) => `${url.pathname}${url.search}`;
const historyUrl = (url) => `${url.pathname}${url.search}${url.hash}`;

const isSelectorSlot = (slot) =>
  slot.startsWith("#") || slot.startsWith(".") || slot.startsWith("[");

const escapeSlot = (value) => String(value).replace(/["\\]/g, "\\$&");

const slotTarget = (slot) =>
  isSelectorSlot(slot)
    ? document.querySelector(slot)
    : document.querySelector(`[data-fragment-slot="${escapeSlot(slot)}"]`);

const slotHeader = (slot) => (isSelectorSlot(slot) ? null : slot);

const fragmentCacheKey = (url, slot) => {
  const requestedSlot = slotHeader(slot);
  return requestedSlot ? `${fragmentUrl(url)}::${requestedSlot}` : fragmentUrl(url);
};

const sameRoute = (url) =>
  url.pathname === window.location.pathname && url.search === window.location.search;

const shouldSkipNavigation = (url, slot, defaultNavigationSlot, pushState) =>
  pushState && slot === defaultNavigationSlot && sameRoute(url) && !url.hash;

const consumeMeta = (fragment) => {
  const node = fragment.querySelector("script[data-fragment-meta]");
  if (!node?.textContent) return null;
  const meta = JSON.parse(node.textContent);
  node.remove();
  return meta;
};

const setHead = (meta) => {
  if (!meta) return;
  if (meta.title) document.title = meta.title;

  const description = document.head.querySelector('meta[name="description"]');
  if (description && meta.description) {
    description.setAttribute("content", meta.description);
  }

  const canonical = document.head.querySelector('link[rel="canonical"]');
  if (canonical && meta.canonical) canonical.setAttribute("href", meta.canonical);

  if (Array.isArray(meta.alternates)) {
    document.head
      .querySelectorAll('link[rel="alternate"][hreflang]')
      .forEach((node) => node.remove());

    for (const alternate of meta.alternates) {
      if (!alternate?.hreflang || !alternate?.href) continue;
      const link = document.createElement("link");
      link.rel = "alternate";
      link.hreflang = alternate.hreflang;
      link.href = alternate.href;
      document.head.appendChild(link);
    }
  }
};

const cachedFragment = (url, ttl, slot) => {
  const cached = cache.get(fragmentCacheKey(url, slot));
  return cached && Date.now() - cached.timestamp < ttl ? cached : null;
};

const writeFragmentCache = (url, slot, result) => {
  cache.set(fragmentCacheKey(url, slot), { ...result, timestamp: Date.now() });
};

/**
 * Clear cached fragment responses.
 *
 * With no argument, the entire cache and in-flight request map are cleared.
 * With `href`, every cache entry for the resolved pathname and search is
 * removed across all fragment slots.
 *
 * @param {string | URL} [href] Optional URL to clear.
 * @returns {void}
 */
export const clearFragmentCache = (href) => {
  if (href === undefined) {
    cache.clear();
    inFlight.clear();
    return;
  }

  const url = routeTo(href);
  const prefix = `${fragmentUrl(url)}::`;
  for (const key of cache.keys()) {
    if (key === fragmentUrl(url) || key.startsWith(prefix)) cache.delete(key);
  }
  for (const key of inFlight.keys()) {
    if (key === fragmentUrl(url) || key.startsWith(prefix)) inFlight.delete(key);
  }
};

const requestFragment = async (url, signal, slot) => {
  const requestedSlot = slotHeader(slot);
  const response = await fetch(fragmentUrl(url), {
    headers: {
      "x-fragment": "true",
      ...(requestedSlot ? { "x-fragment-slot": requestedSlot } : {}),
    },
    signal,
  });
  if (!response.ok) throw new Error(`Fragment request failed: ${response.status}`);

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().startsWith("text/html")) {
    const error = new Error(`Fragment response was not HTML: ${contentType || "unknown"}`);
    error.name = "NativeFragmentsNonHtmlResponseError";
    throw error;
  }

  const responseUrl = new URL(
    response.headers.get("x-nativefragments-url") || response.url || url.href,
    window.location.href,
  );
  if (
    !responseUrl.hash &&
    url.hash &&
    responseUrl.origin === url.origin &&
    responseUrl.pathname === url.pathname &&
    responseUrl.search === url.search
  ) {
    responseUrl.hash = url.hash;
  }

  return {
    html: await response.text(),
    url: responseUrl,
  };
};

const fetchFragment = async ({ url, signal, ttl, slot }) => {
  const key = fragmentCacheKey(url, slot);
  const cached = cachedFragment(url, ttl, slot);
  if (cached) return cached;
  if (inFlight.has(key)) return inFlight.get(key);

  const request = requestFragment(url, signal, slot)
    .then((result) => {
      writeFragmentCache(result.url, slot, result);
      return result;
    })
    .finally(() => {
      inFlight.delete(key);
    });

  inFlight.set(key, request);
  return request;
};

const parseFragment = (html) => {
  const template = document.createElement("template");
  template.innerHTML = html;
  return {
    content: template.content,
    meta: consumeMeta(template.content),
  };
};

const decodeHash = (hash) => {
  try {
    return decodeURIComponent(hash.slice(1));
  } catch {
    return hash.slice(1);
  }
};

const scrollToHash = (url) => {
  if (!url.hash) return false;
  const id = decodeHash(url.hash);
  const target = document.getElementById(id) ?? document.getElementsByName(id)[0];
  if (!target) return false;
  target.scrollIntoView();
  return true;
};

const scrollToTop = () =>
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });

const restoreScroll = (position) => {
  if (!Array.isArray(position)) return false;
  window.scrollTo({
    left: Number(position[0]) || 0,
    top: Number(position[1]) || 0,
    behavior: "instant",
  });
  return true;
};

const focusTarget = (target) => {
  if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
  target.focus({ preventScroll: true });
};

const saveCurrentScrollPosition = () => {
  const state =
    history.state && typeof history.state === "object" ? history.state : {};
  history.replaceState(
    { ...state, scroll: [window.scrollX, window.scrollY] },
    "",
  );
};

const applyFragment = async ({
  bindPrefetch,
  fragment,
  pushState,
  restore,
  scroll,
  slot,
  target,
  url,
  userInitiated,
  viewTransitions,
}) => {
  if (pushState) {
    saveCurrentScrollPosition();
    history.pushState({ fragmentSlot: slot }, "", historyUrl(url));
  }

  const swap = () => {
    target.replaceChildren(fragment.content);
    setHead(fragment.meta);
    bindPrefetch(target);
  };

  if (viewTransitions && typeof document.startViewTransition === "function") {
    const transition = document.startViewTransition(swap);
    await transition.updateCallbackDone?.catch(() => {});
  } else {
    swap();
  }

  if (!restoreScroll(restore) && !scrollToHash(url) && scroll) {
    scrollToTop();
  }
  if (userInitiated) focusTarget(target);
};

const routeTo = (href) =>
  href instanceof URL ? new URL(href.href) : new URL(href, window.location.href);

const documentNavigationPattern =
  /\.(?:avif|br|css|gif|gz|html?|ico|jpe?g|json|m?js|map|md|mp3|mp4|ogg|otf|pdf|png|svg|tar|ttf|txt|wasm|wav|webm|webp|woff2?|xml|zip)$/i;

const requestsDocumentNavigation = (url) => documentNavigationPattern.test(url.pathname);

const linkOptedOut = (link) => {
  const mode = link.dataset.fragmentNavigation;
  return (
    link.hasAttribute("data-nativefragments-reload") ||
    mode === "false" ||
    mode === "off"
  );
};

const shouldHandleLink = (event) =>
  !event.defaultPrevented &&
  !event.metaKey &&
  !event.ctrlKey &&
  !event.shiftKey &&
  !event.altKey &&
  event.button === 0;

const linkFromEvent = (event) =>
  event
    .composedPath()
    .find((item) => item instanceof Element && item.matches?.("a[href]"));

const fallbackToDocument = (url) => {
  window.location.href = url.href;
};

const shouldUseDocumentNavigation = (link) => {
  if (!link || link.target || link.hasAttribute("download") || linkOptedOut(link)) {
    return true;
  }

  const url = routeTo(link.href);
  return url.origin !== window.location.origin || requestsDocumentNavigation(url);
};

const prefetchMode = (value) => {
  if (value === true || value === undefined) return "intent";
  if (value === false || value === "false" || value === "off") return "none";
  return value;
};

const linkPrefetchMode = (link, fallback) => {
  const value = link.dataset.fragmentPrefetch;
  return prefetchMode(value === undefined ? fallback : value);
};

const shouldPrefetchLink = (link) =>
  link &&
  !shouldUseDocumentNavigation(link);

/**
 * Prefetch a same-origin fragment into the shared fragment cache.
 *
 * @param {string | URL} href URL to prefetch.
 * @param {{ slot?: string, ttl?: number, signal?: AbortSignal }} [options={}]
 * Prefetch options.
 * @returns {Promise<string | null>} Prefetched fragment HTML, or `null` for
 * skipped cross-origin URLs and document-like URLs such as `/agents.txt`.
 */
export const prefetchFragment = async (
  href,
  { slot = defaultSlot, ttl = 30_000, signal } = {},
) => {
  const url = routeTo(href);
  if (url.origin !== window.location.origin || requestsDocumentNavigation(url)) {
    return null;
  }
  const result = await fetchFragment({ url, signal, ttl, slot });
  return result.html;
};

const installIntentPrefetch = ({ ttl, slot, prefetch }) => {
  const timers = new WeakMap();

  const queue = (link) => {
    if (!shouldPrefetchLink(link) || linkPrefetchMode(link, prefetch) !== "intent") {
      return;
    }
    if (timers.has(link)) return;

    const timer = window.setTimeout(() => {
      timers.delete(link);
      prefetchFragment(link.href, {
        ttl,
        slot: link.dataset.fragmentSlot ?? slot,
      }).catch(() => {});
    }, 65);

    timers.set(link, timer);
  };

  const cancel = (link) => {
    const timer = timers.get(link);
    if (!timer) return;
    window.clearTimeout(timer);
    timers.delete(link);
  };

  document.addEventListener("pointerover", (event) => queue(linkFromEvent(event)));
  document.addEventListener("focusin", (event) => queue(linkFromEvent(event)));
  document.addEventListener("pointerout", (event) => cancel(linkFromEvent(event)));
  document.addEventListener("focusout", (event) => cancel(linkFromEvent(event)));
};

const formFromEvent = (event) =>
  event
    .composedPath()
    .find(
      (item) =>
        item instanceof Element &&
        item.matches?.("form[data-fragment-form]"),
    );

const submitterFromEvent = (event) =>
  event.submitter instanceof HTMLElement ? event.submitter : null;

const effectiveFormMethod = (form, submitter) =>
  String(submitter?.getAttribute("formmethod") ?? form.getAttribute("method") ?? "get")
    .toUpperCase();

const effectiveFormAction = (form, submitter) =>
  routeTo(submitter?.getAttribute("formaction") ?? form.getAttribute("action") ?? window.location.href);

const effectiveFormTarget = (form, submitter) =>
  submitter?.getAttribute("formtarget") ?? form.getAttribute("target") ?? "";

const formDataSearch = (form, submitter) => {
  const params = new URLSearchParams();
  for (const [name, value] of new FormData(form, submitter)) {
    params.append(name, String(value));
  }
  return params;
};

/**
 * @typedef {object} FragmentNavigationOptions
 * @property {string} [slot="#content-slot"] Selector for the element replaced
 * by fragment responses.
 * @property {number} [ttl=30000] Fragment cache time in milliseconds.
 * @property {boolean | "none" | "intent" | "visible" | "load"} [prefetch="intent"]
 * Default fragment prefetch behavior. Links can override this with
 * `data-fragment-prefetch="intent|visible|load|none"`.
 * @property {boolean} [viewTransitions=true] Whether to use
 * `document.startViewTransition()` for DOM swaps when supported.
 * @property {(event: { meta: object | null, url: URL, slot: string }) => void} [afterNavigate]
 * Callback fired after a successful client-side navigation.
 */

/**
 * Install same-origin fragment navigation.
 *
 * Clicked links are fetched with `x-fragment: true`, the configured content
 * slot is replaced, document metadata is updated, and history state is pushed.
 * Links with `data-fragment-slot="name"` replace only the matching
 * `[data-fragment-slot="name"]` container and send `x-fragment-slot: name`.
 * GET forms with `data-fragment-form` are intercepted the same way. POST forms
 * are left to the browser so the server can run route actions and redirect.
 * External links, document-like URLs such as `/agents.txt`, modified clicks,
 * and links with `data-nativefragments-reload` or
 * `data-fragment-navigation="false"` keep normal browser behavior.
 *
 * @param {FragmentNavigationOptions} [options={}] Navigation options.
 * @returns {((href: string | URL, pushState?: boolean, nextSlot?: string) => Promise<void>) | undefined}
 * Navigate function, or `undefined` if the slot does not exist.
 */
export const installFragmentNavigation = ({
  slot = defaultSlot,
  ttl = 30_000,
  prefetch = "intent",
  viewTransitions = true,
  afterNavigate = () => {},
} = {}) => {
  if (!slotTarget(slot)) return;
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";

  let currentController = null;
  let renderedRoute = fragmentUrl(new URL(window.location.href));
  const defaultPrefetch = prefetchMode(prefetch);
  const loadedLinks = new WeakSet();
  const visibleLinks = new WeakSet();
  const visibleObserver =
    "IntersectionObserver" in window
      ? new IntersectionObserver((entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            const link = entry.target;
            visibleObserver.unobserve(link);
            prefetchFragment(link.href, {
              ttl,
              slot: link.dataset.fragmentSlot ?? slot,
            }).catch(() => {});
          }
        }, { rootMargin: "240px" })
      : null;

  const linksIn = (root) => {
    const links = [];
    if (root instanceof Element && root.matches("a[href]")) links.push(root);
    root.querySelectorAll?.("a[href]").forEach((link) => links.push(link));
    return links;
  };

  const bindPrefetch = (root) => {
    for (const link of linksIn(root)) {
      if (!shouldPrefetchLink(link)) continue;
      const mode = linkPrefetchMode(link, defaultPrefetch);
      if (mode === "load" && !loadedLinks.has(link)) {
        loadedLinks.add(link);
        prefetchFragment(link.href, {
          ttl,
          slot: link.dataset.fragmentSlot ?? slot,
        }).catch(() => {});
      }
      if (mode === "visible" && visibleObserver && !visibleLinks.has(link)) {
        visibleLinks.add(link);
        visibleObserver.observe(link);
      }
    }
  };

  const navigate = async (
    href,
    pushState = true,
    nextSlot = slot,
    { restore, userInitiated = pushState } = {},
  ) => {
    const url = routeTo(href);
    if (url.origin !== window.location.origin || requestsDocumentNavigation(url)) {
      window.location.href = url.href;
      return;
    }
    if (shouldSkipNavigation(url, nextSlot, slot, pushState)) return;

    const root = slotTarget(nextSlot);
    if (!root) {
      fallbackToDocument(url);
      return;
    }

    currentController?.abort();
    currentController = new AbortController();

    try {
      const result = await fetchFragment({
        url,
        signal: currentController.signal,
        ttl,
        slot: nextSlot,
      });
      if (result.url.origin !== window.location.origin) {
        fallbackToDocument(result.url);
        return;
      }
      const fragment = parseFragment(result.html);
      await applyFragment({
        bindPrefetch,
        fragment,
        pushState,
        restore,
        scroll: nextSlot === slot,
        slot: nextSlot,
        target: root,
        url: result.url,
        userInitiated,
        viewTransitions,
      });
      if (nextSlot === slot) renderedRoute = fragmentUrl(result.url);
      afterNavigate({ meta: fragment.meta, url: result.url, slot: nextSlot });
    } catch (error) {
      if (error.name !== "AbortError") fallbackToDocument(url);
    }
  };

  document.addEventListener("click", (event) => {
    if (!shouldHandleLink(event)) return;

    const link = linkFromEvent(event);
    if (shouldUseDocumentNavigation(link)) return;

    const url = routeTo(link.href);
    if (sameRoute(url) && url.hash) {
      // Native in-page anchor jump; save the position so Back can restore it.
      saveCurrentScrollPosition();
      return;
    }

    event.preventDefault();
    navigate(url, true, link.dataset.fragmentSlot ?? slot);
  });

  document.addEventListener("submit", (event) => {
    if (event.defaultPrevented) return;

    const form = formFromEvent(event);
    if (!form) return;

    const submitter = submitterFromEvent(event);
    if (effectiveFormTarget(form, submitter)) return;
    if (effectiveFormMethod(form, submitter) !== "GET") return;

    const url = effectiveFormAction(form, submitter);
    if (url.origin !== window.location.origin) return;

    const search = formDataSearch(form, submitter).toString();
    url.search = search ? `?${search}` : "";

    event.preventDefault();
    navigate(url, true, form.dataset.fragmentSlot ?? slot);
  });

  window.addEventListener("popstate", (event) => {
    const url = new URL(window.location.href);
    if (fragmentUrl(url) === renderedRoute) {
      // Hash or same-route traversal: the DOM is already correct, and manual
      // scrollRestoration means the browser will not move — do it ourselves.
      const sameSlot = (event.state?.fragmentSlot ?? slot) === slot;
      if (!restoreScroll(event.state?.scroll) && !scrollToHash(url) && sameSlot) {
        scrollToTop();
      }
      return;
    }
    navigate(url, false, event.state?.fragmentSlot ?? slot, {
      restore: event.state?.scroll,
      userInitiated: false,
    });
  });

  installIntentPrefetch({ ttl, slot, prefetch: defaultPrefetch });
  bindPrefetch(document);

  window.nativeFragmentsNavigate = navigate;
  window.nativeFragmentsPrefetch = (href, nextSlot = slot) =>
    prefetchFragment(href, { ttl, slot: nextSlot });
  window.nativeFragmentsClearFragmentCache = clearFragmentCache;
  return navigate;
};
