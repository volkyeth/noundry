export type TraitType =
  | "glasses"
  | "head"
  | "accessory"
  | "body"
  | "background";

export type TraitCategory =
  | "heads"
  | "glasses"
  | "accessories"
  | "bodies"
  | "backgrounds";

export interface TraitNames {
  backgrounds: string[];
  bodies: string[];
  accessories: string[];
  heads: string[];
  glasses: string[];
}