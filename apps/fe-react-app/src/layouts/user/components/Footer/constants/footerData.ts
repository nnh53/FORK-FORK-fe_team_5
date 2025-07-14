import { ROUTES } from "@/routes/route.constants";

export interface FooterLink {
  label: string;
  href?: string;
  to?: string;
  isExternal?: boolean;
}

export const quickLinks: FooterLink[] = [
  { label: "Home", href: "#home" },
  { label: "Movies", href: "#movies" },
  { label: "Chairs", href: "#theaters" },
  { label: "Offers", href: "#offers" },
];

export const supportLinks: FooterLink[] = [
  { label: "FAQs", href: "#" },
  { label: "Terms of Service", to: ROUTES.TERM_OF_SERVICE },
  { label: "Privacy Policy", to: ROUTES.PRIVACY_POLICY },
  { label: "Contact Us", href: "#" },
];
