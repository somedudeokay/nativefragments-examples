/**
 * Create a constructable stylesheet for Shadow DOM components.
 *
 * @param {string} cssText CSS source.
 * @returns {CSSStyleSheet} Constructable stylesheet.
 */
export const sheet = (cssText) => {
  const styleSheet = new CSSStyleSheet();
  styleSheet.replaceSync(cssText);
  return styleSheet;
};

/**
 * @typedef {object} ShadowOptions
 * @property {CSSStyleSheet[]} [styles=[]] Constructable stylesheets to adopt.
 * @property {string} [html=""] Shadow root HTML.
 * @property {boolean} [hydrate=true] Preserve an existing declarative shadow
 * root on the first render so server-rendered components do not flash.
 */

const hydrated = new WeakSet();

const findDeclarativeShadowTemplate = (element) => {
  for (const child of element.children) {
    if (child.localName === "template" && child.hasAttribute("shadowrootmode")) {
      return child;
    }
  }
  return null;
};

const materializeDeclarativeShadow = (element, root) => {
  const template = findDeclarativeShadowTemplate(element);
  if (!template) return false;

  root.replaceChildren(template.content.cloneNode(true));
  template.remove();
  return true;
};

/**
 * Attach or reuse an open shadow root, adopt stylesheets, and set its HTML.
 *
 * If the element already has declarative shadow DOM from server HTML, the
 * first call preserves that DOM by default. Fragment navigation inserts HTML
 * with `template.innerHTML`, so declarative shadow templates are materialized
 * manually before hydration to keep server-rendered components visible.
 *
 * @param {HTMLElement} element Custom element receiving the shadow root.
 * @param {ShadowOptions} [options={}] Shadow render options.
 * @returns {ShadowRoot} The element's shadow root.
 */
export const shadow = (element, { styles = [], html = "", hydrate = true } = {}) => {
  const hadShadowRoot = Boolean(element.shadowRoot);
  const root = element.shadowRoot ?? element.attachShadow({ mode: "open" });
  const materialized = hydrate && !hadShadowRoot && materializeDeclarativeShadow(element, root);

  root.adoptedStyleSheets = styles;
  const shouldHydrate = hydrate && (materialized || (root.childNodes.length > 0 && !hydrated.has(root)));
  hydrated.add(root);
  if (!shouldHydrate) root.innerHTML = html;
  return root;
};
