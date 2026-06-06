import { billingPanel } from "./billing.js";
import { notificationsPanel } from "./notifications.js";
import { profilePanel } from "./profile.js";
import { securityPanel } from "./security.js";

export const defaultPanelId = "profile";

export const panels = [
  {
    id: "profile",
    path: "/settings/profile",
    title: "Profile",
    navLabel: "Profile",
    navHint: "Identity and locale",
    icon: "01",
    prefetch: "load",
    description:
      "Manage account identity, workspace display details, and regional defaults.",
    render: profilePanel,
  },
  {
    id: "security",
    path: "/settings/security",
    title: "Security",
    navLabel: "Security",
    navHint: "Sessions and passkeys",
    icon: "02",
    prefetch: "intent",
    description:
      "Review active sessions, passkey coverage, and authentication requirements.",
    render: securityPanel,
  },
  {
    id: "notifications",
    path: "/settings/notifications",
    title: "Notifications",
    navLabel: "Notifications",
    navHint: "Delivery rules",
    icon: "03",
    prefetch: "visible",
    description:
      "Tune product, security, and billing notifications across channels.",
    render: notificationsPanel,
  },
  {
    id: "billing",
    path: "/settings/billing",
    title: "Billing",
    navLabel: "Billing",
    navHint: "Plan and usage",
    icon: "04",
    prefetch: "intent",
    description:
      "Inspect plan limits, usage allocation, and the latest account invoices.",
    render: billingPanel,
  },
];

const panelsById = new Map(panels.map((panel) => [panel.id, panel]));
const panelsByPath = new Map(panels.map((panel) => [panel.path, panel]));

export const panelRoutes = panels.map(({ id, path }) => ({ id, path }));

export const panelMeta = (id) =>
  panelsById.get(id) ?? panelsById.get(defaultPanelId);

export const panelForPath = (pathname) =>
  panelsByPath.get(pathname)?.id ?? defaultPanelId;

export const renderPanel = (id) => panelMeta(id).render();
