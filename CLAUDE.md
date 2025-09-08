# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React Router v7 application for managing Congressional budget data with GraphQL integration. The project focuses on Taiwan legislative budget tracking, including budgets, proposals, committees, meetings, and people data.

## Development Commands

- `pnpm dev` - Start development server with HMR at http://localhost:5173
- `pnpm build` - Build for production  
- `pnpm start` - Start production server
- `pnpm typecheck` - Run type checking with React Router typegen
- `pnpm codegen` - Generate GraphQL types and schema from remote endpoint

## Architecture

### Core Technologies
- **React Router v7** - File-based routing with TypeScript support
- **React Query (@tanstack/react-query)** - Data fetching and caching
- **GraphQL** - API layer with code generation
- **TailwindCSS v4** - Styling with Vite plugin
- **TypeScript** - Full type safety

### Key Configuration
- **SPA Mode**: Server-side rendering disabled (`ssr: false`)
- **GraphQL Endpoint**: `https://ly-budget-gql-dev-1075249966777.asia-east1.run.app/api/graphql`
- **Path Mapping**: `~/*` maps to `./app/*`

### Project Structure
- `app/routes/` - Route components following React Router v7 conventions
- `app/graphql/` - Generated GraphQL types and utilities
- `app/constants/` - Application constants including API endpoints  
- `app/welcome/` - Welcome page components
- `schema.graphql` - Generated GraphQL schema
- `codegen.ts` - GraphQL code generation configuration

### GraphQL Integration
- Uses `@graphql-codegen/client-preset` for type-safe queries
- Generated types in `app/graphql/` directory
- GraphQL plugin (`@0no-co/graphqlsp`) provides IDE integration
- Schema is auto-generated from remote endpoint

### Data Domain
The application manages Taiwan legislative data including:
- **Budgets** - Government budget items with categories and amounts
- **Proposals** - Legislative proposals with freeze/reduction amounts
- **People** - Legislators with party and committee affiliations
- **Committees** - Legislative committees with members
- **Meetings** - Committee meetings with records
- **Terms** - Legislative terms/sessions
- **Recognition** - Image recognition for budget documents

### React Query Setup
- QueryClient configured in root layout
- DevTools enabled for development
- Queries should use generated GraphQL operations

### Styling Approach
- TailwindCSS v4 with Vite plugin integration
- Container-based layouts
- Responsive design patterns
- Inter font family from Google Fonts