# Noundry Gallery

Noundry Gallery is a platform to showcase and propose community-made traits to the Nouns and Lil Nouns ecosystems.

## App Variants

The gallery supports multiple "variants" to target different Noun communities with a single codebase. Currently supported variants are:

- `nouns` - The main Nouns variant
- `lil-nouns` - The Lil Nouns variant

### How to Use Variants

#### Development

To run a specific variant in development mode:

```bash
# Run the Nouns variant (default)
pnpm run dev
# or
pnpm run dev:nouns

# Run the Lil Nouns variant
pnpm run dev:lil-nouns
```

#### Building

To build a specific variant:

```bash
# Build the Nouns variant (default)
pnpm run build
# or
pnpm run build:nouns

# Build the Lil Nouns variant
pnpm run build:lil-nouns
```

#### Starting Production Server

To start the production server for a specific variant:

```bash
# Start with Nouns variant
pnpm run start:nouns

# Start with Lil Nouns variant
pnpm run start:lil-nouns
```

### Variant-specific Code

Variant-specific code and assets are stored in the `src/variants/[variant-name]` directory. Currently, this includes:

- `config.ts` - Variant-specific configuration
- `theme.ts` - Variant-specific theme colors
- `assets/` - Variant-specific assets like logos
- `components/` - Variant-specific component implementations
  - `Navbar.tsx` - Variant-specific navigation bar with custom links and styling

### Variant-specific Theming

Each variant has its own theme configuration, including:

- Primary color palette
- Logo
- Navigation links
- Other visual elements

The theme is defined in the variant's config file and is automatically applied throughout the application.

### Adding New Variants

To add a new variant:

1. Add the variant name to the `AppVariant` type in `src/config.ts`
2. Create a new directory in `src/variants/[your-variant-name]`
3. Create a `config.ts` file with the appropriate configuration, including theme colors
4. Create a `theme.ts` file with the theme colors for Tailwind
5. Create a `components/Navbar.tsx` file with variant-specific navigation
6. Add any other variant-specific assets and components
7. Add new scripts to package.json to support the variant

## Environment Variables

- `NEXT_PUBLIC_APP_VARIANT` - The active app variant (`nouns` or `lil-nouns`)
