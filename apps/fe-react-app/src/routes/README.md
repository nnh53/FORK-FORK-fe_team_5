# Routing Structure Documentation

## Overview

This document explains the new routing structure implemented following React Router best practices based on the [React Router documentation](https://reactrouter.com/start/declarative/routing).

## Key Improvements

### 1. **Organized Route Structure**

- Routes are now logically grouped by functionality
- Clear separation between public, auth, admin, and utility routes
- Proper nesting using React Router's nested routing features

### 2. **Layout Routes**

- Consistent use of layout components for different sections
- `UserLayout` for user account pages
- `AdminLayout` for admin dashboard and management

### 3. **Route Prefixes**

- Auth routes grouped under `/auth/*` prefix
- Admin routes under `/admin/*` prefix
- Clear URL structure that matches functionality

### 4. **PageTransition Wrapper**

- Eliminated repetitive PageTransition wrapping
- Centralized component for consistent page transitions

### 5. **Backward Compatibility**

- Legacy routes redirect to new structure
- No breaking changes for existing functionality

## Route Structure

```
/                           → Redirects to /home
/home                       → Home page
/booking                    → Booking page
/checkout                   → Checkout page
/movie/:movieId             → Movie detail page

/auth/                      → Auth section
├── /auth/login             → Login page
├── /auth/register          → Register page
├── /auth/forgot-password   → Forgot password page
└── /auth/logviareg         → Login via registration page

/account                    → User account (with UserLayout)

/admin/                     → Admin section (with AdminLayout)
├── /admin/dashboard        → Admin dashboard
├── /admin/movie            → Movie management
├── /admin/cinema-room      → Cinema room management
└── ... (other admin routes)

Legacy Routes (for backward compatibility):
/login                      → Redirects to /auth/login
/register                   → Redirects to /auth/register
/myAccount                  → Redirects to /account

Utility Routes:
/welcome                    → Welcome page
/loading                    → Loading page
/unauthorized               → Unauthorized page
/error                      → Error page
/internal-server-error      → Internal server error page
/test                       → Test page
```

## Benefits

1. **Better Developer Experience**: Clear, predictable URL structure
2. **Maintainability**: Easier to add new routes and maintain existing ones
3. **User Experience**: Consistent navigation patterns
4. **SEO Friendly**: Clean URLs that reflect content hierarchy
5. **Performance**: Proper code splitting opportunities with nested routes

## Migration Guide

### For Developers

If you need to add new routes:

1. **Public routes**: Add directly to the main Routes component
2. **Auth routes**: Add under the `/auth` path prefix
3. **Admin routes**: Add to the AdminLayout component
4. **User routes**: Use UserLayout wrapper

### For Users

All existing URLs will continue to work thanks to redirect routes. The new structure provides cleaner URLs:

- Old: `/login` → New: `/auth/login` (with redirect)
- Old: `/myAccount` → New: `/account` (with redirect)

## Next Steps

1. **Move legacy management routes** (`/movie-management`, `/member-management`, `/staff-management`) to admin section
2. **Add authentication guards** using the existing `RoleRoute` component
3. **Implement breadcrumb navigation** using the hierarchical URL structure
4. **Add loading states** for nested route transitions

## Best Practices Applied

Based on [React Router documentation](https://reactrouter.com/start/declarative/routing):

- ✅ **Nested Routes** for logical grouping
- ✅ **Layout Routes** for shared UI components
- ✅ **Index Routes** for default pages in sections
- ✅ **Dynamic Segments** for parameterized routes
- ✅ **Consistent Navigation** patterns throughout the app
