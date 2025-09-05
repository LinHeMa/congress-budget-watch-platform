# PRP: Setup GraphQL Query and Code Generation

## Objective
Implement comprehensive GraphQL integration for the Congress Budget Watch Platform with Apollo Client and TypeScript code generation, replacing the current basic fetch approach.

## Current State Analysis

### Existing Implementation
- **Current GraphQL usage**: Basic fetch in `app/page.tsx:4-13`
- **Endpoint**: `https://ly-budget-gql-dev-1075249966777.asia-east1.run.app/api/graphql`
- **Tech Stack**: Next.js 15.5.2 App Router, TypeScript, React 19, Tailwind CSS v4
- **Package Manager**: pnpm (specified requirement)
- **Current Approach**: Manual fetch with hardcoded endpoint

### Code Pattern Analysis
- Uses Next.js App Router with server components
- TypeScript configuration supports path aliases (`@/*` maps to root)
- No existing test infrastructure detected
- ESLint configured with Next.js TypeScript rules

## Technical Requirements

### Primary Goals
1. Setup GraphQL client (Apollo Client) for Next.js App Router
2. Implement GraphQL Code Generator for TypeScript types
3. Replace existing fetch implementation with typed queries
4. Maintain pnpm package manager usage

### Critical Documentation References
- **Next.js GraphQL Integration**: https://daily.dev/blog/next-js-graphql-integration-basics
- **GraphQL Codegen Installation**: https://the-guild.dev/graphql/codegen/docs/getting-started/installation
- **GraphQL Codegen Workflow**: https://the-guild.dev/graphql/codegen/docs/getting-started/development-workflow
- **Apollo Next.js 14+ Support**: Use `@apollo/experimental-nextjs-app-support` package

## Implementation Blueprint

### Phase 1: Dependencies and Client Setup

#### Required Packages
```bash
pnpm add @apollo/client graphql @apollo/experimental-nextjs-app-support
pnpm add -D @graphql-codegen/cli @graphql-codegen/typescript @graphql-codegen/typescript-operations @graphql-codegen/typescript-react-apollo typescript @parcel/watcher
```

#### Apollo Client Configuration
Create `lib/apollo-client.ts`:
```typescript
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { registerApolloClient } from "@apollo/experimental-nextjs-app-support";

export const { getClient } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache({ addTypename: false }),
    link: new HttpLink({
      uri: "https://ly-budget-gql-dev-1075249966777.asia-east1.run.app/api/graphql",
    }),
  });
});
```

### Phase 2: GraphQL Code Generator Setup

#### Configuration File
Create `codegen.ts` in root:
```typescript
import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: 'https://ly-budget-gql-dev-1075249966777.asia-east1.run.app/api/graphql',
  documents: [
    'graphql/**/*.graphql',
    'app/**/*.tsx'
  ],
  generates: {
    'generated/graphql.tsx': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-apollo'
      ],
      config: {
        reactApolloVersion: 3,
        withHooks: true,
        withHOC: false
      }
    }
  },
  hooks: {
    afterAllFileWrite: ['pnpm lint --fix']
  }
}

export default config
```

#### Package.json Scripts
Add to `package.json` scripts:
```json
{
  "scripts": {
    "generate": "graphql-codegen",
    "generate:watch": "graphql-codegen --watch",
    "predev": "pnpm generate"
  }
}
```

### Phase 3: Query Structure Setup

#### Directory Structure
```
├── graphql/
│   ├── queries/
│   │   └── budget.graphql
│   └── mutations/
├── generated/
│   └── graphql.tsx      # Generated types and hooks
├── lib/
│   └── apollo-client.ts # Apollo client config
```

#### Sample Query File
Create `graphql/queries/budget.graphql`:
```graphql
query GetBudgetData {
  # Add actual query fields based on schema
  budgetData {
    id
    title
    amount
  }
}
```

### Phase 4: Integration with Existing Code

#### Replace Current Implementation
Update `app/page.tsx` from basic fetch to typed Apollo:
```typescript
import { getClient } from "@/lib/apollo-client";
import { GetBudgetDataDocument } from "@/generated/graphql";

export default async function Home() {
  const client = getClient();
  const { data } = await client.query({
    query: GetBudgetDataDocument,
  });
  
  // Use typed data instead of manual fetch
  return (
    // existing JSX with typed data
  );
}
```

## Validation Gates

### Syntax and Type Checking
```bash
# TypeScript compilation check
pnpm build

# ESLint validation
pnpm lint

# Code generation validation
pnpm generate
```

### Functional Validation
```bash
# Development server startup
pnpm dev

# Verify GraphQL endpoint connectivity
curl -X POST https://ly-budget-gql-dev-1075249966777.asia-east1.run.app/api/graphql \
  -H "Content-Type: application/json" \
  -H "x-apollo-operation-name: Query" \
  -d '{"query": "query { __typename }"}'
```

## Critical Gotchas and Considerations

### Next.js App Router Compatibility
- **CRITICAL**: Must use `@apollo/experimental-nextjs-app-support` for Next.js 14+ App Router
- Use `getClient()` for server components, not traditional `useQuery` hooks
- Server components require different Apollo patterns than client components

### Code Generation Workflow
- Run `pnpm generate` before starting development server
- Use `--watch` flag during active development
- Generated files should be gitignored or committed based on team preference

### GraphQL Schema Access
- Ensure GraphQL endpoint is accessible for introspection during build
- Consider schema caching for CI/CD environments
- Handle authentication if endpoint requires it

### Performance Considerations
- Apollo's `InMemoryCache` is optimized for single-user scenarios
- Use `addTypename: false` to reduce cache overhead for simple queries
- Consider request batching for multiple operations

## File Structure After Implementation

```
congress-budget-watch-platform/
├── app/
│   ├── page.tsx              # Updated with Apollo queries
│   └── layout.tsx            # Potentially add ApolloProvider
├── lib/
│   └── apollo-client.ts      # Apollo client configuration
├── graphql/
│   ├── queries/
│   │   └── budget.graphql    # GraphQL query definitions
│   └── mutations/            # Future mutations
├── generated/
│   └── graphql.tsx          # Auto-generated types and hooks
├── codegen.ts               # Code generation configuration
└── package.json             # Updated with new scripts and dependencies
```

## Implementation Tasks (Sequential Order)

1. **Install Dependencies**
   - Add Apollo Client packages with Next.js support
   - Add GraphQL Code Generator dependencies

2. **Configure Apollo Client**
   - Create `lib/apollo-client.ts` with registerApolloClient
   - Configure cache and HTTP link with existing endpoint

3. **Setup Code Generation**
   - Create `codegen.ts` configuration file
   - Add package.json scripts for generation
   - Create graphql directory structure

4. **Define Initial Queries**
   - Create sample query file based on existing endpoint usage
   - Run code generation to create types

5. **Update Existing Implementation**
   - Replace fetch logic in `app/page.tsx` with Apollo client
   - Implement typed query usage

6. **Validation and Testing**
   - Run all validation gates
   - Test development server startup
   - Verify type safety in IDE

## Success Metrics

- [ ] All TypeScript compilation passes without errors
- [ ] GraphQL queries are fully typed in IDE
- [ ] Development server starts without issues
- [ ] Code generation produces valid TypeScript files
- [ ] Existing functionality maintained with improved type safety
- [ ] ESLint passes without GraphQL-related errors

## Confidence Score: 9/10

**Justification**: This PRP provides comprehensive context including:
- Detailed current state analysis with specific file references
- Complete dependency requirements with version considerations
- Step-by-step implementation with actual code examples
- Critical gotchas specific to Next.js App Router and GraphQL
- Executable validation gates
- Clear success metrics

The implementation should succeed in one pass due to the thorough research and specific configuration examples provided. The only uncertainty (1 point deduction) is the exact GraphQL schema structure, which may require minor adjustments to query definitions.