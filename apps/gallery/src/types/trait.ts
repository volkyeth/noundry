import { Base64EncodedPng } from "./image";

export type TraitType = "heads" | "glasses" | "accessories" | "bodies";

export interface Trait {
  _id: string;
  nft: Base64EncodedPng;
  name: string;
  type: TraitType;
  trait: Base64EncodedPng;
  address: `0x${string}`;
  background: string;
  body: string;
  head: string;
  accessory: string;
  glasses: string;
  likesCount: number;
  likedBy: `0x${string}`[];
  creationDate: number;
}
