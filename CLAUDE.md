# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Noundry is a monorepo containing three main applications for the Nouns and Lil Nouns ecosystems:

- **Assets** (`/apps/assets`): Next.js API service providing latest onchain artwork data
- **Gallery** (`/apps/gallery`): Next.js platform for showcasing and proposing community-made traits
- **Studio** (`/apps/studio`): Vite + React pixel art editor for creating Nouns traits

The project uses a variant-based architecture supporting both Nouns and Lil Nouns with shared code.

## Development Commands

### Root Level
```bash
pnpm build          # Build all apps using Turbo
```

### Gallery App (Primary Development Target)
```bash
# Development - use variant-specific commands
pnpm dev:nouns             # Nouns variant (default)
pnpm dev:lil-nouns         # Lil Nouns variant

# Building
pnpm build:nouns           # Build Nouns variant
pnpm build:lil-nouns       # Build Lil Nouns variant

# Quality Tools
pnpm check                 # TypeScript type checking
pnpm lint                  # ESLint
pnpm test                  # Vitest testing

# Production
pnpm start:nouns           # Start Nouns production server
pnpm start:lil-nouns       # Start Lil Nouns production server
```

### Studio App
```bash
# Development
pnpm dev:nouns             # Nouns variant
pnpm dev:lil-nouns         # Lil Nouns variant

# Building
pnpm build:nouns           # Build Nouns variant
pnpm build:lil-nouns       # Build Lil Nouns variant
```

### Assets App
```bash
pnpm dev                   # Development server
pnpm build                 # Production build
pnpm lint                  # ESLint
```

## Architecture

### Variant System
All apps support multiple variants through:
- Environment files: `.env.nouns.local`, `.env.lil-nouns.local`
- Variant configurations in `src/variants/{variant}/config.ts`
- Variant-specific assets in `src/variants/{variant}/assets/`
- Environment variable: `NEXT_PUBLIC_APP_VARIANT`

### Package Structure
- **Monorepo**: Uses pnpm workspaces with Turbo for build orchestration
- **Shared Packages**: `noggles`, `nouns-assets`, `lil-nouns-assets` in `/packages`
- **Dependencies**: Apps depend on shared packages using `workspace:^` protocol

### Technology Stack
- **Gallery**: Next.js 14, MongoDB, NextUI, TanStack Query, Wagmi/Viem, ConnectKit
- **Studio**: Vite, React, Chakra UI, Zustand, Canvas-based editing
- **Assets**: Next.js 14, serves artwork data as API endpoints

### Testing & Quality
- **Testing**: Vitest with JSdom environment (Gallery app)
- **Type Checking**: Use `pnpm check` in Gallery app, `pnpm tsc --noEmit` in Studio app for TypeScript validation
- **Linting**: ESLint with Next.js configuration across all apps
- **Styling**: Tailwind CSS with variant-specific themes

## Key Patterns

### Adding New Variants
1. Add variant to `AppVariant` type in relevant `src/config.ts`
2. Create `src/variants/{new-variant}/` directory structure
3. Add `config.ts`, `theme.ts`, and variant-specific components
4. Create environment file and add scripts to `package.json`

### Deployment & Build
- Use Turbo's dependency-aware builds with `pnpm build`
- Variant-specific builds use environment files with `env-cmd`
- Studio uses Vite modes (`--mode nouns`) instead of environment files

### Database & External APIs
- Gallery app uses MongoDB with schemas in `src/db/schema/`
- Web3 integration via Wagmi/Viem with public clients
- Social API integrations: Discord, Twitter, Farcaster

## File Organization

### Gallery App Structure
- `src/variants/{variant}/`: Variant-specific code and assets
- `src/components/`: Shared React components
- `src/hooks/`: Custom React hooks
- `src/utils/`: Utility functions organized by domain
- `src/app/`: Next.js 13+ app router structure

### Studio App Structure
- `src/model/`: Core application models (Workspace, Brush, etc.)
- `src/tools/`: Pixel art editing tools
- `src/components/`: React components organized by feature
- `src/variants/{variant}/`: Variant-specific configurations

### Package Development
When working with shared packages, ensure proper workspace dependencies and rebuild packages before testing changes in apps.