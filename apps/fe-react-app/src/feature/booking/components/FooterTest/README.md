# FooterTest Component Structure

## Overview

The FooterTest component has been refactored into smaller, reusable components to improve maintainability and reduce the use of div tags by using semantic HTML elements.

## Component Structure

```
FooterTest/
├── FooterTest.tsx                 # Main footer component
├── FooterTest.css                 # Styles
├── components/                    # Individual components
│   ├── index.ts                   # Component exports
│   ├── FooterLogo.tsx            # Logo and description with social links
│   ├── SocialLinks.tsx           # Social media icons
│   ├── FooterLinks.tsx           # Navigation links
│   ├── NewsletterSubscription.tsx # Newsletter signup form
│   ├── FooterBottom.tsx          # Copyright section
│   └── FlowingMenuSection.tsx    # Flowing menu component
├── constants/
│   └── footerData.ts             # Footer link constants
└── hooks/
    └── useFooterAnimations.ts    # Animation logic
```

## Key Improvements

### 1. Semantic HTML Elements

- Replaced `<div>` tags with semantic HTML:
  - `<footer>` for the main footer
  - `<section>` for different content areas
  - `<header>` for footer header sections
  - `<nav>` for navigation links
  - `<form>` for newsletter subscription

### 2. Component Separation

- **FooterLogo**: Handles logo, description, and social links
- **FooterLinks**: Reusable component for link groups
- **NewsletterSubscription**: Newsletter form with state management
- **FooterBottom**: Copyright information
- **FlowingMenuSection**: Flowing menu with customizable items

### 3. Enhanced Accessibility

- Added proper ARIA labels
- Used semantic HTML structure
- Added screen reader friendly navigation

### 4. Improved Maintainability

- Separated business logic into custom hooks
- Externalized data into constants
- Type-safe interfaces for all components

## Usage

```tsx
import FooterTest from "./FooterTest";

// Simple usage
<FooterTest />;

// The component automatically handles:
// - Animations via useFooterAnimations hook
// - Newsletter subscription
// - Social media links
// - Navigation links
```

## Customization

### Adding New Footer Links

```typescript
// In constants/footerData.ts
export const customLinks: FooterLink[] = [
  { label: "About Us", href: "/about" },
  { label: "Careers", href: "/careers", isExternal: true },
];
```

### Custom Social Links

```tsx
// Custom social links can be passed to SocialLinks component
const customSocials = [{ icon: "tabler:brand-linkedin", href: "https://linkedin.com" }];

<SocialLinks links={customSocials} />;
```

### Newsletter Subscription Handler

```tsx
const handleSubscription = (email: string) => {
  // Your subscription logic
  console.log("Subscribed:", email);
};

<NewsletterSubscription onSubscribe={handleSubscription} />;
```

## Benefits

1. **Modularity**: Each component has a single responsibility
2. **Reusability**: Components can be used independently
3. **Accessibility**: Proper semantic HTML and ARIA labels
4. **Type Safety**: Full TypeScript support
5. **Performance**: Efficient animations with GSAP
6. **Maintainability**: Clean separation of concerns
