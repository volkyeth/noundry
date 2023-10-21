import {
  EncodedTrait,
  HexColor,
  NounSeed,
  NounTraits,
  OnchainArtwork,
} from "noggles";

export const getTraitsFromSeed = (
  seed: NounSeed,
  onchainArtwork: OnchainArtwork
): NounTraits => {
  return {
    glasses: onchainArtwork.glasses[seed.glasses] as EncodedTrait,
    head: onchainArtwork.heads[seed.head] as EncodedTrait,
    accessory: onchainArtwork.accessories[seed.accessory] as EncodedTrait,
    body: onchainArtwork.bodies[seed.body] as EncodedTrait,
    background: onchainArtwork.backgrounds[seed.background] as HexColor,
  };
};
