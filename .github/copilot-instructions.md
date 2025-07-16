# FCinema Project - AI Coding Agent Instructions

## Architecture Overview

This is an **Nx monorepo** with **pnpm** package manager containing a cinema booking application:

- **`apps/fe-react-app/`** - Main React frontend (Vite + TypeScript)
- **Real API** - Spring Boot backend at `https://fcinema-spring-ujhbb.ondigitalocean.app/movie_theater`

## Key Development Patterns

### API Strategy

- Use **OpenAPI-generated types** from `schema-from-be.d.ts` (generated via `pnpm --filter fe-react-app generate-schema`)
- API client: `src/utils/api.ts` exports `$api` using `openapi-react-query`
- Service layer: `src/services/` contains domain-specific API hooks (e.g., `movieService.ts`)

### Authentication & Authorization

- **Role-based access control** with `ADMIN`, `STAFF`, `MEMBER` roles
- Auth state managed via `AuthProvider` context with cookie persistence
- Route protection: `RoleRoute` component for role-based routing
- Auth utilities: `src/utils/auth.utils.ts` and `src/utils/cookie.utils.ts`

### UI Component Architecture

- **Shadcn/ui** components in `src/components/Shadcn/` (configured via `components.json`)
- **Shadcn/ui** + **Tailwind CSS** for styling
- **Feature-based structure**: `src/feature/` contains domain modules (auth, booking, manager, etc.)
- Shared components: `src/components/shared/`

### Feature Organization

Each feature module follows this pattern:

```
src/feature/[domain]/
├── components/          # Feature-specific components
├── [Domain]Page.tsx     # Main page component
└── hooks/               # Domain-specific hooks
```

## Essential Commands

### Development

```bash
# Start frontend
pnpm --filter fe-react-app dev

# Generate OpenAPI types
pnpm --filter fe-react-app generate-schema
```

### Build & Test

```bash
# Build app
pnpm --filter fe-react-app build

# Type checking
pnpm --filter fe-react-app typecheck

# Linting
pnpm --filter fe-react-app lint
```

## Critical Configuration Files

- **`apps/fe-react-app/components.json`** - Shadcn/ui configuration with path aliases
- **`apps/fe-react-app/schema-from-be.d.ts`** - Auto-generated OpenAPI types
- **`nx.json`** - Nx workspace configuration with S3 caching

## Development Workflow

2. **Type Safety**: Run `pnpm --filter fe-react-app generate-schema` after backend changes
3. **Feature Development**: Create new features in `src/feature/[domain]/` structure
4. **Component Usage**: Import UI components from `@/components/Shadcn/ui/`
5. **State Management**: Use React Query hooks from service layer

## Project-Specific Conventions

- **File naming**: PascalCase for components, camelCase for utilities
- **Import aliases**: `@/` points to `src/`, configured in `tsconfig.json`
- **Styling**: Prefer Shadcn/ui components + Tailwind utilities
- **API patterns**: Create service files with React Query hooks for each domain
- **Auth patterns**: Use `useAuth()` hook and `RoleRoute` for protection

## Integration Points

- **Backend Integration**: OpenAPI-first approach with generated TypeScript types
- **Authentication**: Cookie-based auth with role-based routing
- **Build System**: Nx with TypeScript strict mode and ESLint

## Common Pitfalls

- Regenerate types after backend schema changes
- Use `@/` imports instead of relative paths
- Follow role-based routing patterns for protected pages
- Ensure auth context is properly wrapped around route components
