import { siteConfig } from "@/config/config";

export interface FooterLink {
  label: string;
  href?: string;
  to?: string;
  isExternal?: boolean;
}

export const quickLinks: FooterLink[] = siteConfig.quickLinks.map((link) => ({
  label: link.label,
  href: link.href,
}));

export const supportLinks: FooterLink[] = siteConfig.supportLinks.map((link) => ({
  label: link.label,
  href: link.href,
}));
