# Noundry Studio

A pixel art editor for creating and customizing Nouns and Lil Nouns.

## App Variants

This application supports multiple variants:

- **Nouns**: The original Nouns editor
- **Lil Nouns**: A variant for Lil Nouns

## Development

To run the application in development mode:

```bash
# Run the Nouns variant
npm run dev:nouns

# Run the Lil Nouns variant
npm run dev:lil-nouns
```

## Building

To build the application for production:

```bash
# Build the Nouns variant
npm run build:nouns

# Build the Lil Nouns variant
npm run build:lil-nouns
```

## Architecture

The application uses a variant-based architecture to support multiple versions with minimal code duplication:

- **Configuration**: Each variant has its own configuration in `src/variants/{variant}/config.ts`
- **Environment Variables**: Environment-specific settings are in `.env.{variant}` files
- **Asset Loading**: Assets are loaded dynamically based on the current variant
- **Variant-Specific Assets**: Each variant has its own assets in `src/variants/{variant}/assets/` (e.g., favicon.ico)

## Adding a New Variant

To add a new variant:

1. Create a new configuration file in `src/variants/{new-variant}/config.ts`
2. Create a new environment file `.env.{new-variant}`
3. Add new build scripts to `package.json`
4. Add variant-specific assets in `src/variants/{new-variant}/assets/` (including favicon.ico)

## Customizing a Variant

To customize an existing variant:

1. Update the variant's configuration in `src/variants/{variant}/config.ts`
2. Update the variant's environment variables in `.env.{variant}`
3. Add any variant-specific components or assets in `src/variants/{variant}/`

Attribution is appreciated but not required.

Fork if you must, but please contribute back to the upstream if you can, so we can all benefit from it ✌.
