# Contributing to Equity Builders

Thank you for your interest in contributing to the Equity Builders platform. This document provides guidelines and standards for development.

---

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Development Setup](#development-setup)
3. [Architecture Guidelines](#architecture-guidelines)
4. [Coding Standards](#coding-standards)
5. [Git Workflow](#git-workflow)
6. [Testing](#testing)
7. [Pull Request Process](#pull-request-process)

---

## Code of Conduct

### Our Standards

- **Professional Communication**: Respectful, constructive feedback
- **Collaborative Problem-Solving**: Focus on solutions, not blame
- **Quality First**: Precision and thoroughness in all work
- **Security Conscious**: Always consider security implications
- **Documentation**: Code should be self-explanatory with clear comments

---

## Development Setup

### Prerequisites

- Node.js 18.17+
- PostgreSQL 14+
- Git
- VS Code (recommended) with extensions:
  - ESLint
  - Prettier
  - TypeScript and JavaScript Language Features

### Local Setup

```bash
# Clone repository
git clone <repository-url>
cd equity-builders

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your local configuration

# Set up database
psql -d postgres -c "CREATE DATABASE equity_builders_dev;"
psql -d equity_builders_dev -f lib/db/schema.sql

# Run development server
npm run dev
```

Access at `http://localhost:3000`

---

## Architecture Guidelines

### Core Principles

1. **Accuracy over aesthetics** (but aesthetics must still be elite)
2. **Explainability over black boxes**
3. **Trust, verification, and documentation are first-class citizens**
4. **Every user action must feel guided by intelligence**
5. **The system should feel like a forensic expert + strategist is always present**

### Directory Structure

```
equity-builders/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth pages
│   ├── dashboard/         # Protected routes
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── layout/           # Layout components
│   └── [module]/         # Module-specific components
├── lib/                   # Core library code
│   ├── db/               # Database utilities
│   ├── auth/             # Authentication
│   ├── ai/               # ATOS AI integration
│   └── utils/            # Shared utilities
├── types/                 # TypeScript definitions
└── public/               # Static assets
```

### Module Structure

Each major module follows this pattern:

```
module-name/
├── page.tsx              # List/overview page
├── [id]/
│   └── page.tsx          # Detail page
├── new/
│   └── page.tsx          # Create page
└── components/           # Module-specific components
```

---

## Coding Standards

### TypeScript

- **Strict Mode**: Always enabled
- **Type Everything**: No `any` types without justification
- **Interfaces over Types**: Use interfaces for object shapes
- **Explicit Returns**: Always specify return types for functions

```typescript
// ✅ Good
interface User {
  id: string;
  email: string;
  role: UserRole;
}

async function getUserById(id: string): Promise<User | null> {
  return queryOne<User>('SELECT * FROM users WHERE id = $1', [id]);
}

// ❌ Bad
function getUser(id: any) {
  return queryOne('SELECT * FROM users WHERE id = $1', [id]);
}
```

### React Components

- **Functional Components**: Use function declarations
- **Server Components**: Default for Next.js App Router
- **Client Components**: Only when necessary (use `'use client'`)
- **Props Interface**: Always define prop types

```typescript
// ✅ Good
interface PropertyCardProps {
  property: Property;
  onClick?: () => void;
}

export function PropertyCard({ property, onClick }: PropertyCardProps) {
  return (
    <div onClick={onClick}>
      <h3>{property.name}</h3>
    </div>
  );
}

// ❌ Bad
export const PropertyCard = ({ property, onClick }: any) => (
  <div onClick={onClick}>
    <h3>{property.name}</h3>
  </div>
);
```

### Styling

- **Tailwind CSS**: Primary styling method
- **Utility Classes**: Use Tailwind utilities
- **Custom Classes**: Define in `globals.css` for reusable patterns
- **Responsive**: Mobile-first approach

```tsx
// ✅ Good
<div className="forensic-card hover:shadow-forensic transition-all">
  <div className="forensic-card-body">
    <h3 className="text-xl font-bold text-dark-900">{title}</h3>
  </div>
</div>

// ❌ Bad
<div style={{ padding: '20px', borderRadius: '8px' }}>
  <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>{title}</h3>
</div>
```

### Database Queries

- **Parameterized Queries**: Always use parameters to prevent SQL injection
- **Type Safety**: Specify return types
- **Error Handling**: Always wrap in try-catch

```typescript
// ✅ Good
async function getPropertyById(id: string): Promise<Property | null> {
  try {
    return await queryOne<Property>(
      'SELECT * FROM properties WHERE id = $1',
      [id]
    );
  } catch (error) {
    console.error('Failed to fetch property:', error);
    return null;
  }
}

// ❌ Bad
async function getPropertyById(id: string) {
  return await queryOne(`SELECT * FROM properties WHERE id = '${id}'`);
}
```

### Comments

- **Why, Not What**: Explain reasoning, not obvious code
- **Complex Logic**: Always comment complex algorithms
- **TODOs**: Include issue number and brief description

```typescript
// ✅ Good
// Calculate equity gain based on post-repair value minus initial investment
// Accounts for insurance payout to determine true out-of-pocket cost
const equityGain = postRepairValue - (preIncidentValue + outOfPocketExpenses);

// TODO(#123): Implement automated supplement generation
// Should analyze discrepancies and generate justification language

// ❌ Bad
// This function adds two numbers
function add(a: number, b: number): number {
  return a + b; // Return the sum
}
```

---

## Git Workflow

### Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `refactor/description` - Code refactoring
- `docs/description` - Documentation updates

Examples:
- `feature/property-inspection-workflow`
- `fix/authentication-token-expiry`
- `refactor/database-query-optimization`

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting (no code change)
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

Examples:

```
feat(insurance): add scope comparison algorithm

Implement automated scope comparison between forensic assessments
and insurance estimates. Identifies discrepancies by category and
calculates dollar-value impact.

Closes #45
```

```
fix(auth): resolve JWT token expiration issue

Tokens were expiring prematurely due to incorrect time calculation.
Updated to use milliseconds consistently.

Fixes #78
```

### Pull Request Workflow

1. **Create Branch**:
```bash
git checkout -b feature/your-feature-name
```

2. **Make Changes**: Follow coding standards

3. **Commit Frequently**:
```bash
git add .
git commit -m "feat(module): description"
```

4. **Push to Remote**:
```bash
git push origin feature/your-feature-name
```

5. **Open Pull Request**: Include description, screenshots, testing notes

---

## Testing

### Unit Tests

```typescript
// Example: lib/utils/formatCurrency.test.ts
describe('formatCurrency', () => {
  it('formats positive numbers correctly', () => {
    expect(formatCurrency(1234567)).toBe('$1,234,567');
  });

  it('handles zero', () => {
    expect(formatCurrency(0)).toBe('$0');
  });

  it('rounds to nearest dollar', () => {
    expect(formatCurrency(1234.56)).toBe('$1,235');
  });
});
```

Run tests:
```bash
npm test
```

### Integration Tests

Test API routes:

```typescript
// Example: app/api/auth/login.test.ts
describe('POST /api/auth/login', () => {
  it('returns token on valid credentials', async () => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'ValidPassword123'
      })
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.token).toBeDefined();
  });
});
```

### Manual Testing Checklist

Before submitting PR:

- [ ] Feature works on Chrome, Firefox, Safari
- [ ] Responsive design tested on mobile, tablet, desktop
- [ ] Forms validate correctly
- [ ] Error states display properly
- [ ] Loading states implemented
- [ ] Navigation works as expected
- [ ] No console errors or warnings
- [ ] TypeScript compiles without errors

---

## Pull Request Process

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Refactor
- [ ] Documentation

## Testing
- [ ] Unit tests added/updated
- [ ] Manual testing completed
- [ ] All tests passing

## Screenshots
(if applicable)

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

### Review Process

1. **Automated Checks**: Must pass before review
   - TypeScript compilation
   - ESLint
   - Tests

2. **Code Review**: At least one approval required
   - Architecture alignment
   - Code quality
   - Security considerations
   - Performance implications

3. **QA Testing**: For significant features
   - Manual testing by QA team
   - Edge case validation

4. **Merge**: Squash and merge to main

---

## Questions?

- **Technical Questions**: tech@equitybuilders.com
- **Security Issues**: security@equitybuilders.com (private)
- **Documentation**: docs@equitybuilders.com

---

**Thank you for contributing to Equity Builders!**

Your precision and attention to detail help us build a platform worthy of our users' trust.
