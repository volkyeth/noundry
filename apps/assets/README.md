# noundry/assets

This API provides the Noundry-maintained Nouns and Lil Nouns image-data snapshots. Use it to receive hosted asset updates without requiring package updates and new deployments in your own app.

## Nouns

Use with [@noundry/nouns-assets](https://github.com/volkyeth/noundry/tree/main/packages/nouns-assets), which is a drop-in replacement for @nouns/assets

[/nouns/image-data.js](https://assets.noundry.wtf/nouns/image-data.js) provides a js script you can load up using a `<script/>` tag in your page, which loads the hosted asset data to the var `window.nounsImageData`. It's intended to be used with `@noundry/nouns-assets`, which reads the artwork from that variable when it's available.

[/nouns/image-data.json](https://assets.noundry.wtf/nouns/image-data.json) provides the same data, but as an prettified json. Mostly for debug purposes

## Lil Nouns

Use with [@noundry/lil-nouns-assets](https://github.com/volkyeth/noundry/tree/main/packages/lil-nouns-assets), which is a drop-in replacement for @lilnounsdao/assets

[/lil-nouns/image-data.js](https://assets.noundry.wtf/lil-nouns/image-data.js) provides a js script you can load up using a `<script/>` tag in your page, which loads the hosted asset data to the var `window.lilNounsImageData`. It's intended to be used with `@noundry/lil-nouns-assets`, which reads the artwork from that variable when it's available.

[/lil-nouns/image-data.json](https://assets.noundry.wtf/lil-nouns/image-data.json) provides the same data, but as an prettified json. Mostly for debug purposes

## Updating the hosted snapshots

Regenerate the package snapshots before redeploying this API:

```sh
pnpm update:image-data
```

This command uses trait names from `packages/noggles`. It first checks onchain trait counts. If new traits do not have names yet, it appends placeholder names to the matching `traitNames.json` file and stops. Replace the placeholders with real names, then rerun the command before committing. Full image data is only regenerated after counts match and no placeholders remain. When regenerated image data differs from the existing snapshot, the matching package patch version is bumped automatically.
