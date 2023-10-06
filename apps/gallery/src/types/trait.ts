export type TraitType = "heads" | "glasses" | "accessories" | "bodies";

export interface Trait {
  id: string;
  nft: string;
  name: string;
  type: TraitType;
  trait: string;
  address: `0x${string}`;
  background: string;
  body: string;
  head: string;
  accessory: string;
  glasses: string;
  likesCount: number;
  creationDate: number;
}
