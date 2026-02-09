# Contributing to Equity Builders

Thank you for your interest in contributing to the Equity Builders platform. This document provides guidelines and standards for contributing to the codebase.

## Code of Conduct

- Be professional and respectful
- Focus on technical accuracy over aesthetics (though both matter)
- Prioritize trust, verification, and documentation
- Write code that's production-ready, not demo-quality

## Development Workflow

### 1. Branch Naming

Use descriptive branch names:
- `feature/property-timeline-view`
- `fix/authentication-session-bug`
- `refactor/database-queries`
- `docs/deployment-guide`

### 2. Commit Messages

Follow conventional commits:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `test`: Adding tests
- `chore`: Maintenance tasks

Examples:
```
feat(properties): add inspection timeline view
fix(auth): resolve session expiration bug
docs(readme): update installation instructions
```

### 3. Pull Request Process

1. Create a feature branch from `main`
2. Make your changes
3. Write/update tests if applicable
4. Update documentation
5. Submit pull request with:
   - Clear title and description
   - Reference to related issues
   - Screenshots (if UI changes)
   - Testing instructions

## Code Standards

### TypeScript

- **Use TypeScript** for all new code
- Avoid `any` types—use proper type definitions
- Export types from `types/index.ts`
- Use interfaces for object shapes
- Document complex types with comments

Example:
```typescript
/**
 * Represents a property with all related data
 */
export interface PropertyWithDetails extends Property {
  owner: User;
  claims: Claim[];
  damageCount: number;
  documentCount: number;
}
```

### React Components

- Use **functional components** with hooks
- Prefer server components when possible (Next.js App Router)
- Use client components only when needed (`"use client"`)
- Extract reusable logic into custom hooks
- Keep components focused and single-purpose

Example:
```typescript
/**
 * Property Card Component
 * 
 * Displays summary information for a single property.
 * Used in property list views.
 */
export default function PropertyCard({ property }: { property: Property }) {
  // Component implementation
}
```

### Styling

- Use **Tailwind CSS** for styling
- Follow existing design patterns
- Use the `cn()` utility for conditional classes
- Keep responsive design in mind (mobile-first)
- Use design system colors (primary, accent, etc.)

### Database

- Define schema in `lib/db/schema.ts`
- Use **Drizzle ORM** for queries
- Always use prepared statements (prevent SQL injection)
- Add appropriate indexes for performance
- Document schema changes in migration files

### Authentication & Security

- Never store passwords in plain text
- Always hash with bcrypt (12 rounds minimum)
- Validate all user inputs with Zod schemas
- Use `requireAuth()` for protected routes
- Check permissions with `requireRole()`

## File Organization

```
/app                    # Next.js routes
  /(auth)              # Authentication pages
  /(dashboard)         # Protected dashboard routes
  /api                 # API routes
/components
  /ui                  # Reusable UI components
  /forms               # Form components
  /layouts             # Layout components
  /modules             # Feature-specific components
/lib
  /db                  # Database schemas and client
  /auth                # Authentication logic
  /utils               # Utility functions
  /ai                  # AI/ATOS logic (future)
/types                 # TypeScript type definitions
/public                # Static assets
```

## Testing

### Manual Testing Checklist

Before submitting PR:
- [ ] All pages load without errors
- [ ] Authentication works (login/logout)
- [ ] Forms validate correctly
- [ ] Responsive design works on mobile
- [ ] No TypeScript errors
- [ ] No console errors/warnings

### Automated Testing (Future)

We will add:
- Unit tests (Jest/Vitest)
- Integration tests
- E2E tests (Playwright)

## Documentation

### Code Comments

Use comments to explain **WHY**, not **WHAT**:

```typescript
// Good: Explains reasoning
// Use 12 salt rounds for bcrypt to balance security and performance
const SALT_ROUNDS = 12;

// Bad: States the obvious
// Set salt rounds to 12
const SALT_ROUNDS = 12;
```

### Component Documentation

Include JSDoc comments for components:

```typescript
/**
 * ATOS Intelligence Panel
 * 
 * Proactive AI assistant that surfaces insights, risks, and opportunities.
 * This is not a chatbot—it's a strategic guide embedded in the platform.
 * 
 * @param insights - Array of ATOS insights to display
 * @param compact - If true, shows condensed view with max 3 insights
 */
export default function ATOSPanel({ insights, compact }: ATOSPanelProps) {
  // ...
}
```

## Design Principles

### 1. Accuracy Over Aesthetics

- Data integrity is paramount
- Validate all inputs rigorously
- Show accurate information, not approximations
- Use proper data types (decimals for currency, etc.)

### 2. Explainability

- Every decision should be explainable
- Document why choices were made
- Provide context in UI (tooltips, help text)
- ATOS should explain "why this matters"

### 3. Trust & Verification

- Audit trails for important actions
- Timestamps on all records
- Clear data provenance
- Secure by default

### 4. Production Quality

- No placeholder text in production
- Handle all error cases
- Provide helpful error messages
- Log errors appropriately
- Think about scale from day one

## Getting Help

- Check existing documentation first
- Review similar implementations in codebase
- Ask questions in pull request discussions
- Contact the technical team for architectural decisions

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

**Thank you for helping build Equity Builders!**
