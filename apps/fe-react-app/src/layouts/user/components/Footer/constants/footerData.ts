import { ROUTES } from "@/routes/route.constants";

export interface FooterLink {
  label: string;
  href?: string;
  to?: string;
  isExternal?: boolean;
}

export const quickLinks: FooterLink[] = [
  { label: "Home", href: "#" },
  { label: "Theaters", href: "#features" },
  { label: "Movies", href: "#movies" },
  { label: "Trending", href: "#trending" },
];

export const supportLinks: FooterLink[] = [
  { label: "FAQs", to: ROUTES.FAQ },
  { label: "Terms of Service", to: ROUTES.TERM_OF_SERVICE },
  { label: "Privacy Policy", to: ROUTES.PRIVACY_POLICY },
  { label: "About Us", to: ROUTES.ABOUT },
];
