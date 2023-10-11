export type TraitCategory = "heads" | "glasses" | "accessories" | "bodies";

export type TraitType =
  | "head"
  | "glasses"
  | "accessory"
  | "body"
  | "background";

export interface Trait {
  id: string;
  nft: string;
  name: string;
  type: TraitCategory;
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
