# @noundry/lil-nouns-assets

This is a drop-in replacement for @lilnounsdao/assets. It includes the Noundry-maintained snapshot of Lil Nouns image data, with new package versions published when the asset data is updated.

## Replacing @lilnounsdao/assets

Just install the package:

```bash
npm install @noundry/lil-nouns-assets
```

```bash
yarn add @noundry/lil-nouns-assets
```

```bash
pnpm add @noundry/lil-nouns-assets
```

Uninstall @lilnounsdao/assets

```bash
npm uninstall @lilnounsdao/assets
```

```bash
yarn remove @lilnounsdao/assets
```

```bash
pnpm remove @lilnounsdao/assets
```

Now replace every `@lilnounsdao/assets` import in your app with `@noundry/lil-nouns-assets` and you're good to go

## Use hosted asset data

(Browser only, with no SSR support)

To receive the current Noundry-maintained asset snapshot without requiring package updates or new deployments, you can include the supplementary script in your app:

```html
<script src="https://assets.noundry.wtf/lil-nouns/image-data.js"></script>
```

This script injects the hosted asset data on `window.lilNounsImageData` for `@noundry/lil-nouns-assets` to use.

you should include it before any other scripts, in `html > head`.
that way, the hosted asset data will be available when your app loads. Noundry updates this hosted data manually when the package snapshot is refreshed.

e.g.:

```html
<!-- Depending on your framework, this might be an index.html file, the global layout.tsx, etc -->
<html>
  <head>
    <script src="https://assets.noundry.wtf/lil-nouns/image-data.js" />
    <!-- any other scripts ... -->
  </head>
  <body>
    <!-- the rest of your app... -->
  </body>
</html>
```

For debug purposes, you can also get the prettified version on https://assets.noundry.wtf/lil-nouns/image-data.json

## Development

### Install dependencies

```sh
pnpm
```

### Update image data

Fetch the current onchain trait counts, verify trait names, and regenerate `src/image-data.json`:

```sh
pnpm --filter @noundry/lil-nouns-assets update:image-data
```

The command uses the trait names in `packages/noggles/src/lil-nouns/traitNames.json`. It first fetches onchain trait counts. If new onchain traits do not have names yet, it appends placeholder names such as `head-256` to `traitNames.json` and stops. Replace those placeholders with real trait names, then rerun the command. It will only fetch full artwork and update `src/image-data.json` after the trait-name counts match onchain counts and no placeholders remain.

You can set `ETH_RPC_URL`, `MAINNET_RPC_URL`, `ALCHEMY_API_KEY`, or `NEXT_PUBLIC_ALCHEMY_API_KEY` if you want to use a specific mainnet RPC provider.

## Usage

**Access Noun RLE Image Data**

```ts
import { ImageData } from "@noundry/lil-nouns-assets";

const { bgcolors, palette, images } = ImageData;
const { bodies, accessories, heads, glasses } = images;
```

**Get Noun Part & Background Data**

```ts
import { getNounData } from "@noundry/lil-nouns-assets";

const seed = {
  background: 0,
  body: 17,
  accessory: 41,
  head: 71,
  glasses: 2,
};
const { parts, background } = getNounData(seed);
```

**Emulate `NounSeeder.sol` Pseudorandom seed generation**

```ts
import { getNounSeedFromBlockHash } from "@noundry/lil-nouns-assets";

const blockHash =
  "0x5014101691e81d79a2eba711e698118e1a90c9be7acb2f40d7f200134ee53e01";
const nounId = 116;

/**
 {
    background: 1,
    body: 28,
    accessory: 120,
    head: 95,
    glasses: 15
  }
*/
const seed = getNounSeedFromBlockHash(nounId, blockHash);
```

## Examples

**Almost off-chain Noun Crystal Ball**
Generate a Noun using only a block hash, which saves calls to `NounSeeder` and `NounDescriptor` contracts. This can be used for a faster crystal ball.

```ts
/**
 * For you to implement:
   - hook up providers with ether/web3.js
   - get currently auctioned Noun Id from the NounsAuctionHouse contract
   - add 1 to the current Noun Id to get the next Noun Id (named `nextNounId` below)
   - get the latest block hash from your provider (named `latestBlockHash` below)
*/

import {
  ImageData,
  getNounSeedFromBlockHash,
  getNounData,
} from "@noundry/lil-nouns-assets";
import { buildSVG } from "@lilnounsdao/sdk";
const { palette } = ImageData; // Used with `buildSVG``

/**
 * OUTPUT:
   {
      background: 1,
      body: 28,
      accessory: 120,
      head: 95,
      glasses: 15
    }
*/
const seed = getNounSeedFromBlockHash(nextNounId, latestBlockHash);

/** 
 * OUTPUT:
   {
     parts: [
       {
         filename: 'body-teal',
         data: '...'
       },
       {
         filename: 'accessory-txt-noun-multicolor',
         data: '...'
       },
       {
         filename: 'head-goat',
         data: '...'
       },
       {
         filename: 'glasses-square-red',
         data: '...'
       }
     ],
     background: 'e1d7d5'
   }
*/
const { parts, background } = getNounData(seed);

const svgBinary = buildSVG(parts, palette, background);
const svgBase64 = btoa(svgBinary);
```

The Noun SVG can then be displayed. Here's a dummy example using React

```ts
function SVG({ svgBase64 }) {
  return <img src={`data:image/svg+xml;base64,${svgBase64}`} />;
}
```
