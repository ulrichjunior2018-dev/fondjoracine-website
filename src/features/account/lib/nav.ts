import type { Route } from "next";

import type { Icons } from "@/components/icons/icons";

export type AccountNavItem = {
  /** When true, item is visible in the menu but not yet navigable (future features). */
  comingSoon?: boolean;
  href: Route;
  icon: keyof typeof Icons;
  label: string;
};

export type AccountNavGroup = {
  id: string;
  items: AccountNavItem[];
  /** Optional section label shown above the group (omit for the first “core” group). */
  label?: string;
};

/** Cast helper for deferred account paths that do not exist as routes yet. */
function futureRoute(path: string): Route {
  return path as Route;
}

/**
 * Single source of truth for the account mobile drawer + desktop sidebar.
 *
 * Essentials are live; `comingSoon: true` items stay visible so customers see the
 * full Maison Fondjo relationship roadmap. When a deferred section ships, set
 * `comingSoon` to false (or remove it) and add the matching page + API.
 */
export const accountNavGroups: AccountNavGroup[] = [
  {
    id: "core",
    items: [
      { href: "/account", icon: "home", label: "Home" },
      { href: "/account/orders", icon: "package", label: "My Orders" },
      { href: "/account/profile", icon: "user", label: "My Profile" },
    ],
  },
  {
    id: "hair-care",
    label: "Hair care",
    items: [
      {
        comingSoon: true,
        href: futureRoute("/account/hair-profile"),
        icon: "sparkles",
        label: "Hair Profile",
      },
      {
        comingSoon: true,
        href: futureRoute("/account/consultations"),
        icon: "clipboardList",
        label: "Consultation History",
      },
      {
        comingSoon: true,
        href: futureRoute("/account/hair-progress"),
        icon: "camera",
        label: "Hair Progress",
      },
      {
        comingSoon: true,
        href: futureRoute("/account/wishlist"),
        icon: "heart",
        label: "Wishlist",
      },
      {
        comingSoon: true,
        href: futureRoute("/account/reviews"),
        icon: "star",
        label: "Reviews",
      },
    ],
  },
  {
    id: "account",
    label: "Account",
    items: [
      { href: "/account/addresses", icon: "mapPin", label: "Addresses" },
      { href: "/account/security", icon: "lock", label: "Security" },
      { href: "/account/notifications", icon: "bell", label: "Notifications" },
      {
        comingSoon: true,
        href: futureRoute("/account/billing"),
        icon: "creditCard",
        label: "Billing & Receipts",
      },
      {
        comingSoon: true,
        href: futureRoute("/account/payment-methods"),
        icon: "wallet",
        label: "Saved Payment Methods",
      },
      {
        comingSoon: true,
        href: futureRoute("/account/support"),
        icon: "lifeBuoy",
        label: "Support",
      },
      { href: "/account/settings", icon: "settings", label: "Settings" },
    ],
  },
  {
    id: "rewards",
    label: "Rewards",
    items: [
      {
        comingSoon: true,
        href: futureRoute("/account/referrals"),
        icon: "gift",
        label: "Refer friends",
      },
      {
        comingSoon: true,
        href: futureRoute("/account/loyalty"),
        icon: "award",
        label: "Loyalty Program",
      },
    ],
  },
];

/** Flat list of navigable (live) items — used where a single array is enough. */
export const accountNavItems: AccountNavItem[] = accountNavGroups.flatMap((group) =>
  group.items.filter((item) => !item.comingSoon),
);
