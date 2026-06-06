export const STORAGE_KEY = "nativefragments.theme-switcher.theme";
export const DEFAULT_THEME = "dawn";

export const THEMES = [
  {
    id: "dawn",
    label: "Dawn desk",
    summary: "Warm paper, blue actions, red review marks.",
    colorScheme: "light",
    tokens: {
      "--app-bg": "#f1eadc",
      "--app-surface": "#fffaf0",
      "--app-panel": "#ebe2d0",
      "--app-ink": "#17211b",
      "--app-muted": "#667064",
      "--app-line": "rgba(23, 33, 27, 0.16)",
      "--app-strong-line": "rgba(23, 33, 27, 0.32)",
      "--app-accent": "#2f68d8",
      "--app-accent-2": "#dc4c33",
      "--app-warn": "#b78319",
      "--app-shadow": "0 32px 80px -48px rgba(23, 33, 27, 0.56)",
    },
  },
  {
    id: "night",
    label: "Night console",
    summary: "Dark steel, mint commits, amber signals.",
    colorScheme: "dark",
    tokens: {
      "--app-bg": "#101417",
      "--app-surface": "#171e22",
      "--app-panel": "#202a2e",
      "--app-ink": "#eef2e6",
      "--app-muted": "#a6b0a7",
      "--app-line": "rgba(238, 242, 230, 0.16)",
      "--app-strong-line": "rgba(238, 242, 230, 0.32)",
      "--app-accent": "#62d49f",
      "--app-accent-2": "#ffb03a",
      "--app-warn": "#ef5da8",
      "--app-shadow": "0 34px 90px -48px rgba(0, 0, 0, 0.85)",
    },
  },
  {
    id: "field",
    label: "Field notes",
    summary: "Green glass, cobalt links, clay warnings.",
    colorScheme: "light",
    tokens: {
      "--app-bg": "#e9f0e6",
      "--app-surface": "#fbfff6",
      "--app-panel": "#dbe8d5",
      "--app-ink": "#1d2a22",
      "--app-muted": "#627467",
      "--app-line": "rgba(29, 42, 34, 0.16)",
      "--app-strong-line": "rgba(29, 42, 34, 0.32)",
      "--app-accent": "#0b7a58",
      "--app-accent-2": "#365ec9",
      "--app-warn": "#cf713b",
      "--app-shadow": "0 32px 80px -48px rgba(29, 42, 34, 0.5)",
    },
  },
  {
    id: "contrast",
    label: "High contrast",
    summary: "Plain surfaces, black text, hard magenta focus.",
    colorScheme: "light",
    tokens: {
      "--app-bg": "#f7f7f4",
      "--app-surface": "#ffffff",
      "--app-panel": "#e8e8e2",
      "--app-ink": "#050505",
      "--app-muted": "#343434",
      "--app-line": "rgba(5, 5, 5, 0.28)",
      "--app-strong-line": "rgba(5, 5, 5, 0.56)",
      "--app-accent": "#000000",
      "--app-accent-2": "#d4145a",
      "--app-warn": "#8a5a00",
      "--app-shadow": "0 24px 70px -48px rgba(5, 5, 5, 0.65)",
    },
  },
];

const themeMap = new Map(THEMES.map((theme) => [theme.id, theme]));

const cssVariablesForTheme = (theme) =>
  Object.entries(theme.tokens)
    .map(([name, value]) => `${name}: ${value};`)
    .join("\n");

export const themeScriptAllowList = () => THEMES.map((theme) => theme.id);

export const resolveTheme = (themeId) => themeMap.get(themeId) ?? themeMap.get(DEFAULT_THEME);

export const themeRootCss = () => {
  const defaultTheme = resolveTheme(DEFAULT_THEME);
  const defaultCss = `:root {
color-scheme: ${defaultTheme.colorScheme};
${cssVariablesForTheme(defaultTheme)}
}`;
  const themesCss = THEMES.map(
    (theme) => `:root[data-theme="${theme.id}"] {
color-scheme: ${theme.colorScheme};
${cssVariablesForTheme(theme)}
}`,
  ).join("\n\n");

  return `${defaultCss}\n\n${themesCss}`;
};
