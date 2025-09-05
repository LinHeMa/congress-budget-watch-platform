# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

This project uses pnpm as the package manager:

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build for production with Turbopack
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Architecture

Congress Budget Watch Platform is a Next.js 15 application with TypeScript and Tailwind CSS.

**Key Structure:**
- Uses Next.js App Router (app/ directory)
- TypeScript with strict configuration
- ESLint with Next.js configuration
- Tailwind CSS v4 for styling
- Font optimization with Geist fonts

**GraphQL Integration:**
- Current GraphQL endpoint: `https://ly-budget-gql-dev-1075249966777.asia-east1.run.app/api/graphql`
- Planned features include GraphQL code generation for TypeScript (see FEATs/setup-gql-query.md)
- Uses basic fetch for GraphQL queries in app/page.tsx:4-13

**Project Setup:**
- Path aliases configured: `@/*` maps to root directory
- React 19 and Next.js 15.5.2
- Development uses Turbopack for faster builds