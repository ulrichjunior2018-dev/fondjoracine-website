import type { Route } from "next";

import type { Icons } from "@/components/icons/icons";
import type { SurfacesDictionary } from "@/i18n/dictionaries/surfaces";

export type AccountNavLabelKey = keyof SurfacesDictionary["account"]["nav"];

export type AccountNavItem = {
  /** When true, item is visible in the menu but not yet navigable (future features). */
  comingSoon?: boolean;
  href: Route;
  icon: keyof typeof Icons;
  labelKey: AccountNavLabelKey;
};

export type AccountNavGroup = {
  id: string;
  items: AccountNavItem[];
  /** Optional section label key shown above the group. */
  labelKey?: AccountNavLabelKey;
};

/** Cast helper for deferred account paths that do not exist as routes yet. */
function futureRoute(path: string): Route {
  return path as Route;
}

/**
 * Single source of truth for the account mobile drawer + desktop sidebar.
 * Labels resolve via `account.nav.*` translation keys.
 */
export const accountNavGroups: AccountNavGroup[] = [
  {
    id: "core",
    items: [
      { href: "/account", icon: "home", labelKey: "dashboard" },
      { href: "/", icon: "shoppingBag", labelKey: "backToWebsite" },
      { href: "/account/orders", icon: "package", labelKey: "myOrders" },
      { href: "/account/profile", icon: "user", labelKey: "myProfile" },
    ],
  },
  {
    id: "hair-care",
    labelKey: "hairCare",
    items: [
      {
        comingSoon: true,
        href: futureRoute("/account/hair-profile"),
        icon: "sparkles",
        labelKey: "hairProfile",
      },
      {
        comingSoon: true,
        href: futureRoute("/account/consultations"),
        icon: "clipboardList",
        labelKey: "consultationHistory",
      },
      {
        comingSoon: true,
        href: futureRoute("/account/hair-progress"),
        icon: "camera",
        labelKey: "hairProgress",
      },
      {
        comingSoon: true,
        href: futureRoute("/account/wishlist"),
        icon: "heart",
        labelKey: "wishlist",
      },
      {
        comingSoon: true,
        href: futureRoute("/account/reviews"),
        icon: "star",
        labelKey: "reviews",
      },
    ],
  },
  {
    id: "account",
    labelKey: "account",
    items: [
      { href: "/account/addresses", icon: "mapPin", labelKey: "addresses" },
      { href: "/account/security", icon: "lock", labelKey: "security" },
      { href: "/account/notifications", icon: "bell", labelKey: "notifications" },
      {
        comingSoon: true,
        href: futureRoute("/account/billing"),
        icon: "creditCard",
        labelKey: "billing",
      },
      {
        comingSoon: true,
        href: futureRoute("/account/payment-methods"),
        icon: "wallet",
        labelKey: "paymentMethods",
      },
      {
        comingSoon: true,
        href: futureRoute("/account/support"),
        icon: "lifeBuoy",
        labelKey: "support",
      },
      { href: "/account/settings", icon: "settings", labelKey: "settings" },
    ],
  },
  {
    id: "rewards",
    labelKey: "rewards",
    items: [
      {
        comingSoon: true,
        href: futureRoute("/account/referrals"),
        icon: "gift",
        labelKey: "referFriends",
      },
      {
        comingSoon: true,
        href: futureRoute("/account/loyalty"),
        icon: "award",
        labelKey: "loyalty",
      },
    ],
  },
];

/** Flat list of navigable (live) items — used where a single array is enough. */
export const accountNavItems: AccountNavItem[] = accountNavGroups.flatMap((group) =>
  group.items.filter((item) => !item.comingSoon),
);
