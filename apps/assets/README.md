# noundry/assets

This API provides the latest version of the nouns image-data.json, produced directly from the onchain Nouns DAO artwork. Use it to keep your app always in sync with the contracts, without requiring package updates and new deployments when new traits are pushed to the DAO

It's best paired up with [@noundry/nouns-assets](https://github.com/volkyeth/noundry/tree/main/packages/nouns-assets), which is a drop-in replacement for @nouns/assets

## endpoints

[/nouns/image-data.js](https://assets.noundry.wtf/nouns/image-data.js) provides a js script you can load up using a `<script/>` tag in your page, which loads up all the artwork to the var `window.nounsImageData`. It's intended to be used with `@noundry/nouns-assets`, which reads the artwork from that variable when it's available.

[/nouns/image-data.json](https://assets.noundry.wtf/nouns/image-data.json) provides the same data, but as an prettified json. Mostly for debug purposes
