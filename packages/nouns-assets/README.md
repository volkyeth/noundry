# @noundry/nouns-assets

This is a drop-in replacement for @nouns/assets. It includes the Noundry-maintained snapshot of Nouns image data, with new package versions published when the asset data is updated.

## Replacing @nouns/assets

Just install the package:

```bash
npm install @noundry/nouns-assets
```

```bash
yarn add @noundry/nouns-assets
```

```bash
pnpm add @noundry/nouns-assets
```

Uninstall @nouns/assets

```bash
npm uninstall @nouns/assets
```

```bash
yarn remove @nouns/assets
```

```bash
pnpm remove @nouns/assets
```

Now replace every `@nouns/assets` import in your app with `@noundry/nouns-assets` and you're good to go

## Use hosted asset data

(Browser only, with no SSR support)

To receive the current Noundry-maintained asset snapshot without requiring package updates or new deployments, you can include the supplementary script in your app:

```html
<script src="https://assets.noundry.wtf/nouns/image-data.js"></script>
```

This script injects the hosted asset data on `window.nounsImageData` for `@noundry/nouns-assets` to use.

you should include it before any other scripts, in `html > head`.
that way, the hosted asset data will be available when your app loads. Noundry updates this hosted data manually when the package snapshot is refreshed.

e.g.:

```html
<!-- Depending on your framework, this might be an index.html file, the global layout.tsx, etc -->
<html>
  <head>
    <script src="https://assets.noundry.wtf/nouns/image-data.js" />
    <!-- any other scripts ... -->
  </head>
  <body>
    <!-- the rest of your app... -->
  </body>
</html>
```

For debug purposes, you can also get the prettified version on https://assets.noundry.wtf/nouns/image-data.json

## Development

### Install dependencies

```sh
pnpm
```

### Update image data

Fetch the current onchain trait counts, verify trait names, and regenerate `src/image-data.json`:

```sh
pnpm --filter @noundry/nouns-assets update:image-data
```

The command uses the trait names in `packages/noggles/src/nouns/traitNames.json`. It first fetches onchain trait counts. If new onchain traits do not have names yet, it appends placeholder names such as `head-256` to `traitNames.json` and stops. Replace those placeholders with real trait names, then rerun the command. It will only fetch full artwork after the trait-name counts match onchain counts and no placeholders remain. If the generated `src/image-data.json` differs from the existing snapshot, the package patch version is bumped automatically.

### Update image data from a queued proposal

Preemptively append queued descriptor traits from a Nouns proposal before execution:

```sh
pnpm --filter @noundry/nouns-assets update:image-data:proposal 966
```

This command:

- requires the proposal to be in the `Queued` state
- reads the proposal actions from the Nouns governor onchain
- extracts supported descriptor calls: `addAccessories`, `addBodies`, `addHeads`, and `addGlasses`
- inflates and validates the proposed artwork payload before merging it
- checks `packages/noggles/src/nouns/traitNames.json` against the projected post-proposal counts, adding placeholders and stopping if names are still missing
- preserves any already-appended pending traits that are present in the current `src/image-data.json`

If the merged `src/image-data.json` differs from the current snapshot, the package patch version is bumped automatically.

You can set `ETH_RPC_URL`, `MAINNET_RPC_URL`, `ALCHEMY_API_KEY`, or `NEXT_PUBLIC_ALCHEMY_API_KEY` if you want to use a specific mainnet RPC provider.

## Usage

**Access Noun RLE Image Data**

```ts
import { ImageData } from "@noundry/nouns-assets";

const { bgcolors, palette, images } = ImageData;
const { bodies, accessories, heads, glasses } = images;
```

**Get Noun Part & Background Data**

```ts
import { getNounData } from "@noundry/nouns-assets";

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
import { getNounSeedFromBlockHash } from "@noundry/nouns-assets";

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
} from "@noundry/nouns-assets";
import { buildSVG } from "@nouns/sdk";
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
