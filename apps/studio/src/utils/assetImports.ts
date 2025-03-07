import * as lilNounsAssets from '@noundry/lil-nouns-assets';
import * as nounsAssets from '@noundry/nouns-assets';

const appVariant = import.meta.env.VITE_APP_VARIANT || 'nouns';

export const assetPackage = appVariant === 'lil-nouns' ? lilNounsAssets : nounsAssets;
export const { ImageData, getNounData, getNounSeedFromBlockHash } = assetPackage;

export type { NounSeed } from '@noundry/nouns-assets/dist/types';
