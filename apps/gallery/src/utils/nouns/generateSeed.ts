import { NounSeed } from "@/types/noun";
import { OnchainArtwork } from "noggles";
import seedrandom from "seedrandom";

export const generateSeed = (
  onchainArtwork: OnchainArtwork,
  seed: number
): NounSeed => {
  const random = seedrandom(seed.toString());
  return {
    glasses: Math.floor(random() * onchainArtwork.glasses.length),
    head: Math.floor(random() * onchainArtwork.heads.length),
    accessory: Math.floor(random() * onchainArtwork.accessories.length),
    body: Math.floor(random() * onchainArtwork.bodies.length),
    background: Math.floor(random() * onchainArtwork.backgrounds.length),
  };
};
